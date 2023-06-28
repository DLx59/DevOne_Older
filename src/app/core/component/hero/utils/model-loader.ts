import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";

const modelMap = new Map();
const loader = new GLTFLoader();

export default (url) => {
  return new Promise((resolve, reject) => {
    const data = modelMap.get(url);

    console.log(modelMap, url);

    if (data) {
      resolve(data);
      return;
    }

    loader.load(url, gltf => {
      const animations = gltf.animations || null;
      const result = { model: gltf.scene.clone(true), animations };
      modelMap.set(url, result);
      resolve(result);
    });
  });
};
