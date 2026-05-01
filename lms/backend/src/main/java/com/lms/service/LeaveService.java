package com.lms.service;

import com.lms.dto.DashboardStats;
import com.lms.dto.LeaveApplyRequest;
import com.lms.dto.LeaveResponse;
import com.lms.dto.LeaveStatusUpdateRequest;
import com.lms.entity.LeaveRequest;
import com.lms.entity.LeaveStatus;
import com.lms.entity.User;
import com.lms.exception.BadRequestException;
import com.lms.exception.ResourceNotFoundException;
import com.lms.repository.LeaveRequestRepository;
import com.lms.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class LeaveService {

    @Autowired
    private LeaveRequestRepository leaveRequestRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailNotificationService emailNotificationService;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Current user not found"));
    }

    @Transactional
    public LeaveResponse applyLeave(LeaveApplyRequest request) {
        User employee = getCurrentUser();

        if (request.getEndDate().isBefore(request.getStartDate())) {
            throw new BadRequestException("End date cannot be before start date");
        }
        if (request.getStartDate().isBefore(LocalDate.now())) {
            throw new BadRequestException("Start date cannot be in the past");
        }

        long requestedDays = request.getEndDate().toEpochDay() - request.getStartDate().toEpochDay() + 1;
        if (requestedDays > employee.getRemainingLeaves()) {
            throw new BadRequestException("Insufficient leave balance. Requested: " + requestedDays
                    + " days, Available: " + employee.getRemainingLeaves() + " days");
        }

        LeaveRequest leaveRequest = new LeaveRequest();
        leaveRequest.setEmployee(employee);
        leaveRequest.setStartDate(request.getStartDate());
        leaveRequest.setEndDate(request.getEndDate());
        leaveRequest.setLeaveType(request.getLeaveType());
        leaveRequest.setReason(request.getReason());
        leaveRequest.setStatus(LeaveStatus.PENDING);

        LeaveRequest saved = leaveRequestRepository.save(leaveRequest);
        return LeaveResponse.fromEntity(saved);
    }

    public List<LeaveResponse> getMyLeaves() {
        User employee = getCurrentUser();
        return leaveRequestRepository.findByEmployeeOrderByCreatedAtDesc(employee)
                .stream()
                .map(LeaveResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public List<LeaveResponse> getAllLeaves() {
        return leaveRequestRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(LeaveResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public LeaveResponse approveLeave(Long id) {
        User manager = getCurrentUser();
        LeaveRequest leaveRequest = leaveRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Leave request not found with id: " + id));

        if (leaveRequest.getStatus() != LeaveStatus.PENDING) {
            throw new BadRequestException("Leave request is already " + leaveRequest.getStatus().name().toLowerCase());
        }

        leaveRequest.setStatus(LeaveStatus.APPROVED);
        leaveRequest.setReviewedBy(manager);

        // Deduct leave days from employee balance
        User employee = leaveRequest.getEmployee();
        long days = leaveRequest.getNumberOfDays();
        employee.setUsedLeaves((int) (employee.getUsedLeaves() + days));
        userRepository.save(employee);

        LeaveRequest updated = leaveRequestRepository.save(leaveRequest);
        emailNotificationService.sendLeaveApprovedEmail(updated);
        return LeaveResponse.fromEntity(updated);
    }

    @Transactional
    public LeaveResponse rejectLeave(Long id, LeaveStatusUpdateRequest updateRequest) {
        User manager = getCurrentUser();
        LeaveRequest leaveRequest = leaveRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Leave request not found with id: " + id));

        if (leaveRequest.getStatus() != LeaveStatus.PENDING) {
            throw new BadRequestException("Leave request is already " + leaveRequest.getStatus().name().toLowerCase());
        }

        leaveRequest.setStatus(LeaveStatus.REJECTED);
        leaveRequest.setReviewedBy(manager);
        if (updateRequest != null && updateRequest.getRejectionReason() != null) {
            leaveRequest.setRejectionReason(updateRequest.getRejectionReason());
        }

        LeaveRequest updated = leaveRequestRepository.save(leaveRequest);
        emailNotificationService.sendLeaveRejectedEmail(updated);
        return LeaveResponse.fromEntity(updated);
    }

    public DashboardStats getEmployeeDashboard() {
        User employee = getCurrentUser();
        DashboardStats stats = new DashboardStats();
        stats.setTotalLeaves(employee.getTotalLeaves());
        stats.setUsedLeaves(employee.getUsedLeaves());
        stats.setRemainingLeaves(employee.getRemainingLeaves());
        stats.setPendingRequests(leaveRequestRepository.countByEmployeeAndStatus(employee, LeaveStatus.PENDING));
        stats.setApprovedRequests(leaveRequestRepository.countByEmployeeAndStatus(employee, LeaveStatus.APPROVED));
        stats.setRejectedRequests(leaveRequestRepository.countByEmployeeAndStatus(employee, LeaveStatus.REJECTED));
        return stats;
    }

    public DashboardStats getManagerDashboard() {
        DashboardStats stats = new DashboardStats();
        stats.setTotalRequests(leaveRequestRepository.count());
        stats.setTotalPending(leaveRequestRepository.countByStatus(LeaveStatus.PENDING));
        stats.setTotalApproved(leaveRequestRepository.countByStatus(LeaveStatus.APPROVED));
        stats.setTotalRejected(leaveRequestRepository.countByStatus(LeaveStatus.REJECTED));
        return stats;
    }
}
