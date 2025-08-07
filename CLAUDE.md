# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is a Next.js 15 SaaS Starter Kit (Lite version) built with Supabase, using a monorepo architecture with Turborepo. It's a production-grade starter kit for building SaaS applications with authentication, user management, and modern tooling.

**🎯 PROJECT OBJECTIVE: Build a complete Chatwoot Clone**

This codebase will be transformed into a full-featured customer support platform (Chatwoot clone) using Next.js 15 + Supabase + Vercel. The implementation must maintain 100% compatibility with the existing UI/UX design system while adding comprehensive chat, automation, and customer support features.

### Target Functionality (from PRD)
- **Multi-tenant SaaS Platform**: Support for multiple accounts/organizations
- **Real-time Messaging**: Live chat with customers across multiple channels
- **Chat Widget**: Embeddable chat widget for websites
- **Multi-channel Support**: Web widget, Email, WhatsApp, Slack integrations
- **AI Assistant**: OpenAI-powered automated responses and sentiment analysis
- **Knowledge Base**: Public help center with search functionality
- **Team Management**: Agent assignment, roles, and permissions
- **Automation Rules**: Automated responses and workflow triggers
- **Analytics & Reporting**: Comprehensive dashboard with metrics

## Development Commands

### Core Development
```bash
# Install dependencies
pnpm install

# Start development server (all apps)
pnpm run dev

# Build all applications
pnpm run build

# Run type checking
pnpm run typecheck

# Lint all code
pnpm run lint

# Fix linting issues
pnpm run lint:fix

# Format code
pnpm run format:fix
```

### Supabase Database
```bash
# Start Supabase services (requires Docker)
pnpm run supabase:web:start

# Stop Supabase services
pnpm run supabase:web:stop

# Reset database with fresh migrations and seed data
pnpm run supabase:web:reset

# Generate TypeScript types from database
pnpm run supabase:web:typegen

# Create new migration
pnpm --filter web supabase migration new <migration-name>

# Push migrations to remote Supabase project
pnpm --filter web supabase db push

# Link to remote Supabase project
pnpm --filter web supabase db link
```

### Testing
```bash
# Run all tests
pnpm run test

# Run E2E tests (Playwright)
pnpm --filter e2e test
```

## Architecture

### Monorepo Structure
- **apps/web**: Main Next.js application using App Router
- **apps/e2e**: Playwright end-to-end tests
- **packages/features**: Core business logic packages (`auth`, `accounts`)
- **packages/ui**: Shared UI components (Shadcn UI + Makerkit components)
- **packages/shared**: Shared utilities and hooks
- **packages/supabase**: Supabase client configurations and utilities
- **packages/i18n**: Internationalization setup
- **packages/next**: Next.js utilities
- **tooling**: ESLint, Prettier, and TypeScript configurations

### Key Internal Packages
All internal packages use `@kit/*` namespace:
- `@kit/ui`: UI components (Shadcn UI + custom components)
- `@kit/auth`: Authentication logic and components
- `@kit/accounts`: Account management features
- `@kit/supabase`: Supabase clients and utilities
- `@kit/shared`: Shared utilities and hooks
- `@kit/i18n`: Internationalization utilities
- `@kit/next`: Next.js specific utilities

