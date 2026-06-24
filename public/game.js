const HEROES = [
  {id:'nyx',name:'Nyx',role:'Shadow Assassin',rarity:'UR',element:'Dark',base:540,img:'assets/hero-nyx.svg'},
  {id:'aurel',name:'Aurel',role:'Star Paladin',rarity:'UR',element:'Light',base:520,img:'assets/hero-aurel.svg'},
  {id:'kaida',name:'Kaida',role:'Dragon Mage',rarity:'SSR',element:'Fire',base:420,img:'assets/hero-kaida.svg'},
  {id:'mira',name:'Mira',role:'Moon Archer',rarity:'SSR',element:'Wind',base:400,img:'assets/hero-mira.svg'},
  {id:'thane',name:'Thane',role:'Iron Guard',rarity:'SR',element:'Earth',base:295,img:'assets/hero-thane.svg'},
  {id:'sera',name:'Sera',role:'Crystal Healer',rarity:'SR',element:'Water',base:280,img:'assets/hero-sera.svg'},
  {id:'riven',name:'Riven',role:'Blade Rogue',rarity:'SR',element:'Dark',base:300,img:'assets/hero-riven.svg'},
  {id:'luna',name:'Luna',role:'Apprentice Mage',rarity:'R',element:'Water',base:185,img:'assets/hero-luna.svg'},
  {id:'grom',name:'Grom',role:'Stone Warrior',rarity:'R',element:'Earth',base:195,img:'assets/hero-grom.svg'},
  {id:'faye',name:'Faye',role:'Forest Scout',rarity:'R',element:'Wind',base:175,img:'assets/hero-faye.svg'}
];

const SAVE_KEY = 'shadow_rift_save_v1';
const rarityOrder = {R:1,SR:2,SSR:3,UR:4};
let state = load();

