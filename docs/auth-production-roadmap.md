# Auth Production Roadmap

This project currently has a hardened interim auth layer (with secure OTP handling and rate limiting) while you prepare production infrastructure.

## What Is Already Implemented

- OTP values are no longer stored in plain text; only salted hashes are persisted.
- Auth endpoints include basic server-side rate limiting for OTP request/verify and password login.
- OTP delivery is provider-driven through `OTP_PROVIDER` (`mock`, `twilio`, `resend`).
- Session cookies remain `httpOnly` and `secure` in production.
- Strict auth errors can be enabled (`AUTH_STRICT_ERRORS=true`) to reduce account enumeration risk.

## Recommended Providers (Freemium -> Production Scale)

### SMS + WhatsApp OTP

1. Twilio
- Why: enterprise-grade reliability, global delivery, strong compliance tooling.
- Free/trial: trial credits with verified recipient limits.
- Scale fit: excellent for high traffic and multi-country rollout.
- In this codebase: set `OTP_PROVIDER=twilio`, add Twilio env values.

2. MessageBird
- Why: strong omnichannel APIs and enterprise support.
- Free/trial: trial credits available depending on region.
- Scale fit: strong; good fallback/secondary provider.

3. Vonage (Nexmo)
- Why: mature SMS APIs, global coverage.
- Free/trial: limited credits.
- Scale fit: strong for large-scale OTP.

### Email OTP

1. Resend
- Why: modern API, excellent developer experience, good deliverability for transactional flows.
- Free/trial: free tier suitable for early stage.
- Scale fit: good; move to paid plans as volume grows.
- In this codebase: set `OTP_PROVIDER=resend`, add Resend env values.

2. Amazon SES
- Why: low cost at high volume, mature deliverability controls.
- Free/trial: AWS free tier for new accounts.
- Scale fit: very strong for large volume.

3. SendGrid
- Why: common enterprise choice with strong templates and analytics.
- Free/trial: free tier available.
- Scale fit: strong.

## Provider Strategy for Production

- Primary: Twilio (SMS/WhatsApp) + Resend (Email)
- Fallback: MessageBird or Vonage for SMS failover
- Policy:
  - Registration OTP: mobile first
  - Login OTP: channel based on identifier (email/mobile)
  - If provider fails, return a retryable error and log incident telemetry

## Supabase Migration Plan (When Credentials Are Available)

1. Create Supabase project
- Enable Postgres + Auth settings + Row Level Security.
- Add service role keys in server-only env.

2. Replace JSON file auth store
- Migrate users, otp challenges, sessions, and activity logs to Postgres tables.
- Keep hashed password + hashed OTP approach.

3. Add DB constraints and indexes
- Unique indexes on email and mobile.
- Index OTP and session lookup columns (`identifier`, `tokenHash`, `expiresAt`).

4. Add background cleanup
- TTL cleanup for expired OTP challenges and sessions.
- Scheduled job or DB native cleanup strategy.

5. Observability
- Add audit logs for auth events and provider failures.
- Add dashboard metrics: OTP success rate, resend frequency, failed login rate.

## Security Checklist Before Launch

- Keep `AUTH_DEBUG_OTP=false` in all non-local environments.
- Set `AUTH_STRICT_ERRORS=true` in production.
- Keep `OTP_PROVIDER=mock` only for local/dev.
- Enforce HTTPS everywhere; cookies must be `secure` in production.
- Rotate provider API keys and store them in secure secret management.
- Add CAPTCHA on OTP request endpoints if abuse starts increasing.
- Add backup OTP provider before paid campaigns drive traffic.

## Next Work Item

After provider credentials are available:
- Implement `sms` and `whatsapp` templates for live providers.
- Move auth storage to Supabase/Postgres and keep current API contracts unchanged.
