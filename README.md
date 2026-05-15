# SportFinder

## Problem Description
Finding sports equipment in Sri Lanka often requires calling multiple shops or visiting them physically. Users need a simple way to check **what products are available** and **which district/shop** has them.

## Proposed Solution
SportFinder combines a **REST API** (Node.js, Express, MongoDB) with an optional **React web interface** (Vite) so you can:

- Manage sports shops and their details
- Manage products tied to a specific shop
- Search products by **district** and optional **product name**
- Use the browser UI for search, browsing shops and products, and registering shops/products (same API as Postman or other clients)

## Features
- **Shop management**: Create, read, update, delete shops
- **Product management**: Create, read, update, delete products
- **Search**:
  - Search by **district** (required)
  - Filter by **productName** (optional)
  - Supports both **GET (query params)** and **POST (JSON body)** for search
- **Validation & errors**:
  - Validates MongoDB ObjectIds
  - Returns meaningful HTTP status codes and error messages
- **Web UI** (`client/`):
  - **Find gear**: search by district and optional product name
  - **Shops** and **Catalogue**: list all shops and all products
  - **Shop owners**: create a shop and add products (linked to a shop)
- **CORS**: enabled on the API for browser clients; optional allowlist via `CLIENT_ORIGIN`

## Technologies Used
### Backend
- **Node.js**
- **Express.js**
- **MongoDB**
- **Mongoose**
- **cors**
- **dotenv**
- **nodemon** (dev server)

### Frontend (`client/`)
- **React**
- **Vite**

## Project layout
- **Root**: Express API (`index.js`, `Route/`, `Controller/`, `Model/`)
- **`client/`**: React app; in development, Vite **proxies** `/api` to `http://localhost:8000` so the UI can call the backend without extra configuration

## API Endpoints (with examples)
Base URL (default): `http://localhost:8000`

### Shop Endpoints
#### Create a shop
`POST /api/shop/create`

Example body:
```json
{
  "shopName": "Colombo Sports House",
  "district": "Colombo District",
  "address": "123 Galle Road, Colombo 03",
  "contactNumber": "+94 11 2345678"
}
```

#### Get all shops
`GET /api/shop/getallshops`

#### Update a shop
`PUT /api/shop/update/:id`

Example body:
```json
{
  "contactNumber": "+94 11 9999999"
}
```

#### Delete a shop
`DELETE /api/shop/delete/:id`

---

### Product Endpoints
#### Create a product
`POST /api/product/create`

Example body (replace `SHOP_ID` with a real shop `_id`):
```json
{
  "shopId": "SHOP_ID",
  "productName": "Yonex Astrox 88D Badminton Racket",
  "brand": "Yonex",
  "category": "Badminton",
  "price": 28500,
  "availability": true
}
```

#### Get all products
`GET /api/product/getallproducts`

#### Search products (GET)
`GET /api/product/search?district=Colombo&productName=Yonex`

Notes:
- `district` is **required**
- `productName` is optional

#### Search products (POST)
`POST /api/product/search`

Example body:
```json
{
  "district": "Colombo",
  "productName": "Yonex"
}
```

#### Update a product
`PUT /api/product/update/:id`

Example body:
```json
{
  "price": 27000,
  "availability": false
}
```

#### Delete a product
`DELETE /api/product/delete/:id`

## Setup Instructions
### 1) Clone the project
```bash
git clone https://github.com/thisuri-a11y/sportFinder.git
cd sportFinder
```

### 2) Install dependencies (API)
```bash
npm install
```

### 3) Install dependencies (web UI)
```bash
cd client
npm install
cd ..
```

### 4) Configure environment variables
Create a `.env` file in the **project root** and add:
```bash
MONGO_URL=your_mongodb_connection_string
PORT=8000
```
(`PORT` is optional; defaults to `8000`.)

Optional, for stricter CORS when the UI is hosted on fixed origins (comma-separated):
```bash
CLIENT_ORIGIN=http://localhost:5173,https://your-production-site.example
```
If omitted, the API allows browser requests from typical development setups.

Optional, for the **React app** when the API is **not** proxied by Vite (e.g. API on another host): create `client/.env` with:
```bash
VITE_API_URL=http://localhost:8000
```
During local dev with `npm start` + `npm run client`, you usually **do not** need `VITE_API_URL` because Vite proxies `/api` to port `8000`.

## How to Run the Project
### API (backend)
From the project root:
```bash
npm start
```
This runs the server with **nodemon** (default: `http://localhost:8000`).

### Web UI (frontend)
With the API already running, in a **second** terminal from the project root:
```bash
npm run client
```
Then open the URL shown in the terminal (typically `http://localhost:5173`).

### Production build (static frontend)
```bash
cd client
npm run build
```
Output is in `client/dist/`. Serve those files with any static host and set `VITE_API_URL` at build time to your public API URL, or put the API behind the same origin as the static site.

### Quick API test
Open in the browser (or use Postman):
- `GET http://localhost:8000/api/shop/getallshops`
- `GET http://localhost:8000/api/product/getallproducts`
