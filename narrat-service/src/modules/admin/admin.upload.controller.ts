import { Request, Response } from "express";
import { SupabaseService } from "../../shared/services/supabase.service";

export class AdminUploadController {
  static async upload(req: Request, res: Response) {
    if (!req.file) {
      return res.status(400).json({ error: "Aucun fichier n'a été fourni" });
    }

    // Sécuriser la taille du fichier (ex: max 100MB)
    if (req.file.size > 100 * 1024 * 1024) {
      return res.status(400).json({ error: "Le fichier est trop volumineux (max 100MB)" });
    }

    const folder = req.body.folder || "uploads";
    
    const supabaseService = SupabaseService.getInstance();
    const url = await supabaseService.uploadFile(req.file, folder);

    return res.json({ url });
  }
}
