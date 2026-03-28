# Healthcare Platform Microservices Starter

This project restructures the original single Spring Boot application into a beginner-friendly microservices monorepo for a healthcare platform.

## Folder structure

```text
project-root/
|-- frontend/
|-- gateway/
|-- services/
|   |-- auth-service/
|   |-- patient-service/
|   |-- doctor-service/
|   |-- appointment-service/
|   |-- payment-service/
|   |-- notification-service/
|   |-- ai-symptom-checker-service/
|   `-- telemedicine-service/
|-- docker/
|   `-- mysql/
|-- k8s/
|   |-- base/
|   |-- config/
|   `-- mysql/
|-- .env.example
|-- docker-compose.yml
`-- pom.xml
```

## What each part does

- `frontend/`: React client application.
- `gateway/`: single entry point for frontend traffic and routing to backend services.
- `services/`: independent Spring Boot services. Each service owns its controller, service, repository, entity, DTO, config, and exception packages.
- `docker-compose.yml`: runs MySQL, all services, gateway, and frontend together.
- `k8s/`: Kubernetes manifests for deployments, services, config, and secrets.

## How to restructure your existing monolith

1. Identify business modules in your current code:
   - authentication and user login logic -> `auth-service`
   - patient management -> `patient-service`
   - doctor management -> `doctor-service`
   - appointment booking -> `appointment-service`
   - payment processing -> `payment-service`
   - emails, SMS, alerts -> `notification-service`
   - AI-assisted symptom analysis -> `ai-symptom-checker-service`
   - online consultation and session management -> `telemedicine-service`
2. Move each controller, service, entity, and repository to the matching service package.
3. Keep each service database-focused on its own schema. Avoid sharing entities between services.
4. Put shared entry routing in `gateway/` instead of inside business services.
5. Point the frontend to the gateway, not directly to each backend service.
6. Replace direct in-memory calls between modules with HTTP calls using service URLs.

## Service communication

- `gateway` routes requests to all backend services.
- `appointment-service` is prepared to call `patient-service`, `doctor-service`, and `payment-service`.
- `notification-service` is prepared to call `auth-service` and `appointment-service`.
- `ai-symptom-checker-service` is prepared to call `patient-service` and `doctor-service`.
- `telemedicine-service` is prepared to call `appointment-service`, `patient-service`, `doctor-service`, and `notification-service`.
- In Docker, services communicate by container name such as `http://patient-service:8082`.
- In Kubernetes, services communicate by service DNS names such as `http://patient-service:8082`.

## Run with Docker Compose

1. Copy `.env.example` to `.env`.
2. Build and start everything:

```bash
docker compose up --build
```

3. Main URLs:
   - frontend: `http://localhost:3000`
   - gateway: `http://localhost:8080`
   - patient-service direct: `http://localhost:8082/api/patients`

## Useful commands

```bash
docker compose up --build
docker compose down
docker compose ps
mvn -pl services/patient-service spring-boot:run
```

## Next migration step

Start by moving one domain only, usually `patient-service`, until the new pattern is working end-to-end. Then repeat the same package split for the other services.
