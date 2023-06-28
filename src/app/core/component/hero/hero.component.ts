import { Component, OnInit, ElementRef } from '@angular/core';
import * as THREE from 'three';
import BackfaceMaterial from './backface-material/backface-material';
import RefractionMaterial from './refraction-material/refraction-material';
import loadTexture from './utils/texture-loader';
import loadModel from './utils/model-loader';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss'],
})
export class HeroComponent implements OnInit {
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private orthoCamera: THREE.OrthographicCamera;
  private vp: { width: number; height: number; dpr: number };
  private cube: THREE.Object3D;
  private mesh: THREE.Object3D | THREE.Mesh;
  private quad: THREE.Mesh;
  private envFbo: THREE.WebGLRenderTarget;
  private backfaceFbo: THREE.WebGLRenderTarget;
  private refractionMaterial: RefractionMaterial;
  private backfaceMaterial: BackfaceMaterial;

  private pointerDown: boolean;
  private pointer: { x: number };
  private velocity: number;
  private isRotating: boolean;

  constructor(private elementRef: ElementRef) {
    this.pointerDown = false;
    this.pointer = { x: 0 };
    this.velocity = 0;
  }

  ngOnInit() {
    this.animate = this.animate.bind(this);
    this.resize = this.resize.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);

    this.vp = {
      width: window.innerWidth,
      height: window.innerHeight,
      dpr: devicePixelRatio || 1,
    };

    this.setup();

    window.addEventListener('mousedown', this.handleMouseDown);
    window.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('mouseup', this.handleMouseUp);

    this.elementRef.nativeElement.querySelector('.hero').appendChild(this.renderer.domElement);
  }

  async setup() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.vp.width / this.vp.height,
      0.1,
      1000
    );
    this.orthoCamera = new THREE.OrthographicCamera(
      this.vp.width / -2,
      this.vp.width / 2,
      this.vp.height / 2,
      this.vp.height / -2,
      1,
      1000
    );

    this.orthoCamera.layers.set(1);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(this.vp.width, this.vp.height);
    this.renderer.setPixelRatio(this.vp.dpr);
    this.renderer.autoClear = false;
    this.elementRef.nativeElement.appendChild(this.renderer.domElement);

    this.envFbo = new THREE.WebGLRenderTarget(
      this.vp.width * this.vp.dpr,
      this.vp.height * this.vp.dpr
    );
    this.backfaceFbo = new THREE.WebGLRenderTarget(
      this.vp.width * this.vp.dpr,
      this.vp.height * this.vp.dpr
    );

    const tex = await loadTexture('../../../../../assets/images/rectbg.jpg');
    this.quad = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(),
      new THREE.MeshBasicMaterial({ map: tex as THREE.Texture })
    );
    this.quad.layers.set(1);
    this.quad.scale.set(this.vp.height * 2, this.vp.height, 1);
    this.scene.add(this.quad);

    this.refractionMaterial = new RefractionMaterial({
      envMap: this.envFbo.texture,
      backfaceMap: this.backfaceFbo.texture,
      resolution: [this.vp.width * this.vp.dpr, this.vp.height * this.vp.dpr],
    });

    this.backfaceMaterial = new BackfaceMaterial(this);

    const sphere = new THREE.SphereBufferGeometry(2, 64, 64);
    const box = new THREE.BoxBufferGeometry(2, 2, 2);
    this.cube = new THREE.Object3D();
    this.mesh = this.cube;

    let { model } = await loadModel('../../assets/ruby.gltf') as { model: THREE.Object3D };
    model = model.children[0];
    model.scale.set(0.1, 0.1, 0.1);
    model.position.y = -1.5;
    this.cube.add(model);
    this.mesh = model;

    this.scene.add(this.cube);

    this.camera.position.z = 5;
    this.orthoCamera.position.z = 5;

    window.addEventListener('resize', this.resize);

    this.animate();
  }

  animate() {
    requestAnimationFrame(this.animate);

    this.renderer.setClearColor(0x000000);
    this.renderer.clear();

    // Rotation infinie vers la droite
    this.cube.rotation.y -= 0.005;

    // Rotation interactive avec la souris
    if (this.pointerDown && this.mesh instanceof THREE.Mesh) {
      const rotationSpeed = 0.01;
      const direction = this.velocity > 0 ? 1 : -1;
      const rotationAmount = direction * rotationSpeed;

      this.mesh.rotation.y += rotationAmount;
      this.velocity *= 0.9; // Amortissement de la vitesse de rotation
    }

    // render env to fbo
    this.renderer.setRenderTarget(this.envFbo);
    this.renderer.render(this.scene, this.orthoCamera);

    // render cube backfaces to fbo
    if (this.mesh instanceof THREE.Mesh) {
      this.mesh.material = this.backfaceMaterial;
    }
    this.renderer.setRenderTarget(this.backfaceFbo);
    this.renderer.clearDepth();
    this.renderer.render(this.scene, this.camera);

    // render env to screen
    this.renderer.setRenderTarget(null);
    this.renderer.render(this.scene, this.orthoCamera);
    this.renderer.clearDepth();

    // render cube with refraction material to screen
    if (this.mesh instanceof THREE.Mesh) {
      this.mesh.material = this.refractionMaterial;
    }
    this.renderer.render(this.scene, this.camera);
  }

  resize() {
    this.vp.width = window.innerWidth;
    this.vp.height = window.innerHeight;

    this.renderer.setSize(this.vp.width, this.vp.height);
    this.envFbo.setSize(
      this.vp.width * this.vp.dpr,
      this.vp.height * this.vp.dpr
    );
    this.backfaceFbo.setSize(
      this.vp.width * this.vp.dpr,
      this.vp.height * this.vp.dpr
    );

    this.quad.scale.set(this.vp.height * 2, this.vp.height, 1);
    if (this.cube instanceof THREE.Mesh) {
      const cube = this.cube as THREE.Mesh;
      cube.material['uniforms'].resolution.value = [
        this.vp.width * this.vp.dpr,
        this.vp.height * this.vp.dpr,
      ];
    }

    this.camera.aspect = this.vp.width / this.vp.height;
    this.camera.updateProjectionMatrix();

    this.orthoCamera.left = this.vp.width / -2;
    this.orthoCamera.right = this.vp.width / 2;
    this.orthoCamera.top = this.vp.height / 2;
    this.orthoCamera.bottom = this.vp.height / -2;
    this.orthoCamera.updateProjectionMatrix();
  }

  handleMouseDown(e: MouseEvent | TouchEvent) {
    this.pointerDown = true;
    this.pointer.x = e instanceof TouchEvent ? e.touches[0].clientX : e.clientX;
    this.velocity = 0;
    this.isRotating = false; // Désactiver la rotation automatique lors du "grab"
  }

  handleMouseMove(e: MouseEvent | TouchEvent) {
    if (!this.pointerDown) return;

    const x = e instanceof TouchEvent ? e.touches[0].clientX : e.clientX;
    const movementX = x - this.pointer.x;

    if (!this.isRotating) {
      const rotationSpeed = 0.01;
      const direction = movementX > 0 ? 1 : -1;
      const rotationAmount = direction * rotationSpeed;

      this.mesh.rotation.y += rotationAmount;
    }

    this.pointer.x = x;
  }

  handleMouseUp() {
    this.pointerDown = false;
    this.isRotating = true; // Réactiver la rotation automatique lorsque le "grab" est relâché
  }
}
