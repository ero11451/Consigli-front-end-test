import React, {
    forwardRef,
    useImperativeHandle,
    useMemo,
    useState,
    type ForwardedRef,
} from "react";
import type { CeilingGridHandle, CeilingGridProps, GridCell, GridComponent } from "../interfaces/IGrid";



function CeilingGrid(
    { width, height, tileSize = 60 }: CeilingGridProps,
    ref: ForwardedRef<CeilingGridHandle>
) {
    // Create the initial grid once (memoized) to avoid recreating it on every render.
    const initialGrid = useMemo(
        () =>
            Array.from({ length: height }, (_, y) =>
                Array.from({ length: width }, (_, x) => ({ x, y, component: null } as GridCell))
            ),
        [width, height]
    );

    const [grid, setGrid] = useState<GridCell[][]>(initialGrid);

    // Track the source cell while dragging from the grid.
    // Coordinates are nullable until a drag starts.
    const [currentToolPosition, setCurrentToolPosition] = useState<{ x: number | null; y: number | null, component: GridComponent | null }>({
        x: null,
        y: null,
        component: null
    });

    // Update a cell's component (can set to null to clear the cell).
    const updateCell = (x: number, y: number, component: GridComponent | null,) => {
        setGrid((prev) =>
            prev.map((row) => row.map((cell) => (cell.x === x && cell.y === y ? { ...cell, component } : cell)))
        );
    };

    // Expose clearAll() via ref so the parent can clear all placed components.
    useImperativeHandle(ref, () => ({
        clearAll: () => {
            setGrid((prev) => prev.map((row) => row.map((c) => ({ ...c, component: null }))));
        },
    }));

    // Drop handler — determine incoming tool (from dataTransfer or fallback)
    // then place it in the target cell and clear the source if it was a move.
    const onCellDrop = (e: React.DragEvent, cellX: number, cellY: number, _component: GridComponent,) => {
        e.preventDefault();
        // first we want to update the cell with the component
        updateCell(cellX, cellY, currentToolPosition.component || _component);
        // then on this line we want to the delete it from the old position
        const { x: sx, y: sy } = currentToolPosition;
        if (sx !== null && sy !== null && (sx !== cellX || sy !== cellY)) {
            updateCell(sx, sy, null);
        }

        // reset source position after drop
        setCurrentToolPosition({ x: null, y: null, component: null });
    };
    // Allow drops by preventing default; set the drop effect (copy).
    const onDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "copy";
    };

    // Start dragging a filled cell: record its coordinates and component.
    const onCellDragStart = (_e: React.DragEvent, cell: GridCell,) => {
        if (!cell.component) return;
        setCurrentToolPosition({ x: cell.x, y: cell.y, component: cell.component });
    };

    // this function will act as the element creation function that based on the input from the dragged element
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
                {/* the flat method spread the array */}
                {grid.flat().map((cell) => (
                    <div
                        key={`${cell.x}-${cell.y}`}
                        style={{ width: tileSize, height: tileSize }}
                        draggable={!!cell.component} // only draggable if it contains a component
                        onDragStart={(e) => onCellDragStart(e, cell)}
                        onDrop={(e) =>
                            cell.component == "Invalid" ? alert("The cell is invalid") :
                                onCellDrop(e, cell.x, cell.y, e.dataTransfer.getData("text/plain") as GridComponent)
                        }
                        onDragOver={onDragOver}
                        className="border border-gray-200 flex items-center justify-center hover:bg-gray-50 cursor-pointer select-none"
                    >
                        {/* this will create the element on the automatically we already have a switch statement that select the valid element to render */}
                        {renderComponent(cell.component)}
                    </div>
                ))}
            </div>
        </div>
    );
}

// export wrapped with forwardRef so parent can call clearAll via ref
export default forwardRef(CeilingGrid);
