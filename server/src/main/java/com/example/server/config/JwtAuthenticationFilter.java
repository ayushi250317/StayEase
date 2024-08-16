package com.example.server.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.util.Collection;
import io.micrometer.common.lang.NonNull;
import com.example.server.entities.User;
import com.example.server.repositories.UserRepository;
import com.example.server.security.UserSecurity;
import com.example.server.services.JwtService;
import com.example.server.services.impl.JwtServiceImpl;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import java.io.IOException;

@Component
@AllArgsConstructor
@NoArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtServiceImpl jwtService;
    @Autowired
    private UserRepository userRepository;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain)
            throws ServletException, IOException {
        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final Integer userId;
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }
        jwt = authHeader.substring(7);
        userId = jwtService.extractUserId(jwt);
        if (userId != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            User user = userRepository.findByUserId(userId);
            UserSecurity userSecurity = new UserSecurity(user);
            String email = user.getEmail();
            Collection<? extends GrantedAuthority> authorities = userSecurity.getAuthorities();
            if (jwtService.isTokenValid(jwt, user)) {
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(email, null,
                        authorities);
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }
        filterChain.doFilter(request, response);

    }
}
