-- Add missing DELETE policy for project_files table so clients can delete their uploaded files

CREATE POLICY "Clients can delete own project files" ON public.project_files 
  FOR DELETE USING (
    uploaded_by = auth.uid() OR
    EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND client_id = auth.uid())
  );
