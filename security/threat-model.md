# NodeGoat STRIDE Threat Model

## 1. Scope

This threat model covers the OWASP NodeGoat web application and the main components involved in processing and storing application data. The scope includes the user-facing web application, Node.js/Express application logic, authentication and authorization mechanisms, session handling, and the MongoDB database.

The purpose of this threat model is to identify realistic security threats using the STRIDE methodology, assess their likelihood and potential impact, and identify appropriate security controls that can reduce the associated risks.

---

## 2. System Architecture

The main components of the NodeGoat system are:

- User / Browser
- NodeGoat web application
- Node.js / Express application server
- MongoDB database
- Authentication and session-management mechanisms
- Authorization mechanisms

### Basic Data Flow

```text
+------------------+
|  User / Browser  |
+--------+---------+
         |
         | HTTP Requests / Responses
         v
+--------------------------+
| NodeGoat Web Application |
|    Node.js / Express     |
+------------+-------------+
             |
             | Database Queries
             v
+--------------------------+
|     MongoDB Database     |
| User & Application Data  |
+--------------------------+
```

The user interacts with NodeGoat through a web browser. HTTP requests are sent to the Node.js/Express application, which processes user input, applies application logic, performs authentication and authorization checks, and communicates with MongoDB when data needs to be stored or retrieved.

---

## 3. Assets

The following assets require protection within the NodeGoat environment:

1. **User accounts** - User identities and account information must be protected from unauthorized access.
2. **User credentials** - Authentication credentials must remain confidential and must not be exposed to unauthorized users.
3. **Session information** - Session identifiers and authentication state must be protected because they are used to identify authenticated users.
4. **User and application data** - Information stored and processed by NodeGoat must be protected against unauthorized disclosure or modification.
5. **MongoDB database** - The database contains application and user information and therefore requires confidentiality, integrity, and controlled access.
6. **NodeGoat application** - Application functionality must be protected against unauthorized manipulation and malicious input.
7. **Authentication and authorization mechanisms** - These controls determine user identity and what resources an authenticated user is permitted to access.

---

## 4. Trust Boundaries

A trust boundary exists when data moves between components or actors with different levels of trust.

Two important trust boundaries have been identified in the NodeGoat architecture.

### Trust Boundary 1: User / Browser to NodeGoat Application

External users cannot automatically be trusted. Data received from the browser may contain malicious or manipulated input.

The NodeGoat application should therefore validate user input and enforce authentication and authorization controls before processing protected operations.

### Trust Boundary 2: NodeGoat Application to MongoDB

The application communicates with MongoDB to retrieve and modify stored information.

Database operations must be carefully controlled because insecure queries, insufficient validation, or missing authorization checks could allow unauthorized access or modification of stored information.

---

## 5. STRIDE Threat Analysis

STRIDE categorizes security threats as:

- **S - Spoofing:** Pretending to be another user or entity.
- **T - Tampering:** Unauthorized modification of data.
- **R - Repudiation:** Performing an action and later denying that it occurred.
- **I - Information Disclosure:** Unauthorized exposure of information.
- **D - Denial of Service:** Preventing legitimate users from accessing a system or service.
- **E - Elevation of Privilege:** Obtaining permissions beyond those that should be available.

The following threats were identified for the NodeGoat application.

| ID | STRIDE Category | Threat Scenario | Affected Component | Likelihood | Impact | Risk | Proposed Control |
|---|---|---|---|---:|---:|---:|---|
| T1 | Spoofing | Attacker impersonates another user by abusing authentication or session information. | Authentication / Session Management | 3 | 4 | 12 | Secure session management, strong authentication, session expiration |
| T2 | Tampering | Attacker modifies application or user data without authorization. | NodeGoat / MongoDB | 3 | 4 | 12 | Server-side authorization and input validation |
| T3 | Information Disclosure | Attacker accesses private information belonging to another user. | NodeGoat / MongoDB | 4 | 5 | 20 | Access control, secure queries, safe output handling |
| T4 | Elevation of Privilege | Normal user accesses resources or functionality without permission. | Authorization Layer | 3 | 5 | 15 | Server-side authorization, object-level access control, least privilege |
| T5 | Denial of Service | Attacker sends excessive or crafted requests that consume application resources. | NodeGoat Web Application | 3 | 4 | 12 | Rate limiting, request limits, input validation |

---

## 6. Risk Assessment Method

Likelihood and impact are assessed using a scale from 1 to 5.

### Likelihood Scale

| Rating | Level | Description |
|---:|---|---|
| 1 | Very Low | Threat is unlikely under normal circumstances. |
| 2 | Low | Threat is possible but requires unusual conditions. |
| 3 | Medium | Threat could realistically occur if the weakness exists. |
| 4 | High | Threat has realistic and accessible attack opportunities. |
| 5 | Very High | Threat can be attempted frequently or with minimal difficulty. |

### Impact Scale

| Rating | Level | Description |
|---:|---|---|
| 1 | Very Low | Minimal effect on the application or users. |
| 2 | Low | Limited security or operational impact. |
| 3 | Medium | Noticeable impact on users, data, or application operation. |
| 4 | High | Significant compromise of security, data, or functionality. |
| 5 | Very High | Severe compromise involving sensitive data or unauthorized access. |

The risk score is calculated using:

**Risk Score = Likelihood x Impact**

For this assessment, the following risk levels are used:

| Risk Score | Risk Level |
|---:|---|
| 1-4 | Low |
| 5-9 | Medium |
| 10-16 | High |
| 17-25 | Critical |

---

## 7. Risk Assessment and Justification

