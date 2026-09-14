import * as THREE from "three";

import {
  wallMaterial,
  floorMaterial,
  darkMaterial,
  metalMaterial,
} from "./material";


// ====================================
// CORRIDOR CONFIG
// ====================================

export const CORRIDOR_CONFIG = {
  width: 4,
  length: 18,
  height: 4,
};

const CORRIDOR_WIDTH =
  CORRIDOR_CONFIG.width;

const CORRIDOR_LENGTH =
  CORRIDOR_CONFIG.length;

const CORRIDOR_HEIGHT =
  CORRIDOR_CONFIG.height;

const DOOR_WIDTH = 2;
const DOOR_HEIGHT = 3.5;


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
// CREATE CORRIDOR
// ====================================

export function createCorridor(
  scene,
  originX,
  originY,
  originZ
) {

  const colliders = [];


  function addCollider(
    mesh
  ) {

    scene.add(
      mesh
    );

    colliders.push(
      mesh
    );

  }


  // ====================================
  // FLOOR
  // ====================================

  scene.add(
    createBox(
      CORRIDOR_WIDTH,
      0.2,
      CORRIDOR_LENGTH,

      floorMaterial,

      originX,
      originY - 0.1,
      originZ
    )
  );


  // ====================================
  // CEILING
  // ====================================

  scene.add(
    createBox(
      CORRIDOR_WIDTH,
      0.2,
      CORRIDOR_LENGTH,

      darkMaterial,

      originX,
      originY + CORRIDOR_HEIGHT,
      originZ
    )
  );


  // ====================================
  // SIDE WALLS / EXPLORATION DOORS
  // ====================================

  /*
   * These ranges keep the corridor walls
   * intact while leaving three exact door
   * openings for the exploration rooms.
   */

  const sideWallSections = {
    left: [
      [-31, -28],
      [-26, -18],
      [-16, -13],
    ],
    right: [
      [-31, -23],
      [-21, -13],
    ],
  };

  function addWallSections(x, sections) {

    sections.forEach(
      ([startZ, endZ]) => {

        const depth =
          endZ - startZ;

        addCollider(
          createBox(
            0.2,
            CORRIDOR_HEIGHT,
            depth,
            wallMaterial,
            x,
            originY + CORRIDOR_HEIGHT / 2,
            startZ + depth / 2
          )
        );

      }
    );

  }

  addWallSections(
    originX - CORRIDOR_WIDTH / 2,
    sideWallSections.left
  );

  addWallSections(
    originX + CORRIDOR_WIDTH / 2,
    sideWallSections.right
  );


  // ====================================
  // ROOM 417 CONNECTION
  // ====================================

  /*
   * The far end remains open here. The
   * old Room 417 module supplies the
   * shared wall, doorway, and collision
   * at this exact edge.
   */


  // ====================================
  // ENTRY FRAME
  // ====================================

  const entranceZ =
    originZ +
    CORRIDOR_LENGTH / 2;


  // ====================================
  // WARD C EXIT DOOR
  // ====================================

  /*
   * The pivot sits on the left edge of
   * the doorway. The mesh is offset to
   * its right, so it rotates on a hinge.
   */

  const doorPivot =
    new THREE.Group();


  doorPivot.name =
    "ward-c-corridor-door";


  doorPivot.position.set(
    originX - DOOR_WIDTH / 2,
    originY,
    entranceZ - 0.15
  );


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
    "ward-c-corridor-door-mesh";

  doorMesh.userData.isDoor =
    true;

  doorMesh.userData.doorPivot =
    doorPivot;


  doorPivot.add(
    doorMesh
  );

  scene.add(
    doorPivot
  );

  colliders.push(
    doorMesh
  );


  // Left frame

  addCollider(
    createBox(
      0.2,
      3.8,
      0.3,

      metalMaterial,

      originX - 1.1,

      originY + 1.9,

      entranceZ
    )
  );


  // Right frame

  addCollider(
    createBox(
      0.2,
      3.8,
      0.3,

      metalMaterial,

      originX + 1.1,

      originY + 1.9,

      entranceZ
    )
  );


  // Top frame

  addCollider(
    createBox(
      2.4,
      0.2,
      0.3,

      metalMaterial,

      originX,

      originY + 3.8,

      entranceZ
    )
  );


  // ====================================
  // CEILING LIGHTS
  // ====================================

  const lightPositions = [
    -6,
    -2,
    2,
    6,
  ];


  lightPositions.forEach(
    (zOffset) => {

      const light =
        createBox(
          1.2,
          0.05,
          0.35,

          metalMaterial,

          originX,

          originY +
            CORRIDOR_HEIGHT -
            0.12,

          originZ +
            zOffset
        );


      scene.add(
        light
      );

    }
  );


  // ====================================
  // RETURN
  // ====================================

  return {

    colliders,

    width:
      CORRIDOR_WIDTH,

    length:
      CORRIDOR_LENGTH,

    height:
      CORRIDOR_HEIGHT,

    door:
      doorPivot,

    doorCollider:
      doorMesh,

  };

}
