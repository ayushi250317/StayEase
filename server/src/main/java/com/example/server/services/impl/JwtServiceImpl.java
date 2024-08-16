package com.example.server.services.impl;

import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import com.example.server.entities.User;
import com.example.server.services.JwtService;

import org.springframework.stereotype.Service;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import java.security.Key;

@Service
public class JwtServiceImpl implements JwtService {

    private static final String SECRET_KEY = "e6cbbccd3c26a59bba8ee0f77e560f6be857b1093d734f4627ede0b367c1f8c1";

    /**
     * Extracts the user ID from the provided JWT token.
     */
    public Integer extractUserId(String token) {
        return Integer.parseInt(extractClaim(token, Claims::getSubject));
    }

    /**
     * Generates a JWT token for the given user.
     */
    public String generateToken(User user) {
        return generateToken(new HashMap<>(), user);
    }

    /**
     * Generates a JWT token with extra claims for the given user.
     */
    public String generateToken(Map<String, Object> extraClaims,
            User user) {
        return Jwts
                .builder().setClaims(extraClaims)
                .setSubject(user.getUserId().toString())
                .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    /**
     * Extracts all claims from the provided JWT token.
     */
    private Claims extractAllClaims(String token) {
        return Jwts
                .parserBuilder()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    /**
     * Extracts a specific claim from the provided JWT token.
     */
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    /**
     * Checks if the provided JWT token is valid for the given user.
     */
    public boolean isTokenValid(String token, User user) {
        final Integer userId = extractUserId(token);
        return userId.equals(user.getUserId());
    }

    /**
     * Retrieves the signing key for JWT token generation and validation.
     */
    private Key getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(keyBytes);
    }

}
