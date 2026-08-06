/**
 * KHOÁ NÂNG CAO: TRADE MARKETING — ĐỊNH HƯỚNG NGHỀ NGHIỆP
 *
 * Khoá này BỊ KHOÁ cho tới khi học viên hoàn thành toàn bộ khoá Digital
 * Marketing và đủ điều kiện nhận Bằng Chứng Nhận. Điều kiện mở khoá kiểm tra
 * ở App.jsx, không kiểm tra trong tệp dữ liệu này.
 *
 * Nguồn nội dung: tài liệu "Trade Marketing — Định hướng nghề nghiệp cho sinh
 * viên" do Lê Thành Phong biên soạn, cập nhật tháng 7/2026. Đã chuyển từ dạng
 * tài liệu đọc sang dạng chuyên đề + bài kiểm tra để chạy trong ứng dụng.
 *
 * Cấu trúc giữ đúng khuôn của COURSE_MODULES trong courseData.js để tái dùng
 * được LessonViewer và QuizComponent mà không phải sửa hai component đó.
 *
 * Quy ước bắt buộc (xem CONTRIBUTING.md):
 *   - lessonsCount === sections.length, quizCount === quiz.length
 *   - sections[].id theo mẫu `tm<số chuyên đề>-s<số bài>` — CỐ Ý khác mẫu
 *     `m<n>-s<n>` của khoá chính, vì LESSON_VISUALS tra cứu theo sectionId,
 *     trùng id sẽ kéo nhầm sơ đồ của khoá kia sang.
 *   - quiz[].options đúng 4 lựa chọn, `correct` là chỉ số 0-3
 *   - content chỉ dùng cú pháp trình kết xuất hiểu: `### `, `#### `, `- `,
 *     `1. `, `**đậm**`. Không bảng, không khối mã.
 */

export const TRADE_COURSE_META = {
  id: 'trade-marketing',
  title: 'Trade Marketing — Định Hướng Nghề Nghiệp',
  subtitle: 'Khoá nâng cao dành cho học viên đã tốt nghiệp',
  author: 'Lê Thành Phong',
  updatedAt: 'Tháng 7/2026',
  audience: 'Sinh viên, người mới ra trường và người chuyển ngành sang Trade',
  promise: 'Hiểu nghề, tự đánh giá độ phù hợp, và chuẩn bị xong hồ sơ cho vị trí Trade Marketing đầu tiên.'
};

