# 🔄 Migration Guide - Updated Routing System

## نظرة عامة
هذا الملف يشرح كيفية التعامل مع التغييرات الجديدة في نظام الـ Routing.

---

## ✅ ما الذي تغير؟

### 1. تدفق تسجيل الدخول الجديد
**القديم**:
```
Login → Direct to /citizen-dashboard
```

**الجديد**:
```
Login → /role-selection → /citizen-dashboard or /collector-dashboard
```

### 2. الـ Guards الجديدة
- `roleSelectionGuard`: يضمن اختيار الدور
- `citizenGuard`: يقيد الوصول للـ Citizens فقط
- `collectorGuard`: يقيد الوصول للـ Collectors فقط

### 3. السلوك الجديد
- الـ NavBar يختفي في الـ Landing والـ Auth pages
- Auto-logout عند انتهاء صلاحية الـ Token
- التحقق التلقائي من صلاحية الـ Token كل 5 دقائق

---

## 🔧 كيفية التعامل مع النظام الجديد

### إذا كنت تريد إضافة مسار محمي جديد:

```typescript
// في app.routes.ts

{
  path: 'my-new-page',
  loadComponent: () => import('./features/my-page/my-page.component').then(m => m.MyPageComponent),
  canActivate: [AuthGuard, roleSelectionGuard] // ← أضف هذا
}
```

### إذا كنت تريد مسار خاص بـ Citizens فقط:

```typescript
{
  path: 'citizen-only-feature',
  loadComponent: () => import('./features/citizen-feature/citizen-feature.component').then(m => m.CitizenFeatureComponent),
  canActivate: [AuthGuard, citizenGuard] // ← استخدم citizenGuard
}
```

### إذا كنت تريد مسار خاص بـ Collectors فقط:

```typescript
{
  path: 'collector-only-feature',
  loadComponent: () => import('./features/collector-feature/collector-feature.component').then(m => m.CollectorFeatureComponent),
  canActivate: [AuthGuard, collectorGuard] // ← استخدم collectorGuard
}
```

### إذا كنت تريد مسار خاص بـ Admins فقط:

```typescript
{
  path: 'admin-only-feature',
  loadComponent: () => import('./features/admin-feature/admin-feature.component').then(m => m.AdminFeatureComponent),
  canActivate: [AuthGuard, adminGuard] // ← استخدم adminGuard
}
```

---

## 📊 جدول المسارات المحمية

| المسار | Guards المطلوب | الملاحظات |
|--------|--------------|---------|
| `/citizen-dashboard` | AuthGuard + citizenGuard | للـ Citizens فقط |
| `/collector-dashboard` | AuthGuard + collectorGuard | للـ Collectors فقط |
| `/admin/*` | AuthGuard + adminGuard | للـ Admins فقط |
| `/profile` | AuthGuard + roleSelectionGuard | للمسجلين المصرحين |
| `/settings` | AuthGuard + roleSelectionGuard | للمسجلين المصرحين |
| `/notifications` | AuthGuard + roleSelectionGuard | للمسجلين المصرحين |

---

## 🛡️ أمثلة الاستخدام في المكونات

### التحقق من حالة تسجيل الدخول:
```typescript
import { AuthService } from '@core/services/auth.service';

export class MyComponent {
  constructor(private auth: AuthService) {}

  isLoggedIn = this.auth.isLogged;
  userRole = this.auth.role;
  
  ngOnInit() {
    if (this.isLoggedIn()) {
      // المستخدم مسجل دخول
    }
  }
}
```

### التحقق من صلاحية الـ Token:
```typescript
import { AuthService } from '@core/services/auth.service';

export class MyComponent {
  constructor(private auth: AuthService) {}

  isTokenValid = this.auth.tokenValid;
  
  ngOnInit() {
    if (!this.isTokenValid()) {
      // الـ Token منتهي الصلاحية
      this.auth.logout();
    }
  }
}
```

### استخدام Loading Interceptor:
```typescript
import { LoadingInterceptor } from '@core/interceptors/loading-interceptor';

export class MyComponent {
  constructor(private loading: LoadingInterceptor) {}

  isLoading = this.loading.isLoading;
  
  // في Template:
  // @if (isLoading()) { <spinner></spinner> }
}
```

---

## 🔄 سيناريوهات القيادة (User Flows)

