import * as THREE from "three";

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

    this.material =
      new THREE.MeshStandardMaterial({
        color: 0xb8c2c1,
        transparent: true,
        opacity: 0,
        roughness: 0.95,
        emissive: 0x263332,
        emissiveIntensity: 0.25,
      });

    this.entity =
      new THREE.Group();

    this.entity.name =
      "corridor-ghost";

    const body =
      new THREE.Mesh(
        new THREE.ConeGeometry(0.48, 2.5, 8),
        this.material
      );

    body.position.y = 1.25;

    const head =
      new THREE.Mesh(
        new THREE.SphereGeometry(0.3, 12, 10),
        this.material
      );

    head.position.y = 2.55;

    this.entity.add(body, head);
    this.entity.position.set(0, 0, -28.5);
    this.entity.visible = false;

    scene.add(this.entity);

    story.on(
      STORY_EVENTS.CORRIDOR_ENTERED,
      () => this.manifest()
    );

    story.on(
      STORY_EVENTS.PATIENT_TRUTH_FOUND,
      () => this.startChase()
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

    this.material.opacity =
      Math.min(fadeIn, fadeOut) * 0.62;

    this.entity.position.y =
      Math.sin(elapsed * 0.002) * 0.04;

    if (shouldDisappear && this.material.opacity <= 0) {
      this.entity.visible = false;
      this.state = "HIDDEN";
    }

  }


  startChase() {

    this.state = "CHASE";
    this.entity.position.set(0, 0, -32.2);
    this.entity.visible = true;
    this.material.opacity = 0.7;

  }

}
