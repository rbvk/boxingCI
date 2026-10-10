/* BOXINGCI · Weight Class Finder · Fuentes oficiales (revisión octubre 2026)
World Boxing 2025+: https://worldboxing.org/wp-content/uploads/2024/11/World-Boxing-Competition-Rules-Nov-2024-Approved.pdf
LA28: https://worldboxing.org/ioc-approves-olympic-qualification-system-for-boxing-competition-at-la28/
*/
(function(root){
"use strict";
const row=(min,max,code,name)=>({min,max,code,name});
const men=[
row(47,50,"M50","Mosca"),row(50,55,"M55","Gallo"),row(55,60,"M60","Ligero"),
row(60,65,"M65","Wélter"),row(65,70,"M70","Superwélter"),row(70,75,"M75","Mediano"),
row(75,80,"M80","Semipesado"),row(80,85,"M85","Crucero"),row(85,90,"M90","Pesado"),
row(90,null,"M90+","Superpesado")];
const women=[
row(45,48,"W48","Minimosca"),row(48,51,"W51","Mosca"),row(51,54,"W54","Gallo"),
row(54,57,"W57","Pluma"),row(57,60,"W60","Ligero"),row(60,65,"W65","Wélter"),
row(65,70,"W70","Superwélter"),row(70,75,"W75","Mediano"),row(75,80,"W80","Semipesado"),
row(80,null,"W80+","Pesado")];
const u17=[
row(44,46,"46","Paja"),row(46,48,"48","Minimosca"),row(48,50,"50","Mosca"),
row(50,52,"52","Supergallo"),row(52,54,"54","Gallo"),row(54,57,"57","Pluma"),
row(57,60,"60","Ligero"),row(60,63,"63","Superligero"),row(63,66,"66","Wélter"),
row(66,70,"70","Superwélter"),row(70,75,"75","Mediano"),row(75,80,"80","Semipesado"),
row(80,null,"80+","Pesado")];
/* LA28: topes publicados oficialmente. Los mínimos de primera categoría son
   referencias generales World Boxing y NO mínimos olímpicos oficiales. */
const olympicMen=[
row(47,55,"M55","Gallo"),row(55,60,"M60","Ligero"),row(60,65,"M65","Wélter"),
row(65,70,"M70","Superwélter"),row(70,80,"M80","Semipesado"),
row(80,90,"M90","Pesado"),row(90,null,"M90+","Superpesado")];
const olympicWomen=[
row(45,51,"W51","Mosca"),row(51,54,"W54","Gallo"),row(54,57,"W57","Pluma"),
row(57,60,"W60","Ligero"),row(60,65,"W65","Wélter"),row(65,70,"W70","Superwélter"),
row(70,75,"W75","Mediano")];
function parseWeight(v){
 if(typeof v==="number")return Number.isFinite(v)&&v>0?v:null;
 if(typeof v!=="string"||! /^\s*\d+(?:[,.]\d{1,2})?\s*$/.test(v))return null;
 const n=Number(v.trim().replace(",","."));return Number.isFinite(n)&&n>0?n:null;
}
function ageGroup(a){
 if(!Number.isInteger(a)||a<0||a>120)return null;
 if(a>=19&&a<=40)return"Elite";
 if(a===17||a===18)return"U19";
 if(a===15||a===16)return"U17";
 if(a===13||a===14)return"U15";
 return a>40?"Masters":"No cubierta";
}
function getClasses(format,sex,age){
 const group=ageGroup(age);
 if(!group||!["hombre","mujer"].includes(sex)||!["world","la28"].includes(format))
  return{group,classes:null,error:"Completa una edad válida, modalidad y división masculina o femenina."};
 if(["U15","Masters","No cubierta"].includes(group))
  return{group,classes:null,error:"Este grupo de edad depende de reglamentos particulares. Consulta al organizador; no se asigna una categoría automáticamente."};
 if(format==="la28"&&group!=="Elite")
  return{group,classes:null,error:"LA28 se muestra únicamente como referencia Elite. Los demás grupos requieren revisar las normas del evento."};
 const classes=format==="la28"?(sex==="hombre"?olympicMen:olympicWomen)
   :group==="U17"?u17.map(c=>({...c,code:(sex==="hombre"?"M":"W")+c.code}))
   :sex==="hombre"?men:women;
 return{group,classes,error:null};
}
function findClass(weight,classes){
 if(weight===null||!classes)return null;
 return classes.find(c=>weight>c.min&&(c.max===null||weight<=c.max))||null;
}
function calculate(input){
 const age=input.age===""?NaN:Number(input.age);
 const current=parseWeight(input.current),target=parseWeight(input.target);
 const sel=getClasses(input.format,input.sex,age);
 if(sel.error)return{...sel,error:sel.error};
 if(current===null||target===null)
  return{...sel,current,target,error:"Introduce ambos pesos válidos en kg (acepta coma decimal)."};
 const from=findClass(current,sel.classes),to=findClass(target,sel.classes);
 const difference=+(target-current).toFixed(2),percent=+(difference/current*100).toFixed(2);
 return{...sel,current,target,from,to,difference,percent,
  changesClass:!!(from&&to&&from.code!==to.code),
  error:(!from||!to)?"Uno de los pesos no tiene categoría disponible en este reglamento.":null};
}
const fmt=n=>Number(n).toLocaleString("es-CL",{maximumFractionDigits:2});
function rangeText(c,format){
 if(!c)return"Sin categoría";
 if(c.max===null)return"Más de "+fmt(c.min)+" kg";
 return format==="la28"?"Hasta "+fmt(c.max)+" kg*":
 "Más de "+fmt(c.min)+" y hasta "+fmt(c.max)+" kg";
}
const api={parseWeight,ageGroup,getClasses,findClass,calculate,rangeText,fmt};
if(typeof module!=="undefined"&&module.exports)module.exports=api;
if(!root.document)return;
const doc=root.document,form=doc.getElementById("weightForm");
if(!form)return;
const byId=id=>doc.getElementById(id),output=byId("results"),map=byId("classMap"),
 copyButton=byId("copyResult");
let copyValue="";
function make(tag,cls,textValue){
 const el=doc.createElement(tag); if(cls)el.className=cls;
 if(textValue!==undefined)el.textContent=textValue;return el;
}
function card(title,w,c,format){
 const el=make("article","resultCard");
 el.append(make("p","resultEyebrow",title),make("div","resultLarge",fmt(w)+" kg"),
  make("h3","",c?c.name+" · "+c.code:"Sin división disponible"),
  make("p","",rangeText(c,format)));return el;
}
function render(){
 const input={format:byId("format").value,sex:byId("sex").value,age:byId("age").value,
  current:byId("currentWeight").value,target:byId("targetWeight").value};
 const r=calculate(input);output.replaceChildren();map.replaceChildren();
 copyButton.disabled=true;copyValue="";byId("copyStatus").textContent="";
 if(!r.classes){output.append(make("p","feedback",r.error));return;}
 output.append(make("p","categoryLine","División de edad: "+r.group+" · "+
   (input.format==="world"?"World Boxing 2026":"LA28 (2028)")));
 if(r.current===null||r.target===null){output.append(make("p","feedback",r.error));return;}
 const grid=make("div","resultGrid");
 grid.append(card("Peso actual",r.current,r.from,input.format),
  card("Peso objetivo",r.target,r.to,input.format));output.append(grid);
 const same=r.from&&r.to?(r.changesClass?"Cambia de división: "+r.from.code+" → "+r.to.code:
 "Permanece en "+r.from.code):"Sin comparación reglamentaria completa";
 const diff=r.difference===0?"Sin variación de peso":
  "Diferencia: "+(r.difference<0?"bajar ":"subir ")+fmt(Math.abs(r.difference))+
  " kg ("+fmt(Math.abs(r.percent))+"%)";
 const change=make("div","resultChange");
 change.append(make("strong","",same),make("span","",diff));output.append(change);
 if(r.error)output.append(make("p","feedback",r.error));
 if(input.format==="la28")output.append(make("p","fineprint",
  "* LA28 publicó límites máximos, no todos los mínimos. Comprueba el reglamento específico del evento."));
 map.append(make("h3","","Mapa de divisiones"));
 const list=make("div","divisionList");
 r.classes.forEach(c=>{
  const current=r.from&&c.code===r.from.code,target=r.to&&c.code===r.to.code;
  const rowEl=make("div","divisionRow"+(current||target?" highlight":""));
  const right=make("span","divisionRight");
  right.append(make("span","",c.max===null?"> "+fmt(c.min)+" kg":"≤ "+fmt(c.max)+" kg"));
  if(current)right.append(make("b","tagCurrent","ACTUAL"));
  if(target)right.append(make("b","tagTarget","OBJETIVO"));
  rowEl.append(make("span","",c.name+" · "+c.code),right);list.append(rowEl);
 });
 map.append(list);
 if(r.from&&r.to){
  copyValue="BOXINGCI · Categorías de peso\n"+(input.format==="world"?"World Boxing 2026":"LA28")+
   " · "+r.group+"\nActual: "+fmt(r.current)+" kg → "+r.from.name+" ("+r.from.code+")"+
   "\nObjetivo: "+fmt(r.target)+" kg → "+r.to.name+" ("+r.to.code+")"+
   "\n"+same+"\n"+diff+"\nOrientativo; consulta reglamento y no realices cortes rápidos de peso.";
  copyButton.disabled=false;
 }
}
form.addEventListener("input",render);form.addEventListener("change",render);
byId("example").addEventListener("click",()=>{
 byId("age").value="30";byId("sex").value="hombre";byId("format").value="world";
 byId("currentWeight").value="74";byId("targetWeight").value="70";render();
});
copyButton.addEventListener("click",async()=>{
 if(!copyValue)return;
 try{await root.navigator.clipboard.writeText(copyValue);
  byId("copyStatus").textContent="Resultado copiado.";}
 catch(e){byId("copyStatus").textContent="No se pudo copiar. Prueba desde HTTPS.";}
});
render();
})(typeof window!=="undefined"?window:globalThis);
