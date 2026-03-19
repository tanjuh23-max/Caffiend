"""
Caffiend Instagram Reel Poster — Playwright browser automation
Posts a video to Instagram as a Reel using stored credentials (no session file needed).
Usage: python scripts/post_reel.py
Or called directly by the scheduler.
"""

import os
import sys
from datetime import datetime, timezone
from playwright.sync_api import sync_playwright, TimeoutError as PlaywrightTimeout

IG_USERNAME = os.environ.get("INSTAGRAM_USERNAME", "")
IG_PASSWORD = os.environ.get("INSTAGRAM_PASSWORD", "")
SLIDES_ROOT  = os.path.join(os.path.dirname(__file__), "..", "slides")

CAROUSELS = [
    {
        "folder": "Carousel_01_Relatable",
        "utc_hour": 15, "utc_minute": 15,
        "caption": """you drank coffee at 3pm. it's midnight. you're staring at the ceiling. shocker. 😐

caffeine has a 5-6 hour half-life. that 3pm coffee? still 50% active at 9pm.

I built an app that shows you exactly when you're safe to sleep based on what you actually drank.

free to use 👇 caffiend-one.vercel.app

save this for tonight when you can't sleep 💀

#caffeine #cantsleeep #coffeelover #sleephacks #relatable #coffeeproblems #productivity #realsleep #coffeetime #healthtips""",
    },
    {
        "folder": "Carousel_02_Education",
        "utc_hour": 16, "utc_minute": 45,
        "caption": """no one told you caffeine has a 5.7 hour half-life. here's what that actually means 👇

if you drink 200mg at 2pm:
→ 9:42pm — still 100mg in your system
→ 3:24am — still 50mg in your system

most people's sleep threshold is ~100mg.

you're not bad at sleeping. you're bad at timing caffeine.

free app that tracks this in real time 👉 caffiend-one.vercel.app

#caffeinehalflife #sleepscience #biohacking #coffeeaddict #healthfacts #sleepdeprivation #caffeinetracker #productivityhacks #coffeegeek #sleeptips""",
    },
    {
        "folder": "Carousel_03_Humor",
        "utc_hour": 18, "utc_minute": 15,
        "caption": """me at 11pm: why am i like this
my 4pm coffee: hi bestie 👋

turns out caffeine doesn't care about your bedtime. it's still very much awake at midnight having a great time.

free app 👉 caffiend-one.vercel.app

#coffeehumor #relatable #coffeememes #cantsleeep #coffeeproblems #coffeeaddict #sleepdeprivation #coffeelover #funnybutreal #morningcoffee""",
    },
    {
        "folder": "Carousel_04_Tips_Productivity",
        "utc_hour": 19, "utc_minute": 45,
        "caption": """4 caffeine timing rules that will actually fix your sleep tonight 👇

1. stop caffeine 10 hours before bed (not 6, not 8 — 10)
2. your last coffee should be before 1pm if you sleep at 11pm
3. energy drinks hit harder — 160mg is not the same as espresso
4. the afternoon crash isn't caffeine wearing off — it's the peak dropping

free app 👉 caffiend-one.vercel.app

#productivitytips #caffeinetips #sleephacks #biohacking #morningroutine #coffeelovers #healthyhabits #sleepbetter #focushacks #caffeinetracker""",
    },
    {
        "folder": "Carousel_05_Health",
        "utc_hour": 21, "utc_minute": 15,
        "caption": """what 400mg of caffeine actually does to your body over 24 hours 👇

that's roughly 4 espressos, 2 energy drinks, or 1 large Starbucks + 2 coffees.

peak hits 45 mins after each drink. half-life is 5.7 hours. can take 16 hours to fully clear.

track it free 👉 caffiend-one.vercel.app

#caffeinehealth #healthfacts #bodyhealth #coffeeeffects #biohacking #wellnesstips #sleephealth #healthylifestyle #caffeinetracker #knowyourbody""",
    },
    {
        "folder": "Carousel_06_Social_Proof",
        "utc_hour": 7, "utc_minute": 0,
        "caption": """i tracked my caffeine for 7 days. here's what i found 👇

day 1: drank coffee at 4pm. didn't sleep until 2am.
day 3: moved last coffee to 12pm. asleep by 11:30pm.
day 7: haven't had a bad sleep since.

free at caffiend-one.vercel.app

#caffeinetracking #selfimprovement #sleepjourney #biohacking #coffeehabits #healthyhabits #sleepbetter #productivitylife #caffeinetracker #realresults""",
    },
    {
        "folder": "Carousel_07_Challenge",
        "utc_hour": 8, "utc_minute": 30,
        "caption": """i bet you don't know how much caffeine is in your system right now 🤔

there's a free app that calculates your exact active caffeine level based on what you drank, when, and your bodyweight.

go check. drop your number below 👇

caffiend-one.vercel.app

#caffeinecheck #challenge #biohacking #coffeelovers #knowyourbody #caffeinetracker #sleepchallenge #healthchallenge #productivitychallenge #coffeegeek""",
    },
    {
        "folder": "Carousel_08_Mindset",
        "utc_hour": 10, "utc_minute": 0,
        "caption": """stop blaming your phone for bad sleep. it's the coffee. 📵☕

the 200mg of caffeine still active at 11pm from your 3pm coffee does more damage than any screen.

free app 👇 caffiend-one.vercel.app

#sleepmindset #sleephacks #caffeinevssleep #biohacking #morningroutine #digitaldetox #healthymindset #sleepbetter #caffeinetracker #realitycheckk""",
    },
    {
        "folder": "Carousel_09_FOMO",
        "utc_hour": 12, "utc_minute": 0,
        "caption": """everyone optimising their sleep is doing this one thing you're not 👇

tracking caffeine timing, not just quantity.

free app that shows your personal caffeine window 👉 caffiend-one.vercel.app

don't sleep on this. (well, actually — finally do.)

#sleeproutine #caffeinewindow #biohacking #morningperson #sleepoptimization #healthyhabits #caffeinetracker #productivitymindset #coffeetime #fomo""",
    },
]


