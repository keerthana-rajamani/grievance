package com.grievance.portal.controller;

import com.grievance.portal.dto.ComplaintRequest;
import com.grievance.portal.dto.ComplaintResponse;
import com.grievance.portal.service.ComplaintService;
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
@RequestMapping("/api/complaints")
public class ComplaintController {
    @Autowired
    ComplaintService complaintService;

    @PostMapping("/submit")
    public ResponseEntity<?> createComplaint(@Valid @RequestBody ComplaintRequest request) {
        try {
            ComplaintResponse response = complaintService.createComplaint(request, true);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> createAuthenticatedComplaint(@Valid @RequestBody ComplaintRequest request) {
        try {
            ComplaintResponse response = complaintService.createComplaint(request, false);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/track/{trackingId}")
    public ResponseEntity<?> getComplaintByTrackingId(@PathVariable String trackingId) {
        try {
            ComplaintResponse response = complaintService.getComplaintByTrackingId(trackingId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getComplaintById(@PathVariable Long id) {
        try {
            ComplaintResponse response = complaintService.getComplaintById(id);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/my-complaints")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> getMyComplaints(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            // Get current user ID from security context
            org.springframework.security.core.Authentication auth = 
                org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
            Long userId = ((com.grievance.portal.security.UserDetailsServiceImpl.UserPrincipal) auth.getPrincipal()).getId();
            
            Pageable pageable = PageRequest.of(page, size);
            Page<ComplaintResponse> complaints = complaintService.getUserComplaints(userId, pageable);
            return ResponseEntity.ok(complaints);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
