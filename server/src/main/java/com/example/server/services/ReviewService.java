package com.example.server.services;

import java.util.List;

import com.example.server.dto.request.AddReviewRequest;
import com.example.server.dto.response.GetReviewResponse;
import com.example.server.dto.response.MessageResponse;

public interface ReviewService {
    MessageResponse newReview(Integer userId, AddReviewRequest request);

    List<GetReviewResponse> getReviews(Integer userId, Integer propertyId);
}
