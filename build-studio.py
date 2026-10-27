#!/usr/bin/env python3
"""Build wigglypaint-studio.html: the original deck plus a floating panel that runs the draw-*.js scripts.

Re-run after editing any draw-*.js file:  python3 build-studio.py
"""
import json, pathlib, re

here = pathlib.Path(__file__).parent
html = (here / "wigglypaint.html").read_text()
# itch.io's embed helper bounces a standalone page to itch.io, so drop it from the local copy
html = html.replace('<script defer src="https://static.itch.io/htmlgame.js" type="text/javascript"></script>', "")

SCRIPTS = [  # (key, button label, file, draws with the mouse simulator?)
    # a code-drawn scene that never calls lyric(...) is plain art: it draws without lyric text
    ("kajal", "Eye + kajal",         "draw-kajal.js", False),
    ("lolaakku", "Ear + jhumka",     "draw-lolaakku.js", False),
    ("mascara", "Eyelash + mascara", "draw-mascara.js", False),
    ("lipstick", "Lips + lipstick",  "draw-lipstick.js", False),
    ("bangles", "Hand + glass bangles", "draw-bangles.js", False),
    ("kolusu", "Foot + anklet",      "draw-kolusu.js", False),
    ("pottu", "Face + pottu + foundation", "draw-pottu.js", False),
    ("dhavani", "Silk dhavani at the hip", "draw-dhavani.js", False),
    ("boy", "Boy asking",            "draw-boy.js", False),
    ("natural", "Even without all that", "draw-natural.js", False),
    ("doll", "Sugar-crystal doll",    "draw-doll.js", False),
    ("malli", "Jasmine in her hair",  "draw-malli.js", False),
    ("raani", "Kalli raani",          "draw-raani.js", False),
    ("sooniyam", "Enchantress",       "draw-sooniyam.js", False),
    ("cat", "Cat with a coffee mug",  "draw-cat.js", False),
    ("apple", "Apple",              "draw-apple.js", True),
    ("pup",   "Puppy",              "draw-pup.js",   True),
    ("robot", "Robot",              "draw-robot.js", True),
]
lib = (here / "lyric-lib.js").read_text()
lyrics_file = here / "lyrics.json"   # {"kajal": {"small": "...", "big": "..."}, "lolaakku": {...}}
lyrics = json.loads(lyrics_file.read_text()) if lyrics_file.exists() else {}

# lyrics.txt (yours): one line per lyric scene, in the order of SCRIPTS below.
#   plain line         -> last word becomes the big word, the rest the small line
#   small | big | last -> split exactly where you put the bars
# Blank lines and lines starting with # are skipped. It overrides lyrics.json for the scenes it covers.
def parse_line(line):
    if "|" in line:
        parts = [p.strip() for p in line.split("|")] + ["", ""]
        return {"small": parts[0], "big": parts[1], "tail": parts[2]}
    words = line.split()
    return {"small": " ".join(words[:-1]), "big": words[-1] if words else "", "tail": ""}

txt_file = here / "lyrics.txt"
txt_lines = [l.strip() for l in txt_file.read_text().splitlines()
             if l.strip() and not l.strip().startswith("#")] if txt_file.exists() else []
lyric_keys = [k for k, _, f, slow in SCRIPTS if not slow]
for key, line in zip(lyric_keys, txt_lines):
    lyrics[key] = parse_line(line)
if txt_lines:
    print(f"lyrics.txt: filled {min(len(txt_lines), len(lyric_keys))} of {len(lyric_keys)} scenes"
          + (f" ({len(txt_lines) - len(lyric_keys)} extra line(s) waiting for new scenes)" if len(txt_lines) > len(lyric_keys) else ""))
fns = ",\n".join(f"{json.dumps(k)}:()=>{{\n{(here / f).read_text()}\n}}" for k, _, f, _ in SCRIPTS)
calls_lyric = lambda f: re.search(r"^[^/\n]*\blyric\(", (here / f).read_text(), re.M) is not None   # ignores // comments
meta = json.dumps([{"key": k, "label": l, "slow": s, "lyric": not s and calls_lyric(f)} for k, l, f, s in SCRIPTS])

