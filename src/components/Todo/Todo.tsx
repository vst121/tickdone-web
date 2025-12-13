import { useState, useEffect } from "react";

interface Todo {
  id: number;
  taskName: string;
  deadline: string | null;
  done: boolean;
}

function Todo() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTask, setNewTask] = useState("");
  const [newDeadline, setNewDeadline] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const API_URL: string = import.meta.env.VITE_API_URL;
  console.log("API_URL:", API_URL);

  useEffect(() => {
    fetch(`${API_URL}/todos`)
      .then((res) => res.json())
      .then((data) => {
        setTodos(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching todos:", err);
        setError("An unexpected error occurred while fetching the todos.");
        setTodos([]);
        setLoading(false);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    setError(null);

    const newTodoData = {
      taskName: newTask.trim(),
      deadline: newDeadline ? new Date(newDeadline).toISOString() : null,
    };

    try {
      const response = await fetch(`${API_URL}/todos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTodoData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || "Failed to create todo");
        return;
      }
      const createdTodo = await response.json();
      setTodos((prev) => [...prev, createdTodo]);
      setNewTask("");
      setNewDeadline("");
    } catch (err) {
      console.error("Error creating todo:", err);
      setError("An unexpected error occurred while creating the todo.");
    }
  };

  const handleDelete = (id: number) => {
    setDeleteId(id);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;

    setError(null);

    try {
      const response = await fetch(`${API_URL}/todos/${deleteId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete todo");
      }
      setTodos((prev) => prev.filter((todo) => todo.id !== deleteId));
      setDeleteId(null);
    } catch (err) {
      console.error("Error deleting todo:", err);
      setError("Failed to delete todo");
      setDeleteId(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteId(null);
  };

  const handleDoneToggle = async (id: number) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    setError(null);

    const updatedDone = !todo.done;

    try {
      const response = await fetch(`${API_URL}/todos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...todo, done: updatedDone }),
      });
      if (!response.ok) {
        throw new Error("Failed to update todo");
      }
      const updatedTodo = await response.json();
      setTodos((prev) => prev.map((t) => (t.id === id ? updatedTodo : t)));
    } catch (err) {
      console.error("Error updating todo:", err);
      setError("Failed to update todo");
    }
  };

  const isOverdue = (todo: Todo) => {
    return todo.deadline && new Date(todo.deadline) < new Date() && !todo.done;
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === "all") return true;
    if (filter === "active") return !todo.done && !isOverdue(todo);
    if (filter === "completed") return todo.done;
    return true;
  });

  const itemsLeft = filteredTodos.length;

  if (loading) {
    return (
      <div className="todo-container">
        <div className="loading">Loading your todos...</div>
      </div>
    );
  }

  return (
    <>
      <div className="todo-container">
        <h1>Todos</h1>
        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit} className="todo-form">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="What needs to be done?"
            required
          />
          <input
            type="datetime-local"
            value={newDeadline}
            onChange={(e) => setNewDeadline(e.target.value)}
            title="Set a deadline"
          />
          <button type="submit">Add</button>
        </form>

        {filteredTodos.length === 0 ? (
          <div className="empty-state">
            <div>No todos yet!</div>
          </div>
        ) : (
          <div className="todo-list">
            {filteredTodos.map((todo) => (
              <div
                key={todo.id}
                className={`todo-item ${isOverdue(todo) ? "overdue" : ""} ${
                  todo.done ? "done" : ""
                }`}
              >
                <input
                  type="checkbox"
                  className="todo-checkbox"
                  checked={todo.done}
                  onChange={() => handleDoneToggle(todo.id)}
                  title={todo.done ? "Mark as incomplete" : "Mark as complete"}
                />
                <div className="todo-content">
                  <div className="todo-title">{todo.taskName}</div>
                  <div className="todo-deadline">
                    {todo.deadline
                      ? `📅 ${new Date(todo.deadline).toLocaleString()}`
                      : "📅 No deadline"}
                  </div>
                </div>
                <div className="todo-actions">
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(todo.id)}
                    title="Delete todo"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        {todos.length > 0 && (
          <div className="footer">
            <span>
              {itemsLeft} item{itemsLeft !== 1 ? "s" : ""} left.
            </span>
            <div className="filters">
              <button
                onClick={() => setFilter("all")}
                className={filter === "all" ? "active" : ""}
              >
                All
              </button>
              <button
                onClick={() => setFilter("active")}
                className={filter === "active" ? "active" : ""}
              >
                Active
              </button>
              <button
                onClick={() => setFilter("completed")}
                className={filter === "completed" ? "active" : ""}
              >
                Completed
              </button>
            </div>
          </div>
        )}
      </div>
      {deleteId && (
        <div className="confirm-dialog-overlay">
          <div className="confirm-dialog">
            <h3>Delete Todo</h3>
            <p>Are you sure you want to delete this todo?</p>
            <div className="confirm-dialog-actions">
              <button onClick={handleCancelDelete} className="cancel-btn">
                Cancel
              </button>
              <button onClick={handleConfirmDelete} className="confirm-btn">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Todo;
