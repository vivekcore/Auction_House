# 🏛️ Auction House — Virtual Auction Platform

A **MERN stack backend** for a virtual auction house where users can bid on items using simulated money. Built as a learning project to master complex backend patterns.

---

## 🎯 Project Overview

Auction House is a virtual auction platform where users receive simulated money upon signup. They can:

- 🛒 Create auctions to sell items
- 💸 Bid on other users' auctions
- 🔁 Transfer money between users
- 🏆 Win auctions and receive payment

> **Purpose:** Learn complex backend patterns including escrow systems, scheduled jobs, transaction handling, and service architecture.

---

## 🏗️ Architecture

```
backend/
├── src/
│   ├── auth/           # Better-Auth configuration
│   ├── controllers/    # Request handlers
│   ├── db/             # Database connection
│   ├── middleware/     # Auth & error handling
│   ├── models/         # Mongoose schemas
│   ├── routes/         # Express routes
│   ├── services/       # Business logic (service layer)
│   ├── types/          # TypeScript definitions
│   └── utils/          # Utilities & schedulers
```

### Design Patterns

| Pattern | Description |
|---|---|
| **Service Layer Architecture** | Separation of business logic from controllers |
| **Repository Pattern** | Models handle data access |
| **Error Handling Middleware** | Centralized error management |
| **Transaction Support** | Atomic operations for money transfers |

---

## 📦 Features

### ✅ All Completed

| Feature | Description |
|---|---|
| User Authentication | Email/password + Google OAuth via Better-Auth |
| Virtual Balance | Users get $1,000–$10,000 on signup |
| Create Auction | List items with title, description, starting price, category, images |
| Place Bid | Bid on auctions with amount validation |
| Bid Locking | Escrow system — funds locked when bidding |
| Auto-Expire | Cron job ends auctions after 24 hours |
| Money Transfer | P2P transfers with transaction support |
| Pagination | All list endpoints support pagination |
| Service Layer | Clean separation of concerns |
| Search | Search auctions by title or description |
| Sort Options | Sort by price (asc/desc), endDate, newest |
| Categories | 9 categories (electronics, jewelry, fashion, etc.) |
| Image Upload | Array of image URLs per auction |
| Auto-Extend | +5 minutes if bid placed in last 5 minutes |

---

## 💰 Bid Locking System (Escrow)

The core learning feature — a complete escrow system for auctions.

### How It Works

```
User A has $1,000 balance
        ↓
User A bids $500 on Item #1
        ↓
Balance: $500  |  Locked: $500  |  Available: $500
        ↓
User B bids $600 on Item #1
        ↓
User A refunded → Balance: $1,000  |  Locked: $0
User B locked   → Balance: $400    |  Locked: $600
        ↓
Auction ends
        ↓
Seller receives $600
User B's locked $600 released
```

### Locking Rules

- Bid amount is locked (deducted from available balance)
- Only one active bid per auction per user
- Cannot bid on your own auctions
- Cannot bid on already-expired auctions
- Must bid higher than the current price

---

## 🔧 Tech Stack

| Technology | Purpose |
|---|---|
| **Express** | Web framework |
| **TypeScript** | Type safety |
| **MongoDB** | Database |
| **Mongoose** | ODM |
| **Better-Auth** | Authentication |
| **node-cron** | Scheduled jobs |
| **Zod** | Validation |
| **mongoose-paginate-v2** | Pagination |

---

## 📚 API Endpoints

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/v1/auth/sign-up` | Register user |
| `POST` | `/api/v1/auth/sign-in` | Login user |
| `POST` | `/api/v1/auth/sign-out` | Logout |
| `GET` | `/api/v1/auth/get-session` | Get current session |

### Auctions

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/v1/auction/create` | Create new auction |
| `GET` | `/api/v1/auction/list` | List active auctions (with search, sort, category filters) |
| `GET` | `/api/v1/auction/:id` | Get auction by ID |
| `GET` | `/api/v1/auction/my` | Get user's auctions |
| `POST` | `/api/v1/auction/:id/end` | Manually end auction |

#### Query Parameters for `/auction/list`

| Parameter | Example | Description |
|---|---|---|
| `page` | `?page=1` | Page number (default: 1) |
| `limit` | `?limit=10` | Items per page (default: 10) |
| `search` | `?search=iphone` | Search title/description |
| `sort` | `?sort=price_asc` | Sort: price_asc, price_desc, endDate_asc, newest |
| `categorie` | `?categorie=electronics` | Filter by category |

