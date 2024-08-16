package com.example.server.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.example.server.services.WishlistService;
import com.example.server.dto.request.PropertyAddRequest;
import com.example.server.dto.response.GetPropertyResponse;
import com.example.server.dto.response.MessageResponse;
import com.example.server.services.JwtService;

import lombok.RequiredArgsConstructor;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/v1/wishlist")
@RequiredArgsConstructor
public class WishlistController {
    private final JwtService jwtService;
    private final WishlistService WishlistService;

    @PostMapping("/add/{propertyId}")
    @CrossOrigin(origins = "*")
    public ResponseEntity<MessageResponse> addToWishlist(@PathVariable Integer propertyId,
            @RequestHeader("Authorization") String jwtToken) {
        Integer userId = jwtService.extractUserId(jwtToken.substring(7));
        MessageResponse response = WishlistService.addToWishlist(userId, propertyId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/remove/{propertyId}")
    @CrossOrigin(origins = "*")
    public ResponseEntity<MessageResponse> removeFromWishlist(@PathVariable Integer propertyId,
            @RequestHeader("Authorization") String jwtToken) {
        Integer userId = jwtService.extractUserId(jwtToken.substring(7));
        MessageResponse response = WishlistService.removeFromWishlist(userId, propertyId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/my-properties")
    @CrossOrigin(origins = "*")
    public ResponseEntity<List<GetPropertyResponse>> getOwnerProperties(
            @RequestHeader("Authorization") String jwtToken) {
        Integer userId = jwtService.extractUserId(jwtToken.substring(7));
        List<GetPropertyResponse> response = WishlistService.getWishlistedProperties(userId);
        return ResponseEntity.ok(response);
    }

}
