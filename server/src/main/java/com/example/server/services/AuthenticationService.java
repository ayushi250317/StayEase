package com.example.server.services;

import org.springframework.web.multipart.MultipartFile;

import com.example.server.dto.request.AuthenticationRequest;
import com.example.server.dto.request.PasswordResetRequest;
import com.example.server.dto.request.RegisterRequest;
import com.example.server.dto.request.UpdateUserRequest;
import com.example.server.dto.response.AuthenticationResponse;
import com.example.server.dto.response.LoggedInUserResponse;

import jakarta.mail.MessagingException;

public interface AuthenticationService {
    AuthenticationResponse validateRequest(RegisterRequest request) throws MessagingException;

    AuthenticationResponse authenticate(AuthenticationRequest request);

    AuthenticationResponse verifyEmail(Integer id, String email);

    AuthenticationResponse forgotPassword(AuthenticationRequest request);

    AuthenticationResponse resetPassword(String token, Integer id);

    AuthenticationResponse setNewPassword(PasswordResetRequest request);

    LoggedInUserResponse getUserDetails(Integer userId);

    LoggedInUserResponse updateUser(Integer userId, UpdateUserRequest request);

    LoggedInUserResponse updateAvatar(Integer userId, MultipartFile file);
}
