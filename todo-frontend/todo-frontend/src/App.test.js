import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import App from "./App";

const mock = new MockAdapter(axios);

describe("Todo App Integration Tests", () => {
  beforeEach(() => {
    mock.reset(); // Reset mock before each test
  });

  test("loads todos on startup and displays them", async () => {
    const todos = [
      { id: 1, task: "Task One", completed: false },
      { id: 2, task: "Task Two", completed: true },
    ];

    mock.onGet("/api/todos").reply(200, todos);

    render(<App />);

    // Wait for the todos to appear
    await waitFor(() => {
      expect(screen.getByText("Task One")).toBeInTheDocument();
      expect(screen.getByText("Task Two")).toBeInTheDocument();
    });

    // Check completion class
    expect(screen.getByText("Task Two").closest("li")).toHaveClass("completed");
  });

  test("adds a new todo and displays it", async () => {
    // Initial GET returns empty
    mock.onGet("/api/todos").reply(200, []);
    // POST returns success
    mock.onPost("/api/todos").reply(200);
    // GET after POST returns the new todo
    mock.onGet("/api/todos").reply(200, [{ id: 3, task: "New Task", completed: false }]);

    render(<App />);

    const input = screen.getByPlaceholderText("Enter your task...");
    const addBtn = screen.getByText("Add");

    fireEvent.change(input, { target: { value: "New Task" } });
    fireEvent.click(addBtn);

    await waitFor(() => {
      expect(screen.getByText("New Task")).toBeInTheDocument();
    });
  });

  test("toggles todo completion status", async () => {
    const todo = { id: 1, task: "Toggle Me", completed: false };

    // Axios mocks
    mock.onGet("/api/todos").replyOnce(200, [todo]);                 // initial GET
    mock.onPut(`/api/todos/${todo.id}`).reply(200);                  // toggle PUT
    mock.onGet("/api/todos").replyOnce(200, [{ ...todo, completed: true }]); // GET after PUT

    render(<App />);

    // Wait for the todo to appear
    const todoItem = await screen.findByText("Toggle Me");
    expect(todoItem).toBeInTheDocument();

    // Wait for "Done" button and click it
    const doneBtn = await screen.findByText("Done");
    fireEvent.click(doneBtn);

    // Wait for updated state
    await waitFor(() => {
      const updatedTodo = screen.getByText("Toggle Me").closest("li");
      expect(updatedTodo).toHaveClass("completed");
      expect(screen.getByText("Undo")).toBeInTheDocument();
    });
  });

  test("deletes a todo", async () => {
    const todo = { id: 1, task: "Delete Me", completed: false };

    mock.onGet("/api/todos").replyOnce(200, [todo]);
    mock.onDelete(`/api/todos/${todo.id}`).reply(200);
    mock.onGet("/api/todos").replyOnce(200, []);

    render(<App />);

    // Wait for the todo to appear
    const todoItem = await screen.findByText("Delete Me");
    expect(todoItem).toBeInTheDocument();

    // Click delete
    fireEvent.click(screen.getByText("❌"));

    // Wait for it to disappear
    await waitFor(() => {
      expect(screen.queryByText("Delete Me")).not.toBeInTheDocument();
    });
  });
});
