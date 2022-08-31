import { VictoryBar, VictoryTheme, VictoryChart, VictoryAxis } from "victory";
import { Text, Box } from "@chakra-ui/react";
import * as _ from "lodash/fp";
export const GasRatios = ({ gasUsedRatios }: { gasUsedRatios: number[][] }) => {
  return (
    <Box p={5} w={"600px"}>
      <Text fontSize="xl" textAlign={"center"} mb={-20}>
        % Gas Used/Gas Limit Per Block
      </Text>
      <VictoryChart theme={VictoryTheme.material} domainPadding={10}>
        <VictoryBar
          style={{
            data: { fill: "#22b819", fontSize: "1px" },
            labels: { fontSize: "1px" },
          }}
          data={gasUsedRatios}
          x={"0"}
          y={"1"}
        />
        <VictoryAxis
          dependentAxis
          tickValues={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
          tickFormat={(t) => `${t}%`}
          style={{ tickLabels: { fontSize: "10px" } }}
        />
        <VictoryAxis
          style={{ tickLabels: { angle: 35, fontSize: "8px" } }}
          tickValues={[..._.map(([block]) => block, gasUsedRatios)]}
        />
      </VictoryChart>
      <Text fontSize="md" textAlign={"center"} mt={-7}>
        Block Numbers
      </Text>
    </Box>
  );
};
