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
  category: string; // e.g., 'Tiêu hóa', 'Da liễu', etc.
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
    category:"Tất cả",
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
    category:"Tất cả",
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
    category:"Tất cả",
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
    category:"Tất cả",
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
    category:"Tất cả",
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
  },
  {
    id: '6',
    name: 'Viêm dạ dày – ruột cấp tính',
    scientificName: 'Acute Gastroenteritis',
    description: 'Là tình trạng viêm nhiễm niêm mạc dạ dày và ruột, thường gặp ở chó mèo do ăn phải thức ăn bẩn, độc hoặc thay đổi khẩu phần đột ngột.',
    symptoms: [
      'Nôn mửa',
      'Tiêu chảy',
      'Chán ăn',
      'Sốt nhẹ',
      'Mệt mỏi'
    ],
    causes: 'Do virus, vi khuẩn, ký sinh trùng hoặc thay đổi thức ăn đột ngột. Cũng có thể do ăn phải vật thể lạ, chất hóa học.',
    treatment: 'Nhịn ăn 12–24 giờ để dạ dày nghỉ ngơi, sau đó cho ăn thức ăn dễ tiêu. Có thể cần thuốc chống nôn, kháng sinh, và truyền dịch nếu mất nước.',
    prevention: 'Không cho thú cưng ăn đồ ăn thừa, ôi thiu. Chuyển đổi khẩu phần từ từ. Giữ vệ sinh bát ăn và môi trường sống.',
    severity: 2,
    contagious: false,
    commonIn: ['Chó', 'Mèo', 'Đặc biệt là thú cưng con'],
    petType: ['dog', 'cat'],
    category: 'Tiêu hóa',
    medications: [
      { name: 'Metronidazole', description: 'Kháng sinh, chống tiêu chảy do vi khuẩn' },
      { name: 'Ondansetron', description: 'Thuốc chống nôn' },
      { name: 'Dịch truyền', description: 'Bù nước và điện giải nếu mất nước' }
    ],
    images: [
      'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=2043&auto=format&fit=crop'
    ]
  },
  {
    id: '7',
    name: 'Viêm tụy cấp',
    scientificName: 'Acute Pancreatitis',
    description: 'Viêm tụy cấp là tình trạng tuyến tụy bị viêm do ăn thức ăn nhiều dầu mỡ hoặc do rối loạn chuyển hóa, gây đau đớn nghiêm trọng.',
    symptoms: [
      'Nôn mửa liên tục',
      'Đau bụng dữ dội',
      'Sốt',
      'Mệt mỏi',
      'Chán ăn',
      'Tiêu chảy'
    ],
    causes: 'Chủ yếu do ăn thức ăn nhiều chất béo, rối loạn lipid máu, hoặc do bệnh nội tiết như Cushing.',
    treatment: 'Cần điều trị nội trú với truyền dịch, thuốc giảm đau, chống nôn và thay đổi khẩu phần ăn ít béo. Có thể cần xét nghiệm máu và siêu âm.',
    prevention: 'Tránh cho ăn thức ăn dầu mỡ, duy trì cân nặng hợp lý và kiểm tra sức khỏe định kỳ.',
    severity: 4,
    contagious: false,
    commonIn: ['Chó trưởng thành', 'Chó béo phì'],
    petType: ['dog'],
    category: 'Tiêu hóa',
    medications: [
      { name: 'Maropitant', description: 'Thuốc chống nôn' },
      { name: 'Buprenorphine', description: 'Giảm đau' },
      { name: 'Ringer Lactate', description: 'Dịch truyền tĩnh mạch' }
    ],
    images: [
      'https://images.unsplash.com/photo-1585241936938-ffb7f52b8681?q=80&w=2064&auto=format&fit=crop'
    ]
  },

  // Bệnh 3: Tiêu chảy do thay đổi thức ăn
  {
    id: '8',
    name: 'Tiêu chảy do thay đổi thức ăn',
    scientificName: 'Diet-Induced Diarrhea',
    description: 'Tiêu chảy do thay đổi khẩu phần xảy ra khi thức ăn mới được giới thiệu quá đột ngột khiến hệ tiêu hóa không thích nghi kịp.',
    symptoms: [
      'Phân lỏng hoặc nhầy',
      'Đi ngoài nhiều lần',
      'Đôi khi có mùi hôi hơn bình thường',
      'Ăn uống vẫn bình thường'
    ],
    causes: 'Do thay đổi khẩu phần quá nhanh, hệ vi sinh đường ruột chưa thích nghi với loại thức ăn mới.',
    treatment: 'Chuyển đổi thức ăn dần dần trong 7–10 ngày. Có thể dùng men tiêu hóa hoặc thuốc cầm tiêu chảy nhẹ nếu cần.',
    prevention: 'Thay đổi khẩu phần từ từ. Kết hợp thức ăn mới và cũ theo tỷ lệ tăng dần.',
    severity: 1,
    contagious: false,
    commonIn: ['Chó', 'Mèo mới đổi thức ăn'],
    petType: ['dog', 'cat'],
    category: 'Tiêu hóa',
    medications: [
      { name: 'Probiotics', description: 'Cân bằng hệ vi sinh đường ruột' },
      { name: 'Smecta', description: 'Hấp phụ độc tố nhẹ trong ruột' }
    ],
    images: [
      'https://images.unsplash.com/photo-1601758123927-196edb9fdef3?q=80&w=2064&auto=format&fit=crop'
    ]
  },

  // Bệnh 4: Táo bón mãn tính
  {
    id: '9',
    name: 'Táo bón mãn tính',
    scientificName: 'Chronic Constipation',
    description: 'Táo bón mãn tính là tình trạng phân khô và tích tụ lâu ngày trong ruột, gây khó khăn hoặc đau đớn khi đi vệ sinh.',
    symptoms: [
      'Đi ngoài ít hoặc không đi',
      'Phân khô, cứng',
      'Chán ăn',
      'Buồn nôn',
      'Khó chịu hoặc rên khi đi vệ sinh'
    ],
    causes: 'Thiếu nước, thiếu chất xơ, lười vận động, hoặc mắc bệnh lý nền như tắc nghẽn ruột hoặc tổn thương thần kinh.',
    treatment: 'Tăng cường chất xơ, bổ sung nước, có thể dùng thuốc làm mềm phân hoặc thuốc nhuận tràng. Trường hợp nặng có thể cần can thiệp y tế.',
    prevention: 'Chế độ ăn cân bằng, uống đủ nước, vận động đều đặn.',
    severity: 2,
    contagious: false,
    commonIn: ['Mèo già', 'Mèo ít vận động'],
    petType: ['cat'],
    category: 'Tiêu hóa',
    medications: [
      { name: 'Lactulose', description: 'Thuốc làm mềm phân' },
      { name: 'Dầu parafin', description: 'Bôi trơn đường ruột' }
    ],
    images: [
      'https://images.unsplash.com/photo-1585241936938-ffb7f52b8681?q=80&w=2064&auto=format&fit=crop'
    ]
  },
  {
    id: '10',
    name: 'Viêm da dị ứng',
    scientificName: 'Atopic Dermatitis',
    description: 'Viêm da dị ứng là tình trạng da bị viêm do phản ứng quá mẫn với các yếu tố như phấn hoa, thức ăn, hoặc môi trường.',
    symptoms: [
      'Ngứa ngáy dữ dội',
      'Liếm chân hoặc cắn gãi liên tục',
      'Da đỏ và dày lên',
      'Lông rụng ở vùng bị ảnh hưởng',
      'Có vảy hoặc chảy dịch'
    ],
    causes: 'Do cơ địa dị ứng với các yếu tố như phấn hoa, bụi nhà, nấm mốc, hoặc protein trong thực phẩm.',
    treatment: 'Điều trị bằng thuốc kháng histamine, steroid, và tránh tiếp xúc với tác nhân dị ứng. Có thể cần thay đổi chế độ ăn.',
    prevention: 'Giữ nhà cửa sạch sẽ, hạn chế các tác nhân dị ứng, tắm rửa định kỳ bằng dầu gội chuyên biệt.',
    severity: 3,
    contagious: false,
    commonIn: ['Chó', 'Mèo dị ứng'],
    petType: ['dog', 'cat'],
    category: 'Da liễu',
    medications: [
      { name: 'Apoquel', description: 'Giảm ngứa không steroid' },
      { name: 'Prednisone', description: 'Chống viêm steroid' },
      { name: 'Omega-3', description: 'Hỗ trợ da khỏe mạnh' }
    ],
    images: [
      'https://images.unsplash.com/photo-1619983081554-fd922c451fe6?q=80&w=2064&auto=format&fit=crop'
    ]
  },

  {
    id: '11',
    name: 'Nấm da',
    scientificName: 'Dermatophytosis (Ringworm)',
    description: 'Nấm da là bệnh truyền nhiễm do nấm gây ra, làm xuất hiện những mảng da tròn, không lông, bong tróc.',
    symptoms: [
      'Vùng da tròn trụi lông',
      'Ngứa nhẹ',
      'Da đỏ hoặc sạm màu',
      'Vảy trắng quanh vùng nhiễm'
    ],
    causes: 'Do các loại nấm như Microsporum hoặc Trichophyton lây qua tiếp xúc trực tiếp hoặc qua vật dụng dùng chung.',
    treatment: 'Tắm thuốc kháng nấm, bôi thuốc đặc trị và trong trường hợp nặng có thể dùng thuốc uống.',
    prevention: 'Cách ly thú cưng nhiễm bệnh, vệ sinh chăn màn và đồ dùng kỹ lưỡng.',
    severity: 3,
    contagious: true,
    commonIn: ['Mèo con', 'Chó con'],
    petType: ['dog', 'cat'],
    category: 'Da liễu',
    medications: [
      { name: 'Itraconazole', description: 'Thuốc kháng nấm dạng uống' },
      { name: 'Thuốc bôi miconazole', description: 'Kháng nấm tại chỗ' },
      { name: 'Shampoo Nizoral', description: 'Dầu gội kháng nấm' }
    ],
    images: [
      'https://images.unsplash.com/photo-1582114604321-d9c6f0b7ae1b?q=80&w=2064&auto=format&fit=crop'
    ]
  },

  {
    id: '12',
    name: 'Ghẻ sarcoptes',
    scientificName: 'Sarcoptic Mange',
    description: 'Ghẻ sarcoptes là bệnh da do ký sinh trùng Sarcoptes scabiei gây ra, cực kỳ ngứa và dễ lây.',
    symptoms: [
      'Ngứa dữ dội',
      'Rụng lông thành mảng',
      'Da đóng vảy, dày lên',
      'Có thể xuất hiện vết trầy xước do gãi nhiều'
    ],
    causes: 'Do ve ghẻ Sarcoptes xâm nhập vào da và đào hầm dưới lớp biểu bì.',
    treatment: 'Tắm thuốc diệt ký sinh trùng, sử dụng thuốc bôi hoặc tiêm theo phác đồ. Khử trùng nơi ở.',
    prevention: 'Vệ sinh định kỳ nơi ở, kiểm tra định kỳ da lông thú cưng.',
    severity: 4,
    contagious: true,
    commonIn: ['Chó hoang', 'Chó ở nơi đông đúc'],
    petType: ['dog'],
    category: 'Da liễu',
    medications: [
      { name: 'Selamectin', description: 'Diệt ghẻ và ký sinh ngoài da' },
      { name: 'Lime sulfur dip', description: 'Thuốc ngâm diệt ghẻ' }
    ],
    images: [
      'https://images.unsplash.com/photo-1620947814896-32095e1c0eac?q=80&w=2064&auto=format&fit=crop'
    ]
  },
  {
    id: '13',
    name: 'Viêm phế quản ở chó',
    scientificName: 'Canine Bronchitis',
    description: 'Viêm phế quản là tình trạng viêm đường hô hấp dưới gây ho mãn tính, thường gặp ở chó lớn tuổi hoặc sống trong môi trường ô nhiễm.',
    symptoms: [
      'Ho khan kéo dài',
      'Thở khò khè',
      'Khó thở sau vận động',
      'Hắt hơi nhẹ',
      'Mệt mỏi'
    ],
    causes: 'Do nhiễm vi khuẩn, virus hoặc dị ứng môi trường như bụi, khói thuốc.',
    treatment: 'Thuốc giãn phế quản, kháng sinh nếu có bội nhiễm, giữ môi trường sống sạch sẽ.',
    prevention: 'Tránh khói bụi, hạn chế tiếp xúc với thú cưng mắc bệnh đường hô hấp.',
    severity: 3,
    contagious: false,
    commonIn: ['Chó lớn tuổi'],
    petType: ['dog'],
    category: 'Hô hấp',
    medications: [
      { name: 'Doxycycline', description: 'Kháng sinh phổ rộng' },
      { name: 'Theophylline', description: 'Thuốc giãn phế quản' }
    ],
    images: [
      'https://images.unsplash.com/photo-1564694202779-bc908c327862?q=80&w=2064&auto=format&fit=crop'
    ]
  },

  {
    id: '14',
    name: 'Cúm mèo (Feline Viral Rhinotracheitis)',
    scientificName: 'Feline Herpesvirus-1',
    description: 'Là bệnh hô hấp cấp tính ở mèo do virus herpes gây ra, đặc biệt nguy hiểm với mèo con.',
    symptoms: [
      'Hắt hơi liên tục',
      'Chảy nước mũi, nước mắt',
      'Sốt nhẹ đến cao',
      'Biếng ăn',
      'Viêm kết mạc, loét giác mạc'
    ],
    causes: 'Do virus FHV-1 gây ra, lây lan qua dịch tiết hô hấp hoặc tiếp xúc trực tiếp.',
    treatment: 'Chăm sóc hỗ trợ, giữ ấm, bổ sung nước, có thể dùng kháng sinh chống nhiễm trùng thứ phát.',
    prevention: 'Tiêm phòng định kỳ và cách ly mèo bệnh.',
    severity: 4,
    contagious: true,
    commonIn: ['Mèo con', 'Mèo trong trại'],
    petType: ['cat'],
    category: 'Hô hấp',
    medications: [
      { name: 'L-lysine', description: 'Ức chế virus herpes' },
      { name: 'Kháng sinh hỗ trợ', description: 'Ngăn nhiễm trùng thứ phát' }
    ],
    images: [
      'https://images.unsplash.com/photo-1619981991977-7c52763fd9e1?q=80&w=2064&auto=format&fit=crop'
    ]
  },

  // === CÁC BỆNH KÝ SINH TRÙNG ===
  {
    id: '15',
    name: 'Nhiễm ve tai',
    scientificName: 'Otodectic Mange (Ear Mites)',
    description: 'Là tình trạng nhiễm ký sinh trùng Otodectes cynotis trong tai, gây ngứa ngáy và viêm tai.',
    symptoms: [
      'Gãi tai liên tục',
      'Lắc đầu',
      'Dịch đen như bã cà phê trong tai',
      'Có mùi hôi tai'
    ],
    causes: 'Do ve tai lây lan qua tiếp xúc trực tiếp giữa thú cưng.',
    treatment: 'Thuốc nhỏ tai, vệ sinh tai định kỳ, có thể cần thuốc toàn thân.',
    prevention: 'Không cho thú cưng khỏe mạnh tiếp xúc với thú nhiễm bệnh, vệ sinh chăn màn.',
    severity: 2,
    contagious: true,
    commonIn: ['Mèo', 'Chó nhỏ'],
    petType: ['dog', 'cat'],
    category: 'Ký sinh trùng',
    medications: [
      { name: 'Ivermectin', description: 'Diệt ve tai' },
      { name: 'Epi-Otic', description: 'Dung dịch làm sạch tai' }
    ],
    images: [
      'https://images.unsplash.com/photo-1571748982814-2f2f95b6c9fc?q=80&w=2064&auto=format&fit=crop'
    ]
  },

  {
    id: '16',
    name: 'Nhiễm bọ chét',
    scientificName: 'Flea Infestation',
    description: 'Bọ chét ký sinh ngoài da, hút máu gây ngứa, dị ứng, thậm chí thiếu máu nếu nhiễm nặng.',
    symptoms: [
      'Ngứa ngáy dữ dội',
      'Rụng lông theo mảng',
      'Có thể thấy bọ chét di chuyển trên lông',
      'Dị ứng da (FAD) ở một số thú cưng'
    ],
    causes: 'Tiếp xúc với bọ chét từ môi trường hoặc thú cưng khác.',
    treatment: 'Sử dụng thuốc nhỏ gáy, xịt hoặc tắm thuốc diệt bọ chét. Cần xử lý cả môi trường.',
    prevention: 'Dùng thuốc phòng ngừa định kỳ, vệ sinh nơi ở.',
    severity: 3,
    contagious: true,
    commonIn: ['Chó', 'Mèo'],
    petType: ['dog', 'cat'],
    category: 'Ký sinh trùng',
    medications: [
      { name: 'Fipronil', description: 'Thuốc nhỏ gáy diệt bọ chét' },
      { name: 'Imidacloprid', description: 'Hoạt chất phổ biến trong thuốc nhỏ gáy' }
    ],
    images: [
      'https://images.unsplash.com/photo-1619981573525-88b1cb1fd3f9?q=80&w=2064&auto=format&fit=crop'
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