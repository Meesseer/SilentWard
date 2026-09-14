import * as THREE from "three";

import {
  Interactable,
} from "../interaction/Interactable.js";


// ====================================
// SPAWN ROOM EXPLORATION ROOMS
// ====================================

const ROOM_WIDTH = 4;
const ROOM_DEPTH = 6;
const ROOM_HEIGHT = 5;
const FRONT_Z = 5;
const DOOR_WIDTH = 2;
const DOOR_HEIGHT = 3.5;


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


function createExplorationRoom(
  scene,
  interactionManager,
  centerX,
  label
) {

  const colliders = [];
  const centerZ = FRONT_Z + ROOM_DEPTH / 2;
  const backZ = centerZ + ROOM_DEPTH / 2;
  const wallMaterial = new THREE.MeshStandardMaterial({
    color: 0x37393a,
    roughness: 0.95,
  });
  const floorMaterial = new THREE.MeshStandardMaterial({
    color: 0x242627,
    roughness: 1,
  });
  const doorMaterial = new THREE.MeshStandardMaterial({
    color: 0x282b2b,
    roughness: 0.8,
  });

  function addCollider(mesh) {
    scene.add(mesh);
    colliders.push(mesh);
  }

  scene.add(createBox(ROOM_WIDTH, 0.2, ROOM_DEPTH, floorMaterial, centerX, -0.1, centerZ));
  scene.add(createBox(ROOM_WIDTH, 0.2, ROOM_DEPTH, wallMaterial, centerX, ROOM_HEIGHT, centerZ));
  addCollider(createBox(0.2, ROOM_HEIGHT, ROOM_DEPTH, wallMaterial, centerX - ROOM_WIDTH / 2, ROOM_HEIGHT / 2, centerZ));
  addCollider(createBox(0.2, ROOM_HEIGHT, ROOM_DEPTH, wallMaterial, centerX + ROOM_WIDTH / 2, ROOM_HEIGHT / 2, centerZ));
  addCollider(createBox(ROOM_WIDTH, ROOM_HEIGHT, 0.2, wallMaterial, centerX, ROOM_HEIGHT / 2, backZ));

  // The shared wall already has a matching opening in room.js.

  const door = new THREE.Group();
  door.name = `spawn-room-${label.toLowerCase().replaceAll(" ", "-")}-door`;
  door.position.set(centerX - DOOR_WIDTH / 2, 0, FRONT_Z + 0.15);

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

  const sign = createBox(
    1.45,
    0.28,
    0.05,
    new THREE.MeshStandardMaterial({ color: 0xaaa18d, roughness: 0.8 }),
    centerX,
    3.9,
    FRONT_Z - 0.12
  );

  scene.add(sign);

  let isOpen = false;
  let isOpening = false;

  const interaction = new Interactable({
    object: door,
    name: label,
    interactionText: `Press E to open ${label}`,
    onInteract: () => {
      if (isOpen || isOpening) {
        return;
      }

      isOpening = true;
      const startTime = performance.now();

      function animate(time) {
        const progress = Math.min((time - startTime) / 650, 1);
        door.rotation.y = Math.PI / 2 * (1 - Math.pow(1 - progress, 3));

        if (progress < 1) {
          requestAnimationFrame(animate);
          return;
        }

        doorMesh.userData.isOpen = true;
        isOpen = true;
        isOpening = false;
        interactionManager.removeInteractable(interaction);
        interactionManager.clearInteraction();
      }

      requestAnimationFrame(animate);
    },
  });

  interactionManager.addInteractable(interaction);

  return colliders;

}


export function createExplorationRooms(scene, interactionManager) {

  return [
    ...createExplorationRoom(scene, interactionManager, -3, "Examination Room"),
    ...createExplorationRoom(scene, interactionManager, 3, "Records Room"),
  ];

}
