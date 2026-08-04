package com.example.lifeloopbackend.service;

import com.example.lifeloopbackend.entity.Event;
import com.example.lifeloopbackend.entity.User;
import com.example.lifeloopbackend.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class EventReminderScheduler {

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private EmailService emailService;

    @Value("${lifeloop.reminder.minutes-before:5}")
    private int minutesBefore;


    @Scheduled(fixedRate = 60000)
    public void sendDueReminders() {

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime windowEnd = now.plusMinutes(minutesBefore);

        List<Event> upcoming = eventRepository
                .findByNotifiedFalseAndEventDateTimeBetween(now, windowEnd);

        for (Event event : upcoming) {

            User user = event.getUser();

            if (user == null || user.getEmail() == null || user.getEmail().isBlank()) {
                continue;
            }

            try {
                emailService.sendEventReminder(user.getEmail(), event);
                event.setNotified(true);
                eventRepository.save(event);
            } catch (Exception e) {

                System.err.println("Failed to send reminder for event "
                        + event.getId() + ": " + e.getMessage());
            }
        }
    }
}
