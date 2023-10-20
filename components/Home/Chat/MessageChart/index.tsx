import { useState } from "react";
import { ParentSize } from "@visx/responsive";
import { Stack, Flex, SegmentedControl } from "@mantine/core";
import type { IMessageChart } from "@/libs/stores/message";

import Chart from "./Chart";

const MessageChart = ({ payload }: Omit<IMessageChart, "type">) => {
  const [seriesType, setSeriesType] = useState("bar");

  return (
    <Stack>
      <Flex>
        <SegmentedControl
          value={seriesType}
          onChange={setSeriesType}
          data={[
            { label: "Bar", value: "bar" },
            { label: "Line", value: "line" },
            { label: "Area", value: "area" },
          ]}
        />
      </Flex>
      <ParentSize
        style={{
          width: "100%",
          height: "48vh",
          overflow: "hidden",
        }}
      >
        {({ width, height }) => (
          <Chart
            seriesType={seriesType}
            width={width}
            height={height}
            {...payload}
          />
        )}
      </ParentSize>
    </Stack>
  );
};

export default MessageChart;
