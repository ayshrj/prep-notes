export const getStatusClasses = (status: string, currentStatus: string) => {
  const base =
    "px-3 py-1 sm:px-6 sm:py-2 text-xs md:text-sm rounded-md border transition-all duration-200 cursor-pointer ";
  if (status === "pending") {
    return (
      base +
      (currentStatus === "pending"
        ? "border-red-600 bg-red-900/25 text-red-300 shadow-md hover:bg-red-900/40"
        : "bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-700")
    );
  } else if (status === "in-progress") {
    return (
      base +
      (currentStatus === "in-progress"
        ? "border-blue-600 bg-slate-800 text-blue-300 shadow-md hover:bg-slate-700"
        : "bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-700")
    );
  } else if (status === "completed") {
    return (
      base +
      (currentStatus === "completed"
        ? "border-green-600 bg-green-900/20 text-green-300 shadow-md hover:bg-green-900/30"
        : "bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-700")
    );
  }
  return base;
};
