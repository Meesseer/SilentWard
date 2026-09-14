import * as THREE from "three";

import {
  Interactable,
} from "../interaction/Interactable.js";

import {
  updateInventoryUI,
} from "../inventory/InventoryUI.js";

import {
  showMessage,
} from "../ui/interactablePrompt.js";


// ====================================
// CREATE WARD C ACCESS CARD
// ====================================

export function createWardCAccessCard(
  scene,
  inventory,
  interactionManager
) {

  // ====================================
  // CARD GEOMETRY
  // ====================================

  const geometry =
    new THREE.BoxGeometry(
      0.45,
      0.02,
      0.7
    );


  // ====================================
  // CARD MATERIAL
  // ====================================

  const material =
    new THREE.MeshStandardMaterial({

      color:
        0xd9d9d9,

      roughness:
        0.6,

      metalness:
        0.1,

    });


  // ====================================
  // CARD
  // ====================================

  const card =
    new THREE.Mesh(
      geometry,
      material
    );


  card.name =
    "ward-c-access-card";


  // ====================================
  // POSITION
  // ====================================
  //
  // Drawer starts around:
  //
  // X = -2.8
  // Z = -10.55
  //
  // When opened it moves
  // outward by +0.8.
  //
  // Final drawer position:
  //
  // Z = -9.75
  //
  // Put card inside the opened drawer.
  //
  // ====================================

  card.position.set(
    -2.8,
    1.25,
    -10.5
  );


  card.rotation.x =
    -Math.PI / 2;


  card.castShadow =
    true;

  card.receiveShadow =
    true;


  // ====================================
  // HIDDEN INITIALLY
  // ====================================

  card.visible =
    false;


  scene.add(
    card
  );


  // ====================================
  // INVENTORY ITEM
  // ====================================

  const cardItem = {

    id:
      "ward_c_access_card",

    name:
      "Ward C Access Card",

    description:
      "An access card found inside the locked drawer in Ward C.",

  };


  // ====================================
  // INTERACTION
  // ====================================

  const cardInteraction =
    new Interactable({

      object:
        card,

      name:
        "Ward C Access Card",

      interactionText:
        "Press E to pick up",

      onInteract: () => {

        // --------------------------------
        // ADD TO INVENTORY
        // --------------------------------

        inventory.addItem(
          cardItem
        );


        // --------------------------------
        // UPDATE UI
        // --------------------------------

        updateInventoryUI(
          inventory
        );


        // --------------------------------
        // REMOVE FROM WORLD
        // --------------------------------

        scene.remove(
          card
        );


        // --------------------------------
        // REMOVE INTERACTION
        // --------------------------------

        interactionManager.removeInteractable(
          cardInteraction
        );


        interactionManager.clearInteraction();


        // --------------------------------
        // MESSAGE
        // --------------------------------

        showMessage(
          "Ward C access card acquired."
        );

      },

    });


  // ====================================
  // REVEAL
  // ====================================

  function reveal() {

    card.visible =
      true;


    interactionManager.addInteractable(
      cardInteraction
    );


    console.log(
      "Access card revealed."
    );

  }


  // ====================================
  // RETURN
  // ====================================

  return {

    card,

    interaction:
      cardInteraction,

    reveal,

  };

}