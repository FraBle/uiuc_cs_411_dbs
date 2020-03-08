package edu.uiuc.cs411.project.nba.stats.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig {

    public static final String EVERYTHING = "/**";
    public static final String LOCALHOST = "http://localhost:9000";

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping(EVERYTHING).allowedOrigins(LOCALHOST);
            }
        };
    }

}
