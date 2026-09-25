import * as THREE from "three";

export function generateInitialParticleData(size: number): Float32Array {
  const count = size * size;
  const data = new Float32Array(count * 4);

  for (let i = 0; i < count; i++) {
    const i4 = i * 4;

    // Distribute particles across a layered spherical fluid volume
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(Math.random() * 2 - 1);
    const radius = 0.8 + Math.pow(Math.random(), 1.6) * 2.4;

    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta);
    const z = radius * Math.cos(phi);

    data[i4 + 0] = x;
    data[i4 + 1] = y;
    data[i4 + 2] = z;
    data[i4 + 3] = Math.random(); // Lifetime / phase
  }

  return data;
}

export function createPositionDataTexture(size: number): THREE.DataTexture {
  const data = generateInitialParticleData(size);
  const texture = new THREE.DataTexture(
    data,
    size,
    size,
    THREE.RGBAFormat,
    THREE.FloatType
  );
  texture.minFilter = THREE.NearestFilter;
  texture.magFilter = THREE.NearestFilter;
  texture.needsUpdate = true;
  return texture;
}

export function generateParticleUVs(size: number): Float32Array {
  const count = size * size;
  const uvs = new Float32Array(count * 2);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 2;
      uvs[idx + 0] = (x + 0.5) / size;
      uvs[idx + 1] = (y + 0.5) / size;
    }
  }

  return uvs;
}
