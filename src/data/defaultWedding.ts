import { WeddingConfig, WishEntry } from '../types/wedding';

export const DEFAULT_WEDDING_CONFIG: WeddingConfig = {
  groomName: 'Khánh Vinh',
  groomFullName: 'Dư Khánh Vinh',
  brideName: 'Hoàng Mỹ',
  brideFullName: 'Huỳnh Thị Hoàng Mỹ',
  monogram: 'M & V',
  weddingDateISO: '2026-11-29T09:00:00+07:00',
  displayDate: '29 Tháng 11, 2026',
  lunarDisplayDate: 'Nhằm ngày 21 tháng 10 năm Bính Ngọ',
  city: 'Long Hoà, Vĩnh Long',
  heroQuote:
    'Trân trọng báo tin Lễ Thành Hôn của hai con chúng tôi và kính mời Quý gia đình tới dự buổi tiệc rượu chung vui tại Tư gia — Số 124, Ấp Xẻo Ranh, Xã Long Hoà, Tỉnh Vĩnh Long.',
  heroImage: '/assets/web/hero-couple.jpg',
  venueImage: '/assets/web/san-3205.jpg',
  groomParents: {
    father: '',
    mother: 'Bà Thái Thị Cẩm Hồng',
    address: 'Số 124, Ấp Xẻo Ranh, Xã Long Hoà, Tỉnh Vĩnh Long',
  },
  brideParents: {
    father: 'Ông Huỳnh Văn Đủ',
    mother: 'Bà Lê Thị Cam',
    address: 'Ấp Cầu Xây, Xã Tân An, Tỉnh Vĩnh Long',
  },
  brideRank: 'Út nữ',
  groomRank: 'Nhất nam',
  invitationGreeting:
    'Sự hiện diện của Quý khách là niềm vinh hạnh cho gia đình chúng tôi. Rất hân hạnh được đón tiếp!',
  storyChapters: [
    {
      id: 'chapter-1',
      dateLabel: 'Khởi Đầu',
      title: 'Lần Đầu Gặp Gỡ',
      location: 'Sài Gòn',
      description:
        'Giữa nhịp sống hối hả của thành phố, hai ánh nhìn tình cờ chạm nhau và mở ra những cuộc trò chuyện kéo dài bất tận, giản dị mà ấm áp lạ thường.',
      image: '/assets/web/san-2959.jpg',
    },
    {
      id: 'chapter-2',
      dateLabel: 'Đồng Hành',
      title: 'Những Buổi Chiều Nắng Ấm',
      location: 'Bên Nhau Mỗi Ngày',
      description:
        'Cùng nhau đi qua những ngày bình yên lẫn thử thách, học cách lắng nghe, thấu hiểu và trân trọng từng khoảnh khắc nhỏ bé bên hiên nhà đầy nắng.',
      image: '/assets/web/san-3159.jpg',
    },
    {
      id: 'chapter-3',
      dateLabel: 'Hẹn Ước',
      title: 'Lời Nguyện Ước Trăm Năm',
      location: 'Khu Vườn Xanh',
      description:
        'Khoảnh khắc cùng nắm tay đọc lên từng dòng cảm xúc chân thành trong cuốn sổ thề nguyện, hứa sẽ luôn dịu dàng và đồng hành suốt quãng đời còn lại.',
      image: '/assets/web/san-3334.jpg',
    },
    {
      id: 'chapter-4',
      dateLabel: '29 · 11 · 2026',
      title: 'Ngày Chung Đôi',
      location: 'Long Hoà, Vĩnh Long',
      description:
        'Khi tấm voan trắng khẽ buông, mọi lời hứa hẹn hóa thành hiện thực — ngày hai gia đình sum vầy chúc phúc cho hành trình hạnh phúc trọn đời.',
      image: '/assets/web/san-3017.jpg',
    },
  ],
  ceremonies: [
    {
      id: 'thanh-hon',
      label: 'Lễ Thành Hôn',
      subtitle: 'Hôn lễ được tổ chức trang trọng tại Tư gia Nhà Trai',
      dateText: 'Chủ Nhật, 29 Tháng 11, 2026',
      lunarDate: 'Nhằm ngày 21 tháng 10 năm Bính Ngọ',
      timeRange: '09:00',
      venueName: 'Tư Gia — Số 124, Ấp Xẻo Ranh',
      address: 'Số 124, Ấp Xẻo Ranh, Xã Long Hoà, Tỉnh Vĩnh Long',
      mapQuery: '124 Ap Xeo Ranh, Xa Long Hoa, Tinh Vinh Long',
      mapUrl:
        'https://www.google.com/maps/place/KVstore/@9.9745792,106.315776,14z/data=!4m6!3m5!1s0x31a01f0048c11ad3:0x9e5a77530e1aa93d!8m2!3d9.9039212!4d106.4883698!16s%2Fg%2F11xc_220ck?entry=ttu&g_ep=EgoyMDI2MTExOC4xIKXMDSoASAFQAw%3D%3D',
      events: [
        {
          time: '08:30',
          title: 'Đón Họ Nhà Gái & Quan Khách',
          detail: 'Gia đình hai họ gặp gỡ, đón đoàn nhà gái và chuẩn bị nghi lễ gia tiên.',
        },
        {
          time: '09:00',
          title: 'Cử Hành Lễ Thành Hôn',
          detail: 'Chú rể Dư Khánh Vinh & cô dâu Huỳnh Thị Hoàng Mỹ làm lễ gia tiên và chính thức nên duyên vợ chồng.',
        },
        {
          time: '10:30',
          title: 'Trao Quà & Chụp Ảnh Lưu Niệm',
          detail: 'Gia đình hai bên cùng họ hàng lưu giữ những khoảnh khắc sum vầy ấm áp.',
        },
      ],
    },
    {
      id: 'tiec-cuoi',
      label: 'Tiệc Rượu Chung Vui',
      subtitle: 'Trân trọng kính mời Quý gia đình tới dự buổi tiệc rượu chung vui tại Tư gia',
      dateText: 'Chủ Nhật, 29 Tháng 11, 2026',
      lunarDate: 'Nhằm ngày 21 tháng 10 năm Bính Ngọ',
      timeRange: 'Từ 13:00',
      venueName: 'Tư Gia — Số 124, Ấp Xẻo Ranh',
      address: 'Số 124, Ấp Xẻo Ranh, Xã Long Hoà, Tỉnh Vĩnh Long',
      mapQuery: '124 Ap Xeo Ranh, Xa Long Hoa, Tinh Vinh Long',
      mapUrl:
        'https://www.google.com/maps/place/KVstore/@9.9745792,106.315776,14z/data=!4m6!3m5!1s0x31a01f0048c11ad3:0x9e5a77530e1aa93d!8m2!3d9.9039212!4d106.4883698!16s%2Fg%2F11xc_220ck?entry=ttu&g_ep=EgoyMDI2MTExOC4xIKXMDSoASAFQAw%3D%3D',
      events: [
        {
          time: '13:00',
          title: 'Đón Khách & Khai Tiệc Chung Vui',
          detail: 'Bà Thái Thị Cẩm Hồng cùng gia đình hân hoan đón tiếp Quý gia đình và bạn bè thân hữu.',
        },
        {
          time: '13:30',
          title: 'Nghi Thức Ra Mắt & Nâng Ly Chúc Mừng',
          detail: 'Cô dâu Huỳnh Thị Hoàng Mỹ & chú rể Dư Khánh Vinh ra mắt quan khách và nâng ly cảm tạ.',
        },
        {
          time: '14:30',
          title: 'Giao Lưu Âm Nhạc & Chia Sẻ Niềm Vui',
          detail: 'Không gian tiệc rượu thân mật, rộn rã tiếng cười và những lời chúc phúc trăm năm.',
        },
      ],
    },
    {
      id: 'vu-quy',
      label: 'Nhà Gái (Tân An)',
      subtitle: 'Tư gia Ông Huỳnh Văn Đủ & Bà Lê Thị Cam',
      dateText: 'Chủ Nhật, 29 Tháng 11, 2026',
      lunarDate: 'Nhằm ngày 21 tháng 10 năm Bính Ngọ',
      timeRange: 'Buổi Sáng · 29.11.2026',
      venueName: 'Tư Gia Nhà Gái',
      address: 'Ấp Cầu Xây, Xã Tân An, Tỉnh Vĩnh Long',
      mapQuery: 'Ap Cau Xay, Xa Tan An, Tinh Vinh Long',
      events: [
        {
          time: 'Sáng',
          title: 'Nghi Lễ Gia Tiên Nhà Gái',
          detail: 'Ông Huỳnh Văn Đủ & Bà Lê Thị Cam làm lễ xuất giá cho út nữ Huỳnh Thị Hoàng Mỹ.',
        },
        {
          time: '08:00',
          title: 'Khởi Hành Sang Tư Gia Nhà Trai',
          detail: 'Đoàn nhà gái di chuyển sang Số 124, Ấp Xẻo Ranh, Xã Long Hoà để kịp giờ cử hành hôn lễ lúc 09:00.',
        },
      ],
    },
  ],
  gallery: [
    {
      id: 'g-1',
      src: '/assets/web/san-3017.jpg',
      caption: 'Dưới Tấm Voan Cưới',
      location: 'Khoảnh Khắc Thiêng Liêng',
      aspect: 'portrait',
    },
    {
      id: 'g-2',
      src: '/assets/web/san-2935.jpg',
      caption: 'Sắc Trắng Tinh Khôi',
      location: 'Studio',
      aspect: 'portrait',
    },
    {
      id: 'g-3',
      src: '/assets/web/san-2965.jpg',
      caption: 'Ánh Nhìn Trao Nhau',
      location: 'Studio',
      aspect: 'portrait',
    },
    {
      id: 'g-4',
      src: '/assets/web/san-3159.jpg',
      caption: 'Góc Hiên Nắng Chiều',
      location: 'Ngoại Cảnh',
      aspect: 'portrait',
    },
    {
      id: 'g-5',
      src: '/assets/web/san-3205.jpg',
      caption: 'Nắm Tay Thật Chặt',
      location: 'Kiến Trúc Vòm',
      aspect: 'portrait',
    },
    {
      id: 'g-6',
      src: '/assets/web/san-3222.jpg',
      caption: 'Niềm Vui Rạng Rỡ',
      location: 'Ngoại Cảnh',
      aspect: 'portrait',
    },
    {
      id: 'g-7',
      src: '/assets/web/san-3362.jpg',
      caption: 'Lời Thề Nguyện Dưới Trời Xanh',
      location: 'Sân Vườn',
      aspect: 'portrait',
    },
    {
      id: 'g-8',
      src: '/assets/web/san-3383.jpg',
      caption: 'Tung Bay Khăn Voan',
      location: 'Sân Vườn',
      aspect: 'portrait',
    },
  ],
  dressCode: {
    title: 'Trang Phục Dự Tiệc',
    note: 'Để bức ảnh kỷ niệm thêm phần hài hòa, chúng mình gợi ý trang phục tông màu trang nhã, thanh lịch.',
    swatches: [
      { name: 'Trắng Ngà', hex: '#F5F0E6' },
      { name: 'Champagne', hex: '#D8C7AF' },
      { name: 'Đỏ Rượu Vang', hex: '#88292F' },
      { name: 'Đen Cổ Điển', hex: '#262322' },
    ],
  },
  bankAccounts: [
    {
      role: 'Mừng Cưới Chú Rể',
      ownerName: 'DU KHANH VINH',
      bankName: 'VietinBank',
      accountNumber: '107868380513',
      branch: 'CN Trà Vinh - PGD Nguyễn Đáng',
    },
    {
      role: 'Mừng Cưới Cô Dâu',
      ownerName: 'HUYNH THI HOANG MY',
      bankName: 'Agribank',
      accountNumber: '7409215069365',
      branch: 'Chi nhánh H. Châu Thành - Trà Vinh',
    },
  ],
};

