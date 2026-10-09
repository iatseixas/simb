const STORAGE_KEY='simb_ppsc_v1';
const SESSION_KEY='simb_session';

const seedEquipment=[
 ['SIMB-ARM-0001','Pistola','Beretta','APX','9×19 mm','APX9-FC-10001','Disponível'],
 ['SIMB-ARM-0002','Pistola','Beretta','APX','9×19 mm','APX9-FC-10002','Cautelada'],
 ['SIMB-ARM-0003','Pistola','Taurus','24/7 PRO','.40 S&W','T247-FC-20001','Disponível'],
 ['SIMB-ARM-0004','Pistola','Taurus','24/7 PRO','.40 S&W','T247-FC-20002','Disponível'],
 ['SIMB-ARM-0005','Pistola','Taurus','PT 100','.40 S&W','PT100-FC-21001','Disponível'],
 ['SIMB-ARM-0006','Pistola','Taurus','PT 100','.40 S&W','PT100-FC-21002','Em manutenção'],
 ['SIMB-ARM-0007','Pistola','Taurus','TH9','9×19 mm','TH9-FC-22001','Disponível'],
 ['SIMB-ARM-0008','Pistola','Taurus','TS9','9×19 mm','TS9-FC-23001','Disponível'],
 ['SIMB-ARM-0009','Pistola','Glock','G17 Gen5','9×19 mm','G17-FC-30001','Disponível'],
 ['SIMB-ARM-0010','Pistola','Glock','G19 Gen5','9×19 mm','G19-FC-31001','Disponível'],
 ['SIMB-ARM-0011','Fuzil','Taurus','T4','5,56×45 mm NATO','T4-FC-40001','Cautelada'],
 ['SIMB-ARM-0012','Fuzil','Taurus','T4','5,56×45 mm NATO','T4-FC-40002','Disponível'],
 ['SIMB-ARM-0013','Carabina','IMBEL','IA2','5,56×45 mm','IA2-FC-41001','Disponível'],
 ['SIMB-ARM-0014','Carabina','IMBEL','IA2','5,56×45 mm','IA2-FC-41002','Em manutenção'],
 ['SIMB-ARM-0015','Carabina','Taurus','CTT40C','.40 S&W','CTT40-FC-42001','Disponível'],
 ['SIMB-ARM-0016','Fuzil','Fabricante fictício','F300-OPS','.300 Blackout','F300-FC-43001','Disponível'],
 ['SIMB-ARM-0017','Fuzil','Fabricante fictício','F300-OPS','.300 Blackout','F300-FC-43002','Reservada'],
 ['SIMB-ARM-0018','Fuzil de precisão','Fabricante fictício','PR-762','7,62×51 mm','PR762-FC-44001','Disponível'],
 ['SIMB-ARM-0019','Espingarda','CBC','Pump Military 3.0','Calibre 12','CBC12-FC-50001','Disponível'],
 ['SIMB-ARM-0020','Espingarda','CBC','Pump Military 3.0','Calibre 12','CBC12-FC-50002','Cautelada'],
 ['SIMB-ARM-0021','Espingarda','CBC','Pump 586','Calibre 12','CBC586-FC-51001','Disponível'],
 ['SIMB-ARM-0022','Espingarda','CBC','Pump 586','Calibre 12','CBC586-FC-51002','Em manutenção'],
 ['SIMB-EMP-0001','Dispositivo elétrico','Condor','Spark','Não se aplica','SPARK-FC-60001','Disponível'],
 ['SIMB-EMP-0002','Dispositivo elétrico','Condor','Spark','Não se aplica','SPARK-FC-60002','Disponível']
].map(([patrimonio,categoria,fabricante,modelo,calibre,serie,status])=>({patrimonio,categoria,fabricante,modelo,calibre,serie,status,unidade:'PPSC'}));

