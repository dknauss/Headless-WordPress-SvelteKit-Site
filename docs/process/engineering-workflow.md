# Engineering Workflow: GSD + TDD + BDD

This project uses a lightweight combination of:
- **GSD** for planning and execution structure
- **TDD** for server-side logic and regression coverage
- **BDD** for user-visible acceptance behavior

## GSD in this repo

Planning artifacts live under `/Users/danknauss/Developer/GitHub/Headless-WordPress-SvelteKit-Site/.planning`.

Use them to:
- define the current phase
- break work into verifiable slices
- record assumptions and handoff notes

## TDD in this repo

Unit tests live under:
- `/Users/danknauss/Developer/GitHub/Headless-WordPress-SvelteKit-Site/tests/unit`

Primary target areas:
- rating store behavior
- security helpers
- other deterministic server-side logic

Recommended loop:
1. write or update a failing unit test
2. implement the smallest fix
3. run `npm run test:unit`
4. run `npm run check`

## BDD in this repo

BDD-style scenarios live under:
- `/Users/danknauss/Developer/GitHub/Headless-WordPress-SvelteKit-Site/tests/bdd/features`

Executable scenario tests live under:
- `/Users/danknauss/Developer/GitHub/Headless-WordPress-SvelteKit-Site/tests/bdd`

Recommended loop:
1. describe behavior in scenario language
2. encode the acceptance expectation in a scenario-style test
3. implement the behavior
4. verify with `npm run test:bdd`

## Scripts

- `npm run test`
- `npm run test:unit`
- `npm run test:unit:watch`
- `npm run test:bdd`
- `npm run test:bdd:watch`

## Notes

This is intentionally lightweight. The goal is to make planning and testing habitual without adding unnecessary process burden for a small SvelteKit + WordPress demo app.
