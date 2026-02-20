interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  size?: "default" | "wide" | "xl";
}

export function Modal({ isOpen, onClose, children, size = "default" }: ModalProps) {
  if (!isOpen) return null;

  const maxWidth = size === "xl" ? "max-w-4xl" : size === "wide" ? "max-w-2xl" : "max-w-lg";

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4 sm:p-6">
      <div className={`bg-steam-panel w-full ${maxWidth} max-h-[90vh] overflow-hidden relative`}>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-steam-text-muted hover:text-steam-text focus:outline-none focus:ring-2 focus:ring-steam/50 rounded p-1"
          aria-label="Close"
        >
          [ESC]
        </button>
        <div className="overflow-y-auto max-h-[90vh] sm:max-h-[85vh] custom-scrollbar overscroll-contain">
          {children}
        </div>
      </div>
    </div>
  );
} 