const officers=[
 {matricula:'202401',nome:'João da Silva',graduacao:'2º Sargento',situacao:'Ativo',unidade:'PPSC'},
 {matricula:'202402',nome:'Ana Oliveira',graduacao:'1º Tenente',situacao:'Ativo',unidade:'PPSC'},
 {matricula:'202403',nome:'Carlos Souza',graduacao:'Cabo',situacao:'Ativo',unidade:'PPSC'},
 {matricula:'202404',nome:'Mariana Costa',graduacao:'3º Sargento',situacao:'Ativo',unidade:'PPSC'},
 {matricula:'202405',nome:'Rafael Santos',graduacao:'Soldado',situacao:'Afastado',unidade:'PPSC'}
];

function initialState(){return {equipment:structuredClone(seedEquipment),loans:[
 {id:'CT-000001',matricula:'202401',officerSnapshot:officers[0],type:'Permanente',purpose:'Policiamento ostensivo',due:'',created:'2026-07-18T09:30:00',status:'Ativa',items:[{patrimonio:'SIMB-ARM-0002',returned:false,condition:''},{patrimonio:'SIMB-ARM-0011',returned:false,condition:''}]},
 {id:'CT-000002',matricula:'202403',officerSnapshot:officers[2],type:'Temporária',purpose:'Operação institucional',due:'2026-07-22',created:'2026-07-17T14:15:00',status:'Ativa',items:[{patrimonio:'SIMB-ARM-0020',returned:false,condition:''}]}
 ],activities:['Base fictícia carregada para a unidade PPSC']}}
let state=loadState();
let currentView='dashboard';
let draft={officer:null,items:[]};
let officerQuery='';
let equipmentQuery='';

