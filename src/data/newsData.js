/**
 * Dữ liệu Bản tin thuật toán nền tảng.
 *
 * BẢN TIN GỒM HAI LOẠI, KHÔNG ĐƯỢC TRỘN LẪN:
 *
 *   1. REAL_SOURCED_NEWS - tin THẬT, biên tập lại từ bài báo có thật. Bắt buộc
 *      có `sourceUrl` trỏ đúng bài gốc và `image` là ảnh bìa do chính bài đó
 *      đăng. Mọi con số trong tin phải lấy từ bài gốc, không được ước lượng.
 *
 *   2. SIMULATED_NEWS_ITEMS - tin MÔ PHỎNG phục vụ luyện phản xạ ra quyết định.
 *      Không có bài báo thật đứng sau, nên TUYỆT ĐỐI không gắn `sourceUrl` hay
 *      ảnh thật vào nhóm này: làm vậy là dựng chứng cứ giả. Nhóm này chỉ dùng
 *      tranh SVG và được đánh dấu `isSimulated` để giao diện ghi rõ.
 *
 * Cấu trúc một tin:
 *   id, category, platformIcon, title      - định danh và tiêu đề
 *   publishedAt                            - ngày đăng dạng dd/mm/yyyy
 *   isHot                                  - gắn nhãn đột biến
 *   illustration                           - khoá tranh SVG trong NewsIllustration
 *   image {url, credit}                    - ảnh bìa thật (chỉ tin thật)
 *   sourceUrl                              - link bài gốc (chỉ tin thật)
 *   source, readTime, tags                 - siêu dữ liệu bài viết
 *   summary                                - đoạn dẫn
 *   keyNumbers[]  {value, label}           - số liệu chính, hiện ngay trên thẻ
 *   content[]     {heading, body}          - thân bài, hiện trong cửa sổ chi tiết
 *   impact                                 - tác động tới Trưởng phòng
 *   ifIgnored                              - cái giá phải trả nếu bỏ qua
 *   actionChecklist[]                      - việc cần chỉ đạo ngay
 *   deadline                               - mốc thời gian áp dụng (tuỳ chọn)
 *
 * KHÔNG lưu chuỗi ngày tương đối kiểu '2 ngày trước' trong dữ liệu. Chuỗi đó
 * không tự già đi nên sẽ sai chỉ sau một đêm. Nhãn tương đối được tính lúc vẽ
 * giao diện từ `publishedAt`, xem src/utils/newsDate.js.
 */

/* ------------------------------------------------------------------ *
 * TIN THẬT - biên tập từ bài báo có thật, cập nhật ngày 30/07/2026    *
 * ------------------------------------------------------------------ */
