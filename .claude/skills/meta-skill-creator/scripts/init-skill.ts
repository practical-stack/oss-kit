#!/usr/bin/env node
/**
 * Skill Initializer - Creates a new skill from template
 * Usage: bun scripts/init-skill.ts <skill-name> --path <path>
 * Example: bun scripts/init-skill.ts my-skill --path .cursor/skills
 */

import { mkdirSync, writeFileSync, existsSync, chmodSync } from "fs";
import { join, resolve } from "path";

const SKILL_MD_TEMPLATE = `---
name: {{SKILL_NAME}}
description: |
  [TODO: 스킬의 목적과 사용 시점을 명확하게 설명하세요]
  [TODO: 트리거 조건을 포함하세요 - 예: "~할 때 사용", "~라고 말하면 활성화"]
  트리거: "키워드1", "키워드2", "keyword3"
---

# {{SKILL_TITLE}}

## 개요

[TODO: 이 스킬이 무엇을 하는지 1-2문장으로 설명하세요]

## 빠른 시작

[TODO: 즉시 사용 가능한 예시를 제공하세요]

\`\`\`bash
# 예시 명령어
bun scripts/example.ts
\`\`\`

## 사용 가이드

### 기본 사용법

[TODO: 기본적인 사용 방법을 설명하세요]

### 고급 기능

[TODO: 필요한 경우 고급 기능을 설명하세요]

## 리소스

### scripts/

실행 가능한 스크립트들이 포함됩니다.

- \`example.ts\` - 예시 스크립트 (필요에 따라 수정하거나 삭제하세요)

### references/

상세 문서가 필요한 경우 이 디렉토리에 추가합니다.

- \`guide.md\` - 상세 가이드 (필요에 따라 수정하거나 삭제하세요)

### assets/

출력물에 사용되는 파일들이 포함됩니다.

- 템플릿, 이미지, 설정 파일 등

---

**불필요한 디렉토리나 파일은 삭제하세요.** 모든 스킬이 세 가지 리소스 유형을 모두 필요로 하지는 않습니다.
`;

const EXAMPLE_SCRIPT_TEMPLATE = `#!/usr/bin/env node

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  console.log("{{SKILL_NAME}} 스크립트 실행 중...");
  console.log("인자:", args);
  console.log("✅ 스크립트 실행 완료");
}

main().catch((error) => {
  console.error("❌ 오류 발생:", error.message);
  process.exit(1);
});
`;

const REFERENCE_TEMPLATE = `# {{SKILL_TITLE}} - 상세 가이드

이 문서는 상세 레퍼런스 문서의 플레이스홀더입니다.
실제 내용으로 교체하거나 필요 없으면 삭제하세요.

## 레퍼런스 문서가 유용한 경우

- 종합적인 API 문서
- 상세 워크플로우 가이드
- 복잡한 다단계 프로세스
- SKILL.md에 담기엔 너무 긴 정보
- 특정 사용 사례에만 필요한 콘텐츠

## 구조 제안

### API 레퍼런스 예시

- 개요
- 인증
- 엔드포인트 및 예시
- 에러 코드
- 속도 제한

### 워크플로우 가이드 예시

- 사전 요구사항
- 단계별 지침
- 일반적인 패턴
- 문제 해결
- 모범 사례
`;

