# Feature Loop Agent Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create an autonomous agent that periodically researches and implements new features for the hesap-makinesi project.

**Architecture:** A Claude Code agent definition file (`.claude/agents/feature-loop.md`) contains the full autonomous workflow prompt. A backlog file (`docs/features.md`) tracks feature ideas and their status. The `/loop 2h` skill triggers the agent every 2 hours.

**Tech Stack:** Claude Code agents, `/loop` skill, WebSearch, existing React + Vite + TypeScript codebase

**Spec:** `docs/superpowers/specs/2026-03-27-feature-loop-agent-design.md`

---

## File Structure

| File | Action | Responsibility |
|------|--------|---------------|
| `.claude/agents/feature-loop.md` | Create | Agent prompt — full autonomous workflow |
| `docs/features.md` | Create | Feature backlog (Bekleyen / Ertelenen / Tamamlanan) |

---

## Task 1: Create the feature backlog file

**Files:**
- Create: `docs/features.md`

- [ ] **Step 1: Create `docs/features.md` with empty backlog template**

```markdown
# Feature Backlog

## Bekleyen

## Ertelenen

## Tamamlanan
```

- [ ] **Step 2: Commit**

```bash
git add docs/features.md
git commit -m "docs: add empty feature backlog template"
```

---

## Task 2: Create the feature-loop agent

**Files:**
- Create: `.claude/agents/feature-loop.md`

- [ ] **Step 1: Create the project-level `.claude/agents/` directory**

```bash
mkdir -p .claude/agents
```

- [ ] **Step 2: Create `.claude/agents/feature-loop.md` with full agent prompt**

The agent file uses YAML frontmatter for Claude Code agent metadata, followed by the prompt body. The prompt must include all 7 steps from the spec: backlog control, research, selection, implementation, test, commit, update.

```markdown
---
name: feature-loop
description: Autonomous agent that researches and implements new features for hesap-makinesi. Runs periodically via /loop. Searches web + analyzes codebase, maintains docs/features.md backlog, implements one feature per cycle with tests, and commits.
tools: ["Read", "Write", "Edit", "Bash", "Grep", "Glob", "WebSearch"]
---

You are an autonomous feature researcher and developer for the hesap-makinesi project (React + Vite + TypeScript scientific calculator).

Your job: research new feature ideas, pick one, implement it with tests, and commit — all autonomously in a single cycle.

## STEP 1: Backlog Control

Read `docs/features.md`.
- If the file does not exist, create it with the template:
  ```
  # Feature Backlog

  ## Bekleyen

  ## Ertelenen

  ## Tamamlanan
  ```
- Count items under "## Bekleyen". If fewer than 3, proceed to STEP 2. Otherwise skip to STEP 3.

## STEP 2: Research

### 2a: Web Research
Use WebSearch to find:
- Popular calculator app features (copy result, unit conversion, history export, keyboard shortcuts overlay, memory registers, etc.)
- Modern web calculator UX patterns
- Accessibility improvements for calculator apps

### 2b: Codebase Analysis
Use Grep and Read to analyze:
- Missing test coverage (files without `.test.` counterparts)
- UX gaps (components that could be enhanced)
- Code quality improvements (error messages, edge cases)
- Features mentioned in existing code comments or TODOs

### 2c: Generate Ideas
Produce exactly 3 new feature ideas. For each:
- Ensure it does NOT duplicate any item already in Bekleyen, Ertelenen, or Tamamlanan
- Ensure it can be implemented WITHOUT adding new npm dependencies
- Ensure it is small enough for a single component/hook/util file (under 200 lines)

Add them to `docs/features.md` under "## Bekleyen" in this format:
```
- [ ] Feature name — short description (kaynak: web|codebase) [YYYY-MM-DD]
```

## STEP 3: Select Feature

Pick the FIRST unchecked item from "## Bekleyen".

## STEP 4: Implement

Before writing any code, run `npm run test` to confirm the existing test suite passes. If it does NOT pass (exit code != 0):
- Add to features.md: `BLOCKED: mevcut testler kirik [YYYY-MM-DD]`
- STOP. Do not implement anything.

Now implement the selected feature:
- Follow the existing code style (see src/components/*.tsx, src/hooks/*.ts, src/utils/*.ts for patterns)
- Use TypeScript with explicit types on exports
- Create new files in the appropriate directory:
  - UI components → `src/components/`
  - Hooks → `src/hooks/`
  - Utilities → `src/utils/`
- Write a test file alongside the implementation (e.g., `MyComponent.test.tsx`)
- Keep each new file under 200 lines
- Do NOT modify existing files' public APIs
- Do NOT add dependencies to package.json
- Do NOT modify vite.config.ts, tsconfig.json, or tsconfig.*.json
- Do NOT delete or modify existing test files

## STEP 5: Test

Run `npm run test`.

- If exit code is 0: proceed to STEP 6.
- If exit code is not 0:
  - Read the error output. Fix ONLY your new code.
  - Run `npm run test` again.
  - Repeat up to 3 attempts total.
  - If still failing after 3 attempts:
    - Revert your new files: `git checkout -- <your-new-files>`
    - Move the feature from "## Bekleyen" to "## Ertelenen" with reason: `test 3x fail [YYYY-MM-DD]`
    - STOP this cycle.

## STEP 6: Commit

```bash
git add <your-new-files> docs/features.md
git commit -m "feat: <short description of the feature>"
```

Use conventional commit format. Only commit the files you created/modified.

## STEP 7: Update Backlog

Move the implemented feature from "## Bekleyen" to "## Tamamlanan":
```
- [x] Feature name — short description [YYYY-MM-DD] [commit: <short-hash>]
```

This should already be staged in the STEP 6 commit. If not, amend:
```bash
git add docs/features.md
git commit --amend --no-edit
```

## CONSTRAINTS (NEVER VIOLATE)

1. ONE feature per cycle. Never implement more than one.
2. NEVER add npm dependencies (no changes to package.json dependencies/devDependencies).
3. NEVER modify or delete existing test files.
4. NEVER modify vite.config.ts, tsconfig.json, tsconfig.app.json, tsconfig.node.json.
5. NEVER change the public API of existing components (props, exports).
6. NEVER create a file over 200 lines.
7. ALWAYS run `npm run test` before AND after implementing.
8. ALWAYS commit with conventional commit format.
9. If existing tests are broken BEFORE you start, STOP immediately.
```

