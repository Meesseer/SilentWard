import * as THREE from "three";

import {
  GLTFLoader,
} from "three/addons/loaders/GLTFLoader.js";

import {
  STORY_EVENTS,
} from "../story/StoryManager.js";


// ====================================
// GHOST SYSTEM
// ====================================

export class GhostSystem {

  constructor({
    scene,
    player,
    story,
  }) {

    this.player = player;
    this.story = story;
    this.state = "HIDDEN";
    this.manifestTime = 0;
    this.isModelReady = false;
    this.ghostMaterials = [];

    this.entity =
      new THREE.Group();

    this.entity.name =
      "corridor-ghost";

    this.entity.position.set(0, 0, -28.5);
    this.entity.visible = false;

    scene.add(this.entity);

    this.loadCharacter();

    story.on(
      STORY_EVENTS.CORRIDOR_ENTERED,
      () => this.manifest()
    );

    story.on(
      STORY_EVENTS.PATIENT_TRUTH_FOUND,
      () => this.startChase()
    );

  }


  // ====================================
  // GLTF CHARACTER
  // ====================================

  loadCharacter() {

    const loader =
      new GLTFLoader();

    loader.load(
      "/assets/models/ghost/ghost-character.glb",
      (gltf) => {

        const character =
          gltf.scene;

        character.name =
          "ghost-character-model";

        /*
         * This asset imports facing +X.
         * Rotate its local forward axis to
         * +Z so the parent can lookAt the
         * player correctly.
         */

        character.rotation.y =
          -Math.PI / 2;

        character.updateMatrixWorld(true);

        const bounds =
          new THREE.Box3().setFromObject(character);

        const size =
          new THREE.Vector3();

        bounds.getSize(size);

        if (size.y > 0) {

          const scale =
            2.8 / size.y;

          character.scale.setScalar(scale);
          character.updateMatrixWorld(true);

          const scaledBounds =
            new THREE.Box3().setFromObject(character);

          character.position.y -=
            scaledBounds.min.y;

        }

        character.traverse((child) => {

          if (!child.isMesh) {
            return;
          }

          child.castShadow = true;
          child.receiveShadow = true;

          const materials = Array.isArray(child.material)
            ? child.material
            : [child.material];

          const fadedMaterials = materials.map((material) => {
            const fadedMaterial = material.clone();

            fadedMaterial.transparent = true;
            fadedMaterial.depthWrite = false;
            fadedMaterial.opacity = 0;

            if (fadedMaterial.emissive) {
              fadedMaterial.emissive.set(0x263332);
              fadedMaterial.emissiveIntensity = 0.25;
            }

            this.ghostMaterials.push(fadedMaterial);

            return fadedMaterial;
          });

          child.material = Array.isArray(child.material)
            ? fadedMaterials
            : fadedMaterials[0];

        });

        this.entity.add(character);
        this.isModelReady = true;
        this.entity.visible = this.state !== "HIDDEN";
        this.setOpacity(
          this.state === "CHASE" ? 0.7 : 0
        );

      },
      undefined,
      (error) => {
        console.error(
          "Failed to load ghost character:",
          error
        );
      }
    );

  }


  setOpacity(opacity) {

    this.ghostMaterials.forEach((material) => {
      material.opacity = opacity;
    });

  }


  facePlayer() {

    this.entity.lookAt(
      this.player.position.x,
      this.entity.position.y,
      this.player.position.z
    );

  }


  manifest() {

    if (this.state !== "HIDDEN") {
      return;
    }

    this.state = "WATCHING";
    this.manifestTime = performance.now();
    this.entity.visible = true;

    this.story.trigger(
      STORY_EVENTS.GHOST_FIRST_SIGHTING
    );

  }


  update() {

    if (this.state === "CHASE") {
      this.entity.position.lerp(
        this.player.position,
        0.012
      );

      this.entity.position.y =
        Math.sin(performance.now() * 0.006) * 0.05;

      this.facePlayer();

      return;
    }

    if (this.state === "HIDDEN") {
      return;
    }

    const elapsed =
      performance.now() - this.manifestTime;

    const distance =
      this.player.position.distanceTo(
        this.entity.position
      );

    const fadeIn =
      Math.min(elapsed / 800, 1);

    const shouldDisappear =
      distance < 8 || elapsed > 7000;

    const fadeOut = shouldDisappear
      ? Math.max(1 - (elapsed - 3500) / 900, 0)
      : 1;

    const opacity =
      Math.min(fadeIn, fadeOut) * 0.62;

    this.setOpacity(
      opacity
    );

    this.entity.position.y =
      Math.sin(elapsed * 0.002) * 0.04;

    this.facePlayer();

    if (shouldDisappear && opacity <= 0) {
      this.entity.visible = false;
      this.state = "HIDDEN";
    }

  }


  startChase() {

    this.state = "CHASE";
    this.entity.position.set(0, 0, -32.2);
    this.entity.visible = true;
    this.setOpacity(0.7);

  }

}
