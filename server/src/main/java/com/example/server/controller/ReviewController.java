package com.example.server.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.server.dto.request.AddReviewRequest;
import com.example.server.dto.response.GetReviewResponse;
import com.example.server.dto.response.MessageResponse;
import com.example.server.services.JwtService;
import com.example.server.services.ReviewService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/v1/review")
@RequiredArgsConstructor
public class ReviewController {

    private final JwtService jwtService;
    private final ReviewService reviewService;

    @PostMapping("/new")
    public ResponseEntity<MessageResponse> newReview(@RequestHeader("Authorization") String jwtToken,
            @RequestBody @Valid AddReviewRequest request) {
        Integer userId = jwtService.extractUserId(jwtToken.substring(7));
        MessageResponse response = reviewService.newReview(userId, request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/get/{propertyId}")
    public ResponseEntity<List<GetReviewResponse>> getReview(@RequestHeader("Authorization") String jwtToken,
            @PathVariable Integer propertyId) {
        Integer userId = jwtService.extractUserId(jwtToken.substring(7));
        List<GetReviewResponse> response = reviewService.getReviews(userId, propertyId);
        return ResponseEntity.ok(response);
    }

}
