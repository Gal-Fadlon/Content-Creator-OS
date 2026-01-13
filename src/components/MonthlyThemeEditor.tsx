import { useState, useRef, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { Pencil, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export function MonthlyThemeEditor() {
  const { clients, selectedClientId, userRole, updateClientTheme } = useApp();
  const selectedClient = clients.find(c => c.id === selectedClientId);
  
  const [isEditing, setIsEditing] = useState(false);
  const [theme, setTheme] = useState(selectedClient?.monthlyTheme || '');
  const inputRef = useRef<HTMLInputElement>(null);
  
  const isAdmin = userRole === 'admin';
  
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);
  
  useEffect(() => {
    setTheme(selectedClient?.monthlyTheme || '');
  }, [selectedClient?.monthlyTheme]);
  
  const handleSave = () => {
    if (selectedClientId && theme.trim()) {
      updateClientTheme(selectedClientId, theme.trim());
    }
    setIsEditing(false);
  };
  
  const handleCancel = () => {
    setTheme(selectedClient?.monthlyTheme || '');
    setIsEditing(false);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };
  
  if (!selectedClient) return null;
  
  return (
    <div className="flex items-center justify-center gap-3 text-sm">
      <span className="text-gold font-medium">נושא חודשי</span>
      <span className="text-muted-foreground">|</span>
      
      {isEditing ? (
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            onKeyDown={handleKeyDown}
            className="bg-transparent border-b border-gold/50 focus:border-gold outline-none px-1 py-0.5 text-foreground min-w-[200px]"
            placeholder="הזן נושא חודשי..."
          />
          <button
            onClick={handleSave}
            className="p-1 hover:bg-gold/10 rounded-full text-gold transition-colors"
          >
            <Check className="h-4 w-4" />
          </button>
          <button
            onClick={handleCancel}
            className="p-1 hover:bg-destructive/10 rounded-full text-muted-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2 group">
          <span className="text-foreground/80">{selectedClient.monthlyTheme || 'לא הוגדר'}</span>
          {isAdmin && (
            <button
              onClick={() => setIsEditing(true)}
              className={cn(
                'p-1 rounded-full transition-all',
                'opacity-0 group-hover:opacity-100',
                'hover:bg-gold/10 text-gold/60 hover:text-gold'
              )}
              title="ערוך נושא חודשי"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}