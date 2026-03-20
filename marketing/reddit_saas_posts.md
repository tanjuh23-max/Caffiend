# Caffiend — Reddit Launch Scripts (SaaS Communities)
## Based on real patterns from successful indie hacker launches

**THE RULES (do not break these):**
- NEVER put the app link in the post body on subs with 500k+ members — bots auto-remove it
- Put the link in a comment AFTER posting, or just say "DM me" or "link in my profile"
- Never post and disappear — reply to every comment in the first 2 hours
- Don't post the same text across multiple subs on the same day
- If you have low Reddit karma, build it up first by commenting for a few days before posting
- Match the tone of the specific sub — they're all different

---

## r/SaaS (264K members)
**Where to post:** Weekly "Feedback / Roast My SaaS" sticky thread (check pinned post)
**Tone:** Raw honesty, builder-to-builder, real numbers

> **[Post in the feedback sticky thread]**
>
> **Caffiend — caffeine pharmacokinetics tracker. 4 months in, looking for brutal feedback.**
>
> What it does: you log what you drank and when, it shows a real-time curve of what's currently active in your bloodstream using the actual pharmacokinetic model (absorption phase + exponential decay with 5.7h half-life). Shows when you'll drop below your sleep threshold.
>
> The hook: every other caffeine app just counts cups. This one models what's *actually active* in your blood right now — same model used in clinical pharmacology.
>
> Where I'm stuck:
> - The value proposition is clear to me but I'm struggling to explain it in one sentence to someone who doesn't know what a half-life is
> - Conversion from landing page → first log is low — people don't get the "aha moment" until they add their first drink
> - Currently free, launching Pro tier (barcode scanner, export, full analytics) — not sure if the paywall is in the right place
>
> What I'd love feedback on: is the landing page copy clear? Does the first-run experience make sense? What would make you actually log your first drink?
>
> Link: [in comment below]

**Then add a comment:**
> Link: caffiend-one.vercel.app — genuinely would love harsh feedback, the curve chart is the bit I'm most proud of technically

---

## r/startups (1.2M members)
**Where to post:** Standalone post — NO link in body (auto-removed by bots)
**Tone:** Founder story, vulnerability, transparency about why you built it

**Title:** `I built a caffeine tracker that uses real pharmacokinetics after 2 years of terrible sleep — here's what I learned`

**Body:**
> For about two years I had really bad sleep. Tried everything — no screens before bed, magnesium, earlier nights, melatonin. Nothing worked consistently.
>
> Then I learned something that felt obvious in hindsight: caffeine has a 5.7-hour half-life. That means a coffee at 3pm still has 100mg active at 9pm and 50mg at 3am. I was drinking coffee until 4pm every day and wondering why I couldn't switch off.
>
> I built Caffiend to make this visible. You log what you drank and when, it draws the full pharmacokinetic curve — absorption phase, peak, elimination — and shows you exactly when you'll be under 50mg (a safe threshold for most people).
>
> The insight that surprised me most: it's not about *how much* you drink, it's about *when*. I was drinking roughly the same caffeine as before, just front-loaded. Sleep fixed itself within a week.
>
> What I'm learning from building this:
> - Health apps live or die on the "aha moment." For Caffiend that moment is when someone logs their first drink and sees the curve — before that, it's just another tracker
> - The USP (pharmacokinetics) is both the best and hardest part. It's genuinely different from anything out there but it requires explaining something most people didn't know they needed to understand
> - PWAs are underrated for early-stage health tools — no App Store friction, installs in 2 taps
>
> Happy to answer anything about the build or the science behind the model. Also would genuinely appreciate feedback on the landing page — I'll drop a link in the comments.

**Comment after posting:**
> Link for anyone curious: caffiend-one.vercel.app — the curve chart is the part I spent the most time on. Feedback welcome, especially on whether the first-run experience makes the value clear.

---

## r/indiehackers (or r/EntrepreneurRideAlong)
**Tone:** Build in public, metrics upfront, casual, "figuring it out" energy

**Title:** `Built a caffeine science app in 4 months. £0 MRR. Launching Pro this week. Here's the honest state of it.`

**Body:**
> **What I built:** Caffiend — a caffeine tracker that models the actual pharmacokinetics of caffeine in your body. Not just "log your cups." A live curve showing peak, decay, and when you'll be clear to sleep.
>
> **The numbers:**
> - 4 months building (nights + weekends)
> - ~200 drinks in the database including every Monster/Red Bull variant, all Starbucks, pre-workouts
> - Barcode scanner that looks up any product
> - Stack: React + Vite + PWA + Supabase + Vercel
> - MRR: £0 (launched free tier first, Pro goes live this week)
>
> **What's working:**
> - The "aha moment" is genuinely real — the first time you log a 3pm coffee and see it's still 100mg active at 9pm, something clicks
> - SEO blog content is pulling in organic traffic (10 articles targeting things like "caffeine half life calculator")
> - Product Hunt launch is Tuesday. No idea if it'll go well.
>
> **What's not working:**
> - Landing page → first log conversion is weak. People land, see the curve, think "cool" and leave
> - Explaining pharmacokinetics without making people feel like they need a biology degree
> - Instagram Reels auto-posting via GitHub Actions — works technically but the content wasn't good enough so I paused it
>
> **The honest question I need answered:** if you landed on this app and didn't immediately log a drink — what stopped you?
>
> caffiend-one.vercel.app

---

