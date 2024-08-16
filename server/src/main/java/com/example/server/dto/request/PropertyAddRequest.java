package com.example.server.dto.request;

import java.math.BigDecimal;
import java.util.List;

import com.example.server.entities.Propertytype;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PropertyAddRequest {
    private String name;
    private String description;
    private String location;
    private String address;
    private List<String> amenities;
    private Propertytype propertyType;
    private BigDecimal price;
    private Integer noOfBeds;
    private Integer noOfBaths;
    private Integer guestAllowed;
    private BigDecimal area;
    private Boolean parking;
    private Double lat;
    private Double lng;
}
