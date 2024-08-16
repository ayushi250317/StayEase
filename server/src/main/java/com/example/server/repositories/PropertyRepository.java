package com.example.server.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

import com.example.server.entities.Property;
import com.example.server.entities.User;

@Repository
public interface PropertyRepository extends JpaRepository<Property, Integer> {
    Property findByPropertyId(Integer id);

    List<Property> findByCreatedBy(User createdBy);
}
