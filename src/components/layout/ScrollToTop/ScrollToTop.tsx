import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top when pathname changes
    try {
      if (typeof window !== "undefined" && window.scrollTo) {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: "smooth", // Optional: adds smooth scrolling animation
        });
      }
    } catch {
      // Fallback for browsers that don't support smooth scrolling
      // or when scrollTo fails for any reason
      try {
        if (typeof window !== "undefined" && window.scrollTo) {
          window.scrollTo(0, 0);
        }
      } catch (fallbackError) {
        // If all scroll methods fail, silently continue
        // This prevents the app from crashing due to scroll issues
        console.error("Failed to scroll to top:", fallbackError);
      }
    }
  }, [pathname]);

  // This component doesn't render anything
  return null;
};

export default ScrollToTop;
