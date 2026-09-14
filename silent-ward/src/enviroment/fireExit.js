import * as THREE from "three";

import {
  Interactable,
} from "../interaction/Interactable.js";

import {
  STORY_EVENTS,
} from "../story/StoryManager.js";

import {
  showMessage,
} from "../ui/interactablePrompt.js";

import {
  createWallMaterial,
  darkMaterial,
  metalMaterial,
} from "./material.js";


export const FIRE_EXIT_CONFIG = {
  doorWidth: 2,
  doorHeight: 3.5,
  stairwellWidth: 3,
  stepCount: 10,
  stepRise: 0.22,
  stepRun: 0.32,
  landingDepth: 2.4,
};


function createBox(width, height, depth, material, x, y, z) {
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(width, height, depth),
    material
  );

  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;

  return mesh;
}


function createFireDoorMesh(width, height) {
  const group = new THREE.Group();

  const doorMaterial = new THREE.MeshStandardMaterial({
    color: 0x9a1f1f,
    roughness: 0.48,
    metalness: 0.4,
    emissive: 0x2a0505,
  });

  const door = createBox(
    width,
    height,
    0.1,
    doorMaterial,
    width / 2,
    height / 2,
    0
  );

  const bar = createBox(
    width * 0.72,
    0.08,
    0.08,
    metalMaterial,
    width / 2,
    1.05,
    -0.08
  );

  const sign = createBox(
    0.55,
    0.16,
    0.04,
    new THREE.MeshStandardMaterial({
      color: 0xc9b23a,
      emissive: 0x3a3208,
      roughness: 0.6,
    }),
    width / 2,
    height - 0.35,
    -0.08
  );

  group.add(door);
  group.add(bar);
  group.add(sign);

  return group;
}


function openHingedDoor(door, collider, interaction, interactionManager, onComplete) {
  const startTime = performance.now();

  function animate(time) {
    const progress = Math.min((time - startTime) / 800, 1);
    const eased = 1 - Math.pow(1 - progress, 3);

    door.rotation.y = Math.PI / 2 * eased;

    if (progress < 1) {
      requestAnimationFrame(animate);
      return;
    }

    collider.userData.isOpen = true;
    interactionManager.removeInteractable(interaction);
    interactionManager.clearInteraction();
    onComplete?.();
  }

  requestAnimationFrame(animate);
}


