package com.example.server.services.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.server.dto.response.GetPropertyResponse;
import com.example.server.dto.response.MessageResponse;
import com.example.server.entities.Property;
import com.example.server.entities.User;
import com.example.server.exception.ApiRequestException;
import com.example.server.repositories.PropertyRepository;
import com.example.server.repositories.UserRepository;
import com.example.server.services.WishlistService;
import com.example.server.utils.ResponseUtils;

import java.util.Set;
import java.util.stream.Collectors;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class WishlistServiceImpl implements WishlistService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PropertyRepository propertyRepository;

    public MessageResponse addToWishlist(Integer userId, Integer propertyId) {

        Optional<Property> propertyOptional = propertyRepository.findById(propertyId);

        if (!propertyOptional.isPresent()) {
            throw new ApiRequestException("Property with specified ID not available");
        }

        User user = userRepository.findByUserId(userId);
        Property property = propertyOptional.get();
        user.getWishListedProperties().add(property);
        userRepository.save(user);
        return MessageResponse.builder().message("Property added to wishlist").success(true)
                .build();
    }

    public MessageResponse removeFromWishlist(Integer userId, Integer propertyId) {

        Optional<Property> propertyOptional = propertyRepository.findById(propertyId);

        if (!propertyOptional.isPresent()) {
            throw new ApiRequestException("Property with specified ID not available");
        }

        User user = userRepository.findByUserId(userId);
        Property property = propertyOptional.get();
        user.getWishListedProperties().remove(property);
        userRepository.save(user);
        return MessageResponse.builder().message("Property removed from wishlist").success(true)
                .build();
    }

    public List<GetPropertyResponse> getWishlistedProperties(Integer userId) {
        User user = userRepository.findByUserId(userId);
        Set<Property> properties = user.getWishListedProperties();

        Set<Integer> wishlistedPropertyIds = properties.stream().map(Property::getPropertyId)
                .collect(Collectors.toSet());
        return properties.stream()
                .map(property -> ResponseUtils.wishListedProperty(property, wishlistedPropertyIds))
                .collect(Collectors.toList());
    }

}
