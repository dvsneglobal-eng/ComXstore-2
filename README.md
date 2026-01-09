
# AfriAuto MCP - Integration Guide

This frontend is designed to work with an n8n backend acting as an MCP (Marketplace Control Plane).

## Environment Variables
Ensure your n8n workflows are reachable via these environment endpoints:

- `VITE_N8N_BASE_URL`: The root URL of your n8n instance.
- `VITE_N8N_STORE_ID`: Your unique store identifier for n8n filters.

## n8n Workflow Endpoints Required

### 1. WhatsApp Login Flow
- **Webhook**: `POST /auth/whatsapp/send-otp`
  - Input: `{ phone: string }`
  - Task: Generate 4-digit code, store in Redis/KV, send via WhatsApp API (Twilio/Meta).
- **Webhook**: `POST /auth/whatsapp/verify-otp`
  - Input: `{ phone: string, code: string }`
  - Task: Verify code, return JWT and User Profile.

### 2. Store Storefront (Customer)
- **GET /store/profile**: Returns logo, name, base currency.
- **GET /store/categories**: Returns categories with item counts.
- **GET /store/products**: Returns products, supports `?category_id=...` and `?search=...`.
- **POST /orders**: 
  - Creates order in database (e.g., Supabase/PostgreSQL).
  - Triggers Paystack checkout link.
  - Generates invoice PDF via n8n PDF generator.
  - Sends invoice PDF to user via WhatsApp.

### 3. Admin Operations
- **GET /reports/sales**: Aggregates data for Recharts (daily/monthly).
- **POST /products/toggle-featured**: Updates product status.
- **POST /whatsapp/alert**: Manually triggers a message to a customer.

## Paystack Checkout Flow
1. User clicks "Checkout".
2. Frontend calls n8n `POST /orders`.
3. n8n creates order, calls Paystack API, returns `checkout_url`.
4. Frontend redirects user or opens modal.
5. Paystack Webhook hits n8n `/payments/callback`.
6. n8n updates order to `PAID`, triggers "Thank you" WhatsApp message with invoice.

## Development
This app uses Tailwind CSS for rapid styling and Recharts for data visualization. All components are responsive and support dark/light modes.