export function createFireExit(scene, interactionManager, story, backZ) {
  const colliders = [];
  const {
    doorWidth,
    doorHeight,
    stairwellWidth,
    stepCount,
    stepRise,
    stepRun,
    landingDepth,
  } = FIRE_EXIT_CONFIG;

  const roomHeight = 4;
  const stairDrop = stepCount * stepRise;
  const bottomY = -stairDrop;
  const stairsStartZ = backZ - 0.15;
  const stairsEndZ = stairsStartZ - stepCount * stepRun;
  const landingZ = stairsEndZ - landingDepth / 2;
  const exitZ = stairsEndZ - landingDepth;
  const wellDepth = (backZ - exitZ);
  const wellCenterZ = (backZ + exitZ) / 2;
  const wallHeight = roomHeight - bottomY;
  const wallCenterY = (roomHeight + bottomY) / 2;

  const wallMaterial = createWallMaterial(wellDepth, wallHeight);
  const treadMaterial = new THREE.MeshStandardMaterial({
    color: 0x2a2c2d,
    roughness: 0.95,
  });

  function addCollider(mesh) {
    scene.add(mesh);
    colliders.push(mesh);
  }

  addCollider(
    createBox(
      0.2,
      wallHeight,
      wellDepth,
      wallMaterial,
      -stairwellWidth / 2,
      wallCenterY,
      wellCenterZ
    )
  );

  addCollider(
    createBox(
      0.2,
      wallHeight,
      wellDepth,
      wallMaterial,
      stairwellWidth / 2,
      wallCenterY,
      wellCenterZ
    )
  );

  scene.add(
    createBox(
      stairwellWidth,
      0.2,
      wellDepth,
      darkMaterial,
      0,
      roomHeight,
      wellCenterZ
    )
  );

  scene.add(
    createBox(
      stairwellWidth,
      0.2,
      landingDepth,
      treadMaterial,
      0,
      bottomY - 0.1,
      landingZ
    )
  );

  for (let i = 0; i < stepCount; i += 1) {
    const stepTop = -i * stepRise;
    const stepZ = stairsStartZ - (i + 0.5) * stepRun;

    scene.add(
      createBox(
        stairwellWidth - 0.2,
        0.12,
        stepRun,
        treadMaterial,
        0,
        stepTop - 0.06,
        stepZ
      )
    );
  }

  const exitSideWidth = (stairwellWidth - doorWidth) / 2;

  addCollider(
    createBox(
      exitSideWidth,
      wallHeight,
      0.2,
      wallMaterial,
      -(doorWidth / 2 + exitSideWidth / 2),
      wallCenterY,
      exitZ
    )
  );

  addCollider(
    createBox(
      exitSideWidth,
      wallHeight,
      0.2,
      wallMaterial,
      doorWidth / 2 + exitSideWidth / 2,
      wallCenterY,
      exitZ
    )
  );

  addCollider(
    createBox(
      doorWidth,
      wallHeight - doorHeight,
      0.2,
      wallMaterial,
      0,
      doorHeight + bottomY + (wallHeight - doorHeight) / 2,
      exitZ
    )
  );

  const upperDoor = new THREE.Group();
  upperDoor.name = "room-417-fire-door";
  upperDoor.position.set(-doorWidth / 2, 0, backZ - 0.12);

  const upperCollider = createBox(
    doorWidth,
    doorHeight,
    0.2,
    new THREE.MeshBasicMaterial({ visible: false }),
    doorWidth / 2,
    doorHeight / 2,
    0
  );

  upperCollider.userData.isDoor = true;
  upperDoor.add(upperCollider);
  upperDoor.add(createFireDoorMesh(doorWidth, doorHeight));
  scene.add(upperDoor);
  colliders.push(upperCollider);

  let upperOpen = false;
  let upperOpening = false;

  const upperInteraction = new Interactable({
    object: upperDoor,
    name: "Fire Exit",
    interactionText: "Press E to open the fire exit",
    onInteract: () => {
      if (upperOpen || upperOpening) {
        return;
      }

      if (!story.has(STORY_EVENTS.PATIENT_TRUTH_FOUND)) {
        showMessage("Something in this room is still unresolved.");
        return;
      }

      upperOpening = true;
      openHingedDoor(
        upperDoor,
        upperCollider,
        upperInteraction,
        interactionManager,
        () => {
          upperOpen = true;
          upperOpening = false;
          showMessage("The stairwell drops into the dark.");
        }
      );
    },
  });

  interactionManager.addInteractable(upperInteraction);

  const lowerDoor = new THREE.Group();
  lowerDoor.name = "fire-exit-street-door";
  lowerDoor.position.set(-doorWidth / 2, bottomY, exitZ + 0.12);

  const lowerCollider = createBox(
    doorWidth,
    doorHeight,
    0.2,
    new THREE.MeshBasicMaterial({ visible: false }),
    doorWidth / 2,
    doorHeight / 2,
    0
  );

  lowerCollider.userData.isDoor = true;
  lowerDoor.add(lowerCollider);
  lowerDoor.add(createFireDoorMesh(doorWidth, doorHeight));
  scene.add(lowerDoor);
  colliders.push(lowerCollider);

  let lowerOpen = false;
  let lowerOpening = false;

  const lowerInteraction = new Interactable({
    object: lowerDoor,
    name: "Emergency Exit",
    interactionText: "Press E to leave the ward",
    onInteract: () => {
      if (lowerOpen || lowerOpening) {
        return;
      }

      lowerOpening = true;
      openHingedDoor(
        lowerDoor,
        lowerCollider,
        lowerInteraction,
        interactionManager,
        () => {
          lowerOpen = true;
          story.trigger(STORY_EVENTS.ENDING);
        }
      );
    },
  });

  interactionManager.addInteractable(lowerInteraction);

  const stairLight = new THREE.PointLight(0x8b2020, 3.4, 10);
  stairLight.position.set(0, 1.6, (stairsStartZ + landingZ) / 2);
  scene.add(stairLight);

  function getGroundY(x, z) {
    if (Math.abs(x) > stairwellWidth / 2 + 0.2) {
      return 0;
    }

    if (z > backZ + 0.4) {
      return 0;
    }

    if (z >= stairsStartZ) {
      return 0;
    }

    if (z <= stairsEndZ) {
      if (z >= exitZ - 0.4) {
        return bottomY;
      }

      return 0;
    }

    const t = (stairsStartZ - z) / (stairsStartZ - stairsEndZ);

    return -t * stairDrop;
  }

  return {
    colliders,
    getGroundY,
  };
}
