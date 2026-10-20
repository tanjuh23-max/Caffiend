"""
Cafify TikTok video generator.

Turns a small JSON spec into a 1080x1920, 30fps MP4 (~13s):
  1. Hook      - the feeling, no caffeine mentioned (word-by-word pop-in)
  2. Reveal    - "it's the <drink> you had at <time>" + a live caffeine curve
                 drawing from the drink time to bedtime, with the mg still
                 active at bedtime called out
  3. Payoff    - one-line takeaway + "see your own curve -> cafify.app"

Usage:
  python3 tiktok/make_video.py spec.json out.mp4

Spec fields (all strings unless noted):
  hook        "why you can't sleep even when you're exhausted"
  reveal      "it's the coffee you had at 3pm"
  drink       "large coffee"            (label on the chart)
  mg          200        (int, dose)
  start_hour  15         (24h clock, float ok: 15.5 = 3:30pm)
  bed_hour    23         (24h clock; may be < start_hour for after midnight)
  payoff      "half of it is still in you at bedtime"
  half_life   5.7        (optional, hours)

Needs: Pillow, ffmpeg on PATH, Inter font (falls back to DejaVu).
"""
import json
import math
import os
import subprocess
import sys

from PIL import Image, ImageDraw, ImageFont

W, H, FPS = 1080, 1920, 30
BG = (6, 6, 8)
FG = (245, 245, 245)
MUTED = (150, 150, 158)
AMBER = (245, 158, 11)
AMBER_SOFT = (245, 158, 11, 60)
RED = (248, 113, 113)
GRID = (42, 42, 46)

# TikTok overlays its UI on the bottom ~22% and the right edge; keep text clear.
SAFE_L, SAFE_R, SAFE_TOP, SAFE_BOTTOM = 80, W - 150, 270, H - 470

FONT_DIRS = ['/usr/share/fonts/opentype/inter', '/usr/share/fonts/truetype/inter',
             os.path.join(os.path.dirname(__file__), 'fonts')]


def font(weight, size):
    for d in FONT_DIRS:
        p = os.path.join(d, f'Inter-{weight}.otf')
        if os.path.exists(p):
            return ImageFont.truetype(p, size)
        p = os.path.join(d, f'Inter-{weight}.ttf')
        if os.path.exists(p):
            return ImageFont.truetype(p, size)
    fallback = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
    return ImageFont.truetype(fallback, size)


def ease_out(t):
    t = max(0.0, min(1.0, t))
    return 1 - (1 - t) ** 3


def wrap(draw, text, fnt, max_w):
    words, lines, cur = text.split(), [], ''
    for w in words:
        trial = (cur + ' ' + w).strip()
        if draw.textlength(trial, font=fnt) <= max_w:
            cur = trial
        else:
            if cur:
                lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines


def fit_font(draw, text, weight, max_w, max_lines, start, minimum):
    size = start
    while size > minimum:
        f = font(weight, size)
        if len(wrap(draw, text, f, max_w)) <= max_lines:
            return f
        size -= 4
    return font(weight, minimum)


def clock(h):
    h = h % 24
    hh = int(h)
    mm = int(round((h - hh) * 60))
    if mm == 60:
        hh, mm = hh + 1, 0
    suffix = 'am' if hh % 24 < 12 else 'pm'
    h12 = hh % 12 or 12
    return f'{h12}{suffix}' if mm == 0 else f'{h12}:{mm:02d}{suffix}'


def level(t_hours, mg, half_life, ka_minutes=45):
    """One-compartment oral model: absorption then exponential elimination."""
    if t_hours <= 0:
        return 0.0
    ke = math.log(2) / half_life
    ka = 4.6 / (ka_minutes / 60)  # ~99% absorbed by ka_minutes
    if abs(ka - ke) < 1e-6:
        return mg * ke * t_hours * math.exp(-ke * t_hours)
    return mg * ka / (ka - ke) * (math.exp(-ke * t_hours) - math.exp(-ka * t_hours))


