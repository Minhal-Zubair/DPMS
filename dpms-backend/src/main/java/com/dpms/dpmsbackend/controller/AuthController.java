package com.dpms.dpmsbackend.controller;


import com.dpms.dpmsbackend.dto.LoginRequest;
import com.dpms.dpmsbackend.dto.LoginResponse;
import com.dpms.dpmsbackend.dto.RegisterRequest;
import com.dpms.dpmsbackend.dto.UserResponse;
import com.dpms.dpmsbackend.service.UserService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;



@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {



    private final UserService userService;



    public AuthController(UserService userService){

        this.userService = userService;

    }




    // =====================================
    // REGISTER USER
    // =====================================

    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(
            @RequestBody RegisterRequest request
    ){

        UserResponse response =
                userService.registerUser(request);


        return ResponseEntity.ok(response);

    }





    // =====================================
    // LOGIN USER
    // =====================================

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @RequestBody LoginRequest request
    ){

        LoginResponse response =
                userService.loginUser(request);


        return ResponseEntity.ok(response);

    }


}