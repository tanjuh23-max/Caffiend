"""
Caffiend Instagram Auto-Poster — runs in GitHub Actions
Checks current UTC time and posts the matching carousel.
"""

import asyncio
import os
from datetime import datetime, timezone

from composio import Composio
from composio_claude_agent_sdk import ClaudeAgentSDKProvider
from claude_agent_sdk import ClaudeSDKClient, ClaudeAgentOptions, create_sdk_mcp_server

COMPOSIO_API_KEY = os.environ["COMPOSIO_API_KEY"]
EXTERNAL_USER_ID = os.environ["COMPOSIO_USER_ID"]
SLIDES_ROOT = os.path.join(os.path.dirname(__file__), "..", "slides")

# ── Carousel content ──────────────────────────────────────────────────────────
CAROUSELS = [
    {
        "folder": "Carousel_01_Relatable",
        "utc_hour": 7, "utc_minute": 0,
        "caption": """you drank coffee at 3pm. it's midnight. you're staring at the ceiling. shocker. 😐

caffeine has a 5-6 hour half-life. that 3pm coffee? still 50% active at 9pm.

I built an app that shows you exactly when you're safe to sleep based on what you actually drank.

free to use 👇 caffiend-one.vercel.app

save this for tonight when you can't sleep 💀

#caffeine #cantsleeep #coffeelover #sleephacks #relatable #coffeeproblems #productivity #realsleep #coffeetime #healthtips""",
    },
    {
        "folder": "Carousel_02_Education",
        "utc_hour": 8, "utc_minute": 30,
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
        "utc_hour": 10, "utc_minute": 0,
        "caption": """me at 11pm: why am i like this
my 4pm coffee: hi bestie 👋

turns out caffeine doesn't care about your bedtime. it's still very much awake at midnight having a great time.

i made a free app that tells you exactly how caffeinated you are rn and when you'll finally be able to sleep.

spoiler: it's later than you think.

caffiend-one.vercel.app ☕

#coffeehumor #relatable #coffeememes #cantsleeep #coffeeproblems #coffeeaddict #sleepdeprivation #coffeelover #funnybutreal #morningcoffee""",
    },
    {
        "folder": "Carousel_04_Tips_Productivity",
        "utc_hour": 12, "utc_minute": 0,
        "caption": """4 caffeine timing rules that will actually fix your sleep tonight 👇

1. stop caffeine 10 hours before bed (not 6, not 8 — 10)
2. your last coffee should be before 1pm if you sleep at 11pm
3. energy drinks hit harder — 160mg is not the same as espresso
4. the afternoon crash isn't caffeine wearing off — it's the peak dropping

I built a free app that calculates YOUR personal caffeine curve in real time.

save this 📌 caffiend-one.vercel.app

#productivitytips #caffeinetips #sleephacks #biohacking #morningroutine #coffeelovers #healthyhabits #sleepbetter #focushacks #caffeinetracker""",
    },
    {
        "folder": "Carousel_05_Health",
        "utc_hour": 14, "utc_minute": 0,
        "caption": """what 400mg of caffeine actually does to your body over 24 hours 👇

that's roughly:
→ 4 espressos
→ 2 energy drinks
→ 1 large Starbucks + 2 coffees

peak hits around 45 mins after each drink
half-life is 5.7 hours
can take up to 16 hours to fully clear

most people are running on residual caffeine 24/7 and wonder why they feel wired and tired at the same time.

track it free 👉 caffiend-one.vercel.app

#caffeinehealth #healthfacts #bodyhealth #coffeeeffects #biohacking #wellnesstips #sleephealth #healthylifestyle #caffeinetracker #knowyourbody""",
    },
    {
        "folder": "Carousel_06_Social_Proof",
        "utc_hour": 16, "utc_minute": 0,
        "caption": """i tracked my caffeine for 7 days. here's what i found 👇

day 1: drank coffee at 4pm. didn't sleep until 2am. connected the dots.
day 3: moved last coffee to 12pm. asleep by 11:30pm. actually woke up rested.
day 5: realised my "afternoon slump" was caffeine crashing not tiredness.
day 7: know exactly when to stop. haven't had a bad sleep since.

the app shows your real-time decay curve so you can see it happening.

free at caffiend-one.vercel.app — try it for a week 📉☕

#caffeinetracking #selfimprovement #sleepjourney #biohacking #coffeehabits #healthyhabits #sleepbetter #productivitylife #caffeinetracker #realresults""",
    },
    {
        "folder": "Carousel_07_Challenge",
        "utc_hour": 18, "utc_minute": 0,
        "caption": """i bet you don't know how much caffeine is in your system right now 🤔

most people have no idea. they drink coffee, feel tired, drink more, can't sleep, repeat.

there's a free app that calculates your exact active caffeine level in mg based on:
→ what you drank
→ when you drank it
→ your bodyweight

shows the decay curve for the next 10+ hours and tells you when you're safe to sleep.

go check right now. drop your number below 👇

caffiend-one.vercel.app ☕

#caffeinecheck #challenge #biohacking #coffeelovers #knowyourbody #caffeinetracker #sleepchallenge #healthchallenge #productivitychallenge #coffeegeek""",
    },
    {
        "folder": "Carousel_08_Mindset",
        "utc_hour": 19, "utc_minute": 30,
        "caption": """stop blaming your phone for bad sleep. it's the coffee. 📵☕

blue light before bed does affect sleep. but you know what affects it more?

the 200mg of caffeine still active in your system at 11pm from that coffee you had at 3.

when i started tracking caffeine timing properly my sleep quality went up more than when i did a full digital detox.

free app 👇 caffiend-one.vercel.app

#sleepmindset #sleephacks #caffeinevssleep #biohacking #morningroutine #digitaldetox #healthymindset #sleepbetter #caffeinetracker #realitycheckk""",
    },
    {
        "folder": "Carousel_09_FOMO",
        "utc_hour": 21, "utc_minute": 0,
        "caption": """everyone optimising their sleep is doing this one thing you're not 👇

tracking caffeine timing, not just quantity.

it doesn't matter if you only drink 2 coffees if you drink them at the wrong time.

the people waking up at 6am feeling rested aren't just disciplined — they know their caffeine window.

free app that shows you yours in real time 👉 caffiend-one.vercel.app ☕

don't sleep on this. (well, actually — finally do.)

#sleeproutine #caffeinewindow #biohacking #morningperson #sleepoptimization #healthyhabits #caffeinetracker #productivitymindset #coffeetime #fomo""",
    },
]


