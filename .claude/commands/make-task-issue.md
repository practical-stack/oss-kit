---
description: "Create GitHub issues using templates with automatic project assignment"
argument-hint: "[template-type] [issue-title]"
allowed-tools:
  - Bash
---

# Make Task Issue

Create a new GitHub issue using one of the available templates and automatically assign it to the repository's GitHub Project.

## Usage

```
/make-task-issue [template-type] [issue-title]
```

Or simply:
```
/make-task-issue
```

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

1. **Determine template type**:
   - If `$1` (first argument) is provided and matches a template type, use it
   - Otherwise, ask the user to select from available templates

2. **Get issue title**:
   - If `$2` (remaining arguments) is provided, use it as the title
   - Otherwise, ask the user for the title
   - Format title as: `{type}: {user-provided-title}`

3. **Create the issue**:
   - Use GitHub CLI: `gh issue create --template {template}.md --title "{formatted-title}"`
   - The template will pre-fill the issue body structure
   - User can edit the issue body in their editor before submission

4. **Set issue type as "Task"**:
   - After issue creation, set the GitHub issue type to "Task"
   - Use GitHub API via gh CLI: `gh api repos/{owner}/{repo}/issues/{issue-number} -X PATCH -f issue_type='task'`
   - This categorizes the issue as a "Task" type in GitHub's issue tracking system
   - Note: Issue types are an organization-level feature and may not be available in all repositories

5. **Add to GitHub Project**:
   - After issue creation, add the issue to the repository's linked GitHub Project
   - First, get the project linked to the repository:
     * Use: `gh project list --owner {owner}` to find projects
     * Or query linked projects: `gh api repos/{owner}/{repo}/projects`
   - Then add the issue to the project:
     * Use: `gh project item-add {project-number} --owner {owner} --url {issue-url}`
     * Or use GraphQL API for more control
   - If no project is linked or command fails, show informative message but don't fail issue creation

## Examples

### With arguments:
```
/make-task-issue feat implement dark mode
```
Creates a feature issue with title "feat: implement dark mode"

### Interactive mode:
```
/make-task-issue
```
Prompts for template selection and title

## Implementation Notes

- Use `gh issue create` with `--template` flag to utilize existing templates
- Templates automatically apply correct labels (e.g., feat template applies "feat" label)
- Issue will be assigned to creator automatically via auto-assign workflow
- All issues created via this command are set to "Task" type
- Issues are automatically added to the repository's linked GitHub Project
- GitHub Project integration:
  * Supports both organization and user projects
  * Uses `gh project item-add` to add issues to projects
  * Gracefully handles cases where no project is linked
- Issue type feature requires organization-level setup (default types: Task, Bug, Feature)

## Error Handling

- If template type is invalid, show available templates and ask again
- If `gh` CLI is not available, guide user to install it
- If issue type setting fails (e.g., feature not available), show warning but continue
- If no GitHub Project is linked to repository, show informative message
- If project assignment fails, show warning but don't fail issue creation
- Provide clear feedback on each step of the process (issue created, type set, project assigned)
