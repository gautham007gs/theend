'use client';

import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
  quality?: number;
  sizes?: string;
  fill?: boolean;
  onLoadingComplete?: () => void;
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  className = '',
  quality = 75,
  sizes,
  fill = false,
  onLoadingComplete
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(priority);
  const imgRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (priority || isVisible) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '50px',
        threshold: 0.01,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority, isVisible]);


  const handleLoadingComplete = () => {
    setIsLoading(false);
    onLoadingComplete?.();
  };

  const handleError = () => {
    setIsLoading(false);
    setError(true);
  };

  if (!isMounted) {
    return <div className={`bg-gray-100 animate-pulse ${className}`} style={{ width, height }} />;
  }

  if (error) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`} style={{ width, height }}>
        <span className="text-gray-500 text-sm">Failed to load</span>
      </div>
    );
  }

  const imageProps = fill
    ? {
        fill: true,
        sizes: sizes || '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
      }
    : {
        width: width || 400,
        height: height || 400,
        sizes: sizes || '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px',
      };

  return (
    <div ref={imgRef} className={className}>
      {isVisible ? (
        <Image
          src={src}
          alt={alt}
          {...imageProps}
          priority={priority}
          quality={quality}
          className={`${className} ${isLoading ? 'blur-sm' : 'blur-0'} transition-all duration-300`}
          onError={handleError}
          onLoad={handleLoadingComplete}
          loading={priority ? 'eager' : 'lazy'}
          placeholder="blur"
          blurDataURL="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'%3E%3Cfilter id='b' color-interpolation-filters='sRGB'%3E%3CfeGaussianBlur stdDeviation='20'/%3E%3C/filter%3E%3Cimage width='100%25' height='100%25' filter='url(%23b)' href='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=='/%3E%3C/svg%3E"
          style={{
            objectFit: 'cover',
            aspectRatio: width && height ? `${width}/${height}` : undefined,
          }}
        />
      ) : (
        <div className="bg-muted animate-pulse" style={{ width, height }} />
      )}
    </div>
  );
}