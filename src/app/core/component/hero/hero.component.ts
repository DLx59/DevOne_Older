import { AfterViewInit, Component, HostListener } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { createBackground } from './meshes/background';
import { addText } from './meshes/text';
import { createDiamond } from './meshes/diamond';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss'],
})
export class HeroComponent implements AfterViewInit {
  ngAfterViewInit() {
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
    const heroSection = document.getElementById('hero-section');
    heroSection!.appendChild(renderer.domElement);

    camera.position.z = 5;

    const background = createBackground();
    scene.add(background);

    addText('DEV', scene);
    const diamond = createDiamond();
    scene.add(diamond.mesh);

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
      diamond.mesh.visible = false;

      // Render the scene to the WebGLRenderTarget
      renderer.setRenderTarget(renderTarget);
      renderer.render(scene, camera);

      // Restore the renderer's target and make the glass object visible again
      renderer.setRenderTarget(null);
      diamond.mesh.visible = true;

      diamond.update(renderTarget.texture, camera);
      updateDiamondRotation();
      renderer.render(scene, camera);
    }

    animate();

    // handle window resize
    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(2);
    }

    window.addEventListener('resize', onWindowResize);

    function updateDiamondRotation() {
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
      diamond.mesh.rotation.x +=
        (targetRotationX - diamond.mesh.rotation.x) * lerpFactor;
      diamond.mesh.rotation.y +=
        (targetRotationY - diamond.mesh.rotation.y) * lerpFactor;
    }
  }
}
