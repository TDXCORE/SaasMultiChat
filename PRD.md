# PRD Técnico: Chatwoot Clone con Next.js + Supabase + Vercel

## 🎯 Resumen Ejecutivo

Este documento técnico especifica los requerimientos para construir un clon 100% funcional de Chatwoot utilizando un stack moderno: **Next.js 15**, **Supabase** (PostgreSQL + Auth + Storage + Realtime), y **Vercel** para deployment. El objetivo es mantener paridad de funcionalidades mientras mejoramos el rendimiento, escalabilidad y experiencia de desarrollador.

### 📊 Métricas del Proyecto Original
- **Backend**: Ruby on Rails 7.1 + PostgreSQL + Redis + Sidekiq
- **Frontend**: Vue.js 3 + Vuex + TailwindCSS
- **Base de datos**: 50+ tablas, arquitectura multi-tenant
- **APIs**: 200+ endpoints REST, WebSocket real-time
- **Integraciones**: 40+ servicios externos
- **Idiomas**: 35+ idiomas soportados

---

## 🏗️ Arquitectura del Sistema

### 1. Stack Tecnológico

#### **Frontend**
```typescript
// Core Framework
Next.js 15 (App Router + Server Components)
React 19 + TypeScript 5.5
TailwindCSS 4.0 + Radix UI

// State Management  
Zustand + React Query (TanStack Query v5)
Jotai (para estado global atómico)

// Real-time
Supabase Realtime + WebSocket hooks
React Server Components para streaming

// Routing & Navigation
Next.js App Router
Parallel routes para dashboard modular
Intercepting routes para modales

// Forms & Validation
React Hook Form + Zod schemas
Conform para progressive enhancement

// UI & Animations
Framer Motion para microinteracciones
Radix UI para componentes accesibles
Lucide React para iconografía
```

#### **Backend**
```typescript
// API Layer
Next.js API Routes (App Router)
Supabase Edge Functions (Deno runtime)
tRPC para type-safe APIs

// Database & Auth
Supabase PostgreSQL (pgvector enabled)
Supabase Auth (Row Level Security)
Supabase Storage para archivos

// Real-time
Supabase Realtime (PostgreSQL triggers)
WebSocket channels customizados

// Background Jobs
Upstash QStash + Redis
Trigger.dev para workflows complejos

// AI/ML
OpenAI SDK + LangChain
Supabase Vector/pgvector para embeddings
Vercel AI SDK para streaming
```

#### **Infrastructure**
```yaml
# Deployment
Platform: Vercel (Edge Runtime + Node.js)
CDN: Vercel Edge Network
Analytics: Vercel Analytics + Speed Insights

# Database & Storage
Primary DB: Supabase PostgreSQL
Vector DB: pgvector extension
File Storage: Supabase Storage
Caching: Upstash Redis

# Monitoring & Observability
Error Tracking: Sentry
Performance: Vercel Speed Insights
Logging: Vercel Functions Logs
Uptime: Better Uptime

# CI/CD
Source Control: GitHub
Deployment: Vercel Git Integration
Testing: GitHub Actions + Vitest
Type Checking: TypeScript strict mode
```

---

## 🗄️ Arquitectura de Base de Datos

### 1. Schema de Supabase PostgreSQL

