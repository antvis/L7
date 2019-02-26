self._wkHandlers={};;

				function _prep_h17(){function a(b,c,d,e,g,k){var l=[0,0,0,0,0],n=d.slice(0,4).concat(l),p=[],s=Math.PI/180*6,A=void 0,I=void 0,A=d.slice(0,2),D=m(e),F=m(g),I=q.normalize(h(D).fg(h(A))),C=q.normalize(h(F).fg(h(A)));q.OK(I,k)?(A=q.oD(I),I=q.oD(C)):(A=q.oD(C),I=q.oD(I),k=[F,D],D=k[0],F=k[1],g=[g,e],e=g[0],g=g[1]);D=Math.ceil(Math.abs(I-A)/s);30<=D&&(D=60-D);for(k=0;k<D;k++)0===k?(n.push.apply(n,e.slice(0,4)),n.push.apply(n,l)):(F=(k*s+A)%(2*Math.PI),n.push.apply(n,d.slice(0,2).concat([0,0])),n.push(1* Math.cos(F),1*Math.sin(F),0,0,0)),0<k&&p.push(0,k,k+1);n.push.apply(n,g.slice(0,4));n.push.apply(n,l);p.push(0,D,D+1);var H=b.length/9;b.push.apply(b,n);c.push.apply(c,p.map(function(a){return a+H}));return n.length/9}function c(c,d,e,g,k,l){function n(a,b,c,d,e){var g=void 0;a.NC(b)||q.AW(a,b)?g=b:c&&d&&e?g=a:c&&!d&&e?g=b:c||d||e?c||!d||e?(g=q.normalize(a.mi(b)),I=q.cos(g,a),g=g.oJ(I)):g=a:g=b;return g}function p(a,b,c){if(void 0===c||!0===c)d.push(a[0],a[1]),d.push(-b.y,b.x,0,0),d.push(A,0,0),l.push(a[2]); if(void 0===c||!1===c)d.push(a[0],a[1]),d.push(b.y,-b.x,0,0),d.push(A,0,0),l.push(a[2])}var s=c.length,E=0,A=0,I=void 0,D=void 0;k&&(g="bevel");c.forEach(function(c,r,H){var K=H[r-1];H=H[r+1];var L=void 0;K&&(A+=q.Fd(c,K));if(0===r||r===s-1)0===r?(void 0===H&&(H=c),L=q.normalize(h(H[0]-c[0],H[1]-c[1])),e.push(0,1,2)):(L=q.normalize(h(c[0]-K[0],c[1]-K[1])),r=d.length/9+2,4===r?e.push(3,2,1):e.push(r-3-E,r-1,r-2)),p(c,L);else{var J=q.normalize(h(c[0]-K[0],c[1]-K[1])),N=q.normalize(h(H[0]-c[0],H[1]- c[1])),L=q.normalize(J.multiply(-1).mi(N));D=q.OK(L,J);I=q.cos(L,J);p(c,n(J,N,D,!0,!0),!0);p(c,n(J,N,D,!0,!1),!1);p(c,n(J,N,D,!1,!0),!0);p(c,n(J,N,D,!1,!1),!1);r=d.length/9;K=r-4;H=K+2;var M=9*K,T=M+9,W=T+9,Z=W+9;D?(W=m(d.slice(T,W)),M=m(d.slice(M,T)),M=q.normalize(h(W).fg(h(M))),M=Math.abs(q.cos(J,M)/q.sin(J,M)*2),d[T+7]=-M,d[Z+7]=M):(Z=m(d.slice(M,T)),T=m(d.slice(T,W)),T=q.normalize(h(Z).fg(h(T))),T=Math.abs(q.cos(T,J)/q.sin(T,J)*2),d[M+7]=-T,d[W+7]=T);q.AW(J,N)?e.push(K,K+1,K-2-E):e.push(K,K-1- E,K+1);"miter"==g&&(D?p(c,n(J,N,0,!0,!0),!0):p(c,n(J,N,0,!0,!0),!1),E=1);if("round"===g){M=N=J=void 0;D?(J=d.slice(9*(K+1),9*(K+2)),N=d.slice(9*K,9*(K+1)),M=d.slice(9*H,9*(H+1))):(J=d.slice(9*K,9*(K+1)),N=d.slice(9*(K+1),9*(K+2)),M=d.slice(9*(H+1),9*(H+2)));L=a(d,e,J,N,M,L.multiply(-1));if(l)for(;0<L--;)l.push(c[2]);E=d.length/9-r}e.push(H,H+1,H+2+E);k||"bevel"!=g&&"miter"!=g||(D?e.push(H,K,K+1):e.push(H,H-1,H+1),"miter"==g&&(D?e.push(H+2,H-2,H):e.push(H+2,H+1,H-1)))}})}function d(a,b,c,d){function e(a, b){var c=void 0;if(a.NC(b))c=b;else{var c=q.normalize(a.mi(b)),d=q.cos(c,a);d>Math.sqrt(3)/2&&(d=Math.sqrt(3)/2);c=c.oJ(d)}return c}function g(a,c,e){if(void 0===e||!0===e)b.push(a[0],a[1]),b.push(-c.y,c.x,0,0),b.push(m,0,0),d.push(a[2]);if(void 0===e||!1===e)b.push(a[0],a[1]),b.push(c.y,-c.x,0,0),b.push(m,0,0),d.push(a[2])}for(var k=a[0],l=a[a.length-1],m=0,n=void 0;k[0]===l[0]&&k[1]===l[1]&&k!==l;)a.pop(),l=a[a.length-1];a.push(k);a.push(a[1]);a.unshift(l);var p=a.length;a.forEach(function(a,d, k){var l=k[d-1];k=k[d+1];var r=void 0;l&&(m+=q.Fd(a,l));if(0===d||d===p-1)0===d?(r=q.normalize(h(k[0]-a[0],k[1]-a[1])),c.push(0,1,2)):(r=q.normalize(h(a[0]-l[0],a[1]-l[1])),d=b.length/9+2,c.push(d-3,d-1,d-2)),g(a,r);else{d=q.normalize(h(a[0]-l[0],a[1]-l[1]));k=q.normalize(h(k[0]-a[0],k[1]-a[1]));l=q.normalize(d.multiply(-1).mi(k));n=q.OK(l,d);g(a,e(d,k),!0);g(a,e(d,k),!1);g(a,e(d,k),!0);g(a,e(d,k),!1);a=b.length/9-4;k=a+2;var r=9*a,s=r+9,x=s+9,B=x+9;d=Math.abs(q.cos(d,l)/q.sin(d,l));n?(b[r+7]=d,b[s+ 7]=-d,b[x+7]=-d,b[B+7]=d):(b[r+7]=-d,b[s+7]=d,b[x+7]=d,b[B+7]=-d);c.push(a,a-1,a+1);c.push(k,k+1,k+2)}})}function e(c,d,e){function g(a,b){if(p)for(;0<a--;)p.push(b)}function m(a,b){E.push.apply(E,a.slice(0,k));E.push(b.x,b.y);E.push.apply(E,a.slice(l));E.push.apply(E,a)}var n=3<arguments.length&&void 0!==arguments[3]?arguments[3]:"butt",p=arguments[4],s=c.length-1,G=d.length,E=[],A=[],I=[d.slice(0,9),d.slice(9,18)],D=[d.slice(G-9,G),d.slice(G-18,G-9)];"square"===n?(n=q.normalize(h(c[0]).fg(h(c[1]))), m(I[0],n),m(I[1],n),n=q.normalize(h(c[s]).fg(h(c[s-1]))),m(D[0],n),m(D[1],n),A.push(0,2,3,3,1,0),A.push(6,7,4,4,7,5),p&&(p.push(c[0][2]),p.push(c[s][2]))):"round"===n&&(n=I[0].slice(0,2).concat(0,0,0,0).concat(I[0].slice(l)),I=a(d,e,n,I[0],I[1],q.normalize(h(c[0]).fg(h(c[1])))),g(I,c[0][2]),n=D[0].slice(0,2).concat(0,0,0,0).concat(D[0].slice(l)),I=a(d,e,n,D[0],D[1],q.normalize(h(c[s]).fg(h(c[s-1])))),g(I,c[s][2]));d.push.apply(d,E);e.push.apply(e,A.map(function(a){return a+G/9}))}function g(a,b){var c= [];a.forEach(function(a){var d=a[0],e=a[1];a=a[2];b&&(d-=p[0],e-=p[1]);var g=c.length-1;if(-1===g)c.push([d,e,a]);else if(d!==c[g][0]||e!==c[g][1]||a!==c[g][2])if(1<=g){var k=q.normalize(h(d-c[g][0],e-c[g][1])),l=q.normalize(h(c[g][0]-c[g-1][0],c[g][1]-c[g-1][1]));k.NC(l)&&a===c[g][2]?c[g]=[d,e,a]:c.push([d,e,a])}else c.push([d,e,a])});return c}function h(a,b){"object"===typeof a&&a.length&&(b=a[1],a=a[0]);return w.a.create(s,{x:{value:a},y:{value:b}})}var k,l;function m(a){return[a[0]+n*a[2],a[1]+ n*a[3]]}var n=1;k=4;l=6;var p=[215440491,106744817],q={normalize:function(a){var b=this.length(a);return a.oJ(b)},Qj:function(a,b){return a.multiply(b)},gJ:function(a,b){return a.x*b.y-a.y*b.x},length:function(a){return Math.sqrt(Math.pow(a.x,2)+Math.pow(a.y,2))},sin:function(a,b){return this.gJ(a,b)/(this.length(a)*this.length(b))},cos:function(a,b){return this.Qj(a,b)/(this.length(a)*this.length(b))},OK:function(a,b){return 0<this.gJ(a,b)},Fd:function(a,b){return Math.sqrt(Math.pow(b[0]-a[0],2)+ Math.pow(b[1]-a[1],2))},AW:function(a,b){return a.multiply(-1).NC(b)},oD:function(a){a=Math.atan2(a.y,a.x);0>=a&&(a+=2*Math.PI);return a}},s={mi:function(a){return h(this.x+a.x,this.y+a.y)},fg:function(a){return h(this.x-a.x,this.y-a.y)},multiply:function(a){return"number"===typeof a?h(this.x*a,this.y*a):this.x*a.x+this.y*a.y},oJ:function(a){return h(this.x/a,this.y/a)},NC:function(a){var b=a.y;return this.x===a.x&&this.y===b}};return{parse:function(a,b){var h=a.lineJoin,h=void 0===h?"bevel":h,k= a.lineCap,k=void 0===k?"butt":k,l=a.Zda,l=void 0===l?!1:l,m=a.tn,n=void 0===m?!1:m,p=a.LX,m=a.Iia,q=void 0===m?!0:m,m=a.Sda,s=[],A=[],I=g(a.Nr,void 0===p?!0:p),p=[];l?(d(I,s,A,p),h=s.length,[0,1,2,h/9-1,h/9-2].forEach(function(a){s[9*a+8]=-1})):(c(I,s,A,h,n,p),e(I,s,A,k,p));q&&(s=new Float32Array(s),A=65535<A.length?new Uint32Array(A):new Uint16Array(A));h=[s,A];m&&h.push(p);if(b)b(null,{data:h});else return h}}}
				if (self._wkHandlers['w6__def_w6'] && true) {
					throw new Error('w6__def_w6 already exists!')
				} else {
					if (false && self._wkHandlers['w6__def_w6']) {
						var handlerFunObj = _prep_h17.call(null, self) || {}

						if (typeof Object.assign === 'function') {
							Object.assign(self._wkHandlers['w6__def_w6'], handlerFunObj)
						} else {
							for (var key in handlerFunObj) {
								if (handlerFunObj.hasOwnProperty(key)) {
									self._wkHandlers['w6__def_w6'][key] = handlerFunObj[key]
								}
							}
						}
					} else {
						self._wkHandlers['w6__def_w6'] = _prep_h17.call(null, self) || {}	
					}
				}

				_prep_h17 = null;
			;

				function _prep_h18(a){return{injectCode:function(b,c){var d=null,e=null;try{d=(new Function("self",b))(a)}catch(g){console.error("error",e),e=g.toString()}c(e,d)}}}
				if (self._wkHandlers['w6__g_'] && true) {
					throw new Error('w6__g_ already exists!')
				} else {
					if (false && self._wkHandlers['w6__g_']) {
						var handlerFunObj = _prep_h18.call(null, self) || {}

						if (typeof Object.assign === 'function') {
							Object.assign(self._wkHandlers['w6__g_'], handlerFunObj)
						} else {
							for (var key in handlerFunObj) {
								if (handlerFunObj.hasOwnProperty(key)) {
									self._wkHandlers['w6__g_'][key] = handlerFunObj[key]
								}
							}
						}
					} else {
						self._wkHandlers['w6__g_'] = _prep_h18.call(null, self) || {}	
					}
				}

				_prep_h18 = null;
			;

				function _prep_h19(){return{checkup:function(){var a=Array.prototype.slice.call(arguments,0);a.pop()(null,a)}}}
				if (self._wkHandlers['w6__cln_w6'] && true) {
					throw new Error('w6__cln_w6 already exists!')
				} else {
					if (false && self._wkHandlers['w6__cln_w6']) {
						var handlerFunObj = _prep_h19.call(null, self) || {}

						if (typeof Object.assign === 'function') {
							Object.assign(self._wkHandlers['w6__cln_w6'], handlerFunObj)
						} else {
							for (var key in handlerFunObj) {
								if (handlerFunObj.hasOwnProperty(key)) {
									self._wkHandlers['w6__cln_w6'][key] = handlerFunObj[key]
								}
							}
						}
					} else {
						self._wkHandlers['w6__cln_w6'] = _prep_h19.call(null, self) || {}	
					}
				}

				_prep_h19 = null;
			(function d(a){function b(c,d){function e(a,b,c){a={jv:Date.now(),Yu:h,error:a,result:b,Jr:!1,jn:!1};if(c)for(var g in c)c.hasOwnProperty(g)&&(a[g]=c[g]);d(a)}var g=c.AK,h=c.Yu,l=c.aJ,m=c.Gx,n=c.A$||[],p=a._wkHandlers[g];p?p[l]?m?
p[l].apply(p,n.concat(e)):e(null,p[l].apply(p,n)):e("Unknown cmd: "+l):e("Can not find handler for: "+g)}var c=[],d=null,e=null;for(d in this._wkHandlers)-1!==d.indexOf("_def_")&&(e=this._wkHandlers.lna=d);"function"===typeof this._wkHandlers[e].B&&this._wkHandlers[e].B.call(this._wkHandlers[e]);a.vx=function(a){c.push.apply(c,a)};a.addEventListener("message",function(d){function e(b){if(t){t.push(b);var d=!!b.Jr;d||n++;b=n>=h||b.jn;if(d||b){d=1<t.length?{nha:t}:t[0];d.jv=Date.now();d.moa=p;if(c.length){try{a.postMessage(d,
c)}catch(g){a.postMessage(d),console.error(g)}c.length=0}else a.postMessage(d);t.length=0;b&&(e=t=null)}}else console.error("Seemed callback already sent!!",b,b.result.Ac)}var g=d.data;d=g.kha||[g];for(var h=d.length,n=0,p=Date.now()-g.jv,t=[],g=0;g<h;g++)b(d[g],e)},!1)})(self)