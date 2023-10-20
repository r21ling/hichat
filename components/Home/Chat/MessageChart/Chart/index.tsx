import {
  AnimatedBarSeries,
  AnimatedLineSeries,
  AnimatedAreaSeries,
  AnimatedGrid,
  AnimatedAxis,
  AnimatedBarGroup,
  XYChart,
  Tooltip,
  lightTheme,
  darkTheme,
} from "@visx/xychart";

import { useComputedColorScheme } from "@mantine/core";
import { Box, Flex, Title, Text } from "@mantine/core";

interface IData {
  x: string;
  y: string;
}

interface ChartControlProps {
  data?: { [x: string]: IData[] }[];
  seriesType?: string;
  width: number;
  height: number;
}

// accessors
const getX = (d: IData) => d.x;
const getY = (d: IData) => d.y;

const numTicks = 4;

const ChartControl = ({
  data = [],
  seriesType,
  width,
  height,
}: ChartControlProps) => {
  const computedColorScheme = useComputedColorScheme("light", {
    getInitialValueInEffect: true,
  });

  if (width < 10) {
    return null;
  }

  return (
    <XYChart
      width={width}
      height={height}
      theme={computedColorScheme === "dark" ? darkTheme : lightTheme}
      xScale={{ type: "band", paddingInner: 0.4, paddingOuter: 0.4 }}
      yScale={{ type: "linear" }}
    >
      <AnimatedAxis
        orientation="left"
        numTicks={numTicks}
        animationTrajectory="min"
        tickLabelProps={{
          fontSize: 14,
        }}
      />
      <AnimatedAxis
        orientation="bottom"
        animationTrajectory="center"
        tickLabelProps={{
          fontSize: 14,
        }}
        numTicks={numTicks}
      />
      <AnimatedGrid
        columns={false}
        rows
        animationTrajectory="center"
        strokeDasharray="2,2"
        lineStyle={{
          stroke: "var(--mantine-color-dark-0)",
          strokeWidth: 1,
        }}
        numTicks={numTicks}
      />

      <AnimatedBarGroup>
        {seriesType === "bar" && (
          <>
            {data?.map?.((d) => {
              const key = Object.keys(d)[0];
              return (
                <AnimatedBarSeries
                  key={key}
                  dataKey={key}
                  data={d[key] ?? []}
                  xAccessor={getX}
                  yAccessor={getY}
                />
              );
            })}
          </>
        )}
      </AnimatedBarGroup>
      {seriesType === "line" && (
        <>
          {data?.map?.((d) => {
            const key = Object.keys(d)[0];
            return (
              <AnimatedLineSeries
                key={key}
                dataKey={key}
                data={d[key] ?? []}
                xAccessor={getX}
                yAccessor={getY}
              />
            );
          })}
        </>
      )}
      {seriesType === "area" && (
        <>
          {data?.map?.((d) => {
            const key = Object.keys(d)[0];
            return (
              <AnimatedAreaSeries
                key={key}
                dataKey={key}
                data={d[key] ?? []}
                fillOpacity={0.4}
                xAccessor={getX}
                yAccessor={getY}
              />
            );
          })}
        </>
      )}

      <Tooltip<IData>
        snapTooltipToDatumX
        snapTooltipToDatumY
        showVerticalCrosshair
        showDatumGlyph
        showSeriesGlyphs
        renderTooltip={({ tooltipData, colorScale }) => (
          <Box>
            <Title order={5}>
              {tooltipData?.nearestDatum?.datum
                ? getX(tooltipData?.nearestDatum?.datum)
                : "-"}
            </Title>
            {Object.keys(tooltipData?.datumByKey ?? {})
              .filter((k) => k)
              .map((key) => (
                <Flex key={key} gap="sm" direction="row">
                  <Text
                    size="sm"
                    style={{
                      color: colorScale?.(key),
                    }}
                  >
                    {key}:
                  </Text>
                  <Text size="sm">
                    {tooltipData?.datumByKey?.[key]
                      ? getY(tooltipData?.datumByKey?.[key]?.datum)
                      : "-"}
                  </Text>
                </Flex>
              ))}
          </Box>
        )}
      />
    </XYChart>
  );
};

export default ChartControl;
