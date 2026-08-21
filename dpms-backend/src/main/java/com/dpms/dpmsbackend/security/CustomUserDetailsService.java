package com.dpms.dpmsbackend.security;


import com.dpms.dpmsbackend.entity.User;
import com.dpms.dpmsbackend.repository.UserRepository;


import org.jspecify.annotations.NonNull;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;



@Service
public class CustomUserDetailsService
        implements UserDetailsService {



    private final UserRepository userRepository;



    public CustomUserDetailsService(
            UserRepository userRepository
    ){

        this.userRepository=userRepository;

    }



    @Override
    public UserDetails loadUserByUsername(
            @NonNull String username
    ) throws UsernameNotFoundException {



        User user =
                userRepository.findByUsername(username)
                        .orElseThrow(
                                ()->new UsernameNotFoundException(
                                        "User not found"
                                )
                        );



        return org.springframework.security.core.userdetails.User
                .builder()
                .username(user.getUsername())
                .password(user.getPassword())
                .roles("USER")
                .build();

    }

}