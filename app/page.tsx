"use client";

import dynamic from "next/dynamic";
import Countdown from "@/components/Countdown";
import ScrollIndicator from "@/components/ScrollIndicator";
import MessagePanel from "@/components/MessagePanel";
import ErrorBoundary from "@/components/ErrorBoundary";

const DepthPhotoComponent = dynamic(() => import("@/components/DepthPhoto"), {
  ssr: false,
});

function DepthPhotoFallback() {
  return (
    <div className="w-full h-screen bg-black flex items-center justify-center">
      <img
        src="/images/monet.jpg"
        alt="Fondo"
        className="w-full h-full object-cover"
      />
    </div>
  );
}

export default function Home() {
  return (
    <main className="relative w-full">
      <div className="fixed inset-0 w-full h-screen z-0">
        <ErrorBoundary fallback={<DepthPhotoFallback />}>
          <DepthPhotoComponent />
        </ErrorBoundary>
      </div>

      <div className="relative z-10 pointer-events-none">

        <section className="relative h-screen w-full flex items-center justify-center">
          <Countdown />
          <ScrollIndicator />
        </section>

        <div className="pointer-events-auto">
          <MessagePanel />
        </div>
      </div>
    </main>
  );
}
