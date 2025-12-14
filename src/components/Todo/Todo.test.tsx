import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Todo from "./Todo";
import { resetTodos } from "../../test/server";

describe("Todo Component", () => {
  beforeEach(() => {
    resetTodos();
  });

  it("renders loading state initially", () => {
    render(<Todo />);
    expect(screen.getByText("Loading your todos...")).toBeInTheDocument();
  });

  it("renders todos after loading", async () => {
    render(<Todo />);

    await waitFor(() => {
      expect(screen.getByText("Test Todo 1")).toBeInTheDocument();
    });

    expect(screen.getByText("Test Todo 2")).toBeInTheDocument();
  });

  it("adds a new todo", async () => {
    const user = userEvent.setup();
    render(<Todo />);

    await waitFor(() => {
      expect(screen.getByText("Test Todo 1")).toBeInTheDocument();
    });

    const input = screen.getByPlaceholderText("What needs to be done?");
    const addButton = screen.getByRole("button", { name: /add/i });

    await user.type(input, "New Todo");
    await user.click(addButton);

    await waitFor(() => {
      expect(screen.getByText("New Todo")).toBeInTheDocument();
    });
  });

  it("toggles todo completion", async () => {
    const user = userEvent.setup();
    render(<Todo />);

    await waitFor(() => {
      expect(screen.getByText("Test Todo 1")).toBeInTheDocument();
    });

    const checkboxes = screen.getAllByRole("checkbox", {
      name: /mark as complete/i,
    });
    const checkbox = checkboxes[0]; // First one for Test Todo 1
    await user.click(checkbox);

    // After toggle, it should be marked as done
    expect(checkbox).toBeChecked();
  });

  // it("deletes a todo", async () => {
  //   const user = userEvent.setup();
  //   render(<Todo />);

  //   await waitFor(() => {
  //     expect(screen.getByText("Test Todo 1")).toBeInTheDocument();
  //   });

  //   const deleteButton = screen.getAllByRole("button", { name: /🗑️/i })[0];
  //   await user.click(deleteButton);

  //   // Confirm dialog appears
  //   expect(screen.getByText("Delete Todo")).toBeInTheDocument();

  //   const confirmButton = screen.getByRole("button", { name: /delete/i });
  //   await user.click(confirmButton);

  //   await waitFor(() => {
  //     expect(screen.queryByText("Test Todo 1")).not.toBeInTheDocument();
  //   });
  // });

  it("filters todos", async () => {
    const user = userEvent.setup();
    render(<Todo />);

    await waitFor(() => {
      expect(screen.getByText("Test Todo 1")).toBeInTheDocument();
    });

    // Click Completed filter
    const completedFilter = screen.getByRole("button", { name: /completed/i });
    await user.click(completedFilter);

    expect(screen.getByText("Test Todo 2")).toBeInTheDocument();
    expect(screen.queryByText("Test Todo 1")).not.toBeInTheDocument();
  });

  it("shows items left count", async () => {
    render(<Todo />);

    await waitFor(() => {
      expect(screen.getByText("Test Todo 1")).toBeInTheDocument();
    });

    expect(screen.getByText("1 item left.")).toBeInTheDocument();
  });
});
