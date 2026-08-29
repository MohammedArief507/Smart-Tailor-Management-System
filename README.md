# Smart Tailor Management System

A simple, mobile-first web app to replace the paper notebook used in a tailor shop
for bills, transactions, customers, and measurements.

All 10 modules are complete:
- **Module 1: Authentication** — Register, Login, Logout
- **Module 2: Dashboard** — Today's Income, Today's Bills, Total Customers, Total Products, Recent Transactions
- **Module 3: Billing** — Select customer, add products, adjust quantity, automatic total, payment method, save bill
- **Module 4: Product Management** — Add, edit, delete products with image upload
- **Module 5: Transactions** — Browse saved bills, search, filter by date
- **Module 6: Measurements** — Blouse, Chudithar, and Pant measurements per customer, save and edit
- **Module 7: Customers** — Full add/edit/search screen
- **Module 8: Profile** — Shop Name, Owner Name, Phone Number, and Logout
- **Module 9: Settings** — Light Mode / Dark Mode
- **Module 10: About** — Application Version, Developer Information

## Project Structure

```
tailor-app/
├── backend/     Node.js + Express + MongoDB API
└── frontend/    React (Vite) + Tailwind CSS mobile-first UI
```

## Backend Setup

```bash
cd backend
npm install
cp .env.example .env   # see below for what to put in it
npm run dev             # starts on http://localhost:5000
```

**Database — two options:**

