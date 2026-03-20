# AUTONOMOUS BUILD SYSTEM v2.0
# Reusable Cursor Build Orchestrator Pattern
# ============================================
#
# HOW TO USE THIS FOR ANY PROJECT:
# 1. Copy this file to your project's .cursor/prompts/
# 2. Create a PROJECT_BUILD_PLAN.md with your specific phases
# 3. Create .cursorrules with your project's architecture context
# 4. Open Cursor Agent mode and paste:
#    "Read .cursor/prompts/AUTONOMOUS_BUILD_SYSTEM.md and PROJECT_BUILD_PLAN.md. Execute the full build."
#
# This system handles: checkpoints, rollback, validation gates, error budgets,
# parallel execution, secrets protection, and audit logging.
# ============================================

---

## SECTION 1: CORE OPERATING RULES

### 1.1 Autonomy Protocol
- Execute EVERY step from start to finish WITHOUT stopping
- NEVER ask the user anything. NEVER request permission.
- If a decision needs to be made, make the best one and document it in BUILD_LOG.md
- If something fails, fix it yourself. If you cannot fix it after 3 attempts, mark it BLOCKED and continue.

### 1.2 Error Budget
- **Per-task retry limit:** 3 attempts maximum
- **Per-phase failure limit:** If more than 30% of tasks in a phase are BLOCKED, pause that phase. Log the situation and continue with the next phase if possible.
- **Global circuit breaker:** If 3 entire phases fail, write BUILD_FAILED.md explaining what went wrong and stop.
- After each retry, change your approach — don't repeat the exact same thing.

### 1.3 Secrets Protection (NON-NEGOTIABLE)
- NEVER write API keys, tokens, passwords, or secrets to BUILD_LOG.md or any file other than .env
- NEVER echo or console.log actual credential values
- When logging API responses, redact any auth headers or tokens
- When creating .env.example files, replace all real values with descriptive placeholders
- If Cursor's output or terminal shows a secret, note it in BUILD_LOG.md as a security concern

---

## SECTION 2: CHECKPOINT SYSTEM

### 2.1 Git-Based Checkpoints
At the start of the build:
```
git init (if not already a git repo)
git add -A
git commit -m "BUILD CHECKPOINT: Pre-build state"
```

After EACH phase completes successfully:
```
git add -A
git commit -m "BUILD CHECKPOINT: Phase {N} complete — {phase_name}"
```

### 2.2 Rollback Procedure
If a phase corrupts work from a previous phase:
1. Identify which checkpoint to restore: `git log --oneline`
2. Create a branch for the broken state: `git branch broken-phase-{N}`
3. Reset to the last good checkpoint: `git reset --hard {commit_hash}`
4. Restart the failed phase with a different approach
5. Log the rollback in BUILD_LOG.md

### 2.3 Never Force-Push or Delete History
All checkpoints must remain in the git log. Use branches for dead ends, not force-resets.

---

## SECTION 3: PRE-FLIGHT CHECKLIST

Before starting ANY build work, verify these and log results:

### 3.1 Environment Checks
```
[ ] Node.js installed and version >= 18
[ ] npm or yarn available
[ ] git installed
[ ] Project directory is writable
[ ] .env file exists and is not empty
[ ] .env contains real values (not just placeholders) for critical services
```

### 3.2 Credential Validation (Non-Destructive)
For each API in .env, make a lightweight read-only call to verify the credential works:
- SuiteDash: `GET /secure-api/contacts?limit=1`
- AiTable: `GET /fusion/v1/spaces`
- Stripe: Retrieve balance
- OpenAI: `GET /v1/models`
- n8n: `GET /api/v1/workflows`

Log each as CONNECTED, UNREACHABLE, or AUTH_FAILED.

**Rule:** If a credential is AUTH_FAILED, do NOT attempt to use that service during the build. Mark all dependent tasks as BLOCKED. If a service is UNREACHABLE, it may be a network issue — attempt tasks that don't require live API calls and document what needs manual completion.

