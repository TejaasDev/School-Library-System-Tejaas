# School Library Management System

A fast, simple, and clean School Library Management System built with **React**, **Node.js/Express**, and **Supabase (PostgreSQL)**.

## 🚀 Features
- **Dashboard** – Real-time stats: Total Books, Issued, Overdue, Today's Transactions
- **Issue Book** – 2-step scan flow (Student ID → Book ID)
- **Return Book** – Auto fine calculation (₹5/day overdue)
- **Add Books** – Quick Add form + CSV Bulk Upload

## 🛠️ Tech Stack
| Layer | Technology |
|-------|------------|
| Frontend | React 19, Vite, Tailwind CSS v4 |
| Backend | Node.js, Express |
| Database | Supabase (PostgreSQL) |
| Auth | JWT + bcryptjs |

## 📦 Setup

### 1. Clone the repo
```bash
git clone https://github.com/TejaasDev/School-Library-System-Tejaas.git
cd School-Library-System-Tejaas
```

### 2. Set up the Backend
```bash
cd server
npm install
```
Create a `.env` file from the example:
```bash
cp .env.example .env
# Fill in your SUPABASE_URL, SUPABASE_ANON_KEY, and JWT_SECRET
```
Start the server:
```bash
npm start
```

### 3. Set up the Frontend
```bash
cd client
npm install
npm run dev
```

## 🌐 Running Locally
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

## 📁 Project Structure
```
├── client/               # React frontend
│   ├── src/
│   │   ├── pages/        # Dashboard, AddBook, IssueBook, ReturnBook
│   │   ├── components/   # Navbar
│   │   ├── services/     # API service layer (axios)
│   │   └── context/      # Auth context
├── server/               # Node.js backend
│   ├── controllers/      # Business logic
│   ├── routes/           # API routes
│   └── supabase.js       # Supabase client
```

## ⚠️ Note
Do not commit your `.env` file. It is in `.gitignore` by default.
