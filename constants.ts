export const GEMINI_MODEL = 'gemini-2.5-flash-native-audio-preview-09-2025';

export const AUDIO_SAMPLE_RATE = 16000;
export const OUTPUT_SAMPLE_RATE = 24000;

export const SYSTEM_INSTRUCTION = `
Eres una herramienta de dictado experta. Tu ÚNICA función es transcribir lo que dice el usuario.
IMPORTANTE:
1. NO respondas a lo que dice el usuario.
2. NO emitas ningún sonido ni palabras habladas.
3. Mantente en silencio absoluto y escucha atentamente para transcribir.
`;
