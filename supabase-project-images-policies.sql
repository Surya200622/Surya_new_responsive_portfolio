-- 1. Allow anyone to view/download the project images
CREATE POLICY "Project images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'project-images');

-- 2. Allow any authenticated user to upload project images
CREATE POLICY "Users can upload project images"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'project-images' 
    AND auth.role() = 'authenticated'
);

-- 3. Allow users to update their own project images
CREATE POLICY "Users can update their own project images"
ON storage.objects FOR UPDATE
USING (
    bucket_id = 'project-images' 
    AND auth.uid() = owner
)
WITH CHECK (
    bucket_id = 'project-images' 
    AND auth.role() = 'authenticated'
);

-- 4. Allow users to delete their own project images
CREATE POLICY "Users can delete their own project images"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'project-images' 
    AND auth.uid() = owner
);