function toTitleCase(skillName: string): string {
  return skillName
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function validateSkillName(name: string): { valid: boolean; error?: string } {
  if (!name) {
    return { valid: false, error: "스킬 이름이 필요합니다" };
  }
  if (name.length > 40) {
    return { valid: false, error: "스킬 이름은 40자를 초과할 수 없습니다" };
  }
  if (!/^[a-z0-9-]+$/.test(name)) {
    return { valid: false, error: "스킬 이름은 소문자, 숫자, 하이픈만 사용할 수 있습니다" };
  }
  if (name.startsWith("-") || name.endsWith("-")) {
    return { valid: false, error: "스킬 이름은 하이픈으로 시작하거나 끝날 수 없습니다" };
  }
  return { valid: true };
}

function applyTemplate(template: string, skillName: string): string {
  const skillTitle = toTitleCase(skillName);
  return template
    .replace(/\{\{SKILL_NAME\}\}/g, skillName)
    .replace(/\{\{SKILL_TITLE\}\}/g, skillTitle);
}

interface InitResult {
  success: boolean;
  path?: string;
  error?: string;
}

function initSkill(skillName: string, basePath: string): InitResult {
  const validation = validateSkillName(skillName);
  if (!validation.valid) {
    return { success: false, error: validation.error };
  }

  const skillDir = resolve(basePath, skillName);

  if (existsSync(skillDir)) {
    return { success: false, error: `스킬 디렉토리가 이미 존재합니다: ${skillDir}` };
  }

  try {
    mkdirSync(skillDir, { recursive: true });
    mkdirSync(join(skillDir, "scripts"), { recursive: true });
    mkdirSync(join(skillDir, "references"), { recursive: true });
    mkdirSync(join(skillDir, "assets"), { recursive: true });
    console.log(`✅ 스킬 디렉토리 생성됨: ${skillDir}`);

    const skillMdContent = applyTemplate(SKILL_MD_TEMPLATE, skillName);
    writeFileSync(join(skillDir, "SKILL.md"), skillMdContent, "utf-8");
    console.log("✅ SKILL.md 생성됨");

    const scriptContent = applyTemplate(EXAMPLE_SCRIPT_TEMPLATE, skillName);
    const scriptPath = join(skillDir, "scripts", "example.ts");
    writeFileSync(scriptPath, scriptContent, "utf-8");
    chmodSync(scriptPath, 0o755);
    console.log("✅ scripts/example.ts 생성됨");

    const refContent = applyTemplate(REFERENCE_TEMPLATE, skillName);
    writeFileSync(join(skillDir, "references", "guide.md"), refContent, "utf-8");
    console.log("✅ references/guide.md 생성됨");

    writeFileSync(join(skillDir, "assets", ".gitkeep"), "", "utf-8");
    console.log("✅ assets/.gitkeep 생성됨");

    console.log(`\n✅ 스킬 '${skillName}' 초기화 완료: ${skillDir}`);
    console.log("\n다음 단계:");
    console.log("1. SKILL.md의 [TODO] 항목들을 완성하세요");
    console.log("2. scripts/, references/, assets/ 내 예시 파일을 수정하거나 삭제하세요");
    console.log("3. 준비가 되면 validate-skill.ts를 실행하여 구조를 검증하세요");

    return { success: true, path: skillDir };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { success: false, error: `디렉토리 생성 오류: ${message}` };
  }
}

function printUsage(): void {
  console.log(`
스킬 초기화 도구

사용법:
  bun scripts/init-skill.ts <skill-name> --path <path>

인자:
  skill-name    스킬 이름 (kebab-case, 예: my-awesome-skill)
  --path        스킬이 생성될 경로

예시:
  bun scripts/init-skill.ts my-new-skill --path .claude/skills
  bun scripts/init-skill.ts api-helper --path .opencode/skills
`);
}

function main(): void {
  const args = process.argv.slice(2);
  const pathIndex = args.indexOf("--path");
  
  if (args.length < 3 || pathIndex === -1 || pathIndex + 1 >= args.length) {
    printUsage();
    process.exit(1);
  }

  const skillName = args[0];
  const basePath = args[pathIndex + 1];

  console.log(`🚀 스킬 초기화 중: ${skillName}`);
  console.log(`   위치: ${basePath}\n`);

  const result = initSkill(skillName, basePath);

  if (result.success) {
    process.exit(0);
  } else {
    console.error(`❌ 오류: ${result.error}`);
    process.exit(1);
  }
}

main();
