# Mister Subsidie Form Frontend

React + Vite application for collecting SLIM-subsidy intake data and creating SignWell signing sessions.

## Getting Started

```bash
npm install
npm run dev
```

## Environment Variables

Copy `.env.example` to `.env` and adjust as needed. Key settings:

- `VITE_API_BASE_URL` – Azure Functions base URL.
- `VITE_FUNCTION_CODE` – Function key required by protected endpoints.
- `VITE_ALLOW_TENANT_OVERRIDE` – Set to `true` locally when you want to force a different tenant via `?tenant=...`. Defaults to `false` in examples so production builds ignore the override.
- `VITE_TENANT_ID` – Optional hard override for tenant id. When set, URL/hostname detection is skipped.
- `VITE_AUTH_*` – Fallback authorization contact details if the API cannot be reached.

## Tenant Detection

Tenant configuration is loaded once during app bootstrap through `useTenantInfo`.

Precedence rules:
1. `VITE_TENANT_ID`
2. `?tenant=` query string (only in dev/local or when `VITE_ALLOW_TENANT_OVERRIDE=true`)
3. Hostname/subdomain heuristics (`mistersubsidie`, `ignite`, or default)

The resolved tenant id is sent with authorization info requests and the SignWell signing payload so the backend can select the correct tenant configuration.

If the API call fails, the app falls back to the default authorization contact data defined in the environment variables.