### Bids

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/v1/bid/place` | Place a bid |
| `GET` | `/api/v1/bid/:auctionId` | Get all bids on auction |
| `GET` | `/api/v1/bid/my` | Get user's active bids |

### Accounts

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/account/balance` | Get user balance |
| `POST` | `/api/v1/account/transfer` | Transfer money to user |

---

## 🗄️ Database Schema

### User *(Better-Auth managed)*

```
id          ObjectId
name        String
email       String
image       String
username    String
createdAt   Date
```

### Account

```
userId        ObjectId (ref: user)
balance       Number   (default: 0)
lockedAmount  Number   (default: 0)
createdAt     Date
updatedAt     Date
```

### Auction

```
title         String   (5–100 chars)
description  String   (10–500 chars)
status       "active" | "ended"
categorie    String   (electronics, jewelry, properties, toys, vehicles, household, fashion, sports, other)
image         String[] (array of image URLs)
sellerId      ObjectId (ref: user)
winnerId     ObjectId (ref: user, nullable)
isTransactionDone  Boolean (default: false)
sellingPrice  Number   (minimum: 5)
finalPrice   Number   (nullable)
endDate      Date     (24 hours from creation, extends +5min on late bids)
createdAt    Date
```

### Bid

```
auctionId   ObjectId (ref: auction)
bidderId    ObjectId (ref: user)
amount      Number
isLocked    Boolean  (default: false)
isActive    Boolean  (default: false)
lockedAt    Date
createdAt   Date
```

---

## 🔄 Scheduled Jobs

### Auction Expiration Job

- **Frequency:** Every 5 minutes
- **Tasks:**
  1. Mark expired auctions as `"ended"`
  2. Transfer locked funds to the seller
  3. Release locked amounts for losing bidders
  4. Mark the winning bid as inactive
  5. Mark auction as `isTransactionDone: true`

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- pnpm (or npm/yarn)

### Installation

```bash
# Clone the repository and navigate into the backend
cd backend

# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env
```

Fill in your `.env` file (see below), then start the dev server:

```bash
pnpm dev
```

### Environment Variables

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/auction-house
BETTER_AUTH_URL=http://localhost:3000
FRONTEND_URL=http://localhost:5173
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

---

## 🧪 Testing

Manual testing with Postman or Thunder Client:

```bash
# 1. Register a user
POST /api/v1/auth/sign-up
{
  "email": "user1@example.com",
  "password": "password123"
}

# 2. Check balance (should be ~$1,000–$10,000)
GET /api/v1/account/balance

# 3. Create an auction with category and images
POST /api/v1/auction/create
{
  "title": "iPhone 15 Pro",
  "description": "Like new condition, with box",
  "sellingPrice": 500,
  "categorie": "electronics",
  "image": ["https://example.com/iphone1.jpg"]
}

# 4. List auctions with filters
GET /api/v1/auction/list?categorie=electronics&sort=price_asc
GET /api/v1/auction/list?search=iphone&sort=newest
GET /api/v1/auction/list?sort=endDate_asc

# 5. Place a bid (from another user account)
POST /api/v1/bid/place
{
  "auctionId": "<auction_id>",
  "amount": 105
}
```

---

## 📖 Learning Outcomes

This project demonstrates:

1. **Authentication** — OAuth, session management, JWT
2. **Authorization** — Middleware, role-based access
3. **Database Design** — Schemas, relationships, indexes
4. **Transaction Handling** — ACID operations, rollback
5. **Escrow Systems** — Lock/unlock funds, atomic updates
6. **Scheduled Jobs** — Cron jobs, background processing
7. **Service Architecture** — Controllers, services, separation of concerns
8. **Error Handling** — Custom error classes, middleware
9. **Validation** — Zod schemas, input sanitization
10. **Pagination** — Offset-based pagination
11. **Search** — Regex-based search, text indexes
12. **Filtering** — Dynamic query building
13. **Auto-Extend Logic** — Time-based event handling

---

## 📝 License

This is a learning project. [MIT License](LICENSE).

---

## 👤 Author

**Vivek** — Built as a MERN backend learning exercise.

🐦 Twitter: [@vivek_z9](https://x.com/vivek_z9)