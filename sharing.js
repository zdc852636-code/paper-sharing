(()=>{
const $=s=>document.querySelector(s);
const saved=(k,f)=>{try{return localStorage.getItem(k)||f}catch{return f}};
const save=(k,v)=>{try{localStorage.setItem(k,v)}catch{}};
function setFont(v){const n=Math.max(12,Math.min(40,Number(v)||21));$('#font').value=n;$('#font-number').value=n;document.documentElement.style.setProperty('--type',n+'px');save('weight-sharing-font',n)}
if($('#font')){setFont(saved('weight-sharing-font','21'));$('#font').oninput=e=>setFont(e.target.value);$('#font-number').oninput=e=>{const n=Number(e.target.value);if(n>=12&&n<=40)setFont(n)};$('#font-number').onchange=e=>setFont(e.target.value)}
const slides=[...document.querySelectorAll('.slide')];if(!slides.length)return;
let current=0,presenting=false,lang=saved('weight-sharing-lang','zh');
if(!['zh','en'].includes(lang))lang='zh';
function language(){document.documentElement.dataset.lang=lang;document.documentElement.lang=lang==='zh'?'zh-CN':'en';$('#language').textContent=lang==='zh'?'EN':'中文';save('weight-sharing-lang',lang)}
function nav(){slides.forEach((s,i)=>s.classList.toggle('active',i===current));$('#prev').disabled=current===0;$('#next').disabled=current===slides.length-1;$('#page-count').textContent=String(current+1).padStart(2,'0')+' / '+slides.length;$('.progress i').style.width=((current+1)/slides.length*100)+'%'}
function go(n,hash=true){current=Math.max(0,Math.min(slides.length-1,n));nav();if(hash)history.replaceState(null,'','#'+slides[current].id);if(presenting)scrollTo({top:0,behavior:'instant'});else slides[current].scrollIntoView({behavior:'smooth'});$('#menu').hidden=true;$('#menu-toggle').setAttribute('aria-expanded','false')}
$('#prev').onclick=()=>go(current-1);$('#next').onclick=()=>go(current+1);
$('#language').onclick=()=>{lang=lang==='zh'?'en':'zh';language()};
$('#present').onclick=()=>{presenting=!presenting;document.body.classList.toggle('presenting',presenting);$('#present').setAttribute('aria-pressed',presenting);go(current,false)};
$('#fullscreen').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen()}catch{}};
$('#menu-toggle').onclick=()=>{$('#menu').hidden=!$('#menu').hidden;$('#menu-toggle').setAttribute('aria-expanded',!$('#menu').hidden)};
document.querySelectorAll('a[href^="#"]').forEach(a=>a.onclick=e=>{const i=slides.findIndex(s=>'#'+s.id===a.hash);if(i>=0){e.preventDefault();go(i)}});
addEventListener('keydown',e=>{if(/INPUT|TEXTAREA|BUTTON|A/.test(e.target.tagName))return;if(['ArrowRight','PageDown'].includes(e.key)){e.preventDefault();go(current+1)}if(['ArrowLeft','PageUp'].includes(e.key)){e.preventDefault();go(current-1)}if(e.key==='Escape'){$('#menu').hidden=true;$('#menu-toggle').setAttribute('aria-expanded','false')}});
addEventListener('hashchange',()=>{const i=slides.findIndex(s=>'#'+s.id===location.hash);if(i>=0)go(i,false)});
const observer=new IntersectionObserver(entries=>{if(presenting)return;const e=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];if(e){current=slides.indexOf(e.target);nav()}},{rootMargin:'-62px 0px -45% 0px',threshold:[0,.1,.5]});slides.forEach(s=>observer.observe(s));
language();nav();const i=slides.findIndex(s=>'#'+s.id===location.hash);if(i>=0)go(i,false);else if(location.hash)go(1);
})();
