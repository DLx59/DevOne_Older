import * as THREE from 'three';
import { Mesh } from 'three';
// @ts-ignore
import fragment from '../shaders/glass/fragment.glsl';
// @ts-ignore
import vertex from '../shaders/glass/vertex.glsl';

export function createDiamond(): {
  mesh: Mesh;
  update: (texture: THREE.Texture, camera: THREE.Camera) => void;
} {
  // set up the sphere
  const geometry = new THREE.OctahedronGeometry(2.5);

  const material = new THREE.ShaderMaterial({
    vertexShader: vertex,
    fragmentShader: fragment,
    uniforms: {
      iChannel0: { value: null },
      uCameraPosition: { value: new THREE.Vector3() },
    },
  });

  const mesh = new THREE.Mesh(geometry, material);

  const update = (texture: THREE.Texture, camera: THREE.Camera) => {
    material.uniforms['iChannel0'].value = texture;
    material.uniforms['uCameraPosition'].value.copy(camera.position);
  };

  return { mesh, update };
}
