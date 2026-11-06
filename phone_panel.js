/* Панель жағы: QR, оқушылар тізімі және көлік жарысы.
   Әр оқушының өз көлігі бар. Сұрақты мұғалім ауыстырады: уақыт бітсе жауап көрсетіледі,
   келесі сұрақ тек мұғалім басқанда шығады (батырма, PageDown немесе →). */
"use strict";
const RQ=[
  ['Термодинамикалық параметрлерге не жатады?',['V, p, T','v, m₀, E₀','F, a, s','I, U, R'],'Олар тұтас денені сипаттайды.'],
  ['Қайсысы микроскопиялық шама?',['молекула жылдамдығы','қысым','көлем','температура'],'Микро шама бір молекуланы сипаттайды.'],
  ['Жылулық тепе-теңдікте денелердің қай шамасы бірдей?',['температурасы','массасы','көлемі','ішкі энергиясы'],'Тепе-теңдік күйін температура сипаттайды.'],
  ['Энергия қай денеден қайсысына беріледі?',['қатты қызғаннан аз қызғанға','суықтан ыстыққа','үлкеннен кішіге','кішіден үлкенге'],'Ішкі энергиясы жоғары дене береді, аз дене алады.'],
  ['Температура нені өлшейді?',['орташа кинетикалық энергияны','молекула массасын','молекула санын','дене көлемін'],'Ē = (3/2)kT'],
  ['Молекуланың орташа кинетикалық энергиясы:',['Ē = (3/2)kT','Ē = kT²','Ē = 3kT²','Ē = kT/3'],'k – Больцман тұрақтысы.'],
  ['T 2 есе артса, Ē қалай өзгереді?',['2 есе артады','4 есе артады','2 есе кемиді','өзгермейді'],'Ē абсолют температураға тура пропорционал.'],
  ['27 °C = ? К',['300 К','246 К','27 К','327 К'],'T = 27 + 273 = 300 К'],
  ['0 К = ? °C',['−273 °C','0 °C','273 °C','−100 °C'],'t = 0 − 273 = −273 °C'],
  ['100 °C = ? °F',['212 °F','100 °F','180 °F','132 °F'],'32 + 1,8·100 = 212 °F'],
  ['68 °F = ? °C',['20 °C','36 °C','68 °C','100 °C'],'(68 − 32) / 1,8 = 20 °C'],
  ['Биметалл жолақ қай термометрде бар?',['механикалық','сұйықтық','газдық','пирометр'],'Екі металл әртүрлі ұлғайып, жолақ бұралады.'],
  ['Дәлдігі ең жоғары термометр (оқулық бойынша):',['газдық','сұйықтық','механикалық','электрлік'],'Температура газ қысымымен анықталады.'],
  ['Денеге тимей өлшейтін құрал:',['пирометр','сынап термометрі','биметалл термометр','газдық термометр'],'Пирометр мен тепловизор сәулені қабылдайды.'],
  ['Кельвин шкаласында теріс температура:',['болмайды','болады','тек газда болады','тек қыста болады'],'0 К – ең төменгі температура.'],
  ['Цельсий шкаласының реперлік нүктелері:',['мұздың еруі, судың қайнауы','абсолют нөл, судың қайнауы','адам денесі, мұздың еруі','сынаптың қатуы, судың қайнауы'],'Қалыпты атмосфералық қысымда 0 °C және 100 °C.']
];
const PH=(()=>{
  const today=new Date().toISOString().slice(0,10);
  const newRoom=()=>{ const A='ABCDEFGHJKMNPQRSTUVWXYZ'; let s=''; for(let i=0;i<4;i++) s+=A[Math.floor(Math.random()*A.length)]; return s; };
  let D=store.get('tm_ph',null); if(!D||D.date!==today) D={date:today,room:newRoom(),st:{},kick:[],lane:0};
  const save=()=>store.set('tm_ph',D);
  const seen={}; let net=null, linkInfo=null, status=[];
  const online=pid=>Date.now()-(seen[pid]||0)<9000;
  const ids=()=>Object.keys(D.st);
  const isLocal=()=>linkInfo&&linkInfo.local;
  const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

  function joinUrl(){ if(isLocal()) return /^127\./.test(linkInfo.host)?'':`http://${linkInfo.host}:${linkInfo.port}/oqushy.html?r=${D.room}`;
    if(location.protocol==='http:'||location.protocol==='https:'){ const p=location.pathname.replace(/[^/]*$/,''); return location.origin+p+'oqushy.html?r='+D.room; }
    const b=store.get('tm_puburl','').trim(); if(b) return b.replace(/\/?(index\.html)?$/,'/')+'oqushy.html?r='+D.room; return ''; }
  function qrSvg(u){ const q=qrcode(0,'M'); q.addData(u); q.make(); return q.createSvgTag({cellSize:6,margin:2,scalable:true}); }
  function paintQR(){ const u=joinUrl(), loc=isLocal(); document.querySelectorAll('[data-qr]').forEach(b=>{ b.innerHTML=u?qrSvg(u):(loc?'<div class="qrno">QR жоқ:<br>компьютерді Wi-Fi-ға қосыңыз</div>':'<div class="qrno">QR жоқ:<br>сілтеме керек</div>'); });
    document.querySelectorAll('[data-url]').forEach(b=>{ b.textContent=u?u.replace(/^https?:\/\//,''):'—'; });
    document.querySelectorAll('[data-file]').forEach(w=>{ w.style.display=(u||loc)?'none':'block'; }); const i=$('phPub'); if(i&&!i.value) i.value=store.get('tm_puburl','');
    document.querySelectorAll('[data-wifi]').forEach(f=>{ f.style.display=(loc&&u)?'block':'none'; f.innerHTML=linkInfo&&linkInfo.ssid?`Алдымен телефонды <b>«${esc(linkInfo.ssid)}»</b> Wi-Fi-ына қос.`:'Алдымен телефонды осы компьютер қосылған Wi-Fi-ға қос.'; });
    const n=$('phNet'); if(n){ const ok=status.filter(x=>x.on); n.textContent=ok.length?'Байланыс бар: '+ok.map(x=>x.name).join(', '):'Байланыс орнатылып жатыр…'; n.style.color=ok.length?'var(--green)':'var(--red)'; } }
  function reg(pid,name){ name=String(name||'').slice(0,24).trim()||'Оқушы'; let s=D.st[pid]; if(!s){ s=D.st[pid]={n:name,lane:D.lane++}; save(); RC.addP(pid,name,s.lane); SND.clink(); paintChip(); RC.paint(); } else if(s.n!==name){ s.n=name; save(); RC.rename(pid,name); RC.paint(); } else RC.addP(pid,s.n,s.lane); return s; }
  function tell(pid){ if(net&&D.st[pid]) net.send(pid,{t:'st',pid,rc:RC.forPid(pid)}); }
  function all(){ ids().forEach(pid=>{ if(online(pid)) tell(pid); }); }
  function onMsg(m){ const pid=m.pid; if(!pid) return; seen[pid]=Date.now();
    if(D.kick.includes(pid)&&!m.force){ net.send(pid,{t:'kicked',pid}); return; }
    if(m.force) D.kick=D.kick.filter(x=>x!==pid);
    if(m.t==='hello'){ reg(pid,m.name); tell(pid); RC.counts(); return; }
    if(!D.st[pid]){ if(m.n) reg(pid,m.n); else return; }
    if(m.t==='ping'){ if(m.a) RC.answer(pid,m.a.i,m.a.k); tell(pid); return; }
    if(m.t==='ans') RC.answer(pid,m.i,m.k); }
  function kick(pid){ const s=D.st[pid]; if(!s){ RC.drop(pid); RC.paint(); return; } if(!confirm(s.n+' тізімнен алынсын ба?')) return; delete D.st[pid]; D.kick.push(pid); RC.drop(pid); save(); if(net) net.send(pid,{t:'kicked',pid}); paintChip(); RC.paint(); }
  function resetAll(){ if(!confirm('Жаңа сабақ: жаңа QR жасалады, телефондар қайта сканерлейді. Жалғастырамыз ба?')) return; store.set('tm_ph',null); store.set('tm_rc',null); location.reload(); }
  function paintChip(){ const c=$('phChip'); if(c) c.textContent='📱 QR · '+ids().length; }
  function monitor(on){ $('phOv').style.display=on?'flex':'none'; if(on){ paintQR(); $('phOvN').innerHTML=ids().map(p=>`<span class="nmc" style="background:${RC.col(D.st[p].lane)}">${esc(D.st[p].n)}</span>`).join(''); } }
  function init(){ RC.restore(D); net=NET.openPanel({room:D.room,onMsg,onStatus:l=>{ status=l; paintQR(); },onReady:i=>{ linkInfo=i; paintQR(); }});
    $('phChip').onclick=()=>monitor($('phOv').style.display==='none'); $('phClose').onclick=()=>monitor(false);
    const og=go; go=function(i){ og(i); if(slides[cur].id==='slRace'){ RC.paint(); paintQR(); } };
    paintChip(); paintQR(); RC.paint(); }
  return {init,all,tell,online,ids,get D(){return D;},esc,joinUrl,onMsg,paintQR,paintChip,kick,resetAll,reg};
})();

/* ===================== КӨЛІК ЖАРЫСЫ ===================== */
const RC=(()=>{
  const N=10,T=20,SY=['▲','◆','●','■'];
  const PAL=['#d63a35','#1f6fc4','#e0a92e','#2a8f4d','#8e44ad','#e67e22','#16a2a2','#c2185b','#5d6d7e','#7cb342','#3f51b5','#a0522d','#00acc1','#f06292','#6d4c41','#9e9d24','#546e7a','#ab47bc','#ef5350','#26a69a'];
  const col=l=>PAL[l%PAL.length];
  const R={ph:'lobby',qs:[],i:-1,t0:0,all:{},cdT:0,conf:[]};
  const esc=s=>PH.esc(s);
  const plist=()=>Object.values(R.all).sort((a,b)=>a.lane-b.lane);
  const places=()=>Object.values(R.all).sort((a,b)=>b.pts-a.pts||b.right-a.right);
  const placeOf=pid=>places().findIndex(p=>p.pid===pid)+1;
  const active=()=>R.ph==='cd'||R.ph==='q'||R.ph==='rev';
  const save=()=>{ const all={}; Object.values(R.all).forEach(p=>{ if(!p.bot) all[p.pid]=Object.assign({},p,{puff:[]}); }); store.set('tm_rc',{date:PH.D.date,ph:R.ph,qs:R.qs,i:R.i,t0:R.t0,all}); };
  function restore(D){ const s=store.get('tm_rc',null); Object.keys(D.st).forEach(pid=>addP(pid,D.st[pid].n,D.st[pid].lane)); if(s&&s.date===D.date&&(s.ph==='q'||s.ph==='rev'||s.ph==='end')){ Object.assign(R,{ph:s.ph,qs:s.qs,i:s.i,t0:s.t0}); Object.values(s.all).forEach(p=>{ R.all[p.pid]=Object.assign(p,{vis:p.pos,puff:[]}); }); } }
  function addP(pid,name,lane){ if(!R.all[pid]) R.all[pid]={pid,name,lane,pts:0,right:0,ans:null,at:0,gain:0,ok:false,pos:0,vis:0,spin:0,puff:[]}; return R.all[pid]; }
  function rename(pid,n){ if(R.all[pid]) R.all[pid].name=n; }
  function drop(pid){ delete R.all[pid]; }
  function forPid(pid){ const p=R.all[pid], q=R.qs[R.i]; const o={ph:R.ph,i:R.i,n:N,T,cnt:plist().length,me:p?{ans:p.ans,ok:p.ok,gain:p.gain,pts:p.pts,right:p.right,place:placeOf(pid),pos:p.pos,col:col(p.lane),lane:p.lane+1}:{}};
    if(R.ph==='q'){ o.q=q.q; o.o=q.o; o.left=Math.max(0,T*1000-(Date.now()-R.t0)); } if(R.ph==='rev'){ o.q=q.q; o.ca=q.o[q.ci]; o.sol=q.sol; } return o; }
  function addBots(){ if(R.ph!=='lobby') return; let k=plist().length; const nm=['Аружан','Дәулет','Мадина','Ерасыл','Жанерке','Нұрбол','Айым','Сұлтан','Томирис','Әлібек','Ботагөз','Диас','Гүлназ','Бекзат','Әсел','Темірлан','Ақбота','Мирас','Дильназ']; while(k<19){ const id='bot'+k; const p=addP(id,'🤖 '+nm[k],1000+k); p.lane=k; p.bot=true; k++; } paint(); }
  function clearBots(){ Object.values(R.all).filter(p=>p.bot).forEach(p=>delete R.all[p.pid]); }
  function start(){ if(!plist().length){ toast('Алдымен кемінде бір оқушы қосылсын'); return; } R.qs=shuffle(RQ).slice(0,N).map(([q,o,sol])=>{ const idx=shuffle([0,1,2,3]); return {q,o:idx.map(i=>o[i]),ci:idx.indexOf(0),sol}; }); R.i=-1; R.ph='cd'; R.cdT=Date.now(); R.conf=[]; plist().forEach(p=>Object.assign(p,{pts:0,right:0,ans:null,gain:0,ok:false,pos:0,vis:0})); SND.beep(); paint(); PH.all(); }
  function nextQ(){ R.i++; if(R.i>=N){ finish(); return; } plist().forEach(p=>Object.assign(p,{ans:null,gain:0,ok:false})); R.ph='q'; R.t0=Date.now(); SND.page(); save(); paint(); PH.all();
    plist().filter(p=>p.bot).forEach(p=>{ const t=2000+Math.random()*9000, ci=R.qs[R.i].ci, k=Math.random()<.72?ci:(ci+1+Math.floor(Math.random()*3))%4, i=R.i; setTimeout(()=>answer(p.pid,i,k),t); }); }
  function needed(){ return plist().filter(p=>p.bot||PH.online(p.pid)); }
  function answer(pid,i,k){ if(R.ph!=='q'||i!==R.i) return; const p=R.all[pid]; if(!p||p.ans!=null) return; p.ans=k; p.at=Date.now()-R.t0; if(!p.bot) PH.tell(pid); SND.clink(); counts(); if(needed().every(x=>x.ans!=null)) reveal(); }
  function reveal(){ if(R.ph!=='q') return; const q=R.qs[R.i]; plist().forEach(p=>{ p.ok=p.ans===q.ci; p.gain=p.ok?500+Math.round(500*Math.max(0,1-p.at/(T*1000))):0; p.pts+=p.gain; if(p.ok) p.right++; p.pos=Math.min(100,p.pts/100); }); R.ph='rev'; SND.ok(); save(); paint(); PH.all(); }
  function finish(){ R.ph='end'; SND.bell(); R.conf=Array.from({length:130},()=>({x:Math.random()*1540,y:-Math.random()*200,v:50+Math.random()*90,c:PAL[Math.floor(Math.random()*8)],r:Math.random()*6})); save(); paint(); PH.all(); }
  function again(){ R.ph='lobby'; R.i=-1; R.conf=[]; R.qs=[]; clearBots(); plist().forEach(p=>Object.assign(p,{pts:0,right:0,ans:null,gain:0,ok:false,pos:0,vis:0})); store.set('tm_rc',null); paint(); PH.all(); }
  /* мұғалімнің бір түймесі: сұрақ → жауап → келесі сұрақ */
  function step(){ if(R.ph==='q') reveal(); else if(R.ph==='rev') nextQ(); }

  setInterval(()=>{ if(R.ph==='cd'){ const left=3-Math.floor((Date.now()-R.cdT)/1000); const e=$('rcCd'); if(e&&e.textContent!==String(left)&&left>0){ e.textContent=left; SND.beep(); } if(left<=0) nextQ(); }
    else if(R.ph==='q'){ const l=T*1000-(Date.now()-R.t0); const e=$('rcSec'); if(e) e.textContent=Math.max(0,Math.ceil(l/1000)); const b=$('rcBar'); if(b) b.style.width=Math.max(0,l/(T*10))+'%'; if(l<=0) reveal(); } },200);

  function counts(){ const e=$('rcAns'); if(e){ const w=needed(); e.textContent=w.filter(x=>x.ans!=null).length+' / '+w.length; } if(R.ph==='lobby') paint(); }
  function paint(){ const top=$('rcTop'),bot=$('rcBot'),cv=$('cRace'); if(!top) return; const ps=plist();
    const H=R.ph==='q'||R.ph==='rev'?Math.min(570,30+Math.max(ps.length,1)*70):R.ph==='end'?150:0; cv.style.display=H?'block':'none'; if(H&&cv.height!==H) cv.height=H;
    if(R.ph==='lobby'){ top.innerHTML=`<div class="rclob"><div class="rcqr" data-qr></div><div class="rclt"><small>Сабақты бекіту · телефонмен ойын</small><h2>Көлік жарысы</h2>
        <p>QR-ды сканерле, атыңды жаз. <b>Әр оқушының өз көлігі бар.</b> 10 сұрақ: дұрыс әрі жылдам жауап көлігіңді алға жылжытады.</p>
        <div data-wifi class="rcwifi" style="display:none"></div>
        <div data-file class="warn" style="display:none;font-size:16px"><b>QR жасау үшін сілтеме керек.</b> Слайд компьютерден тікелей ашылған. 1) Папкадағы <b>start.bat</b> арқылы ашыңыз, немесе 2) GitHub Pages сілтемесін жазыңыз:<div style="display:flex;gap:6px;margin-top:6px"><input id="phPub" placeholder="https://.../temperatura-10-synyp/" style="flex:1;font:inherit;padding:5px 8px"><button class="btn main" id="phPubOk">Сақтау</button></div></div>
        <div class="rcur"><span data-url></span><span id="phNet" style="font:14px 'Segoe UI'"></span></div>
        <div class="rccn">Қосылғандар: <b>${ps.length}</b> <span style="font-size:17px;color:var(--muted)">оқушы саны шектелмейді, кімдер келсе, сол ойнайды</span></div>
        <div class="nmg" id="rcNames">${ps.map(p=>`<span class="nmc" style="background:${col(p.lane)}" data-k="${p.pid}" title="Алып тастау">${esc(p.name)}</span>`).join('')||'<span style="color:var(--muted);font-size:20px">Әзірге ешкім қосылған жоқ…</span>'}</div></div></div>`;
      bot.innerHTML=`<div class="rcctl"><button class="btn main big2" id="rcStart" ${ps.length?'':'disabled'}>🏁 Жарысты бастау (${ps.length} оқушы)</button><button class="btn" id="rcBots">🤖 Сынап көру: боттар қосу</button>${ps.some(p=>p.bot)?'<button class="btn" id="rcNoBot">Боттарды алу</button>':''}<button class="btn" id="phReset" style="margin-left:auto">↺ Жаңа сабақ (жаңа QR)</button></div>`;
      PH.paintQR(); const ok=$('phPubOk'); if(ok) ok.onclick=()=>{ store.set('tm_puburl',$('phPub').value.trim()); PH.paintQR(); };
      const nm=$('rcNames'); nm.onclick=e=>{ const x=e.target.closest('[data-k]'); if(x) PH.kick(x.dataset.k); }; }
    else if(R.ph==='cd'){ top.innerHTML=`<div class="rcq" style="justify-content:center;min-height:400px"><div class="rccd" id="rcCd">3</div></div>`; bot.innerHTML='<div class="rcfan" style="text-align:center;font-size:28px">Дайындалыңдар! Сұрақ телефонда да шығады.</div>'; }
    else if(R.ph==='q'||R.ph==='rev'){ const q=R.qs[R.i], rev=R.ph==='rev', cnt=[0,0,0,0]; ps.forEach(p=>{ if(p.ans!=null) cnt[p.ans]++; }); const last=R.i>=N-1;
      top.innerHTML=`<div class="rcq"><div class="rcn">${R.i+1}/${N}</div><div class="rcqt">${esc(q.q)}${rev&&q.sol?`<small>${esc(q.sol)}</small>`:''}</div>${rev?`<button class="btn main rcnx" id="rcNx">${last?'🏆 Нәтиже':'Келесі сұрақ ▶'}</button>`:`<div class="rcsec" id="rcSec">${T}</div><div class="rcac">Жауап берді<b id="rcAns"></b><button class="btn" id="rcSkip">Жауапты көрсету</button></div>`}</div>${rev?'':'<div class="rctm"><i id="rcBar"></i></div>'}`;
      bot.innerHTML=`<div class="rcopts">${q.o.map((x,j)=>`<div class="rco o${j} ${rev?(j===q.ci?'right':'dim'):''}"><b>${SY[j]}</b><span>${esc(x)}</span>${rev?`<em>${cnt[j]}</em>`:''}</div>`).join('')}</div>`; counts(); }
    else { const pl=places(); top.innerHTML=`<div class="rcq" style="justify-content:center;min-height:64px"><div class="rcwin">🏆 Жеңімпаз: ${esc(pl[0]?pl[0].name:'')}</div></div>`;
      bot.innerHTML=`<div class="rcend"><div class="rcpod">${pl.slice(0,3).map((p,i)=>`<div class="pd p${i}" style="background:${col(p.lane)}"><div class="pn">${i+1}-орын</div><div>${esc(p.name)}</div><b>${p.pts}</b><small>${p.right} / ${N} дұрыс</small></div>`).join('')}</div>
        <div class="rcfl"><h4>Барлық нәтиже</h4><div class="rcall">${pl.map((p,i)=>`<div><i style="background:${col(p.lane)}"></i>${i+1}. ${esc(p.name)} <b>${p.pts}</b></div>`).join('')}</div><div class="rcctl" style="margin-top:8px"><button class="btn main" id="rcAg1">↺ Қайта ойнау</button></div></div></div>`; }
    const w=(id,f)=>{ const e=$(id); if(e) e.onclick=f; };
    w('rcStart',start); w('rcBots',addBots); w('rcNoBot',()=>{ clearBots(); paint(); }); w('rcNx',step); w('rcSkip',reveal); w('rcAg1',again); w('phReset',PH.resetAll); }

  function car(ctx,x,y,c,spin,s){ ctx.save(); ctx.translate(x,y); ctx.scale(s,s);
    ctx.fillStyle='rgba(0,0,0,.25)'; ctx.beginPath(); ctx.ellipse(0,20,60,6,0,0,7); ctx.fill();
    ctx.fillStyle=c; rr(ctx,-60,-12,120,28,10); ctx.fill(); ctx.beginPath(); ctx.moveTo(-34,-12); ctx.quadraticCurveTo(-24,-36,4,-36); ctx.quadraticCurveTo(26,-36,38,-12); ctx.closePath(); ctx.fill();
    ctx.fillStyle='#cfe6f4'; ctx.beginPath(); ctx.moveTo(-24,-13); ctx.quadraticCurveTo(-17,-30,1,-30); ctx.lineTo(1,-13); ctx.closePath(); ctx.fill(); ctx.beginPath(); ctx.moveTo(6,-13); ctx.lineTo(6,-30); ctx.quadraticCurveTo(20,-29,29,-13); ctx.closePath(); ctx.fill();
    ctx.fillStyle='#ffe28a'; rr(ctx,50,-8,10,8,3); ctx.fill();
    for(const wx of [-34,36]){ ctx.save(); ctx.translate(wx,14); ctx.fillStyle='#22262b'; ctx.beginPath(); ctx.arc(0,0,13,0,7); ctx.fill(); ctx.rotate(spin); ctx.fillStyle='#c3c8ce'; ctx.fillRect(-7,-2,14,4); ctx.restore(); }
    ctx.restore(); }
  LABS.cRace={frame(ctx,w,h,dt){ const ps=plist();
    if(R.ph==='end'){ ctx.fillStyle='#4a4e54'; ctx.fillRect(0,0,w,h); ctx.fillStyle='#7fb069'; ctx.fillRect(0,0,w,14); ctx.fillRect(0,h-14,w,14); places().slice(0,3).forEach((p,i)=>{ p.spin+=dt*9; car(ctx,w/2+(1-i)*340+Math.sin(TT*2+i)*16,h/2+8,col(p.lane),p.spin,1.3); });
      R.conf.forEach(p=>{ p.y+=p.v*dt; p.r+=dt*4; if(p.y>h) p.y=-10; ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.r); ctx.fillStyle=p.c; ctx.fillRect(-5,-3,10,6); ctx.restore(); }); return; }
    const GUT=190,RGT=72,X0=GUT+44,X1=w-RGT-34,top=24,n=Math.max(ps.length,1),lh=Math.min(70,(h-top-4)/n), s=Math.min(1,(lh-3)/58);
    ctx.fillStyle='#7fb069'; ctx.fillRect(0,0,w,h);
    for(let k=0;k<=N;k++){ const x=X0+(X1-X0)*k/N; label(ctx,k===0?'СТАРТ':(k===N?'МӘРЕ':String(k*1000)),x,top-7,'#22351b',13,'center',true); }
    ps.forEach((p,i)=>{ const y=top+i*lh; ctx.fillStyle=i%2?'#4a4e54':'#53585f'; ctx.fillRect(GUT,y,w-GUT-RGT,lh-1); ctx.fillStyle='rgba(255,255,255,.14)'; for(let x=X0+40-(0);x<X1;x+=70) ctx.fillRect(x,y+lh/2-1,32,2);
      ctx.fillStyle=col(p.lane); ctx.fillRect(0,y,7,lh-1); ctx.fillStyle='rgba(255,255,255,.93)'; ctx.fillRect(7,y,GUT-7,lh-1); const fs=Math.min(20,Math.max(13,lh*.56)); label(ctx,(i+1)+'. '+p.name.slice(0,20),13,y+lh/2+fs*.36,'#1d2430',fs,'left',true);
      ctx.fillStyle='rgba(255,255,255,.93)'; ctx.fillRect(w-RGT,y,RGT,lh-1); label(ctx,String(p.pts),w-RGT/2,y+lh/2+fs*.36,'#1d2430',fs,'center',true,'Georgia, serif');
      if(R.ph==='q'&&p.ans!=null){ ctx.fillStyle='#2a8f4d'; ctx.beginPath(); ctx.arc(GUT-11,y+lh/2,Math.min(6,lh*.22),0,7); ctx.fill(); } });
    const cs=Math.max(6,Math.min(12,lh/2)), bot=top+n*lh; for(let r=0;r*cs<bot-top;r++) for(let q=0;q<3;q++){ ctx.fillStyle=(r+q)%2?'#111':'#f6f6f6'; ctx.fillRect(X1+q*cs,top+r*cs,cs,Math.min(cs,bot-top-r*cs)); }
    ctx.strokeStyle='rgba(255,255,255,.7)'; ctx.lineWidth=2; ctx.beginPath(); ctx.moveTo(X0,top); ctx.lineTo(X0,bot); ctx.stroke();
    ps.forEach((p,i)=>{ const b=p.vis; p.vis+=(p.pos-p.vis)*Math.min(1,dt*1.6); const dx=p.vis-b; p.spin+=dx*2.4; const y=top+i*lh+lh/2-1, x=X0+(X1-X0)*p.vis/100;
      if(dx>.03&&p.puff.length<8) p.puff.push({x:x-58*s,y:y+8*s,a:1,r:3}); p.puff=p.puff.filter(q=>(q.a-=dt*1.4)>0); p.puff.forEach(q=>{ q.x-=26*dt; q.r+=14*dt; ctx.fillStyle=`rgba(235,235,235,${q.a*.5})`; ctx.beginPath(); ctx.arc(q.x,q.y,q.r*s,0,7); ctx.fill(); });
      car(ctx,x,y,col(p.lane),p.spin,s); });
    if(!ps.length) label(ctx,'Оқушылар қосылғанда көліктер осында шығады',w/2,h/2,'#f3efe4',26,'center',true); }};
  document.addEventListener('keydown',e=>{ if(!slides[cur]||slides[cur].id!=='slRace'||!active()) return; if(/INPUT|SELECT|TEXTAREA/.test(document.activeElement.tagName)) return; if(['PageDown','ArrowRight',' ','Enter'].includes(e.key)){ step(); e.preventDefault(); e.stopImmediatePropagation(); } else if(['PageUp','ArrowLeft'].includes(e.key)){ e.preventDefault(); e.stopImmediatePropagation(); } },true);
  const nb=$('next'), oldN=nb.onclick; nb.onclick=e=>{ if(slides[cur].id==='slRace'&&active()) step(); else oldN(e); };
  return {forPid,answer,paint,start,addP,rename,drop,reveal,nextQ,step,restore,counts,col,R,addBots};
})();

PH.init();
window.__ph={PH,RC};
