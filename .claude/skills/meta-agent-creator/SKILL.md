---
name: meta-agent-creator
description: Guide for creating specialized AI agents (subagents). This skill should be used when users want to create a new agent, define agent configurations, or need guidance on agent architecture.
---

# Meta-Agent Creator

A meta-skill that helps create new specialized agents for multi-agent orchestration systems.
Supports Claude Code and OpenCode platforms.

> **Output Language**: All generated agent content (prompts, descriptions) will be in **English**.

## Quick Start

### Create a New Agent

```bash
# Initialize a new agent
bun scripts/init-agent.ts <agent-name> --path <output-directory> --platform <platform>

# Examples
bun scripts/init-agent.ts security-auditor --path src/agents --platform opencode
bun scripts/init-agent.ts data-analyst --path .claude/agents --platform claude-code
```

### Validate Agent

```bash
bun scripts/validate-agent.ts <agent-file>

# Examples
bun scripts/validate-agent.ts src/agents/my-agent.ts
bun scripts/validate-agent.ts .claude/agents/my-agent.ts
```

## Agent Categories

Choose the appropriate category based on agent purpose:

| Category        | Purpose                         | Model Tier       | Examples          |
| --------------- | ------------------------------- | ---------------- | ----------------- |
| `exploration`   | Fast search, codebase discovery | LOW (haiku/fast) | explore, searcher |
| `specialist`    | Domain-specific implementation  | MEDIUM (sonnet)  | frontend, backend |
| `advisor`       | Read-only consultation          | HIGH (opus)      | oracle, architect |
| `utility`       | General helpers                 | LOW (haiku/fast) | writer, formatter |
| `orchestration` | Multi-agent coordination        | MEDIUM (sonnet)  | orchestrator      |

## Agent Creation Workflow (5 Phases)

### Phase 1: DEFINE PURPOSE

**Goal**: Clarify agent's role and responsibilities.

**Questions to Ask**:

1. "What specific tasks should this agent handle?"
2. "When should the orchestrator delegate to this agent?"
3. "What domain expertise is required?"
4. "Should it be read-only or have write access?"

**Deliverables**:

- Clear role definition
- Trigger conditions for delegation
- Required capabilities list
- Access level decision (readonly vs full)

### Phase 2: CLASSIFY

**Goal**: Determine category and model tier.

**Decision Matrix**:

| If the agent needs...           | Category      | Model          | Cost      |
| ------------------------------- | ------------- | -------------- | --------- |
| Fast codebase search            | exploration   | haiku/fast     | FREE      |
| Specific domain implementation  | specialist    | sonnet/inherit | CHEAP     |
| Complex reasoning, architecture | advisor       | opus/inherit   | EXPENSIVE |
| Simple transformations          | utility       | haiku/fast     | FREE      |
| Delegate to other agents        | orchestration | sonnet/inherit | CHEAP     |

**Deliverables**:

- Category assignment
- Model tier selection
- Cost classification

### Phase 3: DESIGN PROMPT

**Goal**: Write effective system prompt.

**Prompt Structure**:

```markdown
## Role

[1-2 sentence identity and expertise]

## Core Capabilities

- [Capability 1]
- [Capability 2]

## Workflow

1. [Step 1]
2. [Step 2]

## Output Format

[Structured output definition]

## Constraints

- [Constraint 1]
- [Constraint 2]
```

**Best Practices**:

- Keep prompts concise (<500 words)
- Use imperative form
- Include specific output format
- Define clear constraints

### Phase 4: CONFIGURE

**Goal**: Create platform-specific configuration.

#### OpenCode / Claude Code (TypeScript)

Location: `src/agents/<agent-name>.ts`

```typescript
export function createMyAgent(model: string): AgentConfig {
  return {
    name: "my-agent",
    description: "Agent description...",
    mode: "subagent",
    model,
    temperature: 0.1,
    tools: { include: ["read", "glob", "grep"] },
    prompt: `System prompt...`,
  };
}
```

### Phase 5: REGISTER & TEST

**Goal**: Add agent to registry and verify functionality.

**Registration Checklist**:

- [ ] Add to agent definitions/index
- [ ] Update orchestrator's available agents list
- [ ] Add to delegation table if applicable
- [ ] Test with sample delegation

**Testing**:

1. Invoke agent with representative task
2. Verify output format matches spec
3. Check tool restrictions are enforced
4. Test edge cases

## Platform Configurations

### OpenCode / Claude Code Agent Fields

| Field         | Required | Description              |
| ------------- | -------- | ------------------------ |
| `name`        | Yes      | Agent identifier         |
| `description` | Yes      | Selection guide          |
| `mode`        | Yes      | Always `"subagent"`      |
| `model`       | Yes      | Model string             |
| `temperature` | No       | Defaults to 0.1          |
| `tools`       | No       | Tool whitelist/blacklist |
| `prompt`      | Yes      | System prompt            |

## Common Agent Templates

See `references/agent-templates.md` for ready-to-use templates:

- Exploration Agent
- Verification Agent
- Debugger Agent
- Security Auditor Agent

## Anti-Patterns to Avoid

| Anti-Pattern      | Problem                    | Solution                  |
| ----------------- | -------------------------- | ------------------------- |
| Vague description | Orchestrator can't decide  | Include specific triggers |
| Too many tools    | Security risk              | Minimal tool set          |
| Long prompts      | Slower, harder to maintain | Keep under 500 words      |
| Generic "helper"  | No clear purpose           | Single responsibility     |
| Missing readonly  | Security for advisors      | Set readonly: true        |
| Wrong model tier  | Cost or quality issues     | Match tier to complexity  |

## References

- **Agent Templates**: See [references/agent-templates.md](references/agent-templates.md) for ready-to-use templates
- **Agent Patterns**: See [../meta-skill-creator/references/agent-patterns.md](../meta-skill-creator/references/agent-patterns.md) for architecture guidance
