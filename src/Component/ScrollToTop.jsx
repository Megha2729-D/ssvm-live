import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
    const { pathname } = useLocation();
    const prevPath = useRef(pathname);

    useEffect(() => {
        // Only scroll when a *new* route is loaded and not on home page
        if (pathname !== "/" && pathname !== prevPath.current) {
            // Use a small timeout to wait until the new page mounts
            const timeout = setTimeout(() => {
                window.scrollTo({ top: 0, behavior: "instant" });
            }, 0);

            return () => clearTimeout(timeout);
        }

        prevPath.current = pathname;
    }, [pathname]);

    return null;
};

export default ScrollToTop;
