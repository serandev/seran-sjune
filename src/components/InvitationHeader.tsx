import React, { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';

const InvitationHeader: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-background/80 backdrop-blur-md py-2 shadow-sm'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4 flex justify-center items-center">
        <div className="flex items-center gap-2">
          <Heart
            className={`text-accent ${
              scrolled ? 'w-4 h-4' : 'w-5 h-5'
            } transition-all duration-300`}
            fill="currentColor"
          />
          <h1
            className={`font-himelody text-primary transition-all duration-300 ${
              scrolled ? 'text-lg' : 'text-xl'
            }`}
          >
            염세란 & 김선준
          </h1>
          <Heart
            className={`text-accent ${
              scrolled ? 'w-4 h-4' : 'w-5 h-5'
            } transition-all duration-300`}
            fill="currentColor"
          />
        </div>
      </div>
    </header>
  );
};

export default InvitationHeader;
