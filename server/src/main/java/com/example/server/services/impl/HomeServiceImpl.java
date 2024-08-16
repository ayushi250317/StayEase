package com.example.server.services.impl;

import org.springframework.stereotype.Service;

import com.example.server.dto.response.HomeResponse;
import com.example.server.services.HomeService;

@Service
public class HomeServiceImpl implements HomeService {

    @Override
    public HomeResponse getHomeMeta() {
        HomeResponse homeResponse = new HomeResponse();
        homeResponse.setMessage("Success");
        return homeResponse;
    }
}
