package com.example.chat.handler;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;
import reactor.core.publisher.Mono;

@Component
public class IndexHandler {

    private final ResourceLoader resourceLoader;

    @Autowired
    public IndexHandler(ResourceLoader resourceLoader) {
        this.resourceLoader = resourceLoader;
    }

    public Mono<ServerResponse> index(ServerRequest serverRequest) {
        Resource indexHTML = resourceLoader.getResource("classpath:/index.html");
        return ServerResponse.ok().contentType(MediaType.TEXT_HTML).bodyValue(indexHTML);
    }
}
