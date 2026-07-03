# MediFind API 💊

A backend REST API for a real-time medicine availability platform. Users can search for medicines by name and find nearby pharmacies that have them in stock — without needing to visit each one physically.

> **Status**: Functional backend, not yet production-ready. Core features tested and working.

---

## The Problem It Solves

Finding a specific medicine means visiting multiple pharmacies hoping one has it in stock. MediFind lets anyone search medicine availability across pharmacies in real time, filtered by proximity to their location.

---

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT (HTTP-only cookies)
- **Password Hashing**: bcrypt
- **Architecture**: MVC (Models, Controllers, Routes, Middleware)

---

## User Roles

| Role | What They Can Do |
|---|---|
| `user` | Search medicines by name and location — no login required |
| `shopOwner` | Register pharmacy, manage stock after admin approval |
| `admin` | Approve/reject pharmacy registrations, manage platform users |

---

## Folder Structure

```
medifind/
│
├── config/
│   └── db.js
│
├── controllers/
│   ├── authController.js
│   ├── pharmacyController.js
│   ├── medicineController.js
│   ├── stockController.js
│   ├── searchController.js
│   └── adminController.js
│
├── middleware/
│   ├── authHandler.js       # verify JWT, fetch live user from DB on every request
│   ├── isAdmin.js           # role === 'admin'
│   ├── isShopOwner.js       # role === 'shopOwner'
│   ├── isApproved.js        # pharmacy status === 'approved'
│   └── errorHandler.js      # centralized error handling
│
├── models/
│   ├── userModel.js
│   ├── pharmacyModel.js
│   ├── medicineModel.js
│   ├── stockModel.js
│
├── routes/
│   ├── authRoutes.js
│   ├── pharmacyRoutes.js
│   ├── medicineRoutes.js
│   ├── stockRoutes.js
│   ├── searchRoutes.js
│   └── adminRoutes.js
│
├── app.js
└── package.json
```

---

## API Routes

### Auth — `/api/auth`

| Method | Route | Access | Description |
|---|---|---|---|
| POST | `/register` | Public | Register as user or shopOwner |
| POST | `/login` | Public | Login — returns HTTP-only cookie |
| POST | `/logout` | Logged in | Clears auth cookie |

### Search — `/api/search` (no login required)

| Method | Route | Access | Description |
|---|---|---|---|
| GET | `/medicines?name=Para` | Public | Name-only search — returns pharmacies stocking the medicine |
| GET | `/medicines?name=Para&lat=&lng=` | Public | Location-based search — returns pharmacies within 5km, sorted by distance |

**Example response (location-based search):**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "pharmacy": {
        "name": "Appolo",
        "address": "Bengaluru",
        "openingHours": "9 AM - 10 PM"
      },
      "distance": 0,
      "units": 50,
      "price": 15,
      "isAvailable": true
    }
  ]
}
```

### Pharmacy — `/api/pharmacy`

| Method | Route | Access | Description |
|---|---|---|---|
| POST | `/` | shopOwner | Submit pharmacy for admin approval |
| GET | `/me` | shopOwner | View own pharmacy details |
| PATCH | `/me` | shopOwner (approved only) | Edit pharmacy details |

### Medicine — `/api/medicines`

| Method | Route | Access | Description |
|---|---|---|---|
| POST | `/` | shopOwner | Add medicine to global catalog |
| GET | `/` | Public | Browse full medicine catalog |
| GET | `/search?name=Para` | Public | Search medicines by name |

### Stock — `/api/stock`

| Method | Route | Access | Description |
|---|---|---|---|
| POST | `/` | shopOwner (approved) | Add medicine to own pharmacy stock |
| PATCH | `/:id` | shopOwner (approved) | Update units, price, or availability |
| GET | `/my` | shopOwner | View own pharmacy's full stock |

### Admin — `/api/admin`

| Method | Route | Access | Description |
|---|---|---|---|
| GET | `/pharmacies` | admin | List all pharmacies (any status) |
| PATCH | `/pharmacies/:id/approve` | admin | Approve a pharmacy |
| PATCH | `/pharmacies/:id/reject` | admin | Reject with a reason |
| GET | `/users` | admin | List all users |

---

## Pharmacy Approval Flow

```
shopOwner registers pharmacy
        │
        ▼
