import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

const photos = [
  {
    id: 1,
    src: 'https://serandev.github.io/serena-invitation/20250424_SR_SJ_1.jpg',
    alt: 'Couple at sunset',
  },
  {
    id: 2,
    src: 'https://serandev.github.io/serena-invitation/20250424_SR_SJ_2.jpg',
    alt: 'Couple holding hands',
  },
  {
    id: 3,
    src: 'https://serandev.github.io/serena-invitation/20250424_SR_SJ_3.jpg',
    alt: 'Couple laughing',
  },
  {
    id: 4,
    src: 'https://serandev.github.io/serena-invitation/20250424_SR_SJ_4.jpg',
    alt: 'Couple walking on beach',
  },
  {
    id: 5,
    src: 'https://serandev.github.io/serena-invitation/20250424_SR_SJ_5.jpg',
    alt: 'Couple embracing',
  },
  {
    id: 6,
    src: 'https://serandev.github.io/serena-invitation/20250424_SR_SJ_6.jpg',
    alt: 'Couple silhouette',
  },
];

const GallerySection: React.FC = () => {
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fadeIn');
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const openLightbox = (index: number) => {
    setSelectedPhoto(index);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedPhoto(null);
    document.body.style.overflow = 'auto';
  };

  const navigatePhoto = (direction: 'prev' | 'next') => {
    if (selectedPhoto === null) return;

    if (direction === 'prev') {
      setSelectedPhoto((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
    } else {
      setSelectedPhoto((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
    }
  };

  // Close on escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft' && selectedPhoto !== null)
        navigatePhoto('prev');
      if (e.key === 'ArrowRight' && selectedPhoto !== null)
        navigatePhoto('next');
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPhoto]);

  return (
    <>
      <section ref={sectionRef} className="py-10 bg-primary/5 opacity-0">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="font-himelody text-3xl md:text-4xl text-primary mb-12">
              우리의 사진들
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {photos.map((photo, index) => (
                <div
                  key={photo.id}
                  className="overflow-hidden rounded-lg shadow-md cursor-pointer transform transition-transform duration-300 hover:scale-[1.02] hover:shadow-lg"
                  onClick={() => openLightbox(index)}
                >
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    className="w-full h-64 object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {selectedPhoto !== null && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white hover:text-accent"
            aria-label="Close lightbox"
          >
            <X className="w-8 h-8" />
          </button>

          <button
            onClick={() => navigatePhoto('prev')}
            className="absolute left-4 text-white hover:text-accent"
            aria-label="Previous photo"
          >
            <ChevronLeft className="w-10 h-10" />
          </button>

          <img
            src={photos[selectedPhoto].src}
            alt={photos[selectedPhoto].alt}
            className="max-h-[80vh] max-w-[90vw] object-contain"
          />

          <button
            onClick={() => navigatePhoto('next')}
            className="absolute right-4 text-white hover:text-accent"
            aria-label="Next photo"
          >
            <ChevronRight className="w-10 h-10" />
          </button>
        </div>
      )}
    </>
  );
};

export default GallerySection;
