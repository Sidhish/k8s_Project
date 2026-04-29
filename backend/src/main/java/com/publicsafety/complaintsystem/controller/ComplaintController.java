package com.publicsafety.complaintsystem.controller;

import com.publicsafety.complaintsystem.domain.Complaint;
import com.publicsafety.complaintsystem.domain.Category;
import com.publicsafety.complaintsystem.domain.Priority;
import com.publicsafety.complaintsystem.domain.Status;
import com.publicsafety.complaintsystem.domain.User;
import com.publicsafety.complaintsystem.service.ComplaintService;
import com.publicsafety.complaintsystem.service.AuthContextService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/complaints")
public class ComplaintController {

    @Autowired
    private ComplaintService complaintService;

    @Autowired
    private AuthContextService authContextService;

    // Public endpoint for anonymous submissions
    @PostMapping("/public")
    public ResponseEntity<Complaint> submitAnonymousComplaint(@RequestBody Complaint complaint) {
        complaint.setAnonymous(true);
        complaint.setUser(null);
        return ResponseEntity.ok(complaintService.submitComplaint(complaint, "anonymous"));
    }

    // Authenticated endpoints
    @PostMapping
    public ResponseEntity<Complaint> submitComplaint(@RequestBody Complaint complaint) {
        User user = authContextService.currentUser();
        complaint.setUser(user);
        complaint.setAnonymous(false);
        return ResponseEntity.ok(complaintService.submitComplaint(complaint, user.getEmail()));
    }

    @GetMapping
    public ResponseEntity<List<Complaint>> getMyComplaints() {
        User user = authContextService.currentUser();
        return ResponseEntity.ok(complaintService.getComplaintsByUser(user.getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Complaint> getComplaint(@PathVariable Long id) {
        return complaintService.getComplaintById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/search")
    public ResponseEntity<List<Complaint>> search(
        @RequestParam(required = false) Status status,
        @RequestParam(required = false) Category category,
        @RequestParam(required = false) Priority priority,
        @RequestParam(required = false) String location,
        @RequestParam(required = false) String keyword
    ) {
        return ResponseEntity.ok(complaintService.searchComplaints(status, category, priority, location, keyword));
    }
}
