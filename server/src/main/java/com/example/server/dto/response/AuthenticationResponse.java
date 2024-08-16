package com.example.server.dto.response;

import com.example.server.entities.User;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class AuthenticationResponse {
    private String token;
    private User user;
    private String message;
    private boolean success;
}
