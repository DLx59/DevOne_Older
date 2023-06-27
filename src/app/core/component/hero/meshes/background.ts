import * as THREE from 'three';
import { MeshBasicMaterial } from 'three';
// @ts-ignore
import fragment from '../shaders/grid/fragment.glsl';
// @ts-ignore
import vertex from '../shaders/grid/vertex.glsl';

export function createBackground() {
  const geometry = new THREE.SphereGeometry(20, 20, 20);
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uGridSize: { value: 20.0 },
    },
    vertexShader: vertex,
    fragmentShader: fragment,
    side: THREE.DoubleSide,
  });

  return new THREE.Mesh(geometry, material);
}
