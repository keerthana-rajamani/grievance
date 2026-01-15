package com.grievance.portal.dto;

import com.grievance.portal.entity.Complaint;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class TimelineResponse {
    private Long id;
    private Complaint.Status oldStatus;
    private Complaint.Status newStatus;
    private String adminComments;
    private Long updatedById;
    private String updatedByName;
    private LocalDateTime createdAt;
}
