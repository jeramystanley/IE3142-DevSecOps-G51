\# NodeGoat STRIDE Threat Model



\## 1. Scope



This threat model covers the NodeGoat web application, its authentication and authorization functions, application data, and the MongoDB database used by the application.



The purpose is to identify security threats using the STRIDE methodology and identify appropriate security controls.



\## 2. System Architecture



The main components of the NodeGoat system are:



\* User / Browser

\* NodeGoat web application

\* Node.js / Express application server

\* MongoDB database



\### Basic Data Flow



```text

User / Browser

&#x20;     |

&#x20;     v

NodeGoat Web Application

&#x20;     |

&#x20;     v

Node.js / Express

&#x20;     |

&#x20;     v

MongoDB Database

```



The user communicates with the NodeGoat application through HTTP requests. The application processes requests and communicates with MongoDB to store and retrieve application data.



\## 3. Assets



The main assets requiring protection are:



1\. User accounts

2\. User credentials

3\. Session information

4\. User/application data

5\. MongoDB database

6\. NodeGoat application

7\. Authentication and authorization functions



\## 4. Trust Boundaries



The main trust boundaries are:



\* Between the external user/browser and the NodeGoat application.

\* Between the NodeGoat application and the MongoDB database.



Users should not be trusted to directly access or modify protected application or database resources.



\## 5. STRIDE Threat Analysis



| ID | STRIDE Category        | Threat                                                                                                    | Affected Component                  | Likelihood | Impact | Risk | Proposed Control                                                          |

| -- | ---------------------- | --------------------------------------------------------------------------------------------------------- | ----------------------------------- | ---------: | -----: | ---: | ------------------------------------------------------------------------- |

| T1 | Spoofing               | An attacker may attempt to impersonate another user by abusing authentication or session information.     | Authentication / Session Management |          3 |      4 |   12 | Secure session management, authentication controls and session expiration |

| T2 | Tampering              | An attacker may attempt to modify application data without authorization.                                 | NodeGoat / MongoDB                  |          3 |      4 |   12 | Server-side authorization and input validation                            |

| T3 | Information Disclosure | An attacker may attempt to access another user's private or sensitive information.                        | NodeGoat / MongoDB                  |          4 |      5 |   20 | Access control, secure queries and output filtering                       |

| T4 | Elevation of Privilege | A normal user may attempt to access functionality or data intended for another user or a privileged user. | Authorization                       |          3 |      5 |   15 | Server-side authorization and least privilege                             |

| T5 | Denial of Service      | An attacker may send excessive or specially crafted requests that consume application resources.          | NodeGoat Web Application            |          3 |      4 |   12 | Rate limiting, request limits and input validation                        |



\## 6. Risk Assessment



Likelihood and impact are rated from 1 to 5.



\### Likelihood



\* \*\*1\*\* = Very Low

\* \*\*2\*\* = Low

\* \*\*3\*\* = Medium

\* \*\*4\*\* = High

\* \*\*5\*\* = Very High



\### Impact



\* \*\*1\*\* = Very Low

\* \*\*2\*\* = Low

\* \*\*3\*\* = Medium

\* \*\*4\*\* = High

\* \*\*5\*\* = Very High



Risk is calculated as:



\*\*Risk = Likelihood × Impact\*\*



The identified risks are:



\* \*\*T1 Spoofing:\*\* 3 × 4 = 12

\* \*\*T2 Tampering:\*\* 3 × 4 = 12

\* \*\*T3 Information Disclosure:\*\* 4 × 5 = 20

\* \*\*T4 Elevation of Privilege:\*\* 3 × 5 = 15

\* \*\*T5 Denial of Service:\*\* 3 × 4 = 12



\## 7. Security Controls



The proposed controls include:



\* Strong authentication

\* Secure session management

\* Server-side authorization

\* Input validation

\* Secure database queries

\* Output filtering

\* Least-privilege access

\* Rate limiting

\* Request/resource limits



\## 8. Mapping to Vulnerability Testing



The threats identified above will be compared with the five vulnerabilities demonstrated in the NodeGoat application.



For each confirmed vulnerability, the team will document:



1\. The vulnerable behavior

2\. The exploit procedure

3\. The security fix

4\. The same exploit repeated after the fix

5\. Evidence showing that the vulnerability has been mitigated



