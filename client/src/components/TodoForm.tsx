import { Button, Flex, Input, Spinner } from "@chakra-ui/react";
import React, { useRef, useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { useColorModeValue } from "./ui/color-mode";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const TodoForm = () => {
  const [newTodo, setNewTodo] = useState("");

  const inputRef = useRef<HTMLInputElement | null>(null);

  const bg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  const API_URL: string =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api";

  const queryClient = useQueryClient();

  const { mutate: createTodo, isPending: isCreation } = useMutation({
    mutationKey: ["createTodo"],
    mutationFn: async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        const res = await fetch(`${API_URL}/todos`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ body: newTodo }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(
            data.error || "Something went wrong with get all todos",
          );
        }
        setNewTodo("");
        return data;
      } catch (err) {
        console.log(err);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
    onError: (err) => {
      console.log(err);
    },
  });

  return (
    <>
      <form onSubmit={createTodo}>
        <Flex
          gap={2}
          bg={bg}
          border="1px solid"
          borderColor={borderColor}
          borderRadius="xl"
          p={2}
          shadow="sm"
          mb={5}
          maxW="750px"
          mx="auto"
        >
          <Input
            ref={inputRef}
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add a new task..."
            size="md"
            border="none"
            _focusVisible={{
              boxShadow: "none",
            }}
          />

          <Button
            type="submit"
            colorScheme="blue"
            size="md"
            px={4}
            borderRadius="lg"
            disabled={!newTodo.trim() || isCreation}
            minW="50px"
            _active={{
              transform: "scale(.97)",
            }}
          >
            {isCreation ? <Spinner size="sm" /> : <IoMdAdd size={20} />}
          </Button>
        </Flex>
      </form>
    </>
  );
};

export default TodoForm;
