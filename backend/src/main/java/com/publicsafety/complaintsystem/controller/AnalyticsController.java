package com.publicsafety.complaintsystem.controller;

import com.publicsafety.complaintsystem.domain.Complaint;
import com.publicsafety.complaintsystem.service.ComplaintService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {
    private final ComplaintService complaintService;

    public AnalyticsController(ComplaintService complaintService) {
        this.complaintService = complaintService;
    }

    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> summary() {
        List<Complaint> complaints = complaintService.getAllComplaints();
        Map<String, Long> byCategory = complaints.stream().collect(Collectors.groupingBy(c -> c.getCategory().name(), Collectors.counting()));
        Map<String, Long> byLocation = complaints.stream().collect(Collectors.groupingBy(c -> c.getLocationLabel() == null ? "UNKNOWN" : c.getLocationLabel(), Collectors.counting()));
        Map<LocalDate, Long> byDay = complaints.stream().collect(Collectors.groupingBy(c -> c.getTimestamp().toLocalDate(), Collectors.counting()));
        List<Map<String, Object>> heatmap = complaints.stream()
            .filter(c -> c.getLatitude() != null && c.getLongitude() != null)
            .map(c -> {
                Map<String, Object> point = new java.util.HashMap<>();
                point.put("lat", c.getLatitude());
                point.put("lng", c.getLongitude());
                point.put("weight", c.getPriority().ordinal() + 1);
                return point;
            })
            .toList();
        return ResponseEntity.ok(Map.of(
            "byCategory", byCategory,
            "byLocation", byLocation,
            "dailyTrend", byDay,
            "heatmap", heatmap
        ));
    }

    @GetMapping(value = "/report.csv", produces = "text/csv")
    public ResponseEntity<String> reportCsv(
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to
    ) {
        List<Complaint> complaints = complaintService.getAllComplaints().stream()
            .filter(c -> from == null || !c.getTimestamp().toLocalDate().isBefore(from))
            .filter(c -> to == null || !c.getTimestamp().toLocalDate().isAfter(to))
            .toList();
        StringBuilder csv = new StringBuilder("id,title,category,status,priority,location,timestamp\n");
        complaints.forEach(c -> csv.append(c.getId()).append(",")
            .append(safe(c.getTitle())).append(",")
            .append(c.getCategory()).append(",")
            .append(c.getStatus()).append(",")
            .append(c.getPriority()).append(",")
            .append(safe(c.getLocationLabel())).append(",")
            .append(c.getTimestamp()).append("\n"));
        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=complaints-report.csv")
            .contentType(MediaType.parseMediaType("text/csv"))
            .body(csv.toString());
    }

    private String safe(String value) {
        if (value == null) return "";
        return "\"" + value.replace("\"", "\"\"") + "\"";
    }
}
