import * as THREE from '../../../core/three';
import GridMaterial from '../../../geom/material/hexagon';
import { getBuffer } from '../../../geom/buffer/';
import { generateLightingUniforms } from '../../../util/shaderModule';
export default function DrawHexagon(layerData, layer, source) {
  const style = layer.get('styleOptions');
  const { fill } = layer.get('activedOptions');
  const { radius } = source.data;
  const { opacity, angle = 0, coverage, lights } = style;
  const geometryBuffer = getBuffer(layer.type, 'shape');
  const buffer = new geometryBuffer({
    layerData,
    shapeType: layer.shapeType
  });
  const { attributes, instanceGeometry } = buffer;
  const instancedGeometry = new THREE.InstancedBufferGeometry();
  instancedGeometry.setIndex(instanceGeometry.indexArray);
  instancedGeometry.addAttribute('miter', new THREE.Float32BufferAttribute(instanceGeometry.positions, 3));
  if (instanceGeometry.normals) {
    instancedGeometry.addAttribute('normal', new THREE.Float32BufferAttribute(instanceGeometry.normals, 3));
  }
  instancedGeometry.addAttribute('position', new THREE.InstancedBufferAttribute(new Float32Array(attributes.positions), 3));
  instancedGeometry.addAttribute('a_color', new THREE.InstancedBufferAttribute(new Float32Array(attributes.colors), 4));
  instancedGeometry.addAttribute('pickingId', new THREE.InstancedBufferAttribute(new Float32Array(attributes.pickingIds), 1));
  instancedGeometry.addAttribute('a_size', new THREE.InstancedBufferAttribute(new Float32Array(attributes.sizes), 1));

  const material = new GridMaterial({
    u_opacity: opacity,
    u_radius: radius,
    u_angle: angle / 180 * Math.PI,
    u_coverage: coverage,
    u_activeColor: fill,
    ...generateLightingUniforms(lights)
  }, {
    SHAPE: false,
    LIGHTING: !!instanceGeometry.normals
  });
  const hexgonMesh = new THREE.Mesh(instancedGeometry, material);
  return hexgonMesh;
}

