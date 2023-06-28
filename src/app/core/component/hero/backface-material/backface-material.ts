import { BackSide, ShaderMaterial } from 'three';
// @ts-ignore
import vertexShader from './vertex.glsl';
// @ts-ignore
import fragmentShader from './fragment.glsl';

export default class BackfaceMaterial extends ShaderMaterial {
  constructor(options: any) {
    super({
      vertexShader,
      fragmentShader,
      side: BackSide,
    });
  }
}
