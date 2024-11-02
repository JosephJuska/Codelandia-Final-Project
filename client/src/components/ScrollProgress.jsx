import { useState, useEffect } from 'react';

const ScrollProgress = () => {
  const [scrollPercent, setScrollPercent] = useState(0);
  const [visible, setVisible] = useState(false); // Initially hidden
  const [scrollTimeout, setScrollTimeout] = useState(null);

  const handleScrollClick = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleScroll = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (scrollTop / docHeight) * 100;
    setScrollPercent(scrolled);

    if (scrollTop > 300) {
      setVisible(true);
    } else {
      setVisible(false);
    }

    if (scrollTimeout) {
      clearTimeout(scrollTimeout);
    }

    const newTimeout = setTimeout(() => {
      setVisible(false);
    }, 2000);

    setScrollTimeout(newTimeout);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [scrollTimeout]);

  const containerStyle = {
    position: 'fixed',
    bottom: '50%',
    right: 20,
    width: '20px',
    height: '100px',
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    zIndex: 999,
    boxShadow: '2px 8px 12px rgba(0, 0, 0, 0.1)',
    opacity: visible ? 1 : 0,
    transition: 'opacity 0.3s ease-in-out',
    cursor: 'pointer',
  };

  const lineStyle = {
    position: 'absolute',
    top: '10%',
    left: '50%',
    width: '2px',
    height: '80%',
    backgroundColor: '#007bff',
    transform: 'translateX(-50%)',
  };

  const ballStyle = {
    position: 'absolute',
    top: `${scrollPercent}%`,
    left: '50%',
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#007bff',
    transform: 'translate(-50%, -50%)',
  };

  return (
    <div style={containerStyle} onClick={handleScrollClick}>
      <div style={lineStyle}>
        <div style={ballStyle} />
      </div>
    </div>
  );
};

export default ScrollProgress;