package com.example.server.utils;

import org.springframework.stereotype.Service;

import com.example.server.dto.response.BookingHistory;
import com.example.server.dto.response.GetPropertyResponse;
import com.example.server.dto.response.GetReviewResponse;
import com.example.server.entities.Booking;
import com.example.server.entities.Images;
import com.example.server.entities.Property;
import com.example.server.entities.Review;

import java.util.Set;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ResponseUtils {
    public static GetPropertyResponse convertPropertyResponse(Property property) {
        GetPropertyResponse res = new GetPropertyResponse();
        res.setId(property.getPropertyId());
        res.setCreatedBy(property.getCreatedBy().getFullName());
        res.setCreatedUserAvatar(property.getCreatedBy().getUserAvatar());
        res.setName(property.getName());
        res.setDescription(property.getDescription());
        res.setLocation(property.getLocation());
        res.setAddress(property.getAddress());
        res.setAmenities(property.getAmenities());
        res.setPropertyType(property.getPropertyType());
        res.setPrice(property.getPrice());
        res.setNoOfBeds(property.getNoOfBeds());
        res.setNoOfBaths(property.getNoOfBaths());
        res.setGuestAllowed(property.getGuestAllowed());
        res.setArea(property.getArea());
        res.setParking(property.getParking());
        res.setLat(property.getLat());
        res.setLng(property.getLng());
        res.setRegistrationTime(property.getRegistrationTime());

        for (Images images : property.getImages()) {
            res.fetchImage(images);
        }
        return res;
    }

    public static GetPropertyResponse wishListedProperty(Property property, Set<Integer> wishlistedPropertyIds) {
        GetPropertyResponse res = new GetPropertyResponse();
        res.setId(property.getPropertyId());
        res.setName(property.getName());
        res.setDescription(property.getDescription());
        res.setLocation(property.getLocation());
        res.setAddress(property.getAddress());
        res.setAmenities(property.getAmenities());
        res.setPropertyType(property.getPropertyType());
        res.setPrice(property.getPrice());
        res.setNoOfBeds(property.getNoOfBeds());
        res.setNoOfBaths(property.getNoOfBaths());
        res.setGuestAllowed(property.getGuestAllowed());
        res.setArea(property.getArea());
        res.setParking(property.getParking());
        res.setLat(property.getLat());
        res.setLng(property.getLng());
        res.setRegistrationTime(property.getRegistrationTime());
        if (wishlistedPropertyIds != null) {
            res.setWishList(wishlistedPropertyIds.contains(property.getPropertyId()));
        }
        for (Images images : property.getImages()) {
            res.fetchImage(images);
        }
        return res;
    }

    public static GetPropertyResponse convertAllPropertyResponse(Property property,
            Set<Integer> wishlistedPropertyIds) {
        GetPropertyResponse res = new GetPropertyResponse();
        res.setId(property.getPropertyId());
        res.setName(property.getName());
        res.setDescription(property.getDescription());
        res.setLocation(property.getLocation());
        res.setAddress(property.getAddress());
        res.setAmenities(property.getAmenities());
        res.setPropertyType(property.getPropertyType());
        res.setPrice(property.getPrice());
        res.setNoOfBeds(property.getNoOfBeds());
        res.setNoOfBaths(property.getNoOfBaths());
        res.setGuestAllowed(property.getGuestAllowed());
        res.setArea(property.getArea());
        res.setParking(property.getParking());
        res.setLat(property.getLat());
        res.setLng(property.getLng());
        res.setRegistrationTime(property.getRegistrationTime());
        if (wishlistedPropertyIds != null) {
            res.setWishList(wishlistedPropertyIds.contains(property.getPropertyId()));
        }
        for (Images images : property.getImages()) {
            res.fetchImage(images);
        }
        return res;
    }

    public static BookingHistory convertBookingHistory(Booking booking, String bookingType) {
        BookingHistory res = new BookingHistory();

        System.out.println("HEREE" + booking.getCheckInDate());
        res.setBookingId(booking.getId());
        res.setUser(booking.getUser());
        res.setProperty(booking.getProperty());
        res.setPropertyName(booking.getProperty().getName());
        res.setAmount(booking.getAmount());
        res.setTax(booking.getTax());
        res.setTotalAmount(booking.getTotalAmount());
        res.setBookingType(bookingType);
        res.setNoOfGuests(booking.getNoOfGuests());
        res.setNoOfChildren(booking.getNoOfChildren());
        res.setCheckInDate(booking.getCheckInDate());
        res.setCheckOutDate(booking.getCheckOutDate());
        res.setDeclineReason(booking.getDeclineReason());
        for (Images images : booking.getProperty().getImages()) {
            res.fetchImage(images);
        }
        return res;
    }

    public static GetReviewResponse convertRatingResponse(Review review) {
        GetReviewResponse res = new GetReviewResponse();

        res.setUser(review.getUser());
        res.setRating(review.getRating());
        res.setContent(review.getContent());
        return res;
    }

}
