# Next Level Fitness — website (phase 1: frontend)

Open `index.html` in a browser, or in VS Code use the **Live Server** extension
(right-click `index.html` → "Open with Live Server").

## Files

```
index.html        page structure — sections, nav, footer, join-flow modal shell
css/styles.css    all styling, design tokens live in :root at the top
js/data.js        >>> THE ONLY FILE YOU NORMALLY EDIT <<<
js/app.js         rendering, join flow, validation, Razorpay handshake
assets/logo.webp  logo with the white plate removed (logo.png is the same, larger)
```

## Editing content

Everything the client can change lives in `js/data.js` in the `NLF` object:
branches, plans, owner, achievements, gallery, testimonials, contact.

Anything set to `null` or left as an empty array renders as a visible
"pending" placeholder instead of a made-up value. That is intentional —
add the real data and the placeholder disappears by itself.

Examples:

- Set `NLF.contact.phone = "+919XXXXXXXXX"` and the Call buttons activate.
- Set `NLF.contact.whatsapp = "919XXXXXXXXX"` and the floating WhatsApp
  button + mobile sticky bar start working.
- Add an object to `NLF.plans` and the membership cards, the comparison and
  step 2 of the join flow all pick it up automatically.
- Set a branch's `image` to a file path and it replaces the photo placeholder.

## Still to verify with the owner

- Kumaraswamy Layout address and opening hours (from the public listing —
  each shows a "Verify" badge until `addressVerified` / `hoursVerified` is true).
- Which of the three Google Maps share links belongs to which branch.
- Branch 2 and Branch 3 names, addresses, phone numbers.
- Branch 4 stays as "coming soon" until the location is known.

## Going live (phase 2 — not built yet)

`NLF.api.live` is `false`. While it's false the enquiry form validates and
logs its payload, and the payment step explains the flow without charging.

Flip it to `true` once these server routes exist:

- `POST /api/enquiries`        save a lead to MongoDB
- `POST /api/orders`           create a Razorpay order **server-side**
- `POST /api/payments/verify`  verify the Razorpay signature **server-side**

Secrets (`RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `MONGODB_URI`,
`GOOGLE_MAPS_API_KEY`) go in environment variables on the server.
None of them belong in these files.

## Moving this into Next.js

The section markup maps one-to-one onto components, and `js/data.js` becomes
`lib/data.ts`. Nothing here depends on a build step, so it can be ported
piece by piece.
