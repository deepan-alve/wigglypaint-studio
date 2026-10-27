---
name: wigglypaint-scene
description: Draw a new animated WigglyPaint scene in code with the WigglyPaint Studio repo (lyricKit). Use when asked to draw, add or tweak a WigglyPaint scene, wiggly GIF, boiling-line animation or lyric card in a wigglypaint-studio checkout.
---

# Drawing a WigglyPaint scene

You are in a checkout of WigglyPaint Studio. A scene is one `draw-<key>.js` file. It paints
WigglyPaint's three animation frames directly with canvas 2D calls, and `lyricKit()` wobbles
each frame differently so the lines boil.

## Before you write

- Read `README.md` (API table) and at least one existing scene close to the request.
  `draw-kajal.js` is the best-commented. `draw-boy.js` shows a character with a speech bubble.
- Find the style you want in `lyric-lib.js` (search `// style '`) and copy its `colors` keys
  from the scene that uses it.

## Rules that make it look right

- **Geometry:** the deck is 512×342 and the drawing area is (5,22)–(360,283). Keep the subject
  in x ≈ 15–200. The lyric column is `box:[x0,356]` and defaults to `[224,356]`.
- **Back to front:** `clear()` → `backdrop({color, calm:[subjectX,subjectY]})` → `PAPER`
  knock-outs where dots must not show → colour fills → shading → `INK` outlines and details →
  `lyric(TEXT, style)` → `show()`. Always call `show()` last.
- **One colour per `layer` call.** The callback's colour is ignored, and any pixel with
  alpha > 110 becomes the layer's palette colour. Use `C.*` names only, because the palette is 16 colours.
- **Use the 3 frames.** `layer(c,(g,f)=>…)` gets the frame index. Small per-frame offsets
  (bob, swing, twinkle) and `Math.random()` inside the callback both make a scene feel alive.
- **Line weights:** use 1.2–2 for detail and 2–3.5 for outlines. Anything under 1 px can disappear after the wobble.
- Wrap the body in `{ … }` and start with
  `const TEXT=window.WP_TEXT||{small:'',big:''};` like the existing scenes, because all scenes are
  bundled into one page.
- Keep the compact style of the existing files. Write short comments that say *what* each layer is.
- Draw original subjects. Don't recreate copyrighted characters or logos.

## Register, build, check

1. Add `("<key>", "<Button label>", "draw-<key>.js", False)` to `SCRIPTS` in `build-studio.py`.
   Optionally add a default lyric under `<key>` in `lyrics.json`.
2. Run `python3 build-studio.py`.
3. Serve the folder with `python3 -m http.server 8765` and open `wigglypaint-studio.html`. Pick the
   scene, fill the lyric boxes, click **Draw scene**, and look at it. If a browser tool is
   available, screenshot it and fix overlaps between the drawing and the lyric column
   (adjust `box`, or move the subject).
4. Iterate on proportions before details. Most fixes are coordinate nudges.

## Exporting

WigglyPaint's **EXPORT** button saves the GIF. For video, save the three frames as
`export/<key>/f0.png`–`f2.png`, add the key to `SCENES` in `build_videos.sh`, and run it.
