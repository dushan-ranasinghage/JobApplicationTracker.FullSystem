# Guide: Preserving Commit History When Merging Repositories

## Method 1: Using `git subtree` (Recommended)

This method preserves the complete commit history from both repositories.

### Steps:

1. **Add the first repository as a subtree:**
```bash
git subtree add --prefix=JobApplicationTracker.Client \
  <client-repo-url> main --squash
```

2. **Add the second repository as a subtree:**
```bash
git subtree add --prefix=JobApplicationTracker.WebApi \
  <webapi-repo-url> main --squash
```

**Note:** The `--squash` flag combines all commits into one, but you can omit it to preserve individual commits.

## Method 2: Using `git filter-branch` or `git filter-repo` (Preserves Individual Commits)

This method rewrites history to move all files into subdirectories while preserving individual commits.

### Steps:

1. **Clone the first repository:**
```bash
git clone <client-repo-url> temp-client
cd temp-client
git filter-branch --prune-empty --subdirectory-filter . \
  -- --all
```

2. **Move files to subdirectory:**
```bash
mkdir -p JobApplicationTracker.Client
git mv * JobApplicationTracker.Client/
git commit -m "Move client files to subdirectory"
```

3. **Add as remote and merge:**
```bash
cd /path/to/main/repo
git remote add client-repo /path/to/temp-client
git fetch client-repo
git merge --allow-unrelated-histories client-repo/main
```

4. **Repeat for the second repository**

## Method 3: Manual History Preservation (Current Situation)

Since the .git directories were already removed, you have these options:

### Option A: Recover from Remote Repositories
If the original repositories still exist on GitHub/GitLab/etc:

```bash
# Clone the original repos temporarily
git clone <client-repo-url> temp-client
git clone <webapi-repo-url> temp-webapi

# Use git subtree to merge them
cd /path/to/main/repo
git subtree add --prefix=JobApplicationTracker.Client \
  ../temp-client main

git subtree add --prefix=JobApplicationTracker.WebApi \
  ../temp-webapi main
```

### Option B: Start Fresh (Current State)
If you don't need the old history, you can simply commit everything as a new initial commit:

```bash
git add .
git commit -m "Initial commit: Combined JobApplicationTracker projects"
```

## Recommendation

If you have access to the original repositories, use **Method 3 - Option A** to preserve all commit history.
