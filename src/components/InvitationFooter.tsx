import React from 'react';
import { Heart } from 'lucide-react';

const InvitationFooter: React.FC = () => {
  return (
    <footer className="py-12 bg-primary/10">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex justify-center items-center gap-2 mb-6">
            <Heart className="text-accent w-5 h-5" fill="currentColor" />
            <h3 className="font-himelody text-xl text-primary">염세란 & 김선준</h3>
            <Heart className="text-accent w-5 h-5" fill="currentColor" />
          </div>

          <p className="text-secondary mb-4">2025년 9월 20일 • 서울 수서</p>
          <div className="text-sm text-secondary/70">
            <p>© 2025 김선준 & 염세란 결혼</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default InvitationFooter;
