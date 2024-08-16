package com.example.server.dto.response;

import com.example.server.entities.User;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GetReviewResponse {
    private String rating;
    private String content;
    private User user;
}
