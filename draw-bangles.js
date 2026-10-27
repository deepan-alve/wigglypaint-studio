// Lyric screen for WigglyPaint: the back of a slender hand, relaxed and tilted, with henna, rings, a hand
// chain, and a deep stack of thin bangles (gold, pearl, coloured glass) that jiggle and glint.
// Needs lyric-lib.js loaded first (the studio page bundles both).

const TEXT=window.WP_TEXT||{small:'',big:''};   // the studio panel's lyric boxes set WP_TEXT
{
const{layer:baseLayer,backdrop,clear,lyric,show,C:{INK,PAPER,YELLOW,PINK,PURPLE,RED,ORANGE,BLUE,CYAN,GREEN,DKGREEN,LGRAY},PI,rnd}=lyricKit();
clear();
backdrop({color:GREEN,calm:[100,170]});

// Everything is drawn in "hand space": origin at the middle of the wrist, the hand pointing straight up
// (-y), then rotated to lean right. One transform keeps all the parts lined up.
const WRIST_AT=[96,206],LEAN=.36,SCALE=1.38;                   // bigger, so the hand owns the left half
const layer=(v,draw,o)=>baseLayer(v,(g,i)=>{g.translate(...WRIST_AT);g.rotate(LEAN);g.scale(SCALE,SCALE);draw(g,i)},o);

// --- geometry (hand space) ---
// finger = [base, tip, base half-width, tip half-width, bend]: long, slim, close together, gently curved
// young, smooth fingers: full at the base, tapering evenly to soft rounded tips, close together
const FINGERS=[[[-13,-49],[-18,-92],5,3.6,-1.5],[[-4.4,-52],[-5.5,-102],5.2,3.8,-.5],
               [[4.4,-51],[6.5,-97],5,3.6,.5],[[12.4,-45],[17.5,-79],4.4,3.2,1.2]];
const THUMB=[[-13,-15],[-33,-52],6.2,4,-5];                    // long, tapered thumb reaching out, nail visible
const finger=(g,[b,t,wb,wt,bend])=>{const dx=t[0]-b[0],dy=t[1]-b[1],l=Math.hypot(dx,dy),nx=-dy/l,ny=dx/l;
 const mx=(b[0]+t[0])/2+nx*bend,my=(b[1]+t[1])/2+ny*bend,a=Math.atan2(dy,dx);
 g.moveTo(b[0]-nx*wb,b[1]-ny*wb);g.quadraticCurveTo(mx-nx*(wb+wt)/2,my-ny*(wb+wt)/2,t[0]-nx*wt,t[1]-ny*wt);
 g.arc(t[0],t[1],wt,a-PI/2,a+PI/2,true);
 g.quadraticCurveTo(mx+nx*(wb+wt)/2,my+ny*(wb+wt)/2,b[0]+nx*wb,b[1]+ny*wb);g.closePath()};
const along=([b,t,,,bend],k,side=0)=>{const dx=t[0]-b[0],dy=t[1]-b[1],l=Math.hypot(dx,dy),nx=-dy/l,ny=dx/l,
 bow=4*k*(1-k)*bend;return[b[0]+dx*k+nx*(bow+side),b[1]+dy*k+ny*(bow+side)]};
const back=g=>{g.moveTo(-11.5,0);g.bezierCurveTo(-15,-16,-20,-36,-18.5,-49);
 g.bezierCurveTo(-11,-55,10,-55,16.5,-45);g.bezierCurveTo(17,-28,14,-12,11.5,0);g.closePath()};
const arm=g=>{g.moveTo(-11.5,0);g.lineTo(11.5,0);g.bezierCurveTo(13,40,15,80,16,130);g.lineTo(-16,130);g.bezierCurveTo(-15,80,-13,40,-11.5,0);g.closePath()};
const parts=[arm,back,g=>finger(g,THUMB),...FINGERS.map(f=>g=>finger(g,f))];
const shapes=(g,grow)=>{g.lineJoin=g.lineCap='round';for(const p of parts){g.beginPath();p(g);g.fill();if(grow){g.lineWidth=2*grow;g.stroke()}}};
const halfW=y=>11.5+4.5*Math.max(0,y)/130;                       // forearm half-width at height y

// --- bangles: a deep stack of thin rings; back halves behind the arm, front halves over it ---
// kinds: gold, pearl (white beads), glass (colour)
const STACK=[['gold'],['glass',RED],['pearl'],['glass',GREEN],['glass',PINK],['gold']];   // a light stack of six
const Y0=9,GAP=4.6,RY=3.4;
const jig=(k,f)=>[[0,1,-1],[1,-1,0],[-1,0,1]][f][k%3]*.8;
const ringArc=(g,k,f,front)=>{const y=Y0+k*GAP;g.beginPath();g.ellipse(0,y+jig(k,f),halfW(y)+2.2,RY,0,front?0:PI,front?PI:2*PI);g.stroke()};
const colourOf=([kind,c])=>kind==='gold'?YELLOW:kind==='pearl'?PAPER:c;
const bangles=front=>{STACK.forEach((s,k)=>{
 layer(INK,(g,f)=>{g.lineWidth=s[0]==='pearl'?4.4:3.6;ringArc(g,k,f,front)});
 layer(colourOf(s),(g,f)=>{g.lineWidth=s[0]==='pearl'?2.6:1.8;ringArc(g,k,f,front)})});
 if(front)layer(INK,(g,f)=>{STACK.forEach((s,k)=>{if(s[0]!=='pearl')return;const y=Y0+k*GAP,rx=halfW(y)+2.2;   // bead dividers on pearls
  for(let a=.2;a<PI;a+=.32){g.beginPath();g.arc(rx*Math.cos(a),y+jig(k,f)+RY*Math.sin(a),.6,0,2*PI);g.fill()}})})};

bangles(false);
layer(PAPER,g=>shapes(g,4));                                     // white halo
layer(INK,g=>shapes(g,1.7));                                     // clean outline (thin lines get scratchy when they wobble)
layer(PAPER,g=>shapes(g,0));                                     // skin (white line art)


// henna (mehendi), delicate: a small flower on the back of the hand, a fine vine to the wrist,
// dot clusters at the finger bases and thin bands near the tips
layer(RED,g=>{g.lineWidth=.8;g.lineCap='round';const[cx,cy]=[-1,-30];
 g.beginPath();g.arc(cx,cy,2,0,2*PI);g.fill();
 for(let k=0;k<8;k++){const a=k*PI/4;g.beginPath();g.ellipse(cx+5.2*Math.cos(a),cy+5.2*Math.sin(a),2.6,1.3,a,0,2*PI);g.stroke()}
 g.beginPath();g.arc(cx,cy,9,0,2*PI);g.setLineDash([1,1.6]);g.stroke();g.setLineDash([]);
 g.beginPath();g.moveTo(cx,cy+10);g.bezierCurveTo(-4,-14,3,-8,0,-2);g.stroke();
 for(const s of[-1,1]){g.beginPath();g.ellipse(s*2.6,-12,2,1,s*.6,0,2*PI);g.stroke()}
 for(const f of FINGERS){const[x,y]=along(f,.16);for(const[dx,dy]of[[0,0],[-1.6,-1.6],[1.6,-1.6]]){g.beginPath();g.arc(x+dx,y+dy,.7,0,2*PI);g.fill()}
  const[a,b]=along(f,.8),[c,d]=along(f,.8,0);const n=[-(along(f,.82)[1]-b),along(f,.82)[0]-a],l=Math.hypot(...n);
  const wb=f[2]+(f[3]-f[2])*.8;g.beginPath();g.moveTo(a-n[0]/l*wb*.8,b-n[1]/l*wb*.8);g.lineTo(a+n[0]/l*wb*.8,b+n[1]/l*wb*.8);g.stroke()}});

// nails: soft pink, almond-shaped, on the back of each fingertip
layer(PINK,g=>{for(const f of[...FINGERS,THUMB]){const[x,y]=along(f,.93),[,,,wt]=f,[x2,y2]=along(f,.99);
 g.beginPath();g.ellipse(x,y,wt*.66,wt*1.25,Math.atan2(y2-y,x2-x)+PI/2,0,2*PI);g.fill()}});
layer(INK,g=>{g.lineWidth=.9;for(const f of[...FINGERS,THUMB]){const[x,y]=along(f,.93),[,,,wt]=f,[x2,y2]=along(f,.99);
 g.beginPath();g.ellipse(x,y,wt*.66,wt*1.25,Math.atan2(y2-y,x2-x)+PI/2,0,2*PI);g.stroke()}});

bangles(true);
// glints: one white fleck on a few rings, moving each frame
layer(PAPER,(g,f)=>{STACK.forEach((s,k)=>{if(s[0]==='pearl'||(k+f)%2)return;const y=Y0+k*GAP,rx=halfW(y)+2.2,a=.5+((k*.7+f*.9)%2);
 g.beginPath();g.arc(rx*Math.cos(a),y+jig(k,f)+RY*Math.sin(a),.9,0,2*PI);g.fill()})});

// sparkles near the bangles, twinkling between spots per frame (screen space, not hand space)
const SPARKS=[[[40,200],[160,214],[46,262]],[[36,208],[164,222],[42,270]],[[44,192],[156,206],[50,254]]];
baseLayer(YELLOW,(g,f)=>{for(const[x,y]of SPARKS[f]){g.beginPath();g.arc(x,y,2.4,0,2*PI);g.fill()}});
baseLayer(INK,(g,f)=>{g.lineWidth=1.2;for(const[x,y]of SPARKS[f])for(const a of[0,PI/2,PI/4,3*PI/4]){const r=a%(PI/2)?3:6;
 g.beginPath();g.moveTo(x-r*Math.cos(a),y-r*Math.sin(a));g.lineTo(x+r*Math.cos(a),y+r*Math.sin(a));g.stroke()}});

// ribbon-banner lettering, in a wider column (the hand leaves room)
lyric(TEXT,{style:'banner',colors:{small:DKGREEN,ribbon:RED,fold:PURPLE,word:PAPER,tail:BLUE,box:[192,356]}});
show();
}
