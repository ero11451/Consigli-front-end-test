import { useState,  } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import type { ZoomProviderProps } from "../interfaces/IZoom";
import { ZoomControls } from ".";


export default function ZoomProvider({
  children,
  initialScale = 1,
  initialPositionX = 0,
  initialPositionY = 0,
}: ZoomProviderProps) {
  const [mode, setMode] = useState<boolean>(false);

  return (
    <TransformWrapper
      disabled={mode} // when pinned (true) interactions disabled
      initialScale={initialScale}
      initialPositionX={initialPositionX}
      initialPositionY={initialPositionY}
    >
      {() => (
        <>
          <ZoomControls mode={mode} setMode={setMode} />
          <TransformComponent>
            {children}
          </TransformComponent>
        </>
      )}
    </TransformWrapper>
  );
}
