# GITHUB CONFIGURATION

## OVERVIEW

Issue templates, PR template, and CI workflows for automated project management.

## STRUCTURE

```
.github/
├── ISSUE_TEMPLATE/       # 9 issue templates
├── workflows/            # GitHub Actions
│   ├── auto-assign.yml   # Auto-assign PRs
│   └── auto-label.yml    # Auto-label by title prefix
└── pull_request_template.md
```

## ISSUE TEMPLATES

| Template    | Commit Type | Trigger                     |
| ----------- | ----------- | --------------------------- |
| feat.md     | `feat`      | New features                |
| fix.md      | `fix`       | Bug fixes (known issue)     |
| bug.md      | `fix`       | Bug reports (user-reported) |
| doc.md      | `doc`       | Documentation               |
| config.md   | `config`    | Configuration/deps          |
| refactor.md | `refactor`  | Code improvements           |
| agent.md    | `agent`     | Claude commands/skills      |
| test.md     | `test`      | Test additions              |
| perf.md     | `perf`      | Performance improvements    |

## WORKFLOWS

### auto-label.yml

Labels PRs based on title prefix (e.g., `feat:` adds `feat` label).

### auto-assign.yml

Auto-assigns PR creator as assignee.

## CONVENTIONS

### Issue Title Format

```
<type>: <description>
```

Must match one of: feat, fix, doc, config, refactor, agent, test, perf

### PR Title Format

Same as commit message first line:

```
<type>: <brief summary>
```

## ADDING NEW TEMPLATE

1. Create `.github/ISSUE_TEMPLATE/<type>.md`
2. Match existing template structure (Context, Requirement, Solution, Test Plan, Reference)
3. Update auto-label.yml if new type added
4. Update docs/CONVENTIONAL_COMMITS.md mapping table
