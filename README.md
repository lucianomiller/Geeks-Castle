# Geeks Castle - Clean Architecture with Cloud Functions

Complete user management system implementing Clean Architecture, using NestJS for the REST API and Firebase Cloud Functions for automatic password generation through Firestore triggers.

## 🏗️ Architecture

### NestJS API (Clean Architecture)
- **Domain Layer**: Entities and repository contracts
- **Application Layer**: Use cases and DTOs
- **Infrastructure Layer**: Firebase implementations and repositories
- **Presentation Layer**: Controllers and modules

### Cloud Functions (Clean Architecture)
- **Domain Layer**: Entities and service contracts
- **Application Layer**: Use cases and password generation services
- **Infrastructure Layer**: Firebase configuration
- **Presentation Layer**: Firestore triggers

## 🚀 Features

- ✅ Clean Architecture in both projects
- ✅ TypeScript with strict typing
- ✅ NestJS Framework for REST API
- ✅ Firebase Firestore as database
- ✅ Cloud Functions with real Firestore triggers
- ✅ Cryptographically secure password generation
- ✅ Hashing with bcrypt
- ✅ DTO validation with class-validator
- ✅ Unit tests
- ✅ Firebase Emulators for local development
- ✅ Dependency injection

## 📋 Prerequisites

- Node.js >= 18
- npm >= 8
- Firebase CLI
- Git

## 🔧 Installation
```bash
# Clone repository
git clone https://github.com/lucianomiller/Geeks-Castle.git
cd Geeks-Castle

# Install main project dependencies
npm install

# Install Cloud Functions dependencies
npm run functions:install

# Install Firebase CLI globally (if not installed)
npm install -g firebase-tools

# Login to Firebase
firebase login

# Inicializar Firebase
firebase init
```

## ⚙️ Configuration

1. Create `.env` file in root:
```env
NODE_ENV=development
PORT=3000
FIREBASE_PROJECT_ID=geeks-castle
FIRESTORE_EMULATOR_HOST=localhost:8080
```

2. Initialize Firebase (if needed):
```bash
firebase init
# Select:
# - Emulators (Firestore, Functions)
```

## 🎯 Usage

### Option 1: Run everything with one command
```bash
npm run dev
```

### Option 2: Run separately
```bash
# Terminal 1: Start Firebase emulators
npm run emulators

# Terminal 2: Start NestJS API
npm run start:dev
```

### Verify everything works
```bash
# Check API
curl http://localhost:3000/api/v1

# Firebase Emulator UI
open http://localhost:4000
```

## 📡 API Endpoints

### Create User WITH Password
```bash
curl -X POST http://localhost:3000/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "MySecurePass123!"
  }'
```

### Create User WITHOUT Password (auto-generated)
```bash
curl -X POST http://localhost:3000/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{
    "username": "janedoe",
    "email": "jane@example.com"
  }'
```

**Expected Response:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "username": "janedoe",
  "email": "jane@example.com",
  "createdAt": "2025-01-21T10:30:00.000Z"
}
```

**After 1-2 seconds**, the Cloud Function will generate the password and update the document in Firestore.

## 🔍 Complete Flow

1. **Client** makes POST to `/api/v1/users`
2. **NestJS API** validates the DTO
3. **CreateUserUseCase** checks email doesn't exist
4. **UserRepository** creates document in Firestore
5. **Cloud Function Trigger** activates automatically
6. **GenerateUserPasswordUseCase** generates secure password if it doesn't exist
7. **PasswordGeneratorService** creates and hashes password or simply hashes if it already exists
8. **Cloud Function** updates document in Firestore

## 🧪 Tests

### API Tests (NestJS)
```bash
# Unit tests
npm test
```

### Cloud Functions Tests
```bash
# Unit tests for functions
npm run functions:test
```