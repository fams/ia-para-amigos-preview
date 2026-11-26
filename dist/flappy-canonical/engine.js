(function(root){
const W=560,H=420, floor=390, bx=110, radius=11;
const preset=[0,6,1.8,-0.8];
function brain(inputs,weights){const products=inputs.map((x,i)=>x*weights[i]);const z=products.reduce((sum,term)=>sum+term,0)+weights[3];return {z,products,out:Number(z>=0),jump:z>=0};}
class Game {
 constructor(seed=42){this.reset(seed)}
 reset(seed=42){this.seed=seed>>>0;this.y=200;this.v=0;this.t=0;this.score=0;this.dead=false;this.pipes=[];this.next=0;this.lastJump=false;this.lastFrame=null;this.add(470)}
 random(){this.seed=(1664525*this.seed+1013904223)>>>0;return this.seed/4294967296}
 add(x){const prev=this.pipes.at(-1)?.cy||200;this.pipes.push({x,cy:Math.max(125,Math.min(265,prev+(this.random()-.5)*80)),passed:false})}
 inputs(){const p=this.pipes.find(p=>p.x+55>=bx-radius)||{x:W,cy:200};return [Math.max(-1,Math.min(1,(p.x-bx)/W)),(this.y-p.cy)/H,this.v/8]}
 step(weights,manual=false,mode='network'){if(this.dead)return;this.inputsUsed=this.inputs();this.decision=brain(this.inputsUsed,weights);const jump=mode==='network'?this.decision.jump:manual;this.lastJump=jump;
 this.lastFrame={number:this.t+1,mode,inputs:[...this.inputsUsed],weights:[...weights],network:{...this.decision},jump,yBefore:this.y};if(jump)this.v=-4.2;this.v+=.23;this.y+=this.v;this.t++;
 for(const p of this.pipes){p.x-=2;if(!p.passed&&p.x+55<bx-radius){p.passed=true;this.score++}if(p.x<bx+radius&&p.x+55>bx-radius&&(this.y-radius<p.cy-82||this.y+radius>p.cy+82))this.dead=true;}
 if(this.pipes.at(-1).x<300)this.add(this.pipes.at(-1).x+240);this.pipes=this.pipes.filter(p=>p.x>-60);if(this.y<radius||this.y>floor-radius)this.dead=true;
 }
}
const api={Game,brain,preset,W,H,floor,bx,radius};if(typeof module!=='undefined')module.exports=api;root.FlappyMicro=api;
})(globalThis);
