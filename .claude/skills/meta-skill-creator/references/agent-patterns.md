# Agent Patterns

Guidance for creating Meta-Agents - agents that help create other agents.

## Agent Architecture

### AgentConfig Interface

```typescript
interface AgentConfig {
  name: string;
  description: string;
  prompt: string;
  tools?: string[] | { include?: string[]; exclude?: string[] };
  model?: 'opus' | 'sonnet' | 'haiku' | 'fast' | 'inherit';
  temperature?: number;
  readonly?: boolean;
  isBackground?: boolean;
}
```

### Agent Metadata (for Orchestrators)

```typescript
interface AgentPromptMetadata {
  category: 'exploration' | 'specialist' | 'advisor' | 'utility' | 'orchestration';
  cost: 'FREE' | 'CHEAP' | 'EXPENSIVE';
  triggers: Array<{ domain: string; trigger: string }>;
  useWhen?: string[];
  avoidWhen?: string[];
  promptAlias?: string;
}
```

## Model Tier Routing

| Tier | Models | Use Case | Cost |
|------|--------|----------|------|
| HIGH | opus, inherit | Complex analysis, architecture, debugging | EXPENSIVE |
| MEDIUM | sonnet | Standard tasks, moderate complexity | CHEAP |
| LOW | haiku, fast | Simple lookups, fast operations | FREE |

## Agent Categories

### Exploration Agents

Fast, cheap agents for codebase discovery.

```markdown
---
name: explore
description: 코드베이스 탐색 전문가. "X는 어디에?", "Y가 있는 파일은?" 질문에 사용
model: fast
readonly: true
---

코드베이스 검색 전문가입니다. 파일과 코드를 찾아 실행 가능한 결과를 반환합니다.

## 미션

다음 질문에 답합니다:
- "X는 어디에 구현되어 있나요?"
- "Y를 포함하는 파일은?"
- "Z를 수행하는 코드를 찾아주세요"

## 결과 형식

<results>
<files>
- /절대/경로/파일1.ts — 관련 이유
- /절대/경로/파일2.ts — 관련 이유
</files>
<answer>
실제 필요에 대한 직접적인 답변
</answer>
</results>
```

### Specialist Agents

Domain-specific implementation agents.

```markdown
---
name: frontend-engineer
description: 프론트엔드 UI/UX 전문가. 시각적 변경, 스타일링, 레이아웃, 애니메이션에 사용
model: inherit
---

프론트엔드 UI/UX 전문 엔지니어입니다.

## 전문 분야

- 컴포넌트 디자인 및 구현
- 반응형 레이아웃
- 애니메이션 및 트랜지션
- 접근성 (a11y)
- 디자인 시스템 준수
```

### Advisor Agents

Read-only consultation agents for high-stakes decisions.

```markdown
---
name: oracle
description: 읽기 전용 자문 에이전트. 아키텍처 결정, 복잡한 디버깅, 2회 이상 실패 후 사용
model: inherit
readonly: true
---

전략적 기술 자문가입니다. 복잡한 분석이나 아키텍처 결정이 필요할 때 호출됩니다.

## 역할

- 코드베이스 분석
- 구체적이고 구현 가능한 기술 권장 사항 제시
- 아키텍처 설계 및 리팩토링 로드맵
- 복잡한 기술 문제 해결

## 제약

- 읽기 전용: 파일 생성, 수정, 삭제 불가
- 자문만 제공, 직접 구현하지 않음
```

### Orchestration Agents

Coordinator agents that delegate to other agents.

```markdown
---
name: orchestrator
description: 복잡한 다단계 작업의 마스터 코디네이터. 작업 분할, 위임, 검증 수행
model: inherit
---

다중 에이전트 조율자입니다.

## 사용 가능한 서브에이전트

- `/explore` - 빠른 코드베이스 검색
- `/librarian` - 문서 및 외부 참조 검색
- `/oracle` - 아키텍처 자문
- `/verifier` - 작업 완료 검증

## 워크플로우

1. 작업 분석 및 분할
2. 적절한 서브에이전트에 위임 (병렬 가능)
3. 결과 수집 및 검증
4. 최종 출력 종합

## 필수 규칙

- 복잡한 작업은 반드시 위임
- 가능하면 병렬 실행
- 완료 전 반드시 검증
```

## Platform Format (Claude Code / OpenCode)

```typescript
export function createExploreAgent(model: string): AgentConfig {
  return {
    name: "explore",
    description: "코드베이스 탐색 전문가...",
    mode: "subagent",
    model,
    temperature: 0.1,
    tools: { include: ["read", "glob", "grep", "ast_grep_search"] },
    prompt: `...`
  };
}
```

## Best Practices

### DO

- Write focused agents with single responsibility
- Include specific trigger conditions in description
- Use readonly for consultation-only agents
- Set appropriate model tier based on complexity

### DON'T

- Create vague "helper" agents
- Give broad tool access when not needed
- Use expensive models for simple lookups
- Skip verification in orchestrators
