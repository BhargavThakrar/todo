import React, { ReactNode } from 'react';
import { FaTimes } from 'react-icons/fa';

interface SlidingPanelProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const SlidingPanel: React.FC<SlidingPanelProps> = ({ isOpen, onClose, children }) => {
  return (
    <div
      className={`fixed z-50 inset-y-0 right-0 w-full sm:w-80 bg-white shadow-xl ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-lg font-semibold">Todo Form</h2>
        <button onClick={onClose} className="text-gray-600 hover:text-gray-800">
          <FaTimes />
        </button>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
};

export default SlidingPanel;
