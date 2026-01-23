## 9. Quản trị & Nền tảng

### Quyền lực phải được phân quyền

AlmaNEO không phải là một dự án bị chi phối bởi bất kỳ cá nhân hay tổ chức nào. Chúng tôi đã thiết kế hệ thống quản trị phi tập trung ngay từ đầu, trao quyền cho cộng đồng tự quyết định tương lai của mình.

---

### 9.1 Triết lý quản trị

#### Ba nguyên tắc

| Nguyên tắc | Mô tả |

|------|------|

| **Tính minh bạch** | Tất cả các quy trình ra quyết định và chi tiết sử dụng tài chính đều được công khai trên chuỗi |

| **Sự tham gia** | Bất kỳ người nắm giữ token nào cũng có thể đề xuất, bỏ phiếu và tham gia vào các quyết định |

| **Trọng số lòng tốt** | Tiếng nói của những người đóng góp nhiều hơn sẽ mạnh mẽ hơn những người chỉ đơn giản là có nhiều hơn |

---

### 9.2 Cấu trúc DAO

AlmaNEO DAO tập hợp trí tuệ tập thể của cộng đồng để xác định hướng đi của dự án.

### Cấu trúc AlmaNEO DAO

**Cấu trúc AlmaNEO DAO:**

| Thành phần | Vai trò | Mô tả |

|:---|:---|:---|

| **Người nắm giữ Token** | Toàn thể cộng đồng | Quyền bỏ phiếu đề xuất, bỏ phiếu theo trọng số lòng tốt, bầu cử Hội đồng |

| **Hội đồng** | Hội đồng (9 thành viên) | Xử lý chương trình nghị sự khẩn cấp, xem xét trước đề xuất |

| **Quỹ** | Quỹ | Hoạt động hàng ngày, Đại diện pháp lý, Thực thi quyết định của DAO |

**Mối quan hệ:** Người nắm giữ Token bầu ra Hội đồng → Hội đồng hợp tác với Quỹ → Quỹ hỗ trợ/thực thi quyết định của Người nắm giữ Token

---

### 9.3 Cơ chế bỏ phiếu

#### Bỏ phiếu theo trọng số lòng tốt

Hệ thống bỏ phiếu của AlmaNEO không chỉ đơn giản là "1 Token = 1 Phiếu bầu."

```
Sức mạnh bỏ phiếu = √(Số Token nắm giữ) × Hệ số nhân điểm lòng tốt

```

| Điểm lòng tốt | Hệ số nhân |

|----------------|------|

| 0 - 100 | 1.0x |

| 101 - 500 | 1.5x |

| 501 - 1000 | 2.0x |

| 1001+ | 2.5x |

**Ý nghĩa của hệ thống này:**
- Hạn chế quyền lực độc quyền của những người nắm giữ số lượng lớn (cá voi)

- Khuếch đại tiếng nói của những người đóng góp tích cực trong cộng đồng
- Một cấu trúc nơi lòng tốt tương đương với tầm ảnh hưởng

#### Các loại đề xuất

| Loại | Số lượng tối thiểu | Yêu cầu thông qua | Ví dụ |

|------|--------|----------|------|

| **Đề xuất chung** | 5% | Đa số | Sử dụng ngân sách nhỏ, Hợp tác |

| **Đề xuất quan trọng** | 15% | 2/3 | Tổ chức triển lãm, Tài trợ lớn |

| **Sửa đổi Hiến pháp** | 30% | 3/4 | Thay đổi về nền kinh tế token, Thay đổi về cấu trúc quản trị |

---

### 9.4 Tổ chức AlmaNEO

Tổ chức là pháp nhân thực thi các quyết định của DAO trong thế giới thực.

#### Vai trò

| Vai trò | Mô tả |

|------|------|

| **Đại diện pháp lý** | Thực thi hợp đồng, Hợp tác, Phản hồi pháp lý |

| **Hoạt động hàng ngày** | Quản lý nhóm phát triển, Vận hành cơ sở hạ tầng |

| **Thực thi DAO** | Thực thi các quyết định của cộng đồng |

