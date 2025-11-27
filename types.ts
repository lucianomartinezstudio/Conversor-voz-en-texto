export interface TranscriptionSegment {
  text: string;
  isFinal: boolean;
  timestamp: number;
}

export enum ConnectionState {
  DISCONNECTED = 'DISCONNECTED',
  CONNECTING = 'CONNECTING',
  CONNECTED = 'CONNECTED',
  ERROR = 'ERROR'
}

export interface AudioConfig {
  sampleRate: number;
}
