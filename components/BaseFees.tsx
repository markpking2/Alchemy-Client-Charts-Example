import { VictoryBar, VictoryTheme, VictoryChart, VictoryAxis } from "victory";
import { Text, Box } from "@chakra-ui/react";
import * as _ from "lodash/fp";
export const BaseFees = ({ baseFees }: { baseFees: number[][] }) => {
  return (
    <Box p={5} w={"600px"}>
      <Text fontSize="xl" textAlign={"center"} mb={-20}>
        Gas Base Fee (Wei) Per Block
      </Text>
      <VictoryChart theme={VictoryTheme.material} domainPadding={10}>
        <VictoryBar
          style={{
            data: { fill: "#22b819", fontSize: "1px" },
            labels: { fontSize: "1px" },
          }}
          data={baseFees}
          x={"0"}
          y={"1"}
        />
        <VictoryAxis
          tickCount={5}
          dependentAxis
          style={{ tickLabels: { angle: 55, fontSize: "8px" } }}
        />
        <VictoryAxis
          tickValues={[..._.map(([block]) => block, baseFees)]}
          style={{
            tickLabels: { angle: 35, fontSize: "8px" },
          }}
        />
      </VictoryChart>
      <Text fontSize="md" textAlign={"center"} mt={-7}>
        Block Numbers
      </Text>
    </Box>
  );
};
