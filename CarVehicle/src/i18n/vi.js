const messages = {
    home: {
        eyebrow: 'Trang chủ',
        title: 'CarVehicle',
        lead: 'Mô tả ngắn gọn cho website xe và dịch vụ.',
        actions: {
            products: 'Xem sản phẩm',
            contact: 'Liên hệ'
        },
        cards: {
            highlight: {
                title: 'Danh mục nổi bật',
                body: 'Trình bày các dòng xe và phụ kiện có sẵn.'
            },
            services: {
                title: 'Dịch vụ',
                body: 'Tư vấn mua xe, bảo dưỡng định kỳ, trả góp.'
            },
            promo: {
                title: 'Khuyến mãi',
                body: 'ập nhật các ưu đãi trong tháng và sự kiện.'
            }
        },
        featured: {
            eyebrow: 'Nổi bật',
            title: 'Sản phẩm nổi bật',
            lead: 'Danh sách được chọn lựa từ API để dễ cập nhật theo chiến dịch trong tháng/năm.',
            updatedAt: 'Cập nhật lúc',
            actions: {
                all: 'Xem tất cả sản phẩm'
            },
            states: {
                loading: 'Đang tải sản phẩm nổi bật...',
                error: 'Không thể tải danh sách nổi bật. Vui lòng thử lại.',
                empty: 'Chưa có sản phẩm nổi bật.'
            }
        },
        aboutSection: {
            eyebrow: 'Giới thiệu',
            title: 'Về website',
            lead: 'Thông tin ngắn gọn về dịch vụ, tư vấn và định hướng phát triển.',
            cards: {
                intro: {
                    title: 'Giới thiệu',
                    body: 'CarVehicle là nền tảng giới thiệu sản phẩm xe, dịch vụ hậu mãi và trải nghiệm khách hàng.'
                },
                services: {
                    title: 'Phục vụ',
                    body: 'Hỗ trợ từ tư vấn chọn xe đến đăng ký lái thử, báo giá và chăm sóc sau bán.'
                },
                consulting: {
                    title: 'Tư vấn',
                    body: 'Gợi ý phiên bản phù hợp ngân sách, nhu cầu gia đình/công việc và lộ trình sử dụng.'
                },
                vision: {
                    title: 'Tầm nhìn',
                    body: 'Xây dựng trải nghiệm mua xe minh bạch, hiện đại và cá nhân hoá theo từng khách hàng.'
                },
                mission: {
                    title: 'Sứ mệnh',
                    body: 'Kết nối khách hàng với sản phẩm phù hợp, tối ưu hành trình sở hữu xe từ quan tâm đến sử dụng.'
                }
            }
        }
    },
    about: {
        eyebrow: 'Giới thiệu',
        title: 'Về CarVehicle',
        lead: 'Thương hiệu chuyên về xe, dịch vụ, và trải nghiệm.',
        cards: {
            vision: {
                title: 'Tầm nhìn',
                body: 'Phát triển hệ sinh thái xe thông minh và bền vững.'
            },
            values: {
                title: 'Giá trị cốt lõi',
                body: 'Minh bạch, tâm huyết, và tối ưu trải nghiệm.'
            },
            journey: {
                title: 'Hành trình',
                body: 'Mô tả cột mốc và những thành tựu nổi bật.'
            }
        }
    },
    contact: {
        eyebrow: 'Liên hệ',
        title: 'Kết nối với chúng tôi',
        lead: 'Để lại thông tin, chúng tôi sẽ phản hồi sớm.',
        form: {
            title: 'Gửi tin nhắn cho chúng tôi',
            name: 'Họ và tên',
            namePlaceholder: 'Nguyễn Văn A',
            phone: 'Số điện thoại',
            phonePlaceholder: '0900 000 000',
            email: 'Email',
            emailPlaceholder: 'example@email.com',
            message: 'Nội dung',
            messagePlaceholder: 'Nhập nội dung bạn muốn gửi...',
            submit: 'Gửi ngay',
            successMsg: 'Cảm ơn! Chúng tôi đã nhận được tin nhắn và sẽ liên hệ bạn sớm.'
        },
        info: {
            title: 'Thông tin liên hệ',
            address: '123 Đường Mẫu, Quận 1, TP HCM',
            phone: '0900 000 000',
            email: 'contact@carvehicle.vn',
            hoursTitle: 'Giờ làm việc',
            weekday: 'Thứ 2 - Thứ 6: 08:00 - 18:00',
            saturday: 'Thứ 7: 08:00 - 12:00',
            sunday: 'Chủ nhật: Nghỉ'
        }
    },
    products: {
        eyebrow: 'Danh sách sản phẩm',
        title: 'Danh mục xe',
        lead: 'Hiển thị danh sách xe, phiên bản, và giá.',
        prices: {
            title: 'Bảng giá tham khảo',
            lead: 'Dữ liệu giá lập cho trang bảng giá xe.',
            loading: 'Đang tải dữ liệu...',
            error: 'Không thể tải bảng giá. Vui lòng thử lại.',
            empty: 'Chưa có dữ liệu bảng giá.'
        },
        filter: {
            searchPlaceholder: 'Tìm kiếm tên xe...',
            brand: 'Hãng xe',
            model: 'Dòng xe',
            version: 'Phiên bản',
            priceMax: 'Giá tối đa',
            all: 'Tất cả',
            reset: 'Xóa bộ lọc',
            noResults: 'Không tìm thấy xe phù hợp với bộ lọc.'
        },
        cards: {
            sedan: {
                title: 'Xe sedan',
                body: 'Mô tả ngắn gọn về dòng sedan.'
            },
            suv: {
                title: 'SUV',
                body: 'Mô tả ngắn gọn về dòng SUV.'
            },
            ev: {
                title: 'Xe điện',
                body: 'Mô tả ngắn gọn về dòng xe điện.'
            },
            accessories: {
                title: 'Phụ kiện',
                body: 'Gói phụ kiện và nâng cấp tùy chỉnh.'
            }
        }
    },
    events: {
        eyebrow: 'Sự kiện',
        title: 'Chương trình & ra mắt sản phẩm',
        lead: 'Cập nhật các sự kiện theo tháng/năm để quảng bá sản phẩm và ưu đãi mới.',
        updatedAt: 'Cập nhật lúc',
        cta: {
            default: 'Xem chi tiết'
        },
        states: {
            loading: 'Đang tải sự kiện...',
            error: 'Không thể tải sự kiện. Vui lòng thử lại.',
            empty: 'Hiện chưa có sự kiện mới.'
        }
    },
    eventDetail: {
        back: 'Quay lại sự kiện',
        title: 'Thông tin sự kiện',
        linksTitle: 'Liên kết',
        states: {
            loading: 'Đang tải bài viết...',
            error: 'Không thể tải bài viết. Vui lòng thử lại.'
        }
    }
}

export default messages
