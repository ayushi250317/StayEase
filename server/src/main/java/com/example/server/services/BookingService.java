package com.example.server.services;

import java.util.List;

import com.example.server.dto.request.CancelBookingRequest;
import com.example.server.dto.request.NewBookingRequest;
import com.example.server.dto.response.BookingHistory;
import com.example.server.dto.response.GetPropertyResponse;
import com.example.server.dto.response.MessageResponse;

public interface BookingService {
    void newBooking(int userId, NewBookingRequest request);

    List<BookingHistory> bookingHistory(int userId);

    List<BookingHistory> upcomingBooking(int userId);

    MessageResponse cancelBooking(int userId, CancelBookingRequest request);

    MessageResponse declineBooking(int userId, CancelBookingRequest request);

    String createPaymentIntent(int userId, NewBookingRequest request);
}
