import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
    src: string;
    alt: string;
    className?: string;
    width?: number;
    height?: number;
    priority?: boolean; // Skip lazy loading for above-fold images
}

export function OptimizedImage({
    src,
    alt,
    className,
    width,
    height,
    priority = false,
}: OptimizedImageProps) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isInView, setIsInView] = useState(priority); // If priority, load immediately
    const [error, setError] = useState(false);
    const imgRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        if (priority) return; // Skip intersection observer for priority images

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsInView(true);
                        observer.disconnect();
                    }
                });
            },
            {
                rootMargin: '50px', // Start loading 50px before image enters viewport
            }
        );

        if (imgRef.current) {
            observer.observe(imgRef.current);
        }

        return () => {
            observer.disconnect();
        };
    }, [priority]);

    return (
        <div
            ref={imgRef}
            className={cn('relative overflow-hidden bg-transparent', className)}
            style={{ width, height }}
        >
            {/* Blur placeholder - shown while loading */}
            {!isLoaded && (
                <div className="absolute inset-0 bg-gradient-to-br from-muted to-muted/50 animate-pulse" />
            )}

            {/* Actual image - only load when in view */}
            {isInView && (
                <img
                    src={src}
                    alt={alt}
                    width={width}
                    height={height}
                    loading={priority ? 'eager' : 'lazy'}
                    onLoad={() => setIsLoaded(true)}
                    onError={() => {
                        setError(true);
                        setIsLoaded(true); // Still set loaded to remove placeholder
                    }}
                    className={cn(
                        'w-full h-full object-contain transition-opacity duration-500',
                        isLoaded ? 'opacity-100' : 'opacity-0',
                        error && 'object-contain bg-muted'
                    )}
                />
            )}

            {/* Error state */}
            {error && (
                <div className="absolute inset-0 flex items-center justify-center bg-muted text-muted-foreground text-xs">
                    <span>Gambar tidak tersedia</span>
                </div>
            )}
        </div>
    );
}
