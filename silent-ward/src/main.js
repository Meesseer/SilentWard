import "./style.css";
import * as THREE from "three";

// ------------------------------------
// CORE
// ------------------------------------

import { createScene } from "./core/scene.js";
import { createCamera } from "./core/camera.js";
import { createRenderer } from "./core/renderer.js";

// ------------------------------------
// ENVIRONMENT
// ------------------------------------

import {
  ROOM_CONFIG,
} from "./config/gameConfig.js";
import {
  createLockedDrawer,
} from "./enviroment/lockedDrawer.js";
import { createRoom } from "./enviroment/room.js";
import { createFurniture } from "./enviroment/furniture.js";
import { createProps } from "./enviroment/props.js";
import {
  createCabinetInteraction,
} from "./enviroment/cabinet.js";

import {
  createLighting,
  updateLighting,
} from "./enviroment/lightning.js";

import {
  createBedInteraction,
} from "./enviroment/bed.js";

import {
  createHospitalBed,
} from "./enviroment/furnitureLoader.js";

import {
  createWardC,
  WARD_C_CONFIG,
} from "./enviroment/wardC.js";

import {
  createCorridor,
  CORRIDOR_CONFIG,
} from "./enviroment/corridor.js";

import {
  createCorridorDoor,
} from "./enviroment/corridorDoor.js";

import {
  createWardCFurniture,
} from "./enviroment/wardCFurniture.js";

// ------------------------------------
// PLAYER
// ------------------------------------

import { Player } from "./player/Player.js";
import { PlayerController } from "./player/PlayerController.js";
import { Flashlight } from "./player/Flashlight.js";

// ------------------------------------
// INTERACTION
// ------------------------------------

import {
  InteractionManager,
} from "./interaction/InteractionManager.js";

// ------------------------------------
// INVENTORY
// ------------------------------------

import { Inventory } from "./inventory/Inventory.js";

import {
  createInventoryUI,
  updateInventoryUI,
} from "./inventory/InventoryUI.js";

// ------------------------------------
// ITEMS
// ------------------------------------

import {
  createWardCDoor,
} from "./enviroment/wardDoor.js";
import {
  createMysteriousNote,
} from "./items/mysteriousNotes.js";

import {
  createHospitalKey,
} from "./items/key.js";

import {
  createPatientFile,
} from "./items/patientFile.jsx";

import {
  createWardCAccessCard,
} from "./items/wardCAccessCard.js";

import {
  createOldRoom417,
} from "./enviroment/room417.js";

import {
  StoryManager,
} from "./story/StoryManager.js";

import {
  GhostSystem,
} from "./entities/Ghost.js";

import {
  createFloorPlan,
} from "./story/FloorPlan.js";

import {
  createExplorationRooms,
} from "./enviroment/explorationRooms.js";

import {
  createCorridorRooms,
} from "./enviroment/corridorRooms.js";

import {
  createExplorationFurniture,
} from "./enviroment/explorationFurniture.js";

import {
  createEndingUI,
} from "./story/EndingUI.js";



// ------------------------------------
// UI
// ------------------------------------

import {
  createInteractionPrompt,
  createCrosshair,
} from "./ui/interactablePrompt.js";


// ====================================
// GAME INITIALIZATION
// ====================================

