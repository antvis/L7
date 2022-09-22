import { IRasterFileData, IRasterFormat, IBandsOperation, IRasterData } from '../../interface';

export async function bandsOperation(imageDataList: IRasterFileData[], rasterFormat: IRasterFormat, operation: IBandsOperation|undefined) {
    let bandData = (await Promise.all(
    imageDataList.map(({ data, bands }) => rasterFormat(data, bands)),
    )) as IRasterData[];
    // @ts-ignore 
    bandData = bandData.flat();
    // Tip: rasterFormat 返回值 rasterData|rasterData[]

    const { width, height } = bandData[0];
    let rasterData: HTMLImageElement | Uint8Array | ImageBitmap | null | undefined;
    switch (typeof operation) {
      case 'function':
        rasterData = operation(bandData) as Uint8Array;
        break;
      case 'object':
        // 波段计算表达式 - operation
        // const bandExpress = [
        //   '+',
        //   ['*', ['bands', 0], ['number', 1/2]],
        //   ['*', ['bands', 1], ['number', 1/3]]
        // ];

        rasterData = bandData[0].rasterData;
        break;
      default:
        rasterData = bandData[0].rasterData;
    }
    return {
        rasterData,
        width,
        height
    }
}