# Laravel migrations

Thư mục này chứa các migration được sinh ra dựa trên schema dữ liệu mock hiện tại trong frontend:
- `src/mock/prices.js` (xe / bảng giá)
- `src/mock/events.js` (sự kiện / bài viết)
- `src/mock/featuredProducts.js` (danh sách xe nổi bật)

## Cách dùng
1. Tạo project Laravel (khuyến nghị):
   - `composer create-project laravel/laravel laravel-app`
2. Copy các file migration trong `laravel/database/migrations/` vào `laravel-app/database/migrations/`
3. Cấu hình DB trong `.env` của `laravel-app`
4. Chạy migrate:
   - `php artisan migrate`

## Bảng dữ liệu
- `cars`: lưu xe + thông tin hiển thị (tương ứng items của `/api/prices`)
- `events`: lưu bài viết sự kiện (tương ứng items của `/api/events`)
- `featured_products`: lưu danh sách xe nổi bật theo thứ tự (tương ứng `/api/featured-products`)
