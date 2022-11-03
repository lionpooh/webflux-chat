package com.example.chat.config;

import com.example.chat.handler.ChatWebsocketHandler;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.HandlerMapping;
import org.springframework.web.reactive.handler.SimpleUrlHandlerMapping;

import java.util.Collections;

@Configuration
public class WebSocketConfig {

    @Bean
    public HandlerMapping handlerMapping(ChatWebsocketHandler chatWebsocketHandler) {
        return new SimpleUrlHandlerMapping(Collections.singletonMap("/topic", chatWebsocketHandler), -1);
    }

}
