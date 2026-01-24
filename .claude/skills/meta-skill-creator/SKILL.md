---
name: meta-skill-creator
description: Guide for creating effective AI agent skills. This skill should be used when users want to create a new skill, update an existing skill, or need guidance on skill architecture and best practices.
---

# Meta-Skill Creator

A meta-skill that helps create new skills for AI agents. This skill provides structured workflows,
automation scripts, and quality assurance mechanisms for skill development.

> **Output Language**: All generated skill content (SKILL.md, comments, documentation) will be in **English**.

## Quick Start

### Create a New Skill

```bash
# Initialize a new skill (using npx/bunx)
npx ts-node scripts/init-skill.ts <skill-name> --path <output-directory>

# Or with Bun
bun scripts/init-skill.ts <skill-name> --path <output-directory>

# Example
bun scripts/init-skill.ts my-awesome-skill --path .claude/skills
```

### Validate and Package

```bash
# Validate skill structure
bun scripts/validate-skill.ts <skill-folder>

# Package for distribution
bun scripts/package-skill.ts <skill-folder> [output-dir]
```

## Skill Creation Workflow (6 Phases)

Follow these phases in order. Each phase has specific deliverables and validation criteria.

### Phase 1: UNDERSTAND

**Goal**: Gather concrete examples of how the skill will be used.

**Questions to Ask**:

1. "What specific scenarios trigger this skill?"
2. "Can you provide 3-5 concrete usage examples?"
3. "What keywords should activate this skill?"
4. "What inputs does it receive? What outputs does it produce?"

**Deliverables**:

- Trigger condition list
- 3-5 usage scenarios with examples
- Expected input/output format

**Exit Criteria**: Clear understanding of skill purpose and usage patterns.

### Phase 2: PLAN

**Goal**: Identify reusable content and structure.

**Analysis Checklist**:

| Content Type  | When to Include                           | Examples                                    |
| ------------- | ----------------------------------------- | ------------------------------------------- |
| `scripts/`    | Repetitive code, deterministic operations | File processing, API calls, automation      |
| `references/` | Detailed docs, schemas, lengthy guides    | API docs, database schemas, workflow guides |
| `assets/`     | Output templates, images, fonts           | HTML templates, config files, boilerplate   |

**Freedom Level Decision**:

| Level  | When to Use                              | Implementation                           |
| ------ | ---------------------------------------- | ---------------------------------------- |
| High   | Multiple valid approaches                | Text instructions only                   |
| Medium | Preferred pattern exists                 | Pseudocode or parameterized scripts      |
| Low    | Fragile operations, consistency critical | Specific scripts with minimal parameters |

**Deliverables**:

- Directory structure design
- Progressive Disclosure strategy
- Freedom level for each component

### Phase 3: INITIALIZE

**Goal**: Create skill directory and template files.

**Action**: Run the initialization script:

```bash
bun scripts/init-skill.ts <skill-name> --path <output-directory>
```

The script creates:

```
skill-name/
├── SKILL.md              # Template with placeholders
├── scripts/
│   └── example.ts        # Example TypeScript script template
├── references/
│   └── guide.md          # Example reference template
└── assets/
    └── .gitkeep          # Placeholder for assets
```

**Deliverables**: Initialized skill directory with all templates.

### Phase 4: IMPLEMENT

**Goal**: Write skill content and implement resources.

#### 4.1 Write SKILL.md Frontmatter

```yaml
---
name: skill-name # Required: kebab-case, max 64 chars
description: What the skill does. This skill should be used when [specific contexts].
---
```

**Description best practices:**

- Use third-person format: "This skill should be used when..."
- Include both what the skill does AND when to use it
- Be specific about trigger contexts
- Keep it concise (no strict word limit)

#### 4.2 Write SKILL.md Body

Structure options (choose based on skill type):

| Pattern              | Best For             | Structure                     |
| -------------------- | -------------------- | ----------------------------- |
| Workflow-Based       | Sequential processes | Decision Tree → Steps         |
| Task-Based           | Tool collections     | Quick Start → Task Categories |
| Reference/Guidelines | Standards, specs     | Overview → Guidelines → Specs |
| Capabilities-Based   | Integrated systems   | Capabilities → Features       |

