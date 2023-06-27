import { Mesh, MeshBasicMaterial, Scene } from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';

export function addText(text: string, scene: Scene): void {
  const fontLoader = new FontLoader();
  let mesh: Mesh;

  fontLoader.load('../../../../assets/fonts/Hanson_Bold.json', (font) => {
    // Create text geometry
    const textGeometry = new TextGeometry(text, {
      font: font,
      size: 0.75,
      height: 0.001,
      curveSegments: 12,
      bevelEnabled: false,
    });

    textGeometry.computeBoundingBox();

    // Create a material for the text
    const textMaterial = new MeshBasicMaterial({ color: 0x000000 });

    // Create a mesh with the geometry and material
    mesh = new Mesh(textGeometry, textMaterial);

    const scale = (0.6 * window.innerWidth) / 951;

    // Scale and position the text mesh
    mesh.scale.set(scale, scale, scale);
    // I want to set the mesh position at the center of the screen
    if (textGeometry.boundingBox) {
      mesh.position.set(
        (-textGeometry.boundingBox?.max.x / 2) * scale,
        (-textGeometry.boundingBox?.max.y / 2) * scale,
        -6
      );
    }
    // Add the text mesh to the scene
    scene.add(mesh);
  });
}
