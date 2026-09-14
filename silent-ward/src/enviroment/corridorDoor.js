import * as THREE from "three";

import {
  Interactable,
} from "../interaction/Interactable.js";

import {
  showMessage,
} from "../ui/interactablePrompt.js";


// ====================================
// CREATE CORRIDOR DOOR
// ====================================

export function createCorridorDoor(
  scene,
  interactionManager,
  inventory
) {

  // ====================================
  // FIND DOOR
  // ====================================

  const door =
    scene.getObjectByName(
      "ward-c-corridor-door"
    );


  if (!door) {

    console.error(
      "Ward C corridor door not found."
    );

    return null;

  }


  // ====================================
  // STATE
  // ====================================

  let isOpen =
    false;

  let isOpening =
    false;


  // ====================================
  // INTERACTION
  // ====================================

  const doorInteraction =
    new Interactable({

      object:
        door,

      name:
        "Ward C Exit",

      interactionText:
        "Press E to open",

      onInteract: () => {

        if (
          isOpen ||
          isOpening
        ) {

          return;

        }


        // ==================================
        // ACCESS CARD
        // ==================================

        if (
          !inventory.hasItem(
            "ward_c_access_card"
          )
        ) {

          showMessage(
            "The door requires an access card."
          );

          return;

        }


        showMessage(
          "The access card works."
        );


        isOpening =
          true;


        openDoor();

      },

    });


  interactionManager.addInteractable(
    doorInteraction
  );


  // ====================================
  // OPEN DOOR
  // ====================================

  function openDoor() {

    const startRotation =
      door.rotation.y;


    const targetRotation =
      startRotation +
      Math.PI / 2;


    const duration =
      800;


    const startTime =
      performance.now();


    function animateDoor(
      currentTime
    ) {

      const elapsed =
        currentTime -
        startTime;


      const progress =
        Math.min(
          elapsed /
          duration,
          1
        );


      const easedProgress =
        1 -
        Math.pow(
          1 -
          progress,
          3
        );


      door.rotation.y =
        startRotation +
        (
          targetRotation -
          startRotation
        ) *
        easedProgress;


      if (
        progress < 1
      ) {

        requestAnimationFrame(
          animateDoor
        );

        return;

      }


      door.rotation.y =
        targetRotation;


      isOpen =
        true;

      isOpening =
        false;


      door.userData.isOpen =
        true;


      interactionManager.removeInteractable(
        doorInteraction
      );


      interactionManager.clearInteraction();


      showMessage(
        "The corridor door opens."
      );

    }


    requestAnimationFrame(
      animateDoor
    );

  }


  return {

    door,

    collider:
      door.children[0],

    interaction:
      doorInteraction,

  };

}
