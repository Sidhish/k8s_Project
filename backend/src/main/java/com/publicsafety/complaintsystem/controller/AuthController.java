package com.publicsafety.complaintsystem.controller;

import com.publicsafety.complaintsystem.controller.dto.AuthRequest;
import com.publicsafety.complaintsystem.controller.dto.AuthResponse;
import com.publicsafety.complaintsystem.controller.dto.RegisterRequest;
import com.publicsafety.complaintsystem.domain.Role;
import com.publicsafety.complaintsystem.domain.User;
import com.publicsafety.complaintsystem.repository.UserRepository;
import com.publicsafety.complaintsystem.security.JwtUtil;
import com.publicsafety.complaintsystem.service.AuditService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuditService auditService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already exists");
        }

        Role role = Role.CITIZEN;
        if (request.getRole() != null && !request.getRole().isBlank()) {
            try {
                Role requested = Role.valueOf(request.getRole().toUpperCase());
                role = (requested == Role.OFFICER) ? Role.OFFICER : Role.CITIZEN;
            } catch (IllegalArgumentException ignored) {
                role = Role.CITIZEN;
            }
        }

        User user = new User(
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()),
                request.getName(),
                role
        );
        if (request.getPreferredLanguage() != null) {
            user.setPreferredLanguage(request.getPreferredLanguage());
        }
        userRepository.save(user);
        auditService.log("USER_REGISTERED", request.getEmail(), "USER", user.getId().toString(), role.name());

        return ResponseEntity.ok("User registered successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail()).orElseThrow();
        String token = jwtUtil.generateToken(user.getEmail());
        auditService.log("USER_LOGIN", user.getEmail(), "USER", user.getId().toString(), "Password login");

        return ResponseEntity.ok(new AuthResponse(token, user.getRole().name(), user.getId(), user.getName()));
    }
}
