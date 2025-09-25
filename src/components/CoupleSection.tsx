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
          className="relative max-w-[900px] mx-auto aspect-[9/17] opacity-0 bg-cover bg-center bg-fixed"
          style={{
            backgroundImage:
                "url('https://serandev.github.io/serena-invitation/seran-sjune.jpg')",
            backgroundPosition: 'center 20%',
          }}
      >
        <div className="absolute inset-0 flex items-start justify-center pt-0 sm:pt-10 md:pt-20">
          <div className="container mx-auto px-auto py-2 sm:py-10 md:py-10 bg-background/70 backdrop-blur-sm">
            <div className="max-w-3xl mx-auto text-center">
              <h1
                  className="font-orbit text-4xl pt-20 sm:text-6xl sm:mb-6 md:text-7xl text-gray-200 mb-4 md:mb-8"
                  style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.9)' }}
              >
                저희 결혼합니다
              </h1>
              <p
                  className="text-xl font-orbit md:text-3xl text-gray-200"
                  style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.9)' }}
              >
                <strong>
                  9월 20일 토요일
                  <br />
                  낮 12시
                  <br />
                  서울 강남구 광평로 205, 필경재 이호당
                </strong>
              </p>
            </div>
          </div>
        </div>
      </section>
  );
};

export default CoupleSection;
