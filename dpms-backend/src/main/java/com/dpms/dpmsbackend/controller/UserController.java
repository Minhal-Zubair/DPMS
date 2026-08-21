package com.dpms.dpmsbackend.controller;


import com.dpms.dpmsbackend.entity.User;
import com.dpms.dpmsbackend.service.UserService;
import com.dpms.dpmsbackend.dto.ChangePasswordRequest;


import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {


    private final UserService userService;


    public UserController(UserService userService) {

        this.userService = userService;

    }


    // CREATE USER
    @PostMapping
    public ResponseEntity<User> createUser(
            @RequestBody User user
    ){

        User savedUser = userService.createUser(user);

        return ResponseEntity.ok(savedUser);

    }



    // GET ALL USERS
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers(){

        return ResponseEntity.ok(
                userService.getAllUsers()
        );

    }



    // GET USER BY ID
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(
            @PathVariable Long id
    ){
        User user = userService.getUserById(Long.valueOf(id));
        if(user == null){
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(user);
    }
    // UPDATE USER
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(
            @PathVariable Long id,
            @RequestBody User user
    ){
        User updatedUser =
                userService.updateUser(Long.valueOf(id),user);
        if(updatedUser == null){
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updatedUser);
    }
    // LOCK / UNLOCK USER
    @PutMapping("/{id}/lock")
    public ResponseEntity<User> updateUserLock(
            @PathVariable Long id,
            @RequestBody User request
    ){
        User updatedUser =
                userService.updateUserLock(
                        id,
                        request.getAccountLocked()
                );
        return ResponseEntity.ok(updatedUser);
    }




    // DELETE USER
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(
            @PathVariable Long id
    ){

        userService.deleteUser(Long.valueOf(id));


        return ResponseEntity.ok(
                "User deleted successfully"
        );

    }

    @GetMapping("/test")
    public String test() {
        return "User Controller is Working";
    }

    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(
            @RequestBody ChangePasswordRequest request){

        userService.changePassword(request);

        return ResponseEntity.ok("Password updated successfully");

    }

    // ENABLE / DISABLE USER
    @PutMapping("/{id}/status")
    public ResponseEntity<User> updateUserStatus(
            @PathVariable Long id,
            @RequestBody User request
    ){
        User updatedUser =
                userService.updateUserStatus(
                        id,
                        request.getEnabled()
                );
        return ResponseEntity.ok(updatedUser);
    }
}