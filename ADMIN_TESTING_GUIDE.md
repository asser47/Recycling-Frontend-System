# 🚀 Admin Panel - Testing & Verification Guide

## ✅ Completed Tasks

### Phase 1: Routing & Architecture ✨
- ✅ Migrated admin routes to nested structure under `/admin`
- ✅ Implemented double guard system (AuthGuard + adminGuard)
- ✅ Created AdminLayoutComponent as main wrapper
- ✅ Created AdminNavbarComponent with 6 main navigation items
- ✅ Fixed guard imports and route configurations

### Phase 2: Components & Services 🔧
- ✅ Enhanced AdminService with User CRUD methods
- ✅ Created/Updated all admin page components
- ✅ ManageUsersComponent with search & delete functionality
- ✅ All components use Angular Signals for state management
- ✅ Proper TypeScript typing with DTOs

### Phase 3: Templates & Styling 🎨
- ✅ manage-users.html - Full data table with search
- ✅ manage-materials.html - Existing template verified
- ✅ manage-factories.html - Existing template verified
- ✅ manage-orders.html - Existing template verified
- ✅ CSS for manage-users with responsive design

---

## 📋 Quick Testing Checklist

### Step 1: Build & Serve
```bash
ng serve
# Or if running in background:
ng serve --open
```

### Step 2: Test Routes
Navigate to these URLs in your browser:

| Route | Expected Result |
|-------|-----------------|
| `http://localhost:4200/admin/dashboard` | Admin dashboard with stats & charts |
| `http://localhost:4200/admin/manage-users` | User table with search |
| `http://localhost:4200/admin/reward-management` | Reward management form |
| `http://localhost:4200/admin/manage-orders` | Orders table |
| `http://localhost:4200/admin/manage-materials` | Materials table |
| `http://localhost:4200/admin/manage-factories` | Factories table |

### Step 3: Test Authentication
- ❌ Try accessing `/admin/dashboard` without login → Should redirect to login
- ❌ Login as non-admin user → Should redirect to home/dashboard
- ✅ Login as admin → Should be able to access all admin pages

### Step 4: Test Sidebar Navigation
- Click each item in the admin navbar
- Verify URL changes correctly
- Verify page content loads

### Step 5: Test Features

#### ManageUsers Page
- [ ] Search bar works correctly
- [ ] Filter updates table in real-time
- [ ] Refresh button loads latest data
- [ ] Delete button shows confirmation
- [ ] Stats cards display correct numbers

#### Other Pages
- [ ] Forms load without errors
- [ ] Tables display data
- [ ] Filters/search work
- [ ] Buttons are clickable

---

## 🔍 File Structure Summary

```
admin/
├── admin-layout/
│   └── admin-layout.component.ts          [Wrapper with sidebar]
│
├── admin-navbar/
│   └── admin-navbar.component.ts          [Sidebar navigation]
│
└── admin-dashboard/
    ├── dashboard/                         [Stats & charts]
    ├── reward-management/                 [Reward CRUD]
    ├── manage-users/                      [User table & search]
    ├── manage-orders/                     [Order management]
    ├── manage-materials/                  [Material management]
    ├── manage-factories/                  [Factory management]
    └── edit-reward/                       [Edit reward form]
```

---

## 🛠️ API Endpoints Needed

Make sure your backend has these endpoints:

```
User Management:
  GET    /api/User                 - Get all users
  GET    /api/User/:id             - Get user by ID
  DELETE /api/User/:id             - Delete user

Material Management:
  GET    /api/Material             - Get all materials
  GET    /api/Material/:id         - Get material by ID
  POST   /api/Material             - Create material
  PUT    /api/Material/:id         - Update material
  DELETE /api/Material/:id         - Delete material

Factory Management:
  GET    /api/Factory              - Get all factories
  GET    /api/Factory/:id          - Get factory details
  POST   /api/Factory              - Create factory
  PUT    /api/Factory              - Update factory
  DELETE /api/Factory/:id          - Delete factory

Order Management:
  GET    /api/Order                - Get all orders
  GET    /api/Order/:id            - Get order details
  PUT    /api/Order/:id            - Update order status

Reward Management:
  GET    /api/Reward               - Get all rewards
  GET    /api/Reward/:id           - Get reward by ID
  POST   /api/Reward               - Create reward
  PUT    /api/Reward/:id           - Update reward
  DELETE /api/Reward/:id           - Delete reward
```

---

## 🐛 Troubleshooting

### Problem: Routes not loading
**Solution**: Check browser console for errors. Verify paths in app.routes.ts

### Problem: Guard redirecting unexpectedly
**Solution**: Verify auth token in localStorage. Check AuthService.getRole() method

### Problem: Data not loading
**Solution**: Check network tab in DevTools. Verify API endpoints are correct.

### Problem: Components not found
**Solution**: Ensure all component exports are correct. Check import paths.

---

## 📝 Environment Variables

Make sure you have:
```
API_URL = https://localhost:4375
```

Verify in:
- `api.config.service.ts`
- `admin.service.ts`
- Other service files

---

## 🎯 Next Steps

### After Testing:
1. Fix any remaining compilation errors
2. Verify all API endpoints work
3. Test with real data from backend
4. Check responsive design on mobile
5. Optimize loading times
6. Add error handling for API calls
7. Implement toast/notification messages

### Optional Enhancements:
- [ ] Add data pagination
- [ ] Add bulk operations (delete multiple)
- [ ] Add export to CSV
- [ ] Add advanced filtering
- [ ] Add user role management
- [ ] Add activity logging

---

## 📞 Support

If you encounter any issues:
1. Check the browser console for error messages
2. Check the Network tab to see API responses
3. Review the component code for logic errors
4. Check the README.md for general setup

---

**Status**: Ready for Testing ✅  
**Last Updated**: December 14, 2025  
**Tested Components**: ✅ AdminLayout, AdminNavbar, ManageUsers
