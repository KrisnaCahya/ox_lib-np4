import { useState } from "react";

import { useEventListener, useIsomorphicLayoutEffect } from "usehooks-ts";

function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
    ratioWidth: window.innerWidth / 1920,
    ratioHeight: window.innerWidth / 1.778 / 1080,
  });

  const handleSize = () => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
      ratioWidth: window.innerWidth / 1920,
      ratioHeight: window.innerWidth / 1.778 / 1080,
    });
  };

  useEventListener("resize", handleSize);

  // Set size at the first client-side load
  useIsomorphicLayoutEffect(() => {
    handleSize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return windowSize;
}

export default useWindowSize;