package com.example.server.controller;

import javax.swing.RepaintManager;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.Valid;
import com.example.server.dto.request.AuthenticationRequest;
import com.example.server.dto.request.PasswordResetRequest;
import com.example.server.dto.request.RegisterRequest;
import com.example.server.dto.request.UpdateUserRequest;
import com.example.server.dto.response.AuthenticationResponse;
import com.example.server.dto.response.LoggedInUserResponse;
import com.example.server.services.AuthenticationService;
import com.example.server.services.impl.JwtServiceImpl;

import jakarta.mail.MessagingException;

import lombok.RequiredArgsConstructor;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthenticationController {
    private final AuthenticationService service;

    @Autowired
    JwtServiceImpl jwtService;

    @PostMapping("/register")
    @CrossOrigin(origins = "*")
    public ResponseEntity<AuthenticationResponse> register(
            @RequestBody @Valid RegisterRequest request) throws MessagingException {
        try {
            return ResponseEntity.ok(service.validateRequest(request));
        } catch (Exception e) {
            System.out.println("HEREE? EXCEPTION" + e.getMessage());
            AuthenticationResponse response = AuthenticationResponse.builder().message(e.getMessage()).success(false)
                    .build();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(response);
        }
    }

    @PostMapping("/authenticate")
    @CrossOrigin(origins = "*")
    public ResponseEntity<AuthenticationResponse> authenticate(
            @RequestBody AuthenticationRequest request) {
        try {
            return ResponseEntity.ok(service.authenticate(request));
        } catch (Exception e) {
            AuthenticationResponse response = AuthenticationResponse.builder().message(e.getMessage()).success(false)
                    .build();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(response);
        }
    }

    @GetMapping("/verifyEmail")
    @CrossOrigin(origins = "*")
    public ResponseEntity<AuthenticationResponse> verifyEmail(@RequestParam String email,
            @RequestParam Integer id) {
        try {
            return ResponseEntity.ok(service.verifyEmail(id, email));
        } catch (Exception e) {
            AuthenticationResponse response = AuthenticationResponse.builder().message(e.getMessage()).success(false)
                    .build();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(response);
        }
    }

    @PostMapping("/forgotPassword")
    @CrossOrigin(origins = "*")
    public ResponseEntity<AuthenticationResponse> forgotPassword(
            @RequestBody AuthenticationRequest request) throws MessagingException {
        try {
            return ResponseEntity.ok(service.forgotPassword(request));
        } catch (Exception e) {
            AuthenticationResponse response = AuthenticationResponse.builder().message(e.getMessage()).success(false)
                    .build();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(response);
        }
    }

    @GetMapping("/resetPassword")
    @CrossOrigin(origins = "*")
    public ResponseEntity<AuthenticationResponse> resetPassword(@RequestParam String token,
            @RequestParam Integer id) {
        try {
            return ResponseEntity.ok(service.resetPassword(token, id));
        } catch (Exception e) {
            AuthenticationResponse response = AuthenticationResponse.builder().message(e.getMessage()).success(false)
                    .build();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(response);
        }
    }

    @PostMapping("/newPassword")
    @CrossOrigin(origins = "*")
    public ResponseEntity<AuthenticationResponse> setNewPassword(@RequestBody PasswordResetRequest request) {
        try {
            return ResponseEntity.ok(service.setNewPassword(request));
        } catch (Exception e) {
            AuthenticationResponse response = AuthenticationResponse.builder().message(e.getMessage()).success(false)
                    .build();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(response);
        }
    }

    @GetMapping("/me")
    @CrossOrigin(origins = "*")
    public ResponseEntity<LoggedInUserResponse> getLoggedInUserDetails(
            @RequestHeader("Authorization") String jwtToken) {
        Integer userId = jwtService.extractUserId(jwtToken.substring(7));
        LoggedInUserResponse loggedInUserResponse = service.getUserDetails(userId);
        return ResponseEntity.ok(loggedInUserResponse);
    }

    @PutMapping("/me")
    @CrossOrigin(origins = "*")
    public ResponseEntity<LoggedInUserResponse> updateUser(@RequestHeader("Authorization") String jwtToken,
            @RequestBody @Valid UpdateUserRequest request) {
        Integer userId = jwtService.extractUserId(jwtToken.substring(7));
        LoggedInUserResponse loggedInUserResponse = service.updateUser(userId, request);
        return ResponseEntity.ok(loggedInUserResponse);
    }

    @PutMapping("/me/update-avatar")
    @CrossOrigin(origins = "*")
    public ResponseEntity<LoggedInUserResponse> updateAvatar(@RequestHeader("Authorization") String jwtToken,
            @RequestPart(value = "file") MultipartFile file) {
        Integer userId = jwtService.extractUserId(jwtToken.substring(7));
        LoggedInUserResponse loggedInUserResponse = service.updateAvatar(userId, file);
        return ResponseEntity.ok(loggedInUserResponse);
    }

}
