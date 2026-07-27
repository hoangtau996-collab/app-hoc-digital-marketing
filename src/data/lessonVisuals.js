/**
 * Minh hoạ cho từng bài học, tra theo sectionId.
 *
 * Mỗi bài một sơ đồ riêng. Trước đây sơ đồ chỉ lọc theo moduleId nên bị lặp lại
 * ở mọi bài trong cùng chuyên đề.
 *
 * Các kiểu dùng được: compare | bars | flow | funnel | stats
 * Màu dùng được: emerald | amber | teal | rose | sky
 */
export const LESSON_VISUALS = {
  /* ================= CHUYÊN ĐỀ 01 ================= */
  'm1-s1': {
    kind: 'compare',
    title: '📊 Đối chiếu 2 trụ cột: Performance và Brand',
    badge: 'Hai bánh xe cùng cỗ xe',
    items: [
      {
        label: 'PERFORMANCE',
        tag: 'Ngắn hạn',
        color: 'teal',
        points: [
          'Nhắm tệp đang có nhu cầu',
          'Đo bằng CPA, ROAS, CVR',
          'Thu hồi vốn nhanh, tăng giảm linh hoạt',
          'Rủi ro: chạm trần khi tệp cạn',
        ],
      },
      {
        label: 'BRAND',
        tag: 'Dài hạn',
        color: 'amber',
        points: [
          'Nhắm toàn bộ thị trường',
          'Đo bằng Brand Search, Sentiment, LTV',
          'Giảm chi phí thu hút khách về sau',
          'Rủi ro: khó đo ROI ngắn hạn',
        ],
      },
    ],
  },
  'm1-s2': {
    kind: 'bars',
    title: '📊 Tỷ lệ Brand / Performance theo ngành hàng',
    badge: 'Les Binet & Peter Field',
    items: [
      { label: 'Thương mại điện tử & Bán lẻ', percent: 40, value: '40% Brand', color: 'teal', note: 'Ưu tiên dòng tiền và chuyển đổi trực tiếp' },
      { label: 'Sản phẩm giá trị cao / Bất động sản', percent: 70, value: '70% Brand', color: 'amber', note: 'Niềm tin quyết định, chu kỳ cân nhắc dài' },
      { label: 'Hàng tiêu dùng nhanh', percent: 70, value: '70% Brand', color: 'amber', note: 'Cần hiện diện liên tục trên mọi điểm chạm' },
      { label: 'Khởi nghiệp giai đoạn đầu', percent: 20, value: '20% Brand', color: 'rose', note: 'Chứng minh mô hình trước, xây thương hiệu sau' },
    ],
  },
  'm1-s3': {
    kind: 'flow',
    title: '📊 Quy đổi mục tiêu Kinh doanh sang chỉ số Digital',
    badge: 'Ma trận chuyển đổi',
    steps: [
      { label: 'Doanh thu tăng 50%', desc: 'Quy thành New CAC, ROAS, Volume Leads, CVR', color: 'emerald' },
      { label: 'Tăng tỷ suất lợi nhuận ròng', desc: 'Quy thành Retargeting CPL, Retention Rate, Organic Traffic Share', color: 'teal' },
      { label: 'Định vị phân khúc cao cấp', desc: 'Quy thành Brand Search Volume, Engagement Rate, Impression Share', color: 'amber' },
    ],
  },
  'm1-s4': {
    kind: 'stats',
    title: '📊 Định luật 95-5 và kết quả sau 12 tháng',
    badge: 'Ehrenberg-Bass Institute',
    items: [
      { label: 'Đang có nhu cầu mua ngay', value: '5%', note: 'Vùng Performance cạnh tranh', color: 'teal' },
      { label: 'Chưa có nhu cầu', value: '95%', note: 'Vùng Brand gieo nhận biết', color: 'amber' },
      { label: 'ROAS phương án dồn Performance', value: '2,67x', note: '200 đơn, không tăng thêm', color: 'rose' },
      { label: 'ROAS phương án 40 Brand / 60 Perf', value: '2,81x', note: '211 đơn và vẫn đang tăng', color: 'emerald' },
    ],
    footnote: 'Số liệu giả định để minh hoạ cách tính. Điểm hoà vốn giữa hai phương án thường rơi vào tháng thứ 5 đến thứ 8.',
  },

  /* ================= CHUYÊN ĐỀ 02 ================= */
  'm2-s1': {
    kind: 'compare',
    title: '📊 Đẩy và Kéo: Outbound đối chiếu Inbound',
    badge: 'Bản chất hai chiều',
    items: [
      {
        label: 'OUTBOUND (Đẩy)',
        tag: 'Chủ động',
        color: 'rose',
        points: ['Thương hiệu chủ động tìm khách', 'Quảng cáo trả phí, tiếp cận nhanh', 'Tắt tiền là tắt kết quả'],
      },
      {
        label: 'INBOUND (Kéo)',
        tag: 'Tích luỹ',
        color: 'emerald',
        points: ['Khách chủ động tìm tới thương hiệu', 'Nội dung, SEO, cộng đồng', 'Tài sản tiếp tục sinh lợi'],
      },
    ],
  },
  'm2-s2': {
    kind: 'flow',
    title: '📊 Vòng quay Flywheel phối hợp Inbound và Outbound',
    badge: 'Ba giai đoạn',
    steps: [
      { label: 'Attract - Thu hút', desc: 'Nội dung hữu ích và quảng cáo tiếp cận tệp lạnh', color: 'sky' },
      { label: 'Engage - Tương tác', desc: 'Tài liệu miễn phí, dùng thử, tư vấn để đổi lấy thông tin', color: 'teal' },
      { label: 'Delight - Thoả mãn', desc: 'Email tự động và bám đuổi để biến khách thành người giới thiệu', color: 'emerald' },
    ],
  },
  'm2-s3': {
    kind: 'stats',
    title: '📊 Chi phí mỗi khách hàng sau 12 tháng',
    badge: 'Hai đường cong ngược nhau',
    items: [
      { label: 'Outbound tháng 1-3', value: '800K', note: '125 khách/tháng', color: 'teal' },
      { label: 'Outbound tháng 10-12', value: '1,15Tr', note: 'Tăng dần do bão hoà', color: 'rose' },
      { label: 'Inbound tháng 1-3', value: '5,0Tr', note: 'Chỉ 20 khách, đang xây tài sản', color: 'rose' },
      { label: 'Inbound tháng 10-12', value: '475K', note: '210 khách và tiếp tục giảm', color: 'emerald' },
    ],
    footnote: 'Số liệu giả định. Sau 12 tháng tổng lượng khách gần bằng nhau, khác biệt thật nằm ở tháng thứ 13: Outbound dừng chi là về 0, Inbound vẫn chạy.',
  },

  /* ================= CHUYÊN ĐỀ 03 ================= */
  'm3-s1': {
    kind: 'compare',
    title: '📊 Các phương pháp lập ngân sách Marketing',
    badge: 'Chọn theo giai đoạn',
    items: [
      { label: 'THEO % DOANH THU', tag: 'Phổ biến', color: 'teal', points: ['Dễ tính, dễ duyệt', 'Nhược: ngân sách giảm đúng lúc cần tăng'] },
      { label: 'THEO MỤC TIÊU', tag: 'Chuẩn xác', color: 'emerald', points: ['Tính ngược từ mục tiêu qua phễu', 'Bảo vệ được trước Ban Giám Đốc'] },
      { label: 'THEO ĐỐI THỦ', tag: 'Phòng thủ', color: 'amber', points: ['Bám theo mức chi của đối thủ', 'Nhược: chạy theo, không chủ động'] },
    ],
  },
  'm3-s2': {
    kind: 'bars',
    title: '📊 Quy tắc phân bổ 70 / 20 / 10',
    badge: 'Cân bằng ổn định và đột phá',
    items: [
      { label: '70% Kênh cốt lõi đã chứng minh', percent: 70, color: 'emerald', note: 'Meta, Google Search, các kênh đang có ROAS ổn định' },
      { label: '20% Kênh tiềm năng đang lên', percent: 20, color: 'teal', note: 'TikTok, Shopee Ads, kênh mới nổi có dữ liệu khả quan' },
      { label: '10% Thử nghiệm đột phá', percent: 10, color: 'amber', note: 'Ý tưởng mới, công nghệ AI, kênh chưa ai làm' },
    ],
  },
  'm3-s3': {
    kind: 'funnel',
    title: '📊 Tính ngược ngân sách từ mục tiêu doanh thu',
    badge: 'Trung tâm Anh ngữ, mục tiêu 3 tỷ',
    stages: [
      { label: 'Doanh thu mục tiêu', value: '3 tỷ', raw: 100, color: 'emerald' },
      { label: 'Hợp đồng cần có (÷ 20 triệu)', value: '150 HĐ', raw: 72, color: 'teal' },
      { label: 'Khách tiềm năng (÷ tỷ lệ chốt 12%)', value: '1.250', raw: 52, color: 'sky' },
      { label: 'Khách thô (÷ tỷ lệ liên hệ 60%)', value: '2.084', raw: 38, color: 'amber' },
      { label: 'Ngân sách quảng cáo (× 180K)', value: '375 triệu', raw: 26, color: 'rose' },
    ],
    footnote: 'Cộng thêm 135 triệu chi phí vận hành thành 510 triệu, chiếm 17% doanh thu. Nâng tỷ lệ liên hệ từ 60% lên 75% tiết kiệm 75 triệu mỗi tháng mà không cần đụng tới quảng cáo.',
  },

  /* ================= CHUYÊN ĐỀ 04 ================= */
  'm4-s1': {
    kind: 'flow',
    title: '📊 Sơ đồ tổ chức phòng Digital Marketing',
    badge: 'Vai trò cốt lõi',
    steps: [
      { label: 'Trưởng phòng Digital', desc: 'Chiến lược, ngân sách, báo cáo Ban Giám Đốc', color: 'amber' },
      { label: 'Chuyên viên Quảng cáo', desc: 'Vận hành Meta, Google, TikTok và tối ưu giá thầu', color: 'teal' },
      { label: 'Chuyên viên Nội dung', desc: 'Kịch bản, bài viết, tuyến nội dung theo phễu', color: 'emerald' },
      { label: 'Thiết kế và Dựng phim', desc: 'Sản xuất ấn phẩm và video quảng cáo', color: 'sky' },
      { label: 'Phân tích Dữ liệu', desc: 'Báo cáo, kiểm định, tối ưu chuyển đổi', color: 'rose' },
    ],
  },
  'm4-s2': {
    kind: 'compare',
    title: '📊 Giữ trong nhà hay thuê ngoài',
    badge: 'Ranh giới phân chia',
    items: [
      {
        label: 'GIỮ IN-HOUSE',
        tag: 'Cốt lõi',
        color: 'emerald',
        points: ['Dữ liệu khách hàng CRM', 'Quyền quản trị tài khoản quảng cáo', 'Chiến lược thương hiệu và cơ chế giá'],
      },
      {
        label: 'THUÊ NGOÀI',
        tag: 'Biến động',
        color: 'amber',
        points: ['Chiến dịch lớn theo mùa vụ', 'Sản xuất video quy mô lớn', 'Đặt bài báo và booking người ảnh hưởng'],
      },
    ],
  },
  'm4-s3': {
    kind: 'stats',
    title: '📊 Tuyển thêm người hay thuê Agency',
    badge: 'Ngân sách 600 triệu/tháng',
    items: [
      { label: 'Tuyển 1 chuyên viên', value: '25Tr', note: 'Chi phí mỗi tháng', color: 'emerald' },
      { label: 'Lợi ích ròng phương án tuyển', value: '+155Tr', note: 'ROAS 3,0 lên 3,3', color: 'emerald' },
      { label: 'Agency ăn 15% ngân sách', value: '90Tr', note: 'Chi phí mỗi tháng', color: 'amber' },
      { label: 'Lợi ích ròng phương án Agency', value: '+150Tr', note: 'ROAS 3,0 lên 3,4', color: 'amber' },
    ],
    footnote: 'Số liệu giả định. Khi ngân sách tăng lên 1,2 tỷ, phí Agency thành 180 triệu còn lương nhân sự vẫn 25 triệu: chi phí Agency tăng tuyến tính, chi phí nhân sự thì không.',
  },

  /* ================= CHUYÊN ĐỀ 05 ================= */
  'm5-s1': {
    kind: 'flow',
    title: '📊 Bộ 5 công cụ nghiên cứu thị trường',
    badge: 'Mỗi công cụ một câu hỏi',
    steps: [
      { label: 'Google Trends', desc: 'Xu hướng quan tâm theo thời gian và vùng miền', color: 'sky' },
      { label: 'Meta Ads Library', desc: 'Đối thủ đang chạy mẫu nào, mẫu nào chạy lâu nhất', color: 'teal' },
      { label: 'Google Keyword Planner', desc: 'Dung lượng tìm kiếm và mức cạnh tranh từ khoá', color: 'emerald' },
      { label: 'KeywordTool.io', desc: 'Nhu cầu tìm kiếm thực tế trên Google, Shopee, YouTube', color: 'amber' },
      { label: 'BuzzSumo', desc: 'Chủ đề nào đang được chia sẻ nhiều nhất', color: 'rose' },
    ],
  },
  'm5-s2': {
    kind: 'compare',
    title: '📊 Định lượng và Định tính: hai câu hỏi khác nhau',
    badge: 'Định tính trước, Định lượng sau',
    items: [
      {
        label: 'ĐỊNH LƯỢNG',
        tag: 'Bao nhiêu',
        color: 'teal',
        points: ['Đo quy mô, tỷ lệ, xu hướng', 'Cần 200-400 phản hồi mỗi phân khúc', 'Cho ra số phần trăm để trình báo cáo'],
      },
      {
        label: 'ĐỊNH TÍNH',
        tag: 'Vì sao',
        color: 'amber',
        points: ['Hiểu động cơ và rào cản tâm lý', 'Chỉ cần 8-12 cuộc phỏng vấn sâu', 'Cho ra câu nói nguyên văn của khách'],
      },
    ],
    footnote: 'Làm ngược thứ tự sẽ dẫn tới bảng khảo sát chỉ chứa các lựa chọn do người làm marketing tự nghĩ ra, bỏ sót đúng lý do thật của khách hàng.',
  },
  'm5-s3': {
    kind: 'flow',
    title: '📊 Phân tích đối thủ theo 3 lớp',
    badge: 'Từ ngoài vào trong',
    steps: [
      { label: 'Lớp 1 - Hiển thị: họ đang nói gì', desc: 'Mẫu quảng cáo chạy liên tục trên 30 ngày là bằng chứng đáng tin nhất về hiệu quả', color: 'sky' },
      { label: 'Lớp 2 - Cấu trúc: họ bán thế nào', desc: 'Đóng vai khách hàng thật đi hết hành trình mua, ghi lại kịch bản tư vấn và chuỗi chăm sóc', color: 'teal' },
      { label: 'Lớp 3 - Kinh tế: họ chịu được mức nào', desc: 'Ai có giá trị trọn đời khách hàng cao hơn thì luôn trả được giá thầu cao hơn', color: 'amber' },
    ],
  },
  'm5-s4': {
    kind: 'funnel',
    title: '📊 Dung lượng thị trường TAM - SAM - SOM',
    badge: 'Dịch vụ kế toán hộ kinh doanh',
    stages: [
      { label: 'TAM - Tổng thị trường (280.000 hộ)', value: '5.040 tỷ', raw: 100, color: 'emerald' },
      { label: 'Lọc hộ đủ lớn cần kế toán thuê (35%)', value: '98.000 hộ', raw: 35, color: 'teal' },
      { label: 'SAM - Sẵn sàng dùng dịch vụ trực tuyến (40%)', value: '705 tỷ', raw: 14, color: 'sky' },
      { label: 'SOM - Giành được với 3 tỷ ngân sách', value: '21,6 tỷ', raw: 4, color: 'amber' },
    ],
    footnote: 'Số liệu giả định. SOM bằng ngân sách chia chi phí thu hút khách, tương đương 3,1% của SAM. Đây là công cụ mạnh nhất để thương lượng lại một mục tiêu phi thực tế.',
  },

  /* ================= CHUYÊN ĐỀ 06 ================= */
  'm6-s1': {
    kind: 'flow',
    title: '📊 Xây dựng Customer Persona 360',
    badge: 'Bốn lớp thông tin',
    steps: [
      { label: 'Nhân khẩu học', desc: 'Tuổi, giới tính, thu nhập, khu vực, nghề nghiệp', color: 'sky' },
      { label: 'Hành vi số', desc: 'Dùng nền tảng nào, khung giờ nào, tiêu thụ nội dung ra sao', color: 'teal' },
      { label: 'Mục tiêu và nỗi đau', desc: 'Họ muốn đạt điều gì và điều gì đang cản họ', color: 'amber' },
      { label: 'Rào cản mua hàng', desc: 'Lý do khiến họ chần chừ dù đã thấy nhu cầu', color: 'rose' },
    ],
  },
  'm6-s2': {
    kind: 'flow',
    title: '📊 Đào sâu Insight: Truth - Need - Friction',
    badge: 'Ví dụ ngành Anh ngữ',
    steps: [
      { label: 'Truth - Sự thật', desc: 'Người đi làm biết tiếng Anh quan trọng cho thăng tiến', color: 'sky' },
      { label: 'Need - Nhu cầu', desc: 'Muốn nói trôi chảy trong họp với đối tác nước ngoài', color: 'teal' },
      { label: 'Friction - Rào cản', desc: 'Sợ phát âm sai và ngượng ngùng trước mặt người khác', color: 'rose' },
      { label: 'Insight thật', desc: 'Tôi không ngại học, tôi cần một nơi luyện nói riêng tư để không bị ai đánh giá', color: 'emerald' },
    ],
  },
  'm6-s3': {
    kind: 'compare',
    title: '📊 Phân khúc RFM và hành động tương ứng',
    badge: 'Recency - Frequency - Monetary',
    items: [
      {
        label: 'ĐIỂM 5-5-5',
        tag: 'Trung thành',
        color: 'emerald',
        value: 'Đừng chi bám đuổi',
        points: ['Họ đã mua rồi', 'Dành cho họ chương trình giới thiệu bạn bè'],
      },
      {
        label: 'ĐIỂM 1-5-5',
        tag: 'Đáng cứu nhất',
        color: 'amber',
        value: 'Dồn ngân sách vào đây',
        points: ['Từng chi nhiều, lâu rồi chưa quay lại', 'Kéo về rẻ hơn tìm khách mới tương đương'],
      },
      {
        label: 'ĐIỂM 1-1-1',
        tag: 'Đã mất',
        color: 'rose',
        value: 'Đưa vào loại trừ',
        points: ['Đừng chi thêm đồng nào', 'Loại khỏi tệp để không đốt ngân sách'],
      },
    ],
    footnote: 'Đa số doanh nghiệp chạy bám đuổi cho toàn bộ danh sách khách đã mua, tức chia đều tiền cho cả nhóm sắp mua lẫn nhóm đã bỏ đi.',
  },

  /* ================= CHUYÊN ĐỀ 07 ================= */
  'm7-s1': {
    kind: 'flow',
    title: '📊 Cấu trúc Ngôi nhà Thông điệp',
    badge: 'Message House',
    steps: [
      { label: 'Mái nhà - Thông điệp chủ đạo', desc: 'Một câu duy nhất tóm gọn lời hứa của thương hiệu', color: 'amber' },
      { label: 'Cột trụ - Ba luận điểm chống đỡ', desc: 'Ba lý do chính khiến lời hứa đó đáng tin', color: 'teal' },
      { label: 'Nền móng - Bằng chứng', desc: 'Số liệu, chứng nhận, đánh giá khách hàng thật', color: 'emerald' },
    ],
  },
  'm7-s2': {
    kind: 'funnel',
    title: '📊 Công thức Hook - Story - Offer cho video ngắn',
    badge: 'Phân bổ theo giây',
    stages: [
      { label: '0-3 giây: Hook chặn ngón tay lướt', value: '3 giây', raw: 100, color: 'rose' },
      { label: '3-30 giây: Story dẫn dắt chuyển biến', value: '27 giây', raw: 62, color: 'teal' },
      { label: '5 giây cuối: Offer và lời kêu gọi', value: '5 giây', raw: 30, color: 'amber' },
    ],
  },
  'm7-s3': {
    kind: 'stats',
    title: '📊 Bốn chỉ số chẩn đoán mẫu quảng cáo',
    badge: 'So sánh mẫu A và mẫu B',
    items: [
      { label: 'Hook Rate — mẫu A / B', value: '28% / 15,8%', note: 'Sức hút 3 giây đầu', color: 'sky' },
      { label: 'Hold Rate — mẫu A / B', value: '8,6% / 26,3%', note: 'Sức giữ chân phần thân', color: 'teal' },
      { label: 'CTR — mẫu A / B', value: '0,7% / 1,0%', note: 'Sức thuyết phục lời kêu gọi', color: 'amber' },
      { label: 'Đơn hàng — mẫu A / B', value: '42 / 168', note: 'Mẫu B gấp 4 lần', color: 'emerald' },
    ],
    footnote: 'Mẫu A mở đầu giật gân hơn nhưng phần thân rỗng. Hành động đúng không phải bỏ mẫu A, mà ghép 3 giây đầu của A vào phần thân của B rồi chạy lại.',
  },

  /* ================= CHUYÊN ĐỀ 08 ================= */
  'm8-s1': {
    kind: 'flow',
    title: '📊 Tám động cơ kích hoạt lan truyền',
    badge: 'Viral Triggers',
    steps: [
      { label: 'Cảm xúc mạnh', desc: 'Kinh ngạc, phẫn nộ, xúc động đều thúc đẩy chia sẻ', color: 'rose' },
      { label: 'Giá trị thực dụng', desc: 'Hữu ích tới mức không chia sẻ thấy có lỗi với bạn bè', color: 'emerald' },
      { label: 'Tiền tệ xã hội', desc: 'Chia sẻ để trông thông minh và có gu hơn', color: 'amber' },
      { label: 'Thử thách cộng đồng', desc: 'Trào lưu để mọi người cùng hưởng ứng và biến tấu', color: 'teal' },
      { label: 'Hành trình vượt khó', desc: 'Câu chuyện truyền cảm hứng chạm vào sự đồng cảm', color: 'sky' },
    ],
  },
  'm8-s2': {
    kind: 'stats',
    title: '📊 Hệ số lan truyền K-Factor',
    badge: 'K = lời mời × tỷ lệ tham gia',
    items: [
      { label: 'Lời mời mỗi người gửi', value: '4', note: 'Từ 10.000 người ban đầu', color: 'sky' },
      { label: 'Tỷ lệ người nhận tham gia', value: '15%', note: 'Cài đặt và kích hoạt', color: 'teal' },
      { label: 'K-Factor', value: '0,6', note: 'Nhỏ hơn 1: lan truyền tắt dần', color: 'rose' },
      { label: 'Tổng người dùng cộng dồn', value: '~15.000', note: 'Nhân đôi rưỡi rồi dừng', color: 'amber' },
    ],
    footnote: 'Để đạt K bằng 1 cần nâng lời mời từ 4 lên 6,7 hoặc nâng tỷ lệ tham gia từ 15% lên 25%. Nâng tỷ lệ tham gia thường dễ hơn vì phụ thuộc mức thưởng và số bước thao tác.',
  },
  'm8-s3': {
    kind: 'funnel',
    title: '📊 Ma sát quy trình: mỗi bước thừa cắt mất một nửa',
    badge: 'Từ 100.000 người nhìn thấy',
    stages: [
      { label: 'Nhìn thấy lời kêu gọi', value: '100.000', raw: 100, color: 'emerald' },
      { label: 'Bấm vào liên kết', value: '20.000', raw: 20, drop: '-80%', color: 'teal' },
      { label: 'Đăng ký tài khoản', value: '9.000', raw: 9, drop: '-55%', color: 'sky' },
      { label: 'Xác minh email', value: '4.500', raw: 4.5, drop: '-50%', color: 'amber' },
      { label: 'Tải ứng dụng', value: '1.800', raw: 1.8, drop: '-60%', color: 'rose' },
      { label: 'Thực sự chia sẻ', value: '800', raw: 0.8, drop: '-56%', color: 'rose' },
    ],
    footnote: 'Mất 99,2% hoàn toàn do thiết kế quy trình chứ không phải do nội dung dở. Cắt được hai bước giữa là đã nhân ba kết quả.',
  },

  /* ================= CHUYÊN ĐỀ 09 ================= */
  'm9-s1': {
    kind: 'flow',
    title: '📊 Khung SOSTAC lập Master Plan',
    badge: 'Sáu bước',
    steps: [
      { label: 'Situation - Hiện trạng', desc: 'Ta đang ở đâu: số liệu nền, thị phần, năng lực đội ngũ', color: 'sky' },
      { label: 'Objectives - Mục tiêu', desc: 'Ta muốn tới đâu: con số cụ thể kèm mốc thời gian', color: 'emerald' },
      { label: 'Strategy - Chiến lược', desc: 'Đường lối tổng thể để tới đích', color: 'amber' },
      { label: 'Tactics - Chiến thuật', desc: 'Kênh nào, thông điệp nào, phân bổ ngân sách ra sao', color: 'teal' },
      { label: 'Action - Hành động', desc: 'Lịch trình chi tiết và phân công trách nhiệm', color: 'sky' },
      { label: 'Control - Kiểm soát', desc: 'Bảng theo dõi KPI và kế hoạch quản trị rủi ro', color: 'rose' },
    ],
  },
  'm9-s2': {
    kind: 'compare',
    title: '📊 Lộ trình triển khai 90 ngày',
    badge: 'Ba chặng',
    items: [
      {
        label: 'NGÀY 1-30',
        tag: 'Dựng nền',
        color: 'sky',
        value: 'Đo đạc',
        points: ['Gắn mã theo dõi, dựng báo cáo', 'Tắt chiến dịch không chuyển đổi 60 ngày', 'Kết quả: bảng số liệu nền được thống nhất'],
      },
      {
        label: 'NGÀY 31-60',
        tag: 'Kiểm định',
        color: 'teal',
        value: 'Tìm công thức',
        points: ['3 hướng thông điệp, mỗi hướng 3 biến thể', 'Mỗi thử nghiệm chỉ đổi một biến số', 'Kết quả: xác định tổ hợp thắng'],
      },
      {
        label: 'NGÀY 61-90',
        tag: 'Nhân rộng',
        color: 'emerald',
        value: 'Tăng tốc',
        points: ['Tăng ngân sách từng nấc 20% mỗi 3 ngày', 'Nhân bản sang kênh thứ hai', 'Giữ 10% cho thử nghiệm mới'],
      },
    ],
    footnote: 'Bỏ qua chặng 1 để chạy tăng trưởng ngay là cạm bẫy phổ biến nhất: đến tháng thứ 3 không ai chứng minh được kết quả tốt lên hay xấu đi.',
  },
  'm9-s3': {
    kind: 'compare',
    title: '📊 Bốn rủi ro và ngưỡng kích hoạt',
    badge: 'Kịch bản dự phòng',
    items: [
      {
        label: 'CHI PHÍ TĂNG ĐỘT BIẾN',
        tag: 'CPM +40%',
        color: 'amber',
        points: ['Chuyển ngân sách sang kênh ổn định hơn', 'Đẩy mạnh tệp khách cũ, dừng mở rộng tệp lạnh'],
      },
      {
        label: 'TÀI KHOẢN BỊ KHOÁ',
        tag: 'Cảnh báo đầu',
        color: 'rose',
        points: ['Duy trì tài khoản dự phòng đã xác minh', 'Không để một tài khoản gánh quá 60% ngân sách'],
      },
      {
        label: 'NỘI DUNG HẾT HIỆU LỰC',
        tag: 'Tần suất >3,5',
        color: 'teal',
        points: ['CTR giảm quá 30% so với tuần đầu', 'Luôn có sẵn tối thiểu 3 mẫu chưa dùng'],
      },
    ],
    footnote: 'Mỗi kịch bản phải có đủ ba thành phần: ngưỡng số cụ thể, tên người quyết định, và hành động trong 24 giờ đầu. Thiếu một là không dùng được khi có sự cố.',
  },
  'm9-s4': {
    kind: 'funnel',
    title: '📊 Kiểm chứng ngược: mục tiêu có khả thi không',
    badge: 'Chuỗi phòng tập, mục tiêu quý 4',
    stages: [
      { label: 'Cần thêm doanh thu mỗi tháng', value: '600 triệu', raw: 100, color: 'emerald' },
      { label: 'Quy ra số hội viên cần thêm', value: '800 người', raw: 100, color: 'teal' },
      { label: 'Nguồn 1 - Giảm rời bỏ 6,5% xuống 5%', value: '108 người', raw: 13.5, color: 'sky' },
      { label: 'Nguồn 2 - Thu hút mới bằng 99 triệu', value: '270 người', raw: 34, color: 'amber' },
      { label: 'Tổng khả thi thực tế', value: '378 người', raw: 47, drop: '47%', color: 'rose' },
    ],
    footnote: 'Chỉ đạt 47% mục tiêu. Kết luận trung thực phải trình: hoặc nâng ngân sách lên khoảng 400 triệu, hoặc giãn mục tiêu ra 6 tháng. Trình phép tính này giúp thương lượng bằng dữ liệu.',
  },

  /* ================= CHUYÊN ĐỀ 10 ================= */
  'm10-s1': {
    kind: 'flow',
    title: '📊 Tháp chỉ số KPI ba tầng',
    badge: 'Mỗi tầng một người đọc',
    steps: [
      { label: 'Tầng 1 - Chỉ số Kinh doanh', desc: 'Doanh thu, lợi nhuận, thị phần. Dành cho Ban Giám Đốc', color: 'amber' },
      { label: 'Tầng 2 - Chỉ số Marketing', desc: 'CAC, LTV, ROAS, MER. Dành cho Trưởng phòng', color: 'teal' },
      { label: 'Tầng 3 - Chỉ số Vận hành', desc: 'CPM, CTR, CVR, tần suất. Dành cho chuyên viên chạy quảng cáo', color: 'sky' },
    ],
  },
  'm10-s2': {
    kind: 'compare',
    title: '📊 Các mô hình ghi nhận chuyển đổi',
    badge: 'Attribution Models',
    items: [
      {
        label: 'LAST TOUCH',
        tag: 'Mặc định',
        color: 'teal',
        points: ['100% công cho điểm chạm cuối', 'Thổi phồng kênh cuối phễu như tìm kiếm thương hiệu'],
      },
      {
        label: 'FIRST TOUCH',
        tag: 'Đầu phễu',
        color: 'sky',
        points: ['100% công cho kênh khám phá đầu tiên', 'Thổi phồng kênh nhận biết như video và mạng xã hội'],
      },
      {
        label: 'DATA-DRIVEN',
        tag: 'Khách quan',
        color: 'emerald',
        points: ['Phân bổ theo dữ liệu học máy GA4', 'Cần đủ lượng chuyển đổi mới chạy được'],
      },
    ],
  },
  'm10-s3': {
    kind: 'stats',
    title: '📊 Ghi nhận trùng: vì sao tổng luôn lớn hơn thật',
    badge: 'Doanh thu thật 600 triệu',
    items: [
      { label: 'Meta tự báo cáo', value: '520Tr', note: 'Nhận trọn công', color: 'sky' },
      { label: 'Google tự báo cáo', value: '380Tr', note: 'Cũng nhận trọn công', color: 'teal' },
      { label: 'Cộng hai nền tảng', value: '900Tr', note: 'Vượt 50% so với thực tế', color: 'rose' },
      { label: 'Hệ thống bán hàng', value: '600Tr', note: 'Con số duy nhất đáng tin', color: 'emerald' },
    ],
    footnote: 'Phần chênh 300 triệu là các đơn có chạm vào cả hai kênh. Không bao giờ cộng doanh thu do các nền tảng tự báo cáo khi trình Ban Giám Đốc.',
  },

  /* ================= CHUYÊN ĐỀ 11 ================= */
  'm11-s1': {
    kind: 'flow',
    title: '📊 Tiêu chí phê duyệt kế hoạch chiến lược',
    badge: 'Góc nhìn người duyệt',
    steps: [
      { label: 'Mục tiêu có đo được không', desc: 'Con số cụ thể kèm mốc thời gian, không dùng từ mơ hồ', color: 'emerald' },
      { label: 'Ngân sách có căn cứ không', desc: 'Tính ngược qua phễu và trình kèm giả định', color: 'teal' },
      { label: 'Rủi ro có được lường trước không', desc: 'Ngưỡng kích hoạt, người quyết định, hành động 24 giờ đầu', color: 'amber' },
      { label: 'Cách đo có sẵn chưa', desc: 'Mỗi đề xuất gắn với một chỉ số và một ngưỡng kết luận', color: 'rose' },
    ],
  },
  'm11-s2': {
    kind: 'stats',
    title: '📊 Case study: tái cấu trúc phòng Digital Marketing',
    badge: 'Kết quả sau 90 ngày',
    items: [
      { label: 'Chi phí CPA', value: '-42%', note: 'Sau khi tái phân bổ kênh', color: 'emerald' },
      { label: 'Blended ROAS', value: '1,8x → 3,6x', note: 'Gấp đôi trong 3 tháng', color: 'emerald' },
      { label: 'Ngân sách chuyển sang TikTok Live', value: '20%', note: 'Kèm booking KOC', color: 'teal' },
      { label: 'Kênh mua lại', value: 'Zalo tự động', note: 'Nhắn tin chăm sóc khách cũ', color: 'amber' },
    ],
  },
  'm11-s3': {
    kind: 'stats',
    title: '📊 Hồ sơ chẩn đoán: cửa hàng thời trang trực tuyến',
    badge: 'Triệu chứng kể: quảng cáo ngày càng đắt',
    items: [
      { label: 'Giá trị đơn trung bình', value: '620K', note: 'Biên lợi nhuận gộp 42%', color: 'sky' },
      { label: 'Lợi nhuận gộp mỗi đơn', value: '260K', note: '620K × 42%', color: 'teal' },
      { label: 'Chi phí thu hút khách', value: '340K', note: 'Tăng từ 190K trong 12 tháng', color: 'rose' },
      { label: 'Thực lỗ mỗi khách mới', value: '-80K', note: 'Tỷ lệ mua lại chỉ 8%', color: 'rose' },
    ],
    footnote: 'Chẩn đoán: vấn đề không nằm ở quảng cáo mà ở mô hình kinh doanh. Doanh nghiệp vận hành như mô hình mua một lần trong khi cấu trúc chi phí đòi hỏi mô hình mua nhiều lần. Nâng tỷ lệ mua lại từ 8% lên 20% là đòn bẩy rẻ nhất.',
  },
};
