// Lyric screen for WigglyPaint: a traditional South Indian pavadai-davani, shoulders to floor, matched to a
// reference outfit. Green blouse with elbow sleeves and wide gold cuffs; a purple davani pleated at the shoulder,
// covering the chest and waist, its wide gold border running down the front to the thigh and the pallu falling on
// the other side; a floor-length green pavadai with a deep two-row zari hem; hands clasped at the waist.
// Needs lyric-lib.js loaded first (the studio page bundles both).

const TEXT=window.WP_TEXT||{small:'',big:''};   // the studio panel's lyric boxes set WP_TEXT
{
const{layer,backdrop,clear,lyric,show,C:{INK,PAPER,YELLOW,PURPLE,ORANGE,DKGREEN,GREEN,RED},PI}=lyricKit();
clear();
backdrop({color:ORANGE,calm:[108,150]});
const FL=[[0,0],[2,1],[-2,-1]];                                  // flutter offset per frame (hem + pallu)

// --- shapes (deck pixels), figure centred on x=110 ---
const blouse=g=>{g.beginPath();g.moveTo(66,24);g.lineTo(154,24);g.bezierCurveTo(150,50,146,76,142,100);g.lineTo(78,100);
 g.bezierCurveTo(74,76,70,50,66,24);g.closePath()};
const sleeve=(g,s)=>{const x=110+s*44;g.beginPath();g.moveTo(x,24);g.lineTo(x+s*14,26);g.lineTo(x+s*18,80);g.lineTo(x+s*2,82);g.closePath()};
const skirt=(g,f)=>{const[d]=FL[f];g.beginPath();g.moveTo(78,98);g.lineTo(142,98);
 g.bezierCurveTo(158,150,176,214,190+d,272);g.quadraticCurveTo(110,282,30+d,272);g.bezierCurveTo(44,214,62,150,78,98);g.closePath()};
const hemBand=(g,f,y0)=>{const[d]=FL[f];g.beginPath();g.moveTo(30+d,272);g.quadraticCurveTo(110,282,190+d,272);
 g.lineTo(182+d*.9,y0);g.quadraticCurveTo(110,y0+9,38+d*.9,y0);g.closePath()};
// davani: from the neckline over the viewer-right shoulder, covering the chest and waist. Its gold border runs down
// the front edge to the left thigh; the pallu falls down the right side.
const BORDER=[[112,24],[102,72],[86,128],[72,178]];
const drape=(g,f)=>{const[d,e]=FL[f];g.beginPath();g.moveTo(112,24);g.lineTo(160,24);
 g.bezierCurveTo(170,70,176,120,178+d,166+e);g.lineTo(158+d,170+e);                              // pallu falling at the side
 g.bezierCurveTo(154,150,150,136,148,126);g.bezierCurveTo(124,140,98,160,74,180);               // lower edge, rising to the hip
 g.bezierCurveTo(86,128,102,72,112,24);g.closePath()};
const ARMS=[[[62,80],[100,106]],[[158,80],[120,106]]];
const arms=(g,grow)=>{g.lineCap='round';for(const[a,b]of ARMS){g.lineWidth=2*(5.5+grow);g.beginPath();g.moveTo(...a);g.lineTo(...b);g.stroke()}
 g.beginPath();g.ellipse(110,106,13+grow,7.5+grow,0,0,2*PI);g.fill()};
const bez=(pts,t)=>{const[a,b,c,d]=pts,u=1-t;return[u*u*u*a[0]+3*u*u*t*b[0]+3*u*t*t*c[0]+t*t*t*d[0],u*u*u*a[1]+3*u*u*t*b[1]+3*u*t*t*c[1]+t*t*t*d[1]]};

// little woven motifs: a temple triangle, and a tiny elephant (body, head, trunk, legs) for the hem
const tri=(g,x,y,s,flip=1)=>{g.beginPath();g.moveTo(x-s,y);g.lineTo(x,y-s*1.3*flip);g.lineTo(x+s,y);g.closePath();g.fill()};
const elephant=(g,x,y,dir=1)=>{g.beginPath();g.ellipse(x,y,5,3.2,0,0,2*PI);g.fill();g.beginPath();g.arc(x+dir*5,y-1.5,2.4,0,2*PI);g.fill();
 g.lineWidth=1.2;g.beginPath();g.moveTo(x+dir*7,y-1);g.quadraticCurveTo(x+dir*9,y+2,x+dir*8,y+5);g.stroke();
 for(const lx of[-3,-1,2,4]){g.fillRect(x+lx,y+2,1.4,3)}};

// halo
layer(PAPER,(g,f)=>{g.lineWidth=8;g.lineJoin='round';skirt(g,f);g.stroke();g.fill();blouse(g);g.stroke();g.fill();
 for(const s of[-1,1]){sleeve(g,s);g.stroke();g.fill()}drape(g,f);g.stroke();g.fill();arms(g,4)});

// pavadai: deep green with lighter sheen on the folds
layer(DKGREEN,(g,f)=>{skirt(g,f);g.fill()});
layer(GREEN,(g,f)=>{skirt(g,f);g.clip();g.lineWidth=2;for(const[x0,x1]of[[96,76],[114,120],[130,158]]){g.beginPath();g.moveTo(x0,170);
 g.quadraticCurveTo((x0+x1)/2,210,x1+FL[f][0]*.6,236);g.stroke()}});
// deep zari hem: top row of elephants on a purple ground, bottom row of vertical stripes, thin purple edge
layer(YELLOW,(g,f)=>{hemBand(g,f,232);g.fill()});
layer(PURPLE,(g,f)=>{const[d]=FL[f];g.save();hemBand(g,f,232);g.clip();g.lineWidth=1;g.beginPath();g.moveTo(34+d,250);g.quadraticCurveTo(110,258,186+d,250);g.stroke();g.restore()});
layer(INK,(g,f)=>{const[d]=FL[f];g.save();hemBand(g,f,232);g.clip();
 for(let k=0;k<11;k++){const x=46+k*13.4+d*.9,y=242+5*Math.sin(PI*(k/10))*.6;elephant(g,x,y,k%2?-1:1)}
 g.lineWidth=1.2;for(let x=36;x<186;x+=5){g.beginPath();g.moveTo(x+d*.9,256);g.lineTo(x+d*.9,268);g.stroke()}g.restore()});
layer(PURPLE,(g,f)=>{const[d]=FL[f];g.lineWidth=2.4;g.beginPath();g.moveTo(30+d,272);g.quadraticCurveTo(110,282,190+d,272);g.stroke()});
layer(INK,(g,f)=>{g.lineJoin='round';g.lineWidth=2;skirt(g,f);g.stroke();g.lineWidth=1.2;hemBand(g,f,232);g.stroke();
 g.lineWidth=1.1;for(const[x0,x1]of[[90,62],[110,108],[128,148],[142,174]]){g.beginPath();g.moveTo(x0,170);g.quadraticCurveTo((x0+x1)/2,206,x1+FL[f][0]*.6,232);g.stroke()}});

// blouse: green, elbow sleeves with wide gold cuffs (temple pattern), V neck with a gold necklace
layer(DKGREEN,g=>{blouse(g);g.fill();for(const s of[-1,1]){sleeve(g,s);g.fill()}});
layer(YELLOW,g=>{for(const s of[-1,1]){const x=110+s*44;g.save();sleeve(g,s);g.clip();g.fillRect(Math.min(x,x+s*22)-2,52,26,32);g.restore()}});
layer(INK,g=>{for(const s of[-1,1]){const x=110+s*44;g.save();sleeve(g,s);g.clip();
 for(let k=0;k<5;k++){tri(g,x+s*(2+k*3.6),60,1.6);tri(g,x+s*(2+k*3.6),74,1.6,-1)}
 g.lineWidth=1;g.beginPath();g.moveTo(x-30,66);g.lineTo(x+30,67);g.stroke();g.restore()}});
layer(PAPER,g=>{g.beginPath();g.moveTo(98,22);g.lineTo(110,42);g.lineTo(122,22);g.closePath();g.fill()});
layer(YELLOW,g=>{g.lineWidth=2;g.beginPath();g.moveTo(100,24);g.quadraticCurveTo(110,38,120,24);g.stroke();g.beginPath();g.arc(110,36,2.6,0,2*PI);g.fill()});
layer(INK,g=>{g.lineJoin='round';g.lineWidth=2;blouse(g);g.stroke();for(const s of[-1,1]){sleeve(g,s);g.stroke()}
 g.beginPath();g.moveTo(98,22);g.lineTo(110,42);g.lineTo(122,22);g.stroke()});

// the davani: purple, pleated folds fanning from the shoulder, wide gold border down the front edge
layer(PURPLE,(g,f)=>{drape(g,f);g.fill()});
layer(YELLOW,(g,f)=>{drape(g,f);g.clip();g.lineWidth=16;g.beginPath();g.moveTo(...BORDER[0]);g.bezierCurveTo(...BORDER[1],...BORDER[2],...BORDER[3]);g.stroke()});
layer(INK,(g,f)=>{drape(g,f);g.clip();for(let k=0;k<16;k++){const t=(k+.5)/16,[x,y]=bez(BORDER,t);elephant(g,x+5,y,1)}
 g.lineWidth=1;g.beginPath();for(let k=0;k<=30;k++){const[x,y]=bez(BORDER,k/30);k?g.lineTo(x+11,y):g.moveTo(x+11,y)}g.stroke()});   // inner border line
layer(INK,(g,f)=>{g.lineJoin='round';g.lineWidth=2;drape(g,f);g.stroke();g.lineWidth=1.1;
 for(const[sx,ex,ey]of[[126,96,150],[136,116,140],[146,138,132],[154,162,160]]){g.beginPath();g.moveTo(sx,24);g.quadraticCurveTo((sx+ex)/2+8,70,ex+FL[f][0]*.4,ey);g.stroke()}});   // pleated folds from the shoulder

// hands clasped at the waist, orange-gold bangles
layer(INK,g=>arms(g,1.6));
layer(PAPER,g=>arms(g,0));
layer(INK,g=>{g.lineWidth=1;for(let k=-2;k<=2;k++){g.beginPath();g.moveTo(104+k*3,100);g.lineTo(106+k*3,112);g.stroke()}});
layer(ORANGE,g=>{g.lineWidth=2.4;for(const[a,b]of ARMS)for(const t of[.66,.72,.78]){const x=a[0]+(b[0]-a[0])*t,y=a[1]+(b[1]-a[1])*t;
 g.beginPath();g.ellipse(x,y,1.8,7,Math.atan2(b[1]-a[1],b[0]-a[0]),0,2*PI);g.stroke()}});
layer(INK,g=>{g.lineWidth=.8;for(const[a,b]of ARMS)for(const t of[.62,.82]){const x=a[0]+(b[0]-a[0])*t,y=a[1]+(b[1]-a[1])*t;
 g.beginPath();g.ellipse(x,y,2.2,7.4,Math.atan2(b[1]-a[1],b[0]-a[0]),0,2*PI);g.stroke()}});

// sparkles
const SP=[[[30,60],[196,120],[30,170]],[[34,54],[200,114],[26,176]],[[26,66],[192,126],[34,164]]];
layer(YELLOW,(g,f)=>{for(const[x,y]of SP[f]){g.beginPath();g.arc(x,y,2.4,0,2*PI);g.fill()}});
layer(INK,(g,f)=>{g.lineWidth=1.2;for(const[x,y]of SP[f])for(const a of[0,PI/2]){g.beginPath();g.moveTo(x-6*Math.cos(a),y-6*Math.sin(a));g.lineTo(x+6*Math.cos(a),y+6*Math.sin(a));g.stroke()}});

// same lettering as the first scene: arc small line, outlined big word with a pink shadow over a yellow swash
lyric(TEXT);
show();
}
