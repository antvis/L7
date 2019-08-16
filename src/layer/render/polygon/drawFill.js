import * as THREE from '../../../core/three';
import PolygonMaterial from '../../../geom/material/polygonMaterial';
import { generateLightingUniforms } from '../../../util/shaderModule';
import { getBuffer } from '../../../geom/buffer/';

export default function DrawPolygonFill(layerData, layer, buffer) {
  const style = layer.get('styleOptions');
  const activeOption = layer.get('activedOptions');
  const config = {
    ...style,
    activeColor: activeOption.fill
  };
  const { opacity, activeColor, lights } = config;
  if (!buffer) {
    const geometryBuffer = getBuffer(layer.type, layer.shape);
    buffer = new geometryBuffer({
      layerData
    });

  }
  const { attributes, indexArray } = buffer;
  const geometry = new THREE.BufferGeometry();
  if (indexArray) {
    geometry.setIndex(new THREE.Uint32BufferAttribute(indexArray, 1));
  }
  geometry.addAttribute('position', new THREE.Float32BufferAttribute(attributes.positions, 3));
  geometry.addAttribute('a_color', new THREE.Float32BufferAttribute(attributes.colors, 4));
  geometry.addAttribute('pickingId', new THREE.Float32BufferAttribute(attributes.pickingIds, 1));
  geometry.computeVertexNormals();
  const material = new PolygonMaterial({
    u_opacity: opacity,
    u_activeColor: activeColor,
    ...generateLightingUniforms(lights)
  }, {
    SHAPE: false,
    LIGHTING: true
  });
  const fillPolygonMesh = new THREE.Mesh(geometry, material);
  delete attributes.vertices;
  delete attributes.colors;
  delete attributes.pickingIds;
  delete attributes.normals;
  return fillPolygonMesh;
}

