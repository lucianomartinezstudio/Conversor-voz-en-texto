import React, { useRef, useEffect } from 'react';
import { useLiveTranscription } from './hooks/useLiveTranscription';
import { Header } from './components/Header';
import { Toolbar } from './components/Toolbar';
import { StatusIndicator } from './components/StatusIndicator';
import { ConnectionState } from './types';
import { Mic, Square, AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const { 
    connectionState, 
    transcription, 
    error, 
    connect, 
    disconnect, 
    clearTranscription,
    setTranscription 
  } = useLiveTranscription();

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isRecording = connectionState === ConnectionState.CONNECTED;

  // Auto-scroll logic
  useEffect(() => {
    if (textareaRef.current && isRecording) {
      textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
    }
  }, [transcription, isRecording]);

  const handleToggleRecord = () => {
    if (isRecording || connectionState === ConnectionState.CONNECTING) {
      disconnect();
    } else {
      connect();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 font-sans text-slate-900">
      <Header />

      <main className="flex-1 flex flex-col p-4 md:p-6 max-w-5xl mx-auto w-full gap-4 overflow-hidden">
        
        {/* Error Notification */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
            <AlertCircle size={20} />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* Status & Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 w-full sm:w-auto">
               <StatusIndicator status={connectionState} />
            </div>

            <button
              onClick={handleToggleRecord}
              className={`
                w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold transition-all shadow-md active:scale-95
                ${isRecording 
                  ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/20' 
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20'
                }
              `}
            >
              {isRecording ? (
                <>
                  <Square size={18} fill="currentColor" />
                  <span>Detener</span>
                </>
              ) : (
                <>
                  <Mic size={20} />
                  <span>Iniciar Dictado</span>
                </>
              )}
            </button>
        </div>

        {/* Document Editor Area */}
        <div className="flex-1 flex flex-col bg-white rounded-xl shadow-lg shadow-slate-200/50 border border-slate-200 overflow-hidden">
          <div className="flex-1 relative">
             <textarea
              ref={textareaRef}
              className="w-full h-full p-8 text-lg leading-loose text-slate-800 resize-none outline-none custom-scrollbar font-medium"
              placeholder="Presiona 'Iniciar Dictado' y comienza a hablar..."
              value={transcription}
              onChange={(e) => setTranscription(e.target.value)}
              spellCheck={false}
            />
            
            {/* Character Count Overlay */}
            <div className="absolute bottom-4 right-6 text-xs font-semibold text-slate-300 pointer-events-none select-none">
              {transcription.length} caracteres
            </div>
          </div>
          
          <Toolbar text={transcription} onClear={clearTranscription} />
        </div>
      </main>
    </div>
  );
};

export default App;