### T1 - Spoofing

**Likelihood: 3 (Medium)**

Authentication and session mechanisms are exposed to interactions from external users. If session information or authentication controls are handled insecurely, an attacker could attempt to impersonate a legitimate user. The likelihood is therefore considered medium.

**Impact: 4 (High)**

Successful impersonation could allow an attacker to perform actions using another user's identity and potentially access information associated with that account.

**Risk Score: 3 x 4 = 12 (High)**

**Proposed controls:**

- Secure session management
- Strong authentication
- Session expiration
- Secure cookie configuration
- Regeneration of session identifiers when appropriate

### T2 - Tampering

**Likelihood: 3 (Medium)**

NodeGoat accepts user-controlled input that may eventually influence application operations and stored information. If authorization or validation is insufficient, malicious users may attempt to modify data they should not control.

**Impact: 4 (High)**

Unauthorized modification could compromise the integrity of user or application data and may affect the reliability of information stored in MongoDB.

**Risk Score: 3 x 4 = 12 (High)**

**Proposed controls:**

- Server-side authorization
- Input validation
- Controlled database operations
- Validation of resource ownership
- Rejection of unexpected input

### T3 - Information Disclosure

**Likelihood: 4 (High)**

The application stores and processes information associated with multiple users. User-controlled requests interact with application and database resources, creating realistic opportunities for attackers to attempt unauthorized data access if security controls are insufficient.

**Impact: 5 (Very High)**

Successful exploitation could expose confidential information belonging to other users or reveal sensitive application data. This represents a serious loss of confidentiality.

**Risk Score: 4 x 5 = 20 (Critical)**

**Proposed controls:**

- Strong access-control checks
- Secure database queries
- Input validation
- Safe output handling
- Restriction of sensitive information returned to clients

### T4 - Elevation of Privilege

**Likelihood: 3 (Medium)**

Authenticated users can interact with application resources. If authorization is not enforced correctly on the server, a normal user may attempt to access resources or operations outside their permitted privileges.

**Impact: 5 (Very High)**

Successful privilege escalation could allow unauthorized access to protected functionality or resources and could result in serious confidentiality or integrity violations.

**Risk Score: 3 x 5 = 15 (High)**

**Proposed controls:**

- Server-side authorization
- Object-level access-control checks
- Role and permission validation
- Least-privilege access
- Never relying only on client-side authorization controls

### T5 - Denial of Service

**Likelihood: 3 (Medium)**

The NodeGoat web application receives requests from external clients. An attacker could attempt to send excessive requests or specially crafted input designed to consume application resources.

**Impact: 4 (High)**

A successful denial-of-service attack could reduce application availability and prevent legitimate users from accessing the service.

**Risk Score: 3 x 4 = 12 (High)**

**Proposed controls:**

- Rate limiting
- Request-size limits
- Input validation
- Application timeouts
- Resource monitoring
- Appropriate error handling

---

## 8. Risk Summary

| ID | Threat | Likelihood | Impact | Risk Score | Risk Level |
|---|---|---:|---:|---:|---|
| T1 | Spoofing | 3 | 4 | 12 | High |
| T2 | Tampering | 3 | 4 | 12 | High |
| T3 | Information Disclosure | 4 | 5 | 20 | Critical |
| T4 | Elevation of Privilege | 3 | 5 | 15 | High |
| T5 | Denial of Service | 3 | 4 | 12 | High |

Based on this assessment, information disclosure has the highest initial risk score because unauthorized access to user or application data could have a severe confidentiality impact. The remaining identified threats are also considered high risk and require appropriate security controls.

---

## 9. Security Control Mapping

| Threat | Main Security Controls |
|---|---|
| Spoofing | Strong authentication, secure session management, session expiration and secure cookies |
| Tampering | Input validation, server-side authorization, ownership validation and controlled database operations |
| Information Disclosure | Access control, secure queries, safe output handling and restriction of sensitive information |
| Elevation of Privilege | Server-side authorization, object-level access control and least privilege |
| Denial of Service | Rate limiting, request limits, timeouts, input validation and resource monitoring |

The controls identified in the threat model should be connected to the security improvements implemented during vulnerability remediation.

---

## 10. Mapping to Vulnerability Testing

The threat model provides the security context for the vulnerability testing performed on NodeGoat.

The team will demonstrate five vulnerabilities in the application. Once those vulnerabilities have been confirmed, each applicable vulnerability will be mapped to the relevant STRIDE threat and security control.

For each confirmed vulnerability, the technical assessment will include:

1. Identification of the vulnerable functionality.
2. Demonstration of the vulnerability against the vulnerable version.
3. Evidence showing the successful exploit.
4. Implementation of an appropriate security control or code-level fix.
5. Repetition of the same exploit against the remediated version.
6. Evidence demonstrating that the exploit is no longer successful.
7. Relevant static-analysis findings where applicable.

This mapping will demonstrate how the threats identified during threat modelling relate to the security weaknesses and controls implemented in the NodeGoat application.

---

## 11. Conclusion

The STRIDE analysis identified five significant threat scenarios affecting NodeGoat, including spoofing, tampering, information disclosure, elevation of privilege, and denial of service.

The risk assessment indicates that unauthorized information disclosure represents a particularly significant concern because of its potential effect on user confidentiality. The other identified threats also require security controls such as secure session management, input validation, server-side authorization, least-privilege access, secure database interactions, and rate limiting.

The threat model will be updated where necessary after the team's five application vulnerabilities have been confirmed and remediated so that the final threat-to-control mapping reflects the actual implementation and testing evidence.