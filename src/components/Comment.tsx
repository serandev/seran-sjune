import React, { useEffect, useRef, useState } from 'react';

const Comment: React.FC = () => {
    const commentContainerRef = useRef<HTMLDivElement>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [loadingText, setLoadingText] = useState('로딩중.');

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://utteranc.es/client.js';
        script.setAttribute('repo', 'serandev/seran-sjune-comment');
        script.setAttribute('issue-term', 'pathname');
        script.setAttribute('label', 'Comment');
        script.setAttribute('theme', 'github-light');
        script.setAttribute('crossorigin', 'anonymous');
        script.async = true;

        script.onload = () => {
            setIsLoaded(true);
        };

        const commentEl = document.getElementById('comment');
        if (commentEl && commentEl.childNodes.length === 0) {
            commentEl.appendChild(script);
        }

        // 로딩 텍스트 애니메이션
        const interval = setInterval(() => {
            setLoadingText((prev) =>
                prev === '로딩중.' ? '로딩중..' : prev === '로딩중..' ? '로딩중...' : '로딩중.'
            );
        }, 500);

        return () => clearInterval(interval);
    }, []);

    return (
        <section ref={commentContainerRef} className="p-6 mt-16 max-w-2xl mx-auto">
            <div className="container mx-auto px-4 text-center">
                <h2 className="font-orbit text-3xl md:text-4xl text-primary mb-12">
                    축하 인삿말 전하기
                </h2>
            </div>
            {!isLoaded && (
                <div className="flex justify-center items-center h-24">
                    <p className="text-lg text-gray-500 animate-pulse">{loadingText}</p>
                </div>
            )}
            <div id="comment" />
        </section>
    );
};

export default Comment;