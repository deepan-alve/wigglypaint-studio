// Lyric screen for WigglyPaint: an original anime-style girl with a sticker pottu between the brows,
// a powder puff dabbing foundation on the cheek (it bounces per frame) and an open compact beside her.
// Needs lyric-lib.js loaded first (the studio page bundles both).

const TEXT=window.WP_TEXT||{small:'',big:''};   // the studio panel's lyric boxes set WP_TEXT
{
const{layer,backdrop,clear,lyric,show,C:{INK,PAPER,YELLOW,PINK,PURPLE,RED,ORANGE,CYAN,TAN,LGRAY,GRAY},PI,rnd}=lyricKit();
clear();
backdrop({color:YELLOW,calm:[100,150]});

// --- an original anime-style girl: soft wide cheeks, small pointed chin, big sparkly eyes, pointed bangs ---
const FC=[100,150];
const face=g=>{g.beginPath();g.moveTo(60,124);g.bezierCurveTo(60,162,82,194,100,206);g.bezierCurveTo(118,194,140,162,140,124);
 g.bezierCurveTo(140,98,122,86,100,86);g.bezierCurveTo(78,86,60,98,60,124);g.closePath()};
// curly hair: a big cloud of curls with a bumpy outline (bump size varies a little so it isn't too regular)
const BUMPS=[...Array(34)].map((_,k)=>4+3*Math.abs(Math.sin(k*2.3)));
const hairBack=g=>{g.beginPath();const n=34;for(let k=0;k<=n*6;k++){const t=k/(n*6),a=-PI/2+t*2*PI;
  const bump=BUMPS[Math.floor(t*n)%n]*Math.abs(Math.sin(t*n*PI));
  let x=100+(74+bump)*Math.cos(a),y=150+(98+bump)*Math.sin(a);if(y>262)y=262;
  k?g.lineTo(x,y):g.moveTo(x,y)}g.closePath()};
// curly fringe: a cap of hair over the crown ending in a row of round curls across the forehead
const FRINGE=[[62,116,9],[76,108,9],[90,104,9],[104,103,9],[118,106,9],[131,112,9],[141,122,8]];
const bangs=g=>{g.beginPath();g.moveTo(54,130);g.bezierCurveTo(54,88,78,70,100,70);g.bezierCurveTo(122,70,146,88,146,130);g.closePath();g.fill();
 for(const[x,y,r]of FRINGE){g.beginPath();g.arc(x,y,r,0,2*PI);g.fill()}};
const top=g=>{g.beginPath();g.moveTo(40,262);g.bezierCurveTo(44,236,64,226,88,222);g.quadraticCurveTo(100,236,112,222);
 g.bezierCurveTo(136,226,156,236,160,262);g.closePath()};
const neck=g=>{g.beginPath();g.moveTo(90,196);g.lineTo(89,224);g.quadraticCurveTo(100,232,111,224);g.lineTo(110,196);g.closePath()};

// hair behind + shoulders
layer(PAPER,g=>{hairBack(g);g.lineWidth=8;g.stroke();g.fill()});
layer(INK,g=>{hairBack(g);g.fill()});
layer(CYAN,g=>{top(g);g.fill()});                                              // top
layer(YELLOW,g=>{g.lineWidth=4;g.beginPath();g.moveTo(88,222);g.quadraticCurveTo(100,238,112,222);g.stroke()});   // gold neckline
layer(INK,g=>{g.lineWidth=2;top(g);g.stroke()});
// neck + face
layer(PAPER,g=>{neck(g);g.fill();face(g);g.fill()});
layer(INK,g=>{g.lineWidth=2;g.lineJoin='round';neck(g);g.stroke();g.lineWidth=2.4;face(g);g.stroke()});
// bangs + side locks over the face, then a white shine band across the crown
layer(INK,g=>bangs(g));
const coil=(g,x0,y0,len,r,turns,s)=>{g.beginPath();for(let i=0;i<=turns*24;i++){const t=i/(turns*24),a=t*turns*2*PI;
 const x=x0+s*r*Math.cos(a)+s*2*Math.sin(t*PI),y=y0+t*len+r*.55*Math.sin(a);i?g.lineTo(x,y):g.moveTo(x,y)}g.stroke()};
layer(INK,g=>{g.lineCap='round';g.lineWidth=4.2;for(const s of[-1,1]){coil(g,100+s*46,112,96,5,5.5,s);coil(g,100+s*38,150,70,4,4,s)}});
const CURLS=[[40,120],[30,170],[44,212],[34,246],[160,120],[170,170],[156,212],[166,246],[70,84],[130,84],[100,74],[52,150],[150,150],[60,240],[140,240]];
const swirl=(g,x,y,r)=>{g.beginPath();for(let i=0;i<=40;i++){const t=i/40,a=t*3.2*PI,rr=r*t;i?g.lineTo(x+rr*Math.cos(a),y+rr*Math.sin(a)):g.moveTo(x,y)}g.stroke()};
layer(GRAY,g=>{hairBack(g);g.clip();g.lineWidth=1.3;g.lineCap='round';for(const[x,y]of CURLS)swirl(g,x,y,7)});
layer(PAPER,g=>{g.lineWidth=1.6;g.lineCap='round';for(const[x,y]of[[78,80],[92,76],[116,78]]){g.beginPath();g.arc(x,y,5,PI*1.1,PI*1.7);g.stroke()}
 for(const s of[-1,1]){g.beginPath();g.arc(100+s*46,128,3,PI*1.1,PI*1.8);g.stroke()}});        // little shine on the crown and ringlets

// big sparkly eyes
const EYES=[[82,150,-1],[118,150,1]];
const opening=(g,[x,y,s])=>{g.beginPath();g.moveTo(x-s*13,y-1);g.bezierCurveTo(x-s*8,y-12,x+s*8,y-13,x+s*13,y-5);
 g.bezierCurveTo(x+s*10,y+7,x-s*8,y+9,x-s*13,y-1);g.closePath()};
for(const e of EYES){
 layer(PAPER,g=>{opening(g,e);g.fill()});
 layer(PURPLE,g=>{opening(g,e);g.clip();g.beginPath();g.ellipse(e[0]+e[2],e[1]-1,7.5,10,0,0,2*PI);g.fill()});   // iris
 layer(PINK,g=>{opening(g,e);g.clip();g.beginPath();g.ellipse(e[0]+e[2],e[1]+5,5,3.4,0,0,2*PI);g.fill()});      // warm glow low in the iris
 layer(INK,g=>{opening(g,e);g.clip();g.beginPath();g.ellipse(e[0]+e[2],e[1]-1,3.6,5,0,0,2*PI);g.fill()});       // pupil
 layer(PAPER,g=>{g.beginPath();g.arc(e[0]+e[2]-3,e[1]-5,2.6,0,2*PI);g.fill();g.beginPath();g.arc(e[0]+e[2]+3,e[1]+3,1.3,0,2*PI);g.fill()});   // highlights
 layer(INK,g=>{const[x,y,s]=e;g.lineCap='round';
  g.lineWidth=3.6;g.beginPath();g.moveTo(x-s*13,y-1);g.bezierCurveTo(x-s*8,y-12,x+s*8,y-13,x+s*14,y-6);g.stroke();            // thick upper lash line
  g.lineWidth=2;for(const[dx,dy]of[[14,-6],[16,-9]]){g.beginPath();g.moveTo(x+s*(dx-2),y+dy+1);g.lineTo(x+s*(dx+3),y+dy-2);g.stroke()}   // outer flicks
  g.lineWidth=1.2;g.beginPath();g.moveTo(x-s*8,y+6);g.quadraticCurveTo(x,y+9,x+s*10,y+3);g.stroke();                          // lower lid
  g.lineWidth=1.6;g.beginPath();g.moveTo(x-s*9,y-19);g.quadraticCurveTo(x,y-23,x+s*10,y-19);g.stroke()})}                    // brow

// tiny nose, small smile, blush hatching
layer(INK,g=>{g.lineCap='round';g.lineWidth=1.4;g.beginPath();g.moveTo(101,170);g.lineTo(99,174);g.stroke();
 g.lineWidth=1.6;g.beginPath();g.moveTo(93,185);g.quadraticCurveTo(100,190,107,185);g.stroke()});
layer(PINK,g=>{g.beginPath();g.moveTo(95,186);g.quadraticCurveTo(100,192,105,186);g.quadraticCurveTo(100,189,95,186);g.fill();
 g.lineWidth=1.3;g.lineCap='round';for(const cx of[76,124])for(let k=0;k<3;k++){g.beginPath();g.moveTo(cx-6+k*4,170);g.lineTo(cx-3+k*4,165);g.stroke()}});

// the sticker pottu between the brows
const POTTU=[100,134];
layer(RED,g=>{g.beginPath();g.arc(...POTTU,2.2,0,2*PI);g.fill()});                      // small sticker pottu
layer(PAPER,g=>{g.fillRect(POTTU[0]-1,POTTU[1]-1,1,1)});                                  // pin-prick shine

// --- foundation: an open compact beside her, a puff dabbing the cheek and bouncing per frame ---
const CMP=[170,232];
layer(PAPER,g=>{g.lineWidth=8;g.beginPath();g.ellipse(...CMP,22,9,0,0,2*PI);g.stroke();g.fill();
 g.beginPath();g.ellipse(CMP[0]+4,CMP[1]-24,20,14,.25,0,2*PI);g.stroke();g.fill()});
layer(LGRAY,g=>{g.beginPath();g.ellipse(...CMP,22,9,0,0,2*PI);g.fill()});                                  // case
layer(TAN,g=>{g.beginPath();g.ellipse(CMP[0],CMP[1]-1,16,6,0,0,2*PI);g.fill()});                          // the foundation pan
layer(LGRAY,g=>{g.beginPath();g.ellipse(CMP[0]+4,CMP[1]-24,20,14,.25,0,2*PI);g.fill()});                  // open lid
layer(PAPER,g=>{g.beginPath();g.ellipse(CMP[0]+4,CMP[1]-24,15,10,.25,0,2*PI);g.fill()});                  // mirror
layer(INK,g=>{g.lineWidth=1.6;g.beginPath();g.ellipse(...CMP,22,9,0,0,2*PI);g.stroke();
 g.beginPath();g.ellipse(CMP[0],CMP[1]-1,16,6,0,0,2*PI);g.stroke();
 g.beginPath();g.ellipse(CMP[0]+4,CMP[1]-24,20,14,.25,0,2*PI);g.stroke();g.beginPath();g.ellipse(CMP[0]+4,CMP[1]-24,15,10,.25,0,2*PI);g.stroke();
 g.lineWidth=1;g.beginPath();g.moveTo(CMP[0]-4,CMP[1]-30);g.lineTo(CMP[0]+6,CMP[1]-20);g.stroke()});      // mirror glint

const BOB=[0,-3,2];
const puffAt=f=>[140,172+BOB[f]];                               // resting on her right cheek
layer(PAPER,(g,f)=>{const[x,y]=puffAt(f);g.lineWidth=7;g.beginPath();g.ellipse(x,y,14,10,-.3,0,2*PI);g.stroke();g.fill()});
layer(PINK,(g,f)=>{const[x,y]=puffAt(f);g.beginPath();g.ellipse(x,y,14,10,-.3,0,2*PI);g.fill()});
layer(PAPER,(g,f)=>{const[x,y]=puffAt(f);g.lineWidth=3;g.beginPath();g.ellipse(x+1,y-1,9,6,-.3,PI*1.1,PI*1.9);g.stroke()});   // ribbon band
layer(INK,(g,f)=>{const[x,y]=puffAt(f);g.lineWidth=1.6;g.beginPath();g.ellipse(x,y,14,10,-.3,0,2*PI);g.stroke();
 g.lineWidth=1;g.beginPath();g.ellipse(x+1,y-1,9,6,-.3,PI*1.1,PI*1.9);g.stroke()});
layer(LGRAY,(g,f)=>{const[x,y]=puffAt(f);for(let k=0;k<26;k++){const a=rnd(0,2*PI),r=rnd(16,28);
 g.fillRect(Math.round(x+r*Math.cos(a)),Math.round(y+r*Math.sin(a)*.8),1.6,1.6)}});                       // powder specks, new each frame
// a little blush on the cheek being dabbed
layer(PINK,g=>{g.beginPath();g.ellipse(126,170,8,4,0,0,2*PI);g.clip();
 for(let y=0;y<342;y+=2)for(let x=(y&2);x<512;x+=3)g.fillRect(x,y,1,1)});

// sparkles
const SP=[[[40,90],[160,70]],[[44,84],[164,76]],[[36,96],[156,66]]];
layer(YELLOW,(g,f)=>{for(const[x,y]of SP[f]){g.beginPath();g.arc(x,y,2.4,0,2*PI);g.fill()}});
layer(INK,(g,f)=>{g.lineWidth=1.2;for(const[x,y]of SP[f])for(const a of[0,PI/2]){g.beginPath();g.moveTo(x-6*Math.cos(a),y-6*Math.sin(a));g.lineTo(x+6*Math.cos(a),y+6*Math.sin(a));g.stroke()}});

// flat poster lettering (no two-tone): pink big word, purple small line
lyric(TEXT,{style:'poster',colors:{small:PURPLE,top:PINK,bottom:PINK,shadow:PURPLE,tail:RED,box:[204,356]}});
show();
}
