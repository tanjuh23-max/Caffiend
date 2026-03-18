#!/usr/bin/env python3
"""Caffiend — Sleep & Cortisol Week — 7 TikTok carousels at 1080x1920"""

import os
from pathlib import Path
from playwright.sync_api import sync_playwright

BASE = Path("C:/Users/Anisa/Caffiend App/public/tiktok-content/Sleep & Cortisol Week")

THEME_COLORS = {
    "amber":  {"a": "#f59e0b", "b": "#f97316", "glow": "rgba(245,158,11,0.25)"},
    "violet": {"a": "#a78bfa", "b": "#7c3aed", "glow": "rgba(167,139,250,0.25)"},
    "red":    {"a": "#f87171", "b": "#dc2626", "glow": "rgba(248,113,113,0.25)"},
    "blue":   {"a": "#60a5fa", "b": "#2563eb", "glow": "rgba(96,165,250,0.25)"},
    "teal":   {"a": "#2dd4bf", "b": "#0d9488", "glow": "rgba(45,212,191,0.25)"},
}

TYPE_ACCENT = {
    "hook":    None,
    "stat":    "#f59e0b",
    "warning": "#f87171",
    "tip":     "#34d399",
    "compare": "#a78bfa",
    "reveal":  "#60a5fa",
    "cta":     None,
}

