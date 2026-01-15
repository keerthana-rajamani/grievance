package com.grievance.portal.dto;

import com.grievance.portal.entity.Complaint;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ComplaintRequest {
    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "Category is required")
    private Complaint.Category category;

    private Complaint.Priority priority = Complaint.Priority.MEDIUM;
}
