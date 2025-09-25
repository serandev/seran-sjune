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
      <section ref={sectionRef} className="pt-5 pb-10 bg-background opacity-0">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="font-orbit text-3xl md:text-4xl text-primary mb-12 text-center">
              장소
            </h2>

            <div className="text-center">
              <div className="bg-secondary/5 pt-10 p-6 rounded-lg shadow-md inline-block">
                <h3 className="font-orbit text-xl text-primary mb-4">
                  필경재 이호당
                </h3>
                <div className="flex items-center justify-center mb-4">
                  <MapPin className="text-accent mr-3"/>
                  <p className="text-lg text-secondary font-orbit">
                    서울 강남구 광평로 205
                  </p>
                </div>
              </div>

              <div className="mt-10 mx-auto max-w-lg">
                <p className="font-orbit text-lg text-gray-800 dark:text-gray-300 leading-relaxed mb-6">
                  가족과 함께하는 소중한 자리로<br />
                  조용한 공간에서 결혼식을 올립니다.
                </p>

                <div className="bg-secondary/10 p-6 rounded-lg">
                  <p className="font-orbit text-base text-gray-700 dark:text-gray-400 leading-relaxed">
                    많은 분들을 초대하지 못하는 점<br />
                    깊이 양해 부탁드립니다.<br /><br />
                    멀리서라도 마음으로 축하해 주신다면<br />
                    더없는 기쁨이 될 것입니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
  );
};

export default LocationSection;