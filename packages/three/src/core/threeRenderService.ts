import type { IMapService, IMercator, IRendererService } from '@antv/l7';
import type { Camera } from 'three';
import { Matrix4, PerspectiveCamera, Scene as ThreeScene, WebGLRenderer } from 'three';

export interface IThreeRenderService {
  renderer: WebGLRenderer;
  camera: Camera;
  center: IMercator;
  init(): void;
  getRenderCamera(): Camera;
}

export class ThreeRenderService implements IThreeRenderService {
  public renderer: WebGLRenderer;
  public camera: Camera;
  public center: IMercator;
  public aspect: number;
  public update: () => void;
  private scene: ThreeScene;

  // 初始状态相机变换矩阵
  private cameraTransform: Matrix4;

  constructor(
    private readonly rendererService: IRendererService,
    private readonly mapService: IMapService,
  ) {
    this.rendererService = rendererService;
    this.mapService = mapService;
  }

  public init() {
    // 从 L7 的 renderer 中获取可视化层的 canvas/gl
    const canvas = this.rendererService.getCanvas() as HTMLCanvasElement;
    const gl = this.rendererService.getGLContext();
    if (canvas && gl) {
      const center = this.mapService.getCenter();
      this.center = this.mapService.lngLatToMercator([center.lng, center.lat], 0);
    }
    const { x, y, z } = this.center;
    this.cameraTransform = new Matrix4().makeTranslation(x, y, z);

    // 根据 L7 的 canvas/gl 构建 threejs 的 renderer
    this.renderer = new WebGLRenderer({
      canvas,
      context: gl,
      antialias: true,
    });

    this.renderer.autoClear = false;
    // 是否需要 gamma correction?
    this.renderer.gammaFactor = 2.2;
    this.renderer.shadowMap.enabled = true;
    // this.renderer.shadowMap.type = PCFSoftShadowMap;

    this.scene = new ThreeScene();

    this.aspect = gl.drawingBufferWidth / gl.drawingBufferHeight;
    this.camera = new PerspectiveCamera(45, this.aspect, 1, 20000000);
  }

  public getRenderCamera(): Camera {
    switch (this.mapService.getType()) {
      case 'amap':
        return this.AMapCamera();
      case 'mapbox':
        return this.mapboxCamera();
      case 'default':
        return this.mapboxCamera();
      default:
        throw new Error('不支持其它地图');
    }
  }

  private mapboxCamera(): Camera {
    const mercatorMatrix = new Matrix4().fromArray(
      // @ts-ignore
      this.mapService.map.transform.customLayerMatrix(),
    );
    this.camera.projectionMatrix = mercatorMatrix.multiply(this.cameraTransform);
    return this.camera;
  }

  private AMapCamera(): Camera {
    // @ts-expect-error
    const customCoords = this.mapService.map.customCoords;
    customCoords.setCenter([0, 0]);

    const camera = this.camera;
    const { near, far, fov, up, lookAt, position } = customCoords.getCameraParams();
    // @ts-ignore
    camera.near = near;
    // @ts-ignore
    camera.far = far;
    // @ts-ignore
    camera.fov = fov;
    // @ts-ignore
    camera.position.set(...position);
    // @ts-ignore
    camera.up.set(...up);
    // @ts-ignore
    camera.lookAt(...lookAt);
    // @ts-ignore
    camera.updateProjectionMatrix();

    return camera;
  }
}
