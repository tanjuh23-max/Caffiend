"""
Instagram Login — run this ONCE to save your session.
Opens a real browser, you log in manually, then it saves your cookies.
After this, the posting bot uses the saved session automatically.
"""

import json
import os
from playwright.sync_api import sync_playwright

SESSION_FILE = os.path.join(os.path.dirname(__file__), "..", "instagram_session.json")

def save_session():
    print("\n=== INSTAGRAM SESSION SAVER ===\n")
    print("A browser will open. Log into Instagram normally.")
    print("Once you are logged in and can see your feed, come back here and press Enter.\n")

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False, slow_mo=500)
        context = browser.new_context(
            viewport={"width": 1280, "height": 800},
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
        )
        page = context.new_page()
        page.goto("https://www.instagram.com/accounts/login/")
        page.wait_for_timeout(3000)

        input("Log in to Instagram in the browser, then press Enter here...")

        # Save cookies and storage state
        storage = context.storage_state()
        with open(SESSION_FILE, "w") as f:
            json.dump(storage, f)

        print(f"\nSession saved to: {SESSION_FILE}")
        print("You can now run the posting bot.\n")
        browser.close()

if __name__ == "__main__":
    save_session()
