import { useCallback, useEffect, useRef } from 'react';
import debounce from 'lodash.debounce';

const useDebouncedCallback = <T extends (...args: any[]) => void>(
  callback: T,
  delay: number,
  deps: any[]
): ((...args: Parameters<T>) => void) => {
  const debouncedCallback = useRef(debounce(callback, delay));
  const isDebouncing = useRef(false);

  useEffect(() => {
    return () => {
      debouncedCallback.current.cancel(); // 组件卸载时取消防抖回调函数
    };
  }, []);

  useEffect(() => {
    if (isDebouncing.current) {
      debouncedCallback.current.cancel(); // 取消上一个防抖回调函数
      isDebouncing.current = false; // 重置防抖状态
    }
    debouncedCallback.current = debounce(callback, delay); // 重新创建防抖函数
  }, deps);

  return useCallback(
    (...args: Parameters<T>) => {
      if (isDebouncing.current) {
        debouncedCallback.current.cancel(); // 取消上一个防抖回调函数
      }
      isDebouncing.current = true; // 设置防抖状态
      debouncedCallback.current(...args);
    },
    []
  );
};

export default useDebouncedCallback;