function loadState(){try{return JSON.parse(localStorage.getItem(STORAGE_KEY))||initialState()}catch{return initialState()}}
function saveState(){localStorage.setItem(STORAGE_KEY,JSON.stringify(state))}
function esc(value=''){return String(value).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
function equipmentById(id){return state.equipment.find(e=>e.patrimonio===id)}
function officerByMatricula(id){return officers.find(o=>o.matricula===String(id).trim())}
function activeLoans(){return state.loans.filter(l=>['Ativa','Parcialmente devolvida','Vencida'].includes(l.status))}
function classForStatus(status){return status==='Disponível'?'available':status==='Cautelada'?'loaned':status==='Em manutenção'?'maintenance':status==='Vencida'?'overdue':status==='Reservada'?'reserved':''}
function formatDate(value){if(!value)return 'Sem previsão';let date=value.includes('T')?new Date(value):new Date(value+'T12:00:00');return date.toLocaleDateString('pt-BR')}
function showToast(message){const el=document.querySelector('#toast');el.textContent=message;el.classList.add('show');clearTimeout(showToast.timer);showToast.timer=setTimeout(()=>el.classList.remove('show'),2600)}
function addActivity(text){state.activities.unshift(text);state.activities=state.activities.slice(0,8)}

const views={
 dashboard(){
  const counts={available:state.equipment.filter(e=>e.status==='Disponível').length,loaned:state.equipment.filter(e=>e.status==='Cautelada').length,maintenance:state.equipment.filter(e=>e.status==='Em manutenção').length,active:activeLoans().length};
  return `<div class="page-head"><div><p class="eyebrow">VISÃO GERAL · PPSC</p><h1>Bom dia, Alex.</h1><p>Acompanhe o acervo e as movimentações da unidade.</p></div><button class="btn primary" data-go="newLoan">＋ Nova cautela</button></div>
  <section class="quick-grid"><div class="metric"><p>Equipamentos disponíveis</p><strong>${counts.available}</strong><small>prontos para cautela</small></div><div class="metric" style="--wash:#e5eff7"><p>Itens cautelados</p><strong>${counts.loaned}</strong><small>sob responsabilidade</small></div><div class="metric" style="--wash:#fae9d6"><p>Em manutenção</p><strong>${counts.maintenance}</strong><small>temporariamente indisponíveis</small></div><div class="metric" style="--wash:#edf0e7"><p>Cautelas ativas</p><strong>${counts.active}</strong><small>registros em aberto</small></div></section>
  <div class="dashboard-grid"><section class="panel"><div class="panel-head"><h2>Ações rápidas</h2></div><div class="action-cards"><button class="action-card" data-go="newLoan"><span>＋</span><b>Nova cautela</b><small>Vincular materiais</small></button><button class="action-card" data-go="officers"><span>⌕</span><b>Localizar policial</b><small>Busca por matrícula</small></button><button class="action-card" data-go="returns"><span>↩</span><b>Registrar devolução</b><small>Parcial ou total</small></button></div></section>
  <section class="panel"><div class="panel-head"><h2>Atividade recente</h2></div><div class="activity">${state.activities.map((a,i)=>`<div class="activity-item"><i></i><div><b>${esc(a)}</b><small>SIMB · PPSC</small></div><time>${i?'Anterior':'Agora'}</time></div>`).join('')}</div></section></div>`
 },
 officers(){
  const officer=officerQuery?officerByMatricula(officerQuery):null;
  return `<div class="page-head"><div><p class="eyebrow">EFETIVO PPSC</p><h1>Consultar policial</h1><p>A matrícula é o identificador principal no SIMB.</p></div></div><section class="panel"><form id="officerSearchForm" class="toolbar"><label class="search"><span>⌕</span><input name="matricula" inputmode="numeric" placeholder="Informe a matrícula (ex.: 202401)" value="${esc(officerQuery)}" required></label><button class="btn primary">Localizar policial</button></form>${officer?officerCard(officer,true):officerQuery?`<div class="empty">Nenhum policial encontrado para a matrícula informada.</div>`:`<div class="empty">Use uma matrícula fictícia entre <b>202401</b> e <b>202405</b>.</div>`}</section>`
 },
 newLoan(){
  return `<div class="page-head"><div><p class="eyebrow">MOVIMENTAÇÃO DE MATERIAL</p><h1>Nova cautela</h1><p>Identifique o policial e vincule os equipamentos disponíveis.</p></div></div><div class="step-line"><i class="active"></i><i class="${draft.officer?'active':''}"></i><i class="${draft.items.length?'active':''}"></i></div>
  ${!draft.officer?`<section class="panel"><div class="panel-head"><h2>1. Identificação por matrícula</h2></div><form id="loanOfficerForm" class="toolbar"><label class="search"><span>⌕</span><input name="matricula" inputmode="numeric" placeholder="Matrícula do policial" required autofocus></label><button class="btn primary">Localizar</button></form><p class="muted" style="font-size:.72rem;margin-top:14px">Teste com as matrículas 202401 a 202405.</p></section>`:`${officerCard(draft.officer,false)}<div class="loan-layout"><section class="panel"><div class="panel-head"><h2>2. Dados da cautela</h2></div><div class="form-grid"><label class="field">Tipo<select id="loanType"><option>Permanente</option><option>Temporária</option></select></label><label class="field">Previsão de devolução<input id="loanDue" type="date"></label></div><label class="field" style="margin-top:16px">Finalidade<input id="loanPurpose" placeholder="Ex.: Policiamento ostensivo"></label><label class="field" style="margin-top:16px">Observações<textarea id="loanNotes" placeholder="Informações complementares"></textarea></label></section><section class="panel"><div class="panel-head"><h2>3. Equipamentos (${draft.items.length})</h2><button class="link-btn" id="openPicker">＋ ADICIONAR</button></div><div class="loan-items">${draft.items.length?draft.items.map(id=>loanItem(equipmentById(id))).join(''):`<div class="empty">Nenhum equipamento vinculado.</div>`}</div><button id="finishLoan" class="btn primary full" ${draft.items.length?'':'disabled'}>FINALIZAR CAUTELA <span>→</span></button></section></div>`}`
 },
 loans(){return listLoans(false)},
 returns(){return listLoans(true)},
 equipment(){
  const q=equipmentQuery.toLowerCase();const list=state.equipment.filter(e=>Object.values(e).some(v=>String(v).toLowerCase().includes(q)));
  return `<div class="page-head"><div><p class="eyebrow">ACERVO PPSC</p><h1>Equipamentos</h1><p>${state.equipment.length} itens cadastrados nesta unidade.</p></div><button id="openEquipmentForm" class="btn primary">＋ Novo equipamento</button></div><section class="panel"><div class="toolbar" style="margin-bottom:16px"><label class="search"><span>⌕</span><input id="equipmentSearch" placeholder="Pesquisar acervo..." value="${esc(equipmentQuery)}"></label></div><div class="table-wrap"><table class="data-table"><thead><tr><th>Patrimônio</th><th>Categoria</th><th>Equipamento</th><th>Calibre</th><th>Série</th><th>Unidade</th><th>Situação</th></tr></thead><tbody>${list.map(e=>`<tr><td><b>${e.patrimonio}</b></td><td>${e.categoria}</td><td>${e.fabricante} ${e.modelo}</td><td>${e.calibre}</td><td>${e.serie}</td><td>${e.unidade}</td><td><span class="status ${classForStatus(e.status)}">${e.status}</span></td></tr>`).join('')}</tbody></table></div></section>`
 }
};

function officerCard(o,withAction){const loans=activeLoans().filter(l=>l.matricula===o.matricula).length;return `<div class="officer-card"><div class="avatar">${o.nome.split(' ').map(x=>x[0]).slice(0,2).join('')}</div><div><h3>${o.nome}</h3><p>Matrícula ${o.matricula} · ${o.graduacao}</p></div><div class="officer-meta"><span><small>SITUAÇÃO</small><b>${o.situacao}</b></span><span><small>CAUTELAS ATIVAS</small><b>${loans}</b></span>${withAction?`<button class="btn primary" data-start-loan="${o.matricula}" ${o.situacao!=='Ativo'?'disabled':''}>Nova cautela</button>`:''}</div></div>`}
function loanItem(e){return `<div class="loan-item"><div class="weapon-icon">◇</div><div><b>${e.fabricante} ${e.modelo}</b><small>${e.patrimonio} · ${e.calibre}</small></div><button class="remove-item" data-remove-item="${e.patrimonio}" aria-label="Remover">×</button></div>`}
function listLoans(forReturns){const loans=activeLoans();return `<div class="page-head"><div><p class="eyebrow">${forReturns?'RECEBIMENTO DE MATERIAL':'MOVIMENTAÇÕES ABERTAS'}</p><h1>${forReturns?'Devoluções':'Cautelas ativas'}</h1><p>${forReturns?'Selecione uma cautela para devolver itens.':'Acompanhe materiais sob responsabilidade.'}</p></div></div><section class="panel"><div class="table-wrap"><table class="data-table"><thead><tr><th>Cautela</th><th>Matrícula</th><th>Policial</th><th>Emissão</th><th>Itens pendentes</th><th>Situação</th><th></th></tr></thead><tbody>${loans.map(l=>`<tr><td><b>${l.id}</b></td><td>${l.matricula}</td><td>${esc(l.officerSnapshot.nome)}</td><td>${formatDate(l.created)}</td><td>${l.items.filter(i=>!i.returned).length}</td><td><span class="status ${l.status==='Vencida'?'overdue':'loaned'}">${l.status}</span></td><td>${forReturns?`<button class="row-btn" data-return-loan="${l.id}">Registrar devolução</button>`:'—'}</td></tr>`).join('')}</tbody></table>${loans.length?'':`<div class="empty">Não há cautelas em aberto.</div>`}</div></section>`}

function render(){document.querySelector('#content').innerHTML=views[currentView]();document.querySelector('#pageTitle').textContent=({dashboard:'Painel operacional',newLoan:'Nova cautela',officers:'Consulta de policial',loans:'Cautelas ativas',returns:'Devoluções',equipment:'Gestão de equipamentos'})[currentView];document.querySelectorAll('#navMenu button').forEach(b=>b.classList.toggle('active',b.dataset.view===currentView));bindViewEvents()}
function navigate(view){currentView=view;document.querySelector('#sidebar').classList.remove('open');document.querySelector('#scrim').classList.remove('show');render()}

function bindViewEvents(){
 document.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>navigate(b.dataset.go));
 document.querySelectorAll('[data-start-loan]').forEach(b=>b.onclick=()=>{draft={officer:officerByMatricula(b.dataset.startLoan),items:[]};navigate('newLoan')});
 document.querySelector('#officerSearchForm')?.addEventListener('submit',e=>{e.preventDefault();officerQuery=new FormData(e.target).get('matricula').trim();render()});
 document.querySelector('#loanOfficerForm')?.addEventListener('submit',e=>{e.preventDefault();const o=officerByMatricula(new FormData(e.target).get('matricula'));if(!o)return showToast('Matrícula não localizada.');if(o.situacao!=='Ativo')return showToast('O policial está afastado e não pode receber cautela.');draft.officer=o;render()});
 document.querySelector('#openPicker')?.addEventListener('click',()=>openPicker());
 document.querySelectorAll('[data-remove-item]').forEach(b=>b.onclick=()=>{draft.items=draft.items.filter(id=>id!==b.dataset.removeItem);render()});
 document.querySelector('#finishLoan')?.addEventListener('click',finishLoan);
 document.querySelectorAll('[data-return-loan]').forEach(b=>b.onclick=()=>renderReturn(b.dataset.returnLoan));
 const eqSearch=document.querySelector('#equipmentSearch');if(eqSearch)eqSearch.oninput=e=>{equipmentQuery=e.target.value;render()};
 document.querySelector('#openEquipmentForm')?.addEventListener('click',()=>document.querySelector('#equipmentFormDialog').showModal());
}

