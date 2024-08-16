package com.example.server.services.impl;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.server.dto.response.AdminResponse;
import com.example.server.dto.response.PropertyResponse;
import com.example.server.repositories.BookingRepository;
import com.example.server.repositories.PropertyRepository;
import com.example.server.repositories.UserRepository;
import com.example.server.services.AdminService;
import com.example.server.entities.Booking;
import com.example.server.entities.Property;
import com.example.server.entities.User;
import com.example.server.entities.UserType;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PropertyRepository propertyRepository;
    @Autowired
    private BookingRepository bookingRepository;

    private Boolean validateAdmin(Integer userId) {
        User user = userRepository.findByUserId(userId);
        System.out.println(user.getUserType().toString() != UserType.ADMIN.name());

        System.out.println("Heree 123?" + user.getUserType().toString());
        System.out.println("Heree 123?" + UserType.ADMIN.name());
        if (user.getUserType().toString().equals(UserType.ADMIN.name())) {
            return false;
        }
        return true;
    }

    @Override
    public AdminResponse getAdminData(Integer userId) {
        if (validateAdmin(userId)) {
            return AdminResponse.builder().success(false).message("Only admins have access to this data.").build();
        }
        List<User> users = userRepository.findAll();
        Integer userCount = (int) userRepository.count();
        Integer propertyCount = (int) propertyRepository.count();
        List<Property> properties = propertyRepository.findAll();

        LocalDate startDate = LocalDate.now();
        LocalDate endDate = startDate.plusDays(30);
        List<Booking> upcomingBookings = bookingRepository.findBookingsForUpcomingMonth(startDate, endDate);
        List<PropertyResponse> filteredProperties = new ArrayList<>();
        for (Property property : properties) {
            Integer bookings = property.getBookings().size();
            String createdBy = property.getCreatedBy().getFullName();
            PropertyResponse filteredProperty = PropertyResponse.builder()
                    .name(property.getName())
                    .address(property.getAddress())
                    .createdBy(createdBy)
                    .bookingsUntilNow(bookings)
                    .registrationTime(property.getRegistrationTime())
                    .price(property.getPrice())
                    .build();
            filteredProperties.add(filteredProperty);
        }
        return AdminResponse.builder().users(users).success(true).userCount(userCount).propertyCount(propertyCount)
                .properties(filteredProperties).bookings(upcomingBookings).build();
    }

}
