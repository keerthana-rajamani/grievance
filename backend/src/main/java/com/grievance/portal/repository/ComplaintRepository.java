package com.grievance.portal.repository;

import com.grievance.portal.entity.Complaint;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
    Optional<Complaint> findByTrackingId(String trackingId);
    
    Page<Complaint> findByStatus(Complaint.Status status, Pageable pageable);
    
    Page<Complaint> findByCategory(Complaint.Category category, Pageable pageable);
    
    Page<Complaint> findByPriority(Complaint.Priority priority, Pageable pageable);
    
    Page<Complaint> findByUserId(Long userId, Pageable pageable);
    
    Page<Complaint> findByAssignedToId(Long assignedToId, Pageable pageable);
    
    Page<Complaint> findByStatusAndCategory(Complaint.Status status, Complaint.Category category, Pageable pageable);
    
    @Query("SELECT COUNT(c) FROM Complaint c WHERE c.status = :status")
    Long countByStatus(@Param("status") Complaint.Status status);
    
    @Query("SELECT COUNT(c) FROM Complaint c WHERE c.category = :category")
    Long countByCategory(@Param("category") Complaint.Category category);
    
    @Query("SELECT COUNT(c) FROM Complaint c WHERE c.priority = :priority")
    Long countByPriority(@Param("priority") Complaint.Priority priority);
}
