# First Order

A 2–4 player entrepreneur card game with local pass-and-play and real-time, cross-device multiplayer on Shopify Quick.

## Play

From this directory, run:

```bash
python3 -m http.server 4173
```

Then open [http://localhost:4173](http://localhost:4173).

## Current rules

- Choose 2–4 players and use the suggested random company names or enter your own.
- On Quick, create a live game and share its five-letter code or invite URL so everyone can play from their own computer.
- Optionally enable the **Chaos Monkey** deck: market replacements can change skill costs, trigger discards, refresh briefs, or create hiring rebates.
- Every company begins with a named founder and one permanent skill point.
- Reach **10 reputation** to win.
- Each turn, draft one Time & Talent card, complete a brief, refresh the talent market for $1, or invest $5 for reputation.
- Select and spend cards whose combined stats meet a brief's requirements; pay $3 for each skill point you outsource.
- Milestones can grant permanent strengths, which count toward every future brief.
- Orders commonly grant cash. Spend $5 to gain 1 reputation (this also uses a turn).
- Taken cards are replaced at the left, sliding the row to the right.
- Deep specialists provide 5 points in one skill; flexible cards spread fewer total points across more skills.
- The pinned skill dock and player scoreboard keep everyone's current capabilities visible.

This is deliberately a lightweight, no-build prototype: plain HTML, CSS, and JavaScript. The Quick deployment loads `/client/quick.js` and uses `quick.db` real-time subscriptions to synchronize game state.
