package com.example.server.services.impl;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Service;
import com.stripe.Stripe;
import com.stripe.param.checkout.SessionCreateParams;
import com.stripe.model.checkout.Session;
import com.example.server.dto.request.CancelBookingRequest;
import com.example.server.dto.request.NewBookingRequest;
import com.example.server.dto.response.BookingHistory;
import com.example.server.dto.response.MessageResponse;
import com.example.server.entities.Booking;
import com.example.server.entities.BookingStatus;
import com.example.server.entities.CancelledBooking;
import com.example.server.entities.Property;
import com.example.server.entities.User;
import com.example.server.exception.ApiRequestException;
import com.example.server.repositories.BookingRepository;
import com.example.server.repositories.CancelledBookingRepository;
import com.example.server.repositories.PropertyRepository;
import com.example.server.repositories.UserRepository;
import com.example.server.services.BookingService;
import com.example.server.utils.ResponseUtils;
import org.springframework.beans.factory.annotation.Value;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {
    private final BookingRepository bookRepository;
    private final PropertyRepository propertyRepository;
    private final UserRepository userRepository;
    private final CancelledBookingRepository CancelledBookingRepository;

    @Value("${stripe.apikey}")
    private String stripeAPI;

    @Value("${api.endpoint}")
    private String APIendpoint;

    @Value("${frontend.endpoint}")
    private String frontendEndpoint;

    public void newBooking(int userId, NewBookingRequest request) {
        Property property = propertyRepository.findByPropertyId(request.getProperty_id());
        User user = userRepository.findByUserId(userId);
        Booking booking = Booking.builder().property(property).amount(request.getAmount())
                .checkInDate(request.getCheckInDate()).checkOutDate(request.getCheckOutDate())
                .noOfGuests(request.getNoOfGuests()).noOfChildren(request.getNoOfChildren()).user(user)
                .totalAmount(request.getTotalAmount())
                .tax(request.getTax()).build();

        bookRepository.save(booking);
    }

    public List<BookingHistory> bookingHistory(int userId) {
        User user = userRepository.findByUserId(userId);
        if (user == null) {
            throw new ApiRequestException("User not available");
        }

        LocalDate currentDate = LocalDate.now();

        List<Booking> previousBookings = bookRepository.findPreviousBookingsByUser(currentDate, user);
        List<Booking> currentBookings = bookRepository.findCurrentBookingsByUser(currentDate, user);

        List<BookingHistory> response = new ArrayList<>();
        for (Booking booking : previousBookings) {
            System.out.println("booking.getId()" + booking.getId());
            BookingHistory currentHistory = ResponseUtils.convertBookingHistory(booking, "Previous");
            response.add(currentHistory);
        }

        for (Booking booking : currentBookings) {
            System.out.println("currentBookings booking.getId()" + booking.getId());
            BookingHistory currentHistory = ResponseUtils.convertBookingHistory(booking, "Current");
            response.add(currentHistory);
        }
        System.out.println(response.size());
        return response;
    }

    public List<BookingHistory> upcomingBooking(int userId) {
        User user = userRepository.findByUserId(userId);
        if (user == null) {
            throw new ApiRequestException("User not available");
        }

        LocalDate currentDate = LocalDate.now();

        List<Booking> upcomingBookings = bookRepository.findUpcomingBookingsByUser(currentDate, user);

        List<BookingHistory> response = new ArrayList<>();
        for (Booking booking : upcomingBookings) {
            BookingHistory currentHistory = ResponseUtils.convertBookingHistory(booking, "Upcoming");
            response.add(currentHistory);
        }
        return response;
    }

    public MessageResponse cancelBooking(int userId, CancelBookingRequest request) {
        User user = userRepository.findByUserId(userId);
        if (user == null) {
            throw new ApiRequestException("User not available");
        }
        Booking booking = bookRepository.findById(request.getBookingId()).get();

        if (booking.getUser().getUserId() != userId) {
            throw new ApiRequestException("You are not authorized to cancel booking");
        }

        CancelledBooking cancelledBooking = CancelledBooking.builder().property(booking.getProperty())
                .amount(booking.getAmount())
                .checkInDate(booking.getCheckInDate()).checkOutDate(booking.getCheckOutDate())
                .noOfGuests(booking.getNoOfGuests()).noOfChildren(booking.getNoOfChildren()).user(user)
                .totalAmount(booking.getTotalAmount())
                .tax(booking.getTax()).reason(request.getReason()).build();

        CancelledBookingRepository.save(cancelledBooking);
        bookRepository.deleteById(request.getBookingId());

        return MessageResponse.builder().message("Booking cancelled").success(true)
                .build();
    }

    public MessageResponse declineBooking(int userId, CancelBookingRequest request) {
        User user = userRepository.findByUserId(userId);
        if (user == null) {
            throw new ApiRequestException("User not available");
        }
        Booking booking = bookRepository.findById(request.getBookingId()).get();

        if (booking.getProperty().getCreatedBy().getUserId() != userId) {
            throw new ApiRequestException("You are not authorized to Decline booking");
        }
        booking.setDeclineReason(request.getReason());
        booking.setStatus(BookingStatus.DECLINE);
        bookRepository.save(booking);

        return MessageResponse.builder().message("Booking Declined").success(true)
                .build();
    }

    public String createPaymentIntent(int userId, NewBookingRequest request) {
        try {
            String successURL = APIendpoint + "/booking/new?property_id=" + request.getProperty_id()
                    + "&user_id=" + userId
                    + "&checkInDate=" + request.getCheckInDate()
                    + "&checkOutDate=" + request.getCheckOutDate()
                    + "&amount=" + request.getAmount()
                    + "&totalAmount=" + request.getTotalAmount()
                    + "&noOfGuests=" + request.getNoOfGuests()
                    + "&noOfChildren=" + request.getNoOfChildren()
                    + "&tax=" + request.getTax();

            System.out.println("successURL" + successURL);

            String failureURL = frontendEndpoint + "/payment/fail";

            Stripe.apiKey = stripeAPI;

            BigDecimal amount = request.getTotalAmount();
            String amountString = amount.toPlainString();
            int intAmount = Integer.parseInt(amountString.split("\\.")[0]);

            SessionCreateParams params = SessionCreateParams.builder()
                    .addPaymentMethodType(SessionCreateParams.PaymentMethodType.CARD)
                    .setMode(SessionCreateParams.Mode.PAYMENT)
                    .setCancelUrl(failureURL)
                    .setSuccessUrl(successURL)
                    .addLineItem(SessionCreateParams.LineItem.builder()
                            .setQuantity(1L)
                            .setPriceData(
                                    SessionCreateParams.LineItem.PriceData.builder()
                                            .setCurrency("cad")
                                            .setUnitAmount((long) intAmount * 100)
                                            .setProductData(
                                                    SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                            .setName("Stayease Payment")
                                                            .build())
                                            .build())
                            .build())
                    .build();

            Session s = Session.create(params);
            return s.getId();
        } catch (Exception e) {
            throw new ApiRequestException(e.getMessage());
        }
    }
}
