<!-- OPENSPEC:START -->
# OpenSpec Instructions

These instructions are for AI assistants working in this project.

Always open `@/openspec/AGENTS.md` when the request:
- Mentions planning or proposals (words like proposal, spec, change, plan)
- Introduces new capabilities, breaking changes, architecture shifts, or big performance/security work
- Sounds ambiguous and you need the authoritative spec before coding

Use `@/openspec/AGENTS.md` to learn:
- How to create and apply change proposals
- Spec format and conventions
- Project structure and guidelines

Keep this managed block so 'openspec update' can refresh the instructions.

<!-- OPENSPEC:END -->

# Commands
- `pnpm build` - Build project (runs tsc + vite build)
- `pnpm type-check` - Type check without emitting
- `pnpm lint` - Lint with Biome
- `pnpm lint:fix` - Fix linting issues
- `pnpm format` - Format code with Biome
- `pnpm check` - Run all Biome checks
- `pnpm check:fix` - Fix all Biome issues
- `pnpm test` - Run Vitest
- `pnpm test -- --run <file>` - Run single test file

# Code Style
- **Formatting**: Biome - single quotes, 2-space indent, 100-char width, semicolons as-needed
- **Imports**: Use `@/` alias for src files, organize imports automatically
- **Types**: Strict TypeScript enabled, no unused locals/parameters
- **Components**: React 19, functional components with TypeScript interfaces for props
- **State**: Zustand stores (persist with devtools), TanStack Query for async data
- **UI**: Radix UI primitives + Tailwind CSS v4, `cn()` utility for className merging
- **API**: Centralized in `src/api/`, use httpClient wrapper, handle ApiError with try-catch
- **Naming**: camelCase for variables/functions, PascalCase for components, kebab-case for files
- **Error Handling**: Wrap async calls in try-catch, use `toast.error()` for user feedback, `console.error` for debugging
- **File Organization**: Group by type (api, components, pages, stores, hooks, utils, types)
