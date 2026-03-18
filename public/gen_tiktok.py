#!/usr/bin/env python3
"""Caffiend TikTok Carousel Generator — 30 days, 1080×1920 per slide"""

import os, textwrap
from pathlib import Path
from playwright.sync_api import sync_playwright

BASE = Path("C:/Users/Anisa/Caffiend App/public/tiktok-content")

WEEK_DIRS = {
    1: "Week 1 - Days 1-7",
    2: "Week 2 - Days 8-14",
    3: "Week 3 - Days 15-21",
    4: "Week 4 - Days 22-30",
}

THEME_COLORS = {
    "amber":  {"a": "#f59e0b", "b": "#f97316", "glow": "rgba(245,158,11,0.25)"},
    "violet": {"a": "#a78bfa", "b": "#7c3aed", "glow": "rgba(167,139,250,0.25)"},
    "red":    {"a": "#f87171", "b": "#dc2626", "glow": "rgba(248,113,113,0.25)"},
    "green":  {"a": "#34d399", "b": "#059669", "glow": "rgba(52,211,153,0.25)"},
}

TYPE_ACCENT = {
    "hook":    None,
    "stat":    "#f59e0b",
    "warning": "#f87171",
    "tip":     "#34d399",
    "compare": "#a78bfa",
    "cta":     None,
}

