package com.example.lifeloopbackend.service;

import com.example.lifeloopbackend.entity.*;
import com.example.lifeloopbackend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class WeeklyReportService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private MoodRepository moodRepository;

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private JournalRepository journalRepository;

    @Autowired
    private EventRepository eventRepository;

    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ISO_LOCAL_DATE;

    /**
     * Builds a plain-text weekly summary for one user, covering the last 7 days
     * (today minus 6 days, through today). Dates on Task/Mood/Expense/Journal are
     * stored as plain strings (e.g. "2026-06-20"), so we compare them as strings
     * against an ISO-formatted window — this works as long as the frontend always
     * sends dates in yyyy-MM-dd format, which the <input type="date"> fields do.
     */
    public String buildReport(User user) {

        LocalDate today = LocalDate.now();
        LocalDate weekAgo = today.minusDays(6);

        List<String> validDates = weekAgo.datesUntil(today.plusDays(1))
                .map(d -> d.format(DATE_FORMAT))
                .collect(Collectors.toList());

        List<Task> tasks = taskRepository.findByUserId(user.getId());
        List<Mood> moods = moodRepository.findByUserId(user.getId());
        List<Expense> expenses = expenseRepository.findByUserId(user.getId());
        List<Journal> journals = journalRepository.findByUserId(user.getId());

        List<Task> weekTasks = tasks.stream()
                .filter(t -> t.getDeadline() != null && validDates.contains(t.getDeadline()))
                .collect(Collectors.toList());

        List<Mood> weekMoods = moods.stream()
                .filter(m -> m.getDate() != null && validDates.contains(m.getDate()))
                .collect(Collectors.toList());

        List<Expense> weekExpenses = expenses.stream()
                .filter(e -> e.getDate() != null && validDates.contains(e.getDate()))
                .collect(Collectors.toList());

        List<Journal> weekJournals = journals.stream()
                .filter(j -> j.getDate() != null && validDates.contains(j.getDate()))
                .collect(Collectors.toList());

        long completedCount = weekTasks.stream()
                .filter(t -> "Completed".equalsIgnoreCase(t.getStatus()))
                .count();

        double totalSpend = weekExpenses.stream()
                .filter(e -> "Expense".equalsIgnoreCase(e.getType()))
                .mapToDouble(Expense::getAmount)
                .sum();

        double totalIncome = weekExpenses.stream()
                .filter(e -> "Income".equalsIgnoreCase(e.getType()))
                .mapToDouble(Expense::getAmount)
                .sum();

        Map<String, Double> spendByCategory = weekExpenses.stream()
                .filter(e -> "Expense".equalsIgnoreCase(e.getType()))
                .collect(Collectors.groupingBy(
                        e -> e.getCategory() == null ? "Uncategorized" : e.getCategory(),
                        Collectors.summingDouble(Expense::getAmount)
                ));

        Map<String, Long> moodCounts = weekMoods.stream()
                .collect(Collectors.groupingBy(Mood::getMood, Collectors.counting()));

        String topMood = moodCounts.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse("No moods logged");

        StringBuilder sb = new StringBuilder();

        sb.append("Hi ").append(user.getName()).append(",\n\n");
        sb.append("Here's your LifeLoop weekly recap for ")
                .append(weekAgo.format(DATE_FORMAT)).append(" to ")
                .append(today.format(DATE_FORMAT)).append(":\n\n");

        sb.append("TASKS\n");
        sb.append("-----\n");
        sb.append("Due this week: ").append(weekTasks.size()).append("\n");
        sb.append("Completed: ").append(completedCount).append("\n\n");

        sb.append("MOOD\n");
        sb.append("----\n");
        if (weekMoods.isEmpty()) {
            sb.append("No moods logged this week.\n\n");
        } else {
            sb.append("Entries logged: ").append(weekMoods.size()).append("\n");
            sb.append("Most frequent mood: ").append(topMood).append("\n\n");
        }

        sb.append("FINANCE\n");
        sb.append("-------\n");
        sb.append("Total spent: Rs. ").append(String.format("%.2f", totalSpend)).append("\n");
        sb.append("Total income: Rs. ").append(String.format("%.2f", totalIncome)).append("\n");
        if (!spendByCategory.isEmpty()) {
            sb.append("By category:\n");
            spendByCategory.forEach((cat, amt) ->
                    sb.append("  - ").append(cat).append(": Rs. ")
                            .append(String.format("%.2f", amt)).append("\n"));
        }
        sb.append("\n");

        sb.append("JOURNAL\n");
        sb.append("-------\n");
        sb.append("Entries written: ").append(weekJournals.size()).append("\n\n");

        sb.append("Keep going — see you next week!\n");
        sb.append("— LifeLoop");

        return sb.toString();
    }
}
