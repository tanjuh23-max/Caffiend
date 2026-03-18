from playwright.sync_api import sync_playwright

FILE = "file:///C:/Users/Anisa/Caffiend%20App/public/instagram-carousel.html"
OUT  = "C:/Users/Anisa/Caffiend App/public/"

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    # Viewport larger than 1080 so the full slide fits
    page = browser.new_page(viewport={"width": 1200, "height": 1200})
    page.goto(FILE)
    page.wait_for_load_state("networkidle")
    page.wait_for_timeout(1000)

    # Strip the shell UI and set scale to 1 so slides render at true 1080x1080
    page.evaluate("""() => {
        // Hide chrome
        document.querySelector('.carousel-label').style.display = 'none';
        document.querySelector('.nav-row').style.display = 'none';
        document.querySelector('.carousel-shell').style.padding = '0';
        document.querySelector('.carousel-shell').style.gap = '0';
        document.body.style.background = '#060608';
        document.body.style.justifyContent = 'flex-start';
        document.body.style.alignItems = 'flex-start';

        // Expand viewport to true 1080x1080, no border-radius / shadow
        const vp = document.querySelector('.carousel-viewport');
        vp.style.width = '1080px';
        vp.style.height = '1080px';
        vp.style.borderRadius = '0';
        vp.style.boxShadow = 'none';

        // Set scale variable to 1 so track renders at native size
        document.documentElement.style.setProperty('--scale', '1');
    }""")

    page.wait_for_timeout(300)

    for i in range(6):
        page.evaluate(f"goTo({i})")
        page.wait_for_timeout(700)   # let animations settle
        vp = page.locator(".carousel-viewport")
        vp.screenshot(path=f"{OUT}carousel-slide-{i+1}.png")
        print(f"  Saved slide {i+1}")

    browser.close()
    print("Done — 6 × 1080px screenshots saved.")
