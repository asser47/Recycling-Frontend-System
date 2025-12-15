# Order Tracking System - Quick Reference 🚀

## الوصول السريع

### المسارات
```
/order-tracking           → صفحة تتبع الطلبات الرئيسية
/order-tracking/:id       → عرض طلب محدد
```

### الخدمة الرئيسية
```typescript
inject(OrderTrackingService)
```

## الدوال الأساسية

### إنشاء & الاستعلام
```typescript
// إنشاء طلب
orderService.createOrder(materials, notes?)

// الحصول على الطلبات
orderService.getMyOrders()
orderService.getOrderById(orderId)
```

### إجراءات المجمع
```typescript
orderService.acceptOrder(orderId)
orderService.markAsCollected(orderId, notes?)
orderService.transferToAdmin(orderId, notes?)
```

### إجراءات الإدارة
```typescript
orderService.completeOrder(orderId, notes?)
orderService.cancelOrder(orderId, reason?)
```

### الأدوات
```typescript
orderService.getStatusLabel(status)      // نص الحالة
orderService.getStatusColor(status)      // لون Tailwind
orderService.clearError()                // مسح الأخطاء
```

## Signals المتاحة

```typescript
orderService.myOrders          // جميع الطلبات
orderService.pendingOrders     // الطلبات المعلقة
orderService.acceptedOrders    // الطلبات المقبولة
orderService.completedOrders   // الطلبات المكتملة
orderService.isLoading         // حالة التحميل
orderService.error             // الأخطاء
```

## الاستخدام في Template

### عرض الطلبات
```html
@for (order of myOrders(); track order.id) {
  <app-citizen-order-card [order]="order"></app-citizen-order-card>
}
```

### عرض الحالة
```html
{{ orderService.getStatusLabel(order.status) }}
<span [class]="orderService.getStatusColor(order.status)">
  {{ getStatusLabel(order.status) }}
</span>
```

### الشروط حسب الدور
```html
@switch(getUserRole()) {
  @case('Citizen') { <!-- محتوى المواطن --> }
  @case('Collector') { <!-- محتوى المجمع --> }
  @case('Admin') { <!-- محتوى الإدارة --> }
}
```

## حالات الطلب

| الكود | الاسم | اللون |
|------|-------|-------|
| `PENDING` | قيد الانتظار | yellow-500 |
| `ACCEPTED` | مقبول | blue-500 |
| `IN_PROGRESS` | قيد التنفيذ | blue-600 |
| `COLLECTED` | تم الاستقبال | green-500 |
| `TRANSFERRED` | تم النقل | purple-500 |
| `COMPLETED` | مكتمل | green-600 |
| `CANCELLED` | ملغى | red-500 |

## أمثلة سريعة

### إنشاء طلب
```typescript
const materials = [{
  materialId: 'id1',
  materialName: 'Plastic Bottles',
  materialType: 'Plastic',
  quantity: 10,
  unit: 'pieces'
}];

this.orderService.createOrder(materials, 'notes').subscribe({
  next: (order) => console.log('Created:', order)
});
```

### قبول طلب (مجمع)
```typescript
this.orderService.acceptOrder(orderId).subscribe({
  next: (order) => console.log('Accepted:', order)
});
```

### إكمال طلب (إدارة)
```typescript
this.orderService.completeOrder(orderId, 'processed').subscribe({
  next: (order) => console.log('Completed:', order)
});
```

## مكونات القالب الجاهزة

```html
<!-- بطاقة الطلب للمواطن -->
<app-citizen-order-card [order]="order"></app-citizen-order-card>

<!-- بطاقة الطلب للمجمع -->
<app-collector-order-card [order]="order"></app-collector-order-card>

<!-- بطاقة الطلب للإدارة -->
<app-admin-order-card [order]="order"></app-admin-order-card>

<!-- مسار الحالات -->
<app-order-status-timeline [order]="order"></app-order-status-timeline>

<!-- الإحصائيات -->
<app-order-stats [orders]="myOrders()"></app-order-stats>
```

## معالجة الأخطاء

```typescript
.subscribe({
  next: (order) => { /* نجاح */ },
  error: (err) => { 
    console.error('Error:', err);
    this.orderService.clearError(); // مسح الخطأ
  }
});
```

## التحميل والانتظار

```html
@if (isLoading()) {
  <p>جاري التحميل...</p>
} @else {
  <!-- محتوى -->
}
```

## الملاحظات الهامة

⚠️ جميع المسارات محمية بـ `AuthGuard`
⚠️ يتم التحقق من الدور تلقائياً
⚠️ Signals تتحدث تلقائياً عند تغيير البيانات
⚠️ استخدم `OnPush` Change Detection

## اختصارات مفيدة

```typescript
// الحصول على السيجنالات
const orders = this.orderService.myOrders;
const loading = this.orderService.isLoading;
const error = this.orderService.error;

// الدالات المساعدة
const label = this.orderService.getStatusLabel(status);
const color = this.orderService.getStatusColor(status);

// التنقل
this.router.navigate(['/order-tracking', orderId]);
```

## التكامل مع الخدمات الأخرى

```typescript
// Flash Messages
this.flash.showSuccess('تم بنجاح!');
this.flash.showError('حدث خطأ!');

// Auth Service
const role = this.authService.getRole();
const user = this.authService.user();

// Router
this.router.navigate(['/order-tracking']);
```

---

📚 للمزيد من المعلومات، اطلع على:
- `ORDER_TRACKING_DOCUMENTATION.md`
- `ORDER_TRACKING_EXAMPLES.ts`
