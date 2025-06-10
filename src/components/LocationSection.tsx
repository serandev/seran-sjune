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
          <h2 className="font-orbit text-3xl md:text-4xl text-primary mb-12 text-center">
            장소
          </h2>

          <div className="text-center">
            <div className="bg-secondary/5 p-8 rounded-lg shadow-md inline-block">
              <h3 className="font-himelody text-2xl text-primary mb-4">
                Private Venue
              </h3>
              <div className="flex items-center justify-center mb-4">
                <MapPin className="text-accent mr-3"/>
                <p className="text-lg text-secondary font-orbit">서울 수서</p>
              </div>
            </div>
            <p className="mt-10 mx-10 font-orbit text-m text-gray-800 dark:text-gray-300">
              <div className="flex flex-wrap justify-center mb-1">
                <p>가족과 함께 조용한 공간에서</p>&nbsp;<p>결혼식을 올립니다.</p>
              </div>
              <div className="flex flex-wrap justify-center">
                <p>마음으로 축하해 주신다면</p>&nbsp;<p>큰 기쁨이 될 것입니다.</p>
              </div>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationSection;
