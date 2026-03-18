#!/usr/bin/env python3
"""Generate 10 real-life photo posts via fal.ai Flux Pro"""

import os, urllib.request, json
from pathlib import Path

os.environ["FAL_KEY"] = "47745022-88ab-4c06-8366-7aff4dddba3c:9b8512cab0eb57e6ed7f602c017af524"

import fal_client

BASE = Path("C:/Users/Anisa/Caffiend App/public/tiktok-content")

WEEK_DIRS = {
    1: "Week 1 - Days 1-7",
    2: "Week 2 - Days 8-14",
    3: "Week 3 - Days 15-21",
    4: "Week 4 - Days 22-30",
}

SHOTS = [
    dict(week=1, day=2, slug="desk-3pm-slump",
         prompt="Ultra-realistic moody photo, person slumped at dark minimal desk at 3pm, "
                "half-empty coffee cup, laptop screen glow, golden afternoon light cutting through blinds, "
                "dark shadows, cinematic color grade, shallow depth of field, 35mm film aesthetic, "
                "rich blacks, amber highlights, exhausted but aesthetic, no text"),

    dict(week=1, day=5, slug="cold-brew-flatlay",
         prompt="Ultra-realistic dark flatlay, cold brew coffee jar on black slate surface, "
                "condensation on glass, coffee beans scattered, moody dark background, "
                "amber and black tones, product photography, cinematic lighting, "
                "dramatic shadows, premium aesthetic, overhead shot, no text"),

    dict(week=2, day=8, slug="scanning-energy-can",
         prompt="Ultra-realistic close-up photo, hand holding smartphone scanning barcode on "
                "Monster Energy can, dark room, screen glow illuminating hand, "
                "neon green and black color grade, cyberpunk aesthetic, "
                "shallow DOF, cinematic, moody, no text on screen"),

    dict(week=2, day=11, slug="espresso-pull",
         prompt="Ultra-realistic macro photo of espresso pouring into small black cup, "
                "rich golden crema, dark moody cafe background, dramatic backlight, "
                "steam rising, shallow depth of field, 85mm lens look, "
                "cinematic amber tones, premium coffee photography, no text"),

    dict(week=2, day=14, slug="energy-drink-aisle",
         prompt="Ultra-realistic photo of supermarket energy drink aisle at night, "
                "fluorescent lights, rows of Monster Bang Red Bull cans, "
                "lone person browsing, dark cinematic color grade, "
                "slightly unsettling consumer aesthetic, wide angle, no text"),

    dict(week=3, day=17, slug="midnight-awake",
         prompt="Ultra-realistic moody photo, person lying awake in dark bedroom at 2am, "
                "phone screen glow on face, eyes open staring at ceiling, "
                "dark blue and black tones, cinematic, shallow DOF, "
                "insomnia aesthetic, sheets rumpled, ambient city light from window, no text"),

    dict(week=3, day=20, slug="coffee-shop-overhead",
         prompt="Ultra-realistic overhead shot of person working in dark moody coffee shop, "
                "laptop, espresso cup, notebook, hands typing, "
                "warm amber cafe lighting, dark wood table, cinematic color grade, "
                "editorial photography style, busy background blurred, no text"),

    dict(week=4, day=23, slug="app-in-hand",
         prompt="Ultra-realistic photo, close-up of hands holding iPhone in dark room, "
                "screen showing a caffeine tracking graph with glowing amber curve, "
                "dark background, screen glow on hands, cinematic, "
                "tech aesthetic, shallow DOF, premium phone photography, no text"),

    dict(week=4, day=26, slug="morning-routine-flatlay",
         prompt="Ultra-realistic dark flatlay, morning routine items on black surface: "
                "espresso cup, iPhone face down, watch, supplements, notebook, pen, "
                "moody dramatic lighting, amber accents, minimal premium aesthetic, "
                "overhead shot, dark shadows, product photography, no text"),

    dict(week=4, day=29, slug="bedside-nightstand",
         prompt="Ultra-realistic moody photo of dark nightstand at night, "
                "half-drunk coffee cup (bad idea), phone showing time 11:58pm, "
                "dim warm lamp light, dark aesthetic, cinematic color grade, "
                "shallow DOF, intimate bedroom photography, warning mood, no text"),
]

def download(url, path):
    urllib.request.urlretrieve(url, path)

def main():
    for shot in SHOTS:
        week_label = WEEK_DIRS[shot["week"]]
        out_dir = BASE / week_label
        out_dir.mkdir(parents=True, exist_ok=True)
        out_path = out_dir / f"day{shot['day']:02d}-{shot['slug']}.png"

        print(f"Generating Day {shot['day']:02d} - {shot['slug']} ...")

        result = fal_client.subscribe(
            "fal-ai/flux-pro/v1.1",
            arguments={
                "prompt": shot["prompt"],
                "image_size": "portrait_4_3",
                "num_inference_steps": 28,
                "guidance_scale": 3.5,
                "num_images": 1,
                "safety_tolerance": "2",
            }
        )

        img_url = result["images"][0]["url"]
        download(img_url, str(out_path))
        print(f"  Saved -> {out_path.name}")

    print("\nAll 10 real-life images done.")

if __name__ == "__main__":
    main()
