package com.example.server.repositories;

import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.server.entities.CancelledBooking;

@Repository
public interface CancelledBookingRepository extends JpaRepository<CancelledBooking, Integer> {

}