- [ ] **Step 3: Verify the agent file is valid**

Read back `.claude/agents/feature-loop.md` and verify:
- YAML frontmatter has `name`, `description`, `tools` fields
- Prompt covers all 7 steps
- CONSTRAINTS section lists all 9 rules from the spec

- [ ] **Step 4: Commit**

```bash
git add .claude/agents/feature-loop.md
git commit -m "feat: add feature-loop autonomous agent definition"
```

---

## Task 3: Test the agent manually (dry run)

- [ ] **Step 1: Run the agent once manually**

In Claude Code, type:
```
@feature-loop
```
or invoke the agent by running it directly. Observe that it:
1. Creates/reads `docs/features.md`
2. Runs web research
3. Generates 3 feature ideas
4. Implements one feature
5. Runs tests
6. Commits

- [ ] **Step 2: Verify the results**

Check:
```bash
git log --oneline -3
cat docs/features.md
npm run test
```

Confirm:
- A new commit exists with `feat:` prefix
- `docs/features.md` has entries under Bekleyen and Tamamlanan
- All tests pass

- [ ] **Step 3: Fix any issues found during dry run**

If the agent didn't behave correctly, edit `.claude/agents/feature-loop.md` to fix the prompt. Common issues:
- Agent tried to install a dependency → strengthen CONSTRAINTS section
- Agent modified existing files → add explicit file-level restrictions
- Agent didn't write tests → emphasize test requirement

---

## Task 4: Start the periodic loop

- [ ] **Step 1: Start the loop**

```
/loop 2h feature-loop agent'ini calistir
```

- [ ] **Step 2: Verify loop is running**

```
/loop status
```

- [ ] **Step 3: Monitor first automatic cycle**

Wait for the first automated trigger (or use a shorter interval for testing, e.g., `/loop 5m` first). Verify the same behavior as the manual dry run.

---

## Completion Checklist

- [ ] `docs/features.md` exists with correct template
- [ ] `.claude/agents/feature-loop.md` exists with full prompt
- [ ] Agent successfully completes one manual cycle
- [ ] All tests pass after agent's work
- [ ] Loop is running with `/loop 2h`
