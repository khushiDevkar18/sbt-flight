const Modal = ({ title, children, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white dark:bg-[#191e3a] p-6 rounded-lg shadow-lg max-w-lg w-full relative h-[70vh] h-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 dark:text-white hover:text-gray-800 dark:hover:text-gray-300"
        >
          ✖
        </button>

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">{title}</h3>

        {/* Modal Content (Scrollable) */}
        <div className="max-h-[50vh] h-auto overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;

