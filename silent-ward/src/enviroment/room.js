import * as THREE from "three";

import {
  ROOM_CONFIG,
} from "../config/gameConfig.js";

import {
  wallMaterial,
  floorMaterial,
  darkMaterial,
  metalMaterial,
  windowGlassMaterial,
  windowFrameMaterial,
} from "./material";


// ====================================
// ROOM CONFIG
// ====================================

const ROOM_WIDTH =
  ROOM_CONFIG.width;

const ROOM_DEPTH =
  ROOM_CONFIG.depth;

const ROOM_HEIGHT =
  ROOM_CONFIG.height;


// ====================================
// CREATE BOX
// ====================================

function createBox(
  width,
  height,
  depth,
  material,
  x,
  y,
  z
) {

  const geometry =
    new THREE.BoxGeometry(
      width,
      height,
      depth
    );


  const mesh =
    new THREE.Mesh(
      geometry,
      material
    );


  mesh.position.set(
    x,
    y,
    z
  );


  mesh.castShadow =
    true;

  mesh.receiveShadow =
    true;


  return mesh;

}


// ====================================
// CREATE ROOM
// ====================================

export function createRoom(scene) {

  const colliders = [];


  function addCollider(mesh) {

    scene.add(mesh);

    colliders.push(mesh);

  }


  // ====================================
  // FLOOR
  // ====================================

  scene.add(
    createBox(
      ROOM_WIDTH,
      0.2,
      ROOM_DEPTH,
      floorMaterial,
      0,
      -0.1,
      0
    )
  );


  // ====================================
  // ROOM BACK
  // ====================================

  const BACK_Z =
    -ROOM_DEPTH / 2;


  const DOOR_WIDTH =
    2;


  const DOOR_HEIGHT =
    3.5;


  // ====================================
  // BACK WALL LEFT
  // ====================================

  const sideWallWidth =
    (
      ROOM_WIDTH -
      DOOR_WIDTH
    ) / 2;


  addCollider(
    createBox(
      sideWallWidth,
      ROOM_HEIGHT,
      0.2,
      wallMaterial,

      -(
        DOOR_WIDTH / 2 +
        sideWallWidth / 2
      ),

      ROOM_HEIGHT / 2,

      BACK_Z
    )
  );


  // ====================================
  // BACK WALL RIGHT
  // ====================================

  addCollider(
    createBox(
      sideWallWidth,
      ROOM_HEIGHT,
      0.2,
      wallMaterial,

      (
        DOOR_WIDTH / 2 +
        sideWallWidth / 2
      ),

      ROOM_HEIGHT / 2,

      BACK_Z
    )
  );


  // ====================================
  // WALL ABOVE DOOR
  // ====================================

  const wallAboveDoor =
    ROOM_HEIGHT -
    DOOR_HEIGHT;


  if (
    wallAboveDoor > 0
  ) {

    addCollider(
      createBox(
        DOOR_WIDTH,
        wallAboveDoor,
        0.2,
        wallMaterial,

        0,

        DOOR_HEIGHT +
        wallAboveDoor / 2,

        BACK_Z
      )
    );

  }


  // ====================================
  // LEFT WALL
  // ====================================

  addCollider(
    createBox(
      0.2,
      ROOM_HEIGHT,
      ROOM_DEPTH,
      wallMaterial,

      -ROOM_WIDTH / 2,

      ROOM_HEIGHT / 2,

      0
    )
  );


  // ====================================
  // RIGHT WALL
  // ====================================

  addCollider(
    createBox(
      0.2,
      ROOM_HEIGHT,
      ROOM_DEPTH,
      wallMaterial,

      ROOM_WIDTH / 2,

      ROOM_HEIGHT / 2,

      0
    )
  );


  // ====================================
  // FRONT WALL / EXPLORATION DOORS
  // ====================================

  /*
   * Two additional rooms connect from the
   * spawn room's front wall. Split this
   * wall around their door openings so
   * the doors are physical passages.
   */

  const FRONT_Z =
    ROOM_DEPTH / 2;

  const explorationDoorCenters = [
    -3,
    3,
  ];

  const frontWallSections = [
    { width: 2, x: -5 },
    { width: 4, x: 0 },
    { width: 2, x: 5 },
  ];

  frontWallSections.forEach(
    ({ width, x }) => {

      addCollider(
        createBox(
          width,
          ROOM_HEIGHT,
          0.2,
          wallMaterial,
          x,
          ROOM_HEIGHT / 2,
          FRONT_Z
        )
      );

    }
  );

  explorationDoorCenters.forEach(
    (x) => {

      addCollider(
        createBox(
          DOOR_WIDTH,
          ROOM_HEIGHT - DOOR_HEIGHT,
          0.2,
          wallMaterial,
          x,
          DOOR_HEIGHT +
          (ROOM_HEIGHT - DOOR_HEIGHT) / 2,
          FRONT_Z
        )
      );

    }
  );

  /*
   * The room modules create the actual
   * doors, frames, and rooms beyond here.
   */

  /*
  addCollider(
    createBox(
      ROOM_WIDTH,
      ROOM_HEIGHT,
      0.2,
      wallMaterial,

      0,

      ROOM_HEIGHT / 2,

      ROOM_DEPTH / 2
    )
  );
  */


  // ====================================
  // CEILING
  // ====================================

  scene.add(
    createBox(
      ROOM_WIDTH,
      0.2,
      ROOM_DEPTH,
      darkMaterial,

      0,

      ROOM_HEIGHT,

      0
    )
  );


  // ====================================
  // WARD C DOOR
  // ====================================

  /*
   * Door dimensions:
   *
   * Width  = 2
   * Height = 3.5
   *
   * The door's LEFT edge is:
   *
   * X = -1
   *
   * We create a pivot exactly there.
   */


  // ------------------------------------
  // DOOR PIVOT
  // ------------------------------------

  const doorPivot =
    new THREE.Group();


  doorPivot.name =
    "ward-c-entrance-door";


  doorPivot.position.set(
    -DOOR_WIDTH / 2,
    0,
    BACK_Z + 0.15
  );


  // ------------------------------------
  // DOOR MESH
  // ------------------------------------

  const doorMesh =
    createBox(
      DOOR_WIDTH,
      DOOR_HEIGHT,
      0.25,
      darkMaterial,

      DOOR_WIDTH / 2,

      DOOR_HEIGHT / 2,

      0
    );


  doorMesh.name =
    "ward-c-entrance-door-mesh";


  // ------------------------------------
  // ADD DOOR TO PIVOT
  // ------------------------------------

  doorPivot.add(
    doorMesh
  );


  // ------------------------------------
  // ADD PIVOT TO SCENE
  // ------------------------------------

  scene.add(
    doorPivot
  );


  // ------------------------------------
  // DOOR COLLIDER
  // ------------------------------------

  /*
   * The player controller uses this
   * mesh as the collision object.
   *
   * It will follow the door as the
   * pivot rotates.
   */

  colliders.push(
    doorMesh
  );


  doorMesh.userData.isDoor =
    true;


  doorMesh.userData.doorPivot =
    doorPivot;


  // ====================================
  // DOOR FRAME LEFT
  // ====================================

  const leftDoorFrame =
    createBox(
      0.2,
      3.8,
      0.3,
      metalMaterial,

      -1.1,

      1.9,

      BACK_Z + 0.15
    );


  leftDoorFrame.name =
    "ward-c-door-frame-left";


  addCollider(
    leftDoorFrame
  );


  // ====================================
  // DOOR FRAME RIGHT
  // ====================================

  const rightDoorFrame =
    createBox(
      0.2,
      3.8,
      0.3,
      metalMaterial,

      1.1,

      1.9,

      BACK_Z + 0.15
    );


  rightDoorFrame.name =
    "ward-c-door-frame-right";


  addCollider(
    rightDoorFrame
  );


  // ====================================
  // DOOR FRAME TOP
  // ====================================

  const topDoorFrame =
    createBox(
      2.4,
      0.2,
      0.3,
      metalMaterial,

      0,

      3.8,

      BACK_Z + 0.15
    );


  topDoorFrame.name =
    "ward-c-door-frame-top";


  addCollider(
    topDoorFrame
  );


  // ====================================
  // WINDOW GLASS
  // ====================================

  scene.add(
    createBox(
      3,
      2,
      0.1,
      windowGlassMaterial,

      3,

      2.7,

      BACK_Z + 0.15
    )
  );


  // ====================================
  // WINDOW FRAME LEFT
  // ====================================

  addCollider(
    createBox(
      0.15,
      2.2,
      0.2,
      windowFrameMaterial,

      1.5,

      2.7,

      BACK_Z + 0.05
    )
  );


  // ====================================
  // WINDOW FRAME RIGHT
  // ====================================

  addCollider(
    createBox(
      0.15,
      2.2,
      0.2,
      windowFrameMaterial,

      4.5,

      2.7,

      BACK_Z + 0.05
    )
  );


  // ====================================
  // WINDOW FRAME TOP
  // ====================================

  addCollider(
    createBox(
      3.2,
      0.15,
      0.2,
      windowFrameMaterial,

      3,

      3.7,

      BACK_Z + 0.05
    )
  );


  // ====================================
  // WINDOW FRAME BOTTOM
  // ====================================

  addCollider(
    createBox(
      3.2,
      0.15,
      0.2,
      windowFrameMaterial,

      3,

      1.7,

      BACK_Z + 0.05
    )
  );


  // ====================================
  // RETURN COLLIDERS
  // ====================================

  return colliders;

}
