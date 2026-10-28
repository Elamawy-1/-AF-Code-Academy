# AF Code Academy Website

A responsive React + Vite marketing website concept for AF Code, an online coding academy for kids. The site uses editable sample content and a purple/lavender/peach visual identity.

## Run locally

1. Install Node.js (LTS).
2. Open a terminal in this folder.
3. Run:
   ```bash
   npm install
   npm run dev
   ```
4. Open the local URL printed by Vite.

To make a production build:
```bash
npm run build
npm run preview
```

## Where to edit the content

Most content lives in `src/data/siteData.js`:
- Brand contact info, WhatsApp number, social links
- Courses and each course's levels, duration, learning outcomes
- Instructor cards and skills
- Project gallery
- FAQ entries

Replace all example names, photos, durations, contact information and social URLs before publishing. Photos currently load from Unsplash, and Google Fonts are loaded online.

## Important setup notes

- Update `siteData.whatsapp` to your actual WhatsApp number, international format without `+` (Egypt example: `201xxxxxxxxx`).
- Update `siteData.email` and the social URLs.
- The contact form prepares a WhatsApp message; it does not store submissions in a database or send email by itself.
- Sample instructor details, course plans, durations, and project images are placeholders and should be replaced with confirmed academy information.
- This is a front-end prototype. It does not include admin login, student accounts, payments, or a backend/CMS.
