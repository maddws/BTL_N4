export interface NutritionInfo {
    id: string;
    petType: 'dog' | 'cat' | 'bird' | 'fish' | 'other';
    title: string;
    description: string;
    recommendations: string[];
    restrictions: string[];
}

export const nutritionInfo: NutritionInfo[] = [
    {
        id: '1',
        petType: 'dog',
        title: 'Dinh dưỡng cho chó',
        description:
            'Chó cần một chế độ ăn cân bằng với protein, chất béo, carbohydrate, vitamin và khoáng chất. Lượng thức ăn phụ thuộc vào kích thước, tuổi tác và mức độ hoạt động của chó.',
        recommendations: [
            'Thịt nạc (gà, bò, cá)',
            'Rau củ (cà rốt, đậu xanh, bí ngô)',
            'Trái cây (táo, chuối)',
            'Ngũ cốc nguyên hạt',
            'Trứng (đã nấu chín)',
            'Sữa chua không đường',
        ],
        restrictions: [
            'Socola và cà phê (chứa theobromine và caffeine)',
            'Nho và nho khô (có thể gây suy thận)',
            'Hành và tỏi (có thể gây thiếu máu)',
            'Xương (nguy cơ mắc nghẹn hoặc thủng ruột)',
            'Thức ăn nhiều muối và gia vị',
            'Rượu và đồ uống có cồn',
        ],
    },
    {
        id: '2',
        petType: 'cat',
        title: 'Dinh dưỡng cho mèo',
        description:
            'Mèo là động vật ăn thịt bắt buộc, cần nhiều protein từ thịt. Chúng cũng cần taurine, một axit amin thiết yếu chỉ có trong mô động vật.',
        recommendations: [
            'Thịt nạc (gà, cá, thịt bò)',
            'Gan (nguồn taurine tốt)',
            'Trứng (đã nấu chín)',
            'Thức ăn mèo chất lượng cao',
            'Dầu cá (tốt cho da và lông)',
        ],
        restrictions: [
            'Sữa (nhiều mèo không dung nạp được lactose)',
            'Socola và cà phê',
            'Hành và tỏi',
            'Gan (quá nhiều có thể gây ngộ độc vitamin A)',
            'Cá sống (có thể chứa ký sinh trùng)',
            'Thức ăn nhiều carbohydrate',
        ],
    },
    {
        id: '3',
        petType: 'bird',
        title: 'Dinh dưỡng cho chim',
        description:
            'Chim cần một chế độ ăn đa dạng bao gồm hạt, trái cây, rau và protein. Nhu cầu dinh dưỡng có thể khác nhau tùy theo loài chim.',
        recommendations: [
            'Hạt chất lượng cao phù hợp với loài',
            'Trái cây tươi (táo, chuối, dâu)',
            'Rau xanh (rau bina, cải xoăn)',
            'Ngũ cốc nấu chín',
            'Trứng luộc (nguồn protein tốt)',
        ],
        restrictions: [
            'Bơ (có thể độc với một số loài chim)',
            'Socola',
            'Cà phê',
            'Muối',
            'Hành và tỏi',
            'Thức ăn nhiều đường',
        ],
    },
    {
        id: '4',
        petType: 'fish',
        title: 'Dinh dưỡng cho cá',
        description:
            'Cá cần thức ăn cân bằng phù hợp với loài cụ thể. Một số là động vật ăn thịt, một số ăn thực vật, và một số ăn tạp.',
        recommendations: [
            'Thức ăn vảy chất lượng cao phù hợp với loài',
            'Thức ăn đông lạnh hoặc sống (cho cá ăn thịt)',
            'Rau xanh (cho cá ăn cỏ)',
            'Thức ăn chìm hoặc nổi tùy theo loài',
        ],
        restrictions: [
            'Cho ăn quá nhiều',
            'Thức ăn không phù hợp với loài',
            'Thức ăn hết hạn hoặc bị hỏng',
            'Thức ăn người không phù hợp',
        ],
    },
];

export const getNutritionInfoByPetType = (petType: string): NutritionInfo | undefined => {
    return nutritionInfo.find((info) => info.petType === petType);
};
