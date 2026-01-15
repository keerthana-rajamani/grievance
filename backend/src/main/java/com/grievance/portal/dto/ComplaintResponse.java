package com.grievance.portal.dto;

import com.grievance.portal.entity.Complaint;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class ComplaintResponse {
    private Long id;
    private String trackingId;
    private String title;
    private String description;
    private Complaint.Category category;
    private Complaint.Priority priority;
    private Complaint.Status status;
    private Long userId;
    private String userName;
    private Boolean isAnonymous;
    private Long assignedToId;
    private String assignedToName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime resolvedAt;
    private List<TimelineResponse> timeline;
}
