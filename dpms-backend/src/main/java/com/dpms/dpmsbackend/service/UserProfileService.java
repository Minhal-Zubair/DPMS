package com.dpms.dpmsbackend.service;

import com.dpms.dpmsbackend.dto.ProfileDto;

public interface UserProfileService {

    // ==========================================
    // Get Complete Profile
    // ==========================================

    ProfileDto getProfile(Long userId);

    // ==========================================
    // Update Complete Profile
    // ==========================================

    ProfileDto updateProfile(Long userId, ProfileDto profileDto);

}