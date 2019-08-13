import * as THREE from '../../../core/three';
import { ArcLineMaterial } from '../../../geom/material/lineMaterial';
import { getBuffer } from '../../../geom/buffer/';
export default function DrawArcLine(layerData, layer, buffer) {
  const style = layer.get('styleOptions');
  const activeOption = layer.get('activedOptions');
  if (!buffer) {
    const geometryBuffer = getBuffer(layer.type, layer.shapeType);
    buffer = new geometryBuffer({
      layerData,
      shapeType: layer.shapeType,
      style
    });

  }
  const { attributes, indexArray } = buffer;
  const geometry = new THREE.BufferGeometry();
  geometry.setIndex(new THREE.Uint32BufferAttribute(indexArray, 1));
  geometry.addAttribute('position', new THREE.Float32BufferAttribute(attributes.positions, 3));
  geometry.addAttribute('pickingId', new THREE.Float32BufferAttribute(attributes.pickingIds, 1));
  geometry.addAttribute('a_color', new THREE.Float32BufferAttribute(attributes.colors, 4));
  geometry.addAttribute('a_instance', new THREE.Float32BufferAttribute(attributes.instanceArray, 4));
  geometry.addAttribute('a_size', new THREE.Float32BufferAttribute(attributes.sizes, 1));
  const lineMaterial = new ArcLineMaterial({
    u_opacity: style.opacity,
    u_zoom: layer.scene.getZoom(),
    activeColor: activeOption.fill,
    shapeType: layer.shapeType
  }, {
    SHAPE: false
  });
  const arcMesh = new THREE.Mesh(geometry, lineMaterial);
  return arcMesh;
}
