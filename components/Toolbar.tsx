import React from 'react';
import { Copy, FileText, Download, Trash2, Check } from 'lucide-react';

interface ToolbarProps {
  text: string;
  onClear: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({ text, onClear }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (format: 'txt' | 'doc') => {
    if (!text) return;

    let mimeType = 'text/plain';
    let extension = 'txt';

    if (format === 'doc') {
      // Create a simple HTML structure that Word can interpret as a document
      mimeType = 'application/msword';
      extension = 'doc';
    }

    const content = format === 'doc' 
      ? `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head><meta charset='utf-8'><title>Documento Exportado</title></head>
        <body>${text.replace(/\n/g, '<br>')}</body>
        </html>
      `
      : text;

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `transcripcion_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const isDisabled = !text || text.length === 0;

  return (
    <div className="flex flex-wrap items-center gap-2 p-3 bg-slate-100 border-t border-slate-200">
      <div className="flex items-center gap-2 mr-auto">
         <button
          onClick={handleCopy}
          disabled={isDisabled}
          className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            isDisabled ? 'opacity-50 cursor-not-allowed text-slate-400' : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-sm'
          }`}
        >
          {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
          {copied ? 'Copiado' : 'Copiar'}
        </button>
        
        <button
          onClick={onClear}
          disabled={isDisabled}
          className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
             isDisabled ? 'opacity-50 cursor-not-allowed text-slate-400' : 'bg-white hover:bg-red-50 text-slate-700 hover:text-red-600 border border-slate-300 shadow-sm'
          }`}
        >
          <Trash2 size={16} />
          <span className="hidden sm:inline">Borrar</span>
        </button>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-1 hidden sm:inline">Exportar:</span>
        <button
          onClick={() => handleDownload('txt')}
          disabled={isDisabled}
          className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            isDisabled ? 'opacity-50 cursor-not-allowed bg-slate-200 text-slate-400' : 'bg-slate-800 hover:bg-slate-900 text-white shadow-sm'
          }`}
        >
          <FileText size={16} />
          .TXT
        </button>
        <button
          onClick={() => handleDownload('doc')}
          disabled={isDisabled}
          className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            isDisabled ? 'opacity-50 cursor-not-allowed bg-slate-200 text-slate-400' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
          }`}
        >
          <Download size={16} />
          .DOC
        </button>
      </div>
    </div>
  );
};
