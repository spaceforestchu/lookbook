# Admin Authentication Setup Guide

## Overview
The Lookbook admin portal now has authentication protection. All admin routes require login credentials to access.

## Default Credentials

**For initial setup/testing:**
- Username: `admin`
- Password: `admin123`

⚠️ **IMPORTANT:** Change these credentials before deploying to production!

## How to Change Admin Credentials

### Option 1: Using Environment Variables (Recommended)

1. Open `backend/.env` file
2. Add or update these variables:

```bash
# Admin Authentication
ADMIN_USERNAME=your-username
ADMIN_PASSWORD_HASH=your-hashed-password
JWT_SECRET=your-secret-key-change-this-in-production
JWT_EXPIRY=7d
```

3. To generate a password hash, run this in Node.js:

```javascript
const bcrypt = require('bcrypt');
const password = 'your-new-password';
bcrypt.hash(password, 10).then(hash => console.log(hash));
```

### Option 2: Quick Setup Script

Create a file `generate-password.js` in the backend folder:

```javascript
const bcrypt = require('bcrypt');

const password = process.argv[2];
if (!password) {
  console.log('Usage: node generate-password.js <your-password>');
  process.exit(1);
}

bcrypt.hash(password, 10).then(hash => {
  console.log('\n✅ Generated Password Hash:');
  console.log('\nAdd this to your .env file:');
  console.log(`ADMIN_PASSWORD_HASH="${hash}"`);
  console.log('\n');
});
```

Run it:
```bash
cd backend
node generate-password.js MySecurePassword123
```

## Features

### Login Page
- Access at: `/admin/login`
- Clean, professional UI
- Error handling for invalid credentials
- Link back to public site

### Protected Routes
All admin routes are protected:
- `/admin` - Dashboard
- `/admin/people` - People management
- `/admin/people/:slug/edit` - Edit person
- `/admin/projects` - Projects management
- `/admin/projects/:slug/edit` - Edit project
- `/admin/bulk-upload` - Bulk upload

### Authentication State
- JWT token stored in localStorage
- Automatic token validation
- Persistent login across page refreshes
- 7-day token expiration (configurable)

### User Interface
- User info displayed in sidebar
- Logout button in admin sidebar
- Automatic redirect to login when not authenticated
- Loading state during authentication checks

## Security Features

1. **Password Hashing**: Passwords are hashed using bcrypt with 10 salt rounds
2. **JWT Tokens**: Secure token-based authentication
3. **Protected Routes**: All admin routes require valid authentication
4. **Token Expiry**: Tokens expire after configured time (default 7 days)
5. **Secure Storage**: Tokens stored in localStorage (upgrade to httpOnly cookies for production)

## Production Deployment Checklist

- [ ] Change default admin username
- [ ] Generate and set strong password hash
- [ ] Set unique JWT_SECRET (use random string generator)
- [ ] Set appropriate JWT_EXPIRY
- [ ] Consider using httpOnly cookies instead of localStorage
- [ ] Enable HTTPS in production
- [ ] Add rate limiting to login endpoint
- [ ] Add login attempt tracking/lockout
- [ ] Consider adding 2FA (future enhancement)

## API Endpoints

### POST /api/auth/login
Login with username and password
```json
{
  "username": "admin",
  "password": "admin123"
}
```

Response:
```json
{
  "success": true,
  "token": "jwt-token-here",
  "user": {
    "username": "admin",
    "role": "admin"
  }
}
```

### GET /api/auth/verify
Verify JWT token validity
```
Authorization: Bearer <token>
```

## Troubleshooting

### Can't login with default credentials
- Make sure backend server is running
- Check backend console for errors
- Verify CORS settings in backend/server.js
- Check network tab in browser devtools

### Token expires too quickly
- Adjust JWT_EXPIRY in .env file
- Default is '7d' (7 days)
- Options: '1d', '12h', '30m', etc.

### Forgot password
- Since there's no database for users (simple single-admin setup), you'll need to:
  1. Generate a new password hash
  2. Update ADMIN_PASSWORD_HASH in .env
  3. Restart the backend server

## Future Enhancements

- [ ] Multiple admin users with database storage
- [ ] Role-based access control (super admin, editor, viewer)
- [ ] Password reset functionality
- [ ] Email verification
- [ ] Two-factor authentication
- [ ] Audit log for admin actions
- [ ] Session management dashboard

