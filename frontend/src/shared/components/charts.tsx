import React from "react";
import { Label, type TooltipContentProps, type TooltipValueType } from "recharts";
import type { CustomAppTickProps } from "../types";

export const CustomAppTick = React.memo(function CustomAppTick(props: CustomAppTickProps) {
  const { x, y, payload, dark, limit = 12, size = 10, weight = 700, color, width = 80 } = props;
  const name = String(payload?.value ?? "");
  const truncated = name.length > limit ? `${name.substring(0, limit - 2)}...` : name;
  const finalColor = color || (dark ? "#f1f5f9" : "#1e293b");

  return (
    <g transform={`translate(${x ?? 0},${y ?? 0})`}>
      <text
        x={-(width - 10)}
        y={0}
        dy={size / 2 - 1}
        textAnchor="start"
        fill={finalColor}
        style={{ fontSize: size, fontWeight: weight, fontFamily: "Inter, system-ui, sans-serif" }}
      >
        {truncated}
      </text>
    </g>
  );
});

type PieLabelRenderer = Exclude<NonNullable<React.ComponentProps<typeof Label>["content"]>, React.ReactElement>;
type PieLabelRendererProps = Parameters<PieLabelRenderer>[0];

function getPieLabelCenter(viewBox: PieLabelRendererProps["viewBox"]) {
  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
    return { cx: viewBox.cx ?? 0, cy: viewBox.cy ?? 0 };
  }
  return { cx: 0, cy: 0 };
}

export function PieLabelSmall(props: PieLabelRendererProps) {
  const { cx, cy } = getPieLabelCenter(props.viewBox);
  return (
    <g>
      <text x={cx} y={cy - 6} textAnchor="middle" dominantBaseline="middle" className="core-fill-textPrimary-light dark:core-fill-textPrimary-dark" style={{ fontSize: 10, fontWeight: 500 }}>Total</text>
      <text x={cx} y={cy + 8} textAnchor="middle" dominantBaseline="middle" className="core-fill-textPrimary-light dark:core-fill-textPrimary-dark" style={{ fontSize: 14, fontWeight: 900 }}>1,280</text>
    </g>
  );
}

export function PieLabelLarge(props: PieLabelRendererProps) {
  const { cx, cy } = getPieLabelCenter(props.viewBox);
  return (
    <g>
      <text x={cx} y={cy - 12} textAnchor="middle" dominantBaseline="middle" className="core-fill-textPrimary-light dark:core-fill-textPrimary-dark" style={{ fontSize: 14, fontWeight: 500 }}>Total Requests</text>
      <text x={cx} y={cy + 16} textAnchor="middle" dominantBaseline="middle" className="core-fill-textPrimary-light dark:core-fill-textPrimary-dark" style={{ fontSize: 28, fontWeight: 900 }}>1,280</text>
    </g>
  );
}

export function CustomTooltip({ active, payload, label }: TooltipContentProps<TooltipValueType, string | number>) {
  const value = payload?.[0]?.value;
  if (!active || value == null) return null;
  const name = label || payload?.[0]?.name;

  return (
    <div className="core-bg-[#1e1b4b] core-border-2 core-border-indigo-500 core-p-3 core-rounded-xl core-shadow-[0_10px_30px_rgba(0,0,0,0.5)] core-z-50">
      <div className="core-flex core-items-center core-gap-2 core-mb-1.5">
        <div className="core-w-2 core-h-2 core-rounded-full core-bg-indigo-400 core-animate-pulse" />
        <p className="core-text-[#a5b4fc] core-text-[11px] core-font-black core-uppercase core-tracking-wider">{name}</p>
      </div>
      <p className="core-font-black core-text-lg core-text-white core-leading-none">
        {value.toLocaleString()} <span className="core-text-[10px] core-text-indigo-300/60 core-uppercase">total</span>
      </p>
    </div>
  );
}
