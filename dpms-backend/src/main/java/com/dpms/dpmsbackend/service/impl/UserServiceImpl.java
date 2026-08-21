package com.dpms.dpmsbackend.service.impl;
import com.dpms.dpmsbackend.dto.LoginRequest;
import com.dpms.dpmsbackend.dto.LoginResponse;
import com.dpms.dpmsbackend.dto.RegisterRequest;
import com.dpms.dpmsbackend.dto.UserResponse;
import com.dpms.dpmsbackend.entity.User;
import com.dpms.dpmsbackend.repository.UserRepository;
import com.dpms.dpmsbackend.security.JwtService;
import com.dpms.dpmsbackend.service.UserService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.dpms.dpmsbackend.service.ApplicationLogService;
import com.dpms.dpmsbackend.dto.ChangePasswordRequest;
import com.dpms.dpmsbackend.entity.PasswordHistory;
import com.dpms.dpmsbackend.repository.PasswordHistoryRepository;
import com.dpms.dpmsbackend.service.NotificationService;
import java.util.List;
import org.springframework.web.multipart.MultipartFile;


@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    private final PasswordHistoryRepository passwordHistoryRepository;

    private final PasswordEncoder passwordEncoder;

    private final JwtService jwtService;

    private final ApplicationLogService applicationLogService;

    private final NotificationService notificationService;



    public UserServiceImpl(
            UserRepository userRepository,
            PasswordHistoryRepository passwordHistoryRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            ApplicationLogService applicationLogService,
            NotificationService notificationService
    ) {

        this.userRepository = userRepository;
        this.passwordHistoryRepository = passwordHistoryRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.applicationLogService = applicationLogService;
        this.notificationService = notificationService;

    }



    // ============================
    // LOGIN USER
    // ============================

    @Override
    public LoginResponse loginUser(LoginRequest request) {


        User user = userRepository
                .findByUsername(request.getUsername())
                .orElseThrow(() ->
                        new RuntimeException("User not found"));


        boolean passwordMatch =
                passwordEncoder.matches(
                        request.getPassword(),
                        user.getPassword()
                );


        if (!passwordMatch) {

            throw new RuntimeException("Invalid password");

        }



        String token =
                jwtService.generateToken(
                        user.getUsername()
                );



        applicationLogService.saveLog(
                null,
                user.getId(),
                "LOGIN",
                "User logged in"
        );



        return new LoginResponse(
                user.getId(),
                token,
                user.getUsername(),
                user.getFirstName(),
                user.getLastName()
        );

    }





    // ============================
    // REGISTER USER
    // ============================


    @Override
    public UserResponse registerUser(RegisterRequest request) {


        if (userRepository.existsByUsername(request.getUsername())) {

            throw new RuntimeException("Username already exists");

        }


        if (userRepository.existsByEmail(request.getEmail())) {

            throw new RuntimeException("Email already registered");

        }


        if (userRepository.existsByCnic(request.getCnic())) {

            throw new RuntimeException("CNIC already registered");

        }



        User user = new User();


        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setCnic(request.getCnic());
        user.setPhone(request.getPhone());


        user.setPassword(
                passwordEncoder.encode(request.getPassword())
        );


        user.setEnabled(true);
        user.setAccountLocked(false);



        // SAVE USER FIRST
        User savedUser = userRepository.save(user);



        // PASSWORD HISTORY

        PasswordHistory history = new PasswordHistory();

        history.setUserId(savedUser.getId());

        history.setPasswordHash(savedUser.getPassword());

        passwordHistoryRepository.save(history);





        // APPLICATION LOG

        applicationLogService.saveLog(
                null,
                savedUser.getId(),
                "REGISTER",
                "New user registered"
        );




        // NOTIFICATION

        notificationService.createNotification(

                savedUser.getId(),

                "Welcome to DPMS",

                "Your account has been created successfully."

        );





        UserResponse response = new UserResponse();


        response.setId(
                Math.toIntExact(savedUser.getId())
        );

        response.setFirstName(savedUser.getFirstName());

        response.setLastName(savedUser.getLastName());

        response.setUsername(savedUser.getUsername());

        response.setEmail(savedUser.getEmail());

        response.setPhone(savedUser.getPhone());



        return response;


    }


    @Override
    public User updateUserStatus(
            Long id,
            Boolean enabled
    ){

        User user =
                userRepository.findById(id)
                        .orElseThrow(
                                () -> new RuntimeException("User not found")
                        );


        user.setEnabled(enabled);


        return userRepository.save(user);

    }



    @Override
    public User updateUserLock(
            Long id,
            Boolean locked
    ){

        User user =
                userRepository.findById(id)
                        .orElseThrow(
                                () -> new RuntimeException("User not found")
                        );


        user.setAccountLocked(locked);


        return userRepository.save(user);

    }





    // ============================
    // CREATE USER
    // ============================


    @Override
    public User createUser(User user) {



        if (userRepository.existsByUsername(user.getUsername())) {

            throw new RuntimeException("Username already taken");

        }


        if (userRepository.existsByEmail(user.getEmail())) {

            throw new RuntimeException("Email already registered");

        }



        if (userRepository.existsByCnic(user.getCnic())) {

            throw new RuntimeException("CNIC already registered");

        }



        user.setPassword(
                passwordEncoder.encode(user.getPassword())
        );

        User savedUser = userRepository.save(user);

        applicationLogService.saveLog(
                null,
                savedUser.getId(),
                "USER_CREATED",
                "New user created"
        );

        notificationService.createNotification(
                savedUser.getId(),
                "Account Created",
                "Your account has been created successfully."
        );



        return savedUser;


    }







    // ============================
    // GET ALL USERS
    // ============================


    @Override
    public List<User> getAllUsers() {

        return userRepository.findAll();

    }





    // ============================
    // GET USER BY ID
    // ============================


    @Override
    public User getUserById(Long id) {

        return userRepository
                .findById(id)
                .orElse(null);

    }







    // ============================
    // UPDATE USER
    // ============================


    @Override
    public User updateUser(Long id, User user) {


        User existingUser =
                userRepository.findById(id)
                        .orElse(null);



        if(existingUser == null){

            return null;

        }




        existingUser.setFirstName(user.getFirstName());

        existingUser.setLastName(user.getLastName());

        existingUser.setUsername(user.getUsername());

        existingUser.setEmail(user.getEmail());

        existingUser.setCnic(user.getCnic());

        existingUser.setPhone(user.getPhone());



        User updated =
                userRepository.save(existingUser);




        applicationLogService.saveLog(
                null,
                updated.getId(),
                "PROFILE_UPDATED",
                "User updated profile"
        );



        notificationService.createNotification(

                updated.getId(),

                "Profile Updated",

                "Your profile information was updated."

        );



        return updated;


    }







    // ============================
    // DELETE USER
    // ============================


    @Override
    public void deleteUser(Long id) {



        applicationLogService.saveLog(
                null,
                id,
                "USER_DELETED",
                "User account deleted"
        );


        notificationService.createNotification(

                id,

                "Account Deleted",

                "Your account has been deleted."

        );



        userRepository.deleteById(id);


    }

    @Override
    public String uploadProfileImage(
            Long userId,
            MultipartFile file
    )
            throws Exception{


        User user =
                userRepository.findById(userId)
                        .orElseThrow(
                                () ->
                                        new RuntimeException(
                                                "User not found"
                                        )
                        );


        // convert image into bytes
        user.setProfileImage(
                file.getBytes()
        );


        // save image type
        user.setProfileImageType(
                file.getContentType()
        );


        // update user table
        userRepository.save(user);


        return "Uploaded successfully";

    }

    @Override
    public byte[] getProfileImage(Long userId){


        User user =
                userRepository.findById(userId)
                        .orElseThrow(
                                ()->new RuntimeException(
                                        "User not found"
                                )
                        );


        return user.getProfileImage();

    }



    @Override
    public String getProfileImageType(Long userId){


        User user =
                userRepository.findById(userId)
                        .orElseThrow(
                                ()->new RuntimeException(
                                        "User not found"
                                )
                        );


        return user.getProfileImageType();

    }





    // ============================
    // CHANGE PASSWORD
    // ============================


    @Override
    public void changePassword(ChangePasswordRequest request) {



        User user =
                userRepository.findById(request.getUserId())
                        .orElseThrow(() ->
                                new RuntimeException("User not found"));




        if(!passwordEncoder.matches(

                request.getCurrentPassword(),

                user.getPassword()

        )){


            throw new RuntimeException(
                    "Current password is incorrect"
            );


        }




        user.setPassword(

                passwordEncoder.encode(
                        request.getNewPassword()
                )

        );



        User savedUser =
                userRepository.save(user);






        PasswordHistory history =
                new PasswordHistory();


        history.setUserId(savedUser.getId());

        history.setPasswordHash(savedUser.getPassword());

        passwordHistoryRepository.save(history);

        applicationLogService.saveLog(
                null,
                savedUser.getId(),
                "PASSWORD_CHANGED",
                "Password updated successfully"
        );


        notificationService.createNotification(

                savedUser.getId(),

                "Password Changed",

                "Your password has been changed successfully."

        );



    }



}