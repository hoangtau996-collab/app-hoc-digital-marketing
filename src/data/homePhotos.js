/**
 * Ảnh chụp thật cho trang chủ Học Viện (HomeLanding), tra theo khoá vị trí.
 *
 * Cùng quy ước với lessonPhotos.js: toàn bộ lấy từ Wikimedia Commons, giấy
 * phép tự do (CC BY / CC BY-SA), ghi công đầy đủ ở trường credit và dẫn về
 * trang gốc ở trường source — hai giấy phép này BẮT BUỘC ghi tác giả, giấy
 * phép và nguồn, nên HomePhoto luôn hiện dòng ghi công đè lên đáy ảnh.
 *
 * Mỗi URL là bản thu nhỏ 960px của Wikimedia, đã kiểm tra trả HTTP 200
 * image/jpeg ngày 2026-10-23. Ảnh nào sau này hỏng thì HomePhoto tự ẩn khung.
 *
 * `caption` dùng làm chữ thay thế (alt) cho trình đọc màn hình: tả đúng cảnh
 * trong ảnh, không gán số liệu hay câu chuyện nào cho ảnh.
 */
export const HOME_PHOTOS = {
  'why-demand': {
    url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1a/Shibuya_scramble_crossing%2C_May_2017.jpg/960px-Shibuya_scramble_crossing%2C_May_2017.jpg",
    caption: "Dòng người đông đúc băng qua giao lộ Shibuya, Tokyo, xung quanh là các tòa nhà phủ kín biển quảng cáo.",
    credit: "Wikimedia Commons / Celuici (CC BY-SA 3.0)",
    source: "https://commons.wikimedia.org/wiki/File:Shibuya_scramble_crossing,_May_2017.jpg"
  },
  'why-trust': {
    url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e6/Apple_Central_World_20200829.jpg/960px-Apple_Central_World_20200829.jpg",
    caption: "Cửa hàng Apple Central World ở Bangkok với mái kính tròn, khách qua lại trên quảng trường phía trước.",
    credit: "Wikimedia Commons / DMS WIKI (CC BY-SA 4.0)",
    source: "https://commons.wikimedia.org/wiki/File:Apple_Central_World_20200829.jpg"
  },
  'why-revenue': {
    url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/26/Big_C_Vietnam_1.jpg/960px-Big_C_Vietnam_1.jpg",
    caption: "Rất đông khách mua sắm chen chúc bên trong một siêu thị Big C tại Việt Nam.",
    credit: "Wikimedia Commons / Groupe Casino (CC BY-SA 3.0)",
    source: "https://commons.wikimedia.org/wiki/File:Big_C_Vietnam_1.jpg"
  },
  'why-strategy': {
    url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3b/Team_workshop.jpg/960px-Team_workshop.jpg",
    caption: "Nhóm làm việc trao đổi ý tưởng bên bảng trắng dán đầy giấy ghi chú nhiều màu.",
    credit: "Wikimedia Commons / UCT MOOCs (CC BY-SA 4.0)",
    source: "https://commons.wikimedia.org/wiki/File:Team_workshop.jpg"
  },
  'compare-traditional': {
    url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/22/Bangkok_Billboards_%2817920256324%29.jpg/960px-Bangkok_Billboards_%2817920256324%29.jpg",
    caption: "Phố Bangkok với các biển quảng cáo cỡ lớn trên mặt tiền tòa nhà, người đi bộ phía dưới.",
    credit: "Wikimedia Commons / Michael Coghlan from Adelaide, Australia (CC BY-SA 2.0)",
    source: "https://commons.wikimedia.org/wiki/File:Bangkok_Billboards_(17920256324).jpg"
  },
  'compare-digital': {
    url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/cf/KL_subway_commuters_-_Flickr_-_Franck_Michel.jpg/960px-KL_subway_commuters_-_Flickr_-_Franck_Michel.jpg",
    caption: "Hành khách trên tàu điện ngầm Kuala Lumpur, nhiều người đang chăm chú nhìn điện thoại.",
    credit: "Wikimedia Commons / Franck Michel from Antibes, France (CC BY 2.0)",
    source: "https://commons.wikimedia.org/wiki/File:KL_subway_commuters_-_Flickr_-_Franck_Michel.jpg"
  },
  'journey-awareness': {
    url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/33/DSCF0698_A_young_woman_checks_her_phone_while_standing_in_a_colorful_night_market_stalls_and_signage_for_grilled_squid_visible_in_the_background.jpg/960px-DSCF0698_A_young_woman_checks_her_phone_while_standing_in_a_colorful_night_market_stalls_and_signage_for_grilled_squid_visible_in_the_background.jpg",
    caption: "Cô gái trẻ xem điện thoại giữa khu chợ đêm rực rỡ biển hiệu và quầy hàng.",
    credit: "Wikimedia Commons / PattayaPatrol (CC BY-SA 4.0)",
    source: "https://commons.wikimedia.org/wiki/File:DSCF0698_A_young_woman_checks_her_phone_while_standing_in_a_colorful_night_market_stalls_and_signage_for_grilled_squid_visible_in_the_background.jpg"
  },
  'journey-interest': {
    url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/df/Student_using_Laptop.jpg/960px-Student_using_Laptop.jpg",
    caption: "Một sinh viên đang ngồi gõ và tìm hiểu thông tin trên máy tính xách tay.",
    credit: "Wikimedia Commons / techsrc2371 (CC BY 2.0)",
    source: "https://commons.wikimedia.org/wiki/File:Student_using_Laptop.jpg"
  },
  'journey-consideration': {
    url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4a/Person_shopping_for_kitchen_items_in_a_store_while_looking_at_bowls_and_towels_on_a_shelf.jpg/960px-Person_shopping_for_kitchen_items_in_a_store_while_looking_at_bowls_and_towels_on_a_shelf.jpg",
    caption: "Khách hàng đứng trước kệ hàng, cầm xem và lựa chọn đồ dùng nhà bếp.",
    credit: "Wikimedia Commons / Shixart1985 (CC BY 2.0)",
    source: "https://commons.wikimedia.org/wiki/File:Person_shopping_for_kitchen_items_in_a_store_while_looking_at_bowls_and_towels_on_a_shelf.jpg"
  },
  'journey-purchase': {
    url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/bf/Cashless-Payment-Devices_CreditCard-and-Code-payment.jpg/960px-Cashless-Payment-Devices_CreditCard-and-Code-payment.jpg",
    caption: "Máy quẹt thẻ và thiết bị quét mã QR để thanh toán không dùng tiền mặt tại quầy.",
    credit: "Wikimedia Commons / RuinDig/Yuki Uchida (CC BY 4.0)",
    source: "https://commons.wikimedia.org/wiki/File:Cashless-Payment-Devices_CreditCard-and-Code-payment.jpg"
  },
  'journey-loyalty': {
    url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2d/Highlands_Coffee_Hanoi_Opera%2C_Hanoi_%286955575086%29.jpg/960px-Highlands_Coffee_Hanoi_Opera%2C_Hanoi_%286955575086%29.jpg",
    caption: "Khách ngồi thư giãn dưới ô dù đỏ tại quán Highlands Coffee gần Nhà hát Lớn Hà Nội.",
    credit: "Wikimedia Commons / David McKelvey from Brisbane, Australia (CC BY 2.0)",
    source: "https://commons.wikimedia.org/wiki/File:Highlands_Coffee_Hanoi_Opera,_Hanoi_(6955575086).jpg"
  }
};
