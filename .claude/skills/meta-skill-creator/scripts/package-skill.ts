#!/usr/bin/env node
/** Skill Packager - Usage: bun scripts/package-skill.ts <skill-folder> [output-dir] */

import { existsSync, readFileSync, readdirSync, statSync, writeFileSync, mkdirSync } from "fs";
import { join, basename, resolve } from "path";
import { execSync } from "child_process";

interface PackageResult {
  success: boolean;
  outputPath?: string;
  error?: string;
}

function getAllFiles(dir: string, baseDir: string = dir): string[] {
  const files: string[] = [];
  const entries = readdirSync(dir);

  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      files.push(...getAllFiles(fullPath, baseDir));
    } else {
      files.push(fullPath);
    }
  }

  return files;
}

function validateBeforePackage(skillPath: string): { valid: boolean; error?: string } {
  const skillMdPath = join(skillPath, "SKILL.md");
  
  if (!existsSync(skillMdPath)) {
    return { valid: false, error: "SKILL.md 파일이 없습니다" };
  }

  const content = readFileSync(skillMdPath, "utf-8");
  const todoMatches = content.match(/\[TODO[^\]]*\]/gi);
  
  if (todoMatches && todoMatches.length > 0) {
    return { valid: false, error: `완료되지 않은 TODO 항목이 ${todoMatches.length}개 있습니다` };
  }

  const frontmatterMatch = content.match(/^---\s*\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) {
    return { valid: false, error: "YAML frontmatter가 없습니다" };
  }

  if (!frontmatterMatch[1].includes("name:")) {
    return { valid: false, error: "frontmatter에 'name' 필드가 없습니다" };
  }

  if (!frontmatterMatch[1].includes("description:")) {
    return { valid: false, error: "frontmatter에 'description' 필드가 없습니다" };
  }

  return { valid: true };
}

function packageSkill(skillPath: string, outputDir?: string): PackageResult {
  const resolvedPath = resolve(skillPath);
  const skillName = basename(resolvedPath);

  if (!existsSync(resolvedPath)) {
    return { success: false, error: `스킬 폴더를 찾을 수 없습니다: ${resolvedPath}` };
  }

  if (!statSync(resolvedPath).isDirectory()) {
    return { success: false, error: `경로가 디렉토리가 아닙니다: ${resolvedPath}` };
  }

  console.log("🔍 패키징 전 검증 중...");
  const validation = validateBeforePackage(resolvedPath);
  if (!validation.valid) {
    return { success: false, error: validation.error };
  }
  console.log("✅ 검증 통과\n");

  const targetDir = outputDir ? resolve(outputDir) : process.cwd();
  if (!existsSync(targetDir)) {
    mkdirSync(targetDir, { recursive: true });
  }

  const outputPath = join(targetDir, `${skillName}.skill`);
  const files = getAllFiles(resolvedPath);

  console.log("📦 파일 패키징 중:");
  
  try {
    const zipCommand = `cd "${resolvedPath}" && zip -r "${outputPath}" .`;
    execSync(zipCommand, { stdio: "pipe" });

    for (const file of files) {
      const relativePath = file.replace(resolvedPath + "/", "");
      console.log(`   - ${relativePath}`);
    }

    console.log(`\n✅ 패키징 완료: ${outputPath}`);
    return { success: true, outputPath };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { success: false, error: `패키징 오류: ${message}` };
  }
}

function main(): void {
  const args = process.argv.slice(2);

  if (args.length < 1) {
    console.log("사용법: bun scripts/package-skill.ts <skill-folder> [output-dir]");
    console.log("\n예시:");
    console.log("  bun scripts/package-skill.ts .claude/skills/my-skill");
    console.log("  bun scripts/package-skill.ts .claude/skills/my-skill ./dist");
    process.exit(1);
  }

  const skillPath = args[0];
  const outputDir = args[1];

  console.log(`📦 스킬 패키징: ${skillPath}`);
  if (outputDir) {
    console.log(`   출력 디렉토리: ${outputDir}`);
  }
  console.log();

  const result = packageSkill(skillPath, outputDir);

  if (result.success) {
    process.exit(0);
  } else {
    console.error(`❌ 오류: ${result.error}`);
    process.exit(1);
  }
}

main();
