/**
 * Dải "Tin nóng từ nguồn quốc tế" — kéo trực tiếp từ RSS của các báo chuyên
 * ngành quảng cáo, trả về JSON cho giao diện.
 *
 * VÌ SAO CẦN CHẠY Ở MÁY CHỦ CHỨ KHÔNG GỌI THẲNG TỪ TRÌNH DUYỆT: các báo này
 * không mở CORS, trình duyệt gọi thẳng sẽ bị chặn. Hàm này đứng giữa, gọi hộ
 * rồi trả về cùng tên miền nên không vướng CORS.
 *
 * VÌ SAO KHÔNG CÀI THƯ VIỆN ĐỌC RSS: chỉ cần bốn trường title, link, pubDate và
 * ảnh. Một thư viện phân tích XML đầy đủ là thêm phụ thuộc và thêm bề mặt lỗi
 * cho phần việc mà vài biểu thức chính quy làm xong. Đổi lại phải chấp nhận
 * cách đọc này dễ vỡ nếu báo đổi cấu trúc feed — nên mỗi nguồn được bọc riêng
 * trong try/catch, một nguồn hỏng không kéo sập cả dải tin.
 *
 * BẢN CHẤT DỮ LIỆU: đây là tiêu đề và đoạn dẫn nguyên văn tiếng Anh từ báo
 * nước ngoài, KHÔNG phải bài phân tích đã biên tập. Giao diện phải hiện rõ như
 * vậy để học viên không nhầm với phần bản tin có phân tích tiếng Việt.
 */

const FEEDS = [
  { name: 'PPC Land', url: 'https://ppc.land/rss/', topic: 'Quảng cáo trả phí' },
  { name: 'Search Engine Land', url: 'https://searchengineland.com/feed', topic: 'Tìm kiếm & SEO' },
  { name: 'Social Media Today', url: 'https://www.socialmediatoday.com/feeds/news/', topic: 'Mạng xã hội' },
];

const MAX_PER_FEED = 6;
const MAX_TOTAL = 15;
const FETCH_TIMEOUT_MS = 7000;

/** Gỡ CDATA, thẻ HTML và giải mã các thực thể hay gặp. */
function cleanText(raw) {
  if (!raw) return '';
  return String(raw)
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&#x27;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/\s+/g, ' ')
    .trim();
}

function pickTag(block, tag) {
  const m = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, 'i'));
  return m ? cleanText(m[1]) : '';
}

/**
 * Tìm ảnh của bài trong một mục RSS.
 *
 * Mỗi báo nhét ảnh một kiểu khác nhau, nên phải dò lần lượt qua các dạng phổ
 * biến rồi mới chịu thua. Không lấy được ảnh thì trả về chuỗi rỗng, giao diện
 * tự chuyển sang thẻ chỉ có chữ.
 */
function pickImage(block) {
  const patterns = [
    /<media:content[^>]+url="([^"]+)"/i,
    /<media:thumbnail[^>]+url="([^"]+)"/i,
    /<enclosure[^>]+url="([^"]+)"[^>]*type="image/i,
    /<enclosure[^>]+type="image[^"]*"[^>]*url="([^"]+)"/i,
    /<image[^>]*>[\s\S]*?<url>([^<]+)<\/url>/i,
    /<img[^>]+src="([^"]+)"/i,
  ];
  for (const re of patterns) {
    const m = block.match(re);
    if (m && /^https?:\/\//i.test(m[1])) return m[1];
  }
  return '';
}

/** Đổi pubDate của RSS sang dd/mm/yyyy, trả về rỗng nếu không đọc được. */
function toVnDate(pubDate) {
  const d = new Date(pubDate);
  if (Number.isNaN(d.getTime())) return '';
  const p = (n) => String(n).padStart(2, '0');
  return `${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()}`;
}

async function readFeed(feed) {
  // Vercel cắt hàm ở 10 giây. Ba nguồn chạy song song, mỗi nguồn tự bỏ cuộc sau
  // 7 giây để một báo chậm không làm cả dải tin trắng trơn.
  const stop = AbortSignal.timeout(FETCH_TIMEOUT_MS);
  const res = await fetch(feed.url, {
    signal: stop,
    headers: { 'User-Agent': 'PMarcomAcademy/1.0 (news reader)' },
  });
  if (!res.ok) throw new Error(`${feed.name} trả về ${res.status}`);

  const xml = await res.text();
  const blocks = xml.split(/<item[\s>]/i).slice(1, MAX_PER_FEED + 1);

  return blocks
    .map((block) => {
      const title = pickTag(block, 'title');
      const link = pickTag(block, 'link');
      if (!title || !link) return null;

      const summary = pickTag(block, 'description').slice(0, 260);
      return {
        // Đường dẫn bài gốc CỐ Ý KHÔNG trả về cho trình duyệt. Mục tin tức chỉ
        // tổng hợp và ghi nguồn, không đẩy học viên sang trang ngoài — trang
        // ngoài là môi trường không kiểm soát được. Giữ link ở đây chỉ để làm
        // khoá phân biệt các mục trùng tên, và khoá đó không bao giờ được vẽ ra
        // giao diện dưới dạng thẻ liên kết.
        id: `rss-${link}`,
        title,
        summary,
        image: pickImage(block),
        publishedAt: toVnDate(pickTag(block, 'pubDate')),
        publishedTs: Date.parse(pickTag(block, 'pubDate')) || 0,
        source: feed.name,
        topic: feed.topic,
      };
    })
    .filter(Boolean);
}

export default async function handler(req, res) {
  // Vercel giữ bản trả lời 30 phút và cho phép dùng bản cũ thêm 1 giờ trong lúc
  // làm mới ngầm. Người dùng vì thế gần như không bao giờ phải chờ mạng, và các
  // báo cũng không bị gọi mỗi lần có người mở tab tin tức.
  res.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate=3600');

  const results = await Promise.allSettled(FEEDS.map(readFeed));

  const items = [];
  const failed = [];
  results.forEach((r, i) => {
    if (r.status === 'fulfilled') items.push(...r.value);
    else failed.push(FEEDS[i].name);
  });

  if (items.length === 0) {
    // Không kéo được nguồn nào là sự cố mạng tạm thời, không phải lỗi lập trình.
    // Trả 200 kèm danh sách rỗng để giao diện lặng lẽ ẩn dải tin đi, thay vì
    // bắn lỗi đỏ vào mặt học viên đang học bài.
    return res.status(200).json({ items: [], failed, fetchedAt: Date.now() });
  }

  items.sort((a, b) => b.publishedTs - a.publishedTs);

  return res.status(200).json({
    items: items.slice(0, MAX_TOTAL),
    failed,
    fetchedAt: Date.now(),
  });
}
