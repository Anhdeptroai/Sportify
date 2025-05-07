# Sportify - Music Streaming Application

Sportify là một ứng dụng phát nhạc trực tuyến được xây dựng bằng React và TypeScript, cung cấp trải nghiệm nghe nhạc tương tự như Spotify.

## Tính năng chính

- Đăng nhập/Đăng ký tài khoản
- Nghe nhạc trực tuyến
- Tạo và quản lý playlist
- Tìm kiếm bài hát, nghệ sĩ, album
- Xem thông tin chi tiết về bài hát, nghệ sĩ, album
- Phát nhạc theo thứ tự ngẫu nhiên
- Điều chỉnh âm lượng
- Xem lời bài hát
- Xem video YouTube liên quan

## 📋 Yêu cầu hệ thống

- Node.js (phiên bản 14.0.0 trở lên)
- npm hoặc yarn
- Trình duyệt web hiện đại (Chrome, Firefox, Safari, Edge)

## Cài đặt

1. Clone repository:

```bash
git clone [repository-url]
cd Sportify
```

2. Cài đặt các dependencies:

```bash
cd main
npm install
```

3. Tạo file .env trong thư mục main và thêm các biến môi trường:

```env
REACT_APP_API_URL=http://13.215.205.59:8000
```

4. Khởi chạy ứng dụng:

```bash
npm start
```

## Các thư viện đã sử dụng

### Core Dependencies

- `react`: ^18.2.0
- `react-dom`: ^18.2.0
- `react-router-dom`: ^6.x.x
- `typescript`: ^4.x.x
- `axios`: ^1.x.x

### UI/UX

- `tailwindcss`: ^3.x.x
- `@heroicons/react`: ^2.x.x
- `react-hot-toast`: ^2.x.x
- `react-toastify`: ^9.x.x

### State Management

- `react-context`: Built-in React Context API

### Development Tools

- `@types/react`: ^18.x.x
- `@types/react-dom`: ^18.x.x
- `@types/node`: ^16.x.x
- `autoprefixer`: ^10.x.x
- `postcss`: ^8.x.x

## Hướng dẫn sử dụng

### Đăng nhập/Đăng ký

1. Truy cập trang chủ
2. Chọn "Đăng nhập" hoặc "Đăng ký"
3. Điền thông tin theo yêu cầu
4. Xác nhận email (nếu cần)

### Nghe nhạc

1. Tìm kiếm bài hát bằng thanh tìm kiếm
2. Chọn bài hát từ kết quả tìm kiếm
3. Sử dụng các nút điều khiển để:
   - Phát/Tạm dừng
   - Chuyển bài
   - Điều chỉnh âm lượng
   - Bật chế độ phát ngẫu nhiên

### Tạo Playlist

1. Đăng nhập vào tài khoản
2. Chọn "Tạo Playlist mới"
3. Đặt tên và mô tả playlist
4. Thêm bài hát vào playlist

## Lưu ý quan trọng

1. **Bảo mật**:

   - Không chia sẻ thông tin đăng nhập
   - Đăng xuất sau khi sử dụng
   - Sử dụng mật khẩu mạnh

2. **Hiệu suất**:

   - Đảm bảo kết nối internet ổn định
   - Xóa cache trình duyệt định kỳ
   - Cập nhật trình duyệt lên phiên bản mới nhất

3. **Tương thích**:
   - Ứng dụng hoạt động tốt nhất trên Chrome và Firefox
   - Một số tính năng có thể không hoạt động trên trình duyệt cũ

## 🔧 Xử lý sự cố

1. **Không thể đăng nhập**:

   - Kiểm tra kết nối internet
   - Xác nhận thông tin đăng nhập
   - Xóa cache trình duyệt

2. **Âm thanh không phát**:

   - Kiểm tra âm lượng
   - Kiểm tra kết nối internet
   - Thử làm mới trang

3. **Giao diện bị lỗi**:
   - Làm mới trang
   - Xóa cache trình duyệt
   - Kiểm tra phiên bản trình duyệt

## Hỗ trợ

Nếu bạn gặp vấn đề hoặc cần hỗ trợ, vui lòng:

1. Kiểm tra phần "Xử lý sự cố" trong tài liệu này
2. Tạo issue trên repository
3. Liên hệ với đội ngũ phát triển
