import React, { useEffect, useState } from 'react';
import CoupleSection from '../components/CoupleSection';
import DateSection from '../components/DateSection';
import GallerySection from '../components/GallerySection';
import LocationSection from '../components/LocationSection';
import MessageSection from '../components/MessageSection';
import CountdownSection from '../components/CountdownSection';
import InvitationHeader from '../components/InvitationHeader';
import Money from "../components/Money.tsx";

const InvitationPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="font-himelody text-3xl text-primary animate-pulse">
            염세란 & 김선준
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <InvitationHeader />
      <main>
        <CoupleSection />
        <MessageSection />
        <DateSection />
        <CountdownSection weddingDate="2025-09-20T12:00:00" />
        <LocationSection />
        <GallerySection />
        <Money />
      </main>
      {/* <InvitationFooter /> */}
    </div>
  );
};

export default InvitationPage;
