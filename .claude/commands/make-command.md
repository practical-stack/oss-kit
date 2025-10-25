---
description: "Scaffold new Claude Code commands following official guide"
argument-hint: "[command-name]"
allowed-tools:
  - Bash
  - Write
  - Read
  - Glob
---

# Make Command

Scaffold new Claude Code command files with proper frontmatter, structure, and best practices following the official guide at https://docs.claude.com/en/docs/claude-code/slash-commands

## Usage

```
/make-command [command-name]
```

**Optional argument:**
- `command-name`: The name of the command (lowercase with hyphens)
  - If not provided, you'll be prompted interactively

**Note**: All other information (description, arguments, tools, workflow) will be collected through interactive questions.

## Workflow

### 1. Validate and Collect Command Name

**Check if `$1` (command name) is provided:**
- If NOT provided, prompt: "What should the command be named? (Use lowercase with hyphens, e.g., 'review-pr')"
- If provided, use `$1` as the command name

**Validate command name format:**
- Must be lowercase letters, hyphens, and numbers only
- No spaces, underscores, or special characters
- Good examples: `review-pr`, `analyze-code`, `check-deps`
- Bad examples: `Review-PR`, `analyze_code`, `check.deps`

**Check for existing command:**
- Use Glob to check if `.claude/commands/{command-name}.md` already exists
- If exists, ask: "Command '/{command-name}' already exists at .claude/commands/{command-name}.md. Do you want to overwrite it? (y/n)"
- If user says no, stop and ask for a different name

### 2. Collect Command Information

Collect information through 4 key questions to understand what command to generate:

#### Q1: Command Purpose

**Prompt**: "What does this command do? Describe its main purpose:"

**Purpose**:
- This will be used to generate the frontmatter `description`
- Helps understand the command's scope and intent
- Guides tool selection

**Wait for user response and store it**

#### Q2: Workflow Steps

**Prompt**: "What are the main steps this command should perform? (e.g., fetch data, analyze, generate report)"

**Purpose**:
- Helps structure the Workflow section in the generated file
- Used to infer which tools are needed
- Identifies potential error handling points

**Examples to show users**:
- "Fetch PR info from GitHub, analyze the diff, generate review summary"
- "Read package.json, check for outdated dependencies, show report"
- "Create branch from issue info, validate name, checkout"

**Wait for user response and store it**

#### Q3: User Input Requirements

**Prompt**: "Does this command need input from the user?"

**Options**:
- `none` - No input needed, command runs independently
- `arguments` - Command-line arguments (e.g., PR number, file path, flags)
- `interactive` - Interactive prompts during execution

**Wait for user response**

**If user selects "arguments":**
- **Prompt**: "What arguments? Provide format (e.g., `<pr-number> [--detailed]`)"
- **Show examples from existing commands**:
  - `<issue-number> [--no-review]` (from plan-issue)
  - `[template-type] [issue-title]` (from make-task-issue)
  - `[<type>]: <description>\n#<issue-index>` (from make-branch)
- **Explain notation**: Use `<required>` for required args, `[optional]` for optional args
- **Store the argument-hint for frontmatter**

**If user selects "none" or "interactive":**
- No argument-hint needed (will be omitted from frontmatter)

#### Q4: External System Interaction

**Prompt**: "Does this command interact with external systems? (e.g., git, GitHub via gh CLI, npm, file system)"

**Purpose**:
- Determines if specific Bash permissions are needed (e.g., `Bash(git *:*)`)
- Identifies additional tools required
- Helps with error handling (network issues, authentication, etc.)

**Examples**:
- "Yes, GitHub via gh CLI"
- "Yes, git for branch operations"
- "No, just file operations"
- "Yes, npm for dependency checks"

**Wait for user response and store it**

### 3. AI Analysis and Generation

After collecting all information from the 4 questions, analyze and generate command components:

#### Generate Description

**From Q1 response, create concise description:**
- Extract the core purpose
- Make it action-oriented (start with a verb)
- Keep under 80 characters for readability
- Should work well in help text

**Examples:**
- User: "Reviews GitHub pull requests and provides detailed analysis"
  → Description: "Review GitHub pull requests with detailed analysis"
- User: "This command helps analyze project dependencies for security issues"
  → Description: "Analyze project dependencies for security vulnerabilities"
- User: "Creates branch from issue information"
  → Description: "Create branch from GitHub issue information"

#### Infer Required Tools

**Based on Q2 (workflow steps) and Q4 (external systems), determine tools:**

