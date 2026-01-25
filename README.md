# Vòng Quay May Mắn - Wheel of Names Clone

Ứng dụng vòng quay may mắn được thiết kế giống Wheel of Names với đầy đủ chức năng.

## Cấu trúc dự án

```
ChiSa/
├── index.html          # File HTML chính
├── styles/
│   └── main.css        # Stylesheet chính
├── scripts/
│   ├── wheel.js        # Module quản lý vòng quay
│   ├── ui.js           # Module quản lý giao diện
│   ├── audio.js        # Module quản lý âm thanh
│   └── app.js          # File khởi tạo ứng dụng chính
└── README.md           # Tài liệu này
```

## Tính năng

### ✅ Đã hoàn thành
- ✨ Vòng quay với hiệu ứng mượt mà
- 🎨 Giao diện đẹp, nhiều màu sắc
- 🔊 Âm thanh tick-tick khi quay và vỗ tay khi có kết quả
- 📝 Thêm/xóa/sửa các mục
- 🔀 Tráo đổi (shuffle) danh sách
- ↕️ Sắp xếp danh sách theo alphabet
- 🎯 Kéo thả để sắp xếp lại thứ tự
- 💾 Tự động lưu vào Local Storage
- 🎉 Hiệu ứng pháo giấy khi có người thắng
- 📱 Responsive design

### 🚧 Có thể mở rộng
- Thêm ảnh cho từng mục
- Xuất/nhập danh sách
- Lịch sử kết quả
- Tùy chỉnh màu sắc
- Tùy chỉnh âm thanh

## Cách sử dụng

1. Mở file `index.html` trong trình duyệt
2. Danh sách mục sẽ hiển thị bên phải
3. Nhấn vào nút ▶ giữa vòng quay hoặc nút "Thêm bánh xe" để quay
4. Kết quả sẽ hiển thị trong popup

## Các module

### wheel.js
Quản lý logic vòng quay:
- Tính toán góc quay
- Render vòng quay với màu sắc
- Xử lý animation

### ui.js
Quản lý giao diện người dùng:
- Render danh sách mục
- Xử lý drag & drop
- Thêm/xóa/sửa mục

### audio.js
Quản lý âm thanh:
- Âm thanh tick khi quay
- Âm thanh vỗ tay khi thắng
- Điều khiển tắt/bật âm thanh

### app.js
File chính khởi tạo và kết nối các module

## Công nghệ sử dụng

- HTML5
- CSS3 (Flexbox, Animation, Gradient)
- Vanilla JavaScript (ES6+)
- Canvas Confetti Library
- Local Storage API

## Tác giả

Phiên bản 396
