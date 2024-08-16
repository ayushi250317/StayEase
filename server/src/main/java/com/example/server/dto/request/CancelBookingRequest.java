package com.example.server.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CancelBookingRequest {
    @NotBlank(message = "Reason is required")
    private String reason;
    @NotBlank(message = "Booking id required")
    private int bookingId;
}
