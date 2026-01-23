## 5. Kiến trúc kỹ thuật

### Ngay cả khi công nghệ phức tạp, trải nghiệm người dùng vẫn phải đơn giản.

Nguyên tắc thiết kế kỹ thuật của AlmaNEO rất rõ ràng: **Người dùng không cần phải biết gì về blockchain.** Công nghệ phức tạp hoạt động ở phía sau, và người dùng sử dụng dịch vụ theo cách quen thuộc.

---

### 5.1 Tổng quan hệ thống

**Kiến trúc 4 lớp của hệ thống AlmaNEO:**

| Các lớp | Các thành phần | Vai trò |

|:---:|:---|:---|

| **1. Lớp người dùng** | Ứng dụng AlmaNEO, Web3Auth, giao diện trò chuyện AI | Tương tác trực tiếp với người dùng |

| **2. Lớp trí tuệ** | Phục vụ mô hình AI, mạng DePIN, định vị mô hình | Cung cấp dịch vụ AI |

| **3. Lớp tin cậy** | Điểm lòng tốt, xác thực sinh trắc học, phát hành Jeong-SBT | Xác minh danh tính và đóng góp |

| **4. Lớp Blockchain** | Mạng Polygon, Token ALMAN, Hợp đồng thông minh | Cơ sở hạ tầng phi tập trung |

**Luồng dữ liệu:** Điểm tiếp xúc người dùng → Trí tuệ → Niềm tin → Blockchain (Giao tiếp hai chiều giữa các lớp)

---

### 5.2 Blockchain: Tại sao chọn Polygon

AlmaNEO được xây dựng trên **Mạng Polygon**.

#### Lý do lựa chọn

| Tiêu chí | Ưu điểm của Polygon |

|------|---------------|

| **Phí Gas** | Dưới 0,01 đô la mỗi giao dịch — Giá cả phải chăng ngay cả đối với người dùng ở các nước đang phát triển |

| **Tốc độ** | Xác nhận giao dịch trong vòng 2 giây — Tương tác thời gian thực |

| **Hệ sinh thái** | Hệ sinh thái DeFi, NFT trưởng thành — Có khả năng mở rộng |

| **Khả năng tương thích** | Hoàn toàn tương thích với Ethereum — Dễ dàng mở rộng |

| **Môi trường** | Tiết kiệm năng lượng dựa trên PoS — Bền vững |

### Cấu trúc Hợp đồng Thông minh

### Cấu trúc Hợp đồng Thông minh

| Hợp đồng | Mô tả | Vai trò chính |

| :--- | :--- | :--- |
| **Token ALMAN** | Token chuẩn ERC-20 | Tổng cung: 8 tỷ, tiện ích tín dụng/đặt cọc/quản trị AI |

| **Jeong-SBT** | ERC-5484 (SBT) | Token linh hồn không thể chuyển nhượng, ghi lại Điểm Lòng Tốt trên chuỗi |

| **Sổ Đăng Ký Lòng Tốt** | Hợp đồng Xác minh Hoạt động | Xác minh và ghi lại hoạt động lòng tốt, hệ thống bỏ phiếu được xác minh bởi người dùng khác |

| **Thỏa thuận Tính toán** | Hợp đồng Chia sẻ Tài nguyên | Đăng ký nút DePIN và phần thưởng, phân bổ tài nguyên tính toán tự động |

| **Quản trị** | Hợp đồng DAO | Đề xuất và bỏ phiếu DAO, quyền bỏ phiếu có trọng số theo Điểm Lòng Tốt |

---

### 5.3 Trải nghiệm Người dùng: Thiết kế Không Rào Cản

#### Web3Auth: Khởi động trong 5 giây

Rào cản lớn nhất khi tham gia các dịch vụ blockchain hiện có là "tạo ví". Hãy ghi lại 12 cụm từ hạt giống của bạn, đừng bao giờ làm mất chúng và giữ an toàn các khóa riêng tư của bạn. Hầu hết mọi người đều bỏ cuộc ở đây.

**AlmaNEO khác biệt.**

![Thông số kỹ thuật AlmaNEO](../assets/images/05.webp)

### So sánh quy trình đăng ký truyền thống và AlmaNEO

| Danh mục | Quy trình đăng ký Blockchain truyền thống | Quy trình đăng ký AlmaNEO |

| :--- | :--- | :--- |

| **Quy trình** | Cài đặt ví → Tạo cụm từ hạt giống → Lưu trữ an toàn → Sao chép địa chỉ → Mua token → Gửi → Tính phí gas → Sử dụng dịch vụ (8 bước) | Nhấp vào "Đăng nhập bằng Google" → Hoàn tất (2 bước) |

| **Thời gian cần thiết** | 30 phút đến 1 giờ | **5 giây** |

| **Tỷ lệ thoát** | 90% trở lên | Tối thiểu |

**Cách thức hoạt động:**
- Web3Auth tự động tạo ví không lưu ký dựa trên tài khoản mạng xã hội của người dùng. - Khóa riêng tư được lưu trữ theo cách phi tập trung, khiến chúng không thể truy cập được bởi người dùng hoặc AlmaNEO.

- Người dùng có thể sử dụng tất cả các tính năng mà không cần biết đến sự tồn tại của ví.

#### Giao dịch không phí gas: Không lo về phí

Một rào cản khác đối với việc áp dụng blockchain là "phí gas". Việc phải trả phí cho mỗi giao dịch, dù nhỏ đến đâu, cũng có thể là gánh nặng đáng kể đối với người dùng mới.

