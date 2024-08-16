package com.example.server.repositories;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.server.entities.Booking;
import com.example.server.entities.Property;
import com.example.server.entities.User;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Integer> {

    List<Booking> findByUser(User user);

    @Query("SELECT b FROM Booking b WHERE b.checkOutDate < :currentDate AND b.user = :user")
    List<Booking> findPreviousBookingsByUser(@Param("currentDate") LocalDate currentDate, @Param("user") User user);

    @Query("SELECT b FROM Booking b WHERE :currentDate BETWEEN b.checkInDate AND b.checkOutDate AND b.user = :user")
    List<Booking> findCurrentBookingsByUser(@Param("currentDate") LocalDate currentDate, @Param("user") User user);

    @Query("SELECT b FROM Booking b WHERE b.checkInDate > :currentDate AND b.user = :user")
    List<Booking> findUpcomingBookingsByUser(@Param("currentDate") LocalDate currentDate, @Param("user") User user);

    @Query("SELECT b FROM Booking b WHERE b.checkInDate BETWEEN :startDate AND :endDate")
    List<Booking> findBookingsForUpcomingMonth(@Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

    List<Booking> findByPropertyIn(List<Property> properties);

}
