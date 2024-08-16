package com.example.server.services;

import java.util.List;

import com.example.server.dto.response.GetPropertyResponse;
import com.example.server.dto.response.MessageResponse;

public interface WishlistService {
    MessageResponse addToWishlist(Integer userId, Integer propertyId);

    MessageResponse removeFromWishlist(Integer userId, Integer propertyId);

    List<GetPropertyResponse> getWishlistedProperties(Integer userId);

}