### Scenario 1: First Time User
```
1. يزور Landing Page (/)
   ↓ بدون navbar
2. ينقر على "Register"
   ↓ يملأ النموذج
3. يصل إلى Register Success
   ↓ يرى زر "Go to Login"
4. يذهب إلى Login
   ↓ يملأ بيانات الدخول
5. يذهب إلى Role Selection
   ↓ يختار دوره (Citizen/Collector)
6. يذهب إلى Dashboard
   ↓ يرى الـ navbar الآن
7. يمكنه التنقل بحرية
```

### Scenario 2: Existing User
```
1. يزور Landing Page (/)
2. ينقر على "Login"
   ↓ يملأ بيانات الدخول
3. يذهب إلى Role Selection
   ↓ يختار دوره
4. يذهب إلى Dashboard
5. يرى الـ navbar
6. يمكنه التنقل بحرية
```

### Scenario 3: Token Expiration
```
1. المستخدم يعمل في التطبيق
2. بعد 5 دقائق:
   - يتحقق النظام من صلاحية الـ Token
   - إذا منتهي الصلاحية:
     ↓ auto logout
     ↓ redirect to login
3. المستخدم يتسجل دخول مجدداً
```

### Scenario 4: Unauthorized Access
```
1. Citizen يحاول الوصول إلى /collector-dashboard
   ↓ citizenGuard يرفع الوصول
   ↓ redirect to landing page
2. Collector يحاول الوصول إلى /admin/dashboard
   ↓ adminGuard يرفع الوصول
   ↓ redirect to landing page
```

---

## 🧪 اختبار التطبيق

### اختبار Role Selection:
```typescript
// في terminal
1. npm start
2. ذهب إلى http://localhost:4200
3. ينقر على Login
4. يدخل بيانات صحيحة
5. يجب أن يذهب إلى /role-selection
6. يختار دور
7. يجب أن يذهب إلى dashboard صحيح
```

### اختبار Token Expiration:
```typescript
// في browser console
1. localStorage.setItem('auth_token', 'expired_token')
2. انتظر 5 دقائق أو اضغط على refresh
3. يجب أن يتم auto-logout
```

### اختبار Guard Protection:
```typescript
// اختبر كل مسار محمي
1. حاول الوصول إلى /citizen-dashboard بدون تسجيل
   ← يجب أن يوجهك إلى /login
2. سجل دخول كـ Collector
3. حاول الوصول إلى /citizen-dashboard
   ← يجب أن يوجهك إلى /
```

---

## ⚠️ ملاحظات مهمة

### 1. Backend Requirements:
- يجب أن يرجع Backend JWT token مع role claim
- يجب أن يتحقق من صلاحية الـ Token
- يجب أن يدعم logout endpoint

### 2. Token Format:
```json
{
  "sub": "user_id",
  "email": "user@example.com",
  "role": "citizen", // or "collector" or "admin"
  "exp": 1702xxx,
  "iat": 1702xxx
}
```

### 3. Role Values:
يجب أن تتطابق القيم تماماً:
- `citizen` (lowercase)
- `collector` (lowercase)
- `admin` (lowercase)

---

## 🔗 الملفات المرتبطة

| الملف | الغرض | التعديل |
|--------|---------|--------|
| [app.routes.ts](../src/app/app.routes.ts) | تعريف المسارات | ✅ محدث |
| [auth.service.ts](../src/app/core/services/auth.service.ts) | إدارة التوثيق | ✅ محدث |
| [role-selection.guard.ts](../src/app/core/guards/role-selection/) | حماية المسارات | ✅ جديد |
| [navbar.ts](../src/app/shared/components/navbar/) | شريط التنقل | ✅ محدث |
| [ARCHITECTURE.md](../ARCHITECTURE.md) | التوثيق الكامل | ✅ جديد |

---

## 🆘 استكشاف الأخطاء

### المشكلة: يتم إعادة التوجيه إلى /role-selection بشكل مستمر
**الحل**: تأكد من أن `UserService.currentRole()` يرجع قيمة صحيحة

### المشكلة: Guard ترفع جميع المستخدمين
**الحل**: تحقق من أن Token يحتوي على `role` claim صحيح

### المشكلة: NavBar لا يختفي في Auth pages
**الحل**: تأكد من أن `isAuthRoute()` تحتوي على جميع المسارات

### المشكلة: Auto-logout لا يعمل
**الحل**: تأكد من أن Token يحتوي على `exp` claim صحيح

---

## 📞 الدعم والمساعدة

للمزيد من المعلومات، راجع:
- [ARCHITECTURE.md](../ARCHITECTURE.md)
- [IMPROVEMENTS_SUMMARY.md](../IMPROVEMENTS_SUMMARY.md)
- [auth.service.ts](../src/app/core/services/auth.service.ts)

---

**آخر تحديث**: December 12, 2025
