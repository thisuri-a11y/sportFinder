# SportFinder

## Problem Description
Finding sports equipment in Sri Lanka often requires calling multiple shops or visiting them physically. Users need a simple way to check **what products are available** and **which district/shop** has them.

## Proposed Solution
SportFinder is a REST API built with Node.js, Express, and MongoDB that allows you to:
- Manage sports shops and their details
- Manage products tied to a specific shop
- Search products by **district** and optional **product name**

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

## Technologies Used
- **Node.js**
- **Express.js**
- **MongoDB**
- **Mongoose**
- **dotenv**
- **nodemon** (dev server)

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

### 2) Install dependencies
```bash
npm install
```

### 3) Configure environment variables
Create a `.env` file in the project root and add:
```bash
MONGO_URL=your_mongodb_connection_string
PORT=8000
```
(`PORT` is optional; defaults to `8000`.)

## How to Run the Project
### Development (recommended)
```bash
npm start
```
This runs the server with **nodemon**.

### Quick test
Open in the browser (or use Postman):
- `GET http://localhost:8000/api/shop/getallshops`
- `GET http://localhost:8000/api/product/getallproducts`
