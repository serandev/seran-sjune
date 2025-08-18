import React, { useEffect, useRef } from 'react';
import CountdownSection from "./CountdownSection.tsx";

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

  const today = new Date();
  const weddingDate = new Date('2025-09-20 12:00:00');

  const todayMonth = today.getMonth();
  const todayYear = today.getFullYear();
  const weddingMonth = weddingDate.getMonth();
  const weddingYear = weddingDate.getFullYear();

  const isSameMonth = todayYear === weddingYear && todayMonth === weddingMonth;

  // 달력 데이터 생성 함수
  const generateCalendarDays = (year: number, month: number) => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfWeek = new Date(year, month, 1).getDay();
    const days = [];

    // 이전 달의 빈 칸들
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null);
    }

    // 현재 달의 날짜들
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  const monthNames = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
  const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

  // 캘린더 렌더링 함수
  const renderCalendar = (year: number, month: number) => {
    const calendarDays = generateCalendarDays(year, month);
    const isWeddingMonth = year === weddingYear && month === weddingMonth;
    const isTodayMonth = year === todayYear && month === todayMonth;

    return (
        <div className="bg-background rounded-lg shadow-md p-4 md:p-6">
          <div className="mb-3 md:mb-4">
            <h3 className="font-orbit text-lg md:text-xl text-primary mb-1 md:mb-2">
              {year}년 {monthNames[month]}
            </h3>
          </div>

          {/* 요일 헤더 */}
          <div className="grid grid-cols-7 gap-1 mb-2 md:mb-3">
            {weekDays.map((day, index) => (
                <div
                    key={day}
                    className={`w-8 h-8 md:w-10 md:h-10 flex items-center justify-center text-xs md:text-sm font-medium ${
                        index === 0 ? 'text-red-500' : index === 6 ? 'text-blue-500' : 'text-secondary/60'
                    }`}
                >
                  {day}
                </div>
            ))}
          </div>

          {/* 날짜 그리드 */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, index) => {
              const isToday = isTodayMonth && day === today.getDate();
              const isWeddingDay = isWeddingMonth && day === 20;

              return (
                  <div
                      key={index}
                      className={`w-8 h-8 md:w-10 md:h-10 flex items-center justify-center text-xs md:text-sm rounded transition-colors duration-200 ${
                          day === null
                              ? '' // 빈 칸
                              : isWeddingDay
                                  ? 'bg-gradient-to-br from-rose-400 to-pink-500 text-white font-bold shadow-md' // 결혼식 날짜
                                  : isToday
                                      ? 'ring-blue-300 text-black font-bold ring-2 ring-blue-300' // 오늘 날짜
                                      : index % 7 === 0
                                          ? 'text-red-400 hover:bg-red-50' // 일요일
                                          : index % 7 === 6
                                              ? 'text-blue-400 hover:bg-blue-50' // 토요일
                                              : 'text-secondary/80 hover:bg-secondary/10' // 평일
                      }`}
                  >
                    {day}
                  </div>
              );
            })}
          </div>
        </div>
    );
  };

  return (
      <section ref={sectionRef} className="py-20 bg-secondary/5 opacity-0">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">

            <h2 className="font-orbit text-3xl md:text-4xl text-primary mb-8">
              날짜
            </h2>

            {/* 심플한 날짜 정보 */}
            <div className="mb-10">
              <p className="text-2xl font-orbit text-primary mb-2">2025년 9월 20일</p>
              <p className="text-lg text-secondary/70 font-orbit">토요일 낮 12시</p>
            </div>

            {/* 캘린더 뷰 */}
            <div className="flex flex-col items-center gap-4">
              {isSameMonth ? (
                  // 같은 달인 경우 하나의 캘린더만 표시
                  <div>
                    {renderCalendar(todayYear, todayMonth)}
                  </div>
              ) : (
                  // 다른 달인 경우 두 개의 캘린더 표시
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-sm md:max-w-2xl">
                    <div>
                      {renderCalendar(todayYear, todayMonth)}
                    </div>
                    <div>
                      {renderCalendar(weddingYear, weddingMonth)}
                    </div>
                  </div>
              )}
            </div>

            {/* 카운트다운 섹션 */}
            <div className="mt-16">
              <CountdownSection targetDate="2025-09-20T12:00:00" />
            </div>
          </div>
        </div>
      </section>
  );
};

export default DateSection;
