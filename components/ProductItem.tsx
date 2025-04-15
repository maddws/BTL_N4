import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Star, ShoppingCart, ExternalLink } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { Product } from '@/types/pet';
import { useShopStore } from '@/store/shop-store';
import { useRouter } from 'expo-router';

interface ProductItemProps {
  product: Product;
  onPress: () => void;
}

export default function ProductItem({ product, onPress }: ProductItemProps) {
  const { addToCart } = useShopStore();
  const router = useRouter();

  const handleAddToCart = () => {
    addToCart(product.id);
  };

  const handleBuyNow = () => {
    addToCart(product.id);
    router.push('/cart');
  };

  // Format price
  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "đ";
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.9}>
      <Image source={{ uri: product.imageUrl }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={2}>{product.name}</Text>
        <View style={styles.ratingContainer}>
          <Star size={12} color={Colors.warning} fill={Colors.warning} />
          <Text style={styles.rating}>{product.rating.toFixed(1)}</Text>
          <Text style={styles.reviews}>({product.reviews})</Text>
        </View>
        <Text style={styles.price}>{formatPrice(product.price)}</Text>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.cartButton, !product.inStock && styles.disabledButton]} 
            onPress={handleAddToCart}
            disabled={!product.inStock}
          >
            <ShoppingCart size={14} color={Colors.card} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.buyButton, !product.inStock && styles.disabledButton]} 
            onPress={handleBuyNow}
            disabled={!product.inStock}
          >
            <Text style={styles.buyButtonText}>Mua ngay</Text>
            <ExternalLink size={14} color={Colors.card} />
          </TouchableOpacity>
        </View>
        
        {!product.inStock && (
          <Text style={styles.outOfStock}>Hết hàng</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    overflow: 'hidden',
    width: '48%',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 120,
  },
  content: {
    padding: 12,
  },
  name: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
    height: 40,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  rating: {
    fontSize: 12,
    color: Colors.text,
    marginLeft: 4,
  },
  reviews: {
    fontSize: 12,
    color: Colors.textLight,
    marginLeft: 2,
  },
  price: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
    marginTop: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 8,
  },
  cartButton: {
    backgroundColor: Colors.primary,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buyButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: Colors.primary,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 6,
    gap: 4,
  },
  buyButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.card,
  },
  disabledButton: {
    backgroundColor: Colors.textLight,
  },
  outOfStock: {
    fontSize: 12,
    color: Colors.error,
    marginTop: 4,
  },
});