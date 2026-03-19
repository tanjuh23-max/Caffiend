"""
Caffiend Instagram Reel Poster — Playwright browser automation
Posts a video to Instagram as a Reel using a saved login session.
Usage: python scripts/post_reel.py <video_path> <caption>
Or called directly by the scheduler.
"""

import os
import sys
import time
import json
from datetime import datetime, timezone
from playwright.sync_api import sync_playwright, TimeoutError as PlaywrightTimeout

SESSION_FILE = os.path.join(os.path.dirname(__file__), "..", "instagram_session.json")
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


def post_reel(video_path: str, caption: str):
    if not os.path.exists(SESSION_FILE):
        print("ERROR: No session file found. Run instagram_login.py first.")
        sys.exit(1)

    print(f"Posting Reel: {os.path.basename(video_path)}")

    with sync_playwright() as p:
        browser = p.chromium.launch(
            headless=True,
            args=["--no-sandbox", "--disable-dev-shm-usage"]
        )
        context = browser.new_context(
            storage_state=SESSION_FILE,
            viewport={"width": 1280, "height": 900},
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
        )
        page = context.new_page()

        # Go to Instagram
        print("Opening Instagram...")
        page.goto("https://www.instagram.com/", wait_until="networkidle")
        page.wait_for_timeout(3000)

        # Click Create (+ button)
        print("Clicking Create...")
        page.click("svg[aria-label='New post']", timeout=10000)
        page.wait_for_timeout(2000)

        # Upload video file
        print("Uploading video...")
        with page.expect_file_chooser() as fc_info:
            page.click("text=Select from computer")
        file_chooser = fc_info.value
        file_chooser.set_files(video_path)
        page.wait_for_timeout(5000)

        # Click OK on crop dialog if it appears
        try:
            page.click("text=OK", timeout=5000)
            page.wait_for_timeout(2000)
        except PlaywrightTimeout:
            pass

        # Click Next (aspect ratio / trim screen)
        print("Clicking Next (trim)...")
        page.click("text=Next", timeout=15000)
        page.wait_for_timeout(3000)

        # Click Next (filters screen)
        print("Clicking Next (filters)...")
        page.click("text=Next", timeout=10000)
        page.wait_for_timeout(2000)

        # Add caption
        print("Adding caption...")
        caption_box = page.locator("div[aria-label='Write a caption...']")
        caption_box.click()
        # Type caption in chunks to avoid issues
        for chunk in [caption[i:i+100] for i in range(0, len(caption), 100)]:
            page.keyboard.type(chunk, delay=20)
        page.wait_for_timeout(2000)

        # Share
        print("Sharing...")
        page.click("text=Share", timeout=10000)
        page.wait_for_timeout(8000)

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
