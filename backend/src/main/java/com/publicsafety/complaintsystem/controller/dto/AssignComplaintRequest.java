package com.publicsafety.complaintsystem.controller.dto;

public class AssignComplaintRequest {
    private Long officerId;
    private String remarks;

    public Long getOfficerId() { return officerId; }
    public void setOfficerId(Long officerId) { this.officerId = officerId; }
    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
}
