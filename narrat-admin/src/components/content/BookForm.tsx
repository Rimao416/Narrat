"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { booksService } from "@/services/content.service";
import { extractErrorMessage } from "@/services/api";
import { toast } from "sonner";
import { CATEGORY_LABELS } from "@/lib/utils";

const schema = z.object({
  title: z.string().min(1, "Requis"),
  slug: z.string().min(1, "Requis"),
  description: z.string().min(1, "Requis"),
  authorId: z.string().min(1, "Requis"),
  category: z.string().min(1, "Requis"),
  language: z.enum(["FR", "EN", "LN", "SW"]),
  coverUrl: z.string().url("URL invalide").optional().or(z.literal("")),
  isFeatured: z.boolean(),
});

type FormData = z.infer<typeof schema>;

interface BookFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CATEGORIES = Object.entries(CATEGORY_LABELS);

export function BookForm({ open, onClose, onSuccess }: BookFormProps) {
  const {
    register, handleSubmit, reset, watch, setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { language: "FR", isFeatured: false },
  });

  const title = watch("title");

  const onSubmit = async (data: FormData) => {
    try {
      await booksService.create({
        ...data,
        category: data.category as import("@/types").BookCategory,
        coverUrl: data.coverUrl || undefined,
      });
      toast.success("Livre créé");
      reset();
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(extractErrorMessage(err));
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Nouveau livre" size="lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <label className="block text-xs font-medium mb-1.5">Titre *</label>
            <Input
              {...register("title")}
              placeholder="Titre du livre"
              onChange={(e) => {
                register("title").onChange(e);
                const slug = e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
                setValue("slug", slug);
              }}
            />
            {errors.title && <p className="text-xs text-destructive mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium mb-1.5">Slug *</label>
            <Input {...register("slug")} placeholder="slug-du-livre" />
            {errors.slug && <p className="text-xs text-destructive mt-1">{errors.slug.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium mb-1.5">ID Auteur *</label>
            <Input {...register("authorId")} placeholder="cuid de l'auteur" />
            {errors.authorId && <p className="text-xs text-destructive mt-1">{errors.authorId.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium mb-1.5">Catégorie *</label>
            <Select {...register("category")} className="w-full">
              <option value="">Choisir...</option>
              {CATEGORIES.map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </Select>
            {errors.category && <p className="text-xs text-destructive mt-1">{errors.category.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium mb-1.5">Langue</label>
            <Select {...register("language")} className="w-full">
              {["FR", "EN", "LN", "SW"].map((l) => <option key={l} value={l}>{l}</option>)}
            </Select>
          </div>

          <div className="col-span-2">
            <label className="block text-xs font-medium mb-1.5">Description *</label>
            <textarea
              {...register("description")}
              rows={3}
              className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
              placeholder="Description du livre..."
            />
            {errors.description && <p className="text-xs text-destructive mt-1">{errors.description.message}</p>}
          </div>

          <div className="col-span-2">
            <label className="block text-xs font-medium mb-1.5">URL de couverture</label>
            <Input {...register("coverUrl")} placeholder="https://..." />
            {errors.coverUrl && <p className="text-xs text-destructive mt-1">{errors.coverUrl.message}</p>}
          </div>

          <div className="col-span-2 flex items-center gap-2">
            <input type="checkbox" {...register("isFeatured")} id="featured" className="rounded" />
            <label htmlFor="featured" className="text-sm">Mettre en avant</label>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>Annuler</Button>
          <Button type="submit" size="sm" loading={isSubmitting}>Créer le livre</Button>
        </div>
      </form>
    </Modal>
  );
}
