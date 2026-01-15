package com.grievance.portal.controller;

import com.grievance.portal.dto.ComplaintResponse;
import com.grievance.portal.dto.DashboardStats;
import com.grievance.portal.dto.StatusUpdateRequest;
import com.grievance.portal.entity.Complaint;
import com.grievance.portal.service.ComplaintService;
import com.grievance.portal.service.DashboardService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {
    @Autowired
    ComplaintService complaintService;

    @Autowired
    DashboardService dashboardService;

    @GetMapping("/complaints")
    public ResponseEntity<?> getAllComplaints(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) Complaint.Status status,
            @RequestParam(required = false) Complaint.Category category,
            @RequestParam(required = false) Complaint.Priority priority) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<ComplaintResponse> complaints = complaintService.getAllComplaints(pageable, status, category, priority);
            return ResponseEntity.ok(complaints);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/complaints/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @Valid @RequestBody StatusUpdateRequest request) {
        try {
            ComplaintResponse response = complaintService.updateStatus(id, request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/dashboard/stats")
    public ResponseEntity<?> getDashboardStats() {
        try {
            DashboardStats stats = dashboardService.getDashboardStats();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
