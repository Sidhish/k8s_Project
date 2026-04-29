package com.publicsafety.complaintsystem.controller;

import com.publicsafety.complaintsystem.controller.dto.ComplaintUpdateRequest;
import com.publicsafety.complaintsystem.domain.Complaint;
import com.publicsafety.complaintsystem.domain.User;
import com.publicsafety.complaintsystem.repository.FeedbackRepository;
import com.publicsafety.complaintsystem.service.AuthContextService;
import com.publicsafety.complaintsystem.service.ComplaintService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/officer")
public class OfficerController {
    private final ComplaintService complaintService;
    private final AuthContextService authContextService;
    private final com.publicsafety.complaintsystem.service.FileStorageService fileStorageService;
    private final FeedbackRepository feedbackRepository;

    public OfficerController(
        ComplaintService complaintService,
        AuthContextService authContextService,
        com.publicsafety.complaintsystem.service.FileStorageService fileStorageService,
        FeedbackRepository feedbackRepository
    ) {
        this.complaintService = complaintService;
        this.authContextService = authContextService;
        this.fileStorageService = fileStorageService;
        this.feedbackRepository = feedbackRepository;
    }

    @GetMapping("/complaints")
    public ResponseEntity<List<Complaint>> assignedComplaints() {
        User user = authContextService.currentUser();
        return ResponseEntity.ok(complaintService.getAssignedComplaints(user.getId()));
    }

    @GetMapping("/complaints/available")
    public ResponseEntity<List<Complaint>> availableComplaints() {
        return ResponseEntity.ok(complaintService.getUnassignedComplaints());
    }

    @PutMapping("/complaints/{id}/claim")
    public ResponseEntity<Complaint> claimComplaint(@PathVariable Long id) {
        return ResponseEntity.ok(complaintService.claimComplaint(id, authContextService.currentEmail()));
    }

    @PutMapping("/complaints/{id}/status")
    public ResponseEntity<Complaint> updateStatus(@PathVariable Long id, @RequestBody ComplaintUpdateRequest request) {
        return ResponseEntity.ok(complaintService.updateComplaintStatus(id, request.getStatus(), request.getRemarks(), authContextService.currentEmail()));
    }

    @PostMapping("/complaints/{id}/proof")
    public ResponseEntity<Complaint> uploadResolution(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        String path = fileStorageService.store(file);
        return ResponseEntity.ok(complaintService.updateResolutionProof(id, path, authContextService.currentEmail()));
    }

    @GetMapping("/performance")
    public ResponseEntity<Map<String, Object>> performance() {
        User user = authContextService.currentUser();
        Map<String, Object> payload = new HashMap<>();
        payload.put("assignedCount", complaintService.countByOfficer(user.getId()));
        payload.put("resolvedCount", complaintService.countResolvedByOfficer(user.getId()));
        payload.put("avgRating", feedbackRepository.getAverageRatingForOfficer(user.getId()));
        return ResponseEntity.ok(payload);
    }
}