def draw_words(img, text, fnt, color, top, progress, line_gap=1.18, align='left'):
    """Pop words in one by one; progress 0..1 across all words."""
    d = ImageDraw.Draw(img)
    lines = wrap(d, text, fnt, SAFE_R - SAFE_L)
    total = sum(len(l.split()) for l in lines)
    shown = progress * total
    y = top
    idx = 0
    lh = int(fnt.size * line_gap)
    for line in lines:
        x = SAFE_L
        if align == 'center':
            x = (W - d.textlength(line, font=fnt)) // 2
        for w in line.split():
            k = max(0.0, min(1.0, shown - idx))
            if k > 0:
                a = int(255 * ease_out(k))
                dy = int(24 * (1 - ease_out(k)))
                layer = Image.new('RGBA', img.size, (0, 0, 0, 0))
                ImageDraw.Draw(layer).text((x, y + dy), w, font=fnt, fill=color + (a,))
                img.alpha_composite(layer)
            x += d.textlength(w + ' ', font=fnt)
            idx += 1
        y += lh
    return y


def brand(img, alpha=255):
    d = ImageDraw.Draw(img)
    f = font('ExtraBold', 44)
    d.text((SAFE_L, 205), 'cafify', font=f, fill=AMBER + (alpha,))


def render(spec, out_path):
    mg = int(spec['mg'])
    hl = float(spec.get('half_life', 5.7))
    start = float(spec['start_hour'])
    bed = float(spec['bed_hour'])
    if bed <= start:
        bed += 24
    span = bed - start
    end = bed + 2  # show a little past bedtime
    bed_mg = level(span, mg, hl)
    peak_t = max(range(1, 400), key=lambda i: level(i / 100, mg, hl)) / 100
    peak_mg = level(peak_t, mg, hl)
    nums = {'bed_mg': round(bed_mg), 'peak_mg': round(peak_mg), 'mg': mg,
            'start': clock(start), 'bed': clock(bed)}
    spec = dict(spec)
    for key in ('hook', 'reveal', 'payoff', 'caption'):
        if key in spec:
            spec[key] = spec[key].format(**nums)

    scratch = Image.new('RGBA', (W, H))
    sd = ImageDraw.Draw(scratch)
    hook_f = fit_font(sd, spec['hook'], 'Black', SAFE_R - SAFE_L, 5, 104, 64)
    reveal_f = fit_font(sd, spec['reveal'], 'ExtraBold', SAFE_R - SAFE_L, 3, 76, 52)
    payoff_f = fit_font(sd, spec['payoff'], 'Black', SAFE_R - SAFE_L, 4, 88, 56)

    # Timeline (seconds)
    T_HOOK, T_REVEAL, T_PAYOFF, T_END = 0.0, 3.4, 9.0, 13.0
    n_frames = int(T_END * FPS)

    # Chart geometry
    cx0, cx1 = SAFE_L + 20, SAFE_R - 10
    cy0, cy1 = 760, 1330  # top, bottom of plot area
    y_max = max(peak_mg * 1.15, 50)

    def px(hours_from_start):
        return cx0 + (cx1 - cx0) * hours_from_start / (end - start)

    def py(m):
        return cy1 - (cy1 - cy0) * m / y_max

    curve = [(px(i / 20), py(level(i / 20, mg, hl))) for i in range(int((end - start) * 20) + 1)]

    ff = subprocess.Popen(
        ['ffmpeg', '-y', '-loglevel', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgb24',
         '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-',
         '-f', 'lavfi', '-i', 'anullsrc=r=44100:cl=stereo',
         '-shortest', '-c:v', 'libx264', '-preset', 'medium', '-crf', '18',
         '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '128k', '-movflags', '+faststart',
         out_path],
        stdin=subprocess.PIPE)

    label_f = font('SemiBold', 34)
    small_f = font('Medium', 30)
    big_num_f = font('Black', 120)
    cta_f = font('ExtraBold', 56)

    for i in range(n_frames):
        t = i / FPS
        img = Image.new('RGBA', (W, H), BG + (255,))
        d = ImageDraw.Draw(img)
        brand(img)

        if t < T_REVEAL:
            p = (t - 0.15) / 1.9
            draw_words(img, spec['hook'], hook_f, FG, 520, max(0, p))
        elif t < T_PAYOFF:
            lt = t - T_REVEAL
            y_after = draw_words(img, spec['reveal'], reveal_f, AMBER, SAFE_TOP + 80, lt / 0.9)

            # Grid + axis labels
            ga = int(255 * ease_out(lt / 0.5))
            for k in range(5):
                gy = cy0 + (cy1 - cy0) * k / 4
                d.line([(cx0, gy), (cx1, gy)], fill=GRID + (ga,), width=2)
            hour_step = 3 if (end - start) > 9 else 2
            h = math.ceil(start)
            while h <= end:
                gx = px(h - start)
                lab = clock(h)
                d.text((gx - d.textlength(lab, font=small_f) / 2, cy1 + 18), lab, font=small_f, fill=MUTED + (ga,))
                h += hour_step

            # Bedtime marker
            bx = px(span)
            for yy in range(cy0 - 30, cy1, 18):
                d.line([(bx, yy), (bx, yy + 9)], fill=RED + (ga,), width=3)
            bl = f'bedtime {clock(bed)}'
            d.text((min(bx - d.textlength(bl, font=label_f) / 2, cx1 - d.textlength(bl, font=label_f)), cy0 - 80),
                   bl, font=label_f, fill=RED + (ga,))

            # Curve draws in over ~3.2s
            dp = ease_out((lt - 0.5) / 3.2)
            n = max(2, int(len(curve) * dp))
            pts = curve[:n]
            if len(pts) >= 2:
                fill_layer = Image.new('RGBA', img.size, (0, 0, 0, 0))
                ImageDraw.Draw(fill_layer).polygon(pts + [(pts[-1][0], cy1), (pts[0][0], cy1)], fill=AMBER_SOFT)
                img.alpha_composite(fill_layer)
                d = ImageDraw.Draw(img)
                d.line(pts, fill=AMBER, width=9, joint='curve')
                hx, hy = pts[-1]
                d.ellipse([hx - 14, hy - 14, hx + 14, hy + 14], fill=AMBER)

            # Drink label at the start
            dl = f"{spec.get('drink', 'coffee')} · {mg}mg · {clock(start)}"
            d.text((cx0, cy1 + 70), dl, font=label_f, fill=FG + (ga,))

            # Callout once the curve reaches bedtime
            ct = (lt - 3.9) / 0.6
            if ct > 0:
                a = int(255 * ease_out(ct))
                num = f'{round(bed_mg)}mg'
                d.text((SAFE_L, cy1 + 150), num, font=big_num_f, fill=AMBER + (a,))
                d.text((SAFE_L + d.textlength(num, font=big_num_f) + 24, cy1 + 205),
                       'still active at bedtime', font=label_f, fill=FG + (a,))
                d.ellipse([bx - 16, py(bed_mg) - 16, bx + 16, py(bed_mg) + 16], outline=RED + (a,), width=6)
        else:
            lt = t - T_PAYOFF
            y_after = draw_words(img, spec['payoff'], payoff_f, FG, 600, lt / 1.4)
            ca = int(255 * ease_out((lt - 1.4) / 0.6))
            if ca > 0:
                cy = max(y_after + 90, 1150)
                d.text((SAFE_L, cy), 'see your own curve', font=label_f, fill=MUTED + (ca,))
                d.text((SAFE_L, cy + 50), 'cafify.app', font=cta_f, fill=AMBER + (ca,))

        ff.stdin.write(img.convert('RGB').tobytes())

    ff.stdin.close()
    ff.wait()
    if ff.returncode != 0:
        raise SystemExit('ffmpeg failed')
    return {'bed_mg': round(bed_mg), 'peak_mg': round(peak_mg), 'peak_after_min': round(peak_t * 60),
            'caption': spec.get('caption', '')}


if __name__ == '__main__':
    if len(sys.argv) != 3:
        raise SystemExit(__doc__)
    with open(sys.argv[1]) as fh:
        spec = json.load(fh)
    print(json.dumps(render(spec, sys.argv[2])))
