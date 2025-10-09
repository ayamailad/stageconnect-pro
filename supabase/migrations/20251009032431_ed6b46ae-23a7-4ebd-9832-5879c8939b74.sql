-- Add theme_id column to tasks table
ALTER TABLE tasks ADD COLUMN theme_id uuid REFERENCES themes(id);

-- Create index for better query performance
CREATE INDEX idx_tasks_theme_id ON tasks(theme_id);