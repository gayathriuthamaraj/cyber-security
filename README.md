# Community Announcement Board Platform

A secure, role-based community announcement platform with end-to-end encryption, digital signatures, and comprehensive audit logging. Built with React, TypeScript, Node.js/Express, and featuring a Batman-themed UI design.

## 🌟 Features

### Core Functionality
- **Role-Based Access Control (RBAC)**: System-level (admin/user) and group-level (owner/admin/member) roles
- **Group Management**: Create and manage groups with configurable join and posting modes
- **Secure Announcements**: Post announcements with hybrid encryption (RSA + AES-256-CBC)
- **Request/Approval Workflow**: Manage join requests and post approvals based on group settings
- **Real-time Dashboard**: View all announcements from joined groups in a unified timeline

### Security Features
- **Multi-Factor Authentication**: Email-based OTP verification
- **Hybrid Encryption**: RSA-2048 for key exchange + AES-256-CBC for content encryption
- **Digital Signatures**: RSA-based signatures for content authenticity and integrity
- **Password Security**: SHA-256 hashing with salt
- **JWT Authentication**: Secure session management
- **Comprehensive Audit Logging**: Track all security-relevant events
- **Security Status Dashboard**: Real-time visibility of security features and audit logs

### Group Configuration
- **Join Modes**:
  - `OPEN`: Anyone can join instantly
  - `REQUEST`: Users must request to join (admin approval required)
  - `INVITE_ONLY`: Only invited users can join

- **Posting Modes**:
  - `ADMIN_ONLY`: Only group admins can post
  - `APPROVED_MEMBERS`: All members can post
  - `REQUEST_PER_POST`: Posts require admin approval before visibility
  - `OPEN_POSTING`: All members can post freely

## 🏗️ Architecture

### Backend (Node.js + TypeScript + Express)

```
backend/
├── src/
│   ├── config/          # Configuration files (DB, JWT, email)
│   ├── controllers/     # Request handlers (auth, groups, posts, requests, admin)
│   ├── middleware/      # Auth, RBAC, validation, error handling
│   ├── models/          # Data models (User, Group, Post, Request, AuditLog)
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   │   ├── auth/        # JWT, OTP, login, register, session
│   │   ├── authorization/ # RBAC service
│   │   ├── encryption/  # RSA, AES, key exchange
│   │   ├── hashing/     # Password hashing, general hashing
│   │   ├── signature/   # Digital signature service
│   │   └── encoding/    # Base64 service
│   ├── types/           # TypeScript type definitions
│   └── utils/           # Utility functions
├── .env.example         # Environment variables template
└── package.json
```

**Key Services**:
- **Encryption Service**: Hybrid encryption with RSA-2048 + AES-256-CBC
- **Signature Service**: RSA-based digital signatures for authenticity
- **RBAC Service**: Role-based access control with system and group-level permissions
- **Audit Logger**: Comprehensive logging of all security events
- **Group Service**: Group management, member roles, permissions
- **Post Service**: Create, approve, and manage encrypted posts
- **Request Service**: Handle join and post requests

### Frontend (React + TypeScript + Vite)

```
frontend/
├── src/
│   ├── assets/          # Static assets
│   ├── components/      # Reusable UI components
│   │   ├── announcements/  # Announcement display & creation
│   │   ├── auth/        # Login, registration, OTP verification
│   │   ├── common/      # Navbar, Sidebar, Loader
│   │   ├── AuditLog.tsx    # Security audit log viewer
│   │   ├── GroupCard.tsx   # Group display card
│   │   ├── PostCard.tsx    # Post/announcement card
│   │   ├── RequestList.tsx # Manage requests
│   │   └── SecurityStatus.tsx # Security dashboard
│   ├── context/         # React context (Auth)
│   ├── pages/           # Route pages
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── Dashboard.tsx    # Main announcement feed
│   │   ├── Explore.tsx      # Browse and join groups
│   │   ├── GroupView.tsx    # Individual group view
│   │   └── AdminPanel.tsx   # System admin panel
│   ├── security/        # Encryption & signature utilities
│   ├── services/        # API integration (auth, groups, posts)
│   ├── types/           # TypeScript definitions
│   └── utils/           # Helper functions
├── index.html
├── vite.config.ts
└── package.json
```

**UI Design**: Batman-themed dark interface with vibrant accents, glassmorphism effects, and smooth animations.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- SMTP server access (for email OTP)

### Installation

1. **Clone the repository**
```bash
cd c:\Users\gayat\cyber_security
```

2. **Backend Setup**
```bash
cd backend
npm install
```

3. **Configure Environment Variables**
```bash
# Copy the example env file
cp .env.example .env

# Edit .env with your configuration
# Required: SMTP credentials for email OTP
```

4. **Frontend Setup**
```bash
cd ../frontend
npm install
```

### Running the Application

1. **Start Backend** (from `backend/` directory)
```bash
npm run dev
```
Backend runs on `http://localhost:5001`

2. **Start Frontend** (from `frontend/` directory)
```bash
npm run dev
```
Frontend runs on `http://localhost:5173`

### Default Credentials

**System Admin**:
- Username: `admin`
- Password: `admin123`

**Test Users**:
- Username: `user1` / Password: `admin123`
- Username: `user2` / Password: `admin123`

