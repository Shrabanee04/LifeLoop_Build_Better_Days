package com.example.lifeloopbackend.dto;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class EventRequest {

    private String title;

    private String description;

    private LocalDateTime eventDateTime;

    private String type;
    private Long userId;
}
