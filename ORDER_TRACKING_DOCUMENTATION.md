# Order Tracking System Documentation

## Overview
النظام يوفر تتبع شامل للطلبات بين الفئات الثلاث: المواطنين (Citizen) والمجمعين (Collector) والمسؤولين (Admin).

## حالات الطلب (Order Status)

### 1. **PENDING** (قيد الانتظار)
- الحالة الأولية عند إنشاء طلب من المواطن
- ينتظر قبول من المجمع
- اللون: أصفر

### 2. **ACCEPTED** (تم القبول)
- تم قبول الطلب من قبل المجمع
- المجمع في الطريق إلى موقع المواطن
- اللون: أزرق

### 3. **IN_PROGRESS** (قيد التنفيذ)
- المجمع في الطريق
- اللون: أزرق غامق

### 4. **COLLECTED** (تم الاستلام)
- تم استلام المواد من المواطن بنجاح
- المجمع يحضر لتسليم المواد إلى الإدارة
- اللون: أخضر

### 5. **TRANSFERRED** (تم النقل)
- تم نقل الطلب إلى الإدارة
- الإدارة في انتظار الاستلام والمعالجة
- اللون: بنفسجي

### 6. **COMPLETED** (مكتمل)
- تم استقبال الطلب ومعالجة المواد من قبل الإدارة
- اللون: أخضر غامق

### 7. **CANCELLED** (ملغى)
- تم إلغاء الطلب
- اللون: أحمر

## مسارات العمل (Workflows)

### Citizen Flow (المواطن)
1. **إنشاء طلب** - PENDING
2. **عرض الطلب** - يمكن رؤية حالة الطلب والمجمع المسؤول
3. **تتبع المجمع** - عرض معلومات المجمع ووقت الوصول المتوقع
4. **إلغاء الطلب** - يمكن إلغاء الطلب فقط إذا كان في حالة PENDING أو ACCEPTED

### Collector Flow (المجمع)
1. **عرض الطلبات المعلقة** - قائمة بالطلبات في حالة PENDING
2. **قبول الطلب** - PENDING → ACCEPTED
3. **علامة استقبال المواد** - ACCEPTED → COLLECTED
4. **نقل إلى الإدارة** - COLLECTED → TRANSFERRED
5. **إضافة ملاحظات** - يمكن إضافة ملاحظات في كل خطوة

### Admin Flow (المسؤول)
1. **عرض الطلبات المحولة** - قائمة بالطلبات في حالة TRANSFERRED
2. **استقبال وإكمال الطلب** - TRANSFERRED → COMPLETED
3. **إضافة ملاحظات معالجة** - تسجيل ملاحظات الإدارة حول المواد المستلمة

## مكونات النظام (Components)

### `OrderTrackingComponent`
المكون الرئيسي الذي يدير واجهة التتبع.

**الميزات:**
- عرض قائمة الطلبات مع التصفية
- عرض تفاصيل الطلب
- تنفيذ الإجراءات بناءً على دور المستخدم
- معالجة الأخطاء والتحميل

### `CitizenOrderCardComponent`
بطاقة عرض الطلب للمواطن.

**المعلومات المعروضة:**
- رقم الطلب
- تاريخ الإنشاء
- حالة الطلب
- عدد المواد
- اسم المجمع (إذا تم التقاطها)

### `CollectorOrderCardComponent`
بطاقة عرض الطلب للمجمع.

**المعلومات المعروضة:**
- رقم الطلب
- تاريخ الإنشاء
- حالة الطلب
- عدد المواد
- اسم المواطن
- أزرار الإجراءات المتاحة

### `AdminOrderCardComponent`
بطاقة عرض الطلب للمسؤول.

**المعلومات المعروضة:**
- رقم الطلب
- تاريخ الإنشاء
- حالة الطلب
- عدد المواد
- اسم المواطن والمجمع
- أزرار الإجراءات المتاحة

### `OrderStatusTimelineComponent`
عرض مسار حالات الطلب.

**الميزات:**
- عرض جميع التغييرات في الحالة
- وقت التغيير والشخص المسؤول
- ملاحظات التغيير
- تمثيل بصري للمسار

### `OrderStatsComponent`
إحصائيات الطلبات.

**المعلومات المعروضة:**
- إجمالي الطلبات
- عدد الطلبات المعلقة
- عدد الطلبات قيد التنفيذ
- عدد الطلبات المكتملة
- شريط تقدم الإتمام

## الخدمة (OrderTrackingService)

### الدوال الأساسية

#### `getMyOrders()`
- **الوصف:** الحصول على جميع الطلبات الخاصة بالمستخدم الحالي
- **المعاملات:** لا توجد
- **النتيجة:** Observable<Order[]>

#### `createOrder(materials, notes?)`
- **الوصف:** إنشاء طلب جديد (للمواطن)
- **المعاملات:**
  - `materials`: OrderMaterial[] - قائمة المواد
  - `notes`: string (اختياري) - ملاحظات إضافية
- **النتيجة:** Observable<Order>

