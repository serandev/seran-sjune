import React, { useEffect, useState } from "react";

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
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor(
          (distance % (1000 * 60 * 60)) / (1000 * 60)
      );
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  // 가장 큰 단위부터 0이면 숨기기
  const units = [
    { key: "days", label: "일", value: timeLeft.days },
    { key: "hours", label: "시간", value: timeLeft.hours },
    { key: "minutes", label: "분", value: timeLeft.minutes },
    { key: "seconds", label: "초", value: timeLeft.seconds },
  ];

  // 처음으로 0이 아닌 단위의 인덱스 찾기 (전부 0이면 -1)
  const firstNonZeroIndex = units.findIndex((u) => u.value > 0);

  // 전부 0이면 "초"만 보여주고, 아니면 처음 0이 아닌 단위부터 끝까지 표시
  const visibleUnits =
      firstNonZeroIndex === -1 ? [units[units.length - 1]] : units.slice(firstNonZeroIndex);

  // Tailwind grid-cols-* 동적 매핑
  const colClassMap: Record<number, string> = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
  };
  const gridColsClass = colClassMap[visibleUnits.length] ?? "grid-cols-4";

  return (
      <div>
        <h3 className="font-orbit text-xl text-primary mb-8">결혼식까지 남은 시간</h3>

        <div className={`grid ${gridColsClass} gap-3 max-w-sm mx-auto`}>
          {visibleUnits.map((unit) => (
              <div
                  key={unit.key}
                  className="bg-background rounded-lg shadow-md p-4 text-center"
              >
                <div className="text-2xl md:text-3xl font-bold text-accent mb-1">
                  {unit.value}
                </div>
                <p className="font-orbit text-sm text-secondary/70 uppercase tracking-wider">
                  {unit.label}
                </p>
              </div>
          ))}
        </div>
      </div>
  );
};

export default CountdownSection;
