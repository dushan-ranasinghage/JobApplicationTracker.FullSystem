# Job Application Tracker

A full-stack application for tracking job applications, built with React (TypeScript) and ASP.NET Core Web API.

## Quick Start

Run the shell script:
```bash
./start-dev.sh
```

Or use npm:
```bash
npm install  # First time only
npm run dev
```

Both will install dependencies, set up the database, and start both servers. Open `http://localhost:5173` when ready.

## Project Structure

```
JobApplicationTracker.FullSystem/
├── JobApplicationTracker.Client/    # React frontend application
└── JobApplicationTracker.WebApi/     # ASP.NET Core Web API backend
```

## Prerequisites

- Node.js v18+ and npm
- .NET SDK 10.0+
- SQLite (comes with .NET)

## Manual Setup

If you want to run things separately:

**Backend:**
```bash
cd JobApplicationTracker.WebApi
dotnet restore
dotnet ef database update
dotnet run --launch-profile https
```

API runs on `https://localhost:7223` (Swagger at `/swagger`)

**Frontend:**
```bash
cd JobApplicationTracker.Client
npm install
npm run dev
```

Client runs on `http://localhost:5173`

To change the API URL, create a `.env` file in the Client directory with `VITE_API_BASE_URL=https://localhost:7223/api`

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

## Notes

- SQLite database file is at `JobApplicationTracker.WebApi/sqlite.db`
- Backend uses HTTPS on port 7223. If you get certificate errors, run `dotnet dev-certs https --trust`
- No authentication implemented yet - would need to add for production
- API base URL defaults to `https://localhost:7223/api` (override with `VITE_API_BASE_URL` env var)

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

- **CORS errors**: Make sure backend and frontend are on the right ports
- **Database issues**: Run `dotnet ef database update` in the WebApi directory
- **HTTPS certificate errors**: Run `dotnet dev-certs https --trust` or use HTTP profile
- **API connection**: Check `VITE_API_BASE_URL` env var and Vite proxy config

## License

Copyright 2026 - JobApplicationTracker All Rights Reserved.
