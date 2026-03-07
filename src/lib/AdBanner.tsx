"use client";

import React, { useEffect } from 'react';

// 1. Tell TypeScript that 'adsbygoogle' exists on the window object
declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

// 2. Define the types for your Props
interface AdBannerProps {
  dataAdSlot: string;
  dataAdFormat?: 'auto' | 'fluid' | 'rectangle' | 'vertical' | 'horizontal';
  dataFullWidthResponsive?: boolean;
}

const AdBanner: React.FC<AdBannerProps> = ({ 
  dataAdSlot, 
  dataAdFormat = 'auto', 
  dataFullWidthResponsive = true 
}) => {
  useEffect(() => {
    try {
      // Now TypeScript won't complain about window.adsbygoogle
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error("AdSense error", err);
    }
  }, []);

  return (
    <div style={{ overflow: 'hidden', textAlign: 'center' }}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-8729012662530579"
        data-ad-slot={dataAdSlot}
        data-ad-format={dataAdFormat}
        data-full-width-responsive={dataFullWidthResponsive.toString()}
      ></ins>
    </div>
  );
};

export default AdBanner;