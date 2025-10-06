import React from "react";
import { tools, type ITool } from "../data/toolList";



export default function Toolbar() {
    // dragstart: set dataTransfer so the grid can read it on drop
    const handleDragStart = (e: React.DragEvent, label: ITool) => {
        e.dataTransfer.setData("text/plain", label);
        e.dataTransfer.effectAllowed = "copy";
    };

    return (
        <div >
            <label className="block text-xs text-slate-400 my-2">Tools (visual)</label>
            <div className="flex flex-wrap gap-2">
                {tools.map((t) => {
                    return (
                        <button
                            key={t.label}
                            draggable
                            onDragStart={(e) => handleDragStart(e, t.label)}
                            className={`py-2 px-3 rounded text-sm border flex items-center gap-2 ${t.color} `}
                            title={`Drag to drop or click to select ${t.label}`}
                        >
                            {/* <span className="w-6 h-6 rounded flex items-center justify-center text-xs font-semibold">{t.label[0]}</span> */}
                            <span className="hidden sm:inline">{t.label}</span>
                        </button>
                    );
                })}
               
            </div>
        </div>
    );
}
