---
description: "Create interactive implementation plan from GitHub issue"
argument-hint: "<issue-number> [--no-review]"
allowed-tools:
  - Bash
  - Read
  - Glob
  - Grep
---

# Plan Issue

Fetch a GitHub issue and create an interactive, detailed implementation plan with clear rationale for each decision.

## Usage

```
/plan-issue <issue-number> [--no-review]
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

Parse the issue body to understand:

**Problem/Requirement Analysis:**
- What is the core problem or requirement?
- Why does this need to be solved?
- What is the expected outcome?
- Are there any constraints or considerations?

**Context Gathering:**
- Review related files mentioned in the issue
- Check existing patterns in the codebase
- Identify dependencies or related features

### 4. Generate Initial Plan

Create a structured implementation plan with the following sections:

#### Problem Analysis
- **What**: Clear statement of what needs to be solved
- **Why**: Explanation of why this is important
- **Context**: Relevant background information

#### Solution Approach
- **Strategy**: High-level approach to solving the problem
- **Architecture**: Key design decisions and their rationale
- **Alternatives Considered**: Other approaches and why they weren't chosen
- **Trade-offs**: What we're optimizing for and what we're accepting

#### Implementation Steps
For each step, include:
- **Step description**: What will be done
- **Rationale**: Why this step is necessary
- **How**: Specific approach or method
- **Files affected**: Which files will be created/modified
- **Dependencies**: What needs to be done first

#### Success Criteria
- How will we know the implementation is complete?
- What should be tested?
- What documentation needs to be updated?

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
/plan-issue 13
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
/plan-issue 13 --no-review
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
- Read the issue thoroughly before planning
- Look for existing patterns in the codebase
- Consider edge cases and error handling
- Think about testing requirements

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
