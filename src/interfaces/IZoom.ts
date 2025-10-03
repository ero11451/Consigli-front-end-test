import type { ReactNode } from "react";

export type ControlsProps = {
    mode: boolean;
    setMode: (v: boolean) => void;
  };
  
 export  type ZoomProviderProps = {
    children: ReactNode;
    initialScale?: number;
    initialPositionX?: number;
    initialPositionY?: number;
  };