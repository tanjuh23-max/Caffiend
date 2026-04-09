# FocusBro — Claude Code Design System

## Project Overview
FocusBro is an ADHD focus app with a goblin mascot. It mirrors Brainrot's methodology (mascot health degrades with bad habits, recovers with focus) but targets ADHD users. Built with React 18 + Vite + Tailwind CSS + GSAP.

---

## Design Principles

### 1. Goblin First
The goblin mascot is always the visual hero. Every screen should feel like it exists *around* the goblin, not the other way round. Never shrink the mascot to fit content — shrink the content.

### 2. Light & Natural
- Background: `#f2fde8` (soft mint-white)
- Cards/surfaces: `#ffffff`
- Card borders: `#d1f0b8`
- Never use dark backgrounds on main screens (that's Caffiend's territory)

### 3. Forest Green System (NOT amber/yellow — that's Caffiend)
```
Primary action:    #15803d   (forest green)
Primary hover:     #166534
Accent/HP:         #22c55e   (bright green)
Lime highlight:    #84cc16   (lime for streaks/rewards)
Danger/overdue:    #dc2626   (red)
Warning:           #d97706   (amber — for warnings ONLY)
Done/complete:     #7c3aed   (purple)
```

### 4. Typography Scale
```
Hero heading:    32px / weight 900 / tracking -1px
Section heading: 26px / weight 900
Card heading:    20px / weight 800
Body:            15–16px / weight 500
Label:           12–13px / weight 700 / uppercase / tracking 2px
Timer display:   64–80px / weight 900 / tabular-nums
```
Font: Inter. Always use `-webkit-font-smoothing: antialiased`.

### 5. Spacing & Radius
```
Screen padding:    px-5 (20px)
Card padding:      16–20px
Card radius:       16–20px (rounded-2xl)
Button radius:     18px (rounded-[18px])
Pill radius:       99px
Gap between cards: 12px
Section gap:       24–32px
```

### 6. Shadows & Glow
- Primary button: `box-shadow: 0 8px 32px rgba(21,128,61,0.35)`
- Goblin glow: `filter: drop-shadow(0 0 24px rgba(34,197,94,0.5))`
- Danger glow: `filter: drop-shadow(0 0 16px rgba(220,38,38,0.4))`
- Cards: no shadow — use border instead

---

## Component Patterns

### Primary Button
```jsx
<button style={{
  width: '100%',
  padding: '18px',
  borderRadius: 18,
  background: '#15803d',
  color: 'white',
  fontSize: 18,
  fontWeight: 900,
  border: 'none',
  boxShadow: '0 8px 32px rgba(21,128,61,0.35)'
}}>
  Action Label →
</button>
```

### Secondary Button
```jsx
<button style={{
  background: 'white',
  border: '2px solid #d1f0b8',
  borderRadius: 16,
  padding: '14px 20px',
  color: '#0f2008',
  fontWeight: 700
}}>
  Label
</button>
```

### Stat Card
```jsx
<div style={{
  padding: 16,
  borderRadius: 16,
  background: 'white',
  border: '1px solid #d1f0b8',
  textAlign: 'center'
}}>
  <p style={{ fontSize: 28, fontWeight: 900, color: '#15803d' }}>Value</p>
  <p style={{ fontSize: 12, color: '#7aaa6a', marginTop: 2 }}>Label</p>
</div>
```

### HP / Progress Bar
```jsx
<div style={{ width: '100%', height: 14, borderRadius: 99, background: '#d1f0b8', overflow: 'hidden' }}>
  <div style={{
    height: '100%',
    width: `${pct}%`,
    borderRadius: 99,
    background: 'linear-gradient(90deg, #22c55e, #84cc16)',
    boxShadow: '0 0 12px rgba(34,197,94,0.5)',
    transition: 'width 0.7s ease'
  }}/>
</div>
```

### Section Label (uppercase pill)
```jsx
<p style={{
  fontSize: 12,
  fontWeight: 700,
  color: '#7aaa6a',
  textTransform: 'uppercase',
  letterSpacing: '2px'
}}>
  Section Name
</p>
```

### Paywall Card (selected state)
- Selected + highlight: `background: #15803d`, white text, `boxShadow: 0 8px 28px rgba(21,128,61,0.35)`
- Selected normal: `background: #f0fce8`, `border: 2px solid #15803d`
- Unselected: `background: white`, `border: 2px solid #d1f0b8`

---

## Layout Rules

