# IE3142 DevOps Security --- Group 51

## Building and Securing a DevSecOps Pipeline with OWASP NodeGoat

This repository contains the IE3142 DevOps Security group project based
on **OWASP NodeGoat**, an intentionally vulnerable Node.js/Express web
application backed by MongoDB.

The project demonstrates containerisation, threat modelling,
vulnerability identification and remediation, secure coding, automated
security testing, CI/CD security gates, and secure secrets management
within a DevSecOps workflow.

------------------------------------------------------------------------

## Project Overview

**Application:** OWASP NodeGoat\
**Technology Stack:** Node.js, Express, MongoDB\
**Containerisation:** Docker and Docker Compose\
**CI/CD:** GitHub Actions

The application contains two primary communicating services:

-   **NodeGoat Web Application** --- Node.js/Express application exposed
    on host port `4000`
-   **MongoDB Database** --- MongoDB 4.4 database used by NodeGoat

Docker Compose is used to build and run the complete application
environment and provide communication between the NodeGoat web
application and MongoDB.

------------------------------------------------------------------------

## System Architecture

The application is deployed using Docker Compose with two primary
services: the **NodeGoat web application** and **MongoDB**.

![NodeGoat Docker
Architecture](docs/architecture/nodegoat-architecture.png)

The main application data flow is:

``` text
Web Browser
     |
     | HTTP
     | localhost:4000
     v
NodeGoat Web Container
     |
     | MongoDB connection
     | mongodb://mongo:27017/nodegoat
     v
MongoDB Container
```

The browser communicates with the NodeGoat web container through host
port `4000`, which is mapped to port `4000` of the container.

NodeGoat communicates with MongoDB through the Docker Compose network
using the service name `mongo` and port `27017`:

``` text
mongodb://mongo:27017/nodegoat
```

MongoDB port `27017` is available for internal container communication
but is **not directly published to the host** by the Docker Compose
configuration.

The architecture therefore separates external browser access from
internal application-to-database communication.

The architecture diagram is available at:

``` text
docs/architecture/nodegoat-architecture.png
```

------------------------------------------------------------------------

## Docker and Container Security

The NodeGoat application is containerised using a multi-stage Dockerfile
based on `node:12-alpine`.

The Docker configuration includes several important deployment and
security characteristics:

-   Production Node.js dependencies are installed during the build
    stage.
-   The final application runtime uses a separate runtime stage.
-   The NodeGoat application runs using the non-root `node` user.
-   NodeGoat is exposed through host port `4000`.
-   MongoDB uses the `mongo:4.4` image.
-   MongoDB runs using the `mongodb` user.
-   MongoDB port `27017` is used internally and is not directly
    published to the host.
-   Docker Compose provides service-name-based communication between
    NodeGoat and MongoDB.
-   Application secrets are supplied through environment variables
    instead of being hardcoded in the application configuration.

Running the NodeGoat application as a non-root user follows the
principle of least privilege and reduces the potential impact of a
compromised application process.

------------------------------------------------------------------------

## Security Work Completed

The project includes:

-   STRIDE threat modelling and risk assessment
-   Five vulnerability investigations and remediations
-   Before-fix and after-fix security testing
-   Automated application build and testing
-   SAST with Semgrep
-   Dependency scanning with `npm audit`
-   Secret scanning with Gitleaks
-   Container image scanning with Trivy
-   Environment-based secret provisioning
-   GitHub Actions CI/CD security gates
-   GitHub Actions encrypted repository secrets

------------------------------------------------------------------------

## Vulnerabilities Investigated

Five security vulnerabilities were investigated as part of the project:

1.  **NoSQL Injection** --- `validateLogin` in `app/data/user-dao.js`
2.  **Sensitive Data Exposure / Missing Encryption at Rest** --- SSN and
    DOB handling in `app/data/profile-dao.js`
3.  **Regular Expression Denial of Service (ReDoS)** --- Bank routing
    validation in `app/routes/profile.js`
4.  **Insecure Direct Object Reference (IDOR) / Broken Access Control**
    --- Allocations functionality in `app/routes/allocations.js`
5.  **Plaintext Password Storage** --- Signup/login functionality in
    `app/data/user-dao.js`

The technical report contains the detailed vulnerability analysis,
exploitation evidence, remediation steps, and post-remediation testing.

------------------------------------------------------------------------

## STRIDE Threat Model

A STRIDE-based threat model and risk assessment were produced for the
NodeGoat application.

The threat model considers the application's components, data flows,
trust boundaries, threats, likelihood, impact, and corresponding
security controls.

The detailed threat model is available at:

``` text
security/threat-model.md
```

The STRIDE categories considered include:

-   **S** --- Spoofing
-   **T** --- Tampering
-   **R** --- Repudiation
-   **I** --- Information Disclosure
-   **D** --- Denial of Service
-   **E** --- Elevation of Privilege

------------------------------------------------------------------------

## Prerequisites

Install the following before running the project:

-   Git
-   Docker Desktop
-   Docker Compose

Docker Desktop must be running before executing Docker Compose commands.

------------------------------------------------------------------------

## Clone the Repository

``` bash
git clone https://github.com/jeramystanley/IE3142-DevSecOps-G51.git
cd IE3142-DevSecOps-G51
```

------------------------------------------------------------------------

## Secrets and Environment Variables

Application secrets are supplied through environment variables instead
of being hardcoded in the application configuration.

The application requires:

``` text
NODEGOAT_SESSION_SECRET
NODEGOAT_CRYPTO_KEY
```

The application configuration accesses these values using `process.env`.

### PowerShell --- Local Development

For local development, temporary values can be generated for the current
PowerShell session:

