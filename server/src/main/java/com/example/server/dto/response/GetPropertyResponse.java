package com.example.server.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.example.server.entities.Images;
import com.example.server.entities.Propertytype;
import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GetPropertyResponse {
        private Integer id;
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
        private boolean isWishList;
        private String createdBy;
        private String createdUserAvatar;
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS")
        private LocalDateTime registrationTime;

        private List<ImageDto> images = new ArrayList<>();

        public void fetchImage(Images image) {
                ImageDto imageDTO = new ImageDto();
                imageDTO.setId(image.getId());
                if (image.getImg_url() != null) {
                        imageDTO.setImg_url("https://d1fxx1e2frfpnw.cloudfront.net/" +
                                        image.getImg_url());
                } else {
                        imageDTO.setImg_url(
                                        "https://a0.muscache.com/im/pictures/miso/Hosting-42872155/original/f8deb74c-285d-4a6e-b586-472296e78f21.jpeg?im_w=720");
                }

                images.add(imageDTO);
        }
}
