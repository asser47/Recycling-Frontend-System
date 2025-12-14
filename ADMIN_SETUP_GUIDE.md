# 🔐 Admin Panel - Structure & Setup Guide
## Recycling Frontend System

---

## 📋 ملخص التحديثات (Summary of Updates)

### ✅ ما تم إنجازه:

#### 1. **إعادة تنظيم Routes** ✨
- ✅ تحويل admin routes من `admin/dashboard` إلى nested routing structure
- ✅ الآن جميع admin pages تحت `/admin/*`:
  ```
  /admin/dashboard
  /admin/reward-management
  /admin/manage-users
  /admin/manage-orders
  /admin/manage-materials
  /admin/manage-factories
  /admin/edit-reward/:id
  ```

#### 2. **Admin Guard & Security** 🔒
- ✅ تطبيق `adminGuard` على جميع `/admin/*` routes
- ✅ التحقق من role == 'admin' قبل الوصول
- ✅ redirect إلى home إذا لم يكن admin

#### 3. **Admin Layout Component** 🏗️
- ✅ إنشاء `AdminLayoutComponent` كـ wrapper
- ✅ يحتوي على sidebar navigation و router-outlet
- ✅ مرن وقابل للتوسع

#### 4. **Admin Navigation Sidebar** 🗂️
- ✅ إنشاء `AdminNavbarComponent` standalone component
- ✅ Navigation items مع icons و links
- ✅ Responsive design مع Tailwind CSS
- ✅ Logout functionality

#### 5. **Admin Service Enhancement** 📡
- ✅ إضافة `getAllUsers()`, `getUser(id)`, `deleteUser(id)` methods
- ✅ دعم CRUD operations للمستخدمين

#### 6. **Manage Users Component** 👥
- ✅ إنشاء full-featured manage users page
- ✅ Search/Filter functionality
- ✅ Delete user capability
- ✅ Using signals و computed values

---

## 📁 File Structure الجديد

```
src/app/
├── core/
│   ├── guards/
│   │   └── admin/
│   │       └── admin-guard.ts          ✅ [موجود]
│   ├── services/
│   │   └── admin.service.ts             ✅ [محدث - يشمل User CRUD]
│   └── models/
│       └── dtos.model.ts                ✅ [موجود]
│
├── features/
│   └── admin/
│       ├── admin-layout/
│       │   └── admin-layout.component.ts    ✅ [جديد]
│       │
│       ├── admin-navbar/
│       │   └── admin-navbar.component.ts    ✅ [جديد]
│       │
│       └── admin-dashboard/
│           ├── dashboard/
│           │   └── dashboard.ts             ✅ [موجود]
│           ├── reward-management/
│           │   └── reward-management.ts     ✅ [موجود]
│           ├── manage-users/
│           │   ├── manage-users.ts          ✅ [جديد/محدث]
│           │   ├── manage-users.html        [محتاج تحديث]
│           │   └── manage-users.css         [محتاج تحديث]
│           ├── manage-orders/
│           │   └── manage-orders.ts         ✅ [موجود]
│           ├── manage-materials/
│           │   └── manage-materials.ts      ✅ [موجود]
│           ├── manage-factories/
│           │   └── manage-factories.ts      ✅ [موجود]
│           └── edit-reward/
│               └── edit-reward.ts           ✅ [موجود]
│
└── app.routes.ts                        ✅ [محدث - nested routes]
```

---

## 🔌 Routes Configuration

### الهيكل الجديد:
```typescript
{
  path: 'admin',
  loadComponent: () => import('./features/admin/admin-layout/admin-layout.component')
    .then(m => m.AdminLayoutComponent),
  canActivate: [AuthGuard, adminGuard],  // Double guard
  children: [
    { path: 'dashboard', loadComponent: ... },
    { path: 'reward-management', loadComponent: ... },
    { path: 'manage-users', loadComponent: ... },
    { path: 'manage-orders', loadComponent: ... },
    { path: 'manage-materials', loadComponent: ... },
    { path: 'manage-factories', loadComponent: ... },
    { path: 'edit-reward/:id', loadComponent: ... }
  ]
}
```

---

## 🔗 كيفية الوصول للـ Admin Panel

### من Navbar:
يتم التحويل التلقائي من خلال `getDashboardRoute()`:
```typescript
getDashboardRoute(): string {
  const role = this.userService.currentRole();
  if (role === 'collector') return '/collector-dashboard';
  if (role === 'admin') return '/admin/dashboard';  // ✅ جديد
  return '/citizen-dashboard';
}
```

### مباشر:
- **URL**: `http://localhost:4200/admin/dashboard`
- يتم التحقق من:
  1. `AuthGuard` - هل المستخدم مسجل دخول؟
  2. `adminGuard` - هل المستخدم admin؟

