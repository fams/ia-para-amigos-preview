function drawTrack(ctx,game){
const {W,H,floor,bx,radius}=FlappyMicro;
ctx.clearRect(0,0,W,H);const sky=ctx.createLinearGradient(0,0,0,H);sky.addColorStop(0,'#a9dce8');sky.addColorStop(1,'#e9faf3');ctx.fillStyle=sky;ctx.fillRect(0,0,W,H);ctx.fillStyle='#ffffff88';for(let x of [45,260,470]){ctx.beginPath();ctx.ellipse(x,65,45,16,0,0,7);ctx.fill()}
for(const p of game.pipes){ctx.fillStyle='#287969';ctx.fillRect(p.x,0,55,p.cy-82);ctx.fillRect(p.x,p.cy+82,55,floor-p.cy-82);ctx.fillStyle='#49a88c';ctx.fillRect(p.x-4,p.cy-96,63,14);ctx.fillRect(p.x-4,p.cy+82,63,14)}ctx.fillStyle='#506c51';ctx.fillRect(0,floor,W,30);ctx.fillStyle='#b5d381';ctx.fillRect(0,floor,W,6);
const target=game.pipes.find(p=>p.x+55>=bx-radius);if(target){ctx.strokeStyle='#16344c70';ctx.setLineDash([5,5]);ctx.beginPath();ctx.moveTo(bx,game.y);ctx.lineTo(target.x+27,target.cy);ctx.stroke();ctx.setLineDash([])}
ctx.save();ctx.translate(bx,game.y);ctx.rotate(Math.max(-.4,Math.min(.7,game.v*.07)));ctx.fillStyle='#ffce64';ctx.beginPath();ctx.ellipse(0,0,14,11,0,0,7);ctx.fill();ctx.fillStyle='#e69b43';ctx.beginPath();ctx.ellipse(-5,4,7,4,game.t*.2,0,7);ctx.fill();ctx.fillStyle='#f28655';ctx.beginPath();ctx.moveTo(10,0);ctx.lineTo(22,3);ctx.lineTo(10,6);ctx.fill();ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(7,-4,5,0,7);ctx.fill();ctx.fillStyle='#182338';ctx.beginPath();ctx.arc(9,-4,2,0,7);ctx.fill();ctx.restore();
if(game.dead){ctx.fillStyle='#142c3688';ctx.fillRect(0,0,W,H);ctx.textAlign='center';ctx.fillStyle='#fff';ctx.font='bold 30px system-ui';ctx.fillText('Colidiu!',W/2,H/2-12);ctx.font='21px system-ui';ctx.fillText('Ajuste os pesos e reinicie.',W/2,H/2+24)}

}
