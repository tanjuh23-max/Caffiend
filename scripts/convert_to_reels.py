"""
Caffiend Carousel → Instagram Reel Converter
Converts 6-slide PNG carousels into 9:16 MP4 videos ready for Reels.
Each slide shows for 2.5s with a smooth fade transition.
Output: slides/reels/Carousel_XX.mp4
"""

import os
import numpy as np
from PIL import Image, ImageFilter
from moviepy.editor import ImageClip, concatenate_videoclips, VideoFileClip

# ── Config ────────────────────────────────────────────────────────────────────
SLIDES_ROOT  = os.path.join(os.path.dirname(__file__), "..", "slides")
OUTPUT_DIR   = os.path.join(SLIDES_ROOT, "reels")
REEL_W, REEL_H = 1080, 1920   # 9:16 portrait
SLIDE_DURATION = 2.5           # seconds per slide
FADE_DURATION  = 0.3           # crossfade between slides
FPS = 30
BRAND_BG = (18, 18, 18)        # near-black brand background

CAROUSELS = [
    "Carousel_01_Relatable",
    "Carousel_02_Education",
    "Carousel_03_Humor",
    "Carousel_04_Tips_Productivity",
    "Carousel_05_Health",
    "Carousel_06_Social_Proof",
    "Carousel_07_Challenge",
    "Carousel_08_Mindset",
    "Carousel_09_FOMO",
]

os.makedirs(OUTPUT_DIR, exist_ok=True)


def make_frame(slide_path: str) -> np.ndarray:
    """
    Places the square slide centred on a 1080x1920 canvas.
    Background = blurred + darkened version of the slide image.
    """
    slide = Image.open(slide_path).convert("RGB")

    # ── Background: scale slide to fill 9:16, blur + darken ──
    bg = slide.copy()
    bg = bg.resize((REEL_W, REEL_W), Image.LANCZOS)   # 1080x1080

    # Extend to 1080x1920 by repeating/filling
    canvas_bg = Image.new("RGB", (REEL_W, REEL_H), BRAND_BG)
    # Tile the blurred slide across the full height
    bg_tall = bg.resize((REEL_W, REEL_H), Image.LANCZOS)
    bg_tall = bg_tall.filter(ImageFilter.GaussianBlur(radius=40))
    # Darken overlay
    overlay = Image.new("RGB", (REEL_W, REEL_H), (0, 0, 0))
    bg_final = Image.blend(bg_tall, overlay, alpha=0.55)

    # ── Foreground: slide centred ──
    slide_resized = slide.resize((REEL_W, REEL_W), Image.LANCZOS)
    y_offset = (REEL_H - REEL_W) // 2   # centre vertically
    bg_final.paste(slide_resized, (0, y_offset))

    return np.array(bg_final)


def convert_carousel(folder_name: str):
    folder_path = os.path.join(SLIDES_ROOT, folder_name)
    images = sorted([
        os.path.join(folder_path, f)
        for f in os.listdir(folder_path)
        if f.endswith(".png")
    ])

    if not images:
        print(f"  WARNING: No images found in {folder_name}")
        return

    output_path = os.path.join(OUTPUT_DIR, f"{folder_name}.mp4")
    print(f"  Converting {folder_name} ({len(images)} slides)...")

    clips = []
    for img_path in images:
        frame = make_frame(img_path)
        clip = ImageClip(frame, duration=SLIDE_DURATION)
        clip = clip.crossfadeout(FADE_DURATION)
        clips.append(clip)

    video = concatenate_videoclips(clips, method="compose", padding=-FADE_DURATION)
    video.write_videofile(
        output_path,
        fps=FPS,
        codec="libx264",
        audio=False,
        preset="fast",
        logger=None
    )
    print(f"  OK Saved: {output_path}")
    return output_path


def main():
    print("\n=== CAFFIEND REEL CONVERTER ===\n")
    print(f"Output folder: {OUTPUT_DIR}\n")

    for carousel in CAROUSELS:
        convert_carousel(carousel)

    print(f"\nAll done! {len(CAROUSELS)} Reels saved to slides/reels/")
    print("\nNext step: update Instagram posts to use these MP4s instead of images.")


if __name__ == "__main__":
    main()