CAROUSELS = [
    # ── WEEK 1 ──────────────────────────────────────────────────────────────
    dict(day=1, week=1, slug="caffeine-hour-by-hour", theme="amber", slides=[
        dict(type="hook",    big="what happens to your body\nafter 1 cup of coffee", small="most people have no idea"),
        dict(type="stat",    big="10 mins", small="caffeine enters your bloodstream\nstarts blocking adenosine receptors"),
        dict(type="stat",    big="45 mins", small="peak concentration\ndopamine spikes · heart rate rises"),
        dict(type="stat",    big="5.7 hrs", small="half-life\nhalf of that coffee is STILL in you"),
        dict(type="warning", big="3pm coffee\n= awake at 1am", small="10 hours later: 25% still active\nyour body doesn't forget"),
        dict(type="cta",     big="track your exact\ncaffeine curve", small="free · no account · caffiend.app"),
    ]),
    dict(day=2, week=1, slug="nicotine-facts", theme="violet", slides=[
        dict(type="hook",    big="nicotine facts your\nbody didn't consent to", small="you need to know these"),
        dict(type="stat",    big="7 seconds", small="nicotine hits your brain\nfaster than IV heroin"),
        dict(type="stat",    big="20 mins", small="half-life in blood\ncraving cycle is designed around this"),
        dict(type="warning", big="4× more receptors", small="the more you use, the more you need\nthat's the trap"),
        dict(type="tip",     big="nicotine ≠ tobacco", small="the addiction is nicotine\nthe cancer is everything else in the smoke"),
        dict(type="cta",     big="understand what you\nput in your body", small="caffiend.app — stimulant tracking"),
    ]),
    dict(day=3, week=1, slug="why-you-crash", theme="amber", slides=[
        dict(type="hook",    big="why you crash\nafter coffee", small="the real reason nobody explains"),
        dict(type="stat",    big="adenosine", small="your brain's sleep chemical\ncaffeine delays it — doesn't remove it"),
        dict(type="warning", big="caffeine wears off\nadenosine floods in", small="all that built-up tiredness hits at once\nthat's the crash"),
        dict(type="stat",    big="cortisol spike", small="caffeine + morning cortisol\ndouble stimulus → bigger crash later"),
        dict(type="tip",     big="don't drink before\n9:30am", small="let cortisol peak first\ncoffee hits harder, crash hits softer"),
        dict(type="cta",     big="time your caffeine\nperfectly", small="free · caffiend.app"),
    ]),
    dict(day=4, week=1, slug="energy-drinks-truth", theme="red", slides=[
        dict(type="hook",    big="what energy drinks\nactually do to you", small="slide 3 will genuinely surprise you"),
        dict(type="stat",    big="80–300mg", small="caffeine per can\nMonster = 160mg · Bang = 300mg"),
        dict(type="warning", big="taurine + caffeine\n= unknown synergy", small="tested separately by FDA\nnever tested as a combination"),
        dict(type="warning", big="15,000+ ER visits\nper year", small="linked to energy drink consumption\nmostly from stacking with alcohol"),
        dict(type="stat",    big="27g sugar", small="in a standard Red Bull\nthen your glucose crashes too"),
        dict(type="cta",     big="know exactly what\nyou're consuming", small="free · caffiend.app"),
    ]),
    dict(day=5, week=1, slug="half-life-explained", theme="amber", slides=[
        dict(type="hook",    big="the number that will\nchange how you\ndrink coffee", small="it's 5.7"),
        dict(type="stat",    big="5.7 hours", small="caffeine's half-life\nhalf the dose still active after 5.7hrs"),
        dict(type="stat",    big="3pm coffee", small="9pm → 50% active\n3am → 25% active\n9am → 12% active"),
        dict(type="warning", big="you wake up\nstill caffeinated", small="yesterday's coffee\nstill in your system at breakfast"),
        dict(type="tip",     big="last coffee\nbefore 2pm", small="7hrs to clear 50%\nbefore a 9pm bedtime"),
        dict(type="cta",     big="see your caffeine\nlevel right now", small="free · caffiend.app"),
    ]),
    dict(day=6, week=1, slug="tolerance-science", theme="violet", slides=[
        dict(type="hook",    big="why your coffee\nstopped working", small="the science is uncomfortable"),
        dict(type="stat",    big="tolerance", small="your brain grows MORE adenosine receptors\nto compensate for caffeine blockage"),
        dict(type="warning", big="8–15 days", small="to build significant caffeine tolerance\nyou need more just to feel normal"),
        dict(type="stat",    big="withdrawal", small="headache · fatigue · brain fog\nstarts 12–24hrs after your last dose"),
        dict(type="tip",     big="2 days off\nresets 50% tolerance", small="caffeine cycling actually works\n4 days on · 2 days off"),
        dict(type="cta",     big="track your intake\nbuild smarter habits", small="free · caffiend.app"),
    ]),
    dict(day=7, week=1, slug="quit-caffeine-timeline", theme="red", slides=[
        dict(type="hook",    big="what happens when\nyou quit caffeine", small="day by day"),
        dict(type="warning", big="day 1–2", small="headache · irritability · fatigue\nadenosine receptors uncovered"),
        dict(type="warning", big="day 3–5", small="peak withdrawal\nflu-like symptoms · concentration gone"),
        dict(type="stat",    big="day 7–10", small="brain starts regulating\nsleep gets noticeably deeper"),
        dict(type="tip",     big="day 14+", small="baseline energy improves\nmore stable mood · less anxiety"),
        dict(type="cta",     big="understand your\ncaffeine dependency", small="free · caffiend.app"),
    ]),

    # ── WEEK 2 ──────────────────────────────────────────────────────────────
    dict(day=8, week=2, slug="nicotine-vs-caffeine", theme="violet", slides=[
        dict(type="hook",    big="nicotine vs caffeine\nan honest comparison", small="nobody actually talks about this"),
        dict(type="compare", big="addiction potential", small="nicotine: extremely high\ncaffeine: moderate\nboth cause physical dependence"),
        dict(type="compare", big="cognitive boost", small="nicotine: focus + memory\ncaffeine: alertness + speed\nboth: real, documented effects"),
        dict(type="warning", big="nicotine withdrawal", small="12–24hr onset\nfar more intense than caffeine"),
        dict(type="tip",     big="caffeine is safer\nbut not harmless", small="5+ cups/day = anxiety, dependency\nsleep disruption is often overlooked"),
        dict(type="cta",     big="track what goes\nin your body", small="free · caffiend.app"),
    ]),
    dict(day=9, week=2, slug="cortisol-coffee-windows", theme="amber", slides=[
        dict(type="hook",    big="the best and worst\ntimes to drink coffee", small="based on your cortisol curve"),
        dict(type="warning", big="7–9am ✗", small="cortisol peaks naturally\ncoffee here = wasted dose + more tolerance"),
        dict(type="tip",     big="9:30–11:30am ✓", small="cortisol dips\nbest window for caffeine impact"),
        dict(type="tip",     big="12–1pm ✓", small="second cortisol dip\nideal for your afternoon coffee"),
        dict(type="warning", big="after 2pm ✗", small="half-life math kicks in\n50% still active at 9pm"),
        dict(type="cta",     big="time your caffeine\nwith precision", small="free · caffiend.app"),
    ]),
    dict(day=10, week=2, slug="400mg-visualised", theme="amber", slides=[
        dict(type="hook",    big="what 400mg caffeine\nactually looks like", small="that's the FDA daily limit"),
        dict(type="stat",    big="4 espressos", small="= ~400mg\nstandard double shot = ~120mg"),
        dict(type="stat",    big="2 Monsters", small="= ~320mg\nclose to the limit in 2 cans"),
        dict(type="stat",    big="1 Bang Energy", small="= 300mg\n1 can = 75% of your daily limit"),
        dict(type="warning", big="most people\nexceed 400mg", small="and don't even realise\nbecause nobody tracks it"),
        dict(type="cta",     big="know your exact\ndaily total", small="free · caffiend.app"),
    ]),
    dict(day=11, week=2, slug="nicotine-brain-science", theme="violet", slides=[
        dict(type="hook",    big="how nicotine\nrewires your brain", small="more complex than you think"),
        dict(type="stat",    big="acetylcholine", small="nicotine mimics this neurotransmitter\nstimulates attention + memory circuits"),
        dict(type="stat",    big="dopamine +40%", small="that's the reward that creates craving\nyour brain learns to need it"),
        dict(type="warning", big="neuroplasticity", small="adolescent brains are 4× more\nvulnerable to nicotine addiction"),
        dict(type="tip",     big="therapeutic research", small="being studied for Parkinson's · ADHD\nAlzheimer's — nicotine is complex"),
        dict(type="cta",     big="understand the\nstimulants you use", small="free · caffiend.app"),
    ]),
    dict(day=12, week=2, slug="coffee-sleep-science", theme="amber", slides=[
        dict(type="hook",    big="how long caffeine\nactually ruins your sleep", small="the math is worse than you think"),
        dict(type="stat",    big="−1 hour", small="200mg caffeine 6hrs before bed\n= 1 hour less total sleep"),
        dict(type="warning", big="−20% deep sleep", small="caffeine cuts slow-wave sleep\nthat's the restorative phase"),
        dict(type="warning", big="sleep quality\nnot just duration", small="8hrs but skipping the repair cycle\nyou wake up still tired"),
        dict(type="tip",     big="genetics matter", small="CYP1A2 gene controls metabolism speed\nslow metabolisers feel it twice as long"),
        dict(type="cta",     big="find your safe\nsleep cutoff", small="free · caffiend.app"),
    ]),
    dict(day=13, week=2, slug="drinks-ranked-caffeine", theme="amber", slides=[
        dict(type="hook",    big="5 drinks ranked\nby caffeine", small="number 1 will surprise you"),
        dict(type="stat",    big="5. green tea", small="25–50mg per cup\nl-theanine slows absorption"),
        dict(type="stat",    big="4. espresso", small="60–75mg per shot\nhigh concentration, small volume"),
        dict(type="stat",    big="3. drip coffee", small="95–200mg per cup\nhighest variance of any drink"),
        dict(type="stat",    big="2. energy shots", small="200mg in 60ml\nconcentrated dose, fast hit"),
        dict(type="stat",    big="1. death wish coffee", small="728mg per cup\n2× the FDA daily limit in one mug"),
        dict(type="cta",     big="scan any drink\nand track it", small="free · caffiend.app"),
    ]),
    dict(day=14, week=2, slug="pre-workout-truth", theme="red", slides=[
        dict(type="hook",    big="what pre-workout\nactually does to you", small="the supplement industry hides this"),
        dict(type="stat",    big="150–400mg caffeine", small="per scoop\nsome are 2× a strong coffee"),
        dict(type="warning", big="proprietary blends", small="legal to not disclose exact amounts\nyou don't know what you're taking"),
        dict(type="warning", big="beta-alanine tingles", small="harmless but unregulated\nbinds to receptors causing prickling"),
        dict(type="tip",     big="daily pre-workout\n= tolerance", small="you need it just to feel 'normal'\nthat's dependency"),
        dict(type="cta",     big="track every\nstimulant you take", small="free · caffiend.app"),
    ]),

    # ── WEEK 3 ──────────────────────────────────────────────────────────────
    dict(day=15, week=3, slug="coffee-anxiety-science", theme="amber", slides=[
        dict(type="hook",    big="why coffee makes\nyou anxious", small="it's not in your head"),
        dict(type="stat",    big="cortisol + caffeine", small="double cortisol spike\nanxiety pathway: fully activated"),
        dict(type="stat",    big="adenosine blocked", small="adenosine calms your nervous system\ncaffeine removes the brake entirely"),
        dict(type="warning", big="mimics panic attacks", small="tachycardia · sweating · racing thoughts\nindistinguishable for some people"),
        dict(type="tip",     big="200mg threshold", small="for anxiety-prone individuals\nstay under 200mg and always eat first"),
        dict(type="cta",     big="stay under your\nthreshold", small="free · caffiend.app"),
    ]),
    dict(day=16, week=3, slug="alcohol-caffeine", theme="red", slides=[
        dict(type="hook",    big="what alcohol does\nto caffeine in your body", small="this one is genuinely dangerous"),
        dict(type="warning", big="wide awake drunk", small="caffeine masks alcohol sedation\nyou feel more sober than you are"),
        dict(type="warning", big="you drink more", small="stimulated state = lower perceived intoxication\nyou go past your limit"),
        dict(type="stat",    big="FDA banned\nFour Loko", small="in 2010 — premixed caffeine + alcohol\ntoo dangerous to sell"),
        dict(type="tip",     big="vodka Red Bull\nis the same", small="same mechanism\njust self-mixed"),
        dict(type="cta",     big="know what\nyou're stacking", small="free · caffiend.app"),
    ]),
    dict(day=17, week=3, slug="matcha-vs-coffee", theme="green", slides=[
        dict(type="hook",    big="matcha vs coffee\nan honest breakdown", small="the l-theanine difference changes everything"),
        dict(type="stat",    big="coffee", small="~120mg caffeine\nfast spike · fast crash · jitters common"),
        dict(type="stat",    big="matcha", small="~70mg caffeine + 30mg l-theanine\nslower release · smoother energy"),
        dict(type="tip",     big="l-theanine", small="amino acid promoting calm focus\ncrosses blood-brain barrier with caffeine"),
        dict(type="compare", big="winner?", small="focus + calm: matcha wins\nfast energy boost: coffee wins\nboth valid"),
        dict(type="cta",     big="track both\nthe same way", small="free · caffiend.app"),
    ]),
    dict(day=18, week=3, slug="bodyweight-caffeine", theme="amber", slides=[
        dict(type="hook",    big="your caffeine dose\nshould be based on\nyour body weight", small="most people are getting this wrong"),
        dict(type="stat",    big="3–6 mg/kg", small="optimal caffeine dose per kg body weight\nevidence-based, not arbitrary"),
        dict(type="stat",    big="68kg person", small="200–400mg optimal\n= 2–4 espressos"),
        dict(type="warning", big="50kg person", small="150–300mg max\nmost guides completely ignore this"),
        dict(type="tip",     big="bigger person\nbigger dose", small="a 90kg person can handle\n270–540mg safely"),
        dict(type="cta",     big="calculate your\npersonal dose", small="free · caffiend.app"),
    ]),
    dict(day=19, week=3, slug="nicotine-pouches-vs-cigs", theme="violet", slides=[
        dict(type="hook",    big="nicotine pouches\nvs cigarettes", small="what the science actually says"),
        dict(type="stat",    big="0 tar · 0 smoke", small="pouches deliver nicotine without combustion\nthe main cancer pathway is removed"),
        dict(type="warning", big="still addictive", small="same nicotine = same dependency\n'less harmful' ≠ 'safe'"),
        dict(type="stat",    big="95% less harmful", small="estimated by Public Health England\ncompared to cigarettes, not to zero"),
        dict(type="warning", big="gum recession", small="long-term use linked to gum damage\nover time"),
        dict(type="cta",     big="understand what\nyou consume", small="free · caffiend.app"),
    ]),
    dict(day=20, week=3, slug="caffeine-amplifiers", theme="amber", slides=[
        dict(type="hook",    big="5 things that make\ncaffeine hit harder", small="you've definitely done some of these"),
        dict(type="tip",     big="empty stomach", small="caffeine absorbs 30% faster\nno food = more intense spike"),
        dict(type="tip",     big="l-theanine stack", small="200mg caffeine + 200mg l-theanine\nclean focus, studied combination"),
        dict(type="warning", big="sleep deprivation", small="caffeine hits harder on no sleep\nand also works less well"),
        dict(type="tip",     big="cold brew", small="higher caffeine concentration per ml\nlower acid, same molecule"),
        dict(type="warning", big="stress", small="cortisol + caffeine = amplified anxiety\nhigh-stress day? lower your dose"),
        dict(type="cta",     big="time and dose\nperfectly", small="free · caffiend.app"),
    ]),
    dict(day=21, week=3, slug="caffeine-detox-timeline", theme="red", slides=[
        dict(type="hook",    big="the caffeine detox\ntimeline nobody\nshows you", small="it's not pretty"),
        dict(type="warning", big="hours 12–24", small="first headache hits\ncaused by blood vessel dilation"),
        dict(type="warning", big="day 2–3", small="peak symptoms\nfatigue · brain fog · nausea possible"),
        dict(type="stat",    big="day 4–5", small="body starts adjusting\nnatural adenosine balance returning"),
        dict(type="tip",     big="day 7–14", small="energy stabilises\nno more dependency-driven tiredness"),
        dict(type="cta",     big="understand your\ndependency level", small="free · caffiend.app"),
    ]),

    # ── WEEK 4 ──────────────────────────────────────────────────────────────
    dict(day=22, week=4, slug="500mg-caffeine", theme="red", slides=[
        dict(type="hook",    big="what 500mg of caffeine\ndoes to your body", small="above the FDA daily limit"),
        dict(type="warning", big="heart palpitations", small="at 500mg+ most people experience\nirregular heartbeat sensation"),
        dict(type="warning", big="caffeine toxicity", small="starts at ~1000mg for most adults\n500mg is the serious warning zone"),
        dict(type="stat",    big="LD50 = ~150mg/kg", small="lethal dose for most adults\n~10,500mg for a 70kg person"),
        dict(type="warning", big="energy drink stacking", small="3× Bang = 900mg\npeople do this before the gym"),
        dict(type="cta",     big="stay inside\nyour safe zone", small="free · caffiend.app"),
    ]),
    dict(day=23, week=4, slug="nicotine-cognitive-benefits", theme="violet", slides=[
        dict(type="hook",    big="nicotine's surprising\ncognitive benefits", small="this is peer-reviewed research"),
        dict(type="tip",     big="working memory", small="nicotine improves working memory\nbetter than most nootropics in studies"),
        dict(type="tip",     big="attention span", small="significant improvement in sustained attention\nin non-smokers tested"),
        dict(type="stat",    big="alzheimer's research", small="nicotinic receptors are a target\nin Alzheimer's drug development"),
        dict(type="warning", big="but", small="addiction outweighs benefits for most\nresearch uses pure nicotine, not products"),
        dict(type="cta",     big="know your\nstimulants", small="free · caffiend.app"),
    ]),
    dict(day=24, week=4, slug="truth-about-decaf", theme="amber", slides=[
        dict(type="hook",    big="the truth about\ndecaf coffee", small="it's not what you think"),
        dict(type="warning", big="decaf ≠ caffeine free", small="97% removed\nbut 3% of 200mg = still 6mg per cup"),
        dict(type="stat",    big="10 cups decaf", small="= roughly 1 regular coffee\nit adds up fast"),
        dict(type="warning", big="still affects sleep", small="sensitive individuals feel it\nespecially late at night"),
        dict(type="tip",     big="the placebo is real", small="studies show decaf drinkers report\n40% of the alertness of regular coffee"),
        dict(type="cta",     big="track everything\neven decaf", small="free · caffiend.app"),
    ]),
    dict(day=25, week=4, slug="stimulants-half-lives", theme="violet", slides=[
        dict(type="hook",    big="how long stimulants\nstay in your body", small="the half-lives explained"),
        dict(type="stat",    big="caffeine", small="half-life: 5.7 hours\nfully clear: ~24 hours"),
        dict(type="stat",    big="nicotine", small="half-life: 1–2 hours\nbut cotinine metabolite: 16–19 hours"),
        dict(type="stat",    big="alcohol", small="clears at 0.015% BAC per hour\n5 drinks = ~10 hours to clear"),
        dict(type="warning", big="stacking all three", small="none clears before the next dose\nyour body is never baseline"),
        dict(type="cta",     big="see your levels\nin real time", small="free · caffiend.app"),
    ]),
    dict(day=26, week=4, slug="worst-caffeine-mistakes", theme="amber", slides=[
        dict(type="hook",    big="5 caffeine mistakes\nyou're definitely making", small="most people get all 5 wrong"),
        dict(type="warning", big="coffee at 7am", small="cortisol already high\nyour coffee does almost nothing"),
        dict(type="warning", big="3pm coffee\non autopilot", small="= midnight insomnia\nevery single time"),
        dict(type="warning", big="no food first", small="empty stomach = anxiety spike\nnot just faster absorption"),
        dict(type="warning", big="never taking breaks", small="100% tolerance means you need caffeine\njust to feel normal"),
        dict(type="cta",     big="stop guessing\nstart tracking", small="free · caffiend.app"),
    ]),
    dict(day=27, week=4, slug="perfect-dose-formula", theme="amber", slides=[
        dict(type="hook",    big="the perfect caffeine\ndose formula", small="based on your actual body"),
        dict(type="tip",     big="step 1", small="weight in kg × 3mg\n= your minimum effective dose"),
        dict(type="tip",     big="step 2", small="weight in kg × 6mg\n= your maximum optimal dose"),
        dict(type="stat",    big="example: 70kg", small="min: 210mg · max: 420mg\n= 2–4 espressos"),
        dict(type="warning", big="adjust for tolerance", small="regular drinker: add 50mg\nnon-drinker: subtract 50mg"),
        dict(type="cta",     big="caffiend calculates\nthis for you", small="free · caffiend.app"),
    ]),
    dict(day=28, week=4, slug="cellular-level-caffeine", theme="violet", slides=[
        dict(type="hook",    big="what caffeine does\nat the cellular level", small="this is how it actually works"),
        dict(type="stat",    big="adenosine antagonist", small="caffeine occupies receptors without activating\nthem — competitive blocking"),
        dict(type="stat",    big="cAMP increases", small="caffeine inhibits phosphodiesterase\ncausing energy signal cascade in cells"),
        dict(type="stat",    big="adrenaline release", small="pituitary gland triggers adrenal glands\nyour body enters mild fight-or-flight"),
        dict(type="tip",     big="borrowed alertness", small="you're not generating more energy\nyou're masking fatigue signals"),
        dict(type="cta",     big="understand your\nbody better", small="free · caffiend.app"),
    ]),
    dict(day=29, week=4, slug="rapid-fire-facts", theme="amber", slides=[
        dict(type="hook",    big="10 caffeine facts\nyou probably don't know", small="rapid fire"),
        dict(type="stat",    big="it's a pesticide", small="plants make caffeine to kill insects\nwe drink it for fun"),
        dict(type="stat",    big="world's #1\npsychoactive drug", small="90% of adults consume it daily\nmore than alcohol + nicotine combined"),
        dict(type="warning", big="NASA spider study", small="caffeinated spiders built the most\ndisordered, irregular webs"),
        dict(type="tip",     big="the coffee nap", small="espresso → 20 min sleep → wake up\ncaffeine peaks just as you wake"),
        dict(type="cta",     big="track the world's\nmost used drug", small="free · caffiend.app"),
    ]),
    dict(day=30, week=4, slug="been-caffeinating-wrong", theme="amber", slides=[
        dict(type="hook",    big="you've been\ncaffeinating wrong\nyour whole life", small="30-day summary"),
        dict(type="warning", big="wrong timing", small="7am coffee at cortisol peak\nhits like warm water"),
        dict(type="warning", big="wrong dose", small="not adjusting for body weight\neither too much or too little"),
        dict(type="warning", big="wrong cutoff", small="half-life math means\nlast coffee should be before 2pm"),
        dict(type="tip",     big="one app\nfixes all three", small="real-time curve · dose calculator\nsleep predictor · free"),
        dict(type="cta",     big="start today\nit's free", small="caffiend.app — no account needed"),
    ]),
]