#### **Tablas Core**
```sql
-- Configuración de extensiones
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ========================================
-- MULTI-TENANCY & AUTHENTICATION
-- ========================================

-- Accounts (organizaciones)
CREATE TABLE accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    domain VARCHAR(100) UNIQUE,
    slug VARCHAR(100) UNIQUE NOT NULL,
    support_email VARCHAR(100),
    feature_flags JSONB DEFAULT '{}',
    auto_resolve_duration INTEGER DEFAULT 40320, -- 28 days in minutes
    limits JSONB DEFAULT '{}',
    custom_attributes JSONB DEFAULT '{}',
    settings JSONB DEFAULT '{}',
    status account_status DEFAULT 'active',
    locale VARCHAR(10) DEFAULT 'en',
    timezone VARCHAR(50) DEFAULT 'UTC',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Users (usuarios del sistema)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    display_name VARCHAR(255),
    avatar_url TEXT,
    availability user_availability DEFAULT 'offline',
    ui_settings JSONB DEFAULT '{}',
    custom_attributes JSONB DEFAULT '{}',
    message_signature TEXT,
    pubsub_token UUID DEFAULT uuid_generate_v4() UNIQUE,
    last_seen_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Account Users (relación many-to-many con roles)
CREATE TABLE account_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID REFERENCES accounts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role account_user_role DEFAULT 'agent',
    availability user_availability DEFAULT 'offline',
    auto_offline BOOLEAN DEFAULT true,
    custom_role_id UUID,
    inviter_id UUID REFERENCES users(id),
    active_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(account_id, user_id)
);

-- ========================================
-- CONTACTS & CONVERSATIONS
-- ========================================

-- Contacts (clientes/usuarios finales)
CREATE TABLE contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID REFERENCES accounts(id) ON DELETE CASCADE,
    name VARCHAR(255) DEFAULT '',
    email VARCHAR(255),
    phone_number VARCHAR(50),
    identifier VARCHAR(255), -- external ID
    contact_type contact_type DEFAULT 'visitor',
    location VARCHAR(255),
    country_code VARCHAR(10),
    blocked BOOLEAN DEFAULT false,
    additional_attributes JSONB DEFAULT '{}',
    custom_attributes JSONB DEFAULT '{}',
    last_activity_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(email, account_id),
    UNIQUE(identifier, account_id)
);

-- Inboxes (canales de comunicación)
CREATE TABLE inboxes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID REFERENCES accounts(id) ON DELETE CASCADE,
    channel_id UUID NOT NULL, -- polymorphic reference
    channel_type VARCHAR(50) NOT NULL, -- 'WebWidget', 'Email', 'WhatsApp', etc.
    name VARCHAR(255) NOT NULL,
    email_address VARCHAR(255),
    greeting_enabled BOOLEAN DEFAULT false,
    greeting_message TEXT,
    enable_auto_assignment BOOLEAN DEFAULT true,
    enable_email_collect BOOLEAN DEFAULT true,
    csat_survey_enabled BOOLEAN DEFAULT false,
    allow_messages_after_resolved BOOLEAN DEFAULT true,
    lock_to_single_conversation BOOLEAN DEFAULT false,
    working_hours_enabled BOOLEAN DEFAULT false,
    out_of_office_message TEXT,
    timezone VARCHAR(50) DEFAULT 'UTC',
    auto_assignment_config JSONB DEFAULT '{}',
    business_name VARCHAR(255),
    sender_name_type sender_name_type DEFAULT 'friendly',
    csat_config JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Conversations (hilos de conversación)
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID REFERENCES accounts(id) ON DELETE CASCADE,
    inbox_id UUID REFERENCES inboxes(id) ON DELETE CASCADE,
    contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
    assignee_id UUID REFERENCES users(id) ON DELETE SET NULL,
    team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
    display_id SERIAL NOT NULL, -- auto-incrementing per account
    status conversation_status DEFAULT 'open',
    priority conversation_priority,
    sla_policy_id UUID,
    identifier VARCHAR(255),
    additional_attributes JSONB DEFAULT '{}',
    custom_attributes JSONB DEFAULT '{}',
    contact_last_seen_at TIMESTAMPTZ,
    agent_last_seen_at TIMESTAMPTZ,
    assignee_last_seen_at TIMESTAMPTZ,
    first_reply_created_at TIMESTAMPTZ,
    snoozed_until TIMESTAMPTZ,
    waiting_since TIMESTAMPTZ,
    last_activity_at TIMESTAMPTZ DEFAULT NOW(),
    cached_label_list TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(account_id, display_id)
);

-- Messages (mensajes individuales)
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID REFERENCES accounts(id) ON DELETE CASCADE,
    inbox_id UUID REFERENCES inboxes(id) ON DELETE CASCADE,
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    sender_type VARCHAR(50), -- 'User', 'Contact', 'AgentBot'
    sender_id UUID,
    message_type message_type NOT NULL,
    content_type content_type DEFAULT 'text',
    content TEXT,
    processed_message_content TEXT,
    private BOOLEAN DEFAULT false,
    status message_status DEFAULT 'sent',
    source_id VARCHAR(255),
    content_attributes JSONB DEFAULT '{}',
    external_source_ids JSONB DEFAULT '{}',
    additional_attributes JSONB DEFAULT '{}',
    sentiment JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- TEAM MANAGEMENT
-- ========================================

-- Teams
CREATE TABLE teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID REFERENCES accounts(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    allow_auto_assign BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(name, account_id)
);

-- Team Members
CREATE TABLE team_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(team_id, user_id)
);

-- ========================================
-- CHANNELS (Polymorphic for different platforms)
-- ========================================

-- Web Widget Channels
CREATE TABLE channel_web_widgets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID REFERENCES accounts(id) ON DELETE CASCADE,
    website_name VARCHAR(255) NOT NULL,
    website_url VARCHAR(255) NOT NULL,
    welcome_title VARCHAR(255),
    welcome_tagline TEXT,
    widget_color VARCHAR(10) DEFAULT '#1f93ff',
    hmac_token VARCHAR(255) NOT NULL,
    pre_chat_form_enabled BOOLEAN DEFAULT false,
    pre_chat_form_options JSONB DEFAULT '{}',
    continuity_via_email BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Email Channels
CREATE TABLE channel_emails (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID REFERENCES accounts(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL UNIQUE,
    forward_to_email VARCHAR(255),
    imap_enabled BOOLEAN DEFAULT false,
    imap_settings JSONB DEFAULT '{}',
    smtp_enabled BOOLEAN DEFAULT false,
    smtp_settings JSONB DEFAULT '{}',
    microsoft_tenant_id VARCHAR(255),
    provider_config JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- WhatsApp Channels
CREATE TABLE channel_whatsapps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID REFERENCES accounts(id) ON DELETE CASCADE,
    phone_number VARCHAR(50) NOT NULL,
    provider VARCHAR(50) NOT NULL, -- '360dialog', 'whatsapp_cloud'
    provider_config JSONB NOT NULL,
    message_templates JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(phone_number, account_id)
);

-- ========================================
-- AUTOMATION & AI
-- ========================================

-- Automation Rules
CREATE TABLE automation_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID REFERENCES accounts(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    event_name VARCHAR(100) NOT NULL,
    conditions JSONB DEFAULT '{}' NOT NULL,
    actions JSONB DEFAULT '{}' NOT NULL,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Macros (predefined actions)
CREATE TABLE macros (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID REFERENCES accounts(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    visibility macro_visibility DEFAULT 'personal',
    created_by_id UUID REFERENCES users(id) ON DELETE SET NULL,
    updated_by_id UUID REFERENCES users(id) ON DELETE SET NULL,
    actions JSONB DEFAULT '{}' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI Assistant Responses (Vector embeddings)
CREATE TABLE captain_assistant_responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question VARCHAR(1000) NOT NULL,
    answer TEXT NOT NULL,
    embedding vector(1536), -- OpenAI embeddings
    assistant_id UUID NOT NULL,
    documentable_type VARCHAR(50),
    documentable_id UUID,
    account_id UUID REFERENCES accounts(id) ON DELETE CASCADE,
    status INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- KNOWLEDGE BASE
-- ========================================

-- Portals (Help Centers)
CREATE TABLE portals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID REFERENCES accounts(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) NOT NULL,
    custom_domain VARCHAR(255),
    color VARCHAR(10),
    homepage_link VARCHAR(500),
    page_title VARCHAR(255),
    header_text TEXT,
    allowed_locales TEXT[] DEFAULT ARRAY['en'],
    config JSONB DEFAULT '{}',
    archived BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(slug, account_id)
);

-- Categories
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID REFERENCES accounts(id) ON DELETE CASCADE,
    portal_id UUID REFERENCES portals(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) NOT NULL,
    description TEXT,
    position INTEGER DEFAULT 0,
    locale VARCHAR(10) DEFAULT 'en',
    parent_category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    associated_category_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(slug, portal_id, locale)
);

-- Articles
CREATE TABLE articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID REFERENCES accounts(id) ON DELETE CASCADE,
    portal_id UUID REFERENCES portals(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    content TEXT,
    description TEXT,
    position INTEGER DEFAULT 0,
    locale VARCHAR(10) DEFAULT 'en',
    author_id UUID REFERENCES users(id) ON DELETE SET NULL,
    associated_article_id UUID,
    status article_status DEFAULT 'draft',
    views INTEGER DEFAULT 0,
    meta JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(slug, portal_id, locale)
);

-- Article Embeddings (para búsqueda semántica)
CREATE TABLE article_embeddings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
    term TEXT NOT NULL,
    embedding vector(1536),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- CAMPAIGNS & MARKETING
-- ========================================

-- Campaigns
CREATE TABLE campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID REFERENCES accounts(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    message TEXT NOT NULL,
    enabled BOOLEAN DEFAULT true,
    campaign_type campaign_type DEFAULT 'ongoing',
    campaign_status campaign_status DEFAULT 'active',
    audience JSONB DEFAULT '[]',
    trigger_rules JSONB DEFAULT '{}',
    created_by_id UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- LABELS & TAGGING
-- ========================================

-- Labels
CREATE TABLE labels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID REFERENCES accounts(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    color VARCHAR(10) DEFAULT '#1f93ff',
    show_on_sidebar BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(title, account_id)
);

-- Conversation Labels (many-to-many)
CREATE TABLE conversation_labels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    label_id UUID REFERENCES labels(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(conversation_id, label_id)
);

-- ========================================
-- FILE ATTACHMENTS
-- ========================================

-- Attachments
CREATE TABLE attachments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID REFERENCES accounts(id) ON DELETE CASCADE,
    file_type attachment_file_type DEFAULT 'file',
    external_url TEXT,
    coordinates_lat FLOAT,
    coordinates_long FLOAT,
    message_id UUID REFERENCES messages(id) ON DELETE CASCADE,
    fallback_title VARCHAR(255),
    extension VARCHAR(10),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- WEBHOOKS & INTEGRATIONS
-- ========================================

-- Webhooks
CREATE TABLE webhooks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID REFERENCES accounts(id) ON DELETE CASCADE,
    inbox_id UUID REFERENCES inboxes(id) ON DELETE CASCADE,
    url VARCHAR(500) NOT NULL,
    webhook_type webhook_type DEFAULT 'account',
    subscriptions TEXT[] DEFAULT ARRAY['conversation_status_changed', 'conversation_updated', 'conversation_created', 'contact_created', 'contact_updated', 'message_created', 'message_updated', 'webwidget_triggered'],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Integrations
CREATE TABLE integrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID REFERENCES accounts(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    hook_type VARCHAR(50) NOT NULL,
    status integration_status DEFAULT 'disabled',
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(account_id, name)
);

-- ========================================
-- ENUMS & TYPES
-- ========================================

-- Account status
CREATE TYPE account_status AS ENUM ('active', 'suspended');

-- User availability
CREATE TYPE user_availability AS ENUM ('online', 'offline', 'busy');

-- Account user roles
CREATE TYPE account_user_role AS ENUM ('agent', 'administrator');

-- Contact types
CREATE TYPE contact_type AS ENUM ('visitor', 'lead', 'customer');

-- Conversation status
CREATE TYPE conversation_status AS ENUM ('open', 'resolved', 'pending', 'snoozed');

-- Conversation priority
CREATE TYPE conversation_priority AS ENUM ('low', 'medium', 'high', 'urgent');

-- Message types
CREATE TYPE message_type AS ENUM ('incoming', 'outgoing', 'activity', 'template');

-- Content types
CREATE TYPE content_type AS ENUM ('text', 'input_text', 'input_textarea', 'input_email', 'input_select', 'cards', 'form', 'article', 'incoming_email', 'input_csat');

-- Message status
CREATE TYPE message_status AS ENUM ('sent', 'delivered', 'read', 'failed');

-- Sender name types
CREATE TYPE sender_name_type AS ENUM ('friendly', 'professional');

-- Macro visibility
CREATE TYPE macro_visibility AS ENUM ('personal', 'global');

-- Article status
CREATE TYPE article_status AS ENUM ('published', 'draft', 'archived');

-- Campaign types
CREATE TYPE campaign_type AS ENUM ('ongoing', 'one_off');

-- Campaign status
CREATE TYPE campaign_status AS ENUM ('active', 'completed', 'paused');

-- Attachment file types
CREATE TYPE attachment_file_type AS ENUM ('image', 'audio', 'video', 'file', 'location', 'fallback', 'share', 'story_mention', 'template');

-- Webhook types
CREATE TYPE webhook_type AS ENUM ('account', 'inbox');

-- Integration status
CREATE TYPE integration_status AS ENUM ('enabled', 'disabled');

-- ========================================
-- INDEXES & PERFORMANCE
-- ========================================

-- Conversation indexes
CREATE INDEX idx_conversations_account_status ON conversations(account_id, status);
CREATE INDEX idx_conversations_account_inbox ON conversations(account_id, inbox_id);
CREATE INDEX idx_conversations_assignee ON conversations(assignee_id) WHERE assignee_id IS NOT NULL;
CREATE INDEX idx_conversations_contact ON conversations(contact_id) WHERE contact_id IS NOT NULL;
CREATE INDEX idx_conversations_last_activity ON conversations(last_activity_at DESC);
CREATE INDEX idx_conversations_display_id ON conversations(account_id, display_id);

-- Message indexes
CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_messages_account_created ON messages(account_id, created_at DESC);
CREATE INDEX idx_messages_content_search ON messages USING gin(to_tsvector('english', content));

-- Contact indexes
CREATE INDEX idx_contacts_account_email ON contacts(account_id, email) WHERE email IS NOT NULL;
CREATE INDEX idx_contacts_account_phone ON contacts(account_id, phone_number) WHERE phone_number IS NOT NULL;
CREATE INDEX idx_contacts_name_search ON contacts USING gin(to_tsvector('english', name));

-- Vector indexes for AI search
CREATE INDEX idx_captain_embeddings ON captain_assistant_responses USING ivfflat (embedding vector_l2_ops);
CREATE INDEX idx_article_embeddings ON article_embeddings USING ivfflat (embedding vector_l2_ops);

-- Real-time indexes
CREATE INDEX idx_messages_realtime ON messages(conversation_id, created_at) WHERE message_type IN ('incoming', 'outgoing');
CREATE INDEX idx_conversations_realtime ON conversations(account_id, updated_at) WHERE status != 'resolved';

-- ========================================
-- ROW LEVEL SECURITY (RLS)
-- ========================================

-- Enable RLS on all tables
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE account_users ENABLE ROW LEVEL SECURITY;
-- ... (enable for all tables)

-- RLS Policies for multi-tenancy
CREATE POLICY "Users can access their own accounts" ON accounts
    FOR ALL USING (
        id IN (
            SELECT account_id FROM account_users 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can access account data" ON conversations
    FOR ALL USING (
        account_id IN (
            SELECT account_id FROM account_users 
            WHERE user_id = auth.uid()
        )
    );

-- Similar policies for all account-scoped tables...

-- ========================================
-- REALTIME SUBSCRIPTIONS
-- ========================================

-- Enable realtime for key tables
ALTER PUBLICATION supabase_realtime ADD TABLE conversations;
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE contacts;
ALTER PUBLICATION supabase_realtime ADD TABLE account_users;

-- ========================================
-- FUNCTIONS & TRIGGERS
-- ========================================

-- Update timestamps trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to all tables with updated_at
CREATE TRIGGER update_accounts_updated_at BEFORE UPDATE ON accounts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
-- ... (apply to all relevant tables)

-- Auto-increment display_id per account
CREATE OR REPLACE FUNCTION set_conversation_display_id()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.display_id IS NULL THEN
        SELECT COALESCE(MAX(display_id), 0) + 1 
        INTO NEW.display_id 
        FROM conversations 
        WHERE account_id = NEW.account_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER conversation_display_id_trigger
    BEFORE INSERT ON conversations
    FOR EACH ROW EXECUTE FUNCTION set_conversation_display_id();

-- Real-time notification triggers
CREATE OR REPLACE FUNCTION notify_conversation_changes()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM pg_notify('conversation_changes', json_build_object(
        'action', TG_OP,
        'account_id', COALESCE(NEW.account_id, OLD.account_id),
        'conversation_id', COALESCE(NEW.id, OLD.id),
        'data', row_to_json(NEW)
    )::text);
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER conversation_changes_trigger
    AFTER INSERT OR UPDATE OR DELETE ON conversations
    FOR EACH ROW EXECUTE FUNCTION notify_conversation_changes();
```

