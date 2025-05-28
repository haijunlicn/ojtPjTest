package com.springboot.GoogleClassroomSB.controller;

import com.springboot.GoogleClassroomSB.dto.GroupchatDTO;
import com.springboot.GoogleClassroomSB.dto.MessageDTO;
import com.springboot.GoogleClassroomSB.entity.GroupMessageEntity;
import com.springboot.GoogleClassroomSB.entity.GroupchatEntity;
import com.springboot.GoogleClassroomSB.entity.UserEntity;
import com.springboot.GoogleClassroomSB.repository.UserRepository;
import com.springboot.GoogleClassroomSB.service.GroupMessageService;
import com.springboot.GoogleClassroomSB.service.GroupchatService;

import jakarta.servlet.http.HttpServletRequest;

import java.util.Collections;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("groupchats")
@CrossOrigin(origins = "http://localhost:4200")
public class GroupchatController {

	@Autowired
	private GroupchatService groupService;
	
	@Autowired
	private UserRepository userRepo;

	@PostMapping("/createGroupchat")
	public ResponseEntity<?> createGroup(@RequestBody GroupchatDTO dto,
			@RequestHeader("Authorization") String authHeader) {

		String token = authHeader.startsWith("Bearer ") ? authHeader.substring(7) : authHeader;
		groupService.createGroup(dto, token);
		return ResponseEntity.ok("Group created successfully!");
	}
	
	@PostMapping("/joinGroupchat")
	public ResponseEntity<?> joinGroup(@RequestBody GroupchatDTO request,
	                                   @RequestHeader("Authorization") String authHeader) {
	    String token = authHeader.startsWith("Bearer ") ? authHeader.substring(7) : authHeader;
	    try {
	        groupService.joinGroup(request.getJoinCode(), token);
	        return ResponseEntity.ok("Joined group successfully.");
	    } catch (RuntimeException ex) {
	        // Handle specific error messages
	        String errorMessage = ex.getMessage();
	        HttpStatus status = HttpStatus.BAD_REQUEST;

	        if ("User already joined this group.".equals(errorMessage)) {
	            status = HttpStatus.CONFLICT; // 409 Conflict
	        } else if ("User not found.".equals(errorMessage) || "Group not found with join code.".equals(errorMessage)) {
	            status = HttpStatus.NOT_FOUND;
	        }

	        return ResponseEntity.status(status).body(Collections.singletonMap("message", errorMessage));
	    }
	}

	@GetMapping("/createdGroupList")
	public ResponseEntity<List<GroupchatDTO>> getCreatedGroups(@RequestParam Long userId) {
	    UserEntity user = userRepo.findById(userId)
	            .orElseThrow(() -> new UsernameNotFoundException("User not found"));
		return ResponseEntity.ok(groupService.getGroupsCreatedByUser(user));
	}

	@GetMapping("/joinedGroupList")
	public ResponseEntity<List<GroupchatDTO>> getJoinedGroups(@RequestParam Long userId) {
	    UserEntity user = userRepo.findById(userId)
	            .orElseThrow(() -> new UsernameNotFoundException("User not found"));
		return ResponseEntity.ok(groupService.getGroupsJoinedByUser(user));
	}

}
