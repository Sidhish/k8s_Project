package com.publicsafety.complaintsystem.repository;

import com.publicsafety.complaintsystem.domain.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    List<Feedback> findByComplaintId(Long complaintId);

    @Query("SELECT COALESCE(AVG(f.rating),0) FROM Feedback f WHERE f.complaint.assignedOfficer.id = :officerId")
    Double getAverageRatingForOfficer(@Param("officerId") Long officerId);
}
