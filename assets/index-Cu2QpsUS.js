(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))o(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const c of s.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&o(c)}).observe(document,{childList:!0,subtree:!0});function t(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function o(r){if(r.ep)return;r.ep=!0;const s=t(r);fetch(r.href,s)}})();const d=document.querySelector(".cocktail-list"),i=document.querySelector("#search-input"),f=document.querySelector("#search-btn"),a=document.querySelector("#clear-icon"),u=document.querySelector("#result-count"),h=document.querySelector("#idle-animation"),y="https://www.thecocktaildb.com/api/json/v1/1/";let l=!1;async function p(){const e=i.value.trim();if(e){const n=`${y}search.php?&s=${e}`;try{const t=await fetch(n);if(!t.ok)throw new Error(`Failed to fetch cocktails using ${e}`);const o=await t.json();sessionStorage.setItem("lastSearch",e),o.drinks?(k(o.drinks),i.blur()):(u.textContent="No cocktails found.",d.innerHTML="",m(!0))}catch(t){u.textContent="Something went wrong. Try again later.",console.error("Error fetching cocktails:",t),d.innerHTML="",m(!0)}}}function k(e){d.innerHTML="",u.textContent=`${e.length} cocktails found.`,m(!1),e.forEach(n=>{const t=document.createElement("article");t.classList.add("cocktail-card"),t.innerHTML=`
            <img src="${n.strDrinkThumb}/small" alt="${n.strDrink}">
            <h3>${n.strDrink}</h3>
            <p>${n.strCategory}</p>
        `,t.addEventListener("click",()=>{l||(v(n.idDrink),l=!0)}),d.appendChild(t)})}async function v(e){const n=`${y}lookup.php?i=${e}`;try{const t=await fetch(n);if(!t.ok)throw new Error(`Failed to fetch details for cocktail with id ${e}`);const o=await t.json();if(o.drinks){const r=o.drinks[0],s=document.createElement("dialog");s.classList.add("cocktail-modal"),s.innerHTML=$(r),s.addEventListener("click",c=>{c.target===s&&(s.remove(),l=!1)}),document.body.appendChild(s)}}catch(t){console.error("Error fetching cocktail details:",t),u.textContent="Something went wrong. Please try again later."}}function $(e){return`
        <div class="cocktail-modal-content">
            <h2>${e.strDrink}</h2>
            <div class="cocktail-main-info">
                <img src="${e.strDrinkThumb}/medium" alt="${e.strDrink}">
                <div class="cocktail-text-info">
                    <p><strong>Category:</strong> ${e.strCategory}, ${e.strAlcoholic}</p>
                    <p><strong>Glass:</strong> ${e.strGlass}</p>
                    <p><strong>Instructions:</strong> ${e.strInstructions}</p>
                    <p><strong>Ingredients:</strong></p>
                    ${L(e)}
                </div>
            </div>
        </div>
    `}function L(e){const n=[];for(let t=1;t<=15;t++){const o=e[`strIngredient${t}`],r=e[`strMeasure${t}`];if(o){const s=`
                <li class="ingredient-item">
                    <p>${o}${r?", "+r:""}</p>
                </li>
            `;n.push(s)}}return'<ul class="ingredient-list">'+n.join("")+"</ul>"}function m(e){e?h.style.display="flex":h.style.display="none"}function w(){const e=i.value.trim();f.disabled=e===""}f.addEventListener("click",p);i.addEventListener("input",()=>{a.style.display=i.value?"block":"none",w()});a.addEventListener("click",()=>{i.value="",a.style.display="none",f.disabled=!0,i.focus(),a.blur()});i.addEventListener("keypress",e=>{e.key==="Enter"&&i.value.trim()&&p()});document.addEventListener("keydown",e=>{if(e.key==="Escape"&&l){const n=document.querySelector(".cocktail-modal");n==null||n.remove(),l=!1}});const g=sessionStorage.getItem("lastSearch");g&&(i.value=g,a.style.display="block",f.disabled=!1,p());
