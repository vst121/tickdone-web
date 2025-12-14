# TickDone Web

A modern, responsive Todo web application built with React, TypeScript, and Vite. Manage your tasks efficiently with deadlines, status tracking, and filtering capabilities.

## Features

- ✅ **Add Todos**: Create new tasks with optional deadlines
- 📅 **Deadline Management**: Set and track due dates for your tasks
- 🔄 **Status Toggle**: Mark tasks as complete or incomplete
- 🗑️ **Delete with Confirmation**: Safely remove tasks with a confirmation dialog
- 🔍 **Filtering**: View all, active, or completed tasks
- ⚠️ **Overdue Detection**: Automatically highlight overdue tasks
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- ⚡ **Fast Performance**: Built with Vite for lightning-fast development and builds

## Tech Stack

- **Frontend**: React 19, TypeScript
- **Build Tool**: Vite
- **Styling**: CSS Modules
- **Linting**: ESLint with TypeScript support

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- pnpm (recommended) or npm

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd tickdone-web
   ```

2. Install dependencies:

   ```bash
   pnpm install
   # or
   npm install
   ```

3. Start the development server:

   ```bash
   pnpm dev
   # or
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
pnpm build
# or
npm run build
```

### Preview Production Build

```bash
pnpm preview
# or
npm run preview
```

## API Integration

This frontend application expects a REST API backend running on the same domain with the following endpoints:

- `GET /todos` - Fetch all todos
- `POST /todos` - Create a new todo
- `PUT /todos/:id` - Update a todo
- `DELETE /todos/:id` - Delete a todo

### Todo Object Structure

```typescript
interface Todo {
  id: number;
  taskName: string;
  deadline: string | null; // ISO date string
  done: boolean;
}
```

## Project Structure

```
tickdone-web/
├── public/
│   └── vite.svg
├── src/
│   ├── assets/
│   │   └── react.svg
│   ├── components/
│   │   └── Todo/
│   │       ├── Todo.tsx
│   │       └── Todo.css
│   └── main.tsx
├── package.json
├── vite.config.ts
└── README.md
```

## Scripts

- `dev` - Start development server
- `build` - Build for production
- `lint` - Run ESLint
- `preview` - Preview production build

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run linting: `pnpm lint`
5. Commit your changes
6. Push to the branch
7. Open a Pull Request

## Screenshot

![Main Page](docs/Screenshot.png)

This project is private and not licensed for public use.

## License

This project is private and not licensed for public use.
