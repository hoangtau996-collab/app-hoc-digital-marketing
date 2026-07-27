export const COURSE_MODULES = [
  {
    id: "module-01",
    number: "01",
    title: "Digital Marketing Goals",
    subtitle: "Mục tiêu trong Digital Marketing",
    description: "Giúp bạn nắm vững 2 chiến lược chủ chốt trong hoạt động Digital Marketing là Performance Marketing và Brand Marketing.",
    icon: "Target",
    badge: "Nền Tảng Chiến Lược",
    duration: "45 phút",
    lessonsCount: 4,
    quizCount: 5,
    sections: [
      {
        id: "m1-s1",
        title: "1. Performance Marketing vs Brand Marketing",
        content: `### Bản chất của 2 trụ cột Digital Marketing

Trong vai trò Trưởng phòng Digital Marketing, sai lầm phổ biến nhất là đối lập hóa giữa Performance Marketing và Brand Marketing. Thực tế, đây là 2 bánh xe của cùng một cỗ xe tăng trưởng doanh nghiệp.

#### 1. Performance Marketing (Marketing Hiệu Suất)
* Đặc điểm: Tập trung trực tiếp vào hành vi chuyển đổi nhanh chóng như số lượng Leads, Đơn hàng, Doanh thu thực nhận và lượt tải ứng dụng.
* Chỉ số đo lường: CPA (Chi phí trên mỗi khách hàng), ROAS (Tỷ suất doanh thu trên chi phí quảng cáo), CVR (Tỷ lệ chuyển đổi) và CAC (Chi phí thu hút khách hàng mới).
* Ưu điểm: Tính toán chính xác lợi nhuận ROI theo thời gian thực, dễ dàng tăng giảm ngân sách linh hoạt.
* Rủi ro: Dễ chạm trần tăng trưởng khi tệp khách hàng nóng bị khai thác hết, chi phí quảng cáo (CPM) có xu hướng tăng liên tục theo thời gian.

#### 2. Brand Marketing (Marketing Thương Hiệu)
* Đặc điểm: Định hình nhận thức, niềm tin và sự yêu thích của khách hàng đối với thương hiệu trong dài hạn.
* Chỉ số đo lường: Share of Voice (Thị phần thảo luận), Brand Search Volume (Lượt tìm kiếm tên thương hiệu), Sentiment Score và Giá trị trọn đời khách hàng (LTV).
* Ưu điểm: Tạo rào cản cạnh tranh bền vững, giảm sự phụ thuộc vào quảng cáo trả phí, giúp giảm chỉ số CAC dài hạn.
* Rủi ro: Khó đo lường ROI trực tiếp trong ngắn hạn, đòi hỏi sự kiên trì và nguồn ngân sách duy trì ổn định.`,
        takeaway: "Performance mang lại dòng tiền hôm nay, Brand Marketing mang lại sự sống còn cho doanh nghiệp ngày mai."
      },
      {
        id: "m1-s2",
        title: "2. Khung phân bổ 60/40 cho Trưởng Phòng",
        content: `### Mô hình phân bổ ngân sách chuẩn hóa theo ngành hàng

Theo nghiên cứu kinh điển về hiệu quả quảng cáo của Les Binet & Peter Field, tỷ lệ vàng cân bằng giữa xây dựng thương hiệu (Brand Building) và thúc đẩy bán hàng (Sales Activation) là 60% Brand : 40% Performance cho đa số doanh nghiệp B2C.

#### Tỷ lệ điều chỉnh linh hoạt theo mô hình kinh doanh:
1. Thương mại điện tử & Bán lẻ (E-commerce / Retail): Phân bổ 40% Brand - 60% Performance để tối ưu dòng tiền và chuyển đổi trực tiếp.
2. Sản phẩm giá trị cao & Bất động sản (High-ticket / Luxury): Phân bổ 70% Brand - 30% Performance vì khách hàng mất nhiều thời gian cân nhắc và yếu tố niềm tin là số 1.
3. Hàng tiêu dùng nhanh (FMCG): Phân bổ 70% Brand - 30% Performance để đảm bảo sự hiện diện liên tục trên các điểm bán và kênh số.
4. Doanh nghiệp khởi nghiệp (Startup): Phân bổ 20% Brand - 80% Performance ở giai đoạn đầu để chứng minh hiệu quả sản phẩm, sau đó nâng dần tỷ lệ Brand khi mở rộng quy mô.`,
        takeaway: "Không có tỷ lệ cố định duy nhất, Trưởng phòng cần căn chỉnh theo giai đoạn phát triển và biên lợi nhuận của sản phẩm."
      },
      {
        id: "m1-s3",
        title: "3. Ma trận chuyển đổi từ Mục tiêu Kinh doanh sang Chỉ số Digital",
        content: `### Cách quy đổi từ kỳ vọng của Ban Giám Đốc sang OKRs Digital

CEO thường đưa ra mục tiêu kinh doanh tổng quát như tăng trưởng doanh thu hoặc mở rộng thị phần. Nhiệm vụ của Trưởng phòng Digital Marketing là dịch chuyển mục tiêu đó thành bộ chỉ số kỹ thuật hạ tầng:

* Mục tiêu Doanh thu tăng trưởng 50%: Chuyển thành mục tiêu mở rộng tệp khách hàng mới với các chỉ số đo lường New CAC, ROAS, Volume Leads và Tỷ lệ CVR.
* Mục tiêu Tăng tỷ suất lợi nhuận ròng: Chuyển thành mục tiêu tối ưu chi phí thu hút và đẩy mạnh bán lại với chỉ số Retargeting CPL, Retention Rate và Organic Traffic Share.
* Mục tiêu Định vị phân khúc cao cấp: Chuyển thành mục tiêu nâng cao giá trị thương hiệu với chỉ số Brand Search Volume, Engagement Rate và Impression Share.`
      },
      {
        id: "m1-s4",
        title: "4. Chuyên sâu: Định luật 95-5 và bài toán ngân sách minh hoạ",
        content: `### Vì sao cắt ngân sách Brand lại làm tăng chi phí Performance

Viện B2B Institute (LinkedIn) cùng Giáo sư John Dawes thuộc Ehrenberg-Bass Institute đưa ra **Định luật 95-5**: tại bất kỳ thời điểm nào, chỉ khoảng **5% khách hàng tiềm năng đang thực sự có nhu cầu mua ngay**, 95% còn lại chưa có nhu cầu tại thời điểm đó.

Hệ quả trực tiếp với Trưởng phòng Digital Marketing:

* Quảng cáo Performance chỉ cạnh tranh trong nhóm 5% đang có nhu cầu. Càng nhiều đối thủ dồn tiền vào đây, giá thầu càng bị đẩy lên.
* Ngân sách Brand làm việc với nhóm 95%, để khi họ rơi vào trạng thái có nhu cầu thì thương hiệu của bạn đã nằm sẵn trong trí nhớ.
* Cắt sạch Brand không làm doanh thu giảm ngay trong tháng đầu. Nó làm cạn dần nguồn khách hàng nhận biết sẵn, và hậu quả xuất hiện sau 6 đến 12 tháng dưới dạng CPA tăng đều mà không rõ lý do.

#### Minh hoạ bằng số: Doanh nghiệp nội thất, ngân sách 300 triệu/tháng

Các con số dưới đây là giả định trong ví dụ để bạn nắm cách tính, không phải số liệu thị trường thực tế.

Phương án A - Dồn 100% vào Performance:

* Ngân sách: 300 triệu, toàn bộ chạy chuyển đổi.
* Tệp có nhu cầu ngay ước tính 5% của 200.000 người tiếp cận, tương đương 10.000 người.
* CPA trung bình 1.500.000 đồng, thu về 200 đơn hàng.
* Doanh thu 200 đơn nhân 4.000.000 đồng bằng 800 triệu. ROAS bằng 2,67 lần.

Phương án B - Chia 40% Brand và 60% Performance:

* Performance 180 triệu, Brand 120 triệu.
* Tháng 1 đến 3: CPA chưa cải thiện, chỉ còn 120 đơn, doanh thu 480 triệu. Nhìn qua thì kém hơn phương án A.
* Tháng 7 đến 12: nhờ lượng nhận biết tích luỹ, tỷ lệ chuyển đổi tăng và CPA giảm còn 1.050.000 đồng. Với 180 triệu thu về 171 đơn, cộng thêm khoảng 40 đơn đến từ tìm kiếm thương hiệu và truy cập trực tiếp mà không tốn phí quảng cáo.
* Tổng 211 đơn với chi phí quảng cáo 300 triệu, doanh thu 844 triệu. ROAS bằng 2,81 lần và vẫn đang tăng.

#### Điều con số trên nói với bạn

1. Trong 3 tháng đầu, phương án B **luôn trông có vẻ tệ hơn**. Đây chính là lý do đa số Trưởng phòng bị Ban Giám Đốc ép cắt Brand đúng vào lúc nó sắp phát huy tác dụng.
2. Điểm hoà vốn giữa hai phương án thường rơi vào **tháng thứ 5 đến thứ 8**. Khi trình kế hoạch, bạn phải nói trước mốc thời gian này, nếu không mọi cuộc họp tháng 3 sẽ trở thành phiên xét xử.
3. Phần 40 đơn đến từ Organic và Direct là **tài sản**, không phải chi phí. Nó vẫn chạy kể cả tháng nào bạn tắt quảng cáo.`,
        takeaway: "Khi Ban Giám Đốc đòi cắt ngân sách Brand, đừng tranh luận bằng quan điểm. Hãy trình bảng so sánh CPA theo 12 tháng và chỉ rõ mốc hoà vốn tháng thứ 5 đến thứ 8."
      }
    ],
    quiz: [
      {
        id: "q1_1",
        question: "Doanh nghiệp của bạn đang bán sản phẩm thiết bị spa cao cấp trị giá 50 triệu/máy. Khách hàng mất trung bình 3-6 tháng cân nhắc. Trưởng phòng nên phân bổ chiến lược thế nào?",
        options: [
          "Dồn 90% ngân sách chạy Facebook Ads chạy tin nhắn tư vấn và chốt đơn ngay",
          "Ưu tiên Brand & Content uy tín (70%) để xây dựng Trust, kết hợp Lead Nurturing & Retargeting (30%)",
          "Chỉ tập trung chạy TikTok Live chiết khấu sâu để thu hút người mua ngẫu hứng",
          "Cắt giảm toàn bộ quảng cáo trả phí, chỉ làm bài viết website SEO"
        ],
        correct: 1,
        explanation: "Với sản phẩm giá trị cao (High-ticket), yếu tố niềm tin (Trust) và độ uy tín thương hiệu chiếm 70% quyết định mua hàng. Quảng cáo ép chốt ngay (Performance thuần túy) sẽ có CPL cao và tỷ lệ hủy đơn lớn."
      },
      {
        id: "q1_2",
        question: "Chỉ số nào thể hiện rõ nhất hiệu quả dài hạn của chiến dịch Brand Marketing đối với kênh Digital?",
        options: [
          "CPM (Cost Per Mille) thấp nhất trên Meta Ads",
          "Sự gia tăng tự nhiên của Brand Search Volume (Lượt tìm kiếm tên thương hiệu trên Google)",
          "Số lượng bình luận hỏi giá dưới bài post bán hàng",
          "Tỷ lệ nhấp CTR của mẫu quảng cáo hình ảnh"
        ],
        correct: 1,
        explanation: "Khi Brand Marketing hiệu quả, người dùng sẽ chủ động gõ tên thương hiệu trên Google/YouTube (Brand Search Volume), cho thấy thương hiệu đã đi vào tâm trí khách hàng (Top of Mind)."
      },
      {
        id: "q1_3",
        question: "Khi chi phí quảng cáo (CPM) trên Meta và TikTok tăng gấp 2 lần vào mùa cao điểm Giáng Sinh, doanh nghiệp có độ nhận diện thương hiệu mạnh sẽ gặp lợi thế gì?",
        options: [
          "Tự động được Meta giảm 50% giá thầu CPM",
          "Giữ vững tỷ lệ chuyển đổi CVR cao hơn và thu hút Organic Search/Direct Traffic giúp ổn định CAC",
          "Không cần bật quảng cáo vẫn duy trì doanh thu x3",
          "Được ưu tiên hiển thị đầu tiên trên kết quả quảng cáo tìm kiếm miễn phí"
        ],
        correct: 1,
        explanation: "Thương hiệu mạnh có tệp khách hàng nhận biết sẵn, giúp CVR (Tỷ lệ chuyển đổi) cao hơn và kéo lượng truy cập tự nhiên (Direct/Organic), từ đó chống đỡ đà tăng giá CPM từ quảng cáo."
      },
      {
        id: "q1_4",
        question: "Công ty bạn cắt toàn bộ ngân sách Brand từ tháng 1. Tháng 2 và 3 doanh thu vẫn giữ nguyên nên Ban Giám Đốc kết luận ngân sách Brand là lãng phí. Trưởng phòng nên phản biện thế nào?",
        options: [
          "Đồng ý và cắt luôn ngân sách Brand vĩnh viễn vì số liệu 2 tháng đã chứng minh",
          "Chỉ ra rằng Brand tác động lên nhóm 95% chưa có nhu cầu, hậu quả hiện sau 6-12 tháng dưới dạng CPA tăng dần, và đề xuất theo dõi CPA cùng Brand Search Volume theo quý",
          "Xin tăng gấp đôi ngân sách Brand ngay lập tức để chứng minh",
          "Chuyển toàn bộ ngân sách sang KOL để doanh thu tăng ngay trong tháng"
        ],
        correct: 1,
        explanation: "Định luật 95-5 cho thấy Brand làm việc với nhóm chưa có nhu cầu, nên tác động có độ trễ. Hai tháng là quá ngắn để kết luận. Bằng chứng thuyết phục là xu hướng CPA và Brand Search Volume theo quý, không phải doanh thu tháng."
      },
      {
        id: "q1_5",
        question: "Trong ví dụ so sánh 2 phương án ngân sách, vì sao phần đơn hàng đến từ Organic Search và Direct Traffic được coi là tài sản chứ không phải chi phí?",
        options: [
          "Vì nó được Google và Meta tài trợ miễn phí cho doanh nghiệp lớn",
          "Vì nó vẫn tiếp tục tạo ra đơn hàng ngay cả trong tháng doanh nghiệp tắt quảng cáo trả phí",
          "Vì kế toán ghi nhận khoản này vào mục doanh thu tài chính",
          "Vì chi phí tạo ra nó luôn bằng 0 ngay từ đầu"
        ],
        correct: 1,
        explanation: "Lượng truy cập tự nhiên và trực tiếp sinh ra từ nhận biết thương hiệu đã tích luỹ. Nó không tắt theo ngân sách quảng cáo, nên mang đặc tính của tài sản: đầu tư một lần, sinh lợi nhiều kỳ."
      }
    ]
  },
  {
    id: "module-02",
    number: "02",
    title: "Digital Marketing Methods",
    subtitle: "Phương thức Digital Marketing",
    description: "Giúp hệ thống tư duy về 2 mô hình marketing hiện đại là Inbound Marketing và Outbound Marketing.",
    icon: "Compass",
    badge: "Mô Hình Tiếp Cận",
    duration: "50 phút",
    lessonsCount: 3,
    quizCount: 5,
    sections: [
      {
        id: "m2-s1",
        title: "1. Đẩy & Kéo: Bản chất Inbound vs Outbound",
        content: `### Hai triết lý tiếp cận khách hàng trên không gian số

#### 1. Inbound Marketing (Marketing Nam Châm - Chiến Lược Kéo)
* Triết lý: Thu hút khách hàng bằng cách trao giá trị hữu ích trước khi bán hàng thông qua nội dung chất lượng, giải đáp nỗi đau và cung cấp giải pháp chuyên sâu.
* Cơ chế: Khách hàng tự tìm đến doanh nghiệp khi họ gặp vấn đề và tìm kiếm câu trả lời trên không gian số.
* Kênh triển khai: Google Search SEO, Blog Hướng dẫn chuyên môn, YouTube Educational, Email Newsletter và TikTok Knowledge Content.
* Đặc điểm: Chi phí đầu tư ban đầu cao và tốn thời gian, nhưng tạo ra giá trị tích lũy lãi suất kép bền vững về sau.

#### 2. Outbound Marketing (Marketing Loa Phường - Chiến Lược Đẩy)
* Triết lý: Đưa thông điệp sản phẩm đến tệp khách hàng tiềm năng một cách chủ động, trực diện và nhanh chóng.
* Kênh triển khai: Paid Ads trên Meta, Google Display, TikTok Ads, Booking Influencers và Display Banners.
* Đặc điểm: Đạt quy mô tiếp cận nhanh chóng trong thời gian ngắn, nhưng doanh thu dừng lại ngay khi ngắt ngân sách quảng cáo.`,
        takeaway: "Inbound tạo nền móng tài sản bền vững, Outbound tạo bệ phóng tăng trưởng doanh thu ngắn hạn."
      },
      {
        id: "m2-s2",
        title: "2. Mô hình Flywheel phối hợp Inbound & Outbound",
        content: `### Xây dựng bánh đà tăng trưởng bền vững

Trưởng phòng Digital Marketing thông minh không chọn một trong hai mà kết hợp theo mô hình bánh đà Flywheel:

1. Giai đoạn Thu hút (Attract): Dùng Outbound Ads để tiếp cận nhanh tệp khách hàng mới kết hợp với Inbound Content để giữ chân và tạo ấn tượng.
2. Giai đoạn Tương tác (Engage): Dùng các tài liệu trao giá trị miễn phí (Lead Magnet), tài khoản dùng thử hoặc buổi tư vấn để thu thập dữ liệu khách hàng.
3. Giai đoạn Thỏa mãn (Delight): Dùng hệ thống Email tự động và Quảng cáo bám đuổi (Retargeting) để chăm sóc chu đáo, biến khách hàng mua thành người giới thiệu thương hiệu.`
      },
      {
        id: "m2-s3",
        title: "3. Chuyên sâu: Chi phí Inbound và Outbound sau 12 tháng",
        content: `### Hai đường cong chi phí ngược nhau

Sai lầm khi so sánh Inbound và Outbound là chỉ nhìn chi phí của tháng đầu tiên. Bản chất hai kênh này có **hình dạng chi phí trái ngược nhau theo thời gian**.

* **Outbound (quảng cáo trả phí)**: chi phí gần như tuyến tính. Muốn gấp đôi kết quả thì phải gấp đôi ngân sách. Tệ hơn, khi tệp khách hàng bị khai thác cạn, chi phí cho mỗi đơn tăng dần dù ngân sách giữ nguyên.
* **Inbound (SEO, nội dung, cộng đồng)**: chi phí ban đầu cao và gần như không có kết quả trong vài tháng đầu. Nhưng tài sản tích luỹ lại, nên chi phí trên mỗi khách hàng giảm dần theo thời gian.

#### Minh hoạ bằng số: Ngành phần mềm dịch vụ, 100 triệu/tháng cho mỗi kênh

Số liệu giả định để minh hoạ hình dạng đường cong.

Kênh Outbound - Google Ads và Meta Ads:

1. Tháng 1 đến 3: 100 triệu, thu 125 khách hàng tiềm năng. Chi phí mỗi khách 800.000 đồng.
2. Tháng 4 đến 9: tệp bắt đầu bão hoà, chi phí mỗi khách lên 950.000 đồng, còn 105 khách.
3. Tháng 10 đến 12: cạnh tranh mùa cao điểm, chi phí mỗi khách 1.150.000 đồng, còn 87 khách.
4. Tổng năm: khoảng 1.250 khách, chi phí trung bình 960.000 đồng mỗi khách.

Kênh Inbound - Nội dung, SEO, cộng đồng:

1. Tháng 1 đến 3: 100 triệu chi cho nhân sự nội dung và kỹ thuật, chỉ thu 20 khách. Chi phí mỗi khách 5.000.000 đồng, nhìn rất tệ.
2. Tháng 4 đến 9: bài viết bắt đầu lên hạng, thu 90 khách mỗi tháng. Chi phí mỗi khách 1.100.000 đồng.
3. Tháng 10 đến 12: kho nội dung đủ lớn, thu 210 khách mỗi tháng. Chi phí mỗi khách 475.000 đồng.
4. Tổng năm: khoảng 1.230 khách, chi phí trung bình 975.000 đồng mỗi khách.

#### Kết luận không nằm ở con số tổng

Sau 12 tháng, hai kênh cho tổng lượng khách gần bằng nhau. Điều khác biệt nằm ở **tháng thứ 13**:

* Outbound tháng 13: dừng chi thì về 0 khách. Chi phí mỗi khách vẫn đang tăng.
* Inbound tháng 13: kho nội dung vẫn chạy, chi phí mỗi khách tiếp tục giảm, và phần lớn lưu lượng không còn phụ thuộc giá thầu quảng cáo.

Đổi lại, Inbound có ba rủi ro thật sự phải nói rõ với Ban Giám Đốc: cần dòng tiền chịu lỗ 6 tháng đầu, phụ thuộc thuật toán tìm kiếm có thể thay đổi, và rất khó tăng tốc gấp khi cần doanh thu đột biến.`,
        takeaway: "Đừng hỏi kênh nào rẻ hơn. Hãy hỏi doanh nghiệp có đủ dòng tiền chịu lỗ 6 tháng đầu của Inbound hay không. Nếu không, Outbound là lựa chọn bắt buộc chứ không phải lựa chọn tối ưu."
      }
    ],
    quiz: [
      {
        id: "q2_1",
        question: "Phương thức nào dưới đây thuộc mô hình Inbound Marketing chuẩn chỉnh?",
        options: [
          "Bật quảng cáo Facebook Video Ads ngắt ngang trải nghiệm xem phim của người dùng",
          "Viết bài hướng dẫn chuyên sâu trên Website giải quyết nỗi đau của khách hàng và tối ưu Google SEO",
          "Thuê dịch vụ gọi điện Cold Call 1000 cuộc mỗi ngày theo danh sách số điện thoại mua ngoài",
          "Gửi Email hàng loạt không cá nhân hóa tới danh sách dữ liệu tự thu thập"
        ],
        correct: 1,
        explanation: "Bài viết chuẩn SEO giải quyết đúng nỗi đau là ví dụ điển hình của Inbound Marketing: Khách hàng chủ động tìm kiếm giải pháp và tìm thấy bài viết của bạn."
      },
      {
        id: "q2_2",
        question: "Nhược điểm lớn nhất nếu doanh nghiệp chỉ phụ thuộc hoàn toàn vào Outbound Paid Ads là gì?",
        options: [
          "Không thể chủ động kiểm soát số lượng đơn hàng trong ngày",
          "Giá thầu quảng cáo tăng theo thời gian và doanh thu dừng ngay lập tức khi tắt ngân sách quảng cáo",
          "Khách hàng không bao giờ nhấn vào quảng cáo hình ảnh",
          "Không thể đo lường chỉ số ROI của chiến dịch"
        ],
        correct: 1,
        explanation: "Outbound Paid Ads tạo sự phụ thuộc vào các nền tảng quảng cáo (Meta, Google, TikTok). Nếu không xây dựng được tài sản Inbound (SEO, Community, Data), doanh nghiệp sẽ kiệt sức khi CPM tăng."
      },
      {
        id: "q2_3",
        question: "Chiến thuật phối hợp 'Bánh đà Flywheel' hiệu quả nhất giữa Outbound Ads và Inbound Content là gì?",
        options: [
          "Dùng Outbound Ads để kéo traffic vào các bài viết Inbound giá trị cao, sau đó capture Lead và nuôi dưỡng",
          "Dừng toàn bộ quảng cáo trả phí và chỉ đợi bài viết tự lên top Google",
          "Chạy quảng cáo ép khách hàng mua hàng ngay tại trang landing page sơ sài",
          "Tạo nội dung Inbound nhưng giấu kín không cho ai truy cập"
        ],
        correct: 0,
        explanation: "Dùng Outbound Ads giúp phân phối nội dung Inbound đến đúng người nhanh hơn gấp 100 lần so với việc chờ đợi tự nhiên, từ đó kích hoạt bánh đà tăng trưởng."
      },
      {
        id: "q2_4",
        question: "Một startup còn đủ tiền hoạt động trong 8 tháng, cần chứng minh mô hình kinh doanh để gọi vốn vòng tiếp theo. Trưởng phòng nên ưu tiên kênh nào?",
        options: [
          "Dồn toàn bộ vào SEO và nội dung dài hạn vì chi phí mỗi khách rẻ hơn về sau",
          "Ưu tiên Outbound để có dữ liệu chuyển đổi nhanh trong 8 tháng, chỉ duy trì Inbound ở mức nền móng tối thiểu",
          "Chia đều 50-50 cho cả hai kênh trong suốt 8 tháng",
          "Ngừng toàn bộ marketing để tiết kiệm tiền cho tới khi gọi được vốn"
        ],
        correct: 1,
        explanation: "Inbound cần khoảng 6 tháng mới bắt đầu sinh kết quả, gần trùng với thời điểm startup hết tiền. Khi ràng buộc là dòng tiền và thời hạn, Outbound trở thành lựa chọn bắt buộc dù chi phí dài hạn kém hấp dẫn hơn."
      },
      {
        id: "q2_5",
        question: "Trong ví dụ 12 tháng, kênh Inbound có chi phí mỗi khách hàng tháng 1-3 lên tới 5.000.000 đồng. Cách diễn giải đúng của một Trưởng phòng là gì?",
        options: [
          "Kênh Inbound thất bại và cần dừng ngay lập tức",
          "Đây là giai đoạn đầu tư tạo tài sản, cần đo bằng chỉ số dẫn dắt như số từ khoá lên hạng và lưu lượng tự nhiên, chưa đo bằng chi phí mỗi khách",
          "Cần tăng gấp 3 ngân sách Inbound để kéo chi phí mỗi khách xuống ngay",
          "Nên chuyển toàn bộ ngân sách Inbound sang chạy quảng cáo tìm kiếm"
        ],
        correct: 1,
        explanation: "Giai đoạn đầu của Inbound là xây tài sản, chưa phải giai đoạn thu hoạch. Đo bằng chi phí mỗi khách ở tháng 1-3 là dùng sai thước đo. Chỉ số phù hợp là số từ khoá lên hạng, lưu lượng tự nhiên và tốc độ tăng trưởng của chúng."
      }
    ]
  },
  {
    id: "module-03",
    number: "03",
    title: "Digital Marketing Budget",
    subtitle: "Ngân sách Digital Marketing",
    description: "Giúp bạn hiểu được phương pháp phân bổ ngân sách Digital Marketing trong từng giai đoạn cụ thể của doanh nghiệp.",
    icon: "DollarSign",
    badge: "Quản Lý Tài Chính",
    duration: "60 phút",
    lessonsCount: 3,
    quizCount: 5,
    sections: [
      {
        id: "m3-s1",
        title: "1. Các phương pháp lập Ngân sách Marketing",
        content: `### 3 Phương pháp lập ngân sách phổ biến dành cho Trưởng phòng

1. Phương pháp Tỷ lệ % Doanh thu (Percentage of Sales): Thường chiếm từ 5% đến 15% tổng doanh thu dự kiến tùy ngành hàng. Phương pháp này an toàn tài chính nhưng mang tính bị động khi có cơ hội lớn.
2. Phương pháp Theo Đối thủ (Competitor Parity): Dựa trên chi tiêu ước tính của đối thủ cạnh tranh cùng phân khúc. Nhược điểm là dễ rơi vào cuộc chiến đốt tiền nếu tiềm lực tài chính không tương đồng.
3. Phương pháp Theo Mục tiêu & Nhiệm vụ (Objective & Task Method - Khuyên dùng): Tính toán bằng công thức Ngân sách = (Số khách hàng mục tiêu x Chi phí CAC dự kiến) + Chi phí vận hành cố định. Phương pháp này giúp giải trình minh bạch từng đồng ngân sách với Giám đốc Tài chính.`,
        takeaway: "Lập ngân sách theo Mục tiêu & Nhiệm vụ là vũ khí giúp Trưởng phòng bảo vệ kế hoạch trước Ban Giám Đốc."
      },
      {
        id: "m3-s2",
        title: "2. Quy tắc phân bổ 70/20/10 trong Digital",
        content: `### Quản trị rủi ro đầu tư kênh Digital

* 70% Ngân sách cho Kênh trụ cột (Core Channels): Dành cho các kênh đã chứng minh hiệu quả ổn định mang lại doanh thu hàng ngày như Meta Conversion Ads hoặc Google Search Ads.
* 20% Ngân sách cho Kênh tiềm năng (Emerging Channels): Dành cho các kênh đang phát triển nhanh có tiềm năng cao như TikTok Shop Live, Affiliate Marketing hoặc Booking KOC.
* 10% Ngân sách cho Kênh thử nghiệm (Experimental R&D): Dành cho các ý tưởng sáng tạo đột phá, công nghệ AI mới hoặc các hình thức tiếp thị mạo hiểm.`
      },
      {
        id: "m3-s3",
        title: "3. Chuyên sâu: Tính ngược ngân sách từ mục tiêu doanh thu",
        content: `### Cách bảo vệ con số ngân sách trước Ban Giám Đốc

Khi Giám Đốc hỏi vì sao cần 500 triệu mỗi tháng, câu trả lời không được phép là theo kinh nghiệm hoặc năm ngoái chi vậy. Trưởng phòng phải tính ngược từ mục tiêu doanh thu qua từng tầng phễu.

#### Công thức tính ngược

1. Từ **doanh thu mục tiêu** chia cho **giá trị đơn hàng trung bình** ra số đơn cần có.
2. Từ số đơn chia cho **tỷ lệ chốt của đội bán hàng** ra số khách hàng tiềm năng cần có.
3. Từ số khách tiềm năng nhân với **chi phí mỗi khách tiềm năng** ra ngân sách quảng cáo cần thiết.
4. Cộng thêm **chi phí vận hành** gồm nhân sự, công cụ, sản xuất nội dung.

#### Minh hoạ đầy đủ: Trung tâm Anh ngữ, mục tiêu 3 tỷ mỗi tháng

Số liệu giả định để minh hoạ quy trình tính.

1. Doanh thu mục tiêu 3.000.000.000 đồng. Học phí trung bình mỗi học viên 20.000.000 đồng.
2. Số hợp đồng cần có: 3 tỷ chia 20 triệu bằng **150 hợp đồng**.
3. Tỷ lệ chốt của đội tư vấn là 12%. Số khách tiềm năng cần: 150 chia 0,12 bằng **1.250 khách**.
4. Nhưng chỉ 60% khách để lại thông tin là liên hệ được. Số khách thô cần: 1.250 chia 0,6 bằng **2.084 khách**.
5. Chi phí mỗi khách thô hiện tại 180.000 đồng. Ngân sách quảng cáo: 2.084 nhân 180.000 bằng **375 triệu đồng**.
6. Chi phí vận hành: nhân sự 90 triệu, công cụ 15 triệu, sản xuất nội dung 30 triệu, bằng **135 triệu**.
7. Tổng ngân sách đề xuất: **510 triệu đồng**, chiếm 17% doanh thu mục tiêu.

#### Ba điểm phải kiểm tra trước khi trình

* **Tỷ lệ ngân sách trên doanh thu** có nằm trong khung của ngành không. Nếu ngành thường ở mức 10-15% mà bạn đề xuất 17%, phải giải thích được lý do, ví dụ đang giai đoạn mở rộng thị trường mới.
* **Biên lợi nhuận gộp** có gánh nổi không. Nếu biên gộp chỉ 25% mà chi 17% cho marketing thì phần còn lại cho vận hành và lợi nhuận chỉ còn 8%, quá mỏng.
* **Điểm nghẽn nằm ở đâu**. Trong ví dụ trên, tỷ lệ chốt 12% và tỷ lệ liên hệ được 60% là hai con số đáng ngờ. Nếu nâng tỷ lệ liên hệ từ 60% lên 75%, số khách thô cần giảm còn 1.667, ngân sách quảng cáo giảm xuống 300 triệu, tiết kiệm 75 triệu mỗi tháng mà không cần đụng tới quảng cáo.

#### Đòn bẩy mạnh nhất thường không nằm ở quảng cáo

So sánh hai cách để giảm chi phí:

* Giảm chi phí mỗi khách thô từ 180.000 xuống 160.000 đồng, tức tối ưu quảng cáo 11%: tiết kiệm khoảng 42 triệu.
* Nâng tỷ lệ chốt từ 12% lên 14%, tức đào tạo lại đội tư vấn: số khách cần giảm còn 1.786, tiết kiệm khoảng 54 triệu.

Trưởng phòng giỏi luôn kiểm tra tầng dưới phễu trước khi xin thêm tiền cho tầng trên.`,
        takeaway: "Ngân sách phải được tính ngược qua từng tầng phễu và trình kèm giả định. Khi bị chất vấn, bạn bảo vệ giả định chứ không bảo vệ con số tổng."
      }
    ],
    quiz: [
      {
        id: "q3_1",
        question: "Mục tiêu năm tới của bạn là mang về 1.000 khách hàng mới. Biết rằng chi phí trung bình để thu hút 1 khách hàng (CAC) của ngành là 500.000 VNĐ. Theo phương pháp Objective & Task, ngân sách chạy Ads tối thiểu cần lập là bao nhiêu?",
        options: [
          "50.000.000 VNĐ",
          "500.000.000 VNĐ",
          "5.000.000.000 VNĐ",
          "Tùy hứng chi trả theo từng tháng"
        ],
        correct: 1,
        explanation: "Ngân sách Ads = 1.000 khách hàng x 500.000 VNĐ = 500.000.000 VNĐ (Chưa bao gồm chi phí nhân sự và vận hành sản xuất nội dung)."
      },
      {
        id: "q3_2",
        question: "Quy tắc phân bổ ngân sách 70/20/10 khuyên Trưởng phòng điều hướng 10% ngân sách vào đâu?",
        options: [
          "Thưởng cho nhân sự xuất sắc cuối năm",
          "Thử nghiệm các kênh mới, ý tưởng sáng tạo đột phá hoặc công nghệ AI Marketing mới",
          "Trả toàn bộ chi phí thuê văn phòng",
          "Dồn hết vào chạy lại các mẫu quảng cáo từ năm ngoái"
        ],
        correct: 1,
        explanation: "10% ngân sách R&D giúp doanh nghiệp luôn đi trước đối thủ, thử nghiệm các kênh mới mà không làm ảnh hưởng tới KPI chỉ số chính của 70% kênh cốt lõi."
      },
      {
        id: "q3_3",
        question: "Khi biên lợi nhuận gộp của sản phẩm là 40%, giá bán 1.000.000 VNĐ. Điểm hòa vốn chi phí quảng cáo tối đa trên 1 đơn hàng (Max CPA) là bao nhiêu?",
        options: [
          "100.000 VNĐ",
          "400.000 VNĐ",
          "600.000 VNĐ",
          "1.000.000 VNĐ"
        ],
        correct: 1,
        explanation: "Lợi nhuận gộp = 1.000.000 x 40% = 400.000 VNĐ. Nếu chi phí thu hút đơn hàng CPA vượt quá 400.000 VNĐ, chiến dịch quảng cáo sẽ bị lỗ trực tiếp trên mỗi sản phẩm."
      },
      {
        id: "q3_4",
        question: "Mục tiêu doanh thu 2 tỷ, giá trị đơn trung bình 10 triệu, tỷ lệ chốt 20%, chi phí mỗi khách tiềm năng 250.000 đồng. Ngân sách quảng cáo cần bao nhiêu?",
        options: [
          "50 triệu đồng",
          "250 triệu đồng",
          "125 triệu đồng",
          "500 triệu đồng"
        ],
        correct: 1,
        explanation: "Số đơn cần: 2 tỷ chia 10 triệu bằng 200 đơn. Số khách tiềm năng: 200 chia 0,2 bằng 1.000 khách. Ngân sách: 1.000 nhân 250.000 bằng 250 triệu đồng."
      },
      {
        id: "q3_5",
        question: "Ngân sách đang bị vượt trần cho phép. Đội tư vấn có tỷ lệ chốt 8%, thấp hơn mức 15% của ngành. Hành động ưu tiên của Trưởng phòng là gì?",
        options: [
          "Xin thêm ngân sách quảng cáo để bù vào lượng khách bị mất",
          "Tập trung nâng tỷ lệ chốt của đội tư vấn trước, vì cải thiện ở tầng dưới phễu làm giảm số khách cần mua và giảm ngân sách mà không cần đụng tới quảng cáo",
          "Giảm giá bán 30% để dễ chốt hơn",
          "Đổi toàn bộ kênh quảng cáo sang nền tảng mới có chi phí rẻ hơn"
        ],
        correct: 1,
        explanation: "Tỷ lệ chốt 8% so với chuẩn ngành 15% cho thấy điểm nghẽn nằm ở tầng dưới phễu. Nâng tỷ lệ chốt làm giảm số khách tiềm năng cần mua, kéo ngân sách xuống theo cấp số nhân, hiệu quả hơn nhiều so với tối ưu giá thầu quảng cáo."
      }
    ]
  },
  {
    id: "module-04",
    number: "04",
    title: "Digital Marketing Staff",
    subtitle: "Nhân sự Digital Marketing",
    description: "Hiểu rõ cấu trúc bộ phận Digital Marketing trong doanh nghiệp, các vị trí nhân sự triển khai, cách thức tổ chức và quản lý thuê ngoài.",
    icon: "Users",
    badge: "Tổ Chức Bộ Máy",
    duration: "55 phút",
    lessonsCount: 3,
    quizCount: 5,
    sections: [
      {
        id: "m4-s1",
        title: "1. Sơ đồ tổ chức phòng Digital Marketing thực chiến",
        content: `### Xây dựng bộ máy nhân sự theo quy mô doanh nghiệp

#### 1. Quy mô vừa và nhỏ (SME 3-5 nhân sự):
* Digital Manager: Quản trị chiến lược, phân bổ ngân sách và làm chủ OKRs.
* Performance Specialist: Chuyên trách tối ưu thầu quảng cáo Meta, Google và TikTok.
* Content & Graphic Executive: Sáng tạo bài viết, thiết kế banner và video ngắn TikTok.
* Outsource & Freelancer: Thuê bên ngoài dựng Video chuyên nghiệp và làm Website khi cần.

#### 2. Quy mô mở rộng (Scale-up 8-15 nhân sự):
* Leader Performance Team: Quản lý Media Buying, A/B Testing và dữ liệu CRM.
* Leader Content & Creative Team: Quản lý Copywriter, Video Editor và Graphic Designer.
* Leader SEO & Organic Growth: Phát triển traffic tự nhiên và cộng đồng Social.
* MarTech & Analytics Specialist: Quản lý hạ tầng dữ liệu GA4, CDP và Tracking Pixels.`
      },
      {
        id: "m4-s2",
        title: "2. Chiến lược In-house vs Agency Outsource",
        content: `### Nguyên tắc phân định: Giữ gì In-house và Thuê gì Agency?

* Giữ In-house: Dữ liệu khách hàng CRM, chiến lược thương hiệu cốt lõi, cơ chế giá bán và các kênh quảng cáo tạo ra doanh thu hàng ngày.
* Thuê Outsource / Agency: Các chiến dịch truyền thông lớn theo mùa vụ, dịch vụ sản xuất Video TVC hoành tráng, booking mạng lưới KOL/KOC quy mô lớn hoặc thử nghiệm kênh công nghệ mới chưa có nhân sự nội bộ am hiểu.`
      },
      {
        id: "m4-s3",
        title: "3. Chuyên sâu: Định biên nhân sự và chi phí đội ngũ theo quy mô",
        content: `### Bao nhiêu người là đủ cho ngân sách của bạn

Câu hỏi tuyển thêm người hay thuê Agency không trả lời được bằng cảm tính. Có một chỉ số neo rất hữu dụng: **ngân sách quảng cáo mà một nhân sự vận hành được**.

Khi một người phải gánh quá nhiều ngân sách, họ chỉ còn thời gian giữ cho chiến dịch chạy chứ không còn thời gian tối ưu. Khi gánh quá ít, chi phí nhân sự ăn mòn hiệu quả.

#### Khung định biên tham chiếu

Các mức dưới đây là khung tham chiếu để bạn tự hiệu chỉnh theo ngành, không phải chuẩn tuyệt đối.

1. **Dưới 100 triệu/tháng**: 1 người kiêm nhiệm chạy quảng cáo và nội dung, thuê ngoài phần thiết kế. Chưa đủ quy mô để lập phòng.
2. **100 đến 400 triệu/tháng**: 1 chuyên viên quảng cáo, 1 chuyên viên nội dung, 1 thiết kế bán thời gian. Trưởng phòng vẫn trực tiếp làm chuyên môn.
3. **400 triệu đến 1 tỷ/tháng**: tách vai trò rõ ràng gồm quảng cáo, nội dung, thiết kế, dữ liệu và tối ưu chuyển đổi. Trưởng phòng chuyển sang vai trò điều phối.
4. **Trên 1 tỷ/tháng**: chia theo kênh hoặc theo dòng sản phẩm, mỗi nhóm có trưởng nhóm riêng, bổ sung vai trò phân tích dữ liệu chuyên trách.

#### Minh hoạ: bài toán tuyển thêm hay thuê Agency

Bối cảnh giả định: doanh nghiệp chi 600 triệu quảng cáo mỗi tháng, hiện có 2 nhân sự, chỉ số ROAS đang là 3,0 lần.

Phương án A - Tuyển thêm 1 chuyên viên tối ưu:

* Chi phí: lương và bảo hiểm khoảng 25 triệu mỗi tháng.
* Kỳ vọng: có người chuyên trách kiểm định mẫu quảng cáo và tối ưu trang đích, ROAS tăng từ 3,0 lên 3,3 lần.
* Doanh thu tăng thêm: 600 triệu nhân 0,3 bằng **180 triệu**.
* Lợi ích ròng: 180 triệu trừ 25 triệu bằng **155 triệu mỗi tháng**.
* Rủi ro: mất 2 đến 3 tháng tuyển và đào tạo mới có kết quả.

Phương án B - Thuê Agency ăn theo phần trăm ngân sách:

* Chi phí: 15% của 600 triệu bằng **90 triệu mỗi tháng**.
* Kỳ vọng: có kinh nghiệm sẵn, ROAS tăng lên 3,4 lần trong vòng 1 tháng.
* Doanh thu tăng thêm: 600 triệu nhân 0,4 bằng **240 triệu**.
* Lợi ích ròng: 240 triệu trừ 90 triệu bằng **150 triệu mỗi tháng**.
* Rủi ro: kiến thức về tài khoản và dữ liệu nằm ở bên ngoài, chi phí tăng tuyến tính theo ngân sách.

#### Đọc kết quả cho đúng

Hai phương án cho lợi ích ròng gần bằng nhau ở tháng đầu, nhưng khác hẳn về sau:

* Khi ngân sách tăng lên 1,2 tỷ, phí Agency thành 180 triệu còn lương nhân sự vẫn 25 triệu. **Chi phí Agency tăng tuyến tính, chi phí nhân sự thì không.**
* Ngược lại, khi doanh nghiệp cần tăng tốc gấp trong 1 tháng hoặc thử một kênh hoàn toàn mới, Agency thắng vì không mất thời gian tuyển.

Nguyên tắc thực dụng: **thuê ngoài phần biến động và mùa vụ, giữ trong nhà phần lặp lại hàng ngày và phần chạm vào dữ liệu khách hàng.**`,
        takeaway: "So sánh tuyển người hay thuê Agency phải quy về lợi ích ròng theo tháng và xét thêm độ dốc chi phí khi ngân sách tăng gấp đôi."
      }
    ],
    quiz: [
      {
        id: "q4_1",
        question: "Dữ liệu nào dưới đây Trưởng phòng Digital Marketing BẮT BUỘC phải giữ và quản lý In-house, tuyệt đối không phụ thuộc hoàn toàn vào Agency?",
        options: [
          "File thiết kế banner quảng cáo khuyến mãi",
          "Dữ liệu khách hàng (Customer Database/CRM), pixel tài khoản quảng cáo chính và dữ liệu chuyển đổi",
          "Kịch bản các clip hài hước trên TikTok",
          "Danh sách bài báo PR đã từng đăng"
        ],
        correct: 1,
        explanation: "Customer Data và Tracking Pixels là tài sản vô giá của doanh nghiệp. Nếu phụ thuộc vào tài khoản của Agency, khi chấm dứt hợp đồng doanh nghiệp sẽ mất toàn bộ tệp data đối tượng đã học."
      },
      {
        id: "q4_2",
        question: "Khi nào doanh nghiệp nên quyết định thuê ngoài (Outsource) một đơn vị Agency triển khai?",
        options: [
          "Khi cần sản xuất 1 chiến dịch Video hoành tráng đòi hỏi thiết bị sản xuất đắt tiền mà team nội bộ không sở hữu",
          "Khi muốn sa thải toàn bộ nhân sự Marketing trong công ty",
          "Khi muốn Agency chịu trách nhiệm thay cho chiến lược kinh doanh sai lầm của Giám đốc",
          "Khi không muốn tốn chi phí duyệt bài viết hàng ngày"
        ],
        correct: 0,
        explanation: "Các chiến dịch lớn đòi hỏi năng lực sản xuất chuyên sâu (Production House, KOL Booking quy mô lớn) thuê Agency sẽ tiết kiệm hơn rất nhiều so với tự mua sắm thiết bị và nuôi team."
      },
      {
        id: "q4_3",
        question: "Công cụ quản trị nào giúp phân định rõ trách nhiệm của từng nhân sự trong phòng Digital Marketing (Ví dụ: Ai là người Làm, Ai duyệt, Ai tư vấn, Ai nhận thông báo)?",
        options: [
          "Ma trận RACI (Responsible, Accountable, Consulted, Informed)",
          "Bảng báo cáo tài chính hàng tháng",
          "Phần mềm thiết kế Canva",
          "Bản đồ nhiệt Heatmap"
        ],
        correct: 0,
        explanation: "Ma trận RACI là công cụ quản trị kinh điển giúp phân định minh bạch vai trò trách nhiệm của từng vị trí trong dự án Marketing, tránh chồng chéo hoặc bỏ sót công việc."
      },
      {
        id: "q4_4",
        question: "Doanh nghiệp dự kiến tăng ngân sách quảng cáo từ 600 triệu lên 1,5 tỷ mỗi tháng trong 12 tháng tới. Đang phân vân giữa tuyển 2 nhân sự hoặc thuê Agency ăn 15% ngân sách. Yếu tố quyết định là gì?",
        options: [
          "Agency luôn tốt hơn vì có nhiều kinh nghiệm ngành",
          "Chi phí Agency tăng tuyến tính theo ngân sách nên ở mức 1,5 tỷ sẽ thành 225 triệu mỗi tháng, trong khi lương 2 nhân sự gần như không đổi, do đó nên chuyển dần về in-house",
          "Nhân sự in-house luôn rẻ hơn trong mọi trường hợp",
          "Nên giữ nguyên ngân sách 600 triệu để khỏi phải quyết định"
        ],
        correct: 1,
        explanation: "Điểm mấu chốt là độ dốc chi phí. Mô hình ăn phần trăm ngân sách khiến chi phí Agency tăng theo quy mô, còn chi phí nhân sự cố định. Khi ngân sách được dự báo tăng mạnh và ổn định, in-house trở nên có lợi."
      },
      {
        id: "q4_5",
        question: "Theo nguyên tắc phân chia in-house và thuê ngoài, đầu việc nào bắt buộc phải giữ trong nhà?",
        options: [
          "Sản xuất video quảng cáo quy mô lớn cho chiến dịch Tết",
          "Quản trị dữ liệu khách hàng trên CRM và quyền quản trị tài khoản quảng cáo",
          "Thiết kế ấn phẩm truyền thông cho sự kiện thường niên",
          "Đặt bài trên các trang báo điện tử"
        ],
        correct: 1,
        explanation: "Dữ liệu khách hàng và quyền quản trị tài khoản là tài sản cốt lõi. Giao ra ngoài sẽ khiến doanh nghiệp mất kiểm soát và bị phụ thuộc khi đổi đối tác. Các hạng mục mùa vụ và sản xuất quy mô lớn thì phù hợp để thuê ngoài."
      }
    ]
  },
  {
    id: "module-05",
    number: "05",
    title: "Digital Marketing Research",
    subtitle: "Nghiên cứu Digital Marketing",
    description: "Cập nhật về các công cụ nghiên cứu thị trường, khách hàng, đối thủ như: Keywordtool, Bigspy, Buzzsumo, Ahrefs, Tiktok Creative Center.",
    icon: "Search",
    badge: "Công Cụ Nghiên Cứu",
    duration: "65 phút",
    lessonsCount: 4,
    quizCount: 5,
    sections: [
      {
        id: "m5-s1",
        title: "1. Bộ 5 Công cụ Nghiên cứu Thị trường Đỉnh cao",
        content: `### Hướng dẫn sử dụng vũ khí dữ liệu cho Digital Manager

1. Ahrefs và SEMrush: Soi cấu trúc Traffic đối thủ, biết rõ đối thủ đang đứng Top từ khóa nào và nguồn Backlink đến từ đâu để phát hiện khoảng trống thị trường (Content Gap).
2. TikTok Creative Center: Tra cứu kho quảng cáo chạy hiệu quả nhất (Top Ads) trên TikTok theo từng ngành hàng để học tập cấu trúc Hook 3s đầu và xu hướng nhạc trending.
3. BigSpy và Meta Ad Library: Soi toàn bộ các mẫu quảng cáo đang bật chạy của đối thủ trên Facebook và Instagram để đánh giá thông điệp và ưu đãi cạnh tranh.
4. KeywordTool.io: Đọc vị chính xác nhu cầu tìm kiếm thực tế của khách hàng trên Google, Shopee và YouTube thông qua các từ khóa dài.
5. BuzzSumo: Tìm kiếm các bài viết và chủ đề thu hút lượt chia sẻ cao nhất trên mạng xã hội để xây dựng tuyến bài Viral.`
      },
      {
        id: "m5-s2",
        title: "2. Nghiên cứu Định lượng và Định tính: dùng cái nào khi nào",
        content: `### Hai loại câu hỏi khác nhau cần hai loại nghiên cứu khác nhau

Nhầm lẫn phổ biến nhất là dùng khảo sát số đông để trả lời câu hỏi về động cơ, hoặc dùng vài buổi phỏng vấn để kết luận về quy mô thị trường.

#### Nghiên cứu Định lượng - trả lời câu hỏi Bao nhiêu

* Dùng khi cần đo quy mô, tỷ lệ, xu hướng, mức độ phổ biến.
* Công cụ: khảo sát trực tuyến, dữ liệu Google Trends, số liệu bán hàng, công cụ nghiên cứu từ khoá.
* Cỡ mẫu tối thiểu để có ý nghĩa thường từ 200 đến 400 phản hồi cho một phân khúc.
* Kết quả cho ra số phần trăm và có thể đưa vào báo cáo trình Ban Giám Đốc.

#### Nghiên cứu Định tính - trả lời câu hỏi Vì sao

* Dùng khi cần hiểu động cơ, rào cản tâm lý, ngôn ngữ khách hàng dùng để mô tả vấn đề.
* Công cụ: phỏng vấn sâu, thảo luận nhóm, đọc bình luận và đánh giá sản phẩm, nghe lại ghi âm cuộc gọi tư vấn.
* Chỉ cần 8 đến 12 cuộc phỏng vấn là các chủ đề bắt đầu lặp lại, đủ để rút ra kết luận.
* Kết quả cho ra câu nói nguyên văn của khách hàng, dùng trực tiếp làm nội dung quảng cáo.

#### Trình tự đúng: Định tính trước, Định lượng sau

1. Phỏng vấn sâu 10 khách hàng để phát hiện các giả thuyết về động cơ mua.
2. Đưa các giả thuyết đó thành câu hỏi trong bảng khảo sát.
3. Khảo sát 300 người để biết giả thuyết nào chiếm tỷ lệ lớn nhất.
4. Dồn ngân sách vào thông điệp gắn với giả thuyết thắng cuộc.

Làm ngược lại sẽ dẫn tới bảng khảo sát chỉ chứa các lựa chọn do người làm marketing tự nghĩ ra, bỏ sót đúng lý do thật của khách hàng.`,
        takeaway: "Định tính tìm ra giả thuyết, Định lượng xác nhận giả thuyết nào lớn nhất. Bỏ qua bước định tính thì bảng khảo sát chỉ phản chiếu định kiến của chính bạn."
      },
      {
        id: "m5-s3",
        title: "3. Phân tích đối thủ theo 3 lớp",
        content: `### Đừng chỉ nhìn đối thủ đang chạy quảng cáo gì

Phân tích đối thủ hời hợt dừng ở việc chụp màn hình quảng cáo của họ. Phân tích có chiều sâu đi theo ba lớp từ ngoài vào trong.

#### Lớp 1 - Lớp hiển thị: họ đang nói gì

* Thư viện quảng cáo Meta cho biết đối thủ đang chạy bao nhiêu mẫu, mẫu nào chạy lâu nhất.
* Mẫu quảng cáo chạy liên tục trên 30 ngày gần như chắc chắn đang có hiệu quả. Đây là tín hiệu đáng tin hơn mọi lời đồn trong ngành.
* Ghi lại: thông điệp chính, ưu đãi, định dạng, và nhóm khách hàng mà hình ảnh nhắm tới.

#### Lớp 2 - Lớp cấu trúc: họ đang bán thế nào

* Đi hết hành trình mua của đối thủ với vai một khách hàng thật: bấm quảng cáo, để lại số, chờ tư vấn gọi lại.
* Ghi lại: bao lâu thì được gọi, kịch bản tư vấn ra sao, ưu đãi nào được đưa ra khi bạn từ chối, chuỗi tin nhắn chăm sóc sau đó kéo dài mấy ngày.
* Đây là lớp mà 90% đối thủ không ngờ bị soi, và cũng là nơi lộ ra điểm yếu dễ tấn công nhất.

#### Lớp 3 - Lớp kinh tế: họ chịu được mức chi phí nào

* Ước lượng giá bán, tần suất mua lại và biên lợi nhuận gộp của đối thủ.
* Doanh nghiệp có giá trị trọn đời khách hàng cao hơn luôn đủ sức trả giá thầu cao hơn bạn cho cùng một khách hàng.
* Nếu đối thủ bán gói 12 tháng còn bạn bán lẻ từng tháng, bạn sẽ luôn thua trong cuộc đua giá thầu, và cách thắng không nằm ở tối ưu quảng cáo mà nằm ở thiết kế lại gói sản phẩm.

#### Kết luận rút ra phải là hành động

Một bản phân tích đối thủ tốt luôn kết thúc bằng ba câu: chỗ nào họ mạnh mà ta nên tránh đối đầu trực diện, chỗ nào họ bỏ trống mà ta chiếm được, và chỗ nào họ yếu mà ta tấn công được ngay trong 30 ngày.`,
        takeaway: "Mẫu quảng cáo của đối thủ chạy liên tục trên 30 ngày là bằng chứng đáng tin nhất về việc thông điệp đó đang mang lại hiệu quả."
      },
      {
        id: "m5-s4",
        title: "4. Chuyên sâu: Tính dung lượng thị trường TAM - SAM - SOM",
        content: `### Ba vòng tròn quyết định mục tiêu có khả thi hay không

Trước khi cam kết một con số doanh thu với Ban Giám Đốc, Trưởng phòng phải kiểm tra thị trường có đủ lớn để chứa mục tiêu đó không.

* **TAM - Tổng thị trường**: toàn bộ nhu cầu nếu mọi khách hàng có thể đều mua sản phẩm loại này.
* **SAM - Thị trường phục vụ được**: phần TAM mà sản phẩm, giá bán và địa bàn của bạn thực sự với tới.
* **SOM - Thị phần giành được**: phần SAM mà bạn có thể chiếm trong 12 tháng, căn cứ vào năng lực và ngân sách thật.

#### Minh hoạ đầy đủ: Dịch vụ kế toán cho hộ kinh doanh tại Thành phố Hồ Chí Minh

Số liệu giả định để minh hoạ cách tính, khi làm thật bạn cần thay bằng dữ liệu từ Tổng cục Thống kê và khảo sát riêng.

Bước 1 - Tính TAM:

1. Số hộ kinh doanh cá thể trên địa bàn: giả định 280.000 hộ.
2. Phí dịch vụ kế toán trung bình: 1.500.000 đồng mỗi tháng, tức 18.000.000 đồng mỗi năm.
3. TAM bằng 280.000 nhân 18 triệu bằng **5.040 tỷ đồng mỗi năm**.

Bước 2 - Thu hẹp thành SAM:

1. Chỉ những hộ có doanh thu đủ lớn để cần kế toán thuê ngoài, ước tính 35%: còn 98.000 hộ.
2. Trong đó chỉ những hộ sẵn sàng dùng dịch vụ trực tuyến thay vì kế toán quen biết, ước tính 40%: còn **39.200 hộ**.
3. SAM bằng 39.200 nhân 18 triệu bằng **705 tỷ đồng mỗi năm**.

Bước 3 - Ước lượng SOM thực tế:

1. Ngân sách marketing cả năm: 3 tỷ đồng.
2. Chi phí thu hút một khách hàng hiện tại: 2.500.000 đồng.
3. Số khách có thể giành được: 3 tỷ chia 2,5 triệu bằng **1.200 khách**.
4. SOM bằng 1.200 nhân 18 triệu bằng **21,6 tỷ đồng**, tương đương **3,1% của SAM**.

#### Dùng con số này để làm gì

* Nếu Ban Giám Đốc giao mục tiêu 60 tỷ, tức 8,5% SAM ngay năm đầu, bạn có cơ sở định lượng để nói rằng mục tiêu này cần ngân sách gấp gần 3 lần hoặc phải giảm chi phí thu hút khách xuống dưới 900.000 đồng.
* Nếu SOM chỉ đạt dưới 1% SAM, vấn đề không nằm ở thị trường mà nằm ở chi phí thu hút khách quá cao.
* Nếu SAM quá nhỏ so với TAM, hãy xem lại rào cản đang thu hẹp thị trường. Trong ví dụ trên, rào cản lớn nhất là thói quen dùng kế toán quen biết, và đó chính là chủ đề mà nội dung marketing phải giải quyết.`,
        takeaway: "SOM không phải con số mơ ước mà là kết quả chia ngân sách cho chi phí thu hút khách. Đây là công cụ mạnh nhất để thương lượng lại một mục tiêu phi thực tế."
      }
    ],
    quiz: [
      {
        id: "q5_1",
        question: "Bạn muốn xem các mẫu quảng cáo Video Ads nào đang có tỷ lệ giữ chân xem cao nhất thuộc ngành Mỹ phẩm trên TikTok tại Việt Nam. Công cụ nào cung cấp dữ liệu này chính xác và hoàn toàn miễn phí?",
        options: [
          "TikTok Creative Center (Top Ads / Trends)",
          "Google Analytics 4",
          "Canva Pro",
          "Facebook Business Suite"
        ],
        correct: 0,
        explanation: "TikTok Creative Center cung cấp kho dữ liệu minh bạch về các mẫu quảng cáo hiệu quả nhất trên TikTok theo từng quốc gia và ngành hàng."
      },
      {
        id: "q5_2",
        question: "Công cụ Meta Ad Library (Thư viện quảng cáo Facebook) cho phép Trưởng phòng khám phá thông tin gì của đối thủ?",
        options: [
          "Số tiền chính xác đối thủ nợ thẻ quảng cáo Facebook",
          "Toàn bộ các mẫu quảng cáo (Hình ảnh, Video, Text) mà Fanpage đối thủ đang bật chạy",
          "Danh sách sđt cá nhân của những người đã bấm mua hàng của đối thủ",
          "Mật khẩu truy cập tài khoản Business Manager của đối thủ"
        ],
        correct: 1,
        explanation: "Meta Ad Library cho phép xem công khai toàn bộ các mẫu quảng cáo đang hoạt động của bất kỳ Page nào nhằm đảm bảo tính minh bạch."
      },
      {
        id: "q5_3",
        question: "Khi nghiên cứu từ khóa trên Ahrefs, chỉ số Keyword Difficulty (KD) đại diện cho điều gì?",
        options: [
          "Độ khó và mức độ cạnh tranh để đưa từ khóa đó lên vị trí Top Google",
          "Số lượng nhân sự cần thiết để viết bài",
          "Giá tiền để mua từ khóa đó từ nhà mạng",
          "Số lần từ khóa đó bị gõ sai chính tả"
        ],
        correct: 0,
        explanation: "KD (Keyword Difficulty) đo lường độ khó SEO. KD càng cao nghĩa là các trang web đang giữ Top có độ uy tín và lượng backlink rất mạnh."
      },
      {
        id: "q5_4",
        question: "Bạn cần biết vì sao khách hàng bỏ giỏ hàng ở bước thanh toán. Phương pháp nghiên cứu phù hợp nhất là gì?",
        options: [
          "Khảo sát trực tuyến 500 người với các lựa chọn có sẵn về lý do bỏ giỏ",
          "Phỏng vấn sâu 8-12 khách hàng đã bỏ giỏ để tìm ra động cơ và rào cản thật, sau đó mới đưa vào khảo sát diện rộng để đo tỷ lệ",
          "Xem báo cáo Google Analytics về tỷ lệ thoát trang",
          "Hỏi ý kiến đội ngũ bán hàng nội bộ"
        ],
        correct: 1,
        explanation: "Câu hỏi Vì sao thuộc về nghiên cứu định tính. Khảo sát diện rộng với lựa chọn có sẵn chỉ phản chiếu các giả thuyết mà người làm marketing tự nghĩ ra, dễ bỏ sót lý do thật. Trình tự đúng là định tính tìm giả thuyết rồi định lượng xác nhận."
      },
      {
        id: "q5_5",
        question: "Ngân sách marketing cả năm 5 tỷ, chi phí thu hút một khách hàng là 2 triệu đồng, giá trị hợp đồng trung bình 25 triệu đồng mỗi năm. SOM của bạn là bao nhiêu?",
        options: [
          "12,5 tỷ đồng",
          "62,5 tỷ đồng",
          "125 tỷ đồng",
          "5 tỷ đồng"
        ],
        correct: 1,
        explanation: "Số khách giành được: 5 tỷ chia 2 triệu bằng 2.500 khách. SOM bằng 2.500 nhân 25 triệu bằng 62,5 tỷ đồng. SOM luôn được tính ngược từ ngân sách và chi phí thu hút khách, không phải từ mong muốn."
      }
    ]
  },
  {
    id: "module-06",
    number: "06",
    title: "Understanding Target Customers",
    subtitle: "Thấu hiểu khách hàng mục tiêu",
    description: "Phân tích chân dung khách hàng/customer persona, lý do mua/reason to buy, nhu cầu tiềm ẩn/customer insight, hành trình/customer journey.",
    icon: "Heart",
    badge: "Thấu Hiểu Khách Hàng",
    duration: "60 phút",
    lessonsCount: 3,
    quizCount: 5,
    sections: [
      {
        id: "m6-s1",
        title: "1. Phương pháp xây dựng Customer Persona 360",
        content: `### Chân dung khách hàng không chỉ là thông tin nhân khẩu học

Một bản chân dung khách hàng thực chiến cần trả lời 4 tầng chiều sâu tâm lý:

1. Nhân khẩu học (Demographics): Độ tuổi, giới tính, mức thu nhập, khu vực sinh sống và nghề nghiệp.
2. Nỗi đau thầm kín (Pain Points): Những rắc rối khiến họ khó chịu với các sản pháp hiện có trên thị trường.
3. Kỳ vọng mong ước (Desired Outcomes): Hình mẫu bản thân mà họ muốn hướng tới sau khi trải nghiệm sản phẩm của bạn.
4. Thói quen số (Media Habits): Kênh mạng xã hội họ lướt hàng ngày, khung giờ online và nguồn thông tin họ tin tưởng.`
      },
      {
        id: "m6-s2",
        title: "2. Mô hình đào sâu Customer Insight (Truth - Need - Friction)",
        content: `### Khai quật sự thật ngầm hiểu khách hàng

Customer Insight là điểm giao thoa giữa Sự thật đời sống (Truth), Nhu cầu thầm kín (Need) và Rào cản trăn trở (Friction).

Ví dụ ngành học tiếng Anh cho người đi làm:
* Truth: Phải họp hàng ngày với đồng nghiệp nước ngoài.
* Need: Muốn thăng tiến lên vị trí Quản lý với mức lương cao hơn.
* Friction: Rất sợ bị phát âm sai và ngượng ngùng trước mặt người khác.
* Insight thực sự: Tôi không ngại học, tôi chỉ cần một giải pháp luyện nói 1-1 riêng tư để không bị ai đánh giá khi nói sai.`
      },
      {
        id: "m6-s3",
        title: "3. Chuyên sâu: Phân khúc RFM và minh hoạ chấm điểm khách hàng",
        content: `### Không phải khách hàng nào cũng đáng nhận cùng một ngân sách

Mô hình **RFM** phân loại khách hàng đã mua dựa trên ba chiều đo, giúp Trưởng phòng biết nên dồn tiền chăm sóc ai và nên buông ai.

* **R - Recency**: lần mua gần nhất cách đây bao lâu. Càng gần càng tốt.
* **F - Frequency**: đã mua bao nhiêu lần trong kỳ. Càng nhiều càng tốt.
* **M - Monetary**: tổng số tiền đã chi. Càng lớn càng tốt.

Mỗi chiều chấm từ 1 đến 5 điểm bằng cách chia toàn bộ tệp khách hàng thành 5 nhóm đều nhau theo chiều đó.

#### Minh hoạ chấm điểm: Cửa hàng mỹ phẩm, dữ liệu 12 tháng

Số liệu giả định cho 4 khách hàng tiêu biểu.

1. **Khách A**: mua lần cuối 5 ngày trước, 9 đơn trong năm, tổng chi 24 triệu. Điểm RFM là 5-5-5, tổng 15.
2. **Khách B**: mua lần cuối 210 ngày trước, 11 đơn trong năm, tổng chi 31 triệu. Điểm RFM là 1-5-5, tổng 11.
3. **Khách C**: mua lần cuối 8 ngày trước, 1 đơn duy nhất, tổng chi 900 nghìn. Điểm RFM là 5-1-1, tổng 7.
4. **Khách D**: mua lần cuối 300 ngày trước, 1 đơn, tổng chi 600 nghìn. Điểm RFM là 1-1-1, tổng 3.

#### Hành động khác nhau cho từng nhóm

* **Khách A - Khách trung thành, điểm 555**: đừng tốn tiền quảng cáo bám đuổi. Họ đã mua rồi. Hãy dành cho họ chương trình giới thiệu bạn bè và quyền mua trước sản phẩm mới.
* **Khách B - Khách giá trị cao đang rời bỏ, điểm 1-5-5**: đây là nhóm **đáng chi tiền nhất**. Họ từng chi 31 triệu, chỉ là gần đây không quay lại. Chi phí kéo họ trở lại thấp hơn nhiều so với tìm một khách mới tương đương. Dùng tin nhắn cá nhân hoá kèm ưu đãi mạnh.
* **Khách C - Khách mới**: mục tiêu là đẩy họ mua đơn thứ hai. Chuỗi email hoặc Zalo chăm sóc trong 30 ngày đầu quyết định họ có trở thành khách A hay không.
* **Khách D - Khách đã mất**: đừng chi thêm. Đưa vào danh sách loại trừ khi chạy quảng cáo để không đốt ngân sách.

#### Sai lầm ngân sách hay gặp

Đa số doanh nghiệp chạy quảng cáo bám đuổi cho toàn bộ danh sách khách đã mua. Điều đó có nghĩa là **tiền được chia đều cho cả khách A đang sẵn sàng mua lẫn khách D đã bỏ đi**. Chỉ cần tách nhóm B ra và dồn riêng ngân sách cho họ, phần lớn doanh nghiệp thấy hiệu quả tăng rõ rệt mà không cần thêm một đồng ngân sách nào.`,
        takeaway: "Nhóm đáng chi tiền nhất không phải khách trung thành mà là khách từng chi nhiều nhưng lâu rồi chưa quay lại. Kéo họ về luôn rẻ hơn tìm khách mới tương đương."
      }
    ],
    quiz: [
      {
        id: "q6_1",
        question: "Phát biểu nào sau đây thể hiện một Customer Insight (Sự thật ngầm hiểu) sâu sắc chứ không chỉ là thông tin bề nổi?",
        options: [
          "Phụ nữ 30 tuổi thích mua sắm quần áo đẹp vào cuối tuần",
          "Tôi mua đồ hiệu đắt tiền không phải vì thích chất vải, mà vì muốn nhận được ánh nhìn nể trọng từ đồng nghiệp khi bước vào phòng họp",
          "Khách hàng nam 40 tuổi thích chơi golf và đi du lịch",
          "Người tiêu dùng muốn mua hàng giá rẻ nhất có thể"
        ],
        correct: 1,
        explanation: "Bản chất Insight là động lực tâm lý thầm kín phía sau hành vi (muốn nhận sự nể trọng), mở ra góc truyền thông chạm đúng tim đen khách hàng."
      },
      {
        id: "q6_2",
        question: "Hành trình khách hàng 5A (Kotler Marketing 4.0) bao gồm những giai đoạn nào theo đúng thứ tự?",
        options: [
          "Aware (Nhận biết) -> Appeal (Thích) -> Ask (Tìm hiểu) -> Act (Hành động mua) -> Advocate (Ủng hộ/Giới thiệu)",
          "Attention -> Interest -> Desire -> Action -> Retention",
          "Ads -> Click -> Buy -> Review -> Refund",
          "Search -> Compare -> Order -> Cancel -> Complain"
        ],
        correct: 0,
        explanation: "Mô hình 5A đại diện cho hành trình trên không gian số: Nhận biết thương hiệu -> Cảm thấy cuốn hút -> Chủ động hỏi/tìm hiểu -> Mua hàng -> Trở thành người ủng hộ truyền thông."
      },
      {
        id: "q6_3",
        question: "Khái niệm 'Reason to Buy' (Lý do mua hàng) của sản phẩm thường được chia thành 2 nhóm yếu tố chính nào?",
        options: [
          "Lý do Lý trí (Functional Benefits) và Lý do Cảm xúc (Emotional Benefits)",
          "Lý do Giá rẻ và Lý do Miễn phí vận chuyển",
          "Lý do Quảng cáo đẹp và Lý do Nhạc hay",
          "Lý do Sếp bắt mua và Lý do Bạn bè xúi giục"
        ],
        correct: 0,
        explanation: "Khách hàng mua hàng bằng Cảm xúc (Emotional) và bào chữa hợp lý hóa quyết định đó bằng Lý trí (Functional)."
      },
      {
        id: "q6_4",
        question: "Trong mô hình RFM, khách hàng có điểm 1-5-5 nghĩa là gì và nên xử lý ra sao?",
        options: [
          "Khách mới vừa mua lần đầu, nên gửi chuỗi chăm sóc 30 ngày",
          "Khách từng mua nhiều và chi nhiều nhưng lâu rồi chưa quay lại, đây là nhóm đáng ưu tiên ngân sách kéo về nhất",
          "Khách đã mất hoàn toàn, nên đưa vào danh sách loại trừ",
          "Khách trung thành đang mua đều, nên giữ nguyên không tác động"
        ],
        correct: 1,
        explanation: "Điểm 1-5-5 nghĩa là Recency thấp nhất nhưng Frequency và Monetary cao nhất, tức khách giá trị cao đang rời bỏ. Họ đã chứng minh sẵn sàng chi tiền, nên chi phí kéo về thấp hơn nhiều so với tìm khách mới tương đương."
      },
      {
        id: "q6_5",
        question: "Doanh nghiệp đang chạy quảng cáo bám đuổi cho toàn bộ danh sách khách đã mua với ngân sách 100 triệu mỗi tháng. Cải tiến hiệu quả nhất mà không cần tăng ngân sách là gì?",
        options: [
          "Tăng tần suất hiển thị quảng cáo lên gấp đôi cho toàn bộ danh sách",
          "Phân nhóm theo RFM, loại nhóm đã mất khỏi danh sách và dồn phần ngân sách đó cho nhóm giá trị cao đang rời bỏ",
          "Đổi toàn bộ hình ảnh quảng cáo sang video",
          "Mở rộng danh sách bám đuổi sang cả những người chỉ mới xem trang"
        ],
        correct: 1,
        explanation: "Chạy bám đuổi cho toàn bộ danh sách nghĩa là chia đều tiền cho cả khách sắp mua lẫn khách đã bỏ đi. Phân nhóm RFM để loại nhóm đã mất và dồn cho nhóm đáng cứu giúp tăng hiệu quả mà không tốn thêm ngân sách."
      }
    ]
  },
  {
    id: "module-07",
    number: "07",
    title: "Digital Marketing Creative",
    subtitle: "Khai thác hiệu quả truyền thông thương hiệu",
    description: "Phương pháp sáng tạo ý tưởng chiến dịch Digital Marketing, thông điệp truyền thông (message), phong cách thể hiện (concept).",
    icon: "Lightbulb",
    badge: "Sáng Tạo Thông Điệp",
    duration: "50 phút",
    lessonsCount: 3,
    quizCount: 5,
    sections: [
      {
        id: "m7-s1",
        title: "1. Cấu trúc Ngôi nhà Thông điệp (Message House)",
        content: `### Chuẩn hóa thông điệp chiến dịch truyền thông

1. Big Idea (Ý tưởng lớn): Thông điệp cốt lõi gói gọn định vị chiến dịch trong một câu ấn tượng.
2. Key Message (Thông điệp chính): Lời hứa thương hiệu gửi tới đúng tệp khách hàng mục tiêu.
3. Content Pillars (Trụ cột nội dung): Các chủ đề lớn nâng đỡ cho thông điệp chính như tính năng sản phẩm, câu chuyện người dùng và phân tích chuyên gia.
4. Proof Points (Bằng chứng xác minh): Dữ liệu kiểm định, giải thưởng uy tín, đánh giá từ khách hàng để tạo sự tin tưởng lý trí.`
      },
      {
        id: "m7-s2",
        title: "2. Công thức Hook - Story - Offer cho Video Ads ngắn",
        content: `### Quy tắc 3 giây đầu giữ chân khán giả trên TikTok và Reels

* Hook (3 giây đầu): Gây tò mò hoặc đánh thẳng vào nỗi đau để ngăn người dùng vuốt qua bài quảng cáo.
* Story (15-30 giây tiếp): Dẫn dắt câu chuyện biến chuyển thực tế trước và sau khi sử dụng giải pháp.
* Offer & CTA (5 giây cuối): Đưa ra ưu đãi độc quyền kèm lời kêu gọi bấm vào liên kết mua hàng ngay lập tức.`
      },
      {
        id: "m7-s3",
        title: "3. Chuyên sâu: Chỉ số chẩn đoán mẫu quảng cáo video",
        content: `### Khi quảng cáo kém hiệu quả, hỏng ở đâu

Câu trả lời quảng cáo này không chạy được là vô dụng với Trưởng phòng. Bạn cần biết chính xác nó hỏng ở giây thứ mấy. Bốn chỉ số dưới đây chia video thành bốn đoạn để chẩn đoán.

#### Bốn chỉ số theo thứ tự phễu

1. **Hook Rate** bằng số lượt xem 3 giây chia số lượt hiển thị. Đo sức hút của 3 giây đầu.
2. **Hold Rate** bằng số lượt xem hết video chia số lượt xem 3 giây. Đo sức giữ chân của phần thân.
3. **CTR** bằng số lượt bấm chia số lượt hiển thị. Đo sức thuyết phục của lời kêu gọi hành động.
4. **CVR** bằng số chuyển đổi chia số lượt bấm. Đo mức độ khớp giữa quảng cáo và trang đích.

#### Bảng chẩn đoán theo triệu chứng

Các ngưỡng dưới đây là mức tham chiếu để so sánh giữa các mẫu quảng cáo của chính bạn, không phải chuẩn tuyệt đối của ngành.

* **Hook Rate thấp, dưới 20%**: vấn đề nằm ở 3 giây đầu. Hình ảnh mở đầu không đủ chặn ngón tay lướt. Sửa: đổi khung hình đầu tiên, thêm chữ lớn nêu thẳng vấn đề, bỏ phần giới thiệu logo.
* **Hook Rate tốt nhưng Hold Rate thấp, dưới 15%**: mở đầu hứa hẹn nhưng phần thân không giữ được. Sửa: rút ngắn video, đưa phần chứng minh lên sớm hơn, bỏ đoạn kể lể tính năng.
* **Hold Rate tốt nhưng CTR thấp, dưới 1%**: người xem thích nội dung nhưng không thấy lý do phải bấm. Sửa: làm rõ ưu đãi, thêm yếu tố giới hạn thời gian, đặt lời kêu gọi hành động sớm hơn thay vì chỉ ở cuối.
* **CTR tốt nhưng CVR thấp, dưới 2%**: quảng cáo hứa một đằng, trang đích nói một nẻo. Sửa: đồng bộ tiêu đề và hình ảnh trang đích với quảng cáo, kiểm tra tốc độ tải trang trên điện thoại, giảm số ô bắt buộc trong biểu mẫu.

#### Minh hoạ: so sánh hai mẫu quảng cáo cùng ngân sách

Bối cảnh giả định, mỗi mẫu chi 30 triệu đồng.

Mẫu A: hiển thị 500.000, xem 3 giây 140.000, xem hết 12.000, bấm 3.500, đơn hàng 42.

* Hook Rate 28%, Hold Rate 8,6%, CTR 0,7%, CVR 1,2%.

Mẫu B: hiển thị 480.000, xem 3 giây 76.000, xem hết 20.000, bấm 4.800, đơn hàng 168.

* Hook Rate 15,8%, Hold Rate 26,3%, CTR 1,0%, CVR 3,5%.

Đọc kết quả: mẫu A có mở đầu giật gân hơn nên Hook Rate gần gấp đôi, nhưng phần thân rỗng nên rơi rụng gần hết. Mẫu B mở đầu kém hơn nhưng giữ chân tốt và trang đích khớp, cho ra số đơn gấp 4 lần.

Hành động đúng không phải là bỏ mẫu A, mà là **ghép 3 giây đầu của mẫu A vào phần thân của mẫu B** rồi chạy thử lại. Đây là cách kiểm định theo từng thành phần, hiệu quả hơn nhiều so với làm lại video từ đầu.`,
        takeaway: "Đừng đánh giá mẫu quảng cáo bằng một con số tổng. Tách theo bốn tầng Hook, Hold, CTR, CVR để biết chính xác cần sửa đoạn nào."
      }
    ],
    quiz: [
      {
        id: "q7_1",
        question: "Trong quảng cáo video ngắn (TikTok Ads, Meta Reels), yếu tố nào quyết định đến 80% tỷ lệ người dùng dừng lại xem tiếp thay vì vuốt qua?",
        options: [
          "Đoạn Hook trong 3 giây đầu tiên của Video",
          "Độ phân giải video 4K siêu nét",
          "Logo công ty xuất hiện ở giây thứ 30",
          "Bản nhạc nền không lời êm dịu"
        ],
        correct: 0,
        explanation: "Khoảng chú ý của người dùng số hiện nay chỉ khoảng 3 giây. Nếu 3s đầu (Hook) không đủ ấn tượng, người dùng sẽ vuốt qua bài quảng cáo ngay."
      },
      {
        id: "q7_2",
        question: "Cấu trúc Message House giúp Trưởng phòng giải quyết bài toán gì trong truyền thông?",
        options: [
          "Đảm bảo toàn bộ nội dung đăng tải trên mọi kênh nhất quán với Big Idea chung, không bị manh mún vụn vặt",
          "Tự động tạo ra bài viết đăng lên Facebook hàng ngày",
          "Cắt giảm chi phí mua bản quyền phông chữ thiết kế",
          "Giúp video quảng cáo tự động lên xu hướng mà không cần duyệt"
        ],
        correct: 0,
        explanation: "Message House chuẩn hóa thông điệp, giúp team sáng tạo nội dung dù triển khai trên nền tảng nào cũng không đi lệch khỏi chiến lược thương hiệu."
      },
      {
        id: "q7_3",
        question: "Thuật ngữ 'Proof Points' trong sơ đồ thông điệp nghĩa là gì?",
        options: [
          "Bằng chứng cụ thể (chứng nhận, dữ liệu, review) xác minh cho lời tuyên bố của thương hiệu",
          "Điểm số thi trắc nghiệm của nhân viên Content",
          "Số dư tài khoản ngân hàng của doanh nghiệp",
          "Các thẻ hashtag gắn ở cuối bài viết"
        ],
        correct: 0,
        explanation: "Proof Points cung cấp sự tin cậy lý trí (chứng nhận ISO, kết quả lâm sàng, 10.000+ feedback 5 sao) để chứng minh cho Key Message."
      },
      {
        id: "q7_4",
        question: "Một mẫu video có Hook Rate 32% rất cao, nhưng Hold Rate chỉ 6% và CTR 0,4%. Vấn đề nằm ở đâu?",
        options: [
          "Ba giây đầu quá yếu, cần đổi hình ảnh mở đầu",
          "Phần thân video không giữ được người xem sau khi mở đầu đã hứa hẹn, cần rút ngắn và đưa phần chứng minh lên sớm",
          "Trang đích tải quá chậm trên điện thoại",
          "Ngân sách quá thấp nên chưa đủ dữ liệu"
        ],
        correct: 1,
        explanation: "Hook Rate cao chứng tỏ mở đầu đã chặn được người lướt. Hold Rate rơi xuống 6% cho thấy phần thân không giữ chân được. Đây là lỗi của nội dung giữa video, không phải lỗi mở đầu hay trang đích."
      },
      {
        id: "q7_5",
        question: "Mẫu quảng cáo có CTR 1,8% rất tốt nhưng CVR chỉ 0,6%. Hành động ưu tiên là gì?",
        options: [
          "Tăng ngân sách cho mẫu này vì CTR cao",
          "Kiểm tra sự đồng bộ giữa lời hứa trong quảng cáo và nội dung trang đích, cùng tốc độ tải trang và số ô bắt buộc trong biểu mẫu",
          "Làm lại toàn bộ video từ đầu",
          "Đổi sang nền tảng quảng cáo khác"
        ],
        correct: 1,
        explanation: "CTR cao nghĩa là quảng cáo đã thuyết phục được người bấm. Rơi ở CVR nghĩa là đứt gãy xảy ra sau cú bấm, tức ở trang đích. Tăng ngân sách lúc này chỉ làm khuếch đại điểm rò rỉ."
      }
    ]
  },
  {
    id: "module-08",
    number: "08",
    title: "Viral Branding Ideas",
    subtitle: "Ý tưởng lan truyền thương hiệu",
    description: "Hệ thống 8 ý tưởng giúp thương hiệu bứt phá, lan truyền trên các nền tảng mạng xã hội, tạo dấu ấn khác biệt.",
    icon: "Zap",
    badge: "Công Thức Viral",
    duration: "60 phút",
    lessonsCount: 3,
    quizCount: 5,
    sections: [
      {
        id: "m8-s1",
        title: "1. 8 Động cơ Kích hoạt Viral (Viral Triggers)",
        content: `### Bộ 8 Công thức sáng tạo nội dung lan truyền bứt phá

1. Emotion Trigger (Cảm xúc cực đại): Tạo ra sự cảm động sâu sắc, tiếng cười sảng khoái hoặc niềm tự hào.
2. Controversy & Debate (Góc nhìn tranh luận): Đưa ra quan điểm độc đáo đi ngược số đông nhưng có lập luận sắc bén.
3. Trend Hacking (Bắt trend thông minh): Lồng ghép sự kiện đang hot vào câu chuyện thương hiệu một cách tinh tế.
4. High-Save Utility (Giá trị lưu trữ cao): Bảng biểu tổng hợp, tài liệu chuyên sâu khiến người dùng bắt buộc phải Lưu và Chia sẻ.
5. Unexpected Twist (Cú twist bất ngờ): Dẫn dắt câu chuyện theo hướng bình thường và tạo kết thúc bất ngờ.
6. Relatability (Nói hộ lòng người): Diễn tả chính xác những trải nghiệm thầm kín mà ai cũng từng gặp phải.
7. Co-creation Challenge (Thử thách cộng đồng): Tạo trào lưu nhảy hoặc biến hình trên TikTok thu hút người dùng hưởng ứng.
8. Hero's Journey Storytelling (Hành trình vượt khó): Câu chuyện truyền cảm hứng chạm đến sự đồng cảm.`
      },
      {
        id: "m8-s2",
        title: "2. Hệ số lan truyền K-Factor và cách tính",
        content: `### Con số quyết định chiến dịch có tự lan hay không

**K-Factor** đo mỗi người dùng hiện tại mang về bao nhiêu người dùng mới. Đây là ranh giới giữa một chiến dịch phải bơm tiền liên tục và một chiến dịch tự chạy.

Công thức: **K bằng số lời mời trung bình mỗi người gửi đi nhân với tỷ lệ người nhận thực sự tham gia.**

#### Ba vùng giá trị và ý nghĩa

1. **K nhỏ hơn 1**: mỗi vòng lan truyền nhỏ dần rồi tắt. Đây là trạng thái của gần như mọi chiến dịch. Không có nghĩa là thất bại, chỉ có nghĩa là bạn vẫn phải trả tiền quảng cáo để duy trì.
2. **K bằng 1**: quy mô giữ nguyên, tự duy trì nhưng không tăng.
3. **K lớn hơn 1**: mỗi vòng lớn hơn vòng trước, tăng trưởng theo cấp số nhân. Cực hiếm và thường không kéo dài quá vài tuần.

#### Minh hoạ tính toán

Chiến dịch giả định: ứng dụng tặng 50.000 đồng cho cả người giới thiệu và người được giới thiệu.

* Có 10.000 người dùng ban đầu.
* Trung bình mỗi người gửi 4 lời mời. Tổng 40.000 lời mời.
* Tỷ lệ người nhận cài đặt và kích hoạt: 15%.
* K bằng 4 nhân 0,15 bằng **0,6**.

Diễn biến các vòng: 10.000 rồi 6.000 rồi 3.600 rồi 2.160 và nhỏ dần. Tổng người dùng mới cộng dồn khoảng 15.000, tức lan truyền giúp **nhân đôi rưỡi** lượng người dùng ban đầu rồi dừng.

Để đạt K bằng 1, bạn cần một trong hai: nâng số lời mời mỗi người từ 4 lên 6,7, hoặc nâng tỷ lệ tham gia từ 15% lên 25%.

#### Đòn bẩy nào dễ hơn

Nâng tỷ lệ tham gia thường dễ hơn nâng số lời mời, vì nó phụ thuộc vào ba yếu tố bạn kiểm soát được: mức thưởng có đủ hấp dẫn không, thao tác tham gia có ít bước không, và người gửi lời mời có đáng tin trong mắt người nhận không.

Còn số lời mời mỗi người phụ thuộc vào động lực nội tại, khó tác động hơn nhiều bằng ngân sách.`,
        takeaway: "Đa số chiến dịch có K dưới 1 và điều đó là bình thường. Việc của Trưởng phòng là biết con số K để tính đúng lượng người dùng cộng dồn, thay vì hứa hẹn tăng trưởng theo cấp số nhân."
      },
      {
        id: "m8-s3",
        title: "3. Chuyên sâu: Giải phẫu một chiến dịch lan truyền",
        content: `### Vì sao đa số nỗ lực làm viral thất bại

Sai lầm gốc là coi viral là một mục tiêu. Viral là **kết quả** của việc thiết kế đúng ba lớp: động cơ chia sẻ, độ ma sát khi chia sẻ, và vòng quay khép kín.

#### Lớp 1 - Động cơ: người ta chia sẻ để làm gì

Người dùng không chia sẻ vì thương hiệu của bạn. Họ chia sẻ vì bản thân họ. Ba động cơ mạnh nhất:

* **Tự thể hiện**: nội dung khiến người chia sẻ trông thông minh, có gu, hoặc thành đạt hơn trong mắt bạn bè.
* **Trao giá trị**: nội dung hữu ích tới mức không chia sẻ thấy có lỗi với bạn bè.
* **Thuộc về nhóm**: nội dung là mật mã nội bộ của một cộng đồng, chia sẻ để khẳng định mình thuộc nhóm đó.

Nếu nội dung của bạn không phục vụ ít nhất một trong ba động cơ này, mọi ngân sách quảng cáo chỉ mua được lượt xem chứ không mua được lượt chia sẻ.

#### Lớp 2 - Ma sát: mỗi bước thừa cắt mất một nửa

Quy luật thực dụng: **mỗi bước thao tác bổ sung làm rơi khoảng một nửa số người tham gia.**

Minh hoạ giả định với 100.000 người nhìn thấy lời kêu gọi:

1. Yêu cầu bấm vào liên kết: còn 20.000.
2. Yêu cầu đăng ký tài khoản: còn 9.000.
3. Yêu cầu xác minh email: còn 4.500.
4. Yêu cầu tải ứng dụng: còn 1.800.
5. Yêu cầu điền thông tin cá nhân rồi mới được chia sẻ: còn khoảng 800.

Từ 100.000 xuống 800, tức mất 99,2%, hoàn toàn do thiết kế quy trình chứ không phải do nội dung dở. Cắt được hai bước giữa là đã nhân ba kết quả.

#### Lớp 3 - Vòng quay: người mới có trở thành người lan tiếp không

Một chiến dịch lan truyền thật sự phải khép kín: người được mời, sau khi tham gia, **ngay lập tức gặp lại lời mời chia sẻ** khi họ đang ở đỉnh hưng phấn.

Sai lầm thường gặp là chỉ hiển thị nút chia sẻ cho nhóm người dùng cũ, còn người mới vào thì không thấy gì. Vòng quay bị hở ở đúng chỗ quan trọng nhất, và K-Factor tụt xuống gần bằng 0.

#### Danh sách kiểm tra trước khi bấm chạy

1. Nội dung phục vụ động cơ tự thể hiện, trao giá trị, hay thuộc về nhóm.
2. Số bước từ lúc nhìn thấy đến lúc chia sẻ được là bao nhiêu, có cắt bớt được không.
3. Người mới tham gia có gặp lời mời chia sẻ ngay không.
4. Phần thưởng có dành cho cả hai phía, người mời và người được mời.
5. Có cách đo K-Factor theo ngày để biết khi nào nên dừng bơm ngân sách.`,
        takeaway: "Viral không phải mục tiêu mà là kết quả của ba lớp thiết kế. Trong đó lớp ma sát là nơi mất nhiều người nhất và cũng là nơi dễ sửa nhất."
      }
    ],
    quiz: [
      {
        id: "q8_1",
        question: "Dạng nội dung nào dưới đây có tỷ lệ người dùng bấm nút 'Lưu' (Save) và 'Chia sẻ' (Share) cao nhất trên mạng xã hội?",
        options: [
          "Một bài viết đăng ảnh logo công ty kèm dòng chữ 'Chúc mừng năm mới'",
          "Một tài liệu tổng hợp 'Checklist 20 bước kiểm tra chiến dịch Meta Ads trước khi bấm Bật' trình bày rõ ràng",
          "Một tấm ảnh chụp góc bàn làm việc sơ sài không có caption",
          "Một thông báo tuyển dụng nhân sự không ghi mức lương"
        ],
        correct: 1,
        explanation: "Nội dung mang giá trị ứng dụng cao (Utility Content) giúp giải quyết công việc cụ thể khiến người dùng có xu hướng lưu lại để dùng và chia sẻ cho đồng nghiệp."
      },
      {
        id: "q8_2",
        question: "Khi áp dụng chiến thuật 'Trend Hacking' (Bắt trend), rủi ro lớn nhất mà Trưởng phòng Digital Marketing cần cảnh giác là gì?",
        options: [
          "Bắt phải các trend tiêu cực, vi phạm thuần phong mỹ tục hoặc đi ngược lại giá trị cốt lõi của thương hiệu gây ra khủng hoảng truyền thông",
          "Tốn quá nhiều thời gian xem TikTok",
          "Khiến bài viết có quá nhiều lượt tương tác",
          "Làm cho đối thủ copy lại bài viết"
        ],
        correct: 0,
        explanation: "Bắt trend nhắm mắt không chọn lọc dễ khiến thương hiệu dính dáng tới các scandal tiêu cực, gây phản cảm và phá hủy uy tín tích lũy lâu năm."
      },
      {
        id: "q8_3",
        question: "Yếu tố cốt lõi khiến chiến dịch tạo thử thách cộng đồng (User Generated Content - UGC Challenge) thành công trên TikTok là gì?",
        options: [
          "Thể lệ tham gia cực kỳ đơn giản, âm thanh cuốn hút và giải thưởng kích thích hành động",
          "Bắt buộc người tham gia phải viết bài văn dài 1.000 từ",
          "Yêu cầu người dùng phải mua hàng hóa trị giá trên 10 triệu mới được tham gia",
          "Chỉ cho phép nhân viên trong công ty tham gia"
        ],
        correct: 0,
        explanation: "Chiến dịch UGC cần rào cản tham gia (Barrier to Entry) cực thấp để bất kỳ ai cũng có thể quay video tham gia trong 15 giây."
      },
      {
        id: "q8_4",
        question: "Chiến dịch giới thiệu bạn bè có mỗi người gửi trung bình 5 lời mời, tỷ lệ người nhận tham gia là 12%. Hệ số K-Factor bằng bao nhiêu và có ý nghĩa gì?",
        options: [
          "K bằng 0,6 - chiến dịch sẽ tự lan rộng theo cấp số nhân",
          "K bằng 0,6 - mỗi vòng lan truyền nhỏ dần rồi tắt, vẫn phải duy trì ngân sách quảng cáo",
          "K bằng 1,7 - chiến dịch tự duy trì không cần thêm ngân sách",
          "K bằng 5 - mỗi người mang về 5 người mới"
        ],
        correct: 1,
        explanation: "K bằng 5 nhân 0,12 bằng 0,6. Vì K nhỏ hơn 1 nên mỗi vòng lan truyền nhỏ hơn vòng trước và sẽ tắt dần. Lan truyền vẫn có giá trị khuếch đại nhưng không thay thế được ngân sách quảng cáo."
      },
      {
        id: "q8_5",
        question: "Chiến dịch có nội dung tốt nhưng chỉ 800 trên 100.000 người nhìn thấy thực sự chia sẻ. Nguyên nhân khả dĩ nhất và cách xử lý?",
        options: [
          "Nội dung chưa đủ hấp dẫn, cần thuê người nổi tiếng quảng bá",
          "Quy trình có quá nhiều bước thao tác, mỗi bước làm rơi khoảng một nửa số người, cần rà soát và cắt bớt các bước trung gian",
          "Ngân sách quảng cáo chưa đủ lớn",
          "Chọn sai khung giờ đăng bài"
        ],
        correct: 1,
        explanation: "Tỷ lệ rơi 99,2% là dấu hiệu điển hình của ma sát quy trình chứ không phải nội dung kém. Mỗi bước bổ sung như đăng ký, xác minh, tải ứng dụng đều cắt khoảng một nửa. Cắt bớt vài bước giữa thường nhân nhiều lần kết quả."
      }
    ]
  },
  {
    id: "module-09",
    number: "09",
    title: "Digital Marketing Planning",
    subtitle: "Lập kế hoạch Digital Marketing",
    description: "Quy trình lập kế hoạch Digital Marketing bài bản, tổng thể, có tính ứng dụng cao trong doanh nghiệp (có biểu mẫu tham khảo).",
    icon: "Calendar",
    badge: "Lập Kế Hoạch Master",
    duration: "70 phút",
    lessonsCount: 4,
    quizCount: 5,
    sections: [
      {
        id: "m9-s1",
        title: "1. Khung SOSTAC Framework lập Master Plan",
        content: `### Quy trình lập kế hoạch chuẩn quốc tế 6 bước

1. Situation Analysis (Phân tích hiện trạng): Đánh giá sức khỏe thương hiệu hiện tại, phân tích SWOT và nghiên cứu đối thủ.
2. Objectives (Xác định mục tiêu): Thiết lập mục tiêu kinh doanh SMART đảm bảo tính cụ thể, đo lường được và có thời hạn.
3. Strategy (Chiến lược tổng thể): Lựa chọn định vị thương hiệu, phân tệp khách hàng và xây dựng thông điệp chủ đạo.
4. Tactics (Chiến thuật phân kênh): Lựa chọn các công cụ triển khai cụ thể như Paid Ads, SEO, Influencer Booking và Email.
5. Action (Kế hoạch hành động): Lên lịch trình Gantt Chart tiến độ công việc và phân công nhiệm vụ minh bạch.
6. Control (Kiểm soát & Đo lường): Thiết lập bảng theo dõi KPI thời gian thực và kế hoạch quản trị rủi ro.`
      },
      {
        id: "m9-s2",
        title: "2. Lộ trình triển khai 90 ngày",
        content: `### Kế hoạch năm chỉ có giá trị khi chia được thành các chặng 90 ngày

Kế hoạch 12 tháng gần như luôn sai từ tháng thứ 4 vì thị trường thay đổi. Chu kỳ 90 ngày đủ dài để thấy kết quả và đủ ngắn để kịp đổi hướng.

#### Chặng 1 - Ngày 1 đến 30: Dựng nền và đo đạc

1. Kiểm toán hiện trạng: gắn đủ mã theo dõi, dựng bảng báo cáo, xác định số liệu nền của từng chỉ số.
2. Dọn dẹp: tắt các chiến dịch không có chuyển đổi trong 60 ngày qua, gộp các nhóm quảng cáo trùng tệp.
3. Chuẩn hoá quy trình: ai duyệt nội dung, bao lâu báo cáo một lần, ngưỡng nào thì tắt chiến dịch.
4. Kết quả cần có cuối chặng: một bảng số liệu nền được mọi bên thống nhất. Chưa vội tăng trưởng.

#### Chặng 2 - Ngày 31 đến 60: Kiểm định và tìm công thức thắng

1. Chạy song song tối thiểu 3 hướng thông điệp khác nhau, mỗi hướng 3 biến thể.
2. Mỗi thử nghiệm chỉ đổi một biến số để biết chính xác điều gì tạo ra khác biệt.
3. Ngân sách chia đều cho các hướng trong 2 tuần đầu, sau đó dồn dần về hướng thắng.
4. Kết quả cần có cuối chặng: xác định được một tổ hợp thông điệp, tệp khách hàng và định dạng cho kết quả tốt nhất.

#### Chặng 3 - Ngày 61 đến 90: Nhân rộng công thức thắng

1. Tăng ngân sách cho tổ hợp thắng theo từng nấc 20% mỗi 3 ngày, không tăng đột ngột để tránh phá vỡ giai đoạn học của thuật toán.
2. Nhân bản công thức thắng sang kênh thứ hai.
3. Song song vẫn giữ 10% ngân sách cho thử nghiệm mới, để không rơi vào tình trạng cạn ý tưởng khi công thức hiện tại hết hiệu lực.
4. Kết quả cần có cuối chặng: báo cáo so sánh với số liệu nền của chặng 1 và đề xuất kế hoạch cho 90 ngày kế tiếp.

#### Cạm bẫy hay gặp

Áp lực từ Ban Giám Đốc thường buộc Trưởng phòng bỏ qua chặng 1 để chạy tăng trưởng ngay. Hậu quả là đến tháng thứ 3 không ai biết kết quả tốt lên hay xấu đi vì không có số liệu nền để so sánh.`,
        takeaway: "Chặng 30 ngày đầu không tạo ra tăng trưởng mà tạo ra khả năng đo lường. Bỏ qua nó thì mọi kết luận về sau đều không có căn cứ."
      },
      {
        id: "m9-s3",
        title: "3. Quản trị rủi ro và kịch bản dự phòng",
        content: `### Kế hoạch không có phần rủi ro là kế hoạch chưa hoàn chỉnh

Một bản kế hoạch chỉ trình phương án thuận lợi sẽ bị Ban Giám Đốc đánh giá là thiếu chín chắn. Phần rủi ro cho thấy bạn đã lường trước và có sẵn phương án.

#### Bốn rủi ro thường gặp và ngưỡng kích hoạt

1. **Chi phí quảng cáo tăng đột biến vào mùa cao điểm.** Ngưỡng kích hoạt: CPM tăng quá 40% so với trung bình 30 ngày. Phương án: chuyển ngân sách sang kênh có chi phí ổn định hơn, đẩy mạnh tệp khách cũ, tạm dừng mở rộng tệp lạnh.
2. **Tài khoản quảng cáo bị khoá.** Ngưỡng kích hoạt: ngay khi có cảnh báo đầu tiên. Phương án: duy trì sẵn tài khoản dự phòng đã được xác minh, sao lưu toàn bộ tệp khách hàng ra tệp riêng, không để một tài khoản gánh quá 60% ngân sách.
3. **Nội dung chủ lực mất hiệu lực.** Ngưỡng kích hoạt: tần suất hiển thị vượt 3,5 lần và CTR giảm quá 30% so với tuần đầu. Phương án: luôn có sẵn ít nhất 3 mẫu chưa dùng trong kho.
4. **Đối thủ tung khuyến mãi cắt giá sâu.** Ngưỡng kích hoạt: tỷ lệ chuyển đổi giảm quá 25% mà chi phí hiển thị không đổi. Phương án: không chạy đua giảm giá. Chuyển thông điệp sang giá trị dài hạn, dịch vụ hậu mãi và bảo hành.

#### Nguyên tắc viết kịch bản dự phòng cho đúng

Mỗi kịch bản phải có đủ ba thành phần, thiếu một là không dùng được khi có sự cố:

* **Ngưỡng số cụ thể** để biết khi nào kích hoạt, không dùng các từ mơ hồ như khi tình hình xấu đi.
* **Người chịu trách nhiệm quyết định**, nêu rõ tên vai trò.
* **Hành động cụ thể trong 24 giờ đầu**, đủ chi tiết để người khác đọc là làm được ngay.`,
        takeaway: "Kịch bản dự phòng phải có ngưỡng số cụ thể và tên người quyết định. Nếu chỉ ghi khi tình hình xấu đi thì lúc xảy ra sự cố sẽ không ai dám hành động."
      },
      {
        id: "m9-s4",
        title: "4. Chuyên sâu: Bản kế hoạch mẫu có số liệu đầy đủ",
        content: `### Ghép toàn bộ khung SOSTAC thành một bản trình duyệt

Dưới đây là bản rút gọn của một kế hoạch quý, với các con số giả định để minh hoạ mức độ chi tiết cần có khi trình Ban Giám Đốc.

#### Bối cảnh: Chuỗi phòng tập, 4 cơ sở, mục tiêu quý 4

**Situation - Hiện trạng:**

* Doanh thu trung bình 1,8 tỷ mỗi tháng. Số hội viên đang hoạt động 2.400.
* Chi phí thu hút một hội viên mới là 1.400.000 đồng. Tỷ lệ rời bỏ hàng tháng 6,5%.
* Ngân sách marketing hiện tại 220 triệu mỗi tháng, chủ yếu chạy quảng cáo Meta.

**Objectives - Mục tiêu quý:**

1. Nâng doanh thu lên 2,4 tỷ mỗi tháng vào cuối quý.
2. Giảm chi phí thu hút hội viên từ 1.400.000 xuống dưới 1.100.000 đồng.
3. Giảm tỷ lệ rời bỏ từ 6,5% xuống 5%.

**Strategy - Chiến lược:**

Bài toán không nằm ở việc mua thêm hội viên. Với tỷ lệ rời bỏ 6,5%, mỗi tháng mất 156 hội viên. Giảm rời bỏ xuống 5% giữ lại 36 hội viên mỗi tháng mà không tốn đồng nào chi phí thu hút. Vì vậy chiến lược ưu tiên giữ chân trước, mở rộng sau.

**Tactics - Chiến thuật và phân bổ:**

1. Giữ chân, 40% ngân sách tức 88 triệu: chuỗi tin nhắn tự động nhắc lịch tập, chương trình bạn tập cùng, cảnh báo sớm khi hội viên vắng quá 10 ngày.
2. Thu hút mới, 45% ngân sách tức 99 triệu: chuyển từ quảng cáo giảm giá sang nội dung câu chuyện chuyển hoá của hội viên thật.
3. Thử nghiệm, 15% ngân sách tức 33 triệu: thử kênh TikTok và hợp tác với người có ảnh hưởng địa phương.

**Action - Hành động:**

* Ngày 1-30: gắn hệ thống theo dõi hội viên vắng mặt, dựng chuỗi tin nhắn tự động.
* Ngày 31-60: kiểm định 3 hướng nội dung câu chuyện chuyển hoá.
* Ngày 61-90: nhân rộng hướng thắng, mở kênh thứ hai.

**Control - Kiểm soát:**

* Theo dõi hàng tuần: chi phí thu hút hội viên, số hội viên vắng trên 10 ngày, tỷ lệ chuyển đổi theo từng mẫu quảng cáo.
* Theo dõi hàng tháng: tỷ lệ rời bỏ, doanh thu theo cơ sở, giá trị trọn đời hội viên.

#### Kiểm chứng mục tiêu có khả thi không

Đây là bước mà đa số kế hoạch bỏ qua. Hãy tính ngược:

* Cần tăng doanh thu 600 triệu mỗi tháng. Phí hội viên trung bình 750.000 đồng mỗi tháng, tức cần thêm **800 hội viên hoạt động**.
* Nguồn 1 - Giảm rời bỏ: giữ lại thêm 36 hội viên mỗi tháng, sau 3 tháng cộng dồn khoảng **108 hội viên**.
* Nguồn 2 - Thu hút mới: 99 triệu chia cho chi phí mục tiêu 1.100.000 đồng bằng 90 hội viên mỗi tháng, sau 3 tháng khoảng **270 hội viên**.
* Tổng khả thi khoảng 378 hội viên, chỉ đạt **47% mục tiêu 800**.

Kết luận trung thực phải trình Ban Giám Đốc: với ngân sách 220 triệu, mục tiêu 2,4 tỷ là không khả thi trong một quý. Hoặc nâng ngân sách lên khoảng 400 triệu, hoặc giãn mục tiêu ra 6 tháng. Trình bày phép tính này giúp bạn thương lượng bằng dữ liệu thay vì bằng cảm tính.`,
        takeaway: "Bước quan trọng nhất của lập kế hoạch là kiểm chứng ngược xem mục tiêu có khả thi với ngân sách được giao hay không, và dám trình con số đó ra."
      }
    ],
    quiz: [
      {
        id: "q9_1",
        question: "Mục tiêu nào sau đây đạt tiêu chuẩn mục tiêu S.M.A.R.T cho kế hoạch Digital Marketing quý 3?",
        options: [
          "Làm cho thương hiệu trở nên nổi tiếng nhất Việt Nam",
          "Mang về 500 Leads chất lượng từ kênh Google Search Ads với CPL dưới 200.000 VNĐ trong thời gian từ 01/07 đến 30/09",
          "Chạy thật nhiều quảng cáo Facebook để tăng doanh số",
          "Đạt được nhiều lượt tương tác trên bài viết nhất có thể"
        ],
        correct: 1,
        explanation: "Mục tiêu đạt SMART vì có chỉ số cụ thể (500 Leads), đo lường được (CPL < 200k), có thời hạn rõ ràng (01/07 - 30/09)."
      },
      {
        id: "q9_2",
        question: "Trong khung SOSTAC, bước nào giúp Trưởng phòng xác định rõ các rủi ro có thể phát sinh và phương án dự phòng khi chạy chiến dịch?",
        options: [
          "C - Control (Kiểm soát & Quản trị rủi ro)",
          "S - Situation",
          "T - Tactics",
          "A - Action"
        ],
        correct: 0,
        explanation: "Bước Control không chỉ là xem báo cáo mà còn bao gồm thiết lập mốc kiểm tra (Checkpoints) và phương án dự phòng Risk Mitigation."
      },
      {
        id: "q9_3",
        question: "Biểu mẫu Gantt Chart được sử dụng trong giai đoạn nào của lập kế hoạch?",
        options: [
          "Action (Lên lịch trình tiến độ công việc theo thời gian)",
          "Situation (Phân tích đối thủ)",
          "Strategy (Định vị thương hiệu)",
          "Control (Tính toán chi phí thuế)"
        ],
        correct: 0,
        explanation: "Gantt Chart là công cụ trực quan hóa tiến độ triển khai công việc theo tuần/ngày trong giai đoạn Action."
      },
      {
        id: "q9_4",
        question: "Ban Giám Đốc yêu cầu bỏ qua giai đoạn 30 ngày đầu để chạy tăng trưởng ngay. Rủi ro lớn nhất là gì?",
        options: [
          "Đội ngũ sẽ quá tải vì phải làm nhanh",
          "Không có số liệu nền được thống nhất, nên đến cuối quý không ai chứng minh được kết quả tốt lên hay xấu đi",
          "Chi phí quảng cáo sẽ tăng do chạy vội",
          "Không kịp xin phê duyệt ngân sách"
        ],
        correct: 1,
        explanation: "Giai đoạn 30 ngày đầu tạo ra khả năng đo lường chứ không tạo tăng trưởng. Thiếu số liệu nền thì mọi so sánh về sau đều không có căn cứ, và Trưởng phòng mất khả năng bảo vệ kết quả của mình."
      },
      {
        id: "q9_5",
        question: "Trong ví dụ chuỗi phòng tập, vì sao chiến lược ưu tiên giữ chân hội viên trước khi mở rộng thu hút mới?",
        options: [
          "Vì giữ chân là công việc dễ làm hơn thu hút mới",
          "Vì với tỷ lệ rời bỏ 6,5% mỗi tháng đang mất 156 hội viên, giảm xuống 5% giữ lại được 36 hội viên mà không tốn chi phí thu hút nào",
          "Vì Ban Giám Đốc yêu cầu như vậy",
          "Vì quảng cáo thu hút mới đang bị Meta hạn chế"
        ],
        correct: 1,
        explanation: "Khi tỷ lệ rời bỏ cao, việc đổ tiền thu hút hội viên mới giống như bơm nước vào thùng thủng. Mỗi hội viên giữ lại được tương đương một hội viên mới nhưng không tốn chi phí thu hút, nên đây là đòn bẩy rẻ nhất."
      }
    ]
  },
  {
    id: "module-10",
    number: "10",
    title: "Digital Marketing Effectiveness",
    subtitle: "Hiệu quả Digital Marketing",
    description: "Hệ thống KPIs đánh giá hiệu quả của các chiến dịch Digital Marketing, mẫu báo cáo và đo lường từng kênh triển khai.",
    icon: "BarChart3",
    badge: "Đo Lường & Reporting",
    duration: "65 phút",
    lessonsCount: 3,
    quizCount: 5,
    sections: [
      {
        id: "m10-s1",
        title: "1. Tháp chỉ số KPI 3 tầng cho Trưởng phòng",
        content: `### Phân tầng chỉ số báo cáo chuyên nghiệp cho Ban Giám Đốc

* Tầng 1 - Business Level (Dành cho Ban Giám Đốc): Tập trung vào Doanh thu, Lợi nhuận ròng, Chỉ số ROI, Giá trị trọn đời khách hàng LTV và Thời gian hoàn vốn.
* Tầng 2 - Marketing Level (Dành cho Trưởng phòng Digital): Tập trung vào Chi phí thu hút khách hàng CAC, Tỷ suất doanh thu quảng cáo ROAS và Chi phí trên mỗi khách hàng tiềm năng CPL.
* Tầng 3 - Channel Execution Level (Dành cho Chuyên viên): Tập trung vào CTR, CPM, CPC, Tỷ lệ hiển thị và Tỷ lệ thoát Bounce Rate.`
      },
      {
        id: "m10-s2",
        title: "2. Mô hình Ghi nhận Chuyển đổi (Attribution Models)",
        content: `### Đo lường công lao thực sự của các kênh tiếp thị

1. Last Touch Attribution: Ghi nhận 100% công lao cho kênh cuối cùng trước khi chuyển đổi. Nhược điểm là đánh giá quá cao quảng cáo chốt đơn mà bỏ qua kênh nhận diện ban đầu.
2. First Touch Attribution: Ghi nhận 100% công lao cho kênh đầu tiên giúp khách hàng biết tới thương hiệu như bài viết SEO hoặc bài PR.
3. Data-Driven Attribution: Phân bổ tỷ lệ công lao khách quan dựa trên dữ liệu học máy GA4 theo toàn bộ lịch sử tương tác đa kênh.`
      },
      {
        id: "m10-s3",
        title: "3. Chuyên sâu: Đọc báo cáo và phát hiện số liệu đánh lừa",
        content: `### Vì sao tổng doanh thu các nền tảng luôn lớn hơn doanh thu thật

Đây là tình huống mọi Trưởng phòng đều gặp: cộng doanh thu Meta báo cáo với doanh thu Google báo cáo thì ra 900 triệu, nhưng kế toán chỉ ghi nhận 600 triệu. Không ai gian lận cả. Nguyên nhân là **ghi nhận trùng**.

Mỗi nền tảng đều nhận công về mình khi khách hàng có chạm vào quảng cáo của nền tảng đó. Một khách hàng thấy quảng cáo Meta rồi sau đó tìm trên Google mới mua sẽ được **cả hai nền tảng cùng ghi nhận trọn vẹn**.

#### Minh hoạ ghi nhận trùng

Bối cảnh giả định, doanh thu thật trong tháng là 600 triệu.

* Meta báo cáo: 520 triệu.
* Google báo cáo: 380 triệu.
* Tổng cộng lại: 900 triệu, tức **vượt 50% so với thực tế**.
* Phần chênh 300 triệu chính là các đơn hàng có chạm vào cả hai kênh.

Nếu Trưởng phòng dùng con số 900 triệu để báo cáo, ROAS sẽ bị thổi phồng và mọi quyết định phân bổ ngân sách sau đó đều dựa trên nền sai.

#### Ba chỉ số phải phân biệt rõ

1. **ROAS nền tảng**: do Meta hoặc Google tự báo. Chỉ dùng để so sánh các chiến dịch trong cùng một nền tảng, tuyệt đối không cộng dồn giữa các nền tảng.
2. **ROAS tổng hợp**: bằng tổng doanh thu thật từ hệ thống bán hàng chia cho tổng chi phí quảng cáo mọi kênh. Đây là con số duy nhất nên dùng khi báo cáo Ban Giám Đốc.
3. **MER**: tỷ lệ tổng doanh thu trên tổng chi marketing, bao gồm cả chi phí nhân sự và công cụ. Đây là chỉ số Giám Đốc Tài Chính quan tâm.

#### Bốn cái bẫy khác trong báo cáo

* **Tỷ lệ phần trăm không kèm mẫu số.** Tỷ lệ chuyển đổi tăng từ 2% lên 6% nghe rất ấn tượng, nhưng nếu đó là 3 đơn trên 50 lượt bấm thì hoàn toàn có thể là ngẫu nhiên.
* **So sánh với kỳ liền trước thay vì cùng kỳ năm trước.** Tháng 2 luôn thấp hơn tháng 1 vì có Tết, không phải vì chiến dịch kém.
* **Trung bình che giấu phân hoá.** ROAS trung bình 3,0 lần có thể là tổng của một chiến dịch đạt 8,0 lần và bốn chiến dịch đạt 1,2 lần. Luôn nhìn phân bố, đừng chỉ nhìn số trung bình.
* **Chỉ báo cáo chiến dịch thắng.** Bỏ đi các chiến dịch thua khiến bức tranh sai lệch và làm mất cơ hội học từ thất bại.

#### Nguyên tắc trình bày

Mọi con số trong báo cáo phải trả lời được ba câu hỏi: lấy từ nguồn nào, tính trên mẫu số bao nhiêu, và so sánh với mốc nào. Thiếu một trong ba thì con số đó chưa đủ tin cậy để ra quyết định.`,
        takeaway: "Không bao giờ cộng doanh thu do các nền tảng tự báo cáo. Chỉ số duy nhất đáng tin khi trình Ban Giám Đốc là doanh thu thật từ hệ thống bán hàng chia cho tổng chi phí quảng cáo."
      }
    ],
    quiz: [
      {
        id: "q10_1",
        question: "Khi báo cáo kết quả chiến dịch Marketing quý cho CEO, chỉ số nào dưới đây Trưởng phòng nên đưa lên vị trí đầu tiên?",
        options: [
          "Tổng Doanh thu thu về, Chi phí thu hút khách hàng (CAC) và Tỷ suất lợi nhuận ROI",
          "Số lượng lượt Like trên bài viết Facebook",
          "Chỉ số CTR của mẫu quảng cáo banner",
          "Số lượng hình ảnh đã thiết kế được trong tháng"
        ],
        correct: 0,
        explanation: "CEO quan tâm nhất tới các chỉ số Business Impact (Doanh thu, Lợi nhuận, ROI, CAC) hơn là các chỉ số kĩ thuật media."
      },
      {
        id: "q10_2",
        question: "Chỉ số ROAS (Return on Ad Spend) được tính bằng công thức nào?",
        options: [
          "ROAS = (Doanh thu tạo ra từ Quảng cáo / Tổng chi phí Quảng cáo) x 100%",
          "ROAS = Tổng số đơn hàng / Số lượt nhấp",
          "ROAS = Chi phí nhân sự / Giá bán sản phẩm",
          "ROAS = Lợi nhuận ròng / Tổng tài sản"
        ],
        correct: 0,
        explanation: "ROAS đo lường trực tiếp 1 đồng chi tiêu quảng cáo mang về bao nhiêu đồng doanh thu. Ví dụ: Chi 10 triệu tiền Ads thu về 50 triệu doanh thu -> ROAS = 5x (500%)."
      },
      {
        id: "q10_3",
        question: "Sai lầm nào hay xảy ra nếu Trưởng phòng chỉ dùng duy nhất mô hình gán quyền Last Touch (Last Interaction)?",
        options: [
          "Đánh giá quá cao kênh chốt đơn cuối cùng (như Brand Search Ads) và cắt nhầm ngân sách của các kênh nhận diện đầu phễu (như TikTok Content, SEO)",
          "Khiến quảng cáo bị dừng hoàn toàn",
          "Tự động làm tăng ngân sách chạy quảng cáo",
          "Bị sai lệch tiền thuế doanh nghiệp"
        ],
        correct: 0,
        explanation: "Last Touch đánh giá thấp các kênh đầu phễu. Nếu cắt kênh đầu phễu, khách hàng sẽ không bao giờ biết đến thương hiệu để có kênh cuối mà chốt đơn."
      },
      {
        id: "q10_4",
        question: "Meta báo doanh thu 400 triệu, Google báo 300 triệu, nhưng hệ thống bán hàng chỉ ghi nhận 500 triệu. Cách hiểu đúng là gì?",
        options: [
          "Một trong hai nền tảng đang báo cáo gian lận",
          "Có 200 triệu là đơn hàng được cả hai nền tảng cùng ghi nhận do khách chạm vào cả hai kênh, nên phải dùng con số 500 triệu từ hệ thống bán hàng",
          "Hệ thống bán hàng bị lỗi và cần kiểm tra lại",
          "Nên lấy trung bình cộng của ba con số để báo cáo"
        ],
        correct: 1,
        explanation: "Mỗi nền tảng đều nhận trọn công về mình khi khách có chạm vào quảng cáo của họ, dẫn tới ghi nhận trùng. Con số đáng tin duy nhất là doanh thu thật từ hệ thống bán hàng."
      },
      {
        id: "q10_5",
        question: "Báo cáo cho thấy ROAS trung bình toàn tài khoản là 3,0 lần. Vì sao Trưởng phòng không nên dừng lại ở con số này?",
        options: [
          "Vì ROAS 3,0 lần là quá thấp so với mọi ngành",
          "Vì số trung bình có thể che giấu phân hoá, ví dụ một chiến dịch đạt 8,0 lần bù cho bốn chiến dịch chỉ đạt 1,2 lần, cần nhìn phân bố để biết nên tắt cái nào",
          "Vì ROAS luôn bị nền tảng tính sai",
          "Vì cần đổi sang chỉ số CPM để đánh giá chính xác hơn"
        ],
        correct: 1,
        explanation: "Số trung bình che giấu phân hoá. Nhìn vào phân bố mới thấy chiến dịch nào đang gánh và chiến dịch nào đang lỗ, từ đó biết nên dồn hay cắt ngân sách ở đâu."
      }
    ]
  },
  {
    id: "module-11",
    number: "11",
    title: "Project Consulting",
    subtitle: "Tư vấn dự án của học viên",
    description: "Tư vấn kế hoạch Digital Marketing của học viên, hỗ trợ doanh nghiệp có định hướng chiến lược, cách thức triển khai Digital Marketing hiệu quả.",
    icon: "Briefcase",
    badge: "Thực Chiến & Consulting",
    duration: "80 phút",
    lessonsCount: 3,
    quizCount: 5,
    sections: [
      {
        id: "m11-s1",
        title: "1. Tiêu chí Đánh giá & Phê duyệt Kế hoạch Chiến lược",
        content: `### Bộ 5 Tiêu chí thẩm định Kế hoạch của Digital Manager

1. Tính khả thi (Feasibility): Đội ngũ nhân sự và ngân sách hiện tại có thực hiện nổi không?
2. Tính đồng bộ (Alignment): Kế hoạch Digital có phục vụ trực tiếp mục tiêu kinh doanh chung của công ty không?
3. Khả năng mở rộng (Scalability): Khi nâng ngân sách gấp 3 lần, kênh quảng cáo có bị chạm trần không?
4. Quản trị rủi ro (Risk Control): Có phương án dự phòng B khi tài khoản quảng cáo bị vô hiệu hóa không?
5. Luận điểm tài chính (ROI Defense): Có giải trình thuyết phục được Giám đốc Tài chính không?`
      },
      {
        id: "m11-s2",
        title: "2. Case Study Thực chiến: Tái cấu trúc phòng Digital Marketing",
        content: `### Tình huống xử lý khủng hoảng hiệu suất doanh nghiệp

* Bối cảnh: Doanh nghiệp có doanh thu 5 tỷ/tháng nhưng chạy quảng cáo lỗ vì chi phí CPA tăng gấp 3 lần.
* Chẩn đoán của Trưởng phòng mới: 100% ngân sách phụ thuộc duy nhất vào Meta Ads, không có kênh SEO và không có hệ thống chăm sóc lại khách cũ.
* Giải pháp 90 ngày: Chuyển 20% ngân sách sang TikTok Live và Booking KOC, triển khai Zalo Automation nhắn tin mua lại lần 2 tăng LTV thêm 35%.
* Kết quả: Chi phí CPA giảm 42%, chỉ số Blended ROAS tổng tăng từ 1.8x lên 3.6x sau 3 tháng.`
      },
      {
        id: "m11-s3",
        title: "3. Chuyên sâu: Khung tư vấn 5 bước và hồ sơ chẩn đoán mẫu",
        content: `### Cách tiếp cận một doanh nghiệp bạn chưa biết gì

Khi được giao tư vấn hoặc tiếp quản một phòng Digital Marketing mới, sai lầm lớn nhất là đề xuất giải pháp trong tuần đầu. Khung 5 bước dưới đây buộc bạn chẩn đoán trước khi kê đơn.

#### Bước 1 - Xác định bài toán thật, không phải bài toán được kể

Khách hàng thường mô tả triệu chứng chứ không phải bệnh. Câu nói quảng cáo Facebook không hiệu quả có thể che giấu nhiều nguyên nhân khác nhau: sản phẩm không có nhu cầu, giá cao hơn đối thủ, đội tư vấn phản hồi chậm, hoặc thật sự là do quảng cáo.

Câu hỏi cần đặt: nếu vấn đề này được giải quyết hoàn toàn thì con số nào sẽ thay đổi, và thay đổi bao nhiêu.

#### Bước 2 - Thu thập dữ liệu tối thiểu

Bảy dữ liệu cần có trước khi kết luận bất cứ điều gì:

1. Doanh thu và số đơn theo tháng trong 12 tháng gần nhất.
2. Chi phí quảng cáo theo kênh trong cùng kỳ.
3. Chi phí thu hút một khách hàng và xu hướng của nó.
4. Tỷ lệ chuyển đổi ở từng bước phễu.
5. Tỷ lệ khách hàng mua lại và giá trị trọn đời.
6. Biên lợi nhuận gộp trên mỗi đơn hàng.
7. Quy mô đội ngũ và ai đang chịu trách nhiệm khâu nào.

#### Bước 3 - Định vị điểm nghẽn

So sánh tỷ lệ chuyển đổi từng bước với chuẩn của chính doanh nghiệp trong quá khứ. Điểm nghẽn là bước có mức sụt giảm bất thường nhất, không phải bước có tỷ lệ thấp nhất.

#### Bước 4 - Đề xuất theo thứ tự đòn bẩy

Sắp xếp giải pháp theo tỷ lệ giữa tác động và công sức, làm việc dễ và tác động lớn trước.

#### Bước 5 - Thiết kế cách đo

Mỗi đề xuất phải gắn với một chỉ số, một mốc thời gian và một ngưỡng để kết luận thành hay bại.

#### Hồ sơ chẩn đoán mẫu: Cửa hàng thời trang trực tuyến

Số liệu giả định để minh hoạ.

**Triệu chứng khách hàng kể:** Chạy quảng cáo ngày càng đắt, tháng này lỗ.

**Dữ liệu thu được:**

* Doanh thu 12 tháng đi ngang quanh 800 triệu mỗi tháng.
* Chi phí quảng cáo tăng từ 120 triệu lên 210 triệu trong cùng kỳ.
* Chi phí thu hút khách tăng từ 190.000 lên 340.000 đồng.
* Tỷ lệ mua lại trong 90 ngày chỉ 8%.
* Biên lợi nhuận gộp 42%. Giá trị đơn trung bình 620.000 đồng.

**Chẩn đoán:** Vấn đề không nằm ở quảng cáo. Với biên gộp 42%, mỗi đơn 620.000 đồng mang về 260.000 đồng lợi nhuận gộp, trong khi chi phí thu hút đã là 340.000 đồng. **Doanh nghiệp lỗ 80.000 đồng trên mỗi khách hàng mới.** Mô hình chỉ có lãi nếu khách quay lại mua lần hai, nhưng tỷ lệ mua lại chỉ 8%.

Nguyên nhân gốc: doanh nghiệp đang vận hành như mô hình mua một lần trong khi cấu trúc chi phí đòi hỏi mô hình mua nhiều lần.

**Đề xuất theo thứ tự đòn bẩy:**

1. Dựng chuỗi chăm sóc sau mua trong 30 ngày để nâng tỷ lệ mua lại từ 8% lên 20%. Công sức thấp, tác động lớn nhất. Khi đạt 20%, giá trị trọn đời tăng lên khoảng 744.000 đồng và mô hình có lãi trở lại.
2. Nâng giá trị đơn trung bình bằng gợi ý mua kèm, mục tiêu từ 620.000 lên 750.000 đồng.
3. Chỉ sau khi hai việc trên chạy ổn mới quay lại tối ưu quảng cáo.

**Cách đo:** Theo dõi tỷ lệ mua lại 90 ngày và giá trị trọn đời theo nhóm khách hàng vào từng tháng. Ngưỡng kết luận: sau 60 ngày, nếu tỷ lệ mua lại chưa đạt 14% thì giả thuyết sai và cần xem lại chất lượng sản phẩm.`,
        takeaway: "Khi chi phí thu hút khách vượt lợi nhuận gộp mỗi đơn, vấn đề nằm ở mô hình kinh doanh chứ không nằm ở quảng cáo. Tối ưu giá thầu lúc này chỉ làm chậm tốc độ lỗ."
      }
    ],
    quiz: [
      {
        id: "q11_1",
        question: "Doanh nghiệp của bạn đang bị khóa tài khoản quảng cáo chính vào đúng tuần sale cao điểm nhất năm. Là Trưởng phòng Digital Marketing, hành động khẩn cấp đầu tiên của bạn là gì?",
        options: [
          "Kích hoạt ngay hệ thống tài khoản quảng cáo dự phòng (Backup BM/Ad Accounts) đã chuẩn bị sẵn và điều hướng ngân sách sang kênh phụ",
          "Nghỉ việc ngay lập tức để tránh trách nhiệm",
          "Ngồi chờ phản hồi từ đội ngũ hỗ trợ Facebook trong 2 tuần",
          "Đổ lỗi cho nhân viên chạy Ads"
        ],
        correct: 0,
        explanation: "Phương án dự phòng tài khoản (Contingency Account Infrastructure) là yêu cầu bắt buộc đối với một Trưởng phòng bài bản để đảm bảo dòng tiền kinh doanh không bị ngắt đoạn."
      },
      {
        id: "q11_2",
        question: "Khi bảo vệ bản kế hoạch Digital Marketing trước Hội đồng Quản trị, câu hỏi quan trọng nhất mà Trưởng phòng cần trả lời tự tin là gì?",
        options: [
          "Mỗi 1 đồng ngân sách chi ra sẽ mang về bao nhiêu đồng doanh thu/lợi nhuận ròng và bao giờ hòa vốn?",
          "Bài viết trên mạng xã hội sẽ sử dụng màu sắc phông nền gì?",
          "Tại sao nhân viên không đi làm đúng giờ?",
          "Mẫu áo đồng phục dự án trông như thế nào?"
        ],
        correct: 0,
        explanation: "Hội đồng quản trị và nhà đầu tư quan tâm nhất tới bài toán hiệu quả tài chính (Financial Return & Payback Period)."
      },
      {
        id: "q11_3",
        question: "Chỉ số nào cho thấy hoạt động chăm sóc khách hàng cũ (Retention/CRM) của phòng Digital Marketing đang phát huy tác dụng rõ rệt?",
        options: [
          "Tỷ lệ khách hàng mua lại (Repeat Purchase Rate) tăng và Chi phí thu hút khách hàng trung bình (Blended CAC) giảm",
          "Số lượng tin nhắn rác nhận được hàng ngày",
          "Giá bán niêm yết của sản phẩm tăng lên",
          "Số lượt thích trang Fanpage tăng đột biến"
        ],
        correct: 0,
        explanation: "Khi tệp khách cũ mua lại nhiều (Repeat Purchase Rate cao), doanh nghiệp thu thêm doanh thu mà không mất thêm tiền quảng cáo mới, giúp Blended CAC giảm đáng kể."
      },
      {
        id: "q11_4",
        question: "Doanh nghiệp có giá trị đơn trung bình 500.000 đồng, biên lợi nhuận gộp 40%, chi phí thu hút khách hàng mới 250.000 đồng, tỷ lệ mua lại gần như bằng 0. Kết luận đúng là gì?",
        options: [
          "Mô hình đang có lãi tốt vì doanh thu cao hơn chi phí thu hút",
          "Lợi nhuận gộp mỗi đơn chỉ 200.000 đồng trong khi chi phí thu hút 250.000 đồng, doanh nghiệp lỗ 50.000 đồng mỗi khách mới, cần sửa mô hình chứ không phải tối ưu quảng cáo",
          "Cần tăng gấp đôi ngân sách quảng cáo để đạt quy mô",
          "Cần đổi nền tảng quảng cáo để giảm chi phí thu hút"
        ],
        correct: 1,
        explanation: "Lợi nhuận gộp mỗi đơn bằng 500.000 nhân 40% bằng 200.000 đồng, thấp hơn chi phí thu hút 250.000 đồng. Khi không có mua lại, mỗi khách mới làm doanh nghiệp lỗ thêm. Tăng ngân sách chỉ khuếch đại khoản lỗ."
      },
      {
        id: "q11_5",
        question: "Theo khung tư vấn 5 bước, vì sao không nên đề xuất giải pháp ngay trong tuần đầu tiếp quản?",
        options: [
          "Vì cần thời gian làm quen với đồng nghiệp mới",
          "Vì khách hàng thường mô tả triệu chứng chứ không phải nguyên nhân gốc, đề xuất sớm dễ giải quyết sai vấn đề",
          "Vì quy trình công ty yêu cầu chờ phê duyệt",
          "Vì cần đợi hết chu kỳ ngân sách quý hiện tại"
        ],
        correct: 1,
        explanation: "Câu nói quảng cáo không hiệu quả có thể che giấu nhiều nguyên nhân khác nhau như sản phẩm, giá, tốc độ phản hồi của đội tư vấn hoặc mô hình kinh doanh. Chẩn đoán bằng dữ liệu trước khi kê đơn là bắt buộc."
      }
    ]
  }
];
