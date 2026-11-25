# PBI Lifecycle Assistant (hackathon prototype)

Synthetic demo of: rough request → reviewed PBI → generated documentation PR, using GitHub Copilot custom agents.

## Components
- `.github/ISSUE_TEMPLATE/pbi.yml` – structured PBI intake form
- `.github/agents/pbi-refiner.md` – assesses a PBI against `standards/definition-of-ready.md`
- `.github/agents/documentation-writer.md` – produces `docs/<feature>.md` from PBI + change + test evidence
- `sample-pbis/`, `sample-change/` – simulated Azure Boards PBIs, code change and pipeline evidence

## Demo (5 min)
1. Open `sample-pbis/incomplete-pbi.md` (or file it via the issue form).
2. Run the `pbi-refiner` agent → "Not Ready" + questions.
3. Answer the questions; re-run → "Ready" (compare `completed-pbi.md`).
4. Apply the `done` label to the issue.
5. Run `documentation-writer` → new file in `docs/`, opened as a PR.
6. Human reviews and approves the PR.

## Out of scope (production follow-ups)
Azure DevOps auth, service hooks, Azure DevOps MCP Server, custom UI.
