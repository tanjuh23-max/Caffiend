"""
Run this ONCE on your own machine to generate an Instagram session.
The session is then saved as a GitHub secret and used by GitHub Actions.

Usage:
    pip install instagrapi
    python scripts/save_session.py
"""

import base64
import getpass
from pathlib import Path
from instagrapi import Client

username = input("Instagram username: ")
password = getpass.getpass("Instagram password: ")

cl = Client()
cl.delay_range = [1, 3]

print("Logging in...")
cl.login(username, password)
print("Login successful!")

session_file = Path("instagram_session.json")
cl.dump_settings(str(session_file))

session_b64 = base64.b64encode(session_file.read_bytes()).decode()

print("\n" + "="*60)
print("SESSION GENERATED. Add this as a GitHub secret:")
print("Secret name:  INSTAGRAM_SESSION")
print("Secret value:")
print("="*60)
print(session_b64)
print("="*60)
print("\nSteps:")
print("1. Copy the value above")
print("2. Go to: https://github.com/tanjuh23-max/Caffiend/settings/secrets/actions")
print("3. Click 'New repository secret'")
print("4. Name: INSTAGRAM_SESSION")
print("5. Value: paste the session string")
print("6. Click 'Add secret'")
print("\nDone! GitHub Actions will use this session from now on.")
