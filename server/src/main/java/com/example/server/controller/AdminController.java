package com.example.server.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.server.dto.request.PropertyAddRequest;
import com.example.server.dto.response.AddPropertyResponse;
import com.example.server.dto.response.AdminResponse;
import com.example.server.services.AdminService;
import com.example.server.services.JwtService;

import lombok.RequiredArgsConstructor;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
public class AdminController {
    private final JwtService jwtService;
    private final AdminService adminService;

    @GetMapping("/adminData")
    @CrossOrigin(origins = "*")
    public ResponseEntity<AdminResponse> listAllUsers(@RequestHeader("Authorization") String jwtToken) {
        Integer userId = jwtService.extractUserId(jwtToken.substring(7));
        AdminResponse response=adminService.getAdminData(userId);
        return ResponseEntity.ok(response);
    }
}