#### `acceptOrder(orderId)`
- **الوصف:** قبول الطلب (للمجمع)
- **المعاملات:**
  - `orderId`: string - معرف الطلب
- **النتيجة:** Observable<Order>

#### `markAsCollected(orderId, collectorNotes?)`
- **الوصف:** تسجيل استقبال المواد (للمجمع)
- **المعاملات:**
  - `orderId`: string
  - `collectorNotes`: string (اختياري)
- **النتيجة:** Observable<Order>

#### `transferToAdmin(orderId, collectorNotes?)`
- **الوصف:** نقل الطلب إلى الإدارة (للمجمع)
- **المعاملات:**
  - `orderId`: string
  - `collectorNotes`: string (اختياري)
- **النتيجة:** Observable<Order>

#### `completeOrder(orderId, adminNotes?)`
- **الوصف:** إكمال الطلب (للمسؤول)
- **المعاملات:**
  - `orderId`: string
  - `adminNotes`: string (اختياري)
- **النتيجة:** Observable<Order>

#### `cancelOrder(orderId, reason?)`
- **الوصف:** إلغاء الطلب
- **المعاملات:**
  - `orderId`: string
  - `reason`: string (اختياري) - سبب الإلغاء
- **النتيجة:** Observable<Order>

### الدوال المساعدة

#### `getStatusLabel(status)`
- **الوصف:** الحصول على النص الوصفي للحالة
- **المعاملات:** `status: OrderStatus`
- **النتيجة:** string

#### `getStatusColor(status)`
- **الوصف:** الحصول على اللون المناسب للحالة
- **المعاملات:** `status: OrderStatus`
- **النتيجة:** string (Tailwind class)

## النماذج (Models)

### `Order`
```typescript
interface Order {
  id: string;
  citizenId: string;
  citizenName: string;
  citizenPhone: string;
  citizenAddress: string;
  
  collectorId?: string;
  collectorName?: string;
  collectorPhone?: string;
  
  adminId?: string;
  adminName?: string;
  
  materials: OrderMaterial[];
  totalQuantity: number;
  estimatedWeight?: number;
  
  status: OrderStatus;
  statusHistory: OrderStatusHistory[];
  
  notes?: string;
  collectorNotes?: string;
  adminNotes?: string;
  
  createdAt: Date;
  updatedAt: Date;
  collectedAt?: Date;
  transferredAt?: Date;
  completedAt?: Date;
}
```

### `OrderMaterial`
```typescript
interface OrderMaterial {
  materialId: string;
  materialName: string;
  materialType: string;
  quantity: number;
  unit: string;
  estimatedWeight?: number;
  notes?: string;
}
```

### `OrderStatusHistory`
```typescript
interface OrderStatusHistory {
  status: OrderStatus;
  changedAt: Date;
  changedBy: string;
  remarks?: string;
}
```

## الروابط (Routes)

| المسار | الوصف | الحماية |
|--------|-------|--------|
| `/order-tracking` | صفحة تتبع الطلبات | AuthGuard |
| `/order-tracking/:id` | تفاصيل طلب محدد | AuthGuard |

## مثال على الاستخدام

### إنشاء طلب
```typescript
const materials = [
  {
    materialId: 'mat1',
    materialName: 'Plastic Bottles',
    materialType: 'Plastic',
    quantity: 10,
    unit: 'pieces'
  }
];

this.orderService.createOrder(materials, 'Urgent delivery').subscribe({
  next: (order) => {
    console.log('Order created:', order);
  },
  error: (err) => {
    console.error('Failed to create order:', err);
  }
});
```

### قبول طلب
```typescript
this.orderService.acceptOrder(orderId).subscribe({
  next: (order) => {
    console.log('Order accepted:', order);
  }
});
```

### تتبع الطلب
```typescript
this.orderService.getMyOrders().subscribe({
  next: (orders) => {
    // عرض الطلبات
    this.orders = orders;
  }
});
```

## ملاحظات أمان

1. **AuthGuard**: جميع المسارات محمية بـ AuthGuard
2. **Role-Based Access**: يتم تحديد الإجراءات المتاحة بناءً على دور المستخدم
3. **Validation**: يتم التحقق من صحة البيانات على الخادم
4. **Audit Trail**: يتم تسجيل جميع التغييرات في statusHistory

## الأداء والتحسينات

1. **Signals**: استخدام Angular Signals للحالة المتفاعلة
2. **Change Detection OnPush**: تحسين الأداء
3. **Lazy Loading**: تحميل المكونات عند الحاجة
4. **Error Handling**: معالجة شاملة للأخطاء

## التطوير المستقبلي

- [ ] إضافة خريطة توضح موقع المجمع في الوقت الفعلي
- [ ] إضافة تنبيهات push عند تغيير حالة الطلب
- [ ] تصدير الطلبات إلى PDF
- [ ] نظام التقييم للمجمعين
- [ ] إحصائيات متقدمة للمسؤولين
- [ ] دعم اللغات المتعددة
