var de=Object.defineProperty;var he=(e,t,n)=>t in e?de(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n;var w=(e,t,n)=>(he(e,typeof t!="symbol"?t+"":t,n),n);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))s(i);new MutationObserver(i=>{for(const l of i)if(l.type==="childList")for(const r of l.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&s(r)}).observe(document,{childList:!0,subtree:!0});function n(i){const l={};return i.integrity&&(l.integrity=i.integrity),i.referrerpolicy&&(l.referrerPolicy=i.referrerpolicy),i.crossorigin==="use-credentials"?l.credentials="include":i.crossorigin==="anonymous"?l.credentials="omit":l.credentials="same-origin",l}function s(i){if(i.ep)return;i.ep=!0;const l=n(i);fetch(i.href,l)}})();const d={};function ge(e){d.context=e}const ye=(e,t)=>e===t,I=Symbol("solid-proxy"),O={equals:ye};let ie=ce;const _=1,M=2,le={owned:null,cleanups:null,context:null,owner:null};var h=null;let S=null,a=null,g=null,b=null,z=0;function me(e,t){const n=a,s=h,i=e.length===0,l=i?le:{owned:null,cleanups:null,context:null,owner:t||s},r=i?e:()=>e(()=>k(()=>F(l)));h=l,a=null;try{return P(r,!0)}finally{a=n,h=s}}function U(e,t){t=t?Object.assign({},O,t):O;const n={value:e,observers:null,observerSlots:null,comparator:t.equals||void 0},s=i=>(typeof i=="function"&&(i=i(n.value)),re(n,i));return[oe.bind(n),s]}function m(e,t,n){const s=X(e,t,!1,_);N(s)}function V(e,t,n){ie=$e;const s=X(e,t,!1,_);s.user=!0,b?b.push(s):N(s)}function q(e,t,n){n=n?Object.assign({},O,n):O;const s=X(e,t,!0,0);return s.observers=null,s.observerSlots=null,s.comparator=n.equals||void 0,N(s),oe.bind(s)}function k(e){const t=a;a=null;try{return e()}finally{a=t}}function be(e){V(()=>k(e))}function pe(e){return h===null||(h.cleanups===null?h.cleanups=[e]:h.cleanups.push(e)),e}function oe(){const e=S;if(this.sources&&(this.state||e))if(this.state===_||e)N(this);else{const t=g;g=null,P(()=>R(this),!1),g=t}if(a){const t=this.observers?this.observers.length:0;a.sources?(a.sources.push(this),a.sourceSlots.push(t)):(a.sources=[this],a.sourceSlots=[t]),this.observers?(this.observers.push(a),this.observerSlots.push(a.sources.length-1)):(this.observers=[a],this.observerSlots=[a.sources.length-1])}return this.value}function re(e,t,n){let s=e.value;return(!e.comparator||!e.comparator(s,t))&&(e.value=t,e.observers&&e.observers.length&&P(()=>{for(let i=0;i<e.observers.length;i+=1){const l=e.observers[i],r=S&&S.running;r&&S.disposed.has(l),(r&&!l.tState||!r&&!l.state)&&(l.pure?g.push(l):b.push(l),l.observers&&fe(l)),r||(l.state=_)}if(g.length>1e6)throw g=[],new Error},!1)),t}function N(e){if(!e.fn)return;F(e);const t=h,n=a,s=z;a=h=e,we(e,e.value,s),a=n,h=t}function we(e,t,n){let s;try{s=e.fn(t)}catch(i){e.pure&&(e.state=_,e.owned&&e.owned.forEach(F),e.owned=null),ue(i)}(!e.updatedAt||e.updatedAt<=n)&&(e.updatedAt!=null&&"observers"in e?re(e,s):e.value=s,e.updatedAt=n)}function X(e,t,n,s=_,i){const l={fn:e,state:s,updatedAt:null,owned:null,sources:null,sourceSlots:null,cleanups:null,value:t,owner:h,context:null,pure:n};return h===null||h!==le&&(h.owned?h.owned.push(l):h.owned=[l]),l}function j(e){const t=S;if(e.state===0||t)return;if(e.state===M||t)return R(e);if(e.suspense&&k(e.suspense.inFallback))return e.suspense.effects.push(e);const n=[e];for(;(e=e.owner)&&(!e.updatedAt||e.updatedAt<z);)(e.state||t)&&n.push(e);for(let s=n.length-1;s>=0;s--)if(e=n[s],e.state===_||t)N(e);else if(e.state===M||t){const i=g;g=null,P(()=>R(e,n[0]),!1),g=i}}function P(e,t){if(g)return e();let n=!1;t||(g=[]),b?n=!0:b=[],z++;try{const s=e();return _e(n),s}catch(s){g||(b=null),ue(s)}}function _e(e){if(g&&(ce(g),g=null),e)return;const t=b;b=null,t.length&&P(()=>ie(t),!1)}function ce(e){for(let t=0;t<e.length;t++)j(e[t])}function $e(e){let t,n=0;for(t=0;t<e.length;t++){const s=e[t];s.user?e[n++]=s:j(s)}for(d.context&&ge(),t=0;t<n;t++)j(e[t])}function R(e,t){const n=S;e.state=0;for(let s=0;s<e.sources.length;s+=1){const i=e.sources[s];i.sources&&(i.state===_||n?i!==t&&j(i):(i.state===M||n)&&R(i,t))}}function fe(e){const t=S;for(let n=0;n<e.observers.length;n+=1){const s=e.observers[n];(!s.state||t)&&(s.state=M,s.pure?g.push(s):b.push(s),s.observers&&fe(s))}}function F(e){let t;if(e.sources)for(;e.sources.length;){const n=e.sources.pop(),s=e.sourceSlots.pop(),i=n.observers;if(i&&i.length){const l=i.pop(),r=n.observerSlots.pop();s<i.length&&(l.sourceSlots[r]=s,i[s]=l,n.observerSlots[s]=r)}}if(e.owned){for(t=0;t<e.owned.length;t++)F(e.owned[t]);e.owned=null}if(e.cleanups){for(t=0;t<e.cleanups.length;t++)e.cleanups[t]();e.cleanups=null}e.state=0,e.context=null}function Ce(e){return e instanceof Error||typeof e=="string"?e:new Error("Unknown error")}function ue(e){throw e=Ce(e),e}function L(e,t){return k(()=>e(t||{}))}function T(){return!0}const Y={get(e,t,n){return t===I?n:e.get(t)},has(e,t){return t===I?!0:e.has(t)},set:T,deleteProperty:T,getOwnPropertyDescriptor(e,t){return{configurable:!0,enumerable:!0,get(){return e.get(t)},set:T,deleteProperty:T}},ownKeys(e){return e.keys()}};function xe(e,...t){const n=new Set(t.flat());if(I in e){const i=t.map(l=>new Proxy({get(r){return l.includes(r)?e[r]:void 0},has(r){return l.includes(r)&&r in e},keys(){return l.filter(r=>r in e)}},Y));return i.push(new Proxy({get(l){return n.has(l)?void 0:e[l]},has(l){return n.has(l)?!1:l in e},keys(){return Object.keys(e).filter(l=>!n.has(l))}},Y)),i}const s=Object.getOwnPropertyDescriptors(e);return t.push(Object.keys(s).filter(i=>!n.has(i))),t.map(i=>{const l={};for(let r=0;r<i.length;r++){const o=i[r];o in e&&Object.defineProperty(l,o,s[o]?s[o]:{get(){return e[o]},set(){return!0},enumerable:!0})}return l})}const Se=["allowfullscreen","async","autofocus","autoplay","checked","controls","default","disabled","formnovalidate","hidden","indeterminate","ismap","loop","multiple","muted","nomodule","novalidate","open","playsinline","readonly","required","reversed","seamless","selected"],Ee=new Set(["className","value","readOnly","formNoValidate","isMap","noModule","playsInline",...Se]),ve=new Set(["innerHTML","textContent","innerText","children"]),Ae=Object.assign(Object.create(null),{className:"class",htmlFor:"for"}),Z=Object.assign(Object.create(null),{class:"className",formnovalidate:"formNoValidate",ismap:"isMap",nomodule:"noModule",playsinline:"playsInline",readonly:"readOnly"}),ke=new Set(["beforeinput","click","dblclick","contextmenu","focusin","focusout","input","keydown","keyup","mousedown","mousemove","mouseout","mouseover","mouseup","pointerdown","pointermove","pointerout","pointerover","pointerup","touchend","touchmove","touchstart"]),Le=new Set(["altGlyph","altGlyphDef","altGlyphItem","animate","animateColor","animateMotion","animateTransform","circle","clipPath","color-profile","cursor","defs","desc","ellipse","feBlend","feColorMatrix","feComponentTransfer","feComposite","feConvolveMatrix","feDiffuseLighting","feDisplacementMap","feDistantLight","feFlood","feFuncA","feFuncB","feFuncG","feFuncR","feGaussianBlur","feImage","feMerge","feMergeNode","feMorphology","feOffset","fePointLight","feSpecularLighting","feSpotLight","feTile","feTurbulence","filter","font","font-face","font-face-format","font-face-name","font-face-src","font-face-uri","foreignObject","g","glyph","glyphRef","hkern","image","line","linearGradient","marker","mask","metadata","missing-glyph","mpath","path","pattern","polygon","polyline","radialGradient","rect","set","stop","svg","switch","symbol","text","textPath","tref","tspan","use","view","vkern"]),Ne={xlink:"http://www.w3.org/1999/xlink",xml:"http://www.w3.org/XML/1998/namespace"};function Pe(e,t,n){let s=n.length,i=t.length,l=s,r=0,o=0,c=t[i-1].nextSibling,f=null;for(;r<i||o<l;){if(t[r]===n[o]){r++,o++;continue}for(;t[i-1]===n[l-1];)i--,l--;if(i===r){const u=l<s?o?n[o-1].nextSibling:n[l-o]:c;for(;o<l;)e.insertBefore(n[o++],u)}else if(l===o)for(;r<i;)(!f||!f.has(t[r]))&&t[r].remove(),r++;else if(t[r]===n[l-1]&&n[o]===t[i-1]){const u=t[--i].nextSibling;e.insertBefore(n[o++],t[r++].nextSibling),e.insertBefore(n[--l],u),t[i]=n[l]}else{if(!f){f=new Map;let y=o;for(;y<l;)f.set(n[y],y++)}const u=f.get(t[r]);if(u!=null)if(o<u&&u<l){let y=r,C=1,x;for(;++y<i&&y<l&&!((x=f.get(t[y]))==null||x!==u+C);)C++;if(C>u-o){const E=t[r];for(;o<u;)e.insertBefore(n[o++],E)}else e.replaceChild(n[o++],t[r++])}else r++;else t[r++].remove()}}}const J="_$DX_DELEGATE";function Te(e,t,n,s={}){let i;return me(l=>{i=l,t===document?e():p(t,e(),t.firstChild?null:void 0,n)},s.owner),()=>{i(),t.textContent=""}}function $(e,t,n){const s=document.createElement("template");s.innerHTML=e;let i=s.content.firstChild;return n&&(i=i.firstChild),i}function G(e,t=window.document){const n=t[J]||(t[J]=new Set);for(let s=0,i=e.length;s<i;s++){const l=e[s];n.has(l)||(n.add(l),t.addEventListener(l,Ie))}}function Q(e,t,n){n==null?e.removeAttribute(t):e.setAttribute(t,n)}function Oe(e,t,n,s){s==null?e.removeAttributeNS(t,n):e.setAttributeNS(t,n,s)}function Me(e,t){t==null?e.removeAttribute("class"):e.className=t}function B(e,t,n,s){if(s)Array.isArray(n)?(e[`$$${t}`]=n[0],e[`$$${t}Data`]=n[1]):e[`$$${t}`]=n;else if(Array.isArray(n)){const i=n[0];e.addEventListener(t,n[0]=l=>i.call(e,n[1],l))}else e.addEventListener(t,n)}function je(e,t,n={}){const s=Object.keys(t||{}),i=Object.keys(n);let l,r;for(l=0,r=i.length;l<r;l++){const o=i[l];!o||o==="undefined"||t[o]||(ee(e,o,!1),delete n[o])}for(l=0,r=s.length;l<r;l++){const o=s[l],c=!!t[o];!o||o==="undefined"||n[o]===c||!c||(ee(e,o,!0),n[o]=c)}return n}function Re(e,t,n){if(!t)return n?Q(e,"style"):t;const s=e.style;if(typeof t=="string")return s.cssText=t;typeof n=="string"&&(s.cssText=n=void 0),n||(n={}),t||(t={});let i,l;for(l in n)t[l]==null&&s.removeProperty(l),delete n[l];for(l in t)i=t[l],i!==n[l]&&(s.setProperty(l,i),n[l]=i);return n}function Be(e,t={},n,s){const i={};return s||m(()=>i.children=A(e,t.children,i.children)),m(()=>t.ref&&t.ref(e)),m(()=>De(e,t,n,!0,i,!0)),i}function D(e,t,n){return k(()=>e(t,n))}function p(e,t,n,s){if(n!==void 0&&!s&&(s=[]),typeof t!="function")return A(e,t,s,n);m(i=>A(e,t(),i,n),s)}function De(e,t,n,s,i={},l=!1){t||(t={});for(const r in i)if(!(r in t)){if(r==="children")continue;i[r]=te(e,r,null,i[r],n,l)}for(const r in t){if(r==="children"){s||A(e,t.children);continue}const o=t[r];i[r]=te(e,r,o,i[r],n,l)}}function Fe(e){let t,n;return!d.context||!(t=d.registry.get(n=Ue()))?e.cloneNode(!0):(d.completed&&d.completed.add(t),d.registry.delete(n),t)}function Ge(e){return e.toLowerCase().replace(/-([a-z])/g,(t,n)=>n.toUpperCase())}function ee(e,t,n){const s=t.trim().split(/\s+/);for(let i=0,l=s.length;i<l;i++)e.classList.toggle(s[i],n)}function te(e,t,n,s,i,l){let r,o,c;if(t==="style")return Re(e,n,s);if(t==="classList")return je(e,n,s);if(n===s)return s;if(t==="ref")l||n(e);else if(t.slice(0,3)==="on:"){const f=t.slice(3);s&&e.removeEventListener(f,s),n&&e.addEventListener(f,n)}else if(t.slice(0,10)==="oncapture:"){const f=t.slice(10);s&&e.removeEventListener(f,s,!0),n&&e.addEventListener(f,n,!0)}else if(t.slice(0,2)==="on"){const f=t.slice(2).toLowerCase(),u=ke.has(f);if(!u&&s){const y=Array.isArray(s)?s[0]:s;e.removeEventListener(f,y)}(u||n)&&(B(e,f,n,u),u&&G([f]))}else if((c=ve.has(t))||!i&&(Z[t]||(o=Ee.has(t)))||(r=e.nodeName.includes("-")))t==="class"||t==="className"?Me(e,n):r&&!o&&!c?e[Ge(t)]=n:e[Z[t]||t]=n;else{const f=i&&t.indexOf(":")>-1&&Ne[t.split(":")[0]];f?Oe(e,f,t,n):Q(e,Ae[t]||t,n)}return n}function Ie(e){const t=`$$${e.type}`;let n=e.composedPath&&e.composedPath()[0]||e.target;for(e.target!==n&&Object.defineProperty(e,"target",{configurable:!0,value:n}),Object.defineProperty(e,"currentTarget",{configurable:!0,get(){return n||document}}),d.registry&&!d.done&&(d.done=!0,document.querySelectorAll("[id^=pl-]").forEach(s=>{for(;s&&s.nodeType!==8&&s.nodeValue!=="pl-"+e;){let i=s.nextSibling;s.remove(),s=i}s&&s.remove()}));n;){const s=n[t];if(s&&!n.disabled){const i=n[`${t}Data`];if(i!==void 0?s.call(n,i,e):s.call(n,e),e.cancelBubble)return}n=n._$host||n.parentNode||n.host}}function A(e,t,n,s,i){for(d.context&&!n&&(n=[...e.childNodes]);typeof n=="function";)n=n();if(t===n)return n;const l=typeof t,r=s!==void 0;if(e=r&&n[0]&&n[0].parentNode||e,l==="string"||l==="number"){if(d.context)return n;if(l==="number"&&(t=t.toString()),r){let o=n[0];o&&o.nodeType===3?o.data=t:o=document.createTextNode(t),n=v(e,n,s,o)}else n!==""&&typeof n=="string"?n=e.firstChild.data=t:n=e.textContent=t}else if(t==null||l==="boolean"){if(d.context)return n;n=v(e,n,s)}else{if(l==="function")return m(()=>{let o=t();for(;typeof o=="function";)o=o();n=A(e,o,n,s)}),()=>n;if(Array.isArray(t)){const o=[],c=n&&Array.isArray(n);if(K(o,t,n,i))return m(()=>n=A(e,o,n,s,!0)),()=>n;if(d.context){if(!o.length)return n;for(let f=0;f<o.length;f++)if(o[f].parentNode)return n=o}if(o.length===0){if(n=v(e,n,s),r)return n}else c?n.length===0?ne(e,o,s):Pe(e,n,o):(n&&v(e),ne(e,o));n=o}else if(t instanceof Node){if(d.context&&t.parentNode)return n=r?[t]:t;if(Array.isArray(n)){if(r)return n=v(e,n,s,t);v(e,n,null,t)}else n==null||n===""||!e.firstChild?e.appendChild(t):e.replaceChild(t,e.firstChild);n=t}}return n}function K(e,t,n,s){let i=!1;for(let l=0,r=t.length;l<r;l++){let o=t[l],c=n&&n[l];if(o instanceof Node)e.push(o);else if(!(o==null||o===!0||o===!1))if(Array.isArray(o))i=K(e,o,c)||i;else if(typeof o=="function")if(s){for(;typeof o=="function";)o=o();i=K(e,Array.isArray(o)?o:[o],Array.isArray(c)?c:[c])||i}else e.push(o),i=!0;else{const f=String(o);c&&c.nodeType===3&&c.data===f?e.push(c):e.push(document.createTextNode(f))}}return i}function ne(e,t,n=null){for(let s=0,i=t.length;s<i;s++)e.insertBefore(t[s],n)}function v(e,t,n,s){if(n===void 0)return e.textContent="";const i=s||document.createTextNode("");if(t.length){let l=!1;for(let r=t.length-1;r>=0;r--){const o=t[r];if(i!==o){const c=o.parentNode===e;!l&&!r?c?e.replaceChild(i,o):e.insertBefore(i,n):c&&o.remove()}else l=!0}}else e.insertBefore(i,n);return[i]}function Ue(){const e=d.context;return`${e.id}${e.count++}`}const Ve="http://www.w3.org/2000/svg";function qe(e,t=!1){return t?document.createElementNS(Ve,e):document.createElement(e)}function Ke(e){const[t,n]=xe(e,["component"]),s=q(()=>t.component);return q(()=>{const i=s();switch(typeof i){case"function":return k(()=>i(n));case"string":const l=Le.has(i),r=d.context?Fe():qe(i,l);return Be(r,n,l),r}})}class se{constructor(t,n=Object.is){w(this,"_value");w(this,"_eq");w(this,"_bindings",[]);this._value=t,this._eq=n}attach(...t){this._bindings.push(...t)}detach(...t){this._bindings=this._bindings.filter(n=>!t.includes(n))}fire(t,n){this._bindings.forEach(s=>{s(t,n)})}get value(){return this._value}set value(t){if(!this._eq(this._value,t)){const n=this._value;this._value=t,this.fire(t,n)}}}class He{constructor(t,n){w(this,"src");w(this,"label");w(this,"_playbackRate",new se(1));w(this,"_preservePitch",new se(!1));this.src=t,this.label=n}get playbackRate(){return this._playbackRate}get preservePitch(){return this._preservePitch}}const ze=$('<section class="modal"><div class="topbar flex flex-row-reverse"><button>⨉</button></div><div></div></section>'),Xe=$('<div class="modal-overlay"></div>'),Qe=$("<button></button>"),We=e=>{let t,n;return[(()=>{const s=ze.cloneNode(!0),i=s.firstChild,l=i.firstChild,r=i.nextSibling,o=t;return typeof o=="function"?D(o,s):t=s,B(l,"click",e.onClose,!0),p(r,()=>e.children),p(s,(()=>{const c=q(()=>!!e.buttonText);return()=>c()&&(()=>{const f=Qe.cloneNode(!0);return B(f,"click",e.onClose,!0),p(f,()=>e.buttonText),f})()})(),null),m(()=>s.classList.toggle("hidden",!e.show)),s})(),(()=>{const s=Xe.cloneNode(!0),i=n;return typeof i=="function"?D(i,s):n=s,m(()=>s.classList.toggle("hidden",!e.show)),s})()]};G(["click"]);const Ye=$("<div>Play audio by hitting the buttons</div>"),Ze=$('<div class="App flex flex-column justify-content-center sm:w-full md:w-8"><div class="grid"><h1 class="col-12">SoundBored</h1><div class="col-12"></div><div class="col-12"><div class="grid grid-nogutter"></div></div></div></div>'),Je=$('<div class="col-4"></div>');function et(){const e=c=>`https://noproblo.dayjo.org/ZeldaSounds/MC/${c}.wav`,n=[{file:"MC_Link_Sword1",label:"Link 1"},{file:"MC_Link_Sword2",label:"Link 2"},{file:"MC_Link_Sword3",label:"Link 3"},{file:"MC_Link_Sword_Charge",label:"Sword Charge"},{file:"MC_Link_Sword_Beam",label:"Sword Beam"},{file:"MC_Crow",label:"Crow"},{file:"MC_Ezlo1",label:"Ezlo 1"},{file:"MC_Ezlo2",label:"Ezlo 2"},{file:"MC_Ezlo3",label:"Ezlo 3"}].map(({file:c,label:f})=>new He(e(c),f)),s=n.map(c=>()=>L(it,{model:c})),[i,l]=U(0),[r,o]=U(!0);return[L(We,{get show(){return r()},onClose:()=>{o(!1)},buttonText:"Ok",get children(){return Ye.cloneNode(!0)}}),(()=>{const c=Ze.cloneNode(!0),f=c.firstChild,u=f.firstChild,y=u.nextSibling,C=y.nextSibling,x=C.firstChild;return p(y,L(Ke,{get component(){return s[i()]}})),p(x,()=>n.map((E,ae)=>(()=>{const W=Je.cloneNode(!0);return p(W,L(nt,{model:E,onClick:()=>{l(ae)}})),W})())),c})()]}function H(e){const[t,n]=U(e.value),s=l=>{n(()=>l)};return be(()=>{e.attach(s)}),pe(()=>{e.detach(s)}),[t,l=>{e.value=l}]}const tt=$('<div class="soundControl"><audio preload="auto"></audio><button><div class="label"></div><div>&#9658;</div></button><button>&#9632;</button></div>'),nt=({model:e,onClick:t})=>{let n,s;const[i]=H(e.playbackRate),[l]=H(e.preservePitch),r=c=>{s.animate([{width:c},{width:"100%"}],{id:"progress-bar",duration:(n.duration-n.currentTime)/n.playbackRate*1e3,iterations:1,pseudoElement:"::before"})},o=()=>{s.getAnimations({subtree:!0}).filter(({id:c})=>c==="progress-bar").forEach(c=>c.cancel())};return V(()=>{n.playbackRate=i(),!n.paused&&n.duration&&n.playbackRate&&(o(),r(`${n.currentTime/n.duration*100}%`))}),V(()=>{n.preservesPitch=l()}),(()=>{const c=tt.cloneNode(!0),f=c.firstChild,u=f.nextSibling,y=u.firstChild,C=u.nextSibling;B(c,"click",t,!0);const x=s;typeof x=="function"?D(x,c):s=c;const E=n;return typeof E=="function"?D(E,f):n=f,u.$$click=()=>{n.currentTime=0,n.play(),r(n.currentTime)},p(y,()=>e.label),C.$$click=()=>{n.pause(),n.currentTime=0,o()},m(()=>Q(f,"src",e.src)),c})()};G(["click"]);const st=$('<div class="controlPanel"><div class="grid"><div class="col"><h2></h2><input type="range" min="0.2" step="0.05" max="2"><p>Playback speed</p></div></div></div>'),it=e=>{const[t,n]=H(e.model.playbackRate);return(()=>{const s=st.cloneNode(!0),i=s.firstChild,l=i.firstChild,r=l.firstChild,o=r.nextSibling;return p(r,()=>e.model.label),o.$$click=c=>{c.detail>1&&n(1)},o.$$input=c=>n(parseFloat(c.currentTarget.value)),m(()=>o.value=t()),s})()};G(["input","click"]);Te(()=>L(et,{}),document.getElementById("root"));