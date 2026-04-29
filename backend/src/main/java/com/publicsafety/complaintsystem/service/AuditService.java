package com.publicsafety.complaintsystem.service;

import com.publicsafety.complaintsystem.domain.AuditLog;
import com.publicsafety.complaintsystem.repository.AuditLogRepository;
import org.springframework.stereotype.Service;

@Service
public class AuditService {
    private final AuditLogRepository auditLogRepository;

    public AuditService(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    public void log(String action, String actorEmail, String entityType, String entityId, String details) {
        auditLogRepository.save(new AuditLog(action, actorEmail, entityType, entityId, details));
    }
}
