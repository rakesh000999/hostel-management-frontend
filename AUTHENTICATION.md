# Hostel Management Frontend - Authentication System

## Overview

This frontend implements a complete JWT-based authentication system integrated with your backend API. The system includes user registration, login, and role-based access control with protected routes.

## Features Implemented

### 1. **Authentication Context** (`src/context/AuthContext.jsx`)

- Centralized authentication state management
- Automatic JWT token handling
- User session persistence
- Auto-login on page refresh
- Error handling and user feedback

### 2. **JWT Token Management** (`src/api/axios.js`)

- Automatic token injection in request headers
- Token refresh/storage in localStorage
- Auto-logout on 401 responses
- Request/response interceptors for token handling

### 3. **Protected Routes** (`src/components/ProtectedRoute.jsx`)

- Route-level access control
- Automatic redirect to login for unauthenticated users
- Loading state while checking authentication
- Seamless integration with React Router

### 4. **Login Page** (`src/pages/Login.jsx`)

- Email/password authentication
- Show/hide password toggle
- Real-time error display
- Loading state with spinner
- Link to registration page
- Responsive design

### 5. **Registration Page** (`src/pages/Register.jsx`)

- User registration with name, email, and password
- Password confirmation validation
- Password strength validation (min 6 characters)
- Show/hide password toggles
- Error handling and display
- Responsive design

### 6. **Enhanced Navbar** (`src/components/Navbar.jsx`)

- Dynamic authentication status display
- User profile dropdown menu
- Logout functionality
- Responsive mobile menu
- User info display (name, email, role)

## File Structure

```
src/
├── api/
│   ├── axios.js              # Axios instance with JWT interceptors
│   └── authApi.js            # API endpoints reference
├── context/
│   └── AuthContext.jsx       # Authentication context provider
├── components/
│   ├── ProtectedRoute.jsx    # Protected route wrapper
│   ├── Navbar.jsx            # Updated navbar with user menu
│   └── ... (other components)
├── pages/
│   ├── Login.jsx             # Login page
│   ├── Register.jsx          # Registration page
│   └── ... (other pages)
└── App.jsx                   # Updated with AuthProvider
```

## Setup Instructions

### 1. **Environment Setup**

Make sure your backend is running on `http://localhost:8080` and has CORS configured for `http://localhost:5173`.

### 2. **Start Development Server**

```bash
npm run dev
```

### 3. **Access the Application**

- Frontend: `http://localhost:5173`
- Login: `http://localhost:5173/login`
- Register: `http://localhost:5173/register`

## Usage Guide

### For Users

1. **First Time Users**
   - Click "Sign up here" on the login page
   - Fill in name, email, and password
   - Click "Create Account"
   - Redirect to login page
   - Login with credentials

2. **Existing Users**
   - Go to login page
   - Enter email and password
   - Click "Sign In"
   - Redirected to home page

3. **Logged-in Users**
   - Click on username in navbar to see user menu
   - View profile information
   - Click "Logout" to sign out

### For Developers

#### Using AuthContext in Components

```jsx
import { useContext } from "react";
import AuthContext from "../context/AuthContext";

const MyComponent = () => {
  const { user, isAuthenticated, token, login, logout, register, error } =
    useContext(AuthContext);

  return (
    <div>
      {isAuthenticated ? <p>Welcome, {user.name}!</p> : <p>Please login</p>}
    </div>
  );
};
```

#### Making Protected API Calls

```jsx
import api from "../api/axios";

const fetchData = async () => {
  try {
    const response = await api.get("/your-endpoint");
    console.log(response.data);
  } catch (error) {
    console.error("Error:", error);
  }
};
```

#### Creating Protected Routes

```jsx
<Route
  path="/protected-page"
  element={
    <ProtectedRoute>
      <YourComponent />
    </ProtectedRoute>
  }
/>
```

## API Integration

### Authentication Endpoints

#### Register

```
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login

```
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "password123"
}
Response: { "token": "jwt-token-here" }
```

#### Get Current User

```
GET /api/auth/me
(Headers: Authorization: Bearer <token>)
Response: { "id", "email", "name", "role", "profileImage" }
```

## Token Handling

The system automatically:

1. **Stores JWT token** in localStorage after login
2. **Includes token** in all subsequent API requests via Authorization header
3. **Removes token** when user logs out
4. **Clears token** on 401 responses (session expired)
5. **Persists session** across page refreshes

## Authentication Flow

```
User Registration/Login
        ↓
AuthContext receives credentials
        ↓
API call to backend
        ↓
JWT token received
        ↓
Token stored in localStorage
        ↓
User data fetched and stored in context
        ↓
isAuthenticated = true
        ↓
Protected routes become accessible
        ↓
JWT token auto-injected in all API requests
```

## Security Notes

1. **Token Storage**: Tokens are stored in localStorage for simplicity. For production, consider:
   - HttpOnly cookies for additional security
   - Token refresh mechanism
   - Token expiration handling

2. **Password**:
   - Minimum 6 characters
   - Consider regex validation for stronger passwords
   - Implement password recovery feature

3. **CORS**: Configured for localhost:5173. Update for production domains.

## Responsive Design

All authentication pages are fully responsive:

- **Mobile**: Stack layout, full-width forms
- **Tablet**: Optimized spacing and touch targets
- **Desktop**: Standard layout with hover effects

### Breakpoints

- Mobile: < 768px (md)
- Tablet: 768px - 1024px
- Desktop: > 1024px

## Error Handling

The system provides user-friendly error messages for:

- Network errors
- Invalid credentials
- Validation errors
- Session expiration
- Server errors

Errors are displayed in a styled alert box on the login/register pages.

## Testing the Authentication

### Test Credentials (after registration)

```
Email: test@example.com
Password: password123
```

### Test Flow

1. Register with new credentials
2. Login with those credentials
3. View user info in navbar
4. Try accessing protected routes
5. Logout and verify redirect to login

## Troubleshooting

### Token not persisting

- Check if localStorage is enabled
- Clear browser cache and try again
- Check browser console for errors

### Protected routes redirecting to login

- Verify user is logged in
- Check token in localStorage
- Ensure backend /auth/me is returning user data

### CORS errors

- Verify backend has CORS enabled
- Check backend is running on localhost:8080
- Update CORS whitelist if needed

## Future Enhancements

1. **Password Recovery** - Implement forgot password feature
2. **Email Verification** - Verify email before account activation
3. **Two-Factor Authentication** - Add 2FA support
4. **Role-based UI** - Show different UI based on user role
5. **Profile Management** - Allow users to update profile
6. **Token Refresh** - Implement refresh token mechanism
7. **Remember Me** - Extended session for "Remember Me" checkbox

## Support

For issues or questions:

1. Check browser console for errors
2. Verify backend API is running
3. Check network requests in DevTools
4. Review server logs for backend errors

---

**Last Updated**: March 2026
**React Version**: 19.1.1
**Router Version**: 7.9.4
**Tailwind CSS**: 4.1.16
