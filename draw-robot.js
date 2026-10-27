// Original boxy robot for WigglyPaint. Paste into the devtools console on the "main" card.
// Same driver as draw-apple.js: synthetic mouse events + hand-stepped Decker loop.
{
const fire=(type,x,y)=>{const c=document.querySelector('#display').getBoundingClientRect(),z=c.width/512;
 document.body.dispatchEvent(new MouseEvent(type,{bubbles:true,button:0,clientX:c.x+x*z+z/2,clientY:c.y+y*z+z/2}))};
const step=(n=1)=>{for(let i=0;i<n;i++)tick();sync()};
const stroke=pts=>{fire('mousemove',...pts[0]);step();fire('mousedown',...pts[0]);step();
 for(const p of pts.slice(1)){fire('mousemove',...p);step()}fire('mouseup',...pts.at(-1));step(3)};
const tap=(x,y)=>{stroke([[x,y]]);step(5)};
const R=Math.round,PI=Math.PI;
const dense=(pts,s=2)=>{const o=[pts[0]];for(let i=1;i<pts.length;i++){const[x0,y0]=pts[i-1],[x1,y1]=pts[i],
 n=Math.max(1,Math.ceil(Math.hypot(x1-x0,y1-y0)/s));for(let k=1;k<=n;k++)o.push([R(x0+(x1-x0)*k/n),R(y0+(y1-y0)*k/n)])}return o};
const arc=(cx,cy,rx,ry,a0,a1,n=60)=>{const o=[];for(let i=0;i<=n;i++){const t=a0+(a1-a0)*i/n;o.push([R(cx+rx*Math.cos(t)),R(cy+ry*Math.sin(t))])}return o};
const scrib=(cx,cy,rx,ry,gap=5)=>{const o=[];for(let y=-ry;y<=ry;y+=gap){const w=rx*Math.sqrt(1-(y/ry)**2);o.push([R(cx-w),R(cy+y)],[R(cx+w),R(cy+y)])}return dense(o,2)};
const TOOL={pen:[470,58],pink:[470,165],cyan:[470,198],yellow:[470,232]};
const cx=182;
const dot=(x,y)=>stroke([[R(x),R(y)],[R(x)+1,R(y)]]);
const box=(x0,y0,x1,y1,r=6)=>{const o=[];const c=(x,y,a)=>{for(let i=0;i<=6;i++){const t=a+PI/2*i/6;o.push([R(x+r*Math.cos(t)),R(y+r*Math.sin(t))])}};
 c(x1-r,y0+r,-PI/2);c(x1-r,y1-r,0);c(x0+r,y1-r,PI/2);c(x0+r,y0+r,PI);o.push(o[0]);return dense(o)};
const fillBox=(x0,y0,x1,y1,gap=6)=>{const o=[];for(let y=y0+5;y<=y1-5;y+=gap)o.push([x0+5,y],[x1-5,y]);stroke(dense(o,2))};
const ell=(x,y,rx,ry,a0=0,a1=2*PI,n=40)=>{const o=[];for(let i=0;i<=n;i++){const t=a0+(a1-a0)*i/n;o.push([R(x+rx*Math.cos(t)),R(y+ry*Math.sin(t))])}return dense(o)};

// colour: cyan head + body, yellow screen glow, pink antenna bulb & cheeks
tap(...TOOL.cyan);   fillBox(cx-48,62,cx+48,138); fillBox(cx-38,152,cx+38,232);
tap(...TOOL.yellow); fillBox(cx-24,170,cx+24,200,5);
tap(...TOOL.pink);   dot(cx,36); dot(cx-30,120); dot(cx+30,120);

tap(...TOOL.pen);
stroke(box(cx-48,62,cx+48,138,10));                  // head
stroke(box(cx-38,152,cx+38,232,8));                  // body
stroke(dense([[cx-10,138],[cx-10,152]]));stroke(dense([[cx+10,138],[cx+10,152]]));   // neck
stroke(dense([[cx,62],[cx,44]])); stroke(ell(cx,36,7,7));                             // antenna
stroke(ell(cx-20,96,11,11)); stroke(ell(cx+20,96,11,11));                             // eyes
dot(cx-18,98); dot(cx+22,98);
stroke(dense([[cx-14,122],[cx-7,127],[cx,122],[cx+7,127],[cx+14,122]]));             // zigzag mouth
stroke(box(cx-24,170,cx+24,200,4));                  // chest screen
stroke(dense([[cx-16,186],[cx-8,178],[cx,192],[cx+8,180],[cx+16,186]]));             // heartbeat line
stroke(dense([[cx-38,165],[cx-62,190],[cx-58,212]])); stroke(ell(cx-58,218,6,6));   // arms
stroke(dense([[cx+38,165],[cx+60,150],[cx+70,128]])); stroke(ell(cx+72,122,6,6));   // waving
stroke(dense([[cx-20,232],[cx-20,256]])); stroke(dense([[cx-32,258],[cx-10,258]]));  // legs
stroke(dense([[cx+20,232],[cx+20,256]])); stroke(dense([[cx+10,258],[cx+32,258]]));
stroke(dense([[cx-62,60],[cx-56,70]])); stroke(dense([[cx+62,60],[cx+56,70]]));      // sparkle ticks
step(10);
}
