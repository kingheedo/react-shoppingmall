import React, { useEffect } from "react"

export default function useIntersectionObserver({
  root,
  target,
  onInterSect,
  threshold = 0.5,
  rootMargin = '0px',
  enabled = true,
}: any) {
  React.useEffect(() => {
    if (!enabled) {
      return
    }

    const observer = new IntersectionObserver(
      entries =>
        entries.forEach(entry => entry.isIntersecting && onInterSect()),
      {
        root: root && root.current,
        rootMargin,
        threshold,
      }
    )

    const el = target && target.current

    if (!el) {
      return
    }

    observer.observe(el)

    return () => {
      observer.unobserve(el)
    }
  }, [target, enabled, root, threshold, rootMargin, onInterSect])
}