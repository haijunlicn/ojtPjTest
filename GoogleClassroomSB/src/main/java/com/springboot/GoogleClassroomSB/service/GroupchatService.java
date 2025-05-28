package com.springboot.GoogleClassroomSB.service;

import com.springboot.GoogleClassroomSB.dto.GroupchatDTO;
import com.springboot.GoogleClassroomSB.entity.GroupchatEntity;
import com.springboot.GoogleClassroomSB.entity.UserEntity;
import com.springboot.GoogleClassroomSB.entity.UserGroupEntity;
import com.springboot.GoogleClassroomSB.repository.GroupchatRepository;
import com.springboot.GoogleClassroomSB.repository.UserGroupRepository;
import com.springboot.GoogleClassroomSB.repository.UserRepository;
import com.springboot.GoogleClassroomSB.security.JWTUtil;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class GroupchatService {

	@Autowired
	private GroupchatRepository groupRepo;

	@Autowired
	private UserRepository userRepo;

	@Autowired
	private UserGroupRepository userGroupRepo;

	@Autowired
	private JWTUtil jwtUtil;

	@Autowired
	private ModelMapper mapper;

	public GroupchatEntity createGroup(GroupchatDTO dto, String jwtToken) {

		// Use mapper to convert DTO to Entity
		GroupchatEntity group = mapper.map(dto, GroupchatEntity.class);
		group.setJoinCode(generateUniqueJoinCode());
		group = groupRepo.save(group);

		// Extract the email
		String email = jwtUtil.extractUsername(jwtToken);
		UserEntity loggedInUser = userRepo.findByEmail(email);

		// Create a new UserGroup entity
		UserGroupEntity userGroup = new UserGroupEntity();
		userGroup.setUser(loggedInUser);
		userGroup.setGroup(group);
		userGroup.setRole("ADMIN");
		userGroup.setJoinedAt(LocalDateTime.now());
		userGroupRepo.save(userGroup);

		return group;
	}

	public GroupchatEntity joinGroup(String joinCode, String jwtToken) {
		// 1. Find group by join code
		GroupchatEntity group = groupRepo.findByJoinCode(joinCode)
				.orElseThrow(() -> new RuntimeException("Group not found with join code."));

		// 2. Extract user from JWT token
		String email = jwtUtil.extractUsername(jwtToken);
		UserEntity user = userRepo.findByEmail(email);
		if (user == null) {
			throw new RuntimeException("User not found.");
		}

		// 3. Check if user already joined
		boolean alreadyJoined = userGroupRepo.existsByUserAndGroup(user, group);
		if (alreadyJoined) {
			throw new RuntimeException("User already joined this group.");
		}

		// 4. Create and save join record
		UserGroupEntity userGroup = new UserGroupEntity();
		userGroup.setUser(user);
		userGroup.setGroup(group);
		userGroup.setRole("MEMBER");
		userGroup.setJoinedAt(LocalDateTime.now());
		userGroupRepo.save(userGroup);

		return group;
	}

//	public List<GroupchatDTO> getGroupsCreatedByUser(UserEntity user) {
//		List<GroupchatEntity> groupList = groupRepo.findGroupsCreatedByUser(user);
//		return groupList.stream().map(group -> {
//			GroupchatDTO dto = mapper.map(group, GroupchatDTO.class);
//			dto.setMemberCount(group.getMemberCount());
//			return dto;
//		}).toList();
//	}
//
//	public List<GroupchatDTO> getGroupsJoinedByUser(UserEntity user) {
//		List<GroupchatEntity> groupList = groupRepo.findGroupsJoinedByUser(user);
//		return groupList.stream().map(group -> {
//			GroupchatDTO dto = mapper.map(group, GroupchatDTO.class);
//			dto.setMemberCount(group.getMemberCount());
//			return dto;
//		}).toList();
//	}

	public List<GroupchatDTO> getGroupsCreatedByUser(UserEntity user) {
		List<GroupchatEntity> groupList = groupRepo.findGroupsCreatedByUser(user);

		return groupList.stream().map(group -> {
			GroupchatDTO dto = mapper.map(group, GroupchatDTO.class);

			String role = userGroupRepo.findByUserIdAndGroupId(user.getId(), group.getId())
					.map(UserGroupEntity::getRole).orElse("MEMBER");
			
			System.out.println("role : " + role);
			
			dto.setRole(role);
			dto.setMemberCount(group.getMemberCount());
			return dto;
		}).toList();
	}

	public List<GroupchatDTO> getGroupsJoinedByUser(UserEntity user) {
		List<GroupchatEntity> groupList = groupRepo.findGroupsJoinedByUser(user);

		return groupList.stream().map(group -> {
			GroupchatDTO dto = mapper.map(group, GroupchatDTO.class);

			// 🔥 Set role here too
			String role = userGroupRepo.findByUserIdAndGroupId(user.getId(), group.getId())
					.map(UserGroupEntity::getRole).orElse("MEMBER");
			dto.setRole(role);
			dto.setMemberCount(group.getMemberCount());
			return dto;
		}).toList();
	}

	private String generateUniqueJoinCode() {
		String code;
		do {
			code = UUID.randomUUID().toString().substring(0, 8).toUpperCase();
		} while (groupRepo.existsByJoinCode(code));
		return code;
	}

}
