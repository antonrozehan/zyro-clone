import React, { useRef } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useCartAnimation } from '../hooks/useCartAnimation';

const Card = styled(Link)`
  text-decoration: none;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
  display: block;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  border: 1px solid #eee;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.1);
  }
`;

const ImageContainer = styled.div`
  aspect-ratio: 1;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  cursor: pointer;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ImagePlaceholder = styled.div`
  font-size: 4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: #f5f5f5;
`;

const Content = styled.div`
  padding: 1rem;
  background: white;
`;

const Title = styled.h3`
  font-size: 1rem;
  font-weight: 500;
  color: #333;
  margin-bottom: 0.5rem;
  line-height: 1.3;
`;

const PriceRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
`;

const Price = styled.span`
  font-size: 1.25rem;
  font-weight: 700;
  color: #000;
`;

const OldPrice = styled.span`
  font-size: 0.9rem;
  color: #999;
  text-decoration: line-through;
`;

const Rating = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
`;

const Stars = styled.div`
  color: #ffc107;
  font-size: 0.85rem;
  letter-spacing: 2px;
`;

const RatingValue = styled.span`
  font-size: 0.8rem;
  color: #666;
`;

const AddButton = styled.button`
  width: 100%;
  padding: 0.5rem;
  background: #000;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.8rem;
  transition: background 0.3s;
  margin-top: 0.5rem;
  
  &:hover {
    background: #333;
  }
`;

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    price: string;
    old_price?: string;
    rating?: number;
    image?: string | null;
  };
}

const renderStars = (rating: number | undefined) => {
  if (!rating || rating < 0) return '☆☆☆☆☆';
  
  const fullStars = Math.floor(rating);
  let stars = '';
  for (let i = 0; i < fullStars; i++) stars += '★';
  for (let i = stars.length; i < 5; i++) stars += '☆';
  
  return stars;
};

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { animateToCart } = useCartAnimation();
  const imageRef = useRef<HTMLDivElement>(null);
  
  const getImageUrl = () => {
    if (product.image) {
      if (product.image.startsWith('http')) return product.image;
      return `http://localhost:8000${product.image}`;
    }
    return null;
  };
  
  const getCartIcon = () => {
    return document.querySelector('[data-cart-icon]') as HTMLElement;
  };
  
  const handleAddToCart = (e: React.MouseEvent) => {
  e.preventDefault();
  e.stopPropagation();
  
  // Анимация полета
  if (imageRef.current) {
    const cartIcon = getCartIcon();
    if (cartIcon) {
      animateToCart(imageRef.current, cartIcon);
    }
  }
  
  // Добавляем в корзину
  addToCart(product);
};
  
  const imageUrl = getImageUrl();
  const safeRating = product.rating && product.rating > 0 ? product.rating : 4.0;
  const displayRating = safeRating.toFixed(1);
  
  return (
    <Card to={`/product/${product.id}`}>
      <ImageContainer ref={imageRef}>
        {imageUrl ? (
          <Image src={imageUrl} alt={product.name} />
        ) : (
          <ImagePlaceholder>🎧</ImagePlaceholder>
        )}
      </ImageContainer>
      <Content>
        <Title>{product.name}</Title>
        <PriceRow>
          <Price>${product.price}</Price>
          {product.old_price && <OldPrice>${product.old_price}</OldPrice>}
        </PriceRow>
        <Rating>
          <Stars>{renderStars(product.rating)}</Stars>
          <RatingValue>({displayRating})</RatingValue>
        </Rating>
        <AddButton onClick={handleAddToCart}>Add to Cart</AddButton>
      </Content>
    </Card>
  );
};

export default ProductCard;
