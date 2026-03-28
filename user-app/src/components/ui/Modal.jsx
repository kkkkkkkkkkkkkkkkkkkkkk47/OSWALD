import { useEffect } from 'react';
import { HiX } from 'react-icons/hi';

export default function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizes = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className={`relative glass-card p-7 w-full ${sizes[size]} max-h-[90vh] overflow-y-auto animate-scale-in shadow-2xl`}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-dark-900 dark:text-white">{title}</h3>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-dark-100 dark:hover:bg-dark-700 transition-all duration-300 hover:rotate-90" aria-label="Close modal">
            <HiX className="w-5 h-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
