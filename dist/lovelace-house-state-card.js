/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */


function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$2=globalThis,e$2=t$2.ShadowRoot&&(void 0===t$2.ShadyCSS||t$2.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s$2=Symbol(),o$4=new WeakMap;let n$3 = class n{constructor(t,e,o){if(this._$cssResult$=true,o!==s$2)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e;}get styleSheet(){let t=this.o;const s=this.t;if(e$2&&void 0===t){const e=void 0!==s&&1===s.length;e&&(t=o$4.get(s)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&o$4.set(s,t));}return t}toString(){return this.cssText}};const r$4=t=>new n$3("string"==typeof t?t:t+"",void 0,s$2),i$3=(t,...e)=>{const o=1===t.length?t[0]:e.reduce((e,s,o)=>e+(t=>{if(true===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[o+1],t[0]);return new n$3(o,t,s$2)},S$1=(s,o)=>{if(e$2)s.adoptedStyleSheets=o.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const e of o){const o=document.createElement("style"),n=t$2.litNonce;void 0!==n&&o.setAttribute("nonce",n),o.textContent=e.cssText,s.appendChild(o);}},c$2=e$2?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return r$4(e)})(t):t;

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:i$2,defineProperty:e$1,getOwnPropertyDescriptor:h$1,getOwnPropertyNames:r$3,getOwnPropertySymbols:o$3,getPrototypeOf:n$2}=Object,a$1=globalThis,c$1=a$1.trustedTypes,l$1=c$1?c$1.emptyScript:"",p$1=a$1.reactiveElementPolyfillSupport,d$1=(t,s)=>t,u$1={toAttribute(t,s){switch(s){case Boolean:t=t?l$1:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t);}return t},fromAttribute(t,s){let i=t;switch(s){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t);}catch(t){i=null;}}return i}},f$1=(t,s)=>!i$2(t,s),b$1={attribute:true,type:String,converter:u$1,reflect:false,useDefault:false,hasChanged:f$1};Symbol.metadata??=Symbol("metadata"),a$1.litPropertyMetadata??=new WeakMap;let y$1 = class y extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t);}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,s=b$1){if(s.state&&(s.attribute=false),this._$Ei(),this.prototype.hasOwnProperty(t)&&((s=Object.create(s)).wrapped=true),this.elementProperties.set(t,s),!s.noAccessor){const i=Symbol(),h=this.getPropertyDescriptor(t,i,s);void 0!==h&&e$1(this.prototype,t,h);}}static getPropertyDescriptor(t,s,i){const{get:e,set:r}=h$1(this.prototype,t)??{get(){return this[s]},set(t){this[s]=t;}};return {get:e,set(s){const h=e?.call(this);r?.call(this,s),this.requestUpdate(t,h,i);},configurable:true,enumerable:true}}static getPropertyOptions(t){return this.elementProperties.get(t)??b$1}static _$Ei(){if(this.hasOwnProperty(d$1("elementProperties")))return;const t=n$2(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties);}static finalize(){if(this.hasOwnProperty(d$1("finalized")))return;if(this.finalized=true,this._$Ei(),this.hasOwnProperty(d$1("properties"))){const t=this.properties,s=[...r$3(t),...o$3(t)];for(const i of s)this.createProperty(i,t[i]);}const t=this[Symbol.metadata];if(null!==t){const s=litPropertyMetadata.get(t);if(void 0!==s)for(const[t,i]of s)this.elementProperties.set(t,i);}this._$Eh=new Map;for(const[t,s]of this.elementProperties){const i=this._$Eu(t,s);void 0!==i&&this._$Eh.set(i,t);}this.elementStyles=this.finalizeStyles(this.styles);}static finalizeStyles(s){const i=[];if(Array.isArray(s)){const e=new Set(s.flat(1/0).reverse());for(const s of e)i.unshift(c$2(s));}else void 0!==s&&i.push(c$2(s));return i}static _$Eu(t,s){const i=s.attribute;return  false===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=false,this.hasUpdated=false,this._$Em=null,this._$Ev();}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this));}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.();}removeController(t){this._$EO?.delete(t);}_$E_(){const t=new Map,s=this.constructor.elementProperties;for(const i of s.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t);}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return S$1(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(true),this._$EO?.forEach(t=>t.hostConnected?.());}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.());}attributeChangedCallback(t,s,i){this._$AK(t,i);}_$ET(t,s){const i=this.constructor.elementProperties.get(t),e=this.constructor._$Eu(t,i);if(void 0!==e&&true===i.reflect){const h=(void 0!==i.converter?.toAttribute?i.converter:u$1).toAttribute(s,i.type);this._$Em=t,null==h?this.removeAttribute(e):this.setAttribute(e,h),this._$Em=null;}}_$AK(t,s){const i=this.constructor,e=i._$Eh.get(t);if(void 0!==e&&this._$Em!==e){const t=i.getPropertyOptions(e),h="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:u$1;this._$Em=e;const r=h.fromAttribute(s,t.type);this[e]=r??this._$Ej?.get(e)??r,this._$Em=null;}}requestUpdate(t,s,i,e=false,h){if(void 0!==t){const r=this.constructor;if(false===e&&(h=this[t]),i??=r.getPropertyOptions(t),!((i.hasChanged??f$1)(h,s)||i.useDefault&&i.reflect&&h===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,i))))return;this.C(t,s,i);} false===this.isUpdatePending&&(this._$ES=this._$EP());}C(t,s,{useDefault:i,reflect:e,wrapped:h},r){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??s??this[t]),true!==h||void 0!==r)||(this._$AL.has(t)||(this.hasUpdated||i||(s=void 0),this._$AL.set(t,s)),true===e&&this._$Em!==t&&(this._$Eq??=new Set).add(t));}async _$EP(){this.isUpdatePending=true;try{await this._$ES;}catch(t){Promise.reject(t);}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,s]of this._$Ep)this[t]=s;this._$Ep=void 0;}const t=this.constructor.elementProperties;if(t.size>0)for(const[s,i]of t){const{wrapped:t}=i,e=this[s];true!==t||this._$AL.has(s)||void 0===e||this.C(s,void 0,i,e);}}let t=false;const s=this._$AL;try{t=this.shouldUpdate(s),t?(this.willUpdate(s),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(s)):this._$EM();}catch(s){throw t=false,this._$EM(),s}t&&this._$AE(s);}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=true,this.firstUpdated(t)),this.updated(t);}_$EM(){this._$AL=new Map,this.isUpdatePending=false;}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return  true}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM();}updated(t){}firstUpdated(t){}};y$1.elementStyles=[],y$1.shadowRootOptions={mode:"open"},y$1[d$1("elementProperties")]=new Map,y$1[d$1("finalized")]=new Map,p$1?.({ReactiveElement:y$1}),(a$1.reactiveElementVersions??=[]).push("2.1.2");

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$1=globalThis,i$1=t=>t,s$1=t$1.trustedTypes,e=s$1?s$1.createPolicy("lit-html",{createHTML:t=>t}):void 0,h="$lit$",o$2=`lit$${Math.random().toFixed(9).slice(2)}$`,n$1="?"+o$2,r$2=`<${n$1}>`,l=document,c=()=>l.createComment(""),a=t=>null===t||"object"!=typeof t&&"function"!=typeof t,u=Array.isArray,d=t=>u(t)||"function"==typeof t?.[Symbol.iterator],f="[ \t\n\f\r]",v=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,_=/-->/g,m=/>/g,p=RegExp(`>|${f}(?:([^\\s"'>=/]+)(${f}*=${f}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),g=/'/g,$=/"/g,y=/^(?:script|style|textarea|title)$/i,x=t=>(i,...s)=>({_$litType$:t,strings:i,values:s}),b=x(1),E=Symbol.for("lit-noChange"),A=Symbol.for("lit-nothing"),C=new WeakMap,P=l.createTreeWalker(l,129);function V(t,i){if(!u(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==e?e.createHTML(i):i}const N=(t,i)=>{const s=t.length-1,e=[];let n,l=2===i?"<svg>":3===i?"<math>":"",c=v;for(let i=0;i<s;i++){const s=t[i];let a,u,d=-1,f=0;for(;f<s.length&&(c.lastIndex=f,u=c.exec(s),null!==u);)f=c.lastIndex,c===v?"!--"===u[1]?c=_:void 0!==u[1]?c=m:void 0!==u[2]?(y.test(u[2])&&(n=RegExp("</"+u[2],"g")),c=p):void 0!==u[3]&&(c=p):c===p?">"===u[0]?(c=n??v,d=-1):void 0===u[1]?d=-2:(d=c.lastIndex-u[2].length,a=u[1],c=void 0===u[3]?p:'"'===u[3]?$:g):c===$||c===g?c=p:c===_||c===m?c=v:(c=p,n=void 0);const x=c===p&&t[i+1].startsWith("/>")?" ":"";l+=c===v?s+r$2:d>=0?(e.push(a),s.slice(0,d)+h+s.slice(d)+o$2+x):s+o$2+(-2===d?i:x);}return [V(t,l+(t[s]||"<?>")+(2===i?"</svg>":3===i?"</math>":"")),e]};class S{constructor({strings:t,_$litType$:i},e){let r;this.parts=[];let l=0,a=0;const u=t.length-1,d=this.parts,[f,v]=N(t,i);if(this.el=S.createElement(f,e),P.currentNode=this.el.content,2===i||3===i){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes);}for(;null!==(r=P.nextNode())&&d.length<u;){if(1===r.nodeType){if(r.hasAttributes())for(const t of r.getAttributeNames())if(t.endsWith(h)){const i=v[a++],s=r.getAttribute(t).split(o$2),e=/([.?@])?(.*)/.exec(i);d.push({type:1,index:l,name:e[2],strings:s,ctor:"."===e[1]?I:"?"===e[1]?L:"@"===e[1]?z:H}),r.removeAttribute(t);}else t.startsWith(o$2)&&(d.push({type:6,index:l}),r.removeAttribute(t));if(y.test(r.tagName)){const t=r.textContent.split(o$2),i=t.length-1;if(i>0){r.textContent=s$1?s$1.emptyScript:"";for(let s=0;s<i;s++)r.append(t[s],c()),P.nextNode(),d.push({type:2,index:++l});r.append(t[i],c());}}}else if(8===r.nodeType)if(r.data===n$1)d.push({type:2,index:l});else {let t=-1;for(;-1!==(t=r.data.indexOf(o$2,t+1));)d.push({type:7,index:l}),t+=o$2.length-1;}l++;}}static createElement(t,i){const s=l.createElement("template");return s.innerHTML=t,s}}function M(t,i,s=t,e){if(i===E)return i;let h=void 0!==e?s._$Co?.[e]:s._$Cl;const o=a(i)?void 0:i._$litDirective$;return h?.constructor!==o&&(h?._$AO?.(false),void 0===o?h=void 0:(h=new o(t),h._$AT(t,s,e)),void 0!==e?(s._$Co??=[])[e]=h:s._$Cl=h),void 0!==h&&(i=M(t,h._$AS(t,i.values),h,e)),i}class R{constructor(t,i){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=i;}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:i},parts:s}=this._$AD,e=(t?.creationScope??l).importNode(i,true);P.currentNode=e;let h=P.nextNode(),o=0,n=0,r=s[0];for(;void 0!==r;){if(o===r.index){let i;2===r.type?i=new k(h,h.nextSibling,this,t):1===r.type?i=new r.ctor(h,r.name,r.strings,this,t):6===r.type&&(i=new Z(h,this,t)),this._$AV.push(i),r=s[++n];}o!==r?.index&&(h=P.nextNode(),o++);}return P.currentNode=l,e}p(t){let i=0;for(const s of this._$AV) void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,i),i+=s.strings.length-2):s._$AI(t[i])),i++;}}class k{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,i,s,e){this.type=2,this._$AH=A,this._$AN=void 0,this._$AA=t,this._$AB=i,this._$AM=s,this.options=e,this._$Cv=e?.isConnected??true;}get parentNode(){let t=this._$AA.parentNode;const i=this._$AM;return void 0!==i&&11===t?.nodeType&&(t=i.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,i=this){t=M(this,t,i),a(t)?t===A||null==t||""===t?(this._$AH!==A&&this._$AR(),this._$AH=A):t!==this._$AH&&t!==E&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):d(t)?this.k(t):this._(t);}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t));}_(t){this._$AH!==A&&a(this._$AH)?this._$AA.nextSibling.data=t:this.T(l.createTextNode(t)),this._$AH=t;}$(t){const{values:i,_$litType$:s}=t,e="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=S.createElement(V(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===e)this._$AH.p(i);else {const t=new R(e,this),s=t.u(this.options);t.p(i),this.T(s),this._$AH=t;}}_$AC(t){let i=C.get(t.strings);return void 0===i&&C.set(t.strings,i=new S(t)),i}k(t){u(this._$AH)||(this._$AH=[],this._$AR());const i=this._$AH;let s,e=0;for(const h of t)e===i.length?i.push(s=new k(this.O(c()),this.O(c()),this,this.options)):s=i[e],s._$AI(h),e++;e<i.length&&(this._$AR(s&&s._$AB.nextSibling,e),i.length=e);}_$AR(t=this._$AA.nextSibling,s){for(this._$AP?.(false,true,s);t!==this._$AB;){const s=i$1(t).nextSibling;i$1(t).remove(),t=s;}}setConnected(t){ void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t));}}class H{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,i,s,e,h){this.type=1,this._$AH=A,this._$AN=void 0,this.element=t,this.name=i,this._$AM=e,this.options=h,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=A;}_$AI(t,i=this,s,e){const h=this.strings;let o=false;if(void 0===h)t=M(this,t,i,0),o=!a(t)||t!==this._$AH&&t!==E,o&&(this._$AH=t);else {const e=t;let n,r;for(t=h[0],n=0;n<h.length-1;n++)r=M(this,e[s+n],i,n),r===E&&(r=this._$AH[n]),o||=!a(r)||r!==this._$AH[n],r===A?t=A:t!==A&&(t+=(r??"")+h[n+1]),this._$AH[n]=r;}o&&!e&&this.j(t);}j(t){t===A?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"");}}class I extends H{constructor(){super(...arguments),this.type=3;}j(t){this.element[this.name]=t===A?void 0:t;}}class L extends H{constructor(){super(...arguments),this.type=4;}j(t){this.element.toggleAttribute(this.name,!!t&&t!==A);}}class z extends H{constructor(t,i,s,e,h){super(t,i,s,e,h),this.type=5;}_$AI(t,i=this){if((t=M(this,t,i,0)??A)===E)return;const s=this._$AH,e=t===A&&s!==A||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,h=t!==A&&(s===A||e);e&&this.element.removeEventListener(this.name,this,s),h&&this.element.addEventListener(this.name,this,t),this._$AH=t;}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t);}}class Z{constructor(t,i,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=i,this.options=s;}get _$AU(){return this._$AM._$AU}_$AI(t){M(this,t);}}const B=t$1.litHtmlPolyfillSupport;B?.(S,k),(t$1.litHtmlVersions??=[]).push("3.3.3");const D=(t,i,s)=>{const e=s?.renderBefore??i;let h=e._$litPart$;if(void 0===h){const t=s?.renderBefore??null;e._$litPart$=h=new k(i.insertBefore(c(),t),t,void 0,s??{});}return h._$AI(t),h};

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const s=globalThis;class i extends y$1{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0;}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const r=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=D(r,this.renderRoot,this.renderOptions);}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(true);}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(false);}render(){return E}}i._$litElement$=true,i["finalized"]=true,s.litElementHydrateSupport?.({LitElement:i});const o$1=s.litElementPolyfillSupport;o$1?.({LitElement:i});(s.litElementVersions??=[]).push("4.2.2");

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t=t=>(e,o)=>{ void 0!==o?o.addInitializer(()=>{customElements.define(t,e);}):customElements.define(t,e);};

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const o={attribute:true,type:String,converter:u$1,reflect:false,hasChanged:f$1},r$1=(t=o,e,r)=>{const{kind:n,metadata:i}=r;let s=globalThis.litPropertyMetadata.get(i);if(void 0===s&&globalThis.litPropertyMetadata.set(i,s=new Map),"setter"===n&&((t=Object.create(t)).wrapped=true),s.set(r.name,t),"accessor"===n){const{name:o}=r;return {set(r){const n=e.get.call(this);e.set.call(this,r),this.requestUpdate(o,n,t,true,r);},init(e){return void 0!==e&&this.C(o,void 0,t,e),e}}}if("setter"===n){const{name:o}=r;return function(r){const n=this[o];e.call(this,r),this.requestUpdate(o,n,t,true,r);}}throw Error("Unsupported decorator location: "+n)};function n(t){return (e,o)=>"object"==typeof o?r$1(t,e,o):((t,e,o)=>{const r=e.hasOwnProperty(o);return e.constructor.createProperty(o,t),r?Object.getOwnPropertyDescriptor(e,o):void 0})(t,e,o)}

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function r(r){return n({...r,state:true,attribute:false})}

const styles = i$3 `
  :host {
    display: block;
    color: var(--primary-text-color);
  }
  ha-card {
    padding: 18px;
    border-radius: var(--ha-card-border-radius, 12px);
    background: var(--ha-card-background, var(--card-background-color));
  }
  :host([data-appearance="bubble"]) ha-card {
    border-radius: var(--bubble-border-radius, 32px);
    background: var(
      --bubble-main-background-color,
      var(--card-background-color)
    );
    box-shadow: var(--bubble-box-shadow, var(--ha-card-box-shadow));
  }
  .header,
  .row,
  .dialog-head,
  .dialog-actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
  }
  .title {
    font-size: 18px;
    font-weight: 600;
  }
  .icon {
    border: 0;
    background: none;
    color: inherit;
    cursor: pointer;
    padding: 8px;
  }
  .segment {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: 1fr;
    gap: 4px;
    background: var(--secondary-background-color);
    padding: 4px;
    border-radius: 14px;
    margin-top: 14px;
  }
  .segment button,
  .chips button {
    border: 0;
    border-radius: 10px;
    padding: 10px;
    background: transparent;
    color: var(--primary-text-color);
    cursor: pointer;
  }
  .segment button.active,
  .chips button.active {
    background: var(--primary-color);
    color: var(--text-primary-color, #fff);
  }
  button:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
  .chips {
    display: flex;
    gap: 6px;
    margin-top: 10px;
  }
  .overlay {
    width: 100%;
    margin-top: 12px;
    padding: 9px;
    border: 1px solid var(--divider-color);
    border-radius: 10px;
    background: var(--card-background-color);
    color: inherit;
  }
  .status {
    margin-top: 13px;
    color: var(--secondary-text-color);
    font-size: 13px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .error {
    display: flex;
    gap: 8px;
    color: var(--error-color);
  }
  dialog {
    color: var(--primary-text-color);
    background: var(--card-background-color);
    border: 0;
    border-radius: 18px;
    padding: 0;
    width: min(680px, calc(100vw - 24px));
    max-height: 90vh;
    box-shadow: 0 12px 40px #0008;
  }
  dialog::backdrop {
    background: #0008;
  }
  .dialog-head {
    position: sticky;
    top: 0;
    background: inherit;
    padding: 16px 20px;
    border-bottom: 1px solid var(--divider-color);
  }
  h2,
  h3 {
    margin: 0;
  }
  .settings {
    padding: 16px 20px;
    overflow: auto;
  }
  .section {
    margin-bottom: 20px;
  }
  .grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 9px;
  }
  .field {
    display: flex;
    flex-direction: column;
    gap: 5px;
    font-size: 13px;
  }
  .field input,
  .field select {
    padding: 9px;
    border: 1px solid var(--divider-color);
    border-radius: 8px;
    background: var(--secondary-background-color);
    color: inherit;
  }
  .toggle {
    display: flex;
    justify-content: space-between;
    padding: 9px 0;
  }
  .dialog-actions {
    padding: 14px 20px;
    border-top: 1px solid var(--divider-color);
  }
  .primary {
    padding: 10px 14px;
    border: 0;
    border-radius: 10px;
    background: var(--primary-color);
    color: #fff;
  }
  @media (max-width: 500px) {
    .grid {
      grid-template-columns: 1fr;
    }
  }
`;

const schema = [
    {
        name: "appearance",
        selector: {
            select: {
                options: [
                    { value: "default", label: "Default" },
                    { value: "bubble", label: "Bubble" },
                ],
            },
        },
    },
    {
        name: "entity",
        required: true,
        selector: { entity: { integration: "house_state", domain: "sensor" } },
    },
    { name: "name", selector: { text: {} } },
    { name: "show_activity", selector: { boolean: {} } },
    { name: "show_overlay", selector: { boolean: {} } },
    { name: "confirm_vacation", selector: { boolean: {} } },
];
let Editor = class Editor extends i {
    setConfig(c) {
        this.config = {
            appearance: "default",
            show_activity: true,
            show_overlay: true,
            confirm_vacation: true,
            ...c,
        };
    }
    changed(e) {
        e.stopPropagation();
        this.dispatchEvent(new CustomEvent("config-changed", {
            detail: { config: { ...this.config, ...e.detail.value } },
            bubbles: true,
            composed: true,
        }));
    }
    render() {
        if (!this.hass || !this.config)
            return b ``;
        return b `<ha-form
      .hass=${this.hass}
      .data=${this.config}
      .schema=${schema}
      .computeLabel=${(x) => ({ appearance: "Appearance", entity: "House State entity", name: "Name", show_activity: "Show activity", show_overlay: "Show overlay", confirm_vacation: "Confirm vacation" })[x.name] || x.name}
      @value-changed=${this.changed}
    ></ha-form>`;
    }
};
Editor.styles = i$3 `
    ha-form {
      display: block;
      padding: 8px 0;
    }
  `;
__decorate([
    n({ attribute: false })
], Editor.prototype, "hass", void 0);
__decorate([
    r()
], Editor.prototype, "config", void 0);
Editor = __decorate([
    t("lovelace-house-state-editor")
], Editor);

const SCENES = [
    "home",
    "away",
    "vacation",
    "day",
    "night",
    "tv",
    "eating",
    "christmas",
    "halloween",
    "party",
];
const en = {
    home: "Home",
    away: "Away",
    vacation: "Vacation",
    day: "Day",
    night: "Night",
    none: "Off",
    tv: "TV",
    eating: "Eating",
    christmas: "Christmas",
    halloween: "Halloween",
    party: "Party",
    overlay: "Overlay",
    settings: "Settings",
    apply: "Apply scene now",
    close: "Close",
    scenes: "Scenes",
    entities: "Entities",
    automation: "Automation",
    door: "Door entities",
    gate: "Gate entities",
    person: "Person entities",
    autoReturn: "Return automatically",
    autoAway: "Leave automatically",
    grace: "Away grace (seconds)",
    schedule: "Night schedule",
    fixed: "Fixed",
    sun: "Sun",
    event: "Event",
    offset: "Offset (seconds)",
    sunset: "Sunset",
    sunrise: "Sunrise",
    legacy: "Legacy mirror",
    reason: {
        user: "changed manually",
        door: "door unlocked",
        gate: "gate opened",
        presence: "presence",
        schedule: "schedule",
        service: "service",
    },
};
const nb = {
    home: "Hjemme",
    away: "Borte",
    vacation: "Ferie",
    day: "Dag",
    night: "Natt",
    none: "Av",
    tv: "TV",
    eating: "Spise",
    christmas: "Jul",
    halloween: "Halloween",
    party: "Fest",
    overlay: "Overlegg",
    settings: "Innstillinger",
    apply: "Bruk scene nå",
    close: "Lukk",
    scenes: "Scener",
    entities: "Entiteter",
    automation: "Automatikk",
    door: "Dørlåser",
    gate: "Garasjeporter",
    person: "Personer",
    autoReturn: "Automatisk hjemkomst",
    autoAway: "Automatisk borte",
    grace: "Ventetid borte (sekunder)",
    schedule: "Nattplan",
    fixed: "Fast tid",
    sun: "Sol",
    event: "Hendelse",
    offset: "Forskyvning (sekunder)",
    sunset: "Solnedgang",
    sunrise: "Soloppgang",
    legacy: "Eldre speiling",
    reason: {
        user: "endret manuelt",
        door: "låst opp dør",
        gate: "åpnet port",
        presence: "tilstedeværelse",
        schedule: "tidsplan",
        service: "tjeneste",
    },
};
let Card = class Card extends i {
    constructor() {
        super(...arguments);
        this.busy = false;
    }
    setConfig(c) {
        if (!c.entity)
            throw Error("You must define an entity");
        this.config = {
            show_activity: true,
            show_overlay: true,
            confirm_vacation: true,
            appearance: "default",
            ...c,
        };
        this.setAttribute("data-appearance", this.config.appearance);
    }
    getCardSize() {
        return 4;
    }
    static getConfigElement() {
        return document.createElement("lovelace-house-state-editor");
    }
    static getStubConfig(h) {
        return {
            type: "custom:lovelace-house-state-card",
            entity: Object.values(h?.states || {}).find((x) => x.entity_id.startsWith("sensor.") && "presence" in x.attributes)?.entity_id || "sensor.house_state",
        };
    }
    get t() {
        return this.hass?.locale?.language?.toLowerCase().startsWith("nb") ||
            this.hass?.locale?.language?.toLowerCase().startsWith("no")
            ? nb
            : en;
    }
    toast(message) {
        this.dispatchEvent(new CustomEvent("hass-notification", {
            detail: { message },
            bubbles: true,
            composed: true,
        }));
    }
    async call(service, data = {}) {
        this.busy = true;
        try {
            await this.hass.callService("house_state", service, {
                entity_id: this.config.entity,
                ...data,
            });
        }
        catch (e) {
            this.toast(`House State: ${e?.message || e}`);
        }
        finally {
            this.busy = false;
        }
    }
    setAxis(key, value) {
        if (key === "presence" &&
            value === "vacation" &&
            this.config.confirm_vacation &&
            !window.confirm(this.t.vacation + "?"))
            return;
        void this.call("set", { [key]: value, reason: "user" });
    }
    duration(s) {
        const ms = Date.now() - new Date(s).getTime();
        if (!Number.isFinite(ms) || ms < 0)
            return "";
        const m = Math.floor(ms / 60000), h = Math.floor(m / 60), d = Math.floor(h / 24);
        return d ? `${d}d ${h % 24}h` : h ? `${h}h ${m % 60}m` : `${m}m`;
    }
    save(key, value) {
        void this.call("set_config", { [key]: value });
    }
    open() {
        this.renderRoot.querySelector("dialog")?.showModal();
    }
    close() {
        this.renderRoot.querySelector("dialog")?.close();
    }
    render() {
        const s = this.hass?.states?.[this.config?.entity];
        if (!s)
            return b `<ha-card
        ><div class="error">
          <ha-icon icon="mdi:alert-circle"></ha-icon>Entity
          ${this.config?.entity || ""} not found
        </div></ha-card
      >`;
        const a = s.attributes, t = this.t, p = a.presence || s.state, m = a.mode || "day", act = a.activity || "none", ov = a.overlay || "none", cfg = a.config || {};
        return b `<ha-card
        ><div class="header">
          <div>
            <div class="title">
              ${this.config.name || a.friendly_name || "House State"}
            </div>
          </div>
          <button class="icon" aria-label="Settings" @click=${this.open}>
            <ha-icon icon="mdi:cog-outline"></ha-icon>
          </button>
        </div>
        <div class="segment presence">
          ${["home", "away", "vacation"].map((x) => b `<button data-value=${x} class=${p === x ? "active" : ""} ?disabled=${this.busy} @click=${() => this.setAxis("presence", x)}>${t[x]}</button>`)}
        </div>
        <div class="segment mode">
          ${["day", "night"].map((x) => b `<button data-value=${x} class=${m === x ? "active" : ""} ?disabled=${this.busy || !a.mode_is_available} @click=${() => this.setAxis("mode", x)}>${t[x]}</button>`)}
        </div>
        ${this.config.show_activity && a.activity_is_available ? b `<div class="chips activities">${["none", "tv", "eating"].map((x) => b `<button data-value=${x} class=${act === x ? "active" : ""} ?disabled=${this.busy} @click=${() => this.setAxis("activity", x)}>${t[x]}</button>`)}</div>` : A}
        ${this.config.show_overlay
            ? b `<select
                class="overlay"
                aria-label=${t.overlay}
                .value=${ov}
                @change=${(e) => this.setAxis("overlay", e.target.value)}
              >
                ${(a.available_overlays || ["none", "christmas", "halloween", "party"]).map((x) => b `<option value=${x}>${t[x] || x}</option>`)}
              </select>`
            : A}
        <div class="status">
          ${t[p] || p}${p === "home" ? ` · ${t[m] || m}` : ""} ·
          ${this.duration(a.since)} ·
          ${t.reason[a.last_changed_by] || a.last_changed_by || ""}
        </div></ha-card
      >${this.settings(cfg)}`;
    }
    settings(c) {
        const t = this.t, sch = c.night_schedule || { type: "off" };
        return b `<dialog @cancel=${() => this.close()}>
      <div class="dialog-head">
        <h2>${t.settings}</h2>
        <button class="icon" aria-label=${t.close} @click=${this.close}>
          <ha-icon icon="mdi:close"></ha-icon>
        </button>
      </div>
      <div class="settings">
        <div class="section">
          <h3>${t.scenes}</h3>
          <div class="grid">
            ${SCENES.map((k) => b `<label class="field">${t[k] || k}<ha-entity-picker .hass=${this.hass} .value=${c.scene_map?.[k] || ""} .includeDomains=${["scene"]} allow-custom-entity @value-changed=${(e) => this.save("scene_map", { ...c.scene_map, [k]: e.detail.value || "" })}></ha-entity-picker></label>`)}
          </div>
        </div>
        <div class="section">
          <h3>${t.entities}</h3>
          ${[
            ["door_entities", t.door, c.door_entities, ["lock"]],
            ["gate_entities", t.gate, c.gate_entities, ["cover"]],
            ["person_entities", t.person, c.person_entities, ["person"]],
        ].map(([k, l, v, d]) => b `<label class="field"
                >${l}<ha-selector
                  name=${k}
                  .hass=${this.hass}
                  .selector=${{ entity: { multiple: true, domain: d } }}
                  .value=${v || []}
                  @value-changed=${(e) => this.save(k, e.detail.value || [])}
                ></ha-selector
              ></label>`)}
        </div>
        <div class="section">
          <h3>${t.automation}</h3>
          <label class="toggle"
            >${t.autoReturn}<ha-switch
              .checked=${!!c.auto_return}
              @change=${(e) => this.save("auto_return", e.target.checked)}
            ></ha-switch></label
          ><label class="toggle"
            >${t.autoAway}<ha-switch
              .checked=${!!c.auto_away}
              @change=${(e) => this.save("auto_away", e.target.checked)}
            ></ha-switch></label
          ><label class="field"
            >${t.grace}<input
              name="auto_away_grace"
              type="number"
              min="0"
              .value=${String(c.auto_away_grace ?? 300)}
              @change=${(e) => this.save("auto_away_grace", Number(e.target.value))} /></label
          ><label class="field"
            >${t.schedule}<select
              .value=${sch.type}
              @change=${(e) => this.save("night_schedule", { type: e.target.value })}
            >
              <option value="off">${t.none}</option>
              <option value="fixed">${t.fixed}</option>
              <option value="sun">${t.sun}</option>
            </select></label
          >${sch.type === "fixed" ? b `<label class="field">${t.fixed}<input type="time" step="1" .value=${sch.time || "22:00:00"} @change=${(e) => this.save("night_schedule", { ...sch, time: e.target.value.length === 5 ? e.target.value + ":00" : e.target.value })} /></label>` : A}${sch.type === "sun"
            ? b `<div class="grid">
                  <label class="field"
                    >${t.event}<select
                      .value=${sch.event || "sunset"}
                      @change=${(e) => this.save("night_schedule", { ...sch, event: e.target.value })}
                    >
                      <option value="sunset">${t.sunset}</option>
                      <option value="sunrise">${t.sunrise}</option>
                    </select></label
                  ><label class="field"
                    >${t.offset}<input
                      type="number"
                      .value=${String(sch.offset || 0)}
                      @change=${(e) => this.save("night_schedule", { ...sch, offset: Number(e.target.value) })}
                  /></label>
                </div>`
            : A}
        </div>
        <div class="section">
          <h3>${t.legacy}</h3>
          <div class="grid">
            ${["presence", "mode", "overlay"].map((k) => b `<label class="field">${t[k] || k}<ha-entity-picker .hass=${this.hass} .value=${c.legacy_mirror?.[k] || ""} .includeDomains=${["input_select"]} allow-custom-entity @value-changed=${(e) => this.save("legacy_mirror", { ...c.legacy_mirror, [k]: e.detail.value || "" })}></ha-entity-picker></label>`)}
          </div>
        </div>
      </div>
      <div class="dialog-actions">
        <button
          data-action="apply-scene"
          class="primary"
          @click=${() => this.call("apply_scene", { force: true })}
        >
          ${t.apply}</button
        ><button @click=${this.close}>${t.close}</button>
      </div>
    </dialog>`;
    }
};
Card.styles = styles;
__decorate([
    n({ attribute: false })
], Card.prototype, "hass", void 0);
__decorate([
    r()
], Card.prototype, "config", void 0);
__decorate([
    r()
], Card.prototype, "busy", void 0);
Card = __decorate([
    t("lovelace-house-state-card")
], Card);
const w = window;
w.customCards = w.customCards || [];
w.customCards.push({
    type: "lovelace-house-state-card",
    name: "House State Card",
    description: "Control House State",
});

export { Card };
//# sourceMappingURL=lovelace-house-state-card.js.map