function openPicker(){document.querySelector('#pickerSearch').value='';renderPicker();document.querySelector('#equipmentDialog').showModal()}
function renderPicker(){const q=document.querySelector('#pickerSearch').value.toLowerCase();const available=state.equipment.filter(e=>e.status==='Disponível'&&Object.values(e).some(v=>String(v).toLowerCase().includes(q)));document.querySelector('#pickerList').innerHTML=available.map(e=>`<label class="picker-row"><input type="checkbox" value="${e.patrimonio}" ${draft.items.includes(e.patrimonio)?'checked':''}><span><b>${e.fabricante} ${e.modelo}</b><small>${e.patrimonio} · ${e.serie}</small></span><span class="status available">${e.calibre}</span></label>`).join('')||`<div class="empty">Nenhum equipamento disponível.</div>`;updatePickerCount()}
function updatePickerCount(){document.querySelector('#pickerCount').textContent=`${document.querySelectorAll('#pickerList input:checked').length} selecionado(s)`}
function finishLoan(){const purpose=document.querySelector('#loanPurpose').value.trim();if(!purpose)return showToast('Informe a finalidade da cautela.');const id=`CT-${String(Math.max(0,...state.loans.map(l=>Number(l.id.replace(/\D/g,''))))+1).padStart(6,'0')}`;const loan={id,matricula:draft.officer.matricula,officerSnapshot:{...draft.officer},type:document.querySelector('#loanType').value,purpose,due:document.querySelector('#loanDue').value,notes:document.querySelector('#loanNotes').value.trim(),created:new Date().toISOString(),status:'Ativa',items:draft.items.map(patrimonio=>({patrimonio,returned:false,condition:''}))};state.loans.push(loan);draft.items.forEach(id=>equipmentById(id).status='Cautelada');addActivity(`${id} emitida para ${draft.officer.nome}`);saveState();draft={officer:null,items:[]};showToast(`Cautela ${id} criada com sucesso.`);navigate('loans')}
function renderReturn(id){const loan=state.loans.find(l=>l.id===id);const pending=loan.items.filter(i=>!i.returned);document.querySelector('#content').innerHTML=`<div class="page-head"><div><p class="eyebrow">${loan.id}</p><h1>Registrar devolução</h1><p>Selecione os materiais recebidos e informe o estado.</p></div><button class="btn ghost" data-go="returns">← Voltar</button></div>${officerCard(loan.officerSnapshot,false)}<section class="panel"><form id="returnForm"><div class="loan-items">${pending.map(i=>{const e=equipmentById(i.patrimonio);return `<label class="loan-item"><input type="checkbox" name="item" value="${e.patrimonio}"><div class="weapon-icon">↩</div><div><b>${e.fabricante} ${e.modelo}</b><small>${e.patrimonio} · ${e.calibre}</small></div><select name="condition-${e.patrimonio}" aria-label="Estado de ${e.patrimonio}"><option>Bom</option><option>Regular</option><option>Danificado</option></select></label>`}).join('')}</div><div class="modal-actions"><button type="button" class="btn ghost" id="selectAllReturn">Selecionar todos</button><button class="btn primary">Confirmar devolução</button></div></form></section>`;document.querySelector('[data-go]').onclick=()=>navigate('returns');document.querySelector('#selectAllReturn').onclick=()=>document.querySelectorAll('input[name=item]').forEach(i=>i.checked=true);document.querySelector('#returnForm').onsubmit=e=>{e.preventDefault();const selected=[...new FormData(e.target).getAll('item')];if(!selected.length)return showToast('Selecione ao menos um equipamento.');selected.forEach(pid=>{const item=loan.items.find(i=>i.patrimonio===pid);item.returned=true;item.condition=document.querySelector(`[name="condition-${pid}"]`).value;item.returnedAt=new Date().toISOString();equipmentById(pid).status=item.condition==='Danificado'?'Em manutenção':'Disponível'});loan.status=loan.items.every(i=>i.returned)?'Encerrada':'Parcialmente devolvida';addActivity(`${selected.length} item(ns) devolvido(s) na ${loan.id}`);saveState();showToast(loan.status==='Encerrada'?'Cautela encerrada com sucesso.':'Devolução parcial registrada.');navigate('returns')}}

