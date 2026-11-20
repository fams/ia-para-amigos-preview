'use strict';
const {Game,brain,preset}=FlappyMicro;
const $=id=>document.getElementById(id);
const ctx=$('game').getContext('2d');
const seed=42,names=['w₁','w₂','w₃','b'];
let weights=[...preset],game=new Game(seed),running=false,acc=0,last=0,queued=false,showNext=true;

const format=n=>{
  if(n===0)return '0';
  if(Math.abs(n)<.0005)return n<0?'−<0,001':'+<0,001';
  return n.toLocaleString('pt-BR',{maximumFractionDigits:3}).replace(/^-/,'−');
};
const actionText=jump=>jump?'Bater a asa':'Não bater';
function render(){
  drawTrack(ctx,game);
  const applied=game.lastFrame,preview=showNext||!applied;
  const x=preview?game.inputs():applied.inputs;
  const w=preview?weights:applied.weights;
  const decision=preview?brain(x,w):applied.network;
  const mode=preview?$('mode').value:applied.mode;
  $('reading').textContent=preview?(game.dead?'Teste na posição final':`Prévia do quadro ${game.t+1}`):`Quadro ${applied.number} · entradas antes do movimento`;
  x.forEach((value,i)=>$('i'+i).textContent=format(value));
  w.forEach((value,i)=>{
    $('e'+i).textContent=names[i]+' = '+format(value);
    const kind=value<0?'negative':value===0?'zero':'positive';
    const wire=document.querySelector('[data-edge="'+i+'"]');
    if(wire.getAttribute('class')!==kind)wire.setAttribute('class',kind);
  });
  $('sum').textContent=format(decision.z);
  $('sum').title='z = '+decision.products.map(format).join(' + ')+' + ('+format(w[3])+')';
  $('value').textContent=decision.out;
  $('value').parentElement.classList.toggle('active',decision.jump);
  $('decision').textContent=actionText(decision.jump);
  $('applied').textContent=preview?(game.dead?'Partida encerrada':mode==='human'?'Depende de você':'Ainda não executada'):`${actionText(applied.jump)} · ${mode==='human'?'manual':'rede'}`;
  $('score').textContent=game.score;
  const status=game.dead?'Fim da partida.':running?'Rodando.':'Pausado.';
  if($('gameStatus').textContent!==status)$('gameStatus').textContent=status;
  $('play').textContent=running?'Pausar':game.t?'Continuar':'Iniciar';
  $('play').disabled=game.dead;
  $('step').disabled=running||game.dead;
  $('flap').disabled=game.dead;
  $('flap').classList.toggle('hidden',$('mode').value!=='human');
}
function setWeights(next){
  weights=[...next];showNext=true;
  weights.forEach((value,i)=>{$('w'+i).value=value;$('wVal'+i).textContent=format(value)});
  render();
}
function step(){
  game.step(weights,queued,$('mode').value);
  queued=false;
  if(game.dead)running=false;
  showNext=false;
  render();
}
weights.forEach((_,i)=>$('w'+i).addEventListener('input',e=>{
  const next=[...weights];next[i]=e.currentTarget.valueAsNumber;setWeights(next);
}));
$('play').onclick=()=>{running=!running;acc=0;render()};
$('step').onclick=step;
$('reset').onclick=()=>{game.reset(seed);running=false;queued=false;acc=0;showNext=true;render()};
$('mode').onchange=()=>{queued=false;showNext=true;render()};
function flap(){if($('mode').value==='human'&&!game.dead){queued=true;if(!running)step()}}
$('flap').onclick=flap;
$('game').onclick=()=>{$('game').focus();flap()};
$('game').addEventListener('keydown',e=>{if(e.code==='Space'){e.preventDefault();flap()}});
$('preset').onclick=()=>setWeights(preset);
$('zero').onclick=()=>setWeights([0,0,0,0]);
function frame(now){
  if(running){
    acc+=Math.min(now-last,80)*Number($('speed').value);
    while(acc>=1000/60&&running){step();acc-=1000/60;}
  }
  last=now;
  requestAnimationFrame(frame);
}
if(new URLSearchParams(window.location.search).has('slide'))document.body.classList.add('embedded');
window.addEventListener?.('message', event => {
  if (event.origin !== window.location.origin || event.source !== window.parent || event.data !== 'amigos:pause-flappy') return;
  if (running) {running=false;acc=0;queued=false;render();}
});
setWeights(preset);requestAnimationFrame(frame);
// Snapshot test bridge: copy, never a setter.
window.inspectFlappy=()=>structuredClone({t:game.t,y:game.y,v:game.v,score:game.score,dead:game.dead,weights,running,showNext,last:game.lastFrame,preview:brain(game.inputs(),weights)});
