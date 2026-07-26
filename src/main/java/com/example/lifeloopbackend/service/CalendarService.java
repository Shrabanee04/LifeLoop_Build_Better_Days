package com.example.lifeloopbackend.service;

import com.example.lifeloopbackend.dto.EventRequest;
import com.example.lifeloopbackend.dto.EventResponse;
import com.example.lifeloopbackend.entity.Event;
import com.example.lifeloopbackend.entity.User;
import com.example.lifeloopbackend.repository.EventRepository;
import com.example.lifeloopbackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CalendarService {

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private UserRepository userRepository;

    public EventResponse addEvent(EventRequest request) {

        Event event = new Event();

        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setEventDateTime(request.getEventDateTime());
        event.setType(request.getType());
        event.setNotified(false);

        if (request.getUserId() != null) {
            User user = userRepository.findById(request.getUserId()).orElse(null);
            event.setUser(user);
        }

        eventRepository.save(event);

        return new EventResponse("Event Added Successfully!");
    }

    public List<Event> getAllEvents(Long userId) {
        if (userId != null) {
            return eventRepository.findByUserId(userId);
        }
        return eventRepository.findAll();
    }
}
