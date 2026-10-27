// Lyric screen for WigglyPaint: an ear with a swinging gold jhumka (lolaakku) + the lyric words beside it.
// Needs lyric-lib.js loaded first (the studio page bundles both).

const TEXT=window.WP_TEXT||{small:'',big:''};   // the studio panel's two text boxes set WP_TEXT
{
const{layer,backdrop,clear,bez,normal,trace,lyric,show,C:{INK,PAPER,YELLOW,PINK,ORANGE,RED,TAN,BROWN,DGRAY,LGRAY},PI,rnd}=lyricKit();
clear();
backdrop({color:PINK,calm:[120,150]});            // pink halftone, calm around the ear

// --- ear geometry: a tilted ellipse, open at the front where it meets the cheek (face is off to the left) ---
const E={cx:132,cy:128,rx:29,ry:47,rot:-.2};
const onE=(a,s=1,dx=0,dy=0)=>{const x=E.rx*s*Math.cos(a),y=E.ry*s*Math.sin(a),c=Math.cos(E.rot),n=Math.sin(E.rot);
 return[E.cx+dx+x*c-y*n,E.cy+dy+x*n+y*c]};
const A0=-2.25,A1=2.05;                                          // rim runs from upper-front, round the back, to the lobe
const outline=g=>{g.beginPath();for(let i=0;i<=80;i++){const[x,y]=onE(A0+(A1-A0)*i/80);i?g.lineTo(x,y):g.moveTo(x,y)}
 const[fx,fy]=onE(A0),[lx,ly]=onE(A1);g.quadraticCurveTo(E.cx-E.rx*.55,E.cy+4,fx,fy)};          // front edge, gently concave
const arcE=(g,s,a0,a1,dx=0,dy=0)=>{g.beginPath();for(let i=0;i<=50;i++){const[x,y]=onE(a0+(a1-a0)*i/50,s,dx,dy);i?g.lineTo(x,y):g.moveTo(x,y)}g.stroke()};
const PIVOT=(([x,y])=>[Math.round(x),Math.round(y+3)])(onE(1.62));   // bottom of the lobe: the earring hangs here

// 1) curly hair behind the ear: each strand is a trochoid (a line that loops as it falls), plus a few ringlets
const curl=(g,x0,y0,x1,y1,r,turns,ph)=>{g.beginPath();for(let i=0;i<=turns*28;i++){const t=i/(turns*28),a=ph+t*turns*2*PI;
 const bx=x0+(x1-x0)*t+10*Math.sin(t*PI),by=y0+(y1-y0)*t;const x=bx+r*Math.cos(a),y=by+r*.8*Math.sin(a);i?g.lineTo(x,y):g.moveTo(x,y)}g.stroke()};
layer(DGRAY,g=>{g.lineWidth=1.4;for(let i=0;i<14;i++){const x0=rnd(12,170),y0=rnd(22,36);curl(g,x0,y0,Math.min(196,x0+rnd(8,40)),282,rnd(2.6,4),rnd(14,22),rnd(0,6))}});   // softer grey curls behind
layer(INK,g=>{g.lineWidth=1;
 for(let i=0;i<26;i++){const x0=rnd(12,170),y0=rnd(22,36);curl(g,x0,y0,Math.min(196,x0+rnd(8,40)),282,rnd(2.2,3.6),rnd(14,22),rnd(0,6))}
 g.lineWidth=1.1;
 for(let i=0;i<7;i++){const x0=rnd(18,96),y0=rnd(160,200);curl(g,x0,y0,x0+rnd(-4,4),y0+rnd(45,75),rnd(3,4.5),rnd(6,9),rnd(0,6))}});   // ringlets
layer(PAPER,g=>{outline(g);g.closePath();g.lineWidth=9;g.stroke()});                // clear ring round the ear
layer(PAPER,g=>{outline(g);g.closePath();g.fill()});                                // clean line-art ear

// 2) the ear: outline, inner helix fold, antihelix, a soft pink bowl with a little stippled shadow, tragus
layer(PINK,g=>{g.beginPath();g.ellipse(E.cx-2,E.cy+6,7,11,E.rot,0,2*PI);g.clip();
 for(let y=0;y<342;y+=2)for(let x=(y&2);x<512;x+=4)g.fillRect(x,y,1,1)});         // a light pink blush, sparse dither
layer(INK,g=>{g.lineWidth=2.3;outline(g);g.stroke();
 g.lineWidth=1.5;arcE(g,.82,-2.1,.35);                                               // helix fold just inside the rim
 g.lineWidth=1.7;arcE(g,.56,-1.9,1.25,4,4);                                          // antihelix ridge
 g.lineWidth=1.4;g.beginPath();const[tx,ty]=onE(2.6,.9);g.moveTo(tx,ty);g.quadraticCurveTo(tx+12,ty+4,tx+6,ty+16);g.stroke();   // tragus
 for(let i=0;i<45;i++){const a=rnd(0,2*PI),r=Math.sqrt(Math.random());
  g.fillRect(Math.round(E.cx-1+r*5*Math.cos(a)),Math.round(E.cy+4+r*9*Math.sin(a)),1,1)}});                  // shadow deep in the bowl

// 3) the jhumka: rotate everything about the lobe so it swings -> 0 -> + over the 3 frames
const SWING=[-.13,0,.13];
const hang=(g,i)=>{g.translate(...PIVOT);g.rotate(SWING[i]);g.translate(-PIVOT[0],-PIVOT[1])};
const BELL={top:PIVOT[1]+30,rim:PIVOT[1]+60,half:24,x:PIVOT[0]};
const bell=g=>{g.beginPath();g.moveTo(BELL.x-BELL.half,BELL.rim);
 g.bezierCurveTo(BELL.x-BELL.half,BELL.top-6,BELL.x+BELL.half,BELL.top-6,BELL.x+BELL.half,BELL.rim);
 g.quadraticCurveTo(BELL.x,BELL.rim+7,BELL.x-BELL.half,BELL.rim);g.closePath()};
// gold first
layer(YELLOW,(g,i)=>{hang(g,i);bell(g);g.fill();
 g.beginPath();g.arc(PIVOT[0],PIVOT[1]+4,7,0,2*PI);g.fill();                                      // stud
 g.beginPath();g.ellipse(BELL.x,BELL.top-6,9,5,0,0,2*PI);g.fill()});                              // cap
layer(ORANGE,(g,i)=>{hang(g,i);bell(g);g.clip();g.fillRect(0,BELL.top+19,512,40)});           // shaded lower band of the bell
// ink details on top
layer(INK,(g,i)=>{hang(g,i);g.lineWidth=1.8;bell(g);g.stroke();
 for(let k=0;k<6;k++){const a=k*PI/3;g.beginPath();                                             // flower stud petals
  g.ellipse(PIVOT[0]+5*Math.cos(a),PIVOT[1]+4+5*Math.sin(a),3,2,a,0,2*PI);g.stroke()}
 g.lineWidth=1.5;g.beginPath();g.moveTo(PIVOT[0],PIVOT[1]+11);g.lineTo(BELL.x,BELL.top-11);g.stroke();   // link
 g.beginPath();g.ellipse(BELL.x,BELL.top-6,9,5,0,0,2*PI);g.stroke();
 // engraved bands + dotted pattern on the dome
 for(const[y,w]of[[BELL.top+6,.55],[BELL.top+16,.85]]){g.beginPath();
  g.moveTo(BELL.x-BELL.half*w,y);g.quadraticCurveTo(BELL.x,y+4,BELL.x+BELL.half*w,y);g.stroke()}
 for(let r=0;r<2;r++)for(let k=-3;k<=3;k++){const y=BELL.top+11+r*11,x=BELL.x+k*(5+r*1.6);g.fillRect(Math.round(x),Math.round(y+Math.abs(k)*.4),2,2)}
 g.lineWidth=2.4;g.beginPath();g.moveTo(BELL.x-BELL.half,BELL.rim);g.quadraticCurveTo(BELL.x,BELL.rim+7,BELL.x+BELL.half,BELL.rim);g.stroke();
 // pearl fringe hanging off the rim, longest in the middle
 g.lineWidth=1;for(let k=-4;k<=4;k++){const x=BELL.x+k*5.6,y0=BELL.rim+3.5-Math.abs(k)*.4,len=7+(4-Math.abs(k))*1.6;
  g.beginPath();g.moveTo(x,y0);g.lineTo(x,y0+len);g.stroke();g.beginPath();g.arc(x,y0+len+2.4,2.4,0,2*PI);g.stroke()}});
// red gem in the stud
layer(RED,(g,i)=>{hang(g,i);g.beginPath();g.arc(PIVOT[0],PIVOT[1]+4,2.6,0,2*PI);g.fill()});

// 4) maattal: a beaded chain from the top of the jhumka up into the hair (sways with it)
const chainAt=i=>bez([PIVOT[0]+Math.sin(SWING[i])*30,BELL.top-8],[70,214],[34,150],[48,72]);
for(const[col,odd]of[[RED,0],[YELLOW,1]])layer(col,(g,i)=>{const ch=chainAt(i);let n=0;
 for(let t=0;t<=1;t+=.035,n++){if(n%2!==odd)continue;const[x,y]=ch(t);g.beginPath();g.arc(x,y,2,0,2*PI);g.fill()}});
layer(INK,(g,i)=>{const ch=chainAt(i);
 for(let t=0;t<=1;t+=.035){const[x,y]=ch(t);g.lineWidth=1;g.beginPath();g.arc(x,y,2.2,0,2*PI);g.stroke()}});

// 5) a couple of glints on the gold
layer(PAPER,(g,i)=>{hang(g,i);g.beginPath();g.ellipse(BELL.x-10,BELL.top+2,2.5,4,-.5,0,2*PI);g.fill()});
layer(INK,(g,i)=>{g.lineWidth=1.3;const[sx,sy]=[[PIVOT[0]+44,PIVOT[1]+30],[PIVOT[0]+46,PIVOT[1]+28],[PIVOT[0]+48,PIVOT[1]+31]][i];                 // twinkle moves per frame
 for(const[a,r]of[[0,6],[PI/2,6],[PI/4,3],[3*PI/4,3]]){g.beginPath();g.moveTo(sx-r*Math.cos(a),sy-r*Math.sin(a));g.lineTo(sx+r*Math.cos(a),sy+r*Math.sin(a));g.stroke()}});

lyric(TEXT,'poster');
show();
}
