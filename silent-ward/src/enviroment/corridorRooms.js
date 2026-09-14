import * as THREE from "three";

import {
  Interactable,
} from "../interaction/Interactable.js";

import {
  createWallMaterial,
} from "./material.js";


// ====================================
// CORRIDOR EXPLORATION ROOMS
// ====================================

const ROOM_DEPTH = 6;
const ROOM_WIDTH = 4;
const ROOM_HEIGHT = 4;
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


function createCorridorRoom(
  scene,
  interactionManager,
  side,
  doorZ,
  label
) {

  const colliders = [];
  const isLeft = side === "left";
  const roomCenterX = isLeft ? -5 : 5;
  const outerWallX = isLeft ? -8 : 8;
  const corridorWallX = isLeft ? -2 : 2;
  const wallMaterial = createWallMaterial(ROOM_DEPTH, ROOM_HEIGHT);
  const floorMaterial = new THREE.MeshStandardMaterial({
    color: 0x262828,
    roughness: 1,
  });
  const doorMaterial = new THREE.MeshStandardMaterial({
    color: 0x292d2d,
    roughness: 0.82,
  });

  function addCollider(mesh) {
    scene.add(mesh);
    colliders.push(mesh);
  }

  scene.add(createBox(ROOM_DEPTH, 0.2, ROOM_WIDTH, floorMaterial, roomCenterX, -0.1, doorZ));
  scene.add(createBox(ROOM_DEPTH, 0.2, ROOM_WIDTH, wallMaterial, roomCenterX, ROOM_HEIGHT, doorZ));
  addCollider(createBox(0.2, ROOM_HEIGHT, ROOM_WIDTH, wallMaterial, outerWallX, ROOM_HEIGHT / 2, doorZ));
  addCollider(createBox(ROOM_DEPTH, ROOM_HEIGHT, 0.2, wallMaterial, roomCenterX, ROOM_HEIGHT / 2, doorZ - ROOM_WIDTH / 2));
  addCollider(createBox(ROOM_DEPTH, ROOM_HEIGHT, 0.2, wallMaterial, roomCenterX, ROOM_HEIGHT / 2, doorZ + ROOM_WIDTH / 2));

  // The corridor wall supplies the shared wall and doorway opening.

  const door = new THREE.Group();
  door.name = `corridor-${label.toLowerCase().replaceAll(" ", "-")}-door`;
  door.position.set(corridorWallX + (isLeft ? -0.15 : 0.15), 0, doorZ - DOOR_WIDTH / 2);

  const doorMesh = createBox(
    0.22,
    DOOR_HEIGHT,
    DOOR_WIDTH,
    doorMaterial,
    0,
    DOOR_HEIGHT / 2,
    DOOR_WIDTH / 2
  );

  door.add(doorMesh);
  scene.add(door);
  colliders.push(doorMesh);

  const sign = createBox(
    0.05,
    0.28,
    1.4,
    new THREE.MeshStandardMaterial({ color: 0xaaa18d, roughness: 0.8 }),
    corridorWallX + (isLeft ? 0.12 : -0.12),
    3.75,
    doorZ
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
      const direction = isLeft ? -1 : 1;

      function animate(time) {
        const progress = Math.min((time - startTime) / 650, 1);
        const eased = 1 - Math.pow(1 - progress, 3);

        door.rotation.y = direction * Math.PI / 2 * eased;

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


export function createCorridorRooms(scene, interactionManager) {

  return [
    ...createCorridorRoom(scene, interactionManager, "left", -17, "Treatment Room"),
    ...createCorridorRoom(scene, interactionManager, "right", -22, "Supply Room"),
    ...createCorridorRoom(scene, interactionManager, "left", -27, "Observation Room"),
  ];

}
