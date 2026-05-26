import {
  Box,
  Button,
  Container,
  Flex,
  Text,
} from "@chakra-ui/react";
import { IoMoon } from "react-icons/io5";
import { LuSun } from "react-icons/lu";
import { useColorMode, useColorModeValue } from "./ui/color-mode";

export default function Navbar() {
  const { colorMode, toggleColorMode } = useColorMode();

  const bg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.800", "white");

  return (
    <Container maxW="900px" px={{ base: 4, md: 0 }}>
      <Box
        as="nav"
        bg={bg}
        border="1px solid"
        borderColor={borderColor}
        borderRadius="2xl"
        px={{ base: 4, md: 6 }}
        py={3}
        my={4}
        shadow="sm"
      >
        <Flex align="center" justify="space-between" gap={4}>
          <Text
            fontSize={{ base: "md", sm: "lg" }}
            fontWeight="700"
            color={textColor}
            lineHeight="short"
          >
            My First React Go Project
          </Text>

          <Button
            onClick={toggleColorMode}
            aria-label="Toggle color mode"
            size="md"
            variant="ghost"
            borderRadius="xl"
          >
            {colorMode === "light" ? <IoMoon size={20} /> : <LuSun size={20} />}
          </Button>
        </Flex>
      </Box>
    </Container>
  );
}
