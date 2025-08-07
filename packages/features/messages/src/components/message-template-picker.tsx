'use client';

import { useState } from 'react';
import { Button } from '@kit/ui/button';
import { Input } from '@kit/ui/input';
import { Textarea } from '@kit/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@kit/ui/card';
import { Badge } from '@kit/ui/badge';
import { ScrollArea } from '@kit/ui/scroll-area';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@kit/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@kit/ui/select';
import { cn } from '@kit/ui/utils';
import { Template, Search, Plus, MessageSquare } from 'lucide-react';
import { 
  useMessageTemplates, 
  useTemplateVariables, 
  useTemplateSearch 
} from '../hooks/use-message-templates';
import type { MessageTemplate } from '../types';

interface MessageTemplatePickerProps {
  accountId: string;
  onTemplateSelect: (content: string) => void;
  className?: string;
}

export function MessageTemplatePicker({
  accountId,
  onTemplateSelect,
  className
}: MessageTemplatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { data: templates = [], isLoading } = useMessageTemplates(accountId);
  const { 
    searchTerm, 
    setSearchTerm, 
    selectedCategory, 
    setSelectedCategory,
    filterTemplates,
    getCategories 
  } = useTemplateSearch();

  const filteredTemplates = filterTemplates(templates);
  const categories = getCategories(templates);

  const handleTemplateSelect = (template: MessageTemplate) => {
    if (template.variables && template.variables.length > 0) {
      // Open variable input dialog
      setSelectedTemplate(template);
      setShowVariableDialog(true);
    } else {
      onTemplateSelect(template.content);
      setIsOpen(false);
    }
  };

  const [selectedTemplate, setSelectedTemplate] = useState<MessageTemplate | null>(null);
  const [showVariableDialog, setShowVariableDialog] = useState(false);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="sm" className={cn('', className)}>
            <Template className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Template className="h-5 w-5" />
              Message Templates
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Filters */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search templates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Templates List */}
            <ScrollArea className="h-96">
              {isLoading ? (
                <div className="space-y-2">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-20 bg-muted animate-pulse rounded-lg" />
                  ))}
                </div>
              ) : filteredTemplates.length > 0 ? (
                <div className="space-y-2">
                  {filteredTemplates.map((template) => (
                    <TemplateCard
                      key={template.id}
                      template={template}
                      onSelect={handleTemplateSelect}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No templates found</p>
                  {searchTerm && (
                    <p className="text-sm">Try different search terms</p>
                  )}
                </div>
              )}
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>

      {/* Variable Input Dialog */}
      {selectedTemplate && (
        <TemplateVariableDialog
          template={selectedTemplate}
          isOpen={showVariableDialog}
          onClose={() => {
            setShowVariableDialog(false);
            setSelectedTemplate(null);
          }}
          onConfirm={(processedContent) => {
            onTemplateSelect(processedContent);
            setIsOpen(false);
            setShowVariableDialog(false);
            setSelectedTemplate(null);
          }}
        />
      )}
    </>
  );
}

interface TemplateCardProps {
  template: MessageTemplate;
  onSelect: (template: MessageTemplate) => void;
}

function TemplateCard({ template, onSelect }: TemplateCardProps) {
  return (
    <Card className="cursor-pointer hover:bg-accent transition-colors">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">{template.title}</CardTitle>
          {template.category && (
            <Badge variant="outline" className="text-xs">
              {template.category}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
          {template.content}
        </p>
        {template.variables && template.variables.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {template.variables.map(variable => (
              <Badge key={variable} variant="secondary" className="text-xs">
                {variable}
              </Badge>
            ))}
          </div>
        )}
        <Button
          size="sm"
          variant="outline"
          onClick={() => onSelect(template)}
          className="w-full"
        >
          Use Template
        </Button>
      </CardContent>
    </Card>
  );
}

interface TemplateVariableDialogProps {
  template: MessageTemplate;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (processedContent: string) => void;
}

function TemplateVariableDialog({
  template,
  isOpen,
  onClose,
  onConfirm
}: TemplateVariableDialogProps) {
  const { variables, setVariable, processTemplate, clearVariables } = useTemplateVariables();

  const handleConfirm = () => {
    const processedContent = processTemplate(template.content, variables);
    onConfirm(processedContent);
    clearVariables();
  };

  const handleClose = () => {
    clearVariables();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Fill Template Variables</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-sm font-medium mb-2">{template.title}</p>
            <p className="text-sm text-muted-foreground">{template.content}</p>
          </div>

          {template.variables?.map(variable => (
            <div key={variable} className="space-y-2">
              <label className="text-sm font-medium">
                {variable.charAt(0).toUpperCase() + variable.slice(1)}
              </label>
              <Input
                value={variables[variable] || ''}
                onChange={(e) => setVariable(variable, e.target.value)}
                placeholder={`Enter ${variable}...`}
              />
            </div>
          ))}

          <div className="p-3 bg-muted rounded-lg">
            <p className="text-sm font-medium mb-2">Preview:</p>
            <p className="text-sm">{processTemplate(template.content, variables)}</p>
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button onClick={handleConfirm}>
              Use Template
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}