### App Structure (apps/web)
- **app/(marketing)**: Public marketing pages and legal pages
- **app/auth**: Authentication pages (sign-in, sign-up, password reset)
- **app/home**: Protected application pages
- **config/**: Application configuration files
- **components/**: Global React components and providers
- **lib/**: Utilities and server-side helpers
- **supabase/**: Database migrations, seed data, and configuration

### Configuration Files
- **app.config.ts**: Main app configuration (name, title, theme, etc.)
- **paths.config.ts**: Application routes/paths configuration
- **auth.config.ts**: Authentication configuration
- **navigation.config.tsx**: Navigation menu configuration
- **feature-flags.config.ts**: Feature flags configuration

### TypeScript Path Aliases (apps/web)
- `~/*`: Points to `./app/*` (App Router pages)
- `~/config/*`: Points to `./config/*`
- `~/components/*`: Points to `./components/*`
- `~/lib/*`: Points to `./lib/*`

## Development Patterns

### Authentication
- Uses Supabase Auth with email/password and OAuth providers
- Authentication components are in `@kit/auth` package
- User session management through React Context
- Multi-factor authentication (MFA) support
- Protected routes using middleware and server components

### Database
- PostgreSQL via Supabase
- Migrations in `apps/web/supabase/migrations/`
- TypeScript types auto-generated from database schema
- Row Level Security (RLS) policies implemented

### Styling
- TailwindCSS v4 with custom theme configuration
- Shadcn UI components as base design system
- Custom Makerkit components for SaaS-specific UI
- Dark/light mode support
- Responsive design patterns

### Internationalization
- Built-in i18n with `next-i18next`
- Translation files in `apps/web/public/locales/`
- Server-side and client-side translation support
- Language selector component included

### State Management
- React Query for server state management
- React Context for global state (auth, theme)
- Form state managed with React Hook Form + Zod validation

### Testing
- Playwright for E2E testing with page object model
- Test utilities for authentication and common workflows
- Mailbox utilities for email testing scenarios

## Environment Variables

Key environment variables for configuration:
- `NEXT_PUBLIC_SITE_URL`: Application URL
- `NEXT_PUBLIC_PRODUCT_NAME`: SaaS product name
- `NEXT_PUBLIC_SITE_TITLE`: Default page title
- `NEXT_PUBLIC_SITE_DESCRIPTION`: Default meta description
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase public API key
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key (server-side)

## Production Deployment

### Supabase Setup
1. Create Supabase project
2. Push migrations: `pnpm --filter web supabase db push`
3. Set callback URL: `<your-domain>/auth/callback`
4. Configure authentication providers in Supabase dashboard

### Hosting Platforms
- **Vercel**: Works out of the box with zero configuration
- **Cloudflare Pages**: Add `export const runtime = 'edge';` to root layout and enable Node.js compatibility
- Set production environment variables in hosting platform dashboard

## Code Quality

### Tooling Configuration
- **ESLint v9**: Modern flat config with TypeScript rules
- **Prettier**: Consistent code formatting
- **TypeScript**: Strict mode enabled with comprehensive type checking
- **Turbo**: Build caching and task orchestration
- **Husky/Lint-staged**: Pre-commit hooks (if configured)

### Package Management
- Uses pnpm workspaces for monorepo management
- Syncpack for dependency version consistency
- Manypkg for workspace validation

### Build Optimizations
- React Compiler support (experimental, opt-in via `ENABLE_REACT_COMPILER=true`)
- Bundle optimization for common packages (Recharts, Lucide React, etc.)
- Modular imports for lodash
- Image optimization with Next.js Image component

---

# 🎨 UI/UX DESIGN SYSTEM PRESERVATION

**CRITICAL**: When implementing Chatwoot features, you MUST maintain 100% compatibility with the existing design system. All new components and pages should seamlessly integrate with the current look and feel.

## Design System Foundation

### Component Architecture
- **Shadcn/UI Base**: Modern component library built on Radix UI primitives with "new-york" style
- **Custom Makerkit Components**: Extended components for SaaS-specific UI patterns
- **Variant System**: Uses `class-variance-authority` (CVA) for consistent component variants
- **Composition Pattern**: Components built for flexible composition and reusability

### Theme System & Colors
```css
/* Light Theme Tokens */
--background: var(--color-white)
--foreground: var(--color-neutral-950)
--primary: var(--color-neutral-950)
--secondary: oklch(96.76% 0.0013 286.38)
--muted: oklch(96.71% 0.0029 264.54)
--accent: oklch(96.76% 0.0013 286.38)
--destructive: var(--color-red-500)
--border: var(--color-gray-100)

