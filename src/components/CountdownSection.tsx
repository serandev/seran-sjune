import React, {useEffect, useState} from "react";

interface CountdownSectionProps {
  targetDate: string;
}

const CountdownSection: React.FC<CountdownSectionProps> = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const targetDateTime = new Date(targetDate).getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = targetDateTime - now;

      if (distance < 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        });
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return (
      <div>
        <h3 className="font-orbit text-xl text-primary mb-8">결혼식까지 남은 시간</h3>

        <div className="grid grid-cols-4 gap-3 max-w-sm mx-auto">
          <div className="bg-background rounded-lg shadow-md p-4 text-center">
            <div className="text-2xl md:text-3xl font-bold text-accent mb-1">
              {timeLeft.days}
            </div>
            <p className="font-orbit text-sm text-secondary/70 uppercase tracking-wider">
              일
            </p>
          </div>

          <div className="bg-background rounded-lg shadow-md p-4 text-center">
            <div className="text-2xl md:text-3xl font-bold text-accent mb-1">
              {timeLeft.hours}
            </div>
            <p className="font-orbit text-sm text-secondary/70 uppercase tracking-wider">
              시간
            </p>
          </div>

          <div className="bg-background rounded-lg shadow-md p-4 text-center">
            <div className="text-2xl md:text-3xl font-bold text-accent mb-1">
              {timeLeft.minutes}
            </div>
            <p className="font-orbit text-sm text-secondary/70 uppercase tracking-wider">
              분
            </p>
          </div>

          <div className="bg-background rounded-lg shadow-md p-4 text-center">
            <div className="text-2xl md:text-3xl font-bold text-accent mb-1">
              {timeLeft.seconds}
            </div>
            <p className="font-orbit text-sm text-secondary/70 uppercase tracking-wider">
              초
            </p>
          </div>
        </div>
      </div>
  );
};

export default CountdownSection;