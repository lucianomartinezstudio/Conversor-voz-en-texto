import { Blob } from '@google/genai';

/**
 * Converts Float32Array PCM audio data to the format expected by Gemini (Int16 PCM).
 */
export function createPcmBlob(data: Float32Array, sampleRate: number): Blob {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    // Clamp values to [-1, 1] range to prevent wrapping
    const s = Math.max(-1, Math.min(1, data[i]));
    // Convert to 16-bit PCM
    int16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
  }
  
  return {
    data: arrayBufferToBase64(int16.buffer),
    mimeType: `audio/pcm;rate=${sampleRate}`,
  };
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}
