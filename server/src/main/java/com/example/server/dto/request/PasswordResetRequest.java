package com.example.server.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PasswordResetRequest {
    private String token;
    private Integer id;
    private String newPassword;
}
