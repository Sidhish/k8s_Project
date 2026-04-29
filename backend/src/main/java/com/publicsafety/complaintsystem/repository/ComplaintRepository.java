package com.publicsafety.complaintsystem.repository;

import com.publicsafety.complaintsystem.domain.Complaint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
    List<Complaint> findByUserIdOrderByTimestampDesc(Long userId);
    List<Complaint> findAllByOrderByTimestampDesc();
    List<Complaint> findByAssignedOfficerIdOrderByTimestampDesc(Long officerId);
    List<Complaint> findByAssignedOfficerIsNullOrderByTimestampDesc();

    @Query("""
        SELECT c FROM Complaint c
        WHERE (:status IS NULL OR c.status = :status)
          AND (:category IS NULL OR c.category = :category)
          AND (:priority IS NULL OR c.priority = :priority)
          AND (:location IS NULL OR LOWER(c.locationLabel) LIKE LOWER(CONCAT('%', :location, '%')))
          AND (:keyword IS NULL OR LOWER(c.title) LIKE LOWER(CONCAT('%', :keyword, '%'))
               OR LOWER(c.description) LIKE LOWER(CONCAT('%', :keyword, '%')))
        ORDER BY c.timestamp DESC
        """)
    List<Complaint> searchComplaints(
        @Param("status") com.publicsafety.complaintsystem.domain.Status status,
        @Param("category") com.publicsafety.complaintsystem.domain.Category category,
        @Param("priority") com.publicsafety.complaintsystem.domain.Priority priority,
        @Param("location") String location,
        @Param("keyword") String keyword
    );
}
