import { authService } from '../services/authService.js';
/**
 * Require valid JWT Bearer token
 */
export const requireAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            error: 'Unauthorized',
            message: 'Missing or invalid authorization token'
        });
    }
    const token = authHeader.split(' ')[1];
    const decoded = authService.verifyToken(token);
    if (!decoded) {
        return res.status(401).json({
            error: 'Unauthorized',
            message: 'Token is expired or invalid'
        });
    }
    req.user = decoded;
    next();
};
/**
 * Require specific granular permission (Server-Side RBAC Enforcement)
 */
export const requirePermission = (permission) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized', message: 'Authentication required' });
        }
        const hasAccess = authService.hasPermission(req.user.role, permission);
        if (!hasAccess) {
            return res.status(403).json({
                error: 'Forbidden',
                message: `Your role (${req.user.role}) does not have permission for '${permission}'`
            });
        }
        next();
    };
};
/**
 * Require Super Admin role
 */
export const requireSuperAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'SUPER_ADMIN') {
        return res.status(403).json({
            error: 'Forbidden',
            message: 'Action restricted to Super Admin only'
        });
    }
    next();
};
