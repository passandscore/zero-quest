interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-black border border-[#33ff00] w-full max-w-3xl mx-4 max-h-[90vh] overflow-hidden relative">
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 text-green-500/50 hover:text-green-400"
        >
          [ESC]
        </button>
        <div className="overflow-y-auto max-h-[90vh] custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
} 