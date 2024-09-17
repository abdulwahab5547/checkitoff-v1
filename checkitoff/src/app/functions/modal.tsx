import React, { useRef, useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-dark bg-opacity-50 flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="p-6 rounded-xl shadow-lg max-w-sm mx-auto bg-lessDark"
        onClick={(e) => e.stopPropagation()} 
      >
        <h2 className="text-lg font-bold mb-4">confirm logout</h2>
        <p className="mb-4">are you sure you want to log out?</p>
        <div className="flex justify-end">
          <button
            onClick={onConfirm}
            className="bg-orange text-white px-3 py-1 rounded mr-2"
          >
            yes, logout
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 px-3 py-1 rounded text-dark"
          >
            cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
