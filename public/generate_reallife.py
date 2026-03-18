import urllib.request
import urllib.parse
import os
import time

BASE = "C:/Users/Anisa/Caffiend App/public/content"

IMAGES = [
    {
        "filename": "Week 1 - Days 1-7/day02-3pm-slump.png",
        "prompt": "Cinematic overhead flat-lay photograph of a cluttered office desk at golden hour, Sony A7IV 35mm f/1.4, Kodak Portra 400 film simulation. White ceramic espresso cup cold and half-finished on the left. Open MacBook Pro showing a blurred spreadsheet. A hand reaching for a second coffee cup entering from the right. Scattered sticky notes in warm amber and cream tones. Soft side lighting from a window casting long shadows. Dark walnut wood desk. Moody, slightly overexposed highlights, deep shadows. Color grade: warm amber tones, deep blacks. Photorealistic editorial quality, no text."
    },
    {
        "filename": "Week 1 - Days 1-7/day05-cold-brew-flatlay.png",
        "prompt": "Top-down flat-lay product photograph of a cold brew coffee setup on a dark slate surface, Canon R5 50mm macro, studio softbox lighting with subtle amber gel. Tall glass of cold brew with ice and condensation droplets catching light center-left. Small black notebook open to a blank page, pen resting across it. A few whole coffee beans scattered naturally. Small amber-tinted glass bottle of cold brew concentrate top-right. Dark matte near-black surface. Color grade: deep blacks, amber highlights, high contrast. Ultra sharp commercial product photography, no text."
    },
    {
        "filename": "Week 2 - Days 8-14/day08-scan-the-can.png",
        "prompt": "Close-up lifestyle photograph of a hand holding a smartphone scanning the barcode of a green Monster Energy 500ml can, Fujifilm X-T5 56mm f/1.2, shallow depth of field. Dark kitchen counter background slightly blurred. Can is sharp and centered right, hand and phone slightly left. Dramatic rim lighting from behind creating an amber orange halo effect. Moody editorial tech-forward aesthetic. Color grade: near-black shadows, warm amber and green accents. Photorealistic, no text on screen."
    },
    {
        "filename": "Week 2 - Days 8-14/day11-espresso-morning.png",
        "prompt": "Cinematic close-up photograph of espresso crema swirling in a small white ceramic cup, slight 30-degree angle, Leica M11 Noctilux 50mm f/0.95. Early morning blue-grey ambient light from a window, single warm spot lamp creating amber specular highlight on the crema surface. Steam rising softly. Dark kitchen background completely black. Rich amber-gold crema tones. Extreme shallow depth of field, only the crema in focus. Moody intimate almost scientific. Color grade: deep blacks, amber-to-cream crema, cool blue ambient shadows. Photorealistic film quality, no text."
    },
    {
        "filename": "Week 2 - Days 8-14/day14-energy-drink-aisle.png",
        "prompt": "Wide-angle photograph looking straight at a supermarket energy drink refrigerator aisle, Nikon Z9 24mm f/2.8. Bright commercial fluorescent lighting slightly blue-white. Dozens of colorful energy drink cans and bottles on shelves spanning full width. Vivid greens blues reds silvers of various brands. Cold case glass doors reflective. Single walking figure slightly motion blurred passing left to right. Clinical overwhelming consumer excess aesthetic. Color grade: cooler tones high saturation commercial photography. Photorealistic wide editorial shot, no readable text on products."
    },
    {
        "filename": "Week 3 - Days 15-21/day17-midnight-awake.png",
        "prompt": "Atmospheric bedroom photograph at midnight, Sony A7SIII 35mm f/1.8, extremely low light. Person lying in bed with eyes wide open staring at ceiling. Blue-grey moonlight from window casting soft diagonal shadows across the bed. Phone on bedside table showing 01:47 AM, screen glow creating blue highlight on face. Dark moody slightly cool toned. Tired expression but unable to sleep. Minimal editorial cinematic composition. Color grade: deep blacks cold blue moonlight warm amber phone glow contrast. Photorealistic editorial magazine quality, no specific text visible."
    },
    {
        "filename": "Week 3 - Days 15-21/day20-coffee-shop-overhead.png",
        "prompt": "Overhead aerial view of a specialty coffee shop interior, Hasselblad X2D 90mm, from directly above at 3 meters height. Several small tables visible each with a coffee cup and laptop or book. Warm Edison bulb lighting dark wooden floors a few green plants. People working alone or in pairs heads and shoulders visible from above faces not identifiable. Strong graphic composition with circular tables creating visual rhythm. Warm amber and cream color palette deep wood tones. Color grade: warm slightly desaturated editorial cafe photography. Photorealistic, no text visible."
    },
    {
        "filename": "Week 4 - Days 22-30/day23-app-in-hand.png",
        "prompt": "Lifestyle product photograph of a hand holding a modern smartphone showing a dark-themed app dashboard with an amber data visualization graph on screen, Canon R5 85mm f/1.4. Background dark blurred desk surface with coffee cup softly out of focus. Phone screen is the hero showing abstract amber orange curves on near-black background. Warm rim lighting from behind creates amber halo. Shallow depth of field background completely bokeh. Color grade: near-black ambient warm amber screen glow premium tech aesthetic. Photorealistic Apple-product-photography quality, no specific text readable on screen."
    },
    {
        "filename": "Week 4 - Days 22-30/day26-morning-flatlay.png",
        "prompt": "Top-down flat-lay lifestyle photograph of a morning routine setup on dark linen surface, Sony A7IV 35mm f/2.0, natural window light from top-right. White ceramic pour-over coffee dripper actively brewing steam visible. Smartphone face-up showing a dark-themed dashboard screen abstract no readable text. Small glass of water. Arranged asymmetrically intentionally minimal. Warm morning light amber steam catch light. Dark linen background premium contrast. Single sprig of rosemary for organic texture. Color grade: warm morning tones amber highlights deep neutral background. Photorealistic Instagram-editorial quality."
    },
    {
        "filename": "Week 4 - Days 22-30/day29-bedside-rested.png",
        "prompt": "Intimate bedside lifestyle photograph at early morning golden hour, Fujifilm GFX 50S 63mm f/2.8, warm natural light flooding from window off-frame right. White linen pillow and edge of duvet perfectly still. Bedside table with phone face-down, small glass of water with morning light refracting, minimalist clock showing 7:15 AM. Everything peaceful soft calm. Quality of light suggests genuinely rested sleep. Color grade: warm morning gold cream whites soft shadows. No harsh contrasts. Magazine-editorial quality photorealistic, no text."
    },
]

def download_image(prompt, out_path):
    encoded = urllib.parse.quote(prompt)
    url = f"https://image.pollinations.ai/prompt/{encoded}?width=1080&height=1080&model=flux&nologo=true&seed={abs(hash(prompt)) % 99999}"
    print(f"  Generating: {os.path.basename(out_path)}")
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=120) as resp:
            data = resp.read()
        with open(out_path, "wb") as f:
            f.write(data)
        size_kb = len(data) // 1024
        print(f"  Saved ({size_kb}KB)")
        return True
    except Exception as e:
        print(f"  ERROR: {e}")
        return False

print("Generating 10 real-life images via Flux (Pollinations.ai)...")
print("Each image takes 15-30 seconds.\n")

success = 0
for item in IMAGES:
    out_path = os.path.join(BASE, item["filename"])
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    ok = download_image(item["prompt"], out_path)
    if ok:
        success += 1
    time.sleep(3)  # be polite to the API

print(f"\nDone — {success}/{len(IMAGES)} images generated.")
