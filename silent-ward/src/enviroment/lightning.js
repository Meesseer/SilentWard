import * as THREE from "three";

export function createLighting(scene) {

  const ambientLight =
    new THREE.AmbientLight(
      0x9aa0a3,
      1
    );

  scene.add(ambientLight);


  const ceilingLight =
    new THREE.PointLight(
      0xe8edf0,
      18,
      14
    );

  ceilingLight.position.set(
    0,
    4.4,
    0
  );

  ceilingLight.castShadow = true;

  ceilingLight.shadow.mapSize.width =
    1024;

  ceilingLight.shadow.mapSize.height =
    1024;

  ceilingLight.userData.baseIntensity =
    18;

  scene.add(ceilingLight);


  const windowLight =
    new THREE.PointLight(
      0x557c96,
      4,
      9
    );

  windowLight.position.set(
    3,
    2.5,
    -4
  );

  scene.add(windowLight);


  const emergencyLight =
    new THREE.PointLight(
      0x8b2020,
      1.5,
      5
    );

  emergencyLight.position.set(
    -4,
    2.8,
    -4
  );

  scene.add(emergencyLight);


  return {
    ceilingLight,
    windowLight,
    emergencyLight,
  };
}


export function updateLighting(
  elapsedTime,
  lights
) {
  const flicker =
    Math.sin(elapsedTime * 35) *
    0.15;

  lights.ceilingLight.intensity =
    lights.ceilingLight.userData.baseIntensity +
    flicker;

  const corridorLights =
    lights.corridorLights || [];

  corridorLights.forEach(
    ({ light, fixture }) => {

      const phase =
        light.userData.phase || 0;

      const pulse =
        Math.sin(elapsedTime * 26 + phase) *
        Math.sin(elapsedTime * 4.7 + phase * 0.35);

      let amount =
        0.62 + pulse * 0.38;

      if (Math.sin(elapsedTime * 1.6 + phase * 0.9) > 0.91) {
        amount *= 0.06;
      }

      if (Math.sin(elapsedTime * 11.4 + phase * 2.1) > 0.97) {
        amount *= 0.15;
      }

      light.intensity =
        light.userData.baseIntensity *
        Math.max(amount, 0.04);

      if (fixture && fixture.material) {
        fixture.material.emissiveIntensity =
          Math.max(amount, 0.05);
      }

    }
  );
}