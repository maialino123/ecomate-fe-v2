export interface TourSection {
    id: string
    title: string
    description: string
    image: string
    imagePosition: 'left' | 'right'
    cta?: {
        text: string
        url: string
    }
}

export const tourSections: TourSection[] = [
    {
        id: 'living-room',
        title: 'Tiện ích mỗi ngày, trong từng căn phòng',
        description: 'Cuộn xuống để khám phá căn hộ Ecomate – nơi mỗi góc nhỏ đều có giải pháp thông minh.',
        image: '/images/snapshot-banner/living-room.png',
        imagePosition: 'right',
    },
    {
        id: 'kitchen',
        title: 'Nhà bếp – gọn gàng & hiệu quả',
        description: 'Móc dán chịu lực, kệ úp chén, bàn chải rửa cốc… mọi thứ đều trong tầm tay.',
        image: '/images/snapshot-banner/kitchen-room.png',
        imagePosition: 'left',
    },
    {
        id: 'bathroom',
        title: 'Phòng tắm – sạch sẽ tiện lợi',
        description: 'Giải pháp dán không khoan tường, khô nhanh, bền bỉ – an tâm sử dụng mỗi ngày.',
        image: '/images/snapshot-banner/bath-room.png',
        imagePosition: 'right',
    },
    {
        id: 'bedroom',
        title: 'Phòng ngủ – yên tĩnh & ngăn nắp',
        description: 'Hộp chứa đồ, kệ mini, đèn ngủ… giúp không gian luôn gọn gàng.',
        image: '/images/snapshot-banner/bed-room.png',
        imagePosition: 'left',
        cta: {
            text: 'Khám phá trên Shopee',
            url: 'https://shopee.vn/ecomate',
        },
    },
]
