# Conventional Commits

English | [한국어](CONVENTIONAL_COMMITS.ko.md)

This document serves as the source of truth for commit conventions in the OSS Kit project.

## Table of Contents

- [Overview](#overview)
- [Commit Types](#commit-types)
- [Scope Usage](#scope-usage)
- [Commit Type to Issue Template Mapping](#commit-type-to-issue-template-mapping)
- [Real-World Scenarios](#real-world-scenarios)
- [Current Limitations](#current-limitations)
- [Custom Commands](#custom-commands)

## Overview

### Why Conventional Commits?

We use Conventional Commits to:

- **Maintain clarity**: Commit messages clearly communicate the nature of changes
- **Enable automation**: Standardized formats allow tools to automatically generate changelogs, determine version bumps, and manage releases
- **Improve collaboration**: Contributors can quickly understand the purpose and scope of changes
- **Ensure consistency**: Automated tools enforce conventions across the entire project

### Official Specification

This project follows the [Conventional Commits specification](https://www.conventionalcommits.org/).

### How We Use It

Our commit conventions are integrated throughout the development workflow:

- **Issue Templates**: Each issue type maps to a specific commit type
- **Custom Commands**: `/make-commit`, `/make-branch`, and `/make-pr` enforce these conventions
- **Git Workflow**: All commits follow the same structure for consistency

## Commit Types

We use 9 commit types in this project. Each type has a specific purpose and use case.

### `feat`: New Features

**Definition**: New features, updates, or output-changing code additions.

**When to use**:
- Adding a new feature
- Enhancing an existing feature with new functionality
- Making changes that affect the output or behavior

**Examples**:
```
feat: create commits CC custom command

Requirement:
Add a custom command to analyze git changes and create well-structured commits.

Implementation:
- Created /make-commit command
- Analyzes staged and unstaged changes
- Groups files by intent
- Generates commit messages with Requirement and Implementation sections
```

**Anti-pattern**: Don't use `feat` for bug fixes, refactoring, or documentation changes.

---

### `fix`: Bug Fixes

**Definition**: Bug fixes and corrections to mistakes.

**When to use**:
- Fixing a bug or error
- Correcting incorrect behavior
- Resolving issues reported by users or tests

**Examples**:
```
fix: resolve type error in make-pr command

Requirement:
The make-pr command fails when branch name doesn't match expected pattern.

Implementation:
- Added null check for branch name parsing
- Added error message for invalid branch names
- Updated tests to cover edge cases
```

**Anti-pattern**: Don't use `fix` for adding new features or refactoring working code.

---

### `doc`: Documentation

**Definition**: Documentation changes only.

**When to use**:
- Creating or updating README files
- Writing or updating technical documentation
- Adding code comments or docstrings
- Creating guides or tutorials

**Examples**:
```
doc: create comprehensive README for oss-kit

Requirement:
Provide clear documentation for contributors and users to understand the project.

Implementation:
- Added project overview and goals
- Documented installation steps
- Added usage examples
- Included contributing guidelines
```

**Anti-pattern**: Don't use `doc` when code changes are included (use the appropriate type for the code change).

---

### `config`: Configuration Changes

**Definition**: Configuration updates for tools, dependencies, CI/CD, or development environment.

**When to use**:
- Updating prettier, eslint, or other linter configs
- Modifying CI/CD pipeline configurations
- Installing or bumping dependencies
- Changing Docker configurations
- Updating VSCode settings or workspace configs

**Why `config` instead of `chore`**: We deliberately avoid the term "chore" because it implies the work is unimportant, when configuration changes are critical to project health.

**Examples**:
```
config: add label and auto-assign workflows

Requirement:
Automate issue and PR labeling to reduce manual effort.

Implementation:
- Created auto-label.yml workflow
- Added auto-assign.yml for PR assignment
- Configured label detection based on title prefix
```

**Anti-pattern**: Don't use `config` for code refactoring or feature additions.

---

### `refactor`: Code Refactoring

**Definition**: Lint fixes, prettier fixes, or code improvements that don't change output.

**When to use**:
- Applying lint fixes
- Running prettier formatting
- Restructuring code without changing behavior
- Renaming variables or functions for clarity
- Extracting code into reusable functions

**Examples**:
```
refactor: simplify plan-issue GitHub API data fetching

Goal:
Reduce code complexity and improve maintainability.

Implementation:
- Replaced multiple gh api calls with single JSON query
- Extracted common logic into helper function
- Simplified error handling
```

**Anti-pattern**: Don't use `refactor` if the behavior or output changes (use `feat` or `fix` instead).

---

### `agent`: Agent Rules and Commands

**Definition**: Add or update agent rules, commands, or automation.

**When to use**:
- Creating or modifying Claude Code custom commands
- Updating agent configuration
- Adding automation scripts
- Modifying workflow automation

**Examples**:
```
agent: add make-task-issue command and agent type support

Requirement:
Streamline GitHub issue creation with automatic template selection and project assignment.

Implementation:
- Created /make-task-issue command
- Added support for 9 issue templates
- Implemented automatic project board integration
- Added agent type to all custom commands
```

**Anti-pattern**: Don't use `agent` for regular code or documentation changes.

---

### `format`: Code Formatting

**Definition**: Code formatting changes (whitespace, indentation, semicolons, etc.)

**When to use**:
- Pure formatting changes
- Whitespace adjustments
- Indentation fixes
- Semicolon additions/removals

**Examples**:
```
format: fix indentation in custom commands

Goal:
Ensure consistent formatting across all command files.

Implementation:
- Fixed tab/space inconsistencies
- Standardized indentation to 2 spaces
```

**Anti-pattern**: Don't use `format` when combined with logic changes (use `refactor` instead).

**Note**: This type exists in custom commands but does not have a corresponding issue template (see [Current Limitations](#current-limitations)).

---

### `test`: Tests

**Definition**: Test additions or improvements, including Storybook stories.

**When to use**:
- Adding new tests
- Updating existing tests
- Adding Storybook stories
- Creating test fixtures or utilities

**Examples**:
```
test: add unit tests for make-commit command

Requirement:
Ensure commit message generation logic works correctly.

Implementation:
- Added tests for type prefix detection
- Added tests for file grouping logic
- Added tests for message formatting
- Achieved 95% code coverage
```

**Anti-pattern**: Don't use `test` when the primary change is feature code (include tests in the feature commit).

---

### `perf`: Performance Improvements

**Definition**: Performance improvements without changing functionality.

**When to use**:
- Optimizing algorithms
- Reducing memory usage
- Improving response times
- Caching improvements

**Examples**:
```
perf: optimize issue fetching with GraphQL

Goal:
Reduce API calls and improve command execution time.

Implementation:
- Replaced REST API calls with GraphQL queries
- Reduced API calls from 5 to 1
- Decreased execution time by 60%
```

**Anti-pattern**: Don't use `perf` if functionality changes (use `feat` or `fix` instead).

## Scope Usage

### Syntax

Scopes are optional and provide additional context:

```
<type>(<scope>): <description>
```

### When to Use Scopes

Scopes are useful for:
- Specifying which file or module was changed
- Indicating which component or package was affected
- Highlighting the area of the codebase

### Examples

```
feat(cli): add interactive mode to make-commit
fix(api): resolve timeout issue in GitHub client
doc(readme): update installation instructions
config(eslint): add new rule for import ordering
```

### Current Usage

Scopes are not heavily used in this project currently. Feel free to add them when they provide clarity, but they are not required.

## Commit Type to Issue Template Mapping

Our issue templates directly correspond to commit types:

| Commit Type | Issue Template | Description |
|-------------|----------------|-------------|
| `feat` | [feat.md](.github/ISSUE_TEMPLATE/feat.md) | Add a new feature or enhancement |
| `fix` | [fix.md](.github/ISSUE_TEMPLATE/fix.md) | Bug fixes and corrections |
| `doc` | [doc.md](.github/ISSUE_TEMPLATE/doc.md) | Documentation changes |
| `config` | [config.md](.github/ISSUE_TEMPLATE/config.md) | Configuration updates |
| `refactor` | [refactor.md](.github/ISSUE_TEMPLATE/refactor.md) | Code refactoring |
| `agent` | [agent.md](.github/ISSUE_TEMPLATE/agent.md) | Agent rules and commands |
| `format` | ❌ No template | Code formatting changes |
| `test` | [test.md](.github/ISSUE_TEMPLATE/test.md) | Test additions or improvements |
| `perf` | [perf.md](.github/ISSUE_TEMPLATE/perf.md) | Performance improvements |

**Special case**: There's also a [bug.md](.github/ISSUE_TEMPLATE/bug.md) template for reporting bugs, but the corresponding commit type is `fix` (not `bug`).

## Real-World Scenarios

Here are common scenarios and the correct commit type to use:

### Development Scenarios

| Scenario | Commit Type | Example |
|----------|-------------|---------|
| Adding a new API endpoint | `feat` | `feat: add user authentication endpoint` |
| Creating a new component | `feat` | `feat: implement Button component` |
| Fixing a type error | `fix` | `fix: resolve type error in API client` |
| Fixing a runtime bug | `fix` | `fix: prevent null pointer in user service` |
| Updating README | `doc` | `doc: add API documentation` |
| Adding code comments | `doc` | `doc: document authentication flow` |
| Installing new dependency | `config` | `config: add lodash dependency` |
| Updating ESLint rules | `config` | `config: enable strict mode in ESLint` |
| Updating GitHub Actions | `config` | `config: add automated testing workflow` |
| Renaming variables | `refactor` | `refactor: rename getUserData to fetchUser` |
| Extracting helper function | `refactor` | `refactor: extract validation logic` |
| Creating Claude command | `agent` | `agent: add make-branch command` |
| Updating workflow automation | `agent` | `agent: update auto-label workflow` |
| Fixing indentation | `format` | `format: fix indentation in utils` |
| Adding unit tests | `test` | `test: add tests for auth service` |
| Optimizing query performance | `perf` | `perf: add database index for user lookup` |

### Commit Message Structure

Every commit message should follow this structure:

```
<type>: <brief summary>

Requirement: (or Goal:)
<why this change is needed>

Implementation:
<what was changed and how>
```

#### "Requirement" vs "Goal"

- **Use "Requirement:"** for most commits - when there's a specific need or problem to solve
- **Use "Goal:"** only for proactive improvements without specific requirements (e.g., voluntary refactoring, performance optimization)

**Example with Requirement:**
```
fix: resolve authentication timeout issue

Requirement:
Users are experiencing timeout errors during login when API response is slow.

Implementation:
- Increased timeout from 5s to 30s
- Added retry logic with exponential backoff
- Added loading state to prevent duplicate requests
```

**Example with Goal:**
```
refactor: extract common validation logic

Goal:
Reduce code duplication and improve maintainability across validation functions.

Implementation:
- Created shared validateInput utility function
- Replaced duplicated validation code in 5 files
- Added unit tests for validation logic
```

## Current Limitations

We acknowledge the following gaps and areas for future improvement:

### 1. `format` Type Has No Issue Template

**Gap**: The `format` commit type exists in custom commands but has no corresponding issue template.

**Impact**: Developers might be confused about when to create issues for formatting work.

**Future consideration**: Decide whether to add a `format` issue template or fold formatting work into `refactor` issues.

### 2. `bug` vs `fix` Terminology

**Gap**: We have a `bug` issue template but use `fix` as the commit type.

**Why**: Issue templates describe the problem (bug), while commits describe the solution (fix).

**Impact**: Minimal - the mapping is intuitive once understood.

### 3. Scope Usage Not Standardized

**Gap**: Scopes are supported but not consistently used across the project.

**Future consideration**: Establish scope naming conventions if scope usage increases.

### 4. No Commitlint Configuration

**Gap**: While we have conventions documented, there's no automated enforcement via commitlint.

**Future consideration**: Add commitlint to validate commit messages in CI/CD pipeline.

### 5. Breaking Changes Not Explicitly Handled

**Gap**: The Conventional Commits spec includes breaking change syntax (`!` or `BREAKING CHANGE:`), but we haven't documented our approach.

**Future consideration**: Define how to handle breaking changes when needed.

## Custom Commands

The following custom commands automatically enforce these conventions:

### `/commit`

**Purpose**: Analyze git changes and create well-structured commits

**How it uses conventions**:
- Prompts you to select the appropriate commit type
- Generates commit messages with "Requirement" and "Implementation" sections
- Groups files by intent to ensure logical commits

**Reference**: [.claude/commands/commit.md](.claude/commands/commit.md)

### `/branch`

**Purpose**: Generate consistent branch names from GitHub issue information

**How it uses conventions**:
- Uses the same type prefixes as commits
- Creates branch names in format: `i{issue-number}-{type}/{description}`
- Ensures branch names align with eventual commits

**Reference**: [.claude/commands/branch.md](.claude/commands/branch.md)

### `/pr`

**Purpose**: Automatically generate draft pull requests

**How it uses conventions**:
- Analyzes commits to extract requirements and implementation details
- Generates PR titles with correct type prefixes
- Creates structured PR descriptions based on commit analysis

**Reference**: [.claude/commands/pr.md](.claude/commands/pr.md)

---

## Questions or Feedback?

If you have questions about which commit type to use or suggestions for improving these conventions, please open an issue!
