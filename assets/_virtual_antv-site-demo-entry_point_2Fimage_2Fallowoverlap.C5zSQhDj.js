import{f as e,t}from"./src.CdhVPrPk.js";import{a as n,t as r,ut as i}from"./src.C_EuEovZ.js";r(),t();var a=new n({id:`map`,map:new e({style:`light`,center:[104,36],zoom:4})});a.addImage(`marker`,`https://gw.alipayobjects.com/zos/basement_prod/604b5e7f-309e-40db-b95b-4fac746c5153.svg`);function o(e){let t=[];for(let n=0;n<e;n++)t.push({lng:99+Math.random()*20,lat:25+Math.random()*18,id:n});return t}a.on(`loaded`,()=>{let e=o(300),t=new i().source(e,{parser:{type:`json`,x:`lng`,y:`lat`}}).shape(`marker`).size(15).style({allowOverlap:!1});a.addLayer(t);let n=document.createElement(`div`);n.style.cssText=`position:absolute;top:10px;left:10px;z-index:100;background:#fff;padding:12px 16px;border-radius:4px;box-shadow:0 2px 8px rgba(0,0,0,.15);font-size:13px;`,n.innerHTML=`
    <div style="margin-bottom:10px;font-weight:600;">Image allowOverlap</div>
    <label style="display:flex;align-items:center;gap:8px;cursor:pointer;">
      <input type="checkbox" id="overlap-toggle" />
      <span id="overlap-label">allowOverlap: false（碰撞避让开启）</span>
    </label>
    <div style="margin-top:8px;color:#888;font-size:12px;">
      点数量：300 &nbsp;|&nbsp; 缩放地图可触发重新计算
    </div>
  `,document.getElementById(`map`).appendChild(n);let r=document.getElementById(`overlap-toggle`),s=document.getElementById(`overlap-label`);r.addEventListener(`change`,()=>{let e=r.checked;s.textContent=e?`allowOverlap: true（允许压盖，全部显示）`:`allowOverlap: false（碰撞避让开启）`,t.style({allowOverlap:e})})});