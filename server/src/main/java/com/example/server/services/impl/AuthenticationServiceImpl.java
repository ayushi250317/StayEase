package com.example.server.services.impl;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.example.server.utils.Awsutils;
import com.example.server.dto.request.AuthenticationRequest;
import com.example.server.dto.request.PasswordResetRequest;
import com.example.server.dto.request.RegisterRequest;
import com.example.server.dto.request.UpdateUserRequest;
import com.example.server.dto.response.AuthenticationResponse;
import com.example.server.dto.response.LoggedInUserResponse;
import com.example.server.entities.User;
import com.example.server.entities.UserType;
import com.example.server.exception.ApiRequestException;
import com.example.server.repositories.UserRepository;
import com.example.server.services.AuthenticationService;
import com.example.server.services.EmailService;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthenticationServiceImpl implements AuthenticationService {

    // @Autowired
    // private Environment env;
    @Autowired
    private UserRepository repository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private final Awsutils awsutils;
    private final JwtServiceImpl jwtService;
    @Autowired
    private final EmailService emailService;

    @Autowired
    private AuthenticationManager manager;

    @Value("${IP_ADDRESS}")
    private String ip_address;

    @Value("${FRONTEND_PORT}")
    private String port;

    public AuthenticationResponse verifyEmail(Integer id, String email) {
        User user = repository.findByUserId(id);
        if (user.getEmail().equals(email)) {
            user.setVerified(true);
            repository.save(user);
            String jwtToken = jwtService.generateToken(user);
            return AuthenticationResponse.builder().message("Account Email Verification Successful").token(jwtToken)
                    .success(true)
                    .build();
        }
        return AuthenticationResponse.builder().message("Email Verification Unsuccessful").build();
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        User user = repository.findByEmail(request.getEmail());
        if (user == null) {
            return AuthenticationResponse.builder().message("Email not registered").build();
        }
        if (!user.isVerified()) {
            return AuthenticationResponse.builder().message("Please verify your account").build();
        }
        try {
            manager.authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
        } catch (AuthenticationException e) {
            return AuthenticationResponse.builder().message("Incorrect Password").build();
        }
        var jwtToken = jwtService.generateToken(user);
        return AuthenticationResponse.builder()
                .message("Login Successful")
                .success(true)
                .user(user)
                .token(jwtToken)
                .build();
    }

    public AuthenticationResponse validateRequest(RegisterRequest request) throws MessagingException {
        User user = repository.findByEmail(request.getEmail());
        if (user != null) {
            return AuthenticationResponse.builder().message("Email already registered").build();
        }
        return register(request);
    }

    public AuthenticationResponse register(RegisterRequest request) throws MessagingException {

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .address(request.getAddress())
                .dateOfBirth(request.getDateOfBirth())
                .phoneNumber(request.getPhoneNumber())
                .password(passwordEncoder.encode(request.getPassword()))
                .registrationTime(LocalDateTime.now())
                .build();
        repository.save(user);

        String subject = "Verify StayEase Account";
        String body = "<p>Click the <a href=\"http://" + ip_address + ":" + port + "/confirm_registration?id="
                + user.getUserId() + "&email=" + user.getEmail() + "\">link</a> to verify your email </p>";
        emailService.sendEmail(user.getEmail(), subject, body);

        return AuthenticationResponse.builder()
                .message("Registration Successful")
                .success(true)
                .user(user)
                .build();

    }

    public AuthenticationResponse forgotPassword(AuthenticationRequest request) {
        User user = repository.findByEmail(request.getEmail());
        if (user == null) {
            return AuthenticationResponse.builder().message("Email do not exist").build();
        }
        String resetToken = jwtService.generateToken(user);

        String htmlContent = "<p>Click the <a href=\"http://" + ip_address + ":" + port
                + "/confirm_password?resetToken="
                + resetToken + "&id=" + user.getUserId() + "\">link</a> to reset your password </p>";

        emailService.sendEmail(request.getEmail(), "Reset Password", htmlContent);

        return AuthenticationResponse.builder().message("email sent successfully").success(true).build();

    }

    public AuthenticationResponse resetPassword(String token, Integer id) {
        User user = repository.findByUserId(id);
        Integer tokenId = jwtService.extractUserId(token);
        if (user.getUserId().equals(tokenId)) {
            return AuthenticationResponse.builder().message("Verification done successfully").success(true).build();
        }
        return AuthenticationResponse.builder().message("Email did not match").build();
    }

    public AuthenticationResponse setNewPassword(PasswordResetRequest request) {
        User user = repository.findByUserId(request.getId());
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        repository.save(user);
        return AuthenticationResponse.builder().message("Password Reset Successful").success(true).build();

    }

    @Override
    public LoggedInUserResponse getUserDetails(Integer userId) {
        User user = repository.findByUserId(userId);
        if (user == null) {
            throw new ApiRequestException("User not available");
        }
        return LoggedInUserResponse.builder().user(user).build();
    }

    @Override
    public LoggedInUserResponse updateUser(Integer userId, UpdateUserRequest request) {
        User user = repository.findByUserId(userId);
        if (user == null) {
            throw new ApiRequestException("User not available");
        }
        user.setAddress(request.getAddress());
        user.setFullName(request.getFullName());
        user.setDateOfBirth(request.getDateOfBirth());
        user.setPhoneNumber(request.getPhoneNumber());

        repository.save(user);

        System.out.println("user.getDateOfBirth" + user.getDateOfBirth());
        return LoggedInUserResponse.builder().user(user).build();
    }

    @Override
    public LoggedInUserResponse updateAvatar(Integer userId, MultipartFile file) {
        User user = repository.findByUserId(userId);
        if (user == null) {
            throw new ApiRequestException("User not available");
        }

        String path = "user/" + user.getUserId();
        String url = awsutils.uploadFileToS3(file, user.getUserId(), path);

        user.setUserAvatar("https://d1fxx1e2frfpnw.cloudfront.net/" + url);

        repository.save(user);

        return LoggedInUserResponse.builder().user(user).build();
    }

}
