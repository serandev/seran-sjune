import React, { useEffect, useRef } from 'react';
import { Calendar, Clock } from 'lucide-react';

const DateSection: React.FC = () => {
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
    <section ref={sectionRef} className="py-20 bg-secondary/5 opacity-0">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* <h2 className="font-himelody text-3xl md:text-4xl text-primary mb-12"> */}
          <h2 className="font-himelody text-3xl md:text-4xl text-primary mb-12 text-center">
            날짜
          </h2>

          {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-8"> */}
          <div className="text-center">
            {/* <div className="bg-background rounded-lg shadow-md p-8 transform transition-transform duration-300 hover:scale-105"> */}
            <div className="bg-secondary/5 p-8 rounded-lg shadow-md inline-block transform transition-transform duration-300 hover:scale-105">
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-accent" />
              </div>
              {/* <h3 className="font-himelody text-xl text-primary mb-2">일정</h3> */}
              <p className="text-secondary text-lg">2025년 9월 20일</p>
              <p className="text-secondary/80 text-sm">토요일</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DateSection;
