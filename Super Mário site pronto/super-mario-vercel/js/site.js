(function(){
var d=document,w=window,root=d.documentElement,reduced=w.matchMedia('(prefers-reduced-motion: reduce)').matches;
var ABRE='06:00',FECHA='20:00',ABRE_DOMINGO=false;
var DESCS=["Fornadas ao longo do dia, do pão francês ao croissant amanteigado.","Doces finos com acabamento de confeitaria europeia.","Comida caseira de segunda a sábado. O cardápio muda todo dia."];
function isWide(){return w.innerWidth>=900;}
/* menu */
var btn=d.getElementById('sm-menu-btn'),wrap=d.getElementById('sm-menu-wrap'),icon=d.getElementById('sm-menu-icon'),open=false;
function setMenu(v){open=v;if(!wrap||!btn)return;wrap.hidden=!v;btn.setAttribute('aria-expanded',v?'true':'false');btn.setAttribute('aria-label',v?'Fechar menu':'Abrir menu');if(icon)icon.setAttribute('d',v?'M4 4L16 16M16 4L4 16':'M3 7H17M3 13H17');d.body.classList.toggle('sm-lock',v);tick();}
if(btn)btn.addEventListener('click',function(){setMenu(!open);});
if(wrap)wrap.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){setMenu(false);});});
d.addEventListener('click',function(e){if(open&&!e.target.closest('header'))setMenu(false);});
d.addEventListener('keydown',function(e){if(e.key==='Escape'&&open){setMenu(false);btn&&btn.focus();}});
/* status aberto/fechado */
function toMin(s){var p=s.split(':');return(+p[0]||0)*60+(+p[1]||0);}
function fmt(s){return s.replace(':00','h').replace(':','h');}
function status(){var n=new Date(),m=n.getHours()*60+n.getMinutes(),sun=n.getDay()===0&&!ABRE_DOMINGO;var o=!sun&&m>=toMin(ABRE)&&m<toMin(FECHA);
  var t=o?'Aberto agora · fecha às '+fmt(FECHA):'Fechado agora · abre às '+fmt(ABRE);
  d.querySelectorAll('.sm-status').forEach(function(el){el.textContent=t;});
  d.querySelectorAll('.sm-dot').forEach(function(el,i){el.style.background=o?'#7AC98C':'#D9886A';el.style.animation=(o&&!reduced&&i===0)?'v4pulse 1.8s ease-out infinite':'none';});}
status();setInterval(status,60000);
/* abas do cardápio */
var tabs=[].slice.call(d.querySelectorAll('[data-tab]')),pill=d.getElementById('sm-tab-pill'),desc=d.getElementById('sm-catdesc');
function pick(i,focus){tabs.forEach(function(t,j){var on=j===i;t.setAttribute('aria-selected',on?'true':'false');t.tabIndex=on?0:-1;t.style.color=on?'#F4EBDD':'#4A3426';});
  d.querySelectorAll('[data-panel]').forEach(function(p){var on=+p.getAttribute('data-panel')===i;p.hidden=!on;if(on&&!reduced){p.querySelectorAll('article').forEach(function(a){a.style.animation='none';void a.offsetWidth;a.style.animation='';});}});
  if(pill)pill.style.transform='translateX('+(i*100)+'%)';if(desc)desc.textContent=DESCS[i];if(focus)tabs[i].focus();}
tabs.forEach(function(t,i){t.addEventListener('click',function(){pick(i);});t.addEventListener('keydown',function(e){var k=e.key;if(k==='ArrowRight'||k==='ArrowLeft'){e.preventDefault();pick((i+(k==='ArrowRight'?1:tabs.length-1))%tabs.length,true);}});});
var cur=tabs.findIndex(function(t){return t.getAttribute('aria-selected')==='true';});pick(cur<0?0:cur);
/* nosso dia + barra flutuante */
var steps=[].slice.call(d.querySelectorAll('[data-etapa]')),imgs=[].slice.call(d.querySelectorAll('[data-etapa-img]')),hora=d.getElementById('sm-etapa-hora'),fab=d.getElementById('sm-fab'),etapa=-1,fabOn=null,raf=0;
var HORAS=steps.map(function(s){var p=s.querySelector('p');return p?p.textContent:'';});
function tick(){var vh=w.innerHeight,mid=vh*.5,wide=isWide(),e=etapa<0?0:etapa;
  steps.forEach(function(s){var b=s.getBoundingClientRect();if(b.top<mid&&b.bottom>mid)e=+s.getAttribute('data-etapa');});
  if(e!==etapa){etapa=e;imgs.forEach(function(im){var on=+im.getAttribute('data-etapa-img')===e;im.style.opacity=on?'1':'0';im.style.transform='scale('+(on?1:1.06)+')';});if(hora)hora.textContent=HORAS[e]||'';}
  steps.forEach(function(s){s.style.opacity=(!wide||+s.getAttribute('data-etapa')===etapa)?'1':'.35';});
  var on=!wide&&!open&&w.scrollY>vh*.6;
  if(fab&&on!==fabOn){fabOn=on;fab.style.opacity=on?'1':'0';fab.style.transform='translateY('+(on?'0':'120%')+')';fab.style.pointerEvents=on?'auto':'none';fab.tabIndex=on?0:-1;fab.setAttribute('aria-hidden',on?'false':'true');}}
function onScroll(){if(raf)return;raf=requestAnimationFrame(function(){raf=0;tick();});}
w.addEventListener('scroll',onScroll,{passive:true});
w.addEventListener('resize',function(){if(isWide()&&open)setMenu(false);onScroll();});
tick();
/* mapa: carrega sob demanda */
var map=d.getElementById('sm-map'),mapBtn=d.getElementById('sm-map-btn');
function loadMap(){if(map&&!map.src){map.src=map.getAttribute('data-src');}if(mapBtn)mapBtn.hidden=true;}
if(mapBtn)mapBtn.addEventListener('click',loadMap);
if(map){if(isWide()){if('IntersectionObserver' in w){var mo=new IntersectionObserver(function(es){if(es[0].isIntersecting){loadMap();mo.disconnect();}},{rootMargin:'400px'});mo.observe(map);}else loadMap();}}
w.addEventListener('resize',function(){if(isWide()&&map&&!map.src)loadMap();});
/* revelar ao rolar */
if(reduced||!('IntersectionObserver' in w))return;
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;e.target.style.opacity='1';e.target.style.transform='none';io.unobserve(e.target);});},{rootMargin:'0px 0px -8% 0px'});
d.querySelectorAll('[data-reveal]').forEach(function(el){if(el.getBoundingClientRect().top<w.innerHeight)return;el.style.opacity='0';el.style.transform='translateY(28px)';el.style.transition='opacity 1s cubic-bezier(.2,.7,.2,1), transform 1s cubic-bezier(.2,.7,.2,1)';io.observe(el);});
})();
