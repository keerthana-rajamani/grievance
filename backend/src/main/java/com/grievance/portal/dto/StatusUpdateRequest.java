package com.grievance.portal.dto;

import com.grievance.portal.entity.Complaint;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class StatusUpdateRequest {
    @NotNull(message = "New status is required")
    private Complaint.Status newStatus;

    private String adminComments;
    
    private Long assignToId;
}
