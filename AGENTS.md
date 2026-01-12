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

## Build & Quality
- `pnpm build` - Build project (runs tsc + vite build)
- `pnpm dev` - Start dev server (Vite, port 5173)
- `pnpm preview` - Preview production build
- `pnpm type-check` - Type check without emitting

## Linting & Formatting
- `pnpm lint` - Lint with Biome
- `pnpm lint:fix` - Fix linting issues
- `pnpm format` - Format code with Biome
- `pnpm format:check` - Check formatting
- `pnpm check` - Run all Biome checks (lint + format)
- `pnpm check:fix` - Fix all Biome issues

## Testing
- `pnpm test` - Run Vitest in watch mode
- `pnpm test -- --run <file>` - Run single test file
- `pnpm test:ui` - Run Vitest UI
- `pnpm test:coverage` - Generate coverage report

# Code Style

## Formatting (Biome)
- **Quotes**: Single quotes for strings and JSX
- **Indentation**: 2 spaces
- **Line width**: 100 characters
- **Semicolons**: As-needed (omitted when not required)
- **Trailing commas**: ES5 style
- **Line ending**: LF (Unix)
- **Imports**: Auto-organized via Biome's organizeImports

## TypeScript
- Strict mode enabled (noImplicitAny, strictNullChecks, etc.)
- No unused locals/parameters
- No fallthrough cases in switch statements
- Use interfaces for component props
- Use type imports: `import type { ... }` for types-only imports

## React Components
- Functional components with TypeScript interfaces for props
- Use `forwardRef` for components that need ref forwarding
- Use `memo()` to optimize re-renders (e.g., list items)
- Use `cn()` utility for className merging (clsx + tailwind-merge)
- Use `cva` (class-variance-authority) for variant styling
- Use Radix UI primitives for accessible components
- Test IDs for testing: `data-testid='component-name'`

## State Management
- **Global State**: Zustand stores with persist + devtools middleware
  - Pattern: `createJSONStorage(() => localStorage)`
  - Use `partialize` to select state to persist
- **Async Data**: TanStack Query (React Query)
  - Custom hooks wrap useQuery/useMutation with toast notifications
  - Default config: 10min gcTime, 30s staleTime, retry: 1
  - Use query keys: `['resource', id]`

## API Layer
- **Location**: Centralized in `src/api/` (e.g., `src/api/spaces/index.ts`)
- **Request Client**: Use `httpClient` from `@/utils/request`
  - Axios-based with interceptors
  - Automatic token refresh with queue management
  - ApiError class for error handling
  - Logging in dev mode (disabled in prod)
- **Response Format**: `{ code: number; message: string; data?: T }`
- **Mocking**: MSW (Mock Service Worker) for API mocking in dev

## Error Handling
- Wrap async calls in try-catch
- Use `toast.error()` from sonner for user feedback
- Use `console.error()` for debugging (only in dev)
- Handle ApiError from httpClient
- Query/Mutation errors logged in dev via QueryClient config

## Naming Conventions
- **Variables/Functions**: camelCase (e.g., `getUserData`, `isLoading`)
- **Components**: PascalCase (e.g., `TagCard`, `Button`)
- **Files**: kebab-case (e.g., `tag-card.tsx`, `use-tags.ts`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `TAG_COLOR_CLASSES`)
- **Enums**: PascalCase (e.g., `RequestMethod`, `SpacesApi`)

## File Organization
- `src/api/` - API endpoints and services
- `src/components/` - Reusable UI components
- `src/components/ui/` - Radix UI primitives with styling
- `src/pages/` - Page components grouped by feature
- `src/pages/*/hooks/` - Feature-specific hooks (TanStack Query wrappers)
- `src/pages/*/stores/` - Feature-specific Zustand stores
- `src/pages/*/components/` - Feature-specific components
- `src/stores/` - Global Zustand stores
- `src/hooks/` - Shared custom hooks
- `src/types/` - TypeScript type definitions
- `src/utils/` - Utility functions
- `src/lib/` - Library utilities (e.g., `cn()`)

## UI Components
- **Radix UI**: Headless primitives for accessibility
- **Tailwind CSS v4**: Utility-first styling with Vite plugin
- **Icons**: lucide-react
- **Animations**: motion (Framer Motion)
- **Forms**: react-hook-form with @hookform/resolvers + Zod
- **Toasts**: sonner

## Hooks Patterns
- Wrap TanStack Query in custom hooks per feature
- Include success/error toast notifications in mutations
- Use selective store updates: `useStore(s => s.user)`
- Return tuple/array from mutation hooks if needed

## Import Aliases
- `@/` → `src/`
- Configure in `vite.config.ts` and `tsconfig.json`
- Always use `@/` for internal imports

## Environment Variables
- Located in root: `.env`, `.env.development`, `.env.production`
- Use `env` utility from `@/utils/env` to access variables
- Type-safe access with proper inference

## Accessibility
- Add appropriate ARIA attributes
- Use semantic HTML elements
- Keyboard navigation support (onKeyDown handlers)
- Test IDs for E2E testing
