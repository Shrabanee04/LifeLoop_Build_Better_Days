package com.example.lifeloopbackend.service;

import com.example.lifeloopbackend.dto.LoginRequest;
import com.example.lifeloopbackend.dto.LoginResponse;
import com.example.lifeloopbackend.dto.RegisterRequest;
import com.example.lifeloopbackend.entity.User;
import com.example.lifeloopbackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    public String register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            return "Email already exists!";
        }

        User user = new User();

        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole("USER");

        userRepository.save(user);

        return "User Registered Successfully!";
    }

    public LoginResponse login(LoginRequest request) {

        User user = userRepository
                .findByEmail(request.getEmail())
                .orElse(null);

        if (user == null) {
            return new LoginResponse("User not found!", null, null, null);
        }

        if (passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return new LoginResponse(
                    "Login Successful!",
                    user.getId(),
                    user.getName(),
                    user.getEmail()
            );
        }

        return new LoginResponse("Invalid Password!", null, null, null);
    }
}
