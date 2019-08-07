import * as THREE from '../../three';

// This can be imported from anywhere and will still reference the same scene,
// though there is a helper reference in Engine.pickingScene

export default (function() {
  const scene = new THREE.Scene();
  return scene;
})();
