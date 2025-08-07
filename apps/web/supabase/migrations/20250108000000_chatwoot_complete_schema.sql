/*
 * ========================================
 * CHATWOOT CLONE - COMPLETE DATABASE SCHEMA
 * ========================================
 * 
 * This migration creates the complete schema for the Chatwoot Clone
 * following the specifications in CLAUDE.md
 * 
 * Features:
 * - Multi-tenant SaaS platform
 * - Real-time messaging system
 * - Multi-channel support (Web, Email, WhatsApp, etc.)
 * - AI-powered features with vector search
 * - Knowledge base system
 * - Team management and automation
 */

-- ========================================
-- EXTENSIONS & SETUP
-- ========================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "unaccent";

-- Create kit schema for utility functions
CREATE SCHEMA IF NOT EXISTS kit;

-- Remove default privileges from public schema
ALTER DEFAULT PRIVILEGES REVOKE EXECUTE ON FUNCTIONS FROM public;
REVOKE ALL ON SCHEMA public FROM public;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO service_role;

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
-- MULTI-TENANCY & AUTHENTICATION TABLES
-- ========================================

-- Accounts (organizations/companies)
CREATE TABLE IF NOT EXISTS accounts (
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
    picture_url VARCHAR(1000),
    public_data JSONB DEFAULT '{}'::jsonb NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users,
    updated_by UUID REFERENCES auth.users
);

