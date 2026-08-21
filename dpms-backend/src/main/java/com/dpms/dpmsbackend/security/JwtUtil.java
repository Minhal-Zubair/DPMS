package com.dpms.dpmsbackend.security;


import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;


@Component
public class JwtUtil {


    private final String SECRET =
            "mySecretKeyForDpmsProjectAuthentication123456789";


    private final long EXPIRATION =
            86400000; // 24 hours



    private Key getKey(){

        return Keys.hmacShaKeyFor(
                SECRET.getBytes()
        );
    }



    public String generateToken(String username){


        return Jwts.builder()
                .subject(username)
                .issuedAt(new Date())
                .expiration(
                        new Date(
                                System.currentTimeMillis()
                                        + EXPIRATION
                        )
                )
                .signWith(getKey())
                .compact();

    }



    public String extractUsername(String token){

        return Jwts.parser()
                .verifyWith(
                        (javax.crypto.SecretKey)getKey()
                )
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();

    }

}