def get_carousel_for_now():
    index_override = os.environ.get("CAROUSEL_INDEX", "").strip()
    if index_override != "":
        return CAROUSELS[int(index_override)]
    now = datetime.now(timezone.utc)
    now_minutes = now.hour * 60 + now.minute
    closest, closest_diff = None, 999
    for c in CAROUSELS:
        diff = abs((c["utc_hour"] * 60 + c["utc_minute"]) - now_minutes)
        if diff < closest_diff:
            closest_diff, closest = diff, c
    return closest if closest_diff <= 30 else None


def login(page):
    """Log in to Instagram fresh using INSTAGRAM_USERNAME + INSTAGRAM_PASSWORD."""
    print("Logging in to Instagram...")
    page.goto("https://www.instagram.com/accounts/login/", wait_until="domcontentloaded", timeout=60000)
    page.wait_for_timeout(4000)

    # Fill username
    page.fill("input[name='username']", IG_USERNAME, timeout=15000)
    page.wait_for_timeout(500)

    # Fill password
    page.fill("input[name='password']", IG_PASSWORD, timeout=10000)
    page.wait_for_timeout(500)

    # Click Log In
    page.click("button[type='submit']", timeout=10000)
    print("  Submitted login form, waiting...")
    page.wait_for_timeout(8000)

    page.screenshot(path="instagram_debug_login.png")
    print("Screenshot saved: instagram_debug_login.png")

    # Dismiss "Save your login info?" — click "Not now" if present
    for dismiss in ["Not now", "Not Now", "Skip", "Cancel"]:
        try:
            page.click(f"text={dismiss}", timeout=5000)
            print(f"  Dismissed: {dismiss}")
            page.wait_for_timeout(2000)
            break
        except PlaywrightTimeout:
            continue

    # Dismiss "Turn on Notifications" if present
    for dismiss in ["Not Now", "Not now", "Skip", "Cancel"]:
        try:
            page.click(f"text={dismiss}", timeout=5000)
            print(f"  Dismissed notifications prompt: {dismiss}")
            page.wait_for_timeout(2000)
            break
        except PlaywrightTimeout:
            continue

    print("  Login complete.")


