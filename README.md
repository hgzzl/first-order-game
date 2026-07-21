# First Order

A 2–4 player, local pass-and-play browser prototype for testing a Shopify-inspired entrepreneur card game.

## Play

From this directory, run:

```bash
python3 -m http.server 4173
```

Then open [http://localhost:4173](http://localhost:4173).

## Current rules

- Choose 2–4 players and use the suggested random company names or enter your own.
- Reach **15 reputation** to win.
- Each turn, either draft one Time & Talent card or complete one Order/Milestone brief, then pass the device to the next founder.
- Select and spend cards whose combined stats meet a brief's requirements.
- Milestones can grant permanent strengths, which count toward every future brief.
- Orders commonly grant cash. Spend $5 to gain 1 reputation (this also uses a turn).
- Taken cards are replaced at the left, sliding the row to the right.

This is deliberately a lightweight, no-build prototype: plain HTML, CSS, and JavaScript.
