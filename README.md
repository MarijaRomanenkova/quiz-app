# DeutschQuiz - React Native Mobile Development Project

A German language learning mobile application built with React Native, featuring interactive quizzes, progress tracking, and user authentication.

## 📱 Quick Start - Get the Mobile App Running

### Prerequisites (5 minutes setup)
- **Node.js**: Version 20+ ([Download here](https://nodejs.org/))
- **Docker Desktop**: ([Download here](https://www.docker.com/products/docker-desktop/))

### 🚀 Start the Mobile App (3 steps)

#### Step 1: Start Backend Services
```bash
# Clone and navigate to project
git clone <repository-url>
cd mobile-project

# Start database and backend (takes ~30 seconds)
docker-compose up -d
```

#### Step 2: Setup Database
```bash
# Navigate to backend and install dependencies
cd backend
npm install

# Setup database with sample data
npx prisma migrate deploy
npx prisma db seed
```

#### Step 3: Start Mobile App
```bash
# Navigate to mobile app
cd ../mobile

# Install dependencies
npm install

# Start the React Native app
npm start
```

### 📱 Access the Mobile App

**Option 1: Web Browser (Recommended)**
- After running `npm start`, press `w` in the terminal
- Or manually open http://localhost:19006 in your browser
- The app will run directly in your web browser
- No additional software needed

**Option 2: Simulator**
- Press `i` for iOS Simulator (Mac only)
- Press `a` for Android Emulator (requires Android Studio)

## 🎯 What You'll See

The mobile app includes:
- **Login/Registration**: Create account with email verification
- **Quiz Categories**: Vocabulary, Grammar, Reading comprehension
- **Interactive Quizzes**: Multiple choice questions with images and audio
- **Progress Tracking**: Statistics and learning progress
- **User Profile**: Personal information and achievements

## 🧪 Test the Mobile App

### Quick Test Flow:
1. **Register** a new user account
2. **Verify email** (check your email for verification link)
3. **Login** and explore categories
4. **Take a quiz** in any category
5. **Check progress** in the statistics screen

### Backend API Testing:
```bash
# Check if backend is running
curl http://localhost:3000/health

# Should return: {"status":"ok","timestamp":"..."}
```

## 🔧 Troubleshooting

### Mobile App Issues

**App won't load on phone:**
- Make sure your phone and computer are on the same WiFi network
- Try refreshing the Expo Go app
- Restart the development server: `npm start`

**Backend connection errors:**
```bash
# Check if backend is running
docker-compose ps

# Restart backend if needed
docker-compose restart backend
```

**Database issues:**
```bash
# Reset database
docker-compose down
docker-compose up -d
cd backend && npx prisma migrate deploy && npx prisma db seed
```

## 📱 Mobile App Features Demonstrated

### React Native Components Used:
- **Navigation**: React Navigation with Stack and Tab navigators
- **State Management**: Redux Toolkit with Redux Persist
- **UI Components**: React Native Paper (Material Design)
- **Forms**: React Hook Form with Zod validation
- **Audio**: Custom AudioPlayer component
- **Charts**: Custom chart components (no external libraries)
- **Authentication**: JWT token management with AsyncStorage

### Key Mobile Screens:
1. **Splash Screen**: App initialization
2. **Login/Register**: Authentication flow
3. **Home**: Category selection
4. **Quiz**: Interactive question interface
5. **Results**: Score display and progress
6. **Profile**: User information and statistics
7. **Progress**: Learning analytics and charts

## 🧪 Mobile App Testing

### Run Mobile Tests:
```bash
cd mobile

# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific test file
npm test -- Quiz.test.tsx
```

### Test Coverage Areas:
- **Components**: UI rendering and user interactions
- **Redux Store**: State management and async actions
- **Services**: API integration and error handling
- **Hooks**: Custom React hooks functionality
- **Utils**: Utility functions and helpers

## 📁 Mobile App Structure

```
mobile/
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── Quiz/            # Quiz-related components
│   │   ├── Button/          # Custom button component
│   │   ├── Input/           # Form input component
│   │   ├── AudioPlayer/     # Audio playback component
│   │   └── Results/         # Results display components
│   ├── screens/             # Application screens
│   │   ├── Login/           # Authentication screens
│   │   ├── Home/            # Main dashboard
│   │   ├── Quiz/            # Quiz interface
│   │   ├── Profile/         # User profile
│   │   └── Progress/        # Statistics and progress
│   ├── store/               # Redux state management
│   │   ├── authSlice.ts     # Authentication state
│   │   ├── quizSlice.ts     # Quiz state
│   │   └── progressSlice.ts # Progress tracking
│   ├── services/            # API integration
│   ├── hooks/               # Custom React hooks
│   ├── utils/               # Utility functions
│   └── types/               # TypeScript definitions
├── __tests__/               # Test files
└── package.json             # Dependencies and scripts
```

## 🎯 Mobile Development Focus

This project demonstrates:
- **React Native** mobile app development
- **Cross-platform** compatibility (iOS, Android, Web)
- **Modern React** patterns (hooks, context, functional components)
- **State Management** with Redux Toolkit
- **Navigation** with React Navigation
- **UI/UX** with Material Design principles
- **Testing** with Jest and React Native Testing Library
- **TypeScript** for type safety

## 📄 License

This project is licensed under the MIT License. 
