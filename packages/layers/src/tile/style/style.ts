import { ILayer } from "@antv/l7-core";

const ProxyFuncs = [
    /**
     * 1. 需要作用到所属子图层才会生效的方法
     * 2. 不需要主动重新创建 model 的方法
     */
    'shape',
    'color',
    'size',
    'style',
    'filter',
    'scale',
    'setBlend',
    'setSelect',
    'setActive',
]

export class LayerStyleProxy {

    getLayers(layer: ILayer){
        return layer.tileLayer.getLayers();
    }

    getTiles(layer: ILayer) {
        return layer.tileLayer.tileLayerService.getTiles();
    }

    proxy(parent: ILayer) {
        ProxyFuncs.forEach(func => {
            // @ts-ignore
            const oldStyleFunc = parent[func].bind(parent);
            // @ts-ignore
            parent[func] = (...args: any) => {
                oldStyleFunc(...args);
                this.getLayers(parent).map(child =>{
                    // @ts-ignore
                    child[func](...args);
                })
                // Tip: 目前在更新 RasterData 的 colorTexture 的时候需要额外优化
                if(func === 'style') {
                    this.getTiles(parent).forEach(tile => tile.styleUpdate(...args));
                }
                
                return parent;
            }
        })
    }

}

// const oldStyleFunc = parent.color.bind(parent);
// parent.color = (...args) => {
//     oldStyleFunc(...args);
//     getLayers(parent).map(child =>{
//         child.color(...args);
//     })
//     return parent;
// }