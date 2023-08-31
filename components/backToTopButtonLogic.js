
import { useEffect, useState } from "react";

const useBackToTopButton = () => {
  const [showBackToTopButton, setShowBackToTopButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowBackToTopButton(true);
      } else {
        setShowBackToTopButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return { showBackToTopButton, scrollToTop };
};

export default useBackToTopButton;
