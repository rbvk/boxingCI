/* BOXINGCI · Comparador descriptivo, sin puntuaciones ni predicciones de victoria */
(()=>{'use strict';
const profiles={
pegador:{name:'Pegador',objective:'Conectar golpes contundentes sin regalar entradas previsibles.',risk:'Cargar golpes, perseguir y quedar expuesto ante salidas y contraataques.'},
distancia:{name:'Técnico a distancia',objective:'Conservar el espacio útil, trabajar con el jab y cambiar de ángulo.',risk:'Retroceder en línea recta y permitir que le corten el ring.'},
presion:{name:'Peleador de presión',objective:'Cerrar las salidas, entrar protegido y mantener el ritmo de ataque.',risk:'Caminar sin defensa hacia golpes de interceptación y agotar energía persiguiendo.'},
completo:{name:'Boxeador completo',objective:'Detectar qué fase y distancia favorece al rival para cambiar el plan.',risk:'Confiar en la versatilidad sin dominar suficientemente los ajustes necesarios.'},
contra:{name:'Contraatacador',objective:'Reconocer patrones y responder a ataques mal preparados.',risk:'Esperar demasiado y ceder iniciativa, tiempo y puntos.'},
cambio:{name:'Cambiador de guardia',objective:'Cambiar los ángulos sin perder equilibrio, protección ni distancia.',risk:'Ser alcanzado durante las transiciones de guardia.'},
zurdo:{name:'Zurdo especialista',objective:'Aprovechar líneas y posiciones propias de la guardia opuesta.',risk:'Dar por hecho que la guardia zurda ofrece ventajas automáticas.'}
};
const beats={pegador:'presion',presion:'distancia',distancia:'pegador'};
const reasons={
'pegador:presion':'El peleador de presión debe entrar en una zona donde el pegador puede conectar golpes de interceptación. La clave es si la entrada está protegida.',
'presion:distancia':'La presión puede reducir el espacio del técnico a distancia al cortar el ring y negar sus salidas. La clave es la calidad del desplazamiento.',
'distancia:pegador':'El técnico puede mantener al pegador fuera de su alcance, puntuar con el jab y cambiar de ángulo antes del golpe potente. La clave es sostener la distancia.'
};
const a=document.getElementById('style-a'),b=document.getElementById('style-b'),out=document.getElementById('compare-result');
if(!a||!b||!out)return;
const el=(tag,cls,content)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(content!==undefined)n.textContent=content;return n;};
function render(){
 const av=a.value,bv=b.value,pa=profiles[av],pb=profiles[bv];
 out.replaceChildren();
 out.append(el('span','compare-result-kicker','LECTURA DEL ENFRENTAMIENTO'));
 let title,explanation;
 if(av===bv){title='ENFRENTAMIENTO ENTRE PERFILES SIMILARES';explanation='Ninguno tiene ventaja por etiqueta. Importan la precisión, el ritmo, el control del espacio y los ajustes que consiga realizar cada boxeador.';}
 else if(beats[av]===bv){title='VENTAJA TÁCTICA POTENCIAL PARA '+pa.name.toUpperCase();explanation=reasons[av+':'+bv];}
 else if(beats[bv]===av){title='VENTAJA TÁCTICA POTENCIAL PARA '+pb.name.toUpperCase();explanation=reasons[bv+':'+av];}
 else{title='SIN VENTAJA PREDETERMINADA';explanation='Esta combinación no pertenece al triángulo clásico. El resultado depende de cómo se mezclan el estilo, la guardia, la lectura, la ejecución y los ajustes de cada competidor.';}
 out.append(el('h3','',title),el('p','',explanation));
 const tips=el('div','compare-tips');
 for(const [p,letter] of [[pa,'A'],[pb,'B']]){
  const block=el('div','');block.append(el('strong','',letter+' · '+p.name),el('p','',p.objective+' Riesgo: '+p.risk));tips.append(block);
 }
 out.append(tips);
}
a.addEventListener('change',render);b.addEventListener('change',render);
document.getElementById('compare-swap')?.addEventListener('click',()=>{const t=a.value;a.value=b.value;b.value=t;render();});
document.getElementById('compare-reset')?.addEventListener('click',()=>{a.value='pegador';b.value='presion';render();});
document.querySelectorAll('.rps-try').forEach(btn=>btn.addEventListener('click',()=>{a.value=btn.dataset.first;b.value=btn.dataset.second;render();document.getElementById('comparador').scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});}));
render();
})();
