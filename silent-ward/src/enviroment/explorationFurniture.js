import * as THREE from "three";

import {
  GLTFLoader,
} from "three/addons/loaders/GLTFLoader.js";


// ====================================
// EXPLORATION ROOM FURNITURE
// ====================================

const loader =
  new GLTFLoader();

const modelCache =
  new Map();


function loadFurniture(path) {

  if (!modelCache.has(path)) {
    modelCache.set(
      path,
      loader.loadAsync(path).then((gltf) => gltf.scene)
    );
  }

  return modelCache.get(path);

}


function createCollider(scene, bounds) {

  const size =
    new THREE.Vector3();

  const center =
    new THREE.Vector3();

  bounds.getSize(size);
  bounds.getCenter(center);

  const collider =
    new THREE.Mesh(
      new THREE.BoxGeometry(
        size.x,
        size.y,
        size.z
      ),
      new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0,
      })
    );

  collider.position.copy(center);
  collider.name = "exploration-furniture-collider";

  scene.add(collider);

  return collider;

}


async function addFurniture(scene, placement) {

  try {

    const source =
      await loadFurniture(placement.path);

    const model =
      source.clone(true);

    model.rotation.y =
      placement.rotation || 0;

    model.updateMatrixWorld(true);

    const initialBounds =
      new THREE.Box3().setFromObject(model);

    const initialSize =
      new THREE.Vector3();

    initialBounds.getSize(initialSize);

    if (initialSize.y <= 0) {
      return null;
    }

    const scale =
      placement.height / initialSize.y;

    model.scale.setScalar(scale);
    model.updateMatrixWorld(true);

    const scaledBounds =
      new THREE.Box3().setFromObject(model);

    const scaledCenter =
      new THREE.Vector3();

    scaledBounds.getCenter(scaledCenter);

    model.position.x +=
      placement.x - scaledCenter.x;

    model.position.z +=
      placement.z - scaledCenter.z;

    model.position.y +=
      -scaledBounds.min.y +
      (placement.y || 0);

    model.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    scene.add(model);
    model.updateMatrixWorld(true);

    const finalBounds =
      new THREE.Box3().setFromObject(model);

    return createCollider(scene, finalBounds);

  }
  catch (error) {

    console.error(
      `Failed to load exploration furniture: ${placement.path}`,
      error
    );

    return null;

  }

}


export async function createExplorationFurniture(scene) {

  const furniture = [
    // Spawn-room Examination Room
    { path: "/assets/models/furniture/hospital-bed.glb", x: -3, z: 9, height: 3, rotation: Math.PI },
    { path: "/assets/models/furniture/oldWallClock.glb", x: -3, y: 2.5, z: 10.75, height: 0.85 },

    // Spawn-room Records Room
    { path: "/assets/models/furniture/filing_cabinets.glb", x: 3, z: 8.8, height: 2.1, rotation: Math.PI },
    { path: "/assets/models/furniture/oldWallClock.glb", x: 3, y: 2.5, z: 10.75, height: 0.85 },

    // Corridor Treatment Room
    { path: "/assets/models/furniture/hospital-bed.glb", x: -5.4, z: -17, height: 2.2, rotation: Math.PI / 2 },
    { path: "/assets/models/furniture/wheelChair.glb", x: -6.8, z: -16, height: 1.9 },

    // Corridor Supply Room
    { path: "/assets/models/furniture/wheelChair.glb", x: 5.5, z: -22, height: 2.1, rotation: -Math.PI / 2 },
    { path: "/assets/models/furniture/oldWallClock.glb", x: 7.75, y: 2.2, z: -22, height: 0.8, rotation: Math.PI / 2 },

    // Corridor Observation Room
    { path: "/assets/models/furniture/hospital-bed.glb", x: -5.4, z: -27, height: 2.2, rotation: Math.PI / 2 },
    { path: "/assets/models/furniture/oldWallClock.glb", x: -7.75, y: 2.2, z: -27, height: 0.8, rotation: -Math.PI / 2 },
  ];

  const results =
    await Promise.all(
      furniture.map((placement) => addFurniture(scene, placement))
    );

  return results.filter(Boolean);

}
