"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { api } from "@/services/api";
import { extractErrorMessage } from "@/services/api";
import { toast } from "sonner";
import { CHALLENGE_CATEGORY_LABELS } from "@/lib/utils";

const schema = z.object({
  title: z.string().min(1, "Requis"),
  description: z.string().min(1, "Requis"),
  category: z.string().min(1, "Requis"),
  intensity: z.enum(["LIGHT", "MODERATE", "INTENSE"]),
  durationDays: z.coerce.number().int().min(1).max(365),
  language: z.enum(["FR", "EN", "LN", "SW"]),
  coverUrl: z.string().url("URL invalide").optional().or(z.literal("")),
  isFeatured: z.boolean(),
});

type FormData = z.infer<typeof schema>;

interface ChallengeFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CATEGORIES = Object.entries(CHALLENGE_CATEGORY_LABELS);

export function ChallengeForm({ open, onClose, onSuccess }: ChallengeFormProps) {
  const {
    register, handleSubmit, reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { intensity: "MODERATE", language: "FR", durationDays: 21, isFeatured: false },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await api.post("/admin/challenges", { ...data, coverUrl: data.coverUrl || undefined });
      toast.success("Défi créé");
      reset();
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(extractErrorMessage(err));
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Nouveau défi" size="lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <label className="block text-xs font-medium mb-1.5">Titre *</label>
            <Input {...register("title")} placeholder="Titre du défi" />
            {errors.title && <p className="text-xs text-destructive mt-1">{errors.title.message}</p>}
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
            <label className="block text-xs font-medium mb-1.5">Intensité</label>
            <Select {...register("intensity")} className="w-full">
              <option value="LIGHT">Léger</option>
              <option value="MODERATE">Modéré</option>
              <option value="INTENSE">Intense</option>
            </Select>
          </div>

          <div>
            <label className="block text-xs font-medium mb-1.5">Durée (jours)</label>
            <Input {...register("durationDays")} type="number" min={1} max={365} />
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
              placeholder="Description du défi..."
            />
            {errors.description && <p className="text-xs text-destructive mt-1">{errors.description.message}</p>}
          </div>

          <div className="col-span-2">
            <label className="block text-xs font-medium mb-1.5">URL de couverture</label>
            <Input {...register("coverUrl")} placeholder="https://..." />
          </div>

          <div className="col-span-2 flex items-center gap-2">
            <input type="checkbox" {...register("isFeatured")} id="featured-challenge" className="rounded" />
            <label htmlFor="featured-challenge" className="text-sm">Mettre en avant</label>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>Annuler</Button>
          <Button type="submit" size="sm" loading={isSubmitting}>Créer le défi</Button>
        </div>
      </form>
    </Modal>
  );
}
