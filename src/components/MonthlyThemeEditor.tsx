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
      inputRef.current.select();
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
      <span className="text-sand font-medium">נושא חודשי</span>
      <span className="text-muted-foreground">|</span>
      
      {isEditing ? (
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            onKeyDown={handleKeyDown}
            className={cn(
              'bg-transparent border-b-2 border-sand/50 focus:border-sand outline-none px-2 py-1',
              'handwritten text-xl text-luxury-purple min-w-[200px]'
            )}
            placeholder="הזן נושא חודשי..."
          />
          <button
            onClick={handleSave}
            className="p-1.5 hover:bg-sand/20 rounded-full text-status-published transition-colors"
          >
            <Check className="h-4 w-4" />
          </button>
          <button
            onClick={handleCancel}
            className="p-1.5 hover:bg-muted/50 rounded-full text-muted-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2 group">
          <span className="handwritten text-xl text-luxury-purple">
            {selectedClient.monthlyTheme || 'לא הוגדר'}
          </span>
          {isAdmin && (
            <button
              onClick={() => setIsEditing(true)}
              className={cn(
                'p-1 rounded-full transition-all',
                'opacity-0 group-hover:opacity-100',
                'hover:bg-sand/20 text-sand/60 hover:text-sand'
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