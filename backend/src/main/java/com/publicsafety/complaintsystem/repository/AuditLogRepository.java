package com.publicsafety.complaintsystem.repository;

import com.publicsafety.complaintsystem.domain.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {}
