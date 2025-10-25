---
description: "Create GitHub issues using templates with automatic project assignment"
argument-hint: "[template-type] [issue-title]"
allowed-tools:
  - Bash
  - Read
  - Glob
  - Grep
---

# Issue Task Command

Create a new GitHub issue with comprehensive context gathering, requirement analysis, and solution design. This command guides you through a structured input process and enhances your input with AI-powered codebase analysis.

## Usage

```
/issue-task [template-type]
```

Or simply:
```
/issue-task
```

**Note**: This command no longer accepts issue title as an argument. The title will be auto-generated based on your requirement input.

## Available Templates

The following issue templates are available in `.github/ISSUE_TEMPLATE/`:

- `feat` - Add a new feature or enhancement
- `fix` - Fix a bug or issue
- `doc` - Add or update project documentation
- `config` - Add or update project configuration, dependencies, or tooling
- `refactor` - Refactor existing code for better maintainability or performance
- `agent` - Add or update agent rules, commands, or automation
- `bug` - Create a bug report to help us improve
- `test` - Add or improve tests
- `perf` - Improve performance

## Workflow

### 1. Determine Template Type
- If `$1` (first argument) is provided and matches a template type, use it
- Otherwise, ask the user to select from available templates

### 2. Collect User Input (Prompt-based)

Collect user input through interactive prompts with a structure **tailored to the issue type**.

**Template sections by type:**

| Type | Section 3 | Section 4 | Notes |
|------|-----------|-----------|-------|
| feat, config, agent | Solution | Test Plan | Standard structure |
| fix | Solution | Test Plan | With bug-specific guidance |
| doc | Content Outline | Verification | Documentation-specific |
| test | Test Scope | Verification | Test-specific |
| perf | Solution | Verification | Performance-specific |
| refactor | Solution | Verification | Refactoring-specific |

**All types share:** Context (REQUIRED), Requirement (REQUIRED), Reference (auto-generated)

**Prompt sequence:**

#### Prompt 1: Context (REQUIRED for all types)
**Prompt text varies by type:**

- **feat, config, agent, perf, refactor, fix**: "Describe the background: Why is this needed? What is the current situation?"
- **doc**: "Why is this documentation needed? What's missing or unclear?"
- **test**: "Why are these tests needed? What's currently untested?"

**Validation:**
- Must be non-empty and not just whitespace
- If validation fails, show: "Context is required and cannot be empty. Please provide input:"
- Re-prompt until valid input is provided

#### Prompt 2: Requirement (REQUIRED for all types)
**Prompt text varies by type:**

- **feat, config, agent, perf, refactor**: "Describe what needs to be done and the expected outcome:"
- **doc**: "What documentation needs to be created/updated?"
- **test**: "What needs to be tested?"
- **fix**: "What needs to be fixed?"

**Validation:**
- Must be non-empty and not just whitespace
- If validation fails, show: "Requirement is required and cannot be empty. Please provide input:"
- Re-prompt until valid input is provided

#### Prompt 3: Type-specific optional section
**Prompt text varies by type:**

- **feat, config, agent**: "If you have ideas about how to solve this, describe the approach: (Enter to skip)"
- **doc**: "Describe the document structure, sections, topics to cover: (Enter to skip)"
- **test**: "Describe test types (Unit/Integration/E2E/Performance), scope, coverage goals: (Enter to skip)"
- **perf, refactor**: "If you have ideas about how to solve this, describe the approach: (Enter to skip)"
- **fix**: "If you know the root cause and fix approach, describe it: (Enter to skip)"

**Handling:**
- Optional - if user presses Enter without text, store as empty
- No validation required

#### Prompt 4: Type-specific optional section
**Prompt text varies by type:**

- **feat, config, agent**: "How should this be tested or validated? (Enter to skip)"
- **doc**: "How to verify documentation accuracy? Examples tested? Consistency checks? (Enter to skip)"
- **test**: "How to verify tests are working? Coverage metrics? (Enter to skip)"
- **perf, refactor**: "How should this be verified? (Enter to skip)"
- **fix**: "How should this be tested or validated? (Enter to skip)"

