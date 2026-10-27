// Paste into the devtools console of WigglyPaint (served from http://localhost, on the "main" card).
// Drives Decker with synthetic mouse events and steps its loop by hand, so it works even when
// the tab isn't painting. Coordinates are in deck pixels (512x342).
const fire=(type,x,y)=>{const c=document.querySelector('#display').getBoundingClientRect(),z=c.width/512;
 document.body.dispatchEvent(new MouseEvent(type,{bubbles:true,button:0,clientX:c.x+x*z+z/2,clientY:c.y+y*z+z/2}))};
const step=(n=1)=>{for(let i=0;i<n;i++)tick();sync()};
const stroke=pts=>{fire('mousemove',...pts[0]);step();fire('mousedown',...pts[0]);step();
 for(const p of pts.slice(1)){fire('mousemove',...p);step()}fire('mouseup',...pts.at(-1));step(3)};
const tap=(x,y)=>{stroke([[x,y]]);step(5)};
const R=Math.round,cx=182,cy=160,A=78,B=82;
const dense=(pts,s=2)=>{const o=[pts[0]];for(let i=1;i<pts.length;i++){const[x0,y0]=pts[i-1],[x1,y1]=pts[i],
 n=Math.max(1,Math.ceil(Math.hypot(x1-x0,y1-y0)/s));for(let k=1;k<=n;k++)o.push([R(x0+(x1-x0)*k/n),R(y0+(y1-y0)*k/n)])}return o};
const TOOL={pen:[470,58],pink:[470,165],cyan:[470,198],yellow:[470,232]};

// apple outline: ellipse with dimples at the top and bottom
const apple=t=>{let x=cx+A*Math.sin(t)*(1+0.06*Math.cos(2*t)),y=cy-B*Math.cos(t);
 y+=24*Math.exp(-(t**2)*6)+24*Math.exp(-((t-2*Math.PI)**2)*6);y-=10*Math.exp(-((t-Math.PI)**2)*10);return[R(x),R(y)]};
const outline=[];for(let i=0;i<=160;i++)outline.push(apple(i/160*2*Math.PI));
const leaf=t=>[R(cx+10+38*t),R(cy-B+18-22*Math.sin(Math.PI*t)-10*t)],
      leaf2=t=>[R(cx+10+38*t),R(cy-B+18+4*Math.sin(Math.PI*t)-10*t)];

// markers stamp per mouse position, so every path goes through dense()
tap(...TOOL.pink);
const fill=[];for(let y=cy-58;y<=cy+68;y+=6){const w=Math.sqrt(Math.max(0,1-((y-cy+4)/78)**2))*A*0.9;fill.push([R(cx-w),y],[R(cx+w),y])}
stroke(dense(fill,3));
const lf=[];for(let i=0;i<=10;i++)lf.push(leaf(i/10),leaf2(i/10));
tap(...TOOL.cyan);stroke(dense(lf));tap(...TOOL.yellow);stroke(dense(lf));
tap(...TOOL.pen);
stroke(dense(outline));
stroke(dense([[cx,cy-B+26],[cx-2,cy-B+10],[cx-1,cy-B-4],[cx+4,cy-B-18]]));            // stem
const lo=[];for(let i=0;i<=20;i++)lo.push(leaf(i/20));for(let i=20;i>=0;i--)lo.push(leaf2(i/20));
stroke(dense(lo));stroke(dense([[cx+12,cy-B+17],[cx+46,cy-B+5]]));                    // leaf + vein
const shine=[];for(let i=0;i<=12;i++){const t=Math.PI*(1.15+0.35*i/12);shine.push([R(cx+A*0.62*Math.cos(t)),R(cy-6+B*0.62*Math.sin(t))])}
stroke(dense(shine));step(10);
