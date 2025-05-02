# 💸 Expense Tracker

A full-stack expense tracking app built using **Next.js 14**, **TypeScript**, **Tailwind CSS**, **Redux Toolkit (RTK)**, and **Mongoose**. It allows users to add, delete, and view expenses with a clean, responsive UI and modern development practices.

🔗 [Live Demo](https://assignment-expense-tracker-nvv.vercel.app/)

---

## ✨ Features

- ✅ Add expense entries with description and amount
- ✅ View a summarized list of all expenses
- ✅ Delete individual expenses
- ✅ Total balance calculation
- ✅ Responsive design (mobile + desktop)
- ✅ Global state management using Redux Toolkit
- ✅ Backend integration with Mongoose (MongoDB)
- ✅ Modular component-based structure
- ✅ Input validation for forms
- ✅ Optimized routing with Next.js App Router
- ✅ Clean code using TypeScript for full type safety
- ✅ Deployed on Vercel

---

## 🧾 How to Add a Transaction

1. On the main page, locate the **"Add Expense"** section.
2. Enter a **description** (e.g., "Groceries", "Bus Ticket").
3. Enter an **amount**:
   - Use a **positive number** for income (e.g., `+500`)
   - Use a **negative number** for expenses (e.g., `-200`)
4. Click the **Add Transaction** button.
5. The new transaction will appear instantly in the list and the total balance will update accordingly category and month wise.

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB database (local or Atlas)

### Installation

```bash
git clone https://github.com/namravamja/assignment-expense-tracker.git
cd assignment-expense-tracker
npm install  # or yarn install
