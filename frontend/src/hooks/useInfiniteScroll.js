import { useEffect, useRef, useCallback } from "react";

/**
 * useInfiniteScroll
 * Calls `onIntersect` when the sentinel element enters the viewport.
 * Attach `sentinelRef` to a div at the bottom of your list.
 */
export default function useInfiniteScroll(onIntersect, hasNextPage) {
  const observer = useRef(null);
  const sentinelRef = useRef(null);

  const callback = useCallback(
    (entries) => {
      if (entries[0].isIntersecting && hasNextPage) {
        onIntersect();
      }
    },
    [onIntersect, hasNextPage]
  );

  useEffect(() => {
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(callback, {
      root: null,      // viewport
      rootMargin: "0px",
      threshold: 0.1,  // trigger when 10% visible
    });

    if (sentinelRef.current) observer.current.observe(sentinelRef.current);

    // Cleanup on unmount
    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, [callback]);

  return sentinelRef;
}