# Agent guide

This repo turns canvas code into looping, boiling-line WigglyPaint GIFs. To draw something here,
follow [`.claude/skills/wigglypaint-art/SKILL.md`](.claude/skills/wigglypaint-art/SKILL.md). It is
written for Claude Code but works as plain instructions for any coding agent.

The short version:

1. Write `draw-<key>.js` using `lyricKit()` (API table in `README.md`, plain-art example in `draw-cat.js`).
2. Serve the folder (`python3 -m http.server 8817 --bind 127.0.0.1`) and open
   `wigglypaint-studio.html#run=draw-<key>.js` to see it without a rebuild. Look at it and fix it.
3. Register it in `SCRIPTS` in `build-studio.py`, run `python3 build-studio.py`, and commit the
   rebuilt `wigglypaint-studio.html` with the scene.

Don't edit `wigglypaint.html`. It is the original WigglyPaint, bundled unmodified.
