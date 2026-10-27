// Lyric screen for WigglyPaint: an original anime-style boy asking a question, shy and curious, with question
// marks bobbing beside him and the lyric in a speech bubble pointing at his mouth.
// Needs lyric-lib.js loaded first (the studio page bundles both).

const TEXT=window.WP_TEXT||{small:'',big:''};   // the studio panel's lyric boxes set WP_TEXT
{
const{layer,backdrop,clear,lyric,show,C:{INK,PAPER,YELLOW,PINK,RED,BLUE,CYAN,LGRAY,GRAY},PI}=lyricKit();
clear();
backdrop({color:CYAN,calm:[96,150]});

// --- geometry ---
const face=g=>{g.beginPath();g.moveTo(62,112);g.bezierCurveTo(62,152,78,174,98,178);g.bezierCurveTo(118,174,134,152,134,112);
 g.bezierCurveTo(134,86,118,76,98,76);g.bezierCurveTo(78,76,62,86,62,112);g.closePath()};
// tousled hair: a cap over the crown with spiky locks falling over the forehead and sides
const SPIKES=[[60,118],[66,104],[74,100],[82,96],[92,100],[100,94],[110,100],[118,96],[126,102],[134,106],[138,120]];
const hair=g=>{g.beginPath();g.moveTo(56,122);g.bezierCurveTo(48,74,76,52,100,52);g.bezierCurveTo(126,52,152,70,142,124);
 for(let k=SPIKES.length-1;k>=0;k--){const[x,y]=SPIKES[k];g.lineTo(x+4,y-14);g.lineTo(x,y)}g.closePath()};
const tufts=g=>{for(const[x,y,a]of[[86,56,-.6],[100,52,0],[114,56,.6]]){g.beginPath();g.moveTo(x-5,y+4);g.lineTo(x+Math.sin(a)*10,y-10);g.lineTo(x+5,y+4);g.closePath();g.fill()}};
const shirt=g=>{g.beginPath();g.moveTo(34,262);g.bezierCurveTo(38,224,60,206,86,198);g.lineTo(98,212);g.lineTo(110,198);
 g.bezierCurveTo(136,206,158,224,162,262);g.closePath()};
const neck=g=>{g.beginPath();g.moveTo(88,168);g.lineTo(87,200);g.lineTo(98,212);g.lineTo(109,200);g.lineTo(108,168);g.closePath()};

// hair behind + shoulders
layer(PAPER,g=>{g.lineWidth=8;g.lineJoin='round';hair(g);g.stroke();g.fill();tufts(g);shirt(g);g.stroke();g.fill()});
layer(BLUE,g=>{shirt(g);g.fill()});
layer(PAPER,g=>{for(const s of[-1,1]){g.beginPath();g.moveTo(98,212);g.lineTo(98+s*14,198);g.lineTo(98+s*22,212);g.closePath();g.fill()}});  // white collar
layer(INK,g=>{g.lineJoin='round';g.lineWidth=2;shirt(g);g.stroke();
 for(const s of[-1,1]){g.beginPath();g.moveTo(98,212);g.lineTo(98+s*14,198);g.lineTo(98+s*22,212);g.closePath();g.stroke()}
 g.lineWidth=1.2;g.beginPath();g.moveTo(98,212);g.lineTo(98,262);g.stroke();for(const y of[226,244]){g.beginPath();g.arc(101,y,1.6,0,2*PI);g.fill()}});
// neck, ears, face
layer(PAPER,g=>{neck(g);g.fill();face(g);g.fill();for(const s of[-1,1]){g.beginPath();g.ellipse(98+s*37,122,6,9,0,0,2*PI);g.fill()}});
layer(INK,g=>{g.lineJoin='round';g.lineWidth=2;neck(g);g.stroke();for(const s of[-1,1]){g.beginPath();g.ellipse(98+s*37,122,6,9,0,0,2*PI);g.stroke()}
 g.lineWidth=2.4;face(g);g.stroke()});
// hair over the face
layer(INK,g=>{hair(g);g.fill();tufts(g)});
layer(GRAY,g=>{g.lineWidth=1.2;g.lineCap='round';for(const[x,y]of[[78,66],[96,62],[116,66],[130,80]]){g.beginPath();g.moveTo(x,y);g.quadraticCurveTo(x+6,y+10,x+2,y+20);g.stroke()}});
layer(PAPER,g=>{g.lineWidth=2;g.lineCap='round';for(const[x,y]of[[84,64],[104,60]]){g.beginPath();g.arc(x,y,5,PI*1.1,PI*1.7);g.stroke()}});   // shine

// curious face: raised brows, big eyes glancing toward the bubble, a shy half smile, blush, a little sweat drop
const EYES=[[84,124],[114,124]];
layer(INK,g=>{g.lineCap='round';g.lineWidth=2.2;for(const[x,y]of EYES){g.beginPath();g.moveTo(x-8,y-15);g.quadraticCurveTo(x,y-21,x+8,y-16);g.stroke()}});
for(const[x,y]of EYES){
 layer(INK,g=>{g.beginPath();g.ellipse(x+1,y,6,8,0,0,2*PI);g.fill()});
 layer(BLUE,g=>{g.beginPath();g.ellipse(x+2,y+2,3.6,4.6,0,0,2*PI);g.fill()});
 layer(INK,g=>{g.beginPath();g.arc(x+2.5,y+1,2,0,2*PI);g.fill()});
 layer(PAPER,(g,f)=>{const s=[0,.5,-.5][f];g.beginPath();g.arc(x+3.5+s,y-3,2.2,0,2*PI);g.fill();g.beginPath();g.arc(x-1,y+3,1,0,2*PI);g.fill()})}
layer(INK,g=>{g.lineCap='round';g.lineWidth=1.4;g.beginPath();g.moveTo(99,142);g.lineTo(97,147);g.stroke();
 g.lineWidth=1.8;g.beginPath();g.moveTo(91,158);g.quadraticCurveTo(100,163,108,156);g.stroke();
 g.beginPath();g.moveTo(108,156);g.lineTo(110,154);g.stroke()});                                         // half smile, one corner up
layer(PINK,g=>{g.lineWidth=1.3;g.lineCap='round';for(const cx of[76,122])for(let k=0;k<3;k++){g.beginPath();g.moveTo(cx-5+k*4,146);g.lineTo(cx-2+k*4,141);g.stroke()}});
layer(CYAN,(g,f)=>{const y=96+[0,1,2][f];g.beginPath();g.moveTo(140,y-6);g.quadraticCurveTo(145,y+2,140,y+4);g.quadraticCurveTo(135,y+2,140,y-6);g.fill()});
layer(INK,(g,f)=>{const y=96+[0,1,2][f];g.lineWidth=1;g.beginPath();g.moveTo(140,y-6);g.quadraticCurveTo(145,y+2,140,y+4);g.quadraticCurveTo(135,y+2,140,y-6);g.stroke()});

// question marks bobbing beside his head
const QS=[[160,74,30],[40,82,22]];
const qm=(g,f,how)=>{for(const[i,[x,y,s]]of QS.entries()){const b=[[0,-3,2],[2,0,-3]][i][f];g.save();g.translate(x,y+b);g.rotate(i?-.2:.15);
 g.font=`400 ${s}px 'Anton','Noto Sans Tamil'`;g.textBaseline='middle';g.textAlign='center';g.lineJoin='round';
 if(how==='line'){g.lineWidth=3;g.strokeText('?',0,0)}else g.fillText('?',0,0);g.restore()}};
layer(INK,(g,f)=>qm(g,f,'line'));layer(YELLOW,(g,f)=>qm(g,f,'fill'));

// the lyric, said in a speech bubble pointing at his mouth
lyric(TEXT,{style:'bubble',colors:{small:BLUE,big:RED,shadow:YELLOW,tail:BLUE,point:[132,150],box:[190,356]}});
show();
}
