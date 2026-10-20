"""
Picks the video for a given date from queue.json and renders it.

The schedule is Mon/Wed/Fri starting Wed 21 Oct 2026; the Nth scheduled day
uses queue item N (wrapping is avoided: once the queue runs out it exits with
code 3 so the caller writes new specs instead of repeating old ones).

Usage: python3 tiktok/next_video.py OUT_DIR [YYYY-MM-DD]
Prints JSON: {"index", "file", "caption", "bed_mg", ...}
"""
import datetime as dt
import json
import os
import sys

sys.path.insert(0, os.path.dirname(__file__))
from make_video import render  # noqa: E402

START = dt.date(2026, 10, 21)
DAYS = {0, 2, 4}  # Mon, Wed, Fri


def slot(day):
    n, d = 0, START
    while d < day:
        if d.weekday() in DAYS:
            n += 1
        d += dt.timedelta(days=1)
    return n


if __name__ == '__main__':
    out_dir = sys.argv[1]
    day = dt.date.fromisoformat(sys.argv[2]) if len(sys.argv) > 2 else dt.date.today()
    queue = json.load(open(os.path.join(os.path.dirname(__file__), 'queue.json')))
    i = slot(day)
    if i >= len(queue):
        print(json.dumps({'index': i, 'queue_empty': True}))
        sys.exit(3)
    os.makedirs(out_dir, exist_ok=True)
    path = os.path.join(out_dir, f'cafify-tiktok-{day.isoformat()}.mp4')
    info = render(queue[i], path)
    info.update({'index': i, 'file': path, 'spec': queue[i]})
    print(json.dumps(info, ensure_ascii=False))
