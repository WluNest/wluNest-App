# wluNest

A full-stack student housing platform for Wilfrid Laurier University and UWaterloo students — centralizing apartment discovery, interactive map browsing, student reviews, and roommate matching into one place.

Built to solve the fragmented off-campus housing market in Waterloo, where students typically bounce between Kijiji, Facebook groups, and word of mouth to find housing.

---

## Features

- **Property listings** — create, browse, update, and delete apartment listings with deep filtering by beds, baths, and price
- **Interactive map view** — visualize all listings on a real coordinate map using React Leaflet
- **Student reviews** — trusted reviews tied to verified student accounts
- **Roommate matching** — opt-in system where users flag themselves as looking for a roommate, filterable by religion, gender, university, year, and program
- **Image uploads** — up to 10 images per listing with secure file handling
- **Role-based admin dashboard** — admin users can oversee the platform and remove any listing or user
- **JWT authentication** — full login/signup flow with encrypted passwords and protected routes

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, React Router DOM v7, Axios, Vanilla CSS |
| Maps | React Leaflet v5 |
| Backend | Node.js, Express.js |
| Auth | JWT (jsonwebtoken), bcryptjs |
| File uploads | Multer |
| Database | MySQL (mysql2) |
| Geocoding | Custom local CSV geocoder (csv-parser) |

---

## Architecture

**Monorepo** split into decoupled `client/` and `server/` directories with independent dependency management.

**Auth flow:** Custom `authenticateToken` middleware in `auth.js` intercepts all protected requests, verifies the JWT signature against `JWT_SECRET`, and attaches the decoded user payload to the request object. Admin routes run a second `requireAdmin` middleware layer to strictly block privilege escalation.

**Relational database design:** Highly normalized MySQL schema in `schema.sql` using junction tables (`users_saves`, `users_reviews`, `users_listings`) for many-to-many relationships, `ON DELETE CASCADE` foreign keys for referential integrity, and read-optimized indexes (`idx_username`, `idx_listing_user_id`).

**Static assets:** Express serves the local `/images` directory via `express.static`, allowing the frontend to resolve listing image URLs dynamically from the same server.

---

## Engineering Highlights

**Custom local geocoder (coordinateLookup.js)**
Rather than paying for Google Maps or Mapbox geocoding APIs, the backend streams a 7.4MB `PostalCodes.csv` file using `csv-parser` to match user-provided postal codes to exact latitude/longitude coordinates on the fly. API cost: $0. Known tradeoff: this is an O(N) I/O operation on listing creation — a production migration would move the dataset into a MySQL table or PostGIS for O(log N) indexed lookups.

**Secure file upload pipeline**
Multer configuration explicitly restricts uploads to `.jpg` only, enforces a hard 10MB size limit, generates cryptographically unique filenames to prevent collisions, and organizes images into per-listing subdirectories by `listing_id`.

**Layered RBAC middleware**
Admin routes chain two middleware functions: `authenticateToken` first verifies the JWT, then `requireAdmin` checks the decoded role. No admin capability is reachable without both checks passing, preventing privilege escalation at the route level.

**Optimized SQL schema**
The schema was designed with production patterns: `CHECK (price >= 0)` constraints, proper data types throughout, indexes on high-read columns, and full relational integrity via foreign keys.

---

## Known Limitations

- **Local file storage** — images are saved to the Node server's disk. Horizontal scaling or serverless deployment requires migration to S3 or Cloudinary
- **O(N) geocoding** — streaming a CSV per listing creation is not production-scale; a PostGIS or indexed MySQL table would fix this
- **No automated tests** — integration and unit test coverage is not yet implemented

---

## Running Locally

**Prerequisites:** Node.js v18+, MySQL

**1. Database setup**
```bash
mysql -u root -p < server/schema.sql

# Optional: seed with sample data
mysql -u root -p wluNest < server/insert.sql
```

**2. Backend**
```bash
cd server
cp .env.example .env
# Fill in DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, JWT_SECRET, PORT
npm install
npm start
```

**3. Frontend**
```bash
cd client
npm install
npm start
```

App runs at `http://localhost:3000`

---

*Built with React, Node.js, Express, and MySQL. Maps via React Leaflet. Custom postal code geocoder with zero external API dependencies.*
