import { Scene, PolygonLayer, PointLayer, LineLayer, LayerPopup, Control, DOM } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';
const styleElement = document.createElement('style');

// 在<style>元素中添加样式规则
styleElement.textContent = `
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
            `;

// 将<style>元素添加到<head>元素中，实现样式注入
document.head.appendChild(styleElement);

const scene = new Scene({
    id: 'map',
    map: new GaodeMap({
        style: 'light',
        center: [116.368652, 39.93866],
        zoom: 0,
        token: "6f025e700cbacbb0bb866712d20bb35c"
    })
});
function getColor(d, color) {
    return d > 100000 ? color[4] :
        d > 10000 ? color[3] :
            d > 5000 ? color[2] :
                d > 1000 ? color[1] :
                    d > 0 ? color[0] :
                        'rgba(0,0,0,0)'
}
scene.on('loaded', async () => {
    fetch(
        'https://mdn.alipayobjects.com/afts/file/A*6dU9SL6RD8IAAAAAAAAAAAAADrd2AQ/world_gdp.json'
    )
        .then(res => res.json())
        .then(data => {
            const features_1 = data.features.filter(fe => fe.properties.flag === true)
            const features_2 = data.features.filter(fe => fe.properties.flag === false)
            const layer1 = new PolygonLayer({})
                .source({
                    "type": "FeatureCollection",
                    "features": features_1
                })
                .color(
                    'gdp',
                    ['#fdd49e', '#fdbb84', '#fc8d59', '#e34a33', '#b30000']
                )
                .shape('fill')
                .scale('gdp', {
                    type: 'threshold',
                    domain: [0, 1000, 5000, 10000, 100000, 300000],
                })
                .active(false)
                .style({
                    opacity: 0.8
                })

            const layer2 = new PolygonLayer({})
                .source({
                    "type": "FeatureCollection",
                    "features": features_2
                })
                .color(
                    'gdp',
                    ['#c7e9b4', '#7fcdbb', '#41b6c4', '#2c7fb8', '#253494']
                )
                .shape('fill')
                // .filter('flag',flag=>!falg)
                .scale('gdp', {
                    type: 'threshold',
                    domain: [0, 1000, 5000, 10000, 100000, 300000],
                })
                .style({
                    opacity: 0.8
                })

                .active(false);
            const layer3 = new LineLayer({
                zIndex: 2
            })
                .source(data)
                .color('#ddd')
                .size(0.8);

            const layerPopup1 = new LayerPopup({
                items: [
                    {
                        layer: layer1,
                        fields: [
                            {
                                field: 'NAME_CHN',
                                formatField: () => '国家',
                            },
                            {
                                field: 'gdp',
                                formatField: () => 'GDP',
                                formatValue: (val) => {
                                    return val < 0.00001 ? `${val * 10000 * 10000}美元` : `${val.toFixed(2)}亿美元`;

                                }
                            },
                            {
                                field: 'industries',
                                formatField: () => '行业',
                                formatValue: (val) => {
                                    return val || '';

                                }
                            },
                            {
                                field: 'relations',
                                formatField: () => '关系',
                                formatValue: (val) => {
                                    return val || '';

                                }
                            },
                        ],
                    },
                ],
            });
            const layerPopup2 = new LayerPopup({
                items: [
                    {
                        layer: layer2,
                        fields: [
                            {
                                field: 'NAME_CHN',
                                formatField: () => '国家',
                            },
                            {
                                field: 'gdp',
                                formatField: () => 'GDP',
                                formatValue: (val) => {
                                    return val < 0.00001 ? `${val * 10000 * 10000}美元` : `${val.toFixed(2)}亿美元`;

                                }

                            },
                        ],
                    },
                ],
            });


            scene.addPopup(layerPopup1);
            scene.addPopup(layerPopup2);

            scene.addLayer(layer1);
            scene.addLayer(layer2);
            scene.addLayer(layer3);
        });


    const belt = await (await fetch('https://gw.alipayobjects.com/os/rmsportal/UpapMomPYUeiBjbHNAma.json')).json();
    const line = await (await fetch('https://gw.alipayobjects.com/os/rmsportal/kwUdcXnxQtexeGRvTGtA.json')).json();
    const line2 = await (await fetch('https://gw.alipayobjects.com/os/rmsportal/dzpMOiLYBKxpdmsgBLoE.json')).json();
    const point = await (await fetch('https://gw.alipayobjects.com/os/rmsportal/opYqFyDGyGUAUXkLUhBV.json')).json();
    const fillLayer = new PolygonLayer({
        autoFit: false
    }).source(belt).color('cname', function (value) {
        return value == '中国' ? 'rgba(46,149,169,0.45)' : 'rgba(227,244,244,1)';
    }).shape('fill');

    const linelayer = new LineLayer({ zIndex: 2 }).source(line).color('rgb(79,147,234)').size(1.5).shape('line');
    const linelayer_2 = new LineLayer({ zIndex: 1 }).source(line2).color('#fff').size(2).shape('line');

    const linelayer2 = new LineLayer({ zIndex: 2 }).source(line2).color('rgb(173,113,55)').size(1).shape('line').style({
        stroke: '#f00',
        strokeWidth: 2,
    })

    const pointlayer = new PointLayer({ zIndex: 1 }).source(point).size(5.0).shape('circle').color('Id', (id) => {
        return id < 30 ? '#027aff' : 'rgb(173,113,55)'

    }).style({
        stroke: '#000',
        strokeWidth: 1
    });

    const textlayer = new PointLayer({ zIndex: 3 }).source(point).size(10.0).shape('name', 'text').color('Id', (id) => {
        return id < 29 ? '#027aff' : 'rgb(173,113,55)'

    }).style({
        textOffset: [0, -20],
        stroke: '#fff',
        strokeWidth: 2,
        textAnchor: 'bottom',

    })
    scene.addLayer(fillLayer)
    scene.addLayer(linelayer)
    scene.addLayer(linelayer_2)
    scene.addLayer(linelayer2)
    scene.addLayer(pointlayer)
    scene.addLayer(textlayer)

    const legend = new Control(
        { position: 'bottomright' }
    )
    // 0, 1000, 5000, 10000, 100000, 300000
    legend.onAdd = () => {
        var div = DOM.create('div', 'info legend'),
            grades = [0, 1000, 5000, 10000, 100000, -999],
            labels = [],
            grades2 = [0, '1千', '5千', '1万', '10万', '30万/亿美元'];

        // loop through our density intervals and generate a label with a colored square for each interval



        for (var i = 0; i < grades.length; i++) {
            if (i < grades.length - 1) {
                div.innerHTML += '<i style="background:' + getColor(grades[i] + 1, ['#c7e9b4', '#7fcdbb', '#41b6c4', '#2c7fb8', '#253494']) + '"></i>';
            } else {

                div.innerHTML += '<i style=" width: 100px; margin-left: 10px; background:' + getColor(grades[i] + 1, ['#c7e9b4', '#7fcdbb', '#41b6c4', '#2c7fb8', '#253494']) + '">非一带一路国家</i>';

            }

        }
        div.innerHTML += '<br>'
        for (let i = 0; i < grades.length; i++) {
            if (i < grades.length - 1) {
                div.innerHTML += '<i style="background:' + getColor(grades[i] + 1, ['#fdd49e', '#fdbb84', '#fc8d59', '#e34a33', '#b30000']) + '"></i>';
            }
            else {

                div.innerHTML += '<i style=" width: 100px; margin-left: 10px; background:' + getColor(grades[i] + 1, ['#c7e9b4', '#7fcdbb', '#41b6c4', '#2c7fb8', '#253494']) + '">一带一路国家</i>';

            }
        }
        div.innerHTML += '<br>'

        for (let i = 0; i < grades2.length; i++) {
            if (i < grades.length - 1) {
                div.innerHTML += `<i>${grades2[i]}</>`
            } else {
                div.innerHTML += `<i style=" width: 100px;">${grades2[i]}</>`
            }

        }
        return div;
    }

    scene.addControl(legend)


});
