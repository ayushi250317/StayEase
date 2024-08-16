package com.example.server.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.server.dto.response.HomeResponse;
import com.example.server.services.HomeService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/home")
@RequiredArgsConstructor
public class HomeController {
    private final HomeService homeService;

    @GetMapping("/")
    public ResponseEntity<HomeResponse> getHomeMeta() {
        HomeResponse homeMeta = homeService.getHomeMeta();
        return ResponseEntity.ok(homeMeta);
    }
}
