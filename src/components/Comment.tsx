import React, { useEffect, useRef } from 'react';

const Comment: React.FC = () => {
  const commentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!commentRef.current) return;

    // 이미 script가 삽입되어 있다면 skip
    if (commentRef.current.childElementCount > 0) return;

    const script = document.createElement('script');
    script.src = 'https://utteranc.es/client.js';
    script.setAttribute('repo', 'serandev/seran-sjune-comment');
    script.setAttribute('issue-term', 'pathname');
    script.setAttribute('label', 'Comment');
    script.setAttribute('theme', 'github-light');
    script.setAttribute('crossorigin', 'anonymous');
    script.async = true;

    commentRef.current.appendChild(script);
  }, []);

  return (
      <section className="p-6 mt-16 max-w-2xl mx-auto">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-orbit text-3xl md:text-4xl text-primary mb-12">
            축하 인삿말 전하기
          </h2>
        </div>

        <div ref={commentRef} />
      </section>
  );
};

export default Comment;
