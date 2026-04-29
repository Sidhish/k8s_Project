package com.publicsafety.complaintsystem.service;

import com.publicsafety.complaintsystem.domain.Complaint;
import com.publicsafety.complaintsystem.domain.User;
import com.publicsafety.complaintsystem.domain.Priority;
import com.publicsafety.complaintsystem.domain.Status;
import com.publicsafety.complaintsystem.domain.Category;
import com.publicsafety.complaintsystem.repository.ComplaintRepository;
import com.publicsafety.complaintsystem.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class ComplaintService {

    @Autowired
    private ComplaintRepository complaintRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuditService auditService;

    @Transactional
    public Complaint submitComplaint(Complaint complaint, String actorEmail) {
        complaint.setUpdatedAt(java.time.LocalDateTime.now());
        Complaint savedComplaint = complaintRepository.save(complaint);
        notificationService.notifyAdmin("New Complaint [" + savedComplaint.getCategory() + "]: " + savedComplaint.getTitle());
        auditService.log("COMPLAINT_SUBMITTED", actorEmail, "COMPLAINT", savedComplaint.getId().toString(), savedComplaint.getTitle());
        return savedComplaint;
    }

    public List<Complaint> getComplaintsByUser(Long userId) {
        return complaintRepository.findByUserIdOrderByTimestampDesc(userId);
    }

    public List<Complaint> getAllComplaints() {
        return complaintRepository.findAllByOrderByTimestampDesc();
    }

    public List<Complaint> searchComplaints(Status status, Category category, Priority priority, String location, String keyword) {
        return complaintRepository.searchComplaints(status, category, priority, location, keyword);
    }

    public List<Complaint> getAssignedComplaints(Long officerId) {
        return complaintRepository.findByAssignedOfficerIdOrderByTimestampDesc(officerId);
    }

    public List<Complaint> getUnassignedComplaints() {
        return complaintRepository.findByAssignedOfficerIsNullOrderByTimestampDesc();
    }

    public Optional<Complaint> getComplaintById(Long id) {
        return complaintRepository.findById(id);
    }

    @Transactional
    public Complaint updateComplaintStatus(Long id, Status status, String remarks, String actorEmail) {
        Optional<Complaint> complaintOp = complaintRepository.findById(id);
        if (complaintOp.isPresent()) {
            Complaint complaint = complaintOp.get();
            complaint.setStatus(status);
            complaint.setRemarks(remarks);
            complaint.setUpdatedAt(java.time.LocalDateTime.now());
            Complaint saved = complaintRepository.save(complaint);
            if (saved.getUser() != null) {
                notificationService.notifyUser(saved.getUser(), "Complaint #" + saved.getId() + " updated to " + saved.getStatus());
            }
            auditService.log("COMPLAINT_STATUS_UPDATED", actorEmail, "COMPLAINT", saved.getId().toString(), status.name());
            return saved;
        }
        throw new RuntimeException("Complaint not found");
    }

    @Transactional
    public Complaint assignComplaint(Long complaintId, Long officerId, String remarks, String actorEmail) {
        Complaint complaint = complaintRepository.findById(complaintId).orElseThrow(() -> new RuntimeException("Complaint not found"));
        User officer = userRepository.findById(officerId).orElseThrow(() -> new RuntimeException("Officer not found"));
        complaint.setAssignedOfficer(officer);
        complaint.setStatus(Status.IN_PROGRESS);
        complaint.setRemarks(remarks);
        complaint.setUpdatedAt(java.time.LocalDateTime.now());
        Complaint saved = complaintRepository.save(complaint);
        notificationService.notifyUser(officer, "Complaint #" + saved.getId() + " assigned to you");
        auditService.log("COMPLAINT_ASSIGNED", actorEmail, "COMPLAINT", saved.getId().toString(), "Officer:" + officerId);
        return saved;
    }

    @Transactional
    public Complaint claimComplaint(Long complaintId, String actorEmail) {
        User officer = userRepository.findByEmail(actorEmail).orElseThrow(() -> new RuntimeException("Officer not found"));
        return assignComplaint(complaintId, officer.getId(), "Claimed by officer", actorEmail);
    }

    @Transactional
    public Complaint updateResolutionProof(Long complaintId, String proofPath, String actorEmail) {
        Complaint complaint = complaintRepository.findById(complaintId).orElseThrow(() -> new RuntimeException("Complaint not found"));
        complaint.setResolutionProofPath(proofPath);
        complaint.setUpdatedAt(java.time.LocalDateTime.now());
        Complaint saved = complaintRepository.save(complaint);
        auditService.log("RESOLUTION_PROOF_UPLOADED", actorEmail, "COMPLAINT", saved.getId().toString(), proofPath);
        return saved;
    }

    @Transactional
    public Complaint save(Complaint complaint) {
        complaint.setUpdatedAt(java.time.LocalDateTime.now());
        return complaintRepository.save(complaint);
    }

    public long countByOfficer(Long officerId) {
        return complaintRepository.findByAssignedOfficerIdOrderByTimestampDesc(officerId).size();
    }

    public long countResolvedByOfficer(Long officerId) {
        return complaintRepository.findByAssignedOfficerIdOrderByTimestampDesc(officerId)
            .stream().filter(c -> c.getStatus() == Status.RESOLVED || c.getStatus() == Status.CLOSED).count();
    }

    @Transactional
    public Complaint setPriority(Long id, Priority priority, String actorEmail) {
        Complaint complaint = complaintRepository.findById(id).orElseThrow(() -> new RuntimeException("Complaint not found"));
        complaint.setPriority(priority);
        complaint.setUpdatedAt(java.time.LocalDateTime.now());
        Complaint saved = complaintRepository.save(complaint);
        auditService.log("COMPLAINT_PRIORITY_UPDATED", actorEmail, "COMPLAINT", saved.getId().toString(), priority.name());
        return saved;
    }
}
