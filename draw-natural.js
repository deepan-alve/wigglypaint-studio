// Lyric screen for WigglyPaint: "even without all that" — an original girl, natural and simple (no makeup, no
// jewellery), happy closed eyes and a soft smile, while the lipstick, bangle, jhumka, kajal pencil and compact from
// the earlier scenes drift away from her, and hearts pulse around.
// Needs lyric-lib.js loaded first (the studio page bundles both).

const TEXT=window.WP_TEXT||{small:'',big:''};   // the studio panel's lyric boxes set WP_TEXT
{
const{layer,backdrop,clear,lyric,show,C:{INK,PAPER,YELLOW,PINK,PURPLE,RED,ORANGE,CYAN,LGRAY,GRAY},PI}=lyricKit();
clear();
backdrop({color:PINK,calm:[100,150]});

// --- the girl (curly hair) ---
const face=g=>{g.beginPath();g.moveTo(62,124);g.bezierCurveTo(62,162,82,194,100,206);g.bezierCurveTo(118,194,138,162,138,124);
 g.bezierCurveTo(138,98,122,86,100,86);g.bezierCurveTo(78,86,62,98,62,124);g.closePath()};
// big curly hair: a cloud with a bumpy outline (bump size varies so it isn't too regular)
const BUMPS=[...Array(34)].map((_,k)=>4+3*Math.abs(Math.sin(k*2.3)));
const hairBack=g=>{g.beginPath();const n=34;for(let k=0;k<=n*6;k++){const t=k/(n*6),a=-PI/2+t*2*PI;
  const bump=BUMPS[Math.floor(t*n)%n]*Math.abs(Math.sin(t*n*PI));
  let x=100+(72+bump)*Math.cos(a),y=152+(96+bump)*Math.sin(a);if(y>262)y=262;
  k?g.lineTo(x,y):g.moveTo(x,y)}g.closePath()};
// curly fringe: a cap over the crown ending in a row of round curls across the forehead
const CURLS_F=[[64,118,9],[78,110,9],[92,106,9],[106,105,9],[120,108,9],[133,114,9],[142,124,8]];
const fringe=g=>{g.beginPath();g.moveTo(56,132);g.bezierCurveTo(56,90,78,72,100,72);g.bezierCurveTo(122,72,146,90,146,132);g.closePath();g.fill();
 for(const[x,y,r]of CURLS_F){g.beginPath();g.arc(x,y,r,0,2*PI);g.fill()}};
const top=g=>{g.beginPath();g.moveTo(40,262);g.bezierCurveTo(44,236,64,226,88,222);g.quadraticCurveTo(100,232,112,222);
 g.bezierCurveTo(136,226,156,236,160,262);g.closePath()};
const neck=g=>{g.beginPath();g.moveTo(90,196);g.lineTo(89,224);g.quadraticCurveTo(100,232,111,224);g.lineTo(110,196);g.closePath()};

layer(PAPER,g=>{hairBack(g);g.lineWidth=8;g.stroke();g.fill()});
layer(INK,g=>{hairBack(g);g.fill()});
const SWIRLS=[[40,120],[32,170],[44,212],[36,246],[160,120],[168,170],[156,212],[164,246],[70,84],[130,84],[100,72],[52,150],[148,150],[62,240],[138,240]];
const swirl=(g,x,y,r)=>{g.beginPath();for(let i=0;i<=40;i++){const t=i/40,a=t*3.2*PI,rr=r*t;i?g.lineTo(x+rr*Math.cos(a),y+rr*Math.sin(a)):g.moveTo(x,y)}g.stroke()};
layer(GRAY,g=>{hairBack(g);g.clip();g.lineWidth=1.3;g.lineCap='round';for(const[x,y]of SWIRLS)swirl(g,x,y,7)});
layer(CYAN,g=>{top(g);g.fill()});
layer(INK,g=>{g.lineWidth=2;top(g);g.stroke()});
layer(PAPER,g=>{neck(g);g.fill();face(g);g.fill()});
layer(INK,g=>{g.lineWidth=2;g.lineJoin='round';neck(g);g.stroke();g.lineWidth=2.4;face(g);g.stroke()});
layer(INK,g=>fringe(g));
// springy ringlets framing the face
const coil=(g,x0,y0,len,r,turns,s)=>{g.beginPath();for(let i=0;i<=turns*24;i++){const t=i/(turns*24),a=t*turns*2*PI;
 const x=x0+s*r*Math.cos(a)+s*2*Math.sin(t*PI),y=y0+t*len+r*.55*Math.sin(a);i?g.lineTo(x,y):g.moveTo(x,y)}g.stroke()};
layer(INK,g=>{g.lineCap='round';g.lineWidth=4.2;for(const s of[-1,1]){coil(g,100+s*44,114,96,5,5.5,s);coil(g,100+s*36,150,70,4,4,s)}});
layer(PAPER,g=>{g.lineWidth=2;g.lineCap='round';for(const[x,y]of[[80,82],[94,78],[116,80]]){g.beginPath();g.arc(x,y,5,PI*1.1,PI*1.7);g.stroke()}});   // shine on the curls

// happy closed eyes (^ ^) with lashes, soft brows, a gentle smile, natural blush
layer(INK,g=>{g.lineCap='round';
 for(const[x,s]of[[82,-1],[118,1]]){g.lineWidth=2.6;g.beginPath();g.moveTo(x-9,152);g.quadraticCurveTo(x,142,x+9,152);g.stroke();
  g.lineWidth=1.4;for(const k of[-1,0,1]){const lx=x+k*6;g.beginPath();g.moveTo(lx,148+Math.abs(k));g.lineTo(lx+s*1.5+k*1.5,144+Math.abs(k)*.5);g.stroke()}
  g.lineWidth=1.6;g.beginPath();g.moveTo(x-8,132);g.quadraticCurveTo(x,128,x+8,132);g.stroke()}
 g.lineWidth=1.3;g.beginPath();g.moveTo(101,166);g.lineTo(99,170);g.stroke();
 g.lineWidth=1.8;g.beginPath();g.moveTo(90,180);g.quadraticCurveTo(100,188,110,180);g.stroke()});
layer(PINK,g=>{for(const cx of[76,124]){g.save();g.beginPath();g.ellipse(cx,166,9,5,0,0,2*PI);g.clip();
 for(let y=0;y<342;y+=2)for(let x=(y&2);x<512;x+=3)g.fillRect(x,y,1,1);g.restore()}});

// --- the things she doesn't need, drifting away (each frame they float a little further out) ---
const DRIFT=[0,3,6];
const items=[
 {at:[30,60],dir:[-1,-1],draw:(g,col)=>{if(col===RED){g.fillRect(-3,-12,6,9)}if(col===YELLOW){g.fillRect(-4,-3,8,6)}if(col===PURPLE){g.fillRect(-4,3,8,9)}
   if(col===INK){g.lineWidth=1.1;g.strokeRect(-4,-3,8,15);g.beginPath();g.moveTo(-3,-3);g.lineTo(-3,-12);g.lineTo(3,-9);g.lineTo(3,-3);g.stroke()}}},   // lipstick
 {at:[162,52],dir:[1,-1],draw:(g,col)=>{if(col===YELLOW||col===INK){g.lineWidth=col===INK?4.4:2.6;g.beginPath();g.ellipse(0,0,8,8,0,0,2*PI);g.stroke()}}},   // bangle
 {at:[24,176],dir:[-1,.3],draw:(g,col)=>{if(col===YELLOW){g.beginPath();g.moveTo(-7,4);g.bezierCurveTo(-7,-8,7,-8,7,4);g.closePath();g.fill()}
   if(col===INK){g.lineWidth=1.1;g.beginPath();g.moveTo(-7,4);g.bezierCurveTo(-7,-8,7,-8,7,4);g.closePath();g.stroke();g.beginPath();g.moveTo(0,-6);g.lineTo(0,-11);g.stroke();
    for(const x of[-5,-2,1,4]){g.beginPath();g.arc(x+1,7,1.2,0,2*PI);g.stroke()}}}},                                                    // jhumka
 {at:[170,150],dir:[1,0],draw:(g,col)=>{if(col===INK){g.lineWidth=4;g.lineCap='round';g.beginPath();g.moveTo(-10,6);g.lineTo(8,-6);g.stroke()}
   if(col===YELLOW){g.lineWidth=4;g.beginPath();g.moveTo(5,-4);g.lineTo(8,-6);g.stroke()}}},                                            // kajal pencil
 {at:[168,214],dir:[1,.6],draw:(g,col)=>{if(col===LGRAY){g.beginPath();g.ellipse(0,0,9,5,0,0,2*PI);g.fill()}if(col===PINK){g.beginPath();g.ellipse(0,-1,6,3,0,0,2*PI);g.fill()}
   if(col===INK){g.lineWidth=1.1;g.beginPath();g.ellipse(0,0,9,5,0,0,2*PI);g.stroke()}}},                                                // compact
];
const place=(g,it,f)=>{g.translate(it.at[0]+it.dir[0]*DRIFT[f],it.at[1]+it.dir[1]*DRIFT[f]);g.rotate(.2*it.dir[0]*(f-1))};
layer(INK,(g,f)=>{g.lineWidth=1;g.setLineDash([2,3]);for(const it of items){g.beginPath();g.moveTo(it.at[0]-it.dir[0]*16,it.at[1]-it.dir[1]*16);
 g.lineTo(it.at[0]-it.dir[0]*4+it.dir[0]*DRIFT[f],it.at[1]-it.dir[1]*4+it.dir[1]*DRIFT[f]);g.stroke()}g.setLineDash([])});      // drift trails
layer(PAPER,(g,f)=>{for(const it of items){g.save();place(g,it,f);g.beginPath();g.arc(0,0,13,0,2*PI);g.fill();g.restore()}});
for(const col of[LGRAY,PINK,RED,YELLOW,PURPLE,INK])layer(col,(g,f)=>{for(const it of items){g.save();place(g,it,f);it.draw(g,col);g.restore()}});

// pulsing hearts
const heart=(g,x,y,s)=>{g.beginPath();g.moveTo(x,y+s*.9);g.bezierCurveTo(x-s*1.4,y-s*.1,x-s*.6,y-s*1.2,x,y-s*.35);
 g.bezierCurveTo(x+s*.6,y-s*1.2,x+s*1.4,y-s*.1,x,y+s*.9);g.closePath()};
const HEARTS=[[52,100,6,RED],[150,96,7,PINK],[60,224,5,PINK],[146,184,5,RED],[100,40,6,PINK]],PULSE=[1,1.25,.9];
for(const col of[PINK,RED])layer(col,(g,f)=>{for(const[x,y,s,c]of HEARTS)if(c===col){heart(g,x,y,s*PULSE[f]);g.fill()}});
layer(INK,(g,f)=>{g.lineWidth=1.1;for(const[x,y,s]of HEARTS){heart(g,x,y,s*PULSE[f]);g.stroke()}});

lyric(TEXT,{style:'heart',colors:{small:INK,heart:RED,rim:PINK,word:PAPER,tail:PINK,box:[200,356]}});   // the big word inside a pulsing heart
show();
}
