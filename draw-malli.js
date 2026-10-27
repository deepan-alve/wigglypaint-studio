// Lyric screen for WigglyPaint: an original girl seen from behind, big curly hair with round jasmine buds (gundu
// malli) pinned across it and two long strings hanging down, swaying, with loose buds drifting down. Green silk
// blouse with a gold zari border. Lettering in the scene's own 'jasmine' style.
// Needs lyric-lib.js loaded first (the studio page bundles both).

const TEXT=window.WP_TEXT||{small:'',big:''};   // the studio panel's lyric boxes set WP_TEXT
{
const{layer,backdrop,clear,lyric,show,C:{INK,PAPER,YELLOW,PINK,RED,GREEN,DKGREEN,GRAY},PI}=lyricKit();
clear();
backdrop({color:GREEN,calm:[104,150]});

// --- back view: shoulders in a green silk blouse, a big cloud of curly hair, jasmine pinned across the back of the
// head with two long strings of gundu malli hanging down through the curls (they sway per frame) ---
const SWAY=[0,2,-2];
const shoulders=g=>{g.beginPath();g.moveTo(14,270);g.bezierCurveTo(18,226,48,206,104,204);g.bezierCurveTo(160,206,190,226,194,270);g.closePath()};
const BUMPS=[...Array(30)].map((_,k)=>5+3.5*Math.abs(Math.sin(k*2.3)));
const hair=g=>{g.beginPath();const n=30;for(let k=0;k<=n*6;k++){const t=k/(n*6),a=-PI/2+t*2*PI;
  const bump=BUMPS[Math.floor(t*n)%n]*Math.abs(Math.sin(t*n*PI));let x=104+(70+bump)*Math.cos(a),y=140+(98+bump)*Math.sin(a);
  if(y>250)y=250+(y-250)*.3;k?g.lineTo(x,y):g.moveTo(x,y)}g.closePath()};
layer(PAPER,g=>{g.lineWidth=8;g.lineJoin='round';shoulders(g);g.stroke();g.fill();hair(g);g.stroke();g.fill()});
// blouse: green silk, a wide gold zari border along the back neckline, small gold butta motifs, a sheen line
layer(DKGREEN,g=>{shoulders(g);g.fill()});
layer(GREEN,g=>{shoulders(g);g.clip();g.lineWidth=3;g.lineCap='round';for(const s of[-1,1]){g.beginPath();g.moveTo(104+s*70,250);g.quadraticCurveTo(104+s*60,234,104+s*40,228);g.stroke()}});
layer(YELLOW,g=>{shoulders(g);g.clip();g.lineWidth=9;g.beginPath();g.moveTo(24,240);g.quadraticCurveTo(104,200,184,240);g.stroke();
 for(const[x,y]of[[40,258],[64,250],[144,250],[168,258],[30,266],[178,266]]){g.beginPath();g.moveTo(x,y-3);g.lineTo(x+2.4,y);g.lineTo(x,y+3);g.lineTo(x-2.4,y);g.closePath();g.fill()}});
layer(INK,g=>{shoulders(g);g.save();g.clip();g.lineWidth=1;for(const o of[-4.5,4.5]){g.beginPath();g.moveTo(24,240+o);g.quadraticCurveTo(104,200+o,184,240+o);g.stroke()}
 for(let t=.05;t<.97;t+=.06){const x=24+160*t,y=240-80*t*(1-t)*.0+(-40*4*t*(1-t))*.5;g.beginPath();g.moveTo(x-2.4,y+2);g.lineTo(x,y-2);g.lineTo(x+2.4,y+2);g.closePath();g.fill()}   // temple triangles on the zari
 g.restore();g.lineWidth=2;shoulders(g);g.stroke()});
layer(INK,g=>{hair(g);g.fill()});
const swirl=(g,x,y,r)=>{g.beginPath();for(let i=0;i<=40;i++){const t=i/40,a=t*3.2*PI,rr=r*t;i?g.lineTo(x+rr*Math.cos(a),y+rr*Math.sin(a)):g.moveTo(x,y)}g.stroke()};
const SW=[[60,70],[148,70],[44,110],[164,110],[40,160],[168,160],[52,206],[156,206],[80,236],[128,236],[104,190],[76,140],[132,140]];
layer(GRAY,g=>{hair(g);g.clip();g.lineWidth=1.3;g.lineCap='round';for(const[x,y]of SW)swirl(g,x,y,7)});
layer(PAPER,g=>{g.lineWidth=2;g.lineCap='round';for(const[x,y]of[[80,56],[100,50],[122,54]]){g.beginPath();g.arc(x,y,6,PI*1.1,PI*1.7);g.stroke()}});

const bud=(g,x,y,r)=>{g.beginPath();g.arc(x,y,r,0,2*PI)};
const budsAt=f=>{const pts=[];
 for(let k=0;k<=10;k++){const t=k/10;pts.push([60+t*88,96-Math.sin(t*PI)*18,6])}                    // the crown arc pinned across the back
 for(const x0 of[90,118])for(let k=1;k<=11;k++){const t=k/11;pts.push([x0+Math.sin(t*PI*1.5)*4+SWAY[f]*t,96+t*150,5.5])}   // two hanging strings
 return pts};
layer(PAPER,(g,f)=>{for(const[x,y,r]of budsAt(f)){bud(g,x,y,r);g.fill()}});
layer(INK,(g,f)=>{g.lineWidth=1.1;for(const[x,y,r]of budsAt(f)){bud(g,x,y,r);g.stroke();g.beginPath();g.moveTo(x-2,y-1);g.quadraticCurveTo(x,y+2,x+2,y-1);g.stroke()}});
layer(GREEN,(g,f)=>{for(const[i,[x,y]]of budsAt(f).entries()){if(i%2)continue;g.beginPath();g.ellipse(x+4,y+4,1.6,2.8,.6,0,2*PI);g.fill()}});
layer(YELLOW,g=>{g.beginPath();g.ellipse(104,96,7,4,0,0,2*PI);g.fill()});                              // a little gold hair clip at the centre
layer(INK,g=>{g.lineWidth=1.2;g.beginPath();g.ellipse(104,96,7,4,0,0,2*PI);g.stroke()});

// loose jasmine buds drifting down (screen space; they fall a little more each frame)
const FALL=[[12,150],[196,180],[30,236],[180,250],[200,110]],DROP=[0,4,8];
layer(PAPER,(g,f)=>{for(const[x,y]of FALL){bud(g,x,y+DROP[f],5);g.fill()}});
layer(INK,(g,f)=>{g.lineWidth=1.1;for(const[x,y]of FALL){const yy=y+DROP[f];bud(g,x,yy,5);g.stroke();g.beginPath();g.moveTo(x,yy-5);g.lineTo(x+(f-1),yy-9);g.stroke()}});
layer(GREEN,(g,f)=>{for(const[x,y]of FALL){g.beginPath();g.ellipse(x+(f-1),y+DROP[f]-8,1.6,2.6,0,0,2*PI);g.fill()}});

// the scene's own lettering: white petal letters with a green outline, a jasmine string under the word
lyric(TEXT,{style:'jasmine',colors:{small:DKGREEN,word:PAPER,line:DKGREEN,shadow:GREEN,tail:DKGREEN,box:[214,356]}});
show();
}
