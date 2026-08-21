package com.dpms.dpmsbackend.controller;


import com.dpms.dpmsbackend.service.UserService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;


@RestController
@RequestMapping("/api/users")
@CrossOrigin(
        origins="http://localhost:5173"
)
public class UserProfileController {


    private final UserService userService;


    public UserProfileController(
            UserService userService
    ){
        this.userService = userService;
    }



    // ==========================
    // Upload Profile Image
    // ==========================

    @PostMapping(
            value="/{id}/profile-image",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<?> uploadImage(

            @PathVariable Long id,

            @RequestParam("file") MultipartFile file

    ) throws Exception{


        userService.uploadProfileImage(
                id,
                file
        );


        return ResponseEntity.ok(
                "Profile image uploaded successfully"
        );

    }






    // ==========================
    // Display Profile Image
    // ==========================


    @GetMapping(
            value="/{id}/profile-image"
    )
    public ResponseEntity<byte[]> getImage(

            @PathVariable Long id

    ){


        byte[] image =
                userService.getProfileImage(id);



        String type =
                userService.getProfileImageType(id);



        return ResponseEntity
                .ok()
                .contentType(
                        MediaType.parseMediaType(type)
                )
                .body(image);


    }



}