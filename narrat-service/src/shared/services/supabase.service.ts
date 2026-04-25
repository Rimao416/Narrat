import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";
import path from "path";

export class SupabaseService {
  private static instance: SupabaseService;
  private client: SupabaseClient;
  private readonly BUCKET_NAME = process.env.SUPABASE_BUCKET || "media";

  private constructor() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.warn("Supabase configuration is missing. Uploads will fail.");
    }

    this.client = createClient(supabaseUrl || "", supabaseKey || "", {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  public static getInstance(): SupabaseService {
    if (!SupabaseService.instance) {
      SupabaseService.instance = new SupabaseService();
    }
    return SupabaseService.instance;
  }

  public async uploadFile(file: Express.Multer.File, folder: string = "uploads"): Promise<string> {
    const ext = path.extname(file.originalname);
    const fileName = `${folder}/${uuidv4()}${ext}`;

    const { data, error } = await this.client.storage
      .from(this.BUCKET_NAME)
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      throw new Error(`Erreur lors de l'upload sur Supabase: ${error.message}`);
    }

    // Récupérer l'URL publique
    const { data: publicUrlData } = this.client.storage
      .from(this.BUCKET_NAME)
      .getPublicUrl(fileName);

    return publicUrlData.publicUrl;
  }
}
