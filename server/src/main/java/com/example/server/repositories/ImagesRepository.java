package com.example.server.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.server.entities.Images;

@Repository
public interface ImagesRepository extends JpaRepository<Images, Integer> {
    void deleteById(int id);
}
