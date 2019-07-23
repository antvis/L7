import * as THREE from '../../../core/three';
import LineBuffer from '../../../geom/buffer/line';
import { ArcLineMaterial } from '../../../geom/material/lineMaterial';
export default function DrawArcLine(layerdata, layer) {
  const style = layer.get('styleOptions');
  const activeOption = layer.get('activedOptions');
  const { attributes } = new LineBuffer({
    layerData: layerdata,
    shapeType: 'arc',
    style
  });
  const geometry = new THREE.BufferGeometry();
  geometry.setIndex(attributes.indexArray);
  geometry.addAttribute('pickingId', new THREE.Float32BufferAttribute(attributes.pickingIds, 1));
  geometry.addAttribute('position', new THREE.Float32BufferAttribute(attributes.positions, 3));
  geometry.addAttribute('a_color', new THREE.Float32BufferAttribute(attributes.colors, 4));
  geometry.addAttribute('a_instance', new THREE.Float32BufferAttribute(attributes.instances, 4));
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
