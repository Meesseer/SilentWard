import * as THREE from "three";

import {
  Interactable,
} from "../interaction/Interactable.js";

import {
  STORY_EVENTS,
} from "./StoryManager.js";

import { loadModel } from "../core/assetLoader.js";

import {
  prepareModel,
  fitModelToSize,
  alignModelToPoint,
} from "../core/modelUtils.js";


function createTableCollider(scene, x, height, z) {
  const collider = new THREE.Mesh(
    new THREE.BoxGeometry(1.35, height, 0.85),
    new THREE.MeshBasicMaterial({
      visible: false,
    })
  );

  collider.position.set(x, height / 2, z);
  collider.name = "floor-plan-table-collider";
  scene.add(collider);

  return collider;
}


// ====================================
// CORRIDOR FLOOR PLAN
// ====================================

export async function createFloorPlan(
  scene,
  interactionManager,
  story
) {

  const tableX = 1.25;
  const tableZ = -25.5;
  const tableHeight = 0.95;
  let tableTopY = tableHeight;

  try {
    const table = await loadModel(
      "/assets/models/furniture/medicalTable.glb"
    );

    prepareModel(table);

    const fittedBounds = fitModelToSize(
      table,
      1.4,
      tableHeight
    );

    const placedBounds = alignModelToPoint(
      table,
      fittedBounds,
      tableX,
      0,
      tableZ
    );

    table.name = "corridor-floor-plan-table";
    scene.add(table);
    tableTopY = placedBounds.max.y;
  }
  catch (error) {
    console.error("Failed to load floor plan table:", error);

    const cart = new THREE.Mesh(
      new THREE.BoxGeometry(1.2, 0.9, 0.75),
      new THREE.MeshStandardMaterial({
        color: 0x303334,
        roughness: 0.8,
        metalness: 0.25,
      })
    );

    cart.position.set(tableX, 0.45, tableZ);
    cart.castShadow = true;
    cart.receiveShadow = true;
    scene.add(cart);
    tableTopY = 0.9;
  }

  const tableCollider = createTableCollider(
    scene,
    tableX,
    tableTopY,
    tableZ
  );

  const plan = new THREE.Mesh(
    new THREE.BoxGeometry(0.9, 0.03, 0.65),
    new THREE.MeshStandardMaterial({
      color: 0xb9b29d,
      roughness: 0.95,
    })
  );

  plan.name = "east-service-floor-plan";
  plan.position.set(tableX, tableTopY + 0.02, tableZ);
  plan.rotation.x = -Math.PI / 2;
  plan.castShadow = true;
  plan.receiveShadow = true;

  scene.add(plan);

  const overlay = document.createElement("div");
  overlay.id = "floor-plan-overlay";
  overlay.innerHTML = `
    <div class="floor-plan-paper">
      <button class="floor-plan-close" type="button">×</button>
      <p class="plan-title">ST. AGNES HOSPITAL — FLOOR PLAN REVISION</p>
      <div class="plan-map">
        <span>WARD C</span><i></i><span class="plan-crossed">ROOM 417</span><i></i><span>EAST SERVICE CORRIDOR</span>
      </div>
      <p><strong>Revision 12:</strong> Room 417 removed from current architectural records.</p>
      <p><strong>Reason:</strong> STRUCTURAL MODIFICATION. Previous access point sealed. Do not reopen.</p>
      <p class="plan-note">A handwritten note has been pressed into the margin: “It is still here.”</p>
    </div>
  `;

  document.body.appendChild(overlay);

  let isOpen = false;

  function close() {
    if (!isOpen) {
      return;
    }

    overlay.classList.remove("visible");
    interactionManager.setBlocked(false);
    isOpen = false;
  }

  overlay.querySelector(".floor-plan-close").addEventListener("click", close);

  document.addEventListener("keydown", (event) => {
    if (event.code === "Escape") {
      close();
    }
  });

  const interaction = new Interactable({
    object: plan,
    name: "Floor Plan Revision",
    interactionText: "Press E to inspect floor plan",
    onInteract: () => {
      story.trigger(STORY_EVENTS.FLOOR_PLAN_DISCOVERY);
      interactionManager.setBlocked(true);
      document.exitPointerLock?.();
      overlay.classList.add("visible");
      isOpen = true;
    },
  });

  interactionManager.addInteractable(interaction);

  return {
    plan,
    interaction,
    tableCollider,
  };

}
