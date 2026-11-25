# Self-service password reset by email link

## Overview
Registered users can reset their password via a time-limited email link, enabling them to regain access without contacting support. This reduces support tickets by reducing the number of access recovery requests that must be handled manually.

## How it works
1. User requests a password reset by providing their email address.
2. If the email is registered, a single-use reset link is sent via email (valid for 30 minutes).
3. User clicks the link and submits a new password meeting the minimum length policy (12 characters).
4. The password is changed and all active sessions are invalidated, requiring the user to sign in again.
5. Expired or reused links are rejected with an "expired" message, prompting the user to request a new link.

The system returns the same confirmation message for both registered and unregistered emails, preventing account enumeration attacks.

## Technical notes

### Endpoints
- **`POST /auth/password-reset/request`** – Initiates a password reset request.
  - Generates a 32-byte random token.
  - Stores the SHA-256 hash of the token (not the token itself).
  - Sends an email with a reset link containing the token.
  - Returns an identical response for known and unknown emails.
  - Subject to rate limiting: 5 requests per hour per IP address.

- **`POST /auth/password-reset/confirm`** – Completes the password reset.
  - Validates the provided reset token.
  - Enforces password policy: minimum 12 characters.
  - Updates the user's password.
  - Revokes all active sessions for the user.

### Token management
- **Expiry:** 30 minutes from generation.
- **Single use:** Tokens cannot be reused; a new reset request must be made.
- **Storage:** Tokens are stored as SHA-256 hashes in the database.

### Security and rate limiting
- Rate limit: 5 requests per hour per IP address. The 6th request is blocked.
- Email enumeration mitigation: Both registered and unregistered emails receive the same response (no indication of account existence).
- Session revocation: Password changes invalidate all existing sessions to prevent unauthorized access.

### Email
- Email template: `reset-password.html`

## Acceptance criteria and verification

| Criterion | Evidence |
| --- | --- |
| Given a registered email, when the user requests a reset, then an email with a single-use link is sent. | Test: "Reset email sent for registered user" – Passed |
| Given a reset link older than 30 minutes, when it is opened, then the user sees an "expired" message and can request a new link. | Test: "Expired token rejected after 30 min" – Passed |
| Given an unregistered email, when a reset is requested, then the same confirmation is shown (no account disclosure). | Test: "Unknown email returns same response" – Passed |
| Given a valid link, when a new password meeting policy is submitted, then the password is changed and all sessions are invalidated. | Test: "Password change revokes sessions" – Passed |
| Rate limit of 5 requests per hour per IP. | Test: "Rate limit blocks 6th request" – Passed |

**Test suite:** 5 passed, 0 failed (Pipeline run #482).

## Known limitations / out of scope
- SMS-based password reset.
- Multi-factor authentication (MFA) based reset.
- Password reset via phone or security questions.

## Dependencies
- Email service must be operational to send reset links.

## References
- **PBI:** [PBI] Self-service password reset by email link (sample-pbis/completed-pbi.md)
- **Implementation summary:** sample-change/implementation-summary.md
- **Test results:** sample-change/test-results.md
- **Pull request:** TODO: confirm with team
