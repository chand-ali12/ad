# Laravel Controller Fix: AdAuthenticNowController

Apply these changes to your Laravel API at:
`app/Http/Controllers/APIControllers/ADControllers/AdAuthenticNowController.php`

## 1. Add validation in `authenticateNowSubmit` (single submit)

Before the insert/save logic, add validation:

```php
public function authenticateNowSubmit(Request $request)
{
    $validated = $request->validate([
        'brand_id' => 'required|integer',
        'brand' => 'nullable|string',
        'brand_name' => 'nullable|string',
        'email' => 'required|email',
        'category' => 'nullable|string',
        'model' => 'nullable|string',
        'description' => 'nullable|string',
        'image' => 'required|string',
        'type' => 'nullable|string',
        'valuation' => 'nullable|numeric',
    ]);

    // Use $validated['brand_id'] as integer - guaranteed by validation
    // Existing save logic here...
}
```

## 2. Add validation in the bulk submit method (if applicable)

For `authenticateNowSubmitBulk` or similar:

```php
$validated = $request->validate([
    'queries' => 'required|array',
    'queries.*.brand_id' => 'required|integer',
    'queries.*.brand' => 'nullable|string',
]);
```

## 3. Full example with validation and error handling

```php
<?php

namespace App\Http\Controllers\APIControllers\ADControllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class AdAuthenticNowController extends Controller
{
    public function authenticateNowSubmit(Request $request)
    {
        try {
            $validated = $request->validate([
                'brand_id' => 'required|integer',
                'brand' => 'nullable|string',
                'brand_name' => 'nullable|string',
                'email' => 'required|email',
                'category' => 'nullable|string',
                'model' => 'nullable|string',
                'description' => 'nullable|string',
                'image' => 'required|string',
                'type' => 'nullable|string',
                'valuation' => 'nullable|numeric',
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'status' => false,
                'status_code' => 422,
                'data' => null,
                'msg' => 'Validation failed',
                'errors' => $e->errors(),
                'additionalMsg' => null,
            ], 422);
        }

        $brandId = (int) $validated['brand_id'];

        // Your existing save logic - use $brandId (integer) for brand_id column
        // Example:
        // Authenticate::create([
        //     'brand_id' => $brandId,
        //     'brand' => $validated['brand'] ?? $validated['brand_name'] ?? null,
        //     ...
        // ]);

        // Return your existing success response format...
    }
}
```

## 4. Validation error response format (Laravel default)

Laravel's `validate()` throws `ValidationException` which returns:

```json
{
  "message": "The given data was invalid.",
  "errors": {
    "brand_id": ["The brand id must be an integer."]
  }
}
```

To match your API format, catch `ValidationException` and return:

```json
{
  "status": false,
  "status_code": 422,
  "data": null,
  "msg": "The brand id field is required.",
  "errors": { "brand_id": ["The brand id must be an integer."] },
  "additionalMsg": null
}
```

## 5. Handler in `app/Exceptions/Handler.php` (optional – global)

To translate all validation errors into your API format globally:

```php
use Illuminate\Validation\ValidationException;

protected function invalidJson($request, ValidationException $exception)
{
    return response()->json([
        'status' => false,
        'status_code' => 422,
        'data' => null,
        'msg' => $exception->getMessage(),
        'errors' => $exception->errors(),
        'additionalMsg' => null,
    ], 422);
}
```
