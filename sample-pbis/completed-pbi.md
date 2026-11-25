# [PBI] Self-service password reset by email link

**Labels:** pbi, done

**Summary:** Let users reset their password via a time-limited email link.

**User story:** As a registered user, I want to reset my password via email so that I can regain access without contacting support, reducing support tickets by ~30%.

**Acceptance criteria:**
1. Given a registered email, when the user requests a reset, then an email with a single-use link is sent.
2. Given a reset link older than 30 minutes, when it is opened, then the user sees an "expired" message and can request a new link.
3. Given an unregistered email, when a reset is requested, then the same confirmation is shown (no account disclosure).
4. Given a valid link, when a new password meeting policy is submitted, then the password is changed and all sessions are invalidated.

**Out of scope:** SMS or MFA-based reset.

**Dependencies/risks:** Requires the email service; risk of email enumeration (mitigated by AC3).

**Estimate:** M

**Non-functional:** Rate limit of 5 requests per hour per IP; tokens stored hashed.
