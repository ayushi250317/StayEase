package com.example.server.services.impl;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.example.server.services.EmailService;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class EmailServiceImpl implements EmailService {
    private final JavaMailSender mailSender;

    @Override
    public void sendEmail(String to, String subject, String body) {

        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper messageHelper = new MimeMessageHelper(mimeMessage, "UTF-8");

            messageHelper.setTo(to);
            messageHelper.setSubject(subject);

            messageHelper.setText(body, true);
            mailSender.send(mimeMessage);

        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }
}
