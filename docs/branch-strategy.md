# Branch Strategy

This repository now follows a deliberate split between:
- **upstream contribution work**
- **fork-facing documentation/presentation work**
- **fork-only integrated app work**

## Remotes

- `origin` → Clem's upstream repository
- `dknauss` → Dan Knauss's fork

## Main branches

### `main`

Purpose:
- local upstream baseline
- should track `origin/main`
- should stay clean and as close to upstream as possible

Use it for:
- rebasing
- creating upstream contribution branches
- checking the current upstream state

Avoid using it for:
- fork README experiments
- fork-only app integration work
- visitor-facing customizations

### `fork-main`

Purpose:
- local tracking branch for `dknauss/main`
- visitor-facing fork documentation work

Use it for:
- fork README updates
- `CONTRIBUTING.md` changes aimed at meetup attendees/students
- other fork-presentation content

Avoid using it for:
- upstream PR work
- app feature development intended for Clem's repo

### `app-main`

Purpose:
- the integrated working app branch on the fork
- combines the current app improvements without affecting the fork's docs-oriented `main`

Use it for:
- running the current working app on the fork
- branching future fork app experiments
- combining merged feature branches for personal/demo use

## Feature branches

Feature branches use the `codex/` prefix.

Examples:
- `codex/sveltekit-sqlite-ratings`
- `codex/card-image-loading`
- `codex/github-ci`
- `codex/gsd-tdd-bdd`

### Upstream-facing feature branches

These should generally branch from:
- `main`
- or another upstream-aligned feature branch if intentionally stacked

They should be used for:
- changes likely to become upstream PRs
- focused, reviewable work

### Fork-only branches

These can branch from:
- `fork-main`
- `app-main`

They should be used for:
- fork-specific docs
- experiments not meant for upstream
- integrated personal/demo branches

## Current practical workflow

### For upstream PR work
1. switch to `main`
2. update from `origin/main`
3. create a new `codex/...` branch
4. do the work
5. push to `dknauss`
6. open PR to upstream

### For fork README or tutorial docs
1. switch to `fork-main`
2. make docs changes
3. push to `dknauss/main`

### For fork app integration
1. switch to `app-main`
2. merge or branch app work there
3. push to `dknauss/app-main`

## Rule of thumb

- **upstream baseline** → `main`
- **fork docs** → `fork-main` / fork `main`
- **fork integrated app** → `app-main`
- **reviewable feature work** → `codex/*`
