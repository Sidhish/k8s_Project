package com.publicsafety.complaintsystem.controller;

import com.publicsafety.complaintsystem.domain.Complaint;
import com.publicsafety.complaintsystem.domain.Category;
import com.publicsafety.complaintsystem.domain.Priority;
import com.publicsafety.complaintsystem.domain.Status;
import com.publicsafety.complaintsystem.controller.dto.AssignComplaintRequest;
import com.publicsafety.complaintsystem.controller.dto.ComplaintUpdateRequest;
import com.publicsafety.complaintsystem.service.ComplaintService;
import com.publicsafety.complaintsystem.service.AuthContextService;
import com.publicsafety.complaintsystem.service.UserService;
import com.publicsafety.complaintsystem.domain.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private ComplaintService complaintService;

    @Autowired
    private AuthContextService authContextService;

    @Autowired
    private UserService userService;

    @GetMapping("/complaints")
    public ResponseEntity<List<Complaint>> getAllComplaints(
        @RequestParam(required = false) Status status,
        @RequestParam(required = false) Category category,
        @RequestParam(required = false) Priority priority,
        @RequestParam(required = false) String location,
        @RequestParam(required = false) String keyword
    ) {
        return ResponseEntity.ok(complaintService.searchComplaints(status, category, priority, location, keyword));
    }

    @PutMapping("/complaints/{id}/status")
    public ResponseEntity<Complaint> updateComplaintStatus(@PathVariable Long id, @RequestBody ComplaintUpdateRequest request) {
        return ResponseEntity.ok(complaintService.updateComplaintStatus(id, request.getStatus(), request.getRemarks(), authContextService.currentEmail()));
    }

    @PutMapping("/complaints/{id}/assign")
    public ResponseEntity<Complaint> assign(@PathVariable Long id, @RequestBody AssignComplaintRequest request) {
        return ResponseEntity.ok(complaintService.assignComplaint(id, request.getOfficerId(), request.getRemarks(), authContextService.currentEmail()));
    }

    @PutMapping("/complaints/{id}/priority")
    public ResponseEntity<Complaint> updatePriority(@PathVariable Long id, @RequestParam Priority priority) {
        return ResponseEntity.ok(complaintService.setPriority(id, priority, authContextService.currentEmail()));
    }

    @GetMapping("/officers")
    public ResponseEntity<List<User>> officers() {
        return ResponseEntity.ok(userService.officers());
    }
}
