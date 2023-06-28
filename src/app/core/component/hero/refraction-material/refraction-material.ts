import { ShaderMaterial } from 'three';
// @ts-ignore
import vertexShader from './vertex.glsl';
// @ts-ignore
import fragmentShader from './fragment.glsl';

export default class RefractionMaterial extends ShaderMaterial {
  constructor(options: any) {
    super({
      vertexShader,
      fragmentShader,
    });

    this.uniforms = {
      envMap: { value: options.envMap },
      backfaceMap: { value: options.backfaceMap },
      resolution: { value: options.resolution },
    };
  }
}
