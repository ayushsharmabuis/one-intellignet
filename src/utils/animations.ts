
import { useCallback, useEffect, useRef } from 'react';

// Types
export type IntersectionOptions = {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
  triggerOnce?: boolean;
};

// Use intersection observer for animations
export const useIntersectionObserver = (
  callback: (entry: IntersectionObserverEntry) => void,
  options: IntersectionOptions = {}
) => {
  const { root = null, rootMargin = '0px', threshold = 0.1, triggerOnce = true } = options;
  
  const targetRef = useRef<Element | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const callbackRef = useRef(callback);

  // Update callback ref when callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Setup observer
  const setTargetRef = useCallback((node: Element | null) => {
    if (targetRef.current && observerRef.current) {
      observerRef.current.unobserve(targetRef.current);
      observerRef.current = null;
    }

    if (node) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            callbackRef.current(entry);
            if (entry.isIntersecting && triggerOnce && targetRef.current) {
              observer.unobserve(targetRef.current);
            }
          });
        },
        { root, rootMargin, threshold }
      );

      observer.observe(node);
      targetRef.current = node;
      observerRef.current = observer;
    }
  }, [root, rootMargin, threshold, triggerOnce]);

  return setTargetRef;
};

// Animation classes for elements that appear on scroll
export const getAnimationClass = (index: number, baseClass: string = 'animate-fade-in'): string => {
  const delay = index * 0.1;
  return `${baseClass} opacity-0 [animation-delay:${delay}s] [animation-fill-mode:forwards]`;
};

// Staggered animation delay calculator
export const getStaggeredDelay = (index: number, baseDelay: number = 0.1): string => {
  const delay = baseDelay * index;
  return `${delay}s`;
};
