import * as THREE from '../../../core/three';
import { getBuffer } from '../../../geom/buffer/';
import PolygonMaterial from '../../../geom/material/polygonMaterial';
import { generateLightingUniforms } from '../../../util/shaderModule';
export default function Draw3DShape(layerData, layer) {
  const style = layer.get('styleOptions');
  const activeOption = layer.get('activedOptions');
  const geometryBuffer = getBuffer('shape', 'extrude');
  const buffer = new geometryBuffer({
    layerData,
    shapeType: layer.shapeType
  });
  const { attributes, indexArray } = buffer;
  const geometry = new THREE.BufferGeometry();
  geometry.setIndex(new THREE.Uint32BufferAttribute(indexArray, 1));
  geometry.addAttribute('position', new THREE.Float32BufferAttribute(attributes.positions, 3));
  geometry.addAttribute('a_color', new THREE.Float32BufferAttribute(attributes.colors, 4));
  geometry.addAttribute('pickingId', new THREE.Float32BufferAttribute(attributes.pickingIds, 1));
  geometry.addAttribute('normal', new THREE.Float32BufferAttribute(attributes.normals, 3));
  geometry.addAttribute('a_shape', new THREE.Float32BufferAttribute(attributes.miters, 3));
  geometry.addAttribute('a_size', new THREE.Float32BufferAttribute(attributes.sizes, 3));

  const material = new PolygonMaterial({
    u_opacity: style.opacity,
    u_activeColor: activeOption.fill,
    u_zoom: layer.scene.getZoom(),
    ...generateLightingUniforms(style.lights)
  }, {
    SHAPE: true,
    LIGHTING: true
  });
  material.setDefinesvalue('SHAPE', true);
  material.setBending(style.blending || 'normal');
  const fillMesh = new THREE.Mesh(geometry, material);
  return fillMesh;
}