def post_reel(video_path: str, caption: str):
    if not IG_USERNAME or not IG_PASSWORD:
        print("ERROR: INSTAGRAM_USERNAME and INSTAGRAM_PASSWORD environment variables must be set.")
        sys.exit(1)

    print(f"Posting Reel: {os.path.basename(video_path)}")

    with sync_playwright() as p:
        browser = p.chromium.launch(
            headless=True,
            args=[
                "--no-sandbox",
                "--disable-dev-shm-usage",
                "--disable-blink-features=AutomationControlled",
                "--disable-features=IsolateOrigins,site-per-process",
                "--lang=en-US,en",
            ]
        )
        context = browser.new_context(
            viewport={"width": 1280, "height": 900},
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
            locale="en-US",
            timezone_id="Europe/London",
        )
        page = context.new_page()
        # Mask automation signals so Instagram doesn't detect headless browser
        page.add_init_script("""
            Object.defineProperty(navigator, 'webdriver', {get: () => undefined});
            Object.defineProperty(navigator, 'languages', {get: () => ['en-US', 'en']});
            Object.defineProperty(navigator, 'plugins', {get: () => [1, 2, 3]});
            window.chrome = { runtime: {} };
        """)

        # Log in fresh every time — no session file needed
        login(page)

        # Go to Instagram home
        print("Loading feed...")
        page.goto("https://www.instagram.com/", wait_until="domcontentloaded", timeout=60000)
        page.wait_for_timeout(5000)

        page.screenshot(path="instagram_debug_1.png")
        print("Screenshot saved: instagram_debug_1.png")

        # Click Create (+ button) — try multiple selectors
        print("Clicking Create...")
        for selector in [
            "svg[aria-label='New post']",
            "svg[aria-label='Create']",
            "[aria-label='New post']",
            "[aria-label='Create']",
            "a[href='/create/style/']",
        ]:
            try:
                page.click(selector, timeout=5000)
                print(f"  Clicked: {selector}")
                break
            except PlaywrightTimeout:
                continue
        page.wait_for_timeout(3000)
        page.screenshot(path="instagram_debug_2.png")
        print("Screenshot saved: instagram_debug_2.png")

        # Instagram shows Post/Story/Reel dropdown — click Post (last match)
        print("Selecting Post...")
        try:
            page.get_by_role("link", name="Post").last.click(timeout=5000)
            print("  Clicked Post (dropdown)")
        except PlaywrightTimeout:
            try:
                page.locator("a[href='/create/style/']").click(timeout=5000)
                print("  Clicked Post (href)")
            except PlaywrightTimeout:
                print("  Could not click Post, proceeding...")
        page.wait_for_timeout(4000)
        page.screenshot(path="instagram_debug_3.png")
        print("Screenshot saved: instagram_debug_3.png")

        # Upload video — wait for "Select from computer" button
        print("Uploading video...")
        page.wait_for_selector("text=Select from computer", timeout=15000)
        with page.expect_file_chooser(timeout=15000) as fc_info:
            page.click("text=Select from computer", timeout=10000)
        fc_info.value.set_files(video_path)
        print("  Video file set, waiting for upload...")
        page.wait_for_timeout(10000)
        page.screenshot(path="instagram_debug_4.png")
        print("Screenshot saved: instagram_debug_4.png")

        # Dismiss "Video posts are now shared as reels" popup
        try:
            page.click("text=OK", timeout=8000)
            print("  Dismissed Reels info popup")
            page.wait_for_timeout(2000)
        except PlaywrightTimeout:
            pass

        # Click through Next buttons (crop → filters → caption)
        for step in ["crop", "filters", "caption"]:
            print(f"Clicking Next ({step})...")
            try:
                page.click("text=Next", timeout=10000)
                page.wait_for_timeout(2500)
            except PlaywrightTimeout:
                print(f"  Next button not found at {step} step, continuing...")

        # Add caption
        print("Adding caption...")
        for caption_selector in [
            "div[aria-label='Write a caption...']",
            "textarea[aria-label='Write a caption...']",
            "[aria-label='Write a caption']",
            "div[contenteditable='true']",
        ]:
            try:
                caption_box = page.locator(caption_selector).first
                caption_box.click(timeout=5000)
                print(f"  Caption box found: {caption_selector}")
                break
            except PlaywrightTimeout:
                continue

        for chunk in [caption[i:i+100] for i in range(0, len(caption), 100)]:
            page.keyboard.type(chunk, delay=15)
        page.wait_for_timeout(2000)

        # Share
        page.screenshot(path="instagram_debug_5.png")
        print("Screenshot saved: instagram_debug_5.png")
        print("Sharing...")
        shared = False
        for share_sel in [
            "[aria-label='Share']",
            "button:has-text('Share')",
            "div[role='button']:has-text('Share')",
            "text=Share >> visible=true",
        ]:
            try:
                page.click(share_sel, timeout=8000)
                shared = True
                print(f"  Clicked Share via: {share_sel}")
                break
            except PlaywrightTimeout:
                continue
        if not shared:
            page.locator("text=Share").last.click(timeout=10000)

        page.wait_for_timeout(12000)
        page.screenshot(path="instagram_debug_6.png")
        print("Screenshot saved: instagram_debug_6.png")
        print("Reel posted successfully!")
        browser.close()


def main():
    carousel = get_carousel_for_now()
    if not carousel:
        now = datetime.now(timezone.utc)
        print(f"No carousel scheduled for {now.strftime('%H:%M')} UTC")
        return

    reels_dir = os.path.join(SLIDES_ROOT, "reels")
    video_path = os.path.abspath(os.path.join(reels_dir, f"{carousel['folder']}.mp4"))

    if not os.path.exists(video_path):
        print(f"Video not found: {video_path}")
        print("Run convert_to_reels.py first.")
        return

    post_reel(video_path, carousel["caption"])


if __name__ == "__main__":
    main()
