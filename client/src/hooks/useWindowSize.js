import { useState, useEffect } from 'react';

const useWindowSize = (breakpoint) => {
  const [isSmallWindow, setIsSmallWindow] = useState(window.innerWidth < breakpoint);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallWindow(window.innerWidth < breakpoint);
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoint]);

  return isSmallWindow;
};

export default useWindowSize;