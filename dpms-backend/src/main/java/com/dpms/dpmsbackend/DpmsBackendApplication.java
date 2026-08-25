package com.dpms.dpmsbackend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class DpmsBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(DpmsBackendApplication.class, args);
    }

}