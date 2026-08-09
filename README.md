# Concert Tickets Frontend

Next.js 16 App Router frontend for public concert discovery, ticket reservation, authentication, and inventory administration.

## Local Development

```bash
npm install
npm run dev
```

Configuration:

- `NEXT_PUBLIC_API_BASE_URL` — backend `/api/v1` URL.
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID` — optional Google Identity Services client ID.

## Verification

```bash
npm run lint
npm run build
```

## Architecture

- `app/(public)` — server-rendered public routes.
- `app/(public)/my-tickets` — authenticated reservation and purchase history.
- `app/admin` — admin routes protected by `AdminGate`.
- `components/ui` — local UI primitives and variants.
- `lib/services` — Zod-validated API services behind `apiFetch`.
- `hooks` and `lib/query` — client queries, mutations, and stable query keys.

The backend remains the authorization boundary. Protected user data is fetched client-side after the admin guard succeeds so the browser can send the API-host HttpOnly cookie.
