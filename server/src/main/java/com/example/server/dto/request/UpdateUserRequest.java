package com.example.server.dto.request;

import java.util.Date;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateUserRequest {
    @NotBlank(message = "Name can not be blank")
    private String fullName;
    @NotBlank(message = "address can not be blank")
    private String address;
    private Date dateOfBirth;
    @NotBlank(message = "phone can not be blank")
    private String phoneNumber;
}
