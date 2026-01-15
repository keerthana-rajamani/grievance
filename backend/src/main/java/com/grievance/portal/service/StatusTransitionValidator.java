package com.grievance.portal.service;

import com.grievance.portal.entity.Complaint;
import org.springframework.stereotype.Component;

@Component
public class StatusTransitionValidator {
    
    public boolean isValidTransition(Complaint.Status currentStatus, Complaint.Status newStatus) {
        if (currentStatus == newStatus) {
            return false;
        }
        
        switch (currentStatus) {
            case NEW:
                return newStatus == Complaint.Status.UNDER_REVIEW || 
                       newStatus == Complaint.Status.ESCALATED;
            
            case UNDER_REVIEW:
                return newStatus == Complaint.Status.RESOLVED || 
                       newStatus == Complaint.Status.ESCALATED;
            
            case RESOLVED:
            case ESCALATED:
                return false;
            
            default:
                return false;
        }
    }
    
    public String getErrorMessage(Complaint.Status currentStatus, Complaint.Status newStatus) {
        return String.format("Invalid status transition from %s to %s. Allowed transitions: %s", 
            currentStatus, 
            newStatus,
            getAllowedTransitions(currentStatus));
    }
    
    private String getAllowedTransitions(Complaint.Status currentStatus) {
        switch (currentStatus) {
            case NEW:
                return "UNDER_REVIEW, ESCALATED";
            case UNDER_REVIEW:
                return "RESOLVED, ESCALATED";
            case RESOLVED:
            case ESCALATED:
                return "None (final status)";
            default:
                return "Unknown";
        }
    }
}