function freshState(){
  return {gems:1800,gold:8000,stamina:35,stage:1,lastDaily:'',owned:{luna:{level:1,dupes:0},grom:{level:1,dupes:0},faye:{level:1,dupes:0}},team:['luna','grom','faye']};
}
function load(){try{return JSON.parse(localStorage.getItem(SAVE_KEY)) || freshState()}catch{return freshState()}}
function save(){localStorage.setItem(SAVE_KEY,JSON.stringify(state));render();}
function hero(id){return HEROES.find(h=>h.id===id)}
function powerOf(id){const h=hero(id),o=state.owned[id];return Math.floor(h.base*(1+(o.level-1)*0.16)+(o.dupes*35));}
function totalPower(){return state.team.reduce((sum,id)=>sum+(state.owned[id]?powerOf(id):0),0)}
function enemyPower(){return 560+state.stage*185;}
function showPage(id){document.querySelectorAll('.page,.hero-screen').forEach(p=>p.classList.remove('active'));document.getElementById(id).classList.add('active');render();}
function pickRarity(){const r=Math.random()*100;if(r<2)return'UR';if(r<10)return'SSR';if(r<37)return'SR';return'R';}
function randomHeroByRarity(r){const pool=HEROES.filter(h=>h.rarity===r);return pool[Math.floor(Math.random()*pool.length)];}
function pull(count){const cost=count===10?1350:150;if(state.gems<cost){toast('ما عندك جواهر كافية. العب مراحل أو خذ Daily Reward.');return;}state.gems-=cost;let results=[];for(let i=0;i<count;i++){const h=randomHeroByRarity(pickRarity());if(!state.owned[h.id]){state.owned[h.id]={level:1,dupes:0};if(state.team.length<5)state.team.push(h.id);}else{state.owned[h.id].dupes++;state.gold+=300;}results.push(h);}save();const box=document.getElementById('pullResults');box.innerHTML=results.map(cardHtml).join('');box.classList.remove('flash');void box.offsetWidth;box.classList.add('flash');}
function upgrade(id){const o=state.owned[id];if(!o)return;const cost=500+o.level*230;if(state.gold<cost){toast('تحتاج Gold أكثر للتطوير.');return;}state.gold-=cost;o.level++;save();}
function toggleTeam(id){if(!state.owned[id])return;if(state.team.includes(id)){if(state.team.length<=1){toast('لازم يبقى بطل واحد على الأقل.');return;}state.team=state.team.filter(x=>x!==id);}else{if(state.team.length>=5){toast('الفريق ممتلئ: 5 أبطال فقط.');return;}state.team.push(id);}save();}
function battleStage(){showPage('battlePage');if(state.stamina<5){document.getElementById('battleLog').innerHTML='⚡ الطاقة غير كافية. انتظر أو استلم الهدية اليومية.';return;}state.stamina-=5;const p=totalPower();const e=enemyPower();const chance=Math.max(.12,Math.min(.9,.48+(p-e)/2200));const win=Math.random()<chance;let log=`Stage ${state.stage}<br>Your Power: ${p} vs Enemy: ${e}<br>`;if(win){const gem=80+state.stage*8,gold=900+state.stage*120;state.stage++;state.gems+=gem;state.gold+=gold;log+=`✅ Victory! حصلت على ${gem} 💎 و ${gold} 🪙<br>فتحت Stage ${state.stage}`;}else{const gold=260+state.stage*55;state.gold+=gold;log+=`❌ Defeat. حصلت على ${gold} 🪙 فقط.<br>طور الأبطال أو اسحب شخصيات أقوى.`;}save();const el=document.getElementById('battleLog');el.innerHTML=log;el.classList.remove('shake');void el.offsetWidth;el.classList.add('shake');}
function claimDaily(){const today=new Date().toDateString();if(state.lastDaily===today){toast('استلمت مكافأة اليوم بالفعل.');return;}state.lastDaily=today;state.gems+=650;state.gold+=5000;state.stamina+=25;save();toast('🎁 Daily Reward: +650 Gems, +5000 Gold, +25 Stamina');}
function cardHtml(h){const owned=state.owned[h.id];const level=owned?owned.level:1;const inTeam=state.team.includes(h.id);return `<div class="card"><span class="badge ${h.rarity}">${h.rarity}</span><img src="${h.img}" alt="${h.name}"><h3>${h.name}</h3><p>${h.role}</p><p>Lv.${level} • ${h.element}</p>${owned?`<button onclick="upgrade('${h.id}')">Upgrade ${500+level*230} 🪙</button><button onclick="toggleTeam('${h.id}')">${inTeam?'Remove':'Add'} Team</button>`:''}</div>`;}
function render(){document.getElementById('gems').textContent=state.gems;document.getElementById('gold').textContent=state.gold;document.getElementById('stamina').textContent=state.stamina;document.getElementById('playerTitle').textContent=`Commander • Stage ${state.stage}`;document.getElementById('powerText').textContent=totalPower();document.getElementById('enemyText').textContent=enemyPower();document.getElementById('teamRow').innerHTML=[0,1,2,3,4].map(i=>{const id=state.team[i];return `<div class="team-slot">${id?`<img src="${hero(id).img}" alt="${hero(id).name}"><small>${hero(id).name}</small>`:'+'}</div>`}).join('');document.getElementById('heroGrid').innerHTML=HEROES.filter(h=>state.owned[h.id]).sort((a,b)=>rarityOrder[b.rarity]-rarityOrder[a.rarity]||powerOf(b.id)-powerOf(a.id)).map(cardHtml).join('');}
function toast(msg){const old=document.querySelector('.toast');if(old)old.remove();const t=document.createElement('div');t.className='toast';t.textContent=msg;t.style.cssText='position:fixed;top:18px;left:50%;transform:translateX(-50%);width:min(92%,390px);background:#160c27;border:1px solid #b76cff;color:white;border-radius:16px;padding:12px;text-align:center;z-index:99;box-shadow:0 10px 30px #000';document.body.appendChild(t);setTimeout(()=>t.remove(),2600);} 
render();