def get_carousel_for_now() -> dict | None:
    now = datetime.now(timezone.utc)
    for c in CAROUSELS:
        if c["utc_hour"] == now.hour and abs(c["utc_minute"] - now.minute) <= 10:
            return c
    return None


async def post_carousel(carousel: dict):
    folder_path = os.path.join(SLIDES_ROOT, carousel["folder"])
    images = sorted([
        os.path.abspath(os.path.join(folder_path, f))
        for f in os.listdir(folder_path)
        if f.endswith(".png")
    ])

    print(f"Posting {carousel['folder']} — {len(images)} slides")
    print(f"Images: {images}")

    composio = Composio(
        api_key=COMPOSIO_API_KEY,
        provider=ClaudeAgentSDKProvider()
    )

    session = composio.create(user_id=EXTERNAL_USER_ID)
    tools = session.tools()
    custom_server = create_sdk_mcp_server(name="composio", version="1.0.0", tools=tools)

    images_list = "\n".join(images)
    prompt = f"""Post an Instagram carousel with these images in order:

{images_list}

Caption:
{carousel['caption']}

Post this now as an Instagram carousel."""

    options = ClaudeAgentOptions(
        system_prompt="You are a social media manager. Post content to Instagram using Composio tools.",
        permission_mode="bypassPermissions",
        mcp_servers={"composio": custom_server},
    )

    async with ClaudeSDKClient(options=options) as client:
        await client.query(prompt)
        async for msg in client.receive_response():
            print(msg)

    print(f"✅ Done — {carousel['folder']} posted!")


async def main():
    carousel = get_carousel_for_now()
    if not carousel:
        now = datetime.now(timezone.utc)
        print(f"No carousel scheduled for {now.strftime('%H:%M')} UTC")
        print("Available times:", [(c["utc_hour"], c["utc_minute"]) for c in CAROUSELS])
        return
    await post_carousel(carousel)


asyncio.run(main())
