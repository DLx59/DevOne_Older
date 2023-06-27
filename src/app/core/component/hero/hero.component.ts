import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { createBackground } from './meshes/background';
import { addText } from './meshes/backgroundText';
import { createDevText } from './meshes/devText';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss'],
})
export class HeroComponent implements AfterViewInit {
  @ViewChild('heroEffect', { static: true })
  heroEffectRef!: ElementRef<HTMLDivElement>;

  async ngAfterViewInit() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);

    // link canvas to html id
    const heroEffectContainer = this.heroEffectRef.nativeElement;
    const canvas = renderer.domElement;
    heroEffectContainer.appendChild(canvas);

    camera.position.z = 5;
    // const orbits = new OrbitControls(camera, renderer.domElement);
    scene.add(createBackground());

    addText('Création de site internet et\ncommunication digitale', scene);

    const devText = await createDevText();
    scene.add(devText.mesh);

    const renderTargetSize = 1024;
    const renderTarget = new THREE.WebGLRenderTarget(
      renderTargetSize,
      renderTargetSize
    );

    function map(value: any, inMin: any, inMax: any, outMin: any, outMax: any) {
      return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
    }

    let mouse = { x: 0, y: 0 };

    document.addEventListener('mousemove', function (event) {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    });

    function animate() {
      requestAnimationFrame(animate);
      // Hide the glass object
      devText.mesh.visible = false;
      devText.update();
      // Render the scene to the WebGLRenderTarget
      renderer.setRenderTarget(renderTarget);
      renderer.render(scene, camera);

      // Restore the renderer's target and make the glass object visible again
      renderer.setRenderTarget(null);
      devText.mesh.visible = true;

      devText.update(renderTarget.texture, camera);
      updateDevTextRotation(); // Correction : Appel de la fonction updateDevTextRotation()
      renderer.render(scene, camera);
    }

    animate();

    // handle window resize
    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(2);

      // const heroSection = document.getElementById('hero-section');
      // const width = heroSection!.offsetWidth;
      // const height = heroSection!.offsetHeight;
      //
      // camera.aspect = width / height;
      // camera.updateProjectionMatrix();
      // renderer.setSize(width, height);
      // renderer.setPixelRatio(window.devicePixelRatio);
    }

    window.addEventListener('resize', onWindowResize);

    function updateDevTextRotation() {
      const maxRotationDegres = 30;
      let targetRotationX = map(
        mouse.y,
        -1,
        1,
        (-maxRotationDegres * Math.PI) / 180,
        (maxRotationDegres * Math.PI) / 180
      );
      let targetRotationY = map(
        mouse.x,
        -1,
        1,
        (maxRotationDegres * Math.PI) / 180,
        (-maxRotationDegres * Math.PI) / 180
      );

      let lerpFactor = 0.1;
      devText.mesh.rotation.x +=
        (targetRotationX - devText.mesh.rotation.x) * lerpFactor;
      devText.mesh.rotation.y +=
        (targetRotationY - devText.mesh.rotation.y) * lerpFactor;
    }
  }
}
