import React, { useEffect, useRef } from 'react';

const CoupleSection: React.FC = () => {
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
      <section
          ref={sectionRef}
          className="relative max-w-[900px] mx-auto aspect-[9/16] opacity-0 bg-cover bg-center bg-fixed"
          style={{
            backgroundImage:
                "url('https://serandev.github.io/serena-invitation/20250424_SR_SJ_0.jpg')",
            backgroundPosition: 'center 20%',
          }}
      >
        <div className="absolute inset-0 flex items-start justify-center pt-16">
          <div className="container mx-auto px-4 py-2 bg-background/70 backdrop-blur-sm">
            <div className="max-w-3xl mx-auto text-center">
              <h1
                  className="font-himelody text-5xl pt-20 md:text-7xl text-gray-200 mb-8"
                  style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.9)' }}
              >
                저희 결혼합니다
              </h1>
              <p
                  className="text-2xl font-himelody md:text-3xl text-gray-200"
                  style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.9)' }}
              >
                <strong>
                  9월 20일 토요일
                  <br />
                  서울, 수서
                </strong>
              </p>
            </div>
          </div>
        </div>
      </section>
  );
};

export default CoupleSection;
