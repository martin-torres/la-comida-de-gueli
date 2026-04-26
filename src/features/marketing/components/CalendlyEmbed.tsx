import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

interface CalendlyEmbedProps {
  prefillName?: string;
  prefillEmail?: string;
  onClose: () => void;
}

const CALENDLY_URL = import.meta.env.VITE_CALENDLY_URL || 'https://calendly.com/demo-la-comida-de-gueli/15min';

export const CalendlyEmbed: React.FC<CalendlyEmbedProps> = ({
  prefillName,
  prefillEmail,
  onClose,
}) => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const embedUrl = new URL(CALENDLY_URL);
  if (prefillName) embedUrl.searchParams.set('name', prefillName);
  if (prefillEmail) embedUrl.searchParams.set('email', prefillEmail);
  embedUrl.searchParams.set('embed_type', 'Inline');
  embedUrl.searchParams.set('hide_gdpr_banner', '1');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-800">Agendar demo</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-4 h-[600px]">
          <div
            className="calendly-inline-widget"
            data-url={embedUrl.toString()}
            style={{ minWidth: '320px', height: '100%' }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
};