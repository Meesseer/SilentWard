import * as THREE from "three";

export function prepareModel(model) {
  model.traverse((child) => {
    if (!child.isMesh) {
      return;
    }

    child.castShadow = false;
    child.receiveShadow = false;
    child.frustumCulled = true;

    if (child.material) {
      child.material.needsUpdate = true;
    }
  });

  return model;
}


export function orientModelWidthAlongX(model) {
  model.updateMatrixWorld(true);

  const bounds =
    new THREE.Box3().setFromObject(model);

  const size =
    new THREE.Vector3();

  bounds.getSize(size);

  if (size.z > size.x) {
    model.rotation.y += Math.PI / 2;
    model.updateMatrixWorld(true);
  }

  return model;
}


export function fitModelToSize(model, targetWidth, targetHeight) {
  orientModelWidthAlongX(model);

  const bounds =
    new THREE.Box3().setFromObject(model);

  const size =
    new THREE.Vector3();

  bounds.getSize(size);

  if (size.x <= 0 || size.y <= 0) {
    return bounds;
  }

  const scale =
    Math.min(
      targetWidth / size.x,
      targetHeight / size.y
    );

  model.scale.multiplyScalar(scale);
  model.updateMatrixWorld(true);

  return new THREE.Box3().setFromObject(model);
}


export function alignModelToPoint(model, bounds, x, y, z) {
  const center =
    new THREE.Vector3();

  bounds.getCenter(center);

  model.position.x += x - center.x;
  model.position.z += z - center.z;
  model.position.y += -bounds.min.y + y;

  model.updateMatrixWorld(true);

  return new THREE.Box3().setFromObject(model);
}


export function hingeModelOnLeft(model, bounds) {
  const centerZ =
    (bounds.min.z + bounds.max.z) / 2;

  model.position.x += -bounds.min.x;
  model.position.y += -bounds.min.y;
  model.position.z += -centerZ;

  model.updateMatrixWorld(true);

  return new THREE.Box3().setFromObject(model);
}