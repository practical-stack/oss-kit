# Workflow Patterns

Detailed guidance for structuring skill workflows.

## Sequential Workflows

For complex tasks, break operations into clear, sequential steps:

```markdown
## Workflow

PDF 폼 작성은 다음 단계를 따릅니다:

1. 폼 분석 (analyze-form.ts 실행)
2. 필드 매핑 생성 (fields.json 편집)
3. 매핑 검증 (validate-fields.ts 실행)
4. 폼 작성 (fill-form.ts 실행)
5. 출력 검증 (verify-output.ts 실행)
```

## Conditional Workflows

For tasks with branching logic, guide through decision points:

```markdown
## Workflow Decision Tree

1. 작업 유형 결정:
   **새 콘텐츠 생성?** → "생성 워크플로우" 따르기
   **기존 콘텐츠 수정?** → "편집 워크플로우" 따르기

### 생성 워크플로우
1. 템플릿 선택
2. 데이터 입력
3. 검증 및 출력

### 편집 워크플로우
1. 파일 로드
2. 변경 사항 적용
3. 백업 후 저장
```

## Iteration Patterns

For workflows that may need multiple passes:

```markdown
## 반복 워크플로우

1. 초기 구현 수행
2. 검증 실행
3. 검증 통과? 
   - ✅ 예: 완료
   - ❌ 아니오: 오류 수정 후 2단계로 복귀

최대 반복 횟수: 3회 (초과 시 사용자에게 알림)
```

## Parallel Execution Patterns

For independent tasks that can run simultaneously:

```markdown
## 병렬 실행

다음 작업들은 동시에 실행 가능합니다:

| 작업 | 담당 | 상태 |
|------|------|------|
| API 문서 분석 | librarian | 백그라운드 |
| 코드베이스 탐색 | explore | 백그라운드 |
| 유사 구현 검색 | explore | 백그라운드 |

모든 작업 완료 후 결과 종합
```

## Error Handling Patterns

```markdown
## 오류 처리

### 재시도 가능한 오류
- 네트워크 타임아웃 → 3회까지 재시도
- 일시적 API 오류 → 지수 백오프로 재시도

### 복구 불가능한 오류
- 파일 손상 → 사용자에게 알림 후 중단
- 권한 부족 → 필요한 권한 안내 후 중단
```

## Verification Patterns

```markdown
## 검증 체크리스트

각 작업 완료 후:
- [ ] 출력 파일 존재 확인
- [ ] 파일 형식 유효성 검증
- [ ] 예상 결과와 비교
- [ ] 부작용 없음 확인
```
