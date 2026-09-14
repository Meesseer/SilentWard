import * as THREE from "three";

import {
  GLTFLoader,
} from "three/addons/loaders/GLTFLoader.js";

import {
  darkMaterial,
  metalMaterial,
} from "./material";


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
// CREATE WARD C FURNITURE
// ====================================

export async function createWardCFurniture(
  scene
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
  // VICTORIAN DESK
  // RIGHT SIDE
  // ====================================

  const loader =
    new GLTFLoader();


  try {

    const gltf =
      await loader.loadAsync(
        "/assets/models/furniture/victorian_desk.glb"
      );


    const desk =
      gltf.scene;


    desk.name =
      "ward-c-victorian-desk";


    // ==================================
    // ROTATION
    // ==================================

    desk.rotation.y =
      Math.PI;


    // ==================================
    // TARGET POSITION
    // ==================================

    const targetX =
      2.5;

    const targetZ =
      -11.5;


    // ==================================
    // TARGET SIZE
    // ==================================

    const targetWidth =
      2.5;

    const targetHeight =
      1.45;

    const targetDepth =
      0.9;


    // ==================================
    // ORIGINAL BOUNDS
    // ==================================

    desk.updateMatrixWorld(
      true
    );


    const originalBox =
      new THREE.Box3().setFromObject(
        desk
      );


    const originalSize =
      new THREE.Vector3();


    originalBox.getSize(
      originalSize
    );


    // ==================================
    // PREVENT INVALID SCALE
    // ==================================

    if (
      originalSize.x <= 0 ||
      originalSize.y <= 0 ||
      originalSize.z <= 0
    ) {

      throw new Error(
        "Victorian desk has invalid dimensions."
      );

    }


    // ==================================
    // SCALE
    // ==================================

    const scale =
      Math.min(

        targetWidth /
        originalSize.x,

        targetHeight /
        originalSize.y,

        targetDepth /
        originalSize.z

      );


    const modelScale =
      scale * 2.25;


    desk.scale.set(
      modelScale,
      modelScale,
      modelScale
    );


    // ==================================
    // UPDATE WORLD MATRIX
    // ==================================

    desk.updateMatrixWorld(
      true
    );


    // ==================================
    // GET SCALED BOUNDS
    // ==================================

    const scaledBox =
      new THREE.Box3().setFromObject(
        desk
      );


    const center =
      new THREE.Vector3();


    scaledBox.getCenter(
      center
    );


    // ==================================
    // POSITION
    // ==================================

    desk.position.x +=
      targetX -
      center.x;


    desk.position.z +=
      targetZ -
      center.z;


    desk.position.y +=
      -scaledBox.min.y;


    // ==================================
    // SHADOWS
    // ==================================

    desk.traverse(
      (child) => {

        if (
          !child.isMesh
        ) {

          return;

        }


        child.castShadow =
          true;

        child.receiveShadow =
          true;

      }
    );


    // ==================================
    // ADD DESK
    // ==================================

    scene.add(
      desk
    );


    // ==================================
    // DESK COLLIDER
    // ==================================

    const deskColliderMaterial =
      new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0,
      });


    const deskCollider =
      createBox(
        targetWidth,
        targetHeight,
        targetDepth,

        deskColliderMaterial,

        targetX,
        targetHeight / 2,
        targetZ
      );


    deskCollider.name =
      "ward-c-victorian-desk-collider";


    scene.add(
      deskCollider
    );


    colliders.push(
      deskCollider
    );

  }
  catch (
    error
  ) {

    console.error(
      "Failed to load Victorian desk:",
      error
    );


    // ==================================
    // FALLBACK DESK
    // ==================================

    addCollider(
      createBox(
        2.5,
        1.4,
        0.8,

        darkMaterial,

        2.5,
        0.7,
        -11
      )
    );

  }


  // ====================================
  // MEDICAL TABLE
  // LEFT SIDE
  // ====================================

  const tableGroup =
    new THREE.Group();


  tableGroup.name =
    "ward-c-medical-table";


  tableGroup.position.set(
    -2.8,
    0,
    -11
  );


  scene.add(
    tableGroup
  );


  // ====================================
  // TABLE DIMENSIONS
  // ====================================

  const tableWidth =
    1.5;

  const tableHeight =
    1.2;

  const tableDepth =
    0.8;


  // ====================================
  // TABLE TOP
  // ====================================

  const tableTop =
    createBox(
      tableWidth,
      0.12,
      tableDepth,

      metalMaterial,

      0,
      1.14,
      0
    );


  tableGroup.add(
    tableTop
  );


  // ====================================
  // LEFT SIDE PANEL
  // ====================================

  const leftPanel =
    createBox(
      0.12,
      0.95,
      tableDepth,

      darkMaterial,

      -0.69,
      0.6,
      0
    );


  tableGroup.add(
    leftPanel
  );


  // ====================================
  // RIGHT SIDE PANEL
  // ====================================

  const rightPanel =
    createBox(
      0.12,
      0.95,
      tableDepth,

      darkMaterial,

      0.69,
      0.6,
      0
    );


  tableGroup.add(
    rightPanel
  );


  // ====================================
  // LOWER SHELF
  // ====================================

  const lowerShelf =
    createBox(
      1.25,
      0.08,
      0.62,

      metalMaterial,

      0,
      0.22,
      0
    );


  tableGroup.add(
    lowerShelf
  );


  // ====================================
  // BACK PANEL
  // ====================================

  const backPanel =
    createBox(
      1.25,
      0.95,
      0.08,

      darkMaterial,

      0,
      0.6,
      0.34
    );


  tableGroup.add(
    backPanel
  );


  // ====================================
  // FRONT LOWER RAIL
  // ====================================

  const frontRail =
    createBox(
      1.25,
      0.08,
      0.08,

      metalMaterial,

      0,
      0.25,
      -0.36
    );


  tableGroup.add(
    frontRail
  );


  // ====================================
  // TABLE LEGS / FEET
  // ====================================

  const legPositions = [
    [-0.62, 0.08, -0.28],
    [ 0.62, 0.08, -0.28],
    [-0.62, 0.08,  0.28],
    [ 0.62, 0.08,  0.28],
  ];


  legPositions.forEach(
    ([x, y, z]) => {

      const leg =
        createBox(
          0.1,
          0.16,
          0.1,

          metalMaterial,

          x,
          y,
          z
        );


      tableGroup.add(
        leg
      );

    }
  );


  // ====================================
  // TABLE SHADOWS
  // ====================================

  tableGroup.traverse(
    (child) => {

      if (
        !child.isMesh
      ) {

        return;

      }


      child.castShadow =
        true;

      child.receiveShadow =
        true;

    }
  );


  // ====================================
  // TABLE COLLIDER
  // ====================================

  const tableCollider =
    createBox(
      tableWidth,
      tableHeight,
      tableDepth,

      new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0,
      }),

      -2.8,
      tableHeight / 2,
      -11
    );


  tableCollider.name =
    "ward-c-medical-table-collider";


  scene.add(
    tableCollider
  );


  colliders.push(
    tableCollider
  );


  // ====================================
  // MEDICAL TRAY
  // ====================================

  const trayGroup =
    new THREE.Group();


  trayGroup.name =
    "ward-c-medical-tray";


  trayGroup.position.set(
    -2.8,
    1.25,
    -11
  );


  scene.add(
    trayGroup
  );


  // ====================================
  // TRAY BASE
  // ====================================

  const trayBase =
    createBox(
      1.2,
      0.06,
      0.65,

      metalMaterial,

      0,
      0,
      0
    );


  trayGroup.add(
    trayBase
  );


  // ====================================
  // TRAY FRONT EDGE
  // ====================================

  const trayFront =
    createBox(
      1.2,
      0.12,
      0.06,

      metalMaterial,

      0,
      0.07,
      -0.295
    );


  trayGroup.add(
    trayFront
  );


  // ====================================
  // TRAY BACK EDGE
  // ====================================

  const trayBack =
    createBox(
      1.2,
      0.12,
      0.06,

      metalMaterial,

      0,
      0.07,
      0.295
    );


  trayGroup.add(
    trayBack
  );


  // ====================================
  // TRAY LEFT EDGE
  // ====================================

  const trayLeft =
    createBox(
      0.06,
      0.12,
      0.55,

      metalMaterial,

      -0.57,
      0.07,
      0
    );


  trayGroup.add(
    trayLeft
  );


  // ====================================
  // TRAY RIGHT EDGE
  // ====================================

  const trayRight =
    createBox(
      0.06,
      0.12,
      0.55,

      metalMaterial,

      0.57,
      0.07,
      0
    );


  trayGroup.add(
    trayRight
  );


  // ====================================
  // TRAY SHADOWS
  // ====================================

  trayGroup.traverse(
    (child) => {

      if (
        !child.isMesh
      ) {

        return;

      }


      child.castShadow =
        true;

      child.receiveShadow =
        true;

    }
  );


  // ====================================
  // CHAIR
  // ====================================

  addCollider(
    createBox(
      1,
      0.2,
      1,

      darkMaterial,

      2.5,
      0.8,
      -12
    )
  );


  // ====================================
  // CHAIR BACK
  // ====================================

  addCollider(
    createBox(
      1,
      1.2,
      0.2,

      darkMaterial,

      2.5,
      1.4,
      -12.5
    )
  );


  // ====================================
  // RETURN COLLIDERS
  // ====================================

  return colliders;

}