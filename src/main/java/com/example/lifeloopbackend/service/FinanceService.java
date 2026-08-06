package com.example.lifeloopbackend.service;

import com.example.lifeloopbackend.dto.*;
import com.example.lifeloopbackend.entity.Expense;
import com.example.lifeloopbackend.entity.User;
import com.example.lifeloopbackend.repository.ExpenseRepository;
import com.example.lifeloopbackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FinanceService {

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private UserRepository userRepository;

    public ExpenseResponse addExpense(
            ExpenseRequest request){

        Expense expense = new Expense();

        expense.setTitle(request.getTitle());
        expense.setAmount(request.getAmount());
        expense.setType(request.getType());
        expense.setCategory(request.getCategory());
        expense.setDate(request.getDate());

        if (request.getUserId() != null) {
            User user = userRepository.findById(request.getUserId()).orElse(null);
            expense.setUser(user);
        }

        expenseRepository.save(expense);

        return new ExpenseResponse(
                "Expense Added Successfully!"
        );
    }

    public List<Expense> getAllExpenses(Long userId){

        if (userId != null) {
            return expenseRepository.findByUserId(userId);
        }
        return expenseRepository.findAll();
    }
}
