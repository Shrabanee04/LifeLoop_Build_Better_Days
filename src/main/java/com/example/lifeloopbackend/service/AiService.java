package com.example.lifeloopbackend.service;

import com.example.lifeloopbackend.dto.AiRequest;
import com.example.lifeloopbackend.dto.AiResponse;
import com.example.lifeloopbackend.entity.*;
import com.example.lifeloopbackend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AiService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private JournalRepository journalRepository;

    @Autowired
    private MoodRepository moodRepository;

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private GeminiService geminiService;

    public AiResponse chat(AiRequest request) {

        String userMessage = request.getMessage();
        Long userId = request.getUserId();

        String context = buildContext(userId);

        String prompt = """
                You are LifeLoop's friendly in-app assistant. LifeLoop is a personal
                journaling app where the user tracks tasks, calendar events, journal
                entries, moods, and expenses. Answer naturally and conversationally,
                like a helpful companion — not like a robot reading out a database.
                Keep replies fairly short (a few sentences) unless the user asks for
                something detailed. If the user asks about their own data (tasks,
                mood, spending, etc.), use the snapshot below to answer accurately.
                If something isn't in the snapshot, say you don't have that
                information rather than guessing.

                Here is a snapshot of the user's current data:
                %s

                The user just said:
                "%s"

                Reply directly to the user now.
                """.formatted(context, userMessage);

        String reply = geminiService.generateReply(prompt);

        return new AiResponse(reply);
    }


    private String buildContext(Long userId) {

        if (userId == null) {
            return "No user is logged in, so no personal data is available.";
        }

        User user = userRepository.findById(userId).orElse(null);
        String name = user != null ? user.getName() : "the user";

        List<Task> tasks = taskRepository.findByUserId(userId);
        List<Event> events = eventRepository.findByUserId(userId);
        List<Journal> journals = journalRepository.findByUserId(userId);
        List<Mood> moods = moodRepository.findByUserId(userId);
        List<Expense> expenses = expenseRepository.findByUserId(userId);

        long completedTasks = tasks.stream()
                .filter(t -> "Completed".equalsIgnoreCase(t.getStatus()))
                .count();

        double totalSpend = expenses.stream()
                .filter(e -> "Expense".equalsIgnoreCase(e.getType()))
                .mapToDouble(Expense::getAmount)
                .sum();

        String latestMood = moods.isEmpty()
                ? "no mood logged yet"
                : moods.get(moods.size() - 1).getMood();

        StringBuilder sb = new StringBuilder();
        sb.append("User's name: ").append(name).append("\n");
        sb.append("Total tasks: ").append(tasks.size())
                .append(" (").append(completedTasks).append(" completed)\n");
        sb.append("Total calendar events: ").append(events.size()).append("\n");
        sb.append("Total journal entries: ").append(journals.size()).append("\n");
        sb.append("Total mood logs: ").append(moods.size())
                .append(" (most recent: ").append(latestMood).append(")\n");
        sb.append("Total expenses logged: ").append(expenses.size())
                .append(" (total spent: Rs. ").append(String.format("%.2f", totalSpend)).append(")\n");

        return sb.toString();
    }
}
