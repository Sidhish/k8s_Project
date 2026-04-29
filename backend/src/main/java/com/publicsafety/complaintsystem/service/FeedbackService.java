package com.publicsafety.complaintsystem.service;

import com.publicsafety.complaintsystem.controller.dto.FeedbackRequest;
import com.publicsafety.complaintsystem.domain.Complaint;
import com.publicsafety.complaintsystem.domain.Feedback;
import com.publicsafety.complaintsystem.domain.User;
import com.publicsafety.complaintsystem.repository.ComplaintRepository;
import com.publicsafety.complaintsystem.repository.FeedbackRepository;
import org.springframework.stereotype.Service;

@Service
public class FeedbackService {
    private final FeedbackRepository feedbackRepository;
    private final ComplaintRepository complaintRepository;
    private final AuditService auditService;

    public FeedbackService(FeedbackRepository feedbackRepository, ComplaintRepository complaintRepository, AuditService auditService) {
        this.feedbackRepository = feedbackRepository;
        this.complaintRepository = complaintRepository;
        this.auditService = auditService;
    }

    public Feedback submit(FeedbackRequest request, User user) {
        if (request.getRating() == null || request.getRating() < 1 || request.getRating() > 5) {
            throw new IllegalArgumentException("Rating should be between 1 and 5");
        }
        Complaint complaint = complaintRepository.findById(request.getComplaintId()).orElseThrow(() -> new RuntimeException("Complaint not found"));
        Feedback feedback = new Feedback();
        feedback.setComplaint(complaint);
        feedback.setUser(user);
        feedback.setRating(request.getRating());
        feedback.setComment(request.getComment());
        Feedback saved = feedbackRepository.save(feedback);
        auditService.log("FEEDBACK_SUBMITTED", user.getEmail(), "COMPLAINT", complaint.getId().toString(), "Rating=" + request.getRating());
        return saved;
    }
}
