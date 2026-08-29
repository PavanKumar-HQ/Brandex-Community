class AuditService {
    logs = [];
    log(entry) {
        const logItem = {
            id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            actorEmail: entry.actorEmail,
            actorRole: entry.actorRole,
            action: entry.action,
            entity: entry.entity,
            entityId: entry.entityId,
            timestamp: new Date().toISOString(),
            summary: entry.summary,
            ipAddress: entry.ipAddress
        };
        this.logs.unshift(logItem);
        // Keep in-memory trail capped
        if (this.logs.length > 1000) {
            this.logs = this.logs.slice(0, 1000);
        }
        return logItem;
    }
    getLogs(limit = 100, entity) {
        let list = this.logs;
        if (entity) {
            list = list.filter(l => l.entity === entity);
        }
        return list.slice(0, limit);
    }
    clear() {
        this.logs = [];
    }
}
export const auditService = new AuditService();
