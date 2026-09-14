import * as THREE from "three";
import { PLAYER_CONFIG } from "../config/gameConfig.js";

import { PointerLockControls } from "three/addons/controls/PointerLockControls.js";

export class PlayerController {
  constructor(camera, player, colliders = []) {
    this.camera = camera;
    this.player = player;
    this.colliders = colliders;

    this.controls =
      new PointerLockControls(
        camera,
        document.body
      );

    this.moveSpeed =
      PLAYER_CONFIG.moveSpeed;

    this.keys = {
      forward: false,
      backward: false,
      left: false,
      right: false,
    };

    this.direction =
      new THREE.Vector3();

    this.velocity =
      new THREE.Vector3();

    this.setupInput();

    this.isUIBlocked = false;
  }

  setUIBlocked(blocked) {

    this.isUIBlocked =
      blocked;

  }

  setupInput() {

    document.addEventListener(
      "keydown",
      (event) => {

        switch (event.code) {

          case "KeyW":
            this.keys.forward = true;
            break;

          case "KeyS":
            this.keys.backward = true;
            break;

          case "KeyA":
            this.keys.left = true;
            break;

          case "KeyD":
            this.keys.right = true;
            break;
        }
      }
    );


    document.addEventListener(
      "keyup",
      (event) => {

        switch (event.code) {

          case "KeyW":
            this.keys.forward = false;
            break;

          case "KeyS":
            this.keys.backward = false;
            break;

          case "KeyA":
            this.keys.left = false;
            break;

          case "KeyD":
            this.keys.right = false;
            break;
        }
      }
    );
  }

  update(deltaTime) {

    if (this.isUIBlocked) {
      return;
    }

    if (!this.controls.isLocked) {
      return;
    }

    if (!this.controls.isLocked) {
      return;
    }

    // ------------------------------------
    // CAMERA DIRECTION
    // ------------------------------------

    const forward =
      new THREE.Vector3();

    this.camera.getWorldDirection(
      forward
    );

    // We only want horizontal movement.
    // Ignore looking up/down.
    forward.y = 0;

    forward.normalize();


    // ------------------------------------
    // RIGHT DIRECTION
    // ------------------------------------

    const right =
      new THREE.Vector3();

    right.crossVectors(
      forward,
      new THREE.Vector3(0, 1, 0)
    );

    right.normalize();


    // ------------------------------------
    // MOVEMENT
    // ------------------------------------

    this.direction.set(
      0,
      0,
      0
    );


    // W = camera forward
    if (this.keys.forward) {

      this.direction.add(
        forward
      );

    }


    // S = camera backward
    if (this.keys.backward) {

      this.direction.sub(
        forward
      );

    }


    // D = camera right
    if (this.keys.right) {

      this.direction.add(
        right
      );

    }


    // A = camera left
    if (this.keys.left) {

      this.direction.sub(
        right
      );

    }


    // ------------------------------------
    // NO MOVEMENT
    // ------------------------------------

    if (
      this.direction.lengthSq() === 0
    ) {
      return;
    }


    // ------------------------------------
    // NORMALIZE
    // ------------------------------------

    this.direction.normalize();


    // ------------------------------------
    // APPLY SPEED
    // ------------------------------------

    const movement =
      this.direction
        .clone()
        .multiplyScalar(
          this.moveSpeed *
          deltaTime
        );


    this.move(
      movement
    );
  }

  move(movement) {

    const newPosition =
      this.player.position.clone();

    newPosition.x += movement.x;
    newPosition.z += movement.z;


    if (
      !this.checkCollision(
        newPosition
      )
    ) {
      this.player.position.copy(
        newPosition
      );

      this.player.updateCameraPosition();
    }

  }

  checkCollision(position) {

    const playerBox =
      new THREE.Box3(
        new THREE.Vector3(
          position.x - this.player.radius,
          0,
          position.z - this.player.radius
        ),
        new THREE.Vector3(
          position.x + this.player.radius,
          this.player.height,
          position.z + this.player.radius
        )
      );


    for (const collider of this.colliders) {

      // ------------------------------------
      // IGNORE OPEN DOORS
      // ------------------------------------

      if (
        collider.userData &&
        collider.userData.isOpen
      ) {

        continue;

      }


      const colliderBox =
        new THREE.Box3().setFromObject(
          collider
        );


      if (
        playerBox.intersectsBox(
          colliderBox
        )
      ) {

        return true;

      }
    }

    return false;
  }
}