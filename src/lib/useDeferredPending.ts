import { useEffect, useRef, useState } from "react";

export const useDeferredPending = (state: unknown) => {
  const [pending, setPending] = useState(false);
  const [deferredPending, setDeferredPending] = useState(false);
  const timeoutId = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (pending) {
      if (state === null) {
        timeoutId.current = setTimeout(() => {
          setDeferredPending(true);
        }, 400);
      }

      if (state !== null && timeoutId.current) {
        clearTimeout(timeoutId.current);
        setPending(false);
        setDeferredPending(false);
      }
    }
  }, [state, pending]);

  return { setPending, deferredPending };
};
