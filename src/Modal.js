import { useEffect } from "react";

const Modal = ({ title, children, onClose }) => {
  // Close the modal when the Escape key is pressed
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

 
  const handleBackdropClick = (event) => {
    if (event.target.id === "modal-backdrop") {
      onClose();
    }
  };

  return (
    <div
      id="modal-backdrop"
      className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 transition-opacity"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white dark:bg-[#191e3a] p-6 rounded-lg shadow-lg max-w-lg w-full relative h-auto max-h-[70vh] overflow-hidden animate-fadeIn">
     
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 bg-white text-gray-600 rounded-full dark:text-white hover:text-gray-800 dark:hover:text-gray-300"
          aria-label="Close modal"
        >
          <img src="../img/cros.png" className="w-4 h-4" alt="Close" />
        </button>

       
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">{title}</h3>

        
        <div className="max-h-[60vh] overflow-y-auto p-2">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
