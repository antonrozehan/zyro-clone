import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const Card = styled(Link)`
  display: block;
  text-decoration: none;
  background: #f5f5f5;
  border-radius: 16px;
  overflow: hidden;
  transition: transform 0.3s;
  width: 100%;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const ImageContainer = styled.div`
  width: 100%;
  aspect-ratio: 1;
  overflow: hidden;
  background: #e8e8e8;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CategoryImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ImagePlaceholder = styled.div`
  font-size: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

const Content = styled.div`
  padding: 1.5rem;
  text-align: center;
  background: white;
`;

const Title = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #000;
`;

const ShopNow = styled.p`
  color: #0066cc;
  font-weight: 500;
  font-size: 0.9rem;
  margin-top: 0.5rem;
`;

interface CategoryCardProps {
  title: string;
  icon?: string;
  imageUrl?: string;
  type: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ title, icon, imageUrl, type }) => {
  // Если есть URL картинки - используем его
  if (imageUrl) {
    return (
      <Card to={`/products/${type}`}>
        <ImageContainer>
          <CategoryImage src={imageUrl} alt={title} />
        </ImageContainer>
        <Content>
          <Title>{title}</Title>
          <ShopNow>Shop Now →</ShopNow>
        </Content>
      </Card>
    );
  }
  
  // Иначе показываем иконку (старый вариант)
  return (
    <Card to={`/products/${type}`}>
      <ImageContainer>
        <ImagePlaceholder>{icon || '📦'}</ImagePlaceholder>
      </ImageContainer>
      <Content>
        <Title>{title}</Title>
        <ShopNow>Shop Now →</ShopNow>
      </Content>
    </Card>
  );
};

export default CategoryCard;
