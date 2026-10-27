// Plain-art scene for WigglyPaint: a cat holding a steaming mug, no lyric, using the whole canvas.
// Needs lyric-lib.js loaded first (the studio page bundles both). With no lyric call it draws without any text.

{
const{layer,backdrop,clear,bez,trace,show,C:{INK,PAPER,ORANGE,TAN,PINK,RED,YELLOW,LGRAY,BROWN},PI,rnd}=lyricKit();
clear();

backdrop({color:YELLOW,calm:[182,160]});          // canvas centre is (182,152)

// --- geometry (deck pixels) ---
const HEAD=[182,112],BODY=[182,206];
const earL=g=>{g.moveTo(140,92);g.lineTo(146,48);g.lineTo(172,78)},earR=g=>{g.moveTo(224,92);g.lineTo(218,48);g.lineTo(192,78)};
const head=g=>{g.beginPath();g.ellipse(...HEAD,48,40,0,0,2*PI)};
const body=g=>{g.beginPath();g.ellipse(...BODY,58,62,0,0,2*PI)};
const tail=bez([210,252],[296,262],[302,186],[278,152]);
const MUG=[160,210,44,36];                         // x, y, w, h

// 0) knock the dots out behind the cat
layer(PAPER,g=>{body(g);g.fill();head(g);g.fill();g.beginPath();earL(g);earR(g);g.fill()});

// 1) tail first so the body hides its root; its tip swishes a little per frame
const swish=(g,f)=>{g.beginPath();trace(g,t=>{const[x,y]=tail(t);return[x+f*3*t,y]});g.stroke()};
layer(INK,(g,f)=>{g.lineWidth=17;swish(g,f)});
layer(ORANGE,(g,f)=>{g.lineWidth=12;swish(g,f)});

// 2) fur: orange body and head, tan belly and muzzle
layer(ORANGE,g=>{body(g);g.fill();head(g);g.fill();g.beginPath();earL(g);earR(g);g.fill()});
layer(TAN,g=>{g.beginPath();g.ellipse(182,222,34,40,0,0,2*PI);g.fill();
 g.beginPath();g.ellipse(182,128,22,15,0,0,2*PI);g.fill()});
layer(PINK,g=>{g.beginPath();g.moveTo(148,82);g.lineTo(150,60);g.lineTo(164,78);g.fill();
 g.beginPath();g.moveTo(216,82);g.lineTo(214,60);g.lineTo(200,78);g.fill();
 g.beginPath();g.ellipse(160,126,7,4,0,0,2*PI);g.ellipse(204,126,7,4,0,0,2*PI);g.fill()});   // ears + cheeks

// 3) stripes, then the outlines on top
layer(BROWN,g=>{g.lineWidth=3;for(const x of[168,182,196]){g.beginPath();g.moveTo(x,74);g.lineTo(x+(182-x)*.2,90);g.stroke()}
 for(const y of[176,196,216]){g.beginPath();g.moveTo(126,y);g.quadraticCurveTo(136,y+4,140,y+12);g.stroke();
  g.beginPath();g.moveTo(238,y);g.quadraticCurveTo(228,y+4,224,y+12);g.stroke()}});
layer(INK,g=>{g.lineWidth=2.8;body(g);g.stroke();head(g);g.stroke();g.beginPath();earL(g);earR(g);g.stroke()});

// 4) face: closed happy eyes, nose, mouth, whiskers that twitch per frame
layer(INK,(g,f)=>{g.lineWidth=2.4;
 for(const x of[164,200]){g.beginPath();g.arc(x,110,7,PI*1.1,PI*1.9);g.stroke()}
 g.beginPath();g.moveTo(182,122);g.quadraticCurveTo(182,130,174,132);g.moveTo(182,122);g.quadraticCurveTo(182,130,190,132);g.stroke();
 g.lineWidth=1.4;for(const s of[-1,1])for(const dy of[-3,3]){g.beginPath();g.moveTo(182+s*24,124+dy);
  g.lineTo(182+s*(52+rnd(0,3)),121+dy*2+f-1);g.stroke()}});
layer(RED,g=>{g.beginPath();g.moveTo(177,118);g.lineTo(187,118);g.lineTo(182,124);g.fill()});

// 5) the mug, held in both paws
const mug=g=>{g.beginPath();g.roundRect(MUG[0],MUG[1],MUG[2],MUG[3],5)};
layer(RED,g=>{mug(g);g.fill()});
layer(PAPER,g=>{g.beginPath();g.arc(MUG[0]+22,MUG[1]+20,8,0,2*PI);g.fill()});                  // heart badge, white disc
layer(PINK,g=>{const[x,y]=[MUG[0]+22,MUG[1]+22];g.beginPath();g.moveTo(x,y+5);
 g.bezierCurveTo(x-9,y-2,x-4,y-9,x,y-4);g.bezierCurveTo(x+4,y-9,x+9,y-2,x,y+5);g.fill()});
layer(BROWN,g=>{g.beginPath();g.ellipse(MUG[0]+22,MUG[1]+3,19,4,0,0,2*PI);g.fill()});          // coffee
layer(INK,g=>{g.lineWidth=2.6;mug(g);g.stroke();
 g.beginPath();g.arc(MUG[0]+MUG[2]+2,MUG[1]+18,10,-PI/2,PI/2);g.stroke()});                    // handle
layer(ORANGE,g=>{for(const x of[MUG[0]-6,MUG[0]+MUG[2]-6]){g.beginPath();g.ellipse(x+6,MUG[1]+24,10,8,0,0,2*PI);g.fill()}});
layer(INK,g=>{g.lineWidth=2.2;for(const x of[MUG[0]-6,MUG[0]+MUG[2]-6]){g.beginPath();g.ellipse(x+6,MUG[1]+24,10,8,0,0,2*PI);g.stroke()}});

// 6) steam: three wisps that rise one step each frame, kept below the chin
layer(LGRAY,(g,f)=>{g.lineWidth=3;for(const[i,x]of[[0,170],[1,182],[2,194]]){const y=MUG[1]-6-((f+i)%3)*4;
 g.beginPath();g.moveTo(x,y);g.bezierCurveTo(x-7,y-7,x+7,y-13,x,y-20);g.stroke()}});

show();
}
