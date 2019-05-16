import * as THREE from '../../../core/three';
import PolygonBuffer from '../../../geom/buffer/polygon';
import PolygonMaterial from '../../../geom/material/polygonMaterial';

export default function DrawPolygonFill(layerData, layer) {
  const style = layer.get('styleOptions');
  const activeOption = layer.get('activedOptions');
  const config = {
    ...style,
    activeColor: activeOption.fill
  };
  const { opacity, activeColor } = config;
  const { attributes } = new PolygonBuffer({
    shape: layer.shape,
    layerData
  });
  const geometry = new THREE.BufferGeometry();
  geometry.addAttribute('position', new THREE.Float32BufferAttribute(attributes.vertices, 3));
  geometry.addAttribute('a_color', new THREE.Float32BufferAttribute(attributes.colors, 4));
  geometry.addAttribute('pickingId', new THREE.Float32BufferAttribute(attributes.pickingIds, 1));
  geometry.addAttribute('normal', new THREE.Float32BufferAttribute(attributes.normals, 3));
  const material = new PolygonMaterial({
    u_opacity: opacity,
    u_activeColor: activeColor
  }, {
    SHAPE: false
  });
  const fillPolygonMesh = new THREE.Mesh(geometry, material);
  return fillPolygonMesh;
}

