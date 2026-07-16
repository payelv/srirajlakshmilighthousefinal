# Sri Rajlaxmi Light House — Backend Contracts

## Goal
Move all site content and admin edits from browser localStorage into MongoDB so edits are visible to every visitor.

## Data replaced (was mocked in `/app/frontend/src/mock.js`)
Full `DEFAULT_CONTENT` object (business, hero, about, categories, products, whyUs, gallery, faqs) — now stored in Mongo collection `site_content` as a single document with `_id = "singleton"`. On first API call, backend seeds it with defaults.

Admin creds `ADMIN_CREDS` (was in mock.js) — now sourced from backend `.env`:
- `ADMIN_EMAIL=payelraj26@gmail.com`
- `ADMIN_PASSWORD=rajlaxmi@2025`
- `JWT_SECRET=<random>`

## API (all under `/api`)

### `GET /api/content`
Returns entire site content document. Public. If none exists, seeds default.

Response: `{ business, hero, about, categories, products, whyUs, gallery, faqs }`

### `POST /api/admin/login`
Body: `{ email, password }` → 200 `{ token, expiresIn }` or 401.
Token is HS256 JWT with 7-day expiry.

### `PUT /api/content`
Header: `Authorization: Bearer <token>`
Body: full or partial content object → merges & saves. Returns updated content.

### `POST /api/enquiries` (public)
Body: `{ name, email, phone, message }` → 200 `{ id }`. Persists an enquiry so admin can view them later.

### `GET /api/enquiries` (auth)
Returns list of enquiries newest first.

## Frontend integration changes
- `ContentContext` — on mount, `GET /api/content`; on save, `PUT /api/content` with token from `localStorage.srl-token`. Falls back to localStorage cache while offline.
- `AdminLogin` — call `POST /api/admin/login`; store `srl-token` on success; redirect to dashboard.
- `AdminProtected` — check `srl-token` presence.
- `Contact` — after submit, POST `/api/enquiries` (still opens WhatsApp too).
- `AdminDashboard` — new **Enquiries** tab listing `GET /api/enquiries`.

## Notes
- All existing UI stays the same; only data source flips.
- CORS already permissive.
- No breaking changes to `.env` — MONGO_URL and DB_NAME already set.
