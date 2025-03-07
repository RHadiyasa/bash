import { useEffect } from "react";
import { GlobeScene } from "@/assets/globeScene";

const useGlobe = (canvasRef) => {
  useEffect(() => {
    const { init, dispose } = GlobeScene(canvasRef.current);
    init();

    return () => dispose();
  }, [canvasRef]);
};

export default useGlobe;
