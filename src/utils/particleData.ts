import * as THREE from "three";

/**
 * Samples particle positions from a 2D text rendering so particles
 * form readable words like "fahreza", matching the discrete stippling in partikle.png.
 */
export function generateTextParticleData(
  text: string = "fahreza",
  size: number = 128
): Float32Array {
  const count = size * size;
  const data = new Float32Array(count * 4);

  let sampledPoints: [number, number][] = [];

  if (typeof document !== "undefined") {
    const canvas = document.createElement("canvas");
    const width = 1800;
    const height = 600;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });

    if (ctx) {
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, width, height);

      // Render bold text matching modern editorial stippled layout
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = '900 260px "Arial Black", "Inter", "Helvetica Neue", sans-serif';
      ctx.fillText(text, width / 2, height / 2);

      const imgData = ctx.getImageData(0, 0, width, height);
      const pixels = imgData.data;

      let minX = width;
      let maxX = 0;
      let minY = height;
      let maxY = 0;

      // Scan step of 2 for fine stippling detail
      const step = 2;
      for (let y = 0; y < height; y += step) {
        for (let x = 0; x < width; x += step) {
          const idx = (y * width + x) * 4;
          if (pixels[idx] > 110) {
            sampledPoints.push([x, y]);
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          }
        }
      }

      const textWidth = Math.max(maxX - minX, 1);
      const textHeight = Math.max(maxY - minY, 1);
      const targetWidth = 4.4; // 3D world width
      const targetHeight = (targetWidth / textWidth) * textHeight;

      if (sampledPoints.length > 0) {
        for (let i = 0; i < count; i++) {
          const i4 = i * 4;
          // Randomly sample from text points with subtle organic jitter
          const pt = sampledPoints[Math.floor(Math.random() * sampledPoints.length)];
          const normX = ((pt[0] - minX) / textWidth - 0.5) * targetWidth;
          const normY = -((pt[1] - minY) / textHeight - 0.5) * targetHeight;

          // 3D stippled volume dispersion
          const jitterX = (Math.random() - 0.5) * 0.035;
          const jitterY = (Math.random() - 0.5) * 0.035;
          const jitterZ = (Math.random() - 0.5) * 0.14;

          data[i4 + 0] = normX + jitterX;
          data[i4 + 1] = normY + jitterY;
          data[i4 + 2] = jitterZ;
          data[i4 + 3] = Math.random(); // Life/phase
        }
        return data;
      }
    }
  }

  // Fallback for non-browser / vitest test execution
  for (let i = 0; i < count; i++) {
    const i4 = i * 4;
    data[i4 + 0] = (Math.random() - 0.5) * 4.0;
    data[i4 + 1] = (Math.random() - 0.5) * 1.2;
    data[i4 + 2] = (Math.random() - 0.5) * 0.15;
    data[i4 + 3] = Math.random();
  }

  return data;
}

export function generateInitialParticleData(size: number): Float32Array {
  return generateTextParticleData("fahreza", size);
}

export function createPositionDataTexture(
  size: number,
  text: string = "fahreza"
): THREE.DataTexture {
  const data = generateTextParticleData(text, size);
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
