#!/bin/bash

# Script to start both the Web API and React Client simultaneously
# Usage: ./start-dev.sh

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${BLUE}Starting Job Application Tracker Development Environment...${NC}\n"

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo -e "${CYAN}Checking prerequisites...${NC}"

if ! command_exists node; then
    echo -e "${YELLOW}Error: Node.js is not installed. Please install Node.js v18 or higher.${NC}"
    exit 1
fi

if ! command_exists dotnet; then
    echo -e "${YELLOW}Error: .NET SDK is not installed. Please install .NET SDK 10.0 or higher.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Prerequisites check passed${NC}\n"

# Setup Client Dependencies
echo -e "${CYAN}Setting up React Client dependencies...${NC}"
cd "$SCRIPT_DIR/JobApplicationTracker.Client"

if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}node_modules not found. Installing dependencies...${NC}"
    if npm install; then
        echo -e "${GREEN}✓ Client dependencies installed${NC}\n"
    else
        echo -e "${YELLOW}Error: Failed to install client dependencies${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✓ Client dependencies already installed${NC}\n"
fi

# Setup Web API Dependencies
echo -e "${CYAN}Setting up Web API dependencies...${NC}"
cd "$SCRIPT_DIR/JobApplicationTracker.WebApi"

# Check if dotnet restore is needed by checking for project.assets.json
if [ ! -f "obj/project.assets.json" ]; then
    echo -e "${YELLOW}Restoring .NET dependencies...${NC}"
    if dotnet restore; then
        echo -e "${GREEN}✓ Web API dependencies restored${NC}\n"
    else
        echo -e "${YELLOW}Error: Failed to restore .NET dependencies${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✓ Web API dependencies already restored${NC}\n"
fi

# Setup Database (non-critical - database will be created on first API run if this fails)
echo -e "${CYAN}Setting up database...${NC}"
if [ ! -f "sqlite.db" ]; then
    echo -e "${YELLOW}Database not found. Creating database and applying migrations...${NC}"
    if dotnet ef database update 2>/dev/null; then
        echo -e "${GREEN}✓ Database created and migrations applied${NC}\n"
    else
        echo -e "${YELLOW}Note: Could not apply migrations now. Database will be created automatically on first API run.${NC}\n"
    fi
else
    echo -e "${YELLOW}Ensuring database is up to date...${NC}"
    if dotnet ef database update 2>/dev/null; then
        echo -e "${GREEN}✓ Database is up to date${NC}\n"
    else
        echo -e "${YELLOW}Note: Could not verify migrations. Continuing anyway...${NC}\n"
    fi
fi

# Function to cleanup on exit
cleanup() {
    echo -e "\n${YELLOW}Shutting down servers...${NC}"
    kill $API_PID $CLIENT_PID 2>/dev/null || true
    exit
}

# Trap Ctrl+C and call cleanup
trap cleanup INT TERM

echo -e "${BLUE}Starting servers...${NC}\n"

# Start the Web API (using HTTP profile to avoid SSL certificate issues)
echo -e "${GREEN}Starting Web API...${NC}"
cd "$SCRIPT_DIR/JobApplicationTracker.WebApi"
dotnet run --launch-profile http > /tmp/job-tracker-api.log 2>&1 &
API_PID=$!

# Wait a bit for the API to start
sleep 3

# Check if API started successfully
if ! kill -0 $API_PID 2>/dev/null; then
    echo -e "${YELLOW}API failed to start. Check /tmp/job-tracker-api.log for details${NC}"
    exit 1
fi

echo -e "${GREEN}Web API started (PID: $API_PID)${NC}"
echo -e "${BLUE}API running at: http://localhost:5069${NC}\n"

# Start the React Client
echo -e "${GREEN}Starting React Client...${NC}"
cd "$SCRIPT_DIR/JobApplicationTracker.Client"
npm run dev > /tmp/job-tracker-client.log 2>&1 &
CLIENT_PID=$!

# Wait a bit for the client to start
sleep 3

# Check if client started successfully
if ! kill -0 $CLIENT_PID 2>/dev/null; then
    echo -e "${YELLOW}Client failed to start. Check /tmp/job-tracker-client.log for details${NC}"
    kill $API_PID 2>/dev/null || true
    exit 1
fi

echo -e "${GREEN}React Client started (PID: $CLIENT_PID)${NC}"
echo -e "${BLUE}Client running at: http://localhost:5173${NC}\n"

echo -e "${GREEN}✓ Both servers are running!${NC}"
echo -e "${YELLOW}Press Ctrl+C to stop both servers${NC}\n"

# Wait for both processes
wait $API_PID $CLIENT_PID
