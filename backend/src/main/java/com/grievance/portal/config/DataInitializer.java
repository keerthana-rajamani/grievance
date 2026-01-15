package com.grievance.portal.config;

import com.grievance.portal.entity.User;
import com.grievance.portal.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;

@Component
public class DataInitializer implements CommandLineRunner {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (!userRepository.existsByUsername("admin")) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setEmail("admin@grievance.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setFirstName("Admin");
            admin.setLastName("User");
            admin.setEnabled(true);

            Set<User.Role> roles = new HashSet<>();
            roles.add(User.Role.ADMIN);
            admin.setRoles(roles);

            userRepository.save(admin);
            System.out.println("Default admin user created: username=admin, password=admin123");
        }
    }
}