const REAL_SOURCED_NEWS = [
  {
    id: 'real-2026-08-05-ai-referral-landing',
    category: 'AI Marketing',
    platformIcon: 'Sparkles',
    title: 'Người dùng đến từ AI đổ về trang chủ chứ không vào bài được trích: 58,8% lượt giới thiệu từ ChatGPT rơi vào trang chủ',
    publishedAt: '05/08/2026',
    isHot: true,
    illustration: 'zero-click',
    image: {
      url: 'https://cdn.searchenginejournal.com/wp-content/uploads/2026/07/ai-referrals-434.png',
      credit: 'Ảnh: Search Engine Journal',
    },
    sourceUrl: 'https://www.searchenginejournal.com/ai-referrals-are-recreating-the-oldest-mistake-in-conversion-optimization/584331/',
    source: 'Search Engine Journal',
    readTime: '6 phút đọc',
    tags: ['AI Search', 'Trang đích', 'Chuyển đổi', 'Tìm kiếm nội bộ'],
    summary:
      'Chatbot trích dẫn bài viết chuyên sâu nằm sâu trong website để làm căn cứ, nhưng lại đẩy người đọc về trang chủ. Đây chính là lỗi lệch giữa ý định và trang đích mà ngành quảng cáo tìm kiếm đã mắc từ hai mươi năm trước, nay quay lại dưới một chuỗi nguồn giới thiệu mới.',
    keyNumbers: [
      { value: '58,8%', label: 'lượt từ ChatGPT rơi vào trang chủ' },
      { value: '28,8%', label: 'rơi vào trang kết quả tìm kiếm nội bộ' },
      { value: '12,1%', label: 'lượt đăng ký đến từ 0,5% truy cập' },
    ],
    content: [
      {
        heading: 'Lỗi cũ trong lớp áo mới',
        body:
          'Ngày trước, quảng cáo tìm kiếm cho một sản phẩm cụ thể lại dẫn người dùng về trang danh mục chung, khiến họ phải tự tìm lại thứ vừa bấm vào. Nay AI làm đúng như vậy: nó trích dẫn một bài viết chi tiết để chứng minh luận điểm, rồi gắn đường dẫn về trang chủ. Người đọc đang có nhu cầu rất cụ thể bị thả xuống một trang nói chung chung.',
      },
      {
        heading: 'Số liệu từ ba nguồn độc lập',
        body:
          'Báo cáo Similarweb 2026: 65% đường dẫn được ChatGPT trích dẫn nằm sâu hai tới ba cấp thư mục trong website, nhưng 58,8% lượt truy cập giới thiệu từ ChatGPT lại rơi vào trang chủ, tỷ lệ này tăng khoảng gấp đôi sau đợt cập nhật đường dẫn tháng 5/2026. Phân tích của Previsible trên 6,77 triệu phiên truy cập từ AI qua 166 website: 28,8% lượt giới thiệu từ ChatGPT rơi vào trang kết quả tìm kiếm nội bộ. Số liệu Ahrefs: hơn 80% lượt giới thiệu từ tìm kiếm AI đổ về trang chủ, trang sản phẩm và công cụ miễn phí thay vì bài viết.',
      },
      {
        heading: 'Trang bị bỏ quên nhất lại đang nhận nhiều lượt nhất',
        body:
          'Gần ba trên mười người đến từ ChatGPT rơi thẳng vào trang kết quả tìm kiếm nội bộ của website. Đây thường là trang không ai chăm sóc, không có nội dung dẫn dắt, kết quả sắp xếp tuỳ tiện. Khuyến nghị cụ thể của bài: gõ mười truy vấn quan trọng nhất vào ô tìm kiếm trên chính website mình và đọc kết quả bằng con mắt người lần đầu ghé thăm.',
      },
      {
        heading: 'Vì sao đáng bỏ công dù lượng truy cập còn nhỏ',
        body:
          'Người được ChatGPT gợi ý một thương hiệu có khả năng ghé website thương hiệu đó trong bảy ngày kế tiếp cao gấp 2,5 lần. Với Ahrefs, khách đến từ tìm kiếm AI chỉ chiếm 0,5% tổng truy cập nhưng đóng góp 12,1% số lượt đăng ký. Đây là nhóm khách đã được thuyết phục từ trước, chất lượng cao hơn hẳn lượt truy cập thông thường.',
      },
      {
        heading: 'Trang chủ cần đổi vai',
        body:
          'Người đến từ AI không cần được thuyết phục lại từ đầu, họ đã nghe giới thiệu rồi mới bấm vào. Trang chủ hiện nay phần lớn được thiết kế cho người chưa biết gì về thương hiệu, nên vô tình bắt nhóm khách đã sẵn sàng phải đi lại từ bước một. Cần bố trí lối đi nhanh tới hành động chuyển đổi ngay trên trang chủ.',
      },
    ],
    impact:
      'Trưởng phòng cần coi trang chủ và trang kết quả tìm kiếm nội bộ là hai trang đích quan trọng của kênh AI, thay vì tối ưu bài viết chuyên sâu rồi tưởng người đọc sẽ vào thẳng bài đó.',
    ifIgnored:
      'Đội nội dung tiếp tục dồn công vào các bài chuyên sâu để được AI trích dẫn, nhưng người đọc đổ về trang chủ rồi rời đi vì không thấy thứ họ vừa được giới thiệu. Công sức sản xuất nội dung biến thành lượt truy cập không chuyển đổi, và báo cáo sẽ kết luận sai rằng kênh AI không hiệu quả.',
    actionChecklist: [
      'Gõ 10 truy vấn quan trọng nhất vào ô tìm kiếm trên chính website mình, đọc kết quả bằng con mắt khách lần đầu ghé',
      'Bổ sung nội dung dẫn dắt và sắp xếp lại kết quả cho trang tìm kiếm nội bộ, vì gần 3/10 khách từ AI rơi vào đó',
      'Đặt lối đi nhanh tới hành động chuyển đổi ngay trên trang chủ cho nhóm khách đã được thuyết phục sẵn',
      'Tách riêng lượt truy cập từ AI trong báo cáo và đo bằng tỷ lệ chuyển đổi, đừng đo bằng tổng lượt truy cập',
    ],
  },
  {
    id: 'real-2026-08-04-meta-stablecoin',
    category: 'Meta Ads',
    platformIcon: 'Facebook',
    title: 'Meta mở kênh thanh toán quảng cáo bằng USDC qua ví MetaMask, Coinbase và Binance',
    publishedAt: '04/08/2026',
    isHot: false,
    illustration: 'ai-budget',
    image: {
      url: 'https://imgproxy.divecdn.com/G0Ke62R6kkrjvKRuj98i2MbkxSAobKops4y1JvQHLXk/g:ce/rs:fit:770:435/Z3M6Ly9kaXZlc2l0ZS1zdG9yYWdlL2RpdmVpbWFnZS9mYl9zZWN1cml0eV81LnBuZw==.webp',
      credit: 'Ảnh: Social Media Today',
    },
    sourceUrl: 'https://www.socialmediatoday.com/news/meta-ads-introduces-stablecoin-payment-options/827034/',
    source: 'Social Media Today',
    readTime: '4 phút đọc',
    tags: ['Thanh toán', 'Ngân sách', 'Vận hành', 'Tài khoản quảng cáo'],
    summary:
      'Nhà quảng cáo nay nạp tiền tài khoản Meta được bằng đồng ổn định USDC thông qua ví bên thứ ba. Đối tác thanh toán quy đổi USDC sang tiền tệ địa phương rồi thanh toán với Meta, số dư tự động vào tài khoản quảng cáo. Meta ghi rõ họ không phát hành, không giữ hộ và không bán đồng ổn định.',
    keyNumbers: [
      { value: 'USDC', label: 'đồng duy nhất được chấp nhận' },
      { value: '3', label: 'ví được nêu tên: MetaMask, Coinbase, Binance' },
    ],
    content: [
      {
        heading: 'Luồng tiền chạy thế nào',
        body:
          'Nhà quảng cáo trả bằng USDC từ ví của mình. Một đối tác thanh toán bên thứ ba nhận USDC, quy đổi sang tiền tệ địa phương và thanh toán với Meta. Meta cộng số dư đó vào tài khoản quảng cáo. Nghĩa là Meta không trực tiếp chạm vào tiền mã hoá, họ chỉ nhận tiền pháp định từ đối tác trung gian.',
      },
      {
        heading: 'Meta cẩn trọng có lý do',
        body:
          'Meta nói rõ họ không phát hành, không bán và không giữ hộ đồng ổn định. Cách diễn đạt này phản ánh bài học từ dự án Libra rồi Diem trước đây bị đổ vỡ dưới sức ép của cơ quan quản lý. Lần này Meta chỉ mở thêm một cửa nhận tiền, không tự làm hạ tầng tiền tệ.',
      },
      {
        heading: 'Ai thật sự được lợi',
        body:
          'Nhóm hưởng lợi rõ nhất là nhà quảng cáo ở những nơi thẻ tín dụng quốc tế khó mở, hạn mức thấp, hoặc thanh toán xuyên biên giới hay bị từ chối. Đây là điểm nghẽn quen thuộc với nhiều đơn vị chạy quảng cáo tại Việt Nam, nhất là khi cần nạp gấp giữa chiến dịch mà thẻ bị khoá vì nghi ngờ giao dịch bất thường.',
      },
      {
        heading: 'Điều bản tin không nói và cần tự kiểm chứng',
        body:
          'Thông báo không nêu danh sách thị trường được mở, cũng không nêu hạn mức hay mức phí quy đổi. Chưa rõ Việt Nam có nằm trong đợt đầu hay không. Trước khi chuyển quy trình nạp tiền sang kênh này, phải tự kiểm tra trong tài khoản quảng cáo của mình và đối chiếu với quy định quản lý ngoại hối trong nước.',
      },
    ],
    impact:
      'Trưởng phòng có thể có thêm một đường nạp tiền dự phòng cho trường hợp thẻ bị khoá giữa chiến dịch, nhưng phải kiểm tra tính pháp lý trong nước trước khi đưa vào quy trình chính thức.',
    ifIgnored:
      'Không mất gì nếu bỏ qua, vì đây là lựa chọn thêm chứ không thay thế cách cũ. Rủi ro nằm ở chiều ngược lại: vội chuyển sang kênh này mà chưa rà soát quy định ngoại hối và chưa rõ mức phí quy đổi.',
    actionChecklist: [
      'Kiểm tra trong phần thiết lập thanh toán của tài khoản quảng cáo xem lựa chọn này đã mở cho Việt Nam chưa',
      'Hỏi bộ phận kế toán và pháp chế về tính hợp lệ của việc thanh toán bằng đồng ổn định trước khi dùng',
      'Nếu dùng, so mức phí quy đổi của đối tác trung gian với phí thẻ hiện tại trước khi chuyển hẳn',
      'Vẫn giữ ít nhất một phương thức thanh toán dự phòng đã được duyệt, đừng phụ thuộc một kênh duy nhất',
    ],
  },
  {
    id: 'real-2026-07-24-facebook-verified',
    category: 'Meta Ads',
    platformIcon: 'Facebook',
    title: 'Meta ra mắt Facebook Verified: dấu xác thực miễn phí bằng video khuôn mặt, nhưng KHÔNG cấp cho Trang doanh nghiệp',
    publishedAt: '24/07/2026',
    isHot: true,
    illustration: 'account-security',
    image: {
      url: 'https://about.fb.com/wp-content/uploads/2026/07/Introducing-Facebook-Verified_Header.jpg?w=1200',
      credit: 'Ảnh: Meta Newsroom',
    },
    sourceUrl: 'https://about.fb.com/news/2026/07/introducing-facebook-verified/',
    source: 'Meta Newsroom (nguồn công bố chính thức)',
    readTime: '4 phút đọc',
    tags: ['Xác thực', 'Marketplace', 'Niềm tin', 'Trang doanh nghiệp'],
    summary:
      'Meta cấp miễn phí một dấu xác thực mới cho tài khoản cá nhân, xác minh bằng video quay khuôn mặt đối chiếu với ảnh đại diện sẵn có. Dấu này hiện trên Marketplace, Dating, Nhóm và Trang cá nhân. Điểm đáng chú ý nhất với doanh nghiệp nằm ở phần loại trừ: Trang và tài khoản ProMode không được cấp.',
    keyNumbers: [
      { value: 'Miễn phí', label: 'không thu phí thuê bao' },
      { value: '18+', label: 'độ tuổi tối thiểu' },
      { value: '0', label: 'Trang doanh nghiệp được cấp' },
    ],
    content: [
      {
        heading: 'Cách lấy dấu xác thực',
        body:
          'Người dùng quay một video tự chụp ngắn, Meta đối chiếu với ảnh đại diện đang có trên tài khoản để xác nhận trùng khớp. Quá trình thường chỉ mất vài phút. Xác thực một lần, dấu đi theo tài khoản trên khắp Facebook. Điều kiện: từ 18 tuổi trở lên, tài khoản đang chấp hành tốt Tiêu chuẩn cộng đồng và không có dấu hiệu hành vi giả mạo.',
      },
      {
        heading: 'Vì sao việc loại trừ Trang mới là tin quan trọng',
        body:
          'Dấu này không cấp cho Trang và tài khoản ProMode. Nghĩa là tín hiệu tin cậy mới của Facebook gắn vào CON NGƯỜI chứ không gắn vào thương hiệu. Doanh nghiệp bán hàng qua Marketplace hoặc qua Nhóm sẽ thấy tài khoản cá nhân có dấu được tin hơn hẳn Trang không có dấu, dù Trang mới là nơi doanh nghiệp đầu tư bao lâu nay.',
      },
      {
        heading: 'Meta nói rõ dấu này KHÔNG bảo chứng điều gì',
        body:
          'Thông báo ghi thẳng: dấu chỉ cho biết tài khoản thuộc về một người thật đã hoàn tất xác thực khuôn mặt, không có nghĩa Facebook chứng thực hay bảo đảm mức độ đáng tin của người đó. Người có dấu vẫn chịu toàn bộ chính sách của Meta. Đây là chi tiết cần nói lại với đội bán hàng, tránh việc lấy dấu xác thực làm căn cứ tin tưởng đối tác.',
      },
      {
        heading: 'Đặt cạnh bối cảnh tài khoản giả',
        body:
          'Xác thực bằng khuôn mặt đắt đỏ hơn nhiều so với xác thực bằng số điện thoại, vốn đã mất giá trị khi thiết bị ảo được cấp phát ở quy mô công nghiệp. Đây là hướng đi hợp lý của Meta. Nhưng nó cũng có nghĩa: những kênh chưa có lớp xác thực tương đương sẽ ngày càng bị người mua nghi ngờ hơn.',
      },
      {
        heading: 'Lộ trình',
        body:
          'Meta triển khai theo từng đợt, bắt đầu ở một số thị trường được chọn rồi mở rộng toàn cầu. Thông báo không nêu danh sách thị trường cụ thể lẫn ngày bắt đầu, nên chưa rõ Việt Nam nằm ở đợt nào. Dấu sẽ được bổ sung vào bài đăng trên Bảng tin ở giai đoạn sau.',
      },
    ],
    impact:
      'Trưởng phòng cần tính lại chiến lược hiện diện: nếu bán hàng qua Marketplace hoặc Nhóm, hãy cho nhân sự phụ trách lấy dấu xác thực cá nhân, vì Trang doanh nghiệp không có cửa nhận dấu này.',
    ifIgnored:
      'Khi dấu xác thực phổ biến, tài khoản cá nhân không có dấu và Trang doanh nghiệp sẽ cùng nằm ở nhóm kém tin cậy trong mắt người mua. Tỷ lệ phản hồi tin nhắn và chốt đơn qua Marketplace giảm dần mà không có chỉ số nào trong trình quản lý quảng cáo giải thích được.',
    actionChecklist: [
      'Xác định ai trong đội đang trực tiếp bán hàng qua Marketplace hoặc Nhóm, cho những người đó lấy dấu xác thực ngay khi mở tại Việt Nam',
      'Rà lại ảnh đại diện của các tài khoản đó, vì hệ thống đối chiếu video với ảnh sẵn có',
      'Nhắc đội bán hàng: dấu xác thực chỉ chứng minh người thật, không phải bảo chứng uy tín đối tác',
      'Xây tín hiệu tin cậy riêng cho Trang doanh nghiệp bằng đánh giá khách hàng và nội dung thật, đừng chờ Meta cấp dấu',
    ],
    deadline: 'Triển khai theo đợt, bắt đầu ở một số thị trường được chọn rồi mở rộng toàn cầu',
  },
  {
    id: 'real-2026-02-09-influencer-vn',
    category: 'TikTok Shop & Ads',
    platformIcon: 'Video',
    title: 'Số liệu thị trường Việt Nam: TikTok và Facebook chiếm hơn 90% chiến dịch influencer, người ít theo dõi lại tương tác cao gấp nhiều lần',
    publishedAt: '09/02/2026',
    isHot: false,
    illustration: 'affiliate-commission',
    image: {
      url: 'https://blog.vn.revu.net/wp-content/uploads/2026/02/SO-LIEU-INFLUENCER-MARKETING-VIET-NAM-2026-.jpg',
      credit: 'Ảnh: REVU Vietnam qua Brands Vietnam',
    },
    sourceUrl: 'https://www.brandsvietnam.com/congdong/topic/influencer-marketing-viet-nam-2026-thi-truong-79-trieu-nguoi-dung-social-va-cuoc-choi-tiktok-facebook',
    source: 'Brands Vietnam - bài của REVU Vietnam',
    readTime: '6 phút đọc',
    tags: ['Thị trường Việt Nam', 'Influencer', 'Video ngắn', 'Tương tác'],
    summary:
      'REVU Vietnam tổng hợp từ báo cáo Digital Vietnam 2026 và State of Influence in APAC 2026 của AnyMind Group. Việt Nam có 79 triệu người dùng mạng xã hội trên 102 triệu dân. TikTok chiếm 62,9% và Facebook 28,6% số chiến dịch influencer. Nhưng con số đáng giá nhất là tỷ lệ tương tác theo quy mô người theo dõi.',
    keyNumbers: [
      { value: '62,9%', label: 'chiến dịch influencer trên TikTok' },
      { value: '16,18%', label: 'tương tác của người 1.000-10.000 theo dõi' },
      { value: '2-3%', label: 'tương tác của người theo dõi lớn hơn' },
    ],
    content: [
      {
        heading: 'Quy mô thị trường',
        body:
          'Dân số 102 triệu, người dùng Internet 85,6 triệu, người dùng mạng xã hội 79 triệu, số kết nối di động 137 triệu. Mạng xã hội vẫn tăng 7,2% so với năm trước. Gần 8 trên 10 người Việt đang dùng mạng xã hội, và trung bình mỗi người có hơn một thiết bị di động.',
      },
      {
        heading: 'Người Việt tiêu thụ video ở mức rất cao',
        body:
          '96,2% người dùng Internet xem video trực tuyến mỗi tuần, 94,9% dùng mạng xã hội, 93,9% xem video ngắn dạng TikTok và Reels, 91% xem video dài. Thời lượng trung bình mỗi tuần: 12 giờ 40 phút cho video trực tuyến, 7 giờ 53 phút cho mạng xã hội, 7 giờ 08 phút riêng cho video ngắn. Tần suất: mạng xã hội 4,83 ngày mỗi tuần, video ngắn 4,70 ngày.',
      },
      {
        heading: 'Phát hiện quan trọng nhất: quy mô nhỏ tương tác cao hơn nhiều',
        body:
          'Trên TikTok, người có từ 1.000 đến 10.000 lượt theo dõi đạt tỷ lệ tương tác 16,18%, trong khi người có lượng theo dõi lớn hơn chỉ khoảng 2 đến 3%. Trên Facebook, con số tương ứng là 9,24% so với 1 đến 2%. Chênh lệch năm tới tám lần. Ngân sách dồn vào một gương mặt lớn gần như chắc chắn kém hiệu quả hơn việc chia cho nhiều người có cộng đồng nhỏ mà gắn kết.',
      },
      {
        heading: 'Tiền đang chảy vào đâu',
        body:
          'Hơn 90% ngân sách influencer marketing tại Việt Nam tập trung vào ba nhóm ngành: làm đẹp và thời trang, thực phẩm và đồ uống, mẹ và bé. Đều là hàng gắn với đời sống hằng ngày, nơi người mua muốn nghe đánh giá thực tế trước khi quyết định. Ngành ngoài ba nhóm này có lợi thế cạnh tranh thấp hơn về giá hợp tác.',
      },
      {
        heading: 'Vì sao người ảnh hưởng tác động được tới quyết định mua',
        body:
          '37,9% người dùng Internet tìm hiểu sản phẩm và thương hiệu trước khi mua, 61,2% dùng Internet để tìm thông tin, 55,7% để xem video. Người Việt không mua chỉ vì quảng cáo mà xem đánh giá và chia sẻ trải nghiệm trước. Người ảnh hưởng vì vậy đóng vai trò như một người quen kể lại trải nghiệm, không phải một kênh phát quảng cáo.',
      },
    ],
    impact:
      'Trưởng phòng nên chia lại ngân sách influencer theo hướng nhiều người quy mô nhỏ thay vì dồn vào một gương mặt lớn, và đặt trọng tâm sản xuất vào video ngắn vì đó là định dạng người Việt tiêu thụ nhiều nhất.',
    ifIgnored:
      'Dồn ngân sách vào một người có lượng theo dõi lớn nghĩa là mua mức tương tác 2-3% với giá cao nhất thị trường, trong khi cùng số tiền chia cho nhiều người nhỏ mua được mức 16,18%. Khoản chênh này không hiện ra trong báo cáo nếu chỉ đo bằng lượt tiếp cận.',
    actionChecklist: [
      'Dựng danh sách người ảnh hưởng quy mô 1.000-10.000 lượt theo dõi trong ngành, thay vì chỉ nhắm gương mặt lớn',
      'Đổi chỉ số nghiệm thu từ lượt tiếp cận sang tỷ lệ tương tác, vì đó mới là chỗ chênh lệch năm tới tám lần',
      'Ưu tiên sản xuất video ngắn: 93,9% người dùng Internet Việt Nam xem định dạng này hằng tuần',
      'Nếu ngoài ba nhóm ngành chiếm 90% ngân sách, tận dụng lợi thế giá hợp tác thấp hơn để thử nghiệm sớm',
    ],
  },
  {
    id: 'real-2026-07-30-meta-q2',
    category: 'Meta Ads',
    platformIcon: 'Facebook',
    title: 'Meta quý 2/2026: doanh thu quảng cáo tăng 27%, nhưng gần hết tiền mặt kiếm được đổ vào hạ tầng AI',
    publishedAt: '30/07/2026',
    isHot: true,
    illustration: 'cpm-auction',
    image: {
      url: 'https://imgproxy.divecdn.com/KWwsfohqVsNQrjGytYpu_6DCuUnC3I1cRivni7CK-ec/g:nowe:0:0/c:5300:2994/rs:fit:770:435/Z3M6Ly9kaXZlc2l0ZS1zdG9yYWdlL2RpdmVpbWFnZS9HZXR0eUltYWdlcy0xMTc4MTQxNTg3LmpwZw==.webp',
      credit: 'Ảnh: Marketing Dive',
    },
    sourceUrl: 'https://www.marketingdive.com/news/meta-touts-industry-leading-ad-revenue-growth-but-ai-unease-rises/826583/',
    source: 'Marketing Dive',
    readTime: '5 phút đọc',
    tags: ['Advantage+', 'Ngân sách', 'Cá nhân hoá', 'Xếp hạng quảng cáo'],
    summary:
      'Doanh thu quảng cáo Meta đạt 59,4 tỷ USD, tăng 27% so với cùng kỳ, và bộ công cụ tự động Advantage+ đã chạm quy mô 75 tỷ USD tính theo năm. Nhưng Meta đồng thời nâng mức chi đầu tư cả năm lên 130-145 tỷ USD và cảnh báo chính sách châu Âu buộc giảm cá nhân hoá quảng cáo có thể kéo doanh thu quý sau.',
    keyNumbers: [
      { value: '+27%', label: 'doanh thu quảng cáo so cùng kỳ' },
      { value: '75 tỷ USD', label: 'quy mô Advantage+ theo năm' },
      { value: '130-145 tỷ', label: 'USD chi đầu tư AI cả năm' },
    ],
    content: [
      {
        heading: 'Cỗ máy quảng cáo vẫn chạy rất mạnh',
        body:
          'Doanh thu quảng cáo tăng 27% lên 59,4 tỷ USD, tổng doanh thu tăng 28% lên 60,8 tỷ USD cho kỳ kết thúc ngày 30/6. Mark Zuckerberg nhấn mạnh trong buổi công bố rằng tính theo giá trị tuyệt đối, mảng quảng cáo của Meta đang tăng trưởng nhanh hơn mọi mảng quảng cáo được công bố của bất kỳ công ty nào khác.',
      },
      {
        heading: 'Cách máy xếp hạng quảng cáo vừa đổi về bản chất',
        body:
          'Giám đốc tài chính Susan Li mô tả mô hình Meta Generative Recommender mới: thay vì chấm điểm từng quảng cáo riêng lẻ, hệ thống nay dùng mô hình ngôn ngữ lớn để suy luận đồng thời về nội dung quảng cáo và sở thích người dùng. Đây là thay đổi đáng chú ý nhất với người làm nghề: máy bắt đầu đọc hiểu nội dung mẫu quảng cáo, chứ không chỉ đối chiếu tín hiệu hành vi.',
      },
      {
        heading: 'Vì sao điều đó đổi việc của phòng Marketing',
        body:
          'Khi máy chấm điểm bằng cách hiểu nội dung, chất lượng và độ rõ ràng của thông điệp trong mẫu quảng cáo trở thành yếu tố xếp hạng chứ không còn là chuyện thẩm mỹ. Mẫu nói mập mờ, không rõ sản phẩm dành cho ai, giải quyết vấn đề gì, sẽ khó được máy ghép đúng người hơn trước. Ngược lại, việc chia tệp thủ công càng mất giá trị.',
      },
      {
        heading: 'Điều Meta tự cảnh báo trong dự báo quý sau',
        body:
          'Meta dự báo doanh thu quý 3 ở mức 61-64 tỷ USD, thấp hơn kỳ vọng của giới đầu tư, và nêu lý do có thể đến từ thay đổi chính sách tại châu Âu buộc quảng cáo phải bớt cá nhân hoá. Đây là tín hiệu đáng theo dõi: khi chính nền tảng coi việc bị hạn chế cá nhân hoá là rủi ro doanh thu, thì doanh nghiệp phụ thuộc hoàn toàn vào nhắm mục tiêu chi tiết cũng đang ngồi trên cùng rủi ro đó.',
      },
      {
        heading: 'Mặt trái nhà đầu tư đang lo',
        body:
          'Meta nâng sàn chi đầu tư cả năm từ 125 lên 130 tỷ USD, trần giữ ở 145 tỷ USD. Nhà phân tích Mike Proulx nhận xét mảng quảng cáo vẫn là một con quái vật, nhưng mọi thứ khác thì đắt lên, và gần như toàn bộ tiền mặt tạo ra trong quý đã bị chi phí hạ tầng AI ăn hết. Với người mua quảng cáo, điều này hàm ý áp lực tăng hiệu quả kiếm tiền trên nền tảng sẽ còn tiếp diễn.',
      },
    ],
    impact:
      'Trưởng phòng nên dồn nguồn lực vào chất lượng thông điệp trong mẫu quảng cáo, vì máy nay xếp hạng bằng cách đọc hiểu nội dung. Đồng thời giảm dần mức phụ thuộc vào nhắm mục tiêu chi tiết, thứ đang bị siết ở châu Âu và có thể lan sang nơi khác.',
    ifIgnored:
      'Tiếp tục đổ công sức vào chia tệp thủ công trong khi bỏ mặc chất lượng nội dung sẽ khiến hiệu quả tụt dần theo đúng hướng thuật toán đang đi. Và nếu quy định hạn chế cá nhân hoá lan tới thị trường của mình, doanh nghiệp không có tệp dữ liệu sở hữu riêng sẽ mất kênh tiếp cận gần như trong một đêm.',
    actionChecklist: [
      'Rà lại mẫu quảng cáo theo tiêu chí máy đọc hiểu được: nói rõ sản phẩm cho ai, giải quyết vấn đề gì, ngay trong 3 giây đầu',
      'Mở một chiến dịch Advantage+ chạy song song với cấu trúc thủ công, so sánh trong 4 tuần',
      'Xây tệp dữ liệu khách hàng sở hữu riêng để không lệ thuộc hoàn toàn vào nhắm mục tiêu của nền tảng',
      'Ghi lại CPM và chi phí mỗi kết quả hiện tại làm mốc, theo dõi biến động các quý sau',
    ],
  },
  {
    id: 'real-2026-07-03-meta-location-fee',
    category: 'Meta Ads',
    platformIcon: 'Facebook',
    title: 'Meta thu phụ phí theo vị trí 2-5% tại sáu thị trường, hiệu lực từ 01/07/2026',
    publishedAt: '03/07/2026',
    isHot: false,
    illustration: 'ai-budget',
    image: {
      url: 'https://www.digitalapplied.com/blog/meta-europe-location-fees-july-2026-advertiser-guide/article-image',
      credit: 'Ảnh: Digital Applied',
    },
    sourceUrl: 'https://www.digitalapplied.com/blog/meta-europe-location-fees-july-2026-advertiser-guide',
    source: 'Digital Applied - Hướng dẫn phí theo vị trí của Meta',
    readTime: '4 phút đọc',
    tags: ['Chi phí', 'Ngân sách', 'Thuế dịch vụ số', 'Thị trường quốc tế'],
    summary:
      'Meta cộng thêm 2-5% vào hoá đơn cho quảng cáo hiển thị tại Áo, Pháp, Ý, Tây Ban Nha, Thổ Nhĩ Kỳ và Anh. Mức phí tính theo nơi quảng cáo thực sự hiển thị, không theo nơi nhắm mục tiêu, nên chọn tệp cẩn thận vẫn có thể bị tính phí ngoài dự kiến.',
    keyNumbers: [
      { value: '2-5%', label: 'mức phụ thu theo từng nước' },
      { value: '6', label: 'thị trường bị áp dụng' },
      { value: '01/07', label: 'ngày bắt đầu hiệu lực' },
    ],
    content: [
      {
        heading: 'Mức phí cụ thể từng nước',
        body:
          'Anh 2%. Pháp, Ý, Tây Ban Nha 3%. Áo và Thổ Nhĩ Kỳ 5%. Đây là khoản Meta chuyển phần thuế dịch vụ số mà chính phủ các nước này áp lên nền tảng sang cho người mua quảng cáo gánh.',
      },
      {
        heading: 'Điểm dễ tính nhầm ngân sách',
        body:
          'Phí tính theo nơi quảng cáo thực sự được hiển thị, không phải nơi nhà quảng cáo chọn nhắm mục tiêu. Với các chiến dịch để hệ thống tự mở rộng phạm vi phân phối, quảng cáo có thể chạy sang các nước này mà người quản lý không chủ động chọn. Khoản phụ thu khi đó xuất hiện trên hoá đơn như một con số lạ.',
      },
      {
        heading: 'Phí này không nằm trong CPM đấu giá',
        body:
          'Meta khẳng định giá CPM và CPC do cơ chế đấu giá quyết định, không bị phí vị trí đẩy lên. Phụ phí được cộng riêng vào hoá đơn sau khi quảng cáo đã chạy. Nghĩa là nhìn vào trình quản lý quảng cáo sẽ không thấy khoản này, phải mở hoá đơn thanh toán mới thấy.',
      },
      {
        heading: 'Vì sao người làm thị trường Việt Nam vẫn nên đọc',
        body:
          'Google đã chuyển thuế dịch vụ số sang nhà quảng cáo từ tháng 11/2020, Amazon từ tháng 8/2024, và Meta cầm cự tới 2026 mới làm. Hướng đi chung của ngành đã rõ. Mọi thị trường ban hành thuế dịch vụ số đều có khả năng bị áp cơ chế tương tự, nên nên tính trước một khoảng đệm chi phí trong kế hoạch ngân sách năm sau.',
      },
    ],
    impact:
      'Trưởng phòng có chạy quảng cáo vào sáu thị trường trên phải cộng thêm 2-5% vào dự toán, nếu không mức chi thực tế sẽ vượt kế hoạch mà không tìm ra nguyên nhân trong trình quản lý quảng cáo.',
    ifIgnored:
      'Ngân sách quyết toán cuối kỳ vượt kế hoạch vài phần trăm, và vì khoản này không hiện trong trình quản lý quảng cáo nên đội ngũ sẽ mất nhiều ngày dò tìm sai ở đâu.',
    actionChecklist: [
      'Đối chiếu hoá đơn thanh toán Meta tháng 7 với báo cáo trong trình quản lý để xác định có bị phụ thu không',
      'Nếu không chủ đích chạy vào sáu thị trường trên, khoá vùng phân phối lại thay vì để hệ thống tự mở rộng',
      'Cộng khoảng đệm chi phí vào dự toán cho mọi chiến dịch có phân phối quốc tế',
      'Đưa mục phí nền tảng thành một dòng riêng trong báo cáo ngân sách hằng tháng',
    ],
    deadline: 'Đã có hiệu lực từ 01/07/2026 tại Áo, Pháp, Ý, Tây Ban Nha, Thổ Nhĩ Kỳ và Anh',
  },
  {
    id: 'real-2026-07-28-tiktok-q3-preview',
    category: 'TikTok Shop & Ads',
    platformIcon: 'Video',
    title: 'TikTok công bố bộ tính năng quý 3/2026: loại trừ tối đa 40% vùng trong TopView, GMV Max Pro tính cả hoa hồng và mã giảm giá',
    publishedAt: '28/07/2026',
    isHot: true,
    illustration: 'keyword-exclusion',
    image: {
      url: 'https://lf-tt4b.tiktokcdn.com/obj/i18nblog/tt4b_cms/en-US/tipdilz7wysq-2lvhf0jkj4jJgUU292hXZc.png',
      credit: 'Ảnh: TikTok For Business',
    },
    sourceUrl: 'https://ads.tiktok.com/business/en/blog/tiktok-product-preview',
    source: 'TikTok For Business - Bản xem trước sản phẩm quý 3/2026 (nguồn chính thức)',
    readTime: '6 phút đọc',
    tags: ['TopView', 'GMV Max', 'Tự động hoá', 'Biên lợi nhuận'],
    summary:
      'TikTok mở loạt điều khiển mới cho quý 3: chặn tối đa 40% số vùng trong chiến dịch TopView toàn quốc, tự quét ảnh và video sản phẩm từ trang đích của nhà quảng cáo, và quan trọng nhất là GMV Max Pro chuyển từ tối ưu theo doanh thu sang tối ưu có trừ hoa hồng, mã giảm giá và chi phí tiếp thị liên kết.',
    keyNumbers: [
      { value: '40%', label: 'tỷ lệ vùng được loại trừ tối đa' },
      { value: '60%', label: 'tỷ lệ vùng bắt buộc phải giữ' },
      { value: '7 ngày', label: 'chu kỳ ngân sách Seller Scale Up' },
    ],
    content: [
      {
        heading: 'GMV Max Pro là thay đổi đáng giá nhất',
        body:
          'Trước đây GMV Max chỉ tối ưu theo tổng giá trị hàng bán. Máy đẩy mạnh những đơn dễ ra nhất mà không quan tâm đơn đó còn lại bao nhiêu sau khi trừ mã giảm giá và hoa hồng cho nhà sáng tạo nội dung. GMV Max Pro nay tính cả ba khoản đó cùng với chi phí quảng cáo. Đây là lần đầu thuật toán của TikTok nhìn gần với chỉ số mà kế toán nhìn. Lưu ý: chưa mở tại Canada.',
      },
      {
        heading: 'TopView chặn vùng, có trần cứng',
        body:
          'Tính năng TopView Geo Exclusion cho phép loại tối đa 40% số tỉnh, thành hoặc khu vực khỏi chiến dịch toàn quốc, dùng khi hàng chưa phủ hết, khi có ràng buộc cấm quảng cáo theo vùng, hoặc khi chạy khuyến mãi địa phương. Trần cứng: chiến dịch không được rớt xuống dưới 60% số vùng của một nước. Mở toàn cầu nhưng phải xin vào danh sách cho phép.',
      },
      {
        heading: 'Máy tự lấy nội dung từ trang đích của bạn',
        body:
          'Catalog Image & Video Auto-Crawl tự động quét trang đích công khai của nhà quảng cáo để lấy ảnh và video sản phẩm, có bộ lọc chọn ra tài sản liên quan, không cần tải lên thủ công. Mặt trái: những ảnh cũ, ảnh sai giá hay ảnh chưa duyệt còn sót trên trang đều có thể bị máy nhặt đem chạy quảng cáo.',
      },
      {
        heading: 'Một chi tiết đáng ngờ trong thông báo',
        body:
          'Bản công bố lần này mô tả tính năng nhưng không kèm bất kỳ số liệu hiệu quả nào để chứng minh. Khi nền tảng ra tính năng mà không đưa ra con số, nên coi đó là bản thử nghiệm và tự đo bằng ngân sách nhỏ trước khi chuyển ngân sách chính sang. Phần lớn tính năng trong đợt này cũng yêu cầu đăng ký danh sách cho phép hoặc giới hạn theo khu vực, riêng GMV Max không mở tại Canada.',
      },
      {
        heading: 'Cửa cho tác tử AI vào trình quản lý',
        body:
          'TikTok Agentic Hub mở giao diện theo chuẩn Model Context Protocol để dựng tác tử AI làm việc trong Ads Manager, kèm sẵn các kỹ năng báo cáo, tìm tệp đối tượng, tối ưu ngân sách. Bản công bố không nói rõ tác tử được quyền ghi hay chỉ được đọc. Chưa rõ quyền thì chưa nên nối vào tài khoản đang tiêu tiền thật.',
      },
    ],
    impact:
      'Trưởng phòng nên chuyển chỉ số đánh giá gian hàng từ doanh thu sang lợi nhuận sau hoa hồng và mã giảm giá, đồng thời rà lại toàn bộ ảnh trên trang đích trước khi bật tính năng tự quét.',
    ifIgnored:
      'Tiếp tục chấm hiệu quả bằng tổng doanh thu sẽ khen nhầm những mã hàng bán chạy nhưng lỗ sau khi trừ hoa hồng. Bật tự quét mà không dọn trang đích thì ảnh sai giá hoặc ảnh khuyến mãi đã hết hạn sẽ lên quảng cáo.',
    actionChecklist: [
      'Đăng ký vào danh sách cho phép của GMV Max Pro và chạy thử trên nhóm hàng có biên lợi nhuận mỏng nhất trước',
      'Rà soát toàn bộ ảnh và video trên trang đích, gỡ ảnh cũ và ảnh sai giá trước khi bật Auto-Crawl',
      'Dựng báo cáo lợi nhuận sau hoa hồng cho từng mã hàng, thay cho báo cáo chỉ có doanh thu',
      'Chưa nối tác tử AI vào tài khoản thật cho tới khi TikTok công bố rõ tác tử có quyền ghi hay không',
    ],
    deadline: 'Triển khai trong quý 3/2026, phần lớn tính năng yêu cầu đăng ký danh sách cho phép',
  },
  {
    id: 'real-2026-07-12-tiktok-shop-cpsc',
    category: 'TikTok Shop & Ads',
    platformIcon: 'Video',
    title: 'TikTok Shop: hàng thiếu hồ sơ chứng nhận nộp điện tử bị giữ ngay tại cửa khẩu Mỹ',
    publishedAt: '12/07/2026',
    isHot: false,
    illustration: 'shop-health',
    image: {
      url: 'https://ppc.land/content/images/size/w1200/2026/07/Retail-Law.webp',
      credit: 'Ảnh: PPC Land',
    },
    sourceUrl: 'https://ppc.land/tiktok-shop-sellers-face-shipment-seizure-risk-under-new-cpsc-filing-rule/',
    source: 'PPC Land - Quy định nộp hồ sơ CPSC',
    readTime: '4 phút đọc',
    tags: ['Tuân thủ', 'Xuất khẩu', 'Sức khoẻ gian hàng', 'Chứng nhận sản phẩm'],
    summary:
      'Từ 08/07/2026, sản phẩm cần Giấy chứng nhận sản phẩm trẻ em hoặc Giấy chứng nhận hợp quy chung phải nộp dữ liệu chứng nhận dưới dạng điện tử trước khi hàng thông quan vào Mỹ. Thiếu hồ sơ là lô hàng bị giữ lại, không phải bị nhắc nhở.',
    keyNumbers: [
      { value: '08/07', label: 'ngày quy định liên bang hiệu lực' },
      { value: '100%', label: 'lô hàng phải có hồ sơ trước thông quan' },
    ],
    content: [
      {
        heading: 'Quy định thay đổi ở chỗ nào',
        body:
          'Trước đây giấy chứng nhận là thứ xuất trình khi được yêu cầu. Nay dữ liệu chứng nhận phải được nộp điện tử trước thời điểm hàng thông quan. Không nộp trước thì lô hàng bị giữ tại cửa khẩu. Đây là quy định liên bang của Mỹ, không phải chính sách riêng của TikTok, nên không có cửa xin miễn trừ từ nền tảng.',
      },
      {
        heading: 'Nhóm hàng bị ảnh hưởng',
        body:
          'Các mặt hàng cần Giấy chứng nhận sản phẩm trẻ em và các mặt hàng cần Giấy chứng nhận hợp quy chung. Nhóm này rộng hơn nhiều so với suy nghĩ thông thường: không chỉ đồ chơi mà cả quần áo trẻ em, đồ dùng ăn uống, phụ kiện và nhiều mặt hàng gia dụng.',
      },
      {
        heading: 'TikTok siết song song ở phía tài khoản',
        body:
          'TikTok Shop đang chuyển từ cơ chế Điểm vi phạm mang tính phạt sang khung Xếp hạng Sức khoẻ Tài khoản linh hoạt, triển khai trong tháng 7/2026. Cùng lúc, chính sách bảo mật và tuân thủ mới cho phép TikTok Shop kéo dài thời gian đối soát hoa hồng đối với tài khoản nhà sáng tạo bị đánh dấu rủi ro cao hoặc đang chờ rà soát.',
      },
      {
        heading: 'Ai ở Việt Nam cần quan tâm',
        body:
          'Các nhà bán hàng xuất khẩu qua TikTok Shop sang thị trường Mỹ. Rủi ro không dừng ở một lô hàng bị giữ: hàng không tới kịp làm tăng tỷ lệ giao trễ và huỷ đơn, hai chỉ số kéo thẳng điểm sức khoẻ gian hàng xuống, kéo theo lượng hiển thị tự nhiên bị cắt.',
      },
    ],
    impact:
      'Trưởng phòng phụ trách kênh xuất khẩu phải rà danh mục hàng cần chứng nhận và hoàn tất hồ sơ điện tử trước mỗi lô, đồng thời chuẩn bị dòng tiền cho khả năng hoa hồng bị giữ lâu hơn.',
    ifIgnored:
      'Một lô hàng bị giữ ở cửa khẩu kéo theo chuỗi hệ quả: giao trễ, huỷ đơn, điểm sức khoẻ gian hàng tụt, lượng hiển thị tự nhiên bị cắt. Mất doanh thu lớn hơn nhiều so với giá trị lô hàng đó.',
    actionChecklist: [
      'Lập danh sách mã hàng cần Giấy chứng nhận sản phẩm trẻ em hoặc Giấy chứng nhận hợp quy chung',
      'Xác nhận với đơn vị vận chuyển rằng dữ liệu chứng nhận đã được nộp điện tử trước khi hàng rời kho',
      'Tra lại chỉ số sức khoẻ gian hàng theo khung xếp hạng mới thay vì theo điểm vi phạm cũ',
      'Dự phòng dòng tiền cho trường hợp hoa hồng nhà sáng tạo bị kéo dài thời gian đối soát',
    ],
    deadline: 'Quy định liên bang Mỹ đã hiệu lực từ 08/07/2026',
  },
  {
    id: 'real-2026-07-29-ai-mode-shopping',
    category: 'Google Ads & SEO',
    platformIcon: 'Search',
    title: 'Nghiên cứu 100.000 truy vấn: chế độ AI của Google hiển thị ít hơn 95% số sản phẩm so với tìm kiếm thường',
    publishedAt: '29/07/2026',
    isHot: true,
    illustration: 'zero-click',
    image: {
      url: 'https://ppc.land/content/images/size/w1200/2026/07/shelves.webp',
      credit: 'Ảnh: PPC Land',
    },
    sourceUrl: 'https://ppc.land/ai-mode-cuts-google-shopping-listings-95-productrise-finds/',
    source: 'PPC Land - Nghiên cứu của Productrise',
    readTime: '6 phút đọc',
    tags: ['AI Mode', 'Google Shopping', 'Dữ liệu sản phẩm', 'Hiển thị tự nhiên'],
    summary:
      'Productrise theo dõi hơn 100.000 truy vấn mua sắm giống hệt nhau trong 21 ngày tại Mỹ và Anh. Kết quả: chế độ AI chỉ trả về sản phẩm cho 23% truy vấn, so với 88% ở tìm kiếm thường. Đáng lo hơn con số 95%: chỉ 0,8% sản phẩm hiện ở tìm kiếm thường cũng xuất hiện trong chế độ AI.',
    keyNumbers: [
      { value: '95%', label: 'số sản phẩm biến mất ở chế độ AI' },
      { value: '0,8%', label: 'tỷ lệ trùng lặp giữa hai kết quả' },
      { value: '4,3', label: 'sản phẩm mỗi trang, so với 22,5' },
    ],
    content: [
      {
        heading: 'Cách nghiên cứu được thực hiện',
        body:
          'Productrise chạy hơn 100.000 truy vấn mua sắm giống hệt nhau trong 21 ngày của tháng 7/2026, tại thị trường Mỹ và Anh, theo dõi hơn 2 triệu tin đăng sản phẩm mỗi ngày. Truy vấn dùng từ khoá thông thường chứ không phải câu hỏi hội thoại, tức phản ánh đúng cách người dùng thật gõ tìm kiếm.',
      },
      {
        heading: 'Hai tầng suy giảm cộng dồn',
        body:
          'Tầng thứ nhất: tìm kiếm thường trả về sản phẩm cho khoảng 88% truy vấn, chế độ AI chỉ 23%. Tầng thứ hai: khi có trả về sản phẩm, tìm kiếm thường hiện trung bình 22,5 tin đăng mỗi trang, chế độ AI chỉ 4,3. Hai tầng nhân vào nhau ra con số khoảng 95% số tin đăng sản phẩm biến mất.',
      },
      {
        heading: 'Con số 0,8% mới là điều đáng sợ',
        body:
          'Chỉ 0,8% sản phẩm hiện trong tìm kiếm thường cũng xuất hiện ở chế độ AI cho cùng truy vấn, trong cùng một ngày. Nghĩa là chế độ AI không đơn thuần cắt bớt danh sách cũ mà dùng một logic xếp hạng khác hẳn. Gian hàng đang đứng đầu băng chuyền sản phẩm truyền thống không có gì bảo đảm sẽ xuất hiện trong chế độ AI.',
      },
      {
        heading: 'Lời giải thích từ phía nghiên cứu',
        body:
          'Hugo Huijer của Productrise nêu logic đằng sau: nếu Google đã kỳ vọng người dùng sẽ hỏi thêm một câu nữa, thì không cần bày ra hai mươi sản phẩm ngay từ đầu. Chế độ AI được thiết kế cho hành trình hội thoại nhiều lượt, không phải cho một lần gõ rồi chọn.',
      },
      {
        heading: 'Việc phải làm đổi từ thứ hạng sang dữ liệu sản phẩm',
        body:
          'Khi chỉ còn 4,3 chỗ mỗi trang và logic xếp hạng khác hẳn, thủ thuật tối ưu thứ hạng cũ mất tác dụng. Thứ quyết định là chất lượng dữ liệu sản phẩm: tên gọi đúng, thuộc tính đầy đủ, mô tả trả lời được câu hỏi thật của người mua. Jason Berkowitz của Break The Web nhận định thương hiệu chủ động chuẩn hoá dữ liệu sản phẩm sẽ đi trước ba bước.',
      },
    ],
    impact:
      'Trưởng phòng cần chuyển ngân sách và nhân lực từ tối ưu thứ hạng tìm kiếm sang chuẩn hoá dữ liệu sản phẩm trong nguồn cấp dữ liệu, đồng thời ngừng coi vị trí tốt ở tìm kiếm thường là bảo chứng cho lượng truy cập tương lai.',
    ifIgnored:
      'Lượng truy cập tự nhiên từ tìm kiếm mua sắm sẽ giảm dần mà báo cáo thứ hạng vẫn đẹp, vì thứ hạng đo ở giao diện cũ trong khi người dùng đã chuyển sang giao diện mới. Phát hiện ra thì đã mất vài quý.',
    actionChecklist: [
      'Kiểm tra nguồn cấp dữ liệu sản phẩm: tên, thuộc tính, phân loại, mô tả phải đầy đủ và đúng, không viết tắt',
      'Tự chạy thử 30 truy vấn quan trọng nhất ở cả tìm kiếm thường và chế độ AI, ghi lại sản phẩm nào xuất hiện',
      'Ngừng dùng báo cáo thứ hạng làm chỉ số duy nhất, bổ sung chỉ số hiển thị trong chế độ AI',
      'Viết lại mô tả sản phẩm theo hướng trả lời câu hỏi thật của người mua thay vì nhồi từ khoá',
    ],
  },
  {
    id: 'real-2026-07-01-google-ads-tos',
    category: 'Google Ads & SEO',
    platformIcon: 'Search',
    title: 'Điều khoản Google Ads hiệu lực 01/07/2026: hệ thống được tự sinh từ khoá, mẫu quảng cáo và trang đích thay nhà quảng cáo',
    publishedAt: '01/07/2026',
    isHot: true,
    illustration: 'ai-label',
    image: {
      url: 'https://searchengineland.com/wp-content/seloads/2026/02/Why-Google-Ads-auctions-now-run-on-intent-not-keywords.jpg',
      credit: 'Ảnh: Search Engine Land',
    },
    sourceUrl: 'https://searchengineland.com/google-ads-updates-terms-of-service-ahead-of-july-2026-rollout-479255',
    source: 'Search Engine Land - Anu Adegbola',
    readTime: '5 phút đọc',
    tags: ['AI Max', 'Điều khoản', 'Tự động hoá', 'Trách nhiệm pháp lý'],
    summary:
      'Điều khoản dịch vụ mới của Google Ads có hiệu lực 01/07/2026, cho phép hệ thống tự động định dạng, chọn hoặc tạo ra mục tiêu nhắm, mẫu quảng cáo và trang đích thay mặt nhà quảng cáo. Không có bước xác nhận lại: mọi tài khoản bị ràng buộc ngay khi điều khoản có hiệu lực.',
    keyNumbers: [
      { value: '01/07', label: 'ngày điều khoản có hiệu lực' },
      { value: '0', label: 'bước xác nhận lại được yêu cầu' },
      { value: '02/2027', label: 'mốc khai tử Dynamic Search Ads' },
    ],
    content: [
      {
        heading: 'Câu chữ thay đổi và ý nghĩa của nó',
        body:
          'Điều khoản mới trao cho Google quyền phân phối quảng cáo, bao gồm việc dùng các tính năng tự động để định dạng, chọn hoặc tạo ra mục tiêu nhắm, mẫu quảng cáo và trang đích thay mặt khách hàng. Chữ tạo ra ở đây là điểm mới: hệ thống không chỉ chọn trong những gì bạn cung cấp mà có thể sinh ra nội dung mới.',
      },
      {
        heading: 'Không có nút đồng ý',
        body:
          'Không có lời nhắc khi đăng nhập, không có ô tích, không có bước chọn tham gia. Mọi tài khoản Google Ads tự động bị ràng buộc vào điều khoản sửa đổi ngay thời điểm nó có hiệu lực. Ai chưa đọc thì vẫn đang chạy dưới bộ quy tắc mới.',
      },
      {
        heading: 'Trách nhiệm vẫn thuộc về nhà quảng cáo',
        body:
          'Điều khoản ghi rõ nhà quảng cáo vẫn chịu trách nhiệm rà soát, phê duyệt, chỉnh sửa hoặc gỡ bỏ chiến dịch và tài sản quảng cáo, kể cả những thứ do công cụ của Google tự tạo ra. Đây là điểm bất đối xứng cần nắm: máy được quyền tạo, nhưng người phải chịu trách nhiệm nếu nội dung máy tạo sai sự thật hoặc vi phạm quy định ngành.',
      },
      {
        heading: 'Dữ liệu bạn gõ vào công cụ hội thoại',
        body:
          'Thông tin nhà quảng cáo nhập vào các công cụ hội thoại và tính năng tương tự trong Google Ads nay có thể được hệ thống của Google dùng để cải thiện hiệu quả chiến dịch trên toàn nền tảng. Điều khoản cũng cho phép Google truy cập và quét các đường dẫn cùng tài khoản mà nhà quảng cáo cấp quyền.',
      },
      {
        heading: 'Lịch trình phải nhớ',
        body:
          'AI Max ra khỏi giai đoạn thử nghiệm với bộ điều khiển nhắm mục tiêu và nội dung mạnh hơn. Từ tháng 9/2026, các công cụ cũ như Dynamic Search Ads bắt đầu tự động nâng cấp lên AI Max, và khai tử hoàn toàn vào tháng 2/2027. Ngoài ra từ 13/07/2026 Google yêu cầu gắn nhãn với mẫu quảng cáo hiển thị và video có yếu tố do AI tạo.',
      },
    ],
    impact:
      'Trưởng phòng phải lập quy trình rà soát định kỳ các tài sản quảng cáo do hệ thống tự sinh, vì trách nhiệm pháp lý với nội dung sai vẫn thuộc về doanh nghiệp chứ không thuộc về Google.',
    ifIgnored:
      'Hệ thống tự sinh một mẫu quảng cáo nói sai về sản phẩm hoặc vi phạm quy định ngành, doanh nghiệp là bên chịu trách nhiệm. Với ngành có quy định chặt như dược, tài chính, giáo dục, hậu quả không dừng ở việc bị từ chối quảng cáo.',
    actionChecklist: [
      'Lập lịch rà soát hằng tuần toàn bộ tài sản quảng cáo do hệ thống tự sinh trong tài khoản',
      'Rà lại các chiến dịch Dynamic Search Ads và lên kế hoạch chuyển sang AI Max trước tháng 9/2026',
      'Gắn nhãn đúng quy định cho mọi mẫu quảng cáo hiển thị và video có yếu tố do AI tạo',
      'Với ngành có quy định chặt, cân nhắc giới hạn quyền tự sinh nội dung và giữ khâu duyệt thủ công',
    ],
    deadline: 'Dynamic Search Ads tự nâng cấp lên AI Max từ tháng 9/2026, khai tử hoàn toàn tháng 2/2027',
  },
  {
    id: 'real-2026-07-30-gsc-ai-bay',
    category: 'AI Marketing',
    platformIcon: 'Sparkles',
    title: 'Báo cáo AI mới trong Search Console là một cái bẫy: đếm lượt hiển thị nhưng giấu lượt nhấp',
    publishedAt: '30/07/2026',
    isHot: true,
    illustration: 'zero-click',
    image: {
      url: 'https://cdn.searchenginejournal.com/wp-content/uploads/2026/07/gsc-trap-859.png',
      credit: 'Ảnh: Search Engine Journal',
    },
    sourceUrl: 'https://www.searchenginejournal.com/googles-generative-ai-search-console-data-is-a-trap-for-marketers/584018/',
    source: 'Search Engine Journal',
    readTime: '5 phút đọc',
    tags: ['Search Console', 'Đo lường', 'AI Overviews', 'Báo cáo'],
    summary:
      'Google mở báo cáo AI Overviews trong Search Console từ đầu tháng 6/2026. Sau gần tám tuần dữ liệu, giới hạn đã lộ rõ: báo cáo chỉ đếm lượt hiển thị, không có lượt nhấp, không có truy vấn, không có giá trị chuyển đổi. Tệ hơn, cách tính thứ hạng của nó làm báo cáo đẹp lên trong khi doanh thu đi xuống.',
    keyNumbers: [
      { value: '0', label: 'lượt nhấp được báo cáo' },
      { value: 'Vị trí 1', label: 'gán cho mọi đường dẫn trong khối AI' },
      { value: '8 tuần', label: 'dữ liệu đã đủ để thấy vấn đề' },
    ],
    content: [
      {
        heading: 'Báo cáo cho gì và giấu gì',
        body:
          'Báo cáo đưa ra số lượt hiển thị trong khung trả lời AI Overviews và bảng AI Mode. Không có số lượt nhấp, không có chi tiết truy vấn, không có giá trị kinh tế của chuyển đổi. Nguyên nhân nằm ở bản chất: câu trả lời do AI tóm tắt đã làm người dùng thoả mãn ngay trên trang kết quả, nên họ không bấm đi đâu nữa.',
      },
      {
        heading: 'Méo mó thứ nhất: hiển thị không ra tiền',
        body:
          'Người dùng đọc xong bản tóm tắt rồi rời đi mà không bấm vào đường dẫn nào. Một lượt hiển thị không kèm tương tác thì không tạo ra đồng doanh thu nào. Nhưng trên báo cáo, nó vẫn được cộng vào cột lượt hiển thị y như mọi lượt hiển thị khác.',
      },
      {
        heading: 'Méo mó thứ hai: ai cũng thành vị trí một',
        body:
          'Mọi đường dẫn nằm trong một khối AI Overviews đều được Search Console ghi là vị trí một, bất kể thực tế nó hiện ở đâu. Một trích dẫn phụ nằm trong menu phải bấm mới mở ra được xếp ngang hàng với đoạn trích nổi bật đầu trang. Đây là méo mó có tính cấu trúc, thổi phồng thứ hạng của tất cả các tên miền cùng lúc.',
      },
      {
        heading: 'Méo mó thứ ba: vị trí trung bình đánh lừa',
        body:
          'Giả sử một đường dẫn xuất hiện trong khối AI ở vị trí một, đồng thời xếp hạng tự nhiên ở vị trí bốn. Search Console báo vị trí trung bình 2,5 — con số đẹp hơn hẳn thực tế. Trong khi đó, thứ thực sự kéo người truy cập về vẫn là vị trí bốn kia. Báo cáo càng đẹp thì khoảng cách với doanh thu càng xa.',
      },
      {
        heading: 'Nên đo bằng gì thay thế',
        body:
          'Lấy doanh thu tự nhiên và số khách hàng tiềm năng làm chỉ số chính thay cho lượt hiển thị trong Search Console. Chuyển sang công cụ phân tích dữ liệu của chính mình. Bỏ chỉ số vị trí trung bình, dùng vị trí trung vị vì nó không bị một điểm dữ liệu bất thường kéo lệch. Và cuối cùng, đo lượt chuyển đổi của người thật ghé trang, không đo sự hiện diện.',
      },
    ],
    impact:
      'Trưởng phòng phải ngăn đội SEO báo cáo tăng trưởng bằng lượt hiển thị AI trong Search Console. Chỉ số đó có thể tăng đều trong khi doanh thu tự nhiên giảm, và không ai phát hiện ra vì bảng báo cáo tuần nào cũng xanh.',
    ifIgnored:
      'Đội ngũ tiếp tục được khen thưởng theo một chỉ số không liên quan tới tiền. Đến khi doanh thu tự nhiên tụt đủ sâu để ban lãnh đạo hỏi, sẽ mất thêm vài tháng nữa để tìm ra rằng báo cáo đã sai hướng ngay từ đầu.',
    actionChecklist: [
      'Gỡ chỉ số lượt hiển thị AI Overviews khỏi báo cáo hiệu quả hằng tuần, hoặc ghi rõ đó không phải chỉ số kết quả',
      'Đổi vị trí trung bình sang vị trí trung vị trong mọi báo cáo thứ hạng',
      'Lấy doanh thu tự nhiên và số khách hàng tiềm năng từ công cụ phân tích của mình làm chỉ số chấm điểm chính',
      'Đối chiếu lượt truy cập tự nhiên thực tế với lượt hiển thị báo cáo, ghi lại khoảng cách để theo dõi theo tháng',
    ],
  },
  {
    id: 'real-2026-07-29-ai-search-chua-co-chu',
    category: 'AI Marketing',
    platformIcon: 'Sparkles',
    title: 'Nghiên cứu 600.000 trích dẫn: 89% nhu cầu tìm kiếm bằng AI vẫn chưa có thương hiệu nào chiếm lĩnh',
    publishedAt: '29/07/2026',
    isHot: false,
    illustration: 'data-signal',
    image: {
      url: 'https://cdn.searchenginejournal.com/wp-content/uploads/2026/07/chatgpt-winners-252.png',
      credit: 'Ảnh: Search Engine Journal',
    },
    sourceUrl: 'https://www.searchenginejournal.com/89-of-ai-search-demand-has-no-clear-owner-use-this-before-the-window-closes/583255/',
    source: 'Search Engine Journal',
    readTime: '6 phút đọc',
    tags: ['AI Search', 'ChatGPT', 'Định vị thương hiệu', 'Cơ hội sớm'],
    summary:
      'Kevin Indig phân tích dữ liệu Semrush trên 1.094 nhóm ngành tại Mỹ, hơn 50.000 thương hiệu và hơn 600.000 trích dẫn trong nửa đầu 2026. Chỉ 15,2% nhóm ngành có một thương hiệu chiếm lĩnh rõ ràng trong câu trả lời của ChatGPT. Phần còn lại vẫn đang bỏ ngỏ, và đó chính là cửa sổ cho người vào sớm.',
    keyNumbers: [
      { value: '89,3%', label: 'nhu cầu chưa có chủ rõ ràng' },
      { value: '15,2%', label: 'nhóm ngành đã có chủ' },
      { value: '53,7%', label: 'nhóm ngành hoàn toàn bỏ ngỏ' },
    ],
    content: [
      {
        heading: 'Nghiên cứu đo cái gì',
        body:
          'Dữ liệu Semrush trong sáu tháng đầu năm 2026, trải trên 1.094 nhóm ngành tại Mỹ, mỗi nhóm chạy năm dạng câu hỏi, tổng cộng hơn 50.000 thương hiệu và hơn 600.000 lượt trích dẫn trên ChatGPT. Một nhóm ngành được coi là đã có chủ khi một thương hiệu xuất hiện ở ít nhất 4 trên 5 câu hỏi và dẫn trước thương hiệu thứ hai từ 5 điểm phần trăm trở lên.',
      },
      {
        heading: 'Bức tranh phân bố',
        body:
          'Chỉ 15,2% nhóm ngành có chủ rõ ràng. 31,1% có thương hiệu đang nổi lên nhưng khoảng cách chưa đủ. Và 53,7% hoàn toàn chưa ngã ngũ, không thương hiệu nào dẫn nổi 3 trên 5 câu hỏi. Cộng lại, 89,3% lượng nhu cầu tìm kiếm bằng AI nằm ở những nhóm ngành chưa ai chiếm được. Nói cách khác, những chỗ đáng tiền nhất hiện là những chỗ chưa ngã ngũ nhất.',
      },
      {
        heading: 'Chiếm được rồi thì giữ được',
        body:
          'Thương hiệu đã có vị thế chủ giữ được vị trí đầu trong 90,4% các lần so sánh tháng này với tháng kế. Nhưng những thương hiệu dẫn với khoảng cách mỏng, trung vị 1,3 điểm phần trăm, thì dễ bị thay thế. Nhóm giữ được ổn định có khoảng cách trung vị 2,9 điểm. Ngưỡng 3 điểm phần trăm vì thế là ranh giới giữa giữ được và chưa chắc.',
      },
      {
        heading: 'Được trích dẫn không đồng nghĩa được nhắc tên',
        body:
          'Đây là phát hiện dễ dẫn tới làm sai. Tương quan giữa số lần được trích dẫn và số lần được nhắc tên chỉ là âm 0,229, tức gần như không liên quan. Tên miền được trích dẫn nhiều nhất trùng với thương hiệu được nhắc nhiều nhất chỉ trong 20,8% trường hợp. Đuổi theo việc được trích dẫn không tự động biến thành được nhớ tên. Như bài viết diễn đạt: trích dẫn là cái cửa, không phải căn phòng.',
      },
      {
        heading: 'Cách làm được đề xuất',
        body:
          'Chọn 10 đến 20 nhóm ngành ưu tiên, theo dõi bằng năm dạng câu hỏi: định nghĩa, so sánh, danh sách lựa chọn thay thế, tình huống sử dụng, và quyết định mua. Ưu tiên dồn lực vào những nhóm mà khoảng cách dẫn đầu dưới 3 điểm phần trăm, vì đó là nơi ngôi đầu còn đổi chủ được. Và chuyển trọng tâm từ săn trích dẫn sang làm sao được nhắc tên, bằng nội dung, bằng bằng chứng cụ thể, bằng việc được bên thứ ba nói tới, và bằng một định vị rõ ràng.',
      },
    ],
    impact:
      'Trưởng phòng đang có cơ hội chiếm vị trí mặc định trong câu trả lời AI cho ngành của mình với chi phí thấp hơn nhiều so với giành thứ hạng tìm kiếm truyền thống, nhưng chỉ trong lúc phần lớn nhóm ngành còn bỏ ngỏ.',
    ifIgnored:
      'Khi thị trường ngã ngũ, dữ liệu cho thấy người đã chiếm được giữ ngôi đầu trong hơn 90% các tháng. Vào sau lúc đó nghĩa là phải phá vỡ một vị thế đã ổn định, tốn kém hơn nhiều so với việc chiếm chỗ trống ngay lúc này.',
    actionChecklist: [
      'Chọn 10-20 nhóm sản phẩm ưu tiên, chạy thử 5 dạng câu hỏi trên ChatGPT và ghi lại thương hiệu nào được nhắc',
      'Xác định nhóm nào khoảng cách dẫn đầu dưới 3 điểm phần trăm và dồn nội dung vào đúng nhóm đó',
      'Chuyển mục tiêu từ được trích dẫn sang được nhắc tên: bổ sung bằng chứng cụ thể, số liệu, tình huống dùng thật',
      'Đặt lịch đo lại hằng tháng, vì ngôi đầu ở nhóm chưa ngã ngũ đổi chủ liên tục',
    ],
  },
];

