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
 *
 * Hai dạng khai báo:
 *   - Một ảnh:  { url, caption, credit, source }
 *   - Chùm ảnh: { gallery, note, photos: [{ label, url, caption, credit, source }] }
 *
 * Dùng chùm ảnh khi một tấm không đủ để nhận mặt khái niệm — POSM ở bài
 * 'tm3-s2' là ví dụ: standee, kệ trưng bày, dump bin và thẻ giá là bốn thứ
 * khác hẳn nhau nhưng cùng nằm dưới một chữ viết tắt.
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

  /* ==================================================================
     KHOÁ NÂNG CAO: TRADE MARKETING (tra theo sectionId dạng tm<n>-s<n>)

     Khoá này khác khoá chính ở chỗ đối tượng của bài là thứ sờ được:
     quầy, kệ, POSM. Ảnh ở đây không phải trang trí mà là vật cần nhận
     mặt — học viên đi store check tuần sau phải gọi đúng tên thứ đang
     treo trên kệ.

     Bài nào cần đối chiếu hai vế (GT với MT, EC với HoReCa, shopper với
     consumer) thì dùng dạng chùm ảnh { gallery, photos } để hai vế nằm
     cạnh nhau trong cùng một khung, thay vì bắt học viên nhớ tấm trước
     rồi cuộn xuống xem tấm sau.
     ================================================================== */

  'tm1-s1': {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Faced_products_on_a_supermarket_shelf.JPG/1280px-Faced_products_on_a_supermarket_shelf.JPG',
    caption: 'Kệ hàng đã được dàn mặt (facing) đúng chuẩn trưng bày. Đây là quãng đường cuối mà Trade Marketing chịu trách nhiệm: từ lúc shopper bước vào điểm bán tới lúc sản phẩm nằm trong giỏ.',
    credit: 'Wikimedia Commons / Amnesiac86 (CC BY-SA 3.0)',
    source: 'https://commons.wikimedia.org/wiki/File:Faced_products_on_a_supermarket_shelf.JPG',
  },
  'tm1-s2': {
    gallery: 'Shopper và consumer — hai vai không phải lúc nào cũng trùng',
    note: 'Nhầm hai khái niệm này là lỗi bị nhận ra ngay trong ba phút đầu buổi phỏng vấn.',
    photos: [
      {
        label: 'Shopper — người mua',
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Man_grocery_shopping.jpg/1280px-Man_grocery_shopping.jpg',
        caption: 'Người đang đứng trước kệ và ra quyết định chọn hàng. Đây mới là đối tượng mà Trade Marketing tác động.',
        credit: 'Wikimedia Commons / Bill Branson (Public domain)',
        source: 'https://commons.wikimedia.org/wiki/File:Man_grocery_shopping.jpg',
      },
      {
        label: 'Consumer — người dùng',
        url: 'https://upload.wikimedia.org/wikipedia/commons/2/21/Johnson%27s_Baby_Product_Shelves_at_Kroger.JPG',
        caption: 'Quầy hàng chăm sóc em bé: người mua là cha mẹ, người dùng là em bé. Đúng tình huống mẹ đi siêu thị mua dầu gội cho con trai.',
        credit: 'Wikimedia Commons / ParentingPatch (CC BY-SA 3.0)',
        source: 'https://commons.wikimedia.org/wiki/File:Johnson%27s_Baby_Product_Shelves_at_Kroger.JPG',
      },
    ],
  },
  'tm1-s3': {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Instant_noodles_aisle.JPG/1280px-Instant_noodles_aisle.JPG',
    caption: 'Gian hàng mì gói với hàng chục nhãn cạnh nhau. Brand giành trái tim ngoài kênh truyền thông; Trade giành giỏ hàng ngay tại đây bằng diện tích kệ, vị trí ngang tầm mắt và tình trạng còn hàng.',
    credit: 'Wikimedia Commons / BrokenSphere (CC BY-SA 3.0)',
    source: 'https://commons.wikimedia.org/wiki/File:Instant_noodles_aisle.JPG',
  },

  'tm2-s1': {
    gallery: 'GT và MT — hai kênh truyền thống của thị trường Việt Nam',
    note: 'Cùng một sản phẩm nhưng chương trình ở hai nơi này bắt buộc phải khác nhau.',
    photos: [
      {
        label: 'GT — Kênh truyền thống',
        url: 'https://upload.wikimedia.org/wikipedia/commons/e/ee/Grocery_store_in_Da_Lat%2C_L%C3%A2m_%C4%90%E1%BB%93ng%2C_Vietnam.jpg',
        caption: 'Tạp hoá tại Đà Lạt. Doanh số mỗi điểm nhỏ nhưng số điểm bán rất lớn, và chủ tiệm ảnh hưởng mạnh tới quyết định của shopper.',
        credit: 'Wikimedia Commons / Photostockeditor (Public domain)',
        source: 'https://commons.wikimedia.org/wiki/File:Grocery_store_in_Da_Lat,_L%C3%A2m_%C4%90%E1%BB%93ng,_Vietnam.jpg',
      },
      {
        label: 'MT — Kênh hiện đại',
        url: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Sieu_thi_Co_opmart%2C_Cong_Quynh%2C_Pham_ngu_lao%2C_hcmvn_-_panoramio.jpg',
        caption: 'Siêu thị Co.opmart tại Thành phố Hồ Chí Minh. Ít điểm bán, doanh số mỗi điểm lớn, và mọi thứ đều đi qua hợp đồng: phí trưng bày, vị trí kệ, suất khuyến mãi.',
        credit: 'Wikimedia Commons / trungydang (CC BY 3.0)',
        source: 'https://commons.wikimedia.org/wiki/File:Sieu_thi_Co_opmart,_Cong_Quynh,_Pham_ngu_lao,_hcmvn_-_panoramio.jpg',
      },
    ],
  },
  'tm2-s2': {
    gallery: 'E-commerce và HoReCa — hai kênh đang lên',
    note: 'Một kênh chạy bằng dữ liệu, một kênh chạy bằng quan hệ.',
    photos: [
      {
        label: 'EC — Thương mại điện tử',
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Amazon_Fulfillment_Center%2C_Ocala.jpg/1280px-Amazon_Fulfillment_Center%2C_Ocala.jpg',
        caption: 'Kho vận hành đơn hàng trực tuyến. Trên sàn, "kệ hàng" trở thành trang sản phẩm còn "trưng bày" trở thành thứ hạng tìm kiếm.',
        credit: 'Wikimedia Commons / Michael Rivera (CC0)',
        source: 'https://commons.wikimedia.org/wiki/File:Amazon_Fulfillment_Center,_Ocala.jpg',
      },
      {
        label: 'HoReCa',
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Local_Cafe%2C_T%C3%A2y_H%E1%BB%93%2C_Hanoi_%286923050200%29.jpg/1280px-Local_Cafe%2C_T%C3%A2y_H%E1%BB%93%2C_Hanoi_%286923050200%29.jpg',
        caption: 'Quán cà phê tại Tây Hồ, Hà Nội. Người quyết định nhập hàng là chủ quán hoặc bếp trưởng chứ không phải shopper, nên chu kỳ đàm phán dài mà đã vào được thì rất bền.',
        credit: 'Wikimedia Commons / David McKelvey (CC BY 2.0)',
        source: 'https://commons.wikimedia.org/wiki/File:Local_Cafe,_T%C3%A2y_H%E1%BB%93,_Hanoi_(6923050200).jpg',
      },
    ],
  },
  'tm2-s3': {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Shelf_of_ST25_rice_bags_in_Vietnamese_grocery_store.jpg/1280px-Shelf_of_ST25_rice_bags_in_Vietnamese_grocery_store.jpg',
    caption: 'Kệ gạo ST25 trong một cửa hàng tại Việt Nam. Bài tập thực địa chính là chụp đúng kiểu ảnh này cho một nhãn hàng ở cả siêu thị lẫn tạp hoá, rồi trả lời câu hỏi "vì sao lại khác".',
    credit: 'Wikimedia Commons / VinhNguyen.1257 (CC0)',
    source: 'https://commons.wikimedia.org/wiki/File:Shelf_of_ST25_rice_bags_in_Vietnamese_grocery_store.jpg',
  },

  'tm3-s1': {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Second_display_in_retail.jpg/1280px-Second_display_in_retail.jpg',
    caption: 'Trưng bày thứ cấp đặt ngoài kệ chính — sản phẩm được bày thêm một lần nữa trên đường đi của shopper. Đây là phần việc của khối kiến thức 05 (POSM & Visual Merchandising), cửa vào dễ nhất cho người mới.',
    credit: 'Wikimedia Commons / Diquarius (CC BY-SA 4.0)',
    source: 'https://commons.wikimedia.org/wiki/File:Second_display_in_retail.jpg',
  },
  /* Chùm ảnh POSM: đây là khái niệm học viên phải nhận mặt được ngoài
     điểm bán, mà một tấm ảnh thì không nói hết. Năm dạng dưới đây khác
     nhau cả về chi phí, vòng đời lẫn cách kiểm tra tuân thủ. */
  'tm3-s2': {
    gallery: 'POSM nhìn bằng ảnh thật — năm dạng thường gặp nhất',
    note: 'POSM là tên gọi chung cho mọi vật phẩm quảng cáo tại điểm bán. Dưới một chữ viết tắt là những thứ khác hẳn nhau về chi phí, vòng đời và cách đo mức độ tuân thủ.',
    photos: [
      {
        label: 'Standee',
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Standee_-_Flickr_-_Pratham_Books.jpg/1280px-Standee_-_Flickr_-_Pratham_Books.jpg',
        caption: 'Bảng đứng tự do đặt ở lối đi hoặc cửa vào. Rẻ và dựng nhanh, nhưng cũng dễ bị đẩy vào góc khuất — nên khi store check phải kiểm tra vị trí chứ không chỉ đếm số lượng.',
        credit: 'Wikimedia Commons / Pratham Books (CC BY 2.0)',
        source: 'https://commons.wikimedia.org/wiki/File:Standee_-_Flickr_-_Pratham_Books.jpg',
      },
      {
        label: 'Kệ trưng bày riêng',
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Zippo_Lighters_Point_of_Sale_Display_Northville_MichiganJPG.JPG/1280px-Zippo_Lighters_Point_of_Sale_Display_Northville_MichiganJPG.JPG',
        caption: 'Kệ của riêng nhãn hàng đặt ngay quầy thanh toán. Dạng POSM tốn kém nhất nhưng giành được chỗ mà kệ chung không bao giờ cho.',
        credit: 'Wikimedia Commons / Dwight Burdette (CC BY 3.0)',
        source: 'https://commons.wikimedia.org/wiki/File:Zippo_Lighters_Point_of_Sale_Display_Northville_MichiganJPG.JPG',
      },
      {
        label: 'Dump bin',
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Dump_It_and_They_Will_Come._%2831564144063%29.jpg/1280px-Dump_It_and_They_Will_Come._%2831564144063%29.jpg',
        caption: 'Thùng đổ đống đặt giữa lối đi, dùng cho hàng khuyến mãi. Kích thẳng vào quyết định mua phát sinh tại chỗ chứ không phải quyết định lên kế hoạch từ nhà.',
        credit: 'Wikimedia Commons / Alan Stanton (CC BY-SA 2.0)',
        source: 'https://commons.wikimedia.org/wiki/File:Dump_It_and_They_Will_Come._(31564144063).jpg',
      },
      {
        label: 'Thẻ giá trên kệ',
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Electronic_shelf_labels_on_spice_products_in_Adcoops_supermarket%2C_United_Arab_Emirates.jpg/1280px-Electronic_shelf_labels_on_spice_products_in_Adcoops_supermarket%2C_United_Arab_Emirates.jpg',
        caption: 'Thẻ giá gắn mép kệ, ở đây là bản điện tử. Đây là chỗ shopper đối chiếu giá, nên sai giá trên thẻ là lỗi phải ghi ngay vào biên bản store check.',
        credit: 'Wikimedia Commons / Maheshod98 (CC BY 4.0)',
        source: 'https://commons.wikimedia.org/wiki/File:Electronic_shelf_labels_on_spice_products_in_Adcoops_supermarket,_United_Arab_Emirates.jpg',
      },
      {
        label: 'Trưng bày theo mùa',
        url: 'https://upload.wikimedia.org/wikipedia/commons/a/a1/Easter_PoS_Display.JPG',
        caption: 'Cụm trưng bày dịp lễ, dựng và tháo theo lịch trade calendar. Vòng đời chỉ vài tuần nên toàn bộ chi phí sản xuất phải hoàn vốn trong đúng khoảng thời gian đó.',
        credit: 'Wikimedia Commons / Baryonic Being (CC BY-SA 3.0)',
        source: 'https://commons.wikimedia.org/wiki/File:Easter_PoS_Display.JPG',
      },
    ],
  },
  'tm3-s3': {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Supermarket_checkout_Tegut_Tauberbischofsheim.jpg/1280px-Supermarket_checkout_Tegut_Tauberbischofsheim.jpg',
    caption: 'Quầy thanh toán siêu thị — nơi sinh ra con số sell-out thật. Mọi chỉ số ROI, A&P hay JBP cuối cùng đều phải quy về dữ liệu quét tại đây.',
    credit: 'Wikimedia Commons / Triplec85 (CC BY-SA 4.0)',
    source: 'https://commons.wikimedia.org/wiki/File:Supermarket_checkout_Tegut_Tauberbischofsheim.jpg',
  },
  'tm3-s4': {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Cleaning_products_aisle_in_Coop_Extra_supermarket%2C_Bergen_Stormarked_Shopping_Mall%2C_Norway_2017-10-25.jpg/1280px-Cleaning_products_aisle_in_Coop_Extra_supermarket%2C_Bergen_Stormarked_Shopping_Mall%2C_Norway_2017-10-25.jpg',
    caption: 'Trọn một ngành hàng trên kệ. Retail Audit đo đúng thứ này ở quy mô hàng nghìn điểm bán: ai chiếm bao nhiêu diện tích, bán giá nào, có bị hết hàng không. Tự đi store check cũng thu được dữ liệu cùng loại, chỉ khác quy mô.',
    credit: 'Wikimedia Commons / Wolfmann (CC BY-SA 4.0)',
    source: 'https://commons.wikimedia.org/wiki/File:Cleaning_products_aisle_in_Coop_Extra_supermarket,_Bergen_Stormarked_Shopping_Mall,_Norway_2017-10-25.jpg',
  },

  'tm4-s1': {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Dietz_and_Watson_brand_ambassador.jpg/1280px-Dietz_and_Watson_brand_ambassador.jpg',
    caption: 'Nhân sự chạy hoạt động dùng thử tại điểm bán. Hai nấc đầu của nghề bắt đầu từ đúng loại công việc này: theo dõi POSM, triển khai activation, đi thị trường cùng đội Sales.',
    credit: 'Wikimedia Commons / Whoisjohngalt (CC BY-SA 4.0)',
    source: 'https://commons.wikimedia.org/wiki/File:Dietz_and_Watson_brand_ambassador.jpg',
  },
  'tm4-s2': {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Exhibitors_at_the_Career_Fair_%2830983205220%29.jpg/1280px-Exhibitors_at_the_Career_Fair_%2830983205220%29.jpg',
    caption: 'Ngày hội việc làm. Các con số trong bài lấy từ phân tích tin tuyển dụng quý 2/2026 — thị trường đổi theo quý, nên kiểm tra lại trước khi dùng để đàm phán lương.',
    credit: 'Wikimedia Commons / German Embassy London (CC BY 2.0)',
    source: 'https://commons.wikimedia.org/wiki/File:Exhibitors_at_the_Career_Fair_(30983205220).jpg',
  },
  'tm4-s3': {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Baixiang_Instant_Noodles_on_promotion_in_a_supermarket_in_Beijing_%2820220324091932%29.jpg/1280px-Baixiang_Instant_Noodles_on_promotion_in_a_supermarket_in_Beijing_%2820220324091932%29.jpg',
    caption: 'Một chương trình khuyến mãi mì gói tại siêu thị. FMCG dẫn đầu nhu cầu tuyển dụng Trade vì số điểm bán rất lớn và cuộc cạnh tranh ngay trên kệ diễn ra liên tục.',
    credit: 'Wikimedia Commons / N509FZ (CC BY-SA 4.0)',
    source: 'https://commons.wikimedia.org/wiki/File:Baixiang_Instant_Noodles_on_promotion_in_a_supermarket_in_Beijing_(20220324091932).jpg',
  },

  'tm5-s1': {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Halloween_displays_in_a_Publix_in_Clearwater%2C_Florida%2C_Sep_2020.jpg/1280px-Halloween_displays_in_a_Publix_in_Clearwater%2C_Florida%2C_Sep_2020.jpg',
    caption: 'Cụm trưng bày theo mùa trong siêu thị. Khoảng trống thứ tư của người mới nằm ở đây: đi siêu thị hàng tuần nhưng chưa từng hỏi vì sao cụm này đặt chỗ đó, chiếm bao nhiêu diện tích và đổi lại được gì.',
    credit: 'Wikimedia Commons / MatthewHoobin (CC BY-SA 4.0)',
    source: 'https://commons.wikimedia.org/wiki/File:Halloween_displays_in_a_Publix_in_Clearwater,_Florida,_Sep_2020.jpg',
  },
  'tm5-s2': {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Working_on_a_planning_session_with_stationery_items%2C_notebook%2C_and_colorful_pencils_on_a_wooden_desk.jpg/1280px-Working_on_a_planning_session_with_stationery_items%2C_notebook%2C_and_colorful_pencils_on_a_wooden_desk.jpg',
    caption: 'Một buổi ngồi lập kế hoạch. Sản phẩm cuối của 90 ngày là Trade Plan hoàn chỉnh và CV có số — hai thứ duy nhất mang đi phỏng vấn được.',
    credit: 'Wikimedia Commons / Shixart1985 (CC BY 2.0)',
    source: 'https://commons.wikimedia.org/wiki/File:Working_on_a_planning_session_with_stationery_items,_notebook,_and_colorful_pencils_on_a_wooden_desk.jpg',
  },
  'tm5-s3': {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Work_and_Travel_Job_Interview.jpg/1280px-Work_and_Travel_Job_Interview.jpg',
    caption: 'Buổi phỏng vấn. Khi bị hỏi về việc chưa có kinh nghiệm Trade, trả lời theo ba tầng: năng lực chuyển giao được, bằng chứng đã tự chuẩn bị, và khoảng trống mình tự biết.',
    credit: 'Wikimedia Commons / ESA Work and Travel (CC BY-SA 4.0)',
    source: 'https://commons.wikimedia.org/wiki/File:Work_and_Travel_Job_Interview.jpg',
  },
};
