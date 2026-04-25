"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { Button } from "@/components/ui/button";
import { uploadFile } from "@/services/api";
import { extractErrorMessage } from "@/services/api";
import { toast } from "sonner";
import { useRef, useState } from "react";
import {
  Bold, Italic, Strikethrough, Heading1, Heading2, Heading3,
  List, ListOrdered, Quote, Undo, Redo, Image as ImageIcon, Loader2, Maximize, Minimize
} from "lucide-react";

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export function RichTextEditor({ content, onChange, placeholder = "Écrivez ici..." }: RichTextEditorProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        HTMLAttributes: {
          class: "rounded-lg max-w-full my-4 border border-border shadow-sm",
        },
      }),
      Placeholder.configure({
        placeholder,
        emptyEditorClass: "is-editor-empty",
      }),
    ],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm dark:prose-invert max-w-none focus:outline-none min-h-[200px] h-full px-4 py-3",
      },
    },
  });

  if (!editor) {
    return null;
  }

  const handleImageUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const url = await uploadFile(file, "courses/modules/images");
      editor.chain().focus().setImage({ src: url }).run();
      toast.success("Image insérée");
    } catch (error) {
      toast.error(extractErrorMessage(error));
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageUpload(file);
  };

  const ToolbarButton = ({
    onClick, disabled, isActive, icon: Icon, title
  }: {
    onClick: () => void; disabled?: boolean; isActive?: boolean; icon: any; title: string;
  }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-1.5 rounded-md flex items-center justify-center transition-colors
        ${isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"}
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
      `}
    >
      <Icon className="w-4 h-4" />
    </button>
  );

  return (
    <div className={`border border-input overflow-hidden bg-background flex flex-col ${isFullscreen ? "fixed inset-0 z-50 rounded-none" : "rounded-md"}`}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-1 border-b border-input bg-muted/20 shrink-0">
        <div className="flex items-center gap-0.5">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!editor.can().chain().focus().toggleBold().run()}
            isActive={editor.isActive("bold")}
            icon={Bold}
            title="Gras"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
            isActive={editor.isActive("italic")}
            icon={Italic}
            title="Italique"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            disabled={!editor.can().chain().focus().toggleStrike().run()}
            isActive={editor.isActive("strike")}
            icon={Strikethrough}
            title="Barré"
          />
        </div>

        <div className="w-px h-5 bg-border mx-1" />

        <div className="flex items-center gap-0.5">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            isActive={editor.isActive("heading", { level: 1 })}
            icon={Heading1}
            title="Titre 1"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            isActive={editor.isActive("heading", { level: 2 })}
            icon={Heading2}
            title="Titre 2"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            isActive={editor.isActive("heading", { level: 3 })}
            icon={Heading3}
            title="Titre 3"
          />
        </div>

        <div className="w-px h-5 bg-border mx-1" />

        <div className="flex items-center gap-0.5">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive("bulletList")}
            icon={List}
            title="Liste à puces"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive("orderedList")}
            icon={ListOrdered}
            title="Liste numérotée"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editor.isActive("blockquote")}
            icon={Quote}
            title="Citation"
          />
        </div>

        <div className="w-px h-5 bg-border mx-1" />

        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            title="Insérer une image"
            className="p-1.5 rounded-md flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors disabled:opacity-50"
          >
            {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
        </div>

        <div className="w-px h-5 bg-border mx-1 ml-auto" />

        <div className="flex items-center gap-0.5">
          <ToolbarButton
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().chain().focus().undo().run()}
            icon={Undo}
            title="Annuler"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().chain().focus().redo().run()}
            icon={Redo}
            title="Rétablir"
          />
        </div>

        <div className="w-px h-5 bg-border mx-1 ml-auto" />

        <div className="flex items-center gap-0.5">
          <ToolbarButton
            onClick={() => setIsFullscreen(!isFullscreen)}
            icon={isFullscreen ? Minimize : Maximize}
            title={isFullscreen ? "Quitter le plein écran" : "Plein écran"}
          />
        </div>
      </div>

      {/* Editor Content */}
      <div className={`overflow-y-auto ${isFullscreen ? "flex-1" : ""}`}>
        <EditorContent editor={editor} />
      </div>
      
      {/* Placeholder custom CSS using global tailwind class, but we add style here for simplicity if needed, or rely on tailwind. We use CSS below. */}
      <style jsx global>{`
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: hsl(var(--muted-foreground));
          pointer-events: none;
          height: 0;
        }
      `}</style>
    </div>
  );
}
