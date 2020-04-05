package edu.uiuc.cs411.project.nba.stats.config;

import java.util.List;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig {

    private static final String EVERYTHING = "/**";
    private static final List<String> HOSTS = List.of("http://localhost:9000", "https://cs411.frable.in");

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                String[] origins = new String[HOSTS.size()];
                registry.addMapping(EVERYTHING).allowedOrigins(HOSTS.toArray(origins));
            }
        };
    }

}
