import { useEffect, useState } from 'react';

const getTheme = () => {
    if (typeof window !== 'undefined') {
        const theme = window.localStorage.getItem("theme");
        if (theme) return theme;
        const userMedia = window.matchMedia("(prefers-color-scheme: dark)");
        if (userMedia.matches) return "dark";
    }
    return "light";
};

export const useTheme = () => {
    const [theme, setTheme] = useState(getTheme());

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove(theme === "dark" ? "light" : "dark");
        root.classList.add(theme);
        window.localStorage.setItem("theme", theme);
    }, [theme]);

    return { theme, setTheme };
};
