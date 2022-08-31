import type { NextPage } from "next";
import {
  ERC20Transfers,
  BaseFees,
  GasRatios,
  Token,
  Loading,
} from "../components";
import { useState, useEffect } from "react";
import axios from "axios";
import * as _ from "lodash/fp";
import { Box, Flex, Text } from "@chakra-ui/react";

const Home: NextPage = () => {
  const [erc20Address, setErc20Address] = useState(
    "0x6B175474E89094C44Da98b954EedeAC495271d0F"
  );
  const [transferCounts, setTransferCounts] = useState<number[][]>([
    Array(10).fill([0, 0]),
  ]);
  const [baseFees, setBaseFees] = useState<number[][]>([
    Array(10).fill([0, 0]),
  ]);
  const [gasUsedRatios, setGasUsedRatios] = useState<number[][]>(
    Array(10).fill([0, 0])
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      if (erc20Address) {
        setLoading(true);
        const { data: transferCounts } = await axios.get(
          "/api/10-block-transfer-counts",
          { params: erc20Address }
        );
        const {
          data: { baseFees, gasUsedRatios },
        } = await axios.get("/api/10-block-gas-values");

        setTransferCounts(transferCounts);
        setBaseFees(baseFees);
        setGasUsedRatios(
          _.map(([block, gasUsed]) => [block, gasUsed * 100], gasUsedRatios)
        );
        setLoading(false);
      }
    })();
  }, [erc20Address]);

  return (
    <Flex
      justifyContent={"center"}
      alignItems={"center"}
      flexDirection={"column"}
      bg={"grey"}
      minHeight={"100vh"}
    >
      <Box border={"1px"} borderRadius={"10px"} bg={"white"}>
        <Text textAlign={"center"} fontSize={"3xl"}>
          Ethereum Mainnet Data
        </Text>
        <Flex flexWrap={"wrap"}>
          {loading ? (
            <Loading text={"Gas Base Fees Per Block"} />
          ) : (
            <BaseFees baseFees={baseFees} />
          )}
          {loading ? (
            <Loading text={"% Gas Used/Gas Limits Per Block"} />
          ) : (
            <GasRatios gasUsedRatios={gasUsedRatios} />
          )}
        </Flex>
      </Box>
      <Box border={"1px"} borderRadius={"10px"} mt={3} bg={"white"}>
        <Text textAlign={"center"} fontSize={"3xl"}>
          ERC20 Token Data
        </Text>
        <Flex flexWrap={"wrap"}>
          {loading ? (
            <Loading text={"ERC20 Token Transfer Counts"} />
          ) : (
            <ERC20Transfers transferCounts={transferCounts} />
          )}
          <Token
            erc20Address={erc20Address}
            setErc20Address={setErc20Address}
          />
        </Flex>
      </Box>
    </Flex>
  );
};

export default Home;
