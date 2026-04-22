# WhatsApp AI Agent Integration Guide

## Base URL
```
https://pratyagrasilks.com/api
```

---

## 1. AUTHENTICATION & CUSTOMER STATUS

### Get Customer Auth Status
**Endpoint:** `GET /api/auth/me`

**Headers:**
```
Authorization: Bearer <user_session_token|cookie>
Content-Type: application/json
```

**Response (Authenticated - 200):**
```json
{
  "authenticated": true,
  "customer": {
    "id": "uuid",
    "email": "john@example.com",
    "full_name": "John Doe",
    "phone": "+919876543210",
    "is_active": true,
    "created_at": "2024-01-15T10:00:00Z",
    "updated_at": "2024-03-16T15:30:00Z",
    "default_address": {
      "id": "uuid",
      "address_line1": "123 Street",
      "city": "Mumbai",
      "state": "Maharashtra",
      "postal_code": "400001",
      "country": "India"
    }
  },
  "stats": {
    "wishlisted_products": 5,
    "cart_items": 3,
    "total_orders": 12
  }
}
```

**Response (Not Authenticated - 401):**
```json
{
  "authenticated": false,
  "error": "Not authenticated",
  "message": "Please log in to continue"
}
```

---

## 2. CART MANAGEMENT

### Get Cart Items
**Endpoint:** `GET /api/cart`

**Headers:**
```
Authorization: Bearer <user_session_token|cookie>
Content-Type: application/json
```

**Response (Authenticated User - 200):**
```json
{
  "source": "database",
  "customerId": "uuid",
  "items": [
    {
      "id": "uuid",
      "product_id": "uuid",
      "quantity": 2,
      "created_at": "2024-03-16T10:00:00Z",
      "updated_at": "2024-03-16T12:00:00Z",
      "products": {
        "id": "uuid",
        "name": "Silk Saree - Rose Red",
        "price": 5000,
        "description": "Premium silk saree...",
        "images": ["url1", "url2"],
        "in_stock": true,
        "sku": "SAREE-RR-001",
        "category": "traditional"
      }
    }
  ],
  "totalItems": 1
}
```

**Response (Guest User - 200):**
```json
{
  "source": "guest",
  "items": [],
  "totalItems": 0,
  "message": "Not authenticated. Cart is stored in browser storage."
}
```

### Update Cart Items
**Endpoint:** `PUT /api/cart`

**Headers:**
```
Authorization: Bearer <user_session_token|cookie>
Content-Type: application/json
```

**Request Body:**
```json
{
  "items": [
    {
      "productId": "uuid",
      "quantity": 2
    },
    {
      "productId": "uuid-2",
      "quantity": 1
    }
  ]
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "customerId": "uuid",
  "items": [
    {
      "id": "uuid",
      "product_id": "uuid",
      "quantity": 2,
      "created_at": "2024-03-16T10:00:00Z",
      "updated_at": "2024-03-16T12:00:00Z",
      "products": {
        "id": "uuid",
        "name": "Silk Saree - Rose Red",
        "price": 5000,
        "description": "Premium silk saree...",
        "images": ["url1", "url2"],
        "in_stock": true,
        "sku": "SAREE-RR-001",
        "category": "traditional"
      }
    }
  ],
  "totalItems": 2,
  "message": "Cart updated successfully"
}
```

**Response (Unauthorized - 401):**
```json
{
  "error": "Unauthorized. Please log in to save cart."
}
```

**Response (Out of Stock - 409):**
```json
{
  "error": "Out of stock: Silk Saree - Rose Red, Silk Saree - Blue"
}
```

---

## 3. CHECKOUT & ORDERS

### Create Order
**Endpoint:** `POST /api/order/create`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "shippingAddress": {
    "email": "john@example.com",
    "fullName": "John Doe",
    "phone": "+919876543210",
    "addressLine1": "123 Street, Downtown",
    "addressLine2": "Apt 4",
    "city": "Mumbai",
    "state": "Maharashtra",
    "postalCode": "400001",
    "country": "India"
  },
  "items": [
    {
      "productId": "uuid",
      "quantity": 2,
      "price": 5000
    }
  ],
  "shippingCost": 100,
  "shippingZoneId": "zone-uuid",
  "estimatedDeliveryDays": 5
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "orderId": "uuid",
  "orderNumber": "ORD-1710584400000-ABC123DEF",
  "razorpayOrderId": "order_xxx",
  "totalAmount": 10100,
  "status": "pending"
}
```

### Verify Payment
**Endpoint:** `POST /api/order/verify`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "razorpay_order_id": "order_xxx",
  "razorpay_payment_id": "pay_xxx",
  "razorpay_signature": "hmac_signature_hash"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Payment verified",
  "orderId": "uuid",
  "orderNumber": "ORD-1710584400000-ABC123DEF"
}
```

### Get Order Details
**Endpoint:** `GET /api/orders/[orderId]`

**Headers:**
```
Content-Type: application/json
```

