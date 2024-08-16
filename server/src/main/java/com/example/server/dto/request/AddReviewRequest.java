package com.example.server.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddReviewRequest {
    private int propertyId;
    private String rating;
    private String content;
}
