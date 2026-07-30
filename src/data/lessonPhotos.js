/**
 * Ảnh chụp thật cho từng bài học, tra theo sectionId.
 *
 * Khác với LessonVisual (sơ đồ số liệu) và LessonIllustration (tranh khái niệm
 * vẽ bằng SVG), đây là ảnh chụp thật gắn với một tình huống thương hiệu có thật
 * đã nêu trong bài.
 *
 * Toàn bộ ảnh lấy từ Wikimedia Commons, đều thuộc nhóm giấy phép tự do và có
 * ghi công đầy đủ ở trường credit. Ảnh nạp từ máy chủ Wikimedia nên khi rớt
 * mạng component sẽ tự lùi về sơ đồ vẽ sẵn thay vì để trống.
 *
 * File này được sinh ra bằng script, mỗi URL đã được kiểm tra trả về HTTP 200.
 */
export const LESSON_PHOTOS = {
  'm1-s1': {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Adidas%2C_Westfield_SF_Centre_1.JPG/1280px-Adidas%2C_Westfield_SF_Centre_1.JPG',
    caption: 'Cửa hàng Adidas. Năm 2019 Adidas công khai thừa nhận đã dồn 77% ngân sách cho quảng cáo hiệu suất trong khi thương hiệu mới là thứ tạo ra 65% doanh số.',
    credit: 'Wikimedia Commons / BrokenSphere (CC BY-SA 3.0)',
    source: 'https://commons.wikimedia.org/wiki/File:Adidas,_Westfield_SF_Centre_1.JPG',
  },
  'm1-s2': {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Times_square_at_night.jpg/1280px-Times_square_at_night.jpg',
    caption: 'Quảng cáo ngoài trời tại Times Square. Đây là dạng chi tiêu thuộc nhóm 60% xây dựng thương hiệu trong khung của Les Binet và Peter Field.',
    credit: 'Wikimedia Commons / Rafi B. from Somewhere in Texas :) (CC BY 2.0)',
    source: 'https://commons.wikimedia.org/wiki/File:Times_square_at_night.jpg',
  },
  'm1-s3': {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Vinamilk_old_and_2023_branding.jpg/1280px-Vinamilk_old_and_2023_branding.jpg',
    caption: 'Nhận diện Vinamilk trước và sau lần thay đổi năm 2023. Mục tiêu kinh doanh kiểu tái định vị luôn phải quy được về chỉ số digital đo được.',
    credit: 'Wikimedia Commons / Pdhadam (CC BY-SA 4.0)',
    source: 'https://commons.wikimedia.org/wiki/File:Vinamilk_old_and_2023_branding.jpg',
  },
  'm1-s4': {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/AirbnbToronto.jpg/1280px-AirbnbToronto.jpg',
    caption: 'Văn phòng Airbnb. Năm 2020 Airbnb cắt 541 triệu đô la riêng phần quảng cáo hiệu suất mà vẫn giữ được 95% lưu lượng truy cập của năm trước.',
    credit: 'Wikimedia Commons / Raysonho @ Open Grid Scheduler / Scalable Grid Engine (CC0)',
    source: 'https://commons.wikimedia.org/wiki/File:AirbnbToronto.jpg',
  },
  'm2-s1': {
    url: 'https://upload.wikimedia.org/wikipedia/commons/e/e4/HubSpot_Offices.png',
    caption: 'Văn phòng HubSpot. Chính HubSpot là nơi đặt ra thuật ngữ Inbound Marketing năm 2005.',
    credit: 'Wikimedia Commons / The original uploader was CorporateM at Wikipedia. (CC BY-SA 3.0)',
    source: 'https://commons.wikimedia.org/wiki/File:HubSpot_Offices.png',
  },
  'm2-s2': {
    url: 'https://upload.wikimedia.org/wikipedia/commons/f/fd/HubSpot_Offices2.png',
    caption: 'HubSpot công bố mô hình bánh đà Flywheel thay cho phễu truyền thống tại hội nghị INBOUND 2018.',
    credit: 'Wikimedia Commons / HubSpot (CC BY-SA 3.0)',
    source: 'https://commons.wikimedia.org/wiki/File:HubSpot_Offices2.png',
  },
  'm2-s3': {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Google_Campus%2C_Mountain_View%2C_CA.jpg/1280px-Google_Campus%2C_Mountain_View%2C_CA.jpg',
    caption: 'Trụ sở Google. Toàn bộ giá trị của kênh Inbound phụ thuộc vào lưu lượng tìm kiếm tự nhiên, thứ mà doanh nghiệp không sở hữu và không kiểm soát được.',
    credit: 'Wikimedia Commons / Austin McKinley (CC BY 3.0)',
    source: 'https://commons.wikimedia.org/wiki/File:Google_Campus,_Mountain_View,_CA.jpg',
  },
  'm3-s1': {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/UASA_NEC_meeting_in_main_boardroom.jpg/1280px-UASA_NEC_meeting_in_main_boardroom.jpg',
    caption: 'Phiên họp duyệt ngân sách. Theo khảo sát CMO của Gartner năm 2024, ngân sách marketing trung bình chỉ còn 7,7% doanh thu doanh nghiệp.',
    credit: 'Wikimedia Commons / UASA editor (CC BY-SA 4.0)',
    source: 'https://commons.wikimedia.org/wiki/File:UASA_NEC_meeting_in_main_boardroom.jpg',
  },
  'm3-s2': {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Coca-Cola_billboard_on_Broadway_2009-12-22.jpg/1280px-Coca-Cola_billboard_on_Broadway_2009-12-22.jpg',
    caption: 'Quảng cáo Coca-Cola. Quy tắc 70/20/10 được Coca-Cola đưa vào chiến lược Content 2020 do Jonathan Mildenhall khởi xướng năm 2011.',
    credit: 'Wikimedia Commons / Velkiira (CC BY-SA 2.0)',
    source: 'https://commons.wikimedia.org/wiki/File:Coca-Cola_billboard_on_Broadway_2009-12-22.jpg',
  },
  'm3-s3': {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Ho_Chi_Minh_City%2C_Vincom_Center%2C_2020-01_CN-01.jpg/1280px-Ho_Chi_Minh_City%2C_Vincom_Center%2C_2020-01_CN-01.jpg',
    caption: 'Trung tâm thương mại tại Thành phố Hồ Chí Minh. Ngân sách phải được tính ngược từ mục tiêu doanh thu qua từng tầng phễu chứ không lấy theo năm ngoái.',
    credit: 'Wikimedia Commons / Steffen Schmitz (more photos) (CC BY-SA 4.0)',
    source: 'https://commons.wikimedia.org/wiki/File:Ho_Chi_Minh_City,_Vincom_Center,_2020-01_CN-01.jpg',
  },
  'm4-s1': {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/HubSpot_Group_Photo.jpg/1280px-HubSpot_Group_Photo.jpg',
    caption: 'Một đội ngũ marketing thật. Sơ đồ tổ chức phải bám theo quy mô ngân sách mà mỗi nhân sự thực sự vận hành nổi.',
    credit: 'Wikimedia Commons / The original uploader was CorporateM at Wikipedia. (CC BY-SA 3.0)',
    source: 'https://commons.wikimedia.org/wiki/File:HubSpot_Group_Photo.jpg',
  },
  'm4-s2': {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Procter_and_Gamble_World_Headquarters%2C_Cincinnati%2C_OH_%2832278862657%29.jpg/1280px-Procter_and_Gamble_World_Headquarters%2C_Cincinnati%2C_OH_%2832278862657%29.jpg',
    caption: 'Trụ sở Procter & Gamble tại Cincinnati. P&G là doanh nghiệp đi đầu trong việc cắt mạnh chi phí agency và đưa năng lực về nội bộ.',
    credit: 'Wikimedia Commons / Warren LeMay from Cincinnati, OH, United States (CC0)',
    source: 'https://commons.wikimedia.org/wiki/File:Procter_and_Gamble_World_Headquarters,_Cincinnati,_OH_(32278862657).jpg',
  },
  'm4-s3': {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Unilever_House%2C_London_1.jpg/1280px-Unilever_House%2C_London_1.jpg',
    caption: 'Unilever House tại London. Unilever xây mạng lưới xưởng nội dung nội bộ U-Studio từ năm 2016 để giảm phụ thuộc vào agency.',
    credit: 'Wikimedia Commons / Paul the Archivist (CC BY-SA 4.0)',
    source: 'https://commons.wikimedia.org/wiki/File:Unilever_House,_London_1.jpg',
  },
  'm5-s1': {
    url: 'https://upload.wikimedia.org/wikipedia/commons/4/43/Meta_Headquarters_Sign.jpg',
    caption: 'Trụ sở Meta. Thư viện quảng cáo Meta Ad Library công khai toàn bộ mẫu quảng cáo đang chạy của mọi trang, miễn phí cho bất kỳ ai.',
    credit: 'Wikimedia Commons / Nokia621 (CC BY-SA 4.0)',
    source: 'https://commons.wikimedia.org/wiki/File:Meta_Headquarters_Sign.jpg',
  },
  'm5-s2': {
    url: 'https://upload.wikimedia.org/wikipedia/commons/1/19/WLW_Focus_Group_members_23.png',
    caption: 'Một buổi thảo luận nhóm. Nghiên cứu định tính tìm ra giả thuyết, nghiên cứu định lượng mới xác nhận giả thuyết nào chiếm tỷ lệ lớn.',
    credit: 'Wikimedia Commons / Afek91 (CC BY 4.0)',
    source: 'https://commons.wikimedia.org/wiki/File:WLW_Focus_Group_members_23.png',
  },
  'm5-s3': {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/TikTok_Headquarters.jpg/1280px-TikTok_Headquarters.jpg',
    caption: 'Trụ sở TikTok. TikTok Creative Center cho tra cứu miễn phí kho quảng cáo hiệu quả nhất theo từng ngành và từng quốc gia.',
    credit: 'Wikimedia Commons / Coolcaesar (CC BY 4.0)',
    source: 'https://commons.wikimedia.org/wiki/File:TikTok_Headquarters.jpg',
  },
  'm5-s4': {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Ho_Chi_Minh_City%2C_Vietnam_%28Unsplash_5oRaXQqV6CM%29.jpg/1280px-Ho_Chi_Minh_City%2C_Vietnam_%28Unsplash_5oRaXQqV6CM%29.jpg',
    caption: 'Thành phố Hồ Chí Minh. Dung lượng thị trường TAM, SAM, SOM phải bắt đầu từ số liệu dân số và hộ kinh doanh thật của địa bàn.',
    credit: 'Wikimedia Commons / Tao Xanh Kim taoxanhkim (CC0)',
    source: 'https://commons.wikimedia.org/wiki/File:Ho_Chi_Minh_City,_Vietnam_(Unsplash_5oRaXQqV6CM).jpg',
  },
  'm6-s1': {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Netflix_headquarters.jpg/1280px-Netflix_headquarters.jpg',
    caption: 'Trụ sở Netflix. Netflix bỏ cách phân nhóm theo nhân khẩu học, thay bằng khoảng 2.000 nhóm sở thích dựng từ hành vi xem thật.',
    credit: 'Wikimedia Commons / Coolcaesar at English Wikipedia (CC BY-SA 3.0)',
    source: 'https://commons.wikimedia.org/wiki/File:Netflix_headquarters.jpg',
  },
  'm6-s2': {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Dove_150ml8709427.jpg/1280px-Dove_150ml8709427.jpg',
    caption: 'Sản phẩm Dove. Chiến dịch Real Beauty Sketches năm 2013 sinh ra từ một insight định lượng: chỉ 4% phụ nữ tự mô tả mình là đẹp.',
    credit: 'Wikimedia Commons / Unilever (CC BY-SA 3.0)',
    source: 'https://commons.wikimedia.org/wiki/File:Dove_150ml8709427.jpg',
  },
  'm6-s3': {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Sephora_Toronto_Eaton_Centre.jpg/1280px-Sephora_Toronto_Eaton_Centre.jpg',
    caption: 'Cửa hàng Sephora. Chương trình Beauty Insider của Sephora là ví dụ kinh điển về phân tầng khách hàng theo giá trị chi tiêu.',
    credit: 'Wikimedia Commons / Rowanlovescars (CC BY-SA 4.0)',
    source: 'https://commons.wikimedia.org/wiki/File:Sephora_Toronto_Eaton_Centre.jpg',
  },
  'm7-s1': {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/HK_KTD_Kwun_Tong_Apm_mall_shop_Apple_Store_iPhone_display_for_sale_Ipone_15_Pro_Max_May_2024_Ipone15_003.jpg/1280px-HK_KTD_Kwun_Tong_Apm_mall_shop_Apple_Store_iPhone_display_for_sale_Ipone_15_Pro_Max_May_2024_Ipone15_003.jpg',
    caption: 'Gian hàng iPhone. Chiến dịch Shot on iPhone chạy liên tục từ năm 2015 là ví dụ về một Big Idea đủ khoẻ để nuôi nhiều trụ cột nội dung.',
    credit: 'Wikimedia Commons / KAiuphoupPor kou s s (CC0)',
    source: 'https://commons.wikimedia.org/wiki/File:HK_KTD_Kwun_Tong_Apm_mall_shop_Apple_Store_iPhone_display_for_sale_Ipone_15_Pro_Max_May_2024_Ipone15_003.jpg',
  },
  'm7-s2': {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Duolingo%2C_mem-referenco%2C_1.jpeg/1280px-Duolingo%2C_mem-referenco%2C_1.jpeg',
    caption: 'Ứng dụng Duolingo. Tài khoản TikTok của Duolingo tăng từ vài chục nghìn lên hàng triệu người theo dõi nhờ nội dung đặt cược toàn bộ vào 3 giây đầu.',
    credit: 'Wikimedia Commons / Renardo la vulpo (Public domain)',
    source: 'https://commons.wikimedia.org/wiki/File:Duolingo,_mem-referenco,_1.jpeg',
  },
  'm7-s3': {
    url: 'https://upload.wikimedia.org/wikipedia/commons/7/74/Videography_crew_shooting_interview_on_location.png',
    caption: 'Một buổi quay thật. Khi quảng cáo kém hiệu quả, phải biết nó hỏng ở giây thứ mấy chứ không kết luận chung chung là video chưa hay.',
    credit: 'Wikimedia Commons / Jfurrer (CC BY-SA 3.0)',
    source: 'https://commons.wikimedia.org/wiki/File:Videography_crew_shooting_interview_on_location.png',
  },
  'm8-s1': {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Crowd_of_people_with_phones.jpg/1280px-Crowd_of_people_with_phones.jpg',
    caption: 'Người dùng điện thoại nơi công cộng. Người ta chia sẻ nội dung vì hình ảnh của chính họ trong mắt bạn bè, không phải vì thương hiệu.',
    credit: 'Wikimedia Commons / Rawpixel Ltd (CC BY 2.0)',
    source: 'https://commons.wikimedia.org/wiki/File:Crowd_of_people_with_phones.jpg',
  },
  'm8-s2': {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Congresswoman_Pelosi_%26_Eshoo_tour_Dropbox_Headquarters_in_China_Basin_and_participate_in_a_%E2%80%9CDroptalk%E2%80%9D_with_Dropbox_staff_%2814886353417%29.jpg/1280px-Congresswoman_Pelosi_%26_Eshoo_tour_Dropbox_Headquarters_in_China_Basin_and_participate_in_a_%E2%80%9CDroptalk%E2%80%9D_with_Dropbox_staff_%2814886353417%29.jpg',
    caption: 'Trụ sở Dropbox. Chương trình giới thiệu bạn bè hai chiều của Dropbox đưa số người dùng từ 100 nghìn lên 4 triệu trong 15 tháng.',
    credit: 'Wikimedia Commons / Nancy Pelosi from San Francisco, CA (CC BY 2.0)',
    source: 'https://commons.wikimedia.org/wiki/File:Congresswoman_Pelosi_%26_Eshoo_tour_Dropbox_Headquarters_in_China_Basin_and_participate_in_a_%E2%80%9CDroptalk%E2%80%9D_with_Dropbox_staff_(14886353417).jpg',
  },
  'm8-s3': {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Doing_the_ALS_Ice_Bucket_Challenge_%2814927191426%29.jpg/1280px-Doing_the_ALS_Ice_Bucket_Challenge_%2814927191426%29.jpg',
    caption: 'Thử thách dội xô nước đá năm 2014. Chiến dịch thu về hơn 115 triệu đô la cho Hiệp hội ALS chỉ trong 8 tuần.',
    credit: 'Wikimedia Commons / slgckgc (CC BY 2.0)',
    source: 'https://commons.wikimedia.org/wiki/File:Doing_the_ALS_Ice_Bucket_Challenge_(14927191426).jpg',
  },
  'm9-s1': {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Gantt_Chart_Template_for_Film_Production.png/1280px-Gantt_Chart_Template_for_Film_Production.png',
    caption: 'Sơ đồ Gantt. Khung SOSTAC do PR Smith xây dựng từ thập niên 1990, được bình chọn vào nhóm ba mô hình marketing phổ biến nhất trong cuộc thăm dò của CIM năm 2011.',
    credit: 'Wikimedia Commons / HarryTruinkers (CC BY-SA 4.0)',
    source: 'https://commons.wikimedia.org/wiki/File:Gantt_Chart_Template_for_Film_Production.png',
  },
  'm9-s2': {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Visit_to_Facebook_headquarters.jpg/960px-Visit_to_Facebook_headquarters.jpg',
    caption: 'Trụ sở Facebook. Meta công bố ngưỡng khoảng 50 sự kiện chuyển đổi mỗi 7 ngày để một nhóm quảng cáo thoát giai đoạn học.',
    credit: 'Wikimedia Commons / U.S. Department of the Treasury (Public domain)',
    source: 'https://commons.wikimedia.org/wiki/File:Visit_to_Facebook_headquarters.jpg',
  },
  'm9-s3': {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Apple_Park.jpg/1280px-Apple_Park.jpg',
    caption: 'Apple Park. Chính sách App Tracking Transparency của Apple năm 2021 là ví dụ rõ nhất về rủi ro nằm ngoài tầm kiểm soát của phòng marketing.',
    credit: 'Wikimedia Commons / IPhone01 (CC BY-SA 4.0)',
    source: 'https://commons.wikimedia.org/wiki/File:Apple_Park.jpg',
  },
  'm9-s4': {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Health_club_in_Gothenburg_Sweden_in_March_2025.jpg/1280px-Health_club_in_Gothenburg_Sweden_in_March_2025.jpg',
    caption: 'Phòng tập thể hình. Với mô hình thu phí định kỳ, giảm tỷ lệ rời bỏ thường là đòn bẩy rẻ hơn nhiều so với mua thêm hội viên mới.',
    credit: 'Wikimedia Commons / R. Henrik Nilsson (CC BY 4.0)',
    source: 'https://commons.wikimedia.org/wiki/File:Health_club_in_Gothenburg_Sweden_in_March_2025.jpg',
  },
  'm10-s1': {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Procter_and_Gamble_World_Headquarters%2C_Cincinnati%2C_OH_%2847221090311%29.jpg/1280px-Procter_and_Gamble_World_Headquarters%2C_Cincinnati%2C_OH_%2847221090311%29.jpg',
    caption: 'Trụ sở P&G. Năm 2017 P&G cắt 200 triệu đô la chi tiêu quảng cáo số mà độ phủ vẫn tăng khoảng 10%.',
    credit: 'Wikimedia Commons / Warren LeMay from Cincinnati, OH, United States (CC0)',
    source: 'https://commons.wikimedia.org/wiki/File:Procter_and_Gamble_World_Headquarters,_Cincinnati,_OH_(47221090311).jpg',
  },
  'm10-s2': {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Googleplex_HQ_%28cropped%29.jpg/1280px-Googleplex_HQ_%28cropped%29.jpg',
    caption: 'Trụ sở Google. Tháng 9 năm 2023 Google gỡ bỏ bốn mô hình ghi nhận chuyển đổi khỏi GA4 và Google Ads, chỉ giữ lại lần chạm cuối và mô hình dựa trên dữ liệu.',
    credit: 'Wikimedia Commons / Asoundd (CC BY-SA 4.0)',
    source: 'https://commons.wikimedia.org/wiki/File:Googleplex_HQ_(cropped).jpg',
  },
  'm10-s3': {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Uber_offices%2C_Mission_Bay_%28July_2020%29_-1.jpg/1280px-Uber_offices%2C_Mission_Bay_%28July_2020%29_-1.jpg',
    caption: 'Văn phòng Uber. Uber tắt khoảng 100 triệu đô la ngân sách quảng cáo cài đặt ứng dụng mà số lượt cài gần như không đổi.',
    credit: 'Wikimedia Commons / HaeB (CC BY-SA 4.0)',
    source: 'https://commons.wikimedia.org/wiki/File:Uber_offices,_Mission_Bay_(July_2020)_-1.jpg',
  },
  'm11-s1': {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/LEGO%C2%AE_Store_Ngee_Ann_City_%28154207%29.jpg/1280px-LEGO%C2%AE_Store_Ngee_Ann_City_%28154207%29.jpg',
    caption: 'Cửa hàng LEGO. Cuộc lội ngược dòng của LEGO từ năm 2004 bắt đầu bằng chẩn đoán lại mô hình kinh doanh chứ không bằng một chiến dịch truyền thông.',
    credit: 'Wikimedia Commons / Moheen Reeyad (CC BY-SA 4.0)',
    source: 'https://commons.wikimedia.org/wiki/File:LEGO%C2%AE_Store_Ngee_Ann_City_(154207).jpg',
  },
  'm11-s2': {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Domino%27s_Pizza_Longjian_Store_20150901.jpg/1280px-Domino%27s_Pizza_Longjian_Store_20150901.jpg',
    caption: 'Cửa hàng Domino\'s Pizza. Chiến dịch Pizza Turnaround cuối năm 2009 giúp doanh thu cùng cửa hàng quý 1 năm 2010 tăng 14,3%, mức kỷ lục của ngành.',
    credit: 'Wikimedia Commons / 玄史生 (CC0)',
    source: 'https://commons.wikimedia.org/wiki/File:Domino%27s_Pizza_Longjian_Store_20150901.jpg',
  },
  'm11-s3': {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/DFC_2514_A_brightly_painted_street_food_stall_selling_crispy_fried_chicken_draws_a_GrabFood_rider_waiting_on_his_motorbike_for_his_order.jpg/1280px-DFC_2514_A_brightly_painted_street_food_stall_selling_crispy_fried_chicken_draws_a_GrabFood_rider_waiting_on_his_motorbike_for_his_order.jpg',
    caption: 'Tài xế giao đồ ăn tại Việt Nam. Baemin rời thị trường Việt Nam tháng 12 năm 2023 dù làm truyền thông rất tốt, vì bài toán đơn vị kinh tế không giải được.',
    credit: 'Wikimedia Commons / PattayaPatrol (CC BY-SA 4.0)',
    source: 'https://commons.wikimedia.org/wiki/File:DFC_2514_A_brightly_painted_street_food_stall_selling_crispy_fried_chicken_draws_a_GrabFood_rider_waiting_on_his_motorbike_for_his_order.jpg',
  },
};
