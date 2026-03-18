from playwright.sync_api import sync_playwright
import os

OUT = "C:/Users/Anisa/Caffiend App/public/content/"
os.makedirs(OUT, exist_ok=True)

# ── Static posts ──────────────────────────────────────────────────────────────
STATICS = [
    ("p1","day01-terminal-error"),
    ("p2","day04-half-life-clock"),
    ("p3","day07-caffeine-chart"),
    ("p4","day10-sleep-predictor"),
    ("p5","day13-myth-vs-fact"),
    ("p6","day16-midnight-caffeine"),
    ("p7","day19-drink-comparison"),
    ("p8","day22-free-vs-pro"),
    ("p9","day25-three-coffees"),
    ("p10","day28-final-cta"),
]

# ── Carousel slides ───────────────────────────────────────────────────────────
# (set_id, slide_id, filename)
CAROUSEL_SLIDES = [
    # A — Hour by Hour (Day 6)
    ("a1","day06-hour-by-hour-1-cover"),
    ("a2","day06-hour-by-hour-2"),
    ("a3","day06-hour-by-hour-3"),
    ("a4","day06-hour-by-hour-4"),
    ("a5","day06-hour-by-hour-5"),
    ("a6","day06-hour-by-hour-6-cta"),
    # B — Sleep Thief (Day 9)
    ("b1","day09-sleep-thief-1-cover"),
    ("b2","day09-sleep-thief-2"),
    ("b3","day09-sleep-thief-3"),
    ("b4","day09-sleep-thief-4"),
    ("b5","day09-sleep-thief-5"),
    ("b6","day09-sleep-thief-6-cta"),
    # C — Body Weight (Day 12)
    ("c1","day12-body-weight-1-cover"),
    ("c2","day12-body-weight-2"),
    ("c3","day12-body-weight-3"),
    ("c4","day12-body-weight-4"),
    ("c5","day12-body-weight-5-cta"),
    # D — 5 Signs (Day 15)
    ("d1","day15-5-signs-1-cover"),
    ("d2","day15-5-signs-2"),
    ("d3","day15-5-signs-3"),
    ("d4","day15-5-signs-4"),
    ("d5","day15-5-signs-5-cta"),
    # E — Worst Times (Day 21)
    ("e1","day21-worst-times-1-cover"),
    ("e2","day21-worst-times-2"),
    ("e3","day21-worst-times-3"),
    ("e4","day21-worst-times-4"),
    ("e5","day21-worst-times-5-cta"),
    # F — 7 Days (Day 24)
    ("f1","day24-7-days-1-cover"),
    ("f2","day24-7-days-2"),
    ("f3","day24-7-days-3"),
    ("f4","day24-7-days-4"),
    ("f5","day24-7-days-5-cta"),
    # G — Pro (Day 27)
    ("g1","day27-pro-1-cover"),
    ("g2","day27-pro-2"),
    ("g3","day27-pro-3"),
    ("g4","day27-pro-4-pricing"),
    ("g5","day27-pro-5-cta"),
    # H — 30 Days (Day 30)
    ("h1","day30-30days-1-cover"),
    ("h2","day30-30days-2"),
    ("h3","day30-30days-3"),
    ("h4","day30-30days-4"),
    ("h5","day30-30days-5-cta"),
]

def capture_elements(page, items, out_dir):
    for (el_id, filename) in items:
        el = page.locator(f"#{el_id}")
        el.scroll_into_view_if_needed()
        page.wait_for_timeout(300)
        path = f"{out_dir}{filename}.png"
        el.screenshot(path=path)
        print(f"  ✓ {filename}")

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1200, "height": 1400})

    # ── Statics ──
    print("Static posts")
    page.goto(f"file:///C:/Users/Anisa/Caffiend%20App/public/content-statics.html")
    page.wait_for_load_state("domcontentloaded")
    page.wait_for_timeout(1500)
    capture_elements(page, STATICS, OUT)

    # ── Carousels ──
    print("Carousel slides")
    page.goto(f"file:///C:/Users/Anisa/Caffiend%20App/public/content-carousels.html")
    page.wait_for_load_state("domcontentloaded")
    page.wait_for_timeout(1500)
    capture_elements(page, CAROUSEL_SLIDES, OUT)

    browser.close()

total = len(STATICS) + len(CAROUSEL_SLIDES)
print(f"Done - {total} assets saved to {OUT}")