### 2. Supabase Row Level Security (RLS)

#### **Políticas de Seguridad Multi-tenant**
```sql
-- Política base: usuarios solo acceden a datos de sus cuentas
CREATE POLICY "account_isolation" ON conversations
    FOR ALL USING (
        account_id IN (
            SELECT account_id FROM account_users 
            WHERE user_id = auth.uid()
        )
    );

-- Política para contactos públicos (widget)
CREATE POLICY "public_widget_access" ON conversations
    FOR SELECT USING (
        inbox_id IN (
            SELECT id FROM inboxes 
            WHERE channel_type = 'WebWidget'
            AND account_id = current_setting('app.current_account_id')::UUID
        )
    );

-- Política para admins de cuenta
CREATE POLICY "account_admin_full_access" ON account_users
    FOR ALL USING (
        account_id IN (
            SELECT account_id FROM account_users 
            WHERE user_id = auth.uid() AND role = 'administrator'
        )
    );
```

---

## 🎨 Arquitectura Frontend

### 1. Estructura de Aplicación Next.js

```
chatwoot-clone/
├── app/                              # Next.js App Router
│   ├── (auth)/                       # Auth route group
│   │   ├── login/
│   │   ├── signup/
│   │   └── forgot-password/
│   ├── (dashboard)/                  # Protected dashboard routes
│   │   ├── [accountSlug]/            # Account-scoped routes
│   │   │   ├── conversations/        # Conversation management
│   │   │   ├── contacts/             # Contact management
│   │   │   ├── inbox/                # Inbox configuration
│   │   │   ├── teams/                # Team management
│   │   │   ├── reports/              # Analytics & reporting
│   │   │   ├── settings/             # Account settings
│   │   │   └── captain/              # AI features
│   │   └── account-selector/         # Multi-account selection
│   ├── widget/                       # Chat widget (public)
│   ├── portal/                       # Help center (public)
│   └── api/                          # API routes
│       ├── auth/
│       ├── webhooks/
│       ├── integrations/
│       └── trpc/[trpc]/
├── components/                       # Shared components
│   ├── ui/                          # Radix UI components
│   ├── forms/                       # Form components
│   ├── chat/                        # Chat-specific components
│   ├── dashboard/                   # Dashboard components
│   └── widget/                      # Widget components
├── lib/                             # Utilities & configuration
│   ├── supabase/                    # Supabase client & types
│   ├── trpc/                        # tRPC configuration
│   ├── stores/                      # Zustand stores
│   └── utils/                       # Utility functions
├── hooks/                           # Custom React hooks
├── types/                           # TypeScript definitions
└── styles/                          # Global styles
```