#### 4.3 Implement Scripts (TypeScript/JavaScript)

```typescript
#!/usr/bin/env node
// scripts/my-script.ts

import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

async function main() {
  const args = process.argv.slice(2);
  // Implementation here
  console.log("Script execution complete");
}

main().catch(console.error);
```

- Test ALL scripts by actually running them
- Include helpful error messages
- Handle edge cases gracefully

#### 4.4 Write References

- Keep SKILL.md under 500 lines
- Move detailed content to references/
- Always link references from SKILL.md

**Deliverables**: Complete skill implementation.

### Phase 5: VALIDATE

**Goal**: Ensure skill meets quality standards.

**Run Validation**:

```bash
bun scripts/validate-skill.ts <skill-folder>
```

**Validation Checklist**:

| Category    | Check                | Requirement                                   |
| ----------- | -------------------- | --------------------------------------------- |
| Frontmatter | `name` field         | kebab-case, max 64 chars, matches directory   |
| Frontmatter | `description` field  | Third-person format, what + when to use       |
| Structure   | SKILL.md exists      | Required                                      |
| Structure   | Line count           | < 500 lines (split to references if exceeded) |
| Content     | No TODO placeholders | All [TODO] items resolved                     |
| Content     | No unnecessary files | No README.md, CHANGELOG.md, etc.              |
| Scripts     | Execution test       | All scripts run without errors                |
| References  | Explicit links       | All references linked from SKILL.md           |

**Exit Criteria**: All validation checks pass.

### Phase 6: PACKAGE

**Goal**: Create distributable .skill file.

**Action**:

```bash
bun scripts/package-skill.ts <skill-folder> [output-dir]
```

**Output**: `<skill-name>.skill` file (ZIP format with .skill extension)

**Post-Package**:

1. Test the packaged skill
2. Collect usage feedback
3. Iterate based on real usage

## Progressive Disclosure Patterns

Keep context efficient by loading content progressively:

| Level | When Loaded | Size Limit   | Content                        |
| ----- | ----------- | ------------ | ------------------------------ |
| 1     | Always      | Keep concise | `name` + `description`         |
| 2     | On trigger  | <500 lines   | SKILL.md body                  |
| 3     | On demand   | Unlimited    | scripts/, references/, assets/ |

### Pattern 1: High-level Guide with References

```markdown
# Main Skill

## Quick Start

[Essential instructions here]

## Advanced Features

- **Feature A**: See [FEATURE_A.md](references/feature_a.md)
- **Feature B**: See [FEATURE_B.md](references/feature_b.md)
```

### Pattern 2: Domain-Specific Organization

```
skill/
├── SKILL.md (overview + navigation)
└── references/
    ├── frontend.md    # Frontend-specific
    ├── backend.md     # Backend-specific
    └── deployment.md  # Deployment-specific
```

### Pattern 3: Conditional Details

```markdown
## Basic Usage

[Simple instructions]

## Advanced (when needed)

**For complex scenarios**: See [ADVANCED.md](references/advanced.md)
```

## Anti-Patterns to Avoid

| Anti-Pattern         | Problem               | Solution                          |
| -------------------- | --------------------- | --------------------------------- |
| Verbose descriptions | Wastes context tokens | Be concise, focus on what + when  |
| Vague "when to use"  | Skill won't activate  | Be specific about usage contexts  |
| SKILL.md > 500 lines | Context bloat         | Split to references/              |
| Unnecessary files    | Clutter and confusion | Only include essential files      |
| Untested scripts     | Runtime failures      | Test all scripts before packaging |
| Deeply nested refs   | Hard to navigate      | Keep references 1 level deep      |
| Duplicated content   | Maintenance burden    | Single source of truth            |

## Platform Compatibility

This skill generates output compatible with:

| Platform    | Skill Location      | Status       |
| ----------- | ------------------- | ------------ |
| Claude Code | `.claude/skills/`   | Full Support |
| OpenCode    | `.opencode/skills/` | Full Support |

## References

- **Workflow Patterns**: See [references/workflows.md](references/workflows.md) for detailed workflow guidance
- **Agent Patterns**: See [references/agent-patterns.md](references/agent-patterns.md) for meta-agent creation
- **Output Templates**: See [assets/templates/](assets/templates/) for templates