document.querySelector('#loginForm').addEventListener('submit',e=>{e.preventDefault();if(document.querySelector('#loginMatricula').value==='100001'&&document.querySelector('#loginPassword').value==='simb123'){sessionStorage.setItem(SESSION_KEY,'1');showApp()}else showToast('Credenciais inválidas. Use os dados de demonstração.')});
document.querySelector('#togglePassword').onclick=()=>{const input=document.querySelector('#loginPassword');input.type=input.type==='password'?'text':'password'};
document.querySelector('#logoutBtn').onclick=()=>{sessionStorage.removeItem(SESSION_KEY);document.querySelector('#appShell').classList.add('hidden');document.querySelector('#loginScreen').classList.remove('hidden')};
document.querySelector('#resetBtn').onclick=()=>{if(confirm('Restaurar todos os dados fictícios? As alterações locais serão perdidas.')){state=initialState();saveState();draft={officer:null,items:[]};showToast('Dados fictícios restaurados.');render()}};
document.querySelectorAll('#navMenu button').forEach(b=>b.onclick=()=>navigate(b.dataset.view));
document.querySelector('#openMenu').onclick=()=>{document.querySelector('#sidebar').classList.add('open');document.querySelector('#scrim').classList.add('show')};
document.querySelector('#closeMenu').onclick=document.querySelector('#scrim').onclick=()=>{document.querySelector('#sidebar').classList.remove('open');document.querySelector('#scrim').classList.remove('show')};
document.querySelector('#pickerSearch').oninput=renderPicker;
document.querySelector('#pickerList').onchange=updatePickerCount;
document.querySelector('#confirmPicker').onclick=e=>{e.preventDefault();draft.items=[...document.querySelectorAll('#pickerList input:checked')].map(i=>i.value);document.querySelector('#equipmentDialog').close();render()};
document.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>document.querySelector(`#${b.dataset.close}`).close());
document.querySelector('#newEquipmentForm').onsubmit=e=>{e.preventDefault();const data=Object.fromEntries(new FormData(e.target));if(state.equipment.some(x=>x.patrimonio.toLowerCase()===data.patrimonio.toLowerCase()))return showToast('Este patrimônio já está cadastrado.');state.equipment.push({...data,patrimonio:data.patrimonio.toUpperCase(),status:'Disponível',unidade:'PPSC'});addActivity(`${data.patrimonio.toUpperCase()} cadastrado no acervo`);saveState();e.target.reset();document.querySelector('#equipmentFormDialog').close();showToast('Equipamento cadastrado na unidade PPSC.');render()};
function showApp(){document.querySelector('#loginScreen').classList.add('hidden');document.querySelector('#appShell').classList.remove('hidden');render()}
if(sessionStorage.getItem(SESSION_KEY))showApp();
if('serviceWorker'in navigator&&location.protocol.startsWith('http'))navigator.serviceWorker.register('./sw.js').catch(()=>{});
