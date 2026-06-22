package com.example.lifeloopbackend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.io.File;


@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${lifeloop.upload.dir:uploads/journal}")
    private String uploadDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {

        String absolutePath = new File(uploadDir).getAbsolutePath();

        registry.addResourceHandler("/uploads/journal/**")
                .addResourceLocations("file:" + absolutePath + File.separator);
    }
}