**Giải pháp của AlmaNEO:**

- Áp dụng ERC-4337 (Trừu tượng hóa tài khoản).

- Tổ chức chi trả phí gas cho các giao dịch cơ bản.

- Người dùng có thể sử dụng dịch vụ mà không mất phí.

---

### 5.4 Cơ sở hạ tầng AI: Phân tán và Tối ưu hóa

#### Tối ưu hóa mô hình

Trung tâm AI của AlmaNEO cung cấp các mô hình AI mã nguồn mở được tối ưu hóa.

| Công nghệ | Mô tả | Hiệu quả |

|------|------|------|

| **Lượng tử hóa** | Điều chỉnh độ chính xác của mô hình | Giảm 70% dung lượng, hiệu suất 99% |
| **LoRA** | Tinh chỉnh nhẹ | Tối ưu hóa ngôn ngữ cục bộ |

| **Điện toán biên** | Tính toán trên thiết bị | Có sẵn ngay cả khi internet không ổn định |

#### Vận hành nút DePIN

Người dùng trên toàn thế giới kết nối máy tính của họ với mạng AlmaNEO để cung cấp tài nguyên tính toán.

Cách tham gia vào một nút:

1. Cài đặt phần mềm AlmaNEO Node (Windows, Mac, Linux)

2. Thiết lập lượng tài nguyên cần chia sẻ (GPU, CPU, bộ nhớ)

3. Kết nối với mạng

4. Nhận phần thưởng token ALMAN dựa trên lượng tài nguyên đã cung cấp.

**Bảo mật:**

- Tất cả các phép tính đều chạy trong môi trường hộp cát bên trong vùng chứa Docker.

- Dữ liệu người dùng được bảo vệ bằng mã hóa đầu cuối (E2EE).

- Ngay cả người vận hành nút cũng không thể xem các truy vấn của người dùng.

---

### 5.5 Xác minh danh tính: Con người, không phải Bot

Việc cung cấp tài nguyên AI miễn phí chắc chắn sẽ dẫn đến các nỗ lực lạm dụng. Bot sẽ tạo ra hàng chục nghìn tài khoản để độc chiếm tài nguyên.

AlmaNEO thực hiện nguyên tắc **"Mỗi người một tài khoản"** thông qua công nghệ.

#### Xác thực danh tính đa lớp

### Xác thực danh tính đa lớp

1. **Lớp 1: Xác thực thiết bị**
- Phát hiện thiết bị trùng lặp bằng Dấu vân tay thiết bị
2. **Lớp 2: Xác thực mạng xã hội**
- Xác minh danh tính cơ bản bằng cách liên kết tài khoản mạng xã hội
3. **Lớp 3: Xác thực sinh trắc học (Tùy chọn)**
- Đạt được xếp hạng cao hơn với Nhận diện khuôn mặt và các phương thức xác thực khác
4. **Lớp 4: Phân tích hành vi**
- Phân biệt giữa bot và người dựa trên các mẫu sử dụng
5. **Lớp 5: Sự chứng thực của cộng đồng**
- Tăng cường sự tin tưởng thông qua các đề xuất từ ​​các thành viên hiện có

**Hệ thống xếp hạng:**

|Xếp hạng | Mức độ xác thực | Tín dụng AI miễn phí hàng ngày |

|------|----------|-------------------|

| Cơ bản | Chỉ đăng nhập bằng mạng xã hội | 10 lần |

| Đã xác minh | Thiết bị + Mạng xã hội | 50 lần |

| Đáng tin cậy | Thêm xác thực sinh trắc học | 200 lần |

| Người bảo vệ | Điểm Lòng tốt cao | Không giới hạn |

---

### 5.6 Quyền riêng tư: Dữ liệu của bạn thuộc về bạn

AlmaNEO không thu thập dữ liệu người dùng.

#### Nguyên tắc về quyền riêng tư

| Nguyên tắc | Thực hiện |

|------|------|

| **Các cuộc hội thoại không lưu trữ** | Các cuộc hội thoại AI không được lưu trữ trên máy chủ |

| **Mã hóa cục bộ** | Dữ liệu người dùng được mã hóa trên thiết bị bằng AES-256 |

| **Phân tích ẩn danh** | Dữ liệu được ẩn danh hoàn toàn để cải thiện dịch vụ |

| **Sử dụng Giao thức Không Kiến thức** | Bảo vệ quyền riêng tư khi xác minh Điểm Lòng tốt |

> *"Chúng tôi không biết bạn đã hỏi gì. Tất cả những gì chúng tôi biết là bạn tốt bụng như thế nào."*

---

### 5.7 Tóm tắt Lộ trình Công nghệ

| Giai đoạn | Thời kỳ | Các Phát triển Chính |
|------|------|----------|

| **Alpha** | Quý 1-2 năm 2025 | Triển khai Testnet, Xác minh chức năng cốt lõi |

| **Beta** | Quý 3-4 năm 2025 | Triển khai Mainnet, Mở rộng nút DePIN |

| **V1.0** | Quý 1 năm 2026 | Ra mắt chính thức, Hỗ trợ đa ngôn ngữ |

| **V2.0** | Nửa cuối năm 2026 | Tính năng nâng cao, Mở rộng hệ sinh thái |

---

*Phần sau đây mô tả chi tiết cấu trúc kinh tế của token ALMAN.*

