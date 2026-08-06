package com.example.lifeloopbackend.service;

import com.example.lifeloopbackend.dto.JournalRequest;
import com.example.lifeloopbackend.dto.JournalResponse;
import com.example.lifeloopbackend.entity.Journal;
import com.example.lifeloopbackend.entity.User;
import com.example.lifeloopbackend.repository.JournalRepository;
import com.example.lifeloopbackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class JournalService {

    @Autowired
    private JournalRepository journalRepository;

    @Autowired
    private UserRepository userRepository;

    public JournalResponse addJournal(JournalRequest request){

        Journal journal = new Journal();

        journal.setTitle(request.getTitle());
        journal.setContent(request.getContent());
        journal.setDate(request.getDate());
        journal.setMood(request.getMood());
        journal.setTheme(request.getTheme());
        journal.setImageUrl(request.getImageUrl());

        if (request.getUserId() != null) {
            User user = userRepository.findById(request.getUserId()).orElse(null);
            journal.setUser(user);
        }

        journalRepository.save(journal);

        return new JournalResponse(
                "Journal Added Successfully!"
        );
    }

    public List<Journal> getAllJournals(Long userId){

        if (userId != null) {
            return journalRepository.findByUserId(userId);
        }
        return journalRepository.findAll();
    }
}
