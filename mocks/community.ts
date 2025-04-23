import { Post, Comment, Message } from '@/types/pet';

export const posts: Post[] = [
    {
        id: '1',
        userId: 'user1',
        userName: 'Nguyễn Văn A',
        userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde',
        content: 'Hôm nay mình vừa đưa bé Mèo đi tiêm phòng. Bé rất ngoan, không kêu khóc gì cả!',
        images: ['https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba'],
        likes: 24,
        comments: 5,
        date: '2023-11-18T10:30:00',
        saved: false,
        liked: true,
    },
    {
        id: '2',
        userId: 'user2',
        userName: 'Trần Thị B',
        userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
        content:
            'Có ai biết địa chỉ phòng khám thú y uy tín ở quận Cầu Giấy không ạ? Mình cần đưa bé chó đi khám gấp.',
        likes: 5,
        comments: 12,
        date: '2023-11-19T08:15:00',
        saved: true,
        liked: false,
    },
    {
        id: '3',
        userId: 'user3',
        userName: 'Lê Văn C',
        userAvatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36',
        content:
            "Chia sẻ với mọi người một số loại thức ăn tốt cho chó con mà mình đã tìm hiểu:\n- Royal Canin\n- Hill's Science Diet\n- Purina Pro Plan\nMọi người có thêm gợi ý gì không?",
        likes: 42,
        comments: 18,
        date: '2023-11-17T14:20:00',
        saved: false,
        liked: true,
    },
    {
        id: '4',
        userId: 'user4',
        userName: 'Phạm Thị D',
        userAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956',
        content:
            'Bé nhà mình mới 2 tháng tuổi. Đây là lần đầu mình nuôi mèo, mọi người có lời khuyên gì cho người mới không ạ?',
        images: ['https://images.unsplash.com/photo-1591871937573-74dbba515c4c'],
        likes: 31,
        comments: 24,
        date: '2023-11-16T19:45:00',
        saved: true,
        liked: true,
    },
    {
        id: '5',
        userId: 'user5',
        userName: 'Hoàng Văn E',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
        content:
            'Cuối tuần vừa rồi mình đã đưa bé cún đi dạo ở công viên Thủ Lệ. Bé rất thích và chạy nhảy không ngừng!',
        images: ['https://images.unsplash.com/photo-1548199973-03cce0bbc87b'],
        likes: 56,
        comments: 8,
        date: '2023-11-15T16:30:00',
        saved: false,
        liked: false,
    },
];

export const comments: Record<string, Comment[]> = {
    '1': [
        {
            id: 'c1',
            postId: '1',
            userId: 'user2',
            userName: 'Trần Thị B',
            userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
            content: 'Bé nhà bạn dễ thương quá! Tiêm ở phòng khám nào vậy?',
            date: '2023-11-18T11:00:00',
            likes: 2,
        },
        {
            id: 'c2',
            postId: '1',
            userId: 'user1',
            userName: 'Nguyễn Văn A',
            userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde',
            content: 'Mình tiêm ở phòng khám Pet Care ở Đống Đa bạn ạ. Bác sĩ ở đó rất nhẹ nhàng.',
            date: '2023-11-18T11:15:00',
            likes: 1,
        },
    ],
    '2': [
        {
            id: 'c3',
            postId: '2',
            userId: 'user3',
            userName: 'Lê Văn C',
            userAvatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36',
            content:
                'Bạn có thể thử phòng khám Pet Health ở ngõ 12 Trần Thái Tông. Mình hay đưa bé nhà mình đến đó, dịch vụ tốt lắm.',
            date: '2023-11-19T08:30:00',
            likes: 3,
        },
        {
            id: 'c4',
            postId: '2',
            userId: 'user5',
            userName: 'Hoàng Văn E',
            userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
            content:
                'Mình gợi ý phòng khám Thú y Hà Nội ở Dịch Vọng. Đội ngũ bác sĩ chuyên môn cao và có nhiều thiết bị hiện đại.',
            date: '2023-11-19T09:00:00',
            likes: 2,
        },
    ],
};

export const messages: Message[] = [
    {
        id: 'm1',
        senderId: 'user1',
        receiverId: 'vet1',
        content:
            'Chào bác sĩ, bé mèo nhà tôi dạo này biếng ăn và hay nằm một chỗ. Tôi nên làm gì ạ?',
        timestamp: '2023-11-19T09:30:00',
        read: true,
    },
    {
        id: 'm2',
        senderId: 'vet1',
        receiverId: 'user1',
        content:
            'Chào bạn, bạn có thể cho tôi biết bé mèo bao nhiêu tuổi và tình trạng này kéo dài bao lâu rồi?',
        timestamp: '2023-11-19T09:35:00',
        read: true,
    },
    {
        id: 'm3',
        senderId: 'user1',
        receiverId: 'vet1',
        content: 'Bé mèo nhà tôi 3 tuổi, và tình trạng này mới xuất hiện khoảng 2 ngày nay ạ.',
        timestamp: '2023-11-19T09:40:00',
        read: true,
    },
    {
        id: 'm4',
        senderId: 'vet1',
        receiverId: 'user1',
        content:
            'Bạn có thể kiểm tra nhiệt độ của bé không? Và bé có biểu hiện nôn mửa hoặc tiêu chảy không?',
        timestamp: '2023-11-19T09:45:00',
        read: true,
    },
    {
        id: 'm5',
        senderId: 'user1',
        receiverId: 'vet1',
        content:
            'Tôi không có nhiệt kế để đo, nhưng bé không có biểu hiện nôn mửa hay tiêu chảy ạ.',
        timestamp: '2023-11-19T09:50:00',
        read: true,
    },
    {
        id: 'm6',
        senderId: 'vet1',
        receiverId: 'user1',
        content:
            'Trong trường hợp này, tôi khuyên bạn nên đưa bé đến phòng khám để kiểm tra trực tiếp. Có thể bé đang gặp vấn đề về tiêu hóa hoặc nhiễm trùng nhẹ. Bạn có thể đến phòng khám của chúng tôi vào lúc nào thuận tiện.',
        timestamp: '2023-11-19T09:55:00',
        read: false,
    },
];
