# PROJECT KNOWLEDGE BASE

**Generated:** 2026-01-24

## OVERVIEW

GitHub template repository (`@p-stack/oss-kit`) for bootstrapping open-source projects with essential configurations, GitHub workflows, and Claude Code integration.

## STRUCTURE

```
oss-kit/
├── .claude/
│   ├── commands/         # Claude Code slash commands
│   └── skills/           # Claude Code skills
├── .github/
│   ├── ISSUE_TEMPLATE/   # GitHub issue templates (9 types)
│   ├── workflows/        # GitHub Actions (auto-assign, auto-label)
│   └── pull_request_template.md
├── docs/                 # Project documentation
│   └── CONVENTIONAL_COMMITS.md
├── AGENTS.md             # This file - project knowledge base
├── README.md             # Project introduction
├── CONTRIBUTION.md       # Contribution guidelines
├── CODE_OF_CONDUCT.md    # Contributor code of conduct
└── LICENSE               # MIT License
```

## WHERE TO LOOK

| Task                | Location                           | Notes                   |
| ------------------- | ---------------------------------- | ----------------------- |
| Add issue template  | `.github/ISSUE_TEMPLATE/`          | Match commit type       |
| Modify PR template  | `.github/pull_request_template.md` | Single template         |
| Add GitHub workflow | `.github/workflows/`               | auto-assign, auto-label |
| Add Claude command  | `.claude/commands/`                | Markdown format         |
| Add Claude skill    | `.claude/skills/`                  | Use meta-skill-creator  |
| Update docs         | `docs/`                            | Bilingual (en/ko)       |

## CONVENTIONS

### Package Manager & Runtime

- **pnpm@9.0.0** - Use `pnpm` commands, NOT npm/yarn
- **Node.js >=22** - Required runtime version

### Commit Convention (9 types)

| Type       | Purpose                | Issue Template |
| ---------- | ---------------------- | -------------- |
| `feat`     | New features           | feat.md        |
| `fix`      | Bug fixes              | fix.md, bug.md |
| `doc`      | Documentation          | doc.md         |
| `config`   | Config/deps/CI         | config.md      |
| `refactor` | Code improvements      | refactor.md    |
| `agent`    | Claude commands/skills | agent.md       |
| `format`   | Formatting only        | (none)         |
| `test`     | Test changes           | test.md        |
| `perf`     | Performance            | perf.md        |

### Commit Message Format

```
<type>: <brief summary>

Requirement: (or Goal:)
<why this change is needed>

Implementation:
<what was changed>
```

### Branch Naming

```
i{issue-number}-{type}/{description}
Example: i27-feat/add-agents-md-scope-docs
```

## CLAUDE COMMANDS

| Command         | Purpose                                   |
| --------------- | ----------------------------------------- |
| `/branch`       | Generate branch name from issue           |
| `/commit`       | Analyze changes, create structured commit |
| `/pr`           | Generate draft PR with analysis           |
| `/issue-task`   | Create GitHub issue with template         |
| `/plan`         | Create implementation plan from issue     |
| `/make-command` | Scaffold new Claude command               |

## ANTI-PATTERNS (THIS PROJECT)

- **No `chore` type** - Use `config` instead (work is never unimportant)
- **No npm/yarn** - pnpm only
- **No README.md in skills** - Only SKILL.md per meta-skill-creator spec
- **No generic "helper" agents** - Single responsibility per agent

## NOTES

- **Template repo**: This is a GitHub template - use "Use this template" button
- **Under development**: External contributions not yet accepted
- **Bilingual docs**: README.md + README.ko.md pattern
