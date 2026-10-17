/* BOXINGCI shared enhancements — menu, reading indicator, lightweight motion. No dependencies. */
(()=>{'use strict';
 const root=document.documentElement;
 const header=document.querySelector('.site-header');
 const toggle=header?.querySelector('.menu-toggle');
 const nav=header?.querySelector('#site-nav');
 const dropdown=header?.querySelector('.nav-dropdown');

 // Biblioteca: añadir la nueva sección a todos los menús existentes sin duplicar enlaces.
 const libraryPanel=header?.querySelector('.nav-dropdown-panel');
 if(libraryPanel&&!Array.from(libraryPanel.querySelectorAll('a')).some(a=>/\/boxeo-sucio\//.test(new URL(a.href,document.baseURI).pathname))){
  const menuScript=document.querySelector('script[src*="site-ui.js"]');
  if(menuScript){
   const link=document.createElement('a');
   link.href=new URL('../biblioteca/boxeo-sucio/index.html',menuScript.src).href;
   link.textContent='Boxeo sucio';
   if(/\/biblioteca\/boxeo-sucio\//.test(window.location.pathname))link.setAttribute('aria-current','page');
   libraryPanel.append(link);
  }
 }

 if(header&&toggle&&nav){
  root.classList.add('has-js');
  function setMenu(open){const yes=!!open;header.classList.toggle('menu-open',yes);toggle.setAttribute('aria-expanded',String(yes));toggle.setAttribute('aria-label',yes?'Cerrar menú de navegación':'Abrir menú de navegación');const lbl=toggle.querySelector('.menu-toggle-label');if(lbl)lbl.textContent=yes?'CERRAR':'MENÚ';if(!yes&&dropdown)dropdown.open=false;}
  toggle.addEventListener('click',()=>setMenu(!header.classList.contains('menu-open')));
  document.addEventListener('keydown',ev=>{if(ev.key==='Escape'){const wasOpen=header.classList.contains('menu-open');setMenu(false);if(wasOpen)toggle.focus();}});
  document.addEventListener('pointerdown',ev=>{if(!header.contains(ev.target)){setMenu(false);}});
  nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));
  const desktop=window.matchMedia('(min-width:901px)');
  const onResize=()=>{if(desktop.matches)setMenu(false);};
  desktop.addEventListener?.('change',onResize);
 }
 const article=document.querySelector('.article');
 if(article){
  const track=document.createElement('div');track.className='reading-progress';track.setAttribute('aria-hidden','true');
  const meter=document.createElement('div');meter.className='reading-progress-meter';track.append(meter);document.body.append(track);
  const percent=document.createElement('div');percent.className='reading-percent';percent.setAttribute('aria-hidden','true');document.body.append(percent);
  let requested=false;
  const update=()=>{requested=false;
   const rect=article.getBoundingClientRect();const pageTop=rect.top+window.scrollY;
   const start=pageTop-Math.min(window.innerHeight*.38,180);
   const end=pageTop+article.offsetHeight-window.innerHeight*.68;
   const fraction=Math.max(0,Math.min(1,(window.scrollY-start)/Math.max(1,end-start)));
   const value=Math.round(fraction*100);
   meter.style.transform='scaleX('+fraction+')';
   percent.innerHTML='LECTURA <b>'+value+'%</b>';
   percent.classList.toggle('is-active',window.scrollY>Math.max(80,start));
  };
  const schedule=()=>{if(!requested){requested=true;window.requestAnimationFrame(update);}};
  window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule,{passive:true});schedule();
 }
 if('IntersectionObserver' in window&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
  const revealItems=[...document.querySelectorAll('.editorial-section,.editorial-card,.feature-card,.home-outro')];
  if(revealItems.length){
   const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}}),{threshold:.08,rootMargin:'0px 0px -35px 0px'});
   revealItems.forEach(el=>{el.classList.add('is-revealing');observer.observe(el);});
  }
 }
 document.querySelectorAll('.home-site img').forEach(img=>img.addEventListener('error',()=>img.parentElement?.classList.add('image-unavailable')));
})();