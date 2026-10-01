(function(){
var root=document.documentElement,reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var SPY=['padaria','confeitaria','restaurante','sobre','contato'],active='',open=false,raf=0;
var btn=document.getElementById('sm-menu-btn'),panel=document.getElementById('sm-menu'),icon=document.getElementById('sm-menu-icon');
function setMenu(v){open=v;panel.hidden=!v;btn.setAttribute('aria-expanded',v?'true':'false');btn.setAttribute('aria-label',v?'Fechar menu':'Abrir menu');icon.setAttribute('d',v?'M4 4L16 16M16 4L4 16':'M3 6H17M3 10H17M3 14H17');tick();}
if(btn&&panel){btn.addEventListener('click',function(){setMenu(!open)});panel.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){setMenu(false)})});}
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&open){setMenu(false);btn.focus();}});
function tick(){
  var y=window.scrollY,vh=window.innerHeight,max=root.scrollHeight-vh;
  root.style.setProperty('--sm-prog',max>0?(y/max).toFixed(4):'0');
  root.style.setProperty('--sm-sh',(y>24||open)?'1':'0');
  var line=vh*.35,cur='';
  SPY.forEach(function(id){var el=document.getElementById(id);if(!el)return;var b=el.getBoundingClientRect();if(b.top<=line&&b.bottom>line)cur=id;});
  if(cur!==active){active=cur;SPY.forEach(function(id){var on=id===cur;root.style.setProperty('--sm-on-'+id,on?'1':'0');root.style.setProperty('--sm-c-'+id,on?'#E2BE78':'#EFE4D3');var a=document.querySelector('.sm-desk a[href="#'+id+'"]');if(a)a.setAttribute('aria-current',on?'location':'false');});}
}
function onScroll(){if(raf)return;raf=requestAnimationFrame(function(){raf=0;tick();});}
window.addEventListener('scroll',onScroll,{passive:true});
window.addEventListener('resize',function(){if(window.innerWidth>=960&&open)setMenu(false);onScroll();});
tick();
var dow=new Date().getDay();
document.querySelectorAll('[data-dow]').forEach(function(li){
  if(+li.getAttribute('data-dow')!==dow)return;
  var sr=li.querySelector('span:nth-child(2)');if(sr)sr.textContent+=' (hoje)';
  if(dow!==0){li.style.background='#A3202B';li.style.color='#FFF4E6';li.style.border='1px solid #A3202B';}
  var tag=document.createElement('span');tag.setAttribute('aria-hidden','true');tag.textContent='hoje';
  tag.style.cssText="position:absolute;bottom:calc(100% + 3px);left:50%;transform:translateX(-50%);font-family:'Bodoni Moda',serif;font-style:italic;font-size:15px;letter-spacing:0;color:#A3202B;white-space:nowrap";
  li.appendChild(tag);
});
var hoje=document.getElementById('sm-hoje');
if(hoje&&dow===0)hoje.textContent='Domingo o fogão descansa. Mas a vitrine de doces te espera!';
if(reduced||!('IntersectionObserver' in window))return;
var ease='cubic-bezier(.2,.7,.2,1)';
var io=new IntersectionObserver(function(entries){var i=0;entries.forEach(function(en){if(!en.isIntersecting)return;var el=en.target,d=Math.min(i++,6)*90;el.style.transitionDelay=d+'ms';el.style.opacity='1';el.style.transform='none';io.unobserve(el);setTimeout(function(){el.style.transition=el._t||'';el.style.transitionDelay='';el.style.transform=el._x||'';},900+d);});},{rootMargin:'0px 0px -6% 0px',threshold:.06});
document.querySelectorAll('[data-reveal]').forEach(function(el){if(el.getBoundingClientRect().top<window.innerHeight)return;el._t=el.style.transition;el._x=el.style.transform;el.style.opacity='0';el.style.transform='translateY(22px)';el.style.transition='opacity .8s '+ease+', transform .8s '+ease;io.observe(el);});
var sec=document.getElementById('espaco');
if(sec&&sec.getBoundingClientRect().top>window.innerHeight*.6){sec.style.setProperty('--sm-led','0');var led=new IntersectionObserver(function(es){if(!es[0].isIntersecting)return;led.disconnect();[[0,'.55'],[110,'.1'],[210,'.8'],[300,'.25'],[440,'1']].forEach(function(p){setTimeout(function(){sec.style.setProperty('--sm-led',p[1])},p[0]);});},{rootMargin:'0px 0px -40% 0px'});led.observe(sec);}
function setV(el,v){for(var k in v)el.style.setProperty(k,v[k]);}
document.querySelectorAll('[data-tilt]').forEach(function(el){
  el.addEventListener('pointermove',function(e){if(e.pointerType!=='mouse')return;var b=el.getBoundingClientRect(),x=(e.clientX-b.left)/b.width,y=(e.clientY-b.top)/b.height;setV(el,{'--rx':((.5-y)*7).toFixed(2)+'deg','--ry':((x-.5)*9).toFixed(2)+'deg','--ty':'-4px','--mx':(x*100).toFixed(1)+'%','--my':(y*100).toFixed(1)+'%','--sheen':'1'});});
  el.addEventListener('pointerleave',function(){setV(el,{'--rx':'0deg','--ry':'0deg','--ty':'0px','--sheen':'0'});});
});
})();
