# NoteFlow

NoteFlow is a rebuilt note-taking workspace made with Next.js. It now behaves like a stronger local-first product instead of a setup-blocked demo.

## What Changed

- rebuilt the landing, auth, and dashboard experience
- added local-first persistence so the app works without external setup
- added note editing, duplication, pinning, favorites, archive flows, tags, search, and sorting
- seeded a demo workspace so the app is immediately explorable
- cleaned up duplicate config files and refreshed project metadata

## Demo Login

- email: `demo@noteflow.app`
- password: `demo1234`

## Run Locally

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Available Scripts

```bash
npm run dev
npm run build
npm run lint
npm run typecheck
```

## Architecture

- `src/providers/app-provider.tsx`: local-first app state, auth/session handling, note mutations
- `src/components/NoteWorkspace.tsx`: main dashboard workflow and note management UI
- `src/hooks/useAuth.ts`: auth-facing hook used by login, signup, and reset screens
- `src/lib/demo-data.ts`: seeded workspace content and starter notes

## Current Backend Model

The app currently uses browser local storage as its persistence layer so it can run immediately without environment variables or third-party configuration. That makes it a much better starting point for adding a future API or sync layer.
