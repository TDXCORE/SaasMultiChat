import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSupabaseClient } from '@kit/supabase/client';
import { useState, useCallback } from 'react';
import type { MessageTemplate, QuickReply } from '../types';

export function useMessageTemplates(accountId: string) {
  const supabase = useSupabaseClient();
  
  return useQuery({
    queryKey: ['message-templates', accountId],
    queryFn: async (): Promise<MessageTemplate[]> => {
      // For now, return mock data since templates table isn't in our schema yet
      // In a real implementation, this would query the message_templates table
      return [
        {
          id: '1',
          title: 'Welcome Message',
          content: 'Hello {{name}}! Thank you for contacting us. How can we help you today?',
          variables: ['name'],
          category: 'greeting'
        },
        {
          id: '2', 
          title: 'Follow Up',
          content: 'Hi {{name}}, I wanted to follow up on your inquiry about {{topic}}. Do you have any additional questions?',
          variables: ['name', 'topic'],
          category: 'follow-up'
        },
        {
          id: '3',
          title: 'Closing',
          content: 'Thank you for contacting us today! If you have any other questions, please don\'t hesitate to reach out.',
          variables: [],
          category: 'closing'
        }
      ];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useQuickReplies(accountId: string) {
  const supabase = useSupabaseClient();
  
  return useQuery({
    queryKey: ['quick-replies', accountId],
    queryFn: async (): Promise<QuickReply[]> => {
      // For now, return mock data since quick_replies table isn't in our schema yet
      return [
        {
          id: '1',
          title: 'Thank you',
          content: 'Thank you for your message!',
          shortcut: '/thanks'
        },
        {
          id: '2',
          title: 'Please hold',
          content: 'Please give me a moment to look into this for you.',
          shortcut: '/hold'
        },
        {
          id: '3',
          title: 'More info needed',
          content: 'Could you please provide more details about your issue?',
          shortcut: '/info'
        },
        {
          id: '4',
          title: 'Escalate',
          content: 'I\'m going to escalate this to a senior team member who can better assist you.',
          shortcut: '/escalate'
        }
      ];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useTemplateVariables() {
  const [variables, setVariables] = useState<Record<string, string>>({});

  const setVariable = useCallback((key: string, value: string) => {
    setVariables(prev => ({ ...prev, [key]: value }));
  }, []);

  const clearVariables = useCallback(() => {
    setVariables({});
  }, []);

  const processTemplate = useCallback((template: string, vars: Record<string, string> = variables): string => {
    let processedContent = template;
    
    Object.entries(vars).forEach(([key, value]) => {
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
      processedContent = processedContent.replace(regex, value);
    });
    
    return processedContent;
  }, [variables]);

  const extractVariables = useCallback((template: string): string[] => {
    const regex = /\{\{(\w+)\}\}/g;
    const matches = [];
    let match;
    
    while ((match = regex.exec(template)) !== null) {
      if (!matches.includes(match[1])) {
        matches.push(match[1]);
      }
    }
    
    return matches;
  }, []);

  return {
    variables,
    setVariable,
    clearVariables,
    processTemplate,
    extractVariables,
  };
}

export function useTemplateSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const filterTemplates = useCallback((
    templates: MessageTemplate[], 
    search: string = searchTerm,
    category: string = selectedCategory
  ): MessageTemplate[] => {
    return templates.filter(template => {
      const matchesSearch = !search || 
        template.title.toLowerCase().includes(search.toLowerCase()) ||
        template.content.toLowerCase().includes(search.toLowerCase());
      
      const matchesCategory = !category || template.category === category;
      
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  const getCategories = useCallback((templates: MessageTemplate[]): string[] => {
    const categories = templates
      .map(template => template.category)
      .filter((category): category is string => !!category);
    
    return Array.from(new Set(categories));
  }, []);

  return {
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    filterTemplates,
    getCategories,
  };
}