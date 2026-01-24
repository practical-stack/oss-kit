# CLAUDE CODE INTEGRATION

## OVERVIEW

Custom commands and skills for AI-assisted development workflows.

## STRUCTURE

```
.claude/
├── commands/         # Slash commands (6 total)
├── skills/           # Reusable skill packages
│   ├── meta-skill-creator/   # Create new skills
│   └── meta-agent-creator/   # Create new agents
└── settings.local.json       # Local settings (gitignored)
```

## COMMANDS

| Command         | File            | Trigger                                             |
| --------------- | --------------- | --------------------------------------------------- |
| `/branch`       | branch.md       | Generate branch name: `/branch [type]: desc #issue` |
| `/commit`       | commit.md       | Analyze changes, create structured commit           |
| `/pr`           | pr.md           | Generate draft PR from commits                      |
| `/issue-task`   | issue-task.md   | Create issue with template selection                |
| `/plan`         | plan.md         | Create implementation plan from issue               |
| `/make-command` | make-command.md | Scaffold new command file                           |

## SKILLS

### meta-skill-creator

Create new skills with proper structure.

```bash
bun .claude/skills/meta-skill-creator/scripts/init-skill.ts <name> --path <dir>
bun .claude/skills/meta-skill-creator/scripts/validate-skill.ts <folder>
```

### meta-agent-creator

Create new agents for multi-agent orchestration.

```bash
bun .claude/skills/meta-agent-creator/scripts/init-agent.ts <name> --path <dir> --platform <platform>
bun .claude/skills/meta-agent-creator/scripts/validate-agent.ts <file>
```

## CONVENTIONS

### Command Format

- Markdown files with frontmatter-style instruction blocks
- Use `<command-instruction>` wrapper for main logic
- Include examples for all usage patterns

### Skill Structure

```
skill-name/
├── SKILL.md          # Main doc (<500 lines)
├── scripts/          # Automation scripts (TypeScript)
├── references/       # Extended documentation
└── assets/           # Templates, static files
```

### SKILL.md Requirements

- Frontmatter: `name` (kebab-case), `description` (what + when)
- Body: <500 lines, use references/ for overflow
- No README.md, CHANGELOG.md, or redundant files

## ANTI-PATTERNS

- **Long SKILL.md** - Split to references/ if >500 lines
- **Vague descriptions** - Include specific trigger contexts
- **Untested scripts** - Run all scripts before packaging
- **Generic agents** - Each agent needs single, clear purpose
