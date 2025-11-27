import React from 'react';
import { ConnectionState } from '../types';
import { Loader2, Mic } from 'lucide-react';

interface StatusIndicatorProps {
  status: ConnectionState;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status }) => {
  switch (status) {
    case ConnectionState.CONNECTED:
      return (
        <div className="flex items-center gap-3 text-rose-600">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
          </span>
          <span className="font-semibold text-sm">Escuchando...</span>
        </div>
      );
    case ConnectionState.CONNECTING:
      return (
        <div className="flex items-center gap-3 text-indigo-600">
          <Loader2 size={16} className="animate-spin" />
          <span className="font-semibold text-sm">Conectando...</span>
        </div>
      );
    case ConnectionState.ERROR:
       return (
        <div className="flex items-center gap-2 text-red-500">
           <span className="h-2 w-2 rounded-full bg-red-500"></span>
           <span className="font-semibold text-sm">Desconectado</span>
        </div>
      );
    default:
      return (
        <div className="flex items-center gap-2 text-slate-400">
           <Mic size={16} />
           <span className="font-medium text-sm">Listo</span>
        </div>
      );
  }
};
