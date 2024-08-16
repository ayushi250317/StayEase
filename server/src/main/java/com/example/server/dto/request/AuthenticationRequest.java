package com.example.server.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AuthenticationRequest {
    private String email;
    String password;
}