**Response (Success - 200):**
```json
{
  "order": {
    "id": "uuid",
    "order_number": "ORD-1710584400000-ABC123DEF",
    "status": "processing|shipped|delivered|pending|cancelled",
    "payment_status": "completed|pending|failed",
    "customer_name": "John Doe",
    "customer_email": "john@example.com",
    "customer_phone": "+919876543210",
    "shipping_charge": 100,
    "subtotal": 10000,
    "created_at": "2024-03-16T10:00:00Z",
    "updated_at": "2024-03-16T12:00:00Z",
    "shipping_address": {
      "line1": "123 Street, Downtown",
      "line2": "Apt 4",
      "city": "Mumbai",
      "state": "Maharashtra",
      "pincode": "400001",
      "country": "India"
    },
    "items": [
      {
        "id": "uuid",
        "product_id": "uuid",
        "quantity": 2,
        "total_price": 10000,
        "products": {
          "id": "uuid",
          "name": "Silk Saree - Rose Red",
          "sku": "SAREE-RR-001"
        }
      }
    ]
  }
}
```

---

## 4. DELIVERY STATUS (TRACKING)

### Get Order Status
**Endpoint:** `GET /api/orders/[orderId]`

**Use the status field from response above. Possible values:**
- `pending` - Order placed, awaiting payment confirmation
- `processing` - Payment received, preparing shipment
- `shipped` - Package dispatched
- `delivered` - Order delivered to customer
- `cancelled` - Order cancelled

---

## 5. SHIPPING CALCULATION

### Calculate Shipping Cost
**Endpoint:** `POST /api/shipping/calculate`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "state": "Maharashtra"
}
```

**Response (Success - 200):**
```json
{
  "id": "zone-uuid",
  "name": "Zone 1 - West India",
  "base_charge": 100,
  "per_kg_charge": 25,
  "free_shipping_threshold": 5000,
  "estimated_days": 5
}
```

---

## 6. PRODUCTS & CATALOG

### Get Products
**Endpoint:** `GET /api/products`

**Query Parameters:**
```
?category=sarees&minPrice=1000&maxPrice=10000&search=silk&limit=20&offset=0
```

**Response (Success - 200):**
```json
{
  "products": [
    {
      "id": "uuid",
      "name": "Silk Saree - Rose Red",
      "price": 5000,
      "description": "Premium silk saree...",
      "category": "traditional",
      "in_stock": true,
      "sku": "SAREE-RR-001",
      "images": ["url1", "url2"],
      "material": "Pure Silk",
      "created_at": "2024-01-15T10:00:00Z"
    }
  ],
  "total": 45
}
```

---

## WhatsApp AI Agent Use Cases

### 1. Customer Inquiry: "What's my order status?"
```
GET /api/orders/[orderId]
→ Return status, tracking info, expected delivery
```

### 2. Customer Action: "Add this to my cart"
```
GET /api/auth/me (check authentication)
PUT /api/cart (add item)
GET /api/cart (retrieve updated cart)
```

### 3. Customer Question: "What's in my cart?"
```
GET /api/auth/me (authenticate)
GET /api/cart (retrieve items)
→ List items with prices, quantities, total
```

### 4. Customer Action: "Checkout now"
```
GET /api/auth/me (get customer details)
POST /api/shipping/calculate (get shipping cost)
POST /api/order/create (create order)
→ Return Razorpay payment link
POST /api/order/verify (after payment)
→ Confirm order
```

### 5. Customer Question: "Is product X available?"
```
GET /api/products?search=X
→ Return availability, price, details
```

### 6. Customer Question: "How much is shipping to [state]?"
```
POST /api/shipping/calculate
→ Return shipping cost & delivery days
```

---

## Error Handling

### Common HTTP Status Codes:
- **200** - Success
- **400** - Bad request (invalid parameters)
- **401** - Unauthorized (not authenticated)
- **404** - Not found (order/product doesn't exist)
- **409** - Conflict (product out of stock)
- **500** - Server error

### Error Response Format:
```json
{
  "error": "Error message",
  "details": "Additional details (optional)"
}
```

---

## Authentication

All endpoints requiring authentication expect either:
1. **Supabase JWT Token** in Authorization header: `Authorization: Bearer <token>`
2. **Session Cookie** automatically sent with requests from the same domain

---

## Rate Limiting
Recommended: 100 requests per minute per user

---

## Testing the Endpoints

### Using cURL:

**Get Auth Status:**
```bash
curl -X GET https://pratyagrasilks.com/api/auth/me \
  -H "Authorization: Bearer <token>"
```

**Get Cart:**
```bash
curl -X GET https://pratyagrasilks.com/api/cart \
  -H "Authorization: Bearer <token>"
```

**Update Cart:**
```bash
curl -X PUT https://pratyagrasilks.com/api/cart \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"items": [{"productId": "uuid", "quantity": 2}]}'
```

**Calculate Shipping:**
```bash
curl -X POST https://pratyagrasilks.com/api/shipping/calculate \
  -H "Content-Type: application/json" \
  -d '{"state": "Maharashtra"}'
```

---

## Next Steps for WhatsApp Integration

1. **Setup WhatsApp Business API** with your Twilio/Meta account
2. **Configure Webhook** to receive messages
3. **Implement Message Parser** to detect user intent
4. **Call these APIs** based on intent
5. **Format Responses** for WhatsApp message format
6. **Add NLP/LLM** (optional) for natural language understanding

---

**Last Updated:** March 16, 2026  
**API Version:** 1.0