- **Local MongoDB (default, recommended for development)** — install
  [MongoDB Community Server](https://www.mongodb.com/try/download/community)
  and [MongoDB Compass](https://www.mongodb.com/try/download/compass) to
  view your data. Once MongoDB is running on your machine, `.env.example`'s
  default `MONGO_URI=mongodb://127.0.0.1:27017/tailor-shop` will just work —
  no further setup needed. Open Compass and connect to
  `mongodb://127.0.0.1:27017` any time to browse your data visually.
- **MongoDB Atlas (cloud)** — see the commented-out option in
  `.env.example`. Note: on some Windows networks, the `mongodb+srv://`
  connection string fails with `querySrv ECONNREFUSED`. If that happens,
  use Atlas's **"Legacy URI String"** toggle on the Connect screen instead
  — it gives a plain `mongodb://` string that avoids the DNS lookup that's
  being blocked.

You'll also need to set a `JWT_SECRET` in `.env` — any long random string works.

## Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env    # points the app at your backend URL
npm run dev              # starts on http://localhost:5173
```

Open the app on your phone or resize your browser to ~375px wide to see the
mobile-first design as intended.

## Module 1: Authentication — what's included

- **Register** — shop name, owner name, phone, email, password
- **Login** — email + password, returns a JWT stored in the browser
- **Logout** — clears the session
- Passwords are hashed with bcrypt; protected routes require a valid JWT
- A temporary placeholder Dashboard screen shows the logged-in shop name and
  a working Logout button — this will be replaced entirely by the real
  Dashboard in Module 2.

## Module 2: Dashboard — what's included

- Stat cards for Today's Income, Today's Bills, Total Customers, Total Products
- Recent Transactions list (last 5), pulled live from the database
- `GET /api/dashboard` aggregates data from the new `Customer`, `Product`, and
  `Transaction` models (schemas only for now — full CRUD screens for these
  come in their own modules)
- All dashboard data is scoped to the logged-in shop owner, so multiple shops
  can safely use the same backend without seeing each other's data
- Introduced the shared app chrome used from here on: `MainLayout` (bottom
  nav + floating "+" button) and `BottomNav`. The other nav tabs
  (Bills, Customers, Measure, Profile) currently show a "coming soon" screen
  until their modules are built
- The temporary Logout button has moved from the old placeholder screen onto
  the real Dashboard header, and will move again into Profile once that
  module is built

## Module 3: Billing — what's included

- Full billing flow at the **+** button: select or quick-add a customer,
  tap products to add them with a +/- quantity stepper, see the bill total
  update automatically, choose Cash or GPay, then **Save Bill**
- Saving a bill calls `POST /api/transactions`, which creates the
  transaction — this is what makes it show up instantly on the Dashboard
- The server always recalculates the total from the current product prices
  in the database (never trusts amounts sent from the browser), so the bill
  total can't be tampered with
- Since **Product Management** (Module 4) and **Customers** (Module 7)
  aren't built yet, Billing includes small inline "quick add" forms for
  both — just enough to create a product or customer on the spot. These
  reuse the same `POST /api/products` and `POST /api/customers` endpoints
  that the full modules will use later; only the dedicated edit/delete/
  image-upload/search screens are still to come
- Products and customers are scoped per shop owner, same as the Dashboard

## Module 4: Product Management — what's included

- Full CRUD: **Add**, **Edit**, and **Delete** products, each with an
  optional photo, name, and price
- Images are uploaded with Multer, stored on disk under
  `backend/uploads/products/`, and served statically at `/uploads/...`
- Deleting a product (or replacing its photo) also deletes the old image
  file from disk, so uploads don't pile up
- Reached from the Dashboard — tap the **Total Products** stat card to open
  the Products screen. It doesn't have its own bottom-nav tab since the
  original nav only covers Home / Bills / Customers / Measure / Profile
- The same `POST /api/products` endpoint Billing already used for its
  quick-add now also accepts an image — both flows share one backend route,
  so nothing from Module 3 had to change
- Delete asks for confirmation with a plain browser confirm dialog, kept
  intentionally simple rather than building a custom modal

## Module 5: Transactions — what's included

- The **Bills** tab in the bottom nav now shows every saved bill, newest first
- Search matches customer name, phone number, or any product name in the bill
- Date filter narrows the list to a single day; a small total is shown for
  whatever's currently in view
- `GET /api/transactions` supports `?search=` and `?date=YYYY-MM-DD` query
  params. For a shop's realistic transaction volume, search is done in
  memory after the date filter narrows things down — simpler than building
  a text index for data this size
- Reuses the same `TransactionListItem` component the Dashboard already used
  for Recent Transactions, so the two screens look and feel consistent

## Module 6: Measurements — what's included

- The **Measure** tab: select a customer, then switch between Blouse,
  Chudithar, and Pant tabs — each with exactly the fields you specified
- Saving is really an upsert: the first save creates the record, saving
  again for the same customer + category updates it — that's how editing
  works, no separate "edit mode" needed
- A green checkmark appears on a category's tab once it has saved data, so
  it's obvious at a glance what's already been measured
- Field keys are shared between frontend (`measurementFields.js`) and
  backend (`measurementController.js`) so both sides always agree on what's
  valid for each category
- Reused the same customer picker from Billing (moved to a shared
  `components/CustomerPicker.jsx`) instead of duplicating that search/quick-add
  logic a second time

## Module 7: Customers — what's included

- The **Customers** tab in the bottom nav now has its own dedicated screen:
  Add, Edit, and Search, matching the spec exactly (no delete — that wasn't
  in your list for this module, unlike Products)
- Search matches name or phone, debounced as you type
- `PUT /api/customers/:id` was added for editing; the list/search and
  quick-add endpoints from Module 3 are unchanged and still power Billing
  and Measurements' inline customer picker
- Dashboard's **Total Customers** card now links here too, same pattern as
  **Total Products**

## Module 8: Profile — what's included

- View and edit **Shop Name**, **Owner Name**, and **Phone Number**
  (email is shown read-only since it's the login identifier)
- `PUT /api/auth/profile` updates the user; the app updates its stored
  session immediately afterward, so the new shop name shows up on the
  Dashboard header without needing to log out and back in
- **Logout** has moved here permanently — the temporary button that lived
  on the Dashboard header since Module 1 has been removed

## Module 9: Settings — what's included

- Light Mode / Dark Mode toggle, reached via **Profile → Settings**
- `ThemeContext` applies/removes Tailwind's `dark` class on `<html>` and
  remembers the choice in `localStorage`, so it persists across sessions
- Every screen built so far already had `dark:` variants wired in from the
  start (see the color theme setup in Module 1), so this module is really
  just the switch that turns it on — no other screens needed changes
- Added a small menu section to Profile (Settings, and a placeholder for
  About) — About becomes a real screen in Module 10

## Module 10: About — what's included

- A simple, static screen showing **Application Version** and **Developer
  Information**, reached via **Profile → About**
- All three editable details (version, developer name, contact) sit as
  plain constants at the top of `frontend/src/pages/About.jsx` — update
  those three lines to personalize it, no other code needed
- Removed the temporary `ComingSoon` placeholder page — every module now
  has its real screen, so it's no longer needed anywhere

## Project Complete

All 10 modules from the original spec are built, wired together, and
tested (`npm run build` passes cleanly on the frontend; every backend file
passes a Node syntax check). See the module notes above for what each one
covers and the handful of implementation choices made along the way.

## Figma UI Update — what changed

Rebuilt Bill, Measurements, and Transactions to closely match the actual
Figma reference frames (not just "inspired by" — matched structurally),
without touching architecture or removing anything:

- **`AppHeader`** (new, shared by Bill/Transactions/Measurements): a solid
  teal bar with back + home icons, and an underline-style tab strip
  ("Calculate | Transaction | Measurements") directly beneath it, edge to
  edge — matches the Figma header exactly. Bottom Navigation, Profile, and
  Settings are all untouched.
- **Bill page ("Calculator")**: products are now a 2-column card grid —
  square photo with an edit-pencil badge on the corner, name, price, and a
  green **ADD** button that becomes a quantity stepper once added — matching
  the Figma cards exactly (previously this was a plain list). A floating +
  opens Product Management to add a new product, same as the Figma flow.
- **New Product form**: rebuilt with labeled `Name:` / `Price: ₹` fields, an
  `Image:` box with an **Import** button, and **Save** (green) / **Cancel**
  (red) buttons — matching the Figma "New products" screen layout.
- **Transactions page**: rebuilt as a plain bordered table (Date | Customer
  | Amount | Payment) with a search bar + toggleable **Filter** button for
  the date, instead of the card-based ledger from the previous pass.
  **Investment** (the feature explicitly requested in the original text
  spec, which isn't in the Figma frames) is shown as small red text under
  the amount rather than a full column, so it doesn't disrupt the table
  layout Figma shows.
- **Measurements**: rebuilt as the three-screen flow shown in Figma —
  (1) a **Blouse / Chudithar / Pant** menu, (2) a searchable table of
  customers who already have that category saved (Name | Last Modified,
  with a "Create new" button and a floating +), and (3) the
  pick-a-customer-then-fill-in-fields screen, with fields now a
  single-column list (label left, input right) instead of a 2-column grid.
  A new backend endpoint, `GET /api/measurements/category/:category`,
  powers step (2).
- **Investment/Profit tracking**: unchanged from the previous pass —
  Products still have an optional Cost Price field, and every bill still
  snapshots it to compute Investment and Profit.
- Not touched in this pass: Splash/Login/Registration screens, and the
  Product Management list page (edit/delete rows) — your Figma export
  included those frames too, but the written requirements only asked for
  Bill/Transactions/TopBar, so I left them as they were rather than assume.
  Say the word if you'd like those matched to Figma as well.

## Tech Notes

- `bcryptjs` is used instead of `bcrypt` — same security, but pure JavaScript
  so it installs without needing to compile native code. This keeps setup
  simple for a beginner-friendly project.
- Dark mode is wired up via Tailwind's `class` strategy so it's ready for the
  Settings module later, but the toggle itself will be built then.
