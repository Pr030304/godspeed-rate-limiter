# Rate Limiting SDK with Admin Panel — POC

This project is a full-stack Proof of Concept (POC) for a **context-aware, rule-driven rate limiting SDK** with a configurable Admin Panel and testing tools. It was built as part of a selection process for **Godspeed Systems**.

---

##  Overview

### Goal
To create a smart gateway that applies rate limiting logic based on:

- **User/Org metadata** from JWT tokens
- **Service-specific usage context**
- **Dynamic rules** from a centralized Admin Panel

###  Components

| Component        | Description                                                                 |
|------------------|-----------------------------------------------------------------------------|
| `rate-limiter-sdk/` | Reusable middleware to enforce rate limits on incoming requests          |
| `admin-backend/`     | Node.js + MongoDB backend to store rules and serve context              |
| `frontend-react/`    | React-based admin panel to create/update/delete rate limit rules        |
| `sdk-test-server.js` | Express-based test server to simulate protected endpoints               |

---

## ⚙️ Features

- JWT-based user identification
- Rule evaluation using service name, usage quota, user tier, user-agent
- Caching of rule sets for performance
- Context fetched fresh on each request
- Returns `429 Too Many Requests` when limits exceeded
- Visual Admin Panel to manage rules
- Secure, extensible architecture

---

## Getting Started

### Clone the Repo

```bash
git clone git@github.com:<your-username>/godspeed-rate-limiter.git
cd godspeed-rate-limiter
