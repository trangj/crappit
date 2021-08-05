import { useEffect, useState } from 'react';

const useViewport = () => {
    const [width, setWidth] = useState(typeof window === 'undefined' ? 1920 : window.innerWidth);

    useEffect(() => {
        const handleWindowResize = () => setWidth(window.innerWidth);
        window.addEventListener("resize", handleWindowResize);
        return () => window.removeEventListener("resize", handleWindowResize);
    }, []);

    return { width };
};

export default useViewport;
