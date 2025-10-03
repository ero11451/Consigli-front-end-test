import { useControls } from "react-zoom-pan-pinch";
import type { ControlsProps } from "../interfaces/IZoom";

export const Controls: React.FC<ControlsProps> = ({ mode, setMode }) => {
  const { zoomIn, zoomOut, resetTransform } = useControls();

  return (
    <div className="tools mb-2">
      <label className="block text-xs text-slate-400">Zoom</label>

      <div className="flex items-center gap-2">
        <button onClick={() => zoomIn()} className="w-10 h-10 rounded bg-slate-100 border">+</button>
        <button onClick={() => zoomOut()} className="w-10 h-10 rounded bg-slate-100 border">-</button>
        <button onClick={() => resetTransform()} className="w-10 h-10 rounded bg-slate-100 border">x</button>

        <button onClick={() => setMode(!mode)} className={`py-2 px-3 rounded text-sm border ${mode ? "bg-red-300" : "bg-slate-100"}`}>
          {mode ? "Pinned" : "Pin"}
        </button>
      </div>
    </div>
  );
};