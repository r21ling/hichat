import { useEffect, useMemo, useRef } from "react";
import { useSpring, animated } from "react-spring";
import { useEvent } from "react-use-event-hook";
import { useComputedColorScheme } from "@mantine/core";
import { useIntersection } from "@mantine/hooks";
import { max } from "d3-array";
import { format } from "d3-format";
import { Bar } from "@visx/shape";
import { Group } from "@visx/group";
import { scaleBand, scaleLinear } from "@visx/scale";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { AnimatedGridRows, AnimatedGridColumns } from "@visx/react-spring";
import { Text } from "@visx/text";
import { useTooltip, defaultStyles, useTooltipInPortal } from "@visx/tooltip";
import { localPoint } from "@visx/event";

interface IData {
  x: string;
  y: number;
}

interface BarChartProps {
  data?: IData[];
  width: number;
  height: number;
  margin?: { top: number; right: number; bottom: number; left: number };
}

// accessors
const getX = (d: IData) => d.x;
const getY = (d: IData) => d.y;

const yAxisTickNumber = 4;

const BarChart = ({
  data,
  width,
  height,
  margin = { top: 40, right: 30, bottom: 50, left: 50 },
}: BarChartProps) => {
  const computedColorScheme = useComputedColorScheme("light", {
    getInitialValueInEffect: true,
  });

  const isAnimated = useRef(false);
  const { ref, entry } = useIntersection({
    root: null,
    threshold: 0.6,
  });

  const xMax = useMemo(
    () => width - margin.left - margin.right,
    [margin.left, margin.right, width]
  );
  const yMax = useMemo(
    () => height - margin.top - margin.bottom,
    [height, margin.bottom, margin.top]
  );

  const xScale = useMemo(
    () =>
      scaleBand({
        range: [0, xMax],
        padding: 0.4,
        domain: data?.map(getX),
      }),
    [data, xMax]
  );

  const yScale = useMemo(
    () =>
      scaleLinear({
        nice: yAxisTickNumber,
        domain: [0, max(data ?? [], getY)] as [number, number],
        range: [yMax, 0],
        round: true,
      }),
    [data, yMax]
  );

  const [{ scale }, api] = useSpring(() => ({ scale: 0 }));
  const AnimatedBar = animated(Bar);

  const {
    tooltipData,
    tooltipLeft,
    tooltipTop,
    tooltipOpen,
    showTooltip,
    hideTooltip,
  } = useTooltip<IData>();
  const { containerRef, TooltipInPortal } = useTooltipInPortal({
    detectBounds: true,
    scroll: true,
  });
  const handleMouseOver = useEvent(
    (
      event:
        | React.TouchEvent<SVGRectElement>
        | React.MouseEvent<SVGRectElement>,
      datum: IData
    ) => {
      const { x, y } = localPoint(event) || {
        x: 0,
        y: 0,
      };
      showTooltip({
        tooltipData: datum,
        tooltipLeft: x,
        tooltipTop: y,
      });
    }
  );

  useEffect(() => {
    if (entry?.isIntersecting && !isAnimated.current) {
      api.start({
        from: { scale: 0 },
        to: { scale: 1 },
      });
      isAnimated.current = true;
    }
  }, [api, entry?.isIntersecting]);

  return (
    <div ref={ref}>
      <svg ref={containerRef} width={width} height={height}>
        <rect
          x={0}
          y={0}
          width={width}
          height={height}
          fill="var(--mantine-color-gray-light)"
          rx={14}
        />
        <Group top={margin.top} left={margin.left}>
          <AnimatedGridRows
            scale={yScale}
            width={xMax}
            numTicks={yAxisTickNumber}
            stroke={
              computedColorScheme === "dark"
                ? "var(--mantine-color-dark-4)"
                : "var(--mantine-color-gray-3)"
            }
          />
          <AnimatedGridColumns
            scale={xScale}
            height={yMax}
            stroke={
              computedColorScheme === "dark"
                ? "var(--mantine-color-dark-4)"
                : "var(--mantine-color-gray-3)"
            }
          />
          {data?.map?.((d) => {
            const barWidth = xScale.bandwidth();
            const barHeight = yMax - yScale(getY(d));
            const barX = xScale(getX(d));

            return (
              <AnimatedBar
                key={`bar-${getX(d)}`}
                x={barX}
                y={scale.to((s) => yMax - s * barHeight)}
                width={barWidth}
                height={scale.to((s) => s * barHeight)}
                fill="var(--mantine-color-grape-light-color)"
                onTouchStart={(e) => handleMouseOver(e, d)}
                onTouchMove={(e) => handleMouseOver(e, d)}
                onTouchCancel={() => hideTooltip()}
                onMouseMove={(e) => handleMouseOver(e, d)}
                onMouseLeave={() => hideTooltip()}
              />
            );
          })}
          <AxisBottom
            top={yMax}
            scale={xScale}
            stroke="var(--mantine-color-text)"
            tickStroke="var(--mantine-color-text)"
            tickComponent={({ formattedValue, ...rest }) => (
              <Text
                scaleToFit="shrink-only"
                width={xScale.bandwidth()}
                {...rest}
              >
                {formattedValue}
              </Text>
            )}
            tickLabelProps={() => ({
              fill: "var(--mantine-color-text)",
              fontSize: "var(--mantine-font-size-sm)",
              textAnchor: "middle",
              dy: "0.6em",
            })}
          />
          <AxisLeft
            scale={yScale}
            stroke="var(--mantine-color-text)"
            tickStroke="var(--mantine-color-text)"
            numTicks={yAxisTickNumber}
            tickFormat={(value) => format(",")(value)}
            tickComponent={({ formattedValue, ...rest }) => (
              <Text scaleToFit="shrink-only" width={margin.left - 24} {...rest}>
                {formattedValue}
              </Text>
            )}
            tickLabelProps={() => ({
              fill: "var(--mantine-color-text)",
              fontSize: "var(--mantine-font-size-sm)",
              textAnchor: "end",
              verticalAnchor: "middle",
              dx: "-0.25em",
            })}
          />
        </Group>
      </svg>

      {tooltipOpen && tooltipData && (
        <TooltipInPortal
          top={tooltipTop}
          left={tooltipLeft}
          style={{
            ...defaultStyles,
            minWidth: 60,
            backgroundColor: "rgba(0,0,0,0.9)",
            color: "white",
          }}
        >
          <div>
            {tooltipData.x}: {tooltipData.y}
          </div>
        </TooltipInPortal>
      )}
    </div>
  );
};

export default BarChart;
