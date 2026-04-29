package com.publicsafety.complaintsystem.service;

import com.publicsafety.complaintsystem.domain.Notification;
import com.publicsafety.complaintsystem.domain.Role;
import com.publicsafety.complaintsystem.domain.User;
import com.publicsafety.complaintsystem.repository.NotificationRepository;
import com.publicsafety.complaintsystem.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Async
    public void notifyAdmin(String messageContent) {
        messagingTemplate.convertAndSend("/topic/admin/complaints", messageContent);
        List<User> admins = userRepository.findByRoleIn(List.of(Role.ADMIN, Role.SUPER_ADMIN));
        for (User admin : admins) {
            Notification notification = new Notification();
            notification.setMessage(messageContent);
            notification.setRecipient(admin);
            notificationRepository.save(notification);
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            String[] recipients = admins.stream().map(User::getEmail).toArray(String[]::new);
            if (recipients.length == 0) return;
            message.setTo(recipients);
            message.setSubject("New Public Safety Complaint Submitted");
            message.setText(messageContent);
            mailSender.send(message);
        } catch (Exception e) {
            // Ignore email exceptions for local dev if SMTP is not configured
            System.err.println("Email failed: " + e.getMessage());
        }
    }

    public void notifyUser(User user, String messageContent) {
        Notification notification = new Notification();
        notification.setMessage(messageContent);
        notification.setRecipient(user);
        notificationRepository.save(notification);
        messagingTemplate.convertAndSend("/topic/user/" + user.getId(), messageContent);
    }
}
