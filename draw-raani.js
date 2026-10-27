// Lyric screen for WigglyPaint: an original "kalli raani" — a playful, mischievous girl with long black hair swept to
// one side, an elegant confident look, calm winged-liner eyes, a knowing smile, and a little
// gold crown tilted on her head. Royal ribbon-banner lettering.
// Needs lyric-lib.js loaded first (the studio page bundles both).

const TEXT=window.WP_TEXT||{small:'',big:''};   // the studio panel's lyric boxes set WP_TEXT
{
const{layer:baseLayer,backdrop,clear,lyric,show,C:{INK,PAPER,YELLOW,PINK,PURPLE,RED,ORANGE,BROWN,GRAY,LGRAY},PI}=lyricKit();
clear();
backdrop({color:PURPLE,calm:[100,150]});
// her head tilts a touch, like a playful glance
const TILT=-.1,HP=[100,130];
const tilted=(g)=>{g.translate(...HP);g.rotate(TILT);g.translate(-HP[0],-HP[1])};
const headLayer=(v,draw,o)=>baseLayer(v,(g,f)=>{tilted(g);draw(g,f)},o);

// --- body: big curly hair, a modern off-shoulder top with gold trim and a choker ---
const neck=g=>{g.beginPath();g.moveTo(88,178);g.lineTo(86,214);g.quadraticCurveTo(96,222,108,214);g.lineTo(106,176);g.closePath()};
const bodySkin=g=>{g.beginPath();g.moveTo(20,272);g.bezierCurveTo(26,234,58,214,100,212);g.bezierCurveTo(142,214,174,234,180,272);g.closePath()};
const top=g=>{g.beginPath();g.moveTo(32,272);g.lineTo(50,242);g.quadraticCurveTo(74,236,90,244);g.quadraticCurveTo(100,255,110,244);g.quadraticCurveTo(126,236,150,242);g.lineTo(168,272);g.closePath()};
// curly hair: a bumpy cloud behind, with springy ringlets framing the face
const BUMPS=[...Array(30)].map((_,k)=>5+3*Math.abs(Math.sin(k*2.3)));
const hairBack=g=>{const n=30;g.beginPath();for(let k=0;k<=n*6;k++){const t=k/(n*6),a=-PI/2+t*2*PI;
 const bump=BUMPS[Math.floor(t*n)%n]*Math.abs(Math.sin(t*n*PI));let x=100+(66+bump)*Math.cos(a),y=140+(94+bump)*Math.sin(a);
 if(y>256)y=256;k?g.lineTo(x,y):g.moveTo(x,y)}g.closePath()};
const coil=(g,x0,y0,len,r,turns,s)=>{g.beginPath();for(let i=0;i<=turns*24;i++){const t=i/(turns*24),a=t*turns*2*PI;
 const x=x0+s*r*Math.cos(a)+s*4*Math.sin(t*PI),y=y0+t*len+r*.55*Math.sin(a);i?g.lineTo(x,y):g.moveTo(x,y)}g.stroke()};
const swirl=(g,x,y,r)=>{g.beginPath();for(let i=0;i<=40;i++){const t=i/40,a=t*3.2*PI,rr=r*t;i?g.lineTo(x+rr*Math.cos(a),y+rr*Math.sin(a)):g.moveTo(x,y)}g.stroke()};

// halo + fills (hair behind, skin, then the top)
baseLayer(PAPER,g=>{g.lineWidth=8;g.lineJoin='round';bodySkin(g);g.stroke();g.fill();hairBack(g);g.stroke();g.fill()});
baseLayer(INK,g=>{hairBack(g);g.fill()});
baseLayer(GRAY,g=>{hairBack(g);g.clip();g.lineWidth=1.3;g.lineCap='round';for(const[x,y]of[[46,120],[40,170],[52,214],[160,120],[166,170],[154,214],[72,74],[128,74],[100,60]])swirl(g,x,y,7)});
baseLayer(PAPER,g=>{bodySkin(g);g.fill()});
baseLayer(INK,g=>{g.lineWidth=2;bodySkin(g);g.stroke()});
baseLayer(PURPLE,g=>{top(g);g.fill()});
baseLayer(YELLOW,g=>{g.lineWidth=3;g.beginPath();g.moveTo(50,242);g.quadraticCurveTo(74,236,90,244);g.quadraticCurveTo(100,255,110,244);g.quadraticCurveTo(126,236,150,242);g.stroke()});   // gold trim on the neckline
baseLayer(INK,g=>{g.lineWidth=2;top(g);g.stroke();g.lineWidth=1;g.beginPath();g.moveTo(100,255);g.lineTo(100,272);g.stroke()});
baseLayer(PAPER,g=>{neck(g);g.fill()});
baseLayer(INK,g=>{g.lineWidth=2;neck(g);g.stroke()});
// a thin gold choker with a tiny pendant
baseLayer(YELLOW,g=>{g.lineWidth=2.4;g.beginPath();g.moveTo(87,206);g.quadraticCurveTo(97,212,107,206);g.stroke()});
baseLayer(RED,g=>{g.beginPath();g.arc(97,211,1.8,0,2*PI);g.fill()});
baseLayer(INK,g=>{g.lineWidth=.8;g.beginPath();g.arc(97,211,1.8,0,2*PI);g.stroke()});

// --- elegant face: calm, half-lidded "cool queen" eyes with winged liner (both open, no sparkle/wink) ---
const face=g=>{g.beginPath();g.moveTo(66,124);g.bezierCurveTo(66,158,84,186,100,194);g.bezierCurveTo(116,186,134,158,134,124);
 g.bezierCurveTo(134,98,117,86,100,86);g.bezierCurveTo(83,86,66,98,66,124);g.closePath()};
headLayer(PAPER,g=>{face(g);g.fill()});
headLayer(INK,g=>{g.lineWidth=2.4;face(g);g.stroke()});
// a curly fringe: a cap over the crown ending in a row of round curls across the forehead
const FR=[[66,120,9],[80,110,9],[94,105,9],[108,106,9],[122,110,9],[136,120,8]];
headLayer(INK,g=>{g.beginPath();g.moveTo(58,124);g.bezierCurveTo(56,76,92,56,100,56);g.bezierCurveTo(112,56,146,76,148,124);g.closePath();g.fill();
 for(const[x,y,r]of FR){g.beginPath();g.arc(x,y,r,0,2*PI);g.fill()}});
headLayer(PAPER,g=>{g.lineWidth=2;g.lineCap='round';for(const[x,y]of[[86,64],[108,62]]){g.beginPath();g.arc(x,y,5,PI*1.1,PI*1.6);g.stroke()}});

// thin, elegant arched brows
headLayer(INK,g=>{g.lineCap='round';g.lineWidth=1.8;for(const s of[-1,1]){const cx=100+s*18;
 g.beginPath();g.moveTo(cx-s*12,122);g.quadraticCurveTo(cx,114,cx+s*13,120);g.stroke()}});

// calm half-lidded eyes, both open, winged liner, simple iris (no twinkle)
const EYES=[[82,146,-1],[118,146,1]];
for(const[x,y,s]of EYES){
 // white of the eye (a flat almond, upper part covered by the lid for a cool, relaxed look)
 headLayer(PAPER,g=>{g.beginPath();g.moveTo(x-s*13,y);g.quadraticCurveTo(x,y-5,x+s*13,y-3);g.quadraticCurveTo(x,y+7,x-s*13,y);g.closePath();g.fill()});
 headLayer(BROWN,g=>{g.save();g.beginPath();g.moveTo(x-s*13,y);g.quadraticCurveTo(x,y-5,x+s*13,y-3);g.quadraticCurveTo(x,y+7,x-s*13,y);g.closePath();g.clip();
  g.beginPath();g.arc(x+s*2,y,6,0,2*PI);g.fill();g.restore()});
 headLayer(INK,g=>{g.save();g.beginPath();g.moveTo(x-s*13,y);g.quadraticCurveTo(x,y-5,x+s*13,y-3);g.quadraticCurveTo(x,y+7,x-s*13,y);g.closePath();g.clip();
  g.beginPath();g.arc(x+s*2,y,2.8,0,2*PI);g.fill();g.restore()});
 headLayer(INK,g=>{g.lineCap='round';g.lineJoin='round';
  g.lineWidth=3.4;g.beginPath();g.moveTo(x-s*13,y-1);g.quadraticCurveTo(x,y-6,x+s*13,y-3);g.lineTo(x+s*18,y-7);g.stroke();   // heavy upper liner + wing
  g.lineWidth=1.3;g.beginPath();g.moveTo(x-s*11,y+2);g.quadraticCurveTo(x,y+5,x+s*11,y+1);g.stroke();                        // soft lower lid
  g.lineWidth=1.6;for(const k of[11,15]){g.beginPath();g.moveTo(x+s*k,y-4);g.lineTo(x+s*(k+4),y-9);g.stroke()}});            // a couple of outer lashes
}
// small nose, a calm confident smile, blush, a small pottu
headLayer(INK,g=>{g.lineCap='round';g.lineWidth=1.4;g.beginPath();g.moveTo(101,160);g.lineTo(99,165);g.stroke()});
headLayer(PINK,g=>{g.beginPath();g.moveTo(90,176);g.quadraticCurveTo(101,182,113,175);g.quadraticCurveTo(102,185,90,176);g.fill()});
headLayer(INK,g=>{g.lineCap='round';g.lineWidth=1.8;g.beginPath();g.moveTo(90,176);g.quadraticCurveTo(101,182,114,174);g.stroke();
 g.lineWidth=1.2;g.beginPath();g.moveTo(90,176);g.lineTo(87,174);g.moveTo(114,174);g.lineTo(117,171);g.stroke()});
headLayer(PINK,g=>{g.lineWidth=1.3;g.lineCap='round';for(const cx of[74,124])for(let k=0;k<3;k++){g.beginPath();g.moveTo(cx-5+k*4,162);g.lineTo(cx-2+k*4,157);g.stroke()}});
headLayer(RED,g=>{g.beginPath();g.arc(100,116,2.4,0,2*PI);g.fill()});

// springy ringlets framing the face, falling over the shoulders
baseLayer(INK,g=>{g.lineCap='round';g.lineWidth=5;for(const s of[-1,1]){coil(g,100+s*44,112,110,6,6,s);coil(g,100+s*34,150,88,5,5,s)}});

// a small gold crown, tilted on her head, glinting
const crown=g=>{g.beginPath();g.moveTo(84,58);g.lineTo(84,40);g.lineTo(92,48);g.lineTo(100,34);g.lineTo(108,48);g.lineTo(116,40);g.lineTo(116,58);g.closePath()};
const crowned=(v,draw)=>baseLayer(v,(g,f)=>{tilted(g);g.translate(100,52);g.rotate(-.25);g.translate(-100,-52);draw(g,f)});
crowned(PAPER,g=>{crown(g);g.lineWidth=6;g.lineJoin='round';g.stroke()});
crowned(YELLOW,g=>{crown(g);g.fill()});
crowned(RED,g=>{g.beginPath();g.arc(100,50,2.6,0,2*PI);g.fill()});
crowned(INK,g=>{g.lineJoin='round';g.lineWidth=1.6;crown(g);g.stroke();g.beginPath();g.moveTo(84,54);g.lineTo(116,54);g.stroke();
 for(const[x,y]of[[84,40],[100,34],[116,40]]){g.beginPath();g.arc(x,y-2,2,0,2*PI);g.fill()}});
crowned(PAPER,(g,f)=>{const[x,y]=[[90,52],[100,44],[110,52]][f];g.lineWidth=1.2;for(const a of[0,PI/2]){g.beginPath();g.moveTo(x-4*Math.cos(a),y-4*Math.sin(a));g.lineTo(x+4*Math.cos(a),y+4*Math.sin(a));g.stroke()}});

// (hand lowered — just the portrait)

// sparkles
const SP=[[[30,60],[176,40],[184,150]],[[34,54],[180,46],[188,144]],[[26,66],[172,36],[180,156]]];
baseLayer(YELLOW,(g,f)=>{for(const[x,y]of SP[f]){g.beginPath();g.arc(x,y,2.4,0,2*PI);g.fill()}});
baseLayer(INK,(g,f)=>{g.lineWidth=1.2;for(const[x,y]of SP[f])for(const a of[0,PI/2]){g.beginPath();g.moveTo(x-6*Math.cos(a),y-6*Math.sin(a));g.lineTo(x+6*Math.cos(a),y+6*Math.sin(a));g.stroke()}});

// royal lettering: gold word with a crown on top and a gem flourish
lyric(TEXT,{style:'royal',colors:{small:PURPLE,word:YELLOW,outline:PURPLE,shadow:INK,gem:RED,tail:PURPLE,box:[200,356]}});
show();
}
