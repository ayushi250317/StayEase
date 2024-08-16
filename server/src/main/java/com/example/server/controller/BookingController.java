package com.example.server.controller;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.view.RedirectView;

import com.example.server.dto.request.CancelBookingRequest;
import com.example.server.dto.request.NewBookingRequest;
import com.example.server.dto.request.PropertyAddRequest;
import com.example.server.dto.response.AddPropertyResponse;
import com.example.server.dto.response.BookingHistory;
import com.example.server.dto.response.GetPropertyResponse;
import com.example.server.dto.response.MessageResponse;
import com.example.server.services.BookingService;
import com.example.server.services.JwtService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/v1/booking")
@RequiredArgsConstructor
public class BookingController {

    private final JwtService jwtService;
    private final BookingService bookingService;
    @Value("${frontend.endpoint}")
    private String frontendEndpoint;

    // @PostMapping("/new")
    // @CrossOrigin(origins = "*")
    // public ResponseEntity<MessageResponse>
    // newBooking(@RequestHeader("Authorization") String jwtToken,
    // @RequestBody @Valid NewBookingRequest request) {
    // Integer userId = jwtService.extractUserId(jwtToken.substring(7));
    // MessageResponse response = bookingService.newBooking(userId, request);
    // return ResponseEntity.ok(response);
    // }

    @GetMapping("/new")
    @CrossOrigin(origins = "*")
    public RedirectView newBooking(@RequestParam("property_id") int propertyId,
            @RequestParam("user_id") int userId,
            @RequestParam("checkInDate") LocalDate checkInDate,
            @RequestParam("checkOutDate") LocalDate checkOutDate,
            @RequestParam("amount") BigDecimal amount,
            @RequestParam("totalAmount") BigDecimal totalAmount,
            @RequestParam("noOfGuests") int noOfGuests,
            @RequestParam("noOfChildren") int noOfChildren,
            @RequestParam("tax") BigDecimal tax) {

        try {
            NewBookingRequest request = new NewBookingRequest();
            request.setAmount(totalAmount);
            request.setProperty_id(propertyId);
            request.setUser_id(userId);
            request.setCheckInDate(checkInDate);
            request.setCheckOutDate(checkOutDate);
            request.setTotalAmount(totalAmount);
            request.setNoOfChildren(noOfChildren);
            request.setNoOfGuests(noOfGuests);
            request.setTax(tax);

            bookingService.newBooking(userId, request);
            return new RedirectView(frontendEndpoint + "/properties");
        } catch (Exception e) {
            System.out.println("Exception?" + e);
            return new RedirectView(frontendEndpoint + "/payment/fail");
        }

    }

    @GetMapping("/history")
    @CrossOrigin(origins = "*")
    public ResponseEntity<List<BookingHistory>> bookingHistory(@RequestHeader("Authorization") String jwtToken) {
        Integer userId = jwtService.extractUserId(jwtToken.substring(7));
        List<BookingHistory> response = bookingService.bookingHistory(userId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/upcoming")
    @CrossOrigin(origins = "*")
    public ResponseEntity<List<BookingHistory>> upcomingBooking(@RequestHeader("Authorization") String jwtToken) {
        Integer userId = jwtService.extractUserId(jwtToken.substring(7));
        List<BookingHistory> response = bookingService.upcomingBooking(userId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/cancel")
    @CrossOrigin(origins = "*")
    public ResponseEntity<MessageResponse> cancelBooking(@RequestHeader("Authorization") String jwtToken,
            @RequestBody CancelBookingRequest request) {
        Integer userId = jwtService.extractUserId(jwtToken.substring(7));
        MessageResponse response = bookingService.cancelBooking(userId, request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/decline")
    @CrossOrigin(origins = "*")
    public ResponseEntity<MessageResponse> declineBooking(@RequestHeader("Authorization") String jwtToken,
            @RequestBody CancelBookingRequest request) {
        Integer userId = jwtService.extractUserId(jwtToken.substring(7));
        MessageResponse response = bookingService.declineBooking(userId, request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/create-payment-intent")
    @CrossOrigin(origins = "*")
    public ResponseEntity<Map> createPaymentIntent(@RequestHeader("Authorization") String jwtToken,
            @RequestBody @Valid NewBookingRequest request) {
        Integer userId = jwtService.extractUserId(jwtToken.substring(7));
        String sesisonId = bookingService.createPaymentIntent(userId, request);

        Map<String, Object> response = new HashMap<>();
        response.put("sessionId", sesisonId);
        return ResponseEntity.ok(response);
    }

}
