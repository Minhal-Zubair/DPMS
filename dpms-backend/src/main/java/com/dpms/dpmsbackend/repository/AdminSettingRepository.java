package com.dpms.dpmsbackend.repository;
import com.dpms.dpmsbackend.entity.AdminSetting;
import org.springframework.data.jpa.repository.JpaRepository;
public interface AdminSettingRepository
        extends JpaRepository<AdminSetting,Integer> {
}