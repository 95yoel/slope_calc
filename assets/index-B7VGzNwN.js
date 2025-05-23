var y=Object.defineProperty;var E=(n,s,t)=>s in n?y(n,s,{enumerable:!0,configurable:!0,writable:!0,value:t}):n[s]=t;var i=(n,s,t)=>E(n,typeof s!="symbol"?s+"":s,t);(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))e(r);new MutationObserver(r=>{for(const l of r)if(l.type==="childList")for(const o of l.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&e(o)}).observe(document,{childList:!0,subtree:!0});function t(r){const l={};return r.integrity&&(l.integrity=r.integrity),r.referrerPolicy&&(l.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?l.credentials="include":r.crossOrigin==="anonymous"?l.credentials="omit":l.credentials="same-origin",l}function e(r){if(r.ep)return;r.ep=!0;const l=t(r);fetch(r.href,l)}})();class v{static async fetchUrl(s){const t="/slope_calc/"+s.replace(/^\/+/,"");try{const e=await fetch(t);if(!e.ok)throw new Error(`HTTP error! status: ${e.status} at ${t}`);return await e.text()}catch(e){throw console.error(`[Utils.fetchUrl] Error fetching "${t}":`,e),e}}}const S="slopecalc",h="segments",A=1,x=()=>new Promise((n,s)=>{const t=indexedDB.open(S,A);t.onupgradeneeded=()=>{const e=t.result;e.objectStoreNames.contains(h)||e.createObjectStore(h,{keyPath:"id"})},t.onsuccess=()=>n(t.result),t.onerror=()=>s(t.error)}),L=n=>g("readwrite",s=>s.put(n)),w=()=>g("readonly",n=>new Promise(s=>{const t=n.getAll();t.onsuccess=()=>s(t.result)})),C=()=>g("readwrite",n=>{n.clear()}),g=async(n,s)=>{const e=(await x()).transaction(h,n),r=s(e.objectStore(h));return await new Promise((l,o)=>{e.oncomplete=()=>l(),e.onerror=()=>o(e.error),e.onabort=()=>o(e.error)}),r},m={save:L,getAll:w,clear:C};class f{constructor(s){i(this,"segments",[]);this.segments=s}static async create(){const s=await m.getAll();return new f(s)}async addSegment(s){const{initialLength:t,finalLength:e,initialElevation:r,finalElevation:l}=s,o=(e-t)*1e3,a=l-r,u=o!==0?a/o:0,c={id:this.segments.length+1,initialLength:t,finalLength:e,initialElevation:r,finalElevation:l,distance:o,desnivel:a,slope:u};this.segments.push(c),await m.save(c)}getSegments(){return[...this.segments]}getTotalDesnivel(){return this.segments.reduce((s,t)=>s+t.desnivel,0)}getTotalDistance(){return this.segments.reduce((s,t)=>s+t.distance,0)}getAverageSlope(){const s=this.getTotalDistance();return s!==0?this.getTotalDesnivel()/s:0}async clearSegments(){this.segments=[],await m.clear()}}class q extends HTMLElement{constructor(){super(...arguments);i(this,"submitHandler",t=>this.onSubmit(t));i(this,"clearFieldsHandler",()=>this.onClearFields());i(this,"clearAllHandler",()=>this.onClearAll())}async connectedCallback(){const t=await v.fetchUrl("form.html");this.innerHTML=t;const e=this.querySelector("#form");Array.from(e.querySelectorAll("custom-input")).forEach(a=>{if(a.hasAttribute("required")&&(a.validator=c=>({valid:c.trim().length>0,message:"Este campo es obligatorio"})),a.getAttribute("data-validate")==="nonEmpty"){const c=a.getAttribute("data-error")||"No puede quedar vacío";a.validator=d=>({valid:d.trim()!=="",message:c})}}),e.addEventListener("submit",this.submitHandler),e.querySelector(".form-button-delete").addEventListener("click",this.clearFieldsHandler),e.querySelector("#deleteAll").addEventListener("click",this.clearAllHandler)}disconnectedCallback(){const t=this.querySelector("#form");if(t){t.removeEventListener("submit",this.submitHandler);const e=t.querySelector(".form-button-delete");e&&e.removeEventListener("click",this.clearFieldsHandler);const r=t.querySelector("#deleteAll");r&&r.removeEventListener("click",this.clearAllHandler)}}onSubmit(t){t.preventDefault();const e=this.querySelector("#form"),r=Array.from(e.querySelectorAll("custom-input"));let l=!0;if(r.forEach(d=>{d.validate()||(l=!1)}),!l){alert("No puede haber campos vacíos.");return}const[o,a,u,c]=r.map(d=>Number(d.value));this.dispatchEvent(new CustomEvent("segment-submitted",{bubbles:!0,composed:!0,detail:{initialLength:o,finalLength:a,initialElevation:u,finalElevation:c}})),this.clearFields()}onClearFields(){const t=this.querySelector("#form"),e=Array.from(t.querySelectorAll("custom-input"));this.clearFields(e)}clearFields(t){(t??Array.from(this.querySelector("#form").querySelectorAll("custom-input"))).forEach(r=>{var o;r.value="";const l=(o=r.shadowRoot)==null?void 0:o.querySelector("input");l&&(l.style.borderColor="#ccc")})}onClearAll(){this.clearFields(),this.dispatchEvent(new CustomEvent("clear-all",{bubbles:!0,composed:!0}))}}customElements.define("slope-form",q);class p{static toMeters(s){return`${Number(s.toFixed(2))} m`}static toKilometers(s){return`${Number(s.toFixed(2))} km`}static toPercent(s){return`${Number((s*100).toFixed(2))} %`}}class D{constructor(s="Informe Desnivel"){i(this,"title");this.title=s}openPrintWindow(s){const t=window.open("","_blank","width=800,height=600");t&&(t.document.write(s),t.document.close(),t.focus(),t.print(),t.close())}generateHtml(s,t){return`
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
          ${s}
          ${t}
        </body>
      </html>
    `}export(s,t){const e=this.generateHtml(s,t);this.openPrintWindow(e)}}class H extends HTMLElement{constructor(){super(...arguments);i(this,"tbody");i(this,"exportBtn");i(this,"titleInput");i(this,"toggleDefault");i(this,"titleControl")}init(){this.innerHTML=`
      <div class="controls">
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
      </table>
    `,this.exportBtn=this.querySelector(".export-btn"),this.titleControl=this.querySelector(".title-control"),this.titleInput=this.querySelector("custom-input.title-input"),this.toggleDefault=this.querySelector(".toggle-default"),this.tbody=this.querySelector(".segments-body"),this.toggleDefault.addEventListener("change",()=>{const t=this.toggleDefault.checked;this.titleInput.hidden=t,t&&(this.titleInput.value="")}),this.exportBtn.addEventListener("click",()=>this.exportPdf())}addSegment(t){const e=t.getSegments(),r=e[e.length-1];if(!r)return;const l=document.createElement("tr");l.innerHTML=`
      <td>${r.id}</td>
      <td>${r.distance.toFixed(2)} m</td>
      <td>${r.desnivel.toFixed(2)} m</td>
      <td>${(r.slope*100).toFixed(2)}%</td>
      <td class="hide-mobile">${r.initialLength} km</td>
      <td class="hide-mobile">${r.finalLength} km</td>
      <td class="hide-mobile">${r.initialElevation} m</td>
      <td class="hide-mobile">${r.finalElevation} m</td>
    `,this.tbody.appendChild(l),this.updateSummary(t),this.showExportControls()}reset(){this.tbody.innerHTML="",this.updateSummary({getTotalDistance:()=>0,getTotalDesnivel:()=>0,getAverageSlope:()=>0}),this.exportBtn.hidden=!0,this.titleControl.hidden=!0,this.toggleDefault.checked=!0,this.titleInput.value="",this.titleInput.hidden=!0}updateSummary(t){const e={dist:p.toMeters(t.getTotalDistance()),desn:p.toMeters(t.getTotalDesnivel()),slope:p.toPercent(t.getAverageSlope())};this.querySelector(".total-dist").textContent=e.dist,this.querySelector(".total-desn").textContent=e.desn,this.querySelector(".avg-slope").textContent=e.slope}exportPdf(){const t=this.querySelector(".summary").outerHTML,e=this.querySelector("table").outerHTML,r=this.toggleDefault.checked?"":this.titleInput.value||"";new D(r).export(t,e)}showExportControls(){this.exportBtn.hidden=!1,this.titleControl.hidden=!1,this.titleInput.hidden=this.toggleDefault.checked}}customElements.define("slope-result",H);class k extends HTMLElement{constructor(){super(...arguments);i(this,"analytics");i(this,"result");i(this,"formEl");i(this,"segmentHandler",async t=>this.onSegment(t));i(this,"clearAllHandler",async()=>this.onClearAll())}async connectedCallback(){const t=await v.fetchUrl("calculator.html");this.innerHTML=t,this.analytics=await f.create();const e=this.querySelector(".bottom-section");this.result=document.createElement("slope-result"),e.appendChild(this.result),this.result.init(),this.analytics.getSegments().forEach(()=>{this.result.addSegment(this.analytics)}),this.formEl=document.createElement("slope-form"),this.formEl.addEventListener("segment-submitted",this.segmentHandler),this.formEl.addEventListener("clear-all",this.clearAllHandler),this.querySelector(".top-section").appendChild(this.formEl)}disconnectedCallback(){this.formEl&&(this.formEl.removeEventListener("segment-submitted",this.segmentHandler),this.formEl.removeEventListener("clear-all",this.clearAllHandler))}async onSegment(t){const{detail:e}=t;await this.analytics.addSegment(e),this.result.addSegment(this.analytics)}async onClearAll(){await this.analytics.clearSegments(),this.result.reset()}}customElements.define("slope-calculator",k);class b extends HTMLElement{constructor(){super();i(this,"_input");i(this,"_validator");const t=this.attachShadow({mode:"open"}),e=document.createElement("style");e.textContent=`
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
    `,this._input=document.createElement("input"),t.append(e,this._input)}static get observedAttributes(){return["type","placeholder","value","required"]}attributeChangedCallback(t,e,r){switch(t){case"type":this._input.type=r??"text";break;case"placeholder":this._input.placeholder=r??"";break;case"value":this._input.value=r??"";break;case"required":this._input.required=r!==null;break}}connectedCallback(){for(const t of b.observedAttributes)if(this.hasAttribute(t)){const e=this.getAttribute(t);this.attributeChangedCallback(t,null,e)}}get value(){return this._input.value}set value(t){this._input.value=t,this.setAttribute("value",t)}set validator(t){this._validator=t}get validator(){return this._validator}validate(){let t={valid:!0};return this._validator?t=this._validator(this.value)||{valid:!0}:t.valid=this._input.checkValidity(),this._input.style.borderColor=t.valid?"#ccc":"red",t.valid}}customElements.define("custom-input",b);document.addEventListener("DOMContentLoaded",()=>{const n=document.getElementById("app");if(n){const s=document.createElement("slope-calculator");n.appendChild(s)}});