**Handling:**
- Optional - if user presses Enter without text, store as empty
- No validation required

**Implementation steps:**
- Present prompts sequentially based on the issue type (see table above)
- For each prompt, wait for user input
- For required prompts (Context, Requirement): validate non-empty, re-prompt if validation fails
- For optional prompts: allow Enter to skip, store as empty if skipped
- Store all responses for later use in issue body generation

### 3. AI Context Gathering and Enhancement

After collecting user input, enhance it with AI analysis:

**Context Gathering:**
- Use `Read`, `Glob`, `Grep` to search for related code based on user's Context and Requirement
- Look for:
  - Related files or modules mentioned in the user input
  - Similar patterns or existing implementations
  - Dependencies or components that might be affected
  - Relevant configuration files or documentation

**Content Enhancement:**
- Analyze gathered context and present findings to the user
- If the Solution section is empty or brief, suggest approaches based on:
  - Existing patterns found in the codebase
  - Similar features or components
  - Best practices observed in the project
- Present the enhanced content with clearly marked AI additions
- Ask user: "I've gathered additional context from the codebase. Here's what I found: [summary]. Would you like me to add this to the issue? Any changes needed?"
- Allow user to approve, modify, or reject the AI enhancements
- Iterate until user is satisfied

### 4. Generate Issue Title

Based on the Requirement section, generate a concise, descriptive title:

**Title Generation Process:**
- Analyze the Requirement to extract the core intent
- Generate title in format: `{type}: {concise-summary-of-requirement}`
- Title should be:
  - Concise (ideally under 80 characters)
  - Action-oriented (use verbs like "add", "fix", "update", "refactor")
  - Descriptive enough to understand the issue at a glance

**Present to user:**
- Show the generated title
- Ask: "Here's the suggested issue title: '{generated-title}'. Would you like to use this or modify it?"
- Allow user to approve or provide their own title
- If user provides custom title, ensure it follows the `{type}: {description}` format

### 5. Create Issue with Structured Body

Generate the issue body using **type-specific section names**:

**For feat, config, agent:**
```markdown
## Context
{user-provided context + AI enhancements if approved}

## Requirement
{user-provided requirement}

## Solution
{user-provided solution + AI suggestions if approved, or empty if not provided}

## Test Plan
{user-provided test plan or empty if not provided}

## Reference
{auto-generated references to related files found during context gathering, or empty}
```

**For doc:**
```markdown
## Context
{user-provided context + AI enhancements if approved}

## Requirement
{user-provided requirement}

## Content Outline
{user-provided content outline or empty if not provided}

## Verification
{user-provided verification plan or empty if not provided}

## Reference
{auto-generated references to related files, or empty}
```

**For test:**
```markdown
## Context
{user-provided context + AI enhancements if approved}

## Requirement
{user-provided requirement}

## Test Scope
{user-provided test scope or empty if not provided}

## Verification
{user-provided verification plan or empty if not provided}

## Reference
{auto-generated references to related files, or empty}
```

**For perf, refactor:**
```markdown
## Context
{user-provided context + AI enhancements if approved}

## Requirement
{user-provided requirement}

## Solution
{user-provided solution or empty if not provided}

## Verification
{user-provided verification plan or empty if not provided}

## Reference
{auto-generated references to related files, or empty}
```

**For fix:**
```markdown
## Context
{user-provided context (bug description, steps to reproduce, expected vs current behavior) + AI enhancements if approved}

## Requirement
{what needs to be fixed}

## Solution
{root cause analysis and fix approach, or empty if not provided}

## Test Plan
{verification and regression testing plan, or empty if not provided}

## Reference
{auto-generated references to related files, or empty}
```

**Create the issue:**
- Use `gh issue create` with `--title` and `--body` flags (NOT `--template`)
- Add appropriate label using `-l {type}` flag
- Generate body with the appropriate section names for the type
- Example: `gh issue create --title "{approved-title}" --body "{structured-body}" -l {type}`

### 6. Set Issue Type as "Task"

After issue creation:
- Set the GitHub issue type to "Task"
- Use GitHub API: `gh api repos/{owner}/{repo}/issues/{issue-number} -X PATCH -f type='Task'`
- Note: Issue types are an organization-level feature and may not be available in all repositories
- If this fails, show a warning but continue

