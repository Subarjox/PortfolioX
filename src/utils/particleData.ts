import * as THREE from "three";

/**
 * Samples particle positions from a 2D text rendering so particles
 * form readable words like "fahreza", matching the discrete stippling in partikle.png.
 */
/**
 * Samples particle positions from a 2D text rendering so particles
 * form readable words like "code", matching the discrete stippling in partikle.png.
 * Uses jittered grid sampling to ensure breathing room between particles without clumping.
 */
export function generateTextParticleData(
  text: string = "code",
  size: number = 64
): Float32Array {
  const count = size * size;
  const data = new Float32Array(count * 4);

  let textPoints: [number, number][] = [];

  if (typeof document !== "undefined") {
    const canvas = document.createElement("canvas");
    const width = 2200;
    const height = 750;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });

    if (ctx) {
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, width, height);

      // Render modern geometric bold text matching partikle.png
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = '700 290px "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
      try {
        (ctx as unknown as { letterSpacing?: string }).letterSpacing = "24px";
      } catch {
        // letterSpacing fallback
      }
      ctx.fillText(text, width / 2, height / 2);

      const imgData = ctx.getImageData(0, 0, width, height);
      const pixels = imgData.data;

      let minX = width;
      let maxX = 0;
      let minY = height;
      let maxY = 0;
      let textPixelCount = 0;

      // First pass: find text bounds and calculate area
      for (let y = 0; y < height; y += 4) {
        for (let x = 0; x < width; x += 4) {
          const idx = (y * width + x) * 4;
          if (pixels[idx] > 80) {
            textPixelCount += 16;
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          }
        }
      }

      // Calculate grid step so all particles fit directly onto the text letters with breathing room
      const step = Math.max(3, Math.round(Math.sqrt(Math.max(textPixelCount, 1000) / count)));

      // Jittered grid sampling: 1 particle per cell strictly inside text letters
      for (let y = Math.max(0, minY - 2); y <= Math.min(height - 1, maxY + 2); y += step) {
        for (let x = Math.max(0, minX - 2); x <= Math.min(width - 1, maxX + 2); x += step) {
          const sampleX = Math.min(width - 1, x + Math.floor(step / 2));
          const sampleY = Math.min(height - 1, y + Math.floor(step / 2));
          const idx = (sampleY * width + sampleX) * 4;
          if (pixels[idx] > 80) {
            const jx = x + (Math.random() * 0.72 + 0.14) * step;
            const jy = y + (Math.random() * 0.72 + 0.14) * step;
            textPoints.push([jx, jy]);
          }
        }
      }

      const textWidth = Math.max(maxX - minX, 1);
      const textHeight = Math.max(maxY - minY, 1);
      const targetWidth = 4.8; // 3D world width matching partikle.png proportion
      const targetHeight = (targetWidth / textWidth) * textHeight;

      if (textPoints.length > 0) {
        // Shuffle text points for natural, organic distribution
        for (let i = textPoints.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          const temp = textPoints[i];
          textPoints[i] = textPoints[j];
          textPoints[j] = temp;
        }

        // Place ALL count particles strictly on the text (0 particles in the background)
        for (let i = 0; i < count; i++) {
          const i4 = i * 4;
          let ptX: number;
          let ptY: number;

          if (i < textPoints.length) {
            ptX = textPoints[i][0];
            ptY = textPoints[i][1];
          } else {
            // If count exceeds unique grid cells, place subtly within text letters without clumping
            const base = textPoints[i % textPoints.length];
            ptX = base[0] + (Math.random() - 0.5) * (step * 0.6);
            ptY = base[1] + (Math.random() - 0.5) * (step * 0.6);
          }

          const normX = ((ptX - minX) / textWidth - 0.5) * targetWidth;
          const normY = -((ptY - minY) / textHeight - 0.5) * targetHeight + 0.08;
          // Shallow Z depth to prevent overlapping in screen projection
          const normZ = (Math.random() - 0.5) * 0.035;

          data[i4 + 0] = normX;
          data[i4 + 1] = normY;
          data[i4 + 2] = normZ;
          data[i4 + 3] = 0.5 + Math.random() * 0.5; // Discrete brightness
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
    data[i4 + 2] = (Math.random() - 0.5) * 0.05;
    data[i4 + 3] = 0.5 + Math.random() * 0.5;
  }

  return data;
}

export function generateInitialParticleData(size: number): Float32Array {
  return generateTextParticleData("code", size);
}

export function createPositionDataTexture(
  size: number,
  text: string = "code"
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
