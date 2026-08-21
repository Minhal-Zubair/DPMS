package com.dpms.dpmsbackend.controller;


import com.dpms.dpmsbackend.dto.AdminDashboardDTO;
import com.dpms.dpmsbackend.service.AdminService;

import org.springframework.web.bind.annotation.*;



@RestController
@RequestMapping("/api/admin")
@CrossOrigin
public class AdminController {


    private final AdminService service;



    public AdminController(
            AdminService service
    ){

        this.service=service;

    }



    @GetMapping("/dashboard")
    public AdminDashboardDTO dashboard(){

        return service.getDashboard();

    }


}