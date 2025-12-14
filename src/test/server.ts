import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'

const API_URL : string | undefined = process.env.VITE_API_URL

interface Todo {
  id: number;
  taskName: string;
  deadline: string | null;
  done: boolean;
}

interface CreateTodoRequest {
  taskName: string;
  deadline: string | null;
}

interface UpdateTodoRequest {
  taskName?: string;
  deadline?: string | null;
  done?: boolean;
}

const initialTodos: Todo[] = [
  { id: 1, taskName: 'Test Todo 1', deadline: null, done: false },
  { id: 2, taskName: 'Test Todo 2', deadline: '2025-12-15T10:00:00.000Z', done: true },
]

let todos: Todo[] = [...initialTodos]

export const resetTodos = (): void => {
  todos = [...initialTodos]
}

export const handlers = [
  http.get(`${API_URL}/todos`, (): HttpResponse<Todo[]> => {
    return HttpResponse.json(todos)
  }),

  http.post(`${API_URL}/todos`, async ({ request }): Promise<HttpResponse<Todo>> => {
    const body = await request.json() as CreateTodoRequest
    const newTodo: Todo = {
      id: Date.now(),
      taskName: body.taskName,
      deadline: body.deadline,
      done: false,
    }
    todos.push(newTodo)
    return HttpResponse.json(newTodo)
  }),

  http.put(`${API_URL}/todos/:id`, async ({ params, request }): Promise<HttpResponse<Todo>> => {
    const { id } = params as { id: string }
    const updates = await request.json() as UpdateTodoRequest
    const todoIndex = todos.findIndex(t => t.id === parseInt(id, 10))
    if (todoIndex === -1) {
      return new HttpResponse(null, { status: 404 })
    }
    todos[todoIndex] = { ...todos[todoIndex], ...updates }
    return HttpResponse.json(todos[todoIndex])
  }),

  http.delete(`${API_URL}/todos/:id`, ({ params }): HttpResponse<null> => {
    const { id } = params as { id: string }
    const todoIndex = todos.findIndex(t => t.id === parseInt(id, 10))
    if (todoIndex === -1) {
      return new HttpResponse(null, { status: 404 })
    }
    todos.splice(todoIndex, 1)
    return new HttpResponse(null, { status: 200 })
  }),
]

export const server = setupServer(...handlers)