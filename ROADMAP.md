# Doldrums — Post-1.2.1 Direction Notes
*Captured July 24, 2026, the night 1.2.1 shipped*

## The core realization

Doldrums is meant to go wide — not just a project for a small circle of friends and family. That changes the bar: strangers won't extend the patience Matt or Dad will. Everything below flows from that.

The broadsheet identity stays. The Forecast Discussion stays — it's the heart of the app. But both need editing, not abandoning, to survive contact with someone new.

## The punch list, in priority order

### 1. Fix the sidebar (highest leverage)
The "NOW" panel currently buries the one thing almost everyone actually wants — will it rain — under four other stats of roughly equal visual weight (temp, wind, rain %, sunrise/sunset).

- Make rain the loudest, first thing in the sidebar
- State it in plain language, not just a percentage ("No rain expected" vs. "Rain chance: 0%")
- Everything else (wind, sunrise/sunset) can drop in size/priority below it
- Goal: someone can glance at the sidebar alone and get their answer in under a second, without reading the headline next to it

### 2. Trim the Forecast Discussion
The headline extraction works — "Pleasant and dry conditions expected through Monday" is genuinely good, human, on-brand. The body copy underneath is still raw NWS text and drops straight into forecaster jargon ("NBM 10th percentile," "MOS guidance").

- Keep the headline as-is
- Cut the body to 2–3 sentences in the same plain human voice as the headline
- Lose the raw model/guidance jargon from the front-page teaser
- Open question: does the *full* discussion (once someone taps through) get the same treatment, or is raw NWS text acceptable there since the reader has opted in?

### 3. Fix navigation out of the full Discussion
Not a taste call — a real bug. There's a "return to synopsis" link but it's buried/not obvious. Someone can tap into the full Discussion and feel stuck. Fix this outright, it's not something to design around.

### 4. Redesign city-switching (the "will they even get started" gate)
Current flow is ~6-7 taps: nameplate → Editions → Add City → search → select → confirm → set as front page. Too heavy for what should be a first-five-seconds action.

Split into two jobs instead of one flow:
- **Fast path (primary):** one obvious tappable target (not the nameplate itself — something that reads as a button) → search opens immediately → tap a result → done, it's the front page. No separate confirm step.
- **Manage Editions (secondary):** lives one level deeper, for people who actually want multiple saved cities (you, checking Ipswich vs. Sonoma vs. Dennis). Reorder, remove, multi-city switching lives here.

Search itself is already solid — this is purely about the wrapper around it.

### 5. iPad Discussion parity
iPad currently defaults to a Conditions tab with no Forecast Discussion visible anywhere in the default view (it may not exist on iPad at all — worth checking). If the Discussion is the heart of the app, it can't be iPhone-only. Lower priority than 1–4, but real.

## Also noted, not yet resolved
- Whether "broadsheet" as a literal newspaper metaphor has a ceiling — worth staying aware of the line between "interesting" and "twee" as more paper-vocabulary gets added later.
