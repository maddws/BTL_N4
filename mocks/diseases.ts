export interface Medication {
  name: string;
  description: string;
  dosage?: string;
}

export interface Disease {
  id: string;
  name: string;
  scientificName: string;
  description: string;
  symptoms: string[];
  causes: string;
  treatment: string;
  prevention: string;
  severity: number; // 1-5 scale
  contagious: boolean;
  commonIn: string[]; // dog, cat, etc.
  petType: string[]; // dog, cat, etc.
  medications?: Medication[];
  images?: string[];
}

const diseases: Disease[] = [
  {
    id: '1',
    name: 'Bệnh Care',
    scientificName: 'Canine Parvovirus',
    description: 'Bệnh Care (Parvovirus) là một bệnh truyền nhiễm nguy hiểm ở chó, đặc biệt là chó con. Virus tấn công vào đường tiêu hóa, gây ra các triệu chứng nghiêm trọng và có thể dẫn đến tử vong nếu không được điều trị kịp thời.',
    symptoms: [
      'Tiêu chảy nặng, thường có máu',
      'Nôn mửa',
      'Mất nước',
      'Sốt cao',
      'Mệt mỏi, uể oải',
      'Biếng ăn',
      'Đau bụng'
    ],
    causes: 'Bệnh Care do virus Parvovirus gây ra, lây lan qua phân của chó bị nhiễm bệnh. Virus có thể tồn tại trong môi trường trong thời gian dài và rất khó tiêu diệt. Chó con từ 6 tuần đến 6 tháng tuổi có nguy cơ cao nhất, đặc biệt là những chó chưa được tiêm phòng đầy đủ.',
    treatment: 'Không có thuốc đặc trị cho bệnh Care, điều trị chủ yếu là hỗ trợ và điều trị triệu chứng. Chó bị bệnh cần được nhập viện để được truyền dịch, điều trị chống nôn, kháng sinh để ngăn ngừa nhiễm trùng thứ phát, và chăm sóc đặc biệt. Tỷ lệ sống sót cao nếu được điều trị sớm và đúng cách.',
    prevention: 'Tiêm phòng là biện pháp phòng ngừa hiệu quả nhất. Chó con nên được tiêm phòng Care theo lịch từ 6-8 tuần tuổi và tiêm nhắc lại theo hướng dẫn của bác sĩ thú y. Hạn chế cho chó con tiếp xúc với môi trường bên ngoài và chó lạ cho đến khi hoàn thành đầy đủ các mũi tiêm phòng.',
    severity: 5,
    contagious: true,
    commonIn: ['Chó con', 'Chó chưa tiêm phòng'],
    petType: ['dog'],
    medications: [
      {
        name: 'Dịch truyền',
        description: 'Bù nước và điện giải'
      },
      {
        name: 'Kháng sinh',
        description: 'Ngăn ngừa nhiễm trùng thứ phát'
      },
      {
        name: 'Thuốc chống nôn',
        description: 'Giảm triệu chứng nôn mửa'
      }
    ],
    images: [
      'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=2069&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=2064&auto=format&fit=crop'
    ]
  },
  {
    id: '2',
    name: 'Bệnh Giun sán',
    scientificName: 'Helminthiasis',
    description: 'Bệnh giun sán là tình trạng phổ biến ở chó mèo, do nhiễm các loại ký sinh trùng đường ruột. Có nhiều loại giun sán khác nhau có thể ảnh hưởng đến thú cưng, bao gồm giun tròn, giun móc, giun đũa, và sán dây.',
    symptoms: [
      'Tiêu chảy hoặc phân lỏng',
      'Nôn mửa',
      'Bụng to, phình',
      'Sút cân dù ăn nhiều',
      'Lông xù, không bóng mượt',
      'Kém hoạt động',
      'Có thể thấy giun trong phân hoặc khi nôn'
    ],
    causes: 'Thú cưng thường bị nhiễm giun sán qua việc ăn phải trứng giun từ môi trường, từ sữa mẹ (đối với chó mèo con), hoặc từ vật chủ trung gian như bọ chét. Một số loại giun sán có thể lây từ mẹ sang con ngay từ trong bụng mẹ.',
    treatment: 'Điều trị bằng thuốc tẩy giun phù hợp với loại giun sán mà thú cưng nhiễm phải. Có nhiều loại thuốc tẩy giun khác nhau, bao gồm dạng viên, dạng nhỏ gáy, hoặc dạng tiêm. Cần tuân theo liều lượng và lịch tẩy giun do bác sĩ thú y hướng dẫn.',
    prevention: 'Tẩy giun định kỳ theo lịch (thường là 3-4 tháng/lần đối với chó mèo trưởng thành, và thường xuyên hơn đối với chó mèo con). Giữ vệ sinh môi trường sống, thu gom phân thú cưng kịp thời. Kiểm soát bọ chét và các vật chủ trung gian khác.',
    severity: 3,
    contagious: true,
    commonIn: ['Chó', 'Mèo', 'Đặc biệt là thú cưng con'],
    petType: ['dog', 'cat'],
    medications: [
      {
        name: 'Pyrantel pamoate',
        description: 'Điều trị giun tròn, giun móc'
      },
      {
        name: 'Praziquantel',
        description: 'Điều trị sán dây'
      },
      {
        name: 'Fenbendazole',
        description: 'Thuốc tẩy giun phổ rộng'
      }
    ],
    images: [
      'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=2043&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1573865526739-10659fec78a5?q=80&w=2015&auto=format&fit=crop'
    ]
  },
  {
    id: '3',
    name: 'Bệnh Viêm da',
    scientificName: 'Dermatitis',
    description: 'Viêm da là tình trạng viêm nhiễm ở da, gây ngứa ngáy, khó chịu cho thú cưng. Có nhiều loại viêm da khác nhau, bao gồm viêm da dị ứng, viêm da do nấm, viêm da do ký sinh trùng, và viêm da do vi khuẩn.',
    symptoms: [
      'Ngứa ngáy, liên tục gãi hoặc cắn vào vùng da bị ảnh hưởng',
      'Da đỏ, sưng, nóng',
      'Rụng lông, lông xơ xác',
      'Vảy, đóng vẩy trên da',
      'Mụn nước, mụn mủ',
      'Mùi hôi từ da',
      'Liếm chân quá mức'
    ],
    causes: 'Viêm da có thể do nhiều nguyên nhân, bao gồm dị ứng (thức ăn, phấn hoa, bọ chét), nhiễm nấm (như nấm Malassezia), nhiễm ký sinh trùng (như ghẻ, ve), nhiễm vi khuẩn, hoặc do các vấn đề tự miễn.',
    treatment: 'Điều trị phụ thuộc vào nguyên nhân gây bệnh. Có thể bao gồm thuốc kháng sinh (nếu do vi khuẩn), thuốc kháng nấm (nếu do nấm), thuốc diệt ký sinh trùng (nếu do ghẻ, ve), thuốc kháng histamine hoặc steroid (nếu do dị ứng). Ngoài ra, có thể cần tắm với dầu gội đặc trị và thay đổi chế độ ăn.',
    prevention: 'Kiểm soát ký sinh trùng (bọ chét, ve) bằng các sản phẩm phòng ngừa. Tắm rửa thường xuyên với dầu gội phù hợp. Chế độ ăn cân bằng, bổ sung omega-3 và omega-6 để duy trì da khỏe mạnh. Tránh các chất gây dị ứng đã biết.',
    severity: 3,
    contagious: false,
    commonIn: ['Chó', 'Mèo'],
    petType: ['dog', 'cat'],
    medications: [
      {
        name: 'Prednisolone',
        description: 'Thuốc kháng viêm steroid'
      },
      {
        name: 'Apoquel',
        description: 'Thuốc giảm ngứa không steroid'
      },
      {
        name: 'Shampoo Malaseb',
        description: 'Dầu gội kháng khuẩn, kháng nấm'
      }
    ],
    images: [
      'https://images.unsplash.com/photo-1511044568932-338cba0ad803?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1592754862816-1a21a4ea2281?q=80&w=1974&auto=format&fit=crop'
    ]
  },
  {
    id: '4',
    name: 'Bệnh Viêm tai',
    scientificName: 'Otitis Externa',
    description: 'Viêm tai là tình trạng viêm nhiễm ở ống tai ngoài, rất phổ biến ở chó và mèo. Bệnh gây khó chịu và đau đớn cho thú cưng, nếu không được điều trị kịp thời có thể dẫn đến các biến chứng nghiêm trọng.',
    symptoms: [
      'Gãi tai, lắc đầu liên tục',
      'Đỏ và sưng ở ống tai',
      'Có dịch tiết hoặc mủ trong tai',
      'Mùi hôi từ tai',
      'Đau khi chạm vào tai',
      'Nghiêng đầu về một bên',
      'Mất thăng bằng hoặc đi loạng choạng (trong trường hợp nặng)'
    ],
    causes: 'Viêm tai có thể do nhiều nguyên nhân, bao gồm nhiễm khuẩn (vi khuẩn, nấm), ký sinh trùng (như ve tai), dị ứng, rối loạn tự miễn, hoặc do cấu trúc tai (như tai cụp ở một số giống chó). Độ ẩm cao trong tai cũng là yếu tố thuận lợi cho viêm tai.',
    treatment: 'Làm sạch tai cẩn thận để loại bỏ dịch tiết và mảnh vụn. Sử dụng thuốc nhỏ tai theo chỉ định của bác sĩ thú y, có thể bao gồm kháng sinh, kháng nấm, thuốc kháng viêm, hoặc thuốc diệt ký sinh trùng tùy thuộc vào nguyên nhân. Trong trường hợp nặng, có thể cần điều trị toàn thân hoặc phẫu thuật.',
    prevention: 'Vệ sinh tai thường xuyên với dung dịch làm sạch tai phù hợp. Giữ tai khô ráo, đặc biệt sau khi tắm hoặc bơi. Điều trị dị ứng nếu có. Kiểm tra tai thường xuyên để phát hiện sớm các dấu hiệu bất thường.',
    severity: 3,
    contagious: false,
    commonIn: ['Chó', 'Đặc biệt là giống tai cụp', 'Mèo'],
    petType: ['dog', 'cat'],
    medications: [
      {
        name: 'Otomax',
        description: 'Thuốc nhỏ tai kháng sinh, kháng nấm, kháng viêm'
      },
      {
        name: 'Epi-Otic',
        description: 'Dung dịch làm sạch tai'
      },
      {
        name: 'Acarexx',
        description: 'Thuốc diệt ve tai'
      }
    ],
    images: [
      'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=2064&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?q=80&w=1994&auto=format&fit=crop'
    ]
  },
  {
    id: '5',
    name: 'Bệnh Calicivirus ở mèo',
    scientificName: 'Feline Calicivirus',
    description: 'Calicivirus là một bệnh virus phổ biến ở mèo, gây ra các triệu chứng hô hấp và loét miệng. Đây là một trong những nguyên nhân chính gây bệnh đường hô hấp trên ở mèo.',
    symptoms: [
      'Sốt',
      'Chảy nước mũi và mắt',
      'Hắt hơi và ho',
      'Loét miệng và lưỡi',
      'Chảy nước dãi',
      'Biếng ăn',
      'Khó thở',
      'Viêm khớp (trong một số trường hợp)'
    ],
    causes: 'Bệnh do virus Calicivirus gây ra, lây lan qua tiếp xúc trực tiếp với mèo bị nhiễm bệnh, hoặc gián tiếp qua các vật dụng bị nhiễm virus. Virus có thể tồn tại trong môi trường trong thời gian dài.',
    treatment: 'Không có thuốc đặc trị cho virus, điều trị chủ yếu là hỗ trợ và điều trị triệu chứng. Bao gồm giữ ấm, đảm bảo dinh dưỡng và nước uống, kháng sinh để ngăn ngừa nhiễm trùng thứ phát, và thuốc giảm đau nếu cần. Trong trường hợp nặng, có thể cần nhập viện và truyền dịch.',
    prevention: 'Tiêm phòng là biện pháp phòng ngừa hiệu quả nhất. Mèo nên được tiêm phòng Calicivirus theo lịch từ 6-8 tuần tuổi và tiêm nhắc lại theo hướng dẫn của bác sĩ thú y. Hạn chế tiếp xúc với mèo lạ, đặc biệt là mèo có dấu hiệu bệnh.',
    severity: 4,
    contagious: true,
    commonIn: ['Mèo con', 'Mèo chưa tiêm phòng', 'Mèo sống theo nhóm'],
    petType: ['cat'],
    medications: [
      {
        name: 'Kháng sinh',
        description: 'Ngăn ngừa nhiễm trùng thứ phát'
      },
      {
        name: 'Thuốc giảm đau',
        description: 'Giảm đau do loét miệng'
      },
      {
        name: 'Dịch truyền',
        description: 'Trong trường hợp mất nước'
      }
    ],
    images: [
      'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=2043&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1519052537078-e6302a4968d4?q=80&w=2070&auto=format&fit=crop'
    ]
  }
];

export const getDiseasesByPetType = (petType: string) => {
  return diseases.filter(disease => disease.petType.includes(petType));
};

export const getDiseaseById = (id: string) => {
  return diseases.find(disease => disease.id === id);
};

export default diseases;