/* Dark Theme Tokens */
--background: var(--color-neutral-900)
--foreground: var(--color-white)
--primary: var(--color-white)
--secondary: var(--color-neutral-800)
```

### Layout Patterns
- **Sidebar Layout** (Protected App Areas): `<SidebarLayout>` with collapsible navigation
- **Header Layout** (Marketing/Auth): `<HeaderLayout>` with top navigation
- **Mobile-First Responsive**: All components use `lg:` breakpoints for desktop
- **Container System**: Custom container utility with consistent max-width and padding

### Design Tokens
- **Border Radius**: `--radius: 0.5rem` (8px) with sm/md/lg variants
- **Typography**: System font stack with consistent scale
- **Spacing**: Tailwind default scale with common patterns (`space-x-2`, `gap-y-2`)
- **Shadows**: `shadow-xs` for subtle elevation, `shadow-md` for modals
- **Animations**: Fade-up/down keyframes, accordion expand/collapse

### Component API Standards
```typescript
interface ComponentProps extends React.HTMLAttributes<HTMLElement> {
  className?: string
  children?: React.ReactNode
  variant?: 'default' | 'secondary' | ...
  size?: 'sm' | 'md' | 'lg'
  asChild?: boolean // For Slot pattern
}
```

### Interactive Patterns
- **Button Variants**: default, destructive, outline, secondary, ghost, link
- **Icon System**: Lucide React with consistent 16px (`h-4 w-4`) sizing
- **Form Patterns**: React Hook Form + Zod validation with consistent error display
- **Navigation**: Active states using `isRouteActive` utility
- **Loading States**: Built-in loading overlays and spinner components

---

# 🗄️ DATABASE SCHEMA FOR CHATWOOT

When implementing database features, use this comprehensive PostgreSQL schema designed for multi-tenant customer support:

## Core Tables Structure

### Multi-tenancy & Authentication
```sql
-- Accounts (organizations/companies)
accounts: id, name, domain, slug, support_email, feature_flags, limits, settings, status, locale, timezone

-- Users (system users - agents, admins)  
users: id, name, email, display_name, avatar_url, availability, ui_settings, custom_attributes, last_seen_at

-- Account Users (many-to-many with roles)
account_users: account_id, user_id, role ('agent'|'administrator'), availability, active_at

-- Contacts (end customers)
contacts: account_id, name, email, phone_number, identifier, contact_type, location, additional_attributes, last_activity_at
```

### Messaging System
```sql  
-- Inboxes (communication channels)
inboxes: account_id, channel_id, channel_type, name, email_address, greeting_enabled, auto_assignment_config

-- Conversations (chat threads)
conversations: account_id, inbox_id, contact_id, assignee_id, display_id, status, priority, identifier, last_activity_at

-- Messages (individual messages)
messages: account_id, conversation_id, inbox_id, sender_type, sender_id, message_type, content, private, status, sentiment
```

### Channel Support
```sql
-- Web Widget Channels
channel_web_widgets: account_id, website_name, website_url, welcome_title, widget_color, hmac_token, pre_chat_form_enabled

-- Email Channels  
channel_emails: account_id, email, imap_settings, smtp_settings, provider_config

-- WhatsApp Channels
channel_whatsapps: account_id, phone_number, provider, provider_config, message_templates
```

### Team Management & Automation
```sql
-- Teams
teams: account_id, name, description, allow_auto_assign

-- Team Members
team_members: team_id, user_id

-- Automation Rules
automation_rules: account_id, name, event_name, conditions, actions, active

-- Macros (predefined actions)
macros: account_id, name, visibility, actions, created_by_id
```

### Knowledge Base
```sql
-- Portals (help centers)
portals: account_id, name, slug, custom_domain, color, allowed_locales, config

-- Categories
categories: account_id, portal_id, name, slug, description, position, locale, parent_category_id

-- Articles
articles: account_id, portal_id, category_id, title, slug, content, status, author_id, views, locale

