// Lyric screen for WigglyPaint: an original porcelain doll on a little stand, rocking gently side to side,
// with sugar crystals twinkling around her. Lettering on a hanging toy-shop tag.
// Needs lyric-lib.js loaded first (the studio page bundles both).

const TEXT=window.WP_TEXT||{small:'',big:''};   // the studio panel's lyric boxes set WP_TEXT
{
const{layer:baseLayer,backdrop,clear,lyric,show,C:{INK,PAPER,YELLOW,PINK,PURPLE,RED,CYAN,BLUE,LGRAY,GRAY},PI}=lyricKit();
clear();
backdrop({color:CYAN,calm:[104,156]});

// the doll rocks about the middle of her stand: everything except the stand rotates a little per frame
const PIVOT=[104,252],ROCK=[-.06,0,.06];
const layer=(v,draw,o)=>baseLayer(v,(g,f)=>{g.translate(...PIVOT);g.rotate(ROCK[f]);g.translate(-PIVOT[0],-PIVOT[1]);draw(g,f)},o);

// --- shapes ---
const head=g=>{g.beginPath();g.ellipse(104,96,34,32,0,0,2*PI)};
// puffy curly bob: a bumpy cloud behind the head, and a fringe of round curls across the forehead
const BUMPS=[...Array(22)].map((_,k)=>3.5+2.5*Math.abs(Math.sin(k*2.3)));
const hairBack=g=>{g.beginPath();const n=22;for(let k=0;k<=n*8;k++){const t=k/(n*8),a=-PI/2+t*2*PI;
  const bump=BUMPS[Math.floor(t*n)%n]*Math.abs(Math.sin(t*n*PI));let x=104+(44+bump)*Math.cos(a),y=96+(42+bump)*Math.sin(a);
  if(y>124)y=124+(y-124)*.25;k?g.lineTo(x,y):g.moveTo(x,y)}g.closePath()};
const FRINGE=[[76,84,8],[88,78,8],[100,76,8],[112,77,8],[124,80,8],[134,88,7]];
const hair=g=>{g.beginPath();g.moveTo(70,96);g.bezierCurveTo(70,66,88,58,104,58);g.bezierCurveTo(120,58,138,66,138,96);g.closePath();g.fill();
 for(const[x,y,r]of FRINGE){g.beginPath();g.arc(x,y,r,0,2*PI);g.fill()}};
const dress=g=>{g.beginPath();g.moveTo(88,126);g.lineTo(120,126);g.bezierCurveTo(132,160,146,200,152,236);
 g.quadraticCurveTo(104,248,56,236);g.bezierCurveTo(62,200,76,160,88,126);g.closePath()};
const frill=(g,y,x0,x1)=>{g.beginPath();g.moveTo(x0,y);for(let x=x0;x<x1;x+=8)g.arc(x+4,y,4,PI,0,true);g.stroke()};
const stand=g=>{g.beginPath();g.ellipse(104,254,40,8,0,0,2*PI)};

// stand (doesn't rock)
baseLayer(PAPER,g=>{stand(g);g.lineWidth=7;g.stroke();g.fill()});
baseLayer(PURPLE,g=>{stand(g);g.fill()});
baseLayer(YELLOW,g=>{g.lineWidth=2;g.beginPath();g.ellipse(104,252,32,5,0,PI,2*PI);g.stroke()});
baseLayer(INK,g=>{stand(g);g.lineWidth=2;g.stroke()});

// halo
layer(PAPER,g=>{g.lineWidth=8;g.lineJoin='round';dress(g);g.stroke();g.fill();hairBack(g);g.stroke();g.fill()});
// arms + legs
layer(INK,g=>{g.lineCap='round';g.lineWidth=8;for(const s of[-1,1]){g.beginPath();g.moveTo(104+s*10,240);g.lineTo(104+s*10,246);g.stroke()}});   // legs
// dress: pink with polka dots, a lace collar, frilly hem
layer(PINK,g=>{dress(g);g.fill()});
layer(PAPER,g=>{dress(g);g.clip();for(const[x,y]of[[92,150],[114,148],[84,182],[104,174],[124,184],[76,214],[98,208],[120,212],[140,220]]){g.beginPath();g.arc(x,y,2.6,0,2*PI);g.fill()}});
layer(PAPER,g=>{g.beginPath();g.ellipse(104,130,20,7,0,0,PI);g.fill()});
layer(INK,g=>{g.lineJoin='round';g.lineWidth=2;dress(g);g.stroke();g.lineWidth=1.2;g.beginPath();g.ellipse(104,130,20,7,0,0,PI);g.stroke();
 frill(g,234,58,150);g.lineWidth=1;frill(g,226,62,146)});
layer(RED,g=>{g.beginPath();g.moveTo(104,138);g.lineTo(96,133);g.lineTo(96,143);g.closePath();g.fill();g.beginPath();g.moveTo(104,138);g.lineTo(112,133);g.lineTo(112,143);g.closePath();g.fill()});   // little bow at the collar
// arms over the dress: puffed sleeves, forearms coming in so the hands meet in front holding a little flower
const ARM=s=>[[104+s*20,136],[104+s*30,160],[104+s*7,176]];
layer(PAPER,g=>{g.lineCap=g.lineJoin='round';g.lineWidth=13;for(const s of[-1,1]){const[a,b,c]=ARM(s);g.beginPath();g.moveTo(...a);g.lineTo(...b);g.lineTo(...c);g.stroke()}});
layer(INK,g=>{g.lineCap=g.lineJoin='round';g.lineWidth=8.5;for(const s of[-1,1]){const[a,b,c]=ARM(s);g.beginPath();g.moveTo(...a);g.lineTo(...b);g.lineTo(...c);g.stroke()}});
layer(PAPER,g=>{g.lineCap=g.lineJoin='round';g.lineWidth=5.5;for(const s of[-1,1]){const[a,b,c]=ARM(s);g.beginPath();g.moveTo(...a);g.lineTo(...b);g.lineTo(...c);g.stroke()}});
layer(PINK,g=>{for(const s of[-1,1]){g.beginPath();g.ellipse(104+s*21,138,7,6,0,0,2*PI);g.fill()}});          // puffed sleeves
layer(INK,g=>{g.lineWidth=1.4;for(const s of[-1,1]){g.beginPath();g.ellipse(104+s*21,138,7,6,0,0,2*PI);g.stroke()}});
layer(YELLOW,(g,f)=>{const y=168+[0,-1,0][f];for(let k=0;k<5;k++){const a=k*2*PI/5;g.beginPath();g.arc(104+4*Math.cos(a),y+4*Math.sin(a),2.6,0,2*PI);g.fill()}});
layer(RED,(g,f)=>{g.beginPath();g.arc(104,168+[0,-1,0][f],1.8,0,2*PI);g.fill()});
layer(INK,(g,f)=>{const y=168+[0,-1,0][f];g.lineWidth=.8;for(let k=0;k<5;k++){const a=k*2*PI/5;g.beginPath();g.arc(104+4*Math.cos(a),y+4*Math.sin(a),2.6,0,2*PI);g.stroke()}});

// curly hair behind the head, with grey curl swirls
layer(INK,g=>{hairBack(g);g.fill()});
const swirl=(g,x,y,r)=>{g.beginPath();for(let i=0;i<=40;i++){const t=i/40,a=t*3.2*PI,rr=r*t;i?g.lineTo(x+rr*Math.cos(a),y+rr*Math.sin(a)):g.moveTo(x,y)}g.stroke()};
layer(GRAY,g=>{hairBack(g);g.clip();g.lineWidth=1.2;g.lineCap='round';for(const[x,y]of[[66,92],[62,116],[142,92],[146,116],[80,62],[128,62]])swirl(g,x,y,5)});
// head: porcelain white, outline
layer(PAPER,g=>{head(g);g.fill()});
layer(INK,g=>{head(g);g.lineWidth=2.4;g.stroke()});
// hair + pink bow
layer(INK,g=>hair(g));
layer(PAPER,g=>{g.lineWidth=2;g.lineCap='round';g.beginPath();g.arc(92,64,6,PI*1.1,PI*1.6);g.stroke();g.beginPath();g.arc(112,62,5,PI*1.1,PI*1.6);g.stroke()});
layer(PINK,g=>{for(const s of[-1,1]){g.beginPath();g.moveTo(130,64);g.lineTo(130+s*12,56);g.lineTo(130+s*12,72);g.closePath();g.fill()}g.beginPath();g.arc(130,64,3.5,0,2*PI);g.fill()});
layer(INK,g=>{g.lineWidth=1.2;for(const s of[-1,1]){g.beginPath();g.moveTo(130,64);g.lineTo(130+s*12,56);g.lineTo(130+s*12,72);g.closePath();g.stroke()}g.beginPath();g.arc(130,64,3.5,0,2*PI);g.stroke()});
// face: big glossy eyes with lashes, rosy round cheeks, tiny smile
for(const x of[92,116]){
 layer(INK,g=>{g.beginPath();g.ellipse(x,100,6,7.5,0,0,2*PI);g.fill();g.lineWidth=1.4;g.lineCap='round';
  for(const k of[-1,0,1]){g.beginPath();g.moveTo(x+k*4,93);g.lineTo(x+k*6,88);g.stroke()}});
 layer(BLUE,g=>{g.beginPath();g.ellipse(x,102,3.6,4.4,0,0,2*PI);g.fill()});
 layer(PAPER,g=>{g.beginPath();g.arc(x-2,97,2,0,2*PI);g.fill();g.beginPath();g.arc(x+2,104,1,0,2*PI);g.fill()})}
layer(PINK,g=>{for(const x of[82,126]){g.beginPath();g.arc(x,112,5,0,2*PI);g.fill()}});
layer(RED,g=>{g.beginPath();g.moveTo(100,116);g.quadraticCurveTo(104,121,108,116);g.quadraticCurveTo(104,118,100,116);g.fill()});

// sugar crystals twinkling around her (screen space, a different set lit each frame)
const CRYSTALS=[[34,60,5],[176,48,4],[30,150,4],[182,128,5],[44,214,4],[170,196,4],[60,32,3],[150,24,3]];
const crystal=(g,x,y,s)=>{g.beginPath();g.moveTo(x,y-s*1.4);g.lineTo(x+s,y);g.lineTo(x,y+s*1.4);g.lineTo(x-s,y);g.closePath()};
baseLayer(PAPER,(g,f)=>{for(const[i,[x,y,s]]of CRYSTALS.entries()){crystal(g,x,y,s*((i+f)%3?1:1.4));g.fill()}});
baseLayer(INK,(g,f)=>{g.lineWidth=1;for(const[i,[x,y,s]]of CRYSTALS.entries()){const k=(i+f)%3?1:1.4;crystal(g,x,y,s*k);g.stroke();
 if(k>1){for(const a of[0,PI/2]){g.beginPath();g.moveTo(x-s*3*Math.cos(a),y-s*3*Math.sin(a));g.lineTo(x+s*3*Math.cos(a),y+s*3*Math.sin(a));g.stroke()}}}});

// candy lettering: striped bubble letters with sugar sparkles
lyric(TEXT,{style:'candy',colors:{small:PINK,stripe:PINK,fill:PAPER,shadow:CYAN,tail:PURPLE,box:[200,356]}});
show();
}
