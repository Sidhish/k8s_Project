package com.publicsafety.complaintsystem.controller;

import com.publicsafety.complaintsystem.controller.dto.FeedbackRequest;
import com.publicsafety.complaintsystem.domain.Feedback;
import com.publicsafety.complaintsystem.service.AuthContextService;
import com.publicsafety.complaintsystem.service.FeedbackService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/feedback")
public class FeedbackController {
    private final FeedbackService feedbackService;
    private final AuthContextService authContextService;

    public FeedbackController(FeedbackService feedbackService, AuthContextService authContextService) {
        this.feedbackService = feedbackService;
        this.authContextService = authContextService;
    }

    @PostMapping
    public ResponseEntity<Feedback> submit(@RequestBody FeedbackRequest request) {
        return ResponseEntity.ok(feedbackService.submit(request, authContextService.currentUser()));
    }
}
