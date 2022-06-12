import { useEffect, useRef, useState } from 'react';

const getTheme = () => {
  if (typeof window !== 'undefined') {
    return window.document.documentElement.classList.value;
  }
  return '';
};

export const useTheme = () => {
  const [theme, setTheme] = useState(getTheme());
  const ref = useRef(false);

  useEffect(() => {
    if (ref.current) {
      const root = window.document.documentElement;
      root.classList.remove(theme === 'dark' ? 'light' : 'dark');
      root.classList.add(theme);
      window.localStorage.setItem('theme', theme);
    } else {
      ref.current = true;
    }
  }, [theme]);

  return { theme, setTheme };
};
