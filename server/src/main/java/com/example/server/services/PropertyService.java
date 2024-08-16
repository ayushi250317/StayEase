package com.example.server.services;

import org.springframework.web.multipart.MultipartFile;

import com.example.server.dto.request.PropertyAddRequest;
import com.example.server.dto.response.AddPropertyResponse;
import com.example.server.dto.response.BookingHistory;
import com.example.server.dto.response.GetPropertyResponse;
import com.example.server.dto.response.MessageResponse;
import java.util.List;

public interface PropertyService {
    AddPropertyResponse addProperty(Integer userId, PropertyAddRequest request);

    MessageResponse editProperty(Integer userId, PropertyAddRequest request, Integer propertyId);

    MessageResponse deleteProperty(Integer userId, Integer propertyId);

    MessageResponse addImages(Integer userId, MultipartFile[] files, Integer propertyId);

    GetPropertyResponse getproperty(Integer propertyId);

    List<GetPropertyResponse> getOwnerProperties(Integer userId);

    List<GetPropertyResponse> getAllproperties(Integer userId);

    List<BookingHistory> getOwnerReservation(Integer userId);

}
