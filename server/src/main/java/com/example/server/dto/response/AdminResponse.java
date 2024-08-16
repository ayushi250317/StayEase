package com.example.server.dto.response;

import java.util.List;

import com.example.server.entities.Booking;
import com.example.server.entities.Property;
import com.example.server.entities.User;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class AdminResponse {
    private Integer userCount;
    private Integer propertyCount;
    private Boolean success;
    private String message;
    private List<User> users;
    private List<Booking> bookings;
    private List<PropertyResponse> properties;
}
