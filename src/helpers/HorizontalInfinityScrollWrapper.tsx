import React, { useEffect, useRef, useState } from 'react';

interface InfinityScrollWrapperProps {
  children: React.ReactNode;
  nextPage: number;
  onLoad: () => void;
  containerClassName?: string;
  additionConditions?: boolean;
}

export const HorizontalInfinityScrollWrapper = ({
  children,
  nextPage,
  onLoad,
  containerClassName = '',
  additionConditions = true,
}: InfinityScrollWrapperProps) => {
  const observerTarget = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!observerTarget.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && additionConditions) {
          onLoad();
        }
      },
      { threshold: 0.1, rootMargin: '20px' },
    );

    observer.observe(observerTarget.current);

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [nextPage, additionConditions, onLoad]);

  return (
    <div className={`w-full flex ${containerClassName}`}>
      {children}
      <div ref={observerTarget}></div>
    </div>
  );
};
