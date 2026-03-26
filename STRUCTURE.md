# SvelteKit Project Structure

## Initial Structure (Created Automatically)

When you run `npm create svelte@latest trading-cards-collection`, SvelteKit automatically creates:

```
trading-cards-collection/
├── node_modules/              # Dependencies (auto-generated)
├── package.json               # Auto-created
├── package-lock.json          # Auto-created
├── README.md                  # Auto-created
├── svelte.config.js           # Auto-created
├── tsconfig.json              # Auto-created (if TypeScript selected)
├── vite.config.ts             # Auto-created
│
├── src/
│   ├── app.d.ts               # Auto-created (TypeScript definitions)
│   ├── app.html               # Auto-created (HTML template)
│   │
│   ├── lib/                   # Auto-created folder
│   │   ├── assets/            # Auto-created folder
│   │   │   └── favicon.svg    # Auto-created
│   │   └── index.ts           # Auto-created (empty file)
│   │
│   └── routes/                # Auto-created folder
│       ├── +layout.svelte     # Auto-created
│       └── +page.svelte       # Auto-created
│
└── static/                    # Auto-created folder
    └── robots.txt             # Auto-created
```

## What You Need to Create Manually

For this tutorial project, you'll create:

```
src/
└── lib/
    ├── Card.svelte            # Manual - Create this
    └── types.ts               # Manual - Create this
```

## File Breakdown

### Auto-Created Files

**Root Level:**
- `package.json` - Project dependencies and scripts
- `svelte.config.js` - SvelteKit configuration
- `vite.config.ts` - Vite build tool configuration
- `tsconfig.json` - TypeScript configuration

**src/routes/** (Route-based file system):
- `+layout.svelte` - Layout wrapper for all pages
- `+page.svelte` - Homepage route (automatically at `/`)

**src/lib/** (Reusable components):
- `lib/` folder - For shared components and utilities
- `lib/assets/` - For static assets like images
- `lib/index.ts` - Empty file, can be used for exports

**static/** (Static files):
- `static/` - Files served as-is (images, fonts, etc.)
- `robots.txt` - Search engine crawler instructions

### Manual Files (Created in Tutorial)

**Components:**
- `src/lib/Card.svelte` - Card component for displaying individual cards
- `src/lib/types.ts` - TypeScript type definitions

## Key Points

1. **`routes/` folder** - Automatically created with `+layout.svelte` and `+page.svelte`
2. **`+page.svelte`** - Automatically created (this is your homepage)
3. **`+layout.svelte`** - Automatically created (wraps all pages)
4. **`lib/` folder** - Automatically created, but empty (you add components here)
5. **File-based routing** - Files in `routes/` automatically become routes

## Route Structure

```
src/routes/
├── +layout.svelte     → Wraps all pages
├── +page.svelte       → Homepage (/)
├── about/
│   └── +page.svelte  → /about (if you create this)
└── cards/
    └── [slug]/
        └── +page.svelte → /cards/[slug] (dynamic route)
```

## Summary

**Auto-created:**
- `routes/` folder
- `+page.svelte` (homepage)
- `+layout.svelte` (layout wrapper)
- `lib/` folder structure
- All config files

**You create:**
- `Card.svelte` component
- `types.ts` file
- Any additional routes/pages

