# Authentication → Cart → Payment: Old vs New Flow

Comparison of the **old website** (authentic-detective-talha, Next.js) and **new website** (client, React) from form submit through payment.

---

## 1. Single item: Form submit (“Proceed to checkout”)

| Step | Old website | New website |
|------|-------------|-------------|
| **Price source** | Client-only: `price = selectCategory.price`; if Market Valuation checked, add `COMMON_VALUE_FOR_VALUATION` (7); if Insurance checked, add `COMMON_VALUE_FOR_ADD_ON` (10). No `/ad/get-query-price` call on form. | Calls **POST /ad/get-query-price** with `{ category_id, valuation }`. Uses returned `data` (e.g. 22) as amount; fallback = category price + 10 if valuation. |
| **Free (price === 0)** | POST **/ad/free-process-paypal** with `singleFormData` → on success **navigate to `/`**. | Dispatch **freeSubmitBulk** (POST /ad/free-submit) → **navigate to `/`**. |
| **Paid (price > 0)** | Build `singleFormDataForCart` (form data + `price`, `images`, etc.). **Redux: `persistBulkData([singleFormDataForCart])`**. **Navigate to `/cart`**. | Build cart item (brand, model, price, imagePaths, valuation, add_on, email, etc.). **Redux: `addItem(...)`** (cart slice). **Navigate to `/cart`**. |

**Outcome:** Both send the user to **/cart** with one item and a total when price > 0; both go to **/** when price === 0.

---

## 2. Cart page

| Step | Old website | New website |
|------|-------------|-------------|
| **Data source** | Redux `bulkFormData` (from `persistBulkData`). Each item has `selectBrand`, `selectCategory`, `model`, `images`, `price`, `marketValuationCheckBox`, `add_on_checkbox`. | Redux `cart.items` (from `addItem`). Each item has `brand`, `model`, `price`, `quantity`, `imagePaths`, `valuation`, `add_on`, `email`, etc. |
| **Total** | Summed in a `useEffect`: for each item, base = category price + valuation surcharge + add-on; `totalAmount` = sum. Shown as “Total: $X”. | Cart slice: `subtotal` / `total` = sum of `item.price * quantity`. Shown as SUBTOTAL and TOTAL. |
| **Checkout button** | “Checkout” → `submitBulkQuery()`. | “Proceed to payment” → `handleProceedToPayment()`. |

---

## 3. Cart → Payment (single item)

| Step | Old website | New website |
|------|-------------|-------------|
| **API call** | **POST /ad/process-paypal** (`SUBMIT_SINGLE_AUTHENTICATION`) with body: `brand_name`, `category_id`, `model`, `description`, `sku`, `email`, `emailc`, `valuation`, `uploadedImages`, `terms_and_condition_privacy_policy`, `amount` (= totalAmount), `query_amount`, `queries_count`, `is_user_paid`, `add_on`. | **POST /ad/process-paypal** via `processPaypalPayment(singleFormData)`: same shape (brand_id, brand_name, category_id, model, description, sku, email, emailc, valuation, uploadedImages, terms_and_condition_privacy_policy, amount = total, query_amount = item.price, etc.). |
| **Response** | `response.data.data` (Braintree payload with token, etc.). | `result?.data ?? result` (same idea). |
| **Next** | If paid: **navigate to `/checkout?data=<encodedPayload>&page=single`**. If free: **navigate to `/`**. | If paid: **navigate to `/checkout?data=<encodedPayload>&page=single`** with `state: { braintreePayload, checkoutType: 'auth' }`. If free: **navigate to `/`**, clear cart. |

**Outcome:** Both call the same **/ad/process-paypal** endpoint and then send the user to **/checkout** with the Braintree payload in the URL (and new site also in location state).

---

## 4. Checkout page (payment)

| Step | Old website | New website |
|------|-------------|-------------|
| **Payload** | From query `data` (decoded). Contains Braintree `token`, order id, amount, etc. | From `location.state.braintreePayload` or query `data`; same content. |
| **UI** | Customer info + Braintree drop-in; user enters card and submits. | Customer info form; after “Complete Order”, Braintree token is fetched; then Braintree drop-in and “Confirm & pay”. |
| **Submit payment** | Braintree nonce + payload sent to backend; on success, redirect/success message. | **submitBraintreeCheckout** (or submitBraintreeAuthCards) with nonce + payload; on success, clear cart, show message, **navigate to `/`**. |

**Outcome:** Both complete payment via Braintree and then show success and leave checkout (old site redirect/success; new site navigate to home and clear cart).

---

## 5. Bulk (multiple items)

| Step | Old website | New website |
|------|-------------|-------------|
| **Form** | User fills N forms; on last, `persistBulkData([...bulkFormDataWithImages, allFormData])` → **navigate to `/cart`**. | Options.bulkItems: for each entry, get price via `getQueryPrice`, then `addItem`; then **navigate to `/cart`**. |
| **Cart** | Cart shows all items; total = sum of per-item prices (category + valuation + add-on). “Checkout” → POST **/ad/bundle-query-form-submit** with `user_email`, `total_price`, `queries_count`, `queries` (JSON string). | Cart shows all items; total from cart slice. “Proceed to payment” → **bundleQueryFormSubmitBulk** (POST /ad/bundle-query-form-submit) with same shape. |
| **After submit** | Backend returns Braintree payload → **navigate to `/checkout?data=...&page=bulk`**. | Same: navigate to **/checkout** with payload and `page=bulk`. |

**Outcome:** Same endpoint and same navigation to checkout for bulk.

---

## 6. API endpoints (shared)

| Purpose | Old | New |
|---------|-----|-----|
| Get price (optional on old) | POST /ad/get-query-price (body: category_id, valuation) — used in cart in commented code. | POST /ad/get-query-price (body: category_id, valuation). |
| Free single submit | POST /ad/free-process-paypal | POST /ad/free-submit (bulk free) |
| Paid single from cart | POST /ad/process-paypal | POST /ad/process-paypal |
| Bulk paid | POST /ad/bundle-query-form-submit | POST /ad/bundle-query-form-submit |
| Checkout Braintree token | (on checkout page) | GET/POST as used by Checkout slice |
| Submit payment with nonce | Backend consumes nonce | submitBraintreeCheckout / submitBraintreeAuthCards |

---

## 7. Fix applied in new site (so flow matches)

- **Price parsing:** Backend returns `{ data: 22 }` (numeric). New site now treats `priceRes?.data` as a valid amount (in addition to `data.amount` / `data.total_price`). So `resolvePrice()` returns 22 instead of 0.
- **Effect:** When price > 0, the single-item path no longer hits the “free” branch and no longer navigates to `/`. It adds the item to the cart and navigates to `/cart`, then Cart → “Proceed to payment” → /ad/process-paypal → /checkout, matching the old flow through payment.
