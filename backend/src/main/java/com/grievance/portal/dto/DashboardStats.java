package com.grievance.portal.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStats {
    private Long totalComplaints;
    private Long newComplaints;
    private Long underReviewComplaints;
    private Long resolvedComplaints;
    private Long escalatedComplaints;
    private Map<String, Long> complaintsByCategory;
    private Map<String, Long> complaintsByPriority;
}
