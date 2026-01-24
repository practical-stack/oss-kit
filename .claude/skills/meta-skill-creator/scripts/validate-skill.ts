#!/usr/bin/env node
/** Skill Validator - Usage: bun scripts/validate-skill.ts <skill-folder> */

import { existsSync, readFileSync, readdirSync, statSync } from "fs";
import { join, basename } from "path";

interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

interface Frontmatter {
  name?: string;
  description?: string;
  [key: string]: unknown;
}

function parseFrontmatter(content: string): { frontmatter: Frontmatter; body: string } | null {
  const match = content.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/);
  if (!match) return null;

  const yamlContent = match[1];
  const body = match[2];
  const frontmatter: Frontmatter = {};

  for (const line of yamlContent.split("\n")) {
    const colonIndex = line.indexOf(":");
    if (colonIndex > 0) {
      const key = line.slice(0, colonIndex).trim();
      const value = line.slice(colonIndex + 1).trim();
      if (key && !key.startsWith(" ")) {
        frontmatter[key] = value.replace(/^["']|["']$/g, "");
      }
    }
  }

  return { frontmatter, body };
}

function validateSkill(skillPath: string): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const skillName = basename(skillPath);

  if (!existsSync(skillPath)) {
    return { valid: false, errors: [`스킬 폴더를 찾을 수 없습니다: ${skillPath}`], warnings };
  }

  if (!statSync(skillPath).isDirectory()) {
    return { valid: false, errors: [`경로가 디렉토리가 아닙니다: ${skillPath}`], warnings };
  }

  const skillMdPath = join(skillPath, "SKILL.md");
  if (!existsSync(skillMdPath)) {
    return { valid: false, errors: ["SKILL.md 파일이 없습니다"], warnings };
  }

  const content = readFileSync(skillMdPath, "utf-8");
  const parsed = parseFrontmatter(content);

  if (!parsed) {
    errors.push("SKILL.md에 유효한 YAML frontmatter가 없습니다 (--- ... --- 형식 필요)");
    return { valid: false, errors, warnings };
  }

  const { frontmatter, body } = parsed;

  if (!frontmatter.name) {
    errors.push("frontmatter에 'name' 필드가 없습니다");
  } else {
    const name = String(frontmatter.name);
    if (!/^[a-z0-9-]+$/.test(name)) {
      errors.push(`'name'이 kebab-case가 아닙니다: ${name}`);
    }
    if (name.length > 40) {
      errors.push(`'name'이 40자를 초과합니다: ${name.length}자`);
    }
    if (name !== skillName) {
      errors.push(`'name'이 디렉토리명과 일치하지 않습니다: ${name} vs ${skillName}`);
    }
  }

  if (!frontmatter.description) {
    errors.push("frontmatter에 'description' 필드가 없습니다");
  } else {
    const desc = String(frontmatter.description);
    if (desc.length < 20) {
      warnings.push("description이 너무 짧습니다 (트리거 조건과 목적을 포함하세요)");
    }
  }

  const lines = body.split("\n");
  if (lines.length > 500) {
    warnings.push(`SKILL.md가 500줄을 초과합니다 (${lines.length}줄) - references/로 분할을 권장합니다`);
  }

  const todoMatches = content.match(/\[TODO[^\]]*\]/gi);
  if (todoMatches && todoMatches.length > 0) {
    errors.push(`완료되지 않은 TODO 항목이 ${todoMatches.length}개 있습니다`);
  }

  const unnecessaryFiles = ["README.md", "CHANGELOG.md", "CONTRIBUTING.md", "LICENSE.md"];
  for (const file of unnecessaryFiles) {
    if (existsSync(join(skillPath, file))) {
      warnings.push(`불필요한 파일이 있습니다: ${file}`);
    }
  }

  const refsDir = join(skillPath, "references");
  if (existsSync(refsDir) && statSync(refsDir).isDirectory()) {
    const refFiles = readdirSync(refsDir).filter((f) => f.endsWith(".md"));
    for (const refFile of refFiles) {
      const refPath = `references/${refFile}`;
      if (!content.includes(refPath) && !content.includes(refFile)) {
        warnings.push(`references/${refFile}이 SKILL.md에서 링크되지 않았습니다`);
      }
    }
  }

  return { valid: errors.length === 0, errors, warnings };
}

function main(): void {
  const args = process.argv.slice(2);

  if (args.length < 1) {
    console.log("사용법: bun scripts/validate-skill.ts <skill-folder>");
    process.exit(1);
  }

  const skillPath = args[0];
  console.log(`🔍 스킬 검증 중: ${skillPath}\n`);

  const result = validateSkill(skillPath);

  if (result.errors.length > 0) {
    console.log("❌ 오류:");
    for (const error of result.errors) {
      console.log(`   - ${error}`);
    }
    console.log();
  }

  if (result.warnings.length > 0) {
    console.log("⚠️  경고:");
    for (const warning of result.warnings) {
      console.log(`   - ${warning}`);
    }
    console.log();
  }

  if (result.valid) {
    console.log("✅ 스킬 검증 통과");
    process.exit(0);
  } else {
    console.log("❌ 스킬 검증 실패");
    process.exit(1);
  }
}

main();
