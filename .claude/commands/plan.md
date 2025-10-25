---
description: "Create interactive implementation plan from GitHub issue"
argument-hint: "<issue-number> [--no-review]"
allowed-tools:
  - Bash
  - Read
  - Glob
  - Grep
---

# Plan Command

Fetch a well-structured GitHub issue and create an interactive, detailed implementation plan with clear rationale for each decision.

**Note**: This command works best with issues created using `/issue-task`, which provides structured Context, Requirement, and Solution sections. This command focuses on breaking down the problem into actionable implementation steps, not on defining the problem itself.

## Usage

```
/plan <issue-number> [--no-review]
```

**Required argument:**
- `issue-number`: The GitHub issue number to create a plan for

**Optional flag:**
- `--no-review`: Skip interactive review and proceed directly to plan mode (useful when you trust the automated plan generation)

## Workflow

### 1. Validate Issue Number
- Check if `$1` (issue number) is provided
- If NOT provided, ask the user to provide the issue number and stop
- If provided, proceed with fetching the issue

### 2. Fetch Issue Data
Retrieve issue information using GitHub CLI:

```bash
gh issue view {issue-number} --json number,title,body,labels
```

Extract and analyze:
- Issue title and number
- Full issue body (requirement, implementation details, etc.)
- Labels (feat, fix, doc, agent, etc.) for context on issue type
- Any structured sections (Requirement, Implementation Plan, etc.)

### 3. Analyze Issue Content

**Expected Issue Structure:**
Issues created with `/issue-task` will have the following sections:
- **Context**: Background and why this is needed
- **Requirement**: What needs to be done and expected outcome
- **Solution**: Proposed approach (may be empty or brief)
- **Test Plan**: Success criteria (may be empty or brief)
- **Reference**: Related files or documentation

**Parse the issue body to extract:**
- **Context section**: Understand the background and motivation
- **Requirement section**: Identify what needs to be implemented
- **Solution section**: Review any proposed approaches (if provided)
- **Test Plan section**: Note any existing success criteria (if provided)

**Additional Context Gathering:**
- Review related files mentioned in the issue or Reference section
- Check existing patterns in the codebase
- Identify dependencies or related features
- Use Read/Glob/Grep to explore relevant code

**Note**: If the issue doesn't have this structure (e.g., older issues or manually created issues), do your best to extract similar information from whatever structure exists.

### 4. Generate Initial Plan

Create a structured implementation plan with the following sections:

**IMPORTANT - Separation of Concerns:**
- The issue already contains Context, Requirement, and Solution (from `/issue-task`)
- **DO NOT re-do problem definition work** - use what's already in the issue
- **FOCUS ON** breaking down the solution into actionable implementation steps
- Your job is to create a concrete execution plan, not to redefine the problem

#### Problem Analysis
- **What**: Summarize from the issue's Requirement section (don't rewrite it)
- **Why**: Reference the issue's Context section (don't re-analyze it)
- **Context**: Pull from the issue's Context and Reference sections

