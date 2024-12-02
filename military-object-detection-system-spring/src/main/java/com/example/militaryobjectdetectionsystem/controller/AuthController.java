package com.example.militaryobjectdetectionsystem.controller;


import com.example.militaryobjectdetectionsystem.models.User;

import com.example.militaryobjectdetectionsystem.service.UserService;
import com.example.militaryobjectdetectionsystem.utils.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

        import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;
    private final JwtUtil jwtUtil;

    public AuthController(UserService userService, JwtUtil jwtUtil) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@RequestBody User user) {
        userService.registerUser(user.getEmail(), user.getPassword());
        Map<String, String> response = new HashMap<>();
        response.put("message", "User registered successfully");
        return ResponseEntity.ok(response);
    }


    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody User user) {
        System.out.println("Login attempt for email: " + user.getEmail());
        return userService.loginUser(user.getEmail(), user.getPassword())
                .map(u -> {
                    System.out.println("Login successful for email: " + user.getEmail());
                    String token = JwtUtil.generateToken(user.getEmail());
                    Map<String, String> response = new HashMap<>();
                    response.put("message", "Login successful");
                    response.put("token", token);
                    return ResponseEntity.ok(response);
                })
                .orElseGet(() -> {
                    System.out.println("Invalid credentials for email: " + user.getEmail());
                    Map<String, String> errorResponse = new HashMap<>();
                    errorResponse.put("error", "Invalid credentials");
                    return ResponseEntity.status(403).body(errorResponse);
                });
    }

    // Новий метод для отримання користувача по email
    @GetMapping("/login")
    public ResponseEntity<User> getUserByEmail(@RequestParam String email) {
        return userService.findByEmail(email)
                .map(user -> ResponseEntity.ok(user))
                .orElseGet(() -> ResponseEntity.status(404).body(null));
    }

    @GetMapping("/validate")
    public ResponseEntity<?> validateToken(HttpServletRequest request) {
        String token = request.getHeader("Authorization").substring(7);
        if (JwtUtil.validateToken(token) != null) {
            return ResponseEntity.ok("Token is valid");
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
        }
    }


}

