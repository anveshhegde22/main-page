import { Rectangle, Sector } from "recharts";
import { PIE_COLORS } from "./data";
import type { BarShapeProps, PieSectorShapeProps } from "recharts";

export const topAppsBarShape = (gradientPrefix: string) => (props: BarShapeProps) => {
  const index = props.index ?? 0;
  return <Rectangle {...props} fill={`url(#${gradientPrefix}${index % 5})`} />;
};

export const pieSliceShape = (props: PieSectorShapeProps) => {
  const index = props.index ?? 0;

  return (
    <Sector
      {...props}
      cornerRadius={8}
      fill={PIE_COLORS[index % PIE_COLORS.length]}
    />
  );
};
