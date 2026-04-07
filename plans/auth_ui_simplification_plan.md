# Auth UI Simplification Plan

## Goal Description
The objective is to simplify and tone down the "flashy" and over-complicated UI elements on the authentication page (`AuthPageClient.tsx`). The current design includes very small typography, extreme uppercase tracking, overly complex wording ("Digital Mail", "Establish Access", "Node 01"), and hard-to-read input contrast, making it difficult for standard users (like students) to navigate the registration or login processes. This plan focuses strictly on redesigning the authorization page while leaving the rest of the application unchanged and preserving all existing functionality and themes.

## Proposed Changes

### 1. Typography and Readability Adjustments
- Remove all instances of `text-[8px]`, `text-[9px]`, and `text-[10px]` classes.
- Replace `font-black uppercase tracking-widest` styles with standard highly readable typography: `text-sm`, `text-base`, `font-medium`, and `font-semibold`.
- Remove overly stylized combinations such as `italic tracking-tightest` that make elements difficult to parse.

### 2. Lexicon and Copywriting Simplification
We will replace the "sci-fi" jargon with conventional UI terminology:
- **Headings**: "Define Your Legacy", "Synchronize Password" → "Welcome to Maestro", "Reset Password"
- **Labels (Login)**: "Digital Mail" → "Email Address", "Security Key" → "Password", "Decrypt Access?" → "Forgot Password?"
- **Buttons (Login)**: "Establish Access" → "Sign In", "Transmitting..." → "Sending OTP..."
- **Labels (Register)**: "Legal Name" → "Full Name", "Origin Date (DOB)" → "Date of Birth", "Legacy Class" → "I am a", "Active Domain" → "Industry"
- **Steps**: "Node 01/02/03" → "Step 1/2/3"
- **OTP Fields**: "Distribution Node", "6-Digit Sync Hash" → "Email Address", "6-Digit OTP"

### 3. Contrast & Accessibility Fixes
- **Input Fields**: The current field backgrounds (`bg-white/[0.03]`) lack sufficient contrast. We will increase opacity to `bg-white/10` or a solid dark background (e.g., `bg-zinc-800`) to significantly improve visibility while preserving dark mode aesthetics.
- **Borders & Focus States**: We will use a standard outline or a simple focus ring (e.g., `focus:ring-primary focus:border-primary`) without convoluted shadow tricks.
- **Neon Reductions**: We'll tone down the aggressive glow effects (`shadow-[0_0_10px_#22d3ee]`) prioritizing a sleek and approachable interface.

### src/app/auth/

#### [MODIFY] AuthPageClient.tsx
- Update the Information Cluster components (left-side panel view).
- Standardize the `PasswordField` component styles for wider readability.
- Re-write the copy across all login, password reset, forgot password, and registration forms (steps 1-3).
- Enhance the HTML `input` and `select` element styling to ensure user convenience across the login flows. Ensure responsive and stable form layout padding.

---

## User Review Required

> [!IMPORTANT]
> The current layout includes a very distinct "sci-fi / high-tech" visual language including "Node 01", "Distribute Sync Hash", etc. We will strictly be removing this aesthetic to make it simpler to use and read. Please review the proposed text replacements. Do you want to modify any of the suggested replacement terminology before execution?

## Verification Plan
1. **Automated Testing**: Type-check and build the project verifying there are no syntax breaks upon editing `AuthPageClient.tsx`.
2. **Visual Verification**: Use `npm run dev` and visually verify whether the colors and text adjustments are simpler and readable, focusing on login screens, registration screens (Steps 1, 2, 3), and OTP pages.
3. **Flow Testing**: Validate that the Auth modes (login, OTP switch, Google Sign In, registration transitions) function cohesively with the updated structural styling.