> ⚠️ **Note**: Change default passwords in production!

## 📋 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user (requires OTP verification)
- `POST /api/auth/verify-otp` - Verify OTP and complete registration
- `POST /api/auth/login` - Login (returns JWT token)

### Groups
- `GET /api/groups` - Get all groups
- `POST /api/groups` - Create new group (authenticated)
- `GET /api/groups/:id` - Get group details
- `POST /api/groups/:id/join` - Join or request to join group
- `POST /api/groups/:id/leave` - Leave a group

### Posts
- `GET /api/posts` - Get all posts from joined groups
- `POST /api/posts` - Create new post (authenticated, group member)
- `GET /api/posts/:id` - Get specific post
- `POST /api/posts/:id/approve` - Approve pending post (admin only)
- `POST /api/posts/:id/reject` - Reject pending post (admin only)

### Requests
- `GET /api/requests` - Get all pending requests (admin)
- `POST /api/requests/:id/approve` - Approve request (admin)
- `POST /api/requests/:id/reject` - Reject request (admin)

### Admin
- `GET /api/admin/audit-logs` - Get audit logs (system admin only)
- `GET /api/admin/users` - Get all users (system admin only)

## 🔒 Security Implementation

### Authentication Flow
1. User registers with email/username/password
2. System sends OTP via email
3. User verifies OTP to activate account
4. User logs in to receive JWT token
5. JWT token used for all authenticated requests

### Encryption Flow
1. **Post Creation**: Content encrypted with hybrid encryption (RSA + AES)
2. **Digital Signature**: Content signed with RSA private key
3. **Storage**: Only encrypted content + signature stored
4. **Retrieval**: Authorized users decrypt content and verify signature
5. **Audit**: All encryption/decryption events logged

### RBAC Implementation
- **System Roles**: `admin` (full access) | `user` (standard access)
- **Group Roles**: `owner` (creator) | `admin` (moderator) | `member` (participant)
- **Permission Checks**: Enforced at middleware and service layers
- **Role-Based UI**: Components adapt based on user permissions

### Audit Logging
All security events are logged with:
- Timestamp
- User ID
- Action type (LOGIN, REGISTER, POST_CREATE, etc.)
- Status (SUCCESS, FAILURE)
- IP Address
- Details (sanitized error messages, metadata)

## 🧪 Testing & Verification

### Verify RBAC Implementation
```powershell
.\verify_rbac.ps1
```

### Verify NIST Compliance
```powershell
.\verify_nist.ps1
```

### Manual Testing Checklist
- [ ] User registration with OTP verification
- [ ] Login with JWT authentication
- [ ] Create encrypted posts
- [ ] Verify digital signatures
- [ ] Test RBAC permissions (system & group level)
- [ ] Group join workflows (OPEN, REQUEST, INVITE_ONLY)
- [ ] Post approval workflows
- [ ] Admin panel access control
- [ ] Audit log viewing

## 📱 Pages & Components

### Pages
- **Login/Register**: Authentication with OTP verification
- **Dashboard**: Unified timeline of all announcements from joined groups
- **Explore**: Browse and join available groups
- **Group View**: View group details, posts, and manage membership
- **Admin Panel**: System administration (users, audit logs, global settings)

### Key Components
- **Sidebar**: Persistent navigation with user profile
- **GroupCard**: Display group info with join/leave actions
- **PostCard**: Show encrypted posts with decryption toggle
- **SecurityStatus**: Real-time security features dashboard
- **AuditLog**: Security event log viewer
- **RequestList**: Manage pending requests

## 🎨 Design System

### Color Palette
- **Primary**: Dark theme with Batman-inspired accents
- **Accent Colors**: Gold (#FFD700), vibrant blues, subtle gradients
- **Glassmorphism**: Translucent panels with backdrop blur
- **Typography**: Modern sans-serif fonts (Inter, Roboto)

### UI Patterns
- **Dark Mode**: Primary interface theme
- **Hover Effects**: Smooth transitions and micro-animations
- **Cards**: Glassmorphic cards with subtle shadows
- **Badges**: Role indicators (Admin, Member)
- **Icons**: Consistent icon system for actions

## 📦 Dependencies

### Backend
- `express` - Web framework
- `jsonwebtoken` - JWT authentication
- `nodemailer` - Email OTP delivery
- `crypto` (built-in) - Encryption, hashing, signatures
- `cors` - Cross-origin resource sharing
- `dotenv` - Environment configuration

### Frontend
- `react` - UI library
- `react-router-dom` - Client-side routing
- `axios` - HTTP client
- `vite` - Build tool and dev server

## 🔮 Future Enhancements

- [ ] Database integration (MongoDB/PostgreSQL)
- [ ] File attachments support
- [ ] Real-time notifications (WebSocket)
- [ ] Mobile responsive optimizations
- [ ] Advanced search and filtering
- [ ] User profile customization
- [ ] Group categories and tags
- [ ] Multi-language support
- [ ] Rate limiting and DDoS protection
- [ ] Content moderation tools

## 📄 License

This project is built as an academic demonstration of secure web application development.

## 👥 Contributing

This is an educational project. For questions or suggestions, please reach out to the project maintainer.

---

**Built with security, privacy, and user experience in mind** 🦇

