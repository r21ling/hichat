import { useState } from "react";
import { Stack, Flex, SegmentedControl } from "@mantine/core";
import { ParentSize } from "@visx/responsive";

import type { IMessageChart } from "@/libs/stores/message";

import Bar from "./Bar";

const MessageChart = ({ payload }: Omit<IMessageChart, "type">) => {
  const [chartType, setChartType] = useState("bar");

  return (
    <Stack>
      <Flex>
        <SegmentedControl
          value={chartType}
          onChange={setChartType}
          data={[
            { label: "Bar", value: "bar" },
            { label: "Line", value: "line" },
            { label: "Area", value: "area" },
          ]}
        />
      </Flex>

      <ParentSize
        debounceTime={10}
        style={{
          width: "100%",
          height: "42vh",
          overflow: "hidden",
        }}
      >
        {({ width, height }) => (
          <>
            {chartType === "bar" && (
              <Bar width={width} height={height} {...payload} />
            )}
          </>
        )}
      </ParentSize>
    </Stack>
  );
};

export default MessageChart;