status: 'pending' — locked, cannot add stock yet
        │
        ▼
Admin reviews in dashboard
        │
        ├── Approves → status: 'approved'
        │              shopOwner can now manage stock + edit pharmacy
        │
        └── Rejects  → status: 'rejected' + rejectionReason stored
                       shopOwner sees exact reason for rejection
```

---

## Location-Based Search — How It Works

The search endpoint uses a **MongoDB aggregation pipeline** with a **Haversine distance formula** to find nearby pharmacies:

```
User sends: name=Paracetamol, lat=15.1394, lng=76.9214
        │
        ▼
1. Find medicines matching name (partial, case-insensitive)
        │
        ▼
2. Find stock entries for those medicines (isAvailable: true)
        │
        ▼
3. Join with Pharmacy collection ($lookup)
        │
        ▼
4. Filter only approved pharmacies
        │
        ▼
5. Calculate distance from user to each pharmacy (Haversine formula)
        │
        ▼
6. Filter: only within 5km
        │
        ▼
7. Sort: nearest pharmacy first
        │
        ▼
Response: pharmacy name, address, opening hours, distance, price, units
```

Requires a `2dsphere` index on the Pharmacy model's `location` field — already configured in the schema.

---

## Data Models

### User
```
name, email, password (bcrypt hashed, select: false),
role (user | admin | shopOwner), timestamps
```

### Pharmacy
```
name, address, phone, openingHours,
location: { type: 'Point', coordinates: [lng, lat] },  ← GeoJSON format
owner (ref: User),
status (pending | approved | rejected),
rejectionReason,
timestamps
Index: 2dsphere on location
```

### Medicine
```
name (unique, lowercase, trimmed),
category (ref: Category),
description,
timestamps
```

### Stock
```
pharmacy (ref: Pharmacy),
medicine (ref: Medicine),
units (min: 0),
price (min: 0),
isAvailable (boolean, default: true),
timestamps
Compound unique index: (pharmacy + medicine) — prevents duplicate stock entries
```

---

## Security

- **JWT via HTTP-only cookies** — not localStorage, prevents XSS token theft
- **Live DB role lookup on every request** — role changes (e.g., demotion) take effect immediately, no stale JWT trust
- **Three middleware layers** — `isAdmin`, `isShopOwner`, `isApproved` applied structurally via `router.use()`, not per-route
- **Pharmacy approval gate** — shopOwners cannot add or update stock until admin verifies their pharmacy
- **Compound unique index on Stock** — prevents duplicate stock entries per pharmacy+medicine combination
- **`select: false` on password** — never exposed in any query response
- **Registration field whitelisting** — `{ name, email, password }` only, prevents role injection via request body
- **Centralized error handling** — `CastError`, `ValidationError`, duplicate keys all return clean JSON, no stack traces exposed to client

---

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)

### Installation

```bash
git clone https://github.com/Urukundappa-kunda/MedifindBackend.git
cd medifind-api
npm install
```

### Environment Variables

Create a `.env` file in the root:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
PORT=3000
```

### Run

```bash
# Development
npm run dev

# Production
npm start
```

---

## Testing the Search API

**Name-only search (no login needed):**
```
GET /api/search/medicines?name=Paracetamol
```

**Location-based search (no login needed):**
```
GET /api/search/medicines?name=Paracetamol&lat=12.9081&lng=77.5663
```

Returns pharmacies within 5km of the given coordinates that have the medicine in stock, sorted nearest first.

---

## Author

**URUKUNDAPPA M** — Backend Developer  
Node.js · Express.js · MongoDB · REST APIs · JWT Authentication