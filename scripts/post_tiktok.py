"""
Caffiend TikTok Reel Poster — TikTok Content Posting API
Posts a video to TikTok using the official Content Posting API.
Requires: TIKTOK_ACCESS_TOKEN env var (from TikTok Developer Portal).
"""

import os
import sys
import requests
from pathlib import Path
from datetime import datetime, timezone

TIKTOK_ACCESS_TOKEN = os.environ.get("TIKTOK_ACCESS_TOKEN", "")
SLIDES_ROOT = os.path.join(os.path.dirname(__file__), "..", "slides")

CAROUSELS = [
    {
        "folder": "Carousel_01_Relatable",
        "utc_hour": 15, "utc_minute": 15,
        "caption": "you drank coffee at 3pm. it's midnight. you're staring at the ceiling. shocker.\n\ncaffeine has a 5-6 hour half-life. that 3pm coffee? still 50% active at 9pm.\n\nfree app that shows exactly when you're safe to sleep caffiend-one.vercel.app\n\n#caffeine #cantsleeep #coffeelover #sleephacks #relatable #coffeeproblems #productivity #coffeetime #healthtips #biohacking",
    },
    {
        "folder": "Carousel_02_Education",
        "utc_hour": 16, "utc_minute": 45,
        "caption": "no one told you caffeine has a 5.7 hour half-life. here's what that actually means\n\nif you drink 200mg at 2pm - still 100mg at 9:42pm - still 50mg at 3:24am\n\nfree app that tracks this in real time caffiend-one.vercel.app\n\n#caffeinehalflife #sleepscience #biohacking #coffeeaddict #healthfacts #sleepdeprivation #caffeinetracker #productivityhacks",
    },
    {
        "folder": "Carousel_03_Humor",
        "utc_hour": 18, "utc_minute": 15,
        "caption": "me at 11pm: why am i like this\nmy 4pm coffee: hi bestie\n\nturns out caffeine doesn't care about your bedtime. it's still very much awake at midnight.\n\nfree app caffiend-one.vercel.app\n\n#coffeehumor #relatable #coffeememes #cantsleeep #coffeeproblems #coffeeaddict #sleepdeprivation #coffeelover",
    },
    {
        "folder": "Carousel_04_Tips_Productivity",
        "utc_hour": 19, "utc_minute": 45,
        "caption": "4 caffeine timing rules that will actually fix your sleep tonight\n\n1. stop caffeine 10 hours before bed\n2. last coffee before 1pm if you sleep at 11pm\n3. energy drinks hit harder - 160mg is not the same as espresso\n4. the afternoon crash is the peak dropping, not caffeine wearing off\n\ncaffiend-one.vercel.app\n\n#productivitytips #caffeinetips #sleephacks #biohacking #morningroutine #healthyhabits",
    },
    {
        "folder": "Carousel_05_Health",
        "utc_hour": 21, "utc_minute": 15,
        "caption": "what 400mg of caffeine actually does to your body over 24 hours\n\nthat's roughly 4 espressos, 2 energy drinks, or 1 large Starbucks + 2 coffees.\n\npeak hits 45 mins after each drink. half-life is 5.7 hours. takes 16 hours to fully clear.\n\ntrack it free caffiend-one.vercel.app\n\n#caffeinehealth #healthfacts #coffeeeffects #biohacking #wellnesstips #sleephealth",
    },
    {
        "folder": "Carousel_06_Social_Proof",
        "utc_hour": 7, "utc_minute": 0,
        "caption": "i tracked my caffeine for 7 days. here's what i found\n\nday 1: drank coffee at 4pm. didn't sleep until 2am.\nday 3: moved last coffee to 12pm. asleep by 11:30pm.\nday 7: haven't had a bad sleep since.\n\nfree at caffiend-one.vercel.app\n\n#caffeinetracking #selfimprovement #sleepjourney #biohacking #coffeehabits #sleepbetter",
    },
    {
        "folder": "Carousel_07_Challenge",
        "utc_hour": 8, "utc_minute": 30,
        "caption": "i bet you don't know how much caffeine is in your system right now\n\nthere's a free app that calculates your exact active caffeine level based on what you drank, when, and your bodyweight.\n\ngo check. drop your number below caffiend-one.vercel.app\n\n#caffeinecheck #challenge #biohacking #coffeelovers #knowyourbody #caffeinetracker",
    },
    {
        "folder": "Carousel_08_Mindset",
        "utc_hour": 10, "utc_minute": 0,
        "caption": "stop blaming your phone for bad sleep. it's the coffee.\n\nthe 200mg of caffeine still active at 11pm from your 3pm coffee does more damage than any screen.\n\nfree app caffiend-one.vercel.app\n\n#sleepmindset #sleephacks #caffeinevssleep #biohacking #morningroutine #digitaldetox #sleepbetter",
    },
    {
        "folder": "Carousel_09_FOMO",
        "utc_hour": 12, "utc_minute": 0,
        "caption": "everyone optimising their sleep is doing this one thing you're not\n\ntracking caffeine timing, not just quantity.\n\nfree app that shows your personal caffeine window caffiend-one.vercel.app\n\ndon't sleep on this. (well, actually - finally do.)\n\n#sleeproutine #caffeinewindow #biohacking #sleepoptimization #healthyhabits #caffeinetracker",
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


def post_video(video_path: str, caption: str):
    if not TIKTOK_ACCESS_TOKEN:
        print("ERROR: TIKTOK_ACCESS_TOKEN not set.")
        sys.exit(1)

    headers = {
        "Authorization": f"Bearer {TIKTOK_ACCESS_TOKEN}",
        "Content-Type": "application/json",
    }

    video_size = os.path.getsize(video_path)

    # Step 1: Initialise upload
    print("Initialising TikTok upload...")
    init_resp = requests.post(
        "https://open.tiktokapis.com/v2/post/publish/video/init/",
        headers=headers,
        json={
            "post_info": {
                "title": caption[:2200],
                "privacy_level": "PUBLIC_TO_EVERYONE",
                "disable_duet": False,
                "disable_comment": False,
                "disable_stitch": False,
            },
            "source_info": {
                "source": "FILE_UPLOAD",
                "video_size": video_size,
                "chunk_size": video_size,
                "total_chunk_count": 1,
            },
        },
    )
    init_data = init_resp.json()
    print(f"Init response: {init_data}")

    if init_resp.status_code != 200 or "error" in init_data.get("data", {}):
        print(f"ERROR: Failed to initialise upload: {init_data}")
        sys.exit(1)

    upload_url = init_data["data"]["upload_url"]
    publish_id = init_data["data"]["publish_id"]

    # Step 2: Upload video
    print(f"Uploading video ({video_size} bytes)...")
    with open(video_path, "rb") as f:
        upload_resp = requests.put(
            upload_url,
            data=f,
            headers={
                "Content-Type": "video/mp4",
                "Content-Range": f"bytes 0-{video_size - 1}/{video_size}",
                "Content-Length": str(video_size),
            },
        )
    print(f"Upload response: {upload_resp.status_code}")

    if upload_resp.status_code not in (200, 201, 206):
        print(f"ERROR: Upload failed with status {upload_resp.status_code}")
        sys.exit(1)

    print(f"Video posted to TikTok! Publish ID: {publish_id}")


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
        return

    print(f"Posting to TikTok: {os.path.basename(video_path)}")
    post_video(video_path, carousel["caption"])


if __name__ == "__main__":
    main()
