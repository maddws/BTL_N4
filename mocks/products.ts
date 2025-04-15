import { Product } from '@/types/pet';

export const products: Product[] = [
  {
    id: '1',
    name: 'Thức ăn hạt Royal Canin cho mèo',
    description: 'Thức ăn hạt cao cấp dành cho mèo trưởng thành, giúp duy trì sức khỏe tối ưu.',
    price: 350000,
    imageUrl: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119',
    category: 'food',
    rating: 4.8,
    reviews: 120,
    inStock: true
  },
  {
    id: '2',
    name: 'Đồ chơi chuột cho mèo',
    description: 'Đồ chơi hình chuột có chuông, kích thích bản năng săn mồi của mèo.',
    price: 45000,
    imageUrl: 'https://images.unsplash.com/photo-1526336179256-1347bdb255ee',
    category: 'toys',
    rating: 4.5,
    reviews: 85,
    inStock: true
  },
  {
    id: '3',
    name: 'Lược chải lông cho chó',
    description: 'Lược chải lông chuyên dụng, giúp loại bỏ lông rụng và ngăn ngừa rối lông.',
    price: 120000,
    imageUrl: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee',
    category: 'grooming',
    rating: 4.6,
    reviews: 64,
    inStock: true
  },
  {
    id: '4',
    name: 'Thuốc nhỏ gáy trị ve, rận cho chó',
    description: 'Thuốc nhỏ gáy hiệu quả trong việc phòng và trị ve, rận, bọ chét cho chó.',
    price: 180000,
    imageUrl: 'https://images.unsplash.com/photo-1606591199505-4292458945f2',
    category: 'health',
    rating: 4.9,
    reviews: 92,
    inStock: true
  },
  {
    id: '5',
    name: 'Vòng cổ cho chó',
    description: 'Vòng cổ chất liệu da cao cấp, bền đẹp, nhiều kích cỡ phù hợp với mọi giống chó.',
    price: 85000,
    imageUrl: 'https://images.unsplash.com/photo-1567612529009-ded3e1897d74',
    category: 'accessories',
    rating: 4.7,
    reviews: 78,
    inStock: true
  },
  {
    id: '6',
    name: 'Thức ăn hạt Pedigree cho chó',
    description: 'Thức ăn hạt dinh dưỡng dành cho chó trưởng thành, giúp tăng cường sức khỏe.',
    price: 320000,
    imageUrl: 'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd',
    category: 'food',
    rating: 4.6,
    reviews: 105,
    inStock: true
  },
  {
    id: '7',
    name: 'Nhà vệ sinh cho mèo',
    description: 'Nhà vệ sinh kín có nắp đậy, giúp khử mùi hiệu quả và dễ dàng vệ sinh.',
    price: 250000,
    imageUrl: 'https://images.unsplash.com/photo-1555685812-4b8f594e2c56',
    category: 'accessories',
    rating: 4.4,
    reviews: 56,
    inStock: false
  },
  {
    id: '8',
    name: 'Vitamin tổng hợp cho thú cưng',
    description: 'Bổ sung vitamin và khoáng chất cần thiết, tăng cường sức đề kháng cho thú cưng.',
    price: 150000,
    imageUrl: 'https://images.unsplash.com/photo-1512237798647-84b57b22b517',
    category: 'health',
    rating: 4.8,
    reviews: 89,
    inStock: true
  }
];

export const getProductsByCategory = (category: string): Product[] => {
  return products.filter(product => product.category === category);
};

export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};