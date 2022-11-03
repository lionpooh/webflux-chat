package com.example.chat.router;

import com.example.chat.handler.IndexHandler;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.MediaType;
import org.springframework.web.reactive.function.server.RouterFunction;
import org.springframework.web.reactive.function.server.RouterFunctions;
import org.springframework.web.reactive.function.server.ServerResponse;

import static org.springframework.web.reactive.function.server.RequestPredicates.GET;
import static org.springframework.web.reactive.function.server.RequestPredicates.accept;

@Configuration
public class ViewRouter {

    @Bean
    public RouterFunction<ServerResponse> indexRouter(IndexHandler indexHandler) {
        return RouterFunctions
                .route(GET("/").or(GET("/index")).or(GET("/index.html").and(accept(MediaType.TEXT_HTML))),
                indexHandler::index);
    }

    @Bean
    public RouterFunction<ServerResponse> jsRouter() {
        return RouterFunctions
                .resources("/js/**", new ClassPathResource("js/"));
    }

}
