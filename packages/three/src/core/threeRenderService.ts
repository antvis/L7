import type { IMapService, IMercator, IRendererService } from '@antv/l7';
import type { Camera } from 'three';
import { Matrix4, PerspectiveCamera, Scene as ThreeScene, WebGLRenderer } from 'three';
const DEG2RAD = Math.PI / 180;
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
    /**
     * map version
     * GAODE
     * MAPBOX
     */
    switch (this.mapService.version) {
      case 'GAODE':
        // TODO: 支持 GAODE 地图
        throw new Error('不暂时支持 GAODE 地图');
      // return this.AMapCamera();
      case 'MAPBOX':
        return this.mapboxCamera();
      case 'DEFAULTMAP':
        return this.mapboxCamera();
      default:
        return this.mapboxCamera();
    }
    // return this.mapService.constructor.name === 'AMapService'
    //   ? this.AMapCamera()
    //   : this.mapboxCamera();
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
    // @ts-ignore
    const mapCamera = this.mapService.map.getCameraState();
    const camera = this.camera;
    let { pitch, rotation } = mapCamera;
    const { fov, near, far, height, aspect } = mapCamera;
    pitch *= DEG2RAD;
    rotation *= DEG2RAD;
    // @ts-ignore
    camera.fov = (180 * fov) / Math.PI;
    // @ts-ignore
    camera.aspect = aspect;
    // @ts-ignore
    camera.near = near;
    // @ts-ignore
    camera.far = far;
    // @ts-ignore
    camera.updateProjectionMatrix();
    camera.position.z = height * Math.cos(pitch);
    camera.position.x = height * Math.sin(pitch) * Math.sin(rotation);
    camera.position.y = -height * Math.sin(pitch) * Math.cos(rotation);
    camera.up.x = -Math.cos(pitch) * Math.sin(rotation);
    camera.up.y = Math.cos(pitch) * Math.cos(rotation);
    camera.up.z = Math.sin(pitch);
    camera.lookAt(0, 0, 0);
    camera.position.x += mapCamera.position.x;
    camera.position.y += -mapCamera.position.y;
    return camera;
  }
}