/* ------------------------------------------------------------------ *
 * TIN MÔ PHỎNG - kịch bản đào tạo, không có bài báo thật đứng sau     *
 * ------------------------------------------------------------------ */
const SIMULATED_NEWS_ITEMS = [
  {
    id: 'news-01',
    category: 'Meta Ads',
    platformIcon: 'Facebook',
    title: 'Meta ra mắt thuật toán AI Andromeda 2.0: tự động hoá 90% việc phân bổ ngân sách nhóm quảng cáo',
    publishedAt: '28/07/2026',
    isHot: true,
    illustration: 'ai-budget',
    source: 'Meta Business Newsroom',
    readTime: '5 phút đọc',
    tags: ['Advantage+', 'Ngân sách', 'Creative', 'Broad Targeting'],
    summary:
      'Meta nâng cấp Advantage+ Shopping Campaigns với khả năng tự phân bổ giá thầu theo thời gian thực dựa trên hành vi đa ứng dụng (Facebook, Instagram Reels, Messenger, Threads). Người chạy quảng cáo mất quyền can thiệp thủ công vào phần lớn quyết định phân bổ.',
    keyNumbers: [
      { value: '90%', label: 'ngân sách do máy tự phân bổ' },
      { value: '1 → 6', label: 'số nhóm quảng cáo nên gộp lại' },
      { value: '15-20', label: 'góc creative cần chuẩn bị mỗi tháng' },
    ],
    content: [
      {
        heading: 'Chuyện gì vừa thay đổi',
        body:
          'Trước đây nhà quảng cáo chia nhỏ nhiều nhóm theo độ tuổi, sở thích, vị trí rồi tự phân ngân sách cho từng nhóm. Andromeda 2.0 gộp toàn bộ tín hiệu đó vào một tầng máy học duy nhất và tự dịch chuyển tiền giữa các tổ hợp đối tượng - nội dung - vị trí hiển thị theo từng giờ. Phần nhà quảng cáo còn kiểm soát chỉ còn ba thứ: tổng ngân sách, mục tiêu chuyển đổi và kho nội dung nạp vào.',
      },
      {
        heading: 'Vì sao Meta đi theo hướng này',
        body:
          'Sau các đợt siết quyền riêng tư, tín hiệu theo dõi từng cá nhân ngày càng thưa. Máy học trên tệp lớn bù được phần dữ liệu thiếu tốt hơn nhiều so với việc con người chia tệp thủ công. Thực tế các tài khoản chạy thử cho thấy chia tệp càng nhỏ thì mỗi nhóm càng lâu thoát giai đoạn học máy, đẩy chi phí mỗi chuyển đổi lên cao.',
      },
      {
        heading: 'Việc của phòng Marketing dịch chuyển đi đâu',
        body:
          'Từ tối ưu cấu hình chiến dịch sang sản xuất nội dung. Khi thuật toán quyết định phân phối, thứ duy nhất tạo khác biệt giữa hai nhà quảng cáo cùng ngân sách là số lượng và độ đa dạng của góc tiếp cận trong kho creative. Một tài khoản có 20 góc nội dung khác nhau sẽ cho máy nhiều lựa chọn hơn hẳn tài khoản chỉ có 3 mẫu đổi màu nền.',
      },
      {
        heading: 'Điểm cần cảnh giác',
        body:
          'Gộp mọi sản phẩm vào một chiến dịch tự động sẽ khiến các mã hàng biên lợi nhuận thấp ăn hết ngân sách vì chúng dễ ra đơn hơn. Nên tách chiến dịch theo nhóm biên lợi nhuận, không tách theo tệp đối tượng.',
      },
    ],
    impact:
      'Trưởng phòng cần dừng việc dựng cấu trúc nhóm quảng cáo thủ công rườm rà, chuyển 80% thời gian đội ngũ sang sản xuất 15-20 góc creative mỗi tháng và kiểm soát chất lượng tín hiệu chuyển đổi gửi về.',
    ifIgnored:
      'Giữ cấu trúc chia tệp cũ sẽ khiến mỗi nhóm không đủ 50 chuyển đổi/tuần để thoát giai đoạn học máy, chi phí mỗi đơn hàng tăng dần mà không tìm ra nguyên nhân trong trình quản lý.',
    actionChecklist: [
      'Chuyển ngân sách thử nghiệm sang Advantage+ Budget, chạy song song 2 tuần với cấu trúc cũ để so sánh',
      'Tách chiến dịch theo nhóm biên lợi nhuận thay vì theo tệp đối tượng',
      'Sản xuất tối thiểu 5 mẫu video Reels chuẩn 9:16 mỗi tuần, khác nhau ở phần Hook',
      'Kiểm tra Conversions API để tín hiệu chuyển đổi không bị hụt khi máy học phân bổ',
    ],
    deadline: 'Áp dụng mặc định cho tài khoản Việt Nam từ 15/08/2026',
  },
  {
    id: 'news-02',
    category: 'TikTok Shop & Ads',
    platformIcon: 'Video',
    title: 'TikTok Shop đổi thuật toán đề xuất GMV Max: ưu tiên shop có chỉ số CSAT trên 4.5',
    publishedAt: '28/07/2026',
    isHot: true,
    illustration: 'shop-health',
    source: 'TikTok Seller Center - Thông báo chính sách',
    readTime: '4 phút đọc',
    tags: ['GMV Max', 'Shop Health', 'Vận hành', 'Livestream'],
    summary:
      'TikTok điều chỉnh chỉ số phân phối cho Livestream và video gắn giỏ hàng. Shop có tỷ lệ huỷ đơn cao hoặc điểm đánh giá dưới 4.2 sao sẽ bị cắt tới 50% lượng hiển thị tự nhiên, kể cả khi vẫn chi tiền quảng cáo.',
    keyNumbers: [
      { value: '4.5', label: 'ngưỡng CSAT để được ưu tiên' },
      { value: '-50%', label: 'lượt hiển thị nếu dưới 4.2 sao' },
      { value: '< 24h', label: 'thời gian bàn giao vận chuyển mục tiêu' },
    ],
    content: [
      {
        heading: 'Nội dung thay đổi',
        body:
          'Điểm sức khoẻ gian hàng (Shop Health) từ chỗ chỉ ảnh hưởng tới quyền tham gia chương trình khuyến mại nay trở thành một biến số trực tiếp trong công thức phân phối. TikTok cộng gộp bốn nhóm chỉ số: tỷ lệ huỷ đơn do người bán, thời gian bàn giao vận chuyển, tốc độ phản hồi tin nhắn và điểm đánh giá sản phẩm.',
      },
      {
        heading: 'Hệ quả với ngân sách quảng cáo',
        body:
          'Đây là lần đầu một chỉ số vận hành hậu cần ảnh hưởng tới hiệu quả đồng tiền quảng cáo trong cùng một phiên. Hai shop cùng chi một mức tiền, cùng chất lượng video, shop có điểm sức khoẻ thấp hơn sẽ nhận ít lượt xem hơn và do đó chi phí mỗi đơn cao hơn. Phòng Marketing không còn tự quyết được kết quả của chính mình.',
      },
      {
        heading: 'Chỗ dễ mất điểm nhất',
        body:
          'Trong dữ liệu các shop Việt Nam, hai nguyên nhân mất điểm phổ biến nhất không nằm ở chất lượng sản phẩm mà ở khâu tồn kho ảo dẫn tới huỷ đơn, và khâu trả lời tin nhắn ngoài giờ hành chính. Cả hai đều xử lý được mà không tốn thêm chi phí lớn.',
      },
    ],
    impact:
      'Chỉ số vận hành nay ảnh hưởng trực tiếp tới lưu lượng quảng cáo. Trưởng phòng Marketing buộc phải ngồi chung bàn với bộ phận Kho và Chăm sóc khách hàng, thay vì chỉ báo cáo số liệu quảng cáo riêng lẻ.',
    ifIgnored:
      'Ngân sách vẫn tiêu hết nhưng lượt xem tụt dần mỗi tuần. Đội ngũ sẽ đổ lỗi cho nội dung và liên tục thay creative trong khi gốc rễ nằm ở tỷ lệ huỷ đơn của kho.',
    actionChecklist: [
      'Rà soát bảng Shop Health trên TikTok Seller Center, chụp lại số liệu nền để theo dõi hàng tuần',
      'Đồng bộ tồn kho thực tế lên sàn mỗi ngày để cắt nguyên nhân huỷ đơn do hết hàng',
      'Đặt chỉ tiêu bàn giao đơn cho đơn vị vận chuyển dưới 24 giờ, đưa vào KPI của bộ phận Kho',
      'Cài trả lời tự động ngoài giờ, giữ thời gian phản hồi trung bình dưới 3 phút',
    ],
    deadline: 'Có hiệu lực với toàn bộ shop từ 05/08/2026',
  },
  {
    id: 'news-03',
    category: 'Google Ads & SEO',
    platformIcon: 'Search',
    title: 'Google AI Overviews mở rộng tại Việt Nam: lượt nhấp vào kết quả tự nhiên giảm 35%',
    publishedAt: '28/07/2026',
    isHot: true,
    illustration: 'zero-click',
    source: 'Google Search Central',
    readTime: '6 phút đọc',
    tags: ['SEO', 'AI Overviews', 'Zero-click', 'GEO', 'E-E-A-T'],
    summary:
      'Google hiển thị câu trả lời tổng hợp bằng AI ngay đầu trang kết quả cho phần lớn truy vấn thông tin tiếng Việt. Người dùng đọc xong câu trả lời mà không cần bấm vào bất kỳ website nào.',
    keyNumbers: [
      { value: '-35%', label: 'lượt nhấp vào kết quả tự nhiên' },
      { value: '~60%', label: 'truy vấn thông tin có AI Overviews' },
      { value: '2-3x', label: 'chênh lệch giá trị của từ khoá mua hàng' },
    ],
    content: [
      {
        heading: 'Bức tranh đang thay đổi',
        body:
          'Truy vấn dạng tìm hiểu kiến thức là nhóm chịu tác động nặng nhất. Câu hỏi kiểu cách chọn máy lọc không khí hay dấu hiệu da khô nay được AI tổng hợp thành một đoạn trả lời gọn ghẽ ngay đầu trang, kèm vài đường dẫn nhỏ mà tỷ lệ bấm vào rất thấp.',
      },
      {
        heading: 'Nhóm nội dung nào vẫn sống',
        body:
          'Ba nhóm ít bị ảnh hưởng: truy vấn có ý định mua rõ ràng (kèm giá, mua ở đâu, khuyến mại), truy vấn cần trải nghiệm cá nhân thật (đánh giá sau 6 tháng dùng, so sánh của người đã mua cả hai), và truy vấn cần dữ liệu độc quyền mà AI không tổng hợp được từ nguồn công khai.',
      },
      {
        heading: 'GEO thay chỗ cho một phần SEO',
        body:
          'Tối ưu cho công cụ sinh nội dung (Generative Engine Optimization) tập trung vào việc được AI trích dẫn thay vì được xếp hạng cao. Cách làm gồm: cấu trúc câu trả lời ngắn gọn ngay đầu bài, đánh dấu dữ liệu có cấu trúc, ghi rõ tác giả và bằng chứng chuyên môn, và cập nhật số liệu theo mốc thời gian cụ thể.',
      },
      {
        heading: 'Điều chỉnh cách đo lường',
        body:
          'Chỉ số traffic tự nhiên sẽ giảm ngay cả khi thứ hạng không đổi. Cần bổ sung chỉ số lượt hiển thị trong Search Console và Share of Search vào báo cáo, nếu không báo cáo tháng sẽ trông như một thất bại của đội SEO trong khi thị phần thực tế không đổi.',
      },
    ],
    impact:
      'SEO kéo traffic thông tin thuần tuý mất dần hiệu quả. Cần dịch chuyển ngân sách nội dung sang nhóm từ khoá có ý định mua và nội dung mang trải nghiệm thật mà AI không tự tổng hợp được.',
    ifIgnored:
      'Traffic tự nhiên tụt đều mỗi tháng, đội SEO bị đánh giá kém oan, và doanh nghiệp buộc phải mua lại chính lượng truy cập đó bằng quảng cáo với chi phí cao hơn.',
    actionChecklist: [
      'Phân loại lại toàn bộ tuyến bài theo ý định tìm kiếm, tạm dừng nhóm bài kiến thức chung chung',
      'Bổ sung dữ liệu có cấu trúc cho trang sản phẩm, câu hỏi thường gặp và đánh giá',
      'Đặt chỉ tiêu mỗi tháng có tối thiểu 4 bài dựa trên dữ liệu hoặc trải nghiệm nội bộ độc quyền',
      'Thêm lượt hiển thị và Share of Search vào báo cáo tháng thay vì chỉ báo cáo phiên truy cập',
      'Tăng ngân sách Google Search cho nhóm từ khoá chốt đơn để bù phần traffic tự nhiên mất đi',
    ],
  },
  {
    id: 'news-04',
    category: 'Meta Ads',
    platformIcon: 'Facebook',
    title: 'Chi phí hiển thị Meta tại Việt Nam tăng 28% trong quý III do mùa cao điểm bắt đầu sớm',
    publishedAt: '28/07/2026',
    isHot: true,
    illustration: 'cpm-auction',
    source: 'Báo cáo tổng hợp từ các đại lý Meta khu vực Đông Nam Á',
    readTime: '4 phút đọc',
    tags: ['CPM', 'Đấu giá', 'Ngân sách', 'Mùa vụ'],
    summary:
      'Dữ liệu tổng hợp từ nhiều đại lý cho thấy CPM trung bình ngành bán lẻ tăng 28% so với quý trước. Nguyên nhân chính là các nhãn hàng bắt đầu gom tệp cho mùa cao điểm cuối năm sớm hơn thường lệ khoảng sáu tuần.',
    keyNumbers: [
      { value: '+28%', label: 'CPM trung bình ngành bán lẻ' },
      { value: '6 tuần', label: 'mùa cao điểm đến sớm hơn' },
      { value: '+40%', label: 'mức tăng dự kiến giai đoạn 11/11' },
    ],
    content: [
      {
        heading: 'Cơ chế đằng sau con số',
        body:
          'CPM không phải giá do nền tảng đặt ra mà là kết quả của một phiên đấu giá. Khi số nhà quảng cáo cùng nhắm vào một tệp tăng lên, mức giá cần trả để giành được lượt hiển thị tự động leo theo. Việc nhiều nhãn hàng cùng khởi động chiến dịch gom tệp sớm khiến áp lực đấu giá dồn vào cùng một thời điểm.',
      },
      {
        heading: 'Hai cách phản ứng khác nhau',
        body:
          'Cách thứ nhất là cắt ngân sách chờ giá hạ - thường sai, vì giá sẽ còn tăng tiếp tới cuối năm và tệp gom được lúc này sẽ rẻ hơn tệp gom vào tháng 11. Cách thứ hai là giữ ngân sách nhưng dịch chuyển mục tiêu: dùng giai đoạn này để gom tệp tương tác và danh sách khách hàng, để dành ngân sách chuyển đổi cho đúng đợt cao điểm.',
      },
      {
        heading: 'Đòn bẩy trong tầm tay',
        body:
          'CPM tăng do thị trường thì không kiểm soát được, nhưng CPM của riêng tài khoản còn phụ thuộc vào chất lượng nội dung. Mẫu quảng cáo giữ chân người xem tốt được thuật toán phân phối rẻ hơn. Chênh lệch CPM giữa mẫu tốt nhất và tệ nhất trong cùng một tài khoản thường lên tới hai lần.',
      },
    ],
    impact:
      'Kế hoạch ngân sách quý III lập từ đầu năm gần như chắc chắn bị vỡ. Trưởng phòng cần trình bày lại với Ban Giám Đốc bằng dữ liệu thị trường, kèm phương án dịch chuyển mục tiêu chiến dịch thay vì chỉ xin thêm tiền.',
    ifIgnored:
      'Giữ nguyên chỉ tiêu số đơn với ngân sách cũ sẽ dẫn tới việc đội ngũ hạ giá bán hoặc chạy khuyến mại liên tục để cứu chỉ tiêu, phá cấu trúc giá dài hạn.',
    actionChecklist: [
      'Cập nhật lại dự báo CPM trong bảng kế hoạch ngân sách quý III và quý IV',
      'Chuyển một phần ngân sách sang mục tiêu gom tệp tương tác và thu thập dữ liệu khách hàng',
      'Xếp hạng toàn bộ mẫu quảng cáo đang chạy theo CPM, tắt nhóm 30% kém nhất',
      'Đặt trước ngân sách dự phòng cho giai đoạn 11/11 với mức CPM cao hơn 40%',
    ],
  },
  {
    id: 'news-05',
    category: 'Meta Ads',
    platformIcon: 'Facebook',
    title: 'Meta siết chính sách dữ liệu quảng cáo khu vực Châu Á: bắt buộc khai báo nguồn tệp khách hàng tải lên',
    publishedAt: '28/07/2026',
    isHot: false,
    illustration: 'account-security',
    source: 'Meta Business Help Center',
    readTime: '4 phút đọc',
    tags: ['Bảo mật', 'Custom Audience', 'Tuân thủ', 'Business Manager'],
    summary:
      'Tài khoản doanh nghiệp phải bật xác thực hai lớp, hoàn tất xác minh danh tính và khai báo nguồn gốc mọi danh sách khách hàng tải lên để tạo tệp tuỳ chỉnh. Tài khoản thiếu bất kỳ mục nào sẽ bị hạn chế trong đợt quét định kỳ.',
    keyNumbers: [
      { value: '3 lớp', label: 'yêu cầu tuân thủ bắt buộc' },
      { value: '30 ngày', label: 'thời gian khắc phục trước khi bị hạn chế' },
    ],
    content: [
      {
        heading: 'Ba yêu cầu cụ thể',
        body:
          'Thứ nhất, xác minh doanh nghiệp bằng giấy phép kinh doanh trên Business Manager. Thứ hai, xác thực quyền sở hữu tên miền của website đang gắn pixel. Thứ ba, với mỗi danh sách khách hàng tải lên, phải chọn nguồn thu thập và xác nhận đã có sự đồng ý của khách hàng.',
      },
      {
        heading: 'Vì sao nên làm sớm',
        body:
          'Quy trình xác minh doanh nghiệp mất từ vài ngày tới hai tuần nếu hồ sơ có sai lệch giữa tên trên giấy phép và tên trên tài khoản. Làm trước lúc bị quét thì chỉ là thủ tục hành chính; làm sau khi bị hạn chế thì toàn bộ chiến dịch đứng yên trong thời gian chờ.',
      },
      {
        heading: 'Rủi ro thường bị bỏ sót',
        body:
          'Nhiều doanh nghiệp dùng danh sách khách hàng mua từ bên thứ ba để tạo tệp tuỳ chỉnh. Với quy định mới, việc này không còn khai báo hợp lệ được và là nguyên nhân khoá tài khoản trực tiếp, không có cảnh báo trước.',
      },
    ],
    impact:
      'Đây là việc hành chính nhưng rủi ro thuộc loại nghiêm trọng nhất: mất tài khoản quảng cáo giữa mùa cao điểm đồng nghĩa mất toàn bộ doanh thu kênh trong nhiều tuần.',
    ifIgnored:
      'Tài khoản bị hạn chế trong đợt quét định kỳ, mọi chiến dịch dừng đột ngột, và quá trình khiếu nại thường kéo dài hơn hai tuần.',
    actionChecklist: [
      'Kiểm tra trạng thái xác minh doanh nghiệp trên Business Manager ngay trong tuần này',
      'Hoàn tất xác thực tên miền cho toàn bộ website đang gắn pixel',
      'Rà soát nguồn gốc mọi danh sách khách hàng đang dùng, loại bỏ danh sách mua ngoài',
      'Bật xác thực hai lớp cho tất cả tài khoản có quyền quản trị',
    ],
    deadline: 'Đợt quét đầu tiên bắt đầu từ 01/09/2026',
  },
  {
    id: 'news-06',
    category: 'TikTok Shop & Ads',
    platformIcon: 'Video',
    title: 'TikTok nâng hoa hồng liên kết mặc định với KOC ngành thời trang lên 15%',
    publishedAt: '28/07/2026',
    isHot: false,
    illustration: 'affiliate-commission',
    source: 'TikTok Shop Affiliate - Cập nhật chính sách',
    readTime: '3 phút đọc',
    tags: ['Affiliate', 'KOC', 'Hoa hồng', 'Thời trang'],
    summary:
      'Mức hoa hồng mặc định cho ngành hàng thời trang được nâng từ 10% lên 15% nhằm khuyến khích KOC đẩy mạnh nội dung bán hàng trước mùa cao điểm. Nhà bán hàng có thể tự điều chỉnh nhưng mức thấp hơn sẽ bị giảm ưu tiên hiển thị trong chợ liên kết.',
    keyNumbers: [
      { value: '10% → 15%', label: 'hoa hồng mặc định ngành thời trang' },
      { value: '5 điểm', label: 'phần trăm biên lợi nhuận bị bào thêm' },
    ],
    content: [
      {
        heading: 'Thay đổi cụ thể',
        body:
          'Mức mặc định áp cho các sản phẩm mới đăng và các sản phẩm chưa từng thiết lập hoa hồng riêng. Sản phẩm đã có cấu hình cũ giữ nguyên nhưng sẽ hiển thị thấp hơn trong chợ liên kết so với sản phẩm đạt mức mới.',
      },
      {
        heading: 'Bài toán biên lợi nhuận',
        body:
          'Năm điểm phần trăm nghe nhỏ nhưng với mặt hàng biên lợi nhuận gộp 35% thì đây là gần một phần bảy lợi nhuận. Cần tính lại điểm hoà vốn trước khi đồng ý nâng mức, đặc biệt với các mã hàng đang chạy khuyến mại song song.',
      },
      {
        heading: 'Cách thương lượng có lợi hơn',
        body:
          'Thay vì nâng đồng loạt, nên phân tầng: giữ mức thấp cho mã hàng chủ lực vốn đã bán chạy, nâng mạnh cho mã hàng cần đẩy tồn kho hoặc sản phẩm mới cần tạo bằng chứng xã hội ban đầu.',
      },
    ],
    impact:
      'Cấu trúc chi phí kênh liên kết thay đổi ngay trong quý. Cần cập nhật bảng hoa hồng theo từng nhóm sản phẩm và đàm phán lại với nhóm KOC chiến lược trước khi đối thủ chào mức cao hơn.',
    ifIgnored:
      'Sản phẩm tụt hạng trong chợ liên kết, KOC chuyển sang đẩy hàng của đối thủ, và lượng video bán hàng tự nhiên giảm mà không có cảnh báo trong báo cáo quảng cáo.',
    actionChecklist: [
      'Tính lại điểm hoà vốn cho từng nhóm sản phẩm với mức hoa hồng mới',
      'Phân tầng hoa hồng: giữ thấp cho hàng chủ lực, nâng cao cho hàng cần đẩy',
      'Cập nhật cấu hình trên TikTok Seller Hub và thông báo cho nhóm KOC đối tác',
      'Theo dõi tỷ lệ doanh thu từ kênh liên kết trong bốn tuần tới để đánh giá lại',
    ],
  },
  {
    id: 'news-07',
    category: 'Google Ads & SEO',
    platformIcon: 'Search',
    title: 'Performance Max bổ sung loại trừ từ khoá thương hiệu theo thời gian thực',
    publishedAt: '27/07/2026',
    isHot: false,
    illustration: 'keyword-exclusion',
    source: 'Google Ads Help - Ghi chú phát hành',
    readTime: '4 phút đọc',
    tags: ['PMax', 'Brand Exclusion', 'Tiết kiệm ngân sách', 'CPC'],
    summary:
      'Google mở tính năng Brand Exclusion cho toàn bộ tài khoản Performance Max. Doanh nghiệp có thể chặn chiến dịch tự động mua lại từ khoá tên thương hiệu của chính mình - phần chi tiêu vốn tạo ra đơn hàng mà không tạo ra khách hàng mới.',
    keyNumbers: [
      { value: '15-20%', label: 'ngân sách PMax thường bị trùng lặp' },
      { value: 'Tức thì', label: 'thời gian tính năng có hiệu lực' },
    ],
    content: [
      {
        heading: 'Vấn đề tồn tại từ lâu',
        body:
          'Performance Max tự tìm nơi hiển thị hiệu quả nhất, và nơi hiệu quả nhất theo dữ liệu luôn là truy vấn chứa tên thương hiệu - vì khách gõ tên bạn thì gần như chắc chắn sẽ mua. Kết quả là báo cáo ROAS rất đẹp trong khi phần lớn số đơn đó vốn đã tự đến mà không cần quảng cáo.',
      },
      {
        heading: 'Cách kiểm chứng mức lãng phí',
        body:
          'Bật loại trừ thương hiệu trong hai tuần và so sánh tổng doanh thu toàn kênh, không so ROAS của riêng chiến dịch. Nếu tổng doanh thu không giảm tương ứng với phần chi tiêu tiết kiệm được, phần đó chính là lãng phí đã được cắt.',
      },
      {
        heading: 'Lưu ý khi bật',
        body:
          'Nếu đối thủ đang đấu giá tên thương hiệu của bạn, đừng bỏ trống hoàn toàn. Nên tách một chiến dịch Search riêng cho từ khoá thương hiệu với ngân sách nhỏ và giá thầu thấp để giữ vị trí, thay vì để PMax mua với giá cao.',
      },
    ],
    impact:
      'Đây là cơ hội cắt 15-20% chi phí mà không giảm doanh thu. Đồng thời giúp báo cáo phản ánh đúng phần đóng góp thật của quảng cáo, tránh việc Ban Giám Đốc hiểu sai về hiệu quả kênh.',
    ifIgnored:
      'Tiếp tục trả tiền để mua lại khách hàng vốn đã tìm đến mình, và báo cáo ROAS thổi phồng khiến các quyết định phân bổ ngân sách tiếp theo đều lệch.',
    actionChecklist: [
      'Bật Brand Exclusion trong cài đặt PMax, khai báo đầy đủ các biến thể tên thương hiệu',
      'Ghi lại tổng doanh thu toàn kênh trước khi bật để có mốc so sánh',
      'Tách chiến dịch Search riêng cho từ khoá thương hiệu với giá thầu thấp',
      'Đối chiếu MER toàn công ty sau hai tuần thay vì chỉ nhìn ROAS chiến dịch',
    ],
  },
  {
    id: 'news-08',
    category: 'AI Marketing',
    platformIcon: 'Sparkles',
    title: 'OpenAI và Adobe hợp tác ra mắt công cụ dựng video quảng cáo chuẩn 4K trong 60 giây',
    publishedAt: '27/07/2026',
    isHot: true,
    illustration: 'ai-video',
    source: 'Thông cáo chung OpenAI - Adobe',
    readTime: '5 phút đọc',
    tags: ['AI Creative', 'Video', 'Sản xuất', 'A/B Testing'],
    summary:
      'Công cụ mới biến một trang nội dung thành mười biến thể video quảng cáo ngắn với giọng đọc cá nhân hoá và hiệu ứng dựng phim. Thời gian từ ý tưởng tới bản chạy được rút từ vài ngày xuống dưới một giờ.',
    keyNumbers: [
      { value: '10x', label: 'tốc độ sản xuất creative' },
      { value: '60 giây', label: 'thời gian dựng một biến thể' },
      { value: '50 mẫu', label: 'số biến thể có thể test mỗi tuần' },
    ],
    content: [
      {
        heading: 'Nút thắt cũ được gỡ',
        body:
          'Trong mô hình quảng cáo do thuật toán phân phối, số lượng góc nội dung là biến số quyết định. Nhưng năng lực sản xuất của một đội ngũ thường chỉ đạt 4-8 mẫu mỗi tuần. Công cụ này gỡ đúng nút thắt đó, đưa việc thử nghiệm 50 mẫu mỗi tuần vào tầm với của doanh nghiệp vừa và nhỏ.',
      },
      {
        heading: 'Chỗ AI làm tốt và chỗ AI làm dở',
        body:
          'AI làm tốt phần biến thể: đổi Hook, đổi lời thoại, đổi nhịp cắt, đổi kêu gọi hành động trên cùng một ý tưởng gốc. AI làm dở phần tìm ra ý tưởng gốc đúng - thứ đòi hỏi hiểu insight khách hàng. Ném brief mơ hồ vào AI chỉ tạo ra 50 mẫu cùng dở như nhau.',
      },
      {
        heading: 'Bài toán mới của Trưởng phòng',
        body:
          'Khi sản xuất không còn là điểm nghẽn, điểm nghẽn dịch sang khâu đánh giá và ra quyết định. Cần một quy trình rõ ràng: tiêu chí dừng một mẫu, ngưỡng dữ liệu tối thiểu trước khi kết luận, và ai là người có quyền tắt. Không có quy trình đó, 50 mẫu mỗi tuần chỉ tạo ra hỗn loạn.',
      },
      {
        heading: 'Rủi ro thương hiệu',
        body:
          'Nội dung do AI dựng dễ trôi khỏi giọng điệu thương hiệu sau vài vòng lặp. Cần chốt tài liệu Brand Guideline và Tone of Voice dạng máy đọc được, đồng thời giữ một vòng duyệt của người thật trước khi phát hành.',
      },
    ],
    impact:
      'Lợi thế cạnh tranh dịch chuyển từ ai sản xuất được nhiều hơn sang ai có insight tốt hơn và quy trình đánh giá nhanh hơn. Trưởng phòng cần dựng lại quy trình duyệt trước khi mở van sản xuất.',
    ifIgnored:
      'Đối thủ thử nghiệm gấp mười lần số góc tiếp cận với cùng ngân sách, và khoảng cách về chi phí mỗi đơn hàng sẽ nới rộng dần theo từng tháng.',
    actionChecklist: [
      'Chốt tài liệu Brand Voice dạng có cấu trúc để nạp cho công cụ AI',
      'Dựng quy trình duyệt hai lớp: máy lọc trước theo tiêu chí kỹ thuật, người duyệt sau về thông điệp',
      'Đặt ngưỡng dữ liệu tối thiểu trước khi kết luận một mẫu thắng hay thua',
      'Thử nghiệm trước ở nhóm chiến dịch bám đuổi, nơi rủi ro thương hiệu thấp nhất',
    ],
  },
  {
    id: 'news-09',
    category: 'Meta Ads',
    platformIcon: 'Facebook',
    title: 'Tín hiệu chuyển đổi từ trình duyệt tiếp tục hụt: Meta khuyến nghị chuyển hẳn sang gửi dữ liệu từ máy chủ',
    publishedAt: '27/07/2026',
    isHot: false,
    illustration: 'data-signal',
    source: 'Meta for Developers - Tài liệu Conversions API',
    readTime: '5 phút đọc',
    tags: ['CAPI', 'Pixel', 'Dữ liệu', 'Attribution'],
    summary:
      'Tỷ lệ sự kiện chuyển đổi bị mất do trình duyệt chặn cookie và người dùng từ chối theo dõi tiếp tục tăng. Meta khuyến nghị mọi tài khoản chạy song song Pixel và Conversions API, đồng thời cảnh báo về lỗi đếm trùng nếu cấu hình sai.',
    keyNumbers: [
      { value: '15-25%', label: 'sự kiện bị mất nếu chỉ dùng Pixel' },
      { value: '2x', label: 'nguy cơ đếm trùng nếu thiếu event_id' },
    ],
    content: [
      {
        heading: 'Dữ liệu đang mất ở đâu',
        body:
          'Ba nguồn thất thoát chính: trình duyệt chặn cookie bên thứ ba theo mặc định, người dùng iOS chọn không cho theo dõi, và các tiện ích chặn quảng cáo. Phần mất này không phân bố đều - nó tập trung ở nhóm người dùng có hiểu biết công nghệ, thường cũng là nhóm có sức mua cao.',
      },
      {
        heading: 'Vì sao mất dữ liệu lại đắt hơn tưởng',
        body:
          'Không chỉ là báo cáo thiếu đơn. Thuật toán tối ưu dựa trên chính những tín hiệu đó. Mất 20% tín hiệu chuyển đổi nghĩa là máy học nhận sai về chân dung người mua và phân phối lệch, làm chi phí mỗi đơn tăng ở toàn bộ chiến dịch chứ không riêng phần bị mất.',
      },
      {
        heading: 'Cái bẫy đếm trùng',
        body:
          'Khi bật cả Pixel và Conversions API mà không gán cùng một event_id cho cùng một hành vi, hệ thống ghi nhận hai lần. Báo cáo đẹp lên tức thì và rất dễ khiến cả phòng tin rằng việc cài đặt đã thành công, trong khi thực tế mọi chỉ số đều sai gấp đôi.',
      },
      {
        heading: 'Cách kiểm chứng',
        body:
          'Đối chiếu số đơn hàng trong trình quản lý quảng cáo với số đơn thật trong hệ thống bán hàng theo cùng một khoảng thời gian. Chênh lệch hợp lý là dưới 10%. Vượt xa mức đó theo chiều dương gần như chắc chắn là lỗi đếm trùng.',
      },
    ],
    impact:
      'Chất lượng tín hiệu chuyển đổi nay là yếu tố kỹ thuật ảnh hưởng trực tiếp tới chi phí quảng cáo. Trưởng phòng cần có người chịu trách nhiệm rõ ràng cho hạ tầng đo lường, không giao lẫn vào việc chạy quảng cáo.',
    ifIgnored:
      'Chi phí mỗi đơn tăng dần mà không giải thích được, các thử nghiệm tối ưu đều cho kết quả nhiễu, và mọi quyết định phân bổ ngân sách đều dựa trên số liệu sai.',
    actionChecklist: [
      'Kiểm tra điểm chất lượng khớp sự kiện trong Trình quản lý sự kiện của Meta',
      'Xác nhận mọi sự kiện gửi qua hai đường đều mang cùng event_id để khử trùng lặp',
      'Đối chiếu số đơn trên trình quản lý quảng cáo với hệ thống bán hàng mỗi tuần',
      'Chỉ định một người chịu trách nhiệm hạ tầng đo lường, tách khỏi vai trò chạy quảng cáo',
    ],
  },
  {
    id: 'news-10',
    category: 'TikTok Shop & Ads',
    platformIcon: 'Video',
    title: 'TikTok mở khung giờ ưu tiên cho phiên phát trực tiếp có kịch bản đăng ký trước',
    publishedAt: '27/07/2026',
    isHot: false,
    illustration: 'livestream',
    source: 'TikTok Shop - Chương trình nhà bán hàng',
    readTime: '4 phút đọc',
    tags: ['Livestream', 'GPM', 'Kịch bản', 'Khung giờ vàng'],
    summary:
      'Nhà bán hàng đăng ký trước lịch và kịch bản phiên live sẽ được cấp lượng hiển thị ban đầu cao hơn trong khung giờ vàng. Cơ chế nhằm giảm số phiên live chất lượng thấp làm loãng trải nghiệm người xem.',
    keyNumbers: [
      { value: '15 phút', label: 'giai đoạn quyết định lưu lượng cả phiên' },
      { value: '3 ngày', label: 'thời hạn đăng ký trước lịch live' },
    ],
    content: [
      {
        heading: 'Cách cơ chế hoạt động',
        body:
          'Nhà bán hàng khai báo trước khung giờ, danh mục sản phẩm và các mốc ưu đãi trong phiên. TikTok dùng thông tin này để chuẩn bị tệp người xem phù hợp và đẩy lưu lượng thử nghiệm ngay khi phiên bắt đầu, thay vì chờ tín hiệu tương tác tự nhiên như trước.',
      },
      {
        heading: 'Vì sao 15 phút đầu quyết định tất cả',
        body:
          'Thuật toán cấp lưu lượng theo từng đợt. Đợt đầu là lượng thử nghiệm nhỏ; nếu tỷ lệ giữ chân và tương tác trong đợt đó tốt, hệ thống mở đợt lớn hơn. Phiên khởi động chậm gần như không thể cứu được ở nửa sau, dù nội dung phía sau có hay tới đâu.',
      },
      {
        heading: 'Việc chuẩn bị thực tế',
        body:
          'Kịch bản nên chia theo khối 15 phút, mỗi khối có một mốc ưu đãi rõ ràng để tạo lý do ở lại. Nên chạy quảng cáo hâm nóng trước giờ lên sóng để đảm bảo có sẵn người xem ngay phút đầu, thay vì trông chờ hoàn toàn vào lưu lượng nền tảng cấp.',
      },
    ],
    impact:
      'Livestream chuyển từ hoạt động ứng biến sang hoạt động cần lập kế hoạch trước. Trưởng phòng cần đưa lịch live vào bảng kế hoạch nội dung tháng thay vì để đội bán hàng tự quyết theo tuần.',
    ifIgnored:
      'Phiên live không đăng ký trước sẽ khởi động với lưu lượng nền tảng thấp hơn, đẩy chi phí quảng cáo hâm nóng lên cao để bù, hoặc phiên chết ngay sau 15 phút đầu.',
    actionChecklist: [
      'Đưa lịch live cố định vào bảng kế hoạch nội dung tháng và đăng ký trước ba ngày',
      'Chuẩn hoá kịch bản theo khối 15 phút, mỗi khối một mốc ưu đãi',
      'Chạy quảng cáo hâm nóng trước giờ lên sóng cho tệp đã từng xem live',
      'Theo dõi doanh thu trên mỗi nghìn lượt xem để so sánh hiệu quả giữa các phiên',
    ],
  },
  {
    id: 'news-11',
    category: 'TikTok Shop & Ads',
    platformIcon: 'Video',
    title: 'TikTok bắt buộc gắn nhãn nội dung do AI tạo, áp dụng cho cả quảng cáo trả phí',
    publishedAt: '26/07/2026',
    isHot: false,
    illustration: 'ai-label',
    source: 'TikTok - Nguyên tắc cộng đồng và chính sách quảng cáo',
    readTime: '4 phút đọc',
    tags: ['AI Content', 'Tuân thủ', 'Minh bạch', 'Chính sách'],
    summary:
      'Mọi nội dung có yếu tố do AI tạo sinh - hình ảnh, giọng nói, người mẫu ảo - phải gắn nhãn minh bạch. Quy định áp cho cả video tự nhiên lẫn quảng cáo trả phí. Nội dung vi phạm bị gỡ hoặc hạn chế phân phối mà không hoàn ngân sách.',
    keyNumbers: [
      { value: '100%', label: 'nội dung AI phải gắn nhãn' },
      { value: '0 đồng', label: 'mức hoàn ngân sách nếu bị gỡ' },
    ],
    content: [
      {
        heading: 'Phạm vi áp dụng rộng hơn tưởng',
        body:
          'Không chỉ video hoàn toàn do AI dựng. Quy định bao gồm cả video người thật quay nhưng lồng giọng AI, ảnh sản phẩm do AI tạo nền, và người mẫu ảo giới thiệu sản phẩm. Ranh giới nằm ở chỗ người xem có thể hiểu nhầm nội dung là ghi hình thật hay không.',
      },
      {
        heading: 'Nhóm nội dung bị cấm hẳn',
        body:
          'Dùng AI tái tạo hình ảnh hoặc giọng nói của người thật để quảng cáo mà không có sự đồng ý là vi phạm nghiêm trọng, dẫn tới khoá tài khoản chứ không chỉ gỡ bài. Nhóm này bao gồm cả việc dùng hình ảnh người nổi tiếng đã hết hạn hợp đồng.',
      },
      {
        heading: 'Ảnh hưởng tới hiệu quả',
        body:
          'Dữ liệu ban đầu cho thấy nhãn AI làm giảm nhẹ tỷ lệ tương tác ở nhóm nội dung dạng review sản phẩm, nơi người xem coi trọng tính chân thực. Ngược lại, nhóm nội dung dạng giải thích hoặc hoạt hoạ gần như không bị ảnh hưởng.',
      },
    ],
    impact:
      'Cần rà soát lại toàn bộ kho nội dung đang chạy và phân loại theo mức độ sử dụng AI. Đồng thời điều chỉnh chiến lược: giữ nội dung AI cho nhóm giải thích, dùng người thật cho nhóm review và bằng chứng.',
    ifIgnored:
      'Video bị gỡ giữa chiến dịch mà không hoàn ngân sách đã tiêu, và lịch sử vi phạm tích luỹ làm giảm mức độ tin cậy của cả tài khoản.',
    actionChecklist: [
      'Rà soát kho nội dung, đánh dấu mọi video có yếu tố AI tạo sinh',
      'Bật nhãn AI cho các nội dung thuộc diện áp dụng trước khi bị hệ thống phát hiện',
      'Kiểm tra lại hợp đồng hình ảnh với người đại diện, gỡ nội dung đã hết hạn',
      'Chuyển nhóm nội dung review sang quay người thật để giữ tỷ lệ tương tác',
    ],
    deadline: 'Bắt buộc từ 01/09/2026',
  },
  {
    id: 'news-12',
    category: 'Google Ads & SEO',
    platformIcon: 'Search',
    title: 'Google đưa chỉ số phản hồi tương tác vào tiêu chí xếp hạng: ngưỡng 200ms thành bắt buộc',
    publishedAt: '26/07/2026',
    isHot: false,
    illustration: 'page-speed',
    source: 'Google Search Central - Core Web Vitals',
    readTime: '4 phút đọc',
    tags: ['Core Web Vitals', 'Tốc độ', 'Landing Page', 'Chuyển đổi'],
    summary:
      'Chỉ số đo độ trễ phản hồi khi người dùng tương tác chính thức trở thành yếu tố xếp hạng. Trang vượt ngưỡng 200ms bị đánh giá kém, ảnh hưởng cả thứ hạng tự nhiên lẫn điểm chất lượng quảng cáo.',
    keyNumbers: [
      { value: '200 ms', label: 'ngưỡng phản hồi tương tác' },
      { value: '-7%', label: 'chuyển đổi mất đi mỗi giây trễ' },
      { value: '1.8s', label: 'thời gian tải mục tiêu cho trang bán hàng' },
    ],
    content: [
      {
        heading: 'Chỉ số này đo cái gì',
        body:
          'Khác với chỉ số đo tốc độ tải nội dung, chỉ số này đo khoảng thời gian từ lúc người dùng bấm hoặc chạm cho tới lúc giao diện phản hồi. Đây là thứ người dùng cảm nhận rõ nhất khi trang giật hoặc nút bấm không ăn ngay.',
      },
      {
        heading: 'Nguyên nhân phổ biến tại Việt Nam',
        body:
          'Ba thủ phạm hàng đầu: quá nhiều mã theo dõi chạy đồng thời (pixel của bốn năm nền tảng), popup và widget chat nạp ngay khi tải trang, và ảnh sản phẩm chưa nén tải cùng lúc. Cả ba đều là thứ phòng Marketing tự thêm vào chứ không phải lỗi kỹ thuật của website.',
      },
      {
        heading: 'Tác động kép ít người để ý',
        body:
          'Trang chậm không chỉ mất thứ hạng tự nhiên. Nó còn kéo điểm chất lượng quảng cáo xuống, làm CPC tăng. Nghĩa là cùng một lỗi kỹ thuật đánh vào cả kênh miễn phí lẫn kênh trả phí cùng lúc.',
      },
    ],
    impact:
      'Đây là hạng mục kỹ thuật nhưng thuộc trách nhiệm Marketing, vì phần lớn nguyên nhân đến từ các công cụ do Marketing gắn thêm. Cần một đợt dọn dẹp mã theo dõi trước khi đổ thêm ngân sách vào trang.',
    ifIgnored:
      'Thứ hạng tự nhiên giảm, CPC tăng do điểm chất lượng thấp, và tỷ lệ chuyển đổi của trang đích bị bào mòn - ba khoản thiệt hại cộng dồn từ cùng một nguyên nhân.',
    actionChecklist: [
      'Đo lại toàn bộ trang đích chủ lực bằng công cụ đo Core Web Vitals của Google',
      'Kiểm kê mã theo dõi đang chạy, gỡ pixel của nền tảng không còn sử dụng',
      'Chuyển popup và widget chat sang nạp trễ sau khi trang đã tương tác được',
      'Nén và chuyển ảnh sản phẩm sang định dạng thế hệ mới',
    ],
  },
  {
    id: 'news-13',
    category: 'Google Ads & SEO',
    platformIcon: 'Search',
    title: 'Google mở rộng Customer Match: dữ liệu khách hàng sở hữu thành lợi thế đấu thầu trực tiếp',
    publishedAt: '25/07/2026',
    isHot: false,
    illustration: 'crm-automation',
    source: 'Google Ads - Cập nhật tính năng đối tượng',
    readTime: '4 phút đọc',
    tags: ['First-party Data', 'Customer Match', 'CRM', 'Đấu thầu'],
    summary:
      'Google cho phép dùng danh sách khách hàng đã tải lên để điều chỉnh giá thầu ở nhiều loại chiến dịch hơn, đồng thời nâng chất lượng tệp tương đồng sinh ra từ dữ liệu này. Doanh nghiệp có dữ liệu sạch sẽ có lợi thế rõ rệt trong phiên đấu giá.',
    keyNumbers: [
      { value: '5.000', label: 'số liên hệ tối thiểu để tệp hoạt động' },
      { value: '70%+', label: 'tỷ lệ khớp cần đạt để tệp hiệu quả' },
    ],
    content: [
      {
        heading: 'Vì sao dữ liệu sở hữu lên giá',
        body:
          'Khi tín hiệu theo dõi hành vi ngoài website ngày càng hạn chế, dữ liệu do doanh nghiệp tự thu thập trở thành nguồn tín hiệu chất lượng cao nhất còn lại. Nền tảng nào cũng đang mở rộng cách khai thác nguồn này, và doanh nghiệp không có dữ liệu sạch sẽ mất dần lợi thế.',
      },
      {
        heading: 'Chất lượng quan trọng hơn số lượng',
        body:
          'Tỷ lệ khớp phụ thuộc vào việc dữ liệu có đủ trường và đúng định dạng hay không. Danh sách 50.000 số điện thoại lộn xộn có thể chỉ khớp 30%, trong khi 8.000 liên hệ đầy đủ email và số chuẩn hoá có thể khớp trên 80% và cho kết quả tốt hơn hẳn.',
      },
      {
        heading: 'Ứng dụng thực tế nên làm trước',
        body:
          'Hai việc cho hiệu quả nhanh nhất: loại trừ khách đã mua khỏi chiến dịch thu hút khách mới để không trả tiền hai lần, và nâng giá thầu cho nhóm khách có giá trị vòng đời cao nhất thay vì trả đều cho mọi người.',
      },
    ],
    impact:
      'Việc dọn dẹp và chuẩn hoá dữ liệu khách hàng chuyển từ hạng mục nice-to-have thành đòn bẩy chi phí quảng cáo trực tiếp. Đây là lý do rõ ràng để Trưởng phòng xin ngân sách cho hạ tầng dữ liệu.',
    ifIgnored:
      'Tiếp tục trả cùng một mức giá cho mọi đối tượng, trong đó có cả những người vốn đã là khách hàng, trong khi đối thủ dùng dữ liệu để trả cao đúng chỗ và thấp ở phần còn lại.',
    actionChecklist: [
      'Xuất và chuẩn hoá danh sách khách hàng: định dạng số điện thoại, bổ sung email',
      'Tải lên tệp khách đã mua và đặt loại trừ ở các chiến dịch thu hút khách mới',
      'Tạo tệp riêng cho nhóm 20% khách có giá trị cao nhất và nâng giá thầu cho nhóm này',
      'Đặt lịch cập nhật danh sách hằng tháng thay vì tải lên một lần rồi bỏ đó',
    ],
  },
  {
    id: 'news-14',
    category: 'Meta Ads',
    platformIcon: 'Facebook',
    title: 'Advantage+ Creative tự động chỉnh sửa nội dung: mẫu quảng cáo bão hoà nhanh hơn trước',
    publishedAt: '25/07/2026',
    isHot: false,
    illustration: 'creative-fatigue',
    source: 'Meta Business Newsroom',
    readTime: '4 phút đọc',
    tags: ['Creative Fatigue', 'Advantage+', 'Tần suất', 'CTR'],
    summary:
      'Tính năng tự động chỉnh sửa nội dung giúp Meta tạo thêm biến thể từ tài sản có sẵn, nhưng cũng khiến cùng một ý tưởng gốc được phân phối dày hơn. Chu kỳ bão hoà của một bộ nội dung rút ngắn đáng kể.',
    keyNumbers: [
      { value: '12 → 7', label: 'số ngày trung bình trước khi bão hoà' },
      { value: '3-4', label: 'ngưỡng tần suất cần thay nội dung' },
    ],
    content: [
      {
        heading: 'Điều gì đang xảy ra',
        body:
          'Advantage+ Creative tự đổi khung hình, thêm phụ đề, chỉnh độ sáng và ghép nhạc để tạo biến thể. Người xem thấy nhiều phiên bản khác nhau nhưng vẫn nhận ra cùng một ý tưởng. Kết quả là ngưỡng chán đến sớm hơn so với thời điểm chỉ số tần suất báo động.',
      },
      {
        heading: 'Dấu hiệu nhận biết chính xác',
        body:
          'Không nhìn một chỉ số đơn lẻ. Dấu hiệu bão hoà là tổ hợp: tần suất tăng đều, tỷ lệ nhấp giảm, chi phí hiển thị tăng và chi phí mỗi chuyển đổi leo thang trong khi cấu hình chiến dịch không đổi. Chỉ khi cả bốn cùng xảy ra mới nên kết luận.',
      },
      {
        heading: 'Cách vận hành kho nội dung',
        body:
          'Nên duy trì ba lớp: nhóm đang chạy, nhóm dự phòng đã duyệt sẵn, và nhóm đang sản xuất. Khi nhóm đang chạy chạm ngưỡng bão hoà thì nhóm dự phòng thay ngay, không chờ tới lúc sản xuất xong. Chờ tới khi chỉ số xấu mới bắt đầu làm là đã mất một tới hai tuần hiệu quả.',
      },
    ],
    impact:
      'Nhịp sản xuất nội dung phải tăng theo. Kế hoạch nhân sự và ngân sách sản xuất lập từ đầu năm dựa trên chu kỳ 12 ngày nay không còn đúng.',
    ifIgnored:
      'Chi phí mỗi đơn hàng tăng dần theo tuần và đội ngũ sẽ đi tìm nguyên nhân ở cấu hình chiến dịch hoặc giá thầu, trong khi gốc rễ nằm ở kho nội dung đã cạn.',
    actionChecklist: [
      'Đặt cảnh báo tự động khi tần suất vượt 3.5 trên bất kỳ nhóm quảng cáo nào',
      'Duy trì kho nội dung dự phòng đã duyệt sẵn, tối thiểu bằng số mẫu đang chạy',
      'Ghi lại ngày bắt đầu chạy của từng mẫu để tính chu kỳ bão hoà thực tế của tài khoản',
      'Điều chỉnh lại kế hoạch nhân sự sản xuất theo nhịp mới',
    ],
  },
  {
    id: 'news-15',
    category: 'AI Marketing',
    platformIcon: 'Sparkles',
    title: 'Sora mở bản thử nghiệm cho nhà quản lý Marketing dựng phim quảng cáo thương hiệu',
    publishedAt: '24/07/2026',
    isHot: false,
    illustration: 'ai-video',
    source: 'OpenAI - Chương trình thử nghiệm doanh nghiệp',
    readTime: '4 phút đọc',
    tags: ['Sora', 'TVC', 'Sản xuất', 'Tiền kỳ'],
    summary:
      'Khả năng tạo chuỗi cảnh quay liền mạch chất lượng điện ảnh giúp rút ngắn phần lớn công đoạn tiền kỳ. Doanh nghiệp vừa và nhỏ lần đầu tiếp cận được mức hình ảnh vốn chỉ dành cho ngân sách sản xuất lớn.',
    keyNumbers: [
      { value: '-90%', label: 'thời gian dựng concept tiền kỳ' },
      { value: '20-30%', label: 'trần ngân sách sản xuất trên tổng chi phát sóng' },
    ],
    content: [
      {
        heading: 'Ứng dụng thực tế trước mắt',
        body:
          'Giá trị lớn nhất hiện nay không nằm ở việc thay thế đoàn phim mà ở khâu dựng bản mô phỏng ý tưởng. Thay vì vẽ storyboard tĩnh để thuyết phục Ban Giám Đốc, đội ngũ dựng luôn một bản video mô phỏng để duyệt, giảm hẳn số vòng sửa sau khi đã quay thật.',
      },
      {
        heading: 'Giới hạn cần biết trước',
        body:
          'Hình ảnh sản phẩm cụ thể vẫn là điểm yếu: bao bì, nhãn mác, chi tiết kỹ thuật thường bị dựng sai lệch. Với ngành hàng mà sản phẩm là nhân vật chính, vẫn phải quay thật phần cận cảnh sản phẩm và chỉ dùng AI cho phần bối cảnh.',
      },
      {
        heading: 'Nguyên tắc ngân sách không đổi',
        body:
          'Công cụ rẻ đi không có nghĩa nên làm nhiều phim hơn. Nguyên tắc cũ vẫn đúng: chi phí sản xuất không nên vượt 20-30% ngân sách phát sóng. Phim đẹp mà không đủ tiền để đủ người xem thì vẫn là tiền bỏ đi.',
      },
    ],
    impact:
      'Rào cản sản xuất hình ảnh chất lượng cao hạ xuống đáng kể. Trưởng phòng nên dùng phần tiết kiệm được để tăng ngân sách phát sóng, không phải để làm thêm phim.',
    ifIgnored:
      'Tiếp tục chi phần lớn ngân sách chiến dịch cho khâu sản xuất trong khi đối thủ dùng cùng số tiền đó để mua thêm độ phủ.',
    actionChecklist: [
      'Đăng ký tài khoản thử nghiệm và cử một người phụ trách học công cụ',
      'Áp dụng trước ở khâu dựng bản mô phỏng ý tưởng để duyệt nội bộ',
      'Giữ phần quay thật cho các cảnh cận sản phẩm',
      'Chuyển phần ngân sách tiết kiệm được sang tăng độ phủ phát sóng',
    ],
  },
  {
    id: 'news-16',
    category: 'AI Marketing',
    platformIcon: 'Sparkles',
    title: 'Làn sóng tác tử AI tự tối ưu chiến dịch: cảnh báo về việc giao quyền không kiểm soát',
    publishedAt: '23/07/2026',
    isHot: false,
    illustration: 'ai-budget',
    source: 'Tổng hợp từ các nền tảng công nghệ tiếp thị',
    readTime: '5 phút đọc',
    tags: ['AI Agent', 'Tự động hoá', 'Quản trị rủi ro', 'Ngân sách'],
    summary:
      'Nhiều công cụ mới cho phép tác tử AI tự đọc dữ liệu, tự bật tắt chiến dịch và tự điều chỉnh ngân sách theo mục tiêu đặt ra. Hiệu quả hứa hẹn nhưng rủi ro vận hành tăng theo nếu không có ranh giới rõ ràng.',
    keyNumbers: [
      { value: '24/7', label: 'tần suất tác tử ra quyết định' },
      { value: '3 lớp', label: 'ranh giới kiểm soát tối thiểu cần đặt' },
    ],
    content: [
      {
        heading: 'Khác gì với tự động hoá cũ',
        body:
          'Quy tắc tự động trước đây chạy theo điều kiện cứng do người đặt. Tác tử AI tự suy luận mục tiêu và chọn hành động, kể cả hành động người vận hành chưa từng nghĩ tới. Đây vừa là điểm mạnh vừa là nguồn rủi ro chính.',
      },
      {
        heading: 'Ba ranh giới bắt buộc phải đặt',
        body:
          'Thứ nhất, trần chi tiêu cứng theo ngày mà tác tử không được vượt. Thứ hai, danh sách hành động cần người phê duyệt - thường gồm tăng ngân sách quá một ngưỡng và tắt chiến dịch đang có doanh thu. Thứ ba, nhật ký ghi lại mọi thay đổi kèm lý do để truy vết khi có sự cố.',
      },
      {
        heading: 'Sai lầm thường gặp',
        body:
          'Giao mục tiêu một chiều kiểu tối đa hoá số chuyển đổi mà không kèm ràng buộc chi phí. Tác tử sẽ đạt đúng mục tiêu được giao bằng cách đổ ngân sách vào nhóm chuyển đổi rẻ nhưng giá trị thấp, làm doanh thu tăng còn lợi nhuận giảm.',
      },
      {
        heading: 'Cách thử nghiệm an toàn',
        body:
          'Chạy tác tử ở chế độ chỉ đề xuất trong bốn tuần đầu, người vẫn là bên bấm nút. Đối chiếu tỷ lệ đề xuất đúng trước khi trao quyền thực thi, và chỉ trao quyền trên một phần nhỏ ngân sách.',
      },
    ],
    impact:
      'Vai trò Trưởng phòng dịch chuyển từ người ra quyết định vận hành sang người thiết kế ranh giới và kiểm soát rủi ro. Đây là kỹ năng khác hẳn kỹ năng tối ưu quảng cáo truyền thống.',
    ifIgnored:
      'Trao quyền quá sớm dẫn tới các quyết định sai hàng loạt trong đêm mà tới sáng mới phát hiện, với thiệt hại bằng đúng trần ngân sách chưa được đặt.',
    actionChecklist: [
      'Đặt trần chi tiêu cứng theo ngày trước khi kết nối bất kỳ công cụ tác tử nào',
      'Lập danh sách hành động bắt buộc phải có người phê duyệt',
      'Chạy chế độ chỉ đề xuất trong bốn tuần và chấm tỷ lệ đề xuất đúng',
      'Yêu cầu công cụ xuất nhật ký thay đổi kèm lý do cho mỗi quyết định',
    ],
  },
];

