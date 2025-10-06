
import { useRef, useState } from "react";
import { Toolbar, ZoomProvider, CeilingGrid } from "../component";
import { type ITool, tools } from "../data/toolList";
import type { CeilingGridHandle } from "../interfaces/IGrid";


export default function HomePage() {
  // const [selected, setSelected] = useState<ITool | null>("Light");
  const gridRef = useRef<CeilingGridHandle>(null);

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-slate-800 p-6">

      <div className="max-w-7xl mx-auto bg-white shadow rounded-lg overflow-hidden">
        <div className="flex flex-wrap">
          {/* Sidebar */}
          <aside className="w-72 p-6 border-r border-slate-100">
            <h2 className="text-lg font-semibold text-slate-700">Ceiling Grid Editor </h2>

            <div className="mt-6">
              <div className="mt-2 ">
                <Toolbar />
                <button
                  onClick={() => gridRef.current?.clearAll()}
                  className="py-2 px-3 mt-3 bg-red-50 text-red-700 rounded border"
                >
                  Clear All
                </button>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-xs uppercase text-slate-400">Legend</label>
              <div className="mt-2 space-y-2">
                {tools.map((tool) => (<div key={tool.label + tool.color} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded flex items-center justify-center text-sm font-semibold ${tool.color}`}>{tool.label[0]}</div>
                  <div className="text-sm text-slate-700">{tool.label}</div>
                </div>))}
              </div>
            </div>

            {/* <select name="" id="">
              <option value=""></option>
            </select> */}
          </aside>

          {/* Main preview area */}
          <main className="flex-1 p-6 ">
            <ZoomProvider >
              <div className="p-10 bg-gray-50 " style={{ width: "100%", height: "100%" , backgroundColor:""}}>
                <CeilingGrid width={12} height={8} tileSize={50} ref={gridRef} />
              </div>
            </ZoomProvider>
          </main>
        </div>
      </div>
    </div>
  );
}