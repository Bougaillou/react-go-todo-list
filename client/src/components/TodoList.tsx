import { Box, Flex, Spinner, Stack, Text } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import TodoItem from "./TodoItem";
// import { BASE_URL } from "../App";
import { useColorModeValue } from "./ui/color-mode";

export type Todo = {
  _id: number;
  body: string;
  completed: boolean;
};

const TodoList = () => {
  const mutedColor = useColorModeValue("gray.500", "gray.400");

  const API_URL: string =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api";

  const { data: todos = [], isLoading } = useQuery<Todo[]>({
    queryKey: ["todos"],
    queryFn: async () => {
      try {
        const res = await fetch(`${API_URL}/todos`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(
            data.error || "Something went wrong with get all todos",
          );
        }
        return data;
      } catch (err) {
        console.log(err);
      }
    },
  });

  return (
    <Box maxW="750px" mx="auto" mt={4}>
      <Text
        fontSize={{ base: "2xl", md: "3xl" }}
        fontWeight="bold"
        textAlign="center"
        mb={4}
        bgGradient="linear(to-r, #0b85f8, #00ffff)"
        bgClip="text"
      >
        Today's Tasks
      </Text>

      {isLoading && (
        <Flex justify="center" my={6}>
          <Spinner size="lg" />
        </Flex>
      )}

      {!isLoading && todos.length === 0 && (
        <Stack align="center" gap={3} py={6}>
          <Text fontSize="md" textAlign="center" color={mutedColor}>
            No Task For Now
          </Text>
        </Stack>
      )}

      {!isLoading && todos.length > 0 && (
        <Stack gap={3}>
          {todos.map((todo) => (
            <TodoItem key={todo._id} todo={todo} />
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default TodoList;
