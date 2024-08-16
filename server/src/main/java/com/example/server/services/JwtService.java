package com.example.server.services;

import java.util.Map;

import com.example.server.entities.User;

public interface JwtService {
    Integer extractUserId(String token);

    String generateToken(User user);

    String generateToken(Map<String, Object> extraClaims, User user);

    boolean isTokenValid(String token, User user);

}