#### Solution Approach
- **Strategy**: If the issue has a Solution section, elaborate on it; if not, propose one
- **Architecture**: Key design decisions and their rationale (build on issue's Solution if provided)
- **Alternatives Considered**: Other approaches and why they weren't chosen
- **Trade-offs**: What we're optimizing for and what we're accepting

#### Implementation Steps
**This is the primary focus of this command.** Break down the work into concrete, actionable steps.

For each step, include:
- **Step description**: What will be done
- **Rationale**: Why this step is necessary
- **How**: Specific approach or method
- **Files affected**: Which files will be created/modified
- **Dependencies**: What needs to be done first

#### Success Criteria
- Start with what's in the issue's Test Plan section (if provided)
- Add specific implementation verification steps
- Include what should be tested
- Note what documentation needs to be updated

### 5. Interactive Step-by-Step Review

**IMPORTANT:** Check if `--no-review` flag is present:
- If `$2` is `--no-review`, skip the interactive review process entirely and proceed directly to step 6
- Otherwise, ask the user for their review preference:
  - "Would you like to review each section step-by-step, or should I proceed without review?"
  - If user says "no review" or "proceed without review" or similar, skip to step 6
  - If user wants review, proceed with step-by-step approval below

**Step-by-step approval process:**

1. **Present Problem Analysis section**
   - Show the "Problem Analysis" section with What/Why/Context
   - Explain the reasoning behind the problem understanding
   - Ask: "Does this problem analysis accurately capture the issue? Any adjustments needed?"
   - Wait for user response and iterate if needed
   - Get explicit approval before proceeding

2. **Present Solution Approach section**
   - Show the "Solution Approach" section with Strategy/Architecture/Alternatives/Trade-offs
   - Explain key design decisions and why they were chosen
   - Ask: "Does this solution approach make sense? Are there alternative approaches we should consider?"
   - Wait for user response and iterate if needed
   - Get explicit approval before proceeding

3. **Present Implementation Steps section**
   - Show the "Implementation Steps" with detailed breakdown
   - Explain the order and dependencies between steps
   - Ask: "Are these implementation steps clear and complete? Should any steps be added, removed, or reordered?"
   - Wait for user response and iterate if needed
   - Get explicit approval before proceeding

4. **Present Success Criteria section**
   - Show the "Success Criteria" section
   - Explain how we'll verify completion
   - Ask: "Are these success criteria sufficient? Anything missing?"
   - Wait for user response and iterate if needed
   - Get explicit approval before proceeding

5. **Final confirmation**
   - Summarize the complete plan
   - Ask: "The plan is ready. Should I enter plan mode and begin implementation?"
   - Wait for final approval

### 6. Enter Plan Mode

Once the user approves the plan:
- Use the `ExitPlanMode` tool with the finalized plan
- The plan should be concise but include key sections:
  - Problem summary
  - Solution approach
  - Implementation steps
  - Success criteria

## Examples

### Basic Usage (with interactive review)

```bash
/plan 13
```

This will:
1. Fetch issue #13 from GitHub
2. Analyze the issue content (title, body, labels, etc.)
3. Generate a comprehensive implementation plan with Problem Analysis, Solution Approach, Implementation Steps, and Success Criteria
4. Ask if you want step-by-step review or proceed without review
5. If you choose review, present each section interactively for approval
6. Enter plan mode with the finalized plan

### Quick Mode (skip review)

```bash
/plan 13 --no-review
```

This will:
1. Fetch issue #13 from GitHub
2. Analyze the issue content
3. Generate the complete implementation plan
4. **Directly enter plan mode without interactive review** (useful when you trust the automated plan or want to iterate quickly)

### Example Output Structure

After analyzing the issue, the command will generate a plan like:

```markdown
## Problem Analysis
**What**: [Clear statement of the problem]
**Why**: [Importance and context]
**Context**: [Relevant background information]

## Solution Approach
**Strategy**: [High-level approach]
**Architecture**: [Key design decisions and rationale]
**Alternatives Considered**: [Other options and why they weren't chosen]
**Trade-offs**: [What we're optimizing for]

## Implementation Steps
1. [Step description]
   - Rationale: [Why this is needed]
   - How: [Specific approach]
   - Files: [Files to create/modify]
   - Dependencies: [What needs to be done first]

2. [Next step...]

## Success Criteria
- [How to verify completion]
- [What to test]
- [Documentation updates needed]
```

## Best Practices

### Analysis
- Read the issue thoroughly, especially Context, Requirement, and Solution sections
- **Respect the work already done** in `/make-task-issue` - don't redo problem definition
- Look for existing patterns in the codebase
- Consider edge cases and error handling
- Think about testing requirements

### Separation of Concerns
- **Problem definition** happens in `/issue-task` (Context, Requirement, Solution, Test Plan)
- **Implementation planning** happens in `/plan` (breaking down into steps)
- Don't waste time re-analyzing what's already well-defined in the issue
- Focus your energy on creating a concrete, actionable execution plan

### Communication
- Be transparent about reasoning
- Explain trade-offs clearly
- Use concrete examples when helpful
- Break down complex steps into smaller ones

### Iteration
- Welcome user feedback and questions
- Be willing to revise the approach
- Don't commit to a plan without user approval
- Acknowledge when the user has better insights

### Plan Structure
- Keep implementation steps actionable and specific
- Order steps logically with dependencies clear
- Include both "what" and "why" for each step
- Make success criteria measurable
- **Primary focus**: Implementation Steps section - make it detailed and comprehensive
