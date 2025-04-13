# Test Credentials

## Staff User
- **Username**: staff
- **Email**: staff@example.com
- **Password**: staffpass123
- **Role**: staff
- **Balance**: $100.00
- **Permissions**: 
  - View own balance
  - View all balances
  - Manage balances

## Student User
- **Username**: student
- **Email**: student@example.com
- **Password**: studentpass123
- **Role**: student
- **Balance**: $50.00
- **Permissions**:
  - View own balance

## Admin User
- **Username**: admin
- **Email**: admin@example.com
- **Password**: adminpass123
- **Role**: admin
- **Balance**: $200.00
- **Permissions**:
  - View own balance
  - View all balances
  - Manage balances
  - All admin privileges

## API Endpoints
- Login: `http://localhost:8000/api/auth/login/`
- Profile: `http://localhost:8000/api/users/profile/`
- Balance: `http://localhost:8000/api/users/balance/`
- Menu: `http://localhost:8000/api/menu/`

## Testing Notes
1. Use these credentials to test different user roles and permissions
2. Staff and admin can view all balances
3. Students can only view their own balance
4. Admin has full system access 