---

## 🎯 Admin Pages Overview

### 1. **Dashboard** (`/admin/dashboard`)
```typescript
// السمات:
- Stats cards مع metrics
- Line charts للوحات مراقبة
- Summary data من جميع Services
- Real-time updates
```

### 2. **Reward Management** (`/admin/reward-management`)
```typescript
// السمات:
- List, Create, Edit, Delete rewards
- Search & Filter
- Image upload
- Stock management
```

### 3. **Manage Users** (`/admin/manage-users`) ✨ جديد
```typescript
// السمات:
- View all users
- Search by name/email
- Delete users
- User statistics
```

### 4. **Manage Orders** (`/admin/manage-orders`)
```typescript
// السمات:
- List all orders
- Filter by status
- Assign to collectors/factories
- Status updates
```

### 5. **Manage Materials** (`/admin/manage-materials`)
```typescript
// السمات:
- CRUD operations
- Price management
- Size/weight tracking
- Batch operations
```

### 6. **Manage Factories** (`/admin/manage-factories`)
```typescript
// السمات:
- Factory management
- Location tracking
- Details & statistics
- Capacity management
```

---

## 🚀 ملخص الخطوات التالية

### المرحلة القادمة - يجب إكمالها:

#### 1. ✏️ HTML Templates
- [ ] تحديث `manage-users.html` - إضافة table و search
- [ ] تحديث باقي الـ `*.html` files إذا لزم الأمر
- [ ] أضف styling مناسب (CSS/Tailwind)

#### 2. 🧪 Testing
```bash
# اختبر الـ routing:
- Navigate to /admin/dashboard
- Check admin guard validation
- Try switching between admin pages
```

#### 3. 🔧 Fix Remaining Issues
- [ ] Update `manage-users.html` مع جدول البيانات
- [ ] Verify all imports في الـ components
- [ ] Test mobile responsive design

#### 4. 📱 Mobile Support
- [ ] أضف admin link في mobile navbar إذا لزم الأمر
- [ ] اختبر responsive design

#### 5. 🔌 API Integration
- [ ] تأكد من أن جميع endpoints موجودة في الـ Backend
- [ ] Test actual data loading من الـ API

---

## 📝 Service Methods Reference

### AdminService - جديد
```typescript
// User Management
getAllUsers(): Observable<ApplicationUserDto[]>
getUser(id: string): Observable<ApplicationUserDto>
deleteUser(id: string): Observable<any>

// Factory Management
getAllFactories(): Observable<any[]>
getFactory(id: number): Observable<any>
createFactory(dto): Observable<any>
updateFactory(dto): Observable<any>
deleteFactory(id: number): Observable<any>

// Material Management
getAllMaterials(): Observable<MaterialDto[]>
getMaterial(id: number): Observable<MaterialDto>
createMaterial(dto): Observable<MaterialDto>
updateMaterial(id, dto): Observable<MaterialDto>
deleteMaterial(id: number): Observable<any>
```

---

## ⚠️ ملاحظات مهمة

1. **Double Guard**: كل صفحة admin محمية بـ `AuthGuard` و `adminGuard`
2. **Lazy Loading**: جميع المكونات تُحمل بشكل lazy
3. **Standalone Components**: جميع المكونات standalone (Angular 15+)
4. **Signals**: الـ state management يستخدم Angular Signals
5. **Tailwind CSS**: جميع الـ styling يستخدم Tailwind

---

## 🎓 Commands للـ Development

```bash
# تشغيل التطبيق
ng serve

# بناء الـ Project
ng build

# تشغيل الـ Tests
ng test

# Linting
ng lint

# Navigate إلى Admin:
# http://localhost:4200/admin/dashboard
```

---

## 🔍 Troubleshooting

### إذا واجهت الـ Routes error:
1. تأكد من أن جميع imports صحيحة
2. تحقق من مسارات الـ files
3. تأكد من export الـ components

### إذا لم تعمل الـ Guard:
1. تحقق من `adminGuard.ts`
2. تأكد من تضمينها في الـ route config
3. تحقق من `auth.getRole()` في الـ service

### إذا لم تحمل البيانات:
1. تحقق من الـ API endpoints
2. تأكد من التوثيق (auth token)
3. تحقق من الـ interceptors

---

## 📞 المساعدة والدعم

لأي استفسار أو مشكلة:
1. تحقق من console للـ errors
2. تحقق من Network tab في DevTools
3. اطلب المساعدة مع screenshots الـ errors

---

**آخر تحديث**: ديسمبر 2025  
**الحالة**: جاهز للـ Testing ✅
