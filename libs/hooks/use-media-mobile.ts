import { em } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

export const useMediaMobile = () => {
  const isMobile = useMediaQuery(`(max-width: ${em(750)})`);

  return isMobile;
};
