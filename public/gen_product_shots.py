#!/usr/bin/env python3
"""Generate 8 cinematic Caffiend product shots via fal.ai Flux Pro"""

import os, urllib.request
from pathlib import Path

os.environ["FAL_KEY"] = "47745022-88ab-4c06-8366-7aff4dddba3c:9b8512cab0eb57e6ed7f602c017af524"

import fal_client

BASE = Path("C:/Users/Anisa/Caffiend App/public/product-shots")
BASE.mkdir(parents=True, exist_ok=True)

SHOTS = [
    dict(slug="01-hero-desk",
         prompt="Ultra-realistic cinematic product photography, black iPhone 15 Pro standing upright on dark minimal desk, "
                "screen showing a glowing amber caffeine pharmacokinetics curve graph on pure black background, "
                "dramatic side lighting casting long shadows, shallow depth of field, "
                "dark moody atmosphere, rich blacks, amber screen glow reflecting on desk surface, "
                "premium tech product photography, 85mm lens, f/1.4, no text overlays except on screen"),

    dict(slug="02-hand-hold-glow",
         prompt="Ultra-realistic cinematic close-up, elegant hand holding iPhone in dark room, "
                "screen displaying a glowing orange-amber wave graph tracking caffeine levels over time, "
                "pure black app background, bokeh background lights, "
                "screen glow illuminating fingers dramatically, shallow DOF, "
                "luxury product photography aesthetic, editorial quality, moody, 50mm lens"),

    dict(slug="03-coffee-and-app",
         prompt="Ultra-realistic moody product shot, iPhone lying flat next to a steaming espresso cup on dark slate, "
                "phone screen showing amber caffeine tracking graph on black UI, "
                "steam from coffee curling up in backlight, dark background, "
                "cinematic color grade, amber and black tones, condensation, "
                "premium lifestyle product photography, overhead 3/4 angle"),

    dict(slug="04-nightstand-app",
         prompt="Ultra-realistic atmospheric product photo, iPhone on dark wooden nightstand at night, "
                "screen showing sleep countdown timer and caffeine curve in amber on black, "
                "dim warm bedside lamp in background, dark bedroom, "
                "intimate moody lighting, shallow DOF, grain, "
                "cinematic night photography, the phone is the only light source in the scene"),

    dict(slug="05-screen-closeup",
         prompt="Ultra-realistic extreme macro product photo, extreme close-up of iPhone screen showing "
                "a glowing amber caffeine pharmacokinetics wave graph, clean black app UI, "
                "white monospace typography, subtle grid lines, "
                "screen pixels slightly visible, dark vignette edges, "
                "dramatic light falloff, premium app screenshot photography, studio quality"),

    dict(slug="06-morning-pour",
         prompt="Ultra-realistic cinematic lifestyle product photo, iPhone propped against coffee bag on dark kitchen counter, "
                "screen showing caffiend app with amber caffeine curve on black, "
                "coffee being poured into mug beside phone in motion blur, "
                "dramatic backlight through steam, dark moody kitchen, "
                "amber tones, product in environment photography, 35mm film look"),

    dict(slug="07-two-phones-flat",
         prompt="Ultra-realistic dark studio product photography, two iPhones side by side on black reflective surface, "
                "left phone showing caffeine tracking graph in amber, right phone showing sleep prediction timer, "
                "both screens glowing against pure black background, "
                "subtle reflection below phones, studio lighting from above-right, "
                "premium tech product photography, Apple-style aesthetic, clean and minimal"),

    dict(slug="08-gym-bag-pocket",
         prompt="Ultra-realistic cinematic product photo, iPhone partially pulled from black gym bag pocket, "
                "screen visible showing caffiend amber caffeine graph on black UI, "
                "dark gym background out of focus, dramatic single light source, "
                "gritty premium aesthetic, shallow DOF, moody color grade, "
                "lifestyle product photography, motion and energy implied"),
]

def download(url, path):
    urllib.request.urlretrieve(url, path)

def main():
    for shot in SHOTS:
        out_path = BASE / f"{shot['slug']}.png"
        print(f"Generating {shot['slug']} ...")

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

    print("\nAll 8 product shots done.")
    print(f"Location: {BASE}")

if __name__ == "__main__":
    main()
