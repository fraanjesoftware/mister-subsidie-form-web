# API Payloads Documentation

This document describes exactly what JSON is sent to each backend endpoint.

## Application ID Generation

**Generated on:** Frontend when user leaves CompanyDetails step (step 0)

**Format:** `CompanyName-dd-mm-yyyy`

**Example:** `Voorbeeld BV-21-10-2025`

**Code:** `src/utils/applicationId.ts:generateApplicationId()`

The `applicationId` is:
- Generated client-side from company name + current date
- Saved to localStorage automatically
- Used in all subsequent backend calls
- Cleared when user completes the form

---

## 1. Submit Company Data (Step 0 → Step 1)

**Endpoint:** `POST ${apiBaseUrl}/api/submitCompanyData?code=${functionCode}`

**When:** User clicks "Volgende" on CompanyDetails step (step 0)

**Purpose:** Create application folder and save company data as Excel

**Payload:** Complete FormData + applicationId + tenantId

```json
{
  // All FormData fields
  "bedrijfsnaam": "Voorbeeld BV",
  "kvkNummer": "12345678",
  "email": "contact@voorbeeld.nl",
  // ... all other form fields ...

  // Generated fields
  "applicationId": "Voorbeeld BV-21-10-2025",
  "tenantId": "mistersubsidie"
}
```

**Expected Response:**
```json
{
  "success": true
}
```

**Backend Tasks:**
- Create folder: `Voorbeeld BV-21-10-2025/`
- Generate Excel from FormData
- Save as `company-data.xlsx` in folder
- Optionally start CRM sync

---

## 2. Upload Bank Statement (Step 1 → Step 2)

**Endpoint:** `POST /api/bankStatements`

**When:** User clicks "Volgende" on BankStatement step (step 1)

**Purpose:** Save bank statement PDF to application folder

**Payload:** `FormData` (multipart/form-data)

```
file: [Binary PDF file]
applicationId: "Voorbeeld BV-21-10-2025"
kvkNummer: "12345678"
bedrijfsnaam: "Voorbeeld BV"
```

**Expected Response:**
```json
{
  "success": true
}
```

**Backend Tasks:**
- Find/create application folder by `applicationId`
- Save PDF file to folder (e.g., `Voorbeeld BV-21-10-2025/bankStatement.pdf`)
- Validate file is PDF and under 10MB

---

## 3. Create Signing Session (Final Step)

**Endpoint:** `POST ${apiBaseUrl}/api/createSignWellTemplateSession?code=${functionCode}`

**When:** User clicks final submit button on Authorization step

**Purpose:** Create SignWell signing session and associate with application

**Payload:** SignWell session data + applicationId + complete FormData

```json
{
  // SignWell specific fields (from buildSigningSession)
  "template_id": "...",
  "name": "Machtiging - Voorbeeld BV",
  "recipients": [...],
  "fields": [...],

  // Our custom fields
  "applicationId": "Voorbeeld BV-21-10-2025",
  "tenantId": "mistersubsidie",
  "test": false
}
```

**Expected Response:**
```json
{
  "success": true,
  "documentId": "signwell_doc_id"
}
```

**Backend Tasks:**
- Create SignWell signing session
- Store signed documents in application folder when completed (via webhook)
- Send confirmation email via SignWell

---

## Complete Flow Summary

1. **Step 0 → 1:**
   - Frontend generates `applicationId` (CompanyName-dd-mm-yyyy)
   - Submits company data to backend → Backend creates folder + Excel file

2. **Step 1 → 2:**
   - Upload bank statement with `applicationId` → Backend saves to folder

3. **Final Step:**
   - Submit SignWell payload with `applicationId`
   - Backend creates signing session and stores signed docs when completed

All files end up in the same folder: `Voorbeeld BV-21-10-2025/`
- `company-data.xlsx` (from step 0)
- `bankStatement.pdf` (from step 1)
- `signed-documents.pdf` (from final step)

---

## LocalStorage Behavior

### What's Stored
The entire `FormData` object is automatically saved to localStorage (excluding the file itself):
- Key: `mister-subsidie-form-data`
- Includes: All form fields **including `applicationId`**
- Auto-saved: Every 500ms (debounced) when form data changes

### When It's Cleared
- When user reaches `/bedankt` (EndPage) - completion
- When user clicks "Nieuwe aanvraag"

### Persistence Flow
1. User fills CompanyDetails → auto-saved to localStorage
2. User clicks "Volgende" → `applicationId` generated and saved to localStorage
3. User closes browser → data persists
4. User returns → form data **and** `applicationId` restored
5. User can continue from where they left off

### Re-generation Prevention
If `applicationId` already exists in formData, generation is skipped:
```typescript
// In App.tsx:35
if (currentStep === 0 && !formData.applicationId) {
  const applicationId = generateApplicationId(formData);
  handleInputChange('applicationId', applicationId);
}
```
