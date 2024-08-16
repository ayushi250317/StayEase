package com.example.server.services.impl;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.example.server.dto.request.AddReviewRequest;
import com.example.server.dto.response.GetReviewResponse;
import com.example.server.dto.response.MessageResponse;
import com.example.server.entities.Property;
import com.example.server.entities.Review;
import com.example.server.entities.User;
import com.example.server.exception.ApiRequestException;
import com.example.server.repositories.PropertyRepository;
import com.example.server.repositories.ReviewRepository;
import com.example.server.repositories.UserRepository;
import com.example.server.services.ReviewService;
import com.example.server.utils.ResponseUtils;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {
    private final PropertyRepository propertyRepository;
    private final UserRepository userRepository;
    private final ReviewRepository reviewRepository;

    public MessageResponse newReview(Integer userId, AddReviewRequest request) {
        User user = userRepository.findByUserId(userId);
        if (user == null) {
            throw new ApiRequestException("User not available");
        }
        Property property = propertyRepository.findByPropertyId(request.getPropertyId());
        if (property == null) {
            throw new ApiRequestException("Property not available");
        }
        Optional<Review> review = reviewRepository.findByUserAndProperty(user, property);
        if (review.isPresent()) {
            throw new ApiRequestException("User already given review");
        }
        Review newReview = new Review();
        newReview.setUser(user);
        newReview.setProperty(property);
        newReview.setContent(request.getContent());
        newReview.setRating(request.getRating());
        reviewRepository.save(newReview);

        return MessageResponse.builder().message("Review Added successfully").success(false)
                .build();
    }

    public List<GetReviewResponse> getReviews(Integer userId, Integer propertyId) {
        User user = userRepository.findByUserId(userId);
        if (user == null) {
            throw new ApiRequestException("User not available");
        }
        Property property = propertyRepository.findByPropertyId(propertyId);
        if (property == null) {
            throw new ApiRequestException("Property not available");
        }
        List<Review> reviews = reviewRepository.findByProperty(property);

        return reviews.stream().map(ResponseUtils::convertRatingResponse).collect(Collectors.toList());

    }
}
