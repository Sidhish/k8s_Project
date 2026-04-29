package com.publicsafety.complaintsystem.controller;

import com.publicsafety.complaintsystem.controller.dto.ProfileUpdateRequest;
import com.publicsafety.complaintsystem.domain.User;
import com.publicsafety.complaintsystem.service.AuthContextService;
import com.publicsafety.complaintsystem.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;
    private final AuthContextService authContextService;

    public UserController(UserService userService, AuthContextService authContextService) {
        this.userService = userService;
        this.authContextService = authContextService;
    }

    @GetMapping("/me")
    public ResponseEntity<User> me() {
        return ResponseEntity.ok(authContextService.currentUser());
    }

    @PutMapping("/me")
    public ResponseEntity<User> updateProfile(@RequestBody ProfileUpdateRequest request) {
        return ResponseEntity.ok(userService.updateProfile(authContextService.currentEmail(), request));
    }
}
