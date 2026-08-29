import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { auditService } from './auditService.js';
// Granular RBAC Permissions Map
export const ROLE_PERMISSIONS = {
    SUPER_ADMIN: ['*'], // Full system access
    CONTENT_ADMIN: [
        'content:events',
        'content:training',
        'content:workshops',
        'content:challenges',
        'content:projects',
        'content:resources',
        'content:stories',
        'content:opportunities',
        'content:radar',
        'content:homepage'
    ],
    COMMUNITY_MANAGER: [
        'content:challenges',
        'content:projects',
        'content:stories',
        'content:opportunities'
    ],
    EDUCATION_MANAGER: [
        'content:training',
        'content:workshops',
        'content:resources'
    ],
    MEDIA_MANAGER: [
        'content:media'
    ],
    ENQUIRY_MANAGER: [
        'enquiry:read',
        'enquiry:update',
        'enquiry:export',
        'status:manage'
    ]
};
class AuthService {
    users = [];
    constructor() {
        this.seedDefaultUsers();
    }
    seedDefaultUsers() {
        const salt = bcrypt.genSaltSync(10);
        const defaultAdmins = [
            { email: 'superadmin@brandex.org', name: 'Brandex Super Admin', role: 'SUPER_ADMIN', pass: 'Admin#Brandex2026' },
            { email: 'content@brandex.org', name: 'Content Lead', role: 'CONTENT_ADMIN', pass: 'Content#Brandex2026' },
            { email: 'community@brandex.org', name: 'Community Manager', role: 'COMMUNITY_MANAGER', pass: 'Community#Brandex2026' },
            { email: 'education@brandex.org', name: 'Education Director', role: 'EDUCATION_MANAGER', pass: 'Education#Brandex2026' },
            { email: 'media@brandex.org', name: 'Media Lead', role: 'MEDIA_MANAGER', pass: 'Media#Brandex2026' },
            { email: 'enquiries@brandex.org', name: 'Operations Officer', role: 'ENQUIRY_MANAGER', pass: 'Enquiries#Brandex2026' },
        ];
        this.users = defaultAdmins.map((adm, idx) => ({
            id: `usr-${idx + 1}`,
            email: adm.email,
            name: adm.name,
            role: adm.role,
            passwordHash: bcrypt.hashSync(adm.pass, salt),
            active: true,
            createdAt: new Date().toISOString()
        }));
    }
    async authenticate(email, pass, ipAddress) {
        const user = this.users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.active);
        if (!user)
            return null;
        const matches = await bcrypt.compare(pass, user.passwordHash);
        if (!matches)
            return null;
        user.lastLogin = new Date().toISOString();
        const payload = {
            sub: user.id,
            email: user.email,
            name: user.name,
            role: user.role
        };
        const token = jwt.sign(payload, config.jwtSecret, {
            expiresIn: config.jwtExpiresIn
        });
        auditService.log({
            actorEmail: user.email,
            actorRole: user.role,
            action: 'ADMIN_LOGIN',
            entity: 'auth',
            entityId: user.id,
            summary: `Successful admin login from ${ipAddress || 'unknown'}`,
            ipAddress
        });
        const { passwordHash, ...safeUser } = user;
        return { token, user: safeUser };
    }
    verifyToken(token) {
        try {
            const decoded = jwt.verify(token, config.jwtSecret);
            return decoded;
        }
        catch {
            return null;
        }
    }
    hasPermission(role, requiredPermission) {
        const permissions = ROLE_PERMISSIONS[role] || [];
        if (permissions.includes('*'))
            return true;
        return permissions.includes(requiredPermission);
    }
    getUsers() {
        return this.users.map(({ passwordHash, ...safe }) => safe);
    }
    getUserById(id) {
        return this.users.find(u => u.id === id);
    }
}
export const authService = new AuthService();
