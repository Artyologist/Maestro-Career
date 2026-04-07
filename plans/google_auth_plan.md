# Google Authentication Implementation Plan

## Goal
Implement a Google Authentication flow using Supabase to allow users to sign up or log in via Google. For new signups, the flow must bypass standard registration steps (1 and 2) and land directly on Step 3 for profile customization (profession, user type, etc.).

## Phase 1: Environment & Supabase Configuration
- Ensure Google OAuth is enabled in Supabase Authentication > Providers.
- Provide callback URI to Google Cloud Console (typically `https://<project>.supabase.co/auth/v1/callback`).
- Add Next.js app URL `http://localhost:3000/auth/confirm` to Supabase URL Configuration Redirect URLs.

## Phase 2: Frontend Implementation (`src/app/auth/AuthPageClient.tsx`)
1. **Google Sign-In Button**:
   - Add a visually distinct "Sign in with Google" button below the standard email/password inputs for both the Login and Registration screens.
2. **OAuth Trigger**:
   - Add a `handleGoogleSignIn` function invoking `supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: \`${window.location.origin}/auth/confirm?next=/auth?setup=1\` } })`.
3. **Routing & State Management**:
   - Introduce an effect to detect `?setup=1`.
   - On detecting `setup=1`, query `/api/auth/me`. If the session exists and `onboardingCompleted` is false, change `authMode` to `"register"` and `registerStep` to `3`.
   - Pre-fill `registerData.fullName` and `email` using the Google user metadata returned from `/api/auth/me` so that step 3's validation (`isRegisterStepThreeValid`) passes.
   - Add a field in Step 3 for the user to edit their "Full Name" if they jumped from Google Auth, ensuring they have control over their name and to pass name validation.

## Phase 3: Backend Verification
- Ensure `/app/api/auth/profile/setup` accepts the data directly. Currently `completeProfileFromSession` properly records onboarding and handles `userType`, `city`, `domain`, etc. No major backend changes are needed as `confirm` route and setup APIs are already capable.

## Verification Plan
1. Click the Google button and log in with a Google Account.
2. Wait for redirection to `/auth?setup=1`.
3. Confirm Step 3 Profile Setup appears correctly with pre-filled name.
4. Complete Step 3 and ensure the user is forwarded to the Dashboard and `onboardingCompleted` is registered.