### 7. Add to GitHub Project

Add the issue to the repository's linked GitHub Project:
- Get the project linked to the repository using GraphQL:
  ```bash
  gh api graphql -f query='
  {
    repository(owner: "{owner}", name: "{repo}") {
      projectsV2(first: 1) {
        nodes {
          id
          number
          title
        }
      }
    }
  }'
  ```
- Extract the project number from the response
- Add the issue: `gh project item-add {project-number} --owner {owner} --url {issue-url}`
- If no project is linked or command fails, show informative message but don't fail issue creation

## Examples

### Example 1: With template type specified
```bash
/issue-task feat
```

This will:
1. Use the "feat" template type
2. Present interactive prompts for Context, Requirement, Solution, Test Plan
3. Gather additional context from codebase
4. Present AI enhancements for your approval
5. Auto-generate issue title based on your requirement
6. Create issue with structured body
7. Set issue type and add to project

### Example 2: Fully interactive
```bash
/issue-task
```

This will:
1. Ask you to select a template type
2. Then follow the same workflow as Example 1

### Example User Input

When you run the command, you'll see prompts like this:

```
Q: Describe the background: Why is this needed? What is the current situation?
A: Our application currently lacks support for dark mode, which many users have requested. Modern applications are expected to support user preferences for light/dark themes, and our competitors already offer this feature.

Q: Describe what needs to be done and the expected outcome:
A: Implement a dark mode theme that users can toggle. The theme preference should:
- Be persistent across sessions
- Apply to all pages and components
- Follow our existing design system color variables
- Default to system preference on first visit

Q: If you have ideas about how to solve this, describe the approach: (Enter to skip)
A: Use CSS variables for theming with a context provider to manage theme state. Store preference in localStorage.

Q: How should this be tested or validated? (Enter to skip)
A: - Test theme toggle functionality
- Test persistence across page reloads
- Test system preference detection
- Verify contrast ratios meet accessibility standards
```

The AI might then find your design system config, suggest how to integrate with Tailwind, and generate a title like:
`feat: implement dark mode theme with persistent user preference`

## Implementation Notes

**Workflow characteristics:**
- This command uses a **prompt-based input** approach with interactive questions
- The AI actively gathers context from your codebase to enhance the issue
- Issue titles are auto-generated for consistency
- **Type-specific sections**: Each issue type has sections optimized for its purpose
  - feat, config, agent: Context, Requirement, Solution, Test Plan, Reference
  - doc: Context, Requirement, Content Outline, Verification, Reference
  - test: Context, Requirement, Test Scope, Verification, Reference
  - perf, refactor: Context, Requirement, Solution, Verification, Reference
  - fix: Context, Requirement, Solution, Test Plan, Reference (with bug-specific guidance)

**Technical details:**
- Uses `gh issue create` with `--title` and `--body` flags (not `--template`)
- Labels are applied via `-l {type}` flag
- Issue will be assigned to creator automatically via auto-assign workflow
- All issues created via this command are set to "Task" type
- Issues are automatically added to the repository's linked GitHub Project
- GitHub Project integration:
  * Uses GraphQL to efficiently query only repository-linked projects
  * Supports both organization and user projects
  * Uses `gh project item-add` to add issues to projects
  * Gracefully handles cases where no project is linked

**Relationship with `/plan`:**
- `/issue-task` focuses on **problem definition**: gathering context, defining requirements, designing solutions
- `/plan` focuses on **implementation planning**: breaking down well-defined issues into actionable steps
- Issues created with `/issue-task` are well-suited for `/plan` to process

## Error Handling

- If template type is invalid, show available templates and ask again
- If user input is missing required sections (Context, Requirement), re-prompt for that specific section with validation message
- If `gh` CLI is not available, guide user to install it
- If issue type setting fails (e.g., feature not available), show warning but continue
- If no GitHub Project is linked to repository, show informative message
- If project assignment fails, show warning but don't fail issue creation
- Provide clear feedback on each step of the process (input collected, context gathered, title generated, issue created, type set, project assigned)
