---
description: "Analyze changes and create meaningful commits with requirement and implementation details"
allowed-tools:
  - Bash
---

# Commit Command

Analyze git changes (staged and unstaged) and create well-structured commits.

## Instructions

1. **Analyze all changes**:
   - Check both staged (`git diff --cached`) and unstaged (`git diff`) changes
   - Get the list of modified files (`git status`)

2. **Group files by intent and purpose**:
   - Identify distinct concerns that should be separate commits
   - Group files that share the same purpose/intent
   - Consider: feature additions, config changes, refactoring, bug fixes, tests

3. **For each commit group, determine**:
   - **Type prefix** (choose one):
     * `feat`: New features, updates, output-changing code
     * `fix`: Bug fixes, correcting mistakes
     * `doc`: Documentation changes
     * `config`: prettier, eslint, ci/cd, dependency installs/bumps, docker, vscode settings
     * `refactor`: Lint fixes, prettier fixes, output-unchanged code improvements
     * `agent`: Add or update agent rules, commands, or automation
     * `format`: Code formatting changes (whitespace, indentation, semicolons, etc.)
     * `test`: Test additions or improvements, storybook, .test file additions
     * `perf`: Performance improvements
   
   - **Requirement (or Goal)**: Why this change is needed (1-2 sentences)
     * Default: Use `Requirement:` for most commits
     * Exception: Use `Goal:` only when describing proactive improvements without specific requirements (e.g., voluntary refactoring, performance optimization)
   - **Implementation**: What was changed and how (concise bullet points)

4. **Format each commit message** as:
   ```
   <type>: <brief summary>

   Requirement: (or Goal: if applicable)
   <why this change is needed>

   Implementation:
   <what was changed>
   ```

5. **Present proposed commits**:
   - Show each commit group with:
     * Files included
     * Proposed commit message
   - Ask for user confirmation before executing

6. **Execute approved commits**:
   - Stage the appropriate files for each commit
   - Create the commit with the approved message
   - Show confirmation after each commit

## Key Requirements
- Each commit must be independently meaningful for PR creation later
- Keep commit messages concise but informative
- No unnecessary details - focus on requirement and implementation only
- Ensure logical separation of concerns