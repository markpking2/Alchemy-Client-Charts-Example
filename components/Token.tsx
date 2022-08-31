import {
  Box,
  Input,
  Text,
  Button,
  Image,
  Flex,
  useToast,
} from "@chakra-ui/react";
import { useState, useEffect, Dispatch, SetStateAction } from "react";
import axios from "axios";

export const Token = ({
  erc20Address,
  setErc20Address,
}: {
  erc20Address: string;
  setErc20Address: Dispatch<SetStateAction<string>>;
}) => {
  const [input, setInput] = useState(erc20Address);
  const [tokenMetadata, setTokenMetadata] = useState<{
    decimals: number;
    logo?: string;
    name: string;
    symbol: string;
  } | null>(null);
  const toast = useToast();

  const contractRegex = /^0x[a-fA-F0-9]{40}$/;

  const validContract = (address: string) => !address.match(contractRegex);

  const updateMetadata = async (address: string) => {
    try {
      const { data } = await axios.get("/api/token-metadata", {
        params: { address },
      });
      setTokenMetadata(data);
      setErc20Address(address);
    } catch (err) {
      toast({
        title: "Error Fetching Token Data",
        description:
          "Error fetching token data. Are you sure the address you provided is an ERC20 contract?",
        status: "error",
        duration: 10000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  useEffect(() => {
    (async () => {
      if (!tokenMetadata && erc20Address) {
        await updateMetadata(erc20Address);
      }
    })();
  }, [erc20Address]);

  return (
    <Box p={4} w={"600px"}>
      <Text mb={2}>Enter an ERC20 token contract address:</Text>
      <Input
        onChange={(e) => setInput(e.target.value)}
        value={input}
        placeholder={"ERC20 Token Contract Address"}
        w={"450px"}
      />
      <Button
        disabled={validContract(input)}
        ml={2}
        onClick={async () => updateMetadata(input)}
      >
        Submit
      </Button>
      {tokenMetadata && (
        <Flex flexDirection={"column"} alignItems={"center"} mt={5}>
          {!!tokenMetadata.logo && (
            <Image
              src={tokenMetadata.logo}
              alt={tokenMetadata.name}
              w={"100px"}
            />
          )}
          <Text p={2}>
            Token Name:{" "}
            <Text fontSize={"2xl"} ml={2} fontWeight="bold" display={"inline"}>
              {tokenMetadata.name}
            </Text>
          </Text>
          <Text p={2}>
            Symbol:{" "}
            <Text fontSize={"2xl"} ml={2} fontWeight="bold" display={"inline"}>
              {tokenMetadata.symbol}
            </Text>
          </Text>
          <Text p={2}>
            Decimals:
            <Text ml={2} fontSize={"2xl"} display={"inline"}>
              {tokenMetadata.decimals}
            </Text>
          </Text>
        </Flex>
      )}
    </Box>
  );
};
