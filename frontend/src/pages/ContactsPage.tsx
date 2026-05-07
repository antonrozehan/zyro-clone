import React from 'react';
import styled from 'styled-components';
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

const ContactGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ContactInfo = styled.div`
  background: var(--bg-secondary);
  padding: 2rem;
  border-radius: 16px;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: var(--bg-primary);
  border-radius: 12px;
  transition: all 0.3s ease-in-out;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-5px) scale(1.02);
    box-shadow: 0 8px 25px rgba(0,0,0,0.15);
    background: #000;
    
    .info-icon {
      transform: scale(1.1);
    }
    
    .info-title,
    .info-text {
      color: white;
    }
  }
`;

const InfoIcon = styled.div`
  font-size: 1.8rem;
  transition: transform 0.3s ease;
`;

const InfoContent = styled.div`
  flex: 1;
`;

const InfoTitle = styled.h3`
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-bottom: 0.25rem;
  transition: color 0.3s ease;
`;

const InfoText = styled.p`
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--text-primary);
  transition: color 0.3s ease;
`;

const ContactForm = styled.form`
  background: var(--bg-secondary);
  padding: 2rem;
  border-radius: 16px;
`;

const FormTitle = styled.h2`
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: var(--text-primary);
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--text-primary);
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: var(--bg-primary);
  color: var(--text-primary);
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #000;
    transform: scale(1.01);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.8rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: var(--bg-primary);
  color: var(--text-primary);
  font-size: 1rem;
  resize: vertical;
  min-height: 120px;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #000;
    transform: scale(1.01);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 1rem;
  background: #000;
  color: white;
  border: none;
  border-radius: 30px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #333;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

// Социальные ссылки - без фона и кружков
const SocialLinks = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-top: 2rem;
  justify-content: center;
`;

const SocialLink = styled.a`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  
  &:hover {
    transform: translateY(-5px) scale(1.1);
  }
`;

const ContactsPage: React.FC = () => {
  const { t } = useTranslate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(t('contacts.success'));
  };

  // URL для иконок (через backend/media)
  const getImageUrl = (filename: string) => {
    return `http://localhost:8000/media/social/${filename}`;
  };

  return (
    <>
      <Navbar />
      <PageContainer>
        <Container>
          <Title>{t('contacts.title')}</Title>
          
          <ContactGrid>
            <ContactInfo>
              <InfoItem>
                <InfoIcon className="info-icon">📍</InfoIcon>
                <InfoContent>
                  <InfoTitle className="info-title">{t('contacts.address')}</InfoTitle>
                  <InfoText className="info-text">ul. Toruńska 68, 03-225 Warszawa, Poland</InfoText>
                </InfoContent>
              </InfoItem>
              
              <InfoItem>
                <InfoIcon className="info-icon">📞</InfoIcon>
                <InfoContent>
                  <InfoTitle className="info-title">{t('contacts.phone')}</InfoTitle>
                  <InfoText className="info-text">+48 795 033 172</InfoText>
                </InfoContent>
              </InfoItem>
              
              <InfoItem>
                <InfoIcon className="info-icon">✉️</InfoIcon>
                <InfoContent>
                  <InfoTitle className="info-title">{t('contacts.email')}</InfoTitle>
                  <InfoText className="info-text">support@zyro.com</InfoText>
                </InfoContent>
              </InfoItem>
              
              <InfoItem>
                <InfoIcon className="info-icon">⏰</InfoIcon>
                <InfoContent>
                  <InfoTitle className="info-title">{t('contacts.hours')}</InfoTitle>
                  <InfoText className="info-text">Monday - Friday: 9:00 - 18:00<br />Saturday: 10:00 - 14:00</InfoText>
                </InfoContent>
              </InfoItem>
            </ContactInfo>
            
            <ContactForm onSubmit={handleSubmit}>
              <FormTitle>{t('contacts.formTitle')}</FormTitle>
              
              <FormGroup>
                <Label>{t('contacts.name')}</Label>
                <Input type="text" placeholder="John Doe" required />
              </FormGroup>
              
              <FormGroup>
                <Label>{t('contacts.email')}</Label>
                <Input type="email" placeholder="john@example.com" required />
              </FormGroup>
              
              <FormGroup>
                <Label>{t('contacts.subject')}</Label>
                <Input type="text" placeholder="Question about..." required />
              </FormGroup>
              
              <FormGroup>
                <Label>{t('contacts.message')}</Label>
                <TextArea placeholder="Write your message here..." required />
              </FormGroup>
              
              <SubmitButton type="submit">{t('contacts.send')}</SubmitButton>
            </ContactForm>
          </ContactGrid>
          
          <SocialLinks>
            <SocialLink href="#" target="_blank">
              <img src={getImageUrl('facebook.png')} alt="Facebook" />
            </SocialLink>
            <SocialLink href="#" target="_blank">
              <img src={getImageUrl('instagram.png')} alt="Instagram" />
            </SocialLink>
            <SocialLink href="#" target="_blank">
              <img src={getImageUrl('tiktok.png')} alt="TikTok" />
            </SocialLink>
            <SocialLink href="#" target="_blank">
              <img src={getImageUrl('telegram.png')} alt="Telegram" />
            </SocialLink>
          </SocialLinks>
        </Container>
      </PageContainer>
    </>
  );
};

export default ContactsPage;