import type { Device } from '@antv/g-device-api';
import { Format, TextureDimension, TextureUsage } from '@antv/g-device-api';

async function loadImage(url: string) {
  const imgBitmap = await createImageBitmap(await fetch(url).then((response) => response.blob()));
  return imgBitmap;
}

export async function generateTexture(device: Device, url: string) {
  // 创建纹理和纹理视图
  const image = await loadImage(
    'https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*p4PURaZpM-cAAAAAAAAAAAAADmJ7AQ/original',
  );

  const texture = device.createTexture({
    format: Format.F32_RGBA,
    width: image.width,
    height: image.height,
    usage: TextureUsage.SAMPLED,
    dimension: TextureDimension.TEXTURE_2D,
    mipLevelCount: 1,
  });
  texture.setImageData([image]);
  return texture;
}

export async function createTexture(
  device: Device,
  width: number,
  height: number,
  data: Uint8Array,
) {
  // 创建纹理和纹理视图
  const texture = device.createTexture({
    format: Format.U8_RGBA_NORM,
    width,
    height,
    usage: TextureUsage.SAMPLED,
    dimension: TextureDimension.TEXTURE_2D,
    mipLevelCount: 1,
  });
  // @ts-ignore
  const rawDevice = device.device;
  rawDevice.queue.writeTexture(
    // @ts-ignore
    { texture: texture.gpuTexture },
    data,
    { bytesPerRow: width * 4 },
    { width: width, height: height },
  );

  // texture.setImageData([img]);
  return texture;
}
