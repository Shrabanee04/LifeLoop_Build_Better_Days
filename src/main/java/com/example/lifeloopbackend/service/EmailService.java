package com.example.lifeloopbackend.service;

import com.example.lifeloopbackend.entity.Event;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    private static final DateTimeFormatter DISPLAY_FORMAT =
            DateTimeFormatter.ofPattern("EEEE, MMM d 'at' h:mm a");

    public void sendEventReminder(String toEmail, Event event) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(toEmail);
        message.setSubject("Reminder: " + event.getTitle() + " starts soon");
        message.setText(buildReminderBody(event));

        mailSender.send(message);
    }


    public void sendWeeklyReport(String toEmail, String reportBody) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(toEmail);
        message.setSubject("Your LifeLoop Weekly Recap");
        message.setText(reportBody);

        mailSender.send(message);
    }

    private String buildReminderBody(Event event) {

        String when = event.getEventDateTime() != null
                ? event.getEventDateTime().format(DISPLAY_FORMAT)
                : "soon";

        StringBuilder body = new StringBuilder();

        body.append("Hi,\n\n");
        body.append("Just a heads up — your event \"").append(event.getTitle())
                .append("\" starts at ").append(when).append(".\n");

        if (event.getDescription() != null && !event.getDescription().isBlank()) {
            body.append("\nDetails: ").append(event.getDescription()).append("\n");
        }

        body.append("\n— LifeLoop");

        return body.toString();
    }
}
