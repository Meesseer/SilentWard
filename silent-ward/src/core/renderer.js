import * as THREE from "three";

import {
  RENDER_CONFIG,
} from "../config/gameConfig.js";

export function createRenderer() {
  const pixelRatio =
    Math.min(
      window.devicePixelRatio || 1,
      RENDER_CONFIG.maxPixelRatio
    );

  const renderer =
    new THREE.WebGLRenderer({
      antialias: pixelRatio < 1.25,
      powerPreference: "high-performance",
      stencil: false,
      depth: true,
    });

  renderer.setSize(
    window.innerWidth,
    window.innerHeight
  );

  renderer.setPixelRatio(pixelRatio);

  renderer.shadowMap.enabled = false;

  renderer.outputColorSpace =
    THREE.SRGBColorSpace;

  renderer.toneMapping =
    THREE.ACESFilmicToneMapping;

  renderer.toneMappingExposure = 0.8;

  document.body.appendChild(
    renderer.domElement
  );

  return renderer;
}
