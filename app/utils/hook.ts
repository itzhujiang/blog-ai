import { useCallback, useRef, useState } from 'react';

/**
 * 验证码倒计时
 */
export function useCountdown() {
  const [countdown, setCountdown] = useState(0);
  const [isSending, setIsSending] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  
  const clear = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
      setIsSending(false);
      setCountdown(0);
    }
  }, []);

  const start = useCallback((seconds: number) => {
    clear();
    setCountdown(seconds);
    setIsSending(true);
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clear();
          setIsSending(false);
        }
        return prev - 1;
      });
    }, 1000);
  }, [clear]);
  return [countdown, isSending, start, clear] as const;
}
