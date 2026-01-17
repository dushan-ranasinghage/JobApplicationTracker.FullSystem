#!/bin/bash

# Script to recover commit history from separate repositories
# Usage: ./recover-history.sh <client-repo-url> <webapi-repo-url>
# Example: ./recover-history.sh https://github.com/user/JobApplicationTracker.Client.git https://github.com/user/JobApplicationTracker.WebApi.git

set -e

CLIENT_REPO_URL=$1
WEBAPI_REPO_URL=$2

if [ -z "$CLIENT_REPO_URL" ] || [ -z "$WEBAPI_REPO_URL" ]; then
    echo "Usage: $0 <client-repo-url> <webapi-repo-url>"
    echo "Example: $0 https://github.com/user/JobApplicationTracker.Client.git https://github.com/user/JobApplicationTracker.WebApi.git"
    exit 1
fi

echo "This script will merge the commit history from both repositories into this combined repo."
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

# Remove existing directories if they exist (backup first)
if [ -d "JobApplicationTracker.Client" ]; then
    echo "Backing up existing Client directory..."
    mv JobApplicationTracker.Client JobApplicationTracker.Client.backup
fi

if [ -d "JobApplicationTracker.WebApi" ]; then
    echo "Backing up existing WebApi directory..."
    mv JobApplicationTracker.WebApi JobApplicationTracker.WebApi.backup
fi

# Method 1: Using git subtree (preserves history, squashes commits)
echo "Adding Client repository as subtree..."
git subtree add --prefix=JobApplicationTracker.Client "$TEMP_DIR/client-repo" main --squash

echo "Adding WebApi repository as subtree..."
git subtree add --prefix=JobApplicationTracker.WebApi "$TEMP_DIR/webapi-repo" main --squash

# Alternative Method 2: Preserve individual commits (uncomment to use instead)
# echo "Adding Client repository with full history..."
# git remote add client-repo "$TEMP_DIR/client-repo"
# git fetch client-repo
# git merge --allow-unrelated-histories client-repo/main -m "Merge Client repository with full history"
# 
# echo "Adding WebApi repository with full history..."
# git remote add webapi-repo "$TEMP_DIR/webapi-repo"
# git fetch webapi-repo
# git merge --allow-unrelated-histories webapi-repo/main -m "Merge WebApi repository with full history"
# 
# # Move files to subdirectories if needed
# mkdir -p JobApplicationTracker.Client
# git mv <client-files> JobApplicationTracker.Client/
# git commit -m "Move Client files to subdirectory"
# 
# mkdir -p JobApplicationTracker.WebApi
# git mv <webapi-files> JobApplicationTracker.WebApi/
# git commit -m "Move WebApi files to subdirectory"

# Cleanup
echo "Cleaning up temporary files..."
rm -rf "$TEMP_DIR"

echo ""
echo "✓ History recovery complete!"
echo ""
echo "Note: If you used --squash, commits are combined. To preserve individual commits,"
echo "use the alternative method (see comments in script)."
echo ""
echo "You can now:"
echo "  git log --all --graph --oneline  # View the combined history"
echo "  git push origin main              # Push to remote"
