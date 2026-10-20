# Cafify TikTok playbook

Three coded videos a week (Mon/Wed/Fri). Each one is rendered by
`make_video.py` from a spec in `queue.json`; `next_video.py` picks the spec
for a given date.

## The formula (what got the 32K-view post)
- **Hook = the feeling, never the word "caffeine".** Write it so someone who
  has never thought about caffeine stops scrolling. "why you can't sleep even
  when you're exhausted", not "caffeine destroys your sleep".
- **Reveal = the culprit, specific and relatable.** A named drink at a real
  time of day: "it's the Costa flat white at 4pm".
- **Payoff = the number.** Use `{bed_mg}` so the figure always matches the
  curve. Only compare it to something it actually exceeds (Red Bull 80mg,
  espresso 63mg, Monster 160mg).
- Lowercase, conversational, no jargon (no "pharmacokinetics", "CYP1A2").
- Mix audiences: office workers, gym, students, night shifts, UK drinks
  (Costa, Pret, Greggs, Monster, NOCCO, builder's tea).

## Writing new specs when the queue runs out
Append new objects to `queue.json` in the same shape. Never reuse a hook
that's already in the queue. Check every payoff claim against the computed
`bed_mg` before rendering.

## Posting
Videos are silent on purpose: add a trending sound inside TikTok before
posting (it helps reach). Paste the caption that comes with each video.
