import { Request, Response, NextFunction } from 'express';

type Role = 'USER' | 'MODERATOR' | 'EDITOR' | 'ADMIN' | 'SUPER_ADMIN';

const ROLE_HIERARCHY: Record<Role, number> = {
  USER: 0,
  MODERATOR: 1,
  EDITOR: 2,
  ADMIN: 3,
  SUPER_ADMIN: 4,
};

export const authorize = (...roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!user) {
      return res.status(401).json({ message: 'Non authentifié' });
    }
    if (user.isBanned) {
      return res.status(403).json({ message: 'Compte suspendu' });
    }

    const userLevel = ROLE_HIERARCHY[user.role as Role] ?? 0;
    const minRequired = Math.min(...roles.map((r) => ROLE_HIERARCHY[r] ?? 0));

    if (userLevel < minRequired) {
      return res.status(403).json({ message: 'Accès refusé — rôle insuffisant' });
    }
    next();
  };
};

export const requireAdmin = authorize('ADMIN', 'SUPER_ADMIN');
export const requireModerator = authorize('MODERATOR', 'ADMIN', 'SUPER_ADMIN');
export const requireEditor = authorize('EDITOR', 'ADMIN', 'SUPER_ADMIN');
export const requireSuperAdmin = authorize('SUPER_ADMIN');
