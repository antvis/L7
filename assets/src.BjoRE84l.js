import{a as e,n as t,r as n,t as r}from"./rolldown-runtime.BWaJ3C7D.js";import{$ as i,$n as a,$t as o,A as s,An as c,At as l,B as u,Br as d,Cn as f,Cr as p,Ct as m,Dn as h,Dt as g,E as _,Er as v,Fn as y,Fr as b,G as x,Gn as S,Gr as C,Gt as w,H as ee,Hn as te,Hr as ne,Ht as re,I as ie,In as ae,It as oe,Jn as T,Jr as se,Jt as ce,K as le,Kr as ue,Ln as de,Lr as fe,M as pe,Mn as me,Mr as he,N as E,Nn as ge,Nr as _e,Nt as ve,O as ye,On as be,Or as xe,Ot as D,P as Se,Pn as Ce,Pr as we,Pt as Te,Q as O,Qn as Ee,Qt as De,R as Oe,Rn as ke,Rr as Ae,Rt as je,S as Me,Sn as Ne,Sr as Pe,Tn as Fe,Tr as Ie,Tt as Le,U as Re,Un as ze,Ur as Be,Ut as Ve,Vn as He,Vr as Ue,Vt as We,W as Ge,Wt as Ke,Xn as qe,Y as Je,Yn as Ye,Yt as Xe,Z as k,Zn as Ze,Zt as Qe,_n as $e,_r as et,ar as tt,b as nt,bn as rt,br as it,bt as at,c as ot,cn as st,ct,dn as lt,dr as ut,dt,en as ft,er as pt,f as mt,fr as ht,g as gt,gn as _t,gr as vt,hn as yt,ht as bt,i as xt,in as St,ir as Ct,it as wt,jn as Tt,jr as Et,jt as Dt,kn as Ot,kr as A,kt,ln as At,lr as jt,m as Mt,mn as Nt,mr as Pt,n as Ft,nr as j,nt as It,o as Lt,or as Rt,ot as zt,p as Bt,pn as Vt,pr as Ht,pt as Ut,q as Wt,qn as Gt,qr as Kt,qt,rn as Jt,rr as Yt,rt as Xt,sn as Zt,sr as Qt,t as $t,tn as en,tr as tn,tt as nn,u as rn,un as an,ur as on,ut as sn,v as cn,vn as ln,vr as un,vt as dn,w as fn,wn as pn,wr as mn,xn as hn,xr as gn,xt as _n,yn as vn,yr as yn,z as bn,zn as xn,zr as Sn,zt as Cn}from"./src.qO5FRARK.js";import{a as wn,n as Tn,r as En}from"./es.wrXYKEoh.js";import{a as Dn,c as On,m as kn,x as An,y as jn}from"./es.BjQe5CBK.js";import{t as Mn}from"./pbf.CYHPD90P.js";import{A as Nn,B as Pn,C as Fn,D as In,E as Ln,F as Rn,G as zn,H as Bn,I as Vn,O as Hn,P as Un,R as Wn,S as Gn,U as Kn,X as qn,Y as Jn,Z as Yn,a as Xn,b as Zn,g as Qn,i as $n,k as er,l as tr,n as nr,s as rr,t as ir,v as ar,y as or}from"./esm.BuGXx9Hg.js";import{a as sr,i as cr,l as lr,n as ur,o as dr,r as M,s as fr,t as pr,u as mr}from"./tslib.es6.CJ7RrVwt.js";var hr,gr=t((()=>{E(),D(),hr=class{constructor(){this.name=`data-mapping`}apply(e,{styleAttributeService:t,mapService:n,fontService:r}){this.mapService=n,this.fontService=r,e.hooks.init.tapPromise(`DataMappingPlugin`,async()=>{e.log(ct.MappingStart,It.INIT),this.generateMaping(e,{styleAttributeService:t}),e.log(ct.MappingEnd,It.INIT)}),e.hooks.beforeRenderData.tapPromise(`DataMappingPlugin`,async n=>{if(!n)return n;e.dataState.dataMappingNeedUpdate=!1,e.log(ct.MappingStart,It.UPDATE);let r=this.generateMaping(e,{styleAttributeService:t});return e.log(ct.MappingEnd,It.UPDATE),r}),e.hooks.beforeRender.tap(`DataMappingPlugin`,()=>{let n=e.getSource();if(e.layerModelNeedUpdate||!n||!n.inited)return;let r=t.getLayerStyleAttributes()||[],i=t.getLayerStyleAttribute(`filter`),{dataArray:a}=n.data;if(Array.isArray(a)&&a.length===0)return;let o=r.filter(e=>e.needRemapping),s=a;if(i?.needRemapping&&i?.scale&&(s=a.filter(e=>this.applyAttributeMapping(i,e)[0])),o.length){let t=this.mapping(e,o,s,e.getEncodedData());e.setEncodedData(t),e.emit(`remapping`,null)}})}generateMaping(e,{styleAttributeService:t}){let n=t.getLayerStyleAttributes()||[],r=t.getLayerStyleAttribute(`filter`),{dataArray:i}=e.getSource().data,a=n.filter(e=>e.scale!==void 0).filter(e=>e.name!==`filter`),o=r?.scale,s=[];if(o)for(let e=0;e<i.length;e++){let t=i[e];this.applyAttributeMapping(r,t)[0]&&s.push(t)}else s=i;let c=e.processData(s),l=this.mapping(e,a,c,void 0);return n.forEach(e=>{e.needRemapping=!1}),this.adjustData2SimpleCoordinates(l),e.setEncodedData(l),e.emit(`dataUpdate`,null),!0}mapping(e,t,n,r){let i=t.filter(e=>e.scale!==void 0).filter(e=>e.name!==`filter`),a=n.map((e,t)=>{let n=r?r[t]:{},a={id:e._id,coordinates:e.coordinates,...n};return i.forEach(t=>{let n=this.applyAttributeMapping(t,e);(t.name===`color`||t.name===`stroke`)&&(n=n.map(e=>A(e))),a[t.name]=Array.isArray(n)&&n.length===1?n[0]:n,t.name===`shape`&&(a.shape=this.fontService.getIconFontKey(a[t.name]))}),a});return t.forEach(e=>{e.needRemapping=!1}),this.adjustData2SimpleCoordinates(a),a}adjustData2SimpleCoordinates(e){e.length>0&&this.mapService.version===`SIMPLE`&&e.map(e=>{e.simpleCoordinate||=(e.coordinates=this.unProjectCoordinates(e.coordinates),!0)})}unProjectCoordinates(e){if(typeof e[0]==`number`)return this.mapService.simpleMapCoord.unproject(e);if(e[0]&&e[0][0]instanceof Array){let t=[];return e.map(e=>{let n=[];e.map(e=>{n.push(this.mapService.simpleMapCoord.unproject(e))}),t.push(n)}),t}{let t=[];return e.map(e=>{t.push(this.mapService.simpleMapCoord.unproject(e))}),t}}applyAttributeMapping(e,t){if(!e.scale)return[];let n=e?.scale?.scalers||[],r=[];return n.forEach(({field:n})=>{(t.hasOwnProperty(n)||e.scale?.type===`variable`)&&r.push(t[n])}),e.mapping?e.mapping(r):[]}getArrowPoints(e,t){let n=[t[0]-e[0],t[1]-e[1]],r=ge(n);return[e[0]+r[0]*1e-4,e[1]+r[1]*1e-4]}}})),_r,vr=t((()=>{_r=class{constructor(){this.invalidExtent=!1}update(e){this.extent=e,this.setCenter(e),this.invalidExtent=e[0]===e[2]||e[1]===e[3]}setCenter(e){this.center=[(e[0]+e[2])/2,(e[1]+e[3])/2],(isNaN(this.center[0])||isNaN(this.center[1]))&&(this.center=[108.92361111111111,34.54083333333333])}}})),yr,br,xr,Sr,Cr=t((()=>{yr=class extends Error{constructor(e){super(`ParserNotFoundError: parser not registered for type "${e}"`),this.name=`ParserNotFoundError`,this.type=e}},br=class extends Error{constructor(e){super(`TransformNotFoundError: transform not registered for type "${e}"`),this.name=`TransformNotFoundError`,this.type=e}},xr=class{constructor(){this.parsers={},this.transforms={}}registerParser(e,t){this.parsers[e]=t}registerTransform(e,t){this.transforms[e]=t}getParser(e){let t=this.parsers[e];if(t===void 0)throw new yr(e);return t}getTransform(e){let t=this.transforms[e];if(t===void 0)throw new br(e);return t}},Sr=new xr})),wr=r(((e,t,n)=>{(function(n,r){typeof e==`object`&&t!==void 0?t.exports=r():typeof define==`function`&&define.amd?define(r):(n=typeof globalThis<`u`?globalThis:n||self,n.Supercluster=r())})(n,(function(){function e(n,r,i,a,o,s){if(!(o-a<=i)){var c=a+o>>1;t(n,r,c,a,o,s%2),e(n,r,i,a,c-1,s+1),e(n,r,i,c+1,o,s+1)}}function t(e,r,i,a,o,s){for(;o>a;){if(o-a>600){var c=o-a+1,l=i-a+1,u=Math.log(c),d=.5*Math.exp(2*u/3),f=.5*Math.sqrt(u*d*(c-d)/c)*(l-c/2<0?-1:1);t(e,r,i,Math.max(a,Math.floor(i-l*d/c+f)),Math.min(o,Math.floor(i+(c-l)*d/c+f)),s)}var p=r[2*i+s],m=a,h=o;for(n(e,r,a,i),r[2*o+s]>p&&n(e,r,a,o);m<h;){for(n(e,r,m,h),m++,h--;r[2*m+s]<p;)m++;for(;r[2*h+s]>p;)h--}r[2*a+s]===p?n(e,r,a,h):(h++,n(e,r,h,o)),h<=i&&(a=h+1),i<=h&&(o=h-1)}}function n(e,t,n,i){r(e,n,i),r(t,2*n,2*i),r(t,2*n+1,2*i+1)}function r(e,t,n){var r=e[t];e[t]=e[n],e[n]=r}function i(e,t,n,r,i,a,o){for(var s=[0,e.length-1,0],c=[],l,u;s.length;){var d=s.pop(),f=s.pop(),p=s.pop();if(f-p<=o)for(var m=p;m<=f;m++)l=t[2*m],u=t[2*m+1],l>=n&&l<=i&&u>=r&&u<=a&&c.push(e[m]);else{var h=Math.floor((p+f)/2);l=t[2*h],u=t[2*h+1],l>=n&&l<=i&&u>=r&&u<=a&&c.push(e[h]);var g=(d+1)%2;(d===0?n<=l:r<=u)&&(s.push(p),s.push(h-1),s.push(g)),(d===0?i>=l:a>=u)&&(s.push(h+1),s.push(f),s.push(g))}}return c}function a(e,t,n,r,i,a){for(var s=[0,e.length-1,0],c=[],l=i*i;s.length;){var u=s.pop(),d=s.pop(),f=s.pop();if(d-f<=a)for(var p=f;p<=d;p++)o(t[2*p],t[2*p+1],n,r)<=l&&c.push(e[p]);else{var m=Math.floor((f+d)/2),h=t[2*m],g=t[2*m+1];o(h,g,n,r)<=l&&c.push(e[m]);var _=(u+1)%2;(u===0?n-i<=h:r-i<=g)&&(s.push(f),s.push(m-1),s.push(_)),(u===0?n+i>=h:r+i>=g)&&(s.push(m+1),s.push(d),s.push(_))}}return c}function o(e,t,n,r){var i=e-n,a=t-r;return i*i+a*a}var s=function(e){return e[0]},c=function(e){return e[1]},l=function(t,n,r,i,a){n===void 0&&(n=s),r===void 0&&(r=c),i===void 0&&(i=64),a===void 0&&(a=Float64Array),this.nodeSize=i,this.points=t;for(var o=t.length<65536?Uint16Array:Uint32Array,l=this.ids=new o(t.length),u=this.coords=new a(t.length*2),d=0;d<t.length;d++)l[d]=d,u[2*d]=n(t[d]),u[2*d+1]=r(t[d]);e(l,u,i,0,l.length-1,0)};l.prototype.range=function(e,t,n,r){return i(this.ids,this.coords,e,t,n,r,this.nodeSize)},l.prototype.within=function(e,t,n){return a(this.ids,this.coords,e,t,n,this.nodeSize)};var u={minZoom:0,maxZoom:16,minPoints:2,radius:40,extent:512,nodeSize:64,log:!1,generateId:!1,reduce:null,map:function(e){return e}},d=Math.fround||(function(e){return(function(t){return e[0]=+t,e[0]})})(new Float32Array(1)),f=function(e){this.options=x(Object.create(u),e),this.trees=Array(this.options.maxZoom+1)};f.prototype.load=function(e){var t=this.options,n=t.log,r=t.minZoom,i=t.maxZoom,a=t.nodeSize;n&&console.time(`total time`);var o=`prepare `+e.length+` points`;n&&console.time(o),this.points=e;for(var s=[],c=0;c<e.length;c++)e[c].geometry&&s.push(m(e[c],c));this.trees[i+1]=new l(s,S,C,a,Float32Array),n&&console.timeEnd(o);for(var u=i;u>=r;u--){var d=+Date.now();s=this._cluster(s,u),this.trees[u]=new l(s,S,C,a,Float32Array),n&&console.log(`z%d: %d clusters in %dms`,u,s.length,+Date.now()-d)}return n&&console.timeEnd(`total time`),this},f.prototype.getClusters=function(e,t){var n=((e[0]+180)%360+360)%360-180,r=Math.max(-90,Math.min(90,e[1])),i=e[2]===180?180:((e[2]+180)%360+360)%360-180,a=Math.max(-90,Math.min(90,e[3]));if(e[2]-e[0]>=360)n=-180,i=180;else if(n>i){var o=this.getClusters([n,r,180,a],t),s=this.getClusters([-180,r,i,a],t);return o.concat(s)}for(var c=this.trees[this._limitZoom(t)],l=c.range(_(n),v(a),_(i),v(r)),u=[],d=0,f=l;d<f.length;d+=1){var p=f[d],m=c.points[p];u.push(m.numPoints?h(m):this.points[m.index])}return u},f.prototype.getChildren=function(e){var t=this._getOriginId(e),n=this._getOriginZoom(e),r=`No cluster with the specified id.`,i=this.trees[n];if(!i)throw Error(r);var a=i.points[t];if(!a)throw Error(r);for(var o=this.options.radius/(this.options.extent*2**(n-1)),s=i.within(a.x,a.y,o),c=[],l=0,u=s;l<u.length;l+=1){var d=u[l],f=i.points[d];f.parentId===e&&c.push(f.numPoints?h(f):this.points[f.index])}if(c.length===0)throw Error(r);return c},f.prototype.getLeaves=function(e,t,n){t||=10,n||=0;var r=[];return this._appendLeaves(r,e,t,n,0),r},f.prototype.getTile=function(e,t,n){var r=this.trees[this._limitZoom(e)],i=2**e,a=this.options,o=a.extent,s=a.radius/o,c=(n-s)/i,l=(n+1+s)/i,u={features:[]};return this._addTileFeatures(r.range((t-s)/i,c,(t+1+s)/i,l),r.points,t,n,i,u),t===0&&this._addTileFeatures(r.range(1-s/i,c,1,l),r.points,i,n,i,u),t===i-1&&this._addTileFeatures(r.range(0,c,s/i,l),r.points,-1,n,i,u),u.features.length?u:null},f.prototype.getClusterExpansionZoom=function(e){for(var t=this._getOriginZoom(e)-1;t<=this.options.maxZoom;){var n=this.getChildren(e);if(t++,n.length!==1)break;e=n[0].properties.cluster_id}return t},f.prototype._appendLeaves=function(e,t,n,r,i){for(var a=this.getChildren(t),o=0,s=a;o<s.length;o+=1){var c=s[o],l=c.properties;if(l&&l.cluster?i+l.point_count<=r?i+=l.point_count:i=this._appendLeaves(e,l.cluster_id,n,r,i):i<r?i++:e.push(c),e.length===n)break}return i},f.prototype._addTileFeatures=function(e,t,n,r,i,a){for(var o=0,s=e;o<s.length;o+=1){var c=t[s[o]],l=c.numPoints,u=void 0,d=void 0,f=void 0;if(l)u=g(c),d=c.x,f=c.y;else{var p=this.points[c.index];u=p.properties,d=_(p.geometry.coordinates[0]),f=v(p.geometry.coordinates[1])}var m={type:1,geometry:[[Math.round(this.options.extent*(d*i-n)),Math.round(this.options.extent*(f*i-r))]],tags:u},h=void 0;l?h=c.id:this.options.generateId?h=c.index:this.points[c.index].id&&(h=this.points[c.index].id),h!==void 0&&(m.id=h),a.features.push(m)}},f.prototype._limitZoom=function(e){return Math.max(this.options.minZoom,Math.min(Math.floor(+e),this.options.maxZoom+1))},f.prototype._cluster=function(e,t){for(var n=[],r=this.options,i=r.radius,a=r.extent,o=r.reduce,s=r.minPoints,c=i/(a*2**t),l=0;l<e.length;l++){var u=e[l];if(!(u.zoom<=t)){u.zoom=t;for(var d=this.trees[t+1],f=d.within(u.x,u.y,c),m=u.numPoints||1,h=m,g=0,_=f;g<_.length;g+=1){var v=_[g],y=d.points[v];y.zoom>t&&(h+=y.numPoints||1)}if(h>m&&h>=s){for(var b=u.x*m,x=u.y*m,S=o&&m>1?this._map(u,!0):null,C=(l<<5)+(t+1)+this.points.length,w=0,ee=f;w<ee.length;w+=1){var te=ee[w],ne=d.points[te];if(!(ne.zoom<=t)){ne.zoom=t;var re=ne.numPoints||1;b+=ne.x*re,x+=ne.y*re,ne.parentId=C,o&&(S||=this._map(u,!0),o(S,this._map(ne)))}}u.parentId=C,n.push(p(b/h,x/h,C,h,S))}else if(n.push(u),h>1)for(var ie=0,ae=f;ie<ae.length;ie+=1){var oe=ae[ie],T=d.points[oe];T.zoom<=t||(T.zoom=t,n.push(T))}}}return n},f.prototype._getOriginId=function(e){return e-this.points.length>>5},f.prototype._getOriginZoom=function(e){return(e-this.points.length)%32},f.prototype._map=function(e,t){if(e.numPoints)return t?x({},e.properties):e.properties;var n=this.points[e.index].properties,r=this.options.map(n);return t&&r===n?x({},r):r};function p(e,t,n,r,i){return{x:d(e),y:d(t),zoom:1/0,id:n,parentId:-1,numPoints:r,properties:i}}function m(e,t){var n=e.geometry.coordinates,r=n[0],i=n[1];return{x:d(_(r)),y:d(v(i)),zoom:1/0,index:t,parentId:-1}}function h(e){return{type:`Feature`,id:e.id,properties:g(e),geometry:{type:`Point`,coordinates:[y(e.x),b(e.y)]}}}function g(e){var t=e.numPoints,n=t>=1e4?Math.round(t/1e3)+`k`:t>=1e3?Math.round(t/100)/10+`k`:t;return x(x({},e.properties),{cluster:!0,cluster_id:e.id,point_count:t,point_count_abbreviated:n})}function _(e){return e/360+.5}function v(e){var t=Math.sin(e*Math.PI/180),n=.5-.25*Math.log((1+t)/(1-t))/Math.PI;return n<0?0:n>1?1:n}function y(e){return(e-.5)*360}function b(e){var t=(180-e*360)*Math.PI/180;return 360*Math.atan(Math.exp(t))/Math.PI-90}function x(e,t){for(var n in t)e[n]=t[n];return e}function S(e){return e.x}function C(e){return e.y}return f}))}));function Tr(e,t){let{radius:n=40,maxZoom:r=18,minZoom:i=0,zoom:a=2}=t;if(e.pointIndex)return e.dataArray=Dr(e.pointIndex.getClusters(e.extent,Math.floor(a))),e;let o=new Or.default({radius:n,minZoom:i,maxZoom:r}),s={type:`FeatureCollection`,features:[]};return s.features=e.dataArray.map(e=>({type:`Feature`,geometry:{type:`Point`,coordinates:e.coordinates},properties:{...e}})),o.load(s.features),o}function Er(e,t){return kr||=(console.warn('[L7] `{ type: "cluster" }` transform is deprecated and corrupts source.data; use `cluster: true` source config (+ clusterOptions) instead.'),!0),Tr(e,t)}function Dr(e){return e.map((e,t)=>({coordinates:e.geometry.coordinates,_id:t+1,...e.properties}))}var Or,kr,Ar=t((()=>{Or=e(wr()),kr=!1}));function jr(e){if(e.length===0)throw Error(`max requires at least one data point`);let t=e[0];for(let n=1;n<e.length;n++)e[n]>t&&(t=e[n]);return t}function Mr(e){if(e.length===0)throw Error(`min requires at least one data point`);let t=e[0];for(let n=1;n<e.length;n++)e[n]<t&&(t=e[n]);return t}function Nr(e){if(e.length===0)return 0;let t=e[0],n=0,r;for(let i=1;i<e.length;i++)r=t+e[i]*1,Math.abs(t)>=Math.abs(e[i])?n+=t-r+e[i]:n+=e[i]-r+t,t=r;return t+n*1}function Pr(e){if(e.length===0)throw Error(`mean requires at least one data point`);return Nr(e)/e.length}var Fr,Ir=t((()=>{Fr={min:Mr,max:jr,mean:Pr,sum:Nr}})),Lr=r(((e,t)=>{t.exports=n;function n(e,t){var i=e&&e.type,a;if(i===`FeatureCollection`)for(a=0;a<e.features.length;a++)n(e.features[a],t);else if(i===`GeometryCollection`)for(a=0;a<e.geometries.length;a++)n(e.geometries[a],t);else if(i===`Feature`)n(e.geometry,t);else if(i===`Polygon`)r(e.coordinates,t);else if(i===`MultiPolygon`)for(a=0;a<e.coordinates.length;a++)r(e.coordinates[a],t);return e}function r(e,t){if(e.length!==0){i(e[0],t);for(var n=1;n<e.length;n++)i(e[n],!t)}}function i(e,t){for(var n=0,r=0,i=0,a=e.length,o=a-1;i<a;o=i++){var s=(e[i][0]-e[o][0])*(e[o][1]+e[i][1]),c=n+s;r+=Math.abs(n)>=Math.abs(s)?n-c+s:s-c+n,n=c}n+r>=0!=!!t&&e.reverse()}}));function Rr(e,t){return e.map(e=>e[t]*1)}function zr(e){return Array.isArray(e)?e.length===0||typeof e[0]==`number`:!1}function Br(e){let t=Object.isFrozen(e)?vt.cloneDeep(e):e;return(0,Hr.default)(t,!0),t}function Vr(e,t){return e||[[t[0],t[3]],[t[2],t[3]],[t[2],t[1]],[t[0],t[1]]]}var Hr,Ur=t((()=>{D(),Hr=e(Lr())})),Wr,Gr,Kr,qr=t((()=>{D(),Cr(),Ar(),Ir(),Ur(),{isFunction:Wr,isString:Gr}=vt,Kr=class{constructor(e,t,n=Sr){this.getExtent=e,this.getInvalidExtent=t,this.registry=n,this.enabled=!1,this.options={radius:40,maxZoom:20,zoom:-99,method:`count`},this.index=null}init(e){if(!this.enabled)return;let t=this.options||{};this.index=Tr(e,t)}updateData(e){let{method:t=`sum`,field:n}=this.options,r=this.index.getClusters(this.calcExtent(2),Math.floor(e));return this.options.zoom=e,r.forEach(e=>{e.id||(e.properties.point_count=1)}),(n||Wr(t))&&(r=r.map(e=>{let r=e.id;if(r){let i=this.index.getLeaves(r,1/0).map(e=>e.properties),a;if(Gr(t)&&n){let e=Rr(i,n);a=Fr[t](e)}Wr(t)&&(a=t(i)),e.properties.stat=a}else e.properties.point_count=1;return e})),this.registry.getParser(`geojson`)({type:`FeatureCollection`,features:r})}getClusters(e){return this.index.getClusters(this.calcExtent(2),e)}getClustersLeaves(e){return this.index.getLeaves(e,1/0)}destroy(){this.index=null}calcExtent(e){let t=[[-1/0,-1/0],[1/0,1/0]];return this.getInvalidExtent()||(t=Ce(_t(this.getExtent()),e)),t[0].concat(t[1])}}})),Jr,Yr,Xr=t((()=>{D(),{cloneDeep:Jr}=vt,Yr=class{constructor(e,t,n,r,i){this.getParser=e,this.isClusterEnabled=t,this.getOriginData=n,this.getTransforms=r,this.getData=i,this.dataArrayChanged=!1}getById(e){let{type:t=`geojson`,geometry:n}=this.getParser();if(t===`geojson`&&!this.isClusterEnabled()){let t=this.getOriginData(),n=e<t.features.length?t.features[e]:`null`,r=Jr(n);return r?.properties&&(this.getTransforms().length!==0||this.dataArrayChanged)&&(r.properties=this.getData().dataArray.find(t=>t._id===e)),r}if(t===`json`&&n)return this.getData().dataArray.find(t=>t._id===e);{let{dataArray:t}=this.getData();return e<t.length?t[e]:`null`}}updateProperties(e,t){let n=this.getData();n.dataArray=n.dataArray.map(n=>n._id===e?{...n,...t}:n),this.dataArrayChanged=!0}getIdByField(e,t){return this.getData().dataArray.find(n=>n[e]===t)?._id}reset(){this.dataArrayChanged=!1}}})),Zr,Qr=t((()=>{D(),Zr=class{constructor(){this.isTile=!1}init(e){let{tilesetOptions:t}=e;t&&(this.isTile=!0,this.manager?this.manager.updateOptions(t):this.manager=new Te({...t}))}reloadAllTile(){this.manager?.reloadAll()}reloadTilebyId(e,t,n){this.manager?.reloadTileById(e,t,n)}reloadTileByLnglat(e,t,n){this.manager?.reloadTileByLnglat(e,t,n)}reloadTileByExtent(e,t){this.manager?.reloadTileByExtent(e,t)}getTileExtent(e,t){return this.manager?.getTileExtent(e,t)}getTileByZXY(e,t,n){return this.manager?.getTileByZXY(e,t,n)}destroy(){this.manager?.destroy()}}}));function $r(e,t){if(Array.isArray(t))return t}var ei,ti,ni,ri=t((()=>{le(),D(),ei=e(qt()),vr(),qr(),Xr(),Cr(),Qr(),{mergeWith:ti}=vt,ni=class e extends ei.EventEmitter{getSourceCfg(){return this.cfg}get ready(){return this.initPromise}static async create(t,n,r=Sr){let i=new e(t,n,r);return await i.initPromise,i}get cluster(){return this.clusterManager.enabled}set cluster(e){this.clusterManager.enabled=e}get clusterOptions(){return this.clusterManager.options}set clusterOptions(e){this.clusterManager.options=e}get tileset(){return this.tilesetAdapter.manager}get isTile(){return this.tilesetAdapter.isTile}get extent(){return this.bounds.extent}get center(){return this.bounds.center}get invalidExtent(){return this.bounds.invalidExtent}constructor(e,t,n=Sr){super(),this.type=`source`,this.inited=!1,this.dataVersion=0,this.hooks={init:new x},this.parser={type:`geojson`},this.transforms=[],this.bounds=new _r,this.registry=Sr,this.cfg={autoRender:!0},this.registry=n,this.originData=e,this.clusterManager=new Kr(()=>this.bounds.extent,()=>this.bounds.invalidExtent,n),this.tilesetAdapter=new Zr,this.featureIndex=new Yr(()=>this.parser,()=>this.cluster,()=>this.originData,()=>this.transforms,()=>this.data),this.initCfg(t),this.initPromise=this.init().then(()=>{this.inited=!0,this.emit(`update`,{type:`inited`})})}getClusters(e){return this.clusterManager.getClusters(e)}getClustersLeaves(e){return this.clusterManager.getClustersLeaves(e)}getParserType(){return this.parser.type}stats(){return{rows:this.data?.dataArray?.length??0,bbox:this.extent,parserType:this.parser.type||`geojson`,tileCount:this.tileset?.currentTiles.length??0,isTile:this.isTile,cluster:this.cluster,dataVersion:this.dataVersion}}updateClusterData(e){this.data=this.clusterManager.updateData(e),this.executeTrans()}getFeatureById(e){return this.featureIndex.getById(e)}updateFeaturePropertiesById(e,t){this.featureIndex.updateProperties(e,t),this.dataVersion++,this.emit(`update`,{type:`update`})}getFeatureId(e,t){return this.featureIndex.getIdByField(e,t)}setData(e,t){this.originData=e,this.dataVersion++,this.featureIndex.reset(),this.initCfg(t),this.init().then(()=>{this.emit(`update`,{type:`update`})}).catch(e=>{this.emit(`error`,e)})}reloadAllTile(){this.tilesetAdapter.reloadAllTile()}reloadTilebyId(e,t,n){this.tilesetAdapter.reloadTilebyId(e,t,n)}reloadTileByLnglat(e,t,n){this.tilesetAdapter.reloadTileByLnglat(e,t,n)}getTileExtent(e,t){return this.tilesetAdapter.getTileExtent(e,t)}getTileByZXY(e,t,n){return this.tilesetAdapter.getTileByZXY(e,t,n)}reloadTileByExtent(e,t){this.tilesetAdapter.reloadTileByExtent(e,t)}destroy(){this.removeAllListeners(),this.originData=null,this.clusterManager.destroy(),this.tilesetAdapter.destroy(),this.data=null}async processData(){return new Promise((e,t)=>{try{this.executeParser(),this.clusterManager.init(this.data),this.executeTrans(),e({})}catch(e){t(e)}})}initCfg(e){e&&(this.cfg=ti(this.cfg,e,$r));let t=this.cfg;t&&(t.parser&&(this.parser=t.parser),t.transforms&&(this.transforms=t.transforms),this.cluster=t.cluster||!1,t.clusterOptions&&(this.cluster=!0,this.clusterOptions={...this.clusterOptions,...t.clusterOptions}))}async init(){this.inited=!1,await this.processData(),this.inited=!0}executeParser(){let e=this.parser,t=e.type||`geojson`,n=this.registry.getParser(t);this.data=n(this.originData,e),this.tilesetAdapter.init(this.data),e.cancelExtent||this.bounds.update(Ne(this.data.dataArray))}executeTrans(){this.transforms.forEach(e=>{let{type:t}=e,n=this.registry.getTransform(t)(this.data,e);Object.assign(this.data,n)})}}}));function ii(e){let t=ai(e);if(t.length===0)return[];let n=t[0],r=[];for(let e=1;e<t.length;e++){let i=t[e];if(i.length===0)continue;let a={};for(let e=0;e<n.length;e++){let t=n[e];a[t]=e<i.length?i[e]:``}r.push(a)}return r}function ai(e){let t=[],n=[],r=``,i=!1,a=0,o=e.replace(/\r\n/g,`
`).replace(/\r/g,`
`);for(;a<o.length;){let e=o[a],s=o[a+1];if(i){if(e===`"`){if(s===`"`){r+=`"`,a+=2;continue}i=!1,a++;continue}r+=e,a++}else e===`"`?(i=!0,a++):e===`,`?(n.push(r.trim()),r=``,a++):e===`
`?(n.push(r.trim()),n.some(e=>e!==``)&&t.push(n),n=[],r=``,a++):(r+=e,a++)}return(r!==``||n.length>0)&&(n.push(r.trim()),n.some(e=>e!==``)&&t.push(n)),t}var oi=t((()=>{}));function si(e,t){let{x:n,y:r,x1:i,y1:a,coordinates:o,geometry:s}=t,c=[];if(!Array.isArray(e))return{dataArray:[]};if(s)return e.filter(e=>e[s]&&e[s].type&&e[s].coordinates&&e[s].coordinates.length>0).forEach((e,t)=>{let n=Br(e[s]);Dn(n,n=>{let r=Tn(n),i={...e,_id:t,coordinates:r};c.push(i)})}),{dataArray:c};for(let t=0;t<e.length;t++){let s=e[t],l=[];if(o){let e=`Polygon`;Array.isArray(o[0])||(e=`Point`),Array.isArray(o[0])&&!Array.isArray(o[0][0])&&(e=`LineString`),l=Br({type:e,coordinates:s[o]}).coordinates}else n&&r&&i&&a?l=[[parseFloat(s[n]),parseFloat(s[r])],[parseFloat(s[i]),parseFloat(s[a])]]:n&&r&&(l=[parseFloat(s[n]),parseFloat(s[r])]);let u={...s,_id:t,coordinates:l};c.push(u)}return{dataArray:c}}var ci=t((()=>{wn(),On(),Ur()}));function li(e,t){return si(ii(e),t)}var ui=t((()=>{oi(),ci()}));function di(e){let t=e.toString(),n=5381,r=t.length;for(;r;)n=n*33^t.charCodeAt(--r);return n>>>0}function fi(e,t){return t===void 0?null:isNaN(e.properties[t]*1)?e.properties&&e.properties[t]?di(e.properties[t]+``)%1000019:null:e.properties[t]*1}function pi(e,t){let n=[],r={};return e.features?(e.features=e.features.filter(e=>{let t=e.geometry;return e!=null&&t&&t.type&&t.coordinates&&t.coordinates.length>0}),e=Br(e),e.features.length===0?{dataArray:[],featureKeys:r}:(Dn(e,(e,r)=>{let i=fi(e,t?.featureId);i===null&&(i=r);let a=i,o=Tn(e),s={...e.properties,coordinates:o,_id:a};n.push(s)}),{dataArray:n,featureKeys:r})):(e.features=[],{dataArray:[]})}var mi=t((()=>{wn(),On(),Ur()}));function hi(e,t,n,r){for(var i=r,a=n-t>>1,o=n-t,s,c=e[t],l=e[t+1],u=e[n],d=e[n+1],f=t+3;f<n;f+=3){var p=gi(e[f],e[f+1],c,l,u,d);if(p>i)s=f,i=p;else if(p===i){var m=Math.abs(f-a);m<o&&(s=f,o=m)}}i>r&&(s-t>3&&hi(e,t,s,r),e[s+2]=i,n-s>3&&hi(e,s,n,r))}function gi(e,t,n,r,i,a){var o=i-n,s=a-r;if(o!==0||s!==0){var c=((e-n)*o+(t-r)*s)/(o*o+s*s);c>1?(n=i,r=a):c>0&&(n+=o*c,r+=s*c)}return o=e-n,s=t-r,o*o+s*s}var _i=t((()=>{}));function vi(e,t,n,r){var i={id:e===void 0?null:e,type:t,geometry:n,tags:r,minX:1/0,minY:1/0,maxX:-1/0,maxY:-1/0};return yi(i),i}function yi(e){var t=e.geometry,n=e.type;if(n===`Point`||n===`MultiPoint`||n===`LineString`)bi(e,t);else if(n===`Polygon`||n===`MultiLineString`)for(var r=0;r<t.length;r++)bi(e,t[r]);else if(n===`MultiPolygon`)for(r=0;r<t.length;r++)for(var i=0;i<t[r].length;i++)bi(e,t[r][i])}function bi(e,t){for(var n=0;n<t.length;n+=3)e.minX=Math.min(e.minX,t[n]),e.minY=Math.min(e.minY,t[n+1]),e.maxX=Math.max(e.maxX,t[n]),e.maxY=Math.max(e.maxY,t[n+1])}var xi=t((()=>{}));function Si(e,t){var n=[];if(e.type===`FeatureCollection`)for(var r=0;r<e.features.length;r++)Ci(n,e.features[r],t,r);else e.type===`Feature`?Ci(n,e,t):Ci(n,{geometry:e},t);return n}function Ci(e,t,n,r){if(t.geometry){var i=t.geometry.coordinates,a=t.geometry.type,o=(n.tolerance/((1<<n.maxZoom)*n.extent))**2,s=[],c=t.id;if(n.promoteId?c=t.properties[n.promoteId]:n.generateId&&(c=r||0),a===`Point`)wi(i,s);else if(a===`MultiPoint`)for(var l=0;l<i.length;l++)wi(i[l],s);else if(a===`LineString`)Ti(i,s,o,!1);else if(a===`MultiLineString`){if(n.lineMetrics){for(l=0;l<i.length;l++)s=[],Ti(i[l],s,o,!1),e.push(vi(c,`LineString`,s,t.properties));return}Ei(i,s,o,!1)}else if(a===`Polygon`)Ei(i,s,o,!0);else if(a===`MultiPolygon`)for(l=0;l<i.length;l++){var u=[];Ei(i[l],u,o,!0),s.push(u)}else if(a===`GeometryCollection`){for(l=0;l<t.geometry.geometries.length;l++)Ci(e,{id:c,geometry:t.geometry.geometries[l],properties:t.properties},n,r);return}else throw Error(`Input data is not a valid GeoJSON object.`);e.push(vi(c,a,s,t.properties))}}function wi(e,t){t.push(Di(e[0])),t.push(Oi(e[1])),t.push(0)}function Ti(e,t,n,r){for(var i,a,o=0,s=0;s<e.length;s++){var c=Di(e[s][0]),l=Oi(e[s][1]);t.push(c),t.push(l),t.push(0),s>0&&(o+=r?(i*l-c*a)/2:Math.sqrt((c-i)**2+(l-a)**2)),i=c,a=l}var u=t.length-3;t[2]=1,hi(t,0,u,n),t[u+2]=1,t.size=Math.abs(o),t.start=0,t.end=t.size}function Ei(e,t,n,r){for(var i=0;i<e.length;i++){var a=[];Ti(e[i],a,n,r),t.push(a)}}function Di(e){return e/360+.5}function Oi(e){var t=Math.sin(e*Math.PI/180),n=.5-.25*Math.log((1+t)/(1-t))/Math.PI;return n<0?0:n>1?1:n}var ki=t((()=>{_i(),xi()}));function Ai(e,t,n,r,i,a,o,s){if(n/=t,r/=t,a>=n&&o<r)return e;if(o<n||a>=r)return null;for(var c=[],l=0;l<e.length;l++){var u=e[l],d=u.geometry,f=u.type,p=i===0?u.minX:u.minY,m=i===0?u.maxX:u.maxY;if(p>=n&&m<r)c.push(u);else if(!(m<n||p>=r)){var h=[];if(f===`Point`||f===`MultiPoint`)ji(d,h,n,r,i);else if(f===`LineString`)Mi(d,h,n,r,i,!1,s.lineMetrics);else if(f===`MultiLineString`)Pi(d,h,n,r,i,!1);else if(f===`Polygon`)Pi(d,h,n,r,i,!0);else if(f===`MultiPolygon`)for(var g=0;g<d.length;g++){var _=[];Pi(d[g],_,n,r,i,!0),_.length&&h.push(_)}if(h.length){if(s.lineMetrics&&f===`LineString`){for(g=0;g<h.length;g++)c.push(vi(u.id,f,h[g],u.tags));continue}(f===`LineString`||f===`MultiLineString`)&&(h.length===1?(f=`LineString`,h=h[0]):f=`MultiLineString`),(f===`Point`||f===`MultiPoint`)&&(f=h.length===3?`Point`:`MultiPoint`),c.push(vi(u.id,f,h,u.tags))}}}return c.length?c:null}function ji(e,t,n,r,i){for(var a=0;a<e.length;a+=3){var o=e[a+i];o>=n&&o<=r&&(t.push(e[a]),t.push(e[a+1]),t.push(e[a+2]))}}function Mi(e,t,n,r,i,a,o){for(var s=Ni(e),c=i===0?Ii:Li,l=e.start,u,d,f=0;f<e.length-3;f+=3){var p=e[f],m=e[f+1],h=e[f+2],g=e[f+3],_=e[f+4],v=i===0?p:m,y=i===0?g:_,b=!1;o&&(u=Math.sqrt((p-g)**2+(m-_)**2)),v<n?y>n&&(d=c(s,p,m,g,_,n),o&&(s.start=l+u*d)):v>r?y<r&&(d=c(s,p,m,g,_,r),o&&(s.start=l+u*d)):Fi(s,p,m,h),y<n&&v>=n&&(d=c(s,p,m,g,_,n),b=!0),y>r&&v<=r&&(d=c(s,p,m,g,_,r),b=!0),!a&&b&&(o&&(s.end=l+u*d),t.push(s),s=Ni(e)),o&&(l+=u)}var x=e.length-3;p=e[x],m=e[x+1],h=e[x+2],v=i===0?p:m,v>=n&&v<=r&&Fi(s,p,m,h),x=s.length-3,a&&x>=3&&(s[x]!==s[0]||s[x+1]!==s[1])&&Fi(s,s[0],s[1],s[2]),s.length&&t.push(s)}function Ni(e){var t=[];return t.size=e.size,t.start=e.start,t.end=e.end,t}function Pi(e,t,n,r,i,a){for(var o=0;o<e.length;o++)Mi(e[o],t,n,r,i,a,!1)}function Fi(e,t,n,r){e.push(t),e.push(n),e.push(r)}function Ii(e,t,n,r,i,a){var o=(a-t)/(r-t);return e.push(a),e.push(n+(i-n)*o),e.push(1),o}function Li(e,t,n,r,i,a){var o=(a-n)/(i-n);return e.push(t+(r-t)*o),e.push(a),e.push(1),o}var Ri=t((()=>{xi()}));function zi(e,t){var n=t.buffer/t.extent,r=e,i=Ai(e,1,-1-n,n,0,-1,2,t),a=Ai(e,1,1-n,2+n,0,-1,2,t);return(i||a)&&(r=Ai(e,1,-n,1+n,0,-1,2,t)||[],i&&(r=Bi(i,1).concat(r)),a&&(r=r.concat(Bi(a,-1)))),r}function Bi(e,t){for(var n=[],r=0;r<e.length;r++){var i=e[r],a=i.type,o;if(a===`Point`||a===`MultiPoint`||a===`LineString`)o=Vi(i.geometry,t);else if(a===`MultiLineString`||a===`Polygon`){o=[];for(var s=0;s<i.geometry.length;s++)o.push(Vi(i.geometry[s],t))}else if(a===`MultiPolygon`)for(o=[],s=0;s<i.geometry.length;s++){for(var c=[],l=0;l<i.geometry[s].length;l++)c.push(Vi(i.geometry[s][l],t));o.push(c)}n.push(vi(i.id,a,o,i.tags))}return n}function Vi(e,t){var n=[];n.size=e.size,e.start!==void 0&&(n.start=e.start,n.end=e.end);for(var r=0;r<e.length;r+=3)n.push(e[r]+t,e[r+1],e[r+2]);return n}var Hi=t((()=>{Ri(),xi()}));function Ui(e,t){if(e.transformed)return e;for(var n=1<<e.z,r=e.x,i=e.y,a=0,o,s;a<e.features.length;a++){var c=e.features[a],l=c.geometry,u=c.type;if(c.geometry=[],u===1)for(o=0;o<l.length;o+=2)c.geometry.push(Wi(l[o],l[o+1],t,n,r,i));else for(o=0;o<l.length;o++){var d=[];for(s=0;s<l[o].length;s+=2)d.push(Wi(l[o][s],l[o][s+1],t,n,r,i));c.geometry.push(d)}}return e.transformed=!0,e}function Wi(e,t,n,r,i,a){return[Math.round(n*(e*r-i)),Math.round(n*(t*r-a))]}var Gi=t((()=>{}));function Ki(e,t,n,r,i){for(var a=t===i.maxZoom?0:i.tolerance/((1<<t)*i.extent),o={features:[],numPoints:0,numSimplified:0,numFeatures:0,source:null,x:n,y:r,z:t,transformed:!1,minX:2,minY:1,maxX:-1,maxY:0},s=0;s<e.length;s++){o.numFeatures++,qi(o,e[s],a,i);var c=e[s].minX,l=e[s].minY,u=e[s].maxX,d=e[s].maxY;c<o.minX&&(o.minX=c),l<o.minY&&(o.minY=l),u>o.maxX&&(o.maxX=u),d>o.maxY&&(o.maxY=d)}return o}function qi(e,t,n,r){var i=t.geometry,a=t.type,o=[];if(a===`Point`||a===`MultiPoint`)for(var s=0;s<i.length;s+=3)o.push(i[s]),o.push(i[s+1]),e.numPoints++,e.numSimplified++;else if(a===`LineString`)Ji(o,i,e,n,!1,!1);else if(a===`MultiLineString`||a===`Polygon`)for(s=0;s<i.length;s++)Ji(o,i[s],e,n,a===`Polygon`,s===0);else if(a===`MultiPolygon`)for(var c=0;c<i.length;c++){var l=i[c];for(s=0;s<l.length;s++)Ji(o,l[s],e,n,!0,s===0)}if(o.length){var u=t.tags||null;if(a===`LineString`&&r.lineMetrics){for(var d in u={},t.tags)u[d]=t.tags[d];u.mapbox_clip_start=i.start/i.size,u.mapbox_clip_end=i.end/i.size}var f={geometry:o,type:a===`Polygon`||a===`MultiPolygon`?3:a===`LineString`||a===`MultiLineString`?2:1,tags:u};t.id!==null&&(f.id=t.id),e.features.push(f)}}function Ji(e,t,n,r,i,a){var o=r*r;if(r>0&&t.size<(i?o:r))n.numPoints+=t.length/3;else{for(var s=[],c=0;c<t.length;c+=3)(r===0||t[c+2]>o)&&(n.numSimplified++,s.push(t[c]),s.push(t[c+1])),n.numPoints++;i&&Yi(s,a),e.push(s)}}function Yi(e,t){for(var n=0,r=0,i=e.length,a=i-2;r<i;a=r,r+=2)n+=(e[r]-e[a])*(e[r+1]+e[a+1]);if(n>0===t)for(r=0,i=e.length;r<i/2;r+=2){var o=e[r],s=e[r+1];e[r]=e[i-2-r],e[r+1]=e[i-1-r],e[i-2-r]=o,e[i-1-r]=s}}var Xi=t((()=>{}));function Zi(e,t){return new Qi(e,t)}function Qi(e,t){t=this.options=ea(Object.create(this.options),t);var n=t.debug;if(n&&console.time(`preprocess data`),t.maxZoom<0||t.maxZoom>24)throw Error(`maxZoom should be in the 0-24 range`);if(t.promoteId&&t.generateId)throw Error(`promoteId and generateId cannot be used together.`);var r=Si(e,t);this.tiles={},this.tileCoords=[],n&&(console.timeEnd(`preprocess data`),console.log(`index: maxZoom: %d, maxPoints: %d`,t.indexMaxZoom,t.indexMaxPoints),console.time(`generate tiles`),this.stats={},this.total=0),r=zi(r,t),r.length&&this.splitTile(r,0,0,0),n&&(r.length&&console.log(`features: %d, points: %d`,this.tiles[0].numFeatures,this.tiles[0].numPoints),console.timeEnd(`generate tiles`),console.log(`tiles generated:`,this.total,JSON.stringify(this.stats)))}function $i(e,t,n){return((1<<e)*n+t)*32+e}function ea(e,t){for(var n in t)e[n]=t[n];return e}var ta=t((()=>{ki(),Ri(),Hi(),Gi(),Xi(),Qi.prototype.options={maxZoom:14,indexMaxZoom:5,indexMaxPoints:1e5,tolerance:3,extent:4096,buffer:64,lineMetrics:!1,promoteId:null,generateId:!1,debug:0},Qi.prototype.splitTile=function(e,t,n,r,i,a,o){for(var s=[e,t,n,r],c=this.options,l=c.debug;s.length;){r=s.pop(),n=s.pop(),t=s.pop(),e=s.pop();var u=1<<t,d=$i(t,n,r),f=this.tiles[d];if(!f&&(l>1&&console.time(`creation`),f=this.tiles[d]=Ki(e,t,n,r,c),this.tileCoords.push({z:t,x:n,y:r}),l)){l>1&&(console.log(`tile z%d-%d-%d (features: %d, points: %d, simplified: %d)`,t,n,r,f.numFeatures,f.numPoints,f.numSimplified),console.timeEnd(`creation`));var p=`z`+t;this.stats[p]=(this.stats[p]||0)+1,this.total++}if(f.source=e,i){if(t===c.maxZoom||t===i)continue;var m=1<<i-t;if(n!==Math.floor(a/m)||r!==Math.floor(o/m))continue}else if(t===c.indexMaxZoom||f.numPoints<=c.indexMaxPoints)continue;if(f.source=null,e.length!==0){l>1&&console.time(`clipping`);var h=.5*c.buffer/c.extent,g=.5-h,_=.5+h,v=1+h,y=b=x=S=null,b,x,S,C=Ai(e,u,n-h,n+_,0,f.minX,f.maxX,c),w=Ai(e,u,n+g,n+v,0,f.minX,f.maxX,c);e=null,C&&=(y=Ai(C,u,r-h,r+_,1,f.minY,f.maxY,c),b=Ai(C,u,r+g,r+v,1,f.minY,f.maxY,c),null),w&&=(x=Ai(w,u,r-h,r+_,1,f.minY,f.maxY,c),S=Ai(w,u,r+g,r+v,1,f.minY,f.maxY,c),null),l>1&&console.timeEnd(`clipping`),s.push(y||[],t+1,n*2,r*2),s.push(b||[],t+1,n*2,r*2+1),s.push(x||[],t+1,n*2+1,r*2),s.push(S||[],t+1,n*2+1,r*2+1)}}},Qi.prototype.getTile=function(e,t,n){var r=this.options,i=r.extent,a=r.debug;if(e<0||e>24)return null;var o=1<<e;t=(t%o+o)%o;var s=$i(e,t,n);if(this.tiles[s])return Ui(this.tiles[s],i);a>1&&console.log(`drilling down to z%d-%d-%d`,e,t,n);for(var c=e,l=t,u=n,d;!d&&c>0;)c--,l=Math.floor(l/2),u=Math.floor(u/2),d=this.tiles[$i(c,l,u)];return!d||!d.source?null:(a>1&&console.log(`found parent tile z%d-%d-%d`,c,l,u),a>1&&console.time(`drilling down`),this.splitTile(d.source,c,l,u,e,t,n),a>1&&console.timeEnd(`drilling down`),this.tiles[s]?Ui(this.tiles[s],i):null)}})),na,ra=t((()=>{na=class{constructor(e,t,n,r){this.vectorLayerCache={},this.x=t,this.y=n,this.z=r,this.vectorTile=e}getTileData(e){return!e||!this.vectorTile.layers[e]?[]:this.vectorLayerCache[e]?this.vectorLayerCache[e]:this.vectorTile.layers[e].features}getFeatureById(){throw Error(`Method not implemented.`)}}}));function ia(e){let t=0;for(let n=0,r=e.length,i=r-1,a,o;n<r;i=n++)a=e[n],o=e[i],t+=(o.x-a.x)*(a.y+o.y);return t}function aa(e){let t=e.length;if(t<=1)return[e];let n=[],r,i;for(let a=0;a<t;a++){let t=ia(e[a]);t!==0&&(i===void 0&&(i=t<0),i===t<0?(r&&n.push(r),r=[e[a]]):r.push(e[a]))}return r&&n.push(r),n}function oa(e,t,n,r,i){let a=i.geometry,o=i.type,s=i.tags,c=i.id,l=e*2**r,u=e*t,d=e*n,f=sa[o],p,m;function h(e){for(let t=0;t<e.length;t++){let n=e[t];if(n[3])break;let r=180-(n[1]+d)*360/l,i=(n[0]+u)*360/l-180,a=360/Math.PI*Math.atan(Math.exp(r*Math.PI/180))-90;e[t]=[i,a,0,1]}}switch(o){case 1:let e=[];for(p=0;p<a.length;p++)e[p]=a[p][0];a=e,h(a);break;case 2:for(p=0;p<a.length;p++)h(a[p]);break;case 3:for(a=aa(a),p=0;p<a.length;p++)for(m=0;m<a[p].length;m++)h(a[p][m])}return a.length===1?a=a[0]:f=`Multi`+f,{type:`Feature`,geometry:{type:f,coordinates:a},properties:s,id:c,relativeOrigin:[0,0],coord:``}}var sa,ca,la=t((()=>{ta(),ra(),sa=[`Unknown`,`Point`,`LineString`,`Polygon`],ca=class{constructor(e,t){this.tileIndex=Zi(e,t),this.extent=t.extent||4096}loadTile(e,t){return new Promise(n=>{let r=this.tileIndex.getTile(t.z,t.x,t.y),i={layers:{defaultLayer:{features:r?r.features.map(t=>oa(this.extent,e.x,e.y,e.z,t)):[]}}};n(new na(i,t.x,t.y,t.z))})}}}));function ua(e){let t={maxZoom:14,indexMaxZoom:5,indexMaxPoints:1e5,tolerance:3,extent:4096,buffer:64,lineMetrics:!1,promoteId:null,generateId:!0,debug:0};return e===void 0||e.geojsonvtOptions===void 0?t:{...t,...e.geojsonvtOptions}}function da(e,t){let n=ua(t),r=new ca(e,n),i=(e,t)=>r.loadTile(e,t);return{data:e,dataArray:[],tilesetOptions:{...fa,...t,getTileData:i},isTile:!0}}var fa,pa=t((()=>{la(),fa={tileSize:256,minZoom:0,maxZoom:1/0,zoomOffset:0}})),ma,ha=t((()=>{D(),ma=class{constructor(e,t){this.data=e,this.requestParameters=t}load(){return new Promise(e=>{this.data instanceof HTMLImageElement||T(this.data)?e([this.data]):this.fetchUrls(this.data,this.requestParameters,e)})}fetchUrls(e,t,n){let r=[];if(typeof e==`string`)Ue({...t,url:e},(e,t)=>{t&&(r.push(t),n(r))});else{let i=e.length,a=0;e.forEach(e=>{Ue({...t,url:e},(e,t)=>{a++,t&&r.push(t),a===i&&n(r)})})}}}}));function ga(e,t){let{extent:n=[121.168,30.2828,121.384,30.4219],coordinates:r,requestParameters:i={}}=t;return{originData:e,images:new ma(e,i).load(),_id:1,dataArray:[{_id:0,coordinates:Vr(r,n)}]}}var _a=t((()=>{ha(),Ur()})),va,ya=t((()=>{D(),ra(),va=class{constructor(e,t,n){this.url=e,this.requestParameters=t,this.getCustomData=n}loadTile(e,t){let n={x:t.x,y:t.y,z:t.z},r=l(this.url,n);return new Promise(e=>{this.getCustomData?this.getCustomData(n,(n,r)=>{if(n||!r)e(new na({layers:{defaultLayer:{features:[]}}},t.x,t.y,t.z));else{let n={layers:{defaultLayer:{features:r.features}}};e(new na(n,t.x,t.y,t.z))}}):d({...this.requestParameters,url:r},(n,r)=>{if(n||!r)e(new na({layers:{defaultLayer:{features:[]}}},t.x,t.y,t.z));else{let n={layers:{defaultLayer:{features:JSON.parse(r)}}};e(new na(n,t.x,t.y,t.z))}})})}}}));function ba(e,t){let n=new va(e,t?.requestParameters,t.getCustomData),r=(e,t)=>n.loadTile(e,t);return{dataArray:[],tilesetOptions:{...t,getTileData:r},isTile:!0}}var xa=t((()=>{ya()})),Sa=r(((e,t)=>{var n=pe();t.exports=r;function r(e,t,n,r,a){this.properties={},this.extent=n,this.type=0,this._pbf=e,this._geometry=-1,this._keys=r,this._values=a,e.readFields(i,this,t)}function i(e,t,n){e==1?t.id=n.readVarint():e==2?a(n,t):e==3?t.type=n.readVarint():e==4&&(t._geometry=n.pos)}function a(e,t){for(var n=e.readVarint()+e.pos;e.pos<n;){var r=t._keys[e.readVarint()],i=t._values[e.readVarint()];t.properties[r]=i}}r.types=[`Unknown`,`Point`,`LineString`,`Polygon`],r.prototype.loadGeometry=function(){var e=this._pbf;e.pos=this._geometry;for(var t=e.readVarint()+e.pos,r=1,i=0,a=0,o=0,s=[],c;e.pos<t;){if(i<=0){var l=e.readVarint();r=l&7,i=l>>3}if(i--,r===1||r===2)a+=e.readSVarint(),o+=e.readSVarint(),r===1&&(c&&s.push(c),c=[]),c.push(new n(a,o));else if(r===7)c&&c.push(c[0].clone());else throw Error(`unknown command `+r)}return c&&s.push(c),s},r.prototype.bbox=function(){var e=this._pbf;e.pos=this._geometry;for(var t=e.readVarint()+e.pos,n=1,r=0,i=0,a=0,o=1/0,s=-1/0,c=1/0,l=-1/0;e.pos<t;){if(r<=0){var u=e.readVarint();n=u&7,r=u>>3}if(r--,n===1||n===2)i+=e.readSVarint(),a+=e.readSVarint(),i<o&&(o=i),i>s&&(s=i),a<c&&(c=a),a>l&&(l=a);else if(n!==7)throw Error(`unknown command `+n)}return[o,c,s,l]},r.prototype.toGeoJSON=function(e,t,n){var i=this.extent*2**n,a=this.extent*e,s=this.extent*t,c=this.loadGeometry(),l=r.types[this.type],u,d;function f(e){for(var t=0;t<e.length;t++){var n=e[t],r=180-(n.y+s)*360/i;e[t]=[(n.x+a)*360/i-180,360/Math.PI*Math.atan(Math.exp(r*Math.PI/180))-90]}}switch(this.type){case 1:var p=[];for(u=0;u<c.length;u++)p[u]=c[u][0];c=p,f(c);break;case 2:for(u=0;u<c.length;u++)f(c[u]);break;case 3:for(c=o(c),u=0;u<c.length;u++)for(d=0;d<c[u].length;d++)f(c[u][d])}c.length===1?c=c[0]:l=`Multi`+l;var m={type:`Feature`,geometry:{type:l,coordinates:c},properties:this.properties};return`id`in this&&(m.id=this.id),m};function o(e){var t=e.length;if(t<=1)return[e];for(var n=[],r,i,a=0;a<t;a++){var o=s(e[a]);o!==0&&(i===void 0&&(i=o<0),i===o<0?(r&&n.push(r),r=[e[a]]):r.push(e[a]))}return r&&n.push(r),n}function s(e){for(var t=0,n=0,r=e.length,i=r-1,a,o;n<r;i=n++)a=e[n],o=e[i],t+=(o.x-a.x)*(a.y+o.y);return t}})),Ca=r(((e,t)=>{var n=Sa();t.exports=r;function r(e,t){this.version=1,this.name=null,this.extent=4096,this.length=0,this._pbf=e,this._keys=[],this._values=[],this._features=[],e.readFields(i,this,t),this.length=this._features.length}function i(e,t,n){e===15?t.version=n.readVarint():e===1?t.name=n.readString():e===5?t.extent=n.readVarint():e===2?t._features.push(n.pos):e===3?t._keys.push(n.readString()):e===4&&t._values.push(a(n))}function a(e){for(var t=null,n=e.readVarint()+e.pos;e.pos<n;){var r=e.readVarint()>>3;t=r===1?e.readString():r===2?e.readFloat():r===3?e.readDouble():r===4?e.readVarint64():r===5?e.readVarint():r===6?e.readSVarint():r===7?e.readBoolean():null}return t}r.prototype.feature=function(e){if(e<0||e>=this._features.length)throw Error(`feature index out of bounds`);this._pbf.pos=this._features[e];var t=this._pbf.readVarint()+this._pbf.pos;return new n(this._pbf,t,this.extent,this._keys,this._values)}})),wa=r(((e,t)=>{var n=Ca();t.exports=r;function r(e,t){this.layers=e.readFields(i,{},t)}function i(e,t,r){if(e===3){var i=new n(r,r.readVarint()+r.pos);i.length&&(t[i.name]=i)}}})),Ta=r(((e,t)=>{t.exports.VectorTile=wa(),t.exports.VectorTileFeature=Sa(),t.exports.VectorTileLayer=Ca()})),Ea,Da,Oa,ka=t((()=>{Ea=Ta(),Da=e(Mn()),Oa=class{constructor(e,t,n,r){this.vectorLayerCache={},this.x=t,this.y=n,this.z=r,this.vectorTile=new Ea.VectorTile(new Da.default(e))}getTileData(e){if(!e||!this.vectorTile.layers[e])return[];if(this.vectorLayerCache[e])return this.vectorLayerCache[e];let t=this.vectorTile.layers[e];if(Array.isArray(t.features))return this.vectorLayerCache[e]=t.features,t.features;let n=[];for(let e=0;e<t.length;e++){let r=t.feature(e).toGeoJSON(this.x,this.y,this.z);n.push({...r,properties:{id:r.id,...r.properties}})}return this.vectorLayerCache[e]=n,n}getFeatureById(){throw Error(`Method not implemented.`)}}})),Aa,ja=t((()=>{Aa=class{constructor(e){this.getCustomDataFunc=e}fetch(e){return new Promise((t,n)=>{this.getCustomDataFunc({x:e.x,y:e.y,z:e.z},(e,r)=>{e?n(e):t(r)})})}}})),Ma,Na=t((()=>{D(),ka(),ja(),Ma=class{constructor(e,t,n){this.url=e,this.requestParameters=t,n&&(this.customDataProvider=new Aa(n))}loadTile(e,t){let n=l(this.url,e);return new Promise(e=>{if(this.customDataProvider)this.customDataProvider.fetch(t).then(n=>{e(n?new Oa(n,t.x,t.y,t.z):void 0)}).catch(()=>{e(void 0)});else{let r=Sn({...this.requestParameters,url:n},(n,r)=>{e(n||!r?void 0:new Oa(r,t.x,t.y,t.z))});t.xhrCancel=()=>r.cancel()}})}}}));function Pa(e,t){let n=Array.isArray(e)?e[0]:e,r=new Ma(n,t?.requestParameters,t?.getCustomData),i=(e,t)=>r.loadTile(e,t);return{data:n,dataArray:[],tilesetOptions:{...Fa,...t,getTileData:i},isTile:!0}}var Fa,Ia=t((()=>{Na(),Fa={tileSize:256,minZoom:0,maxZoom:1/0,zoomOffset:0,warp:!0}}));function La(e,t){let{extent:n=[121.168,30.2828,121.384,30.4219],coordinates:r,width:i,height:a,...o}=t;if(e.length<2)return console.warn(`RGB解析需要2个波段的数据`),{_id:1,dataArray:[]};let[s,c]=o.bands||[0,1],l=[e[s],e[c]],u=[];for(let e=0;e<l[0].length;e++)u.push((l[1][e]-l[0][e])/(l[1][e]+l[0][e]));let d=Vr(r,n);return{_id:1,dataArray:[{_id:1,data:u,width:i,height:a,...o,coordinates:d}]}}var Ra=t((()=>{Ur()}));function za(e,t,n){switch(e){case`+`:return t+n;case`-`:return t-n;case`*`:return t*n;case`/`:return t/n;case`%`:return t%n;case`^`:return t**+n;case`abs`:return Math.abs(t);case`floor`:return Math.floor(t);case`round`:return Math.round(t);case`ceil`:return Math.ceil(t);case`sin`:return Math.sin(t);case`cos`:return Math.cos(t);case`atan`:return n===-1?Math.atan(t):Math.atan2(t,n);case`min`:return Math.min(t,n);case`max`:return Math.max(t,n);case`log10`:return Math.log(t);case`log2`:return Math.log2(t);default:return console.warn(`Calculate symbol err! Return default 0`),0}}function Ba(e){if(typeof e==`number`)return()=>e;if(!Array.isArray(e))return()=>0;if(e.length===2&&e[0]===`band`&&typeof e[1]==`number`){let t=e[1];return(e,n)=>{try{return e[t]?.[n]??0}catch{return 0}}}let t=e[0];if([`abs`,`floor`,`round`,`ceil`,`sin`,`cos`,`log10`,`log2`].includes(t)){let n=Ba(e[1]),r={abs:Math.abs,floor:Math.floor,round:Math.round,ceil:Math.ceil,sin:Math.sin,cos:Math.cos,log10:Math.log,log2:Math.log2}[t]||(e=>e);return(e,t)=>r(n(e,t))}if(t===`atan`){let t=Ba(e[1]),n=e[2]!==void 0&&e[2]!==-1?Ba(e[2]):null;return(e,r)=>{let i=t(e,r);return n?Math.atan2(i,n(e,r)):Math.atan(i)}}let n=Ba(e[1]),r=Ba(e[2]);return(e,i)=>{let a=n(e,i),o=r(e,i);return za(t,a,o)}}function Va(e,t){let{width:n,height:r}=t[0],i=t.map(e=>e.rasterData),a=n*r,o=Ba(e),s=new Float32Array(a);for(let e=0;e<a;e++)s[e]=o(i,e);return s}var Ha=t((()=>{}));function Ua(e,t){let n=e[0].rasterData,r=e[1].rasterData,i=e[2].rasterData,a=n.length,o=new Uint8Array(a*3),[s,c]=t?.countCut||[2,98],l=t?.RMinMax||Ka(n,s,c),u=t?.GMinMax||Ka(r,s,c),d=t?.BMinMax||Ka(i,s,c);for(let e=0;e<a;e++){let t=e*3;o[t]=Math.max(0,n[e]-l[0]),o[t+1]=Math.max(0,r[e]-u[0]),o[t+2]=Math.max(0,i[e]-d[0])}return{rasterData:o,rMinMax:l,gMinMax:u,bMinMax:d}}function Wa(e,t,n=0,r=e.length-1){if(n===r)return e[n];let i=Ga(e,n,r);return t===i?e[t]:t<i?Wa(e,t,n,i-1):Wa(e,t,i+1,r)}function Ga(e,t,n){let r=e[n],i=t;for(let a=t;a<n;a++)e[a]<=r&&([e[i],e[a]]=[e[a],e[i]],i++);return[e[i],e[n]]=[e[n],e[i]],i}function Ka(e,t,n){let r=e.length,i=Math.ceil(r*t/100),a=Math.ceil(r*n/100),o=Array.from(e);return[Wa(o,i),Wa(o,a)]}var qa,Ja=t((()=>{qa={nd:{type:`operation`,expression:[`/`,[`-`,[`band`,1],[`band`,0]],[`+`,[`band`,1],[`band`,0]]]},rgb:{type:`function`,method:Ua}}}));async function Ya(e,t,n){if(e.length===0)return{rasterData:[0],width:1,heigh:1};let r=await Promise.all(e.map(({data:e,bands:n=[0]})=>t(e,n))),i=[];r.forEach(e=>{Array.isArray(e)?i.push(...e):i.push(e)});let{width:a,height:o}=i[0],s;switch(typeof n){case`function`:s=n(i);break;case`object`:s=Array.isArray(n)?{rasterData:Va(n,i)}:Xa(n,i);break;default:s={rasterData:i[0].rasterData}}return{...s,width:a,height:o}}function Xa(e,t){let n=qa[e.type];if(n.type===`function`)return n.method(t,e?.options);if(n.type===`operation`)return e.type===`rgb`?Za(n.expression,t):{rasterData:Va(n.expression,t)}}function Za(e,t){return e.r===void 0&&console.warn(`Channel R lost in Operation! Use band[0] to fill!`),e.g===void 0&&console.warn(`Channel G lost in Operation! Use band[0] to fill!`),e.b===void 0&&console.warn(`Channel B lost in Operation! Use band[0] to fill!`),[Va(e.r||[`band`,0],t),Va(e.g||[`band`,0],t),Va(e.b||[`band`,0],t)]}async function Qa(e,t,n,r){r(null,{data:await Ya(e,t,n)})}var $a=t((()=>{Ha(),Ja()}));function eo(e,t){let{extent:n=[121.168,30.2828,121.384,30.4219],coordinates:r,width:i,height:a,min:o,max:s,format:c,operation:l}=t,u,d,f;c===void 0||zr(e)?(u=Array.from(e),d=i,f=a):u=Ya(Array.isArray(e)?e:[e],c,l);let p=Vr(r,n);return{_id:1,dataArray:[{_id:1,data:u,width:d,height:f,min:o,max:s,coordinates:p}]}}var to=t((()=>{$a(),Ur()}));function no(e,t){return Array.isArray(e)?typeof e[0]==`string`?e.map(e=>l(e,t)):e.map(e=>({url:l(e.url,t),bands:e.bands||[0]})):l(e,t)}function ro(e){return typeof e==`string`?[{url:e,bands:[0]}]:typeof e[0]==`string`?e.map(e=>({url:e,bands:[0]})):e}function io(e,t){e.xhrCancel=()=>{t.map(e=>{e.abort()})}}var ao=t((()=>{D()}));async function oo(e,t){let n=e.map(async e=>{let n={...t,url:e.url},{err:r,data:i,xhr:a}=await C({...n,type:`arrayBuffer`});return{err:r,data:i,xhr:a,bands:e.bands}}),r=await Promise.all(n),i=[],a=[],o=[];for(let e of r)e.err&&(Array.isArray(e.err)?o.push(...e.err):o.push(e.err)),a.push(e.xhr),i.push({data:e.data,bands:e.bands});return{rasterFiles:i,xhrList:a,errList:o}}var so,co=t((()=>{D(),$a(),ao(),so=async(e,t,n,r,i)=>{let a=ro(t.url);if(a.length>1){let{rasterFiles:o,xhrList:s,errList:c}=await oo(a,t);if(io(e,s),c.length>0){n(c,null);return}Qa(o,r,i,n)}else io(e,[Sn(t,(e,t)=>{e?n(e):t&&Qa([{data:t,bands:a[0].bands}],r,i,n)})])}})),lo,uo,fo,po=t((()=>{D(),co(),ao(),lo=async(e,t,n,r)=>{let{format:i=fo,operation:a,requestParameters:o={}}=r,s={...o,url:no(e,t)};return new Promise((e,t)=>{so(n,s,(n,r)=>{n?t(n):r&&e(r)},i,a)})},uo=async(e,t,n,r)=>{let i,a=Array.isArray(e)?e[0]:e;return i=r.wmtsOptions?(r?.getURLFromTemplate||Dt)(a,{...t,...r.wmtsOptions}):(r?.getURLFromTemplate||l)(a,t),new Promise((e,t)=>{let a=Ue({...r?.requestParameters,url:i,type:r?.requestParameters?.type||`arrayBuffer`},(n,r)=>{n?t(n):r&&e(r)},r.transformResponse);n.xhrCancel=()=>a.cancel()})},fo=()=>({rasterData:new Uint8Array([0]),width:1,height:1})})),mo,ho=t((()=>{po(),mo=class{constructor(e,t){this.data=e,this.cfg=t}loadTile(e,t){return lo(this.data,e,t,this.cfg)}}})),go,_o=t((()=>{D(),go=class{constructor(e){this.provider=e}loadTile(e,t){return this.provider.fetch(t).then(e=>new Promise((t,n)=>{e?e instanceof ArrayBuffer?Ae(e,(e,r)=>{e&&n(e),t(r)}):e instanceof HTMLImageElement?t(e):n(void 0):n(void 0)}))}}})),vo,yo=t((()=>{$a(),vo=class{constructor(e,t,n){this.provider=e,this.rasterFormat=t,this.operation=n}loadTile(e,t){return this.provider.fetch(t).then(e=>new Promise((t,n)=>{e.length===0?n(void 0):e&&Qa([{data:e,bands:[0]}],this.rasterFormat,this.operation,(e,r)=>{e?n(e):r&&t(r)})}))}}})),bo,xo=t((()=>{po(),bo=class{constructor(e,t){this.data=e,this.cfg=t}loadTile(e,t){return uo(this.data,e,t,this.cfg)}}})),So,Co=t((()=>{E(),po(),ja(),ho(),_o(),yo(),xo(),So=class{constructor(e,t,n){this.data=e,this.tileDataType=t,this.cfg=n;let r=new Aa(this.cfg.getCustomData),i=new bo(this.data,this.cfg),a=new mo(this.data,this.cfg),o=new go(r),s=new vo(r,this.cfg?.format||fo,this.cfg?.operation),c=new Map([[Se.IMAGE,i],[Se.ARRAYBUFFER,a],[Se.CUSTOMIMAGE,o],[Se.CUSTOMTERRAINRGB,o],[Se.CUSTOMARRAYBUFFER,s],[Se.CUSTOMRGB,s]]);this.loader=c.get(this.tileDataType)??i}loadTile(e,t){return this.loader.loadTile(e,t)}}}));function wo(e){return!!(Array.isArray(e)&&e.length===0||!Array.isArray(e)&&typeof e!=`string`)}function To(e,t={}){if(wo(e))throw Error(`tile server url is error`);let{extent:n=[1/0,1/0,-1/0,-1/0],coordinates:r}=t,i=t?.dataType||Se.IMAGE;i===Se.RGB&&(i=Se.ARRAYBUFFER);let a=new So(e,i,t),o=(e,t)=>a.loadTile(e,t),s={...Eo,...t,getTileData:o};return{data:e,dataArray:[{_id:1,coordinates:Vr(r,n)}],tilesetOptions:s,isTile:!0}}var Eo,Do=t((()=>{E(),Co(),Ur(),Eo={tileSize:256,minZoom:0,maxZoom:1/0,zoomOffset:0,warp:!0},Se.ARRAYBUFFER,Se.RGB}));function Oo(e,t){let{extent:n,coordinates:r,min:i,max:a,width:o,height:s,format:c,operation:l,...u}=t,d;d=c===void 0||zr(e)?Array.from(e):Ya(Array.isArray(e)?e:[e],c,l);let f=Vr(r,n);return{_id:1,dataArray:[{_id:1,data:d,width:o,height:s,...u,min:i,max:a,coordinates:f}]}}var ko=t((()=>{$a(),Ur()}));function Ao(e,t){let{extent:n=[121.168,30.2828,121.384,30.4219],coordinates:r,width:i,height:a,...o}=t;if(e.length<3)return console.warn(`RGB解析需要三个波段的数据`),{_id:1,dataArray:[]};let[s,c,l]=o.bands||[0,1,2],u=[e[s],e[c],e[l]],d=[],[f,p]=o?.countCut||[2,98],m=o?.RMinMax||Ka(u[0],f,p),h=o?.GMinMax||Ka(u[1],f,p),g=o?.BMinMax||Ka(u[2],f,p);for(let e=0;e<u[0].length;e++)d.push(Math.max(0,u[0][e]-m[0])),d.push(Math.max(0,u[1][e]-h[0])),d.push(Math.max(0,u[2][e]-g[0]));let _=Vr(r,n);return{_id:1,dataArray:[{_id:1,data:d,width:i,height:a,rMinMax:m,gMinMax:h,bMinMax:g,...o,coordinates:_}]}}var jo=t((()=>{Ja(),Ur()}));function Mo(e,t){let n=e=>Po(e);return{data:e,dataArray:[],tilesetOptions:{...No,...t,getTileData:n},isTile:!0}}var No,Po,Fo=t((()=>{No={tileSize:256,minZoom:0,maxZoom:1/0,zoomOffset:0},Po=async e=>new Promise(t=>{let[n,r,i,a]=e.bounds;t({layers:{testTile:{features:[{type:`Feature`,properties:{key:e.x+`/`+e.y+`/`+e.z,x:(n+i)/2,y:(r+a)/2},geometry:{type:`LineString`,coordinates:[[i,a],[i,r],[n,r],[n,r]]}}]}}})})}));function Io(e,t){let{callback:n}=t;return n?{...e,dataArray:e.dataArray.filter(n)}:e}var Lo=t((()=>{}));function Ro(e,t){let n=t,r=e.dataArray,{size:i=10,method:a=`sum`}=n,o=i/(2*Math.PI*zo)*(256<<20)/2,s=r.map(e=>{let[t,n]=Vt(e.coordinates);return{...e,screenCoords:[t,n]}}),c={};for(let e of s){let[t,n]=e.screenCoords;if(!Number.isFinite(t)||!Number.isFinite(n))continue;let r=`${Math.floor(t/o)}-${Math.floor(n/o)}`;c[r]||(c[r]={count:0,points:[]}),c[r].count+=1,c[r].points.push(e)}let l=Object.entries(c).map(([e,t],r)=>{let[i,s]=e.split(`-`).map(Number),c={};if(n.field&&a){let e=ce(t.points,n.field);c[a]=Qe[a](e)}let l=(i+.5)*o,u=(s+.5)*o;return{...c,[n.method||`sum`]:c[a],count:t.count,rawData:t.points,coordinates:[l,u],_id:r}});return{yOffset:o/Bo,xOffset:o/Bo,radius:o,type:`grid`,dataArray:l}}var zo,Bo,Vo=t((()=>{D(),zo=6378e3,Bo=Math.sqrt(2)}));function Ho(){let e=1,t=e*2*Math.sin(Uo),n=e*1.5,r=e=>e[0],i=e=>e[1],a=e=>{let a=new Map;for(let o=0;o<e.length;o++){let s=e[o],c=r(s,o,e),l=i(s,o,e);if(isNaN(c)||isNaN(l))continue;let u=Math.round(l/=n),d=Math.round(c=c/t-(u&1)/2),f=l-u;if(Math.abs(f)*3>1){let e=c-d,r=d+(c<d?-1:1)/2,i=u+(l<u?-1:1),o=c-r,p=l-i;if(e*e+f*f>o*o+p*p){let e=r+(u&1?1:-1)/2,o=i,c=`${e}-${o}`,l=a.get(c);l?l.push(s):(l=Object.assign([s],{x:(e+(o&1)/2)*t,y:o*n}),a.set(c,l));continue}}let p=`${d}-${u}`,m=a.get(p);m?m.push(s):(m=Object.assign([s],{x:(d+(u&1)/2)*t,y:u*n}),a.set(p,m))}return Array.from(a.values())};return a.radius=r=>(e=r,t=e*2*Math.sin(Uo),n=e*1.5,a),a.x=e=>(r=e,a),a.y=e=>(i=e,a),a}var Uo,Wo=t((()=>{Uo=Math.PI/3}));function Go(e,t){let n=t,r=e.dataArray,{size:i=10,method:a=`sum`}=n,o=i/(2*Math.PI*Ko)*(256<<20)/2,s=r.map(e=>{let[t,n]=Vt(e.coordinates);return{...e,coordinates:[t,n]}});return{dataArray:Ho().radius(o).x(e=>e.coordinates[0]).y(e=>e.coordinates[1])(s).map((e,t)=>{if(n.field&&a){let t=ce(e,n.field);e[a]=Qe[a](t)}return{[n.method||`sum`]:e[a],count:e.length,rawData:e,coordinates:[e.x,e.y],_id:t}}),radius:o,xOffset:o,yOffset:o,type:`hexagon`}}var Ko,qo=t((()=>{D(),Wo(),Ko=6378e3}));function Jo(e,t){let{sourceField:n,targetField:r,data:i}=t,a={};return i.forEach(e=>{a[e[n]]=e}),{...e,dataArray:e.dataArray.map(e=>{let t=e[r];return{...e,...a[t]}})}}var Yo=t((()=>{}));function Xo(e,t){let{callback:n}=t;return n?{...e,dataArray:e.dataArray.map(n)}:e}var Zo=t((()=>{}));function Qo(e=Sr){e.registerParser(`rasterTile`,To),e.registerParser(`mvt`,Pa),e.registerParser(`geojsonvt`,da),e.registerParser(`testTile`,Mo),e.registerParser(`geojson`,pi),e.registerParser(`jsonTile`,ba),e.registerParser(`image`,ga),e.registerParser(`csv`,li),e.registerParser(`json`,si),e.registerParser(`raster`,eo),e.registerParser(`rasterRgb`,Oo),e.registerParser(`rgb`,Ao),e.registerParser(`ndi`,La),e.registerTransform(`cluster`,Er),e.registerTransform(`filter`,Io),e.registerTransform(`join`,Jo),e.registerTransform(`map`,Xo),e.registerTransform(`grid`,Ro),e.registerTransform(`hexagon`,Go)}var $o=t((()=>{Cr(),ui(),mi(),pa(),_a(),ci(),xa(),Ia(),Ra(),to(),Do(),ko(),jo(),Fo(),Ar(),Lo(),Vo(),qo(),Yo(),Zo()})),es=t((()=>{})),ts=t((()=>{es(),ra(),ka()})),ns,rs=t((()=>{ri(),$o(),Do(),D(),Cr(),es(),ts(),Qo(),ns=ni})),is,as=t((()=>{E(),rs(),is=class{constructor(){this.name=`data-source`}apply(e){this.mapService=e.getContainer().mapService,e.hooks.init.tapPromise(`DataSourcePlugin`,async()=>{e.log(ct.SourceInitStart,It.INIT);let t=e.getSource();if(!t){let{data:n,options:r}=e.sourceOption||e.defaultSourceConfig;t=new ns(n,r),e.setSource(t)}t.inited?(this.updateClusterData(e),e.log(ct.SourceInitEnd,It.INIT)):(await t.ready,this.updateClusterData(e),e.log(ct.SourceInitEnd,It.INIT))}),e.hooks.beforeRenderData.tapPromise(`DataSourcePlugin`,async()=>{let t=this.updateClusterData(e),n=e.dataState.dataSourceNeedUpdate;return e.dataState.dataSourceNeedUpdate=!1,t||n})}updateClusterData(e){if(e.isTileLayer||e.tileLayer||!e.getSource())return!1;let t=e.getSource(),n=t.cluster,{zoom:r=0}=t.clusterOptions,i=this.mapService.getZoom()-1,a=e.dataState.dataSourceNeedUpdate;return n&&a&&t.updateClusterData(Math.floor(i)),n&&Math.abs(e.clusterZoom-i)>=1?(r!==Math.floor(i)&&t.updateClusterData(Math.floor(i)),e.clusterZoom=i,!0):!1}}}));function os(e){let t,n=[];function r(e){return e??t}return r.invert=r,r.domain=r.range=e=>e?(n=e,e):n,r.unknown=e=>e?(t=e,e):t,r.copy=()=>os(e).unknown(t),r}var ss=t((()=>{}));function cs(e,t,n=0,r=e.length){for(;n<r;){let i=n+r>>>1;e[i]<t?n=i+1:r=i}return n}function ls(e,t,n){if(e===t)return 0;let r=t-e,i=10**Math.floor(Math.log(r/n)/Math.LN10),a=n/r*i;return a<=.15?i*10:a<=.35?i*5:a<=.75?i*2:i}function us(e,t,n){if(e===t)return 1;let r=t-e,i=Math.abs(r)/Math.max(1,n),a=10**Math.floor(Math.log(i)/Math.LN10),o=i/a;return o>=10?a*=10:o>=5?a*=5:o>=2&&(a*=2),r<0?-a:a}function ds(e){let t=e.filter(e=>e!=null&&!Number.isNaN(e)&&typeof e==`number`);return t.length===0?[0,1]:t.length===1?[t[0],t[0]]:t}function fs(){let e=[0,1],t=[0,1],n=!1;function r(r){let i=e[0],a=e[e.length-1],o=t[0],s=t[t.length-1];if(i===a)return(o+s)/2;let c=(r-i)/(a-i);return n&&(c=Math.max(0,Math.min(1,c))),o+c*(s-o)}return r.domain=function(t){return t===void 0?e.slice():(e=ds(t),r)},r.range=function(e){return e===void 0?t.slice():(t=e.slice(),r)},r.invert=function(n){let r=e[0],i=e[e.length-1],a=t[0],o=t[t.length-1];return r+(n-a)/(o-a)*(i-r)},r.ticks=function(t=10){let n=e[0],r=e[e.length-1];if(n===r)return[n];let i=us(n,r,t),a=[],o=Math.floor(n/i),s=Math.ceil(r/i);for(;o<=s;)a.push(o*i),o++;return a},r.nice=function(t=10){let n=e[0],i=e[e.length-1];if(n===i)return r;let a=ls(n,i,t);return a>0&&(e=[Math.floor(n/a)*a,Math.ceil(i/a)*a]),r},r.clamp=function(e){return e===void 0?n:(n=e,r)},r}function ps(){let e=[0,1],t=[0,1],n=!1,r=1;function i(i){let a=e[0],o=e[e.length-1],s=t[0],c=t[t.length-1];if(a===o)return(s+c)/2;let l=(i-a)/(o-a);return n&&(l=Math.max(0,Math.min(1,l))),l**=+r,s+l*(c-s)}return i.domain=function(t){return t===void 0?e.slice():(e=ds(t),i)},i.range=function(e){return e===void 0?t.slice():(t=e.slice(),i)},i.invert=function(n){let i=e[0],a=e[e.length-1],o=t[0],s=t[t.length-1],c=(n-o)/(s-o);return c**=1/r,i+c*(a-i)},i.ticks=function(t=10){let n=e[0],r=e[e.length-1];if(n===r)return[n];let i=us(n,r,t),a=[],o=Math.floor(n/i),s=Math.ceil(r/i);for(;o<=s;)a.push(o*i),o++;return a},i.nice=function(t=10){let n=e[0],r=e[e.length-1];if(n===r)return i;let a=ls(n,r,t);return a>0&&(e=[Math.floor(n/a)*a,Math.ceil(r/a)*a]),i},i.clamp=function(e){return e===void 0?n:(n=e,i)},i.exponent=function(e){return e===void 0?r:(r=e,i)},i}function ms(e,t){return Math.log(e)/Math.log(t)}function hs(e,t){return t**+e}function gs(){let e=[1,10],t=[0,1],n=!1,r=10;function i(i){let a=e[0],o=e[e.length-1],s=t[0],c=t[t.length-1];if(a===o)return(s+c)/2;let l=Math.abs(a)||1,u=Math.abs(o)||1,d=(ms(Math.abs(i)||1,r)-ms(l,r))/(ms(u,r)-ms(l,r));return n&&(d=Math.max(0,Math.min(1,d))),s+d*(c-s)}return i.domain=function(t){return t===void 0?e.slice():(e=ds(t).map(e=>e<=0?1:e),i)},i.range=function(e){return e===void 0?t.slice():(t=e.slice(),i)},i.invert=function(n){let i=e[0],a=e[e.length-1],o=t[0],s=t[t.length-1],c=(n-o)/(s-o),l=Math.abs(i)||1,u=Math.abs(a)||1;return hs(ms(l,r)+c*(ms(u,r)-ms(l,r)),r)},i.ticks=function(t=10){let n=e[0],i=e[e.length-1];if(n===i)return[n];let a=[],o=Math.floor(ms(Math.abs(n)||1,r)),s=Math.ceil(ms(Math.abs(i)||1,r));for(let e=o;e<=s;e++)a.push(hs(e,r));return a},i.nice=function(){return i},i.clamp=function(e){return e===void 0?n:(n=e,i)},i.base=function(e){return e===void 0?r:(r=e,i)},i}function _s(e){let t=[],n=e||[],r,i=new Map;function a(e){let a=i.get(e);if(a===void 0){if(r!==void 0)return r;if(n.length===0)return;a=t.push(e)-1,i.set(e,a)}return n[a%n.length]}return a.domain=function(e){return e===void 0?t.slice():(t=[],i.clear(),e.forEach(e=>{i.has(e)||(i.set(e,t.length),t.push(e))}),a)},a.range=function(e){return e===void 0?n.slice():(n=e.slice(),a)},a.unknown=function(e){return r=e,a},a}function vs(){let e=[0,1],t=[0,1],n=1;function r(r){let i=e[0],a=e[e.length-1];if(i===a)return t[Math.floor(t.length/2)];let o=(r-i)/(a-i),s=Math.max(0,Math.min(n-1,Math.floor(o*n)));return t[s]}return r.domain=function(t){return t===void 0?e.slice():(e=ds(t),r)},r.range=function(e){return e===void 0?t.slice():(t=e.slice(),n=Math.max(1,t.length),r)},r.invertExtent=function(r){let i=t.indexOf(r);if(i<0)return[NaN,NaN];let a=e[0],o=(e[e.length-1]-a)/n;return[a+i*o,a+(i+1)*o]},r}function ys(){let e=[],t=[0,1],n=[];function r(e){if(isNaN(e))return t[0];let r=cs(n,e);return t[r]}r.domain=function(t){return t===void 0?e.slice():(e=t.filter(e=>e!=null&&!isNaN(e)&&typeof e==`number`).sort((e,t)=>e-t),i(),r)},r.range=function(e){return e===void 0?t.slice():(t=e.slice(),i(),r)},r.invertExtent=function(r){let i=t.indexOf(r);return i<0?[NaN,NaN]:(t.length,i>0?[n[i-1],n[i]]:[e[0],n[0]])},r.quantiles=function(){return n.slice()};function i(){let r=t.length,i=e.length;if(i===0||r===0)n=[];else{n=[];for(let t=1;t<r;t++){let a=t/r,o=(i-1)*a,s=Math.floor(o),c=Math.ceil(o),l=o-s;c>=i?n.push(e[i-1]):n.push(e[s]*(1-l)+e[c]*l)}}}return r}function bs(){let e=[.5],t=[0,1];function n(n){let r=cs(e,n);return t[r]}return n.domain=function(t){return t===void 0?e.slice():(e=t.filter(e=>e!=null&&!isNaN(e)&&typeof e==`number`),e.length===0&&(e=[.5]),n)},n.range=function(e){return e===void 0?t.slice():(t=e.slice(),n)},n.invertExtent=function(n){let r=t.indexOf(n);return[r>0?e[r-1]:void 0,r<e.length?e[r]:void 0]},n}function xs(){let e=[0,1],t=e=>e,n=!1;function r(r){let i=e[0],a=e[e.length-1];if(i===a)return t(.5);let o=(r-i)/(a-i);return n&&(o=Math.max(0,Math.min(1,o))),t(o)}return r.domain=function(t){return t===void 0?e.slice():(e=ds(t),r)},r.interpolator=function(e){return e===void 0?t:(t=e,r)},r.clamp=function(e){return e===void 0?n:(n=e,r)},r}function Ss(){let e=[0,.5,1],t=e=>e,n=!1;function r(r){let i=e[0],a=e[1],o=e[2],s;return r<a?i===a?t(.5):(s=(r-i)/(a-i),s=n?Math.max(0,s):s,t(.5-s*.5)):a===o?t(.5):(s=(r-a)/(o-a),s=n?Math.min(1,s):s,t(.5+s*.5))}return r.domain=function(t){if(t===void 0)return e.slice();let n=t.filter(e=>e!=null&&!isNaN(e)&&typeof e==`number`);if(n.length>=3)e=[n[0],n[1],n[2]];else if(n.length===2){let t=(n[0]+n[1])/2;e=[n[0],t,n[1]]}else e=n.length===1?[n[1],n[0],n[0]+1]:[0,.5,1];return r},r.interpolator=function(e){return e===void 0?t:(t=e,r)},r.clamp=function(e){return e===void 0?n:(n=e,r)},r}function Cs(){let e=[0,1],t=[0,1],n=!1;function r(r){let i=e[0],a=e[e.length-1],o=t[0],s=t[t.length-1];if(i===a)return(o+s)/2;let c=(r-i)/(a-i);return n&&(c=Math.max(0,Math.min(1,c))),o+c*(s-o)}return r.domain=function(t){return t===void 0?e.slice():(e=ds(t),r)},r.range=function(e){return e===void 0?t.slice():(t=e.slice(),r)},r.invert=function(n){let r=e[0],i=e[e.length-1],a=t[0],o=t[t.length-1];return r+(n-a)/(o-a)*(i-r)},r.ticks=function(t=10){let n=e[0],r=e[e.length-1];if(n===r)return[n];let i=us(n,r,t),a=[],o=Math.floor(n/i),s=Math.ceil(r/i);for(;o<=s;)a.push(o*i),o++;return a},r.nice=function(t=10){let n=e[0],i=e[e.length-1];if(n===i)return r;let a=ls(n,i,t);return a>0&&(e=[Math.floor(n/a)*a,Math.ceil(i/a)*a]),r},r.clamp=function(e){return e===void 0?n:(n=e,r)},r}var ws=t((()=>{})),Ts,Es,Ds,Os,ks,As,js,Ms=t((()=>{E(),D(),ss(),ws(),{isNil:Ts,isString:Es,uniq:Ds,extent:Os}=vt,ks=/^(?:(?!0000)[0-9]{4}([-/.]+)(?:(?:0?[1-9]|1[0-2])\1(?:0?[1-9]|1[0-9]|2[0-8])|(?:0?[13-9]|1[0-2])\1(?:29|30)|(?:0?[13578]|1[02])\1(?:31))|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)([-/.]?)0?2\2(?:29))(\s+([01]|([01][0-9]|2[0-3])):([0-9]|[0-5][0-9]):([0-9]|[0-5][0-9]))?$/,As={[O.LINEAR]:fs,[O.POWER]:ps,[O.LOG]:gs,[O.IDENTITY]:os,[O.SEQUENTIAL]:xs,[O.TIME]:Cs,[O.QUANTILE]:ys,[O.QUANTIZE]:vs,[O.THRESHOLD]:bs,[O.CAT]:_s,[O.DIVERGING]:Ss},js=class{constructor(){this.name=`feature-scale`,this.scaleOptions={}}apply(e,{styleAttributeService:t}){e.hooks.init.tapPromise(`FeatureScalePlugin`,async()=>{e.log(ct.ScaleInitStart,It.INIT),this.scaleOptions=e.getScaleOptions();let n=t.getLayerStyleAttributes(),r=e.getSource()?.data.dataArray;Array.isArray(r)&&r.length===0||(this.caculateScalesForAttributes(n||[],r),e.log(ct.ScaleInitEnd,It.INIT))}),e.hooks.beforeRenderData.tapPromise(`FeatureScalePlugin`,async n=>{if(!n)return n;e.log(ct.ScaleInitStart,It.UPDATE),this.scaleOptions=e.getScaleOptions();let r=t.getLayerStyleAttributes(),i=e.getSource().data.dataArray;return Array.isArray(i)&&i.length===0||(this.caculateScalesForAttributes(r||[],i),e.log(ct.ScaleInitEnd,It.UPDATE),e.layerModelNeedUpdate=!0),!0}),e.hooks.beforeRender.tap(`FeatureScalePlugin`,()=>{if(e.layerModelNeedUpdate)return;this.scaleOptions=e.getScaleOptions();let n=t.getLayerStyleAttributes(),r=e.getSource().data.dataArray;if(!(Array.isArray(r)&&r.length===0)&&n){let e=n.filter(e=>e.needRescale);e.length&&this.caculateScalesForAttributes(e,r)}})}isNumber(e){return!isNaN(parseFloat(e))&&isFinite(e)}caculateScalesForAttributes(e,t){e.forEach(e=>{if(e.scale){let n=e.scale,r=e.scale.field;n.names=this.parseFields(Ts(r)?[]:r);let a=[];n.names.forEach(n=>{a.push(this.createScale(n,e.name,e.scale?.values,t))}),a.some(e=>e.type===i.VARIABLE)?(n.type=i.VARIABLE,a.forEach(e=>{if(!n.callback&&n.values!==`text`)switch(e.option?.type){case O.LOG:case O.LINEAR:case O.POWER:if(n.values&&n.values.length>2){let t=e.scale.ticks(n.values.length);e.scale.domain(t)}n.values?e.scale.range(n.values):e.scale.range(e.option.domain);break;case O.QUANTILE:case O.QUANTIZE:case O.THRESHOLD:e.scale.range(n.values);break;case O.IDENTITY:break;case O.CAT:n.values?e.scale.range(n.values):e.scale.range(e.option.domain);break;case O.DIVERGING:case O.SEQUENTIAL:e.scale.interpolator(Et(n.values))}n.values===`text`&&e.scale.range(e.option?.domain)})):(n.type=i.CONSTANT,n.defaultValues=a.map((e,t)=>e.scale(n.names[t]))),n.scalers=a.map(e=>({field:e.field,func:e.scale,option:e.option})),e.needRescale=!1}})}parseFields(e){return Array.isArray(e)?e:Es(e)?e.split(`*`):[e]}createScale(e,t,n,r){let a=this.scaleOptions[t]&&this.scaleOptions[t]?.field===e?this.scaleOptions[t]:this.scaleOptions[e],o={field:e,scale:void 0,type:i.VARIABLE,option:a};if(!r||!r.length)return a&&a.type?o.scale=this.createDefaultScale(a):(o.scale=_s([e]),o.type=i.CONSTANT),o;let s=r.find(t=>!Ts(t[e]))?.[e];if(this.isNumber(e)||Ts(s)&&!a)o.scale=_s([e]),o.type=i.CONSTANT;else{let i=a&&a.type||this.getDefaultType(s);n===`text`&&(i=O.CAT),n===void 0&&(i=O.IDENTITY),t===`color`&&Array.isArray(n)&&n.length&&n.every(e=>Es(e))&&(i===O.LINEAR||i===O.POWER||i===O.LOG)&&(i=O.SEQUENTIAL);let c=this.createScaleConfig(i,e,a,r);o.scale=this.createDefaultScale(c),o.option=c}return o}getDefaultType(e){let t=O.LINEAR;return typeof e==`string`&&(t=ks.test(e)?O.TIME:O.CAT),t}createScaleConfig(e,t,n,r){let i={...n,type:e};if(i?.domain)return i;let a=[];if(e===O.QUANTILE){let e=new Map;r?.forEach(n=>{e.set(n._id,n[t])}),a=Array.from(e.values())}else a=r?.map(e=>e[t])||[];if(e===O.CAT||e===O.IDENTITY)i.domain=Ds(a);else if(e===O.QUANTILE)i.domain=a;else if(e===O.DIVERGING){let e=Os(a),t=n?.neutral===void 0?(e[0]+e[1])/2:n?.neutral;i.domain=[e[0],t,e[1]]}else i.domain=Os(a);return i}createDefaultScale({type:e,domain:t,unknown:n,clamp:r,nice:i}){let a=As[e]();return t&&a.domain&&a.domain(t),n&&a.unknown(n),r!==void 0&&a.clamp&&a.clamp(r),i!==void 0&&a.nice&&a.nice(i),a}}})),Ns,Ps=t((()=>{Ns=class{constructor(){this.name=`layer-animate-style`}apply(e){e.hooks.beforeRender.tap(`LayerAnimateStylePlugin`,()=>{e.animateStatus&&e.models.forEach(t=>{t.addUniforms({...e.layerModel.getAnimateUniforms()})})})}}})),Fs,Is=t((()=>{Fs=class{constructor(){this.name=`layer-mask`}apply(e){e.hooks.afterInit.tap(`LayerMaskPlugin`,()=>{let{maskLayers:t,enableMask:n}=e.getLayerConfig();!e.tileLayer&&t&&t.length>0&&e.updateLayerConfig({mask:n})})}}})),Ls,Rs=t((()=>{E(),Ls=class{constructor(){this.name=`layer-model`}async build(e){e.prepareBuildModel(),await e.buildModels()}async initLayerModel(e){await this.build(e),e.styleNeedUpdate=!1}async prepareLayerModel(e){await this.build(e),e.styleNeedUpdate=!1}apply(e){e.hooks.init.tapPromise(`LayerModelPlugin`,async()=>{e.getSource().isTile?e.prepareBuildModel():(e.log(ct.BuildModelStart,It.INIT),await this.initLayerModel(e),e.log(ct.BuildModelEnd,It.INIT))}),e.hooks.beforeRenderData.tapPromise(`LayerModelPlugin`,async t=>!t||e.getSource().isTile?!1:(e.log(ct.BuildModelStart,It.UPDATE),await this.prepareLayerModel(e),e.log(ct.BuildModelEnd,It.UPDATE),!0))}}})),zs,Bs=t((()=>{zs=class{constructor(){this.name=`layer-style`}apply(e){e.hooks.afterInit.tap(`LayerStylePlugin`,()=>{let{autoFit:t,fitBoundsOptions:n}=e.getLayerConfig();t&&e.fitBounds(n),e.styleNeedUpdate=!1})}}}));function Vs(e){let t={u_DirectionalLights:[,,,].fill({...Ws}),u_NumOfDirectionalLights:0,u_SpotLights:[,,,].fill({...Gs}),u_NumOfSpotLights:0};return e&&e.length||(e=[Us]),e.forEach(({type:e=`directional`,...n})=>{let r=Hs[e].lights,i=Hs[e].num,a=t[i];t[r][a]={...t[r][a],...n},t[i]++}),t}var Hs,Us,Ws,Gs,Ks,qs=t((()=>{Hs={directional:{lights:`u_DirectionalLights`,num:`u_NumOfDirectionalLights`},spot:{lights:`u_SpotLights`,num:`u_NumOfSpotLights`}},Us={type:`directional`,direction:[1,10.5,12],ambient:[.2,.2,.2],diffuse:[.6,.6,.6],specular:[.1,.1,.1]},Ws={direction:[0,0,0],ambient:[0,0,0],diffuse:[0,0,0],specular:[0,0,0]},Gs={position:[0,0,0],direction:[0,0,0],ambient:[0,0,0],diffuse:[0,0,0],specular:[0,0,0],constant:1,linear:0,quadratic:0,angle:14,exponent:40,blur:5},Ks=class{constructor(){this.name=`lighting`}apply(e){e.hooks.beforeRender.tap(`LightingPlugin`,()=>{let{enableLighting:t}=e.getLayerConfig();t&&e.models.forEach(e=>e.addUniforms({...Vs()}))})}}}));function Js(e){return e.map(e=>(typeof e==`string`&&(e=[e,{}]),e))}function Ys(e,t,n,r){let i=e.multiPassRenderer;return i.add(r(`render`)),Js(t).forEach(e=>{let[t,r]=e;i.add(n(t),r)}),i.add(n(`copy`)),i}var Xs=t((()=>{})),Zs,Qs=t((()=>{Xs(),Zs=class{constructor(){this.name=`multi-pass-renderer`}apply(e,{rendererService:t,postProcessingPassFactory:n,normalPassFactory:r}){e.hooks.init.tapPromise(`MultiPassRendererPlugin`,()=>{let{enableMultiPassRenderer:t,passes:i=[]}=e.getLayerConfig();this.enabled=!!t&&e.getLayerConfig().enableMultiPassRenderer!==!1,this.enabled&&(e.multiPassRenderer=Ys(e,i,n,r),e.multiPassRenderer.setRenderFlag(!0))}),e.hooks.beforeRender.tap(`MultiPassRendererPlugin`,()=>{if(this.enabled){let{width:n,height:r}=t.getViewportSize();e.multiPassRenderer.resize(n,r)}})}}}));function $s(e){switch(e){case`rotation`:return{name:`Rotation`,type:k.Attribute,descriptor:{name:`a_Rotation`,shaderLocation:ec.ROTATION,buffer:{usage:m.DYNAMIC_DRAW,data:[],type:m.FLOAT},size:1,update:e=>{let{rotation:t=0}=e;return Array.isArray(t)?[t[0]]:[t]}}};case`stroke`:return{name:`stroke`,type:k.Attribute,descriptor:{name:`a_Stroke`,shaderLocation:ec.STROKE,buffer:{usage:m.DYNAMIC_DRAW,data:[],type:m.FLOAT},size:4,update:e=>{let{stroke:t=[1,1,1,1]}=e;return t}}};case`opacity`:return{name:`opacity`,type:k.Attribute,descriptor:{name:`a_Opacity`,shaderLocation:ec.OPACITY,buffer:{usage:m.STATIC_DRAW,data:[],type:m.FLOAT},size:1,update:e=>{let{opacity:t=1}=e;return[t]}}};case`offsets`:return{name:`offsets`,type:k.Attribute,descriptor:{name:`a_Offsets`,shaderLocation:ec.OFFSETS,buffer:{usage:m.STATIC_DRAW,data:[],type:m.FLOAT},size:2,update:e=>{let{offsets:t}=e;return t}}};case`anchor`:return{name:`anchor`,type:k.Attribute,descriptor:{name:`a_Anchor`,shaderLocation:ec.ANCHOR,buffer:{usage:m.STATIC_DRAW,data:[],type:m.FLOAT},size:1,update:e=>{let{anchor:t=0}=e;return[t]}}};default:return}}var ec,tc=t((()=>{E(),ec={POSITION:0,POSITION_64LOW:1,COLOR:2,PICKING_COLOR:3,STROKE:4,OPACITY:5,OFFSETS:6,ROTATION:7,ANCHOR:8,MAX:9}})),nc,rc,ic,ac=t((()=>{E(),D(),tc(),{isNumber:nc}=vt,rc={NONE:0,ENCODE:1,HIGHLIGHT:2},ic=class{constructor(){this.name=`pixel-picking`}pickOption2Array(){let e=[];return this.pickingUniformMap.forEach(t=>{nc(t)?e.push(t):e.push(...t)}),e}updatePickOption(e,t){Object.keys(e).forEach(t=>{this.pickingUniformMap.set(t,e[t])});let n=t.getLayerConfig().pickingBuffer||0,r=Number(t.getShaderPickStat());this.pickingUniformMap.set(`u_PickingBuffer`,n),this.pickingUniformMap.set(`u_shaderPick`,r),t.getPickingUniformBuffer().subData({offset:0,data:this.pickOption2Array()})}apply(e,{styleAttributeService:t}){this.pickingUniformMap=new Map([[`u_HighlightColor`,[1,0,0,1]],[`u_SelectColor`,[1,0,0,1]],[`u_PickingColor`,[0,0,0]],[`u_PickingStage`,0],[`u_CurrentSelectedId`,[0,0,0]],[`u_PickingThreshold`,10],[`u_PickingBuffer`,0],[`u_shaderPick`,0],[`u_activeMix`,0]]),e.hooks.init.tapPromise(`PixelPickingPlugin`,()=>{let{enablePicking:n}=e.getLayerConfig();t.registerStyleAttribute({name:`pickingColor`,type:k.Attribute,descriptor:{name:`a_PickingColor`,shaderLocation:ec.PICKING_COLOR,buffer:{data:[],type:m.FLOAT},size:3,update:e=>{let{id:t}=e;return n?yn(t):[0,0,0]}}})}),e.hooks.beforePickingEncode.tap(`PixelPickingPlugin`,()=>{let{enablePicking:t}=e.getLayerConfig();t&&e.isVisible()&&(this.updatePickOption({u_PickingStage:rc.ENCODE},e),e.models.forEach(e=>e.addUniforms({u_PickingStage:rc.ENCODE})))}),e.hooks.afterPickingEncode.tap(`PixelPickingPlugin`,()=>{let{enablePicking:t}=e.getLayerConfig();t&&e.isVisible()&&(this.updatePickOption({u_PickingStage:rc.HIGHLIGHT},e),e.models.forEach(e=>e.addUniforms({u_PickingStage:rc.HIGHLIGHT})))}),e.hooks.beforeHighlight.tap(`PixelPickingPlugin`,t=>{let{highlightColor:n,activeMix:r=0}=e.getLayerConfig(),i=typeof n==`string`?A(n):n||[1,0,0,1];e.updateLayerConfig({pickedFeatureID:un(new Uint8Array(t))});let a={u_PickingStage:rc.HIGHLIGHT,u_PickingColor:t,u_HighlightColor:i.map(e=>e*255),u_activeMix:r};this.updatePickOption(a,e),e.models.forEach(e=>e.addUniforms(a))}),e.hooks.beforeSelect.tap(`PixelPickingPlugin`,t=>{let{selectColor:n,selectMix:r=0}=e.getLayerConfig(),i=typeof n==`string`?A(n):n||[1,0,0,1];e.updateLayerConfig({pickedFeatureID:un(new Uint8Array(t))});let a={u_PickingStage:rc.HIGHLIGHT,u_PickingColor:t,u_HighlightColor:i.map(e=>e*255),u_activeMix:r,u_CurrentSelectedId:t,u_SelectColor:i.map(e=>e*255)};this.updatePickOption(a,e),e.models.forEach(e=>e.addUniforms(a))})}}}));function oc(e){let t=e.getSource();return sc.includes(t.parser.type)}var sc,cc=t((()=>{sc=[`mvt`,`geojsonvt`,`testTile`]})),lc,uc=t((()=>{E(),tc(),cc(),lc=class{constructor(){this.name=`register-style-attribute`}apply(e,{styleAttributeService:t}){e.hooks.init.tapPromise(`RegisterStyleAttributePlugin`,()=>{oc(e)||this.registerBuiltinAttributes(t,e)})}registerBuiltinAttributes(e,t){t.type===`MaskLayer`?this.registerPositionAttribute(e):(this.registerPositionAttribute(e),this.registerColorAttribute(e))}registerPositionAttribute(e){e.registerStyleAttribute({name:`position`,type:k.Attribute,descriptor:{name:`a_Position`,shaderLocation:ec.POSITION,buffer:{data:[],type:m.FLOAT},size:3,update:(e,t,n)=>n.length===2?[n[0],n[1],0]:[n[0],n[1],n[2]]}})}registerColorAttribute(e){e.registerStyleAttribute({name:`color`,type:k.Attribute,descriptor:{name:`a_Color`,shaderLocation:ec.COLOR,buffer:{usage:m.DYNAMIC_DRAW,data:[],type:m.FLOAT},size:4,update:e=>{let{color:t}=e;return!t||!t.length?[1,1,1,1]:t}}})}}})),dc,fc=t((()=>{E(),dc=class{constructor(){this.name=`shader-uniform`}apply(e,{rendererService:t,mapService:n,layerService:r,coordinateSystemService:i,cameraService:a}){this.rendererService=t,this.mapService=n,this.layerService=r,this.coordinateSystemService=i,this.cameraService=a;let o;this.rendererService.uniformBuffers[0]||(o=this.rendererService.createBuffer({data:new Float32Array(96),isUBO:!0,label:`renderUniformBuffer`}),this.rendererService.uniformBuffers[0]=o),e.hooks.beforeRender.tap(`ShaderUniformPlugin`,()=>{let t=e.getRelativeOrigin&&e.getRelativeOrigin()||[0,0];this.coordinateSystemService.refresh(),t&&(Math.abs(t[0])>1e-4||Math.abs(t[1])>1e-4)&&this.coordinateSystemService.getCoordinateSystem()===2&&this.coordinateSystemService.setViewportCenter(t);let{width:n,height:r}=this.rendererService.getViewportSize(),{data:i,uniforms:a}=this.generateUBO(n,r,t);this.layerService.alreadyInRendering&&this.rendererService.uniformBuffers[0]&&this.rendererService.uniformBuffers[0].subData({offset:0,data:i}),this.rendererService.queryVerdorInfo()===`WebGL1`&&e.models.forEach(t=>{t.addUniforms({...a,u_PickingBuffer:e.getLayerConfig().pickingBuffer||0,u_shaderPick:Number(e.getShaderPickStat())})})})}generateUBO(e,t,n){let r=this.cameraService.getProjectionMatrix(),i=this.cameraService.getViewMatrix(),a=this.cameraService.getViewProjectionMatrix(),o=this.cameraService.getModelMatrix(),s=this.coordinateSystemService.getViewportCenterProjection(),c=this.coordinateSystemService.getPixelsPerDegree(),l=this.cameraService.getZoom(),u=this.coordinateSystemService.getPixelsPerDegree2(),d=this.cameraService.getZoomScale(),f=this.coordinateSystemService.getPixelsPerMeter(),p=this.coordinateSystemService.getCoordinateSystem(),m=this.cameraService.getCameraPosition(),h=window.devicePixelRatio,g=this.coordinateSystemService.getViewportCenter(),_=[e,t],v=this.cameraService.getFocalDistance(),y=n&&n.length>=2?[n[0],n[1]]:[0,0],b=[];return b.push(...i),b.push(...r),b.push(...a),b.push(...o),b.push(...s),b.push(...c),b.push(l),b.push(...u),b.push(d),b.push(...f),b.push(p),b.push(...m),b.push(h),b.push(...g),b.push(..._),b.push(v),b.push(0),b.push(...y),b.push(0),{data:b,uniforms:{[bt.ProjectionMatrix]:r,[bt.ViewMatrix]:i,[bt.ViewProjectionMatrix]:a,[bt.Zoom]:l,[bt.ZoomScale]:d,[bt.FocalDistance]:v,[bt.CameraPosition]:m,[dt.CoordinateSystem]:p,[dt.ViewportCenter]:g,[dt.ViewportCenterProjection]:s,[dt.PixelsPerDegree]:c,[dt.PixelsPerDegree2]:u,[dt.PixelsPerMeter]:f,u_ViewportSize:_,u_ModelMatrix:o,u_DevicePixelRatio:h,u_RelativeOrigin:y}}}}})),pc,mc=t((()=>{pc=class{constructor(){this.name=`update-model`}apply(e){e.hooks.beforeRender.tap(`UpdateModelPlugin`,()=>{e.layerModel&&e.layerModel.needUpdate().then(t=>{t&&e.renderLayers()})}),e.hooks.afterRender.tap(`UpdateModelPlugin`,()=>{e.layerModelNeedUpdate=!1})}}})),hc,gc=t((()=>{hc=class{constructor(){this.name=`update-style-attribute`}apply(e,{styleAttributeService:t}){e.hooks.init.tapPromise(`UpdateStyleAttributePlugin`,()=>{this.initStyleAttribute(e,{styleAttributeService:t})}),e.hooks.beforeRender.tap(`UpdateStyleAttributePlugin`,()=>{e.layerModelNeedUpdate||e.inited&&this.updateStyleAttribute(e,{styleAttributeService:t})})}updateStyleAttribute(e,{styleAttributeService:t}){let n=t.getLayerStyleAttributes()||[],r=t.getLayerStyleAttribute(`filter`);r&&r.needRegenerateVertices?(e.layerModelNeedUpdate=!0,n.forEach(e=>e.needRegenerateVertices=!1)):n.filter(e=>e.needRegenerateVertices).forEach(n=>{t.updateAttributeByFeatureRange(n.name,e.getEncodedData(),n.featureRange.startIndex,n.featureRange.endIndex,e),n.needRegenerateVertices=!1})}initStyleAttribute(e,{styleAttributeService:t}){(t.getLayerStyleAttributes()||[]).filter(e=>e.needRegenerateVertices).forEach(n=>{t.updateAttributeByFeatureRange(n.name,e.getEncodedData(),n.featureRange.startIndex,n.featureRange.endIndex),n.needRegenerateVertices=!1})}}})),_c,vc=t((()=>{gr(),as(),Ms(),Ps(),Is(),Rs(),Bs(),qs(),Qs(),ac(),uc(),fc(),mc(),gc(),_c=class{constructor(){this.plugins=[],this.defaultsRegistered=!1}registerBuiltinDefaults(){return this.defaultsRegistered||(this.defaultsRegistered=!0,this.plugins=[new is,new lc,new js,new hr,new zs,new Fs,new hc,new pc,new Zs,new dc,new Ns,new Ks,new ic,new Ls]),this}register(e){return this.plugins.push(e),this}reorder(e){return this.plugins.sort(e),this}replace(e,t){let n=this.plugins.findIndex(t=>t.name===e);if(n===-1)throw Error(`LayerPluginRegistry.replace: no plugin named "${e}" is registered`);return this.plugins[n]=t,this}sortByOrder(){return this.plugins.sort((e,t)=>{let n=e.order??1/0,r=t.order??1/0;return n===r?0:n-r}),this}getByName(e){return this.plugins.find(t=>t.name===e)}getAll(){return[...this.plugins]}clear(){return this.plugins=[],this.defaultsRegistered=!1,this}isDefaultsRegistered(){return this.defaultsRegistered}}})),yc,bc=t((()=>{E(),yc={[nn.additive]:{enable:!0,func:{srcRGB:m.ONE,dstRGB:m.ONE,srcAlpha:1,dstAlpha:1}},[nn.none]:{enable:!1},[nn.normal]:{enable:!0,func:{srcRGB:m.SRC_ALPHA,dstRGB:m.ONE_MINUS_SRC_ALPHA,srcAlpha:1,dstAlpha:1}},[nn.subtractive]:{enable:!0,func:{srcRGB:m.ONE,dstRGB:m.ONE,srcAlpha:m.ZERO,dstAlpha:m.ONE_MINUS_SRC_COLOR},equation:{rgb:m.FUNC_SUBTRACT,alpha:m.FUNC_SUBTRACT}},[nn.max]:{enable:!0,func:{srcRGB:m.ONE,dstRGB:m.ONE},equation:{rgb:m.MAX_EXT}},[nn.min]:{enable:!0,func:{srcRGB:m.ONE,dstRGB:m.ONE},equation:{rgb:m.MIN_EXT}}}})),xc,Sc=t((()=>{xc=class{constructor(e){this.animateStartTime=0,this.animateStatus=!1,this.layer=e}prepareAnimate(){let{animateOption:e}=this.layer.getLayerConfig();e?.enable&&(this.layer.container.layerService.startAnimate(),this.animateStatus=!0)}getTime(){return this.layer.container.layerService.clock.getDelta()}setAnimateStartTime(){this.animateStartTime=this.layer.container.layerService.clock.getElapsedTime()}stopAnimate(){this.animateStatus&&(this.layer.container.layerService.stopAnimate(),this.animateStatus=!1,this.layer.updateLayerConfig({animateOption:{enable:!1}}))}getLayerAnimateTime(){return this.layer.container.layerService.clock.getElapsedTime()-this.animateStartTime}getAnimateStatus(){return this.animateStatus}}})),Cc,wc=t((()=>{Cc=class{constructor(e,t,n){this.layer=e,this.rawConfig=t,this.configService=n}read(){return this.configService.getLayerConfig(this.layer.id)}apply(e){if(Object.keys(e).map(t=>{t in this.rawConfig&&(this.rawConfig[t]=e[t])}),!this.layer.startInit)this.needUpdateConfig={...this.needUpdateConfig,...e};else{let t=this.layer.container.id;this.configService.setLayerConfig(t,this.layer.id,{...this.configService.getLayerConfig(this.layer.id),...this.needUpdateConfig,...e}),this.needUpdateConfig={}}}hasPending(){return Object.keys(this.needUpdateConfig||{}).length!==0}}})),Tc,Ec=t((()=>{Tc=class{constructor(e,t){this.layer=e,this.masks=t}addMask(e){this.masks.push(e),this.layer.updateLayerConfig({maskLayers:this.masks}),this.enableMask()}removeMask(e){let t=this.masks.indexOf(e);t>-1&&this.masks.splice(t,1),this.layer.updateLayerConfig({maskLayers:this.masks})}disableMask(){this.layer.updateLayerConfig({enableMask:!1})}enableMask(){this.layer.updateLayerConfig({enableMask:!0})}addMaskLayer(e){this.masks.push(e)}removeMaskLayer(e){let t=this.masks.indexOf(e);t>-1&&this.masks.splice(t,1),e.destroy()}}})),Dc,Oc,kc=t((()=>{D(),{isObject:Dc}=vt,Oc=class{constructor(e,t){this.currentPickId=null,this.selectedFeatureID=null,this.layer=e,this.rerender=t}pick({x:e,y:t}){this.layer.container.interactionService.triggerHover({x:e,y:t})}boxSelect(e,t){this.layer.container.pickingService.boxPickLayer(this.layer,e,t)}needPick(e){let{enableHighlight:t=!0,enableSelect:n=!0}=this.layer.getLayerConfig(),r=this.layer.eventNames().indexOf(e)!==-1||this.layer.eventNames().indexOf(`un`+e)!==-1;return(e===`click`||e===`dblclick`)&&n&&(r=!0),e===`mousemove`&&(t||this.layer.eventNames().indexOf(`mouseenter`)!==-1||this.layer.eventNames().indexOf(`unmousemove`)!==-1||this.layer.eventNames().indexOf(`mouseout`)!==-1)&&(r=!0),this.layer.isVisible()&&r}setCurrentPickId(e){this.currentPickId=e}getCurrentPickId(){return this.currentPickId}setCurrentSelectedId(e){this.selectedFeatureID=e}getCurrentSelectedId(){return this.selectedFeatureID}active(e){let t={};return t.enableHighlight=Dc(e)?!0:e,Dc(e)?(t.enableHighlight=!0,e.color&&(t.highlightColor=e.color),e.mix&&(t.activeMix=e.mix)):t.enableHighlight=!!e,this.layer.updateLayerConfig(t),this.layer}setActive(e,t){if(Dc(e)){let{x:n=0,y:r=0}=e;this.layer.updateLayerConfig({highlightColor:Dc(t)?t.color:this.layer.getLayerConfig().highlightColor,activeMix:Dc(t)?t.mix:this.layer.getLayerConfig().activeMix}),this.pick({x:n,y:r})}else this.layer.updateLayerConfig({pickedFeatureID:e,highlightColor:Dc(t)?t.color:this.layer.getLayerConfig().highlightColor,activeMix:Dc(t)?t.mix:this.layer.getLayerConfig().activeMix}),this.layer.hooks.beforeHighlight.call(yn(e)).then(()=>{setTimeout(()=>{this.rerender()},1)})}select(e){let t={};return t.enableSelect=Dc(e)?!0:e,Dc(e)?(t.enableSelect=!0,e.color&&(t.selectColor=e.color),e.mix&&(t.selectMix=e.mix)):t.enableSelect=!!e,this.layer.updateLayerConfig(t),this.layer}setSelect(e,t){if(Dc(e)){let{x:n=0,y:r=0}=e;this.layer.updateLayerConfig({selectColor:Dc(t)?t.color:this.layer.getLayerConfig().selectColor,selectMix:Dc(t)?t.mix:this.layer.getLayerConfig().selectMix}),this.pick({x:n,y:r})}else this.layer.updateLayerConfig({pickedFeatureID:e,selectColor:Dc(t)?t.color:this.layer.getLayerConfig().selectColor,selectMix:Dc(t)?t.mix:this.layer.getLayerConfig().selectMix}),this.layer.hooks.beforeSelect.call(yn(e)).then(()=>{setTimeout(()=>{this.rerender()},1)})}}})),Ac,jc=t((()=>{D(),Ac=class{constructor(e){this.layer=e}pickRender(e){let t=this.layer.getContainer().layerService,n=this.layer;if(n.tileLayer)return n.tileLayer.pickRender(e);n.hooks.beforePickingEncode.call(),t.renderTileLayerMask(n),n.renderModels({ispick:!0}),n.hooks.afterPickingEncode.call()}async pick(e,t){let n=this.layer.getContainer().pickingService;return e.type===`RasterLayer`?this.pickRasterLayer(e,t):(this.pickRender(t),n.pickFromPickingFBO(e,t))}pickRasterLayer(e,t,n){let r=this.layer.getContainer(),i=r.pickingService,a=r.mapService,o=this.layer.getOriginalExtent(),s=o[0]!==0||o[2]!==0?o:this.layer.getSource().extent,c=be(t.lngLat,s),l={x:t.x,y:t.y,type:t.type,lngLat:t.lngLat,target:t,rasterValue:null},u=n||e;return c?(l.rasterValue=this.readRasterValue(e,s,a,t.x,t.y),i.triggerHoverOnLayer(u,l),!0):(l.type=t.type===`mousemove`?`mouseout`:`un`+t.type,i.triggerHoverOnLayer(u,{...l,type:`unpick`}),i.triggerHoverOnLayer(u,l),!1)}readRasterValue(e,t,n,r,i){let a=e.getSource().data.dataArray[0],[o=0,s=0,c=10,l=-10]=t,u=n.lngLatToContainer([o,s]),d=n.lngLatToContainer([c,l]),f=d.x-u.x,p=u.y-d.y,m=[(r-u.x)/f,(i-d.y)/p],h=a.width||1,g=a.height||1,_=Math.floor(m[0]*h),v=Math.floor(m[1]*g),y=Math.max(0,v-1)*h+_;return a.data[y]}selectFeature(e){let t=this.layer,[n,r,i]=e;t.hooks.beforeSelect.call([n,r,i])}highlightPickedFeature(e){let[t,n,r]=e;this.layer.hooks.beforeHighlight.call([t,n,r])}getFeatureById(e){return this.layer.getSource().getFeatureById(e)}}})),Mc,Nc=t((()=>{D(),Mc=class{constructor(e){this.relativeOrigin=[0,0],this.originalExtent=[0,0,0,0],this.absoluteDataArray=[],this.layer=e}processRelativeCoordinates(){let e=this.layer.getLayerConfig()?.enableRelativeCoordinates,t=this.layer.getSource();if(!e||!t||!t.data)return;this.absoluteDataArray=[...t.data.dataArray];let n=Jt(t.data.dataArray,{enableRelativeCoordinates:!0});t.data.dataArray=n.dataArray,this.relativeOrigin=n.relativeOrigin,this.originalExtent=n.originalExtent}getAbsoluteData(){return this.absoluteDataArray}getRelativeOrigin(){return this.relativeOrigin}getOriginalExtent(){return this.originalExtent}}})),Pc,Fc,Ic,Lc,Rc=t((()=>{D(),{isEqual:Pc,isObject:Fc,isUndefined:Ic}=vt,Lc=class{constructor(e){this.scaleOptions={},this.layer=e}scale(e,t){let n={...this.scaleOptions};Fc(e)?this.scaleOptions={...this.scaleOptions,...e}:this.scaleOptions[e]=t;let r=this.layer.styleAttributeService;if(r&&!Pc(n,this.scaleOptions)){let n=Fc(e)?e:{[e]:t};r.updateScaleAttribute(n)}}getScaleOptions(){return this.scaleOptions}getScale(e){return this.layer.styleAttributeService.getLayerAttributeScale(e)}getLegend(e){let t=this.layer.styleAttributeService.getLayerStyleAttribute(e)?.scale?.scalers||[];return{type:t[0]?.option?.type,field:t[0]?.field,items:this.getLegendItems(e)}}getLegendItems(e){let t=this.layer.styleAttributeService.getLayerAttributeScale(e);return t?t.invertExtent?t.range().map(n=>({value:t.invertExtent(n),[e]:n})):t.ticks?t.ticks().map(n=>({value:n,[e]:t(n)})):t?.domain?t.domain().filter(e=>!Ic(e)).map(n=>({value:n,[e]:t(n)})):[]:[]}}})),zc,Bc,Vc,Hc,Uc,Wc,Gc=t((()=>{D(),Xs(),{isEqual:zc,isFunction:Bc,isNumber:Vc,isObject:Hc,isPlainObject:Uc}=vt,Wc=class{constructor(e,t,n,r){this.layer=e,this.getGlobalConfigService=t,this.getPendingStyleAttributes=n,this.getEncodeStyles=r}color(e,t,n){this.updateStyleAttribute(`color`,e,t,n)}texture(e,t,n){this.updateStyleAttribute(`texture`,e,t,n)}rotate(e,t,n){this.updateStyleAttribute(`rotate`,e,t,n)}size(e,t,n){this.updateStyleAttribute(`size`,e,t,n)}filter(e,t,n){let r=this.updateStyleAttribute(`filter`,e,t,n);this.layer.dataState.dataSourceNeedUpdate=r&&this.layer.inited}shape(e,t,n){this.layer.shapeOption={field:e,values:t};let r=this.updateStyleAttribute(`shape`,e,t,n);this.layer.dataState.dataSourceNeedUpdate=r&&this.layer.inited}label(e,t,n){this.getPendingStyleAttributes().push({attributeName:`label`,attributeField:e,attributeValues:t,updateOptions:n})}animate(e){let t={};Hc(e)?(t.enable=!0,t={...t,...e}):t.enable=e,this.layer.updateLayerConfig({animateOption:t})}style(e){let{passes:t,...n}=e,r=n;t&&Js(t).forEach(e=>{let t=this.layer.multiPassRenderer.getPostProcessor().getPostProcessingPassByName(e[0]);t&&t.updateOptions(e[1])}),r.borderColor&&(r.stroke=r.borderColor),r.borderWidth&&(r.strokeWidth=r.borderWidth);let i=n;Object.keys(n).forEach(e=>{let t=r[e];Array.isArray(t)&&t.length===2&&!Vc(t[0])&&!Vc(t[1])&&(i[e]={field:t[0],value:t[1]})}),this.encodeStyle(i),this.layer.updateLayerConfig(i)}encodeStyle(e){Object.keys(e).forEach(t=>{if(this.getEncodeStyles().has(t)&&Uc(e[t])&&(e[t].field||e[t].value)&&!zc(this.layer.encodeStyleAttribute[t],e[t])){this.layer.encodeStyleAttribute[t]=e[t];let n=e[t];this.updateStyleAttribute(t,n.field,n.value),this.layer.inited&&(this.layer.dataState.dataMappingNeedUpdate=!0)}else this.layer.encodeStyleAttribute[t]&&(delete this.layer.encodeStyleAttribute[t],this.layer.dataState.dataSourceNeedUpdate=!0)})}updateStyleAttribute(e,t,n,r){let i=this.getGlobalConfigService(),a=i.getAttributeConfig(this.layer.id)||{};return!zc(a[e],{field:t,values:n})&&([`color`,`size`,`texture`,`rotate`,`filter`,`label`,`shape`].indexOf(e)!==-1&&i.setAttributeConfig(this.layer.id,{[e]:{field:t,values:n}}),this.layer.startInit?this.layer.styleAttributeService.updateStyleAttribute(e,{scale:{field:t,...this.splitValuesAndCallbackInAttribute(n,this.layer.getLayerConfig()[t])}},r):this.getPendingStyleAttributes().push({attributeName:e,attributeField:t,attributeValues:n,updateOptions:r}),!0)}splitValuesAndCallbackInAttribute(e){return{values:Bc(e)?void 0:e,callback:Bc(e)?e:void 0}}}})),Kc,qc=t((()=>{Kc=class{constructor(e,t){this.layer=e,this.rerender=t}show(){return this.layer.updateLayerConfig({visible:!0}),this.rerender(),this.layer.emit(`show`),this.layer}hide(){return this.layer.updateLayerConfig({visible:!1}),this.rerender(),this.layer.emit(`hide`),this.layer}setIndex(e){return this.layer.zIndex=e,this.layer.container.layerService.updateLayerRenderList(),this.layer.container.layerService.renderLayers(),this.layer}isVisible(){let e=this.layer.container.mapService.getZoom(),{visible:t,minZoom:n=-1/0,maxZoom:r=1/0}=this.layer.getLayerConfig();return!!t&&e>=n&&e<r}setMinZoom(e){return this.layer.updateLayerConfig({minZoom:e}),this.layer}getMinZoom(){let{minZoom:e}=this.layer.getLayerConfig();return e}getMaxZoom(){let{maxZoom:e}=this.layer.getLayerConfig();return e}setMaxZoom(e){return this.layer.updateLayerConfig({maxZoom:e}),this.layer}setAutoFit(e){return this.layer.updateLayerConfig({autoFit:e}),this.layer}fitBounds(e){if(!this.layer.inited)return this.layer.updateLayerConfig({autoFit:!0}),this.layer;let t=this.layer.getSource().extent;return t.some(e=>Math.abs(e)===1/0)||this.layer.container.mapService.fitBounds([[t[0],t[1]],[t[2],t[3]]],e),this.layer}}})),Jc,Yc=t((()=>{D(),Jc=class{constructor(e){this.layer=e;let t=this.layer.getContainer();this.rendererService=t.rendererService}getColorTexture(e,t){let n=this.getTextureKey(e,t);return this.key===n||(this.createColorTexture(e,t),this.key=n),this.colorTexture}createColorTexture(e,t){let{createTexture2D:n}=this.rendererService,r=this.getColorRampBar(e,t),i=n({data:new Uint8Array(r.data),width:r.width,height:r.height,flipY:!1,unorm:!0});return this.colorTexture=i,i}setColorTexture(e,t,n){this.key=this.getTextureKey(t,n),this.colorTexture=e}destroy(){this.colorTexture?.destroy()}getColorRampBar(e,t){switch(e.type){case`cat`:return it(e);case`quantize`:return mn(e);case`custom`:return Pe(e,t);case`linear`:return p(e,t);default:return gn(e)}}getTextureKey(e,t){return`${e.colors.join(`_`)}_${e?.positions?.join(`_`)}_${e.type}_${t?.join(`_`)}`}}})),Xc,Zc,Qc,$c=t((()=>{le(),E(),Xc=e(qt()),vc(),bc(),Xs(),Sc(),wc(),Ec(),kc(),jc(),Nc(),Rc(),Gc(),qc(),Yc(),Zc=0,Qc=class extends Xc.EventEmitter{get shaderModuleService(){return this.container.shaderModuleService}get cameraService(){return this.container.cameraService}get coordinateService(){return this.container.coordinateSystemService}get iconService(){return this.container.iconService}get fontService(){return this.container.fontService}get pickingService(){return this.container.pickingService}get rendererService(){return this.container.rendererService}get layerService(){return this.container.layerService}get debugService(){return this.container.debugService}get interactionService(){return this.container.interactionService}get mapService(){return this.container?.mapService}setEncodeStyles(e,t){t.forEach(t=>this.encodeStyles.set(t,e))}get normalPassFactory(){return this.container.normalPassFactory}get enableShaderEncodeStyles(){return[...this.encodeStyles].filter(([,e])=>e===`shader`).map(([e])=>e)}get enableDataEncodeStyles(){return[...this.encodeStyles].filter(([,e])=>e===`data`).map(([e])=>e)}constructor(e={}){super(),this.id=`${Zc++}`,this.name=`${Zc}`,this.visible=!0,this.zIndex=0,this.inited=!1,this.layerModelNeedUpdate=!1,this.pickedFeatureID=null,this.styleNeedUpdate=!1,this.forceRender=!1,this.clusterZoom=0,this.pickingManager=new Oc(this,()=>this.reRender()),this.defaultSourceConfig={data:[],options:{parser:{type:`json`}}},this.dataState={dataSourceNeedUpdate:!1,dataMappingNeedUpdate:!1,filterNeedUpdate:!1,featureScaleNeedUpdate:!1,StyleAttrNeedUpdate:!1},this.hooks={init:new ee,afterInit:new Ge,beforeRender:new Ge,beforeRenderData:new Re,afterRender:new x,beforePickingEncode:new x,afterPickingEncode:new x,beforeHighlight:new x([`pickedColor`]),afterHighlight:new x,beforeSelect:new x([`pickedColor`]),afterSelect:new x,beforeDestroy:new x,afterDestroy:new x},this.models=[],this.pluginRegistry=new _c,this.startInit=!1,this.layerChildren=[],this.masks=[],this.visibilityZoomManager=new Kc(this,()=>this.reRender()),this.configService=u,this.animateState=new xc(this),this.relativeCoordsManager=new Mc(this),this.encodeStyleAttribute={},this.encodeStyles=new Map,this.pendingStyleAttributes=[],this.scaleLegendManager=new Lc(this),this.isDestroyed=!1,this.uniformBuffers=[],this.encodeDataLength=0,this.sourceEvent=()=>{this.dataState.dataSourceNeedUpdate=!0,this.processRelativeCoordinates();let e=this.getLayerConfig();e&&e.autoFit&&this.fitBounds(e.fitBoundsOptions),this.layerSource.getSourceCfg().autoRender&&setTimeout(()=>{this.reRender()},10)},this.onSourceUpdate=({type:e})=>{if(this.coordCenter===void 0){let e=this.layerSource.center;this.coordCenter=e}if(e===`update`){if(this.tileLayer){this.tileLayer.reload();return}this.sourceEvent()}e===`inited`&&this.processRelativeCoordinates()},this.onMapAfterFrameChange=()=>{this.renderLayers()},this.name=e.name||this.id,this.zIndex=e.zIndex||0,this.configModel=new Cc(this,e,this.configService),this.masks=e.maskLayers||[],this.maskManager=new Tc(this,this.masks),this.styleFluent=new Wc(this,()=>this.configService,()=>this.pendingStyleAttributes,()=>this.encodeStyles)}addMask(e){this.maskManager.addMask(e)}removeMask(e){this.maskManager.removeMask(e)}disableMask(){this.maskManager.disableMask()}enableMask(){this.maskManager.enableMask()}addMaskLayer(e){this.maskManager.addMaskLayer(e)}removeMaskLayer(e){this.maskManager.removeMaskLayer(e)}getAttribute(e){return this.styleAttributeService.getLayerStyleAttribute(e)}getLayerConfig(){return this.configModel.read()}updateLayerConfig(e){this.configModel.apply(e)}setContainer(e){this.container=e}getContainer(){return this.container}addPlugin(e){return this.plugins.push(e),this}async init(){let e=this.container.id;this.startInit=!0,this.configService.setLayerConfig(e,this.id,this.configModel.rawConfig),this.layerType=this.configModel.rawConfig.layerType;let{enableMultiPassRenderer:t,passes:n}=this.getLayerConfig();t&&n?.length&&n.length>0&&this.mapService.on(`mapAfterFrameChange`,this.onMapAfterFrameChange),this.postProcessingPassFactory=this.container.postProcessingPassFactory,this.styleAttributeService=this.container.styleAttributeService,t&&(this.multiPassRenderer=this.container.multiPassRenderer,this.multiPassRenderer.setLayer(this)),this.pendingStyleAttributes.forEach(({attributeName:e,attributeField:t,attributeValues:n,updateOptions:r})=>{this.styleAttributeService.updateStyleAttribute(e,{scale:{field:t,...this.splitValuesAndCallbackInAttribute(n,t?void 0:this.getLayerConfig()[e])}},r)}),this.pendingStyleAttributes=[],this.pluginRegistry.registerBuiltinDefaults(),this.plugins=this.pluginRegistry.getAll();for(let e of this.plugins)e.apply(this,this.container);this.layerPickService=new Ac(this),this.textureService=new Jc(this),this.log(ct.LayerInitStart),await this.hooks.init.promise(),this.log(ct.LayerInitEnd),this.inited=!0,this.emit(`inited`,{target:this,type:`inited`}),this.emit(`add`,{target:this,type:`add`}),this.hooks.afterInit.call()}log(e,t=`init`){if(this.tileLayer||this.isTileLayer)return;let n=`${this.id}.${t}.${e}`,r={id:this.id,type:this.type};this.debugService?.log(n,r)}updateModelData(e){e.attributes&&e.elements?this.models.map(t=>{t.updateAttributesAndElements(e.attributes,e.elements)}):console.warn(`data error`)}setLayerPickService(e){this.layerPickService=e}prepareBuildModel(){this.configModel.hasPending()&&this.updateLayerConfig({}),this.animateState.prepareAnimate()}color(e,t,n){return this.styleFluent.color(e,t,n),this}texture(e,t,n){return this.styleFluent.texture(e,t,n),this}rotate(e,t,n){return this.styleFluent.rotate(e,t,n),this}size(e,t,n){return this.styleFluent.size(e,t,n),this}filter(e,t,n){return this.styleFluent.filter(e,t,n),this}shape(e,t,n){return this.styleFluent.shape(e,t,n),this}label(e,t,n){return this.styleFluent.label(e,t,n),this}animate(e){return this.styleFluent.animate(e),this}source(e,t){return e?.type===`source`?(this.setSource(e),this):(this.sourceOption={data:e,options:t},this.clusterZoom=0,this)}setData(e,t){return this.inited?(this.dataUpdatelog(),this.layerSource.setData(e,t)):this.on(`inited`,()=>{this.dataUpdatelog(),this.layerSource.setData(e,t)}),this}dataUpdatelog(){this.log(ct.SourceInitStart,It.UPDATE),this.layerSource.once(`update`,()=>{this.log(ct.SourceInitEnd,It.UPDATE)})}style(e){return this.styleFluent.style(e),this}scale(e,t){return this.scaleLegendManager.scale(e,t),this}renderLayers(){this.rendering=!0,this.layerService.reRender(),this.rendering=!1}prerender(){}render(e={}){return this.tileLayer?(this.tileLayer.render(),this):(this.layerService.beforeRenderData(this),this.encodeDataLength<=0&&!this.forceRender||this.renderModels(e),this)}async renderMultiPass(){this.encodeDataLength<=0&&!this.forceRender||(this.multiPassRenderer&&this.multiPassRenderer.getRenderFlag()?await this.multiPassRenderer.render():this.renderModels())}active(e){return this.pickingManager.active(e)}setActive(e,t){this.pickingManager.setActive(e,t)}select(e){return this.pickingManager.select(e)}setSelect(e,t){this.pickingManager.setSelect(e,t)}setBlend(e){return this.updateLayerConfig({blend:e}),this.reRender(),this}show(){return this.visibilityZoomManager.show()}hide(){return this.visibilityZoomManager.hide()}setIndex(e){return this.visibilityZoomManager.setIndex(e)}setCurrentPickId(e){this.pickingManager.setCurrentPickId(e)}getCurrentPickId(){return this.pickingManager.getCurrentPickId()}setCurrentSelectedId(e){this.pickingManager.setCurrentSelectedId(e)}getCurrentSelectedId(){return this.pickingManager.getCurrentSelectedId()}isVisible(){return this.visibilityZoomManager.isVisible()}setMultiPass(e,t){if(this.updateLayerConfig({enableMultiPassRenderer:e}),t&&this.updateLayerConfig({passes:t}),e){let{passes:e=[]}=this.getLayerConfig();this.multiPassRenderer=Ys(this,e,this.postProcessingPassFactory,this.normalPassFactory),this.multiPassRenderer.setRenderFlag(!0);let{width:t,height:n}=this.rendererService.getViewportSize();this.multiPassRenderer.resize(t,n)}return this}setMinZoom(e){return this.visibilityZoomManager.setMinZoom(e)}getMinZoom(){return this.visibilityZoomManager.getMinZoom()}getMaxZoom(){return this.visibilityZoomManager.getMaxZoom()}get(e){return this.getLayerConfig()[e]}setMaxZoom(e){return this.visibilityZoomManager.setMaxZoom(e)}setAutoFit(e){return this.visibilityZoomManager.setAutoFit(e)}fitBounds(e){return this.visibilityZoomManager.fitBounds(e)}destroy(e=!0){if(this.isDestroyed)return;this.layerModel?.uniformBuffers.forEach(e=>{e.destroy()}),this.layerChildren.map(e=>e.destroy(!1)),this.layerChildren=[];let{maskfence:t}=this.getLayerConfig();t&&(this.masks.map(e=>e.destroy(!1)),this.masks=[]),this.hooks.beforeDestroy.call(),this.mapService.off(`mapAfterFrameChange`,this.onMapAfterFrameChange),this.layerSource.off(`update`,this.onSourceUpdate),this.multiPassRenderer?.destroy(),this.textureService.destroy(),this.styleAttributeService.clearAllAttributes(),this.hooks.afterDestroy.call(),this.layerModel?.clearModels(e),this.tileLayer?.destroy(),this.models=[],this.debugService?.removeLog(this.id),this.emit(`remove`,{target:this,type:`remove`}),this.emit(`destroy`,{target:this,type:`destroy`}),this.removeAllListeners(),this.isDestroyed=!0}clear(){this.styleAttributeService.clearAllAttributes()}clearModels(){this.models.forEach(e=>e.destroy()),this.layerModel?.clearModels(),this.models=[]}isDirty(){return!!(this.styleAttributeService.getLayerStyleAttributes()||[]).filter(e=>e.needRescale||e.needRemapping||e.needRegenerateVertices).length}setSource(e){if(this.layerSource&&this.layerSource.off(`update`,this.onSourceUpdate),this.layerSource=e,this.clusterZoom=0,this.inited&&this.layerSource.cluster){let e=this.mapService.getZoom();this.layerSource.updateClusterData(e)}this.layerSource.inited&&this.sourceEvent(),this.layerSource.on(`update`,this.onSourceUpdate)}getSource(){return this.layerSource}getScaleOptions(){return this.scaleLegendManager.getScaleOptions()}setEncodedData(e){this.encodedData=e,this.encodeDataLength=e.length}getEncodedData(){return this.encodedData}getScale(e){return this.scaleLegendManager.getScale(e)}getLegend(e){return this.scaleLegendManager.getLegend(e)}getLegendItems(e){return this.scaleLegendManager.getLegendItems(e)}pick({x:e,y:t}){this.pickingManager.pick({x:e,y:t})}boxSelect(e,t){this.pickingManager.boxSelect(e,t)}async buildLayerModel(e){let{moduleName:t,vertexShader:n,fragmentShader:r,defines:i,inject:a,triangulation:o,styleOption:s,pickingEnabled:c=!0,...l}=e;this.shaderModuleService.registerModule(t,{vs:n,fs:r,defines:i,inject:a});let{vs:u,fs:d,uniforms:f}=this.shaderModuleService.getModule(t),{createModel:p}=this.rendererService;return new Promise(e=>{let{attributes:t,elements:n,count:r}=this.styleAttributeService.createAttributesAndIndices(this.encodedData,o,s,this),i=[...this.layerModel.uniformBuffers,...this.rendererService.uniformBuffers];c&&i.push(this.getPickingUniformBuffer());let a={attributes:t,uniforms:f,fs:d,vs:u,elements:n,blend:yc[nn.normal],uniformBuffers:i,textures:this.layerModel.textures,...l};r&&(a.count=r),e(p(a))})}createAttributes(e){let{triangulation:t}=e,{attributes:n}=this.styleAttributeService.createAttributes(this.encodedData,t);return n}get animateStatus(){return this.animateState.getAnimateStatus()}getTime(){return this.animateState.getTime()}setAnimateStartTime(){this.animateState.setAnimateStartTime()}stopAnimate(){this.animateState.stopAnimate()}getLayerAnimateTime(){return this.animateState.getLayerAnimateTime()}needPick(e){return this.pickingManager.needPick(e)}async buildModels(){throw Error(`Method not implemented.`)}async rebuildModels(){await this.buildModels()}renderModels(e={}){return this.encodeDataLength<=0&&!this.forceRender?(this.clearModels(),this):(this.hooks.beforeRender.call(),this.models.forEach(t=>{t.draw({uniforms:this.layerModel.getUninforms(),blend:this.layerModel.getBlend(),stencil:this.layerModel.getStencil(e),textures:this.layerModel.textures},e?.ispick||!1)}),this.hooks.afterRender.call(),this)}updateStyleAttribute(e,t,n,r){return this.styleFluent.updateStyleAttribute(e,t,n,r)}getLayerAttributeConfig(){return this.configService.getAttributeConfig(this.id)}getShaderPickStat(){return this.layerService.getShaderPickStat()}setEarthTime(e){console.warn(`empty fn`)}processData(e){return e}getModelType(){throw Error(`Method not implemented.`)}getDefaultConfig(){return{}}processRelativeCoordinates(){this.relativeCoordsManager.processRelativeCoordinates()}getAbsoluteData(){return this.relativeCoordsManager.getAbsoluteData()}getRelativeOrigin(){return this.relativeCoordsManager.getRelativeOrigin()}getOriginalExtent(){return this.relativeCoordsManager.getOriginalExtent()}async initLayerModels(){this.models.forEach(e=>e.destroy()),this.models=[],this.uniformBuffers.forEach(e=>{e.destroy()}),this.uniformBuffers=[];let e=this.rendererService.createBuffer({data:new Float32Array(20).fill(0),isUBO:!0,label:`pickingUniforms`});this.uniformBuffers.push(e),this.models=await this.layerModel.initModels()}getPickingUniformBuffer(){return this.uniformBuffers[0]}reRender(){this.inited&&this.layerService.reRender()}splitValuesAndCallbackInAttribute(e){return this.styleFluent.splitValuesAndCallbackInAttribute(e)}}}));function el(e,t){return{enable:e,mask:255,func:{cmp:m.EQUAL,ref:+!!t,mask:1}}}function tl(e){return e.maskOperation===Xt.OR?{enable:!0,mask:255,func:{cmp:m.ALWAYS,ref:1,mask:255},opFront:{fail:m.KEEP,zfail:m.REPLACE,zpass:m.REPLACE}}:{enable:!0,mask:255,func:{cmp:e.stencilType===wt.SINGLE||e.stencilIndex===0?m.ALWAYS:m.LESS,ref:e.stencilType===wt.SINGLE?1:e.stencilIndex===0?2:1,mask:255},opFront:{fail:m.KEEP,zfail:m.REPLACE,zpass:m.REPLACE}}}var nl=t((()=>{E()})),rl,il,al=t((()=>{rl={opacity:1,stroke:[1,0,0,1],offsets:[0,0],rotation:0,extrusionBase:0,strokeOpacity:1,thetaOffset:.314,anchor:0},il={opacity:`float`,stroke:`vec4`,offsets:`vec2`,textOffset:`vec2`,rotation:`float`,extrusionBase:`float`,strokeOpacity:`float`,thetaOffset:`float`,anchor:`float`}})),ol=r(((e,t)=>{t.exports=n,t.exports.default=n;function n(e,t,n){n||=2;var i=t&&t.length,o=i?t[0]*n:e.length,s=r(e,0,o,n,!0),c=[];if(!s||s.next===s.prev)return c;var l,d,f,p,m,h,g;if(i&&(s=u(e,t,s,n)),e.length>80*n){l=f=e[0],d=p=e[1];for(var _=n;_<o;_+=n)m=e[_],h=e[_+1],m<l&&(l=m),h<d&&(d=h),m>f&&(f=m),h>p&&(p=h);g=Math.max(f-l,p-d),g=g===0?0:32767/g}return a(s,c,n,l,d,g,0),c}function r(e,t,n,r,i){var a,o;if(i===se(e,t,n,r)>0)for(a=t;a<n;a+=r)o=ae(a,e[a],e[a+1],o);else for(a=n-r;a>=t;a-=r)o=ae(a,e[a],e[a+1],o);return o&&S(o,o.next)&&(oe(o),o=o.next),o}function i(e,t){if(!e)return e;t||=e;var n=e,r;do if(r=!1,!n.steiner&&(S(n,n.next)||x(n.prev,n,n.next)===0)){if(oe(n),n=t=n.prev,n===n.next)break;r=!0}else n=n.next;while(r||n!==t);return t}function a(e,t,n,r,u,d,f){if(e){!f&&d&&h(e,r,u,d);for(var p=e,m,g;e.prev!==e.next;)if(m=e.prev,g=e.next,d?s(e,r,u,d):o(e))t.push(m.i/n|0),t.push(e.i/n|0),t.push(g.i/n|0),oe(e),e=g.next,p=g.next;else if(e=g,e===p){f?f===1?(e=c(i(e),t,n),a(e,t,n,r,u,d,2)):f===2&&l(e,t,n,r,u,d):a(i(e),t,n,r,u,d,1);break}}}function o(e){var t=e.prev,n=e,r=e.next;if(x(t,n,r)>=0)return!1;for(var i=t.x,a=n.x,o=r.x,s=t.y,c=n.y,l=r.y,u=i<a?i<o?i:o:a<o?a:o,d=s<c?s<l?s:l:c<l?c:l,f=i>a?i>o?i:o:a>o?a:o,p=s>c?s>l?s:l:c>l?c:l,m=r.next;m!==t;){if(m.x>=u&&m.x<=f&&m.y>=d&&m.y<=p&&y(i,s,a,c,o,l,m.x,m.y)&&x(m.prev,m,m.next)>=0)return!1;m=m.next}return!0}function s(e,t,n,r){var i=e.prev,a=e,o=e.next;if(x(i,a,o)>=0)return!1;for(var s=i.x,c=a.x,l=o.x,u=i.y,d=a.y,f=o.y,p=s<c?s<l?s:l:c<l?c:l,m=u<d?u<f?u:f:d<f?d:f,h=s>c?s>l?s:l:c>l?c:l,g=u>d?u>f?u:f:d>f?d:f,v=_(p,m,t,n,r),b=_(h,g,t,n,r),S=e.prevZ,C=e.nextZ;S&&S.z>=v&&C&&C.z<=b;){if(S.x>=p&&S.x<=h&&S.y>=m&&S.y<=g&&S!==i&&S!==o&&y(s,u,c,d,l,f,S.x,S.y)&&x(S.prev,S,S.next)>=0||(S=S.prevZ,C.x>=p&&C.x<=h&&C.y>=m&&C.y<=g&&C!==i&&C!==o&&y(s,u,c,d,l,f,C.x,C.y)&&x(C.prev,C,C.next)>=0))return!1;C=C.nextZ}for(;S&&S.z>=v;){if(S.x>=p&&S.x<=h&&S.y>=m&&S.y<=g&&S!==i&&S!==o&&y(s,u,c,d,l,f,S.x,S.y)&&x(S.prev,S,S.next)>=0)return!1;S=S.prevZ}for(;C&&C.z<=b;){if(C.x>=p&&C.x<=h&&C.y>=m&&C.y<=g&&C!==i&&C!==o&&y(s,u,c,d,l,f,C.x,C.y)&&x(C.prev,C,C.next)>=0)return!1;C=C.nextZ}return!0}function c(e,t,n){var r=e;do{var a=r.prev,o=r.next.next;!S(a,o)&&C(a,r,r.next,o)&&ne(a,o)&&ne(o,a)&&(t.push(a.i/n|0),t.push(r.i/n|0),t.push(o.i/n|0),oe(r),oe(r.next),r=e=o),r=r.next}while(r!==e);return i(r)}function l(e,t,n,r,o,s){var c=e;do{for(var l=c.next.next;l!==c.prev;){if(c.i!==l.i&&b(c,l)){var u=ie(c,l);c=i(c,c.next),u=i(u,u.next),a(c,t,n,r,o,s,0),a(u,t,n,r,o,s,0);return}l=l.next}c=c.next}while(c!==e)}function u(e,t,n,i){for(var a=[],o=0,s=t.length,c,l,u;o<s;o++)c=t[o]*i,l=o<s-1?t[o+1]*i:e.length,u=r(e,c,l,i,!1),u===u.next&&(u.steiner=!0),a.push(v(u));for(a.sort(d),o=0;o<a.length;o++)n=f(a[o],n);return n}function d(e,t){return e.x-t.x}function f(e,t){var n=p(e,t);if(!n)return t;var r=ie(n,e);return i(r,r.next),i(n,n.next)}function p(e,t){var n=t,r=e.x,i=e.y,a=-1/0,o;do{if(i<=n.y&&i>=n.next.y&&n.next.y!==n.y){var s=n.x+(i-n.y)*(n.next.x-n.x)/(n.next.y-n.y);if(s<=r&&s>a&&(a=s,o=n.x<n.next.x?n:n.next,s===r))return o}n=n.next}while(n!==t);if(!o)return null;var c=o,l=o.x,u=o.y,d=1/0,f;n=o;do r>=n.x&&n.x>=l&&r!==n.x&&y(i<u?r:a,i,l,u,i<u?a:r,i,n.x,n.y)&&(f=Math.abs(i-n.y)/(r-n.x),ne(n,e)&&(f<d||f===d&&(n.x>o.x||n.x===o.x&&m(o,n)))&&(o=n,d=f)),n=n.next;while(n!==c);return o}function m(e,t){return x(e.prev,e,t.prev)<0&&x(t.next,e,e.next)<0}function h(e,t,n,r){var i=e;do i.z===0&&(i.z=_(i.x,i.y,t,n,r)),i.prevZ=i.prev,i.nextZ=i.next,i=i.next;while(i!==e);i.prevZ.nextZ=null,i.prevZ=null,g(i)}function g(e){var t,n,r,i,a,o,s,c,l=1;do{for(n=e,e=null,a=null,o=0;n;){for(o++,r=n,s=0,t=0;t<l&&(s++,r=r.nextZ,r);t++);for(c=l;s>0||c>0&&r;)s!==0&&(c===0||!r||n.z<=r.z)?(i=n,n=n.nextZ,s--):(i=r,r=r.nextZ,c--),a?a.nextZ=i:e=i,i.prevZ=a,a=i;n=r}a.nextZ=null,l*=2}while(o>1);return e}function _(e,t,n,r,i){return e=(e-n)*i|0,t=(t-r)*i|0,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,e|t<<1}function v(e){var t=e,n=e;do(t.x<n.x||t.x===n.x&&t.y<n.y)&&(n=t),t=t.next;while(t!==e);return n}function y(e,t,n,r,i,a,o,s){return(i-o)*(t-s)>=(e-o)*(a-s)&&(e-o)*(r-s)>=(n-o)*(t-s)&&(n-o)*(a-s)>=(i-o)*(r-s)}function b(e,t){return e.next.i!==t.i&&e.prev.i!==t.i&&!te(e,t)&&(ne(e,t)&&ne(t,e)&&re(e,t)&&(x(e.prev,e,t.prev)||x(e,t.prev,t))||S(e,t)&&x(e.prev,e,e.next)>0&&x(t.prev,t,t.next)>0)}function x(e,t,n){return(t.y-e.y)*(n.x-t.x)-(t.x-e.x)*(n.y-t.y)}function S(e,t){return e.x===t.x&&e.y===t.y}function C(e,t,n,r){var i=ee(x(e,t,n)),a=ee(x(e,t,r)),o=ee(x(n,r,e)),s=ee(x(n,r,t));return!!(i!==a&&o!==s||i===0&&w(e,n,t)||a===0&&w(e,r,t)||o===0&&w(n,e,r)||s===0&&w(n,t,r))}function w(e,t,n){return t.x<=Math.max(e.x,n.x)&&t.x>=Math.min(e.x,n.x)&&t.y<=Math.max(e.y,n.y)&&t.y>=Math.min(e.y,n.y)}function ee(e){return e>0?1:e<0?-1:0}function te(e,t){var n=e;do{if(n.i!==e.i&&n.next.i!==e.i&&n.i!==t.i&&n.next.i!==t.i&&C(n,n.next,e,t))return!0;n=n.next}while(n!==e);return!1}function ne(e,t){return x(e.prev,e,e.next)<0?x(e,t,e.next)>=0&&x(e,e.prev,t)>=0:x(e,t,e.prev)<0||x(e,e.next,t)<0}function re(e,t){var n=e,r=!1,i=(e.x+t.x)/2,a=(e.y+t.y)/2;do n.y>a!=n.next.y>a&&n.next.y!==n.y&&i<(n.next.x-n.x)*(a-n.y)/(n.next.y-n.y)+n.x&&(r=!r),n=n.next;while(n!==e);return r}function ie(e,t){var n=new T(e.i,e.x,e.y),r=new T(t.i,t.x,t.y),i=e.next,a=t.prev;return e.next=t,t.prev=e,n.next=i,i.prev=n,r.next=n,n.prev=r,a.next=r,r.prev=a,r}function ae(e,t,n,r){var i=new T(e,t,n);return r?(i.next=r.next,i.prev=r,r.next.prev=i,r.next=i):(i.prev=i,i.next=i),i}function oe(e){e.next.prev=e.prev,e.prev.next=e.next,e.prevZ&&(e.prevZ.nextZ=e.nextZ),e.nextZ&&(e.nextZ.prevZ=e.prevZ)}function T(e,t,n){this.i=e,this.x=t,this.y=n,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}n.deviation=function(e,t,n,r){var i=t&&t.length,a=i?t[0]*n:e.length,o=Math.abs(se(e,0,a,n));if(i)for(var s=0,c=t.length;s<c;s++){var l=t[s]*n,u=s<c-1?t[s+1]*n:e.length;o-=Math.abs(se(e,l,u,n))}var d=0;for(s=0;s<r.length;s+=3){var f=r[s]*n,p=r[s+1]*n,m=r[s+2]*n;d+=Math.abs((e[f]-e[m])*(e[p+1]-e[f+1])-(e[f]-e[p])*(e[m+1]-e[f+1]))}return o===0&&d===0?0:Math.abs((d-o)/o)};function se(e,t,n,r){for(var i=0,a=t,o=n-r;a<n;a+=r)i+=(e[o]-e[a])*(e[a+1]+e[o+1]),o=a;return i}n.flatten=function(e){for(var t=e[0][0].length,n={vertices:[],holes:[],dimensions:t},r=0,i=0;i<e.length;i++){for(var a=0;a<e[i].length;a++)for(var o=0;o<t;o++)n.vertices.push(e[i][a][o]);i>0&&(r+=e[i-1].length,n.holes.push(r))}return n}}));function sl(e){return Math.max(Math.ceil(e/4)*4,4)}function cl(e,t,n,r=!0){let i=n===3;if(r){e=e.slice();let t=[];for(let r=0;r<e.length;r+=n){t[0]=e[r],t[1]=e[r+1],i&&(t[2]=e[r+2]);let n=Ot(t,!0,{enable:!1,decimal:1});e[r]=n[0],e[r+1]=n[1],i&&(e[r+2]=n[2])}}return(0,ll.default)(e,t,n)}var ll,ul=t((()=>{D(),ll=e(ol())}));function dl(e){if(typeof e==`number`)return e;switch(e){case`center`:return 0;case`top`:return 1;case`top-right`:return 2;case`right`:return 3;case`bottom-right`:return 4;case`bottom`:return 5;case`bottom-left`:return 6;case`left`:return 7;case`top-left`:return 8;case`bottom-center`:return 9;default:return 0}}function fl(e,t){let n=[],r=``;e.forEach(e=>{let i=e.replace(/([a-z])([A-Z])/g,`$1_$2`).toUpperCase(),a=pl+i;t[e]?r+=`#define USE_ATTRIBUTE_${i} 0.0 \n`:n.push(`  ${il[e]} u_${e};`),r+=`
#ifdef USE_ATTRIBUTE_${i}
layout(location = ${a}) in ${il[e]} a_${e.charAt(0).toUpperCase()+e.slice(1)};
#endif \n`});let i=n.length?`
layout(std140) uniform AttributeUniforms {
  ${n.join(`
`)}
};\n`:``;r+=i;let a=``;return e.forEach(e=>{let t=e.replace(/([a-z])([A-Z])/g,`$1_$2`).toUpperCase();a+=`
  #ifdef USE_ATTRIBUTE_${t}
    ${il[e]} ${e} = a_${e.charAt(0).toUpperCase()+e.slice(1)};
  #else
    ${il[e]} ${e} = u_${e};
  #endif
  `}),{"vs:#decl":r,"fs:#decl":i,"vs:#main-start":a}}var pl,N,P=t((()=>{E(),D(),bc(),nl(),tc(),al(),ul(),pl=`ATTRIBUTE_LOCATION_`,N=class{get attributeLocation(){return{...ec}}constructor(e){this.uniformBuffers=[],this.textures=[],this.preStyleAttribute={},this.encodeStyleAttribute={},this.layer=e,this.configService=e.getContainer().globalConfigService,this.rendererService=e.getContainer().rendererService,this.pickingService=e.getContainer().pickingService,this.shaderModuleService=e.getContainer().shaderModuleService,this.styleAttributeService=e.getContainer().styleAttributeService,this.mapService=e.getContainer().mapService,this.iconService=e.getContainer().iconService,this.fontService=e.getContainer().fontService,this.cameraService=e.getContainer().cameraService,this.layerService=e.getContainer().layerService,this.registerStyleAttribute(),this.registerBuiltinAttributes(),this.startModelAnimate();let{createTexture2D:t}=this.rendererService;this.createTexture2D=t}getBlend(){let{blend:e=`normal`}=this.layer.getLayerConfig();return yc[nn[e]]}getStencil(e){let{mask:t=!1,maskInside:n=!0,enableMask:r,maskOperation:i=Xt.AND}=this.layer.getLayerConfig();return this.layer.type===`MaskLayer`?tl({isStencil:!0,stencilType:wt.SINGLE}):e.isStencil?tl({...e,maskOperation:i}):el(t||r&&this.layer.masks.length!==0||this.layer.tileMask!==void 0,n)}getDefaultStyle(){return{}}getUninforms(){let e=this.getCommonUniformsInfo(),t=this.getUniformsBufferInfo(this.getStyleAttribute());this.updateStyleUnifoms();let n={...t.uniformsOption,...e.uniformsOption};return Object.keys(n).forEach(e=>{typeof n[e]==`boolean`&&(n[e]=+!!n[e])}),!this.rendererService.hasOwnProperty(`device`)&&this.textures&&this.textures.length===1&&(n.u_texture=this.textures[0]),n}getAnimateUniforms(){return{}}async needUpdate(){return!1}async buildModels(){throw Error(`Method not implemented.`)}async initModels(){throw Error(`Method not implemented.`)}clearModels(e=!0){}getAttribute(){throw Error(`Method not implemented.`)}prerender(){}render(e){throw Error(`Method not implemented.`)}registerBuiltinAttributes(){throw Error(`Method not implemented.`)}animateOption2Array(e){return[+!e.enable,e.duration||4,e.interval||.2,e.trailLength||.1]}startModelAnimate(){let{animateOption:e}=this.layer.getLayerConfig();e.enable&&this.layer.setAnimateStartTime()}getInject(){return fl(this.layer.enableShaderEncodeStyles,this.layer.encodeStyleAttribute)}getDefines(){return{...Object.keys(this.attributeLocation).reduce((e,t)=>{let n=pl+t;return e[n]=this.attributeLocation[t],e},{})}}getStyleAttribute(){let e={};return this.layer.enableShaderEncodeStyles.forEach(t=>{if(!this.layer.encodeStyleAttribute[t]){let n=this.layer.getLayerConfig()[t],r=n===void 0?rl[t]:n;t===`stroke`&&(r=A(r)),t===`anchor`&&(r=dl(r)),e[`u_`+t]=r}}),e}registerStyleAttribute(){Object.keys(this.layer.encodeStyleAttribute).forEach(e=>{let t=$s(e);t&&this.styleAttributeService.registerStyleAttribute(t)})}registerPosition64LowAttribute(e=!0){this.styleAttributeService.registerStyleAttribute({name:`position64Low`,type:k.Attribute,descriptor:{name:`a_Position64Low`,shaderLocation:this.attributeLocation.POSITION_64LOW,buffer:{data:[],type:m.FLOAT},size:2,update:(t,n,r)=>e?[xn(r[0]),xn(r[1])]:[0,0]}})}updateEncodeAttribute(e,t){this.encodeStyleAttribute[e]=t}initUniformsBuffer(){let e=this.getUniformsBufferInfo(this.getStyleAttribute()),t=this.getCommonUniformsInfo();e.uniformsLength!==0&&(this.attributeUnifoms=this.rendererService.createBuffer({data:new Float32Array(sl(e.uniformsLength)).fill(0),isUBO:!0,label:`layerModelAttributeUnifoms`}),this.uniformBuffers.push(this.attributeUnifoms)),t.uniformsLength!==0&&(this.commonUnifoms=this.rendererService.createBuffer({data:new Float32Array(sl(t.uniformsLength)).fill(0),isUBO:!0,label:`layerModelCommonUnifoms`}),this.uniformBuffers.push(this.commonUnifoms))}getUniformsBufferInfo(e){let t=0,n=[];return Object.values(e).forEach(e=>{Array.isArray(e)?(n.push(...e),t+=e.length):typeof e==`number`?(n.push(e),t+=1):typeof e==`boolean`&&(n.push(Number(e)),t+=1)}),{uniformsOption:e,uniformsLength:t,uniformsArray:n}}getCommonUniformsInfo(){return{uniformsLength:0,uniformsArray:[],uniformsOption:{}}}updateStyleUnifoms(){let{uniformsArray:e}=this.getUniformsBufferInfo(this.getStyleAttribute()),{uniformsArray:t}=this.getCommonUniformsInfo();this.attributeUnifoms?.subData({offset:0,data:new Uint8Array(new Float32Array(e).buffer)}),this.commonUnifoms?.subData({offset:0,data:new Uint8Array(new Float32Array(t).buffer)})}}})),ml,hl,gl,_l,vl,yl=t((()=>{ml=function(e){return e[e.solid=0]=`solid`,e[e.dash=1]=`dash`,e}({}),hl=function(e){return e.VERTICAL=`vertical`,e.HORIZONTAL=`horizontal`,e}({}),gl=function(e){return e.NORMAL=`normal`,e.REPLACE=`replace`,e}({}),_l=function(e){return e[e.pixel=0]=`pixel`,e[e.meter=1]=`meter`,e}({}),vl=function(e){return e.ALWAYS=`always`,e.DRAGEND=`dragend`,e}({})})),bl,xl=t((()=>{bl={canvas2d:`2d`,webgl:`webgl`,webgl2:`webgl2`,webgpu:`webgpu`}})),Sl,Cl=t((()=>{P(),yl(),xl(),Sl=class extends N{constructor(...e){super(...e),this.canvas=null,this.initCanvas=()=>{let{zIndex:e,getContext:t}=this.layerConfig,n=document.createElement(`canvas`),r=this.layer.getModelType();this.canvas=n,n.classList.add(`l7-canvas-layer`),n.style.position=`absolute`,n.style.top=`0`,n.style.left=`0`,n.style.zIndex=String(e),this.resetCanvasSize(),(this.mapService.getCanvasOverlays?.()??this.mapService.getMapCanvasContainer?.())?.appendChild(n),this.ctx=t?t(n):n.getContext(bl[r]),this.ctx||console.error(`Failed to get rendering context for canvas`),this.bindListeners()},this.resetViewportSize=()=>{let{width:e,height:t}=this.rendererService.getViewportSize();this.viewportSize=[e,t]},this.resetCanvasSize=()=>{let e=this.canvas;if(!e)return;this.resetViewportSize();let[t,n]=this.mapService.getSize(),[r,i]=this.viewportSize;e.width=r,e.height=i,e.style.width=t+`px`,e.style.height=n+`px`},this.renderCanvas=()=>{this.canvas||this.initCanvas();let{draw:e,drawingOnCanvas:t}=this.layerConfig,[n,r]=this.viewportSize,i=this.mapService.getBounds();(e??t)?.({canvas:this.canvas,ctx:this.ctx,container:{width:n,height:r,bounds:i},size:[n,r],utils:{lngLatToContainer:this.lngLatToContainer},mapService:this.mapService})},this.removeCanvas=()=>{this.canvas&&=(this.canvas.parentElement?.removeChild(this.canvas),null),this.unbindListeners()},this.onMapResize=()=>{requestAnimationFrame(()=>{this.resetCanvasSize(),this.renderCanvas()})},this.lngLatToContainer=e=>{let{x:t,y:n}=this.mapService.lngLatToContainer(e);return{x:t*window.devicePixelRatio,y:n*window.devicePixelRatio}}}get layerConfig(){return this.layer.getLayerConfig()}async initModels(){return this.renderCanvas(),[]}bindListeners(){this.mapService.on(`resize`,this.onMapResize);let{trigger:e,update:t}=this.layerConfig;t===vl.ALWAYS||e===`change`?this.mapService.on(`mapchange`,this.renderCanvas):(this.mapService.on(`zoomstart`,this.removeCanvas),this.mapService.on(`zoomend`,this.renderCanvas),this.mapService.on(`movestart`,this.removeCanvas),this.mapService.on(`moveend`,this.renderCanvas))}unbindListeners(){this.mapService.off(`resize`,this.onMapResize),this.mapService.off(`mapchange`,this.renderCanvas),this.mapService.off(`zoomstart`,this.removeCanvas),this.mapService.off(`zoomend`,this.renderCanvas),this.mapService.off(`movestart`,this.removeCanvas),this.mapService.off(`moveend`,this.renderCanvas)}registerBuiltinAttributes(){}}})),wl=t((()=>{Cl(),xl()})),Tl,El=t((()=>{$c(),wl(),Tl=class extends Qc{constructor(...e){super(...e),this.type=`CanvasLayer`}getDefaultConfig(){return{zIndex:3,contextType:`canvas2d`,trigger:`change`}}async buildModels(){this.layerModel=new Sl(this),await this.initLayerModels()}getModelType(){return this.getLayerConfig().contextType||`canvas2d`}draw(e){return this.updateLayerConfig({draw:e}),this.render(),this}getLayerConfig(){let e={...this.getDefaultConfig(),...super.getLayerConfig()};return e.zIndex<3&&(e.zIndex=3),e}render(){return this.layerModel?.renderCanvas(),this}getCanvas(){return this.layerModel?.canvas}show(){let e=this.getCanvas();return e&&(e.style.display=`unset`),this}hide(){let e=this.getCanvas();return e&&(e.style.display=`none`),this}destroy(){this.layerModel.removeCanvas(),super.destroy()}}}));function Dl(e){return e/180*Math.acos(-1)}function Ol(e){let t=Dl(e[0])+Math.PI/2,n=Dl(e[1]),r=100+Math.random()*.4,i=r*Math.cos(n)*Math.cos(t);return[r*Math.cos(n)*Math.sin(t),r*Math.sin(n),i]}function kl(e,t){let n=Pn(),r=Pn(),i=Nn(0,1,0),a=Nn(0,0,0);t||={},e=e===void 0?1:e;let o=2+(t.segments===void 0?32:t.segments),s=2*o,c=[],l=[],u=[],d=[],f=[],p=[];for(let t=0;t<=o;t++){let m=t/o,h=m*Math.PI;for(let t=0;t<=s;t++){let o=t/s,c=o*Math.PI*2;Kn(r),Yn(r,r,-h),Kn(n),qn(n,n,c),Wn(a,i,r),Wn(a,a,n),Rn(a,a,-e),u.push(a.slice()),d.push(...a.slice()),Un(a,a),f.push(...a.slice()),p.push([o,1-m]),d.push(o,1-m)}if(t>0){let e=u.length,t=e-2*(s+1);for(;t+s+2<e;t++)c.push([t,t+1,t+s+1]),l.push(t,t+1,t+s+1),c.push([t+s+1,t+1,t+s+2]),l.push(t+s+1,t+1,t+s+2)}}return{cells:c,positions:u,uvs:p,positionsArr:d,indicesArr:l,normalArr:f}}var Al=t((()=>{ir()}));function jl(e,t,n,r,i){nr(e,n,r),Qn(e,e),t=tr(-e[1],e[0]);let a=tr(-n[1],n[0]);return[i/rr(t,a),t]}function Ml(e,t){return ar(e,-t[1],t[0])}function Nl(e,t,n){return or(e,t,n),Qn(e,e),e}function Pl(e,t){return e[0]===t[0]&&e[1]===t[1]}var Fl,Il,Ll,Rl,zl,Bl=t((()=>{D(),ir(),Fl=Xn(),Xn(),Il=Xn(),Ll=Xn(),Rl=Xn(),zl=class{constructor(e={}){this.lastFlip=-1,this.miter=tr(0,0),this.started=!1,this.dash=!1,this.totalDistance=0,this.currentIndex=0,this.join=e.join||`miter`,this.cap=e.cap||`butt`,this.miterLimit=e.miterLimit||10,this.thickness=e.thickness||1,this.dash=e.dash||!1,this.complex={positions:[],indices:[],normals:[],startIndex:0,indexes:[]}}simpleExtrude(e){let t=this.complex;if(e.length<=1)return t;this.lastFlip=-1,this.started=!1,this.normal=null,this.totalDistance=0;let n=e.length,r=t.startIndex;for(let i=1;i<n;i++){let n=e[i-1],a=e[i],o=i<e.length-1?e[i+1]:null,s=this.simpleSegment(t,r,n,a,o);r+=s}if(this.dash)for(let e=0;e<t.positions.length/6;e++)t.positions[e*6+5]=this.totalDistance;return t.startIndex=t.positions.length/6,t}extrude(e){let t=this.complex;if(e.length<=1)return t;this.lastFlip=-1,this.started=!1,this.normal=null,this.totalDistance=0;let n=e.length,r=t.startIndex;for(let i=1;i<n;i++){let n=e[i-1],a=e[i],o=i<e.length-1?e[i+1]:null,s=this.segment(t,r,n,a,o);r+=s}if(this.dash)for(let e=0;e<t.positions.length/6;e++)t.positions[e*6+5]=this.totalDistance;return t.startIndex=t.positions.length/6,t}simpleSegment(e,t,n,r,i){let a=0,o=e.indices,s=e.positions,c=e.normals,l=Vt([r[0],r[1]]),u=Vt([n[0],n[1]]);Nl(Il,l,u);let d=0;if(this.dash&&(d=this.lineSegmentDistance(l,u),this.totalDistance+=d),this.normal||(this.normal=Xn(),Ml(this.normal,Il)),this.started||(this.started=!0,this.extrusions(s,c,n,this.normal,this.thickness,this.totalDistance-d)),o.push(t+0,t+1,t+2),!i)Ml(this.normal,Il),this.extrusions(s,c,r,this.normal,this.thickness,this.totalDistance),o.push(...this.lastFlip===1?[t,t+2,t+3]:[t+2,t+1,t+3]),a+=2;else{let e=Vt([i[0],i[1]]);Pl(l,e)&&nr(e,l,Qn(e,Zn(e,l,u))),Nl(Ll,e,l);let[n,d]=jl(Rl,Xn(),Il,Ll,this.thickness),f=rr(Rl,this.normal)<0?-1:1;this.extrusions(s,c,r,d,n,this.totalDistance),o.push(...this.lastFlip===1?[t,t+2,t+3]:[t+2,t+1,t+3]),f=-1,$n(this.normal,d),a+=2,this.lastFlip=f}return a}segment(e,t,n,r,i){let a=0,o=e.indices,s=e.positions,c=e.normals,l=this.cap===`square`,u=this.join===`bevel`,d=Vt([r[0],r[1]]),f=Vt([n[0],n[1]]);Nl(Il,d,f);let p=0;if(this.dash&&(p=this.lineSegmentDistance(d,f),this.totalDistance+=p),this.normal||(this.normal=Xn(),Ml(this.normal,Il)),!this.started){if(this.started=!0,l){let e=Xn(),t=Xn();nr(e,this.normal,Il),nr(t,this.normal,Il),c.push(t[0],t[1],0),c.push(e[0],e[1],0),s.push(n[0],n[1],n[2]|0,this.totalDistance-p,-this.thickness,n[2]|0),this.complex.indexes.push(this.currentIndex),s.push(n[0],n[1],n[2]|0,this.totalDistance-p,this.thickness,n[2]|0),this.complex.indexes.push(this.currentIndex),this.currentIndex++}else this.extrusions(s,c,n,this.normal,this.thickness,this.totalDistance-p)}if(o.push(t+0,t+1,t+2),i){let e=Vt([i[0],i[1]]);Pl(d,e)&&nr(e,d,Qn(e,Zn(e,d,f))),Nl(Ll,e,d);let[n,l]=jl(Rl,Xn(),Il,Ll,this.thickness),p=rr(Rl,this.normal)<0?-1:1,m=u;!m&&this.join===`miter`&&n>this.miterLimit&&(m=!0),m?(c.push(this.normal[0],this.normal[1],0),c.push(l[0],l[1],0),s.push(r[0],r[1],r[2]|0,this.totalDistance,-this.thickness*p,r[2]|0),this.complex.indexes.push(this.currentIndex),s.push(r[0],r[1],r[2]|0,this.totalDistance,this.thickness*p,r[2]|0),this.complex.indexes.push(this.currentIndex),this.currentIndex++,o.push(...this.lastFlip===-p?[t+2,t+1,t+3]:[t,t+2,t+3]),o.push(t+2,t+3,t+4),Ml(Fl,Ll),$n(this.normal,Fl),c.push(this.normal[0],this.normal[1],0),s.push(r[0],r[1],r[2]|0,this.totalDistance,-this.thickness*p,r[2]|0),this.complex.indexes.push(this.currentIndex),this.currentIndex++,a+=3):(this.extrusions(s,c,r,l,n,this.totalDistance),o.push(...this.lastFlip===1?[t,t+2,t+3]:[t+2,t+1,t+3]),p=-1,$n(this.normal,l),a+=2),this.lastFlip=p}else{if(Ml(this.normal,Il),l){let e=Xn(),t=Xn();or(t,Il,this.normal),nr(e,Il,this.normal),c.push(t[0],t[1],0),c.push(e[0],e[1],0),s.push(r[0],r[1],r[2]|0,this.totalDistance,this.thickness,r[2]|0),this.complex.indexes.push(this.currentIndex),s.push(r[0],r[1],r[2]|0,this.totalDistance,this.thickness,r[2]|0),this.complex.indexes.push(this.currentIndex),this.currentIndex++}else this.extrusions(s,c,r,this.normal,this.thickness,this.totalDistance);o.push(...this.lastFlip===1?[t,t+2,t+3]:[t+2,t+1,t+3]),a+=2}return a}extrusions(e,t,n,r,i,a){t.push(r[0],r[1],0),t.push(r[0],r[1],0);let o=n[2]===void 0?0:n[2];e.push(n[0],n[1],o,a,-i,o),this.complex.indexes.push(this.currentIndex),e.push(n[0],n[1],o,a,i,o),this.complex.indexes.push(this.currentIndex),this.currentIndex++}lineSegmentDistance(e,t){let n=t[0]-e[0],r=t[1]-e[1];return Math.sqrt(n*n+r*r)}}}));function Vl(e,t=0,n=Math.PI/4){let r=Math.PI*2/e,i=[];for(let n=0;n<e;n++)i.push(r*n+t*Math.PI/12);return i.map(e=>[Math.sin(e+n),Math.cos(e+n),0])}function Hl(){return Vl(30)}function Ul(){return Vl(4)}function Wl(){return Vl(3)}function Gl(){return Vl(6,0,0).map(e=>[e[0],-e[1],e[2]])}function Kl(){return Vl(5)}var ql,Jl=t((()=>{ql={circle:Hl,hexagon:Gl,triangle:Wl,square:Ul,pentagon:Kl,cylinder:Hl,hexagonColumn:Gl,triangleColumn:Wl,squareColumn:Ul,pentagonColumn:Kl}}));function Yl(e){let t=e[0][0],n=e[0][e[0].length-1];t[0]===n[0]&&t[1]===n[1]&&(e[0]=e[0].slice(0,e[0].length-1));let r=e[0].length,i=$l.default.flatten(e),{vertices:a,dimensions:o}=i,s=[],c=[];for(let e=0;e<a.length/o;e++)o===2?s.push(a[e*2],a[e*2+1],1):s.push(a[e*3],a[e*3+1],1);let l=(0,$l.default)(i.vertices,i.holes,i.dimensions);c.push(...l);for(let e=0;e<r;e++){let t=i.vertices.slice(e*o,(e+1)*o),n=i.vertices.slice((e+1)*o,(e+2)*o);n.length===0&&(n=i.vertices.slice(0,o));let r=s.length/3;s.push(t[0],t[1],1,n[0],n[1],1,t[0],t[1],0,n[0],n[1],0),c.push(...[0,2,1,2,3,1].map(e=>e+r))}return{positions:s,index:c}}function Xl(e){let t=$l.default.flatten(e),n=(0,$l.default)(t.vertices,t.holes,t.dimensions);return{positions:t.vertices,index:n}}function Zl(e,t=!1){let n=e[0][0],r=e[0][e[0].length-1];n[0]===r[0]&&n[1]===r[1]&&(e[0]=e[0].slice(0,e[0].length-1));let i=e[0].length,a=$l.default.flatten(e),{vertices:o,dimensions:s,holes:c}=a,l=[],u=[],d=[];for(let e=0;e<o.length/s;e++)l.push(o[e*s],o[e*s+1],1,-1,-1),d.push(0,0,1);let f=cl(o,c,s,t);u.push(...f);for(let e=0;e<i;e++){let n=a.vertices.slice(e*s,(e+1)*s),r=a.vertices.slice((e+1)*s,(e+2)*s);r.length===0&&(r=a.vertices.slice(0,s));let i=l.length/5;l.push(n[0],n[1],1,0,0,r[0],r[1],1,.1,0,n[0],n[1],0,0,.8,r[0],r[1],0,.1,.8);let o=Ql([r[0],r[1],1],[n[0],n[1],0],[n[0],n[1],1],t);d.push(...o,...o,...o,...o),u.push(...[1,2,0,3,2,1].map(e=>e+i))}return{positions:l,index:u,normals:d}}function Ql(e,t,n,r=!1){let i=Hn(),a=Hn(),o=Hn();r&&(e=Ot(e),t=Ot(t),n=Ot(n));let s=Nn(...e),c=Nn(...t),l=Nn(...n);Vn(i,l,c),Vn(a,s,c),er(o,i,a);let u=Hn();return Un(u,o),u}var $l,eu=t((()=>{D(),$l=e(ol()),ir(),ul()}));function tu(e){return typeof e==`number`?String(e):Array.isArray(e)?typeof e[0]==`number`?e.slice(0,2).join(`,`):tu(e[0]):``}function nu(e){let t=tu(e);if(t&&Eu[t])return Eu[t].slice();let n=rt(e),r=Object.keys(Eu);if(r.length>=Du){let e=Math.floor(Du/2);for(let t=0;t<e;t++)delete Eu[r[t]]}return t&&(Eu[t]=n.slice()),n}function ru(e){let t=nu(e.coordinates);return{vertices:[...t,...t,...t,...t],indices:[0,1,2,2,3,0],size:t.length}}function iu(e){let t=Ol(rt(e.coordinates));return{vertices:[...t,...t,...t,...t],indices:[0,1,2,2,3,0],size:t.length}}function au(e){let{shape:t}=e,{positions:n,index:r,normals:i}=bu(t,!1);return{vertices:n,indices:r,normals:i,size:5}}function ou(e){let t=this,n=e.id;if(t?.imageFilterMap&&!t.imageFilterMap[n])return{vertices:[],indices:[],size:3};let r=rt(e.coordinates);return{vertices:[...r],indices:[0],size:r.length}}function su(e){let{coordinates:t}=e,n=new zl({dash:!0,join:`bevel`}),r=t;r[0]&&!Array.isArray(r[0][0])&&(r=[t]),r.forEach(e=>{n.extrude(e)});let i=n.complex;return{vertices:i.positions,indices:i.indices,normals:i.normals,indexes:i.indexes,size:6}}function cu(e){let{coordinates:t}=e,n=[];if(!Array.isArray(t[0]))return{vertices:[],indices:[],normals:[],size:6,count:0};let{results:r,totalDistance:i}=du(t);return r.map(e=>{n.push(e[0],e[1],e[2],e[3],0,i)}),{vertices:n,indices:[],normals:[],size:6,count:r.length}}function lu(e,t){let n=t[0]-e[0],r=t[1]-e[1];return Math.sqrt(n*n+r*r)}function uu(e,t){return e.length<3&&e.push(0),t!==void 0&&e.push(t),e}function du(e){let t=e;Array.isArray(t)&&Array.isArray(t[0])&&Array.isArray(t[0][0])&&(t=e.flat());let n=0;if(t.length<2)return{results:t,totalDistance:0};{let e=[],r=uu(t[0],n);e.push(r);for(let r=1;r<t.length-1;r++){let i=lu(Vt(t[r-1]),Vt(t[r]));n+=i;let a=uu(t[r],n);e.push(a),e.push(a)}let i=lu(Vt(t[t.length-2]),Vt(t[t.length-1]));return n+=i,e.push(uu(t[t.length-1],n)),{results:e,totalDistance:n}}}function fu(e){let{coordinates:t}=e,{vertices:n,dimensions:r,holes:i}=Tu.default.flatten(t);return{indices:cl(n,i,r),vertices:n,size:r}}function pu(e){let{indices:t,vertices:n,size:r}=fu(e);return{indices:t,vertices:mu(n),size:r+4}}function mu(e){let t=[],{center:n,radius:r}=hn(e);for(let i=0;i<e.length;i+=2){let a=e[i],o=e[i+1];t.push(a,o,0,...n,r)}return t}function hu(e){let t=e.coordinates,{positions:n,index:r,normals:i}=Zl(t,!0);return{vertices:n,indices:r,normals:i,size:5}}function gu(e){let{shape:t}=e,{positions:n,index:r}=xu(t);return{vertices:n,indices:r,size:3}}function _u(e){let t=e.coordinates;return{vertices:[...t[0],0,0,0,...t[1],0,1,0,...t[2],0,1,1,...t[3],0,0,1],indices:[0,1,2,0,2,3],size:5}}function vu(e,t){let{segmentNumber:n=30}=t,r=e.coordinates,i=[],a=[];for(let e=0;e<n;e++)i.push(e,1,e,r[0][0],r[0][1],r[1][0],r[1][1],e,-1,e,r[0][0],r[0][1],r[1][0],r[1][1]),e!==n-1&&a.push(...[0,1,2,1,3,2].map(t=>e*2+t));return{vertices:i,indices:a,size:7}}function yu(e){let t=e.coordinates;t.length===2&&t.push(0);let n=Su(-1,1),r=Su(1,1),i=Su(-1,-1),a=Su(1,-1);return{vertices:[...t,...n,...t,...i,...t,...a,...t,...r],indices:[0,1,2,3,0,2],size:5}}function bu(e,t=!1){if(Ou&&Ou[e])return Ou[e];let n=Zl([ql[e]?ql[e]():ql.cylinder()],t);return Ou[e]=n,n}function xu(e){let t=[`cylinder`,`triangleColumn`,`hexagonColumn`,`squareColumn`],n=ql[e]?ql[e]():ql.circle();return t.indexOf(e)===-1?Xl([n]):Yl([n])}function Su(e,t){return[(e+1)/2,(t+1)/2]}function Cu(){let{positionsArr:e,indicesArr:t,normalArr:n}=kl(100,{segments:36});return{vertices:e,indices:t,size:5,normals:n}}function wu(){let{positionsArr:e,indicesArr:t,normalArr:n}=kl(140,{segments:36});return{vertices:e,indices:t,size:5,normals:n}}var Tu,Eu,Du,Ou,F=t((()=>{D(),Tu=e(ol()),Al(),Bl(),Jl(),eu(),ul(),Eu={},Du=500,Ou={}})),ku,Au=t((()=>{ku=`precision highp float;
layout(std140) uniform commonUniforms {
  vec4 u_baseColor: [ 1.0, 0, 0, 1.0 ];
  vec4 u_brightColor: [ 1.0, 0, 0, 1.0 ];
  vec4 u_windowColor: [ 1.0, 0, 0, 1.0 ];
  vec4 u_circleSweepColor;
  vec2 u_cityCenter;
  float u_circleSweep;
  float u_cityMinSize;
  float u_circleSweepSpeed;
  float u_opacity: 1.0;
  float u_near: 0;
  float u_far: 1;
  float u_time;
  float u_padding1;
  float u_padding2;
  float u_padding3;
};
in vec4 v_Color;
in vec2 v_texCoord;
in float v_worldDis;
out vec4 outputColor;

#pragma include "picking"
#pragma include "scene_uniforms"

vec3 getWindowColor(float n, float hot, vec3 brightColor, vec3 darkColor) {
    float s = step(hot, n);
    vec3 color = mix(brightColor,vec3(0.9,0.9,1.0),n);

    return mix(darkColor, color, s);
}
float random (vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233)))* 43758.5453123);
}

float LinearizeDepth()
{
    float z = gl_FragCoord.z * 2.0 - 1.0;
    return (2.0 * u_near * u_far) / (u_far + u_near - z * (u_far - u_near));
}

vec3 fog(vec3 color, vec3 fogColor, float depth){
    float fogFactor=clamp(depth,0.0,1.0);
    vec3 output_color=mix(fogColor,color,fogFactor);
    return output_color;
}

float sdRect(vec2 p, vec2 sz) {
  vec2 d = abs(p) - sz;
  float outside = length(max(d, 0.));
  float inside = min(max(d.x, d.y), 0.);
  return outside + inside;
}

void main() {
  outputColor = v_Color;
  vec3 baseColor = u_baseColor.xyz;
  vec3 brightColor = u_brightColor.xyz;
  vec3 windowColor = u_windowColor.xyz;
  float targetColId = 5.;
  float depth = 1.0 - LinearizeDepth() / u_far * u_Zoom;
  vec3 fogColor = vec3(23.0/255.0,31.0/255.0,51.0/255.0);
  if(v_texCoord.x < 0.) { //顶部颜色
       vec3 foggedColor = fog(baseColor.xyz + vec3(0.12*0.9,0.2*0.9,0.3*0.9),fogColor,depth);
       outputColor = vec4( foggedColor, v_Color.w);
  }else { // 侧面颜色
        vec2 st = v_texCoord;
        vec2  UvScale = v_texCoord;
        float tStep = min(0.08,max(0.05* (18.0-u_Zoom),0.02));
        float tStart = 0.25 * tStep;
        float tEnd = 0.75 * tStep;
        float u = mod(UvScale.x, tStep);
        float v = mod(UvScale.y, tStep);
        float ux = floor(UvScale.x/tStep);
        float uy = floor(UvScale.y/tStep);
        float n = random(vec2(ux,uy));
        float lightP = u_time;
        float head = 1.0- step(0.005,st.y);
        /*step3*/
        // 将窗户颜色和墙面颜色区别开来
        float sU = step(tStart, u) - step(tEnd, u);
        float sV = step(tStart, v) - step(tEnd, v);
        vec2 windowSize = vec2(abs(tEnd-tStart),abs(tEnd-tStart));
        float dist = sdRect(vec2(u,v), windowSize);
        float s = sU * sV;

        float curColId = floor(UvScale.x / tStep);
        float sCol = step(targetColId - 0.2, curColId) - step(targetColId + 0.2, curColId);

        float mLightP = mod(lightP, 2.);
        float sRow = step(mLightP - 0.2, st.y) - step(mLightP, st.y);
        if(ux == targetColId){
            n =0.;
        }
        float timeP = min(0.75, abs ( sin(u_time/3.0) ) );
        float hot = smoothstep(1.0,0.0,timeP);
        vec3 color = mix(baseColor, getWindowColor(n,hot,brightColor,windowColor), s);
        //vec3 color = mix(baseColor, getWindowColor(n,hot,brightColor,windowColor), 1.0);
        float sFinal = s * sCol * sRow;
        color += mix(baseColor, brightColor, sFinal*n);
        if (st.y<0.01){
        color = baseColor;
         }
        if(head ==1.0) { // 顶部亮线
            color = brightColor;
        }
        color = color * v_Color.rgb;

        vec3 foggedColor = fog(color,fogColor,depth);

        outputColor = vec4(foggedColor,1.0);
  }


  if(u_circleSweep > 0.0 && v_worldDis < u_cityMinSize) {
    float r = fract(((v_worldDis/u_cityMinSize) - u_time * u_circleSweepSpeed) * 2.0);
    outputColor.rgb += r * r * u_circleSweepColor.rgb;
  }

  outputColor.a *= u_opacity;
  outputColor = filterColor(outputColor);
}
`})),ju,Mu=t((()=>{ju=`precision highp float;

#define ambientRatio 0.5
#define diffuseRatio 0.3
#define specularRatio 0.2

layout(location = ATTRIBUTE_LOCATION_POSITION) in vec3 a_Position;
layout(location = ATTRIBUTE_LOCATION_COLOR) in vec4 a_Color;
layout(location = ATTRIBUTE_LOCATION_SIZE) in float a_Size;
layout(location = ATTRIBUTE_LOCATION_NORMAL) in vec3 a_Normal;
layout(location = ATTRIBUTE_LOCATION_UV) in vec2 a_Uv;

out vec2 v_texCoord;
out vec4 v_Color;
out float v_worldDis;

layout(std140) uniform commonUniforms {
  vec4 u_baseColor: [ 1.0, 0, 0, 1.0 ];
  vec4 u_brightColor: [ 1.0, 0, 0, 1.0 ];
  vec4 u_windowColor: [ 1.0, 0, 0, 1.0 ];
  vec4 u_circleSweepColor;
  vec2 u_cityCenter;
  float u_circleSweep;
  float u_cityMinSize;
  float u_circleSweepSpeed;
  float u_opacity: 1.0;
  float u_near: 0;
  float u_far: 1;
  float u_time;
  float u_padding1;
  float u_padding2;
  float u_padding3;
};
#pragma include "projection"
#pragma include "light"
#pragma include "picking"


void main() {
  vec4 pos = vec4(a_Position.xy, a_Position.z * a_Size, 1.0);
  vec4 project_pos = project_position(pos);

   v_texCoord = a_Uv;

  if(u_circleSweep > 0.0) {
     vec2 lnglatscale = vec2(0.0);
    lnglatscale = (a_Position.xy - u_cityCenter) * vec2(0.0, 0.135);
    v_worldDis = length(a_Position.xy + lnglatscale - u_cityCenter);
  }

  gl_Position = project_common_position_to_clipspace(vec4(project_pos.xyz, 1.0));

  float lightWeight = calc_lighting(pos);
  // v_Color = a_Color;
  v_Color = vec4(a_Color.rgb * lightWeight, a_Color.w);

  setPickingColor(a_PickingColor);
}
`})),Nu,Pu=t((()=>{E(),D(),P(),F(),Au(),Mu(),Nu=class extends N{get attributeLocation(){return Object.assign(super.attributeLocation,{MAX:super.attributeLocation.MAX,SIZE:9,NORMAL:10,UV:11})}getCommonUniformsInfo(){let{opacity:e=1,baseColor:t=`rgb(16,16,16)`,brightColor:n=`rgb(255,176,38)`,windowColor:r=`rgb(30,60,89)`,time:i=0,sweep:a={enable:!1,sweepRadius:1,sweepColor:`rgb(255, 255, 255)`,sweepSpeed:.4,sweepCenter:this.cityCenter}}=this.layer.getLayerConfig(),o={u_baseColor:A(t),u_brightColor:A(n),u_windowColor:A(r),u_circleSweepColor:[...A(a.sweepColor).slice(0,3),1],u_cityCenter:a.sweepCenter||this.cityCenter,u_circleSweep:+!!a.enable,u_cityMinSize:this.cityMinSize*a.sweepRadius,u_circleSweepSpeed:a.sweepSpeed,u_opacity:e,u_near:0,u_far:1,u_time:this.layer.getLayerAnimateTime()||i,u_padding1:0,u_padding2:0,u_padding3:0};return this.getUniformsBufferInfo(o)}calCityGeo(){let e=this.layer.getOriginalExtent(),[t,n,r,i]=e[0]!==0||e[2]!==0?e:this.layer.getSource().extent,a=r-t,o=i-n;this.cityCenter=[(r+t)/2,(i+n)/2],this.cityMinSize=Math.sqrt(a**2+o**2)/4}async initModels(){return this.calCityGeo(),this.initUniformsBuffer(),this.startModelAnimate(),this.buildModels()}async buildModels(){return[await this.layer.buildLayerModel({moduleName:`cityBuilding`,vertexShader:ju,fragmentShader:ku,triangulation:hu,depth:{enable:!0},defines:this.getDefines(),inject:this.getInject(),cull:{enable:!0,face:m.BACK}})]}registerBuiltinAttributes(){this.styleAttributeService.registerStyleAttribute({name:`normal`,type:k.Attribute,descriptor:{name:`a_Normal`,shaderLocation:this.attributeLocation.NORMAL,buffer:{usage:m.STATIC_DRAW,data:[],type:m.FLOAT},size:3,update:(e,t,n,r,i)=>i}}),this.styleAttributeService.registerStyleAttribute({name:`size`,type:k.Attribute,descriptor:{name:`a_Size`,shaderLocation:this.attributeLocation.SIZE,buffer:{usage:m.DYNAMIC_DRAW,data:[],type:m.FLOAT},size:1,update:e=>{let{size:t=10}=e;return Array.isArray(t)?[t[0]]:[t]}}}),this.styleAttributeService.registerStyleAttribute({name:`uv`,type:k.Attribute,descriptor:{name:`a_Uv`,shaderLocation:this.attributeLocation.UV,buffer:{usage:m.DYNAMIC_DRAW,data:[],type:m.FLOAT},size:2,update:(e,t,n)=>[n[3],n[4]]}})}}})),Fu,Iu=t((()=>{$c(),Pu(),Fu=class extends Qc{constructor(...e){super(...e),this.type=`CityBuildingLayer`}async buildModels(){this.layerModel=new Nu(this),await this.initLayerModels()}setLight(e){this.updateLayerConfig({time:e})}getModelType(){return`citybuilding`}}})),Lu,Ru=t((()=>{Lu=`layout(std140) uniform commonUniforms {
  vec2 u_size;
  float u_raisingHeight;
  float u_rotation;
  float u_opacity;
};

uniform sampler2D u_texture;

in vec2 v_uv;
out vec4 outputColor;

#pragma include "picking"
void main() {
  outputColor = texture(SAMPLER_2D(u_texture), vec2(v_uv.x, 1.0 - v_uv.y));
  outputColor.a *= u_opacity;
  outputColor = filterColor(outputColor);
}
`})),zu,Bu=t((()=>{zu=`layout(location = ATTRIBUTE_LOCATION_POSITION) in vec3 a_Position;
layout(location = ATTRIBUTE_LOCATION_EXTRUDE) in vec3 a_Extrude;
layout(location = ATTRIBUTE_LOCATION_UV) in vec2 a_Uv;

layout(std140) uniform commonUniforms {
  vec2 u_size;
  float u_raisingHeight;
  float u_rotation;
  float u_opacity;
};

out vec2 v_uv;

#pragma include "projection"
#pragma include "picking"
#pragma include "rotation_2d"
void main() {
  vec3 extrude = a_Extrude;
  v_uv = a_Uv;
  float raiseHeight = u_raisingHeight;
  if (
    u_CoordinateSystem == COORDINATE_SYSTEM_LNGLAT ||
    u_CoordinateSystem == COORDINATE_SYSTEM_LNGLAT_OFFSET
  ) {
    float mapboxZoomScale = 4.0 / pow(2.0, 21.0 - u_Zoom);
    raiseHeight = u_raisingHeight * mapboxZoomScale;
  }

  // 计算经纬度点位坐标
  vec4 project_pos = project_position(vec4(a_Position.xy, 0.0, 1.0));

  // 计算绕 z 轴旋转后的偏移
  vec2 offsetXY = project_pixel(rotate_matrix(vec2(extrude.x * u_size.x, 0.0), u_rotation));
  // 绕 z 轴旋转
  float x = project_pos.x + offsetXY.x;
  float y = project_pos.y + offsetXY.y;
  // z 轴不参与旋转
  float z = project_pixel(extrude.y * u_size.y + raiseHeight);

  gl_Position = project_common_position_to_clipspace(vec4(x, y, z, 1.0));

  setPickingColor(a_PickingColor);
}
`})),Vu,Hu=t((()=>{E(),P(),Ru(),Bu(),Vu=class extends N{constructor(...e){super(...e),this.radian=0,this.planeGeometryTriangulation=()=>{let{center:e=[120,30]}=this.layer.getLayerConfig();return{size:4,indices:[0,1,2,2,3,0],vertices:[...e,1,1,...e,0,1,...e,0,0,...e,1,0]}}}get attributeLocation(){return Object.assign(super.attributeLocation,{MAX:super.attributeLocation.MAX,EXTRUDE:9,UV:10})}getUninforms(){let e=this.getCommonUniformsInfo(),t=this.getUniformsBufferInfo(this.getStyleAttribute());return this.updateStyleUnifoms(),{...e.uniformsOption,...t.uniformsOption}}getCommonUniformsInfo(){let{opacity:e,width:t=1,height:n=1,raisingHeight:r=0}=this.layer.getLayerConfig(),i=1;this.mapService.getType()===`amap`&&(i=-1),this.radian=i*Math.PI*(this.mapService.getRotation()%360)/180;let a={u_size:[t,n],u_raisingHeight:Number(r),u_rotation:this.radian,u_opacity:e||1,u_texture:this.texture};return this.textures=[this.texture],this.getUniformsBufferInfo(a)}clearModels(){this.texture?.destroy()}async initModels(){let{drawCanvas:e}=this.layer.getLayerConfig(),{createTexture2D:t}=this.rendererService;return this.texture=t({height:0,width:0}),e&&this.updateTexture(e),this.initUniformsBuffer(),[await this.layer.buildLayerModel({moduleName:`geometryBillboard`,vertexShader:zu,fragmentShader:Lu,triangulation:this.planeGeometryTriangulation,defines:this.getDefines(),inject:this.getInject(),primitive:m.TRIANGLES,depth:{enable:!0}})]}async buildModels(){return this.initModels()}updateTexture(e){let{createTexture2D:t}=this.rendererService,{canvasWidth:n=1,canvasHeight:r=1}=this.layer.getLayerConfig(),i=document.createElement(`canvas`);i.width=n,i.height=r,i.getContext(`2d`)&&(e(i),this.texture=t({data:i,width:i.width,height:i.height,wrapS:m.CLAMP_TO_EDGE,wrapT:m.CLAMP_TO_EDGE}),this.layerService.reRender())}registerBuiltinAttributes(){this.styleAttributeService.registerStyleAttribute({name:`extrude`,type:k.Attribute,descriptor:{name:`a_Extrude`,shaderLocation:this.attributeLocation.EXTRUDE,buffer:{usage:m.DYNAMIC_DRAW,data:[],type:m.FLOAT},size:3,update:(e,t,n,r)=>{let i=[1,1,0,-1,1,0,-1,-1,0,1,-1,0],a=r%4*3;return[i[a],i[a+1],i[a+2]]}}}),this.styleAttributeService.registerStyleAttribute({name:`uv`,type:k.Attribute,descriptor:{name:`a_Uv`,shaderLocation:this.attributeLocation.UV,buffer:{usage:m.DYNAMIC_DRAW,data:[],type:m.FLOAT},size:2,update:(e,t,n)=>[n[2],n[3]]}})}}})),Uu,Wu=t((()=>{Uu=`uniform sampler2D u_texture;
layout(std140) uniform commonUniforms {
  float u_opacity;
  float u_mapFlag;
  float u_terrainClipHeight;
};

in vec3 v_Color;
in vec2 v_uv;
in float v_clip;
out vec4 outputColor;

#pragma include "picking"
void main() {
  if (u_mapFlag > 0.0) {
    outputColor = texture(SAMPLER_2D(u_texture), vec2(v_uv.x, 1.0 - v_uv.y));
    outputColor.a *= u_opacity;
  } else {
    outputColor = vec4(v_Color, u_opacity);
  }
  outputColor.a *= v_clip;
  outputColor = filterColor(outputColor);
}
`})),Gu,Ku=t((()=>{Gu=`layout(location = ATTRIBUTE_LOCATION_POSITION) in vec3 a_Position;
layout(location = ATTRIBUTE_LOCATION_COLOR) in vec3 a_Color;
layout(location = ATTRIBUTE_LOCATION_UV) in vec2 a_Uv;

layout(std140) uniform commonUniforms {
  float u_opacity;
  float u_mapFlag;
  float u_terrainClipHeight;
};

out vec3 v_Color;
out vec2 v_uv;
out float v_clip;

#pragma include "projection"
#pragma include "picking"
void main() {
  v_Color = a_Color;
  v_uv = a_Uv;

  vec4 project_pos = project_position(vec4(a_Position, 1.0));

  v_clip = 1.0;
  if (a_Position.z < u_terrainClipHeight) {
    v_clip = 0.0;
  }

  gl_Position = project_common_position_to_clipspace(vec4(project_pos.xy, a_Position.z, 1.0));

  setPickingColor(a_PickingColor);
}
`})),qu,Ju=t((()=>{E(),P(),Wu(),Ku(),qu=class extends N{constructor(...e){super(...e),this.terrainImageLoaded=!1,this.planeGeometryTriangulation=()=>{let{width:e=1,height:t=1,widthSegments:n=1,heightSegments:r=1,center:i=[120,30],terrainTexture:a,rgb2height:o=(e,t,n)=>e+t+n}=this.layer.getLayerConfig(),{indices:s,positions:c}=this.initPlane(e,t,n,r,...i);return a?this.translateVertex(c,s,this.terrainImage,n,r,o):{vertices:c,indices:s,size:5}}}get attributeLocation(){return Object.assign(super.attributeLocation,{MAX:super.attributeLocation.MAX,UV:10})}initPlane(e=1,t=1,n=1,r=1,i=120,a=30){let o=e/2,s=t/2,c=Math.floor(n),l=Math.floor(r),u=c+1,d=l+1,f=e/c,p=t/l,m=[],h=[];for(let e=0;e<d;e++){let t=e*p-s;for(let n=0;n<u;n++){let r=n*f-o;h.push(r+i,-t+a,0),h.push(n/c),h.push(1-e/l)}}for(let e=0;e<l;e++)for(let t=0;t<c;t++){let n=t+u*e,r=t+u*(e+1),i=t+1+u*(e+1),a=t+1+u*e;m.push(n,r,a),m.push(r,i,a)}return{indices:m,positions:h}}getUninforms(){let e=this.getCommonUniformsInfo(),t=this.getUniformsBufferInfo(this.getStyleAttribute());return this.updateStyleUnifoms(),{...e.uniformsOption,...t.uniformsOption}}getCommonUniformsInfo(){let{opacity:e,mapTexture:t,terrainClipHeight:n=0,terrainTexture:r}=this.layer.getLayerConfig();this.mapTexture!==t&&(this.mapTexture=t,this.texture?.destroy(),this.updateTexture(t));let i={u_opacity:e||1,u_mapFlag:+!!t,u_terrainClipHeight:r?n:-1,u_texture:this.texture};return this.textures=[this.texture],this.getUniformsBufferInfo(i)}clearModels(){this.terrainImage=null,this.texture?.destroy(),this.textures=[]}async initModels(){let{mapTexture:e,terrainTexture:t}=this.layer.getLayerConfig();this.mapTexture=e;let{createTexture2D:n}=this.rendererService;return this.texture=n({height:0,width:0}),this.updateTexture(e),this.initUniformsBuffer(),t&&(this.terrainImage=await this.loadTerrainImage(t)),[await this.layer.buildLayerModel({moduleName:`geometryPlane`,vertexShader:Gu,fragmentShader:Uu,triangulation:this.planeGeometryTriangulation,defines:this.getDefines(),inject:this.getInject(),primitive:m.TRIANGLES,depth:{enable:!0},cull:{enable:!0,face:m.BACK}})]}async buildModels(){return this.initModels()}createModelData(e){if(e){let{widthSegments:t,heightSegments:n,width:r,height:i}=this.layer.getLayerConfig(),{widthSegments:a,heightSegments:o,width:s,height:c}=e;this.layer.style({widthSegments:a===void 0?t:a,heightSegments:o===void 0?n:o,width:s===void 0?r:s,height:c===void 0?i:c})}let t=this.layer.getEncodedData();return this.styleAttributeService.createAttributesAndIndices(t,this.planeGeometryTriangulation)}updateTexture(e){let{createTexture2D:t}=this.rendererService;if(e){let n=new Image;n.crossOrigin=`anonymous`,n.onload=()=>{this.texture=t({data:n,width:n.width,height:n.height,wrapS:m.CLAMP_TO_EDGE,wrapT:m.CLAMP_TO_EDGE}),this.layerService.reRender()},n.src=e}else this.texture=t({width:0,height:0})}getImageData(e){let t=document.createElement(`canvas`),n=t.getContext(`2d`),{width:r,height:i}=e;return t.width=r,t.height=i,n.drawImage(e,0,0,r,i),n.getImageData(0,0,r,i)}translateVertex(e,t,n,r,i,a){let o=n.width,s=n.height,c=this.getImageData(n).data,l=Math.floor(r),u=Math.floor(i),d=l+1,f=u+1,p=o/l,m=s/u;for(let t=0;t<f;t++){let n=Math.floor(t*m)*o;for(let r=0;r<d;r++){let i=(n+Math.floor(r*p))*4,o=c[i],s=c[i+1],l=c[i+2],u=(t*d+r)*5+2;e[u]=a(o,s,l)}}return{vertices:e,indices:t,size:5}}async loadTerrainImage(e){if(this.terrainImage)return this.terrainImageLoaded?this.terrainImage:new Promise(e=>{this.terrainImage.onload=()=>{e(this.terrainImage)}});{let t=new Image;return t.crossOrigin=`anonymous`,new Promise(n=>{t.onload=()=>{this.terrainImageLoaded=!0,n(t),setTimeout(()=>this.layer.emit(`terrainImageLoaded`,null))},t.src=e})}}registerBuiltinAttributes(){this.styleAttributeService.registerStyleAttribute({name:`uv`,type:k.Attribute,descriptor:{name:`a_Uv`,shaderLocation:this.attributeLocation.UV,buffer:{usage:m.DYNAMIC_DRAW,data:[],type:m.FLOAT},size:2,update:(e,t,n)=>[n[3],n[4]]}})}}})),Yu,Xu=t((()=>{Yu=`layout(std140) uniform commonUniforms {
  float u_opacity;
  float u_mapFlag;
  float u_Scale;
};
uniform sampler2D u_texture;

in vec3 v_Color;
in float v_d;
out vec4 outputColor;

void main() {
  if (v_d < 0.0) {
    discard;
  }

  if (u_mapFlag > 0.0) {
    outputColor = texture(SAMPLER_2D(u_texture), gl_PointCoord);
    outputColor.a *= u_opacity;
  } else {
    outputColor = vec4(v_Color, u_opacity);
  }
}
`})),Zu,Qu=t((()=>{Zu=`layout(location = ATTRIBUTE_LOCATION_POSITION) in vec3 a_Position;
layout(location = ATTRIBUTE_LOCATION_COLOR) in vec3 a_Color;

layout(std140) uniform commonUniforms {
  float u_opacity;
  float u_mapFlag;
  float u_Scale;
};

out vec3 v_Color;
out float v_d;

#pragma include "projection"
void main() {
  v_Color = a_Color.xyz;
  v_d = a_Position.z;

  vec4 project_pos = project_position(vec4(a_Position, 1.0));
  gl_Position = project_common_position_to_clipspace(vec4(project_pos.xy, a_Position.z, 1.0));
  gl_PointSize = pow(u_Zoom - 1.0, 2.0) * u_Scale;
}
`})),$u,ed=t((()=>{E(),P(),Xu(),Qu(),$u=class extends N{constructor(...e){super(...e),this.planeGeometryUpdateTriangulation=()=>{let{spriteBottom:e=-10}=this.layer.getLayerConfig(),t=this.spriteUpdate,n=e,r=this.spriteTop;for(let e=0;e<this.positions.length;e+=5)this.spriteAnimate===`up`?(this.positions[e+2]+=t,this.positions[e+2]>r&&(this.positions[e+2]=n)):(this.positions[e+2]-=t,this.positions[e+2]<n&&(this.positions[e+2]=r));return{vertices:this.positions,indices:this.indices,size:5}},this.updatePosition=()=>{this.planeGeometryUpdateTriangulation();let e=this.styleAttributeService.getLayerStyleAttribute(`position`)?.vertexAttribute;if(e){let t=[];for(let e=0;e<this.positions.length;e+=5)t.push(this.positions[e],this.positions[e+1],this.positions[e+2]);e.updateBuffer({data:t,offset:0})}this.layerService.throttleRenderLayers(),this.timer=requestAnimationFrame(this.updatePosition)},this.planeGeometryTriangulation=()=>{let{center:e=[120,30],spriteCount:t=100,spriteRadius:n=10}=this.layer.getLayerConfig(),{indices:r,positions:i}=this.initSprite(n,t,...e);return this.positions=i,this.indices=r,{vertices:i,indices:r,size:5}}}initSprite(e=10,t=100,n=120,r=30){let i=[],a=[],o=this.spriteAnimate===`up`?-this.spriteTop:this.spriteTop;for(let e=0;e<t;e++){let e=Math.random()*o;a.push(...s(e))}for(let e=0;e<t;e++)i.push(e);function s(t){let i=e*Math.random(),a=e*Math.random(),o=-e/2+i,s=-e/2+a;return[o+n,-s+r,t,0,0]}return{indices:i,positions:a}}getUninforms(){let e=this.getCommonUniformsInfo(),t=this.getUniformsBufferInfo(this.getStyleAttribute());return this.updateStyleUnifoms(),{...e.uniformsOption,...t.uniformsOption}}getCommonUniformsInfo(){let{opacity:e,mapTexture:t,spriteScale:n=1}=this.layer.getLayerConfig();this.mapTexture!==t&&(this.mapTexture=t,this.texture?.destroy(),this.textures=[],this.updateTexture(t));let r={u_opacity:e||1,u_mapFlag:+!!t,u_Scale:n,u_texture:this.texture};return this.textures=[this.texture],this.getUniformsBufferInfo(r)}clearModels(){cancelAnimationFrame(this.timer),this.texture?.destroy(),this.textures=[]}async initModels(){let{mapTexture:e,spriteTop:t=300,spriteUpdate:n=10,spriteAnimate:r=`down`}=this.layer.getLayerConfig();this.initUniformsBuffer(),this.mapTexture=e,this.spriteTop=t,this.spriteUpdate=n,this.spriteAnimate=r===`up`?`up`:`down`;let{createTexture2D:i}=this.rendererService;return this.texture=i({height:0,width:0}),this.updateTexture(e),setTimeout(()=>{this.updatePosition()},100),[await this.layer.buildLayerModel({moduleName:`geometrySprite`,vertexShader:Zu,fragmentShader:Yu,triangulation:this.planeGeometryTriangulation,defines:this.getDefines(),inject:this.getInject(),primitive:m.POINTS,depth:{enable:!1},blend:this.getBlend()})]}async buildModels(){return this.initModels()}updateTexture(e){let{createTexture2D:t}=this.rendererService;if(e){let n=new Image;n.crossOrigin=`anonymous`,n.onload=()=>{this.texture=t({data:n,width:n.width,height:n.height,wrapS:m.CLAMP_TO_EDGE,wrapT:m.CLAMP_TO_EDGE}),this.layerService.reRender()},n.src=e}else this.texture=t({width:1,height:1})}registerBuiltinAttributes(){return``}}})),td,nd=t((()=>{Hu(),Ju(),ed(),td={plane:qu,sprite:$u,billboard:Vu}})),rd,id=t((()=>{$c(),nd(),rd=class extends Qc{constructor(...e){super(...e),this.type=`GeometryLayer`,this.defaultSourceConfig={data:[{x:0,y:0}],options:{parser:{type:`json`,x:`x`,y:`y`}}}}async buildModels(){let e=this.getModelType();this.layerModel=new td[e](this),await this.initLayerModels()}getDefaultConfig(){return{plane:{},sprite:{},billboard:{}}[this.getModelType()]}getModelType(){let e=this.shapeOption?.field;return e===`plane`?`plane`:e===`sprite`?`sprite`:e===`billboard`?`billboard`:`plane`}}}));function ad(e,t){return{type:e.type,field:`value`,items:e.positions.map((n,r)=>({[t]:r>=e.colors.length?null:e.colors[r],value:n}))}}var od=t((()=>{})),sd,cd=t((()=>{sd=`in vec4 v_color;

#pragma include "scene_uniforms"
#pragma include "picking"
out vec4 outputColor;
void main() {
  outputColor = v_color;
  outputColor = filterColor(outputColor);
}
`})),ld,ud=t((()=>{ld=`layout(location = ATTRIBUTE_LOCATION_POSITION) in vec3 a_Position;
layout(location = ATTRIBUTE_LOCATION_COLOR) in vec4 a_Color;
layout(location =  ATTRIBUTE_LOCATION_POS) in vec3 a_Pos;

layout(std140) uniform commonUniforms {
    vec2 u_radius;
    float u_opacity;
    float u_coverage;
    float u_angle;
};

out vec4 v_color;

#pragma include "projection"
#pragma include "project"
#pragma include "picking"

void main() {
  v_color = a_Color;
  v_color.a *= u_opacity;

  mat2 rotationMatrix = mat2(cos(u_angle), sin(u_angle), -sin(u_angle), cos(u_angle));
  vec2 offset = a_Position.xy * u_radius * rotationMatrix * u_coverage;

  vec2 lnglat = unProjectFlat(a_Pos.xy + offset);
  vec4 project_pos = project_position(vec4(lnglat, 0, 1.0));
  gl_Position = project_common_position_to_clipspace(project_pos);

  setPickingColor(a_PickingColor);
}
`})),dd,fd=t((()=>{E(),P(),F(),cd(),ud(),dd=class extends N{get attributeLocation(){return Object.assign(super.attributeLocation,{MAX:super.attributeLocation.MAX,POS:9})}getUninforms(){let e=this.getCommonUniformsInfo(),t=this.getUniformsBufferInfo(this.getStyleAttribute());return this.updateStyleUnifoms(),{...e.uniformsOption,...t.uniformsOption}}getCommonUniformsInfo(){let{opacity:e,coverage:t,angle:n}=this.layer.getLayerConfig(),r={u_radius:[this.layer.getSource().data.xOffset,this.layer.getSource().data.yOffset],u_opacity:e||1,u_coverage:t||.9,u_angle:n||0};return this.getUniformsBufferInfo(r)}async initModels(){return this.buildModels()}async buildModels(){return this.initUniformsBuffer(),[await this.layer.buildLayerModel({moduleName:`heatmapGrid`,vertexShader:ld,fragmentShader:sd,defines:this.getDefines(),triangulation:gu,primitive:m.TRIANGLES,depth:{enable:!1}})]}registerBuiltinAttributes(){this.styleAttributeService.registerStyleAttribute({name:`pos`,type:k.Attribute,descriptor:{shaderLocation:this.attributeLocation.POS,name:`a_Pos`,buffer:{usage:m.DYNAMIC_DRAW,data:[],type:m.FLOAT},size:3,update:e=>{let t=e.coordinates;return[t[0],t[1],0]}}})}}})),pd,md=t((()=>{pd=`in vec4 v_color;

layout(std140) uniform commonUniforms {
  vec2 u_radius;
  float u_opacity;
  float u_coverage;
  float u_angle;
};

#pragma include "scene_uniforms"
#pragma include "picking"

out vec4 outputColor;
void main() {
  outputColor = v_color;
  outputColor = filterColor(outputColor);
}
`})),hd,gd=t((()=>{hd=`layout(location = ATTRIBUTE_LOCATION_POSITION) in vec3 a_Position;
layout(location = ATTRIBUTE_LOCATION_COLOR) in vec4 a_Color;
layout(location = ATTRIBUTE_LOCATION_SIZE) in float a_Size;
layout(location = ATTRIBUTE_LOCATION_POS) in vec3 a_Pos;
layout(location = ATTRIBUTE_LOCATION_NORMAL) in vec3 a_Normal;

layout(std140) uniform commonUniforms {
  vec2 u_radius;
  float u_opacity;
  float u_coverage;
  float u_angle;
};

out vec4 v_color;

#pragma include "projection"
#pragma include "project"
#pragma include "light"
#pragma include "picking"

void main() {
  mat2 rotationMatrix = mat2(cos(u_angle), sin(u_angle), -sin(u_angle), cos(u_angle));
  vec2 offset = vec2(a_Position.xy * u_radius * rotationMatrix * u_coverage);

  vec2 lnglat = unProjectFlat(a_Pos.xy + offset); // 实际的经纬度
  vec4 project_pos = project_position(vec4(lnglat, a_Position.z * a_Size, 1.0));

  float lightWeight = calc_lighting(project_pos);
  v_color = vec4(a_Color.rgb * lightWeight, a_Color.w);

  gl_Position = project_common_position_to_clipspace(project_pos);

  setPickingColor(a_PickingColor);
}
`})),_d,vd=t((()=>{E(),P(),F(),md(),gd(),_d=class extends N{get attributeLocation(){return Object.assign(super.attributeLocation,{MAX:super.attributeLocation.MAX,SIZE:9,POS:10,NORMAL:11})}getUninforms(){let e=this.getCommonUniformsInfo(),t=this.getUniformsBufferInfo(this.getStyleAttribute());return this.updateStyleUnifoms(),{...e.uniformsOption,...t.uniformsOption}}getCommonUniformsInfo(){let{opacity:e,coverage:t,angle:n}=this.layer.getLayerConfig(),r={u_radius:[this.layer.getSource().data.xOffset,this.layer.getSource().data.yOffset],u_opacity:e||1,u_coverage:t||.9,u_angle:n||0};return this.getUniformsBufferInfo(r)}async initModels(){return this.buildModels()}async buildModels(){return this.initUniformsBuffer(),[await this.layer.buildLayerModel({moduleName:`heatmapGrid3d`,vertexShader:hd,fragmentShader:pd,defines:this.getDefines(),triangulation:au,primitive:m.TRIANGLES,depth:{enable:!0}})]}registerBuiltinAttributes(){this.styleAttributeService.registerStyleAttribute({name:`size`,type:k.Attribute,descriptor:{shaderLocation:this.attributeLocation.SIZE,name:`a_Size`,buffer:{usage:m.DYNAMIC_DRAW,data:[],type:m.FLOAT},size:1,update:e=>{let{size:t}=e;return Array.isArray(t)?[t[0]]:[t]}}}),this.styleAttributeService.registerStyleAttribute({name:`normal`,type:k.Attribute,descriptor:{name:`a_Normal`,shaderLocation:this.attributeLocation.NORMAL,buffer:{usage:m.STATIC_DRAW,data:[],type:m.FLOAT},size:3,update:(e,t,n,r,i)=>i}}),this.styleAttributeService.registerStyleAttribute({name:`pos`,type:k.Attribute,descriptor:{name:`a_Pos`,shaderLocation:this.attributeLocation.POS,buffer:{usage:m.DYNAMIC_DRAW,data:[],type:m.FLOAT},size:3,update:e=>{let t=e.coordinates;return[t[0],t[1],0]}}})}}})),yd,bd=t((()=>{yd=`layout(std140) uniform commonUniforms {
  mat4 u_ViewProjectionMatrixUncentered;
  mat4 u_InverseViewProjectionMatrix;
  float u_opacity;
  float u_common_uniforms_padding1;
  float u_common_uniforms_padding2;
  float u_common_uniforms_padding3;
};

uniform sampler2D u_texture;
uniform sampler2D u_colorTexture;

in vec2 v_texCoord;
in float v_intensity;
out vec4 outputColor;

void main() {
  float intensity = texture(SAMPLER_2D(u_texture), v_texCoord).r;
  vec4 color = texture(SAMPLER_2D(u_colorTexture), vec2(intensity, 0));
  outputColor = color;
  // gl_FragColor.a = color.a * smoothstep(0.1,0.2,intensity)* u_opacity;
  outputColor.a = color.a * smoothstep(0.0, 0.1, intensity) * u_opacity;
}
`})),xd,Sd=t((()=>{xd=`layout(location = 0) in vec3 a_Position;
layout(location = 10) in vec2 a_Uv;

layout(std140) uniform commonUniforms {
  mat4 u_ViewProjectionMatrixUncentered;
  mat4 u_InverseViewProjectionMatrix;
  float u_opacity;
  float u_common_uniforms_padding1;
  float u_common_uniforms_padding2;
  float u_common_uniforms_padding3;
};

uniform sampler2D u_texture;
uniform sampler2D u_colorTexture;

out vec2 v_texCoord;
out float v_intensity;

vec2 toBezier(float t, vec2 P0, vec2 P1, vec2 P2, vec2 P3) {
  float t2 = t * t;
  float one_minus_t = 1.0 - t;
  float one_minus_t2 = one_minus_t * one_minus_t;
  return P0 * one_minus_t2 * one_minus_t +
  P1 * 3.0 * t * one_minus_t2 +
  P2 * 3.0 * t2 * one_minus_t +
  P3 * t2 * t;
}
vec2 toBezier(float t, vec4 p) {
  return toBezier(t, vec2(0.0, 0.0), vec2(p.x, p.y), vec2(p.z, p.w), vec2(1.0, 1.0));
}

#pragma include "projection"
#pragma include "project"

void main() {
  v_texCoord = a_Uv;

  vec2 pos = a_Uv * vec2(2.0) - vec2(1.0); // 将原本 0 -> 1 的 uv 转换为 -1 -> 1 的标准坐标空间（NDC）

  vec4 p1 = vec4(pos, 0.0, 1.0); // x/y 平面上的点（z == 0）可以认为是三维上的点被投影到平面后的点
  vec4 p2 = vec4(pos, 1.0, 1.0); // 平行于x/y平面、z==1 的平面上的点

  vec4 inverseP1 = u_InverseViewProjectionMatrix * p1; // 根据视图投影矩阵的逆矩阵平面上的反算出三维空间中的点（p1平面上的点）
  vec4 inverseP2 = u_InverseViewProjectionMatrix * p2;

  inverseP1 = inverseP1 / inverseP1.w; // 归一化操作（归一化后为世界坐标）
  inverseP2 = inverseP2 / inverseP2.w;

  float zPos = (0.0 - inverseP1.z) / (inverseP2.z - inverseP1.z); // ??
  vec4 position = inverseP1 + zPos * (inverseP2 - inverseP1);

  vec4 b = vec4(0.5, 0.0, 1.0, 0.5);
  float fh;

  v_intensity = texture(SAMPLER_2D(u_texture), v_texCoord).r;
  fh = toBezier(v_intensity, b).y;
  gl_Position = u_ViewProjectionMatrixUncentered * vec4(position.xy, fh * project_pixel(50.0), 1.0);

}
`})),Cd,wd=t((()=>{Cd=`uniform sampler2D u_texture; // 热力强度图
uniform sampler2D u_colorTexture; // 根据强度分布的色带

layout(std140) uniform commonUniforms {
  float u_opacity;
  float u_common_uniforms_padding1;
  float u_common_uniforms_padding2;
  float u_common_uniforms_padding3;
};
in vec2 v_texCoord;
out vec4 outputColor;

#pragma include "scene_uniforms"

float getBlurIndusty() {
  float vW = 2.0 / u_ViewportSize.x;
  float vH = 2.0 / u_ViewportSize.y;
  vec2 vUv = v_texCoord;
  float i11 = texture(SAMPLER_2D(u_texture), vec2(vUv.x - 1.0 * vW, vUv.y + 1.0 * vH)).r;
  float i12 = texture(SAMPLER_2D(u_texture), vec2(vUv.x - 0.0 * vW, vUv.y + 1.0 * vH)).r;
  float i13 = texture(SAMPLER_2D(u_texture), vec2(vUv.x + 1.0 * vW, vUv.y + 1.0 * vH)).r;

  float i21 = texture(SAMPLER_2D(u_texture), vec2(vUv.x - 1.0 * vW, vUv.y)).r;
  float i22 = texture(SAMPLER_2D(u_texture), vec2(vUv.x, vUv.y)).r;
  float i23 = texture(SAMPLER_2D(u_texture), vec2(vUv.x + 1.0 * vW, vUv.y)).r;

  float i31 = texture(SAMPLER_2D(u_texture), vec2(vUv.x - 1.0 * vW, vUv.y - 1.0 * vH)).r;
  float i32 = texture(SAMPLER_2D(u_texture), vec2(vUv.x - 0.0 * vW, vUv.y - 1.0 * vH)).r;
  float i33 = texture(SAMPLER_2D(u_texture), vec2(vUv.x + 1.0 * vW, vUv.y - 1.0 * vH)).r;

  return (i11 + i12 + i13 + i21 + i21 + i22 + i23 + i31 + i32 + i33) / 9.0;
}

void main() {
  // float intensity = texture(u_texture, v_texCoord).r;
  float intensity = getBlurIndusty();
  vec4 color = texture(SAMPLER_2D(u_colorTexture), vec2(intensity, 0.0));
  outputColor = color;
  outputColor.a = color.a * smoothstep(0.0, 0.1, intensity) * u_opacity;
}
`})),Td,Ed=t((()=>{Td=`layout(location = 0) in vec3 a_Position;
layout(location = 10) in vec2 a_Uv;

layout(std140) uniform commonUniforms {
  float u_opacity;
  float u_common_uniforms_padding1;
  float u_common_uniforms_padding2;
  float u_common_uniforms_padding3;
};

#pragma include "scene_uniforms"

out vec2 v_texCoord;
void main() {
  v_texCoord = a_Uv;
  #ifdef VIEWPORT_ORIGIN_TL
  v_texCoord.y = 1.0 - v_texCoord.y;
  #endif

  gl_Position = vec4(a_Position.xy, 0, 1.0);
}
`})),Dd,Od=t((()=>{Dd=`layout(std140) uniform commonUniforms {
  float u_radius;
  float u_intensity;
  float u_common_uniforms_padding1;
  float u_common_uniforms_padding2;
};

in vec2 v_extrude;
in float v_weight;
out vec4 outputColor;
#define GAUSS_COEF (0.3989422804014327)

void main() {
  float d = -0.5 * 3.0 * 3.0 * dot(v_extrude, v_extrude);
  float val = v_weight * u_intensity * GAUSS_COEF * exp(d);
  outputColor = vec4(val, 1.0, 1.0, 1.0);
}
`})),kd,Ad=t((()=>{kd=`layout(location = ATTRIBUTE_LOCATION_POSITION) in vec3 a_Position;
layout(location = ATTRIBUTE_LOCATION_SIZE) in float a_Size;
layout(location = ATTRIBUTE_LOCATION_DIR) in vec2 a_Dir;

layout(std140) uniform commonUniforms {
  float u_radius;
  float u_intensity;
  float u_common_uniforms_padding1;
  float u_common_uniforms_padding2;
};

out vec2 v_extrude;
out float v_weight;

#define GAUSS_COEF (0.3989422804014327)

#pragma include "projection"
#pragma include "picking"

void main() {
  vec3 picking_color_placeholder = u_PickingColor;

  v_weight = a_Size;
  float ZERO = 1.0 / 255.0 / 16.0;
  float extrude_x = a_Dir.x * 2.0 - 1.0;
  float extrude_y = a_Dir.y * 2.0 - 1.0;
  vec2 extrude_dir = normalize(vec2(extrude_x, extrude_y));
  float S = sqrt(-2.0 * log(ZERO / a_Size / u_intensity / GAUSS_COEF)) / 2.5;
  v_extrude = extrude_dir * S;

  vec2 offset = project_pixel(v_extrude * u_radius);
  vec4 project_pos = project_position(vec4(a_Position.xy, 0.0, 1.0));

  gl_Position = project_common_position_to_clipspace(vec4(project_pos.xy + offset, 0.0, 1.0));

}
`}));function jd(e,t){let n=[],r=[],i=[],a=e+1,o=t+1,s=e/2,c=t/2;for(let n=0;n<o;n++){let o=n-c;for(let l=0;l<a;l++){let a=l-s;r.push(a/s,-o/c,0),i.push(l/e),i.push(1-n/t)}}for(let r=0;r<t;r++)for(let t=0;t<e;t++){let e=t+a*r,i=t+a*(r+1),o=t+1+a*(r+1),s=t+1+a*r;n.push(e,i,s),n.push(i,o,s)}return{vertices:r,indices:n,uvs:i}}var Md=t((()=>{})),Nd,Pd,Fd=t((()=>{E(),D(),ir(),P(),F(),bd(),Sd(),wd(),Ed(),Od(),Ad(),Md(),{isEqual:Nd}=vt,Pd=class extends N{constructor(...e){super(...e),this.colorModelUniformBuffer=[],this.heat3DModelUniformBuffer=[]}get attributeLocation(){return Object.assign(super.attributeLocation,{MAX:super.attributeLocation.MAX,SIZE:9,UV:10,DIR:11})}prerender(){let{clear:e,useFramebuffer:t}=this.rendererService;t(this.heatmapFramerBuffer,()=>{e({color:[0,0,0,0],depth:1,stencil:0,framebuffer:this.heatmapFramerBuffer}),this.drawIntensityMode()})}render(e){let{rampColors:t}=this.layer.getLayerConfig();Nd(this.preRampColors,t)||this.updateColorTexture(),this.shapeType===`heatmap`?this.drawHeatMap(e):this.draw3DHeatMap(e)}getUninforms(){throw Error(`Method not implemented.`)}async initModels(){let{createFramebuffer:e,getViewportSize:t,createTexture2D:n}=this.rendererService,r=this.layer.shapeOption?.field||`heatmap`;this.shapeType=r,this.intensityModel=await this.buildHeatMapIntensity(),this.colorModel=r===`heatmap`?this.buildHeatmap():this.build3dHeatMap();let{width:i,height:a}=t();return this.heatmapTexture=n({width:Math.floor(i/4),height:Math.floor(a/4),wrapS:m.CLAMP_TO_EDGE,wrapT:m.CLAMP_TO_EDGE,min:m.LINEAR,mag:m.LINEAR,usage:Wt.RENDER_TARGET}),this.heatmapFramerBuffer=e({color:this.heatmapTexture,depth:!0,width:Math.floor(i/4),height:Math.floor(a/4)}),this.updateColorTexture(),[this.intensityModel,this.colorModel]}async buildModels(){return this.initModels()}registerBuiltinAttributes(){this.styleAttributeService.registerStyleAttribute({name:`dir`,type:k.Attribute,descriptor:{name:`a_Dir`,shaderLocation:this.attributeLocation.DIR,buffer:{usage:m.DYNAMIC_DRAW,data:[],type:m.FLOAT},size:2,update:(e,t,n)=>[n[3],n[4]]}}),this.styleAttributeService.registerStyleAttribute({name:`size`,type:k.Attribute,descriptor:{name:`a_Size`,shaderLocation:this.attributeLocation.SIZE,buffer:{usage:m.DYNAMIC_DRAW,data:[],type:m.FLOAT},size:1,update:e=>{let{size:t=1}=e;return[t]}}})}async buildHeatMapIntensity(){return this.uniformBuffers=[this.rendererService.createBuffer({data:new Float32Array(4).fill(0),isUBO:!0})],this.layer.triangulation=yu,await this.layer.buildLayerModel({moduleName:`heatmapIntensity`,vertexShader:kd,fragmentShader:Dd,triangulation:yu,defines:this.getDefines(),depth:{enable:!1},cull:{enable:!0,face:m.FRONT}})}buildHeatmap(){this.shaderModuleService.registerModule(`heatmapColor`,{vs:Td,fs:Cd}),this.colorModelUniformBuffer=[this.rendererService.createBuffer({data:new Float32Array(4).fill(0),isUBO:!0})];let{vs:e,fs:t,uniforms:n}=this.shaderModuleService.getModule(`heatmapColor`),{createAttribute:r,createElements:i,createBuffer:a,createModel:o}=this.rendererService;return o({vs:e,fs:t,uniformBuffers:[...this.colorModelUniformBuffer,...this.rendererService.uniformBuffers],attributes:{a_Position:r({shaderLocation:this.attributeLocation.POSITION,buffer:a({data:[-1,1,0,1,1,0,-1,-1,0,1,-1,0],type:m.FLOAT}),size:3}),a_Uv:r({shaderLocation:this.attributeLocation.UV,buffer:a({data:[0,1,1,1,0,0,1,0],type:m.FLOAT}),size:2})},uniforms:{...n},depth:{enable:!1},elements:i({data:[0,2,1,2,3,1],type:m.UNSIGNED_INT,count:6})})}build3dHeatMap(){let{getViewportSize:e}=this.rendererService,{width:t,height:n}=e(),r=jd(t/4,n/4);this.shaderModuleService.registerModule(`heatmap3dColor`,{vs:xd,fs:yd}),this.heat3DModelUniformBuffer=[this.rendererService.createBuffer({data:new Float32Array(36).fill(0),isUBO:!0})];let{vs:i,fs:a,uniforms:o}=this.shaderModuleService.getModule(`heatmap3dColor`),{createAttribute:s,createElements:c,createBuffer:l,createModel:u}=this.rendererService;return u({vs:i,fs:a,attributes:{a_Position:s({shaderLocation:this.attributeLocation.POSITION,buffer:l({data:r.vertices,type:m.FLOAT}),size:3}),a_Uv:s({shaderLocation:this.attributeLocation.UV,buffer:l({data:r.uvs,type:m.FLOAT}),size:2})},primitive:m.TRIANGLES,uniformBuffers:[...this.heat3DModelUniformBuffer,...this.rendererService.uniformBuffers],uniforms:{...o},depth:{enable:!0},blend:{enable:!0,func:{srcRGB:m.SRC_ALPHA,srcAlpha:1,dstRGB:m.ONE_MINUS_SRC_ALPHA,dstAlpha:1}},elements:c({data:r.indices,type:m.UNSIGNED_INT,count:r.indices.length})})}drawIntensityMode(){let{intensity:e=10,radius:t=5}=this.layer.getLayerConfig(),n={u_radius:t,u_intensity:e};this.uniformBuffers[0].subData({offset:0,data:[t,e]}),this.layerService.beforeRenderData(this.layer),this.layer.hooks.beforeRender.call(),this.intensityModel?.draw({uniforms:n,blend:{enable:!0,func:{srcRGB:m.ONE,srcAlpha:1,dstRGB:m.ONE,dstAlpha:1}},stencil:{enable:!1,mask:255,func:{cmp:514,ref:1,mask:255}}}),this.layer.hooks.afterRender.call()}drawHeatMap(e){let{opacity:t=1}=this.layer.getLayerConfig(),n={u_opacity:t,u_colorTexture:this.colorTexture,u_texture:this.heatmapFramerBuffer},r=[this.heatmapTexture,this.colorTexture];this.colorModelUniformBuffer[0].subData({offset:0,data:[t]}),this.colorModel?.draw({uniforms:n,textures:r,blend:this.getBlend(),stencil:this.getStencil(e)})}draw3DHeatMap(e){let{opacity:t=1}=this.layer.getLayerConfig(),n=Pn();zn(n,this.cameraService.getViewProjectionMatrixUncentered());let r={u_opacity:t,u_colorTexture:this.colorTexture,u_texture:this.heatmapFramerBuffer,u_ViewProjectionMatrixUncentered:this.cameraService.getViewProjectionMatrixUncentered(),u_InverseViewProjectionMatrix:[...n]};this.heat3DModelUniformBuffer[0].subData({offset:0,data:[...r.u_ViewProjectionMatrixUncentered,...r.u_InverseViewProjectionMatrix,t]});let i=[this.heatmapTexture,this.colorTexture];this.colorModel?.draw({uniforms:r,textures:i,blend:{enable:!0,func:{srcRGB:m.SRC_ALPHA,srcAlpha:1,dstRGB:m.ONE_MINUS_SRC_ALPHA,dstAlpha:1}},stencil:this.getStencil(e)})}updateColorTexture(){let{createTexture2D:e}=this.rendererService;this.texture&&this.texture.destroy();let{rampColors:t}=this.layer.getLayerConfig(),n=gn(t);this.colorTexture=e({data:n.data,usage:Wt.SAMPLED,width:n.width,height:n.height,wrapS:m.CLAMP_TO_EDGE,wrapT:m.CLAMP_TO_EDGE,min:m.NEAREST,mag:m.NEAREST,flipY:!1,unorm:!0}),this.preRampColors=t}}})),Id,Ld=t((()=>{Id=`in vec4 v_color;

#pragma include "picking"
out vec4 outputColor;
void main() {
  outputColor = v_color;
  outputColor = filterColor(outputColor);
}
`})),Rd,zd=t((()=>{Rd=`layout(location = ATTRIBUTE_LOCATION_POSITION) in vec3 a_Position;
layout(location = ATTRIBUTE_LOCATION_COLOR) in vec4 a_Color;
layout(location = ATTRIBUTE_LOCATION_POS) in vec3 a_Pos;

layout(std140) uniform commonUniforms {
  vec2 u_radius;
  float u_opacity;
  float u_coverage;
  float u_angle;
};

out vec4 v_color;

#pragma include "projection"
#pragma include "project"
#pragma include "picking"

void main() {
  v_color = a_Color;
  v_color.a *= u_opacity;

  mat2 rotationMatrix = mat2(cos(u_angle), sin(u_angle), -sin(u_angle), cos(u_angle));
  vec2 offset = vec2(a_Position.xy * u_radius * rotationMatrix * u_coverage);
  vec2 lnglat = unProjectFlat(a_Pos.xy + offset);

  vec4 project_pos = project_position(vec4(lnglat, 0, 1.0));
  gl_Position = project_common_position_to_clipspace(vec4(project_pos.xy, 0.0, 1.0));

  setPickingColor(a_PickingColor);
}
`})),Bd,Vd=t((()=>{E(),P(),F(),Ld(),zd(),Bd=class extends N{get attributeLocation(){return Object.assign(super.attributeLocation,{MAX:super.attributeLocation.MAX,POS:9})}getUninforms(){let e=this.getCommonUniformsInfo(),t=this.getUniformsBufferInfo(this.getStyleAttribute());return this.updateStyleUnifoms(),{...e.uniformsOption,...t.uniformsOption}}getCommonUniformsInfo(){let{opacity:e,coverage:t,angle:n}=this.layer.getLayerConfig(),r={u_radius:[this.layer.getSource().data.xOffset,this.layer.getSource().data.yOffset],u_opacity:e||1,u_coverage:t||.9,u_angle:n||0};return this.getUniformsBufferInfo(r)}async initModels(){return this.buildModels()}async buildModels(){return this.initUniformsBuffer(),[await this.layer.buildLayerModel({moduleName:`heatmapHexagon`,vertexShader:Rd,fragmentShader:Id,defines:this.getDefines(),triangulation:gu,depth:{enable:!1},primitive:m.TRIANGLES})]}registerBuiltinAttributes(){this.styleAttributeService.registerStyleAttribute({name:`pos`,type:k.Attribute,descriptor:{name:`a_Pos`,shaderLocation:this.attributeLocation.POS,buffer:{usage:m.DYNAMIC_DRAW,data:[],type:m.FLOAT},size:3,update:e=>{let t=e.coordinates;return[t[0],t[1],0]}}})}}})),Hd,Ud=t((()=>{fd(),vd(),Fd(),Vd(),Hd={heatmap:Pd,heatmap3d:Pd,grid:dd,grid3d:_d,hexagon:Bd}})),Wd,Gd=t((()=>{$c(),od(),Ud(),Wd=class extends Qc{constructor(...e){super(...e),this.type=`HeatMapLayer`}async buildModels(){let e=this.getModelType();this.layerModel=new Hd[e](this),await this.initLayerModels()}prerender(){this.getModelType()===`heatmap`&&this.layerModel&&this.layerModel.prerender()}renderModels(e={}){return this.getModelType()===`heatmap`?(this.layerModel&&this.layerModel.render(e),this):(this.encodeDataLength<=0&&!this.forceRender||(this.hooks.beforeRender.call(),this.models.forEach(t=>t.draw({uniforms:this.layerModel.getUninforms(),blend:this.layerModel.getBlend(),stencil:this.layerModel.getStencil(e)})),this.hooks.afterRender.call()),this)}updateModelData(e){e.attributes&&e.elements?this.models[0].updateAttributesAndElements(e.attributes,e.elements):console.warn(`data error`)}getModelType(){let{shape3d:e}=this.getLayerConfig(),t=this.getSource()?.data?.type,n=this.shapeOption?.field||`heatmap`,r=Array.isArray(e)&&e.includes(n);return n===`heatmap`||n===`heatmap3d`?`heatmap`:t===`hexagon`?r?`grid3d`:`hexagon`:t===`grid`?r?`grid3d`:`grid`:`heatmap`}getLegend(e){if(this.getModelType()===`heatmap`){if(e!==`color`)return{type:void 0,field:void 0,items:[]};let t=this.getLayerConfig().rampColors;return ad(t,e)}return super.getLegend(e)}}})),Kd,qd=t((()=>{Kd=`uniform sampler2D u_texture;
layout(std140) uniform commonUniforms {
    float u_opacity:1.0;
    float u_brightness:1.0;
    float u_contrast:1.0;
    float u_saturation:1.0;
    float u_gamma:1.0;
};

in vec2 v_texCoord;
out vec4 outputColor;
vec3 setContrast(vec3 rgb, float contrast) {
  vec3 color = mix(vec3(0.5), rgb, contrast);
  color = clamp(color, 0.0, 1.0);
  return color;
}
vec3 setSaturation(vec3 rgb, float adjustment) {
  const vec3 grayVector = vec3(0.2125, 0.7154, 0.0721);
  vec3 intensity = vec3(dot(rgb, grayVector));
  vec3 color = mix(intensity, rgb, adjustment);
  color = clamp(color, 0.0, 1.0);
  return color;
}
void main() {
  vec4 color = texture(SAMPLER_2D(u_texture),vec2(v_texCoord.x,v_texCoord.y));
  //brightness
  color.rgb = mix(vec3(0.0, 0.0, 0.0), color.rgb, u_brightness);
  //contrast
  color.rgb = setContrast(color.rgb, u_contrast);
  // saturation
  color.rgb = setSaturation(color.rgb, u_saturation);
  // gamma
  color.rgb = pow(color.rgb, vec3(u_gamma));
  outputColor = color;
  outputColor.a *= u_opacity;
  if(outputColor.a < 0.01)
    discard;
}
`})),Jd,Yd=t((()=>{Jd=`layout(location = ATTRIBUTE_LOCATION_POSITION) in vec3 a_Position;
layout(location = ATTRIBUTE_LOCATION_POSITION_64LOW) in vec2 a_Position64Low;
layout(location = ATTRIBUTE_LOCATION_UV) in vec2 a_Uv;

layout(std140) uniform commonUniforms {
    float u_opacity:1.0;
    float u_brightness:1.0;
    float u_contrast:1.0;
    float u_saturation:1.0;
    float u_gamma:1.0;
};

out vec2 v_texCoord;
#pragma include "projection"

void main() {
  v_texCoord = a_Uv;
  vec4 project_pos = project_position(vec4(a_Position, 1.0), a_Position64Low);
  gl_Position = project_common_position_to_clipspace(vec4(project_pos.xy, 0.0, 1.0));
}
`})),Xd,Zd=t((()=>{E(),D(),P(),F(),qd(),Yd(),Xd=class extends N{get attributeLocation(){return Object.assign(super.attributeLocation,{MAX:super.attributeLocation.MAX,UV:9})}getCommonUniformsInfo(){let{opacity:e,brightness:t,contrast:n,saturation:r,gamma:i}=this.layer.getLayerConfig(),a={u_opacity:g(e,1),u_brightness:g(t,1),u_contrast:g(n,1),u_saturation:g(r,1),u_gamma:g(i,1)};return this.textures=[this.texture],this.getUniformsBufferInfo(a)}async initModels(){return await this.loadTexture(),this.buildModels()}clearModels(){this.texture?.destroy()}async loadTexture(){let{createTexture2D:e}=this.rendererService,t=await this.layer.getSource().data.images;this.texture=e({data:t[0],width:t[0].width,height:t[0].height,mag:m.LINEAR,min:m.LINEAR})}async buildModels(){return this.initUniformsBuffer(),[await this.layer.buildLayerModel({moduleName:`rasterImage`,vertexShader:Jd,fragmentShader:Kd,defines:this.getDefines(),triangulation:_u,primitive:m.TRIANGLES,blend:{enable:!0},depth:{enable:!1},pickingEnabled:!1})]}registerBuiltinAttributes(){this.registerPosition64LowAttribute(),this.styleAttributeService.registerStyleAttribute({name:`uv`,type:k.Attribute,descriptor:{name:`a_Uv`,shaderLocation:this.attributeLocation.UV,buffer:{usage:m.DYNAMIC_DRAW,data:[],type:m.FLOAT},size:2,update:(e,t,n)=>[n[3],n[4]]}})}}})),Qd,$d=t((()=>{Zd(),Qd={image:Xd}})),ef,tf=t((()=>{$c(),$d(),ef=class extends Qc{constructor(...e){super(...e),this.type=`ImageLayer`}async buildModels(){let e=this.getModelType();this.layerModel=new Qd[e](this),await this.initLayerModels()}getDefaultConfig(){return{image:{}}[this.getModelType()]}getModelType(){return`image`}}})),nf,rf=t((()=>{nf=`
#define Animate 0.0
#define LineTexture 1.0
uniform sampler2D u_texture;
layout(std140) uniform commonUniorm {
  vec4 u_animate: [ 1., 2., 1.0, 0.2 ];
  vec4 u_dash_array;
  vec4 u_sourceColor;
  vec4 u_targetColor;
  vec2 u_textSize;
  float segmentNumber;
  float u_lineDir: 1.0;
  float u_icon_step: 100;
  float u_line_texture: 0.0;
  float u_textureBlend;
  float u_blur : 0.9;
  float u_line_type: 0.0;
  float u_time;
  float u_linearColor: 0.0;
};

in vec4 v_color;
in vec2 v_iconMapUV;
in vec4 v_lineData;
//dash
in vec4 v_dash_array;
in float v_distance_ratio;

out vec4 outputColor;
#pragma include "picking"

void main() {
  if(u_dash_array!=vec4(0.0)){
    float dashLength = mod(v_distance_ratio, v_dash_array.x + v_dash_array.y + v_dash_array.z + v_dash_array.w);
    if(!(dashLength < v_dash_array.x || (dashLength > (v_dash_array.x + v_dash_array.y) && dashLength <  v_dash_array.x + v_dash_array.y + v_dash_array.z))) {
      discard;
    };
  }
  float animateSpeed = 0.0; // 运动速度
  outputColor = v_color;
  if(u_animate.x == Animate && u_line_texture != LineTexture) {
      animateSpeed = u_time / u_animate.y;
      float alpha =1.0 - fract( mod(1.0- v_lineData.b, u_animate.z)* (1.0/ u_animate.z) + u_time / u_animate.y);
      alpha = (alpha + u_animate.w -1.0) / u_animate.w;
      // alpha = smoothstep(0., 1., alpha);
      alpha = clamp(alpha, 0.0, 1.0);
      outputColor.a *= alpha;
  }

  // 当存在贴图时在底色上贴上贴图
  if(u_line_texture == LineTexture) { // while load texture
    float arcRadio = smoothstep( 0.0, 1.0, (v_lineData.r / segmentNumber));
    // float arcRadio = smoothstep( 0.0, 1.0, d_distance_ratio);

    float count = v_lineData.g; // 贴图在弧线上重复的数量

    float time = 0.0;
    if(u_animate.x == Animate) {
      time = u_time / u_animate.y;
    }
    float redioCount = arcRadio * count;

    float u = fract(redioCount - time);
    float v = v_lineData.a; // 横向 v
    vec2 uv= v_iconMapUV / u_textSize + vec2(u, v) / u_textSize * 64.;

    vec4 pattern = texture(SAMPLER_2D(u_texture), uv);

    if(u_animate.x == Animate) {
      float currentPlane = floor(redioCount - time);
      float textureStep = floor(count * u_animate.z);
      float a = mod(currentPlane, textureStep);
      if(a < textureStep - 1.0) {
        pattern = vec4(0.0);
      }
    }

    if(u_textureBlend == 0.0) { // normal
      pattern.a = 0.0;
      outputColor = filterColor(outputColor + pattern);
    } else { // replace
        pattern.a *= v_color.a;
        if(outputColor.a <= 0.0) {
          pattern.a = 0.0;
        }
        outputColor = filterColor(pattern);
    }
    
  } else {
     outputColor = filterColor(outputColor);
  }
}`})),af,of=t((()=>{af=`#define Animate (0.0)
#define LineTexture (1.0)

layout(location = ATTRIBUTE_LOCATION_POSITION) in vec3 a_Position;
layout(location = ATTRIBUTE_LOCATION_COLOR) in vec4 a_Color;
layout(location = ATTRIBUTE_LOCATION_SIZE) in float a_Size;
layout(location = ATTRIBUTE_LOCATION_INSTANCE) in vec4 a_Instance;
layout(location = ATTRIBUTE_LOCATION_INSTANCE_64LOW) in vec4 a_Instance64Low;
layout(location = ATTRIBUTE_LOCATION_UV) in vec2 a_iconMapUV;

layout(std140) uniform commonUniorm {
  vec4 u_animate: [ 1., 2., 1.0, 0.2 ];
  vec4 u_dash_array;
  vec4 u_sourceColor;
  vec4 u_targetColor;
  vec2 u_textSize;
  float segmentNumber;
  float u_lineDir: 1.0;
  float u_icon_step: 100;
  float u_line_texture: 0.0;
  float u_textureBlend;
  float u_blur : 0.9;
  float u_line_type: 0.0;
  float u_time;
  float u_linearColor: 0.0;
};

out vec4 v_color;
out vec2 v_iconMapUV;
out vec4 v_lineData;
//dash
out vec4 v_dash_array;
out float v_distance_ratio;

#pragma include "projection"
#pragma include "project"
#pragma include "picking"

float bezier3(vec3 arr, float t) {
  float ut = 1.0 - t;
  return (arr.x * ut + arr.y * t) * ut + (arr.y * ut + arr.z * t) * t;
}
vec2 midPoint(vec2 source, vec2 target, float arcThetaOffset) {
  vec2 center = target - source;
  float r = length(center);
  float theta = atan(center.y, center.x);
  float thetaOffset = arcThetaOffset;
  float r2 = r / 2.0 / cos(thetaOffset);
  float theta2 = theta + thetaOffset;
  vec2 mid = vec2(r2 * cos(theta2) + source.x, r2 * sin(theta2) + source.y);
  if (u_lineDir == 1.0) {
    // 正向
    return mid;
  } else {
    // 逆向
    // (mid + vmin)/2 = (s + t)/2
    vec2 vmid = source + target - mid;
    return vmid;
  }
  // return mid;
}
float getSegmentRatio(float index) {
  // dash: index / (segmentNumber - 1.);
  // normal: smoothstep(0.0, 1.0, index / (segmentNumber - 1.));
  return smoothstep(0.0, 1.0, index / (segmentNumber - 1.0));
  //  return index / (segmentNumber - 1.);
}
vec2 interpolate(vec2 source, vec2 target, float t, float arcThetaOffset) {
  // if the angularDist is PI, linear interpolation is applied. otherwise, use spherical interpolation
  vec2 mid = midPoint(source, target, arcThetaOffset);
  vec3 x = vec3(source.x, mid.x, target.x);
  vec3 y = vec3(source.y, mid.y, target.y);
  return vec2(bezier3(x, t), bezier3(y, t));
}
vec2 getExtrusionOffset(vec2 line_clipspace, float offset_direction) {
  // normalized direction of the line
  vec2 dir_screenspace = normalize(line_clipspace);
  // rotate by 90 degrees
  dir_screenspace = vec2(-dir_screenspace.y, dir_screenspace.x);
  vec2 offset = dir_screenspace * offset_direction * setPickingSize(a_Size) / 2.0;
  return offset;
}
vec2 getNormal(vec2 line_clipspace, float offset_direction) {
  // normalized direction of the line
  vec2 dir_screenspace = normalize(line_clipspace);
  // rotate by 90 degrees
   dir_screenspace = vec2(-dir_screenspace.y, dir_screenspace.x);
   return dir_screenspace.xy * sign(offset_direction);
}

void main() {
  //vs中计算渐变色
  if (u_linearColor == 1.0) {
    float d_segmentIndex = a_Position.x + 1.0; // 当前顶点在弧线中所处的分段位置
    v_color = mix(u_sourceColor, u_targetColor, d_segmentIndex / segmentNumber);
  } else {
    v_color = a_Color;
  }
  v_color.a = v_color.a * opacity;

  vec2 source_world = a_Instance.rg; // 起始点
  vec2 target_world = a_Instance.ba; // 终点

  float segmentIndex = a_Position.x;
  float segmentRatio = getSegmentRatio(segmentIndex);

  // 计算 dashArray 和 distanceRatio 输出到片元
  float total_Distance = pixelDistance(source_world, target_world) / 2.0 * PI;
  v_dash_array = pow(2.0, 20.0 - u_Zoom) * u_dash_array / total_Distance;
  v_distance_ratio = segmentIndex / segmentNumber;

  float indexDir = mix(-1.0, 1.0, step(segmentIndex, 0.0));
  float nextSegmentRatio = getSegmentRatio(segmentIndex + indexDir);
  float d_distance_ratio;

  if(u_animate.x == Animate) {
      d_distance_ratio = segmentIndex / segmentNumber;
      if(u_lineDir != 1.0) {
        d_distance_ratio = 1.0 - d_distance_ratio;
      }
  }

  v_lineData.b = d_distance_ratio;

  vec4 source = project_position(vec4(source_world, 0, 1.), a_Instance64Low.xy);
  vec4 target = project_position(vec4(target_world, 0, 1.), a_Instance64Low.zw);

  vec2 currPos = interpolate(source.xy, target.xy, segmentRatio, thetaOffset);
  vec2 nextPos = interpolate(source.xy, target.xy, nextSegmentRatio, thetaOffset);

  vec2 offset = project_pixel(
    getExtrusionOffset((nextPos.xy - currPos.xy) * indexDir, a_Position.y)
  );

  float d_segmentIndex = a_Position.x + 1.0; // 当前顶点在弧线中所处的分段位置
  v_lineData.r = d_segmentIndex;

  if(LineTexture == u_line_texture) { // 开启贴图模式
    float arcDistrance = length(source - target); // 起始点和终点的距离
    arcDistrance = project_pixel(arcDistrance);

    v_iconMapUV = a_iconMapUV;

    float pixelLen = project_pixel_texture(u_icon_step); // 贴图沿弧线方向的长度 - 随地图缩放改变
    float texCount = floor(arcDistrance / pixelLen); // 贴图在弧线上重复的数量
    v_lineData.g = texCount;

    float lineOffsetWidth = length(offset + offset * sign(a_Position.y)); // 线横向偏移的距离
    float linePixelSize = project_pixel(a_Size); // 定点位置偏移
    v_lineData.a = lineOffsetWidth / linePixelSize; // 线图层贴图部分的 v 坐标值
  }

  gl_Position = project_common_position_to_clipspace(vec4(currPos.xy + offset, 0, 1.0));

  setPickingColor(a_PickingColor);
}
`})),sf,cf,lf=t((()=>{E(),D(),P(),F(),rf(),of(),sf={solid:0,dash:1},cf=class extends N{constructor(...e){super(...e),this.updateTexture=()=>{let{createTexture2D:e}=this.rendererService;this.texture?(this.texture.update({data:this.iconService.getCanvas()}),this.layer.render()):(this.texture=e({data:this.iconService.getCanvas(),mag:m.NEAREST,min:m.NEAREST,premultiplyAlpha:!1,width:1024,height:this.iconService.canvasHeight||128}),this.textures=[this.texture])}}get attributeLocation(){return Object.assign(super.attributeLocation,{MAX:super.attributeLocation.MAX,SIZE:9,INSTANCE:10,INSTANCE_64LOW:11,UV:12,THETA_OFFSET:13})}getCommonUniformsInfo(){let{sourceColor:e,targetColor:t,textureBlend:n=`normal`,lineType:r=`solid`,dashArray:i=[10,5],forward:a=!0,lineTexture:o=!1,iconStep:s=100,segmentNumber:c=30}=this.layer.getLayerConfig(),{animateOption:l}=this.layer.getLayerConfig(),u=i;r!==`dash`&&(u=[0,0]),u.length===2&&u.push(0,0);let d=0,f=[0,0,0,0],p=[0,0,0,0];e&&t&&(f=A(e),p=A(t),d=1),this.rendererService.getDirty()&&this.texture?.bind();let m={u_animate:this.animateOption2Array(l),u_dash_array:u,u_sourceColor:f,u_targetColor:p,u_textSize:[1024,this.iconService.canvasHeight||128],segmentNumber:c,u_lineDir:a?1:-1,u_icon_step:s,u_line_texture:+!!o,u_textureBlend:n===`normal`?0:1,u_blur:.9,u_line_type:sf[r||`solid`],u_time:this.layer.getLayerAnimateTime()||0,u_linearColor:d};return this.getUniformsBufferInfo(m)}async initModels(){return this.updateTexture(),this.iconService.on(`imageUpdate`,this.updateTexture),this.buildModels()}clearModels(){this.texture?.destroy(),this.iconService.off(`imageUpdate`,this.updateTexture)}getShaders(){return{frag:nf,vert:af,type:``}}async buildModels(){this.initUniformsBuffer();let{segmentNumber:e=30}=this.layer.getLayerConfig(),{frag:t,vert:n,type:r}=this.getShaders();return[await this.layer.buildLayerModel({moduleName:`lineArc2d`+r,vertexShader:n,fragmentShader:t,defines:this.getDefines(),inject:this.getInject(),triangulation:vu,depth:{enable:!1},styleOption:{segmentNumber:e}})]}registerBuiltinAttributes(){this.styleAttributeService.registerStyleAttribute({name:`size`,type:k.Attribute,descriptor:{name:`a_Size`,shaderLocation:this.attributeLocation.SIZE,buffer:{usage:m.DYNAMIC_DRAW,data:[],type:m.FLOAT},size:1,update:e=>{let{size:t=1}=e;return Array.isArray(t)?[t[0]]:[t]}}}),this.styleAttributeService.registerStyleAttribute({name:`instance`,type:k.Attribute,descriptor:{name:`a_Instance`,shaderLocation:this.attributeLocation.INSTANCE,buffer:{usage:m.STATIC_DRAW,data:[],type:m.FLOAT},size:4,update:(e,t,n)=>[n[3],n[4],n[5],n[6]]}}),this.styleAttributeService.registerStyleAttribute({name:`instance64Low`,type:k.Attribute,descriptor:{name:`a_Instance64Low`,shaderLocation:this.attributeLocation.INSTANCE_64LOW,buffer:{usage:m.STATIC_DRAW,data:[],type:m.FLOAT},size:4,update:(e,t,n)=>[xn(n[3]),xn(n[4]),xn(n[5]),xn(n[6])]}}),this.styleAttributeService.registerStyleAttribute({name:`uv`,type:k.Attribute,descriptor:{name:`a_iconMapUV`,shaderLocation:this.attributeLocation.UV,buffer:{usage:m.DYNAMIC_DRAW,data:[],type:m.FLOAT},size:2,update:e=>{let t=this.iconService.getIconMap(),{texture:n}=e,{x:r,y:i}=t[n]||{x:0,y:0};return[r,i]}}}),this.styleAttributeService.registerStyleAttribute({name:`thetaOffset`,type:k.Attribute,descriptor:{name:`a_ThetaOffset`,shaderLocation:this.attributeLocation.THETA_OFFSET,buffer:{usage:m.STATIC_DRAW,data:[],type:m.FLOAT},size:1,update:e=>{let{thetaOffset:t=1}=e;return[t]}}})}}})),uf,df=t((()=>{uf=`#define LineTypeSolid 0.0
#define LineTypeDash 1.0
#define Animate 0.0
#define LineTexture 1.0

uniform sampler2D u_texture;

layout(std140) uniform commonUniorm {
  vec4 u_animate: [ 1., 2., 1.0, 0.2 ];
  vec4 u_dash_array: [10.0, 5., 0, 0];
  vec4 u_sourceColor;
  vec4 u_targetColor;
  vec2 u_textSize;
  float u_globel;
  float u_globel_radius;
  float u_global_height: 10;
  float segmentNumber;
  float u_line_type: 0.0;
  float u_icon_step: 100;
  float u_line_texture: 0.0;
  float u_textureBlend;
  float u_time;
  float u_linearColor: 0.0;
};

in vec4 v_color;
in vec4 v_dash_array;
in float v_segmentIndex;
in vec2 v_iconMapUV;
in vec4 v_line_data;

out vec4 outputColor;

#pragma include "picking"

void main() {
  float animateSpeed = 0.0; // 运动速度
  float d_distance_ratio = v_line_data.g; // 当前点位距离占线总长的比例
  outputColor = v_color;

  if(u_line_type == LineTypeDash) {
    float flag = 0.;
    float dashLength = mod(d_distance_ratio, v_dash_array.x + v_dash_array.y + v_dash_array.z + v_dash_array.w);
    if(dashLength < v_dash_array.x || (dashLength > (v_dash_array.x + v_dash_array.y) && dashLength <  v_dash_array.x + v_dash_array.y + v_dash_array.z)) {
      flag = 1.;
    }
    outputColor.a *=flag;
  }

  if(u_animate.x == Animate && u_line_texture != LineTexture) {
      animateSpeed = u_time / u_animate.y;
      float alpha =1.0 - fract( mod(1.0- d_distance_ratio, u_animate.z)* (1.0/ u_animate.z) + u_time / u_animate.y);

      alpha = (alpha + u_animate.w -1.0) / u_animate.w;
      // alpha = smoothstep(0., 1., alpha);
      alpha = clamp(alpha, 0.0, 1.0);
      outputColor.a *= alpha;

      // u_animate
      // x enable
      // y duration
      // z interval
      // w trailLength
  }

  if(u_line_texture == LineTexture && u_line_type != LineTypeDash) { // while load texture
    // float arcRadio = smoothstep( 0.0, 1.0, (v_segmentIndex / segmentNumber));
    float arcRadio = v_segmentIndex / (segmentNumber - 1.0);
    float count = v_line_data.b; // // 贴图在弧线上重复的数量

    float time = 0.0;
    if(u_animate.x == Animate) {
      time = u_time / u_animate.y;
    }
    float redioCount = arcRadio * count;

    float u = fract(redioCount - time);

    float v = v_line_data.a;  // 线图层贴图部分的 v 坐标值
    vec2 uv= v_iconMapUV / u_textSize + vec2(u, v) / u_textSize * 64.;
    vec4 pattern = texture(SAMPLER_2D(u_texture), uv);

    if(u_animate.x == Animate) {
      float currentPlane = floor(redioCount - time);
      float textureStep = floor(count * u_animate.z);
      float a = mod(currentPlane, textureStep);
      if(a < textureStep - 1.0) {
        pattern = vec4(0.0);
      }
    }

    if(u_textureBlend == 0.0) { // normal
      pattern.a = 0.0;
      outputColor = filterColor(outputColor + pattern);
    } else { // replace
        pattern.a *= v_color.a;
        if(outputColor.a <= 0.0) {
          pattern.a = 0.0;
          discard;
        } else {
          outputColor = filterColor(pattern);
        }
    }

  } else {
    outputColor = filterColor(outputColor);
  }
}
`})),ff,pf=t((()=>{ff=`#define LineTypeSolid 0.0
#define LineTypeDash 1.0
#define Animate 0.0
#define LineTexture 1.0

layout(location = ATTRIBUTE_LOCATION_POSITION) in vec3 a_Position;
layout(location = ATTRIBUTE_LOCATION_COLOR) in vec4 a_Color;
layout(location = ATTRIBUTE_LOCATION_SIZE) in float a_Size;
layout(location = ATTRIBUTE_LOCATION_INSTANCE) in vec4 a_Instance;
layout(location = ATTRIBUTE_LOCATION_INSTANCE_64LOW) in vec4 a_Instance64Low;
layout(location = ATTRIBUTE_LOCATION_UV) in vec2 a_iconMapUV;


layout(std140) uniform commonUniorm {
  vec4 u_animate: [ 1., 2., 1.0, 0.2 ];
  vec4 u_dash_array: [10.0, 5., 0, 0];
  vec4 u_sourceColor;
  vec4 u_targetColor;
  vec2 u_textSize;
  float u_globel;
  float u_globel_radius;
  float u_global_height: 10;
  float segmentNumber;
  float u_line_type: 0.0;
  float u_icon_step: 100;
  float u_line_texture: 0.0;
  float u_textureBlend;
  float u_time;
  float u_linearColor: 0.0;
};
out vec4 v_color;
out vec4 v_dash_array;
out float v_segmentIndex;
out vec2 v_iconMapUV;
out vec4 v_line_data;

#pragma include "projection"
#pragma include "project"
#pragma include "picking"

float maps (float value, float start1, float stop1, float start2, float stop2) {
  return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
}

float getSegmentRatio(float index) {
  return smoothstep(0.0, 1.0, index / (segmentNumber - 1.0));
}

float paraboloid(vec2 source, vec2 target, float ratio) {
  vec2 x = mix(source, target, ratio);
  vec2 center = mix(source, target, 0.5);
  float dSourceCenter = distance(source, center);
  float dXCenter = distance(x, center);
  return (dSourceCenter + dXCenter) * (dSourceCenter - dXCenter);
}

vec3 getPos(vec2 source, vec2 target, float segmentRatio) {
  float vertex_height = paraboloid(source, target, segmentRatio);

  return vec3(
    mix(source, target, segmentRatio),
    sqrt(max(0.0, vertex_height))
  );
}
vec2 getExtrusionOffset(vec2 line_clipspace, float offset_direction) {
  // normalized direction of the line
  vec2 dir_screenspace = normalize(line_clipspace);
  // rotate by 90 degrees
  dir_screenspace = vec2(-dir_screenspace.y, dir_screenspace.x);

  vec2 offset = dir_screenspace * offset_direction * setPickingSize(a_Size) / 2.0;

  return offset;
}
vec2 getNormal(vec2 line_clipspace, float offset_direction) {
  // normalized direction of the line
  vec2 dir_screenspace = normalize(line_clipspace);
  // rotate by 90 degrees
  dir_screenspace = vec2(-dir_screenspace.y, dir_screenspace.x);
  return dir_screenspace.xy * sign(offset_direction);
}

float torad(float deg) {
  return (deg / 180.0) * acos(-1.0);
}

vec3 lglt2xyz(vec2 lnglat) {
  float pi = 3.1415926;
  // + Math.PI/2 是为了对齐坐标
  float lng = torad(lnglat.x) + pi / 2.0;
  float lat = torad(lnglat.y);

  // 手动增加一些偏移，减轻面的冲突
  float radius = u_globel_radius;

  float z = radius * cos(lat) * cos(lng);
  float x = radius * cos(lat) * sin(lng);
  float y = radius * sin(lat);
  return vec3(x, y, z);
}

void main() {
  //vs中计算渐变色
  if(u_linearColor==1.0){
    float d_segmentIndex = a_Position.x + 1.0; // 当前顶点在弧线中所处的分段位置
    v_color = mix(u_sourceColor, u_targetColor, d_segmentIndex/segmentNumber);
  }
  else{
    v_color = a_Color;
  }
  v_color.a = v_color.a * opacity;
  vec2 source = project_position(vec4(a_Instance.rg, 0, 0), a_Instance64Low.xy).xy;
  vec2 target = project_position(vec4(a_Instance.ba, 0, 0), a_Instance64Low.zw).xy;
  float segmentIndex = a_Position.x;
  float segmentRatio = getSegmentRatio(segmentIndex);
  float indexDir = mix(-1.0, 1.0, step(segmentIndex, 0.0));

  float d_distance_ratio;
   if(u_line_type == LineTypeDash) {
    d_distance_ratio = segmentIndex / segmentNumber;
    float total_Distance = pixelDistance(source, target) / 2.0 * PI;
    v_dash_array = pow(2.0, 20.0 - u_Zoom) * u_dash_array / (total_Distance / segmentNumber * segmentIndex);
  }
    if(u_animate.x == Animate) {
      d_distance_ratio = segmentIndex / segmentNumber;
  }
  v_line_data.g = d_distance_ratio; // 当前点位距离占线总长的比例

  float nextSegmentRatio = getSegmentRatio(segmentIndex + indexDir);
  vec3 curr = getPos(source, target, segmentRatio);
  vec3 next = getPos(source, target, nextSegmentRatio);
  vec2 offset = getExtrusionOffset((next.xy - curr.xy) * indexDir, a_Position.y);
  // v_normal = getNormal((next.xy - curr.xy) * indexDir, a_Position.y);


  v_segmentIndex = a_Position.x;
  if(LineTexture == u_line_texture && u_line_type != LineTypeDash) { // 开启贴图模式

    float arcDistrance = length(source - target);
    float pixelLen =  project_pixel_texture(u_icon_step);
    v_line_data.b = floor(arcDistrance/pixelLen); // 贴图在弧线上重复的数量

    vec2 projectOffset = project_pixel(offset);
    float lineOffsetWidth = length(projectOffset + projectOffset * sign(a_Position.y)); // 线横向偏移的距离
    float linePixelSize = project_pixel(a_Size);  // 定点位置偏移，按地图等级缩放后的距离
    v_line_data.a = lineOffsetWidth/linePixelSize;  // 线图层贴图部分的 v 坐标值

    v_iconMapUV = a_iconMapUV;
  }


  gl_Position = project_common_position_to_clipspace(vec4(curr.xy + project_pixel(offset), curr.z * thetaOffset, 1.0));

  // 地球模式
  if(u_globel > 0.0) {
    vec3 startLngLat = lglt2xyz(a_Instance.rg);
    vec3 endLngLat = lglt2xyz(a_Instance.ba);
    float globalRadius = length(startLngLat);

    vec3 lineDir = normalize(endLngLat - startLngLat);
    vec3 midPointDir = normalize((startLngLat + endLngLat)/2.0);

    // 线的偏移
    vec3 lnglatOffset = cross(lineDir, midPointDir) * a_Position.y;
    // 计算起始点和终止点的距离
    float lnglatLength = length(a_Instance.rg - a_Instance.ba)/50.0;
    // 计算飞线各个节点相应的高度
    float lineHeight = u_global_height * (-4.0*segmentRatio*segmentRatio + 4.0 * segmentRatio) * lnglatLength;
    // 地球点位
    vec3 globalPoint = normalize(mix(startLngLat, endLngLat, segmentRatio)) * (globalRadius + lineHeight) + lnglatOffset * a_Size;

    gl_Position = u_ViewProjectionMatrix * vec4(globalPoint, 1.0);
  }


  setPickingColor(a_PickingColor);
}
`})),mf,hf,gf=t((()=>{E(),D(),P(),F(),Al(),df(),pf(),mf={solid:0,dash:1},hf=class extends N{constructor(...e){super(...e),this.updateTexture=()=>{let{createTexture2D:e}=this.rendererService;this.texture?(this.texture.update({data:this.iconService.getCanvas()}),this.layer.render()):(this.texture=e({data:this.iconService.getCanvas(),mag:m.LINEAR,min:m.LINEAR,premultiplyAlpha:!1,width:1024,height:this.iconService.canvasHeight||128}),this.textures=[this.texture])}}get attributeLocation(){return Object.assign(super.attributeLocation,{MAX:super.attributeLocation.MAX,SIZE:9,INSTANCE:10,INSTANCE_64LOW:11,UV:12,THETA_OFFSET:13})}getCommonUniformsInfo(){let{sourceColor:e,targetColor:t,textureBlend:n=`normal`,lineType:r=`solid`,dashArray:i=[10,5],lineTexture:a=!1,iconStep:o=100,segmentNumber:s=30,globalArcHeight:c=10}=this.layer.getLayerConfig(),{animateOption:l}=this.layer.getLayerConfig();i.length===2&&i.push(0,0);let u=0,d=[0,0,0,0],f=[0,0,0,0];e&&t&&(d=A(e),f=A(t),u=1),this.rendererService.getDirty()&&this.texture?.bind();let p={u_animate:this.animateOption2Array(l),u_dash_array:i,u_sourceColor:d,u_targetColor:f,u_textSize:[1024,this.iconService.canvasHeight||128],u_globel:+(this.mapService.version===`GLOBEL`),u_globel_radius:100,u_global_height:c,segmentNumber:s,u_line_type:mf[r]||0,u_icon_step:o,u_line_texture:+!!a,u_textureBlend:n===`normal`?0:1,u_time:this.layer.getLayerAnimateTime()||0,u_linearColor:u};return this.getUniformsBufferInfo(p)}async initModels(){return this.initUniformsBuffer(),this.updateTexture(),this.iconService.on(`imageUpdate`,this.updateTexture),this.buildModels()}clearModels(){this.texture?.destroy(),this.iconService.off(`imageUpdate`,this.updateTexture)}getShaders(){return{frag:uf,vert:ff,type:``}}async buildModels(){let{segmentNumber:e=30}=this.layer.getLayerConfig(),{frag:t,vert:n,type:r}=this.getShaders();return[await this.layer.buildLayerModel({moduleName:`lineArc3d`+r,vertexShader:n,fragmentShader:t,defines:this.getDefines(),inject:this.getInject(),triangulation:vu,styleOption:{segmentNumber:e}})]}registerBuiltinAttributes(){this.styleAttributeService.registerStyleAttribute({name:`size`,type:k.Attribute,descriptor:{name:`a_Size`,shaderLocation:this.attributeLocation.SIZE,buffer:{usage:m.DYNAMIC_DRAW,data:[],type:m.FLOAT},size:1,update:e=>{let{size:t=1}=e;return Array.isArray(t)?[t[0]]:[t]}}}),this.styleAttributeService.registerStyleAttribute({name:`instance`,type:k.Attribute,descriptor:{name:`a_Instance`,shaderLocation:this.attributeLocation.INSTANCE,buffer:{usage:m.STATIC_DRAW,data:[],type:m.FLOAT},size:4,update:(e,t,n)=>[n[3],n[4],n[5],n[6]]}}),this.styleAttributeService.registerStyleAttribute({name:`instance64Low`,type:k.Attribute,descriptor:{name:`a_Instance64Low`,shaderLocation:this.attributeLocation.INSTANCE_64LOW,buffer:{usage:m.STATIC_DRAW,data:[],type:m.FLOAT},size:4,update:(e,t,n)=>[xn(n[3]),xn(n[4]),xn(n[5]),xn(n[6])]}}),this.styleAttributeService.registerStyleAttribute({name:`uv`,type:k.Attribute,descriptor:{name:`a_iconMapUV`,shaderLocation:this.attributeLocation.UV,buffer:{usage:m.DYNAMIC_DRAW,data:[],type:m.FLOAT},size:2,update:e=>{let t=this.iconService.getIconMap(),{texture:n}=e,{x:r,y:i}=t[n]||{x:0,y:0};return[r,i]}}}),this.styleAttributeService.registerStyleAttribute({name:`thetaOffset`,type:k.Attribute,descriptor:{name:`a_ThetaOffset`,shaderLocation:this.attributeLocation.THETA_OFFSET,buffer:{usage:m.STATIC_DRAW,data:[],type:m.FLOAT},size:1,update:e=>{let{thetaOffset:t=1}=e;return[t]}}})}}}));function _f(e,t){let{width:n=2,height:r=1}=t;return{vertices:[0,Df*e,1*e*n,-(r+Df)*e,1*e*n,(r-Df)*e,0,Df*e,1*e*n,-(r+Df)*e,1*e*n,(r-Df)*e],indices:[3,4,5],outLineIndices:[0,1,2],normals:[1*e,-2*e,1,-2*e,1.5*e,1,1*e,1.5*e,1,0,0,0,0,0,0,0,0,0],dimensions:2}}function vf(e,t){let{width:n=2,height:r=3}=t;return{vertices:[0,0,1*e*n,1*r,1*e*n,-1*r,0,0,1*e*n,1*r,1*e*n,-1*r],outLineIndices:[0,1,2],indices:[3,4,5],normals:[0,-1.5*e,1,2,1*e,1,-2,1*e,1,0,0,0,0,0,0,0,0,0],dimensions:2}}function yf(e,t){let{width:n=2,height:r=2}=t;return{vertices:[0,r/2,e*n*1,r/2,e*n*1,-r/2,0,-r/2,0,r/2,e*n*1,r/2,e*n*1,-r/2,0,-r/2],dimensions:2,indices:[4,5,6,4,6,7],outLineIndices:[0,1,2,0,2,3],normals:[0,-e,1,1,0,1,0,-e,1,-1,-0,1,0,0,0,0,0,0,0,0,0,0,0,0]}}function bf(e,t){let{width:n=2,height:r=3}=t;return{vertices:[0,0,1*n*e,.5*r,2*n*e,0,1*n*e,-.5*r,0,0,1*n*e,.5*r,2*n*e,0,1*n*e,-.5*r],dimensions:2,indices:[4,5,6,4,6,7],outLineIndices:[0,1,2,0,2,3],normals:[0,-e,1,1,0,1,0,-e,1,-1,-0,1,0,0,0,0,0,0,0,0,0,0,0,0]}}function xf(e,t){let{width:n=2,height:r=3}=t;return{vertices:[0,0,2*e*n,1*r,1.5*e*n,0,2*e*n,-1*r,0,0,2*e*n,1*r,1.5*e*n,0,2*e*n,-1*r],dimensions:2,indices:[4,5,6,4,6,7],outLineIndices:[0,1,2,0,2,3],normals:[0,-e,1,1,0,1,0,-e,1,-1,-0,1,0,0,0,0,0,0,0,0,0,0,0,0]}}function Sf(e,t){let{width:n=2,height:r=2}=t,i=Hl(),a=Tf.default.flatten([i]),o=(0,Tf.default)(a.vertices,a.holes,a.dimensions),s=i.map(t=>[t[0]*n*e,t[1]*r]).flat();return{vertices:[...s,...s],dimensions:2,indices:o.map(e=>e+i.length),outLineIndices:o,normals:[...i.map(t=>[t[1]*r,t[0]*n*e,1]).flat(),...Array(i.length*3).fill(0)]}}function Cf(e,t=0,n){let r=typeof n.source==`object`?n.source.type:n.source,i=typeof n.target==`object`?n.target.type:n.target,{width:a=r?Ef[r]:0}=typeof n.source==`object`?n.source:{},{width:o=i?Ef[i]:0}=typeof n.target==`object`?n.target:{};return{vertices:[0,Df,1*a,...e,1,Df,-1*o,...e,1,-.5,-1*o,...e,0,-.5,1*a,...e,0,Df,1*a,...e,1,Df,-1*o,...e,1,-.5,-1*o,...e,0,-.5,1*a,...e],outLineIndices:[0,1,2,0,2,3].map(e=>e+t),indices:[4,5,6,4,6,7].map(e=>e+t),normals:[1,-1,1,1,1,1,-1,0,1,-1,0,1,0,0,0,0,0,0,0,0,0,0,0,0],dimensions:2}}function wf(e,t){let n=typeof e==`object`?e.type:e,r=t===`source`?1:-1,i=typeof e==`object`?e:{};switch(n){case`circle`:return Sf(r,i);case`triangle`:return vf(r,i);case`diamond`:return bf(r,i);case`rect`:return yf(r,i);case`classic`:return xf(r,i);case`halfTriangle`:return _f(r,i);default:return{vertices:[],indices:[],normals:[],dimensions:2,outLineIndices:[],outLineNormals:[]}}}var Tf,Ef,Df,Of=t((()=>{Tf=e(ol()),Jl(),Ef={circle:2,triangle:2,diamond:4,rect:2,classic:3,halfTriangle:2,none:0},Df=1/2}));function kf(e){let t=e.coordinates.flat();return{vertices:[1,0,0,...t,1,2,-3,...t,1,1,-3,...t,0,1,0,...t,0,0,0,...t,1,0,0,...t,1,2,-3,...t,1,1,-3,...t,0,1,0,...t,0,0,0,...t],normals:[-1,2,1,2,-1,1,1,-1,1,1,-1,1,-1,-1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],indices:[0,1,2,0,2,3,0,3,4,5,6,7,5,7,8,5,8,9],size:7}}function Af(e,t){return t?jf(e,t):kf(e)}function jf(e,t){let n=e.coordinates.flat(),{target:r=`classic`,source:i=`circle`}=t,a=Mf(wf(i,`source`),n,0,0),o=Cf(n,a.vertices.length/7,t),s=Mf(wf(r,`target`),n,1,a.vertices.length/7+o.vertices.length/7);return{vertices:[...a.vertices,...o.vertices,...s.vertices],indices:[...a.outLineIndices,...o.outLineIndices,...s.outLineIndices,...a.indices,...o.indices,...s.indices],normals:[...a.normals,...o.normals,...s.normals],size:7}}function Mf(e,t,n=1,r=0){let i=[],{vertices:a,indices:o,dimensions:s,outLineIndices:c}=e;for(let e=0;e<a.length;e+=s)i.push(n,a[e+1],a[e],...t);return{...e,vertices:i,indices:o.map(e=>e+r),outLineIndices:c.map(e=>e+r)}}var Nf=t((()=>{Of()})),Pf,Ff=t((()=>{Pf=`// #extension GL_OES_standard_derivatives : enable

in vec4 v_color;
out vec4 outputColor;

// line texture

#pragma include "picking"

void main() {
  outputColor = v_color;
  outputColor = filterColor(outputColor);
}
`})),If,Lf=t((()=>{If=`layout(location = ATTRIBUTE_LOCATION_POSITION) in vec3 a_Position;
layout(location = ATTRIBUTE_LOCATION_COLOR) in vec4 a_Color;
layout(location = ATTRIBUTE_LOCATION_SIZE) in vec2 a_Size;
layout(location = ATTRIBUTE_LOCATION_INSTANCE) in vec4 a_Instance;
layout(location = ATTRIBUTE_LOCATION_INSTANCE_64LOW) in vec4 a_Instance64Low;
layout(location = ATTRIBUTE_LOCATION_NORMAL) in vec3 a_Normal;

layout(std140) uniform commonUniorm {
  float u_gap_width: 1.0;
  float u_stroke_width: 1.0;
  float u_stroke_opacity: 1.0;
};

#pragma include "projection"
#pragma include "project"
#pragma include "picking"

out vec4 v_color;

vec2 project_pixel_offset(vec2 offsets) {
  vec2 data = project_pixel(offsets);

  return vec2(data.x, -data.y);
}

vec2 line_dir(vec2 target, vec2 source) {
  return normalize(ProjectFlat(target) - ProjectFlat(source));
}


void main() {
  // 透明度计算
  vec2 source_world = a_Instance.rg; // 起点
  vec2 target_world = a_Instance.ba; // 终点
  vec2 flowlineDir = line_dir(target_world, source_world);
  vec2 perpendicularDir = vec2(-flowlineDir.y, flowlineDir.x);

  vec2 position = mix(source_world, target_world, a_Position.x);
  vec2 position64Low = mix(a_Instance64Low.rg, a_Instance64Low.ba, a_Position.x);

  float lengthCommon = length(
    project_position(vec4(target_world, 0, 1)) - project_position(vec4(source_world, 0, 1))
  );
  vec2 offsetDistances = a_Size.x * project_pixel_offset(vec2(a_Position.y, a_Position.z)); // Mapbox || 高德
  vec2 limitedOffsetDistances = clamp(
    offsetDistances,
    project_pixel(-lengthCommon * 0.2),
    project_pixel(lengthCommon * 0.2)
  );

  float startOffsetCommon = project_pixel(offsets[0]);
  float endOffsetCommon = project_pixel(offsets[1]);
  float endpointOffset = mix(
    clamp(startOffsetCommon, 0.0, lengthCommon * 0.2),
    -clamp(endOffsetCommon, 0.0, lengthCommon * 0.2),
    a_Position.x
  );

  vec2 normalsCommon = u_stroke_width * project_pixel_offset(vec2(a_Normal.x, a_Normal.y));

  float gapCommon = -1. * project_pixel(u_gap_width);
  vec3 offsetCommon = vec3(
    flowlineDir * (limitedOffsetDistances[1] + normalsCommon.y + endpointOffset * 1.05) -
      perpendicularDir * (limitedOffsetDistances[0] + gapCommon + normalsCommon.x),
    0.0
  );

  vec4 project_pos = project_position(vec4(position.xy, 0, 1.0), position64Low);

  vec4 fillColor = vec4(a_Color.rgb, a_Color.a * opacity);
  v_color = mix(fillColor, vec4(u_stroke.xyz, u_stroke.w * fillColor.w * u_stroke_opacity), a_Normal.z);

  gl_Position = project_common_position_to_clipspace(vec4(project_pos.xy +  offsetCommon.xy, 0., 1.0));

  setPickingColor(a_PickingColor);
}
`})),Rf,zf=t((()=>{E(),D(),P(),Nf(),Ff(),Lf(),Rf=class extends N{get attributeLocation(){return Object.assign(super.attributeLocation,{MAX:super.attributeLocation.MAX,SIZE:9,INSTANCE:10,INSTANCE_64LOW:11,NORMAL:12})}getCommonUniformsInfo(){let{gapWidth:e=2,strokeWidth:t=1,strokeOpacity:n=1}=this.layer.getLayerConfig(),r={u_gap_width:e,u_stroke_width:t,u_stroke_opacity:n};return this.getUniformsBufferInfo(r)}async initModels(){return this.initUniformsBuffer(),this.buildModels()}async buildModels(){return[await this.layer.buildLayerModel({moduleName:`flow_line`,vertexShader:If,fragmentShader:Pf,defines:this.getDefines(),inject:this.getInject(),triangulation:Af,styleOption:this.layer.getLayerConfig().symbol,primitive:m.TRIANGLES,depth:{enable:!1},pick:!1})]}registerBuiltinAttributes(){this.styleAttributeService.registerStyleAttribute({name:`size`,type:k.Attribute,descriptor:{name:`a_Size`,shaderLocation:this.attributeLocation.SIZE,buffer:{usage:m.DYNAMIC_DRAW,data:[],type:m.FLOAT},size:2,update:e=>{let{size:t=1}=e;return Array.isArray(t)?[t[0],t[1]]:[t,0]}}}),this.styleAttributeService.registerStyleAttribute({name:`instance`,type:k.Attribute,descriptor:{name:`a_Instance`,shaderLocation:this.attributeLocation.INSTANCE,buffer:{usage:m.STATIC_DRAW,data:[],type:m.FLOAT},size:4,update:(e,t,n)=>[n[3],n[4],n[5],n[6]]}}),this.styleAttributeService.registerStyleAttribute({name:`instance64Low`,type:k.Attribute,descriptor:{name:`a_Instance64Low`,shaderLocation:this.attributeLocation.INSTANCE_64LOW,buffer:{usage:m.STATIC_DRAW,data:[],type:m.FLOAT},size:4,update:(e,t,n)=>[xn(n[3]),xn(n[4]),xn(n[5]),xn(n[6])]}}),this.styleAttributeService.registerStyleAttribute({name:`normal`,type:k.Attribute,descriptor:{name:`a_Normal`,shaderLocation:this.attributeLocation.NORMAL,buffer:{usage:m.STATIC_DRAW,data:[],type:m.FLOAT},size:3,update:(e,t,n,r,i)=>i}})}}})),Bf,Vf=t((()=>{Bf=`#define LineTypeSolid 0.0
#define LineTypeDash 1.0
#define Animate 0.0
#define LineTexture 1.0

uniform sampler2D u_texture;
layout(std140) uniform commonUniorm {
  vec4 u_animate: [ 1., 2., 1.0, 0.2 ];
  vec4 u_dash_array: [10.0, 5., 0, 0];
  vec4 u_sourceColor;
  vec4 u_targetColor;
  vec2 u_textSize;
  float segmentNumber;
  float u_line_type: 0.0;
  float u_icon_step: 100;
  float u_line_texture: 0.0;
  float u_textureBlend;
  float u_time;
  float u_linearColor: 0;
};

in vec4 v_dash_array;
in vec4 v_color;
in vec2 v_iconMapUV;
in vec4 v_line_data;
in float v_distance_ratio;

out vec4 outputColor;
#pragma include "picking"
#pragma include "project"
#pragma include "projection"

void main() {

  float animateSpeed = 0.0;
  float d_segmentIndex = v_line_data.g;

  // 设置弧线的底色
  if(u_linearColor == 1.0) { // 使用渐变颜色
    outputColor = mix(u_sourceColor, u_targetColor, d_segmentIndex/segmentNumber);
    outputColor.a *= v_color.a;
  } else { // 使用 color 方法传入的颜色
    outputColor = v_color;
  }

  // float blur = 1.- smoothstep(u_blur, 1., length(v_normal.xy));
  // float blur = smoothstep(1.0, u_blur, length(v_normal.xy));
  if(u_line_type == LineTypeDash) {
    float dashLength = mod(v_distance_ratio, v_dash_array.x + v_dash_array.y + v_dash_array.z + v_dash_array.w);
    if(dashLength < v_dash_array.x || (dashLength > (v_dash_array.x + v_dash_array.y) && dashLength <  v_dash_array.x + v_dash_array.y + v_dash_array.z)) {
      // 实线部分
    } else {
      // 虚线部分
      discard;
    };
  }

  // 设置弧线的动画模式
  if(u_animate.x == Animate) {
      animateSpeed = u_time / u_animate.y;
      float alpha =1.0 - fract( mod(1.0- v_distance_ratio, u_animate.z)* (1.0/ u_animate.z) + u_time / u_animate.y);
      alpha = (alpha + u_animate.w -1.0) / u_animate.w;
      alpha = smoothstep(0., 1., alpha);
      outputColor.a *= alpha;
  }

  // 设置弧线的贴图
  if(LineTexture == u_line_texture && u_line_type != LineTypeDash) {
    float arcRadio = smoothstep( 0.0, 1.0, (d_segmentIndex / (segmentNumber - 1.0)));
    // float arcRadio = d_segmentIndex / (segmentNumber - 1.0);
    float count = v_line_data.b; // 贴图在弧线上重复的数量
    float u = fract(arcRadio * count - animateSpeed * count);
    // float u = fract(arcRadio * count - animateSpeed);
    if(u_animate.x == Animate) {
      u = outputColor.a/v_color.a;
    }

    float v = v_line_data.a; // 线图层贴图部分的 v 坐标值

    vec2 uv= v_iconMapUV / u_textSize + vec2(u, v) / u_textSize * 64.;
    vec4 pattern = texture(SAMPLER_2D(u_texture), uv);

    // 设置贴图和底色的叠加模式
    if(u_textureBlend == 0.0) { // normal
      pattern.a = 0.0;
      outputColor = filterColor(outputColor + pattern);
    } else { // replace
        pattern.a *= v_color.a;
        if(outputColor.a <= 0.0) {
          pattern.a = 0.0;
        }
        outputColor = filterColor(pattern);
    }
  } else {
    outputColor = filterColor(outputColor);
  }

  // gl_FragColor = filterColor(gl_FragColor);
}
`})),Hf,Uf=t((()=>{Hf=`#define LineTypeSolid (0.0)
#define LineTypeDash (1.0)
#define Animate (0.0)
#define LineTexture (1.0)

layout(location = ATTRIBUTE_LOCATION_POSITION) in vec3 a_Position;
layout(location = ATTRIBUTE_LOCATION_COLOR) in vec4 a_Color;
layout(location = ATTRIBUTE_LOCATION_SIZE) in float a_Size;
layout(location = ATTRIBUTE_LOCATION_INSTANCE) in vec4 a_Instance;
layout(location = ATTRIBUTE_LOCATION_INSTANCE_64LOW) in vec4 a_Instance64Low;
layout(location = ATTRIBUTE_LOCATION_UV) in vec2 a_iconMapUV;

layout(std140) uniform commonUniorm {
  vec4 u_animate: [ 1., 2., 1.0, 0.2 ];
  vec4 u_dash_array: [10.0, 5., 0, 0];
  vec4 u_sourceColor;
  vec4 u_targetColor;
  vec2 u_textSize;
  float segmentNumber;
  float u_line_type: 0.0;
  float u_icon_step: 100;
  float u_line_texture: 0.0;
  float u_textureBlend;
  float u_time;
  float u_linearColor: 0;
};

out vec4 v_dash_array;
out vec4 v_color;
out vec2 v_iconMapUV;
out vec4 v_line_data;
out float v_distance_ratio;

#pragma include "projection"
#pragma include "project"
#pragma include "picking"

float maps(float value, float start1, float stop1, float start2, float stop2) {
  return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
}

float getSegmentRatio(float index) {
  return index / (segmentNumber - 1.0);
}

float paraboloid(vec2 source, vec2 target, float ratio) {
  vec2 x = mix(source, target, ratio);
  vec2 center = mix(source, target, 0.5);
  float dSourceCenter = distance(source, center);
  float dXCenter = distance(x, center);
  return (dSourceCenter + dXCenter) * (dSourceCenter - dXCenter);
}

vec3 getPos(vec2 source, vec2 target, float segmentRatio) {
  float vertex_height = paraboloid(source, target, segmentRatio);

  return vec3(mix(source, target, segmentRatio), sqrt(max(0.0, vertex_height)));
}
vec2 getExtrusionOffset(vec2 line_clipspace, float offset_direction) {
  // normalized direction of the line
  vec2 dir_screenspace = normalize(line_clipspace);
  // rotate by 90 degrees
  dir_screenspace = vec2(-dir_screenspace.y, dir_screenspace.x);
  vec2 offset = dir_screenspace * offset_direction * setPickingSize(a_Size) / 2.0;
  return offset;
}
vec2 getNormal(vec2 line_clipspace, float offset_direction) {
  // normalized direction of the line
  vec2 dir_screenspace = normalize(line_clipspace);
  // rotate by 90 degrees
  dir_screenspace = vec2(-dir_screenspace.y, dir_screenspace.x);
  return dir_screenspace.xy * sign(offset_direction);
}
float getAngularDist(vec2 source, vec2 target) {
  vec2 delta = source - target;
  vec2 sin_half_delta = sin(delta / 2.0);
  float a =
    sin_half_delta.y * sin_half_delta.y +
    cos(source.y) * cos(target.y) * sin_half_delta.x * sin_half_delta.x;
  return 2.0 * atan(sqrt(a), sqrt(1.0 - a));
}

vec2 midPoint(vec2 source, vec2 target) {
  vec2 center = target - source;
  float r = length(center);
  float theta = atan(center.y, center.x);
  float thetaOffset = 0.314;
  float r2 = r / 2.0 / cos(thetaOffset);
  float theta2 = theta + thetaOffset;
  vec2 mid = vec2(r2 * cos(theta2) + source.x, r2 * sin(theta2) + source.y);
  return mid;
}
float bezier3(vec3 arr, float t) {
  float ut = 1.0 - t;
  return (arr.x * ut + arr.y * t) * ut + (arr.y * ut + arr.z * t) * t;
}

vec2 interpolate(vec2 source, vec2 target, float angularDist, float t) {
  if (abs(angularDist - PI) < 0.001) {
    return (1.0 - t) * source + t * target;
  }
  float a = sin((1.0 - t) * angularDist) / sin(angularDist);
  float b = sin(t * angularDist) / sin(angularDist);
  vec2 sin_source = sin(source);
  vec2 cos_source = cos(source);
  vec2 sin_target = sin(target);
  vec2 cos_target = cos(target);
  float x = a * cos_source.y * cos_source.x + b * cos_target.y * cos_target.x;
  float y = a * cos_source.y * sin_source.x + b * cos_target.y * sin_target.x;
  float z = a * sin_source.y + b * sin_target.y;
  return vec2(atan(y, x), atan(z, sqrt(x * x + y * y)));

}

void main() {
  v_color = a_Color;
  v_color.a = v_color.a * opacity;
  vec2 source = radians(a_Instance.rg);
  vec2 target = radians(a_Instance.ba);
  float angularDist = getAngularDist(source, target);
  float segmentIndex = a_Position.x;
  float segmentRatio = getSegmentRatio(segmentIndex);
  float indexDir = mix(-1.0, 1.0, step(segmentIndex, 0.0));

  if (u_line_type == LineTypeDash) {
    v_distance_ratio = segmentIndex / segmentNumber;
    float total_Distance = pixelDistance(source, target) / 2.0 * PI;
    total_Distance = total_Distance * 16.0; // total_Distance*16.0 调整默认的效果
    v_dash_array = pow(2.0, 20.0 - u_Zoom) * u_dash_array / total_Distance;
  }

  if (u_animate.x == Animate) {
    v_distance_ratio = segmentIndex / segmentNumber;
  }

  float nextSegmentRatio = getSegmentRatio(segmentIndex + indexDir);
  v_distance_ratio = segmentIndex / segmentNumber;

  vec4 curr = project_position(vec4(degrees(interpolate(source, target, angularDist, segmentRatio)), 0.0, 1.0), a_Instance64Low.xy);
  vec4 next = project_position(vec4(degrees(interpolate(source, target, angularDist, nextSegmentRatio)), 0.0, 1.0), a_Instance64Low.zw);

  // v_normal = getNormal((next.xy - curr.xy) * indexDir, a_Position.y);
  vec2 offset = project_pixel(getExtrusionOffset((next.xy - curr.xy) * indexDir, a_Position.y));
  //  vec4 project_pos = project_position(vec4(curr.xy, 0, 1.0));
  // gl_Position = project_common_position_to_clipspace(vec4(curr.xy + offset, curr.z, 1.0));

  v_line_data.g = a_Position.x; // 该顶点在弧线上的分段排序
  if (LineTexture == u_line_texture) {
    float d_arcDistrance = length(source - target);
    d_arcDistrance = project_pixel(d_arcDistrance);

    float d_pixelLen = project_pixel(u_icon_step) / 8.0;
    v_line_data.b = floor(d_arcDistrance / d_pixelLen); // 贴图在弧线上重复的数量

    float lineOffsetWidth = length(offset + offset * sign(a_Position.y)); // 线横向偏移的距离
    float linePixelSize = project_pixel(a_Size); // 定点位置偏移，按地图等级缩放后的距离
    v_line_data.a = lineOffsetWidth / linePixelSize; // 线图层贴图部分的 v 坐标值

    v_iconMapUV = a_iconMapUV;
  }

  gl_Position = project_common_position_to_clipspace(vec4(curr.xy + offset, 0, 1.0));
  setPickingColor(a_PickingColor);
}

`})),Wf,Gf,Kf=t((()=>{E(),D(),P(),F(),Vf(),Uf(),Wf={solid:0,dash:1},Gf=class extends N{constructor(...e){super(...e),this.updateTexture=()=>{let{createTexture2D:e}=this.rendererService;this.texture?(this.texture.update({data:this.iconService.getCanvas()}),this.layer.render()):(this.texture=e({data:this.iconService.getCanvas(),mag:m.NEAREST,min:m.NEAREST,premultiplyAlpha:!1,width:1024,height:this.iconService.canvasHeight||128}),this.textures=[this.texture])}}get attributeLocation(){return Object.assign(super.attributeLocation,{MAX:super.attributeLocation.MAX,SIZE:9,INSTANCE:10,INSTANCE_64LOW:11,UV:12})}getCommonUniformsInfo(){let{sourceColor:e,targetColor:t,textureBlend:n=`normal`,lineType:r=`solid`,dashArray:i=[10,5],lineTexture:a=!1,iconStep:o=100,segmentNumber:s=30}=this.layer.getLayerConfig(),{animateOption:c}=this.layer.getLayerConfig();i.length===2&&i.push(0,0),this.rendererService.getDirty()&&this.texture?.bind();let l=0,u=[0,0,0,0],d=[0,0,0,0];e&&t&&(u=A(e),d=A(t),l=1);let f=this.layer.getLayerAnimateTime();isNaN(f)&&(f=0);let p={u_animate:this.animateOption2Array(c),u_dash_array:i,u_sourceColor:u,u_targetColor:d,u_textSize:[1024,this.iconService.canvasHeight||128],segmentNumber:s,u_line_type:Wf[r]||0,u_icon_step:o,u_line_texture:+!!a,u_textureBlend:n===`normal`?0:1,u_time:f,u_linearColor:l};return this.getUniformsBufferInfo(p)}async initModels(){return this.initUniformsBuffer(),this.updateTexture(),this.iconService.on(`imageUpdate`,this.updateTexture),this.buildModels()}clearModels(){this.texture?.destroy(),this.iconService.off(`imageUpdate`,this.updateTexture)}async buildModels(){let{segmentNumber:e=30}=this.layer.getLayerConfig();return[await this.layer.buildLayerModel({moduleName:`lineGreatCircle`,vertexShader:Hf,fragmentShader:Bf,triangulation:vu,styleOption:{segmentNumber:e},defines:this.getDefines(),inject:this.getInject(),depth:{enable:!1}})]}registerBuiltinAttributes(){this.styleAttributeService.registerStyleAttribute({name:`size`,type:k.Attribute,descriptor:{name:`a_Size`,shaderLocation:this.attributeLocation.SIZE,buffer:{usage:m.DYNAMIC_DRAW,data:[],type:m.FLOAT},size:1,update:e=>{let{size:t=1}=e;return Array.isArray(t)?[t[0]]:[t]}}}),this.styleAttributeService.registerStyleAttribute({name:`instance`,type:k.Attribute,descriptor:{name:`a_Instance`,shaderLocation:this.attributeLocation.INSTANCE,buffer:{usage:m.STATIC_DRAW,data:[],type:m.FLOAT},size:4,update:(e,t,n)=>[n[3],n[4],n[5],n[6]]}}),this.styleAttributeService.registerStyleAttribute({name:`instance64Low`,type:k.Attribute,descriptor:{name:`a_Instance64Low`,shaderLocation:this.attributeLocation.INSTANCE_64LOW,buffer:{usage:m.STATIC_DRAW,data:[],type:m.FLOAT},size:4,update:(e,t,n)=>[xn(n[3]),xn(n[4]),xn(n[5]),xn(n[6])]}}),this.styleAttributeService.registerStyleAttribute({name:`uv`,type:k.Attribute,descriptor:{name:`a_iconMapUV`,shaderLocation:this.attributeLocation.UV,buffer:{usage:m.DYNAMIC_DRAW,data:[],type:m.FLOAT},size:2,update:e=>{let t=this.iconService.getIconMap(),{texture:n}=e,{x:r,y:i}=t[n]||{x:0,y:0};return[r,i]}}})}}})),qf,Jf=t((()=>{qf=`// #extension GL_OES_standard_derivatives : enable
#define Animate 0.0
#define LineTexture 1.0

uniform sampler2D u_texture;
layout(std140) uniform commonUniorm {
  vec4 u_animate: [ 1., 2., 1.0, 0.2 ];
  vec4 u_dash_array;
  vec4 u_blur;
  vec4 u_sourceColor;
  vec4 u_targetColor;
  vec2 u_textSize;
  float u_icon_step: 100;
  float u_heightfixed: 0.0;
  float u_vertexScale: 1.0;
  float u_raisingHeight: 0.0;
  float u_strokeWidth: 0.0;
  float u_textureBlend;
  float u_line_texture;
  float u_linearDir: 1.0;
  float u_linearColor: 0;
  float u_time;
};

in vec4 v_color;
in vec4 v_stroke;
// dash
in vec4 v_dash_array;
in float v_d_distance_ratio;
in vec2 v_iconMapUV;
in vec4 v_texture_data;

out vec4 outputColor;
#pragma include "picking"

// [animate, duration, interval, trailLength],
void main() {
  if(u_dash_array!=vec4(0.0)){
    float dashLength = mod(v_d_distance_ratio, v_dash_array.x + v_dash_array.y + v_dash_array.z + v_dash_array.w);
    if(!(dashLength < v_dash_array.x || (dashLength > (v_dash_array.x + v_dash_array.y) && dashLength <  v_dash_array.x + v_dash_array.y + v_dash_array.z))) {
      // 虚线部分
      discard;
    };
  }
  float animateSpeed = 0.0; // 运动速度
  float d_distance_ratio = v_texture_data.r; // 当前点位距离占线总长的比例
  if(u_linearDir < 1.0) {
    d_distance_ratio = v_texture_data.a;
  }
  if(u_linearColor == 1.0) { // 使用渐变颜色
    outputColor = mix(u_sourceColor, u_targetColor, d_distance_ratio);
    outputColor.a *= v_color.a;
  } else { // 使用 color 方法传入的颜色
     outputColor = v_color;
  }
  // anti-alias
  // float blur = 1.0 - smoothstep(u_blur, 1., length(v_normal.xy));
  if(u_animate.x == Animate) {
      animateSpeed = u_time / u_animate.y;
       float alpha =1.0 - fract( mod(1.0- d_distance_ratio, u_animate.z)* (1.0/ u_animate.z) + animateSpeed);
      alpha = (alpha + u_animate.w -1.0) / u_animate.w;
      alpha = smoothstep(0., 1., alpha);
      outputColor.a *= alpha;
  }

  if(u_line_texture == LineTexture) { // while load texture
    float aDistance = v_texture_data.g;      // 当前顶点的距离
    float d_texPixelLen = v_texture_data.b;  // 贴图的像素长度，根据地图层级缩放
    float u = fract(mod(aDistance, d_texPixelLen)/d_texPixelLen - animateSpeed);
    float v = v_texture_data.a;  // 线图层贴图部分的 v 坐标值

    // v = max(smoothstep(0.95, 1.0, v), v);
    vec2 uv= v_iconMapUV / u_textSize + vec2(u, v) / u_textSize * 64.;
     vec4 pattern = texture(SAMPLER_2D(u_texture), uv);

    if(u_textureBlend == 0.0) { // normal
      pattern.a = 0.0;
      outputColor += pattern;
    } else { // replace
        pattern.a *= v_color.a;
        if(outputColor.a <= 0.0) {
          pattern.a = 0.0;
        }
        outputColor = pattern;
    }
  } 

  float v = v_texture_data.a;
  float strokeWidth = min(0.5, u_strokeWidth);
  // 绘制 border
  if(strokeWidth > 0.01) {
    float borderOuterWidth = strokeWidth / 2.0;


    if(v >= 1.0 - strokeWidth || v <= strokeWidth) {
      if(v > strokeWidth) { // 外侧
        float linear = smoothstep(0.0, 1.0, (v - (1.0 - strokeWidth))/strokeWidth);
        //  float linear = step(0.0, (v - (1.0 - borderWidth))/borderWidth);
        outputColor.rgb = mix(outputColor.rgb, v_stroke.rgb, linear);
      } else if(v <= strokeWidth) {
        float linear = smoothstep(0.0, 1.0, v/strokeWidth);
        outputColor.rgb = mix(v_stroke.rgb, outputColor.rgb, linear);
      }
    }

    if(v < borderOuterWidth) {
      outputColor.a = mix(0.0, outputColor.a, v/borderOuterWidth);
    } else if(v > 1.0 - borderOuterWidth) {
      outputColor.a = mix(outputColor.a, 0.0, (v - (1.0 - borderOuterWidth))/borderOuterWidth);
    }
  }

  // blur
  float blurV = v_texture_data.a;
  if(blurV < 0.5) {
    outputColor.a *= mix(u_blur.r, u_blur.g, blurV/0.5);
  } else {
    outputColor.a *= mix(u_blur.g, u_blur.b, (blurV - 0.5)/0.5);
  }
  
  outputColor = filterColor(outputColor);
}
`})),Yf,Xf=t((()=>{Yf=`#define Animate (0.0)

layout(location = ATTRIBUTE_LOCATION_POSITION) in vec3 a_Position;
layout(location = ATTRIBUTE_LOCATION_POSITION_64LOW) in vec2 a_Position64Low;
layout(location = ATTRIBUTE_LOCATION_COLOR) in vec4 a_Color;
layout(location = ATTRIBUTE_LOCATION_SIZE) in vec2 a_Size;
layout(location = ATTRIBUTE_LOCATION_DISTANCE_INDEX) in vec3 a_DistanceAndIndexAndMiter;
layout(location = ATTRIBUTE_LOCATION_NORMAL) in vec4 a_Normal_Total_Distance;
layout(location = ATTRIBUTE_LOCATION_UV) in vec2 a_iconMapUV;

layout(std140) uniform commonUniorm {
  vec4 u_animate: [ 1., 2., 1.0, 0.2 ];
  vec4 u_dash_array;
  vec4 u_blur;
  vec4 u_sourceColor;
  vec4 u_targetColor;
  vec2 u_textSize;
  float u_icon_step: 100;
  float u_heightfixed: 0.0;
  float u_vertexScale: 1.0;
  float u_raisingHeight: 0.0;
  float u_strokeWidth: 0.0;
  float u_textureBlend;
  float u_line_texture;
  float u_linearDir: 1.0;
  float u_linearColor: 0;
  float u_time;
};

out vec4 v_color;
out vec4 v_stroke;
//dash
out vec4 v_dash_array;
out float v_d_distance_ratio;
// texV 线图层 - 贴图部分的 v 坐标（线的宽度方向）
out vec2 v_iconMapUV;
out vec4 v_texture_data;

#pragma include "projection"
#pragma include "picking"

void main() {
  vec2 a_DistanceAndIndex = a_DistanceAndIndexAndMiter.xy;
  float a_Miter = a_DistanceAndIndexAndMiter.z;
  vec3 a_Normal = a_Normal_Total_Distance.xyz;
  float a_Total_Distance = a_Normal_Total_Distance.w;
  //dash输出
  v_dash_array = pow(2.0, 20.0 - u_Zoom) * u_dash_array / a_Total_Distance;
  v_d_distance_ratio = a_DistanceAndIndex.x / a_Total_Distance;

  // cal style mapping - 数据纹理映射部分的计算
  float d_texPixelLen; // 贴图的像素长度，根据地图层级缩放
  v_iconMapUV = a_iconMapUV;
  d_texPixelLen = project_float_pixel(u_icon_step);

  v_color = a_Color;
  v_color.a *= opacity;
  v_stroke = stroke;

  vec3 size = a_Miter * setPickingSize(a_Size.x) * a_Normal;

  vec2 offset = project_pixel(size.xy);

  float lineDistance = a_DistanceAndIndex.x;
  float currentLinePointRatio = lineDistance / a_Total_Distance;

  float lineOffsetWidth = length(offset + offset * sign(a_Miter)); // 线横向偏移的距离（向两侧偏移的和）
  float linePixelSize = project_pixel(a_Size.x) * 2.0; // 定点位置偏移，按地图等级缩放后的距离 单侧 * 2
  float texV = lineOffsetWidth / linePixelSize; // 线图层贴图部分的 v 坐标值

  v_texture_data = vec4(currentLinePointRatio, lineDistance, d_texPixelLen, texV);
  // 设置数据集的参数

  vec4 project_pos = project_position(vec4(a_Position.xy, 0, 1.0), a_Position64Low);

  // gl_Position = project_common_position_to_clipspace(vec4(project_pos.xy + offset, a_Size.y, 1.0));

  float h = float(a_Position.z) * u_vertexScale; // 线顶点的高度 - 兼容不存在第三个数值的情况 vertex height
  float lineHeight = a_Size.y; // size 第二个参数代表的高度 [linewidth, lineheight]

  // 兼容 mapbox 在线高度上的效果表现基本一致
  if (
    u_CoordinateSystem == COORDINATE_SYSTEM_LNGLAT ||
    u_CoordinateSystem == COORDINATE_SYSTEM_LNGLAT_OFFSET
  ) {
    // mapbox
    // 保持高度相对不变
    float mapboxZoomScale = 4.0 / pow(2.0, 21.0 - u_Zoom);
    h *= mapboxZoomScale;
    h += u_raisingHeight * mapboxZoomScale;
    if (u_heightfixed > 0.0) {
      lineHeight *= mapboxZoomScale;
    }
  }

  gl_Position = project_common_position_to_clipspace(
    vec4(project_pos.xy + offset, lineHeight + h, 1.0)
  );

  setPickingColor(a_PickingColor);
}
`})),Zf,Qf=t((()=>{E(),D(),P(),yl(),F(),Jf(),Xf(),Zf=class extends N{constructor(...e){super(...e),this.textureEventFlag=!1,this.texture=this.createTexture2D({data:new Uint8Array([0,0,0,0]),width:1,height:1}),this.updateTexture=()=>{let{createTexture2D:e}=this.rendererService;this.textures.length===0&&(this.textures=[this.texture]),this.texture?(this.texture.update({data:this.iconService.getCanvas()}),this.layer.render()):this.texture=e({data:this.iconService.getCanvas(),mag:m.NEAREST,min:m.NEAREST,premultiplyAlpha:!1,width:1024,height:this.iconService.canvasHeight||128})}}get attributeLocation(){return Object.assign(super.attributeLocation,{MAX:super.attributeLocation.MAX,SIZE:9,DISTANCE_INDEX:10,NORMAL:11,UV:12})}getCommonUniformsInfo(){let{sourceColor:e,targetColor:t,textureBlend:n=`normal`,lineType:r=`solid`,dashArray:i=[10,5,0,0],lineTexture:a=!1,iconStep:o=100,vertexHeightScale:s=20,strokeWidth:c=0,raisingHeight:l=0,heightfixed:u=!1,linearDir:d=hl.VERTICAL,blur:f=[1,1,1,0]}=this.layer.getLayerConfig(),p=i;r!==`dash`&&(p=[0,0,0,0]),p.length===2&&p.push(0,0),this.rendererService.getDirty()&&this.texture&&this.texture?.bind();let{animateOption:m}=this.layer.getLayerConfig(),h=0,g=[0,0,0,0],_=[0,0,0,0];e&&t&&(g=A(e),_=A(t),h=1);let v={u_animate:this.animateOption2Array(m),u_dash_array:p,u_blur:f,u_sourceColor:g,u_targetColor:_,u_textSize:[1024,this.iconService.canvasHeight||128],u_icon_step:o,u_heightfixed:Number(u),u_vertexScale:s,u_raisingHeight:Number(l),u_strokeWidth:c,u_textureBlend:n===gl.NORMAL?0:1,u_line_texture:+!!a,u_linearDir:+(d===hl.VERTICAL),u_linearColor:h,u_time:this.layer.getLayerAnimateTime()||0};return this.getUniformsBufferInfo(v)}async initModels(){return this.initUniformsBuffer(),this.textureEventFlag||(this.textureEventFlag=!0,this.updateTexture(),this.iconService.on(`imageUpdate`,this.updateTexture)),this.buildModels()}clearModels(){this.texture?.destroy(),this.iconService.off(`imageUpdate`,this.updateTexture)}async buildModels(){let{depth:e=!1}=this.layer.getLayerConfig(),{frag:t,vert:n,type:r}=this.getShaders();return this.layer.triangulation=su,[await this.layer.buildLayerModel({moduleName:`line`+r,vertexShader:n,fragmentShader:t,triangulation:su,defines:this.getDefines(),inject:this.getInject(),depth:{enable:e}})]}getShaders(){return{frag:qf,vert:Yf,type:``}}registerBuiltinAttributes(){this.registerPosition64LowAttribute(),this.styleAttributeService.registerStyleAttribute({name:`distanceAndIndex`,type:k.Attribute,descriptor:{name:`a_DistanceAndIndexAndMiter`,shaderLocation:this.attributeLocation.DISTANCE_INDEX,buffer:{usage:m.STATIC_DRAW,data:[],type:m.FLOAT},size:3,update:(e,t,n,r,i,a)=>a===void 0?[n[3],10,n[4]]:[n[3],a,n[4]]}}),this.styleAttributeService.registerStyleAttribute({name:`size`,type:k.Attribute,descriptor:{name:`a_Size`,shaderLocation:this.attributeLocation.SIZE,buffer:{usage:m.DYNAMIC_DRAW,data:[],type:m.FLOAT},size:2,update:e=>{let{size:t=1}=e;return Array.isArray(t)?[t[0],t[1]]:[t,0]}}}),this.styleAttributeService.registerStyleAttribute({name:`normal_total_distance`,type:k.Attribute,descriptor:{name:`a_Normal_Total_Distance`,shaderLocation:this.attributeLocation.NORMAL,buffer:{usage:m.STATIC_DRAW,data:[],type:m.FLOAT},size:4,update:(e,t,n,r,i)=>[...i,n[5]]}}),this.styleAttributeService.registerStyleAttribute({name:`uv`,type:k.Attribute,descriptor:{name:`a_iconMapUV`,shaderLocation:this.attributeLocation.UV,buffer:{usage:m.DYNAMIC_DRAW,data:[],type:m.FLOAT},size:2,update:e=>{let t=this.iconService.getIconMap(),{texture:n}=e,{x:r,y:i}=t[n]||{x:0,y:0};return[r,i]}}})}}})),$f,ep=t((()=>{$f=`
layout(std140) uniform commonUniorm {
  vec4 u_sourceColor;
  vec4 u_targetColor;
  vec4 u_dash_array;
  float u_vertexScale: 1.0;
  float u_linearColor: 0;
};
in float v_distanceScale;
in vec4 v_color;
//dash
in vec4 v_dash_array;

out vec4 outputColor;
void main() {
  if(u_dash_array!=vec4(0.0)){
    float dashLength = mod(v_distanceScale, v_dash_array.x + v_dash_array.y + v_dash_array.z + v_dash_array.w);
    if(!(dashLength < v_dash_array.x || (dashLength > (v_dash_array.x + v_dash_array.y) && dashLength <  v_dash_array.x + v_dash_array.y + v_dash_array.z))) {
      // 虚线部分
      discard;
    };
  }
  if(u_linearColor==1.0){
    outputColor = mix(u_sourceColor, u_targetColor, v_distanceScale);
    outputColor.a *= v_color.a; // 全局透明度
  }
  else{
    outputColor = v_color;
  }
}
`})),tp,np=t((()=>{tp=`layout(location = ATTRIBUTE_LOCATION_POSITION) in vec3 a_Position;
layout(location = ATTRIBUTE_LOCATION_POSITION_64LOW) in vec2 a_Position64Low;
layout(location = ATTRIBUTE_LOCATION_COLOR) in vec4 a_Color;
layout(location = ATTRIBUTE_LOCATION_SIZE) in vec4 a_SizeDistanceAndTotalDistance;

layout(std140) uniform commonUniorm {
  vec4 u_sourceColor;
  vec4 u_targetColor;
  vec4 u_dash_array;
  float u_vertexScale: 1.0;
  float u_linearColor: 0;
};

#pragma include "projection"
#pragma include "picking"

out vec4 v_color;
out float v_distanceScale;
out vec4 v_dash_array;

void main() {
  //dash输出
  v_dash_array = pow(2.0, 20.0 - u_Zoom) * u_dash_array / a_SizeDistanceAndTotalDistance.a;

  v_color = a_Color;
  v_distanceScale = a_SizeDistanceAndTotalDistance.b / a_SizeDistanceAndTotalDistance.a;
  v_color.a = v_color.a * opacity;
  vec4 project_pos = project_position(vec4(a_Position.xy, 0, 1.0), a_Position64Low);

  float h = float(a_Position.z) * u_vertexScale; // 线顶点的高度 - 兼容不存在第三个数值的情况

  float lineHeight = a_SizeDistanceAndTotalDistance.y;
  // 兼容 mapbox 在线高度上的效果表现基本一致
  if (
    u_CoordinateSystem == COORDINATE_SYSTEM_LNGLAT ||
    u_CoordinateSystem == COORDINATE_SYSTEM_LNGLAT_OFFSET
  ) {
    // 保持高度相对不变
    h *= 2.0 / pow(2.0, 20.0 - u_Zoom);
  }

  gl_Position = project_common_position_to_clipspace(vec4(project_pos.xy, lineHeight + h, 1.0));
  gl_PointSize = 10.0;

}
`})),rp,ip=t((()=>{E(),D(),P(),F(),ep(),np(),rp=class extends N{get attributeLocation(){return Object.assign(super.attributeLocation,{MAX:super.attributeLocation.MAX,SIZE:9})}getCommonUniformsInfo(){let{sourceColor:e,targetColor:t,lineType:n=`solid`,dashArray:r=[10,5,0,0],vertexHeightScale:i=20}=this.layer.getLayerConfig(),a=r;n!==`dash`&&(a=[0,0,0,0]),a.length===2&&a.push(0,0);let o=0,s=[0,0,0,0],c=[0,0,0,0];e&&t&&(s=A(e),c=A(t),o=1);let l={u_sourceColor:s,u_targetColor:c,u_dash_array:a,u_vertexScale:i,u_linearColor:o};return this.getUniformsBufferInfo(l)}async initModels(){return this.buildModels()}getShaders(){return{frag:$f,vert:tp,type:`lineSimpleNormal`}}async buildModels(){this.initUniformsBuffer();let{frag:e,vert:t,type:n}=this.getShaders();return[await this.layer.buildLayerModel({moduleName:n,vertexShader:t,fragmentShader:e,triangulation:cu,defines:this.getDefines(),inject:this.getInject(),primitive:m.LINES,depth:{enable:!1},pick:!1})]}registerBuiltinAttributes(){this.registerPosition64LowAttribute(),this.styleAttributeService.registerStyleAttribute({name:`sizeDistanceAndTotalDistance`,type:k.Attribute,descriptor:{name:`a_SizeDistanceAndTotalDistance`,shaderLocation:this.attributeLocation.SIZE,buffer:{usage:m.STATIC_DRAW,data:[],type:m.FLOAT},size:4,update:(e,t,n)=>{let{size:r=1}=e,i=Array.isArray(r)?[r[0],r[1]]:[r,0];return[i[0],i[1],n[3],n[5]]}}})}}})),ap,op=t((()=>{ap=`#define Animate 0.0
#define LineTexture 1.0

// line texture

uniform sampler2D u_texture;
layout(std140) uniform commonUniorm {
  vec4 u_animate: [ 1., 2., 1.0, 0.2 ];
  vec4 u_sourceColor;
  vec4 u_targetColor;
  vec2 u_textSize;
  float u_icon_step: 100;
  float u_heightfixed;
  float u_linearColor: 0;
  float u_line_texture;
  float u_textureBlend;
  float u_iconStepCount;
  float u_time;
};


in vec2 v_iconMapUV;
in vec4 v_color;
in float v_blur;
in vec4 v_dataset;

out vec4 outputColor;

#pragma include "picking"

void main() {
  float animateSpeed = 0.0; // 运动速度
  float d_distance_ratio = v_dataset.r; // 当前点位距离占线总长的比例
  float v = v_dataset.a;

  if(u_linearColor == 1.0) { // 使用渐变颜色
    outputColor = mix(u_sourceColor, u_targetColor, v);
  } else { // 使用 color 方法传入的颜色
     outputColor = v_color;
  }

  outputColor.a *= v_color.a; // 全局透明度
  if(u_animate.x == Animate) {
      animateSpeed = u_time / u_animate.y;
       float alpha =1.0 - fract( mod(1.0- d_distance_ratio, u_animate.z)* (1.0/ u_animate.z) + animateSpeed);
      alpha = (alpha + u_animate.w -1.0) / u_animate.w;
      alpha = smoothstep(0., 1., alpha);
      outputColor.a *= alpha;
  }

  if(u_line_texture == LineTexture) { // while load texture
    float aDistance = v_dataset.g;      // 当前顶点的距离
    float d_texPixelLen = v_dataset.b;  // 贴图的像素长度，根据地图层级缩放
    float u = fract(mod(aDistance, d_texPixelLen)/d_texPixelLen - animateSpeed);
    float v = v_dataset.a;  // 线图层贴图部分的 v 坐标值

    // 计算纹理间隔 start
    float flag = 0.0;
    if(u > 1.0/u_iconStepCount) {
      flag = 1.0;
    }
    u = fract(u*u_iconStepCount);
    // 计算纹理间隔 end

    vec2 uv= v_iconMapUV / u_textSize + vec2(u, v) / u_textSize * 64.;
    vec4 pattern = texture(SAMPLER_2D(u_texture), uv);

    // Tip: 判断纹理间隔
    if(flag > 0.0) {
      pattern = vec4(0.0);
    }

    if(u_textureBlend == 0.0) { // normal
      pattern.a = 0.0;
      outputColor = filterColor(outputColor + pattern);
    } else { // replace
        pattern.a *= v_color.a;
        if(outputColor.a <= 0.0) {
          pattern.a = 0.0;
        }
        outputColor = filterColor(pattern);
    }
  }


  // blur - AA
  if(v < v_blur) {
    outputColor.a = mix(0.0, outputColor.a, v/v_blur);
  } else if(v > 1.0 - v_blur) {
    outputColor.a = mix(outputColor.a, 0.0, (v - (1.0 - v_blur))/v_blur);
  }

  outputColor = filterColor(outputColor);
}
`})),sp,cp=t((()=>{sp=`#define Animate 0.0
layout(location = ATTRIBUTE_LOCATION_POSITION) in vec3 a_Position;
layout(location = ATTRIBUTE_LOCATION_POSITION_64LOW) in vec2 a_Position64Low;
layout(location = ATTRIBUTE_LOCATION_COLOR) in vec4 a_Color;
layout(location = ATTRIBUTE_LOCATION_SIZE) in vec2 a_Size;
layout(location = ATTRIBUTE_LOCATION_NORMAL) in vec3 a_Normal;
layout(location = ATTRIBUTE_LOCATION_UV) in vec2 a_iconMapUV;
layout(location = ATTRIBUTE_LOCATION_DISTANCE_MITER_TOTAL) in vec3 a_Distance_Total_Miter;

layout(std140) uniform commonUniorm {
  vec4 u_animate: [ 1., 2., 1.0, 0.2 ];
  vec4 u_sourceColor;
  vec4 u_targetColor;
  vec2 u_textSize;
  float u_icon_step: 100;
  float u_heightfixed;
  float u_linearColor: 0;
  float u_line_texture;
  float u_textureBlend;
  float u_iconStepCount;
  float u_time;
};

// texV 线图层 - 贴图部分的 v 坐标（线的宽度方向）
out vec2 v_iconMapUV;
out vec4 v_color;
out float v_blur;
out vec4 v_dataset;

#pragma include "projection"
#pragma include "light"
#pragma include "picking"

void main() {
  float a_Distance = a_Distance_Total_Miter.x;
  float a_Miter = a_Distance_Total_Miter.y;
  float a_Total_Distance = a_Distance_Total_Miter.z;

  float d_distance_ratio; // 当前点位距离占线总长的比例
  float d_texPixelLen; // 贴图的像素长度，根据地图层级缩放

  v_iconMapUV = a_iconMapUV;
  if (u_heightfixed < 1.0) {
    // 高度随 zoom 调整
    d_texPixelLen = project_pixel(u_icon_step);
  } else {
    d_texPixelLen = u_icon_step;
  }

  if (u_animate.x == Animate || u_linearColor == 1.0) {
    d_distance_ratio = a_Distance / a_Total_Distance;
  }

  float miter = (a_Miter + 1.0) / 2.0;
  // 设置数据集的参数
  v_dataset[0] = d_distance_ratio; // 当前点位距离占线总长的比例
  v_dataset[1] = a_Distance; // 当前顶点的距离
  v_dataset[2] = d_texPixelLen; // 贴图的像素长度，根据地图层级缩放
  v_dataset[3] = miter; // 线图层贴图部分的 v 坐标值 0 - 1

  vec4 project_pos = project_position(vec4(a_Position.xy, 0, 1.0), a_Position64Low);

  float originSize = a_Size.x; // 固定高度
  if (u_heightfixed < 1.0) {
    originSize = project_float_meter(a_Size.x); // 高度随 zoom 调整
  }

  float wallHeight = originSize * miter;
  float lightWeight = calc_lighting(vec4(project_pos.xy, wallHeight, 1.0));

  v_blur = min(project_float_pixel(2.0) / originSize, 0.05);
  v_color = vec4(a_Color.rgb * lightWeight, a_Color.w * opacity);

  // 兼容 mapbox 在线高度上的效果表现基本一致
  if (
    u_CoordinateSystem == COORDINATE_SYSTEM_LNGLAT ||
    u_CoordinateSystem == COORDINATE_SYSTEM_LNGLAT_OFFSET
  ) {
    // mapbox
    // 保持高度相对不变
    float mapboxZoomScale = 4.0 / pow(2.0, 21.0 - u_Zoom);
    if (u_heightfixed > 0.0) {
      wallHeight *= mapboxZoomScale;
    }
  }

  gl_Position = project_common_position_to_clipspace(vec4(project_pos.xy, wallHeight, 1.0));

  setPickingColor(a_PickingColor);
}
`})),lp,up=t((()=>{E(),D(),P(),F(),op(),cp(),lp=class extends N{constructor(...e){super(...e),this.updateTexture=()=>{let{createTexture2D:e}=this.rendererService;this.texture?(this.texture.update({data:this.iconService.getCanvas()}),this.layer.render()):(this.texture=e({data:this.iconService.getCanvas(),mag:m.NEAREST,min:m.NEAREST,premultiplyAlpha:!1,width:1024,height:this.iconService.canvasHeight||128}),this.textures=[this.texture])}}get attributeLocation(){return Object.assign(super.attributeLocation,{MAX:super.attributeLocation.MAX,SIZE:9,NORMAL:12,UV:13,DISTANCE_MITER_TOTAL:15})}getCommonUniformsInfo(){let{sourceColor:e,targetColor:t,textureBlend:n=`normal`,heightfixed:r=!1,lineTexture:i=!1,iconStep:a=100,iconStepCount:o=1}=this.layer.getLayerConfig(),{animateOption:s}=this.layer.getLayerConfig();this.rendererService.getDirty()&&this.texture?.bind();let c=0,l=[0,0,0,0],u=[0,0,0,0];e&&t&&(l=A(e),u=A(t),c=1);let d={u_animate:this.animateOption2Array(s),u_sourceColor:l,u_targetColor:u,u_textSize:[1024,this.iconService.canvasHeight||128],u_icon_step:a,u_heightfixed:Number(r),u_linearColor:c,u_line_texture:+!!i,u_textureBlend:n===`normal`?0:1,u_iconStepCount:o,u_time:this.layer.getLayerAnimateTime()||0};return this.getUniformsBufferInfo(d)}async initModels(){return this.initUniformsBuffer(),this.updateTexture(),this.iconService.on(`imageUpdate`,this.updateTexture),this.buildModels()}clearModels(){this.texture?.destroy(),this.iconService.off(`imageUpdate`,this.updateTexture)}async buildModels(){return[await this.layer.buildLayerModel({moduleName:`lineWall`,vertexShader:sp,fragmentShader:ap,triangulation:su,defines:this.getDefines(),inject:this.getInject(),depth:{enable:!1},blend:this.getBlend()})]}registerBuiltinAttributes(){this.registerPosition64LowAttribute(),this.styleAttributeService.registerStyleAttribute({name:`size`,type:k.Attribute,descriptor:{name:`a_Size`,shaderLocation:this.attributeLocation.SIZE,buffer:{usage:m.DYNAMIC_DRAW,data:[],type:m.FLOAT},size:2,update:e=>{let{size:t=1}=e;return Array.isArray(t)?[t[0],t[1]]:[t,0]}}}),this.styleAttributeService.registerStyleAttribute({name:`normal`,type:k.Attribute,descriptor:{name:`a_Normal`,shaderLocation:this.attributeLocation.NORMAL,buffer:{usage:m.STATIC_DRAW,data:[],type:m.FLOAT},size:3,update:(e,t,n,r,i)=>i}}),this.styleAttributeService.registerStyleAttribute({name:`distanceAndTotalAndMiter`,type:k.Attribute,descriptor:{name:`a_Distance_Total_Miter`,shaderLocation:this.attributeLocation.DISTANCE_MITER_TOTAL,buffer:{usage:m.STATIC_DRAW,data:[],type:m.FLOAT},size:3,update:(e,t,n)=>[n[3],n[4],n[5]]}}),this.styleAttributeService.registerStyleAttribute({name:`uv`,type:k.Attribute,descriptor:{name:`a_iconMapUV`,shaderLocation:this.attributeLocation.UV,buffer:{usage:m.DYNAMIC_DRAW,data:[],type:m.FLOAT},size:2,update:e=>{let t=this.iconService.getIconMap(),{texture:n}=e,{x:r,y:i}=t[n]||{x:0,y:0};return[r,i]}}})}}})),dp,fp=t((()=>{lf(),gf(),zf(),Kf(),Qf(),ip(),up(),dp={arc:cf,arc3d:hf,greatcircle:Gf,wall:lp,line:Zf,simple:rp,flowline:Rf,earthArc3d:hf}})),pp,mp=t((()=>{$c(),fp(),pp=class extends Qc{constructor(e={}){super(e),this.type=`LineLayer`,this.arrowInsertCount=0,this.defaultSourceConfig={data:[{lng1:100,lat1:30,lng2:130,lat2:30}],options:{parser:{type:`json`,x:`lng1`,y:`lat1`,x1:`lng2`,y1:`lat2`}}},this.setEncodeStyles(`shader`,[`stroke`,`offsets`,`opacity`,`thetaOffset`])}async buildModels(){let e=this.getModelType();this.layerModel=new dp[e](this),await this.initLayerModels()}getDefaultConfig(){return{line:{},linearline:{},simple:{},wall:{},arc3d:{blend:`additive`},arc:{blend:`additive`},greatcircle:{blend:`additive`},tileLine:{},earthArc3d:{},flowline:{},arrow:{}}[this.getModelType()]}getModelType(){return this.layerType?this.layerType:this.shapeOption?.field||`line`}processData(e){if(this.getModelType()!==`simple`)return e;let t=[];return e.map(e=>{if(Array.isArray(e.coordinates)&&Array.isArray(e.coordinates[0])&&Array.isArray(e.coordinates[0][0])){let n={...e};e.coordinates.map(e=>{t.push({...n,coordinates:e})})}else t.push(e)}),t}}})),hp,gp=t((()=>{hp=`layout(std140) uniform commonUniorm {
  vec4 u_stroke_color;
  float u_additive;
  float u_stroke_opacity;
  float u_stroke_width;
};

in vec4 v_color;
in float v_blur;
in float v_innerRadius;

out vec4 outputColor;

#pragma include "picking"
void main() {
  vec2 center = vec2(0.5);

  // Tip: 片元到中心点的距离 0 - 1
  float fragmengTocenter = distance(center, gl_PointCoord) * 2.0;
  // Tip: 片元的剪切成圆形
  float circleClipOpacity = 1.0 - smoothstep(v_blur, 1.0, fragmengTocenter);

  if (v_innerRadius < 0.99) {
    // 当存在 stroke 且 stroke > 0.01
    float blurWidth = (1.0 - v_blur) / 2.0;
    vec4 stroke = vec4(u_stroke_color.rgb, u_stroke_opacity);
    if (fragmengTocenter > v_innerRadius + blurWidth) {
      outputColor = stroke;
    } else if (fragmengTocenter > v_innerRadius - blurWidth) {
      float mixR = (fragmengTocenter - (v_innerRadius - blurWidth)) / (blurWidth * 2.0);
      outputColor = mix(v_color, stroke, mixR);
    } else {
      outputColor = v_color;
    }
  } else {
    // 当不存在 stroke 或 stroke <= 0.01
    outputColor = v_color;
  }

  outputColor = filterColor(outputColor);

  if (u_additive > 0.0) {
    outputColor *= circleClipOpacity;
  } else {
    outputColor.a *= circleClipOpacity;
  }

}
`})),_p,vp=t((()=>{_p=`
layout(location = ATTRIBUTE_LOCATION_POSITION) in vec3 a_Position;
layout(location = ATTRIBUTE_LOCATION_POSITION_64LOW) in vec2 a_Position64Low;
layout(location = ATTRIBUTE_LOCATION_COLOR) in vec4 a_Color;
layout(location = ATTRIBUTE_LOCATION_SIZE) in float a_Size;

layout(std140) uniform commonUniorm {
  vec4 u_stroke_color;
  float u_additive;
  float u_stroke_opacity;
  float u_stroke_width;
};

out vec4 v_color;
out float v_blur;
out float v_innerRadius;

#pragma include "projection"
#pragma include "picking"
#pragma include "project"

// 根据 anchor 值计算点精灵的像素偏移
// anchor: 0=center, 1=top, 2=top-right, 3=right, 4=bottom-right, 5=bottom, 6=bottom-left, 7=left, 8=top-left, 9=bottom-center
vec2 applyAnchorPoint(float anchor, float pointSize) {
  if (anchor < 0.5) {
    return vec2(0.0);
  }

  vec2 offset = vec2(0.0);
  float gap = 2.0 * u_DevicePixelRatio; // 2px 间隔，考虑设备像素比

  // horizontal alignment: 左边缘对准坐标 -> 向右移; 右边缘对准坐标 -> 向左移
  if (anchor == 2.0 || anchor == 3.0 || anchor == 4.0) {
    offset.x = -pointSize * 0.5;
  } else if (anchor == 6.0 || anchor == 7.0 || anchor == 8.0) {
    offset.x = pointSize * 0.5;
  }

  // vertical alignment: 上边缘对准坐标 -> 向下移(图形在坐标下方); 下边缘对准坐标 -> 向上移(图形在坐标上方)
  // bottom 和 top 增加 2px 间隔，避免图形紧贴参考点
  if (anchor == 1.0 || anchor == 2.0 || anchor == 8.0) {
    offset.y = -pointSize * 0.5 - gap; // top: 图形在坐标下方，额外向下移 2px
  } else if (anchor == 4.0 || anchor == 5.0 || anchor == 6.0 || anchor == 9.0) {
    offset.y = pointSize * 0.5 + gap; // bottom: 图形在坐标上方，额外向上移 2px
  }

  return offset;
}

void main() {
  v_color = vec4(a_Color.xyz, a_Color.w * opacity);
  v_blur = 1.0 - max(2.0 / a_Size, 0.05);
  v_innerRadius = max((a_Size - u_stroke_width) / a_Size, 0.0);

  vec2 offset = project_pixel(offsets);

  vec4 project_pos = project_position(vec4(a_Position, 1.0), a_Position64Low);
  gl_Position = project_common_position_to_clipspace(vec4(vec2(project_pos.xy+offset),project_pos.z,project_pos.w));

  gl_PointSize = a_Size * 2.0 * u_DevicePixelRatio;

  // apply anchor offset in screen space
  vec2 anchorOffset = applyAnchorPoint(anchor, gl_PointSize);
  gl_Position.xy += anchorOffset / u_ViewportSize * 2.0 * gl_Position.w;

  setPickingColor(a_PickingColor);
}
`}));function yp(e){let t=e.coordinates;return{vertices:[...t],indices:[0],size:t.length}}var bp,xp=t((()=>{E(),P(),D(),gp(),vp(),bp=class extends N{get attributeLocation(){return Object.assign(super.attributeLocation,{MAX:super.attributeLocation.MAX,SIZE:9})}getDefaultStyle(){return{blend:`additive`}}getCommonUniformsInfo(){let{blend:e,strokeOpacity:t=1,strokeWidth:n=0,stroke:r=`#fff`}=this.layer.getLayerConfig(),i={u_stroke_color:A(r),u_additive:+(e===`additive`),u_stroke_opacity:t,u_stroke_width:n};return this.getUniformsBufferInfo(i)}async initModels(){return this.buildModels()}async buildModels(){return this.layer.triangulation=yp,this.initUniformsBuffer(),[await this.layer.buildLayerModel({moduleName:`pointSimple`,vertexShader:_p,fragmentShader:hp,defines:this.getDefines(),inject:this.getInject(),triangulation:yp,depth:{enable:!1},primitive:m.POINTS})]}registerBuiltinAttributes(){this.registerPosition64LowAttribute(),this.styleAttributeService.registerStyleAttribute({name:`size`,type:k.Attribute,descriptor:{name:`a_Size`,shaderLocation:this.attributeLocation.SIZE,buffer:{usage:m.DYNAMIC_DRAW,data:[],type:m.FLOAT},size:1,update:e=>{let{size:t=1}=e;return Array.isArray(t)?[t[0]]:[t]}}})}}})),Sp,Cp=t((()=>{Sp=`precision highp float;
in vec4 v_color;

#pragma include "picking"

layout(std140) uniform commonUniform {
  vec4 u_sourceColor;
  vec4 u_targetColor;
  float u_linearColor: 0;
  float u_heightfixed: 0.0; // 默认不固定
  float u_globel;
  float u_r;
  float u_pickLight: 0.0;
  float u_opacitylinear: 0.0;
  float u_opacitylinear_dir: 1.0;
  float u_lightEnable: 1.0;
};
in float v_lightWeight;
in float v_barLinearZ;
out vec4 outputColor;
void main() {

   outputColor = v_color;

  // 开启透明度渐变
  if(u_opacitylinear > 0.0) {
    outputColor.a *= u_opacitylinear_dir > 0.0 ? (1.0 - v_barLinearZ): v_barLinearZ;
  }

  // picking
  if(u_pickLight > 0.0) {
    outputColor = filterColorAlpha(outputColor, v_lightWeight);
  } else {
    outputColor = filterColor(outputColor);
  }
}
`})),wp,Tp=t((()=>{wp=`precision highp float;

#define pi 3.1415926535
#define ambientRatio 0.5
#define diffuseRatio 0.3
#define specularRatio 0.2

layout(location = ATTRIBUTE_LOCATION_POSITION) in vec3 a_Position;
layout(location = ATTRIBUTE_LOCATION_COLOR) in vec4 a_Color;
layout(location = ATTRIBUTE_LOCATION_SIZE) in vec3 a_Size;
layout(location = ATTRIBUTE_LOCATION_POS) in vec3 a_Pos;
layout(location = ATTRIBUTE_LOCATION_NORMAL) in vec3 a_Normal;

layout(std140) uniform commonUniform {
  vec4 u_sourceColor;
  vec4 u_targetColor;
  float u_linearColor: 0;
  float u_heightfixed: 0.0; // 默认不固定
  float u_globel;
  float u_r;
  float u_pickLight: 0.0;
  float u_opacitylinear: 0.0;
  float u_opacitylinear_dir: 1.0;
  float u_lightEnable: 1.0;
};

out vec4 v_color;
out float v_lightWeight;
out float v_barLinearZ;
// 用于将在顶点着色器中计算好的样式值传递给片元


#pragma include "projection"
#pragma include "light"
#pragma include "picking"

float getYRadian(float x, float z) {
  if(x > 0.0 && z > 0.0) {
    return atan(x/z);
  } else if(x > 0.0 && z <= 0.0){
    return atan(-z/x) + pi/2.0;
  } else if(x <= 0.0 && z <= 0.0) {
    return  pi + atan(x/z); //atan(x/z) +
  } else {
    return atan(z/-x) + pi*3.0/2.0;
  }
}

float getXRadian(float y, float r) {
  return atan(y/r);
}

void main() {

  // cal style mapping - 数据纹理映射部分的计算
  vec3 size = a_Size * a_Position;

  // a_Position.z 是在构建网格的时候传入的标准值 0 - 1，在插值器插值可以获取 0～1 线性渐变的值
  v_barLinearZ =  a_Position.z;

  vec3 offset = size; // 控制圆柱体的大小 - 从标准单位圆柱体进行偏移
  if(u_heightfixed < 1.0) { // 圆柱体不固定高度
    //
  } else {// 圆柱体固定高度 （ 处理 mapbox ）
    if(u_CoordinateSystem == COORDINATE_SYSTEM_LNGLAT || u_CoordinateSystem == COORDINATE_SYSTEM_LNGLAT_OFFSET) {
      offset *= 4.0/pow(2.0, 21.0 - u_Zoom);
    }
  }


  vec4 project_pos = project_position(vec4(a_Pos.xy, 0., 1.0));

  // u_r 控制圆柱的生长
  vec4 pos = vec4(project_pos.xy + offset.xy, offset.z * u_r, 1.0);

  // 圆柱光照效果
  float lightWeight = 1.0;
  if(u_lightEnable > 0.0) { // 取消三元表达式，增强健壮性
    lightWeight = calc_lighting(pos);
  }
  v_lightWeight = lightWeight;
  // 设置圆柱的底色
  if(u_linearColor == 1.0) { // 使用渐变颜色
    v_color = mix(u_sourceColor, u_targetColor, v_barLinearZ);
    v_color.rgb *= lightWeight;
  } else { // 使用 color 方法传入的颜色
     v_color = a_Color;
  }
  v_color.a *= u_opacity;


  // 在地球模式下，将原本垂直于 xy 平面的圆柱调整姿态到适应圆的角度
  //旋转矩阵mx，创建绕x轴旋转矩阵
  float r = sqrt(a_Pos.z*a_Pos.z + a_Pos.x*a_Pos.x);
  float xRadian = getXRadian(a_Pos.y, r);
  float xcos = cos(xRadian);//求解旋转角度余弦值
  float xsin = sin(xRadian);//求解旋转角度正弦值
  mat4 mx = mat4(
    1,0,0,0,
    0,xcos,-xsin,0,
    0,xsin,xcos,0,
    0,0,0,1);

  //旋转矩阵my，创建绕y轴旋转矩阵
  float yRadian = getYRadian(a_Pos.x, a_Pos.z);
  float ycos = cos(yRadian);//求解旋转角度余弦值
  float ysin = sin(yRadian);//求解旋转角度正弦值
  mat4 my = mat4(
    ycos,0,-ysin,0,
    0,1,0,0,
    ysin,0,ycos,0,
    0,0,0,1);

  gl_Position = u_ViewProjectionMatrix * vec4(( my * mx *  vec4(a_Position * a_Size, 1.0)).xyz + a_Pos, 1.0);


  setPickingColor(a_PickingColor);
}
`})),Ep,Dp,Op=t((()=>{E(),D(),P(),F(),Al(),Cp(),Tp(),{isNumber:Ep}=vt,Dp=class extends N{constructor(...e){super(...e),this.raiseCount=0,this.raiseRepeat=0}get attributeLocation(){return Object.assign(super.attributeLocation,{MAX:super.attributeLocation.MAX,SIZE:9,POS:10,NORMAL:11})}getCommonUniformsInfo(){let{animateOption:e={enable:!1,speed:.01,repeat:!1},opacity:t=1,sourceColor:n,targetColor:r,pickLight:i=!1,heightfixed:a=!0,opacityLinear:o={enable:!1,dir:`up`},lightEnable:s=!0}=this.layer.getLayerConfig(),c=0,l=[0,0,0,0],u=[0,0,0,0];if(n&&r&&(l=A(n),u=A(r),c=1),this.raiseCount<1&&this.raiseRepeat>0&&e.enable){let{speed:t=.01}=e;this.raiseCount+=t,this.raiseCount>=1&&(this.raiseRepeat>1?(this.raiseCount=0,this.raiseRepeat--):this.raiseCount=1)}let d={u_sourceColor:l,u_targetColor:u,u_linearColor:c,u_pickLight:Number(i),u_heightfixed:Number(a),u_r:e.enable&&this.raiseRepeat>0?this.raiseCount:1,u_opacity:Ep(t)?t:1,u_opacitylinear:Number(o.enable),u_opacitylinear_dir:+(o.dir===`up`),u_lightEnable:Number(s)};return this.getUniformsBufferInfo(d)}async initModels(){return this.initUniformsBuffer(),this.buildModels()}async buildModels(){let{animateOption:{repeat:e=1}}=this.layer.getLayerConfig();return this.raiseRepeat=e,[await this.layer.buildLayerModel({moduleName:`pointEarthExtrude`,vertexShader:wp,fragmentShader:Sp,triangulation:au,depth:{enable:!0},defines:this.getDefines(),inject:this.getInject(),cull:{enable:!0,face:m.FRONT},blend:this.getBlend()})]}registerBuiltinAttributes(){this.styleAttributeService.registerStyleAttribute({name:`size`,type:k.Attribute,descriptor:{name:`a_Size`,shaderLocation:this.attributeLocation.SIZE,buffer:{usage:m.DYNAMIC_DRAW,data:[],type:m.FLOAT},size:3,update:e=>{let{size:t}=e;if(t){let e=[];return Array.isArray(t)&&(e=t.length===2?[t[0],t[0],t[1]]:t),Array.isArray(t)||(e=[t,t,t]),e}return[2,2,2]}}}),this.styleAttributeService.registerStyleAttribute({name:`normal`,type:k.Attribute,descriptor:{name:`a_Normal`,shaderLocation:this.attributeLocation.NORMAL,buffer:{usage:m.STATIC_DRAW,data:[],type:m.FLOAT},size:3,update:(e,t,n,r,i)=>i}}),this.styleAttributeService.registerStyleAttribute({name:`pos`,type:k.Attribute,descriptor:{name:`a_Pos`,shaderLocation:this.attributeLocation.POS,buffer:{usage:m.DYNAMIC_DRAW,data:[],type:m.FLOAT},size:3,update:e=>{let t=rt(e.coordinates);return Ol([t[0],t[1]])}}})}}})),kp,Ap=t((()=>{kp=`in vec4 v_data;
in vec4 v_color;
in float v_radius;

layout(std140) uniform commonUniform {
  float u_additive;
  float u_stroke_opacity : 1;
  float u_stroke_width : 2;
  float u_blur : 0.0;
};
#pragma include "sdf_2d"
#pragma include "picking"

out vec4 outputColor;

void main() {
  int shape = int(floor(v_data.w + 0.5));

  vec4 strokeColor = u_stroke == vec4(0.0) ? v_color : u_stroke;

  lowp float antialiasblur = v_data.z;
  float r = v_radius / (v_radius + u_stroke_width);

  float outer_df;
  float inner_df;
  // 'circle', 'triangle', 'square', 'pentagon', 'hexagon', 'octogon', 'hexagram', 'rhombus', 'vesica'
  if (shape == 0) {
    outer_df = sdCircle(v_data.xy, 1.0);
    inner_df = sdCircle(v_data.xy, r);
  } else if (shape == 1) {
    outer_df = sdEquilateralTriangle(1.1 * v_data.xy);
    inner_df = sdEquilateralTriangle(1.1 / r * v_data.xy);
  } else if (shape == 2) {
    outer_df = sdBox(v_data.xy, vec2(1.));
    inner_df = sdBox(v_data.xy, vec2(r));
  } else if (shape == 3) {
    outer_df = sdPentagon(v_data.xy, 0.8);
    inner_df = sdPentagon(v_data.xy, r * 0.8);
  } else if (shape == 4) {
    outer_df = sdHexagon(v_data.xy, 0.8);
    inner_df = sdHexagon(v_data.xy, r * 0.8);
  } else if (shape == 5) {
    outer_df = sdOctogon(v_data.xy, 1.0);
    inner_df = sdOctogon(v_data.xy, r);
  } else if (shape == 6) {
    outer_df = sdHexagram(v_data.xy, 0.52);
    inner_df = sdHexagram(v_data.xy, r * 0.52);
  } else if (shape == 7) {
    outer_df = sdRhombus(v_data.xy, vec2(1.0));
    inner_df = sdRhombus(v_data.xy, vec2(r));
  } else if (shape == 8) {
    outer_df = sdVesica(v_data.xy, 1.1, 0.8);
    inner_df = sdVesica(v_data.xy, r * 1.1, r * 0.8);
  }

  if(outer_df > antialiasblur + 0.018) discard;

  float opacity_t = smoothstep(0.0, antialiasblur, outer_df);

  float color_t = u_stroke_width < 0.01 ? 0.0 : smoothstep(
    antialiasblur,
    0.0,
    inner_df
  );

  if(u_stroke_width < 0.01) {
    outputColor = vec4(v_color.rgb, v_color.a * u_opacity);
  } else {
    outputColor = mix(vec4(v_color.rgb, v_color.a * u_opacity), strokeColor * u_stroke_opacity, color_t);
  }

  if(u_additive > 0.0) {
    outputColor *= opacity_t;
    outputColor = filterColorAlpha(outputColor, outputColor.a);
  } else {
    outputColor.a *= opacity_t;
    outputColor = filterColor(outputColor);
  }
}
`})),jp,Mp=t((()=>{jp=`layout(location = ATTRIBUTE_LOCATION_POSITION) in vec3 a_Position;
layout(location = ATTRIBUTE_LOCATION_COLOR) in vec4 a_Color;
layout(location = ATTRIBUTE_LOCATION_SIZE) in float a_Size;
layout(location = ATTRIBUTE_LOCATION_SHAPE) in float a_Shape;
layout(location = ATTRIBUTE_LOCATION_EXTRUDE) in vec3 a_Extrude;

layout(std140) uniform commonUniform {
  float u_additive;
  float u_stroke_opacity : 1;
  float u_stroke_width : 2;
  float u_blur : 0.0;
};
out vec4 v_data;
out vec4 v_color;
out float v_radius;

#pragma include "projection"
#pragma include "picking"

// 根据 anchor 值计算 extrude 偏移
// anchor: 0=center, 1=top, 2=top-right, 3=right, 4=bottom-right, 5=bottom, 6=bottom-left, 7=left, 8=top-left, 9=bottom-center
vec2 applyAnchor(vec2 extrude, float anchor) {
  if (anchor < 0.5) {
    return extrude;
  }

  vec2 offset = vec2(0.0);

  // horizontal alignment: 左边缘对准坐标 -> 向右移; 右边缘对准坐标 -> 向左移
  if (anchor == 2.0 || anchor == 3.0 || anchor == 4.0) {
    // top-right, right, bottom-right -> shift left
    offset.x = -1.0;
  } else if (anchor == 6.0 || anchor == 7.0 || anchor == 8.0) {
    // bottom-left, left, top-left -> shift right
    offset.x = 1.0;
  }

  // vertical alignment: 上边缘对准坐标 -> 向下移(图形在坐标下方); 下边缘对准坐标 -> 向上移(图形在坐标上方)
  if (anchor == 1.0 || anchor == 2.0 || anchor == 8.0) {
    // top, top-right, top-left -> shift down
    offset.y = -1.0;
  } else if (anchor == 4.0 || anchor == 5.0 || anchor == 6.0 || anchor == 9.0) {
    // bottom-right, bottom, bottom-left, bottom-center -> shift up
    offset.y = 1.0;
  }

  return extrude + offset;
}

void main() {
  vec3 extrude = a_Extrude;
  float shape_type = a_Shape;
  /*
  *  setPickingSize 设置拾取大小
  */
  float newSize = setPickingSize(a_Size);
  // float newSize = setPickingSize(a_Size) * 0.00001038445708445579;

  // unpack color(vec2)
  v_color = a_Color;

  // radius(16-bit)
  v_radius = newSize;

  // anti-alias
  //  float antialiased_blur = -max(u_blur, antialiasblur);
  float antialiasblur = -max(2.0 / u_DevicePixelRatio / newSize, u_blur);

  // apply anchor to extrude direction
  vec2 anchoredExtrude = applyAnchor(extrude.xy, anchor);

  // TODP: sign() 是为了兼容地球模式，同时避免 anchor 偏移后为 0 时除以零产生 NaN
  // 注意：v_data 必须使用原始 extrude 而非 anchoredExtrude，因为 SDF 形状计算需要基于原始形状坐标系
  // anchoredExtrude 只用于位置偏移，不改变形状本身的 SDF 采样
  v_data = vec4(sign(extrude.x), sign(extrude.y), antialiasblur,shape_type);

  gl_Position = u_ViewProjectionMatrix * vec4(a_Position + anchoredExtrude * newSize * 0.1 + vec3(offsets,0.0), 1.0);

  setPickingColor(a_PickingColor);
}
`})),Np,Pp=t((()=>{E(),P(),F(),Ap(),Mp(),ir(),Np=class extends N{get attributeLocation(){return Object.assign(super.attributeLocation,{MAX:super.attributeLocation.MAX,SIZE:9,SHAPE:10,EXTRUDE:11})}getCommonUniformsInfo(){let{strokeOpacity:e=1,strokeWidth:t=0,blend:n,blur:r=0}=this.layer.getLayerConfig();this.layer.getLayerConfig();let i={u_additive:+(n===`additive`),u_stroke_opacity:e,u_stroke_width:t,u_blur:r};return this.getUniformsBufferInfo(i)}async initModels(){return this.initUniformsBuffer(),this.buildModels()}async buildModels(){return this.layer.triangulation=iu,[await this.layer.buildLayerModel({moduleName:`pointEarthFill`,vertexShader:jp,fragmentShader:kp,triangulation:iu,defines:this.getDefines(),inject:this.getInject(),depth:{enable:!0},blend:this.getBlend()})]}animateOption2Array(e){return[+!e.enable,e.speed||1,e.rings||3,0]}registerBuiltinAttributes(){this.styleAttributeService.registerStyleAttribute({name:`extrude`,type:k.Attribute,descriptor:{name:`a_Extrude`,shaderLocation:this.attributeLocation.EXTRUDE,buffer:{usage:m.DYNAMIC_DRAW,data:[],type:m.FLOAT},size:3,update:(e,t,n,r)=>{let[i,a,o]=n,s=Nn(0,0,1),c=Nn(i,0,o),l=i>=0?In(s,c):Math.PI*2-In(s,c),u=Math.PI*2-Math.asin(a/100),d=Pn();qn(d,d,l),Jn(d,d,u);let f=Nn(1,1,0);Wn(f,f,d),Un(f,f);let p=Nn(-1,1,0);Wn(p,p,d),Un(p,p);let m=Nn(-1,-1,0);Wn(m,m,d),Un(m,m);let h=Nn(1,-1,0);Wn(h,h,d),Un(h,h);let g=[...f,...p,...m,...h],_=r%4*3;return[g[_],g[_+1],g[_+2]]}}}),this.styleAttributeService.registerStyleAttribute({name:`size`,type:k.Attribute,descriptor:{name:`a_Size`,shaderLocation:this.attributeLocation.SIZE,buffer:{usage:m.DYNAMIC_DRAW,data:[],type:m.FLOAT},size:1,update:e=>{let{size:t=5}=e;return Array.isArray(t)?[t[0]]:[t]}}}),this.styleAttributeService.registerStyleAttribute({name:`shape`,type:k.Attribute,descriptor:{name:`a_Shape`,shaderLocation:this.attributeLocation.SHAPE,buffer:{usage:m.DYNAMIC_DRAW,data:[],type:m.FLOAT},size:1,update:e=>{let{shape:t=2}=e;return[this.layer.getLayerConfig().shape2d.indexOf(t)]}}})}}})),Fp,Ip=t((()=>{Fp=`in vec4 v_color;
in float v_lightWeight;
out vec4 outputColor;

layout(std140) uniform commonUniforms {
  float u_pickLight;
  float u_heightfixed;
  float u_r;
  float u_linearColor;
  vec4 u_sourceColor;
  vec4 u_targetColor;
  float u_opacitylinear;
  float u_opacitylinear_dir;
  float u_lightEnable;
};

#pragma include "scene_uniforms"
#pragma include "picking"

void main() {
  outputColor = v_color;
  // 开启透明度渐变
  // picking
  if (u_pickLight > 0.0) {
    outputColor = filterColorAlpha(outputColor, v_lightWeight);
  } else {
    outputColor = filterColor(outputColor);
  }
}
`})),Lp,Rp=t((()=>{Lp=`#define pi (3.1415926535)

layout(location = ATTRIBUTE_LOCATION_POSITION) in vec3 a_Position;
layout(location = ATTRIBUTE_LOCATION_COLOR) in vec4 a_Color;
layout(location = ATTRIBUTE_LOCATION_SIZE) in vec3 a_Size;
layout(location = ATTRIBUTE_LOCATION_EXTRUDE) in vec4 a_Extrude;
layout(location = ATTRIBUTE_LOCATION_NORMAL) in vec3 a_Normal;

layout(std140) uniform commonUniforms {
  float u_pickLight;
  float u_heightfixed;
  float u_r;
  float u_linearColor;
  vec4 u_sourceColor;
  vec4 u_targetColor;
  float u_opacitylinear;
  float u_opacitylinear_dir;
  float u_lightEnable;
};
out vec4 v_color;
out float v_lightWeight;

#pragma include "projection"
#pragma include "light"
#pragma include "picking"

float getYRadian(float x, float z) {
  if (x > 0.0 && z > 0.0) {
    return atan(x / z);
  } else if (x > 0.0 && z <= 0.0) {
    return atan(-z / x) + pi / 2.0;
  } else if (x <= 0.0 && z <= 0.0) {
    return pi + atan(x / z); //atan(x/z) +
  } else {
    return atan(z / -x) + pi * 3.0 / 2.0;
  }
}

float getXRadian(float y, float r) {
  return atan(y / r);
}

void main() {
  vec3 size = a_Size * a_Position;

  vec3 offset = size; // 控制圆柱体的大小 - 从标准单位圆柱体进行偏移

  if (u_heightfixed < 1.0) {
    // 圆柱体不固定高度
  } else {
    // 圆柱体固定高度 （ 处理 mapbox ）
    if (
      u_CoordinateSystem == COORDINATE_SYSTEM_LNGLAT ||
      u_CoordinateSystem == COORDINATE_SYSTEM_LNGLAT_OFFSET
    ) {
      offset *= 4.0 / pow(2.0, 21.0 - u_Zoom);
    }
  }

  vec2 positions = a_Extrude.xy;
  vec2 positions64Low = a_Extrude.zw;
  vec4 project_pos = project_position(vec4(positions, 0.0, 1.0), positions64Low);

  // u_r 控制圆柱的生长
  vec4 pos = vec4(project_pos.xy + offset.xy, offset.z * u_r, 1.0);

  // // 圆柱光照效果
  float lightWeight = 1.0;

  if (u_lightEnable > 0.0) {
    // 取消三元表达式，增强健壮性
    lightWeight = calc_lighting(pos);
  }

  v_lightWeight = lightWeight;

  v_color = a_Color;

  // 设置圆柱的底色
  if (u_linearColor == 1.0) {
    // 使用渐变颜色
    v_color = mix(u_sourceColor, u_targetColor, a_Position.z);
    v_color.a = v_color.a * opacity;
  } else {
    v_color = vec4(a_Color.rgb * lightWeight, a_Color.w * opacity);
  }

  if (u_opacitylinear > 0.0) {
    v_color.a *= u_opacitylinear_dir > 0.0 ? 1.0 - a_Position.z : a_Position.z;
  }

  gl_Position = project_common_position_to_clipspace(pos);

  setPickingColor(a_PickingColor);
}
`})),zp,Bp=t((()=>{E(),D(),P(),F(),Ip(),Rp(),zp=class extends N{constructor(...e){super(...e),this.raiseCount=0,this.raiseRepeat=0}get attributeLocation(){return Object.assign(super.attributeLocation,{MAX:super.attributeLocation.MAX,SIZE:9,EXTRUDE:10,NORMAL:11})}getCommonUniformsInfo(){let{animateOption:e={enable:!1,speed:.01,repeat:!1},sourceColor:t,targetColor:n,pickLight:r=!1,heightfixed:i=!1,opacityLinear:a={enable:!1,dir:`up`},lightEnable:o=!0}=this.layer.getLayerConfig(),s=0,c=[0,0,0,0],l=[0,0,0,0];if(t&&n&&(c=A(t),l=A(n),s=1),this.raiseCount<1&&this.raiseRepeat>0&&e.enable){let{speed:t=.01}=e;this.raiseCount+=t,this.raiseCount>=1&&(this.raiseRepeat>1?(this.raiseCount=0,this.raiseRepeat--):this.raiseCount=1)}let u={u_pickLight:Number(r),u_heightfixed:Number(i),u_r:e.enable&&this.raiseRepeat>0?this.raiseCount:1,u_linearColor:s,u_sourceColor:c,u_targetColor:l,u_opacitylinear:Number(a.enable),u_opacitylinear_dir:+(a.dir===`up`),u_lightEnable:Number(o)};return this.getUniformsBufferInfo(u)}async initModels(){return this.buildModels()}async buildModels(){let{depth:e=!0,animateOption:{repeat:t=1}}=this.layer.getLayerConfig();return this.raiseRepeat=t,this.initUniformsBuffer(),[await this.layer.buildLayerModel({moduleName:`pointExtrude`,vertexShader:Lp,fragmentShader:Fp,triangulation:au,defines:this.getDefines(),inject:this.getInject(),cull:{enable:!0,face:m.FRONT},depth:{enable:e}})]}registerBuiltinAttributes(){this.styleAttributeService.registerStyleAttribute({name:`size`,type:k.Attribute,descriptor:{name:`a_Size`,shaderLocation:this.attributeLocation.SIZE,buffer:{usage:m.DYNAMIC_DRAW,data:[],type:m.FLOAT},size:3,update:e=>{let{size:t}=e;if(t){let e=[];return Array.isArray(t)&&(e=t.length===2?[t[0],t[0],t[1]]:t),Array.isArray(t)||(e=[t,t,t]),e}return[2,2,2]}}}),this.styleAttributeService.registerStyleAttribute({name:`normal`,type:k.Attribute,descriptor:{name:`a_Normal`,shaderLocation:this.attributeLocation.NORMAL,buffer:{usage:m.STATIC_DRAW,data:[],type:m.FLOAT},size:3,update:(e,t,n,r,i)=>i}}),this.styleAttributeService.registerStyleAttribute({name:`extrude`,type:k.Attribute,descriptor:{name:`a_Extrude`,shaderLocation:this.attributeLocation.EXTRUDE,buffer:{usage:m.DYNAMIC_DRAW,data:[],type:m.FLOAT},size:4,update:e=>{let t=rt(e.coordinates);return[t[0],t[1],xn(t[0]),xn(t[1])]}}})}}})),Vp,Hp=t((()=>{Vp=`layout(std140) uniform commonUniforms {
  vec3 u_blur_height_fixed;
  float u_stroke_width;
  float u_additive;
  float u_stroke_opacity;
  float u_size_unit;
  float u_time;
  vec4 u_animate;
};

in vec4 v_color;
in vec4 v_stroke;
in vec4 v_data;
in float v_radius;

#pragma include "scene_uniforms"
#pragma include "sdf_2d"
#pragma include "picking"

out vec4 outputColor;

void main() {
  int shape = int(floor(v_data.w + 0.5));
  lowp float antialiasblur = v_data.z;
  float r = v_radius / (v_radius + u_stroke_width);

  float outer_df;
  float inner_df;
  // 'circle', 'triangle', 'square', 'pentagon', 'hexagon', 'octogon', 'hexagram', 'rhombus', 'vesica'
  if (shape == 0) {
    outer_df = sdCircle(v_data.xy, 1.0);
    inner_df = sdCircle(v_data.xy, r);
  } else if (shape == 1) {
    outer_df = sdEquilateralTriangle(1.1 * v_data.xy);
    inner_df = sdEquilateralTriangle(1.1 / r * v_data.xy);
  } else if (shape == 2) {
    outer_df = sdBox(v_data.xy, vec2(1.0));
    inner_df = sdBox(v_data.xy, vec2(r));
  } else if (shape == 3) {
    outer_df = sdPentagon(v_data.xy, 0.8);
    inner_df = sdPentagon(v_data.xy, r * 0.8);
  } else if (shape == 4) {
    outer_df = sdHexagon(v_data.xy, 0.8);
    inner_df = sdHexagon(v_data.xy, r * 0.8);
  } else if (shape == 5) {
    outer_df = sdOctogon(v_data.xy, 1.0);
    inner_df = sdOctogon(v_data.xy, r);
  } else if (shape == 6) {
    outer_df = sdHexagram(v_data.xy, 0.52);
    inner_df = sdHexagram(v_data.xy, r * 0.52);
  } else if (shape == 7) {
    outer_df = sdRhombus(v_data.xy, vec2(1.0));
    inner_df = sdRhombus(v_data.xy, vec2(r));
  } else if (shape == 8) {
    outer_df = sdVesica(v_data.xy, 1.1, 0.8);
    inner_df = sdVesica(v_data.xy, r * 1.1, r * 0.8);
  }

  float opacity_t = smoothstep(0.0, antialiasblur, outer_df);

  float color_t = u_stroke_width < 0.01 ? 0.0 : smoothstep(antialiasblur, 0.0, inner_df);

  float PI = 3.14159;
  float N_RINGS = 3.0;
  float FREQ = 1.0;

  if (u_stroke_width < 0.01) {
    outputColor = v_color;
  } else {
    outputColor = mix(v_color, v_stroke * u_stroke_opacity, color_t);
  }
  float intensity = 1.0;
  if (u_time != -1.0) {
    //wave相关逻辑
    float d = length(v_data.xy);
    if (d > 0.5) {
      discard;
    }
    intensity =
      clamp(cos(d * PI), 0.0, 1.0) *
      clamp(cos(2.0 * PI * (d * 2.0 * u_animate.z - u_animate.y * u_time)), 0.0, 1.0);
  }

  if (u_additive > 0.0) {
    outputColor *= opacity_t;
    outputColor *= intensity; //wave
    outputColor = filterColorAlpha(outputColor, outputColor.a);
  } else {
    outputColor.a *= opacity_t;
    outputColor.a *= intensity; //wave
    outputColor = filterColor(outputColor);
  }
  // 作为 mask 模板时需要丢弃透明的像素
  if (outputColor.a < 0.01) {
    discard;
  }
}
`})),Up,Wp=t((()=>{Up=`layout(location = ATTRIBUTE_LOCATION_POSITION) in vec3 a_Position;
layout(location = ATTRIBUTE_LOCATION_POSITION_64LOW) in vec2 a_Position64Low;
layout(location = ATTRIBUTE_LOCATION_COLOR) in vec4 a_Color;
layout(location = ATTRIBUTE_LOCATION_SIZE) in float a_Size;
layout(location = ATTRIBUTE_LOCATION_SHAPE) in float a_Shape;
layout(location = ATTRIBUTE_LOCATION_EXTRUDE) in vec3 a_Extrude;

layout(std140) uniform commonUniforms {
  vec3 u_blur_height_fixed;
  float u_stroke_width;
  float u_additive;
  float u_stroke_opacity;
  float u_size_unit;
  float u_time;
  vec4 u_animate;
};

out vec4 v_color;
out vec4 v_stroke;
out vec4 v_data;
out float v_radius;

#pragma include "projection"
#pragma include "picking"
#pragma include "rotation_2d"

// 根据 anchor 值计算 extrude 偏移
// anchor: 0=center, 1=top, 2=top-right, 3=right, 4=bottom-right, 5=bottom, 6=bottom-left, 7=left, 8=top-left, 9=bottom-center
vec2 applyAnchor(vec2 extrude, float anchor) {
  if (anchor < 0.5) {
    return extrude;
  }

  vec2 offset = vec2(0.0);

  // horizontal alignment: 左边缘对准坐标 -> 向右移; 右边缘对准坐标 -> 向左移
  if (anchor == 2.0 || anchor == 3.0 || anchor == 4.0) {
    // top-right, right, bottom-right -> shift left
    offset.x = -1.0;
  } else if (anchor == 6.0 || anchor == 7.0 || anchor == 8.0) {
    // bottom-left, left, top-left -> shift right
    offset.x = 1.0;
  }

  // vertical alignment: 上边缘对准坐标 -> 向下移(图形在坐标下方); 下边缘对准坐标 -> 向上移(图形在坐标上方)
  if (anchor == 1.0 || anchor == 2.0 || anchor == 8.0) {
    // top, top-right, top-left -> shift down
    offset.y = -1.0;
  } else if (anchor == 4.0 || anchor == 5.0 || anchor == 6.0 || anchor == 9.0) {
    // bottom-right, bottom, bottom-left, bottom-center -> shift up
    offset.y = 1.0;
  }

  return extrude + offset;
}

void main() {
  // 透明度计算
   v_stroke = stroke;
  vec3 extrude = a_Extrude;
  float shape_type = a_Shape;
  /*
  *  setPickingSize 设置拾取大小
  *  u_meter2coord 在等面积大小的时候设置单位
  */
  float newSize = setPickingSize(a_Size);
  // float newSize = setPickingSize(a_Size) * 0.00001038445708445579;



  // unpack color(vec2)
  v_color = vec4(a_Color.xyz, a_Color.w * opacity);

  if(u_size_unit == 1.0) {
    newSize = newSize  * u_PixelsPerMeter.z;
  }

   v_radius = newSize;

  // anti-alias
  //  float antialiased_blur = -max(u_blur, antialiasblur);
  float antialiasblur = -max(2.0 / u_DevicePixelRatio / newSize, u_blur_height_fixed.x);

  // apply anchor to extrude direction
  vec2 anchoredExtrude = applyAnchor(extrude.xy, anchor);

  vec2 offset = (anchoredExtrude * (newSize + u_stroke_width) + offsets);

  offset = project_pixel(offset);
  offset = rotate_matrix(offset,rotation);

  // TODP: sign() 是为了兼容地球模式，同时避免 anchor 偏移后为 0 时除以零产生 NaN
  // 注意：v_data 必须使用原始 extrude 而非 anchoredExtrude，因为 SDF 形状计算需要基于原始形状坐标系
  // anchoredExtrude 只用于位置偏移，不改变形状本身的 SDF 采样
  v_data = vec4(sign(extrude.x), sign(extrude.y), antialiasblur,shape_type);

  vec4 project_pos = project_position(vec4(a_Position.xy, 0.0, 1.0), a_Position64Low);
  // gl_Position = project_common_position_to_clipspace(vec4(project_pos.xy + offset, project_pixel(setPickingOrder(0.0)), 1.0));

  float raisingHeight = u_blur_height_fixed.y;

  if(u_blur_height_fixed.z < 1.0) { // false
    raisingHeight = project_pixel(u_blur_height_fixed.y);
  } else {
     if(u_CoordinateSystem == COORDINATE_SYSTEM_LNGLAT || u_CoordinateSystem == COORDINATE_SYSTEM_LNGLAT_OFFSET) {
      float mapboxZoomScale = 4.0/pow(2.0, 21.0 - u_Zoom);
      raisingHeight = u_blur_height_fixed.y * mapboxZoomScale;
    }
  }

  gl_Position = project_common_position_to_clipspace(vec4(project_pos.xy + offset, raisingHeight, 1.0));

  setPickingColor(a_PickingColor);
}
`})),Gp,Kp=t((()=>{E(),P(),F(),Hp(),Wp(),yl(),Gp=class extends N{get attributeLocation(){return Object.assign(super.attributeLocation,{MAX:super.attributeLocation.MAX,SIZE:9,SHAPE:10,EXTRUDE:11})}getCommonUniformsInfo(){let{strokeOpacity:e=1,strokeWidth:t=0,blend:n,blur:r=0,raisingHeight:i=0,heightfixed:a=!1,unit:o=`pixel`}=this.layer.getLayerConfig(),s=this.getAnimateUniforms().u_time;isNaN(s)&&(s=-1);let c={u_blur_height_fixed:[r,Number(i),Number(a)],u_stroke_width:t,u_additive:+(n===`additive`),u_stroke_opacity:e,u_size_unit:_l[o],u_time:s,u_animate:this.getAnimateUniforms().u_animate};return this.getUniformsBufferInfo(c)}getAnimateUniforms(){let{animateOption:e={enable:!1}}=this.layer.getLayerConfig();return{u_animate:this.animateOption2Array(e),u_time:e.enable?this.layer.getLayerAnimateTime():-1}}getAttribute(){return this.styleAttributeService.createAttributesAndIndices(this.layer.getEncodedData(),ru)}async initModels(){return this.buildModels()}async buildModels(){let{frag:e,vert:t,type:n}=this.getShaders();return this.layer.triangulation=ru,this.initUniformsBuffer(),[await this.layer.buildLayerModel({moduleName:n,vertexShader:t,fragmentShader:e,defines:this.getDefines(),inject:this.getInject(),triangulation:ru,depth:{enable:!1}})]}getShaders(){return{frag:Vp,vert:Up,type:`pointFill`}}animateOption2Array(e){return[+!e.enable,e.speed||1,e.rings||3,0]}registerBuiltinAttributes(){let e=this.layer.getLayerConfig().shape2d;this.registerPosition64LowAttribute(),this.styleAttributeService.registerStyleAttribute({name:`extrude`,type:k.Attribute,descriptor:{name:`a_Extrude`,shaderLocation:this.attributeLocation.EXTRUDE,buffer:{usage:m.DYNAMIC_DRAW,data:[],type:m.FLOAT},size:3,update:(e,t,n,r)=>{let i=[1,1,0,-1,1,0,-1,-1,0,1,-1,0],a=r%4*3;return[i[a],i[a+1],i[a+2]]}}}),this.styleAttributeService.registerStyleAttribute({name:`size`,type:k.Attribute,descriptor:{name:`a_Size`,shaderLocation:this.attributeLocation.SIZE,buffer:{usage:m.DYNAMIC_DRAW,data:[],type:m.FLOAT},size:1,update:e=>{let{size:t=5}=e;return Array.isArray(t)?[t[0]]:[t]}}}),this.styleAttributeService.registerStyleAttribute({name:`shape`,type:k.Attribute,descriptor:{name:`a_Shape`,shaderLocation:this.attributeLocation.SHAPE,buffer:{usage:m.DYNAMIC_DRAW,data:[],type:m.FLOAT},size:1,update:t=>{let{shape:n=2}=t;return[e.indexOf(n)]}}})}}})),qp,Jp=t((()=>{qp=`in vec2 v_uv;// 本身的 uv 坐标
in vec2 v_Iconuv;
in float v_opacity;
out vec4 outputColor;

uniform sampler2D u_texture;
layout(std140) uniform commonUniform {
  vec2 u_textSize;
  float u_heightfixed: 0.0;
  float u_raisingHeight: 0.0;
  float u_size_unit;
};

#pragma include "scene_uniforms"
#pragma include "sdf_2d"
#pragma include "picking"

void main() {
  vec2 pos = v_Iconuv / u_textSize + v_uv / u_textSize * 64.;
  outputColor = texture(SAMPLER_2D(u_texture), pos);
  outputColor.a *= v_opacity;
  outputColor = filterColor(outputColor);
}
`})),Yp,Xp=t((()=>{Yp=`layout(location = ATTRIBUTE_LOCATION_POSITION) in vec3 a_Position;
layout(location = ATTRIBUTE_LOCATION_POSITION_64LOW) in vec2 a_Position64Low;
layout(location = ATTRIBUTE_LOCATION_COLOR) in vec4 a_Color;
layout(location = ATTRIBUTE_LOCATION_SIZE) in float a_Size;
layout(location = ATTRIBUTE_LOCATION_EXTRUDE) in vec3 a_Extrude;
layout(location = ATTRIBUTE_LOCATION_UV) in vec2 a_Uv;

layout(std140) uniform commonUniform {
  vec2 u_textSize;
  float u_heightfixed;
  float u_raisingHeight;
  float u_size_unit;
};

out vec2 v_uv;
out vec2 v_Iconuv;
out float v_opacity;

#pragma include "projection"
#pragma include "picking"
#pragma include "rotation_2d"

// 根据 anchor 值计算 extrude 偏移
// anchor: 0=center, 1=top, 2=top-right, 3=right, 4=bottom-right, 5=bottom, 6=bottom-left, 7=left, 8=top-left, 9=bottom-center
vec2 applyAnchor(vec2 extrude, float anchor) {
  if (anchor < 0.5) {
    return extrude;
  }

  vec2 offset = vec2(0.0);

  // horizontal alignment: 左边缘对准坐标 -> 向右移; 右边缘对准坐标 -> 向左移
  if (anchor == 2.0 || anchor == 3.0 || anchor == 4.0) {
    // top-right, right, bottom-right -> shift left
    offset.x = -1.0;
  } else if (anchor == 6.0 || anchor == 7.0 || anchor == 8.0) {
    // bottom-left, left, top-left -> shift right
    offset.x = 1.0;
  }

  // vertical alignment: 上边缘对准坐标 -> 向下移(图形在坐标下方); 下边缘对准坐标 -> 向上移(图形在坐标上方)
  if (anchor == 1.0 || anchor == 2.0 || anchor == 8.0) {
    // top, top-right, top-left -> shift down
    offset.y = -1.0;
  } else if (anchor == 4.0 || anchor == 5.0 || anchor == 6.0 || anchor == 9.0) {
    // bottom-right, bottom, bottom-left, bottom-center -> shift up
    offset.y = 1.0;
  }

  return extrude + offset;
}

void main() {
  vec3 extrude = a_Extrude;
  v_uv = (a_Extrude.xy + 1.0) / 2.0;
  v_uv.x = 1.0 - v_uv.x;
  v_uv.y = 1.0 - v_uv.y;
  v_Iconuv = a_Uv;
  v_opacity = opacity;
  float newSize = a_Size;
  if (u_size_unit == 1.0) {
    newSize = newSize * u_PixelsPerMeter.z;
  }

  // apply anchor to extrude direction
  vec2 anchoredExtrude = applyAnchor(extrude.xy, anchor);

  // vec2 offset = (u_RotateMatrix * extrude.xy * (a_Size) + textrueOffsets);
  vec2 offset = anchoredExtrude.xy * newSize + offsets;

  offset = rotate_matrix(offset, rotation);

  offset = project_pixel(offset);

  vec4 project_pos = project_position(vec4(a_Position.xy, 0.0, 1.0), a_Position64Low);
  gl_Position = project_common_position_to_clipspace(vec4(project_pos.xy + offset, 0.0, 1.0));

  setPickingColor(a_PickingColor);
}
`})),Zp,Qp=t((()=>{E(),P(),yl(),F(),Jp(),Xp(),Zp=class extends N{constructor(...e){super(...e),this.meter2coord=1,this.isMeter=!1,this.radian=0,this.updateTexture=()=>{let{createTexture2D:e}=this.rendererService;this.texture?(this.texture.update({data:this.iconService.getCanvas(),mag:`linear`,min:`linear mipmap nearest`,mipmap:!0}),this.layerService.throttleRenderLayers()):(this.texture=e({data:this.iconService.getCanvas(),mag:m.LINEAR,min:m.LINEAR_MIPMAP_LINEAR,premultiplyAlpha:!1,width:1024,height:this.iconService.canvasHeight||128,mipmap:!0}),this.textures=[this.texture])}}get attributeLocation(){return Object.assign(super.attributeLocation,{MAX:super.attributeLocation.MAX,SIZE:9,EXTRUDE:10,UV:11})}getCommonUniformsInfo(){let{raisingHeight:e=0,heightfixed:t=!1,unit:n=`pixel`}=this.layer.getLayerConfig();this.rendererService.getDirty()&&this.texture?.bind();let r={u_textSize:[1024,this.iconService.canvasHeight||128],u_heightfixed:Number(t),u_raisingHeight:Number(e),u_size_unit:_l[n]};return this.getUniformsBufferInfo(r)}getAttribute(){return this.styleAttributeService.createAttributesAndIndices(this.layer.getEncodedData(),ru)}async initModels(){return this.iconService.on(`imageUpdate`,this.updateTexture),this.updateTexture(),this.buildModels()}async buildModels(){return this.initUniformsBuffer(),[await this.layer.buildLayerModel({moduleName:`pointFillImage`,vertexShader:Yp,fragmentShader:qp,triangulation:ru,depth:{enable:!1},defines:this.getDefines(),inject:this.getInject(),cull:{enable:!0,face:m.FRONT}})]}clearModels(){this.iconService.off(`imageUpdate`,this.updateTexture),this.texture?.destroy()}registerBuiltinAttributes(){this.registerPosition64LowAttribute(),this.styleAttributeService.registerStyleAttribute({name:`uv`,type:k.Attribute,descriptor:{name:`a_Uv`,shaderLocation:this.attributeLocation.UV,buffer:{usage:m.DYNAMIC_DRAW,data:[],type:m.FLOAT},size:2,update:e=>{let t=this.iconService.getIconMap(),{shape:n}=e,{x:r,y:i}=t[n]||{x:-64,y:-64};return[r,i]}}}),this.styleAttributeService.registerStyleAttribute({name:`extrude`,type:k.Attribute,descriptor:{name:`a_Extrude`,shaderLocation:this.attributeLocation.EXTRUDE,buffer:{usage:m.DYNAMIC_DRAW,data:[],type:m.FLOAT},size:3,update:(e,t,n,r)=>{let i=[1,1,0,-1,1,0,-1,-1,0,1,-1,0],a=r%4*3;return[i[a],i[a+1],i[a+2]]}}}),this.styleAttributeService.registerStyleAttribute({name:`size`,type:k.Attribute,descriptor:{name:`a_Size`,shaderLocation:this.attributeLocation.SIZE,buffer:{usage:m.DYNAMIC_DRAW,data:[],type:m.FLOAT},size:1,update:e=>{let{size:t=5}=e;return Array.isArray(t)?[t[0]]:[t]}}})}}})),$p,em=t((()=>{$p=class{constructor(e,t,n){this.boxCells=[];let r=this.boxCells;this.xCellCount=Math.ceil(e/n),this.yCellCount=Math.ceil(t/n);for(let e=0;e<this.xCellCount*this.yCellCount;e++)r.push([]);this.boxKeys=[],this.bboxes=[],this.width=e,this.height=t,this.xScale=this.xCellCount/e,this.yScale=this.yCellCount/t,this.boxUid=0}insert(e,t,n,r,i){this.forEachCell(t,n,r,i,this.insertBoxCell,this.boxUid++),this.boxKeys.push(e),this.bboxes.push(t),this.bboxes.push(n),this.bboxes.push(r),this.bboxes.push(i)}query(e,t,n,r,i){return this.queryHitTest(e,t,n,r,!1,i)}hitTest(e,t,n,r,i){return this.queryHitTest(e,t,n,r,!0,i)}insertBoxCell(e,t,n,r,i,a){this.boxCells[i].push(a)}queryHitTest(e,t,n,r,i,a){if(n<0||e>this.width||r<0||t>this.height)return!i&&[];let o=[];if(e<=0&&t<=0&&this.width<=n&&this.height<=r){if(i)return!0;for(let e=0;e<this.boxKeys.length;e++)o.push({key:this.boxKeys[e],x1:this.bboxes[e*4],y1:this.bboxes[e*4+1],x2:this.bboxes[e*4+2],y2:this.bboxes[e*4+3]});return a?o.filter(a):o}let s={hitTest:i,seenUids:{box:{},circle:{}}};return this.forEachCell(e,t,n,r,this.queryCell,o,s,a),i?o.length>0:o}queryCell(e,t,n,r,i,a,o,s){let c=o.seenUids,l=this.boxCells[i];if(l!==null){let i=this.bboxes;for(let u of l)if(!c.box[u]){c.box[u]=!0;let l=u*4;if(e<=i[l+2]&&t<=i[l+3]&&n>=i[l+0]&&r>=i[l+1]&&(!s||s(this.boxKeys[u]))){if(o.hitTest)return a.push(!0),!0;a.push({key:this.boxKeys[u],x1:i[l],y1:i[l+1],x2:i[l+2],y2:i[l+3]})}}}return!1}forEachCell(e,t,n,r,i,a,o,s){let c=this.convertToXCellCoord(e),l=this.convertToYCellCoord(t),u=this.convertToXCellCoord(n),d=this.convertToYCellCoord(r);for(let f=c;f<=u;f++)for(let c=l;c<=d;c++){let l=this.xCellCount*c+f;if(i.call(this,e,t,n,r,l,a,o,s))return}}convertToXCellCoord(e){return Math.max(0,Math.min(this.xCellCount-1,Math.floor(e*this.xScale)))}convertToYCellCoord(e){return Math.max(0,Math.min(this.yCellCount-1,Math.floor(e*this.yScale)))}}})),tm,nm=t((()=>{ir(),em(),tm=class{constructor(e,t){this.viewportPadding=100,this.width=e,this.height=t,this.viewportPadding=Math.max(e,t),this.grid=new $p(e+this.viewportPadding,t+this.viewportPadding,25),this.screenRightBoundary=e+this.viewportPadding,this.screenBottomBoundary=t+this.viewportPadding,this.gridRightBoundary=e+2*this.viewportPadding,this.gridBottomBoundary=t+2*this.viewportPadding}placeCollisionBox(e){let t=e.x1+e.anchorPointX+this.viewportPadding,n=e.y1+e.anchorPointY+this.viewportPadding,r=e.x2+e.anchorPointX+this.viewportPadding,i=e.y2+e.anchorPointY+this.viewportPadding;return!this.isInsideGrid(t,n,r,i)||this.grid.hitTest(t,n,r,i)?{box:[]}:{box:[t,n,r,i]}}insertCollisionBox(e,t){let n={featureIndex:t};this.grid.insert(n,e[0],e[1],e[2],e[3])}project(e,t,n){let r=Fn(t,n,0,1),i=Gn(),a=Bn(...e);return Ln(i,r,a),{x:(i[0]/i[3]+1)/2*this.width+this.viewportPadding,y:(-i[1]/i[3]+1)/2*this.height+this.viewportPadding}}isInsideGrid(e,t,n,r){return n>=0&&e<this.gridRightBoundary&&r>=0&&t<this.gridBottomBoundary}}})),rm,im=t((()=>{rm=`layout(std140) uniform commonUniforms {
  vec2 u_textSize;
  float u_raisingHeight;
  float u_heightfixed;
};

uniform sampler2D u_texture;

in vec4 v_color;
in vec2 v_uv;
in float v_opacity;

#pragma include "picking"

out vec4 outputColor;

void main() {
  vec2 pos = v_uv / u_textSize + gl_PointCoord / u_textSize * 64.0;
  vec4 textureColor;

  // Y = 0.299R + 0.587G + 0.114B // 亮度提取

  textureColor = texture(SAMPLER_2D(u_texture), pos);

  // Tip: 去除边缘部分 mipmap 导致的混合变暗
  float fragmengTocenter = distance(vec2(0.5), gl_PointCoord);
  if (fragmengTocenter >= 0.5) {
    float luma = 0.299 * textureColor.r + 0.587 * textureColor.g + 0.114 * textureColor.b;
    textureColor.a *= luma;
  }

  if (
    all(lessThan(v_color, vec4(1.0 + 0.00001))) && all(greaterThan(v_color, vec4(1.0 - 0.00001))) ||
    v_color == vec4(1.0)
  ) {
    outputColor = textureColor;
  } else {
    outputColor = step(0.01, textureColor.z) * v_color;
  }
  outputColor.a *= v_opacity;
  if (outputColor.a < 0.01) {
    discard;
  }
  outputColor = filterColor(outputColor);
}
`})),am,om=t((()=>{am=`layout(location = ATTRIBUTE_LOCATION_POSITION) in vec3 a_Position;
layout(location = ATTRIBUTE_LOCATION_POSITION_64LOW) in vec2 a_Position64Low;
layout(location = ATTRIBUTE_LOCATION_COLOR) in vec4 a_Color;
layout(location = ATTRIBUTE_LOCATION_SIZE) in float a_Size;
layout(location = ATTRIBUTE_LOCATION_UV) in vec2 a_Uv;

layout(std140) uniform commonUniforms {
  vec2 u_textSize;
  float u_raisingHeight;
  float u_heightfixed;
};

out vec4 v_color;
out vec2 v_uv;
out float v_opacity;

#pragma include "projection"
#pragma include "picking"

// 根据 anchor 值计算点精灵的像素偏移
// anchor: 0=center, 1=top, 2=top-right, 3=right, 4=bottom-right, 5=bottom, 6=bottom-left, 7=left, 8=top-left, 9=bottom-center
vec2 applyAnchorPoint(float anchor, float pointSize) {
  if (anchor < 0.5) {
    return vec2(0.0);
  }

  vec2 offset = vec2(0.0);
  float gap = 2.0 * u_DevicePixelRatio; // 2px 间隔，考虑设备像素比

  // horizontal alignment: 左边缘对准坐标 -> 向右移; 右边缘对准坐标 -> 向左移
  if (anchor == 2.0 || anchor == 3.0 || anchor == 4.0) {
    offset.x = -pointSize * 0.5;
  } else if (anchor == 6.0 || anchor == 7.0 || anchor == 8.0) {
    offset.x = pointSize * 0.5;
  }

  // vertical alignment: 上边缘对准坐标 -> 向下移(图形在坐标下方); 下边缘对准坐标 -> 向上移(图形在坐标上方)
  // bottom 和 top 增加 2px 间隔，避免图形紧贴参考点
  if (anchor == 1.0 || anchor == 2.0 || anchor == 8.0) {
    offset.y = -pointSize * 0.5 - gap; // top: 图形在坐标下方，额外向下移 2px
  } else if (anchor == 4.0 || anchor == 5.0 || anchor == 6.0 || anchor == 9.0) {
    offset.y = pointSize * 0.5 + gap; // bottom: 图形在坐标上方，额外向上移 2px
  }

  return offset;
}

void main() {
  // cal style mapping - 数据纹理映射部分的计算
  v_color = a_Color;
  v_opacity = opacity;
  v_uv = a_Uv;
  vec4 project_pos = project_position(vec4(a_Position, 1.0), a_Position64Low);

  vec2 offset = project_pixel(offsets);

  float raisingHeight = u_raisingHeight;
  if (u_heightfixed < 1.0) {
    // false
    raisingHeight = project_pixel(u_raisingHeight);
  } else {
    if (
      u_CoordinateSystem == COORDINATE_SYSTEM_LNGLAT ||
      u_CoordinateSystem == COORDINATE_SYSTEM_LNGLAT_OFFSET
    ) {
      float mapboxZoomScale = 4.0 / pow(2.0, 21.0 - u_Zoom);
      raisingHeight = u_raisingHeight * mapboxZoomScale;
    }
  }

  gl_Position = project_common_position_to_clipspace(vec4(project_pos.xy + offset, raisingHeight, 1.0));

  gl_PointSize = a_Size * 2.0 * u_DevicePixelRatio;

  // apply anchor offset in screen space
  vec2 anchorOffset = applyAnchorPoint(anchor, gl_PointSize);
  gl_Position.xy += anchorOffset / u_ViewportSize * 2.0 * gl_Position.w;

  setPickingColor(a_PickingColor);
}
`})),sm,cm=t((()=>{E(),D(),P(),F(),nm(),im(),om(),sm=class extends N{constructor(...e){super(...e),this.imageFilterMap=null,this.currentZoom=-1,this.preAllowOverlap=!0,this.updateTexture=()=>{let{createTexture2D:e}=this.rendererService;this.texture?(this.texture.update({data:this.iconService.getCanvas(),mag:`linear`,min:`linear mipmap nearest`,mipmap:!0}),setTimeout(()=>{this.layerService.throttleRenderLayers()})):this.texture=e({data:this.iconService.getCanvas(),mag:m.LINEAR,min:m.LINEAR_MIPMAP_LINEAR,premultiplyAlpha:!1,width:1024,height:this.iconService.canvasHeight||128,mipmap:!0})}}get attributeLocation(){return Object.assign(super.attributeLocation,{MAX:super.attributeLocation.MAX,SIZE:9,UV:10})}getUninforms(){this.rendererService.getDirty()&&this.texture?.bind();let e=this.getCommonUniformsInfo(),t=this.getUniformsBufferInfo(this.getStyleAttribute());return this.updateStyleUnifoms(),{...e.uniformsOption,...t.uniformsOption}}getCommonUniformsInfo(){let{raisingHeight:e=0,heightfixed:t=!1}=this.layer.getLayerConfig(),n={u_textSize:[1024,this.iconService.canvasHeight||128],u_raisingHeight:Number(e),u_heightfixed:Number(t),u_texture:this.texture};return this.textures=[this.texture],this.getUniformsBufferInfo(n)}async initModels(){let{allowOverlap:e=!0}=this.layer.getLayerConfig();return this.extent=this.imageExtent(),this.preAllowOverlap=e,this.iconService.on(`imageUpdate`,this.updateTexture),this.updateTexture(),this.buildModels()}async buildModels(){let{allowOverlap:e=!0}=this.layer.getLayerConfig();return this.initUniformsBuffer(),e?this.imageFilterMap=null:this.filterImages(),[await this.layer.buildLayerModel({moduleName:`pointImage`,vertexShader:am,fragmentShader:rm,triangulation:ou.bind(this),defines:this.getDefines(),inject:this.getInject(),depth:{enable:!1},primitive:m.POINTS})]}async needUpdate(){let{allowOverlap:e=!0}=this.layer.getLayerConfig();if(e!==this.preAllowOverlap)return this.preAllowOverlap=e,await this.reBuildModel(),!0;if(e)return!1;let t=this.mapService.getZoom(),n=this.mapService.getBounds(),r=$e(this.extent,n);return Math.abs(this.currentZoom-t)>.5||!r?(await this.reBuildModel(),!0):!1}clearModels(){this.texture?.destroy(),this.iconService.off(`imageUpdate`,this.updateTexture)}registerBuiltinAttributes(){this.registerPosition64LowAttribute(),this.styleAttributeService.registerStyleAttribute({name:`size`,type:k.Attribute,descriptor:{name:`a_Size`,shaderLocation:this.attributeLocation.SIZE,buffer:{usage:m.DYNAMIC_DRAW,data:[],type:m.FLOAT},size:1,update:e=>{let{size:t=5}=e;return Array.isArray(t)?[t[0]]:[t]}}}),this.styleAttributeService.registerStyleAttribute({name:`uv`,type:k.Attribute,descriptor:{name:`a_Uv`,shaderLocation:this.attributeLocation.UV,buffer:{usage:m.DYNAMIC_DRAW,data:[],type:m.FLOAT},size:2,update:e=>{let t=this.iconService.getIconMap(),{shape:n}=e,{x:r,y:i}=t[n]||{x:-64,y:-64};return[r,i]}}})}filterImages(){let{padding:e=[0,0]}=this.layer.getLayerConfig();this.imageFilterMap={},this.currentZoom=this.mapService.getZoom(),this.extent=this.imageExtent();let{width:t,height:n}=this.rendererService.getViewportSize(),r=new tm(t,n);this.layer.getEncodedData().forEach(t=>{let{id:n=0,size:i=5}=t,a=Array.isArray(i)?i[0]:i,o=rt(t.coordinates),s=this.mapService.lngLatToContainer(o),{box:c}=r.placeCollisionBox({x1:-a-e[0],x2:a+e[0],y1:-a-e[1],y2:a+e[1],anchorPointX:s.x,anchorPointY:s.y});c&&c.length&&(r.insertCollisionBox(c,n),this.imageFilterMap[n]=!0)})}imageExtent(){let e=this.mapService.getBounds();return Ce(e,.5)}async reBuildModel(){let{allowOverlap:e=!0}=this.layer.getLayerConfig();e?this.imageFilterMap=null:this.filterImages();let t=await this.layer.buildLayerModel({moduleName:`pointImage`,vertexShader:am,fragmentShader:rm,triangulation:ou.bind(this),defines:this.getDefines(),inject:this.getInject(),depth:{enable:!1},primitive:m.POINTS});this.layer.models=[t]}}})),lm,um=t((()=>{lm=`in vec4 v_color;
out vec4 outputColor;
void main() {
  outputColor = v_color;
}
`})),dm,fm=t((()=>{dm=`layout(location = ATTRIBUTE_LOCATION_POSITION) in vec3 a_Position;
layout(location = ATTRIBUTE_LOCATION_POSITION_64LOW) in vec2 a_Position64Low;
layout(location = ATTRIBUTE_LOCATION_COLOR) in vec4 a_Color;
layout(location = ATTRIBUTE_LOCATION_SIZE) in float a_Size;

layout(std140) uniform u_Common {
  float u_size_scale;
};

out vec4 v_color;

#pragma include "projection"
#pragma include "project"

// 根据 anchor 值计算点精灵的像素偏移
// anchor: 0=center, 1=top, 2=top-right, 3=right, 4=bottom-right, 5=bottom, 6=bottom-left, 7=left, 8=top-left, 9=bottom-center
vec2 applyAnchorPoint(float anchor, float pointSize) {
  if (anchor < 0.5) {
    return vec2(0.0);
  }

  vec2 offset = vec2(0.0);
  float gap = 2.0 * u_DevicePixelRatio; // 2px 间隔，考虑设备像素比

  // horizontal alignment: 左边缘对准坐标 -> 向右移; 右边缘对准坐标 -> 向左移
  if (anchor == 2.0 || anchor == 3.0 || anchor == 4.0) {
    offset.x = -pointSize * 0.5;
  } else if (anchor == 6.0 || anchor == 7.0 || anchor == 8.0) {
    offset.x = pointSize * 0.5;
  }

  // vertical alignment: 上边缘对准坐标 -> 向下移(图形在坐标下方); 下边缘对准坐标 -> 向上移(图形在坐标上方)
  // bottom 和 top 增加 2px 间隔，避免图形紧贴参考点
  if (anchor == 1.0 || anchor == 2.0 || anchor == 8.0) {
    offset.y = -pointSize * 0.5 - gap; // top: 图形在坐标下方，额外向下移 2px
  } else if (anchor == 4.0 || anchor == 5.0 || anchor == 6.0 || anchor == 9.0) {
    offset.y = pointSize * 0.5 + gap; // bottom: 图形在坐标上方，额外向上移 2px
  }

  return offset;
}

void main() {
  v_color = vec4(a_Color.xyz, a_Color.w * opacity);

  vec4 project_pos = project_position(vec4(a_Position, 1.0), a_Position64Low);
  gl_Position = project_common_position_to_clipspace(project_pos);

  gl_PointSize = a_Size * u_size_scale * 2.0 * u_DevicePixelRatio;

  // apply anchor offset in screen space
  vec2 anchorOffset = applyAnchorPoint(anchor, gl_PointSize);
  gl_Position.xy += anchorOffset / u_ViewportSize * 2.0 * gl_Position.w;
}
`}));function pm(e){let t=e.coordinates;return{vertices:[...t],indices:[0],size:t.length}}var mm,hm=t((()=>{E(),P(),um(),fm(),mm=class extends N{get attributeLocation(){return Object.assign(super.attributeLocation,{MAX:super.attributeLocation.MAX,SIZE:9})}getDefaultStyle(){return{blend:`additive`}}getCommonUniformsInfo(){return this.getUniformsBufferInfo({u_size_scale:.5})}async initModels(){return this.buildModels()}async buildModels(){return this.layer.triangulation=pm,this.initUniformsBuffer(),[await this.layer.buildLayerModel({moduleName:`pointNormal`,vertexShader:dm,fragmentShader:lm,triangulation:pm,defines:this.getDefines(),inject:this.getInject(),depth:{enable:!1},primitive:m.POINTS,pick:!1})]}clearModels(){}registerBuiltinAttributes(){this.registerPosition64LowAttribute(),this.styleAttributeService.registerStyleAttribute({name:`size`,type:k.Attribute,descriptor:{name:`a_Size`,shaderLocation:this.attributeLocation.SIZE,buffer:{usage:m.DYNAMIC_DRAW,data:[],type:m.FLOAT},size:1,update:e=>{let{size:t=1}=e;return Array.isArray(t)?[t[0]]:[t]}}})}}})),gm,_m=t((()=>{gm=`
layout(std140) uniform commonUniorm{
  float u_additive;
  float u_size_unit;
  float u_speed: 1.0;
  float u_time;
};
in vec4 v_data;
in vec4 v_color;
in float v_radius;
in vec2 v_extrude;
#pragma include "sdf_2d"
#pragma include "picking"

out vec4 outputColor;

void main() {

  lowp float antialiasblur = v_data.z;
  float r = v_radius / (v_radius);

  float outer_df = sdCircle(v_data.xy, 1.0);
  float inner_df = sdCircle(v_data.xy, r);

  float opacity_t = smoothstep(0.0, antialiasblur, outer_df);

  outputColor = vec4(v_color.rgb, v_color.a);

  if(u_additive > 0.0) {
    outputColor *= opacity_t;
  } else {
    outputColor.a *= opacity_t;
  }

  if(outputColor.a > 0.0) {
    outputColor = filterColor(outputColor);
  }

  vec2 extrude =  v_extrude;
  vec2 dir = normalize(extrude);
  vec2 baseDir = vec2(1.0, 0.0);
  float pi = 3.14159265359;
  float flag = sign(dir.y);
  float rades = dot(dir, baseDir);
  float radar_v = (flag - 1.0) * -0.5 * acos(rades)/pi;
  // simple AA
  if(radar_v > 0.99) {
    radar_v = 1.0 - (radar_v - 0.99)/0.01;
  }

  outputColor.a *= radar_v;
}
`})),vm,ym=t((()=>{vm=`layout(location = ATTRIBUTE_LOCATION_POSITION) in vec3 a_Position;
layout(location = ATTRIBUTE_LOCATION_POSITION_64LOW) in vec2 a_Position64Low;
layout(location = ATTRIBUTE_LOCATION_COLOR) in vec4 a_Color;
layout(location = ATTRIBUTE_LOCATION_SIZE) in float a_Size;
layout(location = ATTRIBUTE_LOCATION_EXTRUDE) in vec3 a_Extrude;

layout(std140) uniform commonUniorm {
  float u_additive;
  float u_size_unit;
  float u_speed: 1.0;
  float u_time;
};

out vec4 v_data;
out vec4 v_color;
out float v_radius;
out vec2 v_extrude;

#pragma include "projection"
#pragma include "picking"

// 根据 anchor 值计算 extrude 偏移
// anchor: 0=center, 1=top, 2=top-right, 3=right, 4=bottom-right, 5=bottom, 6=bottom-left, 7=left, 8=top-left, 9=bottom-center
vec2 applyAnchor(vec2 extrude, float anchor) {
  if (anchor < 0.5) {
    return extrude;
  }

  vec2 offset = vec2(0.0);

  // horizontal alignment: 左边缘对准坐标 -> 向右移; 右边缘对准坐标 -> 向左移
  if (anchor == 2.0 || anchor == 3.0 || anchor == 4.0) {
    offset.x = -1.0;
  } else if (anchor == 6.0 || anchor == 7.0 || anchor == 8.0) {
    offset.x = 1.0;
  }

  // vertical alignment: 上边缘对准坐标 -> 向下移(图形在坐标下方); 下边缘对准坐标 -> 向上移(图形在坐标上方)
  if (anchor == 1.0 || anchor == 2.0 || anchor == 8.0) {
    // top, top-right, top-left -> shift down
    offset.y = -1.0;
  } else if (anchor == 4.0 || anchor == 5.0 || anchor == 6.0 || anchor == 9.0) {
    // bottom-right, bottom, bottom-left, bottom-center -> shift up
    offset.y = 1.0;
  }

  return extrude + offset;
}

void main() {
  float newSize = setPickingSize(a_Size);

  float time = u_time * u_speed;
  mat2 rotateMatrix = mat2(
    cos(time), sin(time),
    -sin(time), cos(time)
  );

  // apply anchor to extrude direction before rotation
  vec2 anchoredExtrude = applyAnchor(a_Extrude.xy, anchor);
  v_extrude = rotateMatrix * anchoredExtrude;

  v_color = a_Color;
  v_color.a *= opacity;

  float blur = 0.0;
  float antialiasblur = -max(2.0 / u_DevicePixelRatio / a_Size, blur);

  if(u_size_unit == 1.) {
    newSize = newSize  * u_PixelsPerMeter.z;
  }
  v_radius = newSize;

  vec2 offset = (anchoredExtrude * (newSize));

  offset = project_pixel(offset);

  v_data = vec4(anchoredExtrude.x, anchoredExtrude.y, antialiasblur, -1.0);

  vec4 project_pos = project_position(vec4(a_Position.xy, 0.0, 1.0), a_Position64Low);
  gl_Position = project_common_position_to_clipspace(vec4(project_pos.xy + offset, project_pixel(setPickingOrder(0.0)), 1.0));

  setPickingColor(a_PickingColor);
}
`})),bm,xm=t((()=>{E(),P(),yl(),F(),_m(),ym(),bm=class extends N{get attributeLocation(){return Object.assign(super.attributeLocation,{MAX:super.attributeLocation.MAX,SIZE:9,EXTRUDE:10})}getCommonUniformsInfo(){let{blend:e,speed:t=1,unit:n=`pixel`}=this.layer.getLayerConfig(),r={u_additive:+(e===`additive`),u_size_unit:_l[n],u_speed:t,u_time:this.layer.getLayerAnimateTime()};return this.getUniformsBufferInfo(r)}getAnimateUniforms(){return{}}getAttribute(){return this.styleAttributeService.createAttributesAndIndices(this.layer.getEncodedData(),ru)}async initModels(){return this.buildModels()}async buildModels(){return this.initUniformsBuffer(),[await this.layer.buildLayerModel({moduleName:`pointRadar`,vertexShader:vm,fragmentShader:gm,triangulation:ru,defines:this.getDefines(),inject:this.getInject(),depth:{enable:!1}})]}animateOption2Array(e){return[+!e.enable,e.speed||1,e.rings||3,0]}registerBuiltinAttributes(){this.registerPosition64LowAttribute(),this.styleAttributeService.registerStyleAttribute({name:`extrude`,type:k.Attribute,descriptor:{name:`a_Extrude`,shaderLocation:this.attributeLocation.EXTRUDE,buffer:{usage:m.DYNAMIC_DRAW,data:[],type:m.FLOAT},size:3,update:(e,t,n,r)=>{let i=[1,1,0,-1,1,0,-1,-1,0,1,-1,0],a=r%4*3;return[i[a],i[a+1],i[a+2]]}}}),this.styleAttributeService.registerStyleAttribute({name:`size`,type:k.Attribute,descriptor:{shaderLocation:this.attributeLocation.SIZE,name:`a_Size`,buffer:{usage:m.DYNAMIC_DRAW,data:[],type:m.FLOAT},size:1,update:e=>{let{size:t=5}=e;return Array.isArray(t)?[t[0]]:[t]}}})}}}));function Sm(e){let t=.5,n=.5;switch(e){case`right`:case`top-right`:case`bottom-right`:t=1;break;case`left`:case`top-left`:case`bottom-left`:t=0;break;default:t=.5}switch(e){case`top`:case`top-right`:case`top-left`:n=1;break;case`bottom`:case`bottom-right`:case`bottom-left`:case`bottom-center`:n=0;break;default:n=.5}return{horizontalAlign:t,verticalAlign:n}}function Cm(e,t,n,r,i){if(!i)return;let a=e[r],o=a.glyph;if(o){let s=t[o].advance*a.scale,c=(e[r].x+s)*i;for(let t=n;t<=r;t++)e[t].x-=c}}function wm(e,t,n,r,i,a,o,s){let c=(t-n)*i,l=(-r*o+.5)*a;r===1?l+=s:r===0&&(l-=s);for(let t of e)t.x+=c,t.y+=l}function Tm(e,t,n,r,i,a,o){let s=0,c=-8,l=0,u=e.positionedGlyphs,d=a===`right`?1:a===`left`?0:.5,f=u.length;n.forEach(e=>{if(e.split(``).forEach(e=>{let n=t[e];n&&(u.push({glyph:e,x:s,y:c+0,vertical:!1,scale:1,metrics:n}),s+=n.advance+o)}),u.length!==f){let e=s-o;l=Math.max(e,l),Cm(u,t,f,u.length-1,d)}s=0,c-=r+5});let{horizontalAlign:p,verticalAlign:m}=Sm(i);wm(u,d,p,m,l,r,n.length,-8);let h=c- -8;e.top+=-m*h,e.bottom=e.top-h,e.left+=-p*l,e.right=e.left+l}function Em(e,t,n,r,i,a,o){let s=0,c=-8,l=0,u=e.positionedGlyphs,d=a===`right`?1:a===`left`?0:.5,f=u.length;n.forEach(e=>{let n=t[e];if(n&&(u.push({glyph:e,x:s+4,y:4-n.height/2,vertical:!1,scale:1,metrics:n}),s+=n.width+o),u.length!==f){let e=s-o;l=Math.max(e,l)}s=0,c-=r+5});let{horizontalAlign:p,verticalAlign:m}=Sm(i);wm(u,d,p,m,l,r,n.length,-8);let h=c- -8;e.top+=-m*h,e.bottom=e.top-h,e.left+=-p*l,e.right=e.left+l}function Dm(e,t,n,r,i,a,o=[0,0],s){let c=e.split(`
`),l=[],u={positionedGlyphs:l,top:o[1],bottom:o[1],left:o[0],right:o[0],lineCount:c.length,text:e};return s?Em(u,t,c,n,r,i,a):Tm(u,t,c,n,r,i,a),l.length?u:!1}function Om(e,t=[0,0],n){let{positionedGlyphs:r=[]}=e,i=[];for(let e of r){let r=e.metrics,a=r.advance*e.scale/2,o=n?[e.x+a,e.y]:[0,0],s=n?[0,0]:[e.x+a+t[0],e.y+t[1]],c=-4*e.scale-a+s[0],l=-4*e.scale+s[1],u=c+r.width*e.scale,d=l+r.height*e.scale,f={x:c,y:l},p={x:u,y:l},m={x:c,y:d},h={x:u,y:d};i.push({tl:f,tr:p,bl:m,br:h,tex:r,glyphOffset:o})}return i}var km=t((()=>{})),Am,jm=t((()=>{Am=`#define SDF_PX 8.0
#define EDGE_GAMMA 0.105
#define FONT_SIZE 48.0

uniform sampler2D u_sdf_map;
layout(std140) uniform commonUniforms {
  vec4 u_stroke_color : [0.0, 0.0, 0.0, 0.0];
  vec4 u_background_color : [0.0, 0.0, 0.0, 0.0];
  vec2 u_sdf_map_size;
  float u_raisingHeight: 0.0;
  float u_stroke_width : 2;
  float u_background_radius : 0.0;
  float u_background_shape : 0.0;
  float u_gamma_scale : 0.5;
  float u_halo_blur : 0.5;
};

in vec2 v_uv;
in vec2 v_backgroundUV;
in vec2 v_backgroundSize;
in float v_gamma_scale;
in float v_textQuadType;
in vec4 v_color;
in vec4 v_stroke_color;
in vec4 v_background_color;
in float v_fontScale;

out vec4 outputColor;

#pragma include "picking"
void main() {
  // get style data mapping

  if (v_textQuadType > 0.5) {
    vec2 halfSize = v_backgroundSize * 0.5;
    float radius = clamp(u_background_radius, 0.0, min(halfSize.x, halfSize.y));
    if (u_background_shape > 0.5) {
      radius = min(halfSize.x, halfSize.y);
    }

    vec2 centered = (v_backgroundUV - 0.5) * v_backgroundSize;
    vec2 q = abs(centered) - (halfSize - vec2(radius));
    float signedDistance = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - radius;
    float aa = max(fwidth(signedDistance), 1.0);
    float backgroundAlpha = (1.0 - smoothstep(0.0, aa, signedDistance)) * v_background_color.a;
    outputColor = vec4(v_background_color.rgb, backgroundAlpha);
    if (outputColor.a < 0.01) {
      discard;
    }
    outputColor = filterColor(outputColor);
    return;
  }

  // get sdf from atlas
  float dist = texture(SAMPLER_2D(u_sdf_map), v_uv).a;

  lowp float fill_buff = 6.0 / SDF_PX;
  lowp float stroke_buff = (6.0 - u_stroke_width / v_fontScale) / SDF_PX;
  highp float gamma = (u_halo_blur * 1.19 / SDF_PX + EDGE_GAMMA) / (v_fontScale * u_gamma_scale) / 1.0;

  highp float gamma_scaled = gamma * v_gamma_scale;

  highp float fill_alpha = smoothstep(
    fill_buff - gamma_scaled,
    fill_buff + gamma_scaled,
    dist
  ) * v_color.a;
  highp float outer_alpha = smoothstep(
    stroke_buff - gamma_scaled,
    stroke_buff + gamma_scaled,
    dist
  );
  highp float stroke_alpha = max(outer_alpha - fill_alpha / max(v_color.a, 0.0001), 0.0) * v_stroke_color.a;

  float out_alpha = clamp(fill_alpha + stroke_alpha, 0.0, 1.0);
  vec3 out_rgb = vec3(0.0);
  if (out_alpha > 0.0) {
    out_rgb = (v_color.rgb * fill_alpha + v_stroke_color.rgb * stroke_alpha) / out_alpha;
  }

  outputColor = vec4(out_rgb, out_alpha);
   // 作为 mask 模板时需要丢弃透明的像素
  if (outputColor.a < 0.01) {
    discard;
  }
  outputColor = filterColor(outputColor);
}
`})),Mm,Nm=t((()=>{Mm=`#define SDF_PX 8.0
#define EDGE_GAMMA 0.105
#define FONT_SIZE 24.0

layout(location = ATTRIBUTE_LOCATION_POSITION) in vec3 a_Position;
layout(location = ATTRIBUTE_LOCATION_POSITION_64LOW) in vec2 a_Position64Low;
layout(location = ATTRIBUTE_LOCATION_COLOR) in vec4 a_Color;
layout(location = ATTRIBUTE_LOCATION_SIZE) in float a_Size;
layout(location = ATTRIBUTE_LOCATION_TEXT_OFFSETS) in vec2 a_textOffsets;
layout(location = ATTRIBUTE_LOCATION_UV) in vec2 a_tex;
layout(location = ATTRIBUTE_LOCATION_TEXT_QUAD_TYPE) in float a_textQuadType;
layout(location = ATTRIBUTE_LOCATION_TEXT_BACKGROUND_UV) in vec2 a_backgroundUV;
layout(location = ATTRIBUTE_LOCATION_TEXT_BACKGROUND_SIZE) in vec2 a_backgroundSize;

layout(std140) uniform commonUniforms {
  vec4 u_stroke_color : [0.0, 0.0, 0.0, 0.0];
  vec4 u_background_color : [0.0, 0.0, 0.0, 0.0];
  vec2 u_sdf_map_size;
  float u_raisingHeight: 0.0;
  float u_stroke_width : 2;
  float u_background_radius : 0.0;
  float u_background_shape : 0.0;
  float u_gamma_scale : 0.5;
  float u_halo_blur : 0.5;
};

out vec2 v_uv;
out vec2 v_backgroundUV;
out vec2 v_backgroundSize;
out float v_gamma_scale;
out float v_textQuadType;
out vec4 v_color;
out vec4 v_stroke_color;
out vec4 v_background_color;
out float v_fontScale;

#pragma include "projection"
#pragma include "picking"
#pragma include "rotation_2d"

void main() {
  // cal style mapping - 数据纹理映射部分的计算

  v_uv = a_tex / u_sdf_map_size;
  v_backgroundUV = a_backgroundUV;
  v_backgroundSize = a_backgroundSize;
  v_textQuadType = a_textQuadType;



  v_color = vec4(a_Color.xyz, a_Color.w * opacity);
  v_stroke_color = vec4(u_stroke_color.xyz, u_stroke_color.w * opacity);
  v_background_color = vec4(u_background_color.xyz, u_background_color.w * opacity);

  // 文本缩放比例
  float fontScale = a_Size / FONT_SIZE;
  v_fontScale = fontScale;

  vec4 project_pos = project_position(vec4(a_Position, 1.0), a_Position64Low);
  // vec4 projected_position  = project_common_position_to_clipspace(vec4(project_pos.xyz, 1.0));

  vec2 offset = rotate_matrix(a_textOffsets,rotation);

  // gl_Position = vec4(projected_position.xy / projected_position.w + rotation_matrix * a_textOffsets * fontScale / u_ViewportSize * 2.0 * u_DevicePixelRatio, 0.0, 1.0);

  float raiseHeight = u_raisingHeight;
  if(u_CoordinateSystem == COORDINATE_SYSTEM_LNGLAT || u_CoordinateSystem == COORDINATE_SYSTEM_LNGLAT_OFFSET) {
    float mapboxZoomScale = 4.0/pow(2.0, 21.0 - u_Zoom);
    raiseHeight = u_raisingHeight * mapboxZoomScale;
  }

  vec4 projected_position = project_common_position_to_clipspace(vec4(project_pos.xyz + vec3(0.0, 0.0, raiseHeight), 1.0));

  gl_Position = vec4(
    projected_position.xy / projected_position.w + offset * fontScale / u_ViewportSize * 2.0 * u_DevicePixelRatio, 0.0, 1.0);
  v_gamma_scale = projected_position.w;
  setPickingColor(a_PickingColor);

}
`}));function Pm(e=[0,0]){return Array.isArray(e)?e:[e,e]}function Fm(e){return A(e||``)[3]>0}function Im(e,t,n){let r=Math.min(...e.map(e=>Math.min(e.tl.x,e.bl.x))),i=Math.min(...e.map(e=>Math.min(e.tl.y,e.tr.y))),a=Math.max(...e.map(e=>Math.max(e.tr.x,e.br.x))),o=Math.max(...e.map(e=>Math.max(e.bl.y,e.br.y))),s=r-t[0],c=i-t[1],l=a+t[0],u=o+t[1];if(n===`circle`){let e=(s+l)/2,t=(c+u)/2,n=Math.max(l-s,u-c);s=e-n/2,l=e+n/2,c=t-n/2,u=t+n/2}return{tl:{x:s,y:c},tr:{x:l,y:c},br:{x:l,y:u},bl:{x:s,y:u},size:[l-s,u-c]}}function Lm(e){return zm.call(this,e,`background`)}function Rm(e){return zm.call(this,e,`glyph`)}function zm(e,t){let n=this,r=e.id,i=[],a=[],o=(e,t,n)=>{let r=t*4,o=`tex`in e&&e.tex?e.tex:{x:0,y:0,width:0,height:0},s=`quadType`in e&&e.quadType>0?[[0,0],[1,0],[1,1],[0,1]]:[[0,0],[0,0],[0,0],[0,0]],c=`size`in e?e.size:[0,0],l=`quadType`in e?e.quadType:0;i.push(...n,o.x,o.y+o.height,e.tl.x,e.tl.y,l,s[0][0],s[0][1],c[0],c[1],...n,o.x+o.width,o.y+o.height,e.tr.x,e.tr.y,l,s[1][0],s[1][1],c[0],c[1],...n,o.x+o.width,o.y,e.br.x,e.br.y,l,s[2][0],s[2][1],c[0],c[1],...n,o.x,o.y,e.bl.x,e.bl.y,l,s[3][0],s[3][1],c[0],c[1]),a.push(r,r+1,r+2,r+2,r+3,r)};if(!n.glyphInfoMap||!n.glyphInfoMap[r])return{vertices:[],indices:[],size:12};let s=n.glyphInfoMap[r],c=s.centroid,l=c.length===2?[c[0],c[1],0]:c,u=0;return t!==`glyph`&&s.backgroundQuad&&(o({...s.backgroundQuad,quadType:1},u,l),u+=1),t!==`background`&&s.glyphQuads.forEach(e=>{o(e,u,l),u+=1}),{vertices:i,indices:a,size:12}}var Bm,Vm,Hm,Um=t((()=>{E(),D(),P(),nm(),km(),jm(),Nm(),{isEqual:Bm}=vt,Vm={rect:0,circle:1,"circle-rect":2},Hm=class extends N{constructor(...e){super(...e),this.glyphInfoMap={},this.currentZoom=-1,this.textureHeight=0,this.textCount=0,this.preTextStyle={},this.mapping=async()=>{this.rawEncodeData=this.layer.getEncodedData(),this.initGlyph(),this.updateTexture(),await this.reBuildModel(),this.layer.renderLayers()}}get attributeLocation(){return Object.assign(super.attributeLocation,{MAX:super.attributeLocation.MAX,SIZE:9,TEXT_OFFSETS:10,UV:11,TEXT_QUAD_TYPE:12,TEXT_BACKGROUND_UV:13,TEXT_BACKGROUND_SIZE:14})}getUninforms(){let e=this.getCommonUniformsInfo(),t=this.getUniformsBufferInfo(this.getStyleAttribute());return this.updateStyleUnifoms(),{...e.uniformsOption,...t.uniformsOption,u_sdf_map:this.textures[0]}}getCommonUniformsInfo(){let{stroke:e=`#fff`,strokeOpacity:t=1,strokeWidth:n=0,backgroundColor:r=`rgba(0, 0, 0, 0)`,backgroundRadius:i=0,backgroundShape:a=`rect`,halo:o=.5,gamma:s=2,raisingHeight:c=0}=this.layer.getLayerConfig(),l=this.getFontServiceMapping(),u=this.getFontServiceCanvas();l&&Object.keys(l).length!==this.textCount&&u&&(this.updateTexture(),this.textCount=Object.keys(l).length),this.preTextStyle=this.getTextStyle();let d=A(e),f=A(r),p={u_stroke_color:[d[0],d[1],d[2],d[3]*t],u_background_color:f,u_sdf_map_size:[u?.width||1,u?.height||1],u_raisingHeight:Number(c),u_stroke_width:n,u_background_radius:i,u_background_shape:Vm[a]??Vm.rect,u_gamma_scale:s,u_halo_blur:o};return this.getUniformsBufferInfo(p)}async initModels(){return this.bindEvent(),this.extent=this.textExtent(),this.rawEncodeData=this.layer.getEncodedData(),this.preTextStyle=this.getTextStyle(),this.initUniformsBuffer(),this.buildModels()}async buildModels(){let{textAllowOverlap:e=!1,backgroundColor:t}=this.layer.getLayerConfig();this.initGlyph(),this.updateTexture(),e||this.filterGlyphs();let n=await this.layer.buildLayerModel({moduleName:`pointText`,vertexShader:Mm,fragmentShader:Am,defines:this.getDefines(),inject:this.getInject(),triangulation:Rm.bind(this),depth:{enable:!1}});return Fm(t)?[await this.layer.buildLayerModel({moduleName:`pointText`,vertexShader:Mm,fragmentShader:Am,defines:this.getDefines(),inject:this.getInject(),triangulation:Lm.bind(this),depth:{enable:!1}}),n]:[n]}async needUpdate(){let{textAllowOverlap:e=!1,textAnchor:t=`center`,textOffset:n,padding:r,backgroundColor:i,backgroundPadding:a,backgroundShape:o,fontFamily:s,fontWeight:c}=this.getTextStyle();if(!Bm(r,this.preTextStyle.padding)||i!==this.preTextStyle.backgroundColor||!Bm(a,this.preTextStyle.backgroundPadding)||o!==this.preTextStyle.backgroundShape||!Bm(n,this.preTextStyle.textOffset)||!Bm(t,this.preTextStyle.textAnchor)||!Bm(s,this.preTextStyle.fontFamily)||!Bm(c,this.preTextStyle.fontWeight))return await this.mapping(),!0;if(e)return!1;let l=this.mapService.getZoom(),u=this.mapService.getBounds(),d=$e(this.extent,u);return Math.abs(this.currentZoom-l)>.5||!d||e!==this.preTextStyle.textAllowOverlap?(await this.reBuildModel(),!0):!1}clearModels(){this.texture?.destroy(),this.layer.off(`remapping`,this.mapping)}registerBuiltinAttributes(){this.registerPosition64LowAttribute(),this.styleAttributeService.registerStyleAttribute({name:`textOffsets`,type:k.Attribute,descriptor:{shaderLocation:this.attributeLocation.TEXT_OFFSETS,name:`a_textOffsets`,buffer:{usage:m.STATIC_DRAW,data:[],type:m.FLOAT},size:2,update:(e,t,n)=>[n[5],n[6]]}}),this.styleAttributeService.registerStyleAttribute({name:`textUv`,type:k.Attribute,descriptor:{name:`a_tex`,shaderLocation:this.attributeLocation.UV,buffer:{usage:m.DYNAMIC_DRAW,data:[],type:m.FLOAT},size:2,update:(e,t,n)=>[n[3],n[4]]}}),this.styleAttributeService.registerStyleAttribute({name:`textQuadType`,type:k.Attribute,descriptor:{name:`a_textQuadType`,shaderLocation:this.attributeLocation.TEXT_QUAD_TYPE,buffer:{usage:m.DYNAMIC_DRAW,data:[],type:m.FLOAT},size:1,update:(e,t,n)=>[n[7]]}}),this.styleAttributeService.registerStyleAttribute({name:`textBackgroundUv`,type:k.Attribute,descriptor:{name:`a_backgroundUV`,shaderLocation:this.attributeLocation.TEXT_BACKGROUND_UV,buffer:{usage:m.DYNAMIC_DRAW,data:[],type:m.FLOAT},size:2,update:(e,t,n)=>[n[8],n[9]]}}),this.styleAttributeService.registerStyleAttribute({name:`textBackgroundSize`,type:k.Attribute,descriptor:{name:`a_backgroundSize`,shaderLocation:this.attributeLocation.TEXT_BACKGROUND_SIZE,buffer:{usage:m.DYNAMIC_DRAW,data:[],type:m.FLOAT},size:2,update:(e,t,n)=>[n[10],n[11]]}}),this.styleAttributeService.registerStyleAttribute({name:`size`,type:k.Attribute,descriptor:{name:`a_Size`,shaderLocation:this.attributeLocation.SIZE,buffer:{usage:m.DYNAMIC_DRAW,data:[],type:m.FLOAT},size:1,update:e=>{let{size:t=12}=e;return Array.isArray(t)?[t[0]]:[t]}}})}bindEvent(){this.layer.isTileLayer||this.layer.on(`remapping`,this.mapping)}textExtent(){let e=this.mapService.getBounds();return Ce(e,.5)}initTextFont(){let{fontWeight:e,fontFamily:t}=this.getTextStyle(),n=this.rawEncodeData,r=[];n.forEach(e=>{let{shape:t=``}=e;t=t.toString();for(let e of t)r.indexOf(e)===-1&&r.push(e)}),this.fontService.setFontOptions({characterSet:r,fontWeight:e,fontFamily:t,iconfont:!1})}initIconFontTex(){let{fontWeight:e,fontFamily:t}=this.getTextStyle(),n=this.rawEncodeData,r=[];n.forEach(e=>{let{shape:t=``}=e;t=`${t}`,r.indexOf(t)===-1&&r.push(t)}),this.fontService.setFontOptions({characterSet:r,fontWeight:e,fontFamily:t,iconfont:!0})}getTextStyle(){let{fontWeight:e=`400`,fontFamily:t=`sans-serif`,textAllowOverlap:n=!1,padding:r=[0,0],textAnchor:i=`center`,textOffset:a=[0,0],backgroundColor:o=`rgba(0, 0, 0, 0)`,backgroundPadding:s=[0,0],backgroundRadius:c=0,backgroundShape:l=`rect`,opacity:u=1,strokeOpacity:d=1,strokeWidth:f=0,stroke:p=`#000`}=this.layer.getLayerConfig();return{fontWeight:e,fontFamily:t,textAllowOverlap:n,padding:r,backgroundColor:o,backgroundPadding:Pm(s),backgroundRadius:c,backgroundShape:l,textAnchor:i,textOffset:a,opacity:u,strokeOpacity:d,strokeWidth:f,stroke:p}}generateGlyphLayout(e){let t=this.getFontServiceMapping(),{spacing:n=2,textAnchor:r=`center`,textOffset:i,backgroundColor:a,backgroundPadding:o=[0,0],backgroundShape:s=`rect`}=this.layer.getLayerConfig(),c=this.rawEncodeData;this.glyphInfo=c.map(c=>{let{shape:l=``,id:u,size:d=1}=c,f=c.textOffset?c.textOffset:i||[0,0],p=c.textAnchor?c.textAnchor:r||`center`,m=Dm(l.toString(),t,d,p,`left`,n,f,e),h=Om(m,f,!1),g=Fm(a)?Im(h,Pm(o),s):void 0;return c.shaping=m,c.glyphQuads=h,c.centroid=rt(c.coordinates),this.glyphInfoMap[u]={shaping:m,glyphQuads:h,backgroundQuad:g,centroid:rt(c.coordinates)},c})}getFontServiceMapping(){let{fontWeight:e=`400`,fontFamily:t=`sans-serif`}=this.layer.getLayerConfig();return this.fontService.getMappingByKey(`${t}_${e}`)}getFontServiceCanvas(){let{fontWeight:e=`400`,fontFamily:t=`sans-serif`}=this.layer.getLayerConfig();return this.fontService.getCanvasByKey(`${t}_${e}`)}filterGlyphs(){let{padding:e=[0,0],backgroundColor:t,backgroundPadding:n=[0,0],textAllowOverlap:r=!1}=this.layer.getLayerConfig();if(r)return;let i=Pm(n),a=Fm(t)?i:[0,0];this.glyphInfoMap={},this.currentZoom=this.mapService.getZoom(),this.extent=this.textExtent();let{width:o,height:s}=this.rendererService.getViewportSize(),c=new tm(o,s);this.glyphInfo.filter(t=>{let{shaping:n,id:r=0}=t,i=t.centroid,o=t.size/16,s=this.mapService.lngLatToContainer(i),{box:l}=c.placeCollisionBox({x1:n.left*o-e[0]-a[0],x2:n.right*o+e[0]+a[0],y1:n.top*o-e[1]-a[1],y2:n.bottom*o+e[1]+a[1],anchorPointX:s.x,anchorPointY:s.y});return l&&l.length?(c.insertCollisionBox(l,r),!0):!1}).forEach(e=>{this.glyphInfoMap[e.id]=e})}initGlyph(){let{iconfont:e=!1}=this.layer.getLayerConfig();e?this.initIconFontTex():this.initTextFont(),this.generateGlyphLayout(e)}updateTexture(){let{createTexture2D:e}=this.rendererService,t=this.getFontServiceCanvas();this.textureHeight=t.height,this.texture&&this.texture.destroy(),this.texture=e({data:t,mag:m.LINEAR,min:m.LINEAR,width:t.width,height:t.height}),this.textures=[this.texture]}async reBuildModel(){let{backgroundColor:e}=this.layer.getLayerConfig();this.rawEncodeData=this.layer.getEncodedData(),this.filterGlyphs();let t=await this.layer.buildLayerModel({moduleName:`pointText`,vertexShader:Mm,fragmentShader:Am,triangulation:Rm.bind(this),defines:this.getDefines(),inject:this.getInject(),depth:{enable:!1}});if(!Fm(e)){this.layer.models=[t];return}let n=await this.layer.buildLayerModel({moduleName:`pointText`,vertexShader:Mm,fragmentShader:Am,triangulation:Lm.bind(this),defines:this.getDefines(),inject:this.getInject(),depth:{enable:!1}});this.layer.models=[n,t]}}})),Wm,Gm=t((()=>{xp(),Op(),Pp(),Bp(),Kp(),Qp(),cm(),hm(),xm(),Um(),Wm={fillImage:Zp,fill:Gp,radar:bm,image:sm,normal:mm,simplePoint:bp,extrude:zp,text:Hm,earthFill:Np,earthExtrude:Dp}})),Km,qm=t((()=>{$c(),Gm(),Km=class extends Qc{constructor(e={}){super(e),this.type=`PointLayer`,this.defaultSourceConfig={data:[],options:{parser:{type:`json`,x:`lng`,y:`lat`}}},this.setEncodeStyles(`shader`,[`stroke`,`offsets`,`opacity`,`rotation`,`anchor`]),this.setEncodeStyles(`data`,[`textOffset`,`textAnchor`])}async buildModels(){let e=this.getModelType();this.layerModel&&this.layerModel.clearModels(),this.layerModel=new Wm[e](this),await this.initLayerModels()}async rebuildModels(){await this.buildModels()}style(e){return super.style(e),`allowOverlap`in e&&this.reRender(),this}getModelTypeWillEmptyData(){if(this.shapeOption){let{field:e,values:t}=this.shapeOption,{shape2d:n}=this.getLayerConfig(),r=this.iconService.getIconMap();if(e&&n?.indexOf(e)!==-1)return`fill`;if(t===`text`)return`text`;if(t&&t instanceof Array){for(let e of t)if(typeof e==`string`&&r.hasOwnProperty(e))return`image`}}return`normal`}getDefaultConfig(){return{fillImage:{},normal:{blend:`additive`},radar:{},simplePoint:{},fill:{blend:`normal`},extrude:{},image:{},text:{blend:`normal`},tile:{},tileText:{},earthFill:{},earthExtrude:{}}[this.getModelType()]}getModelType(){let e=this.getEncodedData(),{shape2d:t,shape3d:n,billboard:r=!0}=this.getLayerConfig(),i=this.iconService.getIconMap(),a=e.find(e=>e.hasOwnProperty(`shape`));if(a){let e=a.shape;return e===`dot`?`normal`:e===`simple`?`simplePoint`:e===`radar`?`radar`:this.layerType===`fillImage`||r===!1?`fillImage`:t?.indexOf(e)===-1?n?.indexOf(e)===-1?i.hasOwnProperty(e)?`image`:`text`:this.mapService.version===`GLOBEL`?`earthExtrude`:`extrude`:this.mapService.version===`GLOBEL`?`earthFill`:`fill`}return this.getModelTypeWillEmptyData()}}}));async function Jm(e){if(window.createImageBitmap){let t=await fetch(e);return await createImageBitmap(await t.blob())}{let t=new window.Image;return new Promise(n=>{t.onload=()=>n(t),t.src=e,t.crossOrigin=`Anonymous`})}}var Ym=t((()=>{})),Xm,Zm=t((()=>{Xm=`layout(std140) uniform commonUniforms {
  vec4 u_sourceColor;
  vec4 u_targetColor;
  float u_linearColor;
  float u_topsurface;
  float u_sidesurface;
  float u_heightfixed; // 默认不固定
  float u_raisingHeight;
};

in vec4 v_Color;
#pragma include "scene_uniforms"
#pragma include "picking"
out vec4 outputColor;
void main() {
  // top face
  if (u_topsurface < 1.0) {
    discard;
  }

  outputColor = v_Color;

  outputColor = filterColor(outputColor);
}
`})),Qm,$m=t((()=>{Qm=`layout(std140) uniform commonUniforms {
  vec4 u_sourceColor;
  vec4 u_targetColor;
  float u_linearColor;
  float u_topsurface;
  float u_sidesurface;
  float u_heightfixed; // 默认不固定
  float u_raisingHeight;
};

in vec4 v_Color;
in vec3 v_uvs;
in vec2 v_texture_data;
out vec4 outputColor;

#pragma include "scene_uniforms"
#pragma include "picking"

void main() {
  float isSide = v_texture_data.x;
  float sidey = v_uvs[2];
  float lightWeight = v_texture_data.y;

  // Tip: 部分机型 GPU 计算精度兼容
  if (isSide < 0.999) {
    // side face
    if (u_sidesurface < 1.0) {
      discard;
    }

    if (u_linearColor == 1.0) {
      // side use linear
      vec4 linearColor = mix(u_targetColor, u_sourceColor, sidey);
      linearColor.rgb *= lightWeight;
      outputColor = linearColor;
    } else {
      // side notuse linear
      outputColor = v_Color;
    }
  } else {
    // top face
    if (u_topsurface < 1.0) {
      discard;
    }
    outputColor = v_Color;
  }

  outputColor = filterColorAlpha(outputColor, lightWeight);
}
`})),eh,th=t((()=>{eh=`layout(location = ATTRIBUTE_LOCATION_POSITION) in vec3 a_Position;
layout(location = ATTRIBUTE_LOCATION_POSITION_64LOW) in vec2 a_Position64Low;
layout(location = ATTRIBUTE_LOCATION_COLOR) in vec4 a_Color;
layout(location = ATTRIBUTE_LOCATION_SIZE) in float a_Size;
layout(location = ATTRIBUTE_LOCATION_NORMAL) in vec3 a_Normal;
layout(location = ATTRIBUTE_LOCATION_UV) in vec3 a_uvs;

layout(std140) uniform commonUniforms {
  vec4 u_sourceColor;
  vec4 u_targetColor;
  float u_linearColor;
  float u_topsurface;
  float u_sidesurface;
  float u_heightfixed; // 默认不固定
  float u_raisingHeight;
};

out vec4 v_Color;
out vec3 v_uvs;
out vec2 v_texture_data;

#pragma include "projection"
#pragma include "light"
#pragma include "picking"

void main() {
  v_uvs = a_uvs;
  // cal style mapping - 数据纹理映射部分的计算
  vec4 pos = vec4(a_Position.xy, a_Position.z * a_Size, 1.0);
  vec4 project_pos = project_position(pos, a_Position64Low);

  if (u_heightfixed > 0.0) {
    // 判断几何体是否固定高度
    project_pos.z = a_Position.z * a_Size;
    project_pos.z += u_raisingHeight;
    if (
      u_CoordinateSystem == COORDINATE_SYSTEM_LNGLAT ||
      u_CoordinateSystem == COORDINATE_SYSTEM_LNGLAT_OFFSET
    ) {
      float mapboxZoomScale = 4.0 / pow(2.0, 21.0 - u_Zoom);
      project_pos.z *= mapboxZoomScale;
      project_pos.z += u_raisingHeight * mapboxZoomScale;
    }
  }

  gl_Position = project_common_position_to_clipspace(vec4(project_pos.xyz, 1.0));
  float lightWeight = calc_lighting(project_pos);
  v_texture_data = vec2(a_Position.z, lightWeight);

  v_Color = vec4(a_Color.rgb * lightWeight, a_Color.w * opacity);

  setPickingColor(a_PickingColor);
}
`})),nh,rh=t((()=>{nh=`layout(location = ATTRIBUTE_LOCATION_POSITION) in vec3 a_Position;
layout(location = ATTRIBUTE_LOCATION_POSITION_64LOW) in vec2 a_Position64Low;
layout(location = ATTRIBUTE_LOCATION_COLOR) in vec4 a_Color;
layout(location = ATTRIBUTE_LOCATION_SIZE) in float a_Size;
layout(location = ATTRIBUTE_LOCATION_NORMAL) in vec3 a_Normal;
layout(location = ATTRIBUTE_LOCATION_UV) in vec3 a_uvs;

layout(std140) uniform commonUniforms {
  vec4 u_sourceColor;
  vec4 u_targetColor;
  float u_linearColor;
  float u_topsurface;
  float u_sidesurface;
  float u_heightfixed; // 默认不固定
  float u_raisingHeight;
};

out vec4 v_Color;

#pragma include "projection"
#pragma include "light"
#pragma include "picking"

void main() {
  float isSide = a_Position.z;
  float topU = a_uvs[0];
  float topV = 1.0 - a_uvs[1];
  float sidey = a_uvs[2];

  vec4 pos = vec4(a_Position.xy, a_Position.z * a_Size, 1.0);

  vec4 project_pos = project_position(pos, a_Position64Low);
  float lightWeight = calc_lighting(project_pos);

  if (u_heightfixed > 0.0) {
    // 判断几何体是否固定高度
    project_pos.z = a_Position.z * a_Size;
    project_pos.z += u_raisingHeight;

    if (
      u_CoordinateSystem == COORDINATE_SYSTEM_LNGLAT ||
      u_CoordinateSystem == COORDINATE_SYSTEM_LNGLAT_OFFSET
    ) {
      float mapboxZoomScale = 4.0 / pow(2.0, 21.0 - u_Zoom);
      project_pos.z *= mapboxZoomScale;
      project_pos.z += u_raisingHeight * mapboxZoomScale;
    }
  }

 gl_Position = project_common_position_to_clipspace(vec4(project_pos.xyz, 1.0));

  // Tip: 部分机型 GPU 计算精度兼容
  if (isSide < 0.999) {
    // side face
    // if(u_sidesurface < 1.0) {
    //   discard;
    // }

    if (u_linearColor == 1.0) {
      vec4 linearColor = mix(u_targetColor, u_sourceColor, sidey);
      linearColor.rgb *= lightWeight;
      v_Color = linearColor;
    } else {
      v_Color = a_Color;
    }

  } else {
    v_Color = a_Color;
  }

  v_Color = vec4(v_Color.rgb * lightWeight, v_Color.w * opacity);

  setPickingColor(a_PickingColor);
}
`})),ih,ah=t((()=>{ih=`uniform sampler2D u_texture;

layout(std140) uniform commonUniforms {
  vec4 u_sourceColor;
  vec4 u_targetColor;
  float u_linearColor;
  float u_topsurface;
  float u_sidesurface;
  float u_heightfixed; // 默认不固定
  float u_raisingHeight;
};

in vec4 v_Color;
in vec3 v_uvs;
in vec2 v_texture_data;

#pragma include "scene_uniforms"
#pragma include "picking"

out vec4 outputColor;

void main() {
  float opacity = u_opacity;
  float isSide = v_texture_data.x;
  float lightWeight = v_texture_data.y;
  float topU = v_uvs[0];
  float topV = 1.0 - v_uvs[1];
  float sidey = v_uvs[2];

  outputColor = texture(SAMPLER_2D(u_texture), vec2(topU, topV));
  // Tip: 部分机型 GPU 计算精度兼容
  if (isSide < 0.999) {
    // 是否是边缘
    // side face
    if (u_sidesurface < 1.0) {
      discard;
    }

    if (u_linearColor == 1.0) {
      vec4 linearColor = mix(u_targetColor, u_sourceColor, sidey);
      linearColor.rgb *= lightWeight;
      outputColor = linearColor;
    } else {
      outputColor = v_Color;
    }
  } else {
    // top face
    if (u_topsurface < 1.0) {
      discard;
    }
  }

  outputColor.a *= opacity;
  outputColor = filterColor(outputColor);
}
`})),oh,sh=t((()=>{oh=`layout(location = ATTRIBUTE_LOCATION_POSITION) in vec3 a_Position;
layout(location = ATTRIBUTE_LOCATION_POSITION_64LOW) in vec2 a_Position64Low;
layout(location = ATTRIBUTE_LOCATION_COLOR) in vec4 a_Color;
layout(location = ATTRIBUTE_LOCATION_SIZE) in float a_Size;
layout(location = ATTRIBUTE_LOCATION_NORMAL) in vec3 a_Normal;
layout(location = ATTRIBUTE_LOCATION_UV) in vec3 a_uvs;

layout(std140) uniform commonUniforms {
  vec4 u_sourceColor;
  vec4 u_targetColor;
  float u_linearColor;
  float u_topsurface;
  float u_sidesurface;
  float u_heightfixed; // 默认不固定
  float u_raisingHeight;
};

out vec4 v_Color;
out vec3 v_uvs;
out vec2 v_texture_data;

#pragma include "projection"
#pragma include "light"
#pragma include "picking"

void main() {
  vec4 pos = vec4(a_Position.xy, a_Position.z * a_Size, 1.0);
  vec4 project_pos = project_position(pos, a_Position64Low);
  float lightWeight = calc_lighting(project_pos);
  v_uvs = a_uvs;
  v_Color = a_Color;
  v_Color.a *= opacity;

  v_texture_data = vec2(a_Position.z, lightWeight);

  if (u_heightfixed > 0.0) {
    // 判断几何体是否固定高度
    project_pos.z = a_Position.z * a_Size;
    project_pos.z += u_raisingHeight;

    if (
      u_CoordinateSystem == COORDINATE_SYSTEM_LNGLAT ||
      u_CoordinateSystem == COORDINATE_SYSTEM_LNGLAT_OFFSET
    ) {
      float mapboxZoomScale = 4.0 / pow(2.0, 21.0 - u_Zoom);
      project_pos.z *= mapboxZoomScale;
      project_pos.z += u_raisingHeight * mapboxZoomScale;
    }
  }

  gl_Position = project_common_position_to_clipspace(vec4(project_pos.xyz, 1.0));

  setPickingColor(a_PickingColor);
}
`})),ch,lh=t((()=>{E(),D(),P(),F(),Ym(),Zm(),$m(),th(),rh(),ah(),sh(),ch=class extends N{get attributeLocation(){return Object.assign(super.attributeLocation,{MAX:super.attributeLocation.MAX,SIZE:9,NORMAL:10,UV:11})}getUninforms(){let e=this.getCommonUniformsInfo(),t=this.getUniformsBufferInfo(this.getStyleAttribute());return this.updateStyleUnifoms(),{...e.uniformsOption,...t.uniformsOption}}getCommonUniformsInfo(){let{mapTexture:e,heightfixed:t=!1,raisingHeight:n=0,topsurface:r=!0,sidesurface:i=!0,sourceColor:a,targetColor:o}=this.layer.getLayerConfig(),s=0,c=[1,1,1,1],l=[1,1,1,1];a&&o&&(c=A(a),l=A(o),s=1);let u={u_sourceColor:c,u_targetColor:l,u_linearColor:s,u_topsurface:Number(r),u_sidesurface:Number(i),u_heightfixed:Number(t),u_raisingHeight:Number(n)};return e&&this.texture&&(u.u_texture=this.texture,this.textures=[this.texture]),this.getUniformsBufferInfo(u)}async initModels(){return await this.loadTexture(),this.buildModels()}async buildModels(){let{frag:e,vert:t,type:n}=this.getShaders();return this.initUniformsBuffer(),[await this.layer.buildLayerModel({moduleName:n,vertexShader:t,fragmentShader:e,depth:{enable:!0},defines:this.getDefines(),inject:this.getInject(),triangulation:hu})]}getShaders(){let{pickLight:e,mapTexture:t}=this.layer.getLayerConfig();return t?{frag:ih,vert:oh,type:`polygonExtrudeTexture`}:e?{frag:Qm,vert:eh,type:`polygonExtrudePickLight`}:{frag:Xm,vert:nh,type:`polygonExtrude`}}clearModels(){this.texture?.destroy(),this.textures=[]}registerBuiltinAttributes(){this.registerPosition64LowAttribute(),this.styleAttributeService.registerStyleAttribute({name:`uvs`,type:k.Attribute,descriptor:{name:`a_uvs`,shaderLocation:this.attributeLocation.UV,buffer:{usage:m.STATIC_DRAW,data:[],type:m.FLOAT},size:3,update:(e,t,n)=>{let r=this.layer.getOriginalExtent(),i=this.layer.getRelativeOrigin(),a=r[0]!==0||r[2]!==0,o,s,c,l,u,d;a&&i?(o=n[0]+i[0],s=n[1]+i[1],[c,l,u,d]=r):(o=n[0],s=n[1],[c,l,u,d]=this.layer.getSource().extent);let f=u-c,p=d-l;return[(o-c)/f,(s-l)/p,n[4]]}}}),this.styleAttributeService.registerStyleAttribute({name:`normal`,type:k.Attribute,descriptor:{name:`a_Normal`,shaderLocation:this.attributeLocation.NORMAL,buffer:{usage:m.STATIC_DRAW,data:[],type:m.FLOAT},size:3,update:(e,t,n,r,i)=>i}}),this.styleAttributeService.registerStyleAttribute({name:`size`,type:k.Attribute,descriptor:{name:`a_Size`,shaderLocation:this.attributeLocation.SIZE,buffer:{usage:m.DYNAMIC_DRAW,data:[],type:m.FLOAT},size:1,update:e=>{let{size:t=10}=e;return Array.isArray(t)?[t[0]]:[t]}}})}async loadTexture(){let{mapTexture:e}=this.layer.getLayerConfig(),{createTexture2D:t}=this.rendererService;if(this.texture=t({height:1,width:1}),e){let n=await Jm(e);this.texture=t({data:n,width:n.width,height:n.height,wrapS:m.CLAMP_TO_EDGE,wrapT:m.CLAMP_TO_EDGE,min:m.LINEAR,mag:m.LINEAR})}}}})),uh,dh=t((()=>{uh=`in vec4 v_Color;
#pragma include "scene_uniforms"
#pragma include "picking"
out vec4 outputColor;
void main() {
  outputColor = v_Color;
  outputColor = filterColor(outputColor);
}
`})),fh,ph=t((()=>{fh=`layout(location = ATTRIBUTE_LOCATION_POSITION) in vec3 a_Position;
layout(location = ATTRIBUTE_LOCATION_POSITION_64LOW) in vec2 a_Position64Low;
layout(location = ATTRIBUTE_LOCATION_COLOR) in vec4 a_Color;
layout(location = ATTRIBUTE_LOCATION_SIZE) in float a_Size;
layout(location = ATTRIBUTE_LOCATION_NORMAL) in vec3 a_Normal;

out vec4 v_Color;

#pragma include "projection"
#pragma include "light"
#pragma include "picking"

void main() {
  vec4 pos = vec4(a_Position.xy, a_Position.z * a_Size + (1.0 - a_Position.z) * extrusionBase, 1.0);

  vec4 project_pos = project_position(pos, a_Position64Low);
  float lightWeight = calc_lighting(project_pos);
  v_Color = a_Color;
  v_Color = vec4(v_Color.rgb * lightWeight, v_Color.w * opacity);

  gl_Position = project_common_position_to_clipspace(vec4(project_pos.xyz, 1.0));

  setPickingColor(a_PickingColor);
}
`})),mh,hh=t((()=>{E(),P(),F(),dh(),ph(),mh=class extends N{get attributeLocation(){return Object.assign(super.attributeLocation,{MAX:super.attributeLocation.MAX,SIZE:9,NORMAL:10,EXTRUSION_BASE:11})}getUninforms(){let e=this.getCommonUniformsInfo(),t=this.getUniformsBufferInfo(this.getStyleAttribute());return this.updateStyleUnifoms(),{...e.uniformsOption,...t.uniformsOption}}getCommonUniformsInfo(){return this.getUniformsBufferInfo({})}async initModels(){return this.buildModels()}async buildModels(){let{frag:e,vert:t,type:n}=this.getShaders();return this.initUniformsBuffer(),[await this.layer.buildLayerModel({moduleName:n,vertexShader:t,fragmentShader:e,defines:this.getDefines(),inject:this.getInject(),triangulation:hu,depth:{enable:!0}})]}getShaders(){return{frag:uh,vert:fh,type:`polygonExtrude`}}clearModels(){this.texture?.destroy()}registerBuiltinAttributes(){this.registerPosition64LowAttribute(),this.styleAttributeService.registerStyleAttribute({name:`normal`,type:k.Attribute,descriptor:{name:`a_Normal`,shaderLocation:this.attributeLocation.NORMAL,buffer:{usage:m.STATIC_DRAW,data:[],type:m.FLOAT},size:3,update:(e,t,n,r,i)=>i}}),this.styleAttributeService.registerStyleAttribute({name:`size`,type:k.Attribute,descriptor:{name:`a_Size`,shaderLocation:this.attributeLocation.SIZE,buffer:{usage:m.DYNAMIC_DRAW,data:[],type:m.FLOAT},size:1,update:e=>{let{size:t=10}=e;return Array.isArray(t)?[t[0]]:[t]}}}),this.styleAttributeService.registerStyleAttribute({name:`extrusionBase`,type:k.Attribute,descriptor:{name:`a_ExtrusionBase`,shaderLocation:this.attributeLocation.EXTRUSION_BASE,buffer:{usage:m.STATIC_DRAW,data:[],type:m.FLOAT},size:1,update:e=>{let{extrusionBase:t=0}=e;return[t]}}})}}})),gh,_h=t((()=>{gh=`in vec4 v_color;
#pragma include "scene_uniforms"
#pragma include "picking"
out vec4 outputColor;
void main() {
  outputColor = v_color;
  outputColor = filterColor(outputColor);
}
`})),vh,yh=t((()=>{vh=`layout(std140) uniform commonUniforms {
  float u_raisingHeight;
  float u_opacitylinear;
  float u_dir;
};

in vec4 v_color;
in vec3 v_linear;
in vec2 v_pos;
out vec4 outputColor;
#pragma include "scene_uniforms"
#pragma include "picking"

void main() {
  outputColor = v_color;
  if (u_opacitylinear > 0.0) {
    outputColor.a *=
      u_dir == 1.0
        ? 1.0 - length(v_pos - v_linear.xy) / v_linear.z
        : length(v_pos - v_linear.xy) / v_linear.z;
  }
  outputColor = filterColor(outputColor);
}
`})),bh,xh=t((()=>{bh=`layout(location = ATTRIBUTE_LOCATION_POSITION) in vec3 a_Position;
layout(location = ATTRIBUTE_LOCATION_POSITION_64LOW) in vec2 a_Position64Low;
layout(location = ATTRIBUTE_LOCATION_COLOR) in vec4 a_Color;
layout(location = ATTRIBUTE_LOCATION_LINEAR) in vec3 a_linear;

layout(std140) uniform commonUniforms {
  float u_raisingHeight;
  float u_opacitylinear;
  float u_dir;
};

out vec4 v_color;
out vec3 v_linear;
out vec2 v_pos;

#pragma include "projection"
#pragma include "picking"

void main() {
  if (u_opacitylinear > 0.0) {
    v_linear = a_linear;
    v_pos = a_Position.xy;
  }
  v_color = vec4(a_Color.xyz, a_Color.w * opacity);
  vec4 project_pos = project_position(vec4(a_Position, 1.0), a_Position64Low);
  project_pos.z += u_raisingHeight;

  if (u_CoordinateSystem == COORDINATE_SYSTEM_LNGLAT || u_CoordinateSystem == COORDINATE_SYSTEM_LNGLAT_OFFSET) {
    float mapboxZoomScale = 4.0/pow(2.0, 21.0 - u_Zoom);
    project_pos.z *= mapboxZoomScale;
    project_pos.z += u_raisingHeight * mapboxZoomScale;
  }

  gl_Position = project_common_position_to_clipspace(vec4(project_pos.xyz, 1.0));
  setPickingColor(a_PickingColor);
}
`})),Sh,Ch=t((()=>{Sh=`layout(location = ATTRIBUTE_LOCATION_POSITION) in vec3 a_Position;
layout(location = ATTRIBUTE_LOCATION_POSITION_64LOW) in vec2 a_Position64Low;
layout(location = ATTRIBUTE_LOCATION_COLOR) in vec4 a_Color;

layout(std140) uniform commonUniforms {
  float u_raisingHeight;
};

out vec4 v_color;

#pragma include "projection"
#pragma include "picking"

void main() {
  // cal style mapping - 数据纹理映射部分的计算

  v_color = vec4(a_Color.xyz, a_Color.w * opacity);
  vec4 project_pos = project_position(vec4(a_Position, 1.0), a_Position64Low);

  project_pos.z += u_raisingHeight;

  if (
    u_CoordinateSystem == COORDINATE_SYSTEM_LNGLAT ||
    u_CoordinateSystem == COORDINATE_SYSTEM_LNGLAT_OFFSET
  ) {
    float mapboxZoomScale = 4.0 / pow(2.0, 21.0 - u_Zoom);
    project_pos.z *= mapboxZoomScale;
    project_pos.z += u_raisingHeight * mapboxZoomScale;
  }

  gl_Position = project_common_position_to_clipspace(vec4(project_pos.xyz, 1.0));

  setPickingColor(a_PickingColor);
}

`})),wh,Th=t((()=>{E(),P(),F(),_h(),yh(),xh(),Ch(),wh=class extends N{get attributeLocation(){return Object.assign(super.attributeLocation,{MAX:super.attributeLocation.MAX,LINEAR:9})}getUninforms(){let e=this.getCommonUniformsInfo(),t=this.getUniformsBufferInfo(this.getStyleAttribute());return this.updateStyleUnifoms(),{...e.uniformsOption,...t.uniformsOption}}getCommonUniformsInfo(){let{raisingHeight:e=0,opacityLinear:t={enable:!1,dir:`in`}}=this.layer.getLayerConfig(),n={u_raisingHeight:Number(e),u_opacitylinear:Number(t.enable),u_dir:+(t.dir===`in`)};return this.getUniformsBufferInfo(n)}async initModels(){return this.buildModels()}async buildModels(){let{frag:e,vert:t,triangulation:n,type:r}=this.getModelParams();return this.initUniformsBuffer(),this.layer.triangulation=n,[await this.layer.buildLayerModel({moduleName:r,vertexShader:t,fragmentShader:e,defines:this.getDefines(),inject:this.getInject(),triangulation:n,primitive:m.TRIANGLES,depth:{enable:!1}})]}registerBuiltinAttributes(){this.registerPosition64LowAttribute();let{opacityLinear:e={enable:!1,dir:`in`}}=this.layer.getLayerConfig();e.enable&&this.styleAttributeService.registerStyleAttribute({name:`linear`,type:k.Attribute,descriptor:{name:`a_linear`,shaderLocation:this.attributeLocation.LINEAR,buffer:{usage:m.STATIC_DRAW,data:[],type:m.FLOAT},size:3,update:(e,t,n)=>[n[3],n[4],n[5]]}})}getModelParams(){let{opacityLinear:e={enable:!1}}=this.layer.getLayerConfig();return e.enable?{frag:vh,vert:bh,type:`polygonLinear`,triangulation:pu}:{frag:gh,vert:Sh,type:`polygonFill`,triangulation:fu}}}})),Eh,Dh=t((()=>{Eh=`layout(std140) uniform commonUniforms {
  vec4 u_watercolor;
  vec4 u_watercolor2;
  float u_time;
};

in vec2 v_uv;
in float v_opacity;
out vec4 outputColor;

float coast2water_fadedepth = 0.1;
float large_waveheight = 0.75; // change to adjust the "heavy" waves
float large_wavesize = 3.4; // factor to adjust the large wave size
float small_waveheight = 0.6; // change to adjust the small random waves
float small_wavesize = 0.5; // factor to ajust the small wave size
float water_softlight_fact = 15.0; // range [1..200] (should be << smaller than glossy-fact)
float water_glossylight_fact = 120.0; // range [1..200]
float particle_amount = 70.0;

vec3 water_specularcolor = vec3(1.3, 1.3, 0.9); // specular Color (RGB) of the water-highlights
#define light (vec3(-0.0, sin(u_time * 0.5) * 0.5 + 0.35, 2.8)) // position of the sun

uniform sampler2D u_texture1;
uniform sampler2D u_texture2;
uniform sampler2D u_texture3;

float hash(float n) {
  return fract(sin(n) * 43758.5453123);
}

// 2d noise function
float noise1(vec2 x) {
  vec2 p = floor(x);
  vec2 f = smoothstep(0.0, 1.0, fract(x));
  float n = p.x + p.y * 57.0;
  return mix(mix(hash(n + 0.0), hash(n + 1.0), f.x), mix(hash(n + 57.0), hash(n + 58.0), f.x), f.y);
}

float noise(vec2 p) {
  return texture(SAMPLER_2D(u_texture2), p * vec2(1.0 / 256.0)).x;
}

vec4 highness(vec2 p) {
  vec4 t = texture(SAMPLER_2D(u_texture1), fract(p));
  float clipped =
    -2.0 -
    smoothstep(3.0, 10.0, t.a) * 6.9 -
    smoothstep(10.0, 100.0, t.a) * 89.9 -
    smoothstep(0.0, 10000.0, t.a) * 10000.0;
  return clamp(t, 0.0, 3.0) + clamp(t / 3.0 - 1.0, 0.0, 1.0) + clamp(t / 16.0 - 1.0, 0.0, 1.0);
}

float height_map(vec2 p) {
  vec4 height = highness(p);
  /*
    height = -0.5+
        0.5*smoothstep(-100.,0.,-height)+
        2.75*smoothstep(0.,2.,height)+
        1.75*smoothstep(2.,4.,height)+
        2.75*smoothstep(4.,16.,height)+
        1.5*smoothstep(16.,1000.,height);
    */

  mat2 m = mat2(0.9563 * 1.4, -0.2924 * 1.4, 0.2924 * 1.4, 0.9563 * 1.4);
  //p = p*6.;
  float f = 0.6 * noise1(p);
  p = m * p * 1.1 * 6.0;
  f += 0.25 * noise(p);
  p = m * p * 1.32;
  f += 0.1666 * noise(p);
  p = m * p * 1.11;
  f += 0.0834 * noise(p);
  p = m * p * 1.12;
  f += 0.0634 * noise(p);
  p = m * p * 1.13;
  f += 0.0444 * noise(p);
  p = m * p * 1.14;
  f += 0.0274 * noise(p);
  p = m * p * 1.15;
  f += 0.0134 * noise(p);
  p = m * p * 1.16;
  f += 0.0104 * noise(p);
  p = m * p * 1.17;
  f += 0.0084 * noise(p);
  f = 0.25 * f + dot(height, vec4(-0.03125, -0.125, 0.25, 0.25)) * 0.5;
  const float FLAT_LEVEL = 0.92525;
  //f = f*0.25+height*0.75;
  if (f < FLAT_LEVEL) f = f;
  else f = pow((f - FLAT_LEVEL) / (1.0 - FLAT_LEVEL), 2.0) * (1.0 - FLAT_LEVEL) * 2.0 + FLAT_LEVEL; // makes a smooth coast-increase
  return clamp(f, 0.0, 10.0);
}

vec3 plasma_quintic(float x) {
  x = clamp(x, 0.0, 1.0);
  vec4 x1 = vec4(1.0, x, x * x, x * x * x); // 1 x x2 x3
  vec4 x2 = x1 * x1.w * x; // x4 x5 x6 x7
  return vec3(
    dot(x1.xyzw, vec4(+0.063861086, +1.992659096, -1.023901152, -0.490832805)) +
      dot(x2.xy, vec2(+1.308442123, -0.914547012)),
    dot(x1.xyzw, vec4(+0.04971859, -0.791144343, +2.892305078, +0.811726816)) +
      dot(x2.xy, vec2(-4.686502417, +2.717794514)),
    dot(x1.xyzw, vec4(+0.513275779, +1.58025506, -5.164414457, +4.559573646)) +
      dot(x2.xy, vec2(-1.916810682, +0.570638854))
  );
}

vec4 color(vec2 p) {
  vec4 c1 = vec4(1.7, 1.6, 0.9, 1);
  vec4 c2 = vec4(0.2, 0.94, 0.1, 1);
  vec4 c3 = vec4(0.3, 0.2, 0.0, 1);
  vec4 c4 = vec4(0.99, 0.99, 1.6, 1);
  vec4 v = highness(p);
  float los = smoothstep(0.1, 1.1, v.b);
  float his = smoothstep(3.5, 6.5, v.b);
  float ces = smoothstep(1.0, 5.0, v.a);
  vec4 lo = mix(c1, c2, los);
  vec4 hi = mix(c3, c4, his);
  vec4 ce = mix(lo, hi, ces);

  return vec4(plasma_quintic(ces), 1).ragb;
}

vec3 terrain_map(vec2 p) {
  return color(p).rgb * 0.75 +
  0.25 * vec3(0.7, 0.55, 0.4) +
  texture(SAMPLER_2D(u_texture3), fract(p * 5.0)).rgb * 0.5; // test-terrain is simply 'sandstone'
}

const mat2 m = mat2(
   0.72, -1.6 ,
   1.6 ,  0.72
);

float water_map(vec2 p, float height) {
  vec2 p2 = p * large_wavesize;
  vec2 shift1 = 0.001 * vec2(u_time * 160.0 * 2.0, u_time * 120.0 * 2.0);
  vec2 shift2 = 0.001 * vec2(u_time * 190.0 * 2.0, -u_time * 130.0 * 2.0);

  // coarse crossing 'ocean' waves...
  float f = 0.6 * noise(p);
  f += 0.25 * noise(p * m);
  f += 0.1666 * noise(p * m * m);
  float wave =
    sin(p2.x * 0.622 + p2.y * 0.622 + shift2.x * 4.269) * large_waveheight * f * height * height;

  p *= small_wavesize;
  f = 0.0;
  float amp = 1.0,
    s = 0.5;
  for (int i = 0; i < 9; i++) {
    p = m * p * 0.947;
    f -= amp * abs(sin((noise(p + shift1 * s) - 0.5) * 2.0));
    amp = amp * 0.59;
    s *= -1.329;
  }

  return wave + f * small_waveheight;
}

float nautic(vec2 p) {
  p *= 18.0;
  float f = 0.0;
  float amp = 1.0,
    s = 0.5;
  for (int i = 0; i < 3; i++) {
    p = m * p * 1.2;
    f += amp * abs(smoothstep(0.0, 1.0, noise(p + u_time * s)) - 0.5);
    amp = amp * 0.5;
    s *= -1.227;
  }
  return pow(1.0 - f, 5.0);
}

float particles(vec2 p) {
  p *= 200.0;
  float f = 0.0;
  float amp = 1.0,
    s = 1.5;
  for (int i = 0; i < 3; i++) {
    p = m * p * 1.2;
    f += amp * noise(p + u_time * s);
    amp = amp * 0.5;
    s *= -1.227;
  }
  return pow(f * 0.35, 7.0) * particle_amount;
}

float test_shadow(vec2 xy, float height) {
  vec3 r0 = vec3(xy, height);
  vec3 rd = normalize(light - r0);

  float hit = 1.0;
  float t = 0.001;
  for (int j = 1; j < 25; j++) {
    vec3 p = r0 + t * rd;
    float h = height_map(p.xy);
    float height_diff = p.z - h;
    if (height_diff < 0.0) {
      return 0.0;
    }
    t += 0.01 + height_diff * 0.02;
    hit = min(hit, 2.0 * height_diff / t); // soft shaddow
  }
  return hit;
}

vec3 CalcTerrain(vec2 uv, float height) {
  vec3 col = terrain_map(uv);
  vec2 iResolution = vec2(512.0);
  float h1 = height_map(uv - vec2(0.0, 0.5) / iResolution.xy);
  float h2 = height_map(uv + vec2(0.0, 0.5) / iResolution.xy);
  float h3 = height_map(uv - vec2(0.5, 0.0) / iResolution.xy);
  float h4 = height_map(uv + vec2(0.5, 0.0) / iResolution.xy);
  vec3 norm = normalize(vec3(h3 - h4, h1 - h2, 1.0));
  vec3 r0 = vec3(uv, height);
  vec3 rd = normalize(light - r0);
  float grad = dot(norm, rd);
  col *= grad + pow(grad, 8.0);
  float terrainshade = test_shadow(uv, height);
  col = mix(col * 0.25, col, terrainshade);
  return col;
}

void main() {
  vec3 watercolor = u_watercolor.rgb;
  vec3 watercolor2 = u_watercolor2.rgb;
  vec2 uv = v_uv;
  float WATER_LEVEL = 0.84; // Water level (range: 0.0 - 2.0)
  float deepwater_fadedepth = 0.4 + coast2water_fadedepth;
  float height = height_map(uv);
  vec3 col;

  float waveheight = clamp(WATER_LEVEL * 3.0 - 1.5, 0.0, 1.0);
  float level = WATER_LEVEL + 0.2 * water_map(uv * 15.0 + vec2(u_time * 0.1), waveheight);
  if (height > level) {
    col = CalcTerrain(uv, height);
  }
  if (height <= level) {
    vec2 dif = vec2(0.0, 0.01);
    vec2 pos = uv * 15.0 + vec2(u_time * 0.01);
    float h1 = water_map(pos - dif, waveheight);
    float h2 = water_map(pos + dif, waveheight);
    float h3 = water_map(pos - dif.yx, waveheight);
    float h4 = water_map(pos + dif.yx, waveheight);
    vec3 normwater = normalize(vec3(h3 - h4, h1 - h2, 0.125)); // norm-vector of the 'bumpy' water-plane
    uv += normwater.xy * 0.002 * (level - height);

    col = CalcTerrain(uv, height);

    float coastfade = clamp((level - height) / coast2water_fadedepth, 0.0, 1.0);
    float coastfade2 = clamp((level - height) / deepwater_fadedepth, 0.0, 1.0);
    float intensity = col.r * 0.2126 + col.g * 0.7152 + col.b * 0.0722;
    watercolor = mix(watercolor * intensity, watercolor2, smoothstep(0.0, 1.0, coastfade2));

    vec3 r0 = vec3(uv, WATER_LEVEL);
    vec3 rd = normalize(light - r0); // ray-direction to the light from water-position
    float grad = dot(normwater, rd); // dot-product of norm-vector and light-direction
    float specular = pow(grad, water_softlight_fact); // used for soft highlights
    float specular2 = pow(grad, water_glossylight_fact); // used for glossy highlights
    float gradpos = dot(vec3(0.0, 0.0, 1.0), rd);
    float specular1 = smoothstep(0.0, 1.0, pow(gradpos, 5.0)); // used for diffusity (some darker corona around light's specular reflections...)
    float watershade = test_shadow(uv, level);
    watercolor *= 2.2 + watershade;
    watercolor += (0.2 + 0.8 * watershade) * ((grad - 1.0) * 0.5 + specular) * 0.25;
    watercolor /= 1.0 + specular1 * 1.25;
    watercolor += watershade * specular2 * water_specularcolor;
    watercolor +=
      watershade *
      coastfade *
      (1.0 - coastfade2) *
      (vec3(0.5, 0.6, 0.7) * nautic(uv) + vec3(1.0, 1.0, 1.0) * particles(uv));

    col = mix(col, watercolor, coastfade);
  }

  outputColor = vec4(col, v_opacity);
}
`})),Oh,kh=t((()=>{Oh=`layout(location = ATTRIBUTE_LOCATION_POSITION) in vec3 a_Position;
layout(location = ATTRIBUTE_LOCATION_UV) in vec2 a_uv;

layout(std140) uniform commonUniforms {
  vec4 u_watercolor;
  vec4 u_watercolor2;
  float u_time;
};

out vec2 v_uv;
out float v_opacity;

#pragma include "projection"

void main() {
  v_uv = a_uv;
  v_opacity = opacity;
  vec4 project_pos = project_position(vec4(a_Position, 1.0));
  gl_Position = project_common_position_to_clipspace(vec4(project_pos.xyz, 1.0));
}

`})),Ah,jh=t((()=>{E(),D(),P(),F(),Dh(),kh(),Ah=class extends N{get attributeLocation(){return Object.assign(super.attributeLocation,{MAX:super.attributeLocation.MAX,UV:9})}getUninforms(){let e=this.getCommonUniformsInfo(),t=this.getUniformsBufferInfo(this.getStyleAttribute());return this.updateStyleUnifoms(),{...e.uniformsOption,...t.uniformsOption}}getCommonUniformsInfo(){let{watercolor:e=`#6D99A8`,watercolor2:t=`#0F121C`}=this.layer.getLayerConfig(),n={u_watercolor:A(e),u_watercolor2:A(t),u_time:this.layer.getLayerAnimateTime(),u_texture1:this.texture1,u_texture2:this.texture2,u_texture3:this.texture3};return this.textures=[this.texture1,this.texture2,this.texture3],this.getUniformsBufferInfo(n)}getAnimateUniforms(){return{u_time:this.layer.getLayerAnimateTime()}}async initModels(){return this.loadTexture(),this.buildModels()}async buildModels(){return this.initUniformsBuffer(),[await this.layer.buildLayerModel({moduleName:`polygonOcean`,vertexShader:Oh,fragmentShader:Eh,defines:this.getDefines(),inject:this.getInject(),triangulation:fu,primitive:m.TRIANGLES,depth:{enable:!1}})]}clearModels(){this.texture1?.destroy(),this.texture2?.destroy(),this.texture3?.destroy()}registerBuiltinAttributes(){this.styleAttributeService.registerStyleAttribute({name:`oceanUv`,type:k.Attribute,descriptor:{name:`a_uv`,shaderLocation:this.attributeLocation.UV,buffer:{usage:m.STATIC_DRAW,data:[],type:m.FLOAT},size:2,update:(e,t,n)=>{let r=this.layer.getOriginalExtent(),i=this.layer.getRelativeOrigin(),a=r[0]!==0||r[2]!==0,o,s,c,l,u,d;a&&i?(o=n[0]+i[0],s=n[1]+i[1],[c,l,u,d]=r):(o=n[0],s=n[1],[c,l,u,d]=this.layer.getSource().extent);let f=u-c,p=d-l;return[(o-c)/f,(s-l)/p]}}})}loadTexture(){let{createTexture2D:e}=this.rendererService,t={height:0,width:0};this.texture1=e(t),this.texture2=e(t),this.texture3=e(t),n(e=>{this.texture1=r(e[0]),this.texture2=r(e[1]),this.texture3=r(e[2]),this.layerService.reRender()});function n(e){let t=0,n=[];[`https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*EojwT4VzSiYAAAAAAAAAAAAAARQnAQ`,`https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*MJ22QbpuCzIAAAAAAAAAAAAAARQnAQ`,`https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*-z2HSIVDsHIAAAAAAAAAAAAAARQnAQ`].map(r=>{let i=new Image;i.crossOrigin=``,i.src=r,n.push(i),i.onload=()=>{t++,t===3&&e(n)}})}function r(t){return e({data:t,width:t.width,height:t.height,wrapS:m.MIRRORED_REPEAT,wrapT:m.MIRRORED_REPEAT,min:m.LINEAR,mag:m.LINEAR})}}}})),Mh,Nh=t((()=>{Mh=`uniform sampler2D u_texture;
layout(std140) uniform commonUniforms {
  float u_speed;
  float u_time;
};

out vec4 outputColor;

in vec4 v_Color;
in vec2 v_uv;

float rand(vec2 n) {
  return 0.5 + 0.5 * fract(sin(dot(n.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

float water(vec3 p) {
  float t = u_time * u_speed;
  p.z += t * 2.0;
  p.x += t * 2.0;
  vec3 c1 = texture(SAMPLER_2D(u_texture), p.xz / 30.0).xyz;
  p.z += t * 3.0;
  p.x += t * 0.52;
  vec3 c2 = texture(SAMPLER_2D(u_texture), p.xz / 30.0).xyz;
  p.z += t * 4.0;
  p.x += t * 0.8;
  vec3 c3 = texture(SAMPLER_2D(u_texture), p.xz / 30.0).xyz;
  c1 += c2 - c3;
  float z = (c1.x + c1.y + c1.z) / 3.0;
  return p.y + z / 4.0;
}

float map(vec3 p) {
  float d = 100.0;
  d = water(p);
  return d;
}

float intersect(vec3 ro, vec3 rd) {
  float d = 0.0;
  for (int i = 0; i <= 100; i++) {
    float h = map(ro + rd * d);
    if (h < 0.1) return d;
    d += h;
  }
  return 0.0;
}

vec3 norm(vec3 p) {
  float eps = 0.1;
  return normalize(
    vec3(
      map(p + vec3(eps, 0, 0)) - map(p + vec3(-eps, 0, 0)),
      map(p + vec3(0, eps, 0)) - map(p + vec3(0, -eps, 0)),
      map(p + vec3(0, 0, eps)) - map(p + vec3(0, 0, -eps))
    )
  );
}

float calSpc() {
  vec3 l1 = normalize(vec3(1, 1, 1));
  vec3 ro = vec3(-3, 20, -8);
  vec3 rc = vec3(0, 0, 0);
  vec3 ww = normalize(rc - ro);
  vec3 uu = normalize(cross(vec3(0, 1, 0), ww));
  vec3 vv = normalize(cross(rc - ro, uu));
  vec3 rd = normalize(uu * v_uv.x + vv * v_uv.y + ww);
  float d = intersect(ro, rd);
  vec3 p = ro + rd * d;
  vec3 n = norm(p);
  float spc = pow(max(0.0, dot(reflect(l1, n), rd)), 30.0);
  return spc;
}

void main() {
  outputColor = v_Color;
  float spc = calSpc();
  outputColor += spc * 0.4;
}
`})),Ph,Fh=t((()=>{Ph=`layout(location = ATTRIBUTE_LOCATION_POSITION) in vec3 a_Position;
layout(location = ATTRIBUTE_LOCATION_COLOR) in vec4 a_Color;
layout(location = ATTRIBUTE_LOCATION_UV) in vec2 a_uv;

layout(std140) uniform commonUniforms {
  float u_speed;
  float u_time;
};
out vec4 v_Color;
out vec2 v_uv;

#pragma include "projection"

void main() {
  v_uv = a_uv;
  v_Color = a_Color;
  v_Color.a *= opacity;
  vec4 project_pos = project_position(vec4(a_Position, 1.0));

  gl_Position = project_common_position_to_clipspace(vec4(project_pos.xyz, 1.0));
}

`})),Ih,Lh=t((()=>{E(),P(),F(),Nh(),Fh(),Ih=class extends N{get attributeLocation(){return Object.assign(super.attributeLocation,{MAX:super.attributeLocation.MAX,UV:9})}getUninforms(){let e=this.getCommonUniformsInfo(),t=this.getUniformsBufferInfo(this.getStyleAttribute());return this.updateStyleUnifoms(),{...e.uniformsOption,...t.uniformsOption}}getCommonUniformsInfo(){let{speed:e=.5}=this.layer.getLayerConfig(),t={u_speed:e,u_time:this.layer.getLayerAnimateTime(),u_texture:this.texture};return this.textures=[this.texture],this.getUniformsBufferInfo(t)}getAnimateUniforms(){return{u_time:this.layer.getLayerAnimateTime()}}async initModels(){return this.loadTexture(),this.buildModels()}async buildModels(){return this.initUniformsBuffer(),[await this.layer.buildLayerModel({moduleName:`polygonWater`,vertexShader:Ph,fragmentShader:Mh,triangulation:fu,defines:this.getDefines(),inject:this.getInject(),primitive:m.TRIANGLES,depth:{enable:!1},pickingEnabled:!1,diagnosticDerivativeUniformityEnabled:!1})]}clearModels(){this.texture?.destroy()}registerBuiltinAttributes(){this.styleAttributeService.registerStyleAttribute({name:`waterUv`,type:k.Attribute,descriptor:{name:`a_uv`,shaderLocation:this.attributeLocation.UV,buffer:{usage:m.STATIC_DRAW,data:[],type:m.FLOAT},size:2,update:(e,t,n)=>{let r=this.layer.getOriginalExtent(),i=this.layer.getRelativeOrigin(),a=r[0]!==0||r[2]!==0,o,s,c,l,u,d;a&&i?(o=n[0]+i[0],s=n[1]+i[1],[c,l,u,d]=r):(o=n[0],s=n[1],[c,l,u,d]=this.layer.getSource().extent);let f=u-c,p=d-l;return[(o-c)/f,(s-l)/p]}}})}loadTexture(){let{waterTexture:e}=this.layer.getLayerConfig(),{createTexture2D:t}=this.rendererService;this.texture=t({height:1,width:1});let n=new Image;n.crossOrigin=``,e?(console.warn(`L7 recommend：https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*EojwT4VzSiYAAAAAAAAAAAAAARQnAQ`),n.src=e):n.src=`https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*EojwT4VzSiYAAAAAAAAAAAAAARQnAQ`,n.onload=()=>{this.texture=t({data:n,width:n.width,height:n.height,wrapS:m.MIRRORED_REPEAT,wrapT:m.MIRRORED_REPEAT,min:m.LINEAR,mag:m.LINEAR}),this.layerService.reRender()}}}})),Rh,zh=t((()=>{Qf(),Bp(),Kp(),cm(),hm(),Um(),lh(),hh(),Th(),jh(),Lh(),Rh={fill:wh,line:Zf,extrude:ch,text:Hm,point_fill:Gp,point_image:sm,point_normal:mm,point_extrude:zp,water:Ih,ocean:Ah,extrusion:mh}})),Bh,Vh=t((()=>{$c(),zh(),Bh=class extends Qc{constructor(e={}){super(e),this.type=`PolygonLayer`,this.setEncodeStyles(`shader`,[`opacity`,`extrusionBase`,`rotation`,`offsets`,`stroke`])}async buildModels(){let e=this.getModelType();this.layerModel=new Rh[e](this),await this.initLayerModels()}getModelType(){let e=this.shapeOption?.field;return e===`fill`||!e?`fill`:e===`extrude`?`extrude`:e===`extrusion`?`extrusion`:e===`water`?`water`:e===`ocean`?`ocean`:e===`line`?`line`:this.getPointModelType()}getPointModelType(){let e=this.getEncodedData(),{shape2d:t,shape3d:n}=this.getLayerConfig(),r=this.iconService.getIconMap(),i=e.find(e=>e.hasOwnProperty(`shape`));if(i){let e=i.shape;return e===`dot`?`point_normal`:t?.indexOf(e)===-1?n?.indexOf(e)===-1?r.hasOwnProperty(e)?`point_image`:`text`:`point_extrude`:`point_fill`}return`fill`}}})),Hh,Uh=t((()=>{Hh=`layout(std140) uniform commonUniforms {
  vec2 u_domain;
  float u_opacity;
  float u_noDataValue;
  float u_clampLow;
  float u_clampHigh;
};

uniform sampler2D u_rasterTexture;
uniform sampler2D u_colorTexture;

in vec2 v_texCoord;

bool isnan_emu(float x) {
  return x > 0.0 || x < 0.0
    ? x != x
    : x != 0.0;
}

out vec4 outputColor;

void main() {
  // Can use any component here since u_rasterTexture is under luminance format.
  float value = texture(SAMPLER_2D(u_rasterTexture), vec2(v_texCoord.x, v_texCoord.y)).r;
  if (value == u_noDataValue || isnan_emu(value)) {
    discard;
  } else if (u_clampLow < 0.5 && value < u_domain[0] || u_clampHigh < 0.5 && value > u_domain[1]) {
    discard;
  } else {
    float normalisedValue = (value - u_domain[0]) / (u_domain[1] - u_domain[0]);
    vec4 color = texture(SAMPLER_2D(u_colorTexture), vec2(normalisedValue, 0));

    outputColor = color;
    outputColor.a = outputColor.a * u_opacity;
    if (outputColor.a < 0.01) discard;
  }
}
`})),Wh,Gh=t((()=>{Wh=`layout(location = ATTRIBUTE_LOCATION_POSITION) in vec3 a_Position;
layout(location = ATTRIBUTE_LOCATION_POSITION_64LOW) in vec2 a_Position64Low;
layout(location = ATTRIBUTE_LOCATION_UV) in vec2 a_Uv;

layout(std140) uniform commonUniforms {
  vec2 u_domain;
  float u_opacity;
  float u_noDataValue;
  float u_clampLow;
  float u_clampHigh;
};

out vec2 v_texCoord;

#pragma include "projection"

void main() {
  v_texCoord = a_Uv;
  vec4 project_pos = project_position(vec4(a_Position, 1.0), a_Position64Low);
  gl_Position = project_common_position_to_clipspace(vec4(project_pos.xy, 0.0, 1.0));
}
`})),Kh,qh=t((()=>{E(),D(),P(),F(),Uh(),Gh(),Kh=class extends N{get attributeLocation(){return Object.assign(super.attributeLocation,{MAX:super.attributeLocation.MAX,UV:9})}getUninforms(){let e=this.getCommonUniformsInfo(),t=this.getUniformsBufferInfo(this.getStyleAttribute());return this.updateStyleUnifoms(),{...e.uniformsOption,...t.uniformsOption}}getCommonUniformsInfo(){let{opacity:e=1,clampLow:t=!0,clampHigh:n=!0,noDataValue:r=-9999999,domain:i,rampColors:a}=this.layer.getLayerConfig(),o=i||v(a);this.colorTexture=this.layer.textureService.getColorTexture(a,o);let s={u_domain:o,u_opacity:e||1,u_noDataValue:r,u_clampLow:+!!t,u_clampHigh:(n===void 0?t:n)?1:0,u_rasterTexture:this.texture,u_colorTexture:this.colorTexture};return this.textures=[this.texture,this.colorTexture],this.getUniformsBufferInfo(s)}async getRasterData(e){if(Array.isArray(e.data))return{data:e.data,width:e.width,height:e.height};{let{rasterData:t,width:n,height:r}=await e.data;return{data:Array.from(t),width:n,height:r}}}async initModels(){return this.buildModels()}async buildModels(){this.initUniformsBuffer();let e=this.layer.getSource(),{createTexture2D:t,queryVerdorInfo:n}=this.rendererService,r=e.data.dataArray[0],{data:i,width:a,height:o}=await this.getRasterData(r);return this.texture=t({data:new Float32Array(i),width:a,height:o,format:n()===`WebGL1`?m.LUMINANCE:m.RED,type:m.FLOAT,alignment:1}),[await this.layer.buildLayerModel({moduleName:`rasterImageData`,vertexShader:Wh,fragmentShader:Hh,defines:this.getDefines(),triangulation:_u,primitive:m.TRIANGLES,depth:{enable:!1},pickingEnabled:!1})]}clearModels(){this.texture?.destroy(),this.colorTexture?.destroy()}registerBuiltinAttributes(){this.registerPosition64LowAttribute(),this.styleAttributeService.registerStyleAttribute({name:`uv`,type:k.Attribute,descriptor:{shaderLocation:this.attributeLocation.UV,name:`a_Uv`,buffer:{usage:m.DYNAMIC_DRAW,data:[],type:m.FLOAT},size:2,update:(e,t,n)=>[n[3],n[4]]}})}}})),Jh,Yh=t((()=>{Jh=`uniform sampler2D u_texture;
layout(std140) uniform commonUniforms {
  vec2 u_rminmax;
  vec2 u_gminmax;
  vec2 u_bminmax;
  float u_opacity;
  float u_noDataValue;
};

in vec2 v_texCoord;

out vec4 outputColor;

void main() {
  vec3 rgb = texture(SAMPLER_2D(u_texture), vec2(v_texCoord.x, v_texCoord.y)).rgb;

  if (rgb == vec3(u_noDataValue)) {
    outputColor = vec4(0.0, 0, 0, 0.0);
  } else {
    outputColor = vec4(
      rgb.r / (u_rminmax.y - u_rminmax.x),
      rgb.g / (u_gminmax.y - u_gminmax.x),
      rgb.b / (u_bminmax.y - u_bminmax.x),
      u_opacity
    );
  }

  if (outputColor.a < 0.01) discard;

}
`})),Xh,Zh=t((()=>{Xh=`layout(location = ATTRIBUTE_LOCATION_POSITION) in vec3 a_Position;
layout(location = ATTRIBUTE_LOCATION_POSITION_64LOW) in vec2 a_Position64Low;
layout(location = ATTRIBUTE_LOCATION_UV) in vec2 a_Uv;

layout(std140) uniform commonUniforms {
  vec2 u_rminmax;
  vec2 u_gminmax;
  vec2 u_bminmax;
  float u_opacity;
  float u_noDataValue;
};

out vec2 v_texCoord;

#pragma include "projection"

void main() {
  v_texCoord = a_Uv;
  vec4 project_pos = project_position(vec4(a_Position, 1.0), a_Position64Low);
  gl_Position = project_common_position_to_clipspace(vec4(project_pos.xy, 0.0, 1.0));
}
`})),Qh,$h=t((()=>{E(),P(),F(),Yh(),Zh(),Qh=class extends N{constructor(...e){super(...e),this.dataOption={}}get attributeLocation(){return Object.assign(super.attributeLocation,{MAX:super.attributeLocation.MAX,UV:9})}getUninforms(){let e=this.getCommonUniformsInfo(),t=this.getUniformsBufferInfo(this.getStyleAttribute());return this.updateStyleUnifoms(),{...e.uniformsOption,...t.uniformsOption}}getCommonUniformsInfo(){let{opacity:e=1,noDataValue:t=0}=this.layer.getLayerConfig(),{rMinMax:n=[0,255],gMinMax:r=[0,255],bMinMax:i=[0,255]}=this.dataOption,a={u_rminmax:n,u_gminmax:r,u_bminmax:i,u_opacity:e||1,u_noDataValue:t,u_texture:this.texture};return this.textures=[this.texture],this.getUniformsBufferInfo(a)}async getRasterData(e){if(Array.isArray(e.data)){let{data:t,...n}=e;return this.dataOption=n,{data:t,...n}}let{rasterData:t,...n}=await e.data;return this.dataOption=n,Array.isArray(t)?{data:t,...n}:{data:Array.from(t),...n}}async initModels(){this.initUniformsBuffer();let e=this.layer.getSource(),{createTexture2D:t}=this.rendererService,n=e.data.dataArray[0],{data:r,width:i,height:a}=await this.getRasterData(n);return this.texture=t({data:new Float32Array(r),width:i,height:a,format:m.RGB,type:m.FLOAT}),[await this.layer.buildLayerModel({moduleName:`rasterImageDataRGBA`,vertexShader:Xh,fragmentShader:Jh,defines:this.getDefines(),triangulation:_u,primitive:m.TRIANGLES,depth:{enable:!1},pickingEnabled:!1})]}async buildModels(){return this.initModels()}clearModels(){this.texture?.destroy()}registerBuiltinAttributes(){this.registerPosition64LowAttribute(),this.styleAttributeService.registerStyleAttribute({name:`uv`,type:k.Attribute,descriptor:{name:`a_Uv`,shaderLocation:this.attributeLocation.UV,buffer:{usage:m.DYNAMIC_DRAW,data:[],type:m.FLOAT},size:2,update:(e,t,n)=>[n[3],n[4]]}})}}})),eg,tg=t((()=>{eg=`uniform sampler2D u_texture;
uniform sampler2D u_colorTexture;

layout(std140) uniform commonUniforms {
  vec4 u_unpack;
  vec2 u_domain;
  float u_opacity;
  float u_noDataValue;
  float u_clampLow;
  float u_clampHigh;
};

in vec2 v_texCoord;
out vec4 outputColor;

float getElevation(vec2 coord, float bias) {
  // Convert encoded elevation value to meters
  vec4 data = texture(SAMPLER_2D(u_texture), coord, bias) * 255.0;
  data.a = -1.0;
  return dot(data, u_unpack);
}

vec4 getColor(float value) {
  float normalisedValue = (value - u_domain[0]) / (u_domain[1] - u_domain[0]);
  vec2 coord = vec2(normalisedValue, 0);
  return texture(SAMPLER_2D(u_colorTexture), coord);
}

void main() {
  float value = getElevation(v_texCoord, 0.0);
  if (value == u_noDataValue) {
    outputColor = vec4(0.0, 0, 0, 0.0);
  } else if (u_clampLow < 0.5 && value < u_domain[0] || u_clampHigh < 0.5 && value > u_domain[1]) {
    outputColor = vec4(0.0, 0, 0, 0.0);
  } else {
    outputColor = getColor(value);
    outputColor.a = outputColor.a * u_opacity;
    if (outputColor.a < 0.01) discard;
  }
}
`})),ng,rg=t((()=>{ng=`layout(location = ATTRIBUTE_LOCATION_POSITION) in vec3 a_Position;
layout(location = ATTRIBUTE_LOCATION_UV) in vec2 a_Uv;

layout(std140) uniform commonUniforms {
  vec4 u_unpack;
  vec2 u_domain;
  float u_opacity;
  float u_noDataValue;
  float u_clampLow;
  float u_clampHigh;
};
out vec2 v_texCoord;
#pragma include "projection"

void main() {
  v_texCoord = a_Uv;
  vec4 project_pos = project_position(vec4(a_Position, 1.0));
  gl_Position = project_common_position_to_clipspace(vec4(project_pos.xy, 0.0, 1.0));
}
`})),ig,ag=t((()=>{E(),D(),P(),F(),tg(),rg(),ig=class extends N{get attributeLocation(){return Object.assign(super.attributeLocation,{MAX:super.attributeLocation.MAX,UV:9})}getCommonUniformsInfo(){let{opacity:e,clampLow:t=!0,clampHigh:n=!0,noDataValue:r=-9999999,domain:i,rampColors:a,colorTexture:o,rScaler:s=6553.6,gScaler:c=25.6,bScaler:l=.1,offset:u=1e4}=this.layer.getLayerConfig(),d=i||v(a),f=o;o?this.layer.textureService.setColorTexture(o,a,d):f=this.layer.textureService.getColorTexture(a,d);let p={u_unpack:[s,c,l,u],u_domain:d,u_opacity:e||1,u_noDataValue:r,u_clampLow:t,u_clampHigh:n===void 0?t:n,u_texture:this.texture,u_colorTexture:f};return this.textures=[this.texture,f],this.getUniformsBufferInfo(p)}async initModels(){this.initUniformsBuffer();let e=this.layer.getSource(),{createTexture2D:t}=this.rendererService,n=await e.data.images;return this.texture=t({data:n[0],width:n[0].width,height:n[0].height,min:m.LINEAR,mag:m.LINEAR}),[await this.layer.buildLayerModel({moduleName:`RasterTileDataImage`,vertexShader:ng,fragmentShader:eg,defines:this.getDefines(),triangulation:_u,primitive:m.TRIANGLES,depth:{enable:!1}})]}clearModels(){this.texture?.destroy()}async buildModels(){return this.initModels()}registerBuiltinAttributes(){this.registerPosition64LowAttribute(),this.styleAttributeService.registerStyleAttribute({name:`uv`,type:k.Attribute,descriptor:{name:`a_Uv`,shaderLocation:this.attributeLocation.UV,buffer:{usage:m.DYNAMIC_DRAW,data:[],type:m.FLOAT},size:2,update:(e,t,n)=>[n[3],n[4]]}})}}})),og,sg=t((()=>{qh(),$h(),ag(),og={raster:Kh,rasterRgb:Qh,raster3d:Kh,rasterTerrainRgb:ig}})),cg,lg=t((()=>{$c(),od(),sg(),cg=class extends Qc{constructor(...e){super(...e),this.type=`RasterLayer`}async buildModels(){let e=this.getModelType();this.layerModel=new og[e](this),await this.initLayerModels()}getDefaultConfig(){return{raster:{},rasterRgb:{},raster3d:{},rasterTerrainRgb:{}}[this.getModelType()]}getModelType(){switch(this.layerSource.getParserType()){case`raster`:case`ndi`:return`raster`;case`rasterRgb`:return`rasterRgb`;case`rgb`:return`rasterRgb`;case`image`:return`rasterTerrainRgb`;default:return`raster`}}getLegend(e){if(e!==`color`)return{type:void 0,field:void 0,items:[]};let t=this.getLayerConfig().rampColors;return ad(t,e)}}})),ug,dg=t((()=>{ug=class{constructor({rendererService:e,layerService:t,parent:n}){this.tileResource=new Map,this.layerTilesMap=new Map,this.pendingDestroyQueue=[],this.maxDestroyPerFrame=3,this.renderLayersCache=null,this.renderCacheDirty=!0,this.rendererService=e,this.layerService=t,this.parent=n}get tiles(){return Array.from(this.layerTilesMap.values())}get pendingDestroyCount(){return this.pendingDestroyQueue.length}hasTile(e){return this.layerTilesMap.has(e)}addTile(e){this.layerTilesMap.set(e.key,e),this.markRenderCacheDirty()}getTile(e){return this.layerTilesMap.get(e)}getVisibleTileBylngLat(e){for(let t of this.layerTilesMap.values())if(t.isLoaded&&t.visible&&t.lnglatInBounds(e))return t}removeTile(e){let t=this.layerTilesMap.get(e);t&&(this.layerTilesMap.delete(e),this.pendingDestroyQueue.push(t),this.markRenderCacheDirty())}processPendingDestroys(){let e=Math.min(this.pendingDestroyQueue.length,this.maxDestroyPerFrame);for(let t=0;t<e;t++){let e=this.pendingDestroyQueue.shift();e&&e.destroy()}}markRenderCacheDirty(){this.renderCacheDirty=!0}updateTileVisible(e){let t=this.getTile(e.key);if(e.isVisible){if(e.parent){let n=this.isChildrenLoaded(e.parent);t?.updateVisible(n)}else t?.updateVisible(!0)}else if(e.parent){let n=this.isChildrenLoaded(e.parent);t?.updateVisible(!n)}else t?.updateVisible(!1);this.markRenderCacheDirty()}isParentLoaded(e){let t=e.parent;return!(t&&!this.getTile(t?.key)?.isLoaded)}isChildrenLoaded(e){let t=e?.children;return t.length===0||t.every(e=>{let t=this.getTile(e?.key);return!t||t?.isLoaded===!0})}async render(){this.processPendingDestroys();let e=this.getRenderLayers().map(async e=>{await this.layerService.renderTileLayer(e)});await Promise.all(e)}getRenderLayers(){if(!this.renderCacheDirty&&this.renderLayersCache)return this.renderLayersCache;let e=[];return this.layerTilesMap.forEach(t=>{t.visible&&t.isLoaded&&e.push(...t.getLayers())}),this.renderLayersCache=e,this.renderCacheDirty=!1,e}getLayers(){let e=[];return this.layerTilesMap.forEach(t=>{t.isLoaded&&e.push(...t.getLayers())}),e}getTiles(){return Array.from(this.layerTilesMap.values())}destroy(){for(;this.pendingDestroyQueue.length>0;)this.pendingDestroyQueue.shift()?.destroy();this.layerTilesMap.forEach(e=>e.destroy()),this.layerTilesMap.clear(),this.renderLayersCache=null,this.tileResource.clear()}}})),fg=r(((e,t,n)=>{(function(n,r){typeof e==`object`&&t!==void 0?t.exports=r():typeof define==`function`&&define.amd?define(r):(n=typeof globalThis<`u`?globalThis:n||self,n.polygonClipping=r())})(n,(function(){function e(e,t){var n={label:0,sent:function(){if(a[0]&1)throw a[1];return a[1]},trys:[],ops:[]},r,i,a,o={next:s(0),throw:s(1),return:s(2)};return typeof Symbol==`function`&&(o[Symbol.iterator]=function(){return this}),o;function s(e){return function(t){return c([e,t])}}function c(o){if(r)throw TypeError(`Generator is already executing.`);for(;n;)try{if(r=1,i&&(a=o[0]&2?i.return:o[0]?i.throw||((a=i.return)&&a.call(i),0):i.next)&&!(a=a.call(i,o[1])).done)return a;switch(i=0,a&&(o=[o[0]&2,a.value]),o[0]){case 0:case 1:a=o;break;case 4:return n.label++,{value:o[1],done:!1};case 5:n.label++,i=o[1],o=[0];continue;case 7:o=n.ops.pop(),n.trys.pop();continue;default:if(a=n.trys,!(a=a.length>0&&a[a.length-1])&&(o[0]===6||o[0]===2)){n=0;continue}if(o[0]===3&&(!a||o[1]>a[0]&&o[1]<a[3])){n.label=o[1];break}if(o[0]===6&&n.label<a[1]){n.label=a[1],a=o;break}if(a&&n.label<a[2]){n.label=a[2],n.ops.push(o);break}a[2]&&n.ops.pop(),n.trys.pop();continue}o=t.call(e,n)}catch(e){o=[6,e],i=0}finally{r=a=0}if(o[0]&5)throw o[1];return{value:o[0]?o[1]:void 0,done:!0}}}var t=function(){function e(e,t){this.next=null,this.key=e,this.data=t,this.left=null,this.right=null}return e}();function n(e,t){return e>t?1:e<t?-1:0}function r(e,n,r){for(var i=new t(null,null),a=i,o=i;;){var s=r(e,n.key);if(s<0){if(n.left===null)break;if(r(e,n.left.key)<0){var c=n.left;if(n.left=c.right,c.right=n,n=c,n.left===null)break}o.left=n,o=n,n=n.left}else if(s>0){if(n.right===null)break;if(r(e,n.right.key)>0){var c=n.right;if(n.right=c.left,c.left=n,n=c,n.right===null)break}a.right=n,a=n,n=n.right}else break}return a.right=n.left,o.left=n.right,n.left=i.right,n.right=i.left,n}function i(e,n,i,a){var o=new t(e,n);if(i===null)return o.left=o.right=null,o;i=r(e,i,a);var s=a(e,i.key);return s<0?(o.left=i.left,o.right=i,i.left=null):s>=0&&(o.right=i.right,o.left=i,i.right=null),o}function a(e,t,n){var i=null,a=null;if(t){t=r(e,t,n);var o=n(t.key,e);o===0?(i=t.left,a=t.right):o<0?(a=t.right,t.right=null,i=t):(i=t.left,t.left=null,a=t)}return{left:i,right:a}}function o(e,t,n){return t===null?e:(e===null||(t=r(e.key,t,n),t.left=e),t)}function s(e,t,n,r,i){if(e){r(``+t+(n?`└── `:`├── `)+i(e)+`
`);var a=t+(n?`    `:`│   `);e.left&&s(e.left,a,!1,r,i),e.right&&s(e.right,a,!0,r,i)}}var c=function(){function c(e){e===void 0&&(e=n),this._root=null,this._size=0,this._comparator=e}return c.prototype.insert=function(e,t){return this._size++,this._root=i(e,t,this._root,this._comparator)},c.prototype.add=function(e,n){var i=new t(e,n);this._root===null&&(i.left=i.right=null,this._size++,this._root=i);var a=this._comparator,o=r(e,this._root,a),s=a(e,o.key);return s===0?this._root=o:(s<0?(i.left=o.left,i.right=o,o.left=null):s>0&&(i.right=o.right,i.left=o,o.right=null),this._size++,this._root=i),this._root},c.prototype.remove=function(e){this._root=this._remove(e,this._root,this._comparator)},c.prototype._remove=function(e,t,n){var i;return t===null?null:(t=r(e,t,n),n(e,t.key)===0?(t.left===null?i=t.right:(i=r(e,t.left,n),i.right=t.right),this._size--,i):t)},c.prototype.pop=function(){var e=this._root;if(e){for(;e.left;)e=e.left;return this._root=r(e.key,this._root,this._comparator),this._root=this._remove(e.key,this._root,this._comparator),{key:e.key,data:e.data}}return null},c.prototype.findStatic=function(e){for(var t=this._root,n=this._comparator;t;){var r=n(e,t.key);if(r===0)return t;t=r<0?t.left:t.right}return null},c.prototype.find=function(e){return this._root&&(this._root=r(e,this._root,this._comparator),this._comparator(e,this._root.key)!==0)?null:this._root},c.prototype.contains=function(e){for(var t=this._root,n=this._comparator;t;){var r=n(e,t.key);if(r===0)return!0;t=r<0?t.left:t.right}return!1},c.prototype.forEach=function(e,t){for(var n=this._root,r=[],i=!1;!i;)n===null?r.length===0?i=!0:(n=r.pop(),e.call(t,n),n=n.right):(r.push(n),n=n.left);return this},c.prototype.range=function(e,t,n,r){for(var i=[],a=this._comparator,o=this._root,s;i.length!==0||o;)if(o)i.push(o),o=o.left;else{if(o=i.pop(),s=a(o.key,t),s>0)break;if(a(o.key,e)>=0&&n.call(r,o))return this;o=o.right}return this},c.prototype.keys=function(){var e=[];return this.forEach(function(t){var n=t.key;return e.push(n)}),e},c.prototype.values=function(){var e=[];return this.forEach(function(t){var n=t.data;return e.push(n)}),e},c.prototype.min=function(){return this._root?this.minNode(this._root).key:null},c.prototype.max=function(){return this._root?this.maxNode(this._root).key:null},c.prototype.minNode=function(e){if(e===void 0&&(e=this._root),e)for(;e.left;)e=e.left;return e},c.prototype.maxNode=function(e){if(e===void 0&&(e=this._root),e)for(;e.right;)e=e.right;return e},c.prototype.at=function(e){for(var t=this._root,n=!1,r=0,i=[];!n;)if(t)i.push(t),t=t.left;else if(i.length>0){if(t=i.pop(),r===e)return t;r++,t=t.right}else n=!0;return null},c.prototype.next=function(e){var t=this._root,n=null;if(e.right){for(n=e.right;n.left;)n=n.left;return n}for(var r=this._comparator;t;){var i=r(e.key,t.key);if(i===0)break;i<0?(n=t,t=t.left):t=t.right}return n},c.prototype.prev=function(e){var t=this._root,n=null;if(e.left!==null){for(n=e.left;n.right;)n=n.right;return n}for(var r=this._comparator;t;){var i=r(e.key,t.key);if(i===0)break;i<0?t=t.left:(n=t,t=t.right)}return n},c.prototype.clear=function(){return this._root=null,this._size=0,this},c.prototype.toList=function(){return d(this._root)},c.prototype.load=function(e,t,n){t===void 0&&(t=[]),n===void 0&&(n=!1);var r=e.length,i=this._comparator;if(n&&m(e,t,0,r-1,i),this._root===null)this._root=l(e,t,0,r),this._size=r;else{var a=p(this.toList(),u(e,t),i);r=this._size+r,this._root=f({head:a},0,r)}return this},c.prototype.isEmpty=function(){return this._root===null},Object.defineProperty(c.prototype,"size",{get:function(){return this._size},enumerable:!0,configurable:!0}),Object.defineProperty(c.prototype,"root",{get:function(){return this._root},enumerable:!0,configurable:!0}),c.prototype.toString=function(e){e===void 0&&(e=function(e){return String(e.key)});var t=[];return s(this._root,``,!0,function(e){return t.push(e)},e),t.join(``)},c.prototype.update=function(e,t,n){var r=this._comparator,s=a(e,this._root,r),c=s.left,l=s.right;r(e,t)<0?l=i(t,n,l,r):c=i(t,n,c,r),this._root=o(c,l,r)},c.prototype.split=function(e){return a(e,this._root,this._comparator)},c.prototype[Symbol.iterator]=function(){var t,n,r;return e(this,function(e){switch(e.label){case 0:t=this._root,n=[],r=!1,e.label=1;case 1:return r?[3,6]:t===null?[3,2]:(n.push(t),t=t.left,[3,5]);case 2:return n.length===0?[3,4]:(t=n.pop(),[4,t]);case 3:return e.sent(),t=t.right,[3,5];case 4:r=!0,e.label=5;case 5:return[3,1];case 6:return[2]}})},c}();function l(e,n,r,i){var a=i-r;if(a>0){var o=r+Math.floor(a/2),s=e[o],c=n[o],u=new t(s,c);return u.left=l(e,n,r,o),u.right=l(e,n,o+1,i),u}return null}function u(e,n){for(var r=new t(null,null),i=r,a=0;a<e.length;a++)i=i.next=new t(e[a],n[a]);return i.next=null,r.next}function d(e){for(var n=e,r=[],i=!1,a=new t(null,null),o=a;!i;)n?(r.push(n),n=n.left):r.length>0?(n=o=o.next=r.pop(),n=n.right):i=!0;return o.next=null,a.next}function f(e,t,n){var r=n-t;if(r>0){var i=t+Math.floor(r/2),a=f(e,t,i),o=e.head;return o.left=a,e.head=e.head.next,o.right=f(e,i+1,n),o}return null}function p(e,n,r){for(var i=new t(null,null),a=i,o=e,s=n;o!==null&&s!==null;)r(o.key,s.key)<0?(a.next=o,o=o.next):(a.next=s,s=s.next),a=a.next;return o===null?s!==null&&(a.next=s):a.next=o,i.next}function m(e,t,n,r,i){if(!(n>=r)){for(var a=e[n+r>>1],o=n-1,s=r+1;;){do o++;while(i(e[o],a)<0);do s--;while(i(e[s],a)>0);if(o>=s)break;var c=e[o];e[o]=e[s],e[s]=c,c=t[o],t[o]=t[s],t[s]=c}m(e,t,n,s,i),m(e,t,s+1,r,i)}}let h=(e,t)=>e.ll.x<=t.x&&t.x<=e.ur.x&&e.ll.y<=t.y&&t.y<=e.ur.y,g=(e,t)=>{if(t.ur.x<e.ll.x||e.ur.x<t.ll.x||t.ur.y<e.ll.y||e.ur.y<t.ll.y)return null;let n=e.ll.x<t.ll.x?t.ll.x:e.ll.x,r=e.ur.x<t.ur.x?e.ur.x:t.ur.x,i=e.ll.y<t.ll.y?t.ll.y:e.ll.y,a=e.ur.y<t.ur.y?e.ur.y:t.ur.y;return{ll:{x:n,y:i},ur:{x:r,y:a}}},_=2**-52;_===void 0&&(_=2**-52);let v=_*_,y=(e,t)=>{if(-_<e&&e<_&&-_<t&&t<_)return 0;let n=e-t;return n*n<v*e*t?0:e<t?-1:1};class b{constructor(){this.reset()}reset(){this.xRounder=new x,this.yRounder=new x}round(e,t){return{x:this.xRounder.round(e),y:this.yRounder.round(t)}}}class x{constructor(){this.tree=new c,this.round(0)}round(e){let t=this.tree.add(e),n=this.tree.prev(t);if(n!==null&&y(t.key,n.key)===0)return this.tree.remove(e),n.key;let r=this.tree.next(t);return r!==null&&y(t.key,r.key)===0?(this.tree.remove(e),r.key):e}}let S=new b,C=134217729;function w(e,t,n,r,i){let a,o,s,c,l=t[0],u=r[0],d=0,f=0;u>l==u>-l?(a=l,l=t[++d]):(a=u,u=r[++f]);let p=0;if(d<e&&f<n)for(u>l==u>-l?(o=l+a,s=a-(o-l),l=t[++d]):(o=u+a,s=a-(o-u),u=r[++f]),a=o,s!==0&&(i[p++]=s);d<e&&f<n;)u>l==u>-l?(o=a+l,c=o-a,s=a-(o-c)+(l-c),l=t[++d]):(o=a+u,c=o-a,s=a-(o-c)+(u-c),u=r[++f]),a=o,s!==0&&(i[p++]=s);for(;d<e;)o=a+l,c=o-a,s=a-(o-c)+(l-c),l=t[++d],a=o,s!==0&&(i[p++]=s);for(;f<n;)o=a+u,c=o-a,s=a-(o-c)+(u-c),u=r[++f],a=o,s!==0&&(i[p++]=s);return(a!==0||p===0)&&(i[p++]=a),p}function ee(e,t){let n=t[0];for(let r=1;r<e;r++)n+=t[r];return n}function te(e){return new Float64Array(e)}let ne=te(4),re=te(8),ie=te(12),ae=te(16),oe=te(4);function T(e,t,n,r,i,a,o){let s,c,l,u,d,f,p,m,h,g,_,v,y,b,x,S,te,T,se=e-i,ce=n-i,le=t-a,ue=r-a;b=se*ue,f=C*se,p=f-(f-se),m=se-p,f=C*ue,h=f-(f-ue),g=ue-h,x=m*g-(b-p*h-m*h-p*g),S=le*ce,f=C*le,p=f-(f-le),m=le-p,f=C*ce,h=f-(f-ce),g=ce-h,te=m*g-(S-p*h-m*h-p*g),_=x-te,d=x-_,ne[0]=x-(_+d)+(d-te),v=b+_,d=v-b,y=b-(v-d)+(_-d),_=y-S,d=y-_,ne[1]=y-(_+d)+(d-S),T=v+_,d=T-v,ne[2]=v-(T-d)+(_-d),ne[3]=T;let de=ee(4,ne),fe=22204460492503146e-32*o;if(de>=fe||-de>=fe||(d=e-se,s=e-(se+d)+(d-i),d=n-ce,l=n-(ce+d)+(d-i),d=t-le,c=t-(le+d)+(d-a),d=r-ue,u=r-(ue+d)+(d-a),s===0&&c===0&&l===0&&u===0)||(fe=11093356479670487e-47*o+33306690738754706e-32*Math.abs(de),de+=se*u+ue*s-(le*l+ce*c),de>=fe||-de>=fe))return de;b=s*ue,f=C*s,p=f-(f-s),m=s-p,f=C*ue,h=f-(f-ue),g=ue-h,x=m*g-(b-p*h-m*h-p*g),S=c*ce,f=C*c,p=f-(f-c),m=c-p,f=C*ce,h=f-(f-ce),g=ce-h,te=m*g-(S-p*h-m*h-p*g),_=x-te,d=x-_,oe[0]=x-(_+d)+(d-te),v=b+_,d=v-b,y=b-(v-d)+(_-d),_=y-S,d=y-_,oe[1]=y-(_+d)+(d-S),T=v+_,d=T-v,oe[2]=v-(T-d)+(_-d),oe[3]=T;let pe=w(4,ne,4,oe,re);b=se*u,f=C*se,p=f-(f-se),m=se-p,f=C*u,h=f-(f-u),g=u-h,x=m*g-(b-p*h-m*h-p*g),S=le*l,f=C*le,p=f-(f-le),m=le-p,f=C*l,h=f-(f-l),g=l-h,te=m*g-(S-p*h-m*h-p*g),_=x-te,d=x-_,oe[0]=x-(_+d)+(d-te),v=b+_,d=v-b,y=b-(v-d)+(_-d),_=y-S,d=y-_,oe[1]=y-(_+d)+(d-S),T=v+_,d=T-v,oe[2]=v-(T-d)+(_-d),oe[3]=T;let me=w(pe,re,4,oe,ie);b=s*u,f=C*s,p=f-(f-s),m=s-p,f=C*u,h=f-(f-u),g=u-h,x=m*g-(b-p*h-m*h-p*g),S=c*l,f=C*c,p=f-(f-c),m=c-p,f=C*l,h=f-(f-l),g=l-h,te=m*g-(S-p*h-m*h-p*g),_=x-te,d=x-_,oe[0]=x-(_+d)+(d-te),v=b+_,d=v-b,y=b-(v-d)+(_-d),_=y-S,d=y-_,oe[1]=y-(_+d)+(d-S),T=v+_,d=T-v,oe[2]=v-(T-d)+(_-d),oe[3]=T;let he=w(me,ie,4,oe,ae);return ae[he-1]}function se(e,t,n,r,i,a){let o=(t-a)*(n-i),s=(e-i)*(r-a),c=o-s,l=Math.abs(o+s);return Math.abs(c)>=33306690738754716e-32*l?c:-T(e,t,n,r,i,a,l)}let ce=(e,t)=>e.x*t.y-e.y*t.x,le=(e,t)=>e.x*t.x+e.y*t.y,ue=(e,t,n)=>{let r=se(e.x,e.y,t.x,t.y,n.x,n.y);return r>0?-1:+(r<0)},de=e=>Math.sqrt(le(e,e)),fe=(e,t,n)=>{let r={x:t.x-e.x,y:t.y-e.y},i={x:n.x-e.x,y:n.y-e.y};return ce(i,r)/de(i)/de(r)},pe=(e,t,n)=>{let r={x:t.x-e.x,y:t.y-e.y},i={x:n.x-e.x,y:n.y-e.y};return le(i,r)/de(i)/de(r)},me=(e,t,n)=>t.y===0?null:{x:e.x+t.x/t.y*(n-e.y),y:n},he=(e,t,n)=>t.x===0?null:{x:n,y:e.y+t.y/t.x*(n-e.x)},E=(e,t,n,r)=>{if(t.x===0)return he(n,r,e.x);if(r.x===0)return he(e,t,n.x);if(t.y===0)return me(n,r,e.y);if(r.y===0)return me(e,t,n.y);let i=ce(t,r);if(i==0)return null;let a={x:n.x-e.x,y:n.y-e.y},o=ce(a,t)/i,s=ce(a,r)/i,c=e.x+s*t.x,l=n.x+o*r.x,u=e.y+s*t.y,d=n.y+o*r.y;return{x:(c+l)/2,y:(u+d)/2}};class ge{static compare(e,t){let n=ge.comparePoints(e.point,t.point);return n===0?(e.point!==t.point&&e.link(t),e.isLeft===t.isLeft?ve.compare(e.segment,t.segment):e.isLeft?1:-1):n}static comparePoints(e,t){return e.x<t.x?-1:e.x>t.x?1:e.y<t.y?-1:+(e.y>t.y)}constructor(e,t){e.events===void 0?e.events=[this]:e.events.push(this),this.point=e,this.isLeft=t}link(e){if(e.point===this.point)throw Error(`Tried to link already linked events`);let t=e.point.events;for(let e=0,n=t.length;e<n;e++){let n=t[e];this.point.events.push(n),n.point=this.point}this.checkForConsuming()}checkForConsuming(){let e=this.point.events.length;for(let t=0;t<e;t++){let n=this.point.events[t];if(n.segment.consumedBy===void 0)for(let r=t+1;r<e;r++){let e=this.point.events[r];e.consumedBy===void 0&&n.otherSE.point.events===e.otherSE.point.events&&n.segment.consume(e.segment)}}}getAvailableLinkedEvents(){let e=[];for(let t=0,n=this.point.events.length;t<n;t++){let n=this.point.events[t];n!==this&&!n.segment.ringOut&&n.segment.isInResult()&&e.push(n)}return e}getLeftmostComparator(e){let t=new Map,n=n=>{let r=n.otherSE;t.set(n,{sine:fe(this.point,e.point,r.point),cosine:pe(this.point,e.point,r.point)})};return(e,r)=>{t.has(e)||n(e),t.has(r)||n(r);let{sine:i,cosine:a}=t.get(e),{sine:o,cosine:s}=t.get(r);return i>=0&&o>=0?a<s?1:a>s?-1:0:i<0&&o<0?a<s?-1:+(a>s):o<i?-1:+(o>i)}}}let _e=0;class ve{static compare(e,t){let n=e.leftSE.point.x,r=t.leftSE.point.x,i=e.rightSE.point.x,a=t.rightSE.point.x;if(a<n)return 1;if(i<r)return-1;let o=e.leftSE.point.y,s=t.leftSE.point.y,c=e.rightSE.point.y,l=t.rightSE.point.y;if(n<r){if(s<o&&s<c)return 1;if(s>o&&s>c)return-1;let n=e.comparePoint(t.leftSE.point);if(n<0)return 1;if(n>0)return-1;let r=t.comparePoint(e.rightSE.point);return r===0?-1:r}if(n>r){if(o<s&&o<l)return-1;if(o>s&&o>l)return 1;let n=t.comparePoint(e.leftSE.point);if(n!==0)return n;let r=e.comparePoint(t.rightSE.point);return r<0?1:r>0?-1:1}if(o<s)return-1;if(o>s)return 1;if(i<a){let n=t.comparePoint(e.rightSE.point);if(n!==0)return n}if(i>a){let n=e.comparePoint(t.rightSE.point);if(n<0)return 1;if(n>0)return-1}if(i!==a){let e=c-o,t=i-n,u=l-s,d=a-r;if(e>t&&u<d)return 1;if(e<t&&u>d)return-1}return i>a?1:i<a||c<l?-1:c>l?1:e.id<t.id?-1:+(e.id>t.id)}constructor(e,t,n,r){this.id=++_e,this.leftSE=e,e.segment=this,e.otherSE=t,this.rightSE=t,t.segment=this,t.otherSE=e,this.rings=n,this.windings=r}static fromRing(e,t,n){let r,i,a,o=ge.comparePoints(e,t);if(o<0)r=e,i=t,a=1;else if(o>0)r=t,i=e,a=-1;else throw Error(`Tried to create degenerate segment at [${e.x}, ${e.y}]`);let s=new ge(r,!0),c=new ge(i,!1);return new ve(s,c,[n],[a])}replaceRightSE(e){this.rightSE=e,this.rightSE.segment=this,this.rightSE.otherSE=this.leftSE,this.leftSE.otherSE=this.rightSE}bbox(){let e=this.leftSE.point.y,t=this.rightSE.point.y;return{ll:{x:this.leftSE.point.x,y:e<t?e:t},ur:{x:this.rightSE.point.x,y:e>t?e:t}}}vector(){return{x:this.rightSE.point.x-this.leftSE.point.x,y:this.rightSE.point.y-this.leftSE.point.y}}isAnEndpoint(e){return e.x===this.leftSE.point.x&&e.y===this.leftSE.point.y||e.x===this.rightSE.point.x&&e.y===this.rightSE.point.y}comparePoint(e){if(this.isAnEndpoint(e))return 0;let t=this.leftSE.point,n=this.rightSE.point,r=this.vector();if(t.x===n.x)return e.x===t.x?0:e.x<t.x?1:-1;let i=(e.y-t.y)/r.y,a=t.x+i*r.x;if(e.x===a)return 0;let o=(e.x-t.x)/r.x,s=t.y+o*r.y;return e.y===s?0:e.y<s?-1:1}getIntersection(e){let t=this.bbox(),n=e.bbox(),r=g(t,n);if(r===null)return null;let i=this.leftSE.point,a=this.rightSE.point,o=e.leftSE.point,s=e.rightSE.point,c=h(t,o)&&this.comparePoint(o)===0,l=h(n,i)&&e.comparePoint(i)===0,u=h(t,s)&&this.comparePoint(s)===0,d=h(n,a)&&e.comparePoint(a)===0;if(l&&c)return d&&!u?a:!d&&u?s:null;if(l)return u&&i.x===s.x&&i.y===s.y?null:i;if(c)return d&&a.x===o.x&&a.y===o.y?null:o;if(d&&u)return null;if(d)return a;if(u)return s;let f=E(i,this.vector(),o,e.vector());return f===null||!h(r,f)?null:S.round(f.x,f.y)}split(e){let t=[],n=e.events!==void 0,r=new ge(e,!0),i=new ge(e,!1),a=this.rightSE;this.replaceRightSE(i),t.push(i),t.push(r);let o=new ve(r,a,this.rings.slice(),this.windings.slice());return ge.comparePoints(o.leftSE.point,o.rightSE.point)>0&&o.swapEvents(),ge.comparePoints(this.leftSE.point,this.rightSE.point)>0&&this.swapEvents(),n&&(r.checkForConsuming(),i.checkForConsuming()),t}swapEvents(){let e=this.rightSE;this.rightSE=this.leftSE,this.leftSE=e,this.leftSE.isLeft=!0,this.rightSE.isLeft=!1;for(let e=0,t=this.windings.length;e<t;e++)this.windings[e]*=-1}consume(e){let t=this,n=e;for(;t.consumedBy;)t=t.consumedBy;for(;n.consumedBy;)n=n.consumedBy;let r=ve.compare(t,n);if(r!==0){if(r>0){let e=t;t=n,n=e}if(t.prev===n){let e=t;t=n,n=e}for(let e=0,r=n.rings.length;e<r;e++){let r=n.rings[e],i=n.windings[e],a=t.rings.indexOf(r);a===-1?(t.rings.push(r),t.windings.push(i)):t.windings[a]+=i}n.rings=null,n.windings=null,n.consumedBy=t,n.leftSE.consumedBy=t.leftSE,n.rightSE.consumedBy=t.rightSE}}prevInResult(){return this._prevInResult===void 0&&(this._prevInResult=this.prev?this.prev.isInResult()?this.prev:this.prev.prevInResult():null),this._prevInResult}beforeState(){if(this._beforeState!==void 0)return this._beforeState;if(!this.prev)this._beforeState={rings:[],windings:[],multiPolys:[]};else{let e=this.prev.consumedBy||this.prev;this._beforeState=e.afterState()}return this._beforeState}afterState(){if(this._afterState!==void 0)return this._afterState;let e=this.beforeState();this._afterState={rings:e.rings.slice(0),windings:e.windings.slice(0),multiPolys:[]};let t=this._afterState.rings,n=this._afterState.windings,r=this._afterState.multiPolys;for(let e=0,r=this.rings.length;e<r;e++){let r=this.rings[e],i=this.windings[e],a=t.indexOf(r);a===-1?(t.push(r),n.push(i)):n[a]+=i}let i=[],a=[];for(let e=0,r=t.length;e<r;e++){if(n[e]===0)continue;let r=t[e],o=r.poly;if(a.indexOf(o)===-1){if(r.isExterior)i.push(o);else{a.indexOf(o)===-1&&a.push(o);let e=i.indexOf(r.poly);e!==-1&&i.splice(e,1)}}}for(let e=0,t=i.length;e<t;e++){let t=i[e].multiPoly;r.indexOf(t)===-1&&r.push(t)}return this._afterState}isInResult(){if(this.consumedBy)return!1;if(this._isInResult!==void 0)return this._isInResult;let e=this.beforeState().multiPolys,t=this.afterState().multiPolys;switch(De.type){case`union`:{let n=e.length===0,r=t.length===0;this._isInResult=n!==r;break}case`intersection`:{let n,r;e.length<t.length?(n=e.length,r=t.length):(n=t.length,r=e.length),this._isInResult=r===De.numMultiPolys&&n<r;break}case`xor`:{let n=Math.abs(e.length-t.length);this._isInResult=n%2==1;break}case`difference`:{let n=e=>e.length===1&&e[0].isSubject;this._isInResult=n(e)!==n(t);break}default:throw Error(`Unrecognized operation type found ${De.type}`)}return this._isInResult}}class ye{constructor(e,t,n){if(!Array.isArray(e)||e.length===0||(this.poly=t,this.isExterior=n,this.segments=[],typeof e[0][0]!=`number`||typeof e[0][1]!=`number`))throw Error(`Input geometry is not a valid Polygon or MultiPolygon`);let r=S.round(e[0][0],e[0][1]);this.bbox={ll:{x:r.x,y:r.y},ur:{x:r.x,y:r.y}};let i=r;for(let t=1,n=e.length;t<n;t++){if(typeof e[t][0]!=`number`||typeof e[t][1]!=`number`)throw Error(`Input geometry is not a valid Polygon or MultiPolygon`);let n=S.round(e[t][0],e[t][1]);(n.x!==i.x||n.y!==i.y)&&(this.segments.push(ve.fromRing(i,n,this)),n.x<this.bbox.ll.x&&(this.bbox.ll.x=n.x),n.y<this.bbox.ll.y&&(this.bbox.ll.y=n.y),n.x>this.bbox.ur.x&&(this.bbox.ur.x=n.x),n.y>this.bbox.ur.y&&(this.bbox.ur.y=n.y),i=n)}(r.x!==i.x||r.y!==i.y)&&this.segments.push(ve.fromRing(i,r,this))}getSweepEvents(){let e=[];for(let t=0,n=this.segments.length;t<n;t++){let n=this.segments[t];e.push(n.leftSE),e.push(n.rightSE)}return e}}class be{constructor(e,t){if(!Array.isArray(e))throw Error(`Input geometry is not a valid Polygon or MultiPolygon`);this.exteriorRing=new ye(e[0],this,!0),this.bbox={ll:{x:this.exteriorRing.bbox.ll.x,y:this.exteriorRing.bbox.ll.y},ur:{x:this.exteriorRing.bbox.ur.x,y:this.exteriorRing.bbox.ur.y}},this.interiorRings=[];for(let t=1,n=e.length;t<n;t++){let n=new ye(e[t],this,!1);n.bbox.ll.x<this.bbox.ll.x&&(this.bbox.ll.x=n.bbox.ll.x),n.bbox.ll.y<this.bbox.ll.y&&(this.bbox.ll.y=n.bbox.ll.y),n.bbox.ur.x>this.bbox.ur.x&&(this.bbox.ur.x=n.bbox.ur.x),n.bbox.ur.y>this.bbox.ur.y&&(this.bbox.ur.y=n.bbox.ur.y),this.interiorRings.push(n)}this.multiPoly=t}getSweepEvents(){let e=this.exteriorRing.getSweepEvents();for(let t=0,n=this.interiorRings.length;t<n;t++){let n=this.interiorRings[t].getSweepEvents();for(let t=0,r=n.length;t<r;t++)e.push(n[t])}return e}}class xe{constructor(e,t){if(!Array.isArray(e))throw Error(`Input geometry is not a valid Polygon or MultiPolygon`);try{typeof e[0][0][0]==`number`&&(e=[e])}catch{}this.polys=[],this.bbox={ll:{x:1/0,y:1/0},ur:{x:-1/0,y:-1/0}};for(let t=0,n=e.length;t<n;t++){let n=new be(e[t],this);n.bbox.ll.x<this.bbox.ll.x&&(this.bbox.ll.x=n.bbox.ll.x),n.bbox.ll.y<this.bbox.ll.y&&(this.bbox.ll.y=n.bbox.ll.y),n.bbox.ur.x>this.bbox.ur.x&&(this.bbox.ur.x=n.bbox.ur.x),n.bbox.ur.y>this.bbox.ur.y&&(this.bbox.ur.y=n.bbox.ur.y),this.polys.push(n)}this.isSubject=t}getSweepEvents(){let e=[];for(let t=0,n=this.polys.length;t<n;t++){let n=this.polys[t].getSweepEvents();for(let t=0,r=n.length;t<r;t++)e.push(n[t])}return e}}class D{static factory(e){let t=[];for(let n=0,r=e.length;n<r;n++){let r=e[n];if(!r.isInResult()||r.ringOut)continue;let i=null,a=r.leftSE,o=r.rightSE,s=[a],c=a.point,l=[];for(;i=a,a=o,s.push(a),a.point!==c;)for(;;){let e=a.getAvailableLinkedEvents();if(e.length===0){let e=s[0].point,t=s[s.length-1].point;throw Error(`Unable to complete output ring starting at [${e.x}, ${e.y}]. Last matching segment found ends at [${t.x}, ${t.y}].`)}if(e.length===1){o=e[0].otherSE;break}let n=null;for(let e=0,t=l.length;e<t;e++)if(l[e].point===a.point){n=e;break}if(n!==null){let e=l.splice(n)[0],r=s.splice(e.index);r.unshift(r[0].otherSE),t.push(new D(r.reverse()));continue}l.push({index:s.length,point:a.point});let r=a.getLeftmostComparator(i);o=e.sort(r)[0].otherSE;break}t.push(new D(s))}return t}constructor(e){this.events=e;for(let t=0,n=e.length;t<n;t++)e[t].segment.ringOut=this;this.poly=null}getGeom(){let e=this.events[0].point,t=[e];for(let n=1,r=this.events.length-1;n<r;n++){let r=this.events[n].point,i=this.events[n+1].point;ue(r,e,i)!==0&&(t.push(r),e=r)}if(t.length===1)return null;let n=t[0],r=t[1];ue(n,e,r)===0&&t.shift(),t.push(t[0]);let i=this.isExteriorRing()?1:-1,a=this.isExteriorRing()?0:t.length-1,o=this.isExteriorRing()?t.length:-1,s=[];for(let e=a;e!=o;e+=i)s.push([t[e].x,t[e].y]);return s}isExteriorRing(){if(this._isExteriorRing===void 0){let e=this.enclosingRing();this._isExteriorRing=!e||!e.isExteriorRing()}return this._isExteriorRing}enclosingRing(){return this._enclosingRing===void 0&&(this._enclosingRing=this._calcEnclosingRing()),this._enclosingRing}_calcEnclosingRing(){let e=this.events[0];for(let t=1,n=this.events.length;t<n;t++){let n=this.events[t];ge.compare(e,n)>0&&(e=n)}let t=e.segment.prevInResult(),n=t?t.prevInResult():null;for(;;){if(!t)return null;if(!n)return t.ringOut;if(n.ringOut!==t.ringOut)return n.ringOut.enclosingRing()===t.ringOut?t.ringOut.enclosingRing():t.ringOut;t=n.prevInResult(),n=t?t.prevInResult():null}}}class Se{constructor(e){this.exteriorRing=e,e.poly=this,this.interiorRings=[]}addInterior(e){this.interiorRings.push(e),e.poly=this}getGeom(){let e=[this.exteriorRing.getGeom()];if(e[0]===null)return null;for(let t=0,n=this.interiorRings.length;t<n;t++){let n=this.interiorRings[t].getGeom();n!==null&&e.push(n)}return e}}class Ce{constructor(e){this.rings=e,this.polys=this._composePolys(e)}getGeom(){let e=[];for(let t=0,n=this.polys.length;t<n;t++){let n=this.polys[t].getGeom();n!==null&&e.push(n)}return e}_composePolys(e){let t=[];for(let n=0,r=e.length;n<r;n++){let r=e[n];if(!r.poly){if(r.isExteriorRing())t.push(new Se(r));else{let e=r.enclosingRing();e.poly||t.push(new Se(e)),e.poly.addInterior(r)}}}return t}}class we{constructor(e){let t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:ve.compare;this.queue=e,this.tree=new c(t),this.segments=[]}process(e){let t=e.segment,n=[];if(e.consumedBy)return e.isLeft?this.queue.remove(e.otherSE):this.tree.remove(t),n;let r=e.isLeft?this.tree.add(t):this.tree.find(t);if(!r)throw Error(`Unable to find segment #${t.id} [${t.leftSE.point.x}, ${t.leftSE.point.y}] -> [${t.rightSE.point.x}, ${t.rightSE.point.y}] in SweepLine tree.`);let i=r,a=r,o,s;for(;o===void 0;)i=this.tree.prev(i),i===null?o=null:i.key.consumedBy===void 0&&(o=i.key);for(;s===void 0;)a=this.tree.next(a),a===null?s=null:a.key.consumedBy===void 0&&(s=a.key);if(e.isLeft){let r=null;if(o){let e=o.getIntersection(t);if(e!==null&&(t.isAnEndpoint(e)||(r=e),!o.isAnEndpoint(e))){let t=this._splitSafely(o,e);for(let e=0,r=t.length;e<r;e++)n.push(t[e])}}let i=null;if(s){let e=s.getIntersection(t);if(e!==null&&(t.isAnEndpoint(e)||(i=e),!s.isAnEndpoint(e))){let t=this._splitSafely(s,e);for(let e=0,r=t.length;e<r;e++)n.push(t[e])}}if(r!==null||i!==null){let e=null;e=r===null?i:i===null||ge.comparePoints(r,i)<=0?r:i,this.queue.remove(t.rightSE),n.push(t.rightSE);let a=t.split(e);for(let e=0,t=a.length;e<t;e++)n.push(a[e])}n.length>0?(this.tree.remove(t),n.push(e)):(this.segments.push(t),t.prev=o)}else{if(o&&s){let e=o.getIntersection(s);if(e!==null){if(!o.isAnEndpoint(e)){let t=this._splitSafely(o,e);for(let e=0,r=t.length;e<r;e++)n.push(t[e])}if(!s.isAnEndpoint(e)){let t=this._splitSafely(s,e);for(let e=0,r=t.length;e<r;e++)n.push(t[e])}}}this.tree.remove(t)}return n}_splitSafely(e,t){this.tree.remove(e);let n=e.rightSE;this.queue.remove(n);let r=e.split(t);return r.push(n),e.consumedBy===void 0&&this.tree.add(e),r}}let Te=typeof process<`u`&&{}.POLYGON_CLIPPING_MAX_QUEUE_SIZE||1e6,O=typeof process<`u`&&{}.POLYGON_CLIPPING_MAX_SWEEPLINE_SEGMENTS||1e6;class Ee{run(e,t,n){De.type=e,S.reset();let r=[new xe(t,!0)];for(let e=0,t=n.length;e<t;e++)r.push(new xe(n[e],!1));if(De.numMultiPolys=r.length,De.type===`difference`){let e=r[0],t=1;for(;t<r.length;)g(r[t].bbox,e.bbox)===null?r.splice(t,1):t++}if(De.type===`intersection`)for(let e=0,t=r.length;e<t;e++){let t=r[e];for(let n=e+1,i=r.length;n<i;n++)if(g(t.bbox,r[n].bbox)===null)return[]}let i=new c(ge.compare);for(let e=0,t=r.length;e<t;e++){let t=r[e].getSweepEvents();for(let e=0,n=t.length;e<n;e++)if(i.insert(t[e]),i.size>Te)throw Error(`Infinite loop when putting segment endpoints in a priority queue (queue size too big).`)}let a=new we(i),o=i.size,s=i.pop();for(;s;){let e=s.key;if(i.size===o){let t=e.segment;throw Error(`Unable to pop() ${e.isLeft?`left`:`right`} SweepEvent [${e.point.x}, ${e.point.y}] from segment #${t.id} [${t.leftSE.point.x}, ${t.leftSE.point.y}] -> [${t.rightSE.point.x}, ${t.rightSE.point.y}] from queue.`)}if(i.size>Te)throw Error(`Infinite loop when passing sweep line over endpoints (queue size too big).`);if(a.segments.length>O)throw Error(`Infinite loop when passing sweep line over endpoints (too many sweep line segments).`);let t=a.process(e);for(let e=0,n=t.length;e<n;e++){let n=t[e];n.consumedBy===void 0&&i.insert(n)}o=i.size,s=i.pop()}S.reset();let l=D.factory(a.segments);return new Ce(l).getGeom()}}let De=new Ee;return{union:function(e){var t=[...arguments].slice(1);return De.run(`union`,e,t)},intersection:function(e){var t=[...arguments].slice(1);return De.run(`intersection`,e,t)},xor:function(e){var t=[...arguments].slice(1);return De.run(`xor`,e,t)},difference:function(e){var t=[...arguments].slice(1);return De.run(`difference`,e,t)}}}))}));function pg(e,t,n){n===void 0&&(n={});var r=En(e),i=En(t),a=mg.default.union(r.coordinates,i.coordinates);return a.length===0?null:a.length===1?An(a[0],n.properties):jn(a,n.properties)}var mg,hg=t((()=>{mg=e(fg()),wn(),kn()})),gg,_g=t((()=>{kn(),hg(),gg=class{getCombineFeature(e){let t=null,n=e[0];return e.map(e=>{let n=An(e.coordinates);t=t===null?n:pg(t,n)}),n&&(t.properties={...n}),t}}})),vg,yg,bg,xg=t((()=>{D(),_g(),vg=`select`,yg=`active`,bg=class{constructor({layerService:e,tileLayerService:t,parent:n}){this.tilePickID=new Map,this.layerService=e,this.tileLayerService=t,this.parent=n,this.tileSourceService=new gg}pickRender(e){let t=this.tileLayerService.getVisibleTileBylngLat(e.lngLat);t&&t.getMainLayer()?.layerPickService.pickRender(e)}async pick(e,t){let n=this.parent.getContainer().pickingService;if(e.type===`RasterLayer`){let e=this.tileLayerService.getVisibleTileBylngLat(t.lngLat);if(e&&e.getMainLayer()!==void 0){let n=e.getMainLayer();return n.layerPickService.pickRasterLayer(n,t,this.parent)}return!1}return this.pickRender(t),n.pickFromPickingFBO(e,t)}selectFeature(e){let[t,n,r]=e,i=this.color2PickId(t,n,r);this.tilePickID.set(vg,i),this.updateHighLight(t,n,r,vg)}highlightPickedFeature(e){let[t,n,r]=e,i=this.color2PickId(t,n,r);this.tilePickID.set(yg,i),this.updateHighLight(t,n,r,yg)}updateHighLight(e,t,n,r){for(let i of this.tileLayerService.tiles){if(!i.isLoaded)continue;let a=i.getMainLayer();switch(r){case vg:a?.hooks.beforeSelect.call([e,t,n]);break;case yg:a?.hooks.beforeHighlight.call([e,t,n])}}}setPickState(){let e=this.tilePickID.get(vg),t=this.tilePickID.get(yg);if(e){let[t,n,r]=this.pickId2Color(e);this.updateHighLight(t,n,r,vg)}else if(t){let[e,n,r]=this.pickId2Color(t);this.updateHighLight(e,n,r,yg)}}color2PickId(e,t,n){return un(new Uint8Array([e,t,n]))}pickId2Color(e){return yn(e)}getFeatureById(e){let t=[];for(let n of this.tileLayerService.tiles)if(n.visible&&n.isLoaded){let r=n.getFeatureById(e);for(let e=0;e<r.length;e++)t.push(r[e])}return t}pickRasterLayer(){return!1}}}));function Sg(e){return e===`PolygonLayer`?Bh:e===`LineLayer`?pp:Km}function Cg(e){return[`PolygonLayer`,`LineLayer`].indexOf(e)!==-1}var wg=t((()=>{mp(),qm(),Vh()})),Tg,Eg,Dg=t((()=>{E(),Tg=e(qt()),Vh(),wg(),Eg=class extends Tg.EventEmitter{constructor(e,t){super(),this.visible=!0,this.layers=[],this.isLoaded=!1,this.tileMaskLayers=[],this.parent=t,this.sourceTile=e,this.x=e.x,this.y=e.y,this.z=e.z,this.key=`${this.x}_${this.y}_${this.z}`}getLayers(){return this.layers}styleUpdate(...e){}lnglatInBounds(e){let[t,n,r,i]=this.sourceTile.bounds,{lng:a,lat:o}=e;return a>=t&&a<=r&&o>=n&&o<=i}getLayerOptions(){let e=this.parent.getLayerConfig();return{...e,textAllowOverlap:!0,autoFit:!1,maskLayers:this.getMaskLayer(),tileMask:Cg(this.parent.type),mask:e.mask||e.maskLayers?.length!==0&&e.enableMask}}getMaskLayer(){let{maskLayers:e}=this.parent.getLayerConfig(),t=[];return e?.forEach(e=>{if(!e.tileLayer)return t.push(e),e;let n=e.tileLayer.getTile(this.sourceTile.key)?.getLayers()[0];n&&t.push(n)}),t}async addTileMask(){let e=new Bh({name:`mask`,visible:!0,enablePicking:!1}).source({type:`FeatureCollection`,features:[this.sourceTile.bboxPolygon]},{parser:{type:`geojson`,featureId:`id`}}).shape(`fill`).color(`#0f0`).style({opacity:.5}),t=Oe(this.parent.container);e.setContainer(t),await e.init(),this.tileMask=e;let n=this.getMainLayer();return n!==void 0&&(n.tileMask=e),e}async addMask(e,t){let n=Oe(this.parent.container);t.setContainer(n),await t.init(),e.addMask(t),this.tileMaskLayers.push(t)}async addLayer(e){e.isTileLayer=!0;let t=Oe(this.parent.container);e.setContainer(t),this.layers.push(e),await e.init()}updateVisible(e){this.visible=e,this.updateOptions(`visible`,e)}updateOptions(e,t){this.layers.forEach(n=>{n.updateLayerConfig({[e]:t})})}getMainLayer(){return this.layers[0]}getFeatures(e){return[]}getFeatureById(e){return[]}destroy(){this.tileMask?.destroy(),this.layers.forEach(e=>e.destroy())}}})),Og,kg=t((()=>{mp(),qm(),Dg(),Og=class extends Eg{async initTileLayer(){let e=this.getSourceOption(),t=e.data.features[0].properties,n=new pp().source(e.data,e.options).size(1).shape(`line`).color(`red`),r=new Km({minZoom:this.z-1,maxZoom:this.z+1,textAllowOverlap:!0}).source([t],{parser:{type:`json`,x:`x`,y:`y`}}).size(20).color(`red`).shape(this.key).style({stroke:`#fff`,strokeWidth:2});await this.addLayer(n),await this.addLayer(r),this.isLoaded=!0}getSourceOption(){let e=this.parent.getSource();return{data:{type:`FeatureCollection`,features:this.sourceTile.data.layers.testTile.features},options:{parser:{type:`geojson`},transforms:e.transforms}}}}})),Ag,jg=t((()=>{tf(),Dg(),Ag=class extends Eg{async initTileLayer(){let e=this.parent.getLayerAttributeConfig(),t=this.getLayerOptions(),n=this.getSourceOption(),r=new ef({...t}).source(n.data,n.options);e&&Object.keys(e).forEach(t=>{let n=t;r[n](e[n]?.field,e[n]?.values)}),await this.addLayer(r),this.isLoaded=!0}getSourceOption(){let e=this.parent.getSource();return{data:this.sourceTile.data,options:{parser:{type:`image`,extent:this.sourceTile.bounds},transforms:e.transforms}}}}})),Mg,Ng=t((()=>{Mg=`layout(std140) uniform commonUniorm {
  vec4 u_color;
  float u_opacity;
};

out vec4 outputColor;

void main() {
  outputColor = u_color;
  outputColor.a *= u_opacity;
}
`})),Pg,Fg=t((()=>{Pg=`layout(location = ATTRIBUTE_LOCATION_POSITION) in vec3 a_Position;

layout(std140) uniform commonUniorm {
  vec4 u_color;
  float u_opacity;
};

#pragma include "projection"

void main() {
  vec4 project_pos = project_position(vec4(a_Position, 1.0));
  gl_Position = project_common_position_to_clipspace(vec4(project_pos.xyz, 1.0));
}

`})),Ig,Lg=t((()=>{D(),P(),F(),Ng(),Fg(),Ig=class extends N{getUninforms(){let e=this.getCommonUniformsInfo(),t=this.getUniformsBufferInfo(this.getStyleAttribute());return this.updateStyleUnifoms(),{...e.uniformsOption,...t.uniformsOption}}getCommonUniformsInfo(){let{opacity:e=1,color:t=`#000`}=this.layer.getLayerConfig(),n={u_color:A(t),u_opacity:e||1};return this.getUniformsBufferInfo(n)}async initModels(){return this.buildModels()}async buildModels(){return this.initUniformsBuffer(),[await this.layer.buildLayerModel({moduleName:`mask`,vertexShader:Pg,fragmentShader:Mg,defines:this.getDefines(),triangulation:fu,depth:{enable:!1},pick:!1})]}clearModels(e=!0){e&&this.layerService.clear()}registerBuiltinAttributes(){return``}}})),Rg,zg=t((()=>{Lg(),Rg={fill:Ig}})),Bg,Vg=t((()=>{$c(),zg(),Bg=class extends Qc{constructor(...e){super(...e),this.type=`MaskLayer`}async buildModels(){let e=this.getModelType();this.layerModel=new Rg[e](this),await this.initLayerModels()}getModelType(){return`fill`}}})),Hg,Ug=t((()=>{Vg(),Dg(),Hg=class extends Eg{async initTileLayer(){let e=this.parent.getLayerAttributeConfig(),t=this.getLayerOptions(),n=this.getSourceOption(),r=new Bg({...t}).source(n.data,n.options);e&&Object.keys(e).forEach(t=>{let n=t;r[n](e[n]?.field,e[n]?.values)}),await this.addLayer(r),this.isLoaded=!0}getFeatures(e){return e?this.sourceTile.data.getTileData(e):[]}getSourceOption(){let e=this.parent.getSource(),{sourceLayer:t,featureId:n}=this.parent.getLayerConfig();return{data:{type:`FeatureCollection`,features:this.getFeatures(t)},options:{parser:{type:`geojson`,featureId:n},transforms:e.transforms}}}}})),Wg,Gg=t((()=>{lg(),Dg(),Wg=class extends Eg{async initTileLayer(){let e=this.parent.getLayerAttributeConfig(),t=this.getLayerOptions(),n=this.getSourceOption(),r=new cg({...t}).source(n.data,n.options);e&&Object.keys(e).forEach(t=>{let n=t;r[n](e[n]?.field,e[n]?.values)}),await this.addLayer(r),this.isLoaded=!0}getSourceOption(){let e=this.parent.getSource(),{rasterData:t,...n}=this.sourceTile.data.data;return{data:t,options:{parser:{type:`rasterRgb`,extent:this.sourceTile.bounds,...n},transforms:e.transforms}}}}})),Kg,qg=t((()=>{lg(),Dg(),Kg=class extends Eg{async initTileLayer(){let e=this.parent.getLayerAttributeConfig(),t=this.getLayerOptions(),n=this.getSourceOption(),r=new cg({...t}).source(n.data,n.options);e&&Object.keys(e).forEach(t=>{let n=t;r[n](e[n]?.field,e[n]?.values)}),await this.addLayer(r),this.isLoaded=!0}getSourceOption(){let e=this.parent.getSource();return{data:this.sourceTile.data,options:{parser:{type:`image`,extent:this.sourceTile.bounds},transforms:e.transforms}}}}})),Jg,Yg,Xg=t((()=>{D(),lg(),Dg(),Jg={positions:[0,1],colors:[`#000`,`#fff`]},Yg=class extends Eg{async initTileLayer(){let e=this.parent.getLayerAttributeConfig(),t=this.getLayerOptions(),n=this.getSourceOption(),{rampColors:r,domain:i}=this.getLayerOptions();this.colorTexture=this.parent.textureService.getColorTexture(r,i);let a=new cg({...t,colorTexture:this.colorTexture}).source(n.data,n.options);e&&Object.keys(e).forEach(t=>{let n=t;a[n](e[n]?.field,e[n]?.values)}),await this.addLayer(a),this.isLoaded=!0}getSourceOption(){let e=this.parent.getSource(),{rasterData:t,...n}=this.sourceTile.data.data;return{data:t,options:{parser:{type:`raster`,extent:this.sourceTile.bounds,...n},transforms:e.transforms}}}styleUpdate(...e){let{rampColors:t=Jg,domain:n}=e;this.colorTexture=this.parent.textureService.getColorTexture(t,n||v(t)),this.layers.forEach(e=>e.style({colorTexture:this.colorTexture}))}destroy(){this.layers.forEach(e=>e.destroy())}}})),Zg,Qg=t((()=>{Dg(),wg(),Zg=class extends Eg{async initTileLayer(){let e=this.parent.getLayerAttributeConfig(),t=this.getLayerOptions(),n=Sg(this.parent.type),r=this.getSourceOption();if(!r){this.isLoaded=!0,this.emit(`loaded`);return}let i=new n({...t}).source(r.data,r.options);Object.keys(e).forEach(t=>{let n=t;i[n](e[n]?.field,e[n]?.values)}),await this.addLayer(i),t.tileMask&&await this.addTileMask(),this.setLayerMinMaxZoom(i),this.isLoaded=!0,this.emit(`loaded`)}getSourceOption(){let e=this.parent.getSource(),{sourceLayer:t=`defaultLayer`,featureId:n=`id`}=this.parent.getLayerConfig();return{data:{type:`FeatureCollection`,features:this.getFeatures(t)},options:{parser:{type:`geojson`,featureId:n},transforms:e.transforms}}}setLayerMinMaxZoom(e){e.getModelType()===`text`&&e.updateLayerConfig({maxZoom:this.z+1,minZoom:this.z-1})}getFeatures(e){return this.sourceTile.data.getTileData(e)}getFeatureById(e){let t=this.getMainLayer();return t?t.getSource().data.dataArray.filter(t=>t._id===e):[]}}})),$g=t((()=>{}));function e_(e){switch(e.type){case`PolygonLayer`:return Zg;case`LineLayer`:return Zg;case`PointLayer`:return Zg;case`TileDebugLayer`:return Og;case`MaskLayer`:return Hg;case`RasterLayer`:let{dataType:t}=e.getSource().parser;switch(t){case Se.RGB:case Se.CUSTOMRGB:return Wg;case Se.ARRAYBUFFER:case Se.CUSTOMARRAYBUFFER:return Yg;case Se.TERRAINRGB:case Se.CUSTOMTERRAINRGB:return Kg;default:return Ag}default:return Zg}}var t_=t((()=>{E(),kg(),jg(),Ug(),Gg(),qg(),Xg(),Qg(),$g(),Dg()})),n_,r_=t((()=>{n_=[`shape`,`color`,`size`,`style`,`animate`,`filter`,`rotate`,`scale`,`setBlend`,`setSelect`,`setActive`,`disableMask`,`enableMask`,`addMask`,`removeMask`]})),i_,a_,o_=t((()=>{D(),dg(),xg(),t_(),r_(),{debounce:i_}=vt,a_=class{get mapService(){return this.parent.getContainer().mapService}get layerService(){return this.parent.getContainer().layerService}get rendererService(){return this.parent.getContainer().rendererService}constructor(e){this.initedTileset=!1,this.mapchange=()=>{if(this.parent.isVisible()===!1)return;let{latLonBounds:e,zoom:t}=this.getCurrentView();this.lastViewStates&&this.lastViewStates.zoom===t&&this.lastViewStates.minLng===e[0]&&this.lastViewStates.minLat===e[1]&&this.lastViewStates.maxLng===e[2]&&this.lastViewStates.maxLat===e[3]||(this.lastViewStates={zoom:t,minLng:e[0],minLat:e[1],maxLng:e[2],maxLat:e[3]},this.tilesetManager?.throttleUpdate(t,e))},this.viewchange=i_(this.mapchange,24),this.parent=e,this.tileLayerService=new ug({rendererService:this.rendererService,layerService:this.layerService,parent:e}),this.tilePickService=new bg({tileLayerService:this.tileLayerService,layerService:this.layerService,parent:e}),this.parent.setLayerPickService(this.tilePickService),this.proxy(e),this.initTileSetManager()}initTileSetManager(){let e=this.parent.getSource();if(this.tilesetManager=e.tileset,this.initedTileset||=(this.bindTilesetEvent(),!0),this.parent.isVisible()===!1)return;let{latLonBounds:t,zoom:n}=this.getCurrentView();this.tilesetManager?.update(n,t)}getCurrentView(){let e=this.mapService.getBounds();return{latLonBounds:[e[0][0],e[0][1],e[1][0],e[1][1]],zoom:this.mapService.getZoom()}}bindTilesetEvent(){this.tilesetManager.on(`tile-loaded`,e=>{}),this.tilesetManager.on(`tile-unload`,e=>{this.tileUnLoad(e)}),this.tilesetManager.on(`tile-error`,(e,t)=>{this.tileError(e)}),this.tilesetManager.on(`tile-update`,()=>{this.tileUpdate()}),this.mapService.on(`zoomend`,this.mapchange),this.mapService.on(`moveend`,this.viewchange)}render(){this.tileLayerService.render()}getLayers(){return this.tileLayerService.getLayers()}getTiles(){return this.tileLayerService.getTiles()}getTile(e){return this.tileLayerService.getTile(e)}tileLoaded(e){}tileError(e){console.warn(`error:`,e)}destroy(){this.mapService.off(`zoomend`,this.mapchange),this.mapService.off(`moveend`,this.viewchange),this.tilesetManager?.destroy(),this.tileLayerService.destroy()}reload(){this.tilesetManager.clear();let{latLonBounds:e,zoom:t}=this.getCurrentView();this.tilesetManager?.update(t,e)}tileUnLoad(e){this.tileLayerService.removeTile(e.key)}async tileUpdate(){if(!this.tilesetManager)return;let e=this.parent.getMinZoom(),t=this.parent.getMaxZoom(),n=this.tilesetManager.tiles.filter(n=>n.isLoaded&&n.isVisibleChange&&n.data&&n.z>=e&&n.z<t);await Promise.all(n.map(async e=>{if(this.tileLayerService.hasTile(e.key))this.tileLayerService.updateTileVisible(e),this.tilePickService.setPickState(),this.layerService.reRender();else{let t=new(e_(this.parent))(e,this.parent);await t.initTileLayer(),this.tilePickService.setPickState(),t.getLayers().length!==0&&(this.tileLayerService.addTile(t),this.tileLayerService.updateTileVisible(e),this.layerService.reRender())}})),this.tilesetManager.isLoaded&&this.parent.emit(`tiles-loaded`,this.tilesetManager.currentTiles)}setPickState(e){}pickRender(e){this.tilePickService.pickRender(e)}selectFeature(e){this.tilePickService.selectFeature(e)}highlightPickedFeature(e){this.tilePickService.highlightPickedFeature(e)}proxy(e){n_.forEach(t=>{let n=e[t].bind(e);e[t]=(...r)=>(n(...r),this.getLayers().map(e=>{e[t](...r)}),t===`style`&&this.getTiles().forEach(e=>e.styleUpdate(...r)),e)})}}})),s_,c_=t((()=>{$c(),s_=class extends Qc{constructor(...e){super(...e),this.type=`TileDebugLayer`,this.zIndex=1e4,this.defaultSourceConfig={data:[],options:{parser:{type:`testTile`}}}}async buildModels(){}}})),l_,u_=t((()=>{l_=`layout(std140) uniform commonUniforms {
  float u_opacity;
};
in vec3 vVertexNormal;
in float v_offset;
in vec4 v_Color;

#pragma include "scene_uniforms"
out vec4 outputColor;
void main() {
  // float intensity = pow(0.5 + dot(normalize(vVertexNormal), normalize(u_CameraPosition)), 3.0);
  float intensity = pow(v_offset + dot(normalize(vVertexNormal), normalize(u_CameraPosition)), 3.0);
  // 去除背面
  if (intensity > 1.0) intensity = 0.0;

  outputColor = vec4(v_Color.rgb, v_Color.a * intensity * u_opacity);
}
`})),d_,f_=t((()=>{d_=`layout(location = ATTRIBUTE_LOCATION_POSITION) in vec3 a_Position;
layout(location = ATTRIBUTE_LOCATION_COLOR) vec4 a_Color;
layout(location = ATTRIBUTE_LOCATION_NORMAL) in vec3 a_Normal;
layout(location = ATTRIBUTE_LOCATION_UV) in vec2 a_Uv;

layout(std140) uniform commonUniforms {
 float u_opacity;
};

#pragma include "scene_uniforms"
out vec3 vVertexNormal;
out vec4 v_Color;
out float v_offset;

void main() {
    float EARTH_RADIUS = 100.0;

    v_Color = a_Color;

    v_offset = min(((length(u_CameraPosition) - EARTH_RADIUS)/600.0) * 0.5 + 0.4, 1.0);
    vVertexNormal = a_Normal;

    gl_Position = u_ViewProjectionMatrix * u_ModelMatrix * vec4(a_Position, 1.0);
}
`})),p_,m_,h_=t((()=>{E(),D(),P(),F(),u_(),f_(),{isNumber:p_}=vt,m_=class extends N{get attributeLocation(){return Object.assign(super.attributeLocation,{MAX:super.attributeLocation.MAX,NORMAL:9,UV:10})}getCommonUniformsInfo(){let{opacity:e=1}=this.layer.getLayerConfig(),t={u_opacity:p_(e)?e:1};return this.getUniformsBufferInfo(t)}async initModels(){return this.initUniformsBuffer(),this.buildModels()}clearModels(){return``}async buildModels(){return this.layer.zIndex=-997,[await this.layer.buildLayerModel({moduleName:`earthAtmoSphere`,vertexShader:d_,fragmentShader:l_,defines:this.getDefines(),triangulation:Cu,depth:{enable:!1},blend:this.getBlend()})]}registerBuiltinAttributes(){this.styleAttributeService.registerStyleAttribute({name:`normal`,type:k.Attribute,descriptor:{name:`a_Normal`,shaderLocation:this.attributeLocation.NORMAL,buffer:{usage:m.STATIC_DRAW,data:[],type:m.FLOAT},size:3,update:(e,t,n,r,i)=>i}}),this.styleAttributeService.registerStyleAttribute({name:`uv`,type:k.Attribute,descriptor:{name:`a_Uv`,shaderLocation:this.attributeLocation.UV,buffer:{usage:m.DYNAMIC_DRAW,data:[],type:m.FLOAT},size:2,update:(e,t,n)=>[n[3],n[4]]}})}}})),g_,__=t((()=>{g_=`uniform sampler2D u_texture;

in vec2 v_texCoord;
in float v_lightWeight;
out vec4 outputColor;

void main() {
  vec4 color = texture(SAMPLER_2D(u_texture), vec2(v_texCoord.x, v_texCoord.y));
  color.xyz = color.xyz * v_lightWeight;
  outputColor = color;
}
`})),v_,y_=t((()=>{v_=`// attribute vec4 a_Color;
layout(location = ATTRIBUTE_LOCATION_POSITION) in vec3 a_Position;
layout(location = ATTRIBUTE_LOCATION_NORMAL) in vec3 a_Normal;
layout(location = ATTRIBUTE_LOCATION_UV) in vec2 a_Uv;

// attribute vec2 a_Extrude;
// attribute float a_Size;
// attribute float a_Shape;

layout(std140) uniform commonUniforms {
	vec4 u_sunLight: [1.0, -10.5, 12.0,0.0];
	float u_ambientRatio : 0.5;
	float u_diffuseRatio : 0.3;
	float u_specularRatio : 0.2;
};

#pragma include "scene_uniforms"

out vec2 v_texCoord;
out float v_lightWeight;

float calc_lighting(vec4 pos) {

	vec3 worldPos = vec3(pos * u_ModelMatrix);

	vec3 worldNormal = a_Normal;

	// cal light weight
	vec3 viewDir = normalize(u_CameraPosition - worldPos);

	vec3 lightDir = normalize(u_sunLight.xyz);

	vec3 halfDir = normalize(viewDir+lightDir);
	// lambert
	float lambert = dot(worldNormal, lightDir);
	// specular
	float specular = pow(max(0.0, dot(worldNormal, halfDir)), 32.0);
	//sum to light weight
	float lightWeight = u_ambientRatio + u_diffuseRatio * lambert + u_specularRatio * specular;

	return lightWeight;
}

void main() {

	v_texCoord = a_Uv;

	float lightWeight = calc_lighting(vec4(a_Position, 1.0));
	v_lightWeight = lightWeight;

	gl_Position = u_ViewProjectionMatrix * u_ModelMatrix * vec4(a_Position, 1.0);
}
`})),b_,x_=t((()=>{E(),P(),F(),__(),y_(),b_=class extends N{constructor(...e){super(...e),this.earthTime=3.4,this.sunX=1e3,this.sunY=1e3,this.sunZ=1e3,this.sunRadius=Math.sqrt(this.sunX*this.sunX+this.sunY*this.sunY+this.sunZ*this.sunZ)}get attributeLocation(){return Object.assign(super.attributeLocation,{MAX:super.attributeLocation.MAX,NORMAL:9,UV:10})}getCommonUniformsInfo(){let{animateOption:e,globalOptions:t}=this.layer.getLayerConfig();e?.enable&&(this.mapService.rotateY({reg:.002}),this.earthTime+=.02,this.sunY=10,this.sunX=Math.cos(this.earthTime)*(this.sunRadius-this.sunY),this.sunZ=Math.sin(this.earthTime)*(this.sunRadius-this.sunY));let n={u_sunLight:[this.sunX,this.sunY,this.sunZ,0],u_ambientRatio:t?.ambientRatio||.6,u_diffuseRatio:t?.diffuseRatio||.4,u_specularRatio:t?.specularRatio||.1};return this.textures=[this.texture],this.getUniformsBufferInfo(n)}setEarthTime(e){this.earthTime=e,this.sunY=10,this.sunX=Math.cos(this.earthTime)*(this.sunRadius-this.sunY),this.sunZ=Math.sin(this.earthTime)*(this.sunRadius-this.sunY),this.layerService.throttleRenderLayers()}async initModels(){let{globalOptions:e}=this.layer.getLayerConfig();e?.earthTime!==void 0&&this.setEarthTime(e.earthTime);let t=this.layer.getSource(),{createTexture2D:n}=this.rendererService;return this.texture=n({height:0,width:0}),t.data.images.then(e=>{this.texture=n({data:e[0],width:e[0].width,height:e[0].height}),this.textures=[this.texture],this.layerService.reRender()}),this.initUniformsBuffer(),this.buildModels()}clearModels(){return``}async buildModels(){return this.layer.zIndex=-998,[await this.layer.buildLayerModel({moduleName:`earthBase`,vertexShader:v_,fragmentShader:g_,defines:this.getDefines(),triangulation:Cu,depth:{enable:!0},blend:this.getBlend()})]}registerBuiltinAttributes(){this.styleAttributeService.registerStyleAttribute({name:`normal`,type:k.Attribute,descriptor:{name:`a_Normal`,shaderLocation:this.attributeLocation.NORMAL,buffer:{usage:m.STATIC_DRAW,data:[],type:m.FLOAT},size:3,update:(e,t,n,r,i)=>i}}),this.styleAttributeService.registerStyleAttribute({name:`uv`,type:k.Attribute,descriptor:{name:`a_Uv`,shaderLocation:this.attributeLocation.UV,buffer:{usage:m.DYNAMIC_DRAW,data:[],type:m.FLOAT},size:2,update:(e,t,n)=>[n[3],n[4]]}})}}})),S_,C_=t((()=>{S_=`in vec3 vVertexNormal;
in vec4 v_Color;

layout(std140) uniform commonUniforms {
  float u_opacity;
};
out vec4 outputColor;
#pragma include "scene_uniforms"
void main() {
  float intensity = -dot(normalize(vVertexNormal), normalize(u_CameraPosition));
  // 去除背面
  if (intensity > 1.0) intensity = 0.0;

  outputColor = vec4(v_Color.rgb, v_Color.a * intensity * u_opacity);
}
`})),w_,T_=t((()=>{w_=`layout(location = ATTRIBUTE_LOCATION_POSITION) in vec3 a_Position;
layout(location = ATTRIBUTE_LOCATION_COLOR) vec4 a_Color;
layout(location = ATTRIBUTE_LOCATION_NORMAL) in vec3 a_Normal;
layout(location = ATTRIBUTE_LOCATION_UV) in vec2 a_Uv;

layout(std140) uniform commonUniforms {
 float u_opacity;
};
#pragma include "scene_uniforms"

out vec3 vVertexNormal;
out vec4 v_Color;

void main() {
    v_Color = a_Color;

    vVertexNormal = a_Normal;

    gl_Position = u_ViewProjectionMatrix * u_ModelMatrix * vec4(a_Position, 1.0);
}
`})),E_,D_,O_=t((()=>{E(),D(),P(),F(),C_(),T_(),{isNumber:E_}=vt,D_=class extends N{get attributeLocation(){return Object.assign(super.attributeLocation,{MAX:super.attributeLocation.MAX,NORMAL:9,UV:10})}getCommonUniformsInfo(){let{opacity:e=1}=this.layer.getLayerConfig(),t={u_opacity:E_(e)?e:1};return this.getUniformsBufferInfo(t)}async initModels(){return this.initUniformsBuffer(),this.buildModels()}clearModels(){return``}async buildModels(){return this.layer.zIndex=-999,[await this.layer.buildLayerModel({moduleName:`earthBloom`,vertexShader:w_,fragmentShader:S_,defines:this.getDefines(),triangulation:wu,depth:{enable:!1},blend:this.getBlend()})]}registerBuiltinAttributes(){this.styleAttributeService.registerStyleAttribute({name:`normal`,type:k.Attribute,descriptor:{name:`a_Normal`,shaderLocation:this.attributeLocation.NORMAL,buffer:{usage:m.STATIC_DRAW,data:[],type:m.FLOAT},size:3,update:(e,t,n,r,i)=>i}}),this.styleAttributeService.registerStyleAttribute({name:`uv`,type:k.Attribute,descriptor:{name:`a_Uv`,shaderLocation:this.attributeLocation.UV,buffer:{usage:m.DYNAMIC_DRAW,data:[],type:m.FLOAT},size:2,update:(e,t,n)=>[n[3],n[4]]}})}}})),k_,A_,j_,M_=t((()=>{$c(),h_(),x_(),O_(),k_={base:b_,atomSphere:m_,bloomSphere:D_},A_=[`base`,`atomSphere`,`bloomSphere`],j_=class extends Qc{constructor(...e){super(...e),this.type=`EarthLayer`,this.defaultSourceConfig={data:[],options:{parser:{type:`json`}}}}async buildModels(){let e=this.getModelType();this.layerModel=new k_[e](this),await this.initLayerModels()}setEarthTime(e){this.layerModel&&this.layerModel.setEarthTime?this.layerModel.setEarthTime(e):console.warn(`请在 scene loaded 之后执行该方法！`)}getModelType(){let e=this.shapeOption?.field||`base`;return A_.indexOf(e)<0&&(e=`base`),e}}})),N_=t((()=>{El(),Iu(),$c(),P(),id(),Gd(),tf(),mp(),qm(),Vh(),lg(),o_(),c_(),M_(),rs(),Vg(),yl()})),P_,F_,I_,L_=t((()=>{D(),P_=e(qt()),F_=[`selectstart`,`selecting`,`selectend`],I_=class extends P_.EventEmitter{constructor(e,t={}){super(),this.isEnable=!1,this.onDragStart=e=>{e.target&&e.stopPropagation&&e.stopPropagation(),this.box.style.display=`block`,this.startEvent=this.endEvent=e,this.syncBoxBound(),this.emit(`selectstart`,this.getLngLatBox(),this.startEvent,this.endEvent)},this.onDragging=e=>{e.target&&e.stopPropagation&&e.stopPropagation(),this.endEvent=e,this.syncBoxBound(),this.emit(`selecting`,this.getLngLatBox(),this.startEvent,this.endEvent)},this.onDragEnd=e=>{e.target&&e.stopPropagation&&e.stopPropagation(),this.endEvent=e,this.box.style.display=`none`,this.emit(`selectend`,this.getLngLatBox(),this.startEvent,this.endEvent)},this.scene=e,this.options=t}get container(){return this.scene.getMapService().getMarkerContainer()}enable(){if(this.isEnable)return;let{className:e}=this.options;if(this.scene.setMapStatus({dragEnable:!1}),this.container.style.cursor=`crosshair`,!this.box){let t=j(`div`,void 0,this.container);t.classList.add(`l7-select-box`),e&&t.classList.add(e),t.style.display=`none`,this.box=t}this.scene.on(`dragstart`,this.onDragStart),this.scene.on(`dragging`,this.onDragging),this.scene.on(`dragend`,this.onDragEnd),this.isEnable=!0}disable(){this.isEnable&&=(this.scene.setMapStatus({dragEnable:!0}),this.container.style.cursor=`auto`,this.scene.off(`dragstart`,this.onDragStart),this.scene.off(`dragging`,this.onDragging),this.scene.off(`dragend`,this.onDragEnd),!1)}syncBoxBound(){let{x:e,y:t}=this.startEvent,{x:n,y:r}=this.endEvent,i=Math.min(e,n),a=Math.min(t,r),o=Math.abs(e-n),s=Math.abs(t-r);this.box.style.top=`${a}px`,this.box.style.left=`${i}px`,this.box.style.width=`${o}px`,this.box.style.height=`${s}px`}getLngLatBox(){let{lngLat:{lng:e,lat:t}}=this.startEvent,{lngLat:{lng:n,lat:r}}=this.endEvent;return Fe([[e,t],[n,r]])}}})),R_,z_,B_=t((()=>{D(),R_=e(qt()),z_=class extends R_.EventEmitter{getMarkerLayerContainerSize(){}constructor(e){super(),this.added=!1,this.preLngLat={lng:0,lat:0},this.visible=!0,this.onMarkerDragStart=e=>{let t=this.mapsService.getContainer();if(!t)return;this.mapsService.setMapStatus({dragEnable:!1,zoomEnable:!1});let{left:n,top:r}=t.getClientRects()[0],{x:i,y:a}=e;this.preLngLat=this.mapsService.containerToLngLat([i-n,a-r]),this.mapsService.on(`mousemove`,this.onMarkerDragMove),document.addEventListener(`mouseup`,this.onMarkerDragEnd),this.emit(`dragstart`,this.lngLat)},this.onMarkerDragMove=e=>{let t=e.lngLat||e.lnglat,{lng:n,lat:r}=this.preLngLat,{lng:i,lat:a}=t,o={lng:this.lngLat.lng+i-n,lat:this.lngLat.lat+a-r};this.setLnglat(o),this.preLngLat=t,this.emit(`dragging`,o)},this.onMarkerDragEnd=()=>{this.mapsService.setMapStatus({dragEnable:!0,zoomEnable:!0}),this.mapsService.off(`mousemove`,this.onMarkerDragMove),document.removeEventListener(`mouseup`,this.onMarkerDragEnd),this.emit(`dragend`,this.lngLat)},this.eventHandle=e=>{this.polyfillEvent(e),this.emit(e.type,{target:e,data:this.markerOption.extData,lngLat:this.lngLat})},this.markerOption={...this.getDefault(),...e},ze([`update`,`onMove`,`onMapClick`,`updatePositionWhenZoom`],this),this.init()}getDefault(){return{element:void 0,anchor:we.BOTTOM,offsets:[0,0],color:`#5B8FF9`,draggable:!1,overflowHide:!0}}addTo(e){this.scene=e,this.mapsService=e.mapService;let{element:t}=this.markerOption;return this.mapsService.getMarkerContainer().appendChild(t),this.registerMarkerEvent(t),this.update(),this.updateDraggable(),this.added=!0,this.emit(`added`),this}remove(){this.mapsService,this.unRegisterMarkerEvent(),this.removeAllListeners();let{element:e}=this.markerOption;return e&&jt(e),this.popup&&this.popup.remove(),this}hide(){let{element:e}=this.markerOption;return e&&(e.style.display=`none`),this.visible=!1,this}show(){let{element:e}=this.markerOption;return e&&(e.style.display=`block`),this.visible=!0,this.update(),this}setLnglat(e){return this.lngLat=e,Array.isArray(e)&&(this.lngLat={lng:e[0],lat:e[1]}),this.popup&&this.popup.setLnglat(this.lngLat),this.update(),this}getLnglat(){return this.lngLat}getElement(){return this.markerOption.element}setElement(e){if(!this.added)return this.once(`added`,()=>{this.setElement(e)}),this;let{element:t}=this.markerOption;return t&&jt(t),this.markerOption.element=e,this.init(),this.mapsService.getMarkerContainer().appendChild(e),this.registerMarkerEvent(e),this.updateDraggable(),this.update(),this}openPopup(){if(!this.added)return this.once(`added`,()=>{this.openPopup()}),this;let e=this.popup;return e&&(e.isOpen()||e.addTo(this.scene)),this}closePopup(){this.added||this.once(`added`,()=>{this.closePopup()});let e=this.popup;return e&&e.remove(),this}setPopup(e){return this.popup=e,this.lngLat&&this.popup.setLnglat(this.lngLat),this}togglePopup(){let e=this.popup;if(e)e.isOpen()?e.remove():e.addTo(this.scene);else return this;return this}getPopup(){return this.popup}getOffset(){return this.markerOption.offsets}setDraggable(e){this.markerOption.draggable=e,this.updateDraggable()}getDraggable(){return this.markerOption.draggable}getExtData(){return this.markerOption.extData}setExtData(e){this.markerOption.extData=e}update(){if(!this.mapsService)return;let{element:e,anchor:t}=this.markerOption;this.updatePosition(),ht(e,`${_e[t]}`)}updatePositionWhenZoom(e){if(!this.mapsService)return;let{element:t,offsets:n}=this.markerOption,{lng:r,lat:i}=this.lngLat;if(this.visible&&t){t.style.display=`block`,t.style.whiteSpace=`nowrap`;let{containerHeight:a,containerWidth:o,bounds:s}=this.getMarkerLayerContainerSize()||this.getCurrentContainerSize();if(!s)return;let c=e.map,l=e.center,u=e.zoom,d=c.DE(this.lngLat,u,l);d.x=Math.round(d.x+n[0]),d.y=Math.round(d.y-n[1]),(Math.abs(s[0][0])>180||Math.abs(s[1][0])>180)&&(d.x>o&&(d.x=this.mapsService.lngLatToContainer([r-360,i]).x),d.x<0&&(d.x=this.mapsService.lngLatToContainer([r+360,i]).x)),(d.x>o||d.x<0||d.y>a||d.y<0)&&(t.style.display=`none`),t.style.left=d.x+`px`,t.style.top=d.y+`px`,t.style.transition=`left 0.25s cubic-bezier(0,0,0.25,1), top 0.25s cubic-bezier(0,0,0.25,1)`}}onMapClick(e){let{element:t}=this.markerOption;this.popup&&t&&this.togglePopup()}getCurrentContainerSize(){let e=this.mapsService.getContainer();return{containerHeight:e?.scrollHeight||0,containerWidth:e?.scrollWidth||0,bounds:this.mapsService.getBounds()}}updateDraggable(){let{element:e}=this.markerOption;e?.removeEventListener(`mousedown`,this.onMarkerDragStart),this.mapsService.off(`mousemove`,this.onMarkerDragMove),document.removeEventListener(`mouseup`,this.onMarkerDragEnd),this.markerOption.draggable&&e?.addEventListener(`mousedown`,this.onMarkerDragStart)}updatePosition(){if(!this.mapsService)return;let{element:e,offsets:t}=this.markerOption,{lng:n,lat:r}=this.lngLat,i=this.mapsService.lngLatToContainer([n,r]);if(!this.visible)e&&(e.style.display=`none`);else if(e){e.style.display=`block`,e.style.whiteSpace=`nowrap`;let{containerHeight:a,containerWidth:o,bounds:s}=this.getMarkerLayerContainerSize()||this.getCurrentContainerSize();if(!s)return;(Math.abs(s[0][0])>180||Math.abs(s[1][0])>180)&&(i.x>o&&(i.x=this.mapsService.lngLatToContainer([n-360,r]).x),i.x<0&&(i.x=this.mapsService.lngLatToContainer([n+360,r]).x)),this.markerOption.overflowHide&&(i.x>o||i.x<0||i.y>a||i.y<0)&&(e.style.display=`none`),e.style.left=i.x+t[0]+`px`,e.style.top=i.y-t[1]+`px`}}init(){let{element:e}=this.markerOption,{color:t,anchor:n}=this.markerOption;if(!e){e=j(`div`),this.markerOption.element=e;let n=document.createElementNS(`http://www.w3.org/2000/svg`,`svg`);n.setAttributeNS(null,`display`,`block`),n.setAttributeNS(null,`height`,`48px`),n.setAttributeNS(null,`width`,`48px`),n.setAttributeNS(null,`viewBox`,`0 0 1024 1024`);let r=document.createElementNS(`http://www.w3.org/2000/svg`,`path`);r.setAttributeNS(null,`d`,`M512 490.666667C453.12 490.666667 405.333333 442.88 405.333333 384 405.333333 325.12 453.12 277.333333 512 277.333333 570.88 277.333333 618.666667 325.12 618.666667 384 618.666667 442.88 570.88 490.666667 512 490.666667M512 85.333333C346.88 85.333333 213.333333 218.88 213.333333 384 213.333333 608 512 938.666667 512 938.666667 512 938.666667 810.666667 608 810.666667 384 810.666667 218.88 677.12 85.333333 512 85.333333Z`),r.setAttributeNS(null,`fill`,t),n.appendChild(r),e.appendChild(n)}Ee(e,`l7-marker`),Object.keys(this.markerOption.style||{}).forEach(t=>{let n=this.markerOption?.style&&this.markerOption?.style[t];e&&(e.style[t]=n)}),b(e,n,`marker`)}registerMarkerEvent(e){e.addEventListener(`click`,this.onMapClick),e.addEventListener(`mousemove`,this.eventHandle),e.addEventListener(`click`,this.eventHandle),e.addEventListener(`mousedown`,this.eventHandle),e.addEventListener(`mouseup`,this.eventHandle),e.addEventListener(`dblclick`,this.eventHandle),e.addEventListener(`contextmenu`,this.eventHandle),e.addEventListener(`mouseover`,this.eventHandle),e.addEventListener(`mouseout`,this.eventHandle),e.addEventListener(`touchstart`,this.eventHandle),e.addEventListener(`touchend`,this.eventHandle)}unRegisterMarkerEvent(){let e=this.getElement();e.removeEventListener(`click`,this.onMapClick),e.removeEventListener(`mousemove`,this.eventHandle),e.removeEventListener(`click`,this.eventHandle),e.removeEventListener(`mousedown`,this.eventHandle),e.removeEventListener(`mouseup`,this.eventHandle),e.removeEventListener(`dblclick`,this.eventHandle),e.removeEventListener(`contextmenu`,this.eventHandle),e.removeEventListener(`mouseover`,this.eventHandle),e.removeEventListener(`mouseout`,this.eventHandle),e.removeEventListener(`touchstart`,this.eventHandle),e.removeEventListener(`touchend`,this.eventHandle)}polyfillEvent(e){this.mapsService&&this.mapsService.getType()===`amap`&&(Ye()||(e.type===`touchstart`&&(this.touchStartTime=Date.now()),e.type===`touchend`&&Date.now()-this.touchStartTime<300&&this.emit(`click`,{target:e,data:this.markerOption.extData,lngLat:this.lngLat})))}}})),V_,H_,U_,W_,G_=t((()=>{D(),V_=e(qt()),H_=e(wr()),B_(),{merge:U_}=vt,W_=class extends V_.EventEmitter{constructor(e){super(),this.markers=[],this.points=[],this.clusterMarkers=[],this.markerLayerOption=U_(this.getDefault(),e),ze([`update`],this),this.zoom=this.markerLayerOption.clusterOption?.zoom||-99}getDefault(){return{cluster:!1,clusterOption:{radius:80,maxZoom:20,minZoom:0,zoom:-99,style:{},className:``}}}addTo(e){return this.scene=e,this.mapsService=e.mapService,this.markerLayerOption.cluster&&(this.initCluster(),this.update(),this.mapsService.on(`camerachange`,this.update),this.mapsService.on(`viewchange`,this.update)),this.mapsService.on(`camerachange`,this.updateMarkers.bind(this)),this.mapsService.on(`viewchange`,this.updateMarkers.bind(this)),this.mapsService.on(`camerachange`,this.setContainerSize.bind(this)),this.mapsService.on(`viewchange`,this.setContainerSize.bind(this)),this.addMarkers(),this.inited=!0,this}setContainerSize(){if(!this.mapsService)return;let e=this.mapsService.getContainer();this.containerSize={containerWidth:e?.scrollWidth||0,containerHeight:e?.scrollHeight||0,bounds:this.mapsService.getBounds()}}getContainerSize(){return this.containerSize}addMarker(e){let t=this.markerLayerOption.cluster;e.getMarkerLayerContainerSize=this.getContainerSize.bind(this);try{let t=this.markerLayerOption.markerOption;if(t&&e&&typeof e.getElement==`function`){let n=e.getElement();if(n){if(t.className)try{Ee(n,t.className)}catch{n.className=`${n.className||``} ${t.className}`.trim()}if(t.style&&typeof t.style==`object`&&Object.keys(t.style).forEach(e=>{try{n.style[e]=t.style[e]}catch{}}),t.color)try{let e=n.querySelector?n.querySelector(`path`):null;e&&typeof e.setAttribute==`function`?e.setAttribute(`fill`,t.color):n.style.background=t.color}catch{}}}}catch{}if(t&&(this.addPoint(e,this.markers.length),this.mapsService)){let e=this.mapsService.getZoom(),t=this.mapsService.getBounds();this.bbox=Ce(t,.5),this.zoom=Math.floor(e),this.getClusterMarker(this.bbox,this.zoom)}this.markers.push(e);try{this.inited&&this.scene&&typeof e.addTo==`function`&&(this.markerLayerOption.cluster||e.addTo(this.scene))}catch{}}removeMarker(e){this.markers.indexOf(e);let t=this.markers.indexOf(e);if(t>-1){try{typeof e.remove==`function`&&e.remove()}catch{}this.markers.splice(t,1),this.markerLayerOption.cluster&&(this.removePoint(t),this.mapsService&&this.getClusterMarker(this.bbox,this.zoom))}}hide(){this.markers.forEach(e=>{try{typeof e.hide==`function`?e.hide():e.getElement().style.display=`none`}catch{}}),this.clusterMarkers.forEach(e=>{try{typeof e.hide==`function`?e.hide():e.getElement().style.display=`none`}catch{}})}show(){this.markers.forEach(e=>{try{typeof e.show==`function`?e.show():e.getElement().style.display=`block`}catch{}}),this.clusterMarkers.forEach(e=>{try{typeof e.show==`function`?e.show():e.getElement().style.display=`block`}catch{}})}getMarkers(){return this.markerLayerOption.cluster?this.clusterMarkers:this.markers}getOriginMarkers(){return this.markers}addMarkers(){this.getMarkers().forEach(e=>{e.addTo(this.scene)})}clear(){this.markers.forEach(e=>{e.remove()}),this.clusterMarkers.forEach(e=>{e.remove()}),this.markers=[],this.points=[],this.clusterMarkers=[]}destroy(){this.clear(),this.removeAllListeners(),this.mapsService.off(`camerachange`,this.update),this.mapsService.off(`viewchange`,this.update),this.mapsService.off(`camerachange`,this.setContainerSize.bind(this)),this.mapsService.off(`viewchange`,this.setContainerSize.bind(this)),this.mapsService.off(`camerachange`,this.updateMarkers.bind(this)),this.mapsService.off(`viewchange`,this.updateMarkers.bind(this))}updateMarkers(){try{this.markers.forEach(e=>{e&&typeof e.update==`function`&&e.update()}),this.clusterMarkers.forEach(e=>{e&&typeof e.update==`function`&&e.update()})}catch{}}addPoint(e,t){let{lng:n,lat:r}=e.getLnglat(),i={geometry:{type:`Point`,coordinates:[n,r]},properties:{...e.getExtData(),marker_id:t}};this.points.push(i),this.clusterIndex&&this.clusterIndex.load(this.points)}removePoint(e){let t=this.points.findIndex(t=>t.properties.marker_id===e);t>-1&&this.points.splice(t,1),this.clusterIndex&&this.clusterIndex.load(this.points)}initCluster(){if(!this.markerLayerOption.cluster)return;let{radius:e,minZoom:t=0,maxZoom:n}=this.markerLayerOption.clusterOption;this.clusterIndex=new H_.default({radius:e,minZoom:t,maxZoom:n}),this.clusterIndex.load(this.points)}getClusterMarker(e,t){let n=e[0].concat(e[1]),r=this.clusterIndex.getClusters(n,t);this.clusterMarkers.forEach(e=>{e.remove()}),this.clusterMarkers=[],r.forEach(e=>{let{field:t,method:n}=this.markerLayerOption.clusterOption;if(e.properties?.cluster_id){let r=this.getLeaves(e.properties?.cluster_id);if(e.properties.clusterData=r,t&&n){let i=r?.map(e=>({[t]:e.properties[t]})),a=ce(i,t),o=Xe(n,a),s=`point_`+n;e.properties[s]=o.toFixed(2)}}let r=this.clusterMarker(e);try{let e=r;e&&typeof e.on==`function`&&e.on(`click`,t=>{try{this.emit(`marker:click`,{marker:e,data:e.getExtData?e.getExtData():null,lngLat:e.getLnglat?e.getLnglat():null,originalEvent:t})}catch{}})}catch{}this.clusterMarkers.push(r),r.addTo(this.scene)})}getLeaves(e,t=1/0,n=0){return e?this.clusterIndex.getLeaves(e,t,n):null}clusterMarker(e){let{element:t=this.generateElement.bind(this)}=this.markerLayerOption.clusterOption,n=e.properties?.point_count;if(n===void 0&&e.properties?.cluster_id&&(n=(this.getLeaves(e.properties.cluster_id,1/0,0)||[]).length),(n===1||n===`1`)&&e.properties){let t=null;if(e.properties.cluster_id){let n=this.getLeaves(e.properties.cluster_id,1,0);t=n&&n[0]}else e.properties.marker_id!==void 0&&(t=e);if(t&&t.properties&&typeof t.properties.marker_id==`number`){let n=this.normalMarker(t);if(n){try{e&&e.properties&&typeof n.setExtData==`function`&&n.setExtData(e.properties)}catch{}return n}}}let r;r=typeof t==`function`?t(e):t;let i=new z_({element:r}).setLnglat({lng:e.geometry.coordinates[0],lat:e.geometry.coordinates[1]});return e&&e.properties&&i.setExtData(e.properties),i}normalMarker(e){let t=e.properties.marker_id;return this.markers[t]}update(){if(!this.mapsService||this.markers.length===0)return;let e=this.mapsService.getZoom(),t=this.mapsService.getBounds();(!this.bbox||Math.abs(e-this.zoom)>=1||!$e(this.bbox,t))&&(this.bbox=Ce(t,.5),this.zoom=Math.floor(e),this.getClusterMarker(this.bbox,this.zoom))}generateElement(e){let t=j(`div`,`l7-marker-cluster`),n=j(`div`,``,t),r=j(`span`,``,n),{field:i,method:a}=this.markerLayerOption.clusterOption;return e.properties.point_count=e.properties.point_count||1,r.textContent=i&&a?e.properties[`point_`+a]||e.properties[i]:e.properties.point_count,t}}}));function K_(){if(typeof document>`u`||J_)return;if(document.getElementById(`__l7_iconfont_svg__`)){J_=!0;return}let e=document.createElement(`div`);e.innerHTML=q_;let t=e.getElementsByTagName(`svg`)[0];if(t){t.setAttribute(`aria-hidden`,`true`),t.style.position=`absolute`,t.style.width=`0`,t.style.height=`0`,t.style.overflow=`hidden`,t.id=`__l7_iconfont_svg__`;let e=document.body;e?e.insertBefore(t,e.firstChild):document.addEventListener(`DOMContentLoaded`,()=>{document.getElementById(`__l7_iconfont_svg__`)||document.body.insertBefore(t,document.body.firstChild)}),J_=!0}}var q_,J_,Y_=t((()=>{q_=`<svg><symbol id="l7-icon-area1" viewBox="0 0 1024 1024"><path d="M796.444444 56.888889a113.777778 113.777778 0 0 1 43.064889 219.136l38.798223 466.261333a113.777778 113.777778 0 1 1-133.518223 145.237334H279.210667a113.777778 113.777778 0 1 1-60.302223-137.272889L697.856 227.555556A113.777778 113.777778 0 0 1 796.444444 56.888889z m56.888889 750.933333a45.511111 45.511111 0 1 0 0 91.022222 45.511111 45.511111 0 0 0 0-91.022222z m-682.666666 0a45.511111 45.511111 0 1 0 0 91.022222 45.511111 45.511111 0 0 0 0-91.022222z m577.592889-534.072889L269.198222 796.444444c4.152889 7.168 7.509333 14.791111 10.012445 22.812445h465.578666a114.119111 114.119111 0 0 1 65.479111-71.224889l-38.798222-466.261333a112.924444 112.924444 0 0 1-23.210666-7.964445zM796.444444 125.155556a45.511111 45.511111 0 1 0 0 91.022222 45.511111 45.511111 0 0 0 0-91.022222z"  ></path></symbol><symbol id="l7-icon-area" viewBox="0 0 1024 1024"><path d="M796.444444 56.888889a113.777778 113.777778 0 0 1 43.008 219.136l38.855112 466.261333a113.777778 113.777778 0 0 1-16.497778 224.540445L853.333333 967.111111a113.777778 113.777778 0 0 1-108.544-79.644444H279.210667a113.834667 113.834667 0 0 1-100.067556 79.36L170.666667 967.111111a113.777778 113.777778 0 0 1-17.066667-226.304l30.492444-351.175111a113.777778 113.777778 0 0 1 34.986667-218.680889L227.555556 170.666667a113.777778 113.777778 0 0 1 99.896888 59.221333l355.84-71.395556a113.777778 113.777778 0 0 1 104.675556-101.262222L796.444444 56.888889z m56.888889 750.933333a45.511111 45.511111 0 1 0 0 91.022222 45.511111 45.511111 0 0 0 0-91.022222z m-682.666666 0a45.511111 45.511111 0 1 0 0 91.022222 45.511111 45.511111 0 0 0 0-91.022222z m526.051555-582.314666L340.650667 296.903111a113.891556 113.891556 0 0 1-88.462223 98.645333l-30.947555 355.84c27.477333 13.653333 48.64 38.115556 58.026667 67.754667h465.521777a114.119111 114.119111 0 0 1 65.536-71.168l-38.855111-466.261333a113.948444 113.948444 0 0 1-74.752-56.206222zM227.555556 238.933333a45.511111 45.511111 0 1 0 0 91.022223 45.511111 45.511111 0 0 0 0-91.022223z m568.888888-113.777777a45.511111 45.511111 0 1 0 0 91.022222 45.511111 45.511111 0 0 0 0-91.022222z"  ></path></symbol><symbol id="l7-icon-delete" viewBox="0 0 1024 1024"><path d="M705.422222 85.333333a34.133333 34.133333 0 0 1 34.133334 34.133334V227.555556h136.533333a34.133333 34.133333 0 0 1 0 68.266666h-25.543111l-24.348445 610.076445a34.133333 34.133333 0 0 1-34.133333 32.768H231.936a34.133333 34.133333 0 0 1-34.076444-32.768L173.340444 295.822222H147.911111a34.133333 34.133333 0 1 1 0-68.266666H284.444444V119.466667a34.133333 34.133333 0 0 1 34.133334-34.133334h386.844444zM241.720889 295.822222l22.983111 574.577778h494.535111l23.04-574.577778H241.720889zM671.288889 153.6H352.711111V227.555556h318.577778V153.6z"  ></path></symbol><symbol id="l7-icon-color" viewBox="0 0 1024 1024"><path d="M512 56.888889c9.841778 0 19.626667 0.341333 29.354667 0.910222 69.176889 4.437333 119.068444 62.577778 124.302222 131.072l0.455111 9.386667c0.739556 44.600889 15.303111 84.935111 44.999111 114.631111 27.022222 27.022222 62.805333 41.528889 102.570667 44.430222l12.060444 0.568889c72.476444 1.194667 135.793778 52.451556 140.458667 124.757333 1.137778 18.261333 1.251556 36.807111 0.170667 55.637334-13.198222 233.585778-211.399111 424.220444-445.326223 428.714666L512 967.111111a455.111111 455.111111 0 0 1-455.054222-464.156444c4.551111-233.927111 195.185778-432.128 428.771555-445.326223C494.535111 57.116444 503.296 56.888889 512 56.888889z m0 68.266667a385.706667 385.706667 0 0 0-22.414222 0.625777C291.726222 136.988444 129.080889 305.948444 125.155556 504.263111c-4.152889 212.366222 163.100444 387.185778 372.508444 394.353778l13.425778 0.227555 8.533333-0.113777c198.371556-3.811556 367.331556-166.456889 378.538667-364.373334a396.174222 396.174222 0 0 0-0.170667-47.331555c-1.991111-31.232-29.127111-56.604444-67.128889-60.472889l-8.248889-0.455111-14.051555-0.682667c-56.547556-4.209778-107.406222-25.884444-145.806222-64.284444-38.855111-38.798222-60.416-90.225778-64.284445-145.749334l-0.910222-21.333333c-2.901333-38.001778-28.785778-66.048-60.302222-68.096A433.891556 433.891556 0 0 0 512 125.155556zM438.044444 682.666667a68.266667 68.266667 0 1 1 0 136.533333 68.266667 68.266667 0 0 1 0-136.533333z m-170.666666-227.555556a68.266667 68.266667 0 1 1 0 136.533333 68.266667 68.266667 0 0 1 0-136.533333z m142.222222-227.555555a68.266667 68.266667 0 1 1 0 136.533333 68.266667 68.266667 0 0 1 0-136.533333z"  ></path></symbol><symbol id="l7-icon-base-map" viewBox="0 0 1024 1024"><path d="M923.761778 115.029333A34.133333 34.133333 0 0 1 967.111111 147.911111v624.128a34.133333 34.133333 0 0 1-22.186667 32.028445l-278.755555 103.992888a34.133333 34.133333 0 0 1-23.665778 0.056889L381.724444 812.714667a34.133333 34.133333 0 0 0-23.665777 0.113777L102.968889 908.060444a34.133333 34.133333 0 0 1-45.738667-26.965333L56.888889 876.088889V251.960889a34.133333 34.133333 0 0 1 22.186667-32.028445l278.755555-103.992888a34.133333 34.133333 0 0 1 20.992-0.967112l266.183111 72.988445a34.133333 34.133333 0 0 0 18.204445 0zM403.911111 192.625778v555.576889l216.177778 79.075555V251.960889l-216.177778-59.335111z m-68.266667 4.380444L125.155556 275.569778v551.310222l210.432-78.506667V197.006222zM898.844444 192.853333l-210.545777 58.936889v575.089778l210.545777-78.563556V192.853333z"  ></path></symbol><symbol id="l7-icon-dot" viewBox="0 0 1024 1024"><path d="M341.333333 739.555556a113.777778 113.777778 0 0 1 8.533334 227.271111L341.333333 967.111111a113.777778 113.777778 0 0 1-8.533333-227.271111L341.333333 739.555556z m0 68.266666a45.511111 45.511111 0 1 0 0 91.022222 45.511111 45.511111 0 0 0 0-91.022222zM910.222222 341.333333a113.777778 113.777778 0 0 1 8.533334 227.271111L910.222222 568.888889a113.777778 113.777778 0 0 1-8.533333-227.271111L910.222222 341.333333z m0 68.266667a45.511111 45.511111 0 1 0 0 91.022222 45.511111 45.511111 0 0 0 0-91.022222zM227.555556 56.888889a113.777778 113.777778 0 0 1 8.533333 227.271111L227.555556 284.444444a113.777778 113.777778 0 0 1-8.533334-227.271111L227.555556 56.888889z m0 68.266667a45.511111 45.511111 0 1 0 0 91.022222 45.511111 45.511111 0 0 0 0-91.022222z"  ></path></symbol><symbol id="l7-icon-display" viewBox="0 0 1024 1024"><path d="M512 170.666667c284.444444 0 455.111111 227.555556 455.111111 341.333333s-170.666667 341.333333-455.111111 341.333333-455.111111-227.555556-455.111111-341.333333 170.666667-341.333333 455.111111-341.333333z m0 68.266666C303.729778 238.933333 125.155556 401.237333 125.155556 512c0 110.762667 178.574222 273.066667 386.844444 273.066667s386.844444-162.304 386.844444-273.066667c0-110.762667-178.574222-273.066667-386.844444-273.066667zM512 341.333333a170.666667 170.666667 0 1 1 0 341.333334 170.666667 170.666667 0 0 1 0-341.333334z m0 68.266667a102.4 102.4 0 1 0 0 204.8 102.4 102.4 0 0 0 0-204.8z"  ></path></symbol><symbol id="l7-icon-enlarge" viewBox="0 0 1024 1024"><path d="M546.133333 147.911111l-0.056889 329.955556H876.088889a34.133333 34.133333 0 0 1 0 68.266666H546.076444v329.955556a34.133333 34.133333 0 0 1-68.266666 0V546.133333H147.911111a34.133333 34.133333 0 1 1 0-68.266666h329.898667V147.911111a34.133333 34.133333 0 0 1 68.266666 0z"  ></path></symbol><symbol id="l7-icon-export-picture" viewBox="0 0 1024 1024"><path d="M883.873684 161.684211a32.336842 32.336842 0 0 1 32.336842 32.336842v582.063158a32.336842 32.336842 0 0 1-32.336842 32.336842H86.231579a32.336842 32.336842 0 0 1-32.336842-32.336842V194.021053a32.336842 32.336842 0 0 1 32.336842-32.336842h797.642105z m-32.336842 64.673684H118.568421v517.389473h170.792421a32.175158 32.175158 0 0 1 0.431158-0.646736l3.772632-4.473264 330.320842-330.374736a32.336842 32.336842 0 0 1 38.588631-5.389474l4.473263 3.018105 184.589474 147.725474V226.357895z m-202.428631 248.131368L379.850105 743.747368H851.536842v-107.304421l-202.428631-161.953684zM323.368421 323.368421a107.789474 107.789474 0 1 1 0 215.578947 107.789474 107.789474 0 0 1 0-215.578947z m0 64.673684a43.115789 43.115789 0 1 0 0 86.231579 43.115789 43.115789 0 0 0 0-86.231579z"  ></path></symbol><symbol id="l7-icon-exit-fullscreen" viewBox="0 0 1024 1024"><path d="M841.955556 591.644444a34.133333 34.133333 0 0 1 5.518222 67.811556l-5.518222 0.455111h-133.745778l192 192.056889a34.133333 34.133333 0 0 1-38.343111 55.182222l-5.176889-2.958222-4.721778-3.982222L659.911111 708.266667V841.955556a34.133333 34.133333 0 0 1-28.615111 33.678222L625.777778 876.088889a34.133333 34.133333 0 0 1-33.678222-28.615111L591.644444 841.955556V625.777778a34.133333 34.133333 0 0 1 28.615112-33.678222L625.777778 591.644444h216.177778z m-443.733334 0a34.133333 34.133333 0 0 1 33.678222 28.615112L432.355556 625.777778v216.177778a34.133333 34.133333 0 0 1-67.811556 5.518222L364.088889 841.955556v-133.745778l-192.056889 192a34.133333 34.133333 0 0 1-52.224-43.52l3.982222-4.721778L315.847111 659.911111H182.044444a34.133333 34.133333 0 0 1-33.678222-28.615111L147.911111 625.777778a34.133333 34.133333 0 0 1 28.615111-33.678222L182.044444 591.644444H398.222222zM167.310222 119.808l4.721778 3.982222L364.088889 315.847111V182.044444a34.133333 34.133333 0 0 1 28.615111-33.678222L398.222222 147.911111a34.133333 34.133333 0 0 1 33.678222 28.615111L432.355556 182.044444V398.222222a34.133333 34.133333 0 0 1-28.615112 33.678222L398.222222 432.355556H182.044444a34.133333 34.133333 0 0 1-5.518222-67.811556L182.044444 364.088889h133.802667L123.790222 172.032a34.133333 34.133333 0 0 1 43.52-52.224z m732.899556 3.982222a34.133333 34.133333 0 0 1 3.982222 43.52l-3.982222 4.721778L708.266667 364.088889H841.955556a34.133333 34.133333 0 0 1 33.678222 28.615111L876.088889 398.222222a34.133333 34.133333 0 0 1-28.615111 33.678222L841.955556 432.355556H625.777778a34.133333 34.133333 0 0 1-33.678222-28.615112L591.644444 398.222222V182.044444a34.133333 34.133333 0 0 1 67.811556-5.518222l0.455111 5.518222v133.802667l192.056889-192.056889a34.133333 34.133333 0 0 1 48.241778 0z"  ></path></symbol><symbol id="l7-icon-line" viewBox="0 0 1024 1024"><path d="M853.333333 56.888889a113.777778 113.777778 0 0 1 8.533334 227.271111L853.333333 284.444444c-19.000889 0-36.864-4.664889-52.622222-12.856888l-529.123555 529.066666a113.777778 113.777778 0 0 1-92.387556 166.115556L170.666667 967.111111a113.777778 113.777778 0 0 1-8.533334-227.271111L170.666667 739.555556c19.000889 0 36.864 4.664889 52.622222 12.856888l529.123555-529.066666a113.777778 113.777778 0 0 1 92.387556-166.115556L853.333333 56.888889zM170.666667 807.822222a45.511111 45.511111 0 1 0 0 91.022222 45.511111 45.511111 0 0 0 0-91.022222z m682.666666-682.666666a45.511111 45.511111 0 1 0 0 91.022222 45.511111 45.511111 0 0 0 0-91.022222z"  ></path></symbol><symbol id="l7-icon-layer" viewBox="0 0 1024 1024"><path d="M767.089778 625.777778l180.167111 82.773333a34.133333 34.133333 0 0 1 4.892444 59.278222l-4.892444 2.730667-420.977778 193.422222a34.133333 34.133333 0 0 1-22.983111 1.991111l-5.575111-1.991111-420.977778-193.422222a34.133333 34.133333 0 0 1-4.892444-59.278222l4.892444-2.730667L256.853333 625.777778l81.749334 37.546666L172.771556 739.555556 512 895.374222 851.171556 739.555556l-165.831112-76.231112 81.749334-37.546666z m0-227.555556l180.167111 82.773334a34.133333 34.133333 0 0 1 4.892444 59.278222l-4.892444 2.730666-420.977778 193.422223a34.133333 34.133333 0 0 1-22.983111 1.991111l-5.575111-1.991111-420.977778-193.422223a34.133333 34.133333 0 0 1-4.892444-59.278222l4.892444-2.730666L256.853333 398.222222l81.749334 37.546667-165.831111 76.174222L512 667.818667l339.171556-155.875556-165.831112-76.174222L767.089778 398.222222zM497.720889 60.017778a34.133333 34.133333 0 0 1 28.558222 0l420.977778 193.422222a34.133333 34.133333 0 0 1 0 62.008889l-420.977778 193.422222a34.133333 34.133333 0 0 1-28.558222 0l-420.977778-193.422222a34.133333 34.133333 0 0 1 0-62.008889zM512 128.568889L172.771556 284.387556 512 440.263111l339.171556-155.875555L512 128.568889z"  ></path></symbol><symbol id="l7-icon-narrow" viewBox="0 0 1024 1024"><path d="M910.222222 512a34.133333 34.133333 0 0 1-34.133333 34.133333H147.911111a34.133333 34.133333 0 1 1 0-68.266666h728.177778a34.133333 34.133333 0 0 1 34.133333 34.133333z"  ></path></symbol><symbol id="l7-icon-fullscreen" viewBox="0 0 1024 1024"><path d="M645.176889 597.674667l4.721778 3.982222L841.955556 793.6l0.056888-133.688889a34.133333 34.133333 0 0 1 28.615112-33.678222L876.088889 625.777778a34.133333 34.133333 0 0 1 33.678222 28.615111L910.222222 659.911111v216.177778a34.133333 34.133333 0 0 1-28.615111 33.678222L876.088889 910.222222h-216.177778a34.133333 34.133333 0 0 1-5.518222-67.811555l5.518222-0.455111h133.745778l-192-192.056889a34.133333 34.133333 0 0 1 43.52-52.224z m-222.833778 3.982222a34.133333 34.133333 0 0 1 3.982222 43.52l-3.982222 4.721778L230.286222 841.955556H364.088889a34.133333 34.133333 0 0 1 33.678222 28.615111L398.222222 876.088889a34.133333 34.133333 0 0 1-28.615111 33.678222L364.088889 910.222222H147.911111a34.133333 34.133333 0 0 1-33.678222-28.615111L113.777778 876.088889v-216.177778a34.133333 34.133333 0 0 1 67.811555-5.518222l0.455111 5.518222-0.056888 133.745778 192.113777-192a34.133333 34.133333 0 0 1 48.241778 0zM364.088889 113.777778a34.133333 34.133333 0 0 1 5.518222 67.811555L364.088889 182.044444H230.343111l192 192.056889a34.133333 34.133333 0 0 1-43.52 52.224l-4.721778-3.982222-192.113777-192.056889L182.044444 364.088889a34.133333 34.133333 0 0 1-28.615111 33.678222L147.911111 398.222222a34.133333 34.133333 0 0 1-33.678222-28.615111L113.777778 364.088889V147.911111a34.133333 34.133333 0 0 1 28.615111-33.678222L147.911111 113.777778h216.177778z m512 0a34.133333 34.133333 0 0 1 33.678222 28.615111L910.222222 147.911111v216.177778a34.133333 34.133333 0 0 1-67.811555 5.518222L841.955556 364.088889l-0.056889-133.745778-192 192a34.133333 34.133333 0 0 1-52.224-43.52l3.982222-4.721778L793.6 182.044444H659.911111a34.133333 34.133333 0 0 1-33.678222-28.615111L625.777778 147.911111a34.133333 34.133333 0 0 1 28.615111-33.678222L659.911111 113.777778h216.177778z"  ></path></symbol><symbol id="l7-icon-hide" viewBox="0 0 1024 1024"><path d="M875.52 87.836444a34.133333 34.133333 0 0 1 7.281778 43.121778l-3.527111 5.006222-682.666667 796.444445a34.133333 34.133333 0 0 1-55.409778-39.367111l3.527111-5.006222 97.166223-113.379556C123.164444 697.969778 56.888889 582.940444 56.888889 512c0-113.777778 170.666667-341.333333 455.111111-341.333333a496.64 496.64 0 0 1 208.952889 45.112889l106.439111-124.188445a34.133333 34.133333 0 0 1 48.128-3.754667z m-38.684444 202.524445C921.031111 362.951111 967.111111 452.835556 967.111111 512c0 113.777778-170.666667 341.333333-455.111111 341.333333-50.631111 0-97.678222-7.224889-140.8-19.740444l50.232889-58.595556A417.393778 417.393778 0 0 0 512 785.066667c208.270222 0 386.844444-162.304 386.844444-273.066667 0-52.849778-40.675556-117.418667-105.813333-170.496l43.804445-51.2zM512 238.933333C303.729778 238.933333 125.155556 401.237333 125.155556 512c0 66.787556 64.853333 152.291556 162.133333 209.692444L377.173333 616.675556a170.666667 170.666667 0 0 1 217.713778-253.895112l78.620445-91.704888A432.924444 432.924444 0 0 0 512 238.933333z m166.684444 236.088889a170.666667 170.666667 0 0 1-177.664 207.303111l177.607112-207.303111zM512 409.6a102.4 102.4 0 0 0-88.746667 153.486222L548.864 416.426667A102.172444 102.172444 0 0 0 512 409.6z"  ></path></symbol><symbol id="l7-icon-rectangle" viewBox="0 0 1024 1024"><path d="M170.666667 56.888889a113.777778 113.777778 0 0 1 108.544 79.644444H853.333333a34.133333 34.133333 0 0 1 33.678223 28.615111L887.466667 170.666667v574.122666a113.777778 113.777778 0 1 1-142.677334 142.734223L170.666667 887.466667a34.133333 34.133333 0 0 1-33.678223-28.615111L136.533333 853.333333V279.210667A113.777778 113.777778 0 0 1 170.666667 56.888889z m682.666666 750.933333a45.511111 45.511111 0 1 0 0 91.022222 45.511111 45.511111 0 0 0 0-91.022222z m-34.133333-603.022222H279.210667a114.062222 114.062222 0 0 1-74.353778 74.410667L204.8 819.2h539.989333a114.062222 114.062222 0 0 1 74.410667-74.410667V204.8zM170.666667 125.155556a45.511111 45.511111 0 1 0 0 91.022222 45.511111 45.511111 0 0 0 0-91.022222z"  ></path></symbol><symbol id="l7-icon-ranging" viewBox="0 0 1024 1024"><path d="M723.171556 50.403556l250.424888 250.424888a31.061333 31.061333 0 0 1 0 43.918223L344.746667 973.596444a31.061333 31.061333 0 0 1-43.918223 0L50.403556 723.171556a31.061333 31.061333 0 0 1 0-43.918223L679.253333 50.403556a31.061333 31.061333 0 0 1 43.918223 0z m-21.959112 74.524444l-39.765333 39.822222 98.986667 98.872889a34.133333 34.133333 0 0 1-44.088889 51.882667l-4.209778-3.640889-98.929778-98.929778-63.886222 63.886222 62.179556 62.122667a34.133333 34.133333 0 0 1-44.088889 51.882667L563.2 387.242667 501.077333 325.063111 437.191111 388.949333l98.986667 98.929778a34.133333 34.133333 0 0 1-44.088889 51.882667l-4.209778-3.640889-98.929778-98.929778-63.886222 63.886222L387.242667 563.2a34.133333 34.133333 0 0 1-44.088889 51.882667l-4.209778-3.584-62.122667-62.179556-63.886222 63.886222 98.986667 98.929778a34.133333 34.133333 0 0 1-44.088889 51.882667l-4.209778-3.640889-98.929778-98.929778-39.765333 39.822222 197.802667 197.745778 576.284444-576.284444-197.802667-197.745778z"  ></path></symbol><symbol id="l7-icon-reposition" viewBox="0 0 1024 1024"><path d="M512 56.888889a34.133333 34.133333 0 0 1 34.133333 34.133333v24.177778A398.336 398.336 0 0 1 908.856889 477.866667h24.177778a34.133333 34.133333 0 0 1 0 68.266666h-24.177778A398.336 398.336 0 0 1 546.133333 908.856889L546.133333 932.977778a34.133333 34.133333 0 0 1-68.266666 0v-24.177778A398.336 398.336 0 0 1 115.2 546.133333L91.022222 546.133333a34.133333 34.133333 0 1 1 0-68.266666h24.177778A398.336 398.336 0 0 1 477.866667 115.2V91.022222A34.133333 34.133333 0 0 1 512 56.888889z m34.190222 126.862222L546.133333 193.422222a34.133333 34.133333 0 1 1-68.266666 0v-9.671111A330.069333 330.069333 0 0 0 183.751111 477.866667h9.671111a34.133333 34.133333 0 1 1 0 68.266666l-9.671111 0.056889A330.069333 330.069333 0 0 0 477.866667 840.248889V830.577778a34.133333 34.133333 0 0 1 68.266666 0l0.056889 9.671111A330.069333 330.069333 0 0 0 840.248889 546.133333L830.577778 546.133333a34.133333 34.133333 0 0 1 0-68.266666h9.671111A330.069333 330.069333 0 0 0 546.133333 183.751111zM512 341.333333a170.666667 170.666667 0 1 1 0 341.333334 170.666667 170.666667 0 0 1 0-341.333334z m0 68.266667a102.4 102.4 0 1 0 0 204.8 102.4 102.4 0 0 0 0-204.8z"  ></path></symbol><symbol id="l7-icon-round" viewBox="0 0 1024 1024"><path d="M512 56.888889a455.111111 455.111111 0 0 1 391.395556 687.502222 113.777778 113.777778 0 0 1-159.061334 158.890667A455.111111 455.111111 0 0 1 120.604444 279.608889 113.777778 113.777778 0 0 1 279.608889 120.604444 452.835556 452.835556 0 0 1 512 56.888889z m0 68.266667a384.910222 384.910222 0 0 0-191.715556 50.744888A113.777778 113.777778 0 0 1 175.957333 320.284444a386.844444 386.844444 0 0 0 527.815111 527.758223 113.777778 113.777778 0 0 1 144.270223-144.440889A386.844444 386.844444 0 0 0 512 125.155556z m299.406222 640.739555a45.511111 45.511111 0 1 0 0 91.022222 45.511111 45.511111 0 0 0 0-91.022222zM212.593778 167.082667a45.511111 45.511111 0 1 0 0 91.022222 45.511111 45.511111 0 0 0 0-91.022222z"  ></path></symbol><symbol id="l7-icon-guanbi" viewBox="0 0 1024 1024"><path d="M576 512l277.333333 277.333333-64 64-277.333333-277.333333L234.666667 853.333333 170.666667 789.333333l277.333333-277.333333L170.666667 234.666667 234.666667 170.666667l277.333333 277.333333L789.333333 170.666667 853.333333 234.666667 576 512z"  ></path></symbol></svg>`,J_=!1,K_()})),X_,Z_=t((()=>{X_=`.l7-marker-container{width:100%;height:100%;position:absolute;overflow:hidden}.l7-marker{z-index:5;cursor:pointer;top:0;left:0;position:absolute!important}.l7-marker-cluster{background-color:#b5e28c99;background-clip:padding-box;border-radius:20px;width:40px;height:40px}.l7-marker-cluster div{text-align:center;background-color:#6ecc3999;border-radius:15px;width:30px;height:30px;margin-top:5px;margin-left:5px;font:12px Helvetica Neue,Arial,Helvetica,sans-serif}.l7-marker-cluster span{line-height:30px}.l7-touch .l7-control-attribution,.l7-touch .l7-control-layers,.l7-touch .l7-bar{box-shadow:none}.l7-touch .l7-control-layers,.l7-touch .l7-bar{background-clip:padding-box;border:2px solid #0003}.mapboxgl-ctrl-logo,.amap-logo{display:none!important}.l7-select-box{z-index:999;box-sizing:border-box;border:3px dashed gray;border-radius:2px;position:absolute}.l7-control-container{font:12px/1.5 Helvetica Neue,Arial,Helvetica,sans-serif}.l7-control-container .l7-control{z-index:999;float:left;clear:both;color:#595959;pointer-events:visiblepainted;pointer-events:auto;font-size:12px;position:relative}.l7-control-container .l7-control.l7-control--hide{display:none}.l7-control-container .l7-top{z-index:999;pointer-events:none;display:flex;position:absolute;top:0}.l7-control-container .l7-top .l7-control:not(.l7-control--hide){margin-top:8px}.l7-control-container .l7-right{z-index:999;pointer-events:none;display:flex;position:absolute;right:0}.l7-control-container .l7-right .l7-control:not(.l7-control--hide){margin-right:8px}.l7-control-container .l7-bottom{z-index:999;pointer-events:none;display:flex;position:absolute;bottom:0}.l7-control-container .l7-bottom .l7-control:not(.l7-control--hide){margin-bottom:8px}.l7-control-container .l7-left{z-index:999;pointer-events:none;display:flex;position:absolute;left:0}.l7-control-container .l7-left .l7-control:not(.l7-control--hide){margin-left:8px}.l7-control-container .l7-center{justify-content:center;display:flex;position:absolute}.l7-control-container .l7-center.l7-top,.l7-control-container .l7-center.l7-bottom{width:100%}.l7-control-container .l7-center.l7-left,.l7-control-container .l7-center.l7-right{height:100%}.l7-control-container .l7-center .l7-control{margin-bottom:8px;margin-right:8px}.l7-control-container .l7-row{flex-direction:row}.l7-control-container .l7-row.l7-top{align-items:flex-start}.l7-control-container .l7-row.l7-bottom{align-items:flex-end}.l7-control-container .l7-column{flex-direction:column}.l7-control-container .l7-column.l7-left{align-items:flex-start}.l7-control-container .l7-column.l7-right{align-items:flex-end}.l7-button-control{cursor:pointer;background-color:#fff;border-width:0;border-radius:2px;outline:0;justify-content:center;align-items:center;min-width:28px;height:28px;padding:0 6px;line-height:16px;transition:all .2s;display:flex;box-shadow:0 0 20px #00000026}.l7-button-control .l7-iconfont{fill:#595959;color:#595959;width:16px;height:16px}.l7-button-control.l7-button-control--row{padding:0 16px 0 13px}.l7-button-control.l7-button-control--row *+.l7-button-control__text{margin-left:8px}.l7-button-control.l7-button-control--column{flex-direction:column;height:44px}.l7-button-control.l7-button-control--column .l7-iconfont{margin-top:3px}.l7-button-control.l7-button-control--column .l7-button-control__text{margin-top:3px;font-size:10px;transform:scale(.83333)}.l7-button-control:not(:disabled):hover,.l7-button-control:not(:disabled):active{background-color:#f3f3f3}.l7-button-control:disabled{color:#bdbdbd;cursor:not-allowed;background-color:#fafafa}.l7-button-control:disabled .l7-iconfont{fill:#bdbdbd;color:#bdbdbd}.l7-button-control:disabled:hover,.l7-button-control:disabled:active{background-color:#fafafa}.l7-popper{z-index:5;color:#595959;justify-content:center;align-items:center;display:flex;position:absolute}.l7-popper.l7-popper-hide{display:none}.l7-popper .l7-popper-content{background:#fff;border-radius:2px;min-height:28px;box-shadow:0 0 20px #00000026}.l7-popper .l7-popper-arrow{border:4px solid #0000;width:0;height:0;box-shadow:0 0 20px #00000026}.l7-popper.l7-popper-left{flex-direction:row}.l7-popper.l7-popper-left .l7-popper-arrow{border-left-color:#fff;margin:10px 0}.l7-popper.l7-popper-right{flex-direction:row-reverse}.l7-popper.l7-popper-right .l7-popper-arrow{border-right-color:#fff;margin:10px 0}.l7-popper.l7-popper-top{flex-direction:column}.l7-popper.l7-popper-top .l7-popper-arrow{border-top-color:#fff;margin:0 10px}.l7-popper.l7-popper-bottom{flex-direction:column-reverse}.l7-popper.l7-popper-bottom .l7-popper-arrow{border-bottom-color:#fff;margin:0 10px}.l7-popper.l7-popper-start{align-items:flex-start}.l7-popper.l7-popper-end{align-items:flex-end}.l7-select-control--normal{padding:4px 0}.l7-select-control--normal .l7-select-control-item{align-items:center;height:24px;padding:0 16px;font-size:12px;line-height:24px;display:flex}.l7-select-control--normal .l7-select-control-item>*+*{margin-left:6px}.l7-select-control--normal .l7-select-control-item input[type=checkbox]{width:14px;height:14px}.l7-select-control--normal .l7-select-control-item:hover{background-color:#f3f3f3}.l7-select-control--image{box-sizing:content-box;flex-wrap:wrap;align-items:flex-start;max-width:460px;max-height:400px;margin:12px 0 0 12px;display:flex;overflow:hidden auto}.l7-select-control--image .l7-select-control-item{box-sizing:content-box;border:1px solid #fff;border-radius:2px;flex-direction:column;flex:0 0 calc(33.3333% - 14px);justify-content:center;margin-bottom:12px;margin-right:12px;font-size:12px;display:flex;position:relative;overflow:hidden}.l7-select-control--image .l7-select-control-item img{width:100%;height:80px}.l7-select-control--image .l7-select-control-item input[type=checkbox]{position:absolute;top:0;right:0}.l7-select-control--image .l7-select-control-item .l7-select-control-item-row{justify-content:center;align-items:center;line-height:26px;display:flex}.l7-select-control--image .l7-select-control-item .l7-select-control-item-row>*+*{margin-left:8px}.l7-select-control--image .l7-select-control-item.l7-select-control-item-active{border-color:#0370fe}.l7-select-control-item{cursor:pointer}.l7-select-control-item input[type=checkbox]{cursor:pointer;margin:0}.l7-select-control--multiple .l7-select-control-item:hover{background-color:#0000}.l7-control-logo{user-select:none;width:89px;height:16px}.l7-control-logo img{width:100%;height:100%}.l7-control-logo .l7-control-logo-link{cursor:pointer;display:block}.l7-control-logo .l7-control-logo-link img{cursor:pointer}.l7-control-mouse-location{background-color:#fff;border-radius:2px;min-width:130px;padding:2px 4px;box-shadow:0 0 20px #00000026}.l7-control-zoom{border-radius:2px;overflow:hidden;box-shadow:0 0 20px #00000026}.l7-control-zoom .l7-button-control{border-bottom:1px solid #f0f0f0;border-radius:0;font-size:16px;box-shadow:0 0}.l7-control-zoom .l7-button-control .l7-iconfont{width:14px;height:14px}.l7-control-zoom .l7-button-control:last-child{border-bottom:0}.l7-control-zoom .l7-control-zoom__number{color:#595959;padding:0}.l7-control-zoom .l7-control-zoom__number:hover{background-color:#fff}.l7-control-scale{flex-direction:column;display:flex}.l7-control-scale .l7-control-scale-line{box-sizing:border-box;color:#595959;white-space:nowrap;background:#fff;border:2px solid #000;border-top:0;padding:2px 5px 1px;font-size:10px;line-height:1.1;transition:width .1s;overflow:hidden}.l7-control-scale .l7-control-scale-line+.l7-control-scale .l7-control-scale-line{border-top:2px solid #777;border-bottom:none;margin-top:-2px}.l7-right .l7-control-scale{align-items:flex-end;display:flex}.l7-right .l7-control-scale .l7-control-scale-line{text-align:right}.l7-popup{z-index:5;will-change:transform;pointer-events:none;display:flex;position:absolute;top:0;left:0}.l7-popup.l7-popup-hide{display:none}.l7-popup .l7-popup-content{background:#fff;border-radius:3px;padding:16px;font-size:14px;position:relative;box-shadow:0 1px 2px #0000001a}.l7-popup .l7-popup-content .l7-popup-content__title{margin-bottom:8px;font-weight:700}.l7-popup .l7-popup-content .l7-popup-close-button,.l7-popup .l7-popup-content .l7-popup-content__title,.l7-popup .l7-popup-content .l7-popup-content__panel{white-space:normal;user-select:text;pointer-events:initial}.l7-popup .l7-popup-content .l7-popup-close-button{text-align:center;cursor:pointer;background-color:#0000;border:0;border-radius:0 3px 0 0;width:18px;height:18px;padding:0;font-size:14px;line-height:18px;position:absolute;top:0;right:0}.l7-popup .l7-popup-tip{z-index:1;border:10px solid #0000;width:0;height:0;position:relative}.l7-popup.l7-popup-anchor-bottom,.l7-popup.l7-popup-anchor-bottom-left,.l7-popup.l7-popup-anchor-bottom-right{flex-direction:column-reverse}.l7-popup.l7-popup-anchor-bottom .l7-popup-tip,.l7-popup.l7-popup-anchor-bottom-left .l7-popup-tip,.l7-popup.l7-popup-anchor-bottom-right .l7-popup-tip{bottom:1px}.l7-popup.l7-popup-anchor-top,.l7-popup.l7-popup-anchor-top-left,.l7-popup.l7-popup-anchor-top-right{flex-direction:column}.l7-popup.l7-popup-anchor-top .l7-popup-tip,.l7-popup.l7-popup-anchor-top-left .l7-popup-tip,.l7-popup.l7-popup-anchor-top-right .l7-popup-tip{top:1px}.l7-popup.l7-popup-anchor-left{flex-direction:row}.l7-popup.l7-popup-anchor-right{flex-direction:row-reverse}.l7-popup-anchor-top .l7-popup-tip{border-top:none;border-bottom-color:#fff;align-self:center;position:relative}.l7-popup-anchor-top-left .l7-popup-tip{border-top:none;border-bottom-color:#fff;border-left:none;align-self:flex-start}.l7-popup-anchor-top-right .l7-popup-tip{border-top:none;border-bottom-color:#fff;border-right:none;align-self:flex-end}.l7-popup-anchor-bottom .l7-popup-tip{border-top-color:#fff;border-bottom:none;align-self:center}.l7-popup-anchor-bottom-left .l7-popup-tip{border-top-color:#fff;border-bottom:none;border-left:none;align-self:flex-start}.l7-popup-anchor-bottom-right .l7-popup-tip{border-top-color:#fff;border-bottom:none;border-right:none;align-self:flex-end}.l7-popup-anchor-left .l7-popup-tip{border-left:none;border-right-color:#fff;align-self:center}.l7-popup-anchor-right .l7-popup-tip{border-left-color:#fff;border-right:none;align-self:center;right:1px}.l7-popup-anchor-top-left .l7-popup-content{border-top-left-radius:0}.l7-popup-anchor-top-right .l7-popup-content{border-top-right-radius:0}.l7-popup-anchor-bottom-left .l7-popup-content{border-bottom-left-radius:0}.l7-popup-anchor-bottom-right .l7-popup-content{border-bottom-right-radius:0}.l7-popup-track-pointer{display:none}.l7-popup-track-pointer *{user-select:none;pointer-events:none}.l7-map:hover .l7-popup-track-pointer{display:flex}.l7-map:active .l7-popup-track-pointer{display:none}.l7-layer-popup__row{font-size:12px}.l7-layer-popup__row+.l7-layer-popup__row{margin-top:4px}.l7-control-swipe{z-index:6;touch-action:none;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%)}.l7-control-swipe_hide{display:none}.l7-control-swipe:before{z-index:-1;content:"";background:#fff;width:4px;position:absolute;top:-5000px;bottom:-5000px;left:50%;transform:translate(-2px)}.l7-control-swipe.horizontal:before{width:auto;height:4px;inset:50% -5000px auto}.l7-control-swipe__button{color:#595959;width:28px;height:28px;font-weight:700;font-size:inherit;text-align:center;background-color:#fff;border:none;border-radius:2px;outline:none;margin:0;padding:0;text-decoration:none;display:block}.l7-control-swipe,.l7-control-swipe__button{cursor:ew-resize}.l7-control-swipe.horizontal,.l7-control-swipe.horizontal button{cursor:ns-resize}.l7-control-swipe:after,.l7-control-swipe__button:before,.l7-control-swipe__button:after{content:"";background:currentColor;width:2px;position:absolute;top:25%;bottom:25%;left:50%;transform:translate(-1px)}.l7-control-swipe__button:after{transform:translate(4px)}.l7-control-swipe__button:before{transform:translate(-6px)}`})),Q_,$_=t((()=>{Z_(),Q_=document.createElement(`style`),Q_.textContent=X_,document.head.appendChild(Q_)})),ev,tv,nv=t((()=>{E(),D(),ev=e(qt()),tv=class e extends ev.default{static{this.controlCount=0}constructor(t){super(),e.controlCount++,this.controlOption={...this.getDefault(t),...t||{}}}getOptions(){return this.controlOption}setOptions(e){let t=this.getDefault(e);Object.entries(e).forEach(([n,r])=>{r===void 0&&(e[n]=t[n])}),`position`in e&&this.setPosition(e.position),`className`in e&&this.setClassName(e.className),`style`in e&&this.setStyle(e.style),this.controlOption={...this.controlOption,...e}}addTo(e){this.mapsService=e.mapService,this.renderService=e.rendererService,this.layerService=e.layerService,this.controlService=e.controlService,this.configService=e.globalConfigService,this.scene=e.sceneService,this.sceneContainer=e,this.isShow=!0,this.container=this.onAdd(),Ee(this.container,`l7-control`);let{className:t,style:n}=this.controlOption;return t&&this.setClassName(t),n&&this.setStyle(n),this.insertContainer(),this.emit(`add`,this),this}remove(){if(!this.mapsService)return this;jt(this.container),this.onRemove(),this.emit(`remove`,this)}onAdd(){return j(`div`)}onRemove(){}show(){let e=this.container;on(e,`l7-control--hide`),this.isShow=!0,this.emit(`show`,this)}hide(){let e=this.container;Ee(e,`l7-control--hide`),this.isShow=!1,this.emit(`hide`,this)}getDefault(t){return{position:Ut.TOPRIGHT,name:`${e.controlCount}`}}getContainer(){return this.container}getIsShow(){return this.isShow}_refocusOnMap(e){if(this.mapsService&&e&&e.screenX>0&&e.screenY>0){let e=this.mapsService.getContainer();e!==null&&e.focus()}}setPosition(e=Ut.TOPLEFT){let t=this.controlService;return t&&t.removeControl(this),this.controlOption.position=e,t&&t.addControl(this,this.sceneContainer),this}setClassName(e){let t=this.container,{className:n}=this.controlOption;n&&on(t,n),e&&Ee(t,e)}setStyle(e){let t=this.container;e?t.setAttribute(`style`,e):t.removeAttribute(`style`)}insertContainer(){let e=this.controlOption.position,t=this.container;if(e instanceof Element)e.appendChild(t);else{let n=this.controlService.controlCorners[e];[`bottomleft`,`bottomright`,`righttop`,`rightbottom`].includes(e)?n.insertBefore(t,n.firstChild):n.appendChild(t)}}checkUpdateOption(e,t){return t.some(t=>t in e)}}})),rv,iv=t((()=>{D(),nv(),rv=class extends tv{constructor(...e){super(...e),this.isDisable=!1}setIsDisable(e){this.isDisable=e,e?this.button?.setAttribute(`disabled`,`true`):this.button?.removeAttribute(`disabled`)}createButton(e=``){return j(`button`,`l7-button-control ${e}`)}onAdd(){this.button=this.createButton(),this.isDisable=!1;let{title:e,btnText:t,btnIcon:n}=this.controlOption;return this.setBtnTitle(e),this.setBtnText(t),this.setBtnIcon(n),this.button}onRemove(){this.button=this.buttonIcon=this.buttonText=void 0,this.isDisable=!1}setOptions(e){let{title:t,btnText:n,btnIcon:r}=e;this.checkUpdateOption(e,[`title`])&&this.setBtnTitle(t),this.checkUpdateOption(e,[`btnIcon`])&&this.setBtnIcon(r),this.checkUpdateOption(e,[`btnText`])&&this.setBtnText(n),super.setOptions(e)}setBtnTitle(e){this.button?.setAttribute(`title`,e??``)}setBtnIcon(e){if(this.buttonIcon&&jt(this.buttonIcon),e){let t=this.button?.firstChild;t?this.button?.insertBefore(e,t):this.button?.appendChild(e),this.buttonIcon=e}}setBtnText(e){if(this.button){if(on(this.button,`l7-button-control--row`),on(this.button,`l7-button-control--column`),e){let t=this.buttonText;t||(t=j(`div`,`l7-button-control__text`),this.button?.appendChild(t),this.buttonText=t),t.innerText=e,Ee(this.button,this.controlOption.vertical?`l7-button-control--column`:`l7-button-control--row`)}else!e&&this.buttonText&&(jt(this.buttonText),this.buttonText=void 0)}}}})),av,ov,sv=t((()=>{D(),av=e(qt()),ov=class e extends av.EventEmitter{get buttonRect(){return this.button.getBoundingClientRect()}static{this.conflictPopperList=[]}constructor(t,n){super(),this.isShow=!1,this.timeout=null,this.show=()=>(this.isShow||!this.contentDOM.innerHTML||(this.resetPopperPosition(),on(this.popperDOM,`l7-popper-hide`),this.isShow=!0,this.option.unique&&e.conflictPopperList.forEach(e=>{e!==this&&e.isShow&&e.hide()}),this.emit(`show`),window.addEventListener(`pointerdown`,this.onPopperUnClick)),this),this.hide=()=>(this.isShow&&(Ee(this.popperDOM,`l7-popper-hide`),this.isShow=!1,this.emit(`hide`),window.removeEventListener(`pointerdown`,this.onPopperUnClick)),this),this.setHideTimeout=()=>{this.timeout||=window.setTimeout(()=>{this.isShow&&(this.hide(),this.timeout=null)},300)},this.clearHideTimeout=()=>{this.timeout&&=(window.clearTimeout(this.timeout),null)},this.onBtnClick=()=>{this.isShow?this.hide():this.show()},this.onPopperUnClick=e=>{tt(e.target,[`.l7-button-control`,`.l7-popper-content`])||this.hide()},this.onBtnMouseLeave=()=>{this.setHideTimeout()},this.onBtnMouseMove=()=>{this.clearHideTimeout(),this.isShow||this.show()},this.button=t,this.option=n,this.init(),n.unique&&e.conflictPopperList.push(this)}getPopperDOM(){return this.popperDOM}getIsShow(){return this.isShow}getContent(){return this.content}setContent(e){typeof e==`string`?this.contentDOM.innerHTML=e:e instanceof HTMLElement&&(tn(this.contentDOM),this.contentDOM.appendChild(e)),this.content=e}init(){let{trigger:e}=this.option;this.popperDOM=this.createPopper(),e===`click`?this.button.addEventListener(`click`,this.onBtnClick):(this.button.addEventListener(`mousemove`,this.onBtnMouseMove),this.button.addEventListener(`mouseleave`,this.onBtnMouseLeave),this.popperDOM.addEventListener(`mousemove`,this.onBtnMouseMove),this.popperDOM.addEventListener(`mouseleave`,this.onBtnMouseLeave))}destroy(){if(this.button.removeEventListener(`click`,this.onBtnClick),this.button.removeEventListener(`mousemove`,this.onBtnMouseMove),this.button.removeEventListener(`mousemove`,this.onBtnMouseLeave),this.popperDOM.removeEventListener(`mousemove`,this.onBtnMouseMove),this.popperDOM.removeEventListener(`mouseleave`,this.onBtnMouseLeave),jt(this.popperDOM),this.option.unique){let t=e.conflictPopperList.indexOf(this);t>-1&&e.conflictPopperList.splice(t,1)}}resetPopperPosition(){let e={},{container:t,offset:n=[0,0],placement:r}=this.option,[i,o]=n,s=this.button.getBoundingClientRect(),c=t.getBoundingClientRect(),{left:l,right:u,top:d,bottom:f}=Qt(s,c),p=!1,m=!1;/^(left|right)/.test(r)?(r.includes(`left`)?e.right=`${s.width+u}px`:r.includes(`right`)&&(e.left=`${s.width+l}px`),r.includes(`start`)?e.top=`${d}px`:r.includes(`end`)?e.bottom=`${f}px`:(e.top=`${d+s.height/2}px`,m=!0,e.transform=`translate(${i}px, calc(${o}px - 50%))`)):/^(top|bottom)/.test(r)&&(r.includes(`top`)?e.bottom=`${s.height+f}px`:r.includes(`bottom`)&&(e.top=`${s.height+d}px`),r.includes(`start`)?e.left=`${l}px`:r.includes(`end`)?e.right=`${u}px`:(e.left=`${l+s.width/2}px`,p=!0,e.transform=`translate(calc(${i}px - 50%), ${o}px)`)),e.transform=`translate(calc(${i}px - ${p?`50%`:`0%`}), calc(${o}px - ${m?`50%`:`0%`})`;let h=r.split(`-`);h.length&&Ee(this.popperDOM,h.map(e=>`l7-popper-${e}`).join(` `)),a(this.popperDOM,Yt(e))}createPopper(){let{container:e,className:t=``,content:n}=this.option,r=j(`div`,`l7-popper l7-popper-hide ${t}`),i=j(`div`,`l7-popper-content`),a=j(`div`,`l7-popper-arrow`);return r.appendChild(i),r.appendChild(a),e.appendChild(r),this.popperDOM=r,this.contentDOM=i,n&&this.setContent(n),r}}})),cv,lv,uv=t((()=>{sv(),iv(),cv={topleft:`right-start`,topcenter:`bottom`,topright:`left-start`,bottomleft:`right-end`,bottomcenter:`top`,bottomright:`left-end`,lefttop:`bottom-start`,leftcenter:`right`,leftbottom:`top-start`,righttop:`bottom-end`,rightcenter:`left`,rightbottom:`top-end`},lv=class extends rv{getPopper(){return this.popper}hide(){this.popper.hide(),super.hide()}getDefault(e){let t=super.getDefault(e),n=e?.position??t.position;return{...super.getDefault(e),popperPlacement:n instanceof Element?`bottom`:cv[n],popperTrigger:`click`}}onAdd(){let e=super.onAdd();return this.initPopper(),e}onRemove(){this.popper.destroy()}initPopper(){let{popperClassName:e,popperPlacement:t,popperTrigger:n}=this.controlOption,r=this.mapsService.getMapContainer();return this.popper=new ov(this.button,{className:e,placement:t,trigger:n,container:r,unique:!0}),this.popper.on(`show`,()=>{this.emit(`popperShow`,this)}).on(`hide`,()=>{this.emit(`popperHide`,this)}),this.popper}setOptions(e){if(super.setOptions(e),this.checkUpdateOption(e,[`popperPlacement`,`popperTrigger`,`popperClassName`])){let e=this.popper.getContent();this.popper.destroy(),this.initPopper(),this.popper.setContent(e)}}}})),dv,fv=t((()=>{D(),uv(),dv=class extends lv{constructor(...e){super(...e),this.selectValue=[],this.createNormalOption=e=>{let t=this.selectValue.includes(e.value),n=j(`div`,`l7-select-control-item ${t?`l7-select-control-item-active`:``}`);this.getIsMultiple()?n.appendChild(this.createCheckbox(t)):n.appendChild(this.createRadio(t)),e.icon&&n.appendChild(e.icon);let r=j(`span`);return r.innerText=e.text,n.appendChild(r),n},this.onItemClick=e=>{if(this.getIsMultiple()){let t=this.selectValue.findIndex(t=>t===e.value);t>-1?this.selectValue.splice(t,1):this.selectValue=[...this.selectValue,e.value]}else this.selectValue=[e.value];this.setSelectValue(this.selectValue)}}setOptions(e){super.setOptions(e);let{options:t}=e;t&&this.popper.setContent(this.getPopperContent(t))}onAdd(){let e=super.onAdd(),{defaultValue:t}=this.controlOption;return t&&(this.selectValue=this.transSelectValue(t)),this.popper.setContent(this.getPopperContent(this.controlOption.options)),e}getSelectValue(){return this.getIsMultiple()?this.selectValue:this.selectValue[0]}setSelectValue(e,t=!0){let n=this.transSelectValue(e);this.optionDOMList.forEach(e=>{let t=e.getAttribute(`data-option-value`),r=e.querySelector(`input[type=checkbox]`),i=e.querySelector(`input[type=radio]`),a=n.includes(t),o=(t,n)=>{Pt(e,`l7-select-control-item-active`,n),t&&ut(t,n)};o(r,a),o(i,a)}),this.selectValue=n,t&&this.emit(`selectChange`,this.getIsMultiple()?n:n[0])}getIsMultiple(){return!1}getPopperContent(e){let t=this.isImageOptions(),n=j(`div`,t?`l7-select-control--image`:`l7-select-control--normal`);this.getIsMultiple()&&Ee(n,`l7-select-control--multiple`);let r=e.map((e,n)=>{let r=t?this.createImageOption(e):this.createNormalOption(e);return r.setAttribute(`data-option-value`,e.value),r.setAttribute(`data-option-index`,window.String(n)),r.addEventListener(`click`,this.onItemClick.bind(this,e)),r});return n.append(...r),this.optionDOMList=r,n}createImageOption(e){let t=this.selectValue.includes(e.value),n=j(`div`,`l7-select-control-item ${t?`l7-select-control-item-active`:``}`),r=j(`img`);r.setAttribute(`src`,e.img),Ht(r),n.appendChild(r);let i=j(`div`,`l7-select-control-item-row`);this.getIsMultiple()&&n.appendChild(this.createCheckbox(t));let a=j(`span`);return a.innerText=e.text,i.appendChild(a),n.appendChild(i),n}createCheckbox(e){let t=j(`input`);return t.setAttribute(`type`,`checkbox`),e&&ut(t,!0),t}createRadio(e){let t=j(`input`);return t.setAttribute(`type`,`radio`),e&&ut(t,!0),t}isImageOptions(){return!!this.controlOption.options.find(e=>e.img)}transSelectValue(e){return Array.isArray(e)?e:[e]}}})),pv=t((()=>{iv(),nv(),uv(),fv()})),mv,hv=t((()=>{Y_(),mv=e=>{K_();let t=document.createElementNS(`http://www.w3.org/2000/svg`,`svg`);t.classList.add(`l7-iconfont`),t.setAttribute(`aria-hidden`,`true`);let n=document.createElementNS(`http://www.w3.org/2000/svg`,`use`);return n.setAttributeNS(`http://www.w3.org/1999/xlink`,`href`,`#${e}`),t.appendChild(n),t}})),gv,_v=t((()=>{hv(),iv(),gv=class extends rv{constructor(...e){super(...e),this.onClick=async()=>{let{onExport:e}=this.controlOption;e?.(await this.getImage())},this.mergeImage=async(...e)=>{let{imageType:t}=this.controlOption,{width:n=0,height:r=0}=this.mapsService.getContainer()?.getBoundingClientRect()??{},i=document.createElement(`canvas`);i.width=n,i.height=r;let a=i.getContext(`2d`);return(await Promise.all(e.map(e=>new Promise(t=>{let n=new Image;n.onload=()=>{t(n)},n.src=e})))).forEach(e=>{a?.drawImage(e,0,0,n,r)}),i.toDataURL(`image/${t}`)}}onAdd(){let e=super.onAdd();return e.addEventListener(`click`,this.onClick),e}getDefault(e){return{...super.getDefault(e),title:`导出图片`,btnIcon:mv(`l7-icon-export-picture`),imageType:`png`}}async getImage(){let e=await this.mapsService.exportMap(`png`),t=await this.scene.exportPng(`png`);return this.mergeImage(...[e,t].filter(e=>e))}}})),vv,yv,bv,xv,Sv,Cv=t((()=>{vv=[[`requestFullscreen`,`exitFullscreen`,`fullscreenElement`,`fullscreenEnabled`,`fullscreenchange`,`fullscreenerror`],[`webkitRequestFullscreen`,`webkitExitFullscreen`,`webkitFullscreenElement`,`webkitFullscreenEnabled`,`webkitfullscreenchange`,`webkitfullscreenerror`],[`webkitRequestFullScreen`,`webkitCancelFullScreen`,`webkitCurrentFullScreenElement`,`webkitCancelFullScreen`,`webkitfullscreenchange`,`webkitfullscreenerror`],[`mozRequestFullScreen`,`mozCancelFullScreen`,`mozFullScreenElement`,`mozFullScreenEnabled`,`mozfullscreenchange`,`mozfullscreenerror`],[`msRequestFullscreen`,`msExitFullscreen`,`msFullscreenElement`,`msFullscreenEnabled`,`MSFullscreenChange`,`MSFullscreenError`]],yv=(()=>{if(typeof document>`u`)return!1;let e=vv[0],t={};for(let n of vv)if(n?.[1]in document){for(let[r,i]of n.entries())t[e[r]]=i;return t}return!1})(),bv={change:yv.fullscreenchange,error:yv.fullscreenerror},xv={request(e=document.documentElement,t){return new Promise((n,r)=>{let i=()=>{xv.off(`change`,i),n()};xv.on(`change`,i);let a=e[yv.requestFullscreen](t);a instanceof Promise&&a.then(i).catch(r)})},exit(){return new Promise((e,t)=>{if(!xv.isFullscreen){e();return}let n=()=>{xv.off(`change`,n),e()};xv.on(`change`,n);let r=document[yv.exitFullscreen]();r instanceof Promise&&r.then(n).catch(t)})},toggle(e,t){return xv.isFullscreen?xv.exit():xv.request(e,t)},onchange(e){xv.on(`change`,e)},onerror(e){xv.on(`error`,e)},on(e,t){let n=bv[e];n&&document.addEventListener(n,t,!1)},off(e,t){let n=bv[e];n&&document.removeEventListener(n,t,!1)},raw:yv},Object.defineProperties(xv,{isFullscreen:{get:()=>!!document[yv.fullscreenElement]},element:{enumerable:!0,get:()=>document[yv.fullscreenElement]??void 0},isEnabled:{enumerable:!0,get:()=>!!document[yv.fullscreenEnabled]}}),yv||(xv={isEnabled:!1}),Sv=xv})),wv,Tv=t((()=>{D(),hv(),Cv(),iv(),wv=class extends rv{constructor(e){super(e),this.isFullscreen=!1,this.toggleFullscreen=async()=>{Sv.isEnabled&&await Sv.toggle(this.mapContainer)},this.onClick=()=>{this.toggleFullscreen()},this.onFullscreenChange=()=>{this.isFullscreen=!!document.fullscreenElement;let{btnText:e,btnIcon:t,title:n,exitBtnText:r,exitBtnIcon:i,exitTitle:a}=this.controlOption;this.isFullscreen?(this.setBtnTitle(a),this.setBtnText(r),this.setBtnIcon(i)):(this.setBtnTitle(n),this.setBtnText(e),this.setBtnIcon(t)),this.emit(`fullscreenChange`,this.isFullscreen)},Sv.isEnabled||console.warn(`当前浏览器环境不支持对地图全屏化`)}setOptions(e){let{exitBtnText:t,exitBtnIcon:n,exitTitle:r}=e;this.isFullscreen&&(this.checkUpdateOption(e,[`exitBtnIcon`])&&this.setBtnIcon(n),this.checkUpdateOption(e,[`exitBtnText`])&&this.setBtnText(t),this.checkUpdateOption(e,[`exitTitle`])&&this.setBtnTitle(r)),super.setOptions(e)}onAdd(){let e=super.onAdd();return e.addEventListener(`click`,this.onClick),this.mapContainer=Rt(this.scene.getSceneConfig().id),this.mapContainer.addEventListener(`fullscreenchange`,this.onFullscreenChange),e}onRemove(){super.onRemove(),this.mapContainer.removeEventListener(`fullscreenchange`,this.onFullscreenChange)}getDefault(e){return{...super.getDefault(e),title:`全屏`,btnIcon:mv(`l7-icon-fullscreen`),exitTitle:`退出全屏`,exitBtnIcon:mv(`l7-icon-exit-fullscreen`)}}}})),Ev,Dv=t((()=>{hv(),iv(),Ev=class extends rv{constructor(e){super(e),this.getGeoLocation=()=>new Promise((e,t)=>{window.navigator.geolocation.getCurrentPosition(({coords:n})=>{let{longitude:r,latitude:i}=n??{};!isNaN(r)&&!isNaN(i)?e([r,i]):t()},e=>{t(e)})}),this.onClick=async()=>{if(!window.navigator.geolocation)return;let{transform:e}=this.controlOption,t=await this.getGeoLocation(),n=this.mapsService.getZoom();this.mapsService.setZoomAndCenter(n>15?n:15,e?await e(t):t)},window.navigator.geolocation||console.warn(`当前浏览器环境不支持获取地理定位`)}getDefault(e){return{...super.getDefault(e),title:`定位`,btnIcon:mv(`l7-icon-reposition`)}}onAdd(){let e=super.onAdd();return e.addEventListener(`click`,this.onClick),e}}}));function Ov(e){return Object.keys(e??{}).every(e=>[`layer`,`name`,`img`].includes(e))}var kv,Av=t((()=>{hv(),fv(),kv=class extends dv{constructor(...e){super(...e),this.onLayerChange=()=>{this.controlOption.layers?.length||(this.selectValue=this.getLayerVisible(),this.setOptions({options:this.getLayerOptions()}))},this.onLayerVisibleChane=()=>{this.setSelectValue(this.getLayerVisible())},this.onSelectChange=()=>{this.layers.forEach(e=>{let t=this.selectValue.includes(e.name),n=e.isVisible();t&&!n&&e.show(),!t&&n&&e.hide()})}}get layers(){let e=this.layerService,{layers:t}=this.controlOption;if(Array.isArray(t)&&t.length){let n=[];return t.forEach(t=>{if(t instanceof Object&&(Ov(t)?n.push(t.layer):n.push(t)),typeof t==`string`){let r=e.getLayer(t)||e.getLayerByName(t);r&&n.push(r)}}),n}return e.getLayers()||[]}getDefault(e){return{...super.getDefault(e),title:`图层控制`,btnIcon:mv(`l7-icon-layer`),options:[],multiple:e?.multiple??!0}}getLayerVisible(){return this.layers.filter(e=>e.isVisible()).map(e=>e.name)}getLayerOptions(){let{layers:e}=this.controlOption,t=e?.every(e=>e.img);return e?e?.map(e=>{if(Ov(e))return{text:e.name||e.layer.name,value:e.layer.name,img:t?e.img:void 0};if(typeof e==`string`){let t=this.layerService.getLayer(e)||this.layerService.getLayerByName(e);return{text:t?.name,value:t?.name}}return{text:e.name,value:e.name}}):this.layers.map(e=>({text:e.name,value:e.name}))}setOptions(e){let t=this.checkUpdateOption(e,[`layers`,`multiple`]);super.setOptions(e),t&&(this.controlOption.multiple===!1&&this.handleSingleSelection(),this.selectValue=this.getLayerVisible(),this.controlOption.options=this.getLayerOptions(),this.popper.setContent(this.getPopperContent(this.controlOption.options)))}handleSingleSelection(){this.layers.forEach((e,t)=>{t===0?e.show():e.hide()})}onAdd(){return this.controlOption.multiple===!1&&this.handleSingleSelection(),this.controlOption.options?.length||(this.controlOption.options=this.getLayerOptions()),this.controlOption.defaultValue||(this.controlOption.defaultValue=this.getLayerVisible()),this.on(`selectChange`,this.onSelectChange),this.layerService.on(`layerChange`,this.onLayerChange),super.onAdd()}onRemove(){this.off(`selectChange`,this.onSelectChange),this.layerService.off(`layerChange`,this.onLayerChange)}getIsMultiple(){return this.controlOption.multiple}}})),jv,Mv=t((()=>{D(),pv(),jv=class extends tv{getDefault(){return{position:Ut.BOTTOMLEFT,name:`logo`,href:`https://l7.antv.antgroup.com/`,img:`https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*GRb1TKp4HcMAAAAAAAAAAAAAARQnAQ`}}onAdd(){let e=j(`div`,`l7-control-logo`);return this.setLogoContent(e),e}onRemove(){return null}setOptions(e){super.setOptions(e),this.checkUpdateOption(e,[`img`,`href`])&&(tn(this.container),this.setLogoContent(this.container))}setLogoContent(e){let{href:t,img:n}=this.controlOption,r=j(`img`);if(r.setAttribute(`src`,n),r.setAttribute(`aria-label`,`AntV logo`),Ht(r),t){let n=j(`a`,`l7-control-logo-link`);n.target=`_blank`,n.href=t,n.rel=`noopener nofollow`,n.setAttribute(`rel`,`noopener nofollow`),n.appendChild(r),e.appendChild(n)}else e.appendChild(r)}}})),Nv,Pv,Fv=t((()=>{Nv={normal:{text:`标准`,img:`https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*qdFDSbvIalgAAAAAAAAAAAAADmJ7AQ/original`},light:{text:`月光银`,img:`https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*d-vcRLzu8WIAAAAAAAAAAAAADmJ7AQ/original`},dark:{text:`幻影黑`,img:`https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*HMbRTI3XnpIAAAAAAAAAAAAADmJ7AQ/original`},fresh:{text:`草色青`,img:`https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*kqaGQ5kjSiAAAAAAAAAAAAAADmJ7AQ/original`},grey:{text:`雅士灰`,img:`https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*XegrTpZIbqAAAAAAAAAAAAAADmJ7AQ/original`},graffiti:{text:`涂鸦`,img:`https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*G5g9SZ_Jg4cAAAAAAAAAAAAADmJ7AQ/original`},macaron:{text:`马卡龙`,img:`https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*irVvQbDpQMwAAAAAAAAAAAAADmJ7AQ/original`},darkblue:{text:`极夜蓝`,img:`https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*lKRzQYB4iR0AAAAAAAAAAAAADmJ7AQ/original`},wine:{text:`酱籽`,img:`https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*orY0T7QL-lwAAAAAAAAAAAAADmJ7AQ/original`}},Pv={normal:{text:`标准`,img:`https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*kIyZTok4Uk0AAAAAAAAAAAAADmJ7AQ/original`},light:{text:`亮`,img:`https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*Z3JRQKDI-cIAAAAAAAAAAAAADmJ7AQ/original`},dark:{text:`暗`,img:`https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*d7HCQbfmyaoAAAAAAAAAAAAADmJ7AQ/original`},satellite:{text:`卫星`,img:`https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*TytUT6pS9okAAAAAAAAAAAAADmJ7AQ/original`},outdoors:{text:`户外`,img:`https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*hWwFSYJEFWsAAAAAAAAAAAAADmJ7AQ/original`}}})),Iv,Lv=t((()=>{Fv(),hv(),fv(),Iv=class extends dv{constructor(...e){super(...e),this.onMapThemeChange=()=>{this.mapsService.setMapStyle(this.selectValue[0])}}getDefault(e){return{...super.getDefault(e),title:`地图样式`,btnIcon:mv(`l7-icon-color`),options:[]}}getStyleOptions(){let e=this.mapsService.getType()===`mapbox`?Pv:Nv;return Object.entries(this.mapsService.getMapStyleConfig()).filter(([e,t])=>typeof t==`string`&&e!==`blank`).map(([t,n])=>{let{text:r,img:i}=e[t]??{};return{text:r??t,value:n,img:i,key:t}})}getMapStyle(){return this.mapsService.getMapStyle()}onAdd(){if(this.controlOption.options?.length||(this.controlOption.options=this.getStyleOptions()),this.controlOption.defaultValue){let e=this.controlOption.defaultValue;this.controlOption.defaultValue=this.controlOption.options.find(t=>t.key===e)?.value??e}else{let e=this.getMapStyle();e?this.controlOption.defaultValue=e:this.mapsService.map.once(`styledata`,()=>{let e=this.mapsService.getMapStyle();this.controlOption.defaultValue=e,this.setSelectValue(e,!1)})}return this.on(`selectChange`,this.onMapThemeChange),super.onAdd()}getIsMultiple(){return!1}}})),Rv,zv=t((()=>{E(),D(),nv(),Rv=class extends tv{constructor(...e){super(...e),this.location=[0,0],this.onMouseMove=e=>{let t=this.location,n=e.lngLat||e.lnglat,{transform:r}=this.controlOption;n&&(t=[n.lng,n.lat]),this.location=t,r&&(t=r(t)),this.insertLocation2HTML(t),this.emit(`locationChange`,t)}}getLocation(){return this.location}getDefault(e){return{...super.getDefault(e),position:Ut.BOTTOMLEFT,transform:([e,t])=>[+(+e).toFixed(6),+(+t).toFixed(6)]}}onAdd(){let e=j(`div`,`l7-control-mouse-location`);return e.innerHTML=`&nbsp;`,this.mapsService.on(`mousemove`,this.onMouseMove),e}onRemove(){this.mapsService.off(`mousemove`,this.onMouseMove)}insertLocation2HTML(e){this.container.innerText=e.join(`, `)}}})),Bv,Vv=t((()=>{D(),pv(),Bv=class extends tv{constructor(...e){super(...e),this.update=()=>{let e=this.mapsService,{maxWidth:t}=this.controlOption,n=e.getSize()[1]/2,r=e.containerToLngLat([0,n]),i=e.containerToLngLat([t,n]),a=c([r.lng,r.lat],[i.lng,i.lat]);this.updateScales(a)}}getDefault(e){return{...super.getDefault(e),name:`scale`,position:Ut.BOTTOMLEFT,maxWidth:100,metric:!0,updateWhenIdle:!1,imperial:!1,lockWidth:!0}}onAdd(){let e=j(`div`,`l7-control-scale`);this.resetScaleLines(e);let{updateWhenIdle:t}=this.controlOption;return this.mapsService.on(t?`moveend`:`mapmove`,this.update),this.mapsService.on(t?`zoomend`:`zoomchange`,this.update),e}onRemove(){let{updateWhenIdle:e}=this.controlOption;this.mapsService.off(e?`zoomend`:`zoomchange`,this.update),this.mapsService.off(e?`moveend`:`mapmove`,this.update)}setOptions(e){super.setOptions(e),this.checkUpdateOption(e,[`lockWidth`,`maxWidth`,`metric`,`updateWhenIdle`,`imperial`])&&this.resetScaleLines(this.container)}updateScales(e){let{metric:t,imperial:n}=this.controlOption;t&&e&&this.updateMetric(e),n&&e&&this.updateImperial(e)}resetScaleLines(e){tn(e);let{metric:t,imperial:n,maxWidth:r,lockWidth:i}=this.controlOption;i&&a(e,`width: ${r}px`),t&&(this.mScale=j(`div`,`l7-control-scale-line`,e)),n&&(this.iScale=j(`div`,`l7-control-scale-line`,e)),this.update()}updateScale(e,t,n){let{maxWidth:r}=this.controlOption;e.style.width=Math.round(r*n)+`px`,e.innerHTML=t}getRoundNum(e){let t=10**((Math.floor(e)+``).length-1),n=e/t;return n=n>=10?10:n>=5?5:n>=3?3:n>=2?2:1,t*n}updateMetric(e){let t=this.getRoundNum(e),n=t<1e3?t+` m`:t/1e3+` km`;this.updateScale(this.mScale,n,t/e)}updateImperial(e){let t=e*3.2808399,n,r,i;t>5280?(n=t/5280,r=this.getRoundNum(n),this.updateScale(this.iScale,r+` mi`,r/n)):(i=this.getRoundNum(t),this.updateScale(this.iScale,i+` ft`,i/t))}}})),Hv,Uv=t((()=>{E(),N_(),D(),pv(),Hv=class extends tv{constructor(...e){super(...e),this.isMoving=!1,this.move=e=>{switch(e.stopPropagation(),e.type){case`touchcancel`:case`touchend`:case`mouseup`:this.isMoving=!1,[`mouseup`,`mousemove`,`touchend`,`touchcancel`,`touchmove`].forEach(e=>{document.removeEventListener(e,this.move)}),this.scene?.render();break;case`mousedown`:case`touchstart`:this.isMoving=!0,[`mouseup`,`mousemove`,`touchend`,`touchcancel`,`touchmove`].forEach(e=>{document.addEventListener(e,this.move)});case`mousemove`:case`touchmove`:if(this.isMoving){if(this.controlOption.orientation===`vertical`){let t;if(`pageX`in e?t=e.pageX:e.touches&&e.touches.length&&e.touches[0].pageX?t=e.touches[0].pageX:e.changedTouches&&e.changedTouches.length&&(t=e.changedTouches[0].pageX),!t)break;let n=this.getContainerDOMRect(),r=this.getContainerSize(),i=r[0],a=n?.left||0,o=t-a+window.scrollX-document.documentElement.clientLeft,s=i-Math.min(Math.max(0,i-o),i),c=s/i;this.setOptions({ratio:c}),this.emit(`moving`,{size:[s,r[1]],ratio:[c,0]})}else{let t;if(`pageY`in e?t=e.pageY:e.touches&&e.touches.length&&e.touches[0].pageY?t=e.touches[0].pageY:e.changedTouches&&e.changedTouches.length&&(t=e.changedTouches[0].pageY),!t)break;let n=this.getContainerDOMRect(),r=this.getContainerSize(),i=r[1],a=n?.top||0,o=t-a+window.scrollY-document.documentElement.clientTop,s=i-Math.min(Math.max(0,i-o),i),c=s/i;this.setOptions({ratio:c}),this.emit(`moving`,{size:[r[0],s],ratio:[0,c]})}}}},this.getMaskLayer=()=>(console.log(this.getMaskGeoData()),new Bh({visible:!1}).source(this.getMaskGeoData()).shape(`fill`).color(`red`).style({opacity:.1})),this.updateMask=()=>{if(!this.mapsService)return;let e=this.getMaskGeoData();this.maskLayer?.setData(e)}}getDefault(){return{...super.getDefault(),layers:[],rightLayers:[],ratio:.5,orientation:`vertical`}}onAdd(){let e=j(`div`,`l7-control-swipe`);j(`button`,`l7-control-swipe__button`,e);let{orientation:t=`vertical`,ratio:n=.5}=this.controlOption;return t===`horizontal`?(e.style.top=n*100+`%`,e.style.left=``):(e.style.left=n*100+`%`,e.style.top=``),e.classList.add(t),e}addTo(e){this.mapsService=e.mapService,this.renderService=e.rendererService,this.layerService=e.layerService,this.controlService=e.controlService,this.configService=e.globalConfigService,this.scene=e.sceneService,this.sceneContainer=e,this.isShow=!0,this.container=this.onAdd();let{className:t,style:n,layers:r,rightLayers:i}=this.controlOption;t&&this.setClassName(t),n&&this.setStyle(n),this.mapsService.getMarkerContainer().appendChild(this.container),this.maskLayer=this.getMaskLayer(),this.registerEvent();let a=Oe(e);return this.maskLayer.setContainer(a),this.scene.addLayer(this.maskLayer),this.addMaskToLayers(r,!1),this.addMaskToLayers(i,!0),this.emit(`add`,this),this}onRemove(){if(this.maskLayer){let{layers:e,rightLayers:t}=this.controlOption;this.removeMaskFromLayers(e),this.removeMaskFromLayers(t),this.layerService?.remove(this.maskLayer)}this.unRegisterEvent(),this.removeAllListeners()}show(){let e=this.container;on(e,`l7-control-swipe_hide`);let{layers:t,rightLayers:n}=this.controlOption;t.forEach(e=>e.enableMask()),n.forEach(e=>e.enableMask()),this.scene?.render(),this.isShow=!0,this.emit(`show`,this)}hide(){let e=this.container;Ee(e,`l7-control-swipe_hide`);let{layers:t,rightLayers:n}=this.controlOption;t.forEach(e=>e.disableMask()),n.forEach(e=>e.disableMask()),this.scene?.render(),this.isShow=!1,this.emit(`hide`,this)}setOptions(e){let t={...this.controlOption,...e};if(e.className&&this.setClassName(e.className),e.style&&this.setStyle(e.style),(e.orientation||e.ratio!==void 0)&&this.setOrientationAndRatio(t.orientation,t.ratio),e.layers){let t=e.layers,n=this.controlOption.layers;this.setLayers(t,n,!1)}if(e.rightLayers){let t=e.rightLayers,n=this.controlOption.rightLayers;this.setLayers(t,n,!0)}this.controlOption=t,this.updateMask()}registerEvent(){this.container.addEventListener(`mousedown`,this.move),this.container.addEventListener(`touchstart`,this.move),this.mapsService.on(`camerachange`,this.updateMask)}unRegisterEvent(){this.container.removeEventListener(`mousedown`,this.move),this.container.removeEventListener(`touchstart`,this.move),this.mapsService?.off(`camerachange`,this.updateMask)}setOrientationAndRatio(e=`vertical`,t=.5){this.container.classList.remove(`horizontal`,`vertical`),this.container.classList.add(e),e===`horizontal`?(this.container.style.top=t*100+`%`,this.container.style.left=``):(this.container.style.left=t*100+`%`,this.container.style.top=``)}setLayers(e,t,n=!1){let r=e.filter(e=>t.includes(e)===!1),i=t.filter(t=>e.includes(t)===!1);this.addMaskToLayers(r,n),this.removeMaskFromLayers(i)}addMaskToLayers(e,t){e.forEach(e=>{e.updateLayerConfig({maskInside:!t}),e.addMask(this.maskLayer)})}removeMaskFromLayers(e){e.forEach(e=>{e.updateLayerConfig({maskInside:!0}),e.removeMask(this.maskLayer)})}getMaskGeoData(){let{ratio:e=.5,orientation:t=`vertical`}=this.controlOption,n=t===`vertical`,[r,i]=this.getBounds(),[a,o]=r,[s,c]=i,l;if(n){let t=a+(s-a)*e;l=[[a,c],[t,c],[t,o],r,[a,c]]}else{let t=this.getContainerSize(),n=this.mapsService.containerToLngLat([t[0],t[1]*e]).lat;l=[[a,c],i,[s,n],[a,n],[a,c]]}return{type:`FeatureCollection`,features:[{type:`Feature`,properties:{},geometry:{type:`Polygon`,coordinates:[l]}}]}}getContainerDOMRect(){return this.mapsService.getContainer()?.getBoundingClientRect()}getContainerSize(){return this.mapsService.getSize()}getBounds(){return this.mapsService.getBounds()}addLayer(e,t=!1){let n=Array.isArray(e)?e:[e];if(t){let e=this.controlOption.rightLayers.concat(...n);this.setOptions({rightLayers:e})}else{let e=this.controlOption.layers.concat(...n);this.setOptions({layers:e})}}removeLayer(e){let t=Array.isArray(e)?e:[e],n=this.controlOption.layers.filter(e=>t.includes(e)),r=this.controlOption.rightLayers.filter(e=>t.includes(e));this.setOptions({layers:n,rightLayers:r})}removeLayers(){this.setOptions({layers:[],rightLayers:[]})}}})),Wv,Gv=t((()=>{E(),D(),hv(),pv(),Wv=class extends tv{constructor(...e){super(...e),this.zoomIn=()=>{!this.disabled&&this.mapsService.getZoom()<this.mapsService.getMaxZoom()&&this.mapsService.zoomIn()},this.zoomOut=()=>{!this.disabled&&this.mapsService.getZoom()>this.mapsService.getMinZoom()&&this.mapsService.zoomOut()},this.updateDisabled=()=>{let e=this.mapsService;this.zoomInButton.removeAttribute(`disabled`),this.zoomOutButton.removeAttribute(`disabled`),(this.disabled||e.getZoom()<=e.getMinZoom())&&this.zoomOutButton.setAttribute(`disabled`,`true`),this.controlOption.showZoom&&this.zoomNumDiv&&(this.zoomNumDiv.innerText=String(Math.floor(e.getZoom()))),(this.disabled||e.getZoom()>=e.getMaxZoom())&&this.zoomInButton.setAttribute(`disabled`,`true`)}}getDefault(e){return{...super.getDefault(e),position:Ut.BOTTOMRIGHT,name:`zoom`,zoomInText:mv(`l7-icon-enlarge`),zoomInTitle:`Zoom in`,zoomOutText:mv(`l7-icon-narrow`),zoomOutTitle:`Zoom out`,showZoom:!1}}setOptions(e){super.setOptions(e),this.checkUpdateOption(e,[`zoomInText`,`zoomInTitle`,`zoomOutText`,`zoomOutTitle`,`showZoom`])&&this.resetButtonGroup(this.container)}onAdd(){let e=j(`div`,`l7-control-zoom`);return this.resetButtonGroup(e),this.mapsService.on(`zoomend`,this.updateDisabled),this.mapsService.on(`zoomchange`,this.updateDisabled),e}onRemove(){this.mapsService.off(`zoomend`,this.updateDisabled),this.mapsService.off(`zoomchange`,this.updateDisabled)}disable(){return this.disabled=!0,this.updateDisabled(),this}enable(){return this.disabled=!1,this.updateDisabled(),this}resetButtonGroup(e){tn(e),this.zoomInButton=this.createButton(this.controlOption.zoomInText,this.controlOption.zoomInTitle,`l7-button-control`,e,this.zoomIn),this.controlOption.showZoom&&(this.zoomNumDiv=this.createButton(`0`,``,`l7-button-control l7-control-zoom__number`,e)),this.zoomOutButton=this.createButton(this.controlOption.zoomOutText,this.controlOption.zoomOutTitle,`l7-button-control`,e,this.zoomOut),this.updateDisabled()}createButton(e,t,n,r,i){let a=j(`button`,n,r);return typeof e==`string`?a.innerHTML=e:a.append(e),a.title=t,i&&a.addEventListener(`click`,i),a}}})),Kv=t((()=>{})),qv,Jv,Yv=t((()=>{D(),qv=e(qt()),hv(),Jv=class extends qv.EventEmitter{get lngLat(){return this.popupOption.lngLat??{lng:0,lat:0}}set lngLat(e){this.popupOption.lngLat=e}constructor(e){super(),this.isShow=!0,this.rafId=null,this.onMouseMove=e=>{let{left:t=0,top:n=0}=this.mapsService.getMapContainer()?.getBoundingClientRect()??{};this.setPopupPosition(e.clientX-t,e.clientY-n)},this.updateLngLatPosition=()=>{if(!this.mapsService||this.popupOption.followCursor)return;let{lng:e,lat:t}=this.lngLat,{x:n,y:r}=this.mapsService.lngLatToContainer([e,t]);this.setPopupPosition(n,r)},this.updateLngLatPositionWhenZoom=e=>{if(!this.mapsService||this.popupOption.followCursor)return;let t=e.map,n=t.getSize();n.x/=2,n.y/=2;let r=e.center,i=e.zoom,a=t.DE(this.lngLat,i,r);a.x=Math.round(a.x),a.y=Math.round(a.y),this.setPopupPosition(a.x,a.y,!0)},this.onKeyDown=e=>{e.keyCode===27&&this.remove()},this.onCloseButtonClick=e=>{e.stopPropagation&&e.stopPropagation(),this.hide()},this.updatePosition=(e,t=!0)=>{let n=!!this.lngLat,{className:r,style:i,maxWidth:a,anchor:o,stopPropagation:s}=this.popupOption;if(!this.mapsService||!n||!this.content)return;let c=this.mapsService.getMarkerContainer();if(!this.container&&c&&(this.container=j(`div`,`l7-popup ${r??``} ${this.isShow?``:`l7-popup-hide`}`,c),i&&this.container.setAttribute(`style`,i),this.tip=j(`div`,`l7-popup-tip`,this.container),this.container.appendChild(this.content),s&&[`mousemove`,`mousedown`,`mouseup`,`click`,`dblclick`].forEach(e=>{this.container.addEventListener(e,e=>{e.stopPropagation()})}),this.container.style.whiteSpace=`nowrap`),t?this.updateLngLatPositionWhenZoom(e):this.updateLngLatPosition(),ht(this.container,`${_e[o]}`),b(this.container,o,`popup`),a){let{width:e}=this.container.getBoundingClientRect();e>parseFloat(a)&&(this.container.style.width=a)}else this.container.style.removeProperty(`width`)},this.updateWhenZoom=e=>{this.updatePosition(e,!0)},this.update=()=>{this.rafId===null&&(this.rafId=requestAnimationFrame(()=>{this.rafId=null,this.updatePosition(null,!1)}))},this.popupOption={...this.getDefault(e??{}),...e};let{lngLat:t}=this.popupOption;t&&(this.lngLat=t)}getIsShow(){return this.isShow}addTo(e){this.mapsService=e.mapService,this.sceneService=e.sceneService,this.layerService=e.layerService,this.mapsService.on(`camerachange`,this.update),this.mapsService.on(`viewchange`,this.update),this.scene=e,this.update(),this.updateCloseOnClick(),this.updateCloseOnEsc(),this.updateFollowCursor();let{html:t,text:n,title:r}=this.popupOption;return t?this.setHTML(t):n&&this.setText(n),r&&this.setTitle(r),this.emit(`open`),this}remove(){if(this?.isOpen())return this.rafId!==null&&(cancelAnimationFrame(this.rafId),this.rafId=null),this.content&&jt(this.content),this.container&&(jt(this.container),delete this.container),this.mapsService&&(this.mapsService.off(`camerachange`,this.update),this.mapsService.off(`viewchange`,this.update),this.updateCloseOnClick(!0),this.updateCloseOnEsc(!0),this.updateFollowCursor(!0),delete this.mapsService),this.emit(`close`),this}getOptions(){return this.popupOption}setOptions(e){this.show();let{className:t}=this.popupOption;return this.popupOption={...this.popupOption,...e},this.checkUpdateOption(e,[`html`,`text`,`title`,`closeButton`,`closeButtonOffsets`,`maxWidth`,`anchor`,`stopPropagation`,`lngLat`,`offsets`])&&(this.container&&=(jt(this.container),void 0),this.popupOption.html?this.setHTML(this.popupOption.html):this.popupOption.text&&this.setText(this.popupOption.text),this.popupOption.title&&this.setTitle(this.popupOption.title)),this.checkUpdateOption(e,[`closeOnEsc`])&&this.updateCloseOnEsc(),this.checkUpdateOption(e,[`closeOnClick`])&&this.updateCloseOnClick(),this.checkUpdateOption(e,[`followCursor`])&&this.updateFollowCursor(),this.checkUpdateOption(e,[`html`])&&e.html?this.setHTML(e.html):this.checkUpdateOption(e,[`text`])&&e.text&&this.setText(e.text),this.checkUpdateOption(e,[`className`])&&(t&&this.container.classList.remove(t??``),this.container.classList.add(e.className??``)),this.checkUpdateOption(e,[`style`])&&a(this.container,e.style??``),this.checkUpdateOption(e,[`lngLat`])&&e.lngLat&&this.setLnglat(e.lngLat),this}open(){return this.addTo(this.scene),this}close(){return this.remove(),this}show(){if(!this.isShow)return this.container&&on(this.container,`l7-popup-hide`),this.isShow=!0,this.emit(`show`),this}hide(){if(this.isShow)return this.container&&Ee(this.container,`l7-popup-hide`),this.isShow=!1,this.emit(`hide`),this}setHTML(e){return this.popupOption.html=e,this.setDOMContent(e)}setText(e){return this.popupOption.text=e,this.setDOMContent(window.document.createTextNode(e))}setTitle(e){this.show(),this.popupOption.title=e,e?(this.contentTitle||(this.contentTitle=j(`div`,`l7-popup-content__title`),this.content.firstChild?this.content.insertBefore(this.contentTitle,this.content.firstChild):this.content.append(this.contentTitle)),tn(this.contentTitle),pt(this.contentTitle,e)):this.contentTitle&&=(jt(this.contentTitle),void 0)}panToPopup(){let{lng:e,lat:t}=this.lngLat;return this.popupOption.autoPan&&this.mapsService.panTo([e,t]),this}setLngLat(e){return this.setLnglat(e)}setLnglat(e){return this.show(),this.lngLat=e,Array.isArray(e)&&(this.lngLat={lng:e[0],lat:e[1]}),this.mapsService&&(this.mapsService.off(`camerachange`,this.update),this.mapsService.off(`viewchange`,this.update),this.mapsService.on(`camerachange`,this.update),this.mapsService.on(`viewchange`,this.update)),this.update(),this.popupOption.autoPan&&setTimeout(()=>{this.panToPopup()},0),this}getLnglat(){return this.lngLat}setMaxWidth(e){return this.popupOption.maxWidth=e,this.update(),this}isOpen(){return!!this.mapsService}getDefault(e){return{closeButton:!0,closeOnClick:!1,maxWidth:`240px`,offsets:[0,0],anchor:we.BOTTOM,stopPropagation:!0,autoPan:!1,autoClose:!0,closeOnEsc:!1,followCursor:!1}}setDOMContent(e){return this.show(),this.createContent(),pt(this.contentPanel,e),this.update(),this}updateCloseOnClick(e){let t=this.mapsService;t&&(t?.off(`click`,this.onCloseButtonClick),this.popupOption.closeOnClick&&!e&&requestAnimationFrame(()=>{t?.on(`click`,this.onCloseButtonClick)}))}updateCloseOnEsc(e){window.removeEventListener(`keydown`,this.onKeyDown),this.popupOption.closeOnEsc&&!e&&window.addEventListener(`keydown`,this.onKeyDown)}updateFollowCursor(e){let t=this.mapsService?.getContainer();t&&(t?.removeEventListener(`mousemove`,this.onMouseMove),this.popupOption.followCursor&&!e&&t?.addEventListener(`mousemove`,this.onMouseMove))}createContent(){if(this.content&&jt(this.content),this.contentTitle=void 0,this.content=j(`div`,`l7-popup-content`,this.container),this.setTitle(this.popupOption.title),this.popupOption.closeButton){let e=mv(`l7-icon-guanbi`);Ee(e,`l7-popup-close-button`),this.content.appendChild(e),this.popupOption.closeButtonOffsets&&(e.style.right=this.popupOption.closeButtonOffsets[0]+`px`,e.style.top=this.popupOption.closeButtonOffsets[1]+`px`),e.setAttribute(`aria-label`,`Close popup`),e.addEventListener(`click`,()=>{this.hide()}),e.addEventListener(`pointerup`,e=>{e.stopPropagation()}),e.addEventListener(`pointerdown`,e=>{e.stopPropagation()}),this.closeButton=e}else this.closeButton=void 0;this.contentPanel=j(`div`,`l7-popup-content__panel`,this.content)}setPopupPosition(e,t,n=!1){if(this.container){let{offsets:r}=this.popupOption;this.container.style.left=e+r[0]+`px`,this.container.style.top=t-r[1]+`px`,n?this.container.style.transition=`left 0.25s cubic-bezier(0,0,0.25,1), top 0.25s cubic-bezier(0,0,0.25,1)`:this.container.style.transition=``}}checkUpdateOption(e,t){return t.some(t=>t in e)}}})),Xv,Zv,Qv=t((()=>{D(),Yv(),{get:Xv}=vt,Zv=class extends Jv{constructor(...e){super(...e),this.layerClickCountByFrame=0,this.layerConfigMap=new WeakMap,this.onLayerClick=(e,t)=>{requestAnimationFrame(()=>{if(this.popupOption.closeOnClick&&this.layerClickCountByFrame++,this.isShow&&this.isSameFeature(e,t.featureId))this.hide();else{let{title:n,content:r}=this.getLayerInfoFrag(e,t);this.setDOMContent(r),this.setLnglat(t.lngLat),this.setTitle(n),this.setDisplayFeatureInfo({layer:e,featureId:t.featureId}),this.show()}})},this.onSceneClick=()=>{this.layerClickCountByFrame=0,requestAnimationFrame(()=>{this.layerClickCountByFrame||this.hide()})},this.onLayerHide=()=>{this.hide(),this.setDisplayFeatureInfo(void 0)},this.updateCloseOnClick=()=>{}}get layerConfigItems(){let{config:e,items:t}=this.popupOption;return e??t??[]}getActualTriggerEvent(){let e=this.popupOption.trigger??`hover`;return e===`click`?Ye()?`click`:`touchend`:e}addTo(e){return super.addTo(e),this.bindLayerEvent(),this.hide(),this}remove(){return super.remove(),this.unbindLayerEvent(),this}setOptions(e){this.unbindLayerEvent();let t={...e},n=t.trigger||this.popupOption.trigger,r=(t.items||this.popupOption.items)?.length===0;t.followCursor=n===`hover`&&!r;let i=this.isShow;return super.setOptions(t),this.bindLayerEvent(),(r||!i)&&this.hide(),this}getDefault(e){let t=e.trigger??`hover`,n=t===`hover`;return{...super.getDefault(e),trigger:t,followCursor:n,lngLat:{lng:0,lat:0},offsets:[0,10],closeButton:!1,closeOnClick:!0,autoClose:!1,closeOnEsc:!1}}bindLayerEvent(){let{trigger:e,closeOnClick:t}=this.popupOption,n=this.getActualTriggerEvent();this.layerConfigItems.forEach(r=>{let i=this.getLayerByConfig(r);if(!i)return;let a={...r};if(e===`hover`){let e=this.onLayerMouseMove.bind(this,i),t=this.onLayerMouseOut.bind(this,i);a.onMouseMove=e,a.onMouseOut=t,i?.on(`mousemove`,e),i?.on(`mouseout`,t)}else{let e=this.onLayerClick.bind(this,i);a.onClick=e,i?.on(n,e);let r=this.mapsService?.getMapContainer();r&&t&&r.addEventListener(n,this.onSceneClick)}let o=i?.getSource?.(),s=this.onSourceUpdate.bind(this);o?.on(`update`,s),a.onSourceUpdate=s,this.layerConfigMap.set(i,a)})}unbindLayerEvent(){let e=this.getActualTriggerEvent();this.layerConfigItems.forEach(t=>{let n=this.getLayerByConfig(t),r=n&&this.layerConfigMap.get(n);if(!r)return;let{onMouseMove:i,onMouseOut:a,onClick:o,onSourceUpdate:s}=r;i&&n.off(`mousemove`,i),a&&n.off(`mouseout`,a),o&&n.off(e,o),s&&n?.getSource()?.off(`update`,s);let c=this.mapsService?.getMapContainer();c&&c.removeEventListener(e,this.onSceneClick)})}onLayerMouseMove(e,t){if(!this.isSameFeature(e,t.featureId)){let{title:n,content:r}=this.getLayerInfoFrag(e,t);this.setDOMContent(r),this.setTitle(n),this.setDisplayFeatureInfo({layer:e,featureId:t.featureId}),this.show()}}onLayerMouseOut(e){this.setDisplayFeatureInfo(void 0),this.isShow&&this.hide()}onSourceUpdate(){this.hide(),this.setDisplayFeatureInfo(void 0)}getLayerInfoFrag(e,t){let n=this.layerConfigMap.get(e),r,i=document.createDocumentFragment();if(n){let e=t.feature;e.type===`Feature`&&`properties`in e&&`geometry`in e&&(e=e.properties);let{title:a,fields:o,customContent:s}=n;if(a){r=document.createDocumentFragment();let t=a instanceof Function?a(e):a;pt(r,t)}if(s){let t=s instanceof Function?s(e):s;pt(i,t)}else o?.length&&o?.forEach(n=>{let{field:r,formatField:a,formatValue:o,getValue:s}=typeof n==`string`?{field:n}:n,c=j(`div`,`l7-layer-popup__row`),l=s?s(t.feature):Xv(e,r),u=(a instanceof Function?a(r,e):a)??r,d=(o instanceof Function?o(l,e):o)??l,f=j(`span`,`l7-layer-popup__key`,c);pt(f,u),pt(f,document.createTextNode(`：`));let p=j(`span`,`l7-layer-popup__value`,c);Array.isArray(d)&&d.every(e=>!(e instanceof Object))&&(d=d.map(e=>String(e)).join(`,`)),pt(p,d),i.appendChild(c)})}return{title:r,content:i}}getLayerByConfig(e){let t=e.layer;if(t instanceof Object)return t;if(typeof t==`string`)return this.layerService.getLayer(t)||this.layerService.getLayerByName(t)}isSameFeature(e,t){let n=this.displayFeatureInfo;return n&&e===n.layer&&t===n.featureId}setDisplayFeatureInfo(e){let t=this.displayFeatureInfo;t&&t.layer.off(`hide`,this.onLayerHide),e&&e.layer.on(`hide`,this.onLayerHide),this.displayFeatureInfo=e}}})),$v=t((()=>{B_(),G_(),$_(),pv(),_v(),Tv(),Dv(),Av(),Mv(),Lv(),zv(),Vv(),Uv(),Gv(),Kv(),Qv(),Yv()}));function ey(e){return e==null}var ty=t((()=>{}));function ny(e){return Array.isArray(e)}var ry=t((()=>{})),iy,ay=t((()=>{iy=function(e){return typeof e==`object`&&!!e}})),oy,sy,cy=t((()=>{oy={}.toString,sy=function(e,t){return oy.call(e)===`[object `+t+`]`}})),ly,uy=t((()=>{ay(),cy(),ly=function(e){if(!iy(e)||!sy(e,`Object`))return!1;if(Object.getPrototypeOf(e)===null)return!0;for(var t=e;Object.getPrototypeOf(t)!==null;)t=Object.getPrototypeOf(t);return Object.getPrototypeOf(e)===t}})),dy,fy=t((()=>{dy=function(e,t,n){return e<t?t:e>n?n:e}}));function py(e){return typeof e==`number`}var my=t((()=>{}));function hy(e){return e===null}var gy=t((()=>{})),_y,vy=t((()=>{_y=function(e){return e===void 0}}));function yy(e,t){if(Object.hasOwn)return Object.hasOwn(e,t);if(e==null)throw TypeError(`Cannot convert undefined or null to object`);return Object.prototype.hasOwnProperty.call(Object(e),t)}function by(e,t,n,r){for(var i in n||=0,r||=xy,t)if(yy(t,i)){var a=t[i];a!==null&&ly(a)?(ly(e[i])||(e[i]={}),n<r?by(e[i],a,n+1,r):e[i]=t[i]):ny(a)?(e[i]=[],e[i]=e[i].concat(a)):a!==void 0&&(e[i]=a)}}var xy,Sy,Cy=t((()=>{ry(),uy(),xy=5,Sy=function(e){for(var t=[...arguments].slice(1),n=0;n<t.length;n+=1)by(e,t[n]);return e}})),wy,Ty=t((()=>{wy=(function(e){return e})})),Ey=t((()=>{ty(),ry(),uy(),fy(),my(),cy(),gy(),ay(),vy(),Cy(),Ty()})),Dy=t((()=>{Ey()})),Oy=t((()=>{})),ky=t((()=>{})),Ay=t((()=>{ky()})),jy=t((()=>{})),My=t((()=>{})),Ny=t((()=>{Dy(),Oy(),Ay(),Ey(),jy(),My()})),Py=r(((e,t)=>{var n=Object.prototype.hasOwnProperty,r=`~`;function i(){}Object.create&&(i.prototype=Object.create(null),new i().__proto__||(r=!1));function a(e,t,n){this.fn=e,this.context=t,this.once=n||!1}function o(e,t,n,i,o){if(typeof n!=`function`)throw TypeError(`The listener must be a function`);var s=new a(n,i||e,o),c=r?r+t:t;return e._events[c]?e._events[c].fn?e._events[c]=[e._events[c],s]:e._events[c].push(s):(e._events[c]=s,e._eventsCount++),e}function s(e,t){--e._eventsCount===0?e._events=new i:delete e._events[t]}function c(){this._events=new i,this._eventsCount=0}c.prototype.eventNames=function(){var e=[],t,i;if(this._eventsCount===0)return e;for(i in t=this._events)n.call(t,i)&&e.push(r?i.slice(1):i);return Object.getOwnPropertySymbols?e.concat(Object.getOwnPropertySymbols(t)):e},c.prototype.listeners=function(e){var t=r?r+e:e,n=this._events[t];if(!n)return[];if(n.fn)return[n.fn];for(var i=0,a=n.length,o=Array(a);i<a;i++)o[i]=n[i].fn;return o},c.prototype.listenerCount=function(e){var t=r?r+e:e,n=this._events[t];return n?n.fn?1:n.length:0},c.prototype.emit=function(e,t,n,i,a,o){var s=r?r+e:e;if(!this._events[s])return!1;var c=this._events[s],l=arguments.length,u,d;if(c.fn){switch(c.once&&this.removeListener(e,c.fn,void 0,!0),l){case 1:return c.fn.call(c.context),!0;case 2:return c.fn.call(c.context,t),!0;case 3:return c.fn.call(c.context,t,n),!0;case 4:return c.fn.call(c.context,t,n,i),!0;case 5:return c.fn.call(c.context,t,n,i,a),!0;case 6:return c.fn.call(c.context,t,n,i,a,o),!0}for(d=1,u=Array(l-1);d<l;d++)u[d-1]=arguments[d];c.fn.apply(c.context,u)}else{var f=c.length,p;for(d=0;d<f;d++)switch(c[d].once&&this.removeListener(e,c[d].fn,void 0,!0),l){case 1:c[d].fn.call(c[d].context);break;case 2:c[d].fn.call(c[d].context,t);break;case 3:c[d].fn.call(c[d].context,t,n);break;case 4:c[d].fn.call(c[d].context,t,n,i);break;default:if(!u)for(p=1,u=Array(l-1);p<l;p++)u[p-1]=arguments[p];c[d].fn.apply(c[d].context,u)}}return!0},c.prototype.on=function(e,t,n){return o(this,e,t,n,!1)},c.prototype.once=function(e,t,n){return o(this,e,t,n,!0)},c.prototype.removeListener=function(e,t,n,i){var a=r?r+e:e;if(!this._events[a])return this;if(!t)return s(this,a),this;var o=this._events[a];if(o.fn)o.fn!==t||i&&!o.once||n&&o.context!==n||s(this,a);else{for(var c=0,l=[],u=o.length;c<u;c++)(o[c].fn!==t||i&&!o[c].once||n&&o[c].context!==n)&&l.push(o[c]);l.length?this._events[a]=l.length===1?l[0]:l:s(this,a)}return this},c.prototype.removeAllListeners=function(e){var t;return e?(t=r?r+e:e,this._events[t]&&s(this,t)):(this._events=new i,this._eventsCount=0),this},c.prototype.off=c.prototype.removeListener,c.prototype.addListener=c.prototype.on,c.prefixed=r,c.EventEmitter=c,t!==void 0&&(t.exports=c)})),Fy,Iy,Ly=t((()=>{Fy=e(Py(),1),Iy=Fy.default}));function Ry(e){return e}function I(e,t,n){return e<<16|t<<8|n}function zy(e){return e>>>8&255}function By(e){return e>>>16&255}function Vy(e){return e&255}function Hy(e){switch(e){case q.F32:case q.U32:case q.S32:return 4;case q.U16:case q.S16:case q.F16:return 2;case q.U8:case q.S8:return 1;default:throw Error(`whoops`)}}function Uy(e){return Hy(By(e))}function Wy(e){return Hy(By(e))*Ry(zy(e))}function Gy(e){var t=Vy(e);if(t&Y.Depth)return SS.Depth;if(t&Y.Normalized)return SS.Float;var n=By(e);if(n===q.F16||n===q.F32)return SS.Float;if(n===q.U8||n===q.U16||n===q.U32)return SS.Uint;if(n===q.S8||n===q.S16||n===q.S32)return SS.Sint;throw Error(`whoops`)}function L(e,t){if(t===void 0&&(t=``),!e)throw Error(`Assert fail: ${t}`)}function Ky(e){if(e!=null)return e;throw Error(`Missing object`)}function qy(e,t){return e.r===t.r&&e.g===t.g&&e.b===t.b&&e.a===t.a}function Jy(e,t){e.r=t.r,e.g=t.g,e.b=t.b,e.a=t.a}function Yy(e){return{r:e.r,g:e.g,b:e.b,a:e.a}}function Xy(e,t,n,r){return r===void 0&&(r=1),{r:e,g:t,b:n,a:r}}function Zy(e){return!(!e||e&e-1)}function Qy(e,t){return e??t}function $y(e){return e===void 0?null:e}function eb(e,t){var n=t-1;return e+n&~n}function tb(e,t){for(var n=Array(e),r=0;r<e;r++)n[r]=t();return n}function nb(e,t){return t===void 0&&(t=1),e.split(`
`).map(function(e,n){return`${rb(``+(t+n),4,` `)}  ${e}`}).join(`
`)}function rb(e,t,n){for(n===void 0&&(n=`0`);e.length<t;)e=`${n}${e}`;return e}function ib(e,t){e.blendDstFactor=t.blendDstFactor,e.blendSrcFactor=t.blendSrcFactor,e.blendMode=t.blendMode}function ab(e,t){return e===void 0&&(e={}),e.compare=t.compare,e.depthFailOp=t.depthFailOp,e.passOp=t.passOp,e.failOp=t.failOp,e.mask=t.mask,e}function ob(e,t){return e===void 0&&(e={rgbBlendState:{},alphaBlendState:{},channelWriteMask:0}),ib(e.rgbBlendState,t.rgbBlendState),ib(e.alphaBlendState,t.alphaBlendState),e.channelWriteMask=t.channelWriteMask,e}function sb(e,t){e.length!==t.length&&(e.length=t.length);for(var n=0;n<t.length;n++)e[n]=ob(e[n],t[n])}function cb(e,t){t.attachmentsState!==void 0&&sb(e.attachmentsState,t.attachmentsState),e.blendConstant&&t.blendConstant&&Jy(e.blendConstant,t.blendConstant),e.depthCompare=Qy(t.depthCompare,e.depthCompare),e.depthWrite=Qy(t.depthWrite,e.depthWrite),e.stencilWrite=Qy(t.stencilWrite,e.stencilWrite),e.stencilFront&&t.stencilFront&&ab(e.stencilFront,t.stencilFront),e.stencilBack&&t.stencilBack&&ab(e.stencilBack,t.stencilBack),e.cullMode=Qy(t.cullMode,e.cullMode),e.frontFace=Qy(t.frontFace,e.frontFace),e.polygonOffset=Qy(t.polygonOffset,e.polygonOffset),e.polygonOffsetFactor=Qy(t.polygonOffsetFactor,e.polygonOffsetFactor),e.polygonOffsetUnits=Qy(t.polygonOffsetUnits,e.polygonOffsetUnits)}function lb(e){var t=Object.assign({},e);return t.attachmentsState=[],sb(t.attachmentsState,e.attachmentsState),t.blendConstant=t.blendConstant&&Yy(t.blendConstant),t.stencilFront=ab(void 0,e.stencilFront),t.stencilBack=ab(void 0,e.stencilBack),t}function ub(e,t){e===void 0&&(e=null),t===void 0&&(t=kS);var n=lb(t);return e!==null&&cb(n,e),n}function db(e,t,n){if(e.length!==t.length)return!1;for(var r=0;r<e.length;r++)if(!n(e[r],t[r]))return!1;return!0}function fb(e,t){for(var n=Array(e.length),r=0;r<e.length;r++)n[r]=t(e[r]);return n}function pb(e,t){return e.texture===t.texture&&e.binding===t.binding}function mb(e,t){return e.buffer===t.buffer&&e.size===t.size&&e.binding===t.binding&&e.offset===t.offset}function hb(e,t){return e===null?t===null:t!==null&&e.sampler===t.sampler&&e.texture===t.texture&&e.dimension===t.dimension&&e.formatKind===t.formatKind&&e.comparison===t.comparison}function gb(e,t){return e.samplerBindings=e.samplerBindings||[],e.uniformBufferBindings=e.uniformBufferBindings||[],e.storageBufferBindings=e.storageBufferBindings||[],e.storageTextureBindings=e.storageTextureBindings||[],t.samplerBindings=t.samplerBindings||[],t.uniformBufferBindings=t.uniformBufferBindings||[],t.storageBufferBindings=t.storageBufferBindings||[],t.storageTextureBindings=t.storageTextureBindings||[],!(e.samplerBindings.length!==t.samplerBindings.length||!db(e.samplerBindings,t.samplerBindings,hb)||!db(e.uniformBufferBindings,t.uniformBufferBindings,mb)||!db(e.storageBufferBindings,t.storageBufferBindings,mb)||!db(e.storageTextureBindings,t.storageTextureBindings,pb))}function _b(e,t){return e.blendMode==t.blendMode&&e.blendSrcFactor===t.blendSrcFactor&&e.blendDstFactor===t.blendDstFactor}function vb(e,t){return!(!_b(e.rgbBlendState,t.rgbBlendState)||!_b(e.alphaBlendState,t.alphaBlendState)||e.channelWriteMask!==t.channelWriteMask)}function yb(e,t){return e.compare==t.compare&&e.depthFailOp===t.depthFailOp&&e.failOp===t.failOp&&e.passOp===t.passOp&&e.mask===t.mask}function bb(e,t){return!db(e.attachmentsState,t.attachmentsState,vb)||e.blendConstant&&t.blendConstant&&!qy(e.blendConstant,t.blendConstant)||e.stencilFront&&t.stencilFront&&!yb(e.stencilFront,t.stencilFront)||e.stencilBack&&t.stencilBack&&!yb(e.stencilBack,t.stencilBack)?!1:e.depthCompare===t.depthCompare&&e.depthWrite===t.depthWrite&&e.stencilWrite===t.stencilWrite&&e.cullMode===t.cullMode&&e.frontFace===t.frontFace&&e.polygonOffset===t.polygonOffset&&e.polygonOffsetFactor===t.polygonOffsetFactor&&e.polygonOffsetUnits===t.polygonOffsetUnits}function xb(e,t){return e.id===t.id}function Sb(e,t){return e===t}function Cb(e,t){return!(e.topology!==t.topology||e.inputLayout!==t.inputLayout||e.sampleCount!==t.sampleCount||e.megaStateDescriptor&&t.megaStateDescriptor&&!bb(e.megaStateDescriptor,t.megaStateDescriptor)||!xb(e.program,t.program)||!db(e.colorAttachmentFormats,t.colorAttachmentFormats,Sb)||e.depthStencilAttachmentFormat!==t.depthStencilAttachmentFormat)}function wb(e,t){return e.offset===t.offset&&e.shaderLocation===t.shaderLocation&&e.format===t.format&&e.divisor===t.divisor}function Tb(e,t){return ey(e)?ey(t):!ey(t)&&e.arrayStride===t.arrayStride&&e.stepMode===t.stepMode&&db(e.attributes,t.attributes,wb)}function Eb(e,t){return!(e.indexBufferFormat!==t.indexBufferFormat||!db(e.vertexBufferDescriptors,t.vertexBufferDescriptors,Tb)||!xb(e.program,t.program))}function Db(e){return{sampler:e.sampler,texture:e.texture,dimension:e.dimension,formatKind:e.formatKind,comparison:e.comparison}}function Ob(e){var t=e.buffer,n=e.size;return{binding:e.binding,buffer:t,offset:e.offset,size:n}}function kb(e){return{binding:e.binding,texture:e.texture}}function Ab(e){return{samplerBindings:e.samplerBindings&&fb(e.samplerBindings,Db),uniformBufferBindings:e.uniformBufferBindings&&fb(e.uniformBufferBindings,Ob),storageBufferBindings:e.storageBufferBindings&&fb(e.storageBufferBindings,Ob),storageTextureBindings:e.storageTextureBindings&&fb(e.storageTextureBindings,kb),pipeline:e.pipeline}}function jb(e){var t=e.inputLayout,n=e.program,r=e.topology;return{inputLayout:t,megaStateDescriptor:e.megaStateDescriptor&&lb(e.megaStateDescriptor),program:n,topology:r,colorAttachmentFormats:e.colorAttachmentFormats.slice(),depthStencilAttachmentFormat:e.depthStencilAttachmentFormat,sampleCount:e.sampleCount}}function Mb(e){return{shaderLocation:e.shaderLocation,format:e.format,offset:e.offset,divisor:e.divisor}}function Nb(e){return ey(e)?e:{arrayStride:e.arrayStride,stepMode:e.stepMode,attributes:fb(e.attributes,Mb)}}function Pb(e){return{vertexBufferDescriptors:fb(e.vertexBufferDescriptors,Nb),indexBufferFormat:e.indexBufferFormat,program:e.program}}function Fb(e){if(e[e.length-1]!==`]`)return{name:e,length:1,isArray:!1};var t=e.match(jS);if(!t||t.length<2)throw Error(`Failed to parse GLSL uniform name ${e}`);return{name:t[1],length:Number(t[2])||1,isArray:!!t[2]}}function Ib(){var e=null;return function(t,n,r){var i=e!==r;return i&&(t.uniform1i(n,r),e=r),i}}function R(e,t,n,r){var i=null,a=null;return function(o,s,c){var l=t(c,n),u=l.length,d=!1;if(i===null)i=new Float32Array(u),a=u,d=!0;else{L(a===u,`Uniform length cannot change.`);for(var f=0;f<u;++f)if(l[f]!==i[f]){d=!0;break}}return d&&(r(o,e,s,l),i.set(l)),d}}function Lb(e,t,n,r){e[t](n,r)}function Rb(e,t,n,r){e[t](n,!1,r)}function zb(e,t,n,r){t===1&&typeof e==`boolean`&&(e=+!!e),Number.isFinite(e)&&(FS[0]=e,e=FS);var i=e.length;if(e instanceof n)return e;var a=r[i];a||(a=new n(i),r[i]=a);for(var o=0;o<i;o++)a[o]=e[o];return a}function Bb(e,t){return zb(e,t,Float32Array,MS)}function Vb(e,t){return zb(e,t,Int32Array,NS)}function Hb(e,t){return zb(e,t,Uint32Array,PS)}function Ub(e,t,n){var r=IS[n.type];if(!r)throw Error(`Unknown GLSL uniform type ${n.type}`);return r().bind(null,e,t)}function Wb(e){return Object.prototype.toString.call(e)in LS}function Gb(e,t){return`#define ${e} ${t}`}function Kb(e){var t={};return e.replace(/^\s*#define\s*(\S*)\s*(\S*)\s*$/gm,function(e,n,r){var i=Number(r);return t[n]=isNaN(i)?r:i,``}),t}function qb(e,t){var n=[];return e.replace(/^\s*layout\(location\s*=\s*(\S*)\)\s*in\s+\S+\s*(.*);$/gm,function(e,r,i){var a=Number(r);return n.push({location:isNaN(a)?t[r]:a,name:i}),``}),n}function Jb(e){if(e===void 0)return null;var t=/binding\s*=\s*(\d+)/.exec(e);if(t!==null){var n=parseInt(t[1],10);if(!Number.isNaN(n))return n}return null}function Yb(e){return[e,``]}function Xb(e,t,n,r,i){r===void 0&&(r=null),i===void 0&&(i=!0);var a=e.glslVersion===`#version 100`,o=t===`frag`&&n.match(/^\s*layout\(location\s*=\s*\d*\)\s*out\s+vec4\s*(.*);$/gm)?.length>1,s=n.replace(`\r
`,`
`).split(`
`).map(function(e){return e.replace(/[/][/].*$/,``)}).filter(function(e){return!(!e||/^\s+$/.test(e))}),c=``;r!==null&&(c=Object.keys(r).map(function(e){return Gb(e,r[e])}).join(`
`));var l=s.find(function(e){return e.startsWith(`precision`)})||`precision mediump float;`,u=i?s.filter(function(e){return!e.startsWith(`precision`)}).join(`
`):s.join(`
`),d=``;if(e.viewportOrigin===CS.UPPER_LEFT&&(d+=`${Gb(`VIEWPORT_ORIGIN_TL`,`1`)}
`),e.clipSpaceNearZ===wS.ZERO&&(d+=`${Gb(`CLIPSPACE_NEAR_ZERO`,`1`)}
`),e.explicitBindingLocations){var f=0,p=0,m=0;u=u.replace(/^\s*(layout\((.*)\))?\s*uniform(.+{)$/gm,function(e,t,n,r){return`layout(${n?`${n}, `:``}set = ${f}, binding = ${p++}) uniform ${r}`}),f++,p=0,L(e.separateSamplerTextures),u=u.replace(/^\s*(layout\((.*)\))?\s*uniform sampler(\w+) (.*);/gm,function(e,n,r,i,a){var o=Jb(r);o===null&&(o=p++);var s=sr(Yb(i),2),c=s[0],l=s[1];return t===`frag`?`
layout(set = ${f}, binding = ${o*2+0}) uniform texture${c} T_${a};
layout(set = ${f}, binding = ${o*2+1}) uniform sampler${l} S_${a};`.trim():``}),u=u.replace(t===`frag`?/^\s*\b(varying|in)\b/gm:/^\s*\b(varying|out)\b/gm,function(e,t){return`layout(location = ${m++}) ${t}`}),d+=`${Gb(`gl_VertexID`,`gl_VertexIndex`)}
`,d+=`${Gb(`gl_InstanceID`,`gl_InstanceIndex`)}
`,l=l.replace(/^precision (.*) sampler(.*);$/gm,``)}else{var h=0;u=u.replace(/^\s*(layout\((.*)\))?\s*uniform sampler(\w+) (.*);/gm,function(e,t,n,r,i){var a=Jb(n);return a===null&&(a=h++),`uniform sampler${r} ${i}; // BINDING=${a}`})}if(u=u.replace(/\bPU_SAMPLER_(\w+)\((.*?)\)/g,function(e,t,n){return`SAMPLER_${t}(P_${n})`}),u=u.replace(/\bPF_SAMPLER_(\w+)\((.*?)\)/g,function(e,t,n){return`PP_SAMPLER_${t}(P_${n})`}),u=u.replace(/\bPU_TEXTURE\((.*?)\)/g,function(e,t){return`TEXTURE(P_${t})`}),e.separateSamplerTextures)u=u.replace(/\bPD_SAMPLER_(\w+)\((.*?)\)/g,function(e,t,n){var r=sr(Yb(t),2);return`texture${r[0]} T_P_${n}, sampler${r[1]} S_P_${n}`}),u=u.replace(/\bPP_SAMPLER_(\w+)\((.*?)\)/g,function(e,t,n){return`T_${n}, S_${n}`}),u=u.replace(/\bSAMPLER_(\w+)\((.*?)\)/g,function(e,t,n){return`sampler${t}(T_${n}, S_${n})`}),u=u.replace(/\bTEXTURE\((.*?)\)/g,function(e,t){return`T_${t}`});else{var g=[];u=u.replace(/\bPD_SAMPLER_(\w+)\((.*?)\)/g,function(e,t,n){return`sampler${t} P_${n}`}),u=u.replace(/\bPP_SAMPLER_(\w+)\((.*?)\)/g,function(e,t,n){return n}),u=u.replace(/\bSAMPLER_(\w+)\((.*?)\)/g,function(e,t,n){return g.push([n,t]),n}),a&&g.forEach(function(e){var t=sr(e,2),n=t[0],r=t[1];u=u.replace(RegExp(`texture\\(${n}`,`g`),function(){return`texture${r}(${n}`})}),u=u.replace(/\bTEXTURE\((.*?)\)/g,function(e,t){return t})}var _=`${a?``:e.glslVersion}
${a&&o?`#extension GL_EXT_draw_buffers : require
`:``}
${a&&t===`frag`?`#extension GL_OES_standard_derivatives : enable
`:``}${i?l:``}
${d||``}${c?c+`
`:``}
${u}
`.trim();if(e.explicitBindingLocations&&t===`frag`&&(_=_.replace(/^\b(out)\b/g,function(e,t){return`layout(location = 0) ${t}`})),a){if(t===`frag`&&(_=_.replace(/^\s*in\s+(\S+)\s*(.*);$/gm,function(e,t,n){return`varying ${t} ${n};
`})),t===`vert`&&(_=_.replace(/^\s*out\s+(\S+)\s*(.*);$/gm,function(e,t,n){return`varying ${t} ${n};
`}),_=_.replace(/^\s*layout\(location\s*=\s*\S*\)\s*in\s+(\S+)\s*(.*);$/gm,function(e,t,n){return`attribute ${t} ${n};
`})),_=_.replace(/\s*uniform\s*.*\s*{((?:\s*.*\s*)*?)};/g,function(e,t){return t.trim().replace(/^.*$/gm,function(e){var t=e.trim();return t.startsWith(`#`)?t:e?`uniform ${t}`:``})}),t===`frag`){if(o){var v=[];_=_.replace(/^\s*layout\(location\s*=\s*\d*\)\s*out\s+vec4\s*(.*);$/gm,function(e,t){return v.push(t),`vec4 ${t};
`});var y=_.lastIndexOf(`}`);_=_.substring(0,y)+`
    ${v.map(function(e,t){return`gl_FragData[${t}] = ${e};
    `}).join(`
`)}`+_.substring(y)}else{var b;if(_=_.replace(/^\s*out\s+(\S+)\s*(.*);$/gm,function(e,t,n){return b=n,`${t} ${n};
`}),b){var y=_.lastIndexOf(`}`);_=_.substring(0,y)+`
  gl_FragColor = vec4(${b});
`+_.substring(y)}}}_=_.replace(/^\s*layout\((.*)\)/gm,``)}return _}function z(e){return BS===void 0?typeof WebGL2RenderingContext<`u`&&e instanceof WebGL2RenderingContext?(BS=!0,!0):(BS=!!(e&&e._version===2),BS):BS}function Zb(e){switch(By(e)){case q.BC1:case q.BC2:case q.BC3:case q.BC4_UNORM:case q.BC4_SNORM:case q.BC5_UNORM:case q.BC5_SNORM:return!0;default:return!1}}function Qb(e){if(Vy(e)&Y.Normalized)return!1;var t=By(e);return t===q.S8||t===q.S16||t===q.S32||t===q.U8||t===q.U16||t===q.U32}function $b(e){switch(e){case _S.STATIC:return B.STATIC_DRAW;case _S.DYNAMIC:return B.DYNAMIC_DRAW}}function ex(e){if(e&W.INDEX)return B.ELEMENT_ARRAY_BUFFER;if(e&W.VERTEX)return B.ARRAY_BUFFER;if(e&W.UNIFORM)return B.UNIFORM_BUFFER}function tx(e){switch(e){case gS.TRIANGLES:return B.TRIANGLES;case gS.POINTS:return B.POINTS;case gS.TRIANGLE_STRIP:return B.TRIANGLE_STRIP;case gS.LINES:return B.LINES;case gS.LINE_STRIP:return B.LINE_STRIP;default:throw Error(`Unknown primitive topology mode`)}}function nx(e){switch(e){case q.U8:return B.UNSIGNED_BYTE;case q.U16:return B.UNSIGNED_SHORT;case q.U32:return B.UNSIGNED_INT;case q.S8:return B.BYTE;case q.S16:return B.SHORT;case q.S32:return B.INT;case q.F16:return B.HALF_FLOAT;case q.F32:return B.FLOAT;default:throw Error(`whoops`)}}function rx(e){switch(e){case J.R:return 1;case J.RG:return 2;case J.RGB:return 3;case J.RGBA:return 4;default:return 1}}function ix(e){var t=By(e),n=zy(e),r=Vy(e),i=nx(t);return{size:rx(n),type:i,normalized:!!(r&Y.Normalized)}}function ax(e){switch(e){case X.U8_R:return B.UNSIGNED_BYTE;case X.U16_R:return B.UNSIGNED_SHORT;case X.U32_R:return B.UNSIGNED_INT;default:throw Error(`whoops`)}}function ox(e){switch(e){case pS.CLAMP_TO_EDGE:return B.CLAMP_TO_EDGE;case pS.REPEAT:return B.REPEAT;case pS.MIRRORED_REPEAT:return B.MIRRORED_REPEAT;default:throw Error(`whoops`)}}function sx(e,t){if(t===hS.LINEAR&&e===mS.BILINEAR)return B.LINEAR_MIPMAP_LINEAR;if(t===hS.LINEAR&&e===mS.POINT)return B.NEAREST_MIPMAP_LINEAR;if(t===hS.NEAREST&&e===mS.BILINEAR)return B.LINEAR_MIPMAP_NEAREST;if(t===hS.NEAREST&&e===mS.POINT)return B.NEAREST_MIPMAP_NEAREST;if(t===hS.NO_MIP&&e===mS.BILINEAR)return B.LINEAR;if(t===hS.NO_MIP&&e===mS.POINT)return B.NEAREST;throw Error(`Unknown texture filter mode`)}function cx(e,t){t===void 0&&(t=0);var n=e;return n.gl_buffer_pages[t/n.pageByteSize|0]}function lx(e){return e.gl_texture}function ux(e){return e.gl_sampler}function dx(e,t){e.name=t,e.__SPECTOR_Metadata={name:t}}function fx(e,t){for(var n=[];;){var r=t.exec(e);if(!r)break;n.push(r)}return n}function px(e){return e.blendMode==fS.ADD&&e.blendSrcFactor==U.ONE&&e.blendDstFactor===U.ZERO}function mx(e){switch(e){case TS.OcclusionConservative:return B.ANY_SAMPLES_PASSED_CONSERVATIVE;default:throw Error(`whoops`)}}function hx(e){if(e===G.TEXTURE_2D)return B.TEXTURE_2D;if(e===G.TEXTURE_2D_ARRAY)return B.TEXTURE_2D_ARRAY;if(e===G.TEXTURE_CUBE_MAP)return B.TEXTURE_CUBE_MAP;if(e===G.TEXTURE_3D)return B.TEXTURE_3D;throw Error(`whoops`)}function gx(e,t,n,r){return e%n===0&&t%r===0}function _x(){return(oC===null||oC.byteLength===0)&&(oC=new Uint8Array(Q.memory.buffer)),oC}function vx(e,t){return e>>>=0,aC.decode(_x().subarray(e,e+t))}function yx(e){cC===sC.length&&sC.push(sC.length+1);let t=cC;return cC=sC[t],sC[t]=e,t}function bx(e){return sC[e]}function xx(e){e<132||(sC[e]=cC,cC=e)}function Sx(e){let t=bx(e);return xx(e),t}function Cx(e,t,n){if(n===void 0){let n=uC.encode(e),r=t(n.length,1)>>>0;return _x().subarray(r,r+n.length).set(n),lC=n.length,r}let r=e.length,i=t(r,1)>>>0,a=_x(),o=0;for(;o<r;o++){let t=e.charCodeAt(o);if(t>127)break;a[i+o]=t}if(o!==r){o!==0&&(e=e.slice(o)),i=n(i,r,r=o+e.length*3,1)>>>0;let t=_x().subarray(i+o,i+r),a=dC(e,t);o+=a.written}return lC=o,i}function wx(){return(fC===null||fC.byteLength===0)&&(fC=new Int32Array(Q.memory.buffer)),fC}function Tx(e,t,n){let r,i;try{let s=Q.__wbindgen_add_to_stack_pointer(-16),c=Cx(e,Q.__wbindgen_malloc,Q.__wbindgen_realloc),l=lC,u=Cx(t,Q.__wbindgen_malloc,Q.__wbindgen_realloc),d=lC;Q.glsl_compile(s,c,l,u,d,n);var a=wx()[s/4+0],o=wx()[s/4+1];return r=a,i=o,vx(a,o)}finally{Q.__wbindgen_add_to_stack_pointer(16),Q.__wbindgen_free(r,i,1)}}async function Ex(e,t){if(typeof Response==`function`&&e instanceof Response){if(typeof WebAssembly.instantiateStreaming==`function`)try{return await WebAssembly.instantiateStreaming(e,t)}catch(t){if(e.headers.get(`Content-Type`)!=`application/wasm`)console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n",t);else throw t}let n=await e.arrayBuffer();return await WebAssembly.instantiate(n,t)}{let n=await WebAssembly.instantiate(e,t);return n instanceof WebAssembly.Instance?{instance:n,module:e}:n}}function Dx(){let e={};return e.wbg={},e.wbg.__wbindgen_string_new=function(e,t){return yx(vx(e,t))},e.wbg.__wbindgen_object_drop_ref=function(e){Sx(e)},e.wbg.__wbg_log_1d3ae0273d8f4f8a=function(e){console.log(bx(e))},e.wbg.__wbg_log_576ca876af0d4a77=function(e,t){console.log(bx(e),bx(t))},e.wbg.__wbindgen_throw=function(e,t){throw Error(vx(e,t))},e}function Ox(e,t){return Q=e.exports,kx.__wbindgen_wasm_module=t,fC=null,oC=null,Q}async function kx(e){if(Q!==void 0)return Q;let t=Dx();(typeof e==`string`||typeof Request==`function`&&e instanceof Request||typeof URL==`function`&&e instanceof URL)&&(e=fetch(e));let{instance:n,module:r}=await Ex(await e,t);return Ox(n,r)}function Ax(e){var t=0;return e&bS.SAMPLED&&(t|=mC.TEXTURE_BINDING|mC.COPY_DST|mC.COPY_SRC),e&bS.STORAGE&&(t|=mC.TEXTURE_BINDING|mC.STORAGE_BINDING|mC.COPY_SRC|mC.COPY_DST),e&bS.RENDER_TARGET&&(t|=mC.RENDER_ATTACHMENT|mC.TEXTURE_BINDING|mC.COPY_SRC|mC.COPY_DST),t}function jx(e){if(e===X.U8_R_NORM)return`r8unorm`;if(e===X.S8_R_NORM)return`r8snorm`;if(e===X.U8_RG_NORM)return`rg8unorm`;if(e===X.S8_RG_NORM)return`rg8snorm`;if(e===X.U32_R)return`r32uint`;if(e===X.S32_R)return`r32sint`;if(e===X.F32_R)return`r32float`;if(e===X.U16_RG)return`rg16uint`;if(e===X.S16_RG)return`rg16sint`;if(e===X.F16_RG)return`rg16float`;if(e===X.U8_RGBA_RT)return`bgra8unorm`;if(e===X.U8_RGBA_RT_SRGB)return`bgra8unorm-srgb`;if(e===X.U8_RGBA_NORM)return`rgba8unorm`;if(e===X.U8_RGBA_SRGB)return`rgba8unorm-srgb`;if(e===X.S8_RGBA_NORM)return`rgba8snorm`;if(e===X.U32_RG)return`rg32uint`;if(e===X.S32_RG)return`rg32sint`;if(e===X.F32_RG)return`rg32float`;if(e===X.U16_RGBA)return`rgba16uint`;if(e===X.S16_RGBA)return`rgba16sint`;if(e===X.F16_RGBA)return`rgba16float`;if(e===X.F32_RGBA)return`rgba32float`;if(e===X.U32_RGBA)return`rgba32uint`;if(e===X.S32_RGBA)return`rgba32sint`;if(e===X.D24)return`depth24plus`;if(e===X.D24_S8)return`depth24plus-stencil8`;if(e===X.D32F)return`depth32float`;if(e===X.D32F_S8)return`depth32float-stencil8`;if(e===X.BC1)return`bc1-rgba-unorm`;if(e===X.BC1_SRGB)return`bc1-rgba-unorm-srgb`;if(e===X.BC2)return`bc2-rgba-unorm`;if(e===X.BC2_SRGB)return`bc2-rgba-unorm-srgb`;if(e===X.BC3)return`bc3-rgba-unorm`;if(e===X.BC3_SRGB)return`bc3-rgba-unorm-srgb`;if(e===X.BC4_SNORM)return`bc4-r-snorm`;if(e===X.BC4_UNORM)return`bc4-r-unorm`;if(e===X.BC5_SNORM)return`bc5-rg-snorm`;if(e===X.BC5_UNORM)return`bc5-rg-unorm`;throw`whoops`}function Mx(e){if(e===G.TEXTURE_2D||e===G.TEXTURE_CUBE_MAP||e===G.TEXTURE_2D_ARRAY)return`2d`;if(e===G.TEXTURE_3D)return`3d`;throw Error(`whoops`)}function Nx(e){if(e===G.TEXTURE_2D)return`2d`;if(e===G.TEXTURE_CUBE_MAP)return`cube`;if(e===G.TEXTURE_2D_ARRAY)return`2d-array`;if(e===G.TEXTURE_3D)return`3d`;throw Error(`whoops`)}function Px(e){var t=0;return e&W.INDEX&&(t|=GPUBufferUsage.INDEX),e&W.VERTEX&&(t|=GPUBufferUsage.VERTEX),e&W.UNIFORM&&(t|=GPUBufferUsage.UNIFORM),e&W.STORAGE&&(t|=GPUBufferUsage.STORAGE),e&W.COPY_SRC&&(t|=GPUBufferUsage.COPY_SRC),e&W.INDIRECT&&(t|=GPUBufferUsage.INDIRECT),t|=GPUBufferUsage.COPY_DST,t}function Fx(e){if(e===pS.CLAMP_TO_EDGE)return`clamp-to-edge`;if(e===pS.REPEAT)return`repeat`;if(e===pS.MIRRORED_REPEAT)return`mirror-repeat`;throw Error(`whoops`)}function Ix(e){if(e===mS.BILINEAR)return`linear`;if(e===mS.POINT)return`nearest`;throw Error(`whoops`)}function Lx(e){if(e===hS.LINEAR)return`linear`;if(e===hS.NEAREST||e===hS.NO_MIP)return`nearest`;throw Error(`whoops`)}function Rx(e){return e.gpuBuffer}function zx(e){return e.gpuSampler}function Bx(e){return e.querySet}function Vx(e){if(e===TS.OcclusionConservative)return`occlusion`;throw Error(`whoops`)}function Hx(e){switch(e){case gS.TRIANGLES:return`triangle-list`;case gS.POINTS:return`point-list`;case gS.TRIANGLE_STRIP:return`triangle-strip`;case gS.LINES:return`line-list`;case gS.LINE_STRIP:return`line-strip`;default:throw Error(`Unknown primitive topology mode`)}}function Ux(e){if(e===dS.NONE)return`none`;if(e===dS.FRONT)return`front`;if(e===dS.BACK)return`back`;throw Error(`whoops`)}function Wx(e){if(e===uS.CCW)return`ccw`;if(e===uS.CW)return`cw`;throw Error(`whoops`)}function Gx(e,t){return{topology:Hx(e),cullMode:Ux(t.cullMode),frontFace:Wx(t.frontFace)}}function Kx(e){if(e===U.ZERO)return`zero`;if(e===U.ONE)return`one`;if(e===U.SRC)return`src`;if(e===U.ONE_MINUS_SRC)return`one-minus-src`;if(e===U.DST)return`dst`;if(e===U.ONE_MINUS_DST)return`one-minus-dst`;if(e===U.SRC_ALPHA)return`src-alpha`;if(e===U.ONE_MINUS_SRC_ALPHA)return`one-minus-src-alpha`;if(e===U.DST_ALPHA)return`dst-alpha`;if(e===U.ONE_MINUS_DST_ALPHA)return`one-minus-dst-alpha`;if(e===U.CONST)return`constant`;if(e===U.ONE_MINUS_CONSTANT)return`one-minus-constant`;if(e===U.SRC_ALPHA_SATURATE)return`src-alpha-saturated`;throw Error(`whoops`)}function qx(e){if(e===fS.ADD)return`add`;if(e===fS.SUBSTRACT)return`subtract`;if(e===fS.REVERSE_SUBSTRACT)return`reverse-subtract`;if(e===fS.MIN)return`min`;if(e===fS.MAX)return`max`;throw Error(`whoops`)}function Jx(e){return{operation:qx(e.blendMode),srcFactor:Kx(e.blendSrcFactor),dstFactor:Kx(e.blendDstFactor)}}function Yx(e){return e.blendMode===fS.ADD&&e.blendSrcFactor===U.ONE&&e.blendDstFactor===U.ZERO}function Xx(e){if(!(Yx(e.rgbBlendState)&&Yx(e.alphaBlendState)))return{color:Jx(e.rgbBlendState),alpha:Jx(e.alphaBlendState)}}function Zx(e,t){return{format:jx(t),blend:Xx(e),writeMask:e.channelWriteMask}}function Qx(e,t){return t.attachmentsState.map(function(t,n){return Zx(t,e[n])})}function $x(e){if(e===H.NEVER)return`never`;if(e===H.LESS)return`less`;if(e===H.EQUAL)return`equal`;if(e===H.LEQUAL)return`less-equal`;if(e===H.GREATER)return`greater`;if(e===H.NOTEQUAL)return`not-equal`;if(e===H.GEQUAL)return`greater-equal`;if(e===H.ALWAYS)return`always`;throw Error(`whoops`)}function eS(e){if(e===K.KEEP)return`keep`;if(e===K.REPLACE)return`replace`;if(e===K.ZERO)return`zero`;if(e===K.DECREMENT_CLAMP)return`decrement-clamp`;if(e===K.DECREMENT_WRAP)return`decrement-wrap`;if(e===K.INCREMENT_CLAMP)return`increment-clamp`;if(e===K.INCREMENT_WRAP)return`increment-wrap`;if(e===K.INVERT)return`invert`;throw Error(`whoops`)}function tS(e,t){if(!ey(e))return{format:jx(e),depthWriteEnabled:!!t.depthWrite,depthCompare:$x(t.depthCompare),depthBias:t.polygonOffset?t.polygonOffsetUnits:0,depthBiasSlopeScale:t.polygonOffset?t.polygonOffsetFactor:0,stencilFront:{compare:$x(t.stencilFront.compare),passOp:eS(t.stencilFront.passOp),failOp:eS(t.stencilFront.failOp),depthFailOp:eS(t.stencilFront.depthFailOp)},stencilBack:{compare:$x(t.stencilBack.compare),passOp:eS(t.stencilBack.passOp),failOp:eS(t.stencilBack.failOp),depthFailOp:eS(t.stencilBack.depthFailOp)},stencilReadMask:4294967295,stencilWriteMask:4294967295}}function nS(e){if(e!==null){if(e===X.U16_R)return`uint16`;if(e===X.U32_R)return`uint32`;throw Error(`whoops`)}}function rS(e){if(e===vS.VERTEX)return`vertex`;if(e===vS.INSTANCE)return`instance`;throw Error(`whoops`)}function iS(e){if(e===X.U8_R||e===X.U8_RG)return`uint8x2`;if(e===X.U8_RGB||e===X.U8_RGBA)return`uint8x4`;if(e===X.U8_RG_NORM)return`unorm8x2`;if(e===X.U8_RGBA_NORM)return`unorm8x4`;if(e===X.S8_RGB_NORM||e===X.S8_RGBA_NORM)return`snorm8x4`;if(e===X.U16_RG_NORM)return`unorm16x2`;if(e===X.U16_RGBA_NORM)return`unorm16x4`;if(e===X.S16_RG_NORM)return`snorm16x2`;if(e===X.S16_RGBA_NORM)return`snorm16x4`;if(e===X.S16_RG)return`uint16x2`;if(e===X.F16_RG)return`float16x2`;if(e===X.F16_RGBA)return`float16x4`;if(e===X.F32_R)return`float32`;if(e===X.F32_RG)return`float32x2`;if(e===X.F32_RGB)return`float32x3`;if(e===X.F32_RGBA)return`float32x4`;throw`whoops`}function aS(e){switch(By(e)){case q.BC1:case q.BC2:case q.BC3:case q.BC4_SNORM:case q.BC4_UNORM:case q.BC5_SNORM:case q.BC5_UNORM:return!0;default:return!1}}function oS(e){switch(By(e)){case q.BC1:case q.BC2:case q.BC3:case q.BC4_SNORM:case q.BC4_UNORM:case q.BC5_SNORM:case q.BC5_UNORM:return 4;default:return 1}}function sS(e,t,n,r){switch(n===void 0&&(n=!1),e){case X.S8_R:case X.S8_R_NORM:case X.S8_RG_NORM:case X.S8_RGB_NORM:case X.S8_RGBA_NORM:var i=(t instanceof ArrayBuffer,new Int8Array(t));return r&&i.set(new Int8Array(r)),i;case X.U8_R:case X.U8_R_NORM:case X.U8_RG:case X.U8_RG_NORM:case X.U8_RGB:case X.U8_RGB_NORM:case X.U8_RGB_SRGB:case X.U8_RGBA:case X.U8_RGBA_NORM:case X.U8_RGBA_SRGB:var a=(t instanceof ArrayBuffer,new Uint8Array(t));return r&&a.set(new Uint8Array(r)),a;case X.S16_R:case X.S16_RG:case X.S16_RG_NORM:case X.S16_RGB_NORM:case X.S16_RGBA:case X.S16_RGBA_NORM:var o=t instanceof ArrayBuffer?new Int16Array(t):new Int16Array(n?t/2:t);return r&&o.set(new Int16Array(r)),o;case X.U16_R:case X.U16_RGB:case X.U16_RGBA_5551:case X.U16_RGBA_NORM:case X.U16_RG_NORM:case X.U16_R_NORM:var s=t instanceof ArrayBuffer?new Uint16Array(t):new Uint16Array(n?t/2:t);return r&&s.set(new Uint16Array(r)),s;case X.S32_R:var c=t instanceof ArrayBuffer?new Int32Array(t):new Int32Array(n?t/4:t);return r&&c.set(new Int32Array(r)),c;case X.U32_R:case X.U32_RG:var l=t instanceof ArrayBuffer?new Uint32Array(t):new Uint32Array(n?t/4:t);return r&&l.set(new Uint32Array(r)),l;case X.F32_R:case X.F32_RG:case X.F32_RGB:case X.F32_RGBA:var u=t instanceof ArrayBuffer?new Float32Array(t):new Float32Array(n?t/4:t);return r&&u.set(new Float32Array(r)),u}var d=(t instanceof ArrayBuffer,new Uint8Array(t));return r&&d.set(new Uint8Array(r)),d}function cS(e){var t=(e&32768)>>15,n=(e&31744)>>10,r=e&1023;return n===0?(t?-1:1)*2**-14*(r/1024):n==31?r?NaN:(t?-1:1)*(1/0):(t?-1:1)*2**(n-15)*(1+r/1024)}function lS(e){switch(e){case`r8unorm`:case`r8snorm`:case`r8uint`:case`r8sint`:return{width:1,height:1,length:1};case`r16uint`:case`r16sint`:case`r16float`:case`rg8unorm`:case`rg8snorm`:case`rg8uint`:case`rg8sint`:return{width:1,height:1,length:2};case`r32uint`:case`r32sint`:case`r32float`:case`rg16uint`:case`rg16sint`:case`rg16float`:case`rgba8unorm`:case`rgba8unorm-srgb`:case`rgba8snorm`:case`rgba8uint`:case`rgba8sint`:case`bgra8unorm`:case`bgra8unorm-srgb`:case`rgb9e5ufloat`:case`rgb10a2unorm`:case`rg11b10ufloat`:return{width:1,height:1,length:4};case`rg32uint`:case`rg32sint`:case`rg32float`:case`rgba16uint`:case`rgba16sint`:case`rgba16float`:return{width:1,height:1,length:8};case`rgba32uint`:case`rgba32sint`:case`rgba32float`:return{width:1,height:1,length:16};case`stencil8`:throw Error(`No fixed size for Stencil8 format!`);case`depth16unorm`:return{width:1,height:1,length:2};case`depth24plus`:throw Error(`No fixed size for Depth24Plus format!`);case`depth24plus-stencil8`:throw Error(`No fixed size for Depth24PlusStencil8 format!`);case`depth32float`:return{width:1,height:1,length:4};case`depth32float-stencil8`:return{width:1,height:1,length:5};case`bc7-rgba-unorm`:case`bc7-rgba-unorm-srgb`:case`bc6h-rgb-ufloat`:case`bc6h-rgb-float`:case`bc2-rgba-unorm`:case`bc2-rgba-unorm-srgb`:case`bc3-rgba-unorm`:case`bc3-rgba-unorm-srgb`:case`bc5-rg-unorm`:case`bc5-rg-snorm`:return{width:4,height:4,length:16};case`bc4-r-unorm`:case`bc4-r-snorm`:case`bc1-rgba-unorm`:case`bc1-rgba-unorm-srgb`:return{width:4,height:4,length:8};default:return{width:1,height:1,length:4}}}var B,V,H,uS,dS,U,fS,pS,mS,hS,gS,W,_S,vS,yS,G,bS,xS,K,SS,CS,wS,TS,q,J,Y,X,ES,DS,OS,kS,AS,Z,jS,MS,NS,PS,FS,IS,LS,RS,zS,BS,VS,HS,US,WS,GS,KS,qS,JS,YS,XS,ZS,QS,$S,eC,tC,nC,rC,iC,Q,aC,oC,sC,cC,lC,uC,dC,fC,pC,mC,hC,gC,_C,vC,yC,bC,xC,SC,CC,wC,TC,EC,DC,OC,kC,AC,jC,MC=t((()=>{Ny(),mr(),Ly(),(function(e){e[e.DEPTH_BUFFER_BIT=256]=`DEPTH_BUFFER_BIT`,e[e.STENCIL_BUFFER_BIT=1024]=`STENCIL_BUFFER_BIT`,e[e.COLOR_BUFFER_BIT=16384]=`COLOR_BUFFER_BIT`,e[e.POINTS=0]=`POINTS`,e[e.LINES=1]=`LINES`,e[e.LINE_LOOP=2]=`LINE_LOOP`,e[e.LINE_STRIP=3]=`LINE_STRIP`,e[e.TRIANGLES=4]=`TRIANGLES`,e[e.TRIANGLE_STRIP=5]=`TRIANGLE_STRIP`,e[e.TRIANGLE_FAN=6]=`TRIANGLE_FAN`,e[e.ZERO=0]=`ZERO`,e[e.ONE=1]=`ONE`,e[e.SRC_COLOR=768]=`SRC_COLOR`,e[e.ONE_MINUS_SRC_COLOR=769]=`ONE_MINUS_SRC_COLOR`,e[e.SRC_ALPHA=770]=`SRC_ALPHA`,e[e.ONE_MINUS_SRC_ALPHA=771]=`ONE_MINUS_SRC_ALPHA`,e[e.DST_ALPHA=772]=`DST_ALPHA`,e[e.ONE_MINUS_DST_ALPHA=773]=`ONE_MINUS_DST_ALPHA`,e[e.DST_COLOR=774]=`DST_COLOR`,e[e.ONE_MINUS_DST_COLOR=775]=`ONE_MINUS_DST_COLOR`,e[e.SRC_ALPHA_SATURATE=776]=`SRC_ALPHA_SATURATE`,e[e.CONSTANT_COLOR=32769]=`CONSTANT_COLOR`,e[e.ONE_MINUS_CONSTANT_COLOR=32770]=`ONE_MINUS_CONSTANT_COLOR`,e[e.CONSTANT_ALPHA=32771]=`CONSTANT_ALPHA`,e[e.ONE_MINUS_CONSTANT_ALPHA=32772]=`ONE_MINUS_CONSTANT_ALPHA`,e[e.FUNC_ADD=32774]=`FUNC_ADD`,e[e.FUNC_SUBTRACT=32778]=`FUNC_SUBTRACT`,e[e.FUNC_REVERSE_SUBTRACT=32779]=`FUNC_REVERSE_SUBTRACT`,e[e.BLEND_EQUATION=32777]=`BLEND_EQUATION`,e[e.BLEND_EQUATION_RGB=32777]=`BLEND_EQUATION_RGB`,e[e.BLEND_EQUATION_ALPHA=34877]=`BLEND_EQUATION_ALPHA`,e[e.BLEND_DST_RGB=32968]=`BLEND_DST_RGB`,e[e.BLEND_SRC_RGB=32969]=`BLEND_SRC_RGB`,e[e.BLEND_DST_ALPHA=32970]=`BLEND_DST_ALPHA`,e[e.BLEND_SRC_ALPHA=32971]=`BLEND_SRC_ALPHA`,e[e.BLEND_COLOR=32773]=`BLEND_COLOR`,e[e.ARRAY_BUFFER_BINDING=34964]=`ARRAY_BUFFER_BINDING`,e[e.ELEMENT_ARRAY_BUFFER_BINDING=34965]=`ELEMENT_ARRAY_BUFFER_BINDING`,e[e.LINE_WIDTH=2849]=`LINE_WIDTH`,e[e.ALIASED_POINT_SIZE_RANGE=33901]=`ALIASED_POINT_SIZE_RANGE`,e[e.ALIASED_LINE_WIDTH_RANGE=33902]=`ALIASED_LINE_WIDTH_RANGE`,e[e.CULL_FACE_MODE=2885]=`CULL_FACE_MODE`,e[e.FRONT_FACE=2886]=`FRONT_FACE`,e[e.DEPTH_RANGE=2928]=`DEPTH_RANGE`,e[e.DEPTH_WRITEMASK=2930]=`DEPTH_WRITEMASK`,e[e.DEPTH_CLEAR_VALUE=2931]=`DEPTH_CLEAR_VALUE`,e[e.DEPTH_FUNC=2932]=`DEPTH_FUNC`,e[e.STENCIL_CLEAR_VALUE=2961]=`STENCIL_CLEAR_VALUE`,e[e.STENCIL_FUNC=2962]=`STENCIL_FUNC`,e[e.STENCIL_FAIL=2964]=`STENCIL_FAIL`,e[e.STENCIL_PASS_DEPTH_FAIL=2965]=`STENCIL_PASS_DEPTH_FAIL`,e[e.STENCIL_PASS_DEPTH_PASS=2966]=`STENCIL_PASS_DEPTH_PASS`,e[e.STENCIL_REF=2967]=`STENCIL_REF`,e[e.STENCIL_VALUE_MASK=2963]=`STENCIL_VALUE_MASK`,e[e.STENCIL_WRITEMASK=2968]=`STENCIL_WRITEMASK`,e[e.STENCIL_BACK_FUNC=34816]=`STENCIL_BACK_FUNC`,e[e.STENCIL_BACK_FAIL=34817]=`STENCIL_BACK_FAIL`,e[e.STENCIL_BACK_PASS_DEPTH_FAIL=34818]=`STENCIL_BACK_PASS_DEPTH_FAIL`,e[e.STENCIL_BACK_PASS_DEPTH_PASS=34819]=`STENCIL_BACK_PASS_DEPTH_PASS`,e[e.STENCIL_BACK_REF=36003]=`STENCIL_BACK_REF`,e[e.STENCIL_BACK_VALUE_MASK=36004]=`STENCIL_BACK_VALUE_MASK`,e[e.STENCIL_BACK_WRITEMASK=36005]=`STENCIL_BACK_WRITEMASK`,e[e.VIEWPORT=2978]=`VIEWPORT`,e[e.SCISSOR_BOX=3088]=`SCISSOR_BOX`,e[e.COLOR_CLEAR_VALUE=3106]=`COLOR_CLEAR_VALUE`,e[e.COLOR_WRITEMASK=3107]=`COLOR_WRITEMASK`,e[e.UNPACK_ALIGNMENT=3317]=`UNPACK_ALIGNMENT`,e[e.PACK_ALIGNMENT=3333]=`PACK_ALIGNMENT`,e[e.MAX_TEXTURE_SIZE=3379]=`MAX_TEXTURE_SIZE`,e[e.MAX_VIEWPORT_DIMS=3386]=`MAX_VIEWPORT_DIMS`,e[e.SUBPIXEL_BITS=3408]=`SUBPIXEL_BITS`,e[e.RED_BITS=3410]=`RED_BITS`,e[e.GREEN_BITS=3411]=`GREEN_BITS`,e[e.BLUE_BITS=3412]=`BLUE_BITS`,e[e.ALPHA_BITS=3413]=`ALPHA_BITS`,e[e.DEPTH_BITS=3414]=`DEPTH_BITS`,e[e.STENCIL_BITS=3415]=`STENCIL_BITS`,e[e.POLYGON_OFFSET_UNITS=10752]=`POLYGON_OFFSET_UNITS`,e[e.POLYGON_OFFSET_FACTOR=32824]=`POLYGON_OFFSET_FACTOR`,e[e.TEXTURE_BINDING_2D=32873]=`TEXTURE_BINDING_2D`,e[e.SAMPLE_BUFFERS=32936]=`SAMPLE_BUFFERS`,e[e.SAMPLES=32937]=`SAMPLES`,e[e.SAMPLE_COVERAGE_VALUE=32938]=`SAMPLE_COVERAGE_VALUE`,e[e.SAMPLE_COVERAGE_INVERT=32939]=`SAMPLE_COVERAGE_INVERT`,e[e.COMPRESSED_TEXTURE_FORMATS=34467]=`COMPRESSED_TEXTURE_FORMATS`,e[e.VENDOR=7936]=`VENDOR`,e[e.RENDERER=7937]=`RENDERER`,e[e.VERSION=7938]=`VERSION`,e[e.IMPLEMENTATION_COLOR_READ_TYPE=35738]=`IMPLEMENTATION_COLOR_READ_TYPE`,e[e.IMPLEMENTATION_COLOR_READ_FORMAT=35739]=`IMPLEMENTATION_COLOR_READ_FORMAT`,e[e.BROWSER_DEFAULT_WEBGL=37444]=`BROWSER_DEFAULT_WEBGL`,e[e.STATIC_DRAW=35044]=`STATIC_DRAW`,e[e.STREAM_DRAW=35040]=`STREAM_DRAW`,e[e.DYNAMIC_DRAW=35048]=`DYNAMIC_DRAW`,e[e.ARRAY_BUFFER=34962]=`ARRAY_BUFFER`,e[e.ELEMENT_ARRAY_BUFFER=34963]=`ELEMENT_ARRAY_BUFFER`,e[e.BUFFER_SIZE=34660]=`BUFFER_SIZE`,e[e.BUFFER_USAGE=34661]=`BUFFER_USAGE`,e[e.CURRENT_VERTEX_ATTRIB=34342]=`CURRENT_VERTEX_ATTRIB`,e[e.VERTEX_ATTRIB_ARRAY_ENABLED=34338]=`VERTEX_ATTRIB_ARRAY_ENABLED`,e[e.VERTEX_ATTRIB_ARRAY_SIZE=34339]=`VERTEX_ATTRIB_ARRAY_SIZE`,e[e.VERTEX_ATTRIB_ARRAY_STRIDE=34340]=`VERTEX_ATTRIB_ARRAY_STRIDE`,e[e.VERTEX_ATTRIB_ARRAY_TYPE=34341]=`VERTEX_ATTRIB_ARRAY_TYPE`,e[e.VERTEX_ATTRIB_ARRAY_NORMALIZED=34922]=`VERTEX_ATTRIB_ARRAY_NORMALIZED`,e[e.VERTEX_ATTRIB_ARRAY_POINTER=34373]=`VERTEX_ATTRIB_ARRAY_POINTER`,e[e.VERTEX_ATTRIB_ARRAY_BUFFER_BINDING=34975]=`VERTEX_ATTRIB_ARRAY_BUFFER_BINDING`,e[e.CULL_FACE=2884]=`CULL_FACE`,e[e.FRONT=1028]=`FRONT`,e[e.BACK=1029]=`BACK`,e[e.FRONT_AND_BACK=1032]=`FRONT_AND_BACK`,e[e.BLEND=3042]=`BLEND`,e[e.DEPTH_TEST=2929]=`DEPTH_TEST`,e[e.DITHER=3024]=`DITHER`,e[e.POLYGON_OFFSET_FILL=32823]=`POLYGON_OFFSET_FILL`,e[e.SAMPLE_ALPHA_TO_COVERAGE=32926]=`SAMPLE_ALPHA_TO_COVERAGE`,e[e.SAMPLE_COVERAGE=32928]=`SAMPLE_COVERAGE`,e[e.SCISSOR_TEST=3089]=`SCISSOR_TEST`,e[e.STENCIL_TEST=2960]=`STENCIL_TEST`,e[e.NO_ERROR=0]=`NO_ERROR`,e[e.INVALID_ENUM=1280]=`INVALID_ENUM`,e[e.INVALID_VALUE=1281]=`INVALID_VALUE`,e[e.INVALID_OPERATION=1282]=`INVALID_OPERATION`,e[e.OUT_OF_MEMORY=1285]=`OUT_OF_MEMORY`,e[e.CONTEXT_LOST_WEBGL=37442]=`CONTEXT_LOST_WEBGL`,e[e.CW=2304]=`CW`,e[e.CCW=2305]=`CCW`,e[e.DONT_CARE=4352]=`DONT_CARE`,e[e.FASTEST=4353]=`FASTEST`,e[e.NICEST=4354]=`NICEST`,e[e.GENERATE_MIPMAP_HINT=33170]=`GENERATE_MIPMAP_HINT`,e[e.BYTE=5120]=`BYTE`,e[e.UNSIGNED_BYTE=5121]=`UNSIGNED_BYTE`,e[e.SHORT=5122]=`SHORT`,e[e.UNSIGNED_SHORT=5123]=`UNSIGNED_SHORT`,e[e.INT=5124]=`INT`,e[e.UNSIGNED_INT=5125]=`UNSIGNED_INT`,e[e.FLOAT=5126]=`FLOAT`,e[e.DOUBLE=5130]=`DOUBLE`,e[e.DEPTH_COMPONENT=6402]=`DEPTH_COMPONENT`,e[e.ALPHA=6406]=`ALPHA`,e[e.RGB=6407]=`RGB`,e[e.RGBA=6408]=`RGBA`,e[e.LUMINANCE=6409]=`LUMINANCE`,e[e.LUMINANCE_ALPHA=6410]=`LUMINANCE_ALPHA`,e[e.UNSIGNED_SHORT_4_4_4_4=32819]=`UNSIGNED_SHORT_4_4_4_4`,e[e.UNSIGNED_SHORT_5_5_5_1=32820]=`UNSIGNED_SHORT_5_5_5_1`,e[e.UNSIGNED_SHORT_5_6_5=33635]=`UNSIGNED_SHORT_5_6_5`,e[e.FRAGMENT_SHADER=35632]=`FRAGMENT_SHADER`,e[e.VERTEX_SHADER=35633]=`VERTEX_SHADER`,e[e.COMPILE_STATUS=35713]=`COMPILE_STATUS`,e[e.DELETE_STATUS=35712]=`DELETE_STATUS`,e[e.LINK_STATUS=35714]=`LINK_STATUS`,e[e.VALIDATE_STATUS=35715]=`VALIDATE_STATUS`,e[e.ATTACHED_SHADERS=35717]=`ATTACHED_SHADERS`,e[e.ACTIVE_ATTRIBUTES=35721]=`ACTIVE_ATTRIBUTES`,e[e.ACTIVE_UNIFORMS=35718]=`ACTIVE_UNIFORMS`,e[e.MAX_VERTEX_ATTRIBS=34921]=`MAX_VERTEX_ATTRIBS`,e[e.MAX_VERTEX_UNIFORM_VECTORS=36347]=`MAX_VERTEX_UNIFORM_VECTORS`,e[e.MAX_VARYING_VECTORS=36348]=`MAX_VARYING_VECTORS`,e[e.MAX_COMBINED_TEXTURE_IMAGE_UNITS=35661]=`MAX_COMBINED_TEXTURE_IMAGE_UNITS`,e[e.MAX_VERTEX_TEXTURE_IMAGE_UNITS=35660]=`MAX_VERTEX_TEXTURE_IMAGE_UNITS`,e[e.MAX_TEXTURE_IMAGE_UNITS=34930]=`MAX_TEXTURE_IMAGE_UNITS`,e[e.MAX_FRAGMENT_UNIFORM_VECTORS=36349]=`MAX_FRAGMENT_UNIFORM_VECTORS`,e[e.SHADER_TYPE=35663]=`SHADER_TYPE`,e[e.SHADING_LANGUAGE_VERSION=35724]=`SHADING_LANGUAGE_VERSION`,e[e.CURRENT_PROGRAM=35725]=`CURRENT_PROGRAM`,e[e.NEVER=512]=`NEVER`,e[e.ALWAYS=519]=`ALWAYS`,e[e.LESS=513]=`LESS`,e[e.EQUAL=514]=`EQUAL`,e[e.LEQUAL=515]=`LEQUAL`,e[e.GREATER=516]=`GREATER`,e[e.GEQUAL=518]=`GEQUAL`,e[e.NOTEQUAL=517]=`NOTEQUAL`,e[e.KEEP=7680]=`KEEP`,e[e.REPLACE=7681]=`REPLACE`,e[e.INCR=7682]=`INCR`,e[e.DECR=7683]=`DECR`,e[e.INVERT=5386]=`INVERT`,e[e.INCR_WRAP=34055]=`INCR_WRAP`,e[e.DECR_WRAP=34056]=`DECR_WRAP`,e[e.NEAREST=9728]=`NEAREST`,e[e.LINEAR=9729]=`LINEAR`,e[e.NEAREST_MIPMAP_NEAREST=9984]=`NEAREST_MIPMAP_NEAREST`,e[e.LINEAR_MIPMAP_NEAREST=9985]=`LINEAR_MIPMAP_NEAREST`,e[e.NEAREST_MIPMAP_LINEAR=9986]=`NEAREST_MIPMAP_LINEAR`,e[e.LINEAR_MIPMAP_LINEAR=9987]=`LINEAR_MIPMAP_LINEAR`,e[e.TEXTURE_MAG_FILTER=10240]=`TEXTURE_MAG_FILTER`,e[e.TEXTURE_MIN_FILTER=10241]=`TEXTURE_MIN_FILTER`,e[e.TEXTURE_WRAP_S=10242]=`TEXTURE_WRAP_S`,e[e.TEXTURE_WRAP_T=10243]=`TEXTURE_WRAP_T`,e[e.TEXTURE_2D=3553]=`TEXTURE_2D`,e[e.TEXTURE=5890]=`TEXTURE`,e[e.TEXTURE_CUBE_MAP=34067]=`TEXTURE_CUBE_MAP`,e[e.TEXTURE_BINDING_CUBE_MAP=34068]=`TEXTURE_BINDING_CUBE_MAP`,e[e.TEXTURE_CUBE_MAP_POSITIVE_X=34069]=`TEXTURE_CUBE_MAP_POSITIVE_X`,e[e.TEXTURE_CUBE_MAP_NEGATIVE_X=34070]=`TEXTURE_CUBE_MAP_NEGATIVE_X`,e[e.TEXTURE_CUBE_MAP_POSITIVE_Y=34071]=`TEXTURE_CUBE_MAP_POSITIVE_Y`,e[e.TEXTURE_CUBE_MAP_NEGATIVE_Y=34072]=`TEXTURE_CUBE_MAP_NEGATIVE_Y`,e[e.TEXTURE_CUBE_MAP_POSITIVE_Z=34073]=`TEXTURE_CUBE_MAP_POSITIVE_Z`,e[e.TEXTURE_CUBE_MAP_NEGATIVE_Z=34074]=`TEXTURE_CUBE_MAP_NEGATIVE_Z`,e[e.MAX_CUBE_MAP_TEXTURE_SIZE=34076]=`MAX_CUBE_MAP_TEXTURE_SIZE`,e[e.TEXTURE0=33984]=`TEXTURE0`,e[e.ACTIVE_TEXTURE=34016]=`ACTIVE_TEXTURE`,e[e.REPEAT=10497]=`REPEAT`,e[e.CLAMP_TO_EDGE=33071]=`CLAMP_TO_EDGE`,e[e.MIRRORED_REPEAT=33648]=`MIRRORED_REPEAT`,e[e.TEXTURE_WIDTH=4096]=`TEXTURE_WIDTH`,e[e.TEXTURE_HEIGHT=4097]=`TEXTURE_HEIGHT`,e[e.FLOAT_VEC2=35664]=`FLOAT_VEC2`,e[e.FLOAT_VEC3=35665]=`FLOAT_VEC3`,e[e.FLOAT_VEC4=35666]=`FLOAT_VEC4`,e[e.INT_VEC2=35667]=`INT_VEC2`,e[e.INT_VEC3=35668]=`INT_VEC3`,e[e.INT_VEC4=35669]=`INT_VEC4`,e[e.BOOL=35670]=`BOOL`,e[e.BOOL_VEC2=35671]=`BOOL_VEC2`,e[e.BOOL_VEC3=35672]=`BOOL_VEC3`,e[e.BOOL_VEC4=35673]=`BOOL_VEC4`,e[e.FLOAT_MAT2=35674]=`FLOAT_MAT2`,e[e.FLOAT_MAT3=35675]=`FLOAT_MAT3`,e[e.FLOAT_MAT4=35676]=`FLOAT_MAT4`,e[e.SAMPLER_2D=35678]=`SAMPLER_2D`,e[e.SAMPLER_CUBE=35680]=`SAMPLER_CUBE`,e[e.LOW_FLOAT=36336]=`LOW_FLOAT`,e[e.MEDIUM_FLOAT=36337]=`MEDIUM_FLOAT`,e[e.HIGH_FLOAT=36338]=`HIGH_FLOAT`,e[e.LOW_INT=36339]=`LOW_INT`,e[e.MEDIUM_INT=36340]=`MEDIUM_INT`,e[e.HIGH_INT=36341]=`HIGH_INT`,e[e.FRAMEBUFFER=36160]=`FRAMEBUFFER`,e[e.RENDERBUFFER=36161]=`RENDERBUFFER`,e[e.RGBA4=32854]=`RGBA4`,e[e.RGB5_A1=32855]=`RGB5_A1`,e[e.RGB565=36194]=`RGB565`,e[e.DEPTH_COMPONENT16=33189]=`DEPTH_COMPONENT16`,e[e.STENCIL_INDEX=6401]=`STENCIL_INDEX`,e[e.STENCIL_INDEX8=36168]=`STENCIL_INDEX8`,e[e.DEPTH_STENCIL=34041]=`DEPTH_STENCIL`,e[e.RENDERBUFFER_WIDTH=36162]=`RENDERBUFFER_WIDTH`,e[e.RENDERBUFFER_HEIGHT=36163]=`RENDERBUFFER_HEIGHT`,e[e.RENDERBUFFER_INTERNAL_FORMAT=36164]=`RENDERBUFFER_INTERNAL_FORMAT`,e[e.RENDERBUFFER_RED_SIZE=36176]=`RENDERBUFFER_RED_SIZE`,e[e.RENDERBUFFER_GREEN_SIZE=36177]=`RENDERBUFFER_GREEN_SIZE`,e[e.RENDERBUFFER_BLUE_SIZE=36178]=`RENDERBUFFER_BLUE_SIZE`,e[e.RENDERBUFFER_ALPHA_SIZE=36179]=`RENDERBUFFER_ALPHA_SIZE`,e[e.RENDERBUFFER_DEPTH_SIZE=36180]=`RENDERBUFFER_DEPTH_SIZE`,e[e.RENDERBUFFER_STENCIL_SIZE=36181]=`RENDERBUFFER_STENCIL_SIZE`,e[e.FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE=36048]=`FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE`,e[e.FRAMEBUFFER_ATTACHMENT_OBJECT_NAME=36049]=`FRAMEBUFFER_ATTACHMENT_OBJECT_NAME`,e[e.FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL=36050]=`FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL`,e[e.FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE=36051]=`FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE`,e[e.COLOR_ATTACHMENT0=36064]=`COLOR_ATTACHMENT0`,e[e.DEPTH_ATTACHMENT=36096]=`DEPTH_ATTACHMENT`,e[e.STENCIL_ATTACHMENT=36128]=`STENCIL_ATTACHMENT`,e[e.DEPTH_STENCIL_ATTACHMENT=33306]=`DEPTH_STENCIL_ATTACHMENT`,e[e.NONE=0]=`NONE`,e[e.FRAMEBUFFER_COMPLETE=36053]=`FRAMEBUFFER_COMPLETE`,e[e.FRAMEBUFFER_INCOMPLETE_ATTACHMENT=36054]=`FRAMEBUFFER_INCOMPLETE_ATTACHMENT`,e[e.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT=36055]=`FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT`,e[e.FRAMEBUFFER_INCOMPLETE_DIMENSIONS=36057]=`FRAMEBUFFER_INCOMPLETE_DIMENSIONS`,e[e.FRAMEBUFFER_UNSUPPORTED=36061]=`FRAMEBUFFER_UNSUPPORTED`,e[e.FRAMEBUFFER_BINDING=36006]=`FRAMEBUFFER_BINDING`,e[e.RENDERBUFFER_BINDING=36007]=`RENDERBUFFER_BINDING`,e[e.READ_FRAMEBUFFER=36008]=`READ_FRAMEBUFFER`,e[e.DRAW_FRAMEBUFFER=36009]=`DRAW_FRAMEBUFFER`,e[e.MAX_RENDERBUFFER_SIZE=34024]=`MAX_RENDERBUFFER_SIZE`,e[e.INVALID_FRAMEBUFFER_OPERATION=1286]=`INVALID_FRAMEBUFFER_OPERATION`,e[e.UNPACK_FLIP_Y_WEBGL=37440]=`UNPACK_FLIP_Y_WEBGL`,e[e.UNPACK_PREMULTIPLY_ALPHA_WEBGL=37441]=`UNPACK_PREMULTIPLY_ALPHA_WEBGL`,e[e.UNPACK_COLORSPACE_CONVERSION_WEBGL=37443]=`UNPACK_COLORSPACE_CONVERSION_WEBGL`,e[e.READ_BUFFER=3074]=`READ_BUFFER`,e[e.UNPACK_ROW_LENGTH=3314]=`UNPACK_ROW_LENGTH`,e[e.UNPACK_SKIP_ROWS=3315]=`UNPACK_SKIP_ROWS`,e[e.UNPACK_SKIP_PIXELS=3316]=`UNPACK_SKIP_PIXELS`,e[e.PACK_ROW_LENGTH=3330]=`PACK_ROW_LENGTH`,e[e.PACK_SKIP_ROWS=3331]=`PACK_SKIP_ROWS`,e[e.PACK_SKIP_PIXELS=3332]=`PACK_SKIP_PIXELS`,e[e.TEXTURE_BINDING_3D=32874]=`TEXTURE_BINDING_3D`,e[e.UNPACK_SKIP_IMAGES=32877]=`UNPACK_SKIP_IMAGES`,e[e.UNPACK_IMAGE_HEIGHT=32878]=`UNPACK_IMAGE_HEIGHT`,e[e.MAX_3D_TEXTURE_SIZE=32883]=`MAX_3D_TEXTURE_SIZE`,e[e.MAX_ELEMENTS_VERTICES=33e3]=`MAX_ELEMENTS_VERTICES`,e[e.MAX_ELEMENTS_INDICES=33001]=`MAX_ELEMENTS_INDICES`,e[e.MAX_TEXTURE_LOD_BIAS=34045]=`MAX_TEXTURE_LOD_BIAS`,e[e.MAX_FRAGMENT_UNIFORM_COMPONENTS=35657]=`MAX_FRAGMENT_UNIFORM_COMPONENTS`,e[e.MAX_VERTEX_UNIFORM_COMPONENTS=35658]=`MAX_VERTEX_UNIFORM_COMPONENTS`,e[e.MAX_ARRAY_TEXTURE_LAYERS=35071]=`MAX_ARRAY_TEXTURE_LAYERS`,e[e.MIN_PROGRAM_TEXEL_OFFSET=35076]=`MIN_PROGRAM_TEXEL_OFFSET`,e[e.MAX_PROGRAM_TEXEL_OFFSET=35077]=`MAX_PROGRAM_TEXEL_OFFSET`,e[e.MAX_VARYING_COMPONENTS=35659]=`MAX_VARYING_COMPONENTS`,e[e.FRAGMENT_SHADER_DERIVATIVE_HINT=35723]=`FRAGMENT_SHADER_DERIVATIVE_HINT`,e[e.RASTERIZER_DISCARD=35977]=`RASTERIZER_DISCARD`,e[e.VERTEX_ARRAY_BINDING=34229]=`VERTEX_ARRAY_BINDING`,e[e.MAX_VERTEX_OUTPUT_COMPONENTS=37154]=`MAX_VERTEX_OUTPUT_COMPONENTS`,e[e.MAX_FRAGMENT_INPUT_COMPONENTS=37157]=`MAX_FRAGMENT_INPUT_COMPONENTS`,e[e.MAX_SERVER_WAIT_TIMEOUT=37137]=`MAX_SERVER_WAIT_TIMEOUT`,e[e.MAX_ELEMENT_INDEX=36203]=`MAX_ELEMENT_INDEX`,e[e.RED=6403]=`RED`,e[e.RGB8=32849]=`RGB8`,e[e.RGBA8=32856]=`RGBA8`,e[e.RGB10_A2=32857]=`RGB10_A2`,e[e.TEXTURE_3D=32879]=`TEXTURE_3D`,e[e.TEXTURE_WRAP_R=32882]=`TEXTURE_WRAP_R`,e[e.TEXTURE_MIN_LOD=33082]=`TEXTURE_MIN_LOD`,e[e.TEXTURE_MAX_LOD=33083]=`TEXTURE_MAX_LOD`,e[e.TEXTURE_BASE_LEVEL=33084]=`TEXTURE_BASE_LEVEL`,e[e.TEXTURE_MAX_LEVEL=33085]=`TEXTURE_MAX_LEVEL`,e[e.TEXTURE_COMPARE_MODE=34892]=`TEXTURE_COMPARE_MODE`,e[e.TEXTURE_COMPARE_FUNC=34893]=`TEXTURE_COMPARE_FUNC`,e[e.SRGB=35904]=`SRGB`,e[e.SRGB8=35905]=`SRGB8`,e[e.SRGB8_ALPHA8=35907]=`SRGB8_ALPHA8`,e[e.COMPARE_REF_TO_TEXTURE=34894]=`COMPARE_REF_TO_TEXTURE`,e[e.RGBA32F=34836]=`RGBA32F`,e[e.RGB32F=34837]=`RGB32F`,e[e.RGBA16F=34842]=`RGBA16F`,e[e.RGB16F=34843]=`RGB16F`,e[e.TEXTURE_2D_ARRAY=35866]=`TEXTURE_2D_ARRAY`,e[e.TEXTURE_BINDING_2D_ARRAY=35869]=`TEXTURE_BINDING_2D_ARRAY`,e[e.R11F_G11F_B10F=35898]=`R11F_G11F_B10F`,e[e.RGB9_E5=35901]=`RGB9_E5`,e[e.RGBA32UI=36208]=`RGBA32UI`,e[e.RGB32UI=36209]=`RGB32UI`,e[e.RGBA16UI=36214]=`RGBA16UI`,e[e.RGB16UI=36215]=`RGB16UI`,e[e.RGBA8UI=36220]=`RGBA8UI`,e[e.RGB8UI=36221]=`RGB8UI`,e[e.RGBA32I=36226]=`RGBA32I`,e[e.RGB32I=36227]=`RGB32I`,e[e.RGBA16I=36232]=`RGBA16I`,e[e.RGB16I=36233]=`RGB16I`,e[e.RGBA8I=36238]=`RGBA8I`,e[e.RGB8I=36239]=`RGB8I`,e[e.RED_INTEGER=36244]=`RED_INTEGER`,e[e.RGB_INTEGER=36248]=`RGB_INTEGER`,e[e.RGBA_INTEGER=36249]=`RGBA_INTEGER`,e[e.R8=33321]=`R8`,e[e.RG8=33323]=`RG8`,e[e.R16F=33325]=`R16F`,e[e.R32F=33326]=`R32F`,e[e.RG16F=33327]=`RG16F`,e[e.RG32F=33328]=`RG32F`,e[e.R8I=33329]=`R8I`,e[e.R8UI=33330]=`R8UI`,e[e.R16I=33331]=`R16I`,e[e.R16UI=33332]=`R16UI`,e[e.R32I=33333]=`R32I`,e[e.R32UI=33334]=`R32UI`,e[e.RG8I=33335]=`RG8I`,e[e.RG8UI=33336]=`RG8UI`,e[e.RG16I=33337]=`RG16I`,e[e.RG16UI=33338]=`RG16UI`,e[e.RG32I=33339]=`RG32I`,e[e.RG32UI=33340]=`RG32UI`,e[e.R8_SNORM=36756]=`R8_SNORM`,e[e.RG8_SNORM=36757]=`RG8_SNORM`,e[e.RGB8_SNORM=36758]=`RGB8_SNORM`,e[e.RGBA8_SNORM=36759]=`RGBA8_SNORM`,e[e.RGB10_A2UI=36975]=`RGB10_A2UI`,e[e.TEXTURE_IMMUTABLE_FORMAT=37167]=`TEXTURE_IMMUTABLE_FORMAT`,e[e.TEXTURE_IMMUTABLE_LEVELS=33503]=`TEXTURE_IMMUTABLE_LEVELS`,e[e.UNSIGNED_INT_2_10_10_10_REV=33640]=`UNSIGNED_INT_2_10_10_10_REV`,e[e.UNSIGNED_INT_10F_11F_11F_REV=35899]=`UNSIGNED_INT_10F_11F_11F_REV`,e[e.UNSIGNED_INT_5_9_9_9_REV=35902]=`UNSIGNED_INT_5_9_9_9_REV`,e[e.FLOAT_32_UNSIGNED_INT_24_8_REV=36269]=`FLOAT_32_UNSIGNED_INT_24_8_REV`,e[e.UNSIGNED_INT_24_8=34042]=`UNSIGNED_INT_24_8`,e[e.HALF_FLOAT=5131]=`HALF_FLOAT`,e[e.RG=33319]=`RG`,e[e.RG_INTEGER=33320]=`RG_INTEGER`,e[e.INT_2_10_10_10_REV=36255]=`INT_2_10_10_10_REV`,e[e.CURRENT_QUERY=34917]=`CURRENT_QUERY`,e[e.QUERY_RESULT=34918]=`QUERY_RESULT`,e[e.QUERY_RESULT_AVAILABLE=34919]=`QUERY_RESULT_AVAILABLE`,e[e.ANY_SAMPLES_PASSED=35887]=`ANY_SAMPLES_PASSED`,e[e.ANY_SAMPLES_PASSED_CONSERVATIVE=36202]=`ANY_SAMPLES_PASSED_CONSERVATIVE`,e[e.MAX_DRAW_BUFFERS=34852]=`MAX_DRAW_BUFFERS`,e[e.DRAW_BUFFER0=34853]=`DRAW_BUFFER0`,e[e.DRAW_BUFFER1=34854]=`DRAW_BUFFER1`,e[e.DRAW_BUFFER2=34855]=`DRAW_BUFFER2`,e[e.DRAW_BUFFER3=34856]=`DRAW_BUFFER3`,e[e.DRAW_BUFFER4=34857]=`DRAW_BUFFER4`,e[e.DRAW_BUFFER5=34858]=`DRAW_BUFFER5`,e[e.DRAW_BUFFER6=34859]=`DRAW_BUFFER6`,e[e.DRAW_BUFFER7=34860]=`DRAW_BUFFER7`,e[e.DRAW_BUFFER8=34861]=`DRAW_BUFFER8`,e[e.DRAW_BUFFER9=34862]=`DRAW_BUFFER9`,e[e.DRAW_BUFFER10=34863]=`DRAW_BUFFER10`,e[e.DRAW_BUFFER11=34864]=`DRAW_BUFFER11`,e[e.DRAW_BUFFER12=34865]=`DRAW_BUFFER12`,e[e.DRAW_BUFFER13=34866]=`DRAW_BUFFER13`,e[e.DRAW_BUFFER14=34867]=`DRAW_BUFFER14`,e[e.DRAW_BUFFER15=34868]=`DRAW_BUFFER15`,e[e.MAX_COLOR_ATTACHMENTS=36063]=`MAX_COLOR_ATTACHMENTS`,e[e.COLOR_ATTACHMENT1=36065]=`COLOR_ATTACHMENT1`,e[e.COLOR_ATTACHMENT2=36066]=`COLOR_ATTACHMENT2`,e[e.COLOR_ATTACHMENT3=36067]=`COLOR_ATTACHMENT3`,e[e.COLOR_ATTACHMENT4=36068]=`COLOR_ATTACHMENT4`,e[e.COLOR_ATTACHMENT5=36069]=`COLOR_ATTACHMENT5`,e[e.COLOR_ATTACHMENT6=36070]=`COLOR_ATTACHMENT6`,e[e.COLOR_ATTACHMENT7=36071]=`COLOR_ATTACHMENT7`,e[e.COLOR_ATTACHMENT8=36072]=`COLOR_ATTACHMENT8`,e[e.COLOR_ATTACHMENT9=36073]=`COLOR_ATTACHMENT9`,e[e.COLOR_ATTACHMENT10=36074]=`COLOR_ATTACHMENT10`,e[e.COLOR_ATTACHMENT11=36075]=`COLOR_ATTACHMENT11`,e[e.COLOR_ATTACHMENT12=36076]=`COLOR_ATTACHMENT12`,e[e.COLOR_ATTACHMENT13=36077]=`COLOR_ATTACHMENT13`,e[e.COLOR_ATTACHMENT14=36078]=`COLOR_ATTACHMENT14`,e[e.COLOR_ATTACHMENT15=36079]=`COLOR_ATTACHMENT15`,e[e.SAMPLER_3D=35679]=`SAMPLER_3D`,e[e.SAMPLER_2D_SHADOW=35682]=`SAMPLER_2D_SHADOW`,e[e.SAMPLER_2D_ARRAY=36289]=`SAMPLER_2D_ARRAY`,e[e.SAMPLER_2D_ARRAY_SHADOW=36292]=`SAMPLER_2D_ARRAY_SHADOW`,e[e.SAMPLER_CUBE_SHADOW=36293]=`SAMPLER_CUBE_SHADOW`,e[e.INT_SAMPLER_2D=36298]=`INT_SAMPLER_2D`,e[e.INT_SAMPLER_3D=36299]=`INT_SAMPLER_3D`,e[e.INT_SAMPLER_CUBE=36300]=`INT_SAMPLER_CUBE`,e[e.INT_SAMPLER_2D_ARRAY=36303]=`INT_SAMPLER_2D_ARRAY`,e[e.UNSIGNED_INT_SAMPLER_2D=36306]=`UNSIGNED_INT_SAMPLER_2D`,e[e.UNSIGNED_INT_SAMPLER_3D=36307]=`UNSIGNED_INT_SAMPLER_3D`,e[e.UNSIGNED_INT_SAMPLER_CUBE=36308]=`UNSIGNED_INT_SAMPLER_CUBE`,e[e.UNSIGNED_INT_SAMPLER_2D_ARRAY=36311]=`UNSIGNED_INT_SAMPLER_2D_ARRAY`,e[e.MAX_SAMPLES=36183]=`MAX_SAMPLES`,e[e.SAMPLER_BINDING=35097]=`SAMPLER_BINDING`,e[e.PIXEL_PACK_BUFFER=35051]=`PIXEL_PACK_BUFFER`,e[e.PIXEL_UNPACK_BUFFER=35052]=`PIXEL_UNPACK_BUFFER`,e[e.PIXEL_PACK_BUFFER_BINDING=35053]=`PIXEL_PACK_BUFFER_BINDING`,e[e.PIXEL_UNPACK_BUFFER_BINDING=35055]=`PIXEL_UNPACK_BUFFER_BINDING`,e[e.COPY_READ_BUFFER=36662]=`COPY_READ_BUFFER`,e[e.COPY_WRITE_BUFFER=36663]=`COPY_WRITE_BUFFER`,e[e.COPY_READ_BUFFER_BINDING=36662]=`COPY_READ_BUFFER_BINDING`,e[e.COPY_WRITE_BUFFER_BINDING=36663]=`COPY_WRITE_BUFFER_BINDING`,e[e.FLOAT_MAT2x3=35685]=`FLOAT_MAT2x3`,e[e.FLOAT_MAT2x4=35686]=`FLOAT_MAT2x4`,e[e.FLOAT_MAT3x2=35687]=`FLOAT_MAT3x2`,e[e.FLOAT_MAT3x4=35688]=`FLOAT_MAT3x4`,e[e.FLOAT_MAT4x2=35689]=`FLOAT_MAT4x2`,e[e.FLOAT_MAT4x3=35690]=`FLOAT_MAT4x3`,e[e.UNSIGNED_INT_VEC2=36294]=`UNSIGNED_INT_VEC2`,e[e.UNSIGNED_INT_VEC3=36295]=`UNSIGNED_INT_VEC3`,e[e.UNSIGNED_INT_VEC4=36296]=`UNSIGNED_INT_VEC4`,e[e.UNSIGNED_NORMALIZED=35863]=`UNSIGNED_NORMALIZED`,e[e.SIGNED_NORMALIZED=36764]=`SIGNED_NORMALIZED`,e[e.VERTEX_ATTRIB_ARRAY_INTEGER=35069]=`VERTEX_ATTRIB_ARRAY_INTEGER`,e[e.VERTEX_ATTRIB_ARRAY_DIVISOR=35070]=`VERTEX_ATTRIB_ARRAY_DIVISOR`,e[e.TRANSFORM_FEEDBACK_BUFFER_MODE=35967]=`TRANSFORM_FEEDBACK_BUFFER_MODE`,e[e.MAX_TRANSFORM_FEEDBACK_SEPARATE_COMPONENTS=35968]=`MAX_TRANSFORM_FEEDBACK_SEPARATE_COMPONENTS`,e[e.TRANSFORM_FEEDBACK_VARYINGS=35971]=`TRANSFORM_FEEDBACK_VARYINGS`,e[e.TRANSFORM_FEEDBACK_BUFFER_START=35972]=`TRANSFORM_FEEDBACK_BUFFER_START`,e[e.TRANSFORM_FEEDBACK_BUFFER_SIZE=35973]=`TRANSFORM_FEEDBACK_BUFFER_SIZE`,e[e.TRANSFORM_FEEDBACK_PRIMITIVES_WRITTEN=35976]=`TRANSFORM_FEEDBACK_PRIMITIVES_WRITTEN`,e[e.MAX_TRANSFORM_FEEDBACK_INTERLEAVED_COMPONENTS=35978]=`MAX_TRANSFORM_FEEDBACK_INTERLEAVED_COMPONENTS`,e[e.MAX_TRANSFORM_FEEDBACK_SEPARATE_ATTRIBS=35979]=`MAX_TRANSFORM_FEEDBACK_SEPARATE_ATTRIBS`,e[e.INTERLEAVED_ATTRIBS=35980]=`INTERLEAVED_ATTRIBS`,e[e.SEPARATE_ATTRIBS=35981]=`SEPARATE_ATTRIBS`,e[e.TRANSFORM_FEEDBACK_BUFFER=35982]=`TRANSFORM_FEEDBACK_BUFFER`,e[e.TRANSFORM_FEEDBACK_BUFFER_BINDING=35983]=`TRANSFORM_FEEDBACK_BUFFER_BINDING`,e[e.TRANSFORM_FEEDBACK=36386]=`TRANSFORM_FEEDBACK`,e[e.TRANSFORM_FEEDBACK_PAUSED=36387]=`TRANSFORM_FEEDBACK_PAUSED`,e[e.TRANSFORM_FEEDBACK_ACTIVE=36388]=`TRANSFORM_FEEDBACK_ACTIVE`,e[e.TRANSFORM_FEEDBACK_BINDING=36389]=`TRANSFORM_FEEDBACK_BINDING`,e[e.FRAMEBUFFER_ATTACHMENT_COLOR_ENCODING=33296]=`FRAMEBUFFER_ATTACHMENT_COLOR_ENCODING`,e[e.FRAMEBUFFER_ATTACHMENT_COMPONENT_TYPE=33297]=`FRAMEBUFFER_ATTACHMENT_COMPONENT_TYPE`,e[e.FRAMEBUFFER_ATTACHMENT_RED_SIZE=33298]=`FRAMEBUFFER_ATTACHMENT_RED_SIZE`,e[e.FRAMEBUFFER_ATTACHMENT_GREEN_SIZE=33299]=`FRAMEBUFFER_ATTACHMENT_GREEN_SIZE`,e[e.FRAMEBUFFER_ATTACHMENT_BLUE_SIZE=33300]=`FRAMEBUFFER_ATTACHMENT_BLUE_SIZE`,e[e.FRAMEBUFFER_ATTACHMENT_ALPHA_SIZE=33301]=`FRAMEBUFFER_ATTACHMENT_ALPHA_SIZE`,e[e.FRAMEBUFFER_ATTACHMENT_DEPTH_SIZE=33302]=`FRAMEBUFFER_ATTACHMENT_DEPTH_SIZE`,e[e.FRAMEBUFFER_ATTACHMENT_STENCIL_SIZE=33303]=`FRAMEBUFFER_ATTACHMENT_STENCIL_SIZE`,e[e.FRAMEBUFFER_DEFAULT=33304]=`FRAMEBUFFER_DEFAULT`,e[e.DEPTH24_STENCIL8=35056]=`DEPTH24_STENCIL8`,e[e.DRAW_FRAMEBUFFER_BINDING=36006]=`DRAW_FRAMEBUFFER_BINDING`,e[e.READ_FRAMEBUFFER_BINDING=36010]=`READ_FRAMEBUFFER_BINDING`,e[e.RENDERBUFFER_SAMPLES=36011]=`RENDERBUFFER_SAMPLES`,e[e.FRAMEBUFFER_ATTACHMENT_TEXTURE_LAYER=36052]=`FRAMEBUFFER_ATTACHMENT_TEXTURE_LAYER`,e[e.FRAMEBUFFER_INCOMPLETE_MULTISAMPLE=36182]=`FRAMEBUFFER_INCOMPLETE_MULTISAMPLE`,e[e.UNIFORM_BUFFER=35345]=`UNIFORM_BUFFER`,e[e.UNIFORM_BUFFER_BINDING=35368]=`UNIFORM_BUFFER_BINDING`,e[e.UNIFORM_BUFFER_START=35369]=`UNIFORM_BUFFER_START`,e[e.UNIFORM_BUFFER_SIZE=35370]=`UNIFORM_BUFFER_SIZE`,e[e.MAX_VERTEX_UNIFORM_BLOCKS=35371]=`MAX_VERTEX_UNIFORM_BLOCKS`,e[e.MAX_FRAGMENT_UNIFORM_BLOCKS=35373]=`MAX_FRAGMENT_UNIFORM_BLOCKS`,e[e.MAX_COMBINED_UNIFORM_BLOCKS=35374]=`MAX_COMBINED_UNIFORM_BLOCKS`,e[e.MAX_UNIFORM_BUFFER_BINDINGS=35375]=`MAX_UNIFORM_BUFFER_BINDINGS`,e[e.MAX_UNIFORM_BLOCK_SIZE=35376]=`MAX_UNIFORM_BLOCK_SIZE`,e[e.MAX_COMBINED_VERTEX_UNIFORM_COMPONENTS=35377]=`MAX_COMBINED_VERTEX_UNIFORM_COMPONENTS`,e[e.MAX_COMBINED_FRAGMENT_UNIFORM_COMPONENTS=35379]=`MAX_COMBINED_FRAGMENT_UNIFORM_COMPONENTS`,e[e.UNIFORM_BUFFER_OFFSET_ALIGNMENT=35380]=`UNIFORM_BUFFER_OFFSET_ALIGNMENT`,e[e.ACTIVE_UNIFORM_BLOCKS=35382]=`ACTIVE_UNIFORM_BLOCKS`,e[e.UNIFORM_TYPE=35383]=`UNIFORM_TYPE`,e[e.UNIFORM_SIZE=35384]=`UNIFORM_SIZE`,e[e.UNIFORM_BLOCK_INDEX=35386]=`UNIFORM_BLOCK_INDEX`,e[e.UNIFORM_OFFSET=35387]=`UNIFORM_OFFSET`,e[e.UNIFORM_ARRAY_STRIDE=35388]=`UNIFORM_ARRAY_STRIDE`,e[e.UNIFORM_MATRIX_STRIDE=35389]=`UNIFORM_MATRIX_STRIDE`,e[e.UNIFORM_IS_ROW_MAJOR=35390]=`UNIFORM_IS_ROW_MAJOR`,e[e.UNIFORM_BLOCK_BINDING=35391]=`UNIFORM_BLOCK_BINDING`,e[e.UNIFORM_BLOCK_DATA_SIZE=35392]=`UNIFORM_BLOCK_DATA_SIZE`,e[e.UNIFORM_BLOCK_ACTIVE_UNIFORMS=35394]=`UNIFORM_BLOCK_ACTIVE_UNIFORMS`,e[e.UNIFORM_BLOCK_ACTIVE_UNIFORM_INDICES=35395]=`UNIFORM_BLOCK_ACTIVE_UNIFORM_INDICES`,e[e.UNIFORM_BLOCK_REFERENCED_BY_VERTEX_SHADER=35396]=`UNIFORM_BLOCK_REFERENCED_BY_VERTEX_SHADER`,e[e.UNIFORM_BLOCK_REFERENCED_BY_FRAGMENT_SHADER=35398]=`UNIFORM_BLOCK_REFERENCED_BY_FRAGMENT_SHADER`,e[e.OBJECT_TYPE=37138]=`OBJECT_TYPE`,e[e.SYNC_CONDITION=37139]=`SYNC_CONDITION`,e[e.SYNC_STATUS=37140]=`SYNC_STATUS`,e[e.SYNC_FLAGS=37141]=`SYNC_FLAGS`,e[e.SYNC_FENCE=37142]=`SYNC_FENCE`,e[e.SYNC_GPU_COMMANDS_COMPLETE=37143]=`SYNC_GPU_COMMANDS_COMPLETE`,e[e.UNSIGNALED=37144]=`UNSIGNALED`,e[e.SIGNALED=37145]=`SIGNALED`,e[e.ALREADY_SIGNALED=37146]=`ALREADY_SIGNALED`,e[e.TIMEOUT_EXPIRED=37147]=`TIMEOUT_EXPIRED`,e[e.CONDITION_SATISFIED=37148]=`CONDITION_SATISFIED`,e[e.WAIT_FAILED=37149]=`WAIT_FAILED`,e[e.SYNC_FLUSH_COMMANDS_BIT=1]=`SYNC_FLUSH_COMMANDS_BIT`,e[e.COLOR=6144]=`COLOR`,e[e.DEPTH=6145]=`DEPTH`,e[e.STENCIL=6146]=`STENCIL`,e[e.MIN=32775]=`MIN`,e[e.MAX=32776]=`MAX`,e[e.DEPTH_COMPONENT24=33190]=`DEPTH_COMPONENT24`,e[e.STREAM_READ=35041]=`STREAM_READ`,e[e.STREAM_COPY=35042]=`STREAM_COPY`,e[e.STATIC_READ=35045]=`STATIC_READ`,e[e.STATIC_COPY=35046]=`STATIC_COPY`,e[e.DYNAMIC_READ=35049]=`DYNAMIC_READ`,e[e.DYNAMIC_COPY=35050]=`DYNAMIC_COPY`,e[e.DEPTH_COMPONENT32F=36012]=`DEPTH_COMPONENT32F`,e[e.DEPTH32F_STENCIL8=36013]=`DEPTH32F_STENCIL8`,e[e.INVALID_INDEX=4294967295]=`INVALID_INDEX`,e[e.TIMEOUT_IGNORED=-1]=`TIMEOUT_IGNORED`,e[e.MAX_CLIENT_WAIT_TIMEOUT_WEBGL=37447]=`MAX_CLIENT_WAIT_TIMEOUT_WEBGL`,e[e.VERTEX_ATTRIB_ARRAY_DIVISOR_ANGLE=35070]=`VERTEX_ATTRIB_ARRAY_DIVISOR_ANGLE`,e[e.UNMASKED_VENDOR_WEBGL=37445]=`UNMASKED_VENDOR_WEBGL`,e[e.UNMASKED_RENDERER_WEBGL=37446]=`UNMASKED_RENDERER_WEBGL`,e[e.MAX_TEXTURE_MAX_ANISOTROPY_EXT=34047]=`MAX_TEXTURE_MAX_ANISOTROPY_EXT`,e[e.TEXTURE_MAX_ANISOTROPY_EXT=34046]=`TEXTURE_MAX_ANISOTROPY_EXT`,e[e.COMPRESSED_RGB_S3TC_DXT1_EXT=33776]=`COMPRESSED_RGB_S3TC_DXT1_EXT`,e[e.COMPRESSED_RGBA_S3TC_DXT1_EXT=33777]=`COMPRESSED_RGBA_S3TC_DXT1_EXT`,e[e.COMPRESSED_RGBA_S3TC_DXT3_EXT=33778]=`COMPRESSED_RGBA_S3TC_DXT3_EXT`,e[e.COMPRESSED_RGBA_S3TC_DXT5_EXT=33779]=`COMPRESSED_RGBA_S3TC_DXT5_EXT`,e[e.COMPRESSED_R11_EAC=37488]=`COMPRESSED_R11_EAC`,e[e.COMPRESSED_SIGNED_R11_EAC=37489]=`COMPRESSED_SIGNED_R11_EAC`,e[e.COMPRESSED_RG11_EAC=37490]=`COMPRESSED_RG11_EAC`,e[e.COMPRESSED_SIGNED_RG11_EAC=37491]=`COMPRESSED_SIGNED_RG11_EAC`,e[e.COMPRESSED_RGB8_ETC2=37492]=`COMPRESSED_RGB8_ETC2`,e[e.COMPRESSED_RGBA8_ETC2_EAC=37493]=`COMPRESSED_RGBA8_ETC2_EAC`,e[e.COMPRESSED_SRGB8_ETC2=37494]=`COMPRESSED_SRGB8_ETC2`,e[e.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC=37495]=`COMPRESSED_SRGB8_ALPHA8_ETC2_EAC`,e[e.COMPRESSED_RGB8_PUNCHTHROUGH_ALPHA1_ETC2=37496]=`COMPRESSED_RGB8_PUNCHTHROUGH_ALPHA1_ETC2`,e[e.COMPRESSED_SRGB8_PUNCHTHROUGH_ALPHA1_ETC2=37497]=`COMPRESSED_SRGB8_PUNCHTHROUGH_ALPHA1_ETC2`,e[e.COMPRESSED_RGB_PVRTC_4BPPV1_IMG=35840]=`COMPRESSED_RGB_PVRTC_4BPPV1_IMG`,e[e.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG=35842]=`COMPRESSED_RGBA_PVRTC_4BPPV1_IMG`,e[e.COMPRESSED_RGB_PVRTC_2BPPV1_IMG=35841]=`COMPRESSED_RGB_PVRTC_2BPPV1_IMG`,e[e.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG=35843]=`COMPRESSED_RGBA_PVRTC_2BPPV1_IMG`,e[e.COMPRESSED_RGB_ETC1_WEBGL=36196]=`COMPRESSED_RGB_ETC1_WEBGL`,e[e.COMPRESSED_RGB_ATC_WEBGL=35986]=`COMPRESSED_RGB_ATC_WEBGL`,e[e.COMPRESSED_RGBA_ATC_EXPLICIT_ALPHA_WEBGL=35986]=`COMPRESSED_RGBA_ATC_EXPLICIT_ALPHA_WEBGL`,e[e.COMPRESSED_RGBA_ATC_INTERPOLATED_ALPHA_WEBGL=34798]=`COMPRESSED_RGBA_ATC_INTERPOLATED_ALPHA_WEBGL`,e[e.UNSIGNED_INT_24_8_WEBGL=34042]=`UNSIGNED_INT_24_8_WEBGL`,e[e.HALF_FLOAT_OES=36193]=`HALF_FLOAT_OES`,e[e.RGBA32F_EXT=34836]=`RGBA32F_EXT`,e[e.RGB32F_EXT=34837]=`RGB32F_EXT`,e[e.FRAMEBUFFER_ATTACHMENT_COMPONENT_TYPE_EXT=33297]=`FRAMEBUFFER_ATTACHMENT_COMPONENT_TYPE_EXT`,e[e.UNSIGNED_NORMALIZED_EXT=35863]=`UNSIGNED_NORMALIZED_EXT`,e[e.MIN_EXT=32775]=`MIN_EXT`,e[e.MAX_EXT=32776]=`MAX_EXT`,e[e.SRGB_EXT=35904]=`SRGB_EXT`,e[e.SRGB_ALPHA_EXT=35906]=`SRGB_ALPHA_EXT`,e[e.SRGB8_ALPHA8_EXT=35907]=`SRGB8_ALPHA8_EXT`,e[e.FRAMEBUFFER_ATTACHMENT_COLOR_ENCODING_EXT=33296]=`FRAMEBUFFER_ATTACHMENT_COLOR_ENCODING_EXT`,e[e.FRAGMENT_SHADER_DERIVATIVE_HINT_OES=35723]=`FRAGMENT_SHADER_DERIVATIVE_HINT_OES`,e[e.COLOR_ATTACHMENT0_WEBGL=36064]=`COLOR_ATTACHMENT0_WEBGL`,e[e.COLOR_ATTACHMENT1_WEBGL=36065]=`COLOR_ATTACHMENT1_WEBGL`,e[e.COLOR_ATTACHMENT2_WEBGL=36066]=`COLOR_ATTACHMENT2_WEBGL`,e[e.COLOR_ATTACHMENT3_WEBGL=36067]=`COLOR_ATTACHMENT3_WEBGL`,e[e.COLOR_ATTACHMENT4_WEBGL=36068]=`COLOR_ATTACHMENT4_WEBGL`,e[e.COLOR_ATTACHMENT5_WEBGL=36069]=`COLOR_ATTACHMENT5_WEBGL`,e[e.COLOR_ATTACHMENT6_WEBGL=36070]=`COLOR_ATTACHMENT6_WEBGL`,e[e.COLOR_ATTACHMENT7_WEBGL=36071]=`COLOR_ATTACHMENT7_WEBGL`,e[e.COLOR_ATTACHMENT8_WEBGL=36072]=`COLOR_ATTACHMENT8_WEBGL`,e[e.COLOR_ATTACHMENT9_WEBGL=36073]=`COLOR_ATTACHMENT9_WEBGL`,e[e.COLOR_ATTACHMENT10_WEBGL=36074]=`COLOR_ATTACHMENT10_WEBGL`,e[e.COLOR_ATTACHMENT11_WEBGL=36075]=`COLOR_ATTACHMENT11_WEBGL`,e[e.COLOR_ATTACHMENT12_WEBGL=36076]=`COLOR_ATTACHMENT12_WEBGL`,e[e.COLOR_ATTACHMENT13_WEBGL=36077]=`COLOR_ATTACHMENT13_WEBGL`,e[e.COLOR_ATTACHMENT14_WEBGL=36078]=`COLOR_ATTACHMENT14_WEBGL`,e[e.COLOR_ATTACHMENT15_WEBGL=36079]=`COLOR_ATTACHMENT15_WEBGL`,e[e.DRAW_BUFFER0_WEBGL=34853]=`DRAW_BUFFER0_WEBGL`,e[e.DRAW_BUFFER1_WEBGL=34854]=`DRAW_BUFFER1_WEBGL`,e[e.DRAW_BUFFER2_WEBGL=34855]=`DRAW_BUFFER2_WEBGL`,e[e.DRAW_BUFFER3_WEBGL=34856]=`DRAW_BUFFER3_WEBGL`,e[e.DRAW_BUFFER4_WEBGL=34857]=`DRAW_BUFFER4_WEBGL`,e[e.DRAW_BUFFER5_WEBGL=34858]=`DRAW_BUFFER5_WEBGL`,e[e.DRAW_BUFFER6_WEBGL=34859]=`DRAW_BUFFER6_WEBGL`,e[e.DRAW_BUFFER7_WEBGL=34860]=`DRAW_BUFFER7_WEBGL`,e[e.DRAW_BUFFER8_WEBGL=34861]=`DRAW_BUFFER8_WEBGL`,e[e.DRAW_BUFFER9_WEBGL=34862]=`DRAW_BUFFER9_WEBGL`,e[e.DRAW_BUFFER10_WEBGL=34863]=`DRAW_BUFFER10_WEBGL`,e[e.DRAW_BUFFER11_WEBGL=34864]=`DRAW_BUFFER11_WEBGL`,e[e.DRAW_BUFFER12_WEBGL=34865]=`DRAW_BUFFER12_WEBGL`,e[e.DRAW_BUFFER13_WEBGL=34866]=`DRAW_BUFFER13_WEBGL`,e[e.DRAW_BUFFER14_WEBGL=34867]=`DRAW_BUFFER14_WEBGL`,e[e.DRAW_BUFFER15_WEBGL=34868]=`DRAW_BUFFER15_WEBGL`,e[e.MAX_COLOR_ATTACHMENTS_WEBGL=36063]=`MAX_COLOR_ATTACHMENTS_WEBGL`,e[e.MAX_DRAW_BUFFERS_WEBGL=34852]=`MAX_DRAW_BUFFERS_WEBGL`,e[e.VERTEX_ARRAY_BINDING_OES=34229]=`VERTEX_ARRAY_BINDING_OES`,e[e.QUERY_COUNTER_BITS_EXT=34916]=`QUERY_COUNTER_BITS_EXT`,e[e.CURRENT_QUERY_EXT=34917]=`CURRENT_QUERY_EXT`,e[e.QUERY_RESULT_EXT=34918]=`QUERY_RESULT_EXT`,e[e.QUERY_RESULT_AVAILABLE_EXT=34919]=`QUERY_RESULT_AVAILABLE_EXT`,e[e.TIME_ELAPSED_EXT=35007]=`TIME_ELAPSED_EXT`,e[e.TIMESTAMP_EXT=36392]=`TIMESTAMP_EXT`,e[e.GPU_DISJOINT_EXT=36795]=`GPU_DISJOINT_EXT`})(B||={}),(function(e){e[e.Buffer=0]=`Buffer`,e[e.Texture=1]=`Texture`,e[e.RenderTarget=2]=`RenderTarget`,e[e.Sampler=3]=`Sampler`,e[e.Program=4]=`Program`,e[e.Bindings=5]=`Bindings`,e[e.InputLayout=6]=`InputLayout`,e[e.RenderPipeline=7]=`RenderPipeline`,e[e.ComputePipeline=8]=`ComputePipeline`,e[e.Readback=9]=`Readback`,e[e.QueryPool=10]=`QueryPool`,e[e.RenderBundle=11]=`RenderBundle`})(V||={}),(function(e){e[e.NEVER=512]=`NEVER`,e[e.LESS=513]=`LESS`,e[e.EQUAL=514]=`EQUAL`,e[e.LEQUAL=515]=`LEQUAL`,e[e.GREATER=516]=`GREATER`,e[e.NOTEQUAL=517]=`NOTEQUAL`,e[e.GEQUAL=518]=`GEQUAL`,e[e.ALWAYS=519]=`ALWAYS`})(H||={}),(function(e){e[e.CCW=2305]=`CCW`,e[e.CW=2304]=`CW`})(uS||={}),(function(e){e[e.NONE=0]=`NONE`,e[e.FRONT=1]=`FRONT`,e[e.BACK=2]=`BACK`,e[e.FRONT_AND_BACK=3]=`FRONT_AND_BACK`})(dS||={}),(function(e){e[e.ZERO=0]=`ZERO`,e[e.ONE=1]=`ONE`,e[e.SRC=768]=`SRC`,e[e.ONE_MINUS_SRC=769]=`ONE_MINUS_SRC`,e[e.DST=774]=`DST`,e[e.ONE_MINUS_DST=775]=`ONE_MINUS_DST`,e[e.SRC_ALPHA=770]=`SRC_ALPHA`,e[e.ONE_MINUS_SRC_ALPHA=771]=`ONE_MINUS_SRC_ALPHA`,e[e.DST_ALPHA=772]=`DST_ALPHA`,e[e.ONE_MINUS_DST_ALPHA=773]=`ONE_MINUS_DST_ALPHA`,e[e.CONST=32769]=`CONST`,e[e.ONE_MINUS_CONSTANT=32770]=`ONE_MINUS_CONSTANT`,e[e.SRC_ALPHA_SATURATE=776]=`SRC_ALPHA_SATURATE`})(U||={}),(function(e){e[e.ADD=32774]=`ADD`,e[e.SUBSTRACT=32778]=`SUBSTRACT`,e[e.REVERSE_SUBSTRACT=32779]=`REVERSE_SUBSTRACT`,e[e.MIN=32775]=`MIN`,e[e.MAX=32776]=`MAX`})(fS||={}),(function(e){e[e.CLAMP_TO_EDGE=0]=`CLAMP_TO_EDGE`,e[e.REPEAT=1]=`REPEAT`,e[e.MIRRORED_REPEAT=2]=`MIRRORED_REPEAT`})(pS||={}),(function(e){e[e.POINT=0]=`POINT`,e[e.BILINEAR=1]=`BILINEAR`})(mS||={}),(function(e){e[e.NO_MIP=0]=`NO_MIP`,e[e.NEAREST=1]=`NEAREST`,e[e.LINEAR=2]=`LINEAR`})(hS||={}),(function(e){e[e.POINTS=0]=`POINTS`,e[e.TRIANGLES=1]=`TRIANGLES`,e[e.TRIANGLE_STRIP=2]=`TRIANGLE_STRIP`,e[e.LINES=3]=`LINES`,e[e.LINE_STRIP=4]=`LINE_STRIP`})(gS||={}),(function(e){e[e.MAP_READ=1]=`MAP_READ`,e[e.MAP_WRITE=2]=`MAP_WRITE`,e[e.COPY_SRC=4]=`COPY_SRC`,e[e.COPY_DST=8]=`COPY_DST`,e[e.INDEX=16]=`INDEX`,e[e.VERTEX=32]=`VERTEX`,e[e.UNIFORM=64]=`UNIFORM`,e[e.STORAGE=128]=`STORAGE`,e[e.INDIRECT=256]=`INDIRECT`,e[e.QUERY_RESOLVE=512]=`QUERY_RESOLVE`})(W||={}),(function(e){e[e.STATIC=1]=`STATIC`,e[e.DYNAMIC=2]=`DYNAMIC`})(_S||={}),(function(e){e[e.VERTEX=1]=`VERTEX`,e[e.INSTANCE=2]=`INSTANCE`})(vS||={}),(function(e){e.LOADED=`loaded`})(yS||={}),(function(e){e[e.TEXTURE_2D=0]=`TEXTURE_2D`,e[e.TEXTURE_2D_ARRAY=1]=`TEXTURE_2D_ARRAY`,e[e.TEXTURE_3D=2]=`TEXTURE_3D`,e[e.TEXTURE_CUBE_MAP=3]=`TEXTURE_CUBE_MAP`})(G||={}),(function(e){e[e.SAMPLED=1]=`SAMPLED`,e[e.RENDER_TARGET=2]=`RENDER_TARGET`,e[e.STORAGE=4]=`STORAGE`})(bS||={}),(function(e){e[e.NONE=0]=`NONE`,e[e.RED=1]=`RED`,e[e.GREEN=2]=`GREEN`,e[e.BLUE=4]=`BLUE`,e[e.ALPHA=8]=`ALPHA`,e[e.RGB=7]=`RGB`,e[e.ALL=15]=`ALL`})(xS||={}),(function(e){e[e.KEEP=7680]=`KEEP`,e[e.ZERO=0]=`ZERO`,e[e.REPLACE=7681]=`REPLACE`,e[e.INVERT=5386]=`INVERT`,e[e.INCREMENT_CLAMP=7682]=`INCREMENT_CLAMP`,e[e.DECREMENT_CLAMP=7683]=`DECREMENT_CLAMP`,e[e.INCREMENT_WRAP=34055]=`INCREMENT_WRAP`,e[e.DECREMENT_WRAP=34056]=`DECREMENT_WRAP`})(K||={}),(function(e){e[e.Float=0]=`Float`,e[e.UnfilterableFloat=1]=`UnfilterableFloat`,e[e.Uint=2]=`Uint`,e[e.Sint=3]=`Sint`,e[e.Depth=4]=`Depth`})(SS||={}),(function(e){e[e.LOWER_LEFT=0]=`LOWER_LEFT`,e[e.UPPER_LEFT=1]=`UPPER_LEFT`})(CS||={}),(function(e){e[e.NEGATIVE_ONE=0]=`NEGATIVE_ONE`,e[e.ZERO=1]=`ZERO`})(wS||={}),(function(e){e[e.OcclusionConservative=0]=`OcclusionConservative`})(TS||={}),(function(e){e[e.U8=1]=`U8`,e[e.U16=2]=`U16`,e[e.U32=3]=`U32`,e[e.S8=4]=`S8`,e[e.S16=5]=`S16`,e[e.S32=6]=`S32`,e[e.F16=7]=`F16`,e[e.F32=8]=`F32`,e[e.BC1=65]=`BC1`,e[e.BC2=66]=`BC2`,e[e.BC3=67]=`BC3`,e[e.BC4_UNORM=68]=`BC4_UNORM`,e[e.BC4_SNORM=69]=`BC4_SNORM`,e[e.BC5_UNORM=70]=`BC5_UNORM`,e[e.BC5_SNORM=71]=`BC5_SNORM`,e[e.U16_PACKED_5551=97]=`U16_PACKED_5551`,e[e.U16_PACKED_565=98]=`U16_PACKED_565`,e[e.D24=129]=`D24`,e[e.D32F=130]=`D32F`,e[e.D24S8=131]=`D24S8`,e[e.D32FS8=132]=`D32FS8`})(q||={}),(function(e){e[e.R=1]=`R`,e[e.RG=2]=`RG`,e[e.RGB=3]=`RGB`,e[e.RGBA=4]=`RGBA`,e[e.A=5]=`A`})(J||={}),(function(e){e[e.None=0]=`None`,e[e.Normalized=1]=`Normalized`,e[e.sRGB=2]=`sRGB`,e[e.Depth=4]=`Depth`,e[e.Stencil=8]=`Stencil`,e[e.RenderTarget=16]=`RenderTarget`,e[e.Luminance=32]=`Luminance`})(Y||={}),(function(e){e[e.ALPHA=I(q.U8,J.A,Y.None)]=`ALPHA`,e[e.U8_LUMINANCE=I(q.U8,J.A,Y.Luminance)]=`U8_LUMINANCE`,e[e.F16_LUMINANCE=I(q.F16,J.A,Y.Luminance)]=`F16_LUMINANCE`,e[e.F32_LUMINANCE=I(q.F32,J.A,Y.Luminance)]=`F32_LUMINANCE`,e[e.F16_R=I(q.F16,J.R,Y.None)]=`F16_R`,e[e.F16_RG=I(q.F16,J.RG,Y.None)]=`F16_RG`,e[e.F16_RGB=I(q.F16,J.RGB,Y.None)]=`F16_RGB`,e[e.F16_RGBA=I(q.F16,J.RGBA,Y.None)]=`F16_RGBA`,e[e.F32_R=I(q.F32,J.R,Y.None)]=`F32_R`,e[e.F32_RG=I(q.F32,J.RG,Y.None)]=`F32_RG`,e[e.F32_RGB=I(q.F32,J.RGB,Y.None)]=`F32_RGB`,e[e.F32_RGBA=I(q.F32,J.RGBA,Y.None)]=`F32_RGBA`,e[e.U8_R=I(q.U8,J.R,Y.None)]=`U8_R`,e[e.U8_R_NORM=I(q.U8,J.R,Y.Normalized)]=`U8_R_NORM`,e[e.U8_RG=I(q.U8,J.RG,Y.None)]=`U8_RG`,e[e.U8_RG_NORM=I(q.U8,J.RG,Y.Normalized)]=`U8_RG_NORM`,e[e.U8_RGB=I(q.U8,J.RGB,Y.None)]=`U8_RGB`,e[e.U8_RGB_NORM=I(q.U8,J.RGB,Y.Normalized)]=`U8_RGB_NORM`,e[e.U8_RGB_SRGB=I(q.U8,J.RGB,Y.sRGB|Y.Normalized)]=`U8_RGB_SRGB`,e[e.U8_RGBA=I(q.U8,J.RGBA,Y.None)]=`U8_RGBA`,e[e.U8_RGBA_NORM=I(q.U8,J.RGBA,Y.Normalized)]=`U8_RGBA_NORM`,e[e.U8_RGBA_SRGB=I(q.U8,J.RGBA,Y.sRGB|Y.Normalized)]=`U8_RGBA_SRGB`,e[e.U16_R=I(q.U16,J.R,Y.None)]=`U16_R`,e[e.U16_R_NORM=I(q.U16,J.R,Y.Normalized)]=`U16_R_NORM`,e[e.U16_RG_NORM=I(q.U16,J.RG,Y.Normalized)]=`U16_RG_NORM`,e[e.U16_RGBA_NORM=I(q.U16,J.RGBA,Y.Normalized)]=`U16_RGBA_NORM`,e[e.U16_RGBA=I(q.U16,J.RGBA,Y.None)]=`U16_RGBA`,e[e.U16_RGB=I(q.U16,J.RGB,Y.None)]=`U16_RGB`,e[e.U16_RG=I(q.U16,J.RG,Y.None)]=`U16_RG`,e[e.U32_R=I(q.U32,J.R,Y.None)]=`U32_R`,e[e.U32_RG=I(q.U32,J.RG,Y.None)]=`U32_RG`,e[e.U32_RGB=I(q.U32,J.RGB,Y.None)]=`U32_RGB`,e[e.U32_RGBA=I(q.U32,J.RGBA,Y.None)]=`U32_RGBA`,e[e.S8_R=I(q.S8,J.R,Y.None)]=`S8_R`,e[e.S8_R_NORM=I(q.S8,J.R,Y.Normalized)]=`S8_R_NORM`,e[e.S8_RG_NORM=I(q.S8,J.RG,Y.Normalized)]=`S8_RG_NORM`,e[e.S8_RGB_NORM=I(q.S8,J.RGB,Y.Normalized)]=`S8_RGB_NORM`,e[e.S8_RGBA_NORM=I(q.S8,J.RGBA,Y.Normalized)]=`S8_RGBA_NORM`,e[e.S16_R=I(q.S16,J.R,Y.None)]=`S16_R`,e[e.S16_RG=I(q.S16,J.RG,Y.None)]=`S16_RG`,e[e.S16_RG_NORM=I(q.S16,J.RG,Y.Normalized)]=`S16_RG_NORM`,e[e.S16_RGB_NORM=I(q.S16,J.RGB,Y.Normalized)]=`S16_RGB_NORM`,e[e.S16_RGBA=I(q.S16,J.RGBA,Y.None)]=`S16_RGBA`,e[e.S16_RGBA_NORM=I(q.S16,J.RGBA,Y.Normalized)]=`S16_RGBA_NORM`,e[e.S32_R=I(q.S32,J.R,Y.None)]=`S32_R`,e[e.S32_RG=I(q.S32,J.RG,Y.None)]=`S32_RG`,e[e.S32_RGB=I(q.S32,J.RGB,Y.None)]=`S32_RGB`,e[e.S32_RGBA=I(q.S32,J.RGBA,Y.None)]=`S32_RGBA`,e[e.U16_RGBA_5551=I(q.U16_PACKED_5551,J.RGBA,Y.Normalized)]=`U16_RGBA_5551`,e[e.U16_RGB_565=I(q.U16_PACKED_565,J.RGB,Y.Normalized)]=`U16_RGB_565`,e[e.BC1=I(q.BC1,J.RGBA,Y.Normalized)]=`BC1`,e[e.BC1_SRGB=I(q.BC1,J.RGBA,Y.Normalized|Y.sRGB)]=`BC1_SRGB`,e[e.BC2=I(q.BC2,J.RGBA,Y.Normalized)]=`BC2`,e[e.BC2_SRGB=I(q.BC2,J.RGBA,Y.Normalized|Y.sRGB)]=`BC2_SRGB`,e[e.BC3=I(q.BC3,J.RGBA,Y.Normalized)]=`BC3`,e[e.BC3_SRGB=I(q.BC3,J.RGBA,Y.Normalized|Y.sRGB)]=`BC3_SRGB`,e[e.BC4_UNORM=I(q.BC4_UNORM,J.R,Y.Normalized)]=`BC4_UNORM`,e[e.BC4_SNORM=I(q.BC4_SNORM,J.R,Y.Normalized)]=`BC4_SNORM`,e[e.BC5_UNORM=I(q.BC5_UNORM,J.RG,Y.Normalized)]=`BC5_UNORM`,e[e.BC5_SNORM=I(q.BC5_SNORM,J.RG,Y.Normalized)]=`BC5_SNORM`,e[e.D24=I(q.D24,J.R,Y.Depth)]=`D24`,e[e.D24_S8=I(q.D24S8,J.RG,Y.Depth|Y.Stencil)]=`D24_S8`,e[e.D32F=I(q.D32F,J.R,Y.Depth)]=`D32F`,e[e.D32F_S8=I(q.D32FS8,J.RG,Y.Depth|Y.Stencil)]=`D32F_S8`,e[e.U8_RGB_RT=I(q.U8,J.RGB,Y.RenderTarget|Y.Normalized)]=`U8_RGB_RT`,e[e.U8_RGBA_RT=I(q.U8,J.RGBA,Y.RenderTarget|Y.Normalized)]=`U8_RGBA_RT`,e[e.U8_RGBA_RT_SRGB=I(q.U8,J.RGBA,Y.RenderTarget|Y.Normalized|Y.sRGB)]=`U8_RGBA_RT_SRGB`})(X||={}),ES=Xy(0,0,0,0),Xy(0,0,0,1),DS=Xy(1,1,1,0),Xy(1,1,1,1),OS={blendMode:fS.ADD,blendSrcFactor:U.ONE,blendDstFactor:U.ZERO},kS={attachmentsState:[{channelWriteMask:xS.ALL,rgbBlendState:OS,alphaBlendState:OS}],blendConstant:Yy(ES),depthWrite:!0,depthCompare:H.LEQUAL,stencilWrite:!1,stencilFront:{compare:H.ALWAYS,passOp:K.KEEP,depthFailOp:K.KEEP,failOp:K.KEEP},stencilBack:{compare:H.ALWAYS,passOp:K.KEEP,depthFailOp:K.KEEP,failOp:K.KEEP},cullMode:dS.NONE,frontFace:uS.CCW,polygonOffset:!1,polygonOffsetFactor:0,polygonOffsetUnits:0},ub({depthCompare:H.ALWAYS,depthWrite:!1},kS),AS={texture:null,sampler:null,formatKind:SS.Float,dimension:G.TEXTURE_2D},jS=/([^[]*)(\[[0-9]+\])?/,MS={},NS={},PS={},FS=[0],IS=(Z={},Z[B.FLOAT]=R.bind(null,`uniform1fv`,Bb,1,Lb),Z[B.FLOAT_VEC2]=R.bind(null,`uniform2fv`,Bb,2,Lb),Z[B.FLOAT_VEC3]=R.bind(null,`uniform3fv`,Bb,3,Lb),Z[B.FLOAT_VEC4]=R.bind(null,`uniform4fv`,Bb,4,Lb),Z[B.INT]=R.bind(null,`uniform1iv`,Vb,1,Lb),Z[B.INT_VEC2]=R.bind(null,`uniform2iv`,Vb,2,Lb),Z[B.INT_VEC3]=R.bind(null,`uniform3iv`,Vb,3,Lb),Z[B.INT_VEC4]=R.bind(null,`uniform4iv`,Vb,4,Lb),Z[B.BOOL]=R.bind(null,`uniform1iv`,Vb,1,Lb),Z[B.BOOL_VEC2]=R.bind(null,`uniform2iv`,Vb,2,Lb),Z[B.BOOL_VEC3]=R.bind(null,`uniform3iv`,Vb,3,Lb),Z[B.BOOL_VEC4]=R.bind(null,`uniform4iv`,Vb,4,Lb),Z[B.FLOAT_MAT2]=R.bind(null,`uniformMatrix2fv`,Bb,4,Rb),Z[B.FLOAT_MAT3]=R.bind(null,`uniformMatrix3fv`,Bb,9,Rb),Z[B.FLOAT_MAT4]=R.bind(null,`uniformMatrix4fv`,Bb,16,Rb),Z[B.UNSIGNED_INT]=R.bind(null,`uniform1uiv`,Hb,1,Lb),Z[B.UNSIGNED_INT_VEC2]=R.bind(null,`uniform2uiv`,Hb,2,Lb),Z[B.UNSIGNED_INT_VEC3]=R.bind(null,`uniform3uiv`,Hb,3,Lb),Z[B.UNSIGNED_INT_VEC4]=R.bind(null,`uniform4uiv`,Hb,4,Lb),Z[B.FLOAT_MAT2x3]=R.bind(null,`uniformMatrix2x3fv`,Bb,6,Rb),Z[B.FLOAT_MAT2x4]=R.bind(null,`uniformMatrix2x4fv`,Bb,8,Rb),Z[B.FLOAT_MAT3x2]=R.bind(null,`uniformMatrix3x2fv`,Bb,6,Rb),Z[B.FLOAT_MAT3x4]=R.bind(null,`uniformMatrix3x4fv`,Bb,12,Rb),Z[B.FLOAT_MAT4x2]=R.bind(null,`uniformMatrix4x2fv`,Bb,8,Rb),Z[B.FLOAT_MAT4x3]=R.bind(null,`uniformMatrix4x3fv`,Bb,12,Rb),Z[B.SAMPLER_2D]=Ib,Z[B.SAMPLER_CUBE]=Ib,Z[B.SAMPLER_3D]=Ib,Z[B.SAMPLER_2D_SHADOW]=Ib,Z[B.SAMPLER_2D_ARRAY]=Ib,Z[B.SAMPLER_2D_ARRAY_SHADOW]=Ib,Z[B.SAMPLER_CUBE_SHADOW]=Ib,Z[B.INT_SAMPLER_2D]=Ib,Z[B.INT_SAMPLER_3D]=Ib,Z[B.INT_SAMPLER_CUBE]=Ib,Z[B.INT_SAMPLER_2D_ARRAY]=Ib,Z[B.UNSIGNED_INT_SAMPLER_2D]=Ib,Z[B.UNSIGNED_INT_SAMPLER_3D]=Ib,Z[B.UNSIGNED_INT_SAMPLER_CUBE]=Ib,Z[B.UNSIGNED_INT_SAMPLER_2D_ARRAY]=Ib,Z),LS={"[object Int8Array]":5120,"[object Int16Array]":5122,"[object Int32Array]":5124,"[object Uint8Array]":5121,"[object Uint8ClampedArray]":5121,"[object Uint16Array]":5123,"[object Uint32Array]":5125,"[object Float32Array]":5126,"[object Float64Array]":5121,"[object ArrayBuffer]":5121},RS=function(e){M(t,e);function t(t){var n=t.id,r=t.device,i=e.call(this)||this;return i.id=n,i.device=r,i.device.resourceCreationTracker!==null&&i.device.resourceCreationTracker.trackResourceCreated(i),i}return t.prototype.destroy=function(){this.device.resourceCreationTracker!==null&&this.device.resourceCreationTracker.trackResourceDestroyed(this)},t}(Iy),zS=function(e){M(t,e);function t(t){var n=t.id,r=t.device,i=t.descriptor,a=e.call(this,{id:n,device:r})||this;a.type=V.Bindings;var o=i.uniformBufferBindings,s=i.samplerBindings;return a.uniformBufferBindings=o||[],a.samplerBindings=s||[],a.bindingLayouts=a.createBindingLayouts(),a}return t.prototype.createBindingLayouts=function(){var e=0,t=0,n=[],r=this.uniformBufferBindings.length,i=this.samplerBindings.length;return n.push({firstUniformBuffer:e,numUniformBuffers:r,firstSampler:t,numSamplers:i}),e+=r,t+=i,{numUniformBuffers:e,numSamplers:t,bindingLayoutTables:n}},t}(RS),VS=function(e){M(t,e);function t(t){var n=t.id,r=t.device,i=t.descriptor,a=e.call(this,{id:n,device:r})||this;a.type=V.Buffer;var o=i.viewOrSize,s=i.usage,c=i.hint,l=c===void 0?_S.STATIC:c,u=r.uniformBufferMaxPageByteSize,d=r.gl,f=s&W.UNIFORM;f||(z(d)?d.bindVertexArray(null):r.OES_vertex_array_object.bindVertexArrayOES(null));var p=py(o)?eb(o,4):eb(o.byteLength,4);a.gl_buffer_pages=[];var m;if(f){for(var h=p;h>0;)a.gl_buffer_pages.push(a.createBufferPage(Math.min(h,u),s,l)),h-=u;m=u}else a.gl_buffer_pages.push(a.createBufferPage(p,s,l)),m=p;return a.pageByteSize=m,a.byteSize=p,a.usage=s,a.gl_target=ex(s),py(o)||a.setSubData(0,new Uint8Array(o.buffer)),f||(z(d)?d.bindVertexArray(a.device.currentBoundVAO):r.OES_vertex_array_object.bindVertexArrayOES(a.device.currentBoundVAO)),a}return t.prototype.setSubData=function(e,t,n,r){n===void 0&&(n=0),r===void 0&&(r=t.byteLength-n);for(var i=this.device.gl,a=this.pageByteSize,o=e+r,s=e,c=e%a;s<o;){var l=z(i)?i.COPY_WRITE_BUFFER:this.gl_target,u=cx(this,s);if(u.ubo)return;i.bindBuffer(l,u),z(i)?i.bufferSubData(l,c,t,n,Math.min(o-s,a)):i.bufferSubData(l,c,t),s+=a,c=0,n+=a,this.device.debugGroupStatisticsBufferUpload()}},t.prototype.destroy=function(){e.prototype.destroy.call(this);for(var t=0;t<this.gl_buffer_pages.length;t++)this.gl_buffer_pages[t].ubo||this.device.gl.deleteBuffer(this.gl_buffer_pages[t]);this.gl_buffer_pages=[]},t.prototype.createBufferPage=function(e,t,n){var r=this.device.gl,i=t&W.UNIFORM;if(!z(r)&&i)return{ubo:!0};var a=this.device.ensureResourceExists(r.createBuffer()),o=ex(t),s=$b(n);return r.bindBuffer(o,a),r.bufferData(o,e,s),a},t}(RS),HS=function(e){M(t,e);function t(t){var n,r,i,a,o=t.id,s=t.device,c=t.descriptor,l=e.call(this,{id:o,device:s})||this;l.type=V.InputLayout;var u=c.vertexBufferDescriptors,d=c.indexBufferFormat,f=c.program;L(d===X.U16_R||d===X.U32_R||d===null);var p=d===null?null:ax(d),m=d===null?null:Uy(d),h=l.device.gl,g=l.device.ensureResourceExists(z(h)?h.createVertexArray():s.OES_vertex_array_object.createVertexArrayOES());z(h)?h.bindVertexArray(g):s.OES_vertex_array_object.bindVertexArrayOES(g),h.bindBuffer(h.ARRAY_BUFFER,cx(l.device.fallbackVertexBuffer));try{for(var _=lr(c.vertexBufferDescriptors),v=_.next();!v.done;v=_.next()){var y=v.value,b=y.stepMode,x=y.attributes;try{for(var S=(i=void 0,lr(x)),C=S.next();!C.done;C=S.next()){var w=C.value,ee=w.shaderLocation,te=w.format,ne=w.divisor,re=ne===void 0?1:ne,ie=z(h)?ee:f.attributes[ee]?.location,ae=ix(te);if(w.vertexFormat=ae,!ey(ie)){Qb(te);var oe=ae.size,T=ae.type,se=ae.normalized;h.vertexAttribPointer(ie,oe,T,se,0,0),b===vS.INSTANCE&&(z(h)?h.vertexAttribDivisor(ie,re):s.ANGLE_instanced_arrays.vertexAttribDivisorANGLE(ie,re)),h.enableVertexAttribArray(ie)}}}catch(e){i={error:e}}finally{try{C&&!C.done&&(a=S.return)&&a.call(S)}finally{if(i)throw i.error}}}}catch(e){n={error:e}}finally{try{v&&!v.done&&(r=_.return)&&r.call(_)}finally{if(n)throw n.error}}return z(h)?h.bindVertexArray(null):s.OES_vertex_array_object.bindVertexArrayOES(null),l.vertexBufferDescriptors=u,l.vao=g,l.indexBufferFormat=d,l.indexBufferType=p,l.indexBufferCompByteSize=m,l.program=f,l}return t.prototype.destroy=function(){e.prototype.destroy.call(this),this.device.currentBoundVAO===this.vao&&(z(this.device.gl)?(this.device.gl.bindVertexArray(null),this.device.gl.deleteVertexArray(this.vao)):(this.device.OES_vertex_array_object.bindVertexArrayOES(null),this.device.OES_vertex_array_object.deleteVertexArrayOES(this.vao)),this.device.currentBoundVAO=null)},t}(RS),US=function(e){M(t,e);function t(t){var n=t.id,r=t.device,i=t.descriptor,a=t.fake,o=e.call(this,{id:n,device:r})||this;o.type=V.Texture,i=pr({dimension:G.TEXTURE_2D,depthOrArrayLayers:1,mipLevelCount:1},i);var s=o.device.gl,c,l,u=o.clampmipLevelCount(i);if(o.immutable=i.usage===bS.RENDER_TARGET,o.pixelStore=i.pixelStore,o.format=i.format,o.dimension=i.dimension,o.formatKind=Gy(i.format),o.width=i.width,o.height=i.height,o.depthOrArrayLayers=i.depthOrArrayLayers,o.mipmaps=u>=1,!a){l=o.device.ensureResourceExists(s.createTexture());var d=o.device.translateTextureType(i.format),f=o.device.translateTextureInternalFormat(i.format);if(o.device.setActiveTexture(s.TEXTURE0),o.device.currentTextures[0]=null,o.preprocessImage(),i.dimension===G.TEXTURE_2D){if(c=B.TEXTURE_2D,s.bindTexture(c,l),o.immutable){if(z(s))s.texStorage2D(c,u,f,i.width,i.height);else{var p=(f===B.DEPTH_COMPONENT||o.isNPOT(),0);(o.format===X.D32F||o.format===X.D24_S8)&&!z(s)&&!r.WEBGL_depth_texture||(s.texImage2D(c,p,f,i.width,i.height,0,f,d,null),o.mipmaps&&(o.mipmaps=!1,s.texParameteri(B.TEXTURE_2D,B.TEXTURE_MIN_FILTER,B.LINEAR),s.texParameteri(B.TEXTURE_2D,B.TEXTURE_WRAP_S,B.CLAMP_TO_EDGE),s.texParameteri(B.TEXTURE_2D,B.TEXTURE_WRAP_T,B.CLAMP_TO_EDGE)))}}L(i.depthOrArrayLayers===1)}else if(i.dimension===G.TEXTURE_2D_ARRAY)c=B.TEXTURE_2D_ARRAY,s.bindTexture(c,l),o.immutable&&z(s)&&s.texStorage3D(c,u,f,i.width,i.height,i.depthOrArrayLayers);else if(i.dimension===G.TEXTURE_3D)c=B.TEXTURE_3D,s.bindTexture(c,l),o.immutable&&z(s)&&s.texStorage3D(c,u,f,i.width,i.height,i.depthOrArrayLayers);else if(i.dimension===G.TEXTURE_CUBE_MAP)c=B.TEXTURE_CUBE_MAP,s.bindTexture(c,l),o.immutable&&z(s)&&s.texStorage2D(c,u,f,i.width,i.height),L(i.depthOrArrayLayers===6);else throw Error(`whoops`)}return o.gl_texture=l,o.gl_target=c,o.mipLevelCount=u,o}return t.prototype.setImageData=function(e,t){t===void 0&&(t=0);var n=this.device.gl;Zb(this.format);var r=this.gl_target===B.TEXTURE_3D||this.gl_target===B.TEXTURE_2D_ARRAY,i=this.gl_target===B.TEXTURE_CUBE_MAP,a=Wb(e[0]);this.device.setActiveTexture(n.TEXTURE0),this.device.currentTextures[0]=null;var o=e[0],s,c;a?(s=this.width,c=this.height):(s=o.width,c=o.height,this.width=s,this.height=c),n.bindTexture(this.gl_target,this.gl_texture);var l=this.device.translateTextureFormat(this.format),u=z(n)?this.device.translateInternalTextureFormat(this.format):l,d=this.device.translateTextureType(this.format);this.preprocessImage();for(var f=0;f<this.depthOrArrayLayers;f++){var p=e[f],m=this.gl_target;i&&(m=B.TEXTURE_CUBE_MAP_POSITIVE_X+f%6),this.immutable?n.texSubImage2D(m,t,0,0,s,c,l,d,p):z(n)?r?n.texImage3D(m,t,u,s,c,this.depthOrArrayLayers,0,l,d,p):n.texImage2D(m,t,u,s,c,0,l,d,p):a?n.texImage2D(m,t,l,s,c,0,l,d,p):n.texImage2D(m,t,l,l,d,p)}this.mipmaps&&this.generateMipmap(r)},t.prototype.destroy=function(){e.prototype.destroy.call(this),this.device.gl.deleteTexture(lx(this))},t.prototype.clampmipLevelCount=function(e){if(e.dimension===G.TEXTURE_2D_ARRAY&&e.depthOrArrayLayers>1&&By(e.format)===q.BC1)for(var t=e.width,n=e.height,r=0;r<e.mipLevelCount;r++){if(t<=2||n<=2)return r-1;t=Math.max(t/2|0,1),n=Math.max(n/2|0,1)}return e.mipLevelCount},t.prototype.preprocessImage=function(){var e=this.device.gl;this.pixelStore&&(this.pixelStore.unpackFlipY&&e.pixelStorei(B.UNPACK_FLIP_Y_WEBGL,!0),this.pixelStore.packAlignment&&e.pixelStorei(B.PACK_ALIGNMENT,this.pixelStore.packAlignment),this.pixelStore.unpackAlignment&&e.pixelStorei(B.UNPACK_ALIGNMENT,this.pixelStore.unpackAlignment))},t.prototype.generateMipmap=function(e){e===void 0&&(e=!1);var t=this.device.gl;return!z(t)&&this.isNPOT()||this.gl_texture&&this.gl_target&&(t.bindTexture(this.gl_target,this.gl_texture),e?(t.texParameteri(this.gl_target,B.TEXTURE_BASE_LEVEL,0),t.texParameteri(this.gl_target,B.TEXTURE_MAX_LEVEL,Math.log2(this.width)),t.texParameteri(this.gl_target,B.TEXTURE_MIN_FILTER,B.LINEAR_MIPMAP_LINEAR),t.texParameteri(this.gl_target,B.TEXTURE_MAG_FILTER,B.LINEAR)):t.texParameteri(B.TEXTURE_2D,B.TEXTURE_MIN_FILTER,B.NEAREST_MIPMAP_LINEAR),t.generateMipmap(this.gl_target),t.bindTexture(this.gl_target,null)),this},t.prototype.isNPOT=function(){var e=this.device.gl;return z(e)?!1:!Zy(this.width)||!Zy(this.height)},t}(RS),WS=function(e){M(t,e);function t(t){var n=t.id,r=t.device,i=t.descriptor,a=e.call(this,{id:n,device:r})||this;a.type=V.RenderTarget,a.gl_renderbuffer=null,a.texture=null;var o=a.device.gl,s=i.format,c=i.width,l=i.height,u=i.sampleCount,d=u===void 0?1:u,f=i.texture,p=!1;if(s!==X.D32F&&s!==X.D24_S8||!f||z(o)||r.WEBGL_depth_texture||(f.destroy(),a.texture=null,p=!0),!p&&f)a.texture=f;else{a.gl_renderbuffer=a.device.ensureResourceExists(o.createRenderbuffer()),o.bindRenderbuffer(o.RENDERBUFFER,a.gl_renderbuffer);var m=a.device.translateTextureInternalFormat(s,!0);z(o)&&d>1?o.renderbufferStorageMultisample(B.RENDERBUFFER,d,m,c,l):o.renderbufferStorage(B.RENDERBUFFER,m,c,l)}return a.format=s,a.width=c,a.height=l,a.sampleCount=d,a}return t.prototype.destroy=function(){e.prototype.destroy.call(this),this.gl_renderbuffer!==null&&this.device.gl.deleteRenderbuffer(this.gl_renderbuffer),this.texture&&this.texture.destroy()},t}(RS),(function(e){e[e.NeedsCompile=0]=`NeedsCompile`,e[e.Compiling=1]=`Compiling`,e[e.NeedsBind=2]=`NeedsBind`,e[e.ReadyToUse=3]=`ReadyToUse`})(GS||={}),KS=function(e){M(t,e);function t(t,n){var r=t.id,i=t.device,a=t.descriptor,o=e.call(this,{id:r,device:i})||this;o.rawVertexGLSL=n,o.type=V.Program,o.uniformSetters={},o.attributes=[];var s=o.device.gl;return o.descriptor=a,o.gl_program=o.device.ensureResourceExists(s.createProgram()),o.gl_shader_vert=null,o.gl_shader_frag=null,o.compileState=GS.NeedsCompile,o.tryCompileProgram(),o}return t.prototype.destroy=function(){e.prototype.destroy.call(this),this.device.gl.deleteProgram(this.gl_program),this.device.gl.deleteShader(this.gl_shader_vert),this.device.gl.deleteShader(this.gl_shader_frag)},t.prototype.tryCompileProgram=function(){L(this.compileState===GS.NeedsCompile);var e=this.descriptor,t=e.vertex,n=e.fragment,r=this.device.gl;t?.glsl&&n?.glsl&&(this.gl_shader_vert=this.compileShader(t.postprocess?t.postprocess(t.glsl):t.glsl,r.VERTEX_SHADER),this.gl_shader_frag=this.compileShader(n.postprocess?n.postprocess(n.glsl):n.glsl,r.FRAGMENT_SHADER),r.attachShader(this.gl_program,this.gl_shader_vert),r.attachShader(this.gl_program,this.gl_shader_frag),r.linkProgram(this.gl_program),this.compileState=GS.Compiling,z(r)||(this.readUniformLocationsFromLinkedProgram(),this.readAttributesFromLinkedProgram()))},t.prototype.readAttributesFromLinkedProgram=function(){for(var e=this.device.gl,t=e.getProgramParameter(this.gl_program,e.ACTIVE_ATTRIBUTES),n=Kb(this.descriptor.vertex.glsl),r=qb(this.rawVertexGLSL,n),i=function(t){var n=e.getActiveAttrib(a.gl_program,t),i=n.name,o=n.type,s=n.size,c=e.getAttribLocation(a.gl_program,i),l=r.find(function(e){return e.name===i})?.location;c>=0&&!ey(l)&&(a.attributes[l]={name:i,location:c,type:o,size:s})},a=this,o=0;o<t;o++)i(o)},t.prototype.readUniformLocationsFromLinkedProgram=function(){for(var e=this.device.gl,t=e.getProgramParameter(this.gl_program,e.ACTIVE_UNIFORMS),n=0;n<t;n++){var r=e.getActiveUniform(this.gl_program,n),i=Fb(r.name).name,a=e.getUniformLocation(this.gl_program,i);if(this.uniformSetters[i]=Ub(e,a,r),r&&r.size>1)for(var o=0;o<r.size;o++)a=e.getUniformLocation(this.gl_program,`${i}[${o}]`),this.uniformSetters[`${i}[${o}]`]=Ub(e,a,r)}},t.prototype.compileShader=function(e,t){var n=this.device.gl,r=this.device.ensureResourceExists(n.createShader(t));return n.shaderSource(r,e),n.compileShader(r),r},t.prototype.setUniformsLegacy=function(e){e===void 0&&(e={});var t=this.device.gl;if(!z(t)){var n=!1;for(var r in e){n||=(t.useProgram(this.gl_program),!0);var i=e[r],a=this.uniformSetters[r];if(a){var o=i;o instanceof US&&(o=o.textureIndex),a(o)}}}return this},t}(RS),qS=function(e){M(t,e);function t(t){var n=t.id,r=t.device,i=t.descriptor,a=e.call(this,{id:n,device:r})||this;a.type=V.QueryPool;var o=a.device.gl;if(z(o)){var s=i.elemCount,c=i.type;a.gl_query=tb(s,function(){return a.device.ensureResourceExists(o.createQuery())}),a.gl_query_type=mx(c)}return a}return t.prototype.queryResultOcclusion=function(e){var t=this.device.gl;if(z(t)){var n=this.gl_query[e];return t.getQueryParameter(n,t.QUERY_RESULT_AVAILABLE)?!!t.getQueryParameter(n,t.QUERY_RESULT):null}return null},t.prototype.destroy=function(){e.prototype.destroy.call(this);var t=this.device.gl;if(z(t))for(var n=0;n<this.gl_query.length;n++)t.deleteQuery(this.gl_query[n])},t}(RS),JS=function(e){M(t,e);function t(t){var n=t.id,r=t.device,i=e.call(this,{id:n,device:r})||this;return i.type=V.Readback,i.gl_pbo=null,i.gl_sync=null,i}return t.prototype.clientWaitAsync=function(e,t,n){t===void 0&&(t=0),n===void 0&&(n=10);var r=this.device.gl;return new Promise(function(i,a){function o(){var s=r.clientWaitSync(e,t,0);s==r.WAIT_FAILED?a():s==r.TIMEOUT_EXPIRED?setTimeout(o,dy(n,0,r.MAX_CLIENT_WAIT_TIMEOUT_WEBGL)):i()}o()})},t.prototype.getBufferSubDataAsync=function(e,t,n,r,i,a){return ur(this,void 0,void 0,function(){var o;return cr(this,function(s){switch(s.label){case 0:return o=this.device.gl,z(o)?(this.gl_sync=o.fenceSync(o.SYNC_GPU_COMMANDS_COMPLETE,0),o.flush(),[4,this.clientWaitAsync(this.gl_sync,0,10)]):[3,2];case 1:return s.sent(),o.bindBuffer(e,t),o.getBufferSubData(e,n,r,i,a),o.bindBuffer(e,null),[2,r];case 2:return[2]}})})},t.prototype.readTexture=function(e,t,n,r,i,a,o,s){return o===void 0&&(o=0),s===void 0&&(s=a.byteLength||0),ur(this,void 0,void 0,function(){var c,l,u,d,f;return cr(this,function(p){return c=this.device.gl,l=e,u=this.device.translateTextureFormat(l.format),d=this.device.translateTextureType(l.format),f=Wy(l.format),z(c)?(this.gl_pbo=this.device.ensureResourceExists(c.createBuffer()),c.bindBuffer(c.PIXEL_PACK_BUFFER,this.gl_pbo),c.bufferData(c.PIXEL_PACK_BUFFER,s,c.STREAM_READ),c.bindBuffer(c.PIXEL_PACK_BUFFER,null),c.bindFramebuffer(B.READ_FRAMEBUFFER,this.device.readbackFramebuffer),c.framebufferTexture2D(B.READ_FRAMEBUFFER,B.COLOR_ATTACHMENT0,B.TEXTURE_2D,l.gl_texture,0),c.bindBuffer(c.PIXEL_PACK_BUFFER,this.gl_pbo),c.readPixels(t,n,r,i,u,d,o*f),c.bindBuffer(c.PIXEL_PACK_BUFFER,null),[2,this.getBufferSubDataAsync(c.PIXEL_PACK_BUFFER,this.gl_pbo,0,a,o,0)]):[2,this.readTextureSync(e,t,n,r,i,a,o,s)]})})},t.prototype.readTextureSync=function(e,t,n,r,i,a,o,s){s===void 0&&(s=a.byteLength||0);var c=this.device.gl,l=e,u=this.device.translateTextureType(l.format);return c.bindFramebuffer(B.FRAMEBUFFER,this.device.readbackFramebuffer),c.framebufferTexture2D(B.FRAMEBUFFER,B.COLOR_ATTACHMENT0,B.TEXTURE_2D,l.gl_texture,0),c.pixelStorei(c.PACK_ALIGNMENT,4),c.readPixels(t,n,r,i,c.RGBA,u,a),a},t.prototype.readBuffer=function(e,t,n,r,i){return ur(this,void 0,void 0,function(){var a;return cr(this,function(o){return a=this.device.gl,z(a)?[2,this.getBufferSubDataAsync(a.ARRAY_BUFFER,cx(e,t),t,n,r,i)]:[2,Promise.reject()]})})},t.prototype.destroy=function(){e.prototype.destroy.call(this),z(this.device.gl)&&(this.gl_sync!==null&&this.device.gl.deleteSync(this.gl_sync),this.gl_pbo!==null&&this.device.gl.deleteBuffer(this.gl_pbo))},t}(RS),YS=function(e){M(t,e);function t(t){var n=t.id,r=t.device,i=t.descriptor,a=e.call(this,{id:n,device:r})||this;return a.type=V.RenderPipeline,a.drawMode=tx(i.topology??gS.TRIANGLES),a.program=i.program,a.inputLayout=i.inputLayout,a.megaState=pr(pr({},lb(kS)),i.megaStateDescriptor),a.colorAttachmentFormats=i.colorAttachmentFormats.slice(),a.depthStencilAttachmentFormat=i.depthStencilAttachmentFormat,a.sampleCount=i.sampleCount??1,a}return t}(RS),XS=function(e){M(t,e);function t(t){var n=t.id,r=t.device,i=t.descriptor,a=e.call(this,{id:n,device:r})||this;return a.type=V.ComputePipeline,a.descriptor=i,a}return t}(RS),ZS=function(){function e(){this.liveObjects=new Set,this.creationStacks=new Map,this.deletionStacks=new Map}return e.prototype.trackResourceCreated=function(e){this.creationStacks.set(e,Error().stack),this.liveObjects.add(e)},e.prototype.trackResourceDestroyed=function(e){this.deletionStacks.has(e)&&console.warn(`Object double freed:`,e,`

Creation stack: `,this.creationStacks.get(e),`

Deletion stack: `,this.deletionStacks.get(e),`

This stack: `,Error().stack),this.deletionStacks.set(e,Error().stack),this.liveObjects.delete(e)},e.prototype.checkForLeaks=function(){var e,t;try{for(var n=lr(this.liveObjects.values()),r=n.next();!r.done;r=n.next()){var i=r.value;console.warn(`Object leaked:`,i,`Creation stack:`,this.creationStacks.get(i))}}catch(t){e={error:t}}finally{try{r&&!r.done&&(t=n.return)&&t.call(n)}finally{if(e)throw e.error}}},e.prototype.setResourceLeakCheck=function(e,t){t?this.liveObjects.add(e):this.liveObjects.delete(e)},e}(),QS=function(e){M(t,e);function t(t){var n=t.id,r=t.device,i=t.descriptor,a=e.call(this,{id:n,device:r})||this;a.type=V.Sampler;var o=a.device.gl;if(z(o)){var s=a.device.ensureResourceExists(o.createSampler());o.samplerParameteri(s,B.TEXTURE_WRAP_S,ox(i.addressModeU)),o.samplerParameteri(s,B.TEXTURE_WRAP_T,ox(i.addressModeV)),o.samplerParameteri(s,B.TEXTURE_WRAP_R,ox(i.addressModeW??i.addressModeU)),o.samplerParameteri(s,B.TEXTURE_MIN_FILTER,sx(i.minFilter,i.mipmapFilter)),o.samplerParameteri(s,B.TEXTURE_MAG_FILTER,sx(i.magFilter,hS.NO_MIP)),i.lodMinClamp!==void 0&&o.samplerParameterf(s,B.TEXTURE_MIN_LOD,i.lodMinClamp),i.lodMaxClamp!==void 0&&o.samplerParameterf(s,B.TEXTURE_MAX_LOD,i.lodMaxClamp),i.compareFunction!==void 0&&(o.samplerParameteri(s,o.TEXTURE_COMPARE_MODE,o.COMPARE_REF_TO_TEXTURE),o.samplerParameteri(s,o.TEXTURE_COMPARE_FUNC,i.compareFunction));var c=i.maxAnisotropy??1;c>1&&a.device.EXT_texture_filter_anisotropic!==null&&(L(i.minFilter===mS.BILINEAR&&i.magFilter===mS.BILINEAR&&i.mipmapFilter===hS.LINEAR),o.samplerParameterf(s,a.device.EXT_texture_filter_anisotropic.TEXTURE_MAX_ANISOTROPY_EXT,c)),a.gl_sampler=s}else a.descriptor=i;return a}return t.prototype.setTextureParameters=function(e,t,n){var r=this.device.gl,i=this.descriptor;this.isNPOT(t,n)?r.texParameteri(B.TEXTURE_2D,B.TEXTURE_MIN_FILTER,B.LINEAR):r.texParameteri(e,B.TEXTURE_MIN_FILTER,sx(i.minFilter,i.mipmapFilter)),r.texParameteri(B.TEXTURE_2D,B.TEXTURE_WRAP_S,ox(i.addressModeU)),r.texParameteri(B.TEXTURE_2D,B.TEXTURE_WRAP_T,ox(i.addressModeV)),r.texParameteri(e,B.TEXTURE_MAG_FILTER,sx(i.magFilter,hS.NO_MIP));var a=i.maxAnisotropy??1;a>1&&this.device.EXT_texture_filter_anisotropic!==null&&(L(i.minFilter===mS.BILINEAR&&i.magFilter===mS.BILINEAR&&i.mipmapFilter===hS.LINEAR),r.texParameteri(e,this.device.EXT_texture_filter_anisotropic.TEXTURE_MAX_ANISOTROPY_EXT,a))},t.prototype.destroy=function(){e.prototype.destroy.call(this),z(this.device.gl)&&this.device.gl.deleteSampler(ux(this))},t.prototype.isNPOT=function(e,t){return!Zy(e)||!Zy(t)},t}(RS),$S=function(){function e(){}return e.prototype.dispatchWorkgroups=function(e,t,n){},e.prototype.dispatchWorkgroupsIndirect=function(e,t){},e.prototype.setPipeline=function(e){},e.prototype.setBindings=function(e){},e.prototype.pushDebugGroup=function(e){},e.prototype.popDebugGroup=function(){},e.prototype.insertDebugMarker=function(e){},e}(),eC=function(e){M(t,e);function t(){var t=e!==null&&e.apply(this,arguments)||this;return t.type=V.RenderBundle,t.commands=[],t}return t.prototype.push=function(e){this.commands.push(e)},t.prototype.replay=function(){this.commands.forEach(function(e){return e()})},t}(RS),tC=65536,nC=/uniform(?:\s+)(\w+)(?:\s?){([^]*?)}/g,rC=function(){function e(e,t){t===void 0&&(t={}),this.shaderDebug=!1,this.OES_vertex_array_object=null,this.ANGLE_instanced_arrays=null,this.OES_texture_float=null,this.OES_draw_buffers_indexed=null,this.WEBGL_draw_buffers=null,this.WEBGL_depth_texture=null,this.WEBGL_color_buffer_float=null,this.EXT_color_buffer_half_float=null,this.WEBGL_compressed_texture_s3tc=null,this.WEBGL_compressed_texture_s3tc_srgb=null,this.EXT_texture_compression_rgtc=null,this.EXT_texture_filter_anisotropic=null,this.KHR_parallel_shader_compile=null,this.EXT_texture_norm16=null,this.EXT_color_buffer_float=null,this.OES_texture_float_linear=null,this.OES_texture_half_float_linear=null,this.scTexture=null,this.scPlatformFramebuffer=null,this.currentActiveTexture=null,this.currentBoundVAO=null,this.currentProgram=null,this.resourceCreationTracker=null,this.resourceUniqueId=0,this.currentColorAttachments=[],this.currentColorAttachmentLevels=[],this.currentColorResolveTos=[],this.currentColorResolveToLevels=[],this.currentSampleCount=-1,this.currentIndexBufferByteOffset=null,this.currentMegaState=lb(kS),this.currentSamplers=[],this.currentTextures=[],this.currentUniformBuffers=[],this.currentUniformBufferByteOffsets=[],this.currentUniformBufferByteSizes=[],this.currentScissorEnabled=!1,this.currentStencilRef=null,this.currentRenderPassDescriptor=null,this.currentRenderPassDescriptorStack=[],this.debugGroupStack=[],this.resolveColorAttachmentsChanged=!1,this.resolveDepthStencilAttachmentsChanged=!1,this.explicitBindingLocations=!1,this.separateSamplerTextures=!1,this.viewportOrigin=CS.LOWER_LEFT,this.clipSpaceNearZ=wS.NEGATIVE_ONE,this.supportMRT=!1,this.inBlitRenderPass=!1,this.supportedSampleCounts=[],this.occlusionQueriesRecommended=!1,this.computeShadersSupported=!1,this.gl=e,this.contextAttributes=Ky(e.getContextAttributes()),z(e)?(this.EXT_texture_norm16=e.getExtension(`EXT_texture_norm16`),this.EXT_color_buffer_float=e.getExtension(`EXT_color_buffer_float`)):(this.OES_vertex_array_object=e.getExtension(`OES_vertex_array_object`),this.ANGLE_instanced_arrays=e.getExtension(`ANGLE_instanced_arrays`),this.OES_texture_float=e.getExtension(`OES_texture_float`),this.WEBGL_draw_buffers=e.getExtension(`WEBGL_draw_buffers`),this.WEBGL_depth_texture=e.getExtension(`WEBGL_depth_texture`),this.WEBGL_color_buffer_float=e.getExtension(`WEBGL_color_buffer_float`),this.EXT_color_buffer_half_float=e.getExtension(`EXT_color_buffer_half_float`),e.getExtension(`EXT_frag_depth`),e.getExtension(`OES_element_index_uint`),e.getExtension(`OES_standard_derivatives`)),this.WEBGL_compressed_texture_s3tc=e.getExtension(`WEBGL_compressed_texture_s3tc`),this.WEBGL_compressed_texture_s3tc_srgb=e.getExtension(`WEBGL_compressed_texture_s3tc_srgb`),this.EXT_texture_compression_rgtc=e.getExtension(`EXT_texture_compression_rgtc`),this.EXT_texture_filter_anisotropic=e.getExtension(`EXT_texture_filter_anisotropic`),this.EXT_texture_norm16=e.getExtension(`EXT_texture_norm16`),this.OES_texture_float_linear=e.getExtension(`OES_texture_float_linear`),this.OES_texture_half_float_linear=e.getExtension(`OES_texture_half_float_linear`),this.KHR_parallel_shader_compile=e.getExtension(`KHR_parallel_shader_compile`),z(e)?(this.platformString=`WebGL2`,this.glslVersion=`#version 300 es`):(this.platformString=`WebGL1`,this.glslVersion=`#version 100`),this.scTexture=new US({id:this.getNextUniqueId(),device:this,descriptor:{width:0,height:0,depthOrArrayLayers:1,dimension:G.TEXTURE_2D,mipLevelCount:1,usage:bS.RENDER_TARGET,format:this.contextAttributes.alpha===!1?X.U8_RGB_RT:X.U8_RGBA_RT},fake:!0}),this.scTexture.formatKind=SS.Float,this.scTexture.gl_target=null,this.scTexture.gl_texture=null,this.resolveColorReadFramebuffer=this.ensureResourceExists(e.createFramebuffer()),this.resolveColorDrawFramebuffer=this.ensureResourceExists(e.createFramebuffer()),this.resolveDepthStencilReadFramebuffer=this.ensureResourceExists(e.createFramebuffer()),this.resolveDepthStencilDrawFramebuffer=this.ensureResourceExists(e.createFramebuffer()),this.renderPassDrawFramebuffer=this.ensureResourceExists(e.createFramebuffer()),this.readbackFramebuffer=this.ensureResourceExists(e.createFramebuffer()),this.fallbackTexture2D=this.createFallbackTexture(G.TEXTURE_2D,SS.Float),this.fallbackTexture2DDepth=this.createFallbackTexture(G.TEXTURE_2D,SS.Depth),this.fallbackVertexBuffer=this.createBuffer({viewOrSize:1,usage:W.VERTEX,hint:_S.STATIC}),z(e)&&(this.fallbackTexture2DArray=this.createFallbackTexture(G.TEXTURE_2D_ARRAY,SS.Float),this.fallbackTexture3D=this.createFallbackTexture(G.TEXTURE_3D,SS.Float),this.fallbackTextureCube=this.createFallbackTexture(G.TEXTURE_CUBE_MAP,SS.Float)),this.currentMegaState.depthCompare=H.LESS,this.currentMegaState.depthWrite=!1,this.currentMegaState.attachmentsState[0].channelWriteMask=xS.ALL,e.enable(e.DEPTH_TEST),e.enable(e.STENCIL_TEST),this.checkLimits(),t.shaderDebug&&(this.shaderDebug=!0),t.trackResources&&(this.resourceCreationTracker=new ZS)}return e.prototype.destroy=function(){this.blitBindings&&this.blitBindings.destroy(),this.blitInputLayout&&this.blitInputLayout.destroy(),this.blitRenderPipeline&&this.blitRenderPipeline.destroy(),this.blitVertexBuffer&&this.blitVertexBuffer.destroy(),this.blitProgram&&this.blitProgram.destroy()},e.prototype.createFallbackTexture=function(e,t){var n=e===G.TEXTURE_CUBE_MAP?6:1,r=t===SS.Depth?X.D32F:X.U8_RGBA_NORM,i=this.createTexture({dimension:e,format:r,usage:bS.SAMPLED,width:1,height:1,depthOrArrayLayers:n,mipLevelCount:1});return t===SS.Float&&i.setImageData([new Uint8Array(4*n)]),lx(i)},e.prototype.getNextUniqueId=function(){return++this.resourceUniqueId},e.prototype.checkLimits=function(){var e=this.gl;if(this.maxVertexAttribs=e.getParameter(B.MAX_VERTEX_ATTRIBS),z(e)){this.uniformBufferMaxPageByteSize=Math.min(e.getParameter(B.MAX_UNIFORM_BLOCK_SIZE),tC),this.uniformBufferWordAlignment=e.getParameter(e.UNIFORM_BUFFER_OFFSET_ALIGNMENT)/4;var t=e.getInternalformatParameter(e.RENDERBUFFER,e.DEPTH32F_STENCIL8,e.SAMPLES);this.supportedSampleCounts=t?fr([],sr(t),!1):[],this.occlusionQueriesRecommended=!0}else this.uniformBufferWordAlignment=64,this.uniformBufferMaxPageByteSize=tC;this.uniformBufferMaxPageWordSize=this.uniformBufferMaxPageByteSize/4,this.supportedSampleCounts.includes(1)||this.supportedSampleCounts.push(1),this.supportedSampleCounts.sort(function(e,t){return e-t})},e.prototype.configureSwapChain=function(e,t,n){var r=this.scTexture;r.width=e,r.height=t,this.scPlatformFramebuffer=$y(n)},e.prototype.getDevice=function(){return this},e.prototype.getCanvas=function(){return this.gl.canvas},e.prototype.getOnscreenTexture=function(){return this.scTexture},e.prototype.beginFrame=function(){},e.prototype.endFrame=function(){},e.prototype.translateTextureInternalFormat=function(e,t){switch(t===void 0&&(t=!1),e){case X.ALPHA:return B.ALPHA;case X.U8_LUMINANCE:case X.F16_LUMINANCE:case X.F32_LUMINANCE:return B.LUMINANCE;case X.F16_R:return B.R16F;case X.F16_RG:return B.RG16F;case X.F16_RGB:return B.RGB16F;case X.F16_RGBA:return B.RGBA16F;case X.F32_R:return B.R32F;case X.F32_RG:return B.RG32F;case X.F32_RGB:return B.RGB32F;case X.F32_RGBA:return z(this.gl)?B.RGBA32F:t?this.WEBGL_color_buffer_float.RGBA32F_EXT:B.RGBA;case X.U8_R_NORM:return B.R8;case X.U8_RG_NORM:return B.RG8;case X.U8_RGB_NORM:case X.U8_RGB_RT:return B.RGB8;case X.U8_RGB_SRGB:return B.SRGB8;case X.U8_RGBA_NORM:case X.U8_RGBA_RT:return z(this.gl)?B.RGBA8:t?B.RGBA4:B.RGBA;case X.U8_RGBA:return B.RGBA;case X.U8_RGBA_SRGB:case X.U8_RGBA_RT_SRGB:return B.SRGB8_ALPHA8;case X.U16_R:return B.R16UI;case X.U16_R_NORM:return this.EXT_texture_norm16.R16_EXT;case X.U16_RG_NORM:return this.EXT_texture_norm16.RG16_EXT;case X.U16_RGBA_NORM:return this.EXT_texture_norm16.RGBA16_EXT;case X.U16_RGBA_5551:return B.RGB5_A1;case X.U16_RGB_565:return B.RGB565;case X.U32_R:return B.R32UI;case X.S8_RGBA_NORM:return B.RGBA8_SNORM;case X.S8_RG_NORM:return B.RG8_SNORM;case X.BC1:return this.WEBGL_compressed_texture_s3tc.COMPRESSED_RGBA_S3TC_DXT1_EXT;case X.BC1_SRGB:return this.WEBGL_compressed_texture_s3tc_srgb.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;case X.BC2:return this.WEBGL_compressed_texture_s3tc.COMPRESSED_RGBA_S3TC_DXT3_EXT;case X.BC2_SRGB:return this.WEBGL_compressed_texture_s3tc_srgb.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;case X.BC3:return this.WEBGL_compressed_texture_s3tc.COMPRESSED_RGBA_S3TC_DXT5_EXT;case X.BC3_SRGB:return this.WEBGL_compressed_texture_s3tc_srgb.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT;case X.BC4_UNORM:return this.EXT_texture_compression_rgtc.COMPRESSED_RED_RGTC1_EXT;case X.BC4_SNORM:return this.EXT_texture_compression_rgtc.COMPRESSED_SIGNED_RED_RGTC1_EXT;case X.BC5_UNORM:return this.EXT_texture_compression_rgtc.COMPRESSED_RED_GREEN_RGTC2_EXT;case X.BC5_SNORM:return this.EXT_texture_compression_rgtc.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT;case X.D32F_S8:return z(this.gl)?B.DEPTH32F_STENCIL8:this.WEBGL_depth_texture?B.DEPTH_STENCIL:B.DEPTH_COMPONENT16;case X.D24_S8:return z(this.gl)?B.DEPTH24_STENCIL8:this.WEBGL_depth_texture?B.DEPTH_STENCIL:B.DEPTH_COMPONENT16;case X.D32F:return z(this.gl)?B.DEPTH_COMPONENT32F:this.WEBGL_depth_texture?B.DEPTH_COMPONENT:B.DEPTH_COMPONENT16;case X.D24:return z(this.gl)?B.DEPTH_COMPONENT24:this.WEBGL_depth_texture?B.DEPTH_COMPONENT:B.DEPTH_COMPONENT16;default:throw Error(`whoops`)}},e.prototype.translateTextureType=function(e){switch(By(e)){case q.U8:return B.UNSIGNED_BYTE;case q.U16:return B.UNSIGNED_SHORT;case q.U32:return B.UNSIGNED_INT;case q.S8:return B.BYTE;case q.F16:return B.HALF_FLOAT;case q.F32:return B.FLOAT;case q.U16_PACKED_5551:return B.UNSIGNED_SHORT_5_5_5_1;case q.D32F:return z(this.gl)?B.FLOAT:this.WEBGL_depth_texture?B.UNSIGNED_INT:B.UNSIGNED_BYTE;case q.D24:return z(this.gl)?B.UNSIGNED_INT_24_8:this.WEBGL_depth_texture?B.UNSIGNED_SHORT:B.UNSIGNED_BYTE;case q.D24S8:return z(this.gl)?B.UNSIGNED_INT_24_8:this.WEBGL_depth_texture?B.UNSIGNED_INT_24_8_WEBGL:B.UNSIGNED_BYTE;case q.D32FS8:return B.FLOAT_32_UNSIGNED_INT_24_8_REV;default:throw Error(`whoops`)}},e.prototype.translateInternalTextureFormat=function(e){switch(e){case X.F32_R:return B.R32F;case X.F32_RG:return B.RG32F;case X.F32_RGB:return B.RGB32F;case X.F32_RGBA:return B.RGBA32F;case X.F16_R:return B.R16F;case X.F16_RG:return B.RG16F;case X.F16_RGB:return B.RGB16F;case X.F16_RGBA:return B.RGBA16F}return this.translateTextureFormat(e)},e.prototype.translateTextureFormat=function(e){if(Zb(e)||e===X.F32_LUMINANCE||e===X.U8_LUMINANCE)return this.translateTextureInternalFormat(e);var t=z(this.gl)||!z(this.gl)&&!!this.WEBGL_depth_texture;switch(e){case X.D24_S8:case X.D32F_S8:return t?B.DEPTH_STENCIL:B.RGBA;case X.D24:case X.D32F:return t?B.DEPTH_COMPONENT:B.RGBA}var n=Qb(e);switch(zy(e)){case J.A:return B.ALPHA;case J.R:return n?B.RED_INTEGER:B.RED;case J.RG:return n?B.RG_INTEGER:B.RG;case J.RGB:return n?B.RGB_INTEGER:B.RGB;case J.RGBA:return B.RGBA}},e.prototype.setActiveTexture=function(e){this.currentActiveTexture!==e&&(this.gl.activeTexture(e),this.currentActiveTexture=e)},e.prototype.bindVAO=function(e){this.currentBoundVAO!==e&&(z(this.gl)?this.gl.bindVertexArray(e):this.OES_vertex_array_object.bindVertexArrayOES(e),this.currentBoundVAO=e)},e.prototype.programCompiled=function(e){L(e.compileState!==GS.NeedsCompile),e.compileState===GS.Compiling&&(e.compileState=GS.NeedsBind,this.shaderDebug&&this.checkProgramCompilationForErrors(e))},e.prototype.useProgram=function(e){this.currentProgram!==e&&(this.programCompiled(e),this.gl.useProgram(e.gl_program),this.currentProgram=e)},e.prototype.ensureResourceExists=function(e){if(e===null){var t=this.gl.getError();throw Error(`Created resource is null; GL error encountered: ${t}`)}return e},e.prototype.createBuffer=function(e){return new VS({id:this.getNextUniqueId(),device:this,descriptor:e})},e.prototype.createTexture=function(e){return new US({id:this.getNextUniqueId(),device:this,descriptor:e})},e.prototype.createSampler=function(e){return new QS({id:this.getNextUniqueId(),device:this,descriptor:e})},e.prototype.createRenderTarget=function(e){return new WS({id:this.getNextUniqueId(),device:this,descriptor:e})},e.prototype.createRenderTargetFromTexture=function(e){var t=e,n=t.format,r=t.width,i=t.height,a=t.mipLevelCount;return L(a===1),this.createRenderTarget({format:n,width:r,height:i,sampleCount:1,texture:e})},e.prototype.createProgram=function(e){var t=e.vertex?.glsl;return e.vertex?.glsl&&(e.vertex.glsl=Xb(this.queryVendorInfo(),`vert`,e.vertex.glsl)),e.fragment?.glsl&&(e.fragment.glsl=Xb(this.queryVendorInfo(),`frag`,e.fragment.glsl)),this.createProgramSimple(e,t)},e.prototype.createProgramSimple=function(e,t){return new KS({id:this.getNextUniqueId(),device:this,descriptor:e},t)},e.prototype.createBindings=function(e){return new zS({id:this.getNextUniqueId(),device:this,descriptor:e})},e.prototype.createInputLayout=function(e){return new HS({id:this.getNextUniqueId(),device:this,descriptor:e})},e.prototype.createRenderPipeline=function(e){return new YS({id:this.getNextUniqueId(),device:this,descriptor:e})},e.prototype.createComputePass=function(){return new $S},e.prototype.createComputePipeline=function(e){return new XS({id:this.getNextUniqueId(),device:this,descriptor:e})},e.prototype.createReadback=function(){return new JS({id:this.getNextUniqueId(),device:this})},e.prototype.createQueryPool=function(e,t){return new qS({id:this.getNextUniqueId(),device:this,descriptor:{type:e,elemCount:t}})},e.prototype.formatRenderPassDescriptor=function(e){var t=e.colorAttachment;e.depthClearValue=e.depthClearValue??`load`,e.stencilClearValue=e.stencilClearValue??`load`;for(var n=0;n<t.length;n++)e.colorAttachmentLevel||=[],e.colorAttachmentLevel[n]=e.colorAttachmentLevel[n]??0,e.colorResolveToLevel||=[],e.colorResolveToLevel[n]=e.colorResolveToLevel[n]??0,e.colorClearColor||=[],e.colorClearColor[n]=e.colorClearColor[n]??`load`,e.colorStore||=[],e.colorStore[n]=e.colorStore[n]??!1},e.prototype.createRenderBundle=function(){return new eC({id:this.getNextUniqueId(),device:this})},e.prototype.beginBundle=function(e){this.renderBundle=e},e.prototype.endBundle=function(){this.renderBundle=void 0},e.prototype.executeBundles=function(e){e.forEach(function(e){e.replay()})},e.prototype.createRenderPass=function(e){this.currentRenderPassDescriptor!==null&&this.currentRenderPassDescriptorStack.push(this.currentRenderPassDescriptor),this.currentRenderPassDescriptor=e,this.formatRenderPassDescriptor(e);var t=e.colorAttachment,n=e.colorAttachmentLevel,r=e.colorClearColor,i=e.colorResolveTo,a=e.colorResolveToLevel,o=e.depthStencilAttachment,s=e.depthClearValue,c=e.stencilClearValue,l=e.depthStencilResolveTo,u=i&&i.length===1&&i[0]===this.scTexture;this.setRenderPassParametersBegin(t.length,u);for(var d=0;d<t.length;d++)this.setRenderPassParametersColor(d,t[d],n[d],i[d],a[d],u);this.setRenderPassParametersDepthStencil(o,l,u),this.validateCurrentAttachments();for(var d=0;d<t.length;d++){var f=r[d];f!==`load`&&this.setRenderPassParametersClearColor(d,f.r,f.g,f.b,f.a)}return this.setRenderPassParametersClearDepthStencil(s,c),this},e.prototype.submitPass=function(e){L(this.currentRenderPassDescriptor!==null),this.endPass(),this.currentRenderPassDescriptor=this.currentRenderPassDescriptorStack.length?this.currentRenderPassDescriptorStack.pop():null},e.prototype.copySubTexture2D=function(e,t,n,r,i,a){var o=this.gl,s=e,c=r;if(L(c.mipLevelCount===1),L(s.mipLevelCount===1),z(o))s===this.scTexture?o.bindFramebuffer(o.DRAW_FRAMEBUFFER,this.scPlatformFramebuffer):(o.bindFramebuffer(o.DRAW_FRAMEBUFFER,this.resolveColorDrawFramebuffer),this.bindFramebufferAttachment(o.DRAW_FRAMEBUFFER,o.COLOR_ATTACHMENT0,s,0)),o.bindFramebuffer(o.READ_FRAMEBUFFER,this.resolveColorReadFramebuffer),this.bindFramebufferAttachment(o.READ_FRAMEBUFFER,o.COLOR_ATTACHMENT0,c,0),o.blitFramebuffer(i,a,i+c.width,a+c.height,t,n,t+c.width,n+c.height,o.COLOR_BUFFER_BIT,o.LINEAR),o.bindFramebuffer(o.READ_FRAMEBUFFER,null),o.bindFramebuffer(o.DRAW_FRAMEBUFFER,null);else if(s===this.scTexture){var l=this.createRenderTargetFromTexture(r);this.submitBlitRenderPass(l,s)}},e.prototype.queryLimits=function(){return this},e.prototype.queryTextureFormatSupported=function(e,t,n){switch(e){case X.BC1_SRGB:case X.BC2_SRGB:case X.BC3_SRGB:return this.WEBGL_compressed_texture_s3tc_srgb!==null&&gx(t,n,4,4);case X.BC1:case X.BC2:case X.BC3:return this.WEBGL_compressed_texture_s3tc!==null&&gx(t,n,4,4);case X.BC4_UNORM:case X.BC4_SNORM:case X.BC5_UNORM:case X.BC5_SNORM:return this.EXT_texture_compression_rgtc!==null&&gx(t,n,4,4);case X.U16_R_NORM:case X.U16_RG_NORM:case X.U16_RGBA_NORM:return this.EXT_texture_norm16!==null;case X.F32_R:case X.F32_RG:case X.F32_RGB:case X.F32_RGBA:return this.OES_texture_float_linear!==null;case X.F16_R:case X.F16_RG:case X.F16_RGB:case X.F16_RGBA:return this.OES_texture_half_float_linear!==null;default:return!0}},e.prototype.queryProgramReady=function(e){var t=this.gl;if(e.compileState===GS.NeedsCompile)throw Error(`whoops`);if(e.compileState===GS.Compiling){var n=void 0;return n=this.KHR_parallel_shader_compile===null||t.getProgramParameter(e.gl_program,this.KHR_parallel_shader_compile.COMPLETION_STATUS_KHR),n&&this.programCompiled(e),n}return e.compileState===GS.NeedsBind||e.compileState===GS.ReadyToUse},e.prototype.queryPlatformAvailable=function(){return this.gl.isContextLost()},e.prototype.queryVendorInfo=function(){return this},e.prototype.queryRenderPass=function(e){return this.currentRenderPassDescriptor},e.prototype.queryRenderTarget=function(e){return e},e.prototype.setResourceName=function(e,t){if(e.name=t,e.type===V.Buffer)for(var n=e.gl_buffer_pages,r=0;r<n.length;r++)dx(n[r],`${t} Page ${r}`);else if(e.type===V.Texture)dx(lx(e),t);else if(e.type===V.Sampler)dx(ux(e),t);else if(e.type===V.RenderTarget){var i=e.gl_renderbuffer;i!==null&&dx(i,t)}else e.type===V.InputLayout&&dx(e.vao,t)},e.prototype.setResourceLeakCheck=function(e,t){this.resourceCreationTracker!==null&&this.resourceCreationTracker.setResourceLeakCheck(e,t)},e.prototype.checkForLeaks=function(){this.resourceCreationTracker!==null&&this.resourceCreationTracker.checkForLeaks()},e.prototype.pushDebugGroup=function(e){},e.prototype.popDebugGroup=function(){},e.prototype.insertDebugMarker=function(e){},e.prototype.programPatched=function(e,t){L(this.shaderDebug)},e.prototype.getBufferData=function(e,t,n){n===void 0&&(n=0);var r=this.gl;z(r)&&(r.bindBuffer(r.COPY_READ_BUFFER,cx(e,n*4)),r.getBufferSubData(r.COPY_READ_BUFFER,n*4,t))},e.prototype.debugGroupStatisticsDrawCall=function(e){e===void 0&&(e=1);for(var t=this.debugGroupStack.length-1;t>=0;t--)this.debugGroupStack[t].drawCallCount+=e},e.prototype.debugGroupStatisticsBufferUpload=function(e){e===void 0&&(e=1);for(var t=this.debugGroupStack.length-1;t>=0;t--)this.debugGroupStack[t].bufferUploadCount+=e},e.prototype.debugGroupStatisticsTextureBind=function(e){e===void 0&&(e=1);for(var t=this.debugGroupStack.length-1;t>=0;t--)this.debugGroupStack[t].textureBindCount+=e},e.prototype.debugGroupStatisticsTriangles=function(e){for(var t=this.debugGroupStack.length-1;t>=0;t--)this.debugGroupStack[t].triangleCount+=e},e.prototype.reportShaderError=function(e,t){var n=this.gl,r=n.getShaderParameter(e,n.COMPILE_STATUS);if(!r){console.error(nb(t));var i=n.getExtension(`WEBGL_debug_shaders`);i&&console.error(i.getTranslatedShaderSource(e)),console.error(n.getShaderInfoLog(e))}return r},e.prototype.checkProgramCompilationForErrors=function(e){var t=this.gl,n=e.gl_program;if(!t.getProgramParameter(n,t.LINK_STATUS)){var r=e.descriptor;if(!this.reportShaderError(e.gl_shader_vert,r.vertex.glsl)||!this.reportShaderError(e.gl_shader_frag,r.fragment.glsl))return;console.error(t.getProgramInfoLog(e.gl_program))}},e.prototype.bindFramebufferAttachment=function(e,t,n,r){var i=this.gl;if(ey(n))i.framebufferRenderbuffer(e,t,i.RENDERBUFFER,null);else if(n.type===V.RenderTarget)n.gl_renderbuffer===null?n.texture!==null&&i.framebufferTexture2D(e,t,B.TEXTURE_2D,lx(n.texture),r):i.framebufferRenderbuffer(e,t,i.RENDERBUFFER,n.gl_renderbuffer);else if(n.type===V.Texture){var a=lx(n);n.dimension===G.TEXTURE_2D?i.framebufferTexture2D(e,t,B.TEXTURE_2D,a,r):z(i)&&(n.dimension,G.TEXTURE_2D_ARRAY)}},e.prototype.bindFramebufferDepthStencilAttachment=function(e,t){var n=this.gl,r=ey(t)?Y.Depth|Y.Stencil:Vy(t.format),i=!!(r&Y.Depth),a=!!(r&Y.Stencil);i&&a?z(this.gl)||!z(this.gl)&&this.WEBGL_depth_texture?this.bindFramebufferAttachment(e,n.DEPTH_STENCIL_ATTACHMENT,t,0):this.bindFramebufferAttachment(e,n.DEPTH_ATTACHMENT,t,0):i?(this.bindFramebufferAttachment(e,n.DEPTH_ATTACHMENT,t,0),this.bindFramebufferAttachment(e,n.STENCIL_ATTACHMENT,null,0)):a&&(this.bindFramebufferAttachment(e,n.STENCIL_ATTACHMENT,t,0),this.bindFramebufferAttachment(e,n.DEPTH_ATTACHMENT,null,0))},e.prototype.validateCurrentAttachments=function(){for(var e=-1,t=-1,n=-1,r=0;r<this.currentColorAttachments.length;r++){var i=this.currentColorAttachments[r];i!==null&&(e===-1?(e=i.sampleCount,t=i.width,n=i.height):(L(e===i.sampleCount),L(t===i.width),L(n===i.height)))}this.currentDepthStencilAttachment&&(e===-1?e=this.currentDepthStencilAttachment.sampleCount:(L(e===this.currentDepthStencilAttachment.sampleCount),L(t===this.currentDepthStencilAttachment.width),L(n===this.currentDepthStencilAttachment.height))),this.currentSampleCount=e},e.prototype.setRenderPassParametersBegin=function(e,t){t===void 0&&(t=!1);var n=this.gl;if(t)n.bindFramebuffer(B.FRAMEBUFFER,null);else if(z(n)?n.bindFramebuffer(B.DRAW_FRAMEBUFFER,this.renderPassDrawFramebuffer):this.inBlitRenderPass||n.bindFramebuffer(B.FRAMEBUFFER,this.renderPassDrawFramebuffer),z(n)?n.drawBuffers([B.COLOR_ATTACHMENT0,B.COLOR_ATTACHMENT1,B.COLOR_ATTACHMENT2,B.COLOR_ATTACHMENT3]):!this.inBlitRenderPass&&this.WEBGL_draw_buffers&&this.WEBGL_draw_buffers.drawBuffersWEBGL([B.COLOR_ATTACHMENT0_WEBGL,B.COLOR_ATTACHMENT1_WEBGL,B.COLOR_ATTACHMENT2_WEBGL,B.COLOR_ATTACHMENT3_WEBGL]),!this.inBlitRenderPass)for(var r=e;r<this.currentColorAttachments.length;r++){var i=z(n)?B.DRAW_FRAMEBUFFER:B.FRAMEBUFFER,a=z(n)?B.COLOR_ATTACHMENT0:B.COLOR_ATTACHMENT0_WEBGL;n.framebufferRenderbuffer(i,a+r,B.RENDERBUFFER,null),n.framebufferTexture2D(i,a+r,B.TEXTURE_2D,null,0)}this.currentColorAttachments.length=e},e.prototype.setRenderPassParametersColor=function(e,t,n,r,i,a){a===void 0&&(a=!1);var o=this.gl,s=z(o);(this.currentColorAttachments[e]!==t||this.currentColorAttachmentLevels[e]!==n)&&(this.currentColorAttachments[e]=t,this.currentColorAttachmentLevels[e]=n,!a&&(s||!s&&this.WEBGL_draw_buffers)&&this.bindFramebufferAttachment(s?B.DRAW_FRAMEBUFFER:B.FRAMEBUFFER,(s?B.COLOR_ATTACHMENT0:B.COLOR_ATTACHMENT0_WEBGL)+e,t,n),this.resolveColorAttachmentsChanged=!0),(this.currentColorResolveTos[e]!==r||this.currentColorResolveToLevels[e]!==i)&&(this.currentColorResolveTos[e]=r,this.currentColorResolveToLevels[e]=i,r!==null&&(this.resolveColorAttachmentsChanged=!0))},e.prototype.setRenderPassParametersDepthStencil=function(e,t,n){n===void 0&&(n=!1);var r=this.gl;this.currentDepthStencilAttachment!==e&&(this.currentDepthStencilAttachment=e,!n&&!this.inBlitRenderPass&&this.bindFramebufferDepthStencilAttachment(z(r)?B.DRAW_FRAMEBUFFER:B.FRAMEBUFFER,this.currentDepthStencilAttachment),this.resolveDepthStencilAttachmentsChanged=!0),this.currentDepthStencilResolveTo!==t&&(this.currentDepthStencilResolveTo=t,t&&(this.resolveDepthStencilAttachmentsChanged=!0))},e.prototype.setRenderPassParametersClearColor=function(e,t,n,r,i){var a=this.gl;if(this.OES_draw_buffers_indexed!==null){var o=this.currentMegaState.attachmentsState[e];o&&o.channelWriteMask!==xS.ALL&&(this.OES_draw_buffers_indexed.colorMaskiOES(e,!0,!0,!0,!0),o.channelWriteMask=xS.ALL)}else{var o=this.currentMegaState.attachmentsState[0];o&&o.channelWriteMask!==xS.ALL&&(a.colorMask(!0,!0,!0,!0),o.channelWriteMask=xS.ALL)}this.setScissorRectEnabled(!1),z(a)?a.clearBufferfv(a.COLOR,e,[t,n,r,i]):(a.clearColor(t,n,r,i),a.clear(a.COLOR_BUFFER_BIT))},e.prototype.setRenderPassParametersClearDepthStencil=function(e,t){e===void 0&&(e=`load`),t===void 0&&(t=`load`);var n=this.gl;e!==`load`&&(L(!!this.currentDepthStencilAttachment),this.currentMegaState.depthWrite||(n.depthMask(!0),this.currentMegaState.depthWrite=!0),z(n)?n.clearBufferfv(n.DEPTH,0,[e]):(n.clearDepth(e),n.clear(n.DEPTH_BUFFER_BIT))),t!==`load`&&(L(!!this.currentDepthStencilAttachment),this.currentMegaState.stencilWrite||(n.enable(n.STENCIL_TEST),n.stencilMask(255),this.currentMegaState.stencilWrite=!0),z(n)?n.clearBufferiv(n.STENCIL,0,[t]):(n.clearStencil(t),n.clear(n.STENCIL_BUFFER_BIT)))},e.prototype.setBindings=function(e){var t=this,n;if(this.renderBundle)this.renderBundle.push(function(){return t.setBindings(e)});else{var r=this.gl,i=e,a=i.uniformBufferBindings,o=i.samplerBindings,s=i.bindingLayouts;L(0<s.bindingLayoutTables.length);var c=s.bindingLayoutTables[0];L(a.length>=c.numUniformBuffers),L(o.length>=c.numSamplers);for(var l=0;l<a.length;l++){var u=a[l];if(u.size!==0){var d=c.firstUniformBuffer+l,f=u.buffer,p=u.offset||0,m=u.size||f.byteSize;if(f!==this.currentUniformBuffers[d]||p!==this.currentUniformBufferByteOffsets[d]||m!==this.currentUniformBufferByteSizes[d]){var h=p%f.pageByteSize,g=f.gl_buffer_pages[p/f.pageByteSize|0];L(h+m<=f.pageByteSize),z(r)&&r.bindBufferRange(r.UNIFORM_BUFFER,d,g,h,m),this.currentUniformBuffers[d]=f,this.currentUniformBufferByteOffsets[d]=p,this.currentUniformBufferByteSizes[d]=m}}}for(var l=0;l<c.numSamplers;l++){var u=o[l],_=c.firstSampler+l,v=u!==null&&u.sampler!==null?ux(u.sampler):null,y=u!==null&&u.texture!==null?lx(u.texture):null;if(this.currentSamplers[_]!==v&&(z(r)&&r.bindSampler(_,v),this.currentSamplers[_]=v),this.currentTextures[_]!==y){if(this.setActiveTexture(r.TEXTURE0+_),y!==null){var b=Ky(u).texture,x=b.gl_target,S=b.width,C=b.height;u.texture.textureIndex=_,r.bindTexture(x,y),z(r)||(n=u.sampler)==null||n.setTextureParameters(x,S,C),this.debugGroupStatisticsTextureBind()}else{var w=pr(pr({},u),AS),ee=w.dimension,te=w.formatKind,x=hx(ee);r.bindTexture(x,this.getFallbackTexture(pr({gl_target:x,formatKind:te},w)))}this.currentTextures[_]=y}}}},e.prototype.setViewport=function(e,t,n,r){this.gl.viewport(e,t,n,r)},e.prototype.setScissorRect=function(e,t,n,r){var i=this.gl;this.setScissorRectEnabled(!0),i.scissor(e,t,n,r)},e.prototype.applyAttachmentStateIndexed=function(e,t,n){var r=this.gl,i=this.OES_draw_buffers_indexed;t.channelWriteMask!==n.channelWriteMask&&(i.colorMaskiOES(e,!!(n.channelWriteMask&xS.RED),!!(n.channelWriteMask&xS.GREEN),!!(n.channelWriteMask&xS.BLUE),!!(n.channelWriteMask&xS.ALPHA)),t.channelWriteMask=n.channelWriteMask);var a=t.rgbBlendState.blendMode!==n.rgbBlendState.blendMode||t.alphaBlendState.blendMode!==n.alphaBlendState.blendMode,o=t.rgbBlendState.blendSrcFactor!==n.rgbBlendState.blendSrcFactor||t.alphaBlendState.blendSrcFactor!==n.alphaBlendState.blendSrcFactor||t.rgbBlendState.blendDstFactor!==n.rgbBlendState.blendDstFactor||t.alphaBlendState.blendDstFactor!==n.alphaBlendState.blendDstFactor;(o||a)&&(px(t.rgbBlendState)&&px(t.alphaBlendState)?i.enableiOES(e,r.BLEND):px(n.rgbBlendState)&&px(n.alphaBlendState)&&i.disableiOES(e,r.BLEND)),a&&(i.blendEquationSeparateiOES(e,n.rgbBlendState.blendMode,n.alphaBlendState.blendMode),t.rgbBlendState.blendMode=n.rgbBlendState.blendMode,t.alphaBlendState.blendMode=n.alphaBlendState.blendMode),o&&(i.blendFuncSeparateiOES(e,n.rgbBlendState.blendSrcFactor,n.rgbBlendState.blendDstFactor,n.alphaBlendState.blendSrcFactor,n.alphaBlendState.blendDstFactor),t.rgbBlendState.blendSrcFactor=n.rgbBlendState.blendSrcFactor,t.alphaBlendState.blendSrcFactor=n.alphaBlendState.blendSrcFactor,t.rgbBlendState.blendDstFactor=n.rgbBlendState.blendDstFactor,t.alphaBlendState.blendDstFactor=n.alphaBlendState.blendDstFactor)},e.prototype.applyAttachmentState=function(e,t){var n=this.gl;e.channelWriteMask!==t.channelWriteMask&&(n.colorMask(!!(t.channelWriteMask&xS.RED),!!(t.channelWriteMask&xS.GREEN),!!(t.channelWriteMask&xS.BLUE),!!(t.channelWriteMask&xS.ALPHA)),e.channelWriteMask=t.channelWriteMask);var r=e.rgbBlendState.blendMode!==t.rgbBlendState.blendMode||e.alphaBlendState.blendMode!==t.alphaBlendState.blendMode,i=e.rgbBlendState.blendSrcFactor!==t.rgbBlendState.blendSrcFactor||e.alphaBlendState.blendSrcFactor!==t.alphaBlendState.blendSrcFactor||e.rgbBlendState.blendDstFactor!==t.rgbBlendState.blendDstFactor||e.alphaBlendState.blendDstFactor!==t.alphaBlendState.blendDstFactor;(i||r)&&(px(e.rgbBlendState)&&px(e.alphaBlendState)?n.enable(n.BLEND):px(t.rgbBlendState)&&px(t.alphaBlendState)&&n.disable(n.BLEND)),r&&(n.blendEquationSeparate(t.rgbBlendState.blendMode,t.alphaBlendState.blendMode),e.rgbBlendState.blendMode=t.rgbBlendState.blendMode,e.alphaBlendState.blendMode=t.alphaBlendState.blendMode),i&&(n.blendFuncSeparate(t.rgbBlendState.blendSrcFactor,t.rgbBlendState.blendDstFactor,t.alphaBlendState.blendSrcFactor,t.alphaBlendState.blendDstFactor),e.rgbBlendState.blendSrcFactor=t.rgbBlendState.blendSrcFactor,e.alphaBlendState.blendSrcFactor=t.alphaBlendState.blendSrcFactor,e.rgbBlendState.blendDstFactor=t.rgbBlendState.blendDstFactor,e.alphaBlendState.blendDstFactor=t.alphaBlendState.blendDstFactor)},e.prototype.setMegaState=function(e){var t=this.gl,n=this.currentMegaState;if(this.OES_draw_buffers_indexed!==null)for(var r=0;r<e.attachmentsState.length;r++)this.applyAttachmentStateIndexed(r,n.attachmentsState[0],e.attachmentsState[0]);else L(e.attachmentsState.length===1),this.applyAttachmentState(n.attachmentsState[0],e.attachmentsState[0]);qy(n.blendConstant,e.blendConstant)||(t.blendColor(e.blendConstant.r,e.blendConstant.g,e.blendConstant.b,e.blendConstant.a),Jy(n.blendConstant,e.blendConstant)),n.depthCompare!==e.depthCompare&&(t.depthFunc(e.depthCompare),n.depthCompare=e.depthCompare),!!n.depthWrite!=!!e.depthWrite&&(t.depthMask(e.depthWrite),n.depthWrite=e.depthWrite),!!n.stencilWrite!=!!e.stencilWrite&&(t.stencilMask(e.stencilWrite?255:0),n.stencilWrite=e.stencilWrite);var i=!1;if(!yb(n.stencilFront,e.stencilFront)){i=!0;var a=e.stencilFront,o=a.passOp,s=a.failOp,c=a.depthFailOp,l=a.compare;(n.stencilFront.passOp!==o||n.stencilFront.failOp!==s||n.stencilFront.depthFailOp!==c)&&(t.stencilOpSeparate(t.FRONT,s,c,o),n.stencilFront.passOp=o,n.stencilFront.failOp=s,n.stencilFront.depthFailOp=c),n.stencilFront.compare!==l&&(this.setStencilReference(0),n.stencilFront.compare=l)}if(!yb(n.stencilBack,e.stencilBack)){i=!0;var u=e.stencilBack,o=u.passOp,s=u.failOp,c=u.depthFailOp,l=u.compare;(n.stencilBack.passOp!==o||n.stencilBack.failOp!==s||n.stencilBack.depthFailOp!==c)&&(t.stencilOpSeparate(t.BACK,s,c,o),n.stencilBack.passOp=o,n.stencilBack.failOp=s,n.stencilBack.depthFailOp=c),n.stencilBack.compare!==l&&(this.setStencilReference(0),n.stencilBack.compare=l)}(n.stencilFront.mask!==e.stencilFront.mask||n.stencilBack.mask!==e.stencilBack.mask)&&(i=!0,n.stencilFront.mask=e.stencilFront.mask,n.stencilBack.mask=e.stencilBack.mask),i&&this.applyStencil(),n.cullMode!==e.cullMode&&(n.cullMode===dS.NONE?t.enable(t.CULL_FACE):e.cullMode===dS.NONE&&t.disable(t.CULL_FACE),e.cullMode===dS.BACK?t.cullFace(t.BACK):e.cullMode===dS.FRONT?t.cullFace(t.FRONT):e.cullMode===dS.FRONT_AND_BACK&&t.cullFace(t.FRONT_AND_BACK),n.cullMode=e.cullMode),n.frontFace!==e.frontFace&&(t.frontFace(e.frontFace),n.frontFace=e.frontFace),n.polygonOffset!==e.polygonOffset&&(e.polygonOffset?t.enable(t.POLYGON_OFFSET_FILL):t.disable(t.POLYGON_OFFSET_FILL),n.polygonOffset=e.polygonOffset),(n.polygonOffsetFactor!==e.polygonOffsetFactor||n.polygonOffsetUnits!==e.polygonOffsetUnits)&&(t.polygonOffset(e.polygonOffsetFactor,e.polygonOffsetUnits),n.polygonOffsetFactor=e.polygonOffsetFactor,n.polygonOffsetUnits=e.polygonOffsetUnits)},e.prototype.validatePipelineFormats=function(e){for(var t=0;t<this.currentColorAttachments.length;t++)if(this.currentColorAttachments[t]===null)continue;this.currentDepthStencilAttachment&&L(this.currentDepthStencilAttachment.format===e.depthStencilAttachmentFormat),this.currentSampleCount!==-1&&L(this.currentSampleCount===e.sampleCount)},e.prototype.setPipeline=function(e){var t=this;if(this.renderBundle)this.renderBundle.push(function(){return t.setPipeline(e)});else{this.currentPipeline=e,this.validatePipelineFormats(this.currentPipeline),this.setMegaState(this.currentPipeline.megaState);var n=this.currentPipeline.program;if(this.useProgram(n),n.compileState===GS.NeedsBind){var r=this.gl,i=n.gl_program,a=n.descriptor,o=fx(a.vertex.glsl,nC);if(z(r))for(var s=0;s<o.length;s++){var c=sr(o[s],2)[1],l=r.getUniformBlockIndex(i,c);l!==-1&&l!==4294967295&&r.uniformBlockBinding(i,l,s)}for(var u=fx(a.fragment.glsl,/^uniform .*sampler\S+ (\w+);\s* \/\/ BINDING=(\d+)$/gm),s=0;s<u.length;s++){var d=sr(u[s],3),f=d[1],p=d[2],m=r.getUniformLocation(i,f);r.uniform1i(m,parseInt(p))}n.compileState=GS.ReadyToUse}}},e.prototype.setVertexInput=function(e,t,n){var r,i,a=this;if(this.renderBundle)this.renderBundle.push(function(){return a.setVertexInput(e,t,n)});else if(e!==null){L(this.currentPipeline.inputLayout===e);var o=e;this.bindVAO(o.vao);for(var s=this.gl,c=0;c<o.vertexBufferDescriptors.length;c++){var l=o.vertexBufferDescriptors[c],u=l.arrayStride,d=l.attributes;try{for(var f=(r=void 0,lr(d)),p=f.next();!p.done;p=f.next()){var m=p.value,h=m.shaderLocation,g=m.offset,_=z(s)?h:o.program.attributes[h]?.location;if(!ey(_)){var v=t[c];if(v===null)continue;var y=m.vertexFormat;s.bindBuffer(s.ARRAY_BUFFER,cx(v.buffer));var b=(v.offset||0)+g;s.vertexAttribPointer(_,y.size,y.type,y.normalized,u,b)}}}catch(e){r={error:e}}finally{try{p&&!p.done&&(i=f.return)&&i.call(f)}finally{if(r)throw r.error}}}if(L(n!==null==(o.indexBufferFormat!==null)),n!==null){var x=n.buffer;L(x.usage===W.INDEX),s.bindBuffer(s.ELEMENT_ARRAY_BUFFER,cx(x)),this.currentIndexBufferByteOffset=n.offset||0}else this.currentIndexBufferByteOffset=null}else L(this.currentPipeline.inputLayout===null),L(n===null),this.bindVAO(null),this.currentIndexBufferByteOffset=0},e.prototype.setStencilReference=function(e){this.currentStencilRef!==e&&(this.currentStencilRef=e,this.applyStencil())},e.prototype.draw=function(e,t,n,r){var i,a=this;if(this.renderBundle)this.renderBundle.push(function(){return a.draw(e,t,n,r)});else{var o=this.gl,s=this.currentPipeline;if(t){var c=[s.drawMode,n||0,e,t];z(o)?o.drawArraysInstanced.apply(o,fr([],sr(c),!1)):(i=this.ANGLE_instanced_arrays).drawArraysInstancedANGLE.apply(i,fr([],sr(c),!1))}else o.drawArrays(s.drawMode,n,e);this.debugGroupStatisticsDrawCall(),this.debugGroupStatisticsTriangles(e/3*Math.max(t,1))}},e.prototype.drawIndexed=function(e,t,n,r,i){var a,o=this;if(this.renderBundle)this.renderBundle.push(function(){return o.drawIndexed(e,t,n,r,i)});else{var s=this.gl,c=this.currentPipeline,l=Ky(c.inputLayout),u=Ky(this.currentIndexBufferByteOffset)+n*l.indexBufferCompByteSize;if(t){var d=[c.drawMode,e,l.indexBufferType,u,t];z(s)?s.drawElementsInstanced.apply(s,fr([],sr(d),!1)):(a=this.ANGLE_instanced_arrays).drawElementsInstancedANGLE.apply(a,fr([],sr(d),!1))}else s.drawElements(c.drawMode,e,l.indexBufferType,u);this.debugGroupStatisticsDrawCall(),this.debugGroupStatisticsTriangles(e/3*Math.max(t,1))}},e.prototype.drawIndirect=function(e,t){},e.prototype.drawIndexedIndirect=function(e,t){},e.prototype.beginOcclusionQuery=function(e){var t=this.gl;if(z(t)){var n=this.currentRenderPassDescriptor.occlusionQueryPool;t.beginQuery(n.gl_query_type,n.gl_query[e])}},e.prototype.endOcclusionQuery=function(){var e=this.gl;if(z(e)){var t=this.currentRenderPassDescriptor.occlusionQueryPool;e.endQuery(t.gl_query_type)}},e.prototype.pipelineQueryReady=function(e){var t=e;return this.queryProgramReady(t.program)},e.prototype.pipelineForceReady=function(e){},e.prototype.endPass=function(){for(var e=this.gl,t=z(e),n=this.currentColorResolveTos.length===1&&this.currentColorResolveTos[0]===this.scTexture,r=!1,i=0;i<this.currentColorAttachments.length;i++){var a=this.currentColorAttachments[i];if(a!==null){var o=this.currentColorResolveTos[i],s=!1;o!==null&&(L(a.width===o.width&&a.height===o.height),this.setScissorRectEnabled(!1),n||(t&&e.bindFramebuffer(e.READ_FRAMEBUFFER,this.resolveColorReadFramebuffer),this.resolveColorAttachmentsChanged&&t&&this.bindFramebufferAttachment(e.READ_FRAMEBUFFER,e.COLOR_ATTACHMENT0,a,this.currentColorAttachmentLevels[i])),s=!0,n||(o===this.scTexture?e.bindFramebuffer(t?B.DRAW_FRAMEBUFFER:B.FRAMEBUFFER,this.scPlatformFramebuffer):(e.bindFramebuffer(t?B.DRAW_FRAMEBUFFER:B.FRAMEBUFFER,this.resolveColorDrawFramebuffer),this.resolveColorAttachmentsChanged&&e.framebufferTexture2D(t?B.DRAW_FRAMEBUFFER:B.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,o.gl_texture,this.currentColorResolveToLevels[i]))),n||(t?(e.blitFramebuffer(0,0,a.width,a.height,0,0,o.width,o.height,e.COLOR_BUFFER_BIT,e.LINEAR),e.bindFramebuffer(e.DRAW_FRAMEBUFFER,null)):this.submitBlitRenderPass(a,o)),r=!0),this.currentRenderPassDescriptor.colorStore[i]||!n&&!s&&(e.bindFramebuffer(t?B.READ_FRAMEBUFFER:B.FRAMEBUFFER,this.resolveColorReadFramebuffer),this.resolveColorAttachmentsChanged&&this.bindFramebufferAttachment(t?B.READ_FRAMEBUFFER:B.FRAMEBUFFER,e.COLOR_ATTACHMENT0,a,this.currentColorAttachmentLevels[i])),n||e.bindFramebuffer(t?B.READ_FRAMEBUFFER:B.FRAMEBUFFER,null)}}this.resolveColorAttachmentsChanged=!1;var c=this.currentDepthStencilAttachment;if(c){var l=this.currentDepthStencilResolveTo,s=!1;l&&(L(c.width===l.width&&c.height===l.height),this.setScissorRectEnabled(!1),n||(e.bindFramebuffer(t?B.READ_FRAMEBUFFER:B.FRAMEBUFFER,this.resolveDepthStencilReadFramebuffer),e.bindFramebuffer(t?B.DRAW_FRAMEBUFFER:B.FRAMEBUFFER,this.resolveDepthStencilDrawFramebuffer),this.resolveDepthStencilAttachmentsChanged&&(this.bindFramebufferDepthStencilAttachment(t?B.READ_FRAMEBUFFER:B.FRAMEBUFFER,c),this.bindFramebufferDepthStencilAttachment(t?B.DRAW_FRAMEBUFFER:B.FRAMEBUFFER,l))),s=!0,n||(t&&e.blitFramebuffer(0,0,c.width,c.height,0,0,l.width,l.height,e.DEPTH_BUFFER_BIT,e.NEAREST),e.bindFramebuffer(t?B.DRAW_FRAMEBUFFER:B.FRAMEBUFFER,null)),r=!0),!n&&!this.currentRenderPassDescriptor.depthStencilStore&&(s||=(e.bindFramebuffer(t?B.READ_FRAMEBUFFER:B.FRAMEBUFFER,this.resolveDepthStencilReadFramebuffer),this.resolveDepthStencilAttachmentsChanged&&this.bindFramebufferDepthStencilAttachment(t?B.READ_FRAMEBUFFER:B.FRAMEBUFFER,c),!0),t&&e.invalidateFramebuffer(e.READ_FRAMEBUFFER,[e.DEPTH_STENCIL_ATTACHMENT])),!n&&s&&e.bindFramebuffer(t?B.READ_FRAMEBUFFER:B.FRAMEBUFFER,null),this.resolveDepthStencilAttachmentsChanged=!1}!n&&!r&&e.bindFramebuffer(t?B.DRAW_FRAMEBUFFER:B.FRAMEBUFFER,null)},e.prototype.setScissorRectEnabled=function(e){if(this.currentScissorEnabled!==e){var t=this.gl;e?t.enable(t.SCISSOR_TEST):t.disable(t.SCISSOR_TEST),this.currentScissorEnabled=e}},e.prototype.applyStencil=function(){ey(this.currentStencilRef)||(this.gl.stencilFuncSeparate(B.FRONT,this.currentMegaState.stencilFront.compare,this.currentStencilRef,this.currentMegaState.stencilFront.mask||255),this.gl.stencilFuncSeparate(B.BACK,this.currentMegaState.stencilBack.compare,this.currentStencilRef,this.currentMegaState.stencilBack.mask||255))},e.prototype.getFallbackTexture=function(e){var t=e.gl_target,n=e.formatKind;if(t===B.TEXTURE_2D)return n===SS.Depth?this.fallbackTexture2DDepth:this.fallbackTexture2D;if(t===B.TEXTURE_2D_ARRAY)return this.fallbackTexture2DArray;if(t===B.TEXTURE_3D)return this.fallbackTexture3D;if(t===B.TEXTURE_CUBE_MAP)return this.fallbackTextureCube;throw Error(`whoops`)},e.prototype.submitBlitRenderPass=function(e,t){this.blitRenderPipeline||(this.blitProgram=this.createProgram({vertex:{glsl:`layout(location = 0) in vec2 a_Position;
out vec2 v_TexCoord;
void main() {
  v_TexCoord = 0.5 * (a_Position + 1.0);
  gl_Position = vec4(a_Position, 0., 1.);

  #ifdef VIEWPORT_ORIGIN_TL
    v_TexCoord.y = 1.0 - v_TexCoord.y;
  #endif
}`},fragment:{glsl:`uniform sampler2D u_Texture;
in vec2 v_TexCoord;
out vec4 outputColor;
void main() {
  outputColor = texture(SAMPLER_2D(u_Texture), v_TexCoord);
}`}}),this.blitVertexBuffer=this.createBuffer({usage:W.VERTEX|W.COPY_DST,viewOrSize:new Float32Array([-4,-4,4,-4,0,4])}),this.blitInputLayout=this.createInputLayout({vertexBufferDescriptors:[{arrayStride:8,stepMode:vS.VERTEX,attributes:[{format:X.F32_RG,offset:0,shaderLocation:0}]}],indexBufferFormat:null,program:this.blitProgram}),this.blitRenderPipeline=this.createRenderPipeline({topology:gS.TRIANGLES,sampleCount:1,program:this.blitProgram,colorAttachmentFormats:[X.U8_RGBA_RT],depthStencilAttachmentFormat:null,inputLayout:this.blitInputLayout,megaStateDescriptor:lb(kS)}),this.blitBindings=this.createBindings({samplerBindings:[{sampler:null,texture:e.texture}],uniformBufferBindings:[]}),this.blitProgram.setUniformsLegacy({u_Texture:e}));var n=this.currentRenderPassDescriptor;this.currentRenderPassDescriptor=null,this.inBlitRenderPass=!0;var r=this.createRenderPass({colorAttachment:[e],colorResolveTo:[t],colorClearColor:[DS]}),i=this.getCanvas(),a=i.width,o=i.height;r.setPipeline(this.blitRenderPipeline),r.setBindings(this.blitBindings),r.setVertexInput(this.blitInputLayout,[{buffer:this.blitVertexBuffer}],null),r.setViewport(0,0,a,o),this.gl.disable(this.gl.BLEND),r.draw(3,0),this.gl.enable(this.gl.BLEND),this.currentRenderPassDescriptor=n,this.inBlitRenderPass=!1},e}(),iC=function(){function e(e){this.pluginOptions=e}return e.prototype.createSwapChain=function(e){return ur(this,void 0,void 0,function(){var t,n,r,i,a,o,s,c,l,u,d,f,p;return cr(this,function(m){return t=this.pluginOptions,n=t.targets,r=t.xrCompatible,i=t.antialias,a=i!==void 0&&i,o=t.preserveDrawingBuffer,s=o!==void 0&&o,c=t.premultipliedAlpha,l=c===void 0||c,u=t.shaderDebug,d=t.trackResources,f={antialias:a,preserveDrawingBuffer:s,stencil:!0,premultipliedAlpha:l,xrCompatible:r},this.handleContextEvents(e),n.includes(`webgl2`)&&(p=e.getContext(`webgl2`,f)||e.getContext(`experimental-webgl2`,f)),!p&&n.includes(`webgl1`)&&(p=e.getContext(`webgl`,f)||e.getContext(`experimental-webgl`,f)),[2,new rC(p,{shaderDebug:u,trackResources:d})]})})},e.prototype.handleContextEvents=function(e){var t=this.pluginOptions,n=t.onContextLost,r=t.onContextRestored,i=t.onContextCreationError;i&&e.addEventListener(`webglcontextcreationerror`,i,!1),n&&e.addEventListener(`webglcontextlost`,n,!1),r&&e.addEventListener(`webglcontextrestored`,r,!1)},e}(),aC=typeof TextDecoder<`u`?new TextDecoder(`utf-8`,{ignoreBOM:!0,fatal:!0}):{decode:()=>{throw Error(`TextDecoder not available`)}},typeof TextDecoder<`u`&&aC.decode(),oC=null,sC=Array(128).fill(void 0),sC.push(void 0,null,!0,!1),cC=sC.length,lC=0,uC=typeof TextEncoder<`u`?new TextEncoder(`utf-8`):{encode:()=>{throw Error(`TextEncoder not available`)}},dC=typeof uC.encodeInto==`function`?function(e,t){return uC.encodeInto(e,t)}:function(e,t){let n=uC.encode(e);return t.set(n),{read:e.length,written:n.length}},fC=null,pC=class e{static __wrap(t){t>>>=0;let n=Object.create(e.prototype);return n.__wbg_ptr=t,n}__destroy_into_raw(){let e=this.__wbg_ptr;return this.__wbg_ptr=0,e}free(){let e=this.__destroy_into_raw();Q.__wbg_wgslcomposer_free(e)}constructor(){let t=Q.wgslcomposer_new();return e.__wrap(t)}load_composable(e){let t=Cx(e,Q.__wbindgen_malloc,Q.__wbindgen_realloc),n=lC;Q.wgslcomposer_load_composable(this.__wbg_ptr,t,n)}wgsl_compile(e){let t,n;try{let a=Q.__wbindgen_add_to_stack_pointer(-16),o=Cx(e,Q.__wbindgen_malloc,Q.__wbindgen_realloc),s=lC;Q.wgslcomposer_wgsl_compile(a,this.__wbg_ptr,o,s);var r=wx()[a/4+0],i=wx()[a/4+1];return t=r,n=i,vx(r,i)}finally{Q.__wbindgen_add_to_stack_pointer(16),Q.__wbindgen_free(t,n,1)}}},(function(e){e[e.COPY_SRC=1]=`COPY_SRC`,e[e.COPY_DST=2]=`COPY_DST`,e[e.TEXTURE_BINDING=4]=`TEXTURE_BINDING`,e[e.STORAGE_BINDING=8]=`STORAGE_BINDING`,e[e.STORAGE=8]=`STORAGE`,e[e.RENDER_ATTACHMENT=16]=`RENDER_ATTACHMENT`})(mC||={}),(function(e){e[e.READ=1]=`READ`,e[e.WRITE=2]=`WRITE`})(hC||={}),gC=function(e){M(t,e);function t(t){var n=t.id,r=t.device,i=e.call(this)||this;return i.id=n,i.device=r,i}return t.prototype.destroy=function(){},t}(Iy),_C=function(e){M(t,e);function t(t){var n=t.id,r=t.device,i=t.descriptor,a=e.call(this,{id:n,device:r})||this;a.type=V.Bindings;var o=i.pipeline;L(!!o);var s=i.uniformBufferBindings,c=i.storageBufferBindings,l=i.samplerBindings,u=i.storageTextureBindings;a.numUniformBuffers=s?.length||0;var d=[[],[],[],[]],f=0;if(s&&s.length)for(var p=0;p<s.length;p++){var m=i.uniformBufferBindings[p],h=m.binding,g=m.size,_=m.offset,v=m.buffer,y={buffer:Rx(v),offset:_??0,size:g};d[0].push({binding:h??f++,resource:y})}if(l&&l.length){f=0;for(var p=0;p<l.length;p++){var b=pr(pr({},l[p]),AS),h=i.samplerBindings[p],x=h.texture===null?a.device.getFallbackTexture(b):h.texture;b.dimension=x.dimension,b.formatKind=Gy(x.format);var S=x.gpuTextureView;if(d[1].push({binding:h.textureBinding??f++,resource:S}),h.samplerBinding!==-1){var C=zx(h.sampler===null?a.device.getFallbackSampler(b):h.sampler);d[1].push({binding:h.samplerBinding??f++,resource:C})}}}if(c&&c.length){f=0;for(var p=0;p<c.length;p++){var w=i.storageBufferBindings[p],h=w.binding,g=w.size,_=w.offset,v=w.buffer,y={buffer:Rx(v),offset:_??0,size:g};d[2].push({binding:h??f++,resource:y})}}if(u&&u.length){f=0;for(var p=0;p<u.length;p++){var ee=i.storageTextureBindings[p],h=ee.binding,x=ee.texture,S=x.gpuTextureView;d[3].push({binding:h??f++,resource:S})}}var te=d.findLastIndex(function(e){return!!e.length});return a.gpuBindGroup=d.map(function(e,t){return t<=te&&a.device.device.createBindGroup({layout:o.getBindGroupLayout(t),entries:e})}),a}return t}(gC),vC=function(e){M(t,e);function t(t){var n=t.id,r=t.device,i=t.descriptor,a=e.call(this,{id:n,device:r})||this;a.type=V.Buffer;var o=i.usage,s=i.viewOrSize,c=!!(o&W.MAP_READ);a.usage=Px(o),c&&(a.usage=W.MAP_READ|W.COPY_DST);var l=!py(s);return a.view=py(s)?null:s,a.size=py(s)?eb(s,4):eb(s.byteLength,4),py(s)?a.gpuBuffer=a.device.device.createBuffer({usage:a.usage,size:a.size,mappedAtCreation:c?l:!1}):(a.gpuBuffer=a.device.device.createBuffer({usage:a.usage,size:a.size,mappedAtCreation:!0}),new(s&&s.constructor||Float32Array)(a.gpuBuffer.getMappedRange()).set(s),a.gpuBuffer.unmap()),a}return t.prototype.setSubData=function(e,t,n,r){n===void 0&&(n=0),r===void 0&&(r=0);var i=this.gpuBuffer;r||=t.byteLength,r=Math.min(r,this.size-e);var a=t.byteOffset+n,o=a+r,s=r+3&-4;if(s!==r){var c=new Uint8Array(t.buffer.slice(a,o));t=new Uint8Array(s),t.set(c),n=0,a=0,o=s,r=s}for(var l=15728640,u=0;o-(a+u)>l;)this.device.device.queue.writeBuffer(i,e+u,t.buffer,a+u,l),u+=l;this.device.device.queue.writeBuffer(i,e+u,t.buffer,a+u,r-u)},t.prototype.destroy=function(){e.prototype.destroy.call(this),this.gpuBuffer.destroy()},t}(gC),yC=function(){function e(){this.gpuComputePassEncoder=null}return e.prototype.dispatchWorkgroups=function(e,t,n){this.gpuComputePassEncoder.dispatchWorkgroups(e,t,n)},e.prototype.dispatchWorkgroupsIndirect=function(e,t){this.gpuComputePassEncoder.dispatchWorkgroupsIndirect(e.gpuBuffer,t)},e.prototype.finish=function(){this.gpuComputePassEncoder.end(),this.gpuComputePassEncoder=null,this.frameCommandEncoder=null},e.prototype.beginComputePass=function(e){L(this.gpuComputePassEncoder===null),this.frameCommandEncoder=e,this.gpuComputePassEncoder=this.frameCommandEncoder.beginComputePass(this.gpuComputePassDescriptor)},e.prototype.setPipeline=function(e){var t=Ky(e.gpuComputePipeline);this.gpuComputePassEncoder.setPipeline(t)},e.prototype.setBindings=function(e){var t=this,n=e;n.gpuBindGroup.forEach(function(e,r){e&&t.gpuComputePassEncoder.setBindGroup(r,n.gpuBindGroup[r])})},e.prototype.pushDebugGroup=function(e){this.gpuComputePassEncoder.pushDebugGroup(e)},e.prototype.popDebugGroup=function(){this.gpuComputePassEncoder.popDebugGroup()},e.prototype.insertDebugMarker=function(e){this.gpuComputePassEncoder.insertDebugMarker(e)},e}(),bC=function(e){M(t,e);function t(t){var n=t.id,r=t.device,i=t.descriptor,a=e.call(this,{id:n,device:r})||this;a.type=V.ComputePipeline,a.gpuComputePipeline=null,a.descriptor=i;var o=i.program.computeStage;if(o===null)return a;var s={layout:`auto`,compute:pr({},o)};return a.gpuComputePipeline=a.device.device.createComputePipeline(s),a.name!==void 0&&(a.gpuComputePipeline.label=a.name),a}return t.prototype.getBindGroupLayout=function(e){return this.gpuComputePipeline.getBindGroupLayout(e)},t}(gC),xC=function(e){M(t,e);function t(t){var n,r,i,a,o=t.id,s=t.device,c=t.descriptor,l=e.call(this,{id:o,device:s})||this;l.type=V.InputLayout;var u=[];try{for(var d=lr(c.vertexBufferDescriptors),f=d.next();!f.done;f=d.next()){var p=f.value,m=p.arrayStride,h=p.stepMode,g=p.attributes;u.push({arrayStride:m,stepMode:rS(h),attributes:[]});try{for(var _=(i=void 0,lr(g)),v=_.next();!v.done;v=_.next()){var y=v.value,b=y.shaderLocation,x=y.format,S=y.offset;u[u.length-1].attributes.push({shaderLocation:b,format:iS(x),offset:S})}}catch(e){i={error:e}}finally{try{v&&!v.done&&(a=_.return)&&a.call(_)}finally{if(i)throw i.error}}}}catch(e){n={error:e}}finally{try{f&&!f.done&&(r=d.return)&&r.call(d)}finally{if(n)throw n.error}}return l.indexFormat=nS(c.indexBufferFormat),l.buffers=u,l}return t}(gC),SC=function(e){M(t,e);function t(t){var n=t.id,r=t.device,i=t.descriptor,a=e.call(this,{id:n,device:r})||this;return a.type=V.Program,a.vertexStage=null,a.fragmentStage=null,a.computeStage=null,a.descriptor=i,i.vertex&&(a.vertexStage=a.createShaderStage(i.vertex,`vertex`)),i.fragment&&(a.fragmentStage=a.createShaderStage(i.fragment,`fragment`)),i.compute&&(a.computeStage=a.createShaderStage(i.compute,`compute`)),a}return t.prototype.setUniformsLegacy=function(e){},t.prototype.createShaderStage=function(e,t){var n,r,i=e.glsl,a=e.wgsl,o=e.entryPoint,s=e.postprocess,c=!1,l=a;if(!l)try{l=this.device.glsl_compile(i,t,c)}catch(e){throw console.error(e,i),Error(`whoops`)}var u=function(e){if(!l.includes(e))return`continue`;l=l.replace(`var T_${e}: texture_2d<f32>;`,`var T_${e}: texture_depth_2d;`),l=l.replace(RegExp(`textureSample\\(T_${e}(.*)\\);$`,`gm`),function(t,n){return`vec4<f32>(textureSample(T_${e}${n}), 0.0, 0.0, 0.0);`})};try{for(var d=lr([`u_TextureFramebufferDepth`]),f=d.next();!f.done;f=d.next()){var p=f.value;u(p)}}catch(e){n={error:e}}finally{try{f&&!f.done&&(r=d.return)&&r.call(d)}finally{if(n)throw n.error}}return s&&(l=s(l)),{module:this.device.device.createShaderModule({code:l}),entryPoint:o||`main`}},t}(gC),CC=function(e){M(t,e);function t(t){var n=t.id,r=t.device,i=t.descriptor,a=e.call(this,{id:n,device:r})||this;a.type=V.QueryPool;var o=i.elemCount,s=i.type;return a.querySet=a.device.device.createQuerySet({type:Vx(s),count:o}),a.resolveBuffer=a.device.device.createBuffer({size:o*8,usage:GPUBufferUsage.QUERY_RESOLVE|GPUBufferUsage.COPY_SRC}),a.cpuBuffer=a.device.device.createBuffer({size:o*8,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ}),a.results=null,a}return t.prototype.queryResultOcclusion=function(e){return this.results===null?null:this.results[e]!==BigInt(0)},t.prototype.destroy=function(){e.prototype.destroy.call(this),this.querySet.destroy(),this.resolveBuffer.destroy(),this.cpuBuffer.destroy()},t}(gC),wC=function(e){M(t,e);function t(t){var n=t.id,r=t.device,i=e.call(this,{id:n,device:r})||this;return i.type=V.Readback,i}return t.prototype.readTexture=function(e,t,n,r,i,a,o,s){return o===void 0&&(o=0),ur(this,void 0,void 0,function(){var s,c,l,u,d,f,p,m;return cr(this,function(h){return s=e,c=0,l=lS(s.gpuTextureformat),u=Math.ceil(r/l.width)*l.length,d=Math.ceil(u/256)*256,f=d*i,p=this.device.createBuffer({usage:W.STORAGE|W.MAP_READ|W.COPY_DST,hint:_S.STATIC,viewOrSize:f}),m=this.device.device.createCommandEncoder(),m.copyTextureToBuffer({texture:s.gpuTexture,mipLevel:0,origin:{x:t,y:n,z:Math.max(c,0)}},{buffer:p.gpuBuffer,offset:0,bytesPerRow:d},{width:r,height:i,depthOrArrayLayers:1}),this.device.device.queue.submit([m.finish()]),[2,this.readBuffer(p,0,a.byteLength===f?a:null,o,f,s.format,!0,!1,u,d,i)]})})},t.prototype.readTextureSync=function(e,t,n,r,i,a,o,s){throw Error(`ERROR_MSG_METHOD_NOT_IMPLEMENTED`)},t.prototype.readBuffer=function(e,t,n,r,i,a,o,s,c,l,u){var d=this;t===void 0&&(t=0),n===void 0&&(n=null),i===void 0&&(i=0),a===void 0&&(a=X.U8_RGB),o===void 0&&(o=!1),c===void 0&&(c=0),l===void 0&&(l=0),u===void 0&&(u=0);var f=e,p=i||f.size,m=n||f.view,h=m&&m.constructor&&m.constructor.BYTES_PER_ELEMENT||Uy(a),g=f;if(!(f.usage&W.MAP_READ&&f.usage&W.COPY_DST)){var _=this.device.device.createCommandEncoder();g=this.device.createBuffer({usage:W.STORAGE|W.MAP_READ|W.COPY_DST,hint:_S.STATIC,viewOrSize:p}),_.copyBufferToBuffer(f.gpuBuffer,t,g.gpuBuffer,0,p),this.device.device.queue.submit([_.finish()])}return new Promise(function(e,n){g.gpuBuffer.mapAsync(hC.READ,t,p).then(function(){var n=g.gpuBuffer.getMappedRange(t,p),r=m;if(o)r=r===null?sS(a,p,!0,n):sS(a,r.buffer,void 0,n);else if(r===null)switch(h){case 1:r=new Uint8Array(p),r.set(new Uint8Array(n));break;case 2:r=d.getHalfFloatAsFloatRGBAArrayBuffer(p/2,n);break;case 4:r=new Float32Array(p/4),r.set(new Float32Array(n))}else switch(h){case 1:r=new Uint8Array(r.buffer),r.set(new Uint8Array(n));break;case 2:r=d.getHalfFloatAsFloatRGBAArrayBuffer(p/2,n,m);break;case 4:var i=m&&m.constructor||Float32Array;r=new i(r.buffer),r.set(new i(n))}if(c!==l){h===1&&!o&&(c*=2,l*=2);for(var s=new Uint8Array(r.buffer),f=c,_=0,v=1;v<u;++v){_=v*l;for(var y=0;y<c;++y)s[f++]=s[_++]}r=h!==0&&!o?new Float32Array(s.buffer,0,f/4):new Uint8Array(s.buffer,0,f)}g.gpuBuffer.unmap(),e(r)},function(e){return n(e)})})},t.prototype.getHalfFloatAsFloatRGBAArrayBuffer=function(e,t,n){n||=new Float32Array(e);for(var r=new Uint16Array(t);e--;)n[e]=cS(r[e]);return n},t}(gC),TC=function(){function e(e){this.device=e,this.gpuRenderPassEncoder=null,this.gfxColorAttachment=[],this.gfxColorAttachmentLevel=[],this.gfxColorResolveTo=[],this.gfxColorResolveToLevel=[],this.gfxDepthStencilAttachment=null,this.gfxDepthStencilResolveTo=null,this.gpuColorAttachments=[],this.gpuDepthStencilAttachment={view:null,depthLoadOp:`load`,depthStoreOp:`store`,stencilLoadOp:`load`,stencilStoreOp:`store`},this.gpuRenderPassDescriptor={colorAttachments:this.gpuColorAttachments,depthStencilAttachment:this.gpuDepthStencilAttachment}}return e.prototype.getEncoder=function(){return this.renderBundle?.renderBundleEncoder||this.gpuRenderPassEncoder},e.prototype.getTextureView=function(e,t){return L(t<e.mipLevelCount),e.mipLevelCount===1?e.gpuTextureView:e.gpuTexture.createView({baseMipLevel:t,mipLevelCount:1})},e.prototype.setRenderPassDescriptor=function(e){this.descriptor=e,this.gpuRenderPassDescriptor.colorAttachments=this.gpuColorAttachments;var t=e.colorAttachment.length;this.gfxColorAttachment.length=t,this.gfxColorResolveTo.length=t;for(var n=0;n<e.colorAttachment.length;n++){var r=e.colorAttachment[n],i=e.colorResolveTo[n];if(r===null&&i!==null&&(r=i,i=null),this.gfxColorAttachment[n]=r,this.gfxColorResolveTo[n]=i,this.gfxColorAttachmentLevel[n]=e.colorAttachmentLevel?.[n]||0,this.gfxColorResolveToLevel[n]=e.colorResolveToLevel?.[n]||0,r!==null){this.gpuColorAttachments[n]===void 0&&(this.gpuColorAttachments[n]={});var a=this.gpuColorAttachments[n];a.view=this.getTextureView(r,this.gfxColorAttachmentLevel?.[n]||0);var o=e.colorClearColor?.[n]??`load`;o===`load`?a.loadOp=`load`:(a.loadOp=`clear`,a.clearValue=o),a.storeOp=e.colorStore?.[n]?`store`:`discard`,a.resolveTarget=void 0,i!==null&&(r.sampleCount>1?a.resolveTarget=this.getTextureView(i,this.gfxColorResolveToLevel[n]):a.storeOp=`store`)}else{this.gpuColorAttachments.length=n,this.gfxColorAttachment.length=n,this.gfxColorResolveTo.length=n;break}}if(this.gfxDepthStencilAttachment=e.depthStencilAttachment,this.gfxDepthStencilResolveTo=e.depthStencilResolveTo,e.depthStencilAttachment){var s=e.depthStencilAttachment,a=this.gpuDepthStencilAttachment;a.view=s.gpuTextureView,Vy(s.format)&Y.Depth?(e.depthClearValue===`load`?a.depthLoadOp=`load`:(a.depthLoadOp=`clear`,a.depthClearValue=e.depthClearValue),a.depthStoreOp=e.depthStencilStore||this.gfxDepthStencilResolveTo!==null?`store`:`discard`):(a.depthLoadOp=void 0,a.depthStoreOp=void 0),Vy(s.format)&Y.Stencil?(e.stencilClearValue===`load`?a.stencilLoadOp=`load`:(a.stencilLoadOp=`clear`,a.stencilClearValue=e.stencilClearValue),a.stencilStoreOp=e.depthStencilStore||this.gfxDepthStencilResolveTo!==null?`store`:`discard`):(a.stencilLoadOp=void 0,a.stencilStoreOp=void 0),this.gpuRenderPassDescriptor.depthStencilAttachment=this.gpuDepthStencilAttachment}else this.gpuRenderPassDescriptor.depthStencilAttachment=void 0;this.gpuRenderPassDescriptor.occlusionQuerySet=ey(e.occlusionQueryPool)?void 0:Bx(e.occlusionQueryPool)},e.prototype.beginRenderPass=function(e,t){L(this.gpuRenderPassEncoder===null),this.setRenderPassDescriptor(t),this.frameCommandEncoder=e,this.gpuRenderPassEncoder=this.frameCommandEncoder.beginRenderPass(this.gpuRenderPassDescriptor)},e.prototype.flipY=function(e,t){return this.device.swapChainHeight-e-t},e.prototype.setViewport=function(e,t,n,r,i,a){i===void 0&&(i=0),a===void 0&&(a=1),this.gpuRenderPassEncoder.setViewport(e,this.flipY(t,r),n,r,i,a)},e.prototype.setScissorRect=function(e,t,n,r){this.gpuRenderPassEncoder.setScissorRect(e,this.flipY(t,r),n,r)},e.prototype.setPipeline=function(e){var t=Ky(e.gpuRenderPipeline);this.getEncoder().setPipeline(t)},e.prototype.setVertexInput=function(e,t,n){if(e!==null){var r=this.getEncoder(),i=e;n!==null&&r.setIndexBuffer(Rx(n.buffer),Ky(i.indexFormat),n.offset);for(var a=0;a<t.length;a++){var o=t[a];o!==null&&r.setVertexBuffer(a,Rx(o.buffer),o.offset)}}},e.prototype.setBindings=function(e){var t=e,n=this.getEncoder();t.gpuBindGroup.forEach(function(e,r){e&&n.setBindGroup(r,t.gpuBindGroup[r])})},e.prototype.setStencilReference=function(e){this.gpuRenderPassEncoder.setStencilReference(e)},e.prototype.draw=function(e,t,n,r){this.getEncoder().draw(e,t,n,r)},e.prototype.drawIndexed=function(e,t,n,r,i){this.getEncoder().drawIndexed(e,t,n,r,i)},e.prototype.drawIndirect=function(e,t){this.getEncoder().drawIndirect(Rx(e),t)},e.prototype.drawIndexedIndirect=function(e,t){this.getEncoder().drawIndexedIndirect(Rx(e),t)},e.prototype.beginOcclusionQuery=function(e){this.gpuRenderPassEncoder.beginOcclusionQuery(e)},e.prototype.endOcclusionQuery=function(){this.gpuRenderPassEncoder.endOcclusionQuery()},e.prototype.pushDebugGroup=function(e){this.gpuRenderPassEncoder.pushDebugGroup(e)},e.prototype.popDebugGroup=function(){this.gpuRenderPassEncoder.popDebugGroup()},e.prototype.insertDebugMarker=function(e){this.gpuRenderPassEncoder.insertDebugMarker(e)},e.prototype.beginBundle=function(e){this.renderBundle=e},e.prototype.endBundle=function(){this.renderBundle.finish()},e.prototype.executeBundles=function(e){this.gpuRenderPassEncoder.executeBundles(e.map(function(e){return e.renderBundle}))},e.prototype.finish=function(){var e;(e=this.gpuRenderPassEncoder)==null||e.end(),this.gpuRenderPassEncoder=null;for(var t=0;t<this.gfxColorAttachment.length;t++){var n=this.gfxColorAttachment[t],r=this.gfxColorResolveTo[t];n!==null&&r!==null&&n.sampleCount===1&&this.copyAttachment(r,this.gfxColorAttachmentLevel[t],n,this.gfxColorResolveToLevel[t])}this.gfxDepthStencilAttachment&&this.gfxDepthStencilResolveTo&&(this.gfxDepthStencilAttachment.sampleCount>1||this.copyAttachment(this.gfxDepthStencilResolveTo,0,this.gfxDepthStencilAttachment,0)),this.frameCommandEncoder=null},e.prototype.copyAttachment=function(e,t,n,r){L(n.sampleCount===1);var i={texture:n.gpuTexture,mipLevel:r},a={texture:e.gpuTexture,mipLevel:t};L(n.width>>>r==e.width>>>t),L(n.height>>>r==e.height>>>t),L(!!(n.usage&mC.COPY_SRC)),L(!!(e.usage&mC.COPY_DST)),this.frameCommandEncoder.copyTextureToTexture(i,a,[e.width,e.height,1])},e}(),EC=function(e){M(t,e);function t(t){var n=t.id,r=t.device,i=t.descriptor,a=e.call(this,{id:n,device:r})||this;return a.type=V.RenderPipeline,a.isCreatingAsync=!1,a.gpuRenderPipeline=null,a.descriptor=i,a.device.createRenderPipelineInternal(a,!1),a}return t.prototype.getBindGroupLayout=function(e){return this.gpuRenderPipeline.getBindGroupLayout(e)},t}(gC),DC=function(e){M(t,e);function t(t){var n=t.id,r=t.device,i=t.descriptor,a=e.call(this,{id:n,device:r})||this;a.type=V.Sampler;var o=i.lodMinClamp,s=i.mipmapFilter===hS.NO_MIP?i.lodMinClamp:i.lodMaxClamp,c=i.maxAnisotropy??1;return c>1&&L(i.minFilter===mS.BILINEAR&&i.magFilter===mS.BILINEAR&&i.mipmapFilter===hS.LINEAR),a.gpuSampler=a.device.device.createSampler({addressModeU:Fx(i.addressModeU),addressModeV:Fx(i.addressModeV),addressModeW:Fx(i.addressModeW??i.addressModeU),lodMinClamp:o,lodMaxClamp:s,minFilter:Ix(i.minFilter),magFilter:Ix(i.magFilter),mipmapFilter:Lx(i.mipmapFilter),compare:i.compareFunction===void 0?void 0:$x(i.compareFunction),maxAnisotropy:c}),a}return t}(gC),OC=function(e){M(t,e);function t(t){var n=t.id,r=t.device,i=t.descriptor,a=t.skipCreate,o=t.sampleCount,s=e.call(this,{id:n,device:r})||this;s.type=V.Texture,s.flipY=!1;var c=i.format,l=i.dimension,u=i.width,d=i.height,f=i.depthOrArrayLayers,p=i.mipLevelCount,m=i.usage;return s.flipY=!!i.pixelStore?.unpackFlipY,s.device.createTextureShared({format:c,dimension:l??G.TEXTURE_2D,width:u,height:d,depthOrArrayLayers:f??1,mipLevelCount:p??1,usage:m,sampleCount:o??1},s,a),s}return t.prototype.textureFromImageBitmapOrCanvas=function(e,t,n){for(var r=t[0].width,i=t[0].height,a={size:{width:r,height:i,depthOrArrayLayers:n},format:`rgba8unorm`,usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST|GPUTextureUsage.RENDER_ATTACHMENT},o=e.createTexture(a),s=0;s<t.length;s++)e.queue.copyExternalImageToTexture({source:t[s],flipY:this.flipY},{texture:o,origin:[0,0,s]},[r,i]);return[o,r,i]},t.prototype.isImageBitmapOrCanvases=function(e){var t=e[0];return t instanceof ImageBitmap||t instanceof HTMLCanvasElement||t instanceof OffscreenCanvas},t.prototype.isVideo=function(e){return e[0]instanceof HTMLVideoElement},t.prototype.setImageData=function(e,t){var n,r=this,i=this.device.device,a,o,s;if(this.isImageBitmapOrCanvases(e))n=sr(this.textureFromImageBitmapOrCanvas(i,e,this.depthOrArrayLayers),3),a=n[0],o=n[1],s=n[2];else if(this.isVideo(e))a=i.importExternalTexture({source:e[0]});else{var c=lS(this.gpuTextureformat),l=Math.ceil(this.width/c.width)*c.length;e.forEach(function(e){i.queue.writeTexture({texture:r.gpuTexture},e,{bytesPerRow:l},{width:r.width,height:r.height})})}this.width=o,this.height=s,a&&(this.gpuTexture=a),this.gpuTextureView=this.gpuTexture.createView({dimension:Nx(this.dimension)})},t.prototype.destroy=function(){e.prototype.destroy.call(this),this.gpuTexture.destroy()},t}(gC),kC=function(e){M(t,e);function t(t){var n=t.id,r=t.device,i=e.call(this,{id:n,device:r})||this;return i.type=V.RenderBundle,i.renderBundleEncoder=i.device.device.createRenderBundleEncoder({colorFormats:[i.device.swapChainFormat]}),i}return t.prototype.finish=function(){this.renderBundle=this.renderBundleEncoder.finish()},t}(gC),AC=function(){function e(e,t,n,r,i,a){this.swapChainWidth=0,this.swapChainHeight=0,this.swapChainTextureUsage=mC.RENDER_ATTACHMENT|mC.COPY_DST,this._resourceUniqueId=0,this.renderPassPool=[],this.computePassPool=[],this.frameCommandEncoderPool=[],this.featureTextureCompressionBC=!1,this.platformString=`WebGPU`,this.glslVersion=`#version 440`,this.explicitBindingLocations=!0,this.separateSamplerTextures=!0,this.viewportOrigin=CS.UPPER_LEFT,this.clipSpaceNearZ=wS.ZERO,this.supportsSyncPipelineCompilation=!1,this.supportMRT=!0,this.device=t,this.canvas=n,this.canvasContext=r,this.glsl_compile=i,this.WGSLComposer=a,this.fallbackTexture2D=this.createFallbackTexture(G.TEXTURE_2D,SS.Float),this.setResourceName(this.fallbackTexture2D,`Fallback Texture2D`),this.fallbackTexture2DDepth=this.createFallbackTexture(G.TEXTURE_2D,SS.Depth),this.setResourceName(this.fallbackTexture2DDepth,`Fallback Depth Texture2D`),this.fallbackTexture2DArray=this.createFallbackTexture(G.TEXTURE_2D_ARRAY,SS.Float),this.setResourceName(this.fallbackTexture2DArray,`Fallback Texture2DArray`),this.fallbackTexture3D=this.createFallbackTexture(G.TEXTURE_3D,SS.Float),this.setResourceName(this.fallbackTexture3D,`Fallback Texture3D`),this.fallbackTextureCube=this.createFallbackTexture(G.TEXTURE_CUBE_MAP,SS.Float),this.setResourceName(this.fallbackTextureCube,`Fallback TextureCube`),this.fallbackSamplerFiltering=this.createSampler({addressModeU:pS.REPEAT,addressModeV:pS.REPEAT,minFilter:mS.POINT,magFilter:mS.POINT,mipmapFilter:hS.NEAREST}),this.setResourceName(this.fallbackSamplerFiltering,`Fallback Sampler Filtering`),this.fallbackSamplerComparison=this.createSampler({addressModeU:pS.REPEAT,addressModeV:pS.REPEAT,minFilter:mS.POINT,magFilter:mS.POINT,mipmapFilter:hS.NEAREST,compareFunction:H.ALWAYS}),this.setResourceName(this.fallbackSamplerComparison,`Fallback Sampler Comparison Filtering`),this.device.features&&(this.featureTextureCompressionBC=this.device.features.has(`texture-compression-bc`)),this.device.onuncapturederror=function(e){console.error(e.error)},this.swapChainFormat=navigator.gpu.getPreferredCanvasFormat(),this.canvasContext.configure({device:this.device,format:this.swapChainFormat,usage:this.swapChainTextureUsage,alphaMode:`premultiplied`})}return e.prototype.destroy=function(){},e.prototype.configureSwapChain=function(e,t){(this.swapChainWidth!==e||this.swapChainHeight!==t)&&(this.swapChainWidth=e,this.swapChainHeight=t)},e.prototype.getOnscreenTexture=function(){var e=this.canvasContext.getCurrentTexture(),t=e.createView(),n=new OC({id:0,device:this,descriptor:{format:X.U8_RGBA_RT,width:this.swapChainWidth,height:this.swapChainHeight,depthOrArrayLayers:0,dimension:G.TEXTURE_2D,mipLevelCount:1,usage:this.swapChainTextureUsage},skipCreate:!0});return n.depthOrArrayLayers=1,n.sampleCount=1,n.gpuTexture=e,n.gpuTextureView=t,n.name=`Onscreen`,this.setResourceName(n,`Onscreen Texture`),n},e.prototype.getDevice=function(){return this},e.prototype.getCanvas=function(){return this.canvas},e.prototype.beginFrame=function(){L(this.frameCommandEncoderPool.length===0)},e.prototype.endFrame=function(){L(this.frameCommandEncoderPool.every(function(e){return e!==null})),this.device.queue.submit(this.frameCommandEncoderPool.map(function(e){return e.finish()})),this.frameCommandEncoderPool=[]},e.prototype.getNextUniqueId=function(){return++this._resourceUniqueId},e.prototype.createBuffer=function(e){return new vC({id:this.getNextUniqueId(),device:this,descriptor:e})},e.prototype.createTexture=function(e){return new OC({id:this.getNextUniqueId(),device:this,descriptor:e})},e.prototype.createSampler=function(e){return new DC({id:this.getNextUniqueId(),device:this,descriptor:e})},e.prototype.createRenderTarget=function(e){var t=new OC({id:this.getNextUniqueId(),device:this,descriptor:pr(pr({},e),{dimension:G.TEXTURE_2D,mipLevelCount:1,depthOrArrayLayers:1,usage:bS.RENDER_TARGET}),sampleCount:e.sampleCount});return t.depthOrArrayLayers=1,t.type=V.RenderTarget,t},e.prototype.createRenderTargetFromTexture=function(e){var t=e,n=t.format,r=t.width,i=t.height,a=t.depthOrArrayLayers,o=t.sampleCount,s=t.mipLevelCount,c=t.gpuTexture,l=t.gpuTextureView,u=t.usage;L(!!(u&mC.RENDER_ATTACHMENT));var d=new OC({id:this.getNextUniqueId(),device:this,descriptor:{format:n,width:r,height:i,depthOrArrayLayers:a,dimension:G.TEXTURE_2D,mipLevelCount:s,usage:u},skipCreate:!0});return d.depthOrArrayLayers=a,d.sampleCount=o,d.gpuTexture=c,d.gpuTextureView=l,d},e.prototype.createProgram=function(e){return e.vertex?.glsl&&(e.vertex.glsl=Xb(this.queryVendorInfo(),`vert`,e.vertex.glsl)),e.fragment?.glsl&&(e.fragment.glsl=Xb(this.queryVendorInfo(),`frag`,e.fragment.glsl)),new SC({id:this.getNextUniqueId(),device:this,descriptor:e})},e.prototype.createProgramSimple=function(e){return new SC({id:this.getNextUniqueId(),device:this,descriptor:e})},e.prototype.createTextureShared=function(e,t,n){var r={width:e.width,height:e.height,depthOrArrayLayers:e.depthOrArrayLayers},i=e.mipLevelCount,a=jx(e.format),o=Mx(e.dimension),s=Ax(e.usage);if(t.gpuTextureformat=a,t.dimension=e.dimension,t.format=e.format,t.width=e.width,t.height=e.height,t.depthOrArrayLayers=e.depthOrArrayLayers,t.mipLevelCount=i,t.usage=s,t.sampleCount=e.sampleCount,!n){var c=this.device.createTexture({size:r,mipLevelCount:i,format:a,dimension:o,sampleCount:e.sampleCount,usage:s}),l=c.createView();t.gpuTexture=c,t.gpuTextureView=l}},e.prototype.getFallbackSampler=function(e){return e.formatKind===SS.Depth&&e.comparison?this.fallbackSamplerComparison:this.fallbackSamplerFiltering},e.prototype.getFallbackTexture=function(e){var t=e.dimension,n=e.formatKind;if(t===G.TEXTURE_2D)return n===SS.Depth?this.fallbackTexture2DDepth:this.fallbackTexture2D;if(t===G.TEXTURE_2D_ARRAY)return this.fallbackTexture2DArray;if(t===G.TEXTURE_3D)return this.fallbackTexture3D;if(t===G.TEXTURE_CUBE_MAP)return this.fallbackTextureCube;throw Error(`whoops`)},e.prototype.createFallbackTexture=function(e,t){var n=e===G.TEXTURE_CUBE_MAP?6:1,r=t===SS.Float?X.U8_RGBA_NORM:X.D24;return this.createTexture({dimension:e,format:r,usage:bS.SAMPLED,width:1,height:1,depthOrArrayLayers:n,mipLevelCount:1})},e.prototype.createBindings=function(e){return new _C({id:this.getNextUniqueId(),device:this,descriptor:e})},e.prototype.createInputLayout=function(e){return new xC({id:this.getNextUniqueId(),device:this,descriptor:e})},e.prototype.createComputePipeline=function(e){return new bC({id:this.getNextUniqueId(),device:this,descriptor:e})},e.prototype.createRenderPipeline=function(e){return new EC({id:this.getNextUniqueId(),device:this,descriptor:pr({},e)})},e.prototype.createQueryPool=function(e,t){return new CC({id:this.getNextUniqueId(),device:this,descriptor:{type:e,elemCount:t}})},e.prototype.createRenderPipelineInternal=function(e,t){if(e.gpuRenderPipeline===null){var n=e.descriptor,r=n.program,i=r.vertexStage,a=r.fragmentStage;if(i!==null&&a!==null){var o=n.megaStateDescriptor||{},s=o.stencilBack,c=o.stencilFront,l=dr(o,[`stencilBack`,`stencilFront`]),u=lb(kS);n.megaStateDescriptor=pr(pr(pr({},u),{stencilBack:pr(pr({},u.stencilBack),s),stencilFront:pr(pr({},u.stencilFront),c)}),l);var d=n.megaStateDescriptor.attachmentsState[0];n.colorAttachmentFormats.forEach(function(e,t){n.megaStateDescriptor.attachmentsState[t]||(n.megaStateDescriptor.attachmentsState[t]=ob(void 0,d))});var f=Gx(n.topology??gS.TRIANGLES,n.megaStateDescriptor),p=Qx(n.colorAttachmentFormats,n.megaStateDescriptor),m=tS(n.depthStencilAttachmentFormat,n.megaStateDescriptor),h=void 0;n.inputLayout!==null&&(h=n.inputLayout.buffers);var g=n.sampleCount,_={layout:`auto`,vertex:pr(pr({},i),{buffers:h}),primitive:f,depthStencil:m,multisample:{count:g},fragment:pr(pr({},a),{targets:p})};e.gpuRenderPipeline=this.device.createRenderPipeline(_)}}},e.prototype.createReadback=function(){return new wC({id:this.getNextUniqueId(),device:this})},e.prototype.createRenderBundle=function(){return new kC({id:this.getNextUniqueId(),device:this})},e.prototype.createRenderPass=function(e){var t=this.renderPassPool.pop();t===void 0&&(t=new TC(this));var n=this.frameCommandEncoderPool.pop();return n===void 0&&(n=this.device.createCommandEncoder()),t.beginRenderPass(n,e),t},e.prototype.createComputePass=function(){var e=this.computePassPool.pop();e===void 0&&(e=new yC);var t=this.frameCommandEncoderPool.pop();return t===void 0&&(t=this.device.createCommandEncoder()),e.beginComputePass(t),e},e.prototype.submitPass=function(e){var t=e;t instanceof TC?(this.frameCommandEncoderPool.push(t.frameCommandEncoder),t.finish(),this.renderPassPool.push(t)):t instanceof yC&&(this.frameCommandEncoderPool.push(t.frameCommandEncoder),t.finish(),this.computePassPool.push(t))},e.prototype.copySubTexture2D=function(e,t,n,r,i,a,o){var s=this.device.createCommandEncoder(),c=e,l=r,u={texture:l.gpuTexture,origin:[i,a,0],mipLevel:0,aspect:`all`},d={texture:c.gpuTexture,origin:[t,n,0],mipLevel:0,aspect:`all`};L(!!(l.usage&mC.COPY_SRC)),L(!!(c.usage&mC.COPY_DST)),s.copyTextureToTexture(u,d,[l.width,l.height,o||1]),this.device.queue.submit([s.finish()])},e.prototype.queryLimits=function(){return{uniformBufferMaxPageWordSize:this.device.limits.maxUniformBufferBindingSize>>>2,uniformBufferWordAlignment:this.device.limits.minUniformBufferOffsetAlignment>>>2,supportedSampleCounts:[1],occlusionQueriesRecommended:!0,computeShadersSupported:!0}},e.prototype.queryTextureFormatSupported=function(e,t,n){if(aS(e)){if(!this.featureTextureCompressionBC)return!1;var r=oS(e);return t%r!==0||n%r!==0?!1:this.featureTextureCompressionBC}switch(e){case X.U16_RGBA_NORM:return!1;case X.F32_RGBA:return!1}return!0},e.prototype.queryPlatformAvailable=function(){return!0},e.prototype.queryVendorInfo=function(){return this},e.prototype.queryRenderPass=function(e){return e.descriptor},e.prototype.queryRenderTarget=function(e){return e},e.prototype.setResourceName=function(e,t){if(e.name=t,e.type===V.Buffer){var n=e;n.gpuBuffer.label=t}else if(e.type===V.Texture){var n=e;n.gpuTexture.label=t,n.gpuTextureView.label=t}else if(e.type===V.RenderTarget){var n=e;n.gpuTexture.label=t,n.gpuTextureView.label=t}else if(e.type===V.Sampler){var n=e;n.gpuSampler.label=t}else if(e.type===V.RenderPipeline){var n=e;n.gpuRenderPipeline!==null&&(n.gpuRenderPipeline.label=t)}},e.prototype.setResourceLeakCheck=function(e,t){},e.prototype.checkForLeaks=function(){},e.prototype.programPatched=function(e){},e.prototype.pipelineQueryReady=function(e){return e.gpuRenderPipeline!==null},e.prototype.pipelineForceReady=function(e){var t=e;this.createRenderPipelineInternal(t,!1)},e}(),jC=function(){function e(e){this.pluginOptions=e}return e.prototype.createSwapChain=function(e){return ur(this,void 0,void 0,function(){var t,n,r,i,a,o,s,c;return cr(this,function(l){switch(l.label){case 0:if(globalThis.navigator.gpu===void 0)return[2,null];t=null,l.label=1;case 1:return l.trys.push([1,3,,4]),n=this.pluginOptions.xrCompatible,[4,globalThis.navigator.gpu.requestAdapter({xrCompatible:n})];case 2:return t=l.sent(),[3,4];case 3:return r=l.sent(),console.log(r),[3,4];case 4:return t===null?[2,null]:(i=[`depth32float-stencil8`,`texture-compression-bc`,`float32-filterable`],a=i.filter(function(e){return t.features.has(e)}),[4,t.requestDevice({requiredFeatures:a})]);case 5:if(o=l.sent(),o&&(s=this.pluginOptions.onContextLost,o.lost.then(function(){s&&s()})),o===null||(c=e.getContext(`webgpu`),!c))return[2,null];l.label=6;case 6:return l.trys.push([6,8,,9]),[4,kx(this.pluginOptions.shaderCompilerPath)];case 7:return l.sent(),[3,9];case 8:return l.sent(),[3,9];case 9:return[2,new AC(t,o,e,c,Tx,pC&&new pC)]}})})},e}()})),NC,PC=t((()=>{NC=class{constructor(e,t){let{buffer:n,offset:r,stride:i,normalized:a,size:o,divisor:s,shaderLocation:c}=t;this.buffer=n,this.attribute={shaderLocation:c,buffer:n.get(),offset:r||0,stride:i||0,normalized:a||!1,divisor:s||0},o&&(this.attribute.size=o)}get(){return this.buffer}updateBuffer(e){this.buffer.subData(e)}destroy(){this.buffer.destroy()}}})),FC,IC,LC,RC,zC,BC,VC,HC,UC,WC,GC,KC=t((()=>{MC(),E(),FC={[m.FLOAT]:Float32Array,[m.UNSIGNED_BYTE]:Uint8Array,[m.SHORT]:Int16Array,[m.UNSIGNED_SHORT]:Uint16Array,[m.INT]:Int32Array,[m.UNSIGNED_INT]:Uint32Array},IC={[m.POINTS]:gS.POINTS,[m.LINES]:gS.LINES,[m.LINE_LOOP]:gS.LINES,[m.LINE_STRIP]:gS.LINE_STRIP,[m.TRIANGLES]:gS.TRIANGLES,[m.TRIANGLE_FAN]:gS.TRIANGLES,[m.TRIANGLE_STRIP]:gS.TRIANGLE_STRIP},LC={1:X.F32_R,2:X.F32_RG,3:X.F32_RGB,4:X.F32_RGBA},RC={[m.STATIC_DRAW]:_S.STATIC,[m.DYNAMIC_DRAW]:_S.DYNAMIC,[m.STREAM_DRAW]:_S.DYNAMIC},zC={[m.REPEAT]:pS.REPEAT,[m.CLAMP_TO_EDGE]:pS.CLAMP_TO_EDGE,[m.MIRRORED_REPEAT]:pS.MIRRORED_REPEAT},BC={[m.NEVER]:H.NEVER,[m.ALWAYS]:H.ALWAYS,[m.LESS]:H.LESS,[m.LEQUAL]:H.LEQUAL,[m.GREATER]:H.GREATER,[m.GEQUAL]:H.GEQUAL,[m.EQUAL]:H.EQUAL,[m.NOTEQUAL]:H.NOTEQUAL},VC={[m.FRONT]:dS.FRONT,[m.BACK]:dS.BACK},HC={[m.FUNC_ADD]:fS.ADD,[m.MIN_EXT]:fS.MIN,[m.MAX_EXT]:fS.MAX,[m.FUNC_SUBTRACT]:fS.SUBSTRACT,[m.FUNC_REVERSE_SUBTRACT]:fS.REVERSE_SUBSTRACT},UC={[m.ZERO]:U.ZERO,[m.ONE]:U.ONE,[m.SRC_COLOR]:U.SRC,[m.ONE_MINUS_SRC_COLOR]:U.ONE_MINUS_SRC,[m.SRC_ALPHA]:U.SRC_ALPHA,[m.ONE_MINUS_SRC_ALPHA]:U.ONE_MINUS_SRC_ALPHA,[m.DST_COLOR]:U.DST,[m.ONE_MINUS_DST_COLOR]:U.ONE_MINUS_DST,[m.DST_ALPHA]:U.DST_ALPHA,[m.ONE_MINUS_DST_ALPHA]:U.ONE_MINUS_DST_ALPHA,[m.CONSTANT_COLOR]:U.CONST,[m.ONE_MINUS_CONSTANT_COLOR]:U.ONE_MINUS_CONSTANT,[m.CONSTANT_ALPHA]:U.CONST,[m.ONE_MINUS_CONSTANT_ALPHA]:U.ONE_MINUS_CONSTANT,[m.SRC_ALPHA_SATURATE]:U.SRC_ALPHA_SATURATE},WC={[m.REPLACE]:K.REPLACE,[m.KEEP]:K.KEEP,[m.ZERO]:K.ZERO,[m.INVERT]:K.INVERT,[m.INCR]:K.INCREMENT_CLAMP,[m.DECR]:K.DECREMENT_CLAMP,[m.INCR_WRAP]:K.INCREMENT_WRAP,[m.DECR_WRAP]:K.DECREMENT_WRAP},GC={[m.ALWAYS]:H.ALWAYS,[m.EQUAL]:H.EQUAL,[m.GEQUAL]:H.GEQUAL,[m.GREATER]:H.GREATER,[m.LEQUAL]:H.LEQUAL,[m.LESS]:H.LESS,[m.NEVER]:H.NEVER,[m.NOTEQUAL]:H.NOTEQUAL}}));function qC(e){return Object.prototype.toString.call(e)in YC}function JC(e,t){let n=e.length,r=n+Math.ceil(n/3),i=new Float32Array(r);for(let n=0;n<r;n+=4)i[n]=e[n/4*3],i[n+1]=e[n/4*3+1],i[n+2]=e[n/4*3+2],i[n+3]=t;return i}var YC,XC=t((()=>{YC={"[object Int8Array]":5120,"[object Int16Array]":5122,"[object Int32Array]":5124,"[object Uint8Array]":5121,"[object Uint8ClampedArray]":5121,"[object Uint16Array]":5123,"[object Uint32Array]":5125,"[object Float32Array]":5126,"[object Float64Array]":5121,"[object ArrayBuffer]":5121}})),ZC,QC=t((()=>{MC(),E(),KC(),XC(),ZC=class{constructor(e,t){this.isDestroyed=!1;let{data:n,usage:r,type:i,isUBO:a,label:o}=t,s;s=qC(n)?n:new FC[this.type||m.FLOAT](n),this.type=i,this.size=s.byteLength,this.buffer=e.createBuffer({viewOrSize:s,usage:a?W.UNIFORM:W.VERTEX,hint:RC[r||m.STATIC_DRAW]}),o&&e.setResourceName(this.buffer,o)}get(){return this.buffer}destroy(){this.isDestroyed||this.buffer.destroy(),this.isDestroyed=!0}subData({data:e,offset:t}){let n;n=qC(e)?e:new FC[this.type||m.FLOAT](e),this.buffer.setSubData(t,new Uint8Array(n.buffer))}}}));function $(e,t=0){return e+=t,e+=e<<10,e+=e>>>6,e>>>0}function $C(e){return e+=e<<3,e^=e>>>11,e+=e<<15,e>>>0}function ew(){return 0}var tw,nw,rw=t((()=>{tw=class{constructor(){this.keys=[],this.values=[]}},nw=class{constructor(e,t){this.keyEqualFunc=e,this.keyHashFunc=t,this.buckets=new Map}findBucketIndex(e,t){for(let n=0;n<e.keys.length;n++)if(this.keyEqualFunc(t,e.keys[n]))return n;return-1}findBucket(e){let t=this.keyHashFunc(e);return this.buckets.get(t)}get(e){let t=this.findBucket(e);if(t===void 0)return null;let n=this.findBucketIndex(t,e);return n<0?null:t.values[n]}add(e,t){let n=this.keyHashFunc(e);this.buckets.get(n)===void 0&&this.buckets.set(n,new tw);let r=this.buckets.get(n);r.keys.push(e),r.values.push(t)}delete(e){let t=this.findBucket(e);if(t===void 0)return;let n=this.findBucketIndex(t,e);n!==-1&&(t.keys.splice(n,1),t.values.splice(n,1))}clear(){this.buckets.clear()}size(){let e=0;for(let t of this.buckets.values())e+=t.values.length;return e}*values(){for(let e of this.buckets.values())for(let t=e.values.length-1;t>=0;t--)yield e.values[t]}}}));function iw(e,t){return e=$(e,t.blendMode),e=$(e,t.blendSrcFactor),e=$(e,t.blendDstFactor),e}function aw(e,t){return e=iw(e,t.rgbBlendState),e=iw(e,t.alphaBlendState),e=$(e,t.channelWriteMask),e}function ow(e,t){return e=$(e,t.r<<24|t.g<<16|t.b<<8|t.a),e}function sw(e,t){for(let n=0;n<t.attachmentsState.length;n++)e=aw(e,t.attachmentsState[n]);return e=ow(e,t.blendConstant||ES),e=$(e,t.depthCompare),e=$(e,+!!t.depthWrite),e=$(e,t.stencilFront?.compare),e=$(e,t.stencilFront?.passOp),e=$(e,t.stencilFront?.failOp),e=$(e,t.stencilFront?.depthFailOp),e=$(e,t.stencilBack?.compare),e=$(e,t.stencilBack?.passOp),e=$(e,t.stencilBack?.failOp),e=$(e,t.stencilBack?.depthFailOp),e=$(e,+!!t.stencilWrite),e=$(e,t.cullMode),e=$(e,+!!t.frontFace),e=$(e,+!!t.polygonOffset),e}function cw(e){let t=0;t=$(t,e.program.id),e.inputLayout!==null&&(t=$(t,e.inputLayout.id)),t=sw(t,e.megaStateDescriptor);for(let n=0;n<e.colorAttachmentFormats.length;n++)t=$(t,e.colorAttachmentFormats[n]||0);return t=$(t,e.depthStencilAttachmentFormat||0),$C(t)}function lw(e){let t=0;if(e.samplerBindings)for(let n=0;n<e.samplerBindings.length;n++){let r=e.samplerBindings[n];r!==null&&r.texture!==null&&(t=$(t,r.texture.id))}if(e.uniformBufferBindings)for(let n=0;n<e.uniformBufferBindings.length;n++){let r=e.uniformBufferBindings[n];r!==null&&r.buffer!==null&&(t=$(t,r.buffer.id),t=$(t,r.binding),t=$(t,r.offset),t=$(t,r.size))}if(e.storageBufferBindings)for(let n=0;n<e.storageBufferBindings.length;n++){let r=e.storageBufferBindings[n];r!==null&&r.buffer!==null&&(t=$(t,r.buffer.id),t=$(t,r.binding),t=$(t,r.offset),t=$(t,r.size))}if(e.storageTextureBindings)for(let n=0;n<e.storageTextureBindings.length;n++){let r=e.storageTextureBindings[n];r!==null&&r.texture!==null&&(t=$(t,r.texture.id),t=$(t,r.binding))}return $C(t)}function uw(e,t){return e.vertex?.glsl===t.vertex?.glsl&&e.fragment?.glsl===t.fragment?.glsl}function dw(e){return{vertex:{glsl:e.vertex?.glsl},fragment:{glsl:e.fragment?.glsl}}}var fw,pw=t((()=>{MC(),rw(),fw=class{constructor(e){this.device=e,this.bindingsCache=new nw(gb,lw),this.renderPipelinesCache=new nw(Cb,cw),this.inputLayoutsCache=new nw(Eb,ew),this.programCache=new nw(uw,ew)}createBindings(e){let t=this.bindingsCache.get(e);if(t===null){let n=Ab(e);n.uniformBufferBindings=n.uniformBufferBindings?.filter(({size:e})=>e&&e>0),t=this.device.createBindings(n),this.bindingsCache.add(n,t)}return t}createRenderPipeline(e){let t=this.renderPipelinesCache.get(e);if(t===null){let n=jb(e);n.colorAttachmentFormats=n.colorAttachmentFormats.filter(e=>e),t=this.device.createRenderPipeline(n),this.renderPipelinesCache.add(n,t)}return t}createInputLayout(e){e.vertexBufferDescriptors=e.vertexBufferDescriptors.filter(e=>!!e);let t=this.inputLayoutsCache.get(e);if(t===null){let n=Pb(e);t=this.device.createInputLayout(n),this.inputLayoutsCache.add(n,t)}return t}createProgram(e){let t=this.programCache.get(e);if(t===null){let n=dw(e);t=this.device.createProgram(e),this.programCache.add(n,t)}return t}destroy(){for(let e of this.bindingsCache.values())e.destroy();for(let e of this.renderPipelinesCache.values())e.destroy();for(let e of this.inputLayoutsCache.values())e.destroy();for(let e of this.programCache.values())e.destroy();this.bindingsCache.clear(),this.renderPipelinesCache.clear(),this.inputLayoutsCache.clear(),this.programCache.clear()}}})),mw,hw=t((()=>{MC(),E(),KC(),XC(),mw=class{constructor(e,t){let{data:n,type:r,count:i=0}=t,a;a=qC(n)?n:new FC[this.type||m.UNSIGNED_INT](n),this.type=r,this.count=i,this.indexBuffer=e.createBuffer({viewOrSize:a,usage:W.INDEX})}get(){return this.indexBuffer}subData({data:e}){let t;t=qC(e)?e:new FC[this.type||m.UNSIGNED_INT](e),this.indexBuffer.setSubData(0,new Uint8Array(t.buffer))}destroy(){this.indexBuffer.destroy()}}}));function gw(e){return!!(e&&e.texture)}var _w,vw=t((()=>{MC(),E(),KC(),XC(),_w=class{constructor(e,t){this.device=e,this.options=t,this.isDestroy=!1;let{wrapS:n=m.CLAMP_TO_EDGE,wrapT:r=m.CLAMP_TO_EDGE,aniso:i,mag:a=m.NEAREST,min:o=m.NEAREST}=t;this.createTexture(t),this.sampler=e.createSampler({addressModeU:zC[n],addressModeV:zC[r],minFilter:o===m.NEAREST?mS.POINT:mS.BILINEAR,magFilter:a===m.NEAREST?mS.POINT:mS.BILINEAR,mipmapFilter:hS.NO_MIP,maxAnisotropy:i})}createTexture(e){let{type:t=m.UNSIGNED_BYTE,width:n,height:r,flipY:i=!1,format:a=m.RGBA,alignment:o=1,usage:s=Wt.SAMPLED,unorm:c=!1,label:l}=e,{data:u}=e;this.width=n,this.height=r;let d=X.U8_RGBA_RT;if(t===m.UNSIGNED_BYTE&&a===m.RGBA)d=c?X.U8_RGBA_NORM:X.U8_RGBA_RT;else if(t===m.UNSIGNED_BYTE&&a===m.LUMINANCE)d=X.U8_LUMINANCE;else if(t===m.FLOAT&&a===m.LUMINANCE)d=X.F32_LUMINANCE;else if(t===m.FLOAT&&a===m.RGB)this.device.queryVendorInfo().platformString===`WebGPU`?(u&&=JC(u,0),d=X.F32_RGBA):d=X.F32_RGB;else if(t===m.FLOAT&&a===m.RGBA)d=X.F32_RGBA;else if(t===m.FLOAT&&a===m.RED)d=X.F32_R;else throw Error(`create texture error, type: ${t}, format: ${a}`);this.texture=this.device.createTexture({format:d,width:n,height:r,usage:s===Wt.SAMPLED?bS.SAMPLED:bS.RENDER_TARGET,pixelStore:{unpackFlipY:i,packAlignment:o},mipLevelCount:1}),l&&this.device.setResourceName(this.texture,l),u&&this.texture.setImageData([u])}get(){return this.texture}update(e){let{data:t}=e;this.texture.setImageData([t])}bind(){}resize({width:e,height:t}){(this.width!==e||this.height!==t)&&this.destroy(),this.options.width=e,this.options.height=t,this.createTexture(this.options),this.isDestroy=!1}getSize(){return[this.width,this.height]}destroy(){!this.isDestroy&&!this.texture.destroyed&&this.texture?.destroy(),this.isDestroy=!0}}})),yw,bw=t((()=>{MC(),vw(),yw=class{constructor(e,t){this.device=e,this.options=t,this.createColorRenderTarget(),this.createDepthRenderTarget()}createColorRenderTarget(e=!1){let{width:t,height:n,color:r}=this.options;r&&(gw(r)?(e&&r.resize({width:t,height:n}),this.colorTexture=r.get(),this.colorRenderTarget=this.device.createRenderTargetFromTexture(this.colorTexture),this.width=r.width,this.height=r.height):t&&n&&(this.colorTexture=this.device.createTexture({format:X.U8_RGBA_RT,usage:bS.RENDER_TARGET,width:t,height:n}),this.colorRenderTarget=this.device.createRenderTargetFromTexture(this.colorTexture),this.width=t,this.height=n))}createDepthRenderTarget(e=!1){let{width:t,height:n,depth:r}=this.options;r&&(gw(r)?(e&&r.resize({width:t,height:n}),this.depthTexture=r.get(),this.depthRenderTarget=this.device.createRenderTargetFromTexture(this.depthTexture),this.width=r.width,this.height=r.height):t&&n&&(this.depthTexture=this.device.createTexture({format:X.D24_S8,usage:bS.RENDER_TARGET,width:t,height:n}),this.depthRenderTarget=this.device.createRenderTargetFromTexture(this.depthTexture),this.width=t,this.height=n))}get(){return this.colorRenderTarget}destroy(){this.colorRenderTarget?.destroy(),this.depthRenderTarget?.destroy()}resize({width:e,height:t}){(this.width!==e||this.height!==t)&&(this.destroy(),this.colorTexture.destroyed=!0,this.depthTexture.destroyed=!0,this.options.width=e,this.options.height=t,this.createColorRenderTarget(!0),this.createDepthRenderTarget(!0))}}})),xw,Sw,Cw,ww,Tw=t((()=>{MC(),E(),D(),bw(),vw(),KC(),{isPlainObject:xw,isTypedArray:Sw,isNil:Cw}=vt,ww=class{constructor(e,t,n){this.device=e,this.options=t,this.service=n,this.destroyed=!1,this.uniforms={},this.vertexBuffers=[],this.pipelineCache=new Map,this.currentPipelineKey=``;let{vs:r,fs:i,attributes:a,uniforms:o,count:s,elements:c,diagnosticDerivativeUniformityEnabled:l}=t;this.options=t;let u=l?``:this.service.viewportOrigin===CS.UPPER_LEFT?`diagnostic(off,derivative_uniformity);`:``;this.program=n.renderCache.createProgram({vertex:{glsl:r},fragment:{glsl:i,postprocess:e=>u+e}}),o&&(this.uniforms=this.extractUniforms(o));let d=[],f=0;Object.keys(a).forEach(e=>{let t=a[e],n=t.get();this.vertexBuffers.push(n.get());let{offset:r=0,stride:i=0,size:o=1,divisor:s=0,shaderLocation:c=0}=t.attribute;d.push({arrayStride:i||o*4,stepMode:vS.VERTEX,attributes:[{format:LC[o],shaderLocation:c,offset:r,divisor:s}]}),f=n.size/o}),s||(this.options.count=f),c&&(this.indexBuffer=c.get());let p=n.renderCache.createInputLayout({vertexBufferDescriptors:d,indexBufferFormat:c?X.U32_R:null,program:this.program});this.inputLayout=p,this.pipeline=this.createPipeline(t);let m=this.getPipelineKey(t);this.pipelineCache.set(m,this.pipeline),this.currentPipelineKey=m}getPipelineKey(e,t){let{primitive:n=m.TRIANGLES,depth:r,cull:i,blend:a,stencil:o}=e,s;s=o?.enable?[1,o.mask??4294967295,o.func?.cmp??m.ALWAYS,o.func?.ref??0,o.func?.mask??4294967295,o.opFront?.fail??m.KEEP,o.opFront?.zfail??m.KEEP,o.opFront?.zpass??m.KEEP,o.opBack?.fail??m.KEEP,o.opBack?.zfail??m.KEEP,o.opBack?.zpass??m.KEEP].join(`,`):`0`;let c;return c=a?.enable?[1,a.func?.srcRGB??m.SRC_ALPHA,a.func?.dstRGB??m.ONE_MINUS_SRC_ALPHA,a.func?.srcAlpha??m.SRC_ALPHA,a.func?.dstAlpha??m.ONE_MINUS_SRC_ALPHA,a.equation?.rgb??m.FUNC_ADD,a.equation?.alpha??m.FUNC_ADD].join(`,`):`0`,[`primitive:${n}`,`pick:${!!t}`,`depth:${r?.enable??!0}:${r?.func??m.LESS}:${r?.mask??!0}`,`cull:${i?.enable??!1}:${i?.face??m.BACK}`,`blend:${c}`,`stencil:${s}`].join(`|`)}createPipeline(e,t){let{primitive:n=m.TRIANGLES,depth:r,cull:i,blend:a,stencil:o}=e,s=this.initDepthDrawParams({depth:r}),c=!!(s&&s.enable),l=this.initCullDrawParams({cull:i}),u=!!(l&&l.enable),d=this.getBlendDrawParams({blend:a}),f=!!(d&&d.enable),p=this.getStencilDrawParams({stencil:o}),h=!!(p&&p.enable),g=this.device.createRenderPipeline({inputLayout:this.inputLayout,program:this.program,topology:IC[n],colorAttachmentFormats:[X.U8_RGBA_RT],depthStencilAttachmentFormat:X.D24_S8,megaStateDescriptor:{attachmentsState:[t?{channelWriteMask:xS.ALL,rgbBlendState:{blendMode:fS.ADD,blendSrcFactor:U.ONE,blendDstFactor:U.ZERO},alphaBlendState:{blendMode:fS.ADD,blendSrcFactor:U.ONE,blendDstFactor:U.ZERO}}:{channelWriteMask:h&&p.opFront.zpass===K.REPLACE?xS.NONE:xS.ALL,rgbBlendState:{blendMode:f&&d.equation.rgb||fS.ADD,blendSrcFactor:f&&d.func.srcRGB||U.SRC_ALPHA,blendDstFactor:f&&d.func.dstRGB||U.ONE_MINUS_SRC_ALPHA},alphaBlendState:{blendMode:f&&d.equation.alpha||fS.ADD,blendSrcFactor:f&&d.func.srcAlpha||U.ONE,blendDstFactor:f&&d.func.dstAlpha||U.ONE}}],blendConstant:f?ES:void 0,depthWrite:c,depthCompare:c&&s.func||H.LESS,cullMode:u&&l.face||dS.NONE,stencilWrite:h,stencilFront:{compare:h?p.func.cmp:H.ALWAYS,passOp:p.opFront.zpass,failOp:p.opFront.fail,depthFailOp:p.opFront.zfail,mask:p.opFront.mask},stencilBack:{compare:h?p.func.cmp:H.ALWAYS,passOp:p.opBack.zpass,failOp:p.opBack.fail,depthFailOp:p.opBack.zfail,mask:p.opBack.mask}}});return h&&!Cw(o?.func?.ref)&&(g.stencilFuncReference=o.func.ref),g}updateAttributesAndElements(){}updateAttributes(){}addUniforms(e){this.uniforms={...this.uniforms,...this.extractUniforms(e)}}draw(e,t){let n={...this.options,...e},{count:r=0,instances:i,elements:a,uniforms:o={},uniformBuffers:s,textures:c}=n;this.uniforms={...this.uniforms,...this.extractUniforms(o)};let{renderPass:l,currentFramebuffer:u,width:d,height:f}=this.service,p=this.getPipelineKey(n,t),m=this.pipelineCache.get(p);m||(m=this.createPipeline(n,t),this.pipelineCache.set(p,m)),this.pipeline=m,this.currentPipelineKey=p;let h=this.service.device,g=h.swapChainHeight;h.swapChainHeight=u?.height||f,l.setViewport(0,0,u?.width||d,u?.height||f),h.swapChainHeight=g,l.setPipeline(this.pipeline);let _=this.pipeline;if(Cw(_.stencilFuncReference)||l.setStencilReference(_.stencilFuncReference),l.setVertexInput(this.inputLayout,this.vertexBuffers.map(e=>({buffer:e})),a?{buffer:this.indexBuffer,offset:0}:null),s&&(this.bindings=h.createBindings({pipeline:this.pipeline,uniformBufferBindings:s.map((e,t)=>{let n=e;return{binding:t,buffer:n.get(),size:n.size}}),samplerBindings:c?.map(e=>({texture:e.texture,sampler:e.sampler}))})),this.bindings&&(l.setBindings(this.bindings),Object.keys(this.uniforms).forEach(e=>{let t=this.uniforms[e];if(t instanceof _w)this.uniforms[e]=t.get();else if(t instanceof yw){let n=t.get();this.uniforms[e]=n.texture}}),this.program.setUniformsLegacy(this.uniforms)),a){let e=a.count;e===0?l.draw(r,i):l.drawIndexed(e,i)}else l.draw(r,i)}destroy(){this.vertexBuffers?.forEach(e=>e.destroy()),this.indexBuffer?.destroy(),this.bindings?.destroy(),this.pipelineCache.forEach(e=>e.destroy()),this.pipelineCache.clear(),this.destroyed=!0}initDepthDrawParams({depth:e}){if(e)return{enable:e.enable===void 0||!!e.enable,mask:e.mask===void 0||!!e.mask,func:BC[e.func||m.LESS],range:e.range||[0,1]}}getBlendDrawParams({blend:e}){let{enable:t,func:n,equation:r,color:i=[0,0,0,0]}=e||{};return{enable:!!t,func:{srcRGB:UC[n&&n.srcRGB||m.SRC_ALPHA],srcAlpha:UC[n&&n.srcAlpha||m.SRC_ALPHA],dstRGB:UC[n&&n.dstRGB||m.ONE_MINUS_SRC_ALPHA],dstAlpha:UC[n&&n.dstAlpha||m.ONE_MINUS_SRC_ALPHA]},equation:{rgb:HC[r&&r.rgb||m.FUNC_ADD],alpha:HC[r&&r.alpha||m.FUNC_ADD]},color:i}}getStencilDrawParams({stencil:e}){let{enable:t,mask:n=4294967295,func:r={cmp:m.ALWAYS,ref:0,mask:4294967295},opFront:i={fail:m.KEEP,zfail:m.KEEP,zpass:m.KEEP},opBack:a={fail:m.KEEP,zfail:m.KEEP,zpass:m.KEEP}}=e||{};return{enable:!!t,mask:n,func:{...r,cmp:GC[r.cmp]},opFront:{fail:WC[i.fail],zfail:WC[i.zfail],zpass:WC[i.zpass],mask:r.mask},opBack:{fail:WC[a.fail],zfail:WC[a.zfail],zpass:WC[a.zpass],mask:r.mask}}}initCullDrawParams({cull:e}){if(e){let{enable:t,face:n=m.BACK}=e;return{enable:!!t,face:VC[n]}}}extractUniforms(e){let t={};return Object.keys(e).forEach(n=>{this.extractUniformsRecursively(n,e[n],t,``)}),t}extractUniformsRecursively(e,t,n,r){if(t===null||typeof t==`string`||typeof t==`number`||typeof t==`boolean`||Array.isArray(t)&&typeof t[0]==`number`||Sw(t)||typeof t==`object`&&t&&`resize`in t)n[`${r&&r+`.`}${e}`]=t;else{if(xw(t)){let i=t;Object.keys(i).forEach(t=>{this.extractUniformsRecursively(t,i[t],n,`${r&&r+`.`}${e}`)})}Array.isArray(t)&&t.forEach((t,i)=>{if(xw(t)){let a=t;Object.keys(a).forEach(t=>{this.extractUniformsRecursively(t,a[t],n,`${r&&r+`.`}${e}[${i}]`)})}})}}}}));function Ew(e){return typeof WebGL2RenderingContext<`u`&&e instanceof WebGL2RenderingContext||!!(e&&e._version===2)}var Dw=t((()=>{})),Ow,kw,Aw=t((()=>{MC(),D(),PC(),QC(),pw(),hw(),bw(),Tw(),vw(),Dw(),{isUndefined:Ow}=vt,kw=class{constructor(){this.uniformBuffers=[],this.queryVerdorInfo=()=>this.device.queryVendorInfo().platformString,this.createModel=e=>new ww(this.device,e,this),this.createAttribute=e=>new NC(this.device,e),this.createBuffer=e=>new ZC(this.device,e),this.createElements=e=>new mw(this.device,e),this.createTexture2D=e=>new _w(this.device,e),this.createFramebuffer=e=>new yw(this.device,e),this.useFramebuffer=(e,t)=>{this.currentFramebuffer=e,this.beginFrame(),t(),this.endFrame(),this.currentFramebuffer=null},this.useFramebufferAsync=async(e,t)=>{this.currentFramebuffer=e,this.preRenderPass=this.renderPass,this.beginFrame(),await t(),this.endFrame(),this.currentFramebuffer=null,this.renderPass=this.preRenderPass},this.clear=e=>{let{color:t,depth:n,stencil:r,framebuffer:i=null}=e;if(i)i.clearOptions={color:t,depth:n,stencil:r};else{let e=this.queryVerdorInfo();if(e===`WebGL1`){let e=this.getGLContext();Ow(r)?Ow(n)||(e.clearDepth(n),e.clear(e.DEPTH_BUFFER_BIT)):(e.clearStencil(r),e.clear(e.STENCIL_BUFFER_BIT))}else if(e===`WebGL2`){let e=this.getGLContext();Ow(r)?Ow(n)||e.clearBufferfv(e.DEPTH,0,[n]):e.clearBufferiv(e.STENCIL,0,[r])}}},this.viewport=({width:e,height:t})=>{this.swapChain.configureSwapChain(e,t),this.createMainColorDepthRT(e,t),this.width=e,this.height=t},this.readPixels=e=>{let{framebuffer:t,x:n,y:r,width:i,height:a}=e,o=this.device.createReadback(),s=t.colorTexture,c=o.readTextureSync(s,n,this.viewportOrigin===CS.LOWER_LEFT?r:this.height-r,i,a,new Uint8Array(i*a*4));if(this.viewportOrigin!==CS.LOWER_LEFT)for(let e=0;e<c.length;e+=4){let t=c[e];c[e]=c[e+2],c[e+2]=t}return o.destroy(),c},this.readPixelsAsync=async e=>{let{framebuffer:t,x:n,y:r,width:i,height:a}=e,o=this.device.createReadback(),s=t.colorTexture,c=await o.readTexture(s,n,this.viewportOrigin===CS.LOWER_LEFT?r:this.height-r,i,a,new Uint8Array(i*a*4));if(this.viewportOrigin!==CS.LOWER_LEFT)for(let e=0;e<c.length;e+=4){let t=c[e];c[e]=c[e+2],c[e+2]=t}return o.destroy(),c},this.getViewportSize=()=>({width:this.width,height:this.height}),this.getContainer=()=>this.canvas?.parentElement,this.getCanvas=()=>this.canvas,this.getGLContext=()=>this.device.gl,this.destroy=()=>{this.canvas=null,this.uniformBuffers?.forEach(e=>{e.destroy()}),this.device.destroy(),this.renderCache.destroy()}}async init(e,t){let{enableWebGPU:n,shaderCompilerPath:r,antialias:i}=t;this.canvas=e;let a=await(n?new jC({shaderCompilerPath:r}):new iC({targets:[`webgl2`,`webgl1`],antialias:i,onContextLost(e){console.warn(`context lost`,e)},onContextCreationError(e){console.warn(`context creation error`,e)},onContextRestored(e){console.warn(`context restored`,e)}})).createSwapChain(e);a.configureSwapChain(e.width,e.height),this.device=a.getDevice(),this.swapChain=a,this.renderCache=new fw(this.device),this.currentFramebuffer=null,this.viewportOrigin=this.device.queryVendorInfo().viewportOrigin;let o=this.device.gl;this.extensionObject={OES_texture_float:!Ew(o)&&this.device.OES_texture_float},this.createMainColorDepthRT(e.width,e.height)}createMainColorDepthRT(e,t){this.mainColorRT&&this.mainColorRT.destroy(),this.mainDepthRT&&this.mainDepthRT.destroy(),this.mainColorRT=this.device.createRenderTargetFromTexture(this.device.createTexture({format:X.U8_RGBA_RT,width:e,height:t,usage:bS.RENDER_TARGET})),this.mainDepthRT=this.device.createRenderTargetFromTexture(this.device.createTexture({format:X.D24_S8,width:e,height:t,usage:bS.RENDER_TARGET}))}beginFrame(){this.device.beginFrame();let{currentFramebuffer:e,swapChain:t,mainColorRT:n,mainDepthRT:r}=this,i=e?e.colorRenderTarget:n,a=e?null:t.getOnscreenTexture(),o=e?e.depthRenderTarget:r,{color:s=[0,0,0,0],depth:c=1,stencil:l=0}=e?.clearOptions||{},u=i?Xy(s[0]*255,s[1]*255,s[2]*255,s[3]):ES,d=o?c:void 0,f=o?l:void 0,p=this.device.createRenderPass({colorAttachment:[i],colorResolveTo:[a],colorClearColor:[u],colorStore:[!0],depthStencilAttachment:o,depthClearValue:d,stencilClearValue:f});this.renderPass=p}endFrame(){this.device.submitPass(this.renderPass),this.device.endFrame()}getPointSizeRange(){let e=this.device.gl;return e.getParameter(e.ALIASED_POINT_SIZE_RANGE)}testExtension(e){return!!this.getGLContext().getExtension(e)}setState(){let e=this.getGLContext();e&&(e.disable(e.CULL_FACE),e.blendEquation(e.FUNC_ADD),e.blendFunc(e.ONE,e.ONE_MINUS_SRC_ALPHA))}setBaseState(){let e=this.getGLContext();e&&(e.disable(e.CULL_FACE),e.blendEquation(e.FUNC_ADD),e.blendFunc(e.ONE,e.ONE_MINUS_SRC_ALPHA))}setCustomLayerDefaults(){let e=this.getGLContext();e&&e.disable(e.CULL_FACE)}setDirty(e){this.isDirty=e}getDirty(){return this.isDirty}}})),jw=t((()=>{Aw()})),Mw,Nw=t((()=>{E(),N_(),D(),L_(),$v(),jw(),$v(),Mw=class{constructor(e){let{id:t,map:n}=e,r=bn();this.container=r,n.setContainer(r,t),r.rendererService=new kw,this.sceneService=r.sceneService,this.mapService=r.mapService,this.iconService=r.iconService,this.fontService=r.fontService,this.controlService=r.controlService,this.layerService=r.layerService,this.debugService=r.debugService,this.debugService.setEnable(e.debug),this.markerService=r.markerService,this.interactionService=r.interactionService,this.popupService=r.popupService,this.boxSelect=new I_(this,{}),this.initComponent(t),this.sceneService.init(e),this.initControl()}get map(){return this.mapService.map}get loaded(){return this.sceneService.loaded}getServiceContainer(){return this.container}getSize(){return this.mapService.getSize()}getMinZoom(){return this.mapService.getMinZoom()}getMaxZoom(){return this.mapService.getMaxZoom()}getType(){return this.mapService.getType()}getMapContainer(){return this.mapService.getMapContainer()}getMapCanvasContainer(){return this.mapService.getMapCanvasContainer()}getMapService(){return this.mapService}getDebugService(){return this.debugService}async exportPng(e){return this.sceneService.exportPng(e)}async exportMap(e){return this.sceneService.exportPng(e)}registerRenderService(e){this.sceneService.loaded?new e(this).init():this.on(`loaded`,()=>{new e(this).init()})}setBgColor(e){this.mapService.setBgColor(e)}addLayer(e){this.loaded?this.preAddLayer(e):this.once(`loaded`,()=>{this.preAddLayer(e)})}preAddLayer(e){let t=Oe(this.container);if(e.setContainer(t),this.sceneService.addLayer(e),e.inited){this.initTileLayer(e);let t=this.initMask(e);this.addMask(t,e.id)}else e.on(`inited`,()=>{this.initTileLayer(e);let t=this.initMask(e);this.addMask(t,e.id)})}initMask(e){let{mask:t,maskfence:n,maskColor:r=`#000`,maskOpacity:i=0}=e.getLayerConfig();if(t&&n)return new Bg().source(n).shape(`fill`).style({color:r,opacity:i})}addMask(e,t){if(!e)return;let n=this.getLayer(t);if(n){let t=Oe(this.container);e.setContainer(t),n.addMaskLayer(e),this.sceneService.addMask(e)}else console.warn(`parent layer not find!`)}getPickedLayer(){return this.layerService.pickedLayerId}getLayers(){return this.layerService.getLayers()}getLayer(e){return this.layerService.getLayer(e)}getLayerByName(e){return this.layerService.getLayerByName(e)}async removeLayer(e,t){await this.layerService.remove(e,t)}async removeAllLayer(){await this.layerService.removeAllLayers()}render(){this.sceneService.render()}setEnableRender(e){this.layerService.setEnableRender(e)}addIconFont(e,t){this.fontService.addIconFont(e,t)}addIconFonts(e){e.forEach(([e,t])=>{this.fontService.addIconFont(e,t)})}addFontFace(e,t){this.fontService.once(`fontloaded`,e=>{this.emit(`fontloaded`,e)}),this.fontService.addFontFace(e,t)}async addImage(e,t){await this.iconService.addImage(e,t)}hasImage(e){return this.iconService.hasImage(e)}removeImage(e){this.iconService.removeImage(e)}addIconFontGlyphs(e,t){this.fontService.addIconGlyphs(t)}addControl(e){this.controlService.addControl(e,this.container)}removeControl(e){this.controlService.removeControl(e)}getControlByName(e){return this.controlService.getControlByName(e)}addMarker(e){this.markerService.addMarker(e)}addMarkerLayer(e){this.markerService.addMarkerLayer(e)}removeMarkerLayer(e){this.markerService.removeMarkerLayer(e)}removeAllMarkers(){this.markerService.removeAllMarkers()}removeAllMakers(){console.warn(`removeAllMakers 已废弃，请使用 removeAllMarkers`),this.markerService.removeAllMarkers()}addPopup(e){this.popupService.addPopup(e)}removePopup(e){this.popupService.removePopup(e)}on(e,t){F_.includes(e)?this.boxSelect?.on(e,t):ie.includes(e)?this.sceneService.on(e,t):this.mapService.on(e,t)}once(e,t){F_.includes(e)?this.boxSelect?.once(e,t):ie.includes(e)?this.sceneService.once(e,t):this.mapService.once(e,t)}emit(e,...t){ie.includes(e)?this.sceneService.emit(e,...t):this.mapService.emit(e,...t)}off(e,t){F_.includes(e)?this.boxSelect?.off(e,t):ie.includes(e)?this.sceneService.off(e,t):this.mapService.off(e,t)}getZoom(){return this.mapService.getZoom()}getCenter(e){return this.mapService.getCenter(e)}setCenter(e,t){return this.mapService.setCenter(e,t)}getPitch(){return this.mapService.getPitch()}setPitch(e){return this.mapService.setPitch(e)}getRotation(){return this.mapService.getRotation()}getBounds(){return this.mapService.getBounds()}setRotation(e){this.mapService.setRotation(e)}zoomIn(){this.mapService.zoomIn()}zoomOut(){this.mapService.zoomOut()}panTo(e){this.mapService.panTo(e)}panBy(e,t){this.mapService.panBy(e,t)}getContainer(){return this.mapService.getContainer()}setZoom(e){this.mapService.setZoom(e)}fitBounds(e,t){let{fitBoundsOptions:n,animate:r}=this.sceneService.getSceneConfig();this.mapService.fitBounds(e,t||{...n,animate:r})}setZoomAndCenter(e,t){this.mapService.setZoomAndCenter(e,t)}setMapStyle(e){this.mapService.setMapStyle(e)}setMapStatus(e){this.mapService.setMapStatus(e)}pixelToLngLat(e){return this.mapService.pixelToLngLat(e)}lngLatToPixel(e){return this.mapService.lngLatToPixel(e)}containerToLngLat(e){return this.mapService.containerToLngLat(e)}lngLatToContainer(e){return this.mapService.lngLatToContainer(e)}destroy(){this.sceneService.destroy()}registerPostProcessingPass(e,t){let n=new e;n.setName(t),this.container.postProcessingPass[t]=n}enableShaderPick(){this.layerService.enableShaderPick()}disableShaderPick(){this.layerService.disableShaderPick()}diasbleShaderPick(){console.warn(`diasbleShaderPick 已废弃，请使用 disableShaderPick`),this.layerService.disableShaderPick()}enableBoxSelect(e=!0){this.boxSelect.enable(),e&&this.boxSelect.once(`selectend`,()=>{this.disableBoxSelect()})}disableBoxSelect(){this.boxSelect.disable()}static addProtocol(e,t){se.REGISTERED_PROTOCOLS[e]=t}static removeProtocol(e){delete se.REGISTERED_PROTOCOLS[e]}getProtocol(e){return se.REGISTERED_PROTOCOLS[e]}startAnimate(){this.layerService.startAnimate()}stopAnimate(){this.layerService.stopAnimate()}getPointSizeRange(){return this.sceneService.getPointSizeRange()}initComponent(e){this.controlService.init({container:Rt(e)},this.container),this.markerService.init(this.container),this.popupService.init(this.container)}initControl(){let{logoVisible:e,logoPosition:t}=this.sceneService.getSceneConfig();e&&this.addControl(new jv({position:t}))}initTileLayer(e){e.getSource().isTile&&(e.tileLayer=new a_(e))}}})),Pw,Fw=t((()=>{Pw=`2.30.0-beta.1`})),Iw=n({AJAXError:()=>fe,AttributeType:()=>k,BKDRHash:()=>At,BaiduMap:()=>_,BaseLayer:()=>Qc,BaseMapWrapper:()=>s,BaseModel:()=>N,BasePostProcessingPass:()=>_n,BlendType:()=>nn,ButtonControl:()=>rv,CameraUniform:()=>bt,CanvasLayer:()=>Tl,CanvasUpdateType:()=>vl,CityBuildingLayer:()=>Fu,Control:()=>tv,CoordinateSystem:()=>sn,CoordinateUniform:()=>dt,DOM:()=>Ct,Earth:()=>cn,EarthLayer:()=>j_,ExportImage:()=>gv,FrequencyController:()=>te,Fullscreen:()=>wv,GaodeMap:()=>mt,GaodeMapV1:()=>Bt,GaodeMapV2:()=>Mt,GeoLocate:()=>Ev,GeometryLayer:()=>rd,GoogleMap:()=>gt,HeatmapLayer:()=>Wd,IDebugLog:()=>ct,ILayerStage:()=>It,ImageLayer:()=>ef,InteractionEvent:()=>zt,LRUCache:()=>St,LayerPopup:()=>Zv,LayerSwitch:()=>kv,LineLayer:()=>pp,LinearDir:()=>hl,LoadTileDataStatus:()=>Ke,Logo:()=>jv,Map:()=>rn,MapLibre:()=>Lt,MapMouseEvent:()=>Me,MapServiceEvent:()=>Je,MapTheme:()=>Iv,Mapbox:()=>ot,Marker:()=>z_,MarkerLayer:()=>W_,MaskLayer:()=>Bg,MaskOperation:()=>Xt,MercatorCoordinate:()=>nt,MouseLocation:()=>Rv,PassType:()=>Le,PointLayer:()=>Km,PolygonLayer:()=>Bh,PopperControl:()=>lv,Popup:()=>Jv,PositionType:()=>Ut,RasterLayer:()=>cg,RasterTileType:()=>Se,Satistics:()=>De,Scale:()=>Bv,ScaleTypes:()=>O,Scene:()=>Mw,SceneConifg:()=>se,SceneEventList:()=>ie,SelectControl:()=>dv,SimpleMapCoord:()=>fn,SizeUnitType:()=>_l,Source:()=>ns,SourceTile:()=>oe,StencilType:()=>wt,StyleScaleType:()=>i,Swipe:()=>Hv,TMap:()=>xt,TencentMap:()=>Ft,TextureBlend:()=>gl,TextureUsage:()=>Wt,TileDebugLayer:()=>s_,TileLayer:()=>a_,TilesetManager:()=>Te,UpdateTileStrategy:()=>w,Viewport:()=>ye,Zoom:()=>Wv,aProjectFlat:()=>Vt,amap2Project:()=>Nt,amap2UnProject:()=>yt,anchorTranslate:()=>_e,anchorType:()=>we,applyAnchorClass:()=>b,bBoxToBounds:()=>_t,bindAll:()=>ze,boundsContains:()=>$e,calAngle:()=>ln,calDistance:()=>vn,calculateCentroid:()=>rt,calculatePointsCenterAndRadius:()=>hn,calculateRelativeOrigin:()=>o,clearColorCache:()=>et,convertToAbsoluteCoordinates:()=>ft,convertToRelativeCoordinates:()=>en,createLayerContainer:()=>Oe,createSceneContainer:()=>bn,decodePickingColor:()=>un,defaultValue:()=>g,djb2hash:()=>an,encodePickingColor:()=>yn,expandUrl:()=>kt,extent:()=>Ne,flow:()=>f,formatImage:()=>Ae,fp64LowPart:()=>xn,generateCatRamp:()=>it,generateColorRamp:()=>gn,generateCustomRamp:()=>Pe,generateLinearRamp:()=>p,generateQuantizeRamp:()=>mn,getAngle:()=>pn,getArrayBuffer:()=>Sn,getBBoxFromPoints:()=>Fe,getColorCacheSize:()=>Ie,getData:()=>d,getDefaultDomain:()=>v,getImage:()=>Ue,getJSON:()=>ne,getProtocolAction:()=>Be,getReferrer:()=>S,getTileIndices:()=>je,getTileWarpXY:()=>Cn,getURLFromTemplate:()=>l,getWMTSURLFromTemplate:()=>Dt,gl:()=>m,globalConfigService:()=>u,guid:()=>lt,interpolateRgbBasis:()=>Et,isAndroid:()=>Gt,isColor:()=>xe,isImageBitmap:()=>T,isNumber:()=>He,isPC:()=>Ye,isURLTemplate:()=>ve,isWorker:()=>qe,isiOS:()=>Ze,latitude:()=>h,lineAtOffset:()=>Zt,lineAtOffsetAsyc:()=>st,lineStyleType:()=>ml,lngLatInExtent:()=>be,lngLatToMeters:()=>Ot,lnglatDistance:()=>c,lodashUtil:()=>vt,longitude:()=>Tt,makeXMLHttpRequestPromise:()=>C,metersToLngLat:()=>me,normalize:()=>ge,osmLonLat2TileXY:()=>We,osmTileXY2LonLat:()=>re,packCircleVertex:()=>dn,padBounds:()=>Ce,parseColor:()=>he,postData:()=>ue,processRelativeCoordinates:()=>Jt,project:()=>y,removeDuplicateUniforms:()=>at,rgb2arr:()=>A,sameOrigin:()=>Kt,tileToBounds:()=>Ve,tranfrormCoord:()=>ae,unProjectFlat:()=>de,validateLngLat:()=>ke,version:()=>Pw}),Lw=t((()=>{E(),N_(),$t(),Nw(),D(),Fw()}));export{M_ as $,jv as A,N as At,dv as B,Uv as C,El as Ct,zv as D,gl as Dt,Rv as E,_l as Et,Dv as F,ns as Ft,iv as G,lv as H,wv as I,W_ as J,tv as K,Tv as L,kv as M,Qc as Mt,Av as N,$c as Nt,Iv as O,yl as Ot,Ev as P,rs as Pt,j_ as Q,gv as R,Hv as S,Tl as St,Vv as T,hl as Tt,uv as U,fv as V,rv as W,z_ as X,G_ as Y,B_ as Z,Qv as _,Gd as _t,Mw as a,Vg as at,Wv as b,Fu as bt,wy as c,Bh as ct,Cy as d,qm as dt,s_ as et,vy as f,pp as ft,Zv as g,Wd as gt,hy as h,tf as ht,Pw as i,Bg as it,Mv as j,P as jt,Lv as k,ml as kt,Ty as l,Vh as lt,gy as m,ef as mt,Iw as n,a_ as nt,Nw as o,cg as ot,_y as p,mp as pt,nv as q,Fw as r,o_ as rt,Ny as s,lg as st,Lw as t,c_ as tt,Sy as u,Km as ut,Jv as v,rd as vt,Bv as w,vl as wt,Gv as x,Iu as xt,Yv as y,id as yt,_v as z};