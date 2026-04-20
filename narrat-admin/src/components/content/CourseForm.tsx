"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { coursesService } from "@/services/content.service";
import { extractErrorMessage } from "@/services/api";
import { toast } from "sonner";

const schema = z.object({
  title: z.string().min(1, "Requis"),
  description: z.string().min(1, "Requis"),
  level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]),
  language: z.enum(["FR", "EN", "LN", "SW"]),
  passingScore: z.coerce.number().min(0).max(100),
  estimatedHours: z.coerce.number().positive().optional(),
  coverUrl: z.string().url("URL invalide").optional().or(z.literal("")),
  isFeatured: z.boolean(),
});

type FormData = z.infer<typeof schema>;

interface CourseFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CourseForm({ open, onClose, onSuccess }: CourseFormProps) {
  const {
    register, handleSubmit, reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { level: "BEGINNER", language: "FR", passingScore: 70, isFeatured: false },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await coursesService.create({
        ...data,
        coverUrl: data.coverUrl || undefined,
        estimatedHours: data.estimatedHours,
      });
      toast.success("Formation créée");
      reset();
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(extractErrorMessage(err));
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Nouvelle formation" size="lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <label className="block text-xs font-medium mb-1.5">Titre *</label>
            <Input {...register("title")} placeholder="Titre de la formation" />
            {errors.title && <p className="text-xs text-destructive mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium mb-1.5">Niveau *</label>
            <Select {...register("level")} className="w-full">
              <option value="BEGINNER">Débutant</option>
              <option value="INTERMEDIATE">Intermédiaire</option>
              <option value="ADVANCED">Avancé</option>
            </Select>
          </div>

          <div>
            <label className="block text-xs font-medium mb-1.5">Langue</label>
            <Select {...register("language")} className="w-full">
              {["FR", "EN", "LN", "SW"].map((l) => <option key={l} value={l}>{l}</option>)}
            </Select>
          </div>

          <div>
            <label className="block text-xs font-medium mb-1.5">Score minimum (%)</label>
            <Input {...register("passingScore")} type="number" min={0} max={100} />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1.5">Durée estimée (h)</label>
            <Input {...register("estimatedHours")} type="number" min={0} step={0.5} placeholder="Ex: 4.5" />
          </div>

          <div className="col-span-2">
            <label className="block text-xs font-medium mb-1.5">Description *</label>
            <textarea
              {...register("description")}
              rows={3}
              className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
              placeholder="Description de la formation..."
            />
            {errors.description && <p className="text-xs text-destructive mt-1">{errors.description.message}</p>}
          </div>

          <div className="col-span-2">
            <label className="block text-xs font-medium mb-1.5">URL de couverture</label>
            <Input {...register("coverUrl")} placeholder="https://..." />
          </div>

          <div className="col-span-2 flex items-center gap-2">
            <input type="checkbox" {...register("isFeatured")} id="featured-course" className="rounded" />
            <label htmlFor="featured-course" className="text-sm">Mettre en avant</label>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>Annuler</Button>
          <Button type="submit" size="sm" loading={isSubmitting}>Créer la formation</Button>
        </div>
      </form>
    </Modal>
  );
}
