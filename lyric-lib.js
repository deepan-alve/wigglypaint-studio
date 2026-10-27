// Shared helpers for the lyric screens (draw-kajal.js, draw-lolaakku.js, ...).
// Paste this into the devtools console once, before any lyric screen script; the studio page bundles it.
//
// Nothing here simulates the mouse. Each layer is drawn with the 2D canvas API, rasterised, and written
// straight into WigglyPaint's 3 animation frames. Every frame gets its own smooth wobble field, which is
// what makes lines boil like WigglyPaint's own pens.
window.lyricKit=()=>{
 const tgt=dget(dget(deck.cards,lms('main')).widgets,lms('target')).widgets;
 const frames=dget(tgt,lms('fr')).value.v.get('arg').filter(x=>x&&x.pix);
 const W=355,H=261,OX=5,OY=22;                  // canvas widget sits at deck (5,22), 355x261
 // WigglyPaint/Decker palette indices: 0 paper, 1 ink, 32-47 the 16 colours
 const C={INK:1,PAPER:0,WHITE:32,YELLOW:33,ORANGE:34,RED:35,PINK:36,PURPLE:37,BLUE:38,CYAN:39,
          GREEN:40,DKGREEN:41,BROWN:42,TAN:43,LGRAY:44,GRAY:45,DGRAY:46};
 const PI=Math.PI,rnd=(a,b)=>a+Math.random()*(b-a);
 const wob=frames.map(()=>{const p=[rnd(0,9),rnd(0,9),rnd(0,9),rnd(0,9)];
  return(x,y)=>[Math.round(1.1*Math.sin(x*.12+p[0])+.6*Math.sin(y*.19+p[1])),
                Math.round(1.1*Math.sin(y*.13+p[2])+.6*Math.sin(x*.17+p[3]))]});

 // layer(value, draw): draw(g, frameIndex) paints in any opaque colour on a deck-sized (512x342) canvas;
 // covered pixels become `value`. draw runs once per frame, so random details and motion differ per frame.
 const layer=(val,draw,{onlyEmpty=false}={})=>frames.forEach((f,i)=>{
  const k=document.createElement('canvas');k.width=512;k.height=342;const g=k.getContext('2d');
  g.fillStyle=g.strokeStyle='#000';g.lineCap=g.lineJoin='round';draw(g,i);
  const a=g.getImageData(OX,OY,W,H).data,w=wob[i];
  // pull, don't push: each output pixel samples the source at its displaced spot, so fills never crack
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){const[dx,dy]=w(x+OX,y+OY),sx=x-dx,sy=y-dy;
   if(sx<0||sx>=W||sy<0||sy>=H||a[(sy*W+sx)*4+3]<110)continue;
   if(onlyEmpty&&f.pix[y*W+x]!==C.PAPER)continue;f.pix[y*W+x]=val}});

 const clear=()=>frames.forEach(f=>f.pix.fill(C.PAPER));
 const bez=(p0,p1,p2,p3)=>t=>{const u=1-t;return[u*u*u*p0[0]+3*u*u*t*p1[0]+3*u*t*t*p2[0]+t*t*t*p3[0],
                                                u*u*u*p0[1]+3*u*u*t*p1[1]+3*u*t*t*p2[1]+t*t*t*p3[1]]};
 const normal=(f,t,up=1)=>{const[a,b]=f(Math.max(0,t-.01)),[c,d]=f(Math.min(1,t+.01));const l=Math.hypot(c-a,d-b);return[up*(d-b)/l,-up*(c-a)/l]};
 // join=true continues the current subpath, so several curves chain into one closed, fillable outline
 const trace=(g,f,n=60,from=0,to=1,join=false)=>{for(let i=0;i<=n;i++){const[x,y]=f(from+(to-from)*i/n);(i||join)?g.lineTo(x,y):g.moveTo(x,y)}};

 // ---- lyric typography (right-hand column, next to the drawing) ----
 // small line: set on an arc, one Tamil grapheme cluster at a time (so vowel signs stay attached)
 // big word:   chunky outlined letters, white inside, with an offset pink shadow, over a yellow swash
 const BOX=[224,356],MID=(BOX[0]+BOX[1])/2;
 const graphemes=t=>[...new Intl.Segmenter('ta',{granularity:'grapheme'}).segment(t)].map(s=>s.segment);
 const arcLine=(txt,px,cy,r,halo=false)=>layer(halo?C.PAPER:C.INK,g=>{g.font=`700 ${px}px 'Noto Sans Tamil'`;
  const parts=graphemes(txt),ws=parts.map(c=>g.measureText(c).width),total=ws.reduce((a,b)=>a+b,0)+(parts.length-1)*1.5;
  const maxSpan=1.5*r;if(total>maxSpan){px=Math.floor(px*maxSpan/total);g.font=`700 ${px}px 'Noto Sans Tamil'`;
   ws.splice(0,ws.length,...parts.map(c=>g.measureText(c).width))}
  const span=ws.reduce((a,b)=>a+b,0)+(parts.length-1)*1.5;
  let a=-PI/2-span/r/2;g.textBaseline='alphabetic';g.lineWidth=5;
  parts.forEach((c,i)=>{const mid=a+ws[i]/2/r;g.save();g.translate(MID+r*Math.cos(mid),cy+r*Math.sin(mid));
   g.rotate(mid+PI/2);halo?g.strokeText(c,-ws[i]/2,0):g.fillText(c,-ws[i]/2,0);g.restore();a+=(ws[i]+1.5)/r})});
 const bigWord=(txt,px,y)=>{const font=s=>`800 ${s}px 'Noto Sans Tamil'`;
  const k=document.createElement('canvas').getContext('2d');k.font=font(px);let w=k.measureText(txt).width;
  const room=BOX[1]-BOX[0]+4;if(w>room){px=Math.floor(px*room/w);k.font=font(px);w=k.measureText(txt).width}
  const x=MID-w/2,tilt=-.05,tamil=/[\u0B80-\u0BFF]/.test(txt),OL=tamil&&px<36?2:3.2,SH=tamil&&px<36?2:3;   // small Tamil: thinner outline
  const draw=(g,dx,dy,how)=>{g.translate(MID,y+px/2);g.rotate(tilt);g.translate(-MID,-(y+px/2));
   g.font=font(px);g.textBaseline='top';g.lineWidth=OL;
   if(how==='stroke'){g.strokeText(txt,x+dx,y+dy);g.fillText(txt,x+dx,y+dy)}else g.fillText(txt,x+dx,y+dy)};
  layer(C.YELLOW,g=>{g.lineWidth=13;g.beginPath();g.moveTo(BOX[0]+6,y+px*1.15);
   g.bezierCurveTo(BOX[0]+50,y+px*.95,BOX[0]+96,y+px*1.35,BOX[1]-4,y+px*1.05);g.stroke()});
  layer(C.PINK,g=>draw(g,SH,SH,'fill'));        // offset shadow
  layer(C.INK,g=>draw(g,0,0,'stroke'));          // fat outline
  layer(C.PAPER,g=>draw(g,0,0,'fill'))};         // knock the inside back out to white
 const ornament=y=>layer(C.INK,g=>{g.lineWidth=1.3;
  for(let k=-3;k<=3;k++){g.beginPath();g.arc(MID+k*9,y,k%2?1.4:2.2,0,2*PI);g.fill()}            // kolam-style dot row
  for(const s of[-1,1]){g.beginPath();g.moveTo(MID+s*36,y);g.bezierCurveTo(MID+s*48,y-7,MID+s*58,y+7,MID+s*68,y);g.stroke()}});
 // a long small line would shrink to nothing on one arc, so it splits at the word gap nearest the middle
 const measure=(txt,px)=>{const k=document.createElement('canvas').getContext('2d');k.font=`700 ${px}px 'Noto Sans Tamil'`;return k.measureText(txt).width};
 const splitLine=txt=>{const w=txt.split(/\s+/);if(w.length<2)return[txt];let best=1,score=1e9;
  for(let i=1;i<w.length;i++){const d=Math.abs(measure(w.slice(0,i).join(' '),24)-measure(w.slice(i).join(' '),24));if(d<score){score=d;best=i}}
  return[w.slice(0,best).join(' '),w.slice(best).join(' ')]};
 // optional last line: straight, slightly tilted the other way, under the big word
 const tailLine=(txt,y)=>{const font=s=>`700 ${s}px 'Noto Sans Tamil'`;let px=22;
  const room=BOX[1]-BOX[0]-6;let w=measure(txt,px);if(w>room){px=Math.floor(px*room/w);w=measure(txt,px)}
  const put=(g,how)=>{g.translate(MID,y);g.rotate(.04);g.translate(-MID,-y);g.font=font(px);g.textBaseline='top';g.lineWidth=5;
   how==='halo'?g.strokeText(txt,MID-w/2,y):g.fillText(txt,MID-w/2,y)};
  layer(C.PAPER,g=>put(g,'halo'));layer(C.INK,g=>put(g,'ink'))};
 // style 'arc' (default): arc small line, outlined big word with pink shadow, yellow swash
 const arcStyle=TEXT=>{let shift=0;
  if(TEXT.small){const lines=measure(TEXT.small,24)>1.5*92*1.15?splitLine(TEXT.small):[TEXT.small];
   lines.forEach((l,i)=>{arcLine(l,24,206+i*27,92,true);arcLine(l,24,206+i*27,92)});shift=(lines.length-1)*27}
  if(TEXT.big)bigWord(TEXT.big,44,138+shift);
  if(TEXT.tail){const y0=198+shift;shift+=capsLines(TEXT.tail,C.INK,y0,22,BOX)-y0}     // wraps to two rows instead of shrinking
  ornament(Math.min(272,210+shift))};

 // style 'poster': a clean stacked column. Small-line words in one colour (purple) with a white halo;
 // the big word in a condensed display face, two-tone fill (orange over red), fat black outline and a
 // hard purple offset shadow; a red/gold bead string underneath. Latin text uses Anton/Bebas Neue,
 // Tamil falls through to Noto Sans Tamil (neither display face has Tamil glyphs).
 const DISPLAY="'Anton','Noto Sans Tamil'",LABEL="'Bebas Neue','Noto Sans Tamil'";
 const fitPx=(txt,family,weight,px,room)=>{const k=document.createElement('canvas').getContext('2d');
  k.font=`${weight} ${px}px ${family}`;const w=k.measureText(txt).width;
  if(w>room){px=Math.floor(px*room/w);k.font=`${weight} ${px}px ${family}`}return[px,k.measureText(txt).width]};
 const posterStyle=(TEXT,col={})=>{const K={small:C.PURPLE,top:C.ORANGE,bottom:C.RED,shadow:C.PURPLE,tail:C.DKGREEN,box:BOX,...col};
  const PB=K.box,PM=(PB[0]+PB[1])/2;let y=92;const room=PB[1]-PB[0]-6;
  // small line: words flow onto as few rows as fit (not one word per row); if that needs more than three
  // rows, the size steps down until it fits in three
  if(TEXT.small){const words=TEXT.small.split(/\s+/).filter(Boolean);let px=26,rows;
   for(;px>=16;px-=2){rows=[];let cur='';for(const w of words){const t=cur?cur+' '+w:w;
     if(cur&&measure(t,px)*(px/24)>room*(px/24)&&fitPx(t,LABEL,700,px,9999)[1]>room){rows.push(cur);cur=w}else cur=t}
    if(cur)rows.push(cur);if(rows.length<=3)break}
   for(const r of rows){const[rp]=fitPx(r,LABEL,700,px,room),yy=y;
    const put=(g,how)=>{g.font=`700 ${rp}px ${LABEL}`;g.textBaseline='top';g.lineWidth=6;g.lineJoin='round';
     how==='halo'?g.strokeText(r,PB[0]+2,yy):g.fillText(r,PB[0]+2,yy)};
    layer(C.PAPER,g=>put(g,'halo'));layer(K.small,g=>put(g,'fill'));y+=rp+3}}
  if(TEXT.big){const[px,w]=fitPx(TEXT.big,DISPLAY,400,52,room-4);y+=4;
   const x=PB[0]+2,tilt=-.04;
   const tamil=/[\u0B80-\u0BFF]/.test(TEXT.big),OL=tamil?3.2:5,SH=tamil?3:4;          // Tamil strokes are thin: lighter outline
   const put=(g,dx,dy,mode)=>{g.translate(x,y);g.rotate(tilt);g.translate(-x,-y);g.font=`400 ${px}px ${DISPLAY}`;g.textBaseline='top';
    if(mode==='outline'){g.lineWidth=OL;g.strokeText(TEXT.big,x,y)}else g.fillText(TEXT.big,x+dx,y+dy)};
   layer(K.shadow,g=>{put(g,SH,SH,'fill');g.lineWidth=OL;g.strokeText(TEXT.big,x+SH,y+SH)});  // hard offset shadow, drawn first
   layer(C.PAPER,g=>{g.translate(x,y);g.rotate(tilt);g.translate(-x,-y);g.font=`400 ${px}px ${DISPLAY}`;g.textBaseline='top';
    g.lineWidth=OL+4;g.strokeText(TEXT.big,x,y)});                                          // white gap between letters and shadow
   layer(C.INK,g=>put(g,0,0,'outline'));                                                   // fat outline
   layer(K.bottom,g=>put(g,0,0,'fill'));                                                   // lower tone
   layer(K.top,g=>{g.beginPath();g.rect(0,0,512,y+px*.55);g.clip();put(g,0,0,'fill')});    // upper tone
   y+=px*1.25}
  if(TEXT.tail){const[px]=fitPx(TEXT.tail,LABEL,700,22,room);
   const put=(g,how)=>{g.font=`700 ${px}px ${LABEL}`;g.textBaseline='top';g.lineWidth=6;
    how==='halo'?g.strokeText(TEXT.tail,PB[0]+2,y):g.fillText(TEXT.tail,PB[0]+2,y)};
   layer(C.PAPER,g=>put(g,'halo'));layer(K.tail,g=>put(g,'fill'));y+=px+4}
  const by=Math.min(274,y+8);                                                               // bead string: alternating red / gold
  layer(C.INK,g=>{g.lineWidth=1;g.beginPath();g.moveTo(PB[0]+4,by);g.quadraticCurveTo(PM,by+8,PB[1]-4,by);g.stroke()});
  for(const[col,odd]of[[C.RED,0],[C.YELLOW,1]])layer(col,g=>{for(let i=odd;i<=16;i+=2){const t=i/16,x=PB[0]+4+(PB[1]-PB[0]-8)*t,yy=by+8*4*t*(1-t);
   g.beginPath();g.arc(x,yy,2.6,0,2*PI);g.fill()}})};
 // style 'script': sign-painter lettering. Small-line words stacked flat in one colour; the big word in a
 // retro brush script (Pacifico, Latin only), flat fill, black outline, flat offset shadow, tilted, and a
 // hand-drawn flourish under it. No two-tone fills.
 const SCRIPT="'Pacifico','Noto Sans Tamil'";
 const scriptStyle=(TEXT,col={})=>{const K={small:C.RED,fill:C.RED,shadow:C.PINK,tail:C.PURPLE,swash:C.INK,...col};
  let y=96;const room=BOX[1]-BOX[0]-6;
  // small line: by default stacked Bebas words; colors.smallFont switches it to a tall condensed fashion face
  if(TEXT.small){const fam=K.smallFont||LABEL,wt=K.smallWeight||700,sp=K.smallSpacing||0,size=K.smallPx||24;
   if(!K.smallFont){y=capsLines(TEXT.small,K.small,y,26,BOX)+2}else
   for(const w of TEXT.small.split(/\s+/).filter(Boolean)){
    const k=document.createElement('canvas').getContext('2d');k.letterSpacing=sp+'px';let px=size;k.font=`${wt} ${px}px ${fam}`;
    let tw=k.measureText(w).width;if(tw>room){px=Math.floor(px*room/tw);k.font=`${wt} ${px}px ${fam}`;tw=k.measureText(w).width}
    const x=K.smallFont?MID-tw/2:BOX[0]+4;
    const put=(g,how)=>{g.letterSpacing=sp+'px';g.font=`${wt} ${px}px ${fam}`;g.textBaseline='top';g.lineWidth=6;
     how==='halo'?g.strokeText(w,x,y):g.fillText(w,x,y)};
    layer(C.PAPER,g=>put(g,'halo'));layer(K.small,g=>put(g,'fill'));y+=px*(K.smallFont?1.05:1)+3}}
  if(TEXT.big){
   // a hyphenated suffix ("-ku") would squeeze the script word; set it as a small tag instead
   const m=TEXT.big.match(/^(.+?)(-[^-]+)$/),word=m?m[1]:TEXT.big,tag=m?m[2]:'';
   const[px,w]=fitPx(word,SCRIPT,400,48,room+6);y+=2;
   const x=MID-w/2,tilt=-.07,cy=y+px*.7;
   const put=(g,dx,dy,mode,lw)=>{g.translate(MID,cy);g.rotate(tilt);g.translate(-MID,-cy);g.font=`400 ${px}px ${SCRIPT}`;g.textBaseline='top';
    if(mode==='stroke'){g.lineWidth=lw;g.strokeText(word,x+dx,y+dy)}else g.fillText(word,x+dx,y+dy)};
   layer(C.PAPER,g=>put(g,0,0,'stroke',9));                                    // white sticker edge
   layer(K.shadow,g=>put(g,3,3,'fill'),{onlyEmpty:true});                      // flat offset shadow, only behind the word
   layer(C.INK,g=>put(g,0,0,'stroke',3));                                      // outline
   layer(K.fill,g=>put(g,0,0,'fill'));                                         // flat fill
   if(tag){const tp=Math.max(16,Math.round(px*.55));const tx=x+w-measure(tag,tp)-22,ty=y+px*1.05;
    const tput=(g,how)=>{g.translate(MID,cy);g.rotate(tilt);g.translate(-MID,-cy);g.font=`700 ${tp}px ${LABEL}`;g.textBaseline='top';g.lineWidth=6;
     how==='halo'?g.strokeText(tag,tx,ty):g.fillText(tag,tx,ty)};
    layer(C.PAPER,g=>tput(g,'halo'));layer(C.INK,g=>tput(g,'fill'))}
   y+=px*1.5;
   // flourish: one confident brush loop under the word, ending in a little curl
   layer(K.swash,g=>{g.translate(MID,y);g.rotate(tilt*.6);g.translate(-MID,-y);g.lineWidth=2.6;g.beginPath();
    g.moveTo(BOX[0]+6,y+2);g.bezierCurveTo(BOX[0]+40,y+10,MID+10,y+10,MID+30,y+2);
    g.bezierCurveTo(MID+40,y-4,MID+30,y-10,MID+24,y-4);g.stroke();
    g.lineWidth=1.4;g.beginPath();g.moveTo(BOX[0]+20,y+9);g.bezierCurveTo(BOX[0]+44,y+14,MID-4,y+14,MID+14,y+8);g.stroke()});
   y+=14}
  if(TEXT.tail){const[px]=fitPx(TEXT.tail,LABEL,700,20,room);
   const put=(g,how)=>{g.font=`700 ${px}px ${LABEL}`;g.textBaseline='top';g.lineWidth=6;
    how==='halo'?g.strokeText(TEXT.tail,MID-measure(TEXT.tail,px)/2,y):g.fillText(TEXT.tail,MID-measure(TEXT.tail,px)/2,y)};
   layer(C.PAPER,g=>put(g,'halo'));layer(K.tail,g=>put(g,'fill'))}};
 // style 'banner': the big word in white letters on a flat ribbon with folded, notched ends;
 // small line above and last line below in condensed caps. Long lines wrap onto two lines instead of
 // shrinking into mush. colors.box widens the text column for scenes with room to spare.
 const wrapFit=(txt,fam,wt,px,room,minPx=17)=>{const one=fitPx(txt,fam,wt,px,room);if(one[0]>=minPx)return[[txt,...one]];
  const w=txt.split(/\s+/);if(w.length<2)return[[txt,...one]];let best=1,score=1e9;
  for(let i=1;i<w.length;i++){const d=Math.abs(measure(w.slice(0,i).join(' '),px)-measure(w.slice(i).join(' '),px));if(d<score){score=d;best=i}}
  const a=w.slice(0,best).join(' '),b=w.slice(best).join(' ');const pa=fitPx(a,fam,wt,px,room),pb=fitPx(b,fam,wt,px,room);
  const sz=Math.min(pa[0],pb[0]);return[[a,sz,fitPx(a,fam,wt,sz,9999)[1]],[b,sz,fitPx(b,fam,wt,sz,9999)[1]]]};
 const capsLines=(txt,colour,y,px,box)=>{const mid=(box[0]+box[1])/2;
  for(const[t,sz,w]of wrapFit(txt,LABEL,700,px,box[1]-box[0]-6)){const x=mid-w/2,yy=y;
   const put=(g,how)=>{g.font=`700 ${sz}px ${LABEL}`;g.textBaseline='top';g.lineWidth=5;g.lineJoin='round';how==='halo'?g.strokeText(t,x,yy):g.fillText(t,x,yy)};
   layer(C.PAPER,g=>put(g,'halo'));layer(colour,g=>put(g,'fill'));y+=sz+3}
  return y};
 const bannerStyle=(TEXT,col={})=>{const K={small:C.DKGREEN,ribbon:C.RED,fold:C.PURPLE,word:C.PAPER,tail:C.BLUE,box:BOX,...col};
  const box=K.box,mid=(box[0]+box[1])/2,room=box[1]-box[0]-6;let y=88;
  if(TEXT.small)y=capsLines(TEXT.small,K.small,y,28,box)+8;
  if(TEXT.big){const TAIL=14,PAD=10;const[px,w]=fitPx(TEXT.big,DISPLAY,400,46,room-2*(TAIL+PAD));
   const h=px*1.4,x0=mid-w/2-PAD,x1=mid+w/2+PAD,top=y,bot=y+h,tilt=-.04,cy=y+h/2;
   const rot=g=>{g.translate(mid,cy);g.rotate(tilt);g.translate(-mid,-cy)};
   const band=g=>{g.beginPath();g.moveTo(x0,top);g.quadraticCurveTo(mid,top-5,x1,top);g.lineTo(x1,bot);g.quadraticCurveTo(mid,bot-5,x0,bot);g.closePath()};
   const tails=g=>{for(const s of[-1,1]){const xe=s<0?x0:x1,xo=xe+s*TAIL;g.beginPath();
     g.moveTo(xe,top+7);g.lineTo(xo,top+7);g.lineTo(xo-s*6,top+7+h*.5);g.lineTo(xo,bot+7);g.lineTo(xe,bot+7);g.closePath()}};
   const folds=g=>{for(const s of[-1,1]){const xe=s<0?x0:x1;g.beginPath();g.moveTo(xe,bot);g.lineTo(xe,bot+7);g.lineTo(xe-s*7,bot);g.closePath()}};
   layer(C.PAPER,g=>{rot(g);g.lineWidth=8;tails(g);g.stroke();g.fill();band(g);g.stroke();g.fill()});
   layer(K.ribbon,g=>{rot(g);tails(g);g.fill()});
   layer(K.fold,g=>{rot(g);folds(g);g.fill()});
   layer(K.ribbon,g=>{rot(g);band(g);g.fill()});
   layer(C.INK,g=>{rot(g);g.lineWidth=1.8;tails(g);g.stroke();band(g);g.stroke();folds(g);g.stroke();
    g.lineWidth=1;g.setLineDash([2,3]);g.beginPath();g.moveTo(x0+4,top+4);g.quadraticCurveTo(mid,top-1,x1-4,top+4);g.stroke();
    g.beginPath();g.moveTo(x0+4,bot-4);g.quadraticCurveTo(mid,bot-9,x1-4,bot-4);g.stroke();g.setLineDash([])});
   const put=(g,how)=>{rot(g);g.font=`400 ${px}px ${DISPLAY}`;g.textBaseline='middle';
    if(how==='line'){g.lineWidth=2.4;g.lineJoin='round';g.strokeText(TEXT.big,mid-w/2,cy+1)}else g.fillText(TEXT.big,mid-w/2,cy+1)};
   layer(C.INK,g=>put(g,'line'));layer(K.word,g=>put(g,'fill'));
   y=bot+16}
  if(TEXT.tail)capsLines(TEXT.tail,K.tail,y,24,box)};
 // style 'tag': small line in flowing script, the big word printed on a hanging tag (punched hole + string)
 // that swings a little each frame, last line in condensed caps. Flat colours.
 const tagStyle=(TEXT,col={})=>{const K={small:C.RED,tag:C.YELLOW,word:C.RED,tail:C.BLUE,box:BOX,...col};
  const box=K.box,mid=(box[0]+box[1])/2,room=box[1]-box[0]-6;let y=84;
  if(TEXT.small){for(const[t,sz,w]of wrapFit(TEXT.small,SCRIPT,400,28,room*.84,18)){const x=mid-w/2,yy=y;
    const put=(g,how)=>{g.font=`400 ${sz}px ${SCRIPT}`;g.textBaseline='top';g.lineWidth=6;g.lineJoin='round';how==='halo'?g.strokeText(t,x,yy):g.fillText(t,x,yy)};
    layer(C.PAPER,g=>put(g,'halo'));layer(K.small,g=>put(g,'fill'));y+=sz*1.3}}
  if(TEXT.big){const HOLE=24;const[px,w]=fitPx(TEXT.big,DISPLAY,400,42,room-HOLE-34);
   const tw=w+HOLE+18,th=px*1.45,PIN=[mid,y+4],tx=mid-tw/2,ty=y+22,SW=[-.07,0,.07];
   const swing=(g,f)=>{g.translate(...PIN);g.rotate(SW[f]);g.translate(-PIN[0],-PIN[1])};
   const tagPath=g=>{const c=10;g.beginPath();g.moveTo(tx+c,ty);g.lineTo(tx+tw-5,ty);g.quadraticCurveTo(tx+tw,ty,tx+tw,ty+5);
    g.lineTo(tx+tw,ty+th-5);g.quadraticCurveTo(tx+tw,ty+th,tx+tw-5,ty+th);g.lineTo(tx+c,ty+th);g.lineTo(tx,ty+th-c);g.lineTo(tx,ty+c);g.closePath()};
   const hole=[tx+12,ty+th/2];
   layer(C.PAPER,(g,f)=>{swing(g,f);g.lineWidth=8;g.lineJoin='round';tagPath(g);g.stroke();g.fill()});
   layer(K.tag,(g,f)=>{swing(g,f);tagPath(g);g.fill()});
   layer(C.PAPER,(g,f)=>{swing(g,f);g.beginPath();g.arc(...hole,4,0,2*PI);g.fill()});
   layer(C.INK,(g,f)=>{swing(g,f);g.lineWidth=2;g.lineJoin='round';tagPath(g);g.stroke();
    g.lineWidth=1.4;g.beginPath();g.arc(...hole,4,0,2*PI);g.stroke();
    g.lineWidth=1;g.setLineDash([2,2.5]);g.beginPath();g.moveTo(tx+HOLE,ty+5);g.lineTo(tx+HOLE,ty+th-5);g.stroke();g.setLineDash([]);   // perforation
    g.lineWidth=1.3;g.beginPath();g.moveTo(...hole);g.bezierCurveTo(hole[0]-10,hole[1]-20,PIN[0]-20,PIN[1]+4,...PIN);g.stroke()});      // string up to the pin
   layer(C.RED,g=>{g.beginPath();g.arc(...PIN,2.6,0,2*PI);g.fill()});                                   // pin head
   const put=(g,f,how)=>{swing(g,f);g.font=`400 ${px}px ${DISPLAY}`;g.textBaseline='middle';const x=tx+HOLE+(tw-HOLE-w)/2;
    if(how==='line'){g.lineWidth=2.4;g.lineJoin='round';g.strokeText(TEXT.big,x,ty+th/2+1)}else g.fillText(TEXT.big,x,ty+th/2+1)};
   layer(C.INK,(g,f)=>put(g,f,'line'));layer(K.word,(g,f)=>put(g,f,'fill'));
   y=ty+th+14}
  if(TEXT.tail)capsLines(TEXT.tail,K.tail,y+2,30,box)};
 // style 'panel': all the lyric text inside a card like a piece of the davani: a coloured ground with gold zari
 // bands top and bottom (temple triangles), a thin gold inner frame; gold small line, big gold word with an
 // outline and offset shadow, white last line. The card sizes itself to the text and centres vertically.
 const panelStyle=(TEXT,col={})=>{const K={bg:C.PURPLE,band:C.YELLOW,small:C.YELLOW,big:C.YELLOW,shadow:C.DKGREEN,tail:C.PAPER,box:BOX,...col};
  const B=K.box,M=(B[0]+B[1])/2,inner=B[1]-B[0]-20,BAND=11,PAD=9;
  const smallRows=TEXT.small?wrapFit(TEXT.small,LABEL,700,24,inner,15):[];
  const[bpx,bw]=TEXT.big?fitPx(TEXT.big,DISPLAY,400,44,inner):[0,0];
  const tailRows=TEXT.tail?wrapFit(TEXT.tail,LABEL,700,20,inner,14):[];
  const rowsH=rows=>rows.reduce((h,[,sz])=>h+sz+3,0);
  const H=2*(BAND+PAD)+rowsH(smallRows)+(bpx?bpx*1.25+6:0)+rowsH(tailRows);
  const top=Math.max(30,Math.min(150-H/2,276-H)),card=g=>{g.beginPath();g.roundRect(B[0],top,B[1]-B[0],H,6)};
  layer(C.PAPER,g=>{card(g);g.lineWidth=8;g.stroke();g.fill()});
  layer(K.bg,g=>{card(g);g.fill()});
  layer(K.band,g=>{card(g);g.clip();g.fillRect(B[0],top,B[1]-B[0],BAND);g.fillRect(B[0],top+H-BAND,B[1]-B[0],BAND)});
  layer(C.INK,g=>{card(g);g.clip();
   for(const[yb,flip]of[[top+BAND-2,1],[top+H-BAND+2,-1]])for(let x=B[0]+5;x<B[1];x+=9){g.beginPath();g.moveTo(x-3.4,yb);g.lineTo(x,yb-6*flip);g.lineTo(x+3.4,yb);g.closePath();g.fill()}
   for(const yy of[top+3,top+H-4])for(let x=B[0]+9.5;x<B[1];x+=9){g.beginPath();g.arc(x,yy,1,0,2*PI);g.fill()}});
  layer(K.band,g=>{g.lineWidth=1.3;g.strokeRect(B[0]+5,top+BAND+3,B[1]-B[0]-10,H-2*BAND-6)});       // thin gold inner frame
  layer(C.INK,g=>{card(g);g.lineWidth=2;g.stroke();g.lineWidth=1;g.beginPath();
   for(const yy of[top+BAND,top+H-BAND]){g.moveTo(B[0],yy);g.lineTo(B[1],yy)}g.stroke()});
  let y=top+BAND+PAD;
  const rowsAt=(rows,colour)=>{for(const[t,sz,w]of rows){const x=M-w/2,yy=y;
   layer(colour,g=>{g.font=`700 ${sz}px ${LABEL}`;g.textBaseline='top';g.fillText(t,x,yy)});y+=sz+3}};
  rowsAt(smallRows,K.small);
  if(bpx){y+=3;const x=M-bw/2,yy=y,put=(g,dx,dy,how)=>{g.font=`400 ${bpx}px ${DISPLAY}`;g.textBaseline='top';g.lineJoin='round';
    if(how==='line'){g.lineWidth=3;g.strokeText(TEXT.big,x,yy)}else g.fillText(TEXT.big,x+dx,yy+dy)};
   layer(K.shadow,g=>{put(g,2.5,2.5,'fill');g.lineWidth=3;g.strokeText(TEXT.big,x+2.5,yy+2.5)});
   layer(C.INK,g=>put(g,0,0,'line'));layer(K.big,g=>put(g,0,0,'fill'));y+=bpx*1.25+3}
  rowsAt(tailRows,K.tail)};
 // style 'kolam': a swaying jasmine garland across the top, the small line in flowing script, the big word in
 // zari-embroidered letters (purple fill, thick gold outline, thin black edge) between two kolam borders (a woven
 // braid looping round a row of pulli dots), the last line in caps underneath.
 const kolamStyle=(TEXT,col={})=>{const K={small:C.PURPLE,big:C.PURPLE,zari:C.YELLOW,kolam:C.RED,tail:C.DKGREEN,flower:C.PAPER,leaf:C.DKGREEN,box:BOX,...col};
  const B=K.box,M=(B[0]+B[1])/2,room=B[1]-B[0]-8;
  // jasmine garland: a sagging string with flowers and leaves; the sag sways a little per frame
  const SAG=[16,19,13],gy=40,garland=(f,t)=>[B[0]+6+(B[1]-B[0]-12)*t,gy+SAG[f]*4*t*(1-t)];
  layer(C.INK,(g,f)=>{g.lineWidth=1;g.beginPath();for(let i=0;i<=40;i++){const[x,y]=garland(f,i/40);i?g.lineTo(x,y):g.moveTo(x,y)}g.stroke()});
  layer(K.leaf,(g,f)=>{for(let i=0;i<14;i++){const[x,y]=garland(f,(i+.5)/14);g.beginPath();g.ellipse(x,y+3,2.2,4,i%2?.6:-.6,0,2*PI);g.fill()}});
  layer(K.flower,(g,f)=>{for(let i=0;i<=14;i++){const[x,y]=garland(f,i/14);g.beginPath();g.arc(x,y,3.4,0,2*PI);g.fill()}});
  layer(C.INK,(g,f)=>{g.lineWidth=.9;for(let i=0;i<=14;i++){const[x,y]=garland(f,i/14);g.beginPath();
   for(let k=0;k<5;k++){const a=k*2*PI/5-PI/2;g.moveTo(x,y);g.lineTo(x+3.4*Math.cos(a),y+3.4*Math.sin(a))}g.stroke();g.beginPath();g.arc(x,y,3.4,0,2*PI);g.stroke()}});
  layer(K.zari,(g,f)=>{for(let i=0;i<=14;i++){const[x,y]=garland(f,i/14);g.fillRect(x-.6,y-.6,1.4,1.4)}});
  let y=gy+26;
  if(TEXT.small){for(const[t,sz,w]of wrapFit(TEXT.small,SCRIPT,400,26,room,16)){const x=M-w/2,yy=y;
    const put=(g,how)=>{g.translate(M,yy);g.rotate(-.04);g.translate(-M,-yy);g.font=`400 ${sz}px ${SCRIPT}`;g.textBaseline='top';g.lineWidth=6;g.lineJoin='round';
     how==='halo'?g.strokeText(t,x,yy):g.fillText(t,x,yy)};
    layer(C.PAPER,g=>put(g,'halo'));layer(K.small,g=>put(g,'fill'));y+=sz*1.25}}
  // kolam border: pulli dots with two braided strands weaving round them
  const kolam=yy=>{const n=Math.floor((B[1]-B[0]-16)/12),x0=M-n*6;
   layer(C.PAPER,g=>{g.fillRect(x0-6,yy-9,n*12+12,18)});
   layer(K.kolam,g=>{g.lineWidth=1.6;g.lineCap='round';for(const ph of[0,PI]){g.beginPath();
    for(let i=0;i<=n*12;i++){const x=x0+i,y=yy+6*Math.sin(i/12*PI+ph);i?g.lineTo(x,y):g.moveTo(x,y)}g.stroke()}
    for(const[ex,s]of[[x0,-1],[x0+n*12,1]]){g.beginPath();g.arc(ex+s*3,yy,5,0,2*PI);g.stroke()}});   // a loop closing each end
   layer(C.INK,g=>{for(let i=0;i<=n;i++){g.beginPath();g.arc(x0+i*12,yy,1.4,0,2*PI);g.fill()}})};
  if(TEXT.big){y+=6;kolam(y);y+=14;
   const[px,w]=fitPx(TEXT.big,DISPLAY,400,46,room-8),x=M-w/2,yy=y;
   const put=(g,how,lw)=>{g.font=`400 ${px}px ${DISPLAY}`;g.textBaseline='top';g.lineJoin='round';
    if(how==='stroke'){g.lineWidth=lw;g.strokeText(TEXT.big,x,yy)}else g.fillText(TEXT.big,x,yy)};
   layer(C.PAPER,g=>put(g,'stroke',12));                                    // breathing room
   layer(C.INK,g=>put(g,'stroke',8.5));                                     // thin black outer edge
   layer(K.zari,g=>put(g,'stroke',6));                                      // thick gold zari outline
   layer(K.big,g=>put(g,'fill'));                                           // purple letters
   y+=px*1.2+8;kolam(y);y+=14}
  if(TEXT.tail)capsLines(TEXT.tail,K.tail,y,22,B)};
 // style 'wave': jasmine garland + script small line (as 'kolam'), then the big word riding a waving silk ribbon:
 // the ribbon flows in a sine wave with gold zari edges and frayed ends, each letter sits on the curve and tilts
 // with it, and the wave ripples across the 3 frames. The last line goes in a clean white badge, bold and readable.
 const waveStyle=(TEXT,col={})=>{const K={small:C.PURPLE,ribbon:C.PURPLE,zari:C.YELLOW,word:C.YELLOW,tail:C.DKGREEN,flower:C.PAPER,leaf:C.DKGREEN,box:BOX,...col};
  const B=K.box,M=(B[0]+B[1])/2,room=B[1]-B[0]-8;
  const SAG=[16,19,13],gy=40,garland=(f,t)=>[B[0]+6+(B[1]-B[0]-12)*t,gy+SAG[f]*4*t*(1-t)];
  layer(C.INK,(g,f)=>{g.lineWidth=1;g.beginPath();for(let i=0;i<=40;i++){const[x,y]=garland(f,i/40);i?g.lineTo(x,y):g.moveTo(x,y)}g.stroke()});
  layer(K.leaf,(g,f)=>{for(let i=0;i<14;i++){const[x,y]=garland(f,(i+.5)/14);g.beginPath();g.ellipse(x,y+3,2.2,4,i%2?.6:-.6,0,2*PI);g.fill()}});
  layer(K.flower,(g,f)=>{for(let i=0;i<=14;i++){const[x,y]=garland(f,i/14);g.beginPath();g.arc(x,y,3.4,0,2*PI);g.fill()}});
  layer(C.INK,(g,f)=>{g.lineWidth=.9;for(let i=0;i<=14;i++){const[x,y]=garland(f,i/14);g.beginPath();
   for(let k=0;k<5;k++){const a=k*2*PI/5-PI/2;g.moveTo(x,y);g.lineTo(x+3.4*Math.cos(a),y+3.4*Math.sin(a))}g.stroke();g.beginPath();g.arc(x,y,3.4,0,2*PI);g.stroke()}});
  layer(K.zari,(g,f)=>{for(let i=0;i<=14;i++){const[x,y]=garland(f,i/14);g.fillRect(x-.6,y-.6,1.4,1.4)}});
  let y=gy+26;
  if(TEXT.small){for(const[t,sz,w]of wrapFit(TEXT.small,SCRIPT,400,26,room,16)){const x=M-w/2,yy=y;
    const put=(g,how)=>{g.translate(M,yy);g.rotate(-.04);g.translate(-M,-yy);g.font=`400 ${sz}px ${SCRIPT}`;g.textBaseline='top';g.lineWidth=6;g.lineJoin='round';
     how==='halo'?g.strokeText(t,x,yy):g.fillText(t,x,yy)};
    layer(C.PAPER,g=>put(g,'halo'));layer(K.small,g=>put(g,'fill'));y+=sz*1.25}}
  if(TEXT.big){
   const parts=graphemes(TEXT.big),font=s=>`700 ${s}px 'Noto Sans Tamil','Anton'`;
   const k=document.createElement('canvas').getContext('2d');let px=34;k.font=font(px);
   let ws=parts.map(c=>k.measureText(c).width),tot=ws.reduce((a,b)=>a+b,0);
   const span=B[1]-B[0]-34;if(tot>span){px=Math.floor(px*span/tot);k.font=font(px);ws=parts.map(c=>k.measureText(c).width);tot=ws.reduce((a,b)=>a+b,0)}
   const H=px*1.15,yc=y+H/2+8,A=6,L=B[1]-B[0],PH=[0,.5,1];                 // ribbon height, centre line, wave amplitude, phase per frame
   const wy=(x,f)=>yc+A*Math.sin((x-B[0])/L*2*PI*1.1+PH[f]);
   const slope=(x,f)=>A*Math.cos((x-B[0])/L*2*PI*1.1+PH[f])*(2*PI*1.1/L);
   const ribbon=(g,f)=>{g.beginPath();for(let x=B[0];x<=B[1];x+=2){const yy=wy(x,f)-H/2;x===B[0]?g.moveTo(x,yy):g.lineTo(x,yy)}
    for(let x=B[1];x>=B[0];x-=2)g.lineTo(x,wy(x,f)+H/2);g.closePath()};
   const edge=(g,f,o)=>{g.beginPath();for(let x=B[0]+2;x<=B[1]-2;x+=2){const yy=wy(x,f)+o;x===B[0]+2?g.moveTo(x,yy):g.lineTo(x,yy)}g.stroke()};
   layer(C.PAPER,(g,f)=>{ribbon(g,f);g.lineWidth=8;g.lineJoin='round';g.stroke();g.fill()});
   layer(K.ribbon,(g,f)=>{ribbon(g,f);g.fill()});
   layer(K.zari,(g,f)=>{g.lineWidth=3;edge(g,f,-H/2+2.5);edge(g,f,H/2-2.5)});                         // gold zari edges
   layer(C.INK,(g,f)=>{ribbon(g,f);g.lineWidth=1.6;g.stroke();
    for(let x=B[0]+6;x<B[1]-4;x+=7)for(const o of[-H/2+2.5,H/2-2.5]){g.beginPath();g.arc(x,wy(x,f)+o,.7,0,2*PI);g.fill()}    // woven dots on the zari
    g.lineWidth=1;for(const[x0,s]of[[B[0],-1],[B[1],1]])for(let k=-3;k<=3;k++){const yy=wy(x0,f)+k*H/7;
     g.beginPath();g.moveTo(x0,yy);g.lineTo(x0+s*5,yy+k*.6+(f-1)*.6);g.stroke()}});                                     // frayed tassel ends
   // letters on the wave: each grapheme centred on the curve, rotated to its slope
   const placed=(f)=>{let x=M-tot/2;return parts.map((c,i)=>{const cx=x+ws[i]/2;x+=ws[i];return[c,cx,wy(cx,f),Math.atan(slope(cx,f)),ws[i]]})};
   const draw=(g,f,how)=>{g.font=font(px);g.textBaseline='middle';g.lineJoin='round';
    for(const[c,cx,cy,a,w]of placed(f)){g.save();g.translate(cx,cy+1);g.rotate(a);
     if(how==='line'){g.lineWidth=3;g.strokeText(c,-w/2,0)}else g.fillText(c,-w/2,0);g.restore()}};
   layer(C.INK,(g,f)=>draw(g,f,'line'));layer(K.word,(g,f)=>draw(g,f,'fill'));
   y=yc+H/2+A+14}
  // last line: a clean white badge with a green border, bold Tamil, up to two rows
  if(TEXT.tail){const rows=wrapFit(TEXT.tail,"'Noto Sans Tamil','Bebas Neue'",700,21,room-16,16);
   const rh=rows.reduce((h,[,sz])=>h+sz*1.35,0),bw=Math.max(...rows.map(r=>r[2]))+20,bx=M-bw/2,by=y;
   layer(C.PAPER,g=>{g.beginPath();g.roundRect(bx,by,bw,rh+10,8);g.fill()});
   layer(K.tail,g=>{g.lineWidth=2;g.beginPath();g.roundRect(bx,by,bw,rh+10,8);g.stroke()});
   let yy=by+5;for(const[t,sz,w]of rows){const ty=yy;layer(K.tail,g=>{g.font=`700 ${sz}px 'Noto Sans Tamil','Bebas Neue'`;g.textBaseline='top';g.fillText(t,M-w/2,ty)});yy+=sz*1.35}}};
 // style 'bubble': the whole lyric inside a comic speech bubble whose tail points at the speaker (colors.point),
 // bouncing a pixel per frame. Small line in condensed caps, big word bold with an outline + shadow, last line below.
 const bubbleStyle=(TEXT,col={})=>{const K={small:C.BLUE,big:C.RED,shadow:C.YELLOW,tail:C.BLUE,point:[140,150],box:BOX,...col};
  const B=K.box,M=(B[0]+B[1])/2,inner=B[1]-B[0]-26,PAD=12,BOB=[0,-2,1];
  const smallRows=TEXT.small?wrapFit(TEXT.small,LABEL,700,24,inner,15):[];
  const[bpx,bw]=TEXT.big?fitPx(TEXT.big,DISPLAY,400,46,inner):[0,0];
  const tailRows=TEXT.tail?wrapFit(TEXT.tail,LABEL,700,20,inner,14):[];
  const rowsH=rows=>rows.reduce((h,[,sz])=>h+sz+3,0);
  const H=2*PAD+rowsH(smallRows)+(bpx?bpx*1.2+6:0)+rowsH(tailRows),top0=Math.max(40,Math.min(150-H/2,270-H));
  const bubble=(g,f)=>{const top=top0+BOB[f],[px,py]=K.point;g.beginPath();g.roundRect(B[0],top,B[1]-B[0],H,18);
   const ty=Math.min(top+H-14,Math.max(top+14,py));g.moveTo(B[0]+2,ty-10);g.lineTo(px,py);g.lineTo(B[0]+2,ty+6)};
  layer(C.INK,(g,f)=>{bubble(g,f);g.lineWidth=7;g.lineJoin='round';g.stroke()});                      // thick comic outline
  layer(C.PAPER,(g,f)=>{bubble(g,f);g.fill();g.lineWidth=2.4;g.stroke()});
  layer(C.INK,(g,f)=>{g.lineWidth=1.6;g.lineCap='round';const top=top0+BOB[f];                         // two little shine ticks in the corner
   g.beginPath();g.arc(B[1]-16,top+16,7,-PI*.45,-PI*.1);g.stroke()});
  const rowsAt=(rows,colour,y0)=>{let y=y0;for(const[t,sz,w]of rows){const x=M-w/2,yy=y;
   layer(colour,(g,f)=>{g.font=`700 ${sz}px ${LABEL}`;g.textBaseline='top';g.fillText(t,x,yy+BOB[f])});y+=sz+3}return y};
  let y=rowsAt(smallRows,K.small,top0+PAD);
  if(bpx){y+=3;const x=M-bw/2,yy=y,put=(g,f,dx,dy,how)=>{g.font=`400 ${bpx}px ${DISPLAY}`;g.textBaseline='top';g.lineJoin='round';
    if(how==='line'){g.lineWidth=3;g.strokeText(TEXT.big,x,yy+BOB[f])}else g.fillText(TEXT.big,x+dx,yy+BOB[f]+dy)};
   layer(K.shadow,(g,f)=>{put(g,f,3,3,'fill');g.lineWidth=3;g.strokeText(TEXT.big,x+3,yy+BOB[f]+3)});
   layer(C.INK,(g,f)=>put(g,f,0,0,'line'));layer(K.big,(g,f)=>put(g,f,0,0,'fill'));y+=bpx*1.2+3}
  rowsAt(tailRows,K.tail,y)};
 // style 'heart': small line in clean condensed caps (centred, wraps), the big word in white letters inside a big
 // red heart with a pink offset outline that pulses per frame, the last line in caps underneath.
 const heartStyle=(TEXT,col={})=>{const K={small:C.INK,heart:C.RED,rim:C.PINK,word:C.PAPER,tail:C.PINK,box:BOX,...col};
  const B=K.box,M=(B[0]+B[1])/2;let y=78;
  if(TEXT.small)y=capsLines(TEXT.small,K.small,y,28,B)+6;
  if(TEXT.big){const SC=[1,1.06,.97],hw=Math.min(66,(B[1]-B[0])/2-6),hh=hw*1.05,cy=y+hh*.55;
   const heart=(g,f,grow=0)=>{const s=SC[f],w=(hw+grow)*s,h=(hh+grow)*s;g.beginPath();g.moveTo(M,cy+h*.62);
    g.bezierCurveTo(M-w*1.1,cy+h*.02,M-w*.95,cy-h*.75,M,cy-h*.32);g.bezierCurveTo(M+w*.95,cy-h*.75,M+w*1.1,cy+h*.02,M,cy+h*.62);g.closePath()};
   layer(C.PAPER,(g,f)=>{heart(g,f,6);g.fill()});
   layer(K.rim,(g,f)=>{g.save();g.translate(4,4);heart(g,f);g.fill();g.restore()});
   layer(K.heart,(g,f)=>{heart(g,f);g.fill()});
   layer(C.INK,(g,f)=>{heart(g,f);g.lineWidth=2.2;g.lineJoin='round';g.stroke()});
   layer(C.PAPER,(g,f)=>{g.lineWidth=2.4;g.lineCap='round';g.beginPath();g.arc(M-hw*.45*SC[f],cy-hh*.3*SC[f],hw*.22,PI*1.05,PI*1.5);g.stroke()});   // shine
   const[px,w]=fitPx(TEXT.big,DISPLAY,400,40,hw*1.35),x=M-w/2,ty=cy-px*.42;
   const put=(g,f,how)=>{g.font=`400 ${px}px ${DISPLAY}`;g.textBaseline='top';g.lineJoin='round';
    if(how==='line'){g.lineWidth=3;g.strokeText(TEXT.big,x,ty)}else g.fillText(TEXT.big,x,ty)};
   layer(C.INK,(g,f)=>put(g,f,'line'));layer(K.word,(g,f)=>put(g,f,'fill'));
   y=cy+hh*.75+8}
  if(TEXT.tail)capsLines(TEXT.tail,K.tail,y,22,B)};
 // style 'candy': small line in clean caps, the big word in fat bubble letters (Luckiest Guy for Latin) filled white
 // with diagonal candy stripes, thick black outline and an offset shadow, sugar sparkles twinkling round it;
 // last line in caps between two little crystal ornaments.
 const CANDY="'Luckiest Guy','Noto Sans Tamil'";
 const candyStyle=(TEXT,col={})=>{const K={small:C.PINK,stripe:C.PINK,fill:C.PAPER,shadow:C.CYAN,tail:C.PURPLE,box:BOX,...col};
  const B=K.box,M=(B[0]+B[1])/2,room=B[1]-B[0]-12;let y=80;
  if(TEXT.small)y=capsLines(TEXT.small,K.small,y,28,B)+6;
  if(TEXT.big){const[px,w]=fitPx(TEXT.big,CANDY,400,48,room-22),x=M-w/2,yy=y,tilt=-.05,cy=yy+px*.5;
   const put=(g,dx,dy,how,lw)=>{g.translate(M,cy);g.rotate(tilt);g.translate(-M,-cy);g.font=`400 ${px}px ${CANDY}`;g.textBaseline='top';g.lineJoin='round';
    if(how==='stroke'){g.lineWidth=lw;g.strokeText(TEXT.big,x+dx,yy+dy)}else g.fillText(TEXT.big,x+dx,yy+dy)};
   layer(C.PAPER,g=>put(g,0,0,'stroke',12));
   layer(K.shadow,g=>{put(g,4,4,'fill');put(g,4,4,'stroke',7)});                         // offset shadow
   layer(C.INK,g=>put(g,0,0,'stroke',7));                                                  // thick outline
   layer(K.fill,g=>put(g,0,0,'fill'));
   layer(K.stripe,g=>{const k=document.createElement('canvas');k.width=512;k.height=342;const m=k.getContext('2d');
    m.save();m.translate(M,cy);m.rotate(.7);for(let i=-400;i<400;i+=10)m.fillRect(i,-400,4,800);m.restore();   // all the stripes
    m.globalCompositeOperation='destination-in';m.save();put(m,0,0,'fill');m.restore();     // keep them only inside the letters
    g.drawImage(k,0,0)});                                                                   // candy stripes
   const SP=[[[x-8,yy+4],[x+w+6,yy+px*.2],[M,yy+px*1.15]],[[x-4,yy+px*.8],[x+w+2,yy+px*.9],[M+w*.3,yy-6]],[[x+w*.2,yy-6],[x+w+8,yy+px*.5],[x-10,yy+px*.4]]];
   const crystal=(g,x0,y0,s)=>{g.beginPath();g.moveTo(x0,y0-s*1.4);g.lineTo(x0+s,y0);g.lineTo(x0,y0+s*1.4);g.lineTo(x0-s,y0);g.closePath()};
   layer(C.PAPER,(g,f)=>{for(const[a,b]of SP[f]){crystal(g,a,b,4);g.fill()}});
   layer(C.INK,(g,f)=>{g.lineWidth=1;for(const[a,b]of SP[f]){crystal(g,a,b,4);g.stroke();for(const t of[0,PI/2]){g.beginPath();g.moveTo(a-9*Math.cos(t),b-9*Math.sin(t));g.lineTo(a+9*Math.cos(t),b+9*Math.sin(t));g.stroke()}}});
   y=yy+px*1.3+6}
  if(TEXT.tail){const rows=wrapFit(TEXT.tail,LABEL,700,28,room-40,16),yEnd=capsLines(TEXT.tail,K.tail,y,28,B);
   const w=Math.max(...rows.map(r=>r[2])),ym=(y+yEnd)/2-2;
   layer(C.PAPER,g=>{for(const s of[-1,1]){const cx=M+s*(w/2+14);g.beginPath();g.moveTo(cx,ym-7);g.lineTo(cx+5,ym);g.lineTo(cx,ym+7);g.lineTo(cx-5,ym);g.closePath();g.fill()}});
   layer(C.INK,g=>{g.lineWidth=1.2;for(const s of[-1,1]){const cx=M+s*(w/2+14);g.beginPath();g.moveTo(cx,ym-7);g.lineTo(cx+5,ym);g.lineTo(cx,ym+7);g.lineTo(cx-5,ym);g.closePath();g.stroke()}})}};
 // style 'jasmine': small line in caps; the big word in white "petal" letters with a thick green outline and a leaf
 // shadow; a string of round jasmine buds with leaves arcing under it, swinging a little per frame; last line below.
 const jasmineStyle=(TEXT,col={})=>{const K={small:C.DKGREEN,word:C.PAPER,line:C.DKGREEN,shadow:C.GREEN,tail:C.DKGREEN,box:BOX,...col};
  const B=K.box,M=(B[0]+B[1])/2,room=B[1]-B[0]-14;let y=82;
  if(TEXT.small)y=capsLines(TEXT.small,K.small,y,28,B)+6;
  if(TEXT.big){const[px,w]=fitPx(TEXT.big,DISPLAY,400,52,room),x=M-w/2,yy=y;
   const put=(g,dx,dy,how,lw)=>{g.font=`400 ${px}px ${DISPLAY}`;g.textBaseline='top';g.lineJoin='round';
    if(how==='stroke'){g.lineWidth=lw;g.strokeText(TEXT.big,x+dx,yy+dy)}else g.fillText(TEXT.big,x+dx,yy+dy)};
   layer(C.PAPER,g=>put(g,0,0,'stroke',12));
   layer(K.shadow,g=>{put(g,3,4,'fill');put(g,3,4,'stroke',6)});
   layer(K.line,g=>put(g,0,0,'stroke',6));
   layer(K.word,g=>put(g,0,0,'fill'));
   y=yy+px*1.25;
   // jasmine string under the word
   const SAG=[10,13,8],n=13,pt=(f,t)=>[B[0]+10+(B[1]-B[0]-20)*t,y+4+SAG[f]*4*t*(1-t)];
   layer(K.line,(g,f)=>{g.lineWidth=1;g.beginPath();for(let i=0;i<=30;i++){const[a,b]=pt(f,i/30);i?g.lineTo(a,b):g.moveTo(a,b)}g.stroke()});
   layer(K.shadow,(g,f)=>{for(const t of[0,1]){const[a,b]=pt(f,t);for(const s of[-1,1]){g.beginPath();g.ellipse(a+s*5,b+3,2.6,5,s*.7,0,2*PI);g.fill()}}
    for(let i=1;i<n;i+=2){const[a,b]=pt(f,i/n);g.beginPath();g.ellipse(a+3,b+5,1.6,2.8,.6,0,2*PI);g.fill()}});
   layer(C.PAPER,(g,f)=>{for(let i=1;i<n;i++){const[a,b]=pt(f,i/n);g.beginPath();g.arc(a,b,4.2,0,2*PI);g.fill()}});
   layer(C.INK,(g,f)=>{g.lineWidth=1;for(let i=1;i<n;i++){const[a,b]=pt(f,i/n);g.beginPath();g.arc(a,b,4.2,0,2*PI);g.stroke();
    g.beginPath();g.moveTo(a-1.6,b-.6);g.quadraticCurveTo(a,b+1.4,a+1.6,b-.6);g.stroke()}});
   y+=SAG[0]+18}
  if(TEXT.tail)capsLines(TEXT.tail,K.tail,y,24,B)};
 // style 'royal': small line in gold caps; the big word in bold gold letters with a thick purple outline and a dark
 // shadow, a little crown perched on top and a gold flourish with gems beneath; last line below. Fit for a queen.
 const royalStyle=(TEXT,col={})=>{const K={small:C.YELLOW,word:C.YELLOW,outline:C.PURPLE,shadow:C.INK,gem:C.RED,tail:C.YELLOW,box:BOX,...col};
  const B=K.box,M=(B[0]+B[1])/2,room=B[1]-B[0]-10;let y=82;
  if(TEXT.small)y=capsLines(TEXT.small,K.small,y,26,B)+8;
  if(TEXT.big){const[px,w]=fitPx(TEXT.big,DISPLAY,400,50,room-6),x=M-w/2,ty=y+20;
   const put=(g,dx,dy,how,lw)=>{g.font=`400 ${px}px ${DISPLAY}`;g.textBaseline='top';g.lineJoin='round';
    if(how==='stroke'){g.lineWidth=lw;g.strokeText(TEXT.big,x+dx,ty+dy)}else g.fillText(TEXT.big,x+dx,ty+dy)};
   const maskBand=(colour,y0,y1)=>layer(colour,g=>{const k=document.createElement('canvas');k.width=512;k.height=342;const m=k.getContext('2d');
    m.fillStyle='#000';put(m,0,0,'fill');m.globalCompositeOperation='destination-in';m.fillRect(0,y0,512,y1-y0);g.drawImage(k,0,0)});
   // a bigger crown, centred over the whole word
   const cw=15,cb=ty-2,ct=ty-20;const crown=g=>{g.beginPath();g.moveTo(M-cw,cb);g.lineTo(M-cw,ct+7);g.lineTo(M-cw/2,ct+11);g.lineTo(M-cw/2,ct+3);
    g.lineTo(M,ct);g.lineTo(M+cw/2,ct+3);g.lineTo(M+cw/2,ct+11);g.lineTo(M+cw,ct+7);g.lineTo(M+cw,cb);g.closePath()};
   layer(C.PAPER,g=>{crown(g);g.lineWidth=6;g.lineJoin='round';g.stroke()});
   layer(K.word,g=>{crown(g);g.fill()});
   layer(K.gem,g=>{for(const[dx,dy]of[[0,-16],[-cw,-11],[cw,-11]])g.fillRect(M+dx-1,ty+dy-1,2,2)});
   layer(C.INK,g=>{crown(g);g.lineWidth=1.6;g.lineJoin='round';g.stroke();g.beginPath();g.moveTo(M-cw,cb-4);g.lineTo(M+cw,cb-4);g.stroke()});
   // metallic word: dark shadow, fat outline, gold, a darker lower band, a bright top sliver
   layer(C.PAPER,g=>put(g,0,0,'stroke',13));
   layer(K.shadow,g=>{put(g,4,5,'fill');put(g,4,5,'stroke',6)});
   layer(K.outline,g=>put(g,0,0,'stroke',6.5));
   layer(K.word,g=>put(g,0,0,'fill'));
   maskBand(C.ORANGE,ty+px*0.5,ty+px*1.15);                 // shaded lower half -> metallic depth
   maskBand(C.PAPER,ty+px*0.14,ty+px*0.28);                 // bright highlight sliver near the top
   // sleek underline: a thin double gold line with a gem and a star at each end
   y=ty+px*1.22+6;
   layer(K.word,g=>{g.lineWidth=2.2;g.lineCap='round';for(const o of[0,3]){g.beginPath();g.moveTo(B[0]+22,y+o);g.lineTo(B[1]-22,y+o);g.stroke()}});
   const star=(g,cx,cyy,r)=>{g.beginPath();for(let k=0;k<10;k++){const a=k*PI/5-PI/2,rr=k%2?r*.42:r;k?g.lineTo(cx+rr*Math.cos(a),cyy+rr*Math.sin(a)):g.moveTo(cx+rr*Math.cos(a),cyy+rr*Math.sin(a))}g.closePath()};
   layer(K.word,g=>{for(const gx of[B[0]+14,B[1]-14])star(g,gx,y+1.5,5)});
   layer(C.INK,g=>{g.lineWidth=.9;for(const gx of[B[0]+14,B[1]-14])star(g,gx,y+1.5,5),g.stroke()});
   layer(K.gem,g=>{g.beginPath();g.moveTo(M,y-3);g.lineTo(M+3,y+1.5);g.lineTo(M,y+6);g.lineTo(M-3,y+1.5);g.closePath();g.fill()});
   y+=14}
  if(TEXT.tail)capsLines(TEXT.tail,K.tail,y,24,B)};
 // style 'mystic': small line in cyan caps; the big word in white letters with a purple outline and a cyan outer
 // glow, sparkle-stars twinkling around it (per frame) and a crescent moon accent; last line below.
 const mysticStyle=(TEXT,col={})=>{const K={small:C.CYAN,word:C.PAPER,outline:C.PURPLE,glow:C.CYAN,star:C.YELLOW,tail:C.CYAN,box:BOX,...col};
  const B=K.box,M=(B[0]+B[1])/2,room=B[1]-B[0]-10;let y=84;
  if(TEXT.small)y=capsLines(TEXT.small,K.small,y,26,B)+8;
  if(TEXT.big){
   // a long word is split onto two stacked lines (at a space, or near the middle of a single token) so it stays big
   let lines=[TEXT.big];const one=fitPx(TEXT.big,DISPLAY,400,50,room)[0];
   if(one<36){const parts=TEXT.big.split(/\s+/).filter(Boolean);
    if(parts.length>1){let best=1,sc=1e9;for(let i=1;i<parts.length;i++){const d=Math.abs(measure(parts.slice(0,i).join(' '),30)-measure(parts.slice(i).join(' '),30));if(d<sc){sc=d;best=i}}
     lines=[parts.slice(0,best).join(' '),parts.slice(best).join(' ')];}
    else{const h=Math.ceil(TEXT.big.length/2);lines=[TEXT.big.slice(0,h),TEXT.big.slice(h)];}}
   let px=50;for(const ln of lines)px=Math.min(px,fitPx(ln,DISPLAY,400,50,room)[0]);
   let ly=y;
   for(const ln of lines){const w=fitPx(ln,DISPLAY,400,px,1e9)[1],x=M-w/2,ty=ly;
    const put=(g,how,lw)=>{g.font=`400 ${px}px ${DISPLAY}`;g.textBaseline='top';g.lineJoin='round';
     if(how==='stroke'){g.lineWidth=lw;g.strokeText(ln,x,ty)}else g.fillText(ln,x,ty)};
    layer(K.glow,g=>put(g,'stroke',11));      // cyan aura
    layer(C.PAPER,g=>put(g,'stroke',7));       // white gap
    layer(K.outline,g=>put(g,'stroke',5));     // purple outline
    layer(K.word,g=>put(g,'fill'));            // clean white letters
    ly+=px*1.08;}
   // crescent moon to the left and sparkle-stars around the block
   layer(K.star,(g,f)=>{g.save();g.beginPath();g.arc(B[0]+6,y-2,8,0,2*PI);g.fill();g.globalCompositeOperation='destination-out';g.beginPath();g.arc(B[0]+10,y-4,7,0,2*PI);g.fill();g.restore()});
   const spark=(g,cx,cyy,r)=>{g.lineWidth=1.4;g.lineCap='round';for(const a of[0,PI/2,PI/4,3*PI/4]){const rr=a%(PI/2)?r*.5:r;
    g.beginPath();g.moveTo(cx-rr*Math.cos(a),cyy-rr*Math.sin(a));g.lineTo(cx+rr*Math.cos(a),cyy+rr*Math.sin(a));g.stroke()}};
   const SP=[[[B[0]+2,y+6,5],[B[1]-8,y-2,4],[B[1]-20,ly-8,5]],[[B[0]+10,ly-12,4],[B[1]-4,(y+ly)/2,5],[B[0]+16,y-4,4]],[[M,y-8,5],[B[0]+2,(y+ly)/2,4],[B[1]-6,ly-6,4]]];
   layer(K.star,(g,f)=>{for(const[cx,cyy,r]of SP[f]){g.beginPath();g.arc(cx,cyy,1,0,2*PI);g.fill();spark(g,cx,cyy,r)}});
   y=ly+6}
  if(TEXT.tail)capsLines(TEXT.tail,K.tail,y,24,B)};
 // lyric(TEXT, 'arc' | 'poster' | {style, colors})
 const lyric=(TEXT,opt='arc')=>{const o=typeof opt==='string'?{style:opt}:opt;
  return o.style==='mystic'?mysticStyle(TEXT,o.colors):o.style==='royal'?royalStyle(TEXT,o.colors):o.style==='jasmine'?jasmineStyle(TEXT,o.colors):o.style==='candy'?candyStyle(TEXT,o.colors):o.style==='heart'?heartStyle(TEXT,o.colors):o.style==='bubble'?bubbleStyle(TEXT,o.colors):o.style==='wave'?waveStyle(TEXT,o.colors):o.style==='kolam'?kolamStyle(TEXT,o.colors):o.style==='panel'?panelStyle(TEXT,o.colors):o.style==='tag'?tagStyle(TEXT,o.colors):o.style==='banner'?bannerStyle(TEXT,o.colors):o.style==='script'?scriptStyle(TEXT,o.colors):o.style==='poster'||o.style==='sticker'?posterStyle(TEXT,o.colors):arcStyle(TEXT)};

 // ---- backgrounds: halftone dots that grow away from a calm spot, plus a wobbly double border ----
 const backdrop=({color=C.CYAN,calm=[180,150],step=9,max=2.2,border=true}={})=>{
  layer(color,g=>{const far=Math.hypot(260,170);
   for(let y=OY+4;y<OY+H;y+=step)for(let x=OX+4+((y/step|0)%2)*step/2;x<OX+W;x+=step){
    const r=max*Math.min(1,Math.pow(Math.hypot(x-calm[0],y-calm[1])/far,2)*2.2);
    if(r>1){g.beginPath();g.arc(x,y,r,0,2*PI);g.fill()}}});
  if(border)layer(C.INK,g=>{g.lineWidth=1.6;for(const m of[6,10]){g.beginPath();g.roundRect(OX+m,OY+m,W-2*m,H-2*m,8);g.stroke()}})};
 const show=()=>{for(let i=0;i<6;i++)tick();sync()};
 return{frames,layer,backdrop,clear,bez,normal,trace,lyric,show,C,PI,rnd,W,H,OX,OY};
};
