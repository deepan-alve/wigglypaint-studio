---
name: wigglypaint-art
description: Make any drawing as a looping, boiling-line WigglyPaint animation (a 3-frame GIF) by writing canvas code with WigglyPaint Studio. Use when asked for a wiggly drawing, wobbly or boiling-line GIF, WigglyPaint art or scene, or a lyric card, for any subject (animals, people, objects, places, patterns, text), or to add or tweak a scene in a wigglypaint-studio checkout.
---

# Making WigglyPaint art

WigglyPaint Studio turns plain canvas 2D code into WigglyPaint's three animation frames. Each frame
gets its own wobble, so every line boils like a hand-drawn cartoon. One scene is one `draw-<key>.js`
file. Write it, look at it in the browser, fix it, and export a GIF.

You can draw anything: a cat, a city at night, a portrait, a logo-free product sketch, a pattern, a
poster with words. A scene can be **plain art**, which uses the whole canvas, or a **lyric card**,
which has a drawing on the left and styled text on the right.

## 0. Get the studio

If the working directory has no `lyric-lib.js` and `build-studio.py`, clone the studio first. Ask
the user where to put it if they haven't said.

```sh
git clone https://github.com/deepan-alve/wigglypaint-studio
cd wigglypaint-studio
```

Serve it over http, not `file://`. Pick a free port, because 8765 is often taken:

```sh
python3 -m http.server 8817 --bind 127.0.0.1
```

## 1. Read before you draw

- `README.md` has the full `lyricKit()` API table.
- `draw-cat.js` is the plain-art example: whole canvas, no text, small per-frame motion.
- `draw-kajal.js` is the best-commented lyric card. `draw-boy.js` has a speech bubble.
- For a lyric style, search `lyric-lib.js` for `// style '` and copy the `colors` keys from the
  scene that already uses that style.

## 2. Plan the picture

Before writing code, decide what the image is: subject, pose, a few colours, and one or two
things that move. Then break the subject into simple shapes such as ellipses, rounded rects, and
Bézier curves. Fills come first and outlines go on top.

- **Canvas.** The deck is 512×342 and the drawing area is (5,22) to (360,283), 355×261, with its
  centre at about (182,152). Coordinates are deck pixels. Keep about 12px clear of the edges,
  because `backdrop()` draws a double border there.
- **Plain art** uses the whole area. Don't call `lyric()`. A scene with no `lyric(` call draws
  without text, and the panel lists it as "(no lyric)".
- **Lyric card:** keep the subject in x ≈ 15–200. The text column defaults to `box:[224,356]`.
  Widen it with `colors.box` if the words need room.
- **Palette:** only 16 colours plus ink and paper: `INK PAPER WHITE YELLOW ORANGE RED PINK PURPLE
  BLUE CYAN GREEN DKGREEN BROWN TAN LGRAY GRAY DGRAY`. Use `C.*` names. There are no gradients,
  so get shading from a second flat colour, hatching, or stippling with 1px `fillRect` dots.
- **Motion:** you have 3 frames, which loop. `layer(c,(g,f)=>…)` receives `f` = 0, 1 or 2. Good
  motion is small: a 2–4px bob or swing, steam or sparkles that move a step each frame,
  whiskers or hair that re-randomise with `rnd()`. Large jumps between frames look like flicker.
- **Subjects:** draw original things. Don't recreate copyrighted characters, mascots or brand
  logos, even if asked to rename them. Offer an original take instead.

## 3. Write the scene

```js
// <one line saying what the scene is>
// Needs lyric-lib.js loaded first (the studio page bundles both).

const TEXT=window.WP_TEXT||{small:'',big:''};   // lyric cards only; drop this line for plain art
{
const{layer,backdrop,clear,bez,trace,normal,lyric,show,C:{INK,PAPER,RED,YELLOW},PI,rnd}=lyricKit();
clear();
backdrop({color:YELLOW,calm:[182,152]});        // halftone dots that stay calm around the subject

layer(PAPER,g=>{/* the subject's silhouette, so no dots show through it */});
layer(RED,(g,f)=>{/* fills; use f for motion */});
layer(INK,g=>{g.lineWidth=2.6;/* outlines and details on top */});

lyric(TEXT,'poster');                           // lyric cards only
show();                                         // always last
}
```

Rules that keep it looking right:

- **One colour per `layer` call.** The colour you draw with inside the callback is ignored: any
  pixel with alpha over 110 becomes the layer's colour.
- **Back to front.** Use this order: `clear()`, then `backdrop()`, then `PAPER` knock-outs, then
  fills, then shading, then `INK` lines, then `lyric()`, then `show()`. A later layer covers an
  earlier one, and a `PAPER` layer erases.
- **Line weights:** 1.2–2 for detail and 2.4–3.5 for outlines. Lines under 1px break up after the wobble.
- **Reuse shapes.** Define a path once (`const head=g=>{g.beginPath();g.ellipse(…)}`) and fill it,
  stroke it, and clip to it in different layers. `g.clip()` keeps shading inside a shape.
- **Curves:** `bez(p0,p1,p2,p3)` returns `t → [x,y]`, `trace(g,curve)` walks it into the path, and
  `normal(curve,t)` gives the direction outward from the curve, for hair, lashes, fur and thickness.
- Wrap the body in `{ … }`, because all scenes are bundled into one page. Match the compact style
  of the existing files, and give each layer a short comment saying what it draws.

## 4. Look at it, then fix it

Open `http://127.0.0.1:<port>/wigglypaint-studio.html#run=draw-<key>.js`. That loads the file
straight from disk and draws it, with no build step. After each edit, reload the page. Change
something else in the URL, such as `&v=2`, so the browser doesn't serve a cached copy.

- If you have a browser tool (Playwright, Chrome), open that URL and screenshot the `#display`
  canvas. Look at the picture yourself before you call it done. The panel's hint line under the
  buttons shows errors. The browser console has the stack trace.
- If you don't, give the user the URL and ask them to describe what they see, or to send a screenshot.
- `#run` uses the lyric boxes in the panel for `TEXT`. Fill them in the panel first, then reload.

Fix proportions and placement before details. Most fixes are coordinate nudges. Look for parts that
float loose from the body, lines that cross a face, text that collides with the drawing, and
shapes clipped by the border.

## 5. Add it to the studio

1. Add `("<key>", "<Button label>", "draw-<key>.js", False)` to `SCRIPTS` in `build-studio.py`.
   For a lyric card, add a default lyric under `<key>` in `lyrics.json`.
2. Run `python3 build-studio.py`. It rewrites `wigglypaint-studio.html`, which is the page the
   public site serves, so commit the rebuilt file along with the scene.
3. Reload the page without `#run`, pick the scene in the dropdown, and click **Draw scene**.

## 6. Export

Click **EXPORT** in WigglyPaint (bottom left) to save the looping GIF. After drawing, the user can
keep painting over the result with WigglyPaint's own pens before exporting.

For video, save the three frames as `export/<key>/f0.png` to `f2.png`, add the key to `SCENES` in
`build_videos.sh`, and run it. It needs `ffmpeg`.

## The other mode: real brushstrokes

`draw-apple.js`, `draw-pup.js` and `draw-robot.js` fire synthetic mouse events, so WigglyPaint's own
pens draw each stroke. That gives real brush texture, but it takes about 15 seconds, freezes the
page while it runs, and can't place lyrics. Register these with `True` as the last field in
`SCRIPTS`. Use the canvas-code mode above unless the user specifically wants WigglyPaint's brushes.
