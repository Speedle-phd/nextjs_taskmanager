"use client"

import { useState, useEffect } from 'react';
import { throttle } from '../../../lib/throttle_debounce';

const useResize = () => {
   //ignore reference error
   // eslint-disable-next-line @typescript-eslint/ban-ts-comment
   // @ts-ignore
   const [width, setWidth] = useState<number>(0)

   useEffect(() => {
      // Set initial width
      setWidth(window?.innerWidth || 0);
   }, []);

   useEffect(() => {
      const handleResize = throttle(() => setWidth(window?.innerWidth), 1000);
      window?.addEventListener('resize', handleResize);
      return () => window?.removeEventListener('resize', handleResize);
   }, []);

   return width;
};

export default useResize;