package com.example.server.dto.request;

import java.math.BigDecimal;
import java.time.LocalDate;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NewBookingRequest {

    @NotNull(message = "Property ID is required")
    private int property_id;

    @NotNull(message = "User ID is required")
    private int user_id;

    private LocalDate checkInDate;

    private LocalDate checkOutDate;

    @NotNull(message = "amount is required")
    private BigDecimal amount;

    @NotNull(message = "total Amount is required")
    private BigDecimal totalAmount;

    @NotNull(message = "noOfGuests is required")
    private int noOfGuests;

    @NotNull(message = "noOfChildren is required")
    private int noOfChildren;

    @NotNull(message = "tax is required")
    private BigDecimal tax;
}
