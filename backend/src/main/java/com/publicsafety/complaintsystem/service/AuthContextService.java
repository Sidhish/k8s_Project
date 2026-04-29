package com.publicsafety.complaintsystem.service;

import com.publicsafety.complaintsystem.domain.User;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class AuthContextService {
    private final UserService userService;

    public AuthContextService(UserService userService) {
        this.userService = userService;
    }

    public String currentEmail() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return auth.getName();
    }

    public User currentUser() {
        return userService.getByEmail(currentEmail());
    }
}
