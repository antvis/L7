import { circle } from './Path';
import { ArrowType, IArrowOptions, ILineSymbol } from '../interface'
import earcut from 'earcut';

export interface IArrowData {
    vertices: number[];
    indices: number[];
    dimensions: number;
    offset?: number[];
}
const maxArrowWidthMap = {
    circle: 2,
    triangle: 2,
    diamond: 4,
    rect: 4,
    classic: 3,
    halfTriangle: 2,

}
export type arrowPosition = -1 | 1;
export function halfTriangleArrow(dir: arrowPosition, options: IArrowOptions): IArrowData {
    const { width = 2, height = 2 } = options;
    return {
        vertices: [
            0, - (height - 1) * dir,
            1 * dir * (width), (height + 1) * dir,
            1 * dir * (width), - (height - 1) * dir,
        ],
        indices: [0, 1, 2],
        dimensions: 2,
        offset: [0, 0, 0, 0, 0, 0, 0, 0, 0]
    };

}
export function triangleArrow(dir: arrowPosition, options: IArrowOptions): IArrowData {
    const { width = 2, height = 3 } = options;
    return {
        vertices: [
            0, 0,
            1 * dir * width, 1 * height,
            1 * dir * width, -1 * height,
        ],
        indices: [0, 1, 2],
        dimensions: 2,
        offset: [0, 0, 0, 0, 0, 0, 0, 0, 0]
    };
}
export function rectArrow(dir: arrowPosition, options: IArrowOptions): IArrowData {
    const { width = 2, height = 2 } = options;
    return {
        vertices: [0, height, dir * width * 2, height, dir * width * 2, - height, 0, -height],
        dimensions: 2,
        indices: [0, 1, 2, 0, 2, 3]
    }
}
export function diamondArrow(dir: arrowPosition, options: IArrowOptions): IArrowData {
    const { width = 2, height = 3 } = options;
    return {
        vertices: [0, 0, 1 * width * dir, 0.5 * height, 2 * width * dir, 0, 1 * width * dir, -0.5 * height],
        dimensions: 2,
        indices: [0, 1, 2, 0, 2, 3]
    }
}
export function classicArrow(dir: arrowPosition, options: IArrowOptions): IArrowData {
    const { width = 2, height = 3 } = options;
    return {
        vertices: [
            0, 0,
            2 * dir * width, 1 * height,
            1.5 * dir * width, 0,
            2 * dir * width, -1 * height,
        ],
        dimensions: 2,
        indices: [0, 1, 2, 0, 2, 3]
    }

}

export function circleArraw(dir: arrowPosition, options: IArrowOptions): IArrowData {
    const { width = 2, height = 2 } = options;
    const path = circle();
    const flattengeo = earcut.flatten([path]);
    const triangles = earcut(flattengeo.vertices, flattengeo.holes, flattengeo.dimensions);
    return {
        // @ts-ignore
        vertices: path.map((t) => [t[0]*width*dir, t[1]* height]).flat(),
        dimensions: 2,
        indices: triangles
    }

}

export function lineArrowPath(coord: number[], indexOffset: number = 0, symbol: ILineSymbol): IArrowData {
    const sourceType =  typeof symbol['source'] === 'object' ? symbol['source'].type : symbol['source'];
    const targetType =  typeof symbol['target'] === 'object' ? symbol['target'].type : symbol['target'];
    const { width: sourceWidth = sourceType ? maxArrowWidthMap[sourceType]:0, height: sourceHeight = 2 } = typeof symbol['source'] === 'object' ? symbol['source'] : {};
    const { width: targetWidth = targetType ? maxArrowWidthMap[targetType]:0, height: targetHeight = 2 } = typeof symbol['target'] === 'object' ? symbol['target'] : {};
    return {
        vertices: [
            0, 1 / 2, 1 * sourceWidth, ...coord,
            1, 1 / 2, -1 * targetWidth, ...coord,
            1, -1 / 2, -1 * targetWidth, ...coord,
            0, -1 / 2, 1 * sourceWidth, ...coord],
        indices: [0, 1, 2, 0, 2, 3].map((t) => t + indexOffset),
        dimensions: 2,

    }

}

export function getSymbol(type: ArrowType | IArrowOptions, position: 'source' | 'target') {
    const shape = typeof type === 'object' ? type.type : type;
    const dir = position === 'source' ? 1 : -1;
    const option = typeof type === 'object' ? type : {} as IArrowOptions;
    switch (shape) {
        case 'circle':
            return circleArraw(dir, option);
        case 'triangle':
            return triangleArrow(dir, option);
        case 'diamond':
            return diamondArrow(dir, option);
        case 'rect':
            return rectArrow(dir, option);
        case 'classic':
            return classicArrow(dir, option);
        case 'halfTriangle':
            return halfTriangleArrow(dir, option);
        default:
            return {
                vertices: [],
                indices: [],
                dimensions: 2,
            };


    }

}