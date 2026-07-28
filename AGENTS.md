<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

# Project Context 
# .agent folder ‌အောက်က rules & workflows တွေကို ဖတ်ပြီးလိုက်နာပေးပါ ။ 


## Project Snapshot

- Runtime: Next.js 16.2.9 App Router, React 19.2.4, TypeScript strict mode.
- Styling: Tailwind CSS v4 through `@tailwindcss/postcss`, shadcn-style local primitives in `components/ui`.
- Data: backend API calls through `lib/api/client.ts`; all service responses should be validated with Zod schemas in `lib/api/schemas.ts`.
- State: TanStack Query for client-side auth and mutations; server pages fetch with services directly.
- Auth: Google Identity Services posts ID tokens to `/auth/google`; cookies are included on every API request.
- Domain: concert listing, admin concert and ticket inventory creation, ticket reservation holds, purchase confirmation.

## Knowledge Base Files

- `project-map.md`: architecture, routes, folder ownership, dependency boundaries.
- `engineering-rules.md`: hard rules and conventions for future edits.
- `api-data-playbook.md`: API client, schemas, services, query keys, error handling.
- `ui-ux-playbook.md`: UI system, accessibility, responsive design, shadcn/Tailwind rules.
- `workflow-playbooks.md`: repeatable workflows for features, forms, auth, checkout, admin, and bug fixes.
- `verification-playbook.md`: build, lint, browser verification, screenshots, and failure triage.
- `maintenance-log.md`: durable project facts and decisions that future agents should update.

## Default Task Flow

1. Read the focused playbook.
2. Inspect nearby code before designing changes.
3. Make the smallest coherent change that fits existing boundaries.
4. Run `npm run build` for meaningful frontend changes.
5. For UI changes, verify in browser screenshots at desktop and mobile widths.
6. Update this `.agent` knowledge base when a new durable rule or workflow is discovered.

## Do Not Break

- Do not bypass `apiFetch`.
- Do not skip Zod validation for API responses or form inputs.
- Do not move reservation and purchase logic out of the existing service/hook pattern without a strong reason.
- Do not remove `credentials: "include"` from API requests.
- Do not treat auth `401` on `/auth/me` as a fatal app error; unauthenticated users are valid.
- Do not change checkout, admin, or auth behavior while doing visual-only work.
- Do not introduce broad dependencies without checking whether local primitives already solve the problem.


<!-- END:nextjs-agent-rules -->