### 3.3 Pre-Flight Report
Write results to BUILD_LOG.md under a "Pre-Flight Check" section before proceeding.

---

## SECTION 4: PHASE EXECUTION PROTOCOL

### 4.1 Phase Structure
Every phase MUST follow this pattern:

```
PHASE {N}: {Name}
├── GATE IN: Verify prerequisites from previous phases
├── TASKS: Execute all tasks in the phase
├── GATE OUT: Verify all expected outputs exist and are valid
├── CHECKPOINT: Git commit
└── LOG: Append results to BUILD_LOG.md
```

### 4.2 Gate In (Pre-Conditions)
Before starting a phase, check that all required inputs exist:
- Files from previous phases that this phase depends on
- npm packages that must be installed
- API connections that must be verified

If a gate-in check fails, do NOT proceed. Log it and check if the dependency can be resolved.

### 4.3 Output Contracts
Every phase MUST declare what files it will produce. After the phase completes, verify each file:
1. Exists
2. Is not empty
3. Is valid (JSON parses, JS syntax-checks with `node --check`, etc.)

Log the verification results. If any output is missing or invalid, the phase is INCOMPLETE (not failed — try to fix it before moving on).

### 4.4 Gate Out (Post-Conditions)
After a phase completes:
1. Run the output contract check
2. Run any phase-specific tests (if a test suite exists for that phase)
3. Verify no files from previous phases were corrupted (spot-check 2-3 critical files)

### 4.5 Phase Logging Template
Append this to BUILD_LOG.md after each phase:

```markdown
## Phase {N}: {Name}
- **Started:** {timestamp}
- **Completed:** {timestamp}
- **Status:** COMPLETE | INCOMPLETE | BLOCKED
- **Files Created:** {count}
- **Files Modified:** {count}
- **Tasks Completed:** {X}/{Y}
- **Tasks Blocked:** {list of blocked tasks with reasons}
- **Decisions Made:** {list of autonomous decisions with rationale}
- **Checkpoint:** {git commit hash}
```

---

## SECTION 5: DEPENDENCY GRAPH

### 5.1 Declaring Dependencies
In PROJECT_BUILD_PLAN.md, each phase should declare:
```
Phase 4: Agent Layer
  Depends on: Phase 1 (npm install), Phase 2 (AiTable table IDs in .env)
  Blocks: Phase 7 (tests need agents)
  Parallel with: Phase 5 (dashboard), Phase 6 (niche deployer)
```

### 5.2 Parallel Execution Rules
- Phases with no dependency relationship CAN run in parallel (if Cursor supports it)
- Phases that share output files CANNOT run in parallel
- When in doubt, run sequentially — correctness over speed

### 5.3 Standard Dependency Pattern
Most projects follow this:
```
Phase 1: Foundation ──┐
                      ├── Phase 2: Data Layer ──┐
                      │                         ├── Phase 4: Business Logic ──┐
                      ├── Phase 3: Integrations ┘                            │
                      │                                                       ├── Phase 7: Tests
                      ├── Phase 5: UI/Dashboard (parallel with 4) ───────────┘
                      ├── Phase 6: Deployment Tools (parallel with 4, 5) ────┘
                      └── Phase 8: Documentation (runs last, always)
```

---

## SECTION 6: SUB-AGENT SPAWNING

### 6.1 When to Spawn
Spawn sub-agents when:
- Two phases can truly run in parallel (no shared dependencies)
- A single phase has multiple independent task groups
- A task requires a different skill set (e.g., CSS styling vs. API integration)

### 6.2 Sub-Agent Communication
Each sub-agent:
- Reads its own prompt file from `.cursor/prompts/{agent-name}.md`
- Writes its output files to the project directory
- Appends its section to BUILD_LOG.md
- DOES NOT modify files owned by another agent
- DOES NOT modify .env (only the orchestrator or data agent can)

