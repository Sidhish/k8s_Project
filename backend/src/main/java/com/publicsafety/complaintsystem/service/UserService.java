package com.publicsafety.complaintsystem.service;

import com.publicsafety.complaintsystem.controller.dto.ProfileUpdateRequest;
import com.publicsafety.complaintsystem.domain.Role;
import com.publicsafety.complaintsystem.domain.User;
import com.publicsafety.complaintsystem.repository.UserRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final AuditService auditService;

    public UserService(UserRepository userRepository, AuditService auditService) {
        this.userRepository = userRepository;
        this.auditService = auditService;
    }

    public User getByEmail(String email) {
        return userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User updateProfile(String email, ProfileUpdateRequest request) {
        User user = getByEmail(email);
        if (request.getName() != null && !request.getName().isBlank()) user.setName(request.getName());
        if (request.getPhone() != null) user.setPhone(request.getPhone());
        if (request.getPreferredLanguage() != null && !request.getPreferredLanguage().isBlank()) user.setPreferredLanguage(request.getPreferredLanguage());
        User saved = userRepository.save(user);
        auditService.log("PROFILE_UPDATED", email, "USER", saved.getId().toString(), "Self profile update");
        return saved;
    }

    public List<User> officers() {
        return userRepository.findByRole(Role.OFFICER);
    }
}
