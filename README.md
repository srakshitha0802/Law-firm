# Law Firm Management System

A comprehensive legal operations platform for a family-run law firm in India, combining a professional public website with an internal case management system.

## 🏛️ Overview

This system serves as both:
- **Public-facing website**: Professional, dignified online presence for client acquisition
- **Internal operations platform**: Complete case management, document handling, and client portal

## 🚀 Features

### Public Website
- Professional homepage with trust signals and experience counters
- About section with firm philosophy and legacy
- Advocate profiles with experience and specializations
- Detailed practice areas with problem-solving approach
- Online consultation booking system
- Contact information with office hours

### Internal System
- **Role-based Authentication**: Admin, Advocate, Client access levels
- **Case Management**: Complete case lifecycle tracking
- **Document Management**: OCR-enabled document processing with version control
- **Smart Reminders**: Automated notifications for hearings and deadlines
- **Client Portal**: Controlled access for clients to view case status
- **Advocate Dashboard**: Daily agenda and case overview
- **Search & Filtering**: Advanced search across cases and documents

## 🛠️ Technology Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Node.js, Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT-based with role-based access control
- **File Processing**: Multer for uploads, Tesseract.js for OCR
- **UI Components**: Radix UI, Lucide Icons

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Tesseract OCR (for document processing)

## 🚀 Getting Started

### 1. Clone and Install

```bash
git clone <repository-url>
cd law_firm
npm install
```

### 2. Environment Setup

Copy `.env.example` to `.env.local` and configure:

```bash
cp .env.example .env.local
```

Configure the following variables:
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret for JWT token signing
- `NEXTAUTH_SECRET`: NextAuth secret
- `SMTP_*`: Email configuration for notifications

### 3. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# (Optional) Seed with initial data
npx prisma db seed
```

### 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── cases/         # Case management
│   │   └── consultation/  # Consultation requests
│   ├── dashboard/         # Advocate dashboard
│   ├── client-portal/     # Client portal
│   ├── about/            # Public pages
│   ├── advocates/
│   ├── practice-areas/
│   ├── consultation/
│   └── contact/
├── components/
│   └── ui/                # Reusable UI components
├── lib/
│   ├── auth.ts           # Authentication utilities
│   ├── prisma.ts         # Database client
│   └── utils.ts          # Helper functions
├── types/
│   └── index.ts          # TypeScript type definitions
└── middleware.ts         # Route protection middleware
```

## 👥 User Roles & Access

### Admin (Senior Advocates)
- Full system access
- User management
- All case visibility
- System configuration

### Advocate (Junior Advocates)
- Assigned case management
- Document uploads
- Client communication
- Dashboard access

### Client
- View own cases (read-only)
- Download approved documents
- Receive notifications
- Upload requested documents

## 🔐 Security Features

- JWT-based authentication
- Role-based access control (RBAC)
- Encrypted file storage
- HTTP-only secure cookies
- Input validation and sanitization
- SQL injection prevention (Prisma)

## 📄 Database Schema

Key entities:
- **Users**: Authentication and role management
- **Cases**: Complete case information with important dates
- **Documents**: File storage with OCR extraction and versioning
- **Reminders**: Automated notifications for deadlines
- **Notifications**: System and user notifications
- **ConsultationRequests**: Public consultation booking

## 🚀 Deployment

### Production Build

```bash
npm run build
npm start
```

### Environment Variables for Production

Ensure all environment variables are set in production:
- Database connection
- JWT secrets
- Email configuration
- File upload paths

### Docker Deployment (Optional)

```dockerfile
# Dockerfile example
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 📧 Email Configuration

Configure SMTP settings for:
- Consultation request notifications
- Case update alerts
- Reminder notifications
- Client communications

## 📄 Document Processing

- Upload support for PDF, images, documents
- OCR extraction using Tesseract.js
- Automatic case number and party name detection
- Version control with audit trail

## 🔔 Notification System

- **Email**: Primary notification channel
- **Dashboard**: In-app notifications
- **WhatsApp**: Future integration capability

## 📊 Analytics & Reporting

Future-ready for:
- Case outcome analytics
- Court-wise performance metrics
- Billing and time tracking
- Client satisfaction metrics

## 🤝 Contributing

1. Follow the existing code style
2. Add TypeScript types for new features
3. Include error handling and validation
4. Update documentation for new features

## 📞 Support

For technical support or questions:
- Email: support@lawfirm.com
- Documentation: Check inline code comments
- Issues: Create GitHub issues for bugs

## 📜 License

Proprietary - All rights reserved by the law firm.

---

**Built with ❤️ for legal professionals who demand excellence and reliability.**
