import React from 'react';
import { X, CheckCircle, AlertTriangle, Info } from 'lucide-react';

interface ToastProps {
  content: string;
  color: 'bg-green-500/90' | 'bg-red-500/90' | 'bg-blue-500/90' | 'bg-yellow-500/90';
  isVisible: boolean;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ content, color, isVisible, onClose }) => {
  if (!isVisible) return null;

  const getIcon = () => {
    if (color.includes('green')) return <CheckCircle className="w-5 h-5" />;
    if (color.includes('red')) return <AlertTriangle className="w-5 h-5" />;
    return <Info className="w-5 h-5" />;
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] transition-opacity duration-300">
      <div className={`p-4 rounded-lg shadow-xl text-white flex items-center gap-3 backdrop-blur-sm ${color}`}>
        {getIcon()}
        <span className="text-sm font-medium">{content}</span>
        <button 
          onClick={onClose} 
          className="ml-auto p-1 rounded-full hover:bg-white/20 transition-colors"
          aria-label="ပိတ်ရန်"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Toast;