``` powershell
$env:NODEGOAT_SESSION_SECRET = [Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
$env:NODEGOAT_CRYPTO_KEY = [Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

These values exist only in the current PowerShell environment.

**Do not commit real secret values to the repository.**

For the CI/CD pipeline, the corresponding secret values are stored using
GitHub Actions encrypted repository secrets.

------------------------------------------------------------------------

## Run with Docker Compose

Ensure Docker Desktop is running and the required environment variables
have been configured.

Build and start the complete application:

``` bash
docker compose up -d --build
```

Check the running services:

``` bash
docker compose ps
```

A successful deployment should show both the `web` and `mongo` services
running.

The NodeGoat web service is published on:

``` text
0.0.0.0:4000->4000/tcp
```

MongoDB should be available internally on:

``` text
27017/tcp
```

When both services are running, access NodeGoat at:

``` text
http://localhost:4000
```

New users can be registered through the NodeGoat application and used to
test authenticated application functionality.

Stop the application with:

``` bash
docker compose down
```

------------------------------------------------------------------------

## CI/CD Security Pipeline

The DevSecOps workflow is located at:

``` text
.github/workflows/devsecops.yml
```

The workflow is configured to execute on pushes and pull requests to the
`main` branch and can also be started manually.

The pipeline contains the following security and build activities:

1.  **Build Application** --- builds the NodeGoat Docker image
2.  **Automated Tests** --- installs dependencies and executes the
    project's automated test command
3.  **SAST --- Semgrep** --- performs static application security
    testing
4.  **Dependency Scan --- npm audit** --- identifies vulnerable Node.js
    dependencies
5.  **Secret Scan --- Gitleaks** --- checks the repository for exposed
    secrets
6.  **Container Scan --- Trivy** --- scans the built container image for
    HIGH and CRITICAL vulnerabilities

Security gates are configured to fail the pipeline when findings exceed
their configured thresholds.

A failed security gate therefore represents enforcement of the project's
security policy rather than simply reporting a warning.

------------------------------------------------------------------------

## Secrets Management

Two application secrets are managed through environment variables:

``` text
NODEGOAT_SESSION_SECRET
NODEGOAT_CRYPTO_KEY
```

For local Docker execution, Docker Compose obtains these values from the
user's environment and passes them to the NodeGoat web container.

The application configuration reads the values using:

``` javascript
process.env.NODEGOAT_SESSION_SECRET
process.env.NODEGOAT_CRYPTO_KEY
```

This prevents the application secret values from being directly
hardcoded into the application configuration.

For GitHub Actions, the required values are stored using encrypted
repository secrets. The workflow verifies that the required secrets are
configured without printing their values.

Secret values must not be committed to the repository or included in
screenshots, documentation, or logs submitted as evidence.

------------------------------------------------------------------------

## Project Evidence

Docker and deployment evidence is stored under:

``` text
docs/screenshots/
```

Current deployment evidence includes:

``` text
00-repository-cloned.png
01-docker-build-success.png
02-docker-containers-running.png
03-nodegoat-running-browser.png
04-nodegoat-login-success.png
```

The system architecture diagram is stored at:

``` text
docs/architecture/nodegoat-architecture.png
```

Additional vulnerability, threat-modelling, CI/CD, and security-testing
evidence is documented in the technical report and relevant project
files.

------------------------------------------------------------------------

## Team Contributions

### Jeramy

Responsible for:

-   CI/CD pipeline implementation
-   GitHub Actions configuration
-   Automated security gates
-   Automated testing integration
-   Secrets management
-   Repository integration and documentation
-   Final project integration

### Dushiev

Responsible for:

-   Docker deployment verification
-   Docker Compose configuration analysis
-   Container architecture documentation
-   NodeGoat and MongoDB deployment verification
-   Architecture diagram
-   Data-flow and trust-boundary documentation
-   Docker deployment evidence

### Oshan

Responsible for:

-   STRIDE threat modelling
-   Threat identification
-   Risk assessment
-   Likelihood and impact analysis
-   Security-control recommendations
-   Threat-model documentation

### Senuda

Responsible for:

-   Vulnerability assessment
-   Exploitation testing
-   Five vulnerability remediations
-   Post-remediation security testing
-   Before-fix and after-fix evidence
-   Vulnerability-related security analysis

Detailed individual contributions and AI usage disclosures are provided
in the technical report.

------------------------------------------------------------------------

## Repository Structure

Important project files and directories include:

``` text
.
├── .github/
│   └── workflows/
│       └── devsecops.yml
├── app/
│   ├── data/
│   └── routes/
├── artifacts/
├── config/
├── docs/
│   ├── architecture/
│   │   └── nodegoat-architecture.png
│   └── screenshots/
├── security/
│   └── threat-model.md
├── docker-compose.yml
├── Dockerfile
├── package.json
└── README.md
```

------------------------------------------------------------------------

## Security Testing Scope

All vulnerability testing performed for this project is limited to the
team's own NodeGoat development environment.

NodeGoat is intentionally vulnerable and is used in this project
strictly for authorized educational security testing.

Security testing should not be performed against systems without
explicit authorization.

------------------------------------------------------------------------

## Ethical Use

NodeGoat is an intentionally vulnerable educational application.

Vulnerability demonstrations for this project should be performed only
against the group's own local/project environment for authorized
academic testing.

The techniques demonstrated in this project are intended for secure
software engineering education and defensive security analysis.

------------------------------------------------------------------------

## Original Project

This project is based on the OWASP NodeGoat open-source application.

Refer to the upstream OWASP NodeGoat project documentation for
additional information about the original application.

------------------------------------------------------------------------

## License

The original NodeGoat project is licensed under the Apache License 2.0.
