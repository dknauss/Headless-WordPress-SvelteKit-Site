# GSD Project Scaffolding

This repository now includes lightweight GSD-style planning scaffolding.

## Purpose

Use `.planning/` to track:
- active phase work
- implementation plans
- assumptions and risks
- handoff notes for future sessions

## Suggested workflow

1. Capture or update the project goal in `PROJECT.md`.
2. Create or update a phase note under `.planning/active/` before major work.
3. Implement in small slices.
4. Prefer TDD for business logic and BDD-style scenarios for user-visible behavior.
5. Record verification notes before opening a PR.

## Initial layout

- `.planning/active/` — active phase notes
- `.planning/templates/` — reusable planning templates

