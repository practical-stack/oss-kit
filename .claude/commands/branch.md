---
description: "Generate consistent branch names from GitHub issue information"
argument-hint: "[<type>]: <description>\n#<issue-index>"
allowed-tools:
  - Bash(git checkout:*)
---

# branch

Generate consistent branch names from GitHub issue information.

## Usage

```
/branch [<type>]: <description>
#<issue-index>
```

## Template

```
i{issue-index}-{type}/{shortened-description}
```

The description is intelligently shortened to keep the total branch name under 50 characters while preserving the core intent.

## Supported Types

- `feat` - New features
- `fix` - Bug fixes
- `doc` - Documentation changes
- `config` - Configuration updates
- `refactor` - Code refactoring
- `agent` - Add or update agent rules, commands, or automation
- `format` - Code formatting changes (whitespace, indentation, semicolons, etc.)
- `test` - Test additions or improvements
- `perf` - Performance improvements

## Examples

### Basic Examples

- Input: `/branch [feat]: implement Button component
#15`
- Output: `i15-feat/implement-button-component`

- Input: `/branch [fix]: resolve styling issues in Dialog
#23`
- Output: `i23-fix/resolve-styling-issues`

- Input: `/branch [doc]: add component usage examples
#42`
- Output: `i42-doc/add-component-usage-examples`

### Shortening Examples

- Input: `/branch [config]: issue template, pr template, claude commend
#5`
- Output: `i5-config/issue-pr-template`

- Input: `/branch [agent]: rename custom commands to shorter aliases for easier invocation
#21`
- Output: `i21-agent/rename-commands-to-aliases`

- Input: `/branch [agent]: update issue-task to use prompt-based input instead of editor
#19`
- Output: `i19-agent/prompt-based-input`

## Shortening Strategy

Branch names should be concise and easy to work with while preserving the core intent of the issue.

### Length Guidelines
- **Target**: 50 characters total (including prefix)
- **Maximum**: 60 characters (only if essential meaning requires it)
- **Format**: `i{index}-{type}/{description}` where the description portion is shortened

### Filler Words to Remove
Common words that can be safely removed without losing meaning:
- Articles: the, a, an
- Prepositions: for, to, of, with, in, on, at, by, from
- Conjunctions: and, or, but
- Relative pronouns: that, this, which
- Helping phrases: using, instead, etc.

### What to Keep
- **Action verbs**: add, create, update, fix, remove, implement, refactor, etc.
- **Key nouns**: Specific components, features, or concepts being modified
- **Critical context**: Terms that distinguish this work from similar changes

### Shortening Techniques
1. Remove filler words first
2. Identify the core action and target
3. Use abbreviations for well-known terms (e.g., "config" for "configuration")
4. Combine related terms (e.g., "issue-pr-template" instead of "issue-template-pr-template")
5. Truncate at word boundaries only (never cut mid-word)
6. Verify the shortened name is still meaningful and specific

### Edge Cases
- **Very short titles**: Don't over-shorten; maintain clarity
- **Already concise titles**: Keep them as-is if under 50 characters
- **Special characters**: Convert to hyphens as part of standard formatting

## Implementation

Parse the input to:
1. Extract the issue index from #<number>
2. Extract the type from [<type>]
3. Extract the description after the colon
4. **Shorten the description intelligently:**
   - Remove filler words (the, a, an, for, to, of, with, in, on, at, by, from, that, this, using, instead, etc.)
   - Keep action verbs and key nouns that convey core intent
   - Target 50 characters total for the branch name (allow up to 60 if needed)
   - Use context from the issue to determine essential terms
   - Truncate at word boundaries only (never mid-word)
5. Convert spaces to hyphens
6. Convert commas and special characters to hyphens
7. Remove duplicate hyphens
8. Format as i{index}-{type}/{shortened-description}

## Workflow

1. Generate branch name using the command
2. Review the generated name
3. Create and checkout the branch if approved:
   ```bash
   git checkout -b <generated-branch-name>
   ```