#!/bin/bash

# Script to recover FULL commit history (individual commits preserved)
# Usage: ./recover-history-full.sh <client-repo-url> <webapi-repo-url>
# Example: ./recover-history-full.sh https://github.com/user/JobApplicationTracker.Client.git https://github.com/user/JobApplicationTracker.WebApi.git

set -e

CLIENT_REPO_URL=$1
WEBAPI_REPO_URL=$2

if [ -z "$CLIENT_REPO_URL" ] || [ -z "$WEBAPI_REPO_URL" ]; then
    echo "Usage: $0 <client-repo-url> <webapi-repo-url>"
    echo "Example: $0 https://github.com/user/JobApplicationTracker.Client.git https://github.com/user/JobApplicationTracker.WebApi.git"
    exit 1
fi

echo "This script will merge the FULL commit history from both repositories."
echo "All individual commits will be preserved."
echo "Press Ctrl+C to cancel, or Enter to continue..."
read

# Get the current directory
MAIN_REPO_DIR=$(pwd)

# Create temporary directories
TEMP_DIR=$(mktemp -d)
echo "Using temporary directory: $TEMP_DIR"

# Clone the client repository
echo "Cloning Client repository..."
cd "$TEMP_DIR"
git clone "$CLIENT_REPO_URL" client-repo

# Clone the WebApi repository
echo "Cloning WebApi repository..."
git clone "$WEBAPI_REPO_URL" webapi-repo

# Go back to main repo
cd "$MAIN_REPO_DIR"

# Check if we're in a git repo
if [ ! -d ".git" ]; then
    echo "Error: Not in a git repository. Initializing..."
    git init
fi

# Backup existing directories
if [ -d "JobApplicationTracker.Client" ]; then
    echo "Backing up existing Client directory..."
    mv JobApplicationTracker.Client JobApplicationTracker.Client.backup.$(date +%Y%m%d_%H%M%S)
fi

if [ -d "JobApplicationTracker.WebApi" ]; then
    echo "Backing up existing WebApi directory..."
    mv JobApplicationTracker.WebApi JobApplicationTracker.WebApi.backup.$(date +%Y%m%d_%H%M%S)
fi

# Prepare Client repo: rewrite history to put files in subdirectory
echo "Preparing Client repository history..."
cd "$TEMP_DIR/client-repo"

# Use git filter-repo if available, otherwise use filter-branch
if command -v git-filter-repo &> /dev/null; then
    echo "Using git-filter-repo (recommended)..."
    git filter-repo --to-subdirectory-filter JobApplicationTracker.Client
else
    echo "Using git filter-branch (git-filter-repo not found)..."
    git filter-branch --prune-empty --tree-filter '
        mkdir -p JobApplicationTracker.Client
        git ls-files -z | xargs -0 -I {} git mv {} JobApplicationTracker.Client/ 2>/dev/null || true
    ' -- --all
fi

# Prepare WebApi repo: rewrite history to put files in subdirectory
echo "Preparing WebApi repository history..."
cd "$TEMP_DIR/webapi-repo"

if command -v git-filter-repo &> /dev/null; then
    echo "Using git-filter-repo (recommended)..."
    git filter-repo --to-subdirectory-filter JobApplicationTracker.WebApi
else
    echo "Using git filter-branch (git-filter-repo not found)..."
    git filter-branch --prune-empty --tree-filter '
        mkdir -p JobApplicationTracker.WebApi
        git ls-files -z | xargs -0 -I {} git mv {} JobApplicationTracker.WebApi/ 2>/dev/null || true
    ' -- --all
fi

# Go back to main repo
cd "$MAIN_REPO_DIR"

# If main repo has no commits, initialize with first repo
if [ -z "$(git log --all 2>/dev/null | head -1)" ]; then
    echo "Main repo is empty. Initializing with Client repository..."
    git remote add client-repo "$TEMP_DIR/client-repo"
    git fetch client-repo
    git merge --allow-unrelated-histories client-repo/main -m "Initial commit: Import Client repository with full history"
    
    echo "Adding WebApi repository..."
    git remote add webapi-repo "$TEMP_DIR/webapi-repo"
    git fetch webapi-repo
    git merge --allow-unrelated-histories webapi-repo/main -m "Merge WebApi repository with full history"
else
    # Main repo has commits, merge both
    echo "Merging Client repository..."
    git remote add client-repo "$TEMP_DIR/client-repo" 2>/dev/null || true
    git fetch client-repo
    git merge --allow-unrelated-histories client-repo/main -m "Merge Client repository with full history"
    
    echo "Merging WebApi repository..."
    git remote add webapi-repo "$TEMP_DIR/webapi-repo" 2>/dev/null || true
    git fetch webapi-repo
    git merge --allow-unrelated-histories webapi-repo/main -m "Merge WebApi repository with full history"
fi

# Cleanup remotes
git remote remove client-repo 2>/dev/null || true
git remote remove webapi-repo 2>/dev/null || true

# Cleanup
echo "Cleaning up temporary files..."
rm -rf "$TEMP_DIR"

echo ""
echo "✓ Full history recovery complete!"
echo ""
echo "All individual commits from both repositories have been preserved."
echo ""
echo "You can now:"
echo "  git log --all --graph --oneline                    # View the combined history"
echo "  git log -- JobApplicationTracker.Client/           # View Client history"
echo "  git log -- JobApplicationTracker.WebApi/           # View WebApi history"
echo "  git push origin main                               # Push to remote"
