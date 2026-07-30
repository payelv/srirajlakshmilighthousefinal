import React, { useRef, useState } from 'react';
import { Upload, Loader2, Link as LinkIcon, X } from 'lucide-react';
import { Input } from './ui/input';
import { uploadApi } from '../api';
import { useToast } from '../hooks/use-toast';

/**
 * Combined video field:
 *  - text input for pasting a URL (still supported for external videos)
 *  - "Upload" button to pick a file from the user's device (any size, video/*)
 *
 * Props:
 *   value:    current video URL
 *   onChange: called with the new URL string
 *   placeholder: input placeholder
 *   className:   extra class for wrapper
 *   showPreview: bool (default false) — show small thumb
 */
export default function VideoUploadField({
  value,
  onChange,
  placeholder = 'Video URL — or click Upload',
  className = '',
  showPreview = false,
}) {
  const { toast } = useToast();
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const openPicker = () => fileRef.current?.click();

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('video/')) {
      toast({ title: 'Not a video file', description: file.type || 'Please pick a video.' });
      e.target.value = '';
      return;
    }
    setUploading(true);
    setProgress(0);
    try {
      const res = await uploadApi.upload(file, setProgress);
      onChange(res.url);
      toast({ title: 'Video uploaded', description: file.name });
    } catch (err) {
      toast({
        title: 'Upload failed',
        description: err?.response?.data?.detail || err.message,
      });
    } finally {
      setUploading(false);
      setProgress(0);
      e.target.value = '';
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-stretch gap-2">
        <div className="relative flex-1">
          <LinkIcon className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="pl-8 h-10 bg-background/60 text-sm"
          />
          {value ? (
            <button
              type="button"
              onClick={() => onChange('')}
              title="Clear"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full text-muted-foreground hover:text-red-400 hover:bg-red-500/10 flex items-center justify-center"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : null}
        </div>
        <button
          type="button"
          onClick={openPicker}
          disabled={uploading}
          className="inline-flex items-center gap-2 px-3 h-10 rounded-md border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-sm whitespace-nowrap disabled:opacity-60"
        >
          {uploading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> {progress}%
            </>
          ) : (
            <>
              <Upload className="w-4 h-4" /> Upload
            </>
          )}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="video/*"
          onChange={handleFile}
          className="hidden"
        />
      </div>

      {showPreview && value ? (
        <video
          src={value}
          controls
          muted
          className="w-full max-w-[220px] h-28 object-cover rounded-md border border-border bg-muted"
        />
      ) : null}
    </div>
  );
}
