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
import com.springboot.GoogleClassroomSB.service.ImageKitService;
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
@RequestMapping("/imageKit")
@CrossOrigin(origins = "http://localhost:4200")
public class FileUploadController {

	@Autowired
	private ImageKitService imageKitService;

	@PostMapping("/upload")
	public ResponseEntity<Map<String, Object>> uploadFile(@RequestParam("file") MultipartFile file) throws Exception {
	    // Log content type
	    System.out.println("Received file: " + file.getOriginalFilename());
	    System.out.println("File type: " + file.getContentType());
		
		Map<String, Object> uploadResult = imageKitService.uploadFile(file);
		return ResponseEntity.ok(uploadResult);
	}
}
