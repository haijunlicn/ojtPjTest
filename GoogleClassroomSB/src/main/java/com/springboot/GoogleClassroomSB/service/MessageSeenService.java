package com.springboot.GoogleClassroomSB.service;

import com.springboot.GoogleClassroomSB.dto.GroupchatDTO;
import com.springboot.GoogleClassroomSB.dto.MessageDTO;
import com.springboot.GoogleClassroomSB.dto.MessageSeenDTO;
import com.springboot.GoogleClassroomSB.dto.SeenNotificationDTO;
import com.springboot.GoogleClassroomSB.entity.GroupMessageEntity;
import com.springboot.GoogleClassroomSB.entity.GroupchatEntity;
import com.springboot.GoogleClassroomSB.entity.MessageSeenEntity;
import com.springboot.GoogleClassroomSB.entity.MessageSeenId;
import com.springboot.GoogleClassroomSB.entity.UserEntity;
import com.springboot.GoogleClassroomSB.entity.UserGroupEntity;
import com.springboot.GoogleClassroomSB.repository.GroupMessageRepository;
import com.springboot.GoogleClassroomSB.repository.GroupchatRepository;
import com.springboot.GoogleClassroomSB.repository.MessageSeenRepository;
import com.springboot.GoogleClassroomSB.repository.UserGroupRepository;
import com.springboot.GoogleClassroomSB.repository.UserRepository;
import com.springboot.GoogleClassroomSB.security.JWTUtil;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestHeader;

@Service
@RequiredArgsConstructor
public class MessageSeenService {

	@Autowired
	private GroupMessageRepository messageRepo;

	@Autowired
	private GroupchatRepository groupRepo;

	@Autowired
	private UserRepository userRepo;

	@Autowired
	private MessageSeenRepository msgSeenRepo;

	@Autowired
	private JWTUtil jwtUtil;

	@Autowired
	private ModelMapper mapper;

	public SeenNotificationDTO markMessageAsSeen(MessageSeenDTO request) {
		UserEntity user = userRepo.findByEmail(request.getUserEmail());
		GroupMessageEntity message = messageRepo.findById(request.getMessageId())
				.orElseThrow(() -> new EntityNotFoundException("Message not found with ID: " + request.getMessageId()));

		boolean alreadySeen = msgSeenRepo.existsByMessageIdAndUserId(message.getId(), user.getId());
		if (!alreadySeen) {
			MessageSeenEntity seen = new MessageSeenEntity();
			seen.setId(new MessageSeenId(message.getId(), user.getId()));
			seen.setMessage(message);
			seen.setUser(user);
			seen.setSeenAt(LocalDateTime.now());
			msgSeenRepo.save(seen);

			// Return notification data to controller
			return new SeenNotificationDTO(message.getId(), user.getId(), user.getName(), message.getGroup().getId());
		}

		return null; // Already seen, no need to broadcast
	}

}
