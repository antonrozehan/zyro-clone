import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';
import { useTranslate } from '../hooks/useTranslate';

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Inter', sans-serif;
  min-height: 80vh;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 2rem;
  color: var(--text-primary);
`;

const EmptyCart = styled.div`
  text-align: center;
  padding: 4rem;
  
  h2 {
    font-size: 1.5rem;
    color: var(--text-secondary);
    margin-bottom: 1rem;
  }
  
  p {
    color: var(--text-secondary);
    margin-bottom: 2rem;
  }
`;

const ShopButton = styled(Link)`
  background: #000;
  color: white;
  padding: 0.8rem 2rem;
  text-decoration: none;
  border-radius: 30px;
  display: inline-block;
  
  &:hover {
    background: #333;
  }
`;

const ContinueShoppingLink = styled(Link)`
  display: inline-block;
  margin-bottom: 2rem;
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 0.9rem;
  
  &:hover {
    color: var(--text-primary);
    text-decoration: underline;
  }
`;

const CartTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  text-align: left;
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
  color: var(--text-secondary);
  font-weight: 500;
`;

const Td = styled.td`
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
  vertical-align: middle;
`;

const ProductImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  background: var(--bg-secondary);
`;

const ProductName = styled(Link)`
  text-decoration: none;
  color: var(--text-primary);
  font-weight: 500;
  
  &:hover {
    text-decoration: underline;
  }
`;

const QuantityInput = styled.input`
  width: 60px;
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  text-align: center;
  background: var(--bg-primary);
  color: var(--text-primary);
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: #ff4444;
  cursor: pointer;
  font-size: 1.2rem;
  
  &:hover {
    color: #cc0000;
  }
`;

const TotalRow = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 2rem 1rem;
  border-top: 2px solid var(--border-color);
  margin-top: 1rem;
`;

const TotalText = styled.div`
  font-size: 1.2rem;
  color: var(--text-primary);
  
  span {
    font-weight: 700;
    font-size: 1.5rem;
    color: var(--text-primary);
    margin-left: 1rem;
  }
`;

const CheckoutButton = styled.button`
  background: #000;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 30px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin-left: 2rem;
  
  &:hover {
    background: #333;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
`;

const ClearButton = styled.button`
  background: none;
  border: 1px solid var(--border-color);
  padding: 1rem 2rem;
  border-radius: 30px;
  cursor: pointer;
  color: var(--text-primary);
  
  &:hover {
    background: var(--bg-secondary);
  }
`;

// Компонент корзины уже оптимизирован (данные из контекста, нет задержек)
const CartPage: React.FC = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, getTotalPrice, getTotalItems } = useCart();
  const navigate = useNavigate();
  const { t } = useTranslate();

  const getImageUrl = (image: string | null | undefined) => {
    if (image) {
      if (image.startsWith('http')) return image;
      return `http://localhost:8000${image}`;
    }
    return null;
  };

  if (cartItems.length === 0) {
    return (
      <>
        <Navbar />
        <PageContainer>
          <Title>{t('cart.title')}</Title>
          <EmptyCart>
            <h2>{t('cart.empty')}</h2>
            <p>{t('cart.emptyDesc')}</p>
            <ShopButton to="/">{t('cart.continue')}</ShopButton>
          </EmptyCart>
        </PageContainer>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <PageContainer>
        <ContinueShoppingLink to="/">← {t('cart.continue')}</ContinueShoppingLink>
        
        <Title>{t('cart.title')} ({getTotalItems()} {t('cart.items')})</Title>
        
        <CartTable>
          <thead>
            <tr>
              <Th>{t('cart.product')}</Th>
              <Th>{t('cart.name')}</Th>
              <Th>{t('cart.price')}</Th>
              <Th>{t('cart.quantity')}</Th>
              <Th>{t('cart.total')}</Th>
              <Th></Th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item) => {
              const imageUrl = getImageUrl(item.image);
              const itemTotal = item.price * item.quantity;
              
              return (
                <tr key={item.id}>
                  <Td>
                    <ProductImage 
                      src={imageUrl || 'https://via.placeholder.com/80x80?text=No+Image'} 
                      alt={item.name}
                      loading="lazy"
                    />
                  </Td>
                  <Td>
                    <ProductName to={`/product/${item.id}`}>
                      {item.name}
                    </ProductName>
                  </Td>
                  <Td>${item.price.toFixed(2)}</Td>
                  <Td>
                    <QuantityInput 
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                    />
                  </Td>
                  <Td>${itemTotal.toFixed(2)}</Td>
                  <Td>
                    <RemoveButton onClick={() => removeFromCart(item.id)}>
                      ✕
                    </RemoveButton>
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </CartTable>
        
        <TotalRow>
          <TotalText>
            {t('cart.total')}: <span>${getTotalPrice().toFixed(2)}</span>
          </TotalText>
        </TotalRow>
        
        <ButtonGroup>
          <ClearButton onClick={clearCart}>
            {t('cart.clear')}
          </ClearButton>
          <CheckoutButton onClick={() => navigate('/checkout')}>
            {t('cart.checkout')}
          </CheckoutButton>
        </ButtonGroup>
      </PageContainer>
    </>
  );
};

export default CartPage;