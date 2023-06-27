import * as THREE from 'three';
import { Mesh } from 'three';
import { Font, FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
// @ts-ignore
import chromaticAberrationFragmentShader from '../shaders/text/chromaticAberration.glsl';
// @ts-ignore
import vertex from '../shaders/glass/vertex.glsl';

export function createDevText(): Promise<{ mesh: Mesh; update: Function }> {
  return new Promise((resolve) => {
    const fontLoader = new FontLoader();
    const fontUrl = '../../../../assets/fonts/Hanson_Bold.json'; // Remplacez par le chemin vers votre fichier JSON de police

    fontLoader.load(fontUrl, (font: Font) => {
      const textGeometry = new TextGeometry('DEV', {
        font: font,
        size: 1,
        height: 0.1,
        curveSegments: 4,
        bevelEnabled: true,
        bevelThickness: 0.2,
        bevelSize: 0.1,
        bevelSegments: 3,
      });

      textGeometry.translate(-1.5, 0, 0);
      textGeometry.computeVertexNormals(); // Calcul des normales

      const material = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0.0 },
          resolution: { value: new THREE.Vector2() },
          textColor: { value: new THREE.Color(0x82d782) },
        },
        fragmentShader: chromaticAberrationFragmentShader,
        vertexShader: vertex,
      });

      const mesh = new THREE.Mesh(textGeometry, material);

      const update = () => {
        material.uniforms['resolution'].value.x = window.innerWidth;
        material.uniforms['resolution'].value.y = window.innerHeight;
      };

      resolve({ mesh, update });
    });
  });
}
