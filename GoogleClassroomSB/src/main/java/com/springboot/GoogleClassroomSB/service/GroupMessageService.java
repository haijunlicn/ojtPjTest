package com.springboot.GoogleClassroomSB.service;

import com.springboot.GoogleClassroomSB.dto.GroupchatDTO;
import com.springboot.GoogleClassroomSB.dto.MessageDTO;
import com.springboot.GoogleClassroomSB.entity.GroupMessageEntity;
import com.springboot.GoogleClassroomSB.entity.GroupchatEntity;
import com.springboot.GoogleClassroomSB.entity.MessageAttachmentEntity;
import com.springboot.GoogleClassroomSB.entity.UserEntity;
import com.springboot.GoogleClassroomSB.entity.UserGroupEntity;
import com.springboot.GoogleClassroomSB.repository.GroupMessageRepository;
import com.springboot.GoogleClassroomSB.repository.GroupchatRepository;
import com.springboot.GoogleClassroomSB.repository.UserGroupRepository;
import com.springboot.GoogleClassroomSB.repository.UserRepository;
import com.springboot.GoogleClassroomSB.security.JWTUtil;

import lombok.RequiredArgsConstructor;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class GroupMessageService {

	@Autowired
    private GroupMessageRepository messageRepo;

    @Autowired
    private GroupchatRepository groupRepo;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private JWTUtil jwtUtil;

	@Autowired
	private ModelMapper mapper;

    public List<MessageDTO> getMessagesForGroup(Long groupId) {
		List<GroupMessageEntity> msgList = messageRepo.findByGroupIdOrderByTimestampAsc(groupId);
		return msgList.stream().map(msg -> mapper.map(msg, MessageDTO.class)).toList();
    }

    public GroupMessageEntity sendMessage(MessageDTO dto, String jwtToken) {
        String email = jwtUtil.extractUsername(jwtToken);
        UserEntity sender = userRepo.findByEmail(email);
        GroupchatEntity group = groupRepo.findById(dto.getGroupId())
            .orElseThrow(() -> new RuntimeException("Group not found"));

        GroupMessageEntity message = new GroupMessageEntity();
        message.setContent(dto.getContent());
        message.setTimestamp(LocalDateTime.now());
        message.setSender(sender);
        message.setGroup(group);

        return messageRepo.save(message);
    }
    
    public MessageDTO sendMessageViaWebSocket(MessageDTO dto) {
    	System.out.println("hello. it reaches service 111");
    	System.out.println("group Id : " );
    	
        // Fetch related entities
        UserEntity sender = userRepo.findByEmail(dto.getSender().getEmail());
        GroupchatEntity group = groupRepo.findById(dto.getGroupId())
                .orElseThrow(() -> new RuntimeException("Group not found"));
        
        System.out.println("group found");

        // Create entity and populate fields
        GroupMessageEntity message = new GroupMessageEntity();
        message.setSender(sender);
        message.setGroup(group);
        message.setContent(dto.getContent());
        message.setTimestamp(LocalDateTime.now());
        GroupMessageEntity savedMessage = messageRepo.save(message);

        System.out.println("saved in service and about to return");
        
        // Map to DTO and return
        return mapper.map(savedMessage, MessageDTO.class);
    }

    @Transactional
    public MessageDTO sendMessageWithAttachments(MessageDTO dto
    		// , String jwtToken
    		) {
        // String email = jwtUtil.extractUsername(jwtToken);
    	String email = dto.getSender().getEmail();
        UserEntity sender = userRepo.findByEmail(email);
        GroupchatEntity group = groupRepo.findById(dto.getGroupId())
                .orElseThrow(() -> new RuntimeException("Group not found"));

        GroupMessageEntity message = new GroupMessageEntity();
        message.setContent(dto.getContent());
        message.setTimestamp(LocalDateTime.now());
        message.setSender(sender);
        message.setGroup(group);

        if (dto.getAttachments() != null && !dto.getAttachments().isEmpty()) {
            List<MessageAttachmentEntity> attachments = dto.getAttachments().stream().map(attDto -> {
                MessageAttachmentEntity attachment = new MessageAttachmentEntity();
                attachment.setFileUrl(attDto.getFileUrl());
                attachment.setFileName(attDto.getFileName());
                attachment.setFileType(attDto.getFileType());
                attachment.setFileSize(attDto.getFileSize());
                attachment.setThumbnailUrl(attDto.getThumbnailUrl());
                attachment.setMessage(message);
                return attachment;
            }).toList();
            message.setAttachments(attachments);
            System.out.println("dto attachments : " + dto.getAttachments());
        }

        GroupMessageEntity saved = messageRepo.save(message);
        return mapper.map(saved, MessageDTO.class);
    }
    
}

