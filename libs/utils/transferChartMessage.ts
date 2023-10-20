import type { CityTemperature } from "@visx/mock-data/lib/mocks/cityTemperature";

export const transferChartMessage = (
  data: CityTemperature[]
): {
  [x: string]: {
    x: string;
    y: string;
  }[];
}[] => {
  if (!data?.length) {
    return [];
  }
  const keys = Object.keys(data[0]).filter((d) => d !== "date");

  const result = keys.map((key) => ({
    [key]: data.map((d) => ({ x: d.date, y: d[key as keyof CityTemperature] })),
  }));

  return result;
};
