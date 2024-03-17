import { useCallback, useRef } from 'react';
import debounce from 'lodash.debounce';

const useDebouncedCallback = (callback: (...args: any[]) => void, delay: number) => {
  const debouncedCallback = useRef(debounce(callback, delay)).current;

  const debounced = useCallback(
    (...args: any[]) => {
      debouncedCallback(...args);
    },
    [debouncedCallback]
  );

  return debounced;
};

export default useDebouncedCallback;
