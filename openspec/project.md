# Project Context

## Purpose
MyHome is a modern home management web application built with React, designed to help users manage various aspects of their home including maintenance schedules, inventory tracking, and household organization.

## Tech Stack
- **Frontend**: React 19.2.0 with TypeScript 5.9.3
- **Build Tool**: Vite 7.2.7
- **UI Library**: Ant Design 6.1.0
- **State Management**: Zustand 5.0.9
- **Routing**: React Router 7.10.1
- **Data Fetching**: TanStack React Query 5.90.12
- **Styling**: UnoCSS with attribute presets
- **Code Quality**: Biome for linting and formatting
- **Testing**: Vitest (configured)

## Project Conventions

### Code Style
- **Formatting**: 2 space indentation, 100 character line width
- **Quotes**: Double quotes for strings and JSX
- **Semicolons**: As needed (Biome default)
- **Trailing commas**: ES5 style
- **File organization**:
  - Components in `src/components/`
  - Pages in `src/pages/`
  - Types in `src/types/`
  - Stores in `src/stores/`
  - Router config in `src/router/`
  - Styles in `src/styles/`

### Architecture Patterns
- **Component Architecture**: Functional components with hooks
- **State Management**: Zustand stores for global state
- **Routing**: React Router with nested routes
- **Layout**: Ant Design Layout with Header, Sider, and Content areas
- **Styling**: Atomic CSS with UnoCSS, global styles in dedicated file

### Testing Strategy
- **Test Runner**: Vitest
- **Coverage**: Vitest coverage reports
- **UI**: Vitest UI for interactive testing
- Tests should be co-located with components or in dedicated `__tests__` directories

### Git Workflow
- **Branching**: Main branch for production
- **Conventions**: Commit messages should follow conventional commits
- **Code Quality**: All code passes Biome checks before commits

## Domain Context
This is a home management application dealing with:
- Home inventory tracking
- Maintenance scheduling
- Household organization
- User preferences and settings
- Multi-user household management

## Important Constraints
- **Browser Compatibility**: Modern browsers supporting ES2020+
- **Performance**: Fast initial load and smooth interactions
- **Accessibility**: WCAG 2.1 AA compliance using Ant Design components
- **Security**: Client-side only (no backend yet), future state persistence considerations

## External Dependencies
- **UI Components**: Ant Design component library
- **Icons**: Ant Design icons (included with antd)
- **Future APIs**: Planning to integrate with:
  - Weather APIs for home maintenance suggestions
  - Calendar APIs for scheduling
  - Cloud storage for data persistence
