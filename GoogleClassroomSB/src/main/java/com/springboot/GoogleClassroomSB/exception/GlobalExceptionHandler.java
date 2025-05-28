package com.springboot.GoogleClassroomSB.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Collections;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // 🔴 Handle known validation errors
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<?> handleIllegalArgument(IllegalArgumentException ex) {
        return ResponseEntity
                .badRequest()
                .body(Collections.singletonMap("message", ex.getMessage()));
    }

    // 🔥 Catch-all for any unhandled exceptions
    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleUnexpected(Exception ex) {
        ex.printStackTrace(); // Or log with a logger
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Collections.singletonMap("message", "Something went wrong. Please try again later."));
    }
}
