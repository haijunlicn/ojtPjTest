package com.springboot.GoogleClassroomSB.controller;

import com.springboot.GoogleClassroomSB.dto.GroupchatDTO;
import com.springboot.GoogleClassroomSB.dto.MessageDTO;
import com.springboot.GoogleClassroomSB.dto.MessageSeenDTO;
import com.springboot.GoogleClassroomSB.dto.SeenNotificationDTO;
import com.springboot.GoogleClassroomSB.dto.TypingStatusDTO;
import com.springboot.GoogleClassroomSB.dto.UserDTO;
import com.springboot.GoogleClassroomSB.entity.GroupMessageEntity;
import com.springboot.GoogleClassroomSB.entity.GroupchatEntity;
import com.springboot.GoogleClassroomSB.entity.UserEntity;
import com.springboot.GoogleClassroomSB.service.GroupMessageService;
import com.springboot.GoogleClassroomSB.service.GroupchatService;
import com.springboot.GoogleClassroomSB.service.MessageSeenService;

import jakarta.servlet.http.HttpServletRequest;

import java.security.Principal;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("messages")
@CrossOrigin(origins = "http://localhost:4200")
public class MessageController {

	@Autowired
	private GroupMessageService messageService;

	@Autowired
	private MessageSeenService msgSeenService;

	@Autowired
	private SimpMessagingTemplate messagingTemplate;

	@GetMapping("/group/{groupId}")
	public List<MessageDTO> getMessages(@PathVariable Long groupId) {
		return messageService.getMessagesForGroup(groupId);
	}

	@PostMapping("/send")
	public ResponseEntity<?> sendMessage(@RequestBody MessageDTO dto, HttpServletRequest request,
			@RequestHeader("Authorization") String authHeader) {
		System.out.println("hello. it reaches controller");
		String token = request.getHeader("Authorization").substring(7);
		messageService.sendMessage(dto, token);
		return ResponseEntity.ok("Sending successful!");
	}

	@MessageMapping("/chat.sendMessage")
	public void sendMessage(@Payload MessageDTO dto) {
		System.out.println("hello. it reaches controller 222");
		System.out.println("sendMsg controller : " + dto.getAttachments());
		MessageDTO savedMessage = messageService.sendMessageWithAttachments(dto);
		messagingTemplate.convertAndSend("/topic/group/" + dto.getGroupId(), savedMessage);
	}
	
//    @MessageMapping("/chat.sendMessage")
//    public void sendMessage(@Payload MessageDTO dto, @Header("Authorization") String authHeader) {
//        String token = authHeader.substring(7);
//        MessageDTO savedMessage = messageService.sendMessageWithAttachments(dto, token);
//        messagingTemplate.convertAndSend("/topic/group/" + dto.getGroupId(), savedMessage);
//    }

	@MessageMapping("/typing")
	public void handleTypingStatus(TypingStatusDTO status) {
		System.out.println("from websocket : " + status);
		messagingTemplate.convertAndSend("/topic/typing/" + status.getGroupId(), status);
	}

	@MessageMapping("/message/seen")
	public void handleSeenEvent(@Payload MessageSeenDTO request) {
		System.out.println("reached message/seen");
		SeenNotificationDTO notification = msgSeenService.markMessageAsSeen(request);
		messagingTemplate.convertAndSend("/topic/seen/" + notification.getGroupId(), notification);
	}

}
