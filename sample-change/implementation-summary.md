# Implementation summary: Self-service password reset

- New endpoint `POST /auth/password-reset/request` generates a 32-byte random token, stores its SHA-256 hash, and emails a link.
- Token expiry: 30 minutes, single use.
- New endpoint `POST /auth/password-reset/confirm` validates the token, applies the password policy (min 12 chars), updates the password and revokes all sessions.
- Request endpoint returns an identical response for known and unknown emails.
- Rate limit: 5 requests per hour per IP.
- Email template: `reset-password.html`.
