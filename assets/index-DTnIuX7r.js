var v=Object.defineProperty;var y=(l,e,t)=>e in l?v(l,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):l[e]=t;var i=(l,e,t)=>y(l,typeof e!="symbol"?e+"":e,t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))s(n);new MutationObserver(n=>{for(const r of n)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function t(n){const r={};return n.integrity&&(r.integrity=n.integrity),n.referrerPolicy&&(r.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?r.credentials="include":n.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function s(n){if(n.ep)return;n.ep=!0;const r=t(n);fetch(n.href,r)}})();const E=`<main>
    <header>
        <h1>Calculadora desnivel</h1>
    </header>
    <section>
        <div class="top-section"></div>
        <div class="bottom-section"></div>
    </section>
    <footer>
        <p>© SlopeCalc · <a  href="https://github.com/95yoel" target="_blank">@95yoel</a></p>
    </footer>
</main>`,S="slopecalc",m="segments",A=1,C=()=>new Promise((l,e)=>{const t=indexedDB.open(S,A);t.onupgradeneeded=()=>{const s=t.result;s.objectStoreNames.contains(m)||s.createObjectStore(m,{keyPath:"id"})},t.onsuccess=()=>l(t.result),t.onerror=()=>e(t.error)}),L=l=>b("readwrite",e=>e.put(l)),D=()=>b("readonly",l=>new Promise(e=>{const t=l.getAll();t.onsuccess=()=>e(t.result)})),q=()=>b("readwrite",l=>{l.clear()}),b=async(l,e)=>{const s=(await C()).transaction(m,l),n=e(s.objectStore(m));return await new Promise((r,o)=>{s.oncomplete=()=>r(),s.onerror=()=>o(s.error),s.onabort=()=>o(s.error)}),n},p={save:L,getAll:D,clear:q};class g{constructor(e){i(this,"segments",[]);this.segments=e}static async create(){const e=await p.getAll();return new g(e)}async addSegment(e){const{initialLength:t,finalLength:s,initialElevation:n,finalElevation:r}=e,o=(s-t)*1e3,u=r-n,c=o!==0?u/o:0,d={id:this.segments.length+1,initialLength:t,finalLength:s,initialElevation:n,finalElevation:r,distance:o,desnivel:u,slope:c};this.segments.push(d),await p.save(d)}getSegments(){return[...this.segments]}getTotalDesnivel(){return this.segments.reduce((e,t)=>e+t.desnivel,0)}getTotalDistance(){return this.segments.reduce((e,t)=>e+t.distance,0)}getAverageSlope(){const e=this.getTotalDistance();return e!==0?this.getTotalDesnivel()/e:0}async clearSegments(){this.segments=[],await p.clear()}}const x=`<form id="form">
    <div>
        <h4>Posición inicial (km)</h4>
        <custom-input type="number" data-validate="nonEmpty" data-error="Debes rellenar este campo"
            required></custom-input>

        <h4>Posición final (km)</h4>
        <custom-input type="number" data-validate="nonEmpty" data-error="Debes rellenar este campo"
            required></custom-input>

        <h4>Elevación inicial (m)</h4>
        <custom-input type="number" data-validate="nonEmpty" data-error="Debes rellenar este campo"></custom-input>

        <h4>Elevación final (m)</h4>
        <custom-input type="number" data-validate="nonEmpty" data-error="Debes rellenar este campo"></custom-input>

        <div class="form-actions">
            <button class="form-button-send" type="submit">Calcular</button>
            <button class="form-button-delete" type="button">Limpiar campos</button>
            <button class="form-button-delete" id="deleteAll" type="button">BORRAR TODO</button>
        </div>
    </div>
</form>`;class w extends HTMLElement{constructor(){super(...arguments);i(this,"submitHandler",t=>this.onSubmit(t));i(this,"clearFieldsHandler",()=>this.onClearFields());i(this,"clearAllHandler",()=>this.onClearAll())}async connectedCallback(){this.innerHTML=x;const t=this.querySelector("#form");Array.from(t.querySelectorAll("custom-input")).forEach(o=>{if(o.hasAttribute("required")&&(o.validator=c=>({valid:c.trim().length>0,message:"Este campo es obligatorio"})),o.getAttribute("data-validate")==="nonEmpty"){const c=o.getAttribute("data-error")||"No puede quedar vacío";o.validator=d=>({valid:d.trim()!=="",message:c})}}),t.addEventListener("submit",this.submitHandler),t.querySelector(".form-button-delete").addEventListener("click",this.clearFieldsHandler),t.querySelector("#deleteAll").addEventListener("click",this.clearAllHandler)}disconnectedCallback(){const t=this.querySelector("#form");if(t){t.removeEventListener("submit",this.submitHandler);const s=t.querySelector(".form-button-delete");s&&s.removeEventListener("click",this.clearFieldsHandler);const n=t.querySelector("#deleteAll");n&&n.removeEventListener("click",this.clearAllHandler)}}onSubmit(t){t.preventDefault();const s=this.querySelector("#form"),n=Array.from(s.querySelectorAll("custom-input"));let r=!0;if(n.forEach(h=>{h.validate()||(r=!1)}),!r){alert("No puede haber campos vacíos.");return}const[o,u,c,d]=n.map(h=>Number(h.value));this.dispatchEvent(new CustomEvent("segment-submitted",{bubbles:!0,composed:!0,detail:{initialLength:o,finalLength:u,initialElevation:c,finalElevation:d}})),this.clearFields()}onClearFields(){const t=this.querySelector("#form"),s=Array.from(t.querySelectorAll("custom-input"));this.clearFields(s)}clearFields(t){(t??Array.from(this.querySelector("#form").querySelectorAll("custom-input"))).forEach(n=>{var o;n.value="";const r=(o=n.shadowRoot)==null?void 0:o.querySelector("input");r&&(r.style.borderColor="#ccc")})}onClearAll(){this.clearFields(),this.dispatchEvent(new CustomEvent("clear-all",{bubbles:!0,composed:!0}))}}customElements.define("slope-form",w);class a{static toMeters(e){return`${Number(e.toFixed(2))} m`}static toKilometers(e){return`${Number(e.toFixed(2))} km`}static toPercent(e){return`${Number((e*100).toFixed(2))} %`}}class H{constructor(e="Informe Desnivel"){i(this,"title");this.title=e}openPrintWindow(e){const t=window.open("","_blank","width=800,height=600");t&&(t.document.write(e),t.document.close(),t.focus(),t.print(),t.close())}generateHtml(e,t){return`
      <html>
        <head>
          <title>${this.title}</title>
          <style>
            body { font-family: Inter, sans-serif; padding: 1rem; }
            .summary p { margin: .5rem 0; }
            table { width: 100%; border-collapse: collapse; }
            th, td { padding: .5rem; border: 1px solid #ccc; }
            thead { background: #1e3a8a; color: #fff; }
          </style>
        </head>
        <body>
          <h1>${this.title}</h1>
          ${e}
          ${t}
        </body>
      </html>
    `}export(e,t){const s=this.generateHtml(e,t);this.openPrintWindow(s)}}const T=`<div class="controls">
    <button class="export-btn" hidden title="Exportar informe">📥 Exportar PDF</button>
    <div class="title-control" hidden>
        <custom-input class="title-input" placeholder="Título del informe" hidden></custom-input>
        <label>
            <input type="checkbox" class="toggle-default" checked>
            <small>Nombre de informe por defecto</small>
        </label>
    </div>
</div>
<div class="summary">
    <p><strong>Distancia total:</strong> <span class="total-dist">0.00 m</span></p>
    <p><strong>Desnivel total:</strong> <span class="total-desn">0.00 m</span></p>
    <p><strong>Pendiente media:</strong> <span class="avg-slope">0.00 %</span></p>
</div>
<table>
    <thead>
        <tr>
            <th>#</th>
            <th>Dist.</th>
            <th>Desn.</th>
            <th>Pend.</th>
            <th class="hide-mobile">Long. ini</th>
            <th class="hide-mobile">Long. fin</th>
            <th class="hide-mobile">Alt. ini</th>
            <th class="hide-mobile">Alt. fin</th>
        </tr>
    </thead>
    <tbody class="segments-body"></tbody>
</table>`;class k extends HTMLElement{constructor(){super(...arguments);i(this,"tbody");i(this,"exportBtn");i(this,"titleInput");i(this,"toggleDefault");i(this,"titleControl")}async init(){this.innerHTML=T,this.exportBtn=this.querySelector(".export-btn"),this.titleControl=this.querySelector(".title-control"),this.titleInput=this.querySelector("custom-input.title-input"),this.toggleDefault=this.querySelector(".toggle-default"),this.tbody=this.querySelector(".segments-body"),this.toggleDefault.addEventListener("change",()=>{const t=this.toggleDefault.checked;this.titleInput.hidden=t,t&&(this.titleInput.value="")}),this.exportBtn.addEventListener("click",()=>this.exportPdf())}addSegment(t){const s=t.getSegments(),n=s[s.length-1];if(!n)return;const r=document.createElement("tr");r.innerHTML=`
      <td>${n.id}</td>
      <td>${a.toMeters(n.distance)}</td>
      <td>${a.toMeters(n.desnivel)}</td>
      <td>${a.toPercent(n.slope)}</td>
      <td class="hide-mobile">${a.toKilometers(n.initialLength)}</td>
      <td class="hide-mobile">${a.toKilometers(n.finalLength)}</td>
      <td class="hide-mobile">${a.toMeters(n.initialElevation)}</td>
      <td class="hide-mobile">${a.toMeters(n.finalElevation)}</td>
    `,this.tbody.appendChild(r),this.updateSummary(t),this.showExportControls()}reset(){this.tbody.innerHTML="",this.updateSummary({getTotalDistance:()=>0,getTotalDesnivel:()=>0,getAverageSlope:()=>0}),this.exportBtn.hidden=!0,this.titleControl.hidden=!0,this.toggleDefault.checked=!0,this.titleInput.value="",this.titleInput.hidden=!0}updateSummary(t){const s={dist:a.toMeters(t.getTotalDistance()),desn:a.toMeters(t.getTotalDesnivel()),slope:a.toPercent(t.getAverageSlope())};this.querySelector(".total-dist").textContent=s.dist,this.querySelector(".total-desn").textContent=s.desn,this.querySelector(".avg-slope").textContent=s.slope}exportPdf(){const t=this.querySelector(".summary").outerHTML,s=this.querySelector("table").outerHTML,n=this.toggleDefault.checked?"":this.titleInput.value||"";new H(n).export(t,s)}showExportControls(){this.exportBtn.hidden=!1,this.titleControl.hidden=!1,this.titleInput.hidden=this.toggleDefault.checked}}customElements.define("slope-result",k);class M extends HTMLElement{constructor(){super(...arguments);i(this,"analytics");i(this,"result");i(this,"formEl");i(this,"segmentHandler",async t=>this.onSegment(t));i(this,"clearAllHandler",async()=>this.onClearAll())}async connectedCallback(){this.innerHTML=E,this.analytics=await g.create();const t=this.querySelector(".bottom-section");this.result=document.createElement("slope-result"),t.appendChild(this.result),this.result.init(),this.analytics.getSegments().forEach(()=>{this.result.addSegment(this.analytics)}),this.formEl=document.createElement("slope-form"),this.formEl.addEventListener("segment-submitted",this.segmentHandler),this.formEl.addEventListener("clear-all",this.clearAllHandler),this.querySelector(".top-section").appendChild(this.formEl)}disconnectedCallback(){this.formEl&&(this.formEl.removeEventListener("segment-submitted",this.segmentHandler),this.formEl.removeEventListener("clear-all",this.clearAllHandler))}async onSegment(t){const{detail:s}=t;await this.analytics.addSegment(s),this.result.addSegment(this.analytics)}async onClearAll(){await this.analytics.clearSegments(),this.result.reset()}}customElements.define("slope-calculator",M);class f extends HTMLElement{constructor(){super();i(this,"_input");i(this,"_validator");const t=this.attachShadow({mode:"open"}),s=document.createElement("style");s.textContent=`
      input {
        width: 100%;
        box-sizing: border-box;
        padding: 8px 16px;
        font-size: 1rem;
        border: 1px solid #ccc;
        border-radius: 0.4rem;
        outline: none;
        transition: border-color .2s;
      }
      input:focus {
        border-color: #888;
      }
    `,this._input=document.createElement("input"),t.append(s,this._input)}static get observedAttributes(){return["type","placeholder","value","required"]}attributeChangedCallback(t,s,n){switch(t){case"type":this._input.type=n??"text";break;case"placeholder":this._input.placeholder=n??"";break;case"value":this._input.value=n??"";break;case"required":this._input.required=n!==null;break}}connectedCallback(){for(const t of f.observedAttributes)if(this.hasAttribute(t)){const s=this.getAttribute(t);this.attributeChangedCallback(t,null,s)}}get value(){return this._input.value}set value(t){this._input.value=t,this.setAttribute("value",t)}set validator(t){this._validator=t}get validator(){return this._validator}validate(){let t={valid:!0};return this._validator?t=this._validator(this.value)||{valid:!0}:t.valid=this._input.checkValidity(),this._input.style.borderColor=t.valid?"#ccc":"red",t.valid}}customElements.define("custom-input",f);document.addEventListener("DOMContentLoaded",()=>{const l=document.getElementById("app");if(l){const e=document.createElement("slope-calculator");l.appendChild(e)}});
