# AegisLend AI: Secure Digital Lending & Agentic AI Platform
**Project Proposal & Architecture Report**

**Prepared for:** Final Year CSE Project Submission  
**Date:** August 2026  

---

## Executive Summary
AegisLend AI is a secure, AI-driven digital lending platform designed to bridge the gap between deterministic banking logic and intelligent customer assistance. Unlike conventional systems that delegate financial approvals to Large Language Models (LLMs), AegisLend AI relies on a strict, database-driven Eligibility Engine for loan qualification. The AI serves as a personal loan advisor, orchestrating communication and managing appointments, while a parallel Hybrid Intrusion Detection System (IDS) continuously monitors and protects customer sessions. The platform integrates Customer Banking, the AI Loan System, and a Security Center into a scalable database architecture.

---

## 1. Project Overview

**AegisLend AI** allows existing bank customers to:
*   Authenticate using MPIN and risk-based verification.
*   Receive personalized loan recommendations based on stored financial data.
*   Schedule capacity-controlled loan appointments through an Agentic AI.
*   Complete applications through a highly secure workflow.

**Key Distinction:**
The system strictly separates financial logic from AI execution. The **Deterministic Eligibility Engine** handles loan qualification, while the AI assumes the role of a personal loan advisor. This ensures that financial approvals are not delegated to probabilistic LLM outputs, maintaining regulatory and logical integrity.

---

## 2. Core Differentiators

The system is distinguished by two primary architectural pillars:

### 1. Banking & Agentic AI Differentiator
A structured workflow that processes:
`Customer Data + Credit Score ➔ Deterministic Eligibility Engine ➔ AI Loan Advisor ➔ Appointment Capacity Engine ➔ Waitlist ➔ Secure Processing`

### 2. Advanced Cybersecurity Differentiator
A **Hybrid IDS (Signature + Behavioral ML)** featuring:
*   Concurrent-login detection.
*   A 2-minute identity challenge mechanism.
*   Adaptive session and account protection.
*   An integrated Admin Security Center.

---

## 3. System Architecture

The platform operates across three integrated subsystems, all feeding into a scalable database architecture:

1.  **Customer Banking:** Handles Account + MPIN, OTP / Face Challenge, and Dashboard.
2.  **AI Loan System:** Manages Loan Agent / RM Agent, RAG Integration, and Recommendation.
3.  **Security Center:** Operates the Hybrid IDS (Sig + ML), Risk & Policy Engines, and Admin Security Manager.

### Core Process Flow
1.  **Deterministic Eligibility Engine**
2.  **Loan Matching & Customer Interest**
3.  **Appointment Engine & Capacity Check**
4.  **Loan Application & Security Check**
5.  **Authorized Processing (Approved / Rejected)**
6.  **Database Layer:** PostgreSQL + Redis + Vector DB

---

## 4. AI Loan Appointment & Capacity Engine

The AI acts as an intelligent intermediary, strictly bound by the outputs of the Deterministic Eligibility Engine. Once eligibility is confirmed, the AI initiates the Appointment Capacity Engine.

### Key Features

*   **Capacity Management:**
    *   Appointment slots are governed by strict capacity rules (e.g., maximum **100 applications per slot**).
    *   The AI assesses slot availability dynamically and offers alternatives if capacity is reached.

*   **Waitlist & Slot Release:**
    *   Appointments feature a defined arrival window (e.g., **1:45 PM – 2:15 PM**).
    *   If a customer misses the window, the slot is marked as `MISSED` and automatically released to the waitlist queue.

*   **Reminders:**
    *   Automated notifications are dispatched at **24-hour**, **1-hour**, and **active-time** intervals.

*   **Comprehensive Application States:**
    The system tracks discrete statuses to maintain a complete historical ledger of customer interactions:
    *   `INTERESTED`
    *   `APPOINTMENT_BOOKED`
    *   `APPOINTMENT_MISSED`
    *   `APPLICATION_STARTED`
    *   `APPROVED`
    *   `REJECTED`

---

## 5. Cybersecurity & Hybrid IDS

The cybersecurity framework operates in parallel with the lending workflow, evaluating risks continuously without degrading the user experience unless an anomaly is detected.

### Concurrent Login & Adaptive Account Actions
The system features a unique response mechanism to concurrent login attempts:

1.  **Trigger:** Attacker attempts concurrent login.
2.  **Response:** Alert triggered on the genuine user's device.
3.  **Challenge:** 2-Minute Identity Verification Challenge (Face Verification).
    *   **SUCCESS:** Current session retained; attacker rejected.
    *   **TIMEOUT:** Session terminated; app auto-saved; re-authentication required.

### Admin Security Manager
The Admin Security Manager enforces adaptive restrictions based on the Hybrid IDS risk score:

| Risk Level | Action |
| :--- | :--- |
| **Low** | Allow transaction. |
| **Medium** | Issue OTP or Challenge. |
| **High** | Terminate session + temporary restriction (e.g., 15 mins to 24 hours). |
| **Critical** | Terminate all sessions + account lock + escalate to Admin Alert. |

---

## 6. Database Schema Design

The backend architecture utilizes a highly normalized **PostgreSQL** structure designed to support a robust Computer Science system rather than a simplified chatbot application.

### Domain Breakdown

| Domain | Key Tables |
| :--- | :--- |
| **Identity & Access** | `customers`, `customer_profiles`, `devices`, `sessions`, `otp_codes` |
| **Lending & Rules** | `loan_products`, `loan_eligibility_rules`, `loan_applications`, `loan_application_history` |
| **Appointment Engine** | `appointments`, `appointment_slots`, `appointment_capacity`, `waitlist` |
| **Cybersecurity** | `security_events`, `ids_alerts`, `risk_scores`, `security_incidents`, `account_restrictions` |
| **Agentic AI & RAG** | `chat_sessions`, `chat_messages`, `rag_documents` |
| **Operations** | `notifications`, `audit_logs` |

---

## 7. Admin Management Dashboard

The Admin Center unifies business management and cybersecurity into a single pane of glass, providing real-time visibility into the platform's operational health.

### Loan Operations
*   Displays live appointment capacities (e.g., **10:00 ➔ 92/100**).
*   Tracks application pipeline states: `Submitted`, `Under Review`, `Approved`, `Rejected`, `Missed`.

### Security Operations
*   Surfaces real-time threat metrics categorized by severity: `Critical`, `High`, `Medium`, `Locked`.
*   Allows administrators to:
    *   Review false positives.
    *   Audit logs.
    *   Authorize the release of permanent account restrictions.

---

## Conclusion

AegisLend AI represents a comprehensive Computer Science and Systems Engineering project that effectively decouples deterministic financial logic from generative AI capabilities. By utilizing a deterministic Eligibility Engine for core banking decisions and an Agentic AI for user interaction and appointment management, the platform avoids the security and reliability risks associated with LLM-driven financial approvals. Furthermore, the integration of a Hybrid IDS with adaptive response mechanisms ensures robust protection against concurrent login attacks and other security threats, supported by a highly normalized database schema for operational integrity.