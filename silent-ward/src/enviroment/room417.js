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


// ====================================
// OLD ROOM 417
// ====================================

const ROOM_WIDTH = 4;
const ROOM_DEPTH = 8;
const ROOM_HEIGHT = 4;
const ROOM_CENTER_Z = -35;
const DOOR_WIDTH = 2;
const DOOR_HEIGHT = 3.5;


function createBox(
  width,
  height,
  depth,
  material,
  x,
  y,
  z
) {

  const mesh =
    new THREE.Mesh(
      new THREE.BoxGeometry(width, height, depth),
      material
    );

  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;

  return mesh;

}


export function createOldRoom417(
  scene,
  interactionManager,
  story
) {

  const colliders = [];
  const wallMaterial =
    new THREE.MeshStandardMaterial({
      color: 0x4a4540,
      roughness: 0.95,
    });
  const floorMaterial =
    new THREE.MeshStandardMaterial({
      color: 0x282726,
      roughness: 1,
    });
  const doorMaterial =
    new THREE.MeshStandardMaterial({
      color: 0x34312c,
      roughness: 0.85,
    });

  const frontZ =
    ROOM_CENTER_Z + ROOM_DEPTH / 2;
  const backZ =
    ROOM_CENTER_Z - ROOM_DEPTH / 2;
  const sideWidth =
    (ROOM_WIDTH - DOOR_WIDTH) / 2;

  function addCollider(mesh) {
    scene.add(mesh);
    colliders.push(mesh);
  }

  scene.add(
    createBox(
      ROOM_WIDTH,
      0.2,
      ROOM_DEPTH,
      floorMaterial,
      0,
      -0.1,
      ROOM_CENTER_Z
    )
  );

  scene.add(
    createBox(
      ROOM_WIDTH,
      0.2,
      ROOM_DEPTH,
      wallMaterial,
      0,
      ROOM_HEIGHT,
      ROOM_CENTER_Z
    )
  );

  addCollider(
    createBox(
      sideWidth,
      ROOM_HEIGHT,
      0.2,
      wallMaterial,
      -(DOOR_WIDTH / 2 + sideWidth / 2),
      ROOM_HEIGHT / 2,
      frontZ
    )
  );

  addCollider(
    createBox(
      sideWidth,
      ROOM_HEIGHT,
      0.2,
      wallMaterial,
      DOOR_WIDTH / 2 + sideWidth / 2,
      ROOM_HEIGHT / 2,
      frontZ
    )
  );

  addCollider(
    createBox(
      DOOR_WIDTH,
      ROOM_HEIGHT - DOOR_HEIGHT,
      0.2,
      wallMaterial,
      0,
      DOOR_HEIGHT + (ROOM_HEIGHT - DOOR_HEIGHT) / 2,
      frontZ
    )
  );

  addCollider(createBox(0.2, ROOM_HEIGHT, ROOM_DEPTH, wallMaterial, -2, 2, ROOM_CENTER_Z));
  addCollider(createBox(0.2, ROOM_HEIGHT, ROOM_DEPTH, wallMaterial, 2, 2, ROOM_CENTER_Z));
  addCollider(createBox(ROOM_WIDTH, ROOM_HEIGHT, 0.2, wallMaterial, 0, 2, backZ));

  // ------------------------------------
  // HINGED ROOM DOOR
  // ------------------------------------

  const door = new THREE.Group();
  door.name = "room-417-door";
  door.position.set(-1, 0, frontZ - 0.15);

  const doorMesh = createBox(
    DOOR_WIDTH,
    DOOR_HEIGHT,
    0.22,
    doorMaterial,
    DOOR_WIDTH / 2,
    DOOR_HEIGHT / 2,
    0
  );

  door.add(doorMesh);
  scene.add(door);
  colliders.push(doorMesh);

  let isOpen = false;
  let isOpening = false;

  const doorInteraction = new Interactable({
    object: door,
    name: "Room 417",
    interactionText: "Press E to enter Room 417",
    onInteract: () => {
      if (isOpen || isOpening) {
        return;
      }

      if (!story.has(STORY_EVENTS.FLOOR_PLAN_DISCOVERY)) {
        showMessage("The number plate is wrong. Find a record that explains it.");
        return;
      }

      isOpening = true;
      const startTime = performance.now();

      function animate(time) {
        const progress = Math.min((time - startTime) / 800, 1);
        const eased = 1 - Math.pow(1 - progress, 3);

        door.rotation.y = Math.PI / 2 * eased;

        if (progress < 1) {
          requestAnimationFrame(animate);
          return;
        }

        doorMesh.userData.isOpen = true;
        isOpen = true;
        isOpening = false;
        interactionManager.removeInteractable(doorInteraction);
        interactionManager.clearInteraction();
        showMessage("The old room should not be here.");
      }

      requestAnimationFrame(animate);
    },
  });

  interactionManager.addInteractable(doorInteraction);

  // ------------------------------------
  // PATIENT EVIDENCE
  // ------------------------------------

  const record = createBox(
    0.6,
    0.04,
    0.45,
    new THREE.MeshStandardMaterial({ color: 0xbdb29c, roughness: 1 }),
    0.45,
    1.05,
    -36
  );

  scene.add(record);

  const recordInteraction = new Interactable({
    object: record,
    name: "Sealed Patient Record",
    interactionText: "Press E to read",
    onInteract: () => {
      story.trigger(STORY_EVENTS.PATIENT_TRUTH_FOUND);
      interactionManager.removeInteractable(recordInteraction);
      interactionManager.clearInteraction();
      showMessage("No body was recovered. The room was removed from every plan. Something is behind you — reach the emergency exit.");
      record.material.color.set(0x756c5e);
    },
  });

  interactionManager.addInteractable(recordInteraction);

  // ------------------------------------
  // FINAL EXIT
  // ------------------------------------

  const exitPanel = createBox(
    1.1,
    0.45,
    0.08,
    new THREE.MeshStandardMaterial({ color: 0x6f1b1b, emissive: 0x260606 }),
    0,
    1.8,
    backZ + 0.12
  );

  scene.add(exitPanel);

  const exitInteraction = new Interactable({
    object: exitPanel,
    name: "Emergency Exit",
    interactionText: "Press E to leave the ward",
    onInteract: () => {
      if (!story.has(STORY_EVENTS.PATIENT_TRUTH_FOUND)) {
        showMessage("Something in this room is still unresolved.");
        return;
      }

      story.trigger(STORY_EVENTS.ENDING);
    },
  });

  interactionManager.addInteractable(exitInteraction);

  return {
    colliders,
  };

}
