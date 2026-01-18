# Job Application Tracker

A full-stack application for tracking job applications, built with React (TypeScript) and ASP.NET Core Web API.

## Quick Start

### Option 1: Automated Setup (Recommended)

**Step 1:** Open a terminal/command prompt in the project root directory:
```
JobApplicationTracker.FullSystem/
```

**Step 2:** Run the shell script:
```bash
./start-dev.sh
```

**What this script does:**
- Downloads and installs all dependencies (Node.js packages for the frontend and .NET packages for the backend)
- Sets up the database (creates SQLite database and applies migrations)
- Starts both servers automatically:
  - Backend API server on `http://localhost:5069`
  - Frontend React app on `http://localhost:5173`

**Step 3:** Once the script finishes, open your web browser and go to:
```
http://localhost:5173
```

**Note:** The script will keep running in the terminal. Press `Ctrl+C` to stop both servers when you're done.

### Option 2: Manual Setup

If you prefer to run things separately, see the [Manual Setup](#manual-setup) section below.

## Project Structure

```
JobApplicationTracker.FullSystem/
├── JobApplicationTracker.Client/    # React frontend application
└── JobApplicationTracker.WebApi/     # ASP.NET Core Web API backend
```

## Prerequisites

Before running the setup script, make sure you have the following installed:

- **Node.js v18 or higher** and npm (used for the React frontend)
- **.NET SDK 10.0** (used for the ASP.NET Core backend)

## Manual Setup

If you want to run things separately instead of using the automated script:

### Backend Setup

**Step 1:** Open a terminal/command prompt and navigate to the backend directory:
```bash
cd JobApplicationTracker.WebApi
```

**Step 2:** Install .NET dependencies:
```bash
dotnet restore
```

**Step 3:** Set up the database:
```bash
dotnet ef database update
```

**Step 4:** Start the backend server:
```bash
dotnet run --launch-profile http
```

**Step 5:** The API will be running on `http://localhost:5069` (Swagger documentation available at `http://localhost:5069/swagger`)

**Note:** The default profile uses HTTP to avoid SSL certificate issues. To use HTTPS, run with `--launch-profile https` (requires trusted dev certificate: `dotnet dev-certs https --trust`)

### Frontend Setup

**Step 1:** Open a **new** terminal/command prompt window (keep the backend running in the first terminal) and navigate to the frontend directory:
```bash
cd JobApplicationTracker.Client
```

**Step 2:** Install Node.js dependencies (first time only):
```bash
npm install
```

**Step 3:** Start the frontend development server:
```bash
npm run dev
```

**Step 4:** The client will be running on `http://localhost:5173` - open this URL in your web browser

**API Configuration:**
- Default in development: Uses `http://localhost:5069/api` (HTTP) to avoid SSL certificate issues
- To use HTTPS, create a `.env` file in the Client directory with `VITE_API_BASE_URL=https://localhost:7223/api`
- The client automatically uses HTTP in development mode to prevent SSL certificate blocking

## Architecture

### Backend

- **Repository Pattern** - Data access separated from business logic via `IJobApplicationRepository`
- **Service Layer** - Business logic in services, controllers stay thin
- **DTOs** - Separate DTOs for API contracts (`JobApplicationDto`, `CreateJobApplicationDto`, etc.)
- **Global Exception Handling** - `GlobalExceptionHandlingMiddleware` handles all errors consistently
- **SQLite** - Simple file-based database, migrations via EF Core
- **CORS** - Specific origin policy for `localhost:5173` only
- **Test Project** - Kept inside WebApi directory since it's a small app. Ideally 2 projects in root: WebApi + Tests

### Frontend

- **Redux Toolkit** - State management with separate slices for `jobApplications` and `preferences`
- **Redux Persist** - Only preferences persisted to localStorage, job apps always fresh from API
- **Axios Client** - Centralized API client with interceptors for error handling
- **Material-UI** - UI component library
- **Module Architecture** - Feature-based modules (e.g., `JobApplications`) with their own components, hooks, and utils
- **Module Loader** - Each module has a `ModuleLoader` that handles all data fetching (Redux actions, API calls, polling). Keeps main components focused on rendering
- **TypeScript + ESLint + Prettier** - Type safety and code quality tools configured
- **Vite Proxy** - Dev server proxies `/api` requests to backend to avoid CORS issues

## Assumptions

- **Development Environment** - Configured for local development with fixed ports (7223 for API, 5173 for client)
- **Database** - SQLite chosen for simplicity. File-based, no separate database server needed
- **Authentication** - No user login or authentication implemented. Would need to add auth/authorization for production
- **Testing** - Only core business logic is tested in both API and client app
- **Error Handling** - Basic error handling in place. Backend errors logged, frontend shows console errors. Production would need better user feedback
- **API Design** - RESTful API with standard HTTP methods. Swagger available in development mode
- **Frontend** - Single Page Application (SPA) with client-side routing. No server-side rendering
- **Generic Repositories** - Didn't use generic repositories as there is only one controller

## Notes

- SQLite database file is at `JobApplicationTracker.WebApi/sqlite.db`
- **Default configuration uses HTTP** (port 5069) to avoid SSL certificate issues in development
- To use HTTPS, run API with `--launch-profile https` and set `VITE_API_BASE_URL=https://localhost:7223/api` in Client `.env` file
- If you get HTTPS certificate errors, run `dotnet dev-certs https --trust` (or just use HTTP profile)
- No authentication implemented yet - would need to add for production
- API base URL defaults to `http://localhost:5069/api` in development (override with `VITE_API_BASE_URL` env var)

## Database

SQLite with EF Core. To apply migrations:
```bash
cd JobApplicationTracker.WebApi
dotnet ef database update
```

To create a new migration:
```bash
dotnet ef migrations add MigrationName
```

## Testing

**Backend:**
```bash
cd JobApplicationTracker.WebApi.Tests
dotnet test
```

**Frontend:**
```bash
cd JobApplicationTracker.Client
npm test
```

## Production Build

**Client:**
```bash
cd JobApplicationTracker.Client
npm run build
```

**Web API:**
```bash
cd JobApplicationTracker.WebApi
dotnet publish -c Release
```

## Troubleshooting

- **API connection failures / HTTPS blocked**: The project is configured to use HTTP by default. If you're still having issues:
  - Make sure the API is running on `http://localhost:5069` (use `--launch-profile http`)
  - Check that the client is using `http://localhost:5069/api` (default in development)
  - If using HTTPS, ensure certificate is trusted: `dotnet dev-certs https --trust`
- **CORS errors**: Make sure backend and frontend are on the right ports. CORS is configured for common development ports
- **Database issues**: Run `dotnet ef database update` in the WebApi directory
- **API connection**: Check `VITE_API_BASE_URL` env var and Vite proxy config in `vite.config.ts`

## License

Copyright 2026 - JobApplicationTracker All Rights Reserved.
