package com.springboot.GoogleClassroomSB.config;

import org.modelmapper.ModelMapper;
import org.modelmapper.TypeMap;
import org.modelmapper.config.Configuration.AccessLevel;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import com.springboot.GoogleClassroomSB.dto.AttachmentDTO;
import com.springboot.GoogleClassroomSB.dto.MessageDTO;
import com.springboot.GoogleClassroomSB.entity.GroupMessageEntity;
import com.springboot.GoogleClassroomSB.entity.MessageAttachmentEntity;

@Configuration
public class WebConfig implements WebMvcConfigurer {

//	@Bean
//	public ModelMapper mapper() {
//		return new ModelMapper();
//	}

	@Bean
	public ModelMapper mapper() {
		ModelMapper modelMapper = new ModelMapper();
		modelMapper.getConfiguration().setFieldMatchingEnabled(true).setFieldAccessLevel(AccessLevel.PRIVATE);

		// Create TypeMap for GroupMessageEntity -> MessageDTO
		TypeMap<GroupMessageEntity, MessageDTO> messageTypeMap = modelMapper.createTypeMap(GroupMessageEntity.class,
				MessageDTO.class);

		// Map group ID (flatten)
		messageTypeMap.addMappings(mapper -> {
			mapper.map(src -> src.getGroup().getId(), MessageDTO::setGroupId);
			// Map sender's nested fields explicitly instead of whole sender object
			mapper.map(src -> src.getSender().getId(), (dest, v) -> dest.getSender().setId((Long) v));
			mapper.map(src -> src.getSender().getEmail(), (dest, v) -> dest.getSender().setEmail((String) v));
			mapper.map(src -> src.getSender().getName(), (dest, v) -> dest.getSender().setName((String) v));
		});

		// Create TypeMap for MessageAttachmentEntity -> AttachmentDTO (default mapping)
		modelMapper.createTypeMap(MessageAttachmentEntity.class, AttachmentDTO.class);

		return modelMapper;
	}

	@Override
	public void addCorsMappings(CorsRegistry registry) {
		registry.addMapping("/**").allowedOrigins("http://localhost:4200") // Allow frontend to access backend
				.allowedMethods("GET", "POST", "PUT", "DELETE") // Allow methods
				.allowedHeaders("*") // Allow all headers
				.allowCredentials(true); // Allow credentials (cookies, etc.)
	}

}
