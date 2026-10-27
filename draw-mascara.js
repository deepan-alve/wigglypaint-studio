// Lyric screen for WigglyPaint: the scene-1 kajal eye, now with mascara'd lashes and a wand brushing them.
// Needs lyric-lib.js loaded first (the studio page bundles both).

const TEXT=window.WP_TEXT||{small:'',big:''};   // the studio panel's lyric boxes set WP_TEXT
{
const{layer:baseLayer,backdrop,clear,bez,normal,trace,lyric,show,C:{INK,PAPER,YELLOW,PINK,PURPLE,CYAN,BROWN,ORANGE,RED,DGRAY},PI,rnd}=lyricKit();
clear();
backdrop({color:CYAN,calm:[118,128]});

// same framing as scene 1: the eye is drawn ~15% larger about its centre
const Z=[110,118],ZOOM=1.15;
const layer=(v,draw,o)=>baseLayer(v,(g,i)=>{g.translate(...Z);g.scale(ZOOM,ZOOM);g.translate(-Z[0],-Z[1]);draw(g,i)},o);

// --- eye geometry (deck pixels, before zoom) ---
const INNER=[36,144],OUTER=[190,124];
const upper=bez(INNER,[66,90],[142,80],OUTER);
const lower=bez(INNER,[74,174],[150,172],OUTER);
const crease=bez([50,116],[84,74],[152,68],[188,104]);
const brow=bez([44,74],[80,42],[150,34],[206,62]);
const IC=[114,127],IR=31;                          // iris centre / radius
const eyeClip=g=>{g.beginPath();trace(g,upper);trace(g,t=>lower(1-t));g.closePath();g.clip()};

// 0) white of the eye (keeps the background dots out of it)
layer(PAPER,g=>{eyeClip(g);g.fillRect(0,0,512,342)});

// 1) iris: golden base, radial fibres, dark limbal ring, pupil, catch-lights (all clipped to the almond)
layer(YELLOW,g=>{eyeClip(g);g.beginPath();g.arc(...IC,IR,0,2*PI);g.fill()});
layer(ORANGE,g=>{eyeClip(g);g.lineWidth=5;g.beginPath();g.arc(...IC,17,0,2*PI);g.stroke()});      // warm ring round the pupil
layer(BROWN,g=>{eyeClip(g);g.lineWidth=1;
 for(let a=0;a<2*PI;a+=.16){const r0=13+rnd(0,2),r1=IR-rnd(3,9);g.beginPath();
  g.moveTo(IC[0]+r0*Math.cos(a),IC[1]+r0*Math.sin(a));g.lineTo(IC[0]+r1*Math.cos(a+.05),IC[1]+r1*Math.sin(a+.05));g.stroke()}});
layer(INK,g=>{eyeClip(g);
 g.lineWidth=3.5;g.beginPath();g.arc(...IC,IR-1.5,0,2*PI);g.stroke();              // limbal ring
 g.beginPath();g.arc(...IC,12,0,2*PI);g.fill();                                     // pupil
 g.lineWidth=2;g.beginPath();g.arc(...IC,IR+4,PI*1.05,PI*1.95);g.stroke()});         // lid shadow on the iris
layer(PAPER,g=>{g.beginPath();g.arc(IC[0]-11,IC[1]-11,6,0,2*PI);g.fill();
 g.beginPath();g.arc(IC[0]+10,IC[1]+9,2.5,0,2*PI);g.fill()});

// 2) inner corner (tear duct) in pink
layer(PINK,g=>{g.beginPath();g.ellipse(INNER[0]+7,INNER[1]-1,6,4,-.2,0,2*PI);g.fill()});

// 3) kajal on the upper lid: a band that thickens toward the outer corner, then the winged flick
layer(INK,g=>{g.beginPath();
 for(let i=0;i<=60;i++){const t=i/60,[x,y]=upper(t);i?g.lineTo(x,y):g.moveTo(x,y)}
 for(let i=60;i>=0;i--){const t=i/60,[x,y]=upper(t),[nx,ny]=normal(upper,t),th=1.5+7*t*t;g.lineTo(x+nx*th,y+ny*th)}
 g.closePath();g.fill();
 g.beginPath();g.moveTo(OUTER[0]-14,OUTER[1]-12);g.quadraticCurveTo(204,104,218,86);   // wing, top edge
 g.quadraticCurveTo(206,110,OUTER[0]+1,OUTER[1]+4);g.closePath();g.fill()});

// 4) lid crease + MASCARA lashes: twice as many, longer, thicker, curled up and out, a thin one beside each
layer(INK,g=>{g.lineWidth=1.4;g.beginPath();trace(g,crease);g.stroke();
 for(let t=.1;t<=.95;t+=.03){const[x,y]=upper(t),[nx,ny]=normal(upper,t),th=1.5+7*t*t,
  L=14+18*Math.sin(PI*Math.min(1,t*1.1))+rnd(-2,2),sx=x+nx*th,sy=y+ny*th,ex=sx+nx*L+L*.6*(t-.35),ey=sy+ny*L-3;
  g.lineWidth=2.4;g.beginPath();g.moveTo(sx,sy);g.quadraticCurveTo(sx+nx*L*.7,sy+ny*L*.7,ex+4*t,ey+3);g.stroke();
  g.lineWidth=1.1;g.beginPath();g.moveTo(sx,sy);g.quadraticCurveTo(sx+nx*L*.65+2,sy+ny*L*.65,ex+4*t+3,ey+5);g.stroke()}});

// 5) lower lid: fine line, a few short lashes, smoky smudged kajal under it in dark grey (re-randomised per frame)
layer(INK,(g)=>{g.lineWidth=1.6;g.beginPath();trace(g,lower,60,.04,1);g.stroke();
 g.lineWidth=1.6;for(let t=.2;t<=.94;t+=.045){const[x,y]=lower(t),[nx,ny]=normal(lower,t,-1),L=6+6*Math.sin(PI*t);  // coated lower lashes
  g.beginPath();g.moveTo(x,y);g.quadraticCurveTo(x+nx*L*.6,y+ny*L*.6,x+nx*L+3*(t-.4),y+ny*L+1);g.stroke()}});
layer(DGRAY,(g)=>{
 for(let i=0;i<900;i++){const t=Math.pow(Math.random(),.6)*.95+.04,[x,y]=lower(t),[nx,ny]=normal(lower,t,-1),
  d=Math.pow(Math.random(),2)*11*(.4+t);g.fillRect(Math.round(x+nx*(2+d)+rnd(-1,1)),Math.round(y+ny*(2+d)),1,1)}});

// 6) eyebrow from individual hairs: denser and thicker at the inner end, tapering outward
layer(INK,g=>{for(let i=0;i<170;i++){const t=Math.pow(Math.random(),1.15),[x,y]=brow(t),[nx,ny]=normal(brow,t),
  off=rnd(0,2+7*(1-t)*(1-t)),ang=Math.atan2(ny,nx)+PI/2+(t<.25?-.9:.15),L=6+rnd(0,4);
  g.lineWidth=1.2;g.beginPath();g.moveTo(x+nx*off,y+ny*off);g.lineTo(x+nx*off+L*Math.cos(ang)*.9,y+ny*off+L*Math.sin(ang)*.5-1);g.stroke()}});


// --- the mascara wand: comes up from below and brushes the lower lashes toward the outer corner ---
// it slides along its own axis across the 3 frames, so the GIF shows a brushing stroke
const DIR=[Math.cos(.95),Math.sin(.95)];                         // from the brush tip down-right to the handle
const TIP=[[98,168],[106,171],[114,174]];                       // brush tip per frame (pre-zoom pixels)
const along=(p,d)=>[p[0]+DIR[0]*d,p[1]+DIR[1]*d];
const wand=i=>{const tip=TIP[i];return{tip,brushEnd:along(tip,28),rodEnd:along(tip,52),handleEnd:along(tip,90)}};
const capsule=(g,a,b,r)=>{g.lineCap='round';g.lineWidth=2*r;g.beginPath();g.moveTo(...a);g.lineTo(...b);g.stroke()};
const across=(p,r)=>[[p[0]-DIR[1]*r,p[1]+DIR[0]*r],[p[0]+DIR[1]*r,p[1]-DIR[0]*r]];
layer(PAPER,(g,i)=>{const w=wand(i);capsule(g,w.brushEnd,w.handleEnd,11)});                     // clear halo round the handle
layer(PURPLE,(g,i)=>{const w=wand(i);capsule(g,w.rodEnd,w.handleEnd,7)});                       // handle
layer(PINK,(g,i)=>{const w=wand(i);capsule(g,along(w.rodEnd,8),along(w.rodEnd,34),2.5)});      // shine stripe
layer(YELLOW,(g,i)=>{const w=wand(i);capsule(g,along(w.rodEnd,-1),along(w.rodEnd,6),7.5)});     // gold collar
layer(INK,(g,i)=>{const w=wand(i);g.lineWidth=1.5;g.lineCap='round';
 for(const r of[7,-7]){const[a]=across(w.rodEnd,r),[b]=across(w.handleEnd,r);g.beginPath();g.moveTo(...a);g.lineTo(...b);g.stroke()}
 g.beginPath();g.arc(...w.handleEnd,7,.95-PI/2,.95+PI/2);g.stroke();
 for(const d of[0,6]){const[a,b]=across(along(w.rodEnd,d),7.5);g.beginPath();g.moveTo(...a);g.lineTo(...b);g.stroke()}
 g.lineWidth=2.2;g.beginPath();g.moveTo(...w.brushEnd);g.lineTo(...w.rodEnd);g.stroke();             // rod
 g.lineWidth=1.1;for(let k=0;k<=28;k++){const t=k/28,c=along(w.tip,t*28),len=2.5+4.5*Math.sin(PI*Math.min(1,t*1.15)),s=Math.sin(k*1.2)*.35;
  const[a,b]=across(c,len);g.beginPath();g.moveTo(a[0]+DIR[0]*s*3,a[1]+DIR[1]*s*3);g.lineTo(b[0]-DIR[0]*s*3,b[1]-DIR[1]*s*3);g.stroke()}   // spiral bristles
 g.lineWidth=2;g.beginPath();g.moveTo(...w.tip);g.lineTo(...w.brushEnd);g.stroke()});

// sparkles flicking off the lashes, a different spot each frame
const SPARKS=[[[200,60],[70,52],[150,40]],[[206,54],[62,58],[158,34]],[[196,66],[76,46],[144,44]]];
layer(YELLOW,(g,i)=>{for(const[x,y]of SPARKS[i]){g.beginPath();g.arc(x,y,2.5,0,2*PI);g.fill()}});
layer(INK,(g,i)=>{g.lineWidth=1.2;for(const[x,y]of SPARKS[i])for(const a of[0,PI/2]){g.beginPath();
 g.moveTo(x-6*Math.cos(a),y-6*Math.sin(a));g.lineTo(x+6*Math.cos(a),y+6*Math.sin(a));g.stroke()}});

lyric(TEXT,{style:'poster',colors:{small:PINK,top:PINK,bottom:RED,shadow:YELLOW,tail:PURPLE}});
show();
}
