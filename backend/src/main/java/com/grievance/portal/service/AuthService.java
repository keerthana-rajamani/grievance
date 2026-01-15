package com.grievance.portal.service;

import com.grievance.portal.dto.JwtResponse;
import com.grievance.portal.dto.LoginRequest;
import com.grievance.portal.dto.RegisterRequest;
import com.grievance.portal.entity.User;
import com.grievance.portal.repository.UserRepository;
import com.grievance.portal.security.JwtUtils;
import com.grievance.portal.security.UserDetailsServiceImpl.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class AuthService {
    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    JwtUtils jwtUtils;

    @Transactional
    public User register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Error: Username is already taken!");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Error: Email is already in use!");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        
        Set<User.Role> roles = new HashSet<>();
        roles.add(User.Role.USER);
        user.setRoles(roles);

        return userRepository.save(user);
    }

    public JwtResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        Set<String> roles = userPrincipal.getAuthorities().stream()
                .map(item -> item.getAuthority().replace("ROLE_", ""))
                .collect(Collectors.toSet());

        return new JwtResponse(jwt,
                "Bearer",
                userPrincipal.getId(),
                userPrincipal.getUsername(),
                userPrincipal.getEmail(),
                roles);
    }
}
