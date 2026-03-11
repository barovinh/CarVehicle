// Interior image sequences for the 360° interior viewer
// Replace with actual equirectangular panoramic images for best results
const CITY_INTERIOR = [
    'https://hondaotomydinh.vn/wp-content/uploads/2023/06/noi-that-city-1.jpg',
    'https://hondaotomydinh.vn/wp-content/uploads/2023/06/vo-lang-city-3.jpg',
    'https://hondaotomydinh.vn/wp-content/uploads/2023/06/man-hinh-city-2.jpg',
    'https://hondaotomydinh.vn/wp-content/uploads/2023/06/cum-dong-ho-city.jpg',
    'https://hondaotomydinh.vn/wp-content/uploads/2023/06/khong-gian-city.jpg',
    'https://hondaotomydinh.vn/wp-content/uploads/2023/06/hang-ghe-sau-city.jpg',
    'https://hondaotomydinh.vn/wp-content/uploads/2023/06/can-so-city-1.jpg',
    'https://hondaotomydinh.vn/wp-content/uploads/2023/06/dieu-hoa-city-3.jpg',
]

const prices = [
    {
        id: 'city-g',
        brand: 'Honda',
        model: 'City',
        version: 'G',
        price: 559000000,
        image: 'https://cdn.honda.com.vn/automobile-versions/Image360/October2024/1729560073/33.png',
        description: 'Dòng sedan nhỏ gọn, tiết kiệm nhiên liệu, phù hợp di chuyển đô thị hàng ngày.',
        interiorImages: CITY_INTERIOR,
        hoodImage: 'https://hondaotomydinh.vn/wp-content/uploads/2017/06/khoang-dong-co-honda-city-2024.webp',
        trunkImage: 'https://hondaotomydinh.vn/wp-content/uploads/2023/06/cop-xe-city.jpg',
    },
    {
        id: 'city-l',
        brand: 'Honda',
        model: 'City',
        version: 'L',
        price: 589000000,
        image: 'https://cdn.honda.com.vn/automobile-versions/Image360/October2024/1729608819/2.png',
        description: 'Phiên bản cân bằng trang bị và giá, phù hợp gia đình trẻ năng động.',
        interiorImages: CITY_INTERIOR,
        hoodImage: 'https://hondaotomydinh.vn/wp-content/uploads/2017/06/khoang-dong-co-honda-city-2024.webp',
        trunkImage: 'https://hondaotomydinh.vn/wp-content/uploads/2023/06/cop-xe-city.jpg',
    },
    {
        id: 'city-rs',
        brand: 'Honda',
        model: 'City',
        version: 'RS',
        price: 609000000,
        image: 'https://cdn.honda.com.vn/automobile-versions/Image360/October2024/1729608819/2.png',
        description: 'Phong cách thể thao, ngoại thất nổi bật, nội thất hiện đại tinh tế.',
        interiorImages: CITY_INTERIOR,
        hoodImage: 'https://hondaotomydinh.vn/wp-content/uploads/2017/06/khoang-dong-co-honda-city-2024.webp',
        trunkImage: 'https://hondaotomydinh.vn/wp-content/uploads/2023/06/cop-xe-city.jpg',
    },
    {
        id: 'civic-g',
        brand: 'Honda',
        model: 'Civic',
        version: 'G',
        price: 789000000,
        image: 'https://cdn.honda.com.vn/automobile-versions/Image360/October2024/1729560073/33.png',
        description: 'Sedan hạng C, cảm giác lái thể thao, khoang lái rộng rãi thoải mái.'
    },
    {
        id: 'civic-rs',
        brand: 'Honda',
        model: 'Civic',
        version: 'RS',
        price: 999000000,
        image: 'https://cdn.honda.com.vn/automobile-versions/Image360/October2024/1729560073/33.png',
        description: 'Bản cao cấp, thiết kế thể thao mạnh mẽ, nhiều công nghệ an toàn chủ động.'
    },
    {
        id: 'crv-l',
        brand: 'Honda',
        model: 'CR-V',
        version: 'L',
        price: 1129000000,
        image: 'https://cdn.honda.com.vn/automobile-versions/Image360/October2024/1729560073/33.png',
        description: 'SUV 5+2 chỗ cho gia đình, nội thất linh hoạt, dễ dàng di chuyển đường dài.'
    },
    {
        id: 'hrv-g',
        brand: 'Honda',
        model: 'HR-V',
        version: 'G',
        price: 699000000,
        image: 'https://cdn.honda.com.vn/automobile-versions/Image360/October2024/1729560073/33.png',
        description: 'SUV đô thị nhỏ gọn, linh hoạt, tiết kiệm nhiên liệu, thiết kế trẻ trung.'
    },
    {
        id: 'brv-l',
        brand: 'Honda',
        model: 'BR-V',
        version: 'L',
        price: 705000000,
        image: 'https://cdn.honda.com.vn/automobile-versions/Image360/October2024/1729560073/33.png',
        description: 'MPV thực dụng, dành cho gia đình đông người, di chuyển thoải mái mọi cung đường.'
    }
]

export default prices
