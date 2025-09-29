# make-branch

Generate consistent branch names from GitHub issue information.

## Usage

```
/make-branch [<type>]: <description>
#<issue-index>
```

## Template

```
i{issue-index}-{type}/{action-description_with_underscores}
```

## Supported Types

- `feat` - New features
- `fix` - Bug fixes  
- `docs` - Documentation changes
- `config` - Configuration updates
- `refactor` - Code refactoring

## Examples

- Input: `/make-branch [config]: issue template, pr template, claude commend
#5`
- Output: `i5-config/issue-template-pr-template-claude-commend`

- Input: `/make-branch [feat]: implement Button component
#15`
- Output: `i15-feat/implement-button-component`

- Input: `/make-branch [fix]: resolve styling issues in Dialog
#23`
- Output: `i23-fix/resolve-styling-issues-in-dialog`

- Input: `/make-branch [docs]: add component usage examples
#42`
- Output: `i42-docs/add-component-usage-examples`

## Implementation

Parse the input to:
1. Extract the issue index from #<number>
2. Extract the type from [<type>]
3. Extract the description after the colon
4. Convert spaces to hyphens
5. Convert commas and special characters to hyphens
6. Remove duplicate hyphens
7. Format as i{index}-{type}/{description}

## Workflow

1. Generate branch name using the command
2. Review the generated name
3. Create and checkout the branch if approved:
   ```bash
   git checkout -b <generated-branch-name>
   ```