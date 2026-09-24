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
const t$1=globalThis,i$1=t=>t,s$1=t$1.trustedTypes,e=s$1?s$1.createPolicy("lit-html",{createHTML:t=>t}):void 0,h="$lit$",o$2=`lit$${Math.random().toFixed(9).slice(2)}$`,n$1="?"+o$2,r$2=`<${n$1}>`,l=document,c=()=>l.createComment(""),a=t=>null===t||"object"!=typeof t&&"function"!=typeof t,u=Array.isArray,d=t=>u(t)||"function"==typeof t?.[Symbol.iterator],f="[ \t\n\f\r]",v=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,_=/-->/g,m=/>/g,p=RegExp(`>|${f}(?:([^\\s"'>=/]+)(${f}*=${f}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),g=/'/g,$=/"/g,y=/^(?:script|style|textarea|title)$/i,x=t=>(i,...s)=>({_$litType$:t,strings:i,values:s}),b=x(1),w=x(2),E=Symbol.for("lit-noChange"),A=Symbol.for("lit-nothing"),C=new WeakMap,P=l.createTreeWalker(l,129);function V(t,i){if(!u(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==e?e.createHTML(i):i}const N=(t,i)=>{const s=t.length-1,e=[];let n,l=2===i?"<svg>":3===i?"<math>":"",c=v;for(let i=0;i<s;i++){const s=t[i];let a,u,d=-1,f=0;for(;f<s.length&&(c.lastIndex=f,u=c.exec(s),null!==u);)f=c.lastIndex,c===v?"!--"===u[1]?c=_:void 0!==u[1]?c=m:void 0!==u[2]?(y.test(u[2])&&(n=RegExp("</"+u[2],"g")),c=p):void 0!==u[3]&&(c=p):c===p?">"===u[0]?(c=n??v,d=-1):void 0===u[1]?d=-2:(d=c.lastIndex-u[2].length,a=u[1],c=void 0===u[3]?p:'"'===u[3]?$:g):c===$||c===g?c=p:c===_||c===m?c=v:(c=p,n=void 0);const x=c===p&&t[i+1].startsWith("/>")?" ":"";l+=c===v?s+r$2:d>=0?(e.push(a),s.slice(0,d)+h+s.slice(d)+o$2+x):s+o$2+(-2===d?i:x);}return [V(t,l+(t[s]||"<?>")+(2===i?"</svg>":3===i?"</math>":"")),e]};class S{constructor({strings:t,_$litType$:i},e){let r;this.parts=[];let l=0,a=0;const u=t.length-1,d=this.parts,[f,v]=N(t,i);if(this.el=S.createElement(f,e),P.currentNode=this.el.content,2===i||3===i){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes);}for(;null!==(r=P.nextNode())&&d.length<u;){if(1===r.nodeType){if(r.hasAttributes())for(const t of r.getAttributeNames())if(t.endsWith(h)){const i=v[a++],s=r.getAttribute(t).split(o$2),e=/([.?@])?(.*)/.exec(i);d.push({type:1,index:l,name:e[2],strings:s,ctor:"."===e[1]?I:"?"===e[1]?L:"@"===e[1]?z:H$1}),r.removeAttribute(t);}else t.startsWith(o$2)&&(d.push({type:6,index:l}),r.removeAttribute(t));if(y.test(r.tagName)){const t=r.textContent.split(o$2),i=t.length-1;if(i>0){r.textContent=s$1?s$1.emptyScript:"";for(let s=0;s<i;s++)r.append(t[s],c()),P.nextNode(),d.push({type:2,index:++l});r.append(t[i],c());}}}else if(8===r.nodeType)if(r.data===n$1)d.push({type:2,index:l});else {let t=-1;for(;-1!==(t=r.data.indexOf(o$2,t+1));)d.push({type:7,index:l}),t+=o$2.length-1;}l++;}}static createElement(t,i){const s=l.createElement("template");return s.innerHTML=t,s}}function M(t,i,s=t,e){if(i===E)return i;let h=void 0!==e?s._$Co?.[e]:s._$Cl;const o=a(i)?void 0:i._$litDirective$;return h?.constructor!==o&&(h?._$AO?.(false),void 0===o?h=void 0:(h=new o(t),h._$AT(t,s,e)),void 0!==e?(s._$Co??=[])[e]=h:s._$Cl=h),void 0!==h&&(i=M(t,h._$AS(t,i.values),h,e)),i}class R{constructor(t,i){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=i;}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:i},parts:s}=this._$AD,e=(t?.creationScope??l).importNode(i,true);P.currentNode=e;let h=P.nextNode(),o=0,n=0,r=s[0];for(;void 0!==r;){if(o===r.index){let i;2===r.type?i=new k(h,h.nextSibling,this,t):1===r.type?i=new r.ctor(h,r.name,r.strings,this,t):6===r.type&&(i=new Z(h,this,t)),this._$AV.push(i),r=s[++n];}o!==r?.index&&(h=P.nextNode(),o++);}return P.currentNode=l,e}p(t){let i=0;for(const s of this._$AV) void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,i),i+=s.strings.length-2):s._$AI(t[i])),i++;}}class k{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,i,s,e){this.type=2,this._$AH=A,this._$AN=void 0,this._$AA=t,this._$AB=i,this._$AM=s,this.options=e,this._$Cv=e?.isConnected??true;}get parentNode(){let t=this._$AA.parentNode;const i=this._$AM;return void 0!==i&&11===t?.nodeType&&(t=i.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,i=this){t=M(this,t,i),a(t)?t===A||null==t||""===t?(this._$AH!==A&&this._$AR(),this._$AH=A):t!==this._$AH&&t!==E&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):d(t)?this.k(t):this._(t);}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t));}_(t){this._$AH!==A&&a(this._$AH)?this._$AA.nextSibling.data=t:this.T(l.createTextNode(t)),this._$AH=t;}$(t){const{values:i,_$litType$:s}=t,e="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=S.createElement(V(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===e)this._$AH.p(i);else {const t=new R(e,this),s=t.u(this.options);t.p(i),this.T(s),this._$AH=t;}}_$AC(t){let i=C.get(t.strings);return void 0===i&&C.set(t.strings,i=new S(t)),i}k(t){u(this._$AH)||(this._$AH=[],this._$AR());const i=this._$AH;let s,e=0;for(const h of t)e===i.length?i.push(s=new k(this.O(c()),this.O(c()),this,this.options)):s=i[e],s._$AI(h),e++;e<i.length&&(this._$AR(s&&s._$AB.nextSibling,e),i.length=e);}_$AR(t=this._$AA.nextSibling,s){for(this._$AP?.(false,true,s);t!==this._$AB;){const s=i$1(t).nextSibling;i$1(t).remove(),t=s;}}setConnected(t){ void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t));}}let H$1 = class H{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,i,s,e,h){this.type=1,this._$AH=A,this._$AN=void 0,this.element=t,this.name=i,this._$AM=e,this.options=h,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=A;}_$AI(t,i=this,s,e){const h=this.strings;let o=false;if(void 0===h)t=M(this,t,i,0),o=!a(t)||t!==this._$AH&&t!==E,o&&(this._$AH=t);else {const e=t;let n,r;for(t=h[0],n=0;n<h.length-1;n++)r=M(this,e[s+n],i,n),r===E&&(r=this._$AH[n]),o||=!a(r)||r!==this._$AH[n],r===A?t=A:t!==A&&(t+=(r??"")+h[n+1]),this._$AH[n]=r;}o&&!e&&this.j(t);}j(t){t===A?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"");}};class I extends H$1{constructor(){super(...arguments),this.type=3;}j(t){this.element[this.name]=t===A?void 0:t;}}class L extends H$1{constructor(){super(...arguments),this.type=4;}j(t){this.element.toggleAttribute(this.name,!!t&&t!==A);}}class z extends H$1{constructor(t,i,s,e,h){super(t,i,s,e,h),this.type=5;}_$AI(t,i=this){if((t=M(this,t,i,0)??A)===E)return;const s=this._$AH,e=t===A&&s!==A||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,h=t!==A&&(s===A||e);e&&this.element.removeEventListener(this.name,this,s),h&&this.element.addEventListener(this.name,this,t),this._$AH=t;}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t);}}class Z{constructor(t,i,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=i,this.options=s;}get _$AU(){return this._$AM._$AU}_$AI(t){M(this,t);}}const B=t$1.litHtmlPolyfillSupport;B?.(S,k),(t$1.litHtmlVersions??=[]).push("3.3.3");const D=(t,i,s)=>{const e=s?.renderBefore??i;let h=e._$litPart$;if(void 0===h){const t=s?.renderBefore??null;e._$litPart$=h=new k(i.insertBefore(c(),t),t,void 0,s??{});}return h._$AI(t),h};

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const s=globalThis;class i extends y$1{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0;}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const r=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=D(r,this.renderRoot,this.renderOptions);}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(true);}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(false);}render(){return E}}i._$litElement$=true,i["finalized"]=true,s.litElementHydrateSupport?.({LitElement:i});const o$1=s.litElementPolyfillSupport;o$1?.({LitElement:i});(s.litElementVersions??=[]).push("4.2.2");

const colorSchemes = [
    "home-assistant",
    "bright",
    "warm",
    "mint",
    "sky",
    "lavender",
];
const en$1 = {
    label: "Color scheme",
    "home-assistant": "Home Assistant",
    bright: "Bright",
    warm: "Warm",
    mint: "Mint",
    sky: "Sky",
    lavender: "Lavender",
    invalid: "Choose a valid color_scheme: home-assistant, bright, warm, mint, sky or lavender.",
};
const nb$1 = {
    label: "Fargevalg",
    "home-assistant": "Home Assistant",
    bright: "Lys",
    warm: "Varm",
    mint: "Mint",
    sky: "Himmelblå",
    lavender: "Lavendel",
    invalid: "Velg en gyldig color_scheme: home-assistant, bright, warm, mint, sky eller lavender.",
};
function colorSchemeText(hass) {
    const language = (hass?.language || hass?.locale?.language || "en")
        .toLowerCase()
        .replace(/_/g, "-")
        .split("-")[0];
    return ["nb", "no", "nn"].includes(language) ? nb$1 : en$1;
}
function applyColorScheme(host, value, hass) {
    const scheme = value === undefined ? "home-assistant" : value;
    if (typeof scheme !== "string" ||
        !colorSchemes.includes(scheme)) {
        throw new Error(colorSchemeText(hass).invalid);
    }
    if (scheme === "home-assistant")
        host.removeAttribute("data-color-scheme");
    else
        host.setAttribute("data-color-scheme", scheme);
}
function colorSchemeSchema(hass) {
    const text = colorSchemeText(hass);
    return {
        name: "color_scheme",
        selector: {
            select: {
                mode: "dropdown",
                options: colorSchemes.map((value) => ({ value, label: text[value] })),
            },
        },
    };
}
/** Local overrides only: removing the attribute restores the dashboard theme. */
const colorSchemeStyles = i$3 `
  :host([data-color-scheme]) {
    color-scheme: light;
    --primary-text-color: #202b36;
    --secondary-text-color: #52606d;
    --disabled-text-color: #626d78;
    --text-primary-color: #fff;
    --success-color: #28723c;
    --warning-color: #8c6100;
    --error-color: #bd2635;
    --orange-color: #ab4b13;
    --info-color: #146a91;
    --primary-color: var(--scheme-accent);
    --accent-color: var(--scheme-accent);
    --card-background-color: var(--scheme-surface);
    --ha-card-background: var(--scheme-surface);
    --primary-background-color: var(--scheme-surface);
    --secondary-background-color: var(--scheme-secondary);
    --divider-color: var(--scheme-border);
    --ha-card-border-color: var(--scheme-border);
    --bubble-main-background-color: var(--scheme-surface);
    --bubble-secondary-background-color: var(--scheme-secondary);
    --bubble-icon-background-color: var(--scheme-secondary);
    --bubble-sub-button-background-color: var(--scheme-secondary);
    --bubble-accent-color: var(--scheme-accent);
    --bubble-border: 1px solid var(--scheme-border);
    --ha-card-box-shadow: 0 2px 8px rgb(32 43 54 / 0.06);
    --bubble-box-shadow: var(--ha-card-box-shadow);
    --input-fill-color: var(--scheme-secondary);
    --input-ink-color: var(--primary-text-color);
    --input-label-ink-color: var(--secondary-text-color);
    --mdc-theme-primary: var(--scheme-accent);
    --mdc-theme-surface: var(--scheme-surface);
    --mdc-theme-on-surface: var(--primary-text-color);
    --mdc-text-field-fill-color: var(--scheme-secondary);
    --mdc-text-field-ink-color: var(--primary-text-color);
  }
  :host([data-color-scheme="bright"]) {
    --scheme-surface: #ffffff;
    --scheme-secondary: #edf3fa;
    --scheme-accent: #2365a5;
    --scheme-border: #ccd9e7;
  }
  :host([data-color-scheme="warm"]) {
    --scheme-surface: #fffaf1;
    --scheme-secondary: #f4ead9;
    --scheme-accent: #885321;
    --scheme-border: #ddd0ba;
  }
  :host([data-color-scheme="mint"]) {
    --scheme-surface: #f2fbf5;
    --scheme-secondary: #dfefe5;
    --scheme-accent: #286c50;
    --scheme-border: #c1d9ca;
  }
  :host([data-color-scheme="sky"]) {
    --scheme-surface: #f1f8ff;
    --scheme-secondary: #dfeefa;
    --scheme-accent: #22638e;
    --scheme-border: #c2d8e9;
  }
  :host([data-color-scheme="lavender"]) {
    --scheme-surface: #faf5ff;
    --scheme-secondary: #ede3f6;
    --scheme-accent: #725095;
    --scheme-border: #d7c8e5;
  }
`;

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
    width: 100%;
    box-sizing: border-box;
    color: var(--primary-text-color);
    --hs-text: var(--primary-text-color, #1b1b1a);
    --hs-muted: var(--secondary-text-color, #5b5a55);
    --hs-home: var(--success-color, #2e7d32);
    --hs-away: var(--warning-color, #f59e0b);
    --hs-vacation: var(--orange-color, #ea580c);
    --hs-neutral: var(--primary-color, #03a9f4);
    --hs-overlay: var(--warning-color, #f59e0b);
    --hs-error: var(--error-color, #c62828);
    --hs-surface: var(--ha-card-background, var(--card-background-color, #fff));
    --hs-pill: var(--secondary-background-color, #f3f2ee);
    --hs-radius: 20px;
    --hs-tile: 16px;
  }
  :host([data-appearance="bubble"]) {
    --hs-surface: var(
      --bubble-main-background-color,
      var(--ha-card-background, var(--card-background-color, #fff))
    );
    --hs-pill: var(
      --bubble-secondary-background-color,
      var(--secondary-background-color, #f3f2ee)
    );
    --hs-radius: var(--bubble-border-radius, 32px);
    --hs-tile: var(--bubble-sub-button-border-radius, 22px);
  }
  * {
    box-sizing: border-box;
  }
  ha-card {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 16px;
    border-radius: var(--ha-card-border-radius, 16px);
    background: var(--hs-surface);
    --accent: var(--hs-neutral);
  }
  :host([data-appearance="bubble"]) ha-card {
    border: var(--bubble-border, none);
    border-radius: var(--bubble-border-radius, 32px);
    box-shadow: var(--bubble-box-shadow, var(--ha-card-box-shadow));
  }
  ha-card.tone-home {
    --accent: var(--hs-home);
  }
  ha-card.tone-away {
    --accent: var(--hs-away);
  }
  ha-card.tone-vacation {
    --accent: var(--hs-vacation);
  }
  .i {
    width: 22px;
    height: 22px;
    flex-shrink: 0;
  }
  .i.s {
    width: 18px;
    height: 18px;
  }
  .spin {
    animation: spin 1s linear infinite;
  }
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .spin {
      animation: none;
    }
  }
  .circ {
    flex: 0 0 44px;
    width: 44px;
    height: 44px;
    border-radius: var(--bubble-icon-border-radius, 50%);
    display: grid;
    place-items: center;
    color: color-mix(in srgb, var(--accent) 75%, var(--hs-text));
    background: color-mix(in srgb, var(--accent) 20%, transparent);
  }
  .circ.big {
    flex-basis: 52px;
    width: 52px;
    height: 52px;
  }
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    padding-left: 8px;
  }
  .title {
    font-size: 17px;
    font-weight: 700;
    color: var(--hs-muted);
  }
  .icon {
    width: 44px;
    height: 44px;
    display: grid;
    place-items: center;
    border-radius: 50%;
    color: var(--hs-muted);
    background: var(--hs-pill);
    text-decoration: none;
  }
  .hero {
    display: flex;
    gap: 14px;
    align-items: center;
    padding: 14px;
    border-radius: var(--hs-radius);
    background: var(--hs-pill);
  }
  .hero-text {
    min-width: 0;
    flex: 1;
  }
  .status {
    font-size: 13px;
    font-weight: 600;
    color: color-mix(in srgb, var(--accent) 65%, var(--hs-text));
  }
  .current {
    font-size: 32px;
    font-weight: 800;
    line-height: 1.1;
    letter-spacing: -0.01em;
    overflow-wrap: anywhere;
  }
  .context {
    font-size: 13px;
    color: var(--hs-muted);
    overflow-wrap: anywhere;
  }
  .segment {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
  .sublevels {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 6px;
    border-radius: calc(var(--hs-radius) - 2px);
    background: color-mix(in srgb, var(--hs-text) 5%, transparent);
  }
  .pill {
    flex: 1 1 90px;
    min-width: 0;
    min-height: 48px;
    border: 0;
    border-radius: 24px;
    padding: 0 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font: inherit;
    font-weight: 600;
    color: var(--hs-text);
    background: var(--hs-pill);
    cursor: pointer;
    overflow-wrap: anywhere;
  }
  .sub .pill {
    min-height: 44px;
  }
  .pill.active {
    color: color-mix(in srgb, var(--accent) 65%, var(--hs-text));
    background: color-mix(in srgb, var(--accent) 22%, var(--hs-pill));
  }
  /* Darkened so white text keeps 4.5:1 on amber and green alike. */
  .pill.leaf {
    color: #fff;
    background: color-mix(in srgb, var(--accent) 62%, #000);
  }
  .pill.confirming {
    box-shadow: inset 0 0 0 2px var(--hs-vacation);
  }
  .confirm {
    display: flex;
    flex-direction: column;
    gap: 14px;
    padding: 18px;
    border-radius: var(--hs-radius);
    background: color-mix(in srgb, var(--hs-vacation) 18%, var(--hs-pill));
    --accent: var(--hs-vacation);
  }
  .confirm-head {
    display: flex;
    gap: 14px;
    align-items: center;
  }
  .confirm-title {
    font-size: 22px;
    font-weight: 800;
  }
  .effects {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 10px;
    font-size: 15px;
  }
  .effects li {
    display: flex;
    gap: 10px;
    align-items: center;
  }
  .effects .i {
    color: color-mix(in srgb, var(--hs-vacation) 75%, var(--hs-text));
  }
  .confirm-actions {
    display: flex;
    gap: 8px;
  }
  .confirm .pill {
    background: var(--hs-surface);
  }
  .confirm .pill.strong {
    font-weight: 800;
    color: #fff;
    background: color-mix(in srgb, var(--hs-vacation) 62%, #000);
  }
  .panel {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 14px;
    border-radius: var(--hs-radius);
    background: var(--hs-pill);
    --accent: var(--hs-muted);
  }
  .panel summary {
    list-style: none;
    cursor: pointer;
    border-radius: calc(var(--hs-radius) - 6px);
  }
  .panel summary::-webkit-details-marker {
    display: none;
  }
  .panel-text {
    flex: 1;
    min-width: 0;
  }
  .chevron {
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
    color: var(--hs-muted);
    transition: transform 0.2s;
  }
  details[open] .chevron {
    transform: rotate(180deg);
  }
  details:not([open]) {
    gap: 0;
  }
  .panel.on {
    --accent: var(--hs-overlay);
  }
  .panel-head {
    display: flex;
    gap: 14px;
    align-items: center;
  }
  .caption {
    font-size: 13px;
    font-weight: 600;
    color: color-mix(in srgb, var(--accent) 65%, var(--hs-text));
  }
  .panel-value {
    font-size: 22px;
    font-weight: 800;
  }
  .chips {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
  .chip {
    min-height: 40px;
    border: 0;
    border-radius: 20px;
    padding: 0 14px;
    font: inherit;
    font-weight: 600;
    font-size: 14px;
    color: var(--hs-text);
    background: color-mix(in srgb, var(--hs-text) 7%, transparent);
    cursor: pointer;
  }
  .chip.active {
    color: color-mix(in srgb, var(--accent) 65%, var(--hs-text));
    background: color-mix(in srgb, var(--accent) 24%, transparent);
    box-shadow: inset 0 0 0 1.5px
      color-mix(in srgb, var(--accent) 60%, transparent);
  }
  .apply {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 10px 18px 10px 10px;
    border: 0;
    border-radius: var(--hs-radius);
    text-align: left;
    font: inherit;
    color: var(--hs-text);
    background: var(--hs-pill);
    cursor: pointer;
    --accent: var(--hs-muted);
  }
  .apply.attention {
    --accent: var(--hs-away);
  }
  .apply-text {
    display: flex;
    flex-direction: column;
    flex: 1;
  }
  .apply-title {
    font-size: 16px;
    font-weight: 700;
  }
  .apply-hint {
    font-size: 13px;
    color: color-mix(in srgb, var(--accent) 65%, var(--hs-text));
  }
  .feedback {
    display: flex;
    gap: 14px;
    align-items: center;
    padding: 10px 16px 10px 10px;
    border-radius: var(--hs-radius);
    background: var(--hs-pill);
    --accent: var(--hs-muted);
  }
  .feedback.failed {
    --accent: var(--hs-error);
    background: color-mix(in srgb, var(--hs-error) 16%, var(--hs-pill));
  }
  .feedback-title {
    font-size: 15px;
    font-weight: 700;
    overflow-wrap: anywhere;
  }
  .feedback-sub {
    font-size: 13px;
    color: var(--hs-muted);
  }
  .note {
    display: flex;
    gap: 8px;
    align-items: center;
    font-size: 14px;
    padding: 12px 14px;
    border-radius: var(--hs-tile);
    background: color-mix(in srgb, var(--hs-muted) 14%, var(--hs-pill));
  }
  .note.warn {
    background: color-mix(in srgb, var(--hs-error) 16%, var(--hs-pill));
  }
  .error {
    display: flex;
    gap: 8px;
    padding: 0 8px 8px;
    color: var(--error-color);
  }
  button:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
  button:focus-visible,
  a:focus-visible {
    outline: 2px solid var(--primary-color);
    outline-offset: 2px;
  }
  /* Outside: weather and sensors at the top of the card. */
  .outside {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .weather {
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    gap: 12px;
    width: 100%;
    padding: 10px 14px 10px 10px;
    border: 0;
    border-radius: var(--hs-radius);
    font: inherit;
    text-align: left;
    color: var(--hs-text);
    background: var(--hs-pill);
    cursor: pointer;
  }
  .weather.missing {
    display: block;
    font-size: 14px;
    color: var(--hs-muted);
  }
  .wx-icon {
    display: grid;
    place-items: center;
    color: var(--wx, var(--hs-muted));
  }
  .wx-sun {
    --wx: var(--amber-color, #f59e0b);
  }
  .wx-storm {
    --wx: var(--amber-color, #f59e0b);
  }
  .wx-rain {
    --wx: var(--blue-color, #3b82f6);
  }
  .wx-snow {
    --wx: var(--light-blue-color, #38bdf8);
  }
  .wx-night {
    --wx: var(--indigo-color, #6366f1);
  }
  .wx-alert {
    --wx: var(--hs-error);
  }
  .weather .i.wx {
    width: 44px;
    height: 44px;
    stroke-width: 1.6;
  }
  .wx-text,
  .wx-temps {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }
  .wx-temps {
    align-items: flex-end;
    text-align: right;
  }
  .wx-condition {
    font-size: 20px;
    font-weight: 700;
    overflow-wrap: anywhere;
  }
  .wx-place,
  .wx-range {
    font-size: 13px;
    color: var(--hs-muted);
    font-variant-numeric: tabular-nums;
  }
  .wx-now {
    font-size: 22px;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }
  .forecast {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(52px, 1fr));
    gap: 4px;
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .day {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    font-size: 13px;
    font-variant-numeric: tabular-nums;
  }
  .day-name,
  .day-low {
    color: var(--hs-muted);
  }
  .day-high {
    font-weight: 600;
  }
  .sensors {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(96px, 1fr));
    gap: 8px;
  }
  .sensor {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    min-height: 44px;
    padding: 10px 8px;
    border: 0;
    border-radius: var(--hs-tile);
    font: inherit;
    color: var(--hs-text);
    background: var(--hs-pill);
    cursor: pointer;
  }
  .sensor-icon {
    position: relative;
    display: grid;
    place-items: center;
    min-height: 24px;
    color: var(--state-icon-color, var(--hs-muted));
  }
  .badge {
    position: absolute;
    top: -6px;
    right: -12px;
    width: 16px;
    height: 16px;
    display: grid;
    place-items: center;
    border-radius: 50%;
    font-size: 11px;
    font-weight: 800;
    color: #fff;
    background: var(--hs-vacation);
  }
  .sensor-name {
    font-size: 14px;
    font-weight: 700;
    overflow-wrap: anywhere;
  }
  .sensor-value {
    font-size: 13px;
    color: var(--hs-muted);
    font-variant-numeric: tabular-nums;
  }
  /* History: one chart of the card's readings. */
  .series-0 {
    --series: var(--hs-neutral);
  }
  .series-1 {
    --series: var(--hs-away);
  }
  .series-2 {
    --series: var(--hs-home);
  }
  .series-3 {
    --series: var(--purple-color, #8e44ad);
  }
  .series-4 {
    --series: var(--hs-vacation);
  }
  dialog {
    color: var(--hs-text);
    background: var(--hs-surface);
    border: 0;
    border-radius: 24px;
    padding: 16px;
    width: min(640px, calc(100vw - 24px));
    max-width: calc(100vw - 24px);
    max-height: calc(100dvh - 32px);
    overflow: auto;
    box-shadow: 0 16px 60px #0006;
  }
  :host([data-appearance="bubble"]) dialog {
    border-radius: var(--bubble-border-radius, 32px);
  }
  dialog[open] {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  dialog::backdrop {
    background: #0008;
  }
  .dialog-top {
    display: flex;
    align-items: center;
    gap: 8px;
    padding-left: 8px;
  }
  .dialog-title {
    flex: 1;
    margin: 0;
    font-size: 17px;
    font-weight: 700;
    color: var(--hs-muted);
  }
  .subtitle {
    display: block;
    font-size: 13px;
    font-weight: 500;
  }
  button.icon {
    border: 0;
    padding: 0;
    cursor: pointer;
  }
  .history-ranges {
    display: flex;
    gap: 6px;
  }
  .history-ranges .chip {
    min-height: 44px;
    padding: 0 16px;
  }
  .history-plot {
    min-height: 120px;
    touch-action: pan-y;
  }
  .history-chart {
    display: block;
    width: 100%;
    height: auto;
  }
  .history-chart .grid {
    stroke: color-mix(in srgb, var(--hs-muted) 22%, transparent);
  }
  .history-chart .axis {
    fill: var(--hs-muted);
    font-size: 12px;
    font-variant-numeric: tabular-nums;
  }
  .history-chart .line {
    fill: none;
    stroke: var(--series);
    stroke-width: 2;
    stroke-linejoin: round;
  }
  .history-chart .cursor {
    stroke: var(--hs-muted);
    stroke-dasharray: 3 3;
  }
  .history-note {
    margin: 40px 0;
    text-align: center;
    font-size: 14px;
    color: var(--hs-muted);
  }
  .history-when {
    margin: -6px 8px 0;
    font-size: 12.5px;
    color: var(--hs-muted);
    font-variant-numeric: tabular-nums;
  }
  .history-legend {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(150px, 100%), 1fr));
    gap: 6px;
  }
  .history-item {
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: center;
    gap: 2px 10px;
    min-height: 44px;
    padding: 8px 14px;
    border: 0;
    border-radius: var(--hs-tile);
    font: inherit;
    color: var(--hs-text);
    background: var(--hs-pill);
    text-align: left;
    cursor: pointer;
  }
  .history-item .swatch {
    grid-row: span 2;
    width: 16px;
    height: 0;
    border-top: 3px solid var(--series);
  }
  .history-item .label {
    font-size: 0.78rem;
    color: var(--hs-muted);
    overflow-wrap: anywhere;
  }
  .history-item strong {
    font-size: 1rem;
    font-variant-numeric: tabular-nums;
  }
  @media (max-width: 400px) {
    ha-card {
      padding: 12px;
    }
    dialog {
      padding: 12px;
    }
    .wx-condition {
      font-size: 17px;
    }
    .current {
      font-size: 26px;
    }
  }
  ${colorSchemeStyles}
`;

const en = {
    settings: "Settings",
    off: "Off",
    apply: "Apply scene now",
    name: "Name",
    overlays: "Overlays",
    vacationTitle: "Switch to {name}?",
    vacationWater: "The water is shut off: {valves}",
    vacationGuest: "A guest visit opens the water while it lasts",
    vacationButton: "Switch to {name}",
    cancel: "Cancel",
    changedAgo: "{reason} {duration} ago",
    someoneHome: "someone is home",
    nobodyHome: "nobody is home",
    guestUntil: "guest until {time}",
    guestIn: "guest visit",
    noRule: "no rule applies now",
    manualChoice: "Chosen manually",
    applyStale: "{name}: the scene has not run yet",
    applyPending: "Waiting to run the scene",
    applyHint: "Run the scenes again",
    switching: "Switching to {name}…",
    applying: "Running the scene…",
    changingOverlay: "Changing the overlay…",
    locked: "Controls are locked until the house responds",
    stillSelected: "{name} is still selected",
    waterFailed: "Water valve problem: {valves}",
    reloading: "Reloading · last known state, controls are off",
    missing: "Entity not found",
    automatic: "Automatic",
    heldUntil: "manual until",
    reason: {
        user: "changed manually",
        door: "door unlocked",
        gate: "gate opened",
        presence: "presence",
        schedule: "schedule",
        service: "service",
    },
    title: "House State",
    appearance: "Appearance",
    defaultAppearance: "Default",
    entityLabel: "House State entity",
    showOverlay: "Show overlay",
    confirmVacation: "Confirm vacation",
    showSettings: "Show settings button",
    weatherLabel: "Weather",
    showForecast: "Show forecast",
    sensorsLabel: "Sensors",
    forecast: "Forecast",
    highLow: "High {high}, low {low}",
    unavailable: "Unavailable",
    unknown: "Unknown",
    history: "History",
    showHistory: "Show history",
    closeHistory: "Close history",
    historyRanges: "History ranges",
    loadingHistory: "Loading history…",
    noHistory: "No history for this period.",
    historyFailed: "Could not load history",
    now: "Now",
    conditions: {
        "clear-night": "Clear night",
        cloudy: "Cloudy",
        exceptional: "Exceptional",
        fog: "Fog",
        hail: "Hail",
        lightning: "Lightning",
        "lightning-rainy": "Lightning and rain",
        partlycloudy: "Partly cloudy",
        pouring: "Pouring",
        rainy: "Rainy",
        snowy: "Snowy",
        "snowy-rainy": "Sleet",
        sunny: "Sunny",
        windy: "Windy",
        "windy-variant": "Windy and cloudy",
    },
    errorPrefix: "Could not update house state",
    entityRequired: "You must define an entity",
    durationDay: "d",
    durationHour: "h",
    durationMinute: "min",
    starterStates: {
        home: "Home",
        day: "Day",
        idle: "None",
        tv: "TV",
        eating: "Eating",
        night: "Night",
        away: "Away",
        vacation: "Vacation",
    },
    starterOverlays: {
        christmas: "Christmas",
        halloween: "Halloween",
        party: "Party",
    },
};
const nb = {
    settings: "Innstillinger",
    off: "Av",
    apply: "Bruk scene nå",
    name: "Navn",
    overlays: "Overlegg",
    vacationTitle: "Bytte til {name}?",
    vacationWater: "Vannet stenges: {valves}",
    vacationGuest: "Et gjestebesøk åpner vannet mens det varer",
    vacationButton: "Bytt til {name}",
    cancel: "Avbryt",
    changedAgo: "{reason} for {duration} siden",
    someoneHome: "noen er hjemme",
    nobodyHome: "ingen er hjemme",
    guestUntil: "gjest til {time}",
    guestIn: "gjestebesøk",
    noRule: "ingen regel gjelder nå",
    manualChoice: "Valgt manuelt",
    applyStale: "{name}: scenen er ikke kjørt ennå",
    applyPending: "Venter på å kjøre scenen",
    applyHint: "Kjør scenene på nytt",
    switching: "Bytter til {name} …",
    applying: "Kjører scenen …",
    changingOverlay: "Endrer overlegg …",
    locked: "Knappene er låst til huset svarer",
    stillSelected: "{name} er fortsatt valgt",
    waterFailed: "Problem med vannventil: {valves}",
    reloading: "Laster på nytt · siste kjente tilstand, knappene er av",
    missing: "Fant ikke entiteten",
    automatic: "Automatisk",
    heldUntil: "manuelt til",
    reason: {
        user: "endret manuelt",
        door: "låst opp dør",
        gate: "åpnet port",
        presence: "tilstedeværelse",
        schedule: "tidsplan",
        service: "tjeneste",
    },
    title: "Hustilstand",
    appearance: "Utseende",
    defaultAppearance: "Standard",
    entityLabel: "Hustilstandsentitet",
    showOverlay: "Vis overlegg",
    confirmVacation: "Bekreft ferie",
    showSettings: "Vis innstillingsknapp",
    weatherLabel: "Vær",
    showForecast: "Vis værvarsel",
    sensorsLabel: "Sensorer",
    forecast: "Værvarsel",
    highLow: "Høyest {high}, lavest {low}",
    unavailable: "Utilgjengelig",
    unknown: "Ukjent",
    history: "Historikk",
    showHistory: "Vis historikk",
    closeHistory: "Lukk historikk",
    historyRanges: "Tidsrom",
    loadingHistory: "Henter historikk …",
    noHistory: "Ingen historikk for denne perioden.",
    historyFailed: "Kunne ikke hente historikk",
    now: "Nå",
    conditions: {
        "clear-night": "Klar natt",
        cloudy: "Skyet",
        exceptional: "Uvanlig vær",
        fog: "Tåke",
        hail: "Hagl",
        lightning: "Torden",
        "lightning-rainy": "Torden og regn",
        partlycloudy: "Delvis skyet",
        pouring: "Styrtregn",
        rainy: "Regn",
        snowy: "Snø",
        "snowy-rainy": "Sludd",
        sunny: "Sol",
        windy: "Vind",
        "windy-variant": "Vind og skyer",
    },
    errorPrefix: "Kunne ikke oppdatere hustilstanden",
    entityRequired: "Du må angi en entitet",
    durationDay: "d",
    durationHour: "t",
    durationMinute: "min",
    starterStates: {
        home: "Hjemme",
        day: "Dag",
        idle: "Ingen",
        tv: "TV",
        eating: "Spiser",
        night: "Natt",
        away: "Borte",
        vacation: "Ferie",
    },
    starterOverlays: { christmas: "Jul", halloween: "Halloween", party: "Fest" },
};
/** UI language is independent of service tokens and the language of source code. */
function language(hass) {
    const value = (hass?.language || hass?.locale?.language || "en")
        .toLowerCase()
        .replace(/_/g, "-");
    return /^(nb|no|nn)(-|$)/.test(value) ? "nb" : "en";
}
/** Keep regional clock conventions separate from the available translations. */
function formattingLocale(hass) {
    const requested = (hass?.language || hass?.locale?.language || "en")
        .toLowerCase()
        .replace(/_/g, "-")
        .replace(/^(no|nn)(-|$)/, "nb$2");
    try {
        return Intl.getCanonicalLocales(requested)[0] || "en";
    }
    catch {
        return "en";
    }
}
function localize(hass) {
    return language(hass) === "nb" ? nb : en;
}
/** Only the integration's unmodified starter names are display translations. */
function displayName(hass, item, kind) {
    const defaults = en[kind];
    const translated = localize(hass)[kind];
    return defaults[item.id] === item.name ? translated[item.id] : item.name;
}
/** Fill `{name}` placeholders in a dictionary string. */
function fill(text, values) {
    return text.replace(/\{(\w+)\}/g, (_, key) => values[key] ?? "");
}

const paths = {
    home: w `<path d="M3 10.5 12 3l9 7.5"></path><path d="M5 9.5V21h14V9.5"></path>`,
    away: w `<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><path d="M16 17l5-5-5-5"></path><path d="M21 12H9"></path>`,
    vacation: w `<rect x="3" y="7" width="18" height="13" rx="2"></rect><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>`,
    day: w `<circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"></path>`,
    night: w `<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"></path>`,
    tv: w `<rect x="2" y="6" width="20" height="13" rx="2"></rect><path d="M8 2l4 4 4-4"></path>`,
    eating: w `<path d="M7 2v8a2 2 0 0 0 4 0V2M9 10v12"></path><path d="M17 2c-1.7 1.5-2.5 3.5-2.5 6s1 3.5 2.5 3.5V22"></path>`,
    overlay: w `<path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"></path>`,
    apply: w `<path d="M21 12a9 9 0 1 1-2.64-6.36"></path><path d="M21 3v6h-6"></path>`,
    spinner: w `<path d="M21 12a9 9 0 1 1-6.2-8.56"></path>`,
    warning: w `<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"></path><path d="M12 9v4M12 17h.01"></path>`,
    water: w `<path d="M12 2.7s6 6.4 6 11.3a6 6 0 0 1-12 0c0-4.9 6-11.3 6-11.3z"></path>`,
    key: w `<circle cx="7.5" cy="15.5" r="4.5"></circle><path d="M10.7 12.3 21 2M16 7l3 3"></path>`,
    chevron: w `<path d="m6 9 6 6 6-6"></path>`,
    cog: w `<circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>`,
    "wx-sun": w `<circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"></path>`,
    "wx-night": w `<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"></path>`,
    "wx-cloud": w `<path d="M17.5 19H9a7 7 0 1 1 6.7-9h1.8a4.5 4.5 0 1 1 0 9z"></path>`,
    "wx-partly": w `<path d="M12 2v2M4.9 4.9l1.4 1.4M20 12h2M19.1 4.9l-1.4 1.4M15.9 12.7a4 4 0 0 0-5.9-4.1"></path><path d="M13 22H7a5 5 0 1 1 4.9-6H13a3 3 0 0 1 0 6z"></path>`,
    "wx-rain": w `<path d="M4 14.9A7 7 0 1 1 15.7 8h1.8a4.5 4.5 0 0 1 2.5 8.24"></path><path d="M16 14v6M8 14v6M12 16v6"></path>`,
    "wx-snow": w `<path d="M4 14.9A7 7 0 1 1 15.7 8h1.8a4.5 4.5 0 0 1 2.5 8.24"></path><path d="M8 15h.01M8 19h.01M12 17h.01M12 21h.01M16 15h.01M16 19h.01"></path>`,
    "wx-hail": w `<path d="M4 14.9A7 7 0 1 1 15.7 8h1.8a4.5 4.5 0 0 1 2.5 8.24"></path><path d="M16 14v2M8 14v2M12 16v2M16 20h.01M8 20h.01M12 22h.01"></path>`,
    "wx-lightning": w `<path d="M6 16.3A7 7 0 1 1 15.7 8h1.8a4.5 4.5 0 0 1 .5 8.97"></path><path d="m13 12-3 5h4l-3 5"></path>`,
    "wx-fog": w `<path d="M4 14.9A7 7 0 1 1 15.7 8h1.8a4.5 4.5 0 0 1 2.5 8.24"></path><path d="M16 17H7M17 21H9"></path>`,
    "wx-wind": w `<path d="M12.8 19.6A2 2 0 1 0 14 16H2M17.5 8a2.5 2.5 0 1 1 2 4H2M9.8 4.4A2 2 0 1 1 11 8H2"></path>`,
    history: w `<path d="M3 3v5h5"></path><path d="M3.05 13A9 9 0 1 0 6 5.3L3 8"></path><path d="M12 7v5l4 2"></path>`,
    close: w `<path d="M18 6 6 18M6 6l12 12"></path>`,
};
const STATES = new Set([
    "home",
    "away",
    "vacation",
    "day",
    "night",
    "tv",
    "eating",
]);
/** Icons exist for the integration's starter state IDs only; custom states get none. */
const hasIcon = (id) => STATES.has(id);
// No whitespace inside <svg>: it would leak into a button's textContent.
// prettier-ignore
const icon = (name, extra = "") => paths[name]
    ? b `<svg class="i ${extra}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]}</svg>`
    : null;

const RANGES = [6, 24, 168];
const PALETTE = 5;
const isTemperature = (unit) => ["°C", "°F", "K"].includes(unit);
function numeric(state) {
    if (["unavailable", "unknown", ""].includes(state))
        return undefined;
    const value = Number(state);
    return Number.isFinite(value) ? value : undefined;
}
const unitOf = (state) => String(state?.attributes.unit_of_measurement ?? "");
/**
 * A sensor tile opens the history when it is a numeric measurement; a
 * timestamp, duration or enum adds nothing drawn as a line.
 */
function hasHistory(state) {
    if (!state || !state.entity_id.startsWith("sensor."))
        return false;
    const attributes = state.attributes;
    if (["duration", "timestamp", "date", "enum"].includes(attributes.device_class))
        return false;
    if (!attributes.unit_of_measurement && !attributes.state_class)
        return false;
    return (["unavailable", "unknown"].includes(state.state) ||
        numeric(state.state) !== undefined);
}
/**
 * What one chart draws: the tapped reading first, the card's other readings
 * in its unit, and those in one more unit on a second scale. A third unit
 * would need a third scale, so it is left out.
 */
function historySources(sensors, tapped, states) {
    const readings = [
        tapped,
        ...sensors.filter((id) => id !== tapped && hasHistory(states[id])),
    ];
    const first = unitOf(states[tapped]);
    const second = readings
        .map((id) => unitOf(states[id]))
        .find((unit) => unit !== first);
    return readings
        .filter((id) => [first, second].includes(unitOf(states[id])))
        .map((entityId, i) => ({ entityId, color: i % PALETTE }));
}
/**
 * The history of each source over the last `hours`, from Home Assistant's
 * recorder, ending with the current state.
 */
async function loadHistory(connection, sources, states, hours, now = Date.now()) {
    const start = now - hours * 3600000;
    const reply = sources.length
        ? await connection.sendMessagePromise({
            type: "history/history_during_period",
            start_time: new Date(start).toISOString(),
            entity_ids: sources.map((s) => s.entityId),
            minimal_response: true,
            no_attributes: true,
            significant_changes_only: false,
        })
        : {};
    return sources.map((source) => {
        const current = states[source.entityId];
        const points = (reply?.[source.entityId] ?? []).map((row) => [
            Math.max(start, (row.lu ?? row.lc ?? 0) * 1000),
            numeric(row.s),
        ]);
        if (current)
            points.push([now, numeric(current.state)]);
        return { ...source, unit: unitOf(current), points };
    });
}
/** The value in force at `time`: the last point at or before it. */
function valueAt(series, time) {
    let value;
    for (const [t, v] of series.points) {
        if (t > time)
            break;
        value = v;
    }
    return value;
}
/** Round-number ticks covering [min, max], about `count` of them. */
function ticks(min, max, count = 4) {
    const raw = (max - min) / count || 1;
    const power = 10 ** Math.floor(Math.log10(raw));
    const step = [1, 2, 2.5, 5, 10].map((m) => m * power).find((s) => s >= raw) ??
        10 * power;
    const out = [];
    for (let v = Math.floor(min / step) * step;; v += step) {
        out.push(Number(v.toFixed(6)));
        if (v >= max - 1e-9)
            break;
    }
    return out;
}

const LEFT = 44, TOP = 24, BOTTOM = 196, H = 230, 
/** Room right of the plot for the second scale. */
GUTTER = 44;
/** Unbroken spells of a series, split where it was unavailable. */
function runs(points) {
    const out = [];
    let current = [];
    for (const [t, v] of points) {
        if (v === undefined) {
            if (current.length)
                out.push(current);
            current = [];
        }
        else
            current.push([t, v]);
    }
    if (current.length)
        out.push(current);
    return out;
}
function scale(series, pad) {
    const values = series.flatMap((s) => s.points.flatMap(([, v]) => (v === undefined ? [] : [v])));
    if (!values.length)
        return undefined;
    const lo = Math.min(...values), hi = Math.max(...values);
    const marks = ticks(lo - pad, hi + pad);
    return { marks, min: marks[0], max: marks[marks.length - 1] };
}
/** The left unit is the tapped reading's; a reading in another unit goes right. */
function units(series) {
    const left = series[0]?.unit ?? "";
    return [left, series.find((s) => s.unit !== left)?.unit];
}
/**
 * One chart of the card's readings: the tapped reading's unit on the left, a
 * right-hand scale for another unit. Unavailable spells are gaps.
 */
function chart(series, start, end, hover, text, W = 600) {
    const [leftUnit, rightUnit] = units(series);
    const RIGHT = W - (rightUnit === undefined ? 12 : GUTTER);
    const left = series.filter((s) => s.unit === leftUnit);
    const right = rightUnit === undefined ? [] : series.filter((s) => s.unit === rightUnit);
    const pad = (list, unit) => isTemperature(unit)
        ? 1
        : list.some((s) => s.points.some(([, v]) => v !== undefined && Math.abs(v) >= 10))
            ? 1
            : 0.1;
    const l = scale(left, pad(left, leftUnit)), r = scale(right, pad(right, rightUnit ?? ""));
    const x = (t) => LEFT +
        ((Math.min(Math.max(t, start), end) - start) / (end - start)) *
            (RIGHT - LEFT);
    const y = (v, s) => BOTTOM - ((v - s.min) / (s.max - s.min || 1)) * (BOTTOM - TOP);
    const hours = (end - start) / 3600000;
    const narrow = W < 480;
    const every = hours <= 6
        ? narrow
            ? 2
            : 1
        : hours <= 24
            ? narrow
                ? 6
                : 4
            : narrow
                ? 48
                : 24;
    const xTicks = [];
    const hour = new Date(start);
    hour.setMinutes(0, 0, 0);
    let midnights = 0;
    for (let t = hour.getTime(); t <= end; t += 3600000) {
        const h = new Date(t).getHours();
        if (t < start)
            continue;
        if (every >= 24
            ? h === 0 && midnights++ % (every / 24) === 0
            : h % every === 0)
            xTicks.push(t);
    }
    const path = (s, sc) => runs(s.points)
        .map((run) => run
        .map(([t, v], i) => `${i ? "L" : "M"}${x(t).toFixed(1)},${y(v, sc).toFixed(1)}`)
        .join(" "))
        .join(" ");
    // As many decimals as the tick steps need (2.5 steps show 57.5, not 58).
    const digits = (sc) => Math.min(2, Math.max(...sc.marks.map((v) => String(v).split(".")[1]?.length ?? 0)));
    const line = (s, sc) => w `<path class=${`line series-${s.color}`} data-entity=${s.entityId} d=${path(s, sc)}></path>`;
    const grid = l ?? r;
    return w `<svg class="history-chart" viewBox="0 0 ${W} ${H}" role="img" aria-label=${text.label}>
    <title>${text.label}</title>
    ${grid?.marks.map((v) => w `<line class="grid" x1=${LEFT} x2=${RIGHT} y1=${y(v, grid)} y2=${y(v, grid)}></line>`)}
    ${l
        ? l.marks.map((v) => w `<text class="axis" x=${LEFT - 6} y=${y(v, l) + 4} text-anchor="end">${text.number(v, digits(l))}</text>`)
        : A}
    ${l && leftUnit
        ? w `<text class="axis unit" x="4" y="12">${leftUnit}</text>`
        : A}
    ${r
        ? r.marks.map((v) => w `<text class="axis" x=${RIGHT + 6} y=${y(v, r) + 4}>${text.number(v, digits(r))}</text>`)
        : A}
    ${r && rightUnit
        ? w `<text class="axis unit" x=${W - 4} y="12" text-anchor="end">${rightUnit}</text>`
        : A}
    ${xTicks.map((t) => w `<line class="grid" x1=${x(t)} x2=${x(t)} y1=${TOP} y2=${BOTTOM}></line>
        <text class="axis" x=${x(t)} y=${BOTTOM + 18} text-anchor="middle">${text.time(t, every >= 24)}</text>`)}
    ${l ? left.map((s) => line(s, l)) : A}
    ${r ? right.map((s) => line(s, r)) : A}
    ${hover === undefined
        ? A
        : w `<line class="cursor" x1=${x(hover)} x2=${x(hover)} y1=${TOP} y2=${BOTTOM}></line>`}
  </svg>`;
}
/** The time under a pointer over the chart. */
function timeAt(event, element, start, end, twoScales) {
    const box = element.getBoundingClientRect();
    const W = element.viewBox?.baseVal?.width || box.width;
    const px = ((event.clientX - box.left) / box.width) * W;
    const ratio = (px - LEFT) / (W - (twoScales ? GUTTER : 12) - LEFT);
    return start + Math.min(1, Math.max(0, ratio)) * (end - start);
}

/** WeatherEntityFeature: which forecasts a weather entity offers. */
const DAILY = 1, TWICE_DAILY = 4;
/** The forecast to subscribe to: daily when offered, else day and night. */
function forecastType(state) {
    const features = Number(state?.attributes.supported_features) || 0;
    if (features & DAILY)
        return "daily";
    if (features & TWICE_DAILY)
        return "twice_daily";
    return undefined;
}
const dayKey = (date) => `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
/**
 * Forecast entries folded into local calendar days: the day's high, its low,
 * and the daytime condition. Works for daily and twice-daily forecasts.
 */
function forecastDays(entries) {
    const days = new Map();
    for (const entry of entries) {
        const date = new Date(entry.datetime);
        if (Number.isNaN(date.getTime()))
            continue;
        const key = dayKey(date);
        const day = days.get(key) ?? { date };
        const values = [entry.temperature, entry.templow].filter((v) => typeof v === "number" && Number.isFinite(v));
        if (values.length) {
            const high = entry.temperature ?? Math.max(...values);
            const low = entry.templow ?? Math.min(...values);
            day.high = day.high === undefined ? high : Math.max(day.high, high);
            day.low = day.low === undefined ? low : Math.min(day.low, low);
        }
        // The day's own condition, not the night's.
        if (!day.condition || (entry.is_daytime && !day.daytime)) {
            day.condition = entry.condition;
            day.daytime = entry.is_daytime;
        }
        days.set(key, day);
    }
    return [...days.values()].map(({ date, condition, high, low }) => ({
        date,
        condition,
        high,
        low,
    }));
}
/** Today's entry, when the forecast starts today. */
function today(days, now = new Date()) {
    return days.find((d) => dayKey(d.date) === dayKey(now));
}
/** The icon drawn for a condition (icons.ts), and its colour family. */
function conditionIcon(condition = "") {
    const map = {
        "clear-night": ["wx-night", "night"],
        cloudy: ["wx-cloud", "cloud"],
        exceptional: ["warning", "alert"],
        fog: ["wx-fog", "cloud"],
        hail: ["wx-hail", "rain"],
        lightning: ["wx-lightning", "storm"],
        "lightning-rainy": ["wx-lightning", "storm"],
        partlycloudy: ["wx-partly", "sun"],
        pouring: ["wx-rain", "rain"],
        rainy: ["wx-rain", "rain"],
        snowy: ["wx-snow", "snow"],
        "snowy-rainy": ["wx-snow", "snow"],
        sunny: ["wx-sun", "sun"],
        windy: ["wx-wind", "cloud"],
        "windy-variant": ["wx-wind", "cloud"],
    };
    const [icon, tone] = map[condition] ?? ["wx-cloud", "cloud"];
    return { icon, tone };
}

const schema = (t, hass) => [
    {
        name: "appearance",
        selector: {
            select: {
                options: [
                    { value: "default", label: t.defaultAppearance },
                    { value: "bubble", label: "Bubble" },
                ],
            },
        },
    },
    colorSchemeSchema(hass),
    {
        name: "entity",
        required: true,
        selector: { entity: { integration: "house_state", domain: "sensor" } },
    },
    { name: "name", selector: { text: {} } },
    { name: "show_overlay", selector: { boolean: {} } },
    { name: "confirm_vacation", selector: { boolean: {} } },
    { name: "show_settings", selector: { boolean: {} } },
    { name: "weather", selector: { entity: { domain: "weather" } } },
    { name: "show_forecast", selector: { boolean: {} } },
    {
        name: "sensors",
        selector: { entity: { domain: "sensor", multiple: true } },
    },
];
let Editor = class Editor extends i {
    setConfig(c) {
        this.config = {
            appearance: "default",
            color_scheme: "home-assistant",
            show_overlay: true,
            confirm_vacation: true,
            show_settings: false,
            show_forecast: false,
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
      .schema=${schema(localize(this.hass), this.hass)}
      .computeLabel=${(x) => ({ color_scheme: colorSchemeText(this.hass).label, appearance: localize(this.hass).appearance, entity: localize(this.hass).entityLabel, name: localize(this.hass).name, show_overlay: localize(this.hass).showOverlay, confirm_vacation: localize(this.hass).confirmVacation, show_settings: localize(this.hass).showSettings, weather: localize(this.hass).weatherLabel, show_forecast: localize(this.hass).showForecast, sensors: localize(this.hass).sensorsLabel })[x.name] || x.name}
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

let HouseStateCard = class HouseStateCard extends i {
    constructor() {
        super(...arguments);
        this.busy = false;
        this.range = 24;
        this.historyLoading = false;
        this.historyError = "";
        /** Bumped to ignore history replies that arrive after a reset. */
        this.historyTicket = 0;
        this.plotWidth = 600;
    }
    setConfig(config) {
        if (!config.entity)
            throw new Error(this.t.entityRequired);
        applyColorScheme(this, config.color_scheme, this.hass);
        if (this.config?.entity !== config.entity) {
            this.lastValid = undefined;
            this.failure = undefined;
            this.confirming = undefined;
        }
        if (this.config?.weather !== config.weather ||
            String(this.config?.sensors) !== String(config.sensors))
            this.resetHistory();
        this.config = {
            appearance: "default",
            show_overlay: true,
            confirm_vacation: true,
            show_settings: false,
            show_forecast: false,
            ...config,
        };
        this.setAttribute("data-appearance", this.config.appearance);
    }
    getCardSize() {
        return (6 +
            (this.config?.weather ? (this.config.show_forecast ? 3 : 1) : 0) +
            (this.config?.sensors?.length ? 2 : 0));
    }
    connectedCallback() {
        super.connectedCallback();
        this.subscribeForecast();
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this.unsubscribeForecast();
        this.resetHistory();
        this.resize?.disconnect();
        this.resize = undefined;
    }
    updated() {
        this.subscribeForecast();
        const plot = this.shadowRoot?.querySelector(".history-plot");
        if (!plot || this.resize)
            return;
        this.resize = new ResizeObserver(([entry]) => {
            const width = Math.round(entry.contentRect.width);
            // Redraw next frame, outside the observer's own layout pass.
            if (width > 0 && Math.abs(width - this.plotWidth) > 4)
                requestAnimationFrame(() => {
                    this.plotWidth = width;
                    this.requestUpdate();
                });
        });
        this.resize.observe(plot);
    }
    /**
     * Follow the weather entity's forecast while the card is shown: today's
     * high and low come from it, and the forecast row when that is on.
     */
    subscribeForecast() {
        const id = this.config?.weather;
        const type = id ? forecastType(this.hass?.states?.[id]) : undefined;
        const key = id && type && this.isConnected ? `${id}|${type}` : undefined;
        if (key === this.forecastKey)
            return;
        this.unsubscribeForecast();
        this.forecastKey = key;
        const connection = this.hass?.connection;
        if (!key || !connection)
            return;
        this.forecastUnsub = connection
            .subscribeMessage((message) => {
            if (this.forecastKey === key)
                this.forecast = forecastDays(message.forecast ?? []);
        }, {
            type: "weather/subscribe_forecast",
            entity_id: id,
            forecast_type: type,
        })
            .catch(() => undefined);
    }
    unsubscribeForecast() {
        const pending = this.forecastUnsub;
        this.forecastUnsub = undefined;
        this.forecastKey = undefined;
        this.forecast = undefined;
        void pending?.then((unsubscribe) => unsubscribe?.()).catch(() => undefined);
    }
    moreInfo(entityId) {
        this.dispatchEvent(new CustomEvent("hass-more-info", {
            detail: { entityId },
            bubbles: true,
            composed: true,
        }));
    }
    static getConfigElement() {
        return document.createElement("lovelace-house-state-editor");
    }
    static getStubConfig(hass) {
        const entity = Object.values(hass?.states || {}).find((x) => x.entity_id.startsWith("sensor.") && "active_path" in x.attributes);
        return {
            type: "custom:lovelace-house-state-card",
            entity: entity?.entity_id || "sensor.house_state",
        };
    }
    get t() {
        return localize(this.hass);
    }
    stateName(node) {
        return node ? displayName(this.hass, node, "starterStates") : undefined;
    }
    overlayName(overlay) {
        return displayName(this.hass, overlay, "starterOverlays");
    }
    friendly(entityId) {
        const name = this.hass?.states?.[entityId]?.attributes?.friendly_name;
        return typeof name === "string" && name ? name : entityId;
    }
    toast(message) {
        this.dispatchEvent(new CustomEvent("hass-notification", {
            detail: { message },
            bubbles: true,
            composed: true,
        }));
    }
    async call(service, data, pending) {
        if (this.busy)
            return false;
        this.busy = true;
        this.pending = pending;
        this.failure = undefined;
        try {
            await this.hass.callService("house_state", service, {
                entity_id: this.config.entity,
                ...data,
            });
            return true;
        }
        catch (error) {
            const message = `${this.t.errorPrefix}: ${error?.message || error}`;
            this.failure = message;
            this.toast(message);
            return false;
        }
        finally {
            this.busy = false;
            this.pending = undefined;
        }
    }
    descendants(id, nodes) {
        const found = new Set([id]);
        let changed = true;
        while (changed) {
            changed = false;
            for (const n of nodes)
                if (n.parent && found.has(n.parent) && !found.has(n.id)) {
                    found.add(n.id);
                    changed = true;
                }
        }
        return found;
    }
    /** Where selecting `id` lands after following default children. */
    effective(id, nodes) {
        let effective = id;
        const seen = new Set();
        while (!seen.has(effective)) {
            seen.add(effective);
            const next = nodes.find((n) => n.id === effective)?.default_child;
            if (!next)
                break;
            effective = next;
        }
        return effective;
    }
    inVacation(id, nodes, roles) {
        return Boolean(roles?.vacation && this.descendants(roles.vacation, nodes).has(id));
    }
    selectState(id, nodes, roles) {
        if (this.busy)
            return;
        if (this.config.confirm_vacation &&
            this.inVacation(this.effective(id, nodes), nodes, roles)) {
            this.confirming = id;
            return;
        }
        this.setState(id, nodes);
    }
    setState(id, nodes) {
        this.confirming = undefined;
        const name = this.stateName(nodes.find((n) => n.id === id)) || id;
        void this.call("set", { state: id, reason: "user" }, { kind: "state", name });
    }
    clock(value) {
        if (!value)
            return "";
        const at = new Date(String(value));
        if (Number.isNaN(at.getTime()))
            return "";
        return at.toLocaleTimeString(formattingLocale(this.hass), {
            hour: "2-digit",
            minute: "2-digit",
        });
    }
    duration(s) {
        const m = Math.floor((Date.now() - new Date(String(s)).getTime()) / 60000);
        if (!Number.isFinite(m) || m < 0)
            return "";
        return m >= 1440
            ? `${Math.floor(m / 1440)} ${this.t.durationDay} ${Math.floor((m % 1440) / 60)} ${this.t.durationHour}`
            : m >= 60
                ? `${Math.floor(m / 60)} ${this.t.durationHour} ${m % 60} ${this.t.durationMinute}`
                : `${m} ${this.t.durationMinute}`;
    }
    branches(parent, nodes) {
        return nodes.filter((n) => n.parent === parent);
    }
    tone(leaf, occupied, nodes, roles) {
        if (this.inVacation(leaf, nodes, roles))
            return "vacation";
        if (occupied === true)
            return "home";
        if (occupied === false)
            return "away";
        return "neutral";
    }
    /** The deepest state on the path that has a starter icon, else by occupancy. */
    heroIcon(path, tone) {
        const known = [...path].reverse().find(hasIcon);
        return (known ?? (tone === "home" ? "home" : tone === "neutral" ? "home" : tone));
    }
    settingsLink() {
        // The integration's configuration panel when this user has it, else its page.
        const href = this.hass?.panels?.["house-state"]
            ? "/house-state"
            : "/config/integrations/integration/house_state";
        return b `<a
      class="icon settings"
      href=${href}
      aria-label=${this.t.settings}
      title=${this.t.settings}
      >${icon("cog")}</a
    >`;
    }
    /** The cog is optional; a card that cannot show the house always offers it. */
    header(title, failed = false) {
        return b `<div class="header">
      <div class="title">${title}</div>
      ${this.config?.show_settings || failed ? this.settingsLink() : A}
    </div>`;
    }
    number(value, digits = 1) {
        try {
            return new Intl.NumberFormat(formattingLocale(this.hass), {
                maximumFractionDigits: digits,
            }).format(value);
        }
        catch {
            return String(value);
        }
    }
    temperature(value, unit) {
        const n = Number(value);
        if (value === undefined || value === null || !Number.isFinite(n))
            return "";
        return `${this.number(n)}${unit ? ` ${unit}` : ""}`;
    }
    /** A forecast day's temperature, without the unit: "11.3°". */
    degrees(value) {
        return value === undefined ? "" : `${this.number(value)}°`;
    }
    condition(state) {
        if (["unavailable", "unknown"].includes(state.state))
            return state.state === "unknown" ? this.t.unknown : this.t.unavailable;
        const formatted = this.hass?.formatEntityState?.(state);
        if (formatted && formatted !== state.state)
            return formatted;
        return this.t.conditions[state.state] ?? state.state;
    }
    /** A sensor's value as Home Assistant formats it, else locale digits and unit. */
    sensorValue(state) {
        if (!state || state.state === "unavailable")
            return this.t.unavailable;
        if (state.state === "unknown")
            return this.t.unknown;
        const formatted = this.hass?.formatEntityState?.(state);
        if (formatted)
            return formatted;
        const n = Number(state.state);
        const unit = state.attributes.unit_of_measurement;
        return `${Number.isFinite(n) && state.state !== "" ? this.number(n, 2) : state.state}${unit ? ` ${unit}` : ""}`;
    }
    weekday(date) {
        try {
            return new Intl.DateTimeFormat(formattingLocale(this.hass), {
                weekday: "short",
            }).format(date);
        }
        catch {
            return date.toDateString().slice(0, 3);
        }
    }
    renderWeather(id) {
        const state = this.hass?.states?.[id];
        if (!state)
            return b `<div class="weather missing" data-weather>
        ${this.t.missing}: ${id}
      </div>`;
        const unit = String(state.attributes.temperature_unit ?? "");
        const days = this.forecast ?? [];
        const now = today(days);
        const { icon: name, tone } = conditionIcon(state.state);
        const high = this.temperature(now?.high, unit);
        const low = this.temperature(now?.low, unit);
        return b `<button
        class="weather"
        data-weather
        type="button"
        @click=${() => this.moreInfo(id)}
      >
        <span class="wx-icon wx-${tone}">${icon(name, "wx")}</span>
        <span class="wx-text">
          <span class="wx-condition">${this.condition(state)}</span>
          <span class="wx-place">${this.friendly(id)}</span>
        </span>
        <span class="wx-temps">
          <span class="wx-now"
            >${this.temperature(state.attributes.temperature, unit)}</span
          >
          ${high && low
            ? b `<span
                  class="wx-range"
                  title=${fill(this.t.highLow, { high, low })}
                  >${high} / ${low}</span
                >`
            : A}
        </span>
      </button>
      ${this.config.show_forecast && days.length
            ? b `<ol class="forecast" aria-label=${this.t.forecast}>
              ${days.slice(0, 5).map((day) => {
                const c = conditionIcon(day.condition);
                const label = day.condition
                    ? (this.t.conditions[day.condition] ?? day.condition)
                    : "";
                return b `<li class="day" data-day>
                  <span class="day-name">${this.weekday(day.date)}</span>
                  <span
                    class="wx-icon wx-${c.tone}"
                    role="img"
                    aria-label=${label}
                    title=${label}
                    >${icon(c.icon, "wx")}</span
                  >
                  <span class="day-high">${this.degrees(day.high)}</span>
                  <span class="day-low">${this.degrees(day.low)}</span>
                </li>`;
            })}
            </ol>`
            : A}`;
    }
    renderSensors(ids) {
        return b `<div class="sensors">
      ${ids.map((id) => {
            const state = this.hass?.states?.[id];
            const down = !state || state.state === "unavailable";
            const history = hasHistory(state);
            return b `<button
          class="sensor ${down ? "down" : ""}"
          data-sensor=${id}
          type="button"
          aria-haspopup=${history ? "dialog" : A}
          title=${history ? this.t.showHistory : ""}
          @click=${() => (history ? this.openHistory(id) : this.moreInfo(id))}
        >
          <span class="sensor-icon"
            >${state ? b `<ha-state-icon .hass=${this.hass} .stateObj=${state}></ha-state-icon>` : A}${down ? b `<span class="badge" aria-hidden="true">!</span>` : A}</span
          >
          <span class="sensor-name">${this.friendly(id)}</span>
          <span class="sensor-value">${this.sensorValue(state)}</span>
        </button>`;
        })}
    </div>`;
    }
    /** Weather and sensors at the top, when the card is set up with them. */
    renderOutside() {
        const weather = this.config?.weather;
        const sensors = this.config?.sensors ?? [];
        if (!weather && !sensors.length)
            return A;
        return b `<section class="outside">
      ${weather ? this.renderWeather(weather) : A}
      ${sensors.length ? this.renderSensors(sensors) : A}
    </section>`;
    }
    /** Drop loaded history and ignore replies still in flight. */
    resetHistory() {
        this.historyTicket++;
        this.historyFor = this.series = this.window = this.hover = undefined;
        this.historyLoading = false;
        this.historyError = "";
        this.shadowRoot?.querySelector("#history")?.close();
    }
    async openHistory(id) {
        if (!this.hass)
            return;
        this.resetHistory();
        this.historyFor = historySources(this.config.sensors ?? [], id, this.hass.states);
        await this.updateComplete;
        const dialog = this.shadowRoot?.querySelector("#history");
        if (dialog && !dialog.open)
            dialog.showModal();
        void this.loadHistory();
    }
    async loadHistory(range = this.range) {
        const sources = this.historyFor;
        const connection = this.hass?.connection;
        if (!sources)
            return;
        const ticket = ++this.historyTicket;
        this.range = range;
        this.historyLoading = true;
        this.historyError = "";
        this.hover = undefined;
        const end = Date.now();
        try {
            if (!connection)
                throw new Error(this.t.unavailable);
            const series = await loadHistory(connection, sources, this.hass.states, range, end);
            if (ticket !== this.historyTicket)
                return;
            this.series = series;
            this.window = [end - range * 3600000, end];
        }
        catch (error) {
            if (ticket !== this.historyTicket)
                return;
            this.series = this.window = undefined;
            this.historyError = `${this.t.historyFailed}: ${error?.message || error}`;
        }
        this.historyLoading = false;
    }
    closeOnBackdrop(e) {
        if (e.target !== e.currentTarget)
            return;
        const dialog = e.currentTarget;
        const r = dialog.getBoundingClientRect();
        if (e.clientX < r.left ||
            e.clientX > r.right ||
            e.clientY < r.top ||
            e.clientY > r.bottom)
            dialog.close();
    }
    historyDialog(title) {
        if (!this.config?.sensors?.length)
            return A;
        const locale = formattingLocale(this.hass);
        const format = this.hass?.locale?.time_format;
        const hour12 = format === "12" ? true : format === "24" ? false : undefined;
        const time = (ms, withDay) => {
            try {
                return new Intl.DateTimeFormat(locale, withDay
                    ? { weekday: "short", day: "numeric" }
                    : { hour: "2-digit", minute: "2-digit", hour12 }).format(ms);
            }
            catch {
                return new Date(ms).toLocaleTimeString();
            }
        };
        const span = (hours) => {
            try {
                return new Intl.NumberFormat(locale, {
                    style: "unit",
                    unit: hours < 48 ? "hour" : "day",
                    unitDisplay: "short",
                }).format(hours < 48 ? hours : hours / 24);
            }
            catch {
                return hours < 48 ? `${hours} h` : `${hours / 24} d`;
            }
        };
        const number = (value, digits) => new Intl.NumberFormat(locale, {
            minimumFractionDigits: digits,
            maximumFractionDigits: digits,
        }).format(value);
        const series = this.series;
        const window = this.window;
        const at = this.hover;
        const twoScales = !!series && units(series)[1] !== undefined;
        const close = () => this.shadowRoot?.querySelector("#history")?.close();
        return b `<dialog
      id="history"
      aria-labelledby="history-title"
      @click=${this.closeOnBackdrop}
      @close=${() => {
            this.historyTicket++;
            this.historyLoading = false;
            this.hover = undefined;
        }}
    >
      <div class="dialog-top">
        <h2 class="dialog-title" id="history-title">
          ${this.t.history}<span class="subtitle">${title}</span>
        </h2>
        <button
          class="icon"
          data-close-history
          aria-label=${this.t.closeHistory}
          title=${this.t.closeHistory}
          @click=${close}
        >
          ${icon("close")}
        </button>
      </div>
      <div
        class="history-ranges"
        role="group"
        aria-label=${this.t.historyRanges}
      >
        ${RANGES.map((hours) => b `<button
              class="chip ${this.range === hours ? "active" : ""}"
              data-range=${hours}
              aria-pressed=${String(this.range === hours)}
              @click=${() => void this.loadHistory(hours)}
            >
              ${span(hours)}
            </button>`)}
      </div>
      <div
        class="history-plot"
        aria-busy=${String(this.historyLoading)}
        @pointermove=${(e) => {
            const svg = e.currentTarget.querySelector("svg");
            if (!svg || !window)
                return;
            this.hover = timeAt(e, svg, window[0], window[1], twoScales);
        }}
        @pointerleave=${() => (this.hover = undefined)}
      >
        ${this.historyError
            ? b `<div class="feedback failed" role="alert">
                <span class="circ">${icon("warning")}</span>
                <div class="feedback-title">${this.historyError}</div>
              </div>`
            : !series || !window
                ? b `<p class="history-note" role="status">
                  ${this.t.loadingHistory}
                </p>`
                : series.every((s) => s.points.every(([, v]) => v === undefined))
                    ? b `<p class="history-note">${this.t.noHistory}</p>`
                    : chart(series, window[0], window[1], at, { number, time, label: `${this.t.history}: ${title}` }, Math.max(280, this.plotWidth))}
      </div>
      <p class="history-when" aria-live="polite">
        ${at === undefined ? this.t.now : time(at, false)}
      </p>
      <div class="history-legend">
        ${(series ?? []).map((s) => {
            const value = at === undefined
                ? s.points[s.points.length - 1]?.[1]
                : valueAt(s, at);
            return b `<button
            class="history-item series-${s.color}"
            data-series=${s.entityId}
            @click=${() => {
                close();
                this.moreInfo(s.entityId);
            }}
          >
            <span class="swatch" aria-hidden="true"></span>
            <span class="label">${this.friendly(s.entityId)}</span>
            <strong
              >${value === undefined ? "—" : `${this.number(value, 2)}${s.unit ? ` ${s.unit}` : ""}`}</strong
            >
          </button>`;
        })}
      </div>
    </dialog>`;
    }
    renderLevels(levels, path, nodes, roles, disabled) {
        const leaf = path[path.length - 1];
        // Compact on purpose: whitespace inside a button would become part of its
        // name, and the state names are compared exactly.
        // prettier-ignore
        const level = (group, depth) => b `<div class="segment ${depth ? "sub" : "top"}">${group.map((n) => b `<button data-state=${n.id} class="pill ${path.includes(n.id) ? "active" : ""} ${n.id === leaf ? "leaf" : ""} ${this.confirming === n.id ? "confirming" : ""}" aria-pressed=${path.includes(n.id) ? "true" : "false"} ?disabled=${disabled} @click=${() => this.selectState(n.id, nodes, roles)}>${depth < 2 && hasIcon(n.id) ? icon(n.id, "s") : A}${this.stateName(n)}</button>`)}</div>`;
        const [top, ...rest] = levels;
        return b `${top ? level(top, 0) : A}
    ${rest.length
            ? b `<div class="sublevels">
            ${rest.map((group, i) => level(group, i + 1))}
          </div>`
            : A}`;
    }
    renderConfirmation(nodes, cfg) {
        const id = this.confirming;
        if (!id)
            return A;
        const name = this.stateName(nodes.find((n) => n.id === id)) || id;
        const valves = Array.isArray(cfg.water_valves)
            ? cfg.water_valves
            : [];
        return b `<div
      class="confirm"
      role="alertdialog"
      aria-labelledby="vacation-title"
      data-confirm-vacation
    >
      <div class="confirm-head">
        <span class="circ">${icon("vacation")}</span>
        <div id="vacation-title" class="confirm-title">
          ${fill(this.t.vacationTitle, { name })}
        </div>
      </div>
      ${valves.length
            ? b `<ul class="effects">
              <li>
                ${icon("water", "s")}${fill(this.t.vacationWater, {
                valves: valves.map((v) => this.friendly(v)).join(", "),
            })}
              </li>
              <li>${icon("key", "s")}${this.t.vacationGuest}</li>
            </ul>`
            : A}
      <div class="confirm-actions">
        <button
          class="pill"
          data-cancel
          @click=${() => (this.confirming = undefined)}
        >
          ${this.t.cancel}
        </button>
        <button
          class="pill strong"
          data-confirm
          ?disabled=${this.busy}
          @click=${() => this.setState(id, nodes)}
        >
          ${fill(this.t.vacationButton, { name })}
        </button>
      </div>
    </div>`;
    }
    renderOverlay(a, overlays, disabled) {
        const choice = a.overlay_choice ?? a.overlay ?? "none";
        const inForce = overlays.find((o) => o.id === a.overlay);
        const rule = overlays.find((o) => o.id === a.overlay_rule);
        const automatic = overlays.some((o) => o.calendar || o.dates);
        const held = this.clock(a.overlay_hold_until);
        const caption = choice === "auto"
            ? `${this.t.automatic} · ${rule ? this.overlayName(rule) : this.t.noRule}`
            : held
                ? `${this.t.manualChoice} · ${this.t.heldUntil} ${held}`
                : this.t.manualChoice;
        const chip = (value, label) => b `<button
        class="chip ${choice === value ? "active" : ""}"
        data-overlay=${value}
        aria-pressed=${choice === value ? "true" : "false"}
        ?disabled=${disabled}
        @click=${() => choice === value
            ? undefined
            : this.call("set", { overlay: value, reason: "user" }, { kind: "overlay" })}
      >
        ${label}
      </button>`;
        // Closed by default: overlays are occasional, the row still says which
        // one is in force and why. Lit leaves the viewer's open state alone.
        return b `<details class="panel overlay ${inForce ? "on" : ""}">
      <summary class="panel-head">
        <span class="circ">${icon("overlay")}</span>
        <div class="panel-text">
          <div class="caption overlay-caption">
            ${this.t.overlays} · ${caption}
          </div>
          <div class="panel-value">
            ${inForce ? this.overlayName(inForce) : this.t.off}
          </div>
        </div>
        <span class="chevron">${icon("chevron")}</span>
      </summary>
      <div class="chips" role="group" aria-label=${this.t.overlays}>
        ${automatic ? chip("auto", this.t.automatic) : A}
        ${chip("none", this.t.off)}
        ${overlays.map((o) => chip(o.id, this.overlayName(o)))}
      </div>
    </details>`;
    }
    renderApply(a, overlays, disabled) {
        const inForce = overlays.find((o) => o.id === a.overlay);
        const hint = a.application_pending
            ? this.t.applyPending
            : a.scene_stale
                ? fill(this.t.applyStale, {
                    name: inForce ? this.overlayName(inForce) : this.t.title,
                })
                : this.t.applyHint;
        const attention = Boolean(a.application_pending || a.scene_stale);
        return b `<button
      class="apply ${attention ? "attention" : ""}"
      data-action="apply"
      type="button"
      ?disabled=${disabled}
      @click=${() => this.call("apply_scene", { force: true }, { kind: "apply" })}
    >
      <span class="circ">${icon("apply")}</span>
      <span class="apply-text">
        <span class="apply-title">${this.t.apply}</span>
        <span class="apply-hint">${hint}</span>
      </span>
    </button>`;
    }
    renderFeedback(current) {
        if (this.pending) {
            const label = this.pending.kind === "state"
                ? fill(this.t.switching, { name: this.pending.name })
                : this.pending.kind === "apply"
                    ? this.t.applying
                    : this.t.changingOverlay;
            return b `<div class="feedback" role="status">
        <span class="circ">${icon("spinner", "spin")}</span>
        <div>
          <div class="feedback-title">${label}</div>
          <div class="feedback-sub">${this.t.locked}</div>
        </div>
      </div>`;
        }
        if (this.failure)
            return b `<div class="feedback failed" role="alert">
        <span class="circ">${icon("warning")}</span>
        <div>
          <div class="feedback-title">${this.failure}</div>
          <div class="feedback-sub">
            ${fill(this.t.stillSelected, { name: current })}
          </div>
        </div>
      </div>`;
        return A;
    }
    render() {
        const liveEntity = this.hass?.states?.[this.config?.entity];
        const liveNodes = liveEntity?.attributes?.state_tree ||
            liveEntity?.attributes?.config?.state_tree;
        const available = Boolean(liveEntity &&
            liveEntity.state !== "unavailable" &&
            liveEntity.state !== "unknown" &&
            Array.isArray(liveNodes) &&
            liveNodes.length);
        if (available)
            this.lastValid = liveEntity;
        const entity = available ? liveEntity : this.lastValid;
        const title = this.config?.name ||
            entity?.attributes?.friendly_name ||
            this.t.title;
        if (!entity)
            return b `<ha-card
        >${this.header(this.config?.name || this.t.title, true)}
        ${this.renderOutside()}
        <div class="error">${this.t.missing}: ${this.config?.entity || ""}</div>
        ${this.historyDialog(this.config?.name || this.t.title)}</ha-card
      >`;
        const a = entity.attributes;
        const cfg = a.config || {
            state_tree: a.state_tree,
            overlays: a.overlays,
            roles: {},
            initial_state: a.state,
        };
        const nodes = a.state_tree || cfg.state_tree || [];
        if (!nodes.length)
            return b `<ha-card
        >${this.header(title, true)} ${this.renderOutside()}
        <div class="error">
          ${this.t.missing}: ${this.config.entity} (${entity.state})
        </div>
        ${this.historyDialog(this.config?.name || this.t.title)}</ha-card
      >`;
        const path = a.active_path || [];
        const overlays = a.overlays || cfg.overlays || [];
        const roles = cfg.roles || {};
        const levels = [
            this.branches(null, nodes),
            ...path.map((id) => this.branches(id, nodes)),
        ].filter((x) => x.length);
        const byId = new Map(nodes.map((n) => [n.id, n]));
        const leaf = path[path.length - 1] || "";
        const current = this.stateName(byId.get(leaf)) || entity.state;
        const tone = this.tone(leaf, a.occupied, nodes, roles);
        const disabled = this.busy || !available;
        const reason = this.t.reason[a.last_changed_by] ||
            a.last_changed_by ||
            "";
        const ago = this.duration(a.since);
        const reasonLine = reason
            ? ago
                ? fill(this.t.changedAgo, { reason, duration: ago })
                : reason
            : ago;
        const visitUntil = a.visit ? this.clock(a.visit.expires) : "";
        const context = [
            path.map((id) => this.stateName(byId.get(id)) || id).join(" › "),
            a.occupied === true
                ? this.t.someoneHome
                : a.occupied === false
                    ? this.t.nobodyHome
                    : "",
            a.visit
                ? visitUntil
                    ? fill(this.t.guestUntil, { time: visitUntil })
                    : this.t.guestIn
                : "",
        ].filter(Boolean);
        const water = a.water;
        const failedValves = water?.status === "failed" && water.valves
            ? Object.entries(water.valves)
                .filter(([, s]) => s !== "open" && s !== "closed")
                .map(([id]) => this.friendly(id))
            : [];
        return b `<ha-card class="tone-${tone}"
      >${this.header(title)} ${this.renderOutside()}
      <div class="hero">
        <span class="circ big">${icon(this.heroIcon(path, tone))}</span>
        <div class="hero-text">
          <div class="status">
            ${reasonLine.charAt(0).toLocaleUpperCase(formattingLocale(this.hass)) + reasonLine.slice(1)}
          </div>
          <div class="current">${current}</div>
          <div class="context" title=${context.join(" · ")}>
            ${context.join(" · ")}
          </div>
        </div>
      </div>
      ${!available
            ? b `<div class="note" role="status">${this.t.reloading}</div>`
            : A}
      ${failedValves.length
            ? b `<div class="note warn" role="alert">
              ${icon("water", "s")}
              ${fill(this.t.waterFailed, { valves: failedValves.join(", ") })}
            </div>`
            : A}
      ${this.renderLevels(levels, path, nodes, roles, disabled)}
      ${this.renderConfirmation(nodes, cfg)}
      ${this.config.show_overlay
            ? this.renderOverlay(a, overlays, disabled)
            : A}
      ${this.renderApply(a, overlays, disabled)} ${this.renderFeedback(current)}
      ${this.historyDialog(title)}
    </ha-card>`;
    }
};
HouseStateCard.styles = styles;
__decorate([
    n({ attribute: false })
], HouseStateCard.prototype, "hass", void 0);
__decorate([
    r()
], HouseStateCard.prototype, "config", void 0);
__decorate([
    r()
], HouseStateCard.prototype, "busy", void 0);
__decorate([
    r()
], HouseStateCard.prototype, "pending", void 0);
__decorate([
    r()
], HouseStateCard.prototype, "failure", void 0);
__decorate([
    r()
], HouseStateCard.prototype, "confirming", void 0);
__decorate([
    r()
], HouseStateCard.prototype, "forecast", void 0);
__decorate([
    r()
], HouseStateCard.prototype, "historyFor", void 0);
__decorate([
    r()
], HouseStateCard.prototype, "series", void 0);
__decorate([
    r()
], HouseStateCard.prototype, "window", void 0);
__decorate([
    r()
], HouseStateCard.prototype, "hover", void 0);
__decorate([
    r()
], HouseStateCard.prototype, "range", void 0);
__decorate([
    r()
], HouseStateCard.prototype, "historyLoading", void 0);
__decorate([
    r()
], HouseStateCard.prototype, "historyError", void 0);
HouseStateCard = __decorate([
    t("lovelace-house-state-card")
], HouseStateCard);
const registry = window;
registry.customCards = registry.customCards || [];
registry.customCards.push({
    type: "lovelace-house-state-card",
    name: "House State Card",
});

export { HouseStateCard };
//# sourceMappingURL=lovelace-house-state-card.js.map
