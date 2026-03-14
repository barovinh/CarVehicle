const events = [
  {
    id: 'launch-march-2026-city',
    title: 'Ra mắt Honda City 2026',
    summary:
      'Chương trình ra mắt phiên bản mới trong tháng 03/2026 với trải nghiệm lái thử và ưu đãi đặt cọc sớm.',
    startAt: '2026-03-20T08:30:00+07:00',
    endAt: '2026-03-20T17:30:00+07:00',
    location: 'Showroom CarVehicle - Quận 1, TP HCM',
    highlight: 'Trải nghiệm 3D, lái thử, quà tặng phụ kiện chính hãng.',
    cover: {
      src: '/images/event-cover.svg',
      alt: 'Ảnh minh hoạ sự kiện ra mắt Honda City 2026',
    },
    seo: {
      title: 'Ra mắt Honda City 2026',
      description:
        'Thông tin chương trình ra mắt Honda City 2026: trải nghiệm lái thử, công nghệ an toàn, ưu đãi đặt cọc sớm và các liên kết tham khảo.',
    },
    body: [
      {
        type: 'heading',
        text: 'Điểm nhấn chương trình',
      },
      {
        type: 'paragraph',
        text:
          'Sự kiện tập trung vào trải nghiệm thực tế: lái thử trong phố, cảm nhận vận hành, và tư vấn lựa chọn phiên bản phù hợp. Nội dung trình bày theo dạng bài viết để dễ chia sẻ và tối ưu hiển thị trên công cụ tìm kiếm.',
      },
      {
        type: 'bullets',
        items: [
          'Trải nghiệm lái thử & tư vấn 1-1',
          'Giới thiệu công nghệ an toàn, tiện nghi',
          'Ưu đãi đặt cọc sớm theo số lượng giới hạn',
        ],
      },
      {
        type: 'image',
        src: '/images/event-cover.svg',
        alt: 'Không gian trưng bày và trải nghiệm tại showroom',
        caption: 'Khu vực trưng bày & tư vấn sản phẩm',
      },
      {
        type: 'links',
        title: 'Liên kết tham khảo',
        items: [
          { label: 'Danh sách sản phẩm', to: '/ds-san-pham' },
          { label: 'Liên hệ đặt lịch', to: '/lien-he' },
          { label: 'Thông tin hãng (tham khảo)', href: 'https://www.honda.com' },
        ],
      },
    ],
    cta: {
      label: 'Xem danh sách sản phẩm',
      to: '/ds-san-pham',
    },
  },
  {
    id: 'launch-apr-2026-ev-line',
    title: 'Tháng xe điện - Trải nghiệm công nghệ',
    summary:
      'Chuỗi hoạt động giới thiệu xu hướng xe điện, công nghệ an toàn, và giải pháp sạc tại nhà.',
    startAt: '2026-04-10T09:00:00+07:00',
    endAt: '2026-04-12T18:00:00+07:00',
    location: 'Trung tâm triển lãm (dự kiến)',
    highlight: 'Talkshow, trưng bày, ưu đãi trả góp.',
    cover: {
      src: '/images/event-cover.svg',
      alt: 'Ảnh minh hoạ tháng xe điện',
    },
    seo: {
      title: 'Tháng xe điện - Trải nghiệm công nghệ',
      description:
        'Bài viết sự kiện tháng xe điện: talkshow, trưng bày công nghệ an toàn và giải pháp sạc tại nhà; kèm liên kết tham khảo.',
    },
    body: [
      { type: 'heading', text: 'Chủ đề' },
      {
        type: 'paragraph',
        text:
          'Chuỗi hoạt động theo format “bài viết sự kiện”: mô tả bối cảnh, mục tiêu và các khu trải nghiệm. Phần liên kết giúp người xem truy cập nhanh các trang sản phẩm/dịch vụ liên quan.',
      },
      {
        type: 'bullets',
        items: ['Talkshow: xu hướng xe điện 2026', 'Trưng bày công nghệ: ADAS, pin, sạc', 'Tư vấn trả góp và đổi xe'],
      },
      {
        type: 'links',
        items: [
          { label: 'Danh sách sản phẩm', to: '/ds-san-pham' },
          { label: 'Liên hệ', to: '/lien-he' },
          { label: 'Tìm hiểu xe điện (tham khảo)', href: 'https://www.energy.gov/energysaver/electric-vehicles' },
        ],
      },
    ],
  },
  {
    id: 'promo-may-2026-service',
    title: 'Ngày hội dịch vụ - Bảo dưỡng & chăm sóc xe',
    summary:
      'Ưu đãi kiểm tra xe miễn phí, giảm giá gói bảo dưỡng định kỳ và phụ tùng.',
    startAt: '2026-05-08T08:00:00+07:00',
    endAt: '2026-05-09T17:00:00+07:00',
    location: 'Xưởng dịch vụ CarVehicle',
    highlight: 'Kiểm tra 10 hạng mục, tư vấn kỹ thuật 1-1.',
    cover: {
      src: '/images/event-cover.svg',
      alt: 'Ảnh minh hoạ ngày hội dịch vụ',
    },
    seo: {
      title: 'Ngày hội dịch vụ - Bảo dưỡng & chăm sóc xe',
      description:
        'Bài viết sự kiện ngày hội dịch vụ: ưu đãi kiểm tra xe miễn phí, giảm giá bảo dưỡng định kỳ, phụ tùng và liên kết đặt lịch.',
    },
    body: [
      { type: 'heading', text: 'Nội dung' },
      {
        type: 'paragraph',
        text:
          'Sự kiện hướng tới khách hàng đã/đang sử dụng xe: kiểm tra tình trạng, tư vấn bảo dưỡng theo số km, và ưu đãi gói dịch vụ. Bài viết có hình minh hoạ và các link SEO để dẫn về trang đặt lịch.',
      },
      {
        type: 'bullets',
        items: ['Kiểm tra 10 hạng mục miễn phí', 'Giảm giá gói bảo dưỡng & phụ tùng', 'Tư vấn kỹ thuật 1-1'],
      },
      {
        type: 'links',
        items: [
          { label: 'Liên hệ đặt lịch', to: '/lien-he' },
          { label: 'Danh sách sản phẩm', to: '/ds-san-pham' },
          { label: 'Bảo dưỡng xe (tham khảo)', href: 'https://www.nhtsa.gov/equipment/car-maintenance' },
        ],
      },
    ],
    cta: {
      label: 'Liên hệ đặt lịch',
      to: '/lien-he',
    },
  },
]

export default events
