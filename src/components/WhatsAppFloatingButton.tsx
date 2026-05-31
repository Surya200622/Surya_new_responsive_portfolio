'use client';

import { MessageSquare } from 'lucide-react';

export default function WhatsAppFloatingButton() {
  const handleWhatsAppClick = () => {
    const msg = `Hi Surya,\n\nI need some support regarding my project.`;
    window.open(`https://wa.me/918220443165?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <button
      onClick={handleWhatsAppClick}
      className="fixed bottom-6 right-6 z-50 p-4 rounded-full text-white shadow-xl hover:shadow-2xl transition-transform hover:-translate-y-1 active:scale-95 flex items-center justify-center animate-in fade-in slide-in-from-bottom-8 duration-700"
      style={{ backgroundColor: '#25D366' }} // WhatsApp Green
      title="Contact Support on WhatsApp"
      aria-label="Contact Support on WhatsApp"
    >
      <MessageSquare size={28} />
      
      {/* Optional Ping Indicator */}
      <span className="absolute top-0 right-0 flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
      </span>
    </button>
  );
}
