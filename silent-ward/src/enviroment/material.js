import * as THREE from "three";

const WALL_TILE_WIDTH = 2;
const WALL_TILE_HEIGHT = 2;

const plasterMap = createPlasterTexture();

export const wallMaterial =
  new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: plasterMap,
    roughness: 0.94,
    metalness: 0,
  });

export const floorMaterial =
  new THREE.MeshStandardMaterial({
    color: 0x252729,
    roughness: 0.95,
    metalness: 0,
  });

export const darkMaterial =
  new THREE.MeshStandardMaterial({
    color: 0x111214,
    roughness: 0.9,
    metalness: 0,
  });

export const metalMaterial =
  new THREE.MeshStandardMaterial({
    color: 0x55585a,
    metalness: 0.65,
    roughness: 0.45,
  });

export const bedMaterial =
  new THREE.MeshStandardMaterial({
    color: 0xb8b8b2,
    roughness: 0.9,
    metalness: 0,
  });

export const windowGlassMaterial =
  new THREE.MeshStandardMaterial({
    color: 0x17232a,
    transparent: true,
    opacity: 0.35,
    roughness: 0.2,
  });

export const windowFrameMaterial =
  new THREE.MeshStandardMaterial({
    color: 0x18191a,
    roughness: 0.8,
  });


function hashedNoise(x, y) {
  const n =
    Math.sin(x * 127.1 + y * 311.7) * 43758.5453;

  return n - Math.floor(n);
}


function createPlasterTexture() {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#8a8478";
  ctx.fillRect(0, 0, size, size);

  const image = ctx.getImageData(0, 0, size, size);
  const data = image.data;

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const i = (y * size + x) * 4;
      const grain = hashedNoise(x * 0.37, y * 0.41) * 18 - 9;
      const blotch = hashedNoise(x * 0.045, y * 0.05) * 22 - 8;
      const stain =
        Math.max(0, hashedNoise(x * 0.02, y * 0.03) - 0.72) * 70;

      data[i] = Math.max(0, Math.min(255, 138 + grain + blotch - stain));
      data[i + 1] = Math.max(0, Math.min(255, 132 + grain + blotch * 0.8 - stain * 0.7));
      data[i + 2] = Math.max(0, Math.min(255, 120 + grain * 0.7 + blotch * 0.5 - stain * 0.4));
    }
  }

  ctx.putImageData(image, 0, 0);

  ctx.strokeStyle = "rgba(70, 64, 56, 0.22)";
  ctx.lineWidth = 1;

  for (let c = 0; c < 12; c += 1) {
    const startX = hashedNoise(c * 3.1, 1.7) * size;
    const startY = hashedNoise(c * 5.9, 2.3) * size;
    ctx.beginPath();
    ctx.moveTo(startX, startY);

    let x = startX;
    let y = startY;

    for (let s = 0; s < 8; s += 1) {
      x += (hashedNoise(c, s + 0.2) - 0.5) * 28;
      y += 10 + hashedNoise(c + 2, s) * 16;
      ctx.lineTo(x, y);
    }

    ctx.stroke();
  }

  ctx.globalAlpha = 0.07;
  ctx.fillStyle = "#4a453c";
  for (let s = 0; s < 18; s += 1) {
    const sx = hashedNoise(s * 1.7, 8.2) * size;
    const sy = hashedNoise(s * 2.4, 3.6) * size;
    const rx = 18 + hashedNoise(s, 9.1) * 40;
    const ry = 12 + hashedNoise(s, 4.8) * 28;
    ctx.beginPath();
    ctx.ellipse(sx, sy, rx, ry, hashedNoise(s, 0.4) * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 2);
  texture.anisotropy = 4;
  texture.needsUpdate = true;

  return texture;
}


function cloneTiledMap(texture, repeatX, repeatY) {
  const cloned = texture.clone();
  cloned.wrapS = THREE.RepeatWrapping;
  cloned.wrapT = THREE.RepeatWrapping;
  cloned.repeat.set(repeatX, repeatY);
  cloned.needsUpdate = true;

  return cloned;
}


export function createWallMaterial(faceWidth, faceHeight) {
  const material = wallMaterial.clone();
  const repeatX = Math.max(faceWidth / WALL_TILE_WIDTH, 0.5);
  const repeatY = Math.max(faceHeight / WALL_TILE_HEIGHT, 0.5);

  material.map = cloneTiledMap(plasterMap, repeatX, repeatY);
  material.color.set(0xffffff);
  material.roughness = 0.94;
  material.metalness = 0;
  material.needsUpdate = true;

  return material;
}
