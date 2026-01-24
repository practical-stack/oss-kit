#!/usr/bin/env node
/** Agent Validator - Usage: bun scripts/validate-agent.ts <agent-file> */

import { existsSync, readFileSync, statSync } from "fs";
import { extname } from "path";

interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

function validateOpenCodeAgent(filePath: string): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const content = readFileSync(filePath, "utf-8");

  if (!content.includes("export function create")) {
    errors.push("Missing agent factory function (export function createXxxAgent)");
  }

  if (!content.includes(": AgentConfig")) {
    warnings.push("Missing AgentConfig return type annotation");
  }

  if (!content.includes("name:")) {
    errors.push("Missing 'name' field in agent config");
  }

  if (!content.includes("description:")) {
    errors.push("Missing 'description' field in agent config");
  }

  if (!content.includes("prompt:")) {
    errors.push("Missing 'prompt' field in agent config");
  }

  const todoMatches = content.match(/\[TODO[^\]]*\]/gi);
  if (todoMatches && todoMatches.length > 0) {
    errors.push(`${todoMatches.length} incomplete [TODO] items found`);
  }

  return { valid: errors.length === 0, errors, warnings };
}

function validateAgent(filePath: string): ValidationResult {
  if (!existsSync(filePath)) {
    return { valid: false, errors: [`File not found: ${filePath}`], warnings: [] };
  }

  if (statSync(filePath).isDirectory()) {
    return { valid: false, errors: [`Path is a directory, not a file: ${filePath}`], warnings: [] };
  }

  const ext = extname(filePath);

  if (ext === ".ts") {
    return validateOpenCodeAgent(filePath);
  } else {
    return { valid: false, errors: [`Unsupported file type: ${ext} (expected .ts)`], warnings: [] };
  }
}

function main(): void {
  const args = process.argv.slice(2);

  if (args.length < 1) {
    console.log("Usage: bun scripts/validate-agent.ts <agent-file>");
    console.log("\nExamples:");
    console.log("  bun scripts/validate-agent.ts src/agents/my-agent.ts");
    console.log("  bun scripts/validate-agent.ts .claude/agents/my-agent.ts");
    process.exit(1);
  }

  const filePath = args[0];
  console.log(`Validating agent: ${filePath}\n`);

  const result = validateAgent(filePath);

  if (result.errors.length > 0) {
    console.log("Errors:");
    for (const error of result.errors) {
      console.log(`   - ${error}`);
    }
    console.log();
  }

  if (result.warnings.length > 0) {
    console.log("Warnings:");
    for (const warning of result.warnings) {
      console.log(`   - ${warning}`);
    }
    console.log();
  }

  if (result.valid) {
    console.log("Agent validation passed");
    process.exit(0);
  } else {
    console.log("Agent validation failed");
    process.exit(1);
  }
}

main();
