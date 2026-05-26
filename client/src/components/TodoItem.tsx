import { Badge, Flex, IconButton, Spinner, Text } from "@chakra-ui/react";
import { FaCheckCircle } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import type { Todo } from "./TodoList";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const TodoItem = ({ todo }: { todo: Todo }) => {
  const API_URL: string =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api/";

  const queryClient = useQueryClient()

  const { mutate: updateTodo, isPending: isUpdating } = useMutation({
    mutationKey: ["updateTodo"],
    mutationFn: async () => {
      if (todo.completed) return alert("Todo is already completed");

      try {
        const res = await fetch(`${API_URL}/todos/${todo._id}`, {
          method: "PATCH",
        });

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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const { mutate: deleteTodo, isPending: isDeleting } = useMutation({
    mutationKey: ["deleteTodo"],
    mutationFn: async () => {

      try {
        const res = await fetch(`${API_URL}/todos/${todo._id}`, {
          method: "DELETE",
        });

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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  return (
    <Flex gap={2} align="center">
      <Flex
        flex={1}
        align="center"
        justify="space-between"
        border="1px solid"
        borderColor="gray.600"
        p={2}
        borderRadius="lg"
      >
        <Text
          color={todo.completed ? "green.300" : "yellow.300"}
          textDecoration={todo.completed ? "line-through" : "none"}
        >
          {todo.body}
        </Text>

        <Badge colorPalette={todo.completed ? "green" : "yellow"}>
          {todo.completed ? "Done" : "In Progress"}
        </Badge>
      </Flex>

      <Flex gap={2} align="center">
        <IconButton
          aria-label="Complete todo"
          size="sm"
          colorPalette="green"
          variant="ghost"
          onClick={() => updateTodo()}
        >
          {!isUpdating ? <FaCheckCircle /> : <Spinner size={"sm"} />}
        </IconButton>

        <IconButton
          aria-label="Delete todo"
          size="sm"
          colorPalette="red"
          variant="ghost"
        onClick={() => deleteTodo()}
        >
          {!isDeleting ? <MdDelete size={20} /> : <Spinner size={"sm"} />}
        </IconButton>
      </Flex>
    </Flex>
  );
};

export default TodoItem;