export const TRADE_MODULES = [
  /* ================= CHUYÊN ĐỀ 01 ================= */
  {
    id: 'trade-01',
    number: 1,
    title: 'Trade Marketing Là Gì',
    subtitle: 'Định nghĩa nghề và ba đối tượng phải phân biệt',
    description:
      'Nếu Brand Marketing xây hình ảnh trong tâm trí người tiêu dùng, Trade Marketing giành chiến thắng ngay tại quầy kệ — nơi quyết định mua hàng thực sự xảy ra.',
    icon: 'Store',
    badge: 'Nền Tảng Nghề',
    duration: '60 phút',
    lessonsCount: 3,
    quizCount: 4,
    sections: [
      {
        id: 'tm1-s1',
        title: 'Định nghĩa và vị trí của nghề',
        content: `### Trade Marketing là gì

Trade Marketing là chuỗi hoạt động tổ chức và xây dựng chiến lược ngành hàng, chiến lược thương hiệu trong hệ thống kênh phân phối — nhằm biến chiến lược thương hiệu thành doanh số thực tế tại điểm bán.

Nói ngắn gọn: **Brand thắng ở tâm trí, Trade thắng ở quầy kệ.**

### Vì sao nghề này tồn tại

Một thương hiệu có thể chi rất nhiều tiền cho quảng cáo và được cả nước biết tới. Nhưng nếu khi khách bước vào cửa hàng mà sản phẩm không có trên kệ, bị xếp ở tầng dưới cùng, hoặc đứng cạnh một đối thủ đang treo biển giảm giá — thì toàn bộ ngân sách truyền thông kia không quy được thành đơn hàng.

Trade Marketing là bộ phận chịu trách nhiệm cho quãng đường cuối cùng đó: từ lúc khách hàng bước vào điểm bán tới lúc sản phẩm nằm trong giỏ.

### Ba đặc điểm cần biết trước khi chọn nghề

- **Cạnh tranh trực tiếp trên con số.** Mọi hoạt động cuối cùng đều phải quy về doanh số tại điểm bán. Không có chỗ cho hoạt động đẹp mà không ra số.
- **Chu kỳ ngắn.** Tính bằng tháng và quý, không phải bằng năm như Brand. Kết quả đến nhanh, mà hậu quả cũng đến nhanh.
- **Phải xuống thị trường.** Đây không phải nghề ngồi bàn. Không đi điểm bán thì không có dữ liệu thật để ra quyết định.

### Một ngày làm việc thật trông như thế nào

Để hình dung cụ thể thay vì đoán, đây là nhịp công việc điển hình của một Trade Marketing Executive:

- **Đầu tuần:** đọc số sell-out tuần trước theo kênh, phát hiện chỗ bất thường, chuẩn bị báo cáo cho cuộc họp thương mại.
- **Giữa tuần:** đi thị trường nửa ngày, kiểm tra trưng bày và POSM tại các điểm trọng điểm, chụp ảnh đối chiếu với tiêu chuẩn.
- **Cuối tuần:** làm việc với nhà cung cấp và agency về vật phẩm cho chương trình tháng sau, chốt số lượng và lịch giao.
- **Xen kẽ liên tục:** trả lời đội Sales về cơ chế chương trình đang chạy, xử lý phát sinh tại điểm bán, cập nhật bảng theo dõi ngân sách.

Tỷ trọng thời gian thay đổi theo mùa: mùa cao điểm lễ Tết thì phần điều phối triển khai chiếm gần hết, còn mùa thấp điểm mới có chỗ cho việc lập kế hoạch.

### Nghề này KHÔNG phải gì

Ba hiểu nhầm hay gặp ở người mới:

- **Không phải nghề thiết kế.** Trade viết brief và duyệt, không tự dựng file. Biết đọc bản in thử và bắt lỗi kích thước, màu, thông tin bắt buộc là đủ.
- **Không phải nghề bán hàng.** Trade không mang chỉ tiêu doanh số cá nhân theo tuyến như Sales, nhưng chịu trách nhiệm cho công cụ giúp Sales bán được.
- **Không phải nghề tổ chức sự kiện.** Activation chỉ là một phần nhỏ. Phần lớn thời gian là kế hoạch, số liệu và điều phối.`,
        takeaway:
          'Trade Marketing là cầu nối biến chiến lược thương hiệu thành doanh số thực tế tại điểm bán. Mọi hoạt động đều phải quy được về con số tiêu thụ.'
      },
      {
        id: 'tm1-s2',
        title: 'Ba đối tượng phải phân biệt rõ',
        content: `### Đây là phần dễ mất điểm nhất khi phỏng vấn

Người mới thường nói "khách hàng" một cách chung chung. Trong Trade Marketing, ba từ dưới đây chỉ ba đối tượng hoàn toàn khác nhau, và nhầm lẫn giữa chúng bị nhận ra ngay trong ba phút đầu buổi phỏng vấn.

#### 1. Shopper — Người mua

Người trực tiếp đến điểm bán để chọn và mua sản phẩm. Quyết định của họ có thể thay đổi ngay tại chỗ vì trưng bày, giảm giá, hàng dùng thử hay quà tặng kèm.

**Đây chính là đối tượng của Trade Marketing.**

#### 2. Consumer / User — Người dùng

Người thực sự sử dụng sản phẩm. Không phải lúc nào cũng trùng với người mua.

Ví dụ kinh điển: mẹ đi siêu thị mua dầu gội cho con trai. **Mẹ là shopper, con trai là consumer.** Trade nói chuyện với mẹ, Brand nói chuyện với con.

#### 3. Customer — Khách hàng

Các đối tác trung gian trong kênh phân phối: nhà phân phối, đại lý, nhà bán lẻ, chuỗi siêu thị. Họ là bên đưa hàng đến tay shopper.

Đây là điểm dễ nhầm nhất: trong Trade, **"customer" không phải người tiêu dùng cuối**.

### Trade phục vụ cả hai phía

Trade Marketing cùng lúc phải thuyết phục customer nhập hàng và ưu tiên trưng bày, đồng thời thuyết phục shopper chọn mua. Hai nhóm này có động cơ khác nhau: customer quan tâm biên lợi nhuận và vòng quay hàng, shopper quan tâm giá và sự tiện lợi.

### Ba đối tượng, ba câu hỏi hoàn toàn khác nhau

Cách nhanh nhất để không nhầm là nhớ mỗi bên quan tâm điều gì:

- **Shopper hỏi:** món này có đáng tiền không, có tiện không, có đang giảm giá không.
- **Consumer hỏi:** dùng có thích không, có hợp với tôi không.
- **Customer hỏi:** tôi lãi bao nhiêu trên mỗi thùng, bao lâu quay vòng hết hàng, có tồn đọng vốn không.

Cùng một chương trình khuyến mãi phải trả lời được cả ba câu này theo ba cách khác nhau. Một cơ chế hấp dẫn với shopper nhưng bóp biên lợi nhuận của customer sẽ không được nhập hàng, nên không bao giờ tới được tay shopper.

### Ngành hàng nào ba vai càng tách xa nhau

Độ lệch giữa shopper và consumer khác nhau rõ rệt theo ngành:

- **Tách hoàn toàn:** sữa công thức, tã, thức ăn thú cưng, đồ dùng học sinh. Người dùng gần như không bao giờ tự đi mua.
- **Tách một phần:** dầu gội, bánh kẹo, mì gói. Người mua chính trong nhà mua cho cả gia đình.
- **Gần như trùng:** bia, cà phê, mỹ phẩm cá nhân. Người dùng tự chọn và tự trả tiền.

Ngành hàng nào hai vai càng tách xa thì vai trò của Trade càng nặng, vì người đứng trước kệ không phải người trải nghiệm sản phẩm — họ chọn bằng thông tin trên bao bì và bằng thứ đang bày trước mắt.

### Bài tập tự làm

Tự tìm thêm 5 ví dụ shopper khác consumer trong chính đời sống của bạn. Càng gần đời sống thật càng dễ nhớ khi bị hỏi bất ngờ.`,
        takeaway:
          'Shopper là người mua, consumer là người dùng, customer là đối tác trong kênh phân phối. Nhầm ba khái niệm này là lỗi bị phát hiện ngay trong ba phút đầu phỏng vấn.'
      },
      {
        id: 'tm1-s3',
        title: 'Brand Marketing và Trade Marketing khác nhau ở đâu',
        content: `### Khác nhau ở ba trục: đối tượng, không gian và thước đo

#### Brand Marketing

- **Đối tượng:** người tiêu dùng (consumer)
- **Không gian:** truyền thông, mạng xã hội, TVC
- **Mục tiêu:** nhận biết, yêu thích, gắn bó thương hiệu
- **Đo bằng:** awareness, brand love, share of voice
- **Chu kỳ:** dài hạn, tính bằng năm

#### Trade Marketing

- **Đối tượng:** người mua (shopper) và kênh phân phối (customer)
- **Không gian:** điểm bán — quầy, kệ, cửa hàng
- **Mục tiêu:** hàng có mặt, được thấy, được chọn
- **Đo bằng:** sell-out, coverage, share of shelf, ROI
- **Chu kỳ:** ngắn hạn, tính bằng tháng và quý

### Câu chốt cần thuộc

**"Brand Marketing giành lấy trái tim, Trade Marketing giành lấy giỏ hàng."**

### Hai bên không thay thế nhau

Đây không phải hai lựa chọn để chọn một. Brand tạo ra nhu cầu, Trade thu hoạch nhu cầu đó tại điểm bán. Thiếu Brand thì Trade phải giảm giá liên tục mới bán được. Thiếu Trade thì tiền quảng cáo của Brand chảy sang túi đối thủ có mặt trên kệ.

Người làm Trade giỏi luôn đọc được kế hoạch Brand, và ngược lại.

### Hai bên va nhau ở đâu

Biết trước các điểm va chạm để không bị bất ngờ trong cuộc họp đầu tiên:

- **Ngân sách A&P.** Một túi tiền, hai nhu cầu. Brand muốn dồn cho truyền thông xây dài hạn, Trade muốn dồn cho hoạt động ra số ngay.
- **Giá bán.** Trade cần cơ chế khuyến mãi để đạt chỉ tiêu quý; Brand lo giảm giá liên tục làm hỏng định vị đã dựng nhiều năm.
- **Bao bì phiên bản đặc biệt.** Brand muốn đẹp và đúng nhận diện; Trade cần bày được lên kệ, chồng được, và không quá khổ so với ô kệ đã đàm phán.
- **Lịch.** Brand chạy theo mùa chiến dịch truyền thông; Trade chạy theo mùa mua sắm của kênh. Hai lịch này không phải lúc nào cũng trùng.

Cách xử lý không phải là thắng cuộc tranh luận mà là đưa được số liệu vào bàn: mốc nền, ROI kỳ trước, và hệ quả có thể tính được của từng phương án.

### Câu hỏi phỏng vấn hay gặp

**"Nếu Brand muốn giữ giá còn Sales muốn giảm sâu để chạy chỉ tiêu quý, bạn xử lý thế nào?"**

Câu này kiểm tra xem ứng viên có hiểu mình đứng giữa hay không. Hướng trả lời tốt: nêu hệ quả có thể tính được của việc giảm giá (kéo doanh số quý sau về, tạo tiền lệ khiến kênh chỉ nhập khi có khuyến mãi, có thể buộc đối thủ hạ giá theo), rồi đưa phương án thay thế đạt cùng mục tiêu mà không đụng giá niêm yết — tăng giá trị thay vì giảm giá, hoặc dồn nguồn lực vào trưng bày và độ phủ.

Tinh thần cần thể hiện: **đứng cùng phía với Sales về mục tiêu, khác phía về cách làm.**`,
        takeaway:
          'Brand đo bằng nhận biết và yêu thích với chu kỳ dài; Trade đo bằng sell-out, coverage và ROI với chu kỳ ngắn. Brand tạo nhu cầu, Trade thu hoạch nhu cầu tại điểm bán.'
      }
    ],
    quiz: [
      {
        id: 'qtm1_1',
        question: 'Điểm khác biệt cốt lõi giữa Trade Marketing và Brand Marketing là gì?',
        options: [
          'Trade dùng ngân sách lớn hơn Brand',
          'Khác ở đối tượng, không gian hoạt động và thước đo hiệu quả',
          'Trade chỉ làm cho hàng tiêu dùng nhanh, Brand làm cho mọi ngành',
          'Trade thuộc phòng Sales, Brand thuộc phòng Marketing'
        ],
        correct: 1,
        explanation:
          'Brand hướng tới người tiêu dùng qua kênh truyền thông, đo bằng nhận biết và mức độ yêu thích, chu kỳ dài. Trade hướng tới người mua và kênh phân phối ngay tại điểm bán, đo bằng sell-out, coverage và ROI, chu kỳ ngắn. Câu chốt: Brand giành trái tim, Trade giành giỏ hàng.'
      },
      {
        id: 'qtm1_2',
        question: 'Mẹ đi siêu thị mua dầu gội cho con trai. Ai là shopper, ai là consumer?',
        options: [
          'Mẹ là consumer, con trai là shopper',
          'Cả hai đều là shopper vì cùng một gia đình',
          'Mẹ là shopper, con trai là consumer',
          'Siêu thị là shopper, mẹ là consumer'
        ],
        correct: 2,
        explanation:
          'Shopper là người đi mua, consumer là người sử dụng. Hai vai này không phải lúc nào cũng trùng nhau. Trade Marketing tác động lên shopper, vì đó là người đứng trước kệ và ra quyết định.'
      },
      {
        id: 'qtm1_3',
        question: 'Trong Trade Marketing, từ "customer" chỉ đối tượng nào?',
        options: [
          'Người tiêu dùng cuối cùng mua sản phẩm về dùng',
          'Các đối tác trung gian trong kênh: nhà phân phối, đại lý, nhà bán lẻ, chuỗi siêu thị',
          'Nhân viên bán hàng tại điểm bán',
          'Agency thiết kế và sản xuất POSM'
        ],
        correct: 1,
        explanation:
          'Đây là điểm dễ nhầm nhất. Trong Trade, "customer" không phải người tiêu dùng cuối mà là các đối tác đưa hàng đến tay shopper. Trade phải phục vụ cả customer (để họ nhập hàng và ưu tiên trưng bày) lẫn shopper (để họ chọn mua).'
      },
      {
        id: 'qtm1_4',
        question: 'Vì sao nói Trade Marketing là nghề cạnh tranh trực tiếp trên con số?',
        options: [
          'Vì lương thưởng phụ thuộc hoàn toàn vào doanh số cá nhân',
          'Vì phải làm báo cáo hằng ngày cho ban giám đốc',
          'Vì mọi hoạt động cuối cùng đều phải quy về doanh số tại điểm bán, chu kỳ đánh giá ngắn theo tháng và quý',
          'Vì chỉ được dùng Excel chứ không được dùng phần mềm khác'
        ],
        correct: 2,
        explanation:
          'Khác với Brand có chu kỳ tính bằng năm và đo bằng chỉ số nhận thức, Trade bị đánh giá theo tháng và quý trên con số tiêu thụ thật. Hoạt động đẹp mà không ra sell-out vẫn bị coi là thất bại.'
      }
    ]
  },

  /* ================= CHUYÊN ĐỀ 02 ================= */
  {
    id: 'trade-02',
    number: 2,
    title: 'Bốn Kênh Phân Phối',
    subtitle: 'Ngôn ngữ nền của nghề — học trước mọi thứ khác',
    description:
      'Không hiểu kênh thì không đọc nổi một bản mô tả công việc Trade. Đây là bài học đầu tiên, học trước mọi thứ khác.',
    icon: 'Network',
    badge: 'Ngôn Ngữ Nền',
    duration: '65 phút',
    lessonsCount: 3,
    quizCount: 4,
    sections: [
      {
        id: 'tm2-s1',
        title: 'GT và MT — hai kênh truyền thống của thị trường Việt Nam',
        content: `### GT — General Trade (Kênh truyền thống)

Tạp hoá, chợ, cửa hàng nhỏ lẻ. Số lượng điểm bán rất lớn, phân tán khắp nơi, quan hệ với chủ tiệm mang tính cá nhân.

**Đặc trưng: chạy bằng chân, phủ rộng.**

- Doanh số mỗi điểm nhỏ nhưng cộng lại rất lớn
- Chủ tiệm ảnh hưởng mạnh tới quyết định của shopper
- Shopper mua lẻ, mua gấp, quyết định nhanh
- Chương trình phù hợp: quà tặng kèm, gói nhỏ, thưởng cho chủ tiệm

### MT — Modern Trade (Kênh hiện đại)

Siêu thị, đại siêu thị, cửa hàng tiện lợi (CVS). Ít điểm bán hơn nhưng doanh số mỗi điểm lớn, đàm phán theo hợp đồng và kế hoạch năm.

**Đặc trưng: chạy bằng số, đàm phán.**

- Mọi thứ có hợp đồng: phí trưng bày, vị trí kệ, suất khuyến mãi
- Shopper đi mua theo kế hoạch, mua số lượng lớn, có so sánh giá
- Chương trình phù hợp: combo, mua nhiều giảm giá, trưng bày đầu kệ
- Cần biết đọc dữ liệu và làm kế hoạch năm (JBP)

### Vì sao phải phân biệt

Cùng một sản phẩm nhưng chương trình ở hai kênh phải khác nhau, vì shopper ở hai kênh có hành vi khác nhau và cơ chế chi phí cũng khác nhau. Áp một chương trình chung cho cả hai là dấu hiệu của người chưa hiểu kênh.

### Đường đi của hàng hoá ở hai kênh

Hiểu đường đi thì hiểu vì sao chi phí khác nhau.

**Ở GT:** Công ty → Nhà phân phối → DSR đi tuyến → Tạp hoá → Shopper

Nhà phân phối bỏ vốn ôm hàng và chịu rủi ro tồn kho cho cả khu vực. DSR là người thực sự gặp chủ tiệm mỗi tuần. Mọi chương trình đều phải đi qua tay DSR mới tới được điểm bán.

**Ở MT:** Công ty → Trung tâm phân phối của chuỗi → Từng cửa hàng → Shopper

Chuỗi tự lo khâu phân phối nội bộ, đổi lại họ thu phí ở nhiều điểm: phí vào kệ, phí trưng bày, phí hỗ trợ khuyến mãi. Đàm phán diễn ra ở cấp mua hàng của chuỗi, không phải ở từng cửa hàng.

### Hệ quả với người làm Trade

- **Ở GT, chương trình phải đơn giản.** DSR chỉ có khoảng hai phút đứng ở cửa tiệm để giải thích. Cơ chế có bốn điều kiện lồng nhau nghe rất chặt trên giấy nhưng không ai bán được.
- **Ở MT, chương trình phải chốt sớm.** Chuỗi lên kế hoạch trước nhiều tuần và có lịch nộp hồ sơ chương trình cố định. Trễ hạn là mất suất, không thương lượng lại được.
- **Chi phí ở GT nằm ở khâu tiếp cận** (phủ được bao nhiêu điểm), còn **chi phí ở MT nằm ở khâu vị trí** (giành được chỗ nào trên kệ).

### CVS — nhánh riêng cần biết

Cửa hàng tiện lợi thường được xếp vào MT nhưng hành vi shopper lại gần GT hơn: mua lẻ, mua gấp, mua vì đang ở gần. Điểm khác biệt lớn nhất là diện tích kệ rất hẹp, nên số SKU được nhận vào rất ít và cạnh tranh để có mặt gay gắt hơn siêu thị lớn.

Gói nhỏ, sản phẩm ăn liền và đồ uống lạnh là nhóm hợp kênh này nhất.`,
        takeaway:
          'GT phủ rộng bằng số lượng điểm bán và quan hệ cá nhân với chủ tiệm; MT tập trung doanh số vào ít điểm và vận hành bằng hợp đồng, dữ liệu.'
      },
      {
        id: 'tm2-s2',
        title: 'E-commerce và HoReCa — hai kênh đang lên',
        content: `### EC — E-commerce (Thương mại điện tử)

Shopee, Lazada, TikTok Shop, và sàn của chính thương hiệu.

**Đặc trưng: chạy bằng dữ liệu.**

Điều thú vị của kênh này là mọi khái niệm Trade truyền thống đều có bản tương đương:

- **"Kệ hàng"** trở thành trang sản phẩm
- **"Trưng bày"** trở thành thứ hạng tìm kiếm và banner
- **"Share of shelf"** trở thành tỷ lệ hiển thị trong kết quả tìm kiếm
- **"Hết hàng trên kệ"** trở thành sản phẩm bị ẩn khỏi kết quả

Ưu thế lớn nhất: mọi thứ đều đo được theo thời gian thực, không phải chờ đi store check.

### HoReCa — Hotel, Restaurant, Café

Khách sạn, nhà hàng, quán café. Sản phẩm được tiêu thụ ngay tại chỗ.

**Đặc trưng: chạy bằng quan hệ.**

- Trọng tâm là menu, combo và trải nghiệm tại bàn
- Người quyết định nhập hàng là chủ quán hoặc bếp trưởng, không phải shopper
- Chu kỳ đàm phán dài, nhưng một khi vào được thì rất bền
- Ngành đồ uống, bia và nguyên liệu pha chế sống chủ yếu ở kênh này

### Lưu ý cho người mới

Đừng cố học hết bốn kênh cùng lúc. Chọn một kênh gắn với ngành hàng bạn muốn theo, học sâu kênh đó trước. Người phỏng vấn đánh giá cao ứng viên hiểu sâu một kênh hơn là biết sơ sơ cả bốn.

### Ba chỉ số riêng của kênh E-commerce

Người từ Trade truyền thống sang sàn cần đổi tên chỉ số chứ không phải học lại từ đầu:

- **Tỷ lệ hiển thị trong tìm kiếm** thay cho share of shelf. Gõ từ khoá ngành hàng, đếm xem trong 20 kết quả đầu có bao nhiêu sản phẩm của mình.
- **Tình trạng còn hàng** thay cho OSA. Hết hàng trên sàn nặng hơn ngoài kệ: thuật toán hạ thứ hạng, nên khi có hàng trở lại vẫn mất thêm thời gian mới leo về vị trí cũ.
- **Tỷ lệ chuyển đổi trang sản phẩm** — thứ không có bản tương đương ngoài kệ. Đây là chỗ ảnh, tiêu đề và đánh giá quyết định, tương tự vai trò của bao bì trong cửa hàng.

### HoReCa — cửa vào thường bị bỏ qua

Kênh này ít người mới nhắm tới, nên cạnh tranh ứng tuyển nhẹ hơn. Ba điều cần biết trước:

- **Bán cho quán không giống bán cho cửa hàng.** Quán mua nguyên liệu để chế biến, nên quan tâm định lượng trên mỗi phần, độ ổn định chất lượng và giá vốn trên mỗi ly hoặc mỗi đĩa.
- **Đổi nhà cung cấp rất tốn kém với quán.** Phải đổi công thức món và đào tạo lại nhân viên. Đó là lý do vào được thì bền, mà cũng là lý do vào rất khó.
- **POSM ở HoReCa khác hẳn:** menu, standee để bàn, ly có in thương hiệu, ô dù ngoài trời, bảng hiệu. Nhiều thứ trong đó nằm lại lâu dài chứ không tháo theo chương trình.

### Chọn kênh nào để học sâu

Gợi ý theo ngành hàng bạn muốn theo:

1. **Sữa, bánh kẹo, gia vị, hoá mỹ phẩm** — học MT trước, vì đây là nơi phần lớn ngân sách và dữ liệu nằm ở đó.
2. **Nước giải khát, bia, thuốc lá, mì gói** — học GT trước, vì độ phủ là chiến trường chính.
3. **Mỹ phẩm, thực phẩm chức năng, đồ gia dụng nhỏ** — học E-commerce trước.
4. **Nguyên liệu pha chế, bia, nước đóng chai** — học HoReCa trước.`,
        takeaway:
          'E-commerce là Trade Marketing vận hành bằng dữ liệu, mọi khái niệm truyền thống đều có bản tương đương. HoReCa vận hành bằng quan hệ với chủ quán, chu kỳ dài nhưng bền.'
      },
      {
        id: 'tm2-s3',
        title: 'Bài tập thực địa đầu tiên',
        content: `### Đây là bài tập quan trọng nhất của cả khoá

Trade Marketing là nghề không học được hết trong lớp. Bài tập dưới đây làm được ngay tuần này, không tốn tiền, và tạo ra dữ liệu thật để bạn nói chuyện khi phỏng vấn.

### Các bước

1. **Chọn một ngành hàng** bạn thực sự quan tâm: sữa, bia, mì gói, mỹ phẩm, bánh kẹo...
2. **Đi một siêu thị và một tạp hoá** gần nhà, trong cùng một buổi để so sánh công bằng
3. **Chọn một nhãn hàng cụ thể** trong ngành đó để bám theo
4. **Ghi lại ở cả hai nơi:** vị trí kệ, giá bán thực tế, POSM đang treo, chương trình khuyến mãi đang chạy
5. **Chụp ảnh kệ** ở cả hai nơi để đối chiếu

### Ba câu hỏi phải trả lời được

- Cùng một nhãn hàng đó, cách trưng bày ở hai nơi khác nhau thế nào?
- Khuyến mãi có giống nhau không? Nếu khác thì khác ở dạng nào?
- **Vì sao lại khác?**

Câu thứ ba là câu quan trọng nhất. Trả lời được câu đó nghĩa là bạn đã bắt đầu tư duy chiến lược kênh chứ không chỉ quan sát bề mặt.

### Gợi ý hướng trả lời

Khác nhau vì shopper ở hai kênh có hành vi khác nhau, cơ chế chi phí khác nhau, và quyền đàm phán của nhà bán lẻ cũng khác nhau. Ở MT nhà bán lẻ có quyền lực lớn nên chi phí trưng bày cao; ở GT quyền lực nằm ở chỗ chủ tiệm chịu bày hàng của ai.

### Mẫu biên bản store check để chép lại

Dùng đúng sáu cột này cho mỗi nhãn hàng quan sát, mỗi lần đi một dòng. Sau ba tháng bạn có một bảng dữ liệu thật, thứ mà gần như không ứng viên mới nào mang tới buổi phỏng vấn:

1. **Ngày đi và loại điểm bán** — ghi rõ siêu thị, cửa hàng tiện lợi hay tạp hoá, kèm khu vực.
2. **Vị trí kệ và số facing** — tầng thứ mấy tính từ dưới lên, chiếm bao nhiêu mặt tiền sản phẩm.
3. **Giá bán thực tế trên kệ** — giá đang niêm yết tại điểm bán, không phải giá đề xuất của hãng.
4. **Tình trạng hàng** — đủ, vơi, hay trống. Có hàng cận date không.
5. **POSM đang có** — loại gì, đặt đúng chỗ không, còn nguyên vẹn không.
6. **Chương trình khuyến mãi** — của mình và của ba nhãn cạnh tranh gần nhất, ghi rõ cơ chế.

Luôn kèm ảnh chụp cùng một góc qua các lần đi, để so sánh được theo thời gian.

### Ba lỗi làm hỏng buổi store check đầu tiên

- **Chỉ chụp ảnh mà không ghi số.** Ba tháng sau mở ảnh ra không nhớ giá bao nhiêu, có bao nhiêu facing. Ảnh là bằng chứng, con số mới là dữ liệu.
- **Đi mỗi nơi một ngày khác nhau.** Khuyến mãi thay đổi theo tuần, nên so sánh hai điểm bán ở hai thời điểm khác nhau là so sánh sai. Đi trong cùng một buổi.
- **Chỉ nhìn nhãn của mình.** Không có số của đối thủ thì không biết 20,0% share of shelf là tốt hay tệ.

### Nâng cấp bài tập lên một bậc

Khi đã đi quen, thêm một việc: **đứng quan sát shopper 15 phút** tại khu vực ngành hàng đó. Ghi lại họ dừng bao lâu, cầm sản phẩm nào lên trước, có đọc bao bì không, cuối cùng bỏ vào giỏ món nào.

Đây là dữ liệu shopper insight thô, và là thứ phân biệt người làm chiến lược với người chỉ ghi chép hiện trạng.`,
        takeaway:
          'So sánh cùng một nhãn hàng ở siêu thị và tạp hoá là bài học đầu tiên về chiến lược kênh. Câu hỏi quan trọng nhất không phải "khác thế nào" mà là "vì sao lại khác".'
      }
    ],
    quiz: [
      {
        id: 'qtm2_1',
        question: 'Đặc trưng vận hành của kênh GT (General Trade) là gì?',
        options: [
          'Ít điểm bán, doanh số mỗi điểm lớn, đàm phán theo hợp đồng năm',
          'Số điểm bán rất lớn và phân tán, quan hệ với chủ tiệm mang tính cá nhân',
          'Mọi chỉ số đo được theo thời gian thực',
          'Sản phẩm được tiêu thụ ngay tại chỗ, trọng tâm là menu và combo'
        ],
        correct: 1,
        explanation:
          'GT là kênh truyền thống gồm tạp hoá, chợ, cửa hàng nhỏ lẻ. Đặc trưng là chạy bằng chân và phủ rộng: doanh số mỗi điểm nhỏ nhưng số lượng điểm bán rất lớn.'
      },
      {
        id: 'qtm2_2',
        question: 'Vì sao cùng một sản phẩm lại có chương trình khuyến mãi khác nhau ở siêu thị và tạp hoá?',
        options: [
          'Vì luật quy định mỗi loại cửa hàng một mức khuyến mãi riêng',
          'Vì siêu thị luôn được ưu tiên hơn tạp hoá',
          'Vì shopper ở hai kênh có hành vi khác nhau, đồng thời cơ chế chi phí và quyền đàm phán cũng khác nhau',
          'Vì hàng ở tạp hoá thường cận date hơn'
        ],
        correct: 2,
        explanation:
          'Ở MT shopper đi mua theo kế hoạch, mua số lượng lớn, có so sánh giá nên hợp với combo và trưng bày đầu kệ. Ở GT shopper mua lẻ, mua gấp, chịu ảnh hưởng của chủ tiệm nên hợp với quà tặng kèm, gói nhỏ và chương trình thưởng cho chủ tiệm.'
      },
      {
        id: 'qtm2_3',
        question: 'Trên kênh E-commerce, khái niệm "trưng bày" tương đương với thứ gì?',
        options: [
          'Thứ hạng tìm kiếm và vị trí banner trên sàn',
          'Số lượng ảnh trong trang sản phẩm',
          'Số lượng nhân viên trực chat',
          'Thời gian giao hàng cam kết'
        ],
        correct: 0,
        explanation:
          'Trên sàn, "kệ hàng" là trang sản phẩm và "trưng bày" trở thành thứ hạng tìm kiếm cùng vị trí banner. Ưu thế của kênh này là mọi thứ đo được theo thời gian thực thay vì phải đi store check.'
      },
      {
        id: 'qtm2_4',
        question: 'Ở kênh HoReCa, ai là người quyết định sản phẩm có được nhập hay không?',
        options: [
          'Khách hàng ngồi tại bàn',
          'Chủ quán hoặc bếp trưởng',
          'Nhà phân phối khu vực',
          'Nhân viên phục vụ'
        ],
        correct: 1,
        explanation:
          'HoReCa chạy bằng quan hệ. Người quyết định nhập hàng là chủ quán hoặc bếp trưởng chứ không phải shopper. Chu kỳ đàm phán dài nhưng một khi vào được thì rất bền.'
      }
    ]
  },

  /* ================= CHUYÊN ĐỀ 03 ================= */
  {
    id: 'trade-03',
    number: 3,
    title: 'Sáu Khối Kiến Thức & Bộ Chỉ Số',
    subtitle: 'Lộ trình học và từ điển thuật ngữ phải thuộc',
    description:
      'Sáu khối kiến thức xếp theo thứ tự nên học, cộng với bộ chỉ số Trade phải học thuộc trước khi đi phỏng vấn.',
    icon: 'Layers',
    badge: 'Kiến Thức Lõi',
    duration: '80 phút',
    lessonsCount: 4,
    quizCount: 4,
    sections: [
      {
        id: 'tm3-s1',
        title: 'Sáu khối kiến thức, xếp theo thứ tự nên học',
        content: `### Đừng nhảy cóc — khối sau dựa trên khối trước

#### 01. Cấu trúc kênh phân phối

GT / MT / eCom / HoReCa: vai trò từng kênh, biên lợi nhuận khác nhau, vì sao cùng một sản phẩm lại có chương trình khác nhau ở mỗi kênh.

**Không có khối này, mọi khối sau đều vô nghĩa.**

#### 02. Shopper Insight

Tâm lý và hành vi người mua tại điểm bán. Quyết định nào được lên kế hoạch từ nhà, quyết định nào phát sinh tại kệ. Vì sao vị trí ngang tầm mắt lại đắt giá.

**Đây là thứ phân biệt người làm chiến lược với người chỉ thực thi.**

#### 03. Bộ chỉ số Trade

Sell-in, sell-out, coverage, share of shelf, OSA, ROI chương trình. Học đọc trước, học tính sau, học tối ưu sau cùng.

**Trade là nghề cạnh tranh trên con số — không đọc được số là không tồn tại được.**

#### 04. Promotion Mechanic

Các dạng khuyến mãi: chiết khấu, combo, tích lũy, quà tặng kèm, sampling. Khi nào dùng dạng nào, và tác dụng phụ lên giá bán cùng tồn kho.

**Chọn sai mechanic có thể phá giá cả ngành hàng.**

#### 05. POSM & Visual Merchandising

Standee, wobbler, kệ trưng bày, poster, hangtag. Tiêu chuẩn trưng bày, quy trình brief thiết kế, đặt sản xuất và đo mức độ tuân thủ tại điểm bán.

**Phần dễ vào nghề nhất — làm được ngay từ vị trí intern.**

#### 06. Excel cho Trade

Pivot Table, VLOOKUP/XLOOKUP, dựng bảng theo dõi sell-out theo kênh, tính ROI chương trình, làm báo cáo định kỳ.

**Xuất hiện gần như trong mọi bản mô tả công việc.**

### Học POSM trước — vì sao đây là cửa vào dễ nhất

Khối 05 là nơi người mới đóng góp được ngay từ tuần đầu, vì phần lớn công việc là quy trình chứ không phải phán đoán. Bốn việc cụ thể:

1. **Viết brief cho agency** — nêu rõ mục tiêu chương trình, thông điệp chính, kích thước theo từng loại điểm bán, số lượng, hạn giao và thông tin bắt buộc phải có trên vật phẩm.
2. **Đặt sản xuất** — so sánh báo giá, duyệt bản in thử, kiểm tra màu và lỗi chính tả trước khi chạy hàng loạt.
3. **Điều phối rollout** — chia số lượng theo khu vực, gửi kèm hướng dẫn treo, chốt ngày đồng loạt lên.
4. **Kiểm tra tuân thủ** — đi mẫu một số điểm bán, đối chiếu ảnh với tiêu chuẩn, tính tỷ lệ tuân thủ.

Việc 1 và 2 học được trong vài tuần. Việc 4 là chỗ tạo ra giá trị thật, vì rất nhiều nơi phát POSM xong không ai kiểm tra.

### Bốn lỗi POSM tốn tiền nhất

- **Sai kích thước so với ô kệ đã đàm phán.** In xong không treo được, bỏ toàn bộ lô.
- **Giao trễ so với ngày chương trình bắt đầu.** Vật phẩm về sau khi khuyến mãi đã chạy được nửa kỳ thì gần như vô dụng.
- **Không tính chi phí sản xuất vào ROI chương trình.** Báo cáo đẹp hơn thực tế, và lần sau lặp lại sai lầm với ngân sách lớn hơn.
- **Phát rồi không kiểm tra.** Đây là lỗi phổ biến nhất: tiền đã chi, hàng đã về điểm bán, nhưng không ai biết có bao nhiêu phần trăm thực sự được treo đúng chỗ.`,
        takeaway:
          'Sáu khối xếp theo thứ tự phụ thuộc: cấu trúc kênh là nền, shopper insight phân biệt chiến lược với thực thi, POSM là cửa vào dễ nhất cho người mới.'
      },
      {
        id: 'tm3-s2',
        title: 'Từ điển chỉ số — phần một',
        content: `### Những từ sẽ xuất hiện trong mọi cuộc trò chuyện chuyên môn

Không hiểu là mất điểm ngay câu đầu.

#### Sell-in

Lượng hàng công ty bán được cho nhà phân phối hoặc nhà bán lẻ. Hàng đã rời kho công ty.

#### Sell-out

Lượng hàng thực sự được shopper mua khỏi kệ. **Đây mới là con số phản ánh nhu cầu thật.**

#### Coverage — Độ phủ

Tỷ lệ điểm bán có hàng của mình trên tổng số điểm bán trong khu vực.

#### SOS — Share of Shelf

Tỷ lệ diện tích kệ nhãn hàng chiếm được so với toàn ngành hàng tại điểm bán. Chỉ số này tương quan khá chặt với thị phần: hàng chiếm nhiều chỗ thì dễ được nhìn thấy, dễ được chọn, và ít bị hết hàng hơn.

#### OSA — On Shelf Availability

Tỷ lệ thời gian sản phẩm thực sự có mặt trên kệ. **Hết hàng bằng mất doanh số vĩnh viễn** — shopper đứng trước kệ sẽ mua của đối thủ chứ không quay lại lần sau.

#### POSM — Point of Sale Materials

Toàn bộ vật phẩm quảng cáo tại điểm bán: standee, wobbler, kệ trưng bày, poster, hangtag.

#### POP — Point of Purchase

Nơi diễn ra quyết định mua, cũng là nơi mọi hoạt động marketing hội tụ.

**Phân biệt nhanh: POP là chỗ, POSM là đồ.** Dùng lẫn hai từ này là dấu hiệu học vẹt định nghĩa mà chưa từng ra điểm bán.

### Nhận mặt POSM — gọi đúng tên từng loại

Dưới một chữ viết tắt là những thứ khác hẳn nhau về chi phí và vòng đời. Chia theo chỗ chúng chiếm:

**Nhóm gắn trên kệ — rẻ, thay nhanh, dễ bị gỡ**

- **Wobbler:** thẻ nhỏ gắn mép kệ, rung rung khi có người đi qua để hút mắt.
- **Thẻ giá và shelf talker:** dải giấy chạy dọc mép kệ, ghi giá hoặc thông điệp khuyến mãi.
- **Hangtag:** thẻ treo trực tiếp trên cổ chai hoặc thân sản phẩm, thường dùng khi có quà tặng kèm.

**Nhóm chiếm sàn — đắt hơn nhiều, nhưng giành được chỗ kệ chung không cho**

- **Standee:** bảng đứng tự do đặt lối đi hoặc cửa vào. Dựng nhanh nhưng dễ bị đẩy vào góc khuất.
- **Dump bin:** thùng đổ đống giữa lối đi, dùng cho hàng khuyến mãi và mua ngẫu hứng.
- **Kệ trưng bày riêng:** kệ của riêng nhãn hàng, thường đặt tại quầy thanh toán. Tốn kém nhất trong nhóm.

**Nhóm bao phủ không gian**

- **Poster, banner, decal sàn, cổng chào:** định hình không khí cả khu vực, hay dùng cho chương trình theo mùa.

### Đo POSM bằng gì

Đếm số lượng đã phát không nói lên điều gì. Chỉ số thật là **tỷ lệ tuân thủ**:

**Tỷ lệ tuân thủ = Số điểm bán treo đúng và đủ / Tổng số điểm bán đã phát POSM**

Giả sử phát cho 500 điểm bán, đi kiểm tra mẫu 60 điểm thì 42 điểm treo đúng vị trí và còn nguyên vẹn. Tỷ lệ tuân thủ là 42 chia 60, bằng 70,0%. Nghĩa là gần một phần ba chi phí sản xuất không tạo ra tác dụng nào.

Khi kiểm tra, ghi rõ ba mức: **có và đúng chỗ**, **có nhưng sai chỗ hoặc hỏng**, **không có**. Ba mức này dẫn tới ba cách xử lý hoàn toàn khác nhau.`,
        takeaway:
          'Sell-out là con số phản ánh nhu cầu thật, không phải sell-in. OSA quan trọng vì hết hàng đồng nghĩa mất doanh số vĩnh viễn chứ không phải hoãn lại.'
      },
      {
        id: 'tm3-s3',
        title: 'Từ điển chỉ số — phần hai',
        content: `#### SKU — Stock Keeping Unit

Mã đơn vị hàng hoá. Một nhãn hàng có thể có hàng chục SKU khác nhau theo dung tích, hương vị, quy cách đóng gói.

#### ROI chương trình

Doanh thu tăng thêm chia cho chi phí bỏ ra. **Câu hỏi cuối cùng của mọi hoạt động Trade.**

Lưu ý quan trọng: phải tính trên phần doanh thu **tăng thêm** so với mốc nền, không phải tổng doanh thu trong kỳ chạy chương trình. Nhầm chỗ này là báo cáo nào cũng đẹp.

#### A&P — Advertising & Promotion

Ngân sách dành cho quảng cáo và khuyến mãi. Đây là khoản mà Brand và Trade thường phải tranh nhau, nên biết cách bảo vệ phần của mình bằng số liệu là kỹ năng sống còn.

#### Trade Calendar

Lịch chương trình theo tháng, quý, năm, đồng bộ giữa Marketing, Sales và Supply Chain. Không có lịch này thì kho không kịp chuẩn bị hàng, và hai phòng ban sẽ chạy hai hướng.

#### JBP — Joint Business Plan

Kế hoạch kinh doanh chung ký với khách hàng lớn ở kênh MT. Thường bao gồm cam kết doanh số, mức đầu tư trưng bày, lịch khuyến mãi và điều khoản thưởng phạt cho cả năm.

### Cách học thuộc hiệu quả

Đừng học vẹt định nghĩa. Với mỗi chỉ số, tự trả lời: **chỉ số này tăng thì điều gì tốt lên, và nó có thể bị làm đẹp bằng cách nào?** Hiểu được mặt trái mới là hiểu thật.

### Mặt trái của từng chỉ số — bảng tự kiểm

Áp dụng đúng câu hỏi trên cho sáu chỉ số quan trọng nhất:

- **Sell-in** — làm đẹp bằng cách đẩy hàng vào kho nhà phân phối cuối kỳ. Kiểm chứng bằng cách so với sell-out cùng kỳ.
- **Sell-out** — khó làm đẹp nhất, nên đây là con số đáng tin nhất. Chỉ méo khi kỳ có khuyến mãi sâu kéo doanh số của kỳ sau về.
- **Coverage** — làm đẹp bằng cách tính cả điểm bán chỉ nhập một lần rồi thôi. Kiểm chứng bằng số điểm bán có mua lặp lại.
- **Share of shelf** — làm đẹp bằng cách đo tại vài điểm bán tốt nhất rồi suy ra cả khu vực. Kiểm chứng bằng mẫu ngẫu nhiên.
- **OSA** — làm đẹp bằng cách chỉ đi kiểm tra vào ngày vừa châm hàng. Kiểm chứng bằng cách đi vào các thời điểm khác nhau trong tuần.
- **ROI chương trình** — làm đẹp bằng cách lấy tổng doanh thu thay vì phần tăng thêm, hoặc bỏ quên chi phí sản xuất POSM.

### Cách tính ROI đúng, làm một lần bằng số cụ thể

Giả sử một chương trình trưng bày kéo dài một tháng:

1. **Mốc nền** — doanh số trung bình ba tháng trước khi chạy: 400.000.000 đồng mỗi tháng.
2. **Doanh số tháng chạy chương trình:** 520.000.000 đồng.
3. **Phần tăng thêm:** 520.000.000 − 400.000.000 = 120.000.000 đồng.
4. **Tổng chi phí:** phí trưng bày 70.000.000 đồng, sản xuất POSM 20.000.000 đồng, nhân sự triển khai 10.000.000 đồng — cộng lại 100.000.000 đồng.
5. **ROI:** (120.000.000 − 100.000.000) chia 100.000.000, bằng **0,2 lần**.

Nếu lấy nhầm tổng doanh thu 520.000.000 đồng làm tử số, ROI hiện lên 4,2 lần — sai gấp hơn hai mươi lần. Đây chính là lỗi mà câu hỏi kiểm tra của chuyên đề này nhắm tới.

**Chưa xong ở bước 5.** Còn phải kiểm tra tác dụng phụ: tháng sau doanh số có tụt xuống dưới mốc nền không (dấu hiệu chương trình chỉ kéo nhu cầu về sớm), tồn kho ở kênh ra sao, và giá bán trên kệ có bị neo ở mức khuyến mãi không.

### Bốn thứ phải chốt TRƯỚC khi chạy bất kỳ chương trình nào

1. **Mốc so sánh** — lấy doanh số kỳ nào làm nền, thống nhất với Sales và Finance ngay từ đầu.
2. **Mục tiêu cụ thể** — tăng bao nhiêu phần trăm sell-out, tại bao nhiêu điểm bán.
3. **Cách đo** — số lấy từ đâu, ai lấy, tần suất nào.
4. **Ngưỡng dừng** — dấu hiệu nào thì cắt chương trình giữa chừng.

Chốt sau khi có kết quả thì con số nào cũng biện minh được.`,
        takeaway:
          'ROI chương trình phải tính trên doanh thu tăng thêm so với mốc nền, không phải tổng doanh thu trong kỳ. Với mỗi chỉ số, luôn hỏi thêm nó có thể bị làm đẹp bằng cách nào.'
      },
      {
        id: 'tm3-s4',
        title: 'Về Nielsen và Kantar — rào cản của người mới',
        content: `### Vấn đề có thật

Nhiều tin tuyển dụng kênh MT yêu cầu kinh nghiệm với **Nielsen Retail Audit** hoặc **Kantar Worldpanel**. Theo dữ liệu phân tích tin tuyển dụng tháng 7/2026, con số này lên tới khoảng 78% với các vị trí kênh MT.

Đây là công cụ trả phí, chỉ doanh nghiệp mới có license. **Bạn không thể tự học ở nhà.**

### Đừng để điều này làm nản

Đây là rào cản về quyền truy cập công cụ, không phải rào cản về năng lực. Cách đi vòng:

- **Vào doanh nghiệp Việt hoặc chuỗi bán lẻ nội địa trước.** Nhóm này thường không đòi Nielsen/Kantar và chấp nhận nền Event hoặc Activation.
- **Lấy nền thực chiến 1-2 năm**, hiểu chắc cấu trúc kênh và bộ chỉ số.
- **Tiếp cận công cụ sau**, khi đã vào được doanh nghiệp có license. Học đọc dữ liệu Retail Audit mất vài tuần nếu đã hiểu bản chất chỉ số.

### Điều nhà tuyển dụng thực sự tìm

Yêu cầu Nielsen trong tin tuyển dụng thường là cách viết tắt cho "biết đọc dữ liệu thị trường và ra quyết định từ số". Nếu bạn chứng minh được năng lực đó bằng dữ liệu tự thu thập từ store check, nhiều nhà tuyển dụng sẵn sàng bỏ qua phần công cụ.

### Hai công cụ này khác nhau ở đâu

Biết để không nói nhầm khi được hỏi:

- **Nielsen Retail Audit** đo phía cửa hàng: hàng bán ra bao nhiêu, giá bao nhiêu, chiếm bao nhiêu diện tích kệ, có hết hàng không. Dữ liệu lấy từ mẫu điểm bán.
- **Kantar Worldpanel** đo phía hộ gia đình: ai mua, mua bao lâu một lần, mua thêm hay đổi từ nhãn nào sang. Dữ liệu lấy từ nhật ký mua sắm của các hộ tham gia.

Nói gọn: **Nielsen trả lời "bán được bao nhiêu", Kantar trả lời "ai đang mua và vì sao đổi".** Câu hỏi kinh doanh khác nhau thì dùng công cụ khác nhau.

### Nguồn dữ liệu miễn phí dùng được ngay

Trong lúc chưa có license, đây là những thứ tự làm được:

- **Dữ liệu store check của chính bạn.** Quy mô nhỏ nhưng là dữ liệu sơ cấp, và bạn hiểu rõ nó được thu thập thế nào — điều mà nhiều người dùng Nielsen không nói được.
- **Dữ liệu công khai trên sàn thương mại điện tử.** Thứ hạng tìm kiếm, số lượt đánh giá, giá bán theo thời gian đều xem được không mất phí.
- **Báo cáo thường niên của doanh nghiệp niêm yết.** Nhiều công ty hàng tiêu dùng công bố cơ cấu doanh thu theo kênh và ngành hàng.
- **Bài phân tích chiến dịch trên báo ngành.** Đọc để hiểu cách người trong nghề lập luận, không phải để lấy số.

### Cách nói về khoảng trống này khi phỏng vấn

Đừng giấu và cũng đừng ghi đại vào hồ sơ là đã biết dùng. Cách nói thẳng và có lợi hơn:

*"Em chưa được dùng Nielsen vì đó là công cụ có license của doanh nghiệp. Nhưng em đã tự thu thập dữ liệu từ store check ở 8 điểm bán trong 3 tháng, đây là bảng số và đây là ba kết luận em rút ra được. Nếu được tiếp cận Retail Audit, em nghĩ mình đọc được sau vài tuần vì bản chất chỉ số thì giống nhau."*

Câu này chuyển cuộc trò chuyện từ chỗ bạn thiếu sang chỗ bạn đã chủ động làm.`,
        takeaway:
          'Nielsen và Kantar là rào cản quyền truy cập công cụ chứ không phải rào cản năng lực. Chuỗi bán lẻ và F&B nội địa là cửa vào dễ hơn nhiều so với FMCG đa quốc gia.'
      }
    ],
    quiz: [
      {
        id: 'qtm3_1',
        question: 'Phân biệt sell-in và sell-out. Vì sao sell-out quan trọng hơn?',
        options: [
          'Sell-in là hàng bán cho shopper, sell-out là hàng bán cho nhà phân phối',
          'Hai từ này cùng nghĩa, chỉ khác cách gọi giữa các công ty',
          'Sell-in là hàng công ty bán cho nhà phân phối, sell-out là hàng shopper thực sự mua khỏi kệ — chỉ sell-out phản ánh nhu cầu thật',
          'Sell-out chỉ dùng cho kênh E-commerce'
        ],
        correct: 2,
        explanation:
          'Sell-in cao mà sell-out thấp nghĩa là hàng đang tồn ở kênh — một quả bom nổ chậm: nhà phân phối sẽ ngừng nhập, có thể phải giảm giá xả hàng, ảnh hưởng cả định vị thương hiệu.'
      },
      {
        id: 'qtm3_2',
        question: 'Share of Shelf là gì và vì sao phải quan tâm?',
        options: [
          'Là tỷ lệ diện tích kệ nhãn hàng chiếm được so với toàn ngành hàng, quan trọng vì tương quan chặt với thị phần',
          'Là số lượng kệ mà công ty tự bỏ tiền lắp đặt tại điểm bán',
          'Là tỷ lệ thời gian sản phẩm có mặt trên kệ',
          'Là số SKU tối đa mà một nhà bán lẻ cho phép trưng bày'
        ],
        correct: 0,
        explanation:
          'Diện tích kệ tương quan khá chặt với thị phần: hàng chiếm nhiều chỗ thì dễ được nhìn thấy, dễ được chọn và ít bị hết hàng hơn. Đây cũng là chỉ số dùng để đàm phán với nhà bán lẻ.'
      },
      {
        id: 'qtm3_3',
        question: 'Khi tính ROI của một chương trình Trade, sai lầm phổ biến nhất là gì?',
        options: [
          'Quên trừ chi phí sản xuất POSM',
          'Tính trên tổng doanh thu trong kỳ chạy thay vì phần doanh thu tăng thêm so với mốc nền',
          'Dùng số liệu sell-in thay vì sell-out',
          'Không quy đổi về cùng đơn vị tiền tệ'
        ],
        correct: 1,
        explanation:
          'Nếu lấy tổng doanh thu trong kỳ chia cho chi phí thì báo cáo nào cũng đẹp, vì phần lớn doanh thu đó vốn dĩ đã xảy ra kể cả không chạy chương trình. Phải so với mốc nền cùng kỳ trước khi có chương trình.'
      },
      {
        id: 'qtm3_4',
        question: 'Người mới chưa có kinh nghiệm Nielsen/Kantar nên đi đường nào?',
        options: [
          'Mua license cá nhân để tự học ở nhà',
          'Bỏ qua kênh MT, chỉ làm GT suốt sự nghiệp',
          'Ghi đại vào CV là đã biết dùng, học sau khi vào làm',
          'Vào doanh nghiệp Việt hoặc chuỗi bán lẻ nội địa trước để lấy nền thực chiến, tiếp cận công cụ sau'
        ],
        correct: 3,
        explanation:
          'Đây là rào cản quyền truy cập công cụ, không phải rào cản năng lực. Chuỗi bán lẻ và F&B nội địa thường không đòi Nielsen/Kantar và chấp nhận nền Event/Activation, là cửa vào dễ hơn nhiều so với FMCG đa quốc gia.'
      }
    ]
  },

  /* ================= CHUYÊN ĐỀ 04 ================= */
  {
    id: 'trade-04',
    number: 4,
    title: 'Lộ Trình Nghề & Thị Trường Tuyển Dụng',
    subtitle: 'Bốn nấc thang và dữ liệu tuyển dụng tháng 7/2026',
    description:
      'Đọc thị trường trước khi chuẩn bị hồ sơ, thay vì chuẩn bị hồ sơ theo tưởng tượng.',
    icon: 'TrendingUp',
    badge: 'Định Hướng',
    duration: '60 phút',
    lessonsCount: 3,
    quizCount: 4,
    sections: [
      {
        id: 'tm4-s1',
        title: 'Bốn nấc thang nghề nghiệp',
        content: `### Mức lương tham khảo theo mặt bằng thị trường quý 2/2026

Con số thay đổi theo ngành hàng, quy mô doanh nghiệp và khu vực. Dùng để định hướng, không dùng để đàm phán cứng.

#### Nấc 1 — Intern / Assistant (0-1 năm)

**Thực tập đến khoảng 12 triệu**

Hỗ trợ hành chính, theo dõi POSM, tổng hợp báo cáo, đi thị trường cùng đội Sales.

Đây là nấc **gần như bắt buộc** với người mới, vì Trade Marketing rất khó tìm khóa đào tạo chuyên sâu — phần lớn kiến thức học được qua thực tế.

#### Nấc 2 — Trade Marketing Executive (1-3 năm)

**Khoảng 12-18 triệu**

Triển khai chương trình khuyến mãi và activation, quản lý POSM, làm việc với nhà cung cấp, theo dõi ngân sách và báo cáo hiệu quả. Bắt đầu được giao một nhãn hàng hoặc một kênh cụ thể.

#### Nấc 3 — Senior / Trade Marketing Lead (3-5 năm)

**Khoảng 18-48 triệu**

Phụ trách một hoặc vài ngành hàng gồm nhiều dòng sản phẩm. Lập kế hoạch kênh, xây trade calendar, đàm phán JBP với khách hàng lớn, dẫn dắt đội ngũ triển khai.

#### Nấc 4 — Manager đến Head of Trade (5 năm trở lên)

**Khoảng 45-70 triệu trở lên**

Chịu trách nhiệm chiến lược thương mại toàn hệ thống, phân bổ ngân sách A&P, cân đối lợi ích giữa Brand, Sales và Finance. Từ đây có thể rẽ sang Commercial Director hoặc General Management.

### Điểm cần biết trước khi chọn nghề

Trade là nghề cạnh tranh trực tiếp trên con số tiêu thụ. Nếu dừng lại không học tiếp, thực tế cạnh tranh sẽ tự đào thải. Đổi lại, đây là một trong những nhánh marketing có **tốc độ thăng tiến nhanh nhất** với người có nền thực chiến tốt.

### Thứ thực sự quyết định việc lên nấc

Không phải số năm kinh nghiệm mà là **phạm vi chịu trách nhiệm**. Bốn nấc trên khác nhau ở bốn thứ:

- **Nấc 1 → Nấc 2:** từ hỗ trợ người khác sang tự chạy trọn một chương trình, có ngân sách riêng và chịu trách nhiệm về kết quả của nó.
- **Nấc 2 → Nấc 3:** từ thực thi chương trình sang lập kế hoạch kênh. Bắt đầu quyết định làm gì chứ không chỉ làm thế nào.
- **Nấc 3 → Nấc 4:** từ một ngành hàng sang toàn hệ thống, và từ tiêu ngân sách sang phân bổ ngân sách giữa các bên.

Dấu hiệu bạn đã sẵn sàng lên nấc tiếp theo: cấp trên bắt đầu hỏi ý kiến bạn trước khi quyết, thay vì giao việc đã quyết xong.

### Hai nhánh rẽ sau nấc 4

- **Nhánh thương mại:** Commercial Director, rồi General Management. Hợp với người thích cân đối lợi ích giữa nhiều bên và làm việc với con số lớn.
- **Nhánh chuyên sâu:** Category Management hoặc Shopper Marketing chuyên trách. Hợp với người thích đào sâu hành vi mua và dữ liệu ngành hàng.

Trade là một trong ít nhánh marketing mở được cả hai đường, vì người làm Trade quen với cả ngôn ngữ của Sales lẫn ngôn ngữ của Marketing.

### Lưu ý về con số lương ở trên

Các dải lương này là mặt bằng tham khảo, thay đổi theo ngành hàng, quy mô doanh nghiệp và khu vực. Chênh lệch giữa doanh nghiệp nội địa và tập đoàn đa quốc gia ở cùng một nấc có thể rất lớn.

**Dùng để định hướng, không dùng để đàm phán cứng.** Trước khi vào bàn thương lượng, kiểm tra lại tin tuyển dụng đang mở ở đúng ngành hàng và đúng khu vực bạn ứng tuyển.`,
        takeaway:
          'Nấc Intern gần như bắt buộc với người mới vì nghề này ít khoá đào tạo chuyên sâu, phần lớn học qua thực tế. Đổi lại tốc độ thăng tiến thuộc nhóm nhanh nhất trong marketing.'
      },
      {
        id: 'tm4-s2',
        title: 'Thị trường đang tuyển gì — dữ liệu tháng 7/2026',
        content: `### Bốn con số cần biết

- **12-18 triệu** — dải lương phổ biến cho vị trí Junior Trade Marketing
- **18-28 triệu** — dải lương phổ biến cho vị trí Mid-level
- **78%** — tỷ lệ tin tuyển dụng kênh MT có yêu cầu Nielsen hoặc Kantar
- **2 năm** — mức kinh nghiệm tối thiểu được yêu cầu phổ biến nhất

Nguồn: phân tích 60 tin tuyển dụng Trade Marketing trên CareerLink quý 2/2026, kết hợp dữ liệu tuyển dụng TopCV, JobsGO, CareerViet và VietnamWorks tháng 7/2026.

### Sáu yêu cầu gần như luôn xuất hiện

1. **Am hiểu kênh** — nắm đặc thù GT, MT, CVS và cách vận hành khác nhau của từng kênh
2. **Quản lý POSM** — brief thiết kế agency, đặt sản xuất, điều phối rollout, kiểm tra tuân thủ trưng bày
3. **Lập kế hoạch** — trade plan theo tháng, quý, năm; trade calendar; phân bổ ngân sách
4. **Phân tích số liệu** — đọc sell-out, tính ROI chương trình, Excel thành thạo
5. **Đi thị trường** — field visit định kỳ, theo dõi đối thủ, ghi nhận hiện trạng điểm bán
6. **Phối hợp đa phòng ban** — làm việc với Sales, Brand, Finance, Supply Chain, Vận hành

### Ba yêu cầu xuất hiện thường xuyên

- **Shopper Marketing** — hiểu tâm lý và hành vi người mua tại điểm bán
- **Nielsen / Kantar** — đọc dữ liệu Retail Audit và Worldpanel, chủ yếu ở kênh MT
- **Đàm phán** — với nhà cung cấp in ấn, POSM, agency và với khách hàng kênh

### Cách dùng danh sách này

Đối chiếu từng dòng với hồ sơ hiện tại của bạn. Dòng nào chưa có bằng chứng thì đó chính là việc cần làm trong 90 ngày tới.

### Cách đọc một tin tuyển dụng Trade cho đúng

Tin tuyển dụng viết theo khuôn, nên phải biết chỗ nào là bắt buộc thật:

- **Phần "Mô tả công việc" mới là thứ đáng đọc kỹ.** Nó cho biết vị trí này thiên về kênh nào, ngành hàng nào, và có phải đi thị trường nhiều không.
- **Phần "Yêu cầu" thường viết rộng hơn thực tế.** Danh sách 10 gạch đầu dòng hiếm khi bắt buộc đủ cả 10.
- **Số năm kinh nghiệm là khoảng thương lượng được**, đặc biệt ở doanh nghiệp nội địa. Thiếu một năm mà có sản phẩm thật mang tới thì vẫn vào vòng phỏng vấn.
- **Tên công cụ cụ thể mới là rào cản thật** — Nielsen, Kantar, hệ thống DMS nội bộ. Đây là thứ không tự học ở nhà được.

### Dịch yêu cầu tuyển dụng sang bằng chứng cần có

Với mỗi yêu cầu, nhà tuyển dụng đang tìm một bằng chứng cụ thể chứ không tìm lời khẳng định:

- "Am hiểu kênh" → nói được đặc thù vận hành của một kênh cụ thể, kèm ví dụ từ store check của chính bạn.
- "Quản lý POSM" → mô tả được quy trình từ brief tới kiểm tra tuân thủ, và biết bốn lỗi tốn tiền nhất.
- "Lập kế hoạch" → có một bản Trade Plan tự viết mang theo.
- "Phân tích số liệu" → dựng được Pivot từ bảng dữ liệu thật và đọc ra được kết luận.
- "Đi thị trường" → có bảng store check nhiều lần đi, kèm ảnh so sánh.
- "Phối hợp đa phòng ban" → kể được một tình huống bạn từng đứng giữa hai bên có mục tiêu lệch nhau.

### Về độ mới của các con số trong bài

Số liệu tuyển dụng ở trên lấy từ phân tích tin đăng quý 2/2026. Thị trường tuyển dụng đổi theo quý, nhất là dải lương và mức kinh nghiệm yêu cầu.

**Trước khi dùng để ra quyết định, hãy tự mở lại các trang tuyển dụng và đọc 20-30 tin đang đăng ở đúng ngành hàng bạn nhắm tới.** Việc này mất khoảng một buổi và cho bức tranh cập nhật hơn bất kỳ bài viết nào.`,
        takeaway:
          'Sáu yêu cầu gần như luôn có: am hiểu kênh, quản lý POSM, lập kế hoạch, phân tích số liệu, đi thị trường, phối hợp đa phòng ban. Đối chiếu từng dòng với hồ sơ để biết mình còn thiếu gì.'
      },
      {
        id: 'tm4-s3',
        title: 'Ngành nào tuyển nhiều nhất và nên vào cửa nào',
        content: `### Thứ tự nhu cầu tuyển dụng

1. **FMCG** dẫn đầu, do số điểm bán lớn và cạnh tranh gay gắt
2. **Đồ uống** — bia, nước giải khát, nguyên liệu pha chế
3. **Mỹ phẩm**
4. **Dược phẩm** — tập trung vào nhà thuốc và phòng khám
5. **Chuỗi bán lẻ và F&B** — nhóm mới nổi lên gần đây

### Lời khuyên cho người mới

**Chuỗi bán lẻ và F&B nội địa là cửa vào dễ hơn nhiều so với FMCG đa quốc gia.** Lý do:

- Thường không đòi kinh nghiệm Nielsen/Kantar
- Chấp nhận nền Event hoặc Activation, vốn là thứ nhiều sinh viên đã có
- Quy mô đội nhỏ nên được làm nhiều việc, học nhanh hơn
- Ít tầng phê duyệt nên thấy được kết quả của quyết định mình đưa ra

### Đánh đổi cần biết trước

Đổi lại, doanh nghiệp nội địa thường có quy trình chưa chuẩn hoá, ít tài liệu đào tạo, và thương hiệu trên CV không mạnh bằng tập đoàn đa quốc gia.

Chiến lược hợp lý cho phần lớn người mới: **vào nội địa lấy nền thực chiến 1-2 năm, sau đó chuyển sang đa quốc gia với hồ sơ đã có số liệu thật.** Đi đường vòng này thường nhanh hơn là chờ cửa thẳng mãi không mở.

### Mỗi ngành đòi hỏi thứ gì khác nhau

Chọn ngành không chỉ theo nhu cầu tuyển mà theo việc bạn hợp với nhịp nào:

- **FMCG** — nhịp nhanh nhất, chu kỳ chương trình tính bằng tháng, số điểm bán rất lớn. Học được nhiều nhất trong thời gian ngắn nhất, đổi lại áp lực cao và phải đi thị trường nhiều.
- **Đồ uống và bia** — mạnh ở GT và HoReCa, nặng phần quan hệ và hoạt động tại chỗ. Mùa vụ rõ rệt, cao điểm lễ Tết cực kỳ căng.
- **Mỹ phẩm** — thiên về trải nghiệm tại điểm bán và tư vấn, POSM đầu tư kỹ hơn, kênh MT và chuỗi chuyên doanh là chính.
- **Dược phẩm** — tập trung nhà thuốc và phòng khám, nhiều ràng buộc pháp lý về nội dung quảng cáo. Nhịp chậm hơn, đòi hỏi cẩn thận hơn.
- **Chuỗi bán lẻ và F&B** — bạn đứng ở phía nhà bán lẻ chứ không phải phía nhãn hàng. Góc nhìn ngược lại, và rất có giá trị nếu sau này quay về phía nhãn hàng.

### Vị trí gần Trade, dùng làm đường vòng

Nếu chưa vào thẳng được Trade Marketing, ba vị trí sau đi qua rất nhanh vì dùng chung phần lớn năng lực:

- **Sales Admin hoặc Sales Support** — nắm được dữ liệu bán hàng và cách kênh vận hành từ bên trong.
- **Nhân viên Activation tại agency** — làm đúng phần triển khai tại điểm bán, tiếp xúc trực tiếp với POSM và shopper.
- **Merchandiser** — đi điểm bán hằng ngày, hiểu kệ hàng ở mức chi tiết nhất mà không vị trí nào khác có được.

Điểm chung: cả ba đều cho bạn dữ liệu thật và câu chuyện thật để kể, thứ mà một ứng viên chỉ có bằng cấp không có.

### Đừng chọn ngành chỉ vì nhu cầu tuyển cao

Nhu cầu tuyển cao thường đi kèm tỷ lệ nghỉ việc cao. Trước khi chọn, tự hỏi hai câu: bạn có thực sự dùng hoặc quan tâm nhóm sản phẩm này không, và bạn có chịu được nhịp làm việc của ngành đó không.

Người làm Trade giỏi thường là người thật sự tò mò về ngành hàng của mình — vì tò mò mới chịu đứng 15 phút quan sát shopper trước một kệ hàng.`,
        takeaway:
          'FMCG tuyển nhiều nhất nhưng khó vào nhất với người mới. Chuỗi bán lẻ và F&B nội địa là cửa vào thực tế hơn: lấy nền 1-2 năm rồi chuyển sang đa quốc gia với hồ sơ đã có số liệu thật.'
      }
    ],
    quiz: [
      {
        id: 'qtm4_1',
        question: 'Vì sao nấc Intern / Assistant gần như bắt buộc với người mới vào Trade Marketing?',
        options: [
          'Vì luật lao động quy định phải thực tập trước khi ký hợp đồng chính thức',
          'Vì nghề này rất khó tìm khoá đào tạo chuyên sâu, phần lớn kiến thức học được qua thực tế',
          'Vì doanh nghiệp muốn trả lương thấp trong năm đầu',
          'Vì cần thời gian để thi lấy chứng chỉ hành nghề'
        ],
        correct: 1,
        explanation:
          'Trade Marketing rất ít khoá đào tạo chuyên sâu. Kiến thức về vận hành kênh, quan hệ với nhà phân phối và xử lý tình huống tại điểm bán gần như chỉ tích lũy được qua thực tế.'
      },
      {
        id: 'qtm4_2',
        question: 'Theo dữ liệu tuyển dụng tháng 7/2026, tỷ lệ tin tuyển dụng kênh MT yêu cầu Nielsen hoặc Kantar là bao nhiêu?',
        options: ['Khoảng 32%', 'Khoảng 50%', 'Khoảng 78%', 'Khoảng 95%'],
        correct: 2,
        explanation:
          'Khoảng 78% tin tuyển dụng kênh MT có yêu cầu này, theo phân tích 60 tin tuyển dụng trên CareerLink quý 2/2026. Đây là lý do người mới nên cân nhắc vào chuỗi bán lẻ hoặc F&B nội địa trước.'
      },
      {
        id: 'qtm4_3',
        question: 'Nhóm ngành nào được xem là cửa vào dễ hơn cho người mới, và vì sao?',
        options: [
          'FMCG đa quốc gia, vì có chương trình management trainee bài bản',
          'Dược phẩm, vì ít cạnh tranh nhất',
          'Chuỗi bán lẻ và F&B nội địa, vì thường không đòi Nielsen/Kantar và chấp nhận nền Event/Activation',
          'Thương mại điện tử, vì tất cả đều làm từ xa'
        ],
        correct: 2,
        explanation:
          'Nhóm này thường không đòi công cụ trả phí, chấp nhận nền Event/Activation vốn là thứ nhiều sinh viên đã có, và quy mô đội nhỏ nên được làm nhiều việc, học nhanh hơn.'
      },
      {
        id: 'qtm4_4',
        question: 'Yêu cầu nào sau đây KHÔNG nằm trong nhóm "gần như luôn có" của tin tuyển dụng Trade Marketing?',
        options: [
          'Quản lý POSM',
          'Đọc dữ liệu Nielsen Retail Audit',
          'Phân tích số liệu và thành thạo Excel',
          'Đi thị trường định kỳ'
        ],
        correct: 1,
        explanation:
          'Nielsen/Kantar thuộc nhóm "thường xuyên" và chủ yếu ở kênh MT (khoảng 78%), không phải nhóm gần như luôn có. Sáu yêu cầu gần như luôn có là: am hiểu kênh, quản lý POSM, lập kế hoạch, phân tích số liệu, đi thị trường, phối hợp đa phòng ban.'
      }
    ]
  },

  /* ================= CHUYÊN ĐỀ 05 ================= */
  {
    id: 'trade-05',
    number: 5,
    title: 'Lấp Khoảng Trống & Kế Hoạch 90 Ngày',
    subtitle: 'Sáu điểm yếu của người mới và cách tự chuẩn bị',
    description:
      'Sáu khoảng trống phổ biến nhất của sinh viên, cách lấp từng cái mà không cần đợi đi làm, và kế hoạch 90 ngày để có sản phẩm mang đi phỏng vấn.',
    icon: 'Rocket',
    badge: 'Thực Hành',
    duration: '70 phút',
    lessonsCount: 3,
    quizCount: 4,
    sections: [
      {
        id: 'tm5-s1',
        title: 'Sáu khoảng trống phổ biến nhất',
        content: `### 1. Không phân biệt được shopper và consumer

Nói về "khách hàng" chung chung. Trong phỏng vấn Trade, đây là lỗi bị nhận ra ngay trong ba phút đầu.

**Cách lấp:** học thuộc ví dụ mẹ mua dầu gội cho con, rồi tự tìm thêm 5 ví dụ khác trong đời sống của chính bạn.

### 2. Chỉ có kinh nghiệm chạy sự kiện, không có tư duy kế hoạch

Kể được đã làm gì, nhưng không nói được vì sao làm và kết quả ra sao. Dừng ở mức thực thi.

**Cách lấp:** với mỗi hoạt động từng làm, viết lại theo mẫu bốn bước — mục tiêu, cách làm, con số kết quả, điều rút ra.

### 3. Hồ sơ không có một con số nào

Ghi "hỗ trợ tổ chức sự kiện", "quản lý fanpage" mà không có quy mô, ngân sách hay kết quả. **Nhà tuyển dụng Trade sống bằng số.**

**Cách lấp:** thêm số vào mọi dòng — bao nhiêu người, bao nhiêu tiền, tăng bao nhiêu phần trăm, trong bao lâu.

### 4. Chưa từng bước vào điểm bán với tư cách người quan sát

Đi siêu thị hàng tuần nhưng chưa từng nhìn kệ hàng bằng con mắt nghề nghiệp.

**Cách lấp:** mỗi tuần một buổi store check. Chụp ảnh kệ, ghi giá, ghi chương trình khuyến mãi của ba nhãn cạnh tranh. Sau ba tháng bạn có dữ liệu thật để nói chuyện.

### 5. Excel dừng ở mức nhập liệu

Biết gõ bảng nhưng không dựng được Pivot, không tính được ROI. Đây là rào cản kỹ thuật rõ ràng nhất.

**Cách lấp:** học đúng bốn thứ — Pivot Table, XLOOKUP, hàm điều kiện, và biểu đồ cơ bản. Đủ dùng cho 90% công việc ở cấp Executive.

### 6. Sức bền và tính linh hoạt

Trade là nghề phải di chuyển nhiều, xuống thị trường, xử lý sự cố ngoài giờ. Nhiều bạn vỡ mộng sau tháng đầu.

**Cách lấp:** trước khi quyết định theo nghề, hãy đi thị trường thật vài buổi. Nếu thấy mệt mà vẫn thấy thú vị thì bạn hợp.

### Mẫu bốn bước để viết lại một hoạt động đã làm

Khoảng trống số 2 và số 3 lấp chung bằng một việc: viết lại mọi thứ đã làm theo đúng khuôn dưới đây.

1. **Mục tiêu** — lúc đó cần đạt điều gì, đo bằng con số nào.
2. **Cách làm** — đã chọn phương án nào và vì sao chọn phương án đó thay vì phương án khác.
3. **Kết quả bằng số** — bao nhiêu người, bao nhiêu tiền, tăng bao nhiêu phần trăm, trong bao lâu.
4. **Điều rút ra** — nếu làm lại thì đổi gì.

**Ví dụ viết lại một dòng hồ sơ:**

Trước: *"Hỗ trợ tổ chức sự kiện cho câu lạc bộ."*

Sau: *"Tổ chức sự kiện tuyển thành viên cho câu lạc bộ 200 người tham dự, ngân sách 8.000.000 đồng, thu về 45 đơn đăng ký — vượt 50% so với mục tiêu 30 đơn. Rút ra: kênh truyền thông trong khoa hiệu quả gấp ba lần đăng bài trên fanpage chung."*

Cùng một việc, nhưng bản sau nói được ba thứ bản trước không nói: quy mô, hiệu quả so với mục tiêu, và khả năng rút kết luận từ số liệu.

### Bốn thứ Excel cần học, không hơn

Khoảng trống số 5 chỉ cần đúng bốn kỹ năng cho 90% công việc ở cấp Executive:

- **Pivot Table** — tổng hợp sell-out theo kênh, theo tháng, theo SKU. Đây là thứ dùng hằng ngày.
- **XLOOKUP hoặc VLOOKUP** — ghép bảng danh mục sản phẩm với bảng doanh số.
- **Hàm điều kiện** (IF, SUMIFS, COUNTIFS) — tính riêng cho nhóm điểm bán có chạy chương trình và nhóm không chạy.
- **Biểu đồ cơ bản** — cột cho so sánh, đường cho xu hướng theo thời gian.

Không cần macro, không cần Power Query ở giai đoạn này. Học sâu bốn thứ trên bằng dữ liệu store check của chính bạn thì vừa học được công cụ vừa có sản phẩm mang đi phỏng vấn.

### Tự chấm điểm sáu khoảng trống

Cho mỗi mục ở trên, tự đánh một trong ba mức: **chưa có gì**, **hiểu nhưng chưa có bằng chứng**, **đã có bằng chứng cụ thể**.

Ô nào ở mức thứ hai là ô dễ lấp nhất — bạn đã hiểu rồi, chỉ còn thiếu một sản phẩm để chứng minh. Bắt đầu từ đó chứ đừng bắt đầu từ ô khó nhất.`,
        takeaway:
          'Năm khoảng trống đầu đều lấp được tại nhà, không cần đợi đi làm. Khoảng trống thứ sáu về sức bền chỉ kiểm chứng được bằng cách đi thị trường thật vài buổi trước khi quyết định.'
      },
      {
        id: 'tm5-s2',
        title: 'Kế hoạch 90 ngày tự chuẩn bị',
        content: `### Dành cho người chưa đi làm hoặc đang làm mảng khác

Không tốn học phí, chỉ tốn kỷ luật.

#### Tháng 1 — Nền tảng

1. Học xong khối kiến thức 1 và 2: cấu trúc kênh và shopper insight
2. Chọn một ngành hàng để theo suốt 90 ngày: sữa, bia, mì, mỹ phẩm...
3. Học thuộc bộ chỉ số Trade ở chuyên đề 03
4. Đọc 2-3 case chiến dịch Trade thật trên Brands Vietnam hoặc báo ngành

**Kết quả cần có:** bản tóm tắt 2 trang gồm cấu trúc kênh của ngành hàng đã chọn và phân tích 1 case.

#### Tháng 2 — Thực địa

1. Đi store check 6-8 buổi: siêu thị, cửa hàng tiện lợi, tạp hoá
2. Ghi chép có cấu trúc: vị trí kệ, giá, POSM, chương trình của 3 nhãn cạnh tranh
3. Chụp ảnh so sánh cùng một nhãn ở hai loại kênh khác nhau
4. Học Excel: Pivot, XLOOKUP, hàm điều kiện

**Kết quả cần có:** store check report có ảnh và bảng số, kèm 1 ghi chú shopper insight rút ra từ quan sát thật.

#### Tháng 3 — Sản phẩm

1. Viết một Trade Plan giả định cho nhãn hàng đã theo dõi
2. Cấu trúc: mục tiêu kênh, mechanic, POSM, ngân sách, KPI
3. Nhờ người đi trước phản biện ít nhất một vòng
4. Viết lại CV: thêm số vào mọi dòng, đưa Trade Plan vào phần thành tích

**Kết quả cần có:** Trade Plan hoàn chỉnh và CV tái định vị. Đây là hai thứ mang đi phỏng vấn.

### Vì sao phải có sản phẩm cuối

Doanh nghiệp có hệ thống phân phối lớn thường cho ứng viên làm bài test thực tế — ví dụ xây kế hoạch khuyến mãi một tháng cho một dòng sản phẩm. Nếu bạn đã tự làm một bản trước ở nhà, **bài test không còn là thử thách mà thành cơ hội trình diễn.**

### Khung một bản Trade Plan giả định

Bảy phần dưới đây là khuôn tối thiểu. Viết được đủ bảy phần cho một nhãn hàng bạn đã theo dõi ba tháng là đã hơn phần lớn ứng viên mới:

1. **Bối cảnh** — ngành hàng, nhãn hàng, kênh nhắm tới, và hiện trạng quan sát được từ store check của bạn.
2. **Mục tiêu** — một con số cụ thể, có mốc nền. Ví dụ: tăng sell-out 15,0% tại nhóm cửa hàng tiện lợi khu vực nội thành trong một tháng.
3. **Đối tượng** — shopper nào, tại kênh nào, và insight rút ra từ quan sát thật.
4. **Cơ chế khuyến mãi** — chọn một mechanic và nói rõ vì sao chọn nó thay vì giảm giá trực tiếp.
5. **POSM và trưng bày** — loại vật phẩm, đặt ở đâu, số lượng, lịch dựng và tháo.
6. **Ngân sách** — chia theo khoản: phí trưng bày, sản xuất POSM, hàng khuyến mãi, nhân sự triển khai.
7. **KPI và cách đo** — đo bằng chỉ số nào, lấy số từ đâu, và ngưỡng nào thì coi là thất bại.

Phần 7 là phần hay bị bỏ nhất và cũng là phần gây ấn tượng nhất, vì nó cho thấy bạn nghĩ tới việc chịu trách nhiệm cho kết quả chứ không chỉ nghĩ tới việc triển khai.

### Ba lỗi thường gặp khi tự viết Trade Plan

- **Mục tiêu không có mốc nền.** "Tăng doanh số" không phải mục tiêu. Tăng bao nhiêu so với tháng nào mới là.
- **Ngân sách không cộng đủ.** Quên chi phí sản xuất POSM và nhân sự triển khai là lỗi làm ROI đẹp giả.
- **Chọn mechanic theo cảm tính.** Phải nói được tác dụng phụ của cơ chế đã chọn lên giá bán và tồn kho.

### Nếu chỉ có 30 ngày thay vì 90

Trường hợp bạn đã có lịch phỏng vấn gần, rút gọn theo thứ tự ưu tiên này:

1. **Tuần 1** — học thuộc bộ chỉ số ở chuyên đề 03 và phân biệt được ba đối tượng ở chuyên đề 01.
2. **Tuần 2** — đi store check 3 buổi cho một nhãn hàng, ghi đủ sáu nhóm thông tin, có ảnh.
3. **Tuần 3** — dựng bảng Excel từ dữ liệu vừa thu, làm một Pivot, rút ba kết luận.
4. **Tuần 4** — viết Trade Plan rút gọn theo bảy phần ở trên và sửa lại CV.

Bản rút gọn này yếu hơn bản 90 ngày ở chiều sâu dữ liệu, nhưng vẫn hơn hẳn việc đi phỏng vấn tay không.`,
        takeaway:
          'Ba tháng chia rõ: tháng 1 nền tảng, tháng 2 thực địa, tháng 3 ra sản phẩm. Kết quả cuối là Trade Plan và CV tái định vị — hai thứ biến bài test tuyển dụng thành cơ hội trình diễn.'
      },
      {
        id: 'tm5-s3',
        title: 'Đi store check và trả lời phỏng vấn khi chưa có kinh nghiệm',
        content: `### Đi store check thì ghi lại những gì

Tối thiểu sáu nhóm thông tin:

1. **Vị trí và diện tích kệ** của nhãn mình so với đối thủ
2. **Giá bán** thực tế trên kệ, không phải giá niêm yết trên hệ thống
3. **Tình trạng hàng** — có hết hàng không, có hàng cận date không
4. **POSM** — có đủ không, đúng vị trí không, còn nguyên vẹn không
5. **Chương trình khuyến mãi** của mình và của ba đối thủ gần nhất
6. **Quan sát shopper** — họ dừng lại bao lâu, cầm sản phẩm nào lên trước

Luôn kèm ảnh chụp để đối chiếu qua các lần đi.

### Khi nhà tuyển dụng hỏi "vì sao nên chọn bạn khi bạn chưa có kinh nghiệm Trade"

Không né tránh việc thiếu kinh nghiệm, mà chuyển hướng sang thứ mình đã có và thứ mình đã tự làm. Trả lời theo ba tầng:

#### Tầng 1 — Năng lực chuyển giao được

Tổ chức sự kiện, làm việc với nhà cung cấp in ấn, quản lý ngân sách, chịu áp lực hiện trường — tất cả đều là việc hằng ngày của Trade.

#### Tầng 2 — Bằng chứng đã chủ động chuẩn bị

Store check report, Trade Plan tự viết, số liệu đã tự phân tích. Đây là phần tạo khác biệt lớn nhất, vì rất ít ứng viên mới làm.

#### Tầng 3 — Hiểu rõ mình còn thiếu gì

Nêu chính xác khoảng trống của bản thân và kế hoạch cụ thể để lấp.

**Một ứng viên biết chính xác khoảng trống của mình đáng tin hơn một ứng viên nói mình biết hết.**

### Bốn câu hỏi phỏng vấn Trade hay gặp nhất

Chuẩn bị trước bốn câu này là chuẩn bị được phần lớn buổi phỏng vấn:

**1. "Phân biệt shopper, consumer và customer."**

Câu lọc đầu tiên. Trả lời bằng ví dụ đời sống thật của chính bạn, đừng đọc lại định nghĩa.

**2. "Sell-in tăng mạnh nhưng sell-out không tăng. Bạn nghĩ gì?"**

Câu kiểm tra tư duy chỉ số. Nêu được hiện tượng (hàng dồn ứ ở kênh), nguyên nhân thường gặp (đẩy hàng chạy chỉ tiêu, chiết khấu quá hấp dẫn), hệ quả (tháng sau ngừng nhập, hàng cận date, có thể phải xả giá), và việc cần làm (dừng đẩy sell-in, chuyển ngân sách sang kích sell-out).

**3. "Có 100 triệu cho một chương trình, làm sao biết nó hiệu quả?"**

Câu kiểm tra tư duy đo lường. Bốn thứ phải chốt trước khi chạy: mốc so sánh, mục tiêu cụ thể, cách đo, ngưỡng dừng. Sau đó tính ROI trên phần doanh thu tăng thêm và kiểm tra tác dụng phụ.

**4. "Vì sao chọn Trade Marketing?"**

Câu tưởng dễ nhất, hay bị trả lời sáo rỗng nhất. Trả lời bằng một quan sát cụ thể của bạn ngoài điểm bán, rồi nói vì sao nó làm bạn tò mò. Đây là chỗ dữ liệu store check của bạn phát huy tác dụng.

### Nên hỏi lại nhà tuyển dụng điều gì

Cuối buổi luôn có phần này, và im lặng là mất điểm. Ba câu vừa cho thấy bạn hiểu nghề vừa giúp bạn quyết định:

- **"Vị trí này phụ trách kênh nào và ngành hàng nào?"** — biết mình sẽ học sâu vào đâu.
- **"Tỷ lệ thời gian đi thị trường so với ngồi văn phòng khoảng bao nhiêu?"** — kiểm tra nhịp công việc có hợp không.
- **"Sáu tháng đầu, anh chị kỳ vọng người vào vị trí này làm được gì?"** — biết thước đo mình sẽ bị đánh giá.

### Chuẩn bị mang gì tới buổi phỏng vấn

- **Bảng store check** in ra giấy, kèm vài ảnh so sánh cùng một nhãn ở hai kênh.
- **Trade Plan tự viết**, bản in gọn trong vài trang.
- **Một câu chuyện** về lần bạn đứng giữa hai bên có mục tiêu lệch nhau và cách bạn xử lý.

Ba thứ này biến buổi phỏng vấn từ chỗ họ hỏi và bạn trả lời thành chỗ hai bên cùng xem một tài liệu. Khác biệt về thế đứng rất lớn.`,
        takeaway:
          'Store check ghi tối thiểu sáu nhóm: vị trí kệ, giá, tình trạng hàng, POSM, khuyến mãi đối thủ, hành vi shopper. Khi phỏng vấn, trả lời ba tầng: năng lực chuyển giao, bằng chứng đã tự chuẩn bị, và khoảng trống mình tự biết.'
      }
    ],
    quiz: [
      {
        id: 'qtm5_1',
        question: 'Sell-in tháng này tăng 30% nhưng sell-out chỉ tăng 5%. Điều gì đang xảy ra?',
        options: [
          'Chương trình khuyến mãi đang rất hiệu quả',
          'Hàng đang dồn ứ ở kênh chứ không đến tay người mua',
          'Shopper đang chuyển sang mua ở kênh khác',
          'Nhà bán lẻ đang tính sai số liệu báo cáo'
        ],
        correct: 1,
        explanation:
          'Nguyên nhân thường gặp: đội Sales đẩy hàng để chạy chỉ tiêu, hoặc chiết khấu cho nhà phân phối quá hấp dẫn khiến họ nhập vượt nhu cầu. Hệ quả: tháng sau nhà phân phối ngừng nhập, hàng có nguy cơ cận date, có thể phải xả giá làm hỏng định vị. Việc cần làm là dừng đẩy sell-in và chuyển ngân sách sang hoạt động kích sell-out.'
      },
      {
        id: 'qtm5_2',
        question: 'Đội Sales muốn giảm giá sâu để đạt chỉ tiêu quý. Cách phản biện đúng đắn nhất là gì?',
        options: [
          'Đồng ý ngay vì chỉ tiêu quý là ưu tiên cao nhất',
          'Từ chối thẳng vì giảm giá luôn có hại',
          'Chuyển vấn đề lên cấp trên quyết định',
          'Nêu hệ quả có thể tính được, rồi đưa phương án thay thế đạt cùng mục tiêu mà không đụng giá niêm yết'
        ],
        correct: 3,
        explanation:
          'Giảm giá sâu kéo shopper mua trước phần của quý sau, tạo tiền lệ khiến kênh chỉ nhập khi có khuyến mãi, và có thể buộc đối thủ hạ giá theo. Phương án thay thế: tăng giá trị thay vì giảm giá (quà tặng kèm, combo), dồn nguồn lực vào trưng bày và độ phủ. Tinh thần: đứng cùng phía với Sales về mục tiêu, khác phía về cách làm.'
      },
      {
        id: 'qtm5_3',
        question: 'Bạn có ngân sách 100 triệu cho một chương trình. Làm sao biết chương trình có hiệu quả?',
        options: [
          'Xem tổng doanh số trong tháng chạy chương trình có tăng không',
          'Hỏi ý kiến nhà phân phối sau khi chương trình kết thúc',
          'Xác định mốc so sánh và mục tiêu cụ thể TRƯỚC khi chạy, sau đó đo ROI và kiểm tra tác dụng phụ',
          'So sánh với chương trình của đối thủ trong cùng kỳ'
        ],
        correct: 2,
        explanation:
          'Cần bốn thứ: mốc so sánh (doanh số cùng kỳ trước khi có chương trình), mục tiêu cụ thể (tăng bao nhiêu phần trăm sell-out, tại bao nhiêu điểm bán), đo ROI, và kiểm tra tác dụng phụ (có kéo doanh số tháng sau về không, có phá giá không, tồn kho ra sao). Một chương trình tăng doanh số nhưng lỗ ròng vẫn là thất bại.'
      },
      {
        id: 'qtm5_4',
        question: 'Khi nhà tuyển dụng hỏi "vì sao nên chọn bạn khi chưa có kinh nghiệm Trade", cách trả lời tốt nhất là gì?',
        options: [
          'Khẳng định mình học rất nhanh và sẵn sàng làm mọi việc',
          'Nêu năng lực chuyển giao được, đưa bằng chứng đã chủ động chuẩn bị, và nói rõ khoảng trống của mình cùng kế hoạch lấp',
          'Nói rằng kinh nghiệm không quan trọng bằng thái độ',
          'Tránh đề cập tới việc thiếu kinh nghiệm và chuyển sang nói về đam mê'
        ],
        correct: 1,
        explanation:
          'Ba tầng: năng lực chuyển giao được (tổ chức sự kiện, làm việc với nhà cung cấp, quản lý ngân sách đều là việc hằng ngày của Trade); bằng chứng đã chủ động chuẩn bị (store check report, Trade Plan tự viết); và hiểu rõ khoảng trống của mình. Một ứng viên biết chính xác khoảng trống của mình đáng tin hơn một ứng viên nói mình biết hết.'
      }
    ]
  }
];
