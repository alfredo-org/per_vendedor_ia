const views={ventas:'Venta asistida por WhatsApp',inventario:'Inventario de repuestos',pedidos:'Pedidos conversacionales',arquitectura:'Arquitectura del sistema'};
const nav=[...document.querySelectorAll('[data-view]')];
const toast=document.getElementById('toast');
const feed=document.getElementById('chatFeed');
const runDemo=document.getElementById('runDemo');
const resetDemo=document.getElementById('resetDemo');
const reserveButton=document.getElementById('reserveButton');
const progressLabel=document.getElementById('progressLabel');
const progressSteps=[...document.querySelectorAll('#salesProgress .step')];
let step=0;
let orderCompleted=false;

const initialFeed=feed.innerHTML;

const demo=[
  {side:'client',text:'Sí, el ProBrake. ¿Me puedes dejar uno en Renca? Lo pasa a buscar un chofer como a las 4.'},
  {side:'ai',text:'Perfecto. Antes de reservar: 1 kit BRK-FH5-E6, $186.900 + IVA ($222.411 final), retiro hoy en Renca. ¿Confirmas la reserva a nombre de Transportes San Martín?'},
  {side:'client',text:'Confirmado. Déjalo a nombre de Marcelo Soto.'},
  {side:'ai',text:'Listo. Stock reservado: 1 kit. Nota de venta NV-58131 generada · Total $222.411 · Retiro en Renca desde las 16:00. El chofer puede indicar NV-58131 en caja.'},
  {side:'ai',text:'Como dato útil: para ese FH también tenemos sensor de desgaste compatible. No lo agregué porque no lo pediste. Si quieres, te lo cotizo antes del retiro.'}
];

function say(text){
  toast.textContent=text;
  toast.classList.add('show');
  clearTimeout(say.timer);
  say.timer=setTimeout(()=>toast.classList.remove('show'),2400);
}

function activateView(view){
  nav.forEach(button=>button.classList.toggle('active',button.dataset.view===view));
  document.querySelectorAll('.view').forEach(section=>section.classList.toggle('active',section.id===view));
  document.getElementById('viewTitle').textContent=views[view];
  window.scrollTo({top:0,behavior:'smooth'});
}

nav.forEach(button=>button.addEventListener('click',()=>activateView(button.dataset.view)));

document.getElementById('themeToggle').addEventListener('click',()=>{
  document.body.classList.toggle('dark');
  say(document.body.classList.contains('dark')?'Modo oscuro activado':'Modo claro activado');
});

function addMessage(item){
  const el=document.createElement('div');
  el.className=`msg ${item.side}`;
  const time=new Date().toLocaleTimeString('es-CL',{hour:'2-digit',minute:'2-digit'});
  el.innerHTML=`${item.text}<span>${time}${item.side==='ai'?' · IA':''}</span>`;
  feed.appendChild(el);
  feed.scrollTo({top:feed.scrollHeight,behavior:'smooth'});
}

function setProgress(stage,label){
  progressLabel.textContent=label;
  progressSteps.forEach((node,index)=>{
    const n=index+1;
    node.classList.toggle('done',n<stage);
    node.classList.toggle('active',n===stage);
  });
}

function enableReservation(){
  const indicator=document.getElementById('orderIndicator');
  indicator.textContent='Cliente confirmó';
  indicator.className='statuschip ready';
  reserveButton.disabled=false;
  reserveButton.textContent='Generar reserva + NV';
}

function completeOrder(showToast=true){
  if(orderCompleted)return;
  orderCompleted=true;
  document.getElementById('orderStatus').textContent='NV-58131 generada';
  const indicator=document.getElementById('orderIndicator');
  indicator.textContent='Reservado';
  indicator.className='statuschip ready';
  reserveButton.disabled=true;
  reserveButton.textContent='Reserva confirmada';
  document.getElementById('miniOrder').textContent='NV-58131';
  const miniStatus=document.getElementById('miniStatus');
  miniStatus.textContent='Listo para retiro';
  miniStatus.className='statuschip ready';
  setProgress(6,'Reserva y nota de venta generadas');
  if(showToast)say('Stock reservado y nota de venta generada');
}

function advanceDemo(){
  if(step>=demo.length){
    say('Caso completado. Puedes reiniciarlo para repetir la demo.');
    return;
  }

  addMessage(demo[step]);
  step+=1;

  if(step===1){
    setProgress(5,'Cliente eligió producto y sucursal');
    say('Intención de compra detectada');
  }else if(step===2){
    setProgress(5,'Esperando confirmación explícita');
    say('La IA repite producto, precio, IVA y retiro');
  }else if(step===3){
    enableReservation();
    setProgress(5,'Confirmación explícita recibida');
    say('Reserva autorizada por el cliente');
  }else if(step===4){
    completeOrder();
  }else if(step===5){
    runDemo.textContent='Caso completado';
    say('Upselling sugerido sin modificar la venta');
  }
}

function resetCase(){
  step=0;
  orderCompleted=false;
  feed.innerHTML=initialFeed;
  runDemo.textContent='Continuar caso';
  document.getElementById('orderStatus').textContent='Borrador automático';
  const indicator=document.getElementById('orderIndicator');
  indicator.textContent='Sin confirmar';
  indicator.className='statuschip';
  reserveButton.disabled=true;
  reserveButton.textContent='Esperando confirmación del cliente';
  document.getElementById('miniOrder').textContent='Borrador';
  const miniStatus=document.getElementById('miniStatus');
  miniStatus.textContent='En conversación';
  miniStatus.className='statuschip';
  setProgress(4,'Oferta validada');
  say('Caso reiniciado');
}

runDemo.addEventListener('click',advanceDemo);
resetDemo.addEventListener('click',resetCase);

reserveButton.addEventListener('click',()=>{
  if(reserveButton.disabled||orderCompleted)return;
  addMessage(demo[3]);
  step=Math.max(step,4);
  completeOrder();
});

const audioButton=document.querySelector('.audio button');
if(audioButton){
  audioButton.addEventListener('click',event=>{
    const playing=event.currentTarget.textContent==='Ⅱ';
    event.currentTarget.textContent=playing?'▶':'Ⅱ';
    say(playing?'Audio pausado':'Audio transcrito localmente en el M6');
  });
}
