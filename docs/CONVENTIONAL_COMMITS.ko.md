# Conventional Commits

[English](CONVENTIONAL_COMMITS.md) | 한국어

이 문서는 OSS Kit 프로젝트의 커밋 컨벤션에 대한 단일 정보원(source of truth)입니다.

## 목차

- [개요](#개요)
- [커밋 타입](#커밋-타입)
- [Scope 사용법](#scope-사용법)
- [커밋 타입과 이슈 템플릿 매핑](#커밋-타입과-이슈-템플릿-매핑)
- [실제 시나리오](#실제-시나리오)
- [현재 제약사항](#현재-제약사항)
- [커스텀 명령어](#커스텀-명령어)

## 개요

### 왜 Conventional Commits를 사용하나요?

우리는 다음과 같은 이유로 Conventional Commits를 사용합니다:

- **명확성 유지**: 커밋 메시지가 변경 사항의 특성을 명확하게 전달합니다
- **자동화 가능**: 표준화된 형식을 통해 도구가 자동으로 changelog를 생성하고, 버전 증가를 결정하며, 릴리스를 관리할 수 있습니다
- **협업 개선**: 기여자들이 변경 사항의 목적과 범위를 빠르게 이해할 수 있습니다
- **일관성 보장**: 자동화 도구가 프로젝트 전체에서 컨벤션을 강제합니다

### 공식 스펙

이 프로젝트는 [Conventional Commits specification](https://www.conventionalcommits.org/)을 따릅니다.

### 우리가 사용하는 방법

커밋 컨벤션은 개발 워크플로우 전반에 통합되어 있습니다:

- **Issue Templates**: 각 이슈 타입은 특정 커밋 타입과 매핑됩니다
- **Custom Commands**: `/make-commit`, `/make-branch`, `/make-pr` 명령어가 이 컨벤션을 강제합니다
- **Git Workflow**: 모든 커밋이 일관성을 위해 동일한 구조를 따릅니다

## 커밋 타입

이 프로젝트에서는 9가지 커밋 타입을 사용합니다. 각 타입은 특정한 목적과 사용 사례를 가지고 있습니다.

### `feat`: New Features

**정의**: 새로운 기능, 업데이트, 또는 출력을 변경하는 코드 추가.

**언제 사용하나요**:
- 새로운 기능 추가
- 기존 기능에 새로운 기능을 추가하여 개선
- 출력이나 동작에 영향을 미치는 변경 사항

**예시**:
```
feat: create commits CC custom command

Requirement:
Add a custom command to analyze git changes and create well-structured commits.

Implementation:
- Created /make-commit command
- Analyzes staged and unstaged changes
- Groups files by intent
- Generates commit messages with Requirement and Implementation sections
```

**Anti-pattern**: 버그 수정, 리팩토링, 또는 문서 변경에 `feat`를 사용하지 마세요.

---

### `fix`: Bug Fixes

**정의**: 버그 수정 및 실수 정정.

**언제 사용하나요**:
- 버그나 에러 수정
- 잘못된 동작 정정
- 사용자나 테스트에서 보고된 이슈 해결

**예시**:
```
fix: resolve type error in make-pr command

Requirement:
The make-pr command fails when branch name doesn't match expected pattern.

Implementation:
- Added null check for branch name parsing
- Added error message for invalid branch names
- Updated tests to cover edge cases
```

**Anti-pattern**: 새로운 기능 추가나 작동하는 코드의 리팩토링에 `fix`를 사용하지 마세요.

---

### `doc`: Documentation

**정의**: 문서 변경만 포함.

**언제 사용하나요**:
- README 파일 생성 또는 업데이트
- 기술 문서 작성 또는 업데이트
- 코드 주석이나 docstring 추가
- 가이드나 튜토리얼 작성

**예시**:
```
doc: create comprehensive README for oss-kit

Requirement:
Provide clear documentation for contributors and users to understand the project.

Implementation:
- Added project overview and goals
- Documented installation steps
- Added usage examples
- Included contributing guidelines
```

**Anti-pattern**: 코드 변경이 포함된 경우 `doc`를 사용하지 마세요 (코드 변경에 적합한 타입을 사용하세요).

---

### `config`: Configuration Changes

**정의**: 도구, 의존성, CI/CD, 또는 개발 환경에 대한 설정 업데이트.

**언제 사용하나요**:
- prettier, eslint, 또는 다른 linter 설정 업데이트
- CI/CD 파이프라인 설정 수정
- 의존성 설치 또는 버전 업데이트
- Docker 설정 변경
- VSCode 설정 또는 workspace 설정 업데이트

**왜 `chore` 대신 `config`를 사용하나요**: 우리는 의도적으로 "chore"라는 용어를 피합니다. 이는 작업이 중요하지 않다는 의미를 내포하지만, 설정 변경은 프로젝트 건강성에 매우 중요합니다.

**예시**:
```
config: add label and auto-assign workflows

Requirement:
Automate issue and PR labeling to reduce manual effort.

Implementation:
- Created auto-label.yml workflow
- Added auto-assign.yml for PR assignment
- Configured label detection based on title prefix
```

**Anti-pattern**: 코드 리팩토링이나 기능 추가에 `config`를 사용하지 마세요.

---

### `refactor`: Code Refactoring

**정의**: Lint 수정, prettier 수정, 또는 출력을 변경하지 않는 코드 개선.

**언제 사용하나요**:
- Lint 수정 적용
- prettier 포맷팅 실행
- 동작을 변경하지 않고 코드 재구조화
- 명확성을 위해 변수나 함수 이름 변경
- 재사용 가능한 함수로 코드 추출

**예시**:
```
refactor: simplify plan-issue GitHub API data fetching

Goal:
Reduce code complexity and improve maintainability.

Implementation:
- Replaced multiple gh api calls with single JSON query
- Extracted common logic into helper function
- Simplified error handling
```

**Anti-pattern**: 동작이나 출력이 변경되는 경우 `refactor`를 사용하지 마세요 (`feat` 또는 `fix` 사용).

---

### `agent`: Agent Rules and Commands

**정의**: agent rule, command, 또는 automation 추가 또는 업데이트.

**언제 사용하나요**:
- Claude Code 커스텀 명령어 생성 또는 수정
- agent 설정 업데이트
- 자동화 스크립트 추가
- workflow automation 수정

**예시**:
```
agent: add make-task-issue command and agent type support

Requirement:
Streamline GitHub issue creation with automatic template selection and project assignment.

Implementation:
- Created /make-task-issue command
- Added support for 9 issue templates
- Implemented automatic project board integration
- Added agent type to all custom commands
```

**Anti-pattern**: 일반 코드나 문서 변경에 `agent`를 사용하지 마세요.

---

### `format`: Code Formatting

**정의**: 코드 포맷팅 변경 (공백, 들여쓰기, 세미콜론 등)

**언제 사용하나요**:
- 순수 포맷팅 변경
- 공백 조정
- 들여쓰기 수정
- 세미콜론 추가/제거

**예시**:
```
format: fix indentation in custom commands

Goal:
Ensure consistent formatting across all command files.

Implementation:
- Fixed tab/space inconsistencies
- Standardized indentation to 2 spaces
```

**Anti-pattern**: 로직 변경과 함께 포함된 경우 `format`을 사용하지 마세요 (`refactor` 사용).

**참고**: 이 타입은 커스텀 명령어에는 존재하지만 대응하는 이슈 템플릿이 없습니다 ([현재 제약사항](#현재-제약사항) 참조).

---

### `test`: Tests

**정의**: 테스트 추가 또는 개선, Storybook story 포함.

**언제 사용하나요**:
- 새로운 테스트 추가
- 기존 테스트 업데이트
- Storybook story 추가
- 테스트 fixture 또는 유틸리티 생성

**예시**:
```
test: add unit tests for make-commit command

Requirement:
Ensure commit message generation logic works correctly.

Implementation:
- Added tests for type prefix detection
- Added tests for file grouping logic
- Added tests for message formatting
- Achieved 95% code coverage
```

**Anti-pattern**: 주요 변경이 기능 코드인 경우 `test`를 사용하지 마세요 (기능 커밋에 테스트를 포함하세요).

---

### `perf`: Performance Improvements

**정의**: 기능을 변경하지 않는 성능 개선.

**언제 사용하나요**:
- 알고리즘 최적화
- 메모리 사용량 감소
- 응답 시간 개선
- 캐싱 개선

**예시**:
```
perf: optimize issue fetching with GraphQL

Goal:
Reduce API calls and improve command execution time.

Implementation:
- Replaced REST API calls with GraphQL queries
- Reduced API calls from 5 to 1
- Decreased execution time by 60%
```

**Anti-pattern**: 기능이 변경되는 경우 `perf`를 사용하지 마세요 (`feat` 또는 `fix` 사용).

## Scope 사용법

### 문법

Scope는 선택사항이며 추가 컨텍스트를 제공합니다:

```
<type>(<scope>): <description>
```

### Scope를 사용하는 경우

Scope는 다음과 같은 경우에 유용합니다:
- 어떤 파일이나 모듈이 변경되었는지 지정
- 어떤 컴포넌트나 패키지가 영향을 받았는지 표시
- 코드베이스의 영역을 강조

### 예시

```
feat(cli): add interactive mode to make-commit
fix(api): resolve timeout issue in GitHub client
doc(readme): update installation instructions
config(eslint): add new rule for import ordering
```

### 현재 사용 현황

현재 이 프로젝트에서는 scope를 많이 사용하지 않습니다. 명확성을 제공하는 경우 자유롭게 추가하세요. 하지만 필수는 아닙니다.

## 커밋 타입과 이슈 템플릿 매핑

이슈 템플릿은 커밋 타입과 직접 대응됩니다:

| 커밋 타입 | 이슈 템플릿 | 설명 |
|-------------|----------------|-------------|
| `feat` | [feat.md](.github/ISSUE_TEMPLATE/feat.md) | 새로운 기능 또는 개선 추가 |
| `fix` | [fix.md](.github/ISSUE_TEMPLATE/fix.md) | 버그 수정 및 정정 |
| `doc` | [doc.md](.github/ISSUE_TEMPLATE/doc.md) | 문서 변경 |
| `config` | [config.md](.github/ISSUE_TEMPLATE/config.md) | 설정 업데이트 |
| `refactor` | [refactor.md](.github/ISSUE_TEMPLATE/refactor.md) | 코드 리팩토링 |
| `agent` | [agent.md](.github/ISSUE_TEMPLATE/agent.md) | Agent rule 및 command |
| `format` | ❌ 템플릿 없음 | 코드 포맷팅 변경 |
| `test` | [test.md](.github/ISSUE_TEMPLATE/test.md) | 테스트 추가 또는 개선 |
| `perf` | [perf.md](.github/ISSUE_TEMPLATE/perf.md) | 성능 개선 |

**특별한 경우**: 버그 보고를 위한 [bug.md](.github/ISSUE_TEMPLATE/bug.md) 템플릿도 있지만, 대응하는 커밋 타입은 `fix`입니다 (`bug`가 아님).

## 실제 시나리오

일반적인 시나리오와 사용해야 할 올바른 커밋 타입:

### 개발 시나리오

| 시나리오 | 커밋 타입 | 예시 |
|----------|-------------|---------|
| 새로운 API endpoint 추가 | `feat` | `feat: add user authentication endpoint` |
| 새로운 컴포넌트 생성 | `feat` | `feat: implement Button component` |
| 타입 에러 수정 | `fix` | `fix: resolve type error in API client` |
| 런타임 버그 수정 | `fix` | `fix: prevent null pointer in user service` |
| README 업데이트 | `doc` | `doc: add API documentation` |
| 코드 주석 추가 | `doc` | `doc: document authentication flow` |
| 새로운 의존성 설치 | `config` | `config: add lodash dependency` |
| ESLint rule 업데이트 | `config` | `config: enable strict mode in ESLint` |
| GitHub Actions 업데이트 | `config` | `config: add automated testing workflow` |
| 변수명 변경 | `refactor` | `refactor: rename getUserData to fetchUser` |
| helper 함수 추출 | `refactor` | `refactor: extract validation logic` |
| Claude 명령어 생성 | `agent` | `agent: add make-branch command` |
| workflow automation 업데이트 | `agent` | `agent: update auto-label workflow` |
| 들여쓰기 수정 | `format` | `format: fix indentation in utils` |
| unit test 추가 | `test` | `test: add tests for auth service` |
| 쿼리 성능 최적화 | `perf` | `perf: add database index for user lookup` |

### 커밋 메시지 구조

모든 커밋 메시지는 다음 구조를 따라야 합니다:

```
<type>: <brief summary>

Requirement: (또는 Goal:)
<why this change is needed>

Implementation:
<what was changed and how>
```

#### "Requirement" vs "Goal"

- **"Requirement:" 사용**: 대부분의 커밋 - 해결해야 할 특정 요구사항이나 문제가 있을 때
- **"Goal:" 사용**: 특정 요구사항 없이 능동적인 개선을 위한 경우에만 (예: 자발적 리팩토링, 성능 최적화)

**Requirement를 사용한 예시:**
```
fix: resolve authentication timeout issue

Requirement:
Users are experiencing timeout errors during login when API response is slow.

Implementation:
- Increased timeout from 5s to 30s
- Added retry logic with exponential backoff
- Added loading state to prevent duplicate requests
```

**Goal을 사용한 예시:**
```
refactor: extract common validation logic

Goal:
Reduce code duplication and improve maintainability across validation functions.

Implementation:
- Created shared validateInput utility function
- Replaced duplicated validation code in 5 files
- Added unit tests for validation logic
```

## 현재 제약사항

다음과 같은 갭과 향후 개선 영역을 인정합니다:

### 1. `format` 타입에 이슈 템플릿이 없음

**갭**: `format` 커밋 타입은 커스텀 명령어에 존재하지만 대응하는 이슈 템플릿이 없습니다.

**영향**: 개발자가 포맷팅 작업에 대한 이슈를 언제 생성해야 할지 혼란스러울 수 있습니다.

**향후 고려사항**: `format` 이슈 템플릿을 추가할지, 또는 포맷팅 작업을 `refactor` 이슈로 통합할지 결정.

### 2. `bug` vs `fix` 용어

**갭**: `bug` 이슈 템플릿은 있지만 커밋 타입으로는 `fix`를 사용합니다.

**이유**: 이슈 템플릿은 문제(bug)를 설명하지만, 커밋은 해결책(fix)을 설명합니다.

**영향**: 최소 - 일단 이해하면 매핑이 직관적입니다.

### 3. Scope 사용이 표준화되지 않음

**갭**: Scope가 지원되지만 프로젝트 전반에 걸쳐 일관되게 사용되지 않습니다.

**향후 고려사항**: Scope 사용이 증가하면 scope 네이밍 컨벤션을 확립.

### 4. Commitlint 설정 없음

**갭**: 컨벤션이 문서화되어 있지만, commitlint를 통한 자동 강제가 없습니다.

**향후 고려사항**: CI/CD 파이프라인에서 커밋 메시지를 검증하기 위해 commitlint 추가.

### 5. Breaking Change가 명시적으로 처리되지 않음

**갭**: Conventional Commits 스펙은 breaking change 문법(`!` 또는 `BREAKING CHANGE:`)을 포함하지만, 우리의 접근 방식을 문서화하지 않았습니다.

**향후 고려사항**: 필요시 breaking change를 처리하는 방법 정의.

## 커스텀 명령어

다음 커스텀 명령어들이 자동으로 이 컨벤션을 강제합니다:

### `/commit`

**목적**: git 변경 사항을 분석하고 잘 구조화된 커밋 생성

**컨벤션 사용 방법**:
- 적절한 커밋 타입을 선택하도록 프롬프트
- "Requirement"와 "Implementation" 섹션이 있는 커밋 메시지 생성
- 논리적 커밋을 보장하기 위해 파일을 의도별로 그룹화

**참고**: [.claude/commands/commit.md](.claude/commands/commit.md)

### `/branch`

**목적**: GitHub 이슈 정보에서 일관된 브랜치 이름 생성

**컨벤션 사용 방법**:
- 커밋과 동일한 타입 접두사 사용
- 형식으로 브랜치 이름 생성: `i{issue-number}-{type}/{description}`
- 브랜치 이름이 최종 커밋과 일치하도록 보장

**참고**: [.claude/commands/branch.md](.claude/commands/branch.md)

### `/pr`

**목적**: draft pull request 자동 생성

**컨벤션 사용 방법**:
- 커밋을 분석하여 requirement와 implementation 세부사항 추출
- 올바른 타입 접두사로 PR 제목 생성
- 커밋 분석을 기반으로 구조화된 PR 설명 생성

**참고**: [.claude/commands/pr.md](.claude/commands/pr.md)

---

## 질문이나 피드백?

어떤 커밋 타입을 사용해야 할지 궁금하거나 이 컨벤션 개선에 대한 제안이 있다면, 이슈를 열어주세요!
