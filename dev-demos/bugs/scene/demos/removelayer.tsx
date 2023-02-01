import { Scene, PointLayer } from "@antv/l7";
import { GaodeMap } from "@antv/l7-maps";
import React from "react";
export default function App() {
    React.useEffect(() => {
        const scene = new Scene({
            id: "map",
            map: new GaodeMap({
                style: "light",
                center: [140.067171, 36.26186],
                zoom: 5.32,
                maxZoom: 10
            })
        });
        scene.on("loaded", () => {
            fetch(
                "https://gw.alipayobjects.com/os/basement_prod/d3564b06-670f-46ea-8edb-842f7010a7c6.json"
            )
                .then((res) => res.json())
                .then((data) => {
                    const pointLayer = new PointLayer({})
                        .source(data)
                        .shape("circle")
                        .size("mag", [1, 25])
                        .color("mag", (mag) => {
                            return mag > 4 && "yellow";
                        })
                        .active(true)
                        .style({
                            opacity: 0.3,
                            strokeWidth: 1
                        });
                    const point2Layer = new PointLayer({})
                        .source(data)
                        .shape("circle")
                        .size("mag", [1, 25])
                        .color("mag", (mag) => {
                            return mag < 4 && "red";
                        })
                        .active(true)
                        .style({
                            opacity: 0.3,
                            strokeWidth: 1
                        });
                    scene.addLayer(pointLayer);
                    scene.addLayer(point2Layer);
                    setTimeout(async() => {
                         scene.removeLayer(pointLayer)
                         scene.removeLayer(point2Layer)
                      
                    }, 1000);
                    // setTimeout(() => {
                    //   scene.render();
                    // }, 2000);
                });
        });
    }, []);
    return <div
        id="map"
        style={{
            height: '500px',
            position: 'relative',
        }}
    />
}