-- Article Embeddings (for AI search)
article_embeddings: article_id, term, embedding (vector)
```

### AI & Analytics
```sql
-- AI Assistant Responses
captain_assistant_responses: question, answer, embedding (vector), assistant_id, account_id

-- Labels & Tagging
labels: account_id, title, description, color, show_on_sidebar
conversation_labels: conversation_id, label_id

-- Attachments
attachments: account_id, message_id, file_type, external_url, extension
```

## Database Features
- **Row Level Security (RLS)**: Multi-tenant isolation with Supabase policies
- **Real-time Subscriptions**: Live updates for conversations and messages
- **Vector Search**: pgvector extension for AI-powered semantic search
- **Automatic Triggers**: Updated timestamps, display_id generation
- **Performance Indexes**: Optimized for conversation lists and message search

---

# 🔧 IMPLEMENTATION GUIDELINES

## Feature Development Rules

### 1. UI Component Creation
- **Extend Existing Components**: Build on top of Shadcn/Makerkit components
- **Follow Naming Conventions**: Use established className patterns
- **Maintain Variants**: Use CVA for consistent component variations
- **Preserve Accessibility**: Keep ARIA labels and keyboard navigation
- **Use Design Tokens**: Stick to CSS custom properties for colors/spacing

### 2. Page Layout Standards  
- **Protected Pages**: Use existing sidebar layout (`app/home` structure)
- **Public Pages**: Follow marketing page patterns (`app/(marketing)` structure)
- **Mobile Responsive**: Maintain mobile-first responsive patterns
- **Navigation Integration**: Use existing navigation configuration system

### 3. State Management Patterns
- **Server State**: Use React Query/TanStack Query for API calls
- **Global State**: Extend existing auth/theme context providers
- **Form State**: React Hook Form + Zod validation (existing pattern)
- **Real-time**: Integrate with Supabase Realtime subscriptions

### 4. Database Integration
- **Migrations**: Create new migrations in `apps/web/supabase/migrations/`
- **Type Generation**: Run `pnpm run supabase:web:typegen` after schema changes
- **RLS Policies**: Implement proper multi-tenant security policies
- **Performance**: Add appropriate indexes for new query patterns

### 5. API Development
- **File Structure**: Follow existing API route patterns (`app/api/`)  
- **Error Handling**: Use consistent error response format
- **Authentication**: Leverage Supabase auth middleware
- **Validation**: Zod schemas for request/response validation

## Development Workflow

### 1. Planning Phase
- Review existing UI patterns before building new components
- Check database schema compatibility
- Identify reusable existing components
- Plan mobile responsive behavior

### 2. Implementation Phase
- Start with database migrations if needed
- Build backend API endpoints
- Create UI components following design system
- Implement real-time features using Supabase
- Add comprehensive TypeScript types

### 3. Integration Phase
- Test with existing authentication system
- Verify mobile responsive design
- Check dark/light theme compatibility  
- Validate accessibility standards
- Test cross-browser functionality

### 4. Quality Assurance
- Run full test suite: `pnpm run test`
- Type checking: `pnpm run typecheck`
- Linting: `pnpm run lint:fix`
- Format code: `pnpm run format:fix`
- Test E2E workflows with Playwright

## Key Integration Points

### Authentication
- Leverage existing `@kit/auth` package
- Use established user session management
- Maintain account switching functionality
- Preserve MFA support

### Theming  
- Use existing CSS custom properties
- Support dark/light theme switching
- Maintain theme persistence
- Follow established color semantics

### Internationalization
- Use existing i18n setup (`@kit/i18n`)
- Add translations for new features
- Support existing language switching
- Maintain server/client translation patterns

### Performance
- Follow established bundle optimization
- Use existing image optimization
- Maintain lazy loading patterns
- Respect existing caching strategies

This comprehensive guide ensures that all Chatwoot features are built with seamless integration into the existing SaaS starter kit while maintaining its high-quality standards and design consistency.