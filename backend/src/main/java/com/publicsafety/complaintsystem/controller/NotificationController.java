package com.publicsafety.complaintsystem.controller;

import com.publicsafety.complaintsystem.domain.Notification;
import com.publicsafety.complaintsystem.repository.NotificationRepository;
import com.publicsafety.complaintsystem.service.AuthContextService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {
    private final NotificationRepository notificationRepository;
    private final AuthContextService authContextService;

    public NotificationController(NotificationRepository notificationRepository, AuthContextService authContextService) {
        this.notificationRepository = notificationRepository;
        this.authContextService = authContextService;
    }

    @GetMapping
    public ResponseEntity<List<Notification>> myNotifications() {
        return ResponseEntity.ok(notificationRepository.findByRecipientIdOrderByCreatedAtDesc(authContextService.currentUser().getId()));
    }
}