**Pattern matching:**
- Mentioned "GitHub" or "gh" or "pull request" or "issue"
  → Add `Bash(gh pr *:*)`, `Bash(gh issue *:*)` or general `Bash(gh *:*)`
- Mentioned "git" or "branch" or "commit"
  → Add `Bash(git *:*)`
- Mentioned "npm" or "package.json" or "dependencies"
  → Add `Bash(npm *:*)`
- Mentioned "read files" or "analyze code" or "search"
  → Add `Read`, `Grep`, `Glob`
- Mentioned "create files" or "generate"
  → Add `Write`
- Mentioned "modify files" or "update"
  → Add `Edit`
- Mentioned "other commands" or "slash commands"
  → Add `SlashCommand`
- Mentioned "complex analysis" or "agent"
  → Add `Task`

**Default fallback:**
- If unclear or simple command: `[Bash, Read, Glob, Grep]`

**Validation:**
- Ensure tools are in proper YAML list format
- Use specific Bash permissions for security (e.g., `Bash(git *:*)` not just `Bash`)
- Only include tools that are actually needed

#### Structure Workflow

**From Q2 response, break down into numbered steps:**

**Pattern:**
1. If arguments exist (from Q3), start with validation step:
   - "Validate {argument-name} from `$1`"
2. Convert user's workflow description into concrete steps
3. Add error handling points where needed
4. Include output/result step at the end

**Example:**
- User Q2: "Fetch PR info from GitHub, get the diff, analyze changes, show summary"
- User Q3: "arguments" with `<pr-number>`
- Generated workflow:
  1. Validate PR number from `$1`
  2. Fetch PR information using `gh pr view`
  3. Get PR diff using `gh pr diff`
  4. Analyze code changes
  5. Generate and display review summary

#### Present for Approval

**Show generated components to user:**

```
Based on your input, I'll generate:

Description: "{generated-description}"

Allowed Tools:
  - {tool-1}
  - {tool-2}
  - {tool-3}

Workflow Structure:
1. {step-1}
2. {step-2}
3. {step-3}

Does this look correct? (y/n or describe changes needed)
```

**Handle user response:**

**If user says "y" or "yes":**
- Proceed to file generation (Section 4)

**If user says "n" or "no" or provides specific feedback:**
- Ask: "What would you like to change? (description/tools/workflow/all)"
- Based on response, allow user to modify specific parts
- Re-generate and show updated version
- Ask for approval again
- Repeat until approved

**Examples of iteration:**
- User: "Add Write tool, I need to create files"
  → Add `Write` to tools list, show updated version
- User: "Description should mention 'automated' analysis"
  → Regenerate description with that keyword
- User: "Workflow should also check for conflicts"
  → Add conflict checking step to workflow

### 4. Generate Command File

**Create the command file structure:**

Use the Write tool to create `.claude/commands/{command-name}.md` with:

**Use AI-generated information from Section 3:**
- Description: AI-generated from Q1
- Tools: AI-inferred from Q2 and Q4
- Argument-hint: From Q3 (if user selected "arguments")
- Workflow: AI-structured from Q2

**Frontmatter section:**
```yaml
---
description: "{AI-generated-description}"
argument-hint: "{from Q3 if arguments, otherwise omit this line}"
allowed-tools:
  {AI-suggested tools in YAML format}
---
```

**Content sections:**

```markdown
# {Command Name as Title Case}

{Expanded description based on Q1 and Q2 responses}

## Usage

```
/{command-name} {argument-hint from Q3 or empty if none}
```

{If has arguments, explain what each argument does based on Q3}

## Workflow

{Use AI-structured workflow from Section 3}

### 1. {First step from AI-generated workflow}
{Add details based on Q2 response}

{If has arguments from Q3:}
**Check if `$1` is provided:**
- If NOT provided, prompt: "{appropriate question}"
- If provided, use `$1` as {what it represents}

### 2. {Second step from AI-generated workflow}
{Add implementation details}

{Continue for all steps in AI-generated workflow}

## Examples

{Generate 2-3 concrete examples based on Q1, Q2, and Q3}

### Example 1: {Scenario based on Q1}
```bash
/{command-name} {example arguments if applicable}
```

This will:
1. {Outcomes based on AI-structured workflow}
2. {Step 2 outcome}

### Example 2: {Different scenario}
```bash
/{command-name} {different example arguments}
```

## Implementation Notes

{Optional section - add if relevant based on Q4}

- Tool usage: {Notes about external systems from Q4}
- Reference: https://docs.claude.com/en/docs/claude-code/slash-commands
- Related commands: {Suggest similar commands if applicable}

{If arguments exist, add comment about argument patterns:}
<!--
Argument access patterns:
- $1, $2, $3, etc. for positional arguments
- $ARGUMENTS for all arguments as a single string
-->
```

