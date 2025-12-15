# Order Tracking - API & Data Structure Reference

## 🔗 API Endpoints

### Order Management
```
POST   /api/Order                    → Create new order
GET    /api/Order                    → Get all orders
GET    /api/Order/{id}               → Get specific order
PUT    /api/Order/{id}/accept        → Accept order (Collector)
PUT    /api/Order/{id}/collected     → Mark as collected (Collector)
PUT    /api/Order/{id}/transfer      → Transfer to admin (Collector)
PUT    /api/Order/{id}/complete      → Complete order (Admin)
PUT    /api/Order/{id}/cancel        → Cancel order (Any)
```

## 📦 Request/Response Structures

### Create Order
```typescript
// Request
POST /api/Order
{
  "materials": [
    {
      "materialId": "mat-1",
      "materialName": "Plastic Bottles",
      "materialType": "Plastic",
      "quantity": 10,
      "unit": "pieces",
      "estimatedWeight": 1.5
    }
  ],
  "notes": "Optional notes"
}

// Response
{
  "id": "order-123",
  "citizenId": "citizen-456",
  "citizenName": "Ahmed",
  "citizenPhone": "01234567890",
  "citizenAddress": "123 Main St",
  "materials": [...],
  "totalQuantity": 10,
  "status": "PENDING",
  "statusHistory": [
    {
      "status": "PENDING",
      "changedAt": "2024-12-14T10:00:00Z",
      "changedBy": "citizen-456"
    }
  ],
  "createdAt": "2024-12-14T10:00:00Z",
  "updatedAt": "2024-12-14T10:00:00Z"
}
```

### Accept Order
```typescript
// Request
PUT /api/Order/{id}/accept
{}

// Response
{
  "id": "order-123",
  "status": "ACCEPTED",
  "collectorId": "collector-789",
  "collectorName": "Ali",
  "collectorPhone": "01987654321",
  "statusHistory": [
    { "status": "PENDING", "changedAt": "...", "changedBy": "..." },
    { "status": "ACCEPTED", "changedAt": "...", "changedBy": "collector-789" }
  ],
  "updatedAt": "2024-12-14T10:05:00Z"
}
```

### Mark as Collected
```typescript
// Request
PUT /api/Order/{id}/collected
{
  "collectorNotes": "Items collected successfully"
}

// Response
{
  "id": "order-123",
  "status": "COLLECTED",
  "collectorNotes": "Items collected successfully",
  "collectedAt": "2024-12-14T10:15:00Z",
  "statusHistory": [...]
}
```

### Transfer to Admin
```typescript
// Request
PUT /api/Order/{id}/transfer
{
  "collectorNotes": "Transferred to warehouse"
}

// Response
{
  "id": "order-123",
  "status": "TRANSFERRED",
  "collectorNotes": "Transferred to warehouse",
  "transferredAt": "2024-12-14T10:25:00Z",
  "statusHistory": [...]
}
```

### Complete Order
```typescript
// Request
PUT /api/Order/{id}/complete
{
  "adminNotes": "Items processed successfully"
}

// Response
{
  "id": "order-123",
  "status": "COMPLETED",
  "adminId": "admin-101",
  "adminName": "System Admin",
  "adminNotes": "Items processed successfully",
  "completedAt": "2024-12-14T10:35:00Z",
  "statusHistory": [...]
}
```

### Cancel Order
```typescript
// Request
PUT /api/Order/{id}/cancel
{
  "reason": "Customer requested cancellation"
}

// Response
{
  "id": "order-123",
  "status": "CANCELLED",
  "statusHistory": [...]
}
```

## 📊 Data Structures

### Order Interface
```typescript
interface Order {
  // Identifiers
  id: string;
  
  // Citizen Information
  citizenId: string;
  citizenName: string;
  citizenPhone: string;
  citizenAddress: string;
  
  // Collector Information (Optional)
  collectorId?: string;
  collectorName?: string;
  collectorPhone?: string;
  
  // Admin Information (Optional)
  adminId?: string;
  adminName?: string;
  
  // Materials
  materials: OrderMaterial[];
  totalQuantity: number;
  estimatedWeight?: number;
  
  // Status Tracking
  status: OrderStatus;
  statusHistory: OrderStatusHistory[];
  
  // Notes
  notes?: string;
  collectorNotes?: string;
  adminNotes?: string;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  collectedAt?: Date;
  transferredAt?: Date;
  completedAt?: Date;
}
```

### OrderStatus Enum
```typescript
enum OrderStatus {
  PENDING = 'PENDING',           // Citizen created, waiting for collector
  ACCEPTED = 'ACCEPTED',         // Collector accepted
  IN_PROGRESS = 'IN_PROGRESS',   // Collector on the way
  COLLECTED = 'COLLECTED',       // Items collected
  TRANSFERRED = 'TRANSFERRED',   // Transferred to admin
  COMPLETED = 'COMPLETED',       // Order completed
  CANCELLED = 'CANCELLED'        // Order cancelled
}
```

### OrderMaterial Interface
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

### OrderStatusHistory Interface
```typescript
interface OrderStatusHistory {
  status: OrderStatus;
  changedAt: Date;
  changedBy: string;      // User ID who made the change
  remarks?: string;
}
```

## 🔐 Authentication & Authorization

### Headers Required
```typescript
{
  "Authorization": "Bearer {jwt_token}",
  "Content-Type": "application/json"
}
```

### Role-Based Access Control
```
CITIZEN:
  - POST /api/Order (create)
  - GET /api/Order (own orders)
  - GET /api/Order/{id} (own order)
  - PUT /api/Order/{id}/cancel (own order)

COLLECTOR:
  - GET /api/Order (assigned orders)
  - GET /api/Order/{id} (assigned order)
  - PUT /api/Order/{id}/accept
  - PUT /api/Order/{id}/collected
  - PUT /api/Order/{id}/transfer

ADMIN:
  - GET /api/Order (all orders)
  - GET /api/Order/{id} (any order)
  - PUT /api/Order/{id}/complete
  - PUT /api/Order/{id}/cancel
```

## ❌ Error Responses

### 400 Bad Request
```typescript
{
  "statusCode": 400,
  "message": "Invalid request body",
  "errors": {
    "materials": "Materials array is required and must not be empty"
  }
}
```

### 401 Unauthorized
```typescript
{
  "statusCode": 401,
  "message": "Unauthorized. Invalid or missing token"
}
```

### 403 Forbidden
```typescript
{
  "statusCode": 403,
  "message": "You do not have permission to perform this action"
}
```

### 404 Not Found
```typescript
{
  "statusCode": 404,
  "message": "Order not found"
}
```

### 409 Conflict
```typescript
{
  "statusCode": 409,
  "message": "Cannot perform this action on order in PENDING status"
}
```

## 📈 Response Codes

| Code | Meaning | Action |
|------|---------|--------|
| 200 | Success | Continue |
| 201 | Created | Redirect |
| 400 | Bad Request | Validate input |
| 401 | Unauthorized | Re-login |
| 403 | Forbidden | Check permissions |
| 404 | Not Found | Check ID |
| 409 | Conflict | Check current status |
| 500 | Server Error | Retry or contact support |

## 🔄 Service Methods Mapping

```typescript
// Frontend Method → API Endpoint

createOrder()           → POST /api/Order
getMyOrders()          → GET /api/Order
getOrderById()         → GET /api/Order/{id}
acceptOrder()          → PUT /api/Order/{id}/accept
markAsCollected()      → PUT /api/Order/{id}/collected
transferToAdmin()      → PUT /api/Order/{id}/transfer
completeOrder()        → PUT /api/Order/{id}/complete
cancelOrder()          → PUT /api/Order/{id}/cancel
```

## 🧪 Testing Examples

### Using cURL

#### Create Order
```bash
curl -X POST http://localhost:3000/api/Order \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "materials": [
      {
        "materialId": "1",
        "materialName": "Plastic",
        "materialType": "Plastic",
        "quantity": 10,
        "unit": "kg"
      }
    ],
    "notes": "Urgent"
  }'
```

#### Accept Order
```bash
curl -X PUT http://localhost:3000/api/Order/order-123/accept \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{}'
```

#### Complete Order
```bash
curl -X PUT http://localhost:3000/api/Order/order-123/complete \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "adminNotes": "Processed successfully"
  }'
```

## 📱 Frontend Integration

### In Service
```typescript
createOrder(materials, notes) {
  return this.http.post(`${this.apiUrl}/Order`, {
    materials,
    notes,
    status: OrderStatus.PENDING
  });
}
```

### In Component
```typescript
this.orderService.createOrder(materials, notes).subscribe({
  next: (order) => {
    console.log('Order created:', order);
    this.router.navigate(['/order-tracking', order.id]);
  },
  error: (err) => {
    console.error('Error:', err);
    this.flash.showError(err.error.message);
  }
});
```

---

**Note:** Replace `http://localhost:3000` with your actual backend URL
