/**
 * Order Tracking System - Usage Examples
 * أمثلة عملية لاستخدام نظام تتبع الطلبات
 *
 * هذا الملف يحتوي على أمثلة توضيحية لكيفية استخدام النظام
 * قد يكون هناك اختلافات بسيطة حسب سياق التطبيق الفعلي
 */

// ============================================
// 1. CITIZEN (المواطن) - أمثلة الاستخدام
// ============================================

// مثال 1: إنشاء طلب جديد
// يتم استدعاء هذه الدالة عند إنشاء طلب جديد من قبل المواطن
// const materials = [
//   {
//     materialId: 'mat-1',
//     materialName: 'Plastic Bottles',
//     materialType: 'Plastic',
//     quantity: 20,
//     unit: 'pieces',
//     estimatedWeight: 2.5
//   }
// ];
// this.orderService.createOrder(materials, 'Please collect on Friday afternoon').subscribe({...})

// مثال 2: عرض الطلبات الخاصة بي
// const orders = this.orderService.myOrders(); // يتم الحصول على الطلبات من Signal

// مثال 3: إلغاء طلب
// this.orderService.cancelOrder(orderId, 'Changed my mind').subscribe({...})

// ============================================
// 2. COLLECTOR (المجمع) - أمثلة الاستخدام
// ============================================

// مثال 1: عرض الطلبات المعلقة
// const pending = this.orderService.pendingOrders(); // Signal للطلبات المعلقة

// مثال 2: قبول طلب
// this.orderService.acceptOrder(orderId).subscribe({...})

// مثال 3: تسجيل استقبال المواد
// this.orderService.markAsCollected(orderId, 'Items collected').subscribe({...})

// مثال 4: نقل الطلب إلى الإدارة
// this.orderService.transferToAdmin(orderId, 'Order transferred').subscribe({...})

// ============================================
// 3. ADMIN (المسؤول) - أمثلة الاستخدام
// ============================================

// مثال 1: عرض الطلبات المحولة
// const transferred = this.orderService.myOrders().filter(o =>
//   o.status === OrderStatus.TRANSFERRED
// );

// مثال 2: إكمال طلب
// this.orderService.completeOrder(orderId, 'Items processed for recycling').subscribe({...})

// ============================================
// 4. COMMON OPERATIONS (عمليات مشتركة)
// ============================================

// الحصول على معلومات الحالة
// const statusLabel = this.orderService.getStatusLabel(order.status);
// const statusColor = this.orderService.getStatusColor(order.status);

// عرض تفاصيل الطلب
// this.router.navigate(['/order-tracking', orderId]);

// تحميل الطلبات
// this.orderService.getMyOrders().subscribe({...})

// ============================================
// 5. TEMPLATE USAGE (الاستخدام في Template)
// ============================================

/*
<!-- عرض قائمة الطلبات -->
@for (order of myOrders(); track order.id) {
  <app-order-card [order]="order"></app-order-card>
}

<!-- عرض الإحصائيات -->
<app-order-stats [orders]="myOrders()"></app-order-stats>

<!-- عرض مسار الحالات -->
@if (selectedOrder) {
  <app-order-status-timeline [order]="selectedOrder"></app-order-status-timeline>
}
*/
