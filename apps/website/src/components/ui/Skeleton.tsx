"use client";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded-md bg-gray-200 ${className}`}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-white rounded-[32px] overflow-hidden shadow-lg border border-gray-100/50 p-0">
      <Skeleton className="h-64 w-full rounded-none" />
      <div className="p-8 space-y-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-6 w-full" />
        <div className="pt-4 border-t border-gray-100 space-y-3">
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <Skeleton className="h-3 w-12" />
              <Skeleton className="h-5 w-20" />
            </div>
            <Skeleton className="h-8 w-24 rounded-full" />
          </div>
          <Skeleton className="h-12 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

export function BlogCardSkeleton() {
  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100/50 flex flex-col h-full">
      <Skeleton className="h-60 w-full" />
      <div className="p-8 space-y-4 flex-grow">
        <div className="flex gap-4">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-20" />
        </div>
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="pt-4">
          <Skeleton className="h-10 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

export function GallerySkeleton() {
  return (
    <div className="relative rounded-3xl overflow-hidden shadow-xl border border-gray-100 break-inside-avoid">
      <Skeleton className="w-full aspect-[4/3]" />
    </div>
  );
}

import { useState } from "react";

export function ImageWithSkeleton({ src, alt, className, containerClassName }: { src: string; alt: string; className?: string; containerClassName?: string }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden ${containerClassName}`}>
      {!loaded && <Skeleton className={`absolute inset-0 z-10 ${className}`} />}
      <img
        src={src}
        alt={alt}
        className={`${className} ${loaded ? "opacity-100" : "opacity-0"} transition-opacity duration-500`}
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}