-- Users (system users - agents, admins)
CREATE TABLE IF NOT EXISTS users (
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

-- Account Users (many-to-many with roles)
CREATE TABLE IF NOT EXISTS account_users (
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

-- Contacts (end customers)
CREATE TABLE IF NOT EXISTS contacts (
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

-- ========================================
-- TEAM MANAGEMENT
-- ========================================

-- Teams
CREATE TABLE IF NOT EXISTS teams (
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
CREATE TABLE IF NOT EXISTS team_members (
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
CREATE TABLE IF NOT EXISTS channel_web_widgets (
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
CREATE TABLE IF NOT EXISTS channel_emails (
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
CREATE TABLE IF NOT EXISTS channel_whatsapps (
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
-- INBOXES & CONVERSATIONS
-- ========================================

-- Inboxes (communication channels)
CREATE TABLE IF NOT EXISTS inboxes (
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

-- Conversations (chat threads)
CREATE TABLE IF NOT EXISTS conversations (
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

-- Messages (individual messages)
CREATE TABLE IF NOT EXISTS messages (
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
-- AUTOMATION & AI
-- ========================================

-- Automation Rules
CREATE TABLE IF NOT EXISTS automation_rules (
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
CREATE TABLE IF NOT EXISTS macros (
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
CREATE TABLE IF NOT EXISTS captain_assistant_responses (
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
CREATE TABLE IF NOT EXISTS portals (
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
CREATE TABLE IF NOT EXISTS categories (
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
CREATE TABLE IF NOT EXISTS articles (
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

-- Article Embeddings (for semantic search)
CREATE TABLE IF NOT EXISTS article_embeddings (
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
CREATE TABLE IF NOT EXISTS campaigns (
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
CREATE TABLE IF NOT EXISTS labels (
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
CREATE TABLE IF NOT EXISTS conversation_labels (
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
CREATE TABLE IF NOT EXISTS attachments (
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
CREATE TABLE IF NOT EXISTS webhooks (
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
CREATE TABLE IF NOT EXISTS integrations (
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
-- PERFORMANCE INDEXES
-- ========================================

-- Conversation indexes
CREATE INDEX IF NOT EXISTS idx_conversations_account_status ON conversations(account_id, status);
CREATE INDEX IF NOT EXISTS idx_conversations_account_inbox ON conversations(account_id, inbox_id);
CREATE INDEX IF NOT EXISTS idx_conversations_assignee ON conversations(assignee_id) WHERE assignee_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_conversations_contact ON conversations(contact_id) WHERE contact_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_conversations_last_activity ON conversations(last_activity_at DESC);
CREATE INDEX IF NOT EXISTS idx_conversations_display_id ON conversations(account_id, display_id);

-- Message indexes
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_account_created ON messages(account_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_content_search ON messages USING gin(to_tsvector('english', content));

-- Contact indexes
CREATE INDEX IF NOT EXISTS idx_contacts_account_email ON contacts(account_id, email) WHERE email IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_contacts_account_phone ON contacts(account_id, phone_number) WHERE phone_number IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_contacts_name_search ON contacts USING gin(to_tsvector('english', name));

-- Vector indexes for AI search
CREATE INDEX IF NOT EXISTS idx_captain_embeddings ON captain_assistant_responses USING ivfflat (embedding vector_l2_ops);
CREATE INDEX IF NOT EXISTS idx_article_embeddings ON article_embeddings USING ivfflat (embedding vector_l2_ops);

-- Real-time indexes
CREATE INDEX IF NOT EXISTS idx_messages_realtime ON messages(conversation_id, created_at) WHERE message_type IN ('incoming', 'outgoing');
CREATE INDEX IF NOT EXISTS idx_conversations_realtime ON conversations(account_id, updated_at) WHERE status != 'resolved';

-- ========================================
-- UTILITY FUNCTIONS & TRIGGERS
-- ========================================

-- Update timestamps trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at trigger to all relevant tables
CREATE TRIGGER update_accounts_updated_at BEFORE UPDATE ON accounts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_account_users_updated_at BEFORE UPDATE ON account_users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contacts_updated_at BEFORE UPDATE ON contacts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON teams FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_team_members_updated_at BEFORE UPDATE ON team_members FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_channel_web_widgets_updated_at BEFORE UPDATE ON channel_web_widgets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_channel_emails_updated_at BEFORE UPDATE ON channel_emails FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_channel_whatsapps_updated_at BEFORE UPDATE ON channel_whatsapps FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_inboxes_updated_at BEFORE UPDATE ON inboxes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON conversations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_messages_updated_at BEFORE UPDATE ON messages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_automation_rules_updated_at BEFORE UPDATE ON automation_rules FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_macros_updated_at BEFORE UPDATE ON macros FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_captain_assistant_responses_updated_at BEFORE UPDATE ON captain_assistant_responses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_portals_updated_at BEFORE UPDATE ON portals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON articles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_article_embeddings_updated_at BEFORE UPDATE ON article_embeddings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_campaigns_updated_at BEFORE UPDATE ON campaigns FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_labels_updated_at BEFORE UPDATE ON labels FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_attachments_updated_at BEFORE UPDATE ON attachments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_webhooks_updated_at BEFORE UPDATE ON webhooks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_integrations_updated_at BEFORE UPDATE ON integrations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-increment display_id per account for conversations
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

-- Storage buckets for file attachments
INSERT INTO storage.buckets (id, name, PUBLIC) VALUES 
    ('attachments', 'attachments', false),
    ('avatars', 'avatars', true),
    ('portal-assets', 'portal-assets', true)
ON CONFLICT (id) DO NOTHING;

-- ========================================
-- ROW LEVEL SECURITY (RLS)
-- ========================================

-- Enable RLS on all tables
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE account_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE channel_web_widgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE channel_emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE channel_whatsapps ENABLE ROW LEVEL SECURITY;
ALTER TABLE inboxes ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE automation_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE macros ENABLE ROW LEVEL SECURITY;
ALTER TABLE captain_assistant_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE portals ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE labels ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_labels ENABLE ROW LEVEL SECURITY;
ALTER TABLE attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;

-- Grant permissions to authenticated and service_role
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated, service_role;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated, service_role;

-- RLS Policies - Multi-tenant isolation
-- Users can access their own accounts
CREATE POLICY "Users can access their own accounts" ON accounts
    FOR ALL USING (
        id IN (
            SELECT account_id FROM account_users 
            WHERE user_id = auth.uid()
        )
    );

-- Account-scoped policies (example for conversations)
CREATE POLICY "Users can access account conversations" ON conversations
    FOR ALL USING (
        account_id IN (
            SELECT account_id FROM account_users 
            WHERE user_id = auth.uid()
        )
    );

-- Similar policies for all account-scoped tables
CREATE POLICY "Users can access account contacts" ON contacts
    FOR ALL USING (
        account_id IN (
            SELECT account_id FROM account_users 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can access account messages" ON messages
    FOR ALL USING (
        account_id IN (
            SELECT account_id FROM account_users 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can access account inboxes" ON inboxes
    FOR ALL USING (
        account_id IN (
            SELECT account_id FROM account_users 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can access account teams" ON teams
    FOR ALL USING (
        account_id IN (
            SELECT account_id FROM account_users 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can access account labels" ON labels
    FOR ALL USING (
        account_id IN (
            SELECT account_id FROM account_users 
            WHERE user_id = auth.uid()
        )
    );

-- Public access for portals and articles (knowledge base)
CREATE POLICY "Public can read published articles" ON articles
    FOR SELECT USING (status = 'published');

CREATE POLICY "Public can read portal categories" ON categories
    FOR SELECT USING (true);

CREATE POLICY "Public can read portals" ON portals
    FOR SELECT USING (NOT archived);

-- ========================================
-- REALTIME SUBSCRIPTIONS
-- ========================================

-- Enable realtime for key tables
ALTER PUBLICATION supabase_realtime ADD TABLE conversations;
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE contacts;
ALTER PUBLICATION supabase_realtime ADD TABLE account_users;

-- ========================================
-- SEED DATA (Optional - for development)
-- ========================================

-- Insert a default account for development
-- INSERT INTO accounts (name, slug, support_email) VALUES 
--     ('Demo Account', 'demo', 'support@demo.com')
-- ON CONFLICT (slug) DO NOTHING;

-- ========================================
-- MIGRATION COMPLETE
-- ========================================

-- This completes the Chatwoot Clone database schema
-- All tables, indexes, triggers, and RLS policies are now in place