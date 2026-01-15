package com.grievance.portal.service;

import com.grievance.portal.dto.DashboardStats;
import com.grievance.portal.entity.Complaint;
import com.grievance.portal.repository.ComplaintRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class DashboardService {
    @Autowired
    ComplaintRepository complaintRepository;

    public DashboardStats getDashboardStats() {
        DashboardStats stats = new DashboardStats();
        
        stats.setTotalComplaints(complaintRepository.count());
        stats.setNewComplaints(complaintRepository.countByStatus(Complaint.Status.NEW));
        stats.setUnderReviewComplaints(complaintRepository.countByStatus(Complaint.Status.UNDER_REVIEW));
        stats.setResolvedComplaints(complaintRepository.countByStatus(Complaint.Status.RESOLVED));
        stats.setEscalatedComplaints(complaintRepository.countByStatus(Complaint.Status.ESCALATED));

        Map<String, Long> byCategory = new HashMap<>();
        for (Complaint.Category category : Complaint.Category.values()) {
            byCategory.put(category.name(), complaintRepository.countByCategory(category));
        }
        stats.setComplaintsByCategory(byCategory);

        Map<String, Long> byPriority = new HashMap<>();
        for (Complaint.Priority priority : Complaint.Priority.values()) {
            Long count = complaintRepository.countByPriority(priority);
            byPriority.put(priority.name(), count != null ? count : 0L);
        }
        stats.setComplaintsByPriority(byPriority);

        return stats;
    }
}
