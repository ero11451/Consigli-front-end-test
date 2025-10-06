export const tools = [
  { label: "Light", color: "bg-yellow-300 text-slate-900" },
  { label: "AirSupply", color: "bg-sky-300 text-slate-900" },
  { label: "AirReturn", color: "bg-emerald-200 text-slate-900" },
  { label: "SmokeDetector", color: "bg-pink-300 text-slate-900" },
  { label: "Invalid", color: "bg-stone-300 text-slate-900" },
  { label: "Delete", color: "bg-red-700 text-white" },
] as const;
// i used as const to make the value constant read only

export type ITool = (typeof tools)[number]["label"];
