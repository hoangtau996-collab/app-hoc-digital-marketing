/**
 * Case thương hiệu có thật cho từng bài học, tra theo sectionId.
 *
 * Vì sao tách riêng khỏi courseData: phần lý thuyết trong courseData dùng số
 * liệu giả định để dạy cách tính. Phần này ngược lại, chỉ chứa sự việc đã xảy
 * ra ngoài đời với nguồn kiểm chứng được. Trộn hai loại vào một chỗ khiến học
 * viên không phân biệt được đâu là ví dụ minh hoạ, đâu là bằng chứng thật.
 *
 * Quy ước mỗi bản ghi:
 *   brand    tên thương hiệu hoặc tổ chức
 *   year     mốc thời gian của sự việc
 *   title    một dòng tóm tắt sự việc
 *   facts    các dữ kiện đã công bố, mỗi dòng một dữ kiện, không suy diễn
 *   lesson   điều Trưởng phòng rút ra được, đây là phần diễn giải
 *   source   nơi có thể kiểm chứng lại
 */
export const LESSON_CASES = {

  /* ================= CHUYÊN ĐỀ 01 - MỤC TIÊU ================= */

  'm1-s1': {
    brand: 'Adidas',
    year: '2019',
    title: 'Adidas công khai thừa nhận đã đầu tư lệch sang Performance',
    facts: [
      'Tại hội thảo EffWorks ở London tháng 10 năm 2019, ông Simon Peel, Giám đốc Truyền thông Toàn cầu của Adidas, công bố hãng đang chi 77% ngân sách cho quảng cáo hiệu suất và chỉ 23% cho hoạt động xây dựng thương hiệu.',
      'Khi dựng lại mô hình đo lường, Adidas phát hiện hoạt động thương hiệu mới là thứ tạo ra 65% doanh số trên tất cả các kênh.',
      'Lý do được nêu cho sự lệch này là chủ nghĩa ngắn hạn, do áp lực phải tăng doanh số thật nhanh.',
    ],
    lesson: 'Một thương hiệu toàn cầu với đầy đủ nguồn lực đo lường vẫn có thể đọc sai nguồn gốc doanh thu của chính mình trong nhiều năm. Con số ROAS mà nền tảng quảng cáo báo về không phải bằng chứng cho biết doanh thu thực sự đến từ đâu.',
    source: 'Marketing Week — "Adidas: We over-invested in digital advertising", 17/10/2019',
  },

  'm1-s2': {
    brand: 'IPA Effectiveness Databank (Anh)',
    year: '2013 và 2017',
    title: 'Tỷ lệ 60/40 đến từ đâu và vì sao nó không phải hằng số',
    facts: [
      'Les Binet và Peter Field phân tích kho dữ liệu hiệu quả quảng cáo của IPA và công bố trong "The Long and the Short of It" năm 2013: tỷ lệ tối ưu cho đa số thương hiệu tiêu dùng là khoảng 60% xây dựng thương hiệu và 40% kích hoạt bán hàng.',
      'Trong "Media in Focus" năm 2017, chính hai tác giả nói rõ tỷ lệ này thay đổi theo ngành và theo mô hình kinh doanh, không áp chung cho mọi doanh nghiệp.',
      'Cơ sở của tỷ lệ là hai cơ chế khác nhau: kích hoạt bán hàng tạo hiệu ứng mạnh nhưng tắt nhanh trong vài tuần, xây dựng thương hiệu tạo hiệu ứng nhỏ hơn nhưng tích luỹ qua nhiều năm.',
    ],
    lesson: 'Khi trình 60/40 cho Ban Giám Đốc, hãy trình nó như điểm khởi đầu có cơ sở nghiên cứu để tranh luận, không phải con số bắt buộc. Điều bạn cần bảo vệ là logic hai cơ chế, không phải hai chữ số.',
    source: 'Binet & Field, IPA — "The Long and the Short of It" (2013), "Media in Focus" (2017)',
  },

  'm1-s3': {
    brand: 'Coca-Cola',
    year: '2020',
    title: 'Cắt ngân sách vì không đo được ROI, rồi phải nói lại',
    facts: [
      'Trong đợt dịch năm 2020, Coca-Cola giảm hơn 30% chi tiêu quảng cáo toàn cầu.',
      'Tổng Giám Đốc James Quincey giải thích trên báo cáo quý 2 năm 2020: "Tại sao tôi lại muốn chi tiền trong giai đoạn không thể thu về kết quả, nhất là khi đang phong toả gắt gao".',
      'Các phân tích sau đó, trong đó có bài của Mark Ritson trên Marketing Week so sánh Coca-Cola với P&G cùng thời kỳ, chỉ ra doanh nghiệp giữ ngân sách phục hồi nhanh hơn doanh nghiệp cắt sâu.',
    ],
    lesson: 'Câu "không đo được ROI nên cắt" nghe rất hợp lý trong phòng họp. Nhiệm vụ của Trưởng phòng là dịch mục tiêu kinh doanh thành bộ chỉ số đo được ngay từ đầu, để đến lúc khó khăn còn có số liệu mà bảo vệ ngân sách.',
    source: 'Coca-Cola, báo cáo kết quả quý 2/2020; Marketing Week — Mark Ritson, "P&G and Coke\'s pandemic performances prove it: You don\'t cut ad spend in a crisis"',
  },

  'm1-s4': {
    brand: 'Airbnb',
    year: '2020 và 2021',
    title: 'Cắt 541 triệu đô la quảng cáo hiệu suất mà vẫn giữ 95% lưu lượng',
    facts: [
      'Năm 2020 Airbnb giảm 58% tổng chi marketing, tương đương 662 triệu đô la, so với mức 1,14 tỷ đô la của năm 2019.',
      'Trong đó phần cắt sâu nhất là quảng cáo hiệu suất, giảm 541 triệu đô la. Phần thương hiệu như truyền hình và tài trợ chỉ giảm 121 triệu đô la, tức chưa bằng một phần tư mức cắt của quảng cáo hiệu suất.',
      'Dù cắt như vậy, Airbnb vẫn thu hút được 95% lượng truy cập của năm trước đó.',
      'Đồng sáng lập kiêm Tổng Giám Đốc Brian Chesky nói: "Điều này cho thấy thương hiệu của chúng tôi vốn đã rất mạnh. Nó là một danh từ và cũng là một động từ trong văn hoá đại chúng". Airbnb sau đó tuyên bố chuyển dịch ngân sách sang thương hiệu một cách lâu dài.',
    ],
    lesson: 'Đây là bằng chứng thực nghiệm quy mô lớn cho Định luật 95-5: phần lớn lưu lượng mà quảng cáo hiệu suất nhận công về mình vốn đã thuộc về thương hiệu. Nhưng lưu ý điều kiện đi kèm, Airbnb làm được vì đã có sẵn một thương hiệu cực mạnh. Doanh nghiệp chưa có tài sản đó mà cắt tương tự sẽ mất doanh thu thật.',
    source: 'Campaign — "Airbnb slashes spend in permanent shift from performance marketing to brand"; báo cáo tài chính Airbnb 2020',
  },

  /* ================= CHUYÊN ĐỀ 02 - PHƯƠNG THỨC ================= */

  'm2-s1': {
    brand: 'HubSpot',
    year: '2005 đến nay',
    title: 'Doanh nghiệp đặt ra khái niệm Inbound Marketing và tự chứng minh nó',
    facts: [
      'Thuật ngữ Inbound Marketing do Brian Halligan và Dharmesh Shah đưa ra khi sáng lập HubSpot năm 2005.',
      'HubSpot xây dựng chính mình bằng phương pháp đó: kho bài viết, khoá học miễn phí HubSpot Academy và bộ công cụ dùng thử, thay vì mua khách hàng bằng quảng cáo.',
      'Công ty niêm yết trên sàn New York năm 2014 và hiện là doanh nghiệp phần mềm marketing hàng tỷ đô la doanh thu.',
    ],
    lesson: 'Inbound không phải là làm nội dung cho vui. Nó là quyết định đầu tư dài hạn để chuyển chi phí thu hút khách từ dạng thuê sang dạng sở hữu. Cái giá phải trả là nhiều năm chưa thấy kết quả.',
    source: 'HubSpot — lịch sử công ty và hồ sơ niêm yết 2014',
  },

  'm2-s2': {
    brand: 'HubSpot',
    year: '2018',
    title: 'HubSpot bỏ mô hình phễu, thay bằng bánh đà',
    facts: [
      'Tại hội nghị INBOUND 2018, Brian Halligan tuyên bố HubSpot thay mô hình phễu bằng mô hình bánh đà Flywheel.',
      'Lý do được nêu: phễu coi khách hàng là điểm kết thúc, nên toàn bộ năng lượng bỏ ra ở tầng trên bị mất trắng sau khi bán hàng xong.',
      'Bánh đà đặt khách hàng đã mua vào trung tâm, biến họ thành nguồn lực đẩy vòng quay tiếp theo qua giới thiệu và đánh giá.',
    ],
    lesson: 'Sự khác biệt không nằm ở hình vẽ mà nằm ở chỗ đặt ngân sách. Với phễu, tiền dồn hết vào tầng nhận biết. Với bánh đà, một phần ngân sách được chuyển sang khâu sau bán hàng vì đó là nơi tạo ra vòng quay kế tiếp.',
    source: 'HubSpot — công bố mô hình Flywheel tại INBOUND 2018',
  },

  'm2-s3': {
    brand: 'Google Search',
    year: '2023 đến 2025',
    title: 'Rủi ro thật của kênh Inbound: bạn không sở hữu nguồn lưu lượng',
    facts: [
      'Từ năm 2023 Google liên tục triển khai các bản cập nhật lớn về nội dung hữu ích và chống rác, khiến nhiều trang mất phần lớn lưu lượng chỉ sau một đêm.',
      'Việc Google đưa câu trả lời do AI tạo lên đầu trang kết quả làm giảm tỷ lệ người dùng bấm vào các liên kết bên dưới.',
      'Kênh Inbound tuy có chi phí trên mỗi khách giảm dần, nhưng nền tảng phân phối vẫn thuộc về bên thứ ba.',
    ],
    lesson: 'Câu "Inbound là tài sản của bạn" chỉ đúng một phần. Nội dung và danh sách khách hàng là tài sản của bạn. Thứ hạng tìm kiếm thì không. Đây là rủi ro phải nói thẳng với Ban Giám Đốc khi xin ngân sách chịu lỗ 6 tháng đầu.',
    source: 'Google Search Central — nhật ký cập nhật thuật toán 2023-2025',
  },

  /* ================= CHUYÊN ĐỀ 03 - NGÂN SÁCH ================= */

  'm3-s1': {
    brand: 'Khảo sát CMO của Gartner',
    year: '2024 và 2025',
    title: 'Mốc tham chiếu thật cho câu hỏi ngân sách bao nhiêu là hợp lý',
    facts: [
      'Khảo sát CMO năm 2024 của Gartner với 395 giám đốc marketing tại Bắc Mỹ và Tây Âu cho thấy ngân sách marketing trung bình chỉ còn 7,7% doanh thu doanh nghiệp, giảm từ mức 9,1% của năm 2023.',
      'Khảo sát năm 2025 cho thấy con số vẫn giữ nguyên ở mức 7,7%.',
      'Trong 4 năm trước dịch, mức trung bình là khoảng 11% doanh thu.',
    ],
    lesson: 'Khi bị hỏi vì sao xin từng ấy tiền, có một mốc bên ngoài để đối chiếu sẽ mạnh hơn nhiều so với nói theo kinh nghiệm. Nếu bạn đề xuất cao hơn hẳn mức trung bình, hãy chuẩn bị sẵn lý do, chẳng hạn đang mở thị trường mới hay đang ở giai đoạn giành thị phần.',
    source: 'Gartner — 2024 CMO Spend Survey (13/5/2024) và 2025 CMO Spend Survey (12/5/2025)',
  },

  'm3-s2': {
    brand: 'Coca-Cola',
    year: '2011',
    title: 'Quy tắc 70/20/10 ra đời từ chiến lược Content 2020',
    facts: [
      'Jonathan Mildenhall, khi đó là Phó Chủ tịch Chiến lược Quảng cáo Toàn cầu của Coca-Cola, đưa nguyên tắc đầu tư 70/20/10 vào chiến lược nội dung Content 2020 công bố năm 2011.',
      'Cách chia: 70% cho nội dung rủi ro thấp đã được chứng minh hiệu quả, 20% cho việc cải tiến dựa trên những gì đang chạy tốt, 10% cho ý tưởng chưa được kiểm chứng.',
      'Lập luận cốt lõi của Coca-Cola: phần 70% và 20% của ngày mai chính là những ý tưởng đang nằm trong nhóm 10% mạo hiểm của hôm nay.',
    ],
    lesson: 'Phần 10% không phải khoản tiền để tiêu cho vui. Nó là đường ống cung cấp ý tưởng cho tương lai. Cắt nó đi thì trong 2 năm nữa bạn không còn gì mới để đưa vào nhóm 70%.',
    source: 'Coca-Cola — chiến lược Content 2020; WARC — "Innovation and the 70/20/10 rule: The Coca-Cola Company\'s Approach"',
  },

  'm3-s3': {
    brand: 'Thị trường số Việt Nam',
    year: '2024',
    title: 'Vì sao phải tính ngược thay vì lấy tỷ lệ phần trăm cho nhanh',
    facts: [
      'Báo cáo e-Conomy SEA do Google, Temasek và Bain thực hiện ước tính quy mô nền kinh tế số Việt Nam năm 2024 vào khoảng 36 tỷ đô la, trong đó thương mại điện tử chiếm phần lớn nhất.',
      'Cùng lúc, chi phí quảng cáo trên các nền tảng lớn tại Việt Nam liên tục tăng do số lượng người bán tham gia đấu giá ngày càng đông.',
      'Hệ quả là một tỷ lệ phần trăm doanh thu cố định qua các năm sẽ ngày càng mua được ít khách hàng hơn.',
    ],
    lesson: 'Lấy ngân sách bằng cách nhân doanh thu với một tỷ lệ cố định là cách làm chỉ đúng khi chi phí thu hút khách đứng yên. Trong thực tế nó luôn tăng, nên chỉ có cách tính ngược qua từng tầng phễu mới cho ra con số bảo vệ được.',
    source: 'Google, Temasek & Bain — báo cáo e-Conomy SEA 2024',
  },

  /* ================= CHUYÊN ĐỀ 04 - NHÂN SỰ ================= */

  'm4-s1': {
    brand: 'Hiệp hội các Nhà Quảng cáo Quốc gia Hoa Kỳ (ANA)',
    year: '2023',
    title: 'Xu hướng đưa đội ngũ về nội bộ đã thành mặc định, không còn là trào lưu',
    facts: [
      'Nghiên cứu "The Continued Rise of the In-House Agency" của ANA công bố năm 2023, khảo sát 162 doanh nghiệp thành viên, cho thấy 82% có đội ngũ nội bộ làm công việc của agency.',
      'Tỷ lệ này là 42% năm 2008, 58% năm 2013 và 78% năm 2018.',
      'ANA kết luận đây không còn là xu hướng nhất thời mà đã trở thành cấu trúc ổn định.',
    ],
    lesson: 'Câu hỏi ngày nay không còn là có nên lập đội nội bộ hay không, mà là giữ phần nào trong nhà và thuê phần nào. Sơ đồ tổ chức phải bám theo quy mô ngân sách mà một người thực sự vận hành nổi.',
    source: 'ANA — "The Continued Rise of the In-House Agency: 2023 Edition"',
  },

  'm4-s2': {
    brand: 'Procter & Gamble',
    year: '2017 đến 2019',
    title: 'P&G cắt mạnh chi phí agency và thu gọn số đối tác',
    facts: [
      'Ông Marc Pritchard, Giám đốc Thương hiệu của P&G, dẫn dắt chương trình siết minh bạch chuỗi cung ứng quảng cáo từ năm 2017.',
      'P&G công bố cắt hơn 1 tỷ đô la chi phí agency và sản xuất, đồng thời giảm mạnh số lượng đối tác trong danh sách agency.',
      'Cùng thời gian đó P&G đưa nhiều năng lực về nội bộ và chuyển sang mô hình nhóm làm việc cố định theo thương hiệu.',
    ],
    lesson: 'Nguyên tắc phân định không phải là in-house tốt hơn hay agency tốt hơn. Nó là: giữ trong nhà phần lặp lại hàng ngày và phần chạm vào dữ liệu khách hàng, thuê ngoài phần biến động theo mùa vụ.',
    source: 'P&G — phát biểu của Marc Pritchard tại các hội nghị ANA 2017-2019',
  },

  'm4-s3': {
    brand: 'Unilever',
    year: '2016 đến nay',
    title: 'Unilever dựng mạng lưới xưởng nội dung nội bộ U-Studio',
    facts: [
      'Unilever bắt đầu xây dựng mạng lưới xưởng nội dung nội bộ mang tên U-Studio từ năm 2016.',
      'Mạng lưới này mở rộng ra hàng chục xưởng đặt tại nhiều quốc gia trong những năm tiếp theo.',
      'Mục tiêu được Unilever nêu là giảm chi phí sản xuất nội dung và rút ngắn thời gian từ ý tưởng tới lúc lên sóng.',
    ],
    lesson: 'Bài toán tuyển người hay thuê agency phải quy về lợi ích ròng theo tháng, và phải xét thêm độ dốc chi phí khi ngân sách tăng gấp đôi. Chi phí agency ăn theo phần trăm tăng tuyến tính, chi phí nhân sự thì không.',
    source: 'Unilever — công bố về mạng lưới U-Studio',
  },

  /* ================= CHUYÊN ĐỀ 05 - NGHIÊN CỨU ================= */

  'm5-s1': {
    brand: 'Meta Ad Library',
    year: '2018 đến nay',
    title: 'Công cụ soi đối thủ mạnh nhất lại do chính nền tảng cung cấp miễn phí',
    facts: [
      'Meta mở Thư viện Quảng cáo công khai năm 2018, sau các sức ép về minh bạch quảng cáo chính trị.',
      'Bất kỳ ai cũng tra được toàn bộ mẫu quảng cáo đang chạy của bất kỳ trang nào, kèm ngày bắt đầu chạy, không cần tài khoản quảng cáo.',
      'TikTok cung cấp công cụ tương tự qua TikTok Creative Center, cho tra kho quảng cáo hiệu quả theo ngành và theo quốc gia.',
    ],
    lesson: 'Ngày bắt đầu chạy là trường dữ liệu giá trị nhất trong Thư viện Quảng cáo. Không doanh nghiệp nào duy trì một mẫu quảng cáo suốt 30 ngày nếu nó không sinh ra kết quả.',
    source: 'Meta Ad Library (facebook.com/ads/library); TikTok Creative Center',
  },

  'm5-s2': {
    brand: 'Nghiên cứu học thuật của Guest, Bunce và Johnson',
    year: '2006',
    title: 'Con số 8 đến 12 cuộc phỏng vấn không phải phỏng đoán',
    facts: [
      'Nghiên cứu "How Many Interviews Are Enough?" đăng trên tạp chí Field Methods năm 2006 phân tích 60 cuộc phỏng vấn sâu để tìm ngưỡng bão hoà dữ liệu.',
      'Kết quả: các chủ đề cơ bản đã xuất hiện đủ sau khoảng 6 cuộc, và đến cuộc thứ 12 thì gần như không còn chủ đề mới nào nữa.',
      'Đây là cơ sở học thuật cho khuyến nghị phỏng vấn từ 8 đến 12 người cho mỗi phân khúc đồng nhất.',
    ],
    lesson: 'Khi Ban Giám Đốc chê mẫu 10 người là quá ít, bạn có căn cứ để trả lời. Nghiên cứu định tính không đo tỷ lệ nên không cần mẫu lớn. Nó tìm ra danh sách các lý do, và danh sách đó cạn rất nhanh.',
    source: 'Guest, Bunce & Johnson — "How Many Interviews Are Enough?", Field Methods, 2006',
  },

  'm5-s3': {
    brand: 'Ehrenberg-Bass Institute',
    year: '2010 đến nay',
    title: 'Đối thủ thật của bạn không phải người bạn nghĩ',
    facts: [
      'Nghiên cứu của Viện Ehrenberg-Bass, tổng hợp trong cuốn "How Brands Grow" của Byron Sharp, cho thấy các thương hiệu trong cùng ngành hàng chia sẻ phần lớn tệp khách hàng với nhau.',
      'Phần lớn người mua của một thương hiệu là người mua thưa thớt, mua một hoặc hai lần mỗi năm, chứ không phải nhóm trung thành mua đều.',
      'Hệ quả: thương hiệu tăng trưởng chủ yếu nhờ mở rộng số người mua, không phải nhờ tăng tần suất của nhóm sẵn có.',
    ],
    lesson: 'Phân tích đối thủ mà chỉ soi mẫu quảng cáo là dừng ở lớp nông nhất. Lớp sâu nhất là lớp kinh tế: đối thủ có giá trị trọn đời khách hàng cao hơn thì luôn đủ sức trả giá thầu cao hơn bạn, và cách thắng nằm ở thiết kế lại gói sản phẩm chứ không nằm ở tối ưu quảng cáo.',
    source: 'Byron Sharp — "How Brands Grow", Ehrenberg-Bass Institute',
  },

  'm5-s4': {
    brand: 'Báo cáo e-Conomy SEA',
    year: '2024',
    title: 'Lấy số TAM ở đâu khi làm thật tại Việt Nam',
    facts: [
      'Báo cáo e-Conomy SEA do Google, Temasek và Bain thực hiện hằng năm công bố quy mô từng mảng của nền kinh tế số Việt Nam gồm thương mại điện tử, giao đồ ăn, gọi xe, du lịch trực tuyến và dịch vụ tài chính số.',
      'Tổng cục Thống kê và Sách trắng Thương mại điện tử Việt Nam của Bộ Công Thương công bố số liệu về số doanh nghiệp, hộ kinh doanh và quy mô ngành theo địa bàn.',
      'Đây là các nguồn công khai, miễn phí, trích dẫn được trong tài liệu trình Ban Giám Đốc.',
    ],
    lesson: 'SOM không phải con số mơ ước mà là kết quả của phép chia ngân sách cho chi phí thu hút khách. Khi mục tiêu được giao vượt quá SOM tính ra, bạn có căn cứ định lượng để thương lượng lại thay vì nhận rồi trượt.',
    source: 'Google, Temasek & Bain — e-Conomy SEA 2024; Bộ Công Thương — Sách trắng Thương mại điện tử Việt Nam',
  },

  /* ================= CHUYÊN ĐỀ 06 - KHÁCH HÀNG ================= */

  'm6-s1': {
    brand: 'Netflix',
    year: '2018 đến nay',
    title: 'Netflix bỏ hẳn cách phân nhóm theo tuổi và giới tính',
    facts: [
      'Netflix thay việc phân nhóm theo nhân khẩu học bằng khoảng 2.000 nhóm sở thích dựng hoàn toàn từ hành vi xem thật.',
      'Lãnh đạo mảng sản phẩm của Netflix phát biểu rằng chủng tộc, giới tính hay sắc tộc của một người nói rất ít về việc người đó thực sự thích xem gì.',
      'Các nhóm sở thích này được dùng cho cả việc gợi ý nội dung lẫn quyết định đầu tư sản xuất phim.',
    ],
    lesson: 'Chân dung khách hàng dừng ở tuổi, giới tính và thu nhập thì gần như không dùng được để viết nội dung. Tầng thực sự có giá trị là nỗi đau, kỳ vọng và thói quen tiêu thụ nội dung, vì chỉ ba tầng đó mới đổi được thành thông điệp.',
    source: 'Netflix — công bố về mô hình taste clusters',
  },

  'm6-s2': {
    brand: 'Dove (Unilever)',
    year: '2013',
    title: 'Real Beauty Sketches sinh ra từ một con số, không phải từ cảm hứng',
    facts: [
      'Chiến dịch dựa trên kết quả nghiên cứu của Dove: chỉ 4% phụ nữ tự mô tả bản thân là đẹp, và khoảng 54% cho rằng mình là người khắt khe nhất với chính vẻ ngoài của mình.',
      'Đoạn phim mời một hoạ sĩ phác hoạ tội phạm vẽ hai bức chân dung cho cùng một người: một bức theo lời tự mô tả, một bức theo lời người lạ mô tả.',
      'Phim phát hành tháng 4 năm 2013, đạt hơn 15 triệu lượt xem chỉ trong tuần đầu và trở thành một trong những quảng cáo được xem nhiều nhất mọi thời.',
    ],
    lesson: 'Insight tốt luôn có hình dạng của một mâu thuẫn đo được, không phải một câu nói hay. Ở đây mâu thuẫn là: phụ nữ đánh giá bản thân thấp hơn hẳn mức người khác đánh giá họ. Toàn bộ ý tưởng sáng tạo chỉ là cách trình bày mâu thuẫn đó.',
    source: 'Unilever/Ogilvy — chiến dịch Dove Real Beauty Sketches, 2013',
  },

  'm6-s3': {
    brand: 'Sephora',
    year: '2007 đến nay',
    title: 'Beauty Insider và cách phân tầng khách hàng theo giá trị chi tiêu',
    facts: [
      'Sephora vận hành chương trình Beauty Insider từ năm 2007, chia thành viên thành nhiều hạng dựa trên tổng chi tiêu trong năm.',
      'Mỗi hạng nhận quyền lợi khác nhau, trong đó hạng cao được ưu tiên mua trước sản phẩm mới và nhận ưu đãi riêng.',
      'Chương trình có hàng chục triệu thành viên và là nguồn dữ liệu hành vi chính cho hoạt động marketing của hãng.',
    ],
    lesson: 'Nguyên tắc chung với RFM: nhóm đáng chi tiền nhất thường không phải khách trung thành đang mua đều, mà là khách từng chi nhiều nhưng lâu rồi chưa quay lại. Kéo họ về gần như luôn rẻ hơn tìm một khách mới tương đương.',
    source: 'Sephora — chương trình Beauty Insider',
  },

  /* ================= CHUYÊN ĐỀ 07 - SÁNG TẠO ================= */

  'm7-s1': {
    brand: 'Apple',
    year: '2015 đến nay',
    title: 'Shot on iPhone: một Big Idea nuôi được cả chục năm nội dung',
    facts: [
      'Apple khởi động chiến dịch Shot on iPhone năm 2015 với các bức ảnh do chính người dùng chụp, đặt trên bảng quảng cáo ngoài trời khắp thế giới.',
      'Chiến dịch từng giành giải Sư Tử Vàng hạng mục Outdoor tại Cannes Lions năm 2015.',
      'Cấu trúc thông điệp không đổi qua các năm, chỉ thay lớp nội dung bên trên theo từng đời máy và từng tính năng mới.',
    ],
    lesson: 'Đây chính là Ngôi nhà Thông điệp vận hành đúng cách. Big Idea là "máy trong tay bạn đủ tốt để tạo ra tác phẩm". Trụ cột nội dung là ảnh người dùng. Bằng chứng là chính những bức ảnh đó. Nhờ vậy mọi thị trường triển khai khác nhau mà vẫn không lệch thông điệp.',
    source: 'Apple — chiến dịch Shot on iPhone; Cannes Lions 2015',
  },

  'm7-s2': {
    brand: 'Duolingo',
    year: '2021 đến 2023',
    title: 'Đặt cược toàn bộ vào 3 giây đầu trên TikTok',
    facts: [
      'Duolingo giao tài khoản TikTok cho một nhân sự trẻ với quyền tự quyết nội dung, dùng linh vật cú xanh làm nhân vật chính.',
      'Tài khoản tăng từ vài chục nghìn lên hàng triệu người theo dõi trong khoảng hai năm.',
      'Công thức lặp lại: linh vật xuất hiện ngay khung hình đầu tiên với hành động bất thường, phần liên quan tới sản phẩm chỉ đến ở cuối video.',
    ],
    lesson: 'Cấu trúc Hook - Story - Offer không phải mẹo làm video mà là cách phân bổ nguồn lực. Nếu 3 giây đầu không giữ được người xem thì mọi công sức bỏ vào 30 giây sau đều không có ai xem để mà thuyết phục.',
    source: 'Duolingo — tài khoản TikTok chính thức @duolingo',
  },

  'm7-s3': {
    brand: 'Meta',
    year: 'Hiện hành',
    title: 'Bốn chỉ số chẩn đoán đều lấy được từ báo cáo có sẵn',
    facts: [
      'Meta định nghĩa chỉ số lượt phát video 3 giây và ThruPlay ngay trong trình quản lý quảng cáo, không cần công cụ ngoài.',
      'Cả Meta và TikTok đều cho tách chỉ số theo từng mẫu quảng cáo, nên so sánh giữa các mẫu là việc làm được ngay trong ngày.',
      'Các ngưỡng tham chiếu thay đổi theo ngành và theo định dạng, nên chỉ nên dùng để so sánh giữa các mẫu của chính bạn.',
    ],
    lesson: 'Khi mẫu A có mở đầu tốt còn mẫu B có phần thân tốt, hành động đúng là ghép 3 giây đầu của A vào phần thân của B rồi chạy lại. Kiểm định theo từng thành phần luôn nhanh và rẻ hơn làm lại video từ đầu.',
    source: 'Meta Business Help Center — định nghĩa chỉ số video',
  },

  /* ================= CHUYÊN ĐỀ 08 - LAN TRUYỀN ================= */

  'm8-s1': {
    brand: 'Nghiên cứu của Jonah Berger và Katherine Milkman',
    year: '2012',
    title: 'Cảm xúc nào khiến người ta bấm chia sẻ, đã có bằng chứng định lượng',
    facts: [
      'Nghiên cứu "What Makes Online Content Viral?" đăng trên Journal of Marketing Research năm 2012 phân tích khoảng 7.000 bài báo của tờ New York Times để tìm yếu tố dự đoán lượt chia sẻ.',
      'Kết quả: nội dung khơi dậy cảm xúc cường độ cao như kinh ngạc, tức giận hay lo lắng được chia sẻ nhiều hơn hẳn.',
      'Ngược lại, nội dung gây buồn bã, một cảm xúc cường độ thấp, lại làm giảm khả năng được chia sẻ.',
      'Jonah Berger hệ thống hoá thành khung STEPPS trong cuốn "Contagious" xuất bản năm 2013.',
    ],
    lesson: 'Nội dung cảm động không tự nhiên lan truyền. Thứ lan truyền là nội dung khiến người ta phải làm gì đó ngay lập tức. Đây là lý do vì sao nhiều chiến dịch cảm động lấy được nước mắt nhưng không lấy được lượt chia sẻ.',
    source: 'Berger & Milkman — "What Makes Online Content Viral?", Journal of Marketing Research, 2012',
  },

  'm8-s2': {
    brand: 'Dropbox',
    year: '2008 đến 2010',
    title: 'Chương trình giới thiệu hai chiều đưa người dùng từ 100 nghìn lên 4 triệu',
    facts: [
      'Tháng 9 năm 2008 Dropbox ra mắt chương trình giới thiệu tặng 500MB dung lượng cho cả người mời lẫn người được mời, tối đa 16GB.',
      'Trong 15 tháng, số người đăng ký tăng từ khoảng 100 nghìn lên 4 triệu, tức tăng 3.900%.',
      'Dropbox ghi nhận chương trình này tạo mức tăng bền vững khoảng 60% lượng đăng ký, và ở giai đoạn cao điểm khoảng 35% lượt đăng ký mỗi ngày đến từ giới thiệu.',
      'Tháng 4 năm 2010 có 2,8 triệu lời mời được gửi đi.',
    ],
    lesson: 'Điểm mấu chốt là phần thưởng dành cho cả hai phía. Thưởng một phía biến người giới thiệu thành người đi xin xỏ bạn bè. Thưởng hai phía biến lời mời thành món quà, và tỷ lệ người nhận tham gia tăng theo, tức là vế thứ hai trong công thức K-Factor.',
    source: 'Dropbox — số liệu tăng trưởng do Drew Houston công bố; tổng hợp các phân tích chương trình giới thiệu Dropbox',
  },

  'm8-s3': {
    brand: 'Hiệp hội ALS Hoa Kỳ',
    year: '2014 và 2016',
    title: 'Thử thách dội xô nước đá và ba lớp thiết kế phía sau',
    facts: [
      'Trong 8 tuần mùa hè năm 2014, chiến dịch thu về hơn 115 triệu đô la cho Hiệp hội ALS Hoa Kỳ.',
      'Hơn 28 triệu người tham gia tương tác với nội dung của chiến dịch qua đăng bài, chia sẻ và bấm thích.',
      'Năm 2016, khoản 1 triệu đô la mà Hiệp hội ALS rót vào dự án Project MinE từ nguồn tiền này góp phần dẫn tới việc phát hiện gene NEK1, một trong những yếu tố di truyền phổ biến nhất gây bệnh ALS.',
    ],
    lesson: 'Chiến dịch này thoả cả ba lớp cùng lúc: động cơ tự thể hiện vì người tham gia trông hào phóng và vui tính, ma sát gần bằng không vì chỉ cần một xô nước và một chiếc điện thoại, và vòng quay khép kín vì luật chơi buộc mỗi người phải chỉ định ba người tiếp theo.',
    source: 'The ALS Association — tổng kết Ice Bucket Challenge; Nature Genetics — công bố phát hiện gene NEK1, 2016',
  },

  /* ================= CHUYÊN ĐỀ 09 - LẬP KẾ HOẠCH ================= */

  'm9-s1': {
    brand: 'PR Smith',
    year: '1990 và 2011',
    title: 'SOSTAC không phải khung tự nghĩ ra, nó có tác giả và có xếp hạng',
    facts: [
      'Khung SOSTAC do ông PR Smith xây dựng từ thập niên 1990 để phục vụ việc lập kế hoạch marketing.',
      'Trong cuộc thăm dò nhân dịp 100 năm của Viện Marketing Đặc quyền Anh (CIM) năm 2011, SOSTAC được bình chọn vào nhóm ba mô hình marketing phổ biến nhất.',
      'Sáu bước gồm Situation, Objectives, Strategy, Tactics, Action và Control.',
    ],
    lesson: 'Giá trị của SOSTAC nằm ở thứ tự bắt buộc. Đa số bản kế hoạch hỏng vì nhảy thẳng từ Objectives sang Tactics, tức là chọn kênh trước khi xác định chiến lược, dẫn tới một danh sách việc phải làm mà không ai giải thích được vì sao lại làm những việc đó.',
    source: 'PR Smith — "The SOSTAC Guide to Writing the Perfect Plan"; CIM Centenary Poll 2011',
  },

  'm9-s2': {
    brand: 'Meta',
    year: 'Hiện hành',
    title: 'Vì sao không được tăng ngân sách đột ngột: giai đoạn học có ngưỡng số cụ thể',
    facts: [
      'Meta công bố một nhóm quảng cáo cần khoảng 50 sự kiện chuyển đổi trong cửa sổ 7 ngày để thoát giai đoạn học.',
      'Các chỉnh sửa lớn về ngân sách, tệp khách hàng hay mẫu quảng cáo sẽ đưa nhóm quảng cáo quay lại giai đoạn học từ đầu.',
      'Trong giai đoạn học, kết quả biến động mạnh nên không đủ tin cậy để ra quyết định tắt hay giữ.',
    ],
    lesson: 'Đây là căn cứ kỹ thuật cho việc tăng ngân sách theo từng nấc thay vì tăng vọt. Mức tăng 20% mỗi vài ngày là kinh nghiệm thực hành phổ biến trong nghề, không phải quy định của nền tảng, nhưng nguyên tắc đứng sau nó thì có tài liệu chính thức.',
    source: 'Meta Business Help Center — tài liệu về giai đoạn học của nhóm quảng cáo',
  },

  'm9-s3': {
    brand: 'Apple và Meta',
    year: '2021 đến 2022',
    title: 'App Tracking Transparency: rủi ro lớn nhất thường đến từ bên bạn không kiểm soát',
    facts: [
      'Tháng 4 năm 2021 Apple triển khai App Tracking Transparency trên iOS 14.5, buộc ứng dụng phải xin phép người dùng trước khi theo dõi hành vi giữa các ứng dụng.',
      'Tỷ lệ người dùng đồng ý cho theo dõi ở mức thấp, khiến dữ liệu chuyển đổi mà Meta nhận được bị đứt gãy đáng kể.',
      'Đầu năm 2022, Meta công bố ước tính chính sách này sẽ làm hãng mất khoảng 10 tỷ đô la doanh thu trong năm đó.',
    ],
    lesson: 'Không rủi ro nào trong danh sách của bạn có ngưỡng kích hoạt kiểu này. Vì vậy nguyên tắc quan trọng hơn từng kịch bản cụ thể là: không để một tài khoản hay một nền tảng gánh quá 60% ngân sách, và luôn sao lưu tệp khách hàng ra nơi bạn sở hữu.',
    source: 'Apple — công bố ATT trên iOS 14.5; Meta — báo cáo kết quả quý 4/2021',
  },

  'm9-s4': {
    brand: 'Ngành phòng tập',
    year: 'Tham chiếu chung',
    title: 'Vì sao mô hình thu phí định kỳ luôn phải chữa rò rỉ trước',
    facts: [
      'Với mô hình thu phí theo tháng, số hội viên hoạt động cuối kỳ bằng số đầu kỳ cộng hội viên mới trừ hội viên rời bỏ.',
      'Khi tỷ lệ rời bỏ hàng tháng cao, phần lớn hội viên mới mua về chỉ để bù vào chỗ trống chứ không làm tăng quy mô.',
      'Mỗi hội viên giữ lại được có giá trị tương đương một hội viên mới nhưng không tốn chi phí thu hút.',
    ],
    lesson: 'Bước quan trọng nhất khi lập kế hoạch là kiểm chứng ngược xem mục tiêu có khả thi với ngân sách được giao hay không, rồi dám trình con số đó ra. Trình một kế hoạch mà chính bạn biết là không đạt được sẽ khiến bạn mất uy tín vào cuối quý.',
    source: 'Nguyên lý chung của mô hình doanh thu định kỳ',
  },

  /* ================= CHUYÊN ĐỀ 10 - HIỆU QUẢ ================= */

  'm10-s1': {
    brand: 'Procter & Gamble',
    year: '2017',
    title: 'Cắt 200 triệu đô la quảng cáo số mà độ phủ lại tăng',
    facts: [
      'Marc Pritchard công bố P&G cắt 200 triệu đô la chi tiêu quảng cáo số trong năm 2017 do lo ngại về khả năng hiển thị thật và an toàn thương hiệu.',
      'Phần cắt được thực hiện làm hai đợt 100 triệu, sau khi đợt đầu cho thấy hầu như không ảnh hưởng tới kết quả kinh doanh.',
      'P&G cho biết việc này giúp loại bỏ khoảng 20% chi tiêu không hiệu quả và độ phủ tăng khoảng 10%.',
      'Một dữ liệu được Pritchard nêu ra: thời gian xem trung bình của một quảng cáo trên bảng tin di động chỉ khoảng 1,7 giây.',
    ],
    lesson: 'Chỉ số kỹ thuật đẹp ở tầng ba của tháp KPI hoàn toàn có thể tồn tại song song với việc tiền đang bị đốt. Trưởng phòng phải chủ động nối tầng ba lên tầng một, chứ đừng chờ Ban Giám Đốc phát hiện ra khoảng trống đó.',
    source: 'P&G — phát biểu của Marc Pritchard tại hội nghị ANA 2018; Adweek, The Drum',
  },

  'm10-s2': {
    brand: 'Google Analytics 4',
    year: '2023',
    title: 'Google gỡ bỏ bốn mô hình ghi nhận chuyển đổi',
    facts: [
      'Tháng 5 năm 2023, bốn mô hình gồm lần chạm đầu, tuyến tính, suy giảm theo thời gian và theo vị trí ngừng khả dụng cho các hành động chuyển đổi mới trong GA4.',
      'Tháng 9 năm 2023 Google gỡ hẳn bốn mô hình này khỏi cả GA4 lẫn Google Ads, chỉ giữ lại lần chạm cuối và mô hình dựa trên dữ liệu.',
      'Lý do Google nêu: tỷ lệ sử dụng rất thấp, dưới 3% số chuyển đổi trong Google Ads, và các mô hình này không còn theo kịp hành trình mua hàng nhiều điểm chạm.',
      'Các hành động chuyển đổi đang dùng mô hình cũ được tự động chuyển sang mô hình dựa trên dữ liệu.',
    ],
    lesson: 'Bài học ở đây không chỉ là cập nhật danh sách mô hình. Nó là: công cụ đo lường của bạn do bên thứ ba sở hữu và có thể đổi bất cứ lúc nào. Vì vậy phải luôn giữ một nguồn số liệu độc lập, đó là hệ thống bán hàng của chính doanh nghiệp.',
    source: 'Google — thông báo gỡ bỏ mô hình ghi nhận chuyển đổi, 2023; Search Engine Land',
  },

  'm10-s3': {
    brand: 'Uber',
    year: '2017 đến 2020',
    title: 'Tắt 100 triệu đô la quảng cáo mà lượt cài đặt gần như không đổi',
    facts: [
      'Ông Kevin Frisch, khi đó phụ trách marketing hiệu suất và CRM của Uber, cho biết đã tắt khoảng 100 triệu đô la trong tổng ngân sách quảng cáo trực tuyến khoảng 150 triệu đô la một năm.',
      'Sau khi tắt, số lượt cài đặt ứng dụng của người dùng gần như không thay đổi.',
      'Cơ chế được phát hiện: một số mạng quảng cáo tạo lượt bấm hàng loạt trên hàng nghìn thiết bị, để khi người dùng tự cài ứng dụng thì mạng đó vẫn nhận được công.',
      'Uber khởi kiện năm mạng quảng cáo và giành phần thắng trong vụ kiện liên quan tới Fetch Media.',
    ],
    lesson: 'Đây là dạng cực đoan nhất của việc ghi nhận trùng: nền tảng nhận công cho những chuyển đổi vốn dĩ đã xảy ra. Cách kiểm chứng duy nhất là thử tắt hẳn một kênh trong một khoảng thời gian và đo phần doanh thu thật bị mất, thay vì tin vào báo cáo của chính kênh đó.',
    source: 'Uber v. Fetch Media; Forbes — "One Of Uber\'s Lawsuits Against Ad Fraud Comes Full Circle", 2021; WARC',
  },

  /* ================= CHUYÊN ĐỀ 11 - TƯ VẤN ================= */

  'm11-s1': {
    brand: 'LEGO',
    year: '2004 đến 2015',
    title: 'Cuộc lội ngược dòng bắt đầu bằng chẩn đoán, không bằng chiến dịch',
    facts: [
      'Năm 2003 và 2004 LEGO rơi vào khủng hoảng tài chính nặng nhất lịch sử công ty sau nhiều năm mở rộng sang công viên giải trí, quần áo và trò chơi điện tử.',
      'Ông Jørgen Vig Knudstorp lên làm Tổng Giám Đốc năm 2004, cắt bỏ phần lớn các mảng ngoài ngành và quay lại tập trung vào viên gạch nhựa.',
      'Đến năm 2015 LEGO trở thành công ty đồ chơi có doanh thu lớn nhất thế giới.',
    ],
    lesson: 'Bộ 5 tiêu chí thẩm định kế hoạch tồn tại để chặn đúng loại sai lầm này. Tiêu chí Tính đồng bộ hỏi: kế hoạch này có phục vụ mục tiêu kinh doanh cốt lõi không, hay chỉ đang mở thêm mặt trận mới trong khi mặt trận chính đang thua.',
    source: 'LEGO Group — báo cáo thường niên; các phân tích về giai đoạn tái cấu trúc 2004-2015',
  },

  'm11-s2': {
    brand: "Domino's Pizza",
    year: '2009 đến 2010',
    title: 'Thừa nhận sản phẩm dở là bước đầu tiên của cuộc lội ngược dòng',
    facts: [
      'Cuối năm 2009 Domino\'s tung chiến dịch Pizza Turnaround, phát nguyên văn các lời chê gay gắt của khách hàng về bánh của chính mình trên quảng cáo.',
      'Song song đó hãng thay đổi công thức bánh, chứ không chỉ thay thông điệp truyền thông.',
      'Quý 1 năm 2010 doanh thu cùng cửa hàng tại Mỹ tăng 14,3%, mức tăng kỷ lục của ngành nhà hàng phục vụ nhanh khi đó.',
      'Đà tăng còn tiếp diễn, quý 3 năm 2010 tăng 11,2% so với cùng kỳ.',
    ],
    lesson: 'Không chiến dịch truyền thông nào cứu được một sản phẩm dở. Domino\'s thành công vì đã sửa sản phẩm trước rồi mới truyền thông. Khi chẩn đoán ra vấn đề nằm ngoài phạm vi marketing, việc của Trưởng phòng là nói thẳng chứ không phải chạy thêm quảng cáo.',
    source: "Domino's Pizza — thông cáo kết quả tài chính quý 1/2010; Campaign — case study Domino's và Crispin Porter & Bogusky",
  },

  'm11-s3': {
    brand: 'Baemin Việt Nam',
    year: '2019 đến 2023',
    title: 'Truyền thông xuất sắc không cứu được bài toán đơn vị kinh tế',
    facts: [
      'Baemin, do Woowa Brothers Việt Nam vận hành, vào thị trường Việt Nam năm 2019 và nhanh chóng được giới marketing đánh giá cao về chất lượng sáng tạo và mức độ bản địa hoá.',
      'Theo thống kê năm 2022, Baemin chỉ nắm khoảng 12% thị phần giao đồ ăn tại Việt Nam, trong khi Grab chiếm khoảng 45% và ShopeeFood khoảng 41%.',
      'Baemin chính thức dừng hoạt động tại Việt Nam từ ngày 8 tháng 12 năm 2023.',
      'Ông Niklas Östberg, đồng sáng lập kiêm Tổng Giám Đốc Delivery Hero, công ty mẹ, nói rằng hoạt động kinh doanh tại Việt Nam "không bao giờ có lãi".',
    ],
    lesson: 'Đây là minh chứng đắt giá nhất cho nguyên tắc của cả chuyên đề: khi chi phí thu hút khách vượt lợi nhuận gộp mỗi đơn, vấn đề nằm ở mô hình kinh doanh chứ không nằm ở quảng cáo. Baemin làm truyền thông thuộc nhóm tốt nhất thị trường và vẫn phải rút, vì tối ưu quảng cáo chỉ làm chậm tốc độ lỗ chứ không đảo được dấu.',
    source: 'VnExpress, Tuổi Trẻ, Vietstock — tin Baemin dừng hoạt động tại Việt Nam, tháng 11-12/2023; phát biểu của Tổng Giám Đốc Delivery Hero',
  },
};
