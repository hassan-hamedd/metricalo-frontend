import { type FC } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceLine,
  YAxis,
} from "recharts";

export type FunnelStep = {
  stage: string;
  value: number;
};

type Props = {
  data: FunnelStep[];
};

export const FunnelChart: FC<Props> = ({ data }) => (
  <ResponsiveContainer width="100%" height={180}>
    <AreaChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
      {/* dotted separators between stages */}
      {data.map((_, i) =>
        i > 0 ? (
          <ReferenceLine
            key={i}
            x={i}
            strokeDasharray="1 5"
            stroke="#E0E0E0"
            ifOverflow="extendDomain"
          />
        ) : null
      )}

      {/* axes (hidden ticks) */}
      <XAxis
        dataKey="stage"
        tickLine={false}
        axisLine={false}
        tick={{ fill: "transparent" }}
      />
      <YAxis domain={[0, "dataMax"]} hide />

      <CartesianGrid horizontal={false} vertical={false} />
      <Tooltip content={<></>} />

      {/* purple → soft-violet gradient */}
      <defs>
        <linearGradient id="funnelGradient" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#220055" />
          <stop offset="35%" stopColor="#6e3dff" />
          <stop offset="100%" stopColor="rgba(136,75,255,0.25)" />
        </linearGradient>
      </defs>

      <Area
        type="monotone"
        dataKey="value"
        stroke="none"
        fill="url(#funnelGradient)"
      />
    </AreaChart>
  </ResponsiveContainer>
);
