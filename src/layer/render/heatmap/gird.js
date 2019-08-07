import * as THREE from '../../../core/three';
import GridMaterial from '../../../geom/material/grid';
import { getBuffer } from '../../../geom/buffer/';
import { generateLightingUniforms } from '../../../util/shaderModule';
export default function DrawGrid(layerData, layer, source) {
  const { opacity, coverage, lights } = layer.get('styleOptions');
  const activeOption = layer.get('activedOptions');
  const { xOffset, yOffset } = source.data;

  // const attributes = new gridBuffer(layerdata);
  const geometryBuffer = getBuffer(layer.type, layer.shapeType);
  const buffer = new geometryBuffer({
    layerData,
    shapeType: layer.shapeType
  });
  const { attributes, indexArray } = buffer;
  const geometry = new THREE.BufferGeometry();
  geometry.setIndex(new THREE.Uint32BufferAttribute(indexArray, 1));
  geometry.addAttribute('position', new THREE.Float32BufferAttribute(attributes.positions, 3));
  geometry.addAttribute('miter', new THREE.Float32BufferAttribute(attributes.miters, 3));
  geometry.addAttribute('a_color', new THREE.Float32BufferAttribute(attributes.colors, 4));
  geometry.addAttribute('pickingId', new THREE.Float32BufferAttribute(attributes.pickingIds, 1));
  geometry.addAttribute('normal', new THREE.Float32BufferAttribute(attributes.normals, 3));

  const material = new GridMaterial({
    u_opacity: opacity,
    u_xOffset: xOffset,
    u_yOffset: yOffset,
    u_coverage: coverage,
    u_activeColor: activeOption.fill,
    ...generateLightingUniforms(lights)
  }, {
    SHAPE: false,
    LIGHTING: layer.shapeType !== 'square'
  });
  const gridMesh = new THREE.Mesh(geometry, material);
  return gridMesh;
}

