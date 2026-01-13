import { useApp } from '@/context/AppContext';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { UserRole } from '@/types/content';

export function RoleToggle() {
  const { userRole, setUserRole } = useApp();
  
  const handleToggle = (checked: boolean) => {
    setUserRole(checked ? 'client' : 'admin');
  };
  
  return (
    <div className="flex items-center gap-3 bg-card px-4 py-2 rounded-lg border border-border">
      <Label 
        htmlFor="role-toggle" 
        className={`text-sm font-medium transition-colors ${userRole === 'admin' ? 'text-foreground' : 'text-muted-foreground'}`}
      >
        מנהל
      </Label>
      <Switch
        id="role-toggle"
        checked={userRole === 'client'}
        onCheckedChange={handleToggle}
      />
      <Label 
        htmlFor="role-toggle" 
        className={`text-sm font-medium transition-colors ${userRole === 'client' ? 'text-foreground' : 'text-muted-foreground'}`}
      >
        לקוח
      </Label>
    </div>
  );
}
