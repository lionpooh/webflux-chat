package com.example.chat.handler;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.socket.WebSocketHandler;
import org.springframework.web.reactive.socket.WebSocketSession;
import org.springframework.web.reactive.socket.server.support.WebSocketHandlerAdapter;
import reactor.core.publisher.Mono;
import reactor.core.publisher.Sinks;

import java.util.List;

@Slf4j
@Component
public class ChatWebsocketHandler implements WebSocketHandler {

    private final Sinks.Many<String> chatHistory = Sinks.many().replay().limit(1000);

    @Override
    public List<String> getSubProtocols() {
        return WebSocketHandler.super.getSubProtocols();
    }

    @Override
    public Mono<Void> handle(WebSocketSession session) {

       return session.receive()
                .map(message -> message.getPayloadAsText())
                .doOnNext(text -> {
                    chatHistory.tryEmitNext(text);
                })
                .doOnComplete(() -> {
                    log.info("session close");
                })
               .zipWith(session.send(chatHistory.asFlux().map(session::textMessage)))
               .then();

    }

    @Bean
    public WebSocketHandlerAdapter handlerAdapter() {
        return new WebSocketHandlerAdapter();
    }

}
