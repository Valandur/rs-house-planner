function v(){}const ot=t=>t;function ct(t,e){for(const n in e)t[n]=e[n];return t}function K(t){return t()}function H(){return Object.create(null)}function E(t){t.forEach(K)}function z(t){return typeof t=="function"}function Rt(t,e){return t!=t?e==e:t!==e||t&&typeof t=="object"||typeof t=="function"}function lt(t){return Object.keys(t).length===0}function ut(t,...e){if(t==null)return v;const n=t.subscribe(...e);return n.unsubscribe?()=>n.unsubscribe():n}function Tt(t,e,n){t.$$.on_destroy.push(ut(e,n))}function qt(t,e,n,i){if(t){const r=Q(t,e,n,i);return t[0](r)}}function Q(t,e,n,i){return t[1]&&i?ct(n.ctx.slice(),t[1](i(e))):n.ctx}function zt(t,e,n,i){if(t[2]&&i){const r=t[2](i(n));if(e.dirty===void 0)return r;if(typeof r=="object"){const u=[],s=Math.max(e.dirty.length,r.length);for(let o=0;o<s;o+=1)u[o]=e.dirty[o]|r[o];return u}return e.dirty|r}return e.dirty}function Bt(t,e,n,i,r,u){if(r){const s=Q(e,n,i,u);t.p(s,r)}}function Ft(t){if(t.ctx.length>32){const e=[],n=t.ctx.length/32;for(let i=0;i<n;i++)e[i]=-1;return e}return-1}const U=typeof window<"u";let at=U?()=>window.performance.now():()=>Date.now(),B=U?t=>requestAnimationFrame(t):v;const $=new Set;function V(t){$.forEach(e=>{e.c(t)||($.delete(e),e.f())}),$.size!==0&&B(V)}function ft(t){let e;return $.size===0&&B(V),{promise:new Promise(n=>{$.add(e={c:t,f:n})}),abort(){$.delete(e)}}}let O=!1;function dt(){O=!0}function _t(){O=!1}function ht(t,e,n,i){for(;t<e;){const r=t+(e-t>>1);n(r)<=i?t=r+1:e=r}return t}function mt(t){if(t.hydrate_init)return;t.hydrate_init=!0;let e=t.childNodes;if(t.nodeName==="HEAD"){const c=[];for(let l=0;l<e.length;l++){const d=e[l];d.claim_order!==void 0&&c.push(d)}e=c}const n=new Int32Array(e.length+1),i=new Int32Array(e.length);n[0]=-1;let r=0;for(let c=0;c<e.length;c++){const l=e[c].claim_order,d=(r>0&&e[n[r]].claim_order<=l?r+1:ht(1,r,h=>e[n[h]].claim_order,l))-1;i[c]=n[d]+1;const a=d+1;n[a]=c,r=Math.max(a,r)}const u=[],s=[];let o=e.length-1;for(let c=n[r]+1;c!=0;c=i[c-1]){for(u.push(e[c-1]);o>=c;o--)s.push(e[o]);o--}for(;o>=0;o--)s.push(e[o]);u.reverse(),s.sort((c,l)=>c.claim_order-l.claim_order);for(let c=0,l=0;c<s.length;c++){for(;l<u.length&&s[c].claim_order>=u[l].claim_order;)l++;const d=l<u.length?u[l]:null;t.insertBefore(s[c],d)}}function pt(t,e){t.appendChild(e)}function X(t){if(!t)return document;const e=t.getRootNode?t.getRootNode():t.ownerDocument;return e&&e.host?e:t.ownerDocument}function yt(t){const e=Z("style");return gt(X(t),e),e.sheet}function gt(t,e){return pt(t.head||t,e),e.sheet}function bt(t,e){if(O){for(mt(t),(t.actual_end_child===void 0||t.actual_end_child!==null&&t.actual_end_child.parentNode!==t)&&(t.actual_end_child=t.firstChild);t.actual_end_child!==null&&t.actual_end_child.claim_order===void 0;)t.actual_end_child=t.actual_end_child.nextSibling;e!==t.actual_end_child?(e.claim_order!==void 0||e.parentNode!==t)&&t.insertBefore(e,t.actual_end_child):t.actual_end_child=e.nextSibling}else(e.parentNode!==t||e.nextSibling!==null)&&t.appendChild(e)}function It(t,e,n){O&&!n?bt(t,e):(e.parentNode!==t||e.nextSibling!=n)&&t.insertBefore(e,n||null)}function Y(t){t.parentNode&&t.parentNode.removeChild(t)}function Ht(t,e){for(let n=0;n<t.length;n+=1)t[n]&&t[n].d(e)}function Z(t){return document.createElement(t)}function F(t){return document.createTextNode(t)}function Wt(){return F(" ")}function Gt(){return F("")}function Jt(t,e,n,i){return t.addEventListener(e,n,i),()=>t.removeEventListener(e,n,i)}function Kt(t){return function(e){return e.stopPropagation(),t.call(this,e)}}function Qt(t,e,n){n==null?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}function xt(t){return Array.from(t.childNodes)}function $t(t){t.claim_info===void 0&&(t.claim_info={last_index:0,total_claimed:0})}function tt(t,e,n,i,r=!1){$t(t);const u=(()=>{for(let s=t.claim_info.last_index;s<t.length;s++){const o=t[s];if(e(o)){const c=n(o);return c===void 0?t.splice(s,1):t[s]=c,r||(t.claim_info.last_index=s),o}}for(let s=t.claim_info.last_index-1;s>=0;s--){const o=t[s];if(e(o)){const c=n(o);return c===void 0?t.splice(s,1):t[s]=c,r?c===void 0&&t.claim_info.last_index--:t.claim_info.last_index=s,o}}return i()})();return u.claim_order=t.claim_info.total_claimed,t.claim_info.total_claimed+=1,u}function wt(t,e,n,i){return tt(t,r=>r.nodeName===e,r=>{const u=[];for(let s=0;s<r.attributes.length;s++){const o=r.attributes[s];n[o.name]||u.push(o.name)}u.forEach(s=>r.removeAttribute(s))},()=>i(e))}function Ut(t,e,n){return wt(t,e,n,Z)}function vt(t,e){return tt(t,n=>n.nodeType===3,n=>{const i=""+e;if(n.data.startsWith(i)){if(n.data.length!==i.length)return n.splitText(i.length)}else n.data=i},()=>F(e),!0)}function Vt(t){return vt(t," ")}function Xt(t,e){e=""+e,t.wholeText!==e&&(t.data=e)}function Yt(t,e,n,i){n===null?t.style.removeProperty(e):t.style.setProperty(e,n,i?"important":"")}function Zt(t,e,n){for(let i=0;i<t.options.length;i+=1){const r=t.options[i];if(r.__value===e){r.selected=!0;return}}(!n||e!==void 0)&&(t.selectedIndex=-1)}function te(t){const e=t.querySelector(":checked");return e&&e.__value}function ee(t,e,n){t.classList[n?"add":"remove"](e)}function et(t,e,{bubbles:n=!1,cancelable:i=!1}={}){const r=document.createEvent("CustomEvent");return r.initCustomEvent(t,n,i,e),r}function ne(t,e){return new t(e)}const j=new Map;let M=0;function Et(t){let e=5381,n=t.length;for(;n--;)e=(e<<5)-e^t.charCodeAt(n);return e>>>0}function Nt(t,e){const n={stylesheet:yt(e),rules:{}};return j.set(t,n),n}function W(t,e,n,i,r,u,s,o=0){const c=16.666/i;let l=`{
`;for(let y=0;y<=1;y+=c){const g=e+(n-e)*u(y);l+=y*100+`%{${s(g,1-g)}}
`}const d=l+`100% {${s(n,1-n)}}
}`,a=`__svelte_${Et(d)}_${o}`,h=X(t),{stylesheet:f,rules:_}=j.get(h)||Nt(h,t);_[a]||(_[a]=!0,f.insertRule(`@keyframes ${a} ${d}`,f.cssRules.length));const m=t.style.animation||"";return t.style.animation=`${m?`${m}, `:""}${a} ${i}ms linear ${r}ms 1 both`,M+=1,a}function kt(t,e){const n=(t.style.animation||"").split(", "),i=n.filter(e?u=>u.indexOf(e)<0:u=>u.indexOf("__svelte")===-1),r=n.length-i.length;r&&(t.style.animation=i.join(", "),M-=r,M||At())}function At(){B(()=>{M||(j.forEach(t=>{const{ownerNode:e}=t.stylesheet;e&&Y(e)}),j.clear())})}let A;function k(t){A=t}function I(){if(!A)throw new Error("Function called outside component initialization");return A}function ie(t){I().$$.on_mount.push(t)}function re(t){I().$$.after_update.push(t)}function se(){const t=I();return(e,n,{cancelable:i=!1}={})=>{const r=t.$$.callbacks[e];if(r){const u=et(e,n,{cancelable:i});return r.slice().forEach(s=>{s.call(t,u)}),!u.defaultPrevented}return!0}}function oe(t,e){const n=t.$$.callbacks[e.type];n&&n.slice().forEach(i=>i.call(this,e))}const x=[],G=[];let w=[];const J=[],nt=Promise.resolve();let q=!1;function it(){q||(q=!0,nt.then(rt))}function ce(){return it(),nt}function P(t){w.push(t)}const R=new Set;let b=0;function rt(){if(b!==0)return;const t=A;do{try{for(;b<x.length;){const e=x[b];b++,k(e),St(e.$$)}}catch(e){throw x.length=0,b=0,e}for(k(null),x.length=0,b=0;G.length;)G.pop()();for(let e=0;e<w.length;e+=1){const n=w[e];R.has(n)||(R.add(n),n())}w.length=0}while(x.length);for(;J.length;)J.pop()();q=!1,R.clear(),k(t)}function St(t){if(t.fragment!==null){t.update(),E(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(P)}}function Ct(t){const e=[],n=[];w.forEach(i=>t.indexOf(i)===-1?e.push(i):n.push(i)),n.forEach(i=>i()),w=e}let N;function jt(){return N||(N=Promise.resolve(),N.then(()=>{N=null})),N}function T(t,e,n){t.dispatchEvent(et(`${e?"intro":"outro"}${n}`))}const C=new Set;let p;function le(){p={r:0,c:[],p}}function ue(){p.r||E(p.c),p=p.p}function Mt(t,e){t&&t.i&&(C.delete(t),t.i(e))}function ae(t,e,n,i){if(t&&t.o){if(C.has(t))return;C.add(t),p.c.push(()=>{C.delete(t),i&&(n&&t.d(1),i())}),t.o(e)}else i&&i()}const Pt={duration:0};function fe(t,e,n,i){const r={direction:"both"};let u=e(t,n,r),s=i?0:1,o=null,c=null,l=null;function d(){l&&kt(t,l)}function a(f,_){const m=f.b-s;return _*=Math.abs(m),{a:s,b:f.b,d:m,duration:_,start:f.start,end:f.start+_,group:f.group}}function h(f){const{delay:_=0,duration:m=300,easing:y=ot,tick:g=v,css:D}=u||Pt,L={start:at()+_,b:f};f||(L.group=p,p.r+=1),o||c?c=L:(D&&(d(),l=W(t,s,f,m,_,y,D)),f&&g(0,1),o=a(L,m),P(()=>T(t,f,"start")),ft(S=>{if(c&&S>c.start&&(o=a(c,m),c=null,T(t,o.b,"start"),D&&(d(),l=W(t,s,o.b,o.duration,0,y,u.css))),o){if(S>=o.end)g(s=o.b,1-s),T(t,o.b,"end"),c||(o.b?d():--o.group.r||E(o.group.c)),o=null;else if(S>=o.start){const st=S-o.start;s=o.a+o.d*y(st/o.duration),g(s,1-s)}}return!!(o||c)}))}return{run(f){z(u)?jt().then(()=>{u=u(r),h(f)}):h(f)},end(){d(),o=c=null}}}function de(t){t&&t.c()}function _e(t,e){t&&t.l(e)}function Ot(t,e,n,i){const{fragment:r,after_update:u}=t.$$;r&&r.m(e,n),i||P(()=>{const s=t.$$.on_mount.map(K).filter(z);t.$$.on_destroy?t.$$.on_destroy.push(...s):E(s),t.$$.on_mount=[]}),u.forEach(P)}function Dt(t,e){const n=t.$$;n.fragment!==null&&(Ct(n.after_update),E(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}function Lt(t,e){t.$$.dirty[0]===-1&&(x.push(t),it(),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function he(t,e,n,i,r,u,s,o=[-1]){const c=A;k(t);const l=t.$$={fragment:null,ctx:[],props:u,update:v,not_equal:r,bound:H(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(e.context||(c?c.$$.context:[])),callbacks:H(),dirty:o,skip_bound:!1,root:e.target||c.$$.root};s&&s(l.root);let d=!1;if(l.ctx=n?n(t,e.props||{},(a,h,...f)=>{const _=f.length?f[0]:h;return l.ctx&&r(l.ctx[a],l.ctx[a]=_)&&(!l.skip_bound&&l.bound[a]&&l.bound[a](_),d&&Lt(t,a)),h}):[],l.update(),d=!0,E(l.before_update),l.fragment=i?i(l.ctx):!1,e.target){if(e.hydrate){dt();const a=xt(e.target);l.fragment&&l.fragment.l(a),a.forEach(Y)}else l.fragment&&l.fragment.c();e.intro&&Mt(t.$$.fragment),Ot(t,e.target,e.anchor,e.customElement),_t(),rt()}k(c)}class me{$destroy(){Dt(this,1),this.$destroy=v}$on(e,n){if(!z(n))return v;const i=this.$$.callbacks[e]||(this.$$.callbacks[e]=[]);return i.push(n),()=>{const r=i.indexOf(n);r!==-1&&i.splice(r,1)}}$set(e){this.$$set&&!lt(e)&&(this.$$.skip_bound=!0,this.$$set(e),this.$$.skip_bound=!1)}}export{Ot as A,Dt as B,qt as C,Bt as D,Ft as E,zt as F,bt as G,v as H,Tt as I,Ht as J,ee as K,ot as L,Jt as M,P as N,fe as O,Kt as P,E as Q,se as R,me as S,Zt as T,z as U,oe as V,te as W,Wt as a,It as b,Vt as c,ae as d,Gt as e,ue as f,Mt as g,Y as h,he as i,re as j,Z as k,Ut as l,xt as m,Qt as n,ie as o,Yt as p,F as q,vt as r,Rt as s,ce as t,Xt as u,le as v,G as w,ne as x,de as y,_e as z};
