package com.publicsafety.complaintsystem.domain;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "complaints")
public class Complaint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Category category;

    private Double latitude;
    private Double longitude;

    private String locationLabel;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String imageBase64;

    private String mediaPath;

    @Column(nullable = false)
    private Boolean anonymous;

    private String contactEmail; // If identified but not logged in, or tied to User optionally

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user; // Nullable if anonymous

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.SUBMITTED;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Priority priority = Priority.MEDIUM;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_officer_id")
    private User assignedOfficer;

    @Column(columnDefinition = "TEXT")
    private String remarks;

    private String resolutionProofPath;

    @Column(nullable = false)
    private LocalDateTime timestamp = LocalDateTime.now();

    @Column
    private LocalDateTime updatedAt = LocalDateTime.now();

    public Complaint() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public String getLocationLabel() { return locationLabel; }
    public void setLocationLabel(String locationLabel) { this.locationLabel = locationLabel; }

    public String getImageBase64() { return imageBase64; }
    public void setImageBase64(String imageBase64) { this.imageBase64 = imageBase64; }

    public String getMediaPath() { return mediaPath; }
    public void setMediaPath(String mediaPath) { this.mediaPath = mediaPath; }

    public Boolean getAnonymous() { return anonymous; }
    public void setAnonymous(Boolean anonymous) { this.anonymous = anonymous; }

    public String getContactEmail() { return contactEmail; }
    public void setContactEmail(String contactEmail) { this.contactEmail = contactEmail; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }

    public Priority getPriority() { return priority; }
    public void setPriority(Priority priority) { this.priority = priority; }

    public User getAssignedOfficer() { return assignedOfficer; }
    public void setAssignedOfficer(User assignedOfficer) { this.assignedOfficer = assignedOfficer; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }

    public String getResolutionProofPath() { return resolutionProofPath; }
    public void setResolutionProofPath(String resolutionProofPath) { this.resolutionProofPath = resolutionProofPath; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
