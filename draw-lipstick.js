// Lyric screen for WigglyPaint: glossy red lips + a lipstick twisting up out of its gold case, hearts drifting up.
// Needs lyric-lib.js loaded first (the studio page bundles both).

const TEXT=window.WP_TEXT||{small:'',big:''};   // the studio panel's lyric boxes set WP_TEXT
{
const{layer,backdrop,clear,bez,normal,trace,lyric,show,C:{INK,PAPER,YELLOW,PINK,PURPLE,RED,ORANGE,LGRAY},PI,rnd}=lyricKit();
clear();
backdrop({color:PURPLE,calm:[112,146]});

// --- lips: cupid's bow on top, full rounded lower lip; slight smile at the corners ---
const L=[34,146],R=[190,140],M=[112,148];                        // corners + middle of the mouth line
const upperTop=g=>{g.moveTo(...L);g.bezierCurveTo(56,128,80,104,98,108);g.quadraticCurveTo(106,110,112,120);
 g.quadraticCurveTo(118,110,126,108);g.bezierCurveTo(146,104,170,124,...R)};
const mouthLine=(g,rev=false)=>{const p=[L,[74,156],[150,154],R];const q=rev?p.slice().reverse():p;
 rev?g.lineTo(...q[0]):g.moveTo(...q[0]);g.bezierCurveTo(...q[1],...q[2],...q[3])};
const lowerBottom=g=>{g.bezierCurveTo(176,182,140,196,112,196);g.bezierCurveTo(84,196,48,182,...L)};
const upperLip=g=>{g.beginPath();upperTop(g);mouthLine(g,true);g.closePath()};
const lowerLip=g=>{g.beginPath();mouthLine(g);lowerBottom(g);g.closePath()};

layer(PAPER,g=>{upperLip(g);g.fill();lowerLip(g);g.fill();g.lineWidth=10;upperLip(g);g.stroke();lowerLip(g);g.stroke()});
layer(RED,g=>{upperLip(g);g.fill();lowerLip(g);g.fill()});
layer(PINK,g=>{g.beginPath();g.ellipse(112,176,30,9,0,0,2*PI);g.fill();                               // lower-lip sheen
 g.beginPath();g.ellipse(84,128,12,5,-.4,0,2*PI);g.fill();g.beginPath();g.ellipse(140,128,12,5,.4,0,2*PI);g.fill()});
layer(PAPER,(g,i)=>{const s=[[0,0],[2,-1],[-1,1]][i];                                                    // gloss glints shift a touch per frame
 g.beginPath();g.ellipse(104+s[0],174+s[1],9,3,-.1,0,2*PI);g.fill();
 g.beginPath();g.arc(128+s[0],178+s[1],2.2,0,2*PI);g.fill();g.beginPath();g.ellipse(86+s[0],126+s[1],5,2,-.4,0,2*PI);g.fill()});
layer(INK,g=>{g.lineWidth=2.2;upperLip(g);g.stroke();lowerLip(g);g.stroke();
 g.lineWidth=3;g.beginPath();mouthLine(g);g.stroke();                                                  // the parting line, a bit heavier
 g.lineWidth=1.2;for(let k=0;k<9;k++){const x=70+k*10,y0=162+Math.abs(k-4)*1.5;                         // little lip creases
  g.beginPath();g.moveTo(x,y0);g.quadraticCurveTo(x+1,y0+6,x-1,y0+11);g.stroke()}
 for(const s of[-1,1]){g.beginPath();g.moveTo(112+s*44,140);g.quadraticCurveTo(112+s*40,132,112+s*36,128);g.stroke()}
 g.lineWidth=1.6;for(const[c,d]of[[L,-1],[R,1]]){g.beginPath();g.moveTo(c[0]+d*2,c[1]-1);g.quadraticCurveTo(c[0]+d*7,c[1]-4,c[0]+d*9,c[1]-9);g.stroke()}});  // smile dimples

// --- the lipstick: gold case lower right of the lips, bullet twisting up a little more each frame ---
const ANG=-2.05;                                                 // axis pointing from the case up-left toward the lips
const BASE=[196,262];                                            // bottom of the case
const RISE=[16,22,28];                                           // how far the bullet sticks out, per frame
const stick=(g,draw)=>{g.translate(...BASE);g.rotate(ANG);draw(g)};       // local coords: +x runs up the stick
const CASE_LEN=40,SLEEVE=26,W=11;
const bulletPath=(g,rise)=>{g.beginPath();g.moveTo(CASE_LEN+SLEEVE,-W*.8);g.lineTo(CASE_LEN+SLEEVE+rise,-W*.8);
 g.lineTo(CASE_LEN+SLEEVE+rise+12,W*.2);g.quadraticCurveTo(CASE_LEN+SLEEVE+rise+13,W*.8,CASE_LEN+SLEEVE+rise+6,W*.8);
 g.lineTo(CASE_LEN+SLEEVE,W*.8);g.closePath()};                  // slanted tip, like a used lipstick
layer(PAPER,(g,i)=>stick(g,g=>{g.lineWidth=8;g.lineJoin='round';g.strokeRect(0,-W-1,CASE_LEN+SLEEVE,2*W+2);
 bulletPath(g,RISE[i]);g.stroke();g.fill()}));
layer(PURPLE,(g,i)=>stick(g,g=>{g.beginPath();g.roundRect(0,-W,CASE_LEN,2*W,4);g.fill()}));          // base
layer(YELLOW,(g,i)=>stick(g,g=>{g.fillRect(CASE_LEN,-W*.9,SLEEVE,W*1.8)}));                          // gold sleeve
layer(ORANGE,(g,i)=>stick(g,g=>{g.fillRect(CASE_LEN,W*.2,SLEEVE,W*.7);g.fillRect(CASE_LEN-2,-W,3,2*W)}));   // sleeve shading + gold rim
layer(RED,(g,i)=>stick(g,g=>{bulletPath(g,RISE[i]);g.fill()}));
layer(PINK,(g,i)=>stick(g,g=>{g.fillRect(CASE_LEN+SLEEVE+2,-W*.6,RISE[i]+4,2.5)}));                 // shine on the bullet
layer(LGRAY,(g,i)=>stick(g,g=>{g.fillRect(4,-W*.65,CASE_LEN-10,2.5)}));                              // shine on the base
layer(INK,(g,i)=>stick(g,g=>{g.lineWidth=1.6;g.beginPath();g.roundRect(0,-W,CASE_LEN,2*W,4);g.stroke();
 g.strokeRect(CASE_LEN,-W*.9,SLEEVE,W*1.8);bulletPath(g,RISE[i]);g.stroke();
 g.lineWidth=1;for(let k=1;k<4;k++){g.beginPath();g.moveTo(CASE_LEN+k*6.5,-W*.9);g.lineTo(CASE_LEN+k*6.5,W*.9);g.stroke()}}));  // ridges on the sleeve

// hearts drifting up past the lips; each frame lifts them a little
const heart=(g,x,y,s)=>{g.beginPath();g.moveTo(x,y+s*.9);g.bezierCurveTo(x-s*1.4,y-s*.1,x-s*.6,y-s*1.2,x,y-s*.35);
 g.bezierCurveTo(x+s*.6,y-s*1.2,x+s*1.4,y-s*.1,x,y+s*.9);g.closePath()};
const HEARTS=[[52,92,6,PINK],[176,96,5,RED],[150,62,7,PINK],[70,56,4,RED],[200,180,5,PINK]];
for(const col of[PINK,RED])layer(col,(g,i)=>{for(const[x,y,s,c]of HEARTS)if(c===col){heart(g,x+(i===1?1:0),y-i*3,s);g.fill()}});
layer(INK,(g,i)=>{g.lineWidth=1.2;for(const[x,y,s]of HEARTS){heart(g,x+(i===1?1:0),y-i*3,s);g.stroke()}});

lyric(TEXT,{style:'script',colors:{small:INK,smallFont:"'Antonio'",smallWeight:400,smallPx:46,smallSpacing:5,
  fill:RED,shadow:PINK,tail:PURPLE,swash:INK}});   // tall condensed fashion caps over a sign-painter script word
show();
}
