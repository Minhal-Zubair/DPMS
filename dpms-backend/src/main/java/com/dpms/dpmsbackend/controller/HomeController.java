package com.dpms.dpmsbackend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {

    @GetMapping("/")
    public String home() {
        return "DPMS Backend is Running Successfully!";
    }

    @GetMapping("/test")
    public String test() {
        return "Backend API Working";
    }
}