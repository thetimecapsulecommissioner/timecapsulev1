
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { type Position } from "@/types/position";

export const AvatarUpload = ({ 
  url, 
  onUpload 
}: { 
  url: string | null, 
  onUpload: (url: string) => void 
}) => {
  const [uploading, setUploading] = useState(false);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    e.preventDefault();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    const container = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - container.left) / container.width) * 100;
    const y = ((e.clientY - container.top) / container.height) * 100;

    setPosition({
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y))
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user');

      const filePath = `${user.id}/${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      if (urlData) {
        onUpload(filePath); // Pass the file path, not the URL
        toast.success('Avatar updated successfully');
      }
    } catch (error) {
      toast.error('Error uploading avatar');
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  // Get the public URL for display
  const displayUrl = url ? supabase.storage.from('avatars').getPublicUrl(url).data?.publicUrl : null;

  return (
    <div className="flex flex-col items-center gap-4">
      <div 
        className="relative h-20 w-20 cursor-move"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <Avatar className="h-20 w-20">
          <AvatarImage 
            src={displayUrl || undefined}
            alt="Avatar" 
            style={{
              objectPosition: `${position.x}% ${position.y}%`,
              objectFit: 'cover'
            }}
          />
          <AvatarFallback>
            <img 
              src="/lovable-uploads/63e27305-cd9e-415f-a09a-47b02355d6e0.png" 
              alt="Default Avatar" 
              className="h-full w-full object-cover"
            />
          </AvatarFallback>
        </Avatar>
      </div>
      <div>
        <Button
          variant="outline"
          className="relative"
          disabled={uploading}
        >
          {uploading ? 'Uploading...' : 'Upload Avatar'}
          <input
            type="file"
            className="absolute inset-0 w-full opacity-0 cursor-pointer"
            accept="image/*"
            onChange={uploadAvatar}
            disabled={uploading}
          />
        </Button>
      </div>
    </div>
  );
};
