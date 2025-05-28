package com.springboot.GoogleClassroomSB.controller;

import com.springboot.GoogleClassroomSB.dto.LoginFormDTO;
import com.springboot.GoogleClassroomSB.dto.RegisterFormDTO;
import com.springboot.GoogleClassroomSB.dto.UserDTO;
import com.springboot.GoogleClassroomSB.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/auth")
public class GitTesting2Controller {


    //git testing 2

	@Autowired
	private AuthService authService;	

	@PostMapping("/register")
	public ResponseEntity<?> register(@RequestBody RegisterFormDTO form) {
	    authService.registerUser(form);
	    return ResponseEntity.ok(Collections.singletonMap("message", "Register successful!"));
	}
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginFormDTO loginDTO) {
        try {
        	System.out.println("auth controller : " + loginDTO.getEmail());
            String token = authService.login(loginDTO);
            return ResponseEntity.ok(Collections.singletonMap("token", token));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Collections.singletonMap("message", e.getMessage()));
        }
    }
    
    @GetMapping("/me")
    public ResponseEntity<UserDTO> getCurrentUser(@RequestHeader("Authorization") String authHeader) {
        UserDTO userDTO = authService.getCurrentUser(authHeader);
        return ResponseEntity.ok(userDTO);
        // HI MayKabyarNiang
    }



}