**Quality guidelines for generation:**
- Make workflow steps concrete and actionable
- Include validation steps for arguments
- Add error handling notes where appropriate
- Use examples that match the command's purpose from Q1
- Reference tools that were inferred in Section 3

### 5. Display Success Message

**After file is created, display:**

```
✓ Command created successfully!

File: .claude/commands/{command-name}.md
Usage: /{command-name} {argument-hint}

Next steps:
1. Review and customize the generated file
2. Add specific workflow steps and examples
3. Test the command: /{command-name}
4. Refer to https://docs.claude.com/en/docs/claude-code/slash-commands for advanced features

Tip: Check existing commands in .claude/commands/ for patterns and examples.
```

## Error Handling

**Invalid command name:**
- Detect uppercase letters, underscores, spaces, special characters
- Show error: "Invalid command name '{name}'. Use lowercase with hyphens only (e.g., 'review-pr')"
- Ask for corrected name

**File already exists:**
- Show warning with file path
- Ask for confirmation to overwrite
- Suggest alternative name if user declines

**Invalid tool syntax:**
- Detect malformed Bash command patterns
- Show error: "Invalid tool syntax. Use format like: Bash(git *:*) or Bash(gh issue *:*)"
- Show examples and ask for correction

**Write permission issues:**
- If Write fails, show error: "Cannot write to .claude/commands/. Check directory permissions."
- Suggest running with appropriate permissions

**Missing required information:**
- If user skips required prompts, re-ask with more guidance
- Show examples to help user understand what's needed

## Examples

### Example 1: Simple command (no arguments)

```bash
/make-command hello-world
```

**Interactive flow:**

```
✓ Command name validated
✓ No conflicts found

Q1: What does this command do? Describe its main purpose:
A: "Prints a hello world message to test the command system"

Q2: What are the main steps this command should perform?
A: "Just print 'Hello World' to the console"

Q3: Does this command need input from the user?
A: "none"

Q4: Does this command interact with external systems?
A: "no"

[AI Analysis]
Based on your input, I'll generate:

Description: "Print hello world message"

Allowed Tools:
  - Bash

Workflow Structure:
1. Print "Hello World" message to console

Does this look correct? (y/n or describe changes needed)
A: "y"

✓ Command created at .claude/commands/hello-world.md
Usage: /hello-world
```

Generated file: `.claude/commands/hello-world.md`

### Example 2: GitHub PR review command with arguments

```bash
/make-command review-pr
```

**Interactive flow:**

```
✓ Command name validated
✓ No conflicts found

Q1: What does this command do? Describe its main purpose:
A: "Reviews GitHub pull requests and provides detailed analysis of the code changes"

Q2: What are the main steps this command should perform?
A: "Fetch PR info from GitHub using gh CLI, get the diff, analyze the changes for potential issues, generate a review summary"

Q3: Does this command need input from the user?
A: "arguments"

Q3a: What arguments? Provide format:
A: "<pr-number> [--detailed]"

Q4: Does this command interact with external systems?
A: "Yes, GitHub via gh CLI"

[AI Analysis]
Based on your input, I'll generate:

Description: "Review GitHub pull requests with detailed analysis"

Allowed Tools:
  - Bash(gh pr view:*)
  - Bash(gh pr diff:*)
  - Read
  - Grep

Workflow Structure:
1. Validate PR number from $1
2. Check for --detailed flag from $2
3. Fetch PR information using gh pr view
4. Get PR diff using gh pr diff
5. Analyze code changes for issues
6. Generate and display review summary

Does this look correct? (y/n or describe changes needed)
A: "y"

✓ Command created at .claude/commands/review-pr.md
Usage: /review-pr <pr-number> [--detailed]
```

Generated file: `.claude/commands/review-pr.md`

### Example 3: With iteration (user requests changes)

```bash
/make-command analyze-deps
```

**Interactive flow:**

