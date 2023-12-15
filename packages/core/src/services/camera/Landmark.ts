import { mat4, vec3 } from 'gl-matrix';
import type Camera from './Camera';

/**
 * 保存相机状态，便于后续在多个 Landmark 间移动
 */
export default class Landmark {
  public name: string;

  private matrix: mat4;
  private right: vec3;
  private up: vec3;
  private forward: vec3;
  private position: vec3;
  private focalPoint: vec3;
  private distanceVector: vec3;
  private distance: number;
  private dollyingStep: number;
  private azimuth = 0;
  private elevation = 0;
  private roll = 0;
  private relAzimuth = 0;
  private relElevation = 0;
  private relRoll = 0;

  constructor(name: string, c: Camera) {
    this.name = name;

    this.matrix = mat4.clone(c.matrix);
    this.right = vec3.clone(c.right);
    this.up = vec3.clone(c.up);
    this.forward = vec3.clone(c.forward);
    this.position = vec3.clone(c.position);
    this.focalPoint = vec3.clone(c.focalPoint);
    this.distanceVector = vec3.clone(c.distanceVector);

    this.azimuth = c.azimuth;
    this.elevation = c.elevation;
    this.roll = c.roll;
    this.relAzimuth = c.relAzimuth;
    this.relElevation = c.relElevation;
    this.relRoll = c.relRoll;
    this.dollyingStep = c.dollyingStep;
    this.distance = c.distance;
  }

  public retrieve(c: Camera) {
    c.matrix = mat4.copy(c.matrix, this.matrix);
    c.right = vec3.copy(c.right, this.right);
    c.up = vec3.copy(c.up, this.up);
    c.forward = vec3.copy(c.forward, this.forward);
    c.position = vec3.copy(c.position, this.position);
    c.focalPoint = vec3.copy(c.focalPoint, this.focalPoint);
    c.distanceVector = vec3.copy(c.distanceVector, this.distanceVector);

    c.azimuth = this.azimuth;
    c.elevation = this.elevation;
    c.roll = this.roll;
    c.relAzimuth = this.relAzimuth;
    c.relElevation = this.relElevation;
    c.relRoll = this.relRoll;
    c.dollyingStep = this.dollyingStep;
    c.distance = this.distance;
  }
}