### Screen Structure
```
safe-area-inset-top padding
↓
Header (minimal — logo + streak only)
↓
Goblin hero section (min 50% of viewport height)
↓
HP bar
↓
Timer / primary info
↓
Primary CTA button (always full width)
↓
Secondary options (duration chips etc.)
↓
fixed bottom nav (56px tall + safe-area-inset-bottom)
```

### Bottom Nav
Always fixed, always 3 tabs: Focus | Stats | Settings
```jsx
<nav style={{
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  height: 56,
  paddingBottom: 'env(safe-area-inset-bottom)',
  background: 'white',
  borderTop: '1px solid #d1f0b8',
  display: 'flex'
}}>
```

### Safe Area (iOS notch/home bar)
Always apply:
```jsx
paddingTop: 'env(safe-area-inset-top)'
paddingBottom: 'env(safe-area-inset-bottom)'
```

---

## Goblin Mascot Rules

### States → when to show each
| State | When |
|---|---|
| `idle` | App open, no session running, HP 40–70 |
| `working` | Focus session active (normal) |
| `break` | Break timer active |
| `overdue` | Session > 55 min OR HP < 20 OR user caught switching tabs |
| `good` | HP 65–89, 1+ sessions done |
| `great` | HP ≥ 90 |
| `celebrate` | 3.5s flash immediately after session completes |
| `done` | "Done for today" tapped |

### Size guidelines
- Hero (main screen): 220–260px
- Overlay / full screen: 180–220px
- Inline / compact: 120–140px

### Never
- Never add CSS class animations on top of GSAP (GSAP owns the element)
- Never use `overflow: hidden` on the SVG (breaks jump animation)
- Never show the goblin smaller than 120px

---

## ADHD UX Principles

1. **One action per screen** — ADHD users freeze with too many choices. Each screen/phase should have one clear primary action.
2. **Immediate feedback** — Every tap must have instant visual response (scale, colour, animation). No perceived lag.
3. **Progress visibility** — HP bar, session count, streak — always visible on main screen. ADHD brains need to see progress.
4. **Break enforcement** — Never make skipping a break easy. The skip button should be secondary/smaller than the "take break" action.
5. **Panic prevention** — Overdue warnings should feel urgent but not shame-y. "Goblin needs a break" not "you failed."
6. **Minimal navigation** — Bottom nav max 3 items. No nested menus. Everything 1–2 taps from home.

---

## Animation Guidelines (GSAP)

All mascot animations use GSAP. Never add CSS animations to refs that GSAP controls.

### Standard durations
```
Idle float:       2.5s sine.inOut
Working bob:      0.85s sine.inOut
Break drift:      3.2s sine.inOut
Overdue shake:    0.065s none (rapid)
Celebrate jump:   0.3s power2.out → elastic.out(1.2, 0.4)
Blink:            0.07s close / 0.1s open
```

### Page transitions
- New screens: `animation: slide-up 0.3s ease both`
- Overlays: `animation: caught-in 0.28s ease both`
- Stats/cards appearing: `animation: pop-in 0.35s cubic-bezier(0.34,1.56,0.64,1) both`

---

## File Structure
```
focusbro/
├── src/
│   ├── App.jsx                    # Main app + MainApp function
│   ├── index.css                  # Global styles + keyframes
│   ├── main.jsx                   # Entry point
│   └── components/
│       ├── GoblinMascot.jsx       # SVG goblin + GSAP animations
│       └── Onboarding.jsx         # Full onboarding flow (quiz→paywall)
├── public/
├── CLAUDE.md                      # This file
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.js
```

---

## Colour Tokens Quick Reference
```
Page bg:          #f2fde8
Card bg:          #ffffff
Card border:      #d1f0b8
Text primary:     #0f2008
Text secondary:   #4a6741
Text muted:       #7aaa6a
Green primary:    #15803d
Green accent:     #22c55e
Lime:             #84cc16
Red danger:       #dc2626
Purple done:      #7c3aed
```

---

## What Not To Do
- ❌ Dark backgrounds on main screens (Caffiend's look)
- ❌ Amber / yellow as primary colour (Caffiend's colour)
- ❌ More than 3 bottom nav items
- ❌ Ring-style progress timer (use numbers instead)
- ❌ Session log on the main screen (belongs in Stats tab)
- ❌ Shrinking the goblin to fit content
- ❌ CSS class animations on GSAP-controlled elements
- ❌ `overflow: hidden` on the SVG wrapper
