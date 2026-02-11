# Mini Social Feed App

A lightweight social media application built with React Native and Expo, featuring authentication, posts, likes, comments, and real-time push notifications.

## Features

- ✅ User Authentication (Login/Signup)
- ✅ Feed with infinite scroll
- ✅ Create text-only posts
- ✅ Like/Unlike posts with optimistic updates
- ✅ Comment on posts
- ✅ Filter feed by username
- ✅ Pull-to-refresh
- ✅ Push notifications (Firebase Cloud Messaging)
- ✅ TanStack Query for data management

## Tech Stack

- **React Native** with **Expo**
- **Expo Router** for navigation
- **TanStack Query** for data fetching and caching
- **Axios** for API calls
- **Firebase** for push notifications
- **AsyncStorage** for local data persistence

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```env
EXPO_PUBLIC_API_BASE_URL=http://your-backend-url.com/api
EXPO_PUBLIC_FIREBASE_API_KEY=your_EXPO_PUBLIC_FIREBASE_API_KEY
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 3. Firebase Setup

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Firebase Cloud Messaging (FCM)
3. Download configuration files:
    - `google-services.json` for Android → place in `android/app/`
    - `GoogleService-Info.plist` for iOS → place in `ios/`
4. Update `app.json` with Firebase plugin configuration

### 4. Backend API Requirements

Your backend should provide these endpoints:

**Authentication:**

- `POST /auth/login` - Login with email and password
- `POST /auth/signup` - Create new account

**Posts:**

- `GET /posts?page=1&limit=10&username=` - Get posts with pagination
- `POST /posts` - Create new post
- `POST /posts/:id/like` - Like a post
- `DELETE /posts/:id/like` - Unlike a post

**Comments:**

- `GET /posts/:id/comments` - Get comments for a post
- `POST /posts/:id/comments` - Add comment to a post

**Notifications:**

- `POST /notifications/register` - Register FCM token

### 5. Run the App

```bash
# Start Expo development server
npx expo start

# Run on iOS
npx expo start --ios

# Run on Android
npx expo start --android
```

## Project Structure

```
src/
├── api/
│   ├── client.js              # Axios instance with interceptors
│   └── endpoints/             # API endpoint functions
├── hooks/
│   └── queries/               # TanStack Query hooks
├── contexts/
│   └── AuthContext.js         # Authentication state
├── providers/
│   └── QueryProvider.js       # TanStack Query setup
├── screens/
│   ├── auth/                  # Login & Signup
│   └── feed/                  # Feed, Create Post, Comments
├── components/                # Reusable UI components
├── utils/                     # Utility functions
└── constants/                 # Theme & configuration
```

## Key Features Implementation

### TanStack Query

- Infinite scroll for feed with automatic pagination
- Optimistic updates for likes and comments
- Automatic cache invalidation
- Pull-to-refresh support

### Authentication

- JWT token-based authentication
- Automatic token storage and retrieval
- Auto-login on app start
- Protected routes with conditional navigation

### UI/UX

- Beautiful gradient designs for auth screens
- Smooth animations and transitions
- Loading states and error handling
- Empty states for better UX

## Testing

1. **Authentication Flow:**
    - Test signup with valid/invalid data
    - Test login with correct/incorrect credentials
    - Verify token persistence

2. **Feed Functionality:**
    - Test infinite scroll
    - Test pull-to-refresh
    - Test username filtering
    - Verify optimistic updates for likes

3. **Post Creation:**
    - Test character limit validation
    - Verify post appears in feed

4. **Comments:**
    - Test adding comments
    - Verify optimistic updates

5. **Notifications (requires physical device):**
    - Test FCM token registration
    - Test receiving push notifications

## Notes

- The app uses mock data if backend is not configured
- Push notifications require a physical device (won't work on simulator)
- Update the API base URL in `.env` to point to your backend

## License

MIT
