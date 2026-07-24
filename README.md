<div align="center">
  <img src="public/images/fire.png" alt="Flame Gas Logo" width="120" />
  <h1>Flame Gas Delivery System</h1>
  <p>A modern, high-performance web application for gas cylinder and water gallon delivery management.</p>

  <div>
    <img src="https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white" alt="Laravel" />
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/Inertia.js-9553E9?style=for-the-badge&logo=inertia&logoColor=white" alt="Inertia.js" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
    <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />
  </div>
</div>

---

## Overview

**Flame Gas** is a comprehensive full-stack solution designed to streamline the operations of gas and water delivery businesses. Built with a robust **Laravel** backend and a reactive **React** frontend connected via **Inertia.js**, this application eliminates the need for a separate API layer, providing a seamless SPA (Single Page Application) experience while retaining the power of server-side routing and controllers.

## Key Features

- **Role-Based Access Control (RBAC):** Distinct interfaces and permissions for Customers, Drivers, and Administrators using Spatie's permission package.
- **Dynamic Order Tracking:** Real-time status updates from request to delivery.
- **Modern User Interface:** Highly responsive and aesthetic UI built with Tailwind CSS, featuring glassmorphism elements and micro-animations.
- **Serverless Ready:** Configured for frictionless deployment on Vercel utilizing Node.js wrappers for PHP runtimes (`vercel-php`).
- **Secure Authentication:** Built-in Laravel Sanctum authentication combined with Inertia's secure state management.
- **Asset Optimization:** Integrated Vite for blazing-fast Hot Module Replacement (HMR) in development and optimized asset bundling in production.

## Technology Stack

### Backend
- **Framework:** Laravel 11.x (PHP 8.2+)
- **Database:** PostgreSQL (Cloud-hosted via Neon.tech)
- **ORM:** Eloquent ORM with robust query scopes and relationships
- **Security:** Laravel Sanctum, CSRF Protection, Password Hashing

### Frontend
- **Library:** React 18
- **Bridge:** Inertia.js (Classic Monolith architecture)
- **Styling:** Tailwind CSS + PostCSS
- **Icons:** Lucide React & FontAwesome
- **Build Tool:** Vite

### DevOps & Infrastructure
- **Hosting:** Vercel (Serverless Functions)
- **PHP Builder:** `vercel-php@0.9.0`
- **Static Assets:** `@vercel/static`

## Local Development

### Prerequisites
- PHP >= 8.2
- Composer
- Node.js & NPM
- PostgreSQL or MySQL

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/isahlopess/flame-gas.git
   cd flame-gas
   ```

2. **Install PHP Dependencies**
   ```bash
   composer install
   ```

3. **Install Node Dependencies**
   ```bash
   npm install
   ```

4. **Environment Configuration**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```
   *Update your `.env` file with your local database credentials.*

5. **Run Migrations & Seeders**
   ```bash
   php artisan migrate --seed
   ```
   *Note: The seeder populates default products (Residential Gas, Commercial Gas, Water Gallons) and test users.*

6. **Start the Development Servers**
   Open two terminal tabs:
   ```bash
   # Terminal 1: Vite HMR server
   npm run dev
   
   # Terminal 2: Laravel backend server
   php artisan serve
   ```

## Deployment on Vercel

This project includes a highly optimized `vercel.json` configuration tailored for deploying Laravel on Vercel's serverless environment, bypassing traditional VPS setups.

### Key Deployment Configurations:
- **Serverless PHP:** Uses `vercel-php@0.9.0` to compile PHP into AWS Lambda functions.
- **Static Routing:** Explicit routing rules ensure that Vite's compiled assets (`/public/build`) and static images (`/public/images`) are served directly via Vercel's CDN, avoiding unnecessary PHP invocations.
- **Serverless Database Connection:** Configured to handle PostgreSQL SNI requirements via `PGOPTIONS` environment variable for cloud databases like Neon.

### Vercel Environment Variables Required:
```ini
DB_CONNECTION=pgsql
DB_HOST=your-neon-hostname.aws.neon.tech
DB_PORT=5432
DB_DATABASE=neondb
DB_USERNAME=your_db_user
DB_PASSWORD=your_db_password
NEON_ENDPOINT=your-neon-endpoint-id  # Crucial for SNI routing
APP_KEY=your_laravel_app_key
SESSION_DRIVER=database
CACHE_STORE=database
```

## Demo / Test Accounts

You can access the live application using the following credentials:

| Role | Email | Password |
|------|-------|----------|
| **Admin** | `admin@flamegas.com` | `FlameMaster26!` |
| **Driver** | `entregador@flamegas.com` | `DriverPro26!` |
| **Client** | `cliente@flamegas.com` | `Cliente26!` |

## License

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
