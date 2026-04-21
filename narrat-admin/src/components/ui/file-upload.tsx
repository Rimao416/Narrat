"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { uploadFile } from "@/services/api";
import { extractErrorMessage } from "@/services/api";
import { toast } from "sonner";
import { UploadCloud, X, Loader2, File as FileIcon, Image as ImageIcon } from "lucide-react";

interface FileUploadProps {
  value?: string;
  onChange: (url: string) => void;
  accept?: string;
  label?: string;
  folder?: string;
}

export function FileUpload({ value, onChange, accept = "image/*", label, folder = "uploads" }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const isImage = value && (value.match(/\.(jpeg|jpg|gif|png|webp)$/i) || accept.includes("image"));

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const url = await uploadFile(file, folder);
      onChange(url);
      toast.success("Fichier importé avec succès");
    } catch (error) {
      toast.error(extractErrorMessage(error));
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => setIsDragging(false);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleUpload(file);
  };

  const onChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
  };

  if (value) {
    return (
      <div className="space-y-2">
        {label && <label className="block text-xs font-medium">{label}</label>}
        <div className="relative rounded-lg border border-border overflow-hidden group bg-muted/20">
          {isImage ? (
            <div className="aspect-video relative">
              <img src={value} alt="Preview" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button variant="destructive" size="sm" onClick={() => onChange("")} className="h-8 gap-1">
                  <X className="w-3.5 h-3.5" /> Supprimer
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between p-3">
              <div className="flex items-center gap-2 truncate">
                <div className="p-2 rounded bg-primary/10 text-primary">
                  <FileIcon className="w-4 h-4" />
                </div>
                <span className="text-sm truncate max-w-[200px]" title={value}>
                  {value.split('/').pop() || value}
                </span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => onChange("")} className="text-destructive hover:text-destructive shrink-0">
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {label && <label className="block text-xs font-medium">{label}</label>}
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => !isUploading && inputRef.current?.click()}
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer
          ${isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 bg-muted/20 hover:bg-muted/40"}
          ${isUploading ? "opacity-70 pointer-events-none" : ""}
        `}
      >
        <input
          type="file"
          ref={inputRef}
          onChange={onChangeFile}
          accept={accept}
          className="hidden"
        />
        
        {isUploading ? (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
            <p className="text-sm font-medium">Upload en cours...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            {accept.includes("image") ? (
              <ImageIcon className="w-6 h-6 mb-1 opacity-50" />
            ) : (
              <UploadCloud className="w-6 h-6 mb-1 opacity-50" />
            )}
            <p className="text-sm font-medium">Cliquez ou glissez un fichier ici</p>
            <p className="text-xs opacity-70">
              {accept.includes("image") ? "Images (JPG, PNG, WEBP)" : "Fichiers audio ou vidéo"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
