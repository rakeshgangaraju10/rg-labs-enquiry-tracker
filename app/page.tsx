"use client";

import dynamic from "next/dynamic";

// The tracker reads saved enquiries from localStorage, which only exists in the
// browser. `ssr: false` tells Next.js to render it in the browser only, so the
// server-built HTML never disagrees with what the browser shows.
const EnquiryTracker = dynamic(() => import("@/components/EnquiryTracker"), {
  ssr: false,
});

export default function Home() {
  return <EnquiryTracker />;
}
