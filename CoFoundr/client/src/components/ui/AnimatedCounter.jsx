import React, { useState, useEffect, useRef } from 'react';

const AnimatedCounter = ({ endValue, suffix = '', duration = 1500 }) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const counterRef = useRef(null);

  const numericEnd = parseInt(endValue.replace(/,/g, ''), 10);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
        }
      },
      { threshold: 0.1 }
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => {
      if (counterRef.current) {
        observer.unobserve(counterRef.current);
      }
    };
  }, [hasAnimated]);

  useEffect(() => {
    if (hasAnimated) {
      let startTime = null;
      const animate = (currentTime) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);
        
        // easeOutQuart
        const easeProgress = 1 - Math.pow(1 - progress, 4);
        
        setCount(Math.floor(easeProgress * numericEnd));
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setCount(numericEnd);
        }
      };
      requestAnimationFrame(animate);
    }
  }, [hasAnimated, numericEnd, duration]);

  const formattedCount = count.toLocaleString();

  return (
    <span ref={counterRef}>
      {formattedCount}{suffix}
    </span>
  );
};

export default AnimatedCounter;
