package com.publicsafety.complaintsystem;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class ComplaintsystemApplication {

	public static void main(String[] args) {
		SpringApplication.run(ComplaintsystemApplication.class, args);
	}

}
