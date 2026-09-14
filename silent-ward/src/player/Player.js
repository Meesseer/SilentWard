import * as THREE from "three";
import { PLAYER_CONFIG } from "../config/gameConfig.js";

export class Player {
  constructor(camera) {
    this.camera = camera;

    this.height = PLAYER_CONFIG.height;
    this.radius = PLAYER_CONFIG.radius;

    this.position = new THREE.Vector3(
      0,
      this.height,
      3.5
    );

    this.maxHealth = PLAYER_CONFIG.maxHealth;
    this.health = this.maxHealth;
    this.isDead = false;
    this.onHealthChange = null;
    this.onDeath = null;

    this.camera.position.copy(
      this.position
    );
  }

  takeDamage(amount) {
    if (this.isDead || amount <= 0) {
      return false;
    }

    this.health = Math.max(0, this.health - amount);
    this.onHealthChange?.(this.health, this.maxHealth);

    if (this.health <= 0) {
      this.isDead = true;
      this.onDeath?.();
      return true;
    }

    return false;
  }

  updateCameraPosition() {
    this.camera.position.copy(
      this.position
    );
  }
}