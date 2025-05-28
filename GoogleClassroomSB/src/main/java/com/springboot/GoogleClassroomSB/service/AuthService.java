package com.springboot.GoogleClassroomSB.service;

import java.time.LocalDateTime;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.springboot.GoogleClassroomSB.dto.LoginFormDTO;
import com.springboot.GoogleClassroomSB.dto.RegisterFormDTO;
import com.springboot.GoogleClassroomSB.dto.UserDTO;
import com.springboot.GoogleClassroomSB.entity.UserEntity;
import com.springboot.GoogleClassroomSB.repository.UserRepository;
import com.springboot.GoogleClassroomSB.security.JWTUtil;

@Service
public class AuthService {

	@Autowired
	private UserRepository userRepo;

	@Autowired
	private GroupchatService groupService;

	@Autowired
	private ModelMapper mapper;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@Autowired
	private JWTUtil jwtUtil;

	@Autowired
	private UserDetailsService userDetailsService;

	@Autowired
	private AuthenticationManager authenticationManager;

	private static final int MAX_FAILED_ATTEMPTS = 5;
	private static final long LOCK_TIME_DURATION = 15; // in minutes

	public void registerUser(RegisterFormDTO dto) {
		// 1️⃣ Check if email is already used
		if (userRepo.existsByEmail(dto.getEmail())) {
			throw new IllegalArgumentException("Email is already registered");
		}

		// 2️⃣ Map DTO to entity and encode password
		UserEntity entity = mapper.map(dto, UserEntity.class);
		entity.setPassword(passwordEncoder.encode(dto.getPassword()));

		// 3️⃣ Save user
		userRepo.save(entity);
	}

	public String login(LoginFormDTO dto) {
		// Authenticate the user using the AuthenticationManager
		authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(dto.getEmail(), dto.getPassword()));
		// Load full user details from UserDetailsService
		UserDetails userDetails = userDetailsService.loadUserByUsername(dto.getEmail());
		// Fetch the user entity to get their name
		UserEntity user = userRepo.findByEmail(dto.getEmail());
		return jwtUtil.generateToken(userDetails, user.getName());
	}

	public UserDTO getCurrentUser(String authHeader) {
		String token = authHeader.replace("Bearer ", "");
		String email = jwtUtil.extractUsername(token);
		UserEntity user = userRepo.findByEmail(email);
		UserDTO userDTO = mapper.map(user, UserDTO.class);
		userDTO.setCreatedGroups(groupService.getGroupsCreatedByUser(user));
		userDTO.setJoinedGroups(groupService.getGroupsJoinedByUser(user));
		return userDTO;
	}
}
