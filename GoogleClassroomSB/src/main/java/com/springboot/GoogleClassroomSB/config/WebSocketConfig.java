package com.springboot.GoogleClassroomSB.config;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

import com.springboot.GoogleClassroomSB.security.WebSocketAuthInterceptor;


@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
	
	@Autowired
	private WebSocketAuthInterceptor wsInterceptor;

	@Override
	public void configureMessageBroker(MessageBrokerRegistry config) {
		// Enable simple broker for destinations prefixed with /topic or /queue
		config.enableSimpleBroker("/topic", "/queue");
		// Prefix for messages from client to server (controller)
		config.setApplicationDestinationPrefixes("/app");
	}

	@Override
	public void registerStompEndpoints(StompEndpointRegistry registry) {
		// This is the WebSocket handshake endpoint
		registry.addEndpoint("/ws-chat")
				.addInterceptors(wsInterceptor)
				.setAllowedOriginPatterns("*")
				.withSockJS();
	}

}
