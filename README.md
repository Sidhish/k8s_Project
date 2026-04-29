# Smart Public Safety & Citizen Complaint System

Production-grade complaint-management platform with role-based operations, real-time updates, analytics, and DevOps observability.

## Enterprise Modules Implemented

- User management: JWT auth, Google OAuth flow, RBAC (CITIZEN/OFFICER/ADMIN/SUPER_ADMIN), profile update API.
- Complaint management: anonymous or authenticated submission, category and priority support, geo coordinates, lifecycle and assignment.
- Real-time notifications: STOMP WebSocket alerts + in-app persisted notifications + email fan-out to admins.
- Admin module: filtered/searchable complaint view, status updates, officer assignment, priority updates.
- Officer module: assigned queue, status update, resolution proof upload, performance metrics.
- Analytics module: category/location/daily trend aggregation, heatmap payload, CSV report export.
- Feedback and ratings: complaint-level ratings/comments stored for officer performance analysis.
- Audit logging: login, registration, complaint flow, assignment and profile actions persisted in `audit_logs`.
- File management: secure media upload endpoint with MIME validation and persisted file paths.
- Monitoring/DevOps: Docker, Kubernetes manifest, Prometheus, Alertmanager, Grafana dashboards.

## Tech Stack

- Backend: Spring Boot 3, Java 17, Spring Security, JPA, WebSocket, Actuator.
- Frontend: React + Vite + Tailwind + Axios + STOMP client.
- Database: MySQL 8.
- Monitoring: Prometheus + Alertmanager + Grafana.

## Database Schema (Core Tables)

- `users`: auth/profile/role/language metadata.
- `complaints`: title, description, category, priority, geo, status, assignment, proof.
- `notifications`: in-app user/admin alert records.
- `feedback`: resolution rating and comments.
- `audit_logs`: immutable action audit stream.

## API Groups

- Auth APIs: `/api/auth/register`, `/api/auth/login`.
- User APIs: `/api/users/me`.
- Complaint APIs: `/api/complaints`, `/api/complaints/public`, `/api/complaints/search`.
- Admin APIs: `/api/admin/complaints`, assignment/status/priority, `/api/admin/officers`.
- Officer APIs: `/api/officer/complaints`, status/proof/performance.
- Notification APIs: `/api/notifications`.
- Analytics APIs: `/api/analytics/summary`, `/api/analytics/report.csv`.
- File APIs: `/api/files/upload`.
- Feedback APIs: `/api/feedback`.

## Run Locally with Docker Compose

```bash
docker-compose up --build
```

Services:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8081`
- Prometheus: `http://localhost:9090`
- Grafana: `http://localhost:3000`
- Alertmanager: `http://localhost:9093`

## Kubernetes Deployment

```bash
kubectl apply -f k8s-deployment.yaml
```

## Notes

- Complaint media files are stored under backend `uploads/`.
- Multi-language is supported at profile level (`preferredLanguage`) and can be extended in UI dictionaries.
- Replace OAuth and SMTP placeholders with secure secrets before production.
