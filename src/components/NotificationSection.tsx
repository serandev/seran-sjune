import React, { useEffect, useRef } from 'react';

const NotificationSection: React.FC = () => {
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
        <section ref={sectionRef} className="pt-20 pb-5 bg-accent/5 opacity-0">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="font-serif text-3xl md:text-4xl text-primary mb-8">
                        {/* notification  */}
                    </h2>

                    <div className="bg-background rounded-lg shadow-lg p-8 md:p-12 relative">
                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                            <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-10 w-10 text-white"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                        </div>

                        <div className="font-gowundodum text-secondary/90 mb-14 text-lg md:text-xl italic mt-4">
                            <p>저희 두 사람의 뜻에 따라</p>
                            <p>양가 가족만 모시고</p>
                            <p className="mb-6">간소하게 식을 올리게 되었습니다.</p>
                            <p>많은 분들을 초대하지 못하는 점</p>
                            <p className="mb-6">깊은 양해를 구합니다.</p>
                        </div>
                        <p className="font-gowundodum text-secondary/90 mb-14 text-lg md:text-xl mt-4">
                            <div className="flex flex-wrap justify-center mb-1">
                                <p>멀리서라도 저희의 새로운 출발을</p>&nbsp;<p>마음속으로 축하해 주신다면,</p>
                            </div>
                            <div className="flex flex-wrap justify-center">
                                <p>그 소중한 마음</p>&nbsp;<p>오래 감사하며 간직하겠습니다.</p>
                            </div>
                        </p>

                        <div className="mt-8 text-primary font-orbit text-xl">
                            <div className="mt-2 text-xl">
                                <p className="items-center w-full">
                                    <span className="relative bottom-[0.3em] text-sm">(故)</span>
                                    <span className="text-2xl">김치문·한정</span><span className="text-base">의 장남 </span><span
                                    className="text-2xl">김선준</span>
                                </p>
                            </div>
                            <div className="mt-2 text-xl">
                                <p className="pl-1.5">
                                    <span className="text-2xl">염성권·신영숙</span><span className="text-base">의 장녀 </span><span
                                    className="text-2xl">염세란</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default NotificationSection;
