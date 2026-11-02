import React from "react";
import { cn } from "../../utils/cn";

const priorityStyles = {
  urgent: "bg-rose-500/15 text-rose-400 border-rose-500/30",
  high: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  medium: "bg-sky-500/15 text-sky-400 border-sky-500/30",
  low: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
};

export const Badge = ({
  children,
  priority,
  variant = "default",
  className,
}) => {
  let style = "bg-slate-800 text-slate-300 border-slate-700/60";

  if (priority && priorityStyles[priority]) {
    style = priorityStyles[priority];
  } else if (variant === "purple") {
    style = "bg-purple-500/15 text-purple-400 border-purple-500/30";
  } else if (variant === "indigo") {
    style = "bg-indigo-500/15 text-indigo-400 border-indigo-500/30";
  }

  return (
    <span
      className={cn(
        "inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-md border tracking-wide uppercase text-[10px]",
        style,
        className
      )}
    >
      {children}
    </span>
  );
};

export default Badge;
