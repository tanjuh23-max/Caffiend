"""
Caffiend Instagram Reel Poster — Instagrapi mobile API
Posts a video to Instagram as a Reel using Instagram's mobile API.
No browser needed — works reliably from GitHub Actions.
"""

import os
import sys
import base64
from pathlib import Path
from datetime import datetime, timezone

IG_USERNAME = os.environ.get("INSTAGRAM_USERNAME", "")
IG_PASSWORD = os.environ.get("INSTAGRAM_PASSWORD", "")
INSTAGRAM_SESSION = os.environ.get("INSTAGRAM_SESSION", "")  # base64 session (optional)
SLIDES_ROOT = os.path.join(os.path.dirname(__file__), "..", "slides")

CAROUSELS = [
    {
        "folder": "Carousel_01_Relatable",
        "utc_hour": 15, "utc_minute": 15,
        "caption": """you drank coffee at 3pm. it's midnight. you're staring at the ceiling. shocker. \U0001f610

caffeine has a 5-6 hour half-life. that 3pm coffee? still 50% active at 9pm.

I built an app that shows you exactly when you're safe to sleep based on what you actually drank.

free to use \U0001f447 caffiend-one.vercel.app

save this for tonight when you can't sleep \U0001f480

#caffeine #cantsleeep #coffeelover #sleephacks #relatable #coffeeproblems #productivity #realsleep #coffeetime #healthtips""",
    },
    {
        "folder": "Carousel_02_Education",
        "utc_hour": 16, "utc_minute": 45,
        "caption": """no one told you caffeine has a 5.7 hour half-life. here's what that actually means \U0001f447

if you drink 200mg at 2pm:
\u2192 9:42pm \u2014 still 100mg in your system
\u2192 3:24am \u2014 still 50mg in your system

most people's sleep threshold is ~100mg.

you're not bad at sleeping. you're bad at timing caffeine.

free app that tracks this in real time \U0001f449 caffiend-one.vercel.app

#caffeinehalflife #sleepscience #biohacking #coffeeaddict #healthfacts #sleepdeprivation #caffeinetracker #productivityhacks #coffeegeek #sleeptips""",
    },
    {
        "folder": "Carousel_03_Humor",
        "utc_hour": 18, "utc_minute": 15,
        "caption": """me at 11pm: why am i like this
my 4pm coffee: hi bestie \U0001f44b

turns out caffeine doesn't care about your bedtime. it's still very much awake at midnight having a great time.

free app \U0001f449 caffiend-one.vercel.app

#coffeehumor #relatable #coffeememes #cantsleeep #coffeeproblems #coffeeaddict #sleepdeprivation #coffeelover #funnybutreal #morningcoffee""",
    },
    {
        "folder": "Carousel_04_Tips_Productivity",
        "utc_hour": 19, "utc_minute": 45,
        "caption": """4 caffeine timing rules that will actually fix your sleep tonight \U0001f447

1. stop caffeine 10 hours before bed (not 6, not 8 \u2014 10)
2. your last coffee should be before 1pm if you sleep at 11pm
3. energy drinks hit harder \u2014 160mg is not the same as espresso
4. the afternoon crash isn't caffeine wearing off \u2014 it's the peak dropping

free app \U0001f449 caffiend-one.vercel.app

#productivitytips #caffeinetips #sleephacks #biohacking #morningroutine #coffeelovers #healthyhabits #sleepbetter #focushacks #caffeinetracker""",
    },
    {
        "folder": "Carousel_05_Health",
        "utc_hour": 21, "utc_minute": 15,
        "caption": """what 400mg of caffeine actually does to your body over 24 hours \U0001f447

that's roughly 4 espressos, 2 energy drinks, or 1 large Starbucks + 2 coffees.

peak hits 45 mins after each drink. half-life is 5.7 hours. can take 16 hours to fully clear.

track it free \U0001f449 caffiend-one.vercel.app

#caffeinehealth #healthfacts #bodyhealth #coffeeeffects #biohacking #wellnesstips #sleephealth #healthylifestyle #caffeinetracker #knowyourbody""",
    },
    {
        "folder": "Carousel_06_Social_Proof",
        "utc_hour": 7, "utc_minute": 0,
        "caption": """i tracked my caffeine for 7 days. here's what i found \U0001f447

day 1: drank coffee at 4pm. didn't sleep until 2am.
day 3: moved last coffee to 12pm. asleep by 11:30pm.
day 7: haven't had a bad sleep since.

free at caffiend-one.vercel.app

#caffeinetracking #selfimprovement #sleepjourney #biohacking #coffeehabits #healthyhabits #sleepbetter #productivitylife #caffeinetracker #realresults""",
    },
    {
        "folder": "Carousel_07_Challenge",
        "utc_hour": 8, "utc_minute": 30,
        "caption": """i bet you don't know how much caffeine is in your system right now \U0001f914

there's a free app that calculates your exact active caffeine level based on what you drank, when, and your bodyweight.

go check. drop your number below \U0001f447

caffiend-one.vercel.app

#caffeinecheck #challenge #biohacking #coffeelovers #knowyourbody #caffeinetracker #sleepchallenge #healthchallenge #productivitychallenge #coffeegeek""",
    },
    {
        "folder": "Carousel_08_Mindset",
        "utc_hour": 10, "utc_minute": 0,
        "caption": """stop blaming your phone for bad sleep. it's the coffee. \U0001f4f5\u2615

the 200mg of caffeine still active at 11pm from your 3pm coffee does more damage than any screen.

free app \U0001f447 caffiend-one.vercel.app

#sleepmindset #sleephacks #caffeinevssleep #biohacking #morningroutine #digitaldetox #healthymindset #sleepbetter #caffeinetracker #realitycheckk""",
    },
    {
        "folder": "Carousel_09_FOMO",
        "utc_hour": 12, "utc_minute": 0,
        "caption": """everyone optimising their sleep is doing this one thing you're not \U0001f447

tracking caffeine timing, not just quantity.

free app that shows your personal caffeine window \U0001f449 caffiend-one.vercel.app

don't sleep on this. (well, actually \u2014 finally do.)

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


def get_client():
    from instagrapi import Client

    cl = Client()
    cl.delay_range = [1, 3]

    session_file = Path("/tmp/ig_session.json")

    # Try restoring saved session first (avoids triggering login challenges)
    if INSTAGRAM_SESSION:
        try:
            session_data = base64.b64decode(INSTAGRAM_SESSION).decode()
            session_file.write_text(session_data)
            cl.load_settings(str(session_file))
            cl.login(IG_USERNAME, IG_PASSWORD)
            print("Logged in using saved session")
            return cl
        except Exception as e:
            print(f"Session restore failed ({e}), trying fresh login...")

    # Fresh login via mobile API
    print("Logging in fresh...")
    cl.login(IG_USERNAME, IG_PASSWORD)
    print("Login successful")

    # Dump session so we can see it in logs (user can save as INSTAGRAM_SESSION secret)
    cl.dump_settings(str(session_file))
    session_b64 = base64.b64encode(session_file.read_bytes()).decode()
    print("=== SESSION (save as INSTAGRAM_SESSION secret to avoid re-login) ===")
    print(session_b64[:80] + "..." if len(session_b64) > 80 else session_b64)
    print("=== END SESSION ===")

    return cl


def post_reel(video_path: str, caption: str):
    if not IG_USERNAME or not IG_PASSWORD:
        print("ERROR: INSTAGRAM_USERNAME and INSTAGRAM_PASSWORD must be set")
        sys.exit(1)

    print(f"Posting Reel: {os.path.basename(video_path)}")

    cl = get_client()

    print("Uploading Reel to Instagram...")
    media = cl.clip_upload(
        path=Path(video_path),
        caption=caption,
    )
    print(f"Reel posted successfully!")
    print(f"Media ID: {media.id}")
    print(f"URL: https://www.instagram.com/reel/{media.code}/")


def main():
    carousel = get_carousel_for_now()
    if not carousel:
        now = datetime.now(timezone.utc)
        print(f"No carousel scheduled for {now.strftime('%H:%M')} UTC. Skipping.")
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
