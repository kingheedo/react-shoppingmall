import React from 'react';

const useIntersectionObserver = ({
  root,
  target,
  onInterSect,
  threshold = 0.5,
  rootMargin = '0px',
  enabled = true,
}: any) => {
  React.useEffect(() => {
    console.log('target',target);
    console.log('enabled',enabled);
    
    if (!enabled) {
      return;
    }

    const observer = new IntersectionObserver(
      entries =>
        entries.forEach(entry => {
          return entry.isIntersecting && onInterSect();
        }),
      {
        root: root && root.current,
        rootMargin,
        threshold,
      }
    );

    const el = target && target.current;

    if (!el) {
      return;
    }

    observer.observe(el);

    return () => {
      observer.unobserve(el);
    };
  }, [target, enabled]);
};

export default useIntersectionObserver;