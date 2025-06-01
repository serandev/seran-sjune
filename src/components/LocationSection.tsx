import React, { useEffect, useRef } from 'react';
import { MapPin } from 'lucide-react';

const LocationSection: React.FC = () => {
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

  return (
    <section ref={sectionRef} className="py-20 bg-background opacity-0">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-himelody text-3xl md:text-4xl text-primary mb-12 text-center">
            장소
          </h2>

          <div className="text-center">
            <div className="bg-secondary/5 p-8 rounded-lg shadow-md inline-block">
              <h3 className="font-himelody text-2xl text-primary mb-4">
                Private Venue
              </h3>
              <div className="flex items-center justify-center mb-4">
                <MapPin className="text-accent mr-3" />
                <p className="text-secondary">서울 수서</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationSection;
