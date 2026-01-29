import { useState, useRef, useCallback } from "react";
import { CloudUpload, X, FileImage } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  value?: string;
  onChange: (url: string) => void;
  accept?: string;
  maxSize?: number; // in MB
  label?: string;
  description?: string;
  disabled?: boolean;
}

export function FileUpload({
  value,
  onChange,
  accept = "image/jpeg,image/png,image/jpg,image/webp",
  maxSize = 50,
  label = "Choose a file or drag & drop it here",
  description = "JPEG, PNG, and WEBP formats, up to 50MB",
  disabled = false,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragging(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const processFile = async (file: File) => {
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      alert(`File size must be less than ${maxSize}MB`);
      return;
    }

    setIsUploading(true);

    try {
      // Create a local URL for the file
      const fileUrl = URL.createObjectURL(file);

      // In a real application, you would upload the file to a server here
      // For now, we'll just use the blob URL
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 500));

      onChange(fileUrl);
    } catch (error) {
      console.error("Error processing file:", error);
      alert("Error uploading file. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (disabled) return;

      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        processFile(files[0]);
      }
    },
    [disabled, maxSize, onChange]
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = () => {
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-4">
      {!value ? (
        <div
          className={cn(
            "relative border-2 border-dashed rounded-lg p-8 transition-colors",
            isDragging
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-muted-foreground/50",
            disabled && "opacity-50 cursor-not-allowed"
          )}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileSelect}
            className="hidden"
            disabled={disabled}
          />

          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <div className="p-3 rounded-full bg-muted/50">
              <CloudUpload className="h-8 w-8 text-muted-foreground" />
            </div>

            <div className="space-y-2">
              <p className="text-base font-medium text-foreground">
                {isUploading ? "Uploading..." : label}
              </p>
              <p className="text-sm text-muted-foreground">
                {description}
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={handleBrowseClick}
              disabled={disabled || isUploading}
              className="mt-2"
            >
              Browse File
            </Button>
          </div>
        </div>
      ) : (
        <div className="relative border rounded-lg p-4 bg-muted/30">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0">
              <div className="w-20 h-20 rounded-lg overflow-hidden border bg-background">
                <img
                  src={value}
                  alt="Uploaded file"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <FileImage className="h-4 w-4 text-muted-foreground shrink-0" />
                <p className="text-sm font-medium truncate">
                  {value.split('/').pop() || 'Uploaded image'}
                </p>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Image uploaded successfully
              </p>
            </div>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleRemove}
              className="shrink-0 h-8 w-8 p-0 text-destructive hover:text-destructive"
              disabled={disabled}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
