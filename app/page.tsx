'use client';

import dynamic from "next/dynamic";

const DepthPhotoComponent = dynamic(() => import("@/components/DepthPhoto"), {
  ssr: false,
});

export default function Home() {
  return (
    <main className="relative w-full h-full overflow-hidden">
      <DepthPhotoComponent />
    </main>
  );
}
