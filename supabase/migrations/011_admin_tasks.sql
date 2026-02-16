-- Admin Tasks table for personal task management (Kanban board)
-- Each admin manages their own tasks independently

CREATE TABLE IF NOT EXISTS admin_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'on_hold', 'done')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  due_date DATE,
  color_label TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admin_tasks_owner_id ON admin_tasks(owner_id);
CREATE INDEX IF NOT EXISTS idx_admin_tasks_owner_status ON admin_tasks(owner_id, status);

CREATE TRIGGER update_admin_tasks_updated_at
  BEFORE UPDATE ON admin_tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE admin_tasks ENABLE ROW LEVEL SECURITY;

-- Admins only, own tasks only
CREATE POLICY "Admins can view own tasks" ON admin_tasks FOR SELECT USING (is_admin() AND owner_id = auth.uid());
CREATE POLICY "Admins can create own tasks" ON admin_tasks FOR INSERT WITH CHECK (is_admin() AND owner_id = auth.uid());
CREATE POLICY "Admins can update own tasks" ON admin_tasks FOR UPDATE USING (is_admin() AND owner_id = auth.uid());
CREATE POLICY "Admins can delete own tasks" ON admin_tasks FOR DELETE USING (is_admin() AND owner_id = auth.uid());
