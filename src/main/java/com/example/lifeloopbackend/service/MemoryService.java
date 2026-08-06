package com.example.lifeloopbackend.service;

import com.example.lifeloopbackend.dto.*;
import com.example.lifeloopbackend.repository.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class MemoryService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private JournalRepository journalRepository;

    @Autowired
    private MoodRepository moodRepository;

    public MemoryResponse recall(
            MemoryRequest request){

        String answer =
                "Memory Summary:\n" +

                        "Tasks: "
                        + taskRepository.count()

                        + "\nEvents: "
                        + eventRepository.count()

                        + "\nJournals: "
                        + journalRepository.count()

                        + "\nMood Logs: "
                        + moodRepository.count();

        return new MemoryResponse(answer);
    }
}

