/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */

// You can delete this file if you're not using it
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/jsx/jsx';
import 'codemirror/mode/htmlembedded/htmlembedded';
import 'codemirror/addon/selection/active-line';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/edit/matchtags';
import 'normalize.css/normalize.css';
import 'prism-themes/themes/prism-base16-ateliersulphurpool.light.css';
import 'prismjs/plugins/command-line/prism-command-line.css';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/mdn-like.css';
import 'rc-drawer/assets/index.css';
import 'docsearch.js/dist/cdn/docsearch.min.css';
import './site/global.less';

window.insertCss = require('insert-css');

// prettier-ignore
/* eslint-disable */
!function(t,e,a,r,c){t.TracertCmdCache=t.TracertCmdCache||[],t[c]=window[c]||
{_isRenderInit:!0,call:function(){t.TracertCmdCache.push(arguments)},
start:function(t){this.call('start',t)}},t[c].l=new Date;
var n=e.createElement(a),s=e.getElementsByTagName(a)[0];
n.async=!0,n.src=r,s.parentNode.insertBefore(n,s);
n.onerror=function(){console.warn(decodeURI('Tracert%20%E8%84%9A%E6%9C%AC%E6%9C%AA%E6%88%90%E5%8A%9F%E5%8A%A0%E8%BD%BD,%20%E8%AF%B7%E6%A3%80%E6%9F%A5%E7%BD%91%E7%BB%9C%E4%BB%A5%E5%8F%8A%20A%20%E4%BD%8D%E6%98%AF%E5%90%A6%E5%9C%A8%E4%B9%9D%E8%89%B2%E9%B9%BF%E5%BB%BA%E7%AB%8B%E6%B4%9E%E5%AF%9F'));
var fallback=function(){console.warn(decodeURI('Tracert%20%E5%91%BD%E4%BB%A4%E6%89%A7%E8%A1%8C%E5%A4%B1%E8%B4%A5%EF%BC%8C%E8%AF%B7%E6%A3%80%E6%9F%A5%20JS%20%E6%98%AF%E5%90%A6%E6%AD%A3%E7%A1%AE%E5%BC%95%E5%85%A5'))};
for(var fnlist=["call","start","config","logPv","info","err","click","expo","pageName","pageState","time","timeEnd","parse","checkExpo","stringify","report","set","before"],i=0;i<fnlist.length;i++){t[c][fnlist[i]]=fallback}};
}(window,document,'script','https://ur.alipay.com/tracert_a369.js','Tracert');
// 启动脚本
Tracert.start();
