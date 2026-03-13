Run one iteration of the adaptive build loop for the doef project.

This is a thin wrapper around the workspace-level `/build-loop` command with `project=projects/doef` pre-filled.

## Usage

`/doef-calculate-next` — run one iterate action (default)
`/doef-calculate-next action=start phase=<phase>` — start a new phase
`/doef-calculate-next action=resume` — resume from checkpoint or pause
`/doef-calculate-next action=status` — show current loop state
`/doef-calculate-next action=init` — scaffold build loop files (already done)

## Delegates to

Execute the full `/build-loop` command from `/Users/jacobusbrink/Code/.claude/commands/build-loop.md` with:

- `project` = `projects/doef` (resolves to `/Users/jacobusbrink/Code/projects/doef`)
- `action` = the `action` parameter passed here, defaulting to `iterate`
- All other parameters (`phase`, `goal`, `interval`) passed through as-is.

Read and follow that command in full.