CAROUSELS = [
    dict(day=1, slug="morning-coffee-is-wasted", theme="amber", slides=[
        dict(type="hook",    big="your morning coffee\nis almost completely\nwasted", small="and you've been doing it every day"),
        dict(type="reveal",  big="cortisol peaks\nat 8–9am", small="your body's natural alertness hormone\nis already at maximum"),
        dict(type="warning", big="caffeine + peak cortisol\n= zero benefit", small="you're adding fuel to a fire\nthat's already burning at 100%"),
        dict(type="warning", big="worse —\nyou build tolerance faster", small="regular caffeine during cortisol peak\naccelerates dependency"),
        dict(type="tip",     big="wait until\n9:30–10am", small="cortisol starts dropping\ncaffeine fills the gap perfectly"),
        dict(type="stat",    big="same caffeine\n3× the effect", small="timing your dose around cortisol\ncosts nothing and changes everything"),
        dict(type="cta",     big="time your caffeine\naround your cortisol", small="free · caffiend.app"),
    ]),

    dict(day=2, slug="caffeine-destroys-deep-sleep", theme="blue", slides=[
        dict(type="hook",    big="caffeine doesn't\njust keep you awake\nit destroys your sleep", small="even when you fall asleep fine"),
        dict(type="reveal",  big="slow-wave sleep", small="the deepest stage — where your brain\ndetoxifies and repairs itself"),
        dict(type="warning", big="caffeine at 3pm\n= −20% deep sleep", small="even if you fall asleep at 10pm\nthe damage is already done"),
        dict(type="warning", big="you wake up tired\nnot because of poor sleep\nbut no deep sleep", small="8 hours of light sleep\n≠ 6 hours of proper sleep"),
        dict(type="stat",    big="the half-life\nstill applies", small="3pm coffee at 9pm bedtime\n= 50% caffeine still active in brain"),
        dict(type="tip",     big="last coffee\nbefore 1pm", small="gives your brain 8hrs\nto clear enough for proper deep sleep"),
        dict(type="cta",     big="protect your\ndeep sleep", small="free · caffiend.app"),
    ]),

    dict(day=3, slug="cortisol-curve-explained", theme="violet", slides=[
        dict(type="hook",    big="your cortisol does\nsomething incredible\nevery single day", small="and caffeine is fighting it"),
        dict(type="reveal",  big="6–8am", small="cortisol surges naturally\nwaking your brain before your alarm"),
        dict(type="stat",    big="8–9am", small="peak cortisol\nmaximum natural alertness"),
        dict(type="stat",    big="9:30–11:30am", small="first cortisol dip\nbest window for caffeine"),
        dict(type="stat",    big="12–1pm", small="second dip\nideal for your second coffee"),
        dict(type="warning", big="2–4pm", small="cortisol lowest point of the day\ncaffeine here = 50% active at bedtime"),
        dict(type="tip",     big="work with\nyour cortisol\nnot against it", small="caffiend tracks both\nyour caffeine curve and optimal windows"),
        dict(type="cta",     big="see your perfect\ncoffee windows", small="free · caffiend.app"),
    ]),

    dict(day=4, slug="2pm-energy-crash-truth", theme="red", slides=[
        dict(type="hook",    big="the 2pm crash\nhas nothing to do\nwith lunch", small="it's your cortisol. and caffeine makes it worse."),
        dict(type="reveal",  big="2–4pm", small="cortisol hits its daily low\nyour brain naturally slows down"),
        dict(type="warning", big="most people\ndrink coffee now", small="at the worst possible time\nfor their sleep that night"),
        dict(type="stat",    big="3pm coffee\nat 9pm bedtime", small="= 50% caffeine still active\n= cortisol suppressed next morning"),
        dict(type="warning", big="the cycle", small="bad sleep → need more coffee → worse sleep\n→ need even more coffee"),
        dict(type="tip",     big="the 2pm crash fix\nthat isn't caffeine", small="10 min walk · cold water · 20 min nap\nbefore 3pm if you must nap"),
        dict(type="cta",     big="break the\ncaffeine cycle", small="free · caffiend.app"),
    ]),

    dict(day=5, slug="what-happens-overnight", theme="blue", slides=[
        dict(type="hook",    big="what caffeine does\nto your brain\nwhile you sleep", small="this is why you're always tired"),
        dict(type="reveal",  big="adenosine", small="your brain's tiredness signal\nbuilds up all day while you're awake"),
        dict(type="stat",    big="normally", small="you sleep → adenosine clears\n→ you wake up refreshed"),
        dict(type="warning", big="with caffeine", small="adenosine receptors blocked until\ncaffeine clears — 10+ hours"),
        dict(type="warning", big="your brain can't\nfully reset overnight", small="you wake up with residual adenosine\nfrom yesterday still waiting"),
        dict(type="warning", big="so you need\ncoffee to feel normal", small="not for energy\nbut just to feel baseline human"),
        dict(type="tip",     big="that's dependency\nnot a coffee preference", small="caffiend shows you exactly\nwhen your brain resets"),
        dict(type="cta",     big="see when your\nbrain fully resets", small="free · caffiend.app"),
    ]),

    dict(day=6, slug="5-signs-caffeine-ruining-sleep", theme="red", slides=[
        dict(type="hook",    big="5 signs caffeine\nis ruining your sleep", small="most people have all 5"),
        dict(type="warning", big="1. tired but\ncan't sleep", small="adenosine built up but caffeine\nstill blocking the receptors"),
        dict(type="warning", big="2. waking up\nbetween 2–4am", small="caffeine's stimulant effect\ntiming out mid-sleep"),
        dict(type="warning", big="3. unrefreshing\nsleep", small="deep sleep suppressed\nyou slept but didn't recover"),
        dict(type="warning", big="4. needing coffee\nimmediately on waking", small="adenosine flood from\nnot clearing overnight"),
        dict(type="warning", big="5. afternoon crash\nevery single day", small="cortisol depleted · adenosine rebound\n· the cycle continues"),
        dict(type="tip",     big="all 5 are caused\nby one thing", small="caffeine timing\nnot caffeine itself"),
        dict(type="cta",     big="fix your\ntiming today", small="free · caffiend.app"),
    ]),

    dict(day=7, slug="perfect-caffeine-timing-guide", theme="teal", slides=[
        dict(type="hook",    big="the perfect caffeine\ntiming guide\nbased on cortisol science", small="save this. use it tomorrow."),
        dict(type="tip",     big="6–9am ✗", small="cortisol peak\ncoffee here = wasted + tolerance built"),
        dict(type="tip",     big="9:30–11:30am ✓", small="first cortisol dip\nbest window · maximum effect"),
        dict(type="tip",     big="12–1pm ✓", small="second dip\nideal for second coffee if needed"),
        dict(type="warning", big="after 2pm ✗", small="half-life math ruins your sleep\n50% active at bedtime"),
        dict(type="stat",    big="the result", small="better focus · no jitters · proper sleep\nmore alert without more caffeine"),
        dict(type="tip",     big="caffiend shows\nyour exact windows", small="personalised to your schedule\nnot a generic guide"),
        dict(type="cta",     big="get your personal\ncaffeine windows", small="free · caffiend.app"),
    ]),
]

