package com.example.server.services;

public interface EmailService {
    void sendEmail(String to, String subject, String body);
}
