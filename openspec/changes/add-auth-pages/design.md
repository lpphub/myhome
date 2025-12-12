# Design Document: Authentication Pages and Routing

## Architecture Overview

### Pages Structure
```
src/pages/
├── auth/
│   ├── SignInPage.tsx      # Sign-in form page
│   ├── SignUpPage.tsx      # Sign-up form page
│   └── components/
│       ├── AuthLayout.tsx  # Layout for auth pages
│       └── AuthForm.tsx    # Reusable form wrapper
├── dashboard/
│   └── DashboardPage.tsx   # Existing dashboard
└── (future pages)
    ├── profile/
    ├── settings/
    └── inventory/
```

### Routing Strategy

#### Public Routes (No Authentication Required)
- `/signin` - Sign in page
- `/signup` - Sign up page
- `/` - Redirects to dashboard or signin based on auth state

#### Protected Routes (Authentication Required)
- `/dashboard` - Main dashboard
- `/profile` - User profile (future)
- `/settings` - App settings (future)

### Layout Strategy

1. **AuthLayout** - Minimal layout for sign-in/sign-up pages
   - Centered form card
   - Brand logo/header
   - Footer with links
   - No navigation sidebar

2. **AppLayout** - Main application layout
   - Header with user menu
   - Sidebar navigation
   - Content area
   - Used for all authenticated pages

### UI/UX Design

#### Design Principles
- **Minimalism**: Clean, uncluttered interfaces
- **Consistency**: Unified design language across pages
- **Accessibility**: High contrast, clear focus states
- **Responsiveness**: Mobile-first approach

#### Color Scheme
- Primary: Blue (#1677ff)
- Success: Green (#52c41a)
- Error: Red (#ff4d4f)
- Warning: Orange (#faad14)
- Background: Light gray (#f5f5f5)
- Text: Dark gray (#262626)

#### Typography
- Headings: 24-32px, weight 600
- Body text: 14-16px, weight 400
- Labels: 12-14px, weight 500

### Animation Strategy

#### Page Transitions
- Fade in/out for page changes
- Slide effects for form switching
- Duration: 200-300ms
- Easing: ease-out

#### Micro-interactions
- Button hover states
- Input field focus animations
- Loading spinners for async operations (future)

### Component Architecture

#### Auth Components
```typescript
// AuthLayout - Wrapper for auth pages
interface AuthLayoutProps {
  children: React.ReactNode
  title?: string
  subtitle?: string
}

// AuthForm - Base form component
interface AuthFormProps {
  title: string
  onSubmit: (values: any) => void
  children: React.ReactNode
}
```

#### Page Components
- Each page is a functional component with hooks
- Local state for form data and UI state
- No global state management needed initially

### Technology Choices

#### Animation Library: Motion
- Declarative animations
- Good TypeScript support
- Lightweight
- Easy to implement

#### Styling Approach
- Ant Design components with custom theming
- UnoCSS for utility classes
- CSS-in-JS for complex animations (if needed)

### Responsive Design
- Mobile: < 768px - Single column, full-width forms
- Tablet: 768px - 1024px - Centered form with padding
- Desktop: > 1024px - Fixed width form (400px)

### Error Handling
- Form validation errors
- Network error placeholders (future)
- 404 page for invalid routes
- Error boundary for unexpected errors