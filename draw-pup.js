// Original cartoon pup for WigglyPaint. Paste into the devtools console on the "main" card.
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
const hx=182,hy=112,hr=54;                        // head centre / radius
const dot=(x,y)=>stroke([[R(x),R(y)],[R(x)+1,R(y)]]);            // one marker dab
const fillEllipse=(cx,cy,rx,ry,gap=6)=>{const o=[];for(let y=-ry;y<=ry;y+=gap){const w=rx*Math.sqrt(1-(y/ry)**2);o.push([R(cx-w),R(cy+y)],[R(cx+w),R(cy+y)])}stroke(dense(o,2))};
const ell=(cx,cy,rx,ry,tilt=0,a0=0,a1=2*PI,n=70)=>{const o=[];for(let i=0;i<=n;i++){const t=a0+(a1-a0)*i/n,x=rx*Math.cos(t),y=ry*Math.sin(t);
 o.push([R(cx+x*Math.cos(tilt)-y*Math.sin(tilt)),R(cy+x*Math.sin(tilt)+y*Math.cos(tilt))])}return dense(o)};

// colour first (markers sit under the pen lines)
tap(...TOOL.yellow);
fillEllipse(hx-hr-6,hy+14,8,26); fillEllipse(hx+hr+6,hy+14,8,26);  // floppy ears
tap(...TOOL.cyan);   dot(hx+20,hy-6); dot(hx+26,hy-12);             // eye patch
tap(...TOOL.pink);   dot(hx,hy+36);                                  // tongue
                     dot(hx-32,hy+18); dot(hx+32,hy+18);             // cheeks

tap(...TOOL.pen);
stroke(ell(hx,hy,hr,hr*0.9));                                        // head
stroke(ell(hx-hr-6,hy+14,16,34,0.25));                               // left ear
stroke(ell(hx+hr+6,hy+14,16,34,-0.25));                              // right ear
stroke(ell(hx,hy+hr+42,46,36,0,0.35,PI-0.35,40));                    // body (lower half only)
stroke(dense([[hx-43,hy+hr+30],[hx-30,hy+hr-2]]));                   // body sides up to the head
stroke(dense([[hx+43,hy+hr+30],[hx+30,hy+hr-2]]));
stroke(ell(hx-18,hy+hr+76,12,7,0,PI,2*PI,16));                      // paws
stroke(ell(hx+18,hy+hr+76,12,7,0,PI,2*PI,16));
stroke(dense([[hx+44,hy+hr+50],[hx+60,hy+hr+42],[hx+66,hy+hr+26]]));  // tail
stroke(dense([[hx-20,hy-10],[hx-20,hy-3]]));stroke(dense([[hx-19,hy-10],[hx-19,hy-3]]));  // eyes
stroke(dense([[hx+20,hy-10],[hx+20,hy-3]]));stroke(dense([[hx+21,hy-10],[hx+21,hy-3]]));
stroke(dense([[hx-6,hy+12],[hx+6,hy+12],[hx,hy+19],[hx-6,hy+12]]));  // nose
stroke(dense([[hx,hy+19],[hx,hy+25]]));
stroke(ell(hx-7,hy+25,7,5,0,0,PI,12).reverse()); stroke(ell(hx+7,hy+25,7,5,0,0,PI,12)); // mouth
step(10);
}
