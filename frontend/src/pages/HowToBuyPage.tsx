import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useTranslate } from '../hooks/useTranslate';

const PageContainer = styled.div`
  padding-top: 2rem;
  min-height: 100vh;
  background: var(--bg-primary);
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Inter', sans-serif;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 2rem;
`;

const StepsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  margin-bottom: 3rem;
  
  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 500px) {
    grid-template-columns: 1fr;
  }
`;

const StepCard = styled.div`
  text-align: center;
  padding: 2rem;
  background: var(--bg-secondary);
  border-radius: 16px;
`;

const StepNumber = styled.div`
  width: 50px;
  height: 50px;
  background: #000;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 auto 1rem;
`;

const StepTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
`;

const StepDesc = styled.p`
  font-size: 0.9rem;
  color: var(--text-secondary);
  line-height: 1.5;
`;

const InfoSection = styled.div`
  background: var(--bg-secondary);
  padding: 2rem;
  border-radius: 16px;
  margin-bottom: 2rem;
`;

const InfoTitle = styled.h2`
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--text-primary);
`;

const InfoList = styled.ul`
  list-style: none;
  padding: 0;
`;

const InfoItem = styled.li`
  padding: 0.8rem 0;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  gap: 1rem;
  color: var(--text-primary);
  
  &:last-child {
    border-bottom: none;
  }
`;

const InfoIcon = styled.span`
  font-size: 1.2rem;
`;

const Button = styled(Link)`
  display: inline-block;
  background: #000;
  color: white;
  padding: 1rem 2rem;
  text-decoration: none;
  border-radius: 30px;
  font-weight: 600;
  transition: background 0.3s;
  
  &:hover {
    background: #333;
  }
`;

const HowToBuyPage: React.FC = () => {
  const { t } = useTranslate();

  return (
    <>
      <Navbar />
      <PageContainer>
        <Container>
          <Title>{t('howToBuy.title')}</Title>
          
          <StepsGrid>
            <StepCard>
              <StepNumber>1</StepNumber>
              <StepTitle>{t('howToBuy.step1')}</StepTitle>
              <StepDesc>{t('howToBuy.step1Desc')}</StepDesc>
            </StepCard>
            
            <StepCard>
              <StepNumber>2</StepNumber>
              <StepTitle>{t('howToBuy.step2')}</StepTitle>
              <StepDesc>{t('howToBuy.step2Desc')}</StepDesc>
            </StepCard>
            
            <StepCard>
              <StepNumber>3</StepNumber>
              <StepTitle>{t('howToBuy.step3')}</StepTitle>
              <StepDesc>{t('howToBuy.step3Desc')}</StepDesc>
            </StepCard>
            
            <StepCard>
              <StepNumber>4</StepNumber>
              <StepTitle>{t('howToBuy.step4')}</StepTitle>
              <StepDesc>{t('howToBuy.step4Desc')}</StepDesc>
            </StepCard>
          </StepsGrid>
          
          <InfoSection>
            <InfoTitle>{t('howToBuy.payment')}</InfoTitle>
            <InfoList>
              <InfoItem><InfoIcon>💳</InfoIcon> {t('howToBuy.paymentCard')}</InfoItem>
              <InfoItem><InfoIcon>💰</InfoIcon> {t('howToBuy.paymentPaypal')}</InfoItem>
              <InfoItem><InfoIcon>📦</InfoIcon> {t('howToBuy.paymentCash')}</InfoItem>
            </InfoList>
          </InfoSection>
          
          <InfoSection>
            <InfoTitle>{t('howToBuy.delivery')}</InfoTitle>
            <InfoList>
              <InfoItem><InfoIcon>📦</InfoIcon> {t('howToBuy.deliveryStandard')}</InfoItem>
              <InfoItem><InfoIcon>⚡</InfoIcon> {t('howToBuy.deliveryExpress')}</InfoItem>
              <InfoItem><InfoIcon>🎁</InfoIcon> {t('howToBuy.deliveryFree')}</InfoItem>
            </InfoList>
          </InfoSection>
          
          <InfoSection>
            <InfoTitle>{t('howToBuy.return')}</InfoTitle>
            <InfoList>
              <InfoItem><InfoIcon>🔄</InfoIcon> {t('howToBuy.returnDays')}</InfoItem>
              <InfoItem><InfoIcon>💰</InfoIcon> {t('howToBuy.returnGuarantee')}</InfoItem>
              <InfoItem><InfoIcon>📦</InfoIcon> {t('howToBuy.returnFree')}</InfoItem>
            </InfoList>
          </InfoSection>
          
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Button to="/products">{t('howToBuy.shopNow')} →</Button>
          </div>
        </Container>
      </PageContainer>
    </>
  );
};

export default HowToBuyPage;