export const DEFAULT_WISHES: WishEntry[] = [
  {
    id: 'w-1',
    author: 'Gia Đình Anh Minh & Chị Thảo',
    relation: 'Bạn thân',
    message:
      'Chúc mừng Hoàng Mỹ và Khánh Vinh chính thức về chung một nhà. Chúc hai bạn luôn giữ được nụ cười rạng rỡ và sự bình yên như ngày đầu bên nhau.',
    createdAt: '2 ngày trước',
    hearts: 14,
  },
  {
    id: 'w-2',
    author: 'Cô Lan & Chú Hải',
    relation: 'Họ hàng thân hữu',
    message:
      'Trăm năm tình viên mãn, bạc đầu nghĩa phu thê. Hẹn gặp gia đình mình vào 9h sáng Chủ Nhật 29/11 tại Ấp Xẻo Ranh, Long Hoà, Vĩnh Long nhé!',
    createdAt: '5 ngày trước',
    hearts: 21,
  },
  {
    id: 'w-3',
    author: 'Hội Bạn Thân Vĩnh Long',
    relation: 'Bạn bè thân thiết',
    message:
      'Bộ ảnh cưới của Mỹ & Vinh xinh xuất sắc luôn! Hẹn 13h chiều 29/11 chung vui hết mình cùng hai bạn tại Long Hoà nha.',
    createdAt: '1 tuần trước',
    hearts: 18,
  },
];