# ── HTML TEMPLATE ─────────────────────────────────────────────────────────────

def slide_html(slide, theme, slide_num, total):
    c = THEME_COLORS[theme]
    accent = TYPE_ACCENT.get(slide["type"]) or c["a"]
    stype  = slide["type"]
    big    = slide["big"].replace("\n", "<br>")
    small  = slide.get("small", "").replace("\n", "<br>")

    # Background
    if stype in ("hook", "cta"):
        bg = f"background: linear-gradient(160deg, #0d0d12 0%, #0a0a10 50%, #060608 100%);"
        overlay = f"""
          <div style="position:absolute;inset:0;background:radial-gradient(ellipse at 50% 40%, {c['glow']} 0%, transparent 65%);"></div>
          <div style="position:absolute;inset:0;background:linear-gradient(135deg, {c['a']}08 0%, transparent 60%);"></div>
        """
    else:
        bg = "background: #060608;"
        overlay = f"""<div style="position:absolute;inset:0;background:radial-gradient(ellipse at 50% 30%, {c['glow']} 0%, transparent 60%);opacity:.5;"></div>"""

    # Big text size
    big_len = len(slide["big"].replace("\n", ""))
    big_size = "96px" if big_len < 25 else "80px" if big_len < 40 else "68px"

    # Accent bar for non-hook/cta
    accent_bar = "" if stype in ("hook", "cta") else f"""
      <div style="width:80px;height:4px;background:linear-gradient(90deg,{accent},{c['b']});border-radius:2px;margin:0 auto 40px;"></div>
    """

    # Type label badge
    badge_map = {
        "stat":    ("STAT",    c["a"]),
        "warning": ("WARNING", "#f87171"),
        "tip":     ("TIP",     "#34d399"),
        "compare": ("COMPARE", "#a78bfa"),
        "hook":    ("",        "transparent"),
        "cta":     ("",        "transparent"),
    }
    badge_text, badge_color = badge_map.get(stype, ("", "transparent"))
    badge_html = f"""<div style="display:inline-block;background:{badge_color}22;border:1px solid {badge_color}44;
      color:{badge_color};font-size:18px;letter-spacing:4px;padding:6px 20px;border-radius:4px;margin-bottom:40px;font-weight:700;">
      {badge_text}</div>""" if badge_text else ""

    # CTA special layout
    if stype == "cta":
        content = f"""
          <div style="font-size:24px;letter-spacing:6px;color:{c['a']};text-transform:uppercase;margin-bottom:32px;opacity:.8;">CAFFIEND</div>
          <div style="font-size:{big_size};font-weight:800;line-height:1.15;color:#ffffff;margin-bottom:36px;">{big}</div>
          <div style="font-size:28px;color:#ffffff99;margin-bottom:60px;">{small}</div>
          <div style="background:linear-gradient(90deg,{c['a']},{c['b']});padding:24px 64px;border-radius:8px;
            font-size:30px;font-weight:700;color:#000;letter-spacing:2px;">caffiend.app</div>
        """
    elif stype == "hook":
        swipe = slide.get("tag", "SWIPE →")
        content = f"""
          <div style="font-size:22px;letter-spacing:6px;color:{c['a']};text-transform:uppercase;margin-bottom:48px;opacity:.7;">CAFFIEND</div>
          <div style="font-size:{big_size};font-weight:800;line-height:1.2;color:#ffffff;margin-bottom:40px;">{big}</div>
          <div style="width:60px;height:2px;background:linear-gradient(90deg,{c['a']},{c['b']});margin:0 auto 36px;"></div>
          <div style="font-size:26px;color:#ffffff88;margin-bottom:80px;">{small}</div>
          <div style="font-size:20px;letter-spacing:4px;color:{c['a']};animation:none;">{swipe}</div>
        """
    else:
        big_color = accent if stype in ("stat", "warning", "tip") else "#ffffff"
        content = f"""
          {badge_html}
          {accent_bar}
          <div style="font-size:{big_size};font-weight:800;line-height:1.2;color:{big_color};margin-bottom:36px;">{big}</div>
          <div style="font-size:30px;color:#ffffff88;line-height:1.6;">{small}</div>
        """

    # Slide dots
    dots = "".join(
        f'<div style="width:{"24px" if i+1==slide_num else "8px"};height:8px;border-radius:4px;'
        f'background:{"linear-gradient(90deg,"+c["a"]+","+c["b"]+")" if i+1==slide_num else "#ffffff22"};'
        f'transition:all .3s;"></div>'
        for i in range(total)
    )

    return f"""<!DOCTYPE html><html><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700;800&display=swap" rel="stylesheet">
<style>
  * {{ margin:0; padding:0; box-sizing:border-box; }}
  body {{
    width:1080px; height:1920px; overflow:hidden;
    {bg}
    font-family:'JetBrains Mono',monospace;
    display:flex; flex-direction:column;
    align-items:center; justify-content:center;
    text-align:center; position:relative;
  }}
</style></head><body>
  {overlay}
  <!-- grid lines -->
  <div style="position:absolute;inset:0;opacity:.03;background:
    repeating-linear-gradient(0deg,transparent,transparent 79px,#ffffff 79px,#ffffff 80px),
    repeating-linear-gradient(90deg,transparent,transparent 79px,#ffffff 79px,#ffffff 80px);"></div>

  <!-- main content -->
  <div style="position:relative;z-index:2;padding:80px;max-width:920px;width:100%;">
    {content}
  </div>

  <!-- bottom bar -->
  <div style="position:absolute;bottom:60px;left:0;right:0;z-index:3;display:flex;flex-direction:column;align-items:center;gap:20px;">
    <div style="display:flex;gap:10px;align-items:center;">{dots}</div>
    <div style="font-size:18px;letter-spacing:3px;color:#ffffff33;">{slide_num} / {total}</div>
  </div>

  <!-- corner brand -->
  <div style="position:absolute;top:50px;right:60px;z-index:3;font-size:18px;letter-spacing:3px;
    color:{c['a']};opacity:.5;font-weight:700;">☕ CAFFIEND</div>
</body></html>"""


# ── MAIN ──────────────────────────────────────────────────────────────────────

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)

        for carousel in CAROUSELS:
            week_dir = BASE / WEEK_DIRS[carousel["week"]]
            day_dir  = week_dir / f"Day {carousel['day']:02d} - {carousel['slug']}"
            day_dir.mkdir(parents=True, exist_ok=True)

            slides = carousel["slides"]
            total  = len(slides)

            for idx, slide in enumerate(slides):
                html = slide_html(slide, carousel["theme"], idx + 1, total)
                page = browser.new_page(viewport={"width": 1080, "height": 1920})

                # Write HTML to temp file
                tmp = day_dir / f"_tmp_{idx}.html"
                tmp.write_text(html, encoding="utf-8")

                page.goto(tmp.as_uri())
                page.wait_for_load_state("networkidle")
                page.wait_for_timeout(400)  # let fonts render

                out = day_dir / f"slide-{idx+1:02d}.png"
                page.screenshot(path=str(out), clip={"x":0,"y":0,"width":1080,"height":1920})
                page.close()
                tmp.unlink()

            print(f"Day {carousel['day']:02d}  {carousel['slug']}  ({total} slides)")

        browser.close()

    print("\nAll 30 carousels generated.")

if __name__ == "__main__":
    main()
