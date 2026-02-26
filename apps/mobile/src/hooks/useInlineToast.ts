import React from 'react';

export const useInlineToast = (durationMs = 2500) => {
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const showToast = (message: string) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    setToastMessage(message);
    timerRef.current = setTimeout(() => {
      setToastMessage(null);
      timerRef.current = null;
    }, durationMs);
  };

  const clearToast = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setToastMessage(null);
  };

  return {
    toastMessage,
    showToast,
    clearToast,
  };
};