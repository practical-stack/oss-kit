#!/usr/bin/env node
/** Agent Initializer - Usage: bun scripts/init-agent.ts <name> --path <path> --platform <platform> */

import { mkdirSync, writeFileSync, existsSync } from "fs";
import { join, resolve } from "path";

type Platform = "opencode" | "claude-code";

const OPENCODE_TEMPLATE = `import type { AgentConfig } from "@opencode-ai/sdk";
import type { AgentPromptMetadata } from "./types";

export const {{CONST_NAME}}_METADATA: AgentPromptMetadata = {
  category: "specialist",
  cost: "CHEAP",
  promptAlias: "{{AGENT_TITLE}}",
  triggers: [
    { domain: "[TODO: 도메인]", trigger: "[TODO: 위임 조건]" }
  ],
  useWhen: [
    "[TODO: 사용 시점 1]",
    "[TODO: 사용 시점 2]"
  ],
  avoidWhen: [
    "[TODO: 피해야 할 시점]"
  ]
};

export function create{{PASCAL_NAME}}Agent(model: string): AgentConfig {
  return {
    name: "{{AGENT_NAME}}",
    description: "[TODO: 에이전트 설명]",
    mode: "subagent",
    model,
    temperature: 0.1,
    tools: { include: ["read", "glob", "grep"] },
    prompt: \`## 역할

[TODO: 에이전트의 정체성과 전문 분야]

## 핵심 역량

- [TODO: 역량 1]
- [TODO: 역량 2]

## 워크플로우

호출 시:
1. [TODO: 단계 1]
2. [TODO: 단계 2]

## 출력 형식

[TODO: 구조화된 출력 형식]

## 제약 조건

- [TODO: 제약 1]\`
  };
}
`;

function toTitleCase(name: string): string {
  return name.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

function toPascalCase(name: string): string {
  return name.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join("");
}

function toConstCase(name: string): string {
  return name.toUpperCase().replace(/-/g, "_");
}

function validateAgentName(name: string): { valid: boolean; error?: string } {
  if (!name) return { valid: false, error: "Agent name is required" };
  if (name.length > 40) return { valid: false, error: "Name must be 40 characters or less" };
  if (!/^[a-z0-9-]+$/.test(name)) return { valid: false, error: "Only lowercase, numbers, and hyphens allowed" };
  return { valid: true };
}

function applyTemplate(template: string, name: string): string {
  return template
    .replace(/\{\{AGENT_NAME\}\}/g, name)
    .replace(/\{\{AGENT_TITLE\}\}/g, toTitleCase(name))
    .replace(/\{\{PASCAL_NAME\}\}/g, toPascalCase(name))
    .replace(/\{\{CONST_NAME\}\}/g, toConstCase(name));
}

function initAgent(name: string, basePath: string, platform: Platform): { success: boolean; path?: string; error?: string } {
  const validation = validateAgentName(name);
  if (!validation.valid) return { success: false, error: validation.error };

  const outputDir = resolve(basePath);
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  try {
    let filePath: string;
    let content: string;

    filePath = join(outputDir, `${name}.ts`);
    content = applyTemplate(OPENCODE_TEMPLATE, name);

    writeFileSync(filePath, content, "utf-8");
    console.log(`Created agent file: ${filePath}`);
    console.log("\nNext steps:");
    console.log("1. Complete the [TODO] items");
    console.log("2. Register the agent in your orchestrator");
    console.log("3. Test with sample delegation");

    return { success: true, path: filePath };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { success: false, error: `File creation error: ${message}` };
  }
}

function printUsage(): void {
  console.log(`
Agent Initializer

Usage:
  bun scripts/init-agent.ts <agent-name> --path <path> --platform <platform>

Arguments:
  agent-name    Agent name (kebab-case)
  --path        Output directory
  --platform    Platform (opencode, claude-code)

Examples:
  bun scripts/init-agent.ts security-auditor --path src/agents --platform opencode
  bun scripts/init-agent.ts data-analyst --path .claude/agents --platform claude-code
`);
}

function main(): void {
  const args = process.argv.slice(2);
  const pathIndex = args.indexOf("--path");
  const platformIndex = args.indexOf("--platform");

  if (args.length < 5 || pathIndex === -1 || platformIndex === -1) {
    printUsage();
    process.exit(1);
  }

  const name = args[0];
  const basePath = args[pathIndex + 1];
  const platform = args[platformIndex + 1] as Platform;

  if (!["opencode", "claude-code"].includes(platform)) {
    console.error("Error: Invalid platform. Choose from: opencode, claude-code");
    process.exit(1);
  }

  console.log(`Initializing agent: ${name}`);
  console.log(`Platform: ${platform}`);
  console.log(`Path: ${basePath}\n`);

  const result = initAgent(name, basePath, platform);

  if (!result.success) {
    console.error(`Error: ${result.error}`);
    process.exit(1);
  }
}

main();
