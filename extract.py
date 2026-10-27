#!/usr/bin/env python3
"""Split the Decker deck embedded in wigglypaint.html into readable Lil script files."""
import json, re, pathlib, collections

src = pathlib.Path(__file__).with_name("wigglypaint.html").read_text()
deck = src[:src.index("</script>")]          # the deck is everything before the runtime
lines = deck.split("\n")
out = pathlib.Path(__file__).with_name("scripts"); out.mkdir(exist_ok=True)
for f in out.glob("*.lil"): f.unlink()

scripts, users = {}, collections.defaultdict(list)
section, i = None, 0
module = None
while i < len(lines):
    ln = lines[i]
    m = re.fullmatch(r"\{(\w+)(?::(.*))?\}", ln)
    if m and m.group(1) == "script":
        key = m.group(2)
        if key is None:                       # anonymous script block = module body
            key = f"module.{module}"
        body = []; i += 1
        while lines[i] != "{end}": body.append(lines[i]); i += 1
        scripts[key] = "\n".join(body)
    elif m:
        if m.group(1) != "widgets": section = (m.group(1), m.group(2) or "")
        if m.group(1) == "module": module = m.group(2)
    elif section and ln.startswith("script:"):  # card / contraption-level script ref
        users[json.loads(ln[7:])].append(f"{section[0]} {section[1]}")
    elif section and ":" in ln and ln.split(":",1)[1].startswith("{"):
        name, js = ln.split(":", 1)
        try: w = json.loads(js)
        except json.JSONDecodeError: w = {}
        if isinstance(w, dict) and "script" in w:
            users[w["script"]].append(f"{section[0]} {section[1]} / {name} ({w.get('type')})")
    i += 1

index = ["# WigglyPaint scripts", "", "Extracted from wigglypaint.html by extract.py.", "",
         "| file | used by | lines |", "|---|---|---|"]
for key, body in scripts.items():
    fn = re.sub(r"[^\w.-]", "_", key) + ".lil"
    who = "; ".join(users.get(key, [])) or ("deck" if key == "0" else "-")
    (out / fn).write_text(f"# {key} -- used by: {who}\n{body}\n")
    index.append(f"| [{fn}]({fn}) | {who} | {body.count(chr(10))+1} |")
(out / "README.md").write_text("\n".join(index) + "\n")
print(len(scripts), "scripts written")
