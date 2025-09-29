# make-pr

Automatically generate draft pull requests with intelligent content analysis.

## Usage

```
/make-pr
```

## Purpose

- Ensure PR template content is properly filled with meaningful information
- Minimize time spent on PR creation while maintaining quality  
- Improve reviewer readability by providing clear, structured PR descriptions
- Reduce manual effort in PR writing process

## Command Execution Rules

- Only run when current branch is NOT `main`
- If on `main` branch, show error: "Cannot create PR from main branch"

## Base Branch Logic

- If current branch has a base branch other than main, use the closest non-main branch as base
- Otherwise, use `main` as base branch

## PR Title Generation

Generate titles based on branch analysis using these prefixes:

- **feat**: New features, updates, output-changing code, agent rules/commands, utils
- **config**: prettier, eslint, ci/cd, dependency installs/bumps, docker, vscode settings  
- **refactor**: lint fixes, prettier fixes, output-unchanged code improvements
- **fix**: bug fixes, correcting mistakes
- **test**: separate test PRs, storybook, .test file additions

Note: Use `config` instead of `chore` (chore implies unimportance)

## PR Body Content Generation

Analyze `git diff` between current HEAD and base branch:

### Requirement Section
- Extract issue number from branch name (e.g., `i38` → `resolves #38`)
- Infer requirements from branch name and commit messages

### Implementation Section  
- Generate from commit message analysis and code changes

### Test Section
- Check for storybook, .test files
- Leave empty if no test files found

### Context Section (optional)
- Extract from code comments, especially `@context`, `@see` tags
- Look for contextual comments even without specific tags

### References Section (optional)
- Extract URLs and `@see` references from comments
- Include related documentation links
- Include OTHER related issues (not the current issue being resolved)
- Leave empty if no other related issues exist

### Human Check Section
- Always add human verification section at the end:
```markdown
## Human Check 
~~🤖 Generated with [Claude Code](https://claude.ai/code)~~
- [ ] I reviewed it 
```

## PR Creation Process

1. Analyze current branch and generate PR content
2. **Show PR content to user for review/approval**  
3. Create draft PR using `gh` CLI
4. Open PR in browser with `gh pr view --web`

## Safety & Quality Rules

- Create as DRAFT PR to prevent accidental merging
- NO hallucination - only use actual diff analysis
- If information is missing, ASK the user questions
- Don't make assumptions beyond what's in the code/commits

## Technical Requirements

- Use `gh` (GitHub CLI) for PR operations
- If GitHub CLI not installed, guide user to install via brew
- Validate git status and branch information before proceeding

## Workflow Example

```bash
# User runs command
/make-pr

# System analyzes branch, commits, and code
# Shows generated PR content for review
# User approves/modifies content  
# Creates draft PR and opens in browser
```