# ── HTML TEMPLATE ─────────────────────────────────────────────────────────────

def slide_html(slide, theme, slide_num, total):
    c = THEME_COLORS[theme]
    accent = TYPE_ACCENT.get(slide["type"]) or c["a"]
    stype  = slide["type"]
    big    = slide["big"].replace("\n", "<br>")
    small  = slide.get("small", "").replace("\n", "<br>")

    if stype in ("hook", "cta"):
        bg = "background: linear-gradient(160deg, #0d0d12 0%, #0a0a10 50%, #060608 100%);"
        overlay = f"""
          <div style="position:absolute;inset:0;background:radial-gradient(ellipse at 50% 40%, {c['glow']} 0%, transparent 65%);"></div>
          <div style="position:absolute;inset:0;background:linear-gradient(135deg, {c['a']}08 0%, transparent 60%);"></div>
        """
    else:
        bg = "background: #060608;"
        overlay = f"""<div style="position:absolute;inset:0;background:radial-gradient(ellipse at 50% 30%, {c['glow']} 0%, transparent 60%);opacity:.5;"></div>"""

    big_len  = len(slide["big"].replace("\n", ""))
    big_size = "96px" if big_len < 25 else "80px" if big_len < 40 else "68px"

    accent_bar = "" if stype in ("hook", "cta") else f"""
      <div style="width:80px;height:4px;background:linear-gradient(90deg,{accent},{c['b']});border-radius:2px;margin:0 auto 40px;"></div>
    """

    badge_map = {
        "stat":    ("STAT",    c["a"]),
        "warning": ("WARNING", "#f87171"),
        "tip":     ("TIP",     "#34d399"),
        "compare": ("COMPARE", "#a78bfa"),
        "reveal":  ("SCIENCE", "#60a5fa"),
        "hook":    ("",        "transparent"),
        "cta":     ("",        "transparent"),
    }
    badge_text, badge_color = badge_map.get(stype, ("", "transparent"))
    badge_html = f"""<div style="display:inline-block;background:{badge_color}22;border:1px solid {badge_color}44;
      color:{badge_color};font-size:18px;letter-spacing:4px;padding:6px 20px;border-radius:4px;margin-bottom:40px;font-weight:700;">
      {badge_text}</div>""" if badge_text else ""

    if stype == "cta":
        content = f"""
          <div style="font-size:24px;letter-spacing:6px;color:{c['a']};text-transform:uppercase;margin-bottom:32px;opacity:.8;">CAFFIEND</div>
          <div style="font-size:{big_size};font-weight:800;line-height:1.15;color:#ffffff;margin-bottom:36px;">{big}</div>
          <div style="font-size:28px;color:#ffffff99;margin-bottom:60px;">{small}</div>
          <div style="background:linear-gradient(90deg,{c['a']},{c['b']});padding:24px 64px;border-radius:8px;
            font-size:30px;font-weight:700;color:#000;letter-spacing:2px;">caffiend.app</div>
        """
    elif stype == "hook":
        content = f"""
          <div style="font-size:22px;letter-spacing:6px;color:{c['a']};text-transform:uppercase;margin-bottom:48px;opacity:.7;">CAFFIEND</div>
          <div style="font-size:{big_size};font-weight:800;line-height:1.2;color:#ffffff;margin-bottom:40px;">{big}</div>
          <div style="width:60px;height:2px;background:linear-gradient(90deg,{c['a']},{c['b']});margin:0 auto 36px;"></div>
          <div style="font-size:26px;color:#ffffff88;margin-bottom:80px;">{small}</div>
          <div style="font-size:20px;letter-spacing:4px;color:{c['a']};">SWIPE →</div>
        """
    else:
        big_color = accent if stype in ("stat", "warning", "tip", "reveal") else "#ffffff"
        content = f"""
          {badge_html}
          {accent_bar}
          <div style="font-size:{big_size};font-weight:800;line-height:1.2;color:{big_color};margin-bottom:36px;">{big}</div>
          <div style="font-size:30px;color:#ffffff88;line-height:1.6;">{small}</div>
        """

    dots = "".join(
        f'<div style="width:{"24px" if i+1==slide_num else "8px"};height:8px;border-radius:4px;'
        f'background:{"linear-gradient(90deg,"+c["a"]+","+c["b"]+")" if i+1==slide_num else "#ffffff22"};"></div>'
        for i in range(total)
    )

    return f"""<!DOCTYPE html><html><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700;800&display=swap" rel="stylesheet">
<style>
  * {{ margin:0; padding:0; box-sizing:border-box; }}
  body {{
    width:1080px; height:1920px; overflow:hidden;
    {bg}
    font-family:'JetBrains Mono',monospace;
    display:flex; flex-direction:column;
    align-items:center; justify-content:center;
    text-align:center; position:relative;
  }}
</style></head><body>
  {overlay}
  <div style="position:absolute;inset:0;opacity:.03;background:
    repeating-linear-gradient(0deg,transparent,transparent 79px,#ffffff 79px,#ffffff 80px),
    repeating-linear-gradient(90deg,transparent,transparent 79px,#ffffff 79px,#ffffff 80px);"></div>
  <div style="position:relative;z-index:2;padding:80px;max-width:920px;width:100%;">{content}</div>
  <div style="position:absolute;bottom:60px;left:0;right:0;z-index:3;display:flex;flex-direction:column;align-items:center;gap:20px;">
    <div style="display:flex;gap:10px;align-items:center;">{dots}</div>
    <div style="font-size:18px;letter-spacing:3px;color:#ffffff33;">{slide_num} / {total}</div>
  </div>
  <div style="position:absolute;top:50px;right:60px;z-index:3;font-size:18px;letter-spacing:3px;
    color:{c['a']};opacity:.5;font-weight:700;">CAFFIEND</div>
</body></html>"""

# ── MAIN ──────────────────────────────────────────────────────────────────────

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)

        for carousel in CAROUSELS:
            day_dir = BASE / f"Day {carousel['day']:02d} - {carousel['slug']}"
            day_dir.mkdir(parents=True, exist_ok=True)

            slides = carousel["slides"]
            total  = len(slides)

            for idx, slide in enumerate(slides):
                html = slide_html(slide, carousel["theme"], idx + 1, total)
                page = browser.new_page(viewport={"width": 1080, "height": 1920})
                tmp  = day_dir / f"_tmp_{idx}.html"
                tmp.write_text(html, encoding="utf-8")
                page.goto(tmp.as_uri())
                page.wait_for_load_state("networkidle")
                page.wait_for_timeout(400)
                page.screenshot(path=str(day_dir / f"slide-{idx+1:02d}.png"),
                                clip={"x":0,"y":0,"width":1080,"height":1920})
                page.close()
                tmp.unlink()

            print(f"Day {carousel['day']:02d}  {carousel['slug']}  ({total} slides)")

        browser.close()
    print("\nSleep & Cortisol Week complete.")

if __name__ == "__main__":
    main()
