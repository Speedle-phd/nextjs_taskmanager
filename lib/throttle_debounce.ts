export function throttle<T extends (...args: unknown[]) => void>(
   func: T,
   limit: number
): (...args: Parameters<T>) => void {
   let inThrottle: boolean;
   let lastArgs: unknown[] | null = null;

   return function(this: unknown, ...args: unknown[]) {
      if (!inThrottle) {
         func.apply(this, args);
         inThrottle = true;
         setTimeout(() => {
            inThrottle = false;
            if (lastArgs) {
               func.apply(this, lastArgs);
               lastArgs = null;
            }
         }, limit);
      } else {
         lastArgs = args;
      }
   };
}

export function debounce<T extends (...args: unknown[]) => Promise<void> | void>(
   func: T,
   delay: number
): (...args: Parameters<T>) => void {
   let timeoutId: ReturnType<typeof setTimeout> | undefined;

   return function(this: unknown, ...args: unknown[]) {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
         func.apply(this, args);
      }, delay);
   };
}