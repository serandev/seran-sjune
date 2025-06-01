import React, { useState, useEffect, useRef } from 'react';

interface CountdownSectionProps {
  weddingDate: string;
}

const CountdownSection: React.FC<CountdownSectionProps> = ({ weddingDate }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
  });

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

  useEffect(() => {
    const targetDate = new Date(weddingDate).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(interval);
        setTimeLeft({
          days: 0,
          hours: 0,
        });
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        ),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [weddingDate]);

  return (
    <section ref={sectionRef} className="py-5 bg-accent/5 opacity-0">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-himelody text-3xl md:text-4xl text-primary mb-16">
            결혼식까지 남은 시간
          </h2>

          <div className="grid grid-cols-2 gap-8">
            <div className="bg-background rounded-lg shadow-md p-6">
              <div className="text-4xl md:text-5xl font-himelody text-accent mb-2">
                {timeLeft.days}
              </div>
              <p className="text-secondary uppercase text-sm tracking-wider">
                일
              </p>
            </div>

            <div className="bg-background rounded-lg shadow-md p-6">
              <div className="text-4xl md:text-5xl font-himelody text-accent mb-2">
                {timeLeft.hours}
              </div>
              <p className="text-secondary uppercase text-sm tracking-wider">
                시간
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CountdownSection;
