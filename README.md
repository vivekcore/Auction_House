# Auction House - Virtual Auction Platform

A MERN stack backend for a virtual auction house where users can bid on items using simulated money. Built as a learning project to master complex backend patterns.

## 🎯 Project Overview

Auction House is a virtual auction platform where users receive simulated money upon signup. They can:

- Create auctions to sell items
- Bid on other users' auctions
- Transfer money between users
- Win auctions and receive payment

**Purpose:** Learn complex backend patterns including escrow systems, scheduled jobs, transaction handling, and service architecture.

---

## 🏗️ Architecture

```backend/
├── src/
│   ├── auth/                 # Better-Auth configuration
│   ├── controllers/          # Request handlers
│   ├── db/                   # Database connection
│   ├── middleware/           # Auth & error handling
│   ├── models/               # Mongoose schemas
│   ├── routes/               # Express routes
│   ├── services/             # Business logic (service layer)
│   ├── types/                # TypeScript definitions
│   └── utils/                # Utilities & schedulers
```

### Design Patterns

- **Service Layer Architecture** - Separation of business logic from controllers
- **Repository Pattern** - Models handle data access
- **Error Handling Middleware** - Centralized error management
- **Transaction Support** - Atomic operations for money transfers

---

## 📦 Features

### Completed Features

| Feature | Status | Description |
|---------|--------|-------------|

| User Authentication | ✅ | Email/password + Google OAuth via Better-Auth |
| Virtual Balance | ✅ | Users get $1,000-$10,000 on signup |
| Create Auction | ✅ | List items with title, description, starting price |
| Place Bid | ✅ | Bid on auctions with amount validation |
| Bid Locking | ✅ | Escrow system - funds locked when bidding |
| Auto-Expire | ✅ | Cron job ends auctions after 24 hours |
| Money Transfer | ✅ | P2P transfers with transaction support |
| Pagination | ✅ | All list endpoints support pagination |
| Service Layer | ✅ | Clean separation of concerns |

### Upcoming Features (In Progress)

| Feature | Status | Priority |
|---------|--------|----------|

| Image Upload | 🚧 | High |
| Search Auctions | 🚧 | High |
| Sort Options | 🚧 | Medium |
| Categories | 🚧 | Medium |
| Auto-Extend | 🚧 | Medium |
| Daily Rewards | 📋 | Low |
| Referral System | 📋 | Low |

---

## 💰 Bid Locking System (Escrow)

The core learning feature - a complete escrow system for auctions.

### How It Works

```User A has $1,000 balance
    ↓
User A bids $500 on Item #1
    ↓
Balance: $500 | Locked: $500 | Available: $500
    ↓
User B bids $600 on Item #1
    ↓
User A refunded: Balance $1000 | Locked $0
User B locked: Balance $400 | Locked $600
    ↓
Auction ends
    ↓
Seller receives $600
User B's locked $600 released
```

### Locking Rules

- Bid amount is locked (deducted from available balance)
- Only one active bid per auction per user
- Can't bid on your own auctions
- Can't bid on already-expired auctions
- Must bid higher than current price

---

## 🔧 Tech Stack

| Technology | Purpose |
|------------|---------|

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
|--------|----------|-------------|

| POST | `/api/v1/auth/sign-up` | Register user |
| POST | `/api/v1/auth/sign-in` | Login user |
| POST | `/api/v1/auth/sign-out` | Logout |
| GET | `/api/v1/auth/get-session` | Get current session |

### Auctions

| Method | Endpoint | Description |

|--------|----------|-------------|
| POST | `/api/v1/auction/create` | Create new auction |
| GET | `/api/v1/auction/list` | List active auctions |
| GET | `/api/v1/auction/:id` | Get auction by ID |
| GET | `/api/v1/auction/my` | Get user's auctions |
| POST | `/api/v1/auction/:id/end` | Manually end auction |

### Bids

| Method | Endpoint | Description |

|--------|----------|-------------|
| POST | `/api/v1/bid/place` | Place a bid |
| GET | `/api/v1/bid/:auctionId` | Get all bids on auction |
| GET | `/api/v1/bid/my` | Get user's active bids |

### Accounts

| Method | Endpoint | Description |
|--------|----------|-------------|

| GET | `/api/v1/account/balance` | Get user balance |

| POST | `/api/v1/account/transfer` | Transfer money to user |

---

## 🗄️ Database Schema

### User (Better-Auth managed)

```- id: ObjectId
- name: String
- email: String
- image: String
- username: String
- createdAt: Date
```

### Account

```- userId: ObjectId (ref: user)
- balance: Number (default: 0)
- lockedAmount: Number (default: 0)
- createdAt: Date
- updatedAt: Date
```

### Auction

```- title: String (5-100 chars)
- description: String (10-500 chars)
- status: "active" | "ended"
- sellerId: ObjectId (ref: user)
- winnerId: ObjectId (ref: user, nullable)
- sellingPrice: Number (minimum: 5)
- finalPrice: Number (nullable)
- endDate: Date (24 hours from creation)
- createdAt: Date
```

### Bid

```- auctionId: ObjectId (ref: auction)
- bidderId: ObjectId (ref: user)
- amount: Number
- isLocked: Boolean (default: false)
- isActive: Boolean (default: false)
- lockedAt: Date
- createdAt: Date
```

---

## 🔄 Scheduled Jobs

### Auction Expiration Job

- **Runs:** Every 5 minutes
- **Tasks:**
  1. Mark expired auctions as "ended"
  2. Transfer locked funds to seller
  3. Release locked amounts for losers
  4. Mark winning bid as inactive

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- pnpm (or npm/yarn)

### Installation

```bash
# Clone the repository
cd backend

# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env

# Fill in your .env file:
# - MONGODB_URI
# - BETTER_AUTH_URL
# - GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET (optional)
# - PORT

# Run development server
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

Manual testing with Postman/Thunder Client:

```bash
# 1. Register a user
POST /api/v1/auth/sign-up
{
  "email": "user1@example.com",
  "password": "password123"
}

# 2. Check balance (should be ~$1000-$10000)
GET /api/v1/account/balance

# 3. Create an auction
POST /api/v1/auction/create
{
  "title": "Vintage Watch",
  "description": "Beautiful vintage watch in working condition",
  "sellingPrice": 100
}

# 4. Place a bid (from another user)
POST /api/v1/bid/place
{
  "auctionId": "<auction_id>",
  "amount": 105
}
```

---

## 📖 Learning Outcomes

This project demonstrates:

1. **Authentication** - OAuth, session management, JWT
2. **Authorization** - Middleware, role-based access
3. **Database Design** - Schemas, relationships, indexes
4. **Transaction Handling** - ACID operations, rollback
5. **Escrow Systems** - Lock/unlock funds, atomic updates
6. **Scheduled Jobs** - Cron jobs, background processing
7. **Service Architecture** - Controllers, services, separation of concerns
8. **Error Handling** - Custom error classes, middleware
9. **Validation** - Zod schemas, input sanitization
10. **Pagination** - Cursor/offset, filtering

---

## 📝 License

This is a learning project. MIT License.

---

## 👤 Author

Built as a MERN backend learning exercise.
