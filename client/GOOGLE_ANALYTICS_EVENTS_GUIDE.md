# Hướng dẫn tạo Events trên Google Analytics 4

## 1. Truy cập Google Analytics 4

1. Đăng nhập vào [Google Analytics](https://analytics.google.com/)
2. Chọn property với ID: `G-7ZCPCVX6F7`
3. Đi tới **Admin** (biểu tượng bánh răng ở góc dưới trái)

## 2. Tạo Custom Events trong GA4

### Bước 1: Truy cập Events Configuration

1. Trong Admin panel, chọn **Events** (cột Property)
2. Click **Create event**

### Bước 2: Thiết lập Custom Event

1. **Event name**: Tên event (ví dụ: `custom_3d_design_start`)
2. **Matching conditions**:
   - Parameter: `event_name`
   - Operator: `equals`
   - Value: tên event bạn muốn track

### Bước 3: Cấu hình Parameters (Optional)

Thêm các parameters để track thêm thông tin:

```
- custom_parameter_1 (text)
- custom_parameter_2 (text)
- value (number)
- currency (text)
```

## 3. Events đã được implement trong InkMe

### 🛒 Ecommerce Events

```javascript
// Thêm vào giỏ hàng
trackAddToCart({
  id: "product_123",
  name: "Custom T-Shirt",
  price: 299000,
  category: "T-Shirt",
  quantity: 1
});

// Xem sản phẩm
trackViewProduct({
  id: "product_123",
  name: "Custom T-Shirt",
  price: 299000,
  category: "T-Shirt"
});

// Bắt đầu checkout
trackBeginCheckout(cartItems, totalValue);

// Hoàn thành mua hàng
trackPurchase({
  orderId: "ORDER_123",
  amount: 599000,
  products: [...]
});
```

### 🎨 3D Design Events

```javascript
// Bắt đầu thiết kế 3D
trackStart3DDesign({
  productType: "tshirt",
  userId: "user_123",
});

// Xem preview 3D
trackView3DPreview({
  sceneName: "My Design",
  productId: "product_123",
});

// Tải file .inkme
trackDownloadInkmeFile({
  sceneName: "My Design",
  fileSize: 1024,
});
```

### 👤 User Events

```javascript
// Đăng ký
trackSignUp({
  method: "email", // hoặc "google"
  userId: "user_123",
});

// Đăng nhập
trackLogin({
  method: "email", // hoặc "google"
  userId: "user_123",
});
```

### 🔍 Engagement Events

```javascript
// Tìm kiếm
trackSearch("áo thun", "t-shirt");

// Click CTA
trackCTAClick("Shop Now", "homepage_hero");

// Thêm wishlist
trackAddToWishlist(productData);

// Chia sẻ sản phẩm
trackShareProduct(productData, "facebook");
```

## 4. Tạo Custom Event mới

### Ví dụ: Tạo event "Design Saved"

```javascript
// Trong analytics.js, thêm function mới:
export const trackDesignSaved = (designData) => {
  sendEvent("design_saved", {
    event_category: "3d_design",
    event_label: "save_design",
    custom_parameter_1: designData.designName,
    custom_parameter_2: designData.designType,
    value: 1,
  });
};

// Sử dụng trong component:
import { trackDesignSaved } from "../utils/analytics";

const handleSaveDesign = () => {
  // Logic lưu design...

  trackDesignSaved({
    designName: "My Cool Design",
    designType: "t-shirt",
  });
};
```

## 5. Xem Reports trong GA4

### Real-time Reports

1. Đi tới **Reports** > **Realtime**
2. Xem events đang xảy ra thời gian thực

### Events Reports

1. **Reports** > **Engagement** > **Events**
2. Xem tất cả events và metrics

### Custom Reports

1. **Explore** > **Free form**
2. Kéo thả metrics và dimensions để tạo report tùy chỉnh

### Conversion Tracking

1. **Admin** > **Conversions**
2. Đánh dấu events quan trọng làm conversions
3. Ví dụ: `purchase`, `begin_checkout`, `add_to_cart`

## 6. Debug Events

### Trong Console

```javascript
// Bật debug mode
window.gtag("config", "G-7ZCPCVX6F7", {
  debug_mode: true,
});

// Hoặc xem trong console logs
console.log("GA Events được gửi:", eventName, parameters);
```

### GA4 DebugView

1. **Admin** > **DebugView**
2. Xem events realtime với chi tiết parameters

### Chrome Extension

- Cài đặt "Google Analytics Debugger"
- Bật extension khi test

## 7. Best Practices

### Event Naming

- Sử dụng snake_case: `add_to_cart`, `view_item`
- Tên ngắn gọn, mô tả rõ ràng
- Tối đa 40 ký tự

### Parameters

- Tối đa 25 custom parameters
- Tên parameter tối đa 40 ký tự
- Giá trị text tối đa 100 ký tự

### Performance

- Không gửi quá nhiều events (< 500 events/session)
- Batch events khi có thể
- Sử dụng sampling cho events có volume cao

## 8. Troubleshooting

### Events không hiển thị

- Kiểm tra console có lỗi không
- Verify Measurement ID đúng
- Đợi 24-48h để data hiển thị đầy đủ

### Debug trong Development

```javascript
// Thêm vào index.html để test
gtag("config", "G-7ZCPCVX6F7", {
  debug_mode: true,
  send_page_view: false, // Tắt auto page view
});
```

## 9. Advanced Features

### Enhanced Ecommerce

- Đã implement sẵn với `currency: 'VND'`
- Track revenue, items, quantities
- Funnel analysis tự động

### Audience Creation

1. **Admin** > **Audiences**
2. Tạo audience dựa trên events
3. Ví dụ: Users đã dùng 3D design

### Goals & Funnels

1. Set conversion events
2. Tạo funnel từ `view_item` → `add_to_cart` → `purchase`
3. Analyze conversion rates

---

## 📊 Các Metrics quan trọng cần theo dõi

- **Conversion Rate**: % users complete purchase
- **3D Design Usage**: % users use 3D feature
- **Cart Abandonment**: Users add to cart but don't purchase
- **Product Performance**: Most viewed/purchased items
- **User Journey**: Path from landing to conversion
