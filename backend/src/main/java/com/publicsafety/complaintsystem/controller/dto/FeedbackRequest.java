package com.publicsafety.complaintsystem.controller.dto;

public class FeedbackRequest {
    private Long complaintId;
    private Integer rating;
    private String comment;

    public Long getComplaintId() { return complaintId; }
    public void setComplaintId(Long complaintId) { this.complaintId = complaintId; }
    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }
    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }
}
