/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DOCUSIGN_INTEGRATION_KEY: string
  readonly VITE_API_BASE_URL: string
  readonly VITE_FUNCTION_CODE?: string
  readonly VITE_TENANT_ID?: string
  readonly VITE_AUTH_ORGANISATIE: string
  readonly VITE_AUTH_KVK_NUMMER: string
  readonly VITE_AUTH_CONTACTPERSOON: string
  readonly VITE_AUTH_EMAIL: string
  readonly VITE_AUTH_TELEFOON: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
