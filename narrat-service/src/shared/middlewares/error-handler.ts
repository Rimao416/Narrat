import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
  // Zod validation errors
  if (err instanceof ZodError) {
    return res.status(400).json({
      message: 'Données invalides',
      errors: err.flatten().fieldErrors,
    });
  }

  // Prisma known errors
  if (err.code === 'P2002') {
    return res.status(409).json({ message: 'Cette valeur existe déjà (doublon)' });
  }
  if (err.code === 'P2025') {
    return res.status(404).json({ message: 'Ressource introuvable' });
  }
  if (err.code === 'P2003') {
    return res.status(400).json({ message: 'Référence invalide (clé étrangère)' });
  }

  // Auth errors
  if (err.message === 'Identifiants invalides' || err.message === 'Cet email est déjà utilisé') {
    return res.status(400).json({ message: err.message });
  }

  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode).json({
    message: err.message ?? 'Erreur interne du serveur',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};
