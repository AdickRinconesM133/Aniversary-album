'use client';

import dynamic from "next/dynamic";
import Countdown from "@/components/Countdown";
import ScrollIndicator from "@/components/ScrollIndicator";

const DepthPhotoComponent = dynamic(() => import("@/components/DepthPhoto"), {
  ssr: false,
});

export default function Home() {
  return (
    <main className="relative w-full h-full overflow-hidden">
      <DepthPhotoComponent />
      <Countdown />
      <ScrollIndicator />
    </main>
  );
}
