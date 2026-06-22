package com.example.lifeloopbackend.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/upload")
public class FileUploadController {

    @Value("${lifeloop.upload.dir:uploads/journal}")
    private String uploadDir;


    @PostMapping("/image")
    public ResponseEntity<Map<String, String>> uploadImage(
            @RequestParam("file") MultipartFile file) {

        Map<String, String> response = new HashMap<>();

        if (file.isEmpty()) {
            response.put("error", "No file was sent.");
            return ResponseEntity.badRequest().body(response);
        }

        try {
            Path dirPath = Paths.get(uploadDir);
            if (!Files.exists(dirPath)) {
                Files.createDirectories(dirPath);
            }

            String originalName = file.getOriginalFilename();
            String extension = "";
            if (originalName != null && originalName.contains(".")) {
                extension = originalName.substring(originalName.lastIndexOf("."));
            }

            String storedName = UUID.randomUUID() + extension;
            Path destination = dirPath.resolve(storedName);

            file.transferTo(destination);

            // Matches the static resource mapping registered in WebConfig:

            String url = "/uploads/journal/" + storedName;

            response.put("imageUrl", url);
            return ResponseEntity.ok(response);

        } catch (IOException e) {
            response.put("error", "Could not save file: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
