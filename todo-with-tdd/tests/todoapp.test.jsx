import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import TodoApp from "../src/components/TodoApp";
import axios from "axios";

test("render todo input", () => {
  render(<TodoApp />);
  expect(screen.getByPlaceholderText("Add todo")).toBeInTheDocument();
});

test("should add todo when Add Button is clicked", async () => {
  // Arrange
  const mockTodo = {
    _id: "1",
    title: "Learn React Testing",
    completed: false,
  };

  // ✅ MOCK RESPONSE
  axios.post.mockResolvedValueOnce({
    data: mockTodo,
  });

  const onAddTodo = vi.fn();

  render(<TodoApp todos={[]} onAddTodo={onAddTodo} />);

  // Act
  fireEvent.change(screen.getByPlaceholderText("Add todo"), {
    target: { value: "Learn React Testing" },
  });

  fireEvent.click(screen.getByText("Add Button"));

  // Assert
  await waitFor(() => {
    expect(onAddTodo).toHaveBeenCalledWith(mockTodo);
  });
});

test("should delete the todo when delete button is cliked", async () => {});