### 2. State Management Architecture

#### **Zustand Stores**
```typescript
// stores/auth-store.ts
interface AuthState {
  user: User | null;
  currentAccount: Account | null;
  accounts: Account[];
  setUser: (user: User | null) => void;
  setCurrentAccount: (account: Account) => void;
  switchAccount: (accountSlug: string) => Promise<void>;
}

// stores/conversation-store.ts
interface ConversationState {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  filters: ConversationFilters;
  loading: boolean;
  setCurrentConversation: (id: string) => void;
  updateConversationStatus: (id: string, status: Status) => void;
  addMessage: (conversationId: string, message: Message) => void;
}

// stores/realtime-store.ts
interface RealtimeState {
  connected: boolean;
  typingUsers: Record<string, string[]>;
  presenceData: Record<string, UserPresence>;
  subscribe: (channel: string, callback: Function) => void;
  unsubscribe: (channel: string) => void;
}
```

#### **React Query Integration**
```typescript
// hooks/useConversations.ts
export function useConversations(accountId: string, filters: ConversationFilters) {
  return useQuery({
    queryKey: ['conversations', accountId, filters],
    queryFn: () => trpc.conversations.list.query({ accountId, ...filters }),
    staleTime: 1000 * 60, // 1 minute
    refetchOnWindowFocus: true,
  });
}

// hooks/useRealtimeMessages.ts
export function useRealtimeMessages(conversationId: string) {
  const queryClient = useQueryClient();
  const supabase = useSupabaseClient();
  
  useEffect(() => {
    const channel = supabase
      .channel(`conversation:${conversationId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`
      }, (payload) => {
        queryClient.setQueryData(
          ['messages', conversationId],
          (old: Message[]) => [...old, payload.new as Message]
        );
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId]);
}
```

### 3. Component Architecture

#### **Design System Base**
```typescript
// components/ui/button.tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
```

#### **Chat Components**
```typescript
// components/chat/conversation-list.tsx
interface ConversationListProps {
  accountId: string;
  filters: ConversationFilters;
  onConversationSelect: (id: string) => void;
}

export function ConversationList({ accountId, filters, onConversationSelect }: ConversationListProps) {
  const { data: conversations, isLoading } = useConversations(accountId, filters);
  const currentConversation = useConversationStore(s => s.currentConversation);

  return (
    <div className="flex flex-col h-full">
      <ConversationFilters filters={filters} onFiltersChange={setFilters} />
      <ScrollArea className="flex-1">
        {conversations?.map(conversation => (
          <ConversationItem
            key={conversation.id}
            conversation={conversation}
            isActive={currentConversation?.id === conversation.id}
            onClick={() => onConversationSelect(conversation.id)}
          />
        ))}
      </ScrollArea>
    </div>
  );
}

// components/chat/message-list.tsx
export function MessageList({ conversationId }: { conversationId: string }) {
  const { data: messages } = useMessages(conversationId);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Real-time message updates
  useRealtimeMessages(conversationId);
  
  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <ScrollArea className="flex-1 p-4">
      {messages?.map(message => (
        <MessageBubble key={message.id} message={message} />
      ))}
      <div ref={messagesEndRef} />
    </ScrollArea>
  );
}
```

### 4. Real-time Architecture

#### **Supabase Realtime Integration**
```typescript
// hooks/useRealtimePresence.ts
export function useRealtimePresence(accountId: string) {
  const [presenceData, setPresenceData] = useState<Record<string, UserPresence>>({});
  const supabase = useSupabaseClient();
  const user = useUser();

  useEffect(() => {
    const channel = supabase.channel(`account:${accountId}:presence`)
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        setPresenceData(state);
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('User joined:', key, newPresences);
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('User left:', key, leftPresences);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED' && user) {
          await channel.track({
            user_id: user.id,
            name: user.user_metadata.name,
            online_at: new Date().toISOString(),
          });
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [accountId, user]);

  return presenceData;
}

// hooks/useTypingIndicator.ts
export function useTypingIndicator(conversationId: string) {
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const supabase = useSupabaseClient();
  const user = useUser();

  const startTyping = useCallback(() => {
    if (!user) return;
    
    supabase.channel(`conversation:${conversationId}:typing`)
      .send({
        type: 'broadcast',
        event: 'typing_start',
        payload: { user_id: user.id, name: user.user_metadata.name }
      });
  }, [conversationId, user]);

  const stopTyping = useCallback(() => {
    if (!user) return;
    
    supabase.channel(`conversation:${conversationId}:typing`)
      .send({
        type: 'broadcast',
        event: 'typing_stop', 
        payload: { user_id: user.id }
      });
  }, [conversationId, user]);

  return { typingUsers, startTyping, stopTyping };
}
```

---

## 🔌 API Architecture

### 1. tRPC API Schema

```typescript
// server/routers/conversations.ts
export const conversationsRouter = router({
  list: protectedProcedure
    .input(z.object({
      accountId: z.string(),
      status: z.enum(['open', 'resolved', 'pending']).optional(),
      assigneeId: z.string().optional(),
      inboxId: z.string().optional(),
      labelIds: z.array(z.string()).optional(),
      page: z.number().default(1),
      limit: z.number().max(100).default(25),
    }))
    .query(async ({ input, ctx }) => {
      const { data, count } = await ctx.supabase
        .from('conversations')
        .select('*, contact:contacts(*), assignee:users(*), inbox:inboxes(*)', { count: 'exact' })
        .eq('account_id', input.accountId)
        .match(omitBy(pick(input, ['status', 'assignee_id', 'inbox_id']), isUndefined))
        .order('last_activity_at', { ascending: false })
        .range((input.page - 1) * input.limit, input.page * input.limit - 1);

      return {
        conversations: data || [],
        totalCount: count || 0,
        currentPage: input.page,
        totalPages: Math.ceil((count || 0) / input.limit),
      };
    }),

  create: protectedProcedure
    .input(z.object({
      accountId: z.string(),
      contactId: z.string(),
      inboxId: z.string(),
      message: z.string(),
      assigneeId: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const { data: conversation, error } = await ctx.supabase
        .from('conversations')
        .insert({
          account_id: input.accountId,
          contact_id: input.contactId,
          inbox_id: input.inboxId,
          assignee_id: input.assigneeId,
        })
        .select()
        .single();

      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message });

      // Create initial message
      await ctx.supabase
        .from('messages')
        .insert({
          account_id: input.accountId,
          conversation_id: conversation.id,
          inbox_id: input.inboxId,
          content: input.message,
          message_type: 'outgoing',
          sender_type: 'User',
          sender_id: ctx.user.id,
        });

      return conversation;
    }),

  updateStatus: protectedProcedure
    .input(z.object({
      conversationId: z.string(),
      status: z.enum(['open', 'resolved', 'pending', 'snoozed']),
      snoozedUntil: z.date().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const { data, error } = await ctx.supabase
        .from('conversations')
        .update({
          status: input.status,
          snoozed_until: input.snoozedUntil,
          updated_at: new Date().toISOString(),
        })
        .eq('id', input.conversationId)
        .select()
        .single();

      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message });

      // Create activity message
      await ctx.supabase
        .from('messages')
        .insert({
          account_id: data.account_id,
          conversation_id: input.conversationId,
          inbox_id: data.inbox_id,
          content: `Conversation status changed to ${input.status}`,
          message_type: 'activity',
          sender_type: 'User',
          sender_id: ctx.user.id,
        });

      return data;
    }),
});

// server/routers/messages.ts
export const messagesRouter = router({
  list: protectedProcedure
    .input(z.object({
      conversationId: z.string(),
      page: z.number().default(1),
      limit: z.number().max(100).default(50),
    }))
    .query(async ({ input, ctx }) => {
      const { data, error } = await ctx.supabase
        .from('messages')
        .select('*, attachments(*)')
        .eq('conversation_id', input.conversationId)
        .order('created_at', { ascending: true })
        .range((input.page - 1) * input.limit, input.page * input.limit - 1);

      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message });
      return data || [];
    }),

  create: protectedProcedure
    .input(z.object({
      conversationId: z.string(),
      content: z.string(),
      messageType: z.enum(['incoming', 'outgoing']),
      private: z.boolean().default(false),
      contentAttributes: z.record(z.any()).optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      // Get conversation details
      const { data: conversation } = await ctx.supabase
        .from('conversations')
        .select('account_id, inbox_id, status')
        .eq('id', input.conversationId)
        .single();

      if (!conversation) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Conversation not found' });
      }

      // Auto-reopen conversation if resolved
      if (conversation.status === 'resolved' && input.messageType === 'incoming') {
        await ctx.supabase
          .from('conversations')
          .update({ status: 'open' })
          .eq('id', input.conversationId);
      }

      const { data: message, error } = await ctx.supabase
        .from('messages')
        .insert({
          account_id: conversation.account_id,
          conversation_id: input.conversationId,
          inbox_id: conversation.inbox_id,
          content: input.content,
          message_type: input.messageType,
          private: input.private,
          content_attributes: input.contentAttributes || {},
          sender_type: 'User',
          sender_id: ctx.user.id,
        })
        .select()
        .single();

      if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message });

      // Update conversation last activity
      await ctx.supabase
        .from('conversations')
        .update({ last_activity_at: new Date().toISOString() })
        .eq('id', input.conversationId);

      return message;
    }),
});
```

### 2. Next.js API Routes

```typescript
// app/api/webhooks/whatsapp/[phone]/route.ts
export async function POST(
  request: Request,
  { params }: { params: { phone: string } }
) {
  const body = await request.text();
  const signature = request.headers.get('x-hub-signature-256');
  
  // Verify webhook signature
  const isValid = verifyWhatsAppSignature(body, signature);
  if (!isValid) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  const payload = JSON.parse(body);
  
  // Process WhatsApp webhook
  await processWhatsAppWebhook(params.phone, payload);
  
  return NextResponse.json({ status: 'ok' });
}

// app/api/widget/[token]/conversations/route.ts
export async function GET(
  request: Request,
  { params }: { params: { token: string } }
) {
  const { searchParams } = new URL(request.url);
  const contactIdentifier = searchParams.get('contact_identifier');
  
  // Validate widget token
  const inbox = await validateWidgetToken(params.token);
  if (!inbox) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  // Get or create contact
  const contact = await getOrCreateContact(inbox.account_id, contactIdentifier);
  
  // Get conversations
  const conversations = await getContactConversations(contact.id, inbox.id);
  
  return NextResponse.json({ conversations });
}
```

---

## 🔧 Funcionalidades Core

### 1. Sistema de Autenticación

```typescript
// lib/auth/auth-provider.tsx
interface AuthContextType {
  user: User | null;
  currentAccount: Account | null;
  accounts: Account[];
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  switchAccount: (accountSlug: string) => Promise<void>;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [currentAccount, setCurrentAccount] = useState<Account | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = useSupabaseClient();
  const router = useRouter();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadUserAccounts(session.user.id);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await loadUserAccounts(session.user.id);
        } else {
          setAccounts([]);
          setCurrentAccount(null);
          router.push('/login');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const loadUserAccounts = async (userId: string) => {
    const { data } = await supabase
      .from('account_users')
      .select('account:accounts(*), role')
      .eq('user_id', userId);

    const userAccounts = data?.map(item => ({
      ...item.account,
      role: item.role
    })) || [];

    setAccounts(userAccounts);
    
    // Set current account from localStorage or first account
    const savedAccountSlug = localStorage.getItem('currentAccountSlug');
    const defaultAccount = userAccounts.find(acc => acc.slug === savedAccountSlug) || userAccounts[0];
    
    if (defaultAccount) {
      setCurrentAccount(defaultAccount);
    }
  };

  const switchAccount = async (accountSlug: string) => {
    const account = accounts.find(acc => acc.slug === accountSlug);
    if (account) {
      setCurrentAccount(account);
      localStorage.setItem('currentAccountSlug', accountSlug);
      router.push(`/${accountSlug}/conversations`);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      currentAccount,
      accounts,
      loading,
      signIn,
      signUp,
      signOut,
      switchAccount,
    }}>
      {children}
    </AuthContext.Provider>
  );
}
```

### 2. Widget de Chat Embebible

```typescript
// components/widget/chat-widget.tsx
interface ChatWidgetProps {
  token: string;
  baseUrl?: string;
  hideMessageBubble?: boolean;
  position?: 'left' | 'right';
  locale?: string;
  customAttributes?: Record<string, any>;
}

export function ChatWidget({
  token,
  baseUrl = '',
  hideMessageBubble = false,
  position = 'right',
  locale = 'en',
  customAttributes = {},
}: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [config, setConfig] = useState<WidgetConfig | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Load widget configuration
  useEffect(() => {
    fetch(`${baseUrl}/api/widget/${token}/config`)
      .then(res => res.json())
      .then(data => {
        setConfig(data);
        setIsLoaded(true);
      });
  }, [token, baseUrl]);

  // Real-time message updates
  useEffect(() => {
    if (!config || !isOpen) return;

    const eventSource = new EventSource(
      `${baseUrl}/api/widget/${token}/events`
    );

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.type === 'message.created') {
        setMessages(prev => [...prev, data.message]);
        if (!isOpen) {
          setUnreadCount(prev => prev + 1);
        }
      }
    };

    return () => eventSource.close();
  }, [config, isOpen, token, baseUrl]);

  const sendMessage = async (content: string) => {
    if (!config) return;

    const message = {
      content,
      message_type: 'outgoing',
      created_at: new Date().toISOString(),
    };

    // Optimistic update
    setMessages(prev => [...prev, message]);

    // Send to server
    await fetch(`${baseUrl}/api/widget/${token}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });
  };

  if (!isLoaded || !config) {
    return null;
  }

  return (
    <div className={cn(
      'fixed bottom-4 z-50',
      position === 'right' ? 'right-4' : 'left-4'
    )}>
      {/* Chat Bubble */}
      {!hideMessageBubble && !isOpen && (
        <Button
          onClick={() => {
            setIsOpen(true);
            setUnreadCount(0);
          }}
          className="rounded-full w-16 h-16 shadow-lg relative"
          style={{ backgroundColor: config.widget_color }}
        >
          <MessageCircle className="w-8 h-8" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-2 -right-2 bg-red-500">
              {unreadCount}
            </Badge>
          )}
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="w-80 h-96 shadow-xl flex flex-col">
          <CardHeader className="bg-primary text-white p-4 rounded-t-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{config.welcome_title}</h3>
                <p className="text-sm opacity-90">{config.welcome_tagline}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col p-0">
            <MessageList messages={messages} />
            <MessageInput onSend={sendMessage} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Widget SDK export
export function initChatwootWidget(config: ChatWidgetProps) {
  const container = document.createElement('div');
  container.id = 'chatwoot-widget-container';
  document.body.appendChild(container);

  const root = createRoot(container);
  root.render(<ChatWidget {...config} />);

  return {
    toggle: () => {
      // Toggle widget visibility
    },
    setUser: (user: any) => {
      // Set user attributes
    },
    setCustomAttributes: (attributes: any) => {
      // Set custom attributes
    },
  };
}
```

### 3. Centro de Ayuda (Knowledge Base)

```typescript
// app/portal/[slug]/page.tsx
interface PortalPageProps {
  params: { slug: string };
  searchParams: { locale?: string; q?: string };
}

export default async function PortalPage({ params, searchParams }: PortalPageProps) {
  const portal = await getPortalBySlug(params.slug);
  const locale = searchParams.locale || 'en';
  const searchQuery = searchParams.q;

  if (!portal) {
    notFound();
  }

  const [categories, articles] = await Promise.all([
    getPortalCategories(portal.id, locale),
    searchQuery ? searchArticles(portal.id, searchQuery, locale) : null,
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <PortalHeader portal={portal} locale={locale} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <SearchBox
            placeholder={`Search ${portal.name}...`}
            defaultValue={searchQuery}
          />

          {searchQuery ? (
            <SearchResults articles={articles} query={searchQuery} />
          ) : (
            <CategoryGrid categories={categories} />
          )}
        </div>
      </main>

      <PortalFooter portal={portal} />
    </div>
  );
}

// components/portal/article-viewer.tsx
export function ArticleViewer({ article }: { article: Article }) {
  const [feedback, setFeedback] = useState<'helpful' | 'not-helpful' | null>(null);

  const handleFeedback = async (type: 'helpful' | 'not-helpful') => {
    setFeedback(type);
    
    // Submit feedback
    await fetch(`/api/portal/articles/${article.id}/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ feedback: type }),
    });
  };

  return (
    <article className="prose prose-lg max-w-none">
      <header className="mb-8">
        <h1>{article.title}</h1>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>Updated {formatDistanceToNow(new Date(article.updated_at))} ago</span>
          <span>{article.views} views</span>
        </div>
      </header>

      <div
        dangerouslySetInnerHTML={{ __html: article.content }}
        className="article-content"
      />

      <footer className="mt-12 pt-8 border-t">
        <div className="text-center">
          <p className="mb-4 text-gray-600">Was this article helpful?</p>
          <div className="flex justify-center gap-4">
            <Button
              variant={feedback === 'helpful' ? 'default' : 'outline'}
              onClick={() => handleFeedback('helpful')}
              disabled={feedback !== null}
            >
              <ThumbsUp className="w-4 h-4 mr-2" />
              Yes
            </Button>
            <Button
              variant={feedback === 'not-helpful' ? 'default' : 'outline'}
              onClick={() => handleFeedback('not-helpful')}
              disabled={feedback !== null}
            >
              <ThumbsDown className="w-4 h-4 mr-2" />
              No
            </Button>
          </div>
        </div>
      </footer>
    </article>
  );
}
```

---

## 🤖 Integraciones y AI

### 1. Integración OpenAI/LangChain

```typescript
// lib/ai/captain-assistant.ts
import { OpenAI } from 'openai';
import { SupabaseVectorStore } from 'langchain/vectorstores/supabase';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { RetrievalQAChain } from 'langchain/chains';

export class CaptainAssistant {
  private openai: OpenAI;
  private vectorStore: SupabaseVectorStore;
  private embeddings: OpenAIEmbeddings;

  constructor(
    private supabase: SupabaseClient,
    private accountId: string
  ) {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    this.embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    this.vectorStore = new SupabaseVectorStore(this.embeddings, {
      client: this.supabase,
      tableName: 'captain_assistant_responses',
      queryName: 'match_documents',
    });
  }

  async generateResponse(question: string, context?: string): Promise<string> {
    const chain = RetrievalQAChain.fromLLM(
      new OpenAI({ temperature: 0 }),
      this.vectorStore.asRetriever(3)
    );

    const response = await chain.call({
      query: `Context: ${context || ''}\n\nQuestion: ${question}`,
    });

    return response.text;
  }

  async addKnowledgeBase(articles: Article[]): Promise<void> {
    const documents = articles.map(article => ({
      pageContent: `${article.title}\n\n${article.content}`,
      metadata: {
        article_id: article.id,
        title: article.title,
        category: article.category?.name,
      },
    }));

    await this.vectorStore.addDocuments(documents);
  }

  async suggestLabels(message: string): Promise<string[]> {
    const prompt = `Based on this customer message, suggest 1-3 relevant labels from our system:

Message: "${message}"

Available labels: billing, technical-support, feature-request, bug-report, sales, general-inquiry

Respond with just the labels, comma-separated:`;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 50,
    });

    const labels = response.choices[0]?.message?.content
      ?.split(',')
      .map(label => label.trim())
      .filter(Boolean) || [];

    return labels;
  }

  async analyzeSentiment(message: string): Promise<{
    sentiment: 'positive' | 'neutral' | 'negative';
    confidence: number;
  }> {
    const prompt = `Analyze the sentiment of this customer message and respond with JSON:

Message: "${message}"

Respond with: {"sentiment": "positive|neutral|negative", "confidence": 0.0-1.0}`;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.1,
      max_tokens: 100,
    });

    try {
      return JSON.parse(response.choices[0]?.message?.content || '{}');
    } catch {
      return { sentiment: 'neutral', confidence: 0.5 };
    }
  }
}

// hooks/useCaptainAssistant.ts
export function useCaptainAssistant(accountId: string) {
  const supabase = useSupabaseClient();
  const [assistant] = useState(() => new CaptainAssistant(supabase, accountId));

  const generateResponse = useMutation({
    mutationFn: ({ question, context }: { question: string; context?: string }) =>
      assistant.generateResponse(question, context),
  });

  const suggestLabels = useMutation({
    mutationFn: (message: string) => assistant.suggestLabels(message),
  });

  const analyzeSentiment = useMutation({
    mutationFn: (message: string) => assistant.analyzeSentiment(message),
  });

  return {
    generateResponse,
    suggestLabels,
    analyzeSentiment,
  };
}
```

### 2. Integración WhatsApp

```typescript
// lib/integrations/whatsapp/whatsapp-client.ts
export class WhatsAppCloudClient {
  constructor(
    private accessToken: string,
    private phoneNumberId: string,
    private webhookVerifyToken: string
  ) {}

  async sendMessage(to: string, message: WhatsAppMessage): Promise<any> {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${this.phoneNumberId}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to,
          ...message,
        }),
      }
    );

    return response.json();
  }

  async sendTextMessage(to: string, text: string): Promise<any> {
    return this.sendMessage(to, {
      type: 'text',
      text: { body: text },
    });
  }

  async sendMediaMessage(
    to: string,
    type: 'image' | 'video' | 'audio' | 'document',
    mediaId: string,
    caption?: string
  ): Promise<any> {
    return this.sendMessage(to, {
      type,
      [type]: {
        id: mediaId,
        caption,
      },
    });
  }

  async sendTemplateMessage(
    to: string,
    templateName: string,
    languageCode: string,
    parameters?: any[]
  ): Promise<any> {
    return this.sendMessage(to, {
      type: 'template',
      template: {
        name: templateName,
        language: { code: languageCode },
        components: parameters ? [
          {
            type: 'body',
            parameters: parameters.map(param => ({ type: 'text', text: param })),
          },
        ] : [],
      },
    });
  }

  verifyWebhook(mode: string, token: string, challenge: string): string | null {
    if (mode === 'subscribe' && token === this.webhookVerifyToken) {
      return challenge;
    }
    return null;
  }

  processWebhook(payload: any): WhatsAppWebhookEvent[] {
    const events: WhatsAppWebhookEvent[] = [];

    payload.entry?.forEach((entry: any) => {
      entry.changes?.forEach((change: any) => {
        if (change.field === 'messages') {
          const messages = change.value.messages || [];
          const statuses = change.value.statuses || [];

          messages.forEach((message: any) => {
            events.push({
              type: 'message',
              phoneNumber: change.value.metadata.phone_number_id,
              from: message.from,
              message,
              timestamp: new Date(parseInt(message.timestamp) * 1000),
            });
          });

          statuses.forEach((status: any) => {
            events.push({
              type: 'status',
              phoneNumber: change.value.metadata.phone_number_id,
              messageId: status.id,
              status: status.status,
              timestamp: new Date(parseInt(status.timestamp) * 1000),
            });
          });
        }
      });
    });

    return events;
  }
}

// app/api/webhooks/whatsapp/[phone]/route.ts
export async function GET(
  request: Request,
  { params }: { params: { phone: string } }
) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  // Get WhatsApp channel configuration
  const { data: channel } = await supabase
    .from('channel_whatsapps')
    .select('provider_config')
    .eq('phone_number', params.phone)
    .single();

  if (!channel) {
    return NextResponse.json({ error: 'Channel not found' }, { status: 404 });
  }

  const client = new WhatsAppCloudClient(
    channel.provider_config.access_token,
    channel.provider_config.phone_number_id,
    channel.provider_config.webhook_verify_token
  );

  const verificationChallenge = client.verifyWebhook(mode!, token!, challenge!);
  
  if (verificationChallenge) {
    return new Response(verificationChallenge);
  }

  return NextResponse.json({ error: 'Verification failed' }, { status: 403 });
}

export async function POST(
  request: Request,
  { params }: { params: { phone: string } }
) {
  const payload = await request.json();

  // Get WhatsApp channel
  const { data: channel } = await supabase
    .from('channel_whatsapps')
    .select('*, inbox:inboxes(*)')
    .eq('phone_number', params.phone)
    .single();

  if (!channel) {
    return NextResponse.json({ error: 'Channel not found' }, { status: 404 });
  }

  const client = new WhatsAppCloudClient(
    channel.provider_config.access_token,
    channel.provider_config.phone_number_id,
    channel.provider_config.webhook_verify_token
  );

  const events = client.processWebhook(payload);

  for (const event of events) {
    if (event.type === 'message') {
      await processIncomingWhatsAppMessage(channel, event);
    } else if (event.type === 'status') {
      await updateMessageStatus(event.messageId, event.status);
    }
  }

  return NextResponse.json({ status: 'ok' });
}
```

---

## 📊 Deployment y DevOps

### 1. Configuración de Vercel

```json
// vercel.json
{
  "framework": "nextjs",
  "regions": ["iad1"],
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    },
    "app/api/webhooks/**/*.ts": {
      "maxDuration": 60
    }
  },
  "crons": [
    {
      "path": "/api/cron/cleanup-old-messages",
      "schedule": "0 2 * * *"
    },
    {
      "path": "/api/cron/update-metrics",
      "schedule": "*/15 * * * *"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  },
  "build": {
    "env": {
      "NEXT_TELEMETRY_DISABLED": "1"
    }
  },
  "headers": [
    {
      "source": "/api/widget/(.*)",
      "headers": [
        {
          "key": "Access-Control-Allow-Origin",
          "value": "*"
        },
        {
          "key": "Access-Control-Allow-Methods",
          "value": "GET, POST, PUT, DELETE, OPTIONS"
        },
        {
          "key": "Access-Control-Allow-Headers",
          "value": "Content-Type, Authorization"
        }
      ]
    }
  ]
}
```

```typescript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@supabase/supabase-js'],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/widget.js',
        destination: '/api/widget/sdk',
      },
      {
        source: '/portal/:slug*',
        destination: '/portal/:slug*',
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/widget.js',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/javascript',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
```

### 2. Variables de Entorno

```bash
# .env.example

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# OpenAI
OPENAI_API_KEY=sk-your-openai-key

# File Upload
NEXT_PUBLIC_MAX_FILE_SIZE=10485760  # 10MB
ALLOWED_FILE_TYPES=image/*,video/*,audio/*,.pdf,.doc,.docx

# App Configuration  
NEXT_PUBLIC_APP_NAME=Chatwoot Clone
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_WIDGET_BASE_URL=https://your-domain.com

# Feature Flags
NEXT_PUBLIC_ENABLE_AI_FEATURES=true
NEXT_PUBLIC_ENABLE_VOICE_MESSAGES=true
NEXT_PUBLIC_ENABLE_VIDEO_CALLS=false

# Third-party Integrations
GOOGLE_OAUTH_CLIENT_ID=your-google-client-id
GOOGLE_OAUTH_CLIENT_SECRET=your-google-client-secret

SLACK_CLIENT_ID=your-slack-client-id  
SLACK_CLIENT_SECRET=your-slack-client-secret

WHATSAPP_CLOUD_API_TOKEN=your-whatsapp-token
WHATSAPP_WEBHOOK_VERIFY_TOKEN=your-webhook-token

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Monitoring
SENTRY_DSN=https://your-sentry-dsn
SENTRY_ORG=your-org
SENTRY_PROJECT=your-project

# Rate Limiting (Upstash Redis)
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-redis-token

# Background Jobs (QStash)
QSTASH_URL=https://qstash.upstash.io
QSTASH_TOKEN=your-qstash-token
```

### 3. GitHub Actions CI/CD

```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run type checking
        run: npm run type-check
        
      - name: Run linting
        run: npm run lint
        
      - name: Run tests
        run: npm run test
        env:
          NODE_ENV: test
          
      - name: Build application
        run: npm run build
        env:
          NODE_ENV: production
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}

  deploy-preview:
    if: github.event_name == 'pull_request'
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}

  deploy-production:
    if: github.ref == 'refs/heads/main'
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

---

## 🔄 Plan de Migración

### Fase 1: Infraestructura Base (Semanas 1-2)
- [ ] Setup inicial Next.js 15 + TypeScript
- [ ] Configuración Supabase (database, auth, storage)
- [ ] Schema de base de datos PostgreSQL + RLS
- [ ] Sistema de autenticación básico
- [ ] Deploy inicial en Vercel

### Fase 2: Core Features (Semanas 3-6)
- [ ] Dashboard de conversaciones
- [ ] Sistema de mensajería en tiempo real
- [ ] Gestión de contactos
- [ ] Configuración de inboxes
- [ ] Gestión de equipos y agentes

### Fase 3: Channels & Widget (Semanas 7-9)
- [ ] Widget de chat embebible
- [ ] Canal web widget
- [ ] Canal de email
- [ ] Integración WhatsApp básica
- [ ] API pública para widget

### Fase 4: Automación & AI (Semanas 10-12)
- [ ] Sistema de reglas de automatización
- [ ] Integración OpenAI/LangChain
- [ ] Análisis de sentimientos
- [ ] Sugerencias automáticas de etiquetas
- [ ] Respuestas automáticas

### Fase 5: Knowledge Base (Semanas 13-14)
- [ ] Portal de ayuda público
- [ ] Gestión de artículos y categorías
- [ ] Búsqueda semántica con vectores
- [ ] Sistema de feedback
- [ ] Multi-idioma

### Fase 6: Integraciones Avanzadas (Semanas 15-17)
- [ ] Slack integration
- [ ] Integración con CRMs
- [ ] Webhooks personalizados
- [ ] Más canales de mensajería (Telegram, Instagram)
- [ ] API completa para terceros

### Fase 7: Analytics & Enterprise (Semanas 18-20)
- [ ] Sistema de reportes avanzados
- [ ] Métricas en tiempo real
- [ ] SLA management
- [ ] Roles y permisos granulares
- [ ] Audit logs

---

## 📈 Estimación de Recursos

### **Equipo Recomendado**

**Desarrolladores (4 personas)**
- 1 Tech Lead Full-stack (Next.js + Supabase)
- 1 Frontend Developer (React + TypeScript)  
- 1 Backend Developer (API + Database)
- 1 DevOps/Integration Specialist

**Especialistas (2 personas)**
- 1 UI/UX Designer (diseño system + componentes)
- 1 QA Engineer (testing + automation)

### **Timeline Total: 20 semanas (~5 meses)**

### **Costos Estimados (Infraestructura mensual)**

```yaml
Vercel Pro: $20/mes por desarrollador
Supabase Pro: $25/mes + usage
Upstash Redis: $10/mes  
OpenAI API: ~$50-200/mes (según uso)
Sentry: $26/mes
Total: ~$150-350/mes para producción
```

### **Métricas de Éxito**

- **Performance**: < 2s tiempo de carga inicial
- **Real-time**: < 100ms latencia de mensajes
- **Uptime**: 99.9% disponibilidad
- **Scalability**: Soporte para 10,000+ conversaciones concurrentes
- **SEO**: 95+ score en Lighthouse
- **Security**: OWASP compliance + SOC2 ready

---

## 🚀 Ventajas del Nuevo Stack

### **vs. Ruby on Rails + Vue.js Original**

| Aspecto | Chatwoot Original | Next.js Clone |
|---------|------------------|---------------|
| **Frontend Performance** | Vue.js SSR/SPA | React Server Components + Streaming |
| **Backend Performance** | Rails API | Edge Runtime + Supabase |
| **Real-time** | ActionCable | Supabase Realtime |
| **Database** | PostgreSQL + Redis | PostgreSQL + Edge Caching |
| **Deployment** | Docker + Multiple servers | Vercel Edge Network |
| **Scaling** | Horizontal scaling needed | Auto-scaling serverless |
| **Development Speed** | Full-stack setup | Instant deploys |
| **Type Safety** | Ruby + JS types | End-to-end TypeScript |
| **Cold Start** | N/A (persistent servers) | ~50ms edge functions |
| **Global CDN** | Manual setup | Built-in edge distribution |

### **Beneficios Clave**

1. **🚀 Performance Superior**
   - Server Components para renderizado instantáneo
   - Edge Runtime para latencia mínima global
   - Automatic code splitting y optimización

2. **🔧 Developer Experience**
   - Type safety completa con TypeScript
   - Hot reload instantáneo
   - Tooling moderno (Vite, ESLint, Prettier)

3. **📈 Escalabilidad Automática**
   - Serverless functions auto-scaling
   - Edge distribution global
   - Pay-per-use pricing model

4. **🔒 Seguridad Mejorada**
   - Row Level Security built-in
   - Edge Runtime sandboxing
   - Automatic security updates

5. **💰 Costos Optimizados**
   - No infrastructure management
   - Pay-per-use model
   - Automatic resource optimization

---

Este PRD técnico proporciona una hoja de ruta completa para construir un clon de Chatwoot utilizando tecnologías modernas, manteniendo la paridad de funcionalidades mientras se mejora significativamente el rendimiento, la escalabilidad y la experiencia de desarrollo.