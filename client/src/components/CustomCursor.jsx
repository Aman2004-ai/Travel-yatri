import { useEffect, useState } from "react";

function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [hovered, setHovered] = useState(false);
  const [hidden, setHidden] = useState(true);
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    // Check if the device has a fine pointer (mouse)
    const mediaQuery = window.matchMedia("(pointer: fine)");
    setIsMobile(!mediaQuery.matches);

    const handleMediaChange = (e) => {
      setIsMobile(!e.matches);
    };
    mediaQuery.addEventListener("change", handleMediaChange);

    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setHidden(false);
    };

    const handleMouseLeave = () => {
      setHidden(true);
    };

    const handleMouseEnter = () => {
      setHidden(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    // Dynamic hover bindings for interactive items
    const updateHoverState = () => {
      const interactives = document.querySelectorAll(
        "a, button, select, input, [role='button'], .cursor-pointer, input[type='checkbox']"
      );
      
      const setHoverTrue = () => setHovered(true);
      const setHoverFalse = () => setHovered(false);

      interactives.forEach((el) => {
        el.addEventListener("mouseenter", setHoverTrue);
        el.addEventListener("mouseleave", setHoverFalse);
      });

      return () => {
        interactives.forEach((el) => {
          el.removeEventListener("mouseenter", setHoverTrue);
          el.removeEventListener("mouseleave", setHoverFalse);
        });
      };
    };

    let cleanupHovers = updateHoverState();

    const observer = new MutationObserver(() => {
      cleanupHovers();
      cleanupHovers = updateHoverState();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      mediaQuery.removeEventListener("change", handleMediaChange);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      cleanupHovers();
      observer.disconnect();
    };
  }, []);

  if (isMobile || hidden) return null;

  return (
    <>
      {/* Central micro dot */}
      <div
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-amber-500 rounded-full pointer-events-none z-[99999] transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-75"
        style={{ left: `${position.x}px`, top: `${position.y}px` }}
      />
      {/* Outer lag ring */}
      <div
        className={`fixed top-0 left-0 rounded-full pointer-events-none z-[99998] transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-out border ${
          hovered
            ? "w-14 h-14 bg-amber-500/10 border-amber-400 scale-110"
            : "w-6 h-6 bg-transparent border-teal-500/40"
        }`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
      />
    </>
  );
}

export default CustomCursor;
