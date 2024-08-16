package com.example.server.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class PropertyResponse {
    private String name;
    private String address;   
    private LocalDateTime registrationTime;
    private Integer bookingsUntilNow;
    private BigDecimal price;
    private String createdBy;
}
