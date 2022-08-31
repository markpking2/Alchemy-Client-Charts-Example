import { Flex, Spinner, Text } from "@chakra-ui/react";

export const Loading = ({ text }: { text: string }) => {
  return (
    <Flex
      flexDirection={"column"}
      alignItems={"center"}
      justifyContent={"center"}
      w={"600px"}
      h={"600px"}
    >
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="blue.500"
        size="xl"
      />
      <Text fontSize={"3xl"} pt={5}>
        {text}
      </Text>
    </Flex>
  );
};
