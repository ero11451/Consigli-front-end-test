import React, {
    forwardRef,
    useImperativeHandle,
    useMemo,
    useState,
    type ForwardedRef,
} from "react";
import type { CeilingGridHandle, CeilingGridProps, GridCell, GridComponent } from "../interfaces/IGrid";



function CeilingGrid(
    { width, height, tileSize = 60 }: CeilingGridProps & { selected?: GridComponent },
    ref: ForwardedRef<CeilingGridHandle>
) {
    // create initial grid once then use memo to prevent re-creating
    const initialGrid = useMemo(
        () =>
            Array.from({ length: height }, (_, y) =>
                Array.from({ length: width }, (_, x) => ({ x, y, component: null } as GridCell))
            ),
        [width, height]
    );

    const [grid, setGrid] = useState<GridCell[][]>(initialGrid);

    // track the source cell while dragging from grid (nullable coordinates)
    const [currentToolPosition, setCurrentToolPosition] = useState<{ x: number | null; y: number | null , component:GridComponent | null}>({
        x: null,
        y: null,
        component:null
    });

    // helper to set a cell's component (component may be null)
    const updateCell = (x: number, y: number, component: GridComponent | null, ) => {
        setGrid((prev) =>
            prev.map((row) => row.map((cell) => (cell.x === x && cell.y === y ? { ...cell, component } : cell)))
        );
    };

    // expose clearAll() to parent via ref this remove all the component (tools) from the grid from the parent
    useImperativeHandle(ref, () => ({
        clearAll: () => {
            setGrid((prev) => prev.map((row) => row.map((c) => ({ ...c, component: null }))));
        },
    }));

    // drop handler: read tool label from dataTransfer or fallback to selected
    const onCellDrop = (e: React.DragEvent, cellX: number, cellY: number, _component:GridComponent,  ) => {
        e.preventDefault();
        // first we want to update the cell with the component
        updateCell(cellX, cellY, currentToolPosition.component || _component);
        // then on this line we want to the delete it from the old position
        const { x: sx, y: sy } = currentToolPosition;
        if (sx !== null && sy !== null && (sx !== cellX || sy !== cellY)) {
            updateCell(sx, sy, null);
        }
        
        // reset source position after drop
        setCurrentToolPosition({ x: null, y: null , component: null});
    };
    // on the event handler we want to get access to the element selected
    const onDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "copy";
    };

    // start dragging from a grid cell — record its coords
    const onCellDragStart = (_e: React.DragEvent, cell: GridCell,) => {
        if (!cell.component) return;
        setCurrentToolPosition({ x: cell.x, y: cell.y, component: cell.component });
    };

    const renderComponent = (c: GridComponent) => {
        switch (c) {
            case "Light":
                return <div className="w-8 h-8 rounded bg-yellow-400/90 flex items-center justify-center text-xs font-semibold text-slate-900">L</div>;
            case "AirSupply":
                return <div className="w-8 h-8 rounded bg-sky-400/90 flex items-center justify-center text-xs font-semibold text-slate-900">S</div>;
            case "AirReturn":
                return <div className="w-8 h-8 rounded bg-emerald-300/90 flex items-center justify-center text-xs font-semibold text-slate-900">A</div>;
            case "SmokeDetector":
                return <div className="w-8 h-8 rounded bg-pink-400/90 flex items-center justify-center text-xs font-semibold text-slate-900">S</div>;
            case "Invalid":
                return <div className="w-8 h-8 rounded bg-stone-300 flex items-center justify-center text-xs font-semibold text-slate-900">X</div>;
            default:
                return null;
        }
    };

    return (
        <div>
            <div
                className="grid bg-white"
                style={{
                    gridTemplateColumns: `repeat(${width}, ${tileSize}px)`,
                    gridTemplateRows: `repeat(${height}, ${tileSize}px)`,
                }}
            >
                {grid.flat().map((cell) => (
                    <div
                        key={`${cell.x}-${cell.y}`}
                        style={{ width: tileSize, height: tileSize }}
                        draggable={!!cell.component} // only draggable if it contains a component
                        onDragStart={(e) =>  onCellDragStart(e, cell)}
                        onDrop={(e) => 
                             cell.component == "Invalid" ? alert("the cell is invalid") :
                             onCellDrop(e, cell.x, cell.y, e.dataTransfer.getData("text/plain") as GridComponent )
                            }
                        onDragOver={onDragOver}
                        className="border border-gray-200 flex items-center justify-center hover:bg-gray-50 cursor-pointer select-none"
                    >
                        {renderComponent(cell.component)}
                    </div>
                ))}
            </div>
        </div>
    );
}

// export wrapped with forwardRef so parent can call clearAll via ref
export default forwardRef(CeilingGrid);
