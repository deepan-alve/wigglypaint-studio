// Lyric screen for WigglyPaint: an original stylish witch (sooniyakkaari) — black floppy heart-dotted hat, long
// curly black hair, an off-shoulder sweater, a coy pose with sweater-paws, pink charm-hearts and a pink haze.
// Needs lyric-lib.js loaded first (the studio page bundles both).

const TEXT=window.WP_TEXT||{small:'',big:''};   // the studio panel's lyric boxes set WP_TEXT
{
const{layer,backdrop,clear,lyric,show,C:{INK,PAPER,YELLOW,PINK,PURPLE,RED,CYAN,GRAY,DGRAY},PI}=lyricKit();
clear();
backdrop({color:PURPLE,calm:[96,150]});

// ===== soft pink haze behind her =====
layer(PINK,g=>{g.save();g.beginPath();g.ellipse(98,150,78,96,0,0,2*PI);g.clip();
 for(let y=0;y<342;y+=2)for(let x=(y&2);x<512;x+=4)g.fillRect(x,y,1,1);g.restore()});

// ===== long curly black hair behind =====
const BUMPS=[...Array(30)].map((_,k)=>5+3.5*Math.abs(Math.sin(k*2.3)));
const hair=g=>{const n=30;g.beginPath();for(let k=0;k<=n*6;k++){const t=k/(n*6),a=-PI/2+t*2*PI;
 const bump=BUMPS[Math.floor(t*n)%n]*Math.abs(Math.sin(t*n*PI));let x=96+(64+bump)*Math.cos(a),y=140+(94+bump)*Math.sin(a);
 if(y>244)y=244;k?g.lineTo(x,y):g.moveTo(x,y)}g.closePath()};
layer(PAPER,g=>{hair(g);g.lineWidth=8;g.lineJoin='round';g.stroke();g.fill()});
layer(INK,g=>{hair(g);g.fill()});
const swirl=(g,x,y,r)=>{g.beginPath();for(let i=0;i<=40;i++){const t=i/40,a=t*3.2*PI,rr=r*t;i?g.lineTo(x+rr*Math.cos(a),y+rr*Math.sin(a)):g.moveTo(x,y)}g.stroke()};
layer(GRAY,g=>{g.save();hair(g);g.clip();g.lineWidth=1.3;g.lineCap='round';for(const[x,y]of[[46,120],[40,170],[50,214],[150,120],[158,170],[148,214],[70,80],[124,80]])swirl(g,x,y,7);g.restore()});

// ===== body: off-shoulder black sweater + grey skirt =====
const skirt=g=>{g.beginPath();g.moveTo(66,210);g.lineTo(128,210);g.bezierCurveTo(140,232,152,254,160,272);g.lineTo(32,272);g.bezierCurveTo(40,254,54,232,66,210);g.closePath()};
layer(PAPER,g=>{skirt(g);g.lineWidth=7;g.lineJoin='round';g.stroke();g.fill()});
layer(GRAY,g=>{skirt(g);g.fill()});
layer(DGRAY,g=>{g.save();skirt(g);g.clip();g.lineWidth=1.2;g.lineCap='round';for(const x of[70,92,114,136]){g.beginPath();g.moveTo(x,214);g.lineTo(x-8,270);g.stroke()}g.restore()});   // skirt folds
layer(INK,g=>{g.lineWidth=2;skirt(g);g.stroke()});
// off-shoulder sweater: bare shoulders, a wide black band across the chest
const top=g=>{g.beginPath();g.moveTo(52,216);g.lineTo(60,180);g.quadraticCurveTo(80,170,96,178);g.quadraticCurveTo(112,170,132,180);g.lineTo(140,216);g.closePath()};
layer(PAPER,g=>{top(g);g.lineWidth=7;g.lineJoin='round';g.stroke();g.fill()});
layer(INK,g=>{top(g);g.fill()});
layer(GRAY,g=>{g.save();top(g);g.clip();g.lineWidth=1;for(let x=54;x<140;x+=5)g.fillRect(x,176,1,44);g.restore()});   // knit texture
layer(PINK,g=>{for(const[x,y]of[[70,196],[110,192],[90,210]]){g.beginPath();g.moveTo(x,y+2.5);g.bezierCurveTo(x-3.5,y-.5,x-1.5,y-3,x,y-1);g.bezierCurveTo(x+1.5,y-3,x+3.5,y-.5,x,y+2.5);g.closePath();g.fill()}});   // tiny hearts on the sweater

// ===== face + sweater-paws near the chin (coy pose) =====
const face=g=>{g.beginPath();g.moveTo(64,110);g.bezierCurveTo(64,146,82,168,98,172);g.bezierCurveTo(114,168,132,146,132,110);
 g.bezierCurveTo(132,90,116,82,98,82);g.bezierCurveTo(80,82,64,90,64,110);g.closePath()};
layer(PAPER,g=>{face(g);g.fill()});
layer(INK,g=>{g.lineWidth=2.4;face(g);g.stroke()});
// curly fringe
layer(INK,g=>{g.beginPath();g.moveTo(60,112);g.bezierCurveTo(56,78,86,62,98,64);g.bezierCurveTo(112,62,142,78,136,112);g.closePath();g.fill();
 for(const[x,y,r]of[[66,110,9],[80,100,9],[96,97,9],[112,100,9],[128,110,9]]){g.beginPath();g.arc(x,y,r,0,2*PI);g.fill()}});
// coy closed eyes with lashes, soft brows, pink lips, blush
layer(INK,g=>{g.lineCap='round';
 for(const[x,s]of[[84,-1],[114,1]]){g.lineWidth=2.4;g.beginPath();g.moveTo(x-9,122);g.quadraticCurveTo(x,130,x+9,121);g.stroke();
  g.lineWidth=1.4;for(const k of[-1,0,1]){const lx=x+k*6;g.beginPath();g.moveTo(lx,124+Math.abs(k));g.lineTo(lx+s*1.5,128+Math.abs(k));g.stroke()}
  g.lineWidth=1.6;g.beginPath();g.moveTo(x-8,112);g.quadraticCurveTo(x,108,x+8,112);g.stroke()}
 g.lineWidth=1.3;g.beginPath();g.moveTo(99,138);g.lineTo(97,142);g.stroke()});
layer(PINK,g=>{g.beginPath();g.moveTo(90,150);g.quadraticCurveTo(99,156,108,149);g.quadraticCurveTo(99,160,90,150);g.fill();
 g.beginPath();g.ellipse(76,140,4.5,2.8,0,0,2*PI);g.fill();g.beginPath();g.ellipse(120,140,4.5,2.8,0,0,2*PI);g.fill()});
// sweater-paws: black sleeve cuffs raised to the chin with little hands peeking
layer(PAPER,g=>{g.lineCap='round';g.lineWidth=12;g.beginPath();g.moveTo(84,210);g.lineTo(88,164);g.stroke();g.beginPath();g.moveTo(112,210);g.lineTo(108,164);g.stroke()});
layer(INK,g=>{g.lineCap='round';g.lineWidth=13;g.beginPath();g.moveTo(84,210);g.lineTo(88,166);g.stroke();g.beginPath();g.moveTo(112,210);g.lineTo(108,166);g.stroke()});
layer(PAPER,g=>{g.beginPath();g.ellipse(89,160,5,6,0,0,2*PI);g.fill();g.beginPath();g.ellipse(107,160,5,6,0,0,2*PI);g.fill()});
layer(INK,g=>{g.lineWidth=1.4;g.beginPath();g.ellipse(89,160,5,6,0,0,2*PI);g.stroke();g.beginPath();g.ellipse(107,160,5,6,0,0,2*PI);g.stroke();
 for(const hx of[89,107])for(const o of[-1.5,1.5]){g.beginPath();g.moveTo(hx+o,156);g.lineTo(hx+o,160);g.stroke()}});

// ===== the hat: black floppy brim + cone, with pink hearts =====
const cone=g=>{g.beginPath();g.moveTo(74,76);g.quadraticCurveTo(86,36,126,30);g.quadraticCurveTo(160,27,170,16);
 g.quadraticCurveTo(156,42,130,72);g.closePath()};
const brim=g=>{g.beginPath();g.ellipse(94,80,84,20,-0.08,0,2*PI)};
layer(PAPER,g=>{cone(g);g.lineWidth=7;g.lineJoin='round';g.stroke();g.fill();brim(g);g.stroke();g.fill()});
layer(INK,g=>{cone(g);g.fill()});
layer(GRAY,g=>{g.lineWidth=5;g.lineCap='round';g.beginPath();g.moveTo(76,72);g.quadraticCurveTo(104,62,130,68);g.stroke()});   // grey band
layer(INK,g=>{brim(g);g.fill()});
layer(GRAY,g=>{g.lineWidth=1.6;g.beginPath();g.ellipse(94,80,80,17,-0.08,0,2*PI);g.stroke()});   // brim edge
const heart=(g,x,y,s)=>{g.beginPath();g.moveTo(x,y+s*.9);g.bezierCurveTo(x-s*1.4,y-s*.1,x-s*.6,y-s*1.2,x,y-s*.35);g.bezierCurveTo(x+s*.6,y-s*1.2,x+s*1.4,y-s*.1,x,y+s*.9);g.closePath()};
layer(PINK,g=>{for(const[x,y,s]of[[56,80,4],[96,86,4],[138,76,4],[120,50,3.5],[100,36,3.5]])heart(g,x,y,s),g.fill()});

// ===== floating charm-hearts (pulse per frame) + sparkles =====
const HEARTS=[[34,120,6,PINK],[164,96,7,RED],[40,210,5,RED],[158,200,5,PINK],[100,30,5,PINK]],PULSE=[1,1.25,.9];
for(const col of[PINK,RED])layer(col,(g,f)=>{for(const[x,y,s,c]of HEARTS)if(c===col){heart(g,x,y,s*PULSE[f]);g.fill()}});
layer(INK,(g,f)=>{g.lineWidth=1.1;for(const[x,y,s]of HEARTS){heart(g,x,y,s*PULSE[f]);g.stroke()}});
const STARS=[[[30,150],[176,140],[46,250]],[[34,144],[180,134],[42,256]],[[26,156],[170,146],[50,244]]];
layer(PAPER,(g,f)=>{g.lineWidth=1.4;g.lineCap='round';for(const[x,y]of STARS[f])for(const a of[0,PI/2]){g.beginPath();g.moveTo(x-5*Math.cos(a),y-5*Math.sin(a));g.lineTo(x+5*Math.cos(a),y+5*Math.sin(a));g.stroke()}});

// glowing 'mystic' lettering in a pink/heart palette
lyric(TEXT,{style:'mystic',colors:{small:PINK,word:PAPER,outline:PURPLE,glow:PINK,star:PINK,tail:PINK,box:[196,360]}});
show();
}