### 6.3 Agent Prompt Template
Every sub-agent prompt file should include:
1. **Role** — What this agent does
2. **Inputs** — What files/data it reads
3. **Outputs** — What files it MUST create (the output contract)
4. **Constraints** — What it must NOT do
5. **Reference Docs** — What architecture docs to read
6. **Success Criteria** — How to know it's done

---

## SECTION 7: TESTING PROTOCOL

### 7.1 Test Pyramid
Build tests in this order:
1. **Static validation** (always works, no APIs needed): JSON parsing, JS syntax, file existence
2. **Unit tests** (needs npm packages but no APIs): Function logic, scoring algorithms, routing tables
3. **Integration tests** (needs live APIs): API connectivity, data creation, webhook delivery
4. **End-to-end tests** (needs full system): Submit lead → verify full lifecycle

### 7.2 Test Execution Order
- Run static validation FIRST — if JSONs are broken, nothing else matters
- Run unit tests SECOND — if logic is wrong, integration tests will be misleading
- Run integration tests THIRD — only if credentials were verified in pre-flight
- Run E2E tests LAST — only if all previous tiers pass

### 7.3 Test Failure Handling
- Static/unit test failure = fix immediately, re-run
- Integration test failure = check if it's an auth issue (BLOCKED) or a code issue (fix it)
- E2E test failure = log it, document what manual step may be needed

---

## SECTION 8: BUILD COMPLETION

### 8.1 BUILD_COMPLETE.md Template
When the build finishes, create this file:

```markdown
# Build Complete
## Summary
- **Total Phases:** {N}
- **Phases Complete:** {X}
- **Phases Incomplete:** {Y} (with reasons)
- **Total Files Created:** {count}
- **Total Files Modified:** {count}
- **Tests Passed:** {X}/{Y}

## What Was Built
{Bulleted list of major components}

## What Requires Manual Steps
{Anything that couldn't be automated — e.g., SuiteDash UI configuration}

## What Is Blocked
{Tasks that failed 3x with explanations}

## API Connection Status
- SuiteDash: {CONNECTED/UNREACHABLE/AUTH_FAILED}
- AiTable: {status}
- Stripe: {status}
- OpenAI: {status}
- n8n: {status}

## Known Issues
{Any bugs, warnings, or concerns}

## Recommended Next Actions
{What the human should do after reviewing this build}

## Git Checkpoint History
{List of all phase commits}
```

### 8.2 Final Verification Checklist
Before writing BUILD_COMPLETE.md:
```
[ ] All expected output files exist
[ ] No placeholder credentials in any file except .env.example
[ ] All JSON files parse cleanly
[ ] All JS files pass node --check
[ ] .gitignore excludes .env and node_modules
[ ] BUILD_LOG.md has entries for every phase
[ ] Static tests pass
[ ] No secrets leaked in BUILD_LOG.md or console output
```

---

## SECTION 9: REUSABILITY GUIDE

### To use this for a new project:
1. Copy `.cursor/prompts/AUTONOMOUS_BUILD_SYSTEM.md` (this file)
2. Create `PROJECT_BUILD_PLAN.md` with your specific phases, tasks, and output contracts
3. Create `.cursorrules` with your project's architecture, API patterns, and conventions
4. Create sub-agent prompts in `.cursor/prompts/` for each major work stream
5. Create `.env` with all required credentials
6. Open Cursor Agent mode and run:
   > Read .cursor/prompts/AUTONOMOUS_BUILD_SYSTEM.md and PROJECT_BUILD_PLAN.md. Execute the full autonomous build.

### What to customize per project:
- `PROJECT_BUILD_PLAN.md` — phases, tasks, output contracts, dependency graph
- `.cursorrules` — architecture context, API patterns, naming conventions
- `.cursor/prompts/*.md` — sub-agent role definitions
- `.env` — credentials

### What stays the same every project:
- This file (AUTONOMOUS_BUILD_SYSTEM.md)
- The checkpoint system
- The gate-in/gate-out protocol
- The error budget and circuit breaker
- The testing pyramid
- The BUILD_LOG.md and BUILD_COMPLETE.md format
- The secrets protection rules
