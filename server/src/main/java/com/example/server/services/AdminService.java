package com.example.server.services;

import com.example.server.dto.response.AdminResponse;


public interface AdminService {
    // AdminResponse getUserCount(Integer userId);

    // AdminResponse getPropertyCount(Integer userId);

    AdminResponse getAdminData(Integer userId);
}