## r/entrepreneur (1.4M members)
**Where to post:** Standalone post OR the weekly self-promotion thread
**Tone:** Resource-first. Don't pitch the product — give a useful list that includes the product naturally.

**Title:** `I compiled every free tool I used to track my health metrics obsessively for 6 months — here's the full list`

**Body:**
> Six months ago I went full biohacker mode. I wanted to actually track the things that affect how I feel and perform. Here's every tool I used, all free:
>
> **Caffeine / Energy:**
> - Caffiend (caffiend-one.vercel.app) — pharmacokinetic caffeine modelling. Shows your actual active caffeine level in real time, not just cup count. I built this one after nothing else did what I needed.
> - Caffeine Informer — great database for looking up caffeine content
>
> **Sleep:**
> - Sleep Cycle (free tier) — alarm that wakes you in light sleep phase
> - Oura Ring companion app (if you have the ring)
>
> **HRV / Recovery:**
> - HRV4Training — camera-based HRV measurement, no chest strap needed
> - Elite HRV — good free tier
>
> **Nutrition:**
> - Cronometer — the most complete macro/micro tracker I've used. Ugly UI, powerful data.
>
> **Stress / Nervous System:**
> - Wim Hof app — guided breathing, genuinely affects HRV
> - Stresser app (Android) — galvanic skin response via camera
>
> **What I actually learned:** caffeine timing was the single biggest lever for sleep quality, by far. Moving my last coffee from 4pm to 12:30pm made more difference than every other change combined. The Caffiend curve made that obvious — seeing 80mg still active at midnight on a graph hits differently than reading about half-life abstractly.
>
> Happy to go deeper on any of these or share what the data actually showed over 6 months.

---

## r/webdev (3.2M members)
**IMPORTANT: Only post on Showoff Saturday (every Saturday)**
**Tone:** Technical achievement first. The product is secondary to the interesting engineering.

**Title (for Showoff Saturday):** `Showoff Saturday: built a pharmacokinetics engine in the browser — real-time caffeine metabolism curve as a PWA`

**Body:**
> Happy to share what I've been working on for the last few months.
>
> **The interesting part technically:**
> The core is a pharmacokinetic model running entirely client-side in JS. Two phases:
> 1. Absorption: linear rise over 45 mins from ingestion time (models gut → bloodstream transfer)
> 2. Elimination: exponential decay using a 5.7h half-life constant (C(t) = C0 * 0.5^(t/5.7))
>
> When you have multiple drinks at different times, each has its own independent curve and you sum the active amounts at any given t. The engine recalculates every minute and drives a Recharts area chart in real time.
>
> The tricky bit: the "current time" marker has to stay accurate even when the tab is backgrounded. Used a visibility change listener + timestamp delta to catch up after the browser throttles the interval.
>
> **What I actually built it for:**
> It's a caffeine tracker (Caffiend). The USP is showing the actual pharmacokinetic curve rather than just logging cups. Also has a barcode scanner hooked to Open Food Facts API for caffeine lookups.
>
> **Stack:** React 18 + Vite + Recharts + html5-qrcode + Supabase + Vite PWA plugin. No native wrapper — installs as a PWA.
>
> Link: caffiend-one.vercel.app — would love technical feedback on the model or the curve rendering if anyone has thoughts.

---

## r/coffee (specifically — your best sub)
**Tone:** Coffee lover talking to coffee lovers. Not "I built an app." Just a person sharing what they found.

**Title:** `I tracked my caffeine pharmacokinetics for 30 days — here's what changed`

**Body:**
> I've been a 3-4 coffees a day person for years. Not cutting down — just got curious about the timing.
>
> The thing I didn't know: caffeine has a 5.7-hour half-life. Not "wears off after 5 hours" — *half-life*. Which means 200mg at 3pm = 100mg at 9pm = 50mg at 3am.
>
> I started logging every drink and tracking the curve. What I found:
>
> **The espresso vs. flat white difference is about speed, not amount.** The smaller volume of an espresso absorbs faster — sharper peak, faster drop. A flat white with the same shots hits a slightly lower, more sustained peak because the milk slows absorption.
>
> **Cold brew is genuinely different.** Slower absorption (the cold brew concentrate is more concentrated obviously, but also the extraction process produces different compounds that affect absorption rate). The peak was later and the drop was slower in my tracking.
>
> **The afternoon "crash" isn't when caffeine runs out — it's when it drops relative to your peak.** You still have a ton of caffeine active at 3pm, but adenosine has been building the whole time. The relative drop triggers the crash feeling even though you'd technically measure significant caffeine in blood.
>
> I used a free web app called Caffiend (caffiend-one.vercel.app) to model all this — it draws the actual pharmacokinetic curve. Happy to share more of the data if anyone's interested, or just nerd out on the science.
>
> Anyone else gone down this rabbit hole?

---

## POSTING ORDER & TIMING

| Day | Sub | Time (UK) | Notes |
|-----|-----|-----------|-------|
| Mon 23 Mar | r/indiehackers | 12:00 | Before PH launch — build-in-public angle |
| Tue 24 Mar | r/SaaS | 10:00 | In weekly feedback thread |
| Wed 25 Mar | r/startups | 13:00 | Post-PH launch story |
| Thu 26 Mar | r/coffee | 09:00 | Most natural fit — pure value post |
| Fri 27 Mar | r/entrepreneur | 14:00 | Resource list post |
| Sat 28 Mar | r/webdev | 10:00 | Showoff Saturday — technical post |

**Don't do these at the same time. Space them out. If one blows up, double down on that sub.**
