import { useRef, useEffect } from 'react';

type DebouncedFunction<T extends (...args: unknown[]) => void> = (...args: Parameters<T>) => void;

function useDebounce<T extends (...args: unknown[]) => void>(
   fn: T,
   delay: number
): DebouncedFunction<T> {
   const timeoutRef = useRef<NodeJS.Timeout | null>(null);
   const fnRef = useRef(fn);

   useEffect(() => {
      fnRef.current = fn;
   }, [fn]);

   function debouncedFunction(...args: Parameters<T>) {
      if (timeoutRef.current) {
         clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
         fnRef.current(...args);
      }, delay);
   }

   // Cleanup on unmount
   useEffect(() => {
      return () => {
         if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
         }
      };
   }, []);

   return debouncedFunction;
}

export default useDebounce;