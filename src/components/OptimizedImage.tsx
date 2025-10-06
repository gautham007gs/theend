"use client";

import Image from 'next/image';
import { useState } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
  fill?: boolean;
  sizes?: string;
  quality?: number;
  onError?: () => void;
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  className = '',
  fill = false,
  sizes,
  quality = 75,
  onError
}: OptimizedImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = () => {
    setImgSrc('/fallback-avatar.png');
    onError?.();
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  const imageProps = fill
    ? {
        fill: true,
        sizes: sizes || '(max-width: 768px) 100vw, 50vw',
      }
    : {
        width: width || 400,
        height: height || 400,
      };

  return (
    <Image
      src={imgSrc}
      alt={alt}
      {...imageProps}
      priority={priority}
      quality={quality}
      className={`${className} ${isLoading ? 'blur-sm' : 'blur-0'} transition-all duration-300`}
      onError={handleError}
      onLoad={handleLoad}
      loading={priority ? 'eager' : 'lazy'}
      placeholder="blur"
      blurDataURL="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'%3E%3Cfilter id='b' color-interpolation-filters='sRGB'%3E%3CfeGaussianBlur stdDeviation='20'/%3E%3C/filter%3E%3Cimage width='100%25' height='100%25' filter='url(%23b)' href='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=='/%3E%3C/svg%3E"
      style={{
        objectFit: 'cover',
        aspectRatio: width && height ? `${width}/${height}` : undefined,
      }}
    />
  );
}
