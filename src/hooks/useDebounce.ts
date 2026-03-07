import { useEffect, useState } from "react";

const useDebounce = <T>(value: T, delay = 300): T => {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(timer);
  }, [value, delay]);

  return debounced;
};

export default useDebounce;

