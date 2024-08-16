package com.example.server.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.server.entities.Property;
import com.example.server.entities.Review;
import com.example.server.entities.User;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Integer> {

    Optional<Review> findByUserAndProperty(User user, Property property);

    List<Review> findByProperty(Property property);
}
