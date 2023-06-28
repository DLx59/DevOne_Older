import {MathUtils, TextureLoader} from "three";

const tl = new TextureLoader();
const cache = new Map();

export default function loadTexture(url: string) {
  return new Promise(resolve => {
    const data = cache.get(url);

    if (data) {
      resolve(data);
    }

    tl.load(url, data => {
      if (
        !MathUtils.isPowerOfTwo(data.image.width) ||
        !MathUtils.isPowerOfTwo(data.image.height)
      ) {
        console.warn(`>>> "${url}" image size is not power of 2 <<<`);
      }

      cache.set(url, data);
      data.needsUpdate = true;
      resolve(data);
    });
  });
}
