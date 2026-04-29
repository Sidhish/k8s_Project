package com.publicsafety.complaintsystem.security;

import com.publicsafety.complaintsystem.domain.Role;
import com.publicsafety.complaintsystem.domain.User;
import com.publicsafety.complaintsystem.repository.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Optional;

@Component
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");

        Optional<User> existingUser = userRepository.findByEmail(email);
        User user;
        if (existingUser.isEmpty()) {
            user = new User(email, "", name, Role.CITIZEN); // No password for OAuth
            userRepository.save(user);
        } else {
            user = existingUser.get();
        }

        String token = jwtUtil.generateToken(user.getEmail());
        
        // Redirect to frontend with token
        response.sendRedirect("http://localhost:5173/login?token=" + token);
    }
}
