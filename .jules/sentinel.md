## 2024-05-22 - IDOR in User Profile Update
**Vulnerability:** The `createOrUpdateUser` server action in `actions/userActions.ts` accepted a `clerkUserId` parameter in the input object and used it to query and update the user record. This allowed an authenticated user to update another user's profile data by providing a different `clerkUserId` in the request payload.

**Learning:** Server actions that modify user data must always rely on the authenticated user ID (from `auth().userId`) rather than client-provided user IDs. Trusting client input for identification allows for Insecure Direct Object Reference (IDOR) attacks.

**Prevention:**
1. Always obtain the user ID from the authentication context (e.g., Clerk's `auth()`) within the server action.
2. Use this trusted ID for database queries and mutations involving user-specific data.
3. Ignore or validate any user ID passed from the client against the authenticated ID.

## 2025-05-27 - Unprotected Server Action Logic for Wallet Credits
**Vulnerability:** The `addWalletCredit` function in `actions/walletActions.ts` was exported from a file marked with `"use server"`. This exposed it as a public API endpoint that could be called by any authenticated user with arbitrary parameters (userId, amount), allowing unauthorized wallet balance modifications.

**Learning:** Functions exported from files with `"use server"` are automatically exposed as public endpoints. Internal utility functions that perform sensitive operations (like adding credit) but don't perform their own authorization checks must NOT be placed in `"use server"` files if they are exported.

**Prevention:**
1. Move sensitive internal logic to separate utility files (e.g., `lib/`) that do not have `"use server"`.
2. Only export functions from `"use server"` files that are intended to be directly called by the client and include robust authorization checks.
3. Treat all exported functions in `"use server"` files as public API endpoints.
