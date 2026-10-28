'use strict';
const toggle=document.querySelector('.menu-toggle');
const mobileNav=document.querySelector('.mobile-nav');
if(toggle&&mobileNav){
  const close=()=>{mobileNav.hidden=true;toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Open navigation');};
  toggle.addEventListener('click',()=>{const expanded=toggle.getAttribute('aria-expanded')==='true';mobileNav.hidden=expanded;toggle.setAttribute('aria-expanded',String(!expanded));toggle.setAttribute('aria-label',expanded?'Open navigation':'Close navigation');});
  mobileNav.querySelectorAll('a').forEach(a=>a.addEventListener('click',close));
  document.addEventListener('keydown',e=>{if(e.key==='Escape')close();});
}
const projects={
 grab:{src:'assets/grabandbook.webp',url:'grabandbook.com',alt:'Grab&Book appointment booking software screenshot'},
 fox:{src:'assets/foxborough-current.webp',url:'foxboroughfurniture.com',alt:'Foxborough Furniture restoration business website screenshot'},
 room:{src:'assets/transform-my-room.webp',url:'Transform My Room',alt:'Transform My Room room design and furniture selection homepage'}
};
const heroImage=document.getElementById('hero-image');
const heroUrl=document.getElementById('hero-url');
document.querySelectorAll('[data-project]').forEach(btn=>btn.addEventListener('click',()=>{
  const project=projects[btn.dataset.project];if(!project||!heroImage)return;
  heroImage.src=project.src;heroImage.alt=project.alt;heroUrl.textContent=project.url;
  document.querySelectorAll('[data-project]').forEach(other=>{const active=other===btn;other.classList.toggle('active',active);other.setAttribute('aria-pressed',String(active));});
}));
const year=document.getElementById('year');if(year)year.textContent=new Date().getFullYear();
