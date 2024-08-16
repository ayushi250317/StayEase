package com.example.server.dto.response;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import com.example.server.entities.Images;
import com.example.server.entities.Property;
import com.example.server.entities.User;
import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BookingHistory {
    private Property property;
    private User user;
    private Integer bookingId;
    private String propertyName;
    private BigDecimal amount;
    private BigDecimal tax;
    private BigDecimal totalAmount;
    private Integer noOfGuests;
    private Integer noOfChildren;
    private String bookingType;
    private String declineReason;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate checkInDate;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate checkOutDate;
    private List<ImageDto> images = new ArrayList<>();

    public void fetchImage(Images image) {
        ImageDto imageDTO = new ImageDto();
        imageDTO.setId(image.getId());
        imageDTO.setImg_url("https://d1fxx1e2frfpnw.cloudfront.net/" + image.getImg_url());

        images.add(imageDTO);
    }
}