```
✓ Command name validated
✓ No conflicts found

Q1: What does this command do? Describe its main purpose:
A: "Checks npm dependencies for security vulnerabilities and outdated packages"

Q2: What are the main steps this command should perform?
A: "Read package.json, run npm audit, check for outdated packages, show report"

Q3: Does this command need input from the user?
A: "none"

Q4: Does this command interact with external systems?
A: "Yes, npm for audit and outdated check"

[AI Analysis]
Based on your input, I'll generate:

Description: "Check npm dependencies for security vulnerabilities"

Allowed Tools:
  - Bash(npm audit:*)
  - Bash(npm outdated:*)
  - Read

Workflow Structure:
1. Read package.json to verify project
2. Run npm audit for security check
3. Run npm outdated for version check
4. Generate combined report

Does this look correct? (y/n or describe changes needed)
A: "Add Glob tool, I might need to search for other package files"

[Updated AI Analysis]
Description: "Check npm dependencies for security vulnerabilities"

Allowed Tools:
  - Bash(npm audit:*)
  - Bash(npm outdated:*)
  - Read
  - Glob

Workflow Structure:
1. Search for package.json files using Glob
2. Read package.json to verify project
3. Run npm audit for security check
4. Run npm outdated for version check
5. Generate combined report

Does this look correct? (y/n or describe changes needed)
A: "y"

✓ Command created at .claude/commands/analyze-deps.md
Usage: /analyze-deps
```

Generated file: `.claude/commands/analyze-deps.md`

### Example 4: Fully interactive (no command name provided)

```bash
/make-command
```

**Interactive flow:**

```
Q: What should the command be named? (Use lowercase with hyphens)
A: "test-api"

✓ Command name validated
✓ No conflicts found

Q1: What does this command do? Describe its main purpose:
A: "Tests API endpoints to verify they're working correctly"

Q2: What are the main steps this command should perform?
A: "Read API config, make test requests to endpoints, validate responses, show results"

Q3: Does this command need input from the user?
A: "interactive"

Q4: Does this command interact with external systems?
A: "Yes, makes HTTP requests to API endpoints"

[AI Analysis]
Based on your input, I'll generate:

Description: "Test API endpoints and validate responses"

Allowed Tools:
  - Bash
  - Read
  - Grep

Workflow Structure:
1. Read API configuration file
2. Prompt user for which endpoints to test
3. Make HTTP requests to selected endpoints
4. Validate response status and structure
5. Display test results

Does this look correct? (y/n or describe changes needed)
A: "y"

✓ Command created at .claude/commands/test-api.md
Usage: /test-api
```

Generated file: `.claude/commands/test-api.md`

## Best Practices

**Information Gathering:**
- Ask clear, focused questions one at a time
- Provide examples to guide users (especially for Q2 and Q3)
- Listen carefully to user responses to infer context
- Be smart about tool inference from keywords
- Show what will be generated before creating files
- Allow iteration until user is satisfied
- Don't assume - confirm with user approval

**AI Inference Patterns:**
- "GitHub" / "gh" / "PR" / "issue" → `Bash(gh *:*)`
- "git" / "branch" / "commit" → `Bash(git *:*)`
- "npm" / "package.json" → `Bash(npm *:*)`, `Read`
- "read" / "analyze" / "search" → `Read`, `Grep`, `Glob`
- "create file" / "generate" → `Write`
- "modify" / "update file" → `Edit`
- When uncertain → `[Bash, Read, Glob, Grep]`

**Command naming:**
- Use action verbs: `review-pr`, `analyze-code`, `check-deps`
- Keep names short but descriptive
- Use hyphens for multi-word names

**Description generation:**
- Extract core action from Q1 (user's purpose)
- Start with a verb: "Review", "Analyze", "Create", "Update"
- Keep under 80 characters
- Be specific but concise
- Match the scope described by user

**Arguments:**
- Use `<required>` and `[optional]` notation clearly
- Provide argument hints for better autocomplete
- Document what each argument does in the Usage section
- Show examples from existing commands to guide users

**Tool selection:**
- Only include tools the command actually needs
- Use specific Bash patterns for security (e.g., `Bash(git *:*)` not just `Bash`)
- Prefer specific over general permissions
- Validate tool combinations make sense together

**Workflow generation:**
- Start with argument validation if arguments exist
- Break user's Q2 response into concrete, actionable steps
- Add error handling at logical points
- Include output/result step at the end
- Make steps specific to the command's purpose

**Documentation:**
- Generate examples based on user's Q1 and Q2 responses
- Include concrete scenarios from user's description
- Explain the workflow step-by-step
- Reference tools that were inferred
- Add implementation notes if Q4 mentions external systems

## Reference

- Official guide: https://docs.claude.com/en/docs/claude-code/slash-commands
- Existing commands: [branch.md](/.claude/commands/branch.md), [commit.md](/.claude/commands/commit.md), [pr.md](/.claude/commands/pr.md), [issue-task.md](/.claude/commands/issue-task.md), [plan.md](/.claude/commands/plan.md)
- Frontmatter fields: description (required), argument-hint, allowed-tools, model, disable-model-invocation
