package com.dpms.dpmsbackend.service.impl;

import com.dpms.dpmsbackend.dto.ProfileDto;
import com.dpms.dpmsbackend.entity.User;
import com.dpms.dpmsbackend.entity.UserProfile;
import com.dpms.dpmsbackend.repository.UserProfileRepository;
import com.dpms.dpmsbackend.repository.UserRepository;
import com.dpms.dpmsbackend.service.UserProfileService;
import org.springframework.stereotype.Service;

@Service
public class UserProfileServiceImpl implements UserProfileService {

    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;

    public UserProfileServiceImpl(
            UserRepository userRepository,
            UserProfileRepository userProfileRepository
    ) {
        this.userRepository = userRepository;
        this.userProfileRepository = userProfileRepository;
    }

    // ==========================================
    // Get Complete Profile
    // ==========================================

    @Override
    public ProfileDto getProfile(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        UserProfile profile = userProfileRepository
                .findByUserId(userId)
                .orElseGet(() -> {

                    UserProfile newProfile = new UserProfile();
                    newProfile.setUserId(userId);

                    return userProfileRepository.save(newProfile);

                });

        ProfileDto dto = new ProfileDto();

        // Users table

        dto.setUserId(user.getId());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setPhone(user.getPhone());
        dto.setCnic(user.getCnic());

        // User Profile table

        dto.setAddress(profile.getAddress());
        dto.setCity(profile.getCity());
        dto.setPostalCode(profile.getPostalCode());

        return dto;
    }

    // ==========================================
    // Update Complete Profile
    // ==========================================

    @Override
    public ProfileDto updateProfile(Long userId, ProfileDto dto) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        // ==========================
        // Update users table
        // ==========================

        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setEmail(dto.getEmail());
        user.setPhone(dto.getPhone());

        userRepository.save(user);

        // ==========================
        // Update profile table
        // ==========================

        UserProfile profile = userProfileRepository
                .findByUserId(userId)
                .orElseGet(() -> {

                    UserProfile p = new UserProfile();
                    p.setUserId(userId);

                    return p;

                });

        profile.setAddress(dto.getAddress());
        profile.setCity(dto.getCity());
        profile.setPostalCode(dto.getPostalCode());

        userProfileRepository.save(profile);

        return getProfile(userId);
    }

}