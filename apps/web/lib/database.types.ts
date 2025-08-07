export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          operationName?: string;
          query?: string;
          variables?: Json;
          extensions?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      // ========================================
      // CORE TABLES
      // ========================================
      accounts: {
        Row: {
          id: string;
          name: string;
          domain: string | null;
          slug: string;
          support_email: string | null;
          feature_flags: Json;
          auto_resolve_duration: number;
          limits: Json;
          custom_attributes: Json;
          settings: Json;
          status: Database['public']['Enums']['account_status'];
          locale: string;
          timezone: string;
          picture_url: string | null;
          public_data: Json;
          created_at: string;
          updated_at: string;
          created_by: string | null;
          updated_by: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          domain?: string | null;
          slug: string;
          support_email?: string | null;
          feature_flags?: Json;
          auto_resolve_duration?: number;
          limits?: Json;
          custom_attributes?: Json;
          settings?: Json;
          status?: Database['public']['Enums']['account_status'];
          locale?: string;
          timezone?: string;
          picture_url?: string | null;
          public_data?: Json;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
          updated_by?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          domain?: string | null;
          slug?: string;
          support_email?: string | null;
          feature_flags?: Json;
          auto_resolve_duration?: number;
          limits?: Json;
          custom_attributes?: Json;
          settings?: Json;
          status?: Database['public']['Enums']['account_status'];
          locale?: string;
          timezone?: string;
          picture_url?: string | null;
          public_data?: Json;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
          updated_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'accounts_created_by_fkey';
            columns: ['created_by'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'accounts_updated_by_fkey';
            columns: ['updated_by'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
      };
      
      users: {
        Row: {
          id: string;
          name: string;
          email: string;
          display_name: string | null;
          avatar_url: string | null;
          availability: Database['public']['Enums']['user_availability'];
          ui_settings: Json;
          custom_attributes: Json;
          message_signature: string | null;
          pubsub_token: string;
          last_seen_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          display_name?: string | null;
          avatar_url?: string | null;
          availability?: Database['public']['Enums']['user_availability'];
          ui_settings?: Json;
          custom_attributes?: Json;
          message_signature?: string | null;
          pubsub_token?: string;
          last_seen_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          display_name?: string | null;
          avatar_url?: string | null;
          availability?: Database['public']['Enums']['user_availability'];
          ui_settings?: Json;
          custom_attributes?: Json;
          message_signature?: string | null;
          pubsub_token?: string;
          last_seen_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };

      account_users: {
        Row: {
          id: string;
          account_id: string;
          user_id: string;
          role: Database['public']['Enums']['account_user_role'];
          availability: Database['public']['Enums']['user_availability'];
          auto_offline: boolean;
          custom_role_id: string | null;
          inviter_id: string | null;
          active_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          account_id: string;
          user_id: string;
          role?: Database['public']['Enums']['account_user_role'];
          availability?: Database['public']['Enums']['user_availability'];
          auto_offline?: boolean;
          custom_role_id?: string | null;
          inviter_id?: string | null;
          active_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          account_id?: string;
          user_id?: string;
          role?: Database['public']['Enums']['account_user_role'];
          availability?: Database['public']['Enums']['user_availability'];
          auto_offline?: boolean;
          custom_role_id?: string | null;
          inviter_id?: string | null;
          active_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'account_users_account_id_fkey';
            columns: ['account_id'];
            isOneToOne: false;
            referencedRelation: 'accounts';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'account_users_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'account_users_inviter_id_fkey';
            columns: ['inviter_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
      };

      // ========================================
      // CONTACTS & CONVERSATIONS
      // ========================================
      contacts: {
        Row: {
          id: string;
          account_id: string;
          name: string;
          email: string | null;
          phone_number: string | null;
          identifier: string | null;
          contact_type: Database['public']['Enums']['contact_type'];
          location: string | null;
          country_code: string | null;
          blocked: boolean;
          additional_attributes: Json;
          custom_attributes: Json;
          last_activity_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          account_id: string;
          name?: string;
          email?: string | null;
          phone_number?: string | null;
          identifier?: string | null;
          contact_type?: Database['public']['Enums']['contact_type'];
          location?: string | null;
          country_code?: string | null;
          blocked?: boolean;
          additional_attributes?: Json;
          custom_attributes?: Json;
          last_activity_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          account_id?: string;
          name?: string;
          email?: string | null;
          phone_number?: string | null;
          identifier?: string | null;
          contact_type?: Database['public']['Enums']['contact_type'];
          location?: string | null;
          country_code?: string | null;
          blocked?: boolean;
          additional_attributes?: Json;
          custom_attributes?: Json;
          last_activity_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'contacts_account_id_fkey';
            columns: ['account_id'];
            isOneToOne: false;
            referencedRelation: 'accounts';
            referencedColumns: ['id'];
          }
        ];
      };

      conversations: {
        Row: {
          id: string;
          account_id: string;
          inbox_id: string;
          contact_id: string | null;
          assignee_id: string | null;
          team_id: string | null;
          display_id: number;
          status: Database['public']['Enums']['conversation_status'];
          priority: Database['public']['Enums']['conversation_priority'] | null;
          sla_policy_id: string | null;
          identifier: string | null;
          additional_attributes: Json;
          custom_attributes: Json;
          contact_last_seen_at: string | null;
          agent_last_seen_at: string | null;
          assignee_last_seen_at: string | null;
          first_reply_created_at: string | null;
          snoozed_until: string | null;
          waiting_since: string | null;
          last_activity_at: string;
          cached_label_list: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          account_id: string;
          inbox_id: string;
          contact_id?: string | null;
          assignee_id?: string | null;
          team_id?: string | null;
          display_id?: number;
          status?: Database['public']['Enums']['conversation_status'];
          priority?: Database['public']['Enums']['conversation_priority'] | null;
          sla_policy_id?: string | null;
          identifier?: string | null;
          additional_attributes?: Json;
          custom_attributes?: Json;
          contact_last_seen_at?: string | null;
          agent_last_seen_at?: string | null;
          assignee_last_seen_at?: string | null;
          first_reply_created_at?: string | null;
          snoozed_until?: string | null;
          waiting_since?: string | null;
          last_activity_at?: string;
          cached_label_list?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          account_id?: string;
          inbox_id?: string;
          contact_id?: string | null;
          assignee_id?: string | null;
          team_id?: string | null;
          display_id?: number;
          status?: Database['public']['Enums']['conversation_status'];
          priority?: Database['public']['Enums']['conversation_priority'] | null;
          sla_policy_id?: string | null;
          identifier?: string | null;
          additional_attributes?: Json;
          custom_attributes?: Json;
          contact_last_seen_at?: string | null;
          agent_last_seen_at?: string | null;
          assignee_last_seen_at?: string | null;
          first_reply_created_at?: string | null;
          snoozed_until?: string | null;
          waiting_since?: string | null;
          last_activity_at?: string;
          cached_label_list?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'conversations_account_id_fkey';
            columns: ['account_id'];
            isOneToOne: false;
            referencedRelation: 'accounts';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'conversations_inbox_id_fkey';
            columns: ['inbox_id'];
            isOneToOne: false;
            referencedRelation: 'inboxes';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'conversations_contact_id_fkey';
            columns: ['contact_id'];
            isOneToOne: false;
            referencedRelation: 'contacts';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'conversations_assignee_id_fkey';
            columns: ['assignee_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'conversations_team_id_fkey';
            columns: ['team_id'];
            isOneToOne: false;
            referencedRelation: 'teams';
            referencedColumns: ['id'];
          }
        ];
      };

      messages: {
        Row: {
          id: string;
          account_id: string;
          inbox_id: string;
          conversation_id: string;
          sender_type: string | null;
          sender_id: string | null;
          message_type: Database['public']['Enums']['message_type'];
          content_type: Database['public']['Enums']['content_type'];
          content: string | null;
          processed_message_content: string | null;
          private: boolean;
          status: Database['public']['Enums']['message_status'];
          source_id: string | null;
          content_attributes: Json;
          external_source_ids: Json;
          additional_attributes: Json;
          sentiment: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          account_id: string;
          inbox_id: string;
          conversation_id: string;
          sender_type?: string | null;
          sender_id?: string | null;
          message_type: Database['public']['Enums']['message_type'];
          content_type?: Database['public']['Enums']['content_type'];
          content?: string | null;
          processed_message_content?: string | null;
          private?: boolean;
          status?: Database['public']['Enums']['message_status'];
          source_id?: string | null;
          content_attributes?: Json;
          external_source_ids?: Json;
          additional_attributes?: Json;
          sentiment?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          account_id?: string;
          inbox_id?: string;
          conversation_id?: string;
          sender_type?: string | null;
          sender_id?: string | null;
          message_type?: Database['public']['Enums']['message_type'];
          content_type?: Database['public']['Enums']['content_type'];
          content?: string | null;
          processed_message_content?: string | null;
          private?: boolean;
          status?: Database['public']['Enums']['message_status'];
          source_id?: string | null;
          content_attributes?: Json;
          external_source_ids?: Json;
          additional_attributes?: Json;
          sentiment?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'messages_account_id_fkey';
            columns: ['account_id'];
            isOneToOne: false;
            referencedRelation: 'accounts';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'messages_inbox_id_fkey';
            columns: ['inbox_id'];
            isOneToOne: false;
            referencedRelation: 'inboxes';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'messages_conversation_id_fkey';
            columns: ['conversation_id'];
            isOneToOne: false;
            referencedRelation: 'conversations';
            referencedColumns: ['id'];
          }
        ];
      };

      // ========================================
      // TEAM MANAGEMENT
      // ========================================
      teams: {
        Row: {
          id: string;
          account_id: string;
          name: string;
          description: string | null;
          allow_auto_assign: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          account_id: string;
          name: string;
          description?: string | null;
          allow_auto_assign?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          account_id?: string;
          name?: string;
          description?: string | null;
          allow_auto_assign?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'teams_account_id_fkey';
            columns: ['account_id'];
            isOneToOne: false;
            referencedRelation: 'accounts';
            referencedColumns: ['id'];
          }
        ];
      };

      team_members: {
        Row: {
          id: string;
          team_id: string;
          user_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          team_id: string;
          user_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          team_id?: string;
          user_id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'team_members_team_id_fkey';
            columns: ['team_id'];
            isOneToOne: false;
            referencedRelation: 'teams';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'team_members_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
      };

      // ========================================
      // CHANNELS
      // ========================================
      channel_web_widgets: {
        Row: {
          id: string;
          account_id: string;
          website_name: string;
          website_url: string;
          welcome_title: string | null;
          welcome_tagline: string | null;
          widget_color: string;
          hmac_token: string;
          pre_chat_form_enabled: boolean;
          pre_chat_form_options: Json;
          continuity_via_email: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          account_id: string;
          website_name: string;
          website_url: string;
          welcome_title?: string | null;
          welcome_tagline?: string | null;
          widget_color?: string;
          hmac_token: string;
          pre_chat_form_enabled?: boolean;
          pre_chat_form_options?: Json;
          continuity_via_email?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          account_id?: string;
          website_name?: string;
          website_url?: string;
          welcome_title?: string | null;
          welcome_tagline?: string | null;
          widget_color?: string;
          hmac_token?: string;
          pre_chat_form_enabled?: boolean;
          pre_chat_form_options?: Json;
          continuity_via_email?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'channel_web_widgets_account_id_fkey';
            columns: ['account_id'];
            isOneToOne: false;
            referencedRelation: 'accounts';
            referencedColumns: ['id'];
          }
        ];
      };

      channel_emails: {
        Row: {
          id: string;
          account_id: string;
          email: string;
          forward_to_email: string | null;
          imap_enabled: boolean;
          imap_settings: Json;
          smtp_enabled: boolean;
          smtp_settings: Json;
          microsoft_tenant_id: string | null;
          provider_config: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          account_id: string;
          email: string;
          forward_to_email?: string | null;
          imap_enabled?: boolean;
          imap_settings?: Json;
          smtp_enabled?: boolean;
          smtp_settings?: Json;
          microsoft_tenant_id?: string | null;
          provider_config?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          account_id?: string;
          email?: string;
          forward_to_email?: string | null;
          imap_enabled?: boolean;
          imap_settings?: Json;
          smtp_enabled?: boolean;
          smtp_settings?: Json;
          microsoft_tenant_id?: string | null;
          provider_config?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'channel_emails_account_id_fkey';
            columns: ['account_id'];
            isOneToOne: false;
            referencedRelation: 'accounts';
            referencedColumns: ['id'];
          }
        ];
      };

      channel_whatsapps: {
        Row: {
          id: string;
          account_id: string;
          phone_number: string;
          provider: string;
          provider_config: Json;
          message_templates: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          account_id: string;
          phone_number: string;
          provider: string;
          provider_config: Json;
          message_templates?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          account_id?: string;
          phone_number?: string;
          provider?: string;
          provider_config?: Json;
          message_templates?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'channel_whatsapps_account_id_fkey';
            columns: ['account_id'];
            isOneToOne: false;
            referencedRelation: 'accounts';
            referencedColumns: ['id'];
          }
        ];
      };

      inboxes: {
        Row: {
          id: string;
          account_id: string;
          channel_id: string;
          channel_type: string;
          name: string;
          email_address: string | null;
          greeting_enabled: boolean;
          greeting_message: string | null;
          enable_auto_assignment: boolean;
          enable_email_collect: boolean;
          csat_survey_enabled: boolean;
          allow_messages_after_resolved: boolean;
          lock_to_single_conversation: boolean;
          working_hours_enabled: boolean;
          out_of_office_message: string | null;
          timezone: string;
          auto_assignment_config: Json;
          business_name: string | null;
          sender_name_type: Database['public']['Enums']['sender_name_type'];
          csat_config: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          account_id: string;
          channel_id: string;
          channel_type: string;
          name: string;
          email_address?: string | null;
          greeting_enabled?: boolean;
          greeting_message?: string | null;
          enable_auto_assignment?: boolean;
          enable_email_collect?: boolean;
          csat_survey_enabled?: boolean;
          allow_messages_after_resolved?: boolean;
          lock_to_single_conversation?: boolean;
          working_hours_enabled?: boolean;
          out_of_office_message?: string | null;
          timezone?: string;
          auto_assignment_config?: Json;
          business_name?: string | null;
          sender_name_type?: Database['public']['Enums']['sender_name_type'];
          csat_config?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          account_id?: string;
          channel_id?: string;
          channel_type?: string;
          name?: string;
          email_address?: string | null;
          greeting_enabled?: boolean;
          greeting_message?: string | null;
          enable_auto_assignment?: boolean;
          enable_email_collect?: boolean;
          csat_survey_enabled?: boolean;
          allow_messages_after_resolved?: boolean;
          lock_to_single_conversation?: boolean;
          working_hours_enabled?: boolean;
          out_of_office_message?: string | null;
          timezone?: string;
          auto_assignment_config?: Json;
          business_name?: string | null;
          sender_name_type?: Database['public']['Enums']['sender_name_type'];
          csat_config?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'inboxes_account_id_fkey';
            columns: ['account_id'];
            isOneToOne: false;
            referencedRelation: 'accounts';
            referencedColumns: ['id'];
          }
        ];
      };

      // ========================================
      // AUTOMATION & AI
      // ========================================
      automation_rules: {
        Row: {
          id: string;
          account_id: string;
          name: string;
          description: string | null;
          event_name: string;
          conditions: Json;
          actions: Json;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          account_id: string;
          name: string;
          description?: string | null;
          event_name: string;
          conditions: Json;
          actions: Json;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          account_id?: string;
          name?: string;
          description?: string | null;
          event_name?: string;
          conditions?: Json;
          actions?: Json;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'automation_rules_account_id_fkey';
            columns: ['account_id'];
            isOneToOne: false;
            referencedRelation: 'accounts';
            referencedColumns: ['id'];
          }
        ];
      };

      macros: {
        Row: {
          id: string;
          account_id: string;
          name: string;
          visibility: Database['public']['Enums']['macro_visibility'];
          created_by_id: string | null;
          updated_by_id: string | null;
          actions: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          account_id: string;
          name: string;
          visibility?: Database['public']['Enums']['macro_visibility'];
          created_by_id?: string | null;
          updated_by_id?: string | null;
          actions: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          account_id?: string;
          name?: string;
          visibility?: Database['public']['Enums']['macro_visibility'];
          created_by_id?: string | null;
          updated_by_id?: string | null;
          actions?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'macros_account_id_fkey';
            columns: ['account_id'];
            isOneToOne: false;
            referencedRelation: 'accounts';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'macros_created_by_id_fkey';
            columns: ['created_by_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'macros_updated_by_id_fkey';
            columns: ['updated_by_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
      };

      captain_assistant_responses: {
        Row: {
          id: string;
          question: string;
          answer: string;
          embedding: string | null; // vector type
          assistant_id: string;
          documentable_type: string | null;
          documentable_id: string | null;
          account_id: string;
          status: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          question: string;
          answer: string;
          embedding?: string | null;
          assistant_id: string;
          documentable_type?: string | null;
          documentable_id?: string | null;
          account_id: string;
          status?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          question?: string;
          answer?: string;
          embedding?: string | null;
          assistant_id?: string;
          documentable_type?: string | null;
          documentable_id?: string | null;
          account_id?: string;
          status?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'captain_assistant_responses_account_id_fkey';
            columns: ['account_id'];
            isOneToOne: false;
            referencedRelation: 'accounts';
            referencedColumns: ['id'];
          }
        ];
      };

      // ========================================
      // KNOWLEDGE BASE
      // ========================================
      portals: {
        Row: {
          id: string;
          account_id: string;
          name: string;
          slug: string;
          custom_domain: string | null;
          color: string | null;
          homepage_link: string | null;
          page_title: string | null;
          header_text: string | null;
          allowed_locales: string[];
          config: Json;
          archived: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          account_id: string;
          name: string;
          slug: string;
          custom_domain?: string | null;
          color?: string | null;
          homepage_link?: string | null;
          page_title?: string | null;
          header_text?: string | null;
          allowed_locales?: string[];
          config?: Json;
          archived?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          account_id?: string;
          name?: string;
          slug?: string;
          custom_domain?: string | null;
          color?: string | null;
          homepage_link?: string | null;
          page_title?: string | null;
          header_text?: string | null;
          allowed_locales?: string[];
          config?: Json;
          archived?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'portals_account_id_fkey';
            columns: ['account_id'];
            isOneToOne: false;
            referencedRelation: 'accounts';
            referencedColumns: ['id'];
          }
        ];
      };

      categories: {
        Row: {
          id: string;
          account_id: string;
          portal_id: string;
          name: string;
          slug: string;
          description: string | null;
          position: number;
          locale: string;
          parent_category_id: string | null;
          associated_category_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          account_id: string;
          portal_id: string;
          name: string;
          slug: string;
          description?: string | null;
          position?: number;
          locale?: string;
          parent_category_id?: string | null;
          associated_category_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          account_id?: string;
          portal_id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          position?: number;
          locale?: string;
          parent_category_id?: string | null;
          associated_category_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'categories_account_id_fkey';
            columns: ['account_id'];
            isOneToOne: false;
            referencedRelation: 'accounts';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'categories_portal_id_fkey';
            columns: ['portal_id'];
            isOneToOne: false;
            referencedRelation: 'portals';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'categories_parent_category_id_fkey';
            columns: ['parent_category_id'];
            isOneToOne: false;
            referencedRelation: 'categories';
            referencedColumns: ['id'];
          }
        ];
      };

      articles: {
        Row: {
          id: string;
          account_id: string;
          portal_id: string;
          category_id: string;
          title: string;
          slug: string;
          content: string | null;
          description: string | null;
          position: number;
          locale: string;
          author_id: string | null;
          associated_article_id: string | null;
          status: Database['public']['Enums']['article_status'];
          views: number;
          meta: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          account_id: string;
          portal_id: string;
          category_id: string;
          title: string;
          slug: string;
          content?: string | null;
          description?: string | null;
          position?: number;
          locale?: string;
          author_id?: string | null;
          associated_article_id?: string | null;
          status?: Database['public']['Enums']['article_status'];
          views?: number;
          meta?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          account_id?: string;
          portal_id?: string;
          category_id?: string;
          title?: string;
          slug?: string;
          content?: string | null;
          description?: string | null;
          position?: number;
          locale?: string;
          author_id?: string | null;
          associated_article_id?: string | null;
          status?: Database['public']['Enums']['article_status'];
          views?: number;
          meta?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'articles_account_id_fkey';
            columns: ['account_id'];
            isOneToOne: false;
            referencedRelation: 'accounts';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'articles_portal_id_fkey';
            columns: ['portal_id'];
            isOneToOne: false;
            referencedRelation: 'portals';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'articles_category_id_fkey';
            columns: ['category_id'];
            isOneToOne: false;
            referencedRelation: 'categories';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'articles_author_id_fkey';
            columns: ['author_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
      };

      article_embeddings: {
        Row: {
          id: string;
          article_id: string;
          term: string;
          embedding: string | null; // vector type
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          article_id: string;
          term: string;
          embedding?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          article_id?: string;
          term?: string;
          embedding?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'article_embeddings_article_id_fkey';
            columns: ['article_id'];
            isOneToOne: false;
            referencedRelation: 'articles';
            referencedColumns: ['id'];
          }
        ];
      };

      // ========================================
      // CAMPAIGNS & MARKETING
      // ========================================
      campaigns: {
        Row: {
          id: string;
          account_id: string;
          title: string;
          description: string | null;
          message: string;
          enabled: boolean;
          campaign_type: Database['public']['Enums']['campaign_type'];
          campaign_status: Database['public']['Enums']['campaign_status'];
          audience: Json;
          trigger_rules: Json;
          created_by_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          account_id: string;
          title: string;
          description?: string | null;
          message: string;
          enabled?: boolean;
          campaign_type?: Database['public']['Enums']['campaign_type'];
          campaign_status?: Database['public']['Enums']['campaign_status'];
          audience?: Json;
          trigger_rules?: Json;
          created_by_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          account_id?: string;
          title?: string;
          description?: string | null;
          message?: string;
          enabled?: boolean;
          campaign_type?: Database['public']['Enums']['campaign_type'];
          campaign_status?: Database['public']['Enums']['campaign_status'];
          audience?: Json;
          trigger_rules?: Json;
          created_by_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'campaigns_account_id_fkey';
            columns: ['account_id'];
            isOneToOne: false;
            referencedRelation: 'accounts';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'campaigns_created_by_id_fkey';
            columns: ['created_by_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
      };

      // ========================================
      // LABELS & TAGGING
      // ========================================
      labels: {
        Row: {
          id: string;
          account_id: string;
          title: string;
          description: string | null;
          color: string;
          show_on_sidebar: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          account_id: string;
          title: string;
          description?: string | null;
          color?: string;
          show_on_sidebar?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          account_id?: string;
          title?: string;
          description?: string | null;
          color?: string;
          show_on_sidebar?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'labels_account_id_fkey';
            columns: ['account_id'];
            isOneToOne: false;
            referencedRelation: 'accounts';
            referencedColumns: ['id'];
          }
        ];
      };

      conversation_labels: {
        Row: {
          id: string;
          conversation_id: string;
          label_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          conversation_id: string;
          label_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          conversation_id?: string;
          label_id?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'conversation_labels_conversation_id_fkey';
            columns: ['conversation_id'];
            isOneToOne: false;
            referencedRelation: 'conversations';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'conversation_labels_label_id_fkey';
            columns: ['label_id'];
            isOneToOne: false;
            referencedRelation: 'labels';
            referencedColumns: ['id'];
          }
        ];
      };

      // ========================================
      // FILE ATTACHMENTS
      // ========================================
      attachments: {
        Row: {
          id: string;
          account_id: string;
          file_type: Database['public']['Enums']['attachment_file_type'];
          external_url: string | null;
          coordinates_lat: number | null;
          coordinates_long: number | null;
          message_id: string;
          fallback_title: string | null;
          extension: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          account_id: string;
          file_type?: Database['public']['Enums']['attachment_file_type'];
          external_url?: string | null;
          coordinates_lat?: number | null;
          coordinates_long?: number | null;
          message_id: string;
          fallback_title?: string | null;
          extension?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          account_id?: string;
          file_type?: Database['public']['Enums']['attachment_file_type'];
          external_url?: string | null;
          coordinates_lat?: number | null;
          coordinates_long?: number | null;
          message_id?: string;
          fallback_title?: string | null;
          extension?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'attachments_account_id_fkey';
            columns: ['account_id'];
            isOneToOne: false;
            referencedRelation: 'accounts';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'attachments_message_id_fkey';
            columns: ['message_id'];
            isOneToOne: false;
            referencedRelation: 'messages';
            referencedColumns: ['id'];
          }
        ];
      };

      // ========================================
      // WEBHOOKS & INTEGRATIONS
      // ========================================
      webhooks: {
        Row: {
          id: string;
          account_id: string;
          inbox_id: string;
          url: string;
          webhook_type: Database['public']['Enums']['webhook_type'];
          subscriptions: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          account_id: string;
          inbox_id: string;
          url: string;
          webhook_type?: Database['public']['Enums']['webhook_type'];
          subscriptions?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          account_id?: string;
          inbox_id?: string;
          url?: string;
          webhook_type?: Database['public']['Enums']['webhook_type'];
          subscriptions?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'webhooks_account_id_fkey';
            columns: ['account_id'];
            isOneToOne: false;
            referencedRelation: 'accounts';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'webhooks_inbox_id_fkey';
            columns: ['inbox_id'];
            isOneToOne: false;
            referencedRelation: 'inboxes';
            referencedColumns: ['id'];
          }
        ];
      };

      integrations: {
        Row: {
          id: string;
          account_id: string;
          name: string;
          hook_type: string;
          status: Database['public']['Enums']['integration_status'];
          settings: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          account_id: string;
          name: string;
          hook_type: string;
          status?: Database['public']['Enums']['integration_status'];
          settings?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          account_id?: string;
          name?: string;
          hook_type?: string;
          status?: Database['public']['Enums']['integration_status'];
          settings?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'integrations_account_id_fkey';
            columns: ['account_id'];
            isOneToOne: false;
            referencedRelation: 'accounts';
            referencedColumns: ['id'];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      account_status: 'active' | 'suspended';
      user_availability: 'online' | 'offline' | 'busy';
      account_user_role: 'agent' | 'administrator';
      contact_type: 'visitor' | 'lead' | 'customer';
      conversation_status: 'open' | 'resolved' | 'pending' | 'snoozed';
      conversation_priority: 'low' | 'medium' | 'high' | 'urgent';
      message_type: 'incoming' | 'outgoing' | 'activity' | 'template';
      content_type:
        | 'text'
        | 'input_text'
        | 'input_textarea'
        | 'input_email'
        | 'input_select'
        | 'cards'
        | 'form'
        | 'article'
        | 'incoming_email'
        | 'input_csat';
      message_status: 'sent' | 'delivered' | 'read' | 'failed';
      sender_name_type: 'friendly' | 'professional';
      macro_visibility: 'personal' | 'global';
      article_status: 'published' | 'draft' | 'archived';
      campaign_type: 'ongoing' | 'one_off';
      campaign_status: 'active' | 'completed' | 'paused';
      attachment_file_type:
        | 'image'
        | 'audio'
        | 'video'
        | 'file'
        | 'location'
        | 'fallback'
        | 'share'
        | 'story_mention'
        | 'template';
      webhook_type: 'account' | 'inbox';
      integration_status: 'enabled' | 'disabled';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null;
          avif_autodetection: boolean | null;
          created_at: string | null;
          file_size_limit: number | null;
          id: string;
          name: string;
          owner: string | null;
          owner_id: string | null;
          public: boolean | null;
          updated_at: string | null;
        };
        Insert: {
          allowed_mime_types?: string[] | null;
          avif_autodetection?: boolean | null;
          created_at?: string | null;
          file_size_limit?: number | null;
          id: string;
          name: string;
          owner?: string | null;
          owner_id?: string | null;
          public?: boolean | null;
          updated_at?: string | null;
        };
        Update: {
          allowed_mime_types?: string[] | null;
          avif_autodetection?: boolean | null;
          created_at?: string | null;
          file_size_limit?: number | null;
          id?: string;
          name?: string;
          owner?: string | null;
          owner_id?: string | null;
          public?: boolean | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      migrations: {
        Row: {
          executed_at: string | null;
          hash: string;
          id: number;
          name: string;
        };
        Insert: {
          executed_at?: string | null;
          hash: string;
          id: number;
          name: string;
        };
        Update: {
          executed_at?: string | null;
          hash?: string;
          id?: number;
          name?: string;
        };
        Relationships: [];
      };
      objects: {
        Row: {
          bucket_id: string | null;
          created_at: string | null;
          id: string;
          last_accessed_at: string | null;
          metadata: Json | null;
          name: string | null;
          owner: string | null;
          owner_id: string | null;
          path_tokens: string[] | null;
          updated_at: string | null;
          user_metadata: Json | null;
          version: string | null;
        };
        Insert: {
          bucket_id?: string | null;
          created_at?: string | null;
          id?: string;
          last_accessed_at?: string | null;
          metadata?: Json | null;
          name?: string | null;
          owner?: string | null;
          owner_id?: string | null;
          path_tokens?: string[] | null;
          updated_at?: string | null;
          user_metadata?: Json | null;
          version?: string | null;
        };
        Update: {
          bucket_id?: string | null;
          created_at?: string | null;
          id?: string;
          last_accessed_at?: string | null;
          metadata?: Json | null;
          name?: string | null;
          owner?: string | null;
          owner_id?: string | null;
          path_tokens?: string[] | null;
          updated_at?: string | null;
          user_metadata?: Json | null;
          version?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'objects_bucketId_fkey';
            columns: ['bucket_id'];
            isOneToOne: false;
            referencedRelation: 'buckets';
            referencedColumns: ['id'];
          }
        ];
      };
      s3_multipart_uploads: {
        Row: {
          bucket_id: string;
          created_at: string;
          id: string;
          in_progress_size: number;
          key: string;
          owner_id: string | null;
          upload_signature: string;
          user_metadata: Json | null;
          version: string;
        };
        Insert: {
          bucket_id: string;
          created_at?: string;
          id: string;
          in_progress_size?: number;
          key: string;
          owner_id?: string | null;
          upload_signature: string;
          user_metadata?: Json | null;
          version: string;
        };
        Update: {
          bucket_id?: string;
          created_at?: string;
          id?: string;
          in_progress_size?: number;
          key?: string;
          owner_id?: string | null;
          upload_signature?: string;
          user_metadata?: Json | null;
          version?: string;
        };
        Relationships: [
          {
            foreignKeyName: 's3_multipart_uploads_bucket_id_fkey';
            columns: ['bucket_id'];
            isOneToOne: false;
            referencedRelation: 'buckets';
            referencedColumns: ['id'];
          }
        ];
      };
      s3_multipart_uploads_parts: {
        Row: {
          bucket_id: string;
          created_at: string;
          etag: string;
          id: string;
          key: string;
          owner_id: string | null;
          part_number: number;
          size: number;
          upload_id: string;
          version: string;
        };
        Insert: {
          bucket_id: string;
          created_at?: string;
          etag: string;
          id?: string;
          key: string;
          owner_id?: string | null;
          part_number: number;
          size?: number;
          upload_id: string;
          version: string;
        };
        Update: {
          bucket_id?: string;
          created_at?: string;
          etag?: string;
          id?: string;
          key?: string;
          owner_id?: string | null;
          part_number?: number;
          size?: number;
          upload_id?: string;
          version?: string;
        };
        Relationships: [
          {
            foreignKeyName: 's3_multipart_uploads_parts_bucket_id_fkey';
            columns: ['bucket_id'];
            isOneToOne: false;
            referencedRelation: 'buckets';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 's3_multipart_uploads_parts_upload_id_fkey';
            columns: ['upload_id'];
            isOneToOne: false;
            referencedRelation: 's3_multipart_uploads';
            referencedColumns: ['id'];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      can_insert_object: {
        Args: {
          bucketid: string;
          name: string;
          owner: string;
          metadata: Json;
        };
        Returns: undefined;
      };
      extension: {
        Args: {
          name: string;
        };
        Returns: string;
      };
      filename: {
        Args: {
          name: string;
        };
        Returns: string;
      };
      foldername: {
        Args: {
          name: string;
        };
        Returns: string[];
      };
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>;
        Returns: {
          size: number;
          bucket_id: string;
        }[];
      };
      list_multipart_uploads_with_delimiter: {
        Args: {
          bucket_id: string;
          prefix_param: string;
          delimiter_param: string;
          max_keys?: number;
          next_key_token?: string;
          next_upload_token?: string;
        };
        Returns: {
          key: string;
          id: string;
          created_at: string;
        }[];
      };
      list_objects_with_delimiter: {
        Args: {
          bucket_id: string;
          prefix_param: string;
          delimiter_param: string;
          max_keys?: number;
          start_after?: string;
          next_token?: string;
        };
        Returns: {
          name: string;
          id: string;
          metadata: Json;
          updated_at: string;
        }[];
      };
      operation: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
      search: {
        Args: {
          prefix: string;
          bucketname: string;
          limits?: number;
          levels?: number;
          offsets?: number;
          search?: string;
          sortcolumn?: string;
          sortorder?: string;
        };
        Returns: {
          name: string;
          id: string;
          updated_at: string;
          created_at: string;
          last_accessed_at: string;
          metadata: Json;
        }[];
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] &
      PublicSchema['Views'])
  ? (PublicSchema['Tables'] &
      PublicSchema['Views'])[PublicTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
  ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
  ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema['Enums']
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
  ? PublicSchema['Enums'][PublicEnumNameOrOptions]
  : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema['CompositeTypes']
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema['CompositeTypes']
  ? PublicSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
  : never;

// ========================================
// CHATWOOT SPECIFIC TYPES
// ========================================

export type Account = Tables<'accounts'>;
export type User = Tables<'users'>;
export type AccountUser = Tables<'account_users'>;
export type Contact = Tables<'contacts'>;
export type Conversation = Tables<'conversations'>;
export type Message = Tables<'messages'>;
export type Team = Tables<'teams'>;
export type TeamMember = Tables<'team_members'>;
export type Inbox = Tables<'inboxes'>;
export type ChannelWebWidget = Tables<'channel_web_widgets'>;
export type ChannelEmail = Tables<'channel_emails'>;
export type ChannelWhatsApp = Tables<'channel_whatsapps'>;
export type AutomationRule = Tables<'automation_rules'>;
export type Macro = Tables<'macros'>;
export type CaptainAssistantResponse = Tables<'captain_assistant_responses'>;
export type Portal = Tables<'portals'>;
export type Category = Tables<'categories'>;
export type Article = Tables<'articles'>;
export type ArticleEmbedding = Tables<'article_embeddings'>;
export type Campaign = Tables<'campaigns'>;
export type Label = Tables<'labels'>;
export type ConversationLabel = Tables<'conversation_labels'>;
export type Attachment = Tables<'attachments'>;
export type Webhook = Tables<'webhooks'>;
export type Integration = Tables<'integrations'>;

// Insert types for easy form handling
export type AccountInsert = TablesInsert<'accounts'>;
export type UserInsert = TablesInsert<'users'>;
export type ContactInsert = TablesInsert<'contacts'>;
export type ConversationInsert = TablesInsert<'conversations'>;
export type MessageInsert = TablesInsert<'messages'>;
export type InboxInsert = TablesInsert<'inboxes'>;

// Update types
export type AccountUpdate = TablesUpdate<'accounts'>;
export type UserUpdate = TablesUpdate<'users'>;
export type ConversationUpdate = TablesUpdate<'conversations'>;
export type MessageUpdate = TablesUpdate<'messages'>;

// Enum types for easy access
export type AccountStatus = Enums<'account_status'>;
export type UserAvailability = Enums<'user_availability'>;
export type AccountUserRole = Enums<'account_user_role'>;
export type ContactType = Enums<'contact_type'>;
export type ConversationStatus = Enums<'conversation_status'>;
export type ConversationPriority = Enums<'conversation_priority'>;
export type MessageType = Enums<'message_type'>;
export type ContentType = Enums<'content_type'>;
export type MessageStatus = Enums<'message_status'>;
export type ArticleStatus = Enums<'article_status'>;
export type CampaignType = Enums<'campaign_type'>;
export type CampaignStatus = Enums<'campaign_status'>;
export type AttachmentFileType = Enums<'attachment_file_type'>;

// Complex types for relations
export type ConversationWithRelations = Conversation & {
  contact?: Contact;
  assignee?: User;
  inbox?: Inbox;
  team?: Team;
  labels?: Label[];
  messages?: Message[];
};

export type MessageWithRelations = Message & {
  conversation?: Conversation;
  attachments?: Attachment[];
};

export type ArticleWithRelations = Article & {
  category?: Category;
  portal?: Portal;
  author?: User;
};