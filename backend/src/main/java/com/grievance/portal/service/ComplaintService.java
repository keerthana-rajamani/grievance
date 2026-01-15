package com.grievance.portal.service;

import com.grievance.portal.dto.ComplaintRequest;
import com.grievance.portal.dto.ComplaintResponse;
import com.grievance.portal.dto.StatusUpdateRequest;
import com.grievance.portal.dto.TimelineResponse;
import com.grievance.portal.entity.Complaint;
import com.grievance.portal.entity.ComplaintTimeline;
import com.grievance.portal.entity.User;
import com.grievance.portal.repository.ComplaintRepository;
import com.grievance.portal.repository.ComplaintTimelineRepository;
import com.grievance.portal.repository.UserRepository;
import com.grievance.portal.security.UserDetailsServiceImpl.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ComplaintService {
    @Autowired
    ComplaintRepository complaintRepository;

    @Autowired
    ComplaintTimelineRepository timelineRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    StatusTransitionValidator statusValidator;

    @Transactional
    public ComplaintResponse createComplaint(ComplaintRequest request, boolean isAnonymous) {
        Complaint complaint = new Complaint();
        complaint.setTitle(request.getTitle());
        complaint.setDescription(request.getDescription());
        complaint.setCategory(request.getCategory());
        complaint.setPriority(request.getPriority());
        complaint.setStatus(Complaint.Status.NEW);
        complaint.setIsAnonymous(isAnonymous);

        if (!isAnonymous) {
            UserPrincipal userPrincipal = getCurrentUser();
            if (userPrincipal != null) {
                User user = userRepository.findById(userPrincipal.getId())
                        .orElseThrow(() -> new RuntimeException("User not found"));
                complaint.setUser(user);
            }
        }

        complaint = complaintRepository.save(complaint);

        ComplaintTimeline initialTimeline = new ComplaintTimeline();
        initialTimeline.setComplaint(complaint);
        initialTimeline.setOldStatus(null);
        initialTimeline.setNewStatus(Complaint.Status.NEW);
        initialTimeline.setAdminComments("Complaint created");
        timelineRepository.save(initialTimeline);

        return mapToResponse(complaint);
    }

    @Transactional(readOnly = true)
    public ComplaintResponse getComplaintByTrackingId(String trackingId) {
        Complaint complaint = complaintRepository.findByTrackingId(trackingId)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));
        // Force eager loading of relationships
        if (complaint.getUser() != null) {
            complaint.getUser().getId();
        }
        if (complaint.getAssignedTo() != null) {
            complaint.getAssignedTo().getId();
        }
        complaint.getTimeline().size();
        return mapToResponse(complaint);
    }

    @Transactional(readOnly = true)
    public ComplaintResponse getComplaintById(Long id) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));
        
        // Force eager loading of relationships
        if (complaint.getUser() != null) {
            complaint.getUser().getId();
        }
        if (complaint.getAssignedTo() != null) {
            complaint.getAssignedTo().getId();
        }
        complaint.getTimeline().size();
        
        UserPrincipal currentUser = getCurrentUser();
        if (currentUser != null) {
            User user = userRepository.findById(currentUser.getId())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            boolean isAdmin = user.getRoles().contains(User.Role.ADMIN);
            boolean isOwner = !complaint.getIsAnonymous() && 
                            complaint.getUser() != null && 
                            complaint.getUser().getId().equals(user.getId());
            
            if (!isAdmin && !isOwner) {
                throw new RuntimeException("Unauthorized access to complaint");
            }
        } else if (!complaint.getIsAnonymous()) {
            throw new RuntimeException("Unauthorized access to complaint");
        }
        
        return mapToResponse(complaint);
    }

    @Transactional(readOnly = true)
    public Page<ComplaintResponse> getAllComplaints(Pageable pageable, 
                                                     Complaint.Status status,
                                                     Complaint.Category category,
                                                     Complaint.Priority priority) {
        Page<Complaint> complaints;
        
        if (status != null && category != null) {
            complaints = complaintRepository.findByStatusAndCategory(status, category, pageable);
        } else if (status != null) {
            complaints = complaintRepository.findByStatus(status, pageable);
        } else if (category != null) {
            complaints = complaintRepository.findByCategory(category, pageable);
        } else if (priority != null) {
            complaints = complaintRepository.findByPriority(priority, pageable);
        } else {
            complaints = complaintRepository.findAll(pageable);
        }
        
        // Force eager loading of relationships for all complaints
        complaints.getContent().forEach(complaint -> {
            if (complaint.getUser() != null) {
                complaint.getUser().getId();
            }
            if (complaint.getAssignedTo() != null) {
                complaint.getAssignedTo().getId();
            }
            complaint.getTimeline().size();
        });
        
        return complaints.map(this::mapToResponse);
    }

    @Transactional(readOnly = true)
    public Page<ComplaintResponse> getUserComplaints(Long userId, Pageable pageable) {
        Page<Complaint> complaints = complaintRepository.findByUserId(userId, pageable);
        
        // Force eager loading of relationships for all complaints
        complaints.getContent().forEach(complaint -> {
            if (complaint.getUser() != null) {
                complaint.getUser().getId();
            }
            if (complaint.getAssignedTo() != null) {
                complaint.getAssignedTo().getId();
            }
            complaint.getTimeline().size();
        });
        
        return complaints.map(this::mapToResponse);
    }

    @Transactional
    public ComplaintResponse updateStatus(Long complaintId, StatusUpdateRequest request) {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));

        Complaint.Status currentStatus = complaint.getStatus();
        Complaint.Status newStatus = request.getNewStatus();

        if (!statusValidator.isValidTransition(currentStatus, newStatus)) {
            throw new RuntimeException(statusValidator.getErrorMessage(currentStatus, newStatus));
        }

        ComplaintTimeline timeline = new ComplaintTimeline();
        timeline.setComplaint(complaint);
        timeline.setOldStatus(currentStatus);
        timeline.setNewStatus(newStatus);
        timeline.setAdminComments(request.getAdminComments());

        UserPrincipal userPrincipal = getCurrentUser();
        if (userPrincipal != null) {
            User user = userRepository.findById(userPrincipal.getId())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            timeline.setUpdatedBy(user);
        }

        timelineRepository.save(timeline);

        complaint.setStatus(newStatus);
        if (newStatus == Complaint.Status.RESOLVED) {
            complaint.setResolvedAt(LocalDateTime.now());
        }

        if (request.getAssignToId() != null) {
            User assignedTo = userRepository.findById(request.getAssignToId())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            complaint.setAssignedTo(assignedTo);
        }

        complaint = complaintRepository.save(complaint);
        return mapToResponse(complaint);
    }

    private ComplaintResponse mapToResponse(Complaint complaint) {
        ComplaintResponse response = new ComplaintResponse();
        response.setId(complaint.getId());
        response.setTrackingId(complaint.getTrackingId());
        response.setTitle(complaint.getTitle());
        response.setDescription(complaint.getDescription());
        response.setCategory(complaint.getCategory());
        response.setPriority(complaint.getPriority());
        response.setStatus(complaint.getStatus());
        response.setIsAnonymous(complaint.getIsAnonymous());
        response.setCreatedAt(complaint.getCreatedAt());
        response.setUpdatedAt(complaint.getUpdatedAt());
        response.setResolvedAt(complaint.getResolvedAt());

        if (complaint.getUser() != null) {
            response.setUserId(complaint.getUser().getId());
            response.setUserName(complaint.getUser().getFirstName() + " " + complaint.getUser().getLastName());
        }

        if (complaint.getAssignedTo() != null) {
            response.setAssignedToId(complaint.getAssignedTo().getId());
            response.setAssignedToName(complaint.getAssignedTo().getFirstName() + " " + complaint.getAssignedTo().getLastName());
        }

        List<TimelineResponse> timeline = timelineRepository.findByComplaintIdOrderByCreatedAtAsc(complaint.getId())
                .stream()
                .map(this::mapToTimelineResponse)
                .collect(Collectors.toList());
        response.setTimeline(timeline);

        return response;
    }

    private TimelineResponse mapToTimelineResponse(ComplaintTimeline timeline) {
        TimelineResponse response = new TimelineResponse();
        response.setId(timeline.getId());
        response.setOldStatus(timeline.getOldStatus());
        response.setNewStatus(timeline.getNewStatus());
        response.setAdminComments(timeline.getAdminComments());
        response.setCreatedAt(timeline.getCreatedAt());

        if (timeline.getUpdatedBy() != null) {
            response.setUpdatedById(timeline.getUpdatedBy().getId());
            response.setUpdatedByName(timeline.getUpdatedBy().getFirstName() + " " + timeline.getUpdatedBy().getLastName());
        }

        return response;
    }

    private UserPrincipal getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserPrincipal) {
            return (UserPrincipal) authentication.getPrincipal();
        }
        return null;
    }
}