/**
 * Danh sách hiển thị: tin thật lên trước, tin mô phỏng nối sau.
 *
 * Cờ `isSimulated` được gắn ở đây thay vì gõ tay vào từng tin, để không bao giờ
 * xảy ra trường hợp thêm tin mô phỏng mới mà quên đánh dấu — tin đó sẽ hiện lên
 * như tin thật.
 */
export const INITIAL_NEWS_ITEMS = [
  ...REAL_SOURCED_NEWS,
  ...SIMULATED_NEWS_ITEMS.map((item) => ({ ...item, isSimulated: true })),
];

export const LIVE_NEWS_SIMULATOR_POOL = [
  {
    category: 'TikTok Shop & Ads',
    platformIcon: 'Video',
    title: 'TikTok thử nghiệm giỏ hàng gắn trực tiếp trong phần bình luận phiên phát trực tiếp',
    illustration: 'livestream',
    source: 'TikTok Shop - Thử nghiệm tính năng',
    readTime: '3 phút đọc',
    publishedAt: '28/07/2026',
    tags: ['Livestream', 'Chuyển đổi', 'Trải nghiệm mua'],
    summary:
      'Người xem đặt hàng ngay trong luồng bình luận mà không cần rời phiên live. Số bước từ lúc quan tâm tới lúc thanh toán giảm từ bốn xuống còn hai.',
    keyNumbers: [
      { value: '4 → 2', label: 'số bước tới thanh toán' },
      { value: '+18%', label: 'tỷ lệ chốt đơn trong nhóm thử nghiệm' },
    ],
    content: [
      {
        heading: 'Vì sao rút gọn bước lại quan trọng',
        body:
          'Mỗi bước thêm vào hành trình mua đều làm rơi một phần người dùng. Trong bối cảnh live, việc phải rời phiên để thanh toán còn khiến người xem mất luôn động lực mua vì không khí khan hiếm đã đứt.',
      },
      {
        heading: 'Chuẩn bị từ phía nhà bán hàng',
        body:
          'Cần cấu hình sẵn mã sản phẩm ngắn để người dẫn đọc trong phiên, và đảm bảo tồn kho đồng bộ theo thời gian thực vì tốc độ đặt hàng sẽ dồn vào các mốc ưu đãi.',
      },
    ],
    impact:
      'Kịch bản live cần thiết kế lại quanh mã sản phẩm ngắn và các mốc chốt đơn dồn dập, thay vì dẫn dắt dài rồi mới chốt ở cuối phiên.',
    ifIgnored: 'Đối thủ áp dụng trước sẽ có lợi thế tỷ lệ chốt đơn ngay trong cùng khung giờ vàng.',
    actionChecklist: [
      'Đăng ký tham gia nhóm thử nghiệm tính năng',
      'Chuẩn hoá mã sản phẩm ngắn dễ đọc trong phiên live',
      'Đồng bộ tồn kho theo thời gian thực trước khi lên sóng',
    ],
  },
  {
    category: 'Google Ads & SEO',
    platformIcon: 'Search',
    title: 'Google bổ sung báo cáo phần đóng góp gia tăng cho chiến dịch tìm kiếm thương hiệu',
    illustration: 'keyword-exclusion',
    source: 'Google Ads - Ghi chú phát hành',
    readTime: '3 phút đọc',
    publishedAt: '28/07/2026',
    tags: ['Incrementality', 'Đo lường', 'Brand Search'],
    summary:
      'Báo cáo mới ước lượng phần doanh thu thực sự tăng thêm nhờ quảng cáo, tách khỏi phần doanh thu vốn đã xảy ra. Đây là câu trả lời cho tranh cãi kéo dài về giá trị thật của quảng cáo từ khoá thương hiệu.',
    keyNumbers: [
      { value: '15-30%', label: 'phần đóng góp gia tăng điển hình' },
      { value: '4 tuần', label: 'thời gian tối thiểu để báo cáo có ý nghĩa' },
    ],
    content: [
      {
        heading: 'Ý nghĩa với báo cáo nội bộ',
        body:
          'Lần đầu Trưởng phòng có một con số chính thức từ nền tảng để trả lời câu hỏi kinh điển của Ban Giám Đốc: nếu tắt quảng cáo này thì doanh thu có giảm không. Trước đây câu trả lời chỉ dựa vào suy đoán.',
      },
      {
        heading: 'Cách đọc con số cho đúng',
        body:
          'Phần đóng góp gia tăng thấp không đồng nghĩa nên tắt ngay. Nếu đối thủ đang đấu giá tên thương hiệu của bạn, phần chi tiêu đó mang tính phòng thủ chứ không phải tạo tăng trưởng, và vẫn cần thiết.',
      },
    ],
    impact:
      'Có cơ sở dữ liệu để bảo vệ hoặc cắt ngân sách nhóm từ khoá thương hiệu, thay vì tranh luận bằng cảm tính trong cuộc họp ngân sách.',
    ifIgnored: 'Tiếp tục báo cáo ROAS thổi phồng và mất uy tín khi Ban Giám Đốc tự kiểm chứng bằng cách yêu cầu tắt thử.',
    actionChecklist: [
      'Bật báo cáo phần đóng góp gia tăng cho các chiến dịch thương hiệu',
      'Thu thập dữ liệu tối thiểu bốn tuần trước khi đưa vào báo cáo',
      'Đối chiếu với chỉ số MER toàn công ty trong cùng kỳ',
    ],
  },
  {
    category: 'AI Marketing',
    platformIcon: 'Sparkles',
    title: 'Công cụ chấm điểm nội dung bằng AI dự báo hiệu quả quảng cáo trước khi chi tiền',
    illustration: 'creative-fatigue',
    source: 'Tổng hợp từ các nền tảng công nghệ tiếp thị',
    readTime: '3 phút đọc',
    publishedAt: '28/07/2026',
    tags: ['AI Creative', 'Dự báo', 'Quy trình duyệt'],
    summary:
      'Các công cụ mới chấm điểm mẫu quảng cáo dựa trên dữ liệu hiệu quả lịch sử của ngành, giúp lọc bớt mẫu yếu trước khi đưa vào chạy thật.',
    keyNumbers: [
      { value: '~70%', label: 'độ chính xác dự báo mẫu yếu' },
      { value: '30%', label: 'ngân sách thử nghiệm tiết kiệm được' },
    ],
    content: [
      {
        heading: 'Dùng như bộ lọc, không dùng như trọng tài',
        body:
          'Độ chính xác đủ tốt để loại nhóm mẫu chắc chắn yếu, nhưng chưa đủ để chọn ra mẫu thắng. Vai trò hợp lý là lọc vòng đầu, giảm số mẫu cần chạy thử chứ không thay thế thử nghiệm thật.',
      },
      {
        heading: 'Rủi ro đồng phục hoá',
        body:
          'Mô hình học từ dữ liệu quá khứ nên có xu hướng ưu ái những gì đã từng hiệu quả. Chạy theo điểm số tuyệt đối sẽ khiến toàn bộ nội dung của ngành trông giống nhau và mất dần khả năng gây chú ý.',
      },
    ],
    impact:
      'Bổ sung một lớp lọc rẻ vào quy trình duyệt nội dung, nhưng phải giữ một tỷ lệ ngân sách cho các ý tưởng điểm thấp mà đội ngũ tin tưởng.',
    ifIgnored: 'Ngân sách thử nghiệm tiếp tục bị tiêu vào những mẫu lẽ ra đã loại được từ vòng duyệt.',
    actionChecklist: [
      'Đưa công cụ chấm điểm vào vòng duyệt đầu tiên',
      'Giữ 20% ngân sách thử nghiệm cho ý tưởng điểm thấp nhưng khác biệt',
      'Đối chiếu điểm dự báo với kết quả thật sau mỗi tháng để hiệu chỉnh niềm tin',
    ],
  },
  {
    category: 'Meta Ads',
    platformIcon: 'Facebook',
    title: 'Meta rút ngắn cửa sổ quy kết mặc định: báo cáo doanh thu chiến dịch sẽ giảm trên giấy tờ',
    illustration: 'data-signal',
    source: 'Meta Business Help Center',
    readTime: '3 phút đọc',
    publishedAt: '28/07/2026',
    tags: ['Attribution', 'Báo cáo', 'Cửa sổ quy kết'],
    summary:
      'Cửa sổ quy kết mặc định rút ngắn khiến các đơn hàng phát sinh muộn không còn được tính cho chiến dịch. Số liệu trong trình quản lý sẽ giảm dù doanh thu thực tế không đổi.',
    keyNumbers: [
      { value: '-10-15%', label: 'doanh thu ghi nhận trên báo cáo' },
      { value: '0%', label: 'thay đổi doanh thu thực tế' },
    ],
    content: [
      {
        heading: 'Vì sao phải báo cáo trước cho cấp trên',
        body:
          'Nếu không giải thích trước, tháng tới Ban Giám Đốc sẽ thấy ROAS tụt và kết luận chiến dịch kém đi. Thay đổi này thuần tuý về cách đếm, không phản ánh hiệu quả thực.',
      },
      {
        heading: 'Ngành nào bị ảnh hưởng nặng nhất',
        body:
          'Nhóm hàng giá trị cao có chu kỳ cân nhắc dài như nội thất, giáo dục, bất động sản chịu tác động mạnh nhất, vì phần lớn đơn hàng chốt sau nhiều ngày kể từ lần nhấp đầu tiên.',
      },
    ],
    impact:
      'Cần gửi ghi chú giải thích trước khi báo cáo tháng ra mắt, kèm mốc so sánh cũ để Ban Giám Đốc đọc đúng bối cảnh.',
    ifIgnored: 'Bị đánh giá là chiến dịch xuống dốc trong khi doanh thu thực tế không đổi.',
    actionChecklist: [
      'Ghi lại số liệu theo cửa sổ quy kết cũ làm mốc so sánh',
      'Gửi ghi chú giải thích cho Ban Giám Đốc trước kỳ báo cáo',
      'Chuyển trọng tâm báo cáo sang chỉ số MER toàn công ty',
    ],
  },
  {
    category: 'TikTok Shop & Ads',
    platformIcon: 'Video',
    title: 'Chi phí hiển thị TikTok Ads ngành mỹ phẩm tăng mạnh trước mùa cao điểm',
    illustration: 'cpm-auction',
    source: 'Báo cáo tổng hợp từ các đại lý khu vực',
    readTime: '3 phút đọc',
    publishedAt: '28/07/2026',
    tags: ['CPM', 'Mỹ phẩm', 'Mùa vụ', 'Ngân sách'],
    summary:
      'Áp lực đấu giá trong ngành mỹ phẩm và chăm sóc cá nhân tăng nhanh khi nhiều nhãn hàng cùng khởi động chiến dịch gom tệp cho quý cuối năm.',
    keyNumbers: [
      { value: '+35%', label: 'CPM ngành mỹ phẩm' },
      { value: '8 tuần', label: 'thời gian nên gom tệp trước cao điểm' },
    ],
    content: [
      {
        heading: 'Việc nên làm ngay bây giờ',
        body:
          'Gom tệp người xem video và người tương tác ở giai đoạn này rẻ hơn nhiều so với gom trong mùa cao điểm. Tệp gom được sẽ là nguyên liệu cho các chiến dịch chuyển đổi khi giá thầu lên đỉnh.',
      },
    ],
    impact: 'Ngân sách quý cần chia lại theo hai giai đoạn: gom tệp giá rẻ trước, dồn chuyển đổi vào đúng cao điểm.',
    ifIgnored: 'Tới mùa cao điểm mới bắt đầu gom tệp, phải trả giá đắt gấp rưỡi cho cùng một lượng người tiếp cận.',
    actionChecklist: [
      'Chuyển một phần ngân sách sang mục tiêu xem video và tương tác ngay tuần này',
      'Tạo sẵn các tệp bám đuổi theo thời lượng xem để dùng cho mùa cao điểm',
    ],
  },
  {
    category: 'Google Ads & SEO',
    platformIcon: 'Search',
    title: 'Google siết yêu cầu minh bạch với quảng cáo ngành tài chính và sức khoẻ tại Việt Nam',
    illustration: 'account-security',
    source: 'Google Ads - Chính sách ngành hạn chế',
    readTime: '3 phút đọc',
    publishedAt: '28/07/2026',
    tags: ['Tuân thủ', 'Ngành hạn chế', 'Xác minh'],
    summary:
      'Nhà quảng cáo thuộc nhóm ngành tài chính, dược phẩm và thực phẩm chức năng phải hoàn tất xác minh giấy phép hoạt động trước khi chiến dịch được duyệt.',
    keyNumbers: [
      { value: '2-3 tuần', label: 'thời gian xử lý hồ sơ xác minh' },
    ],
    content: [
      {
        heading: 'Chuẩn bị hồ sơ trước khi bị chặn',
        body:
          'Chiến dịch của tài khoản chưa xác minh sẽ bị từ chối hàng loạt chứ không cảnh báo trước. Với thời gian xử lý hai tới ba tuần, việc chuẩn bị sớm là bắt buộc nếu có kế hoạch chạy trong quý.',
      },
    ],
    impact: 'Rủi ro gián đoạn toàn bộ kênh tìm kiếm trong nhiều tuần nếu để tới lúc bị chặn mới nộp hồ sơ.',
    ifIgnored: 'Chiến dịch bị từ chối hàng loạt đúng giai đoạn cần chạy nhất.',
    actionChecklist: [
      'Kiểm tra ngành hàng của tài khoản có thuộc nhóm hạn chế hay không',
      'Chuẩn bị và nộp hồ sơ giấy phép ngay trong tháng này',
    ],
  },
];