panel = r"""
<!-- the lyric styles need these faces; without the link they only work where the fonts are installed locally -->
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Anton&family=Antonio&family=Bebas+Neue&family=Luckiest+Guy&family=Noto+Sans+Tamil:wght@400;700;800&family=Pacifico&display=swap">
<style>
#wp-studio{position:fixed;right:12px;bottom:12px;z-index:99;background:#fff;color:#000;border:2px solid #000;
 box-shadow:4px 4px 0 #000;padding:10px;font:13px/1.3 system-ui,sans-serif;width:220px}
#wp-studio h3{margin:0 0 8px;font-size:14px;cursor:move;user-select:none;display:flex;justify-content:space-between;align-items:center}
#wp-studio h3 button{border:0;background:none;font-size:16px;cursor:pointer;padding:0 2px}
#wp-studio button.run{display:block;width:100%;margin:4px 0;padding:6px;border:2px solid #000;background:#fff;
 font:inherit;cursor:pointer;text-align:left}
#wp-studio button.run:hover{background:#000;color:#fff}
#wp-studio button.run:disabled{opacity:.4;cursor:wait}
#wp-studio label{display:block;margin-top:6px;font-size:12px}
#wp-studio select{width:100%;padding:4px;border:2px solid #000;font:inherit;background:#fff}
#wp-studio .row{display:flex;gap:4px}
#wp-studio .row input{flex:1;min-width:0}
#wp-studio button.paste{border:2px solid #000;background:#fff;font:12px system-ui,sans-serif;cursor:pointer;padding:0 6px}
#wp-studio button.paste:hover{background:#000;color:#fff}
#wp-studio input{width:100%;box-sizing:border-box;padding:4px;border:2px solid #000;font:15px 'Noto Sans Tamil',sans-serif}
#wp-studio .hint{font-size:11px;color:#444;margin-top:6px;min-height:14px}
#wp-studio.min>*:not(h3){display:none}
</style>
<div id="wp-studio">
 <h3 id="wp-drag" title="drag to move">WigglyPaint studio <button id="wp-min" title="minimise">–</button></h3>
 <label>Scene<select id="wp-scene"></select></label>
 <label>Lyric, small line<span class="row"><input id="wp-small" placeholder="required for lyric scenes"><button class="paste" data-for="wp-small" title="paste">Paste</button></span></label>
 <label>Lyric, big word<span class="row"><input id="wp-big" placeholder="required for lyric scenes"><button class="paste" data-for="wp-big" title="paste">Paste</button></span></label>
 <label>Lyric, last line<span class="row"><input id="wp-tail" placeholder="optional"><button class="paste" data-for="wp-tail" title="paste">Paste</button></span></label>
 <button class="run" id="wp-draw">Draw scene</button>
 <div id="wp-buttons"></div>
 <button class="run" id="wp-clear">Clear canvas</button>
 <div class="hint" id="wp-hint">Pick a drawing. EXPORT (bottom left) saves the GIF.</div>
</div>
<script>
(()=>{
__LIB__
const SCRIPTS={__FNS__};
const META=__META__;
const LYRICS=__LYRICS__;
const $=id=>document.getElementById(id), hint=t=>$('wp-hint').textContent=t;
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const cardName=()=>{try{return ls(ifield(ifield(deck,'card'),'name'))}catch(e){return ''}};
const fire=(type,x,y)=>{const c=document.querySelector('#display').getBoundingClientRect(),z=c.width/512;
 document.body.dispatchEvent(new MouseEvent(type,{bubbles:true,button:0,clientX:c.x+x*z+z/2,clientY:c.y+y*z+z/2}))};
// the title card's "Let's Draw!" button needs real time between press and release
const ensureMain=async()=>{if(cardName()==='main')return;
 fire('mousemove',258,315);tick();await wait(50);fire('mousedown',258,315);tick();await wait(80);fire('mouseup',258,315);tick();
 for(let i=0;i<150;i++)tick();sync();await wait(50)};
const frames=()=>dget(dget(dget(deck.cards,lms('main')).widgets,lms('target')).widgets,lms('fr')).value.v.get('arg').filter(x=>x&&x.pix);
const clear=()=>{frames().forEach(f=>f.pix.fill(0));for(let i=0;i<3;i++)tick();sync()};
const all=()=>document.querySelectorAll('#wp-studio button.run');
const run=async m=>{all().forEach(b=>b.disabled=true);
 try{await ensureMain();
  window.WP_TEXT={small:$('wp-small').value.trim(),big:$('wp-big').value.trim(),tail:$('wp-tail').value.trim()};
  if(m.lyric&&(!window.WP_TEXT.small||!window.WP_TEXT.big)){hint('This scene needs its lyric: fill both boxes (Tamil works).');$('wp-small').focus();return}
  const sample=Object.values(window.WP_TEXT).join(' ')||'அ';
  await Promise.all(["800 40px 'Noto Sans Tamil'","400 40px 'Anton'","700 26px 'Bebas Neue'","400 40px 'Pacifico'","400 46px 'Antonio'","400 50px 'Luckiest Guy'"].map(f=>document.fonts.load(f,sample)));
  if(m.slow){clear();hint(m.label+': drawing stroke by stroke, the page freezes ~15s…');await wait(60)}
  const t0=performance.now();(m.fn||SCRIPTS[m.key])();for(let i=0;i<6;i++)tick();sync();
  hint(m.label+' done in '+((performance.now()-t0)/1000).toFixed(1)+'s. EXPORT saves the GIF.')}
 catch(e){hint('Error: '+e.message);console.error(e)}
 finally{all().forEach(b=>b.disabled=false)}};
// code-drawn scenes go in the dropdown. Lyric scenes pair one drawing with one lyric, saved per scene in this
// browser and falling back to lyrics.json baked in at build time; they never draw without it. Plain art ignores the boxes.
const KEY='wp-lyric:';
const store={get:k=>{try{return JSON.parse(localStorage.getItem(KEY+k))}catch(e){return null}},
             set:(k,v)=>{try{localStorage.setItem(KEY+k,JSON.stringify(v))}catch(e){}}};
const scenes=META.filter(m=>!m.slow), extras=META.filter(m=>m.slow);
const lyricOf=k=>store.get(k)||LYRICS[k]||{small:'',big:''};
for(const m of scenes){const o=document.createElement('option');o.value=m.key;o.textContent=m.label+(m.lyric?'':'  (no lyric)');$('wp-scene').appendChild(o)}
const load=()=>{const l=lyricOf($('wp-scene').value);$('wp-small').value=l.small||'';$('wp-big').value=l.big||'';$('wp-tail').value=l.tail||''};
const save=()=>store.set($('wp-scene').value,{small:$('wp-small').value.trim(),big:$('wp-big').value.trim(),tail:$('wp-tail').value.trim()});
$('wp-scene').onchange=load;$('wp-small').oninput=$('wp-big').oninput=$('wp-tail').oninput=save;load();
$('wp-draw').onclick=()=>run(scenes.find(m=>m.key===$('wp-scene').value));
for(const m of extras){const b=document.createElement('button');b.className='run';b.textContent=m.label+'  (slow, no lyric)';
 b.onclick=()=>run(m);$('wp-buttons').appendChild(b)}
$('wp-clear').onclick=async()=>{await ensureMain();clear();hint('Canvas cleared.')};
// #run=draw-foo.js loads that file from this folder and draws it, without a rebuild: edit, refresh, look.
// Plain filenames only (letters, digits, - _ and / between them), so the link can't pull in another site's code.
{const f=decodeURIComponent((location.hash.match(/[#&]run=([^&]+)/)||[])[1]||'');
 if(/^[\w-]+(\/[\w-]+)*\.js$/.test(f))fetch(f,{cache:'no-store'}).then(r=>{if(!r.ok)throw Error(f+': HTTP '+r.status);return r.text()})
  .then(src=>{const fn=new Function(src);run({key:'#run',label:f,slow:false,lyric:false,fn})})
  .catch(e=>{hint('Error: '+e.message);console.error(e)});
 else if(f)hint('#run wants a file in this folder, like #run=draw-cat.js')}
$('wp-min').onclick=()=>{const p=$('wp-studio');p.classList.toggle('min');$('wp-min').textContent=p.classList.contains('min')?'+':'–'};
// drag the panel by its title bar (it can cover the markers otherwise)
{const p=$('wp-studio');let d=null;
 $('wp-drag').addEventListener('mousedown',e=>{if(e.target.tagName==='BUTTON')return;e.stopPropagation();e.preventDefault();
  const r=p.getBoundingClientRect();d=[e.clientX-r.left,e.clientY-r.top]});
 addEventListener('mousemove',e=>{if(!d)return;p.style.left=Math.max(0,e.clientX-d[0])+'px';p.style.top=Math.max(0,e.clientY-d[1])+'px';
  p.style.right=p.style.bottom='auto'},true);
 addEventListener('mouseup',()=>d=null,true);
 // keep Decker from treating clicks on the panel as canvas clicks
 for(const ev of['mousedown','mouseup','mousemove'])p.addEventListener(ev,e=>{if(!d)e.stopPropagation()});}
// Decker grabs keys, copy/cut/paste and the right-click menu for its own canvas clipboard;
// stop all of that at the panel's fields so normal text editing (Ctrl+V, right-click > Paste) works
for(const id of['wp-small','wp-big','wp-tail','wp-scene'])
 for(const ev of['keydown','keyup','keypress','paste','copy','cut','contextmenu'])$(id).addEventListener(ev,e=>e.stopPropagation());
// Paste buttons: read the system clipboard directly (the browser may ask permission the first time)
document.querySelectorAll('#wp-studio button.paste').forEach(btn=>btn.onclick=async()=>{const f=$(btn.dataset.for);
 try{const t=(await navigator.clipboard.readText()).trim();f.value=t;f.oninput&&f.oninput();hint('Pasted.')}
 catch(e){f.focus();hint('Clipboard blocked by the browser: click the box and press Ctrl+V instead.')}});
})();
</script>
""".replace("__LIB__", lib).replace("__FNS__", fns).replace("__META__", meta).replace("__LYRICS__", json.dumps(lyrics, ensure_ascii=False))

i = html.rindex("</body>")
out = here / "wigglypaint-studio.html"
out.write_text(html[:i] + panel + html[i:])
print("wrote", out, f"({out.stat().st_size//1024} KB)")
