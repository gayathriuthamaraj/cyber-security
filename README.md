# குழு - Community Announcement Board Platform

Secure role-based community communication platform with encrypted announcements, digital signatures, audit logging, and configurable group governance workflows.

Built with React, TypeScript, Node.js, and Express.

---

## Overview

This project explores secure distributed communication workflows through:

* role-based access control (RBAC)
* encrypted announcement delivery
* digital signature verification
* audit logging
* approval-based governance systems

The platform supports secure community/group communication with configurable posting and membership policies.

---

## Core Features

### Authentication & Authorization

* JWT-based authentication
* Email OTP verification
* System-level and group-level RBAC
* Permission-aware UI rendering

### Secure Communication

* Hybrid encryption using RSA-2048 and AES-256
* Digital signatures for authenticity verification
* Secure post storage and retrieval workflows
* Comprehensive audit logging for security events

### Group Governance

* Configurable join modes:

  * Open
  * Request-based
  * Invite-only
* Configurable posting workflows:

  * Admin-only
  * Approval-required
  * Open posting

### User Experience

* Unified announcement dashboard
* Real-time group interaction workflows
* Responsive dark-themed interface
* Security visibility dashboard

---

## Tech Stack

### Frontend

* React
* TypeScript
* Vite

### Backend

* Node.js
* Express
* JWT Authentication

### Security

* RSA-2048
* AES-256-CBC
* Digital Signatures
* SHA-256 Hashing

---

## System Architecture

```text
Client (React + TypeScript)
        ↓
Express API Layer
        ↓
Authentication & RBAC Services
        ↓
Encryption / Signature Services
        ↓
Group & Announcement Management
        ↓
Audit Logging Layer
```

---

## Security Architecture

### Authentication Flow

1. User registration with OTP verification
2. JWT-based session generation
3. Role-aware authorization middleware
4. Permission validation at service level

### Encryption Workflow

1. Announcement content encrypted using AES-256
2. AES keys exchanged securely using RSA-2048
3. Content signed using RSA digital signatures
4. Authorized users decrypt and verify integrity

---

## Project Structure

```text
backend/
 ├── controllers/
 ├── middleware/
 ├── services/
 ├── routes/
 └── models/

frontend/
 ├── components/
 ├── pages/
 ├── services/
 └── security/
```

---

## Running the Project

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```
