# Database Setup Instructions

This application now uses a PostgreSQL database with Prisma ORM for data persistence.

## 1. Create Vercel Postgres Database

1. Go to your Vercel project dashboard
2. Navigate to the **Storage** tab
3. Click **Create Database**
4. Select **PostgreSQL**
5. Choose a region and database name
6. Click **Create**

## 2. Connect Database to Project

1. After creating the database, click **Connect Project**
2. Select your existing Vercel project
3. Click **Connect**

## 3. Get Database Connection String

1. In your Vercel project dashboard, go to **Settings** > **Environment Variables**
2. Find the `DATABASE_URL` variable
3. Copy the connection string

## 4. Configure Local Environment

1. Copy `env.example` to `.env` in your project root
2. Replace the `DATABASE_URL` placeholder with your actual connection string from Vercel

## 5. Deploy Database Schema

The database schema will be automatically deployed when you push to GitHub and Vercel redeploys your application.

## 6. Database Schema

The application uses the following database schema:

```prisma
model Manager {
  id          String   @id @default(cuid())
  name        String
  email       String?  @unique
  phone       String?
  department  String?
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  // Relationships
  clients     Client[]

  @@map("managers")
}

model Client {
  id          String   @id @default(cuid())
  name        String
  phone       String
  type        ClientType
  managerId   String
  purpose     String   @default("pickup")
  status      ClientStatus @default(WAITING)
  checkInTime DateTime @default(now())
  calledTime  DateTime?
  completedTime DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relationships
  manager     Manager  @relation(fields: [managerId], references: [id])

  @@map("clients")
}

enum ClientType {
  VENDOR
  SUBCONTRACTOR
}

enum ClientStatus {
  WAITING
  CALLED
  IN_PROGRESS
  COMPLETED
}
```

## 7. API Endpoints

The application provides the following API endpoints:

### Client Endpoints
- `GET /api/clients` - Get all clients
- `POST /api/clients` - Create a new client
- `PUT /api/clients/[id]` - Update client status
- `DELETE /api/clients/[id]` - Delete a client

### Manager Endpoints
- `GET /api/managers` - Get all managers
- `POST /api/managers` - Create a new manager
- `PUT /api/managers/[id]` - Update manager information
- `DELETE /api/managers/[id]` - Delete a manager

## 8. Local Development

For local development, you can use the following commands:

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database (for development)
npm run db:push

# Open Prisma Studio (database GUI)
npm run db:studio
```

## 9. Production Deployment

The application will automatically:
1. Generate the Prisma client during build
2. Create the database tables on first deployment
3. Handle all database operations through the API routes

## Troubleshooting

- Make sure your `DATABASE_URL` environment variable is correctly set in Vercel
- Check that the database is properly connected to your project
- Verify that the Prisma client is generated during build
