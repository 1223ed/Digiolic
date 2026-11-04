import { DRACOLoader } from '../salesforce-app/node_modules/three/examples/jsm/loaders/DRACOLoader.js';
if (typeof window !== 'undefined' && window.THREE) {
  window.THREE.DRACOLoader = DRACOLoader;
}
export { DRACOLoader };
