import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import Navbar from '../components/Navbar';
import { useTranslate } from '../hooks/useTranslate';

const PageContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 4rem 2rem;
  font-family: 'Inter', sans-serif;
  text-align: center;
  min-height: 80vh;
`;

const SuccessIcon = styled.div`
  font-size: 5rem;
  margin-bottom: 1rem;
  animation: bounce 0.5s ease;
  
  @keyframes bounce {
    0% { transform: scale(0.5); opacity: 0; }
    50% { transform: scale(1.2); }
    100% { transform: scale(1); opacity: 1; }
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #4caf50;
  animation: slideIn 0.5s ease;
  
  @keyframes slideIn {
    from { transform: translateY(-20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
`;

const Message = styled.p`
  font-size: 1.1rem;
  color: var(--text-secondary);
  margin-bottom: 2rem;
  animation: fadeIn 0.8s ease;
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const OrderNumber = styled.div`
  background: var(--bg-secondary);
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  color: var(--text-primary);
  animation: slideUp 0.6s ease;
  
  @keyframes slideUp {
    from { transform: translateY(30px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  
  span {
    font-weight: 700;
    color: var(--text-primary);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  animation: fadeIn 1s ease;
`;

const Button = styled(Link)`
  padding: 0.8rem 1.5rem;
  background: #000;
  color: white;
  text-decoration: none;
  border-radius: 30px;
  transition: all 0.3s;
  
  &:hover {
    background: #333;
    transform: scale(1.05);
  }
`;

const SecondaryButton = styled(Link)`
  padding: 0.8rem 1.5rem;
  background: transparent;
  color: var(--text-primary);
  text-decoration: none;
  border-radius: 30px;
  border: 1px solid var(--border-color);
  transition: all 0.3s;
  
  &:hover {
    border-color: #000;
    transform: scale(1.05);
  }
`;

const OrderSuccessPage: React.FC = () => {
  const location = useLocation();
  const { t } = useTranslate();
  const order = location.state?.order;
  
  return (
    <>
      <Navbar />
      <PageContainer>
        <SuccessIcon>🎉</SuccessIcon>
        <Title>{t('orderSuccess.title')}</Title>
        <Message>{t('orderSuccess.message')}</Message>
        
        {order && (
          <OrderNumber>
            {t('orderSuccess.orderNumber')} #{order.id} • ${order.total?.toFixed(2) || '0.00'}
          </OrderNumber>
        )}
        
        <ButtonGroup>
          <Button to="/">{t('orderSuccess.continueShopping')}</Button>
          <SecondaryButton to="/products">{t('orderSuccess.viewProducts')}</SecondaryButton>
        </ButtonGroup>
      </PageContainer>
    </>
  );
};

export default OrderSuccessPage;
