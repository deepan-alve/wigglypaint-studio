// Lyric screen for WigglyPaint: a slender foot in profile wearing a silver kolusu (anklet) whose little
// bells swing and jingle, with an evil-eye charm hanging from it and a red alta border on the sole.
// Needs lyric-lib.js loaded first (the studio page bundles both).

const TEXT=window.WP_TEXT||{small:'',big:''};   // the studio panel's lyric boxes set WP_TEXT
{
const{layer,backdrop,clear,lyric,show,C:{INK,PAPER,YELLOW,PINK,PURPLE,RED,ORANGE,BLUE,CYAN,DKGREEN,LGRAY},PI}=lyricKit();
clear();
backdrop({color:ORANGE,calm:[110,160]});

// --- the foot, side view, raised on tiptoe like a dance step: slim lower leg, high arch, pointed toes left ---
const foot=g=>{g.moveTo(152,24);                                 // back of the leg
 g.bezierCurveTo(156,80,151,140,157,170);                        // slim calf down to the heel
 g.bezierCurveTo(167,184,167,204,152,210);                       // raised heel
 g.bezierCurveTo(130,220,104,236,84,242);                        // high arch under the foot
 g.bezierCurveTo(70,246,54,250,46,246);                          // ball + under the toes
 g.bezierCurveTo(40,243,44,236,54,234);                          // tip of the big toe
 g.bezierCurveTo(80,226,116,200,130,178);                        // top of the foot rising to the ankle
 g.bezierCurveTo(133,140,129,80,127,24);                         // front of the shin
 g.closePath()};
layer(PAPER,g=>{g.lineJoin='round';g.beginPath();foot(g);g.fill();g.lineWidth=9;g.stroke()});   // white halo

// anklet geometry: a ring round the ankle, tilted with the leg
const ANK=[143,176],ARX=15,ARY=4.2,ATILT=-.22;
const ankRing=(g,front)=>{g.beginPath();g.ellipse(...ANK,ARX,ARY,ATILT,front?0:PI,front?PI:2*PI);g.stroke()};
layer(INK,g=>{g.lineWidth=3.4;ankRing(g,false)});                // back half, behind the leg
layer(LGRAY,g=>{g.lineWidth=1.8;ankRing(g,false)});

layer(PAPER,g=>{g.beginPath();foot(g);g.fill()});                // skin (white line art)
layer(INK,g=>{g.lineJoin='round';g.lineWidth=3.2;g.beginPath();foot(g);g.stroke()});   // clean outline

// toes: soft separations near the tip, and a hint of the ankle bone
layer(INK,g=>{g.lineWidth=1.2;g.lineCap='round';
 for(const[x,y,l]of[[60,235,6],[67,233,6],[74,231,5]]){g.beginPath();g.moveTo(x,y);g.quadraticCurveTo(x+2,y+l*.5,x+1,y+l);g.stroke()}
 g.beginPath();g.arc(148,166,3.5,PI*.9,PI*1.9);g.stroke()});

// red alta along the sole and round the toe tip, with a few dots on the top of the foot
layer(RED,g=>{g.lineWidth=3;g.lineCap='round';g.beginPath();g.moveTo(151,208);
 g.bezierCurveTo(130,217,104,233,84,239);g.bezierCurveTo(70,243,55,247,48,243);g.stroke();
 for(const[x,y]of[[96,214],[103,209],[99,204]]){g.beginPath();g.arc(x,y,1.4,0,2*PI);g.fill()}});

// pink toenail
layer(PINK,g=>{g.beginPath();g.ellipse(49,238,3.8,2.3,-.3,0,2*PI);g.fill()});
layer(INK,g=>{g.lineWidth=.9;g.beginPath();g.ellipse(49,238,3.8,2.3,-.3,0,2*PI);g.stroke()});

// a flowing pavadai (long skirt) over the leg, so only the ankle and foot show; the hem sways per frame
const HEM=[[0,0],[2,1],[-2,-1]];
const skirt=(g,f)=>{const[d,e]=HEM[f];g.beginPath();g.moveTo(104,22);g.lineTo(178,22);
 g.bezierCurveTo(184,60,190,96,194+d,152+e);                                       // right side flaring out
 g.bezierCurveTo(176+d,160,160+d,150,142+d,158+e);g.bezierCurveTo(124+d,166,108+d,154,86+d,158+e);   // wavy hem
 g.bezierCurveTo(92,110,98,60,104,22);g.closePath()};
layer(PAPER,(g,f)=>{skirt(g,f);g.lineWidth=8;g.lineJoin='round';g.stroke();g.fill()});
layer(RED,(g,f)=>{skirt(g,f);g.fill()});
layer(YELLOW,(g,f)=>{skirt(g,f);g.clip();const[d,e]=HEM[f];g.lineWidth=12;g.beginPath();g.moveTo(86+d,152+e);
 g.bezierCurveTo(108+d,148,124+d,160,142+d,152+e);g.bezierCurveTo(160+d,144,176+d,154,196+d,146+e);g.stroke()});   // gold zari border
layer(PINK,(g,f)=>{skirt(g,f);g.clip();for(const[x,y]of[[118,44],[150,40],[132,70],[164,74],[112,96],[144,100],[176,98],[124,124],[160,126]]){
 g.beginPath();g.arc(x+HEM[f][0]*y/130,y,2.6,0,2*PI);g.fill()}});                                    // little butta motifs
layer(INK,(g,f)=>{g.lineJoin='round';g.lineWidth=2.4;skirt(g,f);g.stroke();g.lineWidth=1.1;
 for(const[x0,x1]of[[122,116],[140,138],[158,162]]){g.beginPath();g.moveTo(x0,30);g.quadraticCurveTo((x0+x1)/2,80,x1+HEM[f][0],146);g.stroke()}   // pleats
 g.save();skirt(g,f);g.clip();const[d,e]=HEM[f];g.lineWidth=1;g.setLineDash([2,2]);g.beginPath();g.moveTo(86+d,145+e);
 g.bezierCurveTo(108+d,141,124+d,153,142+d,145+e);g.bezierCurveTo(160+d,137,176+d,147,196+d,139+e);g.stroke();g.restore()});
// soft floor shadow under the toes and heel
layer(LGRAY,g=>{g.beginPath();g.ellipse(96,254,58,4,0,0,2*PI);g.fill()});

// front half of the anklet, then its bells: each bell swings a little left/right per frame (the jingle)
layer(INK,g=>{g.lineWidth=3.4;ankRing(g,true)});
layer(LGRAY,g=>{g.lineWidth=1.8;ankRing(g,true)});
const BELLS=[.25,.65,1.05,1.45,1.85,2.25,2.65];                        // positions round the front arc (radians)
const swing=(k,f)=>[[-1.6,0,1.6],[1.6,-1.6,0],[0,1.6,-1.6]][f][k%3];
const bellAt=(k,f)=>{const a=BELLS[k],c=Math.cos(ATILT),s=Math.sin(ATILT),x=ARX*Math.cos(a),y=ARY*Math.sin(a);
 const ax=ANK[0]+x*c-y*s,ay=ANK[1]+x*s+y*c;return[ax,ay,ax+swing(k,f),ay+6.5]};
layer(LGRAY,(g,f)=>{BELLS.forEach((_,k)=>{const[,,bx,by]=bellAt(k,f);g.beginPath();g.arc(bx,by,3,0,2*PI);g.fill()})});
layer(INK,(g,f)=>{g.lineWidth=1;BELLS.forEach((_,k)=>{const[ax,ay,bx,by]=bellAt(k,f);
 g.beginPath();g.moveTo(ax,ay);g.lineTo(bx,by-3);g.stroke();                                   // link
 g.beginPath();g.arc(bx,by,3,0,2*PI);g.stroke();g.beginPath();g.moveTo(bx-1.6,by+1);g.lineTo(bx+1.6,by+1);g.stroke()})});   // bell slit

// evil-eye charm hanging from the front of the anklet, swinging with the bells
const charm=f=>{const[ax,ay]=bellAt(3,f);return[ax+swing(1,f),ay+16]};
layer(INK,(g,f)=>{const[ax,ay]=bellAt(3,f),[cx,cy]=charm(f);g.lineWidth=1;g.beginPath();g.moveTo(ax,ay);g.lineTo(cx,cy-5.5);g.stroke();
 g.beginPath();g.arc(cx,cy,5.5,0,2*PI);g.fill()});
layer(BLUE,(g,f)=>{const[cx,cy]=charm(f);g.beginPath();g.arc(cx,cy,4.4,0,2*PI);g.fill()});
layer(PAPER,(g,f)=>{const[cx,cy]=charm(f);g.beginPath();g.arc(cx,cy,3,0,2*PI);g.fill()});
layer(CYAN,(g,f)=>{const[cx,cy]=charm(f);g.beginPath();g.arc(cx,cy,2,0,2*PI);g.fill()});
layer(INK,(g,f)=>{const[cx,cy]=charm(f);g.beginPath();g.arc(cx,cy,1,0,2*PI);g.fill()});

// jingle marks beside the bells, changing every frame
const JINGLE=[[[112,186],[178,180]],[[108,192],[182,174]],[[114,180],[176,186]]];
layer(INK,(g,f)=>{g.lineWidth=1.3;g.lineCap='round';for(const[x,y]of JINGLE[f]){const s=x<150?-1:1;
 for(const[dy,len]of[[-5,6],[0,8],[5,6]]){g.beginPath();g.moveTo(x,y+dy);g.lineTo(x+s*len,y+dy+dy*.3);g.stroke()}}});
layer(YELLOW,(g,f)=>{for(const[x,y]of[[[58,190],[120,160]],[[62,184],[116,166]],[[54,196],[124,154]]][f]){g.beginPath();g.arc(x,y,2.4,0,2*PI);g.fill()}});
layer(INK,(g,f)=>{g.lineWidth=1.2;for(const[x,y]of[[[58,190],[120,160]],[[62,184],[116,166]],[[54,196],[124,154]]][f])
 for(const a of[0,PI/2]){g.beginPath();g.moveTo(x-6*Math.cos(a),y-6*Math.sin(a));g.lineTo(x+6*Math.cos(a),y+6*Math.sin(a));g.stroke()}});

lyric(TEXT,{style:'tag',colors:{small:RED,tag:YELLOW,word:RED,tail:BLUE,box:[204,356]}});   // hanging-tag lettering
show();
}
