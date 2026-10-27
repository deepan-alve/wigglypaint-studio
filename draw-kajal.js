// Lyric screen for WigglyPaint: an eye lined with kajal + the lyric words beside it.
// Needs lyric-lib.js loaded first (the studio page bundles both).

const TEXT=window.WP_TEXT||{small:'',big:''};   // the studio panel's two text boxes set WP_TEXT
{
const{layer:baseLayer,backdrop,clear,bez,normal,trace,lyric,show,C:{INK,PAPER,YELLOW,PINK,CYAN,BROWN,ORANGE,DGRAY},PI,rnd}=lyricKit();
clear();                                            // a lyric screen always starts blank

backdrop({color:CYAN,calm:[118,128]});            // dots gather toward the corners, calm behind the eye

// everything in the eye is drawn ~15% larger, scaled about the eye's centre
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

// 4) lid crease + upper lashes (longer and more curled toward the outer corner)
layer(INK,g=>{g.lineWidth=1.4;g.beginPath();trace(g,crease);g.stroke();
 g.lineWidth=1.8;for(let t=.14;t<=.93;t+=.055){const[x,y]=upper(t),[nx,ny]=normal(upper,t),th=1.5+7*t*t,
  L=9+15*t,sx=x+nx*th,sy=y+ny*th,ex=sx+nx*L+L*.55*(t-.35),ey=sy+ny*L-2;
  g.beginPath();g.moveTo(sx,sy);g.quadraticCurveTo(sx+nx*L*.7,sy+ny*L*.7,ex+4*t,ey+3);g.stroke()}});

// 5) lower lid: fine line, a few short lashes, smoky smudged kajal under it in dark grey (re-randomised per frame)
layer(INK,(g)=>{g.lineWidth=1.6;g.beginPath();trace(g,lower,60,.04,1);g.stroke();
 g.lineWidth=1.2;for(let t=.45;t<=.92;t+=.09){const[x,y]=lower(t),[nx,ny]=normal(lower,t,-1);
  g.beginPath();g.moveTo(x,y);g.lineTo(x+nx*6+2*t,y+ny*6);g.stroke()}});
layer(DGRAY,(g)=>{
 for(let i=0;i<900;i++){const t=Math.pow(Math.random(),.6)*.95+.04,[x,y]=lower(t),[nx,ny]=normal(lower,t,-1),
  d=Math.pow(Math.random(),2)*11*(.4+t);g.fillRect(Math.round(x+nx*(2+d)+rnd(-1,1)),Math.round(y+ny*(2+d)),1,1)}});

// 6) eyebrow from individual hairs: denser and thicker at the inner end, tapering outward
layer(INK,g=>{for(let i=0;i<170;i++){const t=Math.pow(Math.random(),1.15),[x,y]=brow(t),[nx,ny]=normal(brow,t),
  off=rnd(0,2+7*(1-t)*(1-t)),ang=Math.atan2(ny,nx)+PI/2+(t<.25?-.9:.15),L=6+rnd(0,4);
  g.lineWidth=1.2;g.beginPath();g.moveTo(x+nx*off,y+ny*off);g.lineTo(x+nx*off+L*Math.cos(ang)*.9,y+ny*off+L*Math.sin(ang)*.5-1);g.stroke()}});

// 7) little sparkle off the wing tip
layer(YELLOW,g=>{g.beginPath();g.arc(214,64,4,0,2*PI);g.fill()});
layer(INK,g=>{g.lineWidth=1.5;const[sx,sy]=[214,64];
 for(const[a,r]of[[0,8],[PI/2,8],[PI/4,4],[3*PI/4,4]]){g.beginPath();g.moveTo(sx-r*Math.cos(a),sy-r*Math.sin(a));g.lineTo(sx+r*Math.cos(a),sy+r*Math.sin(a));g.stroke()}});

lyric(TEXT);
show();
}
