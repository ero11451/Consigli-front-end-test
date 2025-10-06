
export type GridComponent = "Light" | "AirSupply" | "AirReturn" | "SmokeDetector" | "Invalid" | "Delete" | null;

export interface GridCell {
  x: number;
  y: number;
  component: GridComponent;
  // invalid:boolean 
}

// Props for the ceiling grid
export interface CeilingGridProps {
  width: number; // number of tiles horizontally
  height: number; // number of tiles vertically
  tileSize?: number; // optional, default 60px for visualization
  onDeleteMode? : false;
  ref?: React.Ref<{ clearAll: () => void }>
}

export interface CeilingGridHandle {
  clearAll: () => void;
}

