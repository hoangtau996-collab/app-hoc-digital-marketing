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
    lessonsCount: 3,
    quizCount: 3,
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
    quizCount: 3,
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
    quizCount: 3,
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
    quizCount: 3,
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
    quizCount: 3,
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
    quizCount: 3,
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
    quizCount: 3,
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
    quizCount: 3,
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
    quizCount: 3,
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
    quizCount: 3,
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
    quizCount: 3,
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
      }
    ]
  }
];
