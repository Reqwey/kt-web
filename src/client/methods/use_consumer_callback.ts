import { useCallback, useEffect, useRef } from 'react';

type CallbackFunction = (...args: any[]) => void;

function useConsumerCallback(callback: CallbackFunction, delay: number, deps: any[]): CallbackFunction {
  const timerRef = useRef<number | null>(null);
  const callbackQueueRef = useRef<CallbackFunction[]>([]);

  const consumerCallback = useCallback<CallbackFunction>((...args: any[]) => {
    callbackQueueRef.current.push(() => {
      callback(...args);
    });

    if (!timerRef.current) {
      timerRef.current = window.setTimeout(() => {
        const callbackQueue = callbackQueueRef.current;
        callbackQueueRef.current = [];

        callbackQueue.forEach(cb => {
          cb();
        });

        timerRef.current = null;
      }, delay);
    }
  }, [callback, delay, deps]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return consumerCallback;
}

export default useConsumerCallback;