| **Quản lý tài sản** | Quản lý dự trữ của Tổ chức (Đa chữ ký) |

#### Cam kết minh bạch

- Công khai **Báo cáo tài chính hàng quý**
- Ghi nhận **Tất cả chi phí** trên chuỗi khối
- Tiến hành **Kiểm toán bên ngoài hàng năm**
- Chấp nhận **Sự giám sát của Hội đồng**

#### Kế hoạch thành lập Quỹ

Địa điểm của Quỹ sẽ được xác định bằng cách xem xét các yếu tố sau:

| Các yếu tố được xem xét | Mô tả |

|----------|------|

| **Luật thân thiện với DAO** | Các khu vực pháp lý công nhận hoạt động của DAO |

| **Hiệu quả về thuế** | Thuế phù hợp với hoạt động phi lợi nhuận |

| **Dễ vận hành** | Khả năng thành lập/vận hành từ xa |

| **Uy tín** | Một khu vực đổi mới hợp pháp, không phải khu vực né tránh quy định |

> *Địa điểm thành lập cụ thể sẽ được hoàn thiện và công bố sau khi xem xét pháp lý.*

---

### 9.5 Phân quyền dần dần

AlmaNEO không theo đuổi việc phân quyền hoàn toàn ngay từ đầu. Việc phân quyền nhanh chóng thực tế có thể gây rủi ro cho dự án.

### Lộ trình phân quyền dần dần

| Giai đoạn | Thời gian | Đặc điểm | Nội dung chính |

| :--- | :--- | :--- | :--- |

| **Giai đoạn 1** | 2025-2026 | Do Quỹ lãnh đạo | Thiết lập cơ sở hạ tầng cốt lõi, hình thành cộng đồng ban đầu và Quỹ đưa ra các quyết định quan trọng |

| **Giai đoạn 2** | 2026-2027 | Quản trị chung | Bắt đầu bầu cử Hội đồng, bỏ phiếu của DAO về các mục chính trong chương trình nghị sự và chuyển giao quyền lực dần dần cho Quỹ |

| **Giai đoạn 3** | 2027-2028 | Do DAO lãnh đạo | Hầu hết các quyết định được đưa ra trong DAO, với Quỹ chuyển sang vai trò cơ quan điều hành |

| **Giai đoạn 4** | 2028+ | Phi tập trung hoàn toàn | Tổ chức được thu nhỏ hoặc giải thể, vận hành tự động dựa trên hợp đồng thông minh, quyền tự chủ hoàn toàn của cộng đồng |

---

### 9.6 Biện pháp bảo vệ

#### Tạm dừng khẩn cấp

Trong trường hợp có mối đe dọa an ninh nghiêm trọng hoặc lỗi, giao thức có thể bị tạm thời đình chỉ bằng đa số phiếu của Hội đồng (5/9).

Giao thức sẽ được tiếp tục hoặc giải quyết thông qua bỏ phiếu của DAO trong vòng 48 giờ kể từ khi đình chỉ.

#### Đa chữ ký

Tài sản của Tổ chức được quản lý thông qua ví đa chữ ký.

| Mục đích | Yêu cầu chữ ký |

|------|----------|

| Chi phí hoạt động hàng ngày | 3/5 chữ ký |

| Chi tiêu lớn | 5/7 chữ ký |

| Quỹ khẩn cấp | 7/9 chữ ký + bỏ phiếu của DAO |

#### Khóa thời gian

Các thay đổi lớn về hợp đồng thông minh phải tuân theo khóa thời gian 48 giờ, đảm bảo cộng đồng có thời gian xem xét và phản đối.

---

### Mục tiêu tối thượng của quản trị

> "Ngay cả khi Quỹ AlmaNEO biến mất một ngày nào đó, hệ sinh thái AlmaNEO vẫn phải tiếp tục hoạt động. Thành công của chúng ta phụ thuộc vào việc chúng ta trở nên lỗi thời."*

---

*Phần sau đây phác thảo lộ trình cụ thể của AlmaNEO.*

*