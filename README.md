# Fiyr Partners Portal

Affiliate portal for `partner.fiyr.io`.

## Setup

```bash
cp .env.example .env
npm install
npm run dev
```

Set `VITE_API_BASE_URL` to your uzmos-api origin (no trailing slash).

## Deploy

GitHub Actions FTP deploy (same pattern as `fiyr_customer`). Configure secrets:

- `VITE_API_BASE_URL`
- `PLESK_FTP_HOST`
- `PLESK_FTP_USER`
- `PLESK_FTP_PASSWORD`
- `PLESK_FTP_PATH` (document root for partner.fiyr.io)

Point DNS `partner.fiyr.io` at the Plesk host.
