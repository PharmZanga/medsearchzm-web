# MedSearch Africa backend foundation

## Technology decision

The repository already declares Laravel 12, Laravel Sanctum and Spatie roles/permissions. The production backend will therefore use Laravel as the authoritative API, MySQL as the initial relational database, Sanctum for authenticated clients and server-enforced role permissions for administrators.

Firebase is not the primary database. It may later be used for push notifications or live chat only after the Laravel records and access rules are established.

## Product modules preserved

The backend plan preserves the functions already represented in the mobile design and public demo:

1. Global search and filters
2. Pharmacies
3. Hospitals and other health facilities
4. Medicines and facility stock visibility
5. Medical services and booking availability
6. Patient medical profile and MedSearch Health ID
7. Healthcare community
8. Shopping cart and medicine orders
9. Appointments and telemedicine
10. Caroline assistant
11. Patient, healthcare-worker and facility accounts
12. Administrator verification, moderation, operations, billing, analytics and audit functions

## Delivery sequence

### Phase 1 — public catalogue (started)

- Core users, facilities, medicines and services tables
- Facility-to-medicine inventory and price records
- Facility-to-service availability and price records
- Public search, facility, medicine and service endpoints
- Only active and verified facilities are exposed publicly

### Phase 2 — identity and administration (started)

- Registration and login implemented with Laravel Sanctum tokens
- Phone verification integration
- Patient, healthcare-worker and facility self-registration roles implemented
- Administrator roles are seeded securely and cannot self-register publicly
- Facility verification submission and review workflow implemented
- Permission-protected administrator verification endpoints implemented
- Verification audit logging and private document storage implemented

Current administrator roles are super administrator, verification officer, community moderator, operations manager, finance manager and data analyst. Permissions are enforced by the backend and are not based on hiding buttons in the user interface.

### Phase 3 — transactions and care journeys

- Cart and orders
- Prescription review safeguards
- Appointments and telemedicine
- Notifications and payments
- Medical profile with field-level encryption and access logs

### Phase 4 — community and Caroline

- Posts, comments, reports and moderation
- Assistant conversations with clinical safety boundaries
- Human escalation and emergency guidance
- AI decision and safety audit records

## Initial API routes

All endpoints are versioned under `/api/v1`.

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/health` | Backend health check |
| GET | `/search?q=` | Search facilities, medicines and services |
| GET | `/facilities` | Filter verified pharmacies, hospitals and other facilities |
| GET | `/facilities/{id}` | Open a verified facility profile |
| GET | `/medicines` | Browse and filter the medicine catalogue |
| GET | `/medicines/{id}` | View medicine and pharmacy availability |
| GET | `/services` | Browse medical services and available facilities |
| POST | `/auth/register` | Register a patient, healthcare worker or facility account |
| POST | `/auth/login` | Log in using an email address or phone number |
| GET | `/auth/me` | Return the authenticated user, roles and permissions |
| POST | `/auth/logout` | Revoke the current access token |
| POST | `/facility-verifications` | Submit a facility and private verification documents |
| GET | `/admin/facility-verifications` | Review applications with the required permission |
| PATCH | `/admin/facility-verifications/{id}/review` | Approve, reject or request more information |

## Safety rules

- GitHub Pages remains a public demonstration and must not store patient data.
- Medical profiles, prescriptions, identity documents and payment details must never be placed in frontend environment variables or public repositories.
- Facilities remain hidden until verification is approved.
- Prescription medicines cannot be completed as ordinary over-the-counter purchases.
- Medical-profile and assistant modules remain disabled for production data until authentication, authorization, encryption, consent and audit logging have been tested.
