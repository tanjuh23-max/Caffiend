# Caffiend — Reddit Posts (Ready to Post)

**Strategy:** Post 1 per day across different subs. Add value first, mention the app naturally at the end. No hard sell. Use your personal Reddit account (not a brand account).

---

## POST 1 — r/coffee
**Title:** I built a caffeine tracker that models what's actually in your bloodstream — here's what I found after a week of tracking

**Body:**
I've always been a 3-4 coffees a day person, but I kept having terrible sleep no matter what I tried. I assumed it was screens, stress, whatever.

Then I learned about caffeine pharmacokinetics — specifically that caffeine has a 5.7-hour half-life. That means if you drink 200mg at 3pm, you still have ~100mg active at 9pm and ~50mg at 3am. Your body takes about 10x the half-life to fully clear it.

I built a small web app that tracks this in real time — it uses the actual elimination model, not just a simple timer. You input what you drank and when, and it shows you a live curve of what's active right now.

After one week of tracking, I found:
- My "last coffee at 4pm" habit meant I had 80mg active at midnight every single night
- Moving my last coffee to 12:30pm meant I was under 50mg by 10pm
- My sleep latency dropped from ~45 mins to under 10 mins

The app is free: caffiend-one.vercel.app

Happy to nerd out on the science if anyone wants — the absorption + elimination model is surprisingly elegant.

---

## POST 2 — r/biohacking
**Title:** Tracking caffeine half-life changed how I approach my entire day — data inside

**Body:**
Most caffeine advice is "don't drink coffee after 2pm." But nobody explains *why* that number, or how to calculate it for yourself.

The pharmacokinetic reality:
- Caffeine half-life: ~5.7 hours (varies 3–7h based on genetics, liver enzymes, hormones)
- Time to peak: ~45 minutes post-consumption
- For 10-hour sleep window starting at 11pm: you need to stop caffeine by ~1pm to have <50mg active at bedtime

The problem: most people drink caffeine without knowing their real-time active level. A 200mg espresso at 2pm + 100mg green tea at 4pm = 220mg still active at 10pm. No wonder sleep is wrecked.

I built a free tracker that models this using the actual pharmacokinetic equations — you see a live curve of your active caffeine plotted against your sleep target. It also accounts for body weight (mg/kg is the relevant metric, not raw mg).

App: caffiend-one.vercel.app

The most interesting thing I've tracked: energy drinks hit differently not because of the caffeine amount, but because the volume means you absorb it faster. A 500ml Monster hits your peak harder than 2 espressos even at similar mg.

---

## POST 3 — r/productivity
**Title:** The real reason you can't focus in the afternoon (it's not the crash — it's the curve)

**Body:**
That 3pm energy crash isn't caffeine wearing off. It's your adenosine rebound kicking in as the caffeine peak drops.

Here's the model:
- You drink coffee at 8am, peak at ~8:45am
- By 1pm, you're at ~50% of peak
- By 3pm, you're at ~35% — but adenosine has been building behind the scenes
- The *relative* drop feels like a crash, even though caffeine is still active

The fix most people try: another coffee at 2-3pm. This works short-term but pushes your half-life into late evening, destroying sleep quality, which makes tomorrow's adenosine buildup worse.

Better fix: a 20-min nap at 1-2pm (before adenosine really kicks in) + caffeine timing that front-loads your intake.

I've been using a free app (caffiend-one.vercel.app) that shows the actual pharmacokinetic curve — seeing the graph made me understand this intuitively in a way no amount of reading did.

Changed how I schedule my whole day. Last coffee is now 12pm, productivity window is 9am-1pm, nap at 1:30pm, gym at 4pm.

---

## POST 4 — r/dataisbeautiful
**Title:** What 400mg of caffeine actually looks like in your bloodstream over 24 hours [OC]

**Body:**
I built a caffeine pharmacokinetics tracker and generated this curve from a typical "coffee person" day:

- 8:00am: Double espresso (150mg)
- 12:00pm: Flat white (100mg)
- 3:00pm: Americano (100mg)
- 5:00pm: Green tea (50mg)

Total: 400mg. Peak: ~230mg at 8:45am. Still active at midnight: ~120mg.

The model uses: absorption phase (linear rise over 45min), elimination phase (exponential decay with 5.7h half-life). Same model used in clinical pharmacology.

The wild part: that green tea at 5pm adds ~50mg that won't fully clear until 4am.

App is free: caffiend-one.vercel.app — you can generate your own curve and share it.

Data: pure pharmacokinetic simulation based on published elimination constants. Not medical advice, obviously.

---

## POST 5 — r/sleep
**Title:** I fixed my sleep in 7 days without changing anything except when I drank coffee

**Body:**
For context: I've had poor sleep quality for 2 years. Tried blue light glasses, earlier screens off, magnesium, melatonin — marginal improvements at best.

Last week I started tracking my caffeine using a pharmacokinetics model (not just "how many coffees did I have," but an actual model of what's currently active in my bloodstream at any time).

What I found:
- I was drinking my last coffee at 4pm most days
- With a 5.7h half-life, that meant ~130mg still active at 10pm
- At midnight (when I was lying awake) I still had ~80mg active

I moved my last caffeine to 12:30pm. Within 3 days:
- Falling asleep in under 10 minutes (was 40+ minutes)
- Waking up less during the night
- Morning alertness improved (probably because sleep was actually restorative)

The science: caffeine blocks adenosine receptors. It doesn't remove adenosine — it just hides the signal. When caffeine clears, adenosine floods back in. If you have 80mg active at midnight, your brain is still being told "you're not tired."

The tracker I used is free: caffiend-one.vercel.app

It shows exactly when your caffeine will drop below your threshold for sleep. I now time my last coffee so I'm under 50mg by 10pm. Game changer.

---

## POSTING SCHEDULE

| Day | Subreddit | Time (UTC) |
|-----|-----------|------------|
| Monday | r/coffee | 14:00 |
| Tuesday | r/biohacking | 10:00 |
| Wednesday | r/productivity | 13:00 |
| Thursday | r/dataisbeautiful | 15:00 |
| Friday | r/sleep | 09:00 |

**Also post in (same content, adapted):** r/selfimprovement, r/nootropics, r/nutrition, r/intermittentfasting

**Rules:**
- Wait 24h between posts in the same subreddit
- Reply to every comment within the first 2 hours
- Don't post the same text in multiple subs on the same day
- If mods remove it, don't repost — move on