async function init() {

  // ------------------------------------
  // GAME SETUP
  // ------------------------------------

  const scene =
    createScene();

  const camera =
    createCamera();

  scene.add(camera);

  const renderer =
    createRenderer();


  // ------------------------------------
  // ENVIRONMENT
  // ------------------------------------

  const roomColliders =
    createRoom(scene);

  const furnitureColliders =
    createFurniture(scene);

  createProps(scene);

  const lights =
    createLighting(scene);

  const wardCColliders =
    createWardC(scene);

  // ------------------------------------
  // WARD C CORRIDOR
  // ------------------------------------

  /*
   * Ward C occupies Z = -5 through -13.
   * Its exit is the back edge at Z = -13.
   * The corridor starts at that edge and
   * extends away from Ward C along -Z.
   */

  const wardCExitZ =
    WARD_C_CONFIG.centerZ -
    WARD_C_CONFIG.depth / 2;

  const corridorLength =
    CORRIDOR_CONFIG.length;

  const corridor =
    createCorridor(
      scene,
      0,
      0,
      wardCExitZ -
      corridorLength / 2
    );

  const wardCFurnitureColliders =
    await createWardCFurniture(scene);

  // ------------------------------------
  // PLAYER
  // ------------------------------------

  const player =
    new Player(camera);

  player.position.set(
    0,
    2,
    0
  );

  player.updateCameraPosition();

  const flashlight =
    new Flashlight(camera);

  document.addEventListener(
    "keydown",
    (event) => {

      if (
        event.code === "KeyF" &&
        !event.repeat
      ) {

        flashlight.toggle();

      }

    }
  );


  // ------------------------------------
  // INVENTORY
  // ------------------------------------

  const inventory =
    new Inventory();

  createInventoryUI();

  updateInventoryUI(
    inventory
  );


  // ------------------------------------
  // LOAD 3D ASSETS
  // ------------------------------------

  const hospitalBed =
    await createHospitalBed(scene);


  // ------------------------------------
  // INTERACTION SYSTEM
  // ------------------------------------

  const interactionManager =
    new InteractionManager({
      camera,
      scene,
    });


  // ------------------------------------
  // UI
  // ------------------------------------

  createCrosshair();

  const interactionPrompt =
    createInteractionPrompt();

  interactionManager.setPrompt(
    interactionPrompt
  );


  // ------------------------------------
  // STORY SYSTEMS
  // ------------------------------------

  const story =
    new StoryManager({
      inventory,
      player,
    });

  const ghost =
    new GhostSystem({
      scene,
      player,
      story,
    });

  createEndingUI(
    story
  );


  // ------------------------------------
  // EXPLORATION ROOMS
  // ------------------------------------

  const explorationRoomColliders =
    createExplorationRooms(
      scene,
      interactionManager
    );

  const corridorRoomColliders =
    createCorridorRooms(
      scene,
      interactionManager
    );

  const explorationFurnitureColliders =
    await createExplorationFurniture(
      scene
    );


  // ------------------------------------
  // CORRIDOR STORY OBJECTS
  // ------------------------------------

  createFloorPlan(
    scene,
    interactionManager,
    story
  );

  const room417 =
    createOldRoom417(
      scene,
      interactionManager,
      story
    );


  // ------------------------------------
  // WARD C ACCESS CARD
  // ------------------------------------

  const wardCAccessCard =
    createWardCAccessCard(
      scene,
      inventory,
      interactionManager
    );


  // ------------------------------------
  // WARD C LOCKED DRAWER
  // ------------------------------------

  const lockedDrawer =
    createLockedDrawer(
      scene,
      interactionManager,
      wardCAccessCard
    );


  // ------------------------------------
  // WARD C PATIENT FILE
  // ------------------------------------

  createPatientFile(
    scene,
    interactionManager
  );



  // ------------------------------------
  // WARD C DOOR
  // ------------------------------------

  const wardCDoor =
    createWardCDoor(
      scene,
      interactionManager
    );

  const corridorDoor =
    createCorridorDoor(
      scene,
      interactionManager,
      inventory
    );


  // ------------------------------------
  // BED INTERACTION
  // ------------------------------------

  const bedInteraction =
    createBedInteraction(
      hospitalBed.model
    );

  interactionManager.addInteractable(
    bedInteraction
  );

  // ------------------------------------
  // MYSTERIOUS NOTE
  // ------------------------------------

  const mysteriousNote =
    createMysteriousNote(
      scene,
      inventory,
      interactionManager,
    );

  createCabinetInteraction(
    scene,
    inventory,
    interactionManager,
    mysteriousNote
  );


  // ------------------------------------
  // ITEMS
  // ------------------------------------


  createHospitalKey(
    scene,
    inventory,
    interactionManager
  );


  // ------------------------------------
  // COLLIDERS
  // ------------------------------------

  const colliders = [
    ...roomColliders,
    ...furnitureColliders,
    ...wardCColliders,
    ...wardCFurnitureColliders,
    ...corridor.colliders,
    ...room417.colliders,
    ...explorationRoomColliders,
    ...corridorRoomColliders,
    ...explorationFurnitureColliders,
    hospitalBed.collider,
    wardCDoor.collider,
  ];


  // ------------------------------------
  // PLAYER CONTROLLER
  // ------------------------------------

  const playerController =
    new PlayerController(
      camera,
      player,
      colliders
    );


  // ------------------------------------
  // POINTER LOCK
  // ------------------------------------

  renderer.domElement.addEventListener(
    "click",
    () => {

      playerController.controls.lock();

    }
  );


  // ------------------------------------
  // RESIZE
  // ------------------------------------

  window.addEventListener(
    "resize",
    () => {

      camera.aspect =
        window.innerWidth /
        window.innerHeight;

      camera.updateProjectionMatrix();

      renderer.setSize(
        window.innerWidth,
        window.innerHeight
      );

    }
  );


  // ------------------------------------
  // GAME LOOP
  // ------------------------------------

  const clock =
    new THREE.Clock();


  function animate() {

    requestAnimationFrame(
      animate
    );


    const deltaTime =
      clock.getDelta();

    const elapsedTime =
      clock.getElapsedTime();


    // Player

    playerController.update(
      deltaTime
    );


    // Story / ghost

    story.update();

    ghost.update();


    // Interaction

    interactionManager.update();


    // Lighting

    updateLighting(
      elapsedTime,
      lights
    );


    // Render

    renderer.render(
      scene,
      camera
    );

  }


  animate();
}


// ====================================
// START GAME
// ====================================

init();
