package com.dpms.dpmsbackend.service;
import com.dpms.dpmsbackend.dto.LoginRequest;
import com.dpms.dpmsbackend.dto.LoginResponse;
import com.dpms.dpmsbackend.dto.RegisterRequest;
import com.dpms.dpmsbackend.dto.UserResponse;
import com.dpms.dpmsbackend.entity.User;
import com.dpms.dpmsbackend.dto.ChangePasswordRequest;
import java.util.List;
import org.springframework.web.multipart.MultipartFile;
public interface UserService {
    UserResponse registerUser(RegisterRequest request);
    LoginResponse loginUser(LoginRequest request);
    User createUser(User user);
    List<User> getAllUsers();
    User getUserById(Long id);
    User updateUser(Long id, User user);
    void deleteUser(Long id);
    void changePassword(ChangePasswordRequest request);

    // ==============================
    // Admin User Management
    // ==============================
    User updateUserStatus(
            Long id,
            Boolean enabled
    );
    User updateUserLock(
            Long id,
            Boolean locked
    );

    String uploadProfileImage(
            Long userId,
            MultipartFile file
    )
            throws Exception;
    byte[] getProfileImage(Long userId);

    String getProfileImageType(Long userId);
}