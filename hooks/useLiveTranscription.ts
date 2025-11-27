import { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { ConnectionState } from '../types';
import { GEMINI_MODEL, SYSTEM_INSTRUCTION, AUDIO_SAMPLE_RATE } from '../constants';
import { createPcmBlob } from '../services/audioUtils';

export const useLiveTranscription = () => {
  const [connectionState, setConnectionState] = useState<ConnectionState>(ConnectionState.DISCONNECTED);
  const [transcription, setTranscription] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  
  // Use a ref to track if we are currently connected to avoid race conditions
  const isConnectedRef = useRef<boolean>(false);

  const disconnect = useCallback(async () => {
    isConnectedRef.current = false;
    
    // Stop tracks
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }

    // Disconnect nodes
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (sourceRef.current) {
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }

    // Close context
    if (audioContextRef.current) {
      if (audioContextRef.current.state !== 'closed') {
        await audioContextRef.current.close();
      }
      audioContextRef.current = null;
    }

    setConnectionState(ConnectionState.DISCONNECTED);
  }, []);

  const connect = useCallback(async () => {
    if (isConnectedRef.current) return;
    
    try {
      setConnectionState(ConnectionState.CONNECTING);
      setError(null);

      if (!process.env.API_KEY) {
        throw new Error("API Key no encontrada");
      }

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

      // 1. Setup Audio Context with specific sample rate
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const audioContext = new AudioContextClass({ sampleRate: AUDIO_SAMPLE_RATE });
      audioContextRef.current = audioContext;

      // 2. Get Microphone Stream
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          channelCount: 1,
          echoCancellation: true,
          autoGainControl: true,
          noiseSuppression: true,
        } 
      });
      mediaStreamRef.current = stream;

      // 3. Initialize Gemini Live Session
      // We start the session promise immediately
      const sessionPromise = ai.live.connect({
        model: GEMINI_MODEL,
        config: {
          responseModalities: [Modality.AUDIO], 
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } }
          },
          systemInstruction: SYSTEM_INSTRUCTION,
          inputAudioTranscription: {}, // Request transcription of user input
        },
        callbacks: {
          onopen: () => {
            console.log("Sesión de Gemini Live conectada");
            setConnectionState(ConnectionState.CONNECTED);
            isConnectedRef.current = true;

            // 4. Setup Audio Processing only after connection is open
            const source = audioContext.createMediaStreamSource(stream);
            const processor = audioContext.createScriptProcessor(4096, 1, 1);
            
            processor.onaudioprocess = (e) => {
              if (!isConnectedRef.current) return;
              
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmBlob = createPcmBlob(inputData, AUDIO_SAMPLE_RATE);
              
              sessionPromise.then((session) => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };

            source.connect(processor);
            processor.connect(audioContext.destination);
            
            sourceRef.current = source;
            processorRef.current = processor;
          },
          onmessage: (message: LiveServerMessage) => {
            // Process Input Transcription (User's voice)
            const inputTx = message.serverContent?.inputTranscription;
            if (inputTx?.text) {
               setTranscription(prev => prev + inputTx.text);
            }
            
            // Note: We ignore turnComplete for simple stream accumulation here to 
            // avoid complex logic, relying on the stream of text chunks.
          },
          onclose: () => {
            console.log("Sesión cerrada");
            if (isConnectedRef.current) {
              disconnect();
            }
          },
          onerror: (err) => {
            console.error("Error en Live API:", err);
            setError("Error de conexión. Por favor, intenta de nuevo.");
            disconnect();
          }
        }
      });

    } catch (err: any) {
      console.error("Error al iniciar:", err);
      setError(err.message || "No se pudo iniciar el micrófono o la conexión.");
      disconnect();
    }
  }, [disconnect]);

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    connectionState,
    transcription,
    error,
    connect,
    disconnect,
    clearTranscription: () => setTranscription(''),
    setTranscription
  };
};
