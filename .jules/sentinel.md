## 2024-05-22 - IDOR in User Profile Update
**Vulnerability:** The `createOrUpdateUser` server action in `actions/userActions.ts` accepted a `clerkUserId` parameter in the input object and used it to query and update the user record. This allowed an authenticated user to update another user's profile data by providing a different `clerkUserId` in the request payload.

**Learning:** Server actions that modify user data must always rely on the authenticated user ID (from `auth().userId`) rather than client-provided user IDs. Trusting client input for identification allows for Insecure Direct Object Reference (IDOR) attacks.

**Prevention:**
1. Always obtain the user ID from the authentication context (e.g., Clerk's `auth()`) within the server action.
2. Use this trusted ID for database queries and mutations involving user-specific data.
3. Ignore or validate any user ID passed from the client against the authenticated ID.
