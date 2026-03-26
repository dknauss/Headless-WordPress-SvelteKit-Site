# Trading Cards Collection - Project Management

## Project Overview
A headless WordPress + SvelteKit tutorial project for displaying a trading card collection. This demonstrates how to use WordPress as a headless CMS with WPGraphQL API and SvelteKit as the frontend framework.

**Content:** Trading Card Collection   
**Backend:** WordPress (headless)  
**Frontend:** SvelteKit  
**API:** WPGraphQL  
**Tutorial:** [Building a Headless Application with WordPress and SvelteKit](https://amazing-questions-440483.framer.app/)

## Tutorial Sections
1. Intro to Headless
2. WordPress and WPGraphQL
3. Setting up SvelteKit
4. Building the User Interface
5. The Data Layer

## Todo

### High Priority
- [ ] Fix TypeScript types: Add `SingleCardResponse` interface to types.ts
- [ ] Fix TypeScript types: Add `rating` property to Card interface
- [ ] Implement search/filter functionality
- [ ] Add pagination or infinite scroll for large collections

### Medium Priority
- [ ] Add card sorting options (by rating, title, date, etc.)
- [ ] Implement category filtering
- [ ] Add individual card detail pages (using `getCardBySlug`)

### Low Priority
- [ ] Add card statistics/dashboard
- [ ] Implement favorites/bookmarks

## In Progress
- Currently working on: Polishing and testing the complete data flow

## Completed
- [x] Set up SvelteKit project
- [x] Create Card component with rating support
- [x] Move Card component to src/components folder
- [x] Set up TypeScript types for Card interface
- [x] Create homepage grid layout
- [x] Simplify container structure
- [x] Set up WordPress backend with WPGraphQL plugin
- [x] Configure WPGraphQL schema for cards
- [x] Create TypeScript response types (CardsResponse)
- [x] Create data fetching utilities (api.ts)
- [x] Create GraphQL queries (GET_CARDS, GET_CARD_BY_SLUG)
- [x] Replace sample data with real WPGraphQL API calls
- [x] Integrate API with homepage (onMount fetch)
- [x] Add loading and error states to UI
- [x] Display featured images from WordPress
- [x] Display categories from WordPress

## Project Structure
```
src/
├── components/
│   └── Card.svelte          # Reusable card component
├── lib/
│   ├── api.ts               # GraphQL fetch utilities
│   └── types.ts             # TypeScript type definitions
└── routes/
    ├── +layout.svelte       # App layout with favicon
    └── +page.svelte         # Homepage with card grid
```

## Notes & Ideas
- WordPress serves as the headless CMS (content management)
- Cards stored as WordPress posts
- WPGraphQL exposes the data via GraphQL API
- Cards are display-only (not clickable/no detail pages yet)
- Card detail pages could use the `getCardBySlug` function

## Known Issues
- `SingleCardResponse` type is imported in api.ts but not defined in types.ts
- `rating` property is used in Card.svelte but not defined in the Card interface

## Technical Decisions
- Using SvelteKit with TypeScript
- Headless architecture: WordPress (backend) + SvelteKit (frontend)
- API: WPGraphQL for GraphQL queries
- Card rating system: 0-10 scale
- Responsive grid layout for cards
- Components in src/components folder
- Types and utilities in src/lib folder

## Resources
- **Tutorial:** [Building a Headless Application with WordPress and SvelteKit](https://amazing-questions-440483.framer.app/)
- **WPGraphQL Docs:** https://www.wpgraphql.com/
- **SvelteKit Docs:** https://kit.svelte.dev/
- **WordPress GraphQL endpoint:** http://trading-cards-collection.local/graphql
