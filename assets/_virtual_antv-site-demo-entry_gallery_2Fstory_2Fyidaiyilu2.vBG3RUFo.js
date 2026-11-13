import{K as e,a as t,ct as n,ft as r,g as i,t as a}from"./src.BjoRE84l.js";import{f as o,nr as s,t as c}from"./src.qO5FRARK.js";a(),c();var l=document.createElement(`style`);l.textContent=`
            .info {
                padding: 6px 8px;
                font: 14px/16px Arial, Helvetica, sans-serif;
                background: white;
                background: rgba(255,255,255,0.8);
                box-shadow: 0 0 15px rgba(0,0,0,0.2);
                border-radius: 5px;
            }
            .info h4 {
                margin: 0 0 5px;
                color: #777;
            }
              .legend {
                line-height: 18px;
                color: #555;
            }
            .legend i {
                width: 40px;
                height: 20px;
                float: left;
                margin-top: 5px;
                margin-right: 0px;
                opacity: 1;
                color: #000;
                font-weight: bold;
            }
            `,document.head.appendChild(l);var u=new t({id:`map`,map:new o({style:`light`,center:[116.368652,39.93866],zoom:0,maxZoom:5,token:`6f025e700cbacbb0bb866712d20bb35c`})});function d(e,t){return e>1e5?t[4]:e>1e4?t[3]:e>5e3?t[2]:e>1e3?t[1]:e>0?t[0]:`rgba(0,0,0,0)`}u.on(`loaded`,async()=>{let t=await(await fetch(`https://mdn.alipayobjects.com/afts/file/A*6dU9SL6RD8IAAAAAAAAAAAAADrd2AQ/world_gdp.json`)).json(),a=await(await fetch(`https://mdn.alipayobjects.com/afts/file/A*5NgLQrPivBgAAAAAAAAAAAAADrd2AQ/line_2.json`)).json(),o=t.features.filter(e=>e.properties.flag===!0),c=t.features.filter(e=>e.properties.flag===!1),l=new n({}).source({type:`FeatureCollection`,features:o}).color(`gdp`,[`#fdd49e`,`#fdbb84`,`#fc8d59`,`#e34a33`,`#b30000`]).shape(`fill`).scale(`gdp`,{type:`threshold`,domain:[0,1e3,5e3,1e4,1e5,3e5]}).active(!1).style({opacity:.6}),f=new n({}).source({type:`FeatureCollection`,features:c}).color(`gdp`,[`#c7e9b4`,`#7fcdbb`,`#41b6c4`,`#2c7fb8`,`#253494`]).shape(`fill`).scale(`gdp`,{type:`threshold`,domain:[0,1e3,5e3,1e4,1e5,3e5]}).style({opacity:.6}).active(!1),p=new r().source(a).filter(`type`,e=>e===`11`||e===`1`).color(`#09f`).size(.6).shape(`line`).style({lineType:`dash`,dashArray:[3,3]}),m=new r().source(a).filter(`type`,e=>e===`10`).color(`#09f`).size(.6).shape(`line`).style({lineType:`dash`,dashArray:[2,2]}),h=new r().source(a).filter(`type`,e=>e===`0`||e===`9`||e===`7`||e===`2`).color(`type`,e=>e===`0`?`red`:e===`9`||e===`2`?`#09f `:`#fff`).size(.8).shape(`line`),g=new i({items:[{layer:l,fields:[{field:`NAME_CHN`,formatField:()=>`国家`},{field:`gdp`,formatField:()=>`GDP`,formatValue:e=>e<1e-5?`${e*1e4*1e4}美元`:`${e.toFixed(2)}亿美元`},{field:`industries`,formatField:()=>`行业`,formatValue:e=>e||``},{field:`relations`,formatField:()=>`关系`,formatValue:e=>e||``}]}]}),_=new i({items:[{layer:f,fields:[{field:`NAME_CHN`,formatField:()=>`国家`},{field:`gdp`,formatField:()=>`GDP`,formatValue:e=>e<1e-5?`${e*1e4*1e4}美元`:`${e.toFixed(2)}亿美元`}]}]});u.addPopup(g),u.addPopup(_),u.addLayer(l),u.addLayer(f),u.addLayer(p),u.addLayer(m),u.addLayer(h);let v=new e({position:`bottomright`});v.onAdd=()=>{for(var e=s(`div`,`info legend`),t=[0,1e3,5e3,1e4,1e5,-999],n=[0,`1千`,`5千`,`1万`,`10万`,`30万/亿美元`],r=0;r<t.length;r++)r<t.length-1?e.innerHTML+=`<i style="background:`+d(t[r]+1,[`#c7e9b4`,`#7fcdbb`,`#41b6c4`,`#2c7fb8`,`#253494`])+`"></i>`:e.innerHTML+=`<i style=" width: 100px; margin-left: 10px; background:`+d(t[r]+1,[`#c7e9b4`,`#7fcdbb`,`#41b6c4`,`#2c7fb8`,`#253494`])+`">非一带一路国家</i>`;e.innerHTML+=`<br>`;for(let n=0;n<t.length;n++)n<t.length-1?e.innerHTML+=`<i style="background:`+d(t[n]+1,[`#fdd49e`,`#fdbb84`,`#fc8d59`,`#e34a33`,`#b30000`])+`"></i>`:e.innerHTML+=`<i style=" width: 100px; margin-left: 10px; background:`+d(t[n]+1,[`#c7e9b4`,`#7fcdbb`,`#41b6c4`,`#2c7fb8`,`#253494`])+`">一带一路国家</i>`;e.innerHTML+=`<br>`;for(let r=0;r<n.length;r++)r<t.length-1?e.innerHTML+=`<i>${n[r]}</>`:e.innerHTML+=`<i style=" width: 100px;">${n[r]}</>`;return e},u.